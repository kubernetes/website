---
layout: blog
title: "Kubernetes v1.38: Writable cgroups for Unprivileged Containers (Alpha)"
draft: true
slug: kubernetes-v1-38-writable-cgroups-alpha
author: >
  [Chris Henzie](https://github.com/chrishenzie) (Google),
  [Divya Rani](https://github.com/Divya063) (GitLab)
---

Kubernetes v1.38 introduces a new `cgroupOptions` field in a container's [`securityContext`](/docs/tasks/configure-pod-container/security-context/).
With this alpha feature, Kubernetes allows you to run a container that creates and manages its own cgroups, without privileged mode.

## What are cgroups?

A control group, or [cgroup](/docs/concepts/architecture/cgroups/), is a group of processes that the Linux kernel manages together.
The kernel uses cgroups to limit the resources those processes use, such as CPU and memory, so that no one workload can use up a whole machine.
Cgroups also nest, so a group can be split into smaller groups with limits of their own.

On cgroup v2, the kernel exposes cgroups as directories in the cgroup filesystem, mounted at `/sys/fs/cgroup`.
Creating a directory there creates a cgroup, and writing to a file such as `memory.max` sets a limit.

In the world of Kubernetes, the kubelet and the container runtime use cgroups to enforce the resource requests and limits in a Pod spec.
The kubelet creates a cgroup for each Pod, and the container runtime creates a cgroup for each container in the Pod.

```yaml
resources:
  limits:
    memory: 128Mi # Written to memory.max in the container's cgroup.
```

If your container has ever been `OOMKilled` for going over that limit, you've seen cgroups at work.

## Why would a container need to create its own cgroups?

A container creates its own cgroups to divide its resources among the processes it runs.
For example:

- Container engines that run inside a container, such as Docker-in-Docker for CI and development, create a cgroup for each container they start.
- Gitaly, GitLab's Git storage service, runs Git processes in cgroups to give each repository its own CPU and memory limits.
- Ray, a framework for distributed AI and machine learning workloads, runs its own system processes beside user code in the same container.
  It can reserve part of the container's CPU and memory for those processes, so that user code can't starve them
  ([Ray documentation](https://docs.ray.io/en/latest/ray-core/resource-isolation-with-cgroupv2.html)).

## How did containers get writable cgroups before v1.38?

The container runtime mounts the cgroup filesystem at `/sys/fs/cgroup` inside each container.
In an unprivileged container, the mount defaults to read-only.
Before v1.38, a container that needed to write to it had two options:

- Setting `privileged: true`, which turns off most of the container's isolation from the host.
- Using container runtime-specific settings, which some container runtimes support through their configuration, runtime-specific Pod annotations, or [Node Resource Interface (NRI)](https://github.com/containerd/nri) plugins.
  These depend on how the node's runtime is set up, which you often can't change on a managed Kubernetes service.

## What is this new field and how does it work?

Kubernetes v1.38 adds a third option.
If you set `cgroupOptions.mountMode` to `ReadWrite` in a container's `securityContext`, the container runtime mounts the cgroup filesystem read-write for that container.
You don't need to set `privileged: true` or use container runtime-specific settings.

A container with writable cgroups can create cgroups below its own cgroup and set limits on each of them.
It can't change the limits on its own cgroup, so every cgroup it creates stays inside the resources that Kubernetes gave the container.

The kernel enforces this boundary with the [`nsdelegate`](https://docs.kernel.org/admin-guide/cgroup-v2.html#model-of-delegation) mount option.
Container runtimes give each unprivileged container its own cgroup namespace, so the container sees its own cgroup as the root of `/sys/fs/cgroup`.
With `nsdelegate`, a process can't change the limits on the root of its cgroup namespace.

### How many cgroups can a Pod create?

If any container in a Pod sets `mountMode: ReadWrite`, the kubelet limits the Pod to 250 cgroups at a time, including the cgroups of the Pod's containers.
Those cgroups can nest at most 50 levels deep inside the Pod's cgroup.
These limits keep the number of live cgroups that each Pod adds to the node bounded.
Once the Pod reaches 250 cgroups, creating another one fails with `EAGAIN` (`Resource temporarily unavailable`) until a container removes one.
The kubelet sets these limits through `cgroup.max.descendants` and `cgroup.max.depth` on the Pod's cgroup.
Both default to `max`, which means no limit.

### Why use this instead of container runtime-specific settings?

`cgroupOptions` has three advantages over container runtime-specific settings:

- The request is in the Pod spec, where Pod Security Standards and your admission policies can see it.
  Pod Security Standards don't check container runtime-specific settings.
- You only set the field on the containers that need it.
  A setting in the runtime's configuration turns on writable cgroups for every container that uses that runtime, whether it needs them or not.
- The kubelet [limits the number and depth of cgroups](#how-many-cgroups-can-a-pod-create) in every Pod that requests `ReadWrite`.
  A Pod that gets writable cgroups from a container runtime-specific setting gets no such limits.

## How do I use it?

`cgroupOptions` is alpha in Kubernetes v1.38, so as a first step you need to enable the `CgroupOptions` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for `kube-apiserver` and the kubelet.
For `kube-apiserver`, set the command line argument:

```
--feature-gates="...,CgroupOptions=true"
```

For the kubelet, set the feature gate in its [configuration file](/docs/tasks/administer-cluster/kubelet-config-file/):

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  CgroupOptions: true
```

You also need Linux nodes with:

- [cgroup v2](/docs/concepts/architecture/cgroups/), mounted at `/sys/fs/cgroup` with the `nsdelegate` option.
  To check, run `findmnt /sys/fs/cgroup` on the node and look for `nsdelegate` in the options.
- A container runtime that supports `cgroupOptions`: containerd v2.5 or later, or CRI-O v1.38 or later.

### Creating a Pod with writable cgroups

To give a container writable cgroups, set `mountMode` to `ReadWrite` in its `securityContext`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: writable-cgroups-demo
spec:
  containers:
    - name: app
      image: registry.k8s.io/e2e-test-images/agnhost:2.45
      command: ["sh", "-c", "sleep 1h"]
      securityContext:
        cgroupOptions:
          mountMode: ReadWrite # Mount /sys/fs/cgroup read-write for this container.
```

Kubernetes only schedules this Pod onto nodes that meet the requirements above.
Those nodes list `CgroupOptions` in their `.status.declaredFeatures`, so you can check which ones qualify.
If none do, the Pod stays `Pending`.

You can also set `mountMode` to `ReadOnly` to get a read-only cgroup filesystem, even if the node's runtime is set up to mount it read-write.
Like `ReadWrite`, it only schedules onto nodes that list `CgroupOptions`.
If you leave `mountMode` out, the runtime does what it normally does.

You can check that the cgroup filesystem is writable by creating a cgroup inside the container and removing it:

```shell
kubectl exec writable-cgroups-demo -- mkdir /sys/fs/cgroup/demo
kubectl exec writable-cgroups-demo -- rmdir /sys/fs/cgroup/demo
```

If the mount is writable, both commands succeed without printing anything.
In a container with a read-only mount, `mkdir` fails:

```
mkdir: can't create directory '/sys/fs/cgroup/demo': Read-only file system
command terminated with exit code 1
```

#### Setting limits on the cgroups you create

Before you can set limits like `memory.max` on the cgroups you create, you need to turn on the `memory` controller for them.
The kernel only lets you do that once the parent cgroup has no processes of its own, a rule called the [no internal process constraint](https://docs.kernel.org/admin-guide/cgroup-v2.html#no-internal-process-constraint).
So first move the container's processes into a child cgroup, then turn on the controller:

```shell
kubectl exec writable-cgroups-demo -- sh -c '
  mkdir /sys/fs/cgroup/init
  for pid in $(cat /sys/fs/cgroup/cgroup.procs); do
    echo $pid > /sys/fs/cgroup/init/cgroup.procs 2>/dev/null
  done
  echo +memory > /sys/fs/cgroup/cgroup.subtree_control'
```

After that, you can create a cgroup and give it a memory limit:

```shell
kubectl exec writable-cgroups-demo -- sh -c '
  mkdir /sys/fs/cgroup/workers
  echo 64M > /sys/fs/cgroup/workers/memory.max
  cat /sys/fs/cgroup/workers/memory.max'
```

```
67108864
```

## As a cluster administrator, how do I control who can use this?

[Pod Security Standards](/docs/concepts/security/pod-security-standards/) know about the new field.
If a namespace enforces the [Restricted](/docs/concepts/security/pod-security-standards/#restricted) standard, the API server rejects any Pod that sets `mountMode: ReadWrite`.
The Baseline and Privileged standards allow it.
If you want to limit who can use the field in a Baseline namespace, you can write your own admission policy, such as a [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).

## What's next?

For beta, we plan to:

- Turn on the `CgroupOptions` feature gate by default.
- Revisit the [limits on the number and depth of cgroups in a Pod](#how-many-cgroups-can-a-pod-create), based on what we hear from alpha users.
- Look at letting cluster administrators set those limits per node in the kubelet configuration.

If you run workloads that create their own cgroups, try the alpha and tell us in [#sig-node-writable-cgroups](https://kubernetes.slack.com/messages/sig-node-writable-cgroups) whether the limits work for you.
If you find a bug, open an issue in [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues).

## How can I learn more?

For setup details, including node requirements and the rules for which Pods can set the field, see [Configure cgroup options for a Container](/docs/tasks/configure-pod-container/security-context/#cgroupoptions).
For more on the design and the motivation behind it, see [KEP-5474: Enable Writable Cgroups](https://www.kubernetes.dev/resources/keps/5474/).

## How do I get involved?

SIG Node leads this work, and SIG Auth helped with the Pod Security Standards changes.
To talk about your use cases and what you need from this feature, join [#sig-node-writable-cgroups](https://kubernetes.slack.com/messages/sig-node-writable-cgroups) on Kubernetes Slack.
The [#sig-node](https://kubernetes.slack.com/messages/sig-node) channel and the [SIG Node mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node) are also great mediums to reach out to SIG Node.

Special thanks to the following people for their insightful reviews and design considerations:

- Akihiro Suda ([AkihiroSuda](https://github.com/AkihiroSuda))
- Bryce Palmer ([everettraven](https://github.com/everettraven))
- Dawn Chen ([dchen1107](https://github.com/dchen1107))
- Francesco Romani ([ffromani](https://github.com/ffromani))
- Ilya Talkachou ([talkachou-ilya](https://github.com/talkachou-ilya))
- Itamar Holder ([iholder101](https://github.com/iholder101))
- Kevin Hannon ([kannon92](https://github.com/kannon92))
- Niklas Beierl ([NiklasBeierl](https://github.com/NiklasBeierl))
- Peter Engelbert ([pmengelbert](https://github.com/pmengelbert))
- Peter Hunt ([haircommander](https://github.com/haircommander))
- Rodrigo Campos Catelin ([rata](https://github.com/rata))
- Sergey Kanzhelev ([SergeyKanzhelev](https://github.com/SergeyKanzhelev))

If you're interested in getting involved with the design and development of node features like this one, join the [Kubernetes Node Special Interest Group](https://www.kubernetes.dev/community/community-groups/sigs/node/) (SIG).
We're rapidly growing and always welcome new contributors.
