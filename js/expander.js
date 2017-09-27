$( document ).ready(function() {
  var expandText = "[+]";
  var closeText = "[-]";

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
