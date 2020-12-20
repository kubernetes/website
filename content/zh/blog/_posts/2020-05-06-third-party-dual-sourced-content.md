---
title: "文件如何处理第三方和双重来源的内容"
date: 2020-05-06
slug: third-party-dual-sourced
url: /blog/2020/05/third-party-dual-sourced-content
---
<!--
title: "How Docs Handle Third Party and Dual Sourced Content"
date: 2020-05-06
slug: third-party-dual-sourced
url: /blog/2020/05/third-party-dual-sourced-content
-->

<!--
**Author:** Zach Corleissen, Cloud Native Computing Foundation

*Editor's note: Zach is one of the chairs for the Kubernetes documentation special interest group (SIG Docs).*
-->
**作者：** Zach Corleissen，云原生计算基金会

*编者注： Zach 是 Kubernetes 文档特别兴趣小组（SIG Docs）的主席之一。*

<!--
Late last summer, SIG Docs started a community conversation about third party content in Kubernetes docs. This conversation became a [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/pull/1327) (KEP) and, after five months for review and comment, SIG Architecture approved the KEP as a [content guide](/docs/contribute/style/content-guide/) for Kubernetes docs.
-->
去年夏末， SIG Docs 就 Kubernetes 文档中的第三方内容展开了一次社区会谈。这次讨论形成了 [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/pull/1327)(KEP)，经过五个月的审查和评议， SIG Architecture 批准了 KEP 作为 Kubernetes 文档的[内容指南](/docs/contribute/style/content-guide/)。

<!--
Here's how Kubernetes docs handle third party content now:
-->
这是现在 Kubernetes 文档怎样处理第三方内容的：

<!--
> Links to active content in the Kubernetes project (projects in the kubernetes and kubernetes-sigs GitHub orgs) are always allowed.
>
> Kubernetes requires some third party content to function. Examples include container runtimes (containerd, CRI-O, Docker), networking policy (CNI plugins), Ingress controllers, and logging.
>
> Docs can link to third party open source software (OSS) outside the Kubernetes project if it’s necessary for Kubernetes to function.
-->
> 总是允许链接到 Kubernetes 项目（kubernetes 和 kubernetes-sigs GitHub orgs 中的项目）中的活动内容。
>
> Kubernetes 需要一些第三方内容发挥作用。包括容器运行（容器、 CRI-O、 Docker），网络策略（CNI 插件），入口控制器和日志等示例。
>
> 如果对于 Kubernetes 正常运行是必要的话，文档可以链接到 Kubernetes 项目外的第三方开源软件（OSS）。

<!--
These common sense guidelines make sure that Kubernetes docs document Kubernetes.
-->
这些常识标准可确保 Kubernetes 文档符合 Kubernetes 要求。

<!--
## Keeping the docs focused
-->
## 保持文档聚焦

<!--
Our goal is for Kubernetes docs to be a trustworthy guide to Kubernetes features. To achieve this goal, SIG Docs is [tracking third party content](https://github.com/kubernetes/website/issues/20232) and removing any third party content that isn't both in the Kubernetes project _and_ required for Kubernetes to function.
-->
我们的目标是让 Kubernetes 文档成为 Kubernetes 功能的可靠指南。为了实现此目标，SIG Docs 正在[跟踪第三方内容](https://github.com/kubernetes/website/issues/20232)，并且删除既不在 Kubernetes 项目中又不是 Kubernetes 运行所需的第三方内容。

<!--
### Re-homing content
-->
### 重新定位内容

<!--
Some content will be removed that readers may find helpful. To make sure readers have continous access to information, we're giving stakeholders until the [1.19 release deadline for docs](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.19), **July 9th, 2020** to re-home any content slated for removal.
-->
某些读者认为有帮助的内容将被删除。为了确保读者可以持续访问这些信息，我们将向相关者保持开放直至[1.19文档发布截止日期](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.19)。**2020年7月9日**会将原定要删除的所有内容重新存放。

<!--
Over the next few months you'll see less third party content in the docs as contributors open PRs to remove content.
-->
在接下来的几个月中，随着贡献者打开 PR 删除内容，您将在文档中看到更少的第三方内容。

<!--
## Background

Over time, SIG Docs observed increasing vendor content in the docs. Some content took the form of vendor-specific implementations that aren't required for Kubernetes to function in-project. Other content was thinly-disguised advertising with minimal to no feature content. Some vendor content was new; other content had been in the docs for years. It became clear that the docs needed clear, well-bounded guidelines for what kind of third party content is and isn't allowed. The [content guide](https://kubernetes.io/docs/contribute/content-guide/) emerged from an extensive period for review and comment from the community.
-->
## 背景

随着时间的推移， SIG Docs 发现文档中供应商的内容正在增加。一些内容采用了特定于供应商的形式，而 Kubernetes 在项目中运行并不需要。另一些是伪装的广告，内容很少甚至没有。一些供应商的内容是新的，另一些内容已经存在于文档中多年。显然，文档需要清晰、明确的准则，以指示允许和不允许的第三方内容类型。 [内容指南](https://kubernetes.io/docs/contribute/content-guide/)已经在社区中评议和评论了很长时间。

<!--
Docs work best when they're accurate, helpful, trustworthy, and remain focused on features. In our experience, vendor content dilutes trust and accuracy. 
-->
当文档准确、有用、值得信赖且始终专注于功能时，它们才能发挥最好的作用。根据我们的经验，供应商的内容会削弱信任度和准确性。

<!--
Put simply: feature docs aren't a place for vendors to advertise their products. Our content policy keeps the docs focused on helping developers and cluster admins, not on marketing.
-->
简而言之：功能文档不是供应商宣传其产品的地方。我们的内容政策使文档始终专注于帮助开发人员和集群管理员，而不是市场营销。

<!--
## Dual sourced content
-->
## 双重来源的内容

<!--
Less impactful but also important is how Kubernetes docs handle _dual-sourced content_. Dual-sourced content is content published in more than one location, or from a non-canonical source.
-->
Kubernetes 文档如何处理_dual-sourced content_虽然影响较小但同样重要。双源内容是在多处或从非规范来源发布的内容。

<!--
From the [Kubernetes content guide](https://kubernetes.io/docs/contribute/style/content-guide/#dual-sourced-content):
-->
从 [Kubernetes 内容指南](https://kubernetes.io/docs/contribute/style/content-guide/#dual-sourced-content)：

<!--
> Wherever possible, Kubernetes docs link to canonical sources instead of hosting dual-sourced content.
-->
>Kubernetes 文档将尽可能链接到规范的资源，而不是托管双重来源的内容。

<!--
Minimizing dual-sourced content streamlines the docs and makes content across the Web more searchable. We're working to consolidate and redirect dual-sourced content in the Kubernetes docs as well.
-->
最小化双重来源的内容可简化文档，并使 Web 上的内容更易于搜索。我们也在努力在 Kubernetes 文档中整合和重定向双重来源的内容。

<!--
## Ways to contribute
-->
## 贡献的方式

<!--
We're tracking third-party content in an [issue in the Kubernetes website repository](https://github.com/kubernetes/website/issues/20232). If you see third party content that's out of project and isn't required for Kubernetes to function, please comment on the tracking issue. 
-->
我们正在 [issue in the Kubernetes website repository](https://github.com/kubernetes/website/issues/20232) 跟踪第三方内容。如果您看到第三方内容超出项目范围并且不是 Kubernetes 正常运行所必需的，请对跟踪问题发表评论。

<!--
Feel free to open a PR that removes non-conforming content once you've identified it!
-->
识别出不合格内容后，即可随意打开PR！

<!--
## Want to know more?
-->
## 想了解更多？

<!--
For more information, read the issue description for [tracking third party content](https://github.com/kubernetes/website/issues/20232). 
-->
更多信息，请阅读问题描述[tracking third party content](https://github.com/kubernetes/website/issues/20232)。
