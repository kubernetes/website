---
title: コンテナストレージインターフェース(CSI)
id: csi
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#csi
short_description: >
    コンテナストレージインターフェース(CSI)はストレージシステムをコンテナに公開するための標準インターフェースを定義します。


aka: 
tags:
- storage
---
コンテナストレージインターフェース(CSI)はストレージシステムをコンテナに公開するための標準インターフェースを定義します。

<!--more--> 

CSIはベンダーがKubernetesリポジトリにコードを追加することなく(Kubernetesリポジトリツリー外のプラグインとして)独自のストレージプラグインを作成することを可能にします。CSIドライバをストレージプロバイダから利用するには、はじめに[クラスターにCSIプラグインをデプロイする](https://kubernetes-csi.github.io/docs/deploying.html)必要があります。その後のCSIドライバーを使用するための{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}を作成することができます。

* [KubernetesにおけるCSIのドキュメント](/docs/concepts/storage/volumes/#csi)
* [利用可能なCSIドライバの一覧](https://kubernetes-csi.github.io/docs/drivers.html)
