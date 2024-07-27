---
layout: blog
title: "Kubernetes 1.24: Introducing Non-Graceful Node Shutdown Alpha"
date: 2022-05-20
slug: kubernetes-1-24-non-graceful-node-shutdown-alpha
author: >
  Xing Yang (VMware),
  Yassine Tijani (VMware)
---

Kubernetes v1.24 introduces alpha support for [Non-Graceful Node Shutdown](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2268-non-graceful-shutdown). This feature allows stateful workloads to failover to a different node after the original node is shutdown or in a non-recoverable state such as hardware failure or broken OS.

## How is this different from Graceful Node Shutdown

You might have heard about the [Graceful Node Shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown) capability of Kubernetes,
and are wondering how the Non-Graceful Node Shutdown feature is different from that. Graceful Node Shutdown
allows Kubernetes to detect when a node is shutting down cleanly, and handles that situation appropriately.
A Node Shutdown can be "graceful" only if the node shutdown action can be detected by the kubelet ahead
of the actual shutdown. However, there are cases where a node shutdown action may not be detected by
the kubelet. This could happen either because the shutdown command does not trigger the systemd inhibitor
locks mechanism that kubelet relies upon, or because of a configuration error
(the `ShutdownGracePeriod` and `ShutdownGracePeriodCriticalPods` are not configured properly).

Graceful node shutdown relies on Linux-specific support. The kubelet does not watch for upcoming
shutdowns on Windows nodes (this may change in a future Kubernetes release).

When a node is shutdown but without the kubelet detecting it, pods on that node
also shut down ungracefully. For stateless apps, that's often not a problem (a ReplicaSet adds a new pod once
the cluster detects that the affected node or pod has failed). For stateful apps, the story is more complicated.
If you use a StatefulSet and have a pod from that StatefulSet on a node that fails uncleanly, that affected pod
will be marked as terminating; the StatefulSet cannot create a replacement pod because the pod
still exists in the cluster.
As a result, the application running on the StatefulSet may be degraded or even offline. If the original, shut
down node comes up again, the kubelet on that original node reports in, deletes the existing pods, and
the control plane makes a replacement pod for that StatefulSet on a different running node.
If the original node has failed and does not come up, those stateful pods would be stuck in a
terminating status on that failed node indefinitely.

```
$ kubectl get pod -o wide
NAME    READY   STATUS        RESTARTS   AGE   IP           NODE                      NOMINATED NODE   READINESS GATES
web-0   1/1     Running       0          100m   10.244.2.4   k8s-node-876-1639279816   <none>           <none>
web-1   1/1     Terminating   0          100m   10.244.1.3   k8s-node-433-1639279804   <none>           <none>
```

## Try out the new non-graceful shutdown handling

To use the non-graceful node shutdown handling, you must enable the `NodeOutOfServiceVolumeDetach`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for the `kube-controller-manager`
component.

In the case of a node shutdown, you can manually taint that node as out of service. You should make certain that
the node is truly shutdown (not in the middle of restarting) before you add that taint. You could add that
taint following a shutdown that the kubelet did not detect and handle in advance; another case where you
can use that taint is when the node is in a non-recoverable state due to a hardware failure or a broken OS.
The values you set for that taint can be `node.kubernetes.io/out-of-service=nodeshutdown: "NoExecute"`
or `node.kubernetes.io/out-of-service=nodeshutdown:" NoSchedule"`.
Provided you have enabled the feature gate mentioned earlier, setting the out-of-service taint on a Node
means that pods on the node will be deleted unless if there are matching tolerations on the pods.
Persistent volumes attached to the shutdown node will be detached, and for StatefulSets, replacement pods will
be created successfully on a different running node.

```
$ kubectl taint nodes <node-name> node.kubernetes.io/out-of-service=nodeshutdown:NoExecute

$ kubectl get pod -o wide
NAME    READY   STATUS    RESTARTS   AGE    IP           NODE                      NOMINATED NODE   READINESS GATES
web-0   1/1     Running   0          150m   10.244.2.4   k8s-node-876-1639279816   <none>           <none>
web-1   1/1     Running   0          10m    10.244.1.7   k8s-node-433-1639279804   <none>           <none>
```

Note: Before applying the out-of-service taint, you **must** verify that a node is already in shutdown or power off state (not in the middle of restarting), either because the user intentionally shut it down or the node is down due to hardware failures, OS issues, etc.

Once all the workload pods that are linked to the out-of-service node are moved to a new running node, and the shutdown node has been recovered, you should remove
that taint on the affected node after the node is recovered.
If you know that the node will not return to service, you could instead delete the node from the cluster.

## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the Non-Graceful Node Shutdown implementation to Beta in either 1.25 or 1.26.

This feature requires a user to manually add a taint to the node to trigger workloads failover and remove the taint after the node is recovered. In the future, we plan to find ways to automatically detect and fence nodes that are shutdown/failed and automatically failover workloads to another node.

## How can I learn more?

Check out the [documentation](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)
for non-graceful node shutdown.

## How to get involved?

This feature has a long story. Yassine Tijani ([yastij](https://github.com/yastij)) started the KEP more than two years ago. Xing Yang ([xing-yang](https://github.com/xing-yang)) continued to drive the effort. There were many discussions among SIG Storage, SIG Node, and API reviewers to nail down the design details. Ashutosh Kumar ([sonasingh46](https://github.com/sonasingh46)) did most of the implementation and brought it to Alpha in Kubernetes 1.24.

We want to thank the following people for their insightful reviews: Tim Hockin  ([thockin](https://github.com/thockin)) for his guidance on the design, Jing Xu ([jingxu97](https://github.com/jingxu97)), Hemant Kumar ([gnufied](https://github.com/gnufied)), and Michelle Au ([msau42](https://github.com/msau42)) for reviews from SIG Storage side, and Mrunal Patel ([mrunalp](https://github.com/mrunalp)), David Porter ([bobbypage](https://github.com/bobbypage)), Derek Carr ([derekwaynecarr](https://github.com/derekwaynecarr)), and Danielle Endocrimes ([endocrimes](https://github.com/endocrimes)) for reviews from SIG Node side.

There are many people who have helped review the design and implementation along the way. We want to thank everyone who has contributed to this effort including the about 30 people who have reviewed the [KEP](https://github.com/kubernetes/enhancements/pull/1116) and implementation over the last couple of years.

This feature is a collaboration between SIG Storage and SIG Node. For those interested in getting involved with the design and development of any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). For those interested in getting involved with the design and development of the components that support the controlled interactions between pods and host resources, join the [Kubernetes Node SIG](https://github.com/kubernetes/community/tree/master/sig-node).
