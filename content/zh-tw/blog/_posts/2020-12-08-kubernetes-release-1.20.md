---
layout: blog
title: 'Kubernetes 1.20: 最新版本'
date: 2020-12-08
slug: kubernetes-1-20-release-announcement
evergreen: true
---

<!-- ---
layout: blog
title: 'Kubernetes 1.20: The Raddest Release'
date: 2020-12-08
slug: kubernetes-1-20-release-announcement
evergreen: true
--- -->

**作者:** [Kubernetes 1.20 發佈團隊](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.20/release_team.md)
<!-- **Authors:** [Kubernetes 1.20 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.20/release_team.md) -->

我們很高興地宣佈 Kubernetes 1.20 的發佈，這是我們 2020 年的第三個也是最後一個版本！此版本包含 42 項增強功能：11 項增強功能已升級到穩定版，15 項增強功能正在進入測試版，16 項增強功能正在進入 Alpha 版。
<!-- We’re pleased to announce the release of Kubernetes 1.20, our third and final release of 2020! This release consists of 42 enhancements: 11 enhancements have graduated to stable, 15 enhancements are moving to beta, and 16 enhancements are entering alpha. -->

1.20 發佈週期在上一個延長的發佈週期之後恢復到 11 周的正常節奏。這是一段時間以來功能最密集的版本之一：Kubernetes 創新週期仍呈上升趨勢。此版本具有更多的 Alpha 而非穩定的增強功能，表明雲原生生態系統仍有許多需要探索的地方。
<!-- The 1.20 release cycle returned to its normal cadence of 11 weeks following the previous extended release cycle. This is one of the most feature dense releases in a while: the Kubernetes innovation cycle is still trending upward. This release has more alpha than stable enhancements, showing that there is still much to explore in the cloud native ecosystem. -->

## 主題 {#major-themes}
<!-- ## Major Themes -->

### Volume 快照操作變得穩定 {#volume-snapshot-operations-goes-stable}

<!-- This feature provides a standard way to trigger volume snapshot operations and allows users to incorporate snapshot operations in a portable manner on any Kubernetes environment and supported storage providers. -->
此功能提供了觸發卷快照操作的標準方法，並允許使用者以可移植的方式在任何 Kubernetes 環境和支持的存儲提供程序上合併快照操作。

<!-- Additionally, these Kubernetes snapshot primitives act as basic building blocks that unlock the ability to develop advanced, enterprise-grade, storage administration features for Kubernetes, including application or cluster level backup solutions. -->
此外，這些 Kubernetes 快照原語充當基本構建塊，解鎖爲 Kubernetes 開發高級企業級存儲管理功能的能力，包括應用程序或叢集級備份解決方案。

<!-- Note that snapshot support requires Kubernetes distributors to bundle the Snapshot controller, Snapshot CRDs, and validation webhook. A CSI driver supporting the snapshot functionality must also be deployed on the cluster. -->
請注意，快照支持要求 Kubernetes 分銷商捆綁 Snapshot 控制器、Snapshot CRD 和驗證 webhook。還必須在叢集上部署支持快照功能的 CSI 驅動程序。



<!-- ### Kubectl Debug Graduates to Beta -->
### Kubectl Debug 功能升級到 Beta {#kubectl-debug-graduates-to-beta}

<!-- The `kubectl alpha debug` features graduates to beta in 1.20, becoming `kubectl debug`. The feature provides support for common debugging workflows directly from kubectl. Troubleshooting scenarios supported in this release of kubectl include: -->
`kubectl alpha debug` 功能在 1.20 中升級到測試版，成爲 `kubectl debug`. 該功能直接從 kubectl 提供對常見調試工作流的支持。此版本的 kubectl 支持的故障排除場景包括：

<!-- * Troubleshoot workloads that crash on startup by creating a copy of the pod that uses a different container image or command.
* Troubleshoot distroless containers by adding a new container with debugging tools, either in a new copy of the pod or using an ephemeral container. (Ephemeral containers are an alpha feature that are not enabled by default.)
* Troubleshoot on a node by creating a container running in the host namespaces and with access to the host’s filesystem. -->
* 通過創建使用不同容器映像或命令的 pod 副本，對在啓動時崩潰的工作負載進行故障排除。
* 通過在 pod 的新副本或使用臨時容器中添加帶有調試工具的新容器來對 distroless 容器進行故障排除。（臨時容器是默認未啓用的 alpha 功能。）
* 通過創建在主機命名空間中運行並可以訪問主機文件系統的容器來對節點進行故障排除。

<!-- Note that as a new built-in command, `kubectl debug` takes priority over any kubectl plugin named “debug”. You must rename the affected plugin. -->
請注意，作爲新的內置命令，`kubectl debug` 優先於任何名爲 “debug” 的 kubectl 插件。你必須重命名受影響的插件。

<!-- Invocations using `kubectl alpha debug` are now deprecated and will be removed in a subsequent release. Update your scripts to use `kubectl debug`. For more information about `kubectl debug`, see [Debugging Running Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/). -->
`kubectl alpha debug` 現在不推薦使用，並將在後續版本中刪除。更新你的腳本以使用 `kubectl debug`。 有關更多信息 `kubectl debug`，請參閱[調試正在運行的 Pod]((https://kubernetes.io/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)。

<!-- ### Beta: API Priority and Fairness -->
### 測試版：API 優先級和公平性 {#beta-api-priority-and-fairness)

<!-- Introduced in 1.18, Kubernetes 1.20 now enables API Priority and Fairness (APF) by default. This allows `kube-apiserver` to categorize incoming requests by priority levels. -->
Kubernetes 1.20 由 1.18 引入，現在默認啓用 API 優先級和公平性 (APF)。這允許 `kube-apiserver` 按優先級對傳入請求進行分類。

<!-- ### Alpha with updates: IPV4/IPV6 -->
### Alpha 更新：IPV4/IPV6 {#alpha-with-updates-ipv4-ipv6}

<!-- The IPv4/IPv6 dual stack has been reimplemented to support dual stack services based on user and community feedback. This allows both IPv4 and IPv6 service cluster IP addresses to be assigned to a single service, and also enables a service to be transitioned from single to dual IP stack and vice versa. -->
基於使用者和社區反饋，重新實現了 IPv4/IPv6 雙棧以支持雙棧服務。
這允許將 IPv4 和 IPv6 服務叢集 IP 地址分配給單個服務，還允許服務從單 IP 堆棧轉換爲雙 IP 堆棧，反之亦然。

<!-- ### GA: Process PID Limiting for Stability -->
### GA：進程 PID 穩定性限制 {#ga-process-pid-limiting-for-stability}

<!-- Process IDs (pids) are a fundamental resource on Linux hosts. It is trivial to hit the task limit without hitting any other resource limits and cause instability to a host machine. -->
進程 ID (pid) 是 Linux 主機上的基本資源。達到任務限制而不達到任何其他資源限制並導致主機不穩定是很可能發生的。

<!-- Administrators require mechanisms to ensure that user pods cannot induce pid exhaustion that prevents host daemons (runtime, kubelet, etc) from running. In addition, it is important to ensure that pids are limited among pods in order to ensure they have limited impact to other workloads on the node. -->
<!-- After being enabled-by-default for a year, SIG Node graduates PID Limits to GA on both `SupportNodePidsLimit` (node-to-pod PID isolation) and `SupportPodPidsLimit` (ability to limit PIDs per pod). -->
管理員需要機制來確保使用者 pod 不會導致 pid 耗盡，從而阻止主機守護程序（運行時、kubelet 等）運行。此外，重要的是要確保 pod 之間的 pid 受到限制，以確保它們對節點上的其他工作負載的影響有限。
默認啓用一年後，SIG Node 在 `SupportNodePidsLimit`（節點到 Pod PID 隔離）和 `SupportPodPidsLimit`（限制每個 Pod 的 PID 的能力）上都將 PID 限制升級爲 GA。

<!-- ### Alpha: Graceful node shutdown -->
### Alpha：節點體面地關閉 {#alpha-graceful-node-shutdown}

<!-- Users and cluster administrators expect that pods will adhere to expected pod lifecycle including pod termination. Currently, when a node shuts down, pods do not follow the expected pod termination lifecycle and are not terminated gracefully which can cause issues for some workloads.
The `GracefulNodeShutdown` feature is now in Alpha. `GracefulNodeShutdown` makes the kubelet aware of node system shutdowns, enabling graceful termination of pods during a system shutdown. -->
使用者和叢集管理員希望 Pod 遵守預期的 Pod 生命週期，包括 Pod 終止。目前，當一個節點關閉時，Pod 不會遵循預期的 Pod 終止生命週期，也不會正常終止，這可能會導致某些工作負載出現問題。
該 `GracefulNodeShutdown` 功能現在處於 Alpha 階段。`GracefulNodeShutdown` 使 kubelet 知道節點系統關閉，從而在系統關閉期間正常終止 pod。

<!-- ## Major Changes -->
## 主要變化 {#major-changes}

<!-- ### Dockershim Deprecation -->
### Dockershim 棄用 {#dockershim-deprecation}

<!-- Dockershim, the container runtime interface (CRI) shim for Docker is being deprecated. Support for Docker is deprecated and will be removed in a future release. Docker-produced images will continue to work in your cluster with all CRI compliant runtimes as Docker images follow the Open Container Initiative (OCI) image specification.
The Kubernetes community has written a [detailed blog post about deprecation](https://blog.k8s.io/2020/12/02/dont-panic-kubernetes-and-docker/) with [a dedicated FAQ page for it](https://blog.k8s.io/2020/12/02/dockershim-faq/). -->
Dockershim，Docker 的容器運行時接口 (CRI) shim 已被棄用。不推薦使用對 Docker 的支持，並將在未來版本中刪除。由於 Docker 映像遵循開放容器計劃 (OCI) 映像規範，因此 Docker 生成的映像將繼續在具有所有 CRI 兼容運行時的叢集中工作。
Kubernetes 社區寫了一篇關於棄用的詳細[博客文章](https://blog.k8s.io/2020/12/02/dont-panic-kubernetes-and-docker/)，併爲其提供了一個專門的常見問題[解答頁面](https://blog.k8s.io/2020/12/02/dockershim-faq/)。

<!-- ### Exec Probe Timeout Handling -->
### Exec 探測超時處理 {#exec-probe-timeout-handling}

<!-- A longstanding bug regarding exec probe timeouts that may impact existing pod definitions has been fixed. Prior to this fix, the field `timeoutSeconds` was not respected for exec probes. Instead, probes would run indefinitely, even past their configured deadline, until a result was returned. With this change, the default value of `1 second` will be applied if a value is not specified and existing pod definitions may no longer be sufficient if a probe takes longer than one second. A feature gate, called `ExecProbeTimeout`, has been added with this fix that enables cluster operators to revert to the previous behavior, but this will be locked and removed in subsequent releases. In order to revert to the previous behavior, cluster operators should set this feature gate to `false`. -->
一個關於 exec 探測超時的長期錯誤可能會影響現有的 pod 定義，已得到修復。在此修復之前，exec 探測器不考慮 `timeoutSeconds` 字段。相反，探測將無限期運行，甚至超過其設定的截止日期，直到返回結果。
通過此更改，如果未指定值，將應用默認值 `1 second`，並且如果探測時間超過一秒，現有 pod 定義可能不再足夠。
新引入的 `ExecProbeTimeout` 特性門控所提供的修復使叢集操作員能夠恢復到以前的行爲，但這種行爲將在後續版本中鎖定並刪除。爲了恢復到以前的行爲，叢集運營商應該將此特性門控設置爲 `false`。

<!-- Please review the updated documentation regarding [configuring probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) for more details. -->
有關更多詳細信息，請查看有關設定探針的[更新文檔](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes)。

<!-- ## Other Updates -->
## 其他更新 {#other-updates}

<!-- ### Graduated to Stable -->
### 穩定版 {#graduated-to-stable}

<!-- * [RuntimeClass](https://github.com/kubernetes/enhancements/issues/585)
* [Built-in API Types Defaults](https://github.com/kubernetes/enhancements/issues/1929)
* [Add Pod-Startup Liveness-Probe Holdoff](https://github.com/kubernetes/enhancements/issues/950)
* [Support CRI-ContainerD On Windows](https://github.com/kubernetes/enhancements/issues/1001)
* [SCTP Support for Services](https://github.com/kubernetes/enhancements/issues/614)
* [Adding AppProtocol To Services And Endpoints](https://github.com/kubernetes/enhancements/issues/1507) -->
* [RuntimeClass](https://github.com/kubernetes/enhancements/issues/585)
* [內置 API 類型默認值](https://github.com/kubernetes/enhancements/issues/1929)
* [添加了對 Pod 層面啓動探針和活躍性探針的扼制](https://github.com/kubernetes/enhancements/issues/950)
* [在 Windows 上支持 CRI-ContainerD](https://github.com/kubernetes/enhancements/issues/1001)
* [SCTP 對 Services 的支持](https://github.com/kubernetes/enhancements/issues/614)
* [將 AppProtocol 添加到 Services 和 Endpoints 上](https://github.com/kubernetes/enhancements/issues/1507) 

<!-- ### Notable Feature Updates -->
### 值得注意的功能更新 {#notable-feature-updates}

<!-- * [CronJobs](https://github.com/kubernetes/enhancements/issues/19) -->
* [CronJobs](https://github.com/kubernetes/enhancements/issues/19)

<!-- # Release notes -->
# 發行說明 {#release-notes}

<!-- You can check out the full details of the 1.20 release in the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md). -->
你可以在[發行說明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md)中查看 1.20 發行版的完整詳細信息。

<!-- # Availability of release -->
# 可用的發佈 {#availability-of-release}

<!-- Kubernetes 1.20 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.20.0). There are some great resources out there for getting started with Kubernetes. You can check out some [interactive tutorials](https://kubernetes.io/docs/tutorials/) on the main Kubernetes site, or run a local cluster on your machine using Docker containers with [kind](https://kind.sigs.k8s.io). If you’d like to try building a cluster from scratch, check out the [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) tutorial by Kelsey Hightower. -->
Kubernetes 1.20 可在 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.20.0) 上下載。有一些很棒的資源可以幫助你開始使用 Kubernetes。你可以在 Kubernetes 主站點上查看一些[交互式教程](https://kubernetes.io/docs/tutorials/)，或者使用 [kind](https://kind.sigs.k8s.io) 的 Docker 容器在你的機器上運行本地叢集。如果你想嘗試從頭開始構建叢集，請查看 Kelsey Hightower 的 [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) 教程。

<!-- # Release Team -->
# 發佈團隊 {#release-team}

<!-- This release was made possible by a very dedicated group of individuals, who came together as a team in the midst of a lot of things happening out in the world. A huge thank you to the release lead Jeremy Rickard, and to everyone else on the release team for supporting each other, and working so hard to deliver the 1.20 release for the community. -->
這個版本是由一羣非常敬業的人促成的，他們在世界上發生的許多事情的時段作爲一個團隊走到了一起。
非常感謝發佈負責人 Jeremy Rickard 以及發佈團隊中的其他所有人，感謝他們相互支持，並努力爲社區發佈 1.20 版本。

<!-- # Release Logo -->
# 發佈 Logo {#release-logo}

![Kubernetes 1.20 Release Logo](/images/blog/2020-12-08-kubernetes-1.20-release-announcement/laser.png)

[raddest](https://www.dictionary.com/browse/rad): *adjective*, Slang. excellent; wonderful; cool:

<!-- > The Kubernetes 1.20 Release has been the raddest release yet. -->
> Kubernetes 1.20 版本是迄今爲止最激動人心的版本。

<!-- 2020 has been a challenging year for many of us, but Kubernetes contributors have delivered a record-breaking number of enhancements in this release. That is a great accomplishment, so the release lead wanted to end the year with a little bit of levity and pay homage to [Kubernetes 1.14 - Caturnetes](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.14) with a "rad" cat named Humphrey. -->
2020 年對我們中的許多人來說都是充滿挑戰的一年，但 Kubernetes 貢獻者在此版本中提供了創紀錄的增強功能。這是一項了不起的成就，因此發佈負責人希望以一點輕鬆的方式結束這一年，並向 [Kubernetes 1.14 - Caturnetes](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.14) 和一隻名叫 Humphrey 的 “rad” 貓致敬。

<!-- Humphrey is the release lead's cat and has a permanent [`blep`](https://www.inverse.com/article/42316-why-do-cats-blep-science-explains). *Rad* was pretty common slang in the 1990s in the United States, and so were laser backgrounds. Humphrey in a 1990s style school picture felt like a fun way to end the year. Hopefully, Humphrey and his *blep* bring you a little joy at the end of 2020! -->
Humphrey是發佈負責人的貓，有一個永久的 `blep`. 在 1990 年代，*Rad* 是美國非常普遍的俚語，激光背景也是如此。Humphrey 在 1990 年代風格的學校照片中感覺像是結束這一年的有趣方式。希望 Humphrey 和它的 *blep* 在 2020 年底給你帶來一點快樂！

<!-- The release logo was created by [Henry Hsu - @robotdancebattle](https://www.instagram.com/robotdancebattle/). -->
發佈標誌由 [Henry Hsu - @robotdancebattle](https://www.instagram.com/robotdancebattle/) 創建。

<!-- # User Highlights -->
# 使用者亮點 {#user-highlights}

<!-- - Apple is operating multi-thousand node Kubernetes clusters in data centers all over the world. Watch [Alena Prokharchyk's KubeCon NA Keynote](https://youtu.be/Tx8qXC-U3KM) to learn more about their cloud native journey. -->
- Apple 正在世界各地的數據中心運行數千個節點的 Kubernetes 叢集。觀看 [Alena Prokarchyk](https://youtu.be/Tx8qXC-U3KM) 的 KubeCon NA 主題演講，瞭解有關他們的雲原生之旅的更多信息。

<!-- # Project Velocity -->
# 項目速度 {#project-velocity}

<!-- The [CNCF K8s DevStats project](https://k8s.devstats.cncf.io/) aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing, and is a neat illustration of the depth and breadth of effort that goes into evolving this ecosystem. -->
[CNCF K8S DevStats 項目](https://k8s.devstats.cncf.io/)聚集了許多有關Kubernetes和各分項目的速度有趣的數據點。這包括從個人貢獻到做出貢獻的公司數量的所有內容，並且清楚地說明了爲發展這個生態系統所做的努力的深度和廣度。

<!-- In the v1.20 release cycle, which ran for 11 weeks (September 25 to December 9), we saw contributions from [967 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions) and [1335 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All) ([44 of whom](https://k8s.devstats.cncf.io/d/52/new-contributors?orgId=1&from=1601006400000&to=1607576399000&var-repogroup_name=Kubernetes) made their first Kubernetes contribution) from [26 countries](https://k8s.devstats.cncf.io/d/50/countries-stats?orgId=1&from=1601006400000&to=1607576399000&var-period_name=Quarter&var-countries=All&var-repogroup_name=Kubernetes&var-metric=rcommitters&var-cum=countries). -->
在持續 11 周（9 月 25 日至 12 月 9 日）的 v1.20 發佈週期中，我們看到了來自 [26 個國家/地區](https://k8s.devstats.cncf.io/d/50/countries-stats?orgId=1&from=1601006400000&to=1607576399000&var-period_name=Quarter&var-countries=All&var-repogroup_name=Kubernetes&var-metric=rcommitters&var-cum=countries) 的 [967 家公司](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions) 和 [1335 名個人](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All)（其中 [44 人](https://k8s.devstats.cncf.io/d/52/new-contributors?orgId=1&from=1601006400000&to=1607576399000&var-repogroup_name=Kubernetes)首次爲 Kubernetes 做出貢獻）的貢獻。

<!-- # Ecosystem Updates -->
# 生態系統更新 {#ecosystem-updates}

<!-- - KubeCon North America just wrapped up three weeks ago, the second such event to be virtual! All talks are [now available to all on-demand](https://www.youtube.com/playlist?list=PLj6h78yzYM2Pn8RxfLh2qrXBDftr6Qjut) for anyone still needing to catch up!
- In June, the Kubernetes community formed a new working group as a direct response to the Black Lives Matter protests occurring across America. WG Naming's goal is to remove harmful and unclear language in the Kubernetes project as completely as possible and to do so in a way that is portable to other CNCF projects. A great introductory talk on this important work and how it is conducted was given [at KubeCon 2020 North America](https://sched.co/eukp), and the initial impact of this labor [can actually be seen in the v1.20 release](https://github.com/kubernetes/enhancements/issues/2067).
- Previously announced this summer, [The Certified Kubernetes Security Specialist (CKS) Certification](https://www.cncf.io/announcements/2020/11/17/kubernetes-security-specialist-certification-now-available/) was released during Kubecon NA for immediate scheduling!  Following the model of CKA and CKAD, the CKS is a performance-based exam, focused on security-themed competencies and domains.  This exam is targeted at current CKA holders, particularly those who want to round out their baseline knowledge in securing cloud workloads (which is all of us, right?). -->
- KubeCon North America 三週前剛剛結束，這是第二個虛擬的此類活動！現在所有演講都可以[點播](https://www.youtube.com/playlist?list=PLj6h78yzYM2Pn8RxfLh2qrXBDftr6Qjut)，供任何需要趕上的人使用！
- 6 月，Kubernetes 社區成立了一個新的工作組，作爲對美國各地發生的 Black Lives Matter 抗議活動的直接回應。WG Naming 的目標是儘可能徹底地刪除 Kubernetes 項目中有害和不清楚的語言，並以可移植到其他 CNCF 項目的方式進行。在 [KubeCon 2020 North America](https://sched.co/eukp) 上就這項重要工作及其如何進行進行了精彩的介紹性演講，這項工作的初步影響[實際上可以在 v1.20 版本中看到](https://github.com/kubernetes/enhancements/issues/2067)。
- 此前於今年夏天宣佈，在 Kubecon NA 期間發佈了經認證的 [Kubernetes 安全專家 (CKS) 認證](https://www.cncf.io/announcements/2020/11/17/kubernetes-security-specialist-certification-now-available/) ，以便立即安排！遵循 CKA 和 CKAD 的模型，CKS 是一項基於性能的考試，側重於以安全爲主題的能力和領域。該考試面向當前的 CKA 持有者，尤其是那些想要完善其在保護雲工作負載方面的基礎知識的人（這是我們所有人，對吧？）。
  


<!-- # Event Updates -->
# 活動更新 {#event-updates}

<!-- KubeCon + CloudNativeCon Europe 2021 will take place May 4 - 7, 2021! Registration will open on January 11. You can find more information about the conference [here](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/). Remember that [the CFP](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/program/cfp/) closes on Sunday, December 13, 11:59pm PST! -->
KubeCon + CloudNativeCon Europe 2021 將於 2021 年 5 月 4 日至 7 日舉行！註冊將於 1 月 11 日開放。你可以在[此處](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/)找到有關會議的更多信息。
請記住，[CFP](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/program/cfp/) 將於太平洋標準時間 12 月 13 日星期日晚上 11:59 關閉！

<!-- # Upcoming release webinar -->
# 即將發佈的網路研討會 {#upcoming-release-webinar}

<!-- Stay tuned for the upcoming release webinar happening this January. -->
請繼續關注今年 1 月即將舉行的發佈網路研討會。

<!-- # Get Involved -->
# 參與其中 {#get-involved}

<!-- If you’re interested in contributing to the Kubernetes community, Special Interest Groups (SIGs) are a great starting point. Many of them may align with your interests! If there are things you’d like to share with the community, you can join the weekly community meeting, or use any of the following channels: -->
如果你有興趣爲 Kubernetes 社區做出貢獻，那麼特別興趣小組 (SIG) 是一個很好的起點。其中許多可能符合你的興趣！如果你有什麼想與社區分享的內容，你可以參加每週的社區會議，或使用以下任一渠道：

<!-- * Find out more about contributing to Kubernetes at the new [Kubernetes Contributor website](https://www.kubernetes.dev/)
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team) -->

* 在新的 [Kubernetes Contributor 網站](https://www.kubernetes.dev/)上了解更多關於爲Kubernetes 做出貢獻的信息
* 在 Twitter [@Kubernetesio](https://twitter.com/kubernetesio) 上關注我們以獲取最新更新
* 加入關於討論的[社區](https://discuss.kubernetes.io/)討論
* 加入 [Slack 社區](http://slack.k8s.io/)
* 分享你的 [Kubernetes 故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* 在[博客](https://kubernetes.io/blog/)上閱讀更多關於 Kubernetes 發生的事情
* 瞭解有關 [Kubernetes 發佈團隊](https://github.com/kubernetes/sig-release/tree/master/release-team)的更多信息
