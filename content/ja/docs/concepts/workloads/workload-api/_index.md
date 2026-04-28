---
title: "Workload API"
weight: 20
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Workload APIリソースを使用すると、複数のPodで構成されるアプリケーションについて、スケジューリング要件とPodのグループ構成を記述できます。
ワークロードコントローラーはワークロードのランタイム動作を提供しますが、Workload APIはJobなどの「真の」ワークロードに対して、スケジューリング制約を提供することを目的としています。

<!-- body -->

## Workloadとは {#what-is-a-workload}

Workload APIリソースは、`scheduling.k8s.io/v1alpha1` {{< glossary_tooltip text="APIグループ" term_id="api-group" >}}の一部です(このAPIを利用するには、クラスターで、そのAPIグループと`GenericWorkload`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)の両方を有効にする必要があります)。
このリソースは、複数のPodで構成されるアプリケーションのスケジューリング要件を、構造化された機械可読な形式で定義します。
[Job](/docs/concepts/workloads/controllers/job/)のようなユーザー向けのワークロードは何を実行するかを定義します。
一方で、Workloadリソースは、Podのグループをどのようにスケジュールし、ライフサイクル全体を通じてその配置をどう管理するかを決定します。

## APIの構造 {#api-structure}

Workloadを使用すると、Podのグループを定義し、それらにスケジューリングポリシーを適用できます。
これは、Podグループのリストとコントローラーへの参照という2つのセクションで構成されます。

### Podグループ {#pod-groups}

`podGroups`リストは、ワークロードの個別のコンポーネントを定義します。
たとえば、機械学習ジョブには`driver`グループと`worker`グループがある場合があります。

`podGroups`の各エントリには以下が必要です:
1. Podの[Workload参照](/docs/concepts/workloads/pods/workload-reference/)で使用できる一意の`name`
2. [スケジューリングポリシー](/docs/concepts/workloads/workload-api/policies/)(`basic`または`gang`)

```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job
  podGroups:
  - name: workers
    policy:
      gang:
        # gangは4つのPodが同時に実行できる場合にのみスケジュール可能
        minCount: 4
```

### ワークロード管理オブジェクトの参照 {#referencing-a-workload-controlling-object}

`controllerRef`フィールドは、Workloadを[Job](/docs/concepts/workloads/controllers/job/)やカスタムCRDなど、アプリケーションを定義する上位のオブジェクトに紐づけます。
これは可観測性とツールの利用に役立ちます。
このデータは、Workloadのスケジューリングや管理には使用されません。

## {{% heading "whatsnext" %}}

* Podで[Workloadを参照する方法](/docs/concepts/workloads/pods/workload-reference/)を確認する。
* [Podグループポリシー](/docs/concepts/workloads/workload-api/policies/)について学ぶ。
* [gangスケジューリング](/docs/concepts/scheduling-eviction/gang-scheduling/)アルゴリズムについて読む。
