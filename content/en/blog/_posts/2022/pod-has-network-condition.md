---
layout: blog
title: 'Kubernetes 1.25: PodHasNetwork Condition for Pods'
date: 2022-09-14
slug: pod-has-network-condition
author: >
  Deep Debroy (Apple)
---

Kubernetes 1.25 introduces Alpha support for a new kubelet-managed pod condition
in the status field of a pod: `PodHasNetwork`. The kubelet, for a worker node,
will use the `PodHasNetwork` condition to accurately surface the initialization
state of a pod from the perspective of pod sandbox creation and network
configuration by a container runtime (typically in coordination with CNI
plugins). The kubelet starts to pull container images and start individual
containers (including init containers) after the status of the `PodHasNetwork`
condition is set to `"True"`. Metrics collection services that report latency of
pod initialization from a cluster infrastructural perspective (i.e. agnostic of
per container characteristics like image size or payload) can utilize the
`PodHasNetwork` condition to accurately generate Service Level Indicators
(SLIs). Certain operators or controllers that manage underlying pods may utilize
the `PodHasNetwork` condition to optimize the set of actions performed when pods
repeatedly fail to come up.

### Updates for Kubernetes 1.28

The `PodHasNetwork` condition has been renamed to `PodReadyToStartContainers`.
Alongside that change, the feature gate `PodHasNetworkCondition` has been replaced by
`PodReadyToStartContainersCondition`. You need to set `PodReadyToStartContainersCondition`
to true in order to use the new feature in v1.28.0 and later.

### How is this different from the existing Initialized condition reported for pods?

The kubelet sets the status of the existing `Initialized` condition reported in
the status field of a pod depending on the presence of init containers in a pod.

If a pod specifies init containers, the status of the `Initialized` condition in
the pod status will not be set to `"True"` until all init containers for the pod
have succeeded. However, init containers, configured by users, may have errors
(payload crashing, invalid image, etc) and the number of init containers
configured in a pod may vary across different workloads. Therefore,
cluster-wide, infrastructural SLIs around pod initialization cannot depend on
the `Initialized` condition of pods.

If a pod does not specify init containers, the status of the `Initialized`
condition in the pod status is set to `"True"` very early in the lifecycle of
the pod. This occurs before the kubelet initiates any pod runtime sandbox
creation and network configuration steps. As a result, a pod without init
containers will report the status of the `Initialized` condition as `"True"`
even if the container runtime is not able to successfully initialize the pod
sandbox environment.

Relative to either situation above, the `PodHasNetwork` condition surfaces more
accurate data around when the pod runtime sandbox was initialized with
networking configured so that the kubelet can proceed to launch user-configured
containers (including init containers) in the pod.

### Special Cases

If a pod specifies `hostNetwork` as `"True"`, the `PodHasNetwork` condition is
set to `"True"` based on successful creation of the pod sandbox while the
network configuration state of the pod sandbox is ignored. This is because the
CRI implementation typically skips any pod sandbox network configuration when
`hostNetwork` is set to `"True"` for a pod.

A node agent may dynamically re-configure network interface(s) for a pod by
watching changes in pod annotations that specify additional networking
configuration (e.g. `k8s.v1.cni.cncf.io/networks`). Dynamic updates of pod
networking configuration after the pod sandbox is initialized by Kubelet (in
coordination with a container runtime) are not reflected by the `PodHasNetwork`
condition.

### Try out the PodHasNetwork condition for pods

In order to have the kubelet report the `PodHasNetwork` condition in the status
field of a pod, please enable the `PodHasNetworkCondition` feature gate on the
kubelet.

For a pod whose runtime sandbox has been successfully created and has networking
configured, the kubelet will report the `PodHasNetwork` condition with status set to `"True"`:

```
$ kubectl describe pod nginx1
Name:             nginx1
Namespace:        default
...
Conditions:
  Type              Status
  PodHasNetwork     True
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
```

For a pod whose runtime sandbox has not been created yet (and networking not
configured either), the kubelet will report the `PodHasNetwork` condition with
status set to `"False"`:

```
$ kubectl describe pod nginx2
Name:             nginx2
Namespace:        default
...
Conditions:
  Type              Status
  PodHasNetwork     False
  Initialized       True
  Ready             False
  ContainersReady   False
  PodScheduled      True
```

### What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the
reporting of the `PodHasNetwork` condition to Beta in 1.26 or 1.27.

### How can I learn more?

Please check out the
[documentation](/docs/concepts/workloads/pods/pod-lifecycle/) for the
`PodHasNetwork` condition to learn more about it and how it fits in relation to
other pod conditions.

### How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!

### Acknowledgements

We want to thank the following people for their insightful and helpful reviews
of the KEP and PRs around this feature: Derek Carr (@derekwaynecarr), Mrunal
Patel (@mrunalp), Dawn Chen (@dchen1107), Qiutong Song (@qiutongs), Ruiwen Zhao
(@ruiwen-zhao), Tim Bannister (@sftim), Danielle Lancashire (@endocrimes) and
Agam Dua (@agamdua).
