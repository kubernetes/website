---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ResourceFieldSelector"
content_type: "api_reference"
description: "ResourceFieldSelector 表示容器资源（cpu、内存）及其输出格式。"
title: "ResourceFieldSelector"
weight: 11
auto_generated: true
---
<!--
---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ResourceFieldSelector"
content_type: "api_reference"
description: "ResourceFieldSelector represents container resources (cpu, memory) and their output format."
title: "ResourceFieldSelector"
weight: 11
auto_generated: true
---
-->


`import "k8s.io/api/core/v1"`

<!--
ResourceFieldSelector represents container resources (cpu, memory) and their output format
-->
ResourceFieldSelector 表示容器资源（cpu、内存）及其输出格式。

<hr>

<!--
- **resource** (string), required

  Required: resource to select

- **containerName** (string)

  Container name: required for volumes, optional for env vars

- **divisor** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Specifies the output format of the exposed resources, defaults to "1"
-->
- **resource** (string), 必选

  必选： 选择资源

- **containerName** (string)

  容器名称：卷是必选的，环境变量是可选的

- **divisor** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  指定公开资源的输出格式，默认为 "1"。




