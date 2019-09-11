---
title: コンテナ環境変数
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

このページでは、コンテナ環境で利用可能なリソースについて説明します。

{{% /capture %}}


{{% capture body %}}

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
Dockerイメージで静的に指定されている環境変数も同様です。

### クラスター情報

コンテナの作成時に実行されていたすべてのサービスのリストは、環境変数として使用できます。
これらの環境変数はDockerリンクの構文と一致します。

*bar* という名前のコンテナに対応する *foo* という名前のサービスの場合、以下の変数が定義されています。

```shell
FOO_SERVICE_HOST=<サービスが実行されているホスト>
FOO_SERVICE_PORT=<サービスが実行されているポート>
```

サービスは専用のIPアドレスを持ち、[DNSアドオン](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/)が有効の場合、DNSを介してコンテナで利用可能です。

{{% /capture %}}

{{% capture whatsnext %}}

* [コンテナライフサイクルフック](/docs/concepts/containers/container-lifecycle-hooks/)の詳細
* [コンテナライフサイクルイベントへのハンドラー紐付け](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)のハンズオン

{{% /capture %}}
