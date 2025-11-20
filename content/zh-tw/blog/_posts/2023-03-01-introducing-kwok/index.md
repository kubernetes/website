---
layout: blog
title: "介紹 KWOK（Kubernetes WithOut Kubelet，沒有 Kubelet 的 Kubernetes）"
date: 2023-03-01
slug: introducing-kwok
---
<!--
layout: blog
title: "Introducing KWOK: Kubernetes WithOut Kubelet"
date: 2023-03-01
slug: introducing-kwok
canonicalUrl: https://kubernetes.dev/blog/2023/03/01/introducing-kwok/
-->

<!--
**Author:** Shiming Zhang (DaoCloud), Wei Huang (Apple), Yibo Zhuang (Apple)
-->
**作者:** Shiming Zhang (DaoCloud), Wei Huang (Apple), Yibo Zhuang (Apple)

**譯者:** Michael Yao (DaoCloud)

<img style="float: right; display: inline-block; margin-left: 2em; max-width: 15em;" src="/blog/2023/03/01/introducing-kwok/kwok.svg" alt="KWOK logo" />

<!--
Have you ever wondered how to set up a cluster of thousands of nodes just in seconds, how to simulate real nodes with a low resource footprint, and how to test your Kubernetes controller at scale without spending much on infrastructure?

If you answered "yes" to any of these questions, then you might be interested in KWOK, a toolkit that enables you to create a cluster of thousands of nodes in seconds.
-->
你是否曾想過在幾秒鐘內搭建一個由數千個節點構成的叢集，如何用少量資源模擬真實的節點，
如何不耗費太多基礎設施就能大規模地測試你的 Kubernetes 控制器？

如果你曾有過這些想法，那你可能會對 KWOK 有興趣。
KWOK 是一個工具包，能讓你在幾秒鐘內創建數千個節點構成的叢集。

<!--
## What is KWOK?

KWOK stands for Kubernetes WithOut Kubelet. So far, it provides two tools:
-->
## 什麼是 KWOK？   {#what-is-kwok}

KWOK 是 Kubernetes WithOut Kubelet 的縮寫，即沒有 Kubelet 的 Kubernetes。
到目前爲止，KWOK 提供了兩個工具：

<!--
`kwok`
: `kwok` is the cornerstone of this project, responsible for simulating the lifecycle of fake nodes, pods, and other Kubernetes API resources.

`kwokctl`
: `kwokctl` is a CLI tool designed to streamline the creation and management of clusters, with nodes simulated by `kwok`.
-->
`kwok`
: `kwok` 是這個項目的基石，負責模擬僞節點、Pod 和其他 Kubernetes API 資源的生命週期。

`kwokctl`
: `kwokctl` 是一個 CLI 工具，設計用於簡化創建和管理由 `kwok` 模擬節點組成的叢集。

<!--
## Why use KWOK?

KWOK has several advantages:
-->
## 爲什麼使用 KWOK？   {#why-use-kwok}

KWOK 具有下面幾點優勢：

<!--
- **Speed**: You can create and delete clusters and nodes almost instantly, without waiting for boot or provisioning.
- **Compatibility**: KWOK works with any tools or clients that are compliant with Kubernetes APIs, such as kubectl, helm, kui, etc.
- **Portability**: KWOK has no specific hardware or software requirements. You can run it using pre-built images, once Docker or Nerdctl is installed. Alternatively, binaries are also available for all platforms and can be easily installed.
- **Flexibility**: You can configure different node types, labels, taints, capacities, conditions, etc., and you can configure different pod behaviors, status, etc. to test different scenarios and edge cases.
- **Performance**: You can simulate thousands of nodes on your laptop without significant consumption of CPU or memory resources.
-->
- **速度**：你幾乎可以實時創建和刪除叢集及節點，無需等待引導或製備過程。
- **兼容性**：KWOK 能夠與兼容 Kubernetes API 的所有工具或客戶端（例如 kubectl、helm、kui）協同作業。
- **可移植性**：KWOK 沒有特殊的軟硬件要求。一旦安裝了 Docker 或 Nerdctl，你就可以使用預先構建的映像檔來運行 KWOK。
  另外，二進制檔案包適用於所有平臺，安裝簡單。
- **靈活**：你可以設定不同類型的節點、標籤、污點、容量、狀況等，還可以設定不同的 Pod
  行爲和狀態來測試不同的場景和邊緣用例。
- **性能**：你在自己的筆記本電腦上就能模擬數千個節點，無需大量消耗 CPU 或內存資源。

<!--
## What are the use cases?

KWOK can be used for various purposes:
-->
## 使用場景是什麼？   {#what-are-use-cases}

KWOK 可用於各種用途：

<!--
- **Learning**: You can use KWOK to learn about Kubernetes concepts and features without worrying about resource waste or other consequences. 
- **Development**: You can use KWOK to develop new features or tools for Kubernetes without accessing to a real cluster or requiring other components.
- **Testing**:
  - You can measure how well your application or controller scales with different numbers of nodes and(or) pods.
  - You can generate high loads on your cluster by creating many pods or services with different resource requests or limits.
  - You can simulate node failures or network partitions by changing node conditions or randomly deleting nodes.
  - You can test how your controller interacts with other components or features of Kubernetes by enabling different feature gates or API versions.
-->
- **學習**：你可以使用 KWOK 學習 Kubernetes 概念和特性，無需顧慮資源浪費或其他後果。
- **開發**：你可以使用 KWOK 爲 Kubernetes 開發新特性或新工具，無需接入真實的叢集，也不需要其他組件。
- **測試**：
  - 你可以衡量自己的應用程式或控制器在使用不同數量節點和 Pod 時的擴縮表現如何。
  - 你可以用不同的資源請求或限制創建大量 Pod 或服務，在叢集上營造高負載的環境。
  - 你可以通過更改節點狀況或隨機刪除節點來模擬節點故障或網路分區。
  - 你可以通過啓用不同的特性門控或 API 版本來測試控制器如何與其他組件交互。

<!--
## What are the limitations?

KWOK is not intended to replace others completely. It has some limitations that you should be aware of:
-->
## 有哪些限制？   {#what-are-limiations}

KWOK 並非試圖完整替代其他什麼。當然也有一些限制需要你多加註意：

<!--
- **Functionality**: KWOK is not a kubelet and may exhibit different behaviors in areas such as pod lifecycle management, volume mounting, and device plugins. Its primary function is to simulate updates of node and pod status.
- **Accuracy**: It's important to note that KWOK doesn't accurately reflect the performance or behavior of real nodes under various workloads or environments. Instead, it approximates some behaviors using simple formulas.
- **Security**: KWOK does not enforce any security policies or mechanisms on simulated nodes. It assumes that all requests from the kube-apiserver are authorized and valid.
-->
- **功能性**：KWOK 不是 kubelet。KWOK 在 Pod 生命週期管理、卷掛載和設備插件方面所展現的行爲與 kubelet 不同。
  KWOK 的主要功能是模擬節點和 Pod 狀態的更新。
- **準確性**：需要重點注意 KWOK 還不能確切地反映各種工作負載或環境下真實節點的性能或行爲。
  KWOK 只能使用一些公式來逼近真實的節點行爲。
- **安全性**：KWOK 沒有對模擬的節點實施任何安全策略或安全機制。
  KWOK 假定來自 kube-apiserver 的所有請求都是經過授權且是有效的。

<!--
## Getting started

If you are interested in trying out KWOK, please check its [documents] for more details.
-->
## 入門   {#getting-started}

如果你對試用 KWOK 感興趣，請查閱 [KWOK 文檔](https://kwok.sigs.k8s.io/)瞭解詳情。

<!--
{{< figure src="/blog/2023/03/01/introducing-kwok/manage-clusters.svg" alt="Animation of a terminal showing kwokctl in use" caption="Using kwokctl to manage simulated clusters" >}}
-->
{{< figure src="/blog/2023/03/01/introducing-kwok/manage-clusters.svg" alt="在終端上使用 kwokctl 的動圖" caption="使用 kwokctl 管理模擬的叢集" >}}

<!--
## Getting Involved

If you're interested in participating in future discussions or development related to KWOK, there are several ways to get involved:
-->
## 歡迎參與   {#getting-involved}

如果你想參與討論 KWOK 的未來或參與開發，可通過以下幾種方式參與進來：

<!--
- Slack: [#kwok] for general usage discussion, [#kwok-dev] for development discussion. (visit [slack.k8s.io] for a workspace invitation)
- Open Issues/PRs/Discussions in [sigs.k8s.io/kwok]
-->
- Slack [#kwok] 討論一般用法，Slack [#kwok-dev] 討論開發問題（訪問 [slack.k8s.io] 獲取 KWOK 工作空間的邀請鏈接）
- 在 [sigs.k8s.io/kwok] 上提出 Issue/PR/Discussion

<!--
We welcome feedback and contributions from anyone who wants to join us in this exciting project.
-->
我們歡迎所有想要加入這個項目的貢獻者，歡迎任何形式的反饋和貢獻。

[documents]: https://kwok.sigs.k8s.io/
[sigs.k8s.io/kwok]: https://sigs.k8s.io/kwok/
[#kwok]: https://kubernetes.slack.com/messages/kwok/
[#kwok-dev]: https://kubernetes.slack.com/messages/kwok-dev/
[slack.k8s.io]: https://slack.k8s.io/
