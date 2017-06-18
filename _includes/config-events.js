document.addEventListener('DOMContentLoaded', function() {
    // Api
    $("span.nt:contains('\"baseUrl\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#base-url'></a>");
    $("span.nt:contains('\"retryConfig\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#retry-configuration'></a>");
    $("span.nt:contains('\"http\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#default-http-options'></a>");
    $("span.nt:contains('\"headers\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#headers'></a>");
    $("span.nt:contains('\"params\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span.nt:contains('\"defaultOptions\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span.nt:contains('\"requiredHeaders\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#required-headers'></a>");
    $("span.nt:contains('\"pagination\"')").wrap("<a href='/extend/generic-extractor/configuration/api/pagination/'></a>");
    $("span.nt:contains('\"scrollers\"')").wrap("<a href='/extend/generic-extractor/configuration/api/pagination/multiple/'></a>");
    $("span.nt:contains('\"method\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/pagination/#paging-strategy'></a>");
    $("span.nt:contains('\"authentication\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication'></a>");

    // Jobs
    $("span.nt:contains('\"endpoint\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#endpoint'></a>");
    $("span.nt:contains('\"params\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#request-parameters'></a>");    
    $("span.nt:contains('\"method\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#method'></a>");
    $("span.nt:contains('\"dataField\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#data-field'></a>");
    $("span.nt:contains('\"dataType\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#data-type'></a>");
    $("span.nt:contains('\"responseFilter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span.nt:contains('\"responseFilterDelimiter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span.nt:contains('\"scroller\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#scroller'></a>");

    // Child jobs
    $("span.nt:contains('\"children\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#children'></a>");
    $("span.nt:contains('\"recursionFilter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/children/#filter'></a>");
    $("span.nt:contains('\"placeholders\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/children/#placeholders'></a>");

    // Config root
    $("span.nt:contains('\"config\"')").wrap("<a href='/extend/generic-extractor/configuration/config/'></a>");
    $("span.nt:contains('\"debug\"')").wrap("<a href='/extend/generic-extractor/running/#debug-mode'></a>");
    $("span.nt:contains('\"incrementalOutput\"')").wrap("<a href='/extend/generic-extractor/incremental/'></a>");
    $("span.nt:contains('\"jobs\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/'></a>");
    $("span.nt:contains('\"mappings\"')").wrap("<a href='/extend/generic-extractor/configuration/configuration/config/mappings/'></a>");
    $("span.nt:contains('\"api\"')").wrap("<a href='/extend/generic-extractor/configuration/api/'></a>");
    $("span.nt:contains('\"outputBucket\"')").wrap("<a href='/extend/generic-extractor/configuration/config/#output-bucket'></a>");
    $("span.nt:contains('\"http\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/#http'></a>");
    $("span.nt:contains('\"userData\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/#user-data'></a>");

    // Mappings
    $("span.nt:contains('\"type\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#configuration'></a>");
    $("span.s2:contains('\"column\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span.s2:contains('\"user\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#user-mapping'></a>");
    $("span.s2:contains('\"table\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#table-mapping'></a>");
    $("span.nt:contains('\"mapping\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span.nt:contains('\"tableMapping\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#table-mapping'></a>");
    
    // Authorization
    $("span.nt:contains('\"authorization\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span.nt:contains('\"oauth_api\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span.nt:contains('\"credentials\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");

    $("span.nt:contains('\"iterations\"')").wrap("<a href='/extend/generic-extractor/iterations/'></a>");    
}, false);