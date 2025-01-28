$(document).ready(function() {
  function setCookie(name, value, days) {
    let expires = "";
    let date = new Date(); // Create a new Date object
    let dateToSecond = 24 * 60 * 60 * 1000;

    if (days) {
      date.setTime(date.getTime() + days * dateToSecond); // Modify the existing Date object
      expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? "true" : undefined;
  }

  /* Check the presence of a cookie */
  var announcement = $('#announcement');
  if (announcement) {
    let token = `announcement_ack_${announcement.attr('data-announcement-name').replace(/\s/g, '_')}`; // Generate the unique token for announcement
    let acknowledged = getCookie(token);
    if (acknowledged === "true") {
      announcement.remove(); // Remove the announcement if the cookie is set
    }
    else {
      announcement.removeClass('announcement-shown').addClass('announcement-shown'); // Display the announcement if the cookie is not set
    }

    /* Driver code to set the cookie */
    var button = $('#banner-dismiss');
    var ttlInDays = button.attr('data-ttl'); // Allows setting a cookie with time to live parameter
    button.bind('click', function() {
      setCookie(token, "true", ttlInDays);
      $('#announcement').remove();
    });
    button.removeAttr('style'); // make button visible
  }
});
