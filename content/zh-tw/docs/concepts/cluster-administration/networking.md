---
title: 叢集網路系統
content_type: concept
weight: 50
---
<!--
reviewers:
- thockin
title: Cluster Networking
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
Networking is a central part of Kubernetes, but it can be challenging to
understand exactly how it is expected to work.  There are 4 distinct networking
problems to address:

1. Highly-coupled container-to-container communications: this is solved by
   {{< glossary_tooltip text="Pods" term_id="pod" >}} and `localhost` communications.
2. Pod-to-Pod communications: this is the primary focus of this document.
3. Pod-to-Service communications: this is covered by [Services](/docs/concepts/services-networking/service/).
4. External-to-Service communications: this is also covered by Services.
-->
叢集網路系統是 Kubernetes 的核心部分，但是想要準確理解它的工作原理可是個不小的挑戰。
下面列出的是網路系統的的四個主要問題：

1. 高度耦合的容器間通信：這個已經被 {{< glossary_tooltip text="Pod" term_id="pod" >}}
   和 `localhost` 通信解決了。
2. Pod 間通信：這是本文檔講述的重點。
3. Pod 與 Service 間通信：涵蓋在 [Service](/zh-cn/docs/concepts/services-networking/service/) 中。
4. 外部與 Service 間通信：也涵蓋在 Service 中。

<!-- body -->

<!--
Kubernetes is all about sharing machines among applications.  Typically,
sharing machines requires ensuring that two applications do not try to use the
same ports.  Coordinating ports across multiple developers is very difficult to
do at scale and exposes users to cluster-level issues outside of their control.
-->
Kubernetes 的宗旨就是在應用之間共享機器。
通常來說，共享機器需要兩個應用之間不能使用相同的端口，但是在多個應用開發者之間
去大規模地協調端口是件很困難的事情，而且容易引入開發者無法控制的叢集層面的問題。

<!--
Dynamic port allocation brings a lot of complications to the system - every
application has to take ports as flags, the API servers have to know how to
insert dynamic port numbers into configuration blocks, services have to know
how to find each other, etc.  Rather than deal with this, Kubernetes takes a
different approach.

To learn about the Kubernetes networking model, see [here](/docs/concepts/services-networking/).
-->
動態分配端口也會給系統帶來很多複雜度 - 每個應用都需要設置一個端口的參數，
而 API 伺服器還需要知道如何將動態端口數值插入到設定模塊中，服務也需要知道如何找到對方等等。
與其去解決這些問題，Kubernetes 選擇了其他不同的方法。

要了解 Kubernetes 網路模型，請參閱[此處](/zh-cn/docs/concepts/services-networking/)。

<!--
## Kubernetes IP address ranges

Kubernetes clusters require to allocate non-overlapping IP addresses for Pods, Services and Nodes,
from a range of available addresses configured in the following components:
-->
## Kubernetes IP 地址範圍   {#kubernetest-ip-address-ranges}

Kubernetes 叢集需要從以下組件中設定的可用地址範圍中爲 Pod、Service 和 Node 分配不重疊的 IP 地址：

<!--
- The network plugin is configured to assign IP addresses to Pods.
- The kube-apiserver is configured to assign IP addresses to Services.
- The kubelet or the cloud-controller-manager is configured to assign IP addresses to Nodes.
-->
- 設定網路插件並向 Pod 分配 IP 地址。
- 設定 kube-apiserver 並向 Service 分配 IP 地址。
- 設定 kubelet 或 cloud-controller-manager 並向 Node 分配 IP 地址。

<!--
{{< figure src="/docs/images/kubernetes-cluster-network.svg" alt="A figure illustrating the different network ranges in a kubernetes cluster" class="diagram-medium" >}}
-->
{{< figure src="/zh-cn/docs/images/kubernetes-cluster-network.svg" alt="此圖展示了 Kubernetes 叢集中不同的網路範圍" class="diagram-medium" >}}

<!--
## Cluster networking types {#cluster-network-ipfamilies}

Kubernetes clusters, attending to the IP families configured, can be categorized into:
-->
## 叢集網路類型   {#cluster-network-ipfamilies}

根據設定的 IP 協議族，Kubernetes 叢集可以分爲以下幾類：

<!--
- IPv4 only: The network plugin, kube-apiserver and kubelet/cloud-controller-manager are configured to assign only IPv4 addresses.
- IPv6 only: The network plugin, kube-apiserver and kubelet/cloud-controller-manager are configured to assign only IPv6 addresses.
- IPv4/IPv6 or IPv6/IPv4 [dual-stack](/docs/concepts/services-networking/dual-stack/):
  - The network plugin is configured to assign IPv4 and IPv6 addresses.
  - The kube-apiserver is configured to assign IPv4 and IPv6 addresses.
  - The kubelet or cloud-controller-manager is configured to assign IPv4 and IPv6 address.
  - All components must agree on the configured primary IP family.
-->
- 僅 IPv4：設定網路插件、kube-apiserver 和 kubelet/cloud-controller-manager 來僅分配 IPv4 地址。
- 僅 IPv6：設定網路插件、kube-apiserver 和 kubelet/cloud-controller-manager 來僅分配 IPv6 地址。
- IPv4/IPv6 或 IPv6/IPv4 [雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack/)：
  - 設定網路插件來分配 IPv4 和 IPv6 地址。
  - 設定kube-apiserver 來分配 IPv4 和 IPv6 地址。
  - 設定kubelet 或 cloud-controller-manager 來分配 IPv4 和 IPv6 地址。
  - 所有組件必須就設定的主要 IP 協議族達成一致。

<!--
Kubernetes clusters only consider the IP families present on the Pods, Services and Nodes objects,
independently of the existing IPs of the represented objects. Per example, a server or a pod can have multiple
IP addresses on its interfaces, but only the IP addresses in `node.status.addresses` or `pod.status.ips` are
considered for implementing the Kubernetes network model and defining the type of the cluster.
-->
Kubernetes 叢集只考慮 Pod、Service 和 Node 對象中存在的 IP 協議族，而不考慮所表示對象的現有 IP。
例如，伺服器或 Pod 的接口上可以有多個 IP 地址，但只有 `node.status.addresses` 或 `pod.status.ips`
中的 IP 地址被認爲是實現 Kubernetes 網路模型和定義叢集類型的。

<!--
## How to implement the Kubernetes network model

The network model is implemented by the container runtime on each node. The most common container
runtimes use [Container Network Interface](https://github.com/containernetworking/cni) (CNI)
plugins to manage their network and security capabilities. Many different CNI plugins exist from
many different vendors. Some of these provide only basic features of adding and removing network
interfaces, while others provide more sophisticated solutions, such as integration with other
container orchestration systems, running multiple CNI plugins, advanced IPAM features etc.
-->
## 如何實現 Kubernetes 的網路模型    {#how-to-implement-the-kubernetes-network-model}

網路模型由各節點上的容器運行時來實現。最常見的容器運行時使用
[Container Network Interface](https://github.com/containernetworking/cni) (CNI) 插件來管理其網路和安全能力。
來自不同供應商 CNI 插件有很多。其中一些僅提供添加和刪除網路接口的基本功能，
而另一些則提供更復雜的解決方案，例如與其他容器編排系統集成、運行多個 CNI 插件、高級 IPAM 功能等。

<!--
See [this page](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)
for a non-exhaustive list of networking addons supported by Kubernetes.
-->
請參閱[此頁面](/zh-cn/docs/concepts/cluster-administration/addons/#networking-and-network-policy)瞭解
Kubernetes 支持的網路插件的非詳盡列表。

## {{% heading "whatsnext" %}}

<!--
The early design of the networking model and its rationale are described in more detail in the
[networking design document](https://git.k8s.io/design-proposals-archive/network/networking.md).
For future plans and some on-going efforts that aim to improve Kubernetes networking, please
refer to the SIG-Network
[KEPs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network).
-->
網路模型的早期設計、運行原理都在[聯網設計文檔](https://git.k8s.io/design-proposals-archive/network/networking.md)裏有詳細描述。
關於未來的計劃，以及旨在改進 Kubernetes 聯網能力的一些正在進行的工作，可以參考 SIG Network
的 [KEPs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network)。
