export default {
  content_by_key_query_sql: function (context, args) {
    return `SELECT * FROM ${context.PULSE_DATASET}.content WHERE key = '${args.key}'`;
  },
  create_content_query_sql: function (context, args) {
    return `INSERT INTO \`${context.PULSE_DATABASE_PROJECT_ID}.${context.PULSE_DATABASE_DATASET_ID}.content\` (content_id, content_type, content_title, content_body, content_status, created_by, created_at, updated_by, updated_at) VALUES ('${args.content_id}', '${args.content_type}', '${args.content_title}', '${args.content_body}', '${args.content_status}', '${context.account.id}', CURRENT_TIMESTAMP(), '${context.account.id}', CURRENT_TIMESTAMP())`;
  },
};
