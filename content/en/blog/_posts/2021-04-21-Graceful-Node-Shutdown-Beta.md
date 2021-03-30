---
layout: blog
title: 'Graceful Node Shutdown Goes Beta'
date: 2021-04-21
slug: graceful-node-shutdown-beta
---

**Authors:** David Porter (Google), Murnal Patel (Red Hat), and Tim Bannister (The Scale Factory)

Kuberentes is a distributed system and as such we need to be prepared for inevitable failures — nodes will fail, containers might crash or be restarted, and - ideally - your workloads will be able to withstand these catastrophic events. 

One of the common classes of issues are workload failures on node shutdown or restart. The best practice prior to bringing your node down is to [safely drain and cordon your node](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/). This will ensure that all pods running on this node can safely be evicted. An eviction will ensure your pods can follow the expected pod [termination lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) meaning receiving a SIGTERM in your container and/or running preStopHooks, etc.

Unfortunately prior to kubernetes 1.20, safe node draining is not always possible: it requires users to manually take action and drain the node beforehand. If someone or something shuts down your node without a drain beforehand, most likely your pods will not be safely evicted from your node and shutdown abruptly. 

In Kubernetes 1.20 graceful node shutdown was introduced as a new feature in alpha, and later in 1.21 brought to beta. Graceful node shutdown gives you more control over some of those unexpected shutdown situations. With Graceful node shutdown, the kubelet is aware of underlying system shutdown events and can propagate these events to pods, ensuring their containers can shut down as gracefully as possible. This gives the containers a chance to checkpoint their state or release back any resources they are holding.

## How does it work?
On Linux, your system can shut down in many different situations. For example:
* A user or script running `shutdown -h -P now` or `systemctl poweroff`
* Physically pressing a power button on the machine.
* Stopping a VM instance on a cloud provider, e.g. `gcloud compute instances stop` on GCP.
* A Preemptible VM or Spot Instances that can be terminated by a cloud provider unexpectedly.

Many of these situations can be unexpected and there is no guarantee that a cluster administrator drained the node prior to these events. With the  Graceful node shutdown feature, kubelet uses a systemd mechanism called "[Inhibitor Locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit)" to allow draining in most cases. Using Inhibitor Locks, kubelet instructs systemd to postpone system shutdown for a specified duration, giving a chance for the node to drain and evict pods on the system.

Kubelet makes use of this mechanism to ensure your pods will be terminated cleanly. When the kubelet starts, it acquires a systemd delay-type inhibitor lock. When the system is about to shut down, the kubelet can delay that shutdown for a configurable, short duration utilizing the delay-type inhibitor lock it acquired earlier. This gives your pods extra time to  terminate. As a result, even during unexpected shutdowns, your application will receive a SIGTERM, preStop hooks will execute, and kubelet will properly update it’s own ready status and pod statuses to the api-server.

For example, on a node with Graceful node shutdown enabled, you can see that the inhibitor lock is actively taken by the kubelet:

```
kubelet-node ~ # systemd-inhibit --list
    Who: kubelet (UID 0/root, PID 1515/kubelet)
    What: shutdown
    Why: Kubelet needs time to handle node shutdown
    Mode: delay

1 inhibitors listed.
```

One important consideration we took when designing this feature is that not all pods are created equal. For example, some of the pods running on a node such as a logging related daemonset should stay running as long as possible to capture important logs during the shutdown itself. As a result, pods are split into two categories: “regular” and “critical”. [Critical pods](https://kubernetes.io/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical) are those that have `priorityClassName` set to `system-cluster-critical` or `system-node-critical`; all other pods are considered regular. In our example, the logging DaemonSet would run as a critical pod. During the graceful shutdown, regular pods are terminated first, followed by critical pods. As an example, this would allow a critical pod like those part of a logging daemonset to continue functioning, and collecting logs during the termination of regular pods.

## How do I use it?
Graceful node shutdown is controlled with the `GracefulNodeShutdown` [feature gate](https://github.com/kubernetes/website/blob/master/docs/reference/command-line-tools-reference/feature-gates) which is enabled by default in 1.21.

Graceful node shutdown feature is configured with two kubelet configuration options: `ShutdownGracePeriod`, `ShutdownGracePeriodCriticalPods`. These can be adjusted by editing the kubelet config file that is passed to kubelet via the `--config` flag; for more details, refer to [set kubelet parameters via a configuration file](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/).

During a shutdown, kubelet terminates pods in two phases. You can configure how long each of these phases lasts.
1. Terminate regular pods running on the node.
2. Terminate critical pods running on the node.

The settings that control the duration of shutdown are:
* `ShutdownGracePeriod`
    * Specifies the total duration that the node should delay the shutdown by. This is the total grace period for pod termination for both regular and critical pods.
* `ShutdownGracePeriodCriticalPods`
    * Specifies the duration used to terminate critical pods during a node shutdown. This should be less than   ShutdownGracePeriod.

For example, if `ShutdownGracePeriod=30s`, and `ShutdownGracePeriodCriticalPods=10s`, kubelet will delay the node shutdown by 30 seconds. During the shutdown, the first 20 (30-10) seconds would be reserved for gracefully terminating normal pods, and the last 10 seconds would be reserved for terminating critical pods.

## How can I learn more?
* Documentation: [https://kubernetes.io/docs/concepts/architecture/nodes/#graceful-node-shutdown](https://kubernetes.io/docs/concepts/architecture/nodes/#graceful-node-shutdown)
* KEP 2000: [https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2000-graceful-node-shutdown](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2000-graceful-node-shutdown)
* View the code: [https://github.com/kubernetes/kubernetes/tree/release-1.20/pkg/kubelet/nodeshutdown](https://github.com/kubernetes/kubernetes/tree/release-1.20/pkg/kubelet/nodeshutdown)

## How do I get involved?
Your feedback is always welcome! SIG-Node meets regularly and can be reached via Slack and the mailing list.