---
layout: blog
title: "聚焦 SIG Apps"
slug: sig-apps-spotlight-2025
canonicalUrl: https://www.kubernetes.dev/blog/2025/03/12/sig-apps-spotlight-2025
date: 2025-03-12
author: "Sandipan Panda (DevZero)"
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Spotlight on SIG Apps"
slug: sig-apps-spotlight-2025
canonicalUrl: https://www.kubernetes.dev/blog/2025/03/12/sig-apps-spotlight-2025
date: 2025-03-12
author: "Sandipan Panda (DevZero)"
-->

<!--
In our ongoing SIG Spotlight series, we dive into the heart of the Kubernetes project by talking to
the leaders of its various Special Interest Groups (SIGs). This time, we focus on 
**[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps#apps-special-interest-group)**,
the group responsible for everything related to developing, deploying, and operating applications on
Kubernetes. [Sandipan Panda](https://www.linkedin.com/in/sandipanpanda)
([DevZero](https://www.devzero.io/)) had the opportunity to interview [Maciej
Szulik](https://github.com/soltysh) ([Defense Unicorns](https://defenseunicorns.com/)) and [Janet
Kuo](https://github.com/janetkuo) ([Google](https://about.google/)), the chairs and tech leads of
SIG Apps. They shared their experiences, challenges, and visions for the future of application
management within the Kubernetes ecosystem.
-->
在我們正在進行的 SIG 聚焦系列中，我們通過與 Kubernetes 項目各個特別興趣小組（SIG）的領導者對話，
深入探討 Kubernetes 項目的核心。這一次，我們聚焦於
**[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps#apps-special-interest-group)**，
這個小組負責 Kubernetes 上與應用程序開發、部署和操作相關的所有內容。
[Sandipan Panda](https://www.linkedin.com/in/sandipanpanda)（[DevZero](https://www.devzero.io/））
有機會採訪了 SIG Apps 的主席和技術負責人
[Maciej Szulik](https://github.com/soltysh)（[Defense Unicorns](https://defenseunicorns.com/)）
以及 [Janet Kuo](https://github.com/janetkuo)（[Google](https://about.google/)）。
他們分享了在 Kubernetes 生態系統中關於應用管理的經驗、挑戰以及未來願景。

<!--
## Introductions

**Sandipan: Hello, could you start by telling us a bit about yourself, your role, and your journey
within the Kubernetes community that led to your current roles in SIG Apps?**

**Maciej**: Hey, my name is Maciej, and I’m one of the leads for SIG Apps. Aside from this role, you
can also find me helping
[SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli#readme) and also being one of
the Steering Committee members. I’ve been contributing to Kubernetes since late 2014 in various
areas, including controllers, apiserver, and kubectl.
-->
## 自我介紹

**Sandipan**：你好，能否先簡單介紹一下你自己、你的角色，以及你在
Kubernetes 社區中的經歷，這些經歷是如何引導你擔任 SIG Apps 的當前角色的？

**Maciej**：嗨，我叫 Maciej，是 SIG Apps 的負責人之一。除了這個角色，
你還可以看到我在協助 [SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli#readme)
的工作，同時我也是指導委員會的成員之一。自 2014 年底以來，我一直爲
Kubernetes 做出貢獻，涉及的領域包括控制器、API 伺服器以及 kubectl。

<!--
**Janet**: Certainly! I'm Janet, a Staff Software Engineer at Google, and I've been deeply involved
with the Kubernetes project since its early days, even before the 1.0 launch in 2015.  It's been an
amazing journey!

My current role within the Kubernetes community is one of the chairs and tech leads of SIG Apps. My
journey with SIG Apps started organically. I started with building the Deployment API and adding
rolling update functionalities. I naturally gravitated towards SIG Apps and became increasingly
involved. Over time, I took on more responsibilities, culminating in my current leadership roles.
-->
**Janet**：當然可以！我是 Janet，在 Google 擔任資深軟件工程師，
並且從 Kubernetes 項目早期（甚至在 2015 年 1.0 版本發佈之前）就深度參與其中。
這是一段非常精彩的旅程！

我在 Kubernetes 社區中的當前角色是 SIG Apps 的主席之一和技術負責人之一。
我與 SIG Apps 的結緣始於自然而然的過程。最初，我從構建 Deployment API
並添加滾動更新功能開始，逐漸對 SIG Apps 產生了濃厚的興趣，並且參與度越來越高。
隨着時間推移，我承擔了更多的責任，最終走到了目前的領導崗位。

<!--
## About SIG Apps

*All following answers were jointly provided by Maciej and Janet.*

**Sandipan: For those unfamiliar, could you provide an overview of SIG Apps' mission and objectives?
What key problems does it aim to solve within the Kubernetes ecosystem?**
-->
## 關於 SIG Apps

**以下所有回答均由 Maciej 和 Janet 共同提供。**

**Sandipan**：對於那些不熟悉的人，能否簡要介紹一下 SIG Apps 的使命和目標？
它在 Kubernetes 生態系統中旨在解決哪些關鍵問題？

<!--
As described in our
[charter](https://github.com/kubernetes/community/blob/master/sig-apps/charter.md#scope), we cover a
broad area related to developing, deploying, and operating applications on Kubernetes. That, in
short, means we’re open to each and everyone showing up at our bi-weekly meetings and discussing the
ups and downs of writing and deploying various applications on Kubernetes.

**Sandipan: What are some of the most significant projects or initiatives currently being undertaken
by SIG Apps?**
-->
正如我們在[章程](https://github.com/kubernetes/community/blob/master/sig-apps/charter.md#scope)中所描述的那樣，
我們涵蓋了與在 Kubernetes 上開發、部署和操作應用程序相關的廣泛領域。
簡而言之，這意味着我們歡迎每個人參加我們的雙週會議，討論在 Kubernetes
上編寫和部署各種應用程序的經驗和挑戰。

**Sandipan**：SIG Apps 目前正在進行的一些最重要項目或倡議有哪些？

<!--
At this point in time, the main factors driving the development of our controllers are the
challenges coming from running various AI-related workloads. It’s worth giving credit here to two
working groups we’ve sponsored over the past years:
-->
在當前階段，推動我們控制器開發的主要因素是運行各種 AI 相關工作負載所帶來的挑戰。
在此值得一提的是，過去幾年我們支持的兩個工作組：

<!--
1. [The Batch Working Group](https://github.com/kubernetes/community/tree/master/wg-batch), which is
   looking at running HPC, AI/ML, and data analytics jobs on top of Kubernetes.
2. [The Serving Working Group](https://github.com/kubernetes/community/tree/master/wg-serving), which
   is focusing on hardware-accelerated AI/ML inference.
-->
1. [Batch 工作組](https://github.com/kubernetes/community/tree/master/wg-batch)，
   該工作組致力於在 Kubernetes 上運行 HPC、AI/ML 和數據分析作業。
2. [Serving 工作組](https://github.com/kubernetes/community/tree/master/wg-serving)，
   該工作組專注於硬件加速的 AI/ML 推理。

<!---
## Best practices and challenges

**Sandipan: SIG Apps plays a crucial role in developing application management best practices for
Kubernetes. Can you share some of these best practices and how they help improve application
lifecycle management?**
-->
## 最佳實踐與挑戰

**Sandipan**：SIG Apps 在爲 Kubernetes 開發應用程序管理最佳實踐方面發揮着關鍵作用。
你能分享一些這些最佳實踐嗎？以及它們如何幫助改進應用程序生命週期管理？

<!--
1. Implementing [health checks and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
ensures that your applications are healthy and ready to serve traffic, leading to improved
reliability and uptime. The above, combined with comprehensive logging, monitoring, and tracing
solutions, will provide insights into your application's behavior, enabling you to identify and
resolve issues quickly.
-->
1. 實施[健康檢查和就緒探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
   確保你的應用程序處於健康狀態並準備好處理流量，從而提高可靠性和正常運行時間。
   結合全面的日誌記錄、監控和跟蹤解決方案，上述措施將爲您提供應用程序行爲的洞察，
   使你能夠快速識別並解決問題。

<!--
2. [Auto-scale your application](/docs/concepts/workloads/autoscaling/) based
   on resource utilization or custom metrics, optimizing resource usage and ensuring your
   application can handle varying loads.
-->
2. 根據資源利用率或自定義指標[自動擴縮你的應用](/zh-cn/docs/concepts/workloads/autoscaling/)，
   優化資源使用並確保您的應用程序能夠處理不同的負載。

<!--
3. Use Deployment for stateless applications, StatefulSet for stateful applications, Job
   and CronJob for batch workloads, and DaemonSet for running a daemon on each node. Use
   Operators and CRDs to extend the Kubernetes API to automate the deployment, management, and
   lifecycle of complex applications, making them easier to operate and reducing manual
   intervention.
-->
3. 對於無狀態應用程序使用 Deployment，對於有狀態應用程序使用 StatefulSet，
   對於批處理工作負載使用 Job 和 CronJob，在每個節點上運行守護進程時使用
   DaemonSet。使用 Operator 和 CRD 擴展 Kubernetes API 以自動化複雜應用程序的部署、
   管理和生命週期，使其更易於操作並減少手動干預。

<!--
**Sandipan: What are some of the common challenges SIG Apps faces, and how do you address them?**

The biggest challenge we’re facing all the time is the need to reject a lot of features, ideas, and
improvements. This requires a lot of discipline and patience to be able to explain the reasons
behind those decisions.
-->
**Sandipan**：SIG Apps 面臨的一些常見挑戰是什麼？你們是如何解決這些問題的？

我們一直面臨的最大挑戰是需要拒絕許多功能、想法和改進。這需要大量的紀律性和耐心，
以便能夠解釋做出這些決定背後的原因。

<!--
**Sandipan: How has the evolution of Kubernetes influenced the work of SIG Apps? Are there any
recent changes or upcoming features in Kubernetes that you find particularly relevant or beneficial
for SIG Apps?**

The main benefit for both us and the whole community around SIG Apps is the ability to extend
kubernetes with [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
and the fact that users can build their own custom controllers leveraging the built-in ones to
achieve whatever sophisticated use cases they might have and we, as the core maintainers, haven’t
considered or weren’t able to efficiently resolve inside Kubernetes.
-->
**Sandipan**：Kubernetes 的演進如何影響了 SIG Apps 的工作？
Kubernetes 最近是否有任何變化或即將推出的功能，你認爲對
SIG Apps 特別相關或有益？

對我們以及圍繞 SIG Apps 的整個社區而言，
最大的好處是能夠通過[自定義資源定義（Custom Resource Definitions）](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)擴展
Kubernetes。使用者可以利用內置控制器構建自己的自定義控制器，
以實現他們可能面對的各種複雜用例，而我們作爲核心維護者，
可能沒有考慮過這些用例，或者無法在 Kubernetes 內部高效解決。

<!--
## Contributing to SIG Apps

**Sandipan: What opportunities are available for new contributors who want to get involved with SIG
Apps, and what advice would you give them?**
-->
## 貢獻於 SIG Apps

**Sandipan**：對於想要參與 SIG Apps 的新貢獻者，有哪些機會？
你會給他們什麼建議？

<!--
We get the question, "What good first issue might you recommend we start with?" a lot :-) But
unfortunately, there’s no easy answer to it. We always tell everyone that the best option to start
contributing to core controllers is to find one you are willing to spend some time with. Read
through the code, then try running unit tests and integration tests focusing on that
controller. Once you grasp the general idea, try breaking it and the tests again to verify your
breakage. Once you start feeling confident you understand that particular controller, you may want
to search through open issues affecting that controller and either provide suggestions, explaining
the problem users have, or maybe attempt your first fix.
-->
我們經常被問道：“你們建議我們從哪個好的初始問題開始？” :-)
但遺憾的是，這個問題沒有簡單的答案。我們總是告訴大家，
爲核心控制器做貢獻的最佳方式是找到一個你願意花時間研究的控制器。
閱讀代碼，然後嘗試運行鍼對該控制器的單元測試和集成測試。一旦你掌握了大致的概念，
試着破壞它並再次運行測試以驗證你的改動。當你開始有信心理解了這個特定的控制器後，
你可以搜索影響該控制器的待處理問題，提供一些建議，解釋使用者遇到的問題，
或者嘗試提交你的第一個修復。

<!--
Like we said, there are no shortcuts on that road; you need to spend the time with the codebase to
understand all the edge cases we’ve slowly built up to get to the point where we are. Once you’re
successful with one controller, you’ll need to repeat that same process with others all over again.

**Sandipan: How does SIG Apps gather feedback from the community, and how is this feedback
integrated into your work?**
-->
正如我們所說，在這條道路上沒有捷徑可走；你需要花時間研究代碼庫，
以理解我們逐步積累的所有邊緣情況，從而達到我們現在的位置。
一旦你在一個控制器上取得了成功，你就需要在其他控制器上重複同樣的過程。

**Sandipan**：SIG Apps 如何從社區收集反饋，以及這些反饋是如何整合到你們的工作中的？

<!--
We always encourage everyone to show up and present their problems and solutions during our
bi-weekly [meetings](https://github.com/kubernetes/community/tree/master/sig-apps#meetings). As long
as you’re solving an interesting problem on top of Kubernetes and you can provide valuable feedback
about any of the core controllers, we’re always happy to hear from everyone.
-->
我們總是鼓勵每個人參加我們的雙週[會議](https://github.com/kubernetes/community/tree/master/sig-apps#meetings)，
並在會上提出他們的問題和解決方案。只要你是在 Kubernetes 上解決一個有趣的問題，
並且能夠對任何核心控制器提供有價值的反饋，我們都非常樂意聽取每個人的意見。

<!--
## Looking ahead

**Sandipan: Looking ahead, what are the key focus areas or upcoming trends in application management
within Kubernetes that SIG Apps is excited about? How is the SIG adapting to these trends?**

Definitely the current AI hype is the major driving factor; as mentioned above, we have two working
groups, each covering a different aspect of it.
-->
## 展望未來

**Sandipan**：展望未來，Kubernetes 中應用程序管理的關鍵關注領域或即將到來的趨勢有哪些是
SIG Apps 感到興奮的？SIG 是如何適應這些趨勢的？

當前的 AI 熱潮無疑是主要的驅動因素；如上所述，我們有兩個工作組，
每個工作組都涵蓋了它的一個不同方面。

<!--
**Sandipan: What are some of your favorite things about this SIG?**

Without a doubt, the people that participate in our meetings and on
[Slack](https://kubernetes.slack.com/messages/sig-apps), who tirelessly help triage issues, pull
requests and invest a lot of their time (very frequently their private time) into making kubernetes
great!
-->
**Sandipan**：關於這個 SIG，你們最喜歡的事情有哪些？

毫無疑問，參與我們會議和
[Slack](https://kubernetes.slack.com/messages/sig-apps) 頻道的人們是最讓我們感到欣慰的。
他們不知疲倦地幫助處理問題、拉取請求，並投入大量的時間（很多時候是他們的私人時間）來讓
Kubernetes 變得更好！

---

<!--
SIG Apps is an essential part of the Kubernetes community, helping to shape how applications are
deployed and managed at scale. From its work on improving Kubernetes' workload APIs to driving
innovation in AI/ML application management, SIG Apps is continually adapting to meet the needs of
modern application developers and operators. Whether you’re a new contributor or an experienced
developer, there’s always an opportunity to get involved and make an impact.
-->
SIG Apps 是 Kubernetes 社區的重要組成部分，
幫助塑造了應用程序如何在大規模下部署和管理的方式。從改進 Kubernetes
的工作負載 API 到推動 AI/ML 應用程序管理的創新，SIG Apps
不斷適應以滿足現代應用程序開發者和操作人員的需求。無論你是新貢獻者還是有經驗的開發者，
都有機會參與其中併產生影響。

<!--
If you’re interested in learning more or contributing to SIG Apps, be sure to check out their [SIG
README](https://github.com/kubernetes/community/tree/master/sig-apps) and join their bi-weekly [meetings](https://github.com/kubernetes/community/tree/master/sig-apps#meetings).

- [SIG Apps Mailing List](https://groups.google.com/a/kubernetes.io/g/sig-apps)
- [SIG Apps on Slack](https://kubernetes.slack.com/messages/sig-apps)
-->
如果你有興趣瞭解更多關於 SIG Apps 的信息或爲其做出貢獻，務必查看他們的
[SIG README](https://github.com/kubernetes/community/tree/master/sig-apps)，
並加入他們的雙週[會議](https://github.com/kubernetes/community/tree/master/sig-apps#meetings)。

- [SIG Apps 郵件列表](https://groups.google.com/a/kubernetes.io/g/sig-apps)
- [SIG Apps 在 Slack 上](https://kubernetes.slack.com/messages/sig-apps)
