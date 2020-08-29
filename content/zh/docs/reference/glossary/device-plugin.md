---
title: 驱动插件
id: device-plugin
date: 2019-02-02
full_link: /zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  在 Kubernetes 中运行的容器提供对供应商特定资源的访问权限。
aka:
tags:
- fundamental
- extension
---

<!-- ---
title: Device Plugin
id: device-plugin
date: 2019-02-02
full_link: /zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  Containers running in Kubernetes that provide access to a vendor specific resource.
aka:
tags:
- fundamental
- extension
--- -->
 <!-- Device Plugins are containers running in Kubernetes that provide access to a vendor specific resource. -->
设备插件是在 Kubernetes 中运行的容器，可用于访问供应商特定资源。

<!--more-->

<!-- [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) are containers running in Kubernetes that provide access to a vendor-specific resource. Device Plugins advertise these resources to {{< glossary_tooltip term_id="kubelet" >}}. They can be deployed manually or as a {{< glossary_tooltip term_id="daemonset" >}}, rather than writing custom Kubernetes code. -->
[驱动插件](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) 是运行在 Kubernetes 中的容器，它提供对供应商特定资源的访问。驱动插件将这些资源发布到 {{< glossary_tooltip term_id="kubelet" >}}。并且可以手动部署或做为 {{< glossary_tooltip term_id="daemonset" >}}，而不用编写定制的 Kubernetes 代码。
