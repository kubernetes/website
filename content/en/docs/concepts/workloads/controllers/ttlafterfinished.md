---
reviewers:
- janetkuo
title: Automatic Clean-up for Finished Jobs 
content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

TTL-after-finished {{<glossary_tooltip text="controller" term_id="controller">}} provides a 
TTL (time to live) mechanism to limit the lifetime of resource objects that 
have finished execution. TTL controller only handles 
{{< glossary_tooltip text="Jobs" term_id="job" >}}.

<!-- body -->

## TTL-after-finished Controller

The TTL-after-finished controller is only supported for Jobs. A cluster operator can use this feature to clean
up finished Jobs (either `Complete` or `Failed`) automatically by specifying the
`.spec.ttlSecondsAfterFinished` field of a Job, as in this
[example](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).
The TTL-after-finished controller will assume that a job is eligible to be cleaned up
TTL seconds after the job has finished, in other words, when the TTL has expired. When the
TTL-after-finished controller cleans up a job, it will delete it cascadingly, that is to say it will delete
its dependent objects together with it. Note that when the job is deleted,
its lifecycle guarantees, such as finalizers, will be honored.

The TTL seconds can be set at any time. Here are some examples for setting the
`.spec.ttlSecondsAfterFinished` field of a Job:

* Specify this field in the job manifest, so that a Job can be cleaned up
  automatically some time after it finishes.
* Set this field of existing, already finished jobs, to adopt this new
  feature.
* Use a
  [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  to set this field dynamically at job creation time. Cluster administrators can
  use this to enforce a TTL policy for finished jobs.
* Use a
  [mutating admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  to set this field dynamically after the job has finished, and choose
  different TTL values based on job status, labels, etc.

## Caveat

### Updating TTL Seconds

Note that the TTL period, e.g. `.spec.ttlSecondsAfterFinished` field of Jobs,
can be modified after the job is created or has finished. However, once the
Job becomes eligible to be deleted (when the TTL has expired), the system won't
guarantee that the Jobs will be kept, even if an update to extend the TTL
returns a successful API response.

### Time Skew

Because TTL-after-finished controller uses timestamps stored in the Kubernetes jobs to
determine whether the TTL has expired or not, this feature is sensitive to time
skew in the cluster, which may cause TTL-after-finish controller to clean up job objects
at the wrong time.

Clocks aren't always correct, but the difference should be
very small. Please be aware of this risk when setting a non-zero TTL.



## {{% heading "whatsnext" %}}

* [Clean up Jobs automatically](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)

* [Design doc](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)

