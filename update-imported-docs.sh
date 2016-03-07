git clone https://github.com/kubernetes/kubernetes.git k8s
cd k8s
git checkout release-1.2
cd ..

rm -rf _includes/v1.2
mkdir _includes/v1.2

unalias cp

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
cd _includes/v1.2
find . -name '*.html' -type f -exec sed -i '' '/<style>/,/<\/style>/d' {} \;
find . -name '*.html' -print0 | xargs -0 sed -i '' -e 's/http:\/\/kubernetes.io\/v1.2//g'
cd ..
cd ..

rm -rf k8s
 
echo "Docs imported! Run 'git add .' 'git commit -m <comment>' and 'git push' to upload them"