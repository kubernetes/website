---
cn-approvers:
- xiaosuiba
cn-reviewers:
- brucehex
title: 访问集群上运行的服务
redirect_from:
- "/docs/user-guide/accessing-the-cluster/"
- "/docs/user-guide/accessing-the-cluster.html"
---

{% capture overview %}
<!--
This page shows how to connect to services running on the Kubernetes cluster. 
-->
本文展示了如何连接 Kubernetes 集群上运行的服务。
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}
<!--
## Accessing services running on the cluster
-->
## 访问集群上运行的服务

<!--
In Kubernetes, [nodes](/docs/admin/node), [pods](/docs/user-guide/pods) and [services](/docs/user-guide/services) all have
their own IPs.  In many cases, the node IPs, pod IPs, and some service IPs on a cluster will not be
routable, so they will not be reachable from a machine outside the cluster,
such as your desktop machine.
-->
在 Kubernetes 里， [nodes](/docs/admin/node)、[pods](/docs/user-guide/pods) 和  [services](/docs/user-guide/services) 都有它们自己的 IP。许多情况下，集群上的 node IP、pod IP 和某些 service IP 路由不可达，所以不能从一个集群之外的节点访问它们，例如从你自己的台式机。

<!--
### Ways to connect
-->
### 连接方式

<!--
You have several options for connecting to nodes, pods and services from outside the cluster:
-->
你有多种从集群外连接 nodes、pods 和 services 的选项：

<!--
  - Access services through public IPs.
    - Use a service with type `NodePort` or `LoadBalancer` to make the service reachable outside
      the cluster.  See the [services](/docs/user-guide/services) and
      [kubectl expose](/docs/user-guide/kubectl/v1.6/#expose) documentation.
    - Depending on your cluster environment, this may just expose the service to your corporate network,
      or it may expose it to the internet.  Think about whether the service being exposed is secure.
      Does it do its own authentication?
    - Place pods behind services.  To access one specific pod from a set of replicas, such as for debugging,
      place a unique label on the pod it and create a new service which selects this label.
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
    - Run a pod, and then connect to a shell in it using [kubectl exec](/docs/user-guide/kubectl/v1.6/#exec).
      Connect to other nodes, pods, and services from that shell.
    - Some clusters may allow you to ssh to a node in the cluster.  From there you may be able to
      access cluster services.  This is a non-standard method, and will work on some clusters but
      not others.  Browsers and other tools may or may not be installed.  Cluster DNS may not work.
      -->
  - 通过公共 IP 访问 services。
    - 使用具有 `NodePort` 或 `LoadBalancer` 类型的 service，可以从外部访问它们。请查阅 [services](/docs/user-guide/services) 和 [kubectl expose](/docs/user-guide/kubectl/v1.6/#expose) 文档。
    - 取决于你的集群环境，你可以仅把 service 暴露在你的企业网络环境中，也可以将其暴露在因特网上。需要考虑暴露的 service 是否安全，它是否有自己的用户认证？
    - 将 pods 放置于 services 背后。如果要访问一个副本集合中特定的 pod，例如用于调试目的时，请给 pod 指定一个独特的标签并创建一个新 service 选择这个标签。
    - 大部分情况下，都不需要应用开发者通过节点 IP 直接访问 nodes。
  - 通过 Proxy Verb 访问  services、nodes 或者  pods。
    - 在访问 Apiserver 远程服务之前是否经过认证和授权？如果你的服务暴露到因特网中不够安全，或者需要获取 node IP 之上的端口，又或者处于调试目的时，请使用这个特性。
    - Proxies 可能给某些应用带来麻烦。
    - 仅适用于 HTTP/HTTPS。
    - 在[这里](#manually-constructing-apiserver-proxy-urls)描述
  - 从集群中的 node 或者 pod 访问。
    - 运行一个 pod，然后使用 [kubectl exec](/docs/user-guide/kubectl/v1.6/#exec) 连接到它的一个shell。从那个 shell 连接其他的 nodes、pods 和 services。
    - 某些集群可能允许你 ssh 到集群中的节点。你可能可以从那儿访问集群服务。这是一个非标准的方式，可能在一些集群上能工作，但在另一些上却不能。浏览器和其他工具可能安装或可能不会安装。集群 DNS 可能不会正常工作。

<!--
### Discovering builtin services
-->
### 发现内置服务

<!--
Typically, there are several services which are started on a cluster by kube-system. Get a list of these
with the `kubectl cluster-info` command:
-->
典型情况下，kube-system 会启动集群中的几个服务。使用 `kubectl cluster-info` 命令获取它们的列表：

```shell
$ kubectl cluster-info

  Kubernetes master is running at https://104.197.5.247
  elasticsearch-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
  kibana-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kibana-logging/proxy
  kube-dns is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kube-dns/proxy
  grafana is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
  heapster is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```
<!--
This shows the proxy-verb URL for accessing each service.
For example, this cluster has cluster-level logging enabled (using Elasticsearch), which can be reached
at `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` if suitable credentials are passed, or through a kubectl proxy at, for example:
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.
(See [above](#accessing-the-cluster-api) for how to pass credentials or use kubectl proxy.)
-->
这显示了用于访问每个服务的 proxy-verb URL。例如，这个集群启用了（使用 Elasticsearch）集群层面的日志，如果提供合适的凭据可以通过 `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` 访问，或通过一个 kubectl 代理地址访问，如：`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`。（请查看  [上文](#accessing-the-cluster-api) 关于如何传递凭据或者使用 kubectl 代理的说明。）

<!--
#### Manually constructing apiserver proxy URLs
-->
#### 手动构建 apiserver 代理 URLs

<!--
As mentioned above, you use the `kubectl cluster-info` command to retrieve the service's proxy URL. To create proxy URLs that include service endpoints, suffixes, and parameters, you simply append to the service's proxy URL:
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`service_name[:port_name]`*`/proxy`
-->
如同上面所提到的，你可以使用 `kubectl cluster-info` 命令取得 service 的代理 URL。为了创建包含 service endpoints、suffixes 和 parameters 的代理 URLs，你可以简单的在 service 的代理 URL中 添加：
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`service_name[:port_name]`*`/proxy`

<!--
If you haven't specified a name for your port, you don't have to specify *port_name* in the URL
-->
如果还没有为你的端口指定名称，你可以不用在 URL 中指定 *port_name*。

<!--
##### Examples
-->
##### 示例

<!--
 * To access the Elasticsearch service endpoint `_search?q=user:kimchy`, you would use:   `http://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy`
 * To access the Elasticsearch cluster health information `_cluster/health?pretty=true`, you would use:   `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true`
-->
 * 你可以通过 `http://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy` 访问 Elasticsearch service endpoint `_search?q=user:kimchy`。
 * 你可以通过 `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true` 访问 Elasticsearch 集群健康信息 endpoint `_cluster/health?pretty=true`。

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

<!--
#### Using web browsers to access services running on the cluster
-->
#### 通过 web 浏览器访问集群中运行的服务

<!--
You may be able to put an apiserver proxy url into the address bar of a browser. However:
-->
你或许能够将 apiserver 代理的 URL 放入浏览器的地址栏，然而：

<!--
  - Web browsers cannot usually pass tokens, so you may need to use basic (password) auth.  Apiserver can be configured to accept basic auth,
    but your cluster may not be configured to accept basic auth.
  - Some web apps may not work, particularly those with client side javascript that construct urls in a
    way that is unaware of the proxy path prefix.
-->
  - Web 服务器不总是能够传递令牌，所以你可能需要使用基本（密码）认证。 Apiserver 可以配置为接受基本认证，但你的集群可能并没有这样配置。
  - 某些 web 应用可能不能工作，特别是那些使用客户端侧 javascript 的应用，它们构造 URL 的方式可能不能理解代理路径前缀。

{% endcapture %}

{% include templates/task.md %}
