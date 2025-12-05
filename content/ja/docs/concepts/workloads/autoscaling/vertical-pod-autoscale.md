---
title: 垂直Pod自動スケーリング
feature:
  title: 垂直スケーリング
  description: >
    実際の使用パターンに基づいて、リソース要求と制限を自動的に調整します。
content_type: concept
weight: 90
math: true
---

<!-- overview -->

Kubernetesにおいて、_VerticalPodAutoscaler_ は、ワークロード管理{{< glossary_tooltip text="リソース" term_id="api-resource" >}}({{< glossary_tooltip text="Deployment" term_id="deployment" >}}や{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}など)を自動的に更新し、インフラストラクチャ{{< glossary_tooltip text="リソース" term_id="infrastructure-resource" >}}の[要求と制限](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)を実際の使用状況に合わせて自動的に調整します。

垂直スケーリングとは、リソース需要が増加した際に、ワークロードで既に実行されている{{< glossary_tooltip text="Pod" term_id="pod" >}}に、より多くのリソース(たとえば、メモリやCPUなど)を割り当てる方法です。
これは、_rightsizing_ や、時には _autopilot_ とも呼ばれます。
これは、Kubernetesで負荷を分散するために追加のPodをデプロイする水平スケーリングとは異なります。

リソース使用量が減少し、Podのリソース要求が最適なレベルを上回っている場合、VerticalPodAutoscalerは、ワークロードリソース(Deployment、StatefulSet、または類似のリソース)に指示して、リソース要求を下げ、リソースの浪費を防ぎます。

VerticalPodAutoscalerは、Kubernetes APIリソースおよび{{< glossary_tooltip text="コントローラー" term_id="controller" >}}として実装されています。
リソースがコントローラーの動作を決定します。
Kubernetesデータプレーン内で実行される垂直Pod自動スケーリングコントローラーは、過去のリソース使用率の分析、クラスターで利用可能なリソースの量、およびout-of-memory(OOM)条件などのリアルタイムイベントに基づいて、対象(Deploymentなど)のリソース要求と制限を定期的に調整します。

<!-- body -->

## APIオブジェクト {#api-object}

VerticalPodAutoscalerは、Kubernetesで{{< glossary_tooltip text="カスタムリソース定義" term_id="customresourcedefinition" >}}(CRD)として定義されています。
KubernetesのコアAPIの一部であるHorizontalPodAutoscalerとは異なり、VPAはクラスターに個別にインストールする必要があります。

現在の安定版のAPIバージョンは`autoscaling.k8s.io/v1`です。VPAのインストール方法とAPIの詳細については、[VPA GitHubリポジトリ](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)を参照してください。

## VerticalPodAutoscalerはどのように動作するか? {#how-does-a-verticalpodautoscaler-work}

{{< mermaid >}}
graph BT
    metrics[Metrics Server]
    api[API Server]
    admission[VPA Admission Controller]
    
    vpa_cr[VerticalPodAutoscaler CRD]
    recommender[VPA recommender]
    updater[VPA updater]

    metrics --> recommender
    recommender -->|Stores Recommendations| vpa_cr

    subgraph Application Workload
        controller[Deployment / RC / StatefulSet]
        pod[Pod / Container]
    end

    vpa_cr -->|Checks for changes| updater
    updater -->|Evicts Pod or Updates in place| controller
    controller -->|Requests new Pod| api

    api -->|New Pod Creation| admission
    admission -->|Retrieves latest recommendation| vpa_cr
    admission -->|Injects new resource values| api

    api -->|Creates Pod| controller
    controller -->|New Pod with Optimal Resources| pod

    classDef vpa fill:#9FC5E8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
    classDef crd fill:#D5A6BD,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
    classDef metrics fill:#FFD966,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
    classDef app fill:#B6D7A8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;

    class recommender,updater,admission vpa;
    class vpa_cr crd;
    class metrics metrics;
    class controller,pod app;
{{< /mermaid >}}

図1. VerticalPodAutoscalerは、Deployment内のPodのリソース要求と制限を制御します

Kubernetesは、断続的に実行される複数の協調コンポーネントを通じて垂直Pod自動スケーリングを実装します(継続的なプロセスではありません)。VPAは3つの主要なコンポーネントで構成されています:

* リソース使用量を分析し、推奨値を提供する _recommender_
* Podのリソース要求を、Podを退避させるか、またはその場で変更することで更新する _updater_
* 新しく作成または再作成されたPodにリソース推奨値を適用する、VPA _admission controller_ webhook

各サイクルごとに1回、Recommenderは各VerticalPodAutoscaler定義によって対象とされるPodのリソース使用率を照会します。Recommenderは、`targetRef`で定義された対象リソースを見つけ、対象リソースの`.spec.selector`ラベルに基づいてPodを選択し、リソースメトリクスAPIからメトリクスを取得して、実際のCPUとメモリ消費を分析します。

Recommenderは、VerticalPodAutoscalerによって対象とされる各Podの現在および過去のリソース使用データ(CPUとメモリ)を分析します。調査される要素には以下が含まれます:
- トレンドを特定するための、時間経過に伴う過去の消費パターン
- 十分な余裕を確保するための、ピーク使用量と変動
- 実際の使用量と比較した現在のリソース要求
- Out-of-memory(OOM)イベントおよびその他のリソース関連のインシデント

この分析に基づいて、Recommenderは3種類の推奨値を計算します:
- 目標推奨値(通常の使用に最適なリソース)
- 下限値(最小限の実行可能なリソース)
- 上限値(最大の合理的なリソース)

これらの推奨値は、VerticalPodAutoscalerリソースの`.status.recommendation`フィールドに保存されます。


_updater_ コンポーネントは、VerticalPodAutoscalerリソースを監視し、現在のPodリソース要求を推奨値と比較します。
差異が設定された閾値を超え、更新ポリシーで許可されている場合、updaterは以下のいずれかを実行できます:

- Podを退避させ、新しいリソース要求で再作成をトリガーする(従来のアプローチ)
- クラスターがインプレースPodリソース更新をサポートしている場合、退避せずにその場でPodリソースを更新する

選択される方法は、設定された更新モード、クラスターのケイパビリティ、および必要なリソース変更の種類に依存します。
インプレース更新は、利用可能な場合、Podの中断を回避しますが、変更できるリソースに制限がある場合があります。
updaterは、サービスへの影響を最小限に抑えるためにPodDisruptionBudgetを尊重します。

_admission controller_ は、Podの作成リクエストをインターセプトするmutating webhookとして動作します。
PodがVerticalPodAutoscalerの対象であるかどうかを確認し、対象である場合、Podが作成される前に推奨されるリソース要求と制限を適用します。
これにより、初期デプロイ時、updaterによる退避後、またはスケーリング操作によって作成されたかどうかに関係なく、新しいPodが適切にサイジングされたリソース割り当てで開始されることが保証されます。

VerticalPodAutoscalerは、クラスターにインストールされているKubernetesのメトリクスサーバー{{< glossary_tooltip text="アドオン" term_id="addons" >}}などのメトリクスソースを必要とします。
VPAコンポーネントは、`metrics.k8s.io` APIからメトリクスを取得します。
メトリクスサーバーは、ほとんどのクラスターでデフォルトではデプロイされないため、個別に起動する必要があります。
リソースメトリクスの詳細については、[メトリクスサーバー](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server)を参照してください。

## 更新モード {#update-modes}

VerticalPodAutoscalerは複数の _更新モード_ をサポートしており、リソース推奨値がいつ、どのようにPodに適用されるかを制御することができます。
更新モードは、VPA specの`updatePolicy`内にある`updateMode`フィールドで設定します:

```yaml
---
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"  # Off, Initial, Recreate, InPlaceOrRecreate
```

### Off {#updateMode-Off}

_Off_ 更新モードでは、VPA recommenderは引き続きリソース使用量を分析し、推奨値を生成しますが、これらの推奨値はPodに自動的に適用されません。
推奨値は、VPAオブジェクトの`.status`フィールドにのみ保存されます。

`kubectl`などのツールを使用して、`.status`に含まれる推奨値を表示できます。

### Initial {#updateMode-Initial}

_Initial_ モードでは、VPAはPodが最初に作成されたときにのみリソース要求を設定します。
推奨値が時間とともに変化しても、既に実行中のPodのリソースは更新しません。

### Recreate {#updateMode-Recreate}

_Recreate_ モードでは、VPAは、現在のリソース要求が推奨値と大きく異なる場合、Podを退避させることでPodリソースを積極的に管理します。
Podが退避されると、ワークロードコントローラー(Deployment、StatefulSetなどを管理)が代替のPodを作成し、VPA admission controllerが更新されたリソース要求を新しいPodに適用します。

### InPlaceOrRecreate {#updateMode-InPlaceOrRecreate}

`InPlaceOrRecreate`モードでは、VPAは可能な限りPodを再起動せずにPodリソース要求と制限を更新しようとします。ただし、特定のリソース変更に対してインプレース更新を実行できない場合、VPAはPodの退避にフォールバック(`Recreate`モードと同様)し、ワークロードコントローラーが更新されたリソースで代替のPodを作成できるようにします。

### Auto(非推奨) {#updateMode-Auto}

{{< note >}}
`Auto`更新モードは**VPAバージョン1.4.0から非推奨**です。退避ベースの更新には`Recreate`を、退避フォールバックを伴うインプレース更新には`InPlaceOrRecreate`を使用してください。
{{< /note >}}

`Auto`モードは現在、`Recreate`モードのエイリアスであり、同じように動作します。
これは、将来的に自動更新戦略を拡張できるようにするために導入されました。

## リソースポリシー {#resource-policies}

リソースポリシーを使用すると、VerticalPodAutoscalerが推奨値を生成し、更新を適用する方法を細かく調整できます。
リソース推奨値の境界を設定し、管理するリソースを指定し、Pod内の個々のコンテナに対して異なるポリシーを設定できます。

リソースポリシーは、VPA specの`resourcePolicy`フィールドで定義します:

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"
  resourcePolicy:
    containerPolicies:
    - containerName: "application"
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
      controlledResources:
      - cpu
      - memory
      controlledValues: RequestsAndLimits
```

#### minAllowedとmaxAllowed {#minallowed-and-maxallowed}

これらのフィールドは、VPA推奨値の境界を設定します。
実際の使用データが異なる値を示唆していても、VPAは`minAllowed`を下回る、または`maxAllowed`を上回るリソースを推奨することはありません。

#### controlledResources {#controlledresources}

`controlledResources`フィールドは、VPAがPod内のコンテナに対して管理すべきリソースタイプを指定します。
指定されていない場合、VPAはデフォルトでCPUとメモリの両方を管理します。
VPAが特定のリソースのみを管理するように制限できます。
有効なリソース名には、`cpu`と`memory`が含まれます。

### controlledValues {#controlledvalues}

`controlledValues`フィールドは、VPAがリソース要求、制限、または両方を制御するかどうかを決定します:

RequestsAndLimits
: VPAは要求と制限の両方を設定します。制限は要求に比例してスケーリングされます。これはデフォルトモードです。

RequestsOnly
: VPAは要求のみを設定し、制限は変更されません。制限は尊重され、使用量が制限を超えた場合、スロットリングまたはout-of-memory killをトリガーする可能性があります。

これら2つの概念の詳細については、[要求と制限](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)を参照してください。

## {{% heading "whatsnext" %}}

クラスターで自動スケーリングを設定する場合、適切な数のノードを実行していることを確認するために、[ノードの自動スケーリング](/docs/concepts/cluster-administration/node-autoscaling/)の使用を検討することもお勧めします。
[_水平_ Pod自動スケーリング](/docs/tasks/run-application/horizontal-pod-autoscale/)の詳細についても参照してください。
