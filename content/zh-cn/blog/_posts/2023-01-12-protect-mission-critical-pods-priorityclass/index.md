---
layout: blog
title: "使用 PriorityClass 确保你的关键任务 Pod 免遭驱逐"
date: 2023-01-12
slug: protect-mission-critical-pods-priorityclass
description: "Pod 优先级和抢占有助于通过决定调度和驱逐的顺序来确保关键任务 Pod 在资源紧缩的情况下正常运行。"
---

<!--
layout: blog
title: "Protect Your Mission-Critical Pods From Eviction With PriorityClass"
date: 2023-01-12
slug: protect-mission-critical-pods-priorityclass
description: "Pod priority and preemption help to make sure that mission-critical pods are up in the event of a resource crunch by deciding order of scheduling and eviction."
-->

**作者**：Sunny Bhambhani (InfraCloud Technologies)

<!--
**Author:** Sunny Bhambhani (InfraCloud Technologies)
-->

**译者**：Wilson Wu (DaoCloud)

<!--
Kubernetes has been widely adopted, and many organizations use it as their de-facto orchestration engine for running workloads that need to be created and deleted frequently.
-->
Kubernetes 已被广泛使用，许多组织将其用作事实上的编排引擎，用于运行需要频繁被创建和删除的工作负载。

<!--
Therefore, proper scheduling of the pods is key to ensuring that application pods are up and running within the Kubernetes cluster without any issues. This article delves into the use cases around resource management by leveraging the [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) object to protect mission-critical or high-priority pods from getting evicted and making sure that the application pods are up, running, and serving traffic.
-->
因此，是否能对 Pod 进行合适的调度是确保应用 Pod 在 Kubernetes 集群中正常启动并运行的关键。
本文深入探讨围绕资源管理的使用场景，利用 [PriorityClass](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
对象来保护关键或高优先级 Pod 免遭驱逐并确保应用 Pod 正常启动、运行以及提供流量服务。

<!--
## Resource management in Kubernetes
-->
## Kubernetes 中的资源管理 {#resource-management-in-kubernetes}

<!--
The control plane consists of multiple components, out of which the scheduler (usually the built-in [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)) is one of the components which is responsible for assigning a node to a pod.
-->
控制平面由多个组件组成，其中调度程序（通常是内置的 [kube-scheduler](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
是一个负责为 Pod 分配节点的组件。

<!--
Whenever a pod is created, it enters a "pending" state, after which the scheduler determines which node is best suited for the placement of the new pod.
-->
当 Pod 被创建时，它就会进入“Pending”状态，之后调度程序会确定哪个节点最适合放置这个新 Pod。

<!--
In the background, the scheduler runs as an infinite loop looking for pods without a `nodeName` set that are [ready for scheduling](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/). For each Pod that needs scheduling, the scheduler tries to decide which node should run that Pod.
-->
在后台，调度程序以无限循环的方式运行，并寻找没有设置 `nodeName`
且[准备好进行调度](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)的 Pod。
对于每个需要调度的 Pod，调度程序会尝试决定哪个节点应该运行该 Pod。

<!--
If the scheduler cannot find any node, the pod remains in the pending state, which is not ideal.
-->
如果调度程序找不到任何节点，Pod 就会保持在这个不理想的挂起状态下。

{{< note >}}
<!--
To name a few, `nodeSelector`, `taints and tolerations`, `nodeAffinity`, the rank of nodes based on available resources (for example, CPU and memory), and several other criteria are used to determine the pod's placement.
-->
举几个例子，可以用 `nodeSelector`、污点与容忍度、`nodeAffinity`、
基于可用资源（例如 CPU 和内存）的节点排序以及其他若干判别标准来确定将 Pod 放到哪个节点。
{{< /note >}}

<!--
The below diagram, from point number 1 through 4, explains the request flow:
-->
下图从第 1 点到第 4 点解释了请求流程：

<!--
{{< figure src=kube-scheduler.svg alt="A diagram showing the scheduling of three Pods that a client has directly created." title="Scheduling in Kubernetes">}}
-->
{{< figure src=kube-scheduler.svg alt="由客户端直接创建的三个 Pod 的调度示意图。" title="Kubernetes 中的调度">}}

<!--
## Typical use cases
-->
## 典型使用场景 {#typical-use-cases}

<!--
Below are some real-life scenarios where control over the scheduling and eviction of pods may be required.
-->
以下是一些可能需要控制 Pod 调度和驱逐的真实场景。

<!--
1. Let's say the pod you plan to deploy is critical, and you have some resource constraints. An example would be the DaemonSet of an infrastructure component like Grafana Loki. The Loki pods must run before other pods can on every node. In such cases, you could ensure resource availability by manually identifying and deleting the pods that are not required or by adding a new node to the cluster. Both these approaches are unsuitable since the former would be tedious to execute, and the latter could involve an expenditure of time and money.

2. Another use case could be a single cluster that holds the pods for the below environments with associated priorities:
   - Production (`prod`):  top priority
   - Preproduction (`preprod`): intermediate priority
   - Development (`dev`): least priority

   In the event of high resource consumption in the cluster, there is competition for CPU and memory resources on the nodes. While cluster-level autoscaling _may_ add more nodes, it takes time. In the interim, if there are no further nodes to scale the cluster, some Pods could remain in a Pending state, or the service could be degraded as they compete for resources. If the kubelet does evict a Pod from the node, that eviction would be random because the kubelet doesn’t have any special information about which Pods to evict and which to keep.

3. A third example could be a microservice backed by a queuing application or a database running into a resource crunch and the queue or database getting evicted. In such a case, all the other services would be rendered useless until the database can serve traffic again.
-->
1. 假设你计划部署的 Pod 很关键，并且你有一些资源限制。比如 Grafana Loki 等基础设施组件的 DaemonSet。
   Loki Pod 必须先于每个节点上的其他 Pod 运行。在这种情况下，你可以通过手动识别并删除不需要的 Pod 或向集群添加新节点来确保资源可用性。
   但是这两种方法都不合适，因为前者执行起来很乏味，而后者可能需要花费时间和金钱。

2. 另一个使用场景是包含若干 Pod 的单个集群，其中对于以下环境有着不同的优先级 ：
   - 生产环境（`prod`）：最高优先级
   - 预生产环境（`preprod`）：中等优先级
   - 开发环境（`dev`）：最低优先级

   当集群资源消耗较高时，节点上会出现 CPU 和内存资源的竞争。虽然集群自动缩放可能会添加更多节点，但这需要时间。
   在此期间，如果没有更多节点来扩展集群，某些 Pod 可能会保持 Pending 状态，或者服务可能会因争夺资源而被降级。
   如果 kubelet 决定从节点中驱逐一个 Pod，那么该驱逐将是随机的，因为 kubelet 不具有关于要驱逐哪些 Pod 以及要保留哪些 Pod 的任何特殊信息。

3. 第三个示例是后端存在队列或数据库的微服务，当遇到资源紧缩并且队列或数据库被驱逐。
   在这种情况下，所有其他服务都将变得毫无用处，直到数据库可以再次提供流量。

<!--
There can also be other scenarios where you want to control the order of scheduling or order of eviction of pods.
-->
还可能存在你希望控制 Pod 调度顺序或驱逐顺序的其他场景。

<!--
## PriorityClasses in Kubernetes
-->
## Kubernetes 中的 PriorityClass {#priorityclasses-in-kubernetes}

<!--
PriorityClass is a cluster-wide API object in Kubernetes and part of the `scheduling.k8s.io/v1` API group. It contains a mapping of the PriorityClass name (defined in `.metadata.name`) and an integer value (defined in `.value`). This represents the value that the scheduler uses to determine Pod's relative priority.
-->
PriorityClass 是 Kubernetes 中集群范围的 API 对象，也是 `scheduling.k8s.io/v1` API 组的一部分。
它包含 PriorityClass 名称（在 `.metadata.name` 中定义）和一个整数值（在 `.value` 中定义）之间的映射。
整数值表示调度程序用来确定 Pod 相对优先级的值。

<!--
Additionally, when you create a cluster using kubeadm or a managed Kubernetes service (for example, Azure Kubernetes Service), Kubernetes uses PriorityClasses to safeguard the pods that are hosted on the control plane nodes. This ensures that critical cluster components such as CoreDNS and kube-proxy can run even if resources are constrained.
-->
此外，当你使用 kubeadm 或托管 Kubernetes 服务（例如 Azure Kubernetes Service）创建集群时，
Kubernetes 使用 PriorityClass 来保护控制平面节点上托管的 Pod。这种设置可以确保即使资源有限，
CoreDNS 和 kube-proxy 等关键集群组件仍然可以运行。

<!--
This availability of pods is achieved through the use of a special PriorityClass that ensures the pods are up and running and that the overall cluster is not affected.
-->
Pod 的这种可用性是通过使用特殊的 PriorityClass 来实现的，该 PriorityClass 可确保 Pod 正常运行并且整个集群不受影响。

```console
$ kubectl get priorityclass
NAME                      VALUE        GLOBAL-DEFAULT   AGE
system-cluster-critical   2000000000   false            82m
system-node-critical      2000001000   false            82m
```

<!--
The diagram below shows exactly how it works with the help of an example, which will be detailed in the upcoming section.
-->
下图通过一个示例展示其确切工作原理，下一节详细介绍这一原理。

<!--
{{< figure src="decision-tree.svg" alt="A flow chart that illustrates how the kube-scheduler prioritizes new Pods and potentially preempts existing Pods" title="Pod scheduling and preemption">}}
-->
{{< figure src="decision-tree.svg" alt="此流程图说明了 kube-scheduler 如何对新 Pod 进行优先级排序并可能对现有 Pod 进行抢占" title="Pod 调度和抢占">}}

<!--
### Pod priority and preemption
-->
### Pod 优先级和抢占 {#pod-priority-and-preemption}

<!--
[Pod preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) is a Kubernetes feature that allows the cluster to preempt pods (removing an existing Pod in favor of a new Pod) on the basis of priority. [Pod priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority) indicates the importance of a pod relative to other pods while scheduling. If there aren't enough resources to run all the current pods, the scheduler tries to evict lower-priority pods over high-priority ones.
-->
[Pod 抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)是 Kubernetes 的一项功能，
允许集群基于优先级抢占 Pod（删除现有 Pod 以支持新 Pod）。
[Pod 优先级](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)表示调度时 Pod 相对于其他 Pod 的重要性。
如果没有足够的资源来运行当前所有 Pod，调度程序会尝试驱逐优先级较低的 Pod，而不是优先级高的 Pod。

<!--
Also, when a healthy cluster experiences a node failure, typically, lower-priority pods get preempted to create room for higher-priority pods on the available node. This happens even if the cluster can bring up a new node automatically since pod creation is usually much faster than bringing up a new node.
-->
此外，当健康集群遇到节点故障时，通常情况下，较低优先级的 Pod 会被抢占，以便在可用节点上为较高优先级的 Pod 腾出空间。
即使集群可以自动创建新节点，也会发生这种情况，因为 Pod 创建通常比创建新节点快得多。

<!--
### PriorityClass requirements
-->
### PriorityClass 的前提条件 {#priorityclass-requirements}

<!--
Before you set up PriorityClasses, there are a few things to consider.
-->
在配置 PriorityClass 之前，需要考虑一些事项。

<!--
1. Decide which PriorityClasses are needed. For instance, based on environment, type of pods, type of applications, etc.
2. The default PriorityClass resource for your cluster. The pods without a `priorityClassName` will be treated as priority 0.
3. Use a consistent naming convention for all PriorityClasses.
4. Make sure that the pods for your workloads are running with the right PriorityClass.
-->
1. 决定哪些 PriorityClass 是需要的。例如，基于环境、Pod 类型、应用类型等。
2. 集群中默认的 PriorityClass 资源。当 Pod 没有设置 `priorityClassName` 时，优先级将被视为 0。
3. 对所有 PriorityClass 使用一致的命名约定。
4. 确保工作负载的 Pod 正在使用正确的 PriorityClass。

<!--
## PriorityClass hands-on example
-->
## PriorityClass 的动手示例 {#priorityclass-hands-on-example}

<!--
Let’s say there are 3 application pods: one for prod, one for preprod, and one for development. Below are three sample YAML manifest files for each of those.
-->
假设有 3 个应用 Pod：一个用于生产（prod），一个用于预生产（prepord），一个用于开发（development）。
下面是这三个示例的 YAML 清单文件。

```yaml
---
# 开发环境（dev）
apiVersion: v1
kind: Pod
metadata:
  name: dev-nginx
  labels:
    env: dev
spec:
  containers:
  - name: dev-nginx
    image: nginx
    resources:
      requests:
        memory: "256Mi"
        cpu: "0.2"
      limits:
        memory: ".5Gi"
        cpu: "0.5"
```

```yaml
---
# 预生产环境（prepord）
apiVersion: v1
kind: Pod
metadata:
  name: preprod-nginx
  labels:
    env: preprod
spec:
  containers:
  - name: preprod-nginx
    image: nginx
    resources:
      requests:
        memory: "1.5Gi"
        cpu: "1.5"
      limits:
        memory: "2Gi"
        cpu: "2"
```

```yaml
---
# 生产环境（prod）
apiVersion: v1
kind: Pod
metadata:
  name: prod-nginx
  labels:
    env: prod
spec:
  containers:
  - name: prod-nginx
    image: nginx
    resources:
      requests:
        memory: "2Gi"
        cpu: "2"
      limits:
        memory: "2Gi"
        cpu: "2"
```

<!--
You can create these pods with the `kubectl create -f <FILE.yaml>` command, and then check their status using the `kubectl get pods` command. You can see if they are up and look ready to serve traffic:
-->
你可以使用 `kubectl create -f <FILE.yaml>` 命令创建这些 Pod，然后使用 `kubectl get pods` 命令检查它们的状态。
你可以查看它们是否已启动并准备好提供流量：

```console
$ kubectl get pods --show-labels
NAME            READY   STATUS    RESTARTS   AGE   LABELS
dev-nginx       1/1     Running   0          55s   env=dev
preprod-nginx   1/1     Running   0          55s   env=preprod
prod-nginx      0/1     Pending   0          55s   env=prod
```

<!--
Bad news. The pod for the Production environment is still Pending and isn't serving any traffic.
-->
坏消息是生产环境的 Pod 仍处于 `Pending` 状态，并且不能提供任何流量。

<!--
Let's see why this is happening:
-->
让我们看看为什么会发生这种情况：

```console
$ kubectl get events
...
...
5s          Warning   FailedScheduling   pod/prod-nginx      0/2 nodes are available: 1 Insufficient cpu, 2 Insufficient memory.
```

<!--
In this example, there is only one worker node, and that node has a resource crunch.
-->
在此示例中，只有一个工作节点，并且该节点存在资源紧缩。

<!--
Now, let's look at how PriorityClass can help in this situation since prod should be given higher priority than the other environments.
-->
现在，让我们看看在这种情况下 PriorityClass 如何提供帮助，因为生产环境应该比其他环境具有更高的优先级。

<!--
## PriorityClass API
-->
## PriorityClass 的 API {#priorityclass-api}

<!--
Before creating PriorityClasses based on these requirements, let's see what a basic manifest for a PriorityClass looks like and outline some prerequisites:
-->
在根据这些需求创建 PriorityClass 之前，让我们看看 PriorityClass 的基本清单是什么样的，
并给出一些先决条件：

<!--
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: PRIORITYCLASS_NAME
value: 0 # any integer value between -1000000000 to 1000000000 
description: >-
  (Optional) description goes here!
globalDefault: false # or true. Only one PriorityClass can be the global default.
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: PRIORITYCLASS_NAME
value: 0 # -1000000000 到 1000000000 之间的任何整数值 
description: >-
  （可选）描述内容！
globalDefault: false # 或 true。只有一个 PriorityClass 可以作为全局默认值。
```

<!--
Below are some prerequisites for PriorityClasses:
-->
以下是 PriorityClass 的一些先决条件：

<!--
- The name of a PriorityClass must be a valid DNS subdomain name.
- When you make your own PriorityClass, the name should not start with `system-`, as those names are reserved by Kubernetes itself (for example, they are used for two built-in PriorityClasses).
- Its absolute value should be between -1000000000 to 1000000000 (1 billion).
- Larger numbers are reserved by PriorityClasses such as `system-cluster-critical` (this Pod is critically important to the cluster) and `system-node-critical` (the node critically relies on this Pod). `system-node-critical` is a higher priority than `system-cluster-critical`, because a cluster-critical Pod can only work well if the node where it is running has all its node-level critical requirements met.
- There are two optional fields:
  - `globalDefault`: When true, this PriorityClass is used for pods where a `priorityClassName` is not specified. Only one PriorityClass with `globalDefault` set to true can exist in a cluster. If there is no PriorityClass defined with globalDefault set to true, all the pods with no priorityClassName defined will be treated with 0 priority (i.e. the least priority).
  - `description`: A string with a meaningful value so that people know when to use this PriorityClass.
-->
- PriorityClass 的名称必须是有效的 DNS 子域名。
- 当你创建自己的 PriorityClass 时，名称不应以 `system-` 开头，因为这类名称是被 Kubernetes
  本身保留的（例如，它们被用于两个内置的 PriorityClass）。
- 其绝对值应在 -1000000000 到 1000000000（10 亿）之间。
- 较大的数值由 PriorityClass 保留，例如 `system-cluster-critical`（此 Pod 对集群至关重要）以及 `system-node-critical`（节点严重依赖此 Pod）。
  `system-node-critical` 的优先级高于 `system-cluster-critical`，因为集群级别关键 Pod 只有在其运行的节点满足其所有节点级别关键要求时才能正常工作。
- 额外两个可选字段：
  - `globalDefault`：当为 true 时，此 PriorityClass 用于未设置 `priorityClassName` 的 Pod。
    集群中只能存在一个 `globalDefault` 设置为 true 的 PriorityClass。
    如果没有 PriorityClass 的 globalDefault 设置为 true，则所有未定义 priorityClassName 的 Pod 都将被视为 0 优先级（即最低优先级）。
  - `description`：具备有意义值的字符串，以便人们知道何时使用此 PriorityClass。

{{< note >}}
<!--
Adding a PriorityClass with `globalDefault` set to `true` does not mean it will apply the same to the existing pods that are already running. This will be applicable only to the pods that came into existence after the PriorityClass was created.
-->
添加一个将 `globalDefault` 设置为 `true` 的 PriorityClass 并不意味着它将同样应用于已在运行的现有 Pod。
这仅适用于创建 PriorityClass 之后出现的 Pod。
{{< /note >}}

<!--
### PriorityClass in action
-->
### PriorityClass 的实际应用 {#priorityclass-in-action}

<!--
Here's an example. Next, create some environment-specific PriorityClasses:
-->
这里有一个例子。接下来，创建一些针对环境的 PriorityClass：

<!--
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: dev-pc
value: 1000000
globalDefault: false
description: >-
  (Optional) This priority class should only be used for all development pods.
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: dev-pc
value: 1000000
globalDefault: false
description: >-
  （可选）此 PriorityClass 只能用于所有开发环境（dev）Pod。

```

<!--
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: preprod-pc
value: 2000000
globalDefault: false
description: >-
  (Optional) This priority class should only be used for all preprod pods.
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: preprod-pc
value: 2000000
globalDefault: false
description: >-
  （可选）此 PriorityClass 只能用于所有预生产环境（preprod）Pod。
```

<!--
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: prod-pc
value: 4000000
globalDefault: false
description: >-
  (Optional) This priority class should only be used for all prod pods.
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: prod-pc
value: 4000000
globalDefault: false
description: >-
  （可选）此 PriorityClass 只能用于所有生产环境（prod）Pod。
```

<!--
Use `kubectl create -f <FILE.YAML>` command to create a pc and `kubectl get pc` to check its status.
-->
使用 `kubectl create -f <FILE.YAML>` 命令创建 PriorityClass 并使用 `kubectl get pc` 检查其状态。

```console
$ kubectl get pc
NAME                      VALUE        GLOBAL-DEFAULT   AGE
dev-pc                    1000000      false            3m13s
preprod-pc                2000000      false            2m3s
prod-pc                   4000000      false            7s
system-cluster-critical   2000000000   false            82m
system-node-critical      2000001000   false            82m
```

<!--
The new PriorityClasses are in place now. A small change is needed in the pod manifest or pod template (in a ReplicaSet or Deployment). In other words, you need to specify the priority class name at `.spec.priorityClassName` (which is a string value).
-->
新的 PriorityClass 现已就位。需要对 Pod 清单或 Pod 模板（在 ReplicaSet 或 Deployment 中）进行一些小的修改。
换句话说，你需要在 `.spec.priorityClassName`（这是一个字符串值）中指定 PriorityClass 名称。

<!--
First update the previous production pod manifest file to have a PriorityClass assigned, then delete the Production pod and recreate it. You can't edit the priority class for a Pod that already exists.
-->
首先更新之前的生产环境 Pod 清单文件以分配 PriorityClass，然后删除生产环境 Pod 并重新创建它。你无法编辑已存在 Pod 的优先级类别。

<!--
In my cluster, when I tried this, here's what happened. First, that change seems successful; the status of pods has been updated:
-->
在我的集群中，当我尝试此操作时，发生了以下情况。首先，这种改变似乎是成功的；Pod 的状态已被更新：

```console
$ kubectl get pods --show-labels
NAME            READY   STATUS    	RESTARTS   AGE   LABELS
dev-nginx       1/1     Terminating	0          55s   env=dev
preprod-nginx   1/1     Running   	0          55s   env=preprod
prod-nginx      0/1     Pending   	0          55s   env=prod
```

<!--
The dev-nginx pod is getting terminated. Once that is successfully terminated and there are enough resources for the prod pod, the control plane can schedule the prod pod:
-->
dev-nginx Pod 即将被终止。一旦成功终止并且有足够的资源用于 prod Pod，控制平面就可以对 prod Pod 进行调度：

```console
Warning   FailedScheduling   pod/prod-nginx    0/2 nodes are available: 1 Insufficient cpu, 2 Insufficient memory.
Normal    Preempted          pod/dev-nginx     by default/prod-nginx on node node01
Normal    Killing            pod/dev-nginx     Stopping container dev-nginx
Normal    Scheduled          pod/prod-nginx    Successfully assigned default/prod-nginx to node01
Normal    Pulling            pod/prod-nginx    Pulling image "nginx"
Normal    Pulled             pod/prod-nginx    Successfully pulled image "nginx"
Normal    Created            pod/prod-nginx    Created container prod-nginx
Normal    Started            pod/prod-nginx    Started container prod-nginx
```

<!--
## Enforcement
-->
## 执行 {#enforcement}

<!--
When you set up PriorityClasses, they exist just how you defined them. However, people (and tools) that make changes to your cluster are free to set any PriorityClass, or to not set any PriorityClass at all. However, you can use other Kubernetes features to make sure that the priorities you wanted are actually applied.
-->
配置 PriorityClass 时，它们会按照你所定义的方式存在。
但是，对集群进行变更的人员（和工具）可以自由设置任意 PriorityClass，
或者根本不设置任何 PriorityClass。然而，你可以使用其他 Kubernetes 功能来确保你想要的优先级被实际应用起来。

<!--
As an alpha feature, you can define a [ValidatingAdmissionPolicy](/blog/2022/12/20/validating-admission-policies-alpha/) and a ValidatingAdmissionPolicyBinding so that, for example, Pods that go into the `prod` namespace must use the `prod-pc` PriorityClass. With another ValidatingAdmissionPolicyBinding you ensure that the `preprod` namespace uses the `preprod-pc` PriorityClass, and so on. In *any* cluster, you can enforce similar controls using external projects such as [Kyverno](https://kyverno.io/) or [Gatekeeper](https://open-policy-agent.github.io/gatekeeper/), through validating admission webhooks.
-->
作为一项 Alpha 级别功能，你可以定义一个 [ValidatingAdmissionPolicy](/blog/2022/12/20/validating-admission-policies-alpha/)
和一个 ValidatingAdmissionPolicyBinding，例如，进入 `prod` 命名空间的 Pod 必须使用 `prod-pc` PriorityClass。
通过另一个 ValidatingAdmissionPolicyBinding，你可以确保 `preprod` 命名空间使用 `preprod-pc` PriorityClass，依此类推。
在*任何*集群中，你可以使用外部项目，例如 [Kyverno](https://kyverno.io/) 或 [Gatekeeper](https://open-policy-agent.github.io/gatekeeper/) 通过验证准入 Webhook 实施类似的控制。

<!--
However you do it, Kubernetes gives you options to make sure that the PriorityClasses are used how you wanted them to be, or perhaps just to [warn](https://open-policy-agent.github.io/gatekeeper/website/docs/violations/#warn-enforcement-action) users when they pick an unsuitable option.
-->
无论你如何操作，Kubernetes 都会为你提供选项，确保 PriorityClass 的用法如你所愿，
或者只是当用户选择不合适的选项时做出[警告](https://open-policy-agent.github.io/gatekeeper/website/docs/violations/#warn-enforcement-action)。

<!--
## Summary
-->
## 总结 {#summary}

<!--
The above example and its events show you what this feature of Kubernetes brings to the table, along with several scenarios where you can use this feature. To reiterate, this helps ensure that mission-critical pods are up and available to serve the traffic and, in the case of a resource crunch, determines cluster behavior.
-->
上面的示例及其事件向你展示了 Kubernetes 此功能带来的好处，以及可以使用此功能的几种场景。
重申一下，这一机制有助于确保关键任务 Pod 启动并可用于提供流量，并在资源紧张的情况下确定集群行为。

<!--
It gives you some power to decide the order of scheduling and order of [preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) for Pods. Therefore, you need to define the PriorityClasses sensibly. For example, if you have a cluster autoscaler to add nodes on demand, make sure to run it with the `system-cluster-critical` PriorityClass. You don't want to get in a situation where the autoscaler has been preempted and there are no new nodes coming online.
-->
它赋予你一定的权力来决定 Pod 的调度顺序和[抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)顺序。
因此，你需要明智地定义 PriorityClass。例如，如果你有一个集群自动缩放程序来按需添加节点，
请确保使用 `system-cluster-critical` PriorityClass 运行它。你不希望遇到自动缩放器 Pod 被抢占导致没有新节点上线的情况。

<!--
If you have any queries or feedback, feel free to reach out to me on [LinkedIn](http://www.linkedin.com/in/sunnybhambhani).
-->
如果你有任何疑问或反馈，可以随时通过 [LinkedIn](http://www.linkedin.com/in/sunnybhambhani) 与我联系。
