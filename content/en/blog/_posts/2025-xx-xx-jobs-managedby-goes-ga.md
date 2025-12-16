---
layout: blog
title: "Kubernetes v1.35: Job Managed By Goes GA"
date: 2025-XX-XX
draft: true
slug: kubernetes-v1-35-job-managedby-for-jobs-goes-ga
author: >
  [Dejan Zele Pejchev](https://github.com/dejanzele) (G-Research),
  [Michał Woźniak](https://github.com/mimowo) (Google)
---

In Kubernetes v1.35, the ability to specify an external Job controller (through `.spec.managedBy`) graduates to General Availability.

This feature allows external controllers to take full responsibility for Job reconciliation, unlocking powerful scheduling patterns like multi-cluster dispatching with [MultiKueue](https://kueue.sigs.k8s.io/docs/concepts/multikueue/).

## Why delegate Job reconciliation?

The primary motivation for this feature is to support multi-cluster batch scheduling architectures, such as MultiKueue.

The MultiKueue architecture distinguishes between a Management Cluster and a pool of Worker Clusters:
- The Management Cluster is responsible for dispatching Jobs but not executing them. It needs to accept Job objects to track status, but it skips the creation and execution of Pods.
- The Worker Clusters receive the dispatched Jobs and execute the actual Pods.
- Users usually interact with the Management Cluster. Because the status is automatically propagated back, they can observe the Job's progress "live" without accessing the Worker Clusters.
- In the Worker Clusters, the dispatched Jobs run as regular Jobs managed by the built-in Job controller, with no `.spec.managedBy` set.

By using `.spec.managedBy`, the MultiKueue controller on the Management Cluster can take over the reconciliation of a Job. It copies the status from the "mirror" Job running on the Worker Cluster back to the Management Cluster.

Why not just disable the Job controller? While one could theoretically achieve this by disabling the built-in Job controller entirely, this is often impossible or impractical for two reasons:
1. Managed Control Planes: In many cloud environments, the Kubernetes control plane is locked, and users cannot modify controller manager flags.
2. Hybrid Cluster Role: Users often need a "hybrid" mode where the Management Cluster dispatches some heavy workloads to remote clusters but still executes smaller or control-plane-related Jobs in the Management Cluster. `.spec.managedBy` allows this granularity on a per-Job basis.

## How `.spec.managedBy` works

The `.spec.managedBy` field indicates which controller is responsible for the Job, specifically there are two modes of operation:
- **Standard**: if unset or set to the reserved value `kubernetes.io/job-controller`, the built-in Job controller reconciles the Job as usual (standard behavior).
- **Delegation**: If set to any other value, the built-in Job controller skips reconciliation entirely for that Job.

To prevent orphaned Pods or resource leaks, this field is immutable. You cannot transfer a running Job from one controller to another.

If you are looking into implementing an external controller, be aware that your controller needs to be conformant with the definitions for the [Job API](/docs/reference/kubernetes-api/workload-resources/job-v1/).
In order to enforce the conformance, a significant part of the effort was to introduce the extensive Job status validation rules.
Navigate to the [How can you learn more?](#how-can-you-learn-more) section for more details.

## Ecosystem Adoption

The `.spec.managedBy` field is rapidly becoming the standard interface for delegating control in the Kubernetes batch ecosystem.

Various custom workload controllers are adding this field (or an equivalent) to allow MultiKueue to take over their reconciliation and orchestrate them across clusters:
- [JobSet](https://github.com/kubernetes-sigs/jobset)
- [Kubeflow Trainer](https://www.kubeflow.org/docs/components/training/)
- [KubeRay](https://docs.ray.io/en/latest/cluster/kubernetes/)
- [AppWrapper](https://project-codeflare.github.io/appwrapper/)
- [Tekton Pipelines](https://tekton.dev/docs/)

While it is possible to use `.spec.managedBy` to implement a custom Job controller from scratch, we haven't observed that yet. The feature is specifically designed to support delegation patterns, like MultiKueue, without reinventing the wheel.

## How can you learn more?

If you want to dig deeper:

Read the user-facing documentation for:
- [Jobs](/docs/concepts/workloads/controllers/job/),
- [Delegation of managing a Job object to an external controller](/docs/concepts/workloads/controllers/job/#delegation-of-managing-a-job-object-to-external-controller), and
- [MultiKueue](https://kueue.sigs.k8s.io/docs/concepts/multikueue/).

Deep dive into the design history:
- The Kubernetes Enhancement Proposal (KEP) [Job's managed-by mechanism](https://github.com/kubernetes/enhancements/issues/4368) including introduction of the extensive [Job status validation rules](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/4368-support-managed-by-for-batch-jobs#job-status-validation).
- The Kueue KEP for [MultiKueue](https://github.com/kubernetes-sigs/kueue/tree/main/keps/693-multikueue).

Explore how MultiKueue uses `.spec.managedBy` in practice in the task guide for [running Jobs across clusters](https://kueue.sigs.k8s.io/docs/tasks/run/multikueue/job/).

## Acknowledgments

As with any Kubernetes feature, a lot of people helped shape this one through design discussions, reviews, test runs,
and bug reports.

We would like to thank, in particular:

* [Maciej Szulik](https://github.com/soltysh) - for guidance, mentorship, and reviews.
* [Filip Křepinský](https://github.com/atiratree) - for guidance, mentorship, and reviews.

## Get involved

This work was sponsored by the Kubernetes
[Batch Working Group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps),
and with strong input from the
[SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) community.

If you are interested in batch scheduling, multi-cluster solutions, or further improving the Job API:

- Join us in the Batch WG and SIG Apps meetings.
- Subscribe to the [WG Batch Slack channel](https://kubernetes.slack.com/messages/wg-batch).
