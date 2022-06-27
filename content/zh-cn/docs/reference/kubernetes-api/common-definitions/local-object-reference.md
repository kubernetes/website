---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "LocalObjectReference"
content_type: "api_reference"
description: "LocalObjectReference 包含足够的信息，可以让你在同一命名空间内找到引用的对象。"
title: "LocalObjectReference"
weight: 4
auto_generated: true
---

<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "LocalObjectReference"
content_type: "api_reference"
description: "LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace."
title: "LocalObjectReference"
weight: 4
auto_generated: true
-->

`import "k8s.io/api/core/v1"`

<!--
LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace.
-->
LocalObjectReference 包含足够的信息，可以让你在同一命名空间（namespace）内找到引用的对象。

<hr>

<!--
- **name** (string)

  Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
-->
- **name** (string)

  被引用者的名称。
  更多信息: https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names。




