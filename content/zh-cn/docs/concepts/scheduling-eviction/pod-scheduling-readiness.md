---
title: Pod 调度就绪状态
content_type: concept
weight: 40
---

<!--
---
title: Pod Scheduling Readiness
content_type: concept
weight: 40
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

<!--
Pods were considered ready for scheduling once created. Kubernetes scheduler
does its due diligence to find nodes to place all pending Pods. However, in a
real-world case, some Pods may stay in a "miss-essential-resources" state for a long period.
These Pods actually churn the scheduler (and downstream integrators like Cluster AutoScaler)
in an unnecessary manner.
-->
之前，Pod 一旦创建就被认为可以进行调度。Kubernetes调度器会尽职尽责地寻找节点来放置所有待定的Pod。
然而，在现实场景中，一些 Pod 可能会长期处于“缺失必要资源”状态。
这些 Pod 实际上在以不必要的方式搅动调度器（和下游集成商，如Cluster AutoScaler）。

<!--
By specifying/removing a Pod's `.spec.schedulingGates`, you can control when a Pod is ready
to be considered for scheduling.
-->
通过指定/删除一个 Pod 的 `.spec.schedulingGates` ，你可以控制一个 Pod 何时准备被进行调度。

<!-- body -->

<!--
## Configuring Pod schedulingGates
-->
## 配置 Pod 的调度门控

<!--
The `schedulingGates` field contains a list of strings, and each string literal is perceived as a
criteria that Pod should be satisfied before considered schedulable. This field can be initialized
only when a Pod is created (either by the client, or mutated during admission). After creation,
each schedulingGate can be removed in arbitrary order, but addition of a new scheduling gate is disallowed.
-->

`schedulingGates` 字段包含一个字符串列表，每个字符串都为 Pod 在可调度之前应该满足的准则。
这个字段只能在 Pod 被创建时（由客户端创建，或在准入过程中突变）初始化。
在创建之后，每个调度门控可以按任意顺序被删除，但不允许增加新的调度门控。

{{<mermaid>}}
stateDiagram-v2
s1: pod 创建
s2: pod 调度受阻
s3: pod 调度就绪
s4: pod 运行
if: 空的调度门控?
state if <<choice>>
[*] --> s1
s1 --> if
s2 --> if: 调度门控被移除
if --> s2: 否
if --> s3: 是
s3 --> s4
s4 --> [*]
{{< /mermaid >}}

<!--
## Usage example
-->
## 使用示例

<!--
To mark a Pod not-ready for scheduling, you can create it with one or more scheduling gates like this:

{{< codenew file="pods/pod-with-scheduling-gates.yaml" >}}

After the Pod's creation, you can check its state using:
-->
要标记一个 Pod 未调度就绪，你可以像这样创建它，其中包含一个或多个调度门控：

{{< codenew file="pods/pod-with-scheduling-gates.yaml" >}}

创建 Pod 之后，你可以使用以下命令检查其状态：

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
你也可以通过运行以下命令检查其 `schedulingGates` 字段：

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

<!--
The output is:
-->
输出：

```none
[{"name":"foo"},{"name":"bar"}]
```

<!--
To inform scheduler this Pod is ready for scheduling, you can remove its `schedulingGates` entirely
by re-applying a modified manifest:

{{< codenew file="pods/pod-without-scheduling-gates.yaml" >}}

You can check if the `schedulingGates` is cleared by running:
-->
要通知调度器这个 Pod 已经准备好进行调度，你可以通过重新应用修改过的清单来完全删除其 `schedulingGates` ：

{{< codenew file="pods/pod-without-scheduling-gates.yaml" >}}

你可以通过运行以下命令检查 `schedulingGates` 是否已被清除：

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

<!--
The output is expected to be empty. And you can check its latest status by running:
-->
输出应该为空。你可以通过运行以下命令检查其最新状态：

```bash
kubectl get pod test-pod -o wide
```

<!--
Given the test-pod doesn't request any CPU/memory resources, it's expected that this Pod's state get
transited from previous `SchedulingGated` to `Running`:
-->
考虑到 test-pod 没有请求任何 CPU/内存资源，预期这个 Pod 的状态从之前的 `SchedulingGated` 转换为 `Running` ：

```none
NAME       READY   STATUS    RESTARTS   AGE   IP         NODE  
test-pod   1/1     Running   0          15s   10.0.0.4   node-2
```

<!--
## Observability
-->
## 可观测性 (Observability)

<!--
The metric `scheduler_pending_pods` comes with a new label `"gated"` to distinguish whether a Pod
has been tried scheduling but claimed as unschedulable, or explicitly marked as not ready for
scheduling. You can use `scheduler_pending_pods{queue="gated"}` to check the metric result.
-->
指标 `scheduler_pending_pods` 带有一个新的标签 `"gated"` ，
用于区分 Pod 是否已经尝试调度但被声明为不可调度，或者是否被显式标记为未准备好调度。
你可以使用 `scheduler_pending_pods{queue="gated"}` 来检查指标结果。

## {{% heading "whatsnext" %}}

<!--
* Read the [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) for more details
-->
* 阅读 [Pod 调度就绪状态 KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) 以了解更多细节