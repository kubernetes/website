---
layout: blog
title: "Kubernetes v1.35: New level of efficiency with in-place Pod restart"
date: 2026-01-05T10:30:00-08:00
slug: kubernetes-v1-35-restart-all-containers
author: >
  [Yuan Wang](https://github.com/yuanwang04)
  [Giuseppe Tinti Tomio](https://github.com/GiuseppeTT)
  [Sergey Kanzhelev](https://github.com/SergeyKanzhelev)
---

The release of Kubernetes 1.35 introduces a powerful new feature that provides a much-requested capability: the ability to trigger a full, in-place restart of the Pod. This feature, *Restart All Containers* (alpha in 1.35), allows for an efficient way to reset a Pod's state compared to resource-intensive approach of deleting and recreating the entire Pod. This feature is especially useful for AI/ML workloads allowing application developers to concentrate on their core training logic while offloading complex failure-handling and recovery mechanisms to sidecars and declarative Kubernetes configuration. With `RestartAllContainers` and other planned enhancements, Kubernetes continues to add building blocks for creating the most flexible, robust, and efficient platforms for AI/ML workloads.

This new functionality is available by enabling the `RestartAllContainersOnContainerExits` feature gate. This alpha feature extends the [*Container Restart Rules* feature](/docs/concepts/workloads/pods/pod-lifecycle/#container-restart-rules), which graduated to beta in Kubernetes 1.35.

## The problem: when a single container restart isn't enough and recreating pods is too costly

Kubernetes has long supported restart policies at the Pod level (`restartPolicy`) and, more recently, at the [individual container level](/blog/2025/08/29/kubernetes-v1-34-per-container-restart-policy/). These policies are great for handling crashes in a single, isolated process. However, many modern applications have more complex inter-container dependencies. For instance:

- An **init container** prepares the environment by mounting a volume or generating a configuration file. If the main application container corrupts this environment, simply restarting that one container is not enough. The entire initialization process needs to run again.
- A **watcher sidecar** monitors system health. If it detects an unrecoverable but retriable error state, it must trigger a restart of the main application container from a clean slate.
- A **sidecar** that manages a remote resource fails. Even if the sidecar restarts on its own, the main container may be stuck trying to access an outdated or broken connection.

In all these cases, the desired action is not to restart a single container, but all of them. Previously, the only way to achieve this was to delete the Pod and have a controller (like a Job or ReplicaSet) create a new one. This process is slow and expensive, involving the scheduler, node resource allocation and re-initialization of networking and storage.

This inefficiency becomes even worse when handling large-scale AI/ML workloads (>= 1,000 Nodes with one Pod per Node). A common requirement for these synchronous workloads is that when a failure occurs (such as a Node crash), all Pods in the fleet must be recreated to reset the state before training can resume, even if all the other Pods were not directly affected by the failure. Deleting, creating and scheduling thousands of Pods simultaneously creates a massive bottleneck. The estimated overhead of this failure could cost [$100,000 per month in wasted resources](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.qwqcnzf96avw).

Handling these failures for AI/ML training jobs requires a complex integration touching both the training framework and Kubernetes, which are often fragile and toilsome. This feature introduces a Kubernetes-native solution, improving system robustness and allowing application developers to concentrate on their core training logic.

Another major benefit of restarting Pods in place is that keeping Pods on their assigned Nodes allows for further optimizations. For example, one can implement node-level caching tied to a specific Pod identity, something that is impossible when Pods are unnecessarily being recreated on different Nodes.

## Introducing the `RestartAllContainers` action

To address this, Kubernetes v1.35 adds a new action to the container restart rules: `RestartAllContainers`. When a container exits in a way that matches a rule with this action, the kubelet initiates a fast, **in-place** restart of the Pod.

This in-place restart is highly efficient because it preserves the Pod's most important resources:
- The Pod's UID, IP address and network namespace.
- The Pod's sandbox and any attached devices.
- All volumes, including `emptyDir` and mounted volumes from PVCs.

After terminating all running containers, the Pod's startup sequence is re-executed from the very beginning. This means all **init containers** are run again in order, followed by the sidecar and regular containers, ensuring a completely fresh start in a known-good environment. With the exception of ephemeral containers (which are terminated), all other containers—including those that previously succeeded or failed—will be restarted, regardless of their individual restart policies.

## Use cases

### 1. Efficient restarts for ML/Batch jobs

For ML training jobs, [rescheduling a worker Pod on failure](/blog/2025/07/03/navigating-failures-in-pods-with-devices/#roadmap-for-failure-modes-container-code-failed) is a costly operation that wastes valuable compute resources. On a 1,000-node training cluster, rescheduling overhead can waste [over $100,000 in compute resources monthly](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.qwqcnzf96avw).

With `RestartAllContainers` actions you can address this by enabling a much faster, hybrid recovery strategy: recreate only the "bad" Pods (e.g., those on unhealthy Nodes) while triggering `RestartAllContainers` for the remaining healthy Pods. Benchmarks show this reduces the recovery overhead [from minutes to a few seconds](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.cwkee8kar0i5).

With in-place restarts, a watcher sidecar can monitor the main training process. If it encounters a specific, retriable error, the watcher can exit with a designated code to trigger a fast reset of the worker Pod, allowing it to restart from the last checkpoint without involving the Job controller. This capability is now natively supported by Kubernetes.

Read more details about future development and JobSet features at [KEP-467 JobSet in-place restart](https://github.com/kubernetes-sigs/jobset/issues/467).

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ml-worker-pod
spec:
  restartPolicy: Never
  initContainers:
  # This init container will re-run on every in-place restart
  - name: setup-environment
    image: my-repo/setup-worker:1.0
  - name: watcher-sidecar
    image: my-repo/watcher:1.0
    restartPolicy: Always
    restartPolicyRules:
    - action: RestartAllContainers
      onExit:
        exitCodes:
          operator: In
          # A specific exit code from the watcher triggers a full pod restart
          values: [88]
  containers:
  - name: main-application
    image: my-repo/training-app:1.0
```

### 2. Re-running init containers for a clean state

Imagine a scenario where an init container is responsible for fetching credentials or setting up a shared volume. If the main application fails in a way that corrupts this shared state, you need the [init container to rerun](https://github.com/kubernetes/enhancements/issues/3676).

By configuring the main application to exit with a specific code upon detecting such a corruption, you can trigger the `RestartAllContainers` action, guaranteeing that the init container provides a clean setup before the application restarts.

### 3. Handling high rate of similar tasks execution

There are cases when tasks are best represented as a Pod execution. And each task requires a clean execution. The task may be a game session backend or some queue item processing. If the rate of tasks is high, running the whole cycle of Pod creation, scheduling and initialization is simply too expensive, especially when tasks can be short. The ability to restart all containers from scratch enables a Kubernetes-native way to handle this scenario without custom solutions or frameworks. 

## How to use it

To try this feature, you must enable the `RestartAllContainersOnContainerExits` feature gate on your Kubernetes cluster components (API server and kubelet) running Kubernetes v1.35+. This alpha feature extends the `ContainerRestartRules` feature, which graduated to beta in v1.35 and is enabled by default.

Once enabled, you can add `restartPolicyRules` to any container (init, sidecar, or regular) and use the `RestartAllContainers` action.

The feature is designed to be easily usable on existing apps. However, if an application does not follow some best practices, it may cause issues for the application or for observability tooling. When enabling the feature, make sure that all containers are reentrant and that external tooling is prepared for init containers to re-run. Also, when restarting all containers, the kubelet does not run `preStop` hooks. This means containers must be designed to handle abrupt termination without relying on `preStop` hooks for graceful shutdown. 

## Observing the restart

To make this process observable, a new Pod condition, `AllContainersRestarting`, is added to the Pod's status. When a restart is triggered, this condition becomes `True` and it reverts to `False` once all containers have terminated and the Pod is ready to start its lifecycle anew. This provides a clear signal to users and other cluster components about the Pod's state.

All containers restarted by this action will have their restart count incremented in the container status.

## Learn more

- Read the official documentation on [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers).
- Read the detailed proposal in the [KEP-5532: Restart All Containers on Container Exits](https://kep.k8s.io/5532).
- Read the proposal for JobSet in-place restart in [JobSet issue #467](https://github.com/kubernetes-sigs/jobset/issues/467).

## We want your feedback!

As an alpha feature, `RestartAllContainers` is ready for you to experiment with and any use cases and feedback are welcome. This feature is driven by the [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md) community. If you are interested in getting involved, sharing your thoughts, or contributing, please join us!

You can reach SIG Node through:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
