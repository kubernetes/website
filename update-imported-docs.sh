git clone https://github.com/kubernetes/kubernetes.git k8s
cd k8s
git checkout gh-pages
cd ..

while read line || [[ -n ${line} ]]; do
  IFS=': ' read -a myarray <<< "${line}"
  # echo "arraypos0: ${myarray[0]}"
  # echo "arraypos1: ${myarray[1]}"
  # echo "arraypos2: ${myarray[2]}"
  if [ "${myarray[1]}" = "path" ]; then
    TARGET="${myarray[2]}"
    CLEARPATH="${TARGET}"
    K8SSOURCE='k8s/_'${TARGET}
    DESTINATION=${TARGET%/*}
    rm -rf ${CLEARPATH}
    mv -f ${K8SSOURCE} ${DESTINATION}
  fi
done <_data/overrides.yml

mv -f k8s/_includes/v1.1 _includes/
cd _includes/v1.1
find . -name '*.html' -type f -exec sed -i '' '/<style>/,/<\/style>/d' {} \;
cd ..
cd ..

rm -rf k8s
git add .
git commit -m "Ran update-imported-docs.sh"
echo "Docs imported! Run 'git push' to upload them"