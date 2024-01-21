---
title: コンテナ環境
content_type: concept
weight: 20
---

<!-- overview -->

このページでは、コンテナ環境で利用可能なリソースについて説明します。




<!-- body -->

## コンテナ環境

Kubernetesはコンテナにいくつかの重要なリソースを提供します。

* イメージと1つ以上のボリュームの組み合わせのファイルシステム
* コンテナ自体に関する情報
* クラスター内の他のオブジェクトに関する情報

### コンテナ情報

コンテナの *ホスト名* は、コンテナが実行されているPodの名前です。
ホスト名は`hostname`コマンドまたはlibcの[`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html)関数呼び出しにより利用可能です。

Podの名前と名前空間は[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)を通じて環境変数として利用可能です。

Pod定義からのユーザー定義の環境変数もコンテナで利用できます。
コンテナイメージで静的に指定されている環境変数も同様です。

### クラスター情報

コンテナの作成時に実行されていたすべてのサービスのリストは、環境変数として使用できます。
このリストは、新しいコンテナのPodおよびKubernetesコントロールプレーンサービスと同じ名前空間のサービスに制限されます。

*bar* という名前のコンテナに対応する *foo* という名前のサービスの場合、以下の変数が定義されています。

```shell
FOO_SERVICE_HOST=<サービスが実行されているホスト>
FOO_SERVICE_PORT=<サービスが実行されているポート>
```

サービスは専用のIPアドレスを持ち、[DNSアドオン](http://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/)が有効の場合、DNSを介してコンテナで利用可能です。



## {{% heading "whatsnext" %}}


* [コンテナライフサイクルフック](/ja/docs/concepts/containers/container-lifecycle-hooks/)の詳細
* [コンテナライフサイクルイベントへのハンドラー紐付け](/ja/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)のハンズオン


