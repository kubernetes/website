---
title: 臨時容器（Ephemeral Container）
id: ephemeral-container
date: 2019-08-26
full_link: /zh-cn/docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  你可以在 Pod 中臨時執行的一種容器型別
aka:
tags:
- fundamental
---
  你可以在 {{< glossary_tooltip term_id="pod" >}} 中臨時執行的一種 {{< glossary_tooltip term_id="container" >}} 型別。

<!--
---
title: Ephemeral Container
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  A type of container type that you can temporarily run inside a Pod

aka:
tags:
- fundamental
---
A {{< glossary_tooltip term_id="container" >}} type that you can temporarily run inside a {{< glossary_tooltip term_id="pod" >}}.
-->

<!--more-->

<!--
If you want to investigate a Pod that's running with problems, you can add an ephemeral container to that Pod and carry out diagnostics. Ephemeral containers have no resource or scheduling guarantees, and you should not use them to run any part of the workload itself.
-->

如果想要調查執行中有問題的 Pod，可以向該 Pod 新增一個臨時容器並進行診斷。
臨時容器沒有資源或排程保證，因此不應該使用它們來執行任何部分的工作負荷本身。