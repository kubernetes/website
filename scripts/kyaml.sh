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

# Renders the example manifests in scripts/kyaml_examples.txt a second time, as
# KYAML, into content/<lang>/examples-kyaml. The conventional YAML under
# content/<lang>/examples stays the source of truth and is never modified; the
# generated tree is read only by the code_sample shortcode, to fill its second
# tab. See scripts/README.md for why, and for what is left out.
#
#   scripts/kyaml.sh generate [lang...]   (re)write content/<lang>/examples-kyaml
#   scripts/kyaml.sh verify   [lang...]   fail if that tree is stale
#
# Language defaults to "en". Requires Go.

set -o errexit
set -o nounset
set -o pipefail

# Pinned so the output is reproducible across contributors and CI. This is the
# formatter that ships with sigs.k8s.io/yaml, as named in KEP-5295.
YAMLFMT="sigs.k8s.io/yaml/yamlfmt@v1.6.0"

# Renderings go in the sibling of the examples tree named for the dialect, which
# is the convention params.codeSampleDialects in hugo.toml and the ignoreFiles
# entry beside it both follow.
DIALECT="kyaml"

LISTED="scripts/kyaml_examples.txt"

# A block scalar rendered into flow style becomes one quoted string with escaped
# line breaks, and a multi-document file defeats the shortcode's check, which
# reads one document. Both render as a single pane instead. A block scalar is
# introduced either by a mapping key (script: |) or by a sequence item (- |),
# and the second is the form a container's command usually takes.
BLOCK_SCALAR='(: *|^[[:space:]]*-[[:space:]]*)[|>][-+0-9]* *$'
DOCUMENT_BREAK='^---'

usage() {
    echo "usage: $0 {generate|verify} [lang...]" >&2
    exit 1
}

# Echoes the listed manifests, one path per line.
listed() {
    sed -e 's/#.*//' -e 's/[[:space:]]*$//' "$LISTED" | grep -v '^$' || true
}

# Fails if the list names a file that is not there. A typo would otherwise
# render nothing and say so to no one. This cannot fold into manifests(), which
# is read from a process substitution and so runs in a subshell, where exiting
# would exit only that. Only the default language is checked: a listed manifest
# need not have been translated, and a locale that has not opted in has no
# generated tree at all.
check_listed() {
    local path
    [ "$1" = en ] || return 0
    while IFS= read -r path; do
        [ -f "content/en/examples/$path" ] && continue
        echo "$LISTED names content/en/examples/$path, which does not exist" >&2
        exit 1
    done < <(listed)
}

# Echoes the listed manifests that get a KYAML rendering for a language,
# relative to its examples directory, minus the ones left out. A path a language
# does not have is a manifest it has not translated.
manifests() {
    local dir="content/$1/examples" file
    [ -d "$dir" ] || return 0
    while IFS= read -r file; do
        [ -f "$dir/$file" ] || continue
        if grep -qE "$BLOCK_SCALAR" "$dir/$file"; then
            echo "$file: no KYAML rendering, it embeds a file in a block scalar" >&2
            continue
        fi
        # The first line may be a document start rather than a separator.
        if tail -n +2 "$dir/$file" | grep -qE "$DOCUMENT_BREAK"; then
            echo "$file: no KYAML rendering, it holds more than one document" >&2
            continue
        fi
        echo "$file"
    done < <(listed)
}

# Writes the KYAML tree for one language into $2, and leaves the number of
# manifests it rendered in $RENDERED.
render() {
    local lang="$1" out="$2" file
    RENDERED=0
    while IFS= read -r file; do
        mkdir -p "$out/$(dirname "$file")"
        "$BIN/yamlfmt" -o kyaml "content/$lang/examples/$file" > "$out/$file"
        RENDERED=$((RENDERED + 1))
    done < <(manifests "$lang")
}

[ $# -ge 1 ] || usage
mode="$1"
shift
langs=("${@:-en}")
case "$mode" in
    generate | verify) ;;
    *) usage ;;
esac

BIN="$(mktemp -d)"
trap 'rm -rf "$BIN"' EXIT
GOBIN="$BIN" go install "$YAMLFMT"

for lang in "${langs[@]}"; do
    generated="content/$lang/examples-$DIALECT"
    check_listed "$lang"

    if [ "$mode" = "generate" ]; then
        rm -rf "$generated"
        render "$lang" "$generated"
        echo "$lang: rendered $RENDERED manifests as KYAML"
        continue
    fi

    staged="$BIN/$lang"
    render "$lang" "$staged"
    diff --recursive --unified "$generated" "$staged" || {
        echo "$generated is stale. Run: scripts/kyaml.sh generate $lang" >&2
        exit 1
    }
    echo "$lang: generated KYAML is up to date"
done

# Staleness is only half of it: a rendering also has to describe what its source
# describes. That half is the code_sample shortcode's, which compares the two
# every time the site builds. See layouts/shortcodes/code_sample.html.
