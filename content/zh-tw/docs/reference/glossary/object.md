---
title: 對象（Object）
id: object
date: 2020-10-12
full_link: /zh-cn/docs/concepts/overview/working-with-objects/#kubernetes-objects
short_description: >
   Kubernetes 系統中的實體，代表了叢集的部分狀態。
aka: 
tags:
- architecture
- fundamental
---
<!-- 
title: Object
id: object
date: 2020-10-12
full_link: /docs/concepts/overview/working-with-objects/#kubernetes-objects
short_description: >
   An entity in the Kubernetes system, representing part of the state of your cluster.
aka:
tags:
- architecture
- fundamental
-->

<!-- 
An entity in the Kubernetes system. An object is an
{{< glossary_tooltip text="API resource" term_id="api-resource" >}} that the Kubernetes API
uses to represent the state of your cluster.
-->
Kubernetes 系統中的實體。對象是 Kubernetes API 用於表示叢集狀態的
{{< glossary_tooltip text="API 資源" term_id="api-resource" >}}。

<!--more-->
<!--
A Kubernetes object is typically a “record of intent”—once you create the object, the Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} works constantly to ensure
that the item it represents actually exists.
By creating an object, you're effectively telling the Kubernetes system what you want that part of
your cluster's workload to look like; this is your cluster's desired state.
-->
Kubernetes 對象通常是一個“意向表述（Record of Intent）”—一旦你創建了一個對象，Kubernetes 
{{< glossary_tooltip text="控制平面（Control Plane）" term_id="control-plane" >}} 就不斷工作，
以確保它所代表的事物確實存在。
創建一個對象相當於告知 Kubernetes 系統：你期望這部分叢集負載看起來像什麼；這也就是你叢集的期望狀態。
