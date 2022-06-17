---
layout: blog
title: '動態 Kubelet 配置'
date: 2018-07-11
---
<!--
---
layout: blog
title: 'Dynamic Kubelet Configuration'
date: 2018-07-11
---
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
## 為什麼要進行動態 Kubelet 配置？

<!--
Kubernetes provides API-centric tooling that significantly improves workflows for managing applications and infrastructure. Most Kubernetes installations, however, run the Kubelet as a native process on each host, outside the scope of standard Kubernetes APIs.
-->
Kubernetes 提供了以 API 為中心的工具，可顯著改善用於管理應用程式和基礎架構的工作流程。
但是，在大多數的 Kubernetes 安裝中，kubelet 在每個主機上作為本機程序執行，因此
未被標準 Kubernetes API 覆蓋。

<!--
In the past, this meant that cluster administrators and service providers could not rely on Kubernetes APIs to reconfigure Kubelets in a live cluster. In practice, this required operators to either ssh into machines to perform manual reconfigurations, use third-party configuration management automation tools, or create new VMs with the desired configuration already installed, then migrate work to the new machines. These approaches are environment-specific and can be expensive.
-->
過去，這意味著叢集管理員和服務提供商無法依靠 Kubernetes API 在活動叢集中重新配置 Kubelets。
實際上，這要求操作員要 SSH 登入到計算機以執行手動重新配置，要麼使用第三方配置管理自動化工具，
或建立已經安裝了所需配置的新 VM，然後將工作遷移到新計算機上。
這些方法是特定於環境的，並且可能很耗時費力。

<!--
Dynamic Kubelet configuration gives cluster administrators and service providers the ability to reconfigure Kubelets in a live cluster via Kubernetes APIs.
-->
動態 Kubelet 配置使叢集管理員和服務提供商能夠透過 Kubernetes API 在活動叢集中重新配置 Kubelet。

<!--
## What is Dynamic Kubelet Configuration?
-->
## 什麼是動態 Kubelet 配置？

<!--
Kubernetes v1.10 made it possible to configure the Kubelet via a beta [config file](/docs/tasks/administer-cluster/kubelet-config-file/) API. Kubernetes already provides the ConfigMap abstraction for storing arbitrary file data in the API server.
-->
Kubernetes v1.10 使得可以透過 Beta 版本的[配置檔案](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)
API 配置 kubelet。
Kubernetes 已經提供了用於在 API 伺服器中儲存任意檔案資料的 ConfigMap 抽象。

<!--
Dynamic Kubelet configuration extends the Node object so that a Node can refer to a ConfigMap that contains the same type of config file. When a Node is updated to refer to a new ConfigMap, the associated Kubelet will attempt to use the new configuration.
-->
動態 Kubelet 配置擴充套件了 Node 物件，以便 Node 可以引用包含相同型別配置檔案的 ConfigMap。
當節點更新為引用新的 ConfigMap 時，關聯的 Kubelet 將嘗試使用新的配置。

<!--
## How does it work?
-->
## 它是如何工作的？

<!--
Dynamic Kubelet configuration provides the following core features:
-->
動態 Kubelet 配置提供以下核心功能：

<!--
* Kubelet attempts to use the dynamically assigned configuration.
* Kubelet "checkpoints" configuration to local disk, enabling restarts without API server access.
* Kubelet reports assigned, active, and last-known-good configuration sources in the Node status.
* When invalid configuration is dynamically assigned, Kubelet automatically falls back to a last-known-good configuration and reports errors in the Node status.
-->
* Kubelet 嘗試使用動態分配的配置。
* Kubelet 將其配置已檢查點的形式儲存到本地磁碟，無需 API 伺服器訪問即可重新啟動。
* Kubelet 在 Node 狀態中報告已指定的、活躍的和最近已知良好的配置源。
* 當動態分配了無效的配置時，Kubelet 會自動退回到最後一次正確的配置，並在 Node 狀態中報告錯誤。

<!--
To use the dynamic Kubelet configuration feature, a cluster administrator or service provider will first post a ConfigMap containing the desired configuration, then set each Node.Spec.ConfigSource.ConfigMap reference to refer to the new ConfigMap. Operators can update these references at their preferred rate, giving them the ability to perform controlled rollouts of new configurations.
-->
要使用動態 Kubelet 配置功能，叢集管理員或服務提供商將首先發布包含所需配置的 ConfigMap，
然後設定每個 Node.Spec.ConfigSource.ConfigMap 引用以指向新的 ConfigMap。
運營商可以以他們喜歡的速率更新這些參考，從而使他們能夠執行新配置的受控部署。

<!--
Each Kubelet watches its associated Node object for changes. When the Node.Spec.ConfigSource.ConfigMap reference is updated, the Kubelet will "checkpoint" the new ConfigMap by writing the files it contains to local disk. The Kubelet will then exit, and the OS-level process manager will restart it. Note that if the Node.Spec.ConfigSource.ConfigMap reference is not set, the Kubelet uses the set of flags and config files local to the machine it is running on.
-->
每個 Kubelet 都會監視其關聯的 Node 物件的更改。
更新 Node.Spec.ConfigSource.ConfigMap 引用後，
Kubelet 將透過將其包含的檔案透過檢查點機制寫入本地磁碟儲存新的 ConfigMap。
然後，Kubelet 將退出，而作業系統級程序管理器將重新啟動它。
請注意，如果未設定 Node.Spec.ConfigSource.ConfigMap 引用，
則 Kubelet 將使用其正在執行的計算機本地的一組標誌和配置檔案。

<!--
Once restarted, the Kubelet will attempt to use the configuration from the new checkpoint. If the new configuration passes the Kubelet's internal validation, the Kubelet will update Node.Status.Config to reflect that it is using the new configuration. If the new configuration is invalid, the Kubelet will fall back to its last-known-good configuration and report an error in Node.Status.Config.
-->
重新啟動後，Kubelet 將嘗試使用來自新檢查點的配置。
如果新配置通過了 Kubelet 的內部驗證，則 Kubelet 將更新 
Node.Status.Config 用以反映它正在使用新配置。
如果新配置無效，則 Kubelet 將退回到其最後一個正確的配置，並在 Node.Status.Config 中報告錯誤。

<!--
Note that the default last-known-good configuration is the combination of Kubelet command-line flags with the Kubelet's local configuration file. Command-line flags that overlap with the config file always take precedence over both the local configuration file and dynamic configurations, for backwards-compatibility.
-->
請注意，預設的最後一次正確配置是 Kubelet 命令列標誌與 Kubelet 的本地配置檔案的組合。
與配置檔案重疊的命令列標誌始終優先於本地配置檔案和動態配置，以實現向後相容。

<!--
See the following diagram for a high-level overview of a configuration update for a single Node:
-->
有關單個節點的配置更新的高階概述，請參見下圖：

![kubelet-diagram](/images/blog/2018-07-11-dynamic-kubelet-configuration/kubelet-diagram.png)

<!--
## How can I learn more?
-->
## 我如何瞭解更多？

<!--
Please see the official tutorial at /docs/tasks/administer-cluster/reconfigure-kubelet/, which contains more in-depth details on user workflow, how a configuration becomes "last-known-good," how the Kubelet "checkpoints" config, and possible failure modes.
-->
請參閱/docs/tasks/administer-cluster/reconfigure-kubelet/上的官方教程，
其中包含有關使用者工作流，某配置如何成為“最新的正確的”配置，Kubelet 如何對配置執行“檢查點”操作等，
更多詳細資訊，以及可能的故障模式。
