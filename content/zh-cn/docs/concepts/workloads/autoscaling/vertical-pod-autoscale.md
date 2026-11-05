---
title: Pod 垂直自动扩缩
feature:
  title: 垂直扩缩
  description: >
    根据实际使用情况自动调整资源请求和限制。
content_type: concept
weight: 70
math: true
---
<!--
reviewers:
- adrianmoisey
- omerap12
title: Vertical Pod Autoscaling
feature:
  title: Vertical scaling
  description: >
    Automatically adjust resource requests and limits based on actual usage patterns.
content_type: concept
weight: 70
math: true
-->

<!-- overview -->

<!--
In Kubernetes, a _VerticalPodAutoscaler_ automatically updates a workload management resource (such as
a Deployment or StatefulSet), with the
aim of automatically adjusting infrastructure resource
requests and limits to match actual usage.
-->
在 Kubernetes 中，**VerticalPodAutoscaler** 会自动更新工作负载管理
{{< glossary_tooltip text="资源" term_id="api-resource" >}}
（例如 {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 或
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}），
目的是自动调整基础设施{{< glossary_tooltip text="资源" term_id="infrastructure-resource" >}}的
[请求和限制](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)以匹配实际使用情况。

<!--
Vertical scaling means that the response to increased resource demand is to assign more resources (for example: memory or CPU)
to the Pods that are already running for the workload.
This is also known as _rightsizing_, or sometimes _autopilot_.
This is different from horizontal scaling, which for Kubernetes would mean deploying more Pods to distribute the load.
-->
垂直扩缩意味着对资源需求增加的响应是为该工作负载已经在运行的
{{< glossary_tooltip text="Pod" term_id="pod" >}} 分配更多资源（例如：内存或 CPU）。
这也被称为 _rightsizing_（资源合理化），有时也称为 _autopilot_。
这与水平扩缩不同，对于 Kubernetes 而言，水平扩缩意味着部署更多 Pod 来分担负载。

<!--
If the resource usage decreases, and the Pod resource requests are above optimal levels,
the VerticalPodAutoscaler instructs the workload resource (the Deployment, StatefulSet, or other similar resource)
to adjust resource requests back down, preventing resource waste.
-->
如果资源使用量下降，且 Pod 的资源请求高于最佳水平，
VerticalPodAutoscaler 会指示工作负载资源（Deployment、StatefulSet 或其他类似资源）
将资源请求调低，以防止资源浪费。

<!--
The VerticalPodAutoscaler is implemented as a Kubernetes API resource and a
controller.
The resource determines the behavior of the controller.
The vertical pod autoscaling controller, running within the Kubernetes data plane,
periodically adjusts the resource requests and limits of its target (for example, a Deployment)
based on analysis of historical resource utilization,
the amount of resources available in the cluster, and real-time events such as out-of-memory (OOM) conditions.
-->
VerticalPodAutoscaler 被实现为一个 Kubernetes API 资源和一个
{{< glossary_tooltip text="控制器" term_id="controller" >}}。
该资源决定控制器的行为。
垂直 Pod 自动扩缩控制器运行在 Kubernetes 数据平面内，
基于对历史资源利用情况的分析、集群中可用资源的数量以及诸如内存溢出（OOM）等实时事件，
周期性地调整其目标（例如 Deployment）的资源请求和限制。

<!-- body -->

## API 对象

<!--
The VerticalPodAutoscaler is defined as a Custom Resource Definition (CRD) in Kubernetes. Unlike HorizontalPodAutoscaler, which is part of the core Kubernetes API, VPA must be installed separately in your cluster.
-->
VerticalPodAutoscaler 在 Kubernetes 中被定义为一个
{{< glossary_tooltip text="自定义资源定义" term_id="customresourcedefinition" >}}（CRD）。
与作为 Kubernetes 核心 API 一部分的 HorizontalPodAutoscaler 不同，VPA 必须在你的集群中单独安装。

<!--
The current stable API version is `autoscaling.k8s.io/v1`. More details about the VPA installation and API can be found in the VPA GitHub repository.
-->
当前稳定的 API 版本是 `autoscaling.k8s.io/v1`。
关于 VPA 安装和 API 的更多细节可以在 [VPA GitHub 仓库](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)中找到。

## VerticalPodAutoscaler 是如何工作的？

{{< figure
  src="/images/docs/concepts/vpa-architecture.svg"
  alt="Vertical Pod Autoscaling architecture"
  class="diagram-large"
  caption="图 1. VerticalPodAutoscaler 控制 Deployment 中 Pod 的资源请求和限制"
>}}

<!-- https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqlVG1P2zAQ_iuW-RpY0rVNG6RJpSkSH9hQuzFpLZo850o9nDiznQKj_PddYqcvMGmaSKXG53vuuefuHD9RrjKgCb3VrFyRs8-LguBjqh9uY1SWUnBmhSrIV6XvpGKZg9QPV4XVSkrQ8xRKqR5zKCx5R6Zj_JtZZmFZyRnYm11IqbL5lcrQP8ZgJgrQ3guFZ3b_OVgtuJlfujeZgV5vsawU89HVxYvNLBfGoNL59dWIjFqrSeRU3uwnWJfsO9fza9AWK5QoalRZZXAJmoynqQdr4CrHujIssubdsz2iKjOs1Hn9Gj0HVZDj4w_7ka-oa8BmZpUGQ6btdtN2s_FKW0pnNQHjFfA7Q5ZKE75ixS0g2Cs4kNaAJ2vBrSF18xH_pfEYIgpSSsZhszdMF7uzm_Ap_KrAIEEB9zXJph5CqwmXDeij85Gxhkb8ZjeUFzPynNgdWKMMWYuxu4746Lby16EXxU_gXg02TVWaA1kzWdU9-IuyRhEYp_wfpbZV3Au7Ip9KK3ImcSouCdLjGW7puWTGpLCslZKlkDI5Gp6Pe5NBYJDxDpKjaIK_1JvH9yKzqyQqHwKupNKt-_QFG9eZZ0t7o_5Z-ja29hA6xvPzdNjvv42RlaVnO-un8ej_q93j2_8MAn9gg92wsbH72dvjjx062G5r9O8D3268AY6uFn9KA7zxREYTqysIaA46Z7VJn-rABbUryGFBE1xmsGSVtAu6KJ4xrGTFN6XyNlKr6nZFkyWTBi0nPxUMb88txG1OMoGf9xbJ8K6ZPRZ8y9PUP1ZVYWkSdZs8NHmiDzSJOyedXhiGUe_9IIw63SigjzQZhCfhMO5FcTwcdgaDuPsc0N-NsPBkENf4MBr0O_1uNx4GFJrsl-6ub6785z9_1f9X -->

<!--
Kubernetes implements vertical pod autoscaling through multiple cooperating components that run intermittently (it is not a continuous process). The VPA consists of three main components:

* The _recommender_, which analyzes resource usage and provides recommendations.
* The _updater_, that Pod resource requests either by evicting Pods or modifying them in place.
* And the VPA _admission controller_ webhook, which applies resource recommendations to new or recreated Pods.
-->
Kubernetes 通过多个间歇性运行的协作组件来实现垂直 Pod 自动扩缩（这不是一个持续运行的过程）。VPA 由三个主要组件组成：

* **推荐器（recommender）**：分析资源使用情况并提供推荐值。
* **更新器（updater）**：通过驱逐 Pod 或原地修改 Pod 来调整 Pod 的资源请求。
* **VPA 准入控制器（admission controller）Webhook**：将资源推荐值应用到新建或重新创建的 Pod 上。

<!--
Once during each period, the Recommender queries the resource utilization for Pods targeted by each VerticalPodAutoscaler definition. The Recommender finds the target resource defined by the `targetRef`, then selects the pods based on the target resource's `.spec.selector` labels, and obtains the metrics from the resource metrics API to analyze actual CPU and memory consumption.
-->
在每个周期中，推荐器会查询一次每个 VerticalPodAutoscaler 定义所针对的 Pod 的资源利用率。
推荐器通过 `targetRef` 找到目标资源，然后根据目标资源的 `.spec.selector` 标签选出 Pod，
并从资源指标 API 获取指标数据，以分析实际的 CPU 和内存消耗。

<!--
The Recommender analyzes both current and historical resource usage data (CPU and memory) for each Pod targeted by the VerticalPodAutoscaler. It examines:
- Historical consumption patterns over time to identify trends
- Peak usage and variance to ensure sufficient headroom
- Out-of-memory (OOM) events and other resource-related incidents
-->
推荐器会分析 VerticalPodAutoscaler 所针对的每个 Pod 的当前和历史资源使用数据（CPU 和内存）。它会考察：
- 历史消耗模式随时间的变化趋势
- 峰值使用量和波动幅度，以确保留有足够的余量
- 内存溢出（OOM）事件和其他资源相关事件

<!--
Based on this analysis, the Recommender calculates three types of recommendations:
- Target recommendation (optimal resources for typical usage)
- Lower bound (minimum viable resources)
- Upper bound (maximum reasonable resources).
-->
基于这些分析，推荐器会计算三类推荐值：
- 目标推荐值（典型使用情况下的最优资源量）
- 下限（最小可用资源量）
- 上限（最大合理资源量）

<!--
These recommendations are stored in the VerticalPodAutoscaler resource's `.status.recommendation` field.
-->
这些推荐值会被存储在 VerticalPodAutoscaler 资源的 `.status.recommendation` 字段中。

<!--
The _updater_ component monitors the VerticalPodAutoscaler resources and compares current Pod resource requests with the recommendations. When the difference exceeds configured thresholds and the update policy allows it, the updater can either:

- Evict Pods, triggering their recreation with new resource requests (traditional approach)
- Update Pod resources in place without eviction, when the cluster supports in-place Pod resource updates
-->
**更新器**组件监视 VerticalPodAutoscaler 资源，并将当前 Pod 的资源请求与推荐值进行比较。
当差值超过配置的阈值且更新策略允许时，更新器可以：

- 驱逐 Pod，触发其以新的资源请求重新创建（传统方式）
- 在集群支持原地更新 Pod 资源时，不驱逐 Pod 而原地更新 Pod 资源

<!--
The chosen method depends on the configured update mode, cluster capabilities, and the type of resource change needed. In-place updates, when available, avoid Pod disruption but may have limitations on which resources can be modified. The updater respects PodDisruptionBudgets to minimize service impact.
-->
所选方式取决于配置的更新模式、集群能力以及所需的资源变更类型。
在可用时，原地更新可以避免 Pod 中断，但对可修改的资源类型可能有限制。
更新器会遵守 PodDisruptionBudget，以尽量减小对服务的影响。

<!--
The _admission controller_ operates as a mutating webhook that intercepts Pod creation requests. It
checks if the Pod is targeted by a VerticalPodAutoscaler and, if so, applies the recommended
resource requests and limits before the Pod is created. More specifically, the admission controller uses the Target recommendation in the VerticalPodAutoscaler resource's `.status.recommendation` stanza as the new resource requests. The admission controller ensures new Pods start with appropriately sized resource allocations, whether they're created during initial deployment, after an eviction by the updater, or due to scaling operations.
-->
**准入控制器**作为一个变更（mutating）Webhook 运行，拦截 Pod 创建请求。
它会检查该 Pod 是否被某个 VerticalPodAutoscaler 所针对，如果是，
则在 Pod 创建之前应用推荐的资源请求和限制。更具体地说，准入控制器使用
VerticalPodAutoscaler 资源的 `.status.recommendation` 段中的目标推荐值作为新的资源请求。
准入控制器确保新 Pod 以合适大小的资源分配启动，
无论这些 Pod 是在初始部署期间创建的、被更新器驱逐之后创建的，还是因扩缩操作而创建的。

<!--
The VerticalPodAutoscaler requires a metrics source, such as Kubernetes' Metrics Server add-on,
to be installed in the cluster.
The VPA components fetch metrics from the `metrics.k8s.io` API. The Metrics Server needs to be launched separately as it is not deployed by default in most clusters. For more information about resource metrics, see Metrics Server.
-->
VerticalPodAutoscaler 需要在集群中安装指标来源，
例如 Kubernetes 的 Metrics Server {{< glossary_tooltip text="插件" term_id="addons" >}}。
VPA 组件从 `metrics.k8s.io` API 获取指标。Metrics Server 需要单独启动，
因为在大多数集群中它默认并未部署。有关资源指标的更多信息，
请参见 [Metrics Server](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server)。

## 更新模式

<!--
A VerticalPodAutoscaler supports different _update modes_ that control how and when
resource recommendations are applied to your Pods. You configure the update mode using
the `updateMode` field in the VPA spec under `updatePolicy`:
-->
VerticalPodAutoscaler 支持不同的**更新模式**，用于控制资源推荐值
以何种方式、在何时应用到你的 Pod 上。你可以通过 `updatePolicy` 下的
`updateMode` 字段来配置更新模式：

```yaml
---
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"  # Off, Initial, Recreate, InPlaceOrRecreate, InPlace
```

### Off {#updateMode-Off}

<!--
In the _Off_ update mode, the VPA recommender still analyzes resource usage and generates
recommendations, but these recommendations are not automatically applied to Pods.
The recommendations are only stored in the VPA object's `.status` field.
-->
在 **Off** 更新模式下，VPA 推荐器仍然会分析资源使用情况并生成推荐值，
但这些推荐值不会自动应用到 Pod 上。
推荐值只会存储在 VPA 对象的 `.status` 字段中。

<!--
You can use a tool such as `kubectl` to view the `.status` and the recommendations in it.
-->
你可以使用 `kubectl` 等工具查看 `.status` 及其中的推荐值。

### Initial {#updateMode-Initial}

<!--
In _Initial_ mode, VPA only sets resource requests when Pods are first created. It does not update resources for already running Pods, even if recommendations change over time. The recommendations apply only during Pod creation.
-->
在 **Initial** 模式下，VPA 仅在 Pod 首次创建时设置资源请求。
即使推荐值随时间变化，它也不会更新已经在运行的 Pod 的资源。
推荐值仅在 Pod 创建期间生效。

### Recreate {#updateMode-Recreate}

<!--
In _Recreate_ mode, VPA actively manages Pod resources by evicting Pods when their current
resource requests differ significantly from recommendations. When a Pod is evicted, the workload
controller (managing a Deployment, StatefulSet, etc) creates a replacement Pod, and the VPA admission
controller applies the updated resource requests to the new Pod.
-->
在 **Recreate** 模式下，当 Pod 当前的资源请求与推荐值存在显著差异时，
VPA 会通过驱逐 Pod 来主动管理 Pod 资源。当某个 Pod 被驱逐后，
工作负载控制器（管理 Deployment、StatefulSet 等的控制器）会创建一个替代 Pod，
VPA 准入控制器会将更新后的资源请求应用到新 Pod 上。

### InPlaceOrRecreate {#updateMode-InPlaceOrRecreate}

<!--
In `InPlaceOrRecreate` mode, VPA attempts to update Pod resource requests and limits without restarting the Pod when possible. However, if in-place updates cannot be performed for a particular resource change, VPA falls back to evicting the Pod
(similar to `Recreate` mode) and allowing the workload controller to create a replacement Pod with updated resources.
-->
在 `InPlaceOrRecreate` 模式下，VPA 会在可能时尝试在不重启 Pod 的情况下
更新 Pod 的资源请求和限制。然而，如果某个资源变更无法执行原地更新，
VPA 会退回到驱逐 Pod 的方式（类似于 `Recreate` 模式），
并让工作负载控制器以更新后的资源创建替代 Pod。

<!--
In this mode, the updater applies recommendations in-place using the Resize Container Resources In-Place feature.
-->
在该模式下，更新器使用[原地调整容器资源](/docs/tasks/configure-pod-container/resize-container-resources/)特性来原地应用推荐值。

### InPlace {#updateMode-InPlace}

<!--
This mode is available as an alpha feature in VPA 1.7.0 and requires
Kubernetes 1.33 or later with the `InPlacePodVerticalScaling` cluster feature
gate enabled, and the `InPlace` feature gate enabled on the VPA updater and
admission controller. It uses the
in-place Pod resize
feature to apply updates without disrupting the Pod.
-->
该模式在 VPA 1.7.0 中作为 alpha 特性提供，要求 Kubernetes 1.33 或更高版本，
并启用 `InPlacePodVerticalScaling` 集群特性门控，
同时在 VPA 更新器和准入控制器上启用 `InPlace` 特性门控。
它使用[原地 Pod 扩缩](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize)特性
在不中断 Pod 的情况下应用更新。

<!--
In `InPlace` mode, VPA attempts to update Pod resource requests and limits without
restarting or evicting the Pod. Unlike `InPlaceOrRecreate`, this mode **never falls
back to eviction**. If an in-place update cannot be applied (for example, because the
node does not have enough capacity), VPA defers the update and retries it in a
subsequent reconciliation loop.
-->
在 `InPlace` 模式下，VPA 会尝试在不重启、不驱逐 Pod 的情况下更新 Pod 的资源请求和限制。
与 `InPlaceOrRecreate` 不同，该模式**永远不会退回到驱逐**。
如果无法应用原地更新（例如节点没有足够的容量），VPA 会推迟该更新，
并在后续的调谐循环中重试。

<!--
To use `InPlace` mode, enable the `InPlace` feature gate on both the VPA updater
and admission controller:
-->
要使用 `InPlace` 模式，请在 VPA 更新器和准入控制器上启用 `InPlace` 特性门控：

```shell
--feature-gates=InPlace=true
```

<!--
Then set `updateMode` to `"InPlace"` in your VPA spec:
-->
然后在你的 VPA 规约中将 `updateMode` 设置为 `"InPlace"`：

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "InPlace"
```

<!--
**Key difference from `InPlaceOrRecreate`:** When a resize is deferred, in progress,
or infeasible, `InPlace` mode always waits and retries — it never evicts the Pod,
regardless of how long the update is pending.
-->
**与 `InPlaceOrRecreate` 的关键区别：** 当扩缩被推迟、正在进行中或不可行时，
`InPlace` 模式始终会等待并重试——无论更新被搁置多久，它都不会驱逐 Pod。

### Auto（已弃用） {#updateMode-Auto}

{{< note >}}
<!--
The `Auto` update mode is **deprecated since VPA version 1.4.0**. Use `Recreate` for
eviction-based updates, or `InPlaceOrRecreate` for in-place updates with eviction fallback.
-->
`Auto` 更新模式**自 VPA 1.4.0 版本起已弃用**。对于基于驱逐的更新请使用 `Recreate`，
对于带回退驱逐的原地更新请使用 `InPlaceOrRecreate`。
{{< /note >}}

<!--
`Auto` mode is currently an alias for `Recreate` mode and behaves identically. It was introduced to allow for future expansion of automatic update strategies.
-->
`Auto` 模式目前是 `Recreate` 模式的别名，行为完全相同。
引入该模式是为了给未来自动更新策略的扩展留出空间。

## 资源策略

<!--
Resource policies allow you to fine-tune how the VerticalPodAutoscaler generates recommendations and applies updates.
You can set boundaries for resource recommendations, specify which resources to manage, and configure different policies for individual containers within a Pod.
-->
资源策略允许你微调 VerticalPodAutoscaler 生成推荐值和应用更新的方式。
你可以为资源推荐值设置边界、指定要管理哪些资源，
并为 Pod 内的各个容器配置不同的策略。

<!--
You define resource policies in the `resourcePolicy` field of the VPA spec:
-->
你可以在 VPA 规约的 `resourcePolicy` 字段中定义资源策略：

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"
  resourcePolicy:
    containerPolicies:
    - containerName: "application"
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
      controlledResources:
      - cpu
      - memory
      controlledValues: RequestsAndLimits
```

#### minAllowed 与 maxAllowed

<!--
These fields set boundaries for VPA recommendations.
The VPA will never recommend resources below `minAllowed` or above `maxAllowed`, even if the actual usage data suggests different values.
-->
这些字段为 VPA 推荐值设置边界。
即使实际使用数据建议不同的值，VPA 也永远不会推荐低于 `minAllowed`
或高于 `maxAllowed` 的资源量。

#### controlledResources

<!--
The `controlledResources` field specifies which resource types VPA should manage for a container in a Pod.
If not specified, VPA manages both CPU and memory by default. You can restrict VPA to manage only specific resources.
Valid resource names include `cpu` and `memory`.
-->
`controlledResources` 字段指定 VPA 应该为 Pod 中的容器管理哪些资源类型。
如果未指定，VPA 默认同时管理 CPU 和内存。你可以限制 VPA 只管理特定的资源。
有效的资源名称包括 `cpu` 和 `memory`。

### controlledValues

<!--
The `controlledValues` field determines whether VPA controls resource requests, limits, or both:
-->
`controlledValues` 字段决定 VPA 控制资源请求、限制还是两者都控制：

RequestsAndLimits
: VPA 同时设置请求和限制。限制会基于 Pod 规约中定义的请求-限制比例随请求按比例缩放。这是默认模式。

RequestsOnly
: VPA 只设置请求，保持限制不变。限制仍然会被遵守，如果用量超过限制，仍可能触发限流或内存溢出终止（OOM kill）。

<!--
See requests and limits to learn more about those two concepts.
-->
参见[请求和限制](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)以进一步了解这两个概念。

## LimitRange 资源

<!--
The admission controller and updater VPA components post-process recommendations to comply with the constraints defined in LimitRanges. The LimitRange resources with `type` Pod and Container are checked in the Kubernetes cluster.
-->
VPA 的准入控制器和更新器组件会对推荐值进行后处理，以符合 [LimitRange](/docs/concepts/policy/limit-range/) 中定义的约束。Kubernetes 集群中 `type` 为 Pod 和 Container 的 LimitRange 资源都会被检查。

<!--
For example, if the `max` field in a Container LimitRange resource is exceeded, both VPA components lower the limit to the value defined in the `max` field, and the request is proportionally decreased to maintain the request-to-limit ratio in the Pod spec.
-->
例如，如果超出了某个 Container LimitRange 资源中的 `max` 字段，
这两个 VPA 组件都会将限制降低到 `max` 字段定义的值，
并按比例降低请求，以保持 Pod 规约中的请求-限制比例。

## {{% heading "whatsnext" %}}

<!--
If you configure autoscaling in your cluster, you may also want to consider using
node autoscaling
to ensure you are running the right number of nodes.
You can also read more about _horizontal_ Pod autoscaling.
-->
如果你在集群中配置了自动扩缩，你可能还想考虑使用
[节点自动扩缩](/docs/concepts/cluster-administration/node-autoscaling/)
来确保运行合适数量的节点。
你还可以进一步了解 [_水平_ Pod 自动扩缩](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)。
