---
title: 本地化 Kubernetes 文档
content_template: templates/concept
approvers:
- chenopis
- zacharysarah
- zparnold
---

<!--
---
title: Localizing Kubernetes Documentation
content_template: templates/concept
approvers:
- chenopis
- zacharysarah
- zparnold
---
-->

{{% capture overview %}}

<!--
Documentation for Kubernetes is available in multiple languages:
-->

Kubernetes 文档库有多种语言：

<!--
- English
- Chinese
- Japanese
- Korean
-->

- 英语
- 中文
- 日语
- 韩语

<!--
We encourage you to add new  [localizations](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)!
-->

我们鼓励你添加新的[本地化](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)！

{{% /capture %}}


{{% capture body %}}

<!--
## Getting started
-->

## 入门

<!--
Localizations must meet some requirements for workflow (*how* to localize) and output (*what* to localize).
-->

本地化必须满足工作流（*如何*本地化）和输出（本地化*内容*）的一些要求。

<!--
To add a new localization of the Kubernetes documentation, you'll need to update the website by modifying the  [site configuration](#modify-the-site-configuration) and [directory structure](#add-a-new-localization-directory). Then you can start [translating documents](#translating-documents)!
-->

要添加 Kubernetes 文档库的新的本地化，你需要修改[网站配置](#modify-the-site-configuration) 和[目录结构](#add-a-new-localization-directory)来更新网站。然后你就可以开始[翻译文档](#translating-documents)了！

{{< note >}}
<!--
For an example localization-related [pull request](../create-pull-request), see [this pull request](https://github.com/kubernetes/website/pull/8636) to the [Kubernetes website repo](https://github.com/kubernetes/website) adding Korean localization to the Kubernetes docs.
-->

本地化相关的[拉取请求](../create-pull-request) 示例，请参见向 Kubernetes 文档库 [Kubernetes website 仓库](https://github.com/kubernetes/website) 合入韩语本地化的[这个拉取请求](https://github.com/kubernetes/website/pull/8636)。
{{< /note >}}

<!--
Let Kubernetes SIG Docs know you're interested in creating a localization! Join the [SIG Docs Slack channel](https://kubernetes.slack.com/messages/C1J0BPD2M/). We're happy to help you get started and answer any questions you have.
-->

让 Kubernetes SIG Docs 知道你对创建本地化感兴趣！加入 [SIG Docs Slack channel](https://kubernetes.slack.com/messages/C1J0BPD2M/)。我们很乐意帮助你快速上手并回答你的任何问题。

<!--
All localization teams must be self-sustaining with their own resources. We're happy to host your work, but we can't translate it for you.
-->

所有本地化团队必须使用自身的资源独立工作。我们很高兴支持你的工作，但无法为你翻译。

<!--
### Fork and clone the repo
-->

### 克隆仓库并创建分支

<!--
First, [create your own fork](https://help.github.com/articles/fork-a-repo/) of the [kubernetes/website](https://github.com/kubernetes/website).
-->

首先，在 [kubernetes/website](https://github.com/kubernetes/website) 中[创建你自己的分支](https://help.github.com/articles/fork-a-repo/)。

<!--
Then, clone the website repo and `cd` into it:
-->

然后，克隆 website 仓库并通过 `cd` 命令进入 website 目录：

```shell
git clone https://github.com/kubernetes/website
cd website
```

{{< note >}}
<!--
Contributors to `k/website` must [create a fork](/docs/contribute/start/#improve-existing-content) from which to open pull requests. For localizations, we ask additionally that:
-->

`k/website` 的贡献者必须[创建一个分支](/docs/contribute/start/#improve-existing-content)，从创建拉取请求。对于本地化，我们还要求：

<!--
1. Team approvers open development branches directly from https://github.com/kubernetes/website.
2. Localization contributors work from forks, with branches based on the current development branch.
-->

1. 团队审批者直接从 https://github.com/kubernetes/website 新建开发分支。
2. 本地化贡献者创建分支进行工作，其分支基于当前的开发分支。

<!--
This is because localization projects are collaborative efforts on long-running branches, similar to the development branches for the Kubernetes release cycle. For information about localization pull requests, see ["branching strategy"](#branching-strategy).
-->

这是因为本地化项目是在长期进行的分支上的协同工作，类似于 Kubernetes 发布周期的开发分支。有关本地化拉取请求，请参见[“分支策略”](#branching-strategy)。
{{< /note >}}

<!--
### Find your two-letter language code
-->

### 找到两个字母的语言代码

<!--
Consult the [ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php) for your localization's two-letter country code. For example, the two-letter code for German is `de`.
-->

有关本地化的两个字母的国家代码，请参考 [ISO 639-1 标准](https://www.loc.gov/standards/iso639-2/php/code_list.php)。例如，德语的两个字母代码是 `de`。

{{< note >}}
<!--
These instructions use the [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) language code for German (`de`) as an example.
-->

这些说明遵循 [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) 语言代码标准，以德语(`de`)为例。

<!--
There's currently no Kubernetes localization for German, but you're welcome to create one!
-->

目前没有针对德语的 Kubernetes 本地化，但欢迎你创建一个！
{{< /note >}}

<!--
### Modify the site configuration
-->

### 修改网站配置

<!--
The Kubernetes website uses Hugo as its web framework. The website's Hugo configuration resides in the  [`config.toml`](https://github.com/kubernetes/website/tree/master/config.toml) file. To support a new localization, you'll need to modify `config.toml`.
-->

Kubernetes 网站使用 Hugo 作为其 web 框架。网站的 Hugo 配置位于 [`config.toml`](https://github.com/kubernetes/website/tree/master/config.toml) 文件中。要支持新的本地化，你需要修改 `config.toml`。

<!--
Add a configuration block for the new language to `config.toml`, under the existing `[languages]` block. The German block, for example, looks like:
-->

将新语言的配置块添加到 `config.toml` 中现有的 `[languages]` 块下。例如，德语块如下所示：

```toml
[languages.de]
title = "Kubernetes"
description = "Produktionsreife Container-Verwaltung"
languageName = "Deutsch"
contentDir = "content/de"
weight = 3
```

<!--
When assigning a `weight` parameter for your block, find the language block with the highest weight and add 1 to that value.
-->

为块分配 `weight` 参数时，请查找权重最大的语言块，并对该值加 1。

<!--
For more information about Hugo's multilingual support, see "[Multilingual Mode](https://gohugo.io/content-management/multilingual/)".
-->

有关 Hugo 多语言支持的更多信息，请参见 “[多语言模式](https://gohugo.io/content-management/multilingual/)”。

<!--
### Add a new localization directory
-->

### 创建新的本地化目录

<!--
Add a language-specific subdirectory to the [`content`](https://github.com/kubernetes/website/tree/master/content) folder in the repository. For example, the two-letter code for German is `de`:
-->

将特定语言的子目录添加到仓库中的 [`content`](https://github.com/kubernetes/website/tree/master/content) 目录中。例如，德语的两个字母代码是 `de`：

```shell
mkdir content/de
```

<!--
### Add a localized README
-->

### 添加本地化自述文件

<!--
To guide other localization contributors, add a new [`README-**.md`](https://help.github.com/articles/about-readmes/) to the top level of k/website, where `**` is the two-letter language code. For example, a German README file would be `README-de.md`.
-->

要指导其他本地化贡献者，请将新的 [`README-**.md`](https://help.github.com/articles/about-readmes/) 添加到 k/website 的顶层，其中 `**` 是两个字母的语言代码。例如，德语的自述文件是 `README-de.md`。

<!--
Provide guidance to localization contributors in the localized `README-**.md` file. Include the same information contained in `README.md` as well as:
-->

在本地化的 `README-**.md` 文件中为本地化贡献者提供指导。包括 `README.md` 中包含的相同信息以及：

<!--
- A point of contact for the localization project
- Any information specific to the localization
-->

- 本地化项目的联系人
- 任何特定于本地化的信息

<!--
After you create the localized README, add a link to the file from the main English file, [`README.md`'s Localizing Kubernetes Documentation] and include contact information in English. You can provide a GitHub ID, email address, [Slack channel](https://slack.com/), or other method of contact.
-->

创建本地化的自述文件后，请在主英文文件中添加指向该文件的链接，[`README.md`'s Localizing Kubernetes Documentation]，并以英文包含联系信息。你可以提供 GitHub ID、电子邮箱、[Slack channel](https://slack.com/) 或其他联系方式。

<!--
## Translating documents
-->

## 翻译文档

<!--
Localizing *all* of the Kubernetes documentation is an enormous task. It's okay to start small and expand over time.
-->

本地化*所有* Kubernetes 文档是一项艰巨的任务。从小做起，循序渐进。

<!--
At a minimum, all localizations must include:
-->

所有本地化至少必须包括：

<!--
Description | URLs
-----|-----
Home | [All heading and subheading URLs](/docs/home/)
Setup | [All heading and subheading URLs](/docs/setup/)
Tutorials | [Kubernetes Basics](/docs/tutorials/kubernetes-basics/), [Hello Minikube](/docs/tutorials/stateless-application/hello-minikube/)
Site strings | [All site strings in a new localized TOML file](https://github.com/kubernetes/website/tree/master/i18n)
-->

描述 | 网址
-----|-----
主页 | [所有标题和副标题网址](/docs/home/)
安装 | [所有标题和副标题网址](/docs/setup/)
教程 | [Kubernetes 基础](/docs/tutorials/kubernetes-basics/), [Hello Minikube](/docs/tutorials/stateless-application/hello-minikube/)
网站字符串 | [新的本地化 TOML 文件中的所有网站字符串](https://github.com/kubernetes/website/tree/master/i18n)

<!--
Translated documents must reside in their own `content/**/` subdirectory, but otherwise follow the same URL path as the English source. For example, to prepare the [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) tutorial for translation into German, create a subfolder under the `content/de/` folder and copy the English source:
-->

翻译后的文档必须保存在自己的 `content/**/` 子目录中，否则将遵循与英文源相同的 URL 路径。例如，要准备将 [Kubernetes 基础](/docs/tutorials/kubernetes-basics/) 教程翻译为德语，请在 `content/de/` 文件夹下创建一个子文件夹并复制英文源：

```shell
mkdir -p content/de/docs/tutorials
cp content/en/docs/tutorials/kubernetes-basics.md content/de/docs/tutorials/kubernetes-basics.md
```

<!--
For an example of a localization-related [pull request](../create-pull-request), [this pull request](https://github.com/kubernetes/website/pull/10471) to the [Kubernetes website repo](https://github.com/kubernetes/website) added Korean localization to the Kubernetes docs.
-->

本地化相关的[拉取请求](../create-pull-request) 示例，请参见向 Kubernetes 文档库 [Kubernetes website 仓库](https://github.com/kubernetes/website) 合入韩语本地化的[这个拉取请求](https://github.com/kubernetes/website/pull/10471)。

<!--
### Source Files
-->

### 源文件

<!--
Localizations must use English files from the most recent release as their source. The most recent version is **{{< latest-version >}}**.
-->

本地化必须使用最新版本的英文文件作为其源。最新版本是 **{{< latest-version >}}**。

<!--
To find source files for the most recent release:
-->

要查找最新版本的源文件，请执行以下操作：

<!--
1. Navigate to the Kubernetes website repository at https://github.com/kubernetes/website.
2. Select the `release-1.X` branch for the most recent version.
-->

1. 导航到 Kubernetes website 仓库，网址为 https://github.com/kubernetes/website。
2. 选择 `release-1.X` 分支作为最新版本。

<!--
The latest version is **{{< latest-version >}}**, so the most recent release branch is [`{{< release-branch >}}`](https://github.com/kubernetes/website/tree/{{< release-branch >}}).
-->

最新版本是 **{{< latest-version >}}**，所以最新的发布分支是 [`{{< release-branch >}}`](https://github.com/kubernetes/website/tree/{{< release-branch >}})。

<!--
### Site strings in i18n/
-->

### i18n 中的网站字符串/

<!--
Localizations must include the contents of [`i18n/en.toml`](https://github.com/kubernetes/website/blob/master/i18n/en.toml) in a new language-specific file. Using German as an example: `i18n/de.toml`.
-->

本地化必须在新的语言特定文件中包含 [`i18n/en.toml`](https://github.com/kubernetes/website/blob/master/i18n/en.toml) 的内容。以德语为例：`i18n/de.toml`。

<!--
Add a new localization file to `i18n/`. For example, with German (`de`):
-->

将新的本地化文件添加到 `i18n/`。例如德语 (`de`)：

```shell
cp i18n/en.toml i18n/de.toml
```

<!--
Then translate the value of each string:
-->

然后转换每个字符串的值：

```TOML
[docs_label_i_am]
other = "ICH BIN..."
```

<!--
Localizing site strings lets you customize site-wide text and features: for example, the legal copyright text in the footer on each page.
-->

本地化网站字符串允许你自定义网站范围的文本和特性：例如，每个页面页脚中的合法版权文本。

<!--
## Project logistics
-->

## 项目组织

<!--
### Contact the SIG Docs chairs
-->

### 联系 SIG Docs 主席

<!--
Contact one of the chairs of the Kubernetes [SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs#chairs) chairs when you start a new localization.
-->

开始新的本地化时，请联系 Kubernetes [SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs#chairs) 中的主席之一。

<!--
### Maintainers
-->

### 维护者

<!--
Each localization repository must provide its own maintainers. Maintainers can be from a single organization or multiple organizations. Whenever possible, localization pull requests should be approved by a reviewer from a different organization than the translator.
-->

每个本地化存储库必须提供自己的维护人员。维护人员可以来自单个组织或多个组织。只要可能，本地化的拉取请求应该由来自不同组织的评审者批准，而不是由翻译人员批准。

<!--
A localization must provide a minimum of two maintainers. (It's not possible to review and approve one's own work.)
-->

本地化必须至少提供两个维护人员。（不能评审和批准自己的工作。）

<!--
### Branching strategy
-->

### 分支策略

<!--
Because localization projects are highly collaborative efforts, we encourage teams to work from a shared development branch.
-->

因为本地化项目是高度协同的工作，所以我们鼓励团队基于共享的开发分支工作。

<!--
To collaborate on a development branch:
-->

在开发分支上协作：

<!--
1. A team member opens a development branch, usually by opening a new pull request against a source branch on https://github.com/kubernetes/website.
-->

1. 团队成员新建一个开发分支，通常通过在 https://github.com/kubernetes/website 上针对源分支新建一个拉取请求。

<!--
    We recommend the following branch naming scheme:
-->

    我们推荐以下分支命名方案：

    `dev-<source version>-<language code>.<team milestone>`

<!--
    For example, an approver on a German localization team opens the development branch `dev-1.12-de.1` directly against the k/website repository, based on the source branch for Kubernetes v1.12.
-->

    例如，一个德语本地化团队的审批者基于 Kubernetes v1.12 版本的源分支直接新建了 k/website 仓库的开发分支 `dev-1.12-de.1`。

<!--
2. Individual contributors open feature branches based on the development branch.
-->

2. 个人贡献者基于开发分支新建特性分支。

<!--
    For example, a German contributor opens a pull request with changes to `kubernetes:dev-1.12-de.1` from `username:local-branch-name`.
-->

    例如，一个德国贡献者新建了一个拉取请求，并从 `username:local-branch-name` 更改了 `kubernetes:dev-1.12-de.1`。

<!--
3. Approvers review and merge feature branches into the development branch.
-->

3. 审批者审批功能分支并将其合入到开发分支中。

<!--
4. Periodically, an approver merges the development branch to its source branch.
-->

4. 审批者定期将开发分支合并到其源分支。

<!--
Repeat steps 1-4 as needed until the localization is complete. For example, subsequent German development branches would be: `dev-1.12-de.2`, `dev-1.12-de.3`, etc.
-->

根据需要重复步骤 1-4，直到完成本地化工作。例如，随后的德语开发分支将是：`dev-1.12-de.2`、`dev-1.12-de.3`，等等。

<!--
Teams must merge localized content into the same release branch from which the content was sourced. For example, a development branch sourced from {{< release-branch >}} must be based on {{< release-branch >}}.
-->

团队必须将本地化内容合入到发布分支中，该发布分支也正是内容的来源。例如，源于 {{< release-branch >}} 的开发分支必须基于 {{< release-branch >}}。

<!--
An approver must maintain a development branch by keeping it current with its source branch and resolving merge conflicts. The longer a development branch stays open, the more maintenance it typically requires. Consider periodically merging development branches and opening new ones, rather than maintaining one extremely long-running development branch.
-->

审批者必须通过使开发分支与源分支保持最新并解决合并冲突来维护开发分支。开发分支的存在时间越长，通常需要的维护工作就越多。考虑定期合并开发分支并新建分支，而不是维护一个运行非常长的开发分支。

<!--
While only approvers can merge pull requests, anyone can open a pull request for a new development branch. No special permissions are required.
-->

虽然只有审批者可以合入拉取请求，但任何人都可以为新的开发分支新建拉取请求。不需要特殊权限。

<!--
For more information about working from forks or directly from the repository, see ["fork and clone the repo"](#fork-and-clone-the-repo).
-->

有关基于克隆或直接从仓库开展工作的更多信息，请参见 ["fork and clone the repo"](#fork-and-clone-the-repo)。

<!--
### Upstream contributions
-->

### 上游贡献

<!--
SIG Docs welcomes [upstream contributions and corrections](/docs/contribute/intermediate#localize-content) to the English source. 
-->

Sig Docs 欢迎[上游贡献和更正](/docs/contribute/intermediate#localize-content) 到英文源。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
Once a l10n meets requirements for workflow and minimum output, SIG docs will:
-->

一旦 l10n 满足工作流和最小输出的要求，SIG docs 将：

<!--
- Enable language selection on the website
- Publicize the localization's availability through [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) channels, including the [Kubernetes blog](https://kubernetes.io/blog/).
-->

- 在网站上启用语言选择
- 通过[云原生计算基金会](https://www.cncf.io/) (CNCF) 渠道，包括 [Kubernetes blog](https://kubernetes.io/blog/)，来宣传本地化的可用性。

{{% /capture %}}
