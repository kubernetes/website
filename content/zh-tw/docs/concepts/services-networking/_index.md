---
title: "服務、負載均衡和聯網"
weight: 60
description: >
  Kubernetes 網路背後的概念和資源。
---
<!--
title: "Services, Load Balancing, and Networking"
weight: 60
description: >
  Concepts and resources behind networking in Kubernetes.
-->

<!--
## The Kubernetes network model

The Kubernetes network model is built out of several pieces:

* Each [pod](/docs/concepts/workloads/pods/) in a cluster gets its
  own unique cluster-wide IP address.

  * A pod has its own private network namespace which is shared by
    all of the containers within the pod. Processes running in
    different containers in the same pod can communicate with each
    other over `localhost`.
-->
## Kubernetes 網路模型   {#the-kubernetes-network-model}

Kubernetes 網路模型由幾個部分構成：

* 叢集中的每個 [Pod](/zh-cn/docs/concepts/workloads/pods/)
  都會獲得自己的、獨一無二的叢集範圍 IP 地址。

  * Pod 有自己的私有網路命名空間，Pod 內的所有容器共享這個命名空間。
    運行在同一個 Pod 中的不同容器的進程彼此之間可以通過 `localhost` 進行通信。

<!--
* The _pod network_ (also called a cluster network) handles communication
  between pods. It ensures that (barring intentional network segmentation):

  * All pods can communicate with all other pods, whether they are
    on the same [node](/docs/concepts/architecture/nodes/) or on
    different nodes. Pods can communicate with each other
    directly, without the use of proxies or address translation (NAT).

    On Windows, this rule does not apply to host-network pods.

  * Agents on a node (such as system daemons, or kubelet) can
    communicate with all pods on that node.
-->
* **Pod 網路**（也稱爲叢集網路）處理 Pod 之間的通信。它確保（除非故意進行網路分段）：

  * 所有 Pod 可以與所有其他 Pod 進行通信，
    無論它們是在同一個[節點](/zh-cn/docs/concepts/architecture/nodes/)還是在不同的節點上。
    Pod 可以直接相互通信，而無需使用代理或地址轉換（NAT）。

    在 Windows 上，這條規則不適用於主機網路 Pod。

  * 節點上的代理（例如系統守護進程或 kubelet）可以與該節點上的所有 Pod 進行通信。

<!--
* The [Service](/docs/concepts/services-networking/service/) API
  lets you provide a stable (long lived) IP address or hostname for a service implemented
  by one or more backend pods, where the individual pods making up
  the service can change over time.

  * Kubernetes automatically manages
    [EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)
    objects to provide information about the pods currently backing a Service.

  * A service proxy implementation monitors the set of Service and
    EndpointSlice objects, and programs the data plane to route
    service traffic to its backends, by using operating system or
    cloud provider APIs to intercept or rewrite packets.
-->
* [Service](/zh-cn/docs/concepts/services-networking/service/) API
  允許你爲由一個或多個後端 Pod 實現的服務提供一個穩定（長效）的 IP 地址或主機名，
  其中組成服務的各個 Pod 可以隨時變化。

  * Kubernetes 會自動管理
    [EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
    對象，以提供有關當前用來提供 Service 的 Pod 的資訊。

  * 服務代理實現通過使用操作系統或雲平臺 API 來攔截或重寫資料包，
    監視 Service 和 EndpointSlice 對象集，並在資料平面編程將服務流量路由到其後端。

<!--
* The [Gateway](/docs/concepts/services-networking/gateway/) API
  (or its predecessor, [Ingress](/docs/concepts/services-networking/ingress/))
  allows you to make Services accessible to clients that are outside the cluster.

  * A simpler, but less-configurable, mechanism for cluster
    ingress is available via the Service API's
    [`type: LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer),
    when using a supported {{< glossary_tooltip term_id="cloud-provider">}}.

* [NetworkPolicy](/docs/concepts/services-networking/network-policies) is a built-in
  Kubernetes API that allows you to control traffic between pods, or between pods and
  the outside world.
-->
* [Gateway](/zh-cn/docs/concepts/services-networking/gateway/) API
  （或其前身 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
  使得叢集外部的客戶端能夠訪問 Service。

  * 當使用受支持的 {{< glossary_tooltip term_id="cloud-provider">}} 時，通過 Service API 的
    [`type: LoadBalancer`](/zh-cn/docs/concepts/services-networking/service/#loadbalancer)
    可以使用一種更簡單但可設定性較低的叢集 Ingress 機制。

* [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies)
  是一個內置的 Kubernetes API，允許你控制 Pod 之間的流量或 Pod 與外部世界之間的流量。

<!--
In older container systems, there was no automatic connectivity
between containers on different hosts, and so it was often necessary
to explicitly create links between containers, or to map container
ports to host ports to make them reachable by containers on other
hosts. This is not needed in Kubernetes; Kubernetes's model is that
pods can be treated much like VMs or physical hosts from the
perspectives of port allocation, naming, service discovery, load
balancing, application configuration, and migration.
-->
在早期的容器系統中，不同主機上的容器之間沒有自動連通，
因此通常需要顯式創建容器之間的鏈路，或將容器端口映射到主機端口，以便其他主機上的容器能夠訪問。
在 Kubernetes 中並不需要如此操作；在 Kubernetes 的網路模型中，
從端口分配、命名、服務發現、負載均衡、應用設定和遷移的角度來看，Pod 可以被視作虛擬機或物理主機。

<!--
Only a few parts of this model are implemented by Kubernetes itself.
For the other parts, Kubernetes defines the APIs, but the
corresponding functionality is provided by external components, some
of which are optional:

* Pod network namespace setup is handled by system-level software implementing the
  [Container Runtime Interface](/docs/concepts/containers/cri/).
-->
這個模型只有少部分是由 Kubernetes 自身實現的。
對於其他部分，Kubernetes 定義 API，但相應的功能由外部組件提供，其中一些是可選的：

* Pod 網路命名空間的設置由實現[容器運行時介面（CRI）](/zh-cn/docs/concepts/containers/cri/)的系統層面軟體處理。

<!--
* The pod network itself is managed by a
  [pod network implementation](/docs/concepts/cluster-administration/addons/#networking-and-network-policy).
  On Linux, most container runtimes use the
  {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}}
  to interact with the pod network implementation, so these
  implementations are often called _CNI plugins_.

* Kubernetes provides a default implementation of service proxying,
  called {{< glossary_tooltip term_id="kube-proxy">}}, but some pod
  network implementations instead use their own service proxy that
  is more tightly integrated with the rest of the implementation.
-->
* Pod 網路本身由
  [Pod 網路實現](/zh-cn/docs/concepts/cluster-administration/addons/#networking-and-network-policy)管理。
  在 Linux 上，大多數容器運行時使用{{< glossary_tooltip text="容器網路介面 (CNI)" term_id="cni" >}}
  與 Pod 網路實現進行交互，因此這些實現通常被稱爲 **CNI 插件**。

* Kubernetes 提供了一個預設的服務代理實現，稱爲 {{< glossary_tooltip term_id="kube-proxy">}}，
  但某些 Pod 網路實現使用其自己的服務代理，以便與實現的其餘組件集成得更緊密。

<!--
* NetworkPolicy is generally also implemented by the pod network
  implementation. (Some simpler pod network implementations don't
  implement NetworkPolicy, or an administrator may choose to
  configure the pod network without NetworkPolicy support. In these
  cases, the API will still be present, but it will have no effect.)

* There are many [implementations of the Gateway API](https://gateway-api.sigs.k8s.io/implementations/),
  some of which are specific to particular cloud environments, some more
  focused on "bare metal" environments, and others more generic.
-->
* NetworkPolicy 通常也由 Pod 網路實現提供支持。
  （某些更簡單的 Pod 網路實現不支持 NetworkPolicy，或者管理員可能會選擇在不支持 NetworkPolicy
  的情況下設定 Pod 網路。在這些情況下，API 仍然存在，但將沒有效果。）

* [Gateway API 的實現](https://gateway-api.sigs.k8s.io/implementations/)有很多，
  其中一些特定於某些雲環境，還有一些更專注於“裸金屬”環境，而其他一些則更加通用。

## {{% heading "whatsnext" %}}

<!--
The [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
tutorial lets you learn about Services and Kubernetes networking with a hands-on example.

[Cluster Networking](/docs/concepts/cluster-administration/networking/) explains how to set
up networking for your cluster, and also provides an overview of the technologies involved.
-->
[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)教程通過一個實際的示例讓你瞭解
Service 和 Kubernetes 如何聯網。

[叢集網路](/zh-cn/docs/concepts/cluster-administration/networking/)解釋瞭如何爲叢集設置網路，
還概述了所涉及的技術。
