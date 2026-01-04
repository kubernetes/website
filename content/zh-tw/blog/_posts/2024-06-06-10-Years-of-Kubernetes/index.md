---
layout: blog
title: "Kubernetes 的十年"
date: 2024-06-06
slug: 10-years-of-kubernetes
author: >
  [Bob Killen](https://github.com/mrbobbytables) (CNCF),
  [Chris Short](https://github.com/chris-short) (AWS),
  [Frederico Muñoz](https://github.com/fsmunoz) (SAS),
  [Kaslin Fields](https://github.com/kaslin) (Google),
  [Tim Bannister](https://github.com/sftim) (The Scale Factory),
  以及全球的每一位貢獻者
translator: >
  [Mengjiao Liu](https://github.com/mengjiao-liu) (DaoCloud)
---
<!--
layout: blog
title: "10 Years of Kubernetes"
date: 2024-06-06
slug: 10-years-of-kubernetes
author: >
  [Bob Killen](https://github.com/mrbobbytables) (CNCF),
  [Chris Short](https://github.com/chris-short) (AWS),
  [Frederico Muñoz](https://github.com/fsmunoz) (SAS),
  [Kaslin Fields](https://github.com/kaslin) (Google),
  [Tim Bannister](https://github.com/sftim) (The Scale Factory),
  and every contributor across the globe
-->

<!--
![KCSEU 2024 group photo](kcseu2024.jpg)

Ten (10) years ago, on June 6th, 2014, the
[first commit](https://github.com/kubernetes/kubernetes/commit/2c4b3a562ce34cddc3f8218a2c4d11c7310e6d56)
of Kubernetes was pushed to GitHub. That first commit with 250 files and 47,501 lines of go, bash
and markdown kicked off the project we have today. Who could have predicted that 10 years later,
Kubernetes would grow to become one of the largest Open Source projects to date with over
[88,000 contributors](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1) from
more than [8,000 companies](https://www.cncf.io/reports/kubernetes-project-journey-report/), across
44 countries.
-->
![KCSEU 2024 團體照片](kcseu2024.jpg)

十年前的 2014 年 6 月 6 日，Kubernetes
的[第一次提交](https://github.com/kubernetes/kubernetes/commit/2c4b3a562ce34cddc3f8218a2c4d11c7310e6d56)被推送到 GitHub。
第一次提交包含了 250 個檔案和 47,501 行的 Go、Bash 和 Markdown 代碼，
開啓了我們今天所擁有的項目。誰能預測到 10 年後，Kubernetes 會成長爲迄今爲止最大的開源項目之一，
擁有來自超過 8,000 家公司、來自 44 個國家的
[88,000 名貢獻者](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1)。

<img src="kcscn2019.jpg" alt="KCSCN 2019" class="left" style="max-width: 20em; margin: 1em" >

<!--
This milestone isn't just for Kubernetes but for the Cloud Native ecosystem that blossomed from
it. There are close to [200 projects](https://all.devstats.cncf.io/d/18/overall-project-statistics-table?orgId=1)
within the CNCF itself, with contributions from
[240,000+ individual contributors](https://all.devstats.cncf.io/d/18/overall-project-statistics-table?orgId=1) and
thousands more in the greater ecosystem. Kubernetes would not be where it is today without them, the
[7M+ Developers](https://www.cncf.io/blog/2022/05/18/slashdata-cloud-native-continues-to-grow-with-more-than-7-million-developers-worldwide/),
and the even larger user community that have all helped shape the ecosystem that it is today.
-->
這一里程碑不僅屬於 Kubernetes，也屬於由此蓬勃發展的雲原生生態系統。
在 CNCF 本身就有近 [200 個項目](https://all.devstats.cncf.io/d/18/overall-project-statistics-table?orgId=1)，有來自
[240,000 多名個人貢獻者](https://all.devstats.cncf.io/d/18/overall-project-statistics-table?orgId=1)，
還有數千名來自更大的生態系統的貢獻者的貢獻。
如果沒有 [700 多萬開發者](https://www.cncf.io/blog/2022/05/18/slashdata-cloud-native-continues-to-grow-with-more-than-7-million-developers-worldwide/)和更龐大的使用者社區，
Kubernetes 就不會達到今天的成就，他們一起幫助塑造了今天的生態系統。

<!--
## Kubernetes' beginnings - a converging of technologies

The ideas underlying Kubernetes started well before the first commit, or even the first prototype
([which came about in 2013](/blog/2018/07/20/the-history-of-kubernetes-the-community-behind-it/)).
In the early 2000s, Moore's Law was well in effect. Computing hardware was becoming more and more
powerful at an incredibly fast rate. Correspondingly, applications were growing more and more
complex. This combination of hardware commoditization and application complexity pointed to a need
to further abstract software from hardware, and solutions started to emerge.
-->
## Kubernetes 的起源 - 技術的融合

Kubernetes 背後的理念早在第一次提交之前，
甚至第一個原型（[在 2013 年問世](/blog/2018/07/20/the-history-of-kubernetes-the-community-behind-it/)之前就已經存在。
在 21 世紀初，摩爾定律仍然成立。計算硬件正以驚人的速度變得越來越強大。
相應地，應用程式變得越來越複雜。硬件商品化和應用程式複雜性的結合表明需要進一步將軟體從硬件中抽象出來，
因此解決方案開始出現。

<!--
Like many companies at the time, Google was scaling rapidly, and its engineers were interested in
the idea of creating a form of isolation in the Linux kernel. Google engineer Rohit Seth described
the concept in an [email in 2006](https://lwn.net/Articles/199643/):
-->
像當時的許多公司一樣，Google 正在快速擴張，其工程師對在 Linux 內核中創建一種隔離形式的想法很感興趣。
Google 工程師 Rohit Seth 在 [2006 年的一封電子郵件](https://lwn.net/Articles/199643/)中描述了這個概念：

<!--
> We use the term container to indicate a structure against which we track and charge utilization of
system resources like memory, tasks, etc. for a Workload.
-->
> 我們使用術語 “容器” 來表示一種結構，通過該結構我們可以對負載的系統資源（如內存、任務等）利用情況進行跟蹤和計費。

<img src="future.png" alt="The future of Linux containers" class="right" style="max-width: 20em; margin: 1em">

<!--
In March of 2013, a 5-minute lightning talk called
["The future of Linux Containers," presented by Solomon Hykes at PyCon](https://youtu.be/wW9CAH9nSLs?si=VtK_VFQHymOT7BIB),
introduced an upcoming open source tool called "Docker" for creating and using Linux
Containers. Docker introduced a level of usability to Linux Containers that made them accessible to
more users than ever before, and the popularity of Docker, and thus of Linux Containers,
skyrocketed. With Docker making the abstraction of Linux Containers accessible to all, running
applications in much more portable and repeatable ways was suddenly possible, but the question of
scale remained.
-->
2013 年 3 月，[Solomon Hykes 在 PyCon 上進行了一場名爲 “Linux容器的未來”](https://youtu.be/wW9CAH9nSLs?si=VtK_VFQHymOT7BIB)的
5 分鐘閃電演講，介紹了名爲 “Docker” 的一款即將被推出的開源工具，用於創建和使用 Linux 容器。Docker
提升了 Linux 容器的可用性，使其比以往更容易被更多使用者使用，從而使
Docker 和Linux 容器的流行度飆升。隨着 Docker 使 Linux 容器的抽象概念可供所有人使用，
以更便於移植且可重複的方式運行應用突然成爲可能，但大規模使用的問題仍然存在。

<!--
Google's Borg system for managing application orchestration at scale had adopted Linux containers as
they were developed in the mid-2000s. Since then, the company had also started working on a new
version of the system called "Omega." Engineers at Google who were familiar with the Borg and Omega
systems saw the popularity of containerization driven by Docker. They recognized not only the need
for an open source container orchestration system but its "inevitability," as described by Brendan
Burns in this [blog post](/blog/2018/07/20/the-history-of-kubernetes-the-community-behind-it/). That
realization in the fall of 2013 inspired a small team to start working on a project that would later
become **Kubernetes**. That team included Joe Beda, Brendan Burns, Craig McLuckie, Ville Aikas, Tim
Hockin, Dawn Chen, Brian Grant, and Daniel Smith.
-->
Google 用來管理大規模應用編排的 Borg 系統在 2000 年代中期採用當時所開發的 Linux 容器技術。
此後，該公司還開始研發該系統的一個新版本，名爲 “Omega”。
熟悉 Borg 和 Omega 系統的 Google 工程師們看到了 Docker 所推動的容器化技術的流行。
他們意識到對一個開源的容器編排系統的需求，而且意識到這一系統的“必然性”，正如
Brendan Burns 在這篇[博文](/blog/2018/07/20/the-history-of-kubernetes-the-community-behind-it/)中所描述的。
這一認識在 2013 年秋天激發了一個小團隊開始着手一個後來成爲 **Kubernetes**
的項目。該團隊包括 Joe Beda、Brendan Burns、Craig McLuckie、Ville Aikas、Tim Hockin、Dawn Chen、Brian Grant
和 Daniel Smith。

<!--
## A decade of Kubernetes

<img src="kubeconeu2017.jpg" alt="KubeCon EU 2017" class="left" style="max-width: 20em; margin: 1em">

Kubernetes' history begins with that historic commit on June 6th, 2014, and the subsequent
announcement of the project in a June 10th
[keynote by Google engineer Eric Brewer at DockerCon 2014](https://youtu.be/YrxnVKZeqK8?si=Q_wYBFn7dsS9H3k3)
(and its corresponding [Google blog](https://cloudplatform.googleblog.com/2014/06/an-update-on-container-support-on-google-cloud-platform.html)).
-->
## Kubernetes 十年回顧

<img src="kubeconeu2017.jpg" alt="KubeCon EU 2017" class="left" style="max-width: 20em; margin: 1em">

Kubernetes 的歷史始於 2014 年 6 月 6 日的那次歷史性提交，隨後，
[Google 工程師 Eric Brewer 在 2014 年 6 月 10 日的 DockerCon 2014
上的主題演講](https://youtu.be/YrxnVKZeqK8?si=Q_wYBFn7dsS9H3k3)([及其相應的 Google 博客](https://cloudplatform.googleblog.com/2014/06/an-update-on-container-support-on-google-cloud-platform.html))中由宣佈了該項目。

<!--
Over the next year, a small community of
[contributors, largely from Google and Red Hat](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=Before%20joining%20CNCF&var-metric=contributors),
worked hard on the project, culminating in a [version 1.0 release on July 21st, 2015](https://cloudplatform.googleblog.com/2015/07/Kubernetes-V1-Released.html).
Alongside 1.0, Google announced that Kubernetes would be donated to a newly formed branch of the
Linux Foundation called the
[Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/announcements/2015/06/21/new-cloud-native-computing-foundation-to-drive-alignment-among-container-technologies/).
-->
在接下來的一年裏，一個由[主要來自 Google 和 Red Hat 等公司的貢獻者](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=Before%20joining%20CNCF&var-metric=contributors)組成的小型社區爲該項目付出了辛勤的努力，最終在
2015 年 7 月 21 日發佈了 [1.0 版本](https://cloudplatform.googleblog.com/2015/07/Kubernetes-V1-Released.html)。
在發佈 1.0 版本的同時，Google 宣佈將 Kubernetes 捐贈給 Linux 基金會下的一個新成立的分支，
即[雲原生計算基金會 (Cloud Native Computing Foundation，CNCF)](https://www.cncf.io/announcements/2015/06/21/new-cloud-native-computing-foundation-to-drive-alignment-among-container-technologies/)。

<!--
Despite reaching 1.0, the Kubernetes project was still very challenging to use and
understand. Kubernetes contributor Kelsey Hightower took special note of the project's shortcomings
in ease of use and on July 7, 2016, he pushed the
[first commit of his famed "Kubernetes the Hard Way" guide](https://github.com/kelseyhightower/kubernetes-the-hard-way/commit/9d7ace8b186f6ebd2e93e08265f3530ec2fba81c).
-->
儘管到了 1.0 版本，但 Kubernetes 項目的使用和理解仍然很困難。Kubernetes
貢獻者 Kelsey Hightower 特別注意到了該項目在易用性方面的不足，並於 2016 年 7 月 7 日推出了他著名的
“Kubernetes the Hard Way” 指南的[第一次提交](https://github.com/kelseyhightower/kubernetes-the-hard-way/commit/9d7ace8b186f6ebd2e93e08265f3530ec2fba81c)。

<!--
The project has changed enormously since its original 1.0 release; experiencing a number of big wins
such as
[Custom Resource Definitions (CRD) going GA in 1.16](/blog/2019/09/18/kubernetes-1-16-release-announcement/)
or [full dual stack support launching in 1.23](/blog/2021/12/08/dual-stack-networking-ga/) and
community "lessons learned" from the [removal of widely used beta APIs in 1.22](/blog/2021/07/14/upcoming-changes-in-kubernetes-1-22/)
or the deprecation of [Dockershim](/blog/2020/12/02/dockershim-faq/
-->
自從最初的 1.0 版本發佈以來，項目經歷了巨大的變化，取得了許多重大的成就，例如
[在 1.16 版本中正式發佈的 Custom Resource Definitions (CRD) ](/blog/2019/09/18/kubernetes-1-16-release-announcement/)，
或者[在 1.23 版本中推出的全面雙棧支持](/blog/2021/12/08/dual-stack-networking-ga/)，以及社區從
[1.22 版本中移除廣泛使用的 Beta API](/blog/2021/07/14/upcoming-changes-in-kubernetes-1-22/)
和[棄用 Dockershim](/blog/2020/12/02/dockershim-faq/) 中吸取的“教訓”。

<!--
Some notable updates, milestones and events since 1.0 include:

* December 2016 - [Kubernetes 1.5](/blog/2016/12/kubernetes-1-5-supporting-production-workloads/) introduces runtime pluggability with initial CRI support and alpha Windows node support. OpenAPI also appears for the first time, paving the way for clients to be able to discover extension APIs.
  * This release also introduced StatefulSets and PodDisruptionBudgets in Beta.
-->
自 1.0 版本以來的一些值得注意的更新、里程碑和事件包括：

* 2016 年 12 月 - [Kubernetes 1.5](/blog/2016/12/kubernetes-1-5-supporting-production-workloads/)
  引入了運行時可插拔性，初步支持 CRI 和 Alpha 版 Windows 節點支持。
  OpenAPI 也首次出現，爲客戶端能夠發現擴展 API 鋪平了道路。
  * 此版本還引入了 Beta 版的 StatefulSet 和 PodDisruptionBudget。
<!--
* April 2017 — [Introduction of Role-Based Access Controls or RBAC](/blog/2017/04/rbac-support-in-kubernetes/).
* June 2017 — In [Kubernetes 1.7](/blog/2017/06/kubernetes-1-7-security-hardening-stateful-application-extensibility-updates/), ThirdPartyResources or "TPRs" are replaced with CustomResourceDefinitions (CRDs).
* December 2017 — [Kubernetes 1.9](/blog/2017/12/kubernetes-19-workloads-expanded-ecosystem/) sees the Workloads API becoming GA (Generally Available). The release blog states: _"Deployment and ReplicaSet, two of the most commonly used objects in Kubernetes, are now stabilized after more than a year of real-world use and feedback."_
-->
* 2017 年 4 月 — [引入基於角色的訪問控制（RBAC）](/blog/2017/04/rbac-support-in-kubernetes/)。
* 2017 年 6 月 — 在 [Kubernetes 1.7](/blog/2017/06/kubernetes-1-7-security-hardening-stateful-application-extensibility-updates/)
  中，ThirdPartyResources 或 "TPRs" 被 CustomResourceDefinitions（CRD）取代。
* 2017 年 12 月 — [Kubernetes 1.9](/blog/2017/12/kubernetes-19-workloads-expanded-ecosystem/) 中，
  工作負載 API 成爲 GA（正式可用）。發佈博客中指出：“Deployment 和 ReplicaSet 是 Kubernetes 中最常用的兩個對象，
  在經過一年多的實際使用和反饋後，現在已經穩定下來。”
<!--
* December 2018 — In 1.13, the Container Storage Interface (CSI) reaches GA, kubeadm tool for bootstrapping minimum viable clusters reaches GA, and CoreDNS becomes the default DNS server.
* September 2019 — [Custom Resource Definitions go GA](/blog/2019/09/18/kubernetes-1-16-release-announcement/) in Kubernetes 1.16.
* August 2020 — [Kubernetes 1.19](/blog/2020/08/31/kubernetes-1-19-feature-one-year-support/) increases the support window for releases to 1 year.
* December 2020 — [Dockershim is deprecated](/blog/2020/12/18/kubernetes-1.20-pod-impersonation-short-lived-volumes-in-csi/)  in 1.20
-->
* 2018 年 12 月 — 在 1.13 版本中，容器儲存介面（CSI）達到 GA，用於引導最小可用叢集的 kubeadm 工具達到 GA，並且 CoreDNS 成爲預設的 DNS 伺服器。
* 2019 年 9 月 — [自定義資源定義（Custom Resource Definition）在 Kubernetes 1.16 中正式發佈](/blog/2019/09/18/kubernetes-1-16-release-announcement/)。
* 2020 年 8 月 — [Kubernetes 1.19](/blog/2020/08/31/kubernetes-1-19-feature-one-year-support/) 將發佈支持窗口增加到 1 年。
* 2020 年 12 月 — [Dockershim 在 1.20 版本中被棄用](/zh-cn/blog/2020/12/18/kubernetes-1.20-pod-impersonation-short-lived-volumes-in-csi/)。
<!--
* April 2021 — the [Kubernetes release cadence changes](/blog/2021/07/20/new-kubernetes-release-cadence/#:~:text=On%20April%2023%2C%202021%2C%20the,Kubernetes%20community's%20contributors%20and%20maintainers.) from 4 releases per year to 3 releases per year.
* July 2021 — Widely used beta APIs are [removed](/blog/2021/07/14/upcoming-changes-in-kubernetes-1-22/)  in Kubernetes 1.22.
* May 2022 — Kubernetes 1.24 sees  [beta APIs become disabled by default](/blog/2022/05/03/kubernetes-1-24-release-announcement/) to reduce upgrade conflicts and removal of [Dockershim](/dockershim), leading to [widespread user confusion](https://www.youtube.com/watch?v=a03Hh1kd6KE) (we've since [improved our communication!](https://github.com/kubernetes/community/tree/master/communication/contributor-comms))
* December 2022 — In 1.26, there was a significant batch and  [Job API overhaul](/blog/2022/12/29/scalable-job-tracking-ga/) that paved the way for better support for AI  /ML / batch workloads.
-->
* 2021 年 4 月 - [Kubernetes 發佈節奏變更](/blog/2021/07/20/new-kubernetes-release-cadence/#:~:text=On%20April%2023%2C%202021%2C%20the,Kubernetes%20community's%20contributors%20and%20maintainers.)，從每年發佈 4 個版本變爲每年發佈 3 個版本。
* 2021 年 7 月 - 在 Kubernetes 1.22 中[移除了廣泛使用的 Beta API](/blog/2021/07/14/upcoming-changes-in-kubernetes-1-22/)。
* 2022 年 5 月 - 在 Kubernetes 1.24 中，[Beta API 預設被禁用](/zh-cn/blog/2022/05/03/kubernetes-1-24-release-announcement/)，
  以減少升級衝突，並移除了 [Dockershim](/zh-cn/dockershim)，導致[使用者普遍感到困惑](https://www.youtube.com/watch?v=a03Hh1kd6KE)
  （我們已經[改進了我們的溝通方式！](https://github.com/kubernetes/community/tree/master/communication/contributor-comms)）
* 2022 年 12 月 - 在 1.26 版本中，進行了重大的[批處理和作業 API 改進](/blog/2022/12/29/scalable-job-tracking-ga/)，
  爲更好地支持 AI/ML/批處理工作負載鋪平了道路。

<!--
**PS:** Curious to see how far the project has come for yourself? Check out this [tutorial for spinning up a Kubernetes 1.0 cluster](https://github.com/spurin/kubernetes-v1.0-lab) created by community members Carlos Santana, Amim Moises Salum Knabben, and James Spurin.
-->
**附言:** 想親自體會一下這個項目的進展麼？可以查看由社區成員 Carlos Santana、Amim Moises Salum Knabben 和 James Spurin
創建的 [Kubernetes 1.0 叢集搭建教程](https://github.com/spurin/kubernetes-v1.0-lab)。

---
<!--
Kubernetes offers more extension points than we can count. Originally designed to work with Docker
and only Docker, now you can plug in any container runtime that adheres to the CRI standard. There
are other similar interfaces: CSI for storage and CNI for networking. And that's far from all you
can do. In the last decade, whole new patterns have emerged, such as using

[Custom Resource Definitions](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
(CRDs) to support third-party controllers - now a huge part of the Kubernetes ecosystem.
-->
Kubernetes 提供的擴展點多得數不勝數。最初設計用於與 Docker 一起工作，現在你可以插入任何符合
CRI 標準的容器運行時。還有其他類似的介面：用於儲存的 CSI 和用於網路的 CNI。
而且這還遠遠不是全部。在過去的十年中，出現了全新的模式，例如使用[自定義資源定義](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)（CRD）
來支持第三方控制器 - 這現在是 Kubernetes 生態系統的重要組成部分。

<!--
The community building the project has also expanded immensely over the last decade. Using
[DevStats](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1), we can see the
incredible volume of contribution over the last decade that has made Kubernetes the
[second-largest open source project in the world](https://www.cncf.io/reports/kubernetes-project-journey-report/):

* **88,474** contributors
* **15,121** code committers
* **4,228,347** contributions
* **158,530** issues
* **311,787** pull requests
-->
在過去十年間，參與構建該項目的社區也得到了巨大的擴展。通過使用
[DevStats](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1)，我們可以看到過去十年中令人難以置信的貢獻量，這使得
Kubernetes 成爲了[全球第二大開源項目](https://www.cncf.io/reports/kubernetes-project-journey-report/)：

* **88,474** 位貢獻者
* **15,121** 位代碼提交者
* **4,228,347** 次貢獻
* **158,530** 個問題
* **311,787** 個拉取請求

<!--
## Kubernetes today

<img src="welcome.jpg" alt="KubeCon NA 2023" class="left" style="max-width: 20em; margin: 1em">

Since its early days, the project has seen enormous growth in technical capability, usage, and
contribution. The project is still actively working to improve and better serve its users.
-->
## Kubernetes 現狀

<img src="welcome.jpg" alt="KubeCon NA 2023" class="left" style="max-width: 20em; margin: 1em">

自項目初期以來，項目在技術能力、使用率和貢獻方面取得了巨大的增長。
項目仍在積極努力改進並更好地爲使用者服務。

<!--
In the upcoming 1.31 release, the project will celebrate the culmination of an important long-term
project: the removal of in-tree cloud provider code. In this
[largest migration in Kubernetes history](/blog/2024/05/20/completing-cloud-provider-migration/),
roughly 1.5 million lines of code have been removed, reducing the binary sizes of core components
by approximately 40%. In the project's early days, it was clear that extensibility would be key to
success. However, it wasn't always clear how that extensibility should be achieved. This migration
removes a variety of vendor-specific capabilities from the core Kubernetes code
base. Vendor-specific capabilities can now be better served by other pluggable extensibility
features or patterns, such as
[Custom Resource Definitions (CRDs)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
or API standards like the [Gateway API](https://gateway-api.sigs.k8s.io/).
Kubernetes also faces new challenges in serving its vast user base, and the community is adapting
accordingly. One example of this is the migration of image hosting to the new, community-owned
registry.k8s.io. The egress bandwidth and costs of providing pre-compiled binary images for user
consumption have become immense. This new registry change enables the community to continue
providing these convenient images in more cost- and performance-efficient ways. Make sure you check
out the [blog post](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/) and
update any automation you have to use registry.k8s.io!
-->
在即將發佈的 1.31 版本中，該項目將慶祝一個重要的長期項目的完成：移除內部雲提供商代碼。在這個
[Kubernetes 歷史上最大的遷移](/zh-cn/blog/2024/05/20/completing-cloud-provider-migration/)中，大約刪除了
150 萬行代碼，將核心組件的二進制檔案大小減小了約 40%。在項目早期，很明顯可擴展性是成功的關鍵。
然而，如何實現這種可擴展性並不總是很清楚。此次遷移從核心 Kubernetes 代碼庫中刪除了各種特定於供應商的功能。
現在，特定於供應商的功能可以通過其他可插拔的擴展功能或模式更好地提供，例如[自定義資源定義（CRD）](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) 
或 [Gateway API](https://gateway-api.sigs.k8s.io/) 等 API 標準。
Kubernetes 在爲其龐大的使用者羣體提供服務時也面臨着新的挑戰，社區正在相應地進行調整。其中一個例子是將映像檔託管遷移到新的、由社區擁有的
registry.k8s.io。爲使用者提供預編譯二進制映像檔的出口帶寬和成本已經變得非常巨大。這一新的倉庫變更使社區能夠以更具成本效益和性能高效的方式繼續提供這些便利的映像檔。
請務必查看[此博客文章](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)並更新你必須使用 registry.k8s.io 倉庫的任何自動化設施！

<!--
## The future of Kubernetes

<img src="lts.jpg" alt="" class="right" width="300px" style="max-width: 20em; margin: 1em">

A decade in, the future of Kubernetes still looks bright. The community is prioritizing changes that
both improve the user experiences, and enhance the sustainability of the project. The world of
application development continues to evolve, and Kubernetes is poised to change along with it.
-->
## Kubernetes 的未來

<img src="lts.jpg" alt="" class="right" width="300px" style="max-width: 20em; margin: 1em">

十年過去了，Kubernetes 的未來依然光明。社區正在優先考慮改進使用者體驗和增強項目可持續性的變革。
應用程式開發的世界不斷演變，Kubernetes 正準備隨之變化。

<!--
In 2024, the advent of AI changed a once-niche workload type into one of prominent
importance. Distributed computing and workload scheduling has always gone hand-in-hand with the
resource-intensive needs of Artificial Intelligence, Machine Learning, and High Performance
Computing workloads. Contributors are paying close attention to the needs of newly developed
workloads and how Kubernetes can best serve them. The new
[Serving Working Group](https://github.com/kubernetes/community/tree/master/wg-serving) is one
example of how the community is organizing to address these workloads' needs. It's likely that the
next few years will see improvements to Kubernetes' ability to manage various types of hardware, and
its ability to manage the scheduling of large batch-style workloads which are run across hardware in
chunks.
-->
2024 年，人工智能的進展將一種曾經小衆的工作負載類型變成了一種非常重要的工作負載類型。
分佈式計算和工作負載調度一直與人工智能、機器學習和高性能計算工作負載的資源密集需求密切相關。
貢獻者們密切關注新開發的工作負載的需求以及 Kubernetes 如何爲它們提供最佳服務。新成立的
[Serving 工作組](https://github.com/kubernetes/community/tree/master/wg-serving)
就是社區組織來解決這些工作負載需求的一個例子。未來幾年可能會看到
Kubernetes 在管理各種類型的硬件以及管理跨硬件運行的大型批處理工作負載的調度能力方面的改進。

<!--
The ecosystem around Kubernetes will continue to grow and evolve. In the future, initiatives to
maintain the sustainability of the project, like the migration of in-tree vendor code and the
registry change, will be ever more important.
-->
Kubernetes 周圍的生態系統將繼續發展壯大。未來，爲了保持項目的可持續性，
像內部供應商代碼的遷移和倉庫變更這樣的舉措將變得更加重要。

<!--
The next 10 years of Kubernetes will be guided by its users and the ecosystem, but most of all, by
the people who contribute to it. The community remains open to new contributors. You can find more
information about contributing in our New Contributor Course at
[https://k8s.dev/docs/onboarding](https://k8s.dev/docs/onboarding).

We look forward to building the future of Kubernetes with you!

{{< figure src="kcsna2023.jpg" alt="KCSNA 2023">}}
-->
Kubernetes 的未來 10 年將由其使用者和生態系統引領，但最重要的是，由爲其做出貢獻的人引領。
社區對新貢獻者持開放態度。你可以在我們的新貢獻者課程
[https://k8s.dev/docs/onboarding](https://k8s.dev/docs/onboarding) 中找到更多有關貢獻的資訊。

我們期待與你一起構建 Kubernetes 的未來！

{{< figure src="kcsna2023.jpg" alt="KCSNA 2023">}}
