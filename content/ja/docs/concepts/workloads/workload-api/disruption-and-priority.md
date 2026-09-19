---
title: PodGroupの中断と優先度
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

PodGroupは中断モードを宣言できます。
このモードは、より優先度の高いPodGroupを配置する場合などに、スケジューラーが実行中のPodGroupをどのように中断できるかを定めます。
また、PodGroupには優先度があり、[ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)の際には、グループ内の各Podの優先度に代わって適用されます。

<!-- body -->

## 中断モードの種類 {#disruption-mode-types}

{{< note >}}
v1.36では、PodGroupの`priority`または`disruptionMode`フィールドは、[ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)でのみ考慮されます。
Podのスケジューリングフェーズでは、スケジューラーはPodGroupの`priority`や`disruptionMode`フィールドを考慮しません。
この制限はv1.37では適用されなくなりました。
{{< /note >}}

APIは`Single`と`All`の2つの中断モードをサポートしています。
デフォルトは`Single`です。

### Single

`Single`モードは、グループ内のすべてのPodを独立したエンティティとして扱うようスケジューラーに指示し、PodGroup内の単一のPodを個別に中断できるようにします。

### All

`All`モードでは、中断を「全か無か」として扱います。
PodGroup内のすべてのPodをまとめて中断するよう、スケジューラーに指示します。

## CompositePodGroup

{{< feature-state feature_gate_name="CompositePodGroup" >}}

CompositePodGroupも仕様で`disruptionMode`を宣言できます。
これは、プリエンプションイベント中にスケジューラーがCompositePodGroup内の子グループをどのように中断するかを制御します。

APIはCompositePodGroupに対して2つの中断モードをサポートしています:

- **`Single`**: CompositePodGroup内の個々の子グループを、プリエンプション中に個別に中断できます。
- **`All`**: CompositePodGroup階層全体で「全か無か」の中断セマンティクスを強制します。
  このCompositePodGroup配下の階層に含まれるいずれかのPodをプリエンプトする必要がある場合、階層全体のすべてのPodをプリエンプトする必要があります。

指定しない場合、モードはデフォルトで`Single`になります。

{{< note >}}
v1.37では、グループが中断モードを`All`に設定し、子グループのモードを`Single`に設定できます。
この場合、最上位の`All`モードが下位の`Single`モードを上書きします。

この設定はセマンティクスが不明確になるため、推奨されません。
{{< /note >}}

## PodGroupの優先度 {#pod-group-priority}

PodGroupは、単一のPodと同じ[PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)の概念を使用します。
1つ以上のPriorityClassを作成すると、その仕様内でいずれかのPriorityClass名を指定したPodGroupを作成できます。
優先度アドミッションコントローラーは`priorityClassName`フィールドを使用し、優先度の整数値を設定します。
PriorityClassが見つからない場合、PodGroupは拒否されます。
PodGroupに`priorityClassName`が設定されていない場合、KubernetesはデフォルトのPriorityClass(`globalDefault`がtrueに設定されたPriorityClass)を探します。
`globalDefault`がtrueに設定されたPriorityClassがない場合、`priorityClassName`が指定されていないPodGroupの優先度は0になります。

個々のPodの優先度が異なる場合でも、[ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)の際には、PodGroupの優先度がグループ内のすべてのPodに対して決定的な優先度になります。
この値は、スケジューリングキュー内のPodGroupの順序付けにも使用されます。
PodGroupを構成する個々のPodの優先度がPodGroupの優先度と異なる場合、PodGroupは`all pods in a single pod group should have the same priority as the pod group`というエラーによりスケジュールされません。

[PodGroupPreemptionPolicy](/docs/reference/command-line-tools-reference/feature-gates/podgroup-preemption-policy/)フィーチャーゲートが有効な場合、PodGroupには`preemptionPolicy`フィールドもあります。
このフィールドもPriorityClassから取得されます。
これはグループ内のすべてのPodに対する権限のあるフィールドであり、PodGroupが自身を配置する場所を確保するために、より低い優先度のPodおよびPodGroupをプリエンプトできるかを決定します。
フィーチャーゲートが有効な場合、PodGroup内のすべてのPodはPodGroupと同じ`preemptionPolicy`を持つ必要があります。
そうでない場合、PodGroupは`all pods in a single pod group should have the same preemption policy as the pod group's preemption policy`というエラーによりスケジュールされません。
PodGroupが`preemptionPolicy: Never`の場合、ワークロードを考慮したプリエンプションは実行されません。
フィーチャーゲートが無効な場合、PodGroupを構成するすべてのPodは同じ`preemptionPolicy`を持つ必要があります。
そうでない場合、PodGroupは`all pods in a single pod group should have the same preemption policy`というエラーによりスケジュールされません。

以下のYAMLは、整数の優先度値1000000に対応する`high-priority` PriorityClassを使用するPodGroup設定の例です。
優先度アドミッションコントローラーは仕様を確認し、PodGroupの優先度を1000000に設定します。

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  namespace: ns-1
  name: job-1
spec:
  priorityClassName: high-priority
```

### CompositePodGroupの優先度 {#compositepodgroup-priority}

{{< feature-state feature_gate_name="CompositePodGroup" >}}

CompositePodGroup APIにも`priorityClassName`と`priority`フィールドがあり、優先度アドミッションコントローラーによりPodGroupと同じ方法で解決されます。

ルートCompositePodGroupの優先度は、[ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)イベント中に、その階層内のすべての子グループとPodに対する決定的な優先度として機能します。
単一のグループ階層内のすべてのPodは完全に同じ優先度を共有し、ルートCompositePodGroupの優先度と等しくなければいけません。

優先度の値は、スケジューリングのアクティブキュー内にあるルートCompositePodGroupの順序付けにも使用されます。

{{< note >}}
v1.37では、スケジューラーは非ルートグループの優先度の値がルートCompositePodGroupの優先度と等しいかどうかを検証しません。
{{< /note >}}

### CompositePodGroupのPreemptionPolicy {#preemptionpolicy-in-compositepodgroup}

{{< feature-state feature_gate_name="PodGroupPreemptionPolicy" >}}

CompositePodGroup APIにも`preemptionPolicy`フィールドがあり、PodGroup APIとまったく同じ方法で解決されます。

ルートCompositePodGroupの`preemptionPolicy`の値により、必要に応じてスケジューリング中にそのPodを配置するために[ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)を実行できるかどうかが決まります:

- `PreemptLowerPriority`ポリシーは、より低い優先度の犠牲対象をプリエンプトできます。
- `Never`ポリシーは、そのルートCompositePodGroupに対するワークロードを考慮したプリエンプションを無効にします。

単一のグループ階層内のすべてのPodは、ルートCompositePodGroupのプリエンプションポリシーと等しい、完全に同じプリエンプションポリシーを共有しなければなりません。

フィーチャーゲートが無効な場合、グループ階層に属するいずれかのPodの`preemptionPolicy`が`Never`に設定されていない限り、ルートCompositePodGroupはプリエンプションを実行できます。

{{< note >}}
v1.37では、フィーチャーゲートが有効な場合、スケジューラーは非ルートグループのプリエンプションポリシーがルートCompositePodGroupのプリエンプションポリシーと等しいかどうかを検証しません。
{{< /note >}}

## {{% heading "whatsnext" %}}

* [ワークロードを考慮したプリエンプション](/docs/concepts/scheduling-eviction/workload-aware-preemption/)について読む。
* [Workload API](/docs/concepts/workloads/workload-api/)について学ぶ。
* 中断モードのビルディングブロックを含む、[スケジューリングのビルディングブロックとworkloadbuilderライブラリ](/docs/concepts/workloads/workload-api/workloadbuilder/)について学ぶ。
