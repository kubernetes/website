---
reviewers:
- chenopis
title: The Kubernetes API
content_type: concept
weight: 40
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

The Kubernetes API lets you query and manipulate the state of API objects in Kubernetes
(for example: Pods, Namespaces, ConfigMaps, and Events).

Most operations can be performed through the
[kubectl](/docs/reference/kubectl/) command-line interface or other
command-line tools, such as
[kubeadm](/docs/reference/setup-tools/kubeadm/), which in turn use the
API. However, you can also access the API directly using REST calls.

Consider using one of the [client libraries](/docs/reference/using-api/client-libraries/)
if you are writing an application using the Kubernetes API.

<!-- body -->

## OpenAPI specification {#api-specification}

Complete API details are documented using [OpenAPI](https://www.openapis.org/).

### OpenAPI V2

The Kubernetes API server serves an aggregated OpenAPI v2 spec via the
`/openapi/v2` endpoint. You can request the response format using
request headers as follows:

<table>
  <caption style="display:none">Valid request header values for OpenAPI v2 queries</caption>
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
</table>

Kubernetes implements an alternative Protobuf based serialization format that
is primarily intended for intra-cluster communication. For more information
about this format, see the [Kubernetes Protobuf serialization](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md) design proposal and the
Interface Definition Language (IDL) files for each schema located in the Go
packages that define the API objects.

### OpenAPI V3

{{< feature-state feature_gate_name="OpenAPIV3" >}}

Kubernetes supports publishing a description of its APIs as OpenAPI v3.

A discovery endpoint `/openapi/v3` is provided to see a list of all
group/versions available. This endpoint only returns JSON. These
group/versions are provided in the following format:

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ....
    }
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

The relative URLs are pointing to immutable OpenAPI descriptions, in
order to improve client-side caching. The proper HTTP caching headers
are also set by the API server for that purpose (`Expires` to 1 year in
the future, and `Cache-Control` to `immutable`). When an obsolete URL is
used, the API server returns a redirect to the newest URL.

The Kubernetes API server publishes an OpenAPI v3 spec per Kubernetes
group version at the `/openapi/v3/apis/<group>/<version>?hash=<hash>`
endpoint.

Refer to the table below for accepted request headers.

<table>
  <caption style="display:none">Valid request header values for OpenAPI v3 queries</caption>
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
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
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
</table>

A Golang implementation to fetch the OpenAPI V3 is provided in the package `k8s.io/client-go/openapi3`.

## Persistence

Kubernetes stores the serialized state of objects by writing them into
{{< glossary_tooltip term_id="etcd" >}}.

## API Discovery

A list of all group versions supported by a cluster is published at
the `/api` and `/apis` endpoints. Each group version also advertises
the list of resources supported via `/apis/<group>/<version>` (for
example: `/apis/rbac.authorization.k8s.io/v1alpha1`). These endpoints
are used by kubectl to fetch the list of resources supported by a
cluster.

### Aggregated Discovery

{{< feature-state feature_gate_name="AggregatedDiscoveryEndpoint" >}}

Kubernetes offers beta support for aggregated discovery, publishing
all resources supported by a cluster through two endpoints (`/api` and
`/apis`) compared to one for every group version. Requesting this
endpoint drastically reduces the number of requests sent to fetch the
discovery for the average Kubernetes cluster. This may be accessed by
requesting the respective endpoints with an Accept header indicating
the aggregated discovery resource:
`Accept: application/json;v=v2beta1;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`.

The endpoint also supports ETag and protobuf encoding.

## API groups and versioning

To make it easier to eliminate fields or restructure resource representations,
Kubernetes supports multiple API versions, each at a different API path, such
as `/api/v1` or `/apis/rbac.authorization.k8s.io/v1alpha1`.

Versioning is done at the API level rather than at the resource or field level
to ensure that the API presents a clear, consistent view of system resources
and behavior, and to enable controlling access to end-of-life and/or
experimental APIs.

To make it easier to evolve and to extend its API, Kubernetes implements
[API groups](/docs/reference/using-api/#api-groups) that can be
[enabled or disabled](/docs/reference/using-api/#enabling-or-disabling).

API resources are distinguished by their API group, resource type, namespace
(for namespaced resources), and name. The API server handles the conversion between
API versions transparently: all the different versions are actually representations
of the same persisted data. The API server may serve the same underlying data
through multiple API versions.

For example, suppose there are two API versions, `v1` and `v1beta1`, for the same
resource. If you originally created an object using the `v1beta1` version of its
API, you can later read, update, or delete that object using either the `v1beta1`
or the `v1` API version, until the `v1beta1` version is deprecated and removed.
At that point you can continue accessing and modifying the object using the `v1` API.

### API changes

Any system that is successful needs to grow and change as new use cases emerge or existing ones change.
Therefore, Kubernetes has designed the Kubernetes API to continuously change and grow.
The Kubernetes project aims to _not_ break compatibility with existing clients, and to maintain that
compatibility for a length of time so that other projects have an opportunity to adapt.

In general, new API resources and new resource fields can be added often and frequently.
Elimination of resources or fields requires following the
[API deprecation policy](/docs/reference/using-api/deprecation-policy/).

Kubernetes makes a strong commitment to maintain compatibility for official Kubernetes APIs
once they reach general availability (GA), typically at API version `v1`. Additionally,
Kubernetes maintains compatibility with data persisted via _beta_ API versions of official Kubernetes APIs,
and ensures that data can be converted and accessed via GA API versions when the feature goes stable.

If you adopt a beta API version, you will need to transition to a subsequent beta or stable API version
once the API graduates. The best time to do this is while the beta API is in its deprecation period,
since objects are simultaneously accessible via both API versions. Once the beta API completes its
deprecation period and is no longer served, the replacement API version must be used.

{{< note >}}
Although Kubernetes also aims to maintain compatibility for _alpha_ APIs versions, in some
circumstances this is not possible. If you use any alpha API versions, check the release notes
for Kubernetes when upgrading your cluster, in case the API did change in incompatible
ways that require deleting all existing alpha objects prior to upgrade.
{{< /note >}}

Refer to [API versions reference](/docs/reference/using-api/#api-versioning)
for more details on the API version level definitions.



## API Extension

The Kubernetes API can be extended in one of two ways:

1. [Custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
   let you declaratively define how the API server should provide your chosen resource API.
1. You can also extend the Kubernetes API by implementing an
   [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

## {{% heading "whatsnext" %}}

- Learn how to extend the Kubernetes API by adding your own
  [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
- [Controlling Access To The Kubernetes API](/docs/concepts/security/controlling-access/) describes
  how the cluster manages authentication and authorization for API access.
- Learn about API endpoints, resource types and samples by reading
  [API Reference](/docs/reference/kubernetes-api/).
- Learn about what constitutes a compatible change, and how to change the API, from
  [API changes](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).
