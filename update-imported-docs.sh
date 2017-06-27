#!/bin/bash
set -o errexit


# Uncomment this to see the commands as they are run
# set -x

VERSION=1.7
OLDVERSION=1.6

# Processes api reference docs.
function process_api_ref_docs {
  # Replace html preview links by relative links to let k8s.io render them.
  local html_preview_prefix="https:\/\/htmlpreview.github.io\/?https:\/\/github.com\/kubernetes\/kubernetes\/blob\/"
  find . -name '*.*' -type f -exec sed -i -e "s/${html_preview_prefix}HEAD//g" {} \;
  find . -name '*.*' -type f -exec sed -i -e "s/${html_preview_prefix}release-$VERSION//g" {} \;

  # Format html
  find . -name '*.html' -type f -exec sed -i -e '/<style>/,/<\/style>/d' {} \;
  find . -name '*.html' -type f -exec sed -i -e "s/http:\/\/kubernetes.io\/v$VERSION//g" {} \;
  find . -name '*.html' -type f -exec sed -i -e '1 i\
---' {} \;
  find . -name '*.html' -type f -exec sed -i -e '1 i\
---' {} \;

  # Strip the munge comments
  find . -name '*.md' -type f -exec sed -i -e '/<!-- BEGIN MUNGE: IS_VERSIONED -->/,/<!-- END MUNGE: IS_VERSIONED -->/d' {} \;
  find . -name '*.md' -type f -exec sed -i -e '/<!-- BEGIN MUNGE: UNVERSIONED_WARNING -->/,/<!-- END MUNGE: UNVERSIONED_WARNING -->/d' {} \;

  # Add the expected headers to md files
  find . -name '*.md' -type f -exec sed -i -e '1 i\
---' {}  \;
  find . -name '*.md' -type f -exec sed -i -e '1 i\
---' {}  \;
}

# save old version new style reference docs
APIREFPATH=docs/api-reference
KUBECTLPATH=docs/user-guide/kubectl
TMPDIR=/tmp/update_docs
TMPAPIREFDIR="${TMPDIR}/api_ref"
TMPKUBECTLDIR="${TMPDIR}/kubectl"

rm -rf -- "${TMPDIR}"
mkdir -p -- "${TMPAPIREFDIR}" "${TMPKUBECTLDIR}"

APIREFSRCDIR="${APIREFPATH}/v${OLDVERSION}"
APIREFDESDIR="${TMPAPIREFDIR}/v${OLDVERSION}"
mv -- "${APIREFSRCDIR}" "${APIREFDESDIR}"
KUBECTLSRCDIR="${KUBECTLPATH}/v${OLDVERSION}"
KUBECTLDESDIR="${TMPKUBECTLDIR}/v${OLDVERSION}"
mv -- "${KUBECTLSRCDIR}" "${KUBECTLDESDIR}"

K8SREPO=k8s
(
  git clone --depth=1 -b release-$VERSION https://github.com/kubernetes/kubernetes.git "${K8SREPO}"
  cd "${K8SREPO}"
  hack/generate-docs.sh
)


rm -rf "_includes/v$VERSION"
mkdir "_includes/v$VERSION"

# batch fetches
while read line || [[ -n ${line} ]]; do
  IFS=': ' read -a myarray <<< "${line}"
 if [ "${myarray[1]}" = "path" ]; then
    TARGET="${myarray[2]}"
    CLEARPATH="${TARGET}"
    K8SSOURCE="${K8SREPO}/${TARGET}"
    DESTINATION=${TARGET%/*}
    rm -rf -- "${CLEARPATH}"
    yes | cp -rf -- "${K8SSOURCE}" "${DESTINATION}"
 fi
  if [ "${myarray[1]}" = "changedpath" ]; then
    SRC="${myarray[2]}"
    DESTINATION="${myarray[3]}"
    echo "cp -rf -- ${SRC} ${DESTINATION}"
    yes | cp -rf -- "${SRC}" "${DESTINATION}"
  fi
  if [ "${myarray[1]}" = "copypath" ]; then
    K8SSOURCE="${myarray[2]}"
    DESTINATION="${myarray[3]}"
    echo "yes | cp -rf -- ${K8SSOURCE} ${DESTINATION}"
    yes | cp -rf -- "${K8SSOURCE}" "${DESTINATION}"
  fi
done <_data/overrides.yml

# refdoc munging
(
  cd _includes/v$VERSION
  # These are included in other files, so strip the DOCTYPE
   find . -name '*.html' -type f -exec sed -i -e "s/<!DOCTYPE html>//g" {} \;

  # Format html
  find . -name '*.html' -type f -exec sed -i -e '/<style>/,/<\/style>/d' {} \;
  find . -name '*.html' -type f -exec sed -i -e "s/http:\/\/kubernetes.io\/v$VERSION//g" {} \;
)

(
  cd docs/api-reference
  process_api_ref_docs

  # Fix for bug in 1.3 release
  find . -name '*.md' -type f -exec sed -i -e "s/vv1.3.0-beta.0/v1.3/g" {} \;
)

(
  cd docs/federation/api-reference
  process_api_ref_docs

  # Rename README.md to index.md
  mv README.md index.md
  # Update the links from federation/docs/api-reference to
  # docs/federation/api-reference
  find . -name '*.*' -type f -exec sed -i -e "s/federation\/docs\/api-reference/docs\/federation\/api-reference/g" {} \;
)

(
  cd docs/user-guide/kubectl
  # Strip the munge comments
  find . -name '*.md' -type f -exec sed -i -e '/<!-- BEGIN MUNGE: IS_VERSIONED -->/,/<!-- END MUNGE: IS_VERSIONED -->/d' {} \;
  find . -name '*.md' -type f -exec sed -i -e '/<!-- BEGIN MUNGE: UNVERSIONED_WARNING -->/,/<!-- END MUNGE: UNVERSIONED_WARNING -->/d' {} \;

  # Strip the "See Also" links.
  # These links in raw .md files are relative to current file location, but the website see them as relative to current url instead, and will return 404.
  find . -name 'kubectl*.md' -type f -exec sed -i -e '/### SEE ALSO/d' {} \;
  find . -name 'kubectl*.md' -type f -exec sed -i -e '/\* \[kubectl/d' {} \;

  # Add the expected headers to md files
  find . -name '*.md' -type f -exec sed -i -e '1 i\
---' {} \;
  find . -name '*.md' -type f -exec sed -i -e '1 i\
---' {} \;
)


BINARIES="federation-apiserver.md federation-controller-manager.md kube-apiserver.md kube-controller-manager.md kube-proxy.md kube-scheduler.md kubelet.md"

(
  cd docs/admin
  for bin in $BINARIES; do
    sed -i -e '/<!-- BEGIN MUNGE: IS_VERSIONED -->/,/<!-- END MUNGE: IS_VERSIONED -->/d' "$bin"
    sed -i -e '/<!-- BEGIN MUNGE: UNVERSIONED_WARNING -->/,/<!-- END MUNGE: UNVERSIONED_WARNING -->/d' "$bin"
    sed -i -e '1 i\
---' "$bin"
    sed -i -e '1 i\
---' "$bin"
  done
)
mv -- "${APIREFDESDIR}" "${APIREFSRCDIR}"
mv -- "${KUBECTLDESDIR}" "${KUBECTLSRCDIR}"
rm -rf -- "${TMPDIR}" "${K8SREPO}"

echo "Docs imported! Run 'git add .' 'git commit -m <comment>' and 'git push' to upload them"
