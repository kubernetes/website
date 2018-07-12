Note: These tests are importing code from kubernetes that isn't really
meant to be used outside the repo. This causes vendoring problems. As
a result, we have to work around those with these lines in the travis
config:

```
- rm $GOPATH/src/k8s.io/kubernetes/vendor/k8s.io/apimachinery
- rm $GOPATH/src/k8s.io/kubernetes/vendor/k8s.io/apiserver
- rm $GOPATH/src/k8s.io/kubernetes/vendor/k8s.io/client-go
- cp -r $GOPATH/src/k8s.io/kubernetes/vendor/* $GOPATH/src/
- rm -rf $GOPATH/src/k8s.io/kubernetes/vendor/*
- cp -r $GOPATH/src/k8s.io/kubernetes/staging/src/* $GOPATH/src/
```
