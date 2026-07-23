---
layout: blog
title: 'Kubernetes v1.37 Sneak Peek'
draft: true
slug: kubernetes-v1-37-sneak-peek
author: >
  Arsh Sharma,
  Christopher Tineo,
  Kirti Goyal,
  Sophia Ugochukwu,
  Swathi Rao,
  Troy Connor
---

As we get closer to the release date for Kubernetes v1.37, the project develops and matures, features may be deprecated, removed, or replaced with better ones for the project's overall health. This blog outlines some of the planned changes for the Kubernetes v1.37 release that the release team feels you should be aware of for the continued maintenance of your Kubernetes environment and keeping up to date with the latest changes. The information below reflects the current status of the v1.37 release and may change before the actual release date. 

## Deprecations and removals for Kubernetes v1.37

### Kubectl: kubectl run --filename/-f is deprecated

The --filename (or -f) flag for kubectl run is being deprecated as the generated pod is always built purely from CLI arguments like NAME and --image. 

See [kubernetes/kubernetes#138671](https://github.com/kubernetes/kubernetes/issues/138671) for the original issue and discussion.


### Kubelet: removal of `PreventStaticPodAPIReferences` feature gate

Static Pods’ `PreventStaticPodAPIReferences` feature gate has been removed, and this means they’re now strictly prohibited from referencing API resources such as Secrets or ConfigMaps through fields like configMapRef or secretRef.

See [kubernetes/kubernetes#140226](https://github.com/kubernetes/kubernetes/issues/140226) for the original issue and discussion.

### Deprecating kube-proxy's support for ipvs mode

ipvs was introduced in 2017 to resolve iptables performance bottlenecks. However, since the kernel ipvs API alone cannot fully implement Kubernetes Services, ipvs mode continues to use iptables underneath ([KEP-3866, "The ipvs mode of kube-proxy will not save us"](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/3866-nftables-proxy/README.md#the-ipvs-mode-of-kube-proxy-will-not-save-us)).

Clusters running kube-proxy in ipvs mode (or mode: ipvs in KubeProxyConfiguration) would now be logging a deprecation warning on startup. The deprecation timeline looks like this:
By v1.40, ipvs is expected to be disabled by default (still selectable via the feature gate)
By v1.43 removed entirely [KEP-5495, Graduation Criteria](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/5495-deprecate-ipvs-mode-in-kube-proxy/README.md#graduation-criteria).


To confirm which mode you’re currently running, use:

```bash
kubectl -n kube-system get configmap kube-proxy -o jsonpath='{.data.config\.conf}' | grep 'mode:'
```

To understand the rationale behind this deprecation, see [KEP-5495: Deprecate ipvs mode in kube-proxy](https://kubernetes.dev/resources/keps/5495).

### Removal of cgroup v1 support

As modern Linux distributions and container runtimes use [cgroup v2](https://kubernetes.io/docs/concepts/architecture/cgroups/) as the default, support for the legacy cgroup v1 is officially being phased out. Since the v1.35 release, the failCgroupV1 setting has defaulted to true. Consequently, the Kubelet will fail to initialize on any nodes that still rely on cgroup v1 unless an explicit configuration override is applied. 

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
failCgroupV1: false # temporary override
```

Using this override should be considered a short-term fix. Advanced resource management capabilities, such as In-Place Pod Resizing and Tiered Memory Protection, depend entirely on cgroups v2. As the project matures, cgroup v1 support will be removed entirely, and this configuration override will no longer be available in future releases.

To learn more about this deprecation, refer to [KEP-5573: Remove cgroup v1 support](https://kubernetes.dev/resources/keps/5573).

## Breaking changes in Kubernetes v1.37

### KEP #1710: SELinux Volume Relabeling (SELinuxMount graduates to GA)

SELinuxMount is expected to reach GA and be enabled by default in v1.37: volumes would then be mounted with `-o context=<label>` (the MountOption default) instead of being recursively relabeled, but only when the volume's CSI driver opts in via `CSIDriver.Spec.SELinuxMount: true`.

A mount can only carry one SELinux context, so [Pods with different SELinux labels sharing a volume on the same node, which used to coexist under recursive relabeling, can now fail to start](https://www.kubernetes.dev/resources/keps/1710/#story-3-cluster-upgrade). Set `seLinuxChangePolicy: Recursive` on a Pod to keep the old behavior for just that workload.

This behavior itself also isn't locked until v1.38, so disabling it cluster-wide remains an option for one more release.

Clusters without SELinux enabled see no effect at all. To learn more, check [SELinux Volume Label Changes goes GA (and likely implications in v1.37)](https://kubernetes.io/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/)


## Featured enhancements of Kubernetes v1.37

### KEP #5207: Metrics API (GA) {#metrics-api-ga}

The `metrics.k8s.io` API is expected to graduate to Stable (GA) in Kubernetes v1.37 after spending nearly nine years in beta. The API provides a standard way to retrieve CPU and memory usage for pods and nodes, powering widely used Kubernetes features such as the Horizontal Pod Autoscaler (HPA) and commands like `kubectl top`.

This graduation recognizes the API's stability and widespread adoption without introducing any functional changes, in line with the Kubernetes project’s goal to prevent an API from being stuck in permanent beta. Both v1 and v1beta1 will be usable during the transition, enabling developers to adopt the stable API without any effect on compatibility. Most users do not need to take any action, and the v1beta1 API will be deprecated and removed in a future release according to the Kubernetes API deprecation policy. 

To learn more about this enhancement, refer to [KEP-5207: metrics.k8s.io API definition]( https://www.kubernetes.dev/resources/keps/5207/)

### KEP #2033: Kubelet in UserNS a.k.a. Rootless Mode (Beta)

Traditionally, Kubernetes node components such as the kubelet run with root privileges on the host. While necessary for many deployments, this also means that a vulnerability in one of these components could potentially have a greater impact on the underlying system. 

With Kubernetes v1.37, kubelet in User Namespace (Rootless Mode) graduates to Beta. This enhancement allows Kubernetes node components to run inside a Linux user namespace as an unprivileged user on the host while still behaving as root within the namespace. By reducing the need for host-level root privileges, it adds an extra layer of isolation and helps limit the impact of potential vulnerabilities affecting node components. 

To learn more about this enhancement, refer to [KEP-2033: Kubelet in UserNS a.k.a. Rootless Mode](https://kubernetes.dev/resources/keps/2033). 
### KEP #4960: Container Stop Signals (Beta) 

Currently, Kubernetes has no native way to modify a container's stop signal. Whatever the value was for the stop signal during the time of building the container image, it stays the same. The only way to modify it is to rebuild the container image and change the stop signal at the image definition level.

Changing a container’s stop signal is needed in various cases. One example is when you want to send a `SIGQUIT` stop signal instead of SIGTERM (which Kubernetes sends by default) when quitting an nginx container. Sending a SIGTERM can cause the nginx container to drop requests, whereas SIGQUIT leads to a more graceful exit. For cases like these, the user experience isn’t ideal, as there was no way native to do this in K8s. This KEP, which was first released in v1.33 as Alpha, fixes that by introducing `STOPSIGNAL` as a first-class citizen in the Pod’s container specification. 

With this feature, users can easily define custom stop signals in their container specs without rebuilding container images or resorting to hacky workarounds. 

To learn more about this enhancement, refer to [KEP-4960:Container Stop Signals ](https://kubernetes.dev/resources/keps/4960). 

### KEP #5894: Node System Partition (Alpha)

Currently, user workload pods and system pods share the same resource boundaries.  This makes it impossible to guarantee that the critical components have what they need and that the user workloads are free from system interference.  As Kubernetes' target for workloads has increased, a dedicated system partition solves these problems by giving system pods their own resource-limited cgroup hierarchy, eliminating interference between the management layer and user workloads.

In Kubernetes v1.37, in Alpha, the goals of this would include introducing a system partition with a dedicated cgroup hierarchy for system pods (e.g., the kube-system namespace), supporting memory limiting via the system partition’s cgroup root, supporting setting a dedicated CPU set for system partition pods, the kubelet will treat system and default partitions independently for resource allocation and overcommit logic, the system partition is statically defined via kubelet configuration, and the system partition will share resources with kubelet, container runtime, and other host processes. 

To learn more about this enhancement, refer to [KEP-5894:Node System Partition ](https://kubernetes.dev/resources/keps/5894). 


### KEP #1432: Volume Health Monitor (Alpha)

Historically, Kubernetes has lacked an API for CSI drivers to report storage failures, which become evident only through failed mounts or hung I/O. Since remediation controllers had nothing machine-readable to act upon, the only way to figure out the root cause behind this failure was to cross-reference Kubernetes objects alongside external vendor dashboards. 

An initial v1.21 version of this KEP introduced a`VolumeCondition` field in the CSI spec with the results surfacing as Kubernetes events. However, this approach had limitations: health was coupled to stat, events are ephemeral and unable to drive remediation controllers, and `NodeVolumeGetStats` covered only published volumes, ignoring key cases like corrupt filesystems and failed mounts. 

In Kubernetes v1.37, this KEP resets graduation to alpha and introduces four new CSI RPCs. The controller plugin reports the health of storage volumes using `ControllerListVolumeHealth` (lists unhealthy volumes) and `ControllerGetVolumeHealth` (checks a specific volume). A controller-side health monitor polls these CSI controllers and stores the results in `PersistentVolumeClaim.status.healthStatus`. On the node side, the kubelet calls `NodeGetVolumeHealth` to obtain the health of individual volumes on that node and records it in `Pod.status.volumeHealth`, while `NodeGetStorageHealth` reports the health of the drivers registered to a node in `CSINode.status.storageHealth`. The error vocabulary is kept simple, extensible, and machine-parsable(`Inaccessible`, `Degraded`, etc.), with further driver-specific elaboration available via `reason` and `message`. Finally, the controller-side and node-side reports are kept independent and are hence displayed separately, providing a more holistic view of storage health to consumers(applications or users). 

To learn more about this enhancement, refer to [KEP-1432: Volume Health Monitor](https://kubernetes.dev/resources/keps/1432).

## Want to know more?
New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.37](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md) as part of the CHANGELOG for that release.

Kubernetes v1.37 release is planned for **Wednesday, August 26th, 2026**. Stay tuned for updates!

You can see the announcements of changes in the release notes for:

* [Kubernetes v1.36](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md)

* [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)

* [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)

* [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)

## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://kubernetes.dev/community/community-groups/sigs/) (SIGs) that align with your interests. 
Have something you’d like to broadcast to the Kubernetes community? 
Share your voice at our weekly [Contributor Communications meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. 
Thank you for your continued feedback and support.

- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Read more on how to become a [Kubernetes Contributor](https://kubernetes.dev/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)

