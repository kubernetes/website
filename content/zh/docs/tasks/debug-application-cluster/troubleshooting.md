---
reviewers:
- brendandburns
- davidopp
content_type: concept
title: 排错
---

<!--
reviewers:
- brendandburns
- davidopp
content_type: concept
title: Troubleshooting
-->

<!-- overview -->

<!--
Sometimes things go wrong. This guide is aimed at making them right. It has
two sections:
-->
有时候事情会出错。本指南旨在解决这些问题。它包含两个部分：

<!--
   * [Troubleshooting your application](/docs/tasks/debug-application-cluster/debug-application/) - Useful for users who are deploying code into Kubernetes and wondering why it is not working.
   * [Troubleshooting your cluster](/docs/tasks/debug-application-cluster/debug-cluster/) - Useful for cluster administrators and people whose Kubernetes cluster is unhappy.
-->

* [应用排错](/zh/docs/tasks/debug-application-cluster/debug-application/) - 用于部署代码到 Kubernetes 并想知道代码为什么不能正常运行的用户。
* [集群排错](/zh/docs/tasks/debug-application-cluster/debug-cluster/) - 用于集群管理员以及 Kubernetes 集群表现异常的用户。

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
and command-line interfaces (CLIs), such as [`kubectl`](/docs/user-guide/kubectl-overview/).
-->
### 提问

本网站上的文档针对回答各类问题进行了结构化组织和分类。
[概念](/zh/docs/concepts/)部分解释 Kubernetes 体系结构以及每个组件的工作方式，
[安装](/zh/docs/setup/)部分提供了安装的实用说明。
[任务](/zh/docs/tasks/)部分展示了如何完成常用任务，
[教程](/zh/docs/tutorials/)部分则提供对现实世界、特定行业或端到端开发场景的更全面的演练。
[参考](/zh/docs/reference/)部分提供了详细的
[Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 文档
和命令行 (CLI) 接口的文档，例如[`kubectl`](/zh/docs/reference/kubectl/overview/)。

<!--
You may also find the Stack Overflow topics relevant:
-->
你还在 StackOverflow 上查找相关主题：

* [Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes)
* [Google Kubernetes Engine](https://stackoverflow.com/questions/tagged/google-container-engine)

<!--
## Help! My question isn't covered!  I need help now!
-->
## 求救！我的问题还没有解决！我需要立即得到帮助！

<!--
### Stack Overflow

Someone else from the community may have already asked a similar question or may
be able to help with your problem. The Kubernetes team will also monitor
[posts tagged Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
If there aren't any existing questions that help, please
[ask a new one](https://stackoverflow.com/questions/ask?tags=kubernetes)!
-->
### StackOverflow    {#stack-overflow}

社区中的其他人可能已经问过和你类似的问题，也可能能够帮助解决你的问题。
Kubernetes 团队还会监视[带有 Kubernetes 标签的帖子](https://stackoverflow.com/questions/tagged/kubernetes)。
如果现有的问题对你没有帮助，请[问一个新问题](https://stackoverflow.com/questions/ask?tags=kubernetes)!

<!--
### Slack

The Kubernetes team hangs out on Slack in the `#kubernetes-users` channel. You
can participate in discussion with the Kubernetes team [here](https://kubernetes.slack.com).
Slack requires registration, but the Kubernetes team is open invitation to
anyone to register [here](https://slack.kubernetes.io). Feel free to come and ask
any and all questions.
-->
### Slack

Kubernetes 团队在 Slack 中建有 `#kubernetes-users` 频道。
你可以[在这里](https://kubernetes.slack.com)参与 Kubernetes 团队的讨论。
Slack 需要注册，但 Kubernetes 团队公开邀请任何人[在这里](https://slack.kubernetes.io)注册。
欢迎你随时来问任何问题。

<!--
Once registered, browse the growing list of channels for various subjects of
interest. For example, people new to Kubernetes may also want to join the
`#kubernetes-novice` channel. As another example, developers should join the
`#kubernetes-dev` channel.
-->
一旦注册完成，你就可以浏览各种感兴趣的频道列表。
例如，Kubernetes 新人可能还想加入 `#kubernetes-novice` 频道。
又比如，开发人员应该加入 `#kubernetes-dev` 频道。

<!--
There are also many country specific/local language channels. Feel free to join
these channels for localized support and info:
-->
还有许多国家/地区语言频道。请随时加入这些频道以获得本地化支持和信息：

<!--
- China: `#cn-users`, `#cn-events`
- France: `#fr-users`, `#fr-events`
- Germany: `#de-users`, `#de-events`
- India: `#in-users`, `#in-events`
- Italy: `#it-users`, `#it-events`
- Japan: `#jp-users`, `#jp-events`
- Korea: `#kr-users`
- Netherlands: `#nl-users`
- Norway: `#norw-users`
- Poland: `#pl-users`
- Russia: `#ru-users`
- Spain: `#es-users`
- Turkey: `#tr-users`, `#tr-events`
-->
- 中国： `#cn-users`, `#cn-events`
- 法国： `#fr-users`, `#fr-events`
- 德国： `#de-users`, `#de-events`
- 印度： `#in-users`, `#in-events`
- 意大利： `#it-users`, `#it-events`
- 日本： `#jp-users`, `#jp-events`
- 韩国： `#kr-users`
- 荷兰： `#nl-users`
- 挪威： `#norw-users`
- 波兰： `#pl-users`
- 俄罗斯： `#ru-users`
- 西班牙： `#es-users`
- 土耳其： `#tr-users`, `#tr-events`


<!--
### Forum

The Kubernetes Official Forum [discuss.kubernetes.io](https://discuss.kubernetes.io)
-->
### 论坛  {#forum}

Kubernetes 官方论坛 [discuss.kubernetes.io](https://discuss.kubernetes.io)

<!--
### Bugs and Feature requests

If you have what looks like a bug, or you would like to make a feature request,
please use the [Github issue tracking system](https://github.com/kubernetes/kubernetes/issues).
-->
### Bugs 和功能请求（Feature Request）

如果你发现一个看起来像 Bug 的问题，或者你想提出一个功能请求，请使用
[Github 问题跟踪系统](https://github.com/kubernetes/kubernetes/issues)。

<!--
Before you file an issue, please search existing issues to see if your issue is
already covered.

If filing a bug, please include detailed information about how to reproduce the
problem, such as:
-->
在提交问题之前，请搜索现有问题以查看是否其中已涵盖你的问题。

如果提交 Bug，请提供如何重现问题的详细信息，例如：

<!--
* Kubernetes version: `kubectl version`
* Cloud provider, OS distro, network configuration, and Docker version
* Steps to reproduce the problem
-->
* Kubernetes 版本：获取版本的命令为 `kubectl version`
* 云提供商、OS 发行版、网络配置和 Docker 版本
* 重现问题的步骤


