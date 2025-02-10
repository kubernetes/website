---
layout: blog
title: "Introducing JobSet"
date: 2025-02-03
slug: introducing-jobset
draft: true
---

**Authors**: Daniel Vega-Myhre (Google), Abdullah Gharaibeh (Google), Kevin Hannon (Red Hat)

In this article, we introduce [JobSet](https://jobset.sigs.k8s.io/), an open source API for
representing distributed jobs. The goal of JobSet is to provide a unified API for distributed ML
training and HPC workloads on Kubernetes.

## Why JobSet?

The Kubernetes community’s recent enhancements to the batch ecosystem on Kubernetes has attracted ML
engineers who have found it to be a natural fit for the requirements of running distributed training
workloads. 

Large ML models (particularly LLMs) which cannot fit into the memory of the GPU or TPU chips on a
single host are often distributed across tens of thousands of accelerator chips, which in turn may
span thousands of hosts.

As such, the model training code is often containerized and executed simultaneously on all these
hosts, performing distributed computations which often shard both the model parameters and/or the
training dataset across the target accelerator chips, using communication collective primitives like
all-gather and all-reduce to perform distributed computations and synchronize gradients between
hosts. 

These workload characteristics make Kubernetes a great fit for this type of workload, as efficiently
scheduling and managing the lifecycle of containerized applications across a cluster of compute
resources is an area where it shines. 

It is also very extensible, allowing developers to define their own Kubernetes APIs, objects, and
controllers which manage the behavior and life cycle of these objects, allowing engineers to develop
custom distributed training orchestration solutions to fit their needs.

However, as distributed ML training techniques continue to evolve, existing Kubernetes primitives do
not adequately model them alone anymore. 

Furthermore, the landscape of Kubernetes distributed training orchestration APIs has become
fragmented, and each of the existing solutions in this fragmented landscape has certain limitations
that make it non-optimal for distributed ML training. 

For example, the KubeFlow training operator defines custom APIs for different frameworks (e.g.
PyTorchJob, TFJob, MPIJob, etc.); however, each of these job types are in fact a solution fit
specifically to the target framework, each with different semantics and behavior. 

On the other hand, the Job API fixed many gaps for running batch workloads, including Indexed
completion mode, higher scalability, Pod failure policies and Pod backoff policy to mention a few of
the most recent enhancements. However, running ML training and HPC workloads using the upstream Job
API requires extra orchestration to fill the following gaps:

Multi-template Pods : Most HPC or ML training jobs include more than one type of Pods. The different
Pods are part of the same workload, but they need to run a different container, request different
resources or have different failure policies. A common example is the driver-worker pattern.

Job groups : Large scale training workloads span multiple network topologies, running across
multiple racks for example. Such workloads are network latency sensitive, and aim to localize
communication and minimize traffic crossing the higher-latency network links. To facilitate this,
the workload needs to be split into groups of Pods each assigned to a network topology.

Inter-Pod communication : Create and manage the resources (e.g. [headless
Services](/docs/concepts/services-networking/service/#headless-services)) necessary to establish
communication between the Pods of a job.

Startup sequencing : Some jobs require a specific start sequence of pods; sometimes the driver is
expected to start first (like Ray or Spark), in other cases the workers are expected to be ready
before starting the driver (like MPI).

JobSet aims to address those gaps using the Job API as a building block to build a richer API for
large-scale distributed HPC and ML use cases.

## How JobSet Works
JobSet models a distributed batch workload as a group of Kubernetes Jobs. This allows a user to
easily specify different pod templates for different distinct groups of pods (e.g. a leader,
workers, parameter servers, etc.). 

It uses the abstraction of a ReplicatedJob to manage child Jobs, where a ReplicatedJob is
essentially a Job Template with some desired number of Job replicas specified. This provides a
declarative way to easily create identical child-jobs to run on different islands of accelerators,
without resorting to scripting or Helm charts to generate many versions of the same job but with
different names.

{{< figure src="jobset_diagram.svg" alt="JobSet Architecture" class="diagram-large" clicktozoom="true" >}}

Some other key JobSet features which address the problems described above include:

Replicated Jobs : In modern data centers, hardware accelerators like GPUs and TPUs allocated in
islands of homogenous accelerators connected via a specialized, high bandwidth network links. For
example, a user might provision nodes containing a group of hosts co-located on a rack, each with
H100 GPUs, where GPU chips within each host are connected via NVLink, with a NVLink Switch
connecting the multiple NVLinks. TPU Pods are another example of this: TPU ViperLitePods consist of
64 hosts, each with 4 TPU v5e chips attached, all connected via ICI mesh. When running a distributed
training job across multiple of these islands, we often want to partition the workload into a group
of smaller identical jobs, 1 per island, where each pod primarily communicates with the pods within
the same island to do segments of distributed computation, and keeping the gradient synchronization
over DCN (data center network, which is lower bandwidth than ICI) to a bare minimum. 

Automatic headless service creation, configuration, and lifecycle management : Pod-to-pod
communication via pod hostname is enabled by default, with automatic configuration and lifecycle
management of the headless service enabling this. 

Configurable success policies : JobSet has configurable success policies which target specific
ReplicatedJobs, with operators to target “Any” or “All” of their child jobs. For example, you can
configure the JobSet to be marked complete if and only if all pods that are part of the “worker”
ReplicatedJob are completed.

Configurable failure policies : JobSet has configurable failure policies which allow the user to
specify a maximum number of times the JobSet should be restarted in the event of a failure. If any
job is marked failed, the entire JobSet will be recreated, allowing the workload to resume from the
last checkpoint. When no failure policy is specified, if any job fails, the JobSet simply fails. 

Exclusive placement per topology domain : JobSet allows users to express that child jobs have 1:1
exclusive assignment to a topology domain, typically an accelerator island like a rack. For example,
if the JobSet creates two child jobs, then this feature will enforce that the pods of each child job
will be co-located on the same island, and that only one child job is allowed to schedule per
island. This is useful for scenarios where we want to use a distributed data parallel (DDP) training
strategy to train a model using multiple islands of compute resources (GPU racks or TPU slices),
running 1 model replica in each accelerator island, ensuring the forward and backward passes
themselves occur within a single model replica occurs over the high bandwidth interconnect linking
the accelerators chips within the island, and only the gradient synchronization between model
replicas occurs across accelerator islands over the lower bandwidth data center network.

Integration with Kueue : Users can submit JobSets via [Kueue](https://kueue.sigs.k8s.io/) to
oversubscribe their clusters, queue workloads to run as capacity becomes available, prevent partial
scheduling and deadlocks, enable multi-tenancy, and more.

## Example use case

### Distributed ML training on multiple TPU slices with Jax

The following example is a JobSet spec for running a TPU Multislice workload on 4 TPU v5e
[slices](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm#slices). To learn more about
TPU concepts and terminology, please refer to these
[docs](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm).

This example uses [Jax](https://jax.readthedocs.io/en/latest/quickstart.html), an ML framework with
native support for Just-In-Time (JIT) compilation targeting TPU chips via
[OpenXLA](https://github.com/openxla). However, you can also use
[PyTorch/XLA](https://pytorch.org/xla/release/2.3/index.html) to do ML training on TPUs.

This example makes use of several JobSet features (both explicitly and implicitly) to support the
unique scheduling requirements of TPU multislice training out-of-the-box with very little
configuration required by the user.

```yaml
# Run a simple Jax workload on 
apiVersion: jobset.x-k8s.io/v1alpha2
kind: JobSet
metadata:
  name: multislice
  annotations:
    # Give each child Job exclusive usage of a TPU slice 
    alpha.jobset.sigs.k8s.io/exclusive-topology: cloud.google.com/gke-nodepool
spec:
  failurePolicy:
    maxRestarts: 3
  replicatedJobs:
  - name: workers
    replicas: 4 # Set to number of TPU slices
    template:
      spec:
        parallelism: 2 # Set to number of VMs per TPU slice
        completions: 2 # Set to number of VMs per TPU slice
        backoffLimit: 0
        template:
          spec:
            hostNetwork: true
            dnsPolicy: ClusterFirstWithHostNet
            nodeSelector:
              cloud.google.com/gke-tpu-accelerator: tpu-v5-lite-podslice
              cloud.google.com/gke-tpu-topology: 2x4
            containers:
            - name: jax-tpu
              image: python:3.8
              ports:
              - containerPort: 8471
              - containerPort: 8080
              securityContext:
                privileged: true
              command:
              - bash
              - -c
              - |
                pip install "jax[tpu]" -f https://storage.googleapis.com/jax-releases/libtpu_releases.html
                python -c 'import jax; print("Global device count:", jax.device_count())'
                sleep 60
              resources:
                limits:
                  google.com/tpu: 4
```

## Future work and getting involved
We have a number of features on the JobSet roadmap planned for development this year, which can be
found in the [JobSet roadmap](https://github.com/kubernetes-sigs/jobset?tab=readme-ov-file#roadmap).

Please feel free to reach out with feedback of any kind. We’re also open to additional contributors,
whether it is to fix or report bugs, or help add new features or write documentation. 

You can get in touch with us via our [repo](http://sigs.k8s.io/jobset), [mailing
list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on
[Slack](https://kubernetes.slack.com/messages/wg-batch).

Last but not least, thanks to all [our
contributors](https://github.com/kubernetes-sigs/jobset/graphs/contributors) who made this project
possible!
