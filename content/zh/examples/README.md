注意：这些测试是从 kubernetes 导入的代码，实际上并不是要在存储库之外使用。
这会导致依赖问题。因此，我们必须在 travis 配置中解决这些行的问题：

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


