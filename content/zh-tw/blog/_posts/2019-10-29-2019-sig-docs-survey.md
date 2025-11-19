---
layout: blog
title: "Kubernetes 文檔最終用戶調研"
date: 2019-10-29
slug: kubernetes-documentation-end-user-survey
---
<!--
---
layout: blog
title: "Kubernetes Documentation Survey"
date: 2019-10-29
slug: kubernetes-documentation-end-user-survey
---
-->

**Author:** [Aimee Ukasick](https://www.linkedin.com/in/aimee-ukasick/) and SIG Docs

<!--
In September, SIG Docs conducted its first survey about the [Kubernetes
documentation](https://kubernetes.io/docs/). We'd like to thank the CNCF's Kim
McMahon for helping us create the survey and access the results.
-->
9月，SIG Docs 進行了第一次關於 [Kubernetes 文檔](https://kubernetes.io/docs/)的用戶調研。我們要感謝 CNCF
的 Kim McMahon 幫助我們創建調查並獲取結果。

<!--
# Key takeaways
-->
# 主要收穫

<!--
Respondents would like more example code, more detailed content, and more
diagrams in the Concepts, Tasks, and Reference sections.
-->
受訪者希望能在概念、任務和參考部分得到更多示例代碼、更詳細的內容和更多圖表。

<!--
74% of respondents would like the Tutorials section to contain advanced content.
-->
74% 的受訪者希望教程部分包含高級內容。

<!--
69.70% said the Kubernetes documentation is the first place they look for
information about Kubernetes.
-->
69.70% 的受訪者認爲 Kubernetes 文檔是他們首要尋找關於 Kubernetes 資料的地方。

<!--
# Survey methodology and respondents
-->
# 調查方法和受訪者

<!--
We conducted the survey in English. The survey was only available for 4 days due
to time constraints. We announced the survey on Kubernetes mailing lists, in
Kubernetes Slack channels, on Twitter, and in Kube Weekly. There were 23
questions, and respondents took an average of 4 minutes to complete the survey.
-->
我們用英語進行了調查。由於時間限制，調查的有效期只有 4 天。
我們在 Kubernetes 郵件列表、Kubernetes Slack 頻道、Twitter、Kube Weekly 上發佈了我們的調查問卷。
這份調查有 23 個問題， 受訪者平均用 4 分鐘完成這個調查。

<!--
## Quick facts about respondents:
-->
## 關於受訪者的簡要情況

<!--
- 48.48% are experienced Kubernetes users, 26.26% expert, and 25.25% beginner
- 57.58% use Kubernetes in both administrator and developer roles
- 64.65% have been using the Kubernetes documentation for more than 12 months
- 95.96% read the documentation in English
-->
- 48.48% 是經驗豐富的 Kubernetes 用戶，26.26% 是專家，25.25% 是初學者
- 57.58% 的人同時使用 Kubernetes 作爲管理員和開發人員
- 64.65% 的人使用 Kubernetes 文檔超過 12 個月
- 95.96% 的人閱讀英文文檔

<!--
# Question and response highlights
-->
# 問題和回答要點

<!--
## Why people access the Kubernetes documentation
-->
## 人們爲什麼訪問 Kubernetes 文檔

<!--
The majority of respondents stated that they access the documentation for the Concepts.

{{< figure
    src="/images/blog/2019-sig-docs-survey/Q9-k8s-docs-use.png"
    alt="Why respondents access the Kubernetes documentation"
>}}
-->
大多數受訪者表示，他們訪問文檔是爲了瞭解概念。

{{< figure
    src="/images/blog/2019-sig-docs-survey/Q9-k8s-docs-use.png"
    alt="受訪者爲什麼訪問 Kubernetes 文檔"
>}}

<!--
This deviates only slightly from what we see in Google Analytics: of the top 10
most viewed pages this year, #1 is the kubectl cheatsheet in the Reference section,
followed overwhelmingly by pages in the Concepts section.
-->
這與我們在 Google Analytics 上看到的略有不同：在今年瀏覽量最多的10個頁面中，第一是在參考部分的 kubectl
的備忘單，其次是概念部分的頁面。

<!--
## Satisfaction with the documentation
-->
## 對文檔的滿意程度

<!--
We asked respondents to record their level of satisfaction with the detail in
the Concepts, Tasks, Reference, and Tutorials sections:
-->
我們要求受訪者從概念、任務、參考和教程部分記錄他們對細節的滿意度：

<!--
- Concepts: 47.96% Moderately Satisfied
- Tasks: 50.54% Moderately Satisfied
- Reference: 40.86% Very Satisfied
- Tutorial: 47.25% Moderately Satisfied
-->
- 概念：47.96% 中等滿意
- 任務：50.54% 中等滿意
- 參考：40.86% 非常滿意
- 教程：47.25% 中等滿意

<!--
## How SIG Docs can improve each documentation section
-->
## SIG Docs 如何改進文檔的各個部分

<!--
We asked how we could improve each section, providing respondents with
selectable answers as well as a text field. The clear majority would like more
example code, more detailed content, more diagrams, and advanced tutorials:
-->
我們詢問如何改進每個部分，爲受訪者提供可選答案以及文本輸入框。絕大多數人想要更多
示例代碼、更詳細的內容、更多圖表和更高級的教程：

<!--
```text
- Personally, would like to see more analogies to help further understanding.
- Would be great if corresponding sections of code were explained too
- Expand on the concepts to bring them together - they're a bucket of separate eels moving in different directions right now
- More diagrams, and more example code
```
-->
```text
- 就個人而言，希望看到更多的類比，以幫助進一步理解。
- 如果代碼的相應部分也能解釋一下就好了
- 通過擴展概念把它們融合在一起 - 它們現在宛如在一桶水內朝各個方向遊動的一條條鰻魚。
- 更多的圖表，更多的示例代碼
```

<!--
Respondents used the "Other" text box to record areas causing frustration:
-->
受訪者使用“其他”文本框記錄引發阻礙的區域：

<!--
```text
- Keep concepts up to date and accurate
- Keep task topics up to date and accurate. Human testing.
- Overhaul the examples. Many times the output of commands shown is not actual.
- I've never understood how to navigate or interpret the reference section
- Keep the tutorials up to date, or remove them
```
-->
```text
- 使概念保持最新和準確
- 保持任務主題的最新性和準確性。親身試驗。
- 徹底檢查示例。很多時候顯示的命令輸出不是實際情況。
- 我從來都不知道如何導航或解釋參考部分
- 使教程保持最新，或將其刪除
```

<!--
## How SIG Docs can improve the documentation overall
-->
## SIG Docs 如何全面改進文檔

<!--
We asked respondents how we can improve the Kubernetes documentation
overall. Some took the opportunity to tell us we are doing a good job:
-->
我們詢問受訪者如何從整體上改進 Kubernetes 文檔。一些人抓住這次機會告訴我們我們正在做一個很棒的
工作：

<!--
```text
- For me, it is the best documented open source project.
- Keep going!
- I find the documentation to be excellent.
- You [are] doing a great job. For real.
```
-->
```text
- 對我而言，這是我見過的文檔最好的開源項目。
- 繼續努力！
- 我覺得文檔很好。
- 你們做得真好。真的。
```

<!--
Other respondents provided feedback on the content:
-->
其它受訪者提供關於內容的反饋：

<!--
```text
-  ...But since we're talking about docs, more is always better. More
advanced configuration examples would be, to me, the way to go. Like a Use Case page for each configuration topic with beginner to advanced example scenarios. Something like that would be
awesome....
-->
<!--
- More in-depth examples and use cases would be great. I often feel that the Kubernetes documentation scratches the surface of a topic, which might be great for new users, but it leaves more experienced users without much "official" guidance on how to implement certain things.
-->
<!--
- More production like examples in the resource sections (notably secrets) or links to production like examples
-->
<!--
- It would be great to see a very clear "Quick Start" A->Z up and running like many other tech projects. There are a handful of almost-quick-starts, but no single guidance. The result is information overkill.
```
-->

```text
-  ...但既然我們談論的是文檔，多多益善。更多的高級配置示例對我來說將是最好的選擇。比如每個配置主題的用例頁面，
從初學者到高級示例場景。像這樣的東西真的是令人驚歎......
- 更深入的例子和用例將是很好的。我經常感覺 Kubernetes 文檔只是觸及了一個主題的表面，這可能對新用戶很好，
但是它沒有讓更有經驗的用戶獲取多少關於如何實現某些東西的“官方”指導。
- 資源節（特別是 secrets）希望有更多類似於產品的示例或指向類似產品的示例的鏈接
- 如果能像很多其它技術項目那樣有非常清晰的“快速啓動” 逐步教學完成搭建就更好了。現有的快速入門內容屈指可數，
也沒有統一的指南。結果是信息氾濫。
```

<!--
A few respondents provided technical suggestions:

```text
- Make table columns sortable and filterable using a ReactJS or Angular component.
-->
<!--
- For most, I think creating documentation with Hugo - a system for static site generation - is not appropriate. There are better systems for documenting large software project. 
-->
<!--
Specifically, I would like to see k8s switch to Sphinx for documentation. It has an excellent built-in search, it is easy tolearn if you know markdown, it is widely adopted by other projects (e.g. every software project in readthedocs.io, linux kernel, docs.python.org etc).
```
-->

少數受訪者提供的技術建議：
```text
- 使用 ReactJS 或者 Angular component 使表的列可排序和可篩選。
- 對於大多數人來說，我認爲用 Hugo - 一個靜態站點生成系統 - 創建文檔是不合適的。有更好的系統來記錄大型軟件項目。
具體來說，我希望看到 k8s 切換到 Sphinx 來獲取文檔。Sphinx 有一個很好的內置搜索。如果你瞭解 markdown，學習起來也很容易。
Sphinx 被其他項目廣泛採用（例如，在 readthedocs.io、linux kernel、docs.python.org 等等）。
```

<!--
Overall, respondents provided constructive criticism focusing on the need for
advanced use cases as well as more in-depth examples, guides, and walkthroughs.
-->
總體而言，受訪者提供了建設性的批評，其關注點是高級用例以及更深入的示例、指南和演練。

<!--
# Where to see more
-->
# 哪裏可以看到更多

<!--
Survey results summary, charts, and raw data are available in `kubernetes/community` sig-docs [survey](https://github.com/kubernetes/community/tree/master/sig-docs/survey) directory.
-->
調查結果摘要、圖表和原始數據可在 `kubernetes/community` sig-docs 
[survey](https://github.com/kubernetes/community/tree/master/sig-docs/survey) 
目錄下。
