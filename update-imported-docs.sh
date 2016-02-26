#git clone https://github.com/kubernetes/kubernetes.git k8s
#cd k8s
#git checkout gh-pages
#cd ..



while read line || [[ -n ${line} ]]; do
mystring="line"

IFS=',' read -a myarray <<< "$mystring"

echo "IP: ${myarray[0]}"
echo "STATUS: ${myarray[3]}"
  CLEARPATH=${line}
  K8SSOURCE='k8s/_'${line}
  DESTINATION=${line%/*}
  echo "rm -rf ${CLEARPATH}"
  echo "mv ${K8SSOURCE} ${DESTINATION}"
done <_data/overrides.yml

#rm -rf k8s