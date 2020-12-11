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

TARGET=HEAD

find_merge() {
  if [ "$1" == "" ]; then
    return 1
  fi
  git rev-list "$1..${TARGET}" --ancestry-path | grep -f <( git rev-list "$1..${TARGET}" --first-parent ) | tail -1
}

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
    DIRSTATUS=0
  else
    IS_DIR=0
  fi

  # Try get the English version
  EN_VERSION="$( printf "%s" "$LOCALIZED" | sed "s/content\/..\//content\/en\//g" | tr -d \\n )"
  if [ $IS_DIR -gt 0 ] && ! [ -e "$EN_VERSION" ] ; then
    printf "Directory \"%s\" does not exist upstream (English).\n" "${EN_VERSION}" >&2
    EXITSTATUS=2
  else
    if [ $IS_DIR -lt 1 ] && [ -f "$EN_VERSION" ] && ! [ -f "$LOCALIZED" ]; then
      printf "File \"%s\" is missing from the localization\n" "$LOCALIZED" >&2
      if [ $EXITSTATUS -lt 2 ]; then
        EXITSTATUS=1
      fi
      continue
    fi

    if [ $IS_DIR -lt 1 ] && ! [ -f $EN_VERSION ] && ! [ -f "$LOCALIZED" ]; then
      printf "File \"%s\" is missing from upstream (English)\n" "$LOCALIZED" >&2
      continue
    fi

    # Last merge for the localized file
    LAST_MERGE="$( find_merge "$( git log -n 1 --pretty=format:%h -- "$LOCALIZED" )" )"
    # Merge base for that pull request
    LAST_DIVERGE="$( git merge-base "${LAST_MERGE}^2" "$TARGET" )"

    if [ $IS_DIR -gt 0 ]; then
      git diff --name-only --exit-code "$LAST_DIVERGE...${TARGET}" -- "$EN_VERSION" >/dev/null 2>&1 || \
        printf "\033[34mChanges since commit \033[32m%s\033[0m\n" "$( git rev-parse --short "$LAST_DIVERGE" )" >&2
      git diff --stat --exit-code "$LAST_DIVERGE...${TARGET}" -- "$EN_VERSION"
    else
      # Changes to English localization since base of last localization merge
      git diff --exit-code "$LAST_DIVERGE...${TARGET}" -- "${EN_VERSION}"
    fi

    if [ $? -eq 0 ]; then
      printf "\033[34mPath \"%s\" is still in sync\033[0m\n" "$LOCALIZED" >&2
    else
      if [ $EXITSTATUS -lt 2 ]; then
        EXITSTATUS=1
      fi
    fi
  fi
done

if [ $EXITSTATUS -ne 0 ] && [ "$#" -gt 1 ]; then
  # multiple arguments listed and at least one is out of sync
  printf "\n\033[31mSynchronization update required\033[0m\n" >&2
fi

exit $EXITSTATUS
