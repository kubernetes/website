---
title: Finalizers
content_type: concept
weight: 60
---

<!-- overview -->

{{<glossary_definition term_id="finalizer" length="long">}}

<!--
You can use finalizers to control {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}}
of resources by alerting {{<glossary_tooltip text="controllers" term_id="controller">}} to perform specific cleanup tasks before
deleting the target resource. 
-->
你可以透過使用 Finalizers 提醒{{<glossary_tooltip text="控制器" term_id="controller">}}
在刪除目標資源前執行特定的清理任務，
來控制資源的{{<glossary_tooltip text="垃圾收集" term_id="garbage-collection">}}。

<!--
Finalizers don't usually specify the code to execute. Instead, they are
typically lists of keys on a specific resource similar to annotations.
Kubernetes specifies some finalizers automatically, but you can also specify
your own.
-->
Finalizers 通常不指定要執行的程式碼。
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
  * Returns a `202` status code (HTTP "Accepted")
-->
## Finalizers 如何工作   {#how-finalizers-work}

當你使用清單檔案建立資源時，你可以在 `metadata.finalizers` 欄位指定 Finalizers。
當你試圖刪除該資源時，處理刪除請求的 API 伺服器會注意到 `finalizers` 欄位中的值，
並進行以下操作：

  * 修改物件，將你開始執行刪除的時間新增到 `metadata.deletionTimestamp` 欄位。
  * 禁止物件被刪除，直到其 `metadata.finalizers` 欄位為空。
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
管理 finalizer 的控制器注意到物件上發生的更新操作，物件的 `metadata.deletionTimestamp`
被設定，意味著已經請求刪除該物件。然後，控制器會試圖滿足資源的 Finalizers 的條件。
每當一個 Finalizer 的條件被滿足時，控制器就會從資源的 `finalizers` 欄位中刪除該鍵。
當 `finalizers` 欄位為空時，`deletionTimestamp` 欄位被設定的物件會被自動刪除。
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
它用來防止意外刪除 `PersistentVolume` 物件。
當一個 `PersistentVolume` 物件被 Pod 使用時，
Kubernetes 會新增 `pv-protection` Finalizer。
如果你試圖刪除 `PersistentVolume`，它將進入 `Terminating` 狀態，
但是控制器因為該 Finalizer 存在而無法刪除該資源。
當 Pod 停止使用 `PersistentVolume` 時，
Kubernetes 清除 `pv-protection` Finalizer，控制器就會刪除該卷。

<!--
## Owner references, labels, and finalizers {#owners-labels-finalizers}

Like {{<glossary_tooltip text="labels" term_id="label">}},
[owner references](/concepts/overview/working-with-objects/owners-dependents/)
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
[屬主引用](/zh-cn/concepts/overview/working-with-objects/owners-dependents/)
描述了 Kubernetes 中物件之間的關係，但它們作用不同。
當一個{{<glossary_tooltip text="控制器" term_id="controller">}}
管理類似於 Pod 的物件時，它使用標籤來跟蹤相關物件組的變化。
例如，當 {{<glossary_tooltip text="Job" term_id="job">}} 建立一個或多個 Pod 時，
Job 控制器會給這些 Pod 應用上標籤，並跟蹤叢集中的具有相同標籤的 Pod 的變化。

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
Job 控制器還為這些 Pod 添加了“屬主引用”，指向建立 Pod 的 Job。
如果你在這些 Pod 執行的時候刪除了 Job，
Kubernetes 會使用屬主引用（而不是標籤）來確定叢集中哪些 Pod 需要清理。

當 Kubernetes 識別到要刪除的資源上的屬主引用時，它也會處理 Finalizers。

在某些情況下，Finalizers 會阻止依賴物件的刪除，
這可能導致目標屬主物件被保留的時間比預期的長，而沒有被完全刪除。
在這些情況下，你應該檢查目標屬主和附屬物件上的 Finalizers 和屬主引用，來排查原因。

{{< note >}}
<!--
In cases where objects are stuck in a deleting state, avoid manually
removing finalizers to allow deletion to continue. Finalizers are usually added
to resources for a reason, so forcefully removing them can lead to issues in
your cluster. This should only be done when the purpose of the finalizer is
understood and is accomplished in another way (for example, manually cleaning
up some dependent object).

-->
在物件卡在刪除狀態的情況下，要避免手動移除 Finalizers，以允許繼續刪除操作。
Finalizers 通常因為特殊原因被新增到資源上，所以強行刪除它們會導致叢集出現問題。
只有瞭解 finalizer 的用途時才能這樣做，並且應該透過一些其他方式來完成
（例如，手動清除其餘的依賴物件）。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Read [Using Finalizers to Control Deletion](/blog/2021/05/14/using-finalizers-to-control-deletion/)
  on the Kubernetes blog.
-->
* 在 Kubernetes 部落格上閱讀[使用 Finalizers 控制刪除](/blog/2021/05/14/using-finalizers-to-control-deletion/)。

