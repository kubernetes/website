---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ObjectFieldSelector"
content_type: "api_reference"
description: "ObjectFieldSelector selects an APIVersioned field of an object."
title: "ObjectFieldSelector"
weight: 6
---



`import "k8s.io/api/core/v1"`


ObjectFieldSelector selects an APIVersioned field of an object.

<hr>

- **fieldPath** (string), required

  Path of the field to select in the specified API version.

- **apiVersion** (string)

  Version of the schema the FieldPath is written in terms of, defaults to "v1".





