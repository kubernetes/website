---
title: ストレージクラス
id: storageclass
date: 2018-04-12
full_link: /docs/concepts/storage/storage-classes
short_description: >
  ストレージクラスは管理者が利用可能なさまざまなストレージタイプを記述する方法を提供します。

aka: 
tags:
- core-object
- storage
---
 ストレージクラスは管理者が利用可能なさまざまなストレージタイプを記述する方法を提供します。

<!--more--> 

StorageClasses can map to quality-of-service levels, backup policies, or to arbitrary policies determined by cluster administrators. Each StorageClass contains the fields `provisioner`, `parameters`, and `reclaimPolicy`, which are used when a {{< glossary_tooltip text="Persistent Volume" term_id="persistent-volume" >}} belonging to the class needs to be dynamically provisioned. Users can request a particular class using the name of a StorageClass object.

ストレージクラスはサービス品質レベル、バックアップポリシー、クラスター管理者が決定した任意のポリシーにマッピングできます。

各ストレージクラスには`provisioner`、` parameters`、`reclaimPolicy`フィールドが含まれています。これらは、対象のストレージクラスの{{< glossary_tooltip text="永続ボリューム" term_id="persistent-volume" >}}を動的プロビジョニングする必要がある場合に使用されます。ユーザーはストレージクラスオブジェクトの名前を使用して特定のストレージクラスを要求できます。
