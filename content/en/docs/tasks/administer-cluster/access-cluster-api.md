---
title: Access Clusters Using the Kubernetes API
content_template: templates/task
---

{{% capture overview %}}
This page shows how to access clusters using the Kubernetes API.
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

## Accessing the cluster API

### Accessing for the first time with kubectl

When accessing the Kubernetes API for the first time, use the
Kubernetes command-line tool, `kubectl`.

To access a cluster, you need to know the location of the cluster and have credentials
to access it. Typically, this is automatically set-up when you work through
a [Getting started guide](/docs/setup/),
or someone else setup the cluster and provided you with credentials and a location.

Check the location and credentials that kubectl knows about with this command:

```shell
kubectl config view
```

Many of the [examples](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/) provide an introduction to using
kubectl. Complete documentation is found in the [kubectl manual](/docs/reference/kubectl/overview/).

### Directly accessing the REST API

kubectl handles locating and authenticating to the API server. If you want to directly access the REST API with an http client like
`curl` or `wget`, or a browser, there are multiple ways you can locate and authenticate against the API server:

 1. Run kubectl in proxy mode (recommended). This method is recommended, since it uses the stored apiserver location and verifies the identity of the API server using a self-signed cert. No man-in-the-middle (MITM) attack is possible using this method.
 1. Alternatively, you can provide the location and credentials directly to the http client. This works with client code that is confused by proxies. To protect against man in the middle attacks, you'll need to import a root cert into your browser.

 Using the Go or Python client libraries provides accessing kubectl in proxy mode.

#### Using kubectl proxy

The following command runs kubectl in a mode where it acts as a reverse proxy. It handles
locating the API server and authenticating.

Run it like this:

```shell
kubectl proxy --port=8080 &
```

See [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) for more details.

Then you can explore the API with curl, wget, or a browser, like so:

```shell
curl http://localhost:8080/api/
```

The output is similar to this:

```json
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
directly to the API server, like this:

Using `grep/cut` approach:

```shell
# Check all possible clusters, as you .KUBECONFIG may have multiple contexts:
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'

# Select name of cluster you want to interact with from above output:
export CLUSTER_NAME="some_server_name"

# Point to the API server refering the cluster name
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")

# Gets the token value
TOKEN=$(kubectl get secrets -o jsonpath="{.items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='default')].data.token}"|base64 -d)

# Explore the API with TOKEN
curl -X GET $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

The output is similar to this:

```json
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

Using `jsonpath` approach:

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
TOKEN=$(kubectl get secret $(kubectl get serviceaccount default -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 --decode )
curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
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

The above example uses the `--insecure` flag. This leaves it subject to MITM
attacks. When kubectl accesses the cluster it uses a stored root certificate
and client certificates to access the server. (These are installed in the
`~/.kube` directory). Since cluster certificates are typically self-signed, it
may take special configuration to get your http client to use root
certificate.

On some clusters, the API server does not require authentication; it may serve
on localhost, or be protected by a firewall. There is not a standard
for this. [Configuring Access to the API](/docs/reference/access-authn-authz/controlling-access/)
describes how a cluster admin can configure this. Such approaches may conflict
with future high-availability support.

### Programmatic access to the API

Kubernetes officially supports client libraries for [Go](#go-client) and
[Python](#python-client).

#### Go client

* To get the library, run the following command: `go get k8s.io/client-go/<version number>/kubernetes` See [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go) to see which versions are supported.
* Write an application atop of the client-go clients. Note that client-go defines its own API objects, so if needed, please import API definitions from client-go rather than from the main repository, e.g., `import "k8s.io/client-go/1.4/pkg/api/v1"` is correct.

The Go client can use the same [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go):

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
   pods, _:= clientset.CoreV1().Pods("").List(v1.ListOptions{})
   fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
...
```

If the application is deployed as a Pod in the cluster, please refer to the [next section](#accessing-the-api-from-a-pod).

#### Python client

To use [Python client](https://github.com/kubernetes-client/python), run the following command: `pip install kubernetes` See [Python Client Library page](https://github.com/kubernetes-client/python) for more installation options.

The Python client can use the same [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://github.com/kubernetes-client/python/blob/master/examples/out_of_cluster_config.py):

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

There are [client libraries](/docs/reference/using-api/client-libraries/) for accessing the API from other languages. See documentation for other libraries for how they authenticate.

### Accessing the API from a Pod

When accessing the API from a Pod, locating and authenticating
to the API server are somewhat different.

The easiest way to use the Kubernetes API from a Pod is to use
one of the official [client libraries](/docs/reference/using-api/client-libraries/). These
libraries can automatically discover the API server and authenticate.

While running in a Pod, the Kubernetes apiserver is accessible via a Service named
`kubernetes` in the `default` namespace. Therefore, Pods can use the 
`kubernetes.default.svc` hostname to query the API server. Official client libraries
do this automatically.

From within a Pod, the recommended way to authenticate to the API server is with a
[service account](/docs/user-guide/service-accounts) credential. By default, a Pod
is associated with a service account, and a credential (token) for that
service account is placed into the filesystem tree of each container in that Pod,
at `/var/run/secrets/kubernetes.io/serviceaccount/token`.

If available, a certificate bundle is placed into the filesystem tree of each
container at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, and should be
used to verify the serving certificate of the API server.

Finally, the default namespace to be used for namespaced API operations is placed in a file
at `/var/run/secrets/kubernetes.io/serviceaccount/namespace` in each container.

From within a Pod, the recommended ways to connect to the Kubernetes API are:

  - For a Go client, use the official [Go client library](https://github.com/kubernetes/client-go/).
    The `rest.InClusterConfig()` function handles API host discovery and authentication automatically.
    See [an example here](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

  - For a Python client, use the official [Python client library](https://github.com/kubernetes-client/python/).
    The `config.load_incluster_config()` function handles API host discovery and authentication automatically.
    See [an example here](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).
    
  - If you would like to query the API without an official client library, you can run `kubectl proxy`
    as the [command](/docs/tasks/inject-data-application/define-command-argument-container/)
    of a new sidecar container in the Pod. This way, `kubectl proxy` will authenticate
    to the API and expose it on the `localhost` interface of the Pod, so that other containers
    in the Pod can use it directly.

In each case, the service account credentials of the Pod are used to communicate
securely with the API server.

{{% /capture %}}


