---
layout: blog
title: "Kubernetes v1.28：介紹原生邊車容器"
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
本文介紹瞭如何使用新的邊車（Sidecar）功能，該功能支持可重新啓動的 Init 容器，
並且在 Kubernetes 1.28 以 Alpha 版本發佈。我們希望得到你的反饋，以便我們儘快完成此功能。

<!--
The concept of a “sidecar” has been part of Kubernetes since nearly the very beginning. In 2015, sidecars were described in a [blog post](/blog/2015/06/the-distributed-system-toolkit-patterns/) about composite containers as additional containers that “extend and enhance the ‘main’ container”. Sidecar containers have become a common Kubernetes deployment pattern and are often used for network proxies or as part of a logging system. Until now, sidecars were a concept that Kubernetes users applied without native support. The lack of native support has caused some usage friction, which this enhancement aims to resolve.
-->
“邊車”的概念幾乎從一開始就是 Kubernetes 的一部分。在 2015 年，
一篇關於複合容器的[博客文章（英文）](/blog/2015/06/the-distributed-system-toolkit-patterns/)將邊車描述爲“擴展和增強 ‘main’ 容器”的附加容器。
邊車容器已成爲一種常見的 Kubernetes 部署模式，通常用於網路代理或作爲日誌系統的一部分。
到目前爲止，邊車已經成爲 Kubernetes 使用者在沒有原生支持情況下使用的概念。
缺乏原生支持導致了一些使用摩擦，此增強功能旨在解決這些問題。

<!--
## What are sidecar containers in 1.28?
-->
## 在 Kubernetes 1.28 中的邊車容器是什麼？  {#what-are-sidecar-containers-in-1-28}

<!--
Kubernetes 1.28 adds a new `restartPolicy` field to [init containers](/docs/concepts/workloads/pods/init-containers/) that is available when the `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled.
-->
Kubernetes 1.28 在 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)中添加了一個新的 `restartPolicy` 字段，
該字段在 `SidecarContainers` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)啓用時可用。

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
該字段是可選的，如果對其設置，則唯一有效的值爲 Always。設置此字段會更改 Init 容器的行爲，如下所示：

<!--
- The container restarts if it exits
- Any subsequent init container starts immediately after the [startupProbe](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes) has successfully completed instead of waiting for the restartable init container to exit
- The resource usage calculation changes for the pod as restartable init container resources are now added to the sum of the resource requests by the main containers
-->
- 如果容器退出則會重新啓動
- 任何後續的 Init 容器在 [startupProbe](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes)
  成功完成後立即啓動，而不是等待可重新啓動 Init 容器退出
- 由於可重新啓動的 Init 容器資源現在添加到主容器的資源請求總和中，所以 Pod 使用的資源計算發生了變化。

<!--
[Pod termination](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) continues to only depend on the main containers. An init container with a `restartPolicy` of `Always` (named a sidecar) won't prevent the pod from terminating after the main containers exit.
-->
[Pod 終止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)繼續僅依賴於主容器。
`restartPolicy` 爲 `Always` 的 Init 容器（稱爲邊車）不會阻止 Pod 在主容器退出後終止。

<!--
The following properties of restartable init containers make them ideal for the sidecar deployment pattern:
-->
可重新啓動的 Init 容器的以下屬性使其非常適合邊車部署模式：

<!--
- Init containers have a well-defined startup order regardless of whether you set a `restartPolicy`, so you can ensure that your sidecar starts before any container declarations that come after the sidecar declaration in your manifest.
- Sidecar containers don't extend the lifetime of the Pod, so you can use them in short-lived Pods with no changes to the Pod lifecycle.
- Sidecar containers are restarted on exit, which improves resilience and lets you use sidecars to provide services that your main containers can more reliably consume.
-->
- 無論你是否設置 `restartPolicy`，初始化容器都有一個明確定義的啓動順序，
  因此你可以確保你的邊車在其所在清單中聲明的後續任何容器之前啓動。
- 邊車容器不會延長 Pod 的生命週期，因此你可以在短生命週期的 Pod 中使用它們，而不會對 Pod 生命週期產生改變。
- 邊車容器在退出時將被重新啓動，這提高了彈性，並允許你使用邊車來爲主容器提供更可靠地服務。

<!--
## When to use sidecar containers
-->
## 何時要使用邊車容器 {#when-to-use-sidecar-containers}

<!--
You might find built-in sidecar containers useful for workloads such as the following:
-->
你可能會發現內置邊車容器對於以下工作負載很有用：

<!--
- **Batch or AI/ML workloads**, or other Pods that run to completion. These workloads will experience the most significant benefits.
- **Network proxies** that start up before any other container in the manifest. Every other container that runs can use the proxy container's services. For instructions, see the [Kubernetes Native sidecars in Istio blog post](https://istio.io/latest/blog/2023/native-sidecars/).
- **Log collection containers**, which can now start before any other container and run until the Pod terminates. This improves the reliability of log collection in your Pods.
- **Jobs**, which can use sidecars for any purpose without Job completion being blocked by the running sidecar. No additional configuration is required to ensure this behavior.
-->
- **批量或 AI/ML 工作負載**，或已運行完成的其他 Pod。這些工作負載將獲得最顯着的好處。
- 任何在清單中其他容器之前啓動的**網路代理**。所有運行的其他容器都可以使用代理容器的服務。
  有關說明，請參閱[在 Istio 中使用 Kubernetes 原生 Sidecar](https://istio.io/latest/blog/2023/native-sidecars/)。
- **日誌收集容器**，現在可以在任何其他容器之前啓動並運行直到 Pod 終止。這提高了 Pod 中日誌收集的可靠性。
- **Job**，可以將邊車用於任何目的，而 Job 完成不會被正在運行的邊車阻止。無需額外設定即可確保此行爲。

<!--
## How did users get sidecar behavior before 1.28?
-->
## 1.28 之前使用者如何獲得 Sidecar 行爲？ {#how-did-users-get-sidecar-behavior-before-1-28}

<!--
Prior to the sidecar feature, the following options were available for implementing sidecar behavior depending on the desired lifetime of the sidecar container:
-->
在邊車功能出現之前，可以使用以下選項來根據邊車容器的所需生命週期來實現邊車行爲：

<!--
- **Lifetime of sidecar less than Pod lifetime**: Use an init container, which provides well-defined startup order. However, the sidecar has to exit for other init containers and main Pod containers to start.
- **Lifetime of sidecar equal to Pod lifetime**: Use a main container that runs alongside your workload containers in the Pod. This method doesn't give you control over startup order, and lets the sidecar container potentially block Pod termination after the workload containers exit.
-->
- **邊車的生命週期小於 Pod 生命週期**：使用 Init 容器，它提供明確定義的啓動順序。
  然而，邊車必須退出才能讓其他 Init 容器和主 Pod 容器啓動。
- **邊車的生命週期等於 Pod 生命週期**：使用與 Pod 中的工作負載容器一起運行的主容器。
  此方法無法讓你控制啓動順序，並讓邊車容器可能會在工作負載容器退出後阻止 Pod 終止。

<!--
The built-in sidecar feature solves for the use case of having a lifetime equal to the Pod lifetime and has the following additional benefits:
-->
內置的邊車功能解決了其生命週期與 Pod 生命週期相同的用例，並具有以下額外優勢：

<!--
- Provides control over startup order
- Doesn’t block Pod termination
-->
- 提供對啓動順序的控制
- 不阻礙 Pod 終止

<!--
## Transitioning existing sidecars to the new model
-->
## 將現有邊車過渡到新模式 {#transitioning-existing-sidecars-to-the-new-model}

<!--
We recommend only using the sidecars feature gate in [short lived testing clusters](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages) at the alpha stage. If you have an existing sidecar that is configured as a main container so it can run for the lifetime of the pod, it can be moved to the `initContainers` section of the pod spec and given a `restartPolicy` of `Always`. In many cases, the sidecar should work as before with the added benefit of having a defined startup ordering and not prolonging the pod lifetime.
-->
我們建議僅在 Alpha 階段的[短期測試叢集](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)中使用邊車功能。
如果你有一個現有的邊車，被設定爲主容器，以便它可以在 Pod 的生命週期內運行，
則可以將其移至 Pod 規範的 `initContainers` 部分，並將 `restartPolicy` 指定爲 `Always`。
在許多情況下，邊車應該像以前一樣工作，並具有定義啓動順序且不會延長 Pod 生命週期的額外好處。

<!--
## Known issues
-->
## 已知問題 {#known-issues}

<!--
The alpha release of built-in sidecar containers has the following known issues, which we'll resolve before graduating the feature to beta:
-->
內置邊車容器的 Alpha 版本具有以下已知問題，我們將在該功能升級爲 Beta 之前解決這些問題：

<!--
- The CPU, memory, device, and topology manager are unaware of the sidecar container lifetime and additional resource usage, and will operate as if the Pod had lower resource requests than it actually does.
- The output of `kubectl describe node` is incorrect when sidecars are in use. The output shows resource usage that's lower than the actual usage because it doesn't use the new resource usage calculation for sidecar containers.
-->
- CPU、內存、設備和拓撲管理器不知道邊車容器的生命週期和額外的資源使用情況，並且會像 Pod 的資源請求低於實際情況的方式運行。
- 使用邊車時，`kubectl describe node` 的輸出不正確。輸出顯示的資源使用量低於實際使用量，
  因爲它沒有對邊車容器使用新的資源使用計算方式。

<!--
## We need your feedback!
-->
## 我們需要你的反饋！ {#we-need-your-feedback}

<!--
In the alpha stage, we want you to try out sidecar containers in your environments and open issues if you encounter bugs or friction points. We're especially interested in feedback about the following:
-->
在 Alpha 階段，我們希望你在環境中嘗試邊車容器，並在遇到錯誤或摩擦點時提出問題。我們對以下方面的反饋特別感興趣：

<!--
- The shutdown sequence, especially with multiple sidecars running 
- The backoff timeout adjustment for crashing sidecars 
- The behavior of Pod readiness and liveness probes when sidecars are running
-->
- 關閉順序，尤其是多個邊車運行時
- 碰撞邊車的退避超時調整
- 邊車運行時 Pod 就緒性和活性探測的行爲

<!--
To open an issue, see the [Kubernetes GitHub repository](https://github.com/kubernetes/kubernetes/issues/new/choose).
-->
要提出問題，請參閱 [Kubernetes GitHub 存儲庫](https://github.com/kubernetes/kubernetes/issues/new/choose)。

<!--
## What’s next?
-->
## 接下來是什麼？ {#what-s-next}

<!--
In addition to the known issues that will be resolved, we're working on adding termination ordering for sidecar and main containers. This will ensure that sidecar containers only terminate after the Pod's main containers have exited.
-->
除了將要解決的已知問題之外，我們正在努力爲邊車和主容器添加終止順序。這將確保邊車容器僅在 Pod 主容器退出後終止。

<!--
We’re excited to see the sidecar feature come to Kubernetes and are interested in feedback.
-->
我們很高興看到 Kubernetes 引入了邊車功能，並期望得到反饋。

<!--
## Acknowledgements
-->
## 致謝 {#acknowledgements}

<!--
Many years have passed since the original KEP was written, so we apologize if we omit anyone who worked on this feature over the years. This is a best-effort attempt to recognize the people involved in this effort.
-->
自從最初的 KEP 編寫以來已經過去了很多年，因此如果我們遺漏了多年來致力於此功能的任何人，我們將深表歉意。
這也是識別該功能參與者的最大限度努力。

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
- [mrunalp](https://github.com/mrunalp/) 對於設計的探討和評論
- [thockin](https://github.com/thockin/) 多年來對於 API 的討論和支持
- [bobbypage](https://github.com/bobbypage) 的審查工作
- [smarterclayton](https://github.com/smarterclayton) 進行詳細審查和反饋
- [howardjohn](https://github.com/howardjohn) 多年來進行的反饋以及在實施過程中的早期嘗試
- [derekwaynecarr](https://github.com/derekwaynecarr) 和 [dchen1107](https://github.com/dchen1107) 的領導力
- [jpbetz](https://github.com/Jpbetz) 對 API 和終止排序的設計以及代碼審查
- [Joseph-Irving](https://github.com/Joseph-Irving) 和 [rata](https://github.com/rata) 對於多年前的早期迭代設計和審查
- [swatisehgal](https://github.com/swatisehgal) 和 [ffromani](https://github.com/ffromani)
  對於有關資源管理器影響的早期反饋
- [alculquicondor](https://github.com/Alculquicondor) 對於解決調度程序版本偏差的相關反饋
- [wojtek-t](https://github.com/Wojtek-t) 對於 KEP 的 PRR 進行審查
- [ahg-g](https://github.com/ahg-g) 對於 KEP 的調度程序部分進行審查
- [adisky](https://github.com/Adisky) 處理了 Job 完成問題

<!--
## More Information
-->
## 更多內容 {#more-information}

<!--
- Read [API for sidecar containers](/docs/concepts/workloads/pods/init-containers/#api-for-sidecar-containers) in the Kubernetes documentation
- Read the [Sidecar KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/753-sidecar-containers/README.md)
-->
- 閱讀 Kubernetes 文檔中的[邊車容器 API](/zh-cn/docs/concepts/workloads/pods/init-containers/#api-for-sidecar-containers)
- 閱讀[邊車 KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/753-sidecar-containers/README.md)
