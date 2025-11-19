---
layout: blog
title: 'Kubernetes v1.26：CPUManager 正式發佈'
date: 2022-12-27
slug: cpumanager-ga
---
<!--
layout: blog
title: 'Kubernetes v1.26: CPUManager goes GA'
date: 2022-12-27
slug: cpumanager-ga
-->

<!--
**Author:**
Francesco Romani (Red Hat)
-->
**作者：** Francesco Romani (Red Hat)

**譯者：** Michael Yao (DaoCloud)

<!--
The CPU Manager is a part of the kubelet, the Kubernetes node agent, which enables the user to allocate exclusive CPUs to containers.
Since Kubernetes v1.10, where it [graduated to Beta](/blog/2018/07/24/feature-highlight-cpu-manager/), the CPU Manager proved itself reliable and
fulfilled its role of allocating exclusive CPUs to containers, so adoption has steadily grown making it a staple component of performance-critical
and low-latency setups.  Over time, most changes were about bugfixes or internal refactoring, with the following noteworthy user-visible changes:
-->
CPU 管理器是 kubelet 的一部分；kubelet 是 Kubernetes 的節點代理，能夠讓使用者給容器分配獨佔 CPU。
CPU 管理器自從 Kubernetes v1.10 [進階至 Beta](/blog/2018/07/24/feature-highlight-cpu-manager/)，
已證明了它本身的可靠性，能夠充分勝任將獨佔 CPU 分配給容器，因此採用率穩步增長，
使其成爲性能關鍵型和低延遲場景的基本組件。隨着時間的推移，大多數變更均與錯誤修復或內部重構有關，
以下列出了幾個值得關注、使用者可見的變更：

<!--
- [support explicit reservation of CPUs](https://github.com/Kubernetes/Kubernetes/pull/83592): it was already possible to request to reserve a given
  number of CPUs for system resources, including the kubelet itself, which will not be used for exclusive CPU allocation. Now it is possible to also
  explicitly select which CPUs to reserve instead of letting the kubelet pick them up automatically.
- [report the exclusively allocated CPUs](https://github.com/Kubernetes/Kubernetes/pull/97415) to containers, much like is already done for devices,
  using the kubelet-local [PodResources API](/docs/concepts/extend-Kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
- [optimize the usage of system resources](https://github.com/Kubernetes/Kubernetes/pull/101771), eliminating unnecessary sysfs changes.
-->
- [支持顯式保留 CPU](https://github.com/Kubernetes/Kubernetes/pull/83592)：
  之前已經可以請求爲系統資源（包括 kubelet 本身）保留給定數量的 CPU，這些 CPU 將不會被用於獨佔 CPU 分配。
  現在還可以顯式選擇保留哪些 CPU，而不是讓 kubelet 自動揀選 CPU。
- 使用 kubelet 本地
  [PodResources API](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
  [向容器報告獨佔分配的 CPU](https://github.com/Kubernetes/Kubernetes/pull/97415)，就像已爲設備所做的一樣。
- [優化系統資源的使用](https://github.com/Kubernetes/Kubernetes/pull/101771)，消除不必要的 sysfs 變更。

<!--
The CPU Manager reached the point on which it "just works", so in Kubernetes v1.26 it has graduated to generally available (GA).
-->
CPU 管理器達到了“能勝任”的水平，因此在 Kubernetes v1.26 中，它進階至正式發佈（GA）狀態。

<!--
## Customization options for CPU Manager {#cpu-managed-customization}

The CPU Manager supports two operation modes, configured using its _policies_. With the `none` policy, the CPU Manager allocates CPUs to containers
without any specific constraint except the (optional) quota set in the Pod spec.
With the `static` policy, then provided that the pod is in the Guaranteed QoS class and every container in that Pod requests an integer amount of vCPU cores,
then the CPU Manager allocates CPUs exclusively. Exclusive assignment means that other containers (whether from the same Pod, or from a different Pod) do not
get scheduled onto that CPU.
-->
## CPU 管理器的自定義選項   {#cpu-managed-customization}

CPU 管理器支持兩種操作模式，使用其**策略**進行設定。
使用 `none` 策略，CPU 管理器將 CPU 分配給容器，除了 Pod 規約中設置的（可選）配額外，沒有任何特定限制。
使用 `static` 策略，假設 Pod 屬於 Guaranteed QoS 類，並且該 Pod 中的每個容器都請求一個整數核數的 vCPU，
則 CPU 管理器將獨佔分配 CPU。獨佔分配意味着（無論是來自同一個 Pod 還是來自不同的 Pod）其他容器都不會被調度到該 CPU 上。

<!--
This simple operational model served the user base pretty well, but as the CPU Manager matured more and more, users started to look at more elaborate use
cases and how to better support them.

Rather than add more policies, the community realized that pretty much all the novel use cases are some variation of the behavior enabled by the `static`
CPU Manager policy. Hence, it was decided to add [options to tune the behavior of the static policy](https://github.com/Kubernetes/enhancements/tree/master/keps/sig-node/2625-cpumanager-policies-thread-placement#proposed-change).
The options have a varying degree of maturity, like any other Kubernetes feature, and in order to be accepted, each new option provides a backward
compatible behavior when disabled, and to document how to interact with each other, should they interact at all.
-->
這種簡單的操作模型很好地服務了使用者羣體，但隨着 CPU 管理器越來越成熟，
使用者開始關注更復雜的使用場景以及如何更好地支持這些使用場景。

社區沒有添加更多策略，而是意識到幾乎所有新穎的用例都是 `static` CPU 管理器策略所賦予的一些行爲變化。
因此，決定添加[調整靜態策略行爲的選項](https://github.com/Kubernetes/enhancements/tree/master/keps/sig-node/2625-cpumanager-policies-thread-placement #proposed-change）。
這些選項都達到了不同程度的成熟度，類似於其他的所有 Kubernetes 特性，
爲了能夠被接受，每個新選項在禁用時都能提供向後兼容的行爲，並能在需要進行交互時記錄彼此如何交互。

<!--
This enabled the Kubernetes project to graduate to GA the CPU Manager core component and core CPU allocation algorithms to GA,
while also enabling a new age of experimentation in this area.
In Kubernetes v1.26, the CPU Manager supports [three different policy options](/docs/tasks/administer-cluster/cpu-management-policies#static-policy-options):
-->
這使得 Kubernetes 項目能夠將 CPU 管理器核心組件和核心 CPU 分配算法進階至 GA，同時也開啓了該領域新的實驗時代。
在 Kubernetes v1.26 中，CPU
管理器支持[三個不同的策略選項](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies#static-policy-options)：

<!--
`full-pcpus-only`
: restrict the CPU Manager core allocation algorithm to full physical cores only, reducing noisy neighbor issues from hardware technologies that allow sharing cores.

`distribute-cpus-across-numa`
: drive the CPU Manager to evenly distribute CPUs across NUMA nodes, for cases where more than one NUMA node is required to satisfy the allocation.

`align-by-socket`
: change how the CPU Manager allocates CPUs to a container:  consider CPUs to be aligned at the socket boundary, instead of NUMA node boundary.
-->
`full-pcpus-only`
: 將 CPU 管理器核心分配算法限制爲僅支持完整的物理核心，從而減少允許共享核心的硬件技術帶來的嘈雜鄰居問題。

`distribute-cpus-across-numa`
: 驅動 CPU 管理器跨 NUMA 節點均勻分配 CPU，以應對需要多個 NUMA 節點來滿足分配的情況。

`align-by-socket`
: 更改 CPU 管理器將 CPU 分配給容器的方式：考慮 CPU 按插槽而不是 NUMA 節點邊界對齊。

<!--
## Further development

After graduating the main CPU Manager feature, each existing policy option will follow their graduation process, independent from CPU Manager and from each other option.
There is room for new options to be added, but there's also a growing demand for even more flexibility than what the CPU Manager, and its policy options, currently grant.

Conversations are in progress in the community about splitting the CPU Manager and the other resource managers currently part of the kubelet executable
into pluggable, independent kubelet plugins. If you are interested in this effort, please join the conversation on SIG Node communication channels (Slack, mailing list, weekly meeting).
-->
## 後續發展   {#further-development}

在主要 CPU 管理器特性進階後，每個現有的策略選項將遵循其進階過程，獨立於 CPU 管理器和其他選項。
添加新選項的空間雖然存在，但隨着對更高靈活性的需求不斷增長，CPU 管理器及其策略選項當前所提供的靈活性也有不足。

社區中正在討論如何將 CPU 管理器和當前屬於 kubelet 可執行文件的其他資源管理器拆分爲可插拔的獨立 kubelet 插件。
如果你對這項努力感興趣，請加入 SIG Node 交流頻道（Slack、郵件列表、每週會議）進行討論。

<!--
## Further reading

Please check out the [Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/)
task page to learn more about the CPU Manager, and how it fits in relation to the other node-level resource managers.
-->
## 進一步閱讀  {#further-reading}

請查閱[控制節點上的 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)任務頁面以瞭解有關
CPU 管理器的更多信息及其如何適配其他節點級別資源管理器。

<!--
## Getting involved

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md) community.
Please join us to connect with the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
-->
## 參與其中  {#getting-involved}

此特性由 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md) 社區驅動。
請加入我們與社區建立聯繫，就上述特性和更多內容分享你的想法和反饋。我們期待你的迴音！
