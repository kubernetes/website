$( document ).ready(function() {
  var expandText = "[+]";
  var closeText = "[-]";

  $(".canonical-tag").each(function(){
    var placeholder = $("#placeholder");
    var targetTag = $(this).data("target");
    $(this).mouseenter(function(){
      var tagDescription = $("#" + targetTag).html();
      placeholder.html(tagDescription);
      placeholder.removeClass('invisible');
    }).mouseleave(function(){
      placeholder.addClass('invisible');
    });

    $(this).click(function(){
      var shouldHide = $(this).hasClass("active-tag");
      var targetClass = "." + targetTag;

      if (shouldHide) {
        $(this).removeClass("active-tag");
        $(targetClass).each(function(){
          var showCount = $(this).data("show-count");
          var newShowCount = showCount - 1;
          $(this).data("show-count", newShowCount);
          if (newShowCount < 1) {
            $(this).addClass("hide");
          }
        });
      } else {
        $(this).addClass("active-tag");
        $(targetClass).each(function(){
          var showCount = $(this).data("show-count");
          var newShowCount = showCount + 1;
          $(this).data("show-count", newShowCount);
          if (newShowCount > 0) {
            $(this).removeClass("hide");
          }
        });
      }
    });
  });

  $("#select-all-tags").click(function(){
    $(".canonical-tag").each(function(){
      var active = $(this).hasClass("active-tag");
      if (!active) {
        $(this).click();
      }
    });
  });

  $("#deselect-all-tags").click(function(){
    $(".canonical-tag").each(function(){
      var active = $(this).hasClass("active-tag");
      if (active) {
        $(this).click();
      }
    });
  });

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
});
