---
title: 計算、儲存和網路擴展
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
本節介紹不屬於 Kubernetes 本身組成部分的一些叢集擴展。
你可以使用這些擴展來增強叢集中的節點，或者提供將 Pod 關聯在一起的網路結構。

* [CSI](/zh-cn/docs/concepts/storage/volumes/#csi) 和
  [FlexVolume](/zh-cn/docs/concepts/storage/volumes/#flexvolume) 儲存插件

  <!--
  {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) plugins
  provide a way to extend Kubernetes with supports for new kinds of volumes. The volumes can
  be backed by durable external storage, or provide ephemeral storage, or they might offer a
  read-only interface to information using a filesystem paradigm.

  Kubernetes also includes support for [FlexVolume](/docs/concepts/storage/volumes/#flexvolume)
  plugins, which are deprecated since Kubernetes v1.23 (in favour of CSI).
  -->

  {{< glossary_tooltip text="容器儲存介面" term_id="csi" >}} (CSI) 插件提供了一種擴展
  Kubernetes 的方式使其支持新類別的卷。
  這些卷可以由持久的外部儲存提供支持，可以提供臨時儲存，還可以使用檔案系統範型爲資訊提供只讀介面。

  Kubernetes 還包括對 [FlexVolume](/zh-cn/docs/concepts/storage/volumes/#flexvolume)
  插件的擴展支持，該插件自 Kubernetes v1.23 起被棄用（被 CSI 替代）。

  <!--
  FlexVolume plugins allow users to mount volume types that aren't natively
  supported by Kubernetes. When you run a Pod that relies on FlexVolume
  storage, the kubelet calls a binary plugin to mount the volume. The archived
  [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
  design proposal has more detail on this approach.

  The [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
  includes general information on storage plugins.
  -->

  FlexVolume 插件允許使用者掛載 Kubernetes 本身不支持的卷類型。
  當你運行依賴於 FlexVolume 儲存的 Pod 時，kubelet 會調用一個二進制插件來掛載該卷。
  歸檔的 [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
  設計提案對此方法有更多詳細說明。

  [Kubernetes 儲存供應商的卷插件 FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
  包含了有關儲存插件的通用資訊。

<!--
* [Device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  Device plugins allow a node to discover new Node facilities (in addition to the
  built-in node resources such as `cpu` and `memory`), and provide these custom node-local
  facilities to Pods that request them.
-->
* [設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  設備插件允許一個節點發現新的 Node 設施（除了 `cpu` 和 `memory` 等內置的節點資源之外），
  並向請求資源的 Pod 提供了這些自定義的節點本地設施。

<!--
* [Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  Network plugins allow Kubernetes to work with different networking topologies and technologies.
  Your Kubernetes cluster needs a _network plugin_ in order to have a working Pod network
  and to support other aspects of the Kubernetes network model.

  Kubernetes {{< skew currentVersion >}} is compatible with {{< glossary_tooltip text="CNI" term_id="cni" >}}
  network plugins.
-->
* [網路插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  網路插件可以讓 Kubernetes 使用不同的網路拓撲和技術。
  你的 Kubernetes 叢集需要一個 **網路插件** 才能擁有一個正常工作的 Pod 網路，
  才能支持 Kubernetes 網路模型的其他方面。

  Kubernetes {{< skew currentVersion >}} 兼容
  {{< glossary_tooltip text="CNI" term_id="cni" >}} 網路插件。
