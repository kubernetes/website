$( document ).ready(function() {
  //default UI state
  var selected = {
      type: 'users',
      button: 'app-developer',
      level: 'foundational'
  };

  //load persona JSON data structure
  function loadInfo() {
    return JSON.parse($('#user-persona-data').html());
  }

  //create persona buttons in "I am..." section, e.g. Application Developer
  function buildCards(info) {
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

  //generate HTML for info links
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
                '<i class="fa '+linkIcon+'" aria-hidden="true" style="padding:%;float:left;color:#3371e3"></i>' +
              '</div>' +
              '<div id="info'+i+'" class="data">'+linkLabel+'</div>' +
            '</div></a>';

    return html;
  }

  //set links in the "I want to..." section, e.g. Setup a development environment
  function setInfoData(info, level) {
      // info links specific to type/button/level
      var contentArray = (typeof info[selected.type][selected.button] !== 'undefined') 
        ? info[selected.type][selected.button][selected.level] 
        : [{
            label: 'Please select a role or persona in the "I AM..." section above.'
            ,url: '#cardWrapper'
            ,icon: 'fa-exclamation'
          }];

      //clear contents of #infobarLinks div
      $('#infobarLinks').empty();
      //process and add each info link
      for(i = 1; i<=contentArray.length; i++) {
          var content = contentArray[i-1];

          //append link to the end of the div
          $('#infobarLinks').append(getInfoLinkHtml(i,content.label,content.url,content.icon));
      }
      $('.infobarWrapper').css('visibility', 'visible');
  }

  //attach click handler + scroll for persona buttons in "I am..." section
  function handleCardClick(e, stopScroll) {
      $('.buttons').removeClass('selected');
      $(this).addClass('selected');
      if(!stopScroll){
        $('html,body').animate({scrollTop: $("#subTitle").offset().top},'slow');
      }
      $(e.currentTarget).addClass('selected');
      selected.button = e.currentTarget.getAttribute('data-button');
      var cardText = e.currentTarget.innerText;
      $('#subTitle').text(cardText);
      $('.tab1.foundational').click();
  }

  //attach click handler for Users, Contributors, Migration Paths buttons
  function attachCardEvents(info) {
    $('.bar1 .navButton').on('click', function(e) {
        $('.navButton').removeClass("keepShow");
        $(this).addClass("keepShow");
        var type = '';

        $('.cards > div').hide();

        if (/users/.test(e.currentTarget.className)) {
          $('.card_users').show();
          type = 'users';
        }
        else if (/contributors/.test(e.currentTarget.className)) {
          $('.card_contributors').show();
          type = 'contributors';
        }
        else if (/migrators/.test(e.currentTarget.className)) {
          $('.card_migrators').show();
          type = 'migrators';
        }
        selected.type = type;
        //selected.button = Object.keys(info[type])[0]; //set button to first in list
    });

    $('.bar1 .users').click();

    setTimeout(function() {
      var el = {'currentTarget' : $('div[data-button="app-developer"')[0]};
      handleCardClick(el, true);
    },200);

    $('.cards .buttons').on('click', handleCardClick);

    $('.tab1').on('click', function(e) {
        $('.tab1').removeClass('selected');
        $(this).addClass('selected');
        var level = e.currentTarget.className.match(/(?:tab1 )(.+)(?:selected)$/)[1].trim();
        selected.level = level;
        setInfoData(info, level);
    });
  }

  //initialize page and load defaults
  function main() {
    var info = loadInfo();
    buildCards(info);
    attachCardEvents(info);

    setTimeout(function() {
      $("#beginner").trigger('click');
    }, 500);
  }

  //execute page initialization
  main();
});

//hide persona wizard section if Browse Docs button is clicked
function showOnlyDocs(flag){
  if(flag){
    jQuery('.applicationDeveloperContainer').hide();
    jQuery('.infobarWrapper').hide();
    jQuery('#cardWrapper').hide()
  }else{
    jQuery('.applicationDeveloperContainer').show();
    jQuery('.infobarWrapper').show();
    jQuery('#cardWrapper').show()
  }
}
