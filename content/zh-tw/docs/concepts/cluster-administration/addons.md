---
title: 安裝擴充套件（Addons）
content_type: concept
---

<!-- overview -->

{{% thirdparty-content %}}

<!--
Add-ons extend the functionality of Kubernetes.

This page lists some of the available add-ons and links to their respective installation instructions.

Add-ons in each section are sorted alphabetically - the ordering does not imply any preferential status.
-->
Add-ons 擴充套件了 Kubernetes 的功能。

本文列舉了一些可用的 add-ons 以及到它們各自安裝說明的連結。

每個 Add-ons 按字母順序排序 - 順序不代表任何優先地位。

<!-- body -->

<!--
## Networking and Network Policy

* [ACI](https://www.github.com/noironetworks/aci-containers) provides integrated container networking and network security with Cisco ACI.
* [Antrea](https://antrea.io/) operates at Layer 3/4 to provide networking and security services for Kubernetes, leveraging Open vSwitch as the networking data plane.
* [Calico](https://docs.projectcalico.org/latest/getting-started/kubernetes/) is a secure L3 networking and network policy provider.
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install) unites Flannel and Calico, providing networking and network policy.
* [Cilium](https://github.com/cilium/cilium) is a L3 network and network policy plugin that can enforce HTTP/API/L7 policies transparently. Both routing and overlay/encapsulation mode are supported.
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) enables Kubernetes to seamlessly connect to a choice of CNI plugins, such as Calico, Canal, Flannel, or Weave.
* [Contiv](https://contivpp.io/) provides configurable networking (native L3 using BGP, overlay using vxlan, classic L2, and Cisco-SDN/ACI) for various use cases and a rich policy framework. Contiv project is fully [open sourced](https://github.com/contiv). The [installer](https://github.com/contiv/install) provides both kubeadm and non-kubeadm based installation options.
* [Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), based on [Tungsten Fabric](https://tungsten.io), is an open source, multi-cloud network virtualization and policy management platform. Contrail and Tungsten Fabric are integrated with orchestration systems such as Kubernetes, OpenShift, OpenStack and Mesos, and provide isolation modes for virtual machines, containers/pods and bare metal workloads.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually) is an overlay network provider that can be used with Kubernetes.
* [Knitter](https://github.com/ZTE/Knitter/) is a network solution supporting multiple networking in Kubernetes.
* Multus is a Multi plugin for multiple network support in Kubernetes to support all CNI plugins (e.g. Calico, Cilium, Contiv, Flannel), in addition to SRIOV, DPDK, OVS-DPDK and VPP based workloads in Kubernetes.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) is a networking provider for Kubernetes based on [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/), a virtual networking implementation that came out of the Open vSwitch (OVS) project. OVN-Kubernetes provides an overlay based networking implementation for Kubernetes, including an OVS based implementation of load balancing and network policy.
* [OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin) is OVN based CNI controller plugin to provide cloud native based Service function chaining(SFC), Multiple OVN overlay networking, dynamic subnet creation, dynamic creation of virtual networks, VLAN Provider network, Direct provider network and pluggable with other Multi-network plugins, ideal for edge based cloud native workloads in Multi-cluster networking
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) Container Plug-in (NCP) provides integration between VMware NSX-T and container orchestrators such as Kubernetes, as well as integration between NSX-T and container-based CaaS/PaaS platforms such as Pivotal Container Service (PKS) and OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) is an SDN platform that provides policy-based networking between Kubernetes Pods and non-Kubernetes environments with visibility and security monitoring.
* [Romana](https://github.com/romana) is a Layer 3 networking solution for pod networks that also supports the [NetworkPolicy](/docs/concepts/services-networking/network-policies/) API.
* [Weave Net](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/) provides networking and network policy, will carry on working on both sides of a network partition, and does not require an external database.
-->
## 網路和網路策略

* [ACI](https://www.github.com/noironetworks/aci-containers) 透過 Cisco ACI 提供整合的容器網路和安全網路。
* [Antrea](https://antrea.io/) 在第 3/4 層執行操作，為 Kubernetes
  提供網路連線和安全服務。Antrea 利用 Open vSwitch 作為網路的資料面。
* [Calico](https://docs.projectcalico.org/v3.11/getting-started/kubernetes/installation/calico)
  是一個安全的 L3 網路和網路策略驅動。
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install) 結合 Flannel 和 Calico，提供網路和網路策略。
* [Cilium](https://github.com/cilium/cilium) 是一個 L3 網路和網路策略外掛，能夠透明的實施 HTTP/API/L7 策略。
  同時支援路由（routing）和覆蓋/封裝（overlay/encapsulation）模式。
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) 使 Kubernetes 無縫連線到一種 CNI 外掛，
  例如：Flannel、Calico、Canal 或者 Weave。
* [Contiv](https://contivpp.io/) 為各種用例和豐富的策略框架提供可配置的網路
  （使用 BGP 的本機 L3、使用 vxlan 的覆蓋、標準 L2 和 Cisco-SDN/ACI）。
  Contiv 專案完全[開源](https://github.com/contiv)。
  [安裝程式](https://github.com/contiv/install) 提供了基於 kubeadm 和非 kubeadm 的安裝選項。
* 基於 [Tungsten Fabric](https://tungsten.io) 的
  [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/)
  是一個開源的多雲網路虛擬化和策略管理平臺，Contrail 和 Tungsten Fabric 與業務流程系統
  （例如 Kubernetes、OpenShift、OpenStack和Mesos）整合在一起，
  為虛擬機器、容器或 Pod 以及裸機工作負載提供了隔離模式。
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually)
  是一個可以用於 Kubernetes 的 overlay 網路提供者。
* [Knitter](https://github.com/ZTE/Knitter/) 是為 kubernetes 提供複合網路解決方案的網路元件。
* Multus 是一個多外掛，可在 Kubernetes 中提供多種網路支援，
  以支援所有 CNI 外掛（例如 Calico，Cilium，Contiv，Flannel），
  而且包含了在 Kubernetes 中基於 SRIOV、DPDK、OVS-DPDK 和 VPP 的工作負載。
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) 是一個 Kubernetes 網路驅動，
  基於 [OVN（Open Virtual Network）](https://github.com/ovn-org/ovn/)實現，是從 Open vSwitch (OVS)
  專案衍生出來的虛擬網路實現。
  OVN-Kubernetes 為 Kubernetes 提供基於覆蓋網路的網路實現，包括一個基於 OVS 實現的負載均衡器
  和網路策略。
* [OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin) 是一個基於 OVN 的 CNI
  控制器外掛，提供基於雲原生的服務功能鏈條（Service Function Chaining，SFC）、多種 OVN 覆蓋
  網路、動態子網建立、動態虛擬網路建立、VLAN 驅動網路、直接驅動網路，並且可以
  駁接其他的多網路外掛，適用於基於邊緣的、多叢集聯網的雲原生工作負載。
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) 容器外掛（NCP）
  提供了 VMware NSX-T 與容器協調器（例如 Kubernetes）之間的整合，以及 NSX-T 與基於容器的
  CaaS / PaaS 平臺（例如關鍵容器服務（PKS）和 OpenShift）之間的整合。
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)
  是一個 SDN 平臺，可在 Kubernetes Pods 和非 Kubernetes 環境之間提供基於策略的聯網，並具有視覺化和安全監控。
* [Romana](https://github.com/romana) 是一個 Pod 網路的第三層解決方案，並支援
  [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/) API。
* [Weave Net](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/)
  提供在網路分組兩端參與工作的網路和網路策略，並且不需要額外的資料庫。

<!--
## Service Discovery

* [CoreDNS](https://coredns.io) is a flexible, extensible DNS server which can be [installed](https://github.com/coredns/deployment/tree/master/kubernetes) as the in-cluster DNS for pods.
-->
## 服務發現

* [CoreDNS](https://coredns.io) 是一種靈活的，可擴充套件的 DNS 伺服器，可以
  [安裝](https://github.com/coredns/deployment/tree/master/kubernetes)為叢集內的 Pod 提供 DNS 服務。

<!--
## Visualization &amp; Control

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) is a dashboard web interface for Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) is a tool for graphically visualizing your containers, pods, services etc. Use it in conjunction with a [Weave Cloud account](https://cloud.weave.works/) or host the UI yourself.
-->
## 視覺化管理

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) 是一個 Kubernetes 的 Web 控制檯介面。
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) 是一個圖形化工具，
  用於檢視你的容器、Pod、服務等。請和一個 [Weave Cloud 賬號](https://cloud.weave.works/) 一起使用，
  或者自己執行 UI。

<!--
## Infrastructure

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) is an add-on to run virtual machines on Kubernetes. Usually run on bare-metal clusters.
* The
  [node problem detector](https://github.com/kubernetes/node-problem-detector)
  runs on Linux nodes and reports system issues as either
  [Events](/docs/reference/kubernetes-api/cluster-resources/event-v1/) or
  [Node conditions](/docs/concepts/architecture/nodes/#condition).
-->
## 基礎設施

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) 是可以讓 Kubernetes
  執行虛擬機器的 add-ons。通常執行在裸機叢集上。
* [節點問題檢測器](https://github.com/kubernetes/node-problem-detector) 在 Linux 節點上執行，
  並將系統問題報告為[事件](/docs/reference/kubernetes-api/cluster-resources/event-v1/)
  或[節點狀況](/zh-cn/docs/concepts/architecture/nodes/#condition)。

<!--
## Legacy Add-ons

There are several other add-ons documented in the deprecated [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) directory.

Well-maintained ones should be linked to here. PRs welcome!
-->
## 遺留 Add-ons

還有一些其它 add-ons 歸檔在已廢棄的 [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) 路徑中。

維護完善的 add-ons 應該被連結到這裡。歡迎提出 PRs！
