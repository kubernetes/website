// TODO (long-term): Would be easier to manage all this state with React

$( document ).ready(function() {
  var expandText = "[+]";
  var closeText = "[-]";
  var selectAllKey = "all";
  var deselectAllKey = "none";

  var defaultActiveTag = "fundamental";
  var activeTags = {};

  var paramSize = function(paramHash) {
    return Object.keys(paramHash).length;
  }

  // "Lib" for acquiring parameters from the URL
  var urlParamLib = function() {
    function initParams() {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

      var paramHash = {};
      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] != "")
          paramHash[sParameterName[0]] = sParameterName[1];
      }

      if (paramSize(paramHash) == 0) {
        paramHash[defaultActiveTag] = true;
      }

      return paramHash;
    }

    function updateParams(paramHash) {
      var urlWithoutQuery = window.location.href.split('?')[0];
      var urlHash = window.location.hash;
      window.history.pushState(null,null, urlWithoutQuery + "?" + $.param(paramHash) + window.location.hash);
    }

    return {
      initParams: initParams,
      updateParams: updateParams,
    };
  }();

  var initClickFunctions = function() {

    var deactivateTagTerms = function(elt) {
      var targetTag = elt.data("target");
      var targetClass = "." + targetTag;
      var tagName = targetTag.split('tag-')[1];

      elt.removeClass("active-tag");
      $(targetClass).each(function(){
        var showCount = $(this).data("show-count");
        var newShowCount = showCount - 1;
        $(this).data("show-count", newShowCount);
        if (newShowCount < 1) {
          $(this).addClass("hide");
        }
      });
      delete activeTags[tagName];
    };

    var activateTagTerms = function(elt) {
      var targetTag = elt.data("target");
      var targetClass = "." + targetTag;
      var tagName = targetTag.split('tag-')[1];

      elt.addClass("active-tag");
      $(targetClass).each(function(){
        var showCount = $(this).data("show-count");
        var newShowCount = showCount + 1;
        $(this).data("show-count", newShowCount);
        if (newShowCount > 0) {
          $(this).removeClass("hide");
        }
      });
      activeTags[tagName] = true;
      if (activeTags[deselectAllKey]) {
        delete activeTags[deselectAllKey];
      }
    };

    // Shows/hides glossary terms when their relevant tags are clicked
    $(".canonical-tag").each(function(){
      var placeholder = $("#placeholder");
      var targetTag = $(this).data("target");
      $(this).mouseenter(function(){
        var tagDescription = $("#" + targetTag + "-description").html();
        placeholder.html(tagDescription);
        placeholder.removeClass('invisible');
      }).mouseleave(function(){
        placeholder.addClass('invisible');
      });

      $(this).click(function(){
        var shouldHide = $(this).hasClass("active-tag");
        if (shouldHide) {
          deactivateTagTerms($(this));
        } else {
          activateTagTerms($(this));
        }
        urlParamLib.updateParams(activeTags);
      });
    });

    // Adds functionality to "select all tags" link
    $("#select-all-tags").click(function(){
      $(".canonical-tag").each(function(){
        var shouldActivate = !$(this).hasClass("active-tag");
        if (shouldActivate) {
          activateTagTerms($(this));
        }
      });
      queryParams = {}
      queryParams[selectAllKey] = true;
      urlParamLib.updateParams(queryParams);
    });

    // Adds functionality to "deselect all tags" link
    $("#deselect-all-tags").click(function(){
      $(".canonical-tag").each(function(){
        var shouldHide = $(this).hasClass("active-tag");
        if (shouldHide) {
          deactivateTagTerms($(this));
        }
      });
      queryParams = {}
      queryParams[deselectAllKey] = true;
      urlParamLib.updateParams(queryParams);
    });

    // Expands/hides glossary term definitions when [+] button is clicked
    $(".click-controller").each(function(){
      $(this).click(function() {
        var targetId = $(this).data("target");
        var shouldExpand = $(this).html() == expandText;

        if (shouldExpand) {
          $("#" + targetId).removeClass('hide');
          $(this).html(closeText);
        } else {
          $("#" + targetId).addClass('hide');
          $(this).html(expandText);
        }
      });
    });

    // Shows permalink when term name is hovered over
    $(".term-name").each(function() {
      var permalink = $($(this).parent().find(".permalink")[0]);
      $(this).mouseenter(function(){
        permalink.removeClass("hide");
      }).mouseleave(function(){
        permalink.addClass("hide");
      });;
    });
  };

  function initActiveTags() {
    if (activeTags[selectAllKey]) {
      $("#select-all-tags").click();
    } else if (activeTags[deselectAllKey]) {
      $("#deselect-all-tags").click();
    } else {
      for (var tagId in activeTags) {
        $("#tag-" + tagId).find("a")[0].click();
      }
    }
  }

  initClickFunctions();
  activeTags = urlParamLib.initParams();
  initActiveTags();

});
