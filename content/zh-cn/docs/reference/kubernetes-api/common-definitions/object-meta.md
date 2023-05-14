---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ObjectMeta"
content_type: "api_reference"
description: "ObjectMeta 是所有持久化资源必须具有的元数据，其中包括用户必须创建的所有对象。"
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
ObjectMeta 是所有持久化资源必须具有的元数据，其中包括用户必须创建的所有对象。

<hr>

- **name** (string)

  <!-- 
  Name must be unique within a namespace. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names
  -->

  name 在命名空间内必须是唯一的。创建资源时需要，尽管某些资源可能允许客户端请求自动地生成适当的名称。
  名称主要用于创建幂等性和配置定义。无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#names

- **generateName** (string)

  <!-- 
  GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server.
  -->
  generateName 是一个可选前缀，由服务器使用，**仅在**未提供 name 字段时生成唯一名称。
  如果使用此字段，则返回给客户端的名称将与传递的名称不同。该值还将与唯一的后缀组合。
  提供的值与 name 字段具有相同的验证规则，并且可能会根据所需的后缀长度被截断，以使该值在服务器上唯一。
  
  <!-- 
  If this field is specified and the generated name exists, the server will NOT return a 409 - instead, it will either return 201 Created or 500 with Reason ServerTimeout indicating a unique name could not be found in the time allotted, and the client should retry (optionally after the time indicated in the Retry-After header).
  
  Applied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency
  -->
  如果指定了此字段并且生成的名称存在，则服务器将不会返回 409 ——相反，它将返回 201 Created 或 500，
  原因是 ServerTimeout 指示在分配的时间内找不到唯一名称，客户端应重试（可选，在 Retry-After 标头中指定的时间之后）。
  
  仅在未指定 name 时应用。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency

- **namespace** (string)

  <!-- 
  Namespace defines the space within which each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation. Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.
  
  Must be a DNS_LABEL. Cannot be updated. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces
  -->

  namespace 定义了一个值空间，其中每个名称必须唯一。空命名空间相当于 “default” 命名空间，但 “default” 是规范表示。
  并非所有对象都需要限定在命名空间中——这些对象的此字段的值将为空。
  
  必须是 DNS_LABEL。无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces

- **labels** (map[string]string)

  <!-- 
  Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels
  -->

  可用于组织和分类（确定范围和选择）对象的字符串键和值的映射。
  可以匹配 ReplicationController 和 Service 的选择算符。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels

- **annotations** (map[string]string)

  <!-- 
  Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations
  -->

  annotations 是一个非结构化的键值映射，存储在资源中，可以由外部工具设置以存储和检索任意元数据。
  它们不可查询，在修改对象时应保留。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/annotations

<!-- ### System {#System} -->
### 系统字段 {#System}

- **finalizers** ([]string)

  <!-- 
  Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. Finalizers may be processed and removed in any order.  Order is NOT enforced because it introduces significant risk of stuck finalizers. finalizers is a shared field, any actor with permission can reorder it. If the finalizer list is processed in order, then this can lead to a situation in which the component responsible for the first finalizer in the list is waiting for a signal (field value, external system, or other) produced by a component responsible for a finalizer later in the list, resulting in a deadlock. Without enforced ordering finalizers are free to order amongst themselves and are not vulnerable to ordering changes in the list.
  -->

  在从注册表中删除对象之前该字段必须为空。
  每个条目都是负责的组件的标识符，各组件将从列表中删除自己对应的条目。
  如果对象的 deletionTimestamp 非空，则只能删除此列表中的条目。
  终结器可以按任何顺序处理和删除。**没有**按照顺序执行，
  因为它引入了终结器卡住的重大风险。finalizers 是一个共享字段，
  任何有权限的参与者都可以对其进行重新排序。如果按顺序处理终结器列表，
  那么这可能导致列表中第一个负责终结器的组件正在等待列表中靠后负责终结器的组件产生的信号（字段值、外部系统或其他），
  从而导致死锁。在没有强制排序的情况下，终结者可以在它们之间自由排序，
  并且不容易受到列表中排序更改的影响。

- **managedFields** ([]ManagedFieldsEntry)

  <!-- 
  ManagedFields maps workflow-id and version to the set of fields that are managed by that workflow. This is mostly for internal housekeeping, and users typically shouldn't need to set or understand this field. A workflow can be the user's name, a controller's name, or the name of a specific apply path like "ci-cd". The set of fields is always in the version that the workflow used when modifying the object.

  <a name="ManagedFieldsEntry"></a>
  *ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to.*
  -->

  managedFields 将 workflow-id 和版本映射到由该工作流管理的字段集。
  这主要用于内部管理，用户通常不需要设置或理解该字段。
  工作流可以是用户名、控制器名或特定应用路径的名称，如 “ci-cd”。
  字段集始终存在于修改对象时工作流使用的版本。

  <a name="ManagedFieldsEntry"></a>
  **ManagedFieldsEntry 是一个 workflow-id，一个 FieldSet，也是该字段集适用的资源的组版本。**

  - **managedFields.apiVersion** (string)

    <!--
    APIVersion defines the version of this resource that this field set applies to. The format is "group/version" just like the top-level APIVersion field. It is necessary to track the version of a field set because it cannot be automatically converted.
    -->

    apiVersion 定义此字段集适用的资源的版本。
    格式是 “group/version”，就像顶级 apiVersion 字段一样。
    必须跟踪字段集的版本，因为它不能自动转换。

  - **managedFields.fieldsType** (string)

    <!--
    FieldsType is the discriminator for the different fields format and version. There is currently only one possible value: "FieldsV1"
    -->

    FieldsType 是不同字段格式和版本的鉴别器。
    目前只有一个可能的值：“FieldsV1”

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

    FieldsV1 包含类型 “FieldsV1” 中描述的第一个 JSON 版本格式。

    <a name="FieldsV1"></a>
    FieldsV1 以 JSON 格式将一组字段存储在像 Trie 这样的数据结构中。
    
    每个键或是 `.` 表示字段本身，并且始终映射到一个空集，
    或是一个表示子字段或元素的字符串。该字符串将遵循以下四种格式之一：

    1. `f:<name>`，其中 `<name>` 是结构中字段的名称，或映射中的键
    2. `v:<value>`，其中 `<value>` 是列表项的精确 json 格式值
    3. `i:<index>`，其中 `<index>` 是列表中项目的位置
    4. `k:<keys>`，其中 `<keys>` 是列表项的关键字段到其唯一值的映射。
    如果一个键映射到一个空的 Fields 值，则该键表示的字段是集合的一部分。
    
    确切的格式在 sigs.k8s.io/structured-merge-diff 中定义。

  - **managedFields.manager** (string)

    <!-- Manager is an identifier of the workflow managing these fields. -->
    manager 是管理这些字段的工作流的标识符。

  - **managedFields.operation** (string)

    <!--
    Operation is the type of operation which lead to this ManagedFieldsEntry being created. The only valid values for this field are 'Apply' and 'Update'.
    -->

    operation 是导致创建此 managedFields 表项的操作类型。
    此字段的仅有合法值是 “Apply” 和 “Update”。

  - **managedFields.subresource** (string)

    <!--
    Subresource is the name of the subresource used to update that object, or empty string if the object was updated through the main resource. The value of this field is used to distinguish between managers, even if they share the same name. For example, a status update will be distinct from a regular update using the same manager name. Note that the APIVersion field is not related to the Subresource field and it always corresponds to the version of the main resource.
    -->

    subresource 是用于更新该对象的子资源的名称，如果对象是通过主资源更新的，则为空字符串。
    该字段的值用于区分管理者，即使他们共享相同的名称。例如，状态更新将不同于使用相同管理者名称的常规更新。
    请注意，apiVersion 字段与 subresource 字段无关，它始终对应于主资源的版本。

  - **managedFields.time** (Time)

    <!--
    Time is the timestamp of when the ManagedFields entry was added. The timestamp will also be updated if a field is added, the manager changes any of the owned fields value or removes a field. The timestamp does not update when a field is removed from the entry because another manager took it over.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    time 是添加 managedFields 条目时的时间戳。
    如果一个字段被添加、管理器更新任一所属字段值或移除一个字段，该时间戳也会更新。
    从此条目中移除一个字段时该时间戳不会更新，因为另一个管理器将它接管了。

    <a name="Time"></a>
    **time 是 time.Time 的包装类，支持正确地序列化为 YAML 和 JSON。
    为 time 包提供的许多工厂方法提供了包装类。**

- **ownerReferences** ([]OwnerReference)

  <!-- 
  *Patch strategy: merge on key `uid`*
  
  List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller.
  
  <a name="OwnerReference"></a>
  *OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field.*
  -->

  **补丁策略：根据 `uid` 键执行合并操作**

  此对象所依赖的对象列表。如果列表中的所有对象都已被删除，则该对象将被垃圾回收。
  如果此对象由控制器管理，则此列表中的条目将指向此控制器，controller 字段设置为 true。
  管理控制器不能超过一个。

  <a name="OwnerReference"></a>
  **OwnerReference 包含足够可以让你识别属主对象的信息。
  属主对象必须与依赖对象位于同一命名空间中，或者是集群作用域的，因此没有命名空间字段。**

  - **ownerReferences.apiVersion** (string)，<!-- required -->必选
    <!-- API version of the referent. -->
    被引用资源的 API 版本。

  - **ownerReferences.kind** (string)，<!-- required -->必选

    <!-- Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds -->
    被引用资源的类别。更多信息：
    https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  - **ownerReferences.name** (string)，<!-- required -->必选

    <!-- Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names-->

    被引用资源的名称。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/

  - **ownerReferences.uid** (string)，<!-- required -->必选

    <!-- UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids -->

    被引用资源的 uid。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#uids

  - **ownerReferences.blockOwnerDeletion** (boolean)

    <!--
    If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned.
    -->
    如果为 true，**并且** 如果属主具有 “foregroundDeletion” 终结器，
    则在删除此引用之前，无法从键值存储中删除属主。
    默认为 false。要设置此字段，用户需要属主的 “delete” 权限，
    否则将返回 422 (Unprocessable Entity)。

  - **ownerReferences.controller** (boolean)

    <!-- If true, this reference points to the managing controller. -->
    如果为 true，则此引用指向管理的控制器。

<!-- ### Read-only {#Read-only} -->
### 只读字段 {#Read-only}

- **creationTimestamp** (Time)

  <!-- 
  CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.
  
  Populated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  
  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  creationTimestamp 是一个时间戳，表示创建此对象时的服务器时间。
  不能保证在单独的操作中按发生前的顺序设置。
  客户端不得设置此值。它以 RFC3339 形式表示，并采用 UTC。
  
  由系统填充。只读。列表为空。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  <a name="Time"></a>
  **time 是 time.Time 的包装类，支持正确地序列化为 YAML 和 JSON。
  为 time 包提供的许多工厂方法提供了包装类。**

- **deletionGracePeriodSeconds** (int64)

  <!-- 
  Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only.
  -->
  此对象从系统中删除之前允许正常终止的秒数。
  仅当设置了 deletionTimestamp 时才设置。
  只能缩短。只读。

- **deletionTimestamp** (Time)

  <!-- 
  DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested.
  -->

  deletionTimestamp 是删除此资源的 RFC 3339 日期和时间。
  该字段在用户请求体面删除时由服务器设置，客户端不能直接设置。
  一旦 finalizers 列表为空，该资源预计将在此字段中的时间之后被删除
  （不再从资源列表中可见，并且无法通过名称访问）。
  只要 finalizers 列表包含项目，就阻止删除。一旦设置了 deletionTimestamp，
  该值可能不会被取消设置或在未来进一步设置，尽管它可能会缩短或在此时间之前可能会删除资源。
  例如，用户可能要求在 30 秒内删除一个 Pod。
  Kubelet 将通过向 Pod 中的容器发送体面的终止信号来做出反应。
  30 秒后，Kubelet 将向容器发送硬终止信号（SIGKILL），
  并在清理后从 API 中删除 Pod。在网络存在分区的情况下，
  此对象可能在此时间戳之后仍然存在，直到管理员或自动化进程可以确定资源已完全终止。
  如果未设置，则未请求体面删除该对象。
  
  <!--
  Populated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  请求体面删除时由系统填充。只读。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  <a name="Time"></a>
  **Time 是 time.Time 的包装类，支持正确地序列化为 YAML 和 JSON。
  为 time 包提供的许多工厂方法提供了包装类。**

- **generation** (int64)

  <!-- 
  A sequence number representing a specific generation of the desired state. Populated by the system. Read-only.
  -->
  表示期望状态的特定生成的序列号。由系统填充。只读。

- **resourceVersion** (string)

  <!-- 
  An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed. May be used for optimistic concurrency, change detection, and the watch operation on a resource or set of resources. Clients must treat these values as opaque and passed unmodified back to the server. They may only be valid for a particular resource or set of resources.
  
  Populated by the system. Read-only. Value must be treated as opaque by clients and . More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
  -->
  一个不透明的值，表示此对象的内部版本，客户端可以使用该值来确定对象是否已被更改。
  可用于乐观并发、变更检测以及对资源或资源集的监听操作。
  客户端必须将这些值视为不透明的，且未更改地传回服务器。
  它们可能仅对特定资源或一组资源有效。
  
  由系统填充。只读。客户端必须将值视为不透明。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **selfLink** (string)

  <!-- 
  SelfLink is a URL representing this object. Populated by the system. Read-only.
  
  DEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release.
  -->
  selfLink 是表示此对象的 URL。由系统填充。只读。
  
  **已弃用**。Kubernetes 将在 1.20 版本中停止传播该字段，并计划在 1.21 版本中删除该字段。

- **uid** (string)

  <!-- 
  UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations.
  
  Populated by the system. Read-only. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids
  -->

  UID 是该对象在时间和空间上的唯一值。它通常由服务器在成功创建资源时生成，并且不允许使用 PUT 操作更改。
  
  由系统填充。只读。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#uids
