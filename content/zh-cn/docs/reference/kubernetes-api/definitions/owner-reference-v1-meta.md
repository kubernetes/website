---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "OwnerReference"
content_type: "api_reference"
description: "OwnerReference 包含足以识别所属对象的信息。所属对象必须与从属对象位于同一命名空间，或者是集群作用域对象，因此其中不包含命名空间字段。"
title: "OwnerReference"
weight: 330
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "OwnerReference"
content_type: "api_reference"
description: "OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field."
title: "OwnerReference"
weight: 330
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

## OwnerReference {#OwnerReference}

<!--
OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field.
-->
OwnerReference 包含足以识别所属对象的信息。
所属对象必须与从属对象位于同一命名空间，或者是集群作用域对象，
因此其中不包含命名空间字段。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      API version of the referent.
      -->
      被引用对象的 API 版本。
      </td>
    </tr>
    <tr>
      <td><code>blockOwnerDeletion</code><br/><em>boolean</em></td>
      <td>
      <!--
      If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. See https://kubernetes.io/docs/concepts/architecture/garbage-collection/#foreground-deletion for how the garbage collector interacts with this field and enforces the foreground deletion. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned.
      -->
      如果该值为 true，且所属对象（owner）拥有 "foregroundDeletion"
      终结器（finalizer），则在移除此引用之前，该所属对象无法从键值存储中被删除。
      关于垃圾回收器如何与该字段交互并强制执行前台删除，请参阅
      https://kubernetes.io/zh-cn/docs/concepts/architecture/garbage-collection/#foreground-deletion。
      默认值为 false。设置此字段需要用户拥有针对该所属对象的 "delete" 权限，否则将返回 422（Unprocessable Entity）错误。
      </td>
    </tr>
    <tr>
      <td><code>controller</code><br/><em>boolean</em></td>
      <td>
      <!--
      If true, this reference points to the managing controller.
      -->
      如果为 true，此引用指向管理控制器。
      </td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      kind 引用。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names
      -->
      被引用对象的名称。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#names
      </td>
    </tr>
    <tr>
      <td><code>uid</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>
      <!--
      UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids
      -->
      被引用对象的 UID。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names#uids
      </td>
    </tr>
  </tbody>
</table>

