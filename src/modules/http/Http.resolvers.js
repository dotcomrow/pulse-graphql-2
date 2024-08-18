import { GCPBigquery } from "npm-gcp-bigquery";
import { serializeError } from "serialize-error";
import { default as LogUtility } from "../../utils/LoggingUtility.js";
import { default as SQL } from "./SQL.js";

export default {
  Query: {
    requests: async (parent, args, context) => {
      try {
        if (context["account"] == undefined) {
          return null;
        }
        var id = context["account"]["id"];

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              sql: SQL.request_query_sql(context, id),
              message: "Request query executing",
            },
          },
        ]);

        var res = await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          SQL.request_query_sql(context, id)
        );

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              message: "results",
              res: res,
            },
          },
        ]);

        return res;
      } catch (err) {
        await LogUtility.logEntry(context, [
          {
            severity: "ERROR",
            jsonPayload: {
              message: "Request query failed",
              error: serializeError(err),
            },
          },
        ]);
        return null;
      }
    },
    requestById: async (parent, args, context) => {
      try {
        if (context["account"] == undefined) {
          return null;
        }
        var id = context["account"]["id"];

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              sql: SQL.request_query_by_id_sql(context, args.id),
              message: "Request by ID query executing",
            },
          },
        ]);

        var res = await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          SQL.request_query_by_id_sql(context, args.id)
        );

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              message: "results",
              res: res,
            },
          },
        ]);

        return res;
      } catch (err) {
        await LogUtility.logEntry(context, [
          {
            severity: "ERROR",
            jsonPayload: {
              message: "Request by ID query failed",
              error: serializeError(err),
            },
          },
        ]);
        return null;
      }
    },
  },
};
