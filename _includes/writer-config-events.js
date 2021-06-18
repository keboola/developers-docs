document.addEventListener('DOMContentLoaded', function() {
    // Api
    $("span:contains('\"path\"')").wrap("<a href='/extend/generic-writer/configuration/#path'></a>");
    $("span:contains('\"mode\"')").wrap("<a href='/extend/generic-writer/configuration/#mode'></a>");
    $("span:contains('\"method\"')").wrap("<a href='/extend/generic-writer/configuration/#method'></a>");
    $("span:contains('\"iteration_mode\"')").first().wrap("<a href='/extend/generic-writer/configuration/#iteration_mode'></a>");
    $("span:contains('\"user_parameters\"')").first().wrap("<a href='/extend/generic-writer/configuration/#user_parameters'></a>");
    $("span:contains('\"headers\"')").first().wrap("<a href='/extend/generic-writer/configuration/#headers'></a>");
    $("span:contains('\"additional_requests_pars\"')").wrap("<a href='/extend/generic-writer/configuration/#additional_request_pars'></a>");

    // JSON CONFIG
    $("span:contains('\"json_data_config\"')").wrap("<a href='/extend/generic-writer/configuration/#json_data_config'></a>");
    $("span:contains('\"chunk_size\"')").wrap("<a href='/extend/generic-writer/configuration/#chunk_size'></a>");
    $("span:contains('\"delimiter\"')").wrap("<a href='/extend/generic-writer/configuration/#delimiter'></a>");
    $("span:contains('\"request_data_wrapper\"')").wrap("<a href='/extend/generic-writer/configuration/#request_data_wrapper'></a>");
    $("span:contains('\"infer_types_for_unknown\"')").first().wrap("<a href='/extend/generic-writer/configuration/#infer_types_for_unknown'></a>");
    $("span:contains('\"column_types\"')").wrap("<a href='/extend/generic-writer/configuration/#column_types'></a>");

    // Configuration
    $("span:contains('\"debug\"')").wrap("<a href='/extend/generic-writer/configuration/#debug'></a>");

}, false);
