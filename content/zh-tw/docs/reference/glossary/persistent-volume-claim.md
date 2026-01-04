---
title: 持久卷申領（Persistent Volume Claim）
id: persistent-volume-claim
date: 2018-04-12
full_link: /zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  聲明在持久卷中定義的儲存資源，以便可以將其掛載爲容器中的卷。

aka: 
tags:
- core-object
- storage
---

<!--
title: Persistent Volume Claim
id: persistent-volume-claim
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  Claims storage resources defined in a PersistentVolume so that it can be mounted as a volume in a container.

aka: 
tags:
- core-object
- storage
-->

<!--
 Claims storage resources defined in a {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}} so that it can be mounted as a volume in a {{< glossary_tooltip text="container" term_id="container" >}}.
-->
申領{{< glossary_tooltip text="持久卷（PersistentVolume）" term_id="persistent-volume" >}}
中定義的儲存資源，以便可以將其掛載爲{{< glossary_tooltip text="容器（container）" term_id="container" >}}中的卷。

<!--more--> 

<!--
Specifies the amount of storage, how the storage will be accessed (read-only, read-write and/or exclusive) and how it is reclaimed (retained, recycled or deleted). Details of the storage itself are described in the PersistentVolume object.
-->
指定儲存的數量，如何訪問儲存（只讀、讀寫或獨佔）以及如何回收儲存（保留、回收或刪除）。
儲存本身的詳細資訊在 PersistentVolume 對象中。
