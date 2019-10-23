---

title: 安装扩展（Addons）
---


## 概览


Add-ons 扩展了 Kubernetes 的功能。


本文列举了一些可用的 add-ons 以及到它们各自安装说明的链接。


每个 add-ons 按字母顺序排序 - 顺序不代表任何优先地位。


## 网络和网络策略


* [Calico](http://docs.projectcalico.org/latest/getting-started/kubernetes/installation/hosted/)  是一个安全的 L3 网络和网络策略提供者。
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install)  结合 Flannel 和 Calico， 提供网络和网络策略。
* [Cilium](https://github.com/cilium/cilium) 是一个 L3 网络和网络策略插件， 能够透明的实施  HTTP/API/L7 策略。 同时支持路由（routing）和叠加/封装（ overlay/encapsulation）模式。
* [Contiv](http://contiv.github.io) 为多种用例提供可配置网络（使用 BGP 的原生 L3，使用 vxlan 的 overlay，经典 L2 和  Cisco-SDN/ACI）和丰富的策略框架。Contiv 项目完全[开源](http://github.com/contiv)。[安装工具](http://github.com/contiv/install)同时提供基于和不基于 kubeadm 的安装选项。
* [Flannel](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml) 是一个可以用于 Kubernetes 的 overlay 网络提供者。
* [Romana](http://romana.io) 是一个 pod 网络的层 3 解决方案，并且支持  [NetworkPolicy API](/docs/concepts/services-networking/network-policies/)。Kubeadm add-on 安装细节可以在[这里](https://github.com/romana/romana/tree/master/containerize)找到。
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/)  提供了在网络分组两端参与工作的网络和网络策略，并且不需要额外的数据库。
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie)  使 Kubernetes 无缝连接到一种 CNI 插件，例如：Flannel、Calico、Canal、Romana 或者 Weave。


## 可视化管理


* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) 是一个 Kubernetes 的 web 控制台界面。
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) 是一个图形化工具，用于查看你的 containers、 pods、services等。 请和一个  [Weave Cloud account](https://cloud.weave.works/) 一起使用，或者自己运行 UI。


## 遗留 Add-ons


还有一些其它 add-ons 归档在已废弃的  [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) 路径中。


维护完善的 add-ons 应该被链接到这里。欢迎提出 PRs！
