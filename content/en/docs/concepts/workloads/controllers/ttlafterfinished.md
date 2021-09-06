---
reviewers:
- janetkuo
title: TTL Controller for Finished Resources
content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

The TTL controller provides a TTL (time to live) mechanism to limit the lifetime of resource
objects that have finished execution. TTL controller only handles
{{< glossary_tooltip text="Jobs" term_id="job" >}} for now,
and may be expanded to handle other resources that will finish execution,
such as Pods and custom resources.

Alpha Disclaimer: this feature is currently alpha, and can be enabled with both kube-apiserver and kube-controller-manager
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`TTLAfterFinished`.

<!-- body -->

## TTL Controller

The TTL controller only supports Jobs for now. A cluster operator can use this feature to clean
up finished Jobs (either `Complete` or `Failed`) automatically by specifying the
`.spec.ttlSecondsAfterFinished` field of a Job, as in this
[example](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).
The TTL controller will assume that a resource is eligible to be cleaned up
TTL seconds after the resource has finished, in other words, when the TTL has expired. When the
TTL controller cleans up a resource, it will delete it cascadingly, that is to say it will delete
its dependent objects together with it. Note that when the resource is deleted,
its lifecycle guarantees, such as finalizers, will be honored.

The TTL seconds can be set at any time. Here are some examples for setting the
`.spec.ttlSecondsAfterFinished` field of a Job:

* Specify this field in the resource manifest, so that a Job can be cleaned up
  automatically some time after it finishes.
* Set this field of existing, already finished resources, to adopt this new
  feature.
* Use a
  [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  to set this field dynamically at resource creation time. Cluster administrators can
  use this to enforce a TTL policy for finished resources.
* Use a
  [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  to set this field dynamically after the resource has finished, and choose
  different TTL values based on resource status, labels, etc.

## Caveat

### Updating TTL Seconds

Note that the TTL period, e.g. `.spec.ttlSecondsAfterFinished` field of Jobs,
can be modified after the resource is created or has finished. However, once the
Job becomes eligible to be deleted (when the TTL has expired), the system won't
guarantee that the Jobs will be kept, even if an update to extend the TTL
returns a successful API response.

### Time Skew

Because TTL controller uses timestamps stored in the Kubernetes resources to
determine whether the TTL has expired or not, this feature is sensitive to time
skew in the cluster, which may cause TTL controller to clean up resource objects
at the wrong time.

In Kubernetes, it's required to run NTP on all nodes
(see [#6159](https://github.com/kubernetes/kubernetes/issues/6159#issuecomment-93844058))
to avoid time skew. Clocks aren't always correct, but the difference should be
very small. Please be aware of this risk when setting a non-zero TTL.



## {{% heading "whatsnext" %}}

* [Clean up Jobs automatically](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)

* [Design doc](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)

