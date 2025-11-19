---
layout: blog
title: "Kubernetes 即將移除 Dockershim：承諾和下一步"
date: 2022-01-07
slug: kubernetes-is-moving-on-from-dockershim
---
<!--
layout: blog
title: "Kubernetes is Moving on From Dockershim: Commitments and Next Steps"
date: 2022-01-07
slug: kubernetes-is-moving-on-from-dockershim
-->

<!--
**Authors:** Sergey Kanzhelev (Google), Jim Angel (Google), Davanum Srinivas (VMware), Shannon Kularathna (Google), Chris Short (AWS), Dawn Chen (Google)
-->
**作者：** Sergey Kanzhelev (Google), Jim Angel (Google), Davanum Srinivas (VMware), Shannon Kularathna (Google), Chris Short (AWS), Dawn Chen (Google)

<!--
Kubernetes is removing dockershim in the upcoming v1.24 release. We're excited
to reaffirm our community values by supporting open source container runtimes,
enabling a smaller kubelet, and increasing engineering velocity for teams using
Kubernetes. If you [use Docker Engine as a container runtime](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)
for your Kubernetes cluster, get ready to migrate in 1.24! To check if you're
affected, refer to [Check whether dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/).
-->
Kubernetes 將在即將發佈的 1.24 版本中移除 dockershim。我們很高興能夠通過支持開源容器運行時、支持更小的
kubelet 以及爲使用 Kubernetes 的團隊提高工程速度來重申我們的社區價值。
如果你[使用 Docker Engine 作爲 Kubernetes 集羣的容器運行時](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)，
請準備好在 1.24 中遷移！要檢查你是否受到影響，
請參考[檢查移除 Dockershim 對你的影響](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)。

<!--
## Why we’re moving away from dockershim

Docker was the first container runtime used by Kubernetes. This is one of the
reasons why Docker is so familiar to many Kubernetes users and enthusiasts.
Docker support was hardcoded into Kubernetes – a component the project refers to
as dockershim.
-->
## 爲什麼我們要離開 dockershim  {#why-we-re-moving-away-from-dockershim}

Docker 是 Kubernetes 使用的第一個容器運行時。
這也是許多 Kubernetes 用戶和愛好者如此熟悉 Docker 的原因之一。
對 Docker 的支持被硬編碼到 Kubernetes 中——一個被項目稱爲 dockershim 的組件。
<!--
As containerization became an industry standard, the Kubernetes project added support
for additional runtimes. This culminated in the implementation of the
container runtime interface (CRI), letting system components (like the kubelet)
talk to container runtimes in a standardized way. As a result, dockershim became
an anomaly in the Kubernetes project.
-->
隨着容器化成爲行業標準，Kubernetes 項目增加了對其他運行時的支持。
最終實現了容器運行時接口（CRI），讓系統組件（如 kubelet）以標準化的方式與容器運行時通信。
因此，dockershim 成爲了 Kubernetes 項目中的一個異常現象。
<!--
Dependencies on Docker and dockershim have crept into various tools
and projects in the CNCF ecosystem ecosystem, resulting in fragile code.

By removing the
dockershim CRI, we're embracing the first value of CNCF: "[Fast is better than
slow](https://github.com/cncf/foundation/blob/master/charter.md#3-values)".
Stay tuned for future communications on the topic!
-->
對 Docker 和 dockershim 的依賴已經滲透到 CNCF 生態系統中的各種工具和項目中，這導致了代碼脆弱。

通過刪除 dockershim CRI，我們擁抱了 CNCF 的第一個價值：
“[快比慢好](https://github.com/cncf/foundation/blob/master/charter.md#3-values)”。
請繼續關注未來關於這個話題的交流!

<!--
## Deprecation timeline

We [formally announced](/blog/2020/12/08/kubernetes-1-20-release-announcement/) the dockershim deprecation in December 2020. Full removal is targeted
in Kubernetes 1.24, in April 2022. This timeline
aligns with our [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior),
which states that deprecated behaviors must function for at least 1 year
after their announced deprecation.
-->
## 棄用時間線  {#deprecation-timeline}

我們[正式宣佈](/zh-cn/blog/2020/12/08/kubernetes-1-20-release-announcement/)於
2020 年 12 月棄用 dockershim。目標是在 2022 年 4 月，
Kubernetes 1.24 中完全移除 dockershim。
此時間線與我們的[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)一致，
即規定已棄用的行爲必須在其宣佈棄用後至少運行 1 年。

<!--
We'll support Kubernetes version 1.23, which includes
dockershim, for another year in the Kubernetes project. For managed
Kubernetes providers, vendor support is likely to last even longer, but this is
dependent on the companies themselves. Regardless, we're confident all cluster operations will have
time to migrate. If you have more questions about the dockershim removal, refer
to the [Dockershim Deprecation FAQ](/dockershim).
-->
包括 dockershim 的 Kubernetes 1.23 版本，在 Kubernetes 項目中將再支持一年。
對於託管 Kubernetes 的供應商，供應商支持可能會持續更長時間，但這取決於公司本身。
無論如何，我們相信所有集羣操作都有時間進行遷移。如果你有更多關於 dockershim 移除的問題，
請參考[棄用 Dockershim 的常見問題](/zh-cn/blog/2020/12/02/dockershim-faq/)。

<!--
We asked you whether you feel prepared for the migration from dockershim in this
survey: [Are you ready for Dockershim removal](/blog/2021/11/12/are-you-ready-for-dockershim-removal/).
We had over 600 responses. To everybody who took time filling out the survey,
thank you.
-->
在這個[你是否爲 dockershim 的刪除做好了準備](/blog/2021/11/12/are-you-ready-for-dockershim-removal/)的調查中，
我們詢問你是否爲 dockershim 的遷移做好了準備。我們收到了 600 多個回覆。
感謝所有花時間填寫調查問卷的人。

<!--
The results show that we still have a lot of ground to cover to help you to
migrate smoothly. Other container runtimes exist, and have been promoted
extensively. However, many users told us they still rely on dockershim,
and sometimes have dependencies that need to be re-worked. Some of these
dependencies are outside of your control. Based on your feedback, here are some
of the steps we are taking to help.
-->
結果表明，在幫助你順利遷移方面，我們還有很多工作要做。
存在其他容器運行時，並且已被廣泛推廣。但是，許多用戶告訴我們他們仍然依賴 dockershim，
並且有時需要重新處理依賴項。其中一些依賴項超出控制範圍。
根據收集到的反饋，我們採取了一些措施提供幫助。

<!--
## Our next steps

Based on the feedback you provided:

- CNCF and the 1.24 release team are committed to delivering documentation in
  time for the 1.24 release. This includes more informative blog posts like this
  one, updating existing code samples, tutorials, and tasks, and producing a
  migration guide for cluster operators.
- We are reaching out to the rest of the CNCF community to help prepare them for
  this change.
-->
## 我們的下一個步驟 {#our-next-steps}

根據提供的反饋：

- CNCF 和 1.24 版本團隊致力於及時交付 1.24 版本的文檔。這包括像本文這樣的包含更多信息的博客文章，
  更新現有的代碼示例、教程和任務，併爲集羣操作人員生成遷移指南。
- 我們正在聯繫 CNCF 社區的其他成員，幫助他們爲這一變化做好準備。

<!--
If you're part of a project with dependencies on dockershim, or if you're
interested in helping with the migration effort, please join us! There's always
room for more contributors, whether to our transition tools or to our
documentation. To get started, say hello in the
[#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G)
channel on [Kubernetes Slack](https://slack.kubernetes.io/)!
-->
如果你是依賴 dockershim 的項目的一部分，或者如果你有興趣幫助參與遷移工作，請加入我們！
無論是我們的遷移工具還是我們的文檔，總是有更多貢獻者的空間。
作爲起步，請在 [Kubernetes Slack](https://slack.kubernetes.io/) 上的
[#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G) 頻道打個招呼！

<!--
## Final thoughts

As a project, we've already seen cluster operators increasingly adopt other
container runtimes through 2021. 
We believe there are no major blockers to migration. The steps we're taking to
improve the migration experience will light the path more clearly for you.
-->
## 最終想法  {#final-thoughts}

作爲一個項目，我們已經看到集羣運營商在 2021 年之前越來越多地採用其他容器運行時。
我們相信遷移沒有主要障礙。我們爲改善遷移體驗而採取的步驟將爲你指明更清晰的道路。

<!--
We understand that migration from dockershim is yet another action you may need to
do to keep your Kubernetes infrastructure up to date. For most of you, this step
will be straightforward and transparent. In some cases, you will encounter
hiccups or issues. The community has discussed at length whether postponing the
dockershim removal would be helpful. For example, we recently talked about it in
the [SIG Node discussion on November 11th](https://docs.google.com/document/d/1Ne57gvidMEWXR70OxxnRkYquAoMpt56o75oZtg-OeBg/edit#bookmark=id.r77y11bgzid)
and in the [Kubernetes Steering committee meeting held on December 6th](https://docs.google.com/document/d/1qazwMIHGeF3iUh5xMJIJ6PDr-S3bNkT8tNLRkSiOkOU/edit#bookmark=id.m0ir406av7jx).
We already [postponed](https://github.com/kubernetes/enhancements/pull/2481/) it
once in 2021 because the adoption rate of other
runtimes was lower than we wanted, which also gave us more time to identify
potential blocking issues.
-->
我們知道，從 dockershim 遷移是你可能需要執行的另一項操作，以保證你的 Kubernetes 基礎架構保持最新。
對於你們中的大多數人來說，這一步將是簡單明瞭的。在某些情況下，你會遇到問題。
社區已經詳細討論了推遲 dockershim 刪除是否會有所幫助。
例如，我們最近在 [11 月 11 日的 SIG Node 討論](https://docs.google.com/document/d/1Ne57gvidMEWXR70OxxnRkYquAoMpt56o75oZtg-OeBg/edit#bookmark=id.r77y11bgzid)和
[12 月 6 日 Kubernetes Steering 舉行的委員會會議](https://docs.google.com/document/d/1qazwMIHGeF3iUh5xMJIJ6PDr-S3bNkT8tNLRkSiOkOU/edit#bookmark=id.m0ir406av7jx)談到了它。
我們已經在 2021 年[推遲](https://github.com/kubernetes/enhancements/pull/2481/)它一次，
因爲其他運行時的採用率低於我們的預期，這也給了我們更多的時間來識別潛在的阻塞問題。

<!--
At this point, we believe that the value that you (and Kubernetes) gain from
dockershim removal makes up for the migration effort you'll have. Start planning
now to avoid surprises. We'll have more updates and guides before Kubernetes
1.24 is released.
-->
在這一點上，我們相信你（和 Kubernetes）從移除 dockershim 中獲得的價值可以彌補你將要進行的遷移工作。
現在就開始計劃以避免出現意外。在 Kubernetes 1.24 發佈之前，我們將提供更多更新信息和指南。

