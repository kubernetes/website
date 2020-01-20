---
reviewers:
- fgrzadkowski
- jszczepkowski
- directxman12
title: Pod 水平自动伸缩
feature:
  title: 水平伸缩 
  description: >
    使用一个简单的命令、一个UI或基于CPU使用情况自动对应用程序进行伸缩。

content_template: templates/concept
weight: 90
---

{{% capture overview %}}

<!--
The Horizontal Pod Autoscaler automatically scales the number of pods
in a replication controller, deployment or replica set based on observed CPU utilization (or, with
[custom metrics](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md)
support, on some other application-provided metrics). Note that Horizontal
Pod Autoscaling does not apply to objects that can't be scaled, for example, DaemonSets.
-->
Pod 水平自动伸缩（Horizontal Pod Autoscaler）特性，
可以基于CPU利用率自动伸缩 replication controller、deployment和 replica set 中的 pod 数量，（除了 CPU 利用率）也可以
基于其他应程序提供的度量指标[custom metrics](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md)。
pod 自动缩放不适用于无法缩放的对象，比如 DaemonSets。

<!--
The Horizontal Pod Autoscaler is implemented as a Kubernetes API resource and a controller.
The resource determines the behavior of the controller.
The controller periodically adjusts the number of replicas in a replication controller or deployment
to match the observed average CPU utilization to the target specified by user.
-->
Pod 水平自动伸缩特性由 Kubernetes API 资源和控制器实现。资源决定了控制器的行为。
控制器会周期性的获取平均 CPU 利用率，并与目标值相比较后来调整 replication controller 或 deployment 中的副本数量。

{{% /capture %}}


{{% capture body %}}

<!--
## How does the Horizontal Pod Autoscaler work?
-->
## Pod 水平自动伸缩工作机制

![水平自动伸缩示意图](/images/docs/horizontal-pod-autoscaler.svg)

<!--
The Horizontal Pod Autoscaler is implemented as a control loop, with a period controlled
by the controller manager's `--horizontal-pod-autoscaler-sync-period` flag (with a default
value of 15 seconds).
-->
Pod 水平自动伸缩的实现是一个控制循环，由 controller manager 的 `--horizontal-pod-autoscaler-sync-period` 参数
指定周期（默认值为15秒）。

<!--
During each period, the controller manager queries the resource utilization against the
metrics specified in each HorizontalPodAutoscaler definition.  The controller manager
obtains the metrics from either the resource metrics API (for per-pod resource metrics),
or the custom metrics API (for all other metrics).
-->
每个周期内，controller manager 根据每个 HorizontalPodAutoscaler 定义中指定的指标查询资源利用率。
controller manager 可以从 resource metrics API（每个pod 资源指标）和 custom metrics API（其他指标）获取指标。

<!--
* For per-pod resource metrics (like CPU), the controller fetches the metrics
  from the resource metrics API for each pod targeted by the HorizontalPodAutoscaler.
  Then, if a target utilization value is set, the controller calculates the utilization
  value as a percentage of the equivalent resource request on the containers in
  each pod.  If a target raw value is set, the raw metric values are used directly.
  The controller then takes the mean of the utilization or the raw value (depending on the type
  of target specified) across all targeted pods, and produces a ratio used to scale
  the number of desired replicas.
-->
* 对于每个 pod 的资源指标（如 CPU），控制器从资源指标 API 中获取每一个 HorizontalPodAutoscaler 指定
的 pod 的指标，然后，如果设置了目标使用率，控制器获取每个 pod 中的容器资源使用情况，并计算资源使用率。
如果使用原始值，将直接使用原始数据（不再计算百分比）。
然后，控制器根据平均的资源使用率或原始值计算出缩放的比例，进而计算出目标副本数。

<!--
  Please note that if some of the pod's containers do not have the relevant resource request set,
  CPU utilization for the pod will not be defined and the autoscaler will
  not take any action for that metric. See the [algorithm
  details](#algorithm-details) section below for more information about
  how the autoscaling algorithm works.
-->
需要注意的是，如果 pod 某些容器不支持资源采集，那么控制器将不会使用该 pod 的 CPU 使用率。
下面的[算法细节](#algorithm-details)章节将会介绍详细的算法。

<!--
* For per-pod custom metrics, the controller functions similarly to per-pod resource metrics,
  except that it works with raw values, not utilization values.
-->
* 如果 pod 使用自定义指示，控制器机制与资源指标类似，区别在于自定义指标只使用原始值，而不是使用率。

<!--
* For object metrics and external metrics, a single metric is fetched, which describes
  the object in question. This metric is compared to the target
  value, to produce a ratio as above. In the `autoscaling/v2beta2` API
  version, this value can optionally be divided by the number of pods before the
  comparison is made.
-->
* 如果pod 使用对象指标和外部指标（每个指标描述一个对象信息）。
  这个指标将直接跟据目标设定值相比较，并生成一个上面提到的缩放比例。在 `autoscaling/v2beta2` 版本API中，
  这个指标也可以根据 pod 数量平分后再计算。

<!--
The HorizontalPodAutoscaler normally fetches metrics from a series of aggregated APIs (`metrics.k8s.io`,
`custom.metrics.k8s.io`, and `external.metrics.k8s.io`).  The `metrics.k8s.io` API is usually provided by
metrics-server, which needs to be launched separately. See
[metrics-server](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server)
for instructions. The HorizontalPodAutoscaler can also fetch metrics directly from Heapster.
-->
通常情况下，控制器将从一系列的聚合 API（`metrics.k8s.io`、`custom.metrics.k8s.io`和`external.metrics.k8s.io`）
中获取指标数据。
`metrics.k8s.io` API 通常由 metrics-server（需要额外启动）提供。
可以从[metrics-server](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server) 获取更多信息。
另外，控制器也可以直接从 Heapster 获取指标。

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="1.11" >}}
<!--
Fetching metrics from Heapster is deprecated as of Kubernetes 1.11.
-->
自 Kubernetes 1.11起，从 Heapster 获取指标特性已废弃。
{{< /note >}}

<!--
See [Support for metrics APIs](#support-for-metrics-apis) for more details.
-->
关于指标 API 更多信息，请参考[Support for metrics APIs](#support-for-metrics-apis)。

<!--
The autoscaler accesses corresponding scalable controllers (such as replication controllers, deployments, and replica sets)
by using the scale sub-resource. Scale is an interface that allows you to dynamically set the number of replicas and examine
each of their current states. More details on scale sub-resource can be found
[here](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource).
-->
自动缩放控制器使用 scale sub-resource 访问相应可支持缩放的控制器（如replication controllers、deployments 和 replica sets）。
`scale` 是一个可以动态设定副本数量和检查当前状态的接口。
更多关于 scale sub-resource 的信息，请参考[这里](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource).

<!--
### Algorithm Details
-->
### 算法细节

<!--
From the most basic perspective, the Horizontal Pod Autoscaler controller
operates on the ratio between desired metric value and current metric
value:
-->
从最基本的角度来看，pod 水平自动缩放控制器跟据当前指标和期望指标来计算缩放比例。

<!--
```
desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]
```
-->
```
期望副本数 = ceil[当前副本数 * ( 当前指标 / 期望指标 )]
```

<!--
For example, if the current metric value is `200m`, and the desired value
is `100m`, the number of replicas will be doubled, since `200.0 / 100.0 ==
2.0` If the current value is instead `50m`, we'll halve the number of
replicas, since `50.0 / 100.0 == 0.5`.  We'll skip scaling if the ratio is
sufficiently close to 1.0 (within a globally-configurable tolerance, from
the `--horizontal-pod-autoscaler-tolerance` flag, which defaults to 0.1).
-->
例如，当前指标为`200m`，目标设定值为`100m`,那么由于`200.0 / 100.0 == 2.0`，
副本数量将会翻倍。
如果当前指标为`50m`，副本数量将会减半，因为`50.0 / 100.0 == 0.5`。
如果计算出的缩放比例接近1.0（跟据`--horizontal-pod-autoscaler-tolerance` 参数全局配置的容忍值，默认为0.1），
将会放弃本次缩放。

<!--
When a `targetAverageValue` or `targetAverageUtilization` is specified,
the `currentMetricValue` is computed by taking the average of the given
metric across all Pods in the HorizontalPodAutoscaler's scale target.
Before checking the tolerance and deciding on the final values, we take
pod readiness and missing metrics into consideration, however.
-->
如果 HorizontalPodAutoscaler 指定的是`targetAverageValue` 或 `targetAverageUtilization`，
那么将会把指定pod的平均指标做为`currentMetricValue`。
然而，在检查容忍度和决定最终缩放值前，我们仍然会把那些无法获取指标的pod统计进去。

<!--
All Pods with a deletion timestamp set (i.e. Pods in the process of being
shut down) and all failed Pods are discarded.
-->
所有被标记了删除时间戳(Pod正在关闭过程中)的 pod 和 失败的 pod 都会被忽略。

<!--
If a particular Pod is missing metrics, it is set aside for later; Pods
with missing metrics will be used to adjust the final scaling amount.
-->
如果某个 pod 缺失指标信息，它将会被搁置，只在最终确定缩值时再考虑。

<!--
When scaling on CPU, if any pod has yet to become ready (i.e. it's still
initializing) *or* the most recent metric point for the pod was before it
became ready, that pod is set aside as well.
-->
当使用 CPU 指标来缩放时，任何还未就绪（例如还在初始化）状态的 pod *或* 最近的指标为就绪状态前的 pod，
也会被搁置

<!--
Due to technical constraints, the HorizontalPodAutoscaler controller
cannot exactly determine the first time a pod becomes ready when
determining whether to set aside certain CPU metrics. Instead, it
considers a Pod "not yet ready" if it's unready and transitioned to
unready within a short, configurable window of time since it started.
This value is configured with the `--horizontal-pod-autoscaler-initial-readiness-delay` flag, and its default is 30
seconds.  Once a pod has become ready, it considers any transition to
ready to be the first if it occurred within a longer, configurable time
since it started. This value is configured with the `--horizontal-pod-autoscaler-cpu-initialization-period` flag, and its
default is 5 minutes.
-->
由于受技术限制，pod 水平缩放控制器无法准确的知道 pod 什么时候就绪，
也就无法决定是否暂时搁置该 pod。
`--horizontal-pod-autoscaler-initial-readiness-delay` 参数（默认为30s），用于设置 pod 准备时间，
在此时间内的 pod 统统被认为未就绪。
`--horizontal-pod-autoscaler-cpu-initialization-period`参数（默认为5分钟），用于设置 pod 的初始化时间，
在此时间内的 pod，CPU 资源指标将不会被采纳。

<!--
The `currentMetricValue / desiredMetricValue` base scale ratio is then
calculated using the remaining pods not set aside or discarded from above.
-->
在排除掉被搁置的 pod 后，缩放比例就会跟据`currentMetricValue / desiredMetricValue`计算出来。

<!--
If there were any missing metrics, we recompute the average more
conservatively, assuming those pods were consuming 100% of the desired
value in case of a scale down, and 0% in case of a scale up.  This dampens
the magnitude of any potential scale.
-->
如果有任何 pod 的指标缺失，我们会更保守地重新计算平均值，
在需要缩小时假设这些 pod 消耗了目标值的 100%，
在需要放大时假设这些 pod 消耗了0%目标值。
这可以在一定程度上抑制伸缩的幅度。

<!--
Furthermore, if any not-yet-ready pods were present, and we would have
scaled up without factoring in missing metrics or not-yet-ready pods, we
conservatively assume the not-yet-ready pods are consuming 0% of the
desired metric, further dampening the magnitude of a scale up.
-->
此外，如果存在任何尚未就绪的pod，我们可以在不考虑遗漏指标或尚未就绪的pods的情况下进行伸缩，
我们保守地假设尚未就绪的pods消耗了试题指标的0%，从而进一步降低了伸缩的幅度。

<!--
After factoring in the not-yet-ready pods and missing metrics, we
recalculate the usage ratio.  If the new ratio reverses the scale
direction, or is within the tolerance, we skip scaling.  Otherwise, we use
the new ratio to scale.
-->
在缩放方向（缩小或放大）确定后，我们会把未就绪的 pod 和缺少指标的 pod 考虑进来再次计算使用率。
如果新的比率与缩放方向相反，或者在容忍范围内，则跳过缩放。
否则，我们使用新的缩放比例。

<!--
Note that the *original* value for the average utilization is reported
back via the HorizontalPodAutoscaler status, without factoring in the
not-yet-ready pods or missing metrics, even when the new usage ratio is
used.
-->
注意，平均利用率的*原始*值会通过 HorizontalPodAutoscaler 的状态体现（
即使使用了新的使用率，也不考虑未就绪 pod 和 缺少指标的 pod)。

<!--
If multiple metrics are specified in a HorizontalPodAutoscaler, this
calculation is done for each metric, and then the largest of the desired
replica counts is chosen.  If any of those metrics cannot be converted
into a desired replica count (e.g. due to an error fetching the metrics
from the metrics APIs), scaling is skipped.
-->
如果创建 HorizontalPodAutoscaler 时指定了多个指标，
那么会按照每个指标分别计算缩放副本数，取最大的进行缩放。
如果任何一个指标无法顺利的计算出缩放副本数（比如，通过 API 获取指标时出错），
那么本次缩放会被跳过。

<!--
Finally, just before HPA scales the target, the scale recommendation is recorded.  The
controller considers all recommendations within a configurable window choosing the
highest recommendation from within that window. 
This value can be configured using the `--horizontal-pod-autoscaler-downscale-stabilization` flag, which defaults to 5 minutes.
This means that scaledowns will occur gradually, smoothing out the impact of rapidly
fluctuating metric values.
-->
最后，在 HPA 控制器执行缩放操作之前，会记录缩放建议信息（scale recommendation）。
控制器会在操作时间窗口中考虑所有的建议信息，并从中选择得分最高的建议。
这个值可通过 kube-controller-manager 服务的启动参数 `--horizontal-pod-autoscaler-downscale-stabilization` 进行配置，
默认值为 5min。
这个配置可以让系统更为平滑地进行缩容操作，从而消除短时间内指标值快速波动产生的影响。

<!--
## API Object
-->
## API 对象

<!--
The Horizontal Pod Autoscaler is an API resource in the Kubernetes `autoscaling` API group.
The current stable version, which only includes support for CPU autoscaling,
can be found in the `autoscaling/v1` API version.
-->
HorizontalPodAutoscaler 是 Kubernetes `autoscaling` API 组的资源。
在当前稳定版本（`autoscaling/v1`）中只支持基于CPU指标的缩放。

<!--
The beta version, which includes support for scaling on memory and custom metrics,
can be found in `autoscaling/v2beta2`. The new fields introduced in `autoscaling/v2beta2`
are preserved as annotations when working with `autoscaling/v1`.
-->
在 beta 版本（`autoscaling/v2beta2`），引入了基于内存和自定义指标的缩放。
在`autoscaling/v2beta2`版本中新引入的字段在`autoscaling/v1`版本中基于 annotation 实现。

<!--
More details about the API object can be found at
[HorizontalPodAutoscaler Object](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object).
-->
更多有关 API 对象的信息，请查阅[HorizontalPodAutoscaler Object](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object)。

<!--
## Support for Horizontal Pod Autoscaler in kubectl
-->
## 使用 kubectl 操作 Horizontal Pod Autoscaler

<!--
Horizontal Pod Autoscaler, like every API resource, is supported in a standard way by `kubectl`.
We can create a new autoscaler using `kubectl create` command.
We can list autoscalers by `kubectl get hpa` and get detailed description by `kubectl describe hpa`.
Finally, we can delete an autoscaler using `kubectl delete hpa`.
-->
与其他 API 资源类似，`kubectl` 也标准支持 Pod 自动伸缩。
我们可以通过 `kubectl create` 命令创建一个自动伸缩对象，
通过 `kubectl get hpa` 命令来获取所有自动伸缩对象，
通过 `kubectl describe hpa` 命令来查看自动伸缩对象的详细信息。
最后，可以使用 `kubectl delete hpa` 命令删除对象。

<!--
In addition, there is a special `kubectl autoscale` command for easy creation of a Horizontal Pod Autoscaler.
For instance, executing `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80`
will create an autoscaler for replication set *foo*, with target CPU utilization set to `80%`
and the number of replicas between 2 and 5.
The detailed documentation of `kubectl autoscale` can be found [here](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
-->
此外，还有个简便的命令 `kubectl autoscale` 来创建自动伸缩对象。
例如，命令 `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80` 将会为名
为 *foo* 的 replication set 创建一个自动伸缩对象，
对象目标CPU使用率为 `80%`，副本数量配置为 2 到 5 之间。

<!--
## Autoscaling during rolling update
-->

## 滚动升级时缩放

<!--
Currently in Kubernetes, it is possible to perform a [rolling update](/docs/tasks/run-application/rolling-update-replication-controller/) 
by managing replication controllers directly,
or by using the deployment object, which manages the underlying replica sets for you.
Horizontal Pod Autoscaler only supports the latter approach: the Horizontal Pod Autoscaler is bound to the deployment object,
it sets the size for the deployment object, and the deployment is responsible for setting sizes of underlying replica sets.
-->
目前在 Kubernetes 中，可以针对 replication controllers 或 deployment 执行
滚动升级[rolling update](/docs/tasks/run-application/rolling-update-replication-controller/)，他们会为你管理底层副本数。
Pod 水平缩放只支持后一种：Horizontal Pod Autoscaler 会被绑定到 deployment 对象中，Horizontal Pod Autoscaler 设置副本数量时，
deployment 会设置底层副本数。

<!--
Horizontal Pod Autoscaler does not work with rolling update using direct manipulation of replication controllers,
i.e. you cannot bind a Horizontal Pod Autoscaler to a replication controller and do rolling update (e.g. using `kubectl rolling-update`).
The reason this doesn't work is that when rolling update creates a new replication controller,
the Horizontal Pod Autoscaler will not be bound to the new replication controller.
-->
当使用 replication controllers 执行滚动升级时， Horizontal Pod Autoscaler 不能工作，
也就是说你不能将 Horizontal Pod Autoscaler 绑定到某个 replication controller 
再执行滚动升级（例如使用 `kubectl rolling-update` 命令）。
Horizontal Pod Autoscaler 不能工作的原因是，Horizontal Pod Autoscaler 无法绑定到滚动升级时创建的新副本。

<!--
## Support for cooldown/delay
-->
## 冷却/延迟

<!--
When managing the scale of a group of replicas using the Horizontal Pod Autoscaler,
it is possible that the number of replicas keeps fluctuating frequently due to the
dynamic nature of the metrics evaluated. This is sometimes referred to as *thrashing*.
-->
当使用 Horizontal Pod Autoscaler 管理一组副本缩放时，
有可能因为指标动态的变化造成副本数量频繁的变化，有时这被称为 *抖动*。

<!--
Starting from v1.6, a cluster operator can mitigate this problem by tuning
the global HPA settings exposed as flags for the `kube-controller-manager` component:
-->
从 v1.6 版本起，集群操作员可以开启某些 `kube-controller-manager` 全局的参数来缓和这个问题。

<!--
Starting from v1.12, a new algorithmic update removes the need for the
upscale delay.
-->
从 v1.12 开始，算法调整后，就不用这么做了。

<!--
- `--horizontal-pod-autoscaler-downscale-stabilization`: The value for this option is a
  duration that specifies how long the autoscaler has to wait before another
  downscale operation can be performed after the current one has completed.
  The default value is 5 minutes (`5m0s`).
-->
- `--horizontal-pod-autoscaler-downscale-stabilization`: 这个 `kube-controller-manager` 的参数表示缩容冷却时间。
  即自从上次缩容执行结束后，多久可以再次执行缩容，默认时间是5分钟(`5m0s`)。

{{< note >}}
<!--
When tuning these parameter values, a cluster operator should be aware of the possible
consequences. If the delay (cooldown) value is set too long, there could be complaints
that the Horizontal Pod Autoscaler is not responsive to workload changes. However, if
the delay value is set too short, the scale of the replicas set may keep thrashing as
usual.
-->
当启用这个参数时，集群操作员需要明白其可能的影响。
如果延迟（冷却）时间设置的太长，那么 Horizontal Pod Autoscaler 可能会不能很好的改变负载。
如果延迟（冷却）时间设备的太短，那么副本数量有可能跟以前一样抖动。
{{< /note >}}

<!--
## Support for multiple metrics
-->
## 多指标支持

<!--
Kubernetes 1.6 adds support for scaling based on multiple metrics. You can use the `autoscaling/v2beta2` API
version to specify multiple metrics for the Horizontal Pod Autoscaler to scale on. Then, the Horizontal Pod
Autoscaler controller will evaluate each metric, and propose a new scale based on that metric. The largest of the
proposed scales will be used as the new scale.
-->
在 Kubernetes 1.6 支持了基于多个指标进行缩放。
你可以使用 `autoscaling/v2beta2` API 来为 Horizontal Pod Autoscaler 指定多个指标。
Horizontal Pod Autoscaler 会跟据每个指标计算，并生成一个缩放建议。
幅度最大的缩放建议会被采纳。

<!--
## Support for custom metrics
-->
## 自定义指标支持

{{< note >}}
<!--
Kubernetes 1.2 added alpha support for scaling based on application-specific metrics using special annotations.
Support for these annotations was removed in Kubernetes 1.6 in favor of the new autoscaling API.  While the old method for collecting
custom metrics is still available, these metrics will not be available for use by the Horizontal Pod Autoscaler, and the former
annotations for specifying which custom metrics to scale on are no longer honored by the Horizontal Pod Autoscaler controller.
-->
在 Kubernetes 1.2 增加的 alpha 的缩放支持基于特定的 annotation。
自从 Kubernetes 1.6 起，由于缩放 API 的引入，这些 annotation 就不再支持了。
虽然收集自定义指标的旧方法仍然可用，但是 Horizontal Pod Autoscaler 调度器将不会再使用这些指标，
同时，Horizontal Pod Autoscaler 也不再使用之前的用于指定用户自定义指标的 annotation 了。
{{< /note >}}

<!--
Kubernetes 1.6 adds support for making use of custom metrics in the Horizontal Pod Autoscaler.
You can add custom metrics for the Horizontal Pod Autoscaler to use in the `autoscaling/v2beta2` API.
Kubernetes then queries the new custom metrics API to fetch the values of the appropriate custom metrics.
-->
自 Kubernetes 1.6 起，Horizontal Pod Autoscaler 支持使用自定义指标。
你可以使用 `autoscaling/v2beta2` API 为 Horizontal Pod Autoscaler 指定用户自定义指标。
Kubernetes 会通过用户自定义指标 API 来获取相应的指标。

<!--
See [Support for metrics APIs](#support-for-metrics-apis) for the requirements.
-->
关于指标 API 的要求，请查阅 [Support for metrics APIs](#support-for-metrics-apis)。

<!--
## Support for metrics APIs
-->
## 指标 API

<!--
By default, the HorizontalPodAutoscaler controller retrieves metrics from a series of APIs.  In order for it to access these
APIs, cluster administrators must ensure that:
-->
默认情况下，HorizontalPodAutoscaler 控制器会从一系列的 API 中请求指标数据。
集群管理员需要确保下述条件，以保证这些 API 可以访问：

<!--
* The [API aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) is enabled.
-->
* [API aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) 已开启

<!--
* The corresponding APIs are registered:

   * For resource metrics, this is the `metrics.k8s.io` API, generally provided by [metrics-server](https://github.com/kubernetes-incubator/metrics-server).
     It can be launched as a cluster addon.

   * For custom metrics, this is the `custom.metrics.k8s.io` API.  It's provided by "adapter" API servers provided by metrics solution vendors.
     Check with your metrics pipeline, or the [list of known solutions](https://github.com/kubernetes/metrics/blob/master/IMPLEMENTATIONS.md#custom-metrics-api).
     If you would like to write your own, check out the [boilerplate](https://github.com/kubernetes-incubator/custom-metrics-apiserver) to get started.

   * For external metrics, this is the `external.metrics.k8s.io` API.  It may be provided by the custom metrics adapters provided above.
-->

* 相应的 API 已注册：

   * 资源指标会使用 `metrics.k8s.io` API，一般由 [metrics-server](https://github.com/kubernetes-incubator/metrics-server) 提供。
     它可以做为集群组件启动。
  * 用户指标会使用 `custom.metrics.k8s.io` API。
     它由其他厂商的“适配器”API 服务器提供。
     确认你的指标管道，或者查看 [list of known solutions](https://github.com/kubernetes/metrics/blob/master/IMPLEMENTATIONS.md#custom-metrics-api)。
   * 外部指标会使用 `external.metrics.k8s.io` API。可能由上面的用户指标适配器提供。

<!--
* The `--horizontal-pod-autoscaler-use-rest-clients` is `true` or unset.  Setting this to false switches to Heapster-based autoscaling, which is deprecated.
-->
* `--horizontal-pod-autoscaler-use-rest-clients` 参数设置为 `true` 或者不设置。 
  如果设置为 false，则会切换到基于 Heapster 的自动缩放，这个特性已经被弃用了。

<!--  
For more information on these different metrics paths and how they differ please see the relevant design proposals for
[the HPA V2](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/autoscaling/hpa-v2.md),
[custom.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md)
and [external.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/external-metrics-api.md).
-->
更多关于指标来源以及其区别，请参阅相关的设计文档，
[the HPA V2](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/autoscaling/hpa-v2.md)、
[custom.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md)和
[external.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/external-metrics-api.md)。

<!--
For examples of how to use them see [the walkthrough for using custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
and [the walkthrough for using external metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects).
-->
如何使用它们的示例，请参考 
[the walkthrough for using custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
和 [the walkthrough for using external metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects)。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
* Design documentation: [Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md).
* kubectl autoscale command: [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* Usage example of [Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
-->
* 设计文档：[Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md).
* kubectl 自动缩放命令： [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* 使用示例：[Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).

{{% /capture %}}
