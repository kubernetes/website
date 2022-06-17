---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ObjectMeta"
content_type: "api_reference"
description: "ObjectMeta 是所有持久化資源必須具有的元資料，其中包括使用者必須建立的所有物件。"
title: "ObjectMeta"
weight: 7
auto_generated: true
---

<!-- 
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ObjectMeta"
content_type: "api_reference"
description: "ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create."
title: "ObjectMeta"
weight: 7
auto_generated: true
-->

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->



`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


<!-- 
ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create.
-->
ObjectMeta 是所有持久化資源必須具有的元資料，其中包括使用者必須建立的所有物件。

<hr>

- **name** (string)

  <!-- 
  Name must be unique within a namespace. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/identifiers#names
  -->
  name 在名稱空間內必須是唯一的。建立資源時需要，儘管某些資源可能允許客戶端請求自動地生成適當的名稱。
  名稱主要用於建立冪等性和配置定義。無法更新。
  更多資訊： http://kubernetes.io/docs/user-guide/identifiers#names


- **generateName** (string)

  <!-- 
  GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server.
  -->
  generateName 是一個可選字首，由伺服器使用，**僅在**未提供 name 欄位時生成唯一名稱。
  如果使用此欄位，則返回給客戶端的名稱將與傳遞的名稱不同。該值還將與唯一的字尾組合。
  提供的值與 name 欄位具有相同的驗證規則，並且可能會根據所需的字尾長度被截斷，以使該值在伺服器上唯一。
  
  <!-- 
  If this field is specified and the generated name exists, the server will NOT return a 409 - instead, it will either return 201 Created or 500 with Reason ServerTimeout indicating a unique name could not be found in the time allotted, and the client should retry (optionally after the time indicated in the Retry-After header).
  
  Applied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency
  -->
  如果指定了此欄位並且生成的名稱存在，則伺服器將不會返回 409 ——相反，它將返回 201 Created 或 500，
  原因是 ServerTimeout 指示在分配的時間內找不到唯一名稱，客戶端應重試（可選，在 Retry-After 標頭中指定的時間之後）。
  
  僅在未指定 name 時應用。更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency

- **namespace** (string)

  <!-- 
  Namespace defines the space within which each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation. Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.
  
  Must be a DNS_LABEL. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/namespaces
  -->
  namespace 定義了一個值空間，其中每個名稱必須唯一。空名稱空間相當於 “default” 名稱空間，但 “default” 是規範表示。
  並非所有物件都需要限定在名稱空間中——這些物件的此欄位的值將為空。
  
  必須是 DNS_LABEL。無法更新。更多資訊： http://kubernetes.io/docs/user-guide/namespaces

- **labels** (map[string]string)

  <!-- 
  Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services. More info: http://kubernetes.io/docs/user-guide/labels
  -->
  可用於組織和分類（確定範圍和選擇）物件的字串鍵和值的對映。
  可以匹配 ReplicationControllers 和 Service 的選擇器。更多資訊： http://kubernetes.io/docs/user-guide/labels

- **annotations** (map[string]string)

  <!-- 
  Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: http://kubernetes.io/docs/user-guide/annotations
  -->
  annotations 是一個非結構化的鍵值對映，儲存在資源中，可以由外部工具設定以儲存和檢索任意元資料。
  它們不可查詢，在修改物件時應保留。更多資訊： http://kubernetes.io/docs/user-guide/annotations


<!-- ### System {#System} -->
### 系統欄位 {#System}


- **finalizers** ([]string)

  <!-- 
  Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. Finalizers may be processed and removed in any order.  Order is NOT enforced because it introduces significant risk of stuck finalizers. finalizers is a shared field, any actor with permission can reorder it. If the finalizer list is processed in order, then this can lead to a situation in which the component responsible for the first finalizer in the list is waiting for a signal (field value, external system, or other) produced by a component responsible for a finalizer later in the list, resulting in a deadlock. Without enforced ordering finalizers are free to order amongst themselves and are not vulnerable to ordering changes in the list.
  -->
  在從登錄檔中刪除物件之前該欄位必須為空。
  每個條目都是負責的元件的識別符號，各元件將從列表中刪除自己對應的條目。
  如果物件的 deletionTimestamp 非空，則只能刪除此列表中的條目。
  終結器可以按任何順序處理和刪除。**沒有**按照順序執行，
  因為它引入了終結器卡住的重大風險。finalizers 是一個共享欄位，
  任何有許可權的參與者都可以對其進行重新排序。如果按順序處理終結器列表，
  那麼這可能導致列表中第一個負責終結器的元件正在等待列表中靠後負責終結器的元件產生的訊號（欄位值、外部系統或其他），
  從而導致死鎖。在沒有強制排序的情況下，終結者可以在它們之間自由排序，
  並且不容易受到列表中排序更改的影響。

- **managedFields** ([]ManagedFieldsEntry)

  <!-- 
  ManagedFields maps workflow-id and version to the set of fields that are managed by that workflow. This is mostly for internal housekeeping, and users typically shouldn't need to set or understand this field. A workflow can be the user's name, a controller's name, or the name of a specific apply path like "ci-cd". The set of fields is always in the version that the workflow used when modifying the object.
  -->
  managedFields 將 workflow-id 和版本對映到由該工作流管理的欄位集。
  這主要用於內部管理，使用者通常不需要設定或理解該欄位。
  工作流可以是使用者名稱、控制器名或特定應用路徑的名稱，如 “ci-cd”。
  欄位集始終存在於修改物件時工作流使用的版本。

  <a name="ManagedFieldsEntry"></a>
  <!-- 
  *ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to.*
  -->
  ManagedFieldsEntry 是一個 workflow-id，一個 FieldSet，也是該欄位集適用的資源的組版本。

  - **managedFields.apiVersion** (string)

    <!-- 
    APIVersion defines the version of this resource that this field set applies to. The format is "group/version" just like the top-level APIVersion field. It is necessary to track the version of a field set because it cannot be automatically converted.
    -->
    apiVersion 定義此欄位集適用的資源的版本。
    格式是 “group/version”，就像頂級 apiVersion 欄位一樣。
    必須跟蹤欄位集的版本，因為它不能自動轉換。

  - **managedFields.fieldsType** (string)

    <!-- 
    FieldsType is the discriminator for the different fields format and version. There is currently only one possible value: "FieldsV1"
    -->
    FieldsType 是不同欄位格式和版本的鑑別器。
    目前只有一個可能的值：“FieldsV1”

  - **managedFields.fieldsV1** (FieldsV1)

    <!-- FieldsV1 holds the first JSON version format as described in the "FieldsV1" type. -->
    FieldsV1 包含型別 “FieldsV1” 中描述的第一個 JSON 版本格式。

    <a name="FieldsV1"></a>
    <!--
    *FieldsV1 stores a set of fields in a data structure like a Trie, in JSON format.
    
    Each key is either a '.' representing the field itself, and will always map to an empty set,
    or a string representing a sub-field or item. The string will follow one of these four formats:
    'f:<name>', where <name> is the name of a field in a struct, or key in a map
    'v:<value>', where <value> is the exact json formatted value of a list item
    'i:<index>', where <index> is position of a item in a list
    'k:<keys>', where <keys> is a map of  a list item's key fields to their unique values
    If a key maps to an empty Fields value, the field that key represents is part of the set.
    
    The exact format is defined in sigs.k8s.io/structured-merge-diff*
    -->
    FieldsV1 以 JSON 格式將一組欄位儲存在像 Trie 這樣的資料結構中。
    
    每個鍵或是 `.` 表示欄位本身，並且始終對映到一個空集，
    或是一個表示子欄位或元素的字串。該字串將遵循以下四種格式之一：
    1. `f:<name>`，其中 `<name>` 是結構中欄位的名稱，或對映中的鍵
    2. `v:<value>`，其中 `<value>` 是列表項的精確 json 格式值
    3. `i:<index>`，其中 `<index>` 是列表中專案的位置
    4. `k:<keys>`，其中 `<keys>` 是列表項的關鍵欄位到其唯一值的對映
    如果一個鍵對映到一個空的 Fields 值，則該鍵表示的欄位是集合的一部分。
    
    確切的格式在 sigs.k8s.io/structured-merge-diff 中定義。

  - **managedFields.manager** (string)

    <!-- Manager is an identifier of the workflow managing these fields. -->
    manager 是管理這些欄位的工作流的識別符號。

  - **managedFields.operation** (string)

    <!-- 
    Operation is the type of operation which lead to this ManagedFieldsEntry being created. The only valid values for this field are 'Apply' and 'Update'.
    -->
    operation 是導致建立此 managedFields 表項的操作型別。
    此欄位的僅有合法值是 “Apply” 和 “Update”。

  - **managedFields.subresource** (string)

    <!-- 
    Subresource is the name of the subresource used to update that object, or empty string if the object was updated through the main resource. The value of this field is used to distinguish between managers, even if they share the same name. For example, a status update will be distinct from a regular update using the same manager name. Note that the APIVersion field is not related to the Subresource field and it always corresponds to the version of the main resource.
    -->
    subresource 是用於更新該物件的子資源的名稱，如果物件是透過主資源更新的，則為空字串。
    該欄位的值用於區分管理者，即使他們共享相同的名稱。例如，狀態更新將不同於使用相同管理者名稱的常規更新。
    請注意，apiVersion 欄位與 subresource 欄位無關，它始終對應於主資源的版本。

  - **managedFields.time** (Time)

    <!-- 
    Time is timestamp of when these fields were set. It should always be empty if Operation is 'Apply'
    -->
    time 是設定這些欄位的時間戳。如果 operation 為 “Apply”，則它應始終為空

    <a name="Time"></a>
    <!-- 
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->
    time 是 time.Time 的包裝類，支援正確地序列化為 YAML 和 JSON。
    為 time 包提供的許多工廠方法提供了包裝類。


- **ownerReferences** ([]OwnerReference)

  <!-- 
  *Patch strategy: merge on key `uid`*
  
  List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller.
  -->
  補丁策略：在鍵 `uid` 上執行合併操作

  此物件所依賴的物件列表。如果列表中的所有物件都已被刪除，則該物件將被垃圾回收。
  如果此物件由控制器管理，則此列表中的條目將指向此控制器，controller 欄位設定為 true。
  管理控制器不能超過一個。


  <a name="OwnerReference"></a>
  <!-- 
  *OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field.*
  -->
  OwnerReference 包含足夠可以讓你識別擁有物件的資訊。
  擁有物件必須與依賴物件位於同一名稱空間中，或者是叢集作用域的，因此沒有名稱空間欄位。

  - **ownerReferences.apiVersion** (string)，<!-- required -->必選
    <!-- API version of the referent. -->
    被引用資源的 API 版本。

  - **ownerReferences.kind** (string)，<!-- required -->必選

    <!-- Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds -->
    被引用資源的類別。更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  - **ownerReferences.name** (string)，<!-- required -->必選

    <!-- Name of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#names -->
    被引用資源的名稱。更多資訊： http://kubernetes.io/docs/user-guide/identifiers#names

  - **ownerReferences.uid** (string)，<!-- required -->必選

    <!-- UID of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#uids -->
    被引用資源的 uid。更多資訊： http://kubernetes.io/docs/user-guide/identifiers#uids

  - **ownerReferences.blockOwnerDeletion** (boolean)

    <!-- 
    If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned.
    -->
    如果為 true，**並且**如果所有者具有 “foregroundDeletion” 終結器，
    則在刪除此引用之前，無法從鍵值儲存中刪除所有者。
    預設為 false。要設定此欄位，使用者需要所有者的 “delete” 許可權，
    否則將返回 422 (Unprocessable Entity)。

  - **ownerReferences.controller** (boolean)

    <!-- If true, this reference points to the managing controller. -->
    如果為 true，則此引用指向管理的控制器。

<!-- ### Read-only {#Read-only} -->
### 只讀欄位 {#Read-only}


- **creationTimestamp** (Time)

  <!-- 
  CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.
  
  Populated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  creationTimestamp 是一個時間戳，表示建立此物件時的伺服器時間。
  不能保證在單獨的操作中按發生前的順序設定。
  客戶端不得設定此值。它以 RFC3339 形式表示，並採用 UTC。
  
  由系統填充。只讀。列表為空。更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  <a name="Time"></a>
  <!-- 
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  time 是 time.Time 的包裝類，支援正確地序列化為 YAML 和 JSON。
  為 time 包提供的許多工廠方法提供了包裝類。

- **deletionGracePeriodSeconds** (int64)

  <!-- 
  Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only.
  -->
  此物件從系統中刪除之前允許正常終止的秒數。
  僅當設定了 deletionTimestamp 時才設定。
  只能縮短。只讀。

- **deletionTimestamp** (Time)

  <!-- 
  DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested.
  
  Populated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  deletionTimestamp 是刪除此資源的 RFC 3339 日期和時間。
  該欄位在使用者請求優雅刪除時由伺服器設定，客戶端不能直接設定。
  一旦 finalizers 列表為空，該資源預計將在此欄位中的時間之後被刪除
  （不再從資源列表中可見，並且無法透過名稱訪問）。
  只要 finalizers 列表包含專案，就阻止刪除。一旦設定了 deletionTimestamp，
  該值可能不會被取消設定或在未來進一步設定，儘管它可能會縮短或在此時間之前可能會刪除資源。
  例如，使用者可能要求在 30 秒內刪除一個 Pod。
  Kubelet 將透過向 Pod 中的容器傳送優雅的終止訊號來做出反應。
  30 秒後，Kubelet 將向容器傳送硬終止訊號（SIGKILL），
  並在清理後從 API 中刪除 Pod。在網路存在分割槽的情況下，
  此物件可能在此時間戳之後仍然存在，直到管理員或自動化程序可以確定資源已完全終止。
  如果未設定，則未請求優雅刪除該物件。
  
  請求優雅刪除時由系統填充。只讀。更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  <a name="Time"></a>
  <!-- 
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  “Time 是 time.Time 的包裝類，支援正確地序列化為 YAML 和 JSON。
  為 time 包提供的許多工廠方法提供了包裝類。”

- **generation** (int64)

  <!-- 
  A sequence number representing a specific generation of the desired state. Populated by the system. Read-only.
  -->
  表示期望狀態的特定生成的序列號。由系統填充。只讀。

- **resourceVersion** (string)

  <!-- 
  An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed. May be used for optimistic concurrency, change detection, and the watch operation on a resource or set of resources. Clients must treat these values as opaque and passed unmodified back to the server. They may only be valid for a particular resource or set of resources.
  
  Populated by the system. Read-only. Value must be treated as opaque by clients and . More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
  -->
  一個不透明的值，表示此物件的內部版本，客戶端可以使用該值來確定物件是否已被更改。
  可用於樂觀併發、變更檢測以及對資源或資源集的監聽操作。
  客戶端必須將這些值視為不透明的，且未更改地傳回伺服器。
  它們可能僅對特定資源或一組資源有效。
  
  由系統填充。只讀。客戶端必須將值視為不透明。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **selfLink** (string)

  <!-- 
  SelfLink is a URL representing this object. Populated by the system. Read-only.
  
  DEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release.
  -->
  selfLink 是表示此物件的 URL。由系統填充。只讀。
  
  **已棄用**。Kubernetes 將在 1.20 版本中停止傳播該欄位，並計劃在 1.21 版本中刪除該欄位。

- **uid** (string)

  <!-- 
  UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations.
  
  Populated by the system. Read-only. More info: http://kubernetes.io/docs/user-guide/identifiers#uids
  -->
  UID 是該物件在時間和空間上的唯一值。它通常由伺服器在成功建立資源時生成，並且不允許使用 PUT 操作更改。
  
  由系統填充。只讀。更多資訊： http://kubernetes.io/docs/user-guide/identifiers#uids

<!-- ### Ignored {#Ignored} -->
### 忽略欄位 {#Ignored}


- **clusterName** (string)

  <!-- 
  Deprecated: ClusterName is a legacy field that was always cleared by the system and never used; it will be removed completely in 1.25.
  The name in the go struct is changed to help clients detect accidental use.
  -->
  已棄用：clusterName 是一個總是被系統清除並且從未使用過的遺留欄位；它將在 1.25 中完全刪除。
  go 結構體中的對應欄位名稱已更改，以幫助客戶端檢測意外使用。



