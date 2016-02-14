#git clone https://github.com/kubernetes/kubernetes.git k8s
#cd k8s
#git checkout gh-pages
#cd ..

while read line || [[ -n ${line} ]]; do
  CLEARPATH=${line}
  K8SSOURCE='k8s/_'${line}
  DESTINATION=${line%/*}
  echo "rm -rf ${CLEARPATH}"
  echo "mv ${K8SSOURCE} ${DESTINATION}"
done <source_files_from_main_k8s_repo.txt

#rm -rf k8s