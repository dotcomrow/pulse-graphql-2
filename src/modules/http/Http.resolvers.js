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
  Mutation: {
    createRequest: async (parent, args, context) => {
      try {
        if (context["account"] == undefined) {
          return null;
        }
        var id = context["account"]["id"];
        var request = args.request;
        request.account_id = id;

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              sql: SQL.insert_request_sql(context, request),
              message: "Request insert executing",
            },
          },
        ]);

        var res = await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          SQL.insert_request_sql(context, request)
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
              message: "Request insert failed",
              error: serializeError(err),
            },
          },
        ]);
        return null;
      }
    },
    updateRequest: async (parent, args, context) => {
      try {
        if (context["account"] == undefined) {
          return null;
        }
        var id = context["account"]["id"];
        var request = args.request;

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              sql: SQL.update_request_sql(context, request),
              message: "Request update executing",
            },
          },
        ]);

        var res = await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          SQL.update_request_sql(context, request)
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
              message: "Request update failed",
              error: serializeError(err),
            },
          },
        ]);
        return null;
      }
    },
    deleteRequest: async (parent, args, context) => {
      try {
        if (context["account"] == undefined) {
          return null;
        }
        var id = context["account"]["id"];

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              sql: SQL.delete_request_sql(context, args.id),
              message: "Request delete executing",
            },
          },
        ]);

        var res = await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          SQL.delete_request_sql(context, args.id)
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
              message: "Request delete failed",
              error: serializeError(err),
            },
          },
        ]);
        return null;
      }
    },
  },
  Headers: {
    header_name: async (parent) => {
      return JSON.parse(parent.v).key;
    },
    header_value: async (parent) => {
      return JSON.parse(parent.v).value;
    },
  },
  Body: {
    element_name: async (parent) => {
      return JSON.parse(parent.v).key;
    },
    element_value: async (parent) => {
      return JSON.parse(parent.v).value;
    },
  },
  QueryParams: {
    query_name: async (parent) => {
      return JSON.parse(parent.v).key;
    },
    query_value: async (parent) => {
      return JSON.parse(parent.v).value;
    },
  },
};
