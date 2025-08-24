---
layout: blog
title: "Kubernetes v1.34: Finer-Grained Control Over Container Restarts"
date: 2025-0X-XX
draft: true
slug: kubernetes-v1-34-per-container-restart-policy
author: >
  [Yuan Wang](https://github.com/yuanwang04)
---

With the release of Kubernetes 1.34, a new alpha feature is introduced
that gives you more granular control over container restarts within a Pod. This
feature, named **Container Restart Policy and Rules**, allows you to specify a
restart policy for each container individually, overriding the Pod's global
restart policy. In addition, it also allows you to conditionally restart
individual containers based on their exit codes. This feature is available
behind the alpha feature gate `ContainerRestartRules`.

This has been a long-requested feature. Let's dive into how it works and how you
can use it.

## The problem with a single restart policy

Before this feature, the `restartPolicy` was set at the Pod level. This meant
that all containers in a Pod shared the same restart policy (`Always`,
`OnFailure`, or `Never`). While this works for many use cases, it can be
limiting in others.

For example, consider a Pod with a main application container and an init
container that performs some initial setup. You might want the main container
to always restart on failure, but the init container should only run once and
never restart. With a single Pod-level restart policy, this wasn't possible.

## Introducing per-container restart policies

With the new `ContainerRestartRules` feature gate, you can now specify a
`restartPolicy` for each container in your Pod's spec. You can also define
`restartPolicyRules` to control restarts based on exit codes. This gives you
the fine-grained control you need to handle complex scenarios.

## Use cases

Let's look at some real-life use cases where per-container restart policies can
be beneficial.

### In-place restarts for training jobs

In ML research, it's common to orchestrate a large number of long-running AI/ML
training workloads. In these scenarios, workload failures are unavoidable. When
a workload fails with a retriable exit code, you want the container to restart
quickly without rescheduling the entire Pod, which consumes a significant amount
of time and resources. Restarting the failed container "in-place" is critical
for better utilization of compute resources. The container should only restart
"in-place" if it failed due to a retriable error; otherwise, the container and
Pod should terminate and possibly be rescheduled.

This can now be achieved with container-level `restartPolicyRules`. The workload
can exit with different codes to represent retriable and non-retriable errors.
With `restartPolicyRules`, the workload can be restarted in-place quickly, but
only when the error is retriable.

### Try-once init containers

Init containers are often used to perform initialization work for the main
container, such as setting up environments and credentials. Sometimes, you want
the main container to always be restarted, but you don't want to retry
initialization if it fails.

With a container-level `restartPolicy`, this is now possible. The init container
can be executed only once, and its failure would be considered a Pod failure. If
the initialization succeeds, the main container can be always restarted.

### Pods with multiple containers

For Pods that run multiple containers, you might have different restart
requirements for each container. Some containers might have a clear definition
of success and should only be restarted on failure. Others might need to be
always restarted.

This is now possible with a container-level `restartPolicy`, allowing individual
containers to have different restart policies.

## How to use it

To use this new feature, you need to enable the `ContainerRestartRules` feature
gate on your Kubernetes cluster control-plane and worker nodes running
Kubernetes 1.34+. Once enabled, you can specify the `restartPolicy` and
`restartPolicyRules` fields in your container definitions.

Here are some examples:

### Example 1: Restarting on specific exit codes

In this example, the container should restart if and only if it fails with a
retriable error, represented by exit code 42.

To achieve this, the container has `restartPolicy: Never`, and a restart
policy rule that tells Kubernetes to restart the container in-place if it exits
with code 42.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: restart-on-exit-codes
  annotations:
    kubernetes.io/description: "This Pod only restart the container only when it exits with code 42."
spec:
  restartPolicy: Never
  containers:
  - name: restart-on-exit-codes
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'sleep 60 && exit 0']
    restartPolicy: Never     # Container restart policy must be specified if rules are specified
    restartPolicyRules:      # Only restart the container if it exits with code 42
    - action: Restart
      exitCodes:
        operator: In
        values: [42]
```

### Example 2: A try-once init container

In this example, a Pod should always be restarted once the initialization succeeds.
However, the initialization should only be tried once.

To achieve this, the Pod has an `Always` restart policy. The `init-once`
init container will only try once. If it fails, the Pod will fail. This allows
the Pod to fail if the initialization failed, but also keep running once the
initialization succeeds.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: fail-pod-if-init-fails
  annotations:
    kubernetes.io/description: "This Pod has an init container that runs only once. After initialization succeeds, the main container will always be restarted."
spec:
  restartPolicy: Always
  initContainers:
  - name: init-once      # This init container will only try once. If it fails, the Pod will fail.
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'echo "Failing initialization" && sleep 10 && exit 1']
    restartPolicy: Never
  containers:
  - name: main-container # This container will always be restarted once initialization succeeds.
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'sleep 1800 && exit 0']
```

### Example 3: Containers with different restart policies

In this example, there are two containers with different restart requirements. One
should always be restarted, while the other should only be restarted on failure.

This is achieved by using a different container-level `restartPolicy` on each of
the two containers.
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: on-failure-pod
  annotations:
    kubernetes.io/description: "This Pod has two containers with different restart policies."
spec:
  containers:
  - name: restart-on-failure
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'echo "Not restarting after success" && sleep 10 && exit 0']
    restartPolicy: OnFailure
  - name: restart-always
    image: docker.io/library/busybox:1.28
    command: ['sh', '-c', 'echo "Always restarting" && sleep 1800 && exit 0']
    restartPolicy: Always
```

## Learn more

- Read the documentation for
  [container restart policy](/docs/concepts/workloads/pod-lifecycle/#container-restart-rules).
- Read the KEP for the
  [Container Restart Rules](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/5307-container-restart-policy)

## Roadmap

More actions and signals to restart Pods and containers are coming! Notably,
there are plans to add support for restarting the entire Pod. Planning and
discussions on these features are in progress. Feel free to share feedback or
requests with the SIG Node community!

## Your feedback is welcome!

This is an alpha feature, and the Kubernetes project would love to hear your feedback.
Please try it out. This feature is driven by the
[SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md).
If you are interested in helping develop this feature, sharing feedback, or
participating in any other ongoing SIG Node projects, please reach out to the
SIG Node community!

You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
