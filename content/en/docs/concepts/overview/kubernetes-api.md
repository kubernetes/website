---
reviewers:
- chenopis
title: The Kubernetes API
content_type: concept
weight: 30
description: >
  The Kubernetes API lets you query and manipulate the state of objects in Kubernetes.
  The core of Kubernetes' control plane is the API server and the HTTP API that it exposes. Users, the different parts of your cluster, and external components all communicate with one another through the API server.
card:
  name: concepts
  weight: 30
---

<!-- overview -->

The core of Kubernetes' {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
is the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}. The API server
exposes an HTTP API that lets end users, different parts of your cluster, and
external components communicate with one another.

The Kubernetes API lets you query and manipulate the state of objects in the Kubernetes API
(for example: Pods, Namespaces, ConfigMaps, and Events).

Most operations can be performed through the
[kubectl](/docs/reference/kubectl/overview/) command-line interface or other
command-line tools, such as
[kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/), which in turn use the
API. However, you can also access the API directly using REST calls.

Consider using one of the [client libraries](/docs/reference/using-api/client-libraries/)
if you are writing an application using the Kubernetes API.

<!-- body -->

## OpenAPI specification {#api-specification}

Complete API details are documented using [OpenAPI](https://www.openapis.org/).

The Kubernetes API server serves an OpenAPI spec via the `/openapi/v2` endpoint.
You can request the response format using request headers as follows:

<table>
  <thead>
     <tr>
        <th>Header</th>
        <th style="min-width: 50%;">Possible values</th>
        <th>Notes</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>not supplying this header is also acceptable</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>mainly for intra-cluster use</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>default</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>serves </em><code>application/json</code></td>
     </tr>
  </tbody>
  <caption>Valid request header values for OpenAPI v2 queries</caption>
</table>

Kubernetes implements an alternative Protobuf based serialization format that
is primarily intended for intra-cluster communication. For more information
about this format, see the [Kubernetes Protobuf serialization](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) design proposal and the
Interface Definition Language (IDL) files for each schema located in the Go
packages that define the API objects.

## API changes

Any system that is successful needs to grow and change as new use cases emerge or existing ones change.
Therefore, Kubernetes has designed its features to allow the Kubernetes API to continuously change and grow.
The Kubernetes project aims to _not_ break compatibility with existing clients, and to maintain that
compatibility for a length of time so that other projects have an opportunity to adapt.

In general, new API resources and new resource fields can be added often and frequently.
Elimination of resources or fields requires following the
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).

What constitutes a compatible change, and how to change the API, are detailed in
[API changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).

## API groups and versioning

To make it easier to eliminate fields or restructure resource representations,
Kubernetes supports multiple API versions, each at a different API path, such
as `/api/v1` or `/apis/rbac.authorization.k8s.io/v1alpha1`.

Versioning is done at the API level rather than at the resource or field level
to ensure that the API presents a clear, consistent view of system resources
and behavior, and to enable controlling access to end-of-life and/or
experimental APIs.

Refer to [API versions reference](/docs/reference/using-api/api-overview/#api-versioning)
for more details on the API version level definitions.

To make it easier to evolve and to extend its API, Kubernetes implements
[API groups](/docs/reference/using-api/api-overview/#api-groups) that can be
[enabled or disabled](/docs/reference/using-api/api-overview/#enabling-or-disabling).

## API Extension

The Kubernetes API can be extended in one of two ways:

1. [Custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   let you declaratively define how the API server should provide your chosen resource API.
1. You can also extend the Kubernetes API by implementing an
   [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

## {{% heading "whatsnext" %}}

- Learn how to extend the Kubernetes API by adding your own
  [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
- [Controlling API Access](/docs/reference/access-authn-authz/controlling-access/) describes
  how the cluster manages authentication and authorization for API access.
- Learn about API endpoints, resource types and samples by reading
  [API Reference](/docs/reference/kubernetes-api/).
