#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd $DIR

rm ../code-of-conduct.md
rm ../editdocs.md
rm ../404.md

rm -rf ../_includes
rm -rf ../css
rm -rf ../js
rm -rf ../fonts
rm -rf ../images
rm -rf ../docs
rm -rf ../blog
rm -rf ../cn
rm -rf ../case-studies
rm -rf ../community
rm -rf ../partners
rm -rf ../_layouts
rm -rf ../_data
rm -rf ../_includes
rm -rf ../_plugins
rm -rf ../_sass
rm -rf ../fonts

popd