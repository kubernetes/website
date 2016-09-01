#!/bin/bash

# Uncomment this to see the commands as they are run
# set -x

VERSION=1.3

git clone --depth=1 -b release-$VERSION https://github.com/kubernetes/kubernetes.git k8s
cd k8s
git remote add upstream https://github.com/kubernetes/kubernetes.git
git fetch upstream
hack/generate-docs.sh
hack/update-generated-swagger-docs.sh
build/versionize-docs.sh release-$VERSION
cd ..

rm -rf _includes/v$VERSION
mkdir _includes/v$VERSION

# batch fetches
while read line || [[ -n ${line} ]]; do
  IFS=': ' read -a myarray <<< "${line}"
 if [ "${myarray[1]}" = "path" ]; then
    TARGET="${myarray[2]}"
    CLEARPATH="${TARGET}"
    K8SSOURCE='k8s/'${TARGET}
    DESTINATION=${TARGET%/*}
    rm -rf "${CLEARPATH}"
    yes | cp -rf "${K8SSOURCE}" "${DESTINATION}"
 fi
  if [ "${myarray[1]}" = "changedpath" ]; then
    SRC="${myarray[2]}"
    DESTINATION="${myarray[3]}"
    echo "mv -f ${SRC} ${DESTINATION}"
    yes | cp -rf "${SRC}" "${DESTINATION}"
  fi
  if [ "${myarray[1]}" = "copypath" ]; then
    K8SSOURCE="${myarray[2]}"
    DESTINATION="${myarray[3]}"
    echo "yes | cp -rf ${K8SSOURCE} ${DESTINATION}"
    yes | cp -rf "${K8SSOURCE}" "${DESTINATION}"
  fi
done <_data/overrides.yml

# refdoc munging
pushd .
cd _includes/v$VERSION
  # These are included in other files, so strip the DOCTYPE
   find . -name '*.html' -type f -exec sed -i -e "s/<!DOCTYPE html>//g" {} \;

  # Format html
  find . -name '*.html' -type f -exec sed -i -e '/<style>/,/<\/style>/d' {} \;
  find . -name '*.html' -type f -exec sed -i -e "s/http:\/\/kubernetes.io\/v$VERSION//g" {} \;
popd

pushd .
cd docs/api-reference
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

  # Fix for bug in 1.3 release
  find . -name '*.md' -type f -exec sed -i -e "s/vv1.3.0-beta.0/v1.3/g" {} \;
popd

pushd .
cd docs/user-guide/kubectl
  # Strip the munge comments
  find . -name '*.md' -type f -exec sed -i -e '/<!-- BEGIN MUNGE: IS_VERSIONED -->/,/<!-- END MUNGE: IS_VERSIONED -->/d' {} \;
  find . -name '*.md' -type f -exec sed -i -e '/<!-- BEGIN MUNGE: UNVERSIONED_WARNING -->/,/<!-- END MUNGE: UNVERSIONED_WARNING -->/d' {} \;

# Add the expected headers to md files
  find . -name '*.md' -type f -exec sed -i -e '1 i\
---' {} \;
  find . -name '*.md' -type f -exec sed -i -e '1 i\
---' {} \;
popd


BINARIES="federation-apiserver.md federation-controller-manager.md kube-apiserver.md kube-controller-manager.md kube-proxy.md kube-scheduler.md kubelet.md"

pushd .
cd docs/admin
  for bin in $BINARIES; do
  sed -i -e '/<!-- BEGIN MUNGE: IS_VERSIONED -->/,/<!-- END MUNGE: IS_VERSIONED -->/d' $bin
  sed -i -e '/<!-- BEGIN MUNGE: UNVERSIONED_WARNING -->/,/<!-- END MUNGE: UNVERSIONED_WARNING -->/d' $bin
  sed -i -e '1 i\
---' $bin
  sed -i -e '1 i\
---' $bin
  done
popd

rm -rf k8s

echo "Docs imported! Run 'git add .' 'git commit -m <comment>' and 'git push' to upload them"
