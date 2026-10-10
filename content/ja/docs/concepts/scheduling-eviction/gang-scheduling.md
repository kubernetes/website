---
title: Gangスケジューリング
content_type: concept
weight: 70
---

<!-- overview -->
{{< feature-state feature_gate_name="GangScheduling" >}}

Gangスケジューリングは、Podのグループを「全か無か」の原則でスケジュールすることを保証します。
クラスターがグループ全体(または、定義された最小数のPod)を収容できない場合、どのPodもノードにバインドされません。

この機能は[Workload API](/docs/concepts/workloads/workload-api/)に依存しています。
クラスターで[`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)フィーチャーゲートと`scheduling.k8s.io/v1alpha1` {{< glossary_tooltip text="APIグループ" term_id="api-group" >}}が有効になっていることを確認してください。

<!-- body -->

## 動作の仕組み {#how-it-works}

`GangScheduling`プラグインが有効な場合、スケジューラーは[Workload](/docs/concepts/workloads/workload-api/)内の`gang` [Podグループポリシー](/docs/concepts/workloads/workload-api/policies/)に属するPodのライフサイクルを変更します。
このプロセスは、各Podグループとそのレプリカキーごとに独立して実行されます:

1. スケジューラーは、以下の条件をすべて満たすまで、Podを`PreEnqueue`フェーズで保持します:
   * 参照先のWorkloadオブジェクトが作成されている
   * 参照先のPodグループがWorkload内に存在する
   * 特定のグループに対して作成されたPodの数が、少なくとも`minCount`以上である

   これらの条件がすべて満たされるまで、Podはアクティブなスケジューリングキューに入りません。

2. 必要数が満たされると、スケジューラーはグループ内のすべてのPodの配置先を見つけようとします。
   この処理中、割り当てられたすべてのPodは`WaitOnPermit`ゲートで待機します。
   なお、この機能のAlphaフェーズでは、配置先の検索は単一サイクル方式ではなく、Pod単位のスケジューリングに基づいています。

3. スケジューラーが少なくとも`minCount`個のPodに対して有効な配置先を見つけた場合、それらすべてを割り当てられたノードにバインドすることを許可します。
   5分間の固定タイムアウト内にグループ全体の配置先を見つけられない場合、どのPodもスケジュールされません。
   代わりに、クラスターのリソースが空くのを待つため、スケジュール不可能キューに移動され、その間に他のワークロードをスケジュールできるようにします。

## {{% heading "whatsnext" %}}

* [Workload API](/docs/concepts/workloads/workload-api/)について学ぶ。
* Podで[Workloadを参照する方法](/docs/concepts/workloads/pods/workload-reference/)を確認する。