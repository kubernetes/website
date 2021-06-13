---
title: Pod 的优先级和抢占
content_type: concept
weight: 50
---
<!-- 
---
reviewers:
- davidopp
- wojtek-t
title: Pod Priority and Preemption
content_type: concept
weight: 50
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

<!-- 
[Pods](/docs/concepts/workloads/pods/) can have _priority_. Priority indicates the
importance of a Pod relative to other Pods. If a Pod cannot be scheduled, the
scheduler tries to preempt (evict) lower priority Pods to make scheduling of the
pending Pod possible.
-->
[Pod](/zh/docs/concepts/workloads/pods/) 有优先级的概念。
优先级指某个 Pod 相对于其他 Pod 的重要性。
如果一个 Pod 不能调度，调度器试着抢占（驱逐）低优先级的 Pod，这样挂起的 Pod 就有可能被调度了。

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
一个集群中，并非所有用户都可信，一个恶意用户可能会创建最高优先级的 Pod，这将导致其他 Pod 被驱逐/得不到调度。
管理员可以配置 `ResourceQuota`来阻止用户创建高优先级的 Pod。

细节参见[默认地限制优先级类的使用](/zh/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)。
{{< /warning >}}

<!-- 
## How to use priority and preemption
-->
## 使用优先级和抢占功能 {#how-to-use-priority-and-preemption}

<!-- 
To use priority and preemption:

1.  Add one or more [PriorityClasses](#priorityclass).

1.  Create Pods with[`priorityClassName`](#pod-priority) set to one of the added
    PriorityClasses. Of course you do not need to create the Pods directly;
    normally you would add `priorityClassName` to the Pod template of a
    collection object like a Deployment.

Keep reading for more information about these steps.
 -->
要使用优先级和抢占：

1.  增加一或多个 [PriorityClasses](#priorityclass)
2.  用新增 PriorityClasses 的 [`priorityClassName`](#pod-priority) 创建 Pod。
    当然，你不用直接创建 Pod；
    通常，你可以把 `priorityClassName` 添加到 Pod 模板，就像一个 Deployment 对象。

继续阅读这些步骤的更多信息。

<!-- 
Kubernetes already ships with two PriorityClasses:
`system-cluster-critical` and `system-node-critical`.
These are common classes and are used to [ensure that critical components are always scheduled first](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
 -->
{{< note >}}
Kubernetes 已经自带了两个优先级类，分别是：`system-cluster-critical` 和 `system-node-critical`。
它们都是普通的类型，用于
[确保关键组件总能第一个被调度](/zh/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)
{{< /note >}}

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
PriorityClass 是一个全局对象，把优先级类的名字映射到一个整数。
名字由 PriorityClass 对象 metadata 中的 `name` 字段指定。
整数值由 `value` 字段指定。
整数值越大，优先级越高。
PriorityClass 对象的名称必须是一个合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)，
且不能以 `system-` 开头。

<!-- 
A PriorityClass object can have any 32-bit integer value smaller than or equal
to 1 billion. Larger numbers are reserved for critical system Pods that should
not normally be preempted or evicted. A cluster admin should create one
PriorityClass object for each such mapping that they want.
 -->
PriorityClass 对象可以设置为一个小于等于10亿的32位整数值。
较大的数字预留给通常不能被抢占或驱逐的关键系统 Pod。
集群管理员应该为每一个需要的映射创建一个 PriorityClass。

<!-- 
PriorityClass also has two optional fields: `globalDefault` and `description`.
The `globalDefault` field indicates that the value of this PriorityClass should
be used for Pods without a `priorityClassName`. Only one PriorityClass with
`globalDefault` set to true can exist in the system. If there is no
PriorityClass with `globalDefault` set, the priority of Pods with no
`priorityClassName` is zero.
 -->
PriorityClass 还有两个可选字段：`globalDefault` 和 `description`。
`globalDefault` 字段指此 PriorityClass 的值将被用于所有没设置  `priorityClassName` 的Pod。
系统中只能存在一个 `globalDefault` 值为 True 的 PriorityClass。
如果系统中不存在设置了 `globalDefault` 字段的 PriorityClass，则没有设置 `priorityClassName` 的 Pod 的优先级为0。

<!-- 
The `description` field is an arbitrary string. It is meant to tell users of the
cluster when they should use this PriorityClass.
 -->
`description` 字段是任意字符串。
它用于告诉集群的用户应该在何时使用此 PriorityClass。

<!-- 
### Notes about PodPriority and existing clusters
 -->
### 注意 PodPriority 和现有集群的关系 {#notes-about-podpriority-and-existing-clusters}

<!-- 
-   If you upgrade an existing cluster without this feature, the priority
    of your existing Pods is effectively zero.
 -->
-   如果你刚从一个没有此特性的集群升级而来，现存 Pod 的优先级实际上为0.

<!-- 
-   Addition of a PriorityClass with `globalDefault` set to `true` does not
    change the priorities of existing Pods. The value of such a PriorityClass is
    used only for Pods created after the PriorityClass is added.
 -->
-   给 PriorityClass 增加一个值为 `true` 的 `globalDefault` 字段，并不会改变现有 Pod 的优先级。
    这个 PriorityClass 的值只会作用与此 PriorityClass 之后创建的 Pod。

<!-- 
-   If you delete a PriorityClass, existing Pods that use the name of the
    deleted PriorityClass remain unchanged, but you cannot create more Pods that
    use the name of the deleted PriorityClass.
 -->
-   如果你删掉一个 PriorityClass，现存已经用了被删 PriorityClass 名字的 Pod 保持不变，
    但你不能再创建使用此被删 PriorityClass 名字的 Pod。

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
description: "本优先级类只用于服务 XYZ 中的 Pod。"
```

<!-- 
## Non-preempting PriorityClass {#non-preempting-priority-class}
 -->
## 非抢占的 PriorityClass {#non-preempting-priority-class}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

<!-- 
Pods with `PreemptionPolicy: Never` will be placed in the scheduling queue
ahead of lower-priority pods,
but they cannot preempt other pods.
A non-preempting pod waiting to be scheduled will stay in the scheduling queue,
until sufficient resources are free,
and it can be scheduled.
Non-preempting pods,
like other pods,
are subject to scheduler back-off.
This means that if the scheduler tries these pods and they cannot be scheduled,
they will be retried with lower frequency,
allowing other pods with lower priority to be scheduled before them.
 -->
设置了 `PreemptionPolicy: Never` 的 Pod，会被排在调度队列中更低优先级 Pod 的前面，
但不会抢占其他 Pod。
一个等待调度的非抢占式 Pod 会停留在调度队列中，直到足够的资源被释放之后，它能被调度为止。
非抢占式 Pod 和其他 Pod 一样，会受到调度器回撤的影响。
这意味着如果调度器尝试调度这些 Pod 失败了，
他们将用更低的频率重试，
并且允许其他更低优先级的 Pod 提前被调度。

<!-- 
Non-preempting pods may still be preempted by other,
high-priority pods.
 -->
非抢占式 Pod 可以被其他高优先级的 Pod 抢占。

<!-- 
`PreemptionPolicy` defaults to `PreemptLowerPriority`,
which will allow pods of that PriorityClass to preempt lower-priority pods
(as is existing default behavior).
If `PreemptionPolicy` is set to `Never`,
pods in that PriorityClass will be non-preempting.
 -->
`PreemptionPolicy` 默认值为 `PreemptLowerPriority`，
这将允许此 PriorityClass 的 Pod 抢占更低优先级的 Pod（就像现有的默认行为）。
如果把`PreemptionPolicy` 设为 `Never`， 此 PriorityClass 的 Pod 将成为不可抢占式的。

<!-- 
An example use case is for data science workloads.
A user may submit a job that they want to be prioritized above other workloads,
but do not wish to discard existing work by preempting running pods.
The high priority job with `PreemptionPolicy: Never` will be scheduled
ahead of other queued pods,
as soon as sufficient cluster resources "naturally" become free.
 -->
一个示例应用场景是数据科学工作负载。
一个用户提交一个比其他工作负载的优先级更高的作业，但不希望抢占运行中的 Pod 而导致现有的工作丢失。
设置了 `PreemptionPolicy: Never` 的高优先级作业，一旦充足的集群资源”自然的“被释放，会在其他排队的 Pod 之前被调度。

<!-- 
### Example Non-preempting PriorityClass
 -->
### 非抢占式 PriorityClass 的示例

<!-- 
description: "This priority class will not cause other pods to be preempted."
-->
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority-nonpreempting
value: 1000000
preemptionPolicy: Never
globalDefault: false
description: "本优先级类不会导致其他 Pod 被抢占。"
```

<!-- 
## Pod priority
 -->
## Pod 的优先级 {#pod-priority}

<!-- 
After you have one or more PriorityClasses, you can create Pods that specify one
of those PriorityClass names in their specifications. The priority admission
controller uses the `priorityClassName` field and populates the integer value of
the priority. If the priority class is not found, the Pod is rejected.
 -->
定义了1个或多个 PriorityClasses 之后，
你创建 Pod 时就可以在规格定义中指定 PriorityClass 的名字。
优先级准入控制器依据 `priorityClassName` 字段，填入优先级的整数值。
如果没有找到优先级类，Pod 则被拒绝。

<!-- 
The following YAML is an example of a Pod configuration that uses the
PriorityClass created in the preceding example. The priority admission
controller checks the specification and resolves the priority of the Pod to
1000000.
 -->
以下 YAML 是一个 Pod 配置的示例，该示例用到了前面例子中创建的 PriorityClass。
优先级准入控制器检查规格定义，并将 Pod 的优先级解析为 1000000。

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
 -->
### Pod 优先级对调度顺序的影响 {#effect-of-priority-on-scheduling-order}

<!-- 
When Pod priority is enabled, the scheduler orders pending Pods by
their priority and a pending Pod is placed ahead of other pending Pods
with lower priority in the scheduling queue. As a result, the higher
priority Pod may be scheduled sooner than Pods with lower priority if
its scheduling requirements are met. If such Pod cannot be scheduled,
scheduler will continue and tries to schedule other lower priority Pods.
 -->
Pod 优先级功能启用后，调度器根据优先级顺序对挂起的 Pod 排序，
在调度队列中，高优先级的 Pod 排列在其他低优先级 Pod 的前面。
所以，高优先级的 Pod 只要满足了调度需求，就可以比低优先级的 Pod 更快的被调度。
如果 Pod 不能被调度，调度器将继续尝试调度其他低优先级的 Pod。

<!-- 
## Preemption
 -->
## 抢占 {#preemption}

<!-- 
When Pods are created, they go to a queue and wait to be scheduled. The
scheduler picks a Pod from the queue and tries to schedule it on a Node. If no
Node is found that satisfies all the specified requirements of the Pod,
preemption logic is triggered for the pending Pod. Let's call the pending Pod P.
Preemption logic tries to find a Node where removal of one or more Pods with
lower priority than P would enable P to be scheduled on that Node. If such a
Node is found, one or more lower priority Pods get evicted from the Node. After
the Pods are gone, P can be scheduled on the Node.
 -->
Pod 被创建之后，进入队列中等待被调度。
调度器从队列中检出一个 Pod，尝试将它调度到一个节点。
但如果所有节点都不满足 Pod 的需求，将对排队的 Pod 触发抢占流程。
让我们称呼排队的 Pod 为 P。
抢占流程尝试找到一个节点，该节点通过删除一到多个优先级低于 P 的 Pod 后，能支持将 P 调度到该节点。
如果这样的节点被发现了，一到多个低优先级的 Pod 将被从该节点驱逐。
驱逐的节点清空后，P 将被调度到该节点。

<!-- 
### User exposed information
 -->
### 用户公开信息 {#user-exposed-information}

<!-- 
When Pod P preempts one or more Pods on Node N, `nominatedNodeName` field of Pod
P's status is set to the name of Node N. This field helps scheduler track
resources reserved for Pod P and also gives users information about preemptions
in their clusters.
 -->
在 Pod P 抢占了一到多个节点 N 上的 Pod 之后，
Pod P 的状态中的 `nominatedNodeName` 字段将被设置为 节点 N。
此字段用于协助调度器跟踪为 Pod P 预留的资源，也可以为用户提供集群中抢占方面的信息。

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
请注意 Pod P 并非一定会被调度到此 “推荐的节点”。
当牺牲的 Pod 被抢占之后，他们有一个合理的中止期限。
如果在等待牺牲的 Pod 结束时，另一个节点进入可用状态，
调度器将会用新的节点调度 Pod P。
这会导致 Pod 规格定义中的 `nominatedNodeName` 和 `nodeName` 两个字段并不相同。
另外，如果调度器在节点 N 上抢占 Pod 时，但出现了另一个比 Pod P 更高优先级的 Pod，
调度器可能会把节点 N 分配给该新的优先级更高的 Pod。
在这种场景下，调度器清空 Pod P 的 `nominatedNodeName` 字段。
通过这些操作，调度器使 Pod P 有资格抢占其他节点的 Pod。

<!-- 
### Limitations of preemption

#### Graceful termination of preemption victims
 -->
### 抢占的限制 {#liminations-of-preemption}

#### 合理地中止被抢占的对象 {#graceful-termination-of-preemption-victims}

<!-- 
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
当 Pod 被抢占，被抢占者被赋予一个
[合理的中止时间](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).
它们拥有这些时间来完成扫尾工作并退出。
如果还没有完成，它们将被杀死。
此合理的终止时间在调度器强占 Pod 和挂起的 Pod P 被调度到节点 N 之间产生了一个时间间隔。
同时，调度器保持调度其他挂起的 Pod。
当被抢占者退出或被中止后，调度器尝试调度等待队列中的 Pod。
因此，调度器抢占的时间点和 Pod P 被调度的时间点之间通常有一个时间间隔。
为了最小化这个时间间隔，你可以把低优先级 Pod 的合理中止时间设置为 0 或一个小点的数字。

<!-- 
#### PodDisruptionBudget is supported, but not guaranteed
 -->
#### 支持 PodDisruptionBudget，但不保证生效 {#poddisruptionbudget-is-supported-but-not-guaranteed}

<!-- 
A [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) (PDB)
allows application owners to limit the number of Pods of a replicated application
that are down simultaneously from voluntary disruptions. Kubernetes supports
PDB when preempting Pods, but respecting PDB is best effort. The scheduler tries
to find victims whose PDB are not violated by preemption, but if no such victims
are found, preemption will still happen, and lower priority Pods will be removed
despite their PDBs being violated.
 -->
[PodDisruptionBudget](/zh/docs/concepts/workloads/pods/disruptions/)（PDB）
允许应用程序所有者限制自发中断的应用程序副本的 Pod 数量。
Kubernetes 在抢占 Pod 时支持 PDB规则，但 PDB 规则的策略是最大努力式。
调度器尽量寻找 PDB 规则没有被抢占打破的牺牲者，但如果找不到合适的牺牲者，
抢占依然会发生，
低优先级的 Pod 即使 PDB 规则被打破，还是会被删除。

<!-- 
#### Inter-Pod affinity on lower-priority Pods
 -->
#### 低优先级 Pod 之间的亲和性

<!-- 
A Node is considered for preemption only when the answer to this question is
yes: "If all the Pods with lower priority than the pending Pod are removed from
the Node, can the pending Pod be scheduled on the Node?"
 -->
当以下问题的答案均为肯定时，一个节点才会被考虑用于抢占：
“是否所有比挂起 Pod 更低优先级的 Pod 都从该节点上删除了？“， 
”挂起的 Pod 可以被调度到该节点吗？”

<!-- 
Preemption does not necessarily remove all lower-priority
Pods. If the pending Pod can be scheduled by removing fewer than all
lower-priority Pods, then only a portion of the lower-priority Pods are removed.
Even so, the answer to the preceding question must be yes. If the answer is no,
the Node is not considered for preemption.
 -->
{{< note >}}
抢占不一定会删除所有低优先级的 Pod。
如果只删除部分低优先级的 Pod，挂起的 Pod 就可以被调度，那么只有这部分低优先级的 Pod 会被删除。
即使这样，前面问题的答案也必须是肯定的。
如果是否定的答案，该节点将不会被考虑用于抢占。
{{< /note >}}

<!-- 
If a pending Pod has inter-pod affinity to one or more of the lower-priority
Pods on the Node, the inter-Pod affinity rule cannot be satisfied in the absence
of those lower-priority Pods. In this case, the scheduler does not preempt any
Pods on the Node. Instead, it looks for another Node. The scheduler might find a
suitable Node or it might not. There is no guarantee that the pending Pod can be
scheduled.
 -->
如果挂起的 Pod 和节点上一或多个低优先级 Pod 间有亲和性关系，
在缺少这些低优先级 Pod 的情况下，Pod 间的亲和性规则就不能被满足。
在此场景下，调度器不会抢占该节点上的 Pod。
相反，它会寻找另一个节点。
调度器可能会找到一个合适的节点，也可能不会。
这里也不能保证挂起的 Pod 会被调度。

<!-- 
Our recommended solution for this problem is to create inter-Pod affinity only
towards equal or higher priority Pods.
 -->
对于这个问题，我们推荐的解决方案是：只对具有同等或更高优先级的 Pod 建立 Pod 间的亲和性。

<!-- 
#### Cross node preemption
 -->
#### 跨节点抢占

<!-- 
Suppose a Node N is being considered for preemption so that a pending Pod P can
be scheduled on N. P might become feasible on N only if a Pod on another Node is
preempted. Here's an example:
 -->
假设节点 N 被考虑用于抢占，以便挂起的 Pod P 可以被调度到 N 上。
只有其他节点上的某个 Pod 被抢占，P 才可能被调度到 N 上。
这里是示例：

<!-- 
*   Pod P is being considered for Node N.
*   Pod Q is running on another Node in the same Zone as Node N.
*   Pod P has Zone-wide anti-affinity with Pod Q (`topologyKey:
    topology.kubernetes.io/zone`).
*   There are no other cases of anti-affinity between Pod P and other Pods in
    the Zone.
*   In order to schedule Pod P on Node N, Pod Q can be preempted, but scheduler
    does not perform cross-node preemption. So, Pod P will be deemed
    unschedulable on Node N.
 -->
*   计划将 Pod P 运行于节点 N。
*   Pod Q 运行于同一个可用区的另一个节点上。
*   Pod P 和 Pod Q 具有可用区范围的反亲和性(`topologyKey:
    topology.kubernetes.io/zone`)。
*   在该可用区中，不存在其他 Pod 和 Pod P 具有反亲和性关系。
*   为了调度 Pod P 到 节点 N， Pod Q 需要被抢占，但调度器并不会执行跨节点的抢占。
    所以，Pod P 不可调度到节点 N 上。

<!-- 
If Pod Q were removed from its Node, the Pod anti-affinity violation would be
gone, and Pod P could possibly be scheduled on Node N.

We may consider adding cross Node preemption in future versions if there is
enough demand and if we find an algorithm with reasonable performance.
 -->
假如 Pod Q 从节点上被删除，Pod 的反亲和性约束被消除，则 Pod P 就可以被调度到节点 N。

如果有足够的需求，并且恰好我们能找到一个性能合理的算法，那我们可以考虑在后续版本中增加跨节点抢占。

<!-- 
## Troubleshooting
-->
## 故障排查 {#troubleshooting}

<!-- 
Pod priority and pre-emption can have unwanted side effects. Here are some
examples of potential problems and ways to deal with them.
 -->
Pod 优先级和抢占可能存在非预期的副作用。
这里是一些潜在问题的示例，以及处理办法。

<!-- 
### Pods are preempted unnecessarily
 -->
### Pod 被不必要的抢占

<!-- 
Preemption removes existing Pods from a cluster under resource pressure to make
room for higher priority pending Pods. If you give high priorities to
certain Pods by mistake, these unintentionally high priority Pods may cause
preemption in your cluster. Pod priority is specified by setting the
`priorityClassName` field in the Pod's specification. The integer value for
priority is then resolved and populated to the `priority` field of `podSpec`.
 -->
在资源紧缺时，为了给高优先级的、挂起的 Pod 腾出空间，抢占机制从集群中删除现存 Pod。
如果你不小心给特定 Pod 错误的分配了高优先级，这些意料之外的高优先级 Pod 可能在你的集群中引发抢占。
Pod 优先级是通过设置 Pod 规格中的 `priorityClassName` 字段来指定的。
优先级的整数值会被解析并填充到 `podSpec` 中的 `priority` 字段。

<!-- 
To address the problem, you can change the `priorityClassName` for those Pods
to use lower priority classes, or leave that field empty. An empty
`priorityClassName` is resolved to zero by default.
 -->
为了解决这一问题，你可以把这些 Pod 的 `priorityClassName` 修改为低优先级类，
或者把字段留空。空的 `priorityClassName` 字段默认解析为 0.

<!-- 
When a Pod is preempted, there will be events recorded for the preempted Pod.
Preemption should happen only when a cluster does not have enough resources for
a Pod. In such cases, preemption happens only when the priority of the pending
Pod (preemptor) is higher than the victim Pods. Preemption must not happen when
there is no pending Pod, or when the pending Pods have equal or lower priority
than the victims. If preemption happens in such scenarios, please file an issue.
 -->
当一个 Pod 被抢占，会产生一条消息记录此被抢占的 Pod。
抢占仅在集群没有足够的资源启动 Pod 的时候才会发生。
在此场景，抢占只有当挂起 Pod（抢占者） 的优先级高于被抢占 Pod 才会发生。
如果没有挂起的 Pod，或者挂起的 Pod 优先级等于甚至低于被抢占者，则抢占必定不会发生。
如果抢占真的在此种场景下发生了，请提交这个问题。

<!-- 
### Pods are preempted, but the preemptor is not scheduled
 -->
### Pod 被抢占后，抢占者却没有被调度

<!-- 
When pods are preempted, they receive their requested graceful termination
period, which is by default 30 seconds. If the victim Pods do not terminate within
this period, they are forcibly terminated. Once all the victims go away, the
preemptor Pod can be scheduled.
 -->
当 Pod 被抢占，被抢占 Pod 收到它们请求的合理终止时间窗口，这个时间窗口默认是 30 秒。
如果牺牲者在这段时间内还没有退出，将被强制终止。
一旦所有的牺牲者移除之后，抢占者 Pod 既可以得到调度。

<!-- 
While the preemptor Pod is waiting for the victims to go away, a higher priority
Pod may be created that fits on the same Node. In this case, the scheduler will
schedule the higher priority Pod instead of the preemptor.
 -->
在抢占者 Pod 等待牺牲者退出时，可能会有一个具有更高优先级的 Pod 被创建，且可适配到了同一个节点。
在这种情况下，调度器将会搁置抢占者，转而调度此高优先级 Pod。

<!-- 
This is expected behavior: the Pod with the higher priority should take the place
of a Pod with a lower priority.
 -->
期望的行为是：高优先级的 Pod 取代低优先级的 Pod。

<!-- 
### Higher priority Pods are preempted before lower priority pods
 -->
### 高优先级 Pod 在低优先级 Pod 之前触发抢占

<!-- 
The scheduler tries to find nodes that can run a pending Pod. If no node is
found, the scheduler tries to remove Pods with lower priority from an arbitrary
node in order to make room for the pending pod.
If a node with low priority Pods is not feasible to run the pending Pod, the scheduler
may choose another node with higher priority Pods (compared to the Pods on the
other node) for preemption. The victims must still have lower priority than the
preemptor Pod.
 -->
调度器尝试寻找可以运行挂起 Pod 的节点。
如果找不到这样的节点，调度器尝试从任意的节点移除低优先级的 Pod，给挂起的 Pod 腾出空间。
如果承载低优先级 Pod 的节点不能运行挂起的 Pod，
调度器会选择另一个运行了较高优先级 Pod（相对于其他节点）的节点来实施抢占。
牺牲者的优先级必须低于抢占者 Pod。

<!-- 
When there are multiple nodes available for preemption, the scheduler tries to
choose the node with a set of Pods with lowest priority. However, if such Pods
have PodDisruptionBudget that would be violated if they are preempted then the
scheduler may choose another node with higher priority Pods.
 -->
当多个节点都可用于抢占时，调度器尝试选择具有最低优先级 Pod 的节点。
然而，如果此低优先级 Pod 设置了和抢占行为冲突的 PodDisruptionBudget，
调度器就可能会选择另一个具有较高优先级 Pod 的节点。

<!-- 
When multiple nodes exist for preemption and none of the above scenarios apply,
the scheduler chooses a node with the lowest priority.
 -->
当多个节点均适用于抢占，且上述情况均未发生，
调度器会选择具有最低优先级的节点。

<!-- 
## Interactions between Pod priority and quality of service {#interactions-of-pod-priority-and-qos}
 -->
## Pod 优先级和服务质量之间的相互作用 {#interactions-of-pod-priority-and-qos}

<!-- 
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
Pod 优先级和 {{< glossary_tooltip text="QoS 类" term_id="qos-class" >}}
是两个很少交互的正交特性，且默认的，没有在 QoS 类上设置 Pod 优先级的限制。
调度器的抢占逻辑在选择抢占目标时并不考虑 QoS。
抢占考虑 Pod 优先级并试图选出一组具有最低优先级的目标。
仅当移除最低优先级 Pod 后还不足以调度抢占者 Pod 时，
或者低优先级 Pod 被 `PodDisruptionBudget` 保护时，
才会考虑抢占较高优先级 Pod。

<!-- 
The kubelet uses Priority to determine pod order for [out-of-resource eviction](/docs/tasks/administer-cluster/out-of-resource/).
You can use the QoS class to estimate the order in which pods are most likely
to get evicted. The kubelet ranks pods for eviction based on the following factors:
 -->
kubelet 依据优先级决定 
[资源不足引发的驱逐行为](/zh/docs/tasks/administer-cluster/out-of-resource/)
时的 Pod 顺序。
你可以用 QoS 类估算 Pod 被驱逐的可能的顺序。
kubelet 基于下面因素排列被驱逐的 Pod：

<!-- 
  1. Whether the starved resource usage exceeds requests
  1. Pod Priority
  1. Amount of resource usage relative to requests 
 -->
  1. 对资源的需求是否超过了需求
  1. Pod 的优先级
  1. 相对于需求的资源使用量

<!-- 
See [evicting end-user pods](/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods)
for more details.
 -->
更多细节，参见 [驱逐终端用户 Pod](/zh/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods)

<!-- 
kubelet out-of-resource eviction does not evict Pods when their
usage does not exceed their requests. If a Pod with lower priority is not
exceeding its requests, it won't be evicted. Another Pod with higher priority
that exceeds its requests may be evicted.
 -->
kubelet 资源不足时的驱逐行为不会驱逐资源使用不超标的 Pod。
如果一个较低优先级的 Pod 资源使用量未超需求，它不会被驱逐。
另一个较高优先级的 Pod 资源使用量超过需求，则可能会被驱逐。

## {{% heading "whatsnext" %}}

<!-- 
* Read about using ResourceQuotas in connection with PriorityClasses: [limit Priority Class consumption by default](/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
* Learn about [Pod Disruption](/docs/concepts/workloads/pods/disruptions/)
* Learn about [API-initiated Eviction](/docs/concepts/scheduling-eviction/api-eviction/)
* Learn about [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
-->
* 阅读关联使用 ResourceQuotas 和 PriorityClasses [默认地限制优先类的使用](/zh/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
* 了解 [Pod 中断](/zh/docs/concepts/workloads/pods/disruptions/)
* 了解 [API 触发的驱逐](/zh/docs/concepts/scheduling-eviction/api-eviction/)
* 了解[节点压力触发的驱逐](/zh/docs/concepts/scheduling-eviction/node-pressure-eviction/)
