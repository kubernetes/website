---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "PodSchedulingContext"
content_type: "api_reference"
description: "PodSchedulingContext 对象包含使用 \"WaitForFirstConsumer\" 分配模式的 ResourceClaims 来调度 Pod 所需的信息。"
title: "PodSchedulingContext v1alpha3"
weight: 15
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "PodSchedulingContext"
content_type: "api_reference"
description: "PodSchedulingContext objects hold information that is needed to schedule a Pod with ResourceClaims that use \"WaitForFirstConsumer\" allocation mode."
title: "PodSchedulingContext v1alpha3"
weight: 15
auto_generated: true
-->

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`

## PodSchedulingContext {#PodSchedulingContext}

<!--
PodSchedulingContext objects hold information that is needed to schedule a Pod with ResourceClaims that use "WaitForFirstConsumer" allocation mode.

This is an alpha type and requires enabling the DRAControlPlaneController feature gate.
-->
PodSchedulingContext 对象包含调度某些 Pod 所需要的额外信息，这些 Pod 使用了
“WaitForFirstConsumer” 分配模式的 ResourceClaim。

本功能特性是 Alpha 级别的特性，需要启用 DRAControlPlaneController 特性门控。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: PodSchedulingContext

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object metadata
  -->
  标准的对象元数据。

<!--
- **spec** (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextSpec" >}}">PodSchedulingContextSpec</a>), required

  Spec describes where resources for the Pod are needed.

- **status** (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextStatus" >}}">PodSchedulingContextStatus</a>)

  Status describes where resources for the Pod can be allocated.
-->
- **spec** (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextSpec" >}}">PodSchedulingContextSpec</a>)，必需

  spec 描述了 Pod 需要在哪里找到资源。

- **status** (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextStatus" >}}">PodSchedulingContextStatus</a>)

  status 描述了 Pod 的资源可以在哪里分配。

## PodSchedulingContextSpec {#PodSchedulingContextSpec}

<!--
PodSchedulingContextSpec describes where resources for the Pod are needed.
-->
PodSchedulingContextSpec 描述了 Pod 所需要的资源在哪里。

<hr>

<!--
- **potentialNodes** ([]string)

  *Atomic: will be replaced during a merge*
  
  PotentialNodes lists nodes where the Pod might be able to run.
  
  The size of this field is limited to 128. This is large enough for many clusters. Larger clusters may need more attempts to find a node that suits all pending resources. This may get increased in the future, but not reduced.
-->
- **potentialNodes** ([]string)

  **原子：将在合并期间被替换**

  potentialNodes 列出可以运行 Pod 的节点。

  该字段的大小限制为 128。对于许多集群来说，这已经足够大了。
  较大的集群可能需要更多的尝试去找到一个适合所有待定资源的节点。
  这个限制值可能会在以后提高，但不会降低。

- **selectedNode** (string)

  <!--
  SelectedNode is the node for which allocation of ResourceClaims that are referenced by the Pod and that use "WaitForFirstConsumer" allocation is to be attempted.
  -->
  selectedNode 是一个节点，由 Pod 引用的 ResourceClaim 将在此节点上尝试，
  且尝试的分配模式是 “WaitForFirstConsumer”。

## PodSchedulingContextStatus {#PodSchedulingContextStatus}

<!--
PodSchedulingContextStatus describes where resources for the Pod can be allocated.
-->
PodSchedulingContextStatus 描述 Pod 的资源可以从哪里分配。

<hr>

- **resourceClaims** ([]ResourceClaimSchedulingStatus)

  <!--
  *Map: unique values on key name will be kept during a merge*
  
  ResourceClaims describes resource availability for each pod.spec.resourceClaim entry where the corresponding ResourceClaim uses "WaitForFirstConsumer" allocation mode.
  -->
  **映射：键 `name` 的唯一值将在合并过程中保留**

  resourceClaims 描述了每个 pod.spec.resourceClaim 条目的资源可用性，
  其中对应的 ResourceClaim 使用 “WaitForFirstConsumer” 分配模式。

  <!--
  <a name="ResourceClaimSchedulingStatus"></a>
  *ResourceClaimSchedulingStatus contains information about one particular ResourceClaim with "WaitForFirstConsumer" allocation mode.*
  -->
  <a name="ResourceClaimSchedulingStatus"></a>
  **ResourceClaimSchedulingStatus 包含关于一个采用 “WaitForFirstConsumer”
  分配模式的特定 ResourceClaim 的信息。**

  - **resourceClaims.name** (string)

    <!--
    Name matches the pod.spec.resourceClaims[*].Name field.
    -->

    name 与 pod.spec.resourceClaims[*].name 字段匹配。

  - **resourceClaims.unsuitableNodes** ([]string)

    <!--
    *Atomic: will be replaced during a merge*
    
    UnsuitableNodes lists nodes that the ResourceClaim cannot be allocated for.
    
    The size of this field is limited to 128, the same as for PodSchedulingSpec.PotentialNodes. This may get increased in the future, but not reduced.
    -->
    
    **原子：将在合并期间被替换**

    unsuitableNodes 列出 ResourceClaim 无法被分配的节点。

    该字段的大小限制为 128，与 PodSchedulingSpec.PotentialNodes 相同。
    这可能会在以后增加，但不会减少。

## PodSchedulingContextList {#PodSchedulingContextList}

<!--
PodSchedulingContextList is a collection of Pod scheduling objects.
-->
PodSchedulingContextList 是 Pod 调度对象的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: PodSchedulingContextList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata
  -->
  标准的列表元数据。

<!--
- **items** ([]<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>), required

  Items is the list of PodSchedulingContext objects.
-->
- **items** ([]<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>)，必需

  items 是 PodSchedulingContext 对象的列表。

<!--
## Operations {#Operations}

### `get` read the specified PodSchedulingContext

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 PodSchedulingContext

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the PodSchedulingContext

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  PodSchedulingContext 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

401: Unauthorized

<!--
### `get` read the specified PodSchedulingContext

#### HTTP Request
-->
### `get` 读取指定 PodSchedulingContext 的状态

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the PodSchedulingContext

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  PodSchedulingContext 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PodSchedulingContext

#### HTTP Request
-->
### `list` 列出或监视 PodSchedulingContext 类别的对象

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextList" >}}">PodSchedulingContextList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PodSchedulingContext

#### HTTP Request
-->
### `list` 列出或监视 PodSchedulingContext 类别的对象

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/podschedulingcontexts

<!--
#### Parameters

- **allowWatchBookmarks** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 参数

- **allowWatchBookmarks**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextList" >}}">PodSchedulingContextList</a>): OK

401: Unauthorized

<!--
### `create` create a PodSchedulingContext

#### HTTP Request
-->
### `create` 创建 PodSchedulingContext

#### HTTP 请求

POST /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PodSchedulingContext

#### HTTP Request
-->
### `update` 替换指定的 PodSchedulingContext

#### HTTP 请求

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the PodSchedulingContext

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  PodSchedulingContext 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified PodSchedulingContext

#### HTTP Request
-->
### `update` 替换指定 PodSchedulingContext 的状态

#### HTTP 请求

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the PodSchedulingContext

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  PodSchedulingContext 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PodSchedulingContext

#### HTTP Request
-->
### `patch` 部分更新指定的 PodSchedulingContext

#### HTTP 请求

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the PodSchedulingContext

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  PodSchedulingContext 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified PodSchedulingContext

#### HTTP Request
-->
### `patch` 部分更新指定 PodSchedulingContext 的状态

#### HTTP 请求

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the PodSchedulingContext

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  PodSchedulingContext 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized

<!--
### `delete` delete a PodSchedulingContext

#### HTTP Request
-->
### `delete` 删除 PodSchedulingContext

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the PodSchedulingContext

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  PodSchedulingContext 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PodSchedulingContext

#### HTTP Request
-->
### `deletecollection` 删除 PodSchedulingContext 的集合

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
