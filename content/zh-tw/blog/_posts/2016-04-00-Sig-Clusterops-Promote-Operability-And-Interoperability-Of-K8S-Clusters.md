---
title: " SIG-ClusterOps: 提升 Kubernetes 叢集的可操作性和互操作性 "
date: 2016-04-19
slug: sig-clusterops-promote-operability-and-interoperability-of-k8s-clusters
---
<!--
title: " SIG-ClusterOps: Promote operability and interoperability of Kubernetes clusters "
date: 2016-04-19
slug: sig-clusterops-promote-operability-and-interoperability-of-k8s-clusters
url: /blog/2016/04/Sig-Clusterops-Promote-Operability-And-Interoperability-Of-K8S-Clusters
-->

<!--
_Editor’s note: This week we’re featuring [Kubernetes Special Interest Groups](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs)); Today’s post is by the SIG-ClusterOps team whose mission is to promote operability and interoperability of Kubernetes clusters -- to listen, help & escalate._ 
-->
_編者注： 本週我們將推出 [Kubernetes 特殊興趣小組](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs))；今天的帖子由 SIG-ClusterOps 團隊負責，其任務是促進 Kubernetes 叢集的可操作性和互操作性 -- 傾聽，幫助和升級。_  

<!--
We think Kubernetes is an awesome way to run applications at scale! Unfortunately, there's a bootstrapping problem: we need good ways to build secure & reliable scale environments around Kubernetes. While some parts of the platform administration leverage the platform (cool!), there are fundamental operational topics that need to be addressed and questions (like upgrade and conformance) that need to be answered.  
-->
我們認爲 Kubernetes 是大規模運行應用程式的絕佳方法！
不幸的是，存在一個引導問題：我們需要良好的方法來圍繞 Kubernetes 構建安全可靠的擴展環境。
雖然平臺管理的某些部分利用了平臺（很酷！），這有一些基本的操作主題需要解決，還有一些問題（例如升級和一致性）需要回答。

<!--
**Enter Cluster Ops SIG – the community members who work under the platform to keep it running.**  
-->
**輸入 Cluster Ops SIG – 在平臺下工作以保持其運行的社區成員。** 

<!--
Our objective for Cluster Ops is to be a person-to-person community first, and a source of opinions, documentation, tests and scripts second. That means we dedicate significant time and attention to simply comparing notes about what is working and discussing real operations. Those interactions give us data to form opinions. It also means we can use real-world experiences to inform the project.  
-->
我們對 Cluster Ops 的目標是首先成爲一個人對人的社區，其次纔是意見、文檔、測試和腳本的來源。
這意味着我們將花費大量時間和精力來簡單地比較有關工作內容的註釋並討論實際操作。
這些互動爲我們提供了形成意見的資料。
這也意味着我們可以利用實際經驗來爲項目提供資訊。

<!--
We aim to become the forum for operational review and feedback about the project. For Kubernetes to succeed, operators need to have a significant voice in the project by weekly participation and collecting survey data. We're not trying to create a single opinion about ops, but we do want to create a coordinated resource for collecting operational feedback for the project. As a single recognized group, operators are more accessible and have a bigger impact.  
-->
我們旨在成爲對該項目進行運營審查和反饋的論壇。
爲了使 Kubernetes 取得成功，運營商需要通過每週參與並收集調查資料在項目中擁有重要的聲音。
我們並不是想對操作發表意見，但我們確實想創建一個協調的資源來收集項目的運營反饋。
作爲一個公認的團體，操作員更容易獲得影響力。

<!--
**What about real world deliverables?**  
-->
**現實世界中的可交付成果如何？**  

<!--
We've got plans for tangible results too. We’re already driving toward concrete deliverables like reference architectures, tool catalogs, community deployment notes and conformance testing. Cluster Ops wants to become the clearing house for operational resources. We're going to do it based on real world experience and battle tested deployments.  
-->
我們也有切實成果的計劃。
我們已經在努力實現具體的交付成果，例如參考架構，工具目錄，社區部署說明和一致性測試。
Cluster Ops 希望成爲運營資源的交換所。
我們將根據實際經驗和經過戰鬥測試的部署來進行此操作。

<!--
**Connect with us.**  
-->
**聯繫我們。** 

<!--
Cluster Ops can be hard work – don't do it alone. We're here to listen, to help when we can and escalate when we can't. Join the conversation at: -->
叢集運營可能會很辛苦–別一個人做。
我們在這裏傾聽，在我們可以幫助的時候提供幫助，而在我們不能幫助的時候向上一級反映。
在以下位置加入對話：

<!--
- Chat with us on the [Cluster Ops Slack channel](https://kubernetes.slack.com/messages/sig-cluster-ops/)
- Email us at the [Cluster Ops SIG email list](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-ops)
-->
- 在 [Cluster Ops Slack 頻道](https://kubernetes.slack.com/messages/sig-cluster-ops/) 與我們聊天
- 通過 [Cluster Ops SIG 電子郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-ops) 給我們發送電子郵件

<!--
The Cluster Ops Special Interest Group meets weekly at 13:00PT on Thursdays, you can join us via the [video hangout](https://plus.google.com/hangouts/_/google.com/sig-cluster-ops) and see latest [meeting notes](https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit) for agendas and topics covered.  
-->
SIG Cluster Ops 每週四在太平洋標準時間下午 13:00 開會，您可以通過
[影片環聊](https://plus.google.com/hangouts/_/google.com/sig-cluster-ops) 加入我們並查看最新的
[會議記錄](https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit)
瞭解所涉及的議程和主題。

<!--
_--Rob Hirschfeld, CEO, RackN&nbsp;_
-->
_-- RackN 首席執行官 Rob Hirschfeld_
