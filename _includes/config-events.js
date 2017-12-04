document.addEventListener('DOMContentLoaded', function() {
    // Api
    $("span.s2:contains('\"baseUrl\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#base-url'></a>");
    $("span.s2:contains('\"retryConfig\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#retry-configuration'></a>");
    $("span.s2:contains('\"http\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#default-http-options'></a>");
    $("span.s2:contains('\"headers\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#headers'></a>");
    $("span.s2:contains('\"params\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span.s2:contains('\"defaultOptions\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span.s2:contains('\"requiredHeaders\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#required-headers'></a>");
    $("span.s2:contains('\"ignoreErrors\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#ignore-errors'></a>");
    $("span.s2:contains('\"pagination\"')").wrap("<a href='/extend/generic-extractor/configuration/api/pagination/'></a>");
    $("span.s2:contains('\"scrollers\"')").wrap("<a href='/extend/generic-extractor/configuration/api/pagination/multiple/'></a>");
    $("span.s2:contains('\"method\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/pagination/#paging-strategy'></a>");
    $("span.s2:contains('\"authentication\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication'></a>");

    // Jobs
    $("span.s2:contains('\"endpoint\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#endpoint'></a>");
    $("span.s2:contains('\"params\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#request-parameters'></a>");
    $("span.s2:contains('\"method\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#method'></a>");
    $("span.s2:contains('\"dataField\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#data-field'></a>");
    $("span.s2:contains('\"dataType\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#data-type'></a>");
    $("span.s2:contains('\"responseFilter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span.s2:contains('\"responseFilterDelimiter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span.s2:contains('\"scroller\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#scroller'></a>");

    // Child jobs
    $("span.s2:contains('\"children\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#children'></a>");
    $("span.s2:contains('\"recursionFilter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/children/#filter'></a>");
    $("span.s2:contains('\"placeholders\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/children/#placeholders'></a>");

    // Config root
    $("span.s2:contains('\"config\"')").wrap("<a href='/extend/generic-extractor/configuration/config/'></a>");
    $("span.s2:contains('\"debug\"')").wrap("<a href='/extend/generic-extractor/running/#debug-mode'></a>");
    $("span.s2:contains('\"incrementalOutput\"')").wrap("<a href='/extend/generic-extractor/incremental/'></a>");
    $("span.s2:contains('\"jobs\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/'></a>");
    $("span.s2:contains('\"mappings\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/'></a>");
    $("span.s2:contains('\"api\"')").wrap("<a href='/extend/generic-extractor/configuration/api/'></a>");
    $("span.s2:contains('\"outputBucket\"')").wrap("<a href='/extend/generic-extractor/configuration/config/#output-bucket'></a>");
    $("span.s2:contains('\"http\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/#http'></a>");
    $("span.s2:contains('\"userData\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/#user-data'></a>");
    $("span.s2:contains('\"compatLevel\"')").wrap("<a href='/extend/generic-extractor/configuration/config/#compatibility-level'></a>");

    // Mappings
    $("span.s2:contains('\"type\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#configuration'></a>");
    $("span.s2:contains('\"column\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span.s2:contains('\"user\"')").first().wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#user-mapping'></a>");
    $("span.s2:contains('\"table\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#table-mapping'></a>");
    $("span.s2:contains('\"mapping\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span.s2:contains('\"tableMapping\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#table-mapping'></a>");

    // Authorization
    $("span.s2:contains('\"authorization\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span.s2:contains('\"oauth_api\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span.s2:contains('\"credentials\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");

    $("span.s2:contains('\"iterations\"')").wrap("<a href='/extend/generic-extractor/iterations/'></a>");

    // Ssh Proxy
    $("span.s2:contains('\sshProxy\"')").wrap("<a href='/extend/generic-extractor/configuration/ssh-proxy/'></a>");
}, false);
