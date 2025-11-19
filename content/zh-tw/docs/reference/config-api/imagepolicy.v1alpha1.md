---
title: Image Policy API (v1alpha1)
content_type: tool-reference
package: imagepolicy.k8s.io/v1alpha1
---

<!--
## Resource Types
-->
## 資源類型   {#resource-types}

- [ImageReview](#imagepolicy-k8s-io-v1alpha1-ImageReview)

## `ImageReview`     {#imagepolicy-k8s-io-v1alpha1-ImageReview}

<p>
<!--
ImageReview checks if the set of images in a pod are allowed.
-->
<code>ImageReview<code> 檢查某個 Pod 中是否可以使用某些映像檔。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>imagepolicy.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ImageReview</code></td></tr>

<tr><td><code>metadata</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#objectmeta-v1-meta"><code>meta/v1.ObjectMeta</code></a>
</td>
<td>
<p>
  <!--
   Standard object's metadata.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</p>
  -->
  標準的對象元數據。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
</p>

  <!--
  Refer to the Kubernetes API documentation for the fields of the <code>metadata</code> field.
  -->
  參閱 Kubernetes API 文檔瞭解 <code>metadata</code> 字段的內容。
</td>

</tr>
<tr><td><code>spec</code> <B>[必需]</B><br/>
<a href="#imagepolicy-k8s-io-v1alpha1-ImageReviewSpec"><code>ImageReviewSpec</code></a>
</td>
<td>
  <p>
  <!--
  Spec holds information about the pod being evaluated
  -->
  <code>spec</code> 中包含與被評估的 Pod 相關的信息。
  </p>
</td>
</tr>
<tr><td><code>status</code><br/>
<a href="#imagepolicy-k8s-io-v1alpha1-ImageReviewStatus"><code>ImageReviewStatus</code></a>
</td>
<td>
  <p>
  <!--
  Status is filled in by the backend and indicates whether the pod should be allowed.
  -->
  <code>status</code> 由後臺負責填充，用來標明 Pod 是否會被准入。
  </p>
</td>
</tr>
</tbody>
</table>

## `ImageReviewContainerSpec`     {#imagepolicy-k8s-io-v1alpha1-ImageReviewContainerSpec}

<!--
**Appears in:**
-->
**出現在：**

- [ImageReviewSpec](#imagepolicy-k8s-io-v1alpha1-ImageReviewSpec)

<p>
<!--
ImageReviewContainerSpec is a description of a container within the pod creation request.
-->
<code>ImageReviewContainerSpec</code> 是對 Pod 創建請求中的某容器的描述。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>image</code><br/>
<code>string</code>
</td>
<td>
  <p>
  <!--
  This can be in the form image:tag or image@SHA:012345679abcdef.
  -->
  此字段的格式可以是 <code>image:tag</code> 或 <code>image@SHA:012345679abcdef</code>。
  </p>
</td>
</tr>
</tbody>
</table>

## `ImageReviewSpec`     {#imagepolicy-k8s-io-v1alpha1-ImageReviewSpec}

<!--
**Appears in:**
-->
**出現在：**

- [ImageReview](#imagepolicy-k8s-io-v1alpha1-ImageReview)

<p>
<!--
ImageReviewSpec is a description of the pod creation request.
-->
<code>ImageReviewSpec</code> 是對 Pod 創建請求的描述。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>containers</code><br/>
<a href="#imagepolicy-k8s-io-v1alpha1-ImageReviewContainerSpec"><code>[]ImageReviewContainerSpec</code></a>
</td>
<td>
  <p>
  <!--
  Containers is a list of a subset of the information in each container of the Pod being created.
  -->
  <code>containers</code> 是一個列表，其中包含正被創建的 Pod 中各容器的信息子集。
  </p>
</td>
</tr>
<tr><td><code>annotations</code><br/>
<code>map[string]string</code>
</td>
<td>
<p>
  <!--
  Annotations is a list of key-value pairs extracted from the Pod's annotations.
It only includes keys which match the pattern <code>*.image-policy.k8s.io/*</code>.
It is up to each webhook backend to determine how to interpret these annotations, if at all.
  -->
  <code>annotations</code> 是一個鍵值對列表，內容抽取自 Pod 的註解（<code>annotations<code>）。
其中僅包含與模式 <code>*.image-policy.k8s.io/*</code> 匹配的鍵。
每個 Webhook 後端要負責決定如何解釋這些註解（如果有的話）。
</p>

</td>
</tr>
<tr><td><code>namespace</code><br/>
<code>string</code>
</td>
<td>
  <p>
  <!--
  Namespace is the namespace the pod is being created in.
  -->
  <code>namespace</code> 是 Pod 創建所針對的名字空間。
  </p>
</td>
</tr>
</tbody>
</table>

## `ImageReviewStatus`     {#imagepolicy-k8s-io-v1alpha1-ImageReviewStatus}

<!--
**Appears in:**
-->
**出現在：**

- [ImageReview](#imagepolicy-k8s-io-v1alpha1-ImageReview)

<p>
<!--
ImageReviewStatus is the result of the review for the pod creation request.
-->
<code>ImageReviewStatus</code> 是針對 Pod 創建請求所作的評估結果。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>allowed</code> <B>[必需]</B><br/>
<code>bool</code>
</td>
<td>
  <p>
  <!--
  Allowed indicates that all images were allowed to be run.
  -->
  <code>allowed</code> 表明所有映像檔都可以被運行。
  </p>
</td>
</tr>
<tr><td><code>reason</code><br/>
<code>string</code>
</td>
<td>
<p>
<!--
Reason should be empty unless Allowed is false in which case it
may contain a short description of what is wrong.  Kubernetes
may truncate excessively long errors when displaying to the user.
-->
若 <code>allowed</code> 不是 false，<code>reason</code> 應該爲空。
否則其中應包含出錯信息的簡短描述。Kubernetes 在向使用者展示此信息時可能會截斷過長的錯誤文字。
</p>
</td>
</tr>
<tr><td><code>auditAnnotations</code><br/>
<code>map[string]string</code>
</td>
<td>
<p>
<!--
AuditAnnotations will be added to the attributes object of the
admission controller request using 'AddAnnotation'.  The keys should
be prefix-less (i.e., the admission controller will add an
appropriate prefix).
-->
<code>auditAnnotations</code> 會被通過 <code>AddAnnotation</code> 添加到准入控制器的 attributes 對象上。
註解鍵應該不含前綴，換言之，准入控制器會添加合適的前綴。
</p>
</td>
</tr>
</tbody>
</table>
