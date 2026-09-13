(function () {
  function getCodeText(container) {
    var code = container.querySelector("pre code");
    if (!code) {
      code = container.querySelector("pre");
    }
    return code ? code.innerText : "";
  }

  function showFeedback(button, message, isError) {
    var label = button.querySelector(".copy-codeblock-text");
    var original = button.getAttribute("aria-label") || "";
    button.classList.toggle("copy-codeblock-copied", !isError);
    button.classList.toggle("copy-codeblock-error", !!isError);
    if (label) {
      label.textContent = message;
    }
    button.setAttribute("aria-label", message);
    button.setAttribute("aria-live", "polite");
    window.setTimeout(function () {
      button.classList.remove("copy-codeblock-copied", "copy-codeblock-error");
      if (label) {
        label.textContent = "";
      }
      button.setAttribute("aria-label", original);
    }, 2000);
  }

  function fallbackCopy(text, onSuccess, onFailure) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      var ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (ok) {
        onSuccess();
      } else {
        onFailure();
      }
    } catch (err) {
      document.body.removeChild(textarea);
      onFailure();
    }
  }

  function copyText(text, onSuccess, onFailure) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess, function () {
        fallbackCopy(text, onSuccess, onFailure);
      });
    } else {
      fallbackCopy(text, onSuccess, onFailure);
    }
  }

  function init() {
    document.querySelectorAll(".codeblock-with-copy").forEach(function (container) {
      var button = container.querySelector(".copy-codeblock");
      if (!button || button.dataset.initialized) {
        return;
      }
      button.dataset.initialized = "true";
      button.addEventListener("click", function () {
        var text = getCodeText(container);
        if (!text) {
          return;
        }
        var copiedLabel = button.dataset.copiedLabel || "Copied!";
        copyText(
          text,
          function () {
            showFeedback(button, copiedLabel, false);
          },
          function () {
            showFeedback(button, "!", true);
          }
        );
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
