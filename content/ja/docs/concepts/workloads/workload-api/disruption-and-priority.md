---
title: PodGroupの中断と優先度
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="WorkloadAwarePreemption" >}}

PodGroupは中断モードを宣言できます。このモードは、より優先度の高いPodGroupを配置する場合などに、スケジューラーが実行中のPodGroupをどのように中断できるかを定めます。また、PodGroupには優先度があり、[ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)の際には、グループ内の各Podの優先度に代わって適用されます。

<!-- body -->

## 中断モードの種類 {#disruption-mode-types}

{{< note >}}
v1.36以降、PodGroupの`priority`または`disruptionMode`フィールドは、[ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)でのみ考慮されます。Podのスケジューリングフェーズでは、スケジューラーはPodGroupの`priority`や`disruptionMode`フィールドを考慮しません。
{{< /note >}}

APIは`Pod`と`PodGroup`の2つの中断モードをサポートしています。
デフォルトは`Pod`です。

### Pod

`Pod`モードは、グループ内のすべてのPodを独立したエンティティとして扱うようスケジューラーに指示し、PodGroup内の単一のPodを個別に中断できるようにします。

### PodGroup

`PodGroup`モードでは、中断を「全か無か」として扱います。
PodGroup内のすべてのPodをまとめて中断するよう、スケジューラーに指示します。

## PodGroupの優先度 {#pod-group-priority}

PodGroupは、単一のPodと同じ[PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)の概念を使用します。
1つ以上のPriorityClassを作成すると、その仕様内でいずれかのPriorityClass名を指定したPodGroupを作成できます。
優先度アドミッションコントローラーは`priorityClassName`フィールドを使用し、優先度の整数値を設定します。
PriorityClassが見つからない場合、PodGroupは拒否されます。
PodGroupに`priorityClassName`が設定されていない場合、KubernetesはデフォルトのPriorityClass(`globalDefault`がtrueに設定されたPriorityClass)を探します。
`globalDefault`がtrueに設定されたPriorityClassがない場合、`priorityClassName`が指定されていないPodGroupの優先度は0になります。

個々のPodの優先度が異なる場合でも、[ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)の際には、PodGroupの優先度がグループ内のすべてのPodの優先度として扱われます。

以下のYAMLは、整数の優先度値1000000に対応する`high-priority` PriorityClassを使用するPodGroup設定の例です。優先度アドミッションコントローラーは仕様を確認し、PodGroupの優先度を1000000に設定します。

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  namespace: ns-1
  name: job-1
spec:
  priorityClassName: high-priority
```

## {{% heading "whatsnext" %}}

* [ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)について読む。
* [Workload API](/docs/concepts/workloads/workload-api/)について学ぶ。
