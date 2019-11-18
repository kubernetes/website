---
title: 永続ボリューム
id: persistent-volume
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
 クラスター内のストレージの一部を表すAPIオブジェクトです。通常利用可能で、個々のPodのライフサイクルの先にあるプラグイン形式のリソースです。

aka: 
tags:
- core-object
- storage
---
 クラスター内のストレージの一部を表すAPIオブジェクトです。通常利用可能で、個々の{{< glossary_tooltip text="Pod" term_id="pod" >}}のライフサイクルの先にあるプラグイン形式のリソースです。

<!--more--> 

PersistentVolume(PV)はストレージの利用方法からストレージの提供方法の詳細を抽象化するAPIを提供します。
PVはストレージを事前に作成できるシナリオで直接使用されます（静的プロビジョニング）。
オンデマンドストレージ（動的プロビジョニング）を必要とするシナリオでは、代わりにPersistentVolumeClaims(PVC)が使用されます。
