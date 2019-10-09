---
title: 驱动插件
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  驱动插件是运行在 Kubernetes 中的容器，它提供对供应商特定资源的访问。
aka:
tags:
- fundamental
- extension
---

<!--
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
-->

<!--
[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) are containers running in Kubernetes that provide access to a vendor specific resource. Device Plugins advertise these resources to kubelet and can be deployed manually or as a DeamonSet, rather than writing custom Kubernetes code.
-->

[驱动插件](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)是运行在 Kubernetes 中的容器，它提供对供应商特定资源的访问。驱动插件将这些资源发布到 kubelet，并且可以手动部署或做为 DeamonSet 部署，而不用编写定制的 Kubernetes 代码。
