---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference 包含足够的信息，可以让你在同一个名称空间中定位指定类型的引用对象。"
title: "TypedLocalObjectReference"
weight: 13
auto_generated: true
---
<!--
---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace."
title: "TypedLocalObjectReference"
weight: 13
auto_generated: true
---
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
TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace.
-->

TypedLocalObjectReference 包含足够的信息，可以让你在同一个名称空间中定位特定类型的引用对象。
<!--
<hr>

- **kind** (string), required

  Kind is the type of resource being referenced

- **name** (string), required

  Name is the name of resource being referenced

- **apiGroup** (string)

  APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.
-->

<hr>

- **kind** (string)，必需

  Kind 是被引用的资源的类型

- **name** (string)，必需

  Name 是被引用的资源的名称

- **apiGroup** (string)

  APIGroup 是被引用资源的组。如果不指定 APIGroup，则指定的 Kind 必须在核心 API 组中。对于任何其它第三方类型，都需要 APIGroup。





