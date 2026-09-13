document.addEventListener("click", (e) => {

  const button=e.target.closest(".copy-codeblock");
  if (!button) return;

  const block=button.closest(".codeblock-with-copy");
  const text=block?.querySelector("pre code")?.textContent;
  if (!text) return;

  navigator.clipboard.writeText(text);
});
