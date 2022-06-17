---
title: Kubernetes 社群 - 2017 年開源排行榜榜首
date: 2018-04-25
slug: open-source-charts-2017
---
<!--
---
title: Kubernetes Community - Top of the Open Source Charts in 2017
date: 2018-04-25
slug: open-source-charts-2017
---
--->

<!--
2017 was a huge year for Kubernetes, and GitHub’s latest [Octoverse report](https://octoverse.github.com) illustrates just how much attention this project has been getting.

Kubernetes, an [open source platform for running application containers](/docs/concepts/overview/what-is-kubernetes/), provides a consistent interface that enables developers and ops teams to automate the deployment, management, and scaling of a wide variety of applications on just about any infrastructure.
--->
對於 Kubernetes 來說，2017 年是豐收的一年，GitHub的最新 [Octoverse 報告](https://octoverse.github.com) 說明了該專案獲得了多少關注。

Kubernetes 是 [用於執行應用程式容器的開源平臺](/docs/concepts/overview/what-is-kubernetes/)，它提供了一個統一的介面，使開發人員和操作團隊能夠自動執行部署、管理和擴充套件幾乎任何基礎架構上的各種應用程式。

<!--
Solving these shared challenges by leveraging a wide community of expertise and industrial experience, as Kubernetes does, helps engineers focus on building their own products at the top of the stack, rather than needlessly duplicating work that now exists as a standard part of the “cloud native” toolkit.

However, achieving these gains via ad-hoc collective organizing is its own unique challenge, one which makes it increasingly difficult to support open source, community-driven efforts through periods of rapid growth.

Read on to find out how the Kubernetes Community has addressed these scaling challenges to reach the top of the charts in GitHub’s 2017 Octoverse report.
--->
Kubernetes 所做的，是透過利用廣泛的專業知識和行業經驗來解決這些共同的挑戰，可以幫助工程師專注於在堆疊的頂部構建自己的產品，而不是不必要地進行重複工作，比如現在已經存在的 “雲原生” 工具包的標準部分。

但是，透過臨時的集體組織來實現這些收益是它獨有的挑戰，這使得支援開源，社群驅動的工作變得越來越困難。

繼續閱讀以瞭解 Kubernetes 社群如何解決這些挑戰，從而在 GitHub 的 2017 Octoverse 報告中位居榜首。

<!--
## Most-Discussed on GitHub

The top two most-discussed repos of 2017 are both based on Kubernetes:

![Most Discussed](/images/blog-logging/2018-04-24-open-source-charts-2017/most-discussed.png)

Of all the open source repositories on GitHub, none received more issue comments than [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/). [OpenShift](http://openshift.com/), a [CNCF certified distribution of Kubernetes](https://www.cncf.io/announcement/2017/11/13/cloud-native-computing-foundation-launches-certified-kubernetes-program-32-conformant-distributions-platforms/), took second place.  

Open discussion with ample time for community feedback and review helps build shared infrastructure and establish new standards for cloud native computing.
--->
## GitHub 上討論最多的

2017 年討論最多的兩個倉庫都是基於 Kubernetes 的：

！[討論最多](/images/blog-logging/2018-04-24-open-source-charts-2017/most-discussed.png)

在 GitHub 的所有開源儲存庫中，沒有比 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/) 收到更多的評論。 [OpenShift](http://openshift.com/)， [CNCF 認證的 Kubernetes 發行版](https://www.cncf.io/announcement/2017/11/13/cloud-native-computing-foundation-launches-certified-kubernetes-program-32-conformant-distributions-platforms/) 排名第二。

利用充足時間進行公開討論來獲取社群反饋和審查，有助於建立共享的基礎架構併為雲原生計算建立新標準。

<!--
## Most Reviewed on GitHub

Successfully scaling an open source effort’s communications often leads to better coordination and higher-quality feature delivery. The Kubernetes project’s [Special Interest Group (SIG)](https://github.com/kubernetes/community/blob/master/sig-list.md) structure has helped it become GitHub’s second most reviewed project:

![Most Reviewed](/images/blog-logging/2018-04-24-open-source-charts-2017/most-reviews.png)

Using SIGs to segment and standardize mechanisms for community participation helps channel more frequent reviews from better-qualified community members.

When managed effectively, active community discussions indicate more than just a highly contentious codebase, or a project with an extensive list of unmet needs.
--->
## GitHub 上審閱最多的

成功擴充套件開放原始碼工作的通訊通常會帶來更好的協調和更高質量的功能交付。Kubernetes 專案的 [Special Interest Group（SIG）](https://github.com/kubernetes/community/blob/master/sig-list.md) 結構已使其成為 GitHub 審閱第二多的專案：

！[審閱最多](/images/blog-logging/2018-04-24-open-source-charts-2017/most-reviews.png)

使用 SIG 對社群參與機制進行細分和標準化有助於從資格更高的社群成員中獲得更頻繁的審閱。

如果得到有效管理，活躍的社群討論不僅表明程式碼庫存在很大的爭議，也可能表明專案包含大量未滿足的需求。

<!--
Scaling a project’s capacity to handle issues and community interactions helps to expand the conversation.  Meanwhile, large communities come with more diverse use cases and a larger array of support problems to manage. The Kubernetes [SIG organization structure](https://github.com/kubernetes/community#sigs) helps to address the challenges of complex communication at scale.

SIG meetings provide focused opportunities for users, maintainers, and specialists from various disciplines to collaborate together in support of this community effort.  These investments in organizing help create an environment where it’s easier to prioritize architecture discussion and planning over commit velocity; enabling the project to sustain this kind of scale.
--->
擴充套件專案處理問題和社群互動的能力有助於擴大交流。同時，大型社群具有更多不同的用例和更多的支援問題需要管理。Kubernetes [SIG 組織結構](https://github.com/kubernetes/community#sigs) 幫助應對大規模複雜通訊的挑戰。

SIG 會議為不同學科的使用者、維護者和專家提供了重點合作的機會，以共同協作來支援社群的工作。這些在組織上的投資有助於建立一個環境，在這樣的環境中，可以更輕鬆地將架構討論和規劃的優先順序排到提交速度前面，並使專案能夠維持這種規模。

<!--
## Join the party!

You may already be using solutions that are successfully managed and scaled on Kubernetes. For example, GitHub.com, which hosts Kubernetes’ upstream source code, [now runs on Kubernetes](https://githubengineering.com/kubernetes-at-github/) as well!

Check out the [Kubernetes Contributors’ guide](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) for more information on how to get started as a contributor.

You can also join the [weekly Kubernetes Community meeting](https://github.com/kubernetes/community/tree/master/communication#weekly-meeting) and consider [joining a SIG or two](https://github.com/kubernetes/community/blob/master/sig-list.md#master-sig-list).
--->
## 加入我們！

您可能已經在 Kubernetes 上成功使用管理和擴充套件的解決方案。例如，託管 Kubernetes 上游原始碼的 GitHub.com [現在也可以在 Kubernetes 上執行](https://githubengineering.com/kubernetes-at-github/) ！

請檢視 [Kubernetes 貢獻者指南](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) ，以獲取有關如何開始作為貢獻者的更多資訊。

您也可以參加 [每週 Kubernetes 的社群會議](https://github.com/kubernetes/community/tree/master/communication#weekly-meeting) 並考慮 [加入一個或兩個 SIG](https://github.com/kubernetes/community/blob/master/sig-list.md#master-sig-list)。
