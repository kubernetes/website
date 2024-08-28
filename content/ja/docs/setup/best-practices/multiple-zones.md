---
title: 複数のゾーンで動かす
weight: 20
content_type: concept
---

<!-- overview -->

このページでは、複数のゾーンにまたがるKubernetesクラスターの実行について説明します。

<!-- body -->

## 背景

Kubernetesは、1つのKubernetesクラスターが複数のゾーンにまたがって実行できるように設計されており、通常これらのゾーンは _リージョン_ と呼ばれる論理的なグループ内に収まります。主要なクラウドプロバイダーは、一貫した機能を提供するゾーン( _アベイラビリティゾーン_ とも呼ばれる)の集合をリージョンと定義しており、リージョン内では各ゾーンが同じAPIとサービスを提供しています。

一般的なクラウドアーキテクチャは、あるゾーンでの障害が別のゾーンのサービスにも影響を与える可能性を最小限に抑えることを目的としています。

## コントロールプレーンの動作

すべての[コントロールプレーンコンポーネント](/ja/docs/concepts/overview/components/#control-plane-components)は、交換可能なリソースのプールとして実行され、コンポーネントごとに複製されることをサポートします。

クラスターコントロールプレーンをデプロイする場合は、複数のゾーンに渡ってコントロールプレーンコンポーネントのレプリカを配置します。可用性を重視する場合は、少なくとも3つのゾーンを選択し、個々のコントロールプレーンコンポーネント(APIサーバー、スケジューラー、etcd、クラスターコントローラーマネージャー)を少なくとも3つのゾーンに渡って複製します。クラウドコントローラーマネージャーを実行している場合は、選択したすべてのゾーンにまたがって複製する必要があります。

{{< note >}}
KubernetesはAPIサーバーのエンドポイントに対してゾーンを跨いだ回復力を提供しません。クラスター内のAPIサーバーの可用性を向上させるためにDNSラウンドロビン、SRVレコード、またはヘルスチェックを備えたサードパーティの負荷分散ソリューションなど、さまざまな技術を使用できます。
{{< /note >}}

## ノードの動作

Kubernetesは、({{< glossary_tooltip text="Deployment" term_id="deployment" >}}や{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}のような)ワークロードリソース用のPodをクラスター内の異なるノードに自動的に分散します。この分散は、障害の影響を軽減するのに役立ちます。

ノードが起動すると、各ノードのkubeletは、Kubernetes APIで特定のkubeletを表すNodeオブジェクトに{{< glossary_tooltip text="ラベル" term_id="label" >}}を自動的に追加します。これらのラベルには[ゾーン情報](/docs/reference/labels-annotations-taints/#topologykubernetesiozone)を含めることができます。

クラスターが複数のゾーンまたはリージョンにまたがっている場合、ノードラベルと[Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)を組み合わせて使用することで、リージョン、ゾーン、さらには特定のノードといった障害ドメイン間でクラスター全体にPodをどのように分散させるかを制御できます。これらのヒントにより、{{< glossary_tooltip text="スケジューラー" term_id="kube-scheduler" >}}は期待される可用性を高めてPodを配置し、関連する障害がワークロード全体に影響するリスクを低減できます

例えば、StatefulSetの3つのレプリカがすべて互いに異なるゾーンで実行されるように制約を設定できます。ワークロードごとにどのアベイラビリティゾーンを使用するかを明示的に定義しなくても、宣言的に定義できます。

### ノードをゾーンに分散させる

Kubernetesのコアがノードを作成してくれるわけではないため、自分で行うか、[Cluster API](https://cluster-api.sigs.k8s.io)などのツールを使ってノードの管理を代行する必要があります。

Cluster APIなどのツールを使用すると、複数の障害ドメインにわたってクラスターのワーカーノードとして実行するマシンのセットを定義したり、ゾーン全体のサービスが中断した場合にクラスターを自動的に復旧するルールを定義できます。

## Podの手動ゾーン割り当て

[nodeSelectorの制約](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)は、作成したPodだけでなく、Deployment、StatefulSet、Jobなどのワークロードリソース内のPodテンプレートにも適用できます。

## ゾーンのストレージアクセス

Persistent Volumeが作成されると、Kubernetesは特定のゾーンにリンクされているすべてのPersistent Volumeにゾーンラベルを自動的に追加します。その後、{{< glossary_tooltip text="スケジューラー" term_id="kube-scheduler" >}}は、`NoVolumeZoneConflict`条件を通じて、指定されたPersistent Volumeを要求するPodがそのボリュームと同じゾーンにのみ配置されるようにします。

ゾーンラベルの追加方法は、クラウドプロバイダーと使用しているストレージプロビジョナーによって異なる可能性があることに注意してください。正しい設定を行うために、常に利用している環境のドキュメントを参照してください。

Persistent Volume Claimには、そのクラス内のストレージが使用する障害ドメイン(ゾーン)を指定する{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}を指定できます。障害ドメインまたはゾーンを認識するStorageClassの構成については、[許可されたトポロジー](/ja/docs/concepts/storage/storage-classes/#allowed-topologies)を参照してください。

## ネットワーキング

Kubernetes自体にはゾーンを意識したネットワーキングは含まれていません。ネットワークプラグインを使用してクラスターネットワーキングを設定できますが、そのネットワークソリューションにはゾーン固有の要素があるかもしれません。例えば、クラウドプロバイダーが`type=LoadBalancer`のServiceをサポートしている場合、ロードバランサーは与えられた接続を処理するロードバランサーのコンポーネントと同じゾーンで動作しているPodにのみトラフィックを送信する可能性があります。詳しくはクラウドプロバイダーのドキュメントを確認してください。

カスタムまたはオンプレミスのデプロイメントの場合、同様の考慮事項が適用されます。{{< glossary_tooltip text="Service" term_id="service" >}}および{{< glossary_tooltip text="Ingress" term_id="ingress" >}}の動作は、異なるゾーンの処理を含め、クラスターのセットアップ方法によって異なります。

## 障害回復

クラスターをセットアップする際には、リージョン内のすべてのゾーンが同時にオフラインになった場合にセットアップがサービスを復旧できるかどうか、またどのように復旧させるかを考慮しておく必要があるかもしれません。例えば、ゾーン内にPodを実行できるノードが少なくとも1つあることに依存していますか？クラスタークリティカルな修復作業が、クラスター内に少なくとも1つの健全なノードがあることに依存していないことを確認してください。例えば、全てのノードが不健全な場合、少なくとも1つのノードを使用できるよう修復が完了するように、特別な{{< glossary_tooltip text="toleration" term_id="toleration" >}}で修復Jobを実行する必要があるかもしれません。

Kubernetesにはこの課題に対する答えはありませんが、検討すべきことです。

## {{% heading "whatsnext" %}}

設定された制約を守りつつ、スケジューラーがクラスターにPodを配置する方法については、[スケジューリング、プリエンプションと退避](/ja/docs/concepts/scheduling-eviction/)を参照してください。
