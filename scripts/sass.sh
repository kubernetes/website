#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo "You must specify a command from the following: build, develop"
    exit 0
fi

__build() {
    echo "Building Kubernetes website CSS from Sass sources..."

    for filename in case-study-styles styles; do
        echo $filename
        sass \
            --style=compressed \
            sass/$filename.sass static/css/$filename.css
    done

    echo "Done building CSS!"
}

__develop() {
    echo "Watching Sass sources for changes..."

    sass \
        --watch \
        sass/styles.sass:static/css/styles.css \
        sass/case-study-styles.sass:static/css/case-study-styles.css
}

case $1 in
    build)
        __build
    ;;

    develop)
        __develop
    ;;
esac
