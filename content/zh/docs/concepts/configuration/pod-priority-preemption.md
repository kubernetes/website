---
title: Pod 优先级与抢占
content_type: concept
weight: 70
---
<!--
reviewers:
- davidopp
- wojtek-t
title: Pod Priority and Preemption
content_type: concept
weight: 70
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

<!--
[Pods](/docs/concepts/workloads/pods/pod/) can have _priority_. Priority indicates the
importance of a Pod relative to other Pods. If a Pod cannot be scheduled, the
scheduler tries to preempt (evict) lower priority Pods to make scheduling of the
pending Pod possible.
-->
[Pods](/zh/docs/concepts/workloads/pods/pod/) 可以有*优先级（Priority）*。
优先级体现的是当前 Pod 与其他 Pod 相比的重要程度。如果 Pod 无法被调度，则
调度器会尝试抢占（逐出）低优先级的 Pod，从而使得悬决的 Pod 可被调度。

<!-- body -->

<!--
In a cluster where not all users are trusted, a malicious user could create Pods
at the highest possible priorities, causing other Pods to be evicted/not get
scheduled.
An administrator can use ResourceQuota to prevent users from creating pods at
high priorities.

See [limit Priority Class consumption by default](/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
for details.
-->
{{< warning >}}
在一个并非所有用户都可信任的集群中，一个有恶意的用户可能创建优先级最高的
Pod，从而导致其他 Pod 被逐出或者无法调度。
管理员可以使用 ResourceQuota 来避免用户创建高优先级的 Pod。

参考[限制默认使用的优先级类](/zh/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
以了解更多细节。
{{< /warning >}}

<!--
## How to use priority and preemption

To use priority and preemption:

1.  Add one or more [PriorityClasses](#priorityclass).

1.  Create Pods with[`priorityClassName`](#pod-priority) set to one of the added
    PriorityClasses. Of course you do not need to create the Pods directly;
    normally you would add `priorityClassName` to the Pod template of a
    collection object like a Deployment.

Keep reading for more information about these steps.
-->
## 如果使用优先级和抢占

要使用优先级和抢占特性：

1.  添加一个或多个 [PriorityClasses](#priorityclass) 对象

1.  创建 Pod 时设置其 [`priorityClassName`](#pod-priority) 为所添加的 PriorityClass 之一。
    当然你也不必一定要直接创建 Pod；通常你会在一个集合对象（如 Deployment）的 Pod
    模板中添加 `priorityClassName`。

关于这些步骤的详细信息，请继续阅读。

<!--
Kubernetes already ships with two PriorityClasses:
`system-cluster-critical` and `system-node-critical`.
These are common classes and are used to [ensure that critical components are always scheduled first](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
-->
{{< note >}}
Kubernetes 发行时已经带有两个 PriorityClasses：`system-cluster-critical` 和 `system-node-critical`。
这些优先级类是公共的，用来
[确保关键组件总是能够先被调度](/zh/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
{{< /note >}}

<!--
## How to disable preemption
-->
## 如何禁用抢占   {#how-to-disable-preemption}

<!--
Critical pods rely on scheduler preemption to be scheduled when a cluster
is under resource pressure. For this reason, it is not recommended to
disable preemption.
-->
{{< caution >}}
关键 Pod 依赖调度器抢占机制以在集群资源压力较大时得到调度。
因此，不建议禁用抢占。
{{< /caution >}}

<!--
In Kubernetes 1.15 and later, if the feature `NonPreemptingPriority` is enabled,
PriorityClasses have the option to set `preemptionPolicy: Never`.
This will prevent pods of that PriorityClass from preempting other pods.
-->
{{< note >}}
在 Kubernetes 1.15 及之后版本中，如果特性门控 `NonPreemptingPriority` 被启用，
则 PriorityClass 对象可以选择设置 `preemptionPolicy: Never`。
这样就会避免属于该 PriorityClass 的 Pod 抢占其他 Pod。
{{< /note >}}

<!--
Preemption is controlled by a kube-scheduler flag `disablePreemption`, which is
set to `false` by default.
If you want to disable preemption despite the above note, you can set
`disablePreemption` to `true`.

This option is available in component configs only and is not available in
old-style command line options. Below is a sample component config to disable
preemption:
-->
抢占能力是通过 `kube-scheduler` 的标志 `disablePreemption`
来控制的，该标志默认为 `false`。
如果你在了解上述提示的前提下仍希望禁用抢占，可以将 `disablePreemption`
设置为`true`。

这一选项只能通过组件配置来设置，无法通过命令行选项这种较老的形式设置。
下面是禁用抢占的组件配置示例：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

disablePreemption: true
```

## PriorityClass

<!--
A PriorityClass is a non-namespaced object that defines a mapping from a
priority class name to the integer value of the priority. The name is specified
in the `name` field of the PriorityClass object's metadata. The value is
specified in the required `value` field. The higher the value, the higher the
priority.
The name of a PriorityClass object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names),
and it cannot be prefixed with `system-`.
-->
PriorityClass 是一种不属于任何名字空间的对象，定义的是从优先级类名向优先级整数值的映射。
优先级类名称用 PriorityClass 对象的元数据的 `name` 字段指定。
优先级整数值在必须提供的 `value` 字段中指定。
优先级值越大，优先级越高。
PriorityClass 对象的名称必须是合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
且不可包含 `system-` 前缀。

<!--
A PriorityClass object can have any 32-bit integer value smaller than or equal
to 1 billion. Larger numbers are reserved for critical system Pods that should
not normally be preempted or evicted. A cluster admin should create one
PriorityClass object for each such mapping that they want.
-->
PriorityClass 对象可以设置数值小于等于 10 亿的 32 位整数。
更大的数值保留给那些通常不可被抢占或逐出的系统 Pod。
集群管理员应该为每个优先级值映射创建一个 PriorityClass 对象。

<!--
PriorityClass also has two optional fields: `globalDefault` and `description`.
The `globalDefault` field indicates that the value of this PriorityClass should
be used for Pods without a `priorityClassName`. Only one PriorityClass with
`globalDefault` set to true can exist in the system. If there is no
PriorityClass with `globalDefault` set, the priority of Pods with no
`priorityClassName` is zero.

The `description` field is an arbitrary string. It is meant to tell users of the
cluster when they should use this PriorityClass.
-->
PriorityClass 对象还有两个可选字段：`globalDefault` 和 `description`。
前者用来表明此 PriorityClass 的数值应该用于未设置 `priorityClassName` 的 Pod。
系统中只能存在一个 `globalDefault` 设为真的 PriorityClass 对象。
如果没有 PriorityClass 对象的 `globalDefault` 被设置，则未设置
`priorityClassName` 的 Pod 的优先级为 0。

`description` 字段可以设置任意字符串值。其目的是告诉用户何时该使用该
PriorityClass。

<!--
### Notes about PodPriority and existing clusters

-   If you upgrade an existing cluster without this feature, the priority
    of your existing Pods is effectively zero.

-   Addition of a PriorityClass with `globalDefault` set to `true` does not
    change the priorities of existing Pods. The value of such a PriorityClass is
    used only for Pods created after the PriorityClass is added.

-   If you delete a PriorityClass, existing Pods that use the name of the
    deleted PriorityClass remain unchanged, but you cannot create more Pods that
    use the name of the deleted PriorityClass.
-->
### 关于 Pod 优先级与现有集群的说明

- 如果你要升级一个不支持 Pod 优先级的集群，现有 Pod 的有效优先级都被视为 0。

- 向集群中添加 `globalDefault` 设置为 `true` 的 PriorityClass 不会改变现有
  Pod 的优先级。新添加的 PriorityClass 值仅适用于 PriorityClass 被添加之后
  新建的 Pod。

- 如果你要删除 PriorityClass，则使用所删除的 PriorityClass 名称的现有 Pod 都
  不会受影响，但是你不可以再创建使用该 PriorityClass 名称的新 Pod。

<!--
### Example PriorityClass
-->
### PriorityClass 示例

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class should be used for XYZ service pods only."
```

<!--
## Non-preempting PriorityClass {#non-preempting-priority-class}
-->
## 非抢占式的 PriorityClass      {#non-preempting-priority-class}

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

<!--
Pods with `PreemptionPolicy: Never` will be placed in the scheduling queue
ahead of lower-priority pods, but they cannot preempt other pods.  A
non-preempting pod waiting to be scheduled will stay in the scheduling queue,
until sufficient resources are free, and it can be scheduled.  Non-preempting
pods, like other pods, are subject to scheduler back-off.  This means that if
the scheduler tries these pods and they cannot be scheduled, they will be
retried with lower frequency, allowing other pods with lower priority to be
scheduled before them.
-->
配置 `preemptionPolicy: Never` 的 Pod 在调度队列中会被放在低优先级的 Pod
的前面，但是它们不可以抢占其他 Pod。
非抢占 Pod 会在调度队列中等待调度，直到有足够空闲资源时才被调度。
非抢占 Pod 与其他 Pod 一样，也受调度器回退（Back-off）机制影响。
换言之，如果调度器尝试调度这些 Pod 时发现它们无法调度，它们会被再次尝试，并且
重试的频率会被降低，这样可以使得其他优先级较低的 Pod 有机会在它们之前被调度。

<!--
Non-preempting pods may still be preempted by other,
high-priority pods.

`PreemptionPolicy` defaults to `PreemptLowerPriority`,
which will allow pods of that PriorityClass to preempt lower-priority pods
(as is existing default behavior).
If `PreemptionPolicy` is set to `Never`,
pods in that PriorityClass will be non-preempting.
-->
非抢占 Pod 仍有可能被其他高优先级的 Pod 抢占。

`preemptionPolicy` 默认取值为 `PreemptLowerPriority`，这会使得该 PriorityClass
的 Pod 能够抢占低优先级的 Pod（这也是当前的默认行为）。
如果 `preemptionPolicy` 被设置为 `Never`，则该 PriorityClass 下的 Pod 都是非抢占的。

<!--
The use of the `PreemptionPolicy` field requires the `NonPreemptingPriority`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to be enabled.

An example use case is for data science workloads.
A user may submit a job that they want to be prioritized above other workloads,
but do not wish to discard existing work by preempting running pods.
The high priority job with `PreemptionPolicy: Never` will be scheduled
ahead of other queued pods,
as soon as sufficient cluster resources "naturally" become free.
-->
使用 `preemptionPolicy` 字段要求启用 `NonPreemptingPriority` 
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)。

一种示例应用场景是数据科学负载。
用户可能希望所提交的 Job 比其他负载的优先级都高，但又不希望因为抢占运行中的
Pod 而丢弃现有工作。
只要集群中"自然地"释放出足够的资源，配置了 `preemptionPolicy: Never`
的高优先级 Job 可以在队列中其他 Pod 之前获得调度机会。

<!--
### Example Non-preempting PriorityClass
-->
### 非抢占 PriorityClass 示例

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority-nonpreempting
value: 1000000
preemptionPolicy: Never
globalDefault: false
description: "This priority class will not cause other pods to be preempted."
```

<!--
## Pod priority

After you have one or more PriorityClasses, you can create Pods that specify one
of those PriorityClass names in their specifications. The priority admission
controller uses the `priorityClassName` field and populates the integer value of
the priority. If the priority class is not found, the Pod is rejected.

The following YAML is an example of a Pod configuration that uses the
PriorityClass created in the preceding example. The priority admission
controller checks the specification and resolves the priority of the Pod to
1000000.
-->
## Pod 优先级   {#pod-priority}

在已经创建了一个或多个 PriorityClass 对象之后，你就可以创建 Pod 并在其规约中
指定这些 PriorityClass 的名字之一。优先级准入控制器使用 `priorityClassName`
字段来填充优先级整数值。如果所指定优先级类不存在，则 Pod 被拒绝。

下面的 YAML 是一个 Pod 配置，使用了前面例子中创建的 PriorityClass。
优先级准入控制器检查 Pod  的规约并将 Pod 优先级解析为 1000000。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  priorityClassName: high-priority
```

<!--
### Effect of Pod priority on scheduling order

When Pod priority is enabled, the scheduler orders pending Pods by
their priority and a pending Pod is placed ahead of other pending Pods
with lower priority in the scheduling queue. As a result, the higher
priority Pod may be scheduled sooner than Pods with lower priority if
its scheduling requirements are met. If such Pod cannot be scheduled,
scheduler will continue and tries to schedule other lower priority Pods.
-->
### 优先级对 Pod 调度顺序的影响

当集群启用了 Pod 优先级时，调度器会基于 Pod 的优先级来排序悬决的 Pod。
新 Pod 会被放在调度队列中较低优先级的其他悬决 Pod 前面。
因此，优先级较高的 Pod 在其调度需求被满足的前提下会比优先级低的 Pod 先被调度。
如果优先级较高的 Pod 无法被调度，调度器会继续尝试调度其他较低优先级的 Pod。

<!--
## Preemption

When Pods are created, they go to a queue and wait to be scheduled. The
scheduler picks a Pod from the queue and tries to schedule it on a Node. If no
Node is found that satisfies all the specified requirements of the Pod,
preemption logic is triggered for the pending Pod. Let's call the pending Pod P.
Preemption logic tries to find a Node where removal of one or more Pods with
lower priority than P would enable P to be scheduled on that Node. If such a
Node is found, one or more lower priority Pods get evicted from the Node. After
the Pods are gone, P can be scheduled on the Node.
-->
## 抢占   {#preemption}

Pod 被创建时会被放入一个队列中等待调度。调度器从队列中选择 Pod，尝试将其调度到某 Node 上。
如果找不到能够满足 Pod 所设置需求的 Node，就会触发悬决 Pod 的抢占逻辑。
假定 P 是悬决的 Pod，抢占逻辑会尝试找到一个这样的节点，在该节点上移除一个或者多个
优先级比 P 低的 Pod 后，P 就可以被调度到该节点。如果调度器能够找到这样的节点，
该节点上的一个或者多个优先级较低的 Pod 就会被逐出。当被逐出的 Pod 从该节点上
消失时，P 就可以调度到此节点。

<!--
### User exposed information

When Pod P preempts one or more Pods on Node N, `nominatedNodeName` field of Pod
P's status is set to the name of Node N. This field helps scheduler track
resources reserved for Pod P and also gives users information about preemptions
in their clusters.
-->
### 暴露给用户的信息    {#user-exposed-information}

当 Pod P 在节点 N 上抢占了一个或多个 Pod 时，Pod P 的状态中的`nominatedNodeName` 字段
会被设置为节点 N 的名字。此字段有助于调度器跟踪为 P
所预留的资源，同时也给用户提供了其集群中发生的抢占的信息。

<!--
Please note that Pod P is not necessarily scheduled to the "nominated Node".
After victim Pods are preempted, they get their graceful termination period. If
another node becomes available while scheduler is waiting for the victim Pods to
terminate, scheduler will use the other node to schedule Pod P. As a result
`nominatedNodeName` and `nodeName` of Pod spec are not always the same. Also, if
scheduler preempts Pods on Node N, but then a higher priority Pod than Pod P
arrives, scheduler may give Node N to the new higher priority Pod. In such a
case, scheduler clears `nominatedNodeName` of Pod P. By doing this, scheduler
makes Pod P eligible to preempt Pods on another Node.
-->
请注意，Pod P 不一定会被调度到其 "nominated node（提名节点）"。
当选定的 Pod 被抢占时，它们都会有其体面终止时限（Graceful Termination Period）。
如果在调度器等待选定的（被牺牲的）Pod 终止期间有新的节点可用，调度器会使用其他
节点来调度 Pod P。因此，Pod 中的 `nominatedNodeName` 和 `nodeName` 并不总是相同。
此外，如果调度器抢占了节点 N 上的 Pod，但接下来出现优先级比 P 还高的 Pod 要被
调度，则调度器会把节点 N 让给新的优先级更高的 Pod。如果发生了这种情况，调度器
会清除 Pod P 的 `nominatedNodeName`。通过清除操作，调度器使得 Pod P 可以尝试
抢占别的节点上的 Pod。

<!--
### Limitations of preemption

#### Graceful termination of preemption victims

When Pods are preempted, the victims get their
[graceful termination period](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).
They have that much time to finish their work and exit. If they don't, they are
killed. This graceful termination period creates a time gap between the point
that the scheduler preempts Pods and the time when the pending Pod (P) can be
scheduled on the Node (N). In the meantime, the scheduler keeps scheduling other
pending Pods. As victims exit or get terminated, the scheduler tries to schedule
Pods in the pending queue. Therefore, there is usually a time gap between the
point that scheduler preempts victims and the time that Pod P is scheduled. In
order to minimize this gap, one can set graceful termination period of lower
priority Pods to zero or a small number.
-->
### 抢占的局限性   {#limitations-of-preemption}

#### 抢占牺牲者的体面终止期限

当 Pod 被抢占时，做出牺牲的 Pod 仍有各自的
[体面终止期限](/zh/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。
这些 Pod 可以在给定的期限内结束其工作并退出。如果它们不能及时退出则会被杀死。
这一体面终止期限带来了一个时间空隙，跨度从调度器开始抢占 Pod 的那一刻到悬决 Pod
（P）可以被调度到节点（N）上的那一刻。
与此同时，调度器还要继续调度其他悬决的 Pod。
随着被抢占的 Pod 退出或终止，调度器尝试继续尝试调度悬决队列中的 Pod。
因此，从调度器抢占被牺牲的 Pod 到 Pod P 被调度，中间通常存在一个时间间隔。
为了缩短此时间间隔，用户可以将低优先级的 Pod 的体面终止期限设置为 0
或者较小的数字。

<!--
#### PodDisruptionBudget is supported, but not guaranteed

A [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) (PDB)
allows application owners to limit the number of Pods of a replicated application
that are down simultaneously from voluntary disruptions. Kubernetes supports
PDB when preempting Pods, but respecting PDB is best effort. The scheduler tries
to find victims whose PDB are not violated by preemption, but if no such victims
are found, preemption will still happen, and lower priority Pods will be removed
despite their PDBs being violated.
-->
#### PodDisruptionBudget 是被支持的，但不提供保证

[PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) (PDB)
的存在使得应用的属主能够限制多副本应用因主动干扰而同时离线的 Pod 的个数。
Kubernetes 在抢占 Pod 时是可以支持 PDB 的，但对 PDB 的约束也仅限于尽力而为。
调度器会尝试寻找不会因为抢占而违反其 PDB 约束的 Pod 作为牺牲品，不过如果
找不到这样的待逐出 Pod，抢占行为仍会发生，低优先级的 Pod 仍会被逐出而不管
是否违反其 PDB 约束。

<!--
#### Inter-Pod affinity on lower-priority Pods

A Node is considered for preemption only when the answer to this question is
yes: "If all the Pods with lower priority than the pending Pod are removed from
the Node, can the pending Pod be scheduled on the Node?"
-->
#### 低优先级 Pod 间的亲和性

只有对下面的问题的回答是肯定的的时候，才会考虑在节点上执行抢占操作：
"如果所有优先级低于悬决 Pod 的 Pod 都从节点上逐出，悬决 Pod
可以调度到此节点么？"

<!--
Preemption does not necessarily remove all lower-priority
Pods. If the pending Pod can be scheduled by removing fewer than all
lower-priority Pods, then only a portion of the lower-priority Pods are removed.
Even so, the answer to the preceding question must be yes. If the answer is no,
the Node is not considered for preemption.
-->
{{< note >}}
抢占操作不一定要逐出所有优先级较低的 Pod。
如果少逐出几个 Pod 而不是逐出所有较低优先级的 Pod 即可令悬决 Pod
被调度，则优先级较低的 Pod 中只有一部分会被逐出。
即便如此，对上述问题的回答仍须是肯定的。如果回答是否定的，Kubernetes
不会考虑在该节点上执行抢占操作。
{{< /note >}}

<!--
If a pending Pod has inter-pod affinity to one or more of the lower-priority
Pods on the Node, the inter-Pod affinity rule cannot be satisfied in the absence
of those lower-priority Pods. In this case, the scheduler does not preempt any
Pods on the Node. Instead, it looks for another Node. The scheduler might find a
suitable Node or it might not. There is no guarantee that the pending Pod can be
scheduled.

Our recommended solution for this problem is to create inter-Pod affinity only
towards equal or higher priority Pods.
-->
如果悬决 Pod 与节点上一个或多个较低优先级的 Pod 之间存在 Pod 间亲和性关系，
那些对应的低优先级 Pod 若被逐出则无法满足此亲和性规则。
在这种场合下，调度器不会抢占节点上的任何 Pod。相反，它会尝试寻找其他节点。
调度器可能能找到也可能找不到合适的节点。
Kubernetes 并不保证悬决的 Pod 最终会被调度。

对此问题的一种解决方案是仅针对优先级相同或更高的 Pod 设置 Pod 间亲和性。

<!--
#### Cross node preemption

Suppose a Node N is being considered for preemption so that a pending Pod P can
be scheduled on N. P might become feasible on N only if a Pod on another Node is
preempted. Here's an example:
-->
#### 跨节点的抢占 {#cross-node-preemption}

假定当前正在考虑在节点 N 上执行抢占操作以便 Pod P 能够被调度到 N 上执行。
可是只有当另一个节点上的某个 Pod 被抢占，P 才有可能在 N 上调度执行。例如：

<!--
*   Pod P is being considered for Node N.
*   Pod Q is running on another Node in the same Zone as Node N.
*   Pod P has Zone-wide anti-affinity with Pod Q (`topologyKey:
    failure-domain.beta.kubernetes.io/zone`).
*   There are no other cases of anti-affinity between Pod P and other Pods in
    the Zone.
*   In order to schedule Pod P on Node N, Pod Q can be preempted, but scheduler
    does not perform cross-node preemption. So, Pod P will be deemed
    unschedulable on Node N.
-->
* Pod P 正在考虑被调度到节点 N。
* Pod Q 正运行在节点 N 所处区域（Zone）的另一个节点上。
* Pod P 设置了区域范畴的与 Pod Q 的反亲和性
  （`topologyKey: failure-domain.beta.kubernetes.io/zone`）。
* Pod P 与区域中的其他 Pod 之间都不存在反亲和性关系。
* 为了将 P 调度到节点 N 上，Pod Q 可以被抢占，但是调度器不会执行跨节点的
  抢占操作。因此，Pod P 会被视为无法调度到节点 N 上执行。

<!--
If Pod Q were removed from its Node, the Pod anti-affinity violation would be
gone, and Pod P could possibly be scheduled on Node N.

We may consider adding cross Node preemption in future versions if there is
enough demand and if we find an algorithm with reasonable performance.
-->
如果 Pod Q 真的被从其节点上移除，Pod 间反亲和性的规则就会得到满足，Pod P
就有可能被调度到节点 N 上执行。

我们可能在将来版本中考虑添加跨节点的抢占能力。前提是在这方面有足够多的需求，
并且我们找到了性能可接受的算法。

<!--
## Troubleshooting

Pod priority and pre-emption can have unwanted side effects. Here are some
examples of potential problems and ways to deal with them.
-->
## 故障排查   {#troubleshooting}

Pod 优先级和抢占机制可能产生一些不想看到的副作用。
下面是一些可能存在的问题以及相应的处理方法。

<!--
### Pods are preempted unnecessarily

Preemption removes existing Pods from a cluster under resource pressure to make
room for higher priority pending Pods. If you give high priorities to
certain Pods by mistake, these unintentionally high priority Pods may cause
preemption in your cluster. Pod priority is specified by setting the
`priorityClassName` field in the Pod's specification. The integer value for
priority is then resolved and populated to the `priority` field of `podSpec`.
-->
### Pod 被不必要地抢占

抢占操作会在集群中资源压力较大，进而无法为高优先级的悬决 Pod 腾出空间时发生。
如果你不小心给某些 Pod 赋予了较高优先级，这些意外获得高优先级的 Pod 可能导致
集群中出现抢占行为。Pod 优先级是通过在其规约中的 `priorityClassName` 来设定的。
优先级的整数值被解析出来后会添加到 Pod 规约的 `priority` 字段。

<!--
To address the problem, you can change the `priorityClassName` for those Pods
to use lower priority classes, or leave that field empty. An empty
`priorityClassName` is resolved to zero by default.

When a Pod is preempted, there will be events recorded for the preempted Pod.
Preemption should happen only when a cluster does not have enough resources for
a Pod. In such cases, preemption happens only when the priority of the pending
Pod (preemptor) is higher than the victim Pods. Preemption must not happen when
there is no pending Pod, or when the pending Pods have equal or lower priority
than the victims. If preemption happens in such scenarios, please file an issue.
-->
要解决这一问题，你可以修改这些 Pod 的 `priorityClassName` 设置，使用优先级
较低的优先级类，或者将该字段留空。空的 `priorityClassName` 默认解析为优先级 0。

Pod 被抢占时，被抢占的 Pod 会有对应的事件被记录下来。
只有集群中无法为某 Pod 提供足够资源的时候才会发生抢占。
在出现这种情况时，也只有悬决 Pod（抢占者）的优先级高于被牺牲的 Pod
的优先级时，才会发生抢占现象。
当没有悬决 Pod，或者悬决 Pod 的优先级等于或者低于现有 Pod 时，都不应发生抢占行为。
如果在这种条件下仍然发生了抢占，请登记一个 Issue。

<!--
### Pods are preempted, but the preemptor is not scheduled

When pods are preempted, they receive their requested graceful termination
period, which is by default 30 seconds. If the victim Pods do not terminate within
this period, they are forcibly terminated. Once all the victims go away, the
preemptor Pod can be scheduled.
-->
### Pod 被抢占但抢占者未被调度

当有 Pod 被抢占时，它们会得到各自的体面终止期限（默认为 30 秒）。
如果被牺牲的 Pod 在此限期内未能终止，则 Pod 会被强制终止
一旦所有被牺牲的 Pod 都已消失不见，抢占者 Pod 就可被调度。

<!--
While the preemptor Pod is waiting for the victims to go away, a higher priority
Pod may be created that fits on the same Node. In this case, the scheduler will
schedule the higher priority Pod instead of the preemptor.

This is expected behavior: the Pod with the higher priority should take the place
of a Pod with a lower priority. Other controller actions, such as
[cluster autoscaling](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaling),
may eventually provide capacity to schedule the pending Pods.
-->
在抢占者 Pod 等待被牺牲的 Pod 消失期间，可能有更高优先级的 Pod 被创建，且适合
调度到同一节点。如果是这种情况，调度器会调度优先级更高的 Pod 而不是抢占者。

这是期望发生的行为：优先级更高的 Pod 应该取代优先级较低的 Pod。
其他控制器行为，例如
[集群自动扩缩](/zh/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaling)
可能会最终为集群添加容量，以调度悬决 Pod。 

<!--
### Higher priority Pods are preempted before lower priority pods

The scheduler tries to find nodes that can run a pending Pod. If no node is
found, the scheduler tries to remove Pods with lower priority from an arbitrary
node in order to make room for the pending pod.
If a node with low priority Pods is not feasible to run the pending Pod, the scheduler
may choose another node with higher priority Pods (compared to the Pods on the
other node) for preemption. The victims must still have lower priority than the
preemptor Pod.
-->
### 高优先级的 Pod 比低优先级的 Pod 先被抢占

调度器尝试寻找可以运行悬决 Pod 的节点。如果找不到这样的节点，调度器会尝试从任一
节点上逐出优先级较低的 Pod 以运行悬决 Pod。
如果包含低优先级 Pod 的节点不适合用来运行悬决 Pod，调度器可能会选择其他的、
运行着较高优先级（相对之前所评估的节点上的 Pod 而言）的 Pod 的节点来执行抢占操作。
即使如此，被牺牲的 Pod 的优先级也必须比抢占者 Pod 的优先级低。

<!--
When there are multiple nodes available for preemption, the scheduler tries to
choose the node with a set of Pods with lowest priority. However, if such Pods
have PodDisruptionBudget that would be violated if they are preempted then the
scheduler may choose another node with higher priority Pods.

When multiple nodes exist for preemption and none of the above scenarios apply,
the scheduler chooses a node with the lowest priority.
-->
当有多个节点可供抢占时，调度器会选择 Pod 集合的优先级最低的节点。不过如果这些
Pod 上定义了 PodDisruptionBudget（PDB）而且如果被抢占了的话就会违反 PDB，
则调度器会选择另一个 Pod 集合优先级稍高的节点。 

当存在多个节点可供抢占，但以上场景都不适用，则调度器会选择优先级最低的节点。

<!--
## Interactions between Pod priority and quality of service {#interactions-of-pod-priority-and-qos}

Pod priority and {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}
are two orthogonal features with few interactions and no default restrictions on
setting the priority of a Pod based on its QoS classes. The scheduler's
preemption logic does not consider QoS when choosing preemption targets.
Preemption considers Pod priority and attempts to choose a set of targets with
the lowest priority. Higher-priority Pods are considered for preemption only if
the removal of the lowest priority Pods is not sufficient to allow the scheduler
to schedule the preemptor Pod, or if the lowest priority Pods are protected by
`PodDisruptionBudget`.
-->
## Pod 优先级与服务质量间关系  {#interactions-of-pod-priority-and-qos}

Pod 优先级与 {{< glossary_tooltip text="QoS 类" term_id="qos-class" >}} 是两个
相互独立的功能特性，其间交互之处很少，并且不存在基于 Pod QoS 类来为其设置
优先级方面的默认限制。
调度器的抢占逻辑在选择抢占目标时不会考虑 QoS 因素。
抢占考虑的是 Pod 优先级，并选择优先级最低的 Pod 作为抢占目标。
只有移除最低优先级的 Pod 尚不足以允许调度器调度抢占者 Pod 或者最低优先级的 Pod
受到 Pod 干扰预算（PDB）保护时，才会考虑抢占优先级稍高的 Pod。

<!--
The only component that considers both QoS and Pod priority is
[kubelet out-of-resource eviction](/docs/tasks/administer-cluster/out-of-resource/).
The kubelet ranks Pods for eviction first by whether or not their usage of the
starved resource exceeds requests, then by Priority, and then by the consumption
of the starved compute resource relative to the Pods’ scheduling requests.
See
[evicting end-user pods](/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods)
for more details.
-->
唯一同时考虑 QoS 和 Pod 优先级的组件是 `kubelet`，体现在其
[资源不足时的逐出](/zh/docs/tasks/administer-cluster/out-of-resource/)操作。
`kubelet`  首先根据 Pod 对濒危资源的使用是否超出其请求值来选择要被逐出的 Pod，
接下来对这些 Pod 按优先级排序，再按其相对 Pod 的调度请求所耗用的濒危资源的用量
排序。更多细节可参阅
[逐出最终用户的 Pod](/zh/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods)。

<!--
kubelet out-of-resource eviction does not evict Pods when their
usage does not exceed their requests. If a Pod with lower priority is not
exceeding its requests, it won't be evicted. Another Pod with higher priority
that exceeds its requests may be evicted.
-->
`kubelet` 资源不足时的逐出操作不会逐出 Pod 资源用量未超出其请求值的 Pod。
如果优先级较低的 Pod 未超出其请求值，它们不会被逐出。其他优先级较高的
且用量超出请求值的 Pod 则可能被逐出。

## {{% heading "whatsnext" %}}

<!--
* Read about using ResourceQuotas in connection with PriorityClasses: [limit Priority Class consumption by default](/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
-->
* 阅读结合 PriorityClass 来使用 ResourceQuota 的介绍：
  [限制默认可使用的优先级类](/zh/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)

