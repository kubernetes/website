---
title: Container Storage Interface (CSI)
id: csi
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#csi
short_description: >
    コンテナストレージインターフェイス(CSI)はストレージシステムをコンテナに公開するための標準インターフェイスを定義します。


aka: 
tags:
- storage
---
コンテナストレージインターフェイス(CSI)はストレージシステムをコンテナに公開するための標準インターフェイスを定義します。

<!--more--> 

CSI allows vendors to create custom storage plugins for Kubernetes without adding them to the Kubernetes repository (out-of-tree plugins). To use a CSI driver from a storage provider, you must first [deploy it to your cluster](https://kubernetes-csi.github.io/docs/deploying.html). You will then be able to create a {{< glossary_tooltip text="Storage Class" term_id="storage-class" >}} that uses that CSI driver.

CSIはベンダーがKubernetesリポジトリにコードを追加することなく(Kubernetesリポジトリツリー外のプラグインとして)独自のストレージプラグインを作成することを可能にします。CSIドライバをストレージプロバイダから利用するには、はじめに[クラスタにCSIプラグインをデプロイする](https://kubernetes-csi.github.io/docs/deploying.html)必要があります。その後のCSIドライバーを使用するための{{< glossary_tooltip text="ストレージクラス" term_id="storage-class" >}}を作成することができます。

* [KubernetesにおけるCSIのドキュメント](/docs/concepts/storage/volumes/#csi)
* [利用可能なCSIドライバの一覧](https://kubernetes-csi.github.io/docs/drivers.html)
