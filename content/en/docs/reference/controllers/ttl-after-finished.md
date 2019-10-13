---
toc_hide: true
title: TTL-after-finished controller
content_template: templates/concept
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

The TTL-after-finished controller provides a Time-To-Live mechanism to limit the lifetime of resource
objects that have finished execution.

The TTL-after-finished controller cleans up {{< glossary_tooltip text="Jobs" term_id="job" >}}
resources after they complete.

You can use the TTL-after-finished controller by enabling the
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`TTLAfterFinished`.

{{% /capture %}}

{{% capture body %}}

## Controller behavior

When this controller observes a Job that is finished (either `Complete` or `Failed`),
and that Job has `.spec.ttlSecondsAfterFinished` set, this controller waits until
the Job has been complete for that many seconds.

After the timer has expired, this controller deletes the Job.

{{< caution >}}
This controller uses timestamps stored in the Kubernetes resources to
determine whether the TTL has expired or not. Expiry checks are sensitive
to clock skew in your cluster. If different parts of your control plane
have unsynchronized clocks, the TTL-after-finished controller could
clean up resources at the wrong time.
{{< /caution >}}

{{% /capture %}}
{{% capture whatsnext %}}

* Read about [Jobs](/docs/concepts/workloads/controllers/job-run-to-completion/#clean-up-finished-jobs-automatically)
* Learn about other [resource clean-up controllers](/docs/reference/controllers/resource-cleanup-controllers/)

{{% /capture %}}
