---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ResourceFieldSelector"
content_type: "api_reference"
description: "ResourceFieldSelector represents container resources (cpu, memory) and their output format."
title: "ResourceFieldSelector"
weight: 19
---



`import "k8s.io/api/core/v1"`


ResourceFieldSelector represents container resources (cpu, memory) and their output format

<hr>

- **resource** (string), required

  Required: resource to select

- **containerName** (string)

  Container name: required for volumes, optional for env vars

- **divisor** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Specifies the output format of the exposed resources, defaults to "1"





