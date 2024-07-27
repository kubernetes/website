---
title: ボリュームの動的プロビジョニング
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /ja/docs/concepts/storage/dynamic-provisioning
short_description: >
 ユーザーがストレージボリュームの自動作成をリクエストできるようにします。

aka: 
tags:
- core-object
- storage
---
ユーザーがストレージ{{< glossary_tooltip text="ボリューム" term_id="volume" >}}の自動作成をリクエストできるようにします。

<!--more--> 

動的プロビジョニングによりクラスター管理者が事前にストレージをプロビジョニングする必要がなくなります。その代わりにユーザーのリクエストにより自動的にストレージをプロビジョニングします。ボリュームの動的プロビジョニングはボリュームをプロビジョニングする{{< glossary_tooltip text="Volume Plugin" term_id="volume-plugin" >}}とそのVolume Pluginに渡すパラメーターのセットを参照する{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}というAPIオブジェクトに基づいています。
