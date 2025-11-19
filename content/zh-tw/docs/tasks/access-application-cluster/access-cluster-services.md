---
title: 訪問集羣上運行的服務
content_type: task
weight: 140
---
<!--
title: Access Services Running on Clusters
content_type: task
weight: 140
-->

<!-- overview -->
<!--
This page shows how to connect to services running on the Kubernetes cluster.
-->
本文展示瞭如何連接 Kubernetes 集羣上運行的服務。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Accessing services running on the cluster

In Kubernetes, [nodes](/docs/concepts/architecture/nodes/),
[pods](/docs/concepts/workloads/pods/) and [services](/docs/concepts/services-networking/service/) all have
their own IPs.  In many cases, the node IPs, pod IPs, and some service IPs on a cluster will not be
routable, so they will not be reachable from a machine outside the cluster,
such as your desktop machine.
-->
## 訪問集羣上運行的服務  {#accessing-services-running-on-the-cluster}

在 Kubernetes 裏，[節點](/zh-cn/docs/concepts/architecture/nodes/)、
[Pod](/zh-cn/docs/concepts/workloads/pods/) 和
[服務](/zh-cn/docs/concepts/services-networking/service/) 都有自己的 IP。
許多情況下，集羣上的節點 IP、Pod IP 和某些服務 IP 是路由不可達的，
所以不能從集羣之外訪問它們，例如從你自己的臺式機。

<!--
### Ways to connect

You have several options for connecting to nodes, pods and services from outside the cluster:
-->
### 連接方式   {#ways-to-connect}

你有多種可選方式從集羣外連接節點、Pod 和服務：

<!--
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
-->
- 通過公網 IP 訪問服務
  - 使用類型爲 `NodePort` 或 `LoadBalancer` 的 Service，可以從外部訪問它們。
    請查閱 [Service](/zh-cn/docs/concepts/services-networking/service/) 和
    [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose) 文檔。
  - 取決於你的集羣環境，你可以僅把 Service 暴露在你的企業網絡環境中，也可以將其暴露在
    因特網上。需要考慮暴露的服務是否安全，它是否有自己的用戶認證？
  - 將 Pod 放置於 Service 背後。如果要訪問一個副本集合中特定的 Pod，例如用於調試目的，
    請給 Pod 指定一個獨特的標籤並創建一個新服務選擇該標籤。
  - 大部分情況下，都不需要應用開發者通過節點 IP 直接訪問節點。
<!--
- Access services, nodes, or pods using the Proxy Verb.
  - Does apiserver authentication and authorization prior to accessing the remote service.
    Use this if the services are not secure enough to expose to the internet, or to gain
    access to ports on the node IP, or for debugging.
  - Proxies may cause problems for some web applications.
  - Only works for HTTP/HTTPS.
  - Described [here](#manually-constructing-apiserver-proxy-urls).
-->
- 通過 Proxy 動詞訪問服務、節點或者 Pod
  - 在訪問遠程服務之前，利用 API 服務器執行身份認證和鑑權。
    如果你的服務不夠安全，無法暴露到因特網中，或者需要訪問節點 IP 上的端口，
    又或者出於調試目的，可使用這種方式。
  - 代理可能給某些應用帶來麻煩
  - 此方式僅適用於 HTTP/HTTPS
  - 進一步的描述在[這裏](#manually-constructing-apiserver-proxy-urls)
  - 從集羣中的 node 或者 pod 訪問。
<!--
- Access from a node or pod in the cluster.
  - Run a pod, and then connect to a shell in it using [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec).
    Connect to other nodes, pods, and services from that shell.
  - Some clusters may allow you to ssh to a node in the cluster. From there you may be able to
    access cluster services. This is a non-standard method, and will work on some clusters but
    not others. Browsers and other tools may or may not be installed. Cluster DNS may not work.
-->
- 從集羣中的一個節點或 Pod 訪問
  - 運行一個 Pod，然後使用
    [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)
    連接到它的 Shell，從那個 Shell 連接其他的節點、Pod 和 Service。
  - 某些集羣可能允許你 SSH 到集羣中的節點。你可能可以從那兒訪問集羣服務。
    這是一個非標準的方式，可能在一些集羣上能工作，但在另一些上卻不能。
    瀏覽器和其他工具可能已經安裝也可能沒有安裝。集羣 DNS 可能不會正常工作。

<!--
### Discovering builtin services

Typically, there are several services which are started on a cluster by kube-system. Get a list of these
with the `kubectl cluster-info` command:
-->
### 發現內置服務   {#discovering-builtin-services}

典型情況下，kube-system 名字空間中會啓動集羣的幾個服務。
使用 `kubectl cluster-info` 命令獲取這些服務的列表：

```shell
kubectl cluster-info
```

<!--
The output is similar to this:
-->
輸出類似於：

```
Kubernetes master is running at https://192.0.2.1
elasticsearch-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

<!--
This shows the proxy-verb URL for accessing each service.
For example, this cluster has cluster-level logging enabled (using Elasticsearch), which can be reached
at `https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`
if suitable credentials are passed, or through a kubectl proxy at, for example:
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.
-->
這一輸出顯示了用 proxy 動詞訪問每個服務時可用的 URL。例如，此集羣
（使用 Elasticsearch）啓用了集羣層面的日誌。如果提供合適的憑據，可以通過
`https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`
訪問，或通過一個 `kubectl proxy` 來訪問：
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`。

<!--
See [Access Clusters Using the Kubernetes API](/docs/tasks/administer-cluster/access-cluster-api/#accessing-the-kubernetes-api)
for how to pass credentials or use kubectl proxy.
-->
{{< note >}}
請參閱[使用 Kubernetes API 訪問集羣](/zh-cn/docs/tasks/administer-cluster/access-cluster-api/#accessing-the-kubernetes-api)
瞭解如何傳遞憑據或如何使用 `kubectl proxy`。
{{< /note >}}

<!--
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
-->
#### 手動構建 API 服務器代理 URLs   {#manually-constructing-apiserver-proxy-urls}

如前所述，你可以使用 `kubectl cluster-info` 命令取得服務的代理 URL。
爲了創建包含服務末端、後綴和參數的代理 URLs，你可以在服務的代理 URL 中添加：
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`service_name[:port_name]`*`/proxy`

如果還沒有爲你的端口指定名稱，你可以不用在 URL 中指定 **port_name**。
對於命名和未命名端口，你還可以使用端口號代替 **port_name**。

默認情況下，API 服務器使用 HTTP 爲你的服務提供代理。 要使用 HTTPS，請在服務名稱前加上 `https:`：
`http://<kubernetes_master_address>/api/v1/namespaces/<namespace_name>/services/<service_name>/proxy`
URL 的 `<service_name>` 段支持的格式爲：
* `<service_name>` - 使用 http 代理到默認或未命名端口
* `<service_name>:<port_name>` - 使用 http 代理到指定的端口名稱或端口號
* `https:<service_name>:` -  使用 https 代理到默認或未命名端口（注意尾隨冒號）
* `https:<service_name>:<port_name>` - 使用 https 代理到指定的端口名稱或端口號

<!--
##### Examples

* To access the Elasticsearch service endpoint `_search?q=user:kimchy`, you would use:
-->
##### 示例   {#examples}

* 如要訪問 Elasticsearch 服務末端 `_search?q=user:kimchy`，你可以使用以下地址：

  ```
  http://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy
  ```

<!--
* To access the Elasticsearch cluster health information `_cluster/health?pretty=true`, you would use:
-->
* 如要訪問 Elasticsearch 集羣健康信息`_cluster/health?pretty=true`，你可以使用以下地址：

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true
  ```

  <!--
  The health information is similar to this:
  -->
  健康信息與下面的例子類似：

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
* To access the *https* Elasticsearch service health information `_cluster/health?pretty=true`, you would use:
-->
* 如要訪問 **https** Elasticsearch 服務健康信息 `_cluster/health?pretty=true`，你可以使用以下地址：

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/https:elasticsearch-logging:/proxy/_cluster/health?pretty=true
  ```

<!--
#### Using web browsers to access services running on the cluster

You may be able to put an apiserver proxy URL into the address bar of a browser. However:
-->
#### 通過 Web 瀏覽器訪問集羣中運行的服務    {#uusing-web-browsers-to-access-services-running-on-the-cluster}

你或許能夠將 API 服務器代理的 URL 放入瀏覽器的地址欄，然而：

<!--
- Web browsers cannot usually pass tokens, so you may need to use basic (password) auth.
  Apiserver can be configured to accept basic auth,
  but your cluster may not be configured to accept basic auth.
- Some web apps may not work, particularly those with client side javascript that construct URLs in a
  way that is unaware of the proxy path prefix.
-->
- Web 服務器通常不能傳遞令牌，所以你可能需要使用基本（密碼）認證。
  API 服務器可以配置爲接受基本認證，但你的集羣可能並沒有這樣配置。
- 某些 Web 應用可能無法工作，特別是那些使用客戶端 Javascript 構造 URL 的
  應用，所構造的 URL 可能並不支持代理路徑前綴。
