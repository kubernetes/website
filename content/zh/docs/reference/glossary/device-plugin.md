---
title: Device Plugin
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  Device Plugins are containers running in Kubernetes that provide access to a vendor specific resource.
aka:
tags:
- fundamental
- extension
---

<!--
 Device Plugins are containers running in Kubernetes that provide access to a vendor specific resource.
-->


设备插件是在 Kubernetes 中运行的容器，可以访问供应商特定的资源。

<!--more-->

<!--
[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) are containers running in Kubernetes that provide access to a vendor specific resource. Device Plugins advertise these resources to kubelet and can be deployed manually or as a DeamonSet, rather than writing custom Kubernetes code.
-->

[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) 是在 Kubernetes 中运行的容器，提供对供应商特定资源的访问。 设备插件将这些资源通告给 kubelet，可以手动部署或作为 DeamonSet 部署，而不是编写自定义 Kubernetes 代码。
