---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ObjectReference"
content_type: "api_reference"
description: "ObjectReference contains enough information to let you inspect or modify the referred object."
title: "ObjectReference"
weight: 320
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

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## ObjectReference {#ObjectReference}

ObjectReference contains enough information to let you inspect or modify the referred object.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>API version of the referent.</td>
    </tr>
    <tr>
      <td><code>fieldPath</code><br/><em>string</em></td>
      <td>If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: "spec.containers{name}" (where "name" refers to the name of the container that triggered the event) or if no container name is specified "spec.containers[2]" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</td>
    </tr>
    <tr>
      <td><code>name</code><br/><em>string</em></td>
      <td>Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</td>
    </tr>
    <tr>
      <td><code>namespace</code><br/><em>string</em></td>
      <td>Namespace of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code><br/><em>string</em></td>
      <td>Specific resourceVersion to which this reference is made, if any. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency</td>
    </tr>
    <tr>
      <td><code>uid</code><br/><em>string</em></td>
      <td>UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids</td>
    </tr>
  </tbody>
</table>









