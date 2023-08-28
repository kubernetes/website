---
title: 计算、存储和网络扩展
weight: 30
no_list: true
---
<!--
title: Compute, Storage, and Networking Extensions
weight: 30
no_list: true
-->

<!--
This section covers extensions to your cluster that do not come as part as Kubernetes itself.
You can use these extensions to enhance the nodes in your cluster, or to provide the network
fabric that links Pods together.

* [CSI](/docs/concepts/storage/volumes/#csi) and [FlexVolume](/docs/concepts/storage/volumes/#flexvolume) storage plugins
-->
本节介绍不属于 Kubernetes 本身组成部分的一些集群扩展。
你可以使用这些扩展来增强集群中的节点，或者提供将 Pod 关联在一起的网络结构。

* [CSI](/zh-cn/docs/concepts/storage/volumes/#csi) 和
  [FlexVolume](/zh-cn/docs/concepts/storage/volumes/#flexvolume) 存储插件

  <!--
  {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) plugins
  provide a way to extend Kubernetes with supports for new kinds of volumes. The volumes can
  be backed by durable external storage, or provide ephemeral storage, or they might offer a
  read-only interface to information using a filesystem paradigm.

  Kubernetes also includes support for [FlexVolume](/docs/concepts/storage/volumes/#flexvolume)
  plugins, which are deprecated since Kubernetes v1.23 (in favour of CSI).
  -->

  {{< glossary_tooltip text="容器存储接口" term_id="csi" >}} (CSI) 插件提供了一种扩展
  Kubernetes 的方式使其支持新类别的卷。
  这些卷可以由持久的外部存储提供支持，可以提供临时存储，还可以使用文件系统范型为信息提供只读接口。

  Kubernetes 还包括对 [FlexVolume](/zh-cn/docs/concepts/storage/volumes/#flexvolume)
  插件的扩展支持，该插件自 Kubernetes v1.23 起被弃用（被 CSI 替代）。

  <!--
  FlexVolume plugins allow users to mount volume types that aren't natively
  supported by Kubernetes. When you run a Pod that relies on FlexVolume
  storage, the kubelet calls a binary plugin to mount the volume. The archived
  [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
  design proposal has more detail on this approach.

  The [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
  includes general information on storage plugins.
  -->

  FlexVolume 插件允许用户挂载 Kubernetes 本身不支持的卷类型。
  当你运行依赖于 FlexVolume 存储的 Pod 时，kubelet 会调用一个二进制插件来挂载该卷。
  归档的 [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
  设计提案对此方法有更多详细说明。

  [Kubernetes 存储供应商的卷插件 FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
  包含了有关存储插件的通用信息。

<!--
* [Device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  Device plugins allow a node to discover new Node facilities (in addition to the
  built-in node resources such as `cpu` and `memory`), and provide these custom node-local
  facilities to Pods that request them.
-->
* [设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  设备插件允许一个节点发现新的 Node 设施（除了 `cpu` 和 `memory` 等内置的节点资源之外），
  并向请求资源的 Pod 提供了这些自定义的节点本地设施。

<!--
* [Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  A network plugin allow Kubernetes to work with different networking topologies and technologies.
  Your Kubernetes cluster needs a _network plugin_ in order to have a working Pod network
  and to support other aspects of the Kubernetes network model.

  Kubernetes {{< skew currentVersion >}} is compatible with {{< glossary_tooltip text="CNI" term_id="cni" >}}
  network plugins.
-->
* [网络插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  网络插件可以让 Kubernetes 使用不同的网络拓扑和技术。
  你的 Kubernetes 集群需要一个 **网络插件** 才能拥有一个正常工作的 Pod 网络，
  才能支持 Kubernetes 网络模型的其他方面。

  Kubernetes {{< skew currentVersion >}} 兼容
  {{< glossary_tooltip text="CNI" term_id="cni" >}} 网络插件。
