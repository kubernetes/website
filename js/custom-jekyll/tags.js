$( document ).ready(function() {
  // Shows permalink when term name is hovered over
  $(".glossary-injector").each(function() {
    var placeholder = $("#" + $(this).data("placeholder-id"));
    var originalContent = placeholder.html();

    var glossaryDef = $($(this).find(".injector-def")[0]).html();

    $(this).mouseenter(function() {
      placeholder.html(glossaryDef);
    }).mouseleave(function(){
      placeholder.html(originalContent);
    });
  });
});
