let codeListings = document.querySelectorAll('.highlight > pre');

for (let index = 0; index < codeListings.length; index++)
{
  const preElement = codeListings[index];
  const highlightContainer = preElement.parentElement;

  // Skip blocks that are already managed by custom shortcodes. 
  // (K8s uses .code-sample and .includecode)
  if (preElement.closest('.includecode') || preElement.closest('.code-sample')) {
    continue;
  }

  const codeSample = preElement.querySelector('code');
  if (!codeSample) continue;

  // Create a top bar to hold the button
  const topBar = document.createElement("div");
  topBar.className = "generic-copy-bar";
  topBar.style.display = "flex";
  topBar.style.justifyContent = "flex-end";
  topBar.style.alignItems = "center";
  topBar.style.padding = "4px 8px";
  topBar.style.backgroundColor = "rgba(0,0,0,0.05)"; // slight darker than code block bg
  topBar.style.borderBottom = "1px solid rgba(0,0,0,0.1)";
  topBar.style.borderTopLeftRadius = "4px";
  topBar.style.borderTopRightRadius = "4px";

  // Create the text-based copy button
  const copyButton = document.createElement("button");
  copyButton.setAttribute('type', 'button');
  copyButton.textContent = "Copy";
  copyButton.className = "generic-copy-btn";
  copyButton.style.cursor = "pointer";
  copyButton.style.border = "none";
  copyButton.style.background = "transparent";
  copyButton.style.fontWeight = "600";
  copyButton.style.fontSize = "12px";
  copyButton.style.color = "inherit";
  copyButton.style.opacity = "0.7";
  copyButton.style.padding = "4px";

  copyButton.addEventListener('mouseenter', () => copyButton.style.opacity = "1");
  copyButton.addEventListener('mouseleave', () => copyButton.style.opacity = "0.7");

  copyButton.addEventListener('click', () =>
  {
    // Write code directly to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(codeSample.textContent);
    }
    
    // Visual feedback on the button itself
    const originalText = copyButton.textContent;
    copyButton.textContent = "Copied";
    copyButton.style.color = "#28a745"; // Success green text
    copyButton.style.opacity = "1";
    
    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.color = "inherit";
        copyButton.style.opacity = "0.7";
    }, 2000);
  });

  topBar.appendChild(copyButton);

  // Reset margins/padding if necessary so the bar sits flush
  highlightContainer.style.position = 'relative';
  
  // Remove top margin/padding on the `pre` so it seamlessly attaches to our new top bar
  const computedPreStyles = window.getComputedStyle(preElement);
  if (computedPreStyles.marginTop) preElement.style.marginTop = '0';
  if (computedPreStyles.borderTopLeftRadius) preElement.style.borderTopLeftRadius = '0';
  if (computedPreStyles.borderTopRightRadius) preElement.style.borderTopRightRadius = '0';
  
  // Insert the top bar before the <pre> block
  highlightContainer.insertBefore(topBar, preElement);
}
