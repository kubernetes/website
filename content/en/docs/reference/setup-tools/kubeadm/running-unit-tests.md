---
approvers:
- luxas
- timothysc
- fabriziopandini
title: Running unit tests
weight: 10
---
As a prerequisite to running kubeadm unit tests, please make sure that you have done the following:

1) Make sure that you have [cloned the Kubernetes repository](https://github.com/kubernetes/kubernetes/blob/master/README.md#to-start-developing-kubernetes) and that you have [Go installed](https://golang.org/doc/install).
2) Navigate to the source folder - e.g. `~/go/src/k8s.io/kubernetes`

<br>

To run unit tests for the `cmd` package you can call:
```
./hack/make-rules/test-kubeadm-cmd.sh
```

<br>

To run unit tests for a specific kubeadm `<package>` call:
```
make test WHAT=./cmd/kubeadm/app/<package> GOFLAGS="-v"
```
Where `<package>` can be `cmd`, `utils`, `features`, etc.

<br>

For more information about running tests in Kubernetes have a look at:
* https://github.com/thtanaka/kubernetes/blob/master/docs/devel/testing.md

For more general information about unit tests in Go please have a look at:
* https://golang.org/pkg/testing/
* https://blog.alexellis.io/golang-writing-unit-tests/
