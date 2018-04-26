---
title: 安装扩展（Addons）
---

<!--
title: Installing Addons
-->

<!--
## Overview
-->
## 概览

<!--
Add-ons extend the functionality of Kubernetes.
-->
Add-ons 扩展了 Kubernetes 的功能。

<!--
This page lists some of the available add-ons and links to their respective installation instructions.
-->
本文列举了一些可用的 add-ons 以及到它们各自安装说明的链接。

<!--
Add-ons in each section are sorted alphabetically - the ordering does not imply any preferential status.
-->
每个 add-ons 按字母顺序排序 - 顺序不代表任何优先地位。

<!--
## Networking and Network Policy
-->
## 网络和网络策略

<!--
* [Calico](http://docs.projectcalico.org/latest/getting-started/kubernetes/installation/hosted/) is a secure L3 networking and network policy provider.
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install) unites Flannel and Calico, providing networking and network policy.
* [Cilium](https://github.com/cilium/cilium) is a L3 network and network policy plugin that can enforce HTTP/API/L7 policies transparently. Both routing and overlay/encapsulation mode are supported.
* [Contiv](http://contiv.github.io) provides configurable networking (native L3 using BGP, overlay using vxlan, classic L2, and Cisco-SDN/ACI) for various use cases and a rich policy framework. Contiv project is fully [open sourced](http://github.com/contiv). The [installer](http://github.com/contiv/install) provides both kubeadm and non-kubeadm based installation options.
* [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml) is an overlay network provider that can be used with Kubernetes.
* [Romana](http://romana.io) is a Layer 3 networking solution for pod networks that also supports the [NetworkPolicy API](/docs/concepts/services-networking/network-policies/). Kubeadm add-on installation details available [here](https://github.com/romana/romana/tree/master/containerize).
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/) provides networking and network policy, will carry on working on both sides of a network partition, and does not require an external database.
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) enables Kubernetes to seamlessly connect to a choice of CNI plugins, such as Flannel, Calico, Canal, Romana, or Weave.
-->
* [Calico](http://docs.projectcalico.org/latest/getting-started/kubernetes/installation/hosted/)  是一个安全的 L3 网络和网络策略提供者。
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install)  结合 Flannel 和 Calico， 提供网络和网络策略。
* [Cilium](https://github.com/cilium/cilium) 是一个 L3 网络和网络策略插件， 能够透明的实施  HTTP/API/L7 策略。 同时支持路由（routing）和叠加/封装（ overlay/encapsulation）模式。
* [Contiv](http://contiv.github.io) 为多种用例提供可配置网络（使用 BGP 的原生 L3，使用 vxlan 的 overlay，经典 L2 和  Cisco-SDN/ACI）和丰富的策略框架。Contiv 项目完全[开源](http://github.com/contiv)。[安装工具](http://github.com/contiv/install)同时提供基于和不基于 kubeadm 的安装选项。
* [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml) 是一个可以用于 Kubernetes 的 overlay 网络提供者。
* [Romana](http://romana.io) 是一个 pod 网络的层 3 解决方案，并且支持  [NetworkPolicy API](/docs/concepts/services-networking/network-policies/)。Kubeadm add-on 安装细节可以在[这里](https://github.com/romana/romana/tree/master/containerize)找到。
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/)  提供了在网络分组两端参与工作的网络和网络策略，并且不需要额外的数据库。
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie)  使 Kubernetes 无缝连接到一种 CNI 插件，例如：Flannel、Calico、Canal、Romana 或者 Weave。

<!--
## Visualization &amp; Control
-->
## 可视化管理

<!--
* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) is a dashboard web interface for Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) is a tool for graphically visualizing your containers, pods, services etc. Use it in conjunction with a [Weave Cloud account](https://cloud.weave.works/) or host the UI yourself.
-->
* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) 是一个 Kubernetes 的 web 控制台界面。
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) 是一个图形化工具，用于查看你的 containers、 pods、services等。 请和一个  [Weave Cloud account](https://cloud.weave.works/) 一起使用，或者自己运行 UI。

<!--
## Legacy Add-ons
-->
## 遗留 Add-ons

<!--
There are several other add-ons documented in the deprecated [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) directory.
-->
还有一些其它 add-ons 归档在已废弃的  [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) 路径中。

<!--
Well-maintained ones should be linked to here. PRs welcome!
-->
维护完善的 add-ons 应该被链接到这里。欢迎提出 PRs！
