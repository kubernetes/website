---

title: 访问集群上运行的服务
redirect_from:
- "/docs/user-guide/accessing-the-cluster/"
- "/docs/user-guide/accessing-the-cluster.html"
---

{% capture overview %}

本文展示了如何连接 Kubernetes 集群上运行的服务。
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}

## 访问集群上运行的服务


在 Kubernetes 里， [nodes](/docs/admin/node)、[pods](/docs/user-guide/pods) 和  [services](/docs/user-guide/services) 都有它们自己的 IP。许多情况下，集群上的 node IP、pod IP 和某些 service IP 路由不可达，所以不能从一个集群之外的节点访问它们，例如从你自己的台式机。


### 连接方式


你有多种从集群外连接 nodes、pods 和 services 的选项：


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


### 发现内置服务


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

这显示了用于访问每个服务的 proxy-verb URL。例如，这个集群启用了（使用 Elasticsearch）集群层面的日志，如果提供合适的凭据可以通过 `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` 访问，或通过一个 kubectl 代理地址访问，如：`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`。（请查看  [上文](#accessing-the-cluster-api) 关于如何传递凭据或者使用 kubectl 代理的说明。）


#### 手动构建 apiserver 代理 URLs


如同上面所提到的，你可以使用 `kubectl cluster-info` 命令取得 service 的代理 URL。为了创建包含 service endpoints、suffixes 和 parameters 的代理 URLs，你可以简单的在 service 的代理 URL中 添加：
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`service_name[:port_name]`*`/proxy`


如果还没有为你的端口指定名称，你可以不用在 URL 中指定 *port_name*。


##### 示例


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


#### 通过 web 浏览器访问集群中运行的服务


你或许能够将 apiserver 代理的 url 放入浏览器的地址栏，然而：


  - Web 服务器不总是能够传递令牌，所以你可能需要使用基本（密码）认证。 Apiserver 可以配置为接受基本认证，但你的集群可能并没有这样配置。
  - 某些 web 应用可能不能工作，特别是那些使用客户端侧 javascript 的应用，它们构造 url 的方式可能不能理解代理路径前缀。

{% endcapture %}

{% include templates/task.md %}
