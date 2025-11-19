---
api_metadata:
  apiVersion: "certificates.k8s.io/v1beta1"
  import: "k8s.io/api/certificates/v1beta1"
  kind: "ClusterTrustBundle"
content_type: "api_reference"
description: "ClusterTrustBundle 是一個集羣範圍的容器，用於存放 X.509 信任錨（根證書）。"
title: "ClusterTrustBundle v1beta1"
weight: 5
---
<!--
api_metadata:
  apiVersion: "certificates.k8s.io/v1beta1"
  import: "k8s.io/api/certificates/v1beta1"
  kind: "ClusterTrustBundle"
content_type: "api_reference"
description: "ClusterTrustBundle is a cluster-scoped container for X."
title: "ClusterTrustBundle v1beta1"
weight: 5
auto_generated: true
-->

`apiVersion: certificates.k8s.io/v1beta1`

`import "k8s.io/api/certificates/v1beta1"`

## ClusterTrustBundle {#ClusterTrustBundle}

<!--
ClusterTrustBundle is a cluster-scoped container for X.509 trust anchors (root certificates).

ClusterTrustBundle objects are considered to be readable by any authenticated user in the cluster, because they can be mounted by pods using the `clusterTrustBundle` projection.  All service accounts have read access to ClusterTrustBundles by default.  Users who only have namespace-level access to a cluster can read ClusterTrustBundles by impersonating a serviceaccount that they have access to.
-->
ClusterTrustBundle 是一個集羣範圍的容器，用於存放 X.509 信任錨（根證書）。

ClusterTrustBundle 對象被視爲可被集羣中的任何已通過身份驗證的用戶讀取，
因爲此對象可以由使用 `clusterTrustBundle` 投射的 Pod 掛載。
所有服務賬號默認都有對 ClusterTrustBundle 的讀取權限。
對於僅對集羣具有命名空間級訪問權限的用戶，可以通過僞裝他們可以訪問的服務賬號來讀取 ClusterTrustBundle。

<!--
It can be optionally associated with a particular assigner, in which case it contains one valid set of trust anchors for that signer. Signers may have multiple associated ClusterTrustBundles; each is an independent set of trust anchors for that signer. Admission control is used to enforce that only users with permissions on the signer can create or modify the corresponding bundle.
-->
ClusterTrustBundle 可以選擇與特定的簽名程序相關聯，此時它包含該簽名程序的一組有效信任錨。
簽名程序可以有多個關聯的 ClusterTrustBundle；
對於該簽名程序而言每個 ClusterTrustBundle 都是獨立的一組信任錨。
准入控制用於確保只有對簽名程序有訪問權限的用戶才能創建或修改相應的捆綁包。

<hr>

- **apiVersion**: certificates.k8s.io/v1beta1

- **kind**: ClusterTrustBundle

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata contains the object metadata.

- **spec** (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundleSpec" >}}">ClusterTrustBundleSpec</a>), required

  spec contains the signer (if any) and trust anchors.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata 包含對象的元數據。

- **spec** (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundleSpec" >}}">ClusterTrustBundleSpec</a>)，必需

  spec 包含簽名程序（如果有）和信任錨。

## ClusterTrustBundleSpec {#ClusterTrustBundleSpec}

<!--
ClusterTrustBundleSpec contains the signer and trust anchors.
-->
ClusterTrustBundleSpec 包含簽名程序和信任錨。

<hr>

<!--
- **trustBundle** (string), required

  trustBundle contains the individual X.509 trust anchors for this bundle, as PEM bundle of PEM-wrapped, DER-formatted X.509 certificates.
-->
- **trustBundle** (string)，必需

  trustBundle 包含此捆綁包的各個 X.509 信任錨，這個 PEM 捆綁包是採用 PEM 包裝的 DER 格式的若干 X.509 證書。

  <!--
  The data must consist only of PEM certificate blocks that parse as valid X.509 certificates.  Each certificate must include a basic constraints extension with the CA bit set.  The API server will reject objects that contain duplicate certificates, or that use PEM block headers.
  
  Users of ClusterTrustBundles, including Kubelet, are free to reorder and deduplicate certificate blocks in this file according to their own logic, as well as to drop PEM block headers and inter-block data.
  -->
  數據必須僅由可解析爲有效 X.509 證書的 PEM 證書塊組成。
  每個證書必須包含設置了 CA 標誌的基本約束擴展。
  API 服務器將拒絕包含重複證書或使用 PEM 塊頭的對象。
  
  ClusterTrustBundles 的使用者（包括 kubelet）可以根據自己的邏輯對此文件中的證書塊進行重新排序和去重，
  也可以刪除 PEM 塊頭和塊間數據。

<!--
- **signerName** (string)

  signerName indicates the associated signer, if any.
  
  In order to create or update a ClusterTrustBundle that sets signerName, you must have the following cluster-scoped permission: group=certificates.k8s.io resource=signers resourceName=\<the signer name> verb=attest.
-->
- **signerName** (string)

  signerName 表示關聯的簽名程序（如果有）。
  
  要創建或更新設置了 signerName 屬性的 ClusterTrustBundle，你必須具備以下集羣範圍的權限：

  <code>
  group=certificates.k8s.io
  resource=signers
  resourceName=\<簽名程序名稱>
  verb=attest
  </code>

  <!--
  If signerName is not empty, then the ClusterTrustBundle object must be named with the signer name as a prefix (translating slashes to colons). For example, for the signer name `example.com/foo`, valid ClusterTrustBundle object names include `example.com:foo:abc` and `example.com:foo:v1`.
  
  If signerName is empty, then the ClusterTrustBundle object's name must not have such a prefix.
  
  List/watch requests for ClusterTrustBundles can filter on this field using a `spec.signerName=NAME` field selector.
  -->
  如果 signerName 不爲空，則 ClusterTrustBundle 對象的名稱必須以簽名程序名稱作爲前綴（將斜槓轉換爲冒號）。
  例如，對於簽名程序名稱 `example.com/foo`，有效的 ClusterTrustBundle 對象名稱包括
  `example.com:foo:abc` 和 `example.com:foo:v1`。
  
  如果 signerName 爲空，則 ClusterTrustBundle 對象的名稱不能具有此類前綴。
  
  針對 ClusterTrustBundles 的列舉/監視請求可以使用 `spec.signerName=NAME`
  字段選擇算符針對此字段進行過濾。

## ClusterTrustBundleList {#ClusterTrustBundleList}

<!--
ClusterTrustBundleList is a collection of ClusterTrustBundle objects
-->
ClusterTrustBundleList 是 ClusterTrustBundle 對象的集合。

<hr>

- **apiVersion**: certificates.k8s.io/v1beta1

- **kind**: ClusterTrustBundleList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata contains the list metadata.

- **items** ([]<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>), required

  items is a collection of ClusterTrustBundle objects
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata 包含列表的元數據。

- **items** ([]<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>)，必需

  items 是 ClusterTrustBundle 對象的集合。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified ClusterTrustBundle

#### HTTP Request
-->
### `get` 讀取指定的 ClusterTrustBundle

#### HTTP 請求

GET /apis/certificates.k8s.io/v1beta1/clustertrustbundles/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ClusterTrustBundle

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ClusterTrustBundle 的名稱。

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ClusterTrustBundle

#### HTTP Request
-->
### `list` 列舉或監視類別爲 ClusterTrustBundle 的對象

#### HTTP 請求

GET /apis/certificates.k8s.io/v1beta1/clustertrustbundles

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
#### 參數

- **allowWatchBookmarks**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundleList" >}}">ClusterTrustBundleList</a>): OK

401: Unauthorized

<!--
### `create` create a ClusterTrustBundle

#### HTTP Request
-->
### `create` 創建 ClusterTrustBundle

#### HTTP 請求

POST /apis/certificates.k8s.io/v1beta1/clustertrustbundles

<!--
#### Parameters
- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

202 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ClusterTrustBundle

#### HTTP Request
-->
### `update` 替換指定的 ClusterTrustBundle

#### HTTP 請求

PUT /apis/certificates.k8s.io/v1beta1/clustertrustbundles/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ClusterTrustBundle

- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ClusterTrustBundle 的名稱。

- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ClusterTrustBundle

#### HTTP Request
-->
### `patch` 部分更新指定的 ClusterTrustBundle

#### HTTP 請求

PATCH /apis/certificates.k8s.io/v1beta1/clustertrustbundles/{name}

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
#### 參數

- **name**（**路徑參數**）：string，必需

  ClusterTrustBundle 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: Unauthorized

<!--
### `delete` delete a ClusterTrustBundle

#### HTTP Request
-->
### `delete` 刪除 ClusterTrustBundle

#### HTTP 請求

DELETE /apis/certificates.k8s.io/v1beta1/clustertrustbundles/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ClusterTrustBundle

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ClusterTrustBundle 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ClusterTrustBundle

#### HTTP Request
-->
### `deletecollection` 刪除 ClusterTrustBundle 的集合

#### HTTP 請求

DELETE /apis/certificates.k8s.io/v1beta1/clustertrustbundles

<!--
#### Parameters

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
-->
#### 參數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
