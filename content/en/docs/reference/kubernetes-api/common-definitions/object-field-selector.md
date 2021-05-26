---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ObjectFieldSelector"
content_type: "api_reference"
description: "ObjectFieldSelector selects an APIVersioned field of an object."
title: "ObjectFieldSelector"
weight: 6
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


ObjectFieldSelector selects an APIVersioned field of an object.

<hr>

- **fieldPath** (string), required

  Path of the field to select in the specified API version.

- **apiVersion** (string)

  Version of the schema the FieldPath is written in terms of, defaults to "v1".





