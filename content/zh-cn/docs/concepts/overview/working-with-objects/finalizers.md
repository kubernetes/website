---
title: Finalizers
content_type: concept
weight: 80
---

<!-- overview -->

{{<glossary_definition term_id="finalizer" length="long">}}

<!--
You can use finalizers to control {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}}
of {{< glossary_tooltip text="objects" term_id="object" >}} by alerting {{<glossary_tooltip text="controllers" term_id="controller">}}
to perform specific cleanup tasks before deleting the target resource.
-->
你可以使用 Finalizers 来控制{{< glossary_tooltip text="对象" term_id="object" >}}的{{<glossary_tooltip text="垃圾回收" term_id="garbage-collection">}}，
方法是在删除目标资源之前提醒{{<glossary_tooltip text="控制器" term_id="controller">}}执行特定的清理任务。

<!--
Finalizers don't usually specify the code to execute. Instead, they are
typically lists of keys on a specific resource similar to annotations.
Kubernetes specifies some finalizers automatically, but you can also specify
your own.
-->
Finalizers 通常不指定要执行的代码。
相反，它们通常是特定资源上的键的列表，类似于注解。
Kubernetes 自动指定了一些 Finalizers，但你也可以指定你自己的。

<!--
## How finalizers work

When you create a resource using a manifest file, you can specify finalizers in
the `metadata.finalizers` field. When you attempt to delete the resource, the
API server handling the delete request notices the values in the `finalizers` field
and does the following: 

  * Modifies the object to add a `metadata.deletionTimestamp` field with the
    time you started the deletion.
  * Prevents the object from being removed until its `metadata.finalizers` field is empty.
  * Prevents the object from being removed until all items are removed from its `metadata.finalizers` field
  * Returns a `202` status code (HTTP "Accepted")
-->
## Finalizers 如何工作   {#how-finalizers-work}

当你使用清单文件创建资源时，你可以在 `metadata.finalizers` 字段指定 Finalizers。
当你试图删除该资源时，处理删除请求的 API 服务器会注意到 `finalizers` 字段中的值，
并进行以下操作：

  * 修改对象，将你开始执行删除的时间添加到 `metadata.deletionTimestamp` 字段。
  * 禁止对象被删除，直到其 `metadata.finalizers` 字段内的所有项被删除。
  * 返回 `202` 状态码（HTTP "Accepted"）。

<!--
The controller managing that finalizer notices the update to the object setting the
`metadata.deletionTimestamp`, indicating deletion of the object has been requested.
The controller then attempts to satisfy the requirements of the finalizers
specified for that resource. Each time a finalizer condition is satisfied, the
controller removes that key from the resource's `finalizers` field. When the
`finalizers` field is emptied, an object with a `deletionTimestamp` field set
is automatically deleted. You can also use finalizers to prevent deletion of unmanaged resources.
-->
管理 finalizer 的控制器注意到对象上发生的更新操作，对象的 `metadata.deletionTimestamp`
被设置，意味着已经请求删除该对象。然后，控制器会试图满足资源的 Finalizers 的条件。
每当一个 Finalizer 的条件被满足时，控制器就会从资源的 `finalizers` 字段中删除该键。
当 `finalizers` 字段为空时，`deletionTimestamp` 字段被设置的对象会被自动删除。
你也可以使用 Finalizers 来阻止删除未被管理的资源。

<!--
A common example of a finalizer is `kubernetes.io/pv-protection`, which prevents
accidental deletion of `PersistentVolume` objects. When a `PersistentVolume`
object is in use by a Pod, Kubernetes adds the `pv-protection` finalizer. If you
try to delete the `PersistentVolume`, it enters a `Terminating` status, but the
controller can't delete it because the finalizer exists. When the Pod stops
using the `PersistentVolume`, Kubernetes clears the `pv-protection` finalizer,
and the controller deletes the volume.
-->
一个常见的 Finalizer 的例子是 `kubernetes.io/pv-protection`，
它用来防止意外删除 `PersistentVolume` 对象。
当一个 `PersistentVolume` 对象被 Pod 使用时，
Kubernetes 会添加 `pv-protection` Finalizer。
如果你试图删除 `PersistentVolume`，它将进入 `Terminating` 状态，
但是控制器因为该 Finalizer 存在而无法删除该资源。
当 Pod 停止使用 `PersistentVolume` 时，
Kubernetes 清除 `pv-protection` Finalizer，控制器就会删除该卷。

{{<note>}}
<!--
* When you `DELETE` an object, Kubernetes adds the deletion timestamp for that object and then
immediately starts to restrict changes to the `.metadata.finalizers` field for the object that is
now pending deletion. You can remove existing finalizers (deleting an entry from the `finalizers`
list) but you cannot add a new finalizer. You also cannot modify the `deletionTimestamp` for an
object once it is set.

* After the deletion is requested, you can not resurrect this object. The only way is to delete it and make a new similar object.
-->
* 当你 `DELETE` 一个对象时，Kubernetes 为该对象增加删除时间戳，然后立即开始限制
对这个正处于待删除状态的对象的 `.metadata.finalizers` 字段进行修改。
你可以删除现有的 finalizers （从 `finalizers` 列表删除条目），但你不能添加新的 finalizer。
对象的 `deletionTimestamp` 被设置后也不能修改。
* 删除请求已被发出之后，你无法复活该对象。唯一的方法是删除它并创建一个新的相似对象。
{{</note>}}

<!--
## Owner references, labels, and finalizers {#owners-labels-finalizers}

Like {{<glossary_tooltip text="labels" term_id="label">}},
[owner references](/docs/concepts/overview/working-with-objects/owners-dependents/)
describe the relationships between objects in Kubernetes, but are used for a
different purpose. When a
{{<glossary_tooltip text="controller" term_id="controller">}} manages objects
like Pods, it uses labels to track changes to groups of related objects. For
example, when a {{<glossary_tooltip text="Job" term_id="job">}} creates one or
more Pods, the Job controller applies labels to those pods and tracks changes to
any Pods in the cluster with the same label.
-->
## 属主引用、标签和 Finalizers {#owners-labels-finalizers}

与{{<glossary_tooltip text="标签" term_id="label">}}类似，
[属主引用](/zh-cn/docs/concepts/overview/working-with-objects/owners-dependents/)
描述了 Kubernetes 中对象之间的关系，但它们作用不同。
当一个{{<glossary_tooltip text="控制器" term_id="controller">}}
管理类似于 Pod 的对象时，它使用标签来跟踪相关对象组的变化。
例如，当 {{<glossary_tooltip text="Job" term_id="job">}} 创建一个或多个 Pod 时，
Job 控制器会给这些 Pod 应用上标签，并跟踪集群中的具有相同标签的 Pod 的变化。

<!--
The Job controller also adds *owner references* to those Pods, pointing at the
Job that created the Pods. If you delete the Job while these Pods are running,
Kubernetes uses the owner references (not labels) to determine which Pods in the
cluster need cleanup.

Kubernetes also processes finalizers when it identifies owner references on a
resource targeted for deletion. 

In some situations, finalizers can block the deletion of dependent objects,
which can cause the targeted owner object to remain for
longer than expected without being fully deleted. In these situations, you
should check finalizers and owner references on the target owner and dependent
objects to troubleshoot the cause. 
-->
Job 控制器还为这些 Pod 添加了“属主引用”，指向创建 Pod 的 Job。
如果你在这些 Pod 运行的时候删除了 Job，
Kubernetes 会使用属主引用（而不是标签）来确定集群中哪些 Pod 需要清理。

当 Kubernetes 识别到要删除的资源上的属主引用时，它也会处理 Finalizers。

在某些情况下，Finalizers 会阻止依赖对象的删除，
这可能导致目标属主对象被保留的时间比预期的长，而没有被完全删除。
在这些情况下，你应该检查目标属主和附属对象上的 Finalizers 和属主引用，来排查原因。

{{< note >}}
<!--
In cases where objects are stuck in a deleting state, avoid manually
removing finalizers to allow deletion to continue. Finalizers are usually added
to resources for a reason, so forcefully removing them can lead to issues in
your cluster. This should only be done when the purpose of the finalizer is
understood and is accomplished in another way (for example, manually cleaning
up some dependent object).

-->
在对象卡在删除状态的情况下，要避免手动移除 Finalizers，以允许继续删除操作。
Finalizers 通常因为特殊原因被添加到资源上，所以强行删除它们会导致集群出现问题。
只有了解 finalizer 的用途时才能这样做，并且应该通过一些其他方式来完成
（例如，手动清除其余的依赖对象）。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Read [Using Finalizers to Control Deletion](/blog/2021/05/14/using-finalizers-to-control-deletion/)
  on the Kubernetes blog.
-->
* 在 Kubernetes 博客上阅读[使用 Finalizers 控制删除](/blog/2021/05/14/using-finalizers-to-control-deletion/)。
