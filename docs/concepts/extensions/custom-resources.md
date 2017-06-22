---
title: Custom Resources
assignees:
- enisoc
- deads2k
---

{% capture overview %}
This page explains the concept of *custom resources*, which are extensions of the Kubernetes API.
{% endcapture %}

{% capture body %}
## Custom resources

A *resource* is an endpoint in the [Kubernetes API](/docs/reference/api-overview/) that stores a
collection of [API objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/) of a
certain kind.
For example, the built-in *pods* resource contains a collection of Pod objects.

A *custom resource* is an extension of the Kubernetes API that is not necessarily available on every
Kubernetes cluster. In other words, it represents a customization of a particular installation of
Kubernetes.

Custom resources can appear and disappear in a running cluster through dynamic registration,
and cluster admins can update custom resources independently of the cluster itself.
Once it's installed, users can create and access objects in a custom resource with
[kubectl](/docs/user-guide/kubectl-overview/) like they do for built-in resources like *pods*
and *services*.

## Custom controllers

On their own, custom resources simply let you store and retrieve structured data.
It is only when combined with a *controller* that they become a true
[declarative API](/docs/concepts/overview/working-with-objects/kubernetes-objects/#understanding-kubernetes-objects).
The controller interprets the structured data as a record of the user's desired state,
and continually takes action to achieve and maintain that state.

A *custom controller* is a controller that users can deploy and update on a running cluster,
independently of the cluster's own lifecycle.
Custom controllers can work with any kind of resource, but they fit especially well with custom
resources.
For example, the [Operator](https://coreos.com/blog/introducing-operators.html) pattern is a
combination of a custom resource and a custom controller that allows developers to encode domain
knowledge for specific applications into an extension of the Kubernetes API.

## CustomResourceDefinitions

[CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
(CRD) is a built-in API that offers a simple way to create custom resources.
Deploying a CRD into the cluster causes the Kubernetes API server to begin serving the specified
custom resource on your behalf.

This frees you from writing your own API server to handle the custom resource,
but the generic nature of the implementation means you have less flexibility than with an
[aggregated API server](#aggregated-api-servers).

CRD is the successor to the deprecated *ThirdPartyResource* (TPR) API, and is available as of
Kubernetes 1.7.

## Aggregated API servers

Usually, each resource in the Kubernetes API requires code that handles REST requests and manages
persistent storage of objects.
The main Kubernetes API server handles built-in resources like *pods* and *services*,
and can also handle custom resources in a generic way through [CustomResourceDefinitions](#customresourcedefinitions).

For custom resources that need specialized implementations, you can write and deploy a standalone
API server, then make the resource available to clients of the main API server through aggregation.
The main API server will delegate requests to you for the custom resources that you handle.
{% endcapture %}

{% capture whatsnext %}
* Learn how to [Extend the Kubernetes API with CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
* Learn how to [Migrate a ThirdPartyResource to CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/).
{% endcapture %}

{% include templates/concept.md %}
