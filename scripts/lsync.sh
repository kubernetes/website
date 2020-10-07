#!/bin/bash
#
# This script checks if the English version of a page has changed since a localized
# page has been committed.

if [ "$#" -lt 1 ]; then
  echo -e "\nThis script checks if the English version of a page has changed since a " >&2
  echo -e "localized page has been committed.\n" >&2
  echo -e "Usage:\n\t$0 <PATH>\n" >&2
  echo -e "Example:\n\t$0 content/zh/docs/concepts/_index.md\n" >&2
  exit 1
fi

# Validate paths
VALID=1
for ARG in "$@"
do
  if printf "%s" "$ARG" | grep -E "^/|^\.\./|^\.\.\$|/\.\./|/\.\.\$"; then
    printf "%s: Invalid path \"%s\"\n" "$0" "$ARG" >&2
    VALID=0
  fi
done
if [ $VALID = 0 ]; then
  exit 2
fi

EXITSTATUS=0 # assume success
for LOCALIZED in "$@"
do
  if [ -d "$LOCALIZED" ] ; then
    IS_DIR=1
    EXTRA_FLAGS="--stat"
  else
    IS_DIR=0
  fi

  # Try get the English version
  EN_VERSION="$( printf "%s" "$LOCALIZED" | sed "s/content\/..\//content\/en\//g" )"
  IS_DIR=0
  if [ -d "$LOCALIZED" ]; then
    IS_DIR=1
  fi
  if [ $IS_DIR -eq 1 -a ! -e "$EN_VERSION" ]; then
    printf "Directory \"%s\" has been removed." "${EN_VERSION}" >&2
    EXITSTATUS=2
  else
    if [ -f "$EN_VERSION" ] && ! [ -f "$LOCALIZED" ]; then
      printf "File \"%s\" is missing from the localization\n" "$LOCALIZED" >&2
      if [ $EXITSTATUS -lt 2 ]; then
        EXITSTATUS=1
      fi
      continue
    fi

    if ! [ -f $EN_VERSION ] && ! [ -f "$LOCALIZED" ]; then
      printf "File \"%s\" is missing from upstream (English)\n" "$LOCALIZED" >&2
      continue
    fi

    # Last commit for the localized file
    LASTCOMMIT="$( git log -n 1 --pretty=format:%h -- "$LOCALIZED" )"

    git diff --exit-code $EXTRA_FLAGS "$LASTCOMMIT...HEAD" -- "${EN_VERSION}"

    if [ "$?" -eq 0 ]; then
      printf "File \"%s\" is still in sync\n" "$LOCALIZED" >&2
    else
      if [ $EXITSTATUS -lt 2 ]; then
        EXITSTATUS=1
      fi
    fi
  fi
done

if [ $EXITSTATUS -ne 0 ] && [ "$#" -gt 1 ]; then
  # multiple arguments listed and at least one is out of sync
  printf "Synchronization update required\n" >&2
fi

exit $EXITSTATUS
