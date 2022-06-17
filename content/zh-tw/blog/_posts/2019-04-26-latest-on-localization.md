---
layout: blog
title: '如何參與 Kubernetes 文件的本地化工作'
date: 2019-04-26
---

**作者: Zach Corleissen（Linux 基金會）**

去年我們對 Kubernetes 網站進行了最佳化，加入了[多語言內容的支援](https://kubernetes.io/blog/2018/11/08/kubernetes-docs-updates-international-edition/)。貢獻者們踴躍響應，加入了多種新的本地化內容：截至 2019 年 4 月，Kubernetes 文件有了 9 個不同語言的未完成版本，其中有 6 個是 2019 年加入的。在每個 Kubernetes 文件頁面的上方，讀者都可以看到一個語言選擇器，其中列出了所有可用語言。

不論是完成度最高的[中文版 v1.12](https://v1-12.docs.kubernetes.io/zh-cn/)，還是最新加入的[葡萄牙文版 v1.14](https://kubernetes.io/pt/)，各語言的本地化內容還未完成，這是一個進行中的專案。如果讀者有興趣對現有本地化工作提供支援，請繼續閱讀。

## 什麼是本地化

翻譯是以詞表意的問題。而本地化在此基礎之上，還包含了過程和設計方面的工作。

本地化和翻譯很像，但是包含更多內容。除了進行翻譯之外，本地化還要為編寫和釋出過程的框架進行最佳化。例如，Kubernetes.io 多數的站點瀏覽功能（按鈕文字）都儲存在[單獨的檔案](https://github.com/kubernetes/website/tree/master/i18n)之中。所以啟動新本地化的過程中，需要包含加入對特定檔案中字串進行翻譯的工作。

本地化很重要，能夠有效的降低 Kubernetes 的採納和支援門檻。如果能用母語閱讀 Kubernetes 文件，就能更輕鬆的開始使用 Kubernetes，並對其發展作出貢獻。

## 如何啟動本地化工作

不同語言的本地化工作都是單獨的功能——和其它 Kubernetes 功能一致，貢獻者們在一個 SIG 中進行本地化工作，分享出來進行評審，並加入專案。

貢獻者們在團隊中進行內容的本地化工作。因為自己不能批准自己的 PR，所以一個本地化團隊至少應該有兩個人——例如義大利文的本地化團隊有兩個人。這個團隊規模可能很大：中文團隊有幾十個成員。

每個團隊都有自己的工作流。有些團隊手工完成所有的內容翻譯；有些會使用帶有翻譯外掛的編譯器，並使用評審機來提供正確性的保障。SIG Docs 專注於輸出的標準；這就給了本地化團隊採用適合自己工作情況的工作流。這樣一來，團隊可以根據最佳實踐進行協作，並以 Kubernetes 的社群精神進行分享。

## 為本地化工作添磚加瓦

如果你有興趣為 Kubernetes 文件加入新語種的本地化內容，[Kubernetes contribution guide](https://kubernetes.io/docs/contribute/localization/) 中包含了這方面的相關內容。

已經啟動的的本地化工作同樣需要支援。如果有興趣為現存專案做出貢獻，可以加入本地化團隊的 Slack 頻道，去做個自我介紹。各團隊的成員會幫助你開始工作。

|語種|Slack 頻道|
|---|---|
|中文|[#kubernetes-docs-zh](https://kubernetes.slack.com/messages/CE3LNFYJ1/)|
|英文|[#sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/)|
|法文|[#kubernetes-docs-fr](https://kubernetes.slack.com/messages/CG838BFT9/)|
|德文|[#kubernetes-docs-de](https://kubernetes.slack.com/messages/CH4UJ2BAL/)|
|印地|[#kubernetes-docs-hi](https://kubernetes.slack.com/messages/CJ14B9BDJ/)|
|印度尼西亞文|[#kubernetes-docs-id](https://kubernetes.slack.com/messages/CJ1LUCUHM/)|
|義大利文|[#kubernetes-docs-it](https://kubernetes.slack.com/messages/CGB1MCK7X/)|
|日文|[#kubernetes-docs-ja](https://kubernetes.slack.com/messages/CAG2M83S8/)|
|韓文|[#kubernetes-docs-ko](https://kubernetes.slack.com/messages/CA1MMR86S/)|
|葡萄牙文|[#kubernetes-docs-pt](https://kubernetes.slack.com/messages/CJ21AS0NA/)|
|西班牙文|[#kubernetes-docs-es](https://kubernetes.slack.com/messages/CH7GB2E3B/)|

## 下一步？

最新的[印地文字地化](https://kubernetes.slack.com/messages/CJ14B9BDJ/)工作正在啟動。為什麼不加入你的語言？

身為 SIG Docs 的主席，我甚至希望本地化工作跳出文件範疇，直接為 Kubernetes 元件提供本地化支援。有什麼元件是你希望支援不同語言的麼？可以提交一個 [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps) 來促成這一進步。