#!/bin/sh
set -e
set -x

bundle
bundle exec jekyll clean
bundle exec jekyll serve -H 0.0.0.0 -P 4000
