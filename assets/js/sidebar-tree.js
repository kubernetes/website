let splitInstance = null;

function enableSplitter(mediaQuery) {
  if (mediaQuery.matches) {
    if (!splitInstance) {
      splitInstance = Split(["#sidebarnav", "#maindoc"], {
        sizes: [20, 80],
        minSize: 100,
      });
    }
  } else {
    if (splitInstance) {
      splitInstance.destroy();
      splitInstance = null;
    }
  }
}

const screenWidthMediaQuery = window.matchMedia("(min-width: 768px)");

const eleNav = document.getElementById("sidebarnav");
if (eleNav !== null) {
  enableSplitter(screenWidthMediaQuery);
  screenWidthMediaQuery.addListener(enableSplitter);
}