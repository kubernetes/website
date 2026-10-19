---
layout: blog
title: "Kubernetes 1.26: Job Tracking, to Support Massively Parallel Batch Workloads, Is Generally Available"
date: 2022-12-29
slug: "scalable-job-tracking-ga"
author: >
  Aldo Culquicondor (Google)
---

The Kubernetes 1.26 release includes a stable implementation of the [Job](/docs/concepts/workloads/controllers/job/)
controller that can reliably track a large amount of Jobs with high levels of
parallelism. [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps)
and [WG Batch](https://github.com/kubernetes/community/tree/master/wg-batch)
have worked on this foundational improvement since Kubernetes 1.22. After
multiple iterations and scale verifications, this is now the default
implementation of the Job controller.

Paired with the Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode),
the Job controller can handle massively parallel batch Jobs, supporting up to
100k concurrent Pods.

The new implementation also made possible the development of [Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy),
which is in beta in the 1.26 release.

## How do I use this feature?

To use Job tracking with finalizers, upgrade to Kubernetes 1.25 or newer and
create new Jobs. You can also use this feature in v1.23 and v1.24, if you have the
ability to enable the `JobTrackingWithFinalizers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

If your cluster runs Kubernetes 1.26, Job tracking with finalizers is a stable
feature. For v1.25, it's behind that feature gate, and your cluster administrators may have
explicitly disabled it - for example, if you have a policy of not using
beta features.

Jobs created before the upgrade will still be tracked using the legacy behavior.
This is to avoid retroactively adding finalizers to running Pods, which might
introduce race conditions.

For maximum performance on large Jobs, the Kubernetes project recommends
using the [Indexed completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).
In this mode, the control plane is able to track Job progress with less API
calls.

If you are a developer of operator(s) for batch, [HPC](https://en.wikipedia.org/wiki/High-performance_computing),
[AI](https://en.wikipedia.org/wiki/Artificial_intelligence), [ML](https://en.wikipedia.org/wiki/Machine_learning)
or related workloads, we encourage you to use the Job API to delegate accurate
progress tracking to Kubernetes. If there is something missing in the Job API
that forces you to manage plain Pods, the [Working Group Batch](https://github.com/kubernetes/community/tree/master/wg-batch)
welcomes your feedback and contributions.

### Deprecation notices

During the development of the feature, the control plane added the annotation
[`batch.kubernetes.io/job-tracking`](/docs/reference/labels-annotations-taints/#batch-kubernetes-io-job-tracking)
to the Jobs that were created when the feature was enabled.
This allowed a safe transition for older Jobs, but it was never meant to stay.

In the 1.26 release, we deprecated the annotation `batch.kubernetes.io/job-tracking`
and the control plane will stop adding it in Kubernetes 1.27.
Along with that change, we will remove the legacy Job tracking implementation.
As a result, the Job controller will track all Jobs using finalizers and it will
ignore Pods that don't have the aforementioned finalizer.

Before you upgrade your cluster to 1.27, we recommend that you verify that there
are no running Jobs that don't have the annotation, or you wait for those jobs
to complete.
Otherwise, you might observe the control plane recreating some Pods.
We expect that this shouldn't affect any users, as the feature is enabled by
default since Kubernetes 1.25, giving enough buffer for old jobs to complete.

## What problem does the new implementation solve?

Generally, Kubernetes workload controllers, such as ReplicaSet or StatefulSet,
rely on the existence of Pods or other objects in the API to determine the
status of the workload and whether replacements are needed.
For example, if a Pod that belonged to a ReplicaSet terminates or ceases to
exist, the ReplicaSet controller needs to create a replacement Pod to satisfy
the desired number of replicas (`.spec.replicas`).

Since its inception, the Job controller also relied on the existence of Pods in
the API to track Job status. A Job has [completion](/docs/concepts/workloads/controllers/job/#completion-mode)
and [failure handling](/docs/concepts/workloads/controllers/job/#handling-pod-and-container-failures)
policies, requiring the end state of a finished Pod to determine whether to
create a replacement Pod or mark the Job as completed or failed. As a result,
the Job controller depended on Pods, even terminated ones, to remain in the API
in order to keep track of the status.

This dependency made the tracking of Job status unreliable, because Pods can be
deleted from the API for a number of reasons, including:
- The garbage collector removing orphan Pods when a Node goes down.
- The garbage collector removing terminated Pods when they reach a threshold.
- The Kubernetes scheduler preempting a Pod to accommodate higher priority Pods.
- The taint manager evicting a Pod that doesn't tolerate a `NoExecute` taint.
- External controllers, not included as part of Kubernetes, or humans deleting
  Pods.

### The new implementation

When a controller needs to take an action on objects before they are removed, it
should add a [finalizer](/docs/concepts/overview/working-with-objects/finalizers/)
to the objects that it manages.
A finalizer prevents the objects from being deleted from the API until the
finalizers are removed. Once the controller is done with the cleanup and
accounting for the deleted object, it can remove the finalizer from the object and the
control plane removes the object from the API.

This is what the new Job controller is doing: adding a finalizer during Pod
creation, and removing the finalizer after the Pod has terminated and has been
accounted for in the Job status. However, it wasn't that simple.

The main challenge is that there are at least two objects involved: the Pod
and the Job. While the finalizer lives in the Pod object, the accounting lives
in the Job object. There is no mechanism to atomically remove the finalizer in
the Pod and update the counters in the Job status. Additionally, there could be
more than one terminated Pod at a given time.

To solve this problem, we implemented a three staged approach, each translating
to an API call.
1. For each terminated Pod, add the unique ID (UID) of the Pod into short-lived
   lists stored in the `.status` of the owning Job
   ([.status.uncountedTerminatedPods](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus)).
2. Remove the finalizer from the Pods(s).
3. Atomically do the following operations:
   - remove UIDs from the short-lived lists
   - increment the overall `succeeded` and `failed` counters in the `status` of
     the Job.

Additional complications come from the fact that the Job controller might
receive the results of the API changes in steps 1 and 2 out of order. We solved
this by adding an in-memory cache for removed finalizers.

Still, we faced some issues during the beta stage, leaving some pods stuck
with finalizers in some conditions ([#108645](https://github.com/kubernetes/kubernetes/issues/108645),
[#109485](https://github.com/kubernetes/kubernetes/issues/109485), and
[#111646](https://github.com/kubernetes/kubernetes/pull/111646)). As a result,
we decided to switch that feature gate to be disabled by default for the 1.23
and 1.24 releases.

Once resolved, we re-enabled the feature for the 1.25 release. Since then, we
have received reports from our customers running tens of thousands of Pods at a
time in their clusters through the Job API. Seeing this success, we decided to
graduate the feature to stable in 1.26, as part of our long term commitment to
make the Job API the best way to run large batch Jobs in a Kubernetes cluster.

To learn more about the feature, you can read the [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/2307-job-tracking-without-lingering-pods).

## Acknowledgments

As with any Kubernetes feature, multiple people contributed to getting this
done, from testing and filing bugs to reviewing code.

On behalf of SIG Apps, I would like to especially thank Jordan Liggitt (Google)
for helping me debug and brainstorm solutions for more than one race condition
and Maciej Szulik (Red Hat) for his thorough reviews.
