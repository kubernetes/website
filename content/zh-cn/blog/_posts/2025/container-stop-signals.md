---
layout: blog
title: "Kubernetes v1.33：容器生命周期更新"
date: 2025-05-14T10:30:00-08:00
slug: kubernetes-v1-33-updates-to-container-lifecycle
author: >
  Sreeram Venkitesh (DigitalOcean)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: Updates to Container Lifecycle"
date: 2025-05-14T10:30:00-08:00
slug: kubernetes-v1-33-updates-to-container-lifecycle
author: >
  Sreeram Venkitesh (DigitalOcean)
-->

<!--
Kubernetes v1.33 introduces a few updates to the lifecycle of containers. The Sleep action for container lifecycle hooks now supports a zero sleep duration (feature enabled by default).
There is also alpha support for customizing the stop signal sent to containers when they are being terminated.
-->
Kubernetes v1.33 引入了对容器生命周期的一些更新。
容器生命周期回调的 Sleep 动作现在支持零睡眠时长（特性默认启用）。
同时还为定制发送给终止中的容器的停止信号提供了 Alpha 级别支持。

<!--
This blog post goes into the details of these new aspects of the container lifecycle, and how you can use them.
-->
这篇博客文章深入介绍了容器生命周期的这些新内容，以及如何使用它们。

<!--
## Zero value for Sleep action

Kubernetes v1.29 introduced the `Sleep` action for container PreStop and PostStart Lifecycle hooks. The Sleep action lets your containers pause for a specified duration after the container is started or before it is terminated. This was needed to provide a straightforward way to manage graceful shutdowns. Before the Sleep action, folks used to run the `sleep` command using the exec action in their container lifecycle hooks. If you wanted to do this you'd need to have the binary for the `sleep` command in your container image. This is difficult if you're using third party images. 
-->
## Sleep 动作的零值

Kubernetes v1.29 引入了容器 PreStop 和 PostStart 生命周期回调的 `Sleep` 动作。
Sleep 动作允许你的容器在启动后或终止前暂停指定的时长。这为管理优雅关闭提供了一种直接的方法。
在 Sleep 动作之前，人们常使用生命周期回调中的 exec 动作运行 `sleep` 命令。
如果你想这样做，则需要在你的容器镜像中包含 `sleep` 命令的二进制文件。
如果你使用第三方镜像，这可能会比较困难。

<!--
The sleep action when it was added initially didn't have support for a sleep duration of zero seconds. The `time.Sleep` which the Sleep action uses under the hood supports a duration of zero seconds. Using a negative or a zero value for the sleep returns immediately, resulting in a no-op. We wanted the same behaviour with the sleep action. This support for the zero duration was later added in v1.32, with the `PodLifecycleSleepActionAllowZero` feature gate.
-->
最初添加 Sleep 动作时，并不支持零秒的睡眠时间。
然而，`time.Sleep`（Sleep 动作底层使用的机制）是支持零秒的持续时间的。
使用负值或零值进行睡眠会立即返回，导致无操作。我们希望 Sleep 动作也有相同的行为。
后来在 v1.32 中通过**特性门控** `PodLifecycleSleepActionAllowZero` 添加了这种对零持续时间的支持。

<!--
The `PodLifecycleSleepActionAllowZero` feature gate has graduated to beta in v1.33, and is now enabled by default.
The original Sleep action for `preStop` and `postStart` hooks is been enabled by default, starting from Kubernetes v1.30.
With a cluster running Kubernetes v1.33, you are able to set a
zero duration for sleep lifecycle hooks. For a cluster with default configuration, you don't need 
to enable any feature gate to make that possible.
-->
`PodLifecycleSleepActionAllowZero` 特性门控在 v1.33 中已升级到 Beta 阶段，并且现在默认启用。
从 Kubernetes v1.30 开始，`preStop` 和 `postStart` 回调的原始 Sleep 动作默认情况下已启用。
使用运行 Kubernetes v1.33 的集群时，你可以为 Sleep 生命周期钩子设置零持续时间。
对于采用默认配置的集群，你无需启用任何特性门控即可实现这一点。

<!--
## Container stop signals

Container runtimes such as containerd and CRI-O honor a `StopSignal` instruction in the container image definition. This can be used to specify a custom stop signal
that the runtime will used to terminate containers based on that image.
Stop signal configuration was not originally part of the Pod API in Kubernetes.
Until Kubernetes v1.33, the only way to override the stop signal for containers was by rebuilding your container image with the new custom stop signal
(for example, specifying `STOPSIGNAL` in a `Containerfile` or `Dockerfile`).
-->
## 容器停止信号

容器运行时如 containerd 和 CRI-O 支持容器镜像定义中的 `StopSignal` 指令。
这可以用来指定一个自定义的停止信号，运行时将使用该信号来终止基于此镜像的容器。
停止信号配置最初并不是 Kubernetes Pod API 的一部分。
直到 Kubernetes v1.33，覆盖容器停止信号的唯一方法是通过使用新的自定义停止信号重建容器镜像
（例如，在 `Containerfile` 或 `Dockerfile` 中指定 `STOPSIGNAL`）。

<!--
The `ContainerStopSignals` feature gate which is newly added in Kubernetes v1.33 adds stop signals to the Kubernetes API. This allows users to specify a custom stop signal in the container spec. Stop signals are added to the API as a new lifecycle along with the existing PreStop and PostStart lifecycle handlers. In order to use this feature, we expect the Pod to have the operating system specified with `spec.os.name`. This is enforced so that we can cross-validate the stop signal against the operating system and make sure that the containers in the Pod are created with a valid stop signal for the operating system the Pod is being scheduled to. For Pods scheduled on Windows nodes, only `SIGTERM` and `SIGKILL` are allowed as valid stop signals. Find the full list of signals supported in Linux nodes [here](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/core/v1/types.go#L2985-L3053).
-->
`ContainerStopSignals` 特性门控是 Kubernetes v1.33 新增的，
它将停止信号添加到了 Kubernetes API。这允许用户在容器规格中指定自定义的停止信号。
停止信号作为新生命周期加入 API，连同现有的 PreStop 和 PostStart 生命周期处理器一起使用。
要使用这个特性，Pod 需要用 `spec.os.name` 指定操作系统。这是为了能对操作系统进行停止信号的交叉验证，
确保 Pod 中的容器是以适合其调度操作系统的有效停止信号创建的。对于调度到 Windows 节点上的 Pod，
仅允许 `SIGTERM` 和 `SIGKILL` 作为有效的停止信号。
[这里](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/core/v1/types.go#L2985-L3053)可以找到
Linux 节点支持的完整信号列表。

<!--
### Default behaviour

If a container has a custom stop signal defined in its lifecycle, the container runtime would use the signal defined in the lifecycle to kill the container, given that the container runtime also supports custom stop signals. If there is no custom stop signal defined in the container lifecycle, the runtime would fallback to the stop signal defined in the container image. If there is no stop signal defined in the container image, the default stop signal of the runtime would be used. The default signal is `SIGTERM` for both containerd and CRI-O.
-->
### 默认行为

如果容器在其生命周期中定义了自定义停止信号，那么只要容器运行时也支持自定义停止信号，
容器运行时就会使用生命周期中定义的信号来终止容器。如果容器生命周期中没有定义自定义停止信号，
运行时将回退到容器镜像中定义的停止信号。如果在容器镜像中也没有定义停止信号，
将会使用运行时的默认停止信号。对于 containerd 和 CRI-O，默认信号都是 `SIGTERM`。

<!--
### Version skew

For the feature to work as intended, both the versions of Kubernetes and the container runtime should support container stop signals. The changes to the Kuberentes API and kubelet are available in alpha stage from v1.33, which can be enabled with the `ContainerStopSignals` feature gate. The container runtime implementations for containerd and CRI-O are still a work in progress and will be rolled out soon.
-->
### 版本偏差

为了使该特性按预期工作，Kubernetes 和容器运行时的版本都应支持容器停止信号。
对 Kubernetes API 和 kubelet 的更改从 v1.33 开始进入 Alpha 阶段，
可以通过启用 `ContainerStopSignals` 特性门控来使用。
containerd 和 CRI-O 的容器运行时实现仍在进行中，不久将会发布。

<!--
### Using container stop signals

To enable this feature, you need to turn on the `ContainerStopSignals` feature gate in both the kube-apiserver and the kubelet. Once you have nodes where the feature gate is turned on, you can create Pods with a StopSignal lifecycle and a valid OS name like so:
-->
### 使用容器停止信号

要启用此特性，你需要在 kube-apiserver 和 kubelet 中打开 `ContainerStopSignals` 特性门控。
一旦你在节点上启用了特性门控，就可以创建带有 StopSignal 生命周期和有效操作系统名称的 Pod，如下所示：

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

<!--
Do note that the `SIGUSR1` signal in this example can only be used if the container's Pod is scheduled to a Linux node. Hence we need to specify `spec.os.name` as `linux` to be able to use the signal. You will only be able to configure `SIGTERM` and `SIGKILL` signals if the Pod is being scheduled to a Windows node. You cannot specify a `containers[*].lifecycle.stopSignal` if the `spec.os.name` field is nil or unset either.
-->
请注意，此示例中的 `SIGUSR1` 信号仅在容器的 Pod 被调度到 Linux 节点时才能使用。
因此，我们需要指定 `spec.os.name` 为 `linux` 才能使用该信号。
如果 Pod 被调度到 Windows 节点，则你只能配置 `SIGTERM` 和 `SIGKILL` 信号。
此外，如果 `spec.os.name` 字段为 nil 或未设置，你也不能指定 `containers[*].lifecycle.stopSignal`。

<!--
## How do I get involved?

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md). If you are interested in helping develop this feature, sharing feedback, or participating in any other ongoing SIG Node projects, please reach out to us!
-->
## 我如何参与？

此特性由 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md)
推动。如果你有兴趣帮助开发此特性、分享反馈或参与任何其他正在进行的 SIG Node 项目，请联系我们！

<!--
You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

You can also contact me directly:
- GitHub: @sreeram-venkitesh
- Slack: @sreeram.venkitesh
-->
你可以通过几种方式联系 SIG Node：

- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [开放社区 Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

你也可以直接联系我：

- GitHub：@sreeram-venkitesh
- Slack：@sreeram.venkitesh
