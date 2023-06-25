---
title: 水平Pod自動スケーリング
feature:
  title: 水平スケーリング
  description: >
    シンプルなコマンドやUIを使って、あるいはCPU使用率に基づいて自動的に、アプリケーションをスケールアップやスケールダウンします。
content_type: concept
weight: 90
---

<!-- overview -->

Kubernetesでは、 _HorizontalPodAutoscaler_ は自動的にワークロードリソース({{< glossary_tooltip text="Deployment" term_id="deployment" >}}や{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}など)を更新し、ワークロードを自動的にスケーリングして需要に合わせることを目指します。

水平スケーリングとは、負荷の増加に対応するために、より多くの{{< glossary_tooltip text="Pod" term_id="pod" >}}をデプロイすることを意味します。これは、Kubernetesの場合、既に稼働しているワークロードのPodに対して、より多くのリソース(例:メモリーやCPU)を割り当てることを意味する _垂直_ スケーリングとは異なります。

負荷が減少し、Podの数が設定された最小値より多い場合、HorizontalPodAutoscalerはワークロードリソース(Deployment、StatefulSet、または他の類似のリソース)に対してスケールダウンするよう指示します。

水平Pod自動スケーリングは、スケーリングできないオブジェクト(例:{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}})には適用されません。

HorizontalPodAutoscalerは、Kubernetes APIリソースと{{< glossary_tooltip text="コントローラー" term_id="controller" >}}として実装されています。リソースはコントローラーの動作を決定します。Kubernetes{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}内で稼働している水平Pod自動スケーリングコントローラーは、平均CPU利用率、平均メモリー利用率、または指定した任意のカスタムメトリクスなどの観測メトリクスに合わせて、ターゲット(例:Deployment)の理想的なスケールを定期的に調整します。

水平Pod自動スケーリングの[使用例のウォークスルー](/ja/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)があります。

<!-- body -->

## HorizontalPodAutoscalerの仕組みは？ {#how-does-a-horizontalpodautoscaler-work}

{{< mermaid >}}
graph BT

hpa[Horizontal Pod Autoscaler] --> scale[Scale]

subgraph rc[RC / Deployment]
    scale
end

scale -.-> pod1[Pod 1]
scale -.-> pod2[Pod 2]
scale -.-> pod3[Pod N]

classDef hpa fill:#D5A6BD,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
classDef rc fill:#F9CB9C,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
classDef scale fill:#B6D7A8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
classDef pod fill:#9FC5E8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
class hpa hpa;
class rc rc;
class scale scale;
class pod1,pod2,pod3 pod
{{< /mermaid >}}

図1. HorizontalPodAutoscalerはDeploymentとそのReplicaSetのスケールを制御します。

Kubernetesは水平Pod自動スケーリングを断続的に動作する制御ループとして実装しています(これは連続的なプロセスではありません)。その間隔は[`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)の`--horizontal-pod-autoscaler-sync-period`パラメーターで設定します(デフォルトの間隔は15秒です)。

各期間中に1回、コントローラーマネージャーはHorizontalPodAutoscalerの定義のそれぞれに指定されたメトリクスに対するリソース使用率を照会します。コントローラーマネージャーは`scaleTargetRef`によって定義されたターゲットリソースを見つけ、ターゲットリソースの`.spec.selector`ラベルに基づいてPodを選択し、リソースメトリクスAPI(Podごとのリソースメトリクスの場合)またはカスタムメトリクスAPI(他のすべてのメトリクスの場合)からメトリクスを取得します。

- Podごとのリソースメトリクス(CPUなど)の場合、コントローラーはHorizontalPodAutoscalerによってターゲットとされた各PodのリソースメトリクスAPIからメトリクスを取得します。その後、使用率の目標値が設定されている場合、コントローラーは各Pod内のコンテナの同等の[リソース要求](/ja/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)に対する割合として使用率を算出します。生の値の目標値が設定されている場合、生のメトリクス値が直接使用されます。次に、コントローラーはすべてのターゲットとなるPod間で使用率または生の値(指定されたターゲットのタイプによります)の平均を取り、理想のレプリカ数でスケールするために使用される比率を生成します。

    Podのコンテナの一部に関連するリソース要求が設定されていない場合、PodのCPU利用率は定義されず、オートスケーラーはそのメトリクスに対して何も行動を起こしません。オートスケーリングアルゴリズムの動作についての詳細は、以下の[アルゴリズムの詳細](#algorithm-details)をご覧ください。

- Podごとのカスタムメトリクスについては、コントローラーはPodごとのリソースメトリクスと同様に機能しますが、使用率の値ではなく生の値で動作します。

- オブジェクトメトリクスと外部メトリクスについては、問題となるオブジェクトを表す単一のメトリクスが取得されます。このメトリクスは目標値と比較され、上記のような比率を生成します。`autoscaling/v2` APIバージョンでは、比較を行う前にこの値をPodの数で割ることもできます。

HorizontalPodAutoscalerを使用する一般的な目的は、{{< glossary_tooltip text="集約API" term_id="aggregation-layer" >}}(`metrics.k8s.io`、`custom.metrics.k8s.io`、または`external.metrics.k8s.io`)からメトリクスを取得するように設定することです。`metrics.k8s.io` APIは通常、別途起動する必要があるMetrics Serverというアドオンによって提供されます。リソースメトリクスについての詳細は、[Metrics Server](/ja/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#メトリクスサーバー)をご覧ください。

[メトリクスAPIのサポート](#support-for-metrics-apis)は、これらの異なるAPIの安定性の保証とサポート状況を説明します。

HorizontalPodAutoscalerコントローラーは、スケーリングをサポートするワークロードリソース(DeploymentやStatefulSetなど)にアクセスします。これらのリソースはそれぞれ`scale`というサブリソースを持っており、これはレプリカの数を動的に設定し、各々の現在の状態を調べることができるインターフェースを提供します。Kubernetes APIのサブリソースに関する一般的な情報については、[Kubernetes API Concepts](/docs/reference/using-api/api-concepts/)をご覧ください。

## アルゴリズムの詳細 {#algorithm-details}

最も基本的な観点から言えば、HorizontalPodAutoscalerコントローラーは、理想のメトリクス値と現在のメトリクス値との間の比率で動作します:

```
desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]
```

たとえば、現在のメトリクス値が`200m`で、理想の値が`100m`の場合、レプリカの数は倍増します。なぜなら、`200.0 / 100.0 == 2.0`だからです。現在の値が`50m`の場合、レプリカの数は半分になります。なぜなら、`50.0 / 100.0 == 0.5`だからです。コントロールプレーンは、比率が十分に1.0に近い場合(全体的に設定可能な許容範囲内、デフォルトでは0.1)には、任意のスケーリング操作をスキップします。

`targetAverageValue`または`targetAverageUtilization`が指定されている場合、`currentMetricValue`は、HorizontalPodAutoscalerのスケールターゲット内のすべてのPodで指定されたメトリクスの平均を取ることで計算されます。

許容範囲を確認し、最終的な値を決定する前に、コントロールプレーンは、メトリクスが欠けていないか、また何個のPodが[`Ready`](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)状態であるかを考慮します。削除タイムスタンプが設定されているすべてのPod(削除タイムスタンプがあるオブジェクトはシャットダウンまたは削除の途中です)は無視され、失敗したPodはすべて破棄されます。

特定のPodがメトリクスを欠いている場合、それは後で検討するために取っておかれます。メトリクスが欠けているPodは、最終的なスケーリング量の調整に使用されます。

CPUに基づいてスケーリングする場合、任意のPodがまだReadyになっていない(まだ初期化中か、おそらくunhealthy)、*または*PodがReadyになる前の最新のメトリクスポイントがある場合、そのPodも取り置かれます。

技術的な制約により、HorizontalPodAutoscalerコントローラーは特定のCPUメトリクスを取り置くかどうかを判断する際に、Podが初めてReadyになる時間を正確に決定することができません。その代わり、Podが起動してから設定可能な短い時間内にReadyに遷移した場合、それを「まだReadyになっていない」とみなします。この値は、`--horizontal-pod-autoscaler-initial-readiness-delay`フラグで設定し、デフォルトは30秒です。Podが一度Readyになると、起動してから設定可能な長い時間内に発生した場合、それが最初のReadyへの遷移だとみなします。この値は、`--horizontal-pod-autoscaler-cpu-initialization-period`フラグで設定し、デフォルトは5分です。

次に、上記で取り置かれたり破棄されたりしていない残りのPodを使用して、`currentMetricValue / desiredMetricValue`の基本スケール比率が計算されます。

メトリクスが欠けていた場合、コントロールプレーンは平均値をより保守的に再計算し、スケールダウンの場合はそのPodが理想の値の100%を消費していたと仮定し、スケールアップの場合は0%を消費していたと仮定します。これにより、潜在的なスケールの大きさが抑制されます。

さらに、まだReadyになっていないPodが存在し、欠けているメトリクスやまだReadyになっていないPodを考慮せずにワークロードがスケールアップした場合、コントローラーは保守的にまだReadyになっていないPodが理想のメトリクスの0%を消費していると仮定し、スケールアップの大きさをさらに抑制します。

まだReadyになっていないPodと欠けているメトリクスを考慮に入れた後、コントローラーは使用率の比率を再計算します。新しい比率がスケールの方向を逆転させるか、許容範囲内である場合、コントローラーはスケーリング操作を行いません。その他の場合、新しい比率がPodの数の変更を決定するために使用されます。

新しい使用率の比率が使用されたときであっても、平均使用率の元の値は、まだReadyになっていないPodや欠けているメトリクスを考慮せずに、HorizontalPodAutoscalerのステータスを通じて報告されることに注意してください。

HorizontalPodAutoscalerに複数のメトリクスが指定されている場合、この計算は各メトリクスに対して行われ、その後、理想のレプリカ数の最大値が選択されます。これらのメトリクスのいずれかを理想のレプリカ数に変換できない場合(例えば、メトリクスAPIからのメトリクスの取得エラーが原因)、そして取得可能なメトリクスがスケールダウンを提案する場合、スケーリングはスキップされます。これは、1つ以上のメトリクスが現在の値よりも大きな`desiredReplicas`を示す場合でも、HPAはまだスケーリングアップ可能であることを意味します。

最後に、HPAがターゲットを減らす直前に、減らす台数の推奨値が記録されます。コントローラーは、設定可能な時間内のすべての推奨値を考慮し、その時間内で最も高い推奨値を選択します。この値は、`--horizontal-pod-autoscaler-downscale-stabilization`フラグを使用して設定でき、デフォルトは5分です。これは、スケールダウンが徐々に行われ、急速に変動するメトリクス値の影響を滑らかにすることを意味します。

## APIオブジェクト {#api-object}

Horizontal Pod Autoscalerは、Kubernetesの`autoscaling` APIグループのAPIリソースです。現行の安定バージョンは、メモリーおよびカスタムメトリクスに対するスケーリングのサポートを含む`autoscaling/v2` APIバージョンに見つけることができます。`autoscaling/v2`で導入された新たなフィールドは、`autoscaling/v1`で作業する際にアノテーションとして保持されます。

HorizontalPodAutoscaler APIオブジェクトを作成するときは、指定された名前が有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)であることを確認してください。APIオブジェクトについての詳細は、[HorizontalPodAutoscaler Object](/docs/reference/generated/kubernetes-api/v1.27/#horizontalpodautoscaler-v2-autoscaling)で見つけることができます。

## ワークロードスケールの安定性 {#flapping}

HorizontalPodAutoscalerを使用してレプリカ群のスケールを管理する際、評価されるメトリクスの動的な性質により、レプリカの数が頻繁に変動する可能性があります。これは、_スラッシング_ または _フラッピング_ と呼ばれることがあります。これは、_サイバネティクス_ における _ヒステリシス_ の概念に似ています。

## ローリングアップデート中の自動スケーリング {#autoscaling-during-rolling-update}

Kubernetesでは、Deploymentに対してローリングアップデートを行うことができます。その場合、Deploymentが基礎となるReplicaSetを管理します。Deploymentに自動スケーリングを設定すると、HorizontalPodAutoscalerを単一のDeploymentに結びつけます。HorizontalPodAutoscalerはDeploymentの`replicas`フィールドを管理します。Deploymentコントローラーは、ロールアウト時およびその後も適切な数になるように、基礎となるReplicaSetの`replicas`を設定する責任があります。

自動スケールされたレプリカ数を持つStatefulSetのローリングアップデートを実行する場合、StatefulSetは直接そのPodのセットを管理します(ReplicaSetのような中間リソースは存在しません)。

## リソースメトリクスのサポート {#support-for-resource-metrics}

HPAの任意のターゲットは、スケーリングターゲット内のPodのリソース使用状況に基づいてスケールすることができます。Podの仕様を定義する際には、`cpu`や`memory`などのリソース要求を指定する必要があります。これはリソースの使用状況を決定するために使用され、HPAコントローラーがターゲットをスケールアップまたはスケールダウンするために使用されます。リソース使用状況に基づくスケーリングを使用するには、以下のようなメトリクスソースを指定します:

```yaml
type: Resource
resource:
  name: cpu
  target:
    type: Utilization
    averageUtilization: 60
```

このメトリクスを使用すると、HPAコントローラーはスケーリングターゲット内のPodの平均使用率を60％に保ちます。使用率は、Podの要求したリソースに対する現在のリソース使用量の比率です。使用率がどのように計算され、平均化されるかの詳細については、[アルゴリズム](#algorithm-details)を参照してください。

{{< note >}}
全てのコンテナのリソース使用量が合算されるため、全体のPodの利用率は個々のコンテナのリソース使用量を正確に反映しないかもしれません。これにより、単一のコンテナが高い使用率で稼働していても、全体のPodの使用率が依然として許容範囲内であるため、HPAがスケールアウトしない状況が生じる可能性があります。
{{< /note >}}

### コンテナリソースメトリクス {#container-resource-metrics}

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

HorizontalPodAutoscaler APIは、コンテナメトリクスソースもサポートしています。これは、ターゲットリソースをスケールするために、HPAが一連のPod内の個々のコンテナのリソース使用状況を追跡できるようにするものです。これにより、特定のPodで最も重要なコンテナのスケーリング閾値を設定することができます。例えば、Webアプリケーションとロギングサイドカーがある場合、サイドカーのコンテナとそのリソース使用を無視して、Webアプリケーションのリソース使用に基づいてスケーリングすることができます。

ターゲットリソースを新しいPodの仕様に修正し、異なるコンテナのセットを持つようにした場合、新たに追加されたコンテナもスケーリングに使用されるべきであれば、HPAの仕様も修正すべきです。メトリクスソースで指定されたコンテナが存在しないか、または一部のPodのみに存在する場合、それらのPodは無視され、推奨が再計算されます。計算に関する詳細は、[アルゴリズム](#algorithm-details)を参照してください。コンテナリソースを自動スケーリングに使用するためには、以下のようにメトリクスソースを定義します:

```yaml
type: ContainerResource
containerResource:
  name: cpu
  container: application
  target:
    type: Utilization
    averageUtilization: 60
```

上記の例では、HPAコントローラーはターゲットをスケールし、すべてのPodの`application`コンテナ内のCPUの平均使用率が60%になるようにします。

{{< note >}}
HorizontalPodAutoscalerが追跡しているコンテナの名前を変更する場合、特定の順序でその変更を行うことで、変更が適用されている間も、スケーリングが利用可能で有効なままであることが保証されます。コンテナを定義するリソース(Deploymentなど)を更新する前に、関連するHPAを更新して新旧のコンテナ名を両方追跡するようにします。これにより、HPAはアップデートプロセス全体でスケーリングの推奨を計算することができます。

コンテナ名の変更をワークロードリソースにロールアウトしたら、HPAの仕様から古いコンテナ名を削除して片付けます。
{{< /note >}}

## カスタムメトリクスでのスケーリング {#scaling-on-custom-metrics}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

(以前の`autoscaling/v2beta2` APIバージョンでは、これをベータ機能として提供していました)

`autoscaling/v2` APIバージョンを使用することで、HorizontalPodAutoscalerをカスタムメトリクス(KubernetesまたはKubernetesのコンポーネントに組み込まれていない)に基づいてスケールするように設定することができます。その後、HorizontalPodAutoscalerコントローラーはこれらのカスタムメトリクスをKubernetes APIからクエリします。

要件については、[メトリクスAPIのサポート](#support-for-metrics-apis)を参照してください。

## 複数メトリクスでのスケーリング {#scaling-on-multiple-metrics}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

(以前の`autoscaling/v2beta2` APIバージョンでは、これをベータ機能として提供していました)

`autoscaling/v2` APIバージョンを使用することで、HorizontalPodAutoscalerがスケールするための複数のメトリクスを指定することができます。その後、HorizontalPodAutoscalerコントローラーは各メトリクスを評価し、そのメトリクスに基づいた新しいスケールを提案します。HorizontalPodAutoscalerは、各メトリクスで推奨される最大のスケールを取得し、そのサイズにワークロードを設定します(ただし、これが設定した全体の最大値を超えていないことが前提です)。

## メトリクスAPIのサポート {#support-for-metrics-apis}

デフォルトでは、HorizontalPodAutoscalerコントローラーは一連のAPIからメトリクスを取得します。これらのAPIにアクセスするためには、クラスター管理者が以下を確認する必要があります:

- [API集約レイヤー](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)が有効になっていること。

- 対応するAPIが登録されていること:

    - リソースメトリクスの場合、これは一般的に[metrics-server](https://github.com/kubernetes-sigs/metrics-server)によって提供される`metrics.k8s.io` APIです。クラスターの追加機能として起動することができます。

    - カスタムメトリクスの場合、これは`custom.metrics.k8s.io` APIです。これはメトリクスソリューションベンダーが提供する「アダプター」APIサーバーによって提供されます。利用可能なKubernetesメトリクスアダプターがあるかどうかは、メトリクスパイプラインで確認してください。
    
    - 外部メトリクスの場合、これは`external.metrics.k8s.io` APIです。これは上記のカスタムメトリクスアダプターによって提供される可能性があります。

これらの異なるメトリクスパスとその違いについての詳細は、[HPA V2](https://git.k8s.io/design-proposals-archive/autoscaling/hpa-v2.md)、[custom.metrics.k8s.io](https://git.k8s.io/design-proposals-archive/instrumentation/custom-metrics-api.md)、および[external.metrics.k8s.io](https://git.k8s.io/design-proposals-archive/instrumentation/external-metrics-api.md)の関連デザイン提案をご覧ください。

これらの使用方法の例については、[カスタムメトリクスの使用方法](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)と[外部メトリクスの使用方法](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects)をご覧ください。

## 設定可能なスケーリング動作 {#configurable-scaling-behavior}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

(以前の`autoscaling/v2beta2` APIバージョンでは、これをベータ機能として提供していました)

`v2` HorizontalPodAutoscaler APIを使用する場合、`behavior`フィールド([APIリファレンス](/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerSpec)を参照)を使用して、スケールアップとスケールダウンの振る舞いを個別に設定することができます。これらの振る舞いは、`behavior`フィールドの下で`scaleUp`および/または`scaleDown`を設定することにより指定します。

スケーリングターゲットのレプリカ数の[フラッピング](#flapping)を防ぐための _安定化ウィンドウ_ を指定することができます。また、スケーリングポリシーにより、スケーリング中のレプリカの変化率を制御することもできます。

### スケーリングポリシー {#scaling-policies}

1つ以上のスケーリングポリシーをspecの`behavior`セクションで指定することができます。複数のポリシーが指定された場合、デフォルトで最も多くの変更を許可するポリシーが選択されます。次の例は、スケールダウンする際のこの振る舞いを示しています:

```yaml
behavior:
  scaleDown:
    policies:
    - type: Pods
      value: 4
      periodSeconds: 60
    - type: Percent
      value: 10
      periodSeconds: 60
```

`periodSeconds`は、ポリシーが真でなければならない過去の時間を示します。最初のポリシー(_Pods_)では、1分間で最大4つのレプリカをスケールダウンできます。2つ目のポリシー(_Percent_)では、1分間で現在のレプリカの最大10％をスケールダウンできます。

デフォルトでは、最も多くの変更を許可するポリシーが選択されるため、2つ目のポリシーはPodのレプリカの数が40を超える場合にのみ使用されます。40レプリカ以下の場合、最初のポリシーが適用されます。例えば、レプリカが80あり、ターゲットを10レプリカにスケールダウンしなければならない場合、最初のステップでは8レプリカが減少します。次のイテレーションでは、レプリカの数が72で、ポッドの10％は7.2ですが、数値は8に切り上げられます。オートスケーラーコントローラーの各ループで、変更するべきPodの数は現在のレプリカの数に基づいて再計算されます。レプリカの数が40以下になると、最初のポリシー(_Pods_)が適用され、一度に4つのレプリカが減少します。

ポリシーの選択は、スケーリング方向の`selectPolicy`フィールドを指定することで変更できます。この値を`Min`に設定すると、レプリカ数の最小変化を許可するポリシーが選択されます。この値を`Disabled`に設定すると、その方向へのスケーリングが完全に無効になります。

### 安定化ウィンドウ {#stabilization-window}

安定化ウィンドウは、スケーリングに使用されるメトリクスが常に変動する場合のレプリカ数の[フラッピング](#flapping)を制限するために使用されます。自動スケーリングアルゴリズムは、このウィンドウを使用して以前の望ましい状態を推測し、ワークロードスケールへの望ましくない変更を避けます。

例えば、次の例のスニペットでは、`scaleDown`に対して安定化ウィンドウが指定されています。

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300
```

メトリクスがターゲットをスケールダウンすべきであることを示すと、アルゴリズムは以前に計算された望ましい状態を探し、指定された間隔から最高値を使用します。上記の例では、過去5分間のすべての望ましい状態が考慮されます。

これは移動最大値を近似し、スケーリングアルゴリズムが頻繁にPodを削除して、わずかな時間後に同等のPodの再作成をトリガーするのを防ぎます。

### デフォルトの動作 {#default-behavior}

カスタムスケーリングを使用するためには、全てのフィールドを指定する必要はありません。カスタマイズが必要な値のみを指定することができます。これらのカスタム値はデフォルト値とマージされます。デフォルト値はHPAアルゴリズムの既存の動作と一致します。

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
  scaleUp:
    stabilizationWindowSeconds: 0
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
    - type: Pods
      value: 4
      periodSeconds: 15
    selectPolicy: Max
```

スケールダウンの場合、安定化ウィンドウは300秒(`--horizontal-pod-autoscaler-downscale-stabilization`フラグが指定されている場合はその値)です。スケールダウンのための単一のポリシーがあり、現在稼働しているレプリカの100%を削除することが許可されています。これは、スケーリングターゲットが最小許容レプリカ数まで縮小されることを意味します。スケールアップの場合、安定化ウィンドウはありません。メトリクスがターゲットをスケールアップするべきであることを示すと、ターゲットはすぐにスケールアップされます。2つのポリシーがあり、HPAが安定状態に達するまで、最大で15秒ごとに4つのポッドまたは現在稼働しているレプリカの100%が追加されます。

### 例: ダウンスケール安定化ウィンドウの変更 {#example-change-downscale-stabilization-window}

1分間のカスタムダウンスケール安定化ウィンドウを提供するには、HPAに以下の動作を追加します:

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 60
```

### 例: スケールダウン率の制限 {#example-limit-scale-down-rate}

HPAによるPodの除去率を毎分10％に制限するには、HPAに以下の動作を追加します:

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
```

1分あたりに削除されるPodが5つを超えないようにするために、固定サイズ5の2番目のスケールダウンポリシーを追加し、`selectPolicy`を最小に設定することができます。`selectPolicy`を`Min`に設定すると、オートスケーラーは最少数のPodに影響を与えるポリシーを選択します:

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
    - type: Pods
      value: 5
      periodSeconds: 60
    selectPolicy: Min
```

### 例: スケールダウンの無効化 {#example-disable-scale-down}

`selectPolicy`の値が`Disabled`の場合、指定された方向のスケーリングをオフにします。したがって、スケールダウンを防ぐには、次のようなポリシーが使われます:

```yaml
behavior:
  scaleDown:
    selectPolicy: Disabled
```

## kubectlにおけるHorizontalPodAutoscalerのサポート {#support-for-horizontalpodautoscaler-in-kubectl}

HorizontalPodAutoscalerは、他のすべてのAPIリソースと同様に`kubectl`によって標準的にサポートされています。`kubectl create`コマンドを使用して新しいオートスケーラーを作成することができます。`kubectl get hpa`を使用してオートスケーラーを一覧表示したり、`kubectl describe hpa`を使用して詳細な説明を取得したりできます。最後に、`kubectl delete hpa`を使用してオートスケーラーを削除することができます。

さらに、HorizontalPodAutoscalerオブジェクトを作成するための特別な`kubectl autoscale`コマンドがあります。例えば、`kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80`を実行すると、ReplicaSet fooのオートスケーラーが作成され、ターゲットのCPU使用率が`80%`に設定され、レプリカ数は2から5の間になります。

## 暗黙のメンテナンスモードの非活性化 {#implicit-maintenance-mode-deactivation}

HPAの設定自体を変更することなく、ターゲットのHPAを暗黙的に非活性化することができます。ターゲットの理想のレプリカ数が0に設定され、HPAの最小レプリカ数が0より大きい場合、HPAはターゲットの調整を停止します(そして、自身の`ScalingActive`条件を`false`に設定します)。これは、ターゲットの理想のレプリカ数またはHPAの最小レプリカ数を手動で調整して再活性化するまで続きます。

### DeploymentとStatefulSetを水平自動スケーリングへ移行する {#migrating-deployments-and-statefulsets-to-horizontal-autoscaling}

HPAが有効になっている場合、Deploymentおよび/またはStatefulSetの`spec.replicas`の値をその{{< glossary_tooltip text="マニフェスト" term_id="manifest" >}}から削除することが推奨されます。これを行わない場合、たとえば`kubectl apply -f deployment.yaml`を介してそのオブジェクトに変更が適用されるたびに、これはKubernetesに現在のPodの数を`spec.replicas`キーの値にスケールするよう指示します。これは望ましくない場合があり、HPAがアクティブなときに問題になる可能性があります。

`spec.replicas`の削除は、このキーのデフォルト値が1であるため(参照: [Deploymentのレプリカ数](/ja/docs/concepts/workloads/controllers/deployment/#レプリカ数))、一度だけPod数が低下する可能性があることに注意してください。更新時に、1つを除くすべてのPodが終了手順を開始します。その後の任意のDeploymentアプリケーションは通常どおり動作し、望む通りのローリングアップデート設定を尊重します。Deploymentをどのように変更しているかによって、以下の2つの方法から1つを選択することでこの低下を回避することができます:

{{< tabs name="fix_replicas_instructions" >}}
{{% tab name="Client Side Apply (これがデフォルトです)" %}}

1. `kubectl apply edit-last-applied deployment/<deployment_name>`
2. エディターで`spec.replicas`を削除します。保存してエディターを終了すると、`kubectl`が更新を適用します。このステップではPod数に変更はありません。
3. これでマニフェストから`spec.replicas`を削除できます。ソースコード管理を使用している場合は、変更をコミットするか、更新の追跡方法に適したソースコードの改訂に関するその他の手順を行います。
4. ここからは`kubectl apply -f deployment.yaml`を実行できます。


{{% /tab %}}
{{% tab name="Server Side Apply" %}}

[サーバーサイド適用](/docs/reference/using-api/server-side-apply/)を使用する場合は、この具体的なユースケースをカバーしている[所有権の移行ガイドライン](/docs/reference/using-api/server-side-apply/#transferring-ownership)に従うことができます。

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

クラスターでオートスケーリングを設定する場合、[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)のようなクラスターレベルのオートスケーラーを実行することも検討してみてください。

HorizontalPodAutoscalerに関する詳細情報:

- [Horizontal Pod Autoscalerウォークスルー](/ja/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)を読む。
- [`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands#autoscale)のドキュメンテーションを読む。
- 独自のカスタムメトリクスアダプターを書きたい場合は、[ボイラープレート](https://github.com/kubernetes-sigs/custom-metrics-apiserver)をチェックして始めてみてください。
- HorizontalPodAutoscalerの[APIリファレンス](/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/)を読む。
