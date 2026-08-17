// Remembers whether the reader wants example manifests shown as conventional
// YAML (the default) or as KYAML. The choice is site-wide rather than
// per-example, so that a reader picks once and every page follows.
//
// Only the examples in data/kyaml_trial.yaml have both dialects, so most pages
// show one pane and no control whatever is stored here.

(function () {
  var STORAGE_KEY = "code-dialect";
  var dialect = "yaml";
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === "kyaml") {
      dialect = "kyaml";
    }
  } catch (e) {
    // Storage can be unavailable in private browsing modes; the default
    // dialect still works, it just will not be remembered.
  }
  // Set before the body is parsed, so no example is painted in one dialect and
  // then swapped to the other.
  document.documentElement.setAttribute("data-code-dialect", dialect);

  // Which button is pressed cannot be rendered server-side: the page is cached
  // and the choice is not. The panes themselves are switched by CSS on the
  // attribute above, so this only keeps the control, and assistive technology,
  // in step with what is on screen.
  function markPressed() {
    var current = document.documentElement.getAttribute("data-code-dialect");
    var buttons = document.querySelectorAll(".code-dialect-toggle");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        "aria-pressed",
        buttons[i].getAttribute("data-code-dialect") === current ? "true" : "false"
      );
    }
  }

  document.addEventListener("DOMContentLoaded", markPressed);

  document.addEventListener("click", function (event) {
    var toggle = event.target.closest(".code-dialect-toggle");
    if (!toggle) {
      return;
    }
    var picked = toggle.getAttribute("data-code-dialect");
    document.documentElement.setAttribute("data-code-dialect", picked);
    markPressed();
    try {
      window.localStorage.setItem(STORAGE_KEY, picked);
    } catch (e) {
      // Not remembering the choice is not worth failing over.
    }
  });
})();
