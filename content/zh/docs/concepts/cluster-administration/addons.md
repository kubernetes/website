---

title: 安装扩展（Addons）
content_template: templates/concept
---

{{% capture overview %}}


<!--
Add-ons extend the functionality of Kubernetes.

This page lists some of the available add-ons and links to their respective installation instructions.

Add-ons in each section are sorted alphabetically - the ordering does not imply any preferential status.
-->

Add-ons 扩展了 Kubernetes 的功能。

本文列举了一些可用的 add-ons 以及到它们各自安装说明的链接。

每个 add-ons 按字母顺序排序 - 顺序不代表任何优先地位。

{{% /capture %}}


{{% capture body %}}

<!--
## Networking and Network Policy


* [ACI](https://www.github.com/noironetworks/aci-containers) provides integrated container networking and network security with Cisco ACI.
* [Calico](https://docs.projectcalico.org/latest/getting-started/kubernetes/) is a secure L3 networking and network policy provider.
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install) unites Flannel and Calico, providing networking and network policy.
* [Cilium](https://github.com/cilium/cilium) is a L3 network and network policy plugin that can enforce HTTP/API/L7 policies transparently. Both routing and overlay/encapsulation mode are supported.
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) enables Kubernetes to seamlessly connect to a choice of CNI plugins, such as Calico, Canal, Flannel, Romana, or Weave.
* [Contiv](http://contiv.github.io) provides configurable networking (native L3 using BGP, overlay using vxlan, classic L2, and Cisco-SDN/ACI) for various use cases and a rich policy framework. Contiv project is fully [open sourced](http://github.com/contiv). The [installer](http://github.com/contiv/install) provides both kubeadm and non-kubeadm based installation options.
* [Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), based on [Tungsten Fabric](https://tungsten.io), is an open source, multi-cloud network virtualization and policy management platform. Contrail and Tungsten Fabric are integrated with orchestration systems such as Kubernetes, OpenShift, OpenStack and Mesos, and provide isolation modes for virtual machines, containers/pods and bare metal workloads.
* [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kubernetes.md) is an overlay network provider that can be used with Kubernetes.
* [Knitter](https://github.com/ZTE/Knitter/) is a network solution supporting multiple networking in Kubernetes.
* [Multus](https://github.com/Intel-Corp/multus-cni) is a Multi plugin for multiple network support in Kubernetes to support all CNI plugins (e.g. Calico, Cilium, Contiv, Flannel), in addition to SRIOV, DPDK, OVS-DPDK and VPP based workloads in Kubernetes.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) Container Plug-in (NCP) provides integration between VMware NSX-T and container orchestrators such as Kubernetes, as well as integration between NSX-T and container-based CaaS/PaaS platforms such as Pivotal Container Service (PKS) and OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) is an SDN platform that provides policy-based networking between Kubernetes Pods and non-Kubernetes environments with visibility and security monitoring.
* [Romana](http://romana.io) is a Layer 3 networking solution for pod networks that also supports the [NetworkPolicy API](/docs/concepts/services-networking/network-policies/). Kubeadm add-on installation details available [here](https://github.com/romana/romana/tree/master/containerize).
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/) provides networking and network policy, will carry on working on both sides of a network partition, and does not require an external database.
-->

## 网络和网络策略

* [ACI](https://www.github.com/noironetworks/aci-containers) 通过 Cisco ACI 提供集成的容器网络和安全网络。
* [Calico](http://docs.projectcalico.org/latest/getting-started/kubernetes/installation/hosted/)  是一个安全的 L3 网络和网络策略提供者。
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install)  结合 Flannel 和 Calico， 提供网络和网络策略。
* [Cilium](https://github.com/cilium/cilium) 是一个 L3 网络和网络策略插件， 能够透明的实施  HTTP/API/L7 策略。 同时支持路由（routing）和叠加/封装（ overlay/encapsulation）模式。
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie)  使 Kubernetes 无缝连接到一种 CNI 插件，例如：Flannel、Calico、Canal、Romana 或者 Weave。
* [Contiv](http://contiv.github.io) 为多种用例提供可配置网络（使用 BGP 的原生 L3，使用 vxlan 的 overlay，经典 L2 和  Cisco-SDN/ACI）和丰富的策略框架。Contiv 项目完全[开源](http://github.com/contiv)。[安装工具](http://github.com/contiv/install)同时提供基于和不基于 kubeadm 的安装选项。
* [Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), based on [Tungsten Fabric](https://tungsten.io), is an open source, multi-cloud network virtualization and policy management platform. Contrail and Tungsten Fabric are integrated with orchestration systems such as Kubernetes, OpenShift, OpenStack and Mesos, and provide isolation modes for virtual machines, containers/pods and bare metal workloads.
* [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml) 是一个可以用于 Kubernetes 的 overlay 网络提供者。
* [Knitter](https://github.com/ZTE/Knitter/) 是为 kubernetes 提供复合网络解决方案的网络组件.
* [Multus](https://github.com/Intel-Corp/multus-cni) 是一个多插件，可在 Kubernetes 中提供多种网络支持，以支持所有 CNI 插件（例如 Calico，Cilium，Contiv，Flannel）is a Multi plugin for multiple network support in Kubernetes to support all CNI plugins (e.g. Calico, Cilium, Contiv, Flannel)，而且包含了在Kubernetes中基于 SRIOV，DPDK，OVS-DPDK 和 VPP 的工作负载.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) 容器插件（ NCP ）提供了 VMware NSX-T 与容器协调器（例如 Kubernetes）之间的集成，以及 NSX-T 与基于容器的 CaaS / PaaS 平台（例如关键容器服务（ PKS ）和 OpenShift ）之间的集成。
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) 是一个SDN平台，可在Kubernetes Pods和非Kubernetes环境之间提供基于策略的联网，并具有可视化和安全监控。
* [Romana](http://romana.io) 是一个 pod 网络的层 3 解决方案，并且支持 [NetworkPolicy API](/docs/concepts/services-networking/network-policies/)。Kubeadm add-on 安装细节可以在[这里](https://github.com/romana/romana/tree/master/containerize)找到。
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/)  提供了在网络分组两端参与工作的网络和网络策略，并且不需要额外的数据库。

<!--
## Service Discovery

* [CoreDNS](https://coredns.io) is a flexible, extensible DNS server which can be [installed](https://github.com/coredns/deployment/tree/master/kubernetes) as the in-cluster DNS for pods.
-->

## 服务发现

* [CoreDNS](https://coredns.io) 是一种灵活的，可扩展的 DNS 服务器，可以 [安装](https://github.com/coredns/deployment/tree/master/kubernetes) 为集群内的 Pod 提供 DNS 服务。

<!--
## Visualization &amp; Control

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) is a dashboard web interface for Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) is a tool for graphically visualizing your containers, pods, services etc. Use it in conjunction with a [Weave Cloud account](https://cloud.weave.works/) or host the UI yourself.
-->

## 可视化管理


* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) 是一个 Kubernetes 的 web 控制台界面。
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) 是一个图形化工具，用于查看你的 containers、 pods、services 等。 请和一个 [Weave Cloud account](https://cloud.weave.works/) 一起使用，或者自己运行 UI。

<!--
## Infrastructure

* [KubeVirt](https://kubevirt.io/user-guide/docs/latest/administration/intro.html#cluster-side-add-on-deployment) is an add-on to run virtual machines on Kubernetes. Usually run on bare-metal clusters.
-->

## 基础设施

* [KubeVirt](https://kubevirt.io/user-guide/docs/latest/administration/intro.html#cluster-side-add-on-deployment) 是可以让 Kubernetes 运行虚拟机的 add-ons 。通常运行在裸机群集上。

<!--
## Legacy Add-ons

There are several other add-ons documented in the deprecated [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) directory.

Well-maintained ones should be linked to here. PRs welcome!
-->

## 遗留 Add-ons

还有一些其它 add-ons 归档在已废弃的  [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) 路径中。

维护完善的 add-ons 应该被链接到这里。欢迎提出 PRs！

{{% /capture %}}
