#!/bin/bash

# Script to update the local copies of the 4 previous API reference files.
# Set K8S_WEBSITE in your env to your docs website root.

# Usage: ./update-api-references.sh 1.18

if [ -n "$1" ] ; then
    K8S_RELEASE=$1
    echo "Updating previous API reference files for Kubernetes version ${K8S_RELEASE}"
else
    echo "Provide a release version, for example: 1.18"
    exit 1
fi

echo Current working directory: ${K8S_WEBSITE}

# Change to website root to git checkout files
cd ${K8S_WEBSITE}
pwd

# pull out major, minor from K8S_RELEASE
# note: assumes that minor version is increasing, not major version
MINOR_VERSION="$(echo ${K8S_RELEASE} | sed "s/[0-9]\.//g")"
echo minor version ${MINOR_VERSION}

MAJOR_VERSION="$(echo ${K8S_RELEASE} | sed "s/\.[0-9]*//g")"
echo major version ${MAJOR_VERSION}

FIVE=5
RELEASE_MINUS_5="${MAJOR_VERSION}.""$((${MINOR_VERSION} - ${FIVE}))"
echo release version minus five, ${RELEASE_MINUS_5}

# remove last previous API reference directory
if [ -d "static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_5}/" ] ; then
    git rm -rf static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_5}/*
    echo "Removing API reference directory: static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_5}"
else
    echo "Failed to remove last previous API reference."
    echo "Directory does not exist: static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_5}"
fi

i=1
echo "Copying last four previous API references files"
while [ $i -lt ${FIVE} ] ; do
    RELEASE_MINUS_NUM="${MAJOR_VERSION}.""$((${MINOR_VERSION} - ${i}))"
    echo "Copying release version: ${RELEASE_MINUS_NUM}"
    git checkout upstream/release-${RELEASE_MINUS_NUM} static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
    git checkout upstream/release-${RELEASE_MINUS_NUM} static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js

    # Verify that files are copied
    if [ -f "static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html" ] ; then
        echo "Copied API reference files: static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html"
        git add static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
    else
        echo "Failed to copy static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html"
    fi

    if [ -f "static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js" ] ; then
        echo "Copied API reference files: static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js"
        git add static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js
    else
        echo "Failed to copy static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js"
    fi

    ((i++))
done

# git commit static/docs/reference/generated/kubernetes-api/v*/* -m "Update API references, ${K8S_RELEASE}"
echo "Commit the copied API reference files"
