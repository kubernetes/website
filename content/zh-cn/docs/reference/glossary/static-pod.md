---
title: 静态 Pod（Static Pod）
id: static-pod
date: 2019-02-12
full_link: /zh-cn/docs/tasks/configure-pod-container/static-pod/
short_description: >
  静态Pod（Static Pod）是指由特定节点上的 kubelet 守护进程直接管理的 Pod。

aka: 
tags:
- fundamental
---

<!--
---
title: Static Pod
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  A pod managed directly by the kubelet daemon on a specific node.

aka: 
tags:
- fundamental
---
-->

<!--
A {{< glossary_tooltip text="pod" term_id="pod" >}} managed directly by the kubelet
 daemon on a specific node,
-->
由特定节点上的 kubelet 守护进程直接管理的 {{< glossary_tooltip text="pod" term_id="pod" >}}，
<!--more-->

<!--
without the API server observing it.
-->
API 服务器不了解它的存在。