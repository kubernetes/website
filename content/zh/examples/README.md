注意：这些测试是从 kubernetes 导入的代码实际上并不打算在存储库之外使用。
这就导致了供应商依赖问题。因此，我们必须在 travis 配置这些行:
<!--
Note: These tests are importing code from kubernetes that isn't really
meant to be used outside the repo. This causes vendoring problems. As
a result, we have to work around those with these lines in the travis
config:
-->

```
- rm $GOPATH/src/k8s.io/kubernetes/vendor/k8s.io/apimachinery
- rm $GOPATH/src/k8s.io/kubernetes/vendor/k8s.io/apiserver
- rm $GOPATH/src/k8s.io/kubernetes/vendor/k8s.io/client-go
- cp -r $GOPATH/src/k8s.io/kubernetes/vendor/* $GOPATH/src/
- rm -rf $GOPATH/src/k8s.io/kubernetes/vendor/*
- cp -r $GOPATH/src/k8s.io/kubernetes/staging/src/* $GOPATH/src/
```
