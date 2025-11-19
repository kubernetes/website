---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "LocalObjectReference"
content_type: "api_reference"
description: "LocalObjectReference 包含足夠的信息，可以讓你在同一命名空間內找到引用的對象。"
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
LocalObjectReference 包含足夠的信息，可以讓你在同一命名空間（namespace）內找到引用的對象。

<hr>

<!--
- **name** (string)

  Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
-->
- **name** (string)

  被引用者的名稱。該字段實際上是必需的，但由於向後兼容性允許爲空。
  這種類型的實例如果此處具有空值，幾乎肯定是錯誤的。
  更多信息：https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names。
