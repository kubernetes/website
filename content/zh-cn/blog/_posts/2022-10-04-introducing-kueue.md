---
layout: blog
title: "Kueue 介绍"
date: 2022-10-04
slug: introducing-kueue
---
<!--
layout: blog
title: "Introducing Kueue"
date: 2022-10-04
slug: introducing-kueue
-->

<!--
**Authors:** Abdullah Gharaibeh (Google), Aldo Culquicondor (Google)
-->
**作者：** Abdullah Gharaibeh（谷歌），Aldo Culquicondor（谷歌）

<!--
Whether on-premises or in the cloud, clusters face real constraints for resource usage, quota, and cost management reasons. 
Regardless of the autoscalling capabilities, clusters have finite capacity.  As a result, users want an easy way to fairly and 
efficiently share resources. 
-->
无论是在本地还是在云端，集群都面临着资源使用、配额和成本管理方面的实际限制。
无论自动扩缩容能力如何，集群的容量都是有限的。
因此，用户需要一种简单的方法来公平有效地共享资源。

<!--
In this article, we introduce [Kueue](https://github.com/kubernetes-sigs/kueue/tree/main/docs#readme),
an open source job queueing controller designed to manage batch jobs as a single unit.
Kueue leaves pod-level orchestration to existing stable components of Kubernetes.
Kueue natively supports the Kubernetes [Job](/docs/concepts/workloads/controllers/job/)
API and offers hooks for integrating other custom-built APIs for batch jobs.
-->
在本文中，我们介绍了 [Kueue](https://github.com/kubernetes-sigs/kueue/tree/main/docs#readme)，
这是一个开源作业队列控制器，旨在将批处理作业作为一个单元进行管理。
Kueue 将 Pod 级编排留给 Kubernetes 现有的稳定组件。
Kueue 原生支持 Kubernetes [Job](/zh-cn/docs/concepts/workloads/controllers/job/) API，
并提供用于集成其他定制 API 以进行批处理作业的钩子。

<!--
## Why Kueue?
-->
## 为什么是 Kueue?
<!--
Job queueing is a key feature to run batch workloads at scale in both on-premises and cloud environments. 
The main goal of job queueing is to manage access to a limited pool of resources shared by multiple tenants. 
Job queueing decides which jobs should wait, which can start immediately, and what resources they can use.
-->
作业队列是在本地和云环境中大规模运行批处理工作负载的关键功能。
作业队列的主要目标是管理对多个租户共享的有限资源池的访问。
作业排队决定了哪些作业应该等待，哪些可以立即启动，以及它们可以使用哪些资源。

<!--
Some of the most desired job queueing requirements include:
-->
一些最需要的作业队列要求包括：
<!--
- Quota and budgeting to control who can use what and up to what limit. This is not only needed in clusters with static resources like on-premises, 
  but it is also needed in cloud environments to control spend or usage of scarce resources.
-->
- 用配额和预算来控制谁可以使用什么以及达到什么限制。
  这不仅在具有静态资源（如本地）的集群中需要，而且在云环境中也需要控制稀缺资源的支出或用量。
<!--
- Fair sharing of resources between tenants. To maximize the usage of available resources, any unused quota assigned to inactive tenants should be 
  allowed to be shared fairly between active tenants.
-->
- 租户之间公平共享资源。
  为了最大限度地利用可用资源，应允许活动租户公平共享那些分配给非活动租户的未使用配额。
<!--
- Flexible placement of jobs across different resource types based on availability. This is important in cloud environments which have heterogeneous 
  resources such as different architectures (GPU or CPU models) and different provisioning modes (spot vs on-demand).
-->
- 根据可用性，在不同资源类型之间灵活放置作业。
  这在具有异构资源的云环境中很重要，例如不同的架构（GPU 或 CPU 模型）和不同的供应模式（即用与按需）。
<!--
- Support for autoscaled environments where resources can be provisioned on demand.
-->
- 支持可按需配置资源的自动扩缩容环境。

<!--
Plain Kubernetes doesn't address the above requirements. In normal circumstances, once a Job is created, the job-controller instantly creates the 
pods and kube-scheduler continuously attempts to assign the pods to nodes. At scale, this situation can work the control plane to death. There is 
also currently no good way to control at the job level which jobs should get which resources first, and no way to express order or fair sharing. The 
current ResourceQuota model is not a good fit for these needs because quotas are enforced on resource creation, and there is no queueing of requests. The 
intent of ResourceQuotas is to provide a builtin reliability mechanism with policies needed by admins to protect clusters from failing over.
-->
普通的 Kubernetes 不能满足上述要求。
在正常情况下，一旦创建了 Job，Job 控制器会立即创建 Pod，并且 kube-scheduler 会不断尝试将 Pod 分配给节点。
大规模使用时，这种情况可能会使控制平面死机。
目前也没有好的办法在 Job 层面控制哪些 Job 应该先获得哪些资源，也没有办法标明顺序或公平共享。
当前的 ResourceQuota 模型不太适合这些需求，因为配额是在资源创建时强制执行的，并且没有请求排队。
ResourceQuotas 的目的是提供一种内置的可靠性机制，其中包含管理员所需的策略，以防止集群发生故障转移。

<!--
In the Kubernetes ecosystem, there are several solutions for job scheduling. However, we found that these alternatives have one or more of the following problems:
-->
在 Kubernetes 生态系统中，Job 调度有多种解决方案。但是，我们发现这些替代方案存在以下一个或多个问题：
<!--
- They replace existing stable components of Kubernetes, like kube-scheduler or the job-controller. This is problematic not only from an operational point of view, but 
  also the duplication in the job APIs causes fragmentation of the ecosystem and reduces portability.
-->
- 它们取代了 Kubernetes 的现有稳定组件，例如 kube-scheduler 或 Job 控制器。
  这不仅从操作的角度看是有问题的，而且重复的 Job API 也会导致生态系统的碎片化并降低可移植性。
<!--
- They don't integrate with autoscaling, or 
-->
- 它们没有集成自动扩缩容，或者
<!--
- They lack support for resource flexibility. 
-->
- 它们缺乏对资源灵活性的支持。 

<!--
## How Kueue works {#overview}
-->
## Kueue 的工作原理 {#overview}
<!--
With Kueue we decided to take a different approach to job queueing on Kubernetes that is anchored around the following aspects: 
-->
借助 Kueue，我们决定采用不同的方法在 Kubernetes 上进行 Job 排队，该方法基于以下方面：
<!--
- Not duplicating existing functionalities already offered by established Kubernetes components for pod scheduling, autoscaling and job
  lifecycle management.
-->
- 不复制已建立的 Kubernetes 组件提供的用于 Pod 调度、自动扩缩容和 Job 生命周期管理的现有功能。
<!--
- Adding key features that are missing to existing components. For example, we invested in the Job API to cover more use cases like 
  [IndexedJob](/blog/2021/04/19/introducing-indexed-jobs) and [fixed long standing issues related to pod 
  tracking](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers). While this path takes longer to 
-->
- 将缺少的关键特性添加到现有组件中。例如，我们投资了 Job API 以涵盖更多用例，像 [IndexedJob](/blog/2021/04/19/introducing-indexed-jobs)，
  并[修复了与 Pod 跟踪相关的长期存在的问题](/zh-cn/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers)。
  虽然离特性落地还有很长一段路，但我们相信这是可持续的长期解决方案。
<!--
- Ensuring compatibility with cloud environments where compute resources are elastic and heterogeneous.
-->
- 确保与具有弹性和异构性的计算资源云环境兼容。

<!--
For this approach to be feasible, Kueue needs knobs to influence the behavior of those established components so it can effectively manage 
when and where to start a job. We added those knobs to the Job API in the form of two features:
-->
为了使这种方法可行，Kueue 需要旋钮来影响那些已建立组件的行为，以便它可以有效地管理何时何地启动一个 Job。
我们以两个特性的方式将这些旋钮添加到 Job API：
<!--
- [Suspend field](/docs/concepts/workloads/controllers/job/#suspending-a-job), which allows Kueue to signal to the job-controller 
  when to start or stop a Job.
-->
- [Suspend 字段](/zh-cn/docs/concepts/workloads/controllers/job/#suspending-a-job)，
  它允许在 Job 启动或停止时，Kueue 向 Job 控制器发出信号。
<!--
- [Mutable scheduling directives](/docs/concepts/workloads/controllers/job/#mutable-scheduling-directives), which allows Kueue to 
  update a Job's `.spec.template.spec.nodeSelector` before starting the Job. This way, Kueue can control Pod placement while still
  delegating to kube-scheduler the actual pod-to-node scheduling.
-->
- [可变调度指令](/zh-cn/docs/concepts/workloads/controllers/job/#mutable-scheduling-directives)，
  允许在启动 Job 之前更新 Job 的 `.spec.template.spec.nodeSelector`。
  这样，Kueue 可以控制 Pod 放置，同时仍将 Pod 到节点的实际调度委托给 kube-scheduler。

<!--
Note that any custom job API can be managed by Kueue if that API offers the above two capabilities.
-->
请注意，任何自定义的 Job API 都可以由 Kueue 管理，只要该 API 提供上述两种能力。

<!--
### Resource model
-->
### 资源模型
<!--
Kueue defines new APIs to address the requirements mentioned at the beginning of this post. The three main APIs are:
-->
Kueue 定义了新的 API 来解决本文开头提到的需求。三个主要的 API 是：
<!--
- ResourceFlavor: a cluster-scoped API to define resource flavor available for consumption, like a GPU model. At its core, a ResourceFlavor is 
  a set of labels that mirrors the labels on the nodes that offer those resources.
-->
- ResourceFlavor：一个集群范围的 API，用于定义可供消费的资源模板，如 GPU 模型。
  ResourceFlavor 的核心是一组标签，这些标签反映了提供这些资源的节点上的标签。
<!--
- ClusterQueue: a cluster-scoped API to define resource pools by setting quotas for one or more ResourceFlavor.
-->
- ClusterQueue: 一种集群范围的 API，通过为一个或多个 ResourceFlavor 设置配额来定义资源池。
<!--
- LocalQueue: a namespaced API for grouping and managing single tenant jobs. In its simplest form, a LocalQueue is a pointer to the ClusterQueue 
  that the tenant (modeled as a namespace) can use to start their jobs.
-->
- LocalQueue: 用于分组和管理单租户 Jobs 的命名空间 API。
  在最简单的形式中，LocalQueue 是指向集群队列的指针，租户（建模为命名空间）可以使用它来启动他们的 Jobs。

<!--
For more details, take a look at the [API concepts documentation](https://sigs.k8s.io/kueue/docs/concepts). While the three APIs may look overwhelming, 
most of Kueue’s operations are centered around ClusterQueue; the ResourceFlavor and LocalQueue APIs are mainly organizational wrappers.
-->
有关更多详细信息，请查看 [API 概念文档](https://sigs.k8s.io/kueue/docs/concepts)。
虽然这三个 API 看起来无法抗拒，但 Kueue 的大部分操作都以 ClusterQueue 为中心；
ResourceFlavor 和 LocalQueue API 主要是组织包装器。

<!--
### Example use case
-->
### 用例样例
<!--
Imagine the following setup for running batch workloads on a Kubernetes cluster on the cloud: 
-->
想象一下在云上的 Kubernetes 集群上运行批处理工作负载的以下设置：
<!--
- You have [cluster-autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) installed in the cluster to automatically
  adjust the size of your cluster.
-->
- 你在集群中安装了 [cluster-autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) 以自动调整集群的大小。
<!--
- There are two types of autoscaled node groups that differ on their provisioning policies: spot and on-demand. The nodes of each group are 
  differentiated by the label `instance-type=spot` or `instance-type=ondemand`.
  Moreover, since not all Jobs can tolerate running on spot nodes, the nodes are tainted with `spot=true:NoSchedule`.
-->
- 有两种类型的自动缩放节点组，它们的供应策略不同：即用和按需。
  分别对应标签：`instance-type=spot` 或者 `instance-type=ondemand`。
  此外，并非所有作业都可以容忍在即用节点上运行，节点可以用 `spot=true:NoSchedule` 污染。
<!--
- To strike a balance between cost and resource availability, imagine you want Jobs to use up to 1000 cores of on-demand nodes, then use up to
  2000 cores of spot nodes.
-->
- 为了在成本和资源可用性之间取得平衡，假设你希望 Jobs 使用最多 1000 个核心按需节点，最多 2000 个核心即用节点。

<!--
As an admin for the batch system, you define two ResourceFlavors that represent the two types of nodes:
-->
作为批处理系统的管理员，你定义了两个 ResourceFlavor，它们代表两种类型的节点：

```yaml
---
apiVersion: kueue.x-k8s.io/v1alpha2
kind: ResourceFlavor
metadata:
  name: ondemand
  labels:
    instance-type: ondemand 
---
apiVersion: kueue.x-k8s.io/v1alpha2
kind: ResourceFlavor
metadata:
  name: spot
  labels:
    instance-type: spot
taints:
- effect: NoSchedule
  key: spot
  value: "true"
```
<!--
Then you define the quotas by creating a ClusterQueue as follows:
-->
然后通过创建 ClusterQueue 来定义配额，如下所示：
```yaml
apiVersion: kueue.x-k8s.io/v1alpha2
kind: ClusterQueue
metadata:
  name: research-pool
spec:
  namespaceSelector: {}
  resources:
  - name: "cpu"
    flavors:
    - name: ondemand
      quota:
        min: 1000
    - name: spot
      quota:
        min: 2000
```

<!--
Note that the order of flavors in the ClusterQueue resources matters: Kueue will attempt to fit jobs in the available quotas according to 
the order unless the job has an explicit affinity to specific flavors.
-->
注意 ClusterQueue 资源中的模板顺序很重要：Kueue 将尝试根据该顺序为 Job 分配可用配额，除非这些 Job 与特定模板有明确的关联。

<!--
For each namespace, you define a LocalQueue that points to the ClusterQueue above:
-->
对于每个命名空间，定义一个指向上述 ClusterQueue 的 LocalQueue：

```yaml
apiVersion: kueue.x-k8s.io/v1alpha2
kind: LocalQueue
metadata:
  name: training
  namespace: team-ml
spec:
  clusterQueue: research-pool
```

<!--
Admins create the above setup once. Batch users are able to find the queues they are allowed to
submit to by listing the LocalQueues in their namespace(s). The command is similar to the following: `kubectl get -n my-namespace localqueues`
-->
管理员创建一次上述配置。批处理用户可以通过在他们的命名空间中列出 LocalQueues 来找到他们被允许提交的队列。
该命令类似于：`kubectl get -n my-namespace localqueues`

<!--
To submit work, create a Job and set the `kueue.x-k8s.io/queue-name` annotation as follows:
-->
要提交作业，需要创建一个 Job 并设置 `kueue.x-k8s.io/queue-name` 注解，如下所示：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  generateName: sample-job-
  annotations:
    kueue.x-k8s.io/queue-name: training
spec:
  parallelism: 3
  completions: 3
  template:
    spec:
      tolerations:
      - key: spot
        operator: "Exists"
        effect: "NoSchedule"
      containers:
      - name: example-batch-workload
        image: registry.example/batch/calculate-pi:3.14
        args: ["30s"]
        resources:
          requests:
            cpu: 1
      restartPolicy: Never
```

<!--
Kueue intervenes to suspend the Job as soon as it is created. Once the Job is at the head of the ClusterQueue, Kueue evaluates if it can start
by checking if the resources requested by the job fit the available quota. 
-->
Kueue 在创建 Job 后立即进行干预以暂停 Job。
一旦 Job 位于 ClusterQueue 的头部，Kueue 就会通过检查 Job 请求的资源是否符合可用配额来评估它是否可以启动。 

<!--
In the above example, the Job tolerates spot resources. If there are previously admitted Jobs consuming all existing on-demand quota but
not all of spot’s, Kueue admits the Job using the spot quota. Kueue does this by issuing a single update to the Job object that: 
-->
在上面的例子中，Job 容忍了 Spot 资源。如果之前承认的 Job 消耗了所有现有的按需配额，
但不是所有 Spot 配额，则 Kueue 承认使用 Spot 配额的 Job。Kueue 通过向 Job 对象发出单个更新来做到这一点：
<!--
- Changes the `.spec.suspend` flag to false 
- Adds the term `instance-type: spot` to the job's `.spec.template.spec.nodeSelector` so that when the pods are created by the job controller, those pods can only schedule 
  onto spot nodes. 
-->
- 更改 `.spec.suspend` 标志位为 false 
- 将 `instance-type: spot` 添加到 Job 的 `.spec.template.spec.nodeSelector` 中，
以便在 Job 控制器创建 Pod 时，这些 Pod 只能调度到 Spot 节点上。

<!--
Finally, if there are available empty nodes with matching node selector terms, then kube-scheduler will directly schedule the pods. If not, then
kube-scheduler will initially mark the pods as unschedulable, which will trigger the cluster-autoscaler to provision new nodes.
-->
最后，如果有可用的空节点与节点选择器条件匹配，那么 kube-scheduler 将直接调度 Pod。
如果不是，那么 kube-scheduler 将 pod 初始化标记为不可调度，这将触发 cluster-autoscaler 配置新节点。

<!--
## Future work and getting involved
-->
## 未来工作以及参与方式
<!--
The example above offers a glimpse of some of Kueue's features including support for quota, resource flexibility, and integration with cluster 
autoscaler. Kueue also supports fair-sharing, job priorities, and different queueing strategies. Take a look at the
[Kueue documentation](https://github.com/kubernetes-sigs/kueue/tree/main/docs) to learn more about those features and how to use Kueue. 
-->
上面的示例提供了 Kueue 的一些功能简介，包括支持配额、资源灵活性以及与集群自动缩放器的集成。
Kueue 还支持公平共享、Job 优先级和不同的排队策略。
查看 [Kueue 文档](https://github.com/kubernetes-sigs/kueue/tree/main/docs)以了解这些特性以及如何使用 Kueue 的更多信息。

<!--
We have a number of features that we plan to add to Kueue, such as hierarchical quota, budgets, and support for dynamically sized jobs. In 
the more immediate future, we are focused on adding support for job preemption.
-->
我们计划将许多特性添加到 Kueue 中，例如分层配额、预算和对动态大小 Job 的支持。
在不久的将来，我们将专注于增加对 Job 抢占的支持。

<!--
The latest [Kueue release](https://github.com/kubernetes-sigs/kueue/releases) is available on Github;
try it out if you run batch workloads on Kubernetes (requires v1.22 or newer).
We are in the early stages of this project and we are seeking feedback of all levels, major or minor, so please don’t hesitate to reach out. We’re 
also open to additional contributors, whether it is to fix or report bugs, or help add new features or write documentation. You can get in touch with
us via our [repo](http://sigs.k8s.io/kueue), [mailing list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on 
[Slack](https://kubernetes.slack.com/messages/wg-batch).
-->
最新的 [Kueue 版本](https://github.com/kubernetes-sigs/kueue/releases)在 Github 上可用；
如果你在 Kubernetes 上运行批处理工作负载（需要 v1.22 或更高版本），可以尝试一下。
这个项目还处于早期阶段，我们正在搜集大大小小各个方面的反馈，请不要犹豫，快来联系我们吧！
无论是修复或报告错误，还是帮助添加新特性或编写文档，我们欢迎一切形式的贡献者。
你可以通过我们的[仓库](http://sigs.k8s.io/kueue)、[邮件列表](https://groups.google.com/a/kubernetes.io/g/wg-batch)或者 
[Slack](https://kubernetes.slack.com/messages/wg-batch) 与我们联系。

<!--
Last but not least, thanks to all [our contributors](https://github.com/kubernetes-sigs/kueue/graphs/contributors) who made this project possible!
-->
最后是很重要的一点，感谢所有促使这个项目成为可能的[贡献者们](https://github.com/kubernetes-sigs/kueue/graphs/contributors)！
