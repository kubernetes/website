---
title: ノードの自動スケーリング
linkTitle: ノードの自動スケーリング
description: >-
  需要に適応し、コストを最適化するために、クラスター内のノードを自動的にプロビジョニングおよび統合します。
content_type: concept
weight: 15
---

クラスター内でワークロードを実行するには、{{< glossary_tooltip text="ノード" term_id="node" >}}が必要です。
クラスター内のノードは _自動スケール_ 可能であり、必要なキャパシティを提供しながらコストを最適化するために、動的に[_プロビジョニング_](#provisioning)されたり[_統合_](#consolidation)されたりします。
自動スケールはノードの[_オートスケーラー_](#autoscalers)によって実行されます。

## ノードのプロビジョニング {#provisioning}

既存のノードにスケジュールできないPodがクラスター内にある場合、それらのPodを収容するために、新しいノードをクラスターに自動的に追加&mdash;_プロビジョニング_&mdash;できます。
これは、例えば[水平ワークロードとノードの自動スケーリングを組み合わせた](#horizontal-workload-autoscaling)結果として、時間の経過とともにPodの数が変化する場合に特に役立ちます。

オートスケーラーは、ノードを裏で支えるクラウドプロバイダーのリソースを作成および削除することにより、ノードをプロビジョニングします。
一般的に、ノードを裏で支えるリソースは仮想マシンです。

プロビジョニングの主な目的は、すべてのPodをスケジュール可能にすることです。
この目的は、構成されたプロビジョニングの制限に達したり、特定のPodのセットと互換性のないプロビジョニング構成であったり、クラウドプロバイダーのキャパシティが不足していたりするなど、さまざまな制限によって常に達成可能ではありません。
プロビジョニング中には、追加の目的(たとえばプロビジョニングされたノードのコストを最小限に抑える、障害ドメイン間のノード数を調整するなど)を達成しようとすることがよくあります。

プロビジョニングするノードを決定する際のノードオートスケーラーへの2つの主な入力は、[Podのスケジューリング制約](#provisioning-pod-constraints)と[オートスケーラー構成によって課されるノード制約](#provisioning-node-constraints)です。

オートスケーラーの構成には、他のノードのプロビジョニングトリガー(たとえば、設定された最小制限を下回るノードの数など)も含まれる場合があります。

{{< note >}}
プロビジョニングは、以前はCluster Autoscalerで _スケールアップ_ として知られていました。
{{< /note >}}

### Podのスケジューリング制約 {#provisioning-pod-constraints}

Podは、スケジュール可能なノードの種類に制限を課すために[スケジューリング制約](/docs/concepts/scheduling-eviction/assign-pod-node/)を表現できます。
ノードオートスケーラーは、これらの制約を考慮して、保留中のPodがプロビジョニングされたノードにスケジュールできるようにします。

最も一般的なスケジューリング制約の種類は、Podコンテナによって指定されたリソース要求です。
オートスケーラーは、プロビジョニングされたノードに要求を満たすのに十分なリソースがあることを確認します。
ただし、Podの実行開始後の実際のリソース使用量は直接考慮することはありません。
実際のワークロードのリソース使用量に基づいてノードを自動スケールするには、[水平ワークロードの自動スケーリング](#horizontal-workload-autoscaling)をノードの自動スケーリングと組み合わせることができます。

その他の一般的なPodのスケジューリング制約には、[ノードアフィニティ](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)、[Pod間アフィニティ](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)、特定の[ストレージボリューム](/docs/concepts/storage/volumes/)の要件などがあります。

### オートスケーラー構成によって課されるノード制約 {#provisioning-node-constraints}

プロビジョニングされるノードの詳細(たとえばリソース量、特定ラベルの有無)は、オートスケーラーの構成によって異なります。
オートスケーラーは、事前定義されたノード構成のセットから選択するか、[自動プロビジョニング](#autoprovisioning)を使用できます。

### 自動プロビジョニング {#autoprovisioning}

ノードの自動プロビジョニングは、プロビジョニング可能なノードの詳細をユーザーが完全に構成する必要のないプロビジョニングモードです。
かわりに、オートスケーラーは、対応している保留中のPodと事前に定義された制約(たとえば、最小リソース量や特定ラベルの必要性)に基づいて、ノード構成を動的に選択します。

## ノードの統合 {#consolidation}

クラスターを運用する際の主な考慮事項は、スケジュール可能なすべてのPodが実行されていることを確認しながら、可能な限りクラスターのコストを低く抑えることです。
これを達成するには、Podのリソース要求がノードのリソースをできるだけ多く利用する必要があります。
この観点から、クラスター内の全体的なノードの使用率は、クラスターのコスト効率の指標として使用できます。

{{< note >}}
Podのリソース要求を正しく設定することは、ノードの使用率を最適化することと同様に、クラスター全体のコスト効率にとって重要です。
ノードの自動スケーリングを[垂直ワークロードの自動スケーリング](#vertical-workload-autoscaling)と組み合わせることで、これを実現できます。
{{< /note >}}

クラスター内のノードは自動的に _統合_ され、全体的なノードの使用率とクラスターのコスト効率を改善できます。
統合は、クラスターから使用率の低いノードのセットを削除することで行われます。
必要に応じて、それらを置き換えるために別のノードセットを[プロビジョニング](#provisioning)できます。

プロビジョニングと同様に、統合の決定を下す際にはPodのリソース要求のみを考慮し、実際のリソース使用量は考慮しません。

統合の目的のために、ノード上でDeamonSetと静的Podのみが実行されている場合は、そのノードは _空_ と見なされます。
統合中に空のノードを削除することは、空でないノードを削除するよりも簡単であり、オートスケーラーには空のノードを統合するために特別に設計された最適化が備わっていることがよくあります。

統合中に空でないノードを削除することは破壊的であり、そのノード上で実行されているPodが終了し、(たとえばDeploymentによって)再作成が必要になる可能性があります。
ただし、再作成されたすべてのPodは、クラスター内の既存のノードまたは統合の一環としてプロビジョニングされた代替ノードにスケジュールできる必要があります。
__通常、統合の結果としてPodが保留中になることはありません。__

{{< note >}}
オートスケーラーは、ノードのプロビジョニングまたは統合後に再作成されたPodがどのようにスケジュールされるかを予測しますが、実際のスケジューリングを制御することはありません。
そのため、統合の実行中にまったく新しいPodが出現するなどの理由で、統合の結果として一部のPodが保留中になる可能性があります。
{{< /note >}}

オートスケーラー構成では、さまざまなプロパティ(たとえばクラスター内のノードの最大ライフスパン)を最適化するために、他の条件(たとえばノードが作成されてからの経過時間)によって統合をトリガーすることもできます。

統合の実行方法の詳細は、特定のオートスケーラーの構成によって異なります。

{{< note >}}
統合は、以前はCluster Autoscalerで _スケールダウン_ として知られていました。
{{< /note >}}

## オートスケーラー {#autoscalers}

前のセクションで説明した機能は、ノードの _オートスケーラー_ によって提供されます。
Kubernetes APIに加えて、オートスケーラーはノードをプロビジョニングおよび統合のためにクラウドプロバイダーのAPIと対話する必要があります。
つまり、サポートされている各クラウドプロバイダーと明示的に連携する必要があります。
個々のオートスケーラーのパフォーマンスと機能のセットは、連携先のクラウドプロバイダーによって異なる場合があります。

{{< mermaid >}}
graph TD
    na[Node autoscaler]
    k8s[Kubernetes]
    cp[Cloud Provider]

    k8s --> |get Pods/Nodes|na
    na --> |drain Nodes|k8s
    na --> |create/remove resources backing Nodes|cp
    cp --> |get resources backing Nodes|na

    classDef white_on_blue fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef blue_on_white fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class na blue_on_white;
    class k8s,cp white_on_blue;
{{</ mermaid >}}

### オートスケーラーの実装 {#autoscaler-implementations}

[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)と[Karpenter](https://github.com/kubernetes-sigs/karpenter)は、現在[SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling)がスポンサーをしている2つのノードオートスケーラーです。

クラスターユーザーの観点から、どちらのオートスケーラーも同様のノード自動スケーリング体験を提供するはずです。
どちらもスケジュールできないPodのために新しいノードをプロビジョニングし、最適に利用されなくなったノードを統合します。

さまざまなオートスケーラーがこのページで説明されているノード自動スケーリングの範囲外の機能を提供する場合もあり、それらの追加機能はオートスケーラーごとに異なる場合があります。

以下のセクションと個々のオートスケーラーにリンクされたドキュメントを参照して、どのオートスケーラーがユースケースに適しているかを判断してください。

#### Cluster Autoscaler {#cluster-autoscaler}

Cluster Autoscalerは、事前に構成された _ノードグループ_ にノードを追加または削除します。
ノードグループは通常、何らかのクラウドプロバイダーのリソースグループ(最も一般的なのは仮想マシングループ)にマッピングされます。
Cluster Autoscalerの1つのインスタンスで、複数のノードグループを同時に管理できます。
プロビジョニング時には、Cluster Autoscalerは保留中のPodの要求に最も適したグループにノードを追加します。
統合時には、Cluster Autoscalerは基盤となるクラウドプロバイダーのリソースグループのサイズを単に変更するのではなく、削除する特定のノードを常に選択します。

追加のコンテキスト:

* [ドキュメント概要](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md)
* [クラウドプロバイダー連携](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md#faqdocumentation)
* [Cluster Autoscaler FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
* [Contact](https://github.com/kubernetes/community/tree/master/sig-autoscaling#contact)

#### Karpenter {#karpenter}

Karpenterは、クラスター運用者によって提供される[NodePool](https://karpenter.sh/docs/concepts/nodepools/)構成に基づいてノードを自動プロビジョニングします。
Karpenterは、自動スケーリングだけでなく、ノードのライフサイクルのあらゆる側面を処理します。
これには、特定のライフタイムに達したノードの自動更新や、新しいワーカーノードイメージがリリースされたときのノードの自動アップグレードが含まれます。
Karpenterは、個々のクラウドプロバイダーリソース(最も一般的なのは個々の仮想マシン)と直接連携し、クラウドプロバイダーのリソースグループに依存しません。

追加のコンテキスト:

* [ドキュメント](https://karpenter.sh/)
* [クラウドプロバイダー連携](https://github.com/kubernetes-sigs/karpenter?tab=readme-ov-file#karpenter-implementations)
* [Karpenter FAQ](https://karpenter.sh/docs/faq/)
* [Contact](https://github.com/kubernetes-sigs/karpenter#community-discussion-contribution-and-support)

#### 実装の比較 {#implementation-comparison}

CarpenterとCluster Autoscalerの主な違い:

* Cluster Autoscalerは、ノードの自動スケーリングに関連する機能のみを提供します。
  Karpenterはより広範囲であり、ノードのライフサイクル全体を管理すること(たとえば、特定のライフタイムに達したノードを自動的に再作成したり、新しいバージョンに自動的にアップグレードしたりするなど)を目的とした機能も提供します。
* Cluster Autoscalerは、自動プロビジョニングをサポートしておらず、プロビジョニングできるノードグループは事前に構成する必要があります。
  Karpeterは、自動プロビジョニングをサポートしているため、ユーザーは均質なグループを完全に構成するのではなく、プロビジョニングされるノードの制約セットを構成するだけで済みます。
* Cluster Autoscalerは、クラウドプロバイダーとの連携機能を直接提供し、Kubernetesプロジェクトの一部となっています。
  Karpenterの場合、KuberentesプロジェクトはKarpenterをライブラリとして公開しており、クラウドプロバイダーはこのライブラリと連携してノードオートスケーラーを構築できます。
* Cluster Autoscalerは、小規模であまり知られていないプロバイダーを含む多数のクラウドプロバイダーとの連携機能を提供します。
  Karpenterと連携できるクラウドプロバイダーは、[AWS](https://github.com/aws/karpenter-provider-aws)や[Azure](https://github.com/Azure/karpenter-provider-azure)など、より少数です。

## ワークロードとノードの自動スケーリングを組み合わせる {#combine-workload-and-node-autoscaling}

### 水平ワークロードの自動スケーリング {#horizontal-workload-autoscaling}

ノードの自動スケーリングは通常、Podに応じて機能します。
つまり、スケジュールできないPodを収容するために新しいノードをプロビジョニングし、不要になったらノードを統合します。

[水平ワークロードの自動スケーリング](/docs/concepts/workloads/autoscaling#scaling-workloads-horizontally)は、ワークロードのレプリカ数を自動的に調整し、レプリカ全体で望ましい平均リソース使用率を維持します。
言い換えると、アプリケーション負荷に応じて新しいPodを自動的に作成し、負荷が減少するとPodを削除します。

ノードの自動スケーリングを水平ワークロードの自動スケーリングと組み合わせて使用することで、Podの実際の平均リソース使用率に基づいてクラスター内のノードを自動スケーリングできます。

アプリケーション負荷が増加すると、そのPodの平均使用率も増加し、ワークロードの自動スケーリングによって新しいPodが作成されます。
その後、ノードの自動スケーリングは、新しいPodを収容するために新しいノードをプロビジョニングします。

アプリケーション負荷が減少すると、ワークロードの自動スケーリングによって不要なPodが削除されます。
また、ノードの自動スケーリングによって、不要になったノードが統合されるはずです。

このパターンが正しく構成されている場合、アプリケーションは必要に応じて負荷の急増に対応するためのノードキャパシティを常に保ちますが、必要ないキャパシティに対して料金を支払う必要はありません。

### 垂直ワークロードの自動スケーリング {#vertical-workload-autoscaling}

ノードの自動スケーリングを使用する場合、Podのリソース要求を正しく設定することが重要です。
特定のPodの要求が低すぎると、新しいノードをプロビジョニングしても、実際にはPodの実行に役立たない可能性があります。
特定のPodの要求が高すぎると、ノードの統合を誤って妨げる可能性があります。

[垂直ワークロードの自動スケーリング](/docs/concepts/workloads/autoscaling#scaling-workloads-vertically)は、過去のリソース使用量に基づいてPodのリソース要求を自動的に調整します。

ノードの自動スケーリングと垂直ワークロードの自動スケーリングを組み合わせて使用することで、クラスター内のノードの自動スケーリング機能を維持しながら、Podのリソース要求を調整できます。

{{< caution >}}
ノードの自動スケーリングを使用する場合、DaemonSetのPodに対して垂直ワークロードの自動スケーリングを設定することは推奨されていません。
オートスケーラーは、使用可能なノードリソースを予測するために、新しいノード上のDaemonSetのPodの状態を予測する必要があります。
垂直ワークロードの自動スケーリングは、これらの予測の信頼性を低下させ、誤ったスケーリングの決定につながる可能性があります。
{{</ caution >}}

## 関連コンポーネント {#related-components}

このセクションでは、ノードの自動スケーリングに関連する機能を提供するコンポーネントについて説明します。

### Descheduler {#descheduler}

[descheduler](/docs/concepts/scheduling-eviction/descheduler/)は、カスタムポリシーに基づいてノードの統合機能を提供するコンポーネントであり、ノードとPodの最適化に関連するその他の機能(たとえば、頻繁に再起動するPodの削除)も提供します。

### クラスターサイズに基づくワークロードオートスケーラー {#workload-autoscalers-based-on-cluster-size}

[Cluster Proportional Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)と[Cluster Proportional Vertical Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler)は、クラスター内のノード数に基づいて水平または垂直ワークロードの自動スケーリングを提供します。
[クラスターサイズに基づく自動スケーリング](/docs/concepts/workloads/autoscaling#autoscaling-based-on-cluster-size)で詳細を読むことができます。

## {{% heading "whatsnext" %}}

- [ワークロードレベルの自動スケーリング](/docs/concepts/workloads/autoscaling/)について読む