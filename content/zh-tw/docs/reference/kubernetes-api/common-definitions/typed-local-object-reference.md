---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference 包含足夠的資訊，可以讓你在同一個名稱空間中定位指定類型的引用對象。"
title: "TypedLocalObjectReference"
weight: 13
---
<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace."
title: "TypedLocalObjectReference"
weight: 13
auto_generated: true
-->

`import "k8s.io/api/core/v1"`

<!--
TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace.
-->
TypedLocalObjectReference 包含足夠的資訊，可以讓你在同一個名稱空間中定位特定類型的引用對象。

<hr>

<!--
- **kind** (string), required

  Kind is the type of resource being referenced

- **name** (string), required

  Name is the name of resource being referenced

- **apiGroup** (string)

  APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.
-->
- **kind** (string)，必需

  kind 是被引用的資源的類型。

- **name** (string)，必需

  name 是被引用的資源的名稱。

- **apiGroup** (string)

  apiGroup 是被引用資源的組。如果不指定 apiGroup，則指定的 kind 必須在覈心 API 組中。
  對於任何其它第三方類型，都需要 apiGroup。
