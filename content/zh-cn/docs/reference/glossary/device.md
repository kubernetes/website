---
title: 设备
id: device
date: 2025-05-13
short_description: >
  直接或间接挂接到集群节点上的所有资源，例如 GPU 或电路板。

tags:
- extension
- fundamental
---
<!--
title: Device
id: device
date: 2025-05-13
short_description: >
  Any resource that's directly or indirectly attached your cluster's nodes, like
  GPUs or circuit boards.

tags:
- extension
- fundamental
-->

<!--
One or more
{{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}}
that are directly or indirectly attached to your
{{< glossary_tooltip text="nodes" term_id="node" >}}.
-->
一个或多个直接或间接挂接到{{< glossary_tooltip text="节点" term_id="node" >}}上的{{< glossary_tooltip text="基础设施资源" term_id="infrastructure-resource" >}}。

<!--more-->

<!--
Devices might be commercial products like GPUs, or custom hardware like
[ASIC boards](https://en.wikipedia.org/wiki/Application-specific_integrated_circuit).
Attached devices usually require device drivers that let Kubernetes
{{< glossary_tooltip text="Pods" term_id="pod" >}} access the devices.
-->
设备可以是如 GPU 等商业产品，也可以是如
[ASIC 板卡](https://zh.wikipedia.org/zh-cn/%E7%89%B9%E5%AE%9A%E6%87%89%E7%94%A8%E7%A9%8D%E9%AB%94%E9%9B%BB%E8%B7%AF)  
等定制硬件。
挂接的设备通常需要相应的设备驱动，才能让 Kubernetes 中的
{{< glossary_tooltip text="Pod" term_id="pod" >}} 访问这些设备。
