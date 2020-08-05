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
exposes an HTTP API that lets end users, different parts of your cluster, and external components
communicate with one another.

The Kubernetes API lets you query and manipulate the state of objects in the Kubernetes API
(for example: Pods, Namespaces, ConfigMaps, and Events).

API endpoints, resource types and samples are described in the [API Reference](/docs/reference/kubernetes-api/).

<!-- body -->

## API changes

Any system that is successful needs to grow and change as new use cases emerge or existing ones change.
Therefore, Kubernetes has design features to allow the Kubernetes API to continuously change and grow.
The Kubernetes project aims to _not_ break compatibility with existing clients, and to maintain that
compatibility for a length of time so that other projects have an opportunity to adapt.

In general, new API resources and new resource fields can be added often and frequently.
Elimination of resources or fields requires following the
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).

What constitutes a compatible change, and how to change the API, are detailed in
[API changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).

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

Kubernetes implements an alternative Protobuf based serialization format for the API that is primarily intended for intra-cluster communication, documented in the [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) and the IDL files for each schema are located in the Go packages that define the API objects.

## API versioning

To make it easier to eliminate fields or restructure resource representations, Kubernetes supports
multiple API versions, each at a different API path, such as `/api/v1` or
`/apis/rbac.authorization.k8s.io/v1alpha1`.

Versioning is done at the API level rather than at the resource or field level to ensure that the
API presents a clear, consistent view of system resources and behavior, and to enable controlling
access to end-of-life and/or experimental APIs.

The JSON and Protobuf serialization schemas follow the same guidelines for schema changes - all descriptions below cover both formats.

Note that API versioning and Software versioning are only indirectly related.  The
[Kubernetes Release Versioning](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md)
proposal describes the relationship between API versioning and software versioning.

Different API versions imply different levels of stability and support.  The criteria for each level are described
in more detail in the
[API Changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions)
documentation.  They are summarized here:

- Alpha level:
  - The version names contain `alpha` (e.g. `v1alpha1`).
  - May be buggy.  Enabling the feature may expose bugs.  Disabled by default.
  - Support for feature may be dropped at any time without notice.
  - The API may change in incompatible ways in a later software release without notice.
  - Recommended for use only in short-lived testing clusters, due to increased risk of bugs and lack of long-term support.
- Beta level:
  - The version names contain `beta` (e.g. `v2beta3`).
  - Code is well tested.  Enabling the feature is considered safe.  Enabled by default.
  - Support for the overall feature will not be dropped, though details may change.
  - The schema and/or semantics of objects may change in incompatible ways in a subsequent beta or stable release.  When this happens,
    we will provide instructions for migrating to the next version.  This may require deleting, editing, and re-creating
    API objects.  The editing process may require some thought.   This may require downtime for applications that rely on the feature.
  - Recommended for only non-business-critical uses because of potential for incompatible changes in subsequent releases.  If you have
    multiple clusters which can be upgraded independently, you may be able to relax this restriction.
  - **Please do try our beta features and give feedback on them!  Once they exit beta, it may not be practical for us to make more changes.**
- Stable level:
  - The version name is `vX` where `X` is an integer.
  - Stable versions of features will appear in released software for many subsequent versions.

## API groups

To make it easier to extend its API, Kubernetes implements [*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md).
The API group is specified in a REST path and in the `apiVersion` field of a serialized object.

There are several API groups in a cluster:

1. The *core* group, also referred to as the *legacy* group, is at the REST path `/api/v1` and uses `apiVersion: v1`.

1. *Named* groups are at REST path `/apis/$GROUP_NAME/$VERSION`, and use `apiVersion: $GROUP_NAME/$VERSION`
   (e.g. `apiVersion: batch/v1`). The Kubernetes [API reference](/docs/reference/kubernetes-api/) has a
   full list of available API groups.

There are two paths to extending the API with [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/):

1. [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
   lets you declaratively define how the API server should provide your chosen resource API.
1. You can also [implement your own extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/)
   and use the [aggregator](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
   to make it seamless for clients.

## Enabling or disabling API groups

Certain resources and API groups are enabled by default. They can be enabled or disabled by setting `--runtime-config`
as a command line option to the kube-apiserver.

`--runtime-config` accepts comma separated values. For example: to disable batch/v1, set
`--runtime-config=batch/v1=false`; to enable batch/v2alpha1, set `--runtime-config=batch/v2alpha1`.
The flag accepts comma separated set of key=value pairs describing runtime configuration of the API server.

{{< note >}}Enabling or disabling groups or resources requires restarting the kube-apiserver and the
kube-controller-manager to pick up the `--runtime-config` changes.{{< /note >}}

## Persistence

Kubernetes stores its serialized state in terms of the API resources by writing them into
{{< glossary_tooltip term_id="etcd" >}}.


## {{% heading "whatsnext" %}}

[Controlling API Access](/docs/reference/access-authn-authz/controlling-access/) describes
how the cluster manages authentication and authorization for API access.

Overall API conventions are described in the
[API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#api-conventions)
document.

API endpoints, resource types and samples are described in the [API Reference](/docs/reference/kubernetes-api/).
