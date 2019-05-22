---
layout: blog
title: '如何参与 Kubernetes 文档的本地化工作'
date: 2019-04-26
---

**作者: Zach Corleissen（Linux 基金会）**

去年我们对 Kubernetes 网站进行了优化，加入了[多语言内容的支持](https://kubernetes.io/blog/2018/11/08/kubernetes-docs-updates-international-edition/)。贡献者们踊跃响应，加入了多种新的本地化内容：截至 2019 年 4 月，Kubernetes 文档有了 9 个不同语言的未完成版本，其中有 6 个是 2019 年加入的。在每个 Kubernetes 文档页面的上方，读者都可以看到一个语言选择器，其中列出了所有可用语言。

不论是完成度最高的[中文版 v1.12](https://v1-12.docs.kubernetes.io/zh/)，还是最新加入的[葡萄牙文版 v1.14](https://kubernetes.io/pt/)，各语言的本地化内容还未完成，这是一个进行中的项目。如果读者有兴趣对现有本地化工作提供支持，请继续阅读。

## 什么是本地化

翻译是以词表意的问题。而本地化在此基础之上，还包含了过程和设计方面的工作。

本地化和翻译很像，但是包含更多内容。除了进行翻译之外，本地化还要为编写和发布过程的框架进行优化。例如，Kubernetes.io 多数的站点浏览功能（按钮文字）都保存在[单独的文件](https://github.com/kubernetes/website/tree/master/i18n)之中。所以启动新本地化的过程中，需要包含加入对特定文件中字符串进行翻译的工作。

本地化很重要，能够有效的降低 Kubernetes 的采纳和支持门槛。如果能用母语阅读 Kubernetes 文档，就能更轻松的开始使用 Kubernetes，并对其发展作出贡献。

## 如何启动本地化工作

不同语言的本地化工作都是单独的功能——和其它 Kubernetes 功能一致，贡献者们在一个 SIG 中进行本地化工作，分享出来进行评审，并加入项目。

贡献者们在团队中进行内容的本地化工作。因为自己不能批准自己的 PR，所以一个本地化团队至少应该有两个人——例如意大利文的本地化团队有两个人。这个团队规模可能很大：中文团队有几十个成员。

每个团队都有自己的工作流。有些团队手工完成所有的内容翻译；有些会使用带有翻译插件的编译器，并使用评审机来提供正确性的保障。SIG Docs 专注于输出的标准；这就给了本地化团队采用适合自己工作情况的工作流。这样一来，团队可以根据最佳实践进行协作，并以 Kubernetes 的社区精神进行分享。

## 为本地化工作添砖加瓦

如果你有兴趣为 Kubernetes 文档加入新语种的本地化内容，[Kubernetes contribution guide](https://kubernetes.io/docs/contribute/localization/) 中包含了这方面的相关内容。

已经启动的的本地化工作同样需要支持。如果有兴趣为现存项目做出贡献，可以加入本地化团队的 Slack 频道，去做个自我介绍。各团队的成员会帮助你开始工作。

|语种|Slack 频道|
|---|---|
|中文|[#kubernetes-docs-zh](https://kubernetes.slack.com/messages/CE3LNFYJ1/)|
|英文|[#sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/)|
|法文|[#kubernetes-docs-fr](https://kubernetes.slack.com/messages/CG838BFT9/)|
|德文|[#kubernetes-docs-de](https://kubernetes.slack.com/messages/CH4UJ2BAL/)|
|印地|[#kubernetes-docs-hi](https://kubernetes.slack.com/messages/CJ14B9BDJ/)|
|印度尼西亚文|[#kubernetes-docs-id](https://kubernetes.slack.com/messages/CJ1LUCUHM/)|
|意大利文|[#kubernetes-docs-it](https://kubernetes.slack.com/messages/CGB1MCK7X/)|
|日文|[#kubernetes-docs-ja](https://kubernetes.slack.com/messages/CAG2M83S8/)|
|韩文|[#kubernetes-docs-ko](https://kubernetes.slack.com/messages/CA1MMR86S/)|
|葡萄牙文|[#kubernetes-docs-pt](https://kubernetes.slack.com/messages/CJ21AS0NA/)|
|西班牙文|[#kubernetes-docs-es](https://kubernetes.slack.com/messages/CH7GB2E3B/)|

## 下一步？

最新的[印地文本地化](https://kubernetes.slack.com/messages/CJ14B9BDJ/)工作正在启动。为什么不加入你的语言？

身为 SIG Docs 的主席，我甚至希望本地化工作跳出文档范畴，直接为 Kubernetes 组件提供本地化支持。有什么组件是你希望支持不同语言的么？可以提交一个 [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps) 来促成这一进步。