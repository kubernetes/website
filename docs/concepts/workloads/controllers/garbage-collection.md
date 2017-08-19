---
title: 垃圾收集
redirect_from:
- "/docs/concepts/abstractions/controllers/garbage-collection/"
- "/docs/concepts/abstractions/controllers/garbage-collection.html"
- "/docs/user-guide/garbage-collection/"
- "/docs/user-guide/garbage-collection.html"

---

{% capture overview %}

<!--
The role of the Kubernetes garbage collector is to delete certain objects
that once had an owner, but no longer have an owner.

**Note**: Garbage collection is a beta feature and is enabled by default in
Kubernetes version 1.4 and later.
-->

Kubernetes 垃圾收集器的角色是删除指定的对象，这些对象曾经有但以后不再拥有 Owner 了。

**注意**：垃圾收集是 beta 特性，在 Kubernetes 1.4 及以上版本默认启用。

{% endcapture %}


{% capture body %}
<!--
## Owners and dependents

Some Kubernetes objects are owners of other objects. For example, a ReplicaSet
is the owner of a set of Pods. The owned objects are called *dependents* of the
owner object. Every dependent object has a `metadata.ownerReferences` field that
points to the owning object.

Sometimes, Kubernetes sets the value of `ownerReference` automatically. For
example, when you create a ReplicaSet, Kubernetes automatically sets the
`ownerReference` field of each Pod in the ReplicaSet. In 1.6, Kubernetes
automatically sets the value of `ownerReference` for objects created or adopted
by ReplicationController, ReplicaSet, StatefulSet, DaemonSet, and Deployment.
-->

## Owner 和 Dependent

一些 Kubernetes 对象是其它一些的 Owner。例如，一个 ReplicaSet 是一组 Pod 的 Owner。具有 Owner 的对象被称为是 Owner 的 *Dependent*。每个 Dependent 对象具有一个指向其所属对象的 `metadata.ownerReferences` 字段。

有时，Kubernetes 会自动设置 `ownerReference` 的值。例如，当创建一个 ReplicaSet 时，Kubernetes 自动设置 ReplicaSet 中每个 Pod 的 `ownerReference` 字段值。在 1.6 版本，Kubernetes 会自动为一些对象设置 `ownerReference` 的值，这些对象是由 ReplicationController、ReplicaSet、StatefulSet、DaemonSet 和 Deployment 所创建或管理。

<!--
You can also specify relationships between owners and dependents by manually
setting the `ownerReference` field.

Here's a configuration file for a ReplicaSet that has three Pods:
-->

也可以通过手动设置 `ownerReference` 的值，来指定 Owner 和 Dependent 之间的关系。

这有一个配置文件，表示一个具有 3 个 Pod 的 ReplicaSet：

{% include code.html language="yaml" file="my-repset.yaml" ghlink="/docs/concepts/workloads/controllers/my-repset.yaml" %}

<!--
If you create the ReplicaSet and then view the Pod metadata, you can see
OwnerReferences field:
-->

如果创建该 ReplicaSet，然后查看 Pod 的 metadata 字段，能够看到 OwnerReferences 字段：

```shell
kubectl create -f https://k8s.io/docs/concepts/abstractions/controllers/my-repset.yaml
kubectl get pods --output=yaml
```

<!--
The output shows that the Pod owner is a ReplicaSet named my-repset:
-->

输出显示了 Pod 的 Owner 是名为 my-repset 的 ReplicaSet：

```shell
apiVersion: v1
kind: Pod
metadata:
  ...
  ownerReferences:
  - apiVersion: extensions/v1beta1
    controller: true
    blockOwnerDeletion: true
    kind: ReplicaSet
    name: my-repset
    uid: d9607e19-f88f-11e6-a518-42010a800195
  ...
```
<!--
## Controlling how the garbage collector deletes dependents

When you delete an object, you can specify whether the object's dependents are
also deleted automatically. Deleting dependents automatically is called *cascading
deletion*.  There are two modes of *cascading deletion*: *background* and *foreground*. 

If you delete an object without deleting its dependents
automatically, the dependents are said to be *orphaned*. 
-->

## 控制垃圾收集器删除 Dependent

当删除对象时，可以指定是否该对象的 Dependent 也自动删除掉。自动删除 Dependent 也称为 *级联删除*。Kubernetes 中有两种 *级联删除* 的模式：*background* 模式和 *foreground* 模式。

如果删除对象时，不自动删除它的 Dependent，这些 Dependent 被称作是原对象的 *孤儿*。

<!--
### Background cascading deletion

In *background cascading deletion*, Kubernetes deletes the owner object 
immediately and the garbage collector then deletes the dependents in 
the background.
-->

### Background 级联删除

在 *background 级联删除* 模式下，Kubernetes 会立即删除 Owner 对象，然后垃圾收集器会在后台删除这些 Dependent。

<!--
### Foreground cascading deletion

In *foreground cascading deletion*, the root object first
enters a "deletion in progress" state. In the "deletion in progress" state,
the following things are true:

 * The object is still visible via the REST API
 * The object's `deletionTimestamp` is set
 * The object's `metadata.finalizers` contains the value "foregroundDeletion".
 
Once the "deletion in progress" state is set, the garbage
collector deletes the object's dependents. Once the garbage collector has deleted all
"blocking" dependents (objects with `ownerReference.blockOwnerDeletion=true`), it delete
the owner object.
-->

### Foreground 级联删除

在 *foreground 级联删除* 模式下，根对象首先进入 “删除中” 状态。在 “删除中” 状态会有如下的情况：

 * 对象仍然可以通过 REST API 可见
 * 会设置对象的 `deletionTimestamp` 字段
 * 对象的 `metadata.finalizers` 字段包含了值 "foregroundDeletion"

 一旦被设置为 “删除中” 状态，垃圾收集器会删除对象的所有 Dependent。垃圾收集器删除了所有 “Blocking” 的 Dependent（对象的 `ownerReference.blockOwnerDeletion=true`）之后，它会删除 Owner 对象。

<!--
Note that in the "foregroundDeletion", only dependents with
`ownerReference.blockOwnerDeletion` block the deletion of the owner object.
Kubernetes version 1.7 will add an admission controller that controls user access to set
`blockOwnerDeletion` to true based on delete permissions on the owner object, so that
unauthorized dependents cannot delay deletion of an owner object. 

If an object's `ownerReferences` field is set by a controller (such as Deployment or ReplicaSet),
blockOwnerDeletion is set automatically and you do not need to manually modify this field.
-->

注意，在 “foreground 删除” 模式下，Dependent 只有通过 `ownerReference.blockOwnerDeletion` 才能阻止删除 Owner 对象。在 Kubernetes 1.7 版本中将增加 admission controller，基于 Owner 对象上的删除权限来控制用户去设置 `blockOwnerDeletion` 的值为 true，所以未授权的 Dependent 不能够延迟 Owner 对象的删除。

如果一个对象的`ownerReferences` 字段被一个 Controller（例如 Deployment 或 ReplicaSet）设置，`blockOwnerDeletion` 会被自动设置，没必要手动修改这个字段。

<!--
### Setting the cascading deletion policy

To control the cascading deletion policy, set the `deleteOptions.propagationPolicy`
field on your owner object. Possible values include "Orphan",
"Foreground", or "Background".

The default garbage collection policy for many controller resources is `orphan`,
including ReplicationController, ReplicaSet, StatefulSet, DaemonSet, and
Deployment. So unless you specify otherwise, dependent objects are orphaned.

Here's an example that deletes dependents in background:
-->

### 设置级联删除策略

通过为 Owner 对象设置 `deleteOptions.propagationPolicy` 字段，可以控制级联删除策略。可能的取值包括：“orphan”、“Foreground” 或 “Background”。

对很多 Controller 资源，包括 ReplicationController、ReplicaSet、StatefulSet、DaemonSet 和 Deployment，默认的垃圾收集策略是 `orphan`。因此，除非指定其它的垃圾收集策略，否则所有 Dependent 对象使用的都是 `orphan` 策略。

下面是一个在后台删除 Dependent 对象的例子：

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset \
-d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \
-H "Content-Type: application/json"
```

<!--
Here's an example that deletes dependents in foreground:
-->

下面是一个在前台删除 Dependent 对象的例子：

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset \
-d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
-H "Content-Type: application/json"
```
<!--
Here's an example that orphans dependents:
-->

下面是一个孤儿 Dependent 的例子：

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/extensions/v1beta1/namespaces/default/replicasets/my-repset \
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
通过设置 `--cascade` 为 true，可以使用 kubectl 自动删除 Dependent 对象。设置 `--cascade` 为 false，会使 Dependent 对象成为孤儿 Dependent 对象。`--cascade` 的默认值是 true。

下面是一个例子，使一个 ReplicaSet 的 Dependent 对象成为孤儿 Dependent：


```shell
kubectl delete replicaset my-repset --cascade=false
```

<!--
## Known issues
* As of 1.7, garbage collection does not yet support
  [custom resources](/docs/concepts/api-extension/custom-resources/),
  such as those added through CustomResourceDefinition or aggregated API servers.

[Other known issues](https://github.com/kubernetes/kubernetes/issues/26120)
-->

## 已知的问题
* 1.7 版本，垃圾收集不支持 [自定义资源](/docs/concepts/api-extension/custom-resources/)，比如那些通过 CustomResourceDefinition 新增，或者通过 API server 聚集而成的资源对象。

[其它已知的问题](https://github.com/kubernetes/kubernetes/issues/26120)

{% endcapture %}


{% capture whatsnext %}

<!--
[Design Doc 1](https://git.k8s.io/community/contributors/design-proposals/garbage-collection.md)

[Design Doc 2](https://git.k8s.io/community/contributors/design-proposals/synchronous-garbage-collection.md)
-->

[设计文档 1](https://git.k8s.io/community/contributors/design-proposals/garbage-collection.md)
[设计文档 2](https://git.k8s.io/community/contributors/design-proposals/synchronous-garbage-collection.md)

{% endcapture %}


{% include templates/concept.md %}
