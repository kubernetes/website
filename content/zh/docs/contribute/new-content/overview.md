---
title: 贡献新内容概述
linktitle: 概述
content_type: concept
main_menu: true
weight: 5
---
<!--
title: Contributing new content overview
linktitle: Overview
content_type: concept
main_menu: true
weight: 5
-->

<!-- overview -->
<!--
This section contains information you should know before contributing new content.
-->
本节包含贡献新内容之前你需要知晓的一些信息。

<!-- body -->

<!--
## Contributing basics

- Write Kubernetes documentation in Markdown and build the Kubernetes site using [Hugo](https://gohugo.io/).
- The source is in [GitHub](https://github.com/kubernetes/website). You can find Kubernetes documentation at `/content/en/docs/`. Some of the reference documentation is automatically generated from scripts in the `update-imported-docs/` directory.
- [Page content types](/docs/contribute/style/page-content-types/) describe the presentation of documentation content in Hugo.
- In addition to the standard Hugo shortcodes, we use a number of [custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/) in our documentation to control the presentation of content.
- Documentation source is available in multiple languages in `/content/`. Each language has its own folder with a two-letter code determined by the [ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php). For example, English documentation source is stored in `/content/en/docs/`.
- For more information about contributing to documentation in multiple languages or starting a new translation, see [localization](/docs/contribute/localization).
-->
## 基本知识

- 使用 Markdown 来编写 Kubernetes 文档并使用 [Hugo](https://gohugo.io/) 来构建网站
- 源代码位于 [GitHub](https://github.com/kubernetes/website) 仓库中。
  你可以在 `/content/en/docs/` 目录下找到 Kubernetes 文档。
  某些参考文档是使用位于 `update-imported-docs/` 目录下的脚本自动生成的。
- [页面内容类型](/zh/docs/contribute/style/page-content-types/)使用 Hugo 描述文档内容的表现。
- 除了基本的 Hugo 短代码（shortcodes）外，我们还在文档中使用一些
  [定制的 Hugo 短代码](/zh/docs/contribute/style/hugo-shortcodes/)以控制内容的表现。
- 文档的源代码有多种语言形式，位于`/content/` 目录下。
  每种语言都有自己的由两个字母代表的目录，这两个字母是基于
  [ISO 639-1 标准](https://www.loc.gov/standards/iso639-2/php/code_list.php)来确定的。
  例如，英语文档源码位于`/content/en/docs/` 目录下。
- 关于在多种语言中为文档做贡献的详细信息，以及如何启动一种新的语言翻译，
  可参考[本地化](/zh/docs/contribute/localization)文档。

<!--
## Before you begin {#before-you-begin}
### Sign the CNCF CLA {#sign-the-cla}

All Kubernetes contributors **must** read the [Contributor guide](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) and [sign the Contributor License Agreement (CLA)](https://github.com/kubernetes/community/blob/master/CLA.md).

Pull requests from contributors who haven't signed the CLA fail the automated tests. The name and email you provide must match those found in your `git config`, and your git name and email must match those used for the CNCF CLA.
-->
## 开始之前 {#before-you-begin}

### 签署 CNCF CLA {#sign-the-cla}

所有 Kubernetes 贡献者 **必须** 阅读
[贡献者指南](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md)
并[签署贡献者授权同意书（Contributor License Agreement，CLA）](https://github.com/kubernetes/community/blob/master/CLA.md)。

来自尚未签署 CLA 的贡献者的 PR 无法通过自动化服务的测试。
你所提供的姓名和邮件地址必须与 `git config` 中所找到的完全相同，
而且你的 git 用户名和邮件地址必须与用来签署 CNCF CLA 的一致。

<!--
### Choose which Git branch to use

When opening a pull request, you need to know in advance which branch to base your work on.

Scenario | Branch
:---------|:------------
Existing or new English language content for the current release | `main`
Content for a feature change release | The branch which corresponds to the major and minor version the feature change is in, using the pattern `dev-release-<version>`. For example, if a feature changes in the `{{< latest-version >}}` release, then add documentation changes to the ``dev-{{< release-branch >}}`` branch.
Content in other languages (localizations) | Use the localization's convention. See the [Localization branching strategy](/docs/contribute/localization/#branching-strategy) for more information.

If you're still not sure which branch to choose, ask in `#sig-docs` on Slack.
-->
### 选择要使用的分支

在发起拉取请求时，你需要预先知道要基于哪个分支来开展工作。

场景      | 分支
:---------|:------------
针对当前发行版本的，对现有英文内容的修改或新的英文内容 | `main`
针对功能特性变更的内容 | 功能特性所对应的版本所对应的分支，分支名字模式为 `dev-<version>`。例如，如果某功能特性在 `v{{< skew nextMinorVersion >}}` 版本发生变化，则对应的文档变化要添加到 ``dev-{{< skew nextMinorVersion >}}`` 分支。
其他语言的内容（本地化）| 基于本地化团队的约定。参见[本地化分支策略](/zh/docs/contribute/localization/#branching-strategy)了解更多信息。

如果你仍不能确定要选择哪个分支，请在 `#sig-docs` Slack 频道上提问。

<!--
If you already submitted your pull request and you know that the base branch
was wrong, you (and only you, the submitter) can change it.
-->
{{< note >}}
如果你已经提交了你的 PR，并且你发现所针对的分支选错了，你（且只能是你）可以重新选择分支。
{{< /note >}}

<!--
### Languages per PR
Limit pull requests to one language per PR. If you need to make an identical change to the same code sample in multiple languages, open a separate PR for each language.
-->
### 每个 PR 牵涉的语言

请限制每个 PR 仅涉及一种语言。
如果你需要对多种语言下的同一代码示例进行相同的修改，也请为每种语言发起一个独立的 PR。

<!--
## Tools for contributors
The [doc contributors tools](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools) directory in the `kubernetes/website` repository contains tools to help your contribution journey go more smoothly.
-->

## 为贡献者提供的工具

`kubernetes/website` 仓库的
[文档贡献者工具](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools)
目录中包含了一些工具，能够助你的贡献过程更为顺畅。

