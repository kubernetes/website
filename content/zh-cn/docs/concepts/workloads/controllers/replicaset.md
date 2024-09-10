---
title: ReplicaSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "ReplicaSet"
feature:
  title: 自我修复
  anchor: ReplicationController 如何工作
  description: >
    重新启动失败的容器，在节点死亡时替换并重新调度容器，
    杀死不响应用户定义的健康检查的容器，
    并且在它们准备好服务之前不会将它们公布给客户端。
content_type: concept
description: >-
  ReplicaSet 的作用是维持在任何给定时间运行的一组稳定的副本 Pod。
  通常，你会定义一个 Deployment，并用这个 Deployment 自动管理 ReplicaSet。
weight: 20
hide_summary: true # 在章节索引中单独列出
---
<!--
reviewers:
- Kashomon
- bprashanth
- madhusudancs
title: ReplicaSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "ReplicaSet"
feature:
  title: Self-healing
  anchor: How a ReplicaSet works
  description: >
    Restarts containers that fail, replaces and reschedules containers when nodes die,
    kills containers that don't respond to your user-defined health check,
    and doesn't advertise them to clients until they are ready to serve.
content_type: concept
description: >-
  A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time.
  Usually, you define a Deployment and let that Deployment manage ReplicaSets automatically.
weight: 20
hide_summary: true # Listed separately in section index
-->

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

A ReplicaSet is defined with fields, including a selector that specifies how to identify Pods it can acquire, a number
of replicas indicating how many Pods it should be maintaining, and a pod template specifying the data of new Pods
it should create to meet the number of replicas criteria. A ReplicaSet then fulfills its purpose by creating
and deleting Pods as needed to reach the desired number. When a ReplicaSet needs to create new Pods, it uses its Pod
template.
-->
## ReplicaSet 的工作原理 {#how-a-replicaset-works}

ReplicaSet 是通过一组字段来定义的，包括一个用来识别可获得的 Pod
的集合的选择算符、一个用来标明应该维护的副本个数的数值、一个用来指定应该创建新 Pod
以满足副本个数条件时要使用的 Pod 模板等等。
每个 ReplicaSet 都通过根据需要创建和删除 Pod 以使得副本个数达到期望值，
进而实现其存在价值。当 ReplicaSet 需要创建新的 Pod 时，会使用所提供的 Pod 模板。

<!--
A ReplicaSet is linked to its Pods via the Pods' [metadata.ownerReferences](/docs/concepts/architecture/garbage-collection/#owners-dependents)
field, which specifies what resource the current object is owned by. All Pods acquired by a ReplicaSet have their owning
ReplicaSet's identifying information within their ownerReferences field. It's through this link that the ReplicaSet
knows of the state of the Pods it is maintaining and plans accordingly.
-->
ReplicaSet 通过 Pod 上的
[metadata.ownerReferences](/zh-cn/docs/concepts/architecture/garbage-collection/#owners-dependents)
字段连接到附属 Pod，该字段给出当前对象的属主资源。
ReplicaSet 所获得的 Pod 都在其 ownerReferences 字段中包含了属主 ReplicaSet
的标识信息。正是通过这一连接，ReplicaSet 知道它所维护的 Pod 集合的状态，
并据此计划其操作行为。

<!--
A ReplicaSet identifies new Pods to acquire by using its selector. If there is a Pod that has no
OwnerReference or the OwnerReference is not a {{< glossary_tooltip term_id="controller" >}} and it
matches a ReplicaSet's selector, it will be immediately acquired by said ReplicaSet.
-->
ReplicaSet 使用其选择算符来辨识要获得的 Pod 集合。如果某个 Pod 没有
OwnerReference 或者其 OwnerReference 不是一个{{< glossary_tooltip text="控制器" term_id="controller" >}}，
且其匹配到某 ReplicaSet 的选择算符，则该 Pod 立即被此 ReplicaSet 获得。

<!--
## When to use a ReplicaSet

A ReplicaSet ensures that a specified number of pod replicas are running at any given
time. However, a Deployment is a higher-level concept that manages ReplicaSets and
provides declarative updates to Pods along with a lot of other useful features.
Therefore, we recommend using Deployments instead of directly using ReplicaSets, unless
you require custom update orchestration or don't require updates at all.

This actually means that you may never need to manipulate ReplicaSet objects:
use a Deployment instead, and define your application in the spec section.
-->
## 何时使用 ReplicaSet    {#when-to-use-a-replicaset}

ReplicaSet 确保任何时间都有指定数量的 Pod 副本在运行。
然而，Deployment 是一个更高级的概念，它管理 ReplicaSet，并向 Pod
提供声明式的更新以及许多其他有用的功能。
因此，我们建议使用 Deployment 而不是直接使用 ReplicaSet，
除非你需要自定义更新业务流程或根本不需要更新。

这实际上意味着，你可能永远不需要操作 ReplicaSet 对象：而是使用
Deployment，并在 spec 部分定义你的应用。

<!--
## Example
-->
## 示例    {#example}

{{% code_sample file="controllers/frontend.yaml" %}}

<!--
Saving this manifest into `frontend.yaml` and submitting it to a Kubernetes cluster will
create the defined ReplicaSet and the Pods that it manages.
-->
将此清单保存到 `frontend.yaml` 中，并将其提交到 Kubernetes 集群，
就能创建 yaml 文件所定义的 ReplicaSet 及其管理的 Pod。

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

<!--
You can then get the current ReplicaSets deployed:
-->
你可以看到当前被部署的 ReplicaSet：

```shell
kubectl get rs
```

<!--
And see the frontend one you created:
-->
并看到你所创建的前端：

```
NAME       DESIRED   CURRENT   READY   AGE
frontend   3         3         3       6s
```

<!--
You can also check on the state of the ReplicaSet:
-->
你也可以查看 ReplicaSet 的状态：

```shell
kubectl describe rs/frontend
```

<!--
And you will see output similar to:
-->
你会看到类似如下的输出：

```
Name:         frontend
Namespace:    default
Selector:     tier=frontend
Labels:       app=guestbook
              tier=frontend
Annotations:  <none>
Replicas:     3 current / 3 desired
Pods Status:  3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  tier=frontend
  Containers:
   php-redis:
    Image:        us-docker.pkg.dev/google-samples/containers/gke/gb-frontend:v5
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From                   Message
  ----    ------            ----  ----                   -------
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-gbgfx
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-rwz57
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-wkl7w
```

<!--
And lastly you can check for the Pods brought up:
-->
最后可以查看启动了的 Pod 集合：

```shell
kubectl get pods
```

<!--
You should see Pod information similar to:
-->
你会看到类似如下的 Pod 信息：

```
NAME             READY   STATUS    RESTARTS   AGE
frontend-gbgfx   1/1     Running   0          10m
frontend-rwz57   1/1     Running   0          10m
frontend-wkl7w   1/1     Running   0          10m
```

<!--
You can also verify that the owner reference of these pods is set to the frontend ReplicaSet.
To do this, get the yaml of one of the Pods running:
-->
你也可以查看 Pod 的属主引用被设置为前端的 ReplicaSet。
要实现这点，可取回运行中的某个 Pod 的 YAML：

```shell
kubectl get pods frontend-gbgfx -o yaml
```

<!--
The output will look similar to this, with the frontend ReplicaSet's info set in the metadata's ownerReferences field:
-->
输出将类似这样，frontend ReplicaSet 的信息被设置在 metadata 的
`ownerReferences` 字段中：

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2024-02-28T22:30:44Z"
  generateName: frontend-
  labels:
    tier: frontend
  name: frontend-gbgfx
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: frontend
    uid: e129deca-f864-481b-bb16-b27abfd92292
...
```

<!--
## Non-Template Pod acquisitions
-->
## 非模板 Pod 的获得    {#non-template-pod-acquisitions}

<!--
While you can create bare Pods with no problems, it is strongly recommended to make sure that the bare Pods do not have
labels which match the selector of one of your ReplicaSets. The reason for this is because a ReplicaSet is not limited
to owning Pods specified by its template-- it can acquire other Pods in the manner specified in the previous sections.

Take the previous frontend ReplicaSet example, and the Pods specified in the following manifest:
-->
尽管你完全可以直接创建裸的 Pod，强烈建议你确保这些裸的 Pod 并不包含可能与你的某个
ReplicaSet 的选择算符相匹配的标签。原因在于 ReplicaSet 并不仅限于拥有在其模板中设置的
Pod，它还可以像前面小节中所描述的那样获得其他 Pod。

以前面的 frontend ReplicaSet 为例，并在以下清单中指定这些 Pod：

{{% code_sample file="pods/pod-rs.yaml" %}}

<!--
As those Pods do not have a Controller (or any object) as their owner reference and match the selector of the frontend
ReplicaSet, they will immediately be acquired by it.

Suppose you create the Pods after the frontend ReplicaSet has been deployed and has set up its initial Pod replicas to
fulfill its replica count requirement:
-->
由于这些 Pod 没有控制器（Controller，或其他对象）作为其属主引用，
并且其标签与 frontend ReplicaSet 的选择算符匹配，它们会立即被该 ReplicaSet 获取。

假定你在 frontend ReplicaSet 已经被部署之后创建 Pod，并且你已经在 ReplicaSet
中设置了其初始的 Pod 副本数以满足其副本计数需要：

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

<!--
The new Pods will be acquired by the ReplicaSet, and then immediately terminated as the ReplicaSet would be over
its desired count.

Fetching the Pods:
-->
新的 Pod 会被该 ReplicaSet 获取，并立即被 ReplicaSet 终止，
因为它们的存在会使得 ReplicaSet 中 Pod 个数超出其期望值。

取回 Pod：


```shell
kubectl get pods
```

<!--
The output shows that the new Pods are either already terminated, or in the process of being terminated:
-->
输出显示新的 Pod 或者已经被终止，或者处于终止过程中：

```
NAME             READY   STATUS        RESTARTS   AGE
frontend-b2zdv   1/1     Running       0          10m
frontend-vcmts   1/1     Running       0          10m
frontend-wtsmm   1/1     Running       0          10m
pod1             0/1     Terminating   0          1s
pod2             0/1     Terminating   0          1s
```

<!--
If you create the Pods first:
-->
如果你先行创建 Pod：

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

<!--
And then create the ReplicaSet however:
-->
之后再创建 ReplicaSet：

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

<!--
You shall see that the ReplicaSet has acquired the Pods and has only created new ones according to its spec until the
number of its new Pods and the original matches its desired count. As fetching the Pods:
-->
你会看到 ReplicaSet 已经获得了该 Pod，并仅根据其规约创建新的 Pod，
直到新的 Pod 和原来的 Pod 的总数达到其预期个数。
这时取回 Pod 列表：

```shell
kubectl get pods
```

<!--
Will reveal in its output:
-->
将会生成下面的输出：

```
NAME             READY   STATUS    RESTARTS   AGE
frontend-hmmj2   1/1     Running   0          9s
pod1             1/1     Running   0          36s
pod2             1/1     Running   0          36s
```

<!--
In this manner, a ReplicaSet can own a non-homogeneous set of Pods
-->
采用这种方式，一个 ReplicaSet 中可以包含异质的 Pod 集合。

<!--
## Writing a ReplicaSet manifest

As with all other Kubernetes API objects, a ReplicaSet needs the `apiVersion`, `kind`, and `metadata` fields.
For ReplicaSets, the `kind` is always a ReplicaSet.

When the control plane creates new Pods for a ReplicaSet, the `.metadata.name` of the
ReplicaSet is part of the basis for naming those Pods.  The name of a ReplicaSet must be a valid
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
value, but this can produce unexpected results for the Pod hostnames.  For best compatibility,
the name should follow the more restrictive rules for a
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).

A ReplicaSet also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->
## 编写 ReplicaSet 的清单    {#writing-a-replicaset-manifest}

与所有其他 Kubernetes API 对象一样，ReplicaSet 也需要 `apiVersion`、`kind`、和 `metadata` 字段。
对于 ReplicaSet 而言，其 `kind` 始终是 ReplicaSet。

当控制平面为 ReplicaSet 创建新的 Pod 时，ReplicaSet
的 `.metadata.name` 是命名这些 Pod 的部分基础。ReplicaSet 的名称必须是一个合法的
[DNS 子域](/zh-cn/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)值，
但这可能对 Pod 的主机名产生意外的结果。为获得最佳兼容性，名称应遵循更严格的
[DNS 标签](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)规则。

ReplicaSet 也需要
[`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
部分。

<!--
### Pod Template

The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/#pod-templates) which is also
required to have labels in place. In our `frontend.yaml` example we had one label: `tier: frontend`.
Be careful not to overlap with the selectors of other controllers, lest they try to adopt this Pod.

For the template's [restart policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) field,
`.spec.template.spec.restartPolicy`, the only allowed value is `Always`, which is the default.
-->
### Pod 模板    {#pod-template}

`.spec.template` 是一个 [Pod 模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)，
要求设置标签。在 `frontend.yaml` 示例中，我们指定了标签 `tier: frontend`。
注意不要将标签与其他控制器的选择算符重叠，否则那些控制器会尝试收养此 Pod。

对于模板的[重启策略](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
字段，`.spec.template.spec.restartPolicy`，唯一允许的取值是 `Always`，这也是默认值.

<!--
### Pod Selector

The `.spec.selector` field is a [label selector](/docs/concepts/overview/working-with-objects/labels/). As discussed
[earlier](#how-a-replicaset-works) these are the labels used to identify potential Pods to acquire. In our
`frontend.yaml` example, the selector was:

```yaml
matchLabels:
  tier: frontend
```

In the ReplicaSet, `.spec.template.metadata.labels` must match `spec.selector`, or it will
be rejected by the API.
-->
### Pod 选择算符   {#pod-selector}

`.spec.selector` 字段是一个[标签选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)。
如前文中[所讨论的](#how-a-replicaset-works)，这些是用来标识要被获取的 Pod
的标签。在签名的 `frontend.yaml` 示例中，选择算符为：

```yaml
matchLabels:
  tier: frontend
```

在 ReplicaSet 中，`.spec.template.metadata.labels` 的值必须与 `spec.selector`
值相匹配，否则该配置会被 API 拒绝。

{{< note >}}
<!--
For 2 ReplicaSets specifying the same `.spec.selector` but different
`.spec.template.metadata.labels` and `.spec.template.spec` fields, each ReplicaSet ignores the
Pods created by the other ReplicaSet.
-->
对于设置了相同的 `.spec.selector`，但
`.spec.template.metadata.labels` 和 `.spec.template.spec` 字段不同的两个
ReplicaSet 而言，每个 ReplicaSet 都会忽略被另一个 ReplicaSet 所创建的 Pod。
{{< /note >}}

<!--
### Replicas

You can specify how many Pods should run concurrently by setting `.spec.replicas`. The ReplicaSet will create/delete
its Pods to match this number.

If you do not specify `.spec.replicas`, then it defaults to 1.
-->
### Replicas

你可以通过设置 `.spec.replicas` 来指定要同时运行的 Pod 个数。
ReplicaSet 创建、删除 Pod 以与此值匹配。

如果你没有指定 `.spec.replicas`，那么默认值为 1。

<!--
## Working with ReplicaSets

### Deleting a ReplicaSet and its Pods

To delete a ReplicaSet and all of its Pods, use
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete). The
[Garbage collector](/docs/concepts/architecture/garbage-collection/) automatically deletes all of
the dependent Pods by default.

When using the REST API or the `client-go` library, you must set `propagationPolicy` to
`Background` or `Foreground` in the `-d` option. For example:
-->
## 使用 ReplicaSet    {#working-with-replicasets}

### 删除 ReplicaSet 和它的 Pod    {#deleting-a-replicaset-and-its-pods}

要删除 ReplicaSet 和它的所有 Pod，使用
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete) 命令。
默认情况下，[垃圾收集器](/zh-cn/docs/concepts/architecture/garbage-collection/)
自动删除所有依赖的 Pod。

当使用 REST API 或 `client-go` 库时，你必须在 `-d` 选项中将 `propagationPolicy`
设置为 `Background` 或 `Foreground`。例如：

```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
  -H "Content-Type: application/json"
```

<!--
### Deleting just a ReplicaSet

You can delete a ReplicaSet without affecting any of its Pods using
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete)
with the `--cascade=orphan` option.
When using the REST API or the `client-go` library, you must set `propagationPolicy` to `Orphan`.
For example:
-->
### 只删除 ReplicaSet    {#deleting-just-a-replicaset}

你可以只删除 ReplicaSet 而不影响它的各个 Pod，方法是使用
[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete)
命令并设置 `--cascade=orphan` 选项。

当使用 REST API 或 `client-go` 库时，你必须将 `propagationPolicy` 设置为 `Orphan`。
例如：

```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
  -H "Content-Type: application/json"
```

<!--
Once the original is deleted, you can create a new ReplicaSet to replace it.  As long
as the old and new `.spec.selector` are the same, then the new one will adopt the old Pods.
However, it will not make any effort to make existing Pods match a new, different pod template.
To update Pods to a new spec in a controlled way, use a
[Deployment](/docs/concepts/workloads/controllers/deployment/#creating-a-deployment), as
ReplicaSets do not support a rolling update directly.
-->
一旦删除了原来的 ReplicaSet，就可以创建一个新的来替换它。
由于新旧 ReplicaSet 的 `.spec.selector` 是相同的，新的 ReplicaSet 将接管老的 Pod。
但是，它不会努力使现有的 Pod 与新的、不同的 Pod 模板匹配。
若想要以可控的方式更新 Pod 的规约，可以使用
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/#creating-a-deployment)
资源，因为 ReplicaSet 并不直接支持滚动更新。

<!--
### Isolating Pods from a ReplicaSet

You can remove Pods from a ReplicaSet by changing their labels. This technique may be used to remove Pods
from service for debugging, data recovery, etc. Pods that are removed in this way will be replaced automatically (
assuming that the number of replicas is not also changed).
-->
### 将 Pod 从 ReplicaSet 中隔离    {#isolating-pods-from-a-replicaset}

可以通过改变标签来从 ReplicaSet 中移除 Pod。
这种技术可以用来从服务中去除 Pod，以便进行排错、数据恢复等。
以这种方式移除的 Pod 将被自动替换（假设副本的数量没有改变）。

<!--
### Scaling a ReplicaSet

A ReplicaSet can be easily scaled up or down by simply updating the `.spec.replicas` field. The ReplicaSet controller
ensures that a desired number of Pods with a matching label selector are available and operational.
-->
### 扩缩 ReplicaSet    {#scaling-a-replicaset}

通过更新 `.spec.replicas` 字段，ReplicaSet 可以被轻松地进行扩缩。ReplicaSet
控制器能确保匹配标签选择器的数量的 Pod 是可用的和可操作的。

<!--
When scaling down, the ReplicaSet controller chooses which pods to delete by sorting the available pods to
prioritize scaling down pods based on the following general algorithm:
-->
在降低集合规模时，ReplicaSet 控制器通过对可用的所有 Pod 进行排序来优先选择要被删除的那些 Pod。
其一般性算法如下：

<!--
1. Pending (and unschedulable) pods are scaled down first
1. If `controller.kubernetes.io/pod-deletion-cost` annotation is set, then
   the pod with the lower value will come first.
1. Pods on nodes with more replicas come before pods on nodes with fewer replicas.
1. If the pods' creation times differ, the pod that was created more recently
   comes before the older pod (the creation times are bucketed on an integer log scale).
-->
1. 首先选择剔除悬决（Pending，且不可调度）的各个 Pod
2. 如果设置了 `controller.kubernetes.io/pod-deletion-cost` 注解，则注解值较小的优先被裁减掉
3. 所处节点上副本个数较多的 Pod 优先于所处节点上副本较少者
4. 如果 Pod 的创建时间不同，最近创建的 Pod 优先于早前创建的 Pod 被裁减（创建时间是按整数幂级来分组的）。

<!--
If all of the above match, then selection is random.
-->
如果以上比较结果都相同，则随机选择。

<!--
### Pod deletion cost 
-->
### Pod 删除开销   {#pod-deletion-cost}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
Using the [`controller.kubernetes.io/pod-deletion-cost`](/docs/reference/labels-annotations-taints/#pod-deletion-cost) 
annotation, users can set a preference regarding which pods to remove first when downscaling a ReplicaSet.
-->
通过使用 [`controller.kubernetes.io/pod-deletion-cost`](/zh-cn/docs/reference/labels-annotations-taints/#pod-deletion-cost)
注解，用户可以对 ReplicaSet 缩容时要先删除哪些 Pod 设置偏好。

<!--
The annotation should be set on the pod, the range is [-2147483648, 2147483647]. It represents the cost of
deleting a pod compared to other pods belonging to the same ReplicaSet. Pods with lower deletion
cost are preferred to be deleted before pods with higher deletion cost. 
-->
此注解要设置到 Pod 上，取值范围为 [-2147483648, 2147483647]。
所代表的是删除同一 ReplicaSet 中其他 Pod 相比较而言的开销。
删除开销较小的 Pod 比删除开销较高的 Pod 更容易被删除。

<!--
The implicit value for this annotation for pods that don't set it is 0; negative values are permitted.
Invalid values will be rejected by the API server.
-->
Pod 如果未设置此注解，则隐含的设置值为 0。负值也是可接受的。
如果注解值非法，API 服务器会拒绝对应的 Pod。

<!--
This feature is beta and enabled by default. You can disable it using the
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`PodDeletionCost` in both kube-apiserver and kube-controller-manager.
-->
此功能特性处于 Beta 阶段，默认被启用。你可以通过为 kube-apiserver 和
kube-controller-manager 设置[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
`PodDeletionCost` 来禁用此功能。

{{< note >}}
<!--
- This is honored on a best-effort basis, so it does not offer any guarantees on pod deletion order.
- Users should avoid updating the annotation frequently, such as updating it based on a metric value,
  because doing so will generate a significant number of pod updates on the apiserver.
-->
- 此机制实施时仅是尽力而为，并不能对 Pod 的删除顺序作出任何保证；
- 用户应避免频繁更新注解值，例如根据某观测度量值来更新此注解值是应该避免的。
  这样做会在 API 服务器上产生大量的 Pod 更新操作。
{{< /note >}}

<!--
#### Example Use Case

The different pods of an application could have different utilization levels. On scale down, the application 
may prefer to remove the pods with lower utilization. To avoid frequently updating the pods, the application
should update `controller.kubernetes.io/pod-deletion-cost` once before issuing a scale down (setting the 
annotation to a value proportional to pod utilization level). This works if the application itself controls
the down scaling; for example, the driver pod of a Spark deployment.
-->
#### 使用场景示例    {#example-use-case}

同一应用的不同 Pod 可能其利用率是不同的。在对应用执行缩容操作时，
可能希望移除利用率较低的 Pod。为了避免频繁更新 Pod，应用应该在执行缩容操作之前更新一次
`controller.kubernetes.io/pod-deletion-cost` 注解值
（将注解值设置为一个与其 Pod 利用率对应的值）。
如果应用自身控制器缩容操作时（例如 Spark 部署的驱动 Pod），这种机制是可以起作用的。

<!--
### ReplicaSet as a Horizontal Pod Autoscaler Target

A ReplicaSet can also be a target for
[Horizontal Pod Autoscalers (HPA)](/docs/tasks/run-application/horizontal-pod-autoscale/). That is,
a ReplicaSet can be auto-scaled by an HPA. Here is an example HPA targeting
the ReplicaSet we created in the previous example.
-->
### ReplicaSet 作为水平的 Pod 自动扩缩器目标    {#replicaset-as-a-horizontal-pod-autoscaler-target}

ReplicaSet 也可以作为[水平的 Pod 扩缩器 (HPA)](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
的目标。也就是说，ReplicaSet 可以被 HPA 自动扩缩。
以下是 HPA 以我们在前一个示例中创建的副本集为目标的示例。

{{% code_sample file="controllers/hpa-rs.yaml" %}}

<!--
Saving this manifest into `hpa-rs.yaml` and submitting it to a Kubernetes cluster should
create the defined HPA that autoscales the target ReplicaSet depending on the CPU usage
of the replicated Pods.
-->
将这个列表保存到 `hpa-rs.yaml` 并提交到 Kubernetes 集群，就能创建它所定义的
HPA，进而就能根据复制的 Pod 的 CPU 利用率对目标 ReplicaSet 进行自动扩缩。

```shell
kubectl apply -f https://k8s.io/examples/controllers/hpa-rs.yaml
```

<!--
Alternatively, you can use the `kubectl autoscale` command to accomplish the same
(and it's easier!)
-->
或者，可以使用 `kubectl autoscale` 命令完成相同的操作（而且它更简单！）

```shell
kubectl autoscale rs frontend --max=10 --min=3 --cpu-percent=50
```

<!--
## Alternatives to ReplicaSet

### Deployment (recommended)

[`Deployment`](/docs/concepts/workloads/controllers/deployment/) is an object which can own ReplicaSets and update
them and their Pods via declarative, server-side rolling updates.
While ReplicaSets can be used independently, today they're mainly used by Deployments as a mechanism to orchestrate Pod
creation, deletion and updates. When you use Deployments you don't have to worry about managing the ReplicaSets that
they create. Deployments own and manage their ReplicaSets.
As such, it is recommended to use Deployments when you want ReplicaSets.
-->
## ReplicaSet 的替代方案    {#alternatives-to-replicaset}

### Deployment（推荐）    {#deployment-recommended}

[`Deployment`](/zh-cn/docs/concepts/workloads/controllers/deployment/) 是一个可以拥有
ReplicaSet 并使用声明式方式在服务器端完成对 Pod 滚动更新的对象。
尽管 ReplicaSet 可以独立使用，目前它们的主要用途是提供给 Deployment 作为编排
Pod 创建、删除和更新的一种机制。当使用 Deployment 时，你不必关心如何管理它所创建的
ReplicaSet，Deployment 拥有并管理其 ReplicaSet。
因此，建议你在需要 ReplicaSet 时使用 Deployment。

<!--
### Bare Pods

Unlike the case where a user directly created Pods, a ReplicaSet replaces Pods that are deleted or
terminated for any reason, such as in the case of node failure or disruptive node maintenance,
such as a kernel upgrade. For this reason, we recommend that you use a ReplicaSet even if your
application requires only a single Pod. Think of it similarly to a process supervisor, only it
supervises multiple Pods across multiple nodes instead of individual processes on a single node. A
ReplicaSet delegates local container restarts to some agent on the node such as Kubelet.
-->
### 裸 Pod    {#bare-pods}

与用户直接创建 Pod 的情况不同，ReplicaSet 会替换那些由于某些原因被删除或被终止的
Pod，例如在节点故障或破坏性的节点维护（如内核升级）的情况下。
因为这个原因，我们建议你使用 ReplicaSet，即使应用程序只需要一个 Pod。
想像一下，ReplicaSet 类似于进程监视器，只不过它在多个节点上监视多个 Pod，
而不是在单个节点上监视单个进程。
ReplicaSet 将本地容器重启的任务委托给了节点上的某个代理（例如，Kubelet）去完成。

<!--
### Job

Use a [`Job`](/docs/concepts/workloads/controllers/job/) instead of a ReplicaSet for Pods that are
expected to terminate on their own (that is, batch jobs).
-->
### Job

使用[`Job`](/zh-cn/docs/concepts/workloads/controllers/job/) 代替 ReplicaSet，
可以用于那些期望自行终止的 Pod。

<!--
### DaemonSet

Use a [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) instead of a ReplicaSet for Pods that provide a
machine-level function, such as machine monitoring or machine logging.  These Pods have a lifetime that is tied
to a machine lifetime: the Pod needs to be running on the machine before other Pods start, and are
safe to terminate when the machine is otherwise ready to be rebooted/shutdown.
-->
### DaemonSet

对于管理那些提供主机级别功能（如主机监控和主机日志）的容器，
就要用 [`DaemonSet`](/zh-cn/docs/concepts/workloads/controllers/daemonset/)
而不用 ReplicaSet。
这些 Pod 的寿命与主机寿命有关：这些 Pod 需要先于主机上的其他 Pod 运行，
并且在机器准备重新启动/关闭时安全地终止。

### ReplicationController

<!--
ReplicaSets are the successors to [ReplicationControllers](/docs/concepts/workloads/controllers/replicationcontroller/).
The two serve the same purpose, and behave similarly, except that a ReplicationController does not support set-based
selector requirements as described in the [labels user guide](/docs/concepts/overview/working-with-objects/labels/#label-selectors).
As such, ReplicaSets are preferred over ReplicationControllers
-->
ReplicaSet 是 [ReplicationController](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)
的后继者。二者目的相同且行为类似，只是 ReplicationController 不支持
[标签用户指南](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)
中讨论的基于集合的选择算符需求。
因此，相比于 ReplicationController，应优先考虑 ReplicaSet。

## {{% heading "whatsnext" %}}

<!--
* Learn about [Pods](/docs/concepts/workloads/pods).
* Learn about [Deployments](/docs/concepts/workloads/controllers/deployment/).
* [Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/),
  which relies on ReplicaSets to work.
* `ReplicaSet` is a top-level resource in the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/replica-set-v1" >}}
  object definition to understand the API for replica sets.
* Read about [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) and how
  you can use it to manage application availability during disruptions.
-->
* 了解 [Pod](/zh-cn/docs/concepts/workloads/pods)。
* 了解 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
* [使用 Deployment 运行一个无状态应用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)，
  它依赖于 ReplicaSet。
* `ReplicaSet` 是 Kubernetes REST API 中的顶级资源。阅读
  {{< api-reference page="workload-resources/replica-set-v1" >}}
  对象定义理解关于该资源的 API。
* 阅读 [Pod 干扰预算（Disruption Budget）](/zh-cn/docs/concepts/workloads/pods/disruptions/)，
  了解如何在干扰下运行高度可用的应用。
