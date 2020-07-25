#!/bin/sh
# Update release data based on GitHub information

# Test for prerequisites
if ! ( printf "[]" | jq . > /dev/null ); then
    printf "jq: not found or misconfigured\n" 1>&2
    exit 1
fi
if ! ( curl --version > /dev/null ); then
    printf "curl: not found or misconfigured\n" 1>&2
    exit 1
fi

page_1_headers="$( curl -I https://api.github.com/repositories/20580498/releases )"

page_count="$( printf "%s" "${page_1_headers}" | grep -i ^link: | cut -d : -f 2- | tr , \\n | grep '; *rel="last"' | grep releases?page= | sed -e 's/^.*?page=//' -e 's/>.*$//' )"

data_file_dates="data/releases/dates.json"

releases_data="$(
  seq 1 "${page_count}" | while read count; do
    curl -q -L -H 'Accept: application/json' "https://api.github.com/repos/kubernetes/kubernetes/releases?page=${count}" | jq '.[] | select(.name | test("^v[1-9][0-9]*\\.[0-9]+\\.[0-9]+$")) | {"name": .name,"date": .published_at,"details": .body }' || exit 1
  sleep 0.1
  done | jq -s '. | sort_by(.name | ltrimstr("v") | split(".") |  map(. | tonumber)) '
)"

printf "%s\n" "${releases_data}" | tee "$(git rev-parse --show-toplevel)/${data_file_dates}" || exit 1

printf "Release data updated: %s\n" "${data_file_dates}" 1>&2
