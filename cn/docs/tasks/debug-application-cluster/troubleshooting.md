---
approvers:
- brendandburns
- davidopp
title: 排除故障
---

<!--
title: Troubleshooting
-->

<!--
Sometimes things go wrong. This guide is aimed at making them right. It has
two sections:

   * [Troubleshooting your application](/docs/tasks/debug-application-cluster/debug-application/) - Useful for users who are deploying code into Kubernetes and wondering why it is not working.
   * [Troubleshooting your cluster](/docs/tasks/debug-application-cluster/debug-cluster/) - Useful for cluster administrators and people whose Kubernetes cluster is unhappy.

You should also check the known issues for the [release](https://github.com/kubernetes/kubernetes/releases)
you're using.
-->

有时候会出现问题。本指南旨在使其正确。它有两个部分：

   * [排除应用程序的故障](/docs/tasks/debug-application-cluster/debug-application/) —— 适用于向 Kubernetes 部署代码，并想知道为什么它不工作的用户。
   * [排除集群故障](/docs/tasks/debug-application-cluster/debug-cluster/) —— 适用于集群管理员和定位 Kubernetes 集群问题的用户。

你还应该检查你正在使用的[发行版](https://github.com/kubernetes/kubernetes/releases)的已知问题。

<!--
## Getting help

If your problem isn't answered by any of the guides above, there are variety of
ways for you to get help from the Kubernetes team.
-->

## 获取帮助

如果你的问题没有得到上述指南的解答，你可以通过多种方式从 Kubernetes 团队获得帮助。

<!--
### Questions

The documentation on this site has been structured to provide answers to a wide
range of questions. [Concepts](/docs/concepts/) explain the Kubernetes
architecture and how each component works, while [Setup](/docs/setup/) provides
practical instructions for getting started. [Tasks](/docs/tasks/) show how to
accomplish commonly used tasks, and [Tutorials](/docs/tutorials/) are more
comprehensive walkthroughs of real-world, industry-specific, or end-to-end
development scenarios. The [Reference](/docs/reference/) section provides
detailed documentation on the [Kubernetes API](/docs/api-reference/{{page.version}}/)
and command-line interfaces (CLIs), such as [`kubectl`](/docs/user-guide/kubectl-overview/).
-->

### 问题

本站已经按照问题的范围进行结构化。[Concepts](/docs/concepts/) 解释 Kubernetes 架构以及每个组件的工作原理；[Setup](/docs/setup/) 提供了开始使用的实用指导。[Tasks](/docs/tasks/) 展示了如何完成常用任务；[Tutorials](/docs/tutorials/) 是对现实世界、特定行业或端到端开发场景的更全面的演练。[Reference](/docs/reference/) 提供了有关[Kubernetes API](/docs/api-reference/{{page.version}}/) 和命令行界面（CLIs）的详细文档，例如 [`kubectl`](/docs/user-guide/kubectl-overview/)。

<!--
We also have a number of FAQ pages:

   * [User FAQ](https://github.com/kubernetes/kubernetes/wiki/User-FAQ)
   * [Debugging FAQ](https://github.com/kubernetes/kubernetes/wiki/Debugging-FAQ)
   * [Services FAQ](https://github.com/kubernetes/kubernetes/wiki/Services-FAQ)
-->

我们也有很多 FAQ 页面：

   * [User FAQ](https://github.com/kubernetes/kubernetes/wiki/User-FAQ)
   * [Debugging FAQ](https://github.com/kubernetes/kubernetes/wiki/Debugging-FAQ)
   * [Services FAQ](https://github.com/kubernetes/kubernetes/wiki/Services-FAQ)

<!--
You may also find the Stack Overflow topics relevant:

   * [Kubernetes](http://stackoverflow.com/questions/tagged/kubernetes)
   * [Google Container Engine - GKE](http://stackoverflow.com/questions/tagged/google-container-engine)
-->

你也能在 Stack Overflow 找到相关主题：

   * [Kubernetes](http://stackoverflow.com/questions/tagged/kubernetes)
   * [Google Container Engine - GKE](http://stackoverflow.com/questions/tagged/google-container-engine)

<!--
## Help! My question isn't covered!  I need help now!

### Stack Overflow

Someone else from the community may have already asked a similar question or may
be able to help with your problem. The Kubernetes team will also monitor
[posts tagged Kubernetes](http://stackoverflow.com/questions/tagged/kubernetes).
If there aren't any existing questions that help, please [ask a new one](http://stackoverflow.com/questions/ask?tags=kubernetes)!
-->

## 帮帮我！我的问题没有涵盖！我现在需要帮忙！

### Stack Overflow

社区其他人可能已经问过类似的问题，或者可能会帮助你解决问题。Kubernetes 团队也会监控 [Kubernetes 标签的帖子](http://stackoverflow.com/questions/tagged/kubernetes)。如果不存在任何有用的问题，请[提一个新的问题](http://stackoverflow.com/questions/ask?tags=kubernetes)！

<!--
### Slack

The Kubernetes team hangs out on Slack in the `#kubernetes-users` channel. You
can participate in discussion with the Kubernetes team [here](https://kubernetes.slack.com).
Slack requires registration, but the Kubernetes team is open invitation to
anyone to register [here](http://slack.kubernetes.io). Feel free to come and ask
any and all questions.
-->

### Slack

Kubernetes 团队在 Slack 中有 `#kubernetes-users` 频道。你可以在这里参加与Kubernetes团队的讨论。Slack 需要注册，但是 Kubernetes 是公开的，任何人都可以在这里[注册](http://slack.kubernetes.io)。随时来问问题。

<!--
Once registered, browse the growing list of channels for various subjects of
interest. For example, people new to Kubernetes may also want to join the
`#kubernetes-novice` channel. As another example, developers should join the
`#kubernetes-dev` channel.
-->

注册后，可以浏览各种感兴趣的频道。例如，Kubernetes 新人可以加入 `#kubernetes-novice` 频道。开发者可以加入 `#kubernetes-dev` 频道。

<!--
There are also many country specific/local language channels. Feel free to join
these channels for localized support and info:

- France: `#fr-users`, `#fr-events`
- Germany: `#de-users`, `#de-events`
- Japan: `#jp-users`, `#jp-events`
-->

也有很多国家或地区的频道，随时加入这些频道获取本地化支持和信息：

- France: `#fr-users`, `#fr-events`
- Germany: `#de-users`, `#de-events`
- Japan: `#jp-users`, `#jp-events`

<!--
### Mailing List

The Kubernetes / Google Container Engine mailing list is [kubernetes-users@googlegroups.com](https://groups.google.com/forum/#!forum/kubernetes-users)
-->

### 邮件列表

Kubernetes / Google Container Engine 邮件列表是 [kubernetes-users@googlegroups.com](https://groups.google.com/forum/#!forum/kubernetes-users)。

<!--
### Bugs and Feature requests

If you have what looks like a bug, or you would like to make a feature request,
please use the [Github issue tracking system](https://github.com/kubernetes/kubernetes/issues).
-->

### Bug 和功能请求

如果你有什么看起来像一个 bug ，或者你想要一个功能。请使用[Github 问题跟踪系统](https://github.com/kubernetes/kubernetes/issues)。

<!--
Before you file an issue, please search existing issues to see if your issue is
already covered.

If filing a bug, please include detailed information about how to reproduce the
problem, such as:

* Kubernetes version: `kubectl version`
* Cloud provider, OS distro, network configuration, and Docker version
* Steps to reproduce the problem
-->

在你提出问题之前，请搜索现有问题，看看你的问题是否已经存在。

如果提交一个 bug, 请提供有关如何重现问题的详细信息，例如：

* Kubernetes 版本：`kubectl version`
* 云提供商，OS 发行版本，网络配置和 Docker 版本
* 重现问题的步骤
