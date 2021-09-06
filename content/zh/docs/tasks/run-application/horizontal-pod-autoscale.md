---
title: Pod 水平自动扩缩
feature:
  title: 水平扩缩 
  description: >
    使用一个简单的命令、一个 UI 或基于 CPU 使用情况自动对应用程序进行扩缩。

content_type: concept
weight: 90
---

<!-- overview -->

<!--
The Horizontal Pod Autoscaler automatically scales the number of Pods
in a replication controller, deployment, replica set or stateful set based on observed CPU utilization (or, with
[custom metrics](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md)
support, on some other application-provided metrics). Note that Horizontal
Pod Autoscaling does not apply to objects that can't be scaled, for example, DaemonSets.
-->
Pod 水平自动扩缩（Horizontal Pod Autoscaler）
可以基于 CPU 利用率自动扩缩 ReplicationController、Deployment、ReplicaSet 和 StatefulSet 中的 Pod 数量。
除了 CPU 利用率，也可以基于其他应程序提供的[自定义度量指标](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md)
来执行自动扩缩。
Pod 自动扩缩不适用于无法扩缩的对象，比如 DaemonSet。

<!--
The Horizontal Pod Autoscaler is implemented as a Kubernetes API resource and a controller.
The resource determines the behavior of the controller.
The controller periodically adjusts the number of replicas in a replication controller or deployment
to match the observed average CPU utilization to the target specified by user.
-->
Pod 水平自动扩缩特性由 Kubernetes API 资源和控制器实现。资源决定了控制器的行为。
控制器会周期性的调整副本控制器或 Deployment 中的副本数量，以使得 Pod 的平均 CPU
利用率与用户所设定的目标值匹配。

<!-- body -->

<!--
## How does the Horizontal Pod Autoscaler work?
-->
## Pod 水平自动扩缩工作机制

![水平自动扩缩示意图](/images/docs/horizontal-pod-autoscaler.svg)

<!--
The Horizontal Pod Autoscaler is implemented as a control loop, with a period controlled
by the controller manager's `--horizontal-pod-autoscaler-sync-period` flag (with a default
value of 15 seconds).
-->
Pod 水平自动扩缩器的实现是一个控制回路，由控制器管理器的 `--horizontal-pod-autoscaler-sync-period` 参数指定周期（默认值为 15 秒）。

<!--
During each period, the controller manager queries the resource utilization against the
metrics specified in each HorizontalPodAutoscaler definition.  The controller manager
obtains the metrics from either the resource metrics API (for per-pod resource metrics),
or the custom metrics API (for all other metrics).
-->
每个周期内，控制器管理器根据每个 HorizontalPodAutoscaler 定义中指定的指标查询资源利用率。
控制器管理器可以从资源度量指标 API（按 Pod 统计的资源用量）和自定义度量指标 API（其他指标）获取度量值。

<!--
* For per-pod resource metrics (like CPU), the controller fetches the metrics
  from the resource metrics API for each Pod targeted by the HorizontalPodAutoscaler.
  Then, if a target utilization value is set, the controller calculates the utilization
  value as a percentage of the equivalent resource request on the containers in
  each Pod.  If a target raw value is set, the raw metric values are used directly.
  The controller then takes the mean of the utilization or the raw value (depending on the type
  of target specified) across all targeted Pods, and produces a ratio used to scale
  the number of desired replicas.
-->
* 对于按 Pod 统计的资源指标（如 CPU），控制器从资源指标 API 中获取每一个
  HorizontalPodAutoscaler 指定的 Pod 的度量值，如果设置了目标使用率，
  控制器获取每个 Pod 中的容器资源使用情况，并计算资源使用率。
  如果设置了 target 值，将直接使用原始数据（不再计算百分比）。
  接下来，控制器根据平均的资源使用率或原始值计算出扩缩的比例，进而计算出目标副本数。

  <!--
  Please note that if some of the Pod's containers do not have the relevant resource request set,
  CPU utilization for the Pod will not be defined and the autoscaler will
  not take any action for that metric. See the [algorithm
  details](#algorithm-details) section below for more information about
  how the autoscaling algorithm works.
  -->
  需要注意的是，如果 Pod 某些容器不支持资源采集，那么控制器将不会使用该 Pod 的 CPU 使用率。
  下面的[算法细节](#algorithm-details)章节将会介绍详细的算法。

<!--
* For per-pod custom metrics, the controller functions similarly to per-pod resource metrics,
  except that it works with raw values, not utilization values.
-->
* 如果 Pod 使用自定义指示，控制器机制与资源指标类似，区别在于自定义指标只使用
  原始值，而不是使用率。

<!--
* For object metrics and external metrics, a single metric is fetched, which describes
  the object in question. This metric is compared to the target
  value, to produce a ratio as above. In the `autoscaling/v2beta2` API
  version, this value can optionally be divided by the number of Pods before the
  comparison is made.
-->
* 如果 Pod 使用对象指标和外部指标（每个指标描述一个对象信息）。
  这个指标将直接根据目标设定值相比较，并生成一个上面提到的扩缩比例。
  在 `autoscaling/v2beta2` 版本 API 中，这个指标也可以根据 Pod 数量平分后再计算。

<!--
The HorizontalPodAutoscaler normally fetches metrics from a series of aggregated APIs (`metrics.k8s.io`,
`custom.metrics.k8s.io`, and `external.metrics.k8s.io`).  The `metrics.k8s.io` API is usually provided by
metrics-server, which needs to be launched separately. See
[metrics-server](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server)
for instructions. The HorizontalPodAutoscaler can also fetch metrics directly from Heapster.
-->
通常情况下，控制器将从一系列的聚合 API（`metrics.k8s.io`、`custom.metrics.k8s.io`
和 `external.metrics.k8s.io`）中获取度量值。
`metrics.k8s.io` API 通常由 Metrics 服务器（需要额外启动）提供。
可以从 [metrics-server](/zh/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server) 获取更多信息。
另外，控制器也可以直接从 Heapster 获取指标。

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="1.11" >}}
<!--
Fetching metrics from Heapster is deprecated as of Kubernetes 1.11.
-->
自 Kubernetes 1.11 起，从 Heapster 获取指标特性已废弃。
{{< /note >}}

<!--
See [Support for metrics APIs](#support-for-metrics-apis) for more details.
-->
关于指标 API 更多信息，请参考[度量值指标 API 的支持](#support-for-metrics-apis)。

<!--
The autoscaler accesses corresponding scalable controllers (such as replication controllers, deployments, and replica sets)
by using the scale sub-resource. Scale is an interface that allows you to dynamically set the number of replicas and examine
each of their current states. More details on scale sub-resource can be found
[here](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource).
-->
自动扩缩控制器使用 scale 子资源访问相应可支持扩缩的控制器（如副本控制器、
Deployment 和 ReplicaSet）。
`scale` 是一个可以动态设定副本数量和检查当前状态的接口。
关于 scale 子资源的更多信息，请参考[这里](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource).

<!--
### Algorithm Details

From the most basic perspective, the Horizontal Pod Autoscaler controller
operates on the ratio between desired metric value and current metric
value:
-->
### 算法细节   {#algorithm-details}

从最基本的角度来看，Pod 水平自动扩缩控制器根据当前指标和期望指标来计算扩缩比例。

<!--
```
desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]
```
-->
```
期望副本数 = ceil[当前副本数 * (当前指标 / 期望指标)]
```

<!--
For example, if the current metric value is `200m`, and the desired value
is `100m`, the number of replicas will be doubled, since `200.0 / 100.0 ==
2.0` If the current value is instead `50m`, we'll halve the number of
replicas, since `50.0 / 100.0 == 0.5`.  We'll skip scaling if the ratio is
sufficiently close to 1.0 (within a globally-configurable tolerance, from
the `--horizontal-pod-autoscaler-tolerance` flag, which defaults to 0.1).
-->
例如，当前度量值为 `200m`，目标设定值为 `100m`，那么由于 `200.0/100.0 == 2.0`，
副本数量将会翻倍。
如果当前指标为 `50m`，副本数量将会减半，因为`50.0/100.0 == 0.5`。
如果计算出的扩缩比例接近 1.0
（根据`--horizontal-pod-autoscaler-tolerance` 参数全局配置的容忍值，默认为 0.1），
将会放弃本次扩缩。

<!--
When a `targetAverageValue` or `targetAverageUtilization` is specified,
the `currentMetricValue` is computed by taking the average of the given
metric across all Pods in the HorizontalPodAutoscaler's scale target.
Before checking the tolerance and deciding on the final values, we take
pod readiness and missing metrics into consideration, however.
-->
如果 HorizontalPodAutoscaler 指定的是 `targetAverageValue` 或 `targetAverageUtilization`，
那么将会把指定 Pod 度量值的平均值做为 `currentMetricValue`。
然而，在检查容忍度和决定最终扩缩值前，我们仍然会把那些无法获取指标的 Pod 统计进去。

<!--
All Pods with a deletion timestamp set (i.e. Pods in the process of being
shut down) and all failed Pods are discarded.

If a particular Pod is missing metrics, it is set aside for later; Pods
with missing metrics will be used to adjust the final scaling amount.
-->
所有被标记了删除时间戳（Pod 正在关闭过程中）的 Pod 和失败的 Pod 都会被忽略。

如果某个 Pod 缺失度量值，它将会被搁置，只在最终确定扩缩数量时再考虑。

<!--
When scaling on CPU, if any pod has yet to become ready (i.e. it's still
initializing) *or* the most recent metric point for the pod was before it
became ready, that pod is set aside as well.
-->
当使用 CPU 指标来扩缩时，任何还未就绪（例如还在初始化）状态的 Pod *或* 最近的指标
度量值采集于就绪状态前的 Pod，该 Pod 也会被搁置。

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
由于受技术限制，Pod 水平扩缩控制器无法准确的知道 Pod 什么时候就绪，
也就无法决定是否暂时搁置该 Pod。
`--horizontal-pod-autoscaler-initial-readiness-delay` 参数（默认为 30s）用于设置 Pod 准备时间，
在此时间内的 Pod 统统被认为未就绪。
`--horizontal-pod-autoscaler-cpu-initialization-period` 参数（默认为5分钟）
用于设置 Pod 的初始化时间，
在此时间内的 Pod，CPU 资源度量值将不会被采纳。

<!--
The `currentMetricValue / desiredMetricValue` base scale ratio is then
calculated using the remaining pods not set aside or discarded from above.
-->
在排除掉被搁置的 Pod 后，扩缩比例就会根据 `currentMetricValue/desiredMetricValue`
计算出来。

<!--
If there were any missing metrics, we recompute the average more
conservatively, assuming those pods were consuming 100% of the desired
value in case of a scale down, and 0% in case of a scale up.  This dampens
the magnitude of any potential scale.
-->
如果缺失任何的度量值，我们会更保守地重新计算平均值，
在需要缩小时假设这些 Pod 消耗了目标值的 100%，
在需要放大时假设这些 Pod 消耗了 0% 目标值。
这可以在一定程度上抑制扩缩的幅度。

<!--
Furthermore, if any not-yet-ready pods were present, and we would have
scaled up without factoring in missing metrics or not-yet-ready pods, we
conservatively assume the not-yet-ready pods are consuming 0% of the
desired metric, further dampening the magnitude of a scale up.
-->
此外，如果存在任何尚未就绪的 Pod，我们可以在不考虑遗漏指标或尚未就绪的 Pod 的情况下进行扩缩，
我们保守地假设尚未就绪的 Pod 消耗了期望指标的 0%，从而进一步降低了扩缩的幅度。

<!--
After factoring in the not-yet-ready pods and missing metrics, we
recalculate the usage ratio.  If the new ratio reverses the scale
direction, or is within the tolerance, we skip scaling.  Otherwise, we use
the new ratio to scale.
-->
在扩缩方向（缩小或放大）确定后，我们会把未就绪的 Pod 和缺少指标的 Pod 考虑进来再次计算使用率。
如果新的比率与扩缩方向相反，或者在容忍范围内，则跳过扩缩。
否则，我们使用新的扩缩比例。

<!--
Note that the *original* value for the average utilization is reported
back via the HorizontalPodAutoscaler status, without factoring in the
not-yet-ready pods or missing metrics, even when the new usage ratio is
used.
-->
注意，平均利用率的*原始*值会通过 HorizontalPodAutoscaler 的状态体现（
即使使用了新的使用率，也不考虑未就绪 Pod 和 缺少指标的 Pod)。

<!--
If multiple metrics are specified in a HorizontalPodAutoscaler, this
calculation is done for each metric, and then the largest of the desired
replica counts is chosen. If any of these metrics cannot be converted
into a desired replica count (e.g. due to an error fetching the metrics
from the metrics APIs) and a scale down is suggested by the metrics which
can be fetched, scaling is skipped. This means that the HPA is still capable
of scaling up if one or more metrics give a `desiredReplicas` greater than
the current value.
-->
如果创建 HorizontalPodAutoscaler 时指定了多个指标，
那么会按照每个指标分别计算扩缩副本数，取最大值进行扩缩。
如果任何一个指标无法顺利地计算出扩缩副本数（比如，通过 API 获取指标时出错），
并且可获取的指标建议缩容，那么本次扩缩会被跳过。
这表示，如果一个或多个指标给出的 `desiredReplicas` 值大于当前值，HPA 仍然能实现扩容。

<!--
Finally, just before HPA scales the target, the scale recommendation is recorded.  The
controller considers all recommendations within a configurable window choosing the
highest recommendation from within that window. This value can be configured using the `--horizontal-pod-autoscaler-downscale-stabilization` flag, which defaults to 5 minutes.
This means that scaledowns will occur gradually, smoothing out the impact of rapidly
fluctuating metric values.
-->
最后，在 HPA 控制器执行扩缩操作之前，会记录扩缩建议信息。
控制器会在操作时间窗口中考虑所有的建议信息，并从中选择得分最高的建议。
这个值可通过 `kube-controller-manager` 服务的启动参数 `--horizontal-pod-autoscaler-downscale-stabilization` 进行配置，
默认值为 5 分钟。
这个配置可以让系统更为平滑地进行缩容操作，从而消除短时间内指标值快速波动产生的影响。

<!--
## API Object

The Horizontal Pod Autoscaler is an API resource in the Kubernetes `autoscaling` API group.
The current stable version, which only includes support for CPU autoscaling,
can be found in the `autoscaling/v1` API version.
-->
## API 对象   {#api-object}

HorizontalPodAutoscaler 是 Kubernetes `autoscaling` API 组的资源。
在当前稳定版本（`autoscaling/v1`）中只支持基于 CPU 指标的扩缩。

<!--
The beta version, which includes support for scaling on memory and custom metrics,
can be found in `autoscaling/v2beta2`. The new fields introduced in `autoscaling/v2beta2`
are preserved as annotations when working with `autoscaling/v1`.
-->
API 的 beta 版本（`autoscaling/v2beta2`）引入了基于内存和自定义指标的扩缩。
在 `autoscaling/v2beta2` 版本中新引入的字段在 `autoscaling/v1` 版本中以注解
的形式得以保留。

<!--
When you create a HorizontalPodAutoscaler API object, make sure the name specified is a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
More details about the API object can be found at
[HorizontalPodAutoscaler Object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#horizontalpodautoscaler-v1-autoscaling).
-->
创建 HorizontalPodAutoscaler 对象时，需要确保所给的名称是一个合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
有关 API 对象的更多信息，请查阅
[HorizontalPodAutoscaler 对象设计文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#horizontalpodautoscaler-v1-autoscaling)。

<!--
## Support for Horizontal Pod Autoscaler in kubectl

Horizontal Pod Autoscaler, like every API resource, is supported in a standard way by `kubectl`.
We can create a new autoscaler using `kubectl create` command.
We can list autoscalers by `kubectl get hpa` and get detailed description by `kubectl describe hpa`.
Finally, we can delete an autoscaler using `kubectl delete hpa`.
-->
## kubectl 对 Horizontal Pod Autoscaler 的支持

与其他 API 资源类似，`kubectl` 以标准方式支持 HPA。
我们可以通过 `kubectl create` 命令创建一个 HPA 对象，
通过 `kubectl get hpa` 命令来获取所有 HPA 对象，
通过 `kubectl describe hpa` 命令来查看 HPA 对象的详细信息。
最后，可以使用 `kubectl delete hpa` 命令删除对象。

<!--
In addition, there is a special `kubectl autoscale` command for easy creation of a Horizontal Pod Autoscaler.
For instance, executing `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80`
will create an autoscaler for replication set *foo*, with target CPU utilization set to `80%`
and the number of replicas between 2 and 5.
The detailed documentation of `kubectl autoscale` can be found [here](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
-->
此外，还有个简便的命令 `kubectl autoscale` 来创建 HPA 对象。
例如，命令 `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80` 将会为名
为 *foo* 的 ReplicationSet 创建一个 HPA 对象，
目标 CPU 使用率为 `80%`，副本数量配置为 2 到 5 之间。

<!--
## Autoscaling during rolling update

Currently in Kubernetes, it is possible to perform a rolling update by using the deployment object, 
which manages the underlying replica sets for you.
Horizontal Pod Autoscaler only supports the latter approach: the Horizontal Pod Autoscaler is bound to the deployment object,
it sets the size for the deployment object, and the deployment is responsible for setting sizes of underlying replica sets.
-->
## 滚动升级时扩缩   {#autoscaling-during-rolling-update}

目前在 Kubernetes 中，可以针对 ReplicationController 或 Deployment 执行
滚动更新，它们会为你管理底层副本数。
Pod 水平扩缩只支持后一种：HPA 会被绑定到 Deployment 对象，
HPA 设置副本数量时，Deployment 会设置底层副本数。

<!--
Horizontal Pod Autoscaler does not work with rolling update using direct manipulation of replication controllers,
i.e. you cannot bind a Horizontal Pod Autoscaler to a replication controller and do rolling update.
The reason this doesn't work is that when rolling update creates a new replication controller,
the Horizontal Pod Autoscaler will not be bound to the new replication controller.
-->
通过直接操控副本控制器执行滚动升级时，HPA 不能工作，
也就是说你不能将 HPA 绑定到某个 RC 再执行滚动升级。
HPA 不能工作的原因是它无法绑定到滚动更新时所新创建的副本控制器。

<!--
## Support for cooldown/delay

When managing the scale of a group of replicas using the Horizontal Pod Autoscaler,
it is possible that the number of replicas keeps fluctuating frequently due to the
dynamic nature of the metrics evaluated. This is sometimes referred to as *thrashing*.
-->
## 冷却/延迟支持

当使用 Horizontal Pod Autoscaler 管理一组副本扩缩时，
有可能因为指标动态的变化造成副本数量频繁的变化，有时这被称为
*抖动（Thrashing）*。

<!--
Starting from v1.6, a cluster operator can mitigate this problem by tuning
the global HPA settings exposed as flags for the `kube-controller-manager` component:
-->
从 v1.6 版本起，集群操作员可以调节某些 `kube-controller-manager` 的全局参数来
缓解这个问题。

<!--
Starting from v1.12, a new algorithmic update removes the need for the
upscale delay.
-->
从 v1.12 开始，算法调整后，扩容操作时的延迟就不必设置了。

<!--
- `--horizontal-pod-autoscaler-downscale-stabilization`: The value for this option is a
  duration that specifies how long the autoscaler has to wait before another
  downscale operation can be performed after the current one has completed.
  The default value is 5 minutes (`5m0s`).
-->
- `--horizontal-pod-autoscaler-downscale-stabilization`: 
  `kube-controller-manager` 的这个参数表示缩容冷却时间。
  即自从上次缩容执行结束后，多久可以再次执行缩容，默认时间是 5 分钟(`5m0s`)。

<!--
When tuning these parameter values, a cluster operator should be aware of the possible
consequences. If the delay (cooldown) value is set too long, there could be complaints
that the Horizontal Pod Autoscaler is not responsive to workload changes. However, if
the delay value is set too short, the scale of the replicas set may keep thrashing as
usual.
-->
{{< note >}}
当调整这些参数时，集群操作员需要明白其可能的影响。
如果延迟（冷却）时间设置的太长，Horizontal Pod Autoscaler 可能会不能很好的改变负载。
如果延迟（冷却）时间设置的太短，那么副本数量有可能跟以前一样出现抖动。
{{< /note >}}

<!--
## Support for resource metrics

Any HPA target can be scaled based on the resource usage of the pods in the scaling target.
When defining the pod specification the resource requests like `cpu` and `memory` should
be specified. This is used to determine the resource utilization and used by the HPA controller
to scale the target up or down. To use resource utilization based scaling specify a metric source
like this:
-->
## 对资源指标的支持   {#support-for-resource-metrics}

HPA 的任何目标资源都可以基于其中的 Pods 的资源用量来实现扩缩。
在定义 Pod 规约时，类似 `cpu` 和 `memory` 这类资源请求必须被设定。
这些设定值被用来确定资源利用量并被 HPA 控制器用来对目标资源完成扩缩操作。
要使用基于资源利用率的扩缩，可以像下面这样指定一个指标源：

```yaml
type: Resource
resource:
  name: cpu
  target:
    type: Utilization
    averageUtilization: 60
```

<!--
With this metric the HPA controller will keep the average utilization of the pods in the scaling
target at 60%. Utilization is the ratio between the current usage of resource to the requested
resources of the pod. See [Algorithm](#algorithm-details) for more details about how the utilization
is calculated and averaged.
-->
基于这一指标设定，HPA 控制器会维持扩缩目标中的 Pods 的平均资源利用率在 60%。
利用率是 Pod 的当前资源用量与其请求值之间的比值。关于如何计算利用率以及如何计算平均值
的细节可参考[算法](#algorithm-details)小节。

{{< note >}}
<!--
Since the resource usages of all the containers are summed up the total pod utilization may not
accurately represent the individual container resource usage. This could lead to situations where
a single container might be running with high usage and the HPA will not scale out because the overall
pod usage is still within acceptable limits.
-->
由于所有的容器的资源用量都会被累加起来，Pod 的总体资源用量值可能不会精确体现
各个容器的资源用量。这一现象也会导致一些问题，例如某个容器运行时的资源用量非常
高，但因为 Pod 层面的资源用量总值让人在可接受的约束范围内，HPA 不会执行扩大
目标对象规模的操作。
{{< /note >}}

<!--
### Container Resource Metrics
-->
### 容器资源指标   {#container-resource-metrics}

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

<!--
`HorizontalPodAutoscaler` also supports a container metric source where the HPA can track the
resource usage of individual containers across a set of Pods, in order to scale the target resource.
This lets you configure scaling thresholds for the containers that matter most in a particular Pod.
For example, if you have a web application and a logging sidecar, you can scale based on the resource
use of the web application, ignoring the sidecar container and its resource use.
-->
`HorizontalPodAutoscaler` 也支持容器指标源，这时 HPA 可以跟踪记录一组 Pods 中各个容器的
资源用量，进而触发扩缩目标对象的操作。
容器资源指标的支持使得你可以为特定 Pod 中最重要的容器配置规模缩放阈值。
例如，如果你有一个 Web 应用和一个执行日志操作的边车容器，你可以基于 Web 应用的
资源用量来执行扩缩，忽略边车容器的存在及其资源用量。

<!--
If you revise the target resource to have a new Pod specification with a different set of containers,
you should revise the HPA spec if that newly added container should also be used for
scaling. If the specified container in the metric source is not present or only present in a subset
of the pods then those pods are ignored and the recommendation is recalculated. See [Algorithm](#algorithm-details)
for more details about the calculation. To use container resources for autoscaling define a metric
source as follows:
-->
如果你更改缩放目标对象，令其使用新的、包含一组不同的容器的 Pod 规约，你就需要
修改 HPA 的规约才能基于新添加的容器来执行规模扩缩操作。
如果指标源中指定的容器不存在或者仅存在于部分 Pods 中，那么这些 Pods 会被忽略，
HPA 会重新计算资源用量值。参阅[算法](#algorithm-details)小节进一步了解计算细节。
要使用容器资源用量来完成自动扩缩，可以像下面这样定义指标源：

```yaml
type: ContainerResource
containerResource:
  name: cpu
  container: application
  target:
    type: Utilization
    averageUtilization: 60
```

<!--
In the above example the HPA controller scales the target such that the average utilization of the cpu
in the `application` container of all the pods is 60%.
-->
在上面的例子中，HPA 控制器会对目标对象执行扩缩操作以确保所有 Pods 中
`application` 容器的平均 CPU 用量为 60%。

{{< note >}}
<!--
If you change the name of a container that a HorizontalPodAutoscaler is tracking, you can
make that change in a specific order to ensure scaling remains available and effective
whilst the change is being applied. Before you update the resource that defines the container
(such as a Deployment), you should update the associated HPA to track both the new and
old container names. This way, the HPA is able to calculate a scaling recommendation
throughout the update process.
-->
如果你要更改 HorizontalPodAutoscaler 所跟踪记录的容器的名称，你可以按一定顺序
来执行这一更改，确保在应用更改的过程中用来判定扩缩行为的容器可用。
在更新定义容器的资源（如 Deployment）之前，你需要更新相关的 HPA，使之能够同时
跟踪记录新的和老的容器名称。这样，HPA 就能够在整个更新过程中继续计算并提供扩缩操作建议。

<!--
Once you have rolled out the container name change to the workload resource, tidy up by removing
the old container name from the HPA specification.
-->
一旦你已经将容器名称变更这一操作应用到整个负载对象至上，就可以从 HPA
的规约中去掉老的容器名称，完成清理操作。
{{< /note >}}

<!--
## Support for multiple metrics

Kubernetes 1.6 adds support for scaling based on multiple metrics. You can use the `autoscaling/v2beta2` API
version to specify multiple metrics for the Horizontal Pod Autoscaler to scale on. Then, the Horizontal Pod
Autoscaler controller will evaluate each metric, and propose a new scale based on that metric. The largest of the
proposed scales will be used as the new scale.
-->
## 多指标支持   {#support-for-multiple-metrics}

Kubernetes 1.6 开始支持基于多个度量值进行扩缩。
你可以使用 `autoscaling/v2beta2` API 来为 Horizontal Pod Autoscaler 指定多个指标。
Horizontal Pod Autoscaler 会根据每个指标计算，并生成一个扩缩建议。
幅度最大的扩缩建议会被采纳。

<!--
## Support for custom metrics

Kubernetes 1.2 added alpha support for scaling based on application-specific metrics using special annotations.
Support for these annotations was removed in Kubernetes 1.6 in favor of the new autoscaling API.  While the old method for collecting
custom metrics is still available, these metrics will not be available for use by the Horizontal Pod Autoscaler, and the former
annotations for specifying which custom metrics to scale on are no longer honored by the Horizontal Pod Autoscaler controller.
-->
## 自定义指标支持   {#support-for-custom-metrics}

{{< note >}}
在 Kubernetes 1.2 增加了支持基于使用特殊注解表达的、特定于具体应用的扩缩能力，
此能力处于 Alpha 阶段。
从 Kubernetes 1.6 起，由于新的 autoscaling API 的引入，这些 annotation 就被废弃了。
虽然收集自定义指标的旧方法仍然可用，Horizontal Pod Autoscaler 调度器将不会再使用这些度量值。
同时，Horizontal Pod Autoscaler 也不再使用之前用于指定用户自定义指标的注解。
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
关于指标 API 的要求，请参阅[对 Metrics API 的支持](#support-for-metrics-apis)。

<!--
## Support for metrics APIs

By default, the HorizontalPodAutoscaler controller retrieves metrics from a series of APIs.  In order for it to access these
APIs, cluster administrators must ensure that:
-->
## 对 Metrics API 的支持   {#support-for-metrics-apis}

默认情况下，HorizontalPodAutoscaler 控制器会从一系列的 API 中检索度量值。
集群管理员需要确保下述条件，以保证 HPA 控制器能够访问这些 API：

<!--
* The [API aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) is enabled.

* The corresponding APIs are registered:

   * For resource metrics, this is the `metrics.k8s.io` API, generally provided by [metrics-server](https://github.com/kubernetes-sigs/metrics-server).
     It can be launched as a cluster addon.

   * For custom metrics, this is the `custom.metrics.k8s.io` API.  It's provided by "adapter" API servers provided by metrics solution vendors.
     Check with your metrics pipeline, or the [list of known solutions](https://github.com/kubernetes/metrics/blob/master/IMPLEMENTATIONS.md#custom-metrics-api).
     If you would like to write your own, check out the [boilerplate](https://github.com/kubernetes-sigs/custom-metrics-apiserver) to get started.

   * For external metrics, this is the `external.metrics.k8s.io` API.  It may be provided by the custom metrics adapters provided above.

* The `--horizontal-pod-autoscaler-use-rest-clients` is `true` or unset.  Setting this to false switches to Heapster-based autoscaling, which is deprecated.
-->
* 启用了 [API 聚合层](/zh/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

* 相应的 API 已注册：

   * 对于资源指标，将使用 `metrics.k8s.io` API，一般由 [metrics-server](https://github.com/kubernetes-incubator/metrics-server) 提供。
     它可以做为集群插件启动。
    
   * 对于自定义指标，将使用 `custom.metrics.k8s.io` API。
    它由其他度量指标方案厂商的“适配器（Adapter）” API 服务器提供。
    确认你的指标流水线，或者查看[已知方案列表](https://github.com/kubernetes/metrics/blob/master/IMPLEMENTATIONS.md#custom-metrics-api)。
    如果你想自己编写，请从 [boilerplate](https://github.com/kubernetes-sigs/custommetrics-apiserver)开始。
   
   * 对于外部指标，将使用 `external.metrics.k8s.io` API。可能由上面的自定义指标适配器提供。

* `--horizontal-pod-autoscaler-use-rest-clients` 参数设置为 `true` 或者不设置。 
  如果设置为 false，则会切换到基于 Heapster 的自动扩缩，这个特性已经被弃用了。

<!--  
For more information on these different metrics paths and how they differ please see the relevant design proposals for
[the HPA V2](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/autoscaling/hpa-v2.md),
[custom.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md)
and [external.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/external-metrics-api.md).
-->
关于指标来源以及其区别的更多信息，请参阅相关的设计文档，
[the HPA V2](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/autoscaling/hpa-v2.md)、
[custom.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md) 和
[external.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/external-metrics-api.md)。

<!--
For examples of how to use them see [the walkthrough for using custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
and [the walkthrough for using external metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects).
-->
关于如何使用它们的示例，请参考 
[使用自定义指标的教程](/zh/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
和[使用外部指标的教程](/zh/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects)。

<!--  
## Support for configurable scaling behavior

Starting from
[v1.18](https://github.com/kubernetes/enhancements/blob/master/keps/sig-autoscaling/20190307-configurable-scale-velocity-for-hpa.md)
the `v2beta2` API allows scaling behavior to be configured through the HPA
`behavior` field. Behaviors are specified separately for scaling up and down in
`scaleUp` or `scaleDown` section under the `behavior` field. A stabilization
window can be specified for both directions which prevents the flapping of the
number of the replicas in the scaling target. Similarly specifying scaling
policies controls the rate of change of replicas while scaling.
-->
## 支持可配置的扩缩 {#support-for-configurable-scaling-behaviour}

从 [v1.18](https://github.com/kubernetes/enhancements/blob/master/keps/sig-autoscaling/20190307-configurable-scale-velocity-for-hpa.md)
开始，`v2beta2` API 允许通过 HPA 的 `behavior` 字段配置扩缩行为。
在 `behavior` 字段中的 `scaleUp` 和 `scaleDown` 分别指定扩容和缩容行为。
可以两个方向指定一个稳定窗口，以防止扩缩目标中副本数量的波动。
类似地，指定扩缩策略可以控制扩缩时副本数的变化率。

<!--  
### Scaling Policies

One or more scaling policies can be specified in the `behavior` section of the spec.
When multiple policies are specified the policy which allows the highest amount of
change is the policy which is selected by default. The following example shows this behavior
while scaling down:
-->
### 扩缩策略 {#scaling-policies}
在 spec 字段的 `behavior` 部分可以指定一个或多个扩缩策略。
当指定多个策略时，默认选择允许更改最多的策略。
下面的例子展示了缩容时的行为:

```yaml
behavior:
  scaleDown:
    policies:
    - type: Pods
      value: 4
      periodSeconds: 60
    - type: Percent
      value: 10
      periodSeconds: 60
```

<!--  
When the number of pods is more than 40 the second policy will be used for scaling down.
For instance if there are 80 replicas and the target has to be scaled down to 10 replicas
then during the first step 8 replicas will be reduced. In the next iteration when the number
of replicas is 72, 10% of the pods is 7.2 but the number is rounded up to 8. On each loop of
the autoscaler controller the number of pods to be change is re-calculated based on the number
of current replicas. When the number of replicas falls below 40 the first policy _(Pods)_ is applied
and 4 replicas will be reduced at a time.
-->
当 Pod 数量超过 40 个时，第二个策略将用于缩容。
例如，如果有 80 个副本，并且目标必须缩小到 10 个副本，那么在第一步中将减少 8 个副本。
在下一轮迭代中，当副本的数量为 72 时，10% 的 Pod 数为 7.2，但是这个数字向上取整为 8。
在 autoscaler 控制器的每个循环中，将根据当前副本的数量重新计算要更改的 Pod 数量。
当副本数量低于 40 时，应用第一个策略 _（Pods）_ ，一次减少 4 个副本。

<!-- 
`periodSeconds` indicates the length of time in the past for which the policy must hold true.
The first policy allows at most 4 replicas to be scaled down in one minute. The second policy
allows at most 10% of the current replicas to be scaled down in one minute.
-->
`periodSeconds` 表示策略的时间长度必须保证有效。
第一个策略允许在一分钟内最多缩小 4 个副本。
第二个策略最多允许在一分钟内缩小当前副本的 10%。

<!--  
The policy selection can be changed by specifying the `selectPolicy` field for a scaling
direction. By setting the value to `Min` which would select the policy which allows the
smallest change in the replica count. Setting the value to `Disabled` completely disables
scaling in that direction.
-->
可以指定扩缩方向的 `selectPolicy` 字段来更改策略选择。
通过设置 `Min` 的值，它将选择副本数变化最小的策略。
将该值设置为 `Disabled` 将完全禁用该方向的缩放。

<!--  
### Stabilization Window

The stabilization window is used to restrict the flapping of replicas when the metrics
used for scaling keep fluctuating. The stabilization window is used by the autoscaling
algorithm to consider the computed desired state from the past to prevent scaling. In
the following example the stabilization window is specified for `scaleDown`.
-->
### 稳定窗口 {#stabilization-window}

当用于扩缩的指标持续抖动时，使用稳定窗口来限制副本数上下振动。
自动扩缩算法使用稳定窗口来考虑过去计算的期望状态，以防止扩缩。
在下面的例子中，稳定化窗口被指定为 `scaleDown`。

```yaml
scaleDown:
  stabilizationWindowSeconds: 300
```

<!--  
When the metrics indicate that the target should be scaled down the algorithm looks
into previously computed desired states and uses the highest value from the specified
interval. In above example all desired states from the past 5 minutes will be considered.
-->
当指标显示目标应该缩容时，自动扩缩算法查看之前计算的期望状态，并使用指定时间间隔内的最大值。
在上面的例子中，过去 5 分钟的所有期望状态都会被考虑。

<!--  
### Default Behavior

To use the custom scaling not all fields have to be specified. Only values which need to be
customized can be specified. These custom values are merged with default values. The default values
match the existing behavior in the HPA algorithm.
-->
### 默认行为 {#default-behavior}

要使用自定义扩缩，不必指定所有字段。
只有需要自定义的字段才需要指定。
这些自定义值与默认值合并。
默认值与 HPA 算法中的现有行为匹配。

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
  scaleUp:
    stabilizationWindowSeconds: 0
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
    - type: Pods
      value: 4
      periodSeconds: 15
    selectPolicy: Max
```

<!--  
For scaling down the stabilization window is _300_ seconds(or the value of the
`--horizontal-pod-autoscaler-downscale-stabilization` flag if provided). There is only a single policy
for scaling down which allows a 100% of the currently running replicas to be removed which
means the scaling target can be scaled down to the minimum allowed replicas.
For scaling up there is no stabilization window. When the metrics indicate that the target should be
scaled up the target is scaled up immediately. There are 2 policies where 4 pods or a 100% of the currently
running replicas will be added every 15 seconds till the HPA reaches its steady state.
-->
用于缩小稳定窗口的时间为 _300_  秒(或是 `--horizontal-pod-autoscaler-downscale-stabilization` 参数设定值)。
只有一种缩容的策略，允许 100% 删除当前运行的副本，这意味着扩缩目标可以缩小到允许的最小副本数。
对于扩容，没有稳定窗口。当指标显示目标应该扩容时，目标会立即扩容。
这里有两种策略，每 15 秒添加 4 个 Pod 或 100% 当前运行的副本数，直到 HPA 达到稳定状态。

<!--  
### Example: change downscale stabilization window

To provide a custom downscale stabilization window of 1 minute, the following
behavior would be added to the HPA:
--> 
### 示例：更改缩容稳定窗口

将下面的 behavior 配置添加到 HPA 中，可提供一个 1 分钟的自定义缩容稳定窗口：

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 60
```

<!--  
### Example: limit scale down rate

To limit the rate at which pods are removed by the HPA to 10% per minute, the
following behavior would be added to the HPA:
-->
### 示例：限制缩容速率

将下面的 behavior 配置添加到 HPA 中，可限制 Pod 被 HPA 删除速率为每分钟 10%：

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
```

<!--  
To ensure that no more than 5 Pods are removed per minute, you can add a second scale-down
policy with a fixed size of 5, and set `selectPolicy` to minimum. Setting `selectPolicy` to `Min` means
that the autoscaler chooses the policy that affects the smallest number of Pods:
-->
为了确保每分钟删除的 Pod 数不超过 5 个，可以添加第二个缩容策略，大小固定为 5，并将 `selectPolicy` 设置为最小值。
将 `selectPolicy` 设置为 `Min` 意味着 autoscaler 会选择影响 Pod 数量最小的策略:

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
    - type: Pods
      value: 5
      periodSeconds: 60
    selectPolicy: Min
```

<!--  
### Example: disable scale down

The `selectPolicy` value of `Disabled` turns off scaling the given direction.
So to prevent downscaling the following policy would be used:
-->

### 示例：禁用缩容

`selectPolicy` 的值 `Disabled` 会关闭对给定方向的缩容。
因此使用以下策略，将会阻止缩容：

```yaml
behavior:
  scaleDown:
    selectPolicy: Disabled
```

<!--
## Implicit maintenance-mode deactivation

You can implicitly deactivate the HPA for a target without the
need to change the HPA configuration itself. If the target's desired replica count
is set to 0, and the HPA's minimum replica count is greater than 0, the HPA 
stops adjusting the target (and sets the `ScalingActive` Condition on itself
to `false`) until you reactivate it by manually adjusting the target's desired
replica count or HPA's minimum replica count.
-->
## 隐式维护状态禁用

你可以在不必更改 HPA 配置的情况下隐式地为某个目标禁用 HPA。
如果此目标的期望副本个数被设置为 0，而 HPA 的最小副本个数大于 0，
则 HPA 会停止调整目标（并将其自身的 `ScalingActive` 状况设置为 `false`），
直到你通过手动调整目标的期望副本个数或 HPA 的最小副本个数来重新激活。

## {{% heading "whatsnext" %}}

<!--
* Design documentation: [Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md).
* kubectl autoscale command: [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* Usage example of [Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
-->
* 设计文档：[Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md)
* `kubectl autoscale` 命令：[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* 使用示例：[Horizontal Pod Autoscaler](/zh/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
