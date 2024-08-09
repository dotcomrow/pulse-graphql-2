import { GCPLogger } from "npm-gcp-logging";

export default {
  async logEntry(context, entries) {
    var finalEntries = [];
    console.debug(context.spanId);
    for (var entry of entries) {
      entry.spanId = context.spanId;
      finalEntries.push(entry);
      console.debug(entry);
    }
    await GCPLogger.logEntry(
      context.GCP_LOGGING_PROJECT_ID,
      context.LOGGING_TOKEN,
      context.LOG_NAME,
      finalEntries
    );
  }
}
