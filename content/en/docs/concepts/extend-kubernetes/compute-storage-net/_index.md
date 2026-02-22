---
title: Compute, Storage, and Networking Extensions
weight: 30
no_list: true
---

This section covers extensions to your cluster that do not come as part as Kubernetes itself.
You can use these extensions to enhance the nodes in your cluster, or to provide the network
fabric that links Pods together.

* [CSI](/docs/concepts/storage/volumes/#csi) and [FlexVolume](/docs/concepts/storage/volumes/#flexvolume) storage plugins

  {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) plugins
  provide a way to extend Kubernetes with supports for new kinds of volumes. The volumes can
  be backed by durable external storage, or provide ephemeral storage, or they might offer a
  read-only interface to information using a filesystem paradigm.

  Kubernetes also includes support for [FlexVolume](/docs/concepts/storage/volumes/#flexvolume)
  plugins, which are deprecated since Kubernetes v1.23 (in favour of CSI).

  FlexVolume plugins allow users to mount volume types that aren't natively
  supported by Kubernetes. When you run a Pod that relies on FlexVolume
  storage, the kubelet calls a binary plugin to mount the volume. The archived
  [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
  design proposal has more detail on this approach.

  The [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
  includes general information on storage plugins.

* [Device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)

  Device plugins allow a node to discover new Node facilities (in addition to the
  built-in node resources such as `cpu` and `memory`), and provide these custom node-local
  facilities to Pods that request them.

* [Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

  Network plugins allow Kubernetes to work with different networking topologies and technologies.
  Your Kubernetes cluster needs a _network plugin_ in order to have a working Pod network
  and to support other aspects of the Kubernetes network model.

  Kubernetes {{< skew currentVersion >}} is compatible with {{< glossary_tooltip text="CNI" term_id="cni" >}}
  network plugins.

