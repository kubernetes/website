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
デバイスプラグインはワーカー{{< glossary_tooltip term_id="node" text="ノード">}}上で実行され、ベンダー固有の初期化やセットアップ手順を必要とするローカルのハードウェアへのアクセスを{{< glossary_tooltip term_id="pod" text="Pod">}}に提供します。

<!--more-->

デバイスプラグインは、ワークロード上のPodが、実行されているノードに関連するハードウェア機能にアクセスできるようにリソースを{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}に提供します。デバイスプラグインは{{< glossary_tooltip term_id="daemonset" >}}としてデプロイするか、ターゲットの各ノードに直接デバイスプラグインのソフトウェアをインストールすることができます。
詳細については、[デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)をご覧ください。
