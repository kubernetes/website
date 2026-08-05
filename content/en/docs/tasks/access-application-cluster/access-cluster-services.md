---
title: Access Services Running on Clusters
content_type: task
weight: 140
---

<!-- overview -->
This page shows how to connect to services running on the Kubernetes cluster.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Accessing services running on the cluster

In Kubernetes, [nodes](/docs/concepts/architecture/nodes/),
[pods](/docs/concepts/workloads/pods/) and [services](/docs/concepts/services-networking/service/) all have
their own IPs.  In many cases, the node IPs, pod IPs, and some service IPs on a cluster will not be
routable, so they will not be reachable from a machine outside the cluster,
such as your desktop machine.

### Ways to connect

You have several options for connecting to nodes, pods and services from outside the cluster:

- Access services through public IPs.
  - Use a service with type `NodePort` or `LoadBalancer` to make the service reachable outside
    the cluster.  See the [services](/docs/concepts/services-networking/service/) and
    [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose) documentation.
  - Depending on your cluster environment, this may only expose the service to your corporate network,
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
  - Some clusters may allow you to ssh to a node in the cluster. From there you may be able to
    access cluster services. This is a non-standard method, and will work on some clusters but
    not others. Browsers and other tools may or may not be installed. Cluster DNS may not work.

### Discovering builtin services

Typically, there are several services which are started on a cluster by kube-system. Get a list of these
with the `kubectl cluster-info` command:

```shell
kubectl cluster-info
```

The output is similar to this:

```
Kubernetes master is running at https://192.0.2.1
elasticsearch-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

This shows the proxy-verb URL for accessing each service.
For example, this cluster has cluster-level logging enabled (using Elasticsearch), which can be reached
at `https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`
if suitable credentials are passed, or through a kubectl proxy at, for example:
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.

{{< note >}}
See [Access Clusters Using the Kubernetes API](/docs/tasks/administer-cluster/access-cluster-api/#accessing-the-kubernetes-api)
for how to pass credentials or use kubectl proxy.
{{< /note >}}

#### Manually constructing apiserver proxy URLs

As mentioned above, you use the `kubectl cluster-info` command to retrieve the service's proxy URL. To create
proxy URLs that include service endpoints, suffixes, and parameters, you append to the service's proxy URL:
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`[https:]service_name[:port_name]`*`/proxy`

If you haven't specified a name for your port, you don't have to specify *port_name* in the URL. You can also
use the port number in place of the *port_name* for both named and unnamed ports.

By default, the API server proxies to your service using HTTP. To use HTTPS, prefix the service name with `https:`:
`http://<kubernetes_master_address>/api/v1/namespaces/<namespace_name>/services/<service_name>/proxy`

The supported formats for the `<service_name>` segment of the URL are:

* `<service_name>` - proxies to the default or unnamed port using http
* `<service_name>:<port_name>` - proxies to the specified port name or port number using http
* `https:<service_name>:` - proxies to the default or unnamed port using https (note the trailing colon)
* `https:<service_name>:<port_name>` - proxies to the specified port name or port number using https

##### Examples

* To access the Elasticsearch service endpoint `_search?q=user:kimchy`, you would use:

  ```
  http://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy
  ```

* To access the Elasticsearch cluster health information `_cluster/health?pretty=true`, you would use:

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true
  ```

  The health information is similar to this:

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

* To access the *https* Elasticsearch service health information `_cluster/health?pretty=true`, you would use:

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/https:elasticsearch-logging:/proxy/_cluster/health?pretty=true
  ```

#### Using web browsers to access services running on the cluster

You may be able to put an apiserver proxy URL into the address bar of a browser. However:

- Web browsers cannot usually pass tokens, so you may need to use basic (password) auth.
  Apiserver can be configured to accept basic auth,
  but your cluster may not be configured to accept basic auth.
- Some web apps may not work, particularly those with client side javascript that construct URLs in a
  way that is unaware of the proxy path prefix.
