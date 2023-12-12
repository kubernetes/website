---
api_metadata:
  apiVersion: "certificates.k8s.io/v1alpha1"
  import: "k8s.io/api/certificates/v1alpha1"
  kind: "ClusterTrustBundle"
content_type: "api_reference"
description: "ClusterTrustBundle 是一个集群范围的容器，用于存放 X.509 信任锚（根证书）。"
title: "ClusterTrustBundle v1alpha1"
weight: 5
---
<!--
api_metadata:
  apiVersion: "certificates.k8s.io/v1alpha1"
  import: "k8s.io/api/certificates/v1alpha1"
  kind: "ClusterTrustBundle"
content_type: "api_reference"
description: "ClusterTrustBundle is a cluster-scoped container for X."
title: "ClusterTrustBundle v1alpha1"
weight: 5
auto_generated: true
-->

`apiVersion: certificates.k8s.io/v1alpha1`

`import "k8s.io/api/certificates/v1alpha1"`

## ClusterTrustBundle {#ClusterTrustBundle}

<!--
ClusterTrustBundle is a cluster-scoped container for X.509 trust anchors (root certificates).

ClusterTrustBundle objects are considered to be readable by any authenticated user in the cluster, because they can be mounted by pods using the `clusterTrustBundle` projection.  All service accounts have read access to ClusterTrustBundles by default.  Users who only have namespace-level access to a cluster can read ClusterTrustBundles by impersonating a serviceaccount that they have access to.
-->
ClusterTrustBundle 是一个集群范围的容器，用于存放 X.509 信任锚（根证书）。

ClusterTrustBundle 对象被视为可被集群中的任何已通过身份验证的用户读取，
因为此对象可以由使用 `clusterTrustBundle` 投射的 Pod 挂载。
所有服务账号默认都有对 ClusterTrustBundle 的读取权限。
对于仅对集群具有命名空间级访问权限的用户，可以通过伪装他们可以访问的服务账号来读取 ClusterTrustBundle。

<!--
It can be optionally associated with a particular assigner, in which case it contains one valid set of trust anchors for that signer. Signers may have multiple associated ClusterTrustBundles; each is an independent set of trust anchors for that signer. Admission control is used to enforce that only users with permissions on the signer can create or modify the corresponding bundle.
-->
ClusterTrustBundle 可以选择与特定的签名程序相关联，此时它包含该签名程序的一组有效信任锚。
签名程序可以有多个关联的 ClusterTrustBundle；
对于该签名程序而言每个 ClusterTrustBundle 都是独立的一组信任锚。
准入控制用于确保只有对签名程序有访问权限的用户才能创建或修改相应的捆绑包。

<hr>

- **apiVersion**: certificates.k8s.io/v1alpha1

- **kind**: ClusterTrustBundle

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata contains the object metadata.

- **spec** (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleSpec" >}}">ClusterTrustBundleSpec</a>), required

  spec contains the signer (if any) and trust anchors.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata 包含对象的元数据。

- **spec** (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleSpec" >}}">ClusterTrustBundleSpec</a>)，必需

  spec 包含签名程序（如果有）和信任锚。

## ClusterTrustBundleSpec {#ClusterTrustBundleSpec}

<!--
ClusterTrustBundleSpec contains the signer and trust anchors.
-->
ClusterTrustBundleSpec 包含签名程序和信任锚。

<hr>

<!--
- **trustBundle** (string), required

  trustBundle contains the individual X.509 trust anchors for this bundle, as PEM bundle of PEM-wrapped, DER-formatted X.509 certificates.
-->
- **trustBundle** (string)，必需

  trustBundle 包含此捆绑包的各个 X.509 信任锚，这个 PEM 捆绑包是采用 PEM 包装的 DER 格式的若干 X.509 证书。

  <!--
  The data must consist only of PEM certificate blocks that parse as valid X.509 certificates.  Each certificate must include a basic constraints extension with the CA bit set.  The API server will reject objects that contain duplicate certificates, or that use PEM block headers.
  
  Users of ClusterTrustBundles, including Kubelet, are free to reorder and deduplicate certificate blocks in this file according to their own logic, as well as to drop PEM block headers and inter-block data.
  -->
  数据必须仅由可解析为有效 X.509 证书的 PEM 证书块组成。
  每个证书必须包含设置了 CA 标志的基本约束扩展。
  API 服务器将拒绝包含重复证书或使用 PEM 块头的对象。
  
  ClusterTrustBundles 的使用者（包括 kubelet）可以根据自己的逻辑对此文件中的证书块进行重新排序和去重，
  也可以删除 PEM 块头和块间数据。

<!--
- **signerName** (string)

  signerName indicates the associated signer, if any.
  
  In order to create or update a ClusterTrustBundle that sets signerName, you must have the following cluster-scoped permission: group=certificates.k8s.io resource=signers resourceName=\<the signer name> verb=attest.
-->
- **signerName** (string)

  signerName 表示关联的签名程序（如果有）。
  
  要创建或更新设置了 signerName 属性的 ClusterTrustBundle，你必须具备以下集群范围的权限：

  <code>
  group=certificates.k8s.io
  resource=signers
  resourceName=\<签名程序名称>
  verb=attest
  </code>

  <!--
  If signerName is not empty, then the ClusterTrustBundle object must be named with the signer name as a prefix (translating slashes to colons). For example, for the signer name `example.com/foo`, valid ClusterTrustBundle object names include `example.com:foo:abc` and `example.com:foo:v1`.
  
  If signerName is empty, then the ClusterTrustBundle object's name must not have such a prefix.
  
  List/watch requests for ClusterTrustBundles can filter on this field using a `spec.signerName=NAME` field selector.
  -->
  如果 signerName 不为空，则 ClusterTrustBundle 对象的名称必须以签名程序名称作为前缀（将斜杠转换为冒号）。
  例如，对于签名程序名称 `example.com/foo`，有效的 ClusterTrustBundle 对象名称包括
  `example.com:foo:abc` 和 `example.com:foo:v1`。
  
  如果 signerName 为空，则 ClusterTrustBundle 对象的名称不能具有此类前缀。
  
  针对 ClusterTrustBundles 的列举/监视请求可以使用 `spec.signerName=NAME` 字段选择算符针对此字段进行过滤。

## ClusterTrustBundleList {#ClusterTrustBundleList}

<!--
ClusterTrustBundleList is a collection of ClusterTrustBundle objects
-->
ClusterTrustBundleList 是 ClusterTrustBundle 对象的集合。

<hr>

- **apiVersion**: certificates.k8s.io/v1alpha1

- **kind**: ClusterTrustBundleList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata contains the list metadata.

- **items** ([]<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>), required

  items is a collection of ClusterTrustBundle objects
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata 包含列表的元数据。

- **items** ([]<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>)，必需

  items 是 ClusterTrustBundle 对象的集合。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified ClusterTrustBundle

#### HTTP Request
-->
### `get` 读取指定的 ClusterTrustBundle

#### HTTP 请求

GET /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ClusterTrustBundle

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ClusterTrustBundle 的名称。

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ClusterTrustBundle

#### HTTP Request
-->
### `list` 列举或监视类别为 ClusterTrustBundle 的对象

#### HTTP 请求

GET /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
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

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleList" >}}">ClusterTrustBundleList</a>): OK

401: Unauthorized

<!--
### `create` create a ClusterTrustBundle

#### HTTP Request
-->
### `create` 创建 ClusterTrustBundle

#### HTTP 请求

POST /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

<!--
#### Parameters
- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>，必需

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

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

202 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ClusterTrustBundle

#### HTTP Request
-->
### `update` 替换指定的 ClusterTrustBundle

#### HTTP 请求

PUT /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ClusterTrustBundle

- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ClusterTrustBundle 的名称。

- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>，必需

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

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ClusterTrustBundle

#### HTTP Request
-->
### `patch` 部分更新指定的 ClusterTrustBundle

#### HTTP 请求

PATCH /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ClusterTrustBundle

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ClusterTrustBundle 的名称。

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

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: Unauthorized

<!--
### `delete` delete a ClusterTrustBundle

#### HTTP Request
-->
### `delete` 删除 ClusterTrustBundle

#### HTTP 请求

DELETE /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ClusterTrustBundle

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ClusterTrustBundle 的名称。

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ClusterTrustBundle

#### HTTP Request
-->
### `deletecollection` 删除 ClusterTrustBundle 的集合

#### HTTP 请求

DELETE /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

<!--
#### Parameters

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
-->
#### 参数

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
