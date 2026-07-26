---
title: Workload参照
content_type: concept
weight: 90
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Podを[Workload](/docs/concepts/workloads/workload-api/)オブジェクトに紐づけることで、そのPodがより大きなアプリケーションやグループに属していることを示すことができます。
これにより、スケジューラーは各Podを独立したエンティティとして扱うのではなく、グループとしての要件を考慮してスケジューリングを行います。

<!-- body -->

## Workload参照の指定 {#specifying-a-workload-reference}

[`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)フィーチャーゲートが有効な場合、Podマニフェストで`spec.workloadRef`フィールドを使用できます。
このフィールドは、同じ名前空間内のWorkloadリソースで定義された特定のPodグループへの紐づけを行います。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  workloadRef:
    # 同じ名前空間内のWorkloadオブジェクトの名前
    name: training-job-workload
    # このWorkload内の特定のPodグループの名前
    podGroup: workers
```

### Podグループのレプリカ {#pod-group-replicas}

より複雑なシナリオでは、単一のPodグループを複数の独立したスケジューリング単位に複製できます。
これは、Podの`workloadRef`内で`podGroupReplicaKey`フィールドを使用して実現します。
このキーはラベルとして機能し、論理的なサブグループを作成します。

たとえば、`minCount: 2`のPodグループがあり、4つのPodを作成する場合を考えます。
2つに`podGroupReplicaKey: "0"`を、残り2つに`podGroupReplicaKey: "1"`を設定すると、それぞれ2つのPodから構成される独立した2つのグループとして扱われます。

```yaml
spec:
  workloadRef:
    name: training-job-workload
    podGroup: workers
    # レプリカキー"0"を持つすべてのworkerは、1つのグループとして一緒にスケジュールされます
    podGroupReplicaKey: "0"
```

### 動作 {#behavior}

`workloadRef`を定義すると、Podは参照先のPodグループで定義された[ポリシー](/docs/concepts/workloads/workload-api/policies/)に応じて異なる動作をします。

* 参照先のグループが`basic`ポリシーを使用している場合、Workload参照は主にグループ化のためのラベルとして機能します。
* 参照先のグループが`gang`ポリシーを使用している場合(かつ[`GangScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)フィーチャーゲートが有効な場合)、Podはgangスケジューリングのライフサイクルに入ります。
  この場合、Podはノードにバインドされる前に、グループ内の他のPodが作成され、スケジュールされるのを待ちます。

### 参照が存在しない場合 {#missing-references}

スケジューラーは、配置を決定する前に`workloadRef`を検証します。

Podが、存在しないWorkloadを参照している場合、またはそのWorkload内で定義されていないPodグループを参照している場合、Podは保留状態のままになります。
存在しないWorkloadオブジェクトを作成するか、不足している`PodGroup`定義を含んだWorkloadを再作成するまで、配置の対象とはみなされません。

この動作は、最終的なポリシーが`basic`か`gang`かに関係なく、`workloadRef`を持つすべてのPodに適用されます。
スケジューラーはポリシーを決定するためにWorkload定義を必要とするためです。

## {{% heading "whatsnext" %}}

* [Workload API](/docs/concepts/workloads/workload-api/)について学ぶ。
* [Podグループポリシー](/docs/concepts/workloads/workload-api/policies/)の詳細について読む。
