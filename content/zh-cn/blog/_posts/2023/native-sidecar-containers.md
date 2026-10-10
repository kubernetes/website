---
layout: blog
title: "Kubernetes v1.28：介绍原生边车容器"
date: 2023-08-25
slug: native-sidecar-containers
---

<!--
layout: blog
title: "Kubernetes v1.28: Introducing native sidecar containers"
date: 2023-08-25
slug: native-sidecar-containers
-->

**作者**：Todd Neal (AWS), Matthias Bertschy (ARMO), Sergey Kanzhelev (Google), Gunju Kim (NAVER), Shannon Kularathna (Google)
<!--
***Authors:*** Todd Neal (AWS), Matthias Bertschy (ARMO), Sergey Kanzhelev (Google), Gunju Kim (NAVER), Shannon Kularathna (Google)
-->

<!--
This post explains how to use the new sidecar feature, which enables restartable init containers and is available in alpha in Kubernetes 1.28. We want your feedback so that we can graduate this feature as soon as possible.
-->
本文介绍了如何使用新的边车（Sidecar）功能，该功能支持可重新启动的 Init 容器，
并且在 Kubernetes 1.28 以 Alpha 版本发布。我们希望得到你的反馈，以便我们尽快完成此功能。

<!--
The concept of a “sidecar” has been part of Kubernetes since nearly the very beginning. In 2015, sidecars were described in a [blog post](/blog/2015/06/the-distributed-system-toolkit-patterns/) about composite containers as additional containers that “extend and enhance the ‘main’ container”. Sidecar containers have become a common Kubernetes deployment pattern and are often used for network proxies or as part of a logging system. Until now, sidecars were a concept that Kubernetes users applied without native support. The lack of native support has caused some usage friction, which this enhancement aims to resolve.
-->
“边车”的概念几乎从一开始就是 Kubernetes 的一部分。在 2015 年，
一篇关于复合容器的[博客文章（英文）](/blog/2015/06/the-distributed-system-toolkit-patterns/)将边车描述为“扩展和增强 ‘main’ 容器”的附加容器。
边车容器已成为一种常见的 Kubernetes 部署模式，通常用于网络代理或作为日志系统的一部分。
到目前为止，边车已经成为 Kubernetes 用户在没有原生支持情况下使用的概念。
缺乏原生支持导致了一些使用摩擦，此增强功能旨在解决这些问题。

<!--
## What are sidecar containers in 1.28?
-->
## 在 Kubernetes 1.28 中的边车容器是什么？  {#what-are-sidecar-containers-in-1-28}

<!--
Kubernetes 1.28 adds a new `restartPolicy` field to [init containers](/docs/concepts/workloads/pods/init-containers/) that is available when the `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled.
-->
Kubernetes 1.28 在 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)中添加了一个新的 `restartPolicy` 字段，
该字段在 `SidecarContainers` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)启用时可用。

```yaml
apiVersion: v1
kind: Pod
spec:
  initContainers:
  - name: secret-fetch
    image: secret-fetch:1.0
  - name: network-proxy
    image: network-proxy:1.0
    restartPolicy: Always
  containers:
  ...
```

<!--
The field is optional and, if set, the only valid value is Always. Setting this field changes the behavior of init containers as follows:
-->
该字段是可选的，如果对其设置，则唯一有效的值为 Always。设置此字段会更改 Init 容器的行为，如下所示：

<!--
- The container restarts if it exits
- Any subsequent init container starts immediately after the [startupProbe](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes) has successfully completed instead of waiting for the restartable init container to exit
- The resource usage calculation changes for the pod as restartable init container resources are now added to the sum of the resource requests by the main containers
-->
- 如果容器退出则会重新启动
- 任何后续的 Init 容器在 [startupProbe](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes)
  成功完成后立即启动，而不是等待可重新启动 Init 容器退出
- 由于可重新启动的 Init 容器资源现在添加到主容器的资源请求总和中，所以 Pod 使用的资源计算发生了变化。

<!--
[Pod termination](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) continues to only depend on the main containers. An init container with a `restartPolicy` of `Always` (named a sidecar) won't prevent the pod from terminating after the main containers exit.
-->
[Pod 终止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)继续仅依赖于主容器。
`restartPolicy` 为 `Always` 的 Init 容器（称为边车）不会阻止 Pod 在主容器退出后终止。

<!--
The following properties of restartable init containers make them ideal for the sidecar deployment pattern:
-->
可重新启动的 Init 容器的以下属性使其非常适合边车部署模式：

<!--
- Init containers have a well-defined startup order regardless of whether you set a `restartPolicy`, so you can ensure that your sidecar starts before any container declarations that come after the sidecar declaration in your manifest.
- Sidecar containers don't extend the lifetime of the Pod, so you can use them in short-lived Pods with no changes to the Pod lifecycle.
- Sidecar containers are restarted on exit, which improves resilience and lets you use sidecars to provide services that your main containers can more reliably consume.
-->
- 无论你是否设置 `restartPolicy`，初始化容器都有一个明确定义的启动顺序，
  因此你可以确保你的边车在其所在清单中声明的后续任何容器之前启动。
- 边车容器不会延长 Pod 的生命周期，因此你可以在短生命周期的 Pod 中使用它们，而不会对 Pod 生命周期产生改变。
- 边车容器在退出时将被重新启动，这提高了弹性，并允许你使用边车来为主容器提供更可靠地服务。

<!--
## When to use sidecar containers
-->
## 何时要使用边车容器 {#when-to-use-sidecar-containers}

<!--
You might find built-in sidecar containers useful for workloads such as the following:
-->
你可能会发现内置边车容器对于以下工作负载很有用：

<!--
- **Batch or AI/ML workloads**, or other Pods that run to completion. These workloads will experience the most significant benefits.
- **Network proxies** that start up before any other container in the manifest. Every other container that runs can use the proxy container's services. For instructions, see the [Kubernetes Native sidecars in Istio blog post](https://istio.io/latest/blog/2023/native-sidecars/).
- **Log collection containers**, which can now start before any other container and run until the Pod terminates. This improves the reliability of log collection in your Pods.
- **Jobs**, which can use sidecars for any purpose without Job completion being blocked by the running sidecar. No additional configuration is required to ensure this behavior.
-->
- **批量或 AI/ML 工作负载**，或已运行完成的其他 Pod。这些工作负载将获得最显着的好处。
- 任何在清单中其他容器之前启动的**网络代理**。所有运行的其他容器都可以使用代理容器的服务。
  有关说明，请参阅[在 Istio 中使用 Kubernetes 原生 Sidecar](https://istio.io/latest/blog/2023/native-sidecars/)。
- **日志收集容器**，现在可以在任何其他容器之前启动并运行直到 Pod 终止。这提高了 Pod 中日志收集的可靠性。
- **Job**，可以将边车用于任何目的，而 Job 完成不会被正在运行的边车阻止。无需额外配置即可确保此行为。

<!--
## How did users get sidecar behavior before 1.28?
-->
## 1.28 之前用户如何获得 Sidecar 行为？ {#how-did-users-get-sidecar-behavior-before-1-28}

<!--
Prior to the sidecar feature, the following options were available for implementing sidecar behavior depending on the desired lifetime of the sidecar container:
-->
在边车功能出现之前，可以使用以下选项来根据边车容器的所需生命周期来实现边车行为：

<!--
- **Lifetime of sidecar less than Pod lifetime**: Use an init container, which provides well-defined startup order. However, the sidecar has to exit for other init containers and main Pod containers to start.
- **Lifetime of sidecar equal to Pod lifetime**: Use a main container that runs alongside your workload containers in the Pod. This method doesn't give you control over startup order, and lets the sidecar container potentially block Pod termination after the workload containers exit.
-->
- **边车的生命周期小于 Pod 生命周期**：使用 Init 容器，它提供明确定义的启动顺序。
  然而，边车必须退出才能让其他 Init 容器和主 Pod 容器启动。
- **边车的生命周期等于 Pod 生命周期**：使用与 Pod 中的工作负载容器一起运行的主容器。
  此方法无法让你控制启动顺序，并让边车容器可能会在工作负载容器退出后阻止 Pod 终止。

<!--
The built-in sidecar feature solves for the use case of having a lifetime equal to the Pod lifetime and has the following additional benefits:
-->
内置的边车功能解决了其生命周期与 Pod 生命周期相同的用例，并具有以下额外优势：

<!--
- Provides control over startup order
- Doesn’t block Pod termination
-->
- 提供对启动顺序的控制
- 不阻碍 Pod 终止

<!--
## Transitioning existing sidecars to the new model
-->
## 将现有边车过渡到新模式 {#transitioning-existing-sidecars-to-the-new-model}

<!--
We recommend only using the sidecars feature gate in [short lived testing clusters](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages) at the alpha stage. If you have an existing sidecar that is configured as a main container so it can run for the lifetime of the pod, it can be moved to the `initContainers` section of the pod spec and given a `restartPolicy` of `Always`. In many cases, the sidecar should work as before with the added benefit of having a defined startup ordering and not prolonging the pod lifetime.
-->
我们建议仅在 Alpha 阶段的[短期测试集群](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)中使用边车功能。
如果你有一个现有的边车，被配置为主容器，以便它可以在 Pod 的生命周期内运行，
则可以将其移至 Pod 规范的 `initContainers` 部分，并将 `restartPolicy` 指定为 `Always`。
在许多情况下，边车应该像以前一样工作，并具有定义启动顺序且不会延长 Pod 生命周期的额外好处。

<!--
## Known issues
-->
## 已知问题 {#known-issues}

<!--
The alpha release of built-in sidecar containers has the following known issues, which we'll resolve before graduating the feature to beta:
-->
内置边车容器的 Alpha 版本具有以下已知问题，我们将在该功能升级为 Beta 之前解决这些问题：

<!--
- The CPU, memory, device, and topology manager are unaware of the sidecar container lifetime and additional resource usage, and will operate as if the Pod had lower resource requests than it actually does.
- The output of `kubectl describe node` is incorrect when sidecars are in use. The output shows resource usage that's lower than the actual usage because it doesn't use the new resource usage calculation for sidecar containers.
-->
- CPU、内存、设备和拓扑管理器不知道边车容器的生命周期和额外的资源使用情况，并且会像 Pod 的资源请求低于实际情况的方式运行。
- 使用边车时，`kubectl describe node` 的输出不正确。输出显示的资源使用量低于实际使用量，
  因为它没有对边车容器使用新的资源使用计算方式。

<!--
## We need your feedback!
-->
## 我们需要你的反馈！ {#we-need-your-feedback}

<!--
In the alpha stage, we want you to try out sidecar containers in your environments and open issues if you encounter bugs or friction points. We're especially interested in feedback about the following:
-->
在 Alpha 阶段，我们希望你在环境中尝试边车容器，并在遇到错误或摩擦点时提出问题。我们对以下方面的反馈特别感兴趣：

<!--
- The shutdown sequence, especially with multiple sidecars running 
- The backoff timeout adjustment for crashing sidecars 
- The behavior of Pod readiness and liveness probes when sidecars are running
-->
- 关闭顺序，尤其是多个边车运行时
- 碰撞边车的退避超时调整
- 边车运行时 Pod 就绪性和活性探测的行为

<!--
To open an issue, see the [Kubernetes GitHub repository](https://github.com/kubernetes/kubernetes/issues/new/choose).
-->
要提出问题，请参阅 [Kubernetes GitHub 存储库](https://github.com/kubernetes/kubernetes/issues/new/choose)。

<!--
## What’s next?
-->
## 接下来是什么？ {#what-s-next}

<!--
In addition to the known issues that will be resolved, we're working on adding termination ordering for sidecar and main containers. This will ensure that sidecar containers only terminate after the Pod's main containers have exited.
-->
除了将要解决的已知问题之外，我们正在努力为边车和主容器添加终止顺序。这将确保边车容器仅在 Pod 主容器退出后终止。

<!--
We’re excited to see the sidecar feature come to Kubernetes and are interested in feedback.
-->
我们很高兴看到 Kubernetes 引入了边车功能，并期望得到反馈。

<!--
## Acknowledgements
-->
## 致谢 {#acknowledgements}

<!--
Many years have passed since the original KEP was written, so we apologize if we omit anyone who worked on this feature over the years. This is a best-effort attempt to recognize the people involved in this effort.
-->
自从最初的 KEP 编写以来已经过去了很多年，因此如果我们遗漏了多年来致力于此功能的任何人，我们将深表歉意。
这也是识别该功能参与者的最大限度努力。

<!--
- [mrunalp](https://github.com/mrunalp/) for design discussions and reviews
- [thockin](https://github.com/thockin/) for API discussions and support thru years
- [bobbypage](https://github.com/bobbypage) for reviews
- [smarterclayton](https://github.com/smarterclayton) for detailed review and feedback
- [howardjohn](https://github.com/howardjohn) for feedback over years and trying it early during implementation
- [derekwaynecarr](https://github.com/derekwaynecarr) and [dchen1107](https://github.com/dchen1107) for leadership
- [jpbetz](https://github.com/Jpbetz) for API and termination ordering designs as well as code reviews
- [Joseph-Irving](https://github.com/Joseph-Irving) and [rata](https://github.com/rata) for the early iterations design and reviews years back
- [swatisehgal](https://github.com/swatisehgal) and [ffromani](https://github.com/ffromani) for early feedback on resource managers impact
- [alculquicondor](https://github.com/Alculquicondor) for feedback on addressing the version skew of the scheduler
- [wojtek-t](https://github.com/Wojtek-t) for PRR review of a KEP
- [ahg-g](https://github.com/ahg-g) for reviewing the scheduler portion of a KEP
- [adisky](https://github.com/Adisky) for the Job completion issue
-->
- [mrunalp](https://github.com/mrunalp/) 对于设计的探讨和评论
- [thockin](https://github.com/thockin/) 多年来对于 API 的讨论和支持
- [bobbypage](https://github.com/bobbypage) 的审查工作
- [smarterclayton](https://github.com/smarterclayton) 进行详细审查和反馈
- [howardjohn](https://github.com/howardjohn) 多年来进行的反馈以及在实施过程中的早期尝试
- [derekwaynecarr](https://github.com/derekwaynecarr) 和 [dchen1107](https://github.com/dchen1107) 的领导力
- [jpbetz](https://github.com/Jpbetz) 对 API 和终止排序的设计以及代码审查
- [Joseph-Irving](https://github.com/Joseph-Irving) 和 [rata](https://github.com/rata) 对于多年前的早期迭代设计和审查
- [swatisehgal](https://github.com/swatisehgal) 和 [ffromani](https://github.com/ffromani)
  对于有关资源管理器影响的早期反馈
- [alculquicondor](https://github.com/Alculquicondor) 对于解决调度程序版本偏差的相关反馈
- [wojtek-t](https://github.com/Wojtek-t) 对于 KEP 的 PRR 进行审查
- [ahg-g](https://github.com/ahg-g) 对于 KEP 的调度程序部分进行审查
- [adisky](https://github.com/Adisky) 处理了 Job 完成问题

<!--
## More Information
-->
## 更多内容 {#more-information}

<!--
- Read [API for sidecar containers](/docs/concepts/workloads/pods/init-containers/#api-for-sidecar-containers) in the Kubernetes documentation
- Read the [Sidecar KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/753-sidecar-containers/README.md)
-->
- 阅读 Kubernetes 文档中的[边车容器 API](/zh-cn/docs/concepts/workloads/pods/init-containers/#api-for-sidecar-containers)
- 阅读[边车 KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/753-sidecar-containers/README.md)
