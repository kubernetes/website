---
title: Accessing Clusters
weight: 20
content_type: concept
---

<!-- overview -->

This topic discusses multiple ways to interact with clusters.

<!-- body -->

## Accessing for the first time with kubectl

When accessing the Kubernetes API for the first time, we suggest using the
Kubernetes CLI, `kubectl`.

To access a cluster, you need to know the location of the cluster and have credentials
to access it.  Typically, this is automatically set-up when you work through
a [Getting started guide](/docs/setup/),
or someone else setup the cluster and provided you with credentials and a location.

Check the location and credentials that kubectl knows about with this command:

```shell
kubectl config view
```

Many of the [examples](/docs/reference/kubectl/cheatsheet/) provide an introduction to using
kubectl and complete documentation is found in the
[kubectl manual](/docs/reference/kubectl/overview/).

## Directly accessing the REST API

Kubectl handles locating and authenticating to the apiserver.
If you want to directly access the REST API with an http client like
curl or wget, or a browser, there are several ways to locate and authenticate:

  - Run kubectl in proxy mode.
    - Recommended approach.
    - Uses stored apiserver location.
    - Verifies identity of apiserver using self-signed cert.  No MITM possible.
    - Authenticates to apiserver.
    - In future, may do intelligent client-side load-balancing and failover.
  - Provide the location and credentials directly to the http client.
    - Alternate approach.
    - Works with some types of client code that are confused by using a proxy.
    - Need to import a root cert into your browser to protect against MITM.

### Using kubectl proxy

The following command runs kubectl in a mode where it acts as a reverse proxy.  It handles
locating the apiserver and authenticating.
Run it like this:

```shell
kubectl proxy --port=8080
```

See [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) for more details.

Then you can explore the API with curl, wget, or a browser, replacing localhost
with [::1] for IPv6, like so:

```shell
curl http://localhost:8080/api/
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


### Without kubectl proxy

Use `kubectl describe secret...` to get the token for the default service account with grep/cut:

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
SECRET_NAME=$(kubectl get secrets | grep ^default | cut -f1 -d ' ')
TOKEN=$(kubectl describe secret $SECRET_NAME | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
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

Using `jsonpath`:

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
SECRET_NAME=$(kubectl get serviceaccount default -o jsonpath='{.secrets[0].name}')
TOKEN=$(kubectl get secret $SECRET_NAME -o jsonpath='{.data.token}' | base64 --decode)

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
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

The above examples use the `--insecure` flag.  This leaves it subject to MITM
attacks.  When kubectl accesses the cluster it uses a stored root certificate
and client certificates to access the server.  (These are installed in the
`~/.kube` directory).  Since cluster certificates are typically self-signed, it
may take special configuration to get your http client to use root
certificate.

On some clusters, the apiserver does not require authentication; it may serve
on localhost, or be protected by a firewall.  There is not a standard
for this.  [Controlling Access to the API](/docs/concepts/security/controlling-access)
describes how a cluster admin can configure this.

## Programmatic access to the API

Kubernetes officially supports [Go](#go-client) and [Python](#python-client)
client libraries.

### Go client

* To get the library, run the following command: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`, see [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user) for detailed installation instructions. See [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix) to see which versions are supported.
* Write an application atop of the client-go clients. Note that client-go defines its own API objects, so if needed, please import API definitions from client-go rather than from the main repository, e.g., `import "k8s.io/client-go/kubernetes"` is correct.

The Go client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the apiserver. See this [example](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go).

If the application is deployed as a Pod in the cluster, please refer to the [next section](#accessing-the-api-from-a-pod).

### Python client

To use [Python client](https://github.com/kubernetes-client/python), run the following command: `pip install kubernetes`. See [Python Client Library page](https://github.com/kubernetes-client/python) for more installation options.

The Python client can use the same [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the apiserver. See this [example](https://github.com/kubernetes-client/python/tree/master/examples).

### Other languages

There are [client libraries](/docs/reference/using-api/client-libraries/) for accessing the API from other languages.
See documentation for other libraries for how they authenticate.

## Accessing the API from a Pod

When accessing the API from a pod, locating and authenticating
to the apiserver are somewhat different.

The recommended way to locate the apiserver within the pod is with
the `kubernetes.default.svc` DNS name, which resolves to a Service IP which in turn
will be routed to an apiserver.

The recommended way to authenticate to the apiserver is with a
[service account](/docs/tasks/configure-pod-container/configure-service-account/) credential. By kube-system, a pod
is associated with a service account, and a credential (token) for that
service account is placed into the filesystem tree of each container in that pod,
at `/var/run/secrets/kubernetes.io/serviceaccount/token`.

If available, a certificate bundle is placed into the filesystem tree of each
container at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, and should be
used to verify the serving certificate of the apiserver.

Finally, the default namespace to be used for namespaced API operations is placed in a file
at `/var/run/secrets/kubernetes.io/serviceaccount/namespace` in each container.

From within a pod the recommended ways to connect to API are:

  - Run `kubectl proxy` in a sidecar container in the pod, or as a background
    process within the container. This proxies the
    Kubernetes API to the localhost interface of the pod, so that other processes
    in any container of the pod can access it.
  - Use the Go client library, and create a client using the `rest.InClusterConfig()` and `kubernetes.NewForConfig()` functions.
    They handle locating and authenticating to the apiserver. [example](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)

In each case, the credentials of the pod are used to communicate securely with the apiserver.

## Accessing services running on the cluster

The previous section was about connecting the Kubernetes API server.  This section is about
connecting to other services running on Kubernetes cluster.  In Kubernetes, the
[nodes](/docs/concepts/architecture/nodes/),
[pods](/docs/concepts/workloads/pods/) and
[services](/docs/concepts/services-networking/service/) all have
their own IPs.  In many cases, the node IPs, pod IPs, and some service IPs on a cluster will not be
routable, so they will not be reachable from a machine outside the cluster,
such as your desktop machine.

### Ways to connect

You have several options for connecting to nodes, pods and services from outside the cluster:

  - Access services through public IPs.
    - Use a service with type `NodePort` or `LoadBalancer` to make the service reachable outside
      the cluster.  See the [services](/docs/concepts/services-networking/service/) and
      [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose) documentation.
    - Depending on your cluster environment, this may just expose the service to your corporate network,
      or it may expose it to the internet.  Think about whether the service being exposed is secure.
      Does it do its own authentication?
    - Place pods behind services.  To access one specific pod from a set of replicas, such as for debugging,
      place a unique label on the pod and create a new service which selects this label.
    - In most cases, it should not be necessary for application developer to directly access
      nodes via their nodeIPs.
  - Access services, nodes, or pods using the Proxy Verb.
    - Does apiserver authentication and authorization prior to accessing the remote service.
      Use this if the services are not secure enough to expose to the internet, or to gain
      access to ports on the node IP, or for debugging.
    - Proxies may cause problems for some web applications.
    - Only works for HTTP/HTTPS.
    - Described [here](#manually-constructing-apiserver-proxy-urls).
  - Access from a node or pod in the cluster.
    - Run a pod, and then connect to a shell in it using [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec).
      Connect to other nodes, pods, and services from that shell.
    - Some clusters may allow you to ssh to a node in the cluster.  From there you may be able to
      access cluster services.  This is a non-standard method, and will work on some clusters but
      not others.  Browsers and other tools may or may not be installed.  Cluster DNS may not work.

### Discovering builtin services

Typically, there are several services which are started on a cluster by kube-system. Get a list of these
with the `kubectl cluster-info` command:

```shell
kubectl cluster-info
```

The output is similar to this:

```
Kubernetes master is running at https://104.197.5.247
elasticsearch-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

This shows the proxy-verb URL for accessing each service.
For example, this cluster has cluster-level logging enabled (using Elasticsearch), which can be reached
at `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` if suitable credentials are passed.  Logging can also be reached through a kubectl proxy, for example at:
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.
(See [Access Clusters Using the Kubernetes API](/docs/tasks/administer-cluster/access-cluster-api/) for how to pass credentials or use kubectl proxy.)

#### Manually constructing apiserver proxy URLs

As mentioned above, you use the `kubectl cluster-info` command to retrieve the service's proxy URL. To create proxy URLs that include service endpoints, suffixes, and parameters, you append to the service's proxy URL:
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`service_name[:port_name]`*`/proxy`

If you haven't specified a name for your port, you don't have to specify *port_name* in the URL. You can also use the port number in place of the *port_name* for both named and unnamed ports.

By default, the API server proxies to your service using http. To use https, prefix the service name with `https:`:
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`https:service_name:[port_name]`*`/proxy`

The supported formats for the name segment of the URL are:

* `<service_name>` - proxies to the default or unnamed port using http
* `<service_name>:<port_name>` - proxies to the specified port name or port number using http
* `https:<service_name>:` - proxies to the default or unnamed port using https (note the trailing colon)
* `https:<service_name>:<port_name>` - proxies to the specified port name or port number using https

##### Examples

 * To access the Elasticsearch service endpoint `_search?q=user:kimchy`, you would use:   `http://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy`
 * To access the Elasticsearch cluster health information `_cluster/health?pretty=true`, you would use:   `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true`

```json
{
  "cluster_name" : "kubernetes_logging",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 1,
  "number_of_data_nodes" : 1,
  "active_primary_shards" : 5,
  "active_shards" : 5,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 5
}
```

### Using web browsers to access services running on the cluster

You may be able to put an apiserver proxy url into the address bar of a browser. However:

  - Web browsers cannot usually pass tokens, so you may need to use basic (password) auth.  Apiserver can be configured to accept basic auth,
    but your cluster may not be configured to accept basic auth.
  - Some web apps may not work, particularly those with client side javascript that construct urls in a
    way that is unaware of the proxy path prefix.

## Requesting redirects

The redirect capabilities have been deprecated and removed.  Please use a proxy (see below) instead.

## So Many Proxies

There are several different proxies you may encounter when using Kubernetes:

1.  The [kubectl proxy](#directly-accessing-the-rest-api):

    - runs on a user's desktop or in a pod
    - proxies from a localhost address to the Kubernetes apiserver
    - client to proxy uses HTTP
    - proxy to apiserver uses HTTPS
    - locates apiserver
    - adds authentication headers

1.  The [apiserver proxy](#discovering-builtin-services):

    - is a bastion built into the apiserver
    - connects a user outside of the cluster to cluster IPs which otherwise might not be reachable
    - runs in the apiserver processes
    - client to proxy uses HTTPS (or http if apiserver so configured)
    - proxy to target may use HTTP or HTTPS as chosen by proxy using available information
    - can be used to reach a Node, Pod, or Service
    - does load balancing when used to reach a Service

1.  The [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - runs on each node
    - proxies UDP and TCP
    - does not understand HTTP
    - provides load balancing
    - is just used to reach services

1.  A Proxy/Load-balancer in front of apiserver(s):

    - existence and implementation varies from cluster to cluster (e.g. nginx)
    - sits between all clients and one or more apiservers
    - acts as load balancer if there are several apiservers.

1.  Cloud Load Balancers on external services:

    - are provided by some cloud providers (e.g. AWS ELB, Google Cloud Load Balancer)
    - are created automatically when the Kubernetes service has type `LoadBalancer`
    - use UDP/TCP only
    - implementation varies by cloud provider.

Kubernetes users will typically not need to worry about anything other than the first two types.  The cluster admin
will typically ensure that the latter types are setup correctly.

