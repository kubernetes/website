---
title: 垃圾收集
content_type: concept
weight: 70
---
<!--
title: Garbage Collection
content_type: concept
weight: 70
-->

<!-- overview -->

<!--
{{<glossary_definition term_id="garbage-collection" length="short">}} This
allows the clean up of resources like the following:
-->
{{<glossary_definition term_id="garbage-collection" length="short">}}
垃圾收集允許系統清理如下資源：

<!--
* [Terminated pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
* [Completed Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/)
* [Objects without owner references](#owners-dependents)
* [Unused containers and container images](#containers-images)
* [Dynamically provisioned PersistentVolumes with a StorageClass reclaim policy of Delete](/docs/concepts/storage/persistent-volumes/#delete)
* [Stale or expired CertificateSigningRequests (CSRs)](/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
* {{<glossary_tooltip text="Nodes" term_id="node">}} deleted in the following scenarios:
  * On a cloud when the cluster uses a [cloud controller manager](/docs/concepts/architecture/cloud-controller/)
  * On-premises when the cluster uses an addon similar to a cloud controller
    manager
* [Node Lease objects](/docs/concepts/architecture/nodes/#heartbeats)
-->
* [終止的 Pod](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
* [已完成的 Job](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)
* [不再存在屬主引用的對象](#owners-dependents)
* [未使用的容器和容器鏡像](#containers-images)
* [動態製備的、StorageClass 回收策略爲 Delete 的 PV 卷](/zh-cn/docs/concepts/storage/persistent-volumes/#delete)
* [阻滯或者過期的 CertificateSigningRequest (CSR)](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
* 在以下情形中刪除了的{{<glossary_tooltip text="節點" term_id="node">}}對象：
  * 當集羣使用[雲控制器管理器](/zh-cn/docs/concepts/architecture/cloud-controller/)運行於雲端時；
  * 當集羣使用類似於雲控制器管理器的插件運行在本地環境中時。
* [節點租約對象](/zh-cn/docs/concepts/architecture/nodes/#heartbeats)

<!--
## Owners and dependents {#owners-dependents}

Many objects in Kubernetes link to each other through [*owner references*](/docs/concepts/overview/working-with-objects/owners-dependents/).
Owner references tell the control plane which objects are dependent on others.
Kubernetes uses owner references to give the control plane, and other API
clients, the opportunity to clean up related resources before deleting an
object. In most cases, Kubernetes manages owner references automatically.
-->
## 屬主與依賴   {#owners-dependents}

Kubernetes 中很多對象通過[**屬主引用**](/zh-cn/docs/concepts/overview/working-with-objects/owners-dependents/)
鏈接到彼此。屬主引用（Owner Reference）可以告訴控制面哪些對象依賴於其他對象。
Kubernetes 使用屬主引用來爲控制面以及其他 API 客戶端在刪除某對象時提供一個清理關聯資源的機會。
在大多數場合，Kubernetes 都是自動管理屬主引用的。

<!--
Ownership is different from the [labels and selectors](/docs/concepts/overview/working-with-objects/labels/)
mechanism that some resources also use. For example, consider a
{{<glossary_tooltip text="Service" term_id="service">}} that creates
`EndpointSlice` objects. The Service uses *labels* to allow the control plane to
determine which `EndpointSlice` objects are used for that Service. In addition
to the labels, each `EndpointSlice` that is managed on behalf of a Service has
an owner reference. Owner references help different parts of Kubernetes avoid
interfering with objects they don’t control.
-->
屬主關係與某些資源所使用的[標籤和選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)不同。
例如，考慮一個創建 `EndpointSlice` 對象的 {{<glossary_tooltip text="Service" term_id="service">}}。
Service 使用**標籤**來允許控制面確定哪些 `EndpointSlice` 對象被該 Service 使用。
除了標籤，每個被 Service 託管的 `EndpointSlice` 對象還有一個屬主引用屬性。
屬主引用可以幫助 Kubernetes 中的不同組件避免干預並非由它們控制的對象。

{{< note >}}
<!--
Cross-namespace owner references are disallowed by design.
Namespaced dependents can specify cluster-scoped or namespaced owners.
A namespaced owner **must** exist in the same namespace as the dependent.
If it does not, the owner reference is treated as absent, and the dependent
is subject to deletion once all owners are verified absent.
-->
根據設計，系統不允許出現跨名字空間的屬主引用。名字空間作用域的依賴對象可以指定集羣作用域或者名字空間作用域的屬主。
名字空間作用域的屬主**必須**存在於依賴對象所在的同一名字空間。
如果屬主位於不同名字空間，則屬主引用被視爲不存在，而當檢查發現所有屬主都已不存在時，依賴對象會被刪除。

<!--
Cluster-scoped dependents can only specify cluster-scoped owners.
In v1.20+, if a cluster-scoped dependent specifies a namespaced kind as an owner,
it is treated as having an unresolvable owner reference, and is not able to be garbage collected.
-->
集羣作用域的依賴對象只能指定集羣作用域的屬主。
在 1.20 及更高版本中，如果一個集羣作用域的依賴對象指定了某個名字空間作用域的類別作爲其屬主，
則該對象被視爲擁有一個無法解析的屬主引用，因而無法被垃圾收集處理。

<!--
In v1.20+, if the garbage collector detects an invalid cross-namespace `ownerReference`,
or a cluster-scoped dependent with an `ownerReference` referencing a namespaced kind, a warning Event
with a reason of `OwnerRefInvalidNamespace` and an `involvedObject` of the invalid dependent is reported.
You can check for that kind of Event by running
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`.
-->
在 1.20 及更高版本中，如果垃圾收集器檢測到非法的跨名字空間 `ownerReference`，
或者某集羣作用域的依賴對象的 `ownerReference` 引用某名字空間作用域的類別，
系統會生成一個警告事件，其原因爲 `OwnerRefInvalidNamespace` 和 `involvedObject`
設置爲非法的依賴對象。你可以通過運行
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`
來檢查是否存在這類事件。
{{< /note >}}

<!--
## Cascading deletion {#cascading-deletion}

Kubernetes checks for and deletes objects that no longer have owner
references, like the pods left behind when you delete a ReplicaSet. When you
delete an object, you can control whether Kubernetes deletes the object's
dependents automatically, in a process called *cascading deletion*. There are
two types of cascading deletion, as follows:

* Foreground cascading deletion
* Background cascading deletion
-->
## 級聯刪除    {#cascading-deletion}

Kubernetes 會檢查並刪除那些不再擁有屬主引用的對象，例如在你刪除了 ReplicaSet
之後留下來的 Pod。當你刪除某個對象時，你可以控制 Kubernetes 是否去自動刪除該對象的依賴對象，
這個過程稱爲**級聯刪除（Cascading Deletion）**。
級聯刪除有兩種類型，分別如下：

* 前臺級聯刪除
* 後臺級聯刪除

<!--
You can also control how and when garbage collection deletes resources that have
owner references using Kubernetes {{<glossary_tooltip text="finalizers" term_id="finalizer">}}.
-->
你也可以使用 Kubernetes {{<glossary_tooltip text="Finalizers" term_id="finalizer">}}
來控制垃圾收集機制如何以及何時刪除包含屬主引用的資源。

<!--
### Foreground cascading deletion {#foreground-deletion}

In foreground cascading deletion, the owner object you're deleting first enters
a *deletion in progress* state. In this state, the following happens to the
owner object:
-->
### 前臺級聯刪除 {#foreground-deletion}

在前臺級聯刪除中，正在被你刪除的屬主對象首先進入 **deletion in progress** 狀態。
在這種狀態下，針對屬主對象會發生以下事情：

<!--
* The Kubernetes API server sets the object's `metadata.deletionTimestamp`
  field to the time the object was marked for deletion.
* The Kubernetes API server also sets the `metadata.finalizers` field to
  `foregroundDeletion`. 
* The object remains visible through the Kubernetes API until the deletion
  process is complete.
-->
* Kubernetes API 服務器將某對象的 `metadata.deletionTimestamp`
  字段設置爲該對象被標記爲要刪除的時間點。
* Kubernetes API 服務器也會將 `metadata.finalizers` 字段設置爲 `foregroundDeletion`。
* 在刪除過程完成之前，通過 Kubernetes API 仍然可以看到該對象。

<!--
After the owner object enters the *deletion in progress* state, the controller
deletes dependents it knows about. After deleting all the dependent objects it knows about,
the controller deletes the owner object. At this point, the object is no longer visible in the
Kubernetes API.

During foreground cascading deletion, the only dependents that block owner
deletion are those that have the `ownerReference.blockOwnerDeletion=true` field
and are in the garbage collection controller cache. The garbage collection controller
cache may not contain objects whose resource type cannot be listed / watched successfully,
or objects that are created concurrent with deletion of an owner object.
See [Use foreground cascading deletion](/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)
to learn more.
-->
當屬主對象進入**刪除進行中**狀態後，控制器會刪除其已知的依賴對象。
在刪除所有已知的依賴對象後，控制器會刪除屬主對象。
這時，通過 Kubernetes API 就無法再看到該對象。

在前臺級聯刪除過程中，唯一會阻止屬主對象被刪除的是那些帶有
`ownerReference.blockOwnerDeletion=true` 字段並且存在於垃圾收集控制器緩存中的依賴對象。
垃圾收集控制器緩存中可能不包含那些無法成功被列舉/監視的資源類型的對象，
或在屬主對象刪除的同時創建的對象。
參閱[使用前臺級聯刪除](/zh-cn/docs/tasks/administer-cluster/use-cascading-deletion/#use-foreground-cascading-deletion)
以瞭解進一步的細節。

<!--
### Background cascading deletion {#background-deletion}

In background cascading deletion, the Kubernetes API server deletes the owner
object immediately and the garbage collector controller (custom or default)
cleans up the dependent objects in the background.
If a finalizer exists, it ensures that objects are not deleted until all necessary clean-up tasks are completed.
By default, Kubernetes uses background cascading deletion unless
you manually use foreground deletion or choose to orphan the dependent objects.

See [Use background cascading deletion](/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)
to learn more.
-->
### 後臺級聯刪除 {#background-deletion}

在後臺級聯刪除過程中，Kubernetes 服務器立即刪除屬主對象，
而垃圾收集控制器（無論是自定義的還是默認的）在後臺清理所有依賴對象。
如果存在 Finalizers，它會確保所有必要的清理任務完成後對象才被刪除。
默認情況下，Kubernetes 使用後臺級聯刪除方案，除非你手動設置了要使用前臺刪除，
或者選擇遺棄依賴對象。

參閱[使用後臺級聯刪除](/zh-cn/docs/tasks/administer-cluster/use-cascading-deletion/#use-background-cascading-deletion)以瞭解進一步的細節。

<!--
### Orphaned dependents

When Kubernetes deletes an owner object, the dependents left behind are called
*orphan* objects. By default, Kubernetes deletes dependent objects. To learn how
to override this behaviour, see [Delete owner objects and orphan dependents](/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy).
-->
### 被遺棄的依賴對象    {#orphaned-dependents}

當 Kubernetes 刪除某個屬主對象時，被留下來的依賴對象被稱作被遺棄的（Orphaned）對象。
默認情況下，Kubernetes 會刪除依賴對象。要了解如何重載這種默認行爲，
可參閱[刪除屬主對象和遺棄依賴對象](/zh-cn/docs/tasks/administer-cluster/use-cascading-deletion/#set-orphan-deletion-policy)。

<!--
## Garbage collection of unused containers and images {#containers-images}

The {{<glossary_tooltip text="kubelet" term_id="kubelet">}} performs garbage
collection on unused images every five minutes and on unused containers every
minute. You should avoid using external garbage collection tools, as these can
break the kubelet behavior and remove containers that should exist.
-->
## 未使用容器和鏡像的垃圾收集     {#containers-images}

{{<glossary_tooltip text="kubelet" term_id="kubelet">}} 會每五分鐘對未使用的鏡像執行一次垃圾收集，
每分鐘對未使用的容器執行一次垃圾收集。
你應該避免使用外部的垃圾收集工具，因爲外部工具可能會破壞 kubelet
的行爲，移除應該保留的容器。

<!--
To configure options for unused container and image garbage collection, tune the
kubelet using a [configuration file](/docs/tasks/administer-cluster/kubelet-config-file/)
and change the parameters related to garbage collection using the
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
resource type.
-->
要配置對未使用容器和鏡像的垃圾收集選項，
可以使用一個[配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)，基於
[`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
資源類型來調整與垃圾收集相關的 kubelet 行爲。

<!--
### Container image lifecycle

Kubernetes manages the lifecycle of all images through its *image manager*,
which is part of the kubelet, with the cooperation of
{{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}}. The kubelet
considers the following disk usage limits when making garbage collection
decisions:
-->
### 容器鏡像生命週期     {#container-image-lifecycle}

Kubernetes 通過其**鏡像管理器（Image Manager）** 來管理所有鏡像的生命週期，
該管理器是 kubelet 的一部分，工作時與
{{< glossary_tooltip text="cadvisor" term_id="cadvisor" >}} 協同。
kubelet 在作出垃圾收集決定時會考慮如下磁盤用量約束：

* `HighThresholdPercent`
* `LowThresholdPercent`

<!--
Disk usage above the configured `HighThresholdPercent` value triggers garbage
collection, which deletes images in order based on the last time they were used,
starting with the oldest first. The kubelet deletes images
until disk usage reaches the `LowThresholdPercent` value.
-->
磁盤用量超出所配置的 `HighThresholdPercent` 值時會觸發垃圾收集，
垃圾收集器會基於鏡像上次被使用的時間來按順序刪除它們，首先刪除的是最近未使用的鏡像。
kubelet 會持續刪除鏡像，直到磁盤用量到達 `LowThresholdPercent` 值爲止。

<!--
#### Garbage collection for unused container images {#image-maximum-age-gc}
-->
#### 未使用容器鏡像的垃圾收集     {#image-maximum-age-gc}

{{< feature-state feature_gate_name="ImageMaximumGCAge" >}}

<!--
As an beta feature, you can specify the maximum time a local image can be unused for,
regardless of disk usage. This is a kubelet setting that you configure for each node.
-->
這是一個 Beta 特性，不論磁盤使用情況如何，你都可以指定本地鏡像未被使用的最長時間。
這是一個可以爲每個節點配置的 kubelet 設置。

<!--
To configure the setting, you need to set a value for the `imageMaximumGCAge`
field in the kubelet configuration file.
-->
要配置該設置，你需要在 kubelet 配置文件中爲 `imageMaximumGCAge`
字段設置一個值。

<!--
The value is specified as a Kubernetes {{< glossary_tooltip text="duration" term_id="duration" >}}; 
See [duration](/docs/reference/glossary/?all=true#term-duration) in the glossary
for more details.
-->
該值應遵循 Kubernetes {{< glossary_tooltip text="持續時間（Duration）" term_id="duration" >}}格式；
有關更多詳細信息，請參閱詞彙表中的[持續時間（Duration）](/zh-cn/docs/reference/glossary/?all=true#term-duration)。

<!--
For example, you can set the configuration field to `12h45m`,
which means 12 hours and 45 minutes.
-->
例如，你可以將配置字段設置爲 `12h45m`，代表 12 小時 45 分鐘。

{{< note >}}
<!--
This feature does not track image usage across kubelet restarts. If the kubelet
is restarted, the tracked image age is reset, causing the kubelet to wait the full
`imageMaximumGCAge` duration before qualifying images for garbage collection
based on image age.
-->
這個特性不會跟蹤 kubelet 重新啓動後的鏡像使用情況。
如果 kubelet 被重新啓動，所跟蹤的鏡像年齡會被重置，
導致 kubelet 在根據鏡像年齡進行垃圾收集時需要等待完整的
`imageMaximumGCAge` 時長。
{{< /note>}}

<!--
### Container garbage collection {#container-image-garbage-collection}

The kubelet garbage collects unused containers based on the following variables,
which you can define:
-->
### 容器垃圾收集    {#container-image-garbage-collection}

kubelet 會基於如下變量對所有未使用的容器執行垃圾收集操作，這些變量都是你可以定義的：

<!--
* `MinAge`: the minimum age at which the kubelet can garbage collect a
  container. Disable by setting to `0`.
* `MaxPerPodContainer`: the maximum number of dead containers each Pod
  can have. Disable by setting to less than `0`.
* `MaxContainers`: the maximum number of dead containers the cluster can have.
  Disable by setting to less than `0`. 
-->
* `MinAge`：kubelet 可以垃圾回收某個容器時該容器的最小年齡。設置爲 `0`
  表示禁止使用此規則。
* `MaxPerPodContainer`：每個 Pod 可以包含的已死亡的容器個數上限。設置爲小於 `0`
  的值表示禁止使用此規則。
* `MaxContainers`：集羣中可以存在的已死亡的容器個數上限。設置爲小於 `0`
  的值意味着禁止應用此規則。

<!--
In addition to these variables, the kubelet garbage collects unidentified and
deleted containers, typically starting with the oldest first.

`MaxPerPodContainer` and `MaxContainers` may potentially conflict with each other
in situations where retaining the maximum number of containers per Pod
(`MaxPerPodContainer`) would go outside the allowable total of global dead
containers (`MaxContainers`). In this situation, the kubelet adjusts
`MaxPerPodContainer` to address the conflict. A worst-case scenario would be to
downgrade `MaxPerPodContainer` to `1` and evict the oldest containers.
Additionally, containers owned by pods that have been deleted are removed once
they are older than `MinAge`.
-->
除以上變量之外，kubelet 還會垃圾收集除無標識的以及已刪除的容器，通常從最長時間未使用的容器開始。

當保持每個 Pod 的最大數量的容器（`MaxPerPodContainer`）會使得全局的已死亡容器個數超出上限
（`MaxContainers`）時，`MaxPerPodContainer` 和 `MaxContainers` 之間可能會出現衝突。
在這種情況下，kubelet 會調整 `MaxPerPodContainer` 來解決這一衝突。
最壞的情形是將 `MaxPerPodContainer` 降格爲 `1`，並驅逐最近未使用的容器。
此外，當隸屬於某已被刪除的 Pod 的容器的年齡超過 `MinAge` 時，它們也會被刪除。

{{<note>}}
<!--
The kubelet only garbage collects the containers it manages.
-->
kubelet 僅會回收由它所管理的容器。
{{</note>}}

<!--
## Configuring garbage collection {#configuring-gc}

You can tune garbage collection of resources by configuring options specific to
the controllers managing those resources. The following pages show you how to
configure garbage collection:

* [Configuring cascading deletion of Kubernetes objects](/docs/tasks/administer-cluster/use-cascading-deletion/)
* [Configuring cleanup of finished Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/)
-->
## 配置垃圾收集     {#configuring-gc}

你可以通過配置特定於管理資源的控制器來調整資源的垃圾收集行爲。
下面的頁面爲你展示如何配置垃圾收集：

* [配置 Kubernetes 對象的級聯刪除](/zh-cn/docs/tasks/administer-cluster/use-cascading-deletion/)
* [配置已完成 Job 的清理](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)

## {{% heading "whatsnext" %}}

<!--
* Learn more about [ownership of Kubernetes objects](/docs/concepts/overview/working-with-objects/owners-dependents/).
* Learn more about Kubernetes [finalizers](/docs/concepts/overview/working-with-objects/finalizers/).
* Learn about the [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) that cleans up finished Jobs.
-->
* 進一步瞭解 [Kubernetes 對象的屬主關係](/zh-cn/docs/concepts/overview/working-with-objects/owners-dependents/)。
* 進一步瞭解 Kubernetes [finalizers](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)。
* 進一步瞭解 [TTL 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)，
  該控制器負責清理已完成的 Job。
