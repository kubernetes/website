---
assignees:
- caesarxuchao
- lavalamp

---

You have seen the [basics](/docs/user-guide/accessing-the-cluster) about `kubectl proxy` and `apiserver proxy`. This guide shows how to use them together to access a service([kube-ui](/docs/user-guide/ui)) running on the Kubernetes cluster from your workstation.


## Getting the apiserver proxy URL of kube-ui

kube-ui is deployed as a cluster add-on. To find its apiserver proxy URL,

```shell
$ kubectl cluster-info | grep "KubeUI"
KubeUI is running at https://173.255.119.104/api/v1/proxy/namespaces/kube-system/services/kube-ui
```

if this command does not find the URL, try the steps [here](/docs/user-guide/ui/#accessing-the-ui).


## Connecting to the kube-ui service from your local workstation

The above proxy URL is an access to the kube-ui service provided by the apiserver. To access it, you still need to authenticate to the apiserver. `kubectl proxy` can handle the authentication.

```shell
$ kubectl proxy --port=8001
Starting to serve on localhost:8001
```

Now you can access the kube-ui service on your local workstation at [http://localhost:8001/api/v1/proxy/namespaces/kube-system/services/kube-ui](http://localhost:8001/api/v1/proxy/namespaces/kube-system/services/kube-ui)