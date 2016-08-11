#!/bin/bash

set -x

VERSION=1.3

git clone --depth=1 https://github.com/kubernetes/kubernetes.git k8s
cd k8s
git remote add upstream https://github.com/kubernetes/kubernetes.git
git fetch upstream
git checkout release-$VERSION
hack/generate-docs.sh
hack/update-generated-swagger-docs.sh
build/versionize-docs.sh release-$VERSION
cd ..


rm -rf _includes/v$VERSION
mkdir _includes/v$VERSION

# batch fetches
while read line || [[ -n ${line} ]]; do
  IFS=': ' read -a myarray <<< "${line}"
  #echo "arraypos0: ${myarray[0]}"
  #echo "arraypos1: ${myarray[1]}"
  #echo "arraypos2: ${myarray[2]}"
  #echo "arraypos3: ${myarray[3]}"
  if [ "${myarray[1]}" = "path" ]; then
    TARGET="${myarray[2]}"
    CLEARPATH="${TARGET}"
    K8SSOURCE='k8s/'${TARGET}
    DESTINATION=${TARGET%/*}
    rm -rf "${CLEARPATH}"
    mv -f "${K8SSOURCE}" "${DESTINATION}"
    # find "${DESTINATION}" -name "*${DESTINATION}" -print0 | xargs -0 sed -i '' -e 's/.html)/)/g'
  fi
  if [ "${myarray[1]}" = "changedpath" ]; then
    SRC="${myarray[2]}"
    DESTINATION="${myarray[3]}"
    echo "mv -f ${SRC} ${DESTINATION}"
    mv -f "${SRC}" "${DESTINATION}"
  fi
  if [ "${myarray[1]}" = "copypath" ]; then
    K8SSOURCE="${myarray[2]}"
    DESTINATION="${myarray[3]}"
    echo "yes | cp -rf ${K8SSOURCE} ${DESTINATION}"
    yes | cp -rf "${K8SSOURCE}" "${DESTINATION}"
  fi
done <_data/overrides.yml

# refdoc munging
cd _includes/v$VERSION
find . -name '*.html' -type f -exec sed -i -e '/<style>/,/<\/style>/d' {} \;
find . -name '*.html' -type f -exec sed -i -e "s/http:\/\/kubernetes.io\/v$VERSION//g" {} \;
cd ..
cd ..

rm -rf k8s

echo "Docs imported! Run 'git add .' 'git commit -m <comment>' and 'git push' to upload them"