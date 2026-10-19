---
title: コンテナランタイムインターフェース(CRI)
content_type: concept
weight: 60
---

<!-- overview -->

CRIはプラグインインターフェースで、クラスターコンポーネントを再コンパイルすることなく、kubeletがさまざまなコンテナランタイムを使用できるようにします。

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}が{{< glossary_tooltip text="Pod" term_id="pod" >}}とそのコンテナを起動できるように、クラスター内の各ノードで動作する{{<glossary_tooltip text="コンテナランタイム" term_id="container-runtime">}}が必要です。

{{< glossary_definition prepend="コンテナランタイムインターフェース(CRI)は" term_id="cri" length="all" >}}

<!-- body -->

## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

kubeletは、gRPCを用いてコンテナランタイムに接続するときにクライアントとして機能します。
ランタイムおよびイメージサービスエンドポイントは、コンテナランタイムで利用できる必要があります。
これらは、`--container-runtime-endpoint`[コマンドラインフラグ](/docs/reference/command-line-tools-reference/kubelet/)を使用してkubelet内で個別に設定できます。

Kubernetes v1.26以降では、kubeletはコンテナランタイムが`v1` CRI APIをサポートしていることを要求します。
コンテナランタイムが`v1` APIをサポートしていない場合、kubeletはノードを登録しません。

## アップグレード {#upgrading}

ノード上でKubernetesのバージョンをアップグレードすると、kubeletが再起動します。
コンテナランタイムが`v1` CRI APIをサポートしていない場合、kubeletは登録に失敗し、エラーを報告します。
コンテナランタイムのアップグレードによってgRPCの再接続が必要な場合、接続を成功させるには、ランタイムが`v1` CRI APIをサポートしている必要があります。
これには、コンテナランタイムが正しく設定された後、kubeletの再起動が必要になる場合があります。

## {{% heading "whatsnext" %}}

- CRI[プロトコル定義](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)の詳細を学ぶ
