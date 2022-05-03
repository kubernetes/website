<!--
---
title: "Monitoring, Logging, and Debugging"
description: Set up monitoring and logging to troubleshoot a cluster, or debug a containerized application.
weight: 20
reviewers:
- brendandburns
- davidopp
content_type: concept
no_list: true
---
-->

---
title: 监控、日志和调试
description: 安装监视和日志机制，用以排查集群故障或调试容器化应用
weight: 20
reviewers:
- brendandburns
- davidopp
content_type: concept
no_list: true
---

<!-- overview -->
<!--
Sometimes things go wrong. This guide is aimed at making them right. It has
two sections:

* [Debugging your application](/docs/tasks/debug/debug-application/) - Useful
  for users who are deploying code into Kubernetes and wondering why it is not working.
* [Debugging your cluster](/docs/tasks/debug/debug-cluster/) - Useful
  for cluster administrators and people whose Kubernetes cluster is unhappy.

You should also check the known issues for the [release](https://github.com/kubernetes/kubernetes/releases)
you're using.
-->


有时候会出问题。本指南旨在纠正这些错误。它有两个部分:

* [调试应用程序](/zh/docs/tasks/debug/debug-application/) -
  对于那些将代码部署到 Kubernetes 上并想知道为什么它不能正常工作的用户很有用。
* [调试集群](/zh/docs/tasks/debug/debug-cluster/) -
  对于集群管理员和 Kubernetes 集群工作状况不理想的情况很有用。

你还应该基于你所使用的[发行版本](https://github.com/kubernetes/kubernetes/releases)检查已知的问题 。


<!-- body -->


## 获得帮助   {#getting-help}
<!--
If your problem isn't answered by any of the guides above, there are variety of
ways for you to get help from the Kubernetes community.
-->
如果上面的指南都没有回答你的问题，你可以采用很多其他方式从 Kubernetes 社区获得帮助。

### 问题    {#questions}
<!--
The documentation on this site has been structured to provide answers to a wide
range of questions. [Concepts](/docs/concepts/) explain the Kubernetes
architecture and how each component works, while [Setup](/docs/setup/) provides
practical instructions for getting started. [Tasks](/docs/tasks/) show how to
accomplish commonly used tasks, and [Tutorials](/docs/tutorials/) are more
comprehensive walkthroughs of real-world, industry-specific, or end-to-end
development scenarios. The [Reference](/docs/reference/) section provides
detailed documentation on the [Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
and command-line interfaces (CLIs), such as [`kubectl`](/docs/reference/kubectl/).
-->

本网站上文档的架构组织是针对很多问题提供答案。
[概念](/zh/docs/concepts/)节解释 Kubernetes 架构以及每个组件的工作原理，
[设置](/zh/docs/setup/)提供了入门用的使用指南。
[任务](/zh/docs/tasks/)部分展示如何完成常用任务，
而[教程](/zh/docs/tutorials/)部分提供更为全面的演练说明，展示真实世界、特定于行业或端到端的场景。
[参考](/zh/docs/reference/)部分提供有关
[Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
和command-line interfaces (CLIs), 比如 [`kubectl`](/docs/reference/kubectl/).

## Help! My question isn't covered!  I need help now!

### Stack Overflow
<!--

Someone else from the community may have already asked a similar question or may
be able to help with your problem. The Kubernetes team will also monitor
[posts tagged Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
If there aren't any existing questions that help, **please [ensure that your question is on-topic on Stack Overflow](https://stackoverflow.com/help/on-topic)
and that you read through the guidance on [how to ask a new question](https://stackoverflow.com/help/how-to-ask)**,
before [asking a new one](https://stackoverflow.com/questions/ask?tags=kubernetes)!
-->


社区里的其他人可能已经问过类似的问题能帮你解决问题。Kubernetes团队也将进行监测
[posts tagged Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
如果现在没有任何有用的问题, 请 [确认您的问题建立一个话题在 Stack Overflow](https://stackoverflow.com/help/on-topic)
并且你应该通读一下指导 [怎样建立一个问题](https://stackoverflow.com/help/how-to-ask)**,
之前 [建立一个新的问题](https://stackoverflow.com/questions/ask?tags=kubernetes)!

### Slack
<!--
Many people from the Kubernetes community hang out on Kubernetes Slack in the `#kubernetes-users` channel.
Slack requires registration; you can [request an invitation](https://slack.kubernetes.io),
and registration is open to everyone). Feel free to come and ask any and all questions.
Once registered, access the [Kubernetes organisation in Slack](https://kubernetes.slack.com)
via your web browser or via Slack's own dedicated app.

Once you are registered, browse the growing list of channels for various subjects of
interest. For example, people new to Kubernetes may also want to join the
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice) channel. As another example, developers should join the
[`#kubernetes-dev`](https://kubernetes.slack.com/messages/kubernetes-dev) channel.

There are also many country specific / local language channels. Feel free to join
these channels for localized support and info:


{{< table caption="Country / language specific Slack channels" >}}
Country | Channels
-->

很多Kubernetes社区的人在Kubernetes Slack上闲逛 `#kubernetes-users` 频道.
Slack 需要注册; 你可以 [发起一个请求](https://slack.kubernetes.io),
并且注册已向每个人开放). 请随时来问任何问题.
一旦注册, 进入 [Kubernetes 组织 in Slack](https://kubernetes.slack.com)
你可以通过网页浏览器，也可以通过Slack自己的专用APP。

一旦你注册了，浏览不断增长的各种主题的频道列表
的兴趣。 比如, Kubernetes的新成员可能也想加入
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice) 频道. 另一个例子是，开发人员应该加入
[`#kubernetes-dev`](https://kubernetes.slack.com/messages/kubernetes-dev) 频道.

还有许多特定国家/当地语言的频道。欢迎加入这些本地化支持和信息的渠道:

{{< table caption="Country / language specific Slack channels" >}}
国家 | 频道
:---------|:------------
中国 | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
芬兰 | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
法国 | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
德国 | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
印度 | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
意大利 | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
日报 | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
韩国 | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
荷兰| [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
挪威 | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
波兰 | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
俄罗斯 | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
西班牙 | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
瑞典 | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
土耳其 | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### Forum
<!--

You're welcome to join the official Kubernetes Forum: [discuss.kubernetes.io](https://discuss.kubernetes.io).
-->

欢迎您加入Kubernetes官方论坛:: [discuss.kubernetes.io](https://discuss.kubernetes.io).

### Bugs and feature requests

<!--
If you have what looks like a bug, or you would like to make a feature request,
please use the [GitHub issue tracking system](https://github.com/kubernetes/kubernetes/issues).

Before you file an issue, please search existing issues to see if your issue is
already covered.

If filing a bug, please include detailed information about how to reproduce the
problem, such as:

* Kubernetes version: `kubectl version`
* Cloud provider, OS distro, network configuration, and container runtime version
* Steps to reproduce the problem
-->

如果您发现一个bug，或者你想要提出一个功能请求，
请使用 [GitHub 问题跟踪系统](https://github.com/kubernetes/kubernetes/issues).

在您提交问题之前，请搜索现有问题，以查看您的问题是否已经存在。


如果提交bug，请包括如何重现问题的详细信息，例如:

* Kubernetes 版本: `kubectl version`
* 云提供商, OS版本, 网络配置,和容器运行时版本
* 重现问题的步骤
