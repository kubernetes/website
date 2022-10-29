---
layout: blog
title: "Kubernetes 1.26: Non-Graceful Node Shutdown Moves to Beta"
date: 2022-12-06T10:00:00-08:00
slug: kubernetes-1-26-non-graceful-node-shutdown-beta
---

**Author:** Xing Yang and Ashutosh Kumar (VMware)

Kubernetes v1.24 introduces [alpha support](https://kubernetes.io/blog/2022/05/20/kubernetes-1-24-non-graceful-node-shutdown-alpha/) for [Non-Graceful Node Shutdown](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown).
In Kubernetes v1.26, this feature moves to beta. This feature allows stateful workloads to failover to a different node after the original node is shutdown or in a non-recoverable state such as the hardware failure or broken OS.

## What is a Node Shutdown in Kubernetes

In a Kubernetes cluster, it is possible for a node to shutdown. This could happen either in a planned way or it could happen unexpectedly. You may plan for a security patch, a kernel upgrade, and need to reboot the node; or a node may shutdown due to preemption of VM instances; or a node may shutdown due to a hardware failure, or a software problem, etc.

To trigger a node shutdown, you could run a shutdown or poweroff command, or physically press a button to power off a machine.

A node shutdown could lead to workload failure if the node is not drained before the shutdown. A node shutdown can be either graceful or non-graceful.

## What is a Graceful Node Shutdown

The [Graceful Node Shutdown](https://kubernetes.io/blog/2021/04/21/graceful-node-shutdown-beta/) feature allows Kubelet to detect a node shutdown event, properly terminate the pods, and release resources, before the actual shutdown. Critical pods will be terminated after all the regular pods are terminated, to make sure the critical function of an application can work as long as possible.

## What is a Non-Graceful Node Shutdown

A Node Shutdown can be `Graceful` only if the node shutdown action can be detected by Kubelet’s Node Shutdown Manager. However, there are cases where a node shutdown action may not be detected by Kubelet's Node Shutdown Manager. This could happen either because the shutdown command does not trigger the inhibitor locks mechanism used by Kubelet or because of a user error, i.e., the `ShutdownGracePeriod` and `ShutdownGracePeriodCriticalPods` are not configured properly.

When a node is shutdown but not detected by Kubelet's Node Shutdown Manager, this becomes a non-graceful node shutdown. Non-graceful node shutdown is usually not a problem for stateless apps, however, it is a problem for stateful apps. If StatefulSet is used by the apps, the pod that is part of a StatefulSet will be stuck in `Terminating` status on the shutdown node and cannot move to a new running node. If Deployment is used by the apps, a new pod will come up on another running node but stuck in `ContainerCreating` status and the old pod will be stuck in `Terminating` status on the shutdown node. As a result, the application cannot function properly. If the original shutdown node comes up, the old pod will be deleted by Kubelet and the new pod will be created successfully on a different running node. If the original shutdown node does not come up, these pods will be stuck in terminating status on the shutdown node forever.

## What’s new in Beta

With the promotion of the Non-Graceful Node Shutdown feature to beta, the feature gate  `NodeOutOfServiceVolumeDetach` is enabled by default on `kube-controller-manager` instead of being opt-in.

New metrics `force_delete_pods_total` and `force_delete_pod_errors_total` are also added in the Pod GC Controller.

## How does it work

In the case of a node shutdown, if graceful shutdown is not working or node is in non-recoverable state due to hardware failure or broken OS, the user can manually add a `out-of-service’ taint on the Node. For example, this can be `node.kubernetes.io/out-of-service=nodeshutdown:NoExecute` or `node.kubernetes.io/out-of-service=nodeshutdown:NoSchedule`. This will trigger pods on the node to be forcefully deleted if there are no matching tolerations on the pods.  Persistent volumes attached to the shutdown node will be detached, and new pods will be created successfully on a different running node.

```
kubectl taint nodes <node-name> node.kubernetes.io/out-of-service=nodeshutdown:NoExecute
```

Note: Before applying the out-of-service taint, you must verify that a node is already in shutdown or power off state (not in the middle of restarting), either because the user intentionally shut it down or the node is down due to hardware failures, OS issues, etc.

Once all the workload pods that are linked to the out-of-service node are moved to a new running node, and the shutdown node has been recovered, you should remove that taint on the affected node after the node is recovered.

## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the Non-Graceful Node Shutdown implementation to GA in either 1.27 or 1.28.

This feature requires a user to manually add a taint to the node to trigger workloads failover and remove the taint after the node is recovered. In the future, we plan to find ways to automatically detect and fence nodes that are shutdown/failed and automatically failover workloads to another node.

## How can I learn more?

Check out additional documentation on this feature [here](https://kubernetes.io/docs/concepts/architecture/nodes/#non-graceful-node-shutdown).

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

There are many people who have helped review the design and implementation along the way. We want to thank everyone who has contributed to this effort including the about 30 people who have reviewed the [KEP](https://github.com/kubernetes/enhancements/pull/1116) and implementation over the last couple of years.

This feature is a collaboration between SIG Storage and SIG Node. For those interested in getting involved with the design and development of any part of the Kubernetes Storage system, join the Kubernetes Storage Special Interest Group (SIG). For those interested in getting involved with the design and development of the components that support the controlled interactions between pods and host resources, join the Kubernetes Node SIG.
