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
你可以使用 Finalizers 來控制{{< glossary_tooltip text="對象" term_id="object" >}}的{{<glossary_tooltip text="垃圾回收" term_id="garbage-collection">}}，
方法是在刪除目標資源之前提醒{{<glossary_tooltip text="控制器" term_id="controller">}}執行特定的清理任務。

<!--
Finalizers don't usually specify the code to execute. Instead, they are
typically lists of keys on a specific resource similar to annotations.
Kubernetes specifies some finalizers automatically, but you can also specify
your own.
-->
Finalizers 通常不指定要執行的代碼。
相反，它們通常是特定資源上的鍵的列表，類似於註解。
Kubernetes 自動指定了一些 Finalizers，但你也可以指定你自己的。

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

當你使用清單文件創建資源時，你可以在 `metadata.finalizers` 字段指定 Finalizers。
當你試圖刪除該資源時，處理刪除請求的 API 服務器會注意到 `finalizers` 字段中的值，
並進行以下操作：

* 修改對象，將你開始執行刪除的時間添加到 `metadata.deletionTimestamp` 字段。
* 禁止對象被刪除，直到其 `metadata.finalizers` 字段內的所有項被刪除。
* 返回 `202` 狀態碼（HTTP "Accepted"）。

<!--
The controller managing that finalizer notices the update to the object setting the
`metadata.deletionTimestamp`, indicating deletion of the object has been requested.
The controller then attempts to satisfy the requirements of the finalizers
specified for that resource. Each time a finalizer condition is satisfied, the
controller removes that key from the resource's `finalizers` field. When the
`finalizers` field is emptied, an object with a `deletionTimestamp` field set
is automatically deleted. You can also use finalizers to prevent deletion of unmanaged resources.
-->
管理 finalizer 的控制器注意到對象上發生的更新操作，對象的 `metadata.deletionTimestamp`
被設置，意味着已經請求刪除該對象。然後，控制器會試圖滿足資源的 Finalizers 的條件。
每當一個 Finalizer 的條件被滿足時，控制器就會從資源的 `finalizers` 字段中刪除該鍵。
當 `finalizers` 字段爲空時，`deletionTimestamp` 字段被設置的對象會被自動刪除。
你也可以使用 Finalizers 來阻止刪除未被管理的資源。

<!--
A common example of a finalizer is `kubernetes.io/pv-protection`, which prevents
accidental deletion of `PersistentVolume` objects. When a `PersistentVolume`
object is in use by a Pod, Kubernetes adds the `pv-protection` finalizer. If you
try to delete the `PersistentVolume`, it enters a `Terminating` status, but the
controller can't delete it because the finalizer exists. When the Pod stops
using the `PersistentVolume`, Kubernetes clears the `pv-protection` finalizer,
and the controller deletes the volume.
-->
一個常見的 Finalizer 的例子是 `kubernetes.io/pv-protection`，
它用來防止意外刪除 `PersistentVolume` 對象。
當一個 `PersistentVolume` 對象被 Pod 使用時，
Kubernetes 會添加 `pv-protection` Finalizer。
如果你試圖刪除 `PersistentVolume`，它將進入 `Terminating` 狀態，
但是控制器因爲該 Finalizer 存在而無法刪除該資源。
當 Pod 停止使用 `PersistentVolume` 時，
Kubernetes 清除 `pv-protection` Finalizer，控制器就會刪除該卷。

{{< note >}}
<!--
* When you `DELETE` an object, Kubernetes adds the deletion timestamp for that object and then
immediately starts to restrict changes to the `.metadata.finalizers` field for the object that is
now pending deletion. You can remove existing finalizers (deleting an entry from the `finalizers`
list) but you cannot add a new finalizer. You also cannot modify the `deletionTimestamp` for an
object once it is set.

* After the deletion is requested, you can not resurrect this object. The only way is to delete it and make a new similar object.
-->
* 當你 `DELETE` 一個對象時，Kubernetes 爲該對象添加刪除時間戳，
  然後立即開始限制對這個正處於待刪除狀態的對象的 `.metadata.finalizers` 字段進行修改。
  你可以刪除現有的 finalizers （從 `finalizers` 列表刪除條目），但你不能添加新的 finalizer。
  對象的 `deletionTimestamp` 被設置後也不能修改。

* 刪除請求已被髮出之後，你無法復活該對象。唯一的方法是刪除它並創建一個新的相似對象。
{{< /note >}}

{{< note >}}
<!--
Custom finalizer names **must** be publicly qualified finalizer names, such as `example.com/finalizer-name`.
Kubernetes enforces this format; the API server rejects writes to objects where the change does not use qualified finalizer names for any custom finalizer.
-->
自定義 finalizer 名稱**必須**是公開限定的 finalizer 名稱，例如 `example.com/finalizer-name`。
Kubernetes 強制要求使用此格式；
如果任意自定義 finalizer 在更改時未使用限定的 finalizer 名稱，API 服務器將拒絕寫入到這些對象。
{{< /note >}}

{{<note>}}
<!--
Custom finalizer names **must** be publicly qualified finalizer names, such as `example.com/finalizer-name`.
Kubernetes enforces this format; the API server rejects writes to objects where the change does not use qualified finalizer names for any custom finalizer.
-->
自定義的 finalizer 名稱**必須**是具有公共限定前綴的 finalizer 名稱，
例如 `example.com/finalizer-name`。Kubernetes 強制要求使用這種格式；
如果對象中的更改未使用合規的限定格式，API 服務器將拒絕寫入包含自定義 finalizer 的對象。
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
## 屬主引用、標籤和 Finalizers {#owners-labels-finalizers}

與{{<glossary_tooltip text="標籤" term_id="label">}}類似，
[屬主引用](/zh-cn/docs/concepts/overview/working-with-objects/owners-dependents/)描述了
Kubernetes 中對象之間的關係，但它們作用不同。
當一個{{<glossary_tooltip text="控制器" term_id="controller">}}管理類似於
Pod 的對象時，它使用標籤來跟蹤相關對象組的變化。
例如，當 {{<glossary_tooltip text="Job" term_id="job">}} 創建一個或多個 Pod 時，
Job 控制器會給這些 Pod 應用上標籤，並跟蹤集羣中的具有相同標籤的 Pod 的變化。

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
Job 控制器還爲這些 Pod 添加了“屬主引用”，指向創建 Pod 的 Job。
如果你在這些 Pod 運行的時候刪除了 Job，
Kubernetes 會使用屬主引用（而不是標籤）來確定集羣中哪些 Pod 需要清理。

當 Kubernetes 識別到要刪除的資源上的屬主引用時，它也會處理 Finalizers。

在某些情況下，Finalizers 會阻止依賴對象的刪除，
這可能導致目標屬主對象被保留的時間比預期的長，而沒有被完全刪除。
在這些情況下，你應該檢查目標屬主和附屬對象上的 Finalizers 和屬主引用，來排查原因。

{{< note >}}
<!--
In cases where objects are stuck in a deleting state, avoid manually
removing finalizers to allow deletion to continue. Finalizers are usually added
to resources for a reason, so forcefully removing them can lead to issues in
your cluster. This should only be done when the purpose of the finalizer is
understood and is accomplished in another way (for example, manually cleaning
up some dependent object).
-->
在對象卡在刪除狀態的情況下，要避免手動移除 Finalizers，以允許繼續刪除操作。
Finalizers 通常因爲特殊原因被添加到資源上，所以強行刪除它們會導致集羣出現問題。
只有瞭解 finalizer 的用途時才能這樣做，並且應該通過一些其他方式來完成
（例如，手動清除其餘的依賴對象）。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Read [Using Finalizers to Control Deletion](/blog/2021/05/14/using-finalizers-to-control-deletion/)
  on the Kubernetes blog.
-->
* 在 Kubernetes 博客上閱讀[使用 Finalizers 控制刪除](/blog/2021/05/14/using-finalizers-to-control-deletion/)。
