import { GCPLogger } from "npm-gcp-logging";
import { Plugin } from 'graphql-yoga'

export default {
  async logEntry(context, entries) {
    var finalEntries = [];
    for (var entry of entries) {
      entry.spanId = context.SpanId;
      entry.labels = {
        environment: context.ENVIRONMENT,
        spanId: context.SpanId,
      }
      finalEntries.push(entry);
    }
    await GCPLogger.logEntry(
      context.GCP_LOGGING_PROJECT_ID,
      context.LOGGING_TOKEN,
      context.LOG_NAME,
      finalEntries
    );
  },

  async addSpanId() {
    return {
      onResponse({ request, serverContext, response }) {
        response.headers.set('SpanId', serverContext.SpanId);
      }
    }
  }
}
