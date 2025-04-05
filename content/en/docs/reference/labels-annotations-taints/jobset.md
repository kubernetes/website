---
title: JobSet labels, annotations and taints
content_type: concept
weight: 76
---

## JobSet annotations

### jobset.sigs.k8s.io/jobset-name

Example:  `jobset.sigs.k8s.io/jobset-name: "my-jobset"`

Used on: Job, Pod

This annotation is used to store the name of the JobSet that a Job or Pod belongs to.
[JobSet](https://jobset.sigs.k8s.io) is an extension API that you can deploy into your Kubernetes cluster.

### jobset.sigs.k8s.io/replicatedjob-replicas

Example: `jobset.sigs.k8s.io/replicatedjob-replicas: "5"`

Used on: Job, Pod

This annotation specifies the number of replicas for a ReplicatedJob.

### jobset.sigs.k8s.io/replicatedjob-name

Example: `jobset.sigs.k8s.io/replicatedjob-name: "my-replicatedjob"`

Used on: Job, Pod

This annotation stores the name of the replicated job that this Job or Pod is part of.

### jobset.sigs.k8s.io/job-index

Example: `jobset.sigs.k8s.io/job-index: "0"`

Used on: Job, Pod

This annotation is set by the JobSet controller on child Jobs and Pods.
It contains the index of the Job replica within its parent ReplicatedJob.

### jobset.sigs.k8s.io/job-key

Example: `jobset.sigs.k8s.io/job-key: "0f1e93893c4cb372080804ddb9153093cb0d20cefdd37f653e739c232d363feb"`

Used on: Job, Pod

The JobSet controller sets this annotation on child Jobs and
Pods of a JobSet. The value is the SHA256 hash of the namespaced Job name.

### alpha.jobset.sigs.k8s.io/exclusive-topology

Example: `alpha.jobset.sigs.k8s.io/exclusive-topology: "zone"`

Used on: JobSet, Job

You can set this annotation on a [JobSet](https://jobset.sigs.k8s.io) to ensure exclusive Job
placement per topology group. You can also define this annotation on a replicated job
template. Read the documentation for JobSet to learn more.

### alpha.jobset.sigs.k8s.io/node-selector

Example: `alpha.jobset.sigs.k8s.io/node-selector: "true"`

Used on: Job, Pod

This annotation can be applied to a JobSet.
When it's set, the JobSet controller modifies the Jobs and their corresponding Pods
by adding node selectors and tolerations.
This ensures exclusive job placement per topology domain, restricting the scheduling
of these Pods to specific nodes based on the strategy.

### jobset.sigs.k8s.io/coordinator

Example: `jobset.sigs.k8s.io/coordinator: "myjobset-workers-0-0.headless-svc"`

Used on: Job, Pod

This annotation is used on Jobs and Pods to store a stable network endpoint
where the coordinator pod can be reached if the
[JobSet](https://jobset.sigs.k8s.io) spec defines the `.spec.coordinator` field.

## JobSet labels

### alpha.jobset.sigs.k8s.io/namespaced-job

Example: `alpha.jobset.sigs.k8s.io/namespaced-job: "default_myjobset-replicatedjob-0"`

Used on: Node

This label is either set manually or automatically (for example, a cluster autoscaler) on the nodes.
When `alpha.jobset.sigs.k8s.io/node-selector` is set to `"true"`, the JobSet controller adds a
`nodeSelector` to this node label (along with the toleration to the taint
[`alpha.jobset.sigs.k8s.io/no-schedule`](#alpha-jobset-sigs-k8s-io-no-schedule)).

### jobset.sigs.k8s.io/job-index

Example: `jobset.sigs.k8s.io/job-index: "0"`

Used on: Job, Pod

This label is set by the JobSet controller on child Jobs and Pods.
It contains the index of the Job replica within its parent ReplicatedJob.

### jobset.sigs.k8s.io/job-key

Example: `jobset.sigs.k8s.io/job-key: "0f1e93893c4cb372080804ddb9153093cb0d20cefdd37f653e739c232d363feb"`

Used on: Job, Pod

The JobSet controller sets this label (and also an annotation with the same key)  on child Jobs and
Pods of a JobSet. The value is the SHA256 hash of the namespaced Job name.

### jobset.sigs.k8s.io/jobset-name

Example:  `jobset.sigs.k8s.io/jobset-name: "my-jobset"`

Used on: Job, Pod

This label is used to store the name of the JobSet that a Job or Pod belongs to.
[JobSet](https://jobset.sigs.k8s.io) is an extension API that you can deploy into your Kubernetes cluster.

### jobset.sigs.k8s.io/replicatedjob-name

Example: `jobset.sigs.k8s.io/replicatedjob-name: "my-replicatedjob"`

Used on: Job, Pod

This label stores the name of the replicated job that this Job or Pod is part of.

### jobset.sigs.k8s.io/replicatedjob-replicas

Example: `jobset.sigs.k8s.io/replicatedjob-replicas: "5"`

Used on: Job, Pod

This label specifies the number of replicas for a ReplicatedJob.

## JobSet Taints

### alpha.jobset.sigs.k8s.io/no-schedule

Example: `alpha.jobset.sigs.k8s.io/no-schedule: "NoSchedule"`

This taint is either set manually or automatically (for example, a cluster autoscaler)
on the Node objects. When `alpha.jobset.sigs.k8s.io/node-selector` is set to  `"true"`,
the JobSet controller adds a toleration to this node taint (along with the node selector
to the label `alpha.jobset.sigs.k8s.io/namespaced-job` disucssed previously).

