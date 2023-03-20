---
layout: blog
title: "How to speed up pod startup from kubelet side? "
date: 2023-04-02T16:00:00+0000
slug: speed-up-pod-startup
---

**Author**: Paco Xu(DaoCloud), Sergey Kanzhelev, Ruiwen Zhao(Google)

How can pod start-up time be accelerated on nodes in large clusters? This is a common issue that cluster administrators may face.

This blog post focuses on methods to speed up pod start-up from the kubelet side. It does not involve the creation time of pods by controller-manager through kube-apiserver, nor does it include scheduling time for pods.

We have mentioned some important factors here to consider from the kubelet's perspective, but this is not an exhaustive list. As Kubernetes v1.27 is set to release soon, this blog will highlight significant changes in v1.27 that aid in speeding up pod start-up.

## Parallel Image Pulls

Pulling images always takes some time and what's worse is that image pulls are done serially by default. In other words, kubelet will send only one image pull request to the image service at a time. Other image pull requests have to wait until the one being processed is complete.

To enable parallel image pulls, set the `serializeImagePulls` field to false in the kubelet configuration. When `serializeImagePulls` is disabled, requests for image pulls are immediately sent to the image service and multiple images can be pulled concurrently.

### Maximum parallel image pulls will help secure your node from overloading on image pulling

We are introducing a new feature in kubelet that sets a limit on the number of parallel image pulls at the node level. This limit restricts the maximum number of images that can be pulled simultaneously. If there is an image pull request beyond this limit, it will be blocked until one of the ongoing image pulls finishes. Before enabling this feature, please ensure that your container runtime's image service can handle parallel image pulls effectively.

To limit the number of simultaneous image pulls, you can configure the `maxParallelImagePulls` field in kubelet. By setting `maxParallelImagePulls` to a value of _n_, only _n_ images will be pulled concurrently. Any additional image pulls beyond this limit will wait until at least one ongoing pull is complete.

More detials can be found in the KEP <https://kep.k8s.io/3673>.

## bump default API QPS limits for Kubelet

To improve pod startup in scenarios with multiple pods on a node, particularly sudden scaling situations, it is necessary for Kubelet to synchronize the pod status and prepare configmaps, secrets or volumes. This requires a large bandwidth to access kube-apiserver.

In versions prior to v1.27, the default `kubeAPIQPS` was 5 and `kubeAPIBurst` was 10. However, Kubelet has increased these defaults to 50 and 100 respectively for better performance during pod startup. It's worth noting that this isn't the only reason why we've bumped up the API QPS limits for Kubelet.

1. It has a potential to be hugely throttled now (default QPS = 5)
2. In large clusters they can generate significant load anyway as there are a lot of them
3. They have a dedicated PriorityLevel and FlowSchema that we can easily control

In old days, we always encounter `volume mount timeout` on kubelet in node with more than 50 pods during pod start up. We suggest our customers to bump 3 or 4 times of kube api QPS and especially with customers that is using bare-metal(physical machines).

More detials can be found in the KEP <https://kep.k8s.io/1040> and <https://github.com/kubernetes/kubernetes/pull/116121>.

## Evented PLEG will enhance the scalability of kubelet

`Evented PLEG` is set to be in beta for v1.27, enabled by default. It aids pod startup in large clusters by reducing unnecessary work during inactivity through replacing periodic polling. The current `Generic PLEG` incurs non-negligible overhead due to frequent container status polling, which worsens with Kubelet's parallelism, leading to poor performance and reliability issues. For these reasons, it is recommended that we use Evented PLGE instead. Further details can be found in the KEP <https://kep.k8s.io/3386>.

## What's more?

In Kubernetes v1.26, a new histogram metric `pod_start_sli_duration_seconds` was added for Pod startup latency SLI/SLO details. Additionally, the kubelet log will now display more information about pod start-related timestamps, as shown below:

> Dec 30 15:33:13.375379 e2e-022435249c-674b9-minion-group-gdj4 kubelet[8362]: I1230 15:33:13.375359    8362 pod_startup_latency_tracker.go:102] "Observed pod startup duration" pod="kube-system/konnectivity-agent-gnc9k" podStartSLOduration=-9.223372029479458e+09 pod.CreationTimestamp="2022-12-30 15:33:06 +0000 UTC" firstStartedPulling="2022-12-30 15:33:09.258791695 +0000 UTC m=+13.029631711" lastFinishedPulling="0001-01-01 00:00:00 +0000 UTC" observedRunningTime="2022-12-30 15:33:13.375009262 +0000 UTC m=+17.145849275" watchObservedRunningTime="2022-12-30 15:33:13.375317944 +0000 UTC m=+17.146157970"

To identify the cause of slow pod startup, analyzing metrics and logs can be helpful. Other factors that may impact pod startup include container runtime, disk speed, CPU and memory resources on the node.

SIG Node is responsible for ensuring fast Pod startup times, while addressing issues in large clusters falls under the purview of SIG Scalability as well.
