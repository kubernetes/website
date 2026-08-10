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

# Reformats example manifests as KYAML, using the formatter that ships with
# sigs.k8s.io/yaml (the tool named in KEP-5295). Requires Go.
#
#   scripts/kyaml.sh convert [lang...]   rewrite content/<lang>/examples in place
#   scripts/kyaml.sh verify  [lang...]   fail if any file is not already KYAML
#
# Language defaults to "en".

set -o errexit
set -o nounset
set -o pipefail

# Pinned so the output is reproducible across contributors and CI.
YAMLFMT="sigs.k8s.io/yaml/yamlfmt@v1.6.0"

# Manifests the formatter must not touch.
#
# The configmap pair is deliberately kept as conventional YAML, because the
# surrounding page teaches that KYAML and YAML are interchangeable.
#
# failure-policy-ignore.yaml is an elided fragment. Its KYAML form is
# hand-written, because the formatter cannot place a comment inside an empty
# mapping and cannot parse the `...` elision the YAML version used.
SKIP=(
  "configmap/immutable-configmap.yaml"
  "configmap/new-immutable-configmap.yaml"
  "validatingadmissionpolicy/failure-policy-ignore.yaml"
)

usage() {
  echo "usage: $0 {convert|verify} [lang...]" >&2
  exit 1
}

# Echoes every example manifest for a language, minus the SKIP list.
manifests() {
  local lang="$1" dir="content/$1/examples" file
  [ -d "$dir" ] || return 0
  while IFS= read -r file; do
    for skip in "${SKIP[@]}"; do
      [ "$file" = "$dir/$skip" ] && continue 2
    done
    echo "$file"
  done < <(find "$dir" \( -name '*.yaml' -o -name '*.yml' \) | sort)
}

[ $# -ge 1 ] || usage
mode="$1"
shift
langs=("${@:-en}")

files=()
for lang in "${langs[@]}"; do
  while IFS= read -r file; do
    files+=("$file")
  done < <(manifests "$lang")
done

if [ ${#files[@]} -eq 0 ]; then
  echo "no example manifests found for: ${langs[*]}" >&2
  exit 1
fi

case "$mode" in
  convert)
    go run "$YAMLFMT" -o kyaml -w "${files[@]}"
    echo "reformatted ${#files[@]} manifests as KYAML"
    ;;
  verify)
    # -d prints a diff per file that is not already in KYAML form.
    if ! diff=$(go run "$YAMLFMT" -o kyaml -d "${files[@]}") || [ -n "$diff" ]; then
      echo "$diff"
      echo >&2
      echo "Example manifests are not in KYAML form. Run: scripts/kyaml.sh convert" >&2
      exit 1
    fi
    echo "all ${#files[@]} manifests are valid KYAML"
    ;;
  *)
    usage
    ;;
esac
