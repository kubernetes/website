---
layout: blog
title: 'kubeadm 七週年生日快樂！'
date: 2023-09-26
slug: happy-7th-birthday-kubeadm
---
<!--
layout: blog
title: 'Happy 7th Birthday kubeadm!'
date: 2023-09-26
slug: happy-7th-birthday-kubeadm
-->

<!--
**Author:** Fabrizio Pandini (VMware)
-->
**作者:** Fabrizio Pandini (VMware)

**譯者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
What a journey so far!

Starting from the initial blog post [“How we made Kubernetes insanely easy to install”](/blog/2016/09/how-we-made-kubernetes-easy-to-install/) in September 2016, followed by an exciting growth that lead to general availability / [“Production-Ready Kubernetes Cluster Creation with kubeadm”](/blog/2018/12/04/production-ready-kubernetes-cluster-creation-with-kubeadm/) two years later.

And later on a continuous, steady and reliable flow of small improvements that is still going on as of today.
-->
回首向來蕭瑟處，七年光陰風雨路！

從 2016 年 9 月發表第一篇博文
[How we made Kubernetes insanely easy to install](/blog/2016/09/how-we-made-kubernetes-easy-to-install/)
開始，kubeadm 經歷了令人激動的成長旅程，兩年後隨着
[Production-Ready Kubernetes Cluster Creation with kubeadm](/blog/2018/12/04/production-ready-kubernetes-cluster-creation-with-kubeadm/)
這篇博文的發表進階爲正式發佈。

此後，持續、穩定且可靠的系列小幅改進一直延續至今。

<!--
## What is kubeadm? (quick refresher)

kubeadm is focused on bootstrapping Kubernetes clusters on existing infrastructure and performing an essential set of maintenance tasks. The core of the kubeadm interface is quite simple: new control plane nodes
are created by running [`kubeadm init`](/docs/reference/setup-tools/kubeadm/kubeadm-init/) and
worker nodes are joined to the control plane by running
[`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join/).
Also included are utilities for managing already bootstrapped clusters, such as control plane upgrades
and token and certificate renewal.
-->
## 什麼是 kubeadm？（簡要回顧）

kubeadm 專注於在現有基礎設施上啓動引導 Kubernetes 叢集並執行一組重要的維護任務。
kubeadm 接口的核心非常簡單：通過運行
[`kubeadm init`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
創建新的控制平面節點，通過運行
[`kubeadm join`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
將工作節點加入控制平面。此外還有用於管理已啓動引導的叢集的實用程序，例如控制平面升級、令牌和證書續訂等。

<!--
To keep kubeadm lean, focused, and vendor/infrastructure agnostic, the following tasks are out of its scope:
- Infrastructure provisioning
- Third-party networking
- Non-critical add-ons, e.g. for monitoring, logging, and visualization
- Specific cloud provider integrations
-->
爲了使 kubeadm 精簡、聚焦且與供應商/基礎設施無關，以下任務不包括在其範圍內：

- 基礎設施製備
- 第三方聯網
- 例如監視、日誌記錄和可視化等非關鍵的插件
- 特定雲驅動集成

<!--
Infrastructure provisioning, for example, is left to other SIG Cluster Lifecycle projects, such as the
[Cluster API](https://cluster-api.sigs.k8s.io/). Instead, kubeadm covers only the common denominator
in every Kubernetes cluster: the
[control plane](/docs/concepts/overview/components/#control-plane-components).
The user may install their preferred networking solution and other add-ons on top of Kubernetes
*after* cluster creation.
-->
例如，基礎設施製備留給 SIG Cluster Lifecycle 等其他項目來處理，
比如 [Cluster API](https://cluster-api.sigs.k8s.io/)。
kubeadm 僅涵蓋每個 Kubernetes 叢集中的共同要素：
[控制平面](/zh-cn/docs/concepts/overview/components/#control-plane-components)。
使用者可以在叢集創建後安裝其偏好的聯網方案和其他插件。

<!--
Behind the scenes, kubeadm does a lot. The tool makes sure you have all the key components:
etcd, the API server, the scheduler, the controller manager. You can join more control plane nodes
for improving resiliency or join worker nodes for running your workloads. You get cluster DNS
and kube-proxy set up for you. TLS between components is enabled and used for encryption in transit.
-->
kubeadm 在幕後做了大量工作。它確保你擁有所有關鍵組件：etcd、API 伺服器、調度器、控制器管理器。
你可以加入更多的控制平面節點以提高容錯性，或者加入工作節點以運行你的工作負載。
kubeadm 還爲你設置好了叢集 DNS 和 kube-proxy；在各組件之間啓用 TLS 用於傳輸加密。

<!--
## Let's celebrate! Past, present and future of kubeadm

In all and for all kubeadm's story is tightly coupled with Kubernetes' story, and with this amazing community.

Therefore celebrating kubeadm is first of all celebrating this community, a set of people, who joined forces in finding a common ground, a minimum viable tool, for bootstrapping Kubernetes clusters.
-->
## 慶祝 kubeadm 的過去、現在和未來！

總之，kubeadm 的故事與 Kubernetes 深度耦合，也離不開這個令人驚歎的社區。

因此慶祝 kubeadm 首先是慶祝這個社區，一羣人共同努力尋找一個共同點，一個最小可行工具，用於啓動引導 Kubernetes 叢集。

<!--
This tool, was instrumental to the Kubernetes success back in time as well as it is today, and the silver line of kubeadm's value proposition can be summarized in two points

- An obsession in making things deadly simple for the majority of the users: kubeadm init & kubeadm join, that's all you need! 

- A sharp focus on a well-defined problem scope: bootstrapping Kubernetes clusters on existing infrastructure. As our slogan says: *keep it simple, keep it extensible!*
-->
kubeadm 這個工具對 Kubernetes 的成功起到了關鍵作用，其價值主張可以概括爲兩點：

- 極致的簡單：只需兩個命令 kubeadm init 和 kubeadm join 即可完成初始化和接入叢集的操作！讓大多數使用者輕鬆上手。

- 明確定義的問題範圍：專注於在現有基礎設施上啓動引導 Kubernetes 叢集。正如我們的口號所說：**保持簡單，保持可擴展！**

<!--
This silver line, this clear contract, is the foundation the entire kubeadm user base relies on, and this post is a celebration for kubeadm's users as well.

We are deeply thankful for any feedback from our users, for the enthusiasm that they are continuously showing for this tool via Slack, GitHub, social media, blogs, in person at every KubeCon or at the various meet ups around the world. Keep going!
-->
這個明確的約定是整個 kubeadm 使用者羣體所依賴的基石，同時本文也是爲了與 kubeadm 的使用者們共同歡慶。

我們由衷感謝使用者給予的反饋，感謝他們通過 Slack、GitHub、社交媒體、博客、每次 KubeCon
會面以及各種聚會上持續展現的熱情。來看看後續的發展！

<!--
What continues to amaze me after all those years is the great things people are building on top of kubeadm, and as of today there is a strong and very active list of projects doing so:
- [minikube](https://minikube.sigs.k8s.io/)
- [kind](https://kind.sigs.k8s.io/)
- [Cluster API](https://cluster-api.sigs.k8s.io/)
- [Kubespray](https://kubespray.io/)
- and many more; if you are using Kubernetes today, there is a good chance that you are using kubeadm even without knowing it 😜
-->
這麼多年來，對人們基於 kubeadm 構建的諸多項目我感到驚歎。迄今已經有很多強大而活躍的項目，例如：

- [minikube](https://minikube.sigs.k8s.io/)
- [kind](https://kind.sigs.k8s.io/)
- [Cluster API](https://cluster-api.sigs.k8s.io/)
- [Kubespray](https://kubespray.io/)
- 還有更多；如果你正在使用 Kubernetes，很可能你甚至不知道自己正在使用 kubeadm 😜

<!--
This community, the kubeadm’s users, the projects building on top of kubeadm are the highlights of kubeadm’s 7th birthday celebration and the foundation for what will come next!
-->
這個社區、kubeadm 的使用者以及基於 kubeadm 構建的項目，是 kubeadm 七週年慶典的亮點，也是未來怎麼發展的基礎！

<!--
Stay tuned, and feel free to reach out to us!
- Try [kubeadm](/docs/setup/) to install Kubernetes today
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
-->
請繼續關注我們，並隨時與我們聯繫！

- 現在嘗試使用 [kubeadm](/zh-cn/docs/setup/) 安裝 Kubernetes
- 在 [GitHub](https://github.com/kubernetes/kubernetes) 參與 Kubernetes 項目
- 在 [Slack](http://slack.k8s.io/) 與社區交流
- 關注我們的 Twitter 賬號 [@Kubernetesio](https://twitter.com/kubernetesio)，獲取最近更新信息
