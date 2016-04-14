---
---

By default, the Kubernetes Dashboard is deployed as a cluster addon. For 1.2 clusters, it is enabled by default.

To access the Dashboard, visit

`https://<kubernetes-master>/ui`, which redirects to
`https://<kubernetes-master>/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard`.

If you find that you're not able to access the Dashboard, you can install and open the latest stable release by running the following commands:

```shell
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/kubernetes-dashboard.yaml --namespace=kube-system
kubectl proxy --port=9090
```
Then navigate to

```shell
http://localhost:9090/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard
```
If you are asked for a password, use `kubectl config view` to find it.

Release notes and development versions of the Dashboard can be
found at https://github.com/kubernetes/dashboard/releases.

## Walkthrough

For information on how to use the Dashboard, take the [Dashboard tour](/docs/user-guide/ui/).

## More Information

For more information, see the
[Kubernetes Dashboard repository](https://github.com/kubernetes/dashboard).
