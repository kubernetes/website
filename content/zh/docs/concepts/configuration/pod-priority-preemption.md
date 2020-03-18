---
title: Pod 优先级和抢占
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

{{< feature-state for_k8s_version="1.14" state="stable" >}}

[Pods](/docs/user-guide/pods) 拥有 _优先级_ 。优先级表示Pod相对于其他Pod的重要性。
如果一个Pod不能被调度，调度程序会尝试抢占（逐出）较低优先级的Pod，以便对挂起的Pod进行调度。

{{% /capture %}}

{{% capture body %}}


{{< warning >}}
在集群中并非所有用户都是可以信任的，恶意用户可能会创建最高优先级的pod，从而导致其他Pod被驱逐/无法调度。
管理员可以使用ResourceQuota阻止用户创建高优先级的Pod。

有关详细信息，请参阅 [默认情况下限制特定优先级的资源消耗](/docs/concepts/policy/resource-quotas/
#limit-priority-class-consumption-by-default)
{{< /warning >}}

## 如何使用优先级和抢占 {#how-to-use-priority-and-preemption}

使用优先级和抢占：

1.  添加一个或多个 [PriorityClasses](#priorityclass).

1.  创建带[`priorityClassName`](#pod-priority)的Pod映射到一个已存在的PriorityClasses。
    当然您无需直接创建Pod；通常将`priorityClassName`添加到诸如Deployment之类的集合Pod对象的模板中。

继续阅读有关这些步骤的更多信息。

{{< note >}}
Kubernetes已经提供了两个PriorityClass：`system-cluster-critical` 和`system-node-critical`。
这些是通用类，用于[关键插件 Pod 的调度保证](/docs/tasks/administer-cluster/guaranteed-scheduling
-critical-addon-pods/)。
{{< /note >}}

如果尝试使用该特性然后决定禁用它，则必须删除PodPriority命令行标志或将其设置为`false`，
然后重新启动API server和scheduler。 禁用该特性后，现有Pod保留其优先级字段，但抢占被禁用，
并且优先级字段被忽略。
如果禁用该特性，则无法在新Pod中设置`priorityClassName`。

## 如何禁用抢占 {#how-to-disable-preemption}

{{< caution >}}
当集群处于资源压力之下时，关键的Pod依赖调度程序的抢占进行调度。因此，不建议禁用抢占。
{{< /caution >}}

{{< note >}}
在Kubernetes 1.15和更高版本中，如果启用了特性`NonPreemptingPriority`，
PriorityClasses可以选择设置`preemptionPolicy: Never`。这将防止带PriorityClass
的Pod抢占其他Pod。
{{< /note >}}

抢占由kube-scheduler参数`disablePreemption`控制，默认情况下将其设置为`false`。
如果阅读了上述注意事项但仍要禁用抢占，则可以将`disablePreemption`设置为`true`。

此选项仅在组件配置中可用，而在旧式命令行选项中不可用。以下是禁用抢占的示例的组件配置：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

disablePreemption: true
```

## PriorityClass

PriorityClass是一个非命名空间对象，它定义了从优先级类名到优先级整数值的映射。`name` 是在
PriorityClass对象元数据名称字段中指定的。`value`是必填字段。 数组越大意味着优先级越高。
PriorityClass对象的名称必须是有效的[DNS子域名](/docs/concepts/overview/working-with
-objects/names#dns-subdomain-names)，并且不能以`system-` 作为前缀。

PriorityClass对象的值可以为小于或等于10亿的任何32位整数值。较大的值保留给通常不应该抢占或驱
逐的关键系统Pod。集群管理员应为他们想要的每个映射类型创建一个PriorityClass对象。

PriorityClass有两个可选字段：`globalDefault` 和`description`。`globalDefault`字段
指示此PriorityClass的值应用于不具有`priorityClassName`的Pod。系统中只能存在一个将
`globalDefault`设置为true的PriorityClass。如果没有设置`globalDefault`的PriorityClass，
则没有`priorityClassName`的Pod的优先级为零。

`description`字段是一个任意的字符串。它旨在告诉群集用户应何时使用此PriorityClass。

### 关于PodPriority和现有集群的说明 {#notes-about-podpriority-and-existing-clusters}

-   如果升级现有群集并启用此功能，则现有Pod的优先级为零。

-   添加将`globalDefault`设置为`true`的PriorityClass的不会更改现有Pod的优先级。此类
    PriorityClass的值仅用于添加PriorityClass之后创建的Pod。

-   如果删除PriorityClass，使用已删除PriorityClass名称的现有Pod保持不变，但是您不能创建更多使
    用已删除PriorityClass名称的Pod。

### Example PriorityClass

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class should be used for XYZ service pods only."
```

## 非抢占PriorityClass {#non-preempting-priority-class}

{{< feature-state for_k8s_version="1.15" state="alpha" >}}

具有`PreemptionPolicy: Never`的Pod将放在优先级较低的Pod之前的调度队列中，
但是它们不能抢占其他Pod。
等待调度的非抢占式Pod将保留在调度队列中，直到有足够的可用资源可以调度为止。
像其他pod一样，非抢占pod也要受调度程序的限制。
这意味着，如果调度程序尝试了这些Pod，但无法对其进行调度，则将以较低的频率重试它们，
从而允许优先级较低的其他Pod在它们之前进行调度。

非抢占式Pod可能仍会被其他高优先级的Pod抢占。

`PreemptionPolicy`默认为`PreemptLowerPriority`，
这将允许PriorityClass的pod抢占较低优先级的pod（与现有的默认行为一样）。
如果`PreemptionPolicy`设置为`Never`，则该PriorityClass中的Pod将是不可抢占的。

使用该`PreemptionPolicy`字段需要开启`NonPreemptingPriority`
[特性](/docs/reference/command-line-tools-reference/feature-gates/)。

一个示例用于数据科学作业。用户可以提交要优先于其他工作的作业，
但不希望通过抢占在运行的Pod终止现存的作业。一旦有足够的群集资源“自然”释放，
带有`PreemptionPolicy: Never`并且拥有更高优先级的作业将会优先于队列中其他pod被调度。

### Example Non-preempting PriorityClass

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

## Pod优先级 {#pod-priority}

拥有一个或多个PriorityClass之后，可以在创建Pod时指定这些PriorityClass名称之一。
优先级允许控制器使用该`priorityClassName`字段并填充优先级的整数值。
如果找不到PriorityClass，该Pod会被拒绝。

以下YAML是使用上一示例中创建的PriorityClass的Pod配置示例。
优先级控制器检查规格并将Pod的优先级解析为1000000。

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

### Pod优先级对调度顺序的影响 {#effect-of-pod-priority-on-scheduling-order}

启用Pod优先级时，调度程序按优先级对挂起状态Pod进行排序，
并将挂起状态Pod放在调度队列中优先级较低的其他挂起状态Pod的前面。
结果是，如果满足较高优先级的Pod的调度要求，则可以比具有较低优先级的Pod更快地调度它。
如果无法调度此类Pod，则调度程序将继续尝试调度其他优先级较低的Pod。

## 抢占 {#preemption}

创建Pod后，它们会进入队列并等待调度。调度程序从队列中选择一个Pod，然后尝试在节点上调度它。
如果未找到满足Pod的所有指定要求的Node，则为挂起的Pod触发抢占逻辑。假设将挂起的Pod称为P。
抢占逻辑会尝试查找一个节点，在其中删除一个或多个优先级低于P的Pod将使P可以在该节点上进行调度。
如果找到了这样的节点，则从该节点驱逐一个或多个优先级较低的Pod。在Pod被驱逐之后，P可以在节点上被调度。

### 公开给用户的信息 {#user-exposed-information}

当Pod P抢占节点N上的一个或更多Pod时,Pod状态的`nominatedNodeName`字段将设置为节点N的名称。
此字段可帮助调度程序跟踪为Pod P保留的资源，并为用户提供有关集群中抢占的信息。

请注意，Pod P不一定要安排到“指定节点”。在Pod被抢占之后，他们将获得正常的终止期限。
如果在调度程序等待被抢占Pod终止时另一个节点变得可用，则调度程序将使用另一个节点来调度PodP。
因此 ，Pod规范的`nominatedNodeName`和`nodeName`并不总是相同。
同样，如果调度程序抢占节点N上的Pod，但一个比Pod P优先级更高的Pod到来，则调度程序可以将节点N给新到的更高优先级的Pod。
在这种情况下，调度程序会清除Pod P的`nominatedNodeName`。
通过执行此操作，调度程序使Pod P可选另一个节点上的Pod抢占。

### 抢占的局限性 {#limitations-of-preemption}

#### 优雅的停止被抢占的Pod {#graceful-termination-of-preemption-victims}

当Pod被抢占时，将触发[graceful termination period](/docs/concepts/workloads/pods/pod/#termination-of-pods)。
在指定的时间内完成工作并退出。如果超出时限，他们将被强行终止。
这个适度的终止周期在调度程序抢占Pod的时间点，与可以在节点（N）上调度挂起Pod（P）的时间点之间创建了一个时间间隔。
同时，调度程序将继续调度其他挂起的Pod。当被抢占的Pod退出或被终止时，调度程序将尝试从挂起的队列中调度Pod。
因此，在调度程序抢占Pod时间与Pod P被调度的时间之间通常存在时间间隔。
为了最大程度地减少这种差距，可以将优先级较低的Pod的正常终止时间设置为零或较小的数字。

#### 支持PodDisruptionBudget，但不能保证 {#poddisruptionbudget-is-supported-but-not-guaranteed}

[Pod Disruption Budget (PDB)](/docs/concepts/workloads/pods/disruptions/)允许应用程序所有者
自愿中断来减少应用程序副本的Pod数量。
在抢占Pod时，Kubernetes支持PDB，但尊重PDB是最大的努力。
调度程序将尝试查找没有被抢占所影响的PDB，
但是如果找不到此类，则抢占仍会发生，并且优先级较低的Pod将被删除，尽管其PDB被违反了。

#### 低优先级Pod间的亲和力 {#inter-pod-affinity-on-lower-priority-pods}

仅当对以下问题的回答为是时，才考虑将节点抢占：“如果从节点中删除了优先级比挂起的Pod低的所有Pod，可以在该节点上调度挂起的Pod吗？”

{{< note >}}
抢占并不必要删除所有优先级更低的Pod。如果可以通过删除部分较低优先级的Pod来调度暂挂Pod，则仅删除一部分较低优先级的Pod。
即使这样，对前面问题的回答也必须是。如果答案为否，则不考虑将节点抢占。
{{< /note >}}

如果挂起的Pod对节点上的一个或多个更低优先级Pod具有Pod间的亲和性，则在缺少那些优先级较低Pod的情况下，Pod间的亲和性规则无法满足。
在这种情况下，调度程序不会抢占节点上的任何Pod。而是寻找另一个节点。
调度程序可能会找到合适的节点，也可能找不到。无法保证可以调度挂起的Pod。

我们针对此问题的推荐解决方案是仅对相同或更高优先级的Pod创建Pod间的亲和力。

#### 交叉节点抢占 {#cross-node-preemption}

假设正在考虑将节点N抢占，以便可以在N上调度挂起的Pod P。
只有在另一个节点上的Pod被抢占时，P才可能在N上变为可调度。这是一个例子：

*   正在考虑将Pod P调度到节点N。
*   Pod Q与节点N在同一区域中的另一个节点上运行。
*   Pod P与Pod Q具有区域范围的反亲和力（`topologyKey: failure-domain.beta.kubernetes.io/zone`）。
*   该区域中的Pod P和其他Pod之间没有其他反亲和的情况。
*   为了在节点N上调度Pod P，可以抢占Pod Q，但是调度程序不执行交叉节点抢占。因此，在节点N上Pod P将被视为不可调度。

如果将Pod Q从其节点中删除，则没有反亲和性，Pod P可能会安排在Node N上。

如果有足够的需求并且我们找到性能合理的算法，我们可能会考虑在将来的版本中添加交叉节点抢占。

## 问题排查 {#troubleshooting}

容器优先级和抢占可能会产生意想不到的副作用。以下是一些潜在问题的示例以及解决这些问题的方法。

### Pods被不必要的抢占 {#pods-are-preempted-unnecessarily}

抢占会在资源压力下从群集中删除现有Pod，以便为更高优先级的Pod提供空间。
如果您错误地为某些Pod赋予了较高的优先级，则这些无意中具有较高优先级的Pod可能会导致集群中的抢占。
通过设置Pod规范中的`priorityClassName`字段来指定Pod优先级，
然后解析优先级的整数值并将其填充到的`priority`字段中`podSpec`。

要解决该问题，您可以将这些Pod的`priorityClassName`更改为更低优先级的类，或将该字段保留为空。
`priorityClassName`默认情况下将被置为零。

抢占Pod时，将记录抢占Pod的事件。仅当群集没有足够的资源用于Pod时，才应进行抢占。
在这种情况下，仅当挂起Pod（抢占者）的优先级高于被抢占Pod时，才发生抢占。
当没有挂起的Pod或挂起的Pod的优先级等于或低于被抢占Pod时，不得发生抢占。
如果在这种情况下发生抢占，请反馈问题。

### Pod被抢占，但抢占者未被调度 {#pods-are-preempted-but-the-preemptor-is-not-scheduled}

Pod被抢占时，有一个自身的优雅终止周期，默认为30秒。如果被抢占Pod在此期间内未终止，则将被强制终止。
一旦所有被抢占的Pod离开，抢占的Pod就可以被调度。

当抢占的Pod等待被抢占Pod离开时，可以创建适合同一节点的更高优先级的Pod。
在这种情况下，调度程序将调度优先级更高的Pod而不是当前抢占的Pod。

这是预期的行为：具有较高优先级的Pod应该代替具有较低优先级的Pod。
其他控制器操作，例如[集群自动伸缩](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaling)
最终可能会提供更多空间调度挂起的Pod。

### 较高优先级的Pod优先于较低优先级的Pod {#higher-priority-pods-are-preempted-before-lower-priority-pods}

调度程序尝试查找可以运行挂起的Pod的节点。如果未找到节点，调度程序将尝试从任意节点中删除优先级较低的Pod，以便为挂起的Pod腾出空间。
如果具有低优先级Pod的节点不可运行挂起的Pod，则调度程序可以选择具有较高优先级Pod的另一个节点（与另一个节点上的Pod相比）进行抢占。
被抢占的Pod必须比抢占的Pod拥有更低的优先级。

当有多个可用于抢占的节点时，调度程序将尝试选择具有一组最低优先级的Pod的节点。
但是，如果此类Pod具有PodDisruptionBudget，如果抢占了它们，则该PodDisruptionBudget将被违反，
则调度程序可能会选择具有更高优先级Pod的另一个节点。

当存在多个要抢占的节点并且以上情况均不适用时，调度程序将选择优先级最低的节点。

## Pod优先级与QOS之间的相互作用 {#interactions-of-pod-priority-and-qos}

Pod优先级和{{< glossary_tooltip text="QoS class" term_id="qos-class" >}}是两个正交的功能，几乎没有影响，
并且对基于Pod的QoS类别设置，Pod的优先级没有默认限制。调度程序的抢占逻辑在选择抢占目标时不考虑QoS。
抢占考虑Pod的优先级，并尝试选择优先级最低的一组目标。
仅当调度程序在除去最低优先级的Pod，不足以调度抢占的Pod或最低优先级的Pod受`PodDisruptionBudget`保护时，才考虑将优先级较高的Pod抢占。

唯一同时考虑QoS和Pod优先级的组件是[kubelet out-of-resource eviction](/docs/tasks/administer-cluster/out-of-resource/)。
kubelet在超出请求匮乏资源的基础上对Pod排序，然后按优先级，和相对于Pods的调度请求消耗的匮乏资源使用，将Pod逐出。
有关更多详细信息，请参阅[evicting end-user pods](/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods)。

如果kubelet的资源使用量未超出请求值，则不会驱逐Pod。如果优先级较低的Pod没有超出请求值，将不会被驱逐。
可能会驱逐另一个优先级更高，但是超过请求值的Pod。


{{% /capture %}}
{{% capture whatsnext %}}
* 阅读有关与PriorityClasses一起使用ResourceQuotas的信息： [默认情况下限制使用Priority Class](/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
{{% /capture %}}
