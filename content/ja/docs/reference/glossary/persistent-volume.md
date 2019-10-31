---
title: 永続ボリューム
id: persistent-volume
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
 クラスター内のストレージの一部を示すAPIオブジェクトで、個々のPodのライフサイクルを超えて接続する一般的でプラグ可能なリソースとして利用可能です。

aka: 
tags:
- core-object
- storage
---
 クラスター内のストレージの一部を示すAPIオブジェクトで、個々の{{< glossary_tooltip text="Pod" term_id="pod" >}}のライフサイクルを超えて接続する一般的でプラグ可能なリソースとして利用可能です。

<!--more--> 

永続ボリューム(PV)はストレージの利用方法からストレージの提供方法の詳細を抽象化するAPIを提供します。
PVはストレージを事前に作成できるシナリオで直接使用されます（静的プロビジョニング）。
オンデマンドストレージ（動的プロビジョニング）を必要とするシナリオでは、代わりに永続ボリューム要求(PVC)が使用されます。
