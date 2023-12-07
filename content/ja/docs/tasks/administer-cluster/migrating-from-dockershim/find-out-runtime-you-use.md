---
title: ノードで使用されているコンテナランタイムの確認
content_type: task
weight: 30
---

<!-- overview -->

このページでは、クラスター内のノードが使用している[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)を確認する手順を概説しています。

クラスターの実行方法によっては、ノード用のコンテナランタイムが事前に設定されている場合と、設定する必要がある場合があります。
マネージドKubernetesサービスを使用している場合、ノードに設定されているコンテナランタイムを確認するためのベンダー固有の方法があるかもしれません。
このページで説明する方法は、`kubectl`の実行が許可されていればいつでも動作するはずです。

## {{% heading "prerequisites" %}}

`kubectl`をインストールし、設定します。詳細は[ツールのインストール](/ja/docs/tasks/tools/#kubectl)の項を参照してください。

## ノードで使用されているコンテナランタイムの確認

ノードの情報を取得して表示するには`kubectl`を使用します:

```shell
kubectl get nodes -o wide
```

出力は以下のようなものです。列`CONTAINER-RUNTIME`には、ランタイムとそのバージョンが出力されます。

```none
# For dockershim
NAME         STATUS   VERSION    CONTAINER-RUNTIME
node-1       Ready    v1.16.15   docker://19.3.1
node-2       Ready    v1.16.15   docker://19.3.1
node-3       Ready    v1.16.15   docker://19.3.1
```

```none
# For containerd
NAME         STATUS   VERSION   CONTAINER-RUNTIME
node-1       Ready    v1.19.6   containerd://1.4.1
node-2       Ready    v1.19.6   containerd://1.4.1
node-3       Ready    v1.19.6   containerd://1.4.1
```

コンテナランタイムについては、[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)のページで詳細を確認することができます。
