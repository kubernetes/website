---
title: 靜態 Pod（Static Pod）
id: static-pod
date: 2019-02-12
full_link: /zh-cn/docs/tasks/configure-pod-container/static-pod/
short_description: >
  靜態 Pod（Static Pod）是指由特定節點上的 kubelet 守護進程直接管理的 Pod。

aka: 
tags:
- fundamental
---

<!--
title: Static Pod
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  A pod managed directly by the kubelet daemon on a specific node.

aka: 
tags:
- fundamental
-->

<!--
A {{< glossary_tooltip text="pod" term_id="pod" >}} managed directly by the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
 daemon on a specific node,
without the API server observing it.
-->
由特定節點上的 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 守護進程直接管理的
{{< glossary_tooltip text="Pod" term_id="pod" >}}。
API 伺服器不瞭解它的存在。

<!--
Static Pods do not support {{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}.
-->
靜態 Pod 不支持{{< glossary_tooltip text="臨時容器" term_id="ephemeral-container" >}}。

