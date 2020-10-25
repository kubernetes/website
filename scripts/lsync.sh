#!/bin/bash
#
# This script checks if the English version of a page has changed since a localized
# page has been committed.

if [ "$#" -ne 1 ] ; then
  echo -e "\nThis script checks if the English version of a page has changed since a " >&2
  echo -e "localized page has been committed.\n" >&2
  echo -e "Usage:\n\t$0 <PATH>\n" >&2
  echo -e "Example:\n\t$0 content/zh/docs/concepts/_index.md\n" >&2
  exit 1
fi

# Check if path exists, and whether it is a directory or a file
if [ ! -e "$1" ] ; then
  echo "Path not found: '$1'" >&2
  exit 2
elif [ -d "$1" ] ; then
  IS_DIR=1
  EXTRA_FLAGS="--stat"
else
  IS_DIR=0
fi
LOCALIZED="$1"

# Try get the English version
EN_VERSION=`echo $LOCALIZED | sed "s/content\/..\//content\/en\//g"`
if [ $IS_DIR -eq 1 -a ! -e $EN_VERSION ]; then
  echo "$EN_VERSION has been removed."
  exit 3
fi

# Last commit for the localized path
LASTCOMMIT=`git log -n 1 --pretty=format:%h -- $LOCALIZED`

git diff --exit-code $EXTRA_FLAGS $LASTCOMMIT...HEAD $EN_VERSION

if [ "$?" -eq 0 ]; then
  echo "$LOCALIZED is still in sync"
  exit 3
fi
