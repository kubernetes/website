#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:?REPO environment variable must be set}"      
BASE_REF="${BASE_REF:-main}"
WIKI_REPO="https://x-access-token:${GH_TOKEN}@github.com/${REPO}.wiki.git"
WIKI_DIR="$(mktemp -d)/wiki"
WIKI_PAGE="Unpublished-Blogs.md" 
CURRENT_YEAR=$(date +%Y)
LAST_YEAR=$((CURRENT_YEAR - 1))

echo "Scanning ${REPO} for blog posts with draft:true on ${BASE_REF}..."
echo

# Step 1: Find all draft blogs from main file tree
gh api "repos/${REPO}/git/trees/${BASE_REF}?recursive=1" \
  --jq '.tree[].path' \
| grep -E "^content/en/blog/_posts/(${CURRENT_YEAR}|${LAST_YEAR})/([^/]+/)?[^/]+\.md$" \
| while read -r path; do

  content="$(gh api \
    -H "Accept: application/vnd.github.raw" \
    "repos/${REPO}/contents/${path}?ref=${BASE_REF}" 2>/dev/null || true)"

  [ -z "$content" ] && continue
  echo "$content" | grep -q '"status":"404"' && continue

  DRAFT_LINE=$(echo "$content" | grep -iE '^draft:[[:space:]]*true[[:space:]]*$' || true)
  [ -z "$DRAFT_LINE" ] && continue

  TITLE=$(echo "$content" | grep -m1 -E '^title:' \
    | sed 's/^title:[[:space:]]*//' | tr -d '"'"'" || echo "(no title)")
  GH_URL="https://github.com/${REPO}/blob/${BASE_REF}/${path}"

  echo "| ${TITLE} | \`${path}\` | [View](${GH_URL}) |"

done > /tmp/draft_rows.txt

ROW_COUNT=$(wc -l < /tmp/draft_rows.txt | tr -d ' ')

if [ "$ROW_COUNT" -eq 0 ]; then
  echo "No draft blogs found."
  exit 0
fi

echo "Found ${ROW_COUNT} draft blog(s). Updating wiki..."

# Step 2: Clone wiki
git clone "$WIKI_REPO" "$WIKI_DIR"

# Step 3: Generate wiki page
cat > "${WIKI_DIR}/${WIKI_PAGE}" <<EOF
# Draft Blog Posts (Merged but Unpublished)

These blog posts have been **merged into main** but still have \`draft: true\` in their front matter .

## Pending Publication

| Title | Path | Link |
|-------|------|------|
$(cat /tmp/draft_rows.txt)

EOF

# Step 4: Commit and push
cd "$WIKI_DIR"
git config user.email "draft-blog-bot@users.noreply.github.com"
git config user.name "github-actions[bot]"
git add "$WIKI_PAGE"
git diff --cached --quiet && echo "No changes to wiki." && exit 0
git commit -m "chore: update draft blog list [$(date -u '+%Y-%m-%d')]"
git push

# Cleanup
rm -rf "$WIKI_DIR" /tmp/draft_rows.txt

