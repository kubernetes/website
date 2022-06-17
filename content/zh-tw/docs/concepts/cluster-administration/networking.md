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
3. Pod-to-Service communications: this is covered by [services](/docs/concepts/services-networking/service/).
4. External-to-Service communications: this is covered by [services](/docs/concepts/services-networking/service/).
-->
叢集網路系統是 Kubernetes 的核心部分，但是想要準確瞭解它的工作原理可是個不小的挑戰。
下面列出的是網路系統的的四個主要問題：

1. 高度耦合的容器間通訊：這個已經被 {{< glossary_tooltip text="Pods" term_id="pod" >}}
   和 `localhost` 通訊解決了。
2. Pod 間通訊：本文件講述重點。
3. Pod 和服務間通訊：由[服務](/zh-cn/docs/concepts/services-networking/service/)負責。
4. 外部和服務間通訊：也由[服務](/zh-cn/docs/concepts/services-networking/service/)負責。

<!-- body -->

<!--
Kubernetes is all about sharing machines between applications.  Typically,
sharing machines requires ensuring that two applications do not try to use the
same ports.  Coordinating ports across multiple developers is very difficult to
do at scale and exposes users to cluster-level issues outside of their control.

Dynamic port allocation brings a lot of complications to the system - every
application has to take ports as flags, the API servers have to know how to
insert dynamic port numbers into configuration blocks, services have to know
how to find each other, etc.  Rather than deal with this, Kubernetes takes a
different approach.

To learn about the Kubernetes networking model, see [here](/docs/concepts/services-networking/).
-->
Kubernetes 的宗旨就是在應用之間共享機器。
通常來說，共享機器需要兩個應用之間不能使用相同的埠，但是在多個應用開發者之間
去大規模地協調埠是件很困難的事情，尤其是還要讓使用者暴露在他們控制範圍之外的叢集級別的問題上。

動態分配埠也會給系統帶來很多複雜度 - 每個應用都需要設定一個埠的引數，
而 API 伺服器還需要知道如何將動態埠數值插入到配置模組中，服務也需要知道如何找到對方等等。
與其去解決這些問題，Kubernetes 選擇了其他不同的方法。

要了解 Kubernetes 網路模型，請參閱[此處](/zh-cn/docs/concepts/services-networking/)。
<!--
## How to implement the Kubernetes networking model

There are a number of ways that this network model can be implemented.  This
document is not an exhaustive study of the various methods, but hopefully serves
as an introduction to various technologies and serves as a jumping-off point.

The following networking options are sorted alphabetically - the order does not
imply any preferential status.
-->
## 如何實現 Kubernetes 的網路模型    {#how-to-implement-the-kubernetes-networking-model}

有很多種方式可以實現這種網路模型，本文件並不是對各種實現技術的詳細研究，
但是希望可以作為對各種技術的詳細介紹，並且成為你研究的起點。

接下來的網路技術是按照首字母排序，順序本身並無其他意義。

{{% thirdparty-content %}}

<!--
### ACI

[Cisco Application Centric Infrastructure](https://www.cisco.com/c/en/us/solutions/data-center-virtualization/application-centric-infrastructure/index.html) offers an integrated overlay and underlay SDN solution that supports containers, virtual machines, and bare metal servers. [ACI](https://www.github.com/noironetworks/aci-containers) provides container networking integration for ACI. An overview of the integration is provided [here](https://www.cisco.com/c/dam/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-739493.pdf).
-->
### ACI
[Cisco Application Centric Infrastructure](https://www.cisco.com/c/en/us/solutions/data-center-virtualization/application-centric-infrastructure/index.html)
提供了一個整合覆蓋網路和底層 SDN 的解決方案來支援容器、虛擬機器和其他裸機伺服器。
[ACI](https://www.github.com/noironetworks/aci-containers) 為 ACI 提供了容器網路整合。
點選[這裡](https://www.cisco.com/c/dam/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-739493.pdf)檢視概述。

<!--
### Antrea

Project [Antrea](https://github.com/vmware-tanzu/antrea) is an opensource Kubernetes networking solution intended to be Kubernetes native. It leverages Open vSwitch as the networking data plane. Open vSwitch is a high-performance programmable virtual switch that supports both Linux and Windows. Open vSwitch enables Antrea to implement Kubernetes Network Policies in a high-performance and efficient manner.
Thanks to the "programmable" characteristic of Open vSwitch, Antrea is able to implement an extensive set of networking and security features and services on top of Open vSwitch.
-->
### Antrea

[Antrea](https://github.com/vmware-tanzu/antrea) 專案是一個開源的聯網解決方案，旨在成為
Kubernetes 原生的網路解決方案。它利用 Open vSwitch 作為網路資料平面。
Open vSwitch 是一個高效能可程式設計的虛擬交換機，支援 Linux 和 Windows 平臺。
Open vSwitch 使 Antrea 能夠以高效能和高效的方式實現 Kubernetes 的網路策略。
藉助 Open vSwitch 可程式設計的特性，Antrea 能夠在 Open vSwitch 之上實現廣泛的聯網、安全功能和服務。

<!--
### AWS VPC CNI for Kubernetes

The [AWS VPC CNI](https://github.com/aws/amazon-vpc-cni-k8s) offers integrated AWS Virtual Private Cloud (VPC) networking for Kubernetes clusters. This CNI plugin offers high throughput and availability, low latency, and minimal network jitter. Additionally, users can apply existing AWS VPC networking and security best practices for building Kubernetes clusters. This includes the ability to use VPC flow logs, VPC routing policies, and security groups for network traffic isolation.

Using this CNI plugin allows Kubernetes pods to have the same IP address inside the pod as they do on the VPC network. The CNI allocates AWS Elastic Networking Interfaces (ENIs) to each Kubernetes node and using the secondary IP range from each ENI for pods on the node. The CNI includes controls for pre-allocation of ENIs and IP addresses for fast pod startup times and enables large clusters of up to 2,000 nodes.

Additionally, the CNI can be run alongside [Calico for network policy enforcement](https://docs.aws.amazon.com/eks/latest/userguide/calico.html). The AWS VPC CNI project is open source with [documentation on GitHub](https://github.com/aws/amazon-vpc-cni-k8s).
-->
### Kubernetes 的 AWS VPC CNI     {#aws-vpc-cni-for-kubernetes}

[AWS VPC CNI](https://github.com/aws/amazon-vpc-cni-k8s) 為 Kubernetes 叢集提供了整合的
AWS 虛擬私有云（VPC）網路。該 CNI 外掛提供了高吞吐量和可用性，低延遲以及最小的網路抖動。
此外，使用者可以使用現有的 AWS VPC 網路和安全最佳實踐來構建 Kubernetes 叢集。
這包括使用 VPC 流日誌、VPC 路由策略和安全組進行網路流量隔離的功能。

使用該 CNI 外掛，可使 Kubernetes Pod 擁有與在 VPC 網路上相同的 IP 地址。
CNI 將 AWS 彈性網路介面（ENI）分配給每個 Kubernetes 節點，並將每個 ENI 的輔助 IP 範圍用於該節點上的 Pod。
CNI 包含用於 ENI 和 IP 地址的預分配的控制元件，以便加快 Pod 的啟動時間，並且能夠支援多達 2000 個節點的大型叢集。

此外，CNI 可以與
[用於執行網路策略的 Calico](https://docs.aws.amazon.com/eks/latest/userguide/calico.html) 一起執行。
AWS VPC CNI 專案是開源的，請檢視 [GitHub 上的文件](https://github.com/aws/amazon-vpc-cni-k8s)。

<!--
### Azure CNI for Kubernetes
[Azure CNI](https://docs.microsoft.com/en-us/azure/virtual-network/container-networking-overview) is an [open source](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) plugin that integrates Kubernetes Pods with an Azure Virtual Network (also known as VNet) providing network performance at par with VMs. Pods can connect to peered VNet and to on-premises over Express Route or site-to-site VPN and are also directly reachable from these networks. Pods can access Azure services, such as storage and SQL, that are protected by Service Endpoints or Private Link. You can use VNet security policies and routing to filter Pod traffic. The plugin assigns VNet IPs to Pods by utilizing a pool of secondary IPs pre-configured on the Network Interface of a Kubernetes node.

Azure CNI is available natively in the [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni).
-->
### Kubernetes 的 Azure CNI     {#azure-cni-for-kubernetes}

[Azure CNI](https://docs.microsoft.com/en-us/azure/virtual-network/container-networking-overview)
是一個[開源外掛](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md)，
將 Kubernetes Pods 和 Azure 虛擬網路（也稱為 VNet）整合在一起，可提供與 VM 相當的網路效能。
Pod 可以透過 Express Route 或者 站點到站點的 VPN 來連線到對等的 VNet，
也可以從這些網路來直接訪問 Pod。Pod 可以訪問受服務端點或者受保護連結的 Azure 服務，比如儲存和 SQL。
你可以使用 VNet 安全策略和路由來篩選 Pod 流量。
該外掛透過利用在 Kubernetes 節點的網路介面上預分配的輔助 IP 池將 VNet 分配給 Pod。

Azure CNI 可以在
[Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni) 中獲得。

<!--
### Calico

[Calico](https://projectcalico.docs.tigera.io/about/about-calico/) is an open source networking and network security solution for containers, virtual machines, and native host-based workloads. Calico supports multiple data planes including: a pure Linux eBPF dataplane, a standard Linux networking dataplane, and a Windows HNS dataplane. Calico provides a full networking stack but can also be used in conjunction with [cloud provider CNIs](https://projectcalico.docs.tigera.io/networking/determine-best-networking#calico-compatible-cni-plugins-and-cloud-provider-integrations) to provide network policy enforcement.
-->
### Calico

[Calico](https://projectcalico.docs.tigera.io/about/about-calico/) 是一個開源的聯網及網路安全方案，
用於基於容器、虛擬機器和本地主機的工作負載。
Calico 支援多個數據面，包括：純 Linux eBPF 的資料面、標準的 Linux 聯網資料面
以及 Windows HNS 資料面。Calico 在提供完整的聯網堆疊的同時，還可與
[雲驅動 CNIs](https://projectcalico.docs.tigera.io/networking/determine-best-networking#calico-compatible-cni-plugins-and-cloud-provider-integrations)
聯合使用，以保證網路策略實施。

<!--
### Cilium

[Cilium](https://github.com/cilium/cilium) is open source software for
providing and transparently securing network connectivity between application
containers. Cilium is L7/HTTP aware and can enforce network policies on L3-L7
using an identity based security model that is decoupled from network
addressing, and it can be used in combination with other CNI plugins.
-->
### Cilium

[Cilium](https://github.com/cilium/cilium) 是一個開源軟體，用於提供並透明保護應用容器間的網路連線。
Cilium 支援 L7/HTTP，可以在 L3-L7 上透過使用與網路分離的基於身份的安全模型定址來實施網路策略，
並且可以與其他 CNI 外掛結合使用。

<!--
### CNI-Genie from Huawei

[CNI-Genie](https://github.com/cni-genie/CNI-Genie) is a CNI plugin that enables Kubernetes to [simultaneously have access to different implementations](https://github.com/cni-genie/CNI-Genie/blob/master/docs/multiple-cni-plugins/README.md#what-cni-genie-feature-1-multiple-cni-plugins-enables) of the [Kubernetes network model](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model) in runtime. This includes any implementation that runs as a [CNI plugin](https://github.com/containernetworking/cni#3rd-party-plugins), such as [Flannel](https://github.com/flannel-io/flannel#flannel), [Calico](https://projectcalico.docs.tigera.io/about/about-calico/), [Weave-net](https://www.weave.works/oss/net/).

CNI-Genie also supports [assigning multiple IP addresses to a pod](https://github.com/cni-genie/CNI-Genie/blob/master/docs/multiple-ips/README.md#feature-2-extension-cni-genie-multiple-ip-addresses-per-pod), each from a different CNI plugin.
-->
### 華為的 CNI-Genie    {#cni-genie-from-huawei}

[CNI-Genie](https://github.com/cni-genie/CNI-Genie) 是一個 CNI 外掛，
可以讓 Kubernetes 在執行時使用不同的[網路模型](#the-kubernetes-network-model)的
[實現同時被訪問](https://github.com/cni-genie/CNI-Genie/blob/master/docs/multiple-cni-plugins/README.md#what-cni-genie-feature-1-multiple-cni-plugins-enables)。
這包括以
[CNI 外掛](https://github.com/containernetworking/cni#3rd-party-plugins)執行的任何實現，比如
[Flannel](https://github.com/flannel-io/flannel#flannel)、
[Calico](https://projectcalico.docs.tigera.io/about/about-calico/)、
[Weave-net](https://www.weave.works/oss/net/)。

CNI-Genie 還支援[將多個 IP 地址分配給 Pod](https://github.com/cni-genie/CNI-Genie/blob/master/docs/multiple-ips/README.md#feature-2-extension-cni-genie-multiple-ip-addresses-per-pod)，
每個都來自不同的 CNI 外掛。

<!--
### cni-ipvlan-vpc-k8s
[cni-ipvlan-vpc-k8s](https://github.com/lyft/cni-ipvlan-vpc-k8s) contains a set
of CNI and IPAM plugins to provide a simple, host-local, low latency, high
throughput, and compliant networking stack for Kubernetes within Amazon Virtual
Private Cloud (VPC) environments by making use of Amazon Elastic Network
Interfaces (ENI) and binding AWS-managed IPs into Pods using the Linux kernel's
IPvlan driver in L2 mode.

The plugins are designed to be straightforward to configure and deploy within a
VPC. Kubelets boot and then self-configure and scale their IP usage as needed
without requiring the often recommended complexities of administering overlay
networks, BGP, disabling source/destination checks, or adjusting VPC route
tables to provide per-instance subnets to each host (which is limited to 50-100
entries per VPC). In short, cni-ipvlan-vpc-k8s significantly reduces the
network complexity required to deploy Kubernetes at scale within AWS.
-->
### cni-ipvlan-vpc-k8s

[cni-ipvlan-vpc-k8s](https://github.com/lyft/cni-ipvlan-vpc-k8s)
包含了一組 CNI 和 IPAM 外掛來提供一個簡單的、本地主機、低延遲、高吞吐量
以及透過使用 Amazon 彈性網路介面（ENI）並使用 Linux 核心的 IPv2 驅動程式
以 L2 模式將 AWS 管理的 IP 繫結到 Pod 中，
在 Amazon Virtual Private Cloud（VPC）環境中為 Kubernetes 相容的網路堆疊。

這些外掛旨在直接在 VPC 中進行配置和部署，Kubelets 先啟動，
然後根據需要進行自我配置和擴充套件它們的 IP 使用率，而無需經常建議複雜的管理
覆蓋網路、BGP、禁用源/目標檢查或調整 VPC 路由表以向每個主機提供每個例項子網的
複雜性（每個 VPC 限制為50-100個條目）。
簡而言之，cni-ipvlan-vpc-k8s 大大降低了在 AWS 中大規模部署 Kubernetes 所需的網路複雜性。

<!--
### Coil

[Coil](https://github.com/cybozu-go/coil) is a CNI plugin designed for ease of integration, providing flexible egress networking.
Coil operates with a low overhead compared to bare metal, and allows you to define arbitrary egress NAT gateways for external networks.

-->
### Coil

[Coil](https://github.com/cybozu-go/coil) 是一個為易於整合、提供靈活的出站流量網路而設計的 CNI 外掛。
與裸機相比，Coil 的額外操作開銷低，並允許針對外部網路的出站流量任意定義 NAT 閘道器。

<!--
### Contiv-VPP

[Contiv-VPP](https://contivpp.io/) is a user-space, performance-oriented network plugin for
Kubernetes, using the [fd.io](https://fd.io/) data plane.
-->
### Contiv-VPP
[Contiv-VPP](https://contivpp.io/) 是用於 Kubernetes 的使用者空間、面向效能的網路外掛，使用 [fd.io](https://fd.io/) 資料平面。

### Contrail / Tungsten Fabric

<!--
[Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), based on [Tungsten Fabric](https://tungsten.io), is a truly open, multi-cloud network virtualization and policy management platform. Contrail and Tungsten Fabric are integrated with various orchestration systems such as Kubernetes, OpenShift, OpenStack and Mesos, and provide different isolation modes for virtual machines, containers/pods and bare metal workloads.
-->
[Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/)
是基於 [Tungsten Fabric](https://tungsten.io) 的，真正開放的多雲網路虛擬化和策略管理平臺。
Contrail 和 Tungsten Fabric 與各種編排系統整合在一起，例如 Kubernetes、OpenShift、OpenStack 和 Mesos，
併為虛擬機器、容器或 Pods 以及裸機工作負載提供了不同的隔離模式。

<!--
### DANM

[DANM](https://github.com/nokia/danm) is a networking solution for telco workloads running in a Kubernetes cluster. It's built up from the following components:

   * A CNI plugin capable of provisioning IPVLAN interfaces with advanced features
   * An in-built IPAM module with the capability of managing multiple, cluster-wide, discontinuous L3 networks and provide a dynamic, static, or no IP allocation scheme on-demand
   * A CNI metaplugin capable of attaching multiple network interfaces to a container, either through its own CNI, or through delegating the job to any of the popular CNI solution like SRI-OV, or Flannel in parallel
   * A Kubernetes controller capable of centrally managing both VxLAN and VLAN interfaces of all Kubernetes hosts
   * Another Kubernetes controller extending Kubernetes' Service-based service discovery concept to work over all network interfaces of a Pod

With this toolset DANM is able to provide multiple separated network interfaces, the possibility to use different networking back ends and advanced IPAM features for the pods.
-->
### DANM

[DANM](https://github.com/nokia/danm) 是一個針對在 Kubernetes 叢集中執行的電信工作負載的網路解決方案。
它由以下幾個元件構成：

* 能夠配置具有高階功能的 IPVLAN 介面的 CNI 外掛
* 一個內建的 IPAM 模組，能夠管理多個、叢集內的、不連續的 L3 網路，並按請求提供動態、靜態或無 IP 分配方案
* CNI 元外掛能夠透過自己的 CNI 或透過將任務授權給其他任何流行的 CNI 解決方案（例如 SRI-OV 或 Flannel）來實現將多個網路介面連線到容器
* Kubernetes 控制器能夠集中管理所有 Kubernetes 主機的 VxLAN 和 VLAN 介面
* 另一個 Kubernetes 控制器擴充套件了 Kubernetes 的基於服務的服務發現概念，以在 Pod 的所有網路介面上工作

透過這個工具集，DANM 可以提供多個分離的網路介面，可以為 Pod 使用不同的網路後端和高階 IPAM 功能。

<!--
### Flannel

[Flannel](https://github.com/flannel-io/flannel#flannel) is a very simple overlay
network that satisfies the Kubernetes requirements. Many
people have reported success with Flannel and Kubernetes.
-->
### Flannel

[Flannel](https://github.com/flannel-io/flannel#flannel) 是一個非常簡單的能夠滿足
Kubernetes 所需要的覆蓋網路。已經有許多人報告了使用 Flannel 和 Kubernetes 的成功案例。

<!--
### Hybridnet

[Hybridnet](https://github.com/alibaba/hybridnet) is an open source CNI plugin designed for hybrid clouds which provides both overlay and underlay networking for containers in one or more clusters. Overlay and underlay containers can run on the same node and have cluster-wide bidirectional network connectivity.
-->
### Hybridnet

[Hybridnet](https://github.com/alibaba/hybridnet) 是一個為混合雲設計的開源 CNI 外掛，
它為一個或多個叢集中的容器提供覆蓋和底層網路。Overlay 和 underlay 容器可以在同一個節點上執行，
並具有叢集範圍的雙向網路連線。

<!--
### Jaguar

[Jaguar](https://gitlab.com/sdnlab/jaguar) is an open source solution for Kubernetes's network based on OpenDaylight. Jaguar provides overlay network using vxlan and Jaguar CNIPlugin provides one IP address per pod.

### k-vswitch

[k-vswitch](https://github.com/k-vswitch/k-vswitch) is a simple Kubernetes networking plugin based on [Open vSwitch](https://www.openvswitch.org/). It leverages existing functionality in Open vSwitch to provide a robust networking plugin that is easy-to-operate, performant and secure.
-->
### Jaguar

[Jaguar](https://gitlab.com/sdnlab/jaguar) 是一個基於 OpenDaylight 的 Kubernetes 網路開源解決方案。
Jaguar 使用 vxlan 提供覆蓋網路，而 Jaguar CNIPlugin 為每個 Pod 提供一個 IP 地址。

### k-vswitch

[k-vswitch](https://github.com/k-vswitch/k-vswitch) 是一個基於
[Open vSwitch](https://www.openvswitch.org/) 的簡易 Kubernetes 網路外掛。
它利用 Open vSwitch 中現有的功能來提供強大的網路外掛，該外掛易於操作，高效且安全。

<!--
### Knitter

[Knitter](https://github.com/ZTE/Knitter/) is a network solution which supports multiple networking in Kubernetes. It provides the ability of tenant management and network management. Knitter includes a set of end-to-end NFV container networking solutions besides multiple network planes, such as keeping IP address for applications, IP address migration, etc.

### Kube-OVN

[Kube-OVN](https://github.com/alauda/kube-ovn) is an OVN-based kubernetes network fabric for enterprises. With the help of OVN/OVS, it provides some advanced overlay network features like subnet, QoS, static IP allocation, traffic mirroring, gateway, openflow-based network policy and service proxy.
-->
### Knitter

[Knitter](https://github.com/ZTE/Knitter/) 是一個支援 Kubernetes 中實現多個網路系統的解決方案。
它提供了租戶管理和網路管理的功能。除了多個網路平面外，Knitter 還包括一組端到端的 NFV 容器網路解決方案，
例如為應用程式保留 IP 地址、IP 地址遷移等。

### Kube-OVN

[Kube-OVN](https://github.com/alauda/kube-ovn) 是一個基於 OVN 的用於企業的 Kubernetes 網路架構。
藉助於 OVN/OVS，它提供了一些高階覆蓋網路功能，例如子網、QoS、靜態 IP 分配、流量映象、閘道器、
基於 openflow 的網路策略和服務代理。

<!--
### Kube-router

[Kube-router](https://github.com/cloudnativelabs/kube-router) is a purpose-built networking solution for Kubernetes that aims to provide high performance and operational simplicity. Kube-router provides a Linux [LVS/IPVS](https://www.linuxvirtualserver.org/software/ipvs.html)-based service proxy, a Linux kernel forwarding-based pod-to-pod networking solution with no overlays, and iptables/ipset-based network policy enforcer.
-->
### Kube-router

[Kube-router](https://github.com/cloudnativelabs/kube-router) 是 Kubernetes 的專用網路解決方案，
旨在提供高效能和易操作性。
Kube-router 提供了一個基於 Linux [LVS/IPVS](https://www.linuxvirtualserver.org/software/ipvs.html)
的服務代理、一個基於 Linux 核心轉發的無覆蓋 Pod-to-Pod 網路解決方案和基於 iptables/ipset 的網路策略執行器。

<!--
### L2 networks and linux bridging

If you have a "dumb" L2 network, such as a simple switch in a "bare-metal"
environment, you should be able to do something similar to the above GCE setup.
Note that these instructions have only been tried very casually - it seems to
work, but has not been thoroughly tested.  If you use this technique and
perfect the process, please let us know.

Follow the "With Linux Bridge devices" section of
[this very nice tutorial](https://blog.oddbit.com/2014/08/11/four-ways-to-connect-a-docker/) from
Lars Kellogg-Stedman.
-->
### L2 networks and linux bridging

如果你具有一個“啞”的 L2 網路，例如“裸機”環境中的簡單交換機，則應該能夠執行與上述 GCE 設定類似的操作。
請注意，這些說明僅是非常簡單的嘗試過-似乎可行，但尚未經過全面測試。
如果你使用此技術並完善了流程，請告訴我們。

根據 Lars Kellogg-Stedman 的這份非常不錯的 “Linux 網橋裝置”
[使用說明](https://blog.oddbit.com/2014/08/11/four-ways-to-connect-a-docker/)來進行操作。

<!--
### Multus (a Multi Network plugin)

Multus is a Multi CNI plugin to support the Multi Networking feature in Kubernetes using CRD based network objects in Kubernetes.

Multus supports all [reference plugins](https://github.com/containernetworking/plugins) (eg. [Flannel](https://github.com/containernetworking/cni.dev/blob/main/content/plugins/v0.9/meta/flannel.md), [DHCP](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/dhcp), [Macvlan](https://github.com/containernetworking/plugins/tree/master/plugins/main/macvlan)) that implement the CNI specification and 3rd party plugins (eg. [Calico](https://github.com/projectcalico/cni-plugin), [Weave](https://github.com/weaveworks/weave), [Cilium](https://github.com/cilium/cilium), [Contiv](https://github.com/contiv/netplugin)). In addition to it, Multus supports [SRIOV](https://github.com/hustcat/sriov-cni), [DPDK](https://github.com/Intel-Corp/sriov-cni), [OVS-DPDK & VPP](https://github.com/intel/vhost-user-net-plugin) workloads in Kubernetes with both cloud native and NFV based applications in Kubernetes.
-->
### Multus (a Multi Network plugin)

[Multus](https://github.com/Intel-Corp/multus-cni) 是一個多 CNI 外掛，
使用 Kubernetes 中基於 CRD 的網路物件來支援實現 Kubernetes 多網路系統。

Multus 支援所有[參考外掛](https://github.com/containernetworking/plugins)（比如：
[Flannel](https://github.com/containernetworking/cni.dev/blob/main/content/plugins/v0.9/meta/flannel.md)、
[DHCP](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/dhcp)、
[Macvlan](https://github.com/containernetworking/plugins/tree/master/plugins/main/macvlan) ）
來實現 CNI 規範和第三方外掛（比如：
[Calico](https://github.com/projectcalico/cni-plugin)、
[Weave](https://github.com/weaveworks/weave)、
[Cilium](https://github.com/cilium/cilium)、
[Contiv](https://github.com/contiv/netplugin)）。
除此之外，Multus 還支援
[SRIOV](https://github.com/hustcat/sriov-cni)、
[DPDK](https://github.com/Intel-Corp/sriov-cni)、
[OVS-DPDK & VPP](https://github.com/intel/vhost-user-net-plugin) 的工作負載，
以及 Kubernetes 中基於雲的本機應用程式和基於 NFV 的應用程式。

<!--
### OVN4NFV-K8s-Plugin (OVN based CNI controller & plugin)

[OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin) is OVN based CNI controller plugin to provide cloud native based Service function chaining(SFC), Multiple OVN overlay networking, dynamic subnet creation, dynamic creation of virtual networks, VLAN Provider network, Direct provider network and pluggable with other Multi-network plugins, ideal for edge based cloud native workloads in Multi-cluster networking
-->
### OVN4NFV-K8s-Plugin（基於 OVN 的 CNI 控制器和外掛）    {#ovn4nfv-k8s-plugin-ovn-based-cni-controller-plugin}

[OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin) 是基於 OVN 的
CNI 控制器外掛，提供基於雲原生的服務功能鏈 (SFC)、多個 OVN
覆蓋網路、動態子網建立、虛擬網路的動態建立、VLAN Provider 網路、Direct Provider
網路且可與其他多網路外掛組合，非常適合多叢集網路中基於邊緣的雲原生工作負載。

<!--
### NSX-T

[VMware NSX-T](https://docs.vmware.com/en/VMware-NSX-T/index.html) is a network virtualization and security platform. NSX-T can provide network virtualization for a multi-cloud and multi-hypervisor environment and is focused on emerging application frameworks and architectures that have heterogeneous endpoints and technology stacks. In addition to vSphere hypervisors, these environments include other hypervisors such as KVM, containers, and bare metal.

[NSX-T Container Plug-in (NCP)](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) provides integration between NSX-T and container orchestrators such as Kubernetes, as well as integration between NSX-T and container-based CaaS/PaaS platforms such as Pivotal Container Service (PKS) and OpenShift.
-->
### NSX-T

[VMware NSX-T](https://docs.vmware.com/en/VMware-NSX-T/index.html) 是一個網路虛擬化和安全平臺。
NSX-T 可以為多雲及多系統管理程式環境提供網路虛擬化，並專注於具有異構端點和技術堆疊的新興應用程式框架和體系結構。
除了 vSphere 管理程式之外，這些環境還包括其他虛擬機器管理程式，例如 KVM、容器和裸機。

[NSX-T Container Plug-in (NCP)](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf)
提供了 NSX-T 與容器協調器（例如 Kubernetes）之間的結合，
以及 NSX-T 與基於容器的 CaaS/PaaS 平臺（例如 Pivotal Container Service（PKS）和 OpenShift）之間的整合。

<!--
### OVN (Open Virtual Networking)

OVN is an opensource network virtualization solution developed by the
Open vSwitch community.  It lets one create logical switches, logical routers,
stateful ACLs, load-balancers etc to build different virtual networking
topologies.  The project has a specific Kubernetes plugin and documentation
at [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes).
-->
### OVN（開放式虛擬網路）    {#ovn-open-virtual-networking}

OVN 是一個由 Open vSwitch 社群開發的開源的網路虛擬化解決方案。
它允許建立邏輯交換器、邏輯路由、狀態 ACL、負載均衡等等來建立不同的虛擬網路拓撲。
該專案在 [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)
提供特定的 Kubernetes 外掛和文件。

<!--
### Weave Net from Weaveworks

[Weave Net](https://www.weave.works/oss/net/) is a
resilient and simple to use network for Kubernetes and its hosted applications.
Weave Net runs as a [CNI plug-in](https://www.weave.works/docs/net/latest/cni-plugin/)
or stand-alone.  In either version, it doesn't require any configuration or extra code
to run, and in both cases, the network provides one IP address per pod - as is standard for Kubernetes.
-->
### Weaveworks 的 Weave Net    {#weave-net-from-weaveworks}

[Weave Net](https://www.weave.works/oss/net/) 為 Kubernetes
及其託管應用提供的、彈性且易用的網路系統。
Weave Net 可以作為 [CNI 外掛](https://www.weave.works/docs/net/latest/cni-plugin/) 執行或者獨立執行。
在這兩種執行方式裡，都不需要任何配置或額外的程式碼即可執行，並且在兩種情況下，
網路都為每個 Pod 提供一個 IP 地址 -- 這是 Kubernetes 的標準配置。

## {{% heading "whatsnext" %}}

<!--
The early design of the networking model and its rationale, and some future
plans are described in more detail in the
[networking design document](https://git.k8s.io/community/contributors/design-proposals/network/networking.md).
-->
網路模型的早期設計、執行原理以及未來的一些計劃，
都在[聯網設計文件](https://git.k8s.io/community/contributors/design-proposals/network/networking.md)裡有更詳細的描述。
