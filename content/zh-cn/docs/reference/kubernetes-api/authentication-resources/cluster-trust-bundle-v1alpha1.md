api_metadata:
  apiVersion: "certificates.k8s.io/v1alpha1"
  import: "k8s.io/api/certificates/v1alpha1"
  kind: "ClusterTrustBundle"
content_type: "api_reference"
description: "ClusterTrustBundle是一个用于X的集群范围容器。"
title: "ClusterTrustBundle v1alpha1"
weight: 5
auto_generated: true
---

<!--
该文件是使用通用生成器从组件的Go源代码自动生成的
[generator](https://github.com/kubernetes-sigs/reference-docs/)。要了解如何
生成参考文档，请阅读
[为参考文档做贡献](/docs/contribute/generate-ref-docs/)。
要更新参考内容，请按照
[向上游做贡献](/docs/contribute/generate-ref-docs/contribute-upstream/)
指南。您可以向
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) 项目报告文档格式错误。
-->

`apiVersion: certificates.k8s.io/v1alpha1`

`import "k8s.io/api/certificates/v1alpha1"`


## ClusterTrustBundle {#ClusterTrustBundle}

ClusterTrustBundle是一个用于X.509信任锚点（根证书）的集群范围容器。

ClusterTrustBundle对象被认为是可由群集中的任何经过身份验证的用户读取的，因为它们可以通过使用`clusterTrustBundle`投影的Pod挂载。 默认情况下，所有服务帐户都可以读取ClusterTrustBundles。 只有对集群具有命名空间级别访问权限的用户可以通过模拟他们有权访问的服务帐户来读取ClusterTrustBundles。

它可以选择与特定的分配者关联，在这种情况下，它包含该签名者的一组有效的信任锚点。 签名者可能有多个关联的ClusterTrustBundles； 每个都是该签名者的独立的信任锚点集。 使用准入控制来强制执行只有具有对签名者权限的用户才能创建或修改相应的bundle。

---

- **apiVersion**: certificates.k8s.io/v1alpha1


- **kind**: ClusterTrustBundle


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata包含对象元数据。

- **spec** (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleSpec" >}}">ClusterTrustBundleSpec</a>), required

  spec包含签名者（如果有）和信任锚点。

## ClusterTrustBundleSpec {#ClusterTrustBundleSpec}

ClusterTrustBundleSpec包含签名者和信任锚点。

---

- **trustBundle** (string), required

  trustBundle包含此bundle的个别X.509信任锚点，作为PEM包装的PEM格式的X.509证书。
  
  数据必须仅由解析为有效X.509证书的PEM证书块组成。 每个证书必须包含具有CA位设置的基本约束扩展。 API服务器将拒绝包含重复证书或使用PEM块头的对象。
  
  使用ClusterTrustBundles的用户，包括Kubelet，可以根据自己的逻辑自由重新排序和去重证书块，以及删除PEM块头和块间数据。

- **signerName** (string)

  signerName表示关联的签名者（如果有）。
  
  要创建或更新设置signerName的ClusterTrustBundle，您必须具有以下集群范围的权限：group=certificates.k8s.io resource=signers resourceName=\<the signer name> verb=attest。
  
  如果signerName不为空，则ClusterTrustBundle对象的名称必须以签名者名称作为前缀（将斜杠转换为冒号）。 例如，对于签名者名称`example.com/foo`，有效的ClusterTrustBundle对象名称包括`example.com:foo:abc`和`example.com:foo:v1`。
  
  如果signerName为空，则ClusterTrustBundle对象的名称不得具有此前缀。
  
  ClusterTrustBundles的列表/观察请求可以使用`spec.signerName=NAME`字段选择器在此字段上进行过滤。

---

## ClusterTrustBundleList {#ClusterTrustBundleList}

ClusterTrustBundleList是ClusterTrustBundle对象的集合。

---

- **apiVersion**: certificates.k8s.io/v1alpha1


- **kind**: ClusterTrustBundleList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata包含列表元数据。

- **items** ([]<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>), required

  items是ClusterTrustBundle对象的集合。

---

## Operations {#Operations}



---

### `get` 读取指定的ClusterTrustBundle

#### HTTP请求

GET /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

#### 参数


- **name** (*在路径中*): 字符串, 必需

  ClusterTrustBundle的名称


- **pretty** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### 响应


200 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

401: 未经授权


### `list` 列出或观察ClusterTrustBundle类型的对象

#### HTTP请求

GET /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

#### 参数


- **allowWatchBookmarks** (*在查询中*): 布尔

  <a href="{{< ref="../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*在查询中*): 整数

  <a href="{{< ref="../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **sendInitialEvents** (*在查询中*): 布尔

  <a href="{{< ref="../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>


- **timeoutSeconds** (*在查询中*): 整数

  <a href="{{< ref="../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*在查询中*): 布尔

  <a href="{{< ref="../common-parameters/common-parameters#watch" >}}">watch</a>



#### 响应


200 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleList" >}}">ClusterTrustBundleList</a>): OK

401: 未经授权


### `create` 创建一个ClusterTrustBundle

#### HTTP请求

POST /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

#### 参数


- **body**: <a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, 必需

  


- **dryRun** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### 响应


200 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

202 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Accepted

401: 未经授权


### `update` 替换指定的ClusterTrustBundle

#### HTTP请求

PUT /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

#### 参数


- **name** (*在路径中*): 字符串, 必需

  ClusterTrustBundle的名称


- **body**: <a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, 必需

  


- **dryRun** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### 响应


200 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: 未经授权


### `patch` 部分更新指定的ClusterTrustBundle

#### HTTP请求

PATCH /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

#### 参数


- **name** (*在路径中*): 字符串, 必需

  ClusterTrustBundle的名称


- **body**: <a href="{{< ref="../common-definitions/patch#Patch" >}}">Patch</a>, 必需

  


- **dryRun** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*在查询中*): 布尔

  <a href="{{< ref="../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### 响应


200 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: 未经授权


### `delete` 删除ClusterTrustBundle

#### HTTP请求

DELETE /apis/certificates.k8s.io/v1alpha1/clustertrustbundles/{name}

#### 参数


- **name** (*在路径中*): 字符串, 必需

  ClusterTrustBundle的名称


- **dryRun** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### 响应


200 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

202 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Accepted

401: 未经授权


### `delete` 删除ClusterTrustBundle集合

#### HTTP请求

DELETE /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

#### 参数


- **dryRun** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **pretty** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>



#### 响应


200 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

202 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Accepted

401: 未经授权


### `replace` 替换所有ClusterTrustBundle

#### HTTP请求

PUT /apis/certificates.k8s.io/v1alpha1/clustertrustbundles

#### 参数


- **body**: <a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleList" >}}">ClusterTrustBundleList</a>, 必需

  


- **dryRun** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*在查询中*): 字符串

  <a href="{{< ref="../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### 响应


200 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleList" >}}">ClusterTrustBundleList</a>): OK

201 (<a href="{{< ref="../authentication-resources/cluster-trust-bundle-v1alpha1#ClusterTrustBundleList" >}}">ClusterTrustBundleList</a>): Created

401: 未经授权
