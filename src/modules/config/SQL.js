export default {
    all_config_query_sql : (context, id) => {
          return "SELECT * from `" + context.PULSE_DATASET + ".configuration`";
    },
    config_by_name_query_sql : (context, id, name) => {
        return "SELECT * from `" + context.PULSE_DATASET + ".configuration` where config_name = '" + name + "'";
    }
}