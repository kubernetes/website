---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ObjectReference"
content_type: "api_reference"
description: "ObjectReference 包含足夠的資訊，可以讓你檢查或修改引用的對象。"
title: "ObjectReference"
weight: 8
---
<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ObjectReference"
content_type: "api_reference"
description: "ObjectReference contains enough information to let you inspect or modify the referred object."
title: "ObjectReference"
weight: 8
auto_generated: true
-->

`import "k8s.io/api/core/v1"`

<!--
ObjectReference contains enough information to let you inspect or modify the referred object.
-->
ObjectReference 包含足夠的資訊，允許你檢查或修改引用的對象。

<hr>

<!--
- **apiVersion** (string)

  API version of the referent.

- **fieldPath** (string)

  If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: "spec.containers{name}" (where "name" refers to the name of the container that triggered the event) or if no container name is specified "spec.containers[2]" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object.
-->
- **apiVersion** (string)

  被引用者的 API 版本。

- **fieldPath** (string)

  如果引用的是對象的某個對象是整個對象，則該字符串而不是應包含的 JSON/Go 字段有效訪問語句，
  例如 `desiredState.manifest.containers[ 2 ]`。例如，如果對象引用針對的是 Pod 中的一個容器，
  此字段取值類似於：`spec.containers{name}`（`name` 指觸發的容器的名稱），
  或者如果沒有指定容器名稱，`spec.containers[ 2 ]`（此 Pod 中索引爲 2 的容器）。
  選擇這種只是爲了有一些定義好的語法來引用對象的部分。

<!--
- **kind** (string)

  Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **name** (string)

  Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

- **namespace** (string)

  Namespace of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
-->
- **kind** (string)

  被引用者的類別（kind）。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **name** (string)

  被引用對象的名稱。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

- **namespace** (string)

  被引用對象的名字空間。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces/

<!--
- **resourceVersion** (string)

  Specific resourceVersion to which this reference is made, if any. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **uid** (string)

  UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids
-->
- **resourceVersion** (string)

  被引用對象的特定資源版本（如果有）。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **uid** (string)

  被引用對象的 UID。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#uids
