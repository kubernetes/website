---
title: 设备插件（Device Plugin）
id: device-plugin
date: 2019-02-02
full_link: /zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  一种软件扩展，可以使 Pod 访问由特定厂商初始化或者安装的设备。
aka:
tags:
- fundamental
- extension
---
<!-- 
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
-->

<!-- 
 Device plugins run on worker
{{< glossary_tooltip term_id="node" text="Nodes">}} and provide
{{< glossary_tooltip term_id="pod" text="Pods ">}} with access to resources,
such as local hardware, that require vendor-specific initialization or setup
steps.
-->
设备插件在工作{{<glossary_tooltip term_id="node" text="节点">}}上运行并为
{{<glossary_tooltip term_id="pod" text="Pod">}} 提供访问资源的能力，
例如：本地硬件这类资源需要特定于供应商的初始化或安装步骤。

<!--more-->

<!--
Device plugins advertise resources to the
{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}, so that workload
Pods can access hardware features that relate to the Node where that Pod is running.
You can deploy a device plugin as a {{< glossary_tooltip term_id="daemonset" >}},
or install the device plugin software directly on each target Node.
-->
设备插件向 {{<glossary_tooltip term_id="kubelet" text="kubelet" >}} 公布资源，以便工作负载
Pod 访问 Pod 运行所在节点上的硬件功能特性。
你可以将设备插件部署为 {{<glossary_tooltip term_id="daemonset" >}}，
或者直接在每个目标节点上安装设备插件软件。

<!-- 
See
	 
[Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
for more information.
-->
更多信息请查阅[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。
