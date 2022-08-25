---
title: " SIG-ClusterOps: 提升 Kubernetes 集群的可操作性和互操作性 "
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
_编者注： 本周我们将推出 [Kubernetes 特殊兴趣小组](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs))；今天的帖子由 SIG-ClusterOps 团队负责，其任务是促进 Kubernetes 集群的可操作性和互操作性 -- 倾听，帮助和升级。_  

<!--
We think Kubernetes is an awesome way to run applications at scale! Unfortunately, there's a bootstrapping problem: we need good ways to build secure & reliable scale environments around Kubernetes. While some parts of the platform administration leverage the platform (cool!), there are fundamental operational topics that need to be addressed and questions (like upgrade and conformance) that need to be answered.  
-->
我们认为 Kubernetes 是大规模运行应用程序的绝佳方法！
不幸的是，存在一个引导问题：我们需要良好的方法来围绕 Kubernetes 构建安全可靠的扩展环境。
虽然平台管理的某些部分利用了平台（很酷！），这有一些基本的操作主题需要解决，还有一些问题（例如升级和一致性）需要回答。

<!--
**Enter Cluster Ops SIG – the community members who work under the platform to keep it running.**  
-->
**输入 Cluster Ops SIG – 在平台下工作以保持其运行的社区成员。** 

<!--
Our objective for Cluster Ops is to be a person-to-person community first, and a source of opinions, documentation, tests and scripts second. That means we dedicate significant time and attention to simply comparing notes about what is working and discussing real operations. Those interactions give us data to form opinions. It also means we can use real-world experiences to inform the project.  
-->
我们对 Cluster Ops 的目标是首先成为一个人对人的社区，其次才是意见、文档、测试和脚本的来源。
这意味着我们将花费大量时间和精力来简单地比较有关工作内容的注释并讨论实际操作。
这些互动为我们提供了形成意见的数据。
这也意味着我们可以利用实际经验来为项目提供信息。

<!--
We aim to become the forum for operational review and feedback about the project. For Kubernetes to succeed, operators need to have a significant voice in the project by weekly participation and collecting survey data. We're not trying to create a single opinion about ops, but we do want to create a coordinated resource for collecting operational feedback for the project. As a single recognized group, operators are more accessible and have a bigger impact.  
-->
我们旨在成为对该项目进行运营审查和反馈的论坛。
为了使 Kubernetes 取得成功，运营商需要通过每周参与并收集调查数据在项目中拥有重要的声音。
我们并不是想对操作发表意见，但我们确实想创建一个协调的资源来收集项目的运营反馈。
作为一个公认的团体，操作员更容易获得影响力。

<!--
**What about real world deliverables?**  
-->
**现实世界中的可交付成果如何？**  

<!--
We've got plans for tangible results too. We’re already driving toward concrete deliverables like reference architectures, tool catalogs, community deployment notes and conformance testing. Cluster Ops wants to become the clearing house for operational resources. We're going to do it based on real world experience and battle tested deployments.  
-->
我们也有切实成果的计划。
我们已经在努力实现具体的交付成果，例如参考架构，工具目录，社区部署说明和一致性测试。
Cluster Ops 希望成为运营资源的交换所。
我们将根据实际经验和经过战斗测试的部署来进行此操作。

<!--
**Connect with us.**  
-->
**联系我们。** 

<!--
Cluster Ops can be hard work – don't do it alone. We're here to listen, to help when we can and escalate when we can't. Join the conversation at: -->
集群运营可能会很辛苦–别一个人做。
我们在这里倾听，在我们可以帮助的时候提供帮助，而在我们不能帮助的时候向上一级反映。
在以下位置加入对话：

<!--
- Chat with us on the [Cluster Ops Slack channel](https://kubernetes.slack.com/messages/sig-cluster-ops/)
- Email us at the [Cluster Ops SIG email list](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-ops)
-->
- 在 [Cluster Ops Slack 频道](https://kubernetes.slack.com/messages/sig-cluster-ops/) 与我们聊天
- 通过 [Cluster Ops SIG 电子邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-ops) 给我们发送电子邮件

<!--
The Cluster Ops Special Interest Group meets weekly at 13:00PT on Thursdays, you can join us via the [video hangout](https://plus.google.com/hangouts/_/google.com/sig-cluster-ops) and see latest [meeting notes](https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit) for agendas and topics covered.  
-->
SIG Cluster Ops 每周四在太平洋标准时间下午 13:00 开会，您可以通过
[视频环聊](https://plus.google.com/hangouts/_/google.com/sig-cluster-ops) 加入我们并查看最新的
[会议记录](https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit)
了解所涉及的议程和主题。

<!--
_--Rob Hirschfeld, CEO, RackN&nbsp;_
-->
_-- RackN 首席执行官 Rob Hirschfeld_
