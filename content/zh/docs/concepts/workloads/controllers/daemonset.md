---
title: DaemonSet
content_type: concept
weight: 50
---

<!--
---
reviewers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
title: DaemonSet
content_type: concept
weight: 50
---
--->

<!-- overview -->

<!--
A _DaemonSet_ ensures that all (or some) Nodes run a copy of a Pod.  As nodes are added to the
cluster, Pods are added to them.  As nodes are removed from the cluster, those Pods are garbage
collected.  Deleting a DaemonSet will clean up the Pods it created.
--->
_DaemonSet_ 确保全部（或者某些）节点上运行一个 Pod 的副本。当有节点加入集群时，
也会为他们新增一个 Pod 。当有节点从集群移除时，这些 Pod 也会被回收。删除 DaemonSet 将会删除它创建的所有 Pod。

<!--
Some typical uses of a DaemonSet are:

- running a cluster storage daemon, such as `glusterd`, `ceph`, on each node.
- running a logs collection daemon on every node, such as `fluentd` or `logstash`.
- running a node monitoring daemon on every node, such as [Prometheus Node Exporter](https://github.com/prometheus/node_exporter), [Flowmill](https://github.com/Flowmill/flowmill-k8s/), [Sysdig Agent](https://docs.sysdig.com), `collectd`, [Dynatrace OneAgent](https://www.dynatrace.com/technologies/kubernetes-monitoring/), [AppDynamics Agent](https://docs.appdynamics.com/display/CLOUD/Container+Visibility+with+Kubernetes), [Datadog agent](https://docs.datadoghq.com/agent/kubernetes/daemonset_setup/), [New Relic agent](https://docs.newrelic.com/docs/integrations/kubernetes-integration/installation/kubernetes-installation-configuration), Ganglia `gmond` or [Instana Agent](https://www.instana.com/supported-integrations/kubernetes-monitoring/).
-->
DaemonSet 的一些典型用法：

- 在每个节点上运行集群存储 DaemonSet，例如 `glusterd`、`ceph`。
- 在每个节点上运行日志收集 DaemonSet，例如 `fluentd`、`logstash`。
- 在每个节点上运行监控 DaemonSet，例如 [Prometheus Node Exporter](https://github.com/prometheus/node_exporter)、[Flowmill](https://github.com/Flowmill/flowmill-k8s/)、[Sysdig 代理](https://docs.sysdig.com)、`collectd`、[Dynatrace OneAgent](https://www.dynatrace.com/technologies/kubernetes-monitoring/)、[AppDynamics 代理](https://docs.appdynamics.com/display/CLOUD/Container+Visibility+with+Kubernetes)、[Datadog 代理](https://docs.datadoghq.com/agent/kubernetes/daemonset_setup/)、[New Relic 代理](https://docs.newrelic.com/docs/integrations/kubernetes-integration/installation/kubernetes-installation-configuration)、Ganglia `gmond` 或者 [Instana 代理](https://www.instana.com/supported-integrations/kubernetes-monitoring/)。

<!--
In a simple case, one DaemonSet, covering all nodes, would be used for each type of daemon.
A more complex setup might use multiple DaemonSets for a single type of daemon, but with
different flags and/or different memory and cpu requests for different hardware types.
-->
一个简单的用法是在所有的节点上都启动一个 DaemonSet，将被作为每种类型的 daemon 使用。

一个稍微复杂的用法是单独对每种 daemon 类型使用多个 DaemonSet，但具有不同的标志，
并且对不同硬件类型具有不同的内存、CPU 要求。




<!-- body -->

<!--
## Writing a DaemonSet Spec

### Create a DaemonSet
-->
## 编写 DaemonSet Spec 

### 创建 DaemonSet

<!--
You can describe a DaemonSet in a YAML file. For example, the `daemonset.yaml` file below describes a DaemonSet that runs the fluentd-elasticsearch Docker image:
-->
您可以在 YAML 文件中描述 DaemonSet。例如，下面的 daemonset.yaml 文件描述了一个运行 fluentd-elasticsearch Docker 镜像的 DaemonSet：

{{< codenew file="controllers/daemonset.yaml" >}}

<!--
* Create a DaemonSet based on the YAML file:
-->
* 基于 YAML 文件创建 DaemonSet:
```
kubectl apply -f https://k8s.io/examples/controllers/daemonset.yaml
```

<!--
### Required Fields

As with all other Kubernetes config, a DaemonSet needs `apiVersion`, `kind`, and `metadata` fields.  For
general information about working with config files, see [deploying applications](/docs/user-guide/deploying-applications/),
[configuring containers](/docs/tasks/), and [object management using kubectl](/docs/concepts/overview/working-with-objects/object-management/) documents.

A DaemonSet also needs a [`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) section.
-->
### 必需字段
和其它所有 Kubernetes 配置一样，DaemonSet 需要 `apiVersion`、`kind` 和 `metadata` 字段。有关配置文件的基本信息，详见文档 [部署应用](/docs/user-guide/deploying-applications/)、[配置容器](/docs/tasks/) 和 [使用 kubectl 进行对象管理](/docs/concepts/overview/object-management-kubectl/overview/)。

DaemonSet 也需要一个 [`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) 配置段。

<!--
### Pod Template
-->
### Pod 模板

<!--
The `.spec.template` is one of the required fields in `.spec`.

The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a [Pod](/docs/concepts/workloads/pods/pod/), except it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields for a Pod, a Pod template in a DaemonSet has to specify appropriate
labels (see [pod selector](#pod-selector)).

A Pod Template in a DaemonSet must have a [`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
 equal to `Always`, or be unspecified, which defaults to `Always`.
-->
`.spec` 中唯一必需的字段是 `.spec.template`。

`.spec.template` 是一个 [Pod 模板](/docs/concepts/workloads/pods/pod-overview/#pod-templates)。除了它是嵌套的，而且不具有 `apiVersion` 或 `kind` 字段，它与 [Pod](/docs/concepts/workloads/pods/pod/) 具有相同的 schema。

除了 Pod 必需字段外，在 DaemonSet 中的 Pod 模板必须指定合理的标签（查看 [Pod Selector](#pod-selector)）。

在 DaemonSet 中的 Pod 模板必须具有一个值为 `Always` 的 [`RestartPolicy`](/docs/user-guide/pod-states)，或者未指定它的值，默认是 `Always`。

<!--
### Pod Selector
-->
### Pod Selector {#pod-selector}

<!--
The `.spec.selector` field is a pod selector.  It works the same as the `.spec.selector` of
a [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/).

As of Kubernetes 1.8, you must specify a pod selector that matches the labels of the
`.spec.template`. The pod selector will no longer be defaulted when left empty. Selector
defaulting was not compatible with `kubectl apply`. Also, once a DaemonSet is created,
its `.spec.selector` can not be mutated. Mutating the pod selector can lead to the
unintentional orphaning of Pods, and it was found to be confusing to users.
-->
`.spec.selector` 字段表示 Pod Selector，它与 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) 的 `.spec.selector` 的作用是相同的。

从 Kubernetes 1.8 开始，您必须指定与 `.spec.template` 的标签匹配的 pod selector。当不配置时，pod selector 将不再有默认值。selector 默认与 `kubectl apply` 不兼容。 此外，一旦创建了 DaemonSet，它的 `.spec.selector` 就不能修改。修改 pod selector 可能导致 Pod 意外悬浮，并且这对用户来说是困惑的。

<!--
The `.spec.selector` is an object consisting of two fields:
-->
`spec.selector` 表示一个对象，它由如下两个字段组成：

<!--
* `matchLabels` - works the same as the `.spec.selector` of a [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).
* `matchExpressions` - allows to build more sophisticated selectors by specifying key,
  list of values and an operator that relates the key and values.
-->
* `matchLabels` - 与 [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/) 的 `.spec.selector` 的作用相同。
* `matchExpressions` - 允许构建更加复杂的 Selector，可以通过指定 key、value 列表
，以及与 key 和 value 列表相关的操作符。

<!--
When the two are specified the result is ANDed.
-->
当上述两个字段都指定时，结果表示的是 AND 关系。

<!--
If the `.spec.selector` is specified, it must match the `.spec.template.metadata.labels`. Config with these not matching will be rejected by the API.
-->
如果指定了 `.spec.selector`，必须与 `.spec.template.metadata.labels` 相匹配。如果与它们配置的不匹配，则会被 API 拒绝。

<!--
Also you should not normally create any Pods whose labels match this selector, either directly, via
another DaemonSet, or via another workload resource such as ReplicaSet.  Otherwise, the DaemonSet
{{< glossary_tooltip term_id="controller" >}} will think that those Pods were created by it.
Kubernetes will not stop you from doing this. One case where you might want to do this is manually
create a Pod with a different value on a node for testing.
-->
另外，通常不应直接通过另一个 DaemonSet 或另一个工作负载资源（例如 ReplicaSet）来创建其标签与该选择器匹配的任何 Pod。否则，DaemonSet {{< glossary_tooltip term_text="控制器" term_id="controller" >}}会认为这些 Pod 是由它创建的。Kubernetes 不会阻止你这样做。您可能要执行此操作的一种情况是，手动在节点上创建具有不同值的 Pod 进行测试。

<!--
### Running Pods on Only Some Nodes
-->
### 仅在某些节点上运行 Pod

<!--
If you specify a `.spec.template.spec.nodeSelector`, then the DaemonSet controller will
create Pods on nodes which match that [node
selector](/docs/concepts/configuration/assign-pod-node/). Likewise if you specify a `.spec.template.spec.affinity`,
then DaemonSet controller will create Pods on nodes which match that [node affinity](/docs/concepts/configuration/assign-pod-node/).
If you do not specify either, then the DaemonSet controller will create Pods on all nodes.
-->
如果指定了 `.spec.template.spec.nodeSelector`，DaemonSet Controller 将在能够与 [Node Selector](/docs/concepts/configuration/assign-pod-node/) 匹配的节点上创建 Pod。类似这种情况，可以指定 `.spec.template.spec.affinity`，然后 DaemonSet Controller 将在能够与 [node Affinity](/docs/concepts/configuration/assign-pod-node/) 匹配的节点上创建 Pod。
如果根本就没有指定，则 DaemonSet Controller 将在所有节点上创建 Pod。

<!--
## How Daemon Pods are Scheduled

### Scheduled by default scheduler
-->
## 如何调度 Daemon Pods

### 通过默认 scheduler 调度

{{< feature-state state="stable" for-kubernetes-version="1.17" >}}

<!--
A DaemonSet ensures that all eligible nodes run a copy of a Pod. Normally, the
node that a Pod runs on is selected by the Kubernetes scheduler. However,
DaemonSet pods are created and scheduled by the DaemonSet controller instead.
That introduces the following issues:

 * Inconsistent Pod behavior: Normal Pods waiting to be scheduled are created
   and in `Pending` state, but DaemonSet pods are not created in `Pending`
   state. This is confusing to the user.
 * [Pod preemption](/docs/concepts/configuration/pod-priority-preemption/)
   is handled by default scheduler. When preemption is enabled, the DaemonSet controller
   will make scheduling decisions without considering pod priority and preemption.
-->
DaemonSet 确保所有符合条件的节点都运行该 Pod 的一个副本。通常，运行 Pod 的节点由 Kubernetes 调度器抉择。不过，DaemonSet pods 由 DaemonSet 控制器创建和调度。这将引入以下问题：

 * Pod 行为的不一致性：等待调度的正常 Pod 已被创建并处于 `Pending` 状态，但 DaemonSet pods 未在 `Pending` 状态下创建。 这使用户感到困惑。
 * [Pod preemption](/docs/concepts/configuration/pod-priority-preemption/)由默认 scheduler 处理。 启用抢占后，DaemonSet 控制器将在不考虑 pod 优先级和抢占的情况下制定调度决策。

<!--
`ScheduleDaemonSetPods` allows you to schedule DaemonSets using the default
scheduler instead of the DaemonSet controller, by adding the `NodeAffinity` term
to the DaemonSet pods, instead of the `.spec.nodeName` term. The default
scheduler is then used to bind the pod to the target host. If node affinity of
the DaemonSet pod already exists, it is replaced. The DaemonSet controller only
performs these operations when creating or modifying DaemonSet pods, and no
changes are made to the `spec.template` of the DaemonSet.
-->
`ScheduleDaemonSetPods` 允许您使用默认调度器而不是 DaemonSet 控制器来调度 DaemonSets，方法是将 `NodeAffinity` 添加到 DaemonSet pods，而不是 `.spec.nodeName`。 然后使用默认调度器将 pod 绑定到目标主机。 如果 DaemonSet pod 的亲和节点已存在，则替换它。 DaemonSet 控制器仅在创建或修改 DaemonSet pods 时执行这些操作，并且不对 DaemonSet 的 `spec.template` 进行任何更改。

```yaml
nodeAffinity:
  requiredDuringSchedulingIgnoredDuringExecution:
    nodeSelectorTerms:
    - matchFields:
      - key: metadata.name
        operator: In
        values:
        - target-host-name
```

<!--
In addition, `node.kubernetes.io/unschedulable:NoSchedule` toleration is added
automatically to DaemonSet Pods. The default scheduler ignores
`unschedulable` Nodes when scheduling DaemonSet Pods.
-->
此外，系统会自动添加 `node.kubernetes.io/unschedulable：NoSchedule` 容忍度到 DaemonSet Pods。 在调度 DaemonSet Pod 时，默认调度器会忽略 `unschedulable` 节点。

<!--
### Taints and Tolerations

Although Daemon Pods respect
[taints and tolerations](/docs/concepts/configuration/taint-and-toleration),
the following tolerations are added to DaemonSet Pods automatically according to
the related features.
-->
### 污点和容忍度

尽管 Daemon Pods 遵循[污点和容忍度](/docs/concepts/configuration/taint-and-toleration) 规则，根据相关特性，会自动将以下容忍度添加到 DaemonSet Pods 中。

| 容忍度关键词                         | 影响     | 版本 | 描述                                                  |
| ---------------------------------------- | ---------- | ------- | ------------------------------------------------------------ |
| `node.kubernetes.io/not-ready`           | NoExecute  | 1.13+    | DaemonSet pods will not be evicted when there are node problems such as a network partition. |
| `node.kubernetes.io/unreachable`         | NoExecute  | 1.13+    | DaemonSet pods will not be evicted when there are node problems such as a network partition. |
| `node.kubernetes.io/disk-pressure`       | NoSchedule | 1.8+    |                                                              |
| `node.kubernetes.io/memory-pressure`     | NoSchedule | 1.8+    |                                                              |
| `node.kubernetes.io/unschedulable`       | NoSchedule | 1.12+   | DaemonSet pods tolerate unschedulable attributes by default scheduler.                                                    |
| `node.kubernetes.io/network-unavailable` | NoSchedule | 1.12+   | DaemonSet pods, who uses host network, tolerate network-unavailable attributes by default scheduler.                      |



<!--
## Communicating with Daemon Pods
-->
## 与 Daemon Pods 通信

<!--
Some possible patterns for communicating with Pods in a DaemonSet are:

- **Push**: Pods in the DaemonSet are configured to send updates to another service, such
  as a stats database.  They do not have clients.
- **NodeIP and Known Port**: Pods in the DaemonSet can use a `hostPort`, so that the pods are reachable via the node IPs.  Clients know the list of node IPs somehow, and know the port by convention.
- **DNS**: Create a [headless service](/docs/concepts/services-networking/service/#headless-services) with the same pod selector,
  and then discover DaemonSets using the `endpoints` resource or retrieve multiple A records from
  DNS.
- **Service**: Create a service with the same Pod selector, and use the service to reach a
  daemon on a random node. (No way to reach specific node.)
-->
与 DaemonSet 中的 Pod 进行通信的几种可能模式如下：

- **Push**：将 DaemonSet 中的 Pod 配置为将更新发送到另一个 Service，例如统计数据库。
- **NodeIP 和已知端口**：DaemonSet 中的 Pod 可以使用 `hostPort`，从而可以通过节点 IP 访问到 Pod。客户端能通过某种方法获取节点 IP 列表，并且基于此也可以获取到相应的端口。
- **DNS**：创建具有相同 Pod Selector 的 [Headless Service](/docs/concepts/services-networking/service/#headless-services)，然后通过使用 `endpoints` 资源或从 DNS 中检索到多个 A 记录来发现 DaemonSet。
- **Service**：创建具有相同 Pod Selector 的 Service，并使用该 Service 随机访问到某个节点上的 daemon（没有办法访问到特定节点）。

<!--
## Updating a DaemonSet
-->
## 更新 DaemonSet

<!--
If node labels are changed, the DaemonSet will promptly add Pods to newly matching nodes and delete
Pods from newly not-matching nodes.

You can modify the Pods that a DaemonSet creates.  However, Pods do not allow all
fields to be updated.  Also, the DaemonSet controller will use the original template the next
time a node (even with the same name) is created.
-->
如果修改了节点标签，DaemonSet 将立刻向新匹配上的节点添加 Pod，同时删除不能够匹配的节点上的 Pod。

您可以修改 DaemonSet 创建的 Pod。然而，不允许对 Pod 的所有字段进行更新。当下次
节点（即使具有相同的名称）被创建时，DaemonSet Controller 还会使用最初的模板。

<!--
You can delete a DaemonSet.  If you specify `--cascade=false` with `kubectl`, then the Pods
will be left on the nodes.  If you subsequently create a new DaemonSet with the same selector,
the new DaemonSet adopts the existing Pods. If any Pods need replacing the DaemonSet replaces
them according to its `updateStrategy`.

You can [perform a rolling update](/docs/tasks/manage-daemon/update-daemon-set/) on a DaemonSet.
-->
您可以删除一个 DaemonSet。如果使用 `kubectl` 并指定 `--cascade=false` 选项，则 Pod 将被保留在节点上。然后可以创建具有不同模板的新 DaemonSet。具有不同模板的新 DaemonSet 将能够通过标签匹配并识别所有已经存在的 Pod。
如果有任何 Pod 需要替换，则 DaemonSet 根据它的 `updateStrategy` 来替换。

<!--
## Alternatives to DaemonSet

### Init Scripts
-->
## DaemonSet 的可替代选择

### init 脚本

<!--
It is certainly possible to run daemon processes by directly starting them on a node (e.g. using
`init`, `upstartd`, or `systemd`).  This is perfectly fine.  However, there are several advantages to
running such processes via a DaemonSet:

- Ability to monitor and manage logs for daemons in the same way as applications.
- Same config language and tools (e.g. Pod templates, `kubectl`) for daemons and applications.
- Running daemons in containers with resource limits increases isolation between daemons from app
  containers.  However, this can also be accomplished by running the daemons in a container but not in a Pod
  (e.g. start directly via Docker).
-->
我们很可能希望直接在一个节点上启动 daemon 进程（例如，使用 `init`、`upstartd`、或 `systemd`）。这非常好，但基于 DaemonSet 来运行这些进程有如下一些好处：

- 像对待应用程序一样，具备为 daemon 提供监控和管理日志的能力。

- 为 daemon 和应用程序使用相同的配置语言和工具（如 Pod 模板、`kubectl`）。

- 在资源受限的容器中运行 daemon，能够增加 daemon 和应用容器的隔离性。然而，这也实现了在容器中运行 daemon，但却不能在 Pod 中运行（例如，直接基于 Docker 启动）。

<!--
### Bare Pods

It is possible to create Pods directly which specify a particular node to run on.  However,
a DaemonSet replaces Pods that are deleted or terminated for any reason, such as in the case of
node failure or disruptive node maintenance, such as a kernel upgrade. For this reason, you should
use a DaemonSet rather than creating individual Pods.
-->
### 裸 Pod

可能要直接创建 Pod，同时指定其运行在特定的节点上。然而，DaemonSet 替换了由于任何原因被删除或终止的 Pod，例如节点失败、例行节点维护、内核升级。由于这个原因，我们应该使用 DaemonSet 而不是单独创建 Pod。

<!--
### Static Pods

It is possible to create Pods by writing a file to a certain directory watched by Kubelet.  These
are called [static pods](/docs/concepts/cluster-administration/static-pod/).
Unlike DaemonSet, static Pods cannot be managed with kubectl
or other Kubernetes API clients.  Static Pods do not depend on the apiserver, making them useful
in cluster bootstrapping cases.  Also, static Pods may be deprecated in the future.
-->
### 静态 Pod

可能需要通过在一个指定目录下编写文件来创建 Pod，该目录受 Kubelet 所监视。这些 Pod 被称为 [静态 Pod](/docs/concepts/cluster-administration/static-pod/)。
不像 DaemonSet，静态 Pod 不受 kubectl 和其它 Kubernetes API 客户端管理。静态 Pod 不依赖于 apiserver，这使得它们在集群启动的情况下非常有用。而且，未来静态 Pod 可能会被废弃掉。

<!--
### Deployments

DaemonSets are similar to [Deployments](/docs/concepts/workloads/controllers/deployment/) in that
they both create Pods, and those Pods have processes which are not expected to terminate (e.g. web servers,
storage servers).

Use a Deployment for stateless services, like frontends, where scaling up and down the
number of replicas and rolling out updates are more important than controlling exactly which host
the Pod runs on.  Use a DaemonSet when it is important that a copy of a Pod always run on
all or certain hosts, and when it needs to start before other Pods.
-->
### Deployments

DaemonSet 与 [Deployments](/docs/concepts/workloads/controllers/deployment/) 非常类似，它们都能创建 Pod，这些 Pod 对应的进程都不希望被终止掉（例如，Web 服务器、存储服务器）。
为无状态的 Service 使用 Deployments，比如前端 Frontend 服务，实现对副本的数量进行扩缩容、平滑升级，比基于精确控制 Pod 运行在某个主机上要重要得多。
需要 Pod 副本总是运行在全部或特定主机上，并需要先于其他 Pod 启动，当这被认为非常重要时，应该使用 Daemon Controller。


