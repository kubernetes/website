#!/bin/bash

# Script to update the four previous API reference files.
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
    echo "Could not remove last previous API reference."
    echo "Directory does not exist: static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_5}"
fi

i=1
echo "Copying last four previous API references files"

# Update previous index.html files until all API reference index.html files use
# the same paths to asset locations

while [ $i -lt ${FIVE} ] ; do
    RELEASE_MINUS_NUM="${MAJOR_VERSION}.""$((${MINOR_VERSION} - ${i}))"
    echo "Copying release version: ${RELEASE_MINUS_NUM}"

    # remove the existing index.html
    if [ -f "static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html" ] ; then
        rm static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
    fi

    git checkout upstream/release-${RELEASE_MINUS_NUM} static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html

    if [ -f "static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html" ] ; then
        echo "Copied API reference file: static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html"

        # There are four versions that use a previous version of the stylesheet.
        # Also, four versions have paths to assets that are different from the assets in site's static directory.
        # Rewrite paths to assets for versions 1.14, 1.15, 1.16, 1.17
        # Use previous style_apiref_prev.css instead of style_apiref.css
        MINUS_NUM=$((${MINOR_VERSION} - ${i}))
        if [ ${MINUS_NUM} -ge 14 ] || [ ${MINUS_NUM} -lt 17 ] ; then
            sed -i -e "s/css\/stylesheet.css/\/css\/style_apiref_prev.css/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
            sed -i -e "s/css\/bootstrap.min.css/\/css\/bootstrap-4.3.1.min.css/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
            sed -i -e "s/css\/font-awesome.min.css/\/css\/fontawesome-4.7.0.min.css/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html

            sed -i -e "s/^<SCRIPT[[:space:]]src=\"\/js\/jquery-3.2.1.min.js\"/<SCRIPT src=\"\/js\/jquery-3.3.1.min.js\"/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
            sed -i -e "s/^<SCRIPT[[:space:]]src=\"jquery.scrollTo.min.js\"/<SCRIPT src=\"\/js\/jquery.scrollTo-2.1.2.min.js\"/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
            sed -i -e "s/^<SCRIPT[[:space:]]src=\"navData.js\"/<SCRIPT src=\"js\/navData.js\"/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
            sed -i -e "s/^<SCRIPT[[:space:]]src=\"scroll.js\"/<SCRIPT src=\"\/js\/scroll-apiref.js\"/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
        fi

        # version 1.17 asset paths are slightly different
        if [ ${MINUS_NUM} -eq 17 ] ; then
            sed -i -e "s/css\/stylesheet.css/\/css\/style_apiref_prev.css/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
            sed -i -e "s/css\/bootstrap.min.css/\/css\/bootstrap-4.3.1.min.css/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
            sed -i -e "s/css\/font-awesome.min.css/\/css\/fontawesome-4.7.0.min.css/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html

            sed -i -e "s/^<SCRIPT[[:space:]]src=\"\/js\/jquery-3.2.1.min.js\"/<SCRIPT src=\"\/js\/jquery-3.3.1.min.js\"/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
            sed -i -e "s/^<SCRIPT[[:space:]]src=\"js\/jquery.scrollTo.min.js\"/<SCRIPT src=\"\/js\/jquery.scrollTo-2.1.2.min.js\"/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
            sed -i -e "s/^<SCRIPT[[:space:]]src=\"js\/scroll.js\"/<SCRIPT src=\"\/js\/scroll-apiref.js\"/g" static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
        fi
# 1.14- 1.16
#<SCRIPT src="/js/jquery-3.2.1.min.js"></SCRIPT>
#<SCRIPT src="jquery.scrollTo.min.js"></SCRIPT>
#<SCRIPT src="/js/bootstrap-4.3.1.min.js"></SCRIPT>
#<SCRIPT src="navData.js"></SCRIPT>
#<SCRIPT src="scroll.js"></SCRIPT>

# 1.17
#<SCRIPT src="/js/jquery-3.2.1.min.js"></SCRIPT>
#<SCRIPT src="js/jquery.scrollTo.min.js"></SCRIPT>
#<SCRIPT src="/js/bootstrap-4.3.1.min.js"></SCRIPT>
#<SCRIPT src="js/navData.js"></SCRIPT>
#<SCRIPT src="js/scroll.js"></SCRIPT>

# 1.18
#<SCRIPT src="/js/jquery-3.3.1.min.js"></SCRIPT>
#<SCRIPT src="/js/jquery.scrollTo-2.1.2.min.js"></SCRIPT>
#<SCRIPT src="/js/bootstrap-4.3.1.min.js"></SCRIPT>
#<SCRIPT src="js/navData.js"></SCRIPT>
#<SCRIPT src="/js/scroll-apiref.js"></SCRIPT>

        git add static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html
    else
        echo "Failed to copy static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/index.html"
    fi

    # Try to copy js/navData.js; For some versions, navData.js is at the root directory
    git checkout upstream/release-${RELEASE_MINUS_NUM} static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js

    # This is a temporary check, until the paths to assets are synced up.
    if [ -f "static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js" ]; then
        echo "Copied API reference file: static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js"
        git add static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js
    else
        echo "Trying to check out static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/navData.js"
        git checkout upstream/release-${RELEASE_MINUS_NUM} static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/navData.js

        if [ -f "static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/navData.js" ] ; then
            mkdir static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js
            mv static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/navData.js static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js
            echo "Copied API reference files: static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js"
            git add static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/js/navData.js
            git rm static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/navData.js
        else
            echo "Failed to copy static/docs/reference/generated/kubernetes-api/v${RELEASE_MINUS_NUM}/navData.js"
        fi
    fi

    ((i++))
done

# git commit static/docs/reference/generated/kubernetes-api/v*/* -m "Update API references, ${K8S_RELEASE}"
echo "Commit the copied API reference files"
