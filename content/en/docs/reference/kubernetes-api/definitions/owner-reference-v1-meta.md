---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "OwnerReference"
content_type: "api_reference"
description: "OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field."
title: "OwnerReference"
weight: 330
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

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## OwnerReference {#OwnerReference}

OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>API version of the referent.</td>
    </tr>
    <tr>
      <td><code>blockOwnerDeletion</code><br/><em>boolean</em></td>
      <td>If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. See https://kubernetes.io/docs/concepts/architecture/garbage-collection/#foreground-deletion for how the garbage collector interacts with this field and enforces the foreground deletion. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned.</td>
    </tr>
    <tr>
      <td><code>controller</code><br/><em>boolean</em></td>
      <td>If true, this reference points to the managing controller.</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names</td>
    </tr>
    <tr>
      <td><code>uid</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids</td>
    </tr>
  </tbody>
</table>









