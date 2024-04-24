    document.querySelector('html').classList.add('search');

    document.addEventListener('DOMContentLoaded', function() {
      let searchTerm = new URLSearchParams(window.location.search).get('q');
      let fetchingElem = document.getElementById('bing-results-container');
      let searchTitle = document.querySelector('.search-title');

      if (!searchTerm) {
        if (fetchingElem) fetchingElem.style.display = 'none';
        if (searchTitle) searchTitle.style.display = 'none';

      }
    });

    window.renderGoogleSearchResults = () => {
        var cx = '013288817511911618469:elfqqbqldzg';
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//cse.google.com/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
    }

    window.getPaginationAnchors = (pages) => {
        var pageAnchors = '', searchTerm  = window.location.search.split("=")[1].split("&")[0].replace(/%20/g, ' ');
        var currentPage = window.location.search.split("=")[2];
        currentPage = (!currentPage) ?  1 : currentPage.split("&")[0];

        for(var i = 1; i <= 10; i++){
            if(i > pages) break;
            pageAnchors += '<a class="bing-page-anchor" href="/search/?q='+searchTerm+'&page='+i+'">';
            pageAnchors += (currentPage == i) ? '<b>'+i+'</b>' : i;
            pageAnchors += '</a>';
        }
        return pageAnchors;
    }

    window.getResultMarkupString = (ob) => {
        return '<div class="bing-result">'
            + '<div class="bing-result-name"><a href="'+ob.url+'">'+ob.name+'</a></div>'
            + '<div class="bing-result-url">'+ob.displayUrl+'</div>'
            + '<div class="bing-result-snippet">'+ob.snippet+'</div>'
            +'</div>';
    }

    window.renderBingSearchResults = () => {
      let urlParams = new URLSearchParams(window.location.search);
      let searchTerm = urlParams.get("q") || "";
      let page = urlParams.get("page") || 1;
      let q = searchTerm;
      let results = '';
      let offset = (page - 1) * 10;
      let ajaxConf = {};

      if (!searchTerm) return;

      ajaxConf.url = 'https://kubernetes-io-search.azurewebsites.net/api/bingsearchproxy';
      ajaxConf.data =  { q: q, offset: offset };
      ajaxConf.type = "GET";

      $.ajax(ajaxConf).done(function(res) {
        if (res.status === 500) {
          console.log('Server Error');
          return;
        }

        if (res.webPages == null) return; // If no result, 'webPages' is 'undefined'
        var paginationAnchors = window.getPaginationAnchors(Math.ceil(res.webPages.totalEstimatedMatches / 10));
        res.webPages.value.map(ob => { results += window.getResultMarkupString(ob); })

        if($('#bing-results-container').length > 0) $('#bing-results-container').html(results);
        if($('#bing-pagination-container').length > 0) $('#bing-pagination-container').html(paginationAnchors);
      });
    }

    // China Verification.
    var path = "path=/;"
    d = new Date()
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000))
    expires = "expires=" + d.toUTCString()

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
        else return "";
    }

    if (getCookie("is_china") === "") {
        $.ajax({
            url: "https://ipinfo.io?token=796e43f4f146b1",
            dataType: "jsonp",
            success: function (response) {
                if (response.country == 'CN') {
                    window.renderBingSearchResults()
                    document.cookie = "is_china=true;" + path + expires
                } else {
                    window.renderGoogleSearchResults()
                    document.cookie = "is_china=false;" + path + expires;
                }
            },
            error: function () {
                window.renderBingSearchResults()
                document.cookie = "is_china=true;" + path + expires;
            },
            timeout: 3000
        });
    } else if (getCookie("is_china") === "true") {
        window.renderBingSearchResults()
    } else {
        window.renderGoogleSearchResults()
    }


