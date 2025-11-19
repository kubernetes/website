---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ObjectMeta"
content_type: "api_reference"
description: "ObjectMeta 是所有持久化資源必須具有的元數據，其中包括用戶必須創建的所有對象。"
title: "ObjectMeta"
weight: 7
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

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

<!-- 
ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create.
-->
ObjectMeta 是所有持久化資源必須具有的元數據，其中包括用戶必須創建的所有對象。

<hr>

- **name** (string)

  <!-- 
  Name must be unique within a namespace. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names
  -->

  name 在命名空間內必須是唯一的。創建資源時需要，儘管某些資源可能允許客戶端請求自動地生成適當的名稱。
  名稱主要用於創建冪等性和配置定義。無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#names

- **generateName** (string)

  <!-- 
  GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server.
  -->

  generateName 是一個可選前綴，由服務器使用，**僅在**未提供 name 字段時生成唯一名稱。
  如果使用此字段，則返回給客戶端的名稱將與傳遞的名稱不同。該值還將與唯一的後綴組合。
  提供的值與 name 字段具有相同的驗證規則，並且可能會根據所需的後綴長度被截斷，以使該值在服務器上唯一。
  
  <!-- 
  If this field is specified and the generated name exists, the server will NOT return a 409 - instead, it will either return 201 Created or 500 with Reason ServerTimeout indicating a unique name could not be found in the time allotted, and the client should retry (optionally after the time indicated in the Retry-After header).
  
  Applied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency
  -->

  如果指定了此字段並且生成的名稱存在，則服務器將不會返回 409。相反，它將返回 201 Created 或 500，
  原因是 ServerTimeout 指示在分配的時間內找不到唯一名稱，客戶端應重試（可選，在 Retry-After 標頭中指定的時間之後）。
  
  僅在未指定 name 時應用。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency

- **namespace** (string)

  <!-- 
  Namespace defines the space within which each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation. Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.
  
  Must be a DNS_LABEL. Cannot be updated. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces
  -->

  namespace 定義了一個值空間，其中每個名稱必須唯一。空命名空間相當於 “default” 命名空間，但 “default” 是規範的表示。
  並非所有對象都需要限定在命名空間中——這些對象的此字段的值將爲空。
  
  必須是 DNS_LABEL。無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces

- **labels** (map[string]string)

  <!-- 
  Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels
  -->

  可用於組織和分類（確定範圍和選擇）對象的字符串鍵和值的映射。
  可以匹配 ReplicationController 和 Service 的選擇算符。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels

- **annotations** (map[string]string)

  <!-- 
  Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations
  -->

  annotations 是一個非結構化的鍵值映射，存儲在資源中，可以由外部工具設置以存儲和檢索任意元數據。
  它們不可查詢，在修改對象時應保留。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/annotations

<!--
### System {#System}
-->
### 系統字段 {#System}

- **finalizers** ([]string)

  <!--
  *Set: unique values will be kept during a merge*
  -->

  **集合：唯一值將在合併期間被保留**

  <!-- 
  Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. Finalizers may be processed and removed in any order.  Order is NOT enforced because it introduces significant risk of stuck finalizers. finalizers is a shared field, any actor with permission can reorder it. If the finalizer list is processed in order, then this can lead to a situation in which the component responsible for the first finalizer in the list is waiting for a signal (field value, external system, or other) produced by a component responsible for a finalizer later in the list, resulting in a deadlock. Without enforced ordering finalizers are free to order amongst themselves and are not vulnerable to ordering changes in the list.
  -->

  在從註冊表中刪除對象之前該字段必須爲空。
  每個條目都是負責的組件的標識符，各組件將從列表中刪除自己對應的條目。
  如果對象的 deletionTimestamp 非空，則只能刪除此列表中的條目。
  終結器可以按任何順序處理和刪除。**沒有**按照順序執行，
  因爲它引入了終結器卡住的重大風險。finalizers 是一個共享字段，
  任何有權限的參與者都可以對其進行重新排序。如果按順序處理終結器列表，
  那麼這可能導致列表中第一個負責終結器的組件正在等待列表中靠後負責終結器的組件產生的信號（字段值、外部系統或其他），
  從而導致死鎖。在沒有強制排序的情況下，終結者可以在它們之間自由排序，
  並且不容易受到列表中排序更改的影響。

- **managedFields** ([]ManagedFieldsEntry)

  <!--
  *Atomic: will be replaced during a merge*
  -->

  **原子性：將在合併期間被替換**

  <!-- 
  ManagedFields maps workflow-id and version to the set of fields that are managed by that workflow. This is mostly for internal housekeeping, and users typically shouldn't need to set or understand this field. A workflow can be the user's name, a controller's name, or the name of a specific apply path like "ci-cd". The set of fields is always in the version that the workflow used when modifying the object.

  <a name="ManagedFieldsEntry"></a>
  *ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to.*
  -->

  managedFields 將 workflow-id 和版本映射到由該工作流管理的字段集。
  這主要用於內部管理，用戶通常不需要設置或理解該字段。
  工作流可以是用戶名、控制器名或特定應用路徑的名稱，如 “ci-cd”。
  字段集始終存在於修改對象時工作流使用的版本。

  <a name="ManagedFieldsEntry"></a>
  **ManagedFieldsEntry 是一個 workflow-id，一個 FieldSet，也是該字段集適用的資源的組版本。**

  - **managedFields.apiVersion** (string)

    <!--
    APIVersion defines the version of this resource that this field set applies to. The format is "group/version" just like the top-level APIVersion field. It is necessary to track the version of a field set because it cannot be automatically converted.
    -->

    apiVersion 定義此字段集適用的資源的版本。
    格式是 “group/version”，就像頂級 apiVersion 字段一樣。
    必須跟蹤字段集的版本，因爲它不能自動轉換。

  - **managedFields.fieldsType** (string)

    <!--
    FieldsType is the discriminator for the different fields format and version. There is currently only one possible value: "FieldsV1"
    -->

    FieldsType 是不同字段格式和版本的鑑別器。
    目前只有一個可能的值：“FieldsV1”

  - **managedFields.fieldsV1** (FieldsV1)

    <!--
    FieldsV1 holds the first JSON version format as described in the "FieldsV1" type.

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

    FieldsV1 包含類型 “FieldsV1” 中描述的第一個 JSON 版本格式。

    <a name="FieldsV1"></a>
    FieldsV1 以 JSON 格式將一組字段存儲在像 Trie 這樣的數據結構中。
    
    每個鍵或是 `.` 表示字段本身，並且始終映射到一個空集，
    或是一個表示子字段或元素的字符串。該字符串將遵循以下四種格式之一：

    1. `f:<name>`，其中 `<name>` 是結構中字段的名稱，或映射中的鍵
    2. `v:<value>`，其中 `<value>` 是列表項的精確 json 格式值
    3. `i:<index>`，其中 `<index>` 是列表中項目的位置
    4. `k:<keys>`，其中 `<keys>` 是列表項的關鍵字段到其唯一值的映射。
  
    如果一個鍵映射到一個空的 Fields 值，則該鍵表示的字段是集合的一部分。
    
    確切的格式在 sigs.k8s.io/structured-merge-diff 中定義。

  - **managedFields.manager** (string)

    <!--
    Manager is an identifier of the workflow managing these fields.
    -->

    manager 是管理這些字段的工作流的標識符。

  - **managedFields.operation** (string)

    <!--
    Operation is the type of operation which lead to this ManagedFieldsEntry being created. The only valid values for this field are 'Apply' and 'Update'.
    -->

    operation 是導致創建此 managedFields 表項的操作類型。
    此字段的僅有合法值是 “Apply” 和 “Update”。

  - **managedFields.subresource** (string)

    <!--
    Subresource is the name of the subresource used to update that object, or empty string if the object was updated through the main resource. The value of this field is used to distinguish between managers, even if they share the same name. For example, a status update will be distinct from a regular update using the same manager name. Note that the APIVersion field is not related to the Subresource field and it always corresponds to the version of the main resource.
    -->

    subresource 是用於更新該對象的子資源的名稱，如果對象是通過主資源更新的，則爲空字符串。
    該字段的值用於區分管理者，即使他們共享相同的名稱。例如，狀態更新將不同於使用相同管理者名稱的常規更新。
    請注意，apiVersion 字段與 subresource 字段無關，它始終對應於主資源的版本。

  - **managedFields.time** (Time)

    <!--
    Time is the timestamp of when the ManagedFields entry was added. The timestamp will also be updated if a field is added, the manager changes any of the owned fields value or removes a field. The timestamp does not update when a field is removed from the entry because another manager took it over.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    time 是添加 managedFields 條目時的時間戳。
    如果一個字段被添加、管理器更新任一所屬字段值或移除一個字段，該時間戳也會更新。
    從此條目中移除一個字段時該時間戳不會更新，因爲另一個管理器將它接管了。

    <a name="Time"></a>
    **time 是 time.Time 的包裝類，支持正確地序列化爲 YAML 和 JSON。
    爲 time 包提供的許多工廠方法提供了包裝類。**

- **ownerReferences** ([]OwnerReference)

  <!-- 
  *Patch strategy: merge on key `uid`*

  *Map: unique values on key uid will be kept during a merge*
  
  List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller.
  
  <a name="OwnerReference"></a>
  *OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field.*
  -->

  **補丁策略：根據 `uid` 鍵執行合併操作**

  **映射：在合併期間將根據鍵 uid 保留唯一值**

  此對象所依賴的對象列表。如果列表中的所有對象都已被刪除，則該對象將被垃圾回收。
  如果此對象由控制器管理，則此列表中的條目將指向此控制器，controller 字段設置爲 true。
  管理控制器不能超過一個。

  <a name="OwnerReference"></a>
  **OwnerReference 包含足夠可以讓你識別屬主對象的信息。
  屬主對象必須與依賴對象位於同一命名空間中，或者是集羣作用域的，因此沒有命名空間字段。**

  - **ownerReferences.apiVersion** (string)，<!-- required -->必需
    
    <!--
    API version of the referent.
    -->

    被引用資源的 API 版本。

  - **ownerReferences.kind** (string)，<!-- required -->必需

    <!--
    Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
    -->

    被引用資源的類別。更多信息：
    https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  - **ownerReferences.name** (string)，<!-- required -->必需

    <!--
    Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names
    -->

    被引用資源的名稱。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/

  - **ownerReferences.uid** (string)，<!-- required -->必需

    <!--
    UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids
    -->

    被引用資源的 uid。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#uids

  - **ownerReferences.blockOwnerDeletion** (boolean)

    <!--
    If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned.
    -->

    如果爲 true，**並且** 如果屬主具有 “foregroundDeletion” 終結器，
    則在刪除此引用之前，無法從鍵值存儲中刪除屬主。
    默認爲 false。要設置此字段，用戶需要屬主的 “delete” 權限，
    否則將返回 422 (Unprocessable Entity)。

  - **ownerReferences.controller** (boolean)

    <!--
    If true, this reference points to the managing controller.
    -->

    如果爲 true，則此引用指向管理的控制器。

<!--
### Read-only {#Read-only}
-->
### 只讀字段   {#Read-only}

- **creationTimestamp** (Time)

  <!-- 
  CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.
  
  Populated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  
  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  creationTimestamp 是一個時間戳，表示創建此對象時的服務器時間。
  不能保證在單獨的操作中按發生前的順序設置。
  客戶端不得設置此值。它以 RFC3339 形式表示，並採用 UTC。
  
  由系統填充。只讀。列表爲空。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  <a name="Time"></a>
  **time 是 time.Time 的包裝類，支持正確地序列化爲 YAML 和 JSON。
  爲 time 包提供的許多工廠方法提供了包裝類。**

- **deletionGracePeriodSeconds** (int64)

  <!-- 
  Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only.
  -->

  此對象從系統中刪除之前允許正常終止的秒數。
  僅當設置了 deletionTimestamp 時才設置。
  只能縮短。只讀。

- **deletionTimestamp** (Time)

  <!-- 
  DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested.
  -->

  deletionTimestamp 是刪除此資源的 RFC 3339 日期和時間。
  該字段在用戶請求體面刪除時由服務器設置，客戶端不能直接設置。
  一旦 finalizers 列表爲空，該資源預計將在此字段中的時間之後被刪除
  （不再從資源列表中可見，並且無法通過名稱訪問）。
  只要 finalizers 列表包含項目，就阻止刪除。一旦設置了 deletionTimestamp，
  該值可能不會被取消設置或在未來進一步設置，儘管它可能會縮短或在此時間之前可能會刪除資源。
  例如，用戶可能要求在 30 秒內刪除一個 Pod。
  Kubelet 將通過向 Pod 中的容器發送體面的終止信號來做出反應。
  30 秒後，Kubelet 將向容器發送硬終止信號（SIGKILL），
  並在清理後從 API 中刪除 Pod。在網絡存在分區的情況下，
  此對象可能在此時間戳之後仍然存在，直到管理員或自動化進程可以確定資源已完全終止。
  如果未設置，則未請求體面刪除該對象。
  
  <!--
  Populated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  請求體面刪除時由系統填充。只讀。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  <a name="Time"></a>
  **Time 是 time.Time 的包裝類，支持正確地序列化爲 YAML 和 JSON。
  爲 time 包提供的許多工廠方法提供了包裝類。**

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

  一個不透明的值，表示此對象的內部版本，客戶端可以使用該值來確定對象是否已被更改。
  可用於樂觀併發、變更檢測以及對資源或資源集的監聽操作。
  客戶端必須將這些值視爲不透明的，且未更改地傳回服務器。
  它們可能僅對特定資源或一組資源有效。
  
  由系統填充。只讀。客戶端必須將值視爲不透明。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **selfLink** (string)

  <!-- 
  SelfLink is a URL representing this object. Populated by the system. Read-only.
  
  DEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release.
  -->

  selfLink 是表示此對象的 URL。由系統填充。只讀。
  
  **已棄用**。Kubernetes 將在 1.20 版本中停止傳播該字段，並計劃在 1.21 版本中刪除該字段。

- **uid** (string)

  <!-- 
  UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations.
  
  Populated by the system. Read-only. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids
  -->

  UID 是該對象在時間和空間上的唯一值。它通常由服務器在成功創建資源時生成，並且不允許使用 PUT 操作更改。
  
  由系統填充。只讀。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#uids
