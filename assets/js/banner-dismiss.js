$(document).ready(function() {
  function setCookie(name, value, days, expiresAtUnix) {
    let expires = "";
    let dayInMs = 24 * 60 * 60 * 1000;

    if (expiresAtUnix) {
      expires = "; expires=" + new Date(expiresAtUnix * 1000).toUTCString();
    } else if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * dayInMs);
      expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + value + expires + "; path=/";
  }

  // Returns the decoded cookie value if found, otherwise undefined.
  function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  function getTokenName() {
    let announcement_name_rewritten = announcement.getAttribute('data-announcement-name').replace(/\s/g, '_');
    let token = 'announcement_ack_'+announcement_name_rewritten; // Generate the unique token for this announcement
    return token;
  }

  /* Check the presence of a cookie */
  let announcement = document.querySelector("#announcement");
  if (announcement) {
    let announcement_name_rewritten = announcement.getAttribute('data-announcement-name').replace(/\s/g, '_');
    let tokenName = getTokenName();
    let acknowledged = getCookie(tokenName);
    if (acknowledged) {
      announcement.remove(); // Remove the announcement if the cookie is set
    }
    else {
      announcement.classList.add('display-announcement') // Display the announcement if the cookie is not set
    }
  }

  /* Driver code to set the cookie */
  let button = document.querySelector('#banner-dismiss');
  if (button) {
    let tokenName = getTokenName();
    button.removeAttribute('style');
    button.addEventListener('click', function() {
      setCookie(tokenName, "true",
        button.getAttribute('data-ttl'),
        button.getAttribute('data-expires-at'));
      announcement.remove();
    });
  }
});
