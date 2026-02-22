---
title: Pod 调度就绪态
content_type: concept
weight: 40
---
<!--
title: Pod Scheduling Readiness
content_type: concept
weight: 40
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.30" state="stable" >}}

<!--
Pods were considered ready for scheduling once created. Kubernetes scheduler
does its due diligence to find nodes to place all pending Pods. However, in a
real-world case, some Pods may stay in a "miss-essential-resources" state for a long period.
These Pods actually churn the scheduler (and downstream integrators like Cluster AutoScaler)
in an unnecessary manner.

By specifying/removing a Pod's `.spec.schedulingGates`, you can control when a Pod is ready
to be considered for scheduling.
-->
Pod 一旦创建就被认为准备好进行调度。
Kubernetes 调度程序尽职尽责地寻找节点来放置所有待处理的 Pod。
然而，在实际环境中，会有一些 Pod 可能会长时间处于"缺少必要资源"状态。
这些 Pod 实际上以一种不必要的方式扰乱了调度器（以及 Cluster AutoScaler 这类下游的集成方）。

通过指定或删除 Pod 的 `.spec.schedulingGates`，可以控制 Pod 何时准备好被纳入考量进行调度。

<!-- body -->

<!--
## Configuring Pod schedulingGates

The `schedulingGates` field contains a list of strings, and each string literal is perceived as a
criteria that Pod should be satisfied before considered schedulable. This field can be initialized
only when a Pod is created (either by the client, or mutated during admission). After creation,
each schedulingGate can be removed in arbitrary order, but addition of a new scheduling gate is disallowed.
-->
## 配置 Pod schedulingGates  {#configuring-pod-schedulinggates}

`schedulingGates` 字段包含一个字符串列表，每个字符串文字都被视为 Pod 在被认为可调度之前应该满足的标准。
该字段只能在创建 Pod 时初始化（由客户端创建，或在准入期间更改）。
创建后，每个 schedulingGate 可以按任意顺序删除，但不允许添加新的调度门控。

{{< figure src="/zh-cn/docs/images/podSchedulingGates.svg" alt="pod-scheduling-gates-diagram" caption="<!--Figure. Pod SchedulingGates-->图：Pod SchedulingGates" class="diagram-large" link="https://mermaid.live/edit#pako:eNplUctqFEEU_ZWispOejNPd6UxKcBVxJQjZabuo1KO7mO6upqo6GoZZCSIikp2KYuKDJApidKP0CP5Memay8hesfinBWt17zuHec-pOIZGUQQS1wYZtCxwpnA723DALM2CfHiFwW1JQff9WPX5VzcsOdlt4dfawKo-rd2-qJ0fn5aOL56eLZyedxLskOfu6nH_qGL9lFp_fV69PV78OVm-ftozgCOyQmNEiEVl00zoC5z_K5cfy98_DVnH3yj0wGFy3vnp_TSt476tr_5tjAyxP5hcvP_Sb2jE2R3VwfBmzxhcvvgDQ52hRvzfftNZH_UUkwVpvMw4mYw24SBK05rkBYRuONkpOGFrjnHf14L6gJkZ-_sAhMpGq4a51M2wQR7uO9hztO6KZF2bQgSlTKRbUHmha7w-hiVnKQohsSbGahDDMZlaHCyN39jMCkVEFc2CR03_3hIjjRFuUUWGkutVevDl8r7zRMH-FicSU2XYKzX5eiyOhjRUTmXER1XihEgvHxuQaDYc1vR4JExe760SmQy1ojJWJ97aCYeAGY-x6LNj08IbnUbI72hpz1x9xunl15GI4mzkwx9kdKXunsz8c5u0b" >}}

<!--
## Usage example

To mark a Pod not-ready for scheduling, you can create it with one or more scheduling gates like this:
-->
## 用法示例  {#usage-example}

要将 Pod 标记为未准备好进行调度，你可以在创建 Pod 时附带一个或多个调度门控，如下所示：

{{% code_sample file="pods/pod-with-scheduling-gates.yaml" %}}

<!--
After the Pod's creation, you can check its state using:
-->
Pod 创建后，你可以使用以下方法检查其状态：

```bash
kubectl get pod test-pod
```

<!--
The output reveals it's in `SchedulingGated` state:
-->
输出显示它处于 `SchedulingGated` 状态：

```none
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          7s
```

<!--
You can also check its `schedulingGates` field by running:
-->
你还可以通过运行以下命令检查其 `schedulingGates` 字段：

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

<!--
The output is:
-->
输出是：

```none
[{"name":"example.com/foo"},{"name":"example.com/bar"}]
```

<!--
To inform scheduler this Pod is ready for scheduling, you can remove its `schedulingGates` entirely
by reapplying a modified manifest:
-->
要通知调度程序此 Pod 已准备好进行调度，你可以通过重新应用修改后的清单来完全删除其 `schedulingGates`：

{{% code_sample file="pods/pod-without-scheduling-gates.yaml" %}}

<!--
You can check if the `schedulingGates` is cleared by running:
-->
你可以通过运行以下命令检查 `schedulingGates` 是否已被清空：

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

<!--
The output is expected to be empty. And you can check its latest status by running:
-->
预计输出为空，你可以通过运行下面的命令来检查它的最新状态：

```bash
kubectl get pod test-pod -o wide
```

<!--
Given the test-pod doesn't request any CPU/memory resources, it's expected that this Pod's state get
transited from previous `SchedulingGated` to `Running`:
-->
鉴于 test-pod 不请求任何 CPU/内存资源，预计此 Pod 的状态会从之前的
`SchedulingGated` 转变为 `Running`：

```none
NAME       READY   STATUS    RESTARTS   AGE   IP         NODE
test-pod   1/1     Running   0          15s   10.0.0.4   node-2
```

<!--
## Observability

The metric `scheduler_pending_pods` comes with a new label `"gated"` to distinguish whether a Pod
has been tried scheduling but claimed as unschedulable, or explicitly marked as not ready for
scheduling. You can use `scheduler_pending_pods{queue="gated"}` to check the metric result.
-->
## 可观测性  {#observability}

指标 `scheduler_pending_pods` 带有一个新标签 `"gated"`，
以区分 Pod 是否已尝试调度但被宣称不可调度，或明确标记为未准备好调度。
你可以使用 `scheduler_pending_pods{queue="gated"}` 来检查指标结果。

<!--
## Mutable Pod scheduling directives
-->
## 可变 Pod 调度指令    {#mutable-pod-scheduling-directives}

<!--
You can mutate scheduling directives of Pods while they have scheduling gates, with certain constraints.
At a high level, you can only tighten the scheduling directives of a Pod. In other words, the updated
directives would cause the Pods to only be able to be scheduled on a subset of the nodes that it would
previously match. More concretely, the rules for updating a Pod's scheduling directives are as follows:
-->
当 Pod 具有调度门控时，你可以在某些约束条件下改变 Pod 的调度指令。
在高层次上，你只能收紧 Pod 的调度指令。换句话说，更新后的指令将导致
Pod 只能被调度到它之前匹配的节点子集上。
更具体地说，更新 Pod 的调度指令的规则如下：

<!--
1. For `.spec.nodeSelector`, only additions are allowed. If absent, it will be allowed to be set.

2. For `spec.affinity.nodeAffinity`, if nil, then setting anything is allowed.
-->
1. 对于 `.spec.nodeSelector`，只允许增加。如果原来未设置，则允许设置此字段。

2. 对于 `spec.affinity.nodeAffinity`，如果当前值为 nil，则允许设置为任意值。

<!--
3. If `NodeSelectorTerms` was empty, it will be allowed to be set.
   If not empty, then only additions of `NodeSelectorRequirements` to `matchExpressions`
   or `fieldExpressions` are allowed, and no changes to existing `matchExpressions`
   and `fieldExpressions` will be allowed. This is because the terms in
   `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms`, are ORed
   while the expressions in `nodeSelectorTerms[].matchExpressions` and
   `nodeSelectorTerms[].fieldExpressions` are ANDed.
-->
3. 如果 `NodeSelectorTerms` 之前为空，则允许设置该字段。
   如果之前不为空，则仅允许增加 `NodeSelectorRequirements` 到 `matchExpressions`
   或 `fieldExpressions`，且不允许更改当前的 `matchExpressions` 和 `fieldExpressions`。
   这是因为 `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms`
   中的条目被执行逻辑或运算，而 `nodeSelectorTerms[].matchExpressions` 和
   `nodeSelectorTerms[].fieldExpressions` 中的表达式被执行逻辑与运算。

<!--
4. For `.preferredDuringSchedulingIgnoredDuringExecution`, all updates are allowed.
   This is because preferred terms are not authoritative, and so policy controllers
   don't validate those terms.
-->
4. 对于 `.preferredDuringSchedulingIgnoredDuringExecution`，所有更新都被允许。
   这是因为首选条目不具有权威性，因此策略控制器不会验证这些条目。

## {{% heading "whatsnext" %}}

<!--
* Read the [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) for more details
-->
* 阅读 [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness)
  了解更多详情
