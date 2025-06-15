---
layout: blog
title: 'A Peek at Kubernetes v1.30'
date: 2024-03-12
slug: kubernetes-1-30-upcoming-changes
author: >
  Amit Dsouza,
  Frederick Kautz,
  Kristin Martin,
  Abigail McCarthy,
  Natali Vlatko  
---

## A quick look: exciting changes in Kubernetes v1.30

It's a new year and a new Kubernetes release. We're halfway through the release cycle and
have quite a few interesting and exciting enhancements coming in v1.30. From brand new features
in alpha, to established features graduating to stable, to long-awaited improvements, this release
has something for everyone to pay attention to!

To tide you over until the official release, here's a sneak peek of the enhancements we're most
excited about in this cycle!

## Major changes for Kubernetes v1.30

### Structured parameters for dynamic resource allocation ([KEP-4381](https://kep.k8s.io/4381))

[Dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) was
added to Kubernetes as an alpha feature in v1.26. It defines an alternative to the traditional
device-plugin API for requesting access to third-party resources. By design, dynamic resource
allocation uses parameters for resources that are completely opaque to core Kubernetes. This
approach poses a problem for the Cluster Autoscaler (CA) or any higher-level controller that
needs to make decisions for a group of pods (e.g. a job scheduler). It cannot simulate the effect of
allocating or deallocating claims over time. Only the third-party DRA drivers have the information
available to do this.

​​Structured Parameters for dynamic resource allocation is an extension to the original
implementation that addresses this problem by building a framework to support making these claim
parameters less opaque. Instead of handling the semantics of all claim parameters themselves,
drivers could manage resources and describe them using a specific "structured model" pre-defined by
Kubernetes. This would allow components aware of this "structured model" to make decisions about
these resources without outsourcing them to some third-party controller. For example, the scheduler
could allocate claims rapidly without back-and-forth communication with dynamic resource
allocation drivers. Work done for this release centers on defining the framework necessary to enable
different "structured models" and to implement the "named resources" model. This model allows
listing individual resource instances and, compared to the traditional device plugin API, adds the
ability to select those instances individually via attributes.

### Node memory swap support ([KEP-2400](https://kep.k8s.io/2400))

In Kubernetes v1.30, memory swap support on Linux nodes gets a big change to how it works - with a
strong emphasis on improving system stability. In previous Kubernetes versions, the `NodeSwap`
feature gate was disabled by default, and when enabled, it used `UnlimitedSwap` behavior as the
default behavior. To achieve better stability, `UnlimitedSwap` behavior (which might compromise node
stability) will be removed in v1.30.

The updated, still-beta support for swap on Linux nodes will be available by default. However, the
default behavior will be to run the node set to `NoSwap` (not `UnlimitedSwap`) mode. In `NoSwap`
mode, the kubelet supports running on a node where swap space is active, but Pods don't use any of
the page file. You'll still need to set `--fail-swap-on=false` for the kubelet to run on that node.
However, the big change is the other mode: `LimitedSwap`. In this mode, the kubelet actually uses
the page file on that node and allows Pods to have some of their virtual memory paged out.
Containers (and their parent pods)  do not have access to swap beyond their memory limit, but the
system can still use the swap space if available.

Kubernetes' Node special interest group (SIG Node) will also update the documentation to help you
understand how to use the revised implementation, based on feedback from end users, contributors,
and the wider Kubernetes community.

Read the previous [blog post](/blog/2023/08/24/swap-linux-beta/) or the [node swap
documentation](/docs/concepts/architecture/nodes/#swap-memory) for more details on 
Linux node swap support in Kubernetes.

### Support user namespaces in pods ([KEP-127](https://kep.k8s.io/127))

[User namespaces](/docs/concepts/workloads/pods/user-namespaces) is a Linux-only feature that better
isolates pods to prevent or mitigate several CVEs rated high/critical, including
[CVE-2024-21626](https://github.com/opencontainers/runc/security/advisories/GHSA-xr7r-f8xq-vfvv),
published in January 2024. In Kubernetes 1.30, support for user namespaces is migrating to beta and
now supports pods with and without volumes, custom UID/GID ranges, and more!

### Structured authorization configuration ([KEP-3221](https://kep.k8s.io/3221))

Support for [structured authorization
configuration](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file)
is moving to beta and will be enabled by default. This feature enables the creation of
authorization chains with multiple webhooks with well-defined parameters that validate requests in a
particular order and allows fine-grained control – such as explicit Deny on failures. The
configuration file approach even allows you to specify [CEL](/docs/reference/using-api/cel/) rules
to pre-filter requests before they are dispatched to webhooks, helping you to prevent unnecessary
invocations. The API server also automatically reloads the authorizer chain when the configuration
file is modified.

You must specify the path to that authorization configuration using the `--authorization-config`
command line argument. If you want to keep using command line flags instead of a
configuration file, those will continue to work as-is. To gain access to new authorization webhook
capabilities like multiple webhooks, failure policy, and pre-filter rules, switch to putting options
in an `--authorization-config` file. From Kubernetes 1.30, the configuration file format is
beta-level, and only requires specifying `--authorization-config` since the feature gate is enabled by
default. An example configuration with all possible values is provided in the [Authorization
docs](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file).
For more details, read the [Authorization
docs](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file).

### Container resource based pod autoscaling ([KEP-1610](https://kep.k8s.io/1610))

Horizontal pod autoscaling based on `ContainerResource` metrics will graduate to stable in v1.30.
This new behavior for HorizontalPodAutoscaler allows you to configure automatic scaling based on the
resource usage for individual containers, rather than the aggregate resource use over a Pod. See our
[previous article](/blog/2023/05/02/hpa-container-resource-metric/) for further details, or read
[container resource metrics](/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics).

### CEL for admission control ([KEP-3488](https://kep.k8s.io/3488))

Integrating Common Expression Language (CEL) for admission control in Kubernetes introduces a more
dynamic and expressive way of evaluating admission requests. This feature allows complex,
fine-grained policies to be defined and enforced directly through the Kubernetes API, enhancing
security and governance capabilities without compromising performance or flexibility.

CEL's addition to Kubernetes admission control empowers cluster administrators to craft intricate
rules that can evaluate the content of API requests against the desired state and policies of the
cluster without resorting to Webhook-based access controllers. This level of control is crucial for
maintaining the integrity, security, and efficiency of cluster operations, making Kubernetes
environments more robust and adaptable to various use cases and requirements. For more information
on using CEL for admission control, see the [API
documentation](/docs/reference/access-authn-authz/validating-admission-policy/) for
ValidatingAdmissionPolicy.

We hope you're as excited for this release as we are. Keep an eye out for the official release 
blog in a few weeks for more highlights!
