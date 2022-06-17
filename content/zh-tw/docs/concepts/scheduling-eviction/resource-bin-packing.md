---
title: 擴充套件資源的資源裝箱
content_type: concept
weight: 80
---
<!--
---
reviewers:
- bsalamat
- k82cn
- ahg-g
title: Resource Bin Packing for Extended Resources
content_type: concept
weight: 80
---
-->

<!-- overview -->

<!--
In the [scheduling-plugin](/docs/reference/scheduling/config/#scheduling-plugins)  `NodeResourcesFit` of kube-scheduler, there are two 
scoring strategies that support the bin packing of resources: `MostAllocated` and `RequestedToCapacityRatio`.
-->
在 kube-scheduler 的[排程外掛](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)
`NodeResourcesFit` 中存在兩種支援資源裝箱（bin packing）的策略：`MostAllocated` 和
`RequestedToCapacityRatio`。

<!-- body -->

<!--
## Enabling bin packing using MostAllocated strategy

The `MostAllocated` strategy scores the nodes based on the utilization of resources, favoring the ones with higher allocation.
For each resource type, you can set a weight to modify its influence in the node score.

To set the `MostAllocated` strategy for the `NodeResourcesFit` plugin, use a
[scheduler configuration](/docs/reference/scheduling/config) similar to the following:
-->
## 使用 MostAllocated 策略啟用資源裝箱   {#enabling-bin-packing-using-mostallocated-strategy}

`MostAllocated` 策略基於資源的利用率來為節點計分，優選分配比率較高的節點。
針對每種資源型別，你可以設定一個權重值以改變其對節點得分的影響。

要為外掛 `NodeResourcesFit` 設定 `MostAllocated` 策略，
可以使用一個類似於下面這樣的[排程器配置](/zh-cn/docs/reference/scheduling/config/)：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
- pluginConfig:
  - args:
      scoringStrategy:
        resources:
        - name: cpu
          weight: 1
        - name: memory
          weight: 1
        - name: intel.com/foo
          weight: 3
        - name: intel.com/bar
          weight: 3
        type: MostAllocated
    name: NodeResourcesFit
```

<!--
To learn more about other parameters and their default configuration, see the API documentation for 
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs).
-->
要進一步瞭解其它引數及其預設配置，請參閱
[`NodeResourcesFitArgs`](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs)
的 API 文件。

<!--
## Enabling bin packing using RequestedToCapacityRatio

The `RequestedToCapacityRatio` strategy allows the users to specify the resources along with weights for
each resource to score nodes based on the request to capacity ratio. This
allows users to bin pack extended resources by using appropriate parameters
to improve the utilization of scarce resources in large clusters. It favors nodes according to a
configured function of the allocated resources. The behavior of the `RequestedToCapacityRatio` in
the `NodeResourcesFit` score function can be controlled by the
[scoringStrategy](/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy) field.
Within the `scoringStrategy` field, you can configure two parameters: `requestedToCapacityRatioParam` and
`resources`. The `shape` in `requestedToCapacityRatioParam` 
parameter allows the user to tune the function as least requested or most 
requested based on `utilization` and `score` values.  The `resources` parameter 
consists of `name` of the resource to be considered during scoring and `weight` 
specify the weight of each resource.
-->
## 使用 RequestedToCapacityRatio 策略來啟用資源裝箱 {#enabling-bin-packing-using-requestedtocapacityratio}

`RequestedToCapacityRatio` 策略允許使用者基於請求值與容量的比率，針對參與節點計分的每類資源設定權重。
這一策略是的使用者可以使用合適的引數來對擴充套件資源執行裝箱操作，進而提升大規模叢集中稀有資源的利用率。
此策略根據所分配資源的一個配置函式來評價節點。
`NodeResourcesFit` 計分函式中的 `RequestedToCapacityRatio` 可以透過欄位
[scoringStrategy](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-ScoringStrategy)
來控制。
在 `scoringStrategy` 欄位中，你可以配置兩個引數：`requestedToCapacityRatioParam`
和 `resources`。`requestedToCapacityRatioParam` 引數中的 `shape`
設定使得使用者能夠調整函式的演算法，基於 `utilization` 和 `score` 值計算最少請求或最多請求。
`resources` 引數中包含計分過程中需要考慮的資源的 `name`，以及用來設定每種資源權重的 `weight`。

<!--
Below is an example configuration that sets
the bin packing behavior for extended resources `intel.com/foo` and `intel.com/bar`
using the `requestedToCapacityRatio` field.
-->
下面是一個配置示例，使用 `requestedToCapacityRatio` 欄位為擴充套件資源 `intel.com/foo`
和 `intel.com/bar` 設定裝箱行為：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
- pluginConfig:
  - args:
      scoringStrategy:
        resources:
        - name: intel.com/foo
          weight: 3
        - name: intel.com/bar
          weight: 3
        requestedToCapacityRatioParam:
          shape:
          - utilization: 0
            score: 0
          - utilization: 100
            score: 10
        type: RequestedToCapacityRatio
    name: NodeResourcesFit
```

<!--
Referencing the `KubeSchedulerConfiguration` file with the kube-scheduler 
flag `--config=/path/to/config/file` will pass the configuration to the 
scheduler.
-->
使用 kube-scheduler 標誌 `--config=/path/to/config/file` 
引用 `KubeSchedulerConfiguration` 檔案，可以將配置傳遞給排程器。

<!--
To learn more about other parameters and their default configuration, see the API documentation for 
[`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs).
-->
要進一步瞭解其它引數及其預設配置，可以參閱
[`NodeResourcesFitArgs`](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-NodeResourcesFitArgs)
的 API 文件。

<!--
### Tuning the score function

`shape` is used to specify the behavior of the `RequestedToCapacityRatio` function.
-->
### 調整計分函式    {#tuning-the-score-function}

`shape` 用於指定 `RequestedToCapacityRatio` 函式的行為。

```yaml
shape:
 - utilization: 0
   score: 0
 - utilization: 100
   score: 10
```

<!--
The above arguments give the node a `score` of 0 if `utilization` is 0% and 10 for
`utilization` 100%, thus enabling bin packing behavior. To enable least
requested the score value must be reversed as follows.
-->
上面的引數在 `utilization` 為 0% 時給節點評分為 0，在 `utilization` 為
100% 時給節點評分為 10，因此啟用了裝箱行為。
要啟用最少請求（least requested）模式，必須按如下方式反轉得分值。

```yaml
 shape:
  - utilization: 0
    score: 10
  - utilization: 100
    score: 0
```

<!--
`resources` is an optional parameter which by defaults is set to:
-->
`resources` 是一個可選引數，預設情況下設定為：

``` yaml
resources:
  - name: cpu
    weight: 1
  - name: memory
    weight: 1
```

<!--
It can be used to add extended resources as follows:
-->
它可以像下面這樣用來新增擴充套件資源：

```yaml
resources:
  - name: intel.com/foo
    weight: 5
  - name: cpu
    weight: 3
  - name: memory
    weight: 1
```

<!--
The `weight` parameter is optional and is set to 1 if not specified. Also, the
`weight` cannot be set to a negative value.
-->
`weight` 引數是可選的，如果未指定，則設定為 1。
同時，`weight` 不能設定為負值。

<!--
### Node scoring for capacity allocation

This section is intended for those who want to understand the internal details
of this feature.
Below is an example of how the node score is calculated for a given set of values.
-->
### 節點容量分配的評分   {#node-scoring-for-capacity-allocation}

本節適用於希望瞭解此功能的內部細節的人員。
以下是如何針對給定的一組值來計算節點得分的示例。

<!--
Requested resources:
-->
請求的資源：

```
intel.com/foo : 2
memory: 256MB
cpu: 2
```

<!--
Resource weights:
-->
資源權重：

```
intel.com/foo : 5
memory: 1
cpu: 3
```

```
FunctionShapePoint {{0, 0}, {100, 10}}
```

<!--
Node 1 spec:
-->
節點 1 配置：

```
可用：
  intel.com/foo : 4
  memory : 1 GB
  cpu: 8

已用：
  intel.com/foo: 1
  memory: 256MB
  cpu: 1
```

<!--
Node score:
-->
節點得分：

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

NodeScore   =  (7 * 5) + (5 * 1) + (3 * 3) / (5 + 1 + 3)
            =  5
```

<!--
Node 2 spec:
-->
節點 2 配置：

```
可用：
  intel.com/foo: 8
  memory: 1GB
  cpu: 8

已用：
  intel.com/foo: 2
  memory: 512MB
  cpu: 6
```

<!--
Node score:
-->
節點得分：

```
intel.com/foo  = resourceScoringFunction((2+2),8)
               = (100 - ((8-4)*100/8)
               = (100 - 50)
               = 50
               = rawScoringFunction(50)
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

NodeScore   =  (5 * 5) + (7 * 1) + (10 * 3) / (5 + 1 + 3)
            =  7
```

## {{% heading "whatsnext" %}}

<!--
- Read more about the [scheduling framework](/docs/concepts/scheduling-eviction/scheduling-framework/)
- Read more about [scheduler configuration](/docs/reference/scheduling/config/)
-->
- 繼續閱讀[排程器框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)
- 繼續閱讀[排程器配置](/zh-cn/docs/reference/scheduling/config/)

