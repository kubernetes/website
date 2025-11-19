---
layout: blog
title: 'Kubernetes v1.31：全新的 Kubernetes CPUManager 靜態策略：跨核分發 CPU'
date: 2024-08-22
slug: cpumanager-static-policy-distributed-cpu-across-cores
author: >
  [Jiaxin Shan](https://github.com/Jeffwan) (Bytedance)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.31: New Kubernetes CPUManager Static Policy: Distribute CPUs Across Cores'
date: 2024-08-22
slug: cpumanager-static-policy-distributed-cpu-across-cores
author: >
  [Jiaxin Shan](https://github.com/Jeffwan) (Bytedance)
-->

<!--
In Kubernetes v1.31, we are excited to introduce a significant enhancement to CPU management capabilities: the `distribute-cpus-across-cores` option for the [CPUManager static policy](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-options). This feature is currently in alpha and hidden by default, marking a strategic shift aimed at optimizing CPU utilization and improving system performance across multi-core processors.
-->
在 Kubernetes v1.31 中，我們很高興引入了對 CPU 管理能力的重大增強：針對
[CPUManager 靜態策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-options)的
`distribute-cpus-across-cores` 選項。此特性目前處於 Alpha 階段，
默認被隱藏，標誌着旨在優化 CPU 利用率和改善多核處理器系統性能的戰略轉變。

<!--
## Understanding the feature

Traditionally, Kubernetes' CPUManager tends to allocate CPUs as compactly as possible, typically packing them onto the fewest number of physical cores. However, allocation strategy matters, CPUs on the same physical host still share some resources of the physical core, such as the cache and execution units, etc.
-->
## 理解這一特性   {#understanding-the-feature}

傳統上，Kubernetes 的 CPUManager 傾向於儘可能緊湊地分配 CPU，通常將這些 CPU 打包到儘可能少的物理核上。
然而，分配策略很重要，因爲同一物理主機上的 CPU 仍然共享一些物理核的資源，例如緩存和執行單元等。

{{< figure src="cpu-cache-architecture.png" alt="cpu-cache-architecture" >}}

<!--
While default approach minimizes inter-core communication and can be beneficial under certain scenarios, it also poses a challenge. CPUs sharing a physical core can lead to resource contention, which in turn may cause performance bottlenecks, particularly noticeable in CPU-intensive applications.
-->
雖然默認方法可以最小化核間通信，並在某些情況下是有益的，但也帶來了挑戰。
在同一物理核上共享的 CPU 可能導致資源競爭，從而可能造成性能瓶頸，這在 CPU 密集型應用中尤爲明顯。

<!--
The new `distribute-cpus-across-cores` feature addresses this issue by modifying the allocation strategy. When enabled, this policy option instructs the CPUManager to spread out the CPUs (hardware threads) across as many physical cores as possible. This distribution is designed to minimize contention among CPUs sharing the same physical core, potentially enhancing the performance of applications by providing them dedicated core resources.

Technically, within this static policy, the free CPU list is reordered in the manner depicted in the diagram, aiming to allocate CPUs from separate physical cores.
-->
全新的 `distribute-cpus-across-cores` 特性通過修改分配策略來解決這個問題。
當此特性被啓用時，此策略選項指示 CPUManager 儘可能將 CPU（硬件線程）分發到儘可能多的物理核上。
這種分發旨在最小化共享同一物理核的 CPU 之間的爭用，從而通過爲應用提供專用的核資源來潛在提高性能。

從技術上講，在這個靜態策略中，可用的 CPU 列表按照圖示的方式重新排序，旨在從不同的物理核分配 CPU。

{{< figure src="cpu-ordering.png" alt="cpu-ordering" >}}

<!--
## Enabling the feature

To enable this feature, users firstly need to add `--cpu-manager-policy=static` kubelet flag or the `cpuManagerPolicy: static` field in KubeletConfiuration. Then user can add `--cpu-manager-policy-options distribute-cpus-across-cores=true` or `distribute-cpus-across-cores=true` to their CPUManager policy options in the Kubernetes configuration or. This setting directs the CPUManager to adopt the new distribution strategy. It is important to note that this policy option cannot currently be used in conjunction with `full-pcpus-only` or `distribute-cpus-across-numa` options.
-->
## 啓用此特性   {#enabling-the-feature}

要啓用此特性，使用者首先需要在 kubelet 設定中添加 `--cpu-manager-policy=static` kubelet 標誌或 `cpuManagerPolicy: static` 字段。
然後使用者可以在 Kubernetes 設定中添加 `--cpu-manager-policy-options distribute-cpus-across-cores=true` 或
`distribute-cpus-across-cores=true` 到自己的 CPUManager 策略選項中。此設置指示 CPUManager 採用新的分發策略。
需要注意的是，目前此策略選項無法與 `full-pcpus-only` 或 `distribute-cpus-across-numa` 選項一起使用。

<!--
## Current limitations and future directions

As with any new feature, especially one in alpha, there are limitations and areas for future improvement. One significant current limitation is that `distribute-cpus-across-cores` cannot be combined with other policy options that might conflict in terms of CPU allocation strategies. This restriction can affect compatibility with certain workloads and deployment scenarios that rely on more specialized resource management.
-->
## 當前限制和未來方向   {#current-limitations-and-future-directions}

與所有新特性一樣，尤其是處於 Alpha 階段的特性，此特性也存在一些限制，很多方面還有待後續改進。
當前一個顯著的限制是 `distribute-cpus-across-cores` 不能與可能在 CPU 分配策略上存在衝突的其他策略選項結合使用。
這一限制可能會影響與（依賴於更專業的資源管理的）某些工作負載和部署場景的兼容性。

<!--
Looking forward, we are committed to enhancing the compatibility and functionality of the `distribute-cpus-across-cores` option. Future updates will focus on resolving these compatibility issues, allowing this policy to be combined with other CPUManager policies seamlessly. Our goal is to provide a more flexible and robust CPU allocation framework that can adapt to a variety of workloads and performance demands.
-->
展望未來，我們將致力於增強 `distribute-cpus-across-cores` 選項的兼容性和特性。
未來的更新將專注於解決這些兼容性問題，使此策略能夠與其他 CPUManager 策略無縫結合。
我們的目標是提供一個更靈活和強大的 CPU 分配框架，能夠適應各種工作負載和性能需求。

<!--
## Conclusion

The introduction of the `distribute-cpus-across-cores` policy in Kubernetes CPUManager is a step forward in our ongoing efforts to refine resource management and improve application performance. By reducing the contention on physical cores, this feature offers a more balanced approach to CPU resource allocation, particularly beneficial for environments running heterogeneous workloads. We encourage Kubernetes users to test this new feature and provide feedback, which will be invaluable in shaping its future development.

This draft aims to clearly explain the new feature while setting expectations for its current stage and future improvements.
-->
## 結論   {#conclusion}

在 Kubernetes CPUManager 中引入 `distribute-cpus-across-cores` 策略是我們持續努力改進資源管理和提升應用性能而向前邁出的一步。
通過減少物理核上的爭用，此特性提供了更加平衡的 CPU 資源分配方法，特別有利於運行異構工作負載的環境。
我們鼓勵 Kubernetes 使用者測試這一新特性並提供反饋，這將對其未來發展至關重要。

本文旨在清晰地解釋這一新特性，同時設定對其當前階段和未來改進的期望。

<!--
## Further reading

Please check out the [Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/)
task page to learn more about the CPU Manager, and how it fits in relation to the other node-level resource managers.
-->
## 進一步閱讀   {#further-reading}

請查閱[節點上的 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)任務頁面，
以瞭解有關 CPU 管理器的更多信息，以及 CPU 管理器與其他節點級資源管理器的關係。

<!--
## Getting involved

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md). If you are interested in helping develop this feature, sharing feedback, or participating in any other ongoing SIG Node projects, please attend the SIG Node meeting for more details.
-->
## 參與其中   {#getting-involved}

此特性由 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md) 推動。
如果你有興趣幫助開發此特性、分享反饋或參與其他目前 SIG Node 項目的工作，請參加 SIG Node 會議瞭解更多細節。
