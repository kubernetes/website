---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "LocalObjectReference"
content_type: "api_reference"
description: "LocalObjectReference 包含足夠的資訊，可以讓你在同一名稱空間內找到引用的物件。"
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
LocalObjectReference 包含足夠的資訊，可以讓你在同一名稱空間（namespace）內找到引用的物件。

<hr>

<!--
- **name** (string)

  Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
-->
- **name** (string)

  被引用者的名稱。
  更多資訊: https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names。




