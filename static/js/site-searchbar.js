function toggleSearchBar() {
    $('.site-searchbar-activate').click(function (evt) {
      evt.preventDefault();
  
      if (window.matchMedia('(min-width: 768px)').matches) {
        $('.site-searchbar').toggle().css('right', '-200px').animate({
          right: '0',
        }, 300);
        $('.site-searchbar > input').focus();
      }
  
      else {
        $('.site-searchbar').toggle();
        $('.site-searchbar > input').focus();
      }
    });
  }
  
  $(document).ready(function () {
    toggleSearchBar();
  
    if (window.matchMedia('(min-width: 768px)').matches) {
      $('.search-close').click(function (evt) {
        evt.preventDefault();
  
        $('.site-searchbar').animate({
          right: '-400px',
        }, 300, function () {
          $('.site-searchbar').fadeOut(200);
          $('.site-searchbar > input').val("");
        });
        $('.site-searchbar').css({ 'right': '' });
      });
  
      $('.site-searchbar > input').blur(function () {
        $('.site-searchbar').animate({
          right: '-400px',
        }, 300, function () {
          $('.site-searchbar').fadeOut(100);
          $('.site-searchbar > input').val("");
        });
        $('.site-searchbar').css({ 'right': '' });
      });
    }
  
    else {
      $('.search-close').click(function (evt) {
        evt.preventDefault();
        $('.site-searchbar > input').val("");
        $('.site-searchbar').toggle();
      });
    }
  
  });