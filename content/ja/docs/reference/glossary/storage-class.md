---
title: StorageClass
id: storageclass
date: 2018-04-12
full_link: /docs/concepts/storage/storage-classes
short_description: >
  StorageClassは管理者が利用可能なさまざまなストレージタイプを記述する方法を提供します。

aka: 
tags:
- core-object
- storage
---
 StorageClassは管理者が利用可能なさまざまなストレージタイプを記述する方法を提供します。

<!--more--> 

StorageClassはサービス品質レベル、バックアップポリシー、クラスター管理者が決定した任意のポリシーにマッピングできます。
各StorageClassには`provisioner`、` parameters`、`reclaimPolicy`フィールドが含まれています。これらは、対象のStorageClassの{{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}を動的プロビジョニングする必要がある場合に使用されます。ユーザーはStorageClassオブジェクトの名前を使用して特定のStorageClassを要求できます。
