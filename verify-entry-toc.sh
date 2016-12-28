#!/bin/bash

no_entry=false

# Verify all docs/.../*.md files are referenced in at least one of _data/*.yml
# files. Skip checking files in skip_toc_check.txt
for file in `find docs -name "*.md" -type f`; do 
  if ! grep -q "${file}" skip_toc_check.txt; then
    path=${file%.*}
    # abc/index.md should point to abc, not abc/index
    path=${path%%index}
    if ! grep -q "${path}" _data/*.yml; then
      echo "Error: ${file} doesn't have an entry in the table of contents under _data/*.yml" 
      no_entry=true
    fi
  fi
done

if ${no_entry}; then 
  echo "Found files without entries. For how to fix it, see http://kubernetes.io/docs/contribute/write-new-topic/#creating-an-entry-in-the-table-of-contents"
  exit 1
fi
