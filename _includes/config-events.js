document.addEventListener('DOMContentLoaded', function() {
    // Api
    $("span:contains('\"baseUrl\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#base-url'></a>");
    $("span:contains('\"caCertificate\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#ca-certificate'></a>");
    $("span:contains('\"retryConfig\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#retry-configuration'></a>");
    $("span:contains('\"http\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#default-http-options'></a>");
    $("span:contains('\"headers\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#headers'></a>");
    $("span:contains('\"params\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span:contains('\"defaultOptions\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span:contains('\"requiredHeaders\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#required-headers'></a>");
    $("span:contains('\"ignoreErrors\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#ignore-errors'></a>");
    $("span:contains('\"connectTimeout\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#connect-timeout'></a>");
    $("span:contains('\"requestTimeout\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#request-timeout'></a>");
    $("span:contains('\"pagination\"')").wrap("<a href='/extend/generic-extractor/configuration/api/pagination/'></a>");
    $("span:contains('\"scrollers\"')").wrap("<a href='/extend/generic-extractor/configuration/api/pagination/multiple/'></a>");
    $("span:contains('\"method\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/pagination/#paging-strategy'></a>");
    $("span:contains('\"authentication\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication'></a>");

    // AWS Signature
    $("span:contains('\"signature\"')").wrap("<a href='/extend/generic-extractor/configuration/aws-signature'></a>");
    $("span:contains('\"credentials\"')").first().wrap("<a href='/extend/generic-extractor/configuration/aws-signature#aws-signature-credentials'></a>");

    // Jobs
    $("span:contains('\"endpoint\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#endpoint'></a>");
    $("span:contains('\"params\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#request-parameters'></a>");
    $("span:contains('\"method\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#method'></a>");
    $("span:contains('\"dataField\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#data-field'></a>");
    $("span:contains('\"dataType\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#data-type'></a>");
    $("span:contains('\"responseFilter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span:contains('\"responseFilterDelimiter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span:contains('\"scroller\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#scroller'></a>");

    // Child jobs
    $("span:contains('\"children\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#children'></a>");
    $("span:contains('\"recursionFilter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/children/#filter'></a>");
    $("span:contains('\"placeholders\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/children/#placeholders'></a>");

    // Config root
    $("span:contains('\"api\"')").wrap("<a href='/extend/generic-extractor/configuration/api/'></a>");
    $("span:contains('\"config\"')").wrap("<a href='/extend/generic-extractor/configuration/config/'></a>");
    $("span:contains('\"sshProxy\"')").wrap("<a href='/extend/generic-extractor/configuration/ssh-proxy/'></a>");
    $("span:contains('\"iterations\"')").wrap("<a href='/extend/generic-extractor/configuration/iterations/'></a>");

    // Configuration
    $("span:contains('\"debug\"')").wrap("<a href='/extend/generic-extractor/running/#debug-mode'></a>");
    $("span:contains('\"incrementalOutput\"')").wrap("<a href='/extend/generic-extractor/incremental/'></a>");
    $("span:contains('\"jobs\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/'></a>");
    $("span:contains('\"mappings\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/'></a>");
    $("span:contains('\"outputBucket\"')").wrap("<a href='/extend/generic-extractor/configuration/config/#output-bucket'></a>");
    $("span:contains('\"http\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/#http'></a>");
    $("span:contains('\"userData\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/#user-data'></a>");
    $("span:contains('\"compatLevel\"')").wrap("<a href='/extend/generic-extractor/configuration/config/#compatibility-level'></a>");

    // Mappings
    $("span:contains('\"column\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span:contains('\"user\"')").first().wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#user-mapping'></a>");
    $("span:contains('\"table\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#table-mapping'></a>");
    $("span:contains('\"mapping\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span:contains('\"tableMapping\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#table-mapping'></a>");

    // Authorization
    $("span:contains('\"authorization\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span:contains('\"oauth_api\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span:contains('\"credentials\"')").last().wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");
}, false);
