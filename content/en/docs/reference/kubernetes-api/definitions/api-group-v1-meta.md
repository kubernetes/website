---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "APIGroup"
content_type: "api_reference"
description: "APIGroup contains the name, the supported versions, and the preferred version of a group."
title: "APIGroup"
weight: 20
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


## APIGroup {#APIGroup}

APIGroup contains the name, the supported versions, and the preferred version of a group.

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
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name is the name of the group.</td>
    </tr>
    <tr>
      <td><code>preferredVersion</code><br/><em><a href="{{< ref "group-version-for-discovery-v1-meta#GroupVersionForDiscovery" >}}">GroupVersionForDiscovery</a></em></td>
      <td>preferredVersion is the version preferred by the API server, which probably is the storage version.</td>
    </tr>
    <tr>
      <td><code>serverAddressByClientCIDRs</code><br/><em><a href="{{< ref "server-address-by-client-cidr-v1-meta#ServerAddressByClientCIDR" >}}">ServerAddressByClientCIDR array</a></em></td>
      <td>a map of client CIDR to server address that is serving this group. This is to help clients reach servers in the most network-efficient way possible. Clients can use the appropriate server address as per the CIDR that they match. In case of multiple matches, clients should use the longest matching CIDR. The server returns only those CIDRs that it thinks that the client can match. For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP. Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP.</td>
    </tr>
    <tr>
      <td><code>versions</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "group-version-for-discovery-v1-meta#GroupVersionForDiscovery" >}}">GroupVersionForDiscovery array</a></em></td>
      <td>versions are the versions supported in this group.</td>
    </tr>
  </tbody>
</table>


## APIGroupList {#APIGroupList}

APIGroupList is a list of APIGroup, to allow clients to discover the API at /apis.

<hr>

<table>
  <thead><tr><th>Field</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</td>
    </tr>
    <tr>
      <td><code>groups</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "api-group-v1-meta#APIGroup" >}}">APIGroup array</a></em></td>
      <td>groups is a list of APIGroup.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</td>
    </tr>
  </tbody>
</table>









