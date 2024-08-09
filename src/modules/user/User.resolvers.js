import { GCPLogger } from "npm-gcp-logging";
import { GCPBigquery } from "npm-gcp-bigquery";
import { serializeError } from "serialize-error";

export default {
  Query: {
    user: async (parent, { id }, context) => {
      try {
        var sql =
          "SELECT * FROM `" +
          context.PULSE_DATASET +
          ".user_info` WHERE id = '" +
          id + "'";
        await GCPLogger.logEntry(
            context.GCP_LOGGING_PROJECT_ID,
            context.LOGGING_TOKEN,
            context.LOG_NAME,
            [
              {
                severity: "INFO",
                jsonPayload: {
                  sql: sql,
                  message: "User query executing",
                },
              },
            ]
          );

          var res = await GCPBigquery.query(
            context.PULSE_DATABASE_PROJECT_ID,
            context.DATABASE_TOKEN,
            sql
          );

          await GCPLogger.logEntry(
            context.GCP_LOGGING_PROJECT_ID,
            context.LOGGING_TOKEN,
            context.LOG_NAME,
            [
              {
                severity: "INFO",
                jsonPayload: {
                  res: res
                },
              },
            ]
          );
        if (res.length > 0) {
          return res;
        } else {
            var keypair = await crypto.subtle.generateKey(
                {
                  name: "RSA-OAEP",
                  modulusLength: 4096,
                  publicExponent: new Uint8Array([1, 0, 1]),
                  hash: "SHA-256",
                },
                true,
                ["encrypt", "decrypt"]
              );
          
              var publicKey = await crypto.subtle.exportKey("jwk", keypair.publicKey);
          
              var privateKey = await crypto.subtle.exportKey("jwk", keypair.privateKey);
          
              var sql = "insert into " + context.PULSE_DATASET + ".user_info (id, preferences, private_key, public_key, updated_at) values ('" +
                  id +
                  "', JSON '" +
                  JSON.stringify({}) +
                  "', JSON '" +
                  JSON.stringify(privateKey) +
                  "', JSON '" +
                  JSON.stringify(publicKey) +
                  "', CURRENT_TIMESTAMP())";

              await GCPLogger.logEntry(
                context.GCP_LOGGING_PROJECT_ID,
                context.LOGGING_TOKEN,
                context.LOG_NAME,
                [
                  {
                    severity: "INFO",
                    jsonPayload: {
                      sql: sql,
                      message: "User insert query executing",
                    },
                  },
                ]
              );

              var res = await GCPBigquery.query(
                context.PULSE_DATABASE_PROJECT_ID,
                context.DATABASE_TOKEN,
                sql
              );
              return res;
        }
      } catch (e) {
        const responseError = serializeError(e);
        await GCPLogger.logEntry(
          context.GCP_LOGGING_PROJECT_ID,
          context.LOGGING_TOKEN,
          context.LOG_NAME,
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
      }
    },
  },
  Mutation: {
    updateUserPreferences: async (parent, args, context) => {},
  },
};
