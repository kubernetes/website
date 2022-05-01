---
title: "监控, 日志,  和调试"
description: 设置监视和日志记录，以排除集群故障，或调试容器化应用程序.
weight: 20
reviewers:
- brendandburns
- davidopp
content_type: concept
no_list: true
---

<!-- overview -->

有时候会出问题。本指南旨在纠正这些错误。它有
两个部分:

* [调试应用程序](/docs/tasks/debug/debug-application/) - Useful
  对于那些将代码部署到Kubernetes并想知道为什么它不能正常工作的用户。
* [调试集群](/docs/tasks/debug/debug-cluster/) - Useful
  对于集群管理员和Kubernetes集群不满意的人来说。

您还应该根据倪成的版本检查已知的问题 [release](https://github.com/kubernetes/kubernetes/releases)


<!-- body -->

## Getting help

如果上面的任何指南都没有回答你的问题，还有你可以各种各样的从Kubernetes社区获得帮助。

### Questions

本网站上的文档已被结构化，以提供广泛的答案一系列的问题。 [Concepts](/docs/concepts/)解释Kubernetes的架构以及每个组件的工作原理,[设置](/docs/setup/) 提供了
入门的实用说明。 [任务](/docs/tasks/) 展示如何
完成常用任务，, 并且 [教程](/docs/tutorials/) 更全面的进入更真实世界、特定于行业或端到端的全面演练开发场景。[参考](/docs/reference/) 部分提供
有关 [Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
和command-line interfaces (CLIs), 比如 [`kubectl`](/docs/reference/kubectl/).

## Help! My question isn't covered!  I need help now!

### Stack Overflow

社区里的其他人可能已经问过类似的问题能帮你解决问题。Kubernetes团队也将进行监测
[posts tagged Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
如果现在没有任何有用的问题, 请 [确认您的问题建立一个话题在 Stack Overflow](https://stackoverflow.com/help/on-topic)
并且你应该通读一下指导 [怎样建立一个问题](https://stackoverflow.com/help/how-to-ask)**,
之前 [建立一个新的问题](https://stackoverflow.com/questions/ask?tags=kubernetes)!

### Slack

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

欢迎您加入Kubernetes官方论坛:: [discuss.kubernetes.io](https://discuss.kubernetes.io).

### Bugs and feature requests

如果您发现一个bug，或者你想要提出一个功能请求，
请使用 [GitHub 问题跟踪系统](https://github.com/kubernetes/kubernetes/issues).

在您提交问题之前，请搜索现有问题，以查看您的问题是否已经存在。


如果提交bug，请包括如何重现问题的详细信息，例如:

* Kubernetes 版本: `kubectl version`
* 云提供商, OS版本, 网络配置,和容器运行时版本
* 重现问题的步骤


