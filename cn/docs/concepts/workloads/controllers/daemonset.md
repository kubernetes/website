---
assignees:
- erictune
title: Daemon Sets
redirect_from:
- "/docs/admin/daemons/"
- "/docs/admin/daemons.html"
---

* TOC
{:toc}

<!--
## What is a DaemonSet?

A _DaemonSet_ ensures that all (or some) nodes run a copy of a pod.  As nodes are added to the
cluster, pods are added to them.  As nodes are removed from the cluster, those pods are garbage
collected.  Deleting a DaemonSet will clean up the pods it created.
-->

## 什么是 DaemonSet？

 _DaemonSet_ 确保全部（或者一些）Node 上运行一个 Pod 的副本。当有 Node 加入集群时，也会为他们新增一个 Pod 。当有 Node 从集群移除时，这些 Pod 也会被回收。删除 DaemonSet 将会删除它创建的所有 Pod。

 <!--
Some typical uses of a DaemonSet are:

- running a cluster storage daemon, such as `glusterd`, `ceph`, on each node.
- running a logs collection daemon on every node, such as `fluentd` or `logstash`.
- running a node monitoring daemon on every node, such as [Prometheus Node Exporter](
  https://github.com/prometheus/node_exporter), `collectd`, Datadog agent, New Relic agent, or Ganglia `gmond`.

In a simple case, one DaemonSet, covering all nodes, would be used for each type of daemon.
A more complex setup might use multiple DaemonSets for a single type of daemon, but with
different flags and/or different memory and cpu requests for different hardware types.
-->

使用 DaemonSet 的一些典型用法：

- 运行集群存储 daemon，例如在每个 Node 上运行 `glusterd`、`ceph`。
- 在每个 Node 上运行日志收集 daemon，例如`fluentd`、`logstash`。
- 在每个 Node 上运行监控 daemon，例如 [Prometheus Node Exporter](https://github.com/prometheus/node_exporter)、`collectd`、Datadog 代理、New Relic 代理，或 Ganglia `gmond`。

一个简单的用法是，在所有的 Node 上都存在一个 DaemonSet，将被作为每种类型的 daemon 使用。
一个稍微复杂的用法可能是，对单独的每种类型的 daemon 使用多个 DaemonSet，但具有不同的标志，和/或对不同硬件类型具有不同的内存、CPU要求。

<!--
## Writing a DaemonSet Spec

### Required Fields
-->

## 编写 DaemonSet Spec

### 必需字段

<!--
As with all other Kubernetes config, a DaemonSet needs `apiVersion`, `kind`, and `metadata` fields.  For
general information about working with config files, see [deploying applications](/docs/user-guide/deploying-applications/),
[configuring containers](/docs/user-guide/configuring-containers/), and [working with resources](/docs/concepts/tools/kubectl/object-management-overview/) documents.

A DaemonSet also needs a [`.spec`](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) section.
-->

和其它所有 Kubernetes 配置一样，DaemonSet 需要 `apiVersion`、`kind` 和 `metadata`字段。有关配置文件的通用信息，详见文档 [deploying applications](/docs/user-guide/deploying-applications/)、[配置容器](/docs/user-guide/configuring-containers/) 和 [资源管理](/docs/concepts/tools/kubectl/object-management-overview/) 。

DaemonSet 也需要一个 [`.spec`](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) 配置段。

<!--
### Pod Template

The `.spec.template` is the only required field of the `.spec`.
-->

### Pod 模板

`.spec` 唯一必需的字段是 `.spec.template`。

<!--
The `.spec.template` is a [pod template](/docs/user-guide/replication-controller/#pod-template).
It has exactly the same schema as a [pod](/docs/user-guide/pods), except
it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields for a pod, a pod template in a DaemonSet has to specify appropriate
labels (see [pod selector](#pod-selector)).

A pod template in a DaemonSet must have a [`RestartPolicy`](/docs/user-guide/pod-states)
 equal to `Always`, or be unspecified, which defaults to `Always`.
-->

`.spec.template` 是一个 [Pod 模板](/docs/user-guide/replication-controller/#pod-template)。
它与 [Pod](/docs/user-guide/pods) 具有相同的 schema，除了它是嵌套的，而且不具有 `apiVersion` 或 `kind` 字段。

Pod 除了必须字段外，在 DaemonSet 中的 Pod 模板必须指定合理的标签（查看 [pod selector](#pod-selector)）。

在 DaemonSet 中的 Pod 模板必需具有一个值为 `Always` 的 [`RestartPolicy`](/docs/user-guide/pod-states)，或者未指定它的值，默认是 `Always`。

<!--
### Pod Selector

The `.spec.selector` field is a pod selector.  It works the same as the `.spec.selector` of
a [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) or other new resources.

The `spec.selector` is an object consisting of two fields:

* `matchLabels` - works the same as the `.spec.selector` of a [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)
* `matchExpressions` - allows to build more sophisticated selectors by specifying key,
  list of values and an operator that relates the key and values.
-->

### Pod Selector

`.spec.selector` 字段表示 Pod Selector，它与 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) 或其它资源的 `.sper.selector` 的原理是相同的。

`spec.selector` 表示一个对象，它由如下两个字段组成：

* `matchLabels` - 与 [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/) 的 `.spec.selector` 的原理相同。
* `matchExpressions` - 允许构建更加复杂的 Selector，可以通过指定 key、value 列表，以及与 key 和 value 列表的相关的操作符。

<!--
When the two are specified the result is ANDed.

If the `.spec.selector` is specified, it must match the `.spec.template.metadata.labels`.  If not
specified, they are defaulted to be equal.  Config with these not matching will be rejected by the API.

Also you should not normally create any pods whose labels match this selector, either directly, via
another DaemonSet, or via other controller such as ReplicationController.  Otherwise, the DaemonSet
controller will think that those pods were created by it.  Kubernetes will not stop you from doing
this.  One case where you might want to do this is manually create a pod with a different value on
a node for testing.
-->

当上述两个字段都指定时，结果表示的是 AND 关系。

如果指定了 `.spec.selector`，必须与 `.spec.template.metadata.labels` 相匹配。如果没有指定，它们默认是等价的。如果与它们配置的不匹配，则会被 API 拒绝。

如果 Pod 的 label 与 selector 匹配，或者直接基于其它的 DaemonSet、或者 Controller（例如 ReplicationController），也不可以创建任何 Pod。
否则 DaemonSet Controller 将认为那些 Pod 是它创建的。Kubernetes 不会阻止这样做。一个场景是，可能希望在一个具有不同值的、用来测试用的 Node 上手动创建 Pod。

<!--
### Running Pods on Only Some Nodes

If you specify a `.spec.template.spec.nodeSelector`, then the DaemonSet controller will
create pods on nodes which match that [node
selector](/docs/concepts/configuration/assign-pod-node/). Likewise if you specify a `.spec.template.spec.affinity` 
then DaemonSet controller will create pods on nodes which match that [node affinity](/docs/concepts/configuration/assign-pod-node/).
If you do not specify either, then the DaemonSet controller will create pods on all nodes.
-->

### 仅在相同的 Node 上运行 Pod

如果指定了 `.spec.template.spec.nodeSelector`，DaemonSet Controller 将在能够匹配上 [Node Selector](/docs/concepts/configuration/assign-pod-node/) 的 Node 上创建 Pod。
类似这种情况，可以指定 `.spec.template.spec.affinity`，然后 DaemonSet Controller 将在能够匹配上 [Node Affinity](/docs/concepts/configuration/assign-pod-node/) 的 Node 上创建 Pod。
如果根本就没有指定，则 DaemonSet Controller 将在所有 Node 上创建 Pod。

<!--
## How Daemon Pods are Scheduled

Normally, the machine that a pod runs on is selected by the Kubernetes scheduler.  However, pods
created by the Daemon controller have the machine already selected (`.spec.nodeName` is specified
when the pod is created, so it is ignored by the scheduler).  Therefore:

 - the [`unschedulable`](/docs/admin/node/#manual-node-administration) field of a node is not respected
   by the DaemonSet controller.
 - DaemonSet controller can make pods even when the scheduler has not been started, which can help cluster
   bootstrap.
-->

## 如果调度 Daemon Pod

正常情况下，Pod 运行在哪个机器上是由 Kubernetes 调度器进行选择的。然而，由 Daemon Controller 创建的 Pod 已经确定了在哪个机器上（Pod 创建时指定了 `.spec.nodeName`），因此：

- DaemonSet Controller 并不关心一个 Node 的 [`unschedulable`](/docs/admin/node/#manual-node-administration) 字段。
- DaemonSet Controller 可以创建 Pod，即使调度器还没有被启动，这对集群启动是非常有帮助的。

<!--
Daemon pods do respect [taints and tolerations](/docs/concepts/configuration/assign-pod-node/#taints-and-tolerations-beta-feature), but they are
created with `NoExecute` tolerations for the `node.alpha.kubernetes.io/notReady` and `node.alpha.kubernetes.io/unreachable`
taints with no `tolerationSeconds`. This ensures that when the `TaintBasedEvictions` alpha feature is enabled,
they will not be evicted when there are node problems such as a network partition. (When the
`TaintBasedEvictions` feature is not enabled, they are also not evicted in these scenarios, but
due to hard-coded behavior of the NodeController rather than due to tolerations).
-->

Daemon Pod 关心 [Taint 和 Toleration](/docs/concepts/configuration/assign-pod-node/#taints-and-tolerations-beta-feature)，它们会为没有指定 `tolerationSeconds` 的 `node.alpha.kubernetes.io/notReady` 和 `node.alpha.kubernetes.io/unreachable` 的 Taint，而创建具有 `NoExecute` 的 Toleration。这确保了当 alpha 特性的 `TaintBasedEvictions` 被启用，当 Node 出现故障，比如网络分区，这时它们将不会被清除掉（当 `TaintBasedEvictions` 特性没有启用，在这些场景下也不会被清除，但会因为 NodeController 的硬编码行为而被清除，Toleration  是不会的）。

<!--
## Communicating with Daemon Pods

Some possible patterns for communicating with pods in a DaemonSet are:

- **Push**: Pods in the DaemonSet are configured to send updates to another service, such
  as a stats database.  They do not have clients.
- **NodeIP and Known Port**: Pods in the DaemonSet can use a `hostPort`, so that the pods are reachable via the node IPs.  Clients know the list of nodes ips somehow, and know the port by convention.
- **DNS**: Create a [headless service](/docs/user-guide/services/#headless-services) with the same pod selector,
  and then discover DaemonSets using the `endpoints` resource or retrieve multiple A records from
  DNS.
- **Service**: Create a service with the same pod selector, and use the service to reach a
  daemon on a random node. (No way to reach specific node.)
-->

## 与 Daemon Pod 通信

与 DaemonSet 中的 Pod 进行通信，几种可能的模式如下：

- **Push**：配置 DaemonSet 中的 Pod 向其它 Service 发送更新，例如统计数据库。它们没有客户端。
- **NodeIP 和已知端口**：DaemonSet 中的 Pod 可以使用 `hostPort`，从而可以通过 Node IP 访问到 Pod。客户端能通过某种方法知道 Node IP 列表，并且基于此也可以知道端口。
- **DNS**：创建具有相同 Pod Selector 的 [Headless Service](/docs/user-guide/services/#headless-services)，然后通过使用 `endpoints` 资源或从 DNS 检索到多个 A 记录来发现 DaemonSet。
- **Service**：创建具有相同 Pod Selector 的 Service，并使用该 Service 访问到某个随机 Node 上的 daemon。（没有办法访问到特定 Node）

<!--
## Updating a DaemonSet

If node labels are changed, the DaemonSet will promptly add pods to newly matching nodes and delete
pods from newly not-matching nodes.

You can modify the pods that a DaemonSet creates.  However, pods do not allow all
fields to be updated.  Also, the DaemonSet controller will use the original template the next
time a node (even with the same name) is created.
-->

## 更新 DaemonSet

如果修改了 Node Label，DaemonSet 将立刻向新匹配上的 Node 添加 Pod，同时删除新近无法匹配上的 Node 上的 Pod。

可以修改 DaemonSet 创建的 Pod。然而，不允许对 Pod 的所有字段进行更新。当下次 Node（即使具有相同的名称）被创建时，DaemonSet Controller 还会使用最初的模板。

<!--
You can delete a DaemonSet.  If you specify `--cascade=false` with `kubectl`, then the pods
will be left on the nodes.  You can then create a new DaemonSet with a different template.
the new DaemonSet with the different template will recognize all the existing pods as having
matching labels.  It will not modify or delete them despite a mismatch in the pod template.
You will need to force new pod creation by deleting the pod or deleting the node.

In Kubernetes version 1.6 and later, you can [perform a rolling update](/docs/tasks/manage-daemon/update-daemon-set/) on a DaemonSet.

Future releases of Kubernetes will support controlled updating of nodes.
-->

可以删除一个 DaemonSet。如果使用 `kubectl` 并指定 `--cascade=false` 选项，则 Pod 将被保留在 Node 上。然后可以创建具有不同模板的新 DaemonSet。具有不同模板的新 DaemonSet 将鞥能够通过 Label 匹配识别所有已经存在的 Pod。它不会修改或删除它们，即使是错误匹配了 Pod 模板。通过删除 Pod 或者 删除 Node，可以强制创建新的 Pod。

在 Kubernetes 1.6 或以后版本，可以在 DaemonSet 上 [执行滚动升级](/docs/tasks/manage-daemon/update-daemon-set/)。

未来的 Kubernetes 版本将支持 Node 的可控更新。

<!--
## Alternatives to DaemonSet

### Init Scripts

It is certainly possible to run daemon processes by directly starting them on a node (e.g. using
`init`, `upstartd`, or `systemd`).  This is perfectly fine.  However, there are several advantages to
running such processes via a DaemonSet:
-->

## DaemonSet 的可替代选择

### init 脚本

很可能通过直接在一个 Node 上启动 daemon 进程（例如，使用 `init`、`upstartd`、或 `systemd`）。这非常好，然而基于 DaemonSet 来运行这些进程有如下一些好处：

<!--
- Ability to monitor and manage logs for daemons in the same way as applications.
- Same config language and tools (e.g. pod templates, `kubectl`) for daemons and applications.
- Future versions of Kubernetes will likely support integration between DaemonSet-created
  pods and node upgrade workflows.
- Running daemons in containers with resource limits increases isolation between daemons from app
  containers.  However, this can also be accomplished by running the daemons in a container but not in a pod
  (e.g. start directly via Docker).
-->

- 像对待应用程序一样，具备为 daemon 提供监控和管理日志的能力。
- 为 daemon 和应用程序使用相同的配置语言和工具（如 Pod 模板、`kubectl`）。
- Kubernetes 未来版本可能会支持对 DaemonSet 创建 Pod 与 Node升级工作流进行集成。
- 在资源受限的容器中运行 daemon，能够增加 daemon 和应用容器的隔离性。然而这也实现了在容器中运行 daemon，但却不能在 Pod 中运行（例如，直接基于 Docker 启动）。

<!--
### Bare Pods

It is possible to create pods directly which specify a particular node to run on.  However,
a DaemonSet replaces pods that are deleted or terminated for any reason, such as in the case of
node failure or disruptive node maintenance, such as a kernel upgrade. For this reason, you should
use a DaemonSet rather than creating individual pods.
-->

### 裸 Pod

可能要直接创建 Pod，同时指定其运行在特定的 Node 上。
然而，DaemonSet 替换了由于任何原因被删除或终止的 Pod，例如 Node 失败、例行节点维护，比如内和升级。由于这个原因，我们应该使用 DaemonSet 而不是单独创建 Pod。

<!--
### Static Pods

It is possible to create pods by writing a file to a certain directory watched by Kubelet.  These
are called [static pods](/docs/concepts/cluster-administration/static-pod/).
Unlike DaemonSet, static pods cannot be managed with kubectl
or other Kubernetes API clients.  Static pods do not depend on the apiserver, making them useful
in cluster bootstrapping cases.  Also, static pods may be deprecated in the future.
-->

### 静态 Pod

很可能，通过在一个指定目录下编写文件来创建 Pod，该目录受 Kubelet 所监视。这些 Pod 被称为 [静态 Pod](/docs/concepts/cluster-administration/static-pod/)。
不像 DaemonSet，静态 Pod 不受 kubectl 和 其它 Kubernetes API 客户端管理。静态 Pod 不依赖于 apiserver，这使得它们在集群启动的情况下非常有用。
而且，未来静态 Pod 可能会被废弃掉。

<!--
### Replication Controller

DaemonSet are similar to [Replication Controllers](/docs/user-guide/replication-controller) in that
they both create pods, and those pods have processes which are not expected to terminate (e.g. web servers,
storage servers).

Use a replication controller for stateless services, like frontends, where scaling up and down the
number of replicas and rolling out updates are more important than controlling exactly which host
the pod runs on.  Use a Daemon Controller when it is important that a copy of a pod always run on
all or certain hosts, and when it needs to start before other pods.
-->

### Replication Controller

DaemonSet 与 [Replication Controller](/docs/user-guide/replication-controller) 非常类似，它们都能创建 Pod，这些 Pod 都具有不期望被终止的进程（例如，Web 服务器、存储服务器）。
为无状态的 Service 使用 Replication Controller，像 frontend，实现对副本的数量进行扩缩容、平滑升级，比之于精确控制 Pod 运行在某个主机上要重要得多。需要 Pod 副本总是运行在全部或特定主机上，并需要先于其他 Pod 启动，当这被认为非常重要时，应该使用 Daemon Controller。

