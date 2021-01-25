---
title: 垃圾收集
content_type: concept
weight: 60
---

<!--
title: Garbage Collection
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
The role of the Kubernetes garbage collector is to delete certain objects
that once had an owner, but no longer have an owner.
-->
Kubernetes 垃圾收集器的作用是删除某些曾经拥有属主（Owner）但现在不再拥有属主的对象。

<!-- body -->

<!--
## Owners and dependents

Some Kubernetes objects are owners of other objects. For example, a ReplicaSet
is the owner of a set of Pods. The owned objects are called *dependents* of the
owner object. Every dependent object has a `metadata.ownerReferences` field that
points to the owning object.

Sometimes, Kubernetes sets the value of `ownerReference` automatically. For
example, when you create a ReplicaSet, Kubernetes automatically sets the
`ownerReference` field of each Pod in the ReplicaSet. In 1.8, Kubernetes
automatically sets the value of `ownerReference` for objects created or adopted
by ReplicationController, ReplicaSet, StatefulSet, DaemonSet, Deployment, Job
and CronJob.

-->
## 属主和附属     {#owners-and-dependents}

某些 Kubernetes 对象是其它一些对象的属主。
例如，一个 ReplicaSet 是一组 Pod 的属主。
具有属主的对象被称为是属主的 *附属* 。
每个附属对象具有一个指向其所属对象的 `metadata.ownerReferences` 字段。

有时，Kubernetes 会自动设置 `ownerReference` 的值。
例如，当创建一个 ReplicaSet 时，Kubernetes 自动设置 ReplicaSet 中每个 Pod 的 `ownerReference` 字段值。
在 Kubernetes 1.8 版本，Kubernetes 会自动为某些对象设置 `ownerReference` 的值。
这些对象是由 ReplicationController、ReplicaSet、StatefulSet、DaemonSet、Deployment、
Job 和 CronJob 所创建或管理的。

<!--
You can also specify relationships between owners and dependents by manually
setting the `ownerReference` field.

Here's a configuration file for a ReplicaSet that has three Pods:
-->
你也可以通过手动设置 `ownerReference` 的值，来指定属主和附属之间的关系。

下面的配置文件中包含一个具有 3 个 Pod 的 ReplicaSet：

{{< codenew file="controllers/replicaset.yaml" >}}

<!--
If you create the ReplicaSet and then view the Pod metadata, you can see
OwnerReferences field:
-->
如果你创建该 ReplicaSet，然后查看 Pod 的 metadata 字段，能够看到 OwnerReferences 字段：

```shell
kubectl apply -f https://k8s.io/examples/controllers/replicaset.yaml
kubectl get pods --output=yaml
```

<!--
The output shows that the Pod owner is a ReplicaSet named `my-repset`:
-->
输出显示了 Pod 的属主是名为 my-repset 的 ReplicaSet：

```yaml
apiVersion: v1
kind: Pod
metadata:
  ...
  ownerReferences:
  - apiVersion: apps/v1
    controller: true
    blockOwnerDeletion: true
    kind: ReplicaSet
    name: my-repset
    uid: d9607e19-f88f-11e6-a518-42010a800195
  ...
```

<!--
Cross-namespace owner references are disallowed by design.

Namespaced dependents can specify cluster-scoped or namespaced owners.
A namespaced owner **must** exist in the same namespace as the dependent.
If it does not, the owner reference is treated as absent, and the dependent
is subject to deletion once all owners are verified absent.
-->
{{< note >}}
根据设计，kubernetes 不允许跨名字空间指定属主。

名字空间范围的附属可以指定集群范围的或者名字空间范围的属主。

名字空间范围的属主**必须**和该附属处于相同的名字空间。
如果名字空间范围的属主和附属不在相同的名字空间，那么该属主引用就会被认为是缺失的，
并且当附属的所有属主引用都被确认不再存在之后，该附属就会被删除。

<!--
Cluster-scoped dependents can only specify cluster-scoped owners.
In v1.20+, if a cluster-scoped dependent specifies a namespaced kind as an owner,
it is treated as having an unresolveable owner reference, and is not able to be garbage collected.
-->
集群范围的附属只能指定集群范围的属主。
在 v1.20+ 版本，如果一个集群范围的附属指定了一个名字空间范围类型的属主，
那么该附属就会被认为是拥有一个不可解析的属主引用，并且它不能够被垃圾回收。

<!--
In v1.20+, if the garbage collector detects an invalid cross-namespace `ownerReference`,
or a cluster-scoped dependent with an `ownerReference` referencing a namespaced kind, a warning Event 
with a reason of `OwnerRefInvalidNamespace` and an `involvedObject` of the invalid dependent is reported.
You can check for that kind of Event by running
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`.
-->
在 v1.20+ 版本，如果垃圾收集器检测到无效的跨名字空间的属主引用，
或者一个集群范围的附属指定了一个名字空间范围类型的属主，
那么它就会报告一个警告事件。该事件的原因是 `OwnerRefInvalidNamespace`，
`involvedObject` 属性中包含无效的附属。你可以通过以下命令来获取该类型的事件：

```shell
kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace
```
{{< /note >}}
<!--
## Controlling how the garbage collector deletes dependents

When you delete an object, you can specify whether the object's dependents are
also deleted automatically. Deleting dependents automatically is called *cascading
deletion*.  There are two modes of *cascading deletion*: *background* and *foreground*.

If you delete an object without deleting its dependents
automatically, the dependents are said to be *orphaned*.

-->
## 控制垃圾收集器删除附属

当你删除对象时，可以指定该对象的附属是否也自动删除。
自动删除附属的行为也称为 *级联删除（Cascading Deletion）* 。
Kubernetes 中有两种 *级联删除* 模式：*后台（Background）* 模式和 *前台（Foreground）* 模式。

如果删除对象时，不自动删除它的附属，这些附属被称作 *孤立对象（Orphaned）* 。

<!--
### Foreground cascading deletion

In *foreground cascading deletion*, the root object first
enters a "deletion in progress" state. In the "deletion in progress" state,
the following things are true:

 * The object is still visible via the REST API
 * The object's `deletionTimestamp` is set
 * The object's `metadata.finalizers` contains the value "foregroundDeletion".
-->
### 前台级联删除

在 *前台级联删除* 模式下，根对象首先进入 `deletion in progress` 状态。
在 `deletion in progress` 状态，会有如下的情况：

 * 对象仍然可以通过 REST API 可见。
 * 对象的 `deletionTimestamp` 字段被设置。
 * 对象的 `metadata.finalizers` 字段包含值 `foregroundDeletion`。

<!--
Once the "deletion in progress" state is set, the garbage
collector deletes the object's dependents. Once the garbage collector has deleted all
"blocking" dependents (objects with `ownerReference.blockOwnerDeletion=true`), it deletes
the owner object.
-->
一旦对象被设置为 `deletion in progress` 状态，垃圾收集器会删除对象的所有附属。
垃圾收集器在删除了所有有阻塞能力的附属（对象的 `ownerReference.blockOwnerDeletion=true`）
之后，删除属主对象。

<!--
Note that in the "foregroundDeletion", only dependents with
`ownerReference.blockOwnerDeletion=true` block the deletion of the owner object.
Kubernetes version 1.7 added an [admission controller](/docs/reference/access-authn-authz/admission-controllers/#ownerreferencespermissionenforcement) that controls user access to set
`blockOwnerDeletion` to true based on delete permissions on the owner object, so that
unauthorized dependents cannot delay deletion of an owner object.

If an object's `ownerReferences` field is set by a controller (such as Deployment or ReplicaSet),
blockOwnerDeletion is set automatically and you do not need to manually modify this field.
-->
注意，在 `foregroundDeletion` 模式下，只有设置了 `ownerReference.blockOwnerDeletion`
值的附属才能阻止删除属主对象。
在 Kubernetes 1.7 版本增加了
[准入控制器](/zh/docs/reference/access-authn-authz/admission-controllers/#ownerreferencespermissionenforcement)，
基于属主对象上的删除权限来控制用户设置 `blockOwnerDeletion` 的值为 True，
这样未经授权的附属不能够阻止属主对象的删除。

如果一个对象的 `ownerReferences` 字段被一个控制器（例如 Deployment 或 ReplicaSet）设置，
`blockOwnerDeletion` 也会被自动设置，你不需要手动修改这个字段。

<!--
### Background cascading deletion

In *background cascading deletion*, Kubernetes deletes the owner object
immediately and the garbage collector then deletes the dependents in
the background.
-->
### 后台级联删除

在 *后台级联删除* 模式下，Kubernetes 会立即删除属主对象，之后垃圾收集器
会在后台删除其附属对象。

<!--
### Setting the cascading deletion policy

To control the cascading deletion policy, set the `propagationPolicy`
field on the `deleteOptions` argument when deleting an Object. Possible values include "Orphan",
"Foreground", or "Background".
-->
### 设置级联删除策略

通过为属主对象设置 `deleteOptions.propagationPolicy` 字段，可以控制级联删除策略。
可能的取值包括：`Orphan`、`Foreground` 或者 `Background`。

<!--
Here's an example that deletes dependents in background:
-->
下面是一个在后台删除附属对象的示例：

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \
  -H "Content-Type: application/json"
```

<!--
Here's an example that deletes dependents in foreground:
-->

下面是一个在前台中删除附属对象的示例：

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
  -H "Content-Type: application/json"
```

<!--
Here's an example that orphans dependents:
-->
下面是一个令附属成为孤立对象的示例：

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
  -H "Content-Type: application/json"
```

<!--
kubectl also supports cascading deletion.

To delete dependents in the foreground using kubectl, set `--cascade=foreground`.  To
orphan dependents, set `--cascade=orphan`. 

The default behavior is to delete the dependents in the background which is the
behavior when `--cascade` is omitted or explicitly set to `background`.

Here's an example that orphans the dependents of a ReplicaSet
-->
`kubectl` 命令也支持级联删除。
通过设置 `--cascade=foreground`，可以使用 kubectl 在前台删除附属对象。
设置 `--cascade=orphan`，会使附属对象成为孤立附属对象。
当不指定 `--cascade` 或者明确地指定它的值为 `background` 的时候，
默认的行为是在后台删除附属对象。

下面是一个例子，使一个 ReplicaSet 的附属对象成为孤立附属：

```shell
kubectl delete replicaset my-repset --cascade=orphan
```

<!--
### Additional note on Deployments

Prior to 1.7, When using cascading deletes with Deployments you *must* use `propagationPolicy: Foreground`
to delete not only the ReplicaSets created, but also their Pods. If this type of _propagationPolicy_
is not used, only the ReplicaSets will be deleted, and the Pods will be orphaned.
See [kubeadm/#149](https://github.com/kubernetes/kubeadm/issues/149#issuecomment-284766613) for more information.
-->
### Deployment 的附加说明

在 1.7 之前的版本中，当在 Deployment 中使用级联删除时，你 *必须*使用
`propagationPolicy:Foreground` 模式以便在删除所创建的 ReplicaSet 的同时，还删除其 Pod。
如果不使用这种类型的 `propagationPolicy`，将只删除 ReplicaSet，而 Pod 被孤立。

有关信息请参考 [kubeadm/#149](https://github.com/kubernetes/kubeadm/issues/149#issuecomment-284766613)。

<!--
## Known issues

Tracked at [#26120](https://github.com/kubernetes/kubernetes/issues/26120)
-->
## 已知的问题

跟踪 [#26120](https://github.com/kubernetes/kubernetes/issues/26120)

## {{% heading "whatsnext" %}}

<!--
[Design Doc 1](https://git.k8s.io/community/contributors/design-proposals/api-machinery/garbage-collection.md)

[Design Doc 2](https://git.k8s.io/community/contributors/design-proposals/api-machinery/synchronous-garbage-collection.md)
-->
* [设计文档 1](https://git.k8s.io/community/contributors/design-proposals/api-machinery/garbage-collection.md)
* [设计文档 2](https://git.k8s.io/community/contributors/design-proposals/api-machinery/synchronous-garbage-collection.md)

