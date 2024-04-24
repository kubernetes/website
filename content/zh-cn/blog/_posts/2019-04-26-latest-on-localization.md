---
layout: blog
title: '如何参与 Kubernetes 文档的本地化工作'
date: 2019-04-26
slug: how-you-can-help-localize-kubernetes-docs
---
<!-- 
layout: blog
title: 'How You Can Help Localize Kubernetes Docs'
date: 2019-04-26
-->

<!-- 
**Author: Zach Corleissen (Linux Foundation)**

Last year we optimized the Kubernetes website for [hosting multilingual content](/blog/2018/11/08/kubernetes-docs-updates-international-edition/). Contributors responded by adding multiple new localizations: as of April 2019, Kubernetes docs are partially available in nine different languages, with six added in 2019 alone. You can see a list of available languages in the language selector at the top of each page.

By _partially available_, I mean that localizations are ongoing projects. They range from mostly complete ([Chinese docs for 1.12](https://v1-12.docs.kubernetes.io/zh/)) to brand new (1.14 docs in [Portuguese](https://kubernetes.io/pt/)). If you're interested in helping an existing localization, read on!
-->
**作者: Zach Corleissen（Linux 基金会）**

去年我们对 Kubernetes 网站进行了优化，加入了[多语言内容的支持](https://kubernetes.io/blog/2018/11/08/kubernetes-docs-updates-international-edition/)。贡献者们踊跃响应，加入了多种新的本地化内容：截至 2019 年 4 月，Kubernetes 文档有了 9 个不同语言的未完成版本，其中有 6 个是 2019 年加入的。在每个 Kubernetes 文档页面的上方，读者都可以看到一个语言选择器，其中列出了所有可用语言。

不论是完成度最高的[中文版 v1.12](https://v1-12.docs.kubernetes.io/zh-cn/)，还是最新加入的[葡萄牙文版 v1.14](https://kubernetes.io/pt/)，各语言的本地化内容还未完成，这是一个进行中的项目。如果读者有兴趣对现有本地化工作提供支持，请继续阅读。

<!-- 
## What is a localization?

Translation is about words and meaning. Localization is about words, meaning, process, and design.

A localization is like a translation, but more thorough. Instead of just translating words, a localization optimizes the framework for writing and publishing words. For example, most site navigation features (button text) on kubernetes.io are strings contained in a [single file](https://github.com/kubernetes/website/tree/master/i18n). Part of creating a new localization involves adding a language-specific version of that file and translating the strings it contains.

Localization matters because it reduces barriers to adoption and support. When we can read Kubernetes docs in our own language, it's easier to get started using Kubernetes and contributing to its development.
-->
## 什么是本地化

翻译是以词表意的问题。而本地化在此基础之上，还包含了过程和设计方面的工作。

本地化和翻译很像，但是包含更多内容。除了进行翻译之外，本地化还要为编写和发布过程的框架进行优化。例如，Kubernetes.io 多数的站点浏览功能（按钮文字）都保存在[单独的文件](https://github.com/kubernetes/website/tree/master/i18n)之中。所以启动新本地化的过程中，需要包含加入对特定文件中字符串进行翻译的工作。

本地化很重要，能够有效的降低 Kubernetes 的采纳和支持门槛。如果能用母语阅读 Kubernetes 文档，就能更轻松的开始使用 Kubernetes，并对其发展作出贡献。

<!-- 
## How do localizations happen?

The availability of docs in different languages is a feature&mdash;and like all Kubernetes features, contributors develop localized docs in a SIG, share them for review, and add them to the project. 

Contributors work in teams to localize content. Because folks can't approve their own PRs, localization teams have a minimum size of two&mdash;for example, the Italian localization has two contributors. Teams can also be quite large: the Chinese team has several dozen contributors. 

Each team has its own workflow. Some teams localize all content manually; others use editors with translation plugins and review machine output for accuracy. SIG Docs focuses on standards of output; this leaves teams free to adopt the workflow that works best for them. That said, teams frequently collaborate with each other on best practices, and sharing abounds in the best spirit of the Kubernetes community.
-->
## 如何启动本地化工作

不同语言的本地化工作都是单独的功能——和其它 Kubernetes 功能一致，贡献者们在一个 SIG 中进行本地化工作，分享出来进行评审，并加入项目。

贡献者们在团队中进行内容的本地化工作。因为自己不能批准自己的 PR，所以一个本地化团队至少应该有两个人——例如意大利文的本地化团队有两个人。这个团队规模可能很大：中文团队有几十个成员。

每个团队都有自己的工作流。有些团队手工完成所有的内容翻译；有些会使用带有翻译插件的编译器，并使用评审机来提供正确性的保障。SIG Docs 专注于输出的标准；这就给了本地化团队采用适合自己工作情况的工作流。这样一来，团队可以根据最佳实践进行协作，并以 Kubernetes 的社区精神进行分享。

<!-- 
## Helping with localizations

If you're interested in starting a new localization for Kubernetes docs, the [Kubernetes contribution guide](https://kubernetes.io/docs/contribute/localization/) shows you how.

Existing localizations also need help. If you'd like to contribute to an existing project, join the localization team's Slack channel and introduce yourself. Folks on that team can help you get started. 

Localization | Slack channel
---|---
Chinese (中文) | [#kubernetes-docs-zh](https://kubernetes.slack.com/messages/CE3LNFYJ1/)
English | [#sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/)
French (Français) | [#kubernetes-docs-fr](https://kubernetes.slack.com/messages/CG838BFT9/)
German (Deutsch) | [#kubernetes-docs-de](https://kubernetes.slack.com/messages/CH4UJ2BAL/)
Hindi | [#kubernetes-docs-hi](https://kubernetes.slack.com/messages/CJ14B9BDJ/)
Indonesian | [#kubernetes-docs-id](https://kubernetes.slack.com/messages/CJ1LUCUHM/)
Italian | [#kubernetes-docs-it](https://kubernetes.slack.com/messages/CGB1MCK7X/)
Japanese (日本語) | [#kubernetes-docs-ja](https://kubernetes.slack.com/messages/CAG2M83S8/)
Korean (한국어) | [#kubernetes-docs-ko](https://kubernetes.slack.com/messages/CA1MMR86S/)
Portuguese (Português) | [#kubernetes-docs-pt](https://kubernetes.slack.com/messages/CJ21AS0NA/)
Spanish (Español) | [#kubernetes-docs-es](https://kubernetes.slack.com/messages/CH7GB2E3B/)
-->
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


<!-- 
## What's next?

There's a new [Hindi localization](https://kubernetes.slack.com/messages/CJ14B9BDJ/) beginning. Why not add your language, too?

As a chair of SIG Docs, I'd love to see localization spread beyond the docs and into Kubernetes components. Is there a Kubernetes component you'd like to see supported in a different language? Consider making a [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps) to support the change.
-->
## 下一步？

最新的[印地文本地化](https://kubernetes.slack.com/messages/CJ14B9BDJ/)工作正在启动。为什么不加入你的语言？

身为 SIG Docs 的主席，我甚至希望本地化工作跳出文档范畴，直接为 Kubernetes 组件提供本地化支持。有什么组件是你希望支持不同语言的么？可以提交一个 [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps) 来促成这一进步。