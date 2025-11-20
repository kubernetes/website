---
layout: blog
title: 'Kubernetes v1.12: RuntimeClass 簡介'
date: 2018-10-10
slug: kubernetes-v1.12-introducing-runtimeclass
---
<!--
layout: blog
title: 'Kubernetes v1.12: Introducing RuntimeClass'
date: 2018-10-10
-->

<!--
**Author**: Tim Allclair (Google)
-->
**作者**: Tim Allclair (Google)

<!--
Kubernetes originally launched with support for Docker containers running native applications on a Linux host. Starting with [rkt](https://kubernetes.io/blog/2016/07/rktnetes-brings-rkt-container-engine-to-kubernetes/) in Kubernetes 1.3 more runtimes were coming, which lead to the development of the [Container Runtime Interface](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) (CRI). Since then, the set of alternative runtimes has only expanded: projects like [Kata Containers](https://katacontainers.io/) and [gVisor](https://github.com/google/gvisor) were announced for stronger workload isolation, and Kubernetes' Windows support has been [steadily progressing](https://kubernetes.io/blog/2018/01/kubernetes-v19-beta-windows-support/).
-->
Kubernetes 最初是爲了支持在 Linux 主機上運行本機應用程式的 Docker 容器而創建的。
從 Kubernetes 1.3 中的 [rkt](https://kubernetes.io/blog/2016/07/rktnetes-brings-rkt-container-engine-to-kubernetes/) 開始，更多的運行時間開始湧現，
這導致了[容器運行時介面（Container Runtime Interface）](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)（CRI）的開發。
從那時起，備用運行時集合越來越大：
爲了加強工作負載隔離，[Kata Containers](https://katacontainers.io/) 和 [gVisor](https://github.com/google/gvisor) 等項目被髮起，
並且 Kubernetes 對 Windows 的支持正在[穩步發展](https://kubernetes.io/blog/2018/01/kubernetes-v19-beta-windows-support/)。

<!--
With runtimes targeting so many different use cases, a clear need for mixed runtimes in a cluster arose. But all these different ways of running containers have brought a new set of problems to deal with:
-->
由於存在諸多針對不同用例的運行時，叢集對混合運行時的需求變得明晰起來。
但是，所有這些不同的容器運行方式都帶來了一系列新問題要處理：

<!--
- How do users know which runtimes are available, and select the runtime for their workloads?
- How do we ensure pods are scheduled to the nodes that support the desired runtime?
- Which runtimes support which features, and how can we surface incompatibilities to the user?
- How do we account for the varying resource overheads of the runtimes?
-->
- 使用者如何知道哪些運行時可用，併爲其工作負荷選擇運行時？
- 我們如何確保將 Pod 被調度到支持所需運行時的節點上？
- 哪些運行時支持哪些功能，以及我們如何向使用者顯示不兼容性？
- 我們如何考慮運行時的各種資源開銷？

<!--
**RuntimeClass** aims to solve these issues.
-->
**RuntimeClass** 旨在解決這些問題。

<!--
## RuntimeClass in Kubernetes 1.12
-->
## Kubernetes 1.12 中的 RuntimeClass

<!--
RuntimeClass was recently introduced as an alpha feature in Kubernetes 1.12. The initial implementation focuses on providing a runtime selection API, and paves the way to address the other open problems.
-->
最近，RuntimeClass 在 Kubernetes 1.12 中作爲 alpha 功能引入。
最初的實現側重於提供運行時選擇 API，併爲解決其他未解決的問題鋪平道路。

<!--
The RuntimeClass resource represents a container runtime supported in a Kubernetes cluster. The cluster provisioner sets up, configures, and defines the concrete runtimes backing the RuntimeClass. In its current form, a RuntimeClassSpec holds a single field, the **RuntimeHandler**. The RuntimeHandler is interpreted by the CRI implementation running on a node, and mapped to the actual runtime configuration. Meanwhile the PodSpec has been expanded with a new field, **RuntimeClassName**, which names the RuntimeClass that should be used to run the pod.
-->
RuntimeClass 資源代表 Kubernetes 叢集中支持的容器運行時。
叢集製備組件安裝、設定和定義支持 RuntimeClass 的具體運行時。
在 RuntimeClassSpec 的當前形式中，只有一個字段，即 **RuntimeHandler**。
RuntimeHandler 由在節點上運行的 CRI 實現解釋，並映射到實際的運行時設定。
同時，PodSpec 被擴展添加了一個新字段 **RuntimeClassName**，命名應該用於運行 Pod 的 RuntimeClass。

<!--
Why is RuntimeClass a pod level concept? The Kubernetes resource model expects certain resources to be shareable between containers in the pod. If the pod is made up of different containers with potentially different resource models, supporting the necessary level of resource sharing becomes very challenging. For example, it is extremely difficult to support a loopback (localhost) interface across a VM boundary, but this is a common model for communication between two containers in a pod.
-->
爲什麼 RuntimeClass 是 Pod 級別的概念？
Kubernetes 資源模型期望 Pod 中的容器之間可以共享某些資源。
如果 Pod 由具有不同資源模型的不同容器組成，支持必要水平的資源共享變得非常具有挑戰性。
例如，要跨 VM 邊界支持本地迴路（localhost）介面非常困難，但這是 Pod 中兩個容器之間通信的通用模型。

<!--
## What's next?
-->
## 下一步是什麼？

<!--
The RuntimeClass resource is an important foundation for surfacing runtime properties to the control plane. For example, to implement scheduler support for clusters with heterogeneous nodes supporting different runtimes, we might add [NodeAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) terms to the RuntimeClass definition. Another area to address is managing the variable resource requirements to run pods of different runtimes. The [Pod Overhead proposal](https://docs.google.com/document/d/1EJKT4gyl58-kzt2bnwkv08MIUZ6lkDpXcxkHqCvvAp4/preview) was an early take on this that aligns nicely with the RuntimeClass design, and may be pursued further.
-->
RuntimeClass 資源是將運行時屬性顯示到控制平面的重要基礎。
例如，要對具有支持不同運行時間的異構節點的叢集實施調度程式支持，我們可以在 RuntimeClass 定義中添加
[NodeAffinity](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) 條件。
另一個需要解決的領域是管理可變資源需求以運行不同運行時的 Pod。
[Pod Overhead 提案](https://docs.google.com/document/d/1EJKT4gyl58-kzt2bnwkv08MIUZ6lkDpXcxkHqCvvAp4/preview)是一項較早的嘗試，與
RuntimeClass 設計非常吻合，並且可能會進一步推廣。

<!--
Many other RuntimeClass extensions have also been proposed, and will be revisited as the feature continues to develop and mature. A few more extensions that are being considered include:
-->
人們還提出了許多其他 RuntimeClass 擴展，隨着功能的不斷發展和成熟，我們會重新討論這些提議。
正在考慮的其他擴展包括：

<!--
 - Surfacing optional features supported by runtimes, and better visibility into errors caused by incompatible features.
- Automatic runtime or feature discovery, to support scheduling decisions without manual configuration.
- Standardized or conformant RuntimeClass names that define a set of properties that should be supported across clusters with RuntimeClasses of the same name.
- Dynamic registration of additional runtimes, so users can install new runtimes on existing clusters with no downtime.
- "Fitting" a RuntimeClass to a pod's requirements. For instance, specifying runtime properties and letting the system match an appropriate RuntimeClass, rather than explicitly assigning a RuntimeClass by name.
-->
- 提供運行時支持的可選功能，並更好地查看由不兼容功能導致的錯誤。
- 自動運行時或功能發現，支持無需手動設定的調度決策。
- 標準化或一致的 RuntimeClass 名稱，用於定義一組具有相同名稱的 RuntimeClass 的叢集應支持的屬性。
- 動態註冊附加的運行時，因此使用者可以在不停機的情況下在現有叢集上安裝新的運行時。
- 根據 Pod 的要求“匹配” RuntimeClass。
  例如，指定運行時屬性並使系統與適當的 RuntimeClass 匹配，而不是通過名稱顯式分配 RuntimeClass。

<!--
RuntimeClass will be under active development at least through 2019, and we’re excited to see the feature take shape, starting with the RuntimeClass alpha in Kubernetes 1.12.
-->
至少要到 2019 年，RuntimeClass 纔會得到積極的開發，我們很高興看到從 Kubernetes 1.12 中的 RuntimeClass alpha 開始，此功能得以形成。

<!--
## Learn More
-->
## 學到更多

<!--
- Take it for a spin! As an alpha feature, there are some additional setup steps to use RuntimeClass. Refer to the [RuntimeClass documentation](/docs/concepts/containers/runtime-class/#runtime-class) for how to get it running.
- Check out the [RuntimeClass Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class.md) for more nitty-gritty design details.
- The [Sandbox Isolation Level Decision](https://docs.google.com/document/d/1fe7lQUjYKR0cijRmSbH_y0_l3CYPkwtQa5ViywuNo8Q/preview) documents the thought process that initially went into making RuntimeClass a pod-level choice.
- Join the discussions and help shape the future of RuntimeClass with the [SIG-Node community](https://github.com/kubernetes/community/tree/master/sig-node)
-->

- 試試吧！作爲 Alpha 功能，還有一些其他設置步驟可以使用 RuntimeClass。
  有關如何使其運行，請參考 [RuntimeClass 文檔](/zh-cn/docs/concepts/containers/runtime-class/#runtime-class)。
- 查看 [RuntimeClass Kubernetes 增強建議](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class.md)以獲取更多細節設計細節。
- [沙盒隔離級別決策](https://docs.google.com/document/d/1fe7lQUjYKR0cijRmSbH_y0_l3CYPkwtQa5ViywuNo8Q/preview)記錄了最初使
  RuntimeClass 成爲 Pod 級別選項的思考過程。
- 加入討論，並通過 [SIG-Node 社區](https://github.com/kubernetes/community/tree/master/sig-node)幫助塑造 RuntimeClass 的未來。
