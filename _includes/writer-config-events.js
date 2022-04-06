document.addEventListener('DOMContentLoaded', function() {
    // Api
    $("span:contains('\"api\"')").wrap("<a href='/extend/generic-writer/configuration/#api'></a>");
    $("span:contains('\"base_url\"')").wrap("<a href='/extend/generic-writer/configuration/#base-url'></a>");
    $("span:contains('\"default_query_parameters\"')").wrap("<a href='/extend/generic-writer/configuration/#default-query-parameters'></a>");
    $("span:contains('\"default_headers\"')").first().wrap("<a href='/extend/generic-writer/configuration/#default-headers'></a>");
    $("span:contains('\"retry_config\"')").first().wrap("<a href='/extend/generic-writer/configuration/#retry-config'></a>");
    $("span:contains('\"authentication\"')").first().wrap("<a href='/extend/generic-writer/configuration/#authentication '></a>");


    $("span:contains('\"user_parameters\"')").first().wrap("<a href='/extend/generic-writer/configuration/#user-parameters '></a>");

    // Request options
    $("span:contains('\"request_parameters\"')").wrap("<a href='/extend/generic-writer/configuration/#request-parameters'></a>");
    $("span:contains('\"api_request\"')").wrap("<a href='/extend/generic-writer/configuration/#api-request'></a>");
    $("span:contains('\"method\"')").wrap("<a href='/extend/generic-writer/configuration/#method'></a>");
    $("span:contains('\"endpoint_path\"')").first().wrap("<a href='/extend/generic-writer/configuration/#endpoint-path'></a>");
    $("span:contains('\"headers\"')").first().wrap("<a href='/extend/generic-writer/configuration/#headers'></a>");
    $("span:contains('\"query_parameters\"')").first().wrap("<a href='/extend/generic-writer/configuration/#query-parameters'></a>");

    // Content
    $("span:contains('\"request_content\"')").first().wrap("<a href='/extend/generic-writer/configuration/#request-content'></a>");
    $("span:contains('\"content_type\"')").first().wrap("<a href='/extend/generic-writer/configuration/#content-type'></a>");

    // JSON CONFIG
    $("span:contains('\"json_mapping\"')").wrap("<a href='/extend/generic-writer/configuration/#json-mapping'></a>");
    $("span:contains('\"chunk_size\"')").wrap("<a href='/extend/generic-writer/configuration/#chunk_size'></a>");
    $("span:contains('\"nesting_delimiter\"')").wrap("<a href='/extend/generic-writer/configuration/#nesting-delimiter'></a>");
    $("span:contains('\"request_data_wrapper\"')").wrap("<a href='/extend/generic-writer/configuration/#request-data-wrapper'></a>");
    $("span:contains('\"autodetect\"')").first().wrap("<a href='/extend/generic-writer/configuration/#autodetect'></a>");
    $("span:contains('\"column_data_types\"')").wrap("<a href='/extend/generic-writer/configuration/#column-data-types'></a>");
    $("span:contains('\"datatype_override\"')").wrap("<a href='/extend/generic-writer/configuration/#column-datatype-override'></a>");
    $("span:contains('\"column_names_override\"')").wrap("<a href='/extend/generic-writer/configuration/#datatype-override'></a>");
    $("span:contains('\"iterate_by_columns\"')").wrap("<a href='/extend/generic-writer/configuration/#iterate-by-columns'></a>");

    // Configuration
    $("span:contains('\"debug\"')").wrap("<a href='/extend/generic-writer/configuration/#debug'></a>");

}, false);
