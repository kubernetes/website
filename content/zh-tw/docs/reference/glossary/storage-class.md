---
title: StorageClass
id: storageclass
date: 2018-04-12
full_link: /zh-cn/docs/concepts/storage/storage-classes/
short_description: >
  StorageClass 是管理員用來描述可用的不同存儲類型的一種方法。

aka: 
tags:
- core-object
- storage
---


<!--
---
title: Storage Class
id: storageclass
date: 2018-04-12
full_link: /docs/concepts/storage/storage-classes
short_description: >
  A StorageClass provides a way for administrators to describe different available storage types.

aka:
tags:
- core-object
- storage
---
-->

<!--
 A StorageClass provides a way for administrators to describe different available storage types.
-->
 StorageClass 是管理員用來描述不同的可用存儲類型的一種方法。

<!--more--> 

<!--
StorageClasses can map to quality-of-service levels, backup policies, or to arbitrary policies determined by cluster administrators. Each StorageClass contains the fields `provisioner`, `parameters`, and `reclaimPolicy`, which are used when a {{< glossary_tooltip text="Persistent Volume" term_id="persistent-volume" >}} belonging to the class needs to be dynamically provisioned. Users can request a particular class using the name of a StorageClass object.
-->

StorageClass 可以映射到服務質量等級（QoS）、備份策略、或者管理員任意定義的策略。
每個 StorageClass 對象包含的字段有 `provisioner`、`parameters` 和 `reclaimPolicy`。
動態製備該存儲類別的{{< glossary_tooltip text="持久卷" term_id="persistent-volume" >}}時需要用到這些字段值。
通過設置 StorageClass 對象的名稱，用戶可以請求特定存儲類別。