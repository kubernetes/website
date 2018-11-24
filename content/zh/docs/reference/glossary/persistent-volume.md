---
title: 持久卷
id: persistent-volume
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  持久卷是代表集群中一块存储空间的 API 对象。 它是通用的、可插拔的、并且超出单个容器生命周期的持久化的资源。

aka: 
tags:
- core-object
- storage
---

<!--
---
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
---
-->

<!--
 An API object that represents a piece of storage in the cluster. Available as a general, pluggable resource that persists beyond the lifecycle of any individual {{< glossary_tooltip text="Pod" term_id="pod" >}}.
-->

持久卷是代表集群中一块存储空间的 API 对象。 它是通用的、可插拔的、并且超出单个容器生命周期的持久化的资源。

<!--more--> 

<!--
PersistentVolumes (PVs) provide an API that abstracts details of how storage is provided from how it is consumed.
PVs are used directly in scenarios where storage can be created ahead of time (static provisioning).
For scenarios that require on-demand storage (dynamic provisioning), PersistentVolumeClaims (PVCs) are used instead.
-->

PersistentVolumes（PV）提供了一个 API，该 API 对存储是如何提供的细节信息进行了抽象。PV 可以直接用在提前创建存储的场景中（静态提供）。对于按需提供存储的场景（动态提供），就要使用 PersistentVolumeClaims (PVCs)。

