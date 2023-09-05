---
layout: blog
title: "Kubernetes 1.28：介绍原生 Sidecar 容器"
date: 2023-08-25
slug: native-sidecar-containers
---

<!-- 
layout: blog
title: "Kubernetes v1.28: Introducing native sidecar containers"
date: 2023-08-25
slug: native-sidecar-containers 
-->

<!-- 
***Authors:*** Todd Neal (AWS), Matthias Bertschy (ARMO), Sergey Kanzhelev (Google), Gunju Kim (NAVER), Shannon Kularathna (Google) 
-->

***作者*** Todd Neal (AWS), Matthias Bertschy (ARMO), Sergey Kanzhelev (Google), Gunju Kim (NAVER), Shannon Kularathna (Google)

<!-- 
This post explains how to use the new sidecar feature, which enables restartable init containers and is available in alpha in Kubernetes 1.28. We want your feedback so that we can graduate this feature as soon as possible. 
-->
本文介绍如何使用新的边车特性，该特性允许设置可重新启动的 Init 容器，并已在 Kubernetes 1.28 中以 Alpha 状态提供。我们希望听取你的反馈，以便尽快将此功能推进到毕业阶段。

<!-- 
The concept of a “sidecar” has been part of Kubernetes since nearly the very beginning. In 2015, sidecars were described in a [blog post](/blog/2015/06/the-distributed-system-toolkit-patterns/) about composite containers as additional containers that “extend and enhance the ‘main’ container”. Sidecar containers have become a common Kubernetes deployment pattern and are often used for network proxies or as part of a logging system. Until now, sidecars were a concept that Kubernetes users applied without native support. The lack of native support has caused some usage friction, which this enhancement aims to resolve.
 -->
“边车（Sidecar）” 的概念几乎从一开始就是 Kubernetes 的一部分。
2015 年，一篇关于边车容器的 [博客文章](/blog/2015/06/the-distributed-system-toolkit-patterns/) 将边车描述为“扩展和增强‘主’容器”的附加容器。
边车容器已成为一种常见的 Kubernetes 部署模式，通常用于网络代理或作为日志系统的一部分。
到目前为止，边车一直是 Kubernetes 用户在缺少原生支持的情况下应用的概念。
缺乏原生支持也导致了一些使用摩擦，此增强功能旨在解决这些问题。

<!-- 
## What are sidecar containers in 1.28? 
-->
## 在 Kubernetes 1.28 中的边车容器是什么？

<!-- 
Kubernetes 1.28 adds a new `restartPolicy` field to [init containers](/docs/concepts/workloads/pods/init-containers/) that is available when the `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled. 
-->
Kubernetes 1.28 在 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/) 
中添加了一个新的 `restartPolicy` 字段，该字段可以在 `SidecarContainers` 
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) 启用时使用。

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
该字段是可选的，如果设置，则唯一有效的值为 Always。设置此字段会更改 Init 容器的行为，如下所示：

<!-- 
- The container restarts if it exits
- Any subsequent init container starts immediately after the [startupProbe](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes) has successfully completed instead of waiting for the restartable init container to exit
- The resource usage calculation changes for the pod as restartable init container resources are now added to the sum of the resource requests by the main containers 
-->
- 如果容器退出则重新启动
- 所有后续的 Init 容器在 [startupProbe](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes) 
成功完成后立即启动，而不是等待可重新启动的 Init 容器退出
- Pod 的资源使用计算发生变化，因为可重新启动的 Init 容器资源现在添加到主容器的资源请求总和中

<!--
[Pod termination](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) continues to only depend on the main containers. An init container with a `restartPolicy` of `Always` (named a sidecar) won't prevent the pod from terminating after the main containers exit. 
-->
[Pod 终止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) 继续只根据主容器来判定。 
`restartPolicy` 为 `Always` 的所有 Init 容器（称为 Sidecar）不会阻止 Pod 在主容器退出后进入终止状态。


<!-- 
The following properties of restartable init containers make them ideal for the sidecar deployment pattern: 
-->
可重新启动的 Init 容器的以下属性使其非常适合边车部署模式：

<!-- 
- Init containers have a well-defined startup order regardless of whether you set a `restartPolicy`, so you can ensure that your sidecar starts before any container declarations that come after the sidecar declaration in your manifest.
- Sidecar containers don't extend the lifetime of the Pod, so you can use them in short-lived Pods with no changes to the Pod lifecycle.
- Sidecar containers are restarted on exit, which improves resilience and lets you use sidecars to provide services that your main containers can more reliably consume. 
-->
- 不管你是否设置了 `restartPolicy`，Init 容器都有明确定义的启动顺序。
因此，你可以确保清单中的边车容器会在边车声明之后的所有容器之前启动。
- 边车容器不会延长 Pod 的生命周期，因此你可以在生命期较短的 Pod 中使用
它们，而无需更改 Pod 生命周期。
- 边车容器在退出时会重新启动，这提高了可靠性，从而允许你使用边车来为主容器提供更为可靠的服务。


<!-- 
## When to use sidecar containers 
-->
## 何时使用边车容器

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
- **批处理或 AI/ML 工作负载**，或运行一段时间就结束的其他 Pod。这些工作负载将获得最显著的好处。
- 在清单中的所有其他容器之前启动的**网络代理**。所运行的所有其他容器都可以使用代理容器的服务。
有关说明，请参阅 [Istio 中的 Kubernetes 原生边车容器博客文章](https://istio.io/latest/blog/2023/native-sidecars/)。
- **日志收集容器**，现在可以在任何其他容器之前启动并运行至 Pod 终止。这提高了 Pod 中日志收集的可靠性。
- **作业**，可以将边车用于任何目的，而 Job 的完成不会被正在运行的边车所阻止。无需额外配置即可确保此行为。


<!-- 
## How did users get sidecar behavior before 1.28? 
-->
## 1.28 之前用户是如何实现边车行为的？

<!-- 
Prior to the sidecar feature, the following options were available for implementing sidecar behavior depending on the desired lifetime of the sidecar container: 
-->
在引入边车特性之前，可以使用以下选项来根据边车容器的预期生命周期来实现边车行为：

<!-- 
- **Lifetime of sidecar less than Pod lifetime**: Use an init container, which provides well-defined startup order. However, the sidecar has to exit for other init containers and main Pod containers to start.
- **Lifetime of sidecar equal to Pod lifetime**: Use a main container that runs alongside your workload containers in the Pod. This method doesn't give you control over startup order, and lets the sidecar container potentially block Pod termination after the workload containers exit. 
-->
- **边车的生命周期小于 Pod 生命周期**：使用 Init 容器，这类容器提供明确定义的启动顺序。
  然而边车必须退出，才能让其他 Init 容器和主 Pod 容器启动。
- **边车的生命周期与 Pod 生命周期相同**：使用与 Pod 中的工作负载容器一起运行的主容器。此方法无法让你控制启动顺序，并且边车容器可能会在工作负载容器退出后阻止 Pod 终止。


<!-- 
The built-in sidecar feature solves for the use case of having a lifetime equal to the Pod lifetime and has the following additional benefits: 
-->
内置的边车特性解决了生命周期与 Pod 生命周期相同的场景，并具有以下额外优势：


<!-- 
- Provides control over startup order
- Doesn’t block Pod termination 
-->
- 提供对启动顺序的控制 
- 不阻止 Pod 终止

<!-- 
## Transitioning existing sidecars to the new model 
-->
## 将现有边车过渡到新模型

<!-- 
We recommend only using the sidecars feature gate in [short lived testing clusters](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages) at the alpha stage. If you have an existing sidecar that is configured as a main container so it can run for the lifetime of the pod, it can be moved to the `initContainers` section of the pod spec and given a `restartPolicy` of `Always`. In many cases, the sidecar should work as before with the added benefit of having a defined startup ordering and not prolonging the pod lifetime. 
-->

我们建议在 Alpha 阶段仅对[短期存在的测试集群](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)启用边车特性门控。
如果你已经有一个被配置为主容器的边车，且它可以在 Pod 的整个生命周期内运行，
则可以将其移至 Pod 规约的 `initContainers` 部分，并将 `restartPolicy` 设置为 `Always`。
在许多情况下，边车容器能够继续像以前一样工作，并且额外的好处是可以定义启动顺序，并且不会延长 Pod 的生命周期。


<!-- 
## Known issues 
-->
##  已知的问题

<!-- 
The alpha release of built-in sidecar containers has the following known issues, which we'll resolve before graduating the feature to beta: 
-->
内置的边车容器的 Alpha 版本具有以下已知问题，我们将在将该功能升级为 Beta 之前解决这些问题：

<!-- 
- The CPU, memory, device, and topology manager are unaware of the sidecar container lifetime and additional resource usage, and will operate as if the Pod had lower resource requests than it actually does.
- The output of `kubectl describe node` is incorrect when sidecars are in use. The output shows resource usage that's lower than the actual usage because it doesn't use the new resource usage calculation for sidecar containers. 
-->
- CPU、内存、设备和拓扑管理器无法意识到边车容器的生命周期和额外资源使用情况，它们会按照 Pod 资源请求比实际用量低的假设来运行 Pod。
- 使用边车时，`kubectl describe node` 命令描述的节点的输出不正确。
  输出显示的资源使用量低于实际使用量，因为它没有计算边车容器的资源使用量。

<!-- 
## We need your feedback! 
-->
## 我们需要你的反馈！

<!-- 
In the alpha stage, we want you to try out sidecar containers in your environments and open issues if you encounter bugs or friction points. We're especially interested in feedback about the following: 
-->
在 Alpha 阶段，我们希望你在你的环境中尝试边车容器，并在遇到错误或异常点时登记问题。
我们对以下方面的反馈特别感兴趣：

<!-- 
- The shutdown sequence, especially with multiple sidecars running 
- The backoff timeout adjustment for crashing sidecars 
- The behavior of Pod readiness and liveness probes when sidecars are running 
-->
- 关闭顺序，尤其是多个边车一起运行的时候
- 边车的重启回退超时时间调整
- 边车运行时 Pod 就绪性和存活性探针的行为


<!-- 
To open an issue, see the [Kubernetes GitHub repository](https://github.com/kubernetes/kubernetes/issues/new/choose). 
-->
要登记问题，请访问 [Kubernetes GitHub 仓库](https://github.com/kubernetes/kubernetes/issues/new/choose)。

<!-- 
## What’s next? 
-->
## 下一步是什么？

<!-- 
In addition to the known issues that will be resolved, we're working on adding termination ordering for sidecar and main containers. This will ensure that sidecar containers only terminate after the Pod's main containers have exited. 
-->
除了要解决的已知问题之外，我们正在努力为边车和主容器添加终止顺序。终止顺序能够确保边车容器仅在 Pod 的主容器退出后才终止。


<!-- 
We’re excited to see the sidecar feature come to Kubernetes and are interested in feedback. 
-->
我们很高兴看到 Kubernetes 引入了边车特性，并对反馈感兴趣。

<!-- 
## Acknowledgements 
-->
## 致谢

<!-- 
Many years have passed since the original KEP was written, so we apologize if we omit anyone who worked on this feature over the years. This is a best-effort attempt to recognize the people involved in this effort. 
-->
自最初的 KEP 编写以来已经过去了很多年，因此如果我们漏掉了多年来致力于此特性的相关人员，请接受我们的道歉。我们尽最大努力去认可参与这项工作的人们。


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

- [mrunalp](https://github.com/mrunalp/) 参与了设计讨论和评审 
- [thockin](https://github.com/thockin/) 多年来的 API 讨论和支持 
- [bobbypage](https://github.com/bobbypage) 的评审
- [smarterclayton](https://github.com/smarterclayton) 的细致评审和反馈
- [howardjohn](https://github.com/howardjohn) 多年来的反馈以及在实现过程中的早期尝试
- [derekwaynecarr](https://github.com/derekwaynecarr) 和 [dchen1107](https://github.com/dchen1107) 的领导
- [jpbetz](https://github.com/Jpbetz) 对 API 和终止排序的设计以及代码评审
- [Joseph-Irving](https://github.com/Joseph-Irving) 和 [rata](https://github.com/rata) 参与多年前的早期迭代设计和评审
- [swatisehgal](https://github.com/swatisehgal) 和 [ffromani](https://github.com/ffromani) 针对有关资源管理器影响所给出的早期反馈 
- [alculquicondor](https://github.com/Alculquicondor) 针对与调度程序版本偏差相关的反馈  - [wojtek-t](https://github.com/Wojtek-t) 对 KEP 的 PRR 的评审
- [ahg-g](https://github.com/ahg-g) 对 KEP 的调度器部分的评审
- [adisky](https://github.com/Adisky) 解决作业完成问题



<!-- 
## More Information 
-->
## 更多信息

<!-- 
- Read [API for sidecar containers](/docs/concepts/workloads/pods/init-containers/#api-for-sidecar-containers) in the Kubernetes documentation
- Read the [Sidecar KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/753-sidecar-containers/README.md) 
-->
- 阅读 Kubernetes 文档中的[边车容器 API](/zh-cn/docs/concepts/workloads/pods/init-containers/#api-for-sidecar-containers) 
- 阅读 [Sidecar KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/753-sidecar-containers/README.md)

