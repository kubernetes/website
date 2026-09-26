// This is copied from google implementation in the Docsy search layout
window.renderGoogleSearchResults = () => {
  const cx = '013288817511911618469:elfqqbqldzg'; // Todo: move this to a site variable or a build variable
  const gcse = document.createElement('script');
  gcse.type = 'text/javascript';
  gcse.async = true;
  gcse.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') + '//cse.google.com/cse.js?cx=' + cx;
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(gcse, s);
}

window.renderPageFindSearchResults = () => {
  let urlParams = new URLSearchParams(window.location.search);
  let searchTerm = urlParams.get("q") || "";

  document.getElementById('search').style.display = 'block';
  let pagefind = new PagefindUI({ element: "#search", showImages: false });
  if (searchTerm) {
    pagefind.triggerSearch(searchTerm);
  }

  document.querySelector("#search input").addEventListener("input", function() {
    const inputValue = this.value;
    const queryStringVar = "q";
    updateQueryString(queryStringVar, inputValue);
  });
}

function updateQueryString(key, value) {
  const baseUrl = window.location.href.split("?")[0];
  const queryString = window.location.search.slice(1);
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has(key)) {
    urlParams.set(key, value);
  } else {
    urlParams.append(key, value);
  }

  const newUrl = baseUrl + "?" + urlParams.toString();
  // Update the browser history (optional)
  history.replaceState(null, '', newUrl);
}

// China Verification.
const path = "path=/;";
let d = new Date()
d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000))
let expires = "expires=" + d.toUTCString()

function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  else return "";
}

async function checkBlockedSite(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000); // Timeout set to 5000ms (5 seconds)

  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
    // If we reach this point, the site is accessible (since mode: 'no-cors' doesn't allow us to check response.ok)
    clearTimeout(timeout);
    return false;
  } catch (error) {
    // If an error occurs, it's likely the site is blocked
    return true;
  }
}

async function loadSearch() {
  if (getCookie("can_google") === "") {
    const isGoogleBlocked = await checkBlockedSite("https://www.google.com/favicon.ico");
    if ( isGoogleBlocked ) {
      // Google is blocked.
      document.cookie = "can_google=false;" + path + expires
      window.renderPageFindSearchResults()
    } else {
      // Google is not blocked.
      document.cookie = "can_google=true;" + path + expires
      window.renderGoogleSearchResults()
    }
  } else if (getCookie("can_google") === "false") {
    window.renderPageFindSearchResults()
  } else {
    window.renderGoogleSearchResults()
  }
}

// The following is based on Docsy's assets/js/search.js
(function ($) {
  "use strict";

  const Search = {
    init: function () {
      $(document).ready(function () {
        // Fill the search input form with the current search keywords
        const searchKeywords = new URLSearchParams(location.search).get('q');
        if (searchKeywords !== null && searchKeywords !== '') {
          const searchInput = document.querySelector('.td-search-input');
          searchInput.focus();
          searchInput.value = searchKeywords;
        }

        // Set a keydown event
        $(document).on("keypress", ".td-search-input", function (e) {
          if (e.keyCode !== 13) {
            return;
          }

          const query = $(this).val();
          document.location = $(this).data('search-page') + "?q=" + query;

          return false;
        });
      });
    },
  };

  Search.init();
})(jQuery);

window.onload = loadSearch;
