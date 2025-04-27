---
layout: blog
title: "Updates to Container Lifecycle in Kubernetes v1.33"
date: 2025-04-23
slug: updates-to-container-lifecycle
draft: true
author: >
  Sreeram Venkitesh (DigitalOcean)
---

Kubernetes v1.33 introduces a few updates to the lifecycle of containers. The Sleep action for container lifecycle hooks now supports a zero sleep duration (feature enabled by default).
There is also alpha support for customizing the stop signal sent to containers when they are being terminated.

This blog post goes into the details of these new aspects of the container lifecycle, and how you can use them.

## Zero value for Sleep action

Kubernetes v1.29 introduced the `Sleep` action for container PreStop and PostStart Lifecycle hooks. The Sleep action lets your containers pause for a specified duration after the container is started or before it is terminated. This was needed to provide a straightforward way to manage graceful shutdowns. Before the Sleep action, folks used to run the `sleep` command using the exec action in their container lifecycle hooks. If you wanted to do this you'd need to have the binary for the `sleep` command in your container image. This is difficult if you're using third party images. 

The sleep action when it was added initially didn't have support for a sleep duration of zero seconds. The `time.Sleep` which the Sleep action uses under the hood supports a duration of zero seconds. Using a negative or a zero value for the sleep returns immediately, resulting in a no-op. We wanted the same behaviour with the sleep action. This support for the zero duration was later added in v1.32, with the `PodLifecycleSleepActionAllowZero` feature gate.

The `PodLifecycleSleepActionAllowZero` feature gate has graduated to beta in v1.33, and is now enabled by default.
The original Sleep action for `preStop` and `postStart` hooks is been enabled by default, starting from Kubernetes v1.30.
With a cluster running Kubernetes v1.33, you are able to set a
zero duration for sleep lifecycle hooks. For a cluster with default configuration, you don't need 
to enable any feature gate to make that possible.

## Container stop signals

Container runtimes such as containerd and CRI-O honor a `StopSignal` instruction in the container image definition. This can be used to specify a custom stop signal
that the runtime will used to terminate containers based on that image.
Stop signal configuration was not originally part of the Pod API in Kubernetes.
Until Kubernetes v1.33, the only way to override the stop signal for containers was by rebuilding your container image with the new custom stop signal
(for example, specifying `STOPSIGNAL` in a `Containerfile` or `Dockerfile`).

The `ContainerStopSignals` feature gate which is newly added in Kubernetes v1.33 adds stop signals to the Kubernetes API. This allows users to specify a custom stop signal in the container spec. Stop signals are added to the API as a new lifecycle along with the existing PreStop and PostStart lifecycle handlers. In order to use this feature, we expect the Pod to have the operating system specified with `spec.os.name`. This is enforced so that we can cross-validate the stop signal against the operating system and make sure that the containers in the Pod are created with a valid stop signal for the operating system the Pod is being scheduled to. For Pods scheduled on Windows nodes, only `SIGTERM` and `SIGKILL` are allowed as valid stop signals. Find the full list of signals supported in Linux nodes [here](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/core/v1/types.go#L2985-L3053).

### Default behaviour

If a container has a custom stop signal defined in its lifecycle, the container runtime would use the signal defined in the lifecycle to kill the container, given that the container runtime also supports custom stop signals. If there is no custom stop signal defined in the container lifecycle, the runtime would fallback to the stop signal defined in the container image. If there is no stop signal defined in the container image, the default stop signal of the runtime would be used. The default signal is `SIGTERM` for both containerd and CRI-O.

### Version skew

For the feature to work as intended, both the versions of Kubernetes and the container runtime should support container stop signals. The changes to the Kuberentes API and kubelet are available in alpha stage from v1.33, which can be enabled with the `ContainerStopSignals` feature gate. The container runtime implementations for containerd and CRI-O are still a work in progress and will be rolled out soon.

### Using container stop signals

To enable this feature, you need to turn on the `ContainerStopSignals` feature gate in both the kube-apiserver and the kubelet. Once you have nodes where the feature gate is turned on, you can create Pods with a StopSignal lifecycle and a valid OS name like so:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  os:
    name: linux
  containers:
    - name: nginx
      image: nginx:latest
      lifecycle:
        stopSignal: SIGUSR1
```

Do note that the `SIGUSR1` signal in this example can only be used if the container's Pod is scheduled to a Linux node. Hence we need to specify `spec.os.name` as `linux` to be able to use the signal. You will only be able to configure `SIGTERM` and `SIGKILL` signals if the Pod is being scheduled to a Windows node. You cannot specify a `containers[*].lifecycle.stopSignal` if the `spec.os.name` field is nil or unset either.

## How do I get involved?

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md). If you are interested in helping develop this feature, sharing feedback, or participating in any other ongoing SIG Node projects, please reach out to us!

You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

You can also contact me directly:
- GitHub: @sreeram-venkitesh
- Slack: @sreeram.venkitesh