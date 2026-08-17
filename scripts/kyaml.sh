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

# Renders a few example manifests a second time, as KYAML, so that their pages
# can carry both dialects. The conventional YAML under content/<lang>/examples
# stays the source of truth and is never modified; the KYAML under
# content/<lang>/examples-kyaml is generated and should not be edited by hand.
#
# Which manifests get a second rendering is data/kyaml_trial.yaml, the same list
# the code_sample shortcode reads to decide which examples offer a choice. One
# list, so a rendering cannot exist for a page that will not show it, and a page
# cannot ask for one that was never generated.
#
# The conventional YAML is what lives at the documented URL, so a reader who
# runs `kubectl apply -f https://k8s.io/examples/pods/simple-pod.yaml` fetches
# the same bytes as before. The generated tree is only ever read by the
# code_sample shortcode to fill the second pane, which is hidden for now. Making
# KYAML the dialect readers see, and the one that URL serves, is a follow-up.
#
#   scripts/kyaml.sh generate [lang...]   (re)write content/<lang>/examples-kyaml
#   scripts/kyaml.sh verify   [lang...]   fail if the tree is stale, or if it
#                                         renders manifests the source does not
#
# Language defaults to "en". Requires Go. See scripts/README.md for scope.

set -o errexit
set -o nounset
set -o pipefail

# Pinned so the output is reproducible across contributors and CI. This is the
# formatter that ships with sigs.k8s.io/yaml, as named in KEP-5295.
YAMLFMT="sigs.k8s.io/yaml/yamlfmt@v1.6.0"

# The manifests offered in both dialects, read by the shortcode as well.
TRIAL="data/kyaml_trial.yaml"

# Manifests the formatter cannot parse, and which therefore get no KYAML
# rendering at all. Keep this list at the files with a mechanical reason: an
# entry here opts a manifest out of every check below, so it is the one place
# where a manifest can hide. failure-policy-ignore.yaml uses '...' to stand in
# for the omitted spec, and '...' is YAML's document-end marker; filesIgnore in
# content/en/examples/examples_test.go leaves it out for the same reason.
SKIP=(
    "validatingadmissionpolicy/failure-policy-ignore.yaml"
)

# Manifests that embed a file in a block scalar get no KYAML rendering either:
# KYAML is flow style, and a block scalar rendered into flow style becomes one
# quoted string with escaped line breaks a reader can neither follow nor paste.
# Matching a pattern rather than listing paths covers examples added later.
BLOCK_SCALAR=': *[|>][-+0-9]* *$'

usage() {
    echo "usage: $0 {generate|verify} [lang...]" >&2
    exit 1
}

# Echoes the trial manifests, one path per line, with the list's leading dashes,
# comments and blank lines removed.
trial() {
    sed -e 's/^[[:space:]]*-[[:space:]]*//' -e 's/#.*//' -e 's/[[:space:]]*$//' \
        "$TRIAL" | grep -v '^$' || true
}

# Echoes the trial manifests that get a KYAML rendering for a language, relative
# to its examples directory, minus the ones that are deliberately left out.
manifests() {
    local dir="content/$1/examples" file skip
    [ -d "$dir" ] || return 0
    while IFS= read -r file; do
        [ -f "$dir/$file" ] || continue
        for skip in "${SKIP[@]}"; do
            [ "$file" = "$skip" ] && continue 2
        done
        grep -qE "$BLOCK_SCALAR" "$dir/$file" && continue
        echo "$file"
    done < <(trial)
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

# Fails if a SKIP entry names a file that is not there. A typo would otherwise
# skip nothing and go unnoticed, which is the failure mode an opt-out list
# invites. The trial list is checked only for the default language: a manifest
# on it need not have been translated, and a locale that has not opted in has no
# generated tree at all.
check_paths() {
    local lang="$1" path
    for path in "${SKIP[@]}"; do
        [ -f "content/$lang/examples/$path" ] && continue
        echo "SKIP names content/$lang/examples/$path, which does not exist" >&2
        exit 1
    done
    [ "$lang" = en ] || return 0
    while IFS= read -r path; do
        [ -f "content/en/examples/$path" ] && continue
        echo "$TRIAL names content/en/examples/$path, which does not exist" >&2
        exit 1
    done < <(trial)
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
    generated="content/$lang/examples-kyaml"
    check_paths "$lang"

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

# Staleness is only half of it: the tree also has to say what the source says.
if [ "$mode" = "verify" ]; then
    go test ./scripts/kyaml/
fi
