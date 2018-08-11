    window.renderGoogleSearchResults = () => {
        var cx = '013288817511911618469:elfqqbqldzg';
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//cse.google.com/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
        document.querySelector('html').classList.add('search');
    }

    window.renderBingSearchResults = () => {
        var search = "site:kubernetes.io " + window.location.search.split("=")[1], results = '', ajaxConf = {};

        ajaxConf.url = 'https://api.cognitive.microsoft.com/bing/v7.0/search';
        ajaxConf.data =  { q: search };
        ajaxConf.type = "GET";
        ajaxConf.beforeSend = function(xhr){ xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '301d5777c602443b8856c4aaf6a535af'); };

        $.ajax(ajaxConf).done(function(res) {
            res.webPages.value.map(ob => {
                results += '<div class="bing-result">'
                        + '<div class="bing-result-name"><a href="'+ob.url+'">'+ob.name+'</a></div>'
                        + '<div class="bing-result-url">'+ob.displayUrl+'</div>'
                        + '<div class="bing-result-snippet">'+ob.snippet+'</div>'
                        +'</div>';
            })
            if($('#bing-results-container').length > 0) $('#bing-results-container').html(results);
        });
    }

    window.renderBingSearchResults();

    $.get("https://ipinfo.io", function(response) {
        if(response.country != 'CN') window.renderGoogleSearchResults();
    }, "jsonp");



