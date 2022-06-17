---
title: 物件（Object）
id: object
date: 2020-10-12
full_link: /zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects
short_description: >
   Kubernetes 系統中的實體, 代表了叢集的部分狀態。
aka: 
tags:
- fundamental
---
<!-- 
---
title: Object
id: object
date: 2020-10-12
full_link: https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects
short_description: >
   A entity in the Kubernetes system, representing part of the state of your cluster.
aka: 
tags:
- fundamental
---
-->
<!-- 
An entity in the Kubernetes system. The Kubernetes API uses these entities to represent the state
of your cluster.
-->
Kubernetes 系統中的實體。Kubernetes API 用這些實體表示叢集的狀態。

<!--more-->
<!-- 
A Kubernetes object is typically a “record of intent”—once you create the object, the Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} works constantly to ensure
that the item it represents actually exists.
By creating an object, you're effectively telling the Kubernetes system what you want that part of
your cluster's workload to look like; this is your cluster's desired state.
-->
Kubernetes 物件通常是一個“目標記錄”-一旦你建立了一個物件，Kubernetes 
{{< glossary_tooltip text="控制平面（Control Plane）" term_id="control-plane" >}} 
不斷工作，以確保它代表的專案確實存在。
建立一個物件相當於告知 Kubernetes 系統：你期望這部分叢集負載看起來像什麼；這也就是你叢集的期望狀態。