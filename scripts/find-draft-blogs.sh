#!/usr/bin/env bash
# This script scans the blog directory for posts merged into main but still marked draft: true,
# then writes a summary table to the repo wiki for visibility.
set -euo pipefail

#  Configuration
REPO="${REPO:?REPO environment variable must be set}"
BASE_REF="${BASE_REF:-main}"
WIKI_REPO="https://x-access-token:${GH_TOKEN}@github.com/${REPO}.wiki.git"
WIKI_DIR="$(mktemp -d)/wiki"
WIKI_PAGE="Draft-Blog-Tracker.md"
CURRENT_YEAR=$(date +%Y)



# Fetch the full file tree, filter to this year's blog posts, then check each
# file's front matter for draft: true. Outputs one markdown table row per match.
gh api "repos/${REPO}/git/trees/${BASE_REF}?recursive=1" \
  --jq '.tree[].path' \
| grep -E "^content/en/blog/_posts/(${CURRENT_YEAR})/([^/]+/)?[^/]+\.md$" \
| while read -r path; do
    content="$(gh api \
      -H "Accept: application/vnd.github.raw" \
      "repos/${REPO}/contents/${path}?ref=${BASE_REF}" 2>/dev/null || true)"

    # Skip if file couldn't be fetched
    [ -z "$content" ] && continue
    echo "$content" | grep -q '"status":"404"' && continue

    # Skip if not a draft
    DRAFT_LINE=$(echo "$content" | tr -d '\r' | grep -iE '^draft:[[:space:]]*true[[:space:]]*$' || true)
    [ -z "$DRAFT_LINE" ] && continue

    TITLE=$(echo "$content" | tr -d '\r' | grep -m1 -E '^title:' \
      | sed 's/^title:[[:space:]]*//' | tr -d '"'"'" || echo "(no title)")
    GH_URL="https://github.com/${REPO}/blob/${BASE_REF}/${path}"
    echo "| ${TITLE} | \`${path}\` | [View](${GH_URL}) |"
done > /tmp/draft_rows.txt

# Early exit if nothing found 
ROW_COUNT=$(wc -l < /tmp/draft_rows.txt | tr -d ' ')
if [ "$ROW_COUNT" -eq 0 ]; then
  echo "No draft blogs found. Wiki will not be updated."
  exit 0
fi

echo "Found ${ROW_COUNT} draft blog(s). Updating wiki..."

# Update wiki 
git clone "$WIKI_REPO" "$WIKI_DIR"

cat > "${WIKI_DIR}/${WIKI_PAGE}" <<EOF
# Blog Posts Pending Publication

These blog posts have been merged into main but still marked \`draft: true\` awaiting final publication.

## Pending Publication
| Title | Path | Link |
|-------|------|------|
$(cat /tmp/draft_rows.txt)
EOF

cd "$WIKI_DIR"
git config user.email "draft-blog-bot@users.noreply.github.com"
git config user.name "github-actions[bot]"
git add "$WIKI_PAGE"
git diff --cached --quiet && echo "No changes to wiki." && exit 0
git commit -m "chore: update draft blog list [$(date -u '+%Y-%m-%d')]"
git push

# Cleanup 
rm -rf "$WIKI_DIR" /tmp/draft_rows.txt