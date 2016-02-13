git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
git checkout gh-pages
cd ..
rm -rf v1.1/examples
mv kubernetes/_v1.1/examples v1.1/
rm -rf kubernetes