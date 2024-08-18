export default {
    insert_request_sql : (context, request) => {
        return "INSERT INTO `" + context.PULSE_DATASET + ".requests` " +
        "(account_id, request_id, request_url, request_method, request_headers, request_query, request_body, schedule, updated_at) " +
        "VALUES ('" + 
            request.account_id + 
            "', GENERATE_UUID(), '" +
            request.request_url + 
            "', '" + 
            request.request_method + 
            "', JSON '" + JSON.stringify(request.request_headers) + 
            "', JSON '" + JSON.stringify(request.request_query) +
            "', JSON '" + JSON.stringify(request.request_body) +
            "', '" +
            request.schedule + 
            "', UNIX_MILLIS(updated_at) as updated_at)";
    },
    update_request_sql : (context, request) => {
        return "UPDATE `" + context.PULSE_DATASET + ".requests` " +
        "SET " +
            "request_url = '" + request.request_url + 
            "', request_method = '" + request.request_method + 
            "', request_headers = JSON '" + JSON.stringify(request.request_headers) + 
            "', request_query = JSON '" + JSON.stringify(request.request_query) +
            "', request_body = JSON '" + JSON.stringify(request.request_body) +
            "', schedule = '" + request.schedule + 
            "', updated_at = UNIX_MILLIS(updated_at) " +
        "WHERE request_id = '" + request.request_id + "'";
    },
    delete_request_sql : (context, request_id) => {
        return "DELETE FROM `" + context.PULSE_DATASET + ".requests` WHERE request_id = '" + request_id + "'";
    },
    request_query_sql : (context, account_id) => {
        return "SELECT * FROM `" + context.PULSE_DATASET + ".requests` WHERE account_id = '" + account_id + "'";
    },
    request_query_by_id_sql : (context, request_id) => {
        return "SELECT * FROM `" + context.PULSE_DATASET + ".requests` WHERE request_id = '" + request_id + "'";
    }
}