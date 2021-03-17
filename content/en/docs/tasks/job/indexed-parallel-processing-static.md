---
title: Indexed Job for Parallel Processing with Static Work Assignment
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

<!-- overview -->


In this example, you will run a Kubernetes Job that uses multiple parallel
worker processes.
Each worker is a different container running in its own Pod. The Pods have an
_index number_ that the control plane sets automatically, which allows each Pod
to identify which part of the overall task to work on.

The pod index is available in the {{< glossary_tooltip text="annotation" term_id="annotation" >}}
`batch.kubernetes.io/job-completion-index` as string representing its
decimal value. In order for the containerized task process to obtain this index,
you can publish the value of the annotation using the [downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#the-downward-api)
mechanism.
For convenience, the control plane automatically sets the downward API to
expose the index in the `JOB_COMPLETION_INDEX` environment variable.

Here is an overview of the steps in this example:

1. **Create an image that can read the pod index**. You might modify the worker
   program or add a script wrapper.
2. **Start an Indexed Job**. The downward API allows you to pass the annotation
   as an environment variable or file to the container.

## {{% heading "prerequisites" %}}

Be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

To be able to create Indexed Jobs, make sure to enable the `IndexedJob`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the [API server](docs/reference/command-line-tools-reference/kube-apiserver/)
and the [controller manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

<!-- steps -->

## Choose an approach

To access the work item from the worker program, you have a few options:

1. Read the `JOB_COMPLETION_INDEX` environment variable. The Job
   {{< glossary_tooltip text="controller" term_id="controller" >}}
   automatically links this variable to the annotation containing the completion
   index.
1. Read a file that contains the completion index.
1. Assuming that you can't modify the program, you can wrap it with a script
   that reads the index using any of the methods above and converts it into
   something that the program can use as input.
  
For this example, imagine that you chose option 3 and you want to run the
[rev](https://man7.org/linux/man-pages/man1/rev.1.html) utility. This
program accepts a file as an argument and prints its content reversed.

```shell
rev data.txt
```

For this example, you'll use the `rev` tool from the
[`busybox`](https://hub.docker.com/_/busybox) container image.

## Define an Indexed Job

Here is a job definition. You'll need to edit the container image to match your
preferred registry.

{{< codenew language="yaml" file="application/job/indexed-job.yaml" >}}

In the example above, you use the builtin `JOB_COMPLETION_INDEX` environment
variable set by the Job controller for all containers. An [init container](/docs/concepts/workloads/pods/init-containers/)
maps the index to a static value and writes it to a file that is shared with the
container running the worker through an [emptyDir volume](/docs/concepts/storage/volumes/#emptydir).
Optionally, you can [define your own environment variable through the downward
API](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
to publish the index to containers. You can also choose to load a list of values
from a [ConfigMap as an environment variable or file](/docs/tasks/configure-pod-container/configure-pod-configmap/).

Alternatively, you can directly [use the downward API to pass the annotation
value as a volume file](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#store-pod-fields),
like shown in the following example:

{{< codenew language="yaml" file="application/job/indexed-job-vol.yaml" >}}

## Running the Job

Now run the Job:

```shell
kubectl apply -f ./indexed-job.yaml
```

Wait a bit, then check on the job:

```shell
kubectl describe jobs/indexed-job
```

The output is similar to:

```
Name:              indexed-job
Namespace:         default
Selector:          controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
Labels:            controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
                   job-name=indexed-job
Annotations:       <none>
Parallelism:       3
Completions:       5
Start Time:        Thu, 11 Mar 2021 15:47:34 +0000
Pods Statuses:     2 Running / 3 Succeeded / 0 Failed
Completed Indexes: 0-2
Pod Template:
  Labels:  controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
           job-name=indexed-job
  Init Containers:
   input:
    Image:      docker.io/library/bash
    Port:       <none>
    Host Port:  <none>
    Command:
      bash
      -c
      items=(foo bar baz qux xyz)
      echo ${items[$JOB_COMPLETION_INDEX]} > /input/data.txt

    Environment:  <none>
    Mounts:
      /input from input (rw)
  Containers:
   worker:
    Image:      docker.io/library/busybox
    Port:       <none>
    Host Port:  <none>
    Command:
      rev
      /input/data.txt
    Environment:  <none>
    Mounts:
      /input from input (rw)
  Volumes:
   input:
    Type:       EmptyDir (a temporary directory that shares a pod's lifetime)
    Medium:
    SizeLimit:  <unset>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-njkjj
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-9kd4h
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-qjwsz
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-fdhq5
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-ncslj
```

In this example, we run the job with custom values for each index. You can
inspect the output of the pods:

```shell
kubectl logs indexed-job-fdhq5 # Change this to match the name of a Pod in your cluster.
```

The output is similar to:

```
xuq
```