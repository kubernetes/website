---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ObjectReference"
content_type: "api_reference"
description: "ObjectReference 包含足夠的資訊，可以讓你檢查或修改引用的物件。"
title: "ObjectReference"
weight: 8
auto_generated: true
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

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->



`import "k8s.io/api/core/v1"`

<!--
ObjectReference contains enough information to let you inspect or modify the referred object.

<hr>
-->

ObjectReference包含足夠的資訊，允許你檢查或修改引用的物件。

<hr>


<!--
- **apiVersion** (string)

  API version of the referent.

- **fieldPath** (string)

  If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: "spec.containers{name}" (where "name" refers to the name of the container that triggered the event) or if no container name is specified "spec.containers[2]" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object.

- **kind** (string)

  Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **name** (string)

  Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

- **namespace** (string)

  Namespace of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/

- **resourceVersion** (string)

  Specific resourceVersion to which this reference is made, if any. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **uid** (string)

  UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids
-->

- **apiVersion** (string)

  被引用者的 API 版本。

- **fieldPath** (string)

  如果引用的是物件的某個物件是整個物件，則該字串而不是應包含的 JSON/Go 欄位有效訪問語句，
  例如 `desiredState.manifest.containers[ 2 ]`。例如，如果物件引用針對的是 Pod 中的一個容器，
  此欄位取值類似於：`spec.containers{name}`（`name` 指觸發的容器的名稱），
  或者如果沒有指定容器名稱，`spec.containers[ 2 ]`（此 Pod 中索引為 2 的容器）。
  選擇這種只是為了有一些定義好的語法來引用物件的部分。

- **kind** (string)

  被引用者的類別（kind）。更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **name** (string)

  被引用物件的名稱。更多資訊： https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

- **namespace** (string)

  被引用物件的名字空間。更多資訊： https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/

- **resourceVersion** (string)

  被引用物件的特定資源版本（如果有）。更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **uid** (string)

  被引用物件的UID。更多資訊： https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids

