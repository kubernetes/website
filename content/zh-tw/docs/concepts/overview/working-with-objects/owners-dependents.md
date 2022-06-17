---
title: 屬主與附屬
content_type: concept
weight: 60
---
<!-- 
title: Owners and Dependents
content_type: concept
weight: 60
-->

<!-- overview -->


<!-- 
In Kubernetes, some objects are *owners* of other objects. For example, a
{{<glossary_tooltip text="ReplicaSet" term_id="replica-set">}} is the owner of a set of Pods. These owned objects are *dependents*
of their owner. 
-->

在 Kubernetes 中，一些物件是其他物件的“屬主（Owner）”。
例如，{{<glossary_tooltip text="ReplicaSet" term_id="replica-set">}} 是一組 Pod 的屬主。
具有屬主的物件是屬主的“附屬（Dependent）”。

<!--
Ownership is different from the [labels and selectors](/docs/concepts/overview/working-with-objects/labels/)
mechanism that some resources also use. For example, consider a Service that 
creates `EndpointSlice` objects. The Service uses labels to allow the control plane to
determine which `EndpointSlice` objects are used for that Service. In addition
to the labels, each `EndpointSlice` that is managed on behalf of a Service has
an owner reference. Owner references help different parts of Kubernetes avoid
interfering with objects they don’t control. 
-->
屬主關係不同於一些資源使用的[標籤和選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)機制。
例如，有一個建立 `EndpointSlice` 物件的 Service，
該 Service 使用標籤來讓控制平面確定，哪些 `EndpointSlice` 物件屬於該 Service。
除開標籤，每個代表 Service 所管理的 `EndpointSlice` 都有一個屬主引用。
屬主引用避免 Kubernetes 的不同部分干擾到不受它們控制的物件。

<!--
## Owner references in object specifications

Dependent objects have a `metadata.ownerReferences` field that references their
owner object. A valid owner reference consists of the object name and a UID
within the same namespace as the dependent object. Kubernetes sets the value of
this field automatically for objects that are dependents of other objects like
ReplicaSets, DaemonSets, Deployments, Jobs and CronJobs, and ReplicationControllers.
You can also configure these relationships manually by changing the value of
this field. However, you usually don't need to and can allow Kubernetes to
automatically manage the relationships.
-->
## 物件規約中的屬主引用   {#owner-references-in-object-specifications}

附屬物件有一個 `metadata.ownerReferences` 欄位，用於引用其屬主物件。
一個有效的屬主引用，包含與附屬物件同在一個名稱空間下的物件名稱和一個 UID。
Kubernetes 自動為一些物件的附屬資源設定屬主引用的值，
這些物件包含 ReplicaSet、DaemonSet、Deployment、Job、CronJob、ReplicationController 等。
你也可以透過改變這個欄位的值，來手動配置這些關係。
然而，通常不需要這麼做，你可以讓 Kubernetes 自動管理附屬關係。

<!--
Dependent objects also have an `ownerReferences.blockOwnerDeletion` field that
takes a boolean value and controls whether specific dependents can block garbage
collection from deleting their owner object. Kubernetes automatically sets this
field to `true` if a {{<glossary_tooltip text="controller" term_id="controller">}} 
(for example, the Deployment controller) sets the value of the
`metadata.ownerReferences` field. You can also set the value of the
`blockOwnerDeletion` field manually to control which dependents block garbage
collection.

A Kubernetes admission controller controls user access to change this field for
dependent resources, based on the delete permissions of the owner. This control
prevents unauthorized users from delaying owner object deletion.
-->
附屬物件還有一個 `ownerReferences.blockOwnerDeletion` 欄位，該欄位使用布林值，
用於控制特定的附屬物件是否可以阻止垃圾收集刪除其屬主物件。
如果{{<glossary_tooltip text="控制器" term_id="controller">}}（例如 Deployment 控制器）
設定了 `metadata.ownerReferences` 欄位的值，Kubernetes 會自動設定
`blockOwnerDeletion` 的值為 `true`。
你也可以手動設定 `blockOwnerDeletion` 欄位的值，以控制哪些附屬物件會阻止垃圾收集。

{{< note >}}
<!--
Cross-namespace owner references are disallowed by design.
Namespaced dependents can specify cluster-scoped or namespaced owners.
A namespaced owner **must** exist in the same namespace as the dependent.
If it does not, the owner reference is treated as absent, and the dependent
is subject to deletion once all owners are verified absent.

Cluster-scoped dependents can only specify cluster-scoped owners.
In v1.20+, if a cluster-scoped dependent specifies a namespaced kind as an owner,
it is treated as having an unresolvable owner reference, and is not able to be garbage collected.

In v1.20+, if the garbage collector detects an invalid cross-namespace `ownerReference`,
or a cluster-scoped dependent with an `ownerReference` referencing a namespaced kind, a warning Event 
with a reason of `OwnerRefInvalidNamespace` and an `involvedObject` of the invalid dependent is reported.
You can check for that kind of Event by running
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`.
-->
根據設計，kubernetes 不允許跨名字空間指定屬主。
名字空間範圍的附屬可以指定叢集範圍的或者名字空間範圍的屬主。
名字空間範圍的屬主**必須**和該附屬處於相同的名字空間。
如果名字空間範圍的屬主和附屬不在相同的名字空間，那麼該屬主引用就會被認為是缺失的，
並且當附屬的所有屬主引用都被確認不再存在之後，該附屬就會被刪除。

叢集範圍的附屬只能指定叢集範圍的屬主。
在 v1.20+ 版本，如果一個叢集範圍的附屬指定了一個名字空間範圍型別的屬主，
那麼該附屬就會被認為是擁有一個不可解析的屬主引用，並且它不能夠被垃圾回收。

在 v1.20+ 版本，如果垃圾收集器檢測到無效的跨名字空間的屬主引用，
或者一個叢集範圍的附屬指定了一個名字空間範圍型別的屬主，
那麼它就會報告一個警告事件。該事件的原因是 `OwnerRefInvalidNamespace`，
`involvedObject` 屬性中包含無效的附屬。
你可以執行 `kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace` 
來獲取該型別的事件。
{{< /note >}}

<!--
## Ownership and finalizers

When you tell Kubernetes to delete a resource, the API server allows the
managing controller to process any [finalizer rules](/docs/concepts/overview/working-with-objects/finalizers/)
for the resource. {{<glossary_tooltip text="Finalizers" term_id="finalizer">}}
prevent accidental deletion of resources your cluster may still need to function
correctly. For example, if you try to delete a `PersistentVolume` that is still
in use by a Pod, the deletion does not happen immediately because the
`PersistentVolume` has the `kubernetes.io/pv-protection` finalizer on it.
Instead, the volume remains in the `Terminating` status until Kubernetes clears
the finalizer, which only happens after the `PersistentVolume` is no longer
bound to a Pod. 
-->
## 屬主關係與 Finalizer   {#ownership-and-finalizers}

當你告訴 Kubernetes 刪除一個資源，API 伺服器允許管理控制器處理該資源的任何 
[Finalizer 規則](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)。
{{<glossary_tooltip text="Finalizer" term_id="finalizer">}} 
防止意外刪除你的叢集所依賴的、用於正常運作的資源。
例如，如果你試圖刪除一個仍被 Pod 使用的 `PersistentVolume`，該資源不會被立即刪除，
因為 `PersistentVolume` 有 `kubernetes.io/pv-protection` Finalizer。
相反，它將進入 `Terminating` 狀態，直到 Kubernetes 清除這個 Finalizer，
而這種情況只會發生在 `PersistentVolume` 不再被掛載到 Pod 上時。

<!--
Kubernetes also adds finalizers to an owner resource when you use either
[foreground or orphan cascading deletion](/docs/concepts/architecture/garbage-collection/#cascading-deletion).
In foreground deletion, it adds the `foreground` finalizer so that the
controller must delete dependent resources that also have
`ownerReferences.blockOwnerDeletion=true` before it deletes the owner. If you
specify an orphan deletion policy, Kubernetes adds the `orphan` finalizer so
that the controller ignores dependent resources after it deletes the owner
object. 
-->
當你使用[前臺或孤立級聯刪除](/zh-cn/docs/concepts/architecture/garbage-collection/#cascading-deletion)時，
Kubernetes 也會向屬主資源新增 Finalizer。
在前臺刪除中，會新增 `foreground` Finalizer，這樣控制器必須在刪除了擁有 
`ownerReferences.blockOwnerDeletion=true` 的附屬資源後，才能刪除屬主物件。
如果你指定了孤立刪除策略，Kubernetes 會新增 `orphan` Finalizer，
這樣控制器在刪除屬主物件後，會忽略附屬資源。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Kubernetes finalizers](/docs/concepts/overview/working-with-objects/finalizers/).
* Learn about [garbage collection](/docs/concepts/architecture/garbage-collection).
* Read the API reference for [object metadata](/docs/reference/kubernetes-api/common-definitions/object-meta/#System).
-->
* 瞭解更多關於 [Kubernetes Finalizer](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)。
* 瞭解關於[垃圾收集](/zh-cn/docs/concepts/architecture/garbage-collection)。
* 閱讀[物件元資料](/docs/reference/kubernetes-api/common-definitions/object-meta/#System)的 API 參考文件。
