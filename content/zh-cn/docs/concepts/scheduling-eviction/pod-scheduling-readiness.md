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

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

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
这些 Pod 实际上以一种不必要的方式扰乱了调度器（以及下游的集成方，如 Cluster AutoScaler）。

通过指定或删除 Pod 的 `.spec.schedulingGates`，可以控制 Pod 何时准备好被纳入考量进行调度。

<!-- body -->

<!--
## Configuring Pod schedulingGates

The `schedulingGates` field contains a list of strings, and each string literal is perceived as a
criteria that Pod should be satisfied before considered schedulable. This field can be initialized
only when a Pod is created (either by the client, or mutated during admission). After creation,
each schedulingGate can be removed in arbitrary order, but addition of a new scheduling gate is disallowed.
-->
## 配置 Pod schedulingGates

`schedulingGates` 字段包含一个字符串列表，每个字符串文字都被视为 Pod 在被认为可调度之前应该满足的标准。
该字段只能在创建 Pod 时初始化（由客户端创建，或在准入期间更改）。
创建后，每个 schedulingGate 可以按任意顺序删除，但不允许添加新的调度门控。

<!--
{{<mermaid>}}
stateDiagram-v2
    s1: 创建 Pod
    s2: pod scheduling gated
    s3: pod scheduling ready
    s4: pod running
    if: empty scheduling gates?
    [*] --> s1
    s1 --> if
    s2 --> if: scheduling gate removed
    if --> s2: no
    if --> s3: yes  
    s3 --> s4
    s4 --> [*]
{{< /mermaid >}}
-->
{{<mermaid>}}
stateDiagram-v2
    s1: 创建 Pod
    s2: Pod 调度门控
    s3: Pod 调度就绪
    s4: Pod 运行
    if: 调度门控为空？
    [*] --> s1
    s1 --> if
    s2 --> if: 移除了调度门控
    if --> s2: 否
    if --> s3: 是  
    s3 --> s4
    s4 --> [*]
{{< /mermaid >}}

<!--
## Usage example

To mark a Pod not-ready for scheduling, you can create it with one or more scheduling gates like this:

{{< codenew file="pods/pod-with-scheduling-gates.yaml" >}}

After the Pod's creation, you can check its state using:
-->
## 用法示例

要将 Pod 标记为未准备好进行调度，你可以在创建 Pod 时附带一个或多个调度门控，如下所示：

{{< codenew file="pods/pod-with-scheduling-gates.yaml" >}}

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
[{"name":"foo"},{"name":"bar"}]
```

<!--
To inform scheduler this Pod is ready for scheduling, you can remove its `schedulingGates` entirely
by re-applying a modified manifest:

{{< codenew file="pods/pod-without-scheduling-gates.yaml" >}}

You can check if the `schedulingGates` is cleared by running:
-->
要通知调度程序此 Pod 已准备好进行调度，你可以通过重新应用修改后的清单来完全删除其 `schedulingGates`：

{{< codenew file="pods/pod-without-scheduling-gates.yaml" >}}

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
鉴于 test-pod 不请求任何 CPU/内存资源，预计此 Pod 的状态会从之前的 `SchedulingGated` 转变为 `Running`：

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
## 可观测性

指标 `scheduler_pending_pods` 带有一个新标签 `"gated"`，
以区分 Pod 是否已尝试调度但被宣称不可调度，或明确标记为未准备好调度。
你可以使用 `scheduler_pending_pods{queue="gated"}` 来检查指标结果。

## {{% heading "whatsnext" %}}

<!--
* Read the [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) for more details
-->

* 阅读 [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) 了解更多详情
