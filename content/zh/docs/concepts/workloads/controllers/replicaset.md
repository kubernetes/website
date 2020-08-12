---
title: ReplicaSet
content_type: concept
weight: 10
---

<!-- overview -->

<!--
A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. As such, it is often
used to guarantee the availability of a specified number of identical Pods.
-->

ReplicaSet 的目的是维护一组在任何时候都处于运行状态的 Pod 副本的稳定集合。
因此，它通常用来保证给定数量的、完全相同的 Pod 的可用性。

<!-- body -->
<!--
## How a ReplicaSet works

A ReplicaSet is defined with fields, including a selector that specifies how
to identify Pods it can acquire, a number of replicas indicating how many Pods
it should be maintaining, and a pod template specifying the data of new Pods
it should create to meet the number of replicas criteria. A ReplicaSet then
fulfills its purpose by creating and deleting Pods as needed to reach the
desired number. When a ReplicaSet needs to create new Pods, it uses its Pod
template.
-->
## ReplicaSet 的工作原理 {#how-a-replicaset-works}

RepicaSet 是通过一组字段来定义的，包括一个用来识别可获得的 Pod
的集合的选择算符，一个用来标明应该维护的副本个数的数值，一个用来指定应该创建新 Pod
以满足副本个数条件时要使用的 Pod 模板等等。每个 ReplicaSet 都通过根据需要创建和
删除 Pod 以使得副本个数达到期望值，进而实现其存在价值。当 ReplicaSet 需要创建
新的 Pod 时，会使用所提供的 Pod 模板。

<!--
A ReplicaSet is linked to its Pods via the Pods'
[metadata.ownerReferences](/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents)
field, which specifies what resource the current object is owned by. All Pods
acquired by a ReplicaSet have their owning ReplicaSet's identifying
information within their ownerReferences field. It's through this link that
the ReplicaSet knows of the state of the Pods it is maintaining and plans
accordingly.
-->
ReplicaSet 通过 Pod 上的
[metadata.ownerReferences](/zh/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents)
字段连接到附属 Pod，该字段给出当前对象的属主资源。
ReplicaSet 所获得的 Pod 都在其 ownerReferences 字段中包含了属主 ReplicaSet
的标识信息。正是通过这一连接，ReplicaSet 知道它所维护的 Pod 集合的状态，
并据此计划其操作行为。

<!--
A ReplicaSet identifies new Pods to acquire by using its selector. If there is
a Pod that has no OwnerReference or the OwnerReference is not a {{<
glossary_tooltip term_id="controller" >}} and it matches a ReplicaSet's
selector, it will be immediately acquired by said ReplicaSet.
-->
ReplicaSet 使用其选择算符来辨识要获得的 Pod 集合。如果某个 Pod 没有
OwnerReference 或者其 OwnerReference 不是一个 
{{< glossary_tooltip text="控制器" term_id="controller" >}}，且其匹配到
某 ReplicaSet 的选择算符，则该 Pod 立即被此 ReplicaSet 获得。

<!--
## How to use a ReplicaSet

Most [`kubectl`](/docs/user-guide/kubectl/) commands that support
Replication Controllers also support ReplicaSets. One exception is the
[`rolling-update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update) command. If
you want the rolling update functionality please consider using Deployments
instead. Also, the
[`rolling-update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update) command is
imperative whereas Deployments are declarative, so we recommend using Deployments
through the [`rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout) command.

While ReplicaSets can be used independently, today it's mainly used by
[Deployments](/docs/concepts/workloads/controllers/deployment/) as a mechanism to orchestrate pod
creation, deletion and updates. When you use Deployments you don't have to worry
about managing the ReplicaSets that they create. Deployments own and manage
their ReplicaSets.
-->
## 怎样使用 ReplicaSet   {#how-to-use-a-replicaset}

大多数支持 Replication Controllers 的[`kubectl`](/zh/docs/reference/kubectl/kubectl/)命令也支持 ReplicaSets。但[`rolling-update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update) 命令是个例外。如果您想要滚动更新功能请考虑使用 Deployment。[`rolling-update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update) 命令是必需的，而 Deployment 是声明性的，因此我们建议通过 [`rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout)命令使用 Deployment。

虽然 ReplicaSets 可以独立使用，但今天它主要被[Deployments](/zh/docs/concepts/workloads/controllers/deployment/) 用作协调 Pod 创建、删除和更新的机制。
当您使用 Deployment 时，您不必担心还要管理它们创建的 ReplicaSet。Deployment 会拥有并管理它们的 ReplicaSet。

<!--
## When to use a ReplicaSet

A ReplicaSet ensures that a specified number of pod replicas are running at any given
time. However, a Deployment is a higher-level concept that manages ReplicaSets and
provides declarative updates to pods along with a lot of other useful features.
Therefore, we recommend using Deployments instead of directly using ReplicaSets, unless
you require custom update orchestration or don't require updates at all.

This actually means that you may never need to manipulate ReplicaSet objects:
use a Deployment instead, and define your application in the spec section.
-->

## 什么时候使用 ReplicaSet

ReplicaSet 确保任何时间都有指定数量的 Pod 副本在运行。
然而，Deployment 是一个更高级的概念，它管理 ReplicaSet，并向 Pod 提供声明式的更新以及许多其他有用的功能。
因此，我们建议使用 Deployment 而不是直接使用 ReplicaSet，除非您需要自定义更新业务流程或根本不需要更新。

这实际上意味着，您可能永远不需要操作 ReplicaSet 对象：而是使用 Deployment，并在 spec 部分定义您的应用。

<!--
## Example
-->
## 示例

{{< codenew file="controllers/frontend.yaml" >}}

<!--
Saving this manifest into `frontend.yaml` and submitting it to a Kubernetes cluster should
create the defined ReplicaSet and the pods that it manages.
-->

将此清单保存到 `frontend.yaml` 中，并将其提交到 Kubernetes 集群，应该就能创建 yaml 文件所定义的 ReplicaSet 及其管理的 Pod。

```shell
$ kubectl create -f http://k8s.io/examples/controllers/frontend.yaml
replicaset.apps/frontend created
$ kubectl describe rs/frontend
Name:		frontend
Namespace:	default
Selector:	tier=frontend,tier in (frontend)
Labels:		app=guestbook
		tier=frontend
Annotations:	<none>
Replicas:	3 current / 3 desired
Pods Status:	3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       app=guestbook
                tier=frontend
  Containers:
   php-redis:
    Image:      gcr.io/google_samples/gb-frontend:v3
    Port:       80/TCP
    Requests:
      cpu:      100m
      memory:   100Mi
    Environment:
      GET_HOSTS_FROM:   dns
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----                -------------    --------    ------            -------
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-qhloh
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-dnjpy
  1m           1m          1        {replicaset-controller }             Normal      SuccessfulCreate  Created pod: frontend-9si5l
$ kubectl get pods
NAME             READY     STATUS    RESTARTS   AGE
frontend-9si5l   1/1       Running   0          1m
frontend-dnjpy   1/1       Running   0          1m
frontend-qhloh   1/1       Running   0          1m
```

<!--
## Writing a ReplicaSet Spec

As with all other Kubernetes API objects, a ReplicaSet needs the `apiVersion`, `kind`, and `metadata` fields.  For
general information about working with manifests, see [object management using kubectl](/docs/concepts/overview/object-management-kubectl/overview/).

A ReplicaSet also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status).
-->

## 编写 ReplicaSet Spec

与所有其他 Kubernetes API 对象一样，ReplicaSet  也需要 `apiVersion`、`kind`、和 `metadata` 字段。有关使用清单的一般信息，请参见 [使用 kubectl 管理对象](/zh/docs/concepts/overview/working-with-objects/object-management/)。

ReplicaSet 也需要 [`.spec`](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) 部分。

<!--
### Pod Template

The `.spec.template` is the only required field of the `.spec`. The `.spec.template` is a 
[pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a 
[pod](/docs/concepts/workloads/pods/pod/), except that it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields of a pod, a pod template in a ReplicaSet must specify appropriate
labels and an appropriate restart policy.

For labels, make sure to not overlap with other controllers. For more information, see [pod selector](#pod-selector).

For [restart policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy), the only allowed value for `.spec.template.spec.restartPolicy` is `Always`, which is the default.

For local container restarts, ReplicaSet delegates to an agent on the node,
for example the [Kubelet](/docs/admin/kubelet/) or Docker.
-->

### Pod 模版

`.spec.template` 是 `.spec` 唯一需要的字段。`.spec.template` 是 [Pod 模版](/zh/docs/concepts/workloads/pods/#pod-templates)。它和 [Pod](/zh/docs/concepts/workloads/pods/) 的语法几乎完全一样，除了它是嵌套的并没有 `apiVersion` 和 `kind`。

除了所需的 Pod 字段之外，ReplicaSet 中的 Pod 模板必须指定适当的标签和适当的重启策略。

对于标签，请确保不要与其他控制器重叠。更多信息请参考 [Pod 选择器](#pod-selector)。

对于 [重启策略](/zh/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)，`.spec.template.spec.restartPolicy` 唯一允许的取值是 `Always`，这也是默认值.

对于本地容器重新启动，ReplicaSet 委托给了节点上的代理去执行，例如[Kubelet](/zh/docs/reference/command-line-tools-reference/kubelet/) 或 Docker 去执行。

<!--
### Pod Selector

The `.spec.selector` field is a [label selector](/docs/concepts/overview/working-with-objects/labels/). A ReplicaSet
manages all the pods with labels that match the selector. It does not distinguish
between pods that it created or deleted and pods that another person or process created or
deleted. This allows the ReplicaSet to be replaced without affecting the running pods.

The `.spec.template.metadata.labels` must match the `.spec.selector`, or it will
be rejected by the API.

In Kubernetes 1.9 the API version `apps/v1` on the ReplicaSet kind is the current version and is enabled by default. The API version `apps/v1beta2` is deprecated.
-->

### Pod 选择器

`.spec.selector` 字段是[标签选择器](/zh/docs/concepts/overview/working-with-objects/labels/)。ReplicaSet 管理所有标签匹配与标签选择器的 Pod。它不区分自己创建或删除的 Pod 和其他人或进程创建或删除的pod。这允许在不影响运行中的 Pod 的情况下替换副本集。

`.spec.template.metadata.labels` 必须匹配 `.spec.selector`，否则它将被 API 拒绝。

Kubernetes 1.9 版本中，API 版本 `apps/v1` 中的 ReplicaSet 类型的版本是当前版本并默认开启。API 版本 `apps/v1beta2` 被弃用。

<!--
Also you should not normally create any pods whose labels match this selector, either directly, with 
another ReplicaSet, or with another controller such as a Deployment. If you do so, the ReplicaSet thinks that it 
created the other pods. Kubernetes does not stop you from doing this.

If you do end up with multiple controllers that have overlapping selectors, you
will have to manage the deletion yourself.
-->

另外，通常您不应该创建标签与此选择器匹配的任何 Pod，或者直接与另一个 ReplicaSet 或另一个控制器（如 Deployment）标签匹配的任何 Pod。
如果你这样做，ReplicaSet 会认为它创造了其他 Pod。Kubernetes 并不会阻止您这样做。

如果您最终使用了多个具有重叠选择器的控制器，则必须自己负责删除。

<!--
### Labels on a ReplicaSet

The ReplicaSet can itself have labels (`.metadata.labels`).  Typically, you
would set these the same as the `.spec.template.metadata.labels`.  However, they are allowed to be
different, and the `.metadata.labels` do not affect the behavior of the ReplicaSet.

### Replicas

You can specify how many pods should run concurrently by setting `.spec.replicas`. The number running at any time may be higher
or lower, such as if the replicas were just increased or decreased, or if a pod is gracefully
shut down, and a replacement starts early.

If you do not specify `.spec.replicas`, then it defaults to 1.
-->

### Replicas

通过设置 `.spec.replicas` 您可以指定要同时运行多少个 Pod。
在任何时间运行的 Pod 数量可能高于或低于 `.spec.replicas` 指定的数量，例如在副本刚刚被增加或减少后、或者 Pod 正在被优雅地关闭、以及替换提前开始。

如果您没有指定 `.spec.replicas`, 那么默认值为 1。

<!--
## Working with ReplicaSets

### Deleting a ReplicaSet and its Pods

To delete a ReplicaSet and all of its Pods, use [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete). The [Garbage collector](/docs/concepts/workloads/controllers/garbage-collection/) automatically deletes all of the dependent Pods by default.

When using the REST API or the `client-go` library, you must set `propagationPolicy` to `Background` or `Foreground` in delete option. e.g. :
-->

## 使用 ReplicaSets 的具体方法

### 删除 ReplicaSet 和它的 Pod

要删除 ReplicaSet 和它的所有 Pod，使用[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete) 命令。
默认情况下，[垃圾收集器](/zh/docs/concepts/workloads/controllers/garbage-collection/) 自动删除所有依赖的 Pod。

当使用 REST API 或 `client-go` 库时，您必须在删除选项中将 `propagationPolicy` 设置为 `Background` 或 `Foreground`。例如：

```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
> -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
> -H "Content-Type: application/json"
```

<!--
### Deleting just a ReplicaSet

You can delete a ReplicaSet without affecting any of its pods using [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete) with the `--cascade=false` option.
When using the REST API or the `client-go` library, you must set `propagationPolicy` to `Orphan`, e.g. :
-->

### 只删除 ReplicaSet

您可以只删除 ReplicaSet 而不影响它的 Pod，方法是使用[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete) 命令并设置 `--cascade=false` 选项。

当使用 REST API 或 `client-go` 库时，您必须将 `propagationPolicy` 设置为 `Orphan`。例如：

```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
> -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
> -H "Content-Type: application/json"
```

<!--
Once the original is deleted, you can create a new ReplicaSet to replace it.  As long
as the old and new `.spec.selector` are the same, then the new one will adopt the old pods.
However, it will not make any effort to make existing pods match a new, different pod template.
To update pods to a new spec in a controlled way, use a [rolling update](#rolling-updates).
-->

一旦删除了原来的 ReplicaSet，就可以创建一个新的来替换它。
由于新旧 ReplicaSet 的 `.spec.selector` 是相同的，新的 ReplicaSet 将接管老的 Pod。
但是，它不会努力使现有的 Pod 与新的、不同的 Pod 模板匹配。
若想要以可控的方式将 Pod 更新到新的 spec，就要使用 [滚动更新](#rolling-updates)的方式。


<!--

### Isolating pods from a ReplicaSet

Pods may be removed from a ReplicaSet's target set by changing their labels. This technique may be used to remove pods 
from service for debugging, data recovery, etc. Pods that are removed in this way will be replaced automatically (
  assuming that the number of replicas is not also changed).

-->

### 将 Pod 从 ReplicaSet 中隔离

可以通过改变标签来从 ReplicaSet 的目标集中移除 Pod。这种技术可以用来从服务中去除 Pod，以便进行排错、数据恢复等。
以这种方式移除的 Pod 将被自动替换（假设副本的数量没有改变）。

<!--
### Scaling a ReplicaSet

A ReplicaSet can be easily scaled up or down by simply updating the `.spec.replicas` field. The ReplicaSet controller
ensures that a desired number of pods with a matching label selector are available and operational.
-->

### 缩放 RepliaSet

通过更新 `.spec.replicas` 字段，ReplicaSet 可以被轻松的进行缩放。ReplicaSet 控制器能确保匹配标签选择器的数量的 Pod 是可用的和可操作的。

<!--
### ReplicaSet as an Horizontal Pod Autoscaler Target

A ReplicaSet can also be a target for
[Horizontal Pod Autoscalers (HPA)](/docs/tasks/run-application/horizontal-pod-autoscale/). That is,
a ReplicaSet can be auto-scaled by an HPA. Here is an example HPA targeting
the ReplicaSet we created in the previous example.
-->

### ReplicaSet 作为水平的 Pod 自动缩放器目标

ReplicaSet 也可以作为 [水平的 Pod 缩放器 (HPA)](/docs/tasks/run-application/horizontal-pod-autoscale/) 的目标。也就是说，ReplicaSet 可以被 HPA 自动缩放。
以下是 HPA 以我们在前一个示例中创建的副本集为目标的示例。


{{< codenew file="controllers/hpa-rs.yaml" >}}

<!--
Saving this manifest into `hpa-rs.yaml` and submitting it to a Kubernetes cluster should
create the defined HPA that autoscales the target ReplicaSet depending on the CPU usage
of the replicated pods.
-->

将这个列表保存到 `hpa-rs.yaml` 并提交到 Kubernetes 集群，就能创建它所定义的 HPA，进而就能根据复制的 Pod 的 CPU 利用率对目标 ReplicaSet进行自动缩放。

```shell
kubectl create -f https://k8s.io/examples/controllers/hpa-rs.yaml
```

<!--
Alternatively, you can use the `kubectl autoscale` command to accomplish the same
(and it's easier!)
-->

或者，可以使用 `kubectl autoscale` 命令完成相同的操作。
(而且它更简单！)

```shell
kubectl autoscale rs frontend
```

<!--
## Alternatives to ReplicaSet

### Deployment (Recommended)

[`Deployment`](/docs/concepts/workloads/controllers/deployment/) is a higher-level API object that updates its underlying ReplicaSets and their Pods
in a similar fashion as `kubectl rolling-update`. Deployments are recommended if you want this rolling update functionality,
because unlike `kubectl rolling-update`, they are declarative, server-side, and have additional features. For more information on running a stateless
application using a Deployment, please read [Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).
-->

## ReplicaSet 的替代方案

### Deployment （推荐）

[`Deployment`](/zh/docs/concepts/workloads/controllers/deployment/) 是一个高级 API 对象，它以 `kubectl rolling-update` 的方式更新其底层副本集及其Pod。
如果您需要滚动更新功能，建议使用 Deployment，因为 Deployment 与 `kubectl rolling-update` 不同的是：它是声明式的、服务器端的、并且具有其他特性。
有关使用 Deployment 来运行无状态应用的更多信息，请参阅 [使用 Deployment 运行无状态应用](/zh/docs/tasks/run-application/run-stateless-application-deployment/)。

<!--
### Bare Pods

Unlike the case where a user directly created pods, a ReplicaSet replaces pods that are deleted or terminated for any reason, such as in the case of node failure or disruptive node maintenance, such as a kernel upgrade. For this reason, we recommend that you use a ReplicaSet even if your application requires only a single pod. Think of it similarly to a process supervisor, only it supervises multiple pods across multiple nodes instead of individual processes on a single node. A ReplicaSet delegates local container restarts to some agent on the node (for example, Kubelet or Docker).
-->

### 裸 Pod

与用户直接创建 Pod 的情况不同，ReplicaSet 会替换那些由于某些原因被删除或被终止的 Pod，例如在节点故障或破坏性的节点维护（如内核升级）的情况下。
因为这个好处，我们建议您使用 ReplicaSet，即使应用程序只需要一个 Pod。
想像一下，ReplicaSet 类似于进程监视器，只不过它在多个节点上监视多个 Pod，而不是在单个节点上监视单个进程。
ReplicaSet 将本地容器重启的任务委托给了节点上的某个代理（例如，Kubelet 或 Docker）去完成。

<!--
### Job

Use a [`Job`](/docs/concepts/jobs/run-to-completion-finite-workloads/) instead of a ReplicaSet for pods that are expected to terminate on their own
(that is, batch jobs).
-->

### Job

使用[`Job`](/zh/docs/concepts/workloads/controllers/job/) 代替ReplicaSet，可以用于那些期望自行终止的 Pod。

<!--
### DaemonSet

Use a [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) instead of a ReplicaSet for pods that provide a
machine-level function, such as machine monitoring or machine logging.  These pods have a lifetime that is tied
to a machine lifetime: the pod needs to be running on the machine before other pods start, and are
safe to terminate when the machine is otherwise ready to be rebooted/shutdown.
-->

### DaemonSet

对于管理那些提供主机级别功能（如主机监控和主机日志）的容器，就要用[`DaemonSet`](/zh/docs/concepts/workloads/controllers/daemonset/) 而不用 ReplicaSet。
这些 Pod 的寿命与主机寿命有关：这些 Pod 需要先于主机上的其他 Pod 运行，并且在机器准备重新启动/关闭时安全地终止。



