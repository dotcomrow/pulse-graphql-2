import { GCPBigquery } from "npm-gcp-bigquery";
import { serializeError } from "serialize-error";
import { default as LogUtility } from "../../utils/LoggingUtility.js";

export default {
  Query: {
    user: async (parent, args, context) => {
      try {
        if (context["account"] == undefined) {
          return new Error("Account not found / token invalid.");
        }
        var id = context["account"]["id"];
        var user_query_sql =
          "SELECT * FROM `" +
          context.PULSE_DATASET +
          ".user_info` WHERE id = '" +
          id +
          "'";
        await LogUtility.logEntry(context, [
          {
            severity: "INFO",
            jsonPayload: {
              sql: user_query_sql,
              message: "User query executing",
            },
          },
        ]);

        var res = await GCPBigquery.query(
          context.PULSE_DATABASE_PROJECT_ID,
          context.DATABASE_TOKEN,
          user_query_sql
        );

        await LogUtility.logEntry(context, [
          {
            severity: "INFO",
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

          var sql =
            "insert into " +
            context.PULSE_DATASET +
            ".user_info (id, preferences, private_key, public_key, updated_at) values ('" +
            id +
            "', JSON '" +
            JSON.stringify({
              darkMode: false,
              systemSetting: false,
            }) +
            "', JSON '" +
            JSON.stringify(privateKey) +
            "', JSON '" +
            JSON.stringify(publicKey) +
            "', CURRENT_TIMESTAMP())";

            await LogUtility.logEntry(context, [
            {
              severity: "INFO",
              jsonPayload: {
                sql: sql,
                message: "User insert query executing",
              },
            },
          ]);

          await GCPBigquery.query(
            context.PULSE_DATABASE_PROJECT_ID,
            context.DATABASE_TOKEN,
            sql
          );

          var res = await GCPBigquery.query(
            context.PULSE_DATABASE_PROJECT_ID,
            context.DATABASE_TOKEN,
            user_query_sql
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
    darkMode: async (parent, args, context) => {
      return JSON.parse(parent).darkMode;
    },
    systemSetting: async (parent, args, context) => {
      return JSON.parse(parent).systemSetting;
    },
  },
  Mutation: {
    updateUserPreferences: async (parent, args, context) => {},
  },
};
