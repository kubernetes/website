---
title: 安裝擴展（Addon）
content_type: concept
weight: 120
---
<!--
title: Installing Addons
content_type: concept
weight: 120
-->

<!-- overview -->

{{% thirdparty-content %}}

<!--
Add-ons extend the functionality of Kubernetes.

This page lists some of the available add-ons and links to their respective
installation instructions. The list does not try to be exhaustive.
-->
Add-on 擴展了 Kubernetes 的功能。

本文列舉了一些可用的 add-on 以及到它們各自安裝說明的鏈接。該列表並不試圖詳盡無遺。

<!-- body -->

<!--
## Networking and Network Policy

* [ACI](https://www.github.com/noironetworks/aci-containers) provides integrated
  container networking and network security with Cisco ACI.
* [Antrea](https://antrea.io/) operates at Layer 3/4 to provide networking and
  security services for Kubernetes, leveraging Open vSwitch as the networking
  data plane. Antrea is a [CNCF project at the Sandbox level](https://www.cncf.io/projects/antrea/).
* [Calico](https://www.tigera.io/project-calico/) is a networking and network
  policy provider. Calico supports a flexible set of networking options so you
  can choose the most efficient option for your situation, including non-overlay
  and overlay networks, with or without BGP. Calico uses the same engine to
  enforce network policy for hosts, pods, and (if using Istio & Envoy)
  applications at the service mesh layer.
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel)
  unites Flannel and Calico, providing networking and network policy.
* [Cilium](https://github.com/cilium/cilium) is a networking, observability,
  and security solution with an eBPF-based data plane. Cilium provides a
  simple flat Layer 3 network with the ability to span multiple clusters
  in either a native routing or overlay/encapsulation mode, and can enforce
  network policies on L3-L7 using an identity-based security model that is
  decoupled from network addressing. Cilium can act as a replacement for
  kube-proxy; it also offers additional, opt-in observability and security features.
  Cilium is a [CNCF project at the Graduated level](https://www.cncf.io/projects/cilium/).
-->
## 聯網和網路策略   {#networking-and-network-policy}

* [ACI](https://www.github.com/noironetworks/aci-containers) 通過 Cisco ACI 提供集成的容器網路和安全網路。
* [Antrea](https://antrea.io/) 在第 3/4 層執行操作，爲 Kubernetes
  提供網路連接和安全服務。Antrea 利用 Open vSwitch 作爲網路的資料面。
  Antrea 是一個[沙箱級的 CNCF 項目](https://www.cncf.io/projects/antrea/)。
* [Calico](https://www.tigera.io/project-calico/) 是一個聯網和網路策略供應商。
  Calico 支持一套靈活的網路選項，因此你可以根據自己的情況選擇最有效的選項，包括非覆蓋和覆蓋網路，帶或不帶 BGP。
  Calico 使用相同的引擎爲主機、Pod 和（如果使用 Istio 和 Envoy）應用程式在服務網格層執行網路策略。
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel)
  結合 Flannel 和 Calico，提供聯網和網路策略。
* [Cilium](https://github.com/cilium/cilium) 是一種網路、可觀察性和安全解決方案，具有基於 eBPF 的資料平面。
  Cilium 提供了簡單的 3 層扁平網路，
  能夠以原生路由（routing）和覆蓋/封裝（overlay/encapsulation）模式跨越多個叢集，
  並且可以使用與網路尋址分離的基於身份的安全模型在 L3 至 L7 上實施網路策略。
  Cilium 可以作爲 kube-proxy 的替代品；它還提供額外的、可選的可觀察性和安全功能。
  Cilium 是一個[畢業級別的 CNCF 項目](https://www.cncf.io/projects/cilium/)。

<!--
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie) enables Kubernetes to seamlessly
  connect to a choice of CNI plugins, such as Calico, Canal, Flannel, or Weave.
  CNI-Genie is a [CNCF project at the Sandbox level](https://www.cncf.io/projects/cni-genie/).
* [Contiv](https://contivpp.io/) provides configurable networking (native L3 using BGP,
  overlay using vxlan, classic L2, and Cisco-SDN/ACI) for various use cases and a rich
  policy framework. Contiv project is fully [open sourced](https://github.com/contiv).
  The [installer](https://github.com/contiv/install) provides both kubeadm and
  non-kubeadm based installation options.
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/),
  based on [Tungsten Fabric](https://tungsten.io), is an open source, multi-cloud
  network virtualization and policy management platform. Contrail and Tungsten
  Fabric are integrated with orchestration systems such as Kubernetes, OpenShift,
  OpenStack and Mesos, and provide isolation modes for virtual machines, containers/pods
  and bare metal workloads.
-->
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie) 使 Kubernetes 無縫連接到
  Calico、Canal、Flannel 或 Weave 等其中一種 CNI 插件。
  CNI-Genie 是一個[沙箱級的 CNCF 項目](https://www.cncf.io/projects/cni-genie/)。
* [Contiv](https://contivpp.io/) 爲各種用例和豐富的策略框架提供可設定的網路
  （帶 BGP 的原生 L3、帶 vxlan 的覆蓋、標準 L2 和 Cisco-SDN/ACI）。
  Contiv 項目完全[開源](https://github.com/contiv)。
  其[安裝程式](https://github.com/contiv/install) 提供了基於 kubeadm 和非 kubeadm 的安裝選項。
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/) 基於
  [Tungsten Fabric](https://tungsten.io)，是一個開源的多雲網路虛擬化和策略管理平臺。
  Contrail 和 Tungsten Fabric 與業務流程系統（例如 Kubernetes、OpenShift、OpenStack 和 Mesos）集成在一起，
  爲虛擬機、容器或 Pod 以及裸機工作負載提供了隔離模式。

<!--
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually) is
  an overlay network provider that can be used with Kubernetes.
* [Gateway API](/docs/concepts/services-networking/gateway/) is an open source project managed by
  the [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) community and
  provides an expressive, extensible, and role-oriented API for modeling service networking.
* [Knitter](https://github.com/ZTE/Knitter/) is a plugin to support multiple network
  interfaces in a Kubernetes pod.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni) is a Multi plugin for
  multiple network support in Kubernetes to support all CNI plugins
  (e.g. Calico, Cilium, Contiv, Flannel), in addition to SRIOV, DPDK, OVS-DPDK and
  VPP based workloads in Kubernetes.
-->
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually)
  是一個可以用於 Kubernetes 的 overlay 網路提供者。
* [Gateway API](/zh-cn/docs/concepts/services-networking/gateway/) 是一個由
  [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 社區管理的開源項目，
  爲服務網路建模提供一種富有表達力、可擴展和麪向角色的 API。
* [Knitter](https://github.com/ZTE/Knitter/) 是在一個 Kubernetes Pod 中支持多個網路介面的插件。
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni) 是一個多插件，
  可在 Kubernetes 中提供多種網路支持，以支持所有 CNI 插件（例如 Calico、Cilium、Contiv、Flannel），
  而且包含了在 Kubernetes 中基於 SRIOV、DPDK、OVS-DPDK 和 VPP 的工作負載。

<!--
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) is a networking
  provider for Kubernetes based on [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/),
  a virtual networking implementation that came out of the Open vSwitch (OVS) project.
  OVN-Kubernetes provides an overlay based networking implementation for Kubernetes,
  including an OVS based implementation of load balancing and network policy.
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus) is an OVN based CNI
  controller plugin to provide cloud native based Service function chaining(SFC).
-->
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) 是一個 Kubernetes 網路驅動，
  基於 [OVN（Open Virtual Network）](https://github.com/ovn-org/ovn/)實現，是從 Open vSwitch (OVS)
  項目衍生出來的虛擬網路實現。OVN-Kubernetes 爲 Kubernetes 提供基於覆蓋網路的網路實現，
  包括一個基於 OVS 實現的負載均衡器和網路策略。
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus) 是一個基於 OVN 的 CNI 控制器插件，
  提供基於雲原生的服務功能鏈 (SFC)。

<!--
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) Container Plug-in (NCP)
  provides integration between VMware NSX-T and container orchestrators such as
  Kubernetes, as well as integration between NSX-T and container-based CaaS/PaaS
  platforms such as Pivotal Container Service (PKS) and OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)
  is an SDN platform that provides policy-based networking between Kubernetes
  Pods and non-Kubernetes environments with visibility and security monitoring.
* [Romana](https://github.com/romana) is a Layer 3 networking solution for pod
  networks that also supports the [NetworkPolicy](/docs/concepts/services-networking/network-policies/) API.
* [Spiderpool](https://github.com/spidernet-io/spiderpool) is an underlay and RDMA
  networking solution for Kubernetes. Spiderpool is supported on bare metal, virtual machines,
  and public cloud environments.
* [Terway](https://github.com/AliyunContainerService/terway/) is a suite of CNI plugins
  based on AlibabaCloud's VPC and ECS network products. It provides native VPC networking
  and network policies in AlibabaCloud environments.
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes)
  provides networking and network policy, will carry on working on both sides
  of a network partition, and does not require an external database.
-->
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) 容器插件（NCP）
  提供了 VMware NSX-T 與容器協調器（例如 Kubernetes）之間的集成，以及 NSX-T 與基於容器的
  CaaS / PaaS 平臺（例如關鍵容器服務（PKS）和 OpenShift）之間的集成。
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)
  是一個 SDN 平臺，可在 Kubernetes Pods 和非 Kubernetes 環境之間提供基於策略的聯網，並具有可視化和安全監控。
* [Romana](https://github.com/romana) 是一個 Pod 網路的第三層解決方案，並支持
  [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/) API。
* [Spiderpool](https://github.com/spidernet-io/spiderpool) 爲 Kubernetes
  提供了下層網路和 RDMA 高速網路解決方案，兼容裸金屬、虛擬機和公有云等運行環境。
* [Terway](https://github.com/AliyunContainerService/terway/)
  是一套基於阿里雲 VPC 和 ECS 網路產品的 CNI 插件，能夠在阿里雲環境中提供原生的 VPC 網路和網路策略支持。
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes)
  提供在網路分組兩端參與工作的聯網和網路策略，並且不需要額外的資料庫。

<!--
## Service Discovery

* [CoreDNS](https://coredns.io) is a flexible, extensible DNS server which can
  be [installed](https://github.com/coredns/helm)
  as the in-cluster DNS for pods.
-->
## 服務發現   {#service-discovery}

* [CoreDNS](https://coredns.io) 是一種靈活的，可擴展的 DNS 伺服器，可以
  [安裝](https://github.com/coredns/helm)爲叢集內的 Pod 提供 DNS 服務。

<!--
## Visualization &amp; Control

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard)
  is a dashboard web interface for Kubernetes.
-->
## 可視化管理   {#visualization-and-control}

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) 是一個 Kubernetes 的 Web 控制檯界面。

<!--
## Infrastructure

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) is an add-on
  to run virtual machines on Kubernetes. Usually run on bare-metal clusters.
* The
  [node problem detector](https://github.com/kubernetes/node-problem-detector)
  runs on Linux nodes and reports system issues as either
  [Events](/docs/reference/kubernetes-api/cluster-resources/event-v1/) or
  [Node conditions](/docs/concepts/architecture/nodes/#condition).
-->
## 基礎設施   {#infrastructure}

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) 是可以讓 Kubernetes
  運行虛擬機的 add-on。通常運行在裸機叢集上。
* [節點問題檢測器](https://github.com/kubernetes/node-problem-detector) 在 Linux 節點上運行，
  並將系統問題報告爲[事件](/zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1/)
  或[節點狀況](/zh-cn/docs/concepts/architecture/nodes/#condition)。

<!--
## Instrumentation

* [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics)
-->
## 插樁  {#instrumentation}

* [kube-state-metrics](/zh-cn/docs/concepts/cluster-administration/kube-state-metrics)

<!--
## Legacy Add-ons

There are several other add-ons documented in the deprecated
[cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) directory.

Well-maintained ones should be linked to here. PRs welcome!
-->
## 遺留 Add-on   {#legacy-addons}

還有一些其它 add-on 歸檔在已廢棄的 [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) 路徑中。

維護完善的 add-on 應該被鏈接到這裏。歡迎提出 PR！
