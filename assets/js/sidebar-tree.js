let splitInstance = null;

function enableSplitter(mediaQuery) {
  if (mediaQuery.matches) {
    if (!splitInstance) {
      splitInstance = Split([".td-sidebar", ".docs-main-content",".td-sidebar-toc"], {
        sizes: [15, 72, 13],
        minSize: 100,
        gutterSize: 8 // pixels
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

const eleNav = document.getElementById("nav-sidebar");
if (eleNav !== null) {
  enableSplitter(screenWidthMediaQuery);
  screenWidthMediaQuery.addListener(enableSplitter);
}
