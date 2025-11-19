---
layout: blog
title: '動態 Kubelet 設定'
date: 2018-07-11
slug: dynamic-kubelet-configuration
---
<!--
layout: blog
title: 'Dynamic Kubelet Configuration'
date: 2018-07-11
-->

<!--
**Author**: Michael Taufen (Google)
-->
**作者**: Michael Taufen (Google)

<!--
**Editor’s note: The feature has been removed in the version 1.24 after deprecation in 1.22.**
-->
**編者注：在 1.22 版本棄用後，該功能已在 1.24 版本中刪除。**

<!--
**Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) on what’s new in Kubernetes 1.11**
-->
**編者注：這篇文章是[一系列深度文章](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) 的一部分，這個系列介紹了 Kubernetes 1.11 中的新增功能**

<!--
## Why Dynamic Kubelet Configuration?
-->
## 爲什麼要進行動態 Kubelet 設定？

<!--
Kubernetes provides API-centric tooling that significantly improves workflows for managing applications and infrastructure. Most Kubernetes installations, however, run the Kubelet as a native process on each host, outside the scope of standard Kubernetes APIs.
-->
Kubernetes 提供了以 API 爲中心的工具，可顯着改善用於管理應用程序和基礎架構的工作流程。
但是，在大多數的 Kubernetes 安裝中，kubelet 在每個主機上作爲本機進程運行，因此
未被標準 Kubernetes API 覆蓋。

<!--
In the past, this meant that cluster administrators and service providers could not rely on Kubernetes APIs to reconfigure Kubelets in a live cluster. In practice, this required operators to either ssh into machines to perform manual reconfigurations, use third-party configuration management automation tools, or create new VMs with the desired configuration already installed, then migrate work to the new machines. These approaches are environment-specific and can be expensive.
-->
過去，這意味着叢集管理員和服務提供商無法依靠 Kubernetes API 在活動叢集中重新設定 Kubelets。
實際上，這要求操作員要 SSH 登錄到計算機以執行手動重新設定，要麼使用第三方設定管理自動化工具，
或創建已經安裝了所需設定的新 VM，然後將工作遷移到新計算機上。
這些方法是特定於環境的，並且可能很耗時費力。

<!--
Dynamic Kubelet configuration gives cluster administrators and service providers the ability to reconfigure Kubelets in a live cluster via Kubernetes APIs.
-->
動態 Kubelet 設定使叢集管理員和服務提供商能夠通過 Kubernetes API 在活動叢集中重新設定 Kubelet。

<!--
## What is Dynamic Kubelet Configuration?
-->
## 什麼是動態 Kubelet 設定？

<!--
Kubernetes v1.10 made it possible to configure the Kubelet via a beta [config file](/docs/tasks/administer-cluster/kubelet-config-file/) API. Kubernetes already provides the ConfigMap abstraction for storing arbitrary file data in the API server.
-->
Kubernetes v1.10 使得可以通過 Beta 版本的[設定文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)
API 設定 kubelet。
Kubernetes 已經提供了用於在 API 伺服器中存儲任意文件數據的 ConfigMap 抽象。

<!--
Dynamic Kubelet configuration extends the Node object so that a Node can refer to a ConfigMap that contains the same type of config file. When a Node is updated to refer to a new ConfigMap, the associated Kubelet will attempt to use the new configuration.
-->
動態 Kubelet 設定擴展了 Node 對象，以便 Node 可以引用包含相同類型設定文件的 ConfigMap。
當節點更新爲引用新的 ConfigMap 時，關聯的 Kubelet 將嘗試使用新的設定。

<!--
## How does it work?
-->
## 它是如何工作的？

<!--
Dynamic Kubelet configuration provides the following core features:
-->
動態 Kubelet 設定提供以下核心功能：

<!--
* Kubelet attempts to use the dynamically assigned configuration.
* Kubelet "checkpoints" configuration to local disk, enabling restarts without API server access.
* Kubelet reports assigned, active, and last-known-good configuration sources in the Node status.
* When invalid configuration is dynamically assigned, Kubelet automatically falls back to a last-known-good configuration and reports errors in the Node status.
-->
* Kubelet 嘗試使用動態分配的設定。
* Kubelet 將其設定已檢查點的形式保存到本地磁盤，無需 API 伺服器訪問即可重新啓動。
* Kubelet 在 Node 狀態中報告已指定的、活躍的和最近已知良好的設定源。
* 當動態分配了無效的設定時，Kubelet 會自動退回到最後一次正確的設定，並在 Node 狀態中報告錯誤。

<!--
To use the dynamic Kubelet configuration feature, a cluster administrator or service provider will first post a ConfigMap containing the desired configuration, then set each Node.Spec.ConfigSource.ConfigMap reference to refer to the new ConfigMap. Operators can update these references at their preferred rate, giving them the ability to perform controlled rollouts of new configurations.
-->
要使用動態 Kubelet 設定功能，叢集管理員或服務提供商將首先發布包含所需設定的 ConfigMap，
然後設置每個 Node.Spec.ConfigSource.ConfigMap 引用以指向新的 ConfigMap。
運營商可以以他們喜歡的速率更新這些參考，從而使他們能夠執行新設定的受控部署。

<!--
Each Kubelet watches its associated Node object for changes. When the Node.Spec.ConfigSource.ConfigMap reference is updated, the Kubelet will "checkpoint" the new ConfigMap by writing the files it contains to local disk. The Kubelet will then exit, and the OS-level process manager will restart it. Note that if the Node.Spec.ConfigSource.ConfigMap reference is not set, the Kubelet uses the set of flags and config files local to the machine it is running on.
-->
每個 Kubelet 都會監視其關聯的 Node 對象的更改。
更新 Node.Spec.ConfigSource.ConfigMap 引用後，
Kubelet 將通過將其包含的文件通過檢查點機制寫入本地磁盤保存新的 ConfigMap。
然後，Kubelet 將退出，而操作系統級進程管理器將重新啓動它。
請注意，如果未設置 Node.Spec.ConfigSource.ConfigMap 引用，
則 Kubelet 將使用其正在運行的計算機本地的一組標誌和設定文件。

<!--
Once restarted, the Kubelet will attempt to use the configuration from the new checkpoint. If the new configuration passes the Kubelet's internal validation, the Kubelet will update Node.Status.Config to reflect that it is using the new configuration. If the new configuration is invalid, the Kubelet will fall back to its last-known-good configuration and report an error in Node.Status.Config.
-->
重新啓動後，Kubelet 將嘗試使用來自新檢查點的設定。
如果新設定通過了 Kubelet 的內部驗證，則 Kubelet 將更新 
Node.Status.Config 用以反映它正在使用新設定。
如果新設定無效，則 Kubelet 將退回到其最後一個正確的設定，並在 Node.Status.Config 中報告錯誤。

<!--
Note that the default last-known-good configuration is the combination of Kubelet command-line flags with the Kubelet's local configuration file. Command-line flags that overlap with the config file always take precedence over both the local configuration file and dynamic configurations, for backwards-compatibility.
-->
請注意，默認的最後一次正確設定是 Kubelet 命令列標誌與 Kubelet 的本地設定文件的組合。
與設定文件重疊的命令列標誌始終優先於本地設定文件和動態設定，以實現向後兼容。

<!--
See the following diagram for a high-level overview of a configuration update for a single Node:
-->
有關單個節點的設定更新的高級概述，請參見下圖：

![kubelet-diagram](/images/blog/2018-07-11-dynamic-kubelet-configuration/kubelet-diagram.png)

<!--
## How can I learn more?
-->
## 我如何瞭解更多？

<!--
Please see the official tutorial at /docs/tasks/administer-cluster/reconfigure-kubelet/, which contains more in-depth details on user workflow, how a configuration becomes "last-known-good," how the Kubelet "checkpoints" config, and possible failure modes.
-->
請參閱/docs/tasks/administer-cluster/reconfigure-kubelet/上的官方教程，
其中包含有關使用者工作流，某設定如何成爲“最新的正確的”設定，Kubelet 如何對設定執行“檢查點”操作等，
更多詳細信息，以及可能的故障模式。
