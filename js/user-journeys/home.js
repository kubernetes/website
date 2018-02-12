$( document ).ready(function() {
  // UI defaults, used if page is loaded without other params
  var defaults = {
      path: 'users',
      persona: 'app-developer',
      level: 'foundational'
  };
  // Top-level path types
  var pathTypes = [
    'users',
    'contributors',
    'migrators',
    'browse',
    'about'
  ];
  // Paths that do not adhere to the actual user journey UI
  var specialJourneyPaths = [
    'browse',
    'about',
  ];
  // Load persona JSON data structure
  var info = JSON.parse($('#user-persona-data').html());

  var containerDivs = [
    '.applicationDeveloperContainer',
    '.infobarWrapper',
    '#cardWrapper',
    '#browsedocsWrapper',
    '#aboutWrapper'
  ];

  // Stateful wrapper for a regular hash. Stores parameters AND keeps them in
  // sync with the URL state.
  var urlParamHash = function() {
    var paramHash = {};

    // Initialize internal params based on URL state
    function init() {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

      paramHash = {};
      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] != "" && sParameterName[1] != "")
          paramHash[sParameterName[0]] = sParameterName[1];
      }
      return paramHash; // for visibility
    }

    // Update both internal params and URL state
    function set(key, value) {
      if (value == null) {
        delete paramHash[key];
      } else {
        paramHash[key] = value;
      }

      var urlWithoutQuery = window.location.href.split('?')[0];
      var urlHash = window.location.hash;
      window.history.pushState(null,null, urlWithoutQuery + "?" + $.param(paramHash) + window.location.hash);
      return paramHash; // for visibility
    }

    // Get value from hash based on key
    function get(key) {
      return paramHash[key];
    }

    // Return number of elements in hash
    function numElts() {
      return Object.keys(paramHash).length;
    }

    return {
      init: init,
      set: set,
      get: get,
      numElts: numElts,
    };
  }();

  // Create persona buttons in "I am..." section, e.g. Application Developer
  function buildCards() {
    for (var c in info) {
      var card = document.createElement('div');
      card.className += "card_" + c;

      for (var i in info[c]) {
        var button = document.createElement('div');
        button.className += 'buttons';
        button.setAttribute('data-button', i);
        button.innerText = info[c][i]["name"];
        card.appendChild(button);
      }
      $('.cards').append(card);
    }
  }

  // Generate HTML for info links
  function getInfoLinkHtml(
    i = 1 //enumeration index for link id
    , linkLabel = "Missing link label." //info link text
    , linkUrl = "/docs/home/" //link to content
    , linkIcon = "fa-ellipsis-h" //icon preceding info link text
  ) {
    var html = '';

    /*
      html template:
        <a id="infolink1" href="docs.html"><div class="whitebar" >
            <div class="infoicon">
                <i class="fa fa-ellipsis-h" aria-hidden="true" style="padding:%;float:left;color:#3399ff"></i>
            </div>
            <div id="info1" class='data'>Missing link label.</div>
        </div></a>

      defaults:
        label: "Missing link label."
        icon: "fa-ellipsis-h"
        url: "docs.html"
    */

    html =  '<a id="infolink'+i+'" href="'+linkUrl+'"><div class="whitebar">' +
              '<div class="infoicon">' +
                '<i class="fa '+linkIcon+'" aria-hidden="true" style="padding:%;float:left;color:#3399ff"></i>' +
              '</div>' +
              '<div id="info'+i+'" class="data">'+linkLabel+'</div>' +
            '</div></a>';

    return html;
  }

  // Set links in the "I want to..." section, e.g. Setup a development environment
  function setInfoData() {
      var path = urlParamHash.get("path");
      var persona = urlParamHash.get("persona");
      var level = urlParamHash.get("level");

      // info links specific to type/button/level
      var contentArray = (typeof info[path][persona] !== 'undefined')
        ? info[path][persona][level]
        : [{
            label: 'Please select a role or persona in the "I AM..." section above.',
            url: '#cardWrapper',
            icon: 'fa-exclamation'
          }];

      //clear contents of #infobarLinks div
      $('#infobarLinks').empty();
      //process and add each info link
      for(i = 1; i <= contentArray.length; i++) {
          var content = contentArray[i-1];

          //append link to the end of the div
          $('#infobarLinks').append(getInfoLinkHtml(i,content.label,content.url,content.icon));
      }
      $('.infobarWrapper').css('visibility', 'visible');
  }

  // Hide persona wizard section if Browse Docs button is clicked
  function toggleSections(path){
    for (i in containerDivs) {
      if (!isSpecialJourney(path)) {
        $(containerDivs[i]).show();
      } else {
        $(containerDivs[i]).hide();
      }
    }

    if (!isSpecialJourney(path)) {
      $('.card_' + path).show();
      // TBD: Add code to set button to default to first in path list?
    } else if (path == "browse") {
      $('#browsedocsWrapper').show();
    } else if (path == "about") {
      $('#aboutWrapper').show();
    }
  }

  function isSpecialJourney(path) {
    return (specialJourneyPaths.indexOf(path) != -1);
  }

  // Click handler for high-level user journey paths ("Users", "Contributors", etc)
  function handlePathClick(targetElt, fromPageload) {
    // (1) Update stored state if necessary
    var type = urlParamHash.get("path");
    if (!fromPageload) {
      for (var i in pathTypes) {
        var pathType = pathTypes[i];
        if (RegExp(pathType).test(targetElt.className)) {
          type = pathType;
        }
      }
      urlParamHash.set("path", type);
      urlParamHash.set("persona", null);
      urlParamHash.set("level", null);

      // record Google Analytics event
      ga('send', 'event', 'user-journeys', 'click', 'path', type);

    }

    // (2) HTML behavior
    $('.navButton').removeClass("keepShow");
    $(targetElt).addClass("keepShow");
    $('.cards > div').hide();
    // Hide or show user journeys if "Browse Docs is selected"
    toggleSections(type);
  }

  // Click handler + scroll for persona buttons in "I am..." section
  // NOTE: ALL persona clicks also set a level.
  function handlePersonaClick(targetElt, fromPageload, noScroll) {
      // (1) Update stored state if necessary
      if (!fromPageload) {
        var persona = targetElt.getAttribute('data-button');
        urlParamHash.set('persona', persona);

        // record Google Analytics event
        ga('send', 'event', 'user-journeys', 'click', 'persona', persona);

      }
      // Use default level if not specified, in order to display the proper
      // path-persona-level content
      if (urlParamHash.get('level') == null) {
        urlParamHash.set('level', defaults.level);
      }

      // (2) HTML behavior
      $('.buttons').removeClass('selected');
      $(targetElt).addClass('selected');
      // Update header to display new persona and level
      var cardText = targetElt.innerText;
      $('#subTitle').text(cardText);
      handleLevelClick($('.level[data-name="' + urlParamHash.get('level') + '"]')[0], fromPageload);
      // Scroll to user journey content
      if (!noScroll) {
        $('html,body').animate({ scrollTop: $("#subTitle").offset().top },'slow');
      }
  }

  function handleLevelClick(targetElt, fromPageload) {
      // (1) Update stored state if necessary
      var level = targetElt.getAttribute('data-name');
      if (!fromPageload) {
        urlParamHash.set('level', level);

        // record Google Analytics event
        ga('send', 'event', 'user-journeys', 'click', 'level', level);

      }

      // (2) HTML behavior
      $('.level').removeClass('selected');
      $(targetElt).addClass('selected');
      // Data loading to display the right content
      setInfoData();
  }

  function showPersonaDefinition(targetElt) {
    var persona = targetElt.getAttribute('data-button');

    console.log($('.persona-def-data[data-name="' + persona + '"]')[0].innerHTML);
    $("#persona-definition").html($('.persona-def-data[data-name="' + persona + '"]')[0].innerHTML);
    $("#persona-definition").css("visibility", "visible");
  }

  function attachCardEvents() {
    // Set up click handling for all paths ("Users", "Contributors", etc)
    $('.paths .navButton').on('click', function(e) {
      handlePathClick(e.currentTarget);
    });
    // Set up click handling for personas ("Application Developer", etc)
    $('.cards .buttons').on('click', function(e) {
      handlePersonaClick(e.currentTarget);
    });
    // Show persona definitions when hovering over card
    $('.cards .buttons').hover( function(e) {
      showPersonaDefinition(e.currentTarget);
    }, function(e) {
      $("#persona-definition").css("visibility", "hidden");
      $("#persona-definition").html(".");
    });
    // Set up click handling for levels ("Foundational", "Intermediate", etc)
    $('.level').on('click', function(e) {
      handleLevelClick(e.currentTarget);
    });
  }

  // Set up state based on URL query parameters or defaults
  function setupCardState() {
    // Initialize stored state
    urlParamHash.init();
    var noScroll = urlParamHash.numElts() == 0;
    for (key in defaults) {
      if (!isSpecialJourney(urlParamHash.get('path')) && urlParamHash.get(key) == undefined) {
        urlParamHash.set(key, defaults[key]);
      }
    }
    // Update UI
    handlePathClick($('.paths .' + urlParamHash.get('path'))[0], true);
    if (!isSpecialJourney(urlParamHash.get('path'))) {
      setTimeout(function() {
        var elt = $('div[data-button="' + urlParamHash.get('persona') + '"]')[0];
        handlePersonaClick(elt, true, noScroll);
      }, 200);
    }
  }

  function main() {
    // Set up UI
    buildCards();
    attachCardEvents();
    // Set up and display user journey state
    setupCardState();
  }

  // What actually executes on page load
  main();
});
