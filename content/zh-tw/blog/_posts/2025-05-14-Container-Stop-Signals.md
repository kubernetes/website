---
layout: blog
title: "Kubernetes v1.33：容器生命週期更新"
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
Kubernetes v1.33 引入了對容器生命週期的一些更新。
容器生命週期回調的 Sleep 動作現在支持零睡眠時長（特性默認啓用）。
同時還爲定製發送給終止中的容器的停止信號提供了 Alpha 級別支持。

<!--
This blog post goes into the details of these new aspects of the container lifecycle, and how you can use them.
-->
這篇博客文章深入介紹了容器生命週期的這些新內容，以及如何使用它們。

<!--
## Zero value for Sleep action

Kubernetes v1.29 introduced the `Sleep` action for container PreStop and PostStart Lifecycle hooks. The Sleep action lets your containers pause for a specified duration after the container is started or before it is terminated. This was needed to provide a straightforward way to manage graceful shutdowns. Before the Sleep action, folks used to run the `sleep` command using the exec action in their container lifecycle hooks. If you wanted to do this you'd need to have the binary for the `sleep` command in your container image. This is difficult if you're using third party images. 
-->
## Sleep 動作的零值

Kubernetes v1.29 引入了容器 PreStop 和 PostStart 生命週期回調的 `Sleep` 動作。
Sleep 動作允許你的容器在啓動後或終止前暫停指定的時長。這爲管理優雅關閉提供了一種直接的方法。
在 Sleep 動作之前，人們常使用生命週期回調中的 exec 動作運行 `sleep` 命令。
如果你想這樣做，則需要在你的容器映像檔中包含 `sleep` 命令的二進制文件。
如果你使用第三方映像檔，這可能會比較困難。

<!--
The sleep action when it was added initially didn't have support for a sleep duration of zero seconds. The `time.Sleep` which the Sleep action uses under the hood supports a duration of zero seconds. Using a negative or a zero value for the sleep returns immediately, resulting in a no-op. We wanted the same behaviour with the sleep action. This support for the zero duration was later added in v1.32, with the `PodLifecycleSleepActionAllowZero` feature gate.
-->
最初添加 Sleep 動作時，並不支持零秒的睡眠時間。
然而，`time.Sleep`（Sleep 動作底層使用的機制）是支持零秒的持續時間的。
使用負值或零值進行睡眠會立即返回，導致無操作。我們希望 Sleep 動作也有相同的行爲。
後來在 v1.32 中通過**特性門控** `PodLifecycleSleepActionAllowZero` 添加了這種對零持續時間的支持。

<!--
The `PodLifecycleSleepActionAllowZero` feature gate has graduated to beta in v1.33, and is now enabled by default.
The original Sleep action for `preStop` and `postStart` hooks is been enabled by default, starting from Kubernetes v1.30.
With a cluster running Kubernetes v1.33, you are able to set a
zero duration for sleep lifecycle hooks. For a cluster with default configuration, you don't need 
to enable any feature gate to make that possible.
-->
`PodLifecycleSleepActionAllowZero` 特性門控在 v1.33 中已升級到 Beta 階段，並且現在默認啓用。
從 Kubernetes v1.30 開始，`preStop` 和 `postStart` 回調的原始 Sleep 動作默認情況下已啓用。
使用運行 Kubernetes v1.33 的叢集時，你可以爲 Sleep 生命週期鉤子設置零持續時間。
對於採用默認設定的叢集，你無需啓用任何特性門控即可實現這一點。

<!--
## Container stop signals

Container runtimes such as containerd and CRI-O honor a `StopSignal` instruction in the container image definition. This can be used to specify a custom stop signal
that the runtime will used to terminate containers based on that image.
Stop signal configuration was not originally part of the Pod API in Kubernetes.
Until Kubernetes v1.33, the only way to override the stop signal for containers was by rebuilding your container image with the new custom stop signal
(for example, specifying `STOPSIGNAL` in a `Containerfile` or `Dockerfile`).
-->
## 容器停止信號

容器運行時如 containerd 和 CRI-O 支持容器映像檔定義中的 `StopSignal` 指令。
這可以用來指定一個自定義的停止信號，運行時將使用該信號來終止基於此映像檔的容器。
停止信號設定最初並不是 Kubernetes Pod API 的一部分。
直到 Kubernetes v1.33，覆蓋容器停止信號的唯一方法是通過使用新的自定義停止信號重建容器映像檔
（例如，在 `Containerfile` 或 `Dockerfile` 中指定 `STOPSIGNAL`）。

<!--
The `ContainerStopSignals` feature gate which is newly added in Kubernetes v1.33 adds stop signals to the Kubernetes API. This allows users to specify a custom stop signal in the container spec. Stop signals are added to the API as a new lifecycle along with the existing PreStop and PostStart lifecycle handlers. In order to use this feature, we expect the Pod to have the operating system specified with `spec.os.name`. This is enforced so that we can cross-validate the stop signal against the operating system and make sure that the containers in the Pod are created with a valid stop signal for the operating system the Pod is being scheduled to. For Pods scheduled on Windows nodes, only `SIGTERM` and `SIGKILL` are allowed as valid stop signals. Find the full list of signals supported in Linux nodes [here](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/core/v1/types.go#L2985-L3053).
-->
`ContainerStopSignals` 特性門控是 Kubernetes v1.33 新增的，
它將停止信號添加到了 Kubernetes API。這允許使用者在容器規格中指定自定義的停止信號。
停止信號作爲新生命週期加入 API，連同現有的 PreStop 和 PostStart 生命週期處理器一起使用。
要使用這個特性，Pod 需要用 `spec.os.name` 指定操作系統。這是爲了能對操作系統進行停止信號的交叉驗證，
確保 Pod 中的容器是以適合其調度操作系統的有效停止信號創建的。對於調度到 Windows 節點上的 Pod，
僅允許 `SIGTERM` 和 `SIGKILL` 作爲有效的停止信號。
[這裏](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/core/v1/types.go#L2985-L3053)可以找到
Linux 節點支持的完整信號列表。

<!--
### Default behaviour

If a container has a custom stop signal defined in its lifecycle, the container runtime would use the signal defined in the lifecycle to kill the container, given that the container runtime also supports custom stop signals. If there is no custom stop signal defined in the container lifecycle, the runtime would fallback to the stop signal defined in the container image. If there is no stop signal defined in the container image, the default stop signal of the runtime would be used. The default signal is `SIGTERM` for both containerd and CRI-O.
-->
### 默認行爲

如果容器在其生命週期中定義了自定義停止信號，那麼只要容器運行時也支持自定義停止信號，
容器運行時就會使用生命週期中定義的信號來終止容器。如果容器生命週期中沒有定義自定義停止信號，
運行時將回退到容器映像檔中定義的停止信號。如果在容器映像檔中也沒有定義停止信號，
將會使用運行時的默認停止信號。對於 containerd 和 CRI-O，默認信號都是 `SIGTERM`。

<!--
### Version skew

For the feature to work as intended, both the versions of Kubernetes and the container runtime should support container stop signals. The changes to the Kuberentes API and kubelet are available in alpha stage from v1.33, which can be enabled with the `ContainerStopSignals` feature gate. The container runtime implementations for containerd and CRI-O are still a work in progress and will be rolled out soon.
-->
### 版本偏差

爲了使該特性按預期工作，Kubernetes 和容器運行時的版本都應支持容器停止信號。
對 Kubernetes API 和 kubelet 的更改從 v1.33 開始進入 Alpha 階段，
可以通過啓用 `ContainerStopSignals` 特性門控來使用。
containerd 和 CRI-O 的容器運行時實現仍在進行中，不久將會發布。

<!--
### Using container stop signals

To enable this feature, you need to turn on the `ContainerStopSignals` feature gate in both the kube-apiserver and the kubelet. Once you have nodes where the feature gate is turned on, you can create Pods with a StopSignal lifecycle and a valid OS name like so:
-->
### 使用容器停止信號

要啓用此特性，你需要在 kube-apiserver 和 kubelet 中打開 `ContainerStopSignals` 特性門控。
一旦你在節點上啓用了特性門控，就可以創建帶有 StopSignal 生命週期和有效操作系統名稱的 Pod，如下所示：

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
請注意，此示例中的 `SIGUSR1` 信號僅在容器的 Pod 被調度到 Linux 節點時才能使用。
因此，我們需要指定 `spec.os.name` 爲 `linux` 才能使用該信號。
如果 Pod 被調度到 Windows 節點，則你只能設定 `SIGTERM` 和 `SIGKILL` 信號。
此外，如果 `spec.os.name` 字段爲 nil 或未設置，你也不能指定 `containers[*].lifecycle.stopSignal`。

<!--
## How do I get involved?

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md). If you are interested in helping develop this feature, sharing feedback, or participating in any other ongoing SIG Node projects, please reach out to us!
-->
## 我如何參與？

此特性由 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md)
推動。如果你有興趣幫助開發此特性、分享反饋或參與任何其他正在進行的 SIG Node 項目，請聯繫我們！

<!--
You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

You can also contact me directly:
- GitHub: @sreeram-venkitesh
- Slack: @sreeram.venkitesh
-->
你可以通過幾種方式聯繫 SIG Node：

- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [開放社區 Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

你也可以直接聯繫我：

- GitHub：@sreeram-venkitesh
- Slack：@sreeram.venkitesh
