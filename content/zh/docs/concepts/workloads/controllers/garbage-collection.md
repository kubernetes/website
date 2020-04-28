---
title: 垃圾收集
content_template: templates/concept
weight: 60
---

<!--
---
title: Garbage Collection
content_template: templates/concept
weight: 60
---
-->

{{% capture overview %}}

<!--
The role of the Kubernetes garbage collector is to delete certain objects
that once had an owner, but no longer have an owner.
-->

Kubernetes 垃圾收集器的作用是删除某些曾经拥有所有者（owner）但现在不再拥有所有者的对象。

{{% /capture %}}


{{% capture body %}}

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

You can also specify relationships between owners and dependents by manually
setting the `ownerReference` field.

Here's a configuration file for a ReplicaSet that has three Pods:
-->

## 所有者和附属

某些 Kubernetes 对象是其它一些对象的所有者。例如，一个 ReplicaSet 是一组 Pod 的所有者。
具有所有者的对象被称为是所有者的 *附属* 。
每个附属对象具有一个指向其所属对象的 `metadata.ownerReferences` 字段。

有时，Kubernetes 会自动设置 `ownerReference` 的值。
例如，当创建一个 ReplicaSet 时，Kubernetes 自动设置 ReplicaSet 中每个 Pod 的 `ownerReference` 字段值。
在 Kubernetes 1.8 版本，Kubernetes 会自动为某些对象设置 `ownerReference` 的值，这些对象是由 ReplicationController、ReplicaSet、StatefulSet、DaemonSet、Deployment、Job 和 CronJob 所创建或管理。
也可以通过手动设置 `ownerReference` 的值，来指定所有者和附属之间的关系。

这里有一个配置文件，表示一个具有 3 个 Pod 的 ReplicaSet：

{{< codenew file="controllers/replicaset.yaml" >}}

<!--
If you create the ReplicaSet and then view the Pod metadata, you can see
OwnerReferences field:
-->

如果创建该 ReplicaSet，然后查看 Pod 的 metadata 字段，能够看到 OwnerReferences 字段：

```shell
kubectl apply -f https://k8s.io/examples/controllers/replicaset.yaml
kubectl get pods --output=yaml
```

<!--
The output shows that the Pod owner is a ReplicaSet named `my-repset`:
-->

输出显示了 Pod 的所有者是名为 my-repset 的 ReplicaSet：

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
Cross-namespace owner references are disallowed by design. This means:
1) Namespace-scoped dependents can only specify owners in the same namespace,
and owners that are cluster-scoped.
2) Cluster-scoped dependents can only specify cluster-scoped owners, but not
namespace-scoped owners.
-->
{{< note >}}
根据设计，kubernetes 不允许跨命名空间指定所有者。这意味着：
1）命名空间范围的附属只能在相同的命名空间中指定所有者，并且只能指定集群范围的所有者。
2）集群范围的附属只能指定集群范围的所有者，不能指定命名空间范围的。
{{< /note >}}

<!--
## Controlling how the garbage collector deletes dependents

When you delete an object, you can specify whether the object's dependents are
also deleted automatically. Deleting dependents automatically is called *cascading
deletion*.  There are two modes of *cascading deletion*: *background* and *foreground*.

If you delete an object without deleting its dependents
automatically, the dependents are said to be *orphaned*.

-->
## 控制垃圾收集器删除附属者

当删除对象时，可以指定该对象的附属者是否也自动删除掉。
自动删除 Dependent 也称为 *级联删除* 。
Kubernetes 中有两种 *级联删除* 的模式：*background* 模式和 *foreground* 模式。

如果删除对象时，不自动删除它的附属者，这些附属者被称作是原对象的 *orphaned* 。


<!--
### Foreground cascading deletion
-->
### 显式级联删除

<!--
In *foreground cascading deletion*, the root object first
enters a "deletion in progress" state. In the "deletion in progress" state,
the following things are true:

 * The object is still visible via the REST API
 * The object's `deletionTimestamp` is set
 * The object's `metadata.finalizers` contains the value "foregroundDeletion".
-->
在 *显式级联删除* 模式下，根对象首先进入 `deletion in progress` 状态。在 `deletion in progress` 状态会有如下的情况：

 * 对象仍然可以通过 REST API 可见。
 * 会设置对象的 `deletionTimestamp` 字段。
 * 对象的 `metadata.finalizers` 字段包含了值 `foregroundDeletion`。

<!--
Once the "deletion in progress" state is set, the garbage
collector deletes the object's dependents. Once the garbage collector has deleted all
"blocking" dependents (objects with `ownerReference.blockOwnerDeletion=true`), it deletes
the owner object.
-->
一旦对象被设置为 `deletion in progress` 状态，垃圾收集器会删除对象的所有附属。
垃圾收集器在删除了所有 `Blocking` 状态的附属（对象的 `ownerReference.blockOwnerDeletion=true`）之后，它会删除拥有者对象。

<!--
Note that in the "foregroundDeletion", only dependents with
`ownerReference.blockOwnerDeletion=true` block the deletion of the owner object.
Kubernetes version 1.7 added an [admission controller](/docs/reference/access-authn-authz/admission-controllers/#ownerreferencespermissionenforcement) that controls user access to set
`blockOwnerDeletion` to true based on delete permissions on the owner object, so that
unauthorized dependents cannot delay deletion of an owner object.

If an object's `ownerReferences` field is set by a controller (such as Deployment or ReplicaSet),
blockOwnerDeletion is set automatically and you do not need to manually modify this field.
-->
注意，在 `foregroundDeletion` 模式下，只有设置了 `ownerReference.blockOwnerDeletion` 值的附属者才能阻止删除拥有者对象。
在 Kubernetes 1.7 版本中将增加[准入控制器](/docs/reference/access-authn-authz/admission-controllers/#ownerreferencespermissionenforcement)，基于拥有者对象上的删除权限来控制用户去设置 `blockOwnerDeletion` 的值为 true，所以未授权的附属者不能够延迟拥有者对象的删除。

如果一个对象的 `ownerReferences` 字段被一个 Controller（例如 Deployment 或 ReplicaSet）设置，`blockOwnerDeletion` 会被自动设置，不需要手动修改这个字段。


<!--
### Background cascading deletion

In *background cascading deletion*, Kubernetes deletes the owner object
immediately and the garbage collector then deletes the dependents in
the background.
-->
### 隐式级联删除

在 *隐式级联删除* 模式下，Kubernetes 会立即删除拥有者对象，然后垃圾收集器会在后台删除这些附属值。

<!--
### Setting the cascading deletion policy

To control the cascading deletion policy, set the `propagationPolicy`
field on the `deleteOptions` argument when deleting an Object. Possible values include "Orphan",
"Foreground", or "Background".

Prior to Kubernetes 1.9, the default garbage collection policy for many controller resources was `orphan`.
This included ReplicationController, ReplicaSet, StatefulSet, DaemonSet, and
Deployment. For kinds in the `extensions/v1beta1`, `apps/v1beta1`, and `apps/v1beta2` group versions, unless you 
specify otherwise, dependent objects are orphaned by default. In Kubernetes 1.9, for all kinds in the `apps/v1` 
group version, dependent objects are deleted by default.

-->

### 设置级联删除策略

通过为拥有者对象设置 `deleteOptions.propagationPolicy` 字段，可以控制级联删除策略。
可能的取值包括：`orphan`、`Foreground` 或者 `Background`。

对很多 Controller 资源，包括 ReplicationController、ReplicaSet、StatefulSet、DaemonSet 和 Deployment，默认的垃圾收集策略是 `orphan`。
因此，对于使用 `extensions/v1beta1`、`apps/v1beta1` 和 `apps/v1beta2` 组版本中的 `Kind`,除非指定其它的垃圾收集策略，否则所有附属对象默认使用的都是 `orphan` 策略。

<!--
Here's an example that deletes dependents in background:
-->
下面是一个在 `Background` 中删除 Dependent 对象的示例：

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \
  -H "Content-Type: application/json"
```

<!--
Here's an example that deletes dependents in foreground:
-->

下面是一个在 `Foreground` 中删除附属对象的示例：

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
  -H "Content-Type: application/json"
```

<!--
Here's an example that orphans dependents:
-->

这里是一个 `Orphan` 附属的示例：

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
  -H "Content-Type: application/json"
```

<!--
kubectl also supports cascading deletion.
To delete dependents automatically using kubectl, set `--cascade` to true.  To
orphan dependents, set `--cascade` to false. The default value for `--cascade`
is true.

Here's an example that orphans the dependents of a ReplicaSet:
-->

kubectl 也支持级联删除。
通过设置 `--cascade` 为 `true`，可以使用 kubectl 自动删除附属对象。设置 `--cascade` 为 `false`，会使附属对象成为孤儿附属对象。`--cascade` 的默认值是 true。

下面是一个例子，使一个 ReplicaSet 的附属对象成为孤儿附属：

```shell
kubectl delete replicaset my-repset --cascade=false
```

<!--
### Additional note on Deployments

Prior to 1.7, When using cascading deletes with Deployments you *must* use `propagationPolicy: Foreground`
to delete not only the ReplicaSets created, but also their Pods. If this type of _propagationPolicy_
is not used, only the ReplicaSets will be deleted, and the Pods will be orphaned.
See [kubeadm/#149](https://github.com/kubernetes/kubeadm/issues/149#issuecomment-284766613) for more information.
-->

### Deployment 的其他说明

在 1.7 之前的版本中，当在 Deployment 中使用级联删除时，您必须*使用* `propagationPolicy:Foreground` 模式。这样不仅删除所创建的 ReplicaSet，还删除其 Pod。如果不使用这种类型的 `propagationPolicy`，则将只删除 ReplicaSet，而 Pod 被孤立。

更多信息，请参考 [kubeadm/#149](https://github.com/kubernetes/kubeadm/issues/149#issuecomment-284766613)。

<!--
## Known issues

Tracked at [#26120](https://github.com/kubernetes/kubernetes/issues/26120)
-->

## 已知的问题

跟踪 [#26120](https://github.com/kubernetes/kubernetes/issues/26120)

{{% /capture %}}


{{% capture whatsnext %}}


<!--
[Design Doc 1](https://git.k8s.io/community/contributors/design-proposals/api-machinery/garbage-collection.md)

[Design Doc 2](https://git.k8s.io/community/contributors/design-proposals/api-machinery/synchronous-garbage-collection.md)
-->
[设计文档 1](https://git.k8s.io/community/contributors/design-proposals/api-machinery/garbage-collection.md)

[设计文档 2](https://git.k8s.io/community/contributors/design-proposals/api-machinery/synchronous-garbage-collection.md)

{{% /capture %}}



