---
title: 持久卷（Persistent Volume）
id: persistent-volume
date: 2018-04-12
full_link: /zh-cn/docs/concepts/storage/persistent-volumes/
short_description: >
  持久卷是代表集羣中一塊存儲空間的 API 對象。
  它是通用的、可插拔的、並且不受單個 Pod 生命週期約束的持久化資源。

aka: 
tags:
- core-object
- storage
---
<!--
title: Persistent Volume
id: persistent-volume
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  An API object that represents a piece of storage in the cluster. Available as a general, pluggable resource that persists beyond the lifecycle of any individual Pod.

aka: 
tags:
- core-object
- storage
-->

<!--
 An API object that represents a piece of storage in the cluster. Available as a general, pluggable resource that persists beyond the lifecycle of any individual {{< glossary_tooltip text="Pod" term_id="pod" >}}.
-->
持久卷是代表集羣中一塊存儲空間的 API 對象。它是通用的、可插拔的、並且不受單個
{{< glossary_tooltip text="Pod" term_id="pod" >}} 生命週期約束的持久化資源。

<!--more--> 

<!--
PersistentVolumes (PVs) provide an API that abstracts details of how storage is provided from how it is consumed.
PVs are used directly in scenarios where storage can be created ahead of time (static provisioning).
For scenarios that require on-demand storage (dynamic provisioning), PersistentVolumeClaims (PVCs) are used instead.
-->
持久卷（PersistentVolumes，PV）提供了一個 API，該 API 對存儲的供應方式細節進行抽象，令其與使用方式相分離。
在提前創建存儲（靜態供應）的場景中，PV 可以直接使用。
在按需提供存儲（動態供應）的場景中，需要使用 PersistentVolumeClaims (PVC)。
