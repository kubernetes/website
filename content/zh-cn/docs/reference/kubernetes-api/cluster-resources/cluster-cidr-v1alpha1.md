---
api_metadata:
  apiVersion: "networking.k8s.io/v1alpha1"
  import: "k8s.io/api/networking/v1alpha1"
  kind: "ClusterCIDR"
content_type: "api_reference"
description: "ClusterCIDR 表示启用 MultiCIDRRangeAllocator 时针对每个节点 Pod CIDR 分配进行的单个配置（参阅针对 kube-controller-manager 的配置）。"
title: "ClusterCIDR v1alpha1"
weight: 11
---
<!--
api_metadata:
  apiVersion: "networking.k8s.io/v1alpha1"
  import: "k8s.io/api/networking/v1alpha1"
  kind: "ClusterCIDR"
content_type: "api_reference"
description: "ClusterCIDR represents a single configuration for per-Node Pod CIDR allocations when the MultiCIDRRangeAllocator is enabled (see the config for kube-controller-manager)."
title: "ClusterCIDR v1alpha1"
weight: 11
auto_generated: true
-->

`apiVersion: networking.k8s.io/v1alpha1`

`import "k8s.io/api/networking/v1alpha1"`

## ClusterCIDR {#ClusterCIDR}

<!--
ClusterCIDR represents a single configuration for per-Node Pod CIDR allocations when the MultiCIDRRangeAllocator is enabled (see the config for kube-controller-manager).  A cluster may have any number of ClusterCIDR resources, all of which will be considered when allocating a CIDR for a Node.  A ClusterCIDR is eligible to be used for a given Node when the node selector matches the node in question and has free CIDRs to allocate.  In case of multiple matching ClusterCIDR resources, the allocator will attempt to break ties using internal heuristics, but any ClusterCIDR whose node selector matches the Node may be used.
-->
ClusterCIDR 表示启用 MultiCIDRRangeAllocator 时针对每个节点 Pod CIDR 分配进行的单个配置
（参阅针对 kube-controller-manager 的配置）。
一个集群可能有任意数量的 ClusterCIDR 资源，在为节点分配 CIDR 时将考虑所有这些资源。
当节点选择算符与相关节点匹配并且有空闲 CIDR 可供分配时，ClusterCIDR 才能有资格用于给定的节点。
在存在多个匹配的 ClusterCIDR 资源的情况下，分配器将尝试使用内部启发式算法来解决这一问题，
但可以使用节点选择算符与该节点匹配的任何 ClusterCIDR。

<hr>

- **apiVersion**: networking.k8s.io/v1alpha1

- **kind**: ClusterCIDR

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  
  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDRSpec" >}}">ClusterCIDRSpec</a>)
  
  <!--
  spec is the desired state of the ClusterCIDR. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  spec 是 ClusterCIDR 的预期状态。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ClusterCIDRSpec {#ClusterCIDRSpec}

<!--
ClusterCIDRSpec defines the desired state of ClusterCIDR.
-->
ClusterCIDRSpec 定义 ClusterCIDR 的预期状态。

<hr>

<!--
- **perNodeHostBits** (int32), required

  perNodeHostBits defines the number of host bits to be configured per node. A subnet mask determines how much of the address is used for network bits and host bits. For example an IPv4 address of 192.168.0.0/24, splits the address into 24 bits for the network portion and 8 bits for the host portion. To allocate 256 IPs, set this field to 8 (a /24 mask for IPv4 or a /120 for IPv6). Minimum value is 4 (16 IPs). This field is immutable.
-->
- **perNodeHostBits** (int32)，必需

  perNodeHostBits 定义每个节点要配置的主机位数。
  子网掩码决定有多少地址用于网络位和主机位。
  例如 IPv4 地址 192.168.0.0/24 将该地址拆分为 24 位用于网络部分和 8 位用于主机部分。
  要分配 256 个 IP，需将此字段设置为 8（针对 IPv4 的掩码为 /24，针对 IPv6 的掩码为 /120）。
  最小值为 4（16 个 IP）。此字段是不可变的。

- **ipv4** (string)

  <!--
  ipv4 defines an IPv4 IP block in CIDR notation(e.g. "10.0.0.0/8"). At least one of ipv4 and ipv6 must be specified. This field is immutable.
  -->

  ipv4 以 CIDR 表示法定义 IPv4 IP 块（例如 “10.0.0.0/8”）。
  必须至少指定 ipv4 和 ipv6 之一。该字段是不可变的。

- **ipv6** (string)

  <!--
  ipv6 defines an IPv6 IP block in CIDR notation(e.g. "2001:db8::/64"). At least one of ipv4 and ipv6 must be specified. This field is immutable.
  -->

  ipv6 以 CIDR 表示法定义 IPv6 IP 块（例如 “2001:db8::/64”）。
  必须至少指定 ipv4 和 ipv6 之一。 该字段是不可变的。

- **nodeSelector** (NodeSelector)

  <!--
  nodeSelector defines which nodes the config is applicable to. An empty or nil nodeSelector selects all nodes. This field is immutable.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*
  -->

  nodeSelector 定义该配置适用于哪些节点。
  空白或值为 nil 的 nodeSelector 选择所有节点。该字段是不可变的。

  <a name="NodeSelector"></a>
  **节点选择算符表示在一组节点上一个或多个标签查询结果的并集；
  也就是说，它表示由节点选择算符条件表示的选择算符的逻辑或计算结果。**

  <!--
  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), required

    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
  -->

  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

    必需。节点选择算符条件的列表。这些条件以逻辑与进行计算。

    <a name="NodeSelectorTerm"></a>
    **一个 null 或空的节点选择算符条件不会与任何对象匹配。这些要求会按逻辑与的关系来计算。
    TopologySelectorTerm 类别实现了 NodeSelectorTerm 的子集。**

    - **nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)
      
      <!--
      A list of node selector requirements by node's labels.
      -->

      基于节点标签所设置的节点选择算符要求的列表。

    - **nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)
      
      <!--
      A list of node selector requirements by node's fields.
      -->
      
      基于节点字段所设置的节点选择算符要求的列表。

## ClusterCIDRList {#ClusterCIDRList}

<!--
ClusterCIDRList contains a list of ClusterCIDR.
-->
ClusterCIDRList 包含 ClusterCIDR 的列表。

<hr>

- **apiVersion**: networking.k8s.io/v1alpha1

- **kind**: ClusterCIDRList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **items** ([]<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>), required

  items is the list of ClusterCIDRs.
-->
- **items** ([]<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>)，必需

  items 是 ClusterCIDRs 的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified ClusterCIDR

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 ClusterCIDR

#### HTTP 请求

GET /apis/networking.k8s.io/v1alpha1/clustercidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ClusterCIDR

- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**)：string，必需

  ClusterCIDR 的名称

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ClusterCIDR

#### HTTP Request
-->
### `list` 列出或监视 ClusterCIDR 类别的对象

#### HTTP 请求

GET /apis/networking.k8s.io/v1alpha1/clustercidrs

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 参数

- **allowWatchBookmarks** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDRList" >}}">ClusterCIDRList</a>): OK

401: Unauthorized

<!--
### `create` create a ClusterCIDR

#### HTTP Request
-->
### `create` 创建 ClusterCIDR

#### HTTP 请求

POST /apis/networking.k8s.io/v1alpha1/clustercidrs

<!--
#### Parameters

- **body**: <a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **body**: <a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>，必需

- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>): Created

202 (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ClusterCIDR

#### HTTP Request
-->
### `update` 替换指定的 ClusterCIDR

#### HTTP 请求

PUT /apis/networking.k8s.io/v1alpha1/clustercidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required
  name of the ClusterCIDR
- **body**: <a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**)：string，必需

  ClusterCIDR 的名称

- **body**: <a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>，必需

- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ClusterCIDR

#### HTTP Request
-->
### `patch` 部分更新指定的 ClusterCIDR

#### HTTP 请求

PATCH /apis/networking.k8s.io/v1alpha1/clustercidrs/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required
  name of the ClusterCIDR
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string -->
#### 参数

- **name** (**路径参数**)：string，必需

  ClusterCIDR 的名称

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/cluster-cidr-v1alpha1#ClusterCIDR" >}}">ClusterCIDR</a>): Created

401: Unauthorized

<!--
### `delete` delete a ClusterCIDR

#### HTTP Request
-->
### `delete` 删除 ClusterCIDR

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1alpha1/clustercidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required
  name of the ClusterCIDR
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name** (**路径参数**)：string，必需

  ClusterCIDR 的名称

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ClusterCIDR

#### HTTP Request
-->
### `deletecollection` 删除 ClusterCIDR 的集合

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1alpha1/clustercidrs

<!--
#### Parameters

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 参数

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
