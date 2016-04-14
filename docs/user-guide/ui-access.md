---
---

By default, the Kubernetes Dashboard is deployed as a cluster addon. For 1.2 clusters, it is enabled by default.

If you want to manually install it, visit

`https://<kubernetes-master>/ui`, which redirects to
`https://<kubernetes-master>/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard`.

If you find that you're not able to access the Dashboard, it may be because the
`kubernetes-dashboard` service has not been started on your cluster. In that case,
you can start it manually as follows:

```shell
kubectl create -f cluster/addons/dashboard/dashboard-controller.yaml --namespace=kube-system
kubectl create -f cluster/addons/dashboard/dashboard-service.yaml --namespace=kube-system
```

Normally, this should be taken care of automatically by the
[`kube-addons.sh`](http://releases.k8s.io/{{page.githubbranch}}/cluster/saltbase/salt/kube-addons/kube-addons.sh)
script that runs on the master. Release notes and development versions of the Dashboard can be
found at https://github.com/kubernetes/dashboard/releases.

## Walkthrough

For information on how to use the Dashboard, take the [Dashboard tour](/docs/user-guide/ui/).

## More Information

For more information, see the
[Kubernetes Dashboard repository](https://github.com/kubernetes/dashboard).
