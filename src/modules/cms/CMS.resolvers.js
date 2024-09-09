import { GCPBigquery } from "npm-gcp-bigquery";
import { serializeError } from "serialize-error";
import { default as LogUtility } from "../../utils/LoggingUtility.js";
import { default as SQL } from "./SQL.js";

export default {
  Query: {
    contentByKey: async (parent, args, context) => {
      try {
        return await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          SQL.content_by_key_query_sql(context, args)
        );
      } catch (error) {
        await LogUtility.logEntry(context, [
          {
            severity: "ERROR",
            jsonPayload: serializeError(error)
          },
        ]);
      }
    },
  },
  Mutation: {
    createContent: async (parent, args, context) => {
      try {
        return await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          SQL.create_content_query_sql(context, args)
        );
      } catch (error) {
        await LogUtility.logEntry(context, [
          {
            severity: "ERROR",
            jsonPayload: serializeError(error)
          },
        ]);
      }
    },
  },
};
