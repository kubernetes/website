---
title: 持久卷（Persistent Volume）
id: persistent-volume
date: 2018-04-12
full_link: /zh-cn/docs/concepts/storage/persistent-volumes/
short_description: >
  持久卷是代表集群中一块存储空间的 API 对象。

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
  An API object that represents a piece of storage in the cluster.

aka: 
tags:
- core-object
- storage
-->

<!--
An API object that represents a piece of storage in the cluster. Representation of as a general, pluggable storage
{{< glossary_tooltip text="resource" term_id="infrastructure-resource" >}} that can persist beyond the lifecycle of any
individual {{< glossary_tooltip text="Pod" term_id="pod" >}}.
-->
持久卷是代表集群中一块存储空间的 API 对象。
表示为一般的、可插拔的存储{{< glossary_tooltip text="资源" term_id="infrastructure-resource" >}}，
它可以超越任何单独的 {{< glossary_tooltip text="Pod" term_id="pod" >}}
的生命周期而存在。

<!--more--> 

<!--
PersistentVolumes (PVs) provide an API that abstracts details of how storage is provided from how it is consumed.
PVs are used directly in scenarios where storage can be created ahead of time (static provisioning).
For scenarios that require on-demand storage (dynamic provisioning), PersistentVolumeClaims (PVCs) are used instead.
-->
持久卷（PersistentVolumes，PV）提供了一个 API，该 API 对存储的供应方式细节进行抽象，
令其与使用方式相分离。在提前创建存储（静态制备）的场景中，PV 可以直接使用。
在按需提供存储（动态制备）的场景中，需要使用 PersistentVolumeClaim（PVC）。
