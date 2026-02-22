---
layout: blog
title: Docsy 带来更好的 Docs UX
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
**编者注：Zach 是 Kubernetes 文档特别兴趣小组（SIG Docs）的主席之一。**

<!--
I'm pleased to announce that the [Kubernetes website](https://kubernetes.io) now features the [Docsy Hugo theme](https://docsy.dev).
-->
我很高兴地宣布 [Kubernetes 网站](https://kubernetes.io)现在采用了 [Docsy Hugo 主题](https://docsy.dev)。

<!--
The Docsy theme improves the site's organization and navigability, and opens a path to improved API references. 
After over 4 years with few meaningful UX improvements, Docsy implements some best practices for technical content. 
The theme makes the Kubernetes site easier to read and makes individual pages easier to navigate. 
It gives the site a much-needed facelift.
-->
Docsy 主题改进了网站的组织结构和导航性能，并开辟了改进 API 参考的途径。
在 4 年多的时间里，尽管对用户体验方面的改进不多，但 Docsy 针对技术内容实现了一些最佳实践。
该主题使 Kubernetes 网站更易于阅读，并使各个页面更易于导航。
它大大改进了网站所需的外在形象。

<!--
For example: adding a right-hand rail for navigating topics on the page. No more scrolling up to navigate!
-->
例如：添加用于在页面上导航主题的右侧栏。无需再向上滚动导航！

<!--
The theme opens a path for future improvements to the website. 
The Docsy functionality I'm most excited about is the theme's [`swaggerui` shortcode](https://www.docsy.dev/docs/adding-content/shortcodes/#swaggerui), 
which provides native support for generating API references from an OpenAPI spec.
The CNCF is partnering with [Google Season of Docs](https://developers.google.com/season-of-docs) (GSoD) for staffing to make better API references a reality in Q4 this year.
We're hopeful to be chosen, and we're looking forward to Google's list of announced projects on August 16th.
Better API references have been a personal goal since I first started working with SIG Docs in 2017. 
It's exciting to see the goal within reach. 
-->
该主题为网站的未来改进开辟了道路。
我最兴奋的 Docsy 功能是主题的 [`swaggerui` shortcode](https://www.docsy.dev/docs/adding-content/shortcodes/#swaggerui)，
它为从 OpenAPI 规范生成 API 引用提供了本地支持。
CNCF 正在与 [Google Season of Docs](https://developers.google.com/season-of-docs)（GSoD）合作，希望在今年第四季度实现更好的 API 参考。
我们很有希望被选中，我们期待着谷歌在 8 月 16 日公布的项目清单。
自从我 2017 年第一次开始使用 SIG Docs 以来，更好的 API 参考一直是我的个人目标。
看到这个目标触手可及，真是令人兴奋。

<!--
One of SIG Docs' tech leads, [Karen Bradshaw](https://github.com/kbhawkey) did a lot of heavy lifting to fix a wide range of site compatibility issues, 
including a fix to the last of our [legacy pieces](https://github.com/kubernetes/website/pull/21359) when we [migrated from Jekyll to Hugo](2018-05-05-hugo-migration/) in 2018.
Our other tech leads, [Tim Bannister](https://github.com/sftim) and [Taylor Dolezal](https://github.com/onlydole) provided extensive reviews.
-->
作为 SIG Docs 的技术负责人之一，[Karen Bradshaw](https://github.com/kbhawkey) 做了很多繁重的工作来解决广泛的网站兼容性问题，
包括在 2018 年我们从 [Jekyll 迁移到 Hugo](2018-05-05-hugo-migration/) 时修复的最后一个[遗留问题](https://github.com/kubernetes/website/pull/21359)。
我们的其他技术负责人，[Tim Bannister](https://github.com/sftim) 和 [Taylor Dolezal](https://github.com/onlydole) 提出过很多意见。

<!--
Thanks also to [Björn-Erik Pedersen](https://bep.is/), who provided invaluable advice about how to navigate a Hugo upgrade beyond [version 0.60.0](https://gohugo.io/news/0.60.0-relnotes/).
-->
还要感谢 [Björn-Erik Pedersen](https://bep.is/)，他提供了关于如何在 [0.60.0 版本](https://gohugo.io/news/0.60.0-relnotes/)之后进行 Hugo 升级的宝贵建议。

<!--
The CNCF contracted with [Gearbox](https://gearboxbuilt.com/) in Victoria, BC to apply the theme to the site.
Thanks to Aidan, Troy, and the rest of the team for all their work!
-->
CNCF 与不列颠哥伦比亚省维多利亚市的 [Gearbox](https://gearboxbuilt.com/) 签约，将主题应用于该网站。
感谢 Aidan、Troy 和团队其他成员的所有工作！
