---
title: Pod
id: pod
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/pod-overview/
short_description: >
  Pod 表示你的叢集上一組正在執行的容器。

aka: 
tags:
- core-object
- fundamental
---

<!--
---
title: Pod
id: pod
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/pod-overview/
short_description: >
  A Pod represents a set of running containers in your cluster.

aka: 
tags:
- core-object
- fundamental
---
-->

<!--
 The smallest and simplest Kubernetes object. A Pod represents a set of running {{< glossary_tooltip text="containers" term_id="container" >}} on your cluster.
-->

 Pod 是 Kubernetes 的原子物件。Pod 表示您的叢集上一組正在執行的{{< glossary_tooltip text="容器（containers）" term_id="container" >}}。

<!--more--> 

<!--
A Pod is typically set up to run a single primary container. It can also run optional sidecar containers that add supplementary features like logging. Pods are commonly managed by a {{< glossary_tooltip term_id="deployment" >}}.
-->

通常建立 Pod 是為了執行單個主容器。Pod 還可以執行可選的邊車（sidecar）容器，以新增諸如日誌記錄之類的補充特性。通常用 {{< glossary_tooltip term_id="deployment" >}} 來管理 Pod。
