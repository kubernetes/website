---
layout: blog
title: "Kubernetes 1.27: updates on speeding up Pod startup"
date: 2023-05-15T00:00:00+0000
slug: speed-up-pod-startup
author: >
   Paco Xu (DaoCloud),
   Sergey Kanzhelev (Google),
   Ruiwen Zhao (Google)
---

How can Pod start-up be accelerated on nodes in large clusters? This is a common issue that
cluster administrators may face.

This blog post focuses on methods to speed up pod start-up from the kubelet side. It does not
involve the creation time of pods by controller-manager through kube-apiserver, nor does it
include scheduling time for pods or webhooks executed on it.

We have mentioned some important factors here to consider from the kubelet's perspective, but
this is not an exhaustive list. As Kubernetes v1.27 is released, this blog highlights
significant changes in v1.27 that aid in speeding up pod start-up.

## Parallel container image pulls

Pulling images always takes some time and what's worse is that image pulls are done serially by
default. In other words, kubelet will send only one image pull request to the image service at
a time. Other image pull requests have to wait until the one being processed is complete.

To enable parallel image pulls, set the `serializeImagePulls` field to false in the kubelet
configuration. When `serializeImagePulls` is disabled, requests for image pulls are immediately
sent to the image service and multiple images can be pulled concurrently.

### Maximum parallel image pulls will help secure your node from overloading on image pulling

We introduced a new feature in kubelet that sets a limit on the number of parallel image
pulls at the node level. This limit restricts the maximum number of images that can be pulled
simultaneously. If there is an image pull request beyond this limit, it will be blocked until
one of the ongoing image pulls finishes. Before enabling this feature, please ensure that your
container runtime's image service can handle parallel image pulls effectively.

To limit the number of simultaneous image pulls, you can configure the `maxParallelImagePulls`
field in kubelet. By setting `maxParallelImagePulls` to a value of _n_, only _n_ images will
be pulled concurrently. Any additional image pulls beyond this limit will wait until at least
one ongoing pull is complete.

You can find more details in the associated KEP: [Kubelet limit of Parallel Image Pulls](https://kep.k8s.io/3673)
 (KEP-3673).

## Raised default API query-per-second limits for kubelet

To improve pod startup in scenarios with multiple pods on a node, particularly sudden scaling
situations, it is necessary for Kubelet to synchronize the pod status and prepare configmaps,
secrets, or volumes. This requires a large bandwidth to access kube-apiserver.

In versions prior to v1.27, the default `kubeAPIQPS` was 5 and `kubeAPIBurst` was 10. However,
the kubelet in v1.27 has increased these defaults to 50 and 100 respectively for better performance during
pod startup. It's worth noting that this isn't the only reason why we've bumped up the API QPS
limits for Kubelet.

1. It has a potential to be hugely throttled now (default QPS = 5)
2. In large clusters they can generate significant load anyway as there are a lot of them
3. They have a dedicated PriorityLevel and FlowSchema that we can easily control

Previously, we often encountered `volume mount timeout` on kubelet in node with more than 50 pods
during pod start up. We suggest that cluster operators bump `kubeAPIQPS` to 20 and `kubeAPIBurst` to 40,
 especially if using bare metal nodes.

More detials can be found in the KEP <https://kep.k8s.io/1040> and the pull request [#116121](https://github.com/kubernetes/kubernetes/pull/116121).

## Event triggered updates to container status

`Evented PLEG` (PLEG is short for "Pod Lifecycle Event Generator") is set to be in beta for v1.27,
Kubernetes offers two ways for the kubelet to detect Pod lifecycle events, such as the last
process in a container shutting down.
In Kubernetes v1.27, the _event based_ mechanism has graduated to beta but remains
disabled by default. If you do explicitly switch to event-based lifecycle change detection,
the kubelet is able to start Pods more quickly than with the default approach that relies on polling.
The default mechanism, polling for lifecycle changes, adds a noticeable overhead; this affects
the kubelet's ability to handle different tasks in parallel, and leads to poor performance and
reliability issues. For these reasons, we recommend that you switch your nodes to use
event-based pod lifecycle change detection.

Further details can be found in the KEP <https://kep.k8s.io/3386> and
[Switching From Polling to CRI Event-based Updates to Container Status](/docs/tasks/administer-cluster/switch-to-evented-pleg/).

## Raise your pod resource limit if needed

During start-up, some pods may consume a considerable amount of CPU or memory. If the CPU limit is
low, this can significantly slow down the pod start-up process. To improve the memory management,
Kubernetes v1.22 introduced a feature gate called MemoryQoS to kubelet. This feature enables
kubelet to set memory QoS at container, pod, and QoS levels for better protection and guaranteed
quality of memory when running with cgroups v2. Although it has benefits, it is possible that
enabling this feature gate may affect the start-up speed of the pod if the pod startup consumes
a large amount of memory.

Kubelet configuration now includes `memoryThrottlingFactor`. This factor is multiplied by
the memory limit or node allocatable memory to set the cgroupv2 `memory.high` value for enforcing
MemoryQoS. Decreasing this factor sets a lower high limit for container cgroups, increasing reclaim
pressure. Increasing this factor will put less reclaim pressure. The default value is 0.8 initially
and will change to 0.9 in Kubernetes v1.27. This parameter adjustment can reduce the potential
impact of this feature on pod startup speed.

Further details can be found in the KEP <https://kep.k8s.io/2570>.

## What's more?

In Kubernetes v1.26, a new histogram metric `pod_start_sli_duration_seconds` was added for Pod
startup latency SLI/SLO details. Additionally, the kubelet log will now display more information
about pod start-related timestamps, as shown below:

> Dec 30 15:33:13.375379 e2e-022435249c-674b9-minion-group-gdj4 kubelet[8362]: I1230 15:33:13.375359    8362 pod_startup_latency_tracker.go:102] "Observed pod startup duration" pod="kube-system/konnectivity-agent-gnc9k" podStartSLOduration=-9.223372029479458e+09 pod.CreationTimestamp="2022-12-30 15:33:06 +0000 UTC" firstStartedPulling="2022-12-30 15:33:09.258791695 +0000 UTC m=+13.029631711" lastFinishedPulling="0001-01-01 00:00:00 +0000 UTC" observedRunningTime="2022-12-30 15:33:13.375009262 +0000 UTC m=+17.145849275" watchObservedRunningTime="2022-12-30 15:33:13.375317944 +0000 UTC m=+17.146157970"

The SELinux Relabeling with Mount Options feature moved to Beta in v1.27. This feature speeds up
container startup by mounting volumes with the correct SELinux label instead of changing each file
on the volumes recursively. Further details can be found in the KEP <https://kep.k8s.io/1710>.

To identify the cause of slow pod startup, analyzing metrics and logs can be helpful. Other
factors that may impact pod startup include container runtime, disk speed, CPU and memory
resources on the node.

SIG Node is responsible for ensuring fast Pod startup times, while addressing issues in large
clusters falls under the purview of SIG Scalability as well.
