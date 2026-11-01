---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ObjectMeta"
content_type: "api_reference"
description: "ObjectMeta 是所有持久化资源（包括用户必须创建的所有对象）都必须具备的元数据。"
title: "ObjectMeta"
weight: 310
auto_generated: true
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "ObjectMeta"
content_type: "api_reference"
description: "ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create."
title: "ObjectMeta"
weight: 310
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## ObjectMeta {#ObjectMeta}

<!--
ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create.
-->
ObjectMeta 是所有持久化资源（包括用户必须创建的所有对象）都必须具备的元数据。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>annotations</code><br/><em>object</em></td>
      <td>
      <!--
      Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations
      -->
      annotations（注解）是随资源一起存储的非结构化键值对映射，可由外部工具设置，用于存储和检索任意元数据。
      它们不可查询，且在修改对象时应予以保留。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/annotations
      </td>
    </tr>
    <tr>
      <td><code>creationTimestamp</code><br/><em><a href="{{< ref "time-v1-meta#Time" >}}">Time</a></em></td>
      <td>
      <!--
      CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.  Populated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
      -->
      creationTimestamp 是一个时间戳，表示该对象创建时的服务器时间。不保证在不同操作之间遵循
      “happens-before”（先行发生）顺序。客户端不可设置此值。该值采用 RFC3339 格式，并以 UTC
      时间表示。由系统自动填充。只读。对于列表类型，该值为 null。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
      </td>
    </tr>
    <tr>
      <td><code>deletionGracePeriodSeconds</code><br/><em>integer</em></td>
      <td>
      <!--
      Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only.
      -->
      该对象在从系统中移除前允许进行优雅终止的秒数。仅在设置了 deletionTimestamp 时才会设置此字段。该值只能被缩短。只读。
      </td>
    </tr>
    <tr>
      <td><code>deletionTimestamp</code><br/><em><a href="{{< ref "time-v1-meta#Time" >}}">Time</a></em></td>
      <td>
      <!--
      DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested.  Populated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
      -->
      deletionTimestamp 是该资源将被删除的 RFC 3339 格式日期和时间。当用户请求进行优雅删除（graceful deletion）时，
      该字段由服务器设置，客户端无法直接对其进行设置。一旦 finalizers（终结器）列表为空，且时间超过了该字段指定的时间点，
      该资源即被视为已删除（即不再出现在资源列表中，也无法通过名称访问）。只要 finalizers 列表中仍有条目，删除操作就会被阻塞。
      一旦设置了 deletionTimestamp，该值便不可被取消设置或推迟到更晚的时间点，尽管可以缩短该时间或在到达该时间点之前删除资源。
      例如，用户可以请求在 30 秒后删除某个 Pod。kubelet 接收到请求后，会向该 Pod 中的容器发送优雅终止信号。
      30 秒后，kubelet 会向容器发送强制终止信号（SIGKILL），并在完成清理工作后将该 Pod 从 API 中移除。
      若发生网络分区，该对象可能会在该时间戳之后继续存在，直到管理员或自动化流程确认该资源已完全终止。
      如果未设置该字段，则表示未请求对该对象进行优雅删除。该字段在请求优雅删除时由系统自动填充。为只读字段。更多信息请参阅：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
      </td>
    </tr>
    <tr>
      <td><code>finalizers</code><br/><em>string array</em><br/><em>patch strategy: merge</em></td>
      <td>
      <!--
      Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. Finalizers may be processed and removed in any order.  Order is NOT enforced because it introduces significant risk of stuck finalizers. finalizers is a shared field, any actor with permission can reorder it. If the finalizer list is processed in order, then this can lead to a situation in which the component responsible for the first finalizer in the list is waiting for a signal (field value, external system, or other) produced by a component responsible for a finalizer later in the list, resulting in a deadlock. Without enforced ordering finalizers are free to order amongst themselves and are not vulnerable to ordering changes in the list.
      -->
      在对象从注册表中删除之前，该列表必须为空。列表中的每一项都是一个标识符，指向负责将该项从列表中移除的组件。
      如果对象的 deletionTimestamp（删除时间戳）非空，则该列表中的项只能被移除。
      终结器（finalizers）的处理和移除顺序不固定；之所以不强制规定顺序，是因为强制排序会带来终结器处理过程陷入停滞（stuck）的重大风险。
      finalizers 是一个共享字段，任何拥有相应权限的参与者（actor）都可以对其进行重新排序。
      如果按顺序处理终结器列表，可能会出现这样一种情况：负责列表中第一个终结器的组件，
      正在等待由负责列表中后续终结器的组件所产生的信号（如字段值、外部系统信号或其他信号），从而导致死锁。
      若不强制规定顺序，终结器之间便可自由安排执行次序，且不会因列表顺序的变动而受到影响。
      </td>
    </tr>
    <tr>
      <td><code>generateName</code><br/><em>string</em></td>
      <td>
      <!--
      GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server.  If this field is specified and the generated name exists, the server will return a 409.  Applied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency
      -->
      generateName 是一个可选的前缀，仅在未提供 Name 字段时由服务器用于生成唯一名称。
      如果使用了该字段，返回给客户端的名称将与传入的名称不同；该值会与一个唯一后缀组合使用。
      所提供的值遵循与 Name 字段相同的验证规则，且可能会因服务器端确保唯一性所需的后缀长度而被截断。
      如果指定了该字段且生成的名称已存在，服务器将返回 409 状态码。仅在未指定 Name 时生效。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency
      </td>
    </tr>
    <tr>
      <td><code>generation</code><br/><em>integer</em></td>
      <td>
      <!--
      A sequence number representing a specific generation of the desired state. Populated by the system. Read-only.
      -->
      表示目标状态特定版本的序列号。由系统填充。只读。
      </td>
    </tr>
    <tr>
      <td><code>labels</code><br/><em>object</em></td>
      <td>
      <!--
      Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels
      -->
      用于组织和分类（限定范围及筛选）对象的字符串键值对映射。可与 ReplicationController 和 Service 的选择器相匹配。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels
      </td>
    </tr>
    <tr>
      <td><code>managedFields</code><br/><em><a href="{{< ref "managed-fields-entry-v1-meta#ManagedFieldsEntry" >}}">ManagedFieldsEntry array</a></em></td>
      <td>
      <!--
      ManagedFields maps workflow-id and version to the set of fields that are managed by that workflow. This is mostly for internal housekeeping, and users typically shouldn't need to set or understand this field. A workflow can be the user's name, a controller's name, or the name of a specific apply path like "ci-cd". The set of fields is always in the version that the workflow used when modifying the object.
      -->
      managedFields 将工作流 ID（workflow-id）和版本映射到由该工作流管理的字段集合。
      这主要用于内部管理，用户通常无需设置或理解该字段。工作流名称可以是用户名、控制器名称，或者是诸如 “ci-cd”
      之类的特定应用路径名称。其中的字段集合始终采用该工作流在修改对象时所使用的版本。
      </td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>
      <!--
      Name must be unique within a namespace. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names
      -->
      name 在命名空间内必须唯一。创建资源时必须指定名称，尽管某些资源允许客户端请求自动生成合适的名称。
      名称主要用于确保创建操作的幂等性以及配置定义。名称不可更新。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#names
      </td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>
      <!--
      Namespace defines the space within which each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation. Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.  Must be a DNS_LABEL. Cannot be updated. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces
      -->
      namespace 定义了一个作用域，在该作用域内每个名称必须是唯一的。空的命名空间等同于 "default" 命名空间，但
      "default" 是其标准表示形式。并非所有对象都必须归属于某个命名空间——对于此类对象，该字段的值为空。
      该值必须符合 DNS_LABEL 规范，且不可更新。更多信息请参阅：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces
      </td>
    </tr>
    <tr>
      <td><code>ownerReferences</code><br/><em><a href="{{< ref "owner-reference-v1-meta#OwnerReference" >}}">OwnerReference array</a></em><br/><em>patch strategy: merge on key <code>uid</code></em></td>
      <td>
      <!--
      List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller.
      -->
      该对象所依赖的对象列表。如果列表中的所有对象均已被删除，则该对象将被垃圾回收。
      如果该对象由控制器管理，则该列表中会包含指向该控制器的条目，且该条目的 controller 字段会被设为 true。
      管理该对象的控制器只能有一个。
      </td>
    </tr>
    <tr>
      <td><code>resourceVersion</code><br/><em>string</em></td>
      <td>
      <!--
      An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed. May be used for optimistic concurrency, change detection, and the watch operation on a resource or set of resources. Clients must treat these values as opaque and passed unmodified back to the server. They may only be valid for a particular resource or set of resources.  Populated by the system. Read-only. Value must be treated as opaque by clients and . More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
      -->
      这是一个代表该对象内部版本的不透明值，客户端可利用它来判断对象是否发生了变更。
      该值可用于乐观并发控制、变更检测以及针对单个或一组资源的“监视”（watch）操作。
      客户端必须将这些值视为不透明数据，并原样传回服务器。它们可能仅对特定资源或资源集合有效。由系统自动填充。只读。
      客户端必须将该值视为不透明数据。更多信息请参阅：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
      </td>
    </tr>
    <tr>
      <td><code>selfLink</code><br/><em>string</em></td>
      <td>
      <!--
      Deprecated: selfLink is a legacy read-only field that is no longer populated by the system.
      -->
      已弃用：selfLink 是一个旧版只读字段，系统不再对其进行填充。
      </td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>
      <!--
      UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations.  Populated by the system. Read-only. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids
      -->
      UID 是该对象在时间和空间上的唯一标识符。它通常由服务器在资源成功创建时生成，且在执行 PUT 操作时不允许更改。
      由系统自动填充。只读。更多信息：https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#uids
      </td>
    </tr>
  </tbody>
</table>
