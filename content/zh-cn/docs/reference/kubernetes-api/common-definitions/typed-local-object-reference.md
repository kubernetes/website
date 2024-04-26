---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference 包含足够的信息，可以让你在同一个名称空间中定位指定类型的引用对象。"
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
TypedLocalObjectReference 包含足够的信息，可以让你在同一个名称空间中定位特定类型的引用对象。

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

  kind 是被引用的资源的类型。

- **name** (string)，必需

  name 是被引用的资源的名称。

- **apiGroup** (string)

  apiGroup 是被引用资源的组。如果不指定 apiGroup，则指定的 kind 必须在核心 API 组中。
  对于任何其它第三方类型，都需要 apiGroup。
