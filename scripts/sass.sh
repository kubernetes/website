#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo "You must specify a command from the following: build, develop"
    exit 0
fi

case $1 in
    build)

    for filename in case-study-styles styles; do
        echo $filename
        node-sass \
            --output-style compressed \
            sass/$filename.sass static/css/$filename.css
    done

    ;;
esac
