---
title: 监控、日志和调试
description: 设置监控和日志记录以对集群进行故障排除或调试容器化应用程序。
weight: 40
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: 寻求帮助
---
<!--
title: "Monitoring, Logging, and Debugging"
description: Set up monitoring and logging to troubleshoot a cluster, or debug a containerized application.
weight: 40
reviewers:
- brendandburns
- davidopp
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: Getting help
-->

<!-- overview -->

<!--
Sometimes things go wrong. This guide is aimed at making them right. It has
two sections:
-->
有时候事情会出错。本指南旨在解决这些问题。它包含两个部分：

<!--
* [Debugging your application](/docs/tasks/debug/debug-application/) - Useful
  for users who are deploying code into Kubernetes and wondering why it is not working.
* [Debugging your cluster](/docs/tasks/debug/debug-cluster/) - Useful
  for cluster administrators and people whose Kubernetes cluster is unhappy.
-->
* [应用排错](/zh-cn/docs/tasks/debug/debug-application/) -
  针对部署代码到 Kubernetes 并想知道代码为什么不能正常运行的用户。
* [集群排错](/zh-cn/docs/tasks/debug/debug-cluster/) -
  针对集群管理员以及 Kubernetes 集群表现异常的用户。

<!--
You should also check the known issues for the [release](https://github.com/kubernetes/kubernetes/releases)
you're using.
-->
你也应该查看所用[发行版本](https://github.com/kubernetes/kubernetes/releases)的已知问题。

<!-- body -->

<!--
## Getting help

If your problem isn't answered by any of the guides above, there are variety of
ways for you to get help from the Kubernetes team.
-->
## 获取帮助  {#getting-help}

如果你的问题在上述指南中没有得到答案，你还有另外几种方式从 Kubernetes 团队获得帮助。

<!--
### Questions

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
### 问题  {#questions}

本网站上的文档针对回答各类问题进行了结构化组织和分类。
[概念](/zh-cn/docs/concepts/)部分解释 Kubernetes 体系结构以及每个组件的工作方式，
[安装](/zh-cn/docs/setup/)部分提供了安装的实用说明。
[任务](/zh-cn/docs/tasks/)部分展示了如何完成常用任务，
[教程](/zh-cn/docs/tutorials/)部分则提供对现实世界、特定行业或端到端开发场景的更全面的演练。
[参考](/zh-cn/docs/reference/)部分提供了详细的
[Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 文档
和命令行 (CLI) 接口的文档，例如[`kubectl`](/zh-cn/docs/reference/kubectl/)。

<!--
## Help! My question isn't covered!  I need help now!
-->
## 求救！我的问题还没有解决！我现在需要帮助！

<!--
### Stack Exchange, Stack Overflow, or Server Fault {#stack-exchange}

If you have questions related to *software development* for your containerized app,
you can ask those on [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes).

If you have Kubernetes questions related to *cluster management* or *configuration*,
you can ask those on
[Server Fault](https://serverfault.com/questions/tagged/kubernetes).
-->
### Stack Exchange、Stack Overflow 或 Server Fault {#stack-exchange}

若你对容器化应用有**软件开发**相关的疑问，你可以在
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes) 上询问。

若你有**集群管理**或**配置**相关的疑问，你可以在
[Server Fault](https://serverfault.com/questions/tagged/kubernetes) 上询问。

<!--
There are also several more specific Stack Exchange network sites which might
be the right place to ask Kubernetes questions in areas such as
[DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes), 
[Software Engineering](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes),
or [InfoSec](https://security.stackexchange.com/questions/tagged/kubernetes).

Someone else from the community may have already asked a similar question or 
may be able to help with your problem.
-->
还有几个更专业的 Stack Exchange 网站，很适合在这些地方询问有关
[DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes)、
[软件工程](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes)或[信息安全 (InfoSec)](https://security.stackexchange.com/questions/tagged/kubernetes)
领域中 Kubernetes 的问题。

社区中的其他人可能已经问过和你类似的问题，也可能能够帮助解决你的问题。

<!--
The Kubernetes team will also monitor
[posts tagged Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
If there aren't any existing questions that help, **please ensure that your question 
is [on-topic on Stack Overflow](https://stackoverflow.com/help/on-topic),
[Server Fault](https://serverfault.com/help/on-topic), or the Stack Exchange 
Network site you're asking on**, and read through the guidance on 
[how to ask a new question](https://stackoverflow.com/help/how-to-ask),
before asking a new one!
-->
Kubernetes 团队还会监视[带有 Kubernetes 标签的帖子](https://stackoverflow.com/questions/tagged/kubernetes)。
如果现有的问题对你没有帮助，**请在问一个新问题之前，确保你的问题切合
[Stack Overflow](https://stackoverflow.com/help/on-topic)、
[Server Fault](https://serverfault.com/help/on-topic) 或 Stack Exchange 的主题**，
并通读[如何提出新问题](https://stackoverflow.com/help/how-to-ask)的指导说明！

<!--
### Slack

Many people from the Kubernetes community hang out on Kubernetes Slack in the `#kubernetes-users` channel.
Slack requires registration; you can [request an invitation](https://slack.kubernetes.io),
and registration is open to everyone). Feel free to come and ask any and all questions.
Once registered, access the [Kubernetes organisation in Slack](https://kubernetes.slack.com)
via your web browser or via Slack's own dedicated app.
-->
### Slack

Kubernetes 社区中有很多人在 `#kubernetes-users` 这一 Slack 频道聚集。
Slack 需要注册；你可以[请求一份邀请](https://slack.kubernetes.io)，
并且注册是对所有人开放的。欢迎你随时来问任何问题。
一旦注册了，就可以访问通过 Web 浏览器或者 Slack 专用的应用访问
[Slack 上的 Kubernetes 组织](https://kubernetes.slack.com)。

<!--
Once you are registered, browse the growing list of channels for various subjects of
interest. For example, people new to Kubernetes may also want to join the
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice) channel. As another example, developers should join the
[`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors) channel.
-->
一旦你完成了注册，就可以浏览各种感兴趣主题的频道列表（一直在增长）。
例如，Kubernetes 新人可能还想加入
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice)
频道。又比如，开发人员应该加入
[`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors)
频道。

<!--
There are also many country specific/local language channels. Feel free to join
these channels for localized support and info:
-->
还有许多国家/地区语言频道。请随时加入这些频道以获得本地化支持和信息：

{{< table caption="Country / language specific Slack channels" >}}
<!--
Country | Channels
:---------|:------------
China | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Finland | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
France | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Germany | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
India | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Italy | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Japan | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Korea | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Netherlands | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Norway | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Poland | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Russia | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Spain | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Sweden | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Turkey | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
-->
国家   | 频道
:------|:------------
中国   | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
芬兰   | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
法国   | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
德国   | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
印度   | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
意大利 | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
日本   | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
韩国   | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
荷兰   | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
挪威   | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
波兰   | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
俄罗斯 | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
西班牙 | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
瑞典   | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
土耳其 | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)

{{< /table >}}

<!--
### Forum

You're welcome to join the official Kubernetes Forum: [discuss.kubernetes.io](https://discuss.kubernetes.io).
-->
### 论坛  {#forum}

欢迎你加入 Kubernetes 官方论坛
[discuss.kubernetes.io](https://discuss.kubernetes.io)。

<!--
### Bugs and Feature requests

If you have what looks like a bug, or you would like to make a feature request,
please use the [Github issue tracking system](https://github.com/kubernetes/kubernetes/issues).
-->
### Bug 和功能请求   {#bugs-and-feature-requests}

如果你发现一个看起来像 Bug 的问题，或者你想提出一个功能请求，请使用
[GitHub 问题跟踪系统](https://github.com/kubernetes/kubernetes/issues)。

<!--
Before you file an issue, please search existing issues to see if your issue is
already covered.

If filing a bug, please include detailed information about how to reproduce the
problem, such as:
-->
在提交问题之前，请搜索现有问题列表以查看是否其中已涵盖你的问题。

如果提交 Bug，请提供如何重现问题的详细信息，例如：

<!--
* Kubernetes version: `kubectl version`
* Cloud provider, OS distro, network configuration, and Docker version
* Steps to reproduce the problem
-->
* Kubernetes 版本：`kubectl version`
* 云平台、OS 发行版、网络配置和 Docker 版本
* 重现问题的步骤
