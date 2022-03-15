---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "类型化局部对象引用包含足够的信息，可以让您在同一个名称空间中定位类型化引用对象。"
title: "类型化局部对象引用"
weight: 13
auto_generated: true
---

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

类型化局部对象引用包含足够的信息，可以让您在同一个名称空间中定位类型化引用对象。


<hr>

- **kind** (string), 必须的

  Kind 是被引用的资源的类型

- **name** (string), 必须的

  Name 是被引用的资源的名称

- **apiGroup** (string)

  APIGroup 是被引用资源的组。如果不指定 APIGroup，则指定的 Kind 必须在核心 API 组中。对于任何其它第三方类型，都需要 APIGroup。





