---
title: 设备插件（Device Plugin）
id: device-plugin
date: 2019-02-02
full_link: /zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  一种软件扩展，可以使 Pod 访问由特定厂商初始化或者安装的设备。
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
  Software extensions to let Pods access devices that need vendor-specific initialization or setup
aka:
tags:
- fundamental
- extension
---
-->
<!-- 
 Device plugins run on worker
{{< glossary_tooltip term_id="node" text="Nodes">}} and provide
{{< glossary_tooltip term_id="pod" text="Pods ">}} with access to resources,
such as local hardware, that require vendor-specific initialization or setup
steps.
-->
设备插件工作在节点主机上，给 {{< glossary_tooltip term_id="pod" text="Pods ">}} 提供访问资源的权限，比如特定厂商初始化或者安装的本地硬件。
<!--more-->

<!--
Device plugins advertise resources to the
{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}, so that workload
Pods can access hardware features that relate to the Node where that Pod is running.
You can deploy a device plugin as a {{< glossary_tooltip term_id="daemonset" >}},
or install the device plugin software directly on each target Node.
-->
设备插件将资源告知 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} ，以便相关节点上运行的工作负载Pod可以访问硬件功能。
<!-- 
See
	 
[Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
for more information.
-->
更多信息请查阅[设备插件](/zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) 