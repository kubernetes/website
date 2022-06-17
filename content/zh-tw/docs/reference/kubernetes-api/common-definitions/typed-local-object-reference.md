---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference 包含足夠的資訊，可以讓你在同一個名稱空間中定位指定型別的引用物件。"
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

TypedLocalObjectReference 包含足夠的資訊，可以讓你在同一個名稱空間中定位特定型別的引用物件。
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

- **kind** (string), 必需

  Kind 是被引用的資源的型別

- **name** (string), 必需

  Name 是被引用的資源的名稱

- **apiGroup** (string)

  APIGroup 是被引用資源的組。如果不指定 APIGroup，則指定的 Kind 必須在核心 API 組中。對於任何其它第三方型別，都需要 APIGroup。





