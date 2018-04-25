---
approvers:
- davidopp
- wojtek-t
title: Pod 优先级和抢占
cn-approvers:
- chentao1596
---
<!--
---
approvers:
- davidopp
- wojtek-t
title: Pod Priority and Preemption
---
-->

{% capture overview %}

{% include feature-state-alpha.md %}

<!--
[Pods](/docs/user-guide/pods) in Kubernetes 1.8 and later can have priority. Priority
indicates the importance of a Pod relative to other Pods. When a Pod cannot be scheduled,
the scheduler tries to preempt (evict) lower priority Pods to make scheduling of the
pending Pod possible. In a future Kubernetes release, priority will also affect
out-of-resource eviction ordering on the Node.
-->
Kubernetes 1.8 及其以后的版本中可以指定 Pod 的优先级。优先级表明了一个 Pod 相对于其它 Pod 的重要性。当 Pod 无法被调度时，scheduler 会尝试抢占（驱逐）低优先级的 Pod，使得这些挂起的 pod 可以被调度。在 Kubernetes 未来的发布版本中，优先级也会影响节点上资源回收的排序。

<!--
**Note:** Preemption does not respect PodDisruptionBudget; see 
[the limitations section](#poddisruptionbudget-is-not-supported) for more details.
-->
**注：** 抢占不遵循 PodDisruptionBudget；更多详细的信息，请查看 [限制部分](#poddisruptionbudget-is-not-supported)。
{: .note}

{% endcapture %}

{% capture body %}

<!--
## How to use priority and preemption
-->
## 怎么样使用优先级和抢占
<!--
To use priority and preemption in Kubernetes 1.8, follow these steps:
-->
想要在 Kubernetes 1.8 版本中使用优先级和抢占，请参考如下步骤：

<!--
1. Enable the feature.
-->
1. 启用功能。

<!--
1. Add one or more PriorityClasses.
-->
1. 增加一个或者多个 PriorityClass。

<!--
1. Create Pods with `PriorityClassName` set to one of the added PriorityClasses.
Of course you do not need to create the Pods directly; normally you would add 
`PriorityClassName` to the Pod template of a collection object like a Deployment.
-->
1. 创建拥有字段 `PriorityClassName` 的 Pod，该字段的值选取上面增加的 PriorityClass。当然，您没有必要直接创建 pod，通常您可以把 `PriorityClassName` 增加到类似 Deployment 这样的集合对象的 Pod 模板中。

<!--
The following sections provide more information about these steps.
-->
以下章节提供了有关这些步骤的详细信息。

<!--
## Enabling priority and preemption
-->
## 启用优先级和抢占

<!--
Pod priority and preemption is disabled by default in Kubernetes 1.8.
To enable the feature, set this command-line flag for the API server 
and the scheduler:
-->
Kubernetes 1.8 版本默认没有开启 Pod 优先级和抢占。为了启用该功能，需要在 API server 和 scheduler 的启动参数中设置：

```
--feature-gates=PodPriority=true
```

<!--
Also set this flag for API server:
-->
在 API server 中还需要设置如下启动参数：


```
--runtime-config=scheduling.k8s.io/v1alpha1=true
```

<!--
After the feature is enabled, you can create [PriorityClasses](#priorityclass)
and create Pods with [`PriorityClassName`](#pod-priority) set.
-->
功能启用后，您能创建 [PriorityClass](#priorityclass)，也能创建使用 [`PriorityClassName`](#pod-priority) 集的 Pod。

<!--
If you try the feature and then decide to disable it, you must remove the PodPriority
command-line flag or set it to false, and then restart the API server and
scheduler. After the feature is disabled, the existing Pods keep their priority
fields, but preemption is disabled, and priority fields are ignored, and you
cannot set PriorityClassName in new Pods.
-->
如果在尝试该功能后想要关闭它，那么您可以把 PodPriority 这个命令行标识从启动参数中移除，或者将它的值设置为false，然后再重启 API server 和 scheduler。功能关闭后，原来的 Pod 会保留它们的优先级字段，但是优先级字段的内容会被忽略，抢占不会生效，在新的 pod 创建时，您也不能设置 PriorityClassName。

## PriorityClass

<!--
A PriorityClass is a non-namespaced object that defines a mapping from a priority
class name to the integer value of the priority. The name is specified in the `name`
field of the PriorityClass object's metadata. The value is specified in the required
`value` field. The higher the value, the higher the priority. 
-->
PriorityClass 是一个不受命名空间约束的对象，它定义了优先级类名跟优先级整数值的映射。它的名称通过 PriorityClass 对象 metadata 中的 `name` 字段指定。值在必选的 `value` 字段中指定。值越大，优先级越高。

<!--
A PriorityClass object can have any 32-bit integer value smaller than or equal to
1 billion. Larger numbers are reserved for critical system Pods that should not
normally be preempted or evicted. A cluster admin should create one PriorityClass
object for each such mapping that they want.
-->
PriorityClass 对象的值可以是小于或者等于 10 亿的 32 位任意整数值。更大的数值被保留给那些通常不应该取代或者驱逐的关键的系统级 Pod 使用。集群管理员应该为它们想要的每个此类映射创建一个 PriorityClass 对象。

<!--
PriorityClass also has two optional fields: `globalDefault` and `description`.
The `globalDefault` field indicates that the value of this PriorityClass should
be used for Pods without a `PriorityClassName`. Only one PriorityClass with
`globalDefault`  set to true can exist in the system. If there is no PriorityClass
with `globalDefault` set, the priority of Pods with no `PriorityClassName` is zero.
-->
PriorityClass 还有两个可选的字段：`globalDefault` 和 `description`。`globalDefault` 表示 PriorityClass 的值应该给那些没有设置 `PriorityClassName` 的 Pod 使用。整个系统只能存在一个 `globalDefault` 设置为 true 的 PriorityClass。如果没有任何 `globalDefault` 为 true 的 PriorityClass 存在，那么，那些没有设置 `PriorityClassName` 的 Pod 的优先级将为 0。

<!--
The `description` field is an arbitrary string. It is meant to tell users of
the cluster when they should use this PriorityClass.
-->
`description` 字段的值可以是任意的字符串。它向所有集群用户描述应该在什么时候使用这个 PriorityClass。

<!--
**Note 1**: If you upgrade your existing cluster and enable this feature, the priority
of your existing Pods will be considered to be zero.
-->
**注1**：如果您升级已经存在的集群环境，并且启用了该功能，那么，那些已经存在系统里面的 Pod 的优先级将会设置为 0。
{: .note}

<!--
**Note 2**: Addition of a PriorityClass with `globalDefault` set to true does not
change the priorities of existing Pods. The value of such a PriorityClass is used only
for Pods created after the PriorityClass is added.
-->
**注2**：此外，将一个 PriorityClass 的 `globalDefault` 设置为 true，不会改变系统中已经存在的 Pod 的优先级。也就是说，PriorityClass 的值只能用于在 PriorityClass 添加之后创建的那些 Pod 当中。
{: .note}

<!--
**Note 3**: If you delete a PriorityClass, existing Pods that use the name of the
deleted priority class remain unchanged, but you are not able to create more Pods
that use the name of the deleted PriorityClass.
-->
**注3**：如果您删除一个 PriorityClass，那些使用了该 PriorityClass 的 Pod 将会保持不变，但是，该 PriorityClass 的名称不能在新创建的 Pod 里面使用。
{: .note}

<!--
### Example PriorityClass
-->
### PriorityClass 示例

```yaml
apiVersion: v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class should be used for XYZ service pods only."
```

## Pod priority

<!--
After you have one or more PriorityClasses, you can create Pods that specify one
of those PriorityClass names in their specifications. The priority admission
controller uses the `priorityClassName` field and populates the integer value
of the priority. If the priority class is not found, the Pod is rejected.
-->
有了一个或者多个 PriorityClass 之后，您在创建 Pod 时就能在模板文件中指定需要使用的 PriorityClass 的名称。优先级准入控制器通过 `priorityClassName` 字段查找优先级数值并且填入 Pod 中。如果没有找到相应的 PriorityClass，Pod 将会被拒绝创建。

<!--
The following YAML is an example of a Pod configuration that uses the PriorityClass
created in the preceding example. The priority admission controller checks the
specification and resolves the priority of the Pod to 1000000.
-->
下面的 YAML 是一个使用了前面创建的 PriorityClass 对 Pod 进行配置的示例。优先级准入控制器会检测配置文件，并将该 Pod 的优先级解析为 1000000。


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
## Preemption
-->
## 抢占

<!--
When Pods are created, they go to a queue and wait to be scheduled. The scheduler
picks a Pod from the queue and tries to schedule it on a Node. If no Node is found
that satisfies all the specified requirements of the Pod, preemption logic is triggered 
for the pending Pod. Let's call the pending pod P. Preemption logic tries to find a Node
where removal of one or more Pods with lower priority than P would enable P to be scheduled
on that Node. If such a Node is found, one or more lower priority Pods get
deleted from the Node. After the Pods are gone, P can be scheduled on the Node. 
-->
Pod 生成后，会进入一个队列等待调度。scheduler 从队列中选择一个 Pod，然后尝试将其调度到某个节点上。如果没有任何节点能够满足 Pod 指定的所有要求，对于这个挂起的 Pod，抢占逻辑就会被触发。当前假设我们把挂起的 Pod 称之为 P。抢占逻辑会尝试查找一个节点，在该节点上移除一个或多个比 P 优先级低的 Pod 后， P 能够调度到这个节点上。如果节点找到了，部分优先级低的 Pod 就会从该节点删除。Pod 消失后，P 就能被调度到这个节点上了。

<!--
### Limitations of preemption (alpha version)
-->
### 限制抢占（alpha 版本）

<!--
#### Starvation of preempting Pod
-->
#### 饥饿式抢占

<!--
When Pods are preempted, the victims get their
[graceful termination period](https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods).
They have that much time to finish their work and exit. If they don't, they are
killed. This graceful termination period creates a time gap between the point
that the scheduler preempts Pods and the time when the pending Pod (P) can be
scheduled on the Node (N). In the meantime, the scheduler keeps scheduling other
pending Pods. As victims exit or get terminated, the scheduler tries to schedule
Pods in the pending queue, and one or more of them may be considered and
scheduled to N before the scheduler considers scheduling P on N. In such a case,
it is likely that when all the victims exit, Pod P won't fit on Node N anymore.
So, scheduler will have to preempt other Pods on Node N or another Node so that
P can be scheduled. This scenario might be repeated again for the second and
subsequent rounds of preemption, and P might not get scheduled for a while.
This scenario can cause problems in various clusters, but is particularly
problematic in clusters with a high Pod creation rate.
-->
Pod 被抢占时，受害者（被抢占的 Pod）会有 [优雅终止期](https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods)。他们有大量的时间完成工作并退出。如果他们不这么做，就会被强行杀死。这个优雅中止期在调度抢占 Pod 以及挂起的 Pod（P）能够被调度到节点（N）之间形成了一个时间间隔。在此期间，调度会继续对其它挂起的 Pod 进行调度。当受害者退出或者终止的时候，scheduler 尝试调度挂起队列中的 Pod，在 scheduler 正式把 Pod P 调度到节点 N 之前，会继续考虑把其它 Pod 调度到节点 N 上。这种情况下，当所有受害者退出时，很有可能 Pod P 已经不再适合于节点 N。因此，scheduler 将不得不抢占节点 N 上的其它 Pod，或者抢占其它节点，以便 P 能被调度。这种情况可能会在第二轮和随后的抢占回合中再次重复，而 P 可能在一段时间内得不到调度。这种场景可能会导致各种集群中的问题，特别是在具有高 Pod 创建率的集群中。

<!--
We will address this problem in the beta version of Pod preemption. The solution
we plan to implement is
[provided here](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/pod-preemption.md#preemption-mechanics).
-->
我们将在 Pod 抢占的 beta 版本解决这个问题。计划的解决方案可以在 [这里](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/pod-preemption.md#preemption-mechanics) 找到。

#### PodDisruptionBudget is not supported

<!--
A [Pod Disruption Budget (PDB)](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
allows application owners to limit the number Pods of a replicated application that
are down simultaneously from voluntary disruptions. However, the alpha version of
preemption does not respect PDB when choosing preemption victims.
We plan to add PDB support in beta, but even in beta, respecting PDB will be best
effort. The Scheduler will try to find victims whose PDB won't be violated by preemption,
but if no such victims are found, preemption will still happen, and lower priority Pods
will be removed despite their PDBs  being violated.
-->
[Pod 破坏预算（Pod Disruption Budget，PDB）](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) 允许应用程序所有者在自愿中断应用的同时限制应用副本的数量。然而，抢占的 alpha 版本在选择抢占受害者时，并没有遵循 PDB。我们计划在 beta 版本增加对 PDB 遵循的支持，但即使是在 beta 版本，也只能做到尽力支持。scheduler 将会试图查找那些不会违反 PDB 的受害者，如果这样的受害者没有找到，抢占依然会发生，即便违反了 PDB，这些低优先级的 Pod 仍将被删除。

<!--
#### Inter-Pod affinity on lower-priority Pods
-->
#### 低优先级 Pod 之间的亲和性

<!--
In version 1.8, a Node is considered for preemption only when
the answer to this question is yes: "If all the Pods with lower priority than
the pending Pod are removed from the Node, can the pending pod be scheduled on
the Node?"
-->
在版本1.8中，只有当这个问题的答案是肯定的时候才考虑一个节点使用抢占：“如果优先级低于挂起的 Pod 的所有 Pod 从节点中移除后，挂起的 Pod 是否能够被调度到该节点上？”

<!--
**Note:** Preemption does not necessarily remove all lower-priority Pods. If the 
pending pod can be scheduled by removing fewer than all lower-priority Pods, then
only a portion of the lower-priority Pods are removed. Even so, the answer to the
preceding question must be yes. If the answer is no, the Node is not considered
for preemption.
-->
**注：** 抢占没有必要移除所有低优先级的 Pod。如果在不移除所有低优先级的 Pod 的情况下，挂起的 Pod 就能调度到节点上，那么就只需要移除部分低优先级的 Pod。即便如此，上述问题的答案还需要是肯定的。如果答案是否定的，抢占功能不会考虑该节点。
{: .note}

<!--
If a pending Pod has inter-pod affinity to one or more of the lower-priority Pods
on the Node, the inter-Pod affinity rule cannot be satisfied in the absence of those
lower-priority Pods. In this case, the scheduler does not preempt any Pods on the
Node. Instead, it looks for another Node. The scheduler might find a suitable Node
or it might not. There is no guarantee that the pending Pod can be scheduled.
-->
如果挂起的 Pod 对节点上的一个或多个较低优先级的 Pod 具有亲和性，那么在没有那些较低优先级的 Pod 的情况下，无法满足 Pod 关联规则。这种情况下，scheduler 不抢占节点上的任何 Pod。它会去查找另外的节点。scheduler 有可能会找到合适的节点，也有可能无法找到，因此挂起的 Pod 并不能保证都能被调度。

<!--
We might address this issue in future versions, but we don't have a clear plan yet.
We will not consider it a blocker for Beta or GA. Part
of the reason is that finding the set of lower-priority Pods that satisfy all
inter-Pod affinity rules is computationally expensive, and adds substantial 
complexity to the preemption logic. Besides, even if preemption keeps the lower-priority
Pods to satisfy inter-Pod affinity, the lower priority Pods might be preempted
later by other Pods, which removes the benefits of having the complex logic of 
respecting inter-Pod affinity.
-->
我们可能会在未来的版本中解决这个问题，但目前还没有一个明确的计划。我们也不会因为它而对 beta 或者 GA 版本的推进有所阻滞。部分原因是，要查找满足 Pod 亲和性规则的低优先级 Pod 集的计算过程非常昂贵，并且抢占过程也增加了大量复杂的逻辑。此外，即便在抢占过程中保留了这些低优先级的 Pod，从而满足了 Pod 间的亲和性，这些低优先级的 Pod 也可能会在后面被其它 Pod 给抢占掉，这就抵消了遵循 Pod 亲和性的复杂逻辑带来的好处。

<!--
Our recommended solution for this problem is to create inter-Pod affinity only towards
equal or higher priority pods.
-->
对于这个问题，我们推荐的解决方案是：对于 Pod 亲和性，只跟相同或者更高优先级的 Pod 之间进行创建。

<!--
#### Cross node preemption
-->
#### 跨节点抢占

<!--
Suppose a Node N is being considered for preemption so that a pending Pod P
can be scheduled on N. P might become feasible on N only if a Pod on another
Node is preempted. Here's an example:
-->
假定节点 N 启用了抢占功能，以便我们能够把挂起的 Pod P 调度到节点 N 上。只有其它节点的 Pod 被抢占时，P 才有可能被调度到节点 N 上面。下面是一个示例：

<!--
* Pod P is being considered for Node N.
* Pod Q is running on another Node in the same zone as Node N.
* Pod P has anit-affinity with Pod Q.
* There are no other cases of anti-affinity between Pod P and other Pods in the zone.
* In order to schedule Pod P on Node N, Pod Q should be preempted, but scheduler
does not perform cross-node preemption. So, Pod P will be deemed unschedulable
on Node N.
-->
* Pod P 正在考虑节点 N。
* Pod Q 正运行在跟节点 N 同区的另外一个节点上。
* Pod P 跟 Pod Q 之间有反亲和性。
* 在这个区域内没有跟 Pod P 具备反亲和性的其它 Pod。
* 为了将 Pod P 调度到节点 N 上，Pod Q 需要被抢占掉，但是 scheduler 不能执行跨节点的抢占。因此，节点 N 将被视为不可调度节点。

<!--
If Pod Q were removed from its Node, the anti-affinity violation would be gone,
and Pod P could possibly be scheduled on Node N.
-->
如果将 Pod Q 从它的节点移除，反亲和性随之消失，那么 Pod P 就有可能被调度到节点 N 上。

<!--
We may consider adding cross Node preemption in future versions if we find an
algorithm with reasonable performance. We cannot promise anything at this point, 
and cross Node preemption will not be considered a blocker for Beta or GA.
-->
如果找到一个性能合理的算法，我们可以考虑在将来的版本中增加跨节点抢占。在这一点上，我们不能承诺任何东西，beta 或者 GA 版本也不会因为跨节点抢占功能而有所阻滞。

{% endcapture %}

{% include templates/concept.md %}
