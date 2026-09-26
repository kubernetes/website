---
layout: blog
title: "Kubernetes 1.26: Non-Graceful Node Shutdown Moves to Beta"
date: 2022-12-16T10:00:00-08:00
slug: kubernetes-1-26-non-graceful-node-shutdown-beta
author: >
  Xing Yang (VMware),
  Ashutosh Kumar (VMware)
---

Kubernetes v1.24 [introduced](https://kubernetes.io/blog/2022/05/20/kubernetes-1-24-non-graceful-node-shutdown-alpha/) an alpha quality implementation of improvements
for handling a [non-graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown).
In Kubernetes v1.26, this feature moves to beta. This feature allows stateful workloads to failover to a different node after the original node is shut down or in a non-recoverable state, such as the hardware failure or broken OS.

## What is a node shutdown in Kubernetes?

In a Kubernetes cluster, it is possible for a node to shut down. This could happen either in a planned way or it could happen unexpectedly. You may plan for a security patch, or a kernel upgrade and need to reboot the node, or it may shut down due to preemption of VM instances. A node may also shut down due to a hardware failure or a software problem.

To trigger a node shutdown, you could run a `shutdown` or `poweroff` command in a shell,
 or physically press a button to power off a machine.

A node shutdown could lead to workload failure if the node is not drained before the shutdown.

In the following, we will describe what is a graceful node shutdown and what is a non-graceful node shutdown.

## What is a _graceful_ node shutdown?

The kubelet's handling for a [graceful node shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown)
allows the kubelet to detect a node shutdown event, properly terminate the pods on that node,
and release resources before the actual shutdown.
[Critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
are terminated after all the regular pods are terminated, to ensure that the
essential functions of an application can continue to work as long as possible.

## What is a _non-graceful_ node shutdown?

A Node shutdown can be graceful only if the kubelet's _node shutdown manager_ can
detect the upcoming node shutdown action. However, there are cases where a kubelet
does not detect a node shutdown action. This could happen because the `shutdown`
command does not trigger the [Inhibitor Locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit) mechanism used by the kubelet on Linux, or because of a user error. For example, if
the `shutdownGracePeriod` and `shutdownGracePeriodCriticalPods` details are not
configured correctly for that node.

When a node is shut down (or crashes), and that shutdown was **not** detected by the kubelet
node shutdown manager, it becomes a non-graceful node shutdown. Non-graceful node shutdown
is a problem for stateful apps.
If a node containing a pod that is part of a StatefulSet is shut down in a non-graceful way, the Pod
will be stuck in `Terminating` status indefinitely, and the control plane cannot create a replacement
Pod for that StatefulSet on a healthy node.
You can delete the failed Pods manually, but this is not ideal for a self-healing cluster.
Similarly, pods that ReplicaSets created as part of a Deployment will be stuck in `Terminating` status, and
that were bound to the now-shutdown node, stay as `Terminating` indefinitely.
If you have set a horizontal scaling limit, even those terminating Pods count against the limit,
so your workload may struggle to self-heal if it was already at maximum scale.
(By the way: if the node that had done a non-graceful shutdown comes back up, the kubelet does delete
the old Pod, and the control plane can make a replacement.)

## What's new for the beta?

For Kubernetes v1.26, the non-graceful node shutdown feature is beta and enabled by default.
The `NodeOutOfServiceVolumeDetach`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled by default
on `kube-controller-manager` instead of being opt-in; you can still disable it if needed
(please also file an issue to explain the problem).

On the instrumentation side, the kube-controller-manager reports two new metrics.

`force_delete_pods_total`
: number of pods that are being forcibly deleted (resets on Pod garbage collection controller restart)

`force_delete_pod_errors_total`
: number of errors encountered when attempting forcible Pod deletion (also resets on Pod garbage collection controller restart)

## How does it work?

In the case of a node shutdown, if a graceful shutdown is not working or the node is in a
non-recoverable state due to hardware failure or broken OS, you can manually add an `out-of-service`
taint on the Node. For example, this can be `node.kubernetes.io/out-of-service=nodeshutdown:NoExecute`
or `node.kubernetes.io/out-of-service=nodeshutdown:NoSchedule`. This taint trigger pods on the node to
be forcefully deleted if there are no matching tolerations on the pods. Persistent volumes attached to the shutdown node will be detached, and new pods will be created successfully on a different running node.

```
kubectl taint nodes <node-name> node.kubernetes.io/out-of-service=nodeshutdown:NoExecute
```

**Note:** Before applying the out-of-service taint, you must verify that a node is already in shutdown
or power-off state (not in the middle of restarting), either because the user intentionally shut it down
or the node is down due to hardware failures, OS issues, etc.

Once all the workload pods that are linked to the out-of-service node are moved to a new running node, and the shutdown node has been recovered, you should remove that taint on the affected node after the node is recovered.

## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the Non-Graceful Node Shutdown implementation to GA in either 1.27 or 1.28.

This feature requires a user to manually add a taint to the node to trigger the failover of workloads and remove the taint after the node is recovered.

The cluster operator can automate this process by automatically applying the `out-of-service` taint
if there is a programmatic way to determine that the node is really shut down and there isn’t IO between
the node and storage. The cluster operator can then automatically remove the taint after the workload
fails over successfully to another running node and that the shutdown node has been recovered.

In the future, we plan to find ways to automatically detect and fence nodes that are shut down or in a non-recoverable state and fail their workloads over to another node.

## How can I learn more?

To learn more, read [Non Graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown) in the Kubernetes documentation.

## How to get involved?

We offer a huge thank you to all the contributors who helped with design, implementation, and review of this feature:

* Michelle Au ([msau42](https://github.com/msau42)) 
* Derek Carr ([derekwaynecarr](https://github.com/derekwaynecarr))
* Danielle Endocrimes ([endocrimes](https://github.com/endocrimes)) 
* Tim Hockin  ([thockin](https://github.com/thockin))
* Ashutosh Kumar ([sonasingh46](https://github.com/sonasingh46)) 
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* Yuiko Mouri([YuikoTakada](https://github.com/YuikoTakada))
* Mrunal Patel ([mrunalp](https://github.com/mrunalp))
* David Porter ([bobbypage](https://github.com/bobbypage))
* Yassine Tijani ([yastij](https://github.com/yastij)) 
* Jing Xu ([jingxu97](https://github.com/jingxu97))
* Xing Yang ([xing-yang](https://github.com/xing-yang))

There are many people who have helped review the design and implementation along the way. We want to thank everyone who has contributed to this effort including the about 30 people who have reviewed the [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown) and implementation over the last couple of years.

This feature is a collaboration between SIG Storage and SIG Node. For those interested in getting involved with the design and development of any part of the Kubernetes Storage system, join the Kubernetes Storage Special Interest Group (SIG). For those interested in getting involved with the design and development of the components that support the controlled interactions between pods and host resources, join the Kubernetes Node SIG.
