import { GCPBigquery } from "npm-gcp-bigquery";
import { serializeError } from "serialize-error";
import { default as LogUtility } from "../../utils/LoggingUtility.js";
import { default as SQL } from "./SQL.js";

export default {
  Query: {
    user: async (parent, args, context) => {
      try {
        if (context["account"] == undefined) {
          return null;
        }
        var id = context["account"]["id"];

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              sql: SQL.user_query_sql(context, id),
              message: "User query executing",
            },
          },
        ]);

        var res = await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          SQL.user_query_sql(context, id)
        );

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              res: res,
            },
          },
        ]);

        if (res.length > 0) {
          return res[0];
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

          var publicKey = await crypto.subtle.exportKey(
            "jwk",
            keypair.publicKey
          );

          var privateKey = await crypto.subtle.exportKey(
            "jwk",
            keypair.privateKey
          );

          await LogUtility.logEntry(context, [
            {
              severity: "DEBUG",
              jsonPayload: {
                sql: SQL.insert_sql_new(context, id, privateKey, publicKey),
                message: "User insert query executing",
              },
            },
          ]);

          await GCPBigquery.query(
            context.PULSE_DATABASE_PROJECT_ID,
            context.DATABASE_TOKEN,
            SQL.insert_sql_new(context, id, privateKey, publicKey)
          );

          var res = await GCPBigquery.query(
            context.PULSE_DATABASE_PROJECT_ID,
            context.DATABASE_TOKEN,
            SQL.user_query_sql(context, id)
          );
          return res[0];
        }
      } catch (e) {
        const responseError = serializeError(e);
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
  Preferences: {
    key: async (parent) => {
      return JSON.parse(parent.v).key;
    },
    value: async (parent) => {
      return JSON.parse(parent.v).value;
    },
  },
  Mutation: {
    updateUserPreferences: async (parent, args, context) => {
      try {
        if (context["account"] == undefined) {
          return null;
        }
        var id = context["account"]["id"];
        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              sql: SQL.user_query_sql(context, id),
              message: "User query executing",
            },
          },
        ]);

        var res = await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          SQL.user_query_sql(context, id)
        );

        await LogUtility.logEntry(context, [
          {
            severity: "DEBUG",
            jsonPayload: {
              res: res,
            },
          },
        ]);

        if (res.length > 0) {
          var preferences = res[0].preferences;
          await LogUtility.logEntry(context, [
            {
              severity: "DEBUG",
              jsonPayload: {
                message: "search preferences keys",
                preferences: preferences
              },
            },
          ]);
          
          var newArray = [];
          preferences.forEach((element) => {
            var el = JSON.parse(element.v);
            if (el.key != args.preferences.key) {
              newArray.push({
                key: el.key,
                value: el.value
              });
            } else {
              newArray.push({
                key: args.preferences.key,
                value: args.preferences.value
              });
            }
          });

          preferences = newArray;
          await LogUtility.logEntry(context, [
            {
              severity: "DEBUG",
              jsonPayload: {
                message: "after preferences update",
                preferences: preferences
              },
            },
          ]);

          await LogUtility.logEntry(context, [
            {
              severity: "DEBUG",
              jsonPayload: {
                sql: SQL.update_sql(context, id, preferences),
                message: "User update query executing",
                arguments: args
              },
            },
          ]);

          await GCPBigquery.query(
            context.PULSE_DATABASE_PROJECT_ID,
            context.DATABASE_TOKEN,
            SQL.update_sql(context, id, preferences)
          );

          var res = await GCPBigquery.query(
            context.PULSE_DATABASE_PROJECT_ID,
            context.DATABASE_TOKEN,
            SQL.user_query_sql(context, id)
          );
          return res[0];
        } else {
          return null;
        }
      } catch (e) {
        const responseError = serializeError(e);
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
};
