---
title: 臨時容器（Ephemeral Container）
id: ephemeral-container
date: 2019-08-26
full_link: /zh-cn/docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  你可以在 Pod 中臨時運行的一種容器類型
aka:
tags:
- fundamental
---
<!--
title: Ephemeral Container
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  A type of container type that you can temporarily run inside a Pod

aka:
tags:
- fundamental
-->

<!--
A {{< glossary_tooltip term_id="container" >}} type that you can temporarily run inside a {{< glossary_tooltip term_id="pod" >}}.
-->
你可以在 {{< glossary_tooltip term_id="pod" >}} 中臨時運行的一種 {{< glossary_tooltip term_id="container" >}} 類型。

<!--more-->

<!--
If you want to investigate a Pod that's running with problems, you can add an ephemeral container to that Pod and carry out diagnostics. Ephemeral containers have no resource or scheduling guarantees, and you should not use them to run any part of the workload itself.

Ephemeral containers are not supported by {{< glossary_tooltip text="static pods" term_id="static-pod" >}}.
-->
如果想要調查運行中有問題的 Pod，可以向該 Pod 添加一個臨時容器（Ephemeral Container）並進行診斷。
臨時容器沒有資源或調度保證，因此不應該使用它們來運行工作負載本身的任何部分。

{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}} 不支持臨時容器。
