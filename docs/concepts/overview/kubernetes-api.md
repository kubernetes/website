---
reviewers:
- chenopis
title: The Kubernetes API
---

Overall API conventions are described in the [API conventions doc](https://git.k8s.io/community/contributors/devel/api-conventions.md).

API endpoints, resource types and samples are described in [API Reference](/docs/reference).

Remote access to the API is discussed in the [access doc](/docs/admin/accessing-the-api).

The Kubernetes API also serves as the foundation for the declarative configuration schema for the system. The [kubectl](/docs/user-guide/kubectl/) command-line tool can be used to create, update, delete, and get API objects.

Kubernetes also stores its serialized state (currently in [etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/)) in terms of the API resources.

Kubernetes itself is decomposed into multiple components, which interact through its API.

## API changes

In our experience, any system that is successful needs to grow and change as new use cases emerge or existing ones change. Therefore, we expect the Kubernetes API to continuously change and grow. However, we intend to not break compatibility with existing clients, for an extended period of time. In general, new API resources and new resource fields can be expected to be added frequently. Elimination of resources or fields will require following the [API deprecation policy](https://kubernetes.io/docs/reference/deprecation-policy/).

What constitutes a compatible change and how to change the API are detailed by the [API change document](https://git.k8s.io/community/contributors/devel/api_changes.md).

## OpenAPI and Swagger definitions

Complete API details are documented using [Swagger v1.2](http://swagger.io/) and [OpenAPI](https://www.openapis.org/). The Kubernetes apiserver (aka "master") exposes an API that can be used to retrieve the Swagger v1.2 Kubernetes API spec located at `/swaggerapi`.

Starting with Kubernetes 1.4, OpenAPI spec is also available at [`/swagger.json`](https://git.k8s.io/kubernetes/api/openapi-spec/swagger.json). While we are transitioning from Swagger v1.2 to OpenAPI (aka Swagger v2.0), some of the tools such as kubectl and swagger-ui are still using v1.2 spec. OpenAPI spec is in Beta as of Kubernetes 1.5.

Kubernetes implements an alternative Protobuf based serialization format for the API that is primarily intended for intra-cluster communication, documented in the [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) and the IDL files for each schema are located in the Go packages that define the API objects.

## API versioning

To make it easier to eliminate fields or restructure resource representations, Kubernetes supports
multiple API versions, each at a different API path, such as `/api/v1` or
`/apis/extensions/v1beta1`.

We chose to version at the API level rather than at the resource or field level to ensure that the API presents a clear, consistent view of system resources and behavior, and to enable controlling access to end-of-lifed and/or experimental APIs. The JSON and Protobuf serialization schemas follow the same guidelines for schema changes - all descriptions below cover both formats.

Note that API versioning and Software versioning are only indirectly related.  The [API and release
versioning proposal](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md) describes the relationship between API versioning and
software versioning.


Different API versions imply different levels of stability and support.  The criteria for each level are described
in more detail in the [API Changes documentation](https://git.k8s.io/community/contributors/devel/api_changes.md#alpha-beta-and-stable-versions).  They are summarized here:

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

To make it easier to extend the Kubernetes API, we implemented [*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md).
The API group is specified in a REST path and in the `apiVersion` field of a serialized object.

Currently there are several API groups in use:

1. The *core* group, often referred to as the *legacy group*, is at the REST path `/api/v1` and uses `apiVersion: v1`.

1. The named groups are at REST path `/apis/$GROUP_NAME/$VERSION`, and use `apiVersion: $GROUP_NAME/$VERSION`
   (e.g. `apiVersion: batch/v1`).  Full list of supported API groups can be seen in [Kubernetes API reference](/docs/reference/).


There are two supported paths to extending the API with [custom resources](/docs/concepts/api-extension/custom-resources/):

1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
   is for users with very basic CRUD needs.
1. Coming soon: users needing the full set of Kubernetes API semantics can implement their own apiserver
   and use the [aggregator](https://git.k8s.io/community/contributors/design-proposals/api-machinery/aggregated-api-servers.md)
   to make it seamless for clients.


## Enabling API groups

Certain resources and API groups are enabled by default.  They can be enabled or disabled by setting `--runtime-config`
on apiserver. `--runtime-config` accepts comma separated values. For ex: to disable batch/v1, set
`--runtime-config=batch/v1=false`, to enable batch/v2alpha1, set `--runtime-config=batch/v2alpha1`.
The flag accepts comma separated set of key=value pairs describing runtime configuration of the apiserver.

IMPORTANT: Enabling or disabling groups or resources requires restarting apiserver and controller-manager
to pick up the `--runtime-config` changes.

## Enabling resources in the groups

DaemonSets, Deployments, HorizontalPodAutoscalers, Ingress, Jobs and ReplicaSets are enabled by default.
Other extensions resources can be enabled by setting `--runtime-config` on
apiserver. `--runtime-config` accepts comma separated values. For example: to disable deployments and ingress, set
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingress=false`
