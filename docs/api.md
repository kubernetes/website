---
assignees:
- bgrant0607
- erictune
- lavalamp

---

Primary system and API concepts are documented in the [User guide](/docs/user-guide/).

Overall API conventions are described in the [API conventions doc](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api-conventions.md).

Remote access to the API is discussed in the [access doc](/docs/admin/accessing-the-api).

The Kubernetes API also serves as the foundation for the declarative configuration schema for the system. The [Kubectl](/docs/user-guide/kubectl/kubectl) command-line tool can be used to create, update, delete, and get API objects.

Kubernetes also stores its serialized state (currently in [etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/)) in terms of the API resources.

Kubernetes itself is decomposed into multiple components, which interact through its API.

## API changes

In our experience, any system that is successful needs to grow and change as new use cases emerge or existing ones change. Therefore, we expect the Kubernetes API to continuously change and grow. However, we intend to not break compatibility with existing clients, for an extended period of time. In general, new API resources and new resource fields can be expected to be added frequently. Elimination of resources or fields will require following a deprecation process. The precise deprecation policy for eliminating features is TBD, but once we reach our 1.0 milestone, there will be a specific policy.

What constitutes a compatible change and how to change the API are detailed by the [API change document](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api_changes.md).

## API Swagger definitions

Complete API details are documented using [Swagger v1.2](http://swagger.io/). The Kubernetes apiserver (aka "master") exposes an API that can be used to retrieve the Swagger Kubernetes API spec, by default at located at `/swaggerapi`, and a UI to browse the API documentation at `/swagger-ui`.

We also host a version of the [latest API documentation UI](http://kubernetes.io/kubernetes/third_party/swagger-ui/). This is updated with the latest release, so if you are using a different version of Kubernetes you will want to use the spec from your apiserver.

Kubernetes implements an alternative Protobuf based serialization format for the API that is primarily intended for intra-cluster communication, documented in the [design proposal](https://github.com/kubernetes/kubernetes/blob/{{ page.githubbranch }}/docs/proposals/protobuf.md) and the IDL files for each schema are located in the Go packages that define the API objects.

## API versioning

To make it easier to eliminate fields or restructure resource representations, Kubernetes supports
multiple API versions, each at a different API path, such as `/api/v1` or
`/apis/extensions/v1beta1`.

We chose to version at the API level rather than at the resource or field level to ensure that the API presents a clear, consistent view of system resources and behavior, and to enable controlling access to end-of-lifed and/or experimental APIs. The JSON and Protobuf serialization schemas follow the same guidelines for schema changes - all descriptions below cover both formats.

Note that API versioning and Software versioning are only indirectly related.  The [API and release
versioning proposal](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/versioning.md) describes the relationship between API versioning and
software versioning.


Different API versions imply different levels of stability and support.  The criteria for each level are described
in more detail in the [API Changes documentation](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api_changes.md#alpha-beta-and-stable-versions).  They are summarized here:

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

To make it easier to extend the Kubernetes API, we are in the process of implementing [*API
groups*](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/api-group.md).  These are simply different interfaces to read and/or modify the
same underlying resources.  The API group is specified in a REST path and in the `apiVersion` field
of a serialized object.

Currently there are two API groups in use:

1. the "core" group, which is at REST path `/api/v1` and is not specified as part of the `apiVersion` field, e.g.
   `apiVersion: v1`.
1. the "extensions" group, which is at REST path `/apis/extensions/$VERSION`, and which uses
  `apiVersion: extensions/$VERSION` (e.g. currently `apiVersion: extensions/v1beta1`).
  This holds types which will probably move to another API group eventually.
1. the "componentconfig" and "metrics" API groups.


In the future we expect that there will be more API groups, all at REST path `/apis/$API_GROUP` and
using `apiVersion: $API_GROUP/$VERSION`.  We expect that there will be a way for [third parties to
create their own API groups](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/extending-api.md), and to avoid naming collisions.

## Enabling resources in the extensions group

DaemonSets, Deployments, HorizontalPodAutoscalers, Ingress, Jobs and ReplicaSets are enabled by default.
Other extensions resources can be enabled by setting runtime-config on
apiserver. runtime-config accepts comma separated values. For ex: to disable deployments and jobs, set
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/jobs=false`
