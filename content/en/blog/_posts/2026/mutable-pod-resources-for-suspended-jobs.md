---
layout: blog
title: "Kubernetes v1.36: Mutable Pod Resources for Suspended Jobs (beta)"
draft: true
slug: kubernetes-v1-36-mutable-pod-resources-for-suspended-jobs
author: >
  [Kevin Hannon](https://github.com/kannon92) (Red Hat)
---

Kubernetes v1.36 promotes the ability to modify container resource requests and limits
in the pod template of a suspended Job to beta. First introduced as alpha in v1.35, this
feature allows queue controllers and cluster administrators to adjust CPU, memory, GPU,
and extended resource specifications on a Job while it is suspended, before it starts
or resumes running.

## Why mutable pod resources for suspended Jobs?

Batch and machine learning workloads often have resource requirements that are not
precisely known at Job creation time. The optimal resource allocation depends on
current cluster capacity, queue priorities, and the availability of specialized hardware
like GPUs.

Before this feature, resource requirements in a Job's pod template were immutable once set.
If a queue controller like [Kueue](https://kueue.sigs.k8s.io/) determined that a suspended
Job should run with different resources, the only option was to delete and recreate the Job,
losing any associated metadata, status, or history. This feature also provides a way
to let a specific Job instance for a CronJob progress slowly with reduced resources,
rather than outright failing to run if the cluster is heavily loaded.

Consider a machine learning training Job initially requesting 4 GPUs:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: training-job-example-abcd123
  labels:
    app.kubernetes.io/name: trainer
spec:
  suspend: true
  template:
    metadata:
      annotations:
        kubernetes.io/description: "ML training, ID abcd123"
    spec:
      containers:
      - name: trainer
        image: example-registry.example.com/training:2026-04-23T150405.678
        resources:
          requests:
            cpu: "8"
            memory: "32Gi"
            example-hardware-vendor.com/gpu: "4"
          limits:
            cpu: "8"
            memory: "32Gi"
            example-hardware-vendor.com/gpu: "4"
      restartPolicy: Never
```

A queue controller managing cluster resources might determine that only 2 GPUs
are available. With this feature, the controller can update the Job's resource
requests before resuming it:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: training-job-example-abcd123
  labels:
    app.kubernetes.io/name: trainer
spec:
  suspend: true
  template:
    metadata:
      annotations:
        kubernetes.io/description: "ML training, ID abcd123"
    spec:
      containers:
      - name: trainer
        image: example-registry.example.com/training:2026-04-23T150405.678
        resources:
          requests:
            cpu: "4"
            memory: "16Gi"
            example-hardware-vendor.com/gpu: "2"
          limits:
            cpu: "4"
            memory: "16Gi"
            example-hardware-vendor.com/gpu: "2"
      restartPolicy: Never
```

Once the resources are updated, the controller resumes the Job by setting
`spec.suspend` to `false`, and the new Pods are created with the adjusted
resource specifications.

## How it works

The Kubernetes API server relaxes the immutability constraint on pod template
resource fields specifically for suspended Jobs. No new API types have been introduced;
the existing Job and pod template structures accommodate the change through
relaxed validation.

The mutable fields are:
- `spec.template.spec.containers[*].resources.requests`
- `spec.template.spec.containers[*].resources.limits`
- `spec.template.spec.initContainers[*].resources.requests`
- `spec.template.spec.initContainers[*].resources.limits`

Resource updates are permitted when the following conditions are met:
1. The Job has `spec.suspend` set to `true`.
2. For a Job that was previously running and then suspended, all active
   Pods must have terminated (`status.active` equals 0) before resource
   mutations are accepted.

Standard resource validation still applies. For example, resource limits
must be greater than or equal to requests, and extended resources must be
specified as whole numbers where required.

## What's new in beta

With the promotion to beta in Kubernetes v1.36, the
`MutablePodResourcesForSuspendedJobs` feature gate is enabled by default.
This means clusters running v1.36 can use this feature without any additional
configuration on the API server.

## Try it out

If your cluster is running Kubernetes v1.36 or later, this feature is available
by default. For v1.35 clusters, enable the `MutablePodResourcesForSuspendedJobs`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) on
the `kube-apiserver`.

You can test it by creating a suspended Job, updating its container resources
using `kubectl edit` or a controller, and then resuming the Job:

```shell
# Create a suspended Job
kubectl apply -f my-job.yaml --server-side

# Edit the resource requests
kubectl edit job training-job-example-abcd123

# Resume the Job
kubectl patch job training-job-example-abcd123 -p '{"spec":{"suspend":false}}'
```

## Considerations

### Running Jobs that are suspended

If you suspend a Job that was already running, you must wait for **all** of that Job's active
Pods to terminate before modifying resources. The API server rejects resource
mutations while `status.active` is greater than zero. This prevents inconsistency
between running Pods and the updated pod template.

### Pod replacement policy

When using this feature with Jobs that may have failed Pods, consider setting
`podReplacementPolicy: Failed`. This ensures that replacement Pods are only
created after the previous Pods have fully terminated, preventing resource
contention from overlapping Pods.

### ResourceClaims

Dynamic Resource Allocation (DRA) `resourceClaimTemplates` remain immutable.
If your workload uses DRA, you must recreate the claim templates separately
to match any resource changes.

## Getting involved

This feature was developed by [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps)
with input from the [WG Batch](https://github.com/kubernetes/community/tree/master/wg-batch) group. We welcome feedback
as the feature progresses toward stable.

You can reach out through:
- Slack channel [#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9).
- Slack channel [#wg-batch](https://kubernetes.slack.com/archives/C032ZE66A2X).
- The [KEP-5440](https://kep.k8s.io/5440) tracking issue.
