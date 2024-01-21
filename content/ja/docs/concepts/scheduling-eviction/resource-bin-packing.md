---
title: 拡張リソースのリソースビンパッキング
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

kube-schedulerでは、優先度関数`RequestedToCapacityRatioResourceAllocation`を使用した、
拡張リソースを含むリソースのビンパッキングを有効化できます。優先度関数はそれぞれのニーズに応じて、kube-schedulerを微調整するために使用できます。

<!-- body -->

## `RequestedToCapacityRatioResourceAllocation`を使用したビンパッキングの有効化

Kubernetesでは、キャパシティー比率への要求に基づいたNodeのスコアリングをするために、各リソースの重みと共にリソースを指定することができます。これにより、ユーザーは適切なパラメーターを使用することで拡張リソースをビンパックすることができ、大規模クラスターにおける希少なリソースを有効活用できるようになります。優先度関数`RequestedToCapacityRatioResourceAllocation`の動作は`RequestedToCapacityRatioArgs`と呼ばれる設定オプションによって変わります。この引数は`shape`と`resources`パラメーターによって構成されます。`shape`パラメーターは`utilization`と`score`の値に基づいて、最も要求が多い場合か最も要求が少ない場合の関数をチューニングできます。`resources`パラメーターは、スコアリングの際に考慮されるリソース名の`name`と、各リソースの重みを指定する`weight`で構成されます。

以下は、拡張リソース`intel.com/foo`と`intel.com/bar`のビンパッキングに`requestedToCapacityRatioArguments`を設定する例になります。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta1
kind: KubeSchedulerConfiguration
profiles:
# ...
  pluginConfig:
  - name: RequestedToCapacityRatio
    args:
      shape:
      - utilization: 0
        score: 10
      - utilization: 100
        score: 0
      resources:
      - name: intel.com/foo
        weight: 3
      - name: intel.com/bar
        weight: 5
```
スケジューラーには、kube-schedulerフラグ`--config=/path/to/config/file`を使用して`KubeSchedulerConfiguration`のファイルを指定することで渡すことができます。

**この機能はデフォルトで無効化されています**

### 優先度関数のチューニング

`shape`は`RequestedToCapacityRatioPriority`関数の動作を指定するために使用されます。

```yaml
shape:
 - utilization: 0
   score: 0
 - utilization: 100
   score: 10
```

上記の引数は、`utilization`が0%の場合は0、`utilization`が100%の場合は10という`score`をNodeに与え、ビンパッキングの動作を有効にしています。最小要求を有効にするには、次のようにスコアを反転させる必要があります。

```yaml
shape:
  - utilization: 0
    score: 10
  - utilization: 100
    score: 0
```

`resources`はオプションパラメーターで、デフォルトでは以下の通りです。

``` yaml
resources:
  - name: cpu
    weight: 1
  - name: memory
    weight: 1
```


以下のように拡張リソースの追加に利用できます。

```yaml
resources:
  - name: intel.com/foo
    weight: 5
  - name: cpu
    weight: 3
  - name: memory
    weight: 1
```

`weight`はオプションパラメーターで、指定されてない場合1が設定されます。また、マイナスの値は設定できません。

### キャパシティ割り当てのためのNodeスコアリング

このセクションは、本機能の内部詳細について理解したい方を対象としています。以下は、与えられた値に対してNodeのスコアがどのように計算されるかの例です。

要求されたリソース:

```
intel.com/foo : 2
memory: 256MB
cpu: 2
```

リソースの重み:

```
intel.com/foo : 5
memory: 1
cpu: 3
```

`shape`の値 {{0, 0}, {100, 10}}

Node1のスペック:

```
Available:
  intel.com/foo: 4
  memory: 1 GB
  cpu: 8

Used:
  intel.com/foo: 1
  memory: 256MB
  cpu: 1
```

Nodeのスコア:

```
intel.com/foo  = resourceScoringFunction((2+1),4)
               = (100 - ((4-3)*100/4)
               = (100 - 25)
               = 75                       # requested + used = 75% * available
               = rawScoringFunction(75)
               = 7                        # floor(75/10)

memory         = resourceScoringFunction((256+256),1024)
               = (100 -((1024-512)*100/1024))
               = 50                       # requested + used = 50% * available
               = rawScoringFunction(50)
               = 5                        # floor(50/10)

cpu            = resourceScoringFunction((2+1),8)
               = (100 -((8-3)*100/8))
               = 37.5                     # requested + used = 37.5% * available
               = rawScoringFunction(37.5)
               = 3                        # floor(37.5/10)

NodeScore   =  ((7 * 5) + (5 * 1) + (3 * 3)) / (5 + 1 + 3)
            =  5
```

Node2のスペック:

```
Available:
  intel.com/foo: 8
  memory: 1GB
  cpu: 8
Used:
  intel.com/foo: 2
  memory: 512MB
  cpu: 6
```

Nodeのスコア:

```
intel.com/foo  = resourceScoringFunction((2+2),8)
               =  (100 - ((8-4)*100/8)
               =  (100 - 50)
               =  50
               =  rawScoringFunction(50)
               = 5

memory         = resourceScoringFunction((256+512),1024)
               = (100 -((1024-768)*100/1024))
               = 75
               = rawScoringFunction(75)
               = 7

cpu            = resourceScoringFunction((2+6),8)
               = (100 -((8-8)*100/8))
               = 100
               = rawScoringFunction(100)
               = 10

NodeScore   =  ((5 * 5) + (7 * 1) + (10 * 3)) / (5 + 1 + 3)
            =  7

```

## {{% heading "whatsnext" %}}

- [スケジューリングフレームワーク](/ja/docs/concepts/scheduling-eviction/scheduling-framework/)について更に読む
- [スケジューラーの設定](/docs/reference/scheduling/config/)について更に読む
