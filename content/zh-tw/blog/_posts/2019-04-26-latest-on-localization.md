---
layout: blog
title: '如何參與 Kubernetes 文檔的本地化工作'
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
**作者: Zach Corleissen（Linux 基金會）**

去年我們對 Kubernetes 網站進行了優化，加入了[多語言內容的支持](https://kubernetes.io/blog/2018/11/08/kubernetes-docs-updates-international-edition/)。貢獻者們踊躍響應，加入了多種新的本地化內容：截至 2019 年 4 月，Kubernetes 文檔有了 9 個不同語言的未完成版本，其中有 6 個是 2019 年加入的。在每個 Kubernetes 文檔頁面的上方，讀者都可以看到一個語言選擇器，其中列出了所有可用語言。

不論是完成度最高的[中文版 v1.12](https://v1-12.docs.kubernetes.io/zh-cn/)，還是最新加入的[葡萄牙文版 v1.14](https://kubernetes.io/pt/)，各語言的本地化內容還未完成，這是一個進行中的項目。如果讀者有興趣對現有本地化工作提供支持，請繼續閱讀。

<!-- 
## What is a localization?

Translation is about words and meaning. Localization is about words, meaning, process, and design.

A localization is like a translation, but more thorough. Instead of just translating words, a localization optimizes the framework for writing and publishing words. For example, most site navigation features (button text) on kubernetes.io are strings contained in a [single file](https://github.com/kubernetes/website/tree/master/i18n). Part of creating a new localization involves adding a language-specific version of that file and translating the strings it contains.

Localization matters because it reduces barriers to adoption and support. When we can read Kubernetes docs in our own language, it's easier to get started using Kubernetes and contributing to its development.
-->
## 什麼是本地化

翻譯是以詞表意的問題。而本地化在此基礎之上，還包含了過程和設計方面的工作。

本地化和翻譯很像，但是包含更多內容。除了進行翻譯之外，本地化還要爲編寫和發佈過程的框架進行優化。例如，Kubernetes.io 多數的站點瀏覽功能（按鈕文字）都保存在[單獨的文件](https://github.com/kubernetes/website/tree/master/i18n)之中。所以啓動新本地化的過程中，需要包含加入對特定文件中字符串進行翻譯的工作。

本地化很重要，能夠有效的降低 Kubernetes 的採納和支持門檻。如果能用母語閱讀 Kubernetes 文檔，就能更輕鬆的開始使用 Kubernetes，並對其發展作出貢獻。

<!-- 
## How do localizations happen?

The availability of docs in different languages is a feature&mdash;and like all Kubernetes features, contributors develop localized docs in a SIG, share them for review, and add them to the project. 

Contributors work in teams to localize content. Because folks can't approve their own PRs, localization teams have a minimum size of two&mdash;for example, the Italian localization has two contributors. Teams can also be quite large: the Chinese team has several dozen contributors. 

Each team has its own workflow. Some teams localize all content manually; others use editors with translation plugins and review machine output for accuracy. SIG Docs focuses on standards of output; this leaves teams free to adopt the workflow that works best for them. That said, teams frequently collaborate with each other on best practices, and sharing abounds in the best spirit of the Kubernetes community.
-->
## 如何啓動本地化工作

不同語言的本地化工作都是單獨的功能——和其它 Kubernetes 功能一致，貢獻者們在一個 SIG 中進行本地化工作，分享出來進行評審，並加入項目。

貢獻者們在團隊中進行內容的本地化工作。因爲自己不能批准自己的 PR，所以一個本地化團隊至少應該有兩個人——例如意大利文的本地化團隊有兩個人。這個團隊規模可能很大：中文團隊有幾十個成員。

每個團隊都有自己的工作流。有些團隊手工完成所有的內容翻譯；有些會使用帶有翻譯插件的編譯器，並使用評審機來提供正確性的保障。SIG Docs 專注於輸出的標準；這就給了本地化團隊採用適合自己工作情況的工作流。這樣一來，團隊可以根據最佳實踐進行協作，並以 Kubernetes 的社區精神進行分享。

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
## 爲本地化工作添磚加瓦

如果你有興趣爲 Kubernetes 文檔加入新語種的本地化內容，[Kubernetes contribution guide](https://kubernetes.io/docs/contribute/localization/) 中包含了這方面的相關內容。

已經啓動的的本地化工作同樣需要支持。如果有興趣爲現存項目做出貢獻，可以加入本地化團隊的 Slack 頻道，去做個自我介紹。各團隊的成員會幫助你開始工作。

|語種|Slack 頻道|
|---|---|
|中文|[#kubernetes-docs-zh](https://kubernetes.slack.com/messages/CE3LNFYJ1/)|
|英文|[#sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/)|
|法文|[#kubernetes-docs-fr](https://kubernetes.slack.com/messages/CG838BFT9/)|
|德文|[#kubernetes-docs-de](https://kubernetes.slack.com/messages/CH4UJ2BAL/)|
|印地|[#kubernetes-docs-hi](https://kubernetes.slack.com/messages/CJ14B9BDJ/)|
|印度尼西亞文|[#kubernetes-docs-id](https://kubernetes.slack.com/messages/CJ1LUCUHM/)|
|意大利文|[#kubernetes-docs-it](https://kubernetes.slack.com/messages/CGB1MCK7X/)|
|日文|[#kubernetes-docs-ja](https://kubernetes.slack.com/messages/CAG2M83S8/)|
|韓文|[#kubernetes-docs-ko](https://kubernetes.slack.com/messages/CA1MMR86S/)|
|葡萄牙文|[#kubernetes-docs-pt](https://kubernetes.slack.com/messages/CJ21AS0NA/)|
|西班牙文|[#kubernetes-docs-es](https://kubernetes.slack.com/messages/CH7GB2E3B/)|


<!-- 
## What's next?

There's a new [Hindi localization](https://kubernetes.slack.com/messages/CJ14B9BDJ/) beginning. Why not add your language, too?

As a chair of SIG Docs, I'd love to see localization spread beyond the docs and into Kubernetes components. Is there a Kubernetes component you'd like to see supported in a different language? Consider making a [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps) to support the change.
-->
## 下一步？

最新的[印地文本地化](https://kubernetes.slack.com/messages/CJ14B9BDJ/)工作正在啓動。爲什麼不加入你的語言？

身爲 SIG Docs 的主席，我甚至希望本地化工作跳出文檔範疇，直接爲 Kubernetes 組件提供本地化支持。有什麼組件是你希望支持不同語言的麼？可以提交一個 [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps) 來促成這一進步。