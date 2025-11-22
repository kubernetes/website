---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ResourceFieldSelector"
content_type: "api_reference"
description: "ResourceFieldSelector 表示容器資源（CPU，內存）及其輸出格式。"
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
ResourceFieldSelector 表示容器資源（CPU，內存）及其輸出格式。

<hr>

- **resource** (string)，必需

  <!--
  Required: resource to select
  -->
  必需：選擇的資源。

- **containerName** (string)

  <!--
  Container name: required for volumes, optional for env vars
  -->
  容器名稱：對卷必需，對環境變量可選。

- **divisor** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!--
  Specifies the output format of the exposed resources, defaults to "1"
  -->
  指定所公開的資源的輸出格式，預設值爲 “1”。
