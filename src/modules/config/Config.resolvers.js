import { GCPBigquery } from "npm-gcp-bigquery";
import { serializeError } from "serialize-error";
import { default as LogUtility } from "../../utils/LoggingUtility.js";
import { default as SQL } from "./SQL.js";

export default {
  Query: {
    getAllConfig: async (parent, args, context) => {
      try {
        return await GCPBigquery.query(
            context.PULSE_DATABASE_PROJECT_ID,
            context.DATABASE_TOKEN,
            SQL.all_config_query_sql(context)
        );
      } catch (error) {
        const responseError = serializeError(error);
        await LogUtility.logEntry(context, [
          {
            severity: "ERROR",
            jsonPayload: {
              responseError,
            },
          },
        ]);
      }
    },
    getConfigByName: async (parent, args, context) => {
      try {
        return await GCPBigquery.query(
            context.PULSE_DATABASE_PROJECT_ID,
            context.DATABASE_TOKEN,
            SQL.config_by_name_query_sql(context, args.config_name)
        );
      } catch (error) {
        const responseError = serializeError(error);
        await LogUtility.logEntry(context, [
          {
            severity: "ERROR",
            jsonPayload: {
              responseError,
            },
          },
        ]);
      }
    },
  },
  Config : {
    config_value: async (parent) => {
      return parent.config_value;
    },
    config_name: async (parent) => {
      return parent.config_name;
    },
    updatedAt: async (parent) => {
      return parent.updatedAt;
    },
  }
};
