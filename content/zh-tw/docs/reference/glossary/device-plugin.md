---
title: 設備插件（Device Plugin）
id: device-plugin
date: 2019-02-02
full_link: /zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  一種軟體擴展，可以使 Pod 訪問由特定廠商初始化或者安裝的設備。
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
{{< glossary_tooltip term_id="pod" text="Pods">}} with access to resources,
such as local hardware, that require vendor-specific initialization or setup
steps.
-->
設備插件在工作{{<glossary_tooltip term_id="node" text="節點">}}上運行併爲
{{<glossary_tooltip term_id="pod" text="Pod">}} 提供訪問資源的能力，
例如：本地硬件這類資源需要特定於供應商的初始化或安裝步驟。

<!--more-->

<!--
Device plugins advertise resources to the
{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}, so that workload
Pods can access hardware features that relate to the Node where that Pod is running.
You can deploy a device plugin as a {{< glossary_tooltip term_id="daemonset" >}},
or install the device plugin software directly on each target Node.
-->
設備插件向 {{<glossary_tooltip term_id="kubelet" text="kubelet" >}} 公佈資源，以便工作負載
Pod 訪問 Pod 運行所在節點上的硬件功能特性。
你可以將設備插件部署爲 {{<glossary_tooltip term_id="daemonset" >}}，
或者直接在每個目標節點上安裝設備插件軟體。

<!-- 
See
	 
[Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
for more information.
-->
更多資訊請查閱[設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。
