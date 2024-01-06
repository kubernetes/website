#!/bin/sh
set -e
if [ "$1" == "--pagefind" ]; then
  printf "Running initial Hugo build...\n" 1>&2
  mkdir -p /tmp/hugo
  hugo --buildFuture --environment development --destination /tmp/hugo --cleanDestinationDir --noBuildLock
  # Run PageFind, once
  printf "PageFind indexing...\n" 1>&2
  pagefind --verbose --source="/tmp/hugo" --bundle-dir="static/_pagefind"
  printf "Running Hugo in server mode...\n" 1>&2
  shift
fi
exec hugo server --buildFuture --environment development --bind 0.0.0.0 --destination /tmp/hugo --cleanDestinationDir --noBuildLock
