---
title: TTL-after-finished controller
content_template: templates/concept
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

The TTL-after-finished controller provides a Time-To-Live mechanism to limit the lifetime of resource
objects that have finished execution.

The TTL controller only handles {{< glossary_tooltip text="Jobs" term_id="job" >}} for now.
In the future it may be able to handle other resources that will finish execution, such as
Pods and custom resources.

{{% /capture %}}


{{% capture body %}}

## Enabling the TTL-after-finished controller

You can use the TTL-after-finished controller by enabling the
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`TTLAfterFinished`.

## Controller behavior

For now, the TTL-after-finished controller only supports Jobs. You can use this feature to automate
cleaning up finished Jobs (either `Complete` or `Failed`) by specifying the
`.spec.ttlSecondsAfterFinished` field of a Job.
See [Job](/docs/concepts/workloads/controllers/job-run-to-completion/#clean-up-finished-jobs-automatically) for more details.

The TTL-after-finished controller will assume that a resource is eligible to be cleaned up
from TTL seconds after the resource has finished, in other words, when the TTL has expired. When the
TTL controller cleans up a resource, it will delete it cascadingly, i.e. delete
its dependent objects together with it. Note that when the resource is deleted,
its lifecycle guarantees, such as finalizers, will be honored.

## Time skew

Because the TTL-after-finished controller uses timestamps stored in the Kubernetes resources to
determine whether the TTL has expired or not, this feature is sensitive to time
skew in your cluster. If the clocks in a cluster are out of synchronization,
the TTL-after-finished controller could clean up resource objects at the wrong time.

{{< note >}}
You should ensure that all Nodes, and also your control plane, are using a time
synchronization system such as NTP.
{{< /note >}}

{{% /capture %}}
