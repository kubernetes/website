$( document ).ready(function() {
  $('div.docsection1 h2').each(function(index) {
    var title = $(this).text();
    var id = $(this).attr("id");

    // inject headers into user journeys table-of-contents (buttons)
    $("#user-journeys-toc").append(`<a href="#section-${index + 1}"><div class="docButton">${index + 1}. ${title}</div></a>`)

    // replace content headers with styled banners
    $(this).replaceWith(`<div class="anchor" id="section-${index + 1}"></div><div class="docssectionheaders" id="${id}"><span class="numberCircle"><span><br><br>${index + 1}</span></span>&nbsp;&nbsp;${title}</div>`)
  });

  var hash = window.location.hash.substr(1);
  // jump to section in URL now that anchors are created
  if (hash.length > 0) {
    $('html, body').animate({
      scrollTop: $(`#${hash}`).offset().top
    }, 100);
  }
});
