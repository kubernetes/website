---
title: コンテナランタイムインターフェース(CRI)
content_type: concept
weight: 60
---

<!-- overview -->

CRIは、クラスターコンポーネントを再コンパイルすることなく、kubeletがさまざまなコンテナランタイムを使用できるようにするプラグインインターフェースです。

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}が{{< glossary_tooltip text="Pod" term_id="pod" >}}とそのコンテナを起動できるように、クラスター内の各ノードで動作する{{<glossary_tooltip text="container runtime" term_id="container-runtime">}}が必要です。

kubeletとContainerRuntime間の通信のメインプロトコルです。

Kubernetes Container Runtime Interface(CRI)は、[クラスターコンポーネント](/ja/docs/concepts/overview/components/#node-components){{< glossary_tooltip text="kubelet" term_id="kubelet" >}}と{{<glossary_tooltip text="container runtime" term_id="container-runtime">}}間の通信用のメイン[gRPC](/ja/docs/concepts/overview/components/#node-components)プロトコルを定義します。

<!-- body -->

## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

kubeletは、gRPCを介してコンテナランタイムに接続するときにクライアントとして機能します。ランタイムおよびイメージサービスエンドポイントは、コンテナランタイムで使用可能である必要があります。コンテナランタイムは、`--image-service-endpoint`[コマンドラインフラグ](/ja/docs/reference/command-line-tools-reference/kubelet)を使用して、kubelet内で個別に設定できます。

Kubernetes v{{< skew currentVersion >}}の場合、kubeletはCRI `v1`の使用を優先します。
コンテナランタイムがCRIの`v1`をサポートしていない場合、kubeletはサポートされている古いバージョンのネゴシエーションを試みます。
kubelet v{{< skew currentVersion >}}はCRI `v1alpha2`をネゴシエートすることもできますが、このバージョンは非推奨と見なされます。
kubeletがサポートされているCRIバージョンをネゴシエートできない場合、kubeletはあきらめて、ノードとして登録されません。

## アップグレード

Kubernetesをアップグレードする場合、kubeletはコンポーネントの再起動時に最新のCRIバージョンを自動的に選択しようとします。
それが失敗した場合、フォールバックは上記のように行われます。
コンテナランタイムがアップグレードされたためにgRPCリダイヤルが必要な場合は、コンテナランタイムも最初に選択されたバージョンをサポートする必要があります。
そうでない場合、リダイヤルは失敗することが予想されます。これには、kubeletの再起動が必要です。

## {{% heading "whatsnext" %}}

- CRI[プロトコル定義](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto)の詳細を学ぶ。
