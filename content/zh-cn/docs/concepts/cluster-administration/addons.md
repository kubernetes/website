---
title: 安装扩展（Addon）
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
Add-on 扩展了 Kubernetes 的功能。

本文列举了一些可用的 add-on 以及到它们各自安装说明的链接。该列表并不试图详尽无遗。

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
## 联网和网络策略   {#networking-and-network-policy}

* [ACI](https://www.github.com/noironetworks/aci-containers) 通过 Cisco ACI 提供集成的容器网络和安全网络。
* [Antrea](https://antrea.io/) 在第 3/4 层执行操作，为 Kubernetes
  提供网络连接和安全服务。Antrea 利用 Open vSwitch 作为网络的数据面。
  Antrea 是一个[沙箱级的 CNCF 项目](https://www.cncf.io/projects/antrea/)。
* [Calico](https://www.tigera.io/project-calico/) 是一个联网和网络策略供应商。
  Calico 支持一套灵活的网络选项，因此你可以根据自己的情况选择最有效的选项，包括非覆盖和覆盖网络，带或不带 BGP。
  Calico 使用相同的引擎为主机、Pod 和（如果使用 Istio 和 Envoy）应用程序在服务网格层执行网络策略。
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel)
  结合 Flannel 和 Calico，提供联网和网络策略。
* [Cilium](https://github.com/cilium/cilium) 是一种网络、可观察性和安全解决方案，具有基于 eBPF 的数据平面。
  Cilium 提供了简单的 3 层扁平网络，
  能够以原生路由（routing）和覆盖/封装（overlay/encapsulation）模式跨越多个集群，
  并且可以使用与网络寻址分离的基于身份的安全模型在 L3 至 L7 上实施网络策略。
  Cilium 可以作为 kube-proxy 的替代品；它还提供额外的、可选的可观察性和安全功能。
  Cilium 是一个[毕业级别的 CNCF 项目](https://www.cncf.io/projects/cilium/)。

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
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie) 使 Kubernetes 无缝连接到
  Calico、Canal、Flannel 或 Weave 等其中一种 CNI 插件。
  CNI-Genie 是一个[沙箱级的 CNCF 项目](https://www.cncf.io/projects/cni-genie/)。
* [Contiv](https://contivpp.io/) 为各种用例和丰富的策略框架提供可配置的网络
  （带 BGP 的原生 L3、带 vxlan 的覆盖、标准 L2 和 Cisco-SDN/ACI）。
  Contiv 项目完全[开源](https://github.com/contiv)。
  其[安装程序](https://github.com/contiv/install) 提供了基于 kubeadm 和非 kubeadm 的安装选项。
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/) 基于
  [Tungsten Fabric](https://tungsten.io)，是一个开源的多云网络虚拟化和策略管理平台。
  Contrail 和 Tungsten Fabric 与业务流程系统（例如 Kubernetes、OpenShift、OpenStack 和 Mesos）集成在一起，
  为虚拟机、容器或 Pod 以及裸机工作负载提供了隔离模式。

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
  是一个可以用于 Kubernetes 的 overlay 网络提供者。
* [Gateway API](/zh-cn/docs/concepts/services-networking/gateway/) 是一个由
  [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 社区管理的开源项目，
  为服务网络建模提供一种富有表达力、可扩展和面向角色的 API。
* [Knitter](https://github.com/ZTE/Knitter/) 是在一个 Kubernetes Pod 中支持多个网络接口的插件。
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni) 是一个多插件，
  可在 Kubernetes 中提供多种网络支持，以支持所有 CNI 插件（例如 Calico、Cilium、Contiv、Flannel），
  而且包含了在 Kubernetes 中基于 SRIOV、DPDK、OVS-DPDK 和 VPP 的工作负载。

<!--
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) is a networking
  provider for Kubernetes based on [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/),
  a virtual networking implementation that came out of the Open vSwitch (OVS) project.
  OVN-Kubernetes provides an overlay based networking implementation for Kubernetes,
  including an OVS based implementation of load balancing and network policy.
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus) is an OVN based CNI
  controller plugin to provide cloud native based Service function chaining(SFC).
-->
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) 是一个 Kubernetes 网络驱动，
  基于 [OVN（Open Virtual Network）](https://github.com/ovn-org/ovn/)实现，是从 Open vSwitch (OVS)
  项目衍生出来的虚拟网络实现。OVN-Kubernetes 为 Kubernetes 提供基于覆盖网络的网络实现，
  包括一个基于 OVS 实现的负载均衡器和网络策略。
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus) 是一个基于 OVN 的 CNI 控制器插件，
  提供基于云原生的服务功能链 (SFC)。

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
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes)
  provides networking and network policy, will carry on working on both sides
  of a network partition, and does not require an external database.
-->
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) 容器插件（NCP）
  提供了 VMware NSX-T 与容器协调器（例如 Kubernetes）之间的集成，以及 NSX-T 与基于容器的
  CaaS / PaaS 平台（例如关键容器服务（PKS）和 OpenShift）之间的集成。
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst)
  是一个 SDN 平台，可在 Kubernetes Pods 和非 Kubernetes 环境之间提供基于策略的联网，并具有可视化和安全监控。
* [Romana](https://github.com/romana) 是一个 Pod 网络的第三层解决方案，并支持
  [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/) API。
* [Spiderpool](https://github.com/spidernet-io/spiderpool) 为 Kubernetes
  提供了下层网络和 RDMA 高速网络解决方案，兼容裸金属、虚拟机和公有云等运行环境。
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes)
  提供在网络分组两端参与工作的联网和网络策略，并且不需要额外的数据库。

<!--
## Service Discovery

* [CoreDNS](https://coredns.io) is a flexible, extensible DNS server which can
  be [installed](https://github.com/coredns/deployment/tree/master/kubernetes)
  as the in-cluster DNS for pods.
-->
## 服务发现   {#service-discovery}

* [CoreDNS](https://coredns.io) 是一种灵活的，可扩展的 DNS 服务器，可以
  [安装](https://github.com/coredns/deployment/tree/master/kubernetes)为集群内的 Pod 提供 DNS 服务。

<!--
## Visualization &amp; Control

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard)
  is a dashboard web interface for Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) is a
  tool for visualizing your containers, Pods, Services and more.
-->
## 可视化管理   {#visualization-and-control}

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) 是一个 Kubernetes 的 Web 控制台界面。
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s)
  是一个可视化工具，用于查看你的容器、Pod、服务等。

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
## 基础设施   {#infrastructure}

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) 是可以让 Kubernetes
  运行虚拟机的 add-on。通常运行在裸机集群上。
* [节点问题检测器](https://github.com/kubernetes/node-problem-detector) 在 Linux 节点上运行，
  并将系统问题报告为[事件](/zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1/)
  或[节点状况](/zh-cn/docs/concepts/architecture/nodes/#condition)。

<!--
## Instrumentation

* [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics)
-->
## 插桩  {#instrumentation}

* [kube-state-metrics](/zh-cn/docs/concepts/cluster-administration/kube-state-metrics)

<!--
## Legacy Add-ons

There are several other add-ons documented in the deprecated
[cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) directory.

Well-maintained ones should be linked to here. PRs welcome!
-->
## 遗留 Add-on   {#legacy-addons}

还有一些其它 add-on 归档在已废弃的 [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) 路径中。

维护完善的 add-on 应该被链接到这里。欢迎提出 PR！
