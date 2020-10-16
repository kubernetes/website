#!/bin/bash
#
# This script checks if the English version of a page has changed since a localized
# page has been committed.

if [ "$#" -ne 1 ] || ! [ -f "$1" ]; then
  echo -e "\nThis script checks if the English version of a page has changed since a "
  echo -e "localized page has been committed.\n"
  echo -e "Usage:\n\t$0 <PATH>\n" >&2
  echo -e "Example:\n\t$0 content/zh/docs/concepts/_index.md\n" >&2
  exit 1
fi

LOCALIZED="$1"

# Try get the English version
EN_VERSION=`echo $LOCALIZED | sed "s/content\/..\//content\/en\//g"`
if ! [ -f $EN_VERSION ]; then
  echo "$EN_VERSION has been removed."
  exit 2
fi

# Last commit for the localized file
LASTCOMMIT=`git log -n 1 --pretty=format:%h -- $LOCALIZED`

git diff --exit-code $LASTCOMMIT...HEAD $EN_VERSION

if [ "$?" -eq 0 ]; then
  echo "$LOCALIZED is still in sync"
  exit 3
fi
