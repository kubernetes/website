    document.querySelector('html').classList.add('search');

    document.addEventListener('DOMContentLoaded', function() {
      let searchTerm = new URLSearchParams(window.location.search).get('q');
      let fetchingElem = document.getElementById('bing-results-container');

      if (!searchTerm) {
        if (fetchingElem) fetchingElem.style.display = 'none';
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

    window.renderPageFindSearchResults = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let searchTerm = urlParams.get("q") || "";
        let sidebarSearch = document.querySelector('.td-sidebar__search');
        if (sidebarSearch) {
            sidebarSearch.remove();
        }
        document.getElementById('search').style.display = 'block';
        pagefind = new PagefindUI({ element: "#search", showImages: false });
        if (searchTerm) {
            pagefind.triggerSearch(searchTerm);
        }

        document.querySelector("#search input").addEventListener("input", function() {
            var inputValue = this.value;
            var queryStringVar = "q";
            updateQueryString(queryStringVar, inputValue);
        });
    }

	function updateQueryString(key, value) {
		var baseUrl = window.location.href.split("?")[0];
		var queryString = window.location.search.slice(1);
		var urlParams = new URLSearchParams(queryString);

		if (urlParams.has(key)) {
			urlParams.set(key, value);
		} else {
			urlParams.append(key, value);
		}

		var newUrl = baseUrl + "?" + urlParams.toString();
		// Update the browser history (optional)
        history.replaceState(null, '', newUrl);
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
                    window.renderPageFindSearchResults()
                    document.cookie = "is_china=true;" + path + expires
                } else {
                    window.renderGoogleSearchResults()
                    document.cookie = "is_china=false;" + path + expires;
                }
            },
            error: function () {
                window.renderPageFindSearchResults()
                document.cookie = "is_china=true;" + path + expires;
            },
            timeout: 3000
        });
    } else if (getCookie("is_china") == "true") {
        window.addEventListener('DOMContentLoaded', (event) => {
            window.renderPageFindSearchResults()
        });
    } else {
        window.renderGoogleSearchResults()
    }


