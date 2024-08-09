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

  let announcement = document.querySelector("#announcement");

  if(announcement){
    let announcementName = announcement.getAttribute('data-announcement-name');
    if(announcementName){
      let token = `announcement_ack_${announcementName.replace(/\s/g, '_')}`;
      let acknowledged = getCookie(token);

      if(acknowledged == "true"){
        announcement.remove();
      }
      else{
        announcement.classList.add('display-announcement');
      }

    }
    else{
      console.log("Attribute 'data-announcement-name' is null or undefined.");
    }
  }
  else{
    console.log("Element with id 'announcement' not found.");
  }



  /* Driver code to set the cookie */
  let button = document.querySelector('#banner-dismiss');
  if(button){
     button.removeAttribute('style');
     button.addEventListener('click', function() {
        setCookie(token, "true", 
        button.getAttribute('data-ttl')); // Set a cookie with time to live parameter
        announcement.remove();
    });
  }
  else{
    console.log("Element with id 'banner-dismiss' not found.");
  }
  
});
