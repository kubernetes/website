---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "TokenReview"
content_type: "api_reference"
description: "TokenReview attempts to authenticate a token to a known user. Note: TokenReview requests may be cached by the webhook token authenticator plugin in the kube-apiserver."
title: "TokenReview"
weight: 580
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


## TokenReview {#TokenReview}

TokenReview attempts to authenticate a token to a known user. Note: TokenReview requests may be cached by the webhook token authenticator plugin in the kube-apiserver.

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
      <td>metadata is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#TokenReviewSpec" >}}">TokenReviewSpec</a></em></td>
      <td>spec holds information about the request being evaluated</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#TokenReviewStatus" >}}">TokenReviewStatus</a></em></td>
      <td>status is filled in by the server and indicates whether the request can be authenticated.</td>
    </tr>
  </tbody>
</table>


## TokenReviewSpec {#TokenReviewSpec}

TokenReviewSpec is a description of the token authentication request.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>audiences</code><br/><em>string array</em></td>
      <td>audiences is a list of the identifiers that the resource server presented with the token identifies as. Audience-aware token authenticators will verify that the token was intended for at least one of the audiences in this list. If no audiences are provided, the audience will default to the audience of the Kubernetes apiserver.</td>
    </tr>
    <tr>
      <td><code>token</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>token is the opaque bearer token.</td>
    </tr>
  </tbody>
</table>


## TokenReviewStatus {#TokenReviewStatus}

TokenReviewStatus is the result of the token authentication request.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>audiences</code><br/><em>string array</em></td>
      <td>audiences are audience identifiers chosen by the authenticator that are compatible with both the TokenReview and token. An identifier is any identifier in the intersection of the TokenReviewSpec audiences and the token's audiences. A client of the TokenReview API that sets the spec.audiences field should validate that a compatible audience identifier is returned in the status.audiences field to ensure that the TokenReview server is audience aware. If a TokenReview returns an empty status.audience field where status.authenticated is "true", the token is valid against the audience of the Kubernetes API server.</td>
    </tr>
    <tr>
      <td><code>authenticated</code><br/><em>boolean</em></td>
      <td>authenticated indicates that the token was associated with a known user.</td>
    </tr>
    <tr>
      <td><code>error</code><br/><em>string</em></td>
      <td>error indicates that the token couldn't be checked</td>
    </tr>
    <tr>
      <td><code>user</code><br/><em><a href="{{< ref "user-info-v1-authentication#UserInfo" >}}">UserInfo</a></em></td>
      <td>user is the UserInfo associated with the provided token.</td>
    </tr>
  </tbody>
</table>









