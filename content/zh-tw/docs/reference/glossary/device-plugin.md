---
title: 裝置外掛（Device Plugin）
id: device-plugin
date: 2019-02-02
full_link: /zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  一種軟體擴充套件，可以使 Pod 訪問由特定廠商初始化或者安裝的裝置。
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
裝置外掛工作在節點主機上，給 {{< glossary_tooltip term_id="pod" text="Pods ">}} 提供訪問資源的許可權，比如特定廠商初始化或者安裝的本地硬體。
<!--more-->

<!--
Device plugins advertise resources to the
{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}, so that workload
Pods can access hardware features that relate to the Node where that Pod is running.
You can deploy a device plugin as a {{< glossary_tooltip term_id="daemonset" >}},
or install the device plugin software directly on each target Node.
-->
裝置外掛將資源告知 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} ，以便相關節點上執行的工作負載Pod可以訪問硬體功能。
<!-- 
See
	 
[Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
for more information.
-->
更多資訊請查閱[裝置外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) 