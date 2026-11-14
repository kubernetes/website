#!/usr/bin/env bash

# Copyright 2026 The Kubernetes Authors All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Renders example manifests a second time, as KYAML, into
# content/<lang>/examples-kyaml, for the code_sample shortcode's
# variants="kyaml" tab. Which manifests: every file="..." of a code_sample
# that lists kyaml in variants, on any page of that language.
#
#   scripts/kyaml.sh generate [lang...]   (re)write content/<lang>/examples-kyaml
#   scripts/kyaml.sh verify   [lang...]   fail if that tree is stale
#
# Languages default to en plus any language that has examples-kyaml. Requires Go.

set -o errexit
set -o nounset
set -o pipefail

# Pinned so output is reproducible. Formatter from sigs.k8s.io/yaml (KEP-5295).
YAMLFMT="sigs.k8s.io/yaml/yamlfmt@v1.6.0"

usage() {
    echo "usage: $0 {generate|verify} [lang...]" >&2
    exit 1
}

# Echoes the manifests that pages under $1 request as KYAML, one per line.
# Values may be quoted or not; a shortcode must sit on one line.
manifests() {
    grep -rhoE 'code_sample[^}]*' "$@" --include='*.md' --include='*.html' 2>/dev/null |
        grep -E 'variants="?[^" ]*\bkyaml\b' |
        grep -oE 'file="?[^" %>]+' |
        sed -E 's/^file="?//' |
        sort -u || true
}

# Writes the KYAML tree for language $1 into $2. English renders every manifest
# any language requests, because the shortcode falls back to English for a
# manifest that has not been translated.
render() {
    local lang="$1" out="$2" file src pages=("content/$1")
    [ "$lang" = en ] && pages=(content)
    mkdir -p "$out"
    while IFS= read -r file; do
        src="content/$lang/examples/$file"
        # Untranslated: English covers it. A typo fails the Hugo build instead.
        [ -f "$src" ] || continue
        mkdir -p "$out/$(dirname "$file")"
        "$BIN/yamlfmt" -o kyaml "$src" > "$out/$file"
    done < <(manifests "${pages[@]}")
}

cd "$(dirname "$0")/.."

[ $# -ge 1 ] || usage
mode="$1"
shift
# Default: English plus every language that already has generated KYAML.
langs=("$@")
if [ $# -eq 0 ]; then
    mapfile -t langs < <(echo en; find content -mindepth 2 -maxdepth 2 -name examples-kyaml -printf '%h\n' | cut -d/ -f2 | grep -vx en)
fi
case "$mode" in
    generate | verify) ;;
    *) usage ;;
esac

BIN="$(mktemp -d)"
trap 'rm -rf "$BIN"' EXIT
GOBIN="$BIN" go install "$YAMLFMT"

for lang in "${langs[@]}"; do
    [ -d "content/$lang/examples" ] || { echo "no content/$lang/examples" >&2; exit 1; }
    generated="content/$lang/examples-kyaml"
    if [ "$mode" = generate ]; then
        rm -rf "$generated"
        render "$lang" "$generated"
        rmdir "$generated" 2>/dev/null && echo "$lang: no page requests KYAML" && continue
        echo "$lang: KYAML written to $generated"
        continue
    fi
    render "$lang" "$BIN/$lang"
    if ! diff --recursive --unified --new-file "$generated" "$BIN/$lang"; then
        echo "$generated is stale. Run: scripts/kyaml.sh generate $lang" >&2
        exit 1
    fi
    echo "$lang: generated KYAML is up to date"
done
