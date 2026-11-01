document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bluesky-feed-container");
  if (!container) return;

  const handle = container.dataset.handle;
  const limit = container.dataset.limit || 3;
  const template = document.getElementById("bluesky-post-template");
  const fallback = document.getElementById("bluesky-feed-fallback");

  fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=${limit}`)
    .then(res => {
      if (!res.ok) throw new Error("Bluesky feed unavailable");
      return res.json();
    })
    .then(data => {
      container.innerHTML = "";
      data.feed.forEach(item => {
        const post = item.post;
        const clone = template.content.cloneNode(true);

        clone.querySelector('[data-field="text"]').textContent = post.record.text;
        clone.querySelector('[data-field="date"]').textContent = new Date(post.indexedAt).toLocaleDateString();
        const link = clone.querySelector('[data-field="link"]');
        link.href = `https://bsky.app/profile/${handle}/post/${post.uri.split("/").pop()}`;

        container.appendChild(clone);
      });
    })
    .catch(() => {
      container.hidden = true;
      fallback.hidden = false;
    });
});