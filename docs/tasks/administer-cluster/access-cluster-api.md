---
title: Access Clusters Using the Kubernetes API
---

{% capture overview %}
This page shows how to access clusters using the Kubernetes API.
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}

## Accessing the cluster API

### Accessing for the first time with kubectl

When accessing the Kubernetes API for the first time, use the
Kubernetes command-line tool, `kubectl`.

To access a cluster, you need to know the location of the cluster and have credentials
to access it.  Typically, this is automatically set-up when you work through
a [Getting started guide](/docs/getting-started-guides/),
or someone else setup the cluster and provided you with credentials and a location.

Check the location and credentials that kubectl knows about with this command:

```shell
$ kubectl config view
```

Many of the [examples](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/) provide an introduction to using
kubectl.  Complete documentation is found in the [kubectl manual](/docs/user-guide/kubectl/index).

### Directly accessing the REST API

Kubectl handles locating and authenticating to the apiserver. If you want to directly access the REST API with an http client like
`curl` or `wget`, or a browser, there are multiple ways you can locate and authenticate against the apiserver:

 1. Run kubectl in proxy mode (recommended).  This method is recommended, since it uses the stored apiserver location abd verifies the identity of the apiserver using a self-signed cert.  No Man-in-the-middle (MITM) attack is possible using this method .
 1. Alternatively, you can provide the location and credentials directly to the http client. This works with for client code that is confused by proxies.  To protect against man in the middle attacks, you'll need to import a root cert into your browser.

 Using the Go or Python client libraries provides accessing kubectl in proxy mode.

#### Using kubectl proxy

The following command runs kubectl in a mode where it acts as a reverse proxy.  It handles
locating the apiserver and authenticating.

Run it like this:

```shell
$ kubectl proxy --port=8080 &
```

See [kubectl proxy](/docs/user-guide/kubectl/v1.6/#proxy) for more details.

Then you can explore the API with curl, wget, or a browser, like so:

```shell
$ curl http://localhost:8080/api/
{
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

#### Without kubectl proxy

It is possible to avoid using kubectl proxy by passing an authentication token
directly to the apiserver, like this:

``` shell
$ APISERVER=$(kubectl config view | grep server | cut -f 2- -d ":" | tr -d " ")
$ TOKEN=$(kubectl describe secret $(kubectl get secrets | grep default | cut -f1 -d ' ') | grep -E '^token' | cut -f2 -d':' | tr -d '\t')
$ curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

The above example uses the `--insecure` flag.  This leaves it subject to MITM
attacks.  When kubectl accesses the cluster it uses a stored root certificate
and client certificates to access the server.  (These are installed in the
`~/.kube` directory).  Since cluster certificates are typically self-signed, it
may take special configuration to get your http client to use root
certificate.

On some clusters, the apiserver does not require authentication; it may serve
on localhost, or be protected by a firewall.  There is not a standard
for this.  [Configuring Access to the API](/docs/admin/accessing-the-api)
describes how a cluster admin can configure this.  Such approaches may conflict
with future high-availability support.

### Programmatic access to the API

Kubernetes officially supports client libraries for [Go](#go-client) and
[Python](#python-client).

#### Go client

* To get the library, run the following command: `go get k8s.io/client-go/<version number>/kubernetes` See [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go) to see which versions are supported.
* Write an application atop of the client-go clients. Note that client-go defines its own API objects, so if needed, please import API definitions from client-go rather than from the main repository, e.g., `import "k8s.io/client-go/1.4/pkg/api/v1"` is correct.

The Go client can use the same [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the apiserver. See this [example](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go):

```golang
import (
   "fmt"
   "k8s.io/client-go/1.4/kubernetes"
   "k8s.io/client-go/1.4/pkg/api/v1"
   "k8s.io/client-go/1.4/tools/clientcmd"
)
...
   // uses the current context in kubeconfig
   config, _ := clientcmd.BuildConfigFromFlags("", "path to kubeconfig")
   // creates the clientset
   clientset, _:= kubernetes.NewForConfig(config)
   // access the API to list pods
   pods, _:= clientset.Core().Pods("").List(v1.ListOptions{})
   fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
...
```

If the application is deployed as a Pod in the cluster, please refer to the [next section](#accessing-the-api-from-a-pod).

#### Python client

To use [Python client](https://github.com/kubernetes-incubator/client-python), run the following command: `pip install kubernetes` See [Python Client Library page](https://github.com/kubernetes-incubator/client-python) for more installation options.

The Python client can use the same [kubeconfig file](/docs/user-guide/kubeconfig-file)
as the kubectl CLI does to locate and authenticate to the apiserver. See this [example](https://github.com/kubernetes-incubator/client-python/tree/master/examples/example1.py):

```python
from kubernetes import client, config

config.load_kube_config()

v1=client.CoreV1Api()
print("Listing pods with their IPs:")
ret = v1.list_pod_for_all_namespaces(watch=False)
for i in ret.items:
    print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))
```

#### Other languages

There are [client libraries](/docs/reference/client-libraries/) for accessing the API from other languages. See documentation for other libraries for how they authenticate.

### Accessing the API from a Pod

When accessing the API from a pod, locating and authenticating
to the api server are somewhat different.

The recommended way to locate the apiserver within the pod is with
the `kubernetes` DNS name, which resolves to a Service IP which in turn
will be routed to an apiserver.

The recommended way to authenticate to the apiserver is with a
[service account](/docs/user-guide/service-accounts) credential.  By kube-system, a pod
is associated with a service account, and a credential (token) for that
service account is placed into the filesystem tree of each container in that pod,
at `/var/run/secrets/kubernetes.io/serviceaccount/token`.

If available, a certificate bundle is placed into the filesystem tree of each
container at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, and should be
used to verify the serving certificate of the apiserver.

Finally, the default namespace to be used for namespaced API operations is placed in a file
at `/var/run/secrets/kubernetes.io/serviceaccount/namespace` in each container.

From within a pod the recommended ways to connect to API are:

  - run a kubectl proxy as one of the containers in the pod, or as a background
    process within a container.  This proxies the
    Kubernetes API to the localhost interface of the pod, so that other processes
    in any container of the pod can access it.  See this [example of using kubectl proxy
    in a pod](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/kubectl-container/).
  - use the Go client library, and create a client using the `rest.InClusterConfig()` and `kubernetes.NewForConfig()` functions.
    They handle locating and authenticating to the apiserver. [example](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)

In each case, the credentials of the pod are used to communicate securely with the apiserver.

{% endcapture %}

{% include templates/task.md %}
