---
reviewers:
- janetkuo
title: TTL Controller for Finished Resources
content_template: templates/concept
weight: ??
---

{{% capture overview %}}

The TTL controller provides a TTL mechanism to limit the lifetime of resource
objects that have finished execution. Currently, TTL controller only handles
[Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) for
now, and may be expanded to handle other resources that will finish execution,
such as Pods and custom resources.

Alpha Disclaimer: this feature is currently alpha, and can be enabled with
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`TTLAfterFinished`.


{{% /capture %}}


{{< toc >}}


{{% capture body %}}

## TTL Controller

The TTL controller only supports Jobs for now. You can use this feature to clean
up finished Jobs (either `Complete` or `Failed`) automatically by specifying the
`.spec.ttlSecondsAfterFinished` field of a Job, 
see [example](/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically). 
The TTL controller will assume that a resource is eligible to be cleaned up
TTL seconds after the resource has finished, i.e. TTL has expired. When the
resource is deleted, its lifecycle guarantees, such as finalizers, will be
honored.

The TTL seconds can be set at any time -- for example, you can specify it in the
resource manifest, set it at resource creation time, or set it after the
resource has finished. You can also use
[mutating admission webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
to set this field dynamically.

In the future, we plan to expand TTL controller to other resources that will
finish execution, such as Pods and custom resources.

## Caveat

### Updating TTL Seconds

Note that the TTL period, e.g. `.spec.ttlSecondsAfterFinished` field of Jobs,
can be modified after the resource is created or has finished. However, once the
Job becomes eligible to be deleted (i.e. the TTL has expired), the system won't
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

{{% /capture %}}

{{% capture whatsnext %}}

[Clean up Jobs automatically](/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically)

[Design doc](https://github.com/kubernetes/community/blob/master/keps/sig-apps/0026-ttl-after-finish.md)

{{% /capture %}}
