---
layout: blog
title: "Kubernetes 1.27: In-place Resource Resize for Kubernetes Pods (alpha)"
date: 2023-05-12
slug: in-place-pod-resize-alpha
author: >
  Vinay Kulkarni (Kubescaler Labs)
---

If you have deployed Kubernetes pods with CPU and/or memory resources
specified, you may have noticed that changing the resource values involves
restarting the pod. This has been a disruptive operation for running
workloads... until now.

In Kubernetes v1.27, we have added a new alpha feature that allows users
to resize CPU/memory resources allocated to pods without restarting the
containers. To facilitate this, the `resources` field in a pod's containers
now allow mutation for `cpu` and `memory` resources. They can be changed
simply by patching the running pod spec.

This also means that `resources` field in the pod spec can no longer be
relied upon as an indicator of the pod's actual resources. Monitoring tools
and other such applications must now look at new fields in the pod's status.
Kubernetes queries the actual CPU and memory requests and limits enforced on
the running containers via a CRI (Container Runtime Interface) API call to the
runtime, such as containerd, which is responsible for running the containers.
The response from container runtime is reflected in the pod's status.

In addition, a new `restartPolicy` for resize has been added. It gives users
control over how their containers are handled when resources are resized.


## What's new in v1.27?

Besides the addition of resize policy in the pod's spec, a new field named
`allocatedResources` has been added to `containerStatuses` in the pod's status.
This field reflects the node resources allocated to the pod's containers.

In addition, a new field called `resources` has been added to the container's
status. This field reflects the actual resource requests and limits configured
on the running containers as reported by the container runtime.

Lastly, a new field named `resize` has been added to the pod's status to show the
status of the last requested resize. A value of `Proposed` is an acknowledgement
of the requested resize and indicates that request was validated and recorded. A
value of `InProgress` indicates that the node has accepted the resize request
and is in the process of applying the resize request to the pod's containers.
A value of `Deferred` means that the requested resize cannot be granted at this
time, and the node will keep retrying. The resize may be granted when other pods
leave and free up node resources. A value of `Infeasible` is a signal that the
node cannot accommodate the requested resize. This can happen if the requested
resize exceeds the maximum resources the node can ever allocate for a pod.


## When to use this feature

Here are a few examples where this feature may be useful:
- Pod is running on node but with either too much or too little resources.
- Pods are not being scheduled due to lack of sufficient CPU or memory in a
cluster that is underutilized by running pods that were overprovisioned.
- Evicting certain stateful pods that need more resources to schedule them
on bigger nodes is an expensive or disruptive operation when other lower
priority pods in the node can be resized down or moved.


## How to use this feature

In order to use this feature in v1.27, the `InPlacePodVerticalScaling`
feature gate must be enabled. A local cluster with this feature enabled
can be started as shown below:

```
root@vbuild:~/go/src/k8s.io/kubernetes# FEATURE_GATES=InPlacePodVerticalScaling=true ./hack/local-up-cluster.sh
go version go1.20.2 linux/arm64
+++ [0320 13:52:02] Building go targets for linux/arm64
    k8s.io/kubernetes/cmd/kubectl (static)
    k8s.io/kubernetes/cmd/kube-apiserver (static)
    k8s.io/kubernetes/cmd/kube-controller-manager (static)
    k8s.io/kubernetes/cmd/cloud-controller-manager (non-static)
    k8s.io/kubernetes/cmd/kubelet (non-static)
...
...
Logs:
  /tmp/etcd.log
  /tmp/kube-apiserver.log
  /tmp/kube-controller-manager.log

  /tmp/kube-proxy.log
  /tmp/kube-scheduler.log
  /tmp/kubelet.log

To start using your cluster, you can open up another terminal/tab and run:

  export KUBECONFIG=/var/run/kubernetes/admin.kubeconfig
  cluster/kubectl.sh

Alternatively, you can write to the default kubeconfig:

  export KUBERNETES_PROVIDER=local

  cluster/kubectl.sh config set-cluster local --server=https://localhost:6443 --certificate-authority=/var/run/kubernetes/server-ca.crt
  cluster/kubectl.sh config set-credentials myself --client-key=/var/run/kubernetes/client-admin.key --client-certificate=/var/run/kubernetes/client-admin.crt
  cluster/kubectl.sh config set-context local --cluster=local --user=myself
  cluster/kubectl.sh config use-context local
  cluster/kubectl.sh

```

Once the local cluster is up and running, Kubernetes users can schedule pods
with resources, and resize the pods via kubectl. An example of how to use this
feature is illustrated in the following demo video.

{{< youtube id="1m2FOuB6Bh0" title="In-place resize of pod CPU and memory resources">}}


## Example Use Cases

### Cloud-based Development Environment

In this scenario, developers or development teams write their code locally
but build and test their code in Kubernetes pods with consistent configs
that reflect production use. Such pods need minimal resources when the
developers are writing code, but need significantly more CPU and memory
when they build their code or run a battery of tests. This use case can
leverage in-place pod resize feature (with a little help from eBPF) to
quickly resize the pod's resources and avoid kernel OOM (out of memory)
killer from terminating their processes.

This [KubeCon North America 2022 conference talk](https://www.youtube.com/watch?v=jjfa1cVJLwc)
illustrates the use case.

### Java processes initialization CPU requirements

Some Java applications may need significantly more CPU during initialization
than what is needed during normal process operation time. If such applications
specify CPU requests and limits suited for normal operation, they may suffer
from very long startup times. Such pods can request higher CPU values at the
time of pod creation, and can be resized down to normal running needs once the
application has finished initializing.


## Known Issues

This feature enters v1.27 at [alpha stage](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
Below are a few known issues users may encounter:
- containerd versions below v1.6.9 do not have the CRI support needed for full
  end-to-end operation of this feature. Attempts to resize pods will appear
  to be _stuck_ in the `InProgress` state, and `resources` field in the pod's
  status are never updated even though the new resources may have been enacted
  on the running containers.
- Pod resize may encounter a race condition with other pod updates, causing
  delayed enactment of pod resize.
- Reflecting the resized container resources in pod's status may take a while.
- Static CPU management policy is not supported with this feature.


## Credits

This feature is a result of the efforts of a very collaborative Kubernetes community.
Here's a little shoutout to just a few of the many many people that contributed
countless hours of their time and helped make this happen.
- [@thockin](https://github.com/thockin) for detail-oriented API design and air-tight code reviews.
- [@derekwaynecarr](https://github.com/derekwaynecarr) for simplifying the design and thorough API and node reviews.
- [@dchen1107](https://github.com/dchen1107) for bringing vast knowledge from Borg and helping us avoid pitfalls.
- [@ruiwen-zhao](https://github.com/ruiwen-zhao) for adding containerd support that enabled full E2E implementation.
- [@wangchen615](https://github.com/wangchen615) for implementing comprehensive E2E tests and driving scheduler fixes.
- [@bobbypage](https://github.com/bobbypage) for invaluable help getting CI ready and quickly investigating issues, covering for me on my vacation.
- [@Random-Liu](https://github.com/Random-Liu) for thorough kubelet reviews and identifying problematic race conditions.
- [@Huang-Wei](https://github.com/Huang-Wei), [@ahg-g](https://github.com/ahg-g), [@alculquicondor](https://github.com/alculquicondor) for helping get scheduler changes done.
- [@mikebrow](https://github.com/mikebrow) [@marosset](https://github.com/marosset) for reviews on short notice that helped CRI changes make it into v1.25.
- [@endocrimes](https://github.com/endocrimes), [@ehashman](https://github.com/ehashman) for helping ensure that the oft-overlooked tests are in good shape.
- [@mrunalp](https://github.com/mrunalp) for reviewing cgroupv2 changes and ensuring clean handling of v1 vs v2.
- [@liggitt](https://github.com/liggitt), [@gjkim42](https://github.com/gjkim42) for tracking down, root-causing important missed issues post-merge.
- [@SergeyKanzhelev](https://github.com/SergeyKanzhelev) for supporting and shepherding various issues during the home stretch.
- [@pdgetrf](https://github.com/pdgetrf) for making the first prototype a reality.
- [@dashpole](https://github.com/dashpole) for bringing me up to speed on 'the Kubernetes way' of doing things.
- [@bsalamat](https://github.com/bsalamat), [@kgolab](https://github.com/kgolab) for very thoughtful insights and suggestions in the early stages.
- [@sftim](https://github.com/sftim), [@tengqm](https://github.com/tengqm) for ensuring docs are easy to follow.
- [@dims](https://github.com/dims) for being omnipresent and helping make merges happen at critical hours.
- Release teams for ensuring that the project stayed healthy.

And a big thanks to my very supportive management [Dr. Xiaoning Ding](https://www.linkedin.com/in/xiaoningding/)
and [Dr. Ying Xiong](https://www.linkedin.com/in/ying-xiong-59a2482/) for their patience and encouragement.


## References

### For app developers

* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
