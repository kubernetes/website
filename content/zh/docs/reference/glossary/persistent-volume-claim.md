---
title: 持久卷申领
id: persistent-volume-claim
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  声明在持久卷中定义的存储资源，以便可以将其挂载为容器中的卷。

aka: 
tags:
- core-object
- storage
---

<!--
title: Persistent Volume Claim
id: persistent-volume-claim
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  Claims storage resources defined in a PersistentVolume so that it can be mounted as a volume in a container.

aka: 
tags:
- core-object
- storage
-->

<!--
 Claims storage resources defined in a PersistentVolume so that it can be mounted as a volume in a container.
-->
申领持久卷中定义的存储资源，以便可以将其挂载为容器中的卷。

<!--more--> 

<!--
Specifies the amount of storage, how the storage will be accessed (read-only, read-write and/or exclusive) and how it is reclaimed (retained, recycled or deleted). Details of the storage itself are in the PersistentVolume specification.
-->
指定存储的数量，如何访问存储（只读、读写或独占）以及如何回收存储（保留、回收或删除）。存储本身的详细信息在 PersistentVolume 规范中。
