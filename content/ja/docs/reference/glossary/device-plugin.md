---
title: デバイスプラグイン
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  ベンダー固有の初期化やセットアップを必要とするデバイスにPodがアクセスできるようにするためのソフトウェア拡張機能
aka:
tags:
- fundamental
- extension
---
デバイスプラグインはワーカー{{< glossary_tooltip term_id="node" text="ノード">}}上で実行し、初期化やセットアップ手順が必要なローカルのハードウェアへのアクセスを{{< glossary_tooltip term_id="pod" text="Pod">}}に提供します。

<!--more-->

デバイスプラグインは{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}にリソースをアドバタイズします。それによりワーカーノードのPodは関連するノードのハードウェア機能にアクセスできます。デバイスプラグインは{{< glossary_tooltip term_id="daemonset" >}}としてデプロイするか、ターゲットの各ノードに直接デバイスプラグインのソフトウェアをインストールすることができます。
詳細については、[デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)をご覧ください。
