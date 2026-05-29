---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "SelfSubjectReview"
content_type: "api_reference"
description: "SelfSubjectReview contains the user information that the kube-apiserver has about the user making this request. When using impersonation, users will receive the user info of the user being impersonated.  If impersonation or request header authentication is used, any extra keys will have their case ignored and returned as lowercase."
title: "SelfSubjectReview"
weight: 460
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

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`


## SelfSubjectReview {#SelfSubjectReview}

SelfSubjectReview contains the user information that the kube-apiserver has about the user making this request. When using impersonation, users will receive the user info of the user being impersonated.  If impersonation or request header authentication is used, any extra keys will have their case ignored and returned as lowercase.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>metadata is standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#SelfSubjectReviewStatus" >}}">SelfSubjectReviewStatus</a></em></td>
      <td>status is filled in by the server with the user attributes.</td>
    </tr>
  </tbody>
</table>


## SelfSubjectReviewStatus {#SelfSubjectReviewStatus}

SelfSubjectReviewStatus is filled by the kube-apiserver and sent back to a user.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>userInfo</code><br/><em><a href="{{< ref "user-info-v1-authentication#UserInfo" >}}">UserInfo</a></em></td>
      <td>userInfo is a set of attributes belonging to the user making this request.</td>
    </tr>
  </tbody>
</table>









