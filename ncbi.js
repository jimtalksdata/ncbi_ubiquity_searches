CmdUtils.CreateCommand({
    name: "ncbi-pubmed",
    takes: { "query": noun_arb_text },
    description: "Searches NCBI for PubMed articles. ",
    help: "Please enter a query to search NCBI PubMed.",

    _base_url: "http://www.ncbi.nlm.nih.gov/sites/entrez?db=pubmed&cmd=search&term=",
    _help: "Enter a query to search NCBI PubMed.",

    _resultstoshow: 3,

    execute: function(query) {
        var url = this._base_url + encodeURIComponent(query.text);
        Utils.openUrlInBrowser(url);
    },

    preview: function(pblock, query) {

        var cmd = this;
        var expression = query.text;
        var $ = jQuery; // Access to jQuery

        pblock.innerHTML = this._help;
        var numentries = this._resultstoshow;

        if (expression.match(/\S+/) != null) {
        $.get(this._base_url + encodeURIComponent(expression), {},
         function(result_page) {

             var $content = $(result_page).find("div.contentbox-left");
             var $title = $content.find(".title");
             var $link = $content.find(".title").find("a");
             var $authors = $content.find(".authors");
             var $journalname = $content.find(".source");
             var para = $(result_page).find("div.numItems").html() + "<br>";

             // Fix links
             $link.attr('href', 'http://www.ncbi.nlm.nih.gov' + $link.attr('href'));

             if ($(result_page).find("div#pink_msg").is(":contains('not found')")) {
                 para = "No entries found! Check your spelling.";
             }
             else {
                 for (var a = 0; a < numentries; a++) {
                     para += "<h4><a href=\"" + $link.eq(a).html() + "\">" + $title.eq(a).html() +
            "</a></h4><I>" + $authors.eq(a).html() + "</I><br>" + $journalname.eq(a).html() + "<br>";
                 }
             }
             $(pblock).html(para);

         });
        }

    }

});