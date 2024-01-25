---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ResourceFieldSelector"
content_type: "api_reference"
description: "ResourceFieldSelector 表示容器资源（CPU，内存）及其输出格式。"
title: "ResourceFieldSelector"
weight: 11
---
<!-- 
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ResourceFieldSelector"
content_type: "api_reference"
description: "ResourceFieldSelector represents container resources (cpu, memory) and their output format."
title: "ResourceFieldSelector"
weight: 11
auto_generated: true
-->

`import "k8s.io/api/core/v1"`

<!--
ResourceFieldSelector represents container resources (cpu, memory) and their output format
-->
ResourceFieldSelector 表示容器资源（CPU，内存）及其输出格式。

<hr>

- **resource** (string)，必需

  <!--
  Required: resource to select
  -->
  必需：选择的资源。

- **containerName** (string)

  <!--
  Container name: required for volumes, optional for env vars
  -->
  容器名称：对卷必需，对环境变量可选。

- **divisor** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!--
  Specifies the output format of the exposed resources, defaults to "1"
  -->
  指定所公开的资源的输出格式，默认值为 “1”。
