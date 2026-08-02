---
title: トポロジーを考慮したワークロードのスケジューリング
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

*トポロジーを考慮したスケジューリング*（Topology-Aware Scheduling, TAS）は、対象となるPodGroupの最適な配置を見つけ、
すべてのPodが同じトポロジードメイン内に配置されることを保証する[配置スケジューリングアルゴリズム](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm)です。
ユーザーはTASプラグインの構成を変更することで、TASを固有の要件に合わせて調整できます。

## スケジューリングフレームワーク: TASプラグインの構成

スケジューラーには、TASの拡張ポイントを実装する、新規または拡張された以下のツリー内プラグインが含まれています:

* `TopologyPlacement`: `PlacementGeneratePlugin`インターフェイスを実装します。
  PodGroupで定義されたトポロジーの`key`の値ごとにノードをグループ化し、配置候補を生成します。

* `NodeResourcesFit`: `PlacementScorePlugin`インターフェイスを実装するように拡張されています。
  標準的なPodのビンパッキングと同様のロジックに従い、配置内のすべてのノードにおける割り当て率に基づいて配置をスコアリングします。
  配置内のリソース使用率を最大化するために`MostAllocated`戦略を使用し、標準のPod単位のプラグイン設定からリソースの重みを継承します。

* `PodGroupPodsCount`: `PlacementScorePlugin`インターフェイスを実装します。
  正常にスケジュールできるPodGroup内のPodの合計数に基づいて、配置候補をスコアリングします。

### プラグインの重みとビンパッキングのリソースの重みをカスタマイズする

デフォルトでは、ビンパッキングのロジックと、できるだけ多くのPodをスケジュールすることの間で適切なバランスを保つために、
`NodeResourcesFit`プラグインと`PodGroupPodsCount`プラグインには同じ重み（どちらもデフォルトは1）が設定されています。

KubeSchedulerConfigurationでは、これらのプラグインの重みやビンパッキング戦略で使用するリソースの重みを調整できます。
以下の例では、両方のプラグインの重みを変更する方法と、`NodeResourcesFit`のリソースの重みを上書きする方法を示しています。
後者の変更は、Pod単位のスコアリングアルゴリズムと配置スコアリングアルゴリズムの両方に適用されます:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
    plugins:
      placementScore:
        enabled:
          # 1) 配置スコアプラグインのデフォルトの重みを変更する
          - name: NodeResourcesFit
            weight: 2
          - name: PodGroupPodsCount
            weight: 5
    pluginConfig:
      - name: NodeResourcesFit
        args:
          # 2) Pod単位および配置スコアリングの両方のアルゴリズムで、
          # スコアリング対象となるリソースの重みを変更する
          scoringStrategy:
            # typeはPod単位のスケジューリングでのみ考慮される
            # 配置スコアリングでは常にMostAllocated戦略が使用される
            type: LeastAllocated
            # リソースの重みは、Pod単位および配置スコアリングの両方のアルゴリズムで使用される
            resources:
              - name: cpu
                weight: 2
              - name: memory
                weight: 3
```

## {{% heading "whatsnext" %}}

* [トポロジーを考慮したスケジューリングAPI](/docs/concepts/workloads/workload-api/topology-aware-scheduling/)についてさらに学ぶ。
* [Podグループのスケジューリング](/docs/concepts/scheduling-eviction/podgroup-scheduling/)について読む。
* [Podグループポリシー](/docs/concepts/workloads/workload-api/policies/)について読む。
