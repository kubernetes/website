---
layout: blog
title: "Kubernetes 1.28：在 Linux 上使用交換內存的 Beta 支持"
date: 2023-08-24T10:00:00-08:00
slug: swap-linux-beta
---
<!--
layout: blog
title: "Kubernetes 1.28: Beta support for using swap on Linux"
date: 2023-08-24T10:00:00-08:00
slug: swap-linux-beta
-->

<!--
**Author:** Itamar Holder (Red Hat)
-->
**作者**：Itamar Holder (Red Hat)

**譯者**：Wilson Wu (DaoCloud)

<!--
The 1.22 release [introduced Alpha support](/blog/2021/08/09/run-nodes-with-swap-alpha/) for configuring swap memory usage for Kubernetes workloads running on Linux on a per-node basis. Now, in release 1.28, support for swap on Linux nodes has graduated to Beta, along with many new improvements.
-->
Kubernetes 1.22 版本爲交換內存[引入了一項 Alpha 支持](/blog/2021/08/09/run-nodes-with-swap-alpha/)，
用於爲在 Linux 節點上運行的 Kubernetes 工作負載逐個節點地設定交換內存使用。
現在，在 1.28 版中，對 Linux 節點上的交換內存的支持已升級爲 Beta 版，並有許多新的改進。

<!--
Prior to version 1.22, Kubernetes did not provide support for swap memory on Linux systems. This was due to the inherent difficulty in guaranteeing and accounting for pod memory utilization when swap memory was involved. As a result, swap support was deemed out of scope in the initial design of Kubernetes, and the default behavior of a kubelet was to fail to start if swap memory was detected on a node.
-->
在 1.22 版之前，Kubernetes 不提供對 Linux 系統上交換內存的支持。
這是由於在涉及交換內存時保證和計算 Pod 內存利用率的固有困難。
因此，交換內存支持被認爲超出了 Kubernetes 的初始設計範圍，並且如果在節點上檢測到交換內存，
kubelet 的預設行爲是無法啓動。

<!--
In version 1.22, the swap feature for Linux was initially introduced in its Alpha stage. This represented a significant advancement, providing Linux users with the opportunity to experiment with the swap feature for the first time. However, as an Alpha version, it was not fully developed and had several issues, including inadequate support for cgroup v2, insufficient metrics and summary API statistics, inadequate testing, and more.
-->
在 1.22 版中，Linux 的交換特性以 Alpha 階段初次引入。
這代表着一項重大進步，首次爲 Linux 使用者提供了嘗試交換內存特性的機會。
然而，作爲 Alpha 版本，它尚未開發完成，並存在一些問題，
包括對 cgroup v2 支持的不足、指標和 API 統計摘要不足、測試不足等等。

<!--
Swap in Kubernetes has numerous [use cases](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md#user-stories) for a wide range of users. As a result, the node special interest group within the Kubernetes project has invested significant effort into supporting swap on Linux nodes for beta. Compared to the alpha, the kubelet's support for running with swap enabled is more stable and robust, more user-friendly, and addresses many known shortcomings. This graduation to beta represents a crucial step towards achieving the goal of fully supporting swap in Kubernetes.
-->
Kubernetes 中的交換內存有許多[用例](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md#user-stories)，
並適用於大量使用者。因此，Kubernetes 項目內的節點特別興趣小組投入了大量精力來支持
Linux 節點上的交換內存特性的 Beta 版本。
與 Alpha 版本相比，啓用交換內存後 kubelet 的運行更加穩定和健壯，更加使用者友好，並且解決了許多已知缺陷。
這次升級到 Beta 版代表朝着實現在 Kubernetes 中完全支持交換內存的目標邁出了關鍵一步。

<!--
## How do I use it?
-->
## 如何使用此特性？ {#how-do-i-use-it}

<!--
The utilization of swap memory on a node where it has already been provisioned can be facilitated by the activation of the `NodeSwap` feature gate on the kubelet. Additionally, you must disable the `failSwapOn` configuration setting, or the deprecated `--fail-swap-on` command line flag must be deactivated.
-->
通過激活 kubelet 上的 `NodeSwap` 特性門控，可以在已設定交換內存的節點上使用此特性。
此外，你必須禁用 `failSwapOn` 設置，或者停用已被棄用的 `--fail-swap-on` 命令列標誌。

<!--
It is possible to configure the `memorySwap.swapBehavior` option to define the manner in which a node utilizes swap memory. For instance,
-->
可以設定 `memorySwap.swapBehavior` 選項來定義節點使用交換內存的方式。例如：

<!--
```yaml
# this fragment goes into the kubelet's configuration file
memorySwap:
  swapBehavior: UnlimitedSwap
```
-->
```yaml
# 將此段內容放入 kubelet 配置文件
memorySwap:
  swapBehavior: UnlimitedSwap
```

<!--
The available configuration options for `swapBehavior` are:
-->
`swapBehavior` 的可用設定選項有：

<!--
- `UnlimitedSwap` (default): Kubernetes workloads can use as much swap memory as they request, up to the system limit.
- `LimitedSwap`: The utilization of swap memory by Kubernetes workloads is subject to limitations. Only Pods of [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable) QoS are permitted to employ swap.
-->
- `UnlimitedSwap`（預設）：Kubernetes 工作負載可以根據請求使用儘可能多的交換內存，最多可達到系統限制。
- `LimitedSwap`：Kubernetes 工作負載對交換內存的使用受到限制。
  只有 [Burstable](/zh-cn/docs/concepts/workloads/pods/pod-qos/#burstable) QoS Pod 才允許使用交換內存。

<!--
If configuration for `memorySwap` is not specified and the feature gate is enabled, by default the kubelet will apply the same behaviour as the `UnlimitedSwap` setting.
-->
如果未指定 `memorySwap` 的設定並且啓用了特性門控，則預設情況下，
kubelet 將應用與 `UnlimitedSwap` 設置相同的行爲。

<!--
Note that `NodeSwap` is supported for **cgroup v2** only. For Kubernetes v1.28, using swap along with cgroup v1 is no longer supported.
-->
請注意，僅 **cgroup v2** 支持 `NodeSwap`。針對 Kubernetes v1.28，不再支持將交換內存與 cgroup v1 一起使用。

<!--
## Install a swap-enabled cluster with kubeadm
-->
## 使用 kubeadm 安裝支持交換內存的叢集 {#install-a-swap-enabled-cluster-with-kubeadm}

<!--
### Before you begin
-->
### 開始之前 {#before-you-begin}

<!--
It is required for this demo that the kubeadm tool be installed, following the steps outlined in the [kubeadm installation guide](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm). If swap is already enabled on the node, cluster creation may proceed. If swap is not enabled, please refer to the provided instructions for enabling swap.
-->
此演示需要安裝 kubeadm 工具，
安裝過程按照 [kubeadm 安裝指南](/zh-cn/docs/setup/product-environment/tools/kubeadm/create-cluster-kubeadm)中描述的步驟進行操作。
如果節點上已啓用交換內存，則可以繼續創建叢集。如果未啓用交換內存，請參閱提供的啓用交換內存說明。

<!--
### Create a swap file and turn swap on
-->
### 創建交換內存檔案並開啓交換內存功能 {#create-a-swap-file-and-turn-swap-on}

<!--
I'll demonstrate creating 4GiB of unencrypted swap.
-->
我將演示創建 4GiB 的未加密交換內存。

<!--
```bash
dd if=/dev/zero of=/swapfile bs=128M count=32
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
swapon -s # enable the swap file only until this node is rebooted
```
-->
```bash
dd if=/dev/zero of=/swapfile bs=128M count=32
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
swapon -s # 僅在該節點被重新啓動後啓用該交換內存文件
```

<!--
To start the swap file at boot time, add line like `/swapfile swap swap defaults 0 0` to `/etc/fstab` file.
-->
要在引導時啓動交換內存檔案，請將諸如 `/swapfile swap swap defaults 0 0` 的內容添加到 `/etc/fstab` 檔案中。

<!--
### Set up a Kubernetes cluster that uses swap-enabled nodes
-->
### 在 Kubernetes 叢集中設置開啓交換內存的節點  {#set-up-a-kubernetes-cluster-that-uses-swap-enabled-nodes}

<!--
To make things clearer, here is an example kubeadm configuration file `kubeadm-config.yaml` for the swap enabled cluster.
-->
清晰起見，這裏給出啓用交換內存特性的叢集的 kubeadm 設定檔案示例 `kubeadm-config.yaml`。

```yaml
---
apiVersion: "kubeadm.k8s.io/v1beta3"
kind: InitConfiguration
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
failSwapOn: false
featureGates:
  NodeSwap: true
memorySwap:
  swapBehavior: LimitedSwap
```

<!--
Then create a single-node cluster using `kubeadm init --config kubeadm-config.yaml`. During init, there is a warning that swap is enabled on the node and in case the kubelet `failSwapOn` is set to true. We plan to remove this warning in a future release.
-->
接下來使用 `kubeadm init --config kubeadm-config.yaml` 創建單節點叢集。
在初始化過程中，如果 kubelet `failSwapOn` 設置爲 true，則會出現一條警告，告知節點上啓用了交換內存特性。
我們計劃在未來的版本中刪除此警告。

<!--
## How is the swap limit being determined with LimitedSwap?
-->
## 如何通過 LimitedSwap 確定交換內存限額？ {#how-is-the-swap-limit-being-determined-with-limitedswap}

<!--
The configuration of swap memory, including its limitations, presents a significant challenge. Not only is it prone to misconfiguration, but as a system-level property, any misconfiguration could potentially compromise the entire node rather than just a specific workload. To mitigate this risk and ensure the health of the node, we have implemented Swap in Beta with automatic configuration of limitations.
-->
交換內存的設定（包括其侷限性）是一項挑戰。不僅容易出現設定錯誤，而且作爲系統級屬性，
任何錯誤設定都可能危及整個節點而不僅僅是特定的工作負載。
爲了減輕這種風險並確保節點的健康，我們在交換內存的 Beta 版本中實現了對缺陷的自動設定。

<!--
With `LimitedSwap`, Pods that do not fall under the Burstable QoS classification (i.e. `BestEffort`/`Guaranteed` Qos Pods) are prohibited from utilizing swap memory. `BestEffort` QoS Pods exhibit unpredictable memory consumption patterns and lack information regarding their memory usage, making it difficult to determine a safe allocation of swap memory. Conversely, `Guaranteed` QoS Pods are typically employed for applications that rely on the precise allocation of resources specified by the workload, with memory being immediately available. To maintain the aforementioned security and node health guarantees, these Pods are not permitted to use swap memory when `LimitedSwap` is in effect.
-->
使用 `LimitedSwap`，不屬於 Burstable QoS 類別的 Pod（即 `BestEffort`/`Guaranteed` QoS Pod）被禁止使用交換內存。
`BestEffort` QoS Pod 表現出不可預測的內存消耗模式，並且缺乏有關其內存使用情況的資訊，
因此很難完成交換內存的安全分配。相反，`Guaranteed` QoS Pod 通常用於根據工作負載的設置精確分配資源的應用，
其中的內存資源立即可用。
爲了維持上述安全和節點健康保證，當 `LimitedSwap` 生效時，這些 Pod 將不允許使用交換內存。

<!--
Prior to detailing the calculation of the swap limit, it is necessary to define the following terms:
-->
在詳細計算交換內存限制之前，有必要定義以下術語：

<!--
* `nodeTotalMemory`: The total amount of physical memory available on the node.
* `totalPodsSwapAvailable`: The total amount of swap memory on the node that is available for use by Pods (some swap memory may be reserved for system use).
* `containerMemoryRequest`: The container's memory request.
-->
* `nodeTotalMemory`：節點上可用的物理內存總量。
* `totalPodsSwapAvailable`：節點上可供 Pod 使用的交換內存總量（可以保留一些交換內存供系統使用）。
* `containerMemoryRequest`：容器的內存請求。

<!--
Swap limitation is configured as: `(containerMemoryRequest / nodeTotalMemory) × totalPodsSwapAvailable`
-->
交換內存限制設定爲：`(containerMemoryRequest / nodeTotalMemory) × totalPodsSwapAvailable`

<!--
In other words, the amount of swap that a container is able to use is proportionate to its memory request, the node's total physical memory and the total amount of swap memory on the node that is available for use by Pods.
-->
換句話說，容器能夠使用的交換內存量與其內存請求、節點的總物理內存以及節點上可供 Pod
使用的交換內存總量呈比例關係。

<!--
It is important to note that, for containers within Burstable QoS Pods, it is possible to opt-out of swap usage by specifying memory requests that are equal to memory limits. Containers configured in this manner will not have access to swap memory.
-->
值得注意的是，對於 Burstable QoS Pod 中的容器，可以通過設置內存限制與內存請求相同來選擇不使用交換內存。
以這種方式設定的容器將無法訪問交換內存。

<!--
## How does it work?
-->
## 此特性如何工作？ {#how-does-it-work}

<!--
There are a number of possible ways that one could envision swap use on a node. When swap is already provisioned and available on a node, SIG Node have [proposed](https://github.com/kubernetes/enhancements/blob/9d127347773ad19894ca488ee04f1cd3af5774fc/keps/sig-node/2400-node-swap/README.md#proposal) the kubelet should be able to be configured so that:
-->
我們可以想象可以在節點上使用交換內存的多種可能方式。當節點上提供了交換內存並可用時，
SIG 節點[建議](https://github.com/kubernetes/enhancements/blob/9d127347773ad19894ca488ee04f1cd3af5774fc/keps/sig-node/2400-node-swap/README.md#proposal)
kubelet 應該能夠遵循如下的設定：

<!--
- It can start with swap on.
- It will direct the Container Runtime Interface to allocate zero swap memory to Kubernetes workloads by default.
-->
- 在交換內存特性被啓用時能夠啓動。
- 預設情況下，kubelet 將指示容器運行時介面（CRI）不爲 Kubernetes 工作負載分配交換內存。

<!--
Swap configuration on a node is exposed to a cluster admin via the [`memorySwap` in the KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1). As a cluster administrator, you can specify the node's behaviour in the presence of swap memory by setting `memorySwap.swapBehavior`.
-->
節點上的交換內存設定通過 [KubeletConfiguration 中的 `memorySwap`](/zh-cn/docs/reference/config-api/kubelet-config.v1) 向叢集管理員公開。
作爲叢集管理員，你可以通過設置 `memorySwap.swapBehavior` 來指定存在交換內存時節點的行爲。

<!--
The kubelet [employs the CRI](/docs/concepts/architecture/cri/) (container runtime interface) API to direct the CRI to configure specific cgroup v2 parameters (such as `memory.swap.max`) in a manner that will enable the desired swap configuration for a container. The CRI is then responsible to write these settings to the container-level cgroup.
-->
kubelet [使用 CRI](/zh-cn/docs/concepts/architecture/cri/)
（容器運行時介面）API 來指示 CRI 設定特定的 cgroup v2 參數（例如 `memory.swap.max`），
設定方式要支持容器所期望的交換內存設定。接下來，CRI 負責將這些設置寫入容器級的 cgroup。

<!--
## How can I monitor swap?
-->
## 如何對交換內存進行監控？ {#how-can-i-monitor-swap}

<!--
A notable deficiency in the Alpha version was the inability to monitor and introspect swap usage. This issue has been addressed in the Beta version introduced in Kubernetes 1.28, which now provides the capability to monitor swap usage through several different methods.
-->
Alpha 版本的一個顯著缺陷是無法監控或檢視交換內存的使用情況。
這個問題已在 Kubernetes 1.28 引入的 Beta 版本中得到解決，該版本現在提供了通過多種不同方法監控交換內存使用情況的能力。

<!--
The beta version of kubelet now collects [node-level metric statistics](/docs/reference/instrumentation/node-metrics/), which can be accessed at the `/metrics/resource` and `/stats/summary` kubelet HTTP endpoints. This allows clients who can directly interrogate the kubelet to monitor swap usage and remaining swap memory when using LimitedSwap. Additionally, a `machine_swap_bytes` metric has been added to cadvisor to show the total physical swap capacity of the machine.
-->
kubelet 的 Beta 版本現在支持收集[節點級指標統計資訊](/zh-cn/docs/reference/instrumentation/node-metrics/)，
可以通過 `/metrics/resource` 和 `/stats/summary` kubelet HTTP 端點進行訪問。
這些資訊使得客戶端能夠在使用 LimitedSwap 時直接訪問 kubelet 來監控交換內存使用情況和剩餘交換內存情況。
此外，cadvisor 中還添加了 `machine_swap_bytes` 指標，以顯示機器上總的物理交換內存容量。

<!--
## Caveats
-->
## 注意事項 {#caveats}

<!--
Having swap available on a system reduces predictability. Swap's performance is worse than regular memory, sometimes by many orders of magnitude, which can cause unexpected performance regressions. Furthermore, swap changes a system's behaviour under memory pressure. Since enabling swap permits greater memory usage for workloads in Kubernetes that cannot be predictably accounted for, it also increases the risk of noisy neighbours and unexpected packing configurations, as the scheduler cannot account for swap memory usage.
-->
在系統上提供可用交換內存會降低可預測性。由於交換內存的性能比常規內存差，
有時差距甚至在多個數量級，因而可能會導致意外的性能下降。此外，交換內存會改變系統在內存壓力下的行爲。
由於啓用交換內存允許 Kubernetes 中的工作負載使用更大的內存量，而這一用量是無法預測的，
因此也會增加嘈雜鄰居和非預期的裝箱設定的風險，因爲調度程式無法考慮交換內存使用情況。

<!--
The performance of a node with swap memory enabled depends on the underlying physical storage. When swap memory is in use, performance will be significantly worse in an I/O operations per second (IOPS) constrained environment, such as a cloud VM with I/O throttling, when compared to faster storage mediums like solid-state drives or NVMe.
-->
啓用交換內存的節點的性能取決於底層物理儲存。當使用交換內存時，與固態硬盤或 NVMe 等更較快的儲存介質相比，
在每秒 I/O 操作數（IOPS）受限的環境（例如具有 I/O 限制的雲虛擬機）中，性能會明顯變差。

<!--
As such, we do not advocate the utilization of swap memory for workloads or environments that are subject to performance constraints. Furthermore, it is recommended to employ `LimitedSwap`, as this significantly mitigates the risks posed to the node.
-->
因此，我們不提倡針對有性能約束的工作負載或環境使用交換內存。
此外，建議使用 `LimitedSwap`，因爲這可以顯著減輕給節點帶來的風險。

<!--
Cluster administrators and developers should benchmark their nodes and applications before using swap in production scenarios, and [we need your help](#how-do-i-get-involved) with that!
-->
叢集管理員和開發人員應該在生產場景中使用交換內存之前對其節點和應用進行基準測試，
[我們需要你的幫助](#how-do-i-get-involved)！

<!--
### Security risk
-->
### 安全風險 {#security-risk}

<!--
Enabling swap on a system without encryption poses a security risk, as critical information, such as volumes that represent Kubernetes Secrets, [may be swapped out to the disk](/docs/concepts/configuration/secret/#information-security-for-secrets). If an unauthorized individual gains access to the disk, they could potentially obtain these confidential data. To mitigate this risk, the Kubernetes project strongly recommends that you encrypt your swap space. However, handling encrypted swap is not within the scope of kubelet; rather, it is a general OS configuration concern and should be addressed at that level. It is the administrator's responsibility to provision encrypted swap to mitigate this risk.
-->
在沒有加密的系統上啓用交換內存會帶來安全風險，因爲關鍵資訊（例如代表 Kubernetes Secret 的卷）
[可能會被交換到磁盤](/zh-cn/docs/concepts/configuration/secret/#information-security-for-secrets)。
如果未經授權的個人訪問磁盤，他們就有可能獲得這些機密資料。爲了減輕這種風險，
Kubernetes 項目強烈建議你對交換內存空間進行加密。但是，處理加密交換內存不是 kubelet 的責任；
相反，它其實是操作系統設定通用問題，應在該級別解決。管理員有責任提供加密交換內存來減輕這種風險。

<!--
Furthermore, as previously mentioned, with `LimitedSwap` the user has the option to completely disable swap usage for a container by specifying memory requests that are equal to memory limits. This will prevent the corresponding containers from accessing swap memory.
-->
此外，如前所述，啓用 `LimitedSwap` 模式時，使用者可以選擇通過設置內存限制與內存請求相同來完全禁止容器使用交換內存。
這種設置會阻止相應的容器訪問交換內存。

<!--
## Looking ahead
-->
## 展望未來 {#looking-ahead}

<!--
The Kubernetes 1.28 release introduced Beta support for swap memory on Linux nodes, and we will continue to work towards [general availability](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages) for this feature. I hope that this will include:
-->
Kubernetes 1.28 版本引入了對 Linux 節點上交換內存的 Beta 支持，
我們將繼續爲這項特性的[正式發佈](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)而努力。
我希望這將包括：

<!--
* Add the ability to set a system-reserved quantity of swap from what kubelet detects on the host.
* Adding support for controlling swap consumption at the Pod level via cgroups.
  * This point is still under discussion.
* Collecting feedback from test user cases.
  * We will consider introducing new configuration modes for swap, such as a node-wide swap limit for workloads.
-->
* 添加根據 kubelet 在主機上檢測到的內容來設置系統預留交換內存量的功能。
* 添加對通過 cgroup 在 Pod 級別控制交換內存用量的支持。
  * 這一點仍在討論中。
* 收集測試用例的反饋。
  * 我們將考慮引入新的交換內存設定模式，例如在節點層面爲工作負載設置交換內存限制。

<!--
## How can I learn more?
-->
## 如果進一步學習？ {#how-can-i-learn-more}

<!--
You can review the current [documentation](/docs/concepts/architecture/nodes/#swap-memory) for using swap with Kubernetes.
-->
你可以查看當前[文檔](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)以瞭解如何在 Kubernetes 中使用交換內存。

<!--
For more information, and to assist with testing and provide feedback, please see [KEP-2400](https://github.com/kubernetes/enhancements/issues/4128) and its [design proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).
-->
如需瞭解更多資訊，以及協助測試和提供反饋，請參閱 [KEP-2400](https://github.com/kubernetes/enhancements/issues/4128)
及其[設計提案](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md)。

<!--
## How do I get involved?
-->
## 參與其中 {#how-do-i-get-involved}

<!--
Your feedback is always welcome! SIG Node [meets regularly](https://github.com/kubernetes/community/tree/master/sig-node#meetings) and [can be reached](https://github.com/kubernetes/community/tree/master/sig-node#contact) via [Slack](https://slack.k8s.io/) (channel **#sig-node**), or the SIG's [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node). A Slack channel dedicated to swap is also available at **#sig-node-swap**.
-->
隨時歡迎你的反饋！SIG Node [定期舉行會議](https://github.com/kubernetes/community/tree/master/sig-node#meetings)並可以通過
[Slack](https://slack.k8s.io/)（**#sig-node** 頻道）
或 SIG 的 [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
[進行聯繫](https://github.com/kubernetes/community/tree/master/sig-node#contact)。
Slack 還提供了專門討論交換內存的 **#sig-node-swap** 頻道。

<!--
Feel free to reach out to me, Itamar Holder (**@iholder101** on Slack and GitHub) if you'd like to help or ask further questions.
-->
如果你想提供幫助或提出進一步的問題，請隨時聯繫 Itamar Holder（Slack 和 GitHub 賬號爲 **@iholder101**）。
