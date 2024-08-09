import { createYoga, createSchema } from "graphql-yoga";
import { serializeError } from "serialize-error";
import resolvers from "./resolvers/resolvers.js";
import loadFileFromBucket from "./schema/loadFileFromBucket.js";
import { buildClientSchema, printSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { GCPLogger } from "npm-gcp-logging";
import { GCPAccessToken } from "npm-gcp-token";
import { default as AuthenticationUtility } from "./utils/AuthenticationUtility.js";
import { default as LogUtility } from "../../utils/LoggingUtility.js";

var schema = undefined;
var yoga = undefined;

export default {
  async fetch(request, env, ctx) {
    self.location = new URL("https://www.google.com");

    var logging_token = (await new GCPAccessToken(env.GCP_LOGGING_CREDENTIALS).getAccessToken("https://www.googleapis.com/auth/logging.write")).access_token;
    var database_token = (await new GCPAccessToken(env.GCP_BIGQUERY_CREDENTIALS).getAccessToken("https://www.googleapis.com/auth/bigquery")).access_token;

    var yoga_ctx = Object.assign({}, env);
    yoga_ctx['DATABASE_TOKEN'] = database_token;
    yoga_ctx['LOGGING_TOKEN'] = logging_token;
    if (request.headers.get("Authorization"))
      yoga_ctx['account'] = await AuthenticationUtility.fetchAccountInfo(request.headers.get("Authorization").split(" ")[1]);

    if (!request.headers.get("SpanId"))
      yoga_ctx['SpanId'] = crypto.randomUUID();
    
    if (!schema) {
      var schemaString = await loadFileFromBucket(env, "graphql_schema.json");
      await LogUtility.logEntry(context, [
        {
          severity: "INFO",
          jsonPayload: {
            schema: schemaString,
          },
        },
      ]);
      var schemaObj = buildClientSchema(JSON.parse(schemaString));
      var sdlString = printSchema(schemaObj);

      schema = makeExecutableSchema({
        typeDefs: sdlString,
        resolvers: resolvers.resolvers,
        context: env,
      });
    }

    if (!yoga) {
      yoga = createYoga({
        schema,
        context: yoga_ctx,
        logging: "debug",
        cors: {
          origin: env.CORS_DOMAINS,
          credentials: true,
          methods: ["POST"],
        },
      });
    }

    try {
      return yoga(request, yoga_ctx);
    } catch (e) {
      const responseError = serializeError(e);
      var logging_token = await new GCPAccessToken(
        env.GCP_LOGGING_CREDENTIALS
      ).getAccessToken("https://www.googleapis.com/auth/logging.write");
      await GCPLogger.logEntry(
        env.GCP_LOGGING_PROJECT_ID,
        logging_token.access_token,
        env.LOG_NAME,
        [
          {
            severity: "ERROR",
            // textPayload: message,
            jsonPayload: {
              responseError,
            },
          },
        ]
      );
      return new Response(JSON.stringify(responseError), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },
};
