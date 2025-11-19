---
title: 設備
id: device
date: 2025-05-13
short_description: >
  直接或間接掛接到集羣節點上的所有資源，例如 GPU 或電路板。

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
一個或多個直接或間接掛接到{{< glossary_tooltip text="節點" term_id="node" >}}上的{{< glossary_tooltip text="基礎設施資源" term_id="infrastructure-resource" >}}。

<!--more-->

<!--
Devices might be commercial products like GPUs, or custom hardware like
[ASIC boards](https://en.wikipedia.org/wiki/Application-specific_integrated_circuit).
Attached devices usually require device drivers that let Kubernetes
{{< glossary_tooltip text="Pods" term_id="pod" >}} access the devices.
-->
設備可以是如 GPU 等商業產品，也可以是如
[ASIC 板卡](https://zh.wikipedia.org/zh-cn/%E7%89%B9%E5%AE%9A%E6%87%89%E7%94%A8%E7%A9%8D%E9%AB%94%E9%9B%BB%E8%B7%AF)  
等定製硬件。
掛接的設備通常需要相應的設備驅動，才能讓 Kubernetes 中的
{{< glossary_tooltip text="Pod" term_id="pod" >}} 訪問這些設備。
