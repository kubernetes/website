#!/bin/bash

MAIN_HUGO_VERSION=$1
NETLIFY_HUGO_VERSION=$(cat netlify.toml | grep HUGO_VERSION | awk '{ print $3 }' | tr -d '"')

echo ${NETLIFY_HUGO_VERSION}

if [[ ${MAIN_HUGO_VERSION} != ${NETLIFY_HUGO_VERSION} ]]; then
    echo """
    [FAILURE] The Hugo version set in the Makefile is ${MAIN_HUGO_VERSION} while the version in netlify.toml is ${NETLIFY_HUGO_VERSION}
    [FAILURE] Please update these versions so that they are same (consider the higher of the two versions as canonical).
    """
    exit 1
else
    echo "[SUCCESS] The Hugo versions match between the Makefile and netlify.toml"
    exit 0
fi

