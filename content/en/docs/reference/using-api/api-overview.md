---
title: Kubernetes API Overview
reviewers:
- erictune
- lavalamp
- jbeda
content_template: templates/concept
weight: 10
card:
  name: reference
  weight: 50
  title: Overview of API
---

{{% capture overview %}}
This page provides an overview of the Kubernetes API. 
{{% /capture %}}

{{% capture body %}}
The REST API is the fundamental fabric of Kubernetes. All operations and communications between components, and external user commands are REST API calls that the API Server handles. Consequently, everything in the Kubernetes
platform is treated as an API object and has a corresponding entry in the
[API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

Most operations can be performed through the
[kubectl](/docs/reference/kubectl/overview/) command-line interface or other
command-line tools, such as [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/), which in turn use
the API. However, you can also access the API directly using REST calls.

Consider using one of the [client libraries](/docs/reference/using-api/client-libraries/)
if you are writing an application using the Kubernetes API.

## API versioning

To eliminate fields or restructure resource representations, Kubernetes supports
multiple API versions, each at a different API path. For example: `/api/v1` or
`/apis/extensions/v1beta1`.

The version is set at the API level rather than at the resource or field level to:

- Ensure that the API presents a clear and consistent view of system resources and behavior.
- Enable control access to end-of-life and/or experimental APIs.

The JSON and Protobuf serialization schemas follow the same guidelines for schema changes. The following descriptions cover both formats.

{{< note >}}
The API versioning and software versioning are indirectly related.  The [API and release
versioning proposal](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md) describes the relationship between API versioning and software versioning.
{{< /note >}}

Different API versions indicate different levels of stability and support. You can find more information about the criteria for each level in the [API Changes documentation](https://git.k8s.io/community/contributors/devel/api_changes.md#alpha-beta-and-stable-versions).  

Here's a summary of each level:

- Alpha:
  - The version names contain `alpha` (for example, `v1alpha1`).
  - The software may contain bugs. Enabling a feature may expose bugs. A feature may be disabled by default.
  - The support for a feature may be dropped at any time without notice.
  - The API may change in incompatible ways in a later software release without notice.
  - The software is recommended for use only in short-lived testing clusters, due to increased risk of bugs and lack of  long-term support.
  
- Beta:
  - The version names contain `beta` (for example, `v2beta3`).
  - The software is well tested. Enabling a feature is considered safe. Features are enabled by default.
  - The support for a feature will not be dropped, though the details may change.
  - The schema and/or semantics of objects may change in incompatible ways in a subsequent beta or stable release. When this happens, migration instructions are provided.  This may require deleting, editing, and re-creating
    API objects. The editing process may require some thought. This may require downtime for applications that rely on the feature.
  - The software is recommended for only non-business-critical uses because of potential for incompatible changes in subsequent releases. If you have multiple clusters which can be upgraded independently, you may be able to relax this restriction.
  
 {{< note >}}
Try the beta features and provide feedback. After the features exit beta, it may not be practical to make more changes.
 {{< /note >}}
  
- Stable:
  - The version name is `vX` where `X` is an integer.
  - The stable versions of features appear in released software for many subsequent versions.

## API groups

[*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md) make it easier to extend the Kubernetes API. The API group is specified in a REST path and in the `apiVersion` field of a serialized object.

Currently, there are several API groups in use:

*  The *core* (also called *legacy*) group, which is at REST path `/api/v1` and is not specified as part of the `apiVersion` field, for example, `apiVersion: v1`.
*  The named groups are at REST path `/apis/$GROUP_NAME/$VERSION`, and use `apiVersion: $GROUP_NAME/$VERSION`
   (for example, `apiVersion: batch/v1`). You can find the full list of supported API groups in [Kubernetes API reference](/docs/reference/).

The two paths that support extending the API with [custom resources](/docs/concepts/api-extension/custom-resources/) are:

 - [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
   for basic CRUD needs.
 - [aggregator](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/aggregated-api-servers.md) for a full set of Kubernetes API semantics to implement their own apiserver.
 

## Enabling API groups

Certain resources and API groups are enabled by default. You can enable or disable them by setting `--runtime-config`
on the apiserver. `--runtime-config` accepts comma separated values. For example:
 - to disable batch/v1, set `--runtime-config=batch/v1=false`
 - to enable batch/v2alpha1, set `--runtime-config=batch/v2alpha1`
The flag accepts comma separated set of key=value pairs describing runtime configuration of the apiserver.

{{< note >}}
When you enable or disable groups or resources, you need to restart the apiserver and controller-manager
to pick up the `--runtime-config` changes.
{{< /note >}}

## Enabling resources in the groups

DaemonSets, Deployments, HorizontalPodAutoscalers, Ingress, Jobs and ReplicaSets are enabled by default.
You can enable other extensions resources by setting `--runtime-config` on
apiserver. `--runtime-config` accepts comma separated values. For example, to disable deployments and jobs, set
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/jobs=false`
{{% /capture %}}


