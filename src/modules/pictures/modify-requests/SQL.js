export default {
    save_picture_request_sql: (context, request, account_id, request_id) => {
        return `INSERT INTO ${context.PULSE_DATASET}.picture_requests 
                (account_id, 
                request_id, 
                location, 
                direction,
                updated_at,
                capture_timestamp) 
                VALUES 
                (
                    '${request.account_id}', 
                    '${request.request_id}', 
                    ST_GEOGFROMGEOJSON("${request.location}"), 
                    ${request.direction},
                    CURRENT_TIMESTAMP(),
                    TIMESTAMP_SECONDS(${request.capture_timestamp})
                )`;
    }
};