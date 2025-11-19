---
layout: blog
title: Docsy 帶來更好的 Docs UX
date: 2020-06-15
slug: better-docs-ux-with-docsy
url: /zh-cn/blog/2020/06/better-docs-ux-with-docsy
---

<!--
layout: blog
title: A Better Docs UX With Docsy
date: 2020-06-15
slug: better-docs-ux-with-docsy
url: /blog/2020/06/better-docs-ux-with-docsy
-->

<!--
**Author:** Zach Corleissen, Cloud Native Computing Foundation
-->
**作者：** Zach Corleissen，Cloud Native Computing Foundation

<!--
*Editor's note: Zach is one of the chairs for the Kubernetes documentation special interest group (SIG Docs).*
-->
**編者注：Zach 是 Kubernetes 文檔特別興趣小組（SIG Docs）的主席之一。**

<!--
I'm pleased to announce that the [Kubernetes website](https://kubernetes.io) now features the [Docsy Hugo theme](https://docsy.dev).
-->
我很高興地宣佈 [Kubernetes 網站](https://kubernetes.io)現在採用了 [Docsy Hugo 主題](https://docsy.dev)。

<!--
The Docsy theme improves the site's organization and navigability, and opens a path to improved API references. 
After over 4 years with few meaningful UX improvements, Docsy implements some best practices for technical content. 
The theme makes the Kubernetes site easier to read and makes individual pages easier to navigate. 
It gives the site a much-needed facelift.
-->
Docsy 主題改進了網站的組織結構和導航性能，並開闢了改進 API 參考的途徑。
在 4 年多的時間裏，儘管對用戶體驗方面的改進不多，但 Docsy 針對技術內容實現了一些最佳實踐。
該主題使 Kubernetes 網站更易於閱讀，並使各個頁面更易於導航。
它大大改進了網站所需的外在形象。

<!--
For example: adding a right-hand rail for navigating topics on the page. No more scrolling up to navigate!
-->
例如：添加用於在頁面上導航主題的右側欄。無需再向上滾動導航！

<!--
The theme opens a path for future improvements to the website. 
The Docsy functionality I'm most excited about is the theme's [`swaggerui` shortcode](https://www.docsy.dev/docs/adding-content/shortcodes/#swaggerui), 
which provides native support for generating API references from an OpenAPI spec.
The CNCF is partnering with [Google Season of Docs](https://developers.google.com/season-of-docs) (GSoD) for staffing to make better API references a reality in Q4 this year.
We're hopeful to be chosen, and we're looking forward to Google's list of announced projects on August 16th.
Better API references have been a personal goal since I first started working with SIG Docs in 2017. 
It's exciting to see the goal within reach. 
-->
該主題爲網站的未來改進開闢了道路。
我最興奮的 Docsy 功能是主題的 [`swaggerui` shortcode](https://www.docsy.dev/docs/adding-content/shortcodes/#swaggerui)，
它爲從 OpenAPI 規範生成 API 引用提供了本地支持。
CNCF 正在與 [Google Season of Docs](https://developers.google.com/season-of-docs)（GSoD）合作，希望在今年第四季度實現更好的 API 參考。
我們很有希望被選中，我們期待着谷歌在 8 月 16 日公佈的項目清單。
自從我 2017 年第一次開始使用 SIG Docs 以來，更好的 API 參考一直是我的個人目標。
看到這個目標觸手可及，真是令人興奮。

<!--
One of SIG Docs' tech leads, [Karen Bradshaw](https://github.com/kbhawkey) did a lot of heavy lifting to fix a wide range of site compatibility issues, 
including a fix to the last of our [legacy pieces](https://github.com/kubernetes/website/pull/21359) when we [migrated from Jekyll to Hugo](2018-05-05-hugo-migration/) in 2018.
Our other tech leads, [Tim Bannister](https://github.com/sftim) and [Taylor Dolezal](https://github.com/onlydole) provided extensive reviews.
-->
作爲 SIG Docs 的技術負責人之一，[Karen Bradshaw](https://github.com/kbhawkey) 做了很多繁重的工作來解決廣泛的網站兼容性問題，
包括在 2018 年我們從 [Jekyll 遷移到 Hugo](2018-05-05-hugo-migration/) 時修復的最後一個[遺留問題](https://github.com/kubernetes/website/pull/21359)。
我們的其他技術負責人，[Tim Bannister](https://github.com/sftim) 和 [Taylor Dolezal](https://github.com/onlydole) 提出過很多意見。

<!--
Thanks also to [Björn-Erik Pedersen](https://bep.is/), who provided invaluable advice about how to navigate a Hugo upgrade beyond [version 0.60.0](https://gohugo.io/news/0.60.0-relnotes/).
-->
還要感謝 [Björn-Erik Pedersen](https://bep.is/)，他提供了關於如何在 [0.60.0 版本](https://gohugo.io/news/0.60.0-relnotes/)之後進行 Hugo 升級的寶貴建議。

<!--
The CNCF contracted with [Gearbox](https://gearboxbuilt.com/) in Victoria, BC to apply the theme to the site.
Thanks to Aidan, Troy, and the rest of the team for all their work!
-->
CNCF 與不列顛哥倫比亞省維多利亞市的 [Gearbox](https://gearboxbuilt.com/) 簽約，將主題應用於該網站。
感謝 Aidan、Troy 和團隊其他成員的所有工作！
