---
title: "Introducing Indexed Jobs"
date: 2021-04-19
slug: introducing-indexed-jobs
author: >
  Aldo Culquicondor (Google)
---

Once you have containerized a non-parallel [Job](/docs/concepts/workloads/controllers/job/),
it is quite easy to get it up and running on Kubernetes without modifications to
the binary. In most cases, when running parallel distributed Jobs, you had
to set a separate system to partition the work among the workers. For
example, you could set up a task queue to [assign one work item to each
Pod](/docs/tasks/job/coarse-parallel-processing-work-queue/) or [multiple items
to each Pod until the queue is emptied](/docs/tasks/job/fine-parallel-processing-work-queue/).

The Kubernetes 1.21 release introduces a new field to control Job _completion mode_,
a configuration option that allows you to control how Pod completions affect the
overall progress of a Job, with two possible options (for now):

- `NonIndexed` (default): the Job is considered complete when there has been
  a number of successfully completed Pods equal to the specified number in
  `.spec.completions`. In other words, each Pod completion is homologous to
  each other. Any Job you might have created before the introduction of
  completion modes is implicitly NonIndexed.
- `Indexed`: the Job is considered complete when there is one successfully
  completed Pod associated with each index from 0 to `.spec.completions-1`. The
  index is exposed to each Pod in the `batch.kubernetes.io/job-completion-index`
  annotation and the `JOB_COMPLETION_INDEX` environment variable.

You can start using Jobs with Indexed completion mode, or Indexed Jobs, for
short, to easily start parallel Jobs. Then, each worker Pod can have a statically
assigned partition of the data based on the index. This saves you from having to
set up a queuing system or even having to modify your binary!

## Creating an Indexed Job

To create an Indexed Job, you just have to add `completionMode: Indexed` to the
Job spec and make use of the `JOB_COMPLETION_INDEX` environment variable.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: 'sample-job'
spec:
  completions: 3
  parallelism: 3
  completionMode: Indexed
  template:
    spec:
      restartPolicy: Never
      containers:
      - command:
        - 'bash'
        - '-c'
        - 'echo "My partition: ${JOB_COMPLETION_INDEX}"'
        image: 'docker.io/library/bash'
        name: 'sample-load'
```

Note that completion mode is an alpha feature in the 1.21 release. To be able to
use it in your cluster, make sure to enable the `IndexedJob` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) on the
[API server](/docs/reference/command-line-tools-reference/kube-apiserver/) and
the [controller manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

When you run the example, you will see that each of the three created Pods gets a
different completion index. For the user's convenience, the control plane sets the
`JOB_COMPLETION_INDEX` environment variable, but you can choose to [set your
own](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
or [expose the index as a file](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

See [Indexed Job for parallel processing with static work
assignment](/docs/tasks/job/indexed-parallel-processing-static/) for a
step-by-step guide, and a few more examples.

## Future plans

SIG Apps envisions that there might be more completion modes that enable more
use cases for the Job API. We welcome you to open issues in
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) with your
suggestions.

In particular, we are considering an `IndexedAndUnique` mode where the indexes
are not just available as annotation, but they are part of the Pod names,
similar to {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}.
This should facilitate inter-Pod communication for tightly coupled Pods.
You can join the discussion in the [open issue](https://github.com/kubernetes/kubernetes/issues/99497).

## Wrap-up

Indexed Jobs allows you to statically partition work among the workers of your
parallel Jobs. SIG Apps hopes that this feature facilitates the migration of
more batch workloads to Kubernetes.