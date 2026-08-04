---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ObjectReference"
content_type: "api_reference"
description: "ObjectReference 包含足够的信息，使你能够检查或修改所引用的对象。"
title: "ObjectReference"
weight: 320
---

<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ObjectReference"
content_type: "api_reference"
description: "ObjectReference contains enough information to let you inspect or modify the referred object."
title: "ObjectReference"
weight: 320
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## ObjectReference {#ObjectReference}

<!--
ObjectReference contains enough information to let you inspect or modify the referred object.
-->
ObjectReference 包含足够的信息，使你能够检查或修改所引用的对象。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>
      <!--
      API version of the referent.
      -->
      引用对象的 API 版本。
      </td>
    </tr>
    <tr>
      <td><code>fieldPath</code><br/><em>string</em></td>
      <td>
      <!--
      If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: "spec.containers{name}" (where "name" refers to the name of the container that triggered the event) or if no container name is specified "spec.containers[2]" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object.
      -->
      如果引用的是对象的某个部分而非整个对象，该字符串应包含有效的 JSON 或 Go 语言风格的字段访问语句，
      例如 `desiredState.manifest.containers[2]`。例如，若对象引用指向 Pod 中的某个容器，
      其值可能为 `"spec.containers{name}"`（其中 `name` 指代触发该事件的容器名称），
      或者若未指定容器名称，则为 `"spec.containers[2]"`（指该 Pod 中索引为 2 的容器）。
      采用这种语法，仅仅是为了提供一种明确的方式来引用对象的特定部分。
      </td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>
      <!--
      Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      -->
      引用对象的类型。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
      </td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>
      <!--
      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
      -->
      引用对象的名称。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names
      </td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>
      <!--
      Namespace of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
      -->
      引用对象的命名空间。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces/
      </td>
    </tr>
    <tr>
      <td><code>resourceVersion</code><br/><em>string</em></td>
      <td>
      <!--
      Specific resourceVersion to which this reference is made, if any. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
      -->
      该引用所指向的具体 resourceVersion（如有）。更多信息：
      https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
      </td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>
      <!--
      UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids
      -->
      引用对象的唯一标识符（UID）。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#uids
      </td>
    </tr>
  </tbody>
</table>
