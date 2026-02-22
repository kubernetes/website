---
layout: blog
title: "Kubernetes 1.28: Non-Graceful Node Shutdown Moves to GA"
date: 2023-08-16T10:00:00-08:00
slug: kubernetes-1-28-non-graceful-node-shutdown-GA
author: >
  Xing Yang (VMware),
  Ashutosh Kumar (Elastic)
---

The Kubernetes Non-Graceful Node Shutdown feature is now GA in Kubernetes v1.28.
It was introduced as
[alpha](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown)
in Kubernetes v1.24, and promoted to
[beta](https://kubernetes.io/blog/2022/12/16/kubernetes-1-26-non-graceful-node-shutdown-beta/)
in Kubernetes v1.26.
This feature allows stateful workloads to restart on a different node if the
original node is shutdown unexpectedly or ends up in a non-recoverable state
such as the hardware failure or unresponsive OS.

## What is a Non-Graceful Node Shutdown

In a Kubernetes cluster, a node can be shutdown in a planned graceful way or
unexpectedly because of reasons such as power outage or something else external.
A node shutdown could lead to workload failure if the node is not drained
before the shutdown. A node shutdown can be either graceful or non-graceful.

The [Graceful Node Shutdown](https://kubernetes.io/blog/2021/04/21/graceful-node-shutdown-beta/)
feature allows Kubelet to detect a node shutdown event, properly terminate the pods,
and release resources, before the actual shutdown.

When a node is shutdown but not detected by Kubelet's Node Shutdown Manager,
this becomes a non-graceful node shutdown.
Non-graceful node shutdown is usually not a problem for stateless apps, however,
it is a problem for stateful apps.
The stateful application cannot function properly if the pods are stuck on the
shutdown node and are not restarting on a running node.

In the case of a non-graceful node shutdown, you can manually add an `out-of-service` taint on the Node.

```
kubectl taint nodes <node-name> node.kubernetes.io/out-of-service=nodeshutdown:NoExecute
```

This taint triggers pods on the node to be forcefully deleted if there are no
matching tolerations on the pods. Persistent volumes attached to the shutdown node
will be detached, and new pods will be created successfully on a different running
node.

**Note:** Before applying the out-of-service taint, you must verify that a node is
already in shutdown or power-off state (not in the middle of restarting).

Once all the workload pods that are linked to the out-of-service node are moved to
a new running node, and the shutdown node has been recovered, you should remove that
taint on the affected node after the node is recovered.

## What’s new in stable

With the promotion of the Non-Graceful Node Shutdown feature to stable, the
feature gate  `NodeOutOfServiceVolumeDetach` is locked to true on
`kube-controller-manager` and cannot be disabled.

Metrics `force_delete_pods_total` and `force_delete_pod_errors_total` in the
Pod GC Controller are enhanced to account for all forceful pods deletion.
A reason is added to the metric to indicate whether the pod is forcefully deleted
because it is terminated, orphaned, terminating with the `out-of-service` taint,
or terminating and unscheduled.

A "reason" is also added to the metric `attachdetach_controller_forced_detaches`
in the Attach Detach Controller to indicate whether the force detach is caused by
the `out-of-service` taint or a timeout.

## What’s next?

This feature requires a user to manually add a taint to the node to trigger
workloads failover and remove the taint after the node is recovered.
In the future, we plan to find ways to automatically detect and fence nodes
that are shutdown/failed and automatically failover workloads to another node.

## How can I learn more?

Check out additional documentation on this feature
[here](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown).

## How to get involved?

We offer a huge thank you to all the contributors who helped with design,
implementation, and review of this feature and helped move it from alpha, beta, to stable:

* Michelle Au ([msau42](https://github.com/msau42)) 
* Derek Carr ([derekwaynecarr](https://github.com/derekwaynecarr))
* Danielle Endocrimes ([endocrimes](https://github.com/endocrimes)) 
* Baofa Fan ([carlory](https://github.com/carlory))
* Tim Hockin  ([thockin](https://github.com/thockin))
* Ashutosh Kumar ([sonasingh46](https://github.com/sonasingh46)) 
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* Yuiko Mouri ([YuikoTakada](https://github.com/YuikoTakada))
* Mrunal Patel ([mrunalp](https://github.com/mrunalp))
* David Porter ([bobbypage](https://github.com/bobbypage))
* Yassine Tijani ([yastij](https://github.com/yastij)) 
* Jing Xu ([jingxu97](https://github.com/jingxu97))
* Xing Yang ([xing-yang](https://github.com/xing-yang))

This feature is a collaboration between SIG Storage and SIG Node.
For those interested in getting involved with the design and development of any
part of the Kubernetes Storage system, join the Kubernetes Storage Special
Interest Group (SIG).
For those interested in getting involved with the design and development of the
components that support the controlled interactions between pods and host
resources, join the Kubernetes Node SIG.
