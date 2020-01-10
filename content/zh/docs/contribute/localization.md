---
title: 本地化 Kubernetes 文档
content_template: templates/concept
card:
  name: contribute
  weight: 30
  title: 翻译文档
---
<!-- 
---
title: Localizing Kubernetes Documentation
content_template: templates/concept
approvers:
- remyleone
- rlenferink
- zacharysarah
card:
  name: contribute
  weight: 30
  title: Translating the docs
--- 
-->

{{% capture overview %}}

<!-- 
This page shows you how to [localize](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/) the docs for a different language. 
-->
此页面显示了如何为其他语言的文档提供[本地化](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)。

{{% /capture %}}

{{% capture body %}}

<!-- 
## Getting started

Because contributors can't approve their own pull requests, you need at least two contributors to begin a localization. 

All localization teams must be self-sustaining with their own resources. We're happy to host your work, but we can't translate it for you. 
-->
## 入门

由于贡献者无法批准他们自己的请求，因此您至少需要两个贡献者才能开始本地化。

所有本地化团队必须使用自身的资源独立工作。我们很高兴支持你的工作，但无法为你翻译。

<!-- 
### Find your two-letter language code

First, consult the [ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php) to find your localization's two-letter country code. For example, the two-letter code for Korean is `ko`.

### Fork and clone the repo

First, [create your own fork](/docs/contribute/start/#improve-existing-content) of the [kubernetes/website](https://github.com/kubernetes/website) repository. 
-->
### 找到两个字母的语言代码

首先，有关本地化的两个字母的国家代码，请参考 [ISO 639-1 标准](https://www.loc.gov/standards/iso639-2/php/code_list.php)。例如，韩国的两个字母代码是 `ko`。

### fork 并且克隆仓库 {#fork-and-clone-the-repo}

首先，在 [kubernetes/website](https://github.com/kubernetes/website) 仓库中的 [fork 你自己的分支](/docs/contribute/start/#improve-existing-content)。

<!--
Then, clone your fork and `cd` into it:
-->
然后，克隆 website 仓库并通过 `cd` 命令进入 website 目录：

```shell
git clone https://github.com/<username>/website
cd website
```

<!-- 
### Open a pull request

Next, [open a pull request](https://kubernetes.io/docs/contribute/start/#submit-a-pull-request) (PR) to add a localization to the `kubernetes/website` repository. 

The PR must include all of the [minimum required content](#minimum-required-content) before it can be approved.

For an example of adding a new localization, see the PR to enable [docs in French](https://github.com/kubernetes/website/pull/12548). 
-->
### 发起 pr

接下来，[提交 PR 请求](https://kubernetes.io/docs/contribute/start/#submit-a-pull-request)，将本地化添加到 `kubernetes/website` 仓库。

PR 必须包含所有[最低要求的内容](#minimum-required-content)，然后才能被批准。

有关添加新本地化的示例，请参见添加[法语文档](https://github.com/kubernetes/website/pull/12548) 的 PR。
    
### Join the Kubernetes GitHub organization

<!-- 
Once you've opened a localization PR, you can become members of the Kubernetes GitHub organization. Each person on the team needs to create their own [Organization Membership Request](https://github.com/kubernetes/org/issues/new/choose) in the `kubernetes/org` repository. 
-->
提交本地化 PR 后，您可以成为 Kubernetes GitHub 组织的成员。团队中的每个人都需要在 `kubernetes/org` 仓库中创建自己的[组织成员资格申请](https://github.com/kubernetes/org/issues/new/choose)。

<!-- 
### Add your localization team in GitHub

Next, add your Kubernetes localization team to [`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml). For an example of adding a localization team, see the PR to add the [Spanish localization team](https://github.com/kubernetes/org/pull/685). 

Members of `sig-docs-**-owners` can approve PRs that change content within (and only within) your localization directory: `/content/**/`. 

The `sig-docs-**-reviews` team automates review assignment for new PRs. 
-->
### 在 GitHub 中添加您的本地化团队

接下来，将您的 Kubernetes 本地化团队添加到[`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml)。有关添加本地化团队的示例，请参见添加[西班牙本地化团队](https://github.com/kubernetes/org/pull/685) 的 PR。

`sig-docs-**-owners` 成员可以批准更改对应本地化目录 `/content/**/` 中内容的 PR，并仅限这类 PR。

`sig-docs-**-reviews` 团队自动分派新 PR 的审阅任务。

<!-- 
Members of `sig-docs-l10n-admins` can create new development branches to coordinate translation efforts.

Members of `website-milestone-maintainers` can use the `/milestone` [Prow command](https://prow.k8s.io/command-help) to assign a milestone to issues or PRs. 
-->
`sig-docs-l10n-admins` 成员可以创建新的开发分支来协调翻译工作。

`website-milestone-maintainers` 成员可以使用 `/milestone` [Prow 命令](https://prow.k8s.io/command-help) 为 issues 或 PR 设定里程碑。
    
<!-- 
### Configure the workflow

Next, add a GitHub label for your localization in the `kubernetes/test-infra` repository. A label lets you filter issues and pull requests for your specific language.

For an example of adding a label, see the PR for adding the [Italian language label](https://github.com/kubernetes/test-infra/pull/11316). 
-->
### 配置工作流程

接下来，在 `kubernetes/test-infra` 仓库中为您的本地化添加一个 GitHub 标签。标签可让您过滤 issues 并提出针对特定语言的 pr。

有关添加标签的示例，请参见添加[意大利语标签](https://github.com/kubernetes/test-infra/pull/11316)的 PR。

<!-- 
### Find community

Let Kubernetes SIG Docs know you're interested in creating a localization! Join the [SIG Docs Slack channel](https://kubernetes.slack.com/messages/C1J0BPD2M/). Other localization teams are happy to help you get started and answer any questions you have.

You can also create a Slack channel for your localization in the `kubernetes/community` repository. For an example of adding a Slack channel, see the PR for [adding channels for Indonesian and Portuguese](https://github.com/kubernetes/community/pull/3605).  
-->
### 寻找社区

让 Kubernetes SIG Docs 知道您对创建本地化感兴趣！ 加入[SIG Docs Slack 频道](https://kubernetes.slack.com/messages/C1J0BPD2M/)。其他本地化团队很乐意帮助您入门并回答您的任何问题。

您还可以在 `kubernetes/community` 存储库中为本地化创建一个 Slack 频道。有关添加 Slack 频道的示例，请参见[为印尼语和葡萄牙语添加频道](https://github.com/kubernetes/community/pull/3605)的 PR。

<!-- 
## Minimum required content

### Modify the site configuration

The Kubernetes website uses Hugo as its web framework. The website's Hugo configuration resides in the  [`config.toml`](https://github.com/kubernetes/website/tree/master/config.toml) file. To support a new localization, you'll need to modify `config.toml`.

Add a configuration block for the new language to `config.toml`, under the existing `[languages]` block. The German block, for example, looks like: 
-->
## 最低要求内容 {#minimum-required-content}

### 修改站点配置

Kubernetes 网站使用 Hugo 作为其 Web 框架。网站的 Hugo 配置位于[`config.toml`](https://github.com/kubernetes/website/tree/master/config.toml)文件中。为了支持新的本地化，您需要修改 `config.toml`。

在现有的 `[languages]` 下，将新语言的配置添加到 `config.toml` 中。例如，下面是德语的配置示例：

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

For more information about Hugo's multilingual support, see "[Multilingual Mode](https://gohugo.io/content-management/multilingual/)". 
-->
为您的块分配一个 `weight` 参数时，找到权重最高的语言块并将其加 1。

有关 Hugo 多语言支持的更多信息，请参阅"[多语言模式](https://gohugo.io/content-management/multilingual/)"。

<!-- 
### Add a new localization directory

Add a language-specific subdirectory to the [`content`](https://github.com/kubernetes/website/tree/master/content) folder in the repository. For example, the two-letter code for German is `de`: 
-->
### 添加一个新的本地化目录

将特定语言的子目录添加到仓库中的 [`content`](https://github.com/kubernetes/website/tree/master/content) 文件夹下。例如，德语的两个字母的代码是 `de`：

```shell
mkdir content/de
```

<!-- 
### Localize the Community Code of Conduct 

Open a PR against the [`cncf/foundation`](https://github.com/cncf/foundation/tree/master/code-of-conduct-languages) repository to add the code of conduct in your language.

### Add a localized README 
-->
### 本地化社区行为准则

针对 [`cncf/foundation`](https://github.com/cncf/foundation/tree/master/code-of-conduct-languages) 仓库提交 PR，添加您所用语言版本的行为准则。

### 添加本地化的 README 文件

<!-- 
To guide other localization contributors, add a new [`README-**.md`](https://help.github.com/articles/about-readmes/) to the top level of k/website, where `**` is the two-letter language code. For example, a German README file would be `README-de.md`.

Provide guidance to localization contributors in the localized `README-**.md` file. Include the same information contained in `README.md` as well as:

- A point of contact for the localization project
- Any information specific to the localization 
-->
为了指导其他本地化贡献者，请在 k/website 的根目录添加一个新的 [`README-**.md`](https://help.github.com/articles/about-readmes/)，其中 `**` 是两个字母的语言代码。例如，德语 README 文件为 `README-de.md`。

在本地化的 `README-**.md` 文件中为本地化贡献者提供指导。包含 `README.md` 中包含的相同信息，以及：

- 本地化项目的联系人
- 任何有关本地化的信息

<!-- 
After you create the localized README, add a link to the file from the main English `README.md`, and include contact information in English. You can provide a GitHub ID, email address, [Slack channel](https://slack.com/), or other method of contact. You must also provide a link to your localized Community Code of Conduct. 
-->
创建本地化的 README 文件后，请在英语版文件 `README.md` 中添加指向该文件的链接，并给出英文形式的联系信息。您可以提供 GitHub ID、电子邮件地址、[Slack 频道](https://slack.com/)或其他联系方式。您还必须提供指向本地化的社区行为准则的链接。

<!-- 
### Setting up the OWNERS files

To set the roles of each user contributing to the localization, create an `OWNERS` file inside the language-specific subdirectory with:

- **reviewers**: A list of kubernetes teams with reviewer roles, in this case, the `sig-docs-**-reviews` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **approvers**: A list of kubernetes teams with approvers roles, in this case, the `sig-docs-**-owners` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **labels**: A list of GitHub labels to automatically apply to a PR, in this case, the language label created in [Configure the workflow](#configure-the-workflow). 
-->
### 设置 OWNERS 文件

要设置每个对本地化做出贡献用户的角色，请在特定于语言的子目录内创建一个 `OWNERS` 文件，其中：

- **reviewers**: 具有 reviewer 角色的 kubernetes 团队的列表，在本例中为在[在 GitHub 中添加您的本地化团队](#add-your-localization-team-in-github) 中创建的 `sig-docs-**-reviews` 团队。
- **approvers**: 具有 approver 角色的 kubernetes 团队的列表，在本例中为在[在 GitHub 中添加您的本地化团队](#add-your-localization-team-in-github) 中创建的 `sig-docs-**-owners` 团队。
- **labels**: 可以自动应用于 PR 的 GitHub 标签列表，在本例中为[配置工作流程](#configure-the-workflow)中创建的语言标签。

<!-- 
More information about the `OWNERS` file can be found at [go.k8s.io/owners](https://go.k8s.io/owners).

The [Spanish OWNERS file](https://git.k8s.io/website/content/es/OWNERS), with language code `es`, looks like: 
-->
有关 `OWNERS` 文件的更多信息，请访问[go.k8s.io/owners](https://go.k8s.io/owners)。

带有语言代码 `es` 的[西班牙 OWNERS 文件](https://git.k8s.io/website/content/es/OWNERS)看起来像：

<!-- 
```yaml
# See the OWNERS docs at https://go.k8s.io/owners

# This is the localization project for Spanish.
# Teams and members are visible at https://github.com/orgs/kubernetes/teams.

reviewers:
- sig-docs-es-reviews

approvers:
- sig-docs-es-owners

labels:
- language/es
``` 
-->
```yaml
# 在 https://go.k8s.io/owners 地址查看 OWNERS 文档

# 这是西班牙语的本地化项目。
# 团队和成员位于 https://github.com/orgs/kubernetes/teams。

reviewers:
- sig-docs-es-reviews

approvers:
- sig-docs-es-owners

labels:
- language/es
```

<!-- 
After adding the language-specific `OWNERS` file, update the [root `OWNERS_ALIASES`](https://git.k8s.io/website/OWNERS_ALIASES) file with the new Kubernetes teams for the localization, `sig-docs-**-owners` and `sig-docs-**-reviews`.

For each team, add the list of GitHub users requested in [Add your localization team in GitHub](#add-your-localization-team-in-github), in alphabetical order. 
-->
添加了特定语言的 OWNERS 文件之后，使用新的 Kubernetes 团队更新 [根目录下的 OWNERS_ALIAES](https://git.k8s.io/website/OWNERS_ALIASES) 文件进行本地化，即 `sig-docs-**-owners` 和 `sig-docs-**-reviews`。

对于每个团队，请按字母顺序添加[在 GitHub 中添加您的本地化团队](#add-your-localization-team-in-github) 中请求的 GitHub 用户列表。

```diff
--- a/OWNERS_ALIASES
+++ b/OWNERS_ALIASES
@@ -48,6 +48,14 @@ aliases:
     - stewart-yu
     - xiangpengzhao
     - zhangxiaoyu-zidif
+  sig-docs-es-owners: # Admins for Spanish content
+    - alexbrand
+    - raelga
+  sig-docs-es-reviews: # PR reviews for Spanish content
+    - alexbrand
+    - electrocucaracha
+    - glo-pena
+    - raelga
   sig-docs-fr-owners: # Admins for French content
     - perriea
     - remyleone
```

<!-- 
## Translating content

Localizing *all* of the Kubernetes documentation is an enormous task. It's okay to start small and expand over time.

At a minimum, all localizations must include: 
-->
## 翻译文档

本地化*所有* Kubernetes 文档是一项艰巨的任务。从小做起，循序渐进。

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
Translation tools can speed up the translation process. For example, some editors offers plugins to quickly translate text.  
-->
翻译工具可以加快翻译过程。例如，某些编辑器提供了用于快速翻译文本的插件。

<!-- 
Machine-generated translation alone does not meet the minimum standard of quality and requires extensive human review to meet that standard.  
-->
{{< caution >}}
机器生成的翻译不能达到最低质量标准，需要进行大量人工审查才能达到该标准。
{{< /caution >}}

<!-- 
To ensure accuracy in grammar and meaning, members of your localization team should carefully review all machine-generated translations before publishing. 
-->
为了确保语法和含义的准确性，本地化团队的成员应在发布之前仔细检查所有由机器生成的翻译。

<!-- 
### Source files

Localizations must be based on the English files from the most recent release, {{< latest-version >}}.

To find source files for the most recent release:

1. Navigate to the Kubernetes website repository at https://github.com/kubernetes/website.
2. Select the `release-1.X` branch for the most recent version.

The latest version is {{< latest-version >}}, so the most recent release branch is [`{{< release-branch >}}`](https://github.com/kubernetes/website/tree/{{< release-branch >}}). 
-->
### 源文件

本地化必须基于最新版本 {{< latest-version >}} 中的英文文件。

要查找最新版本的源文件：

1. 导航到 Kubernetes website 仓库，网址为 https://github.com/kubernetes/website。
2. 选择最新版本的 `release-1.X` 分支。

最新版本是 {{< latest-version >}}，所以最新的发行分支是 [`{{< release-branch >}}`](https://github.com/kubernetes/website/tree/{{< release-branch >}})。

<!-- 
### Site strings in i18n/ 
-->
### i18n/ 中的网站字符串

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
然后翻译每个字符串的值：

```TOML
[docs_label_i_am]
other = "ICH BIN..."
```

<!-- 
Localizing site strings lets you customize site-wide text and features: for example, the legal copyright text in the footer on each page. 
-->
本地化网站字符串允许你自定义网站范围的文本和特性：例如，每个页面页脚中的合法版权文本。

<!-- 
### Language specific style guide and glossary

Some language teams have their own language-specific style guide and glossary. For example, see the [Korean Localization Guide](/ko/docs/contribute/localization_ko/). 
-->
### 特定语言的样式指南和词汇表

一些语言团队有自己的特定语言风格指南和词汇表。例如，请参见[韩语本地化指南](/ko/docs/contribute/localization_ko/)。

<!-- 
## Branching strategy 
-->
### 分支策略

<!-- 
Because localization projects are highly collaborative efforts, we encourage teams to work in shared development branches. 
-->
因为本地化项目是高度协同的工作，所以我们鼓励团队基于共享的开发分支工作。

<!-- 
To collaborate on a development branch: 
-->
在开发分支上协作：

<!-- 
1. A team member of [@kubernetes/sig-docs-l10n-admins](https://github.com/orgs/kubernetes/teams/sig-docs-l10n-admins) opens a development branch from a source branch on https://github.com/kubernetes/website.

    Your team approvers joined the `sig-docs-l10n-admins` team when you [added your localization team](#add-your-localization-team-in-github) to the `kubernetes/org` repository. 

    We recommend the following branch naming scheme:

    `dev-<source version>-<language code>.<team milestone>`

    For example, an approver on a German localization team opens the development branch `dev-1.12-de.1` directly against the k/website repository, based on the source branch for Kubernetes v1.12.
-->
1. [@kubernetes/sig-docs-l10n-admins](https://github.com/orgs/kubernetes/teams/sig-docs-l10n-admins) 中的团队成员从 https://github.com/kubernetes/website 原有分支新建一个开发分支。
    当您给 `kubernetes/org` 存储库[添加您的本地化团队](#add-your-localization-team-in-github)时，您的团队 approvers 便加入了 `sig-docs-l10n-admins`。

    我们推荐以下分支命名方案：

    `dev-<source version>-<language code>.<team milestone>`

    例如，一个德语本地化团队的 approvers 基于 Kubernetes v1.12 版本的源分支直接新建了 k/website 仓库的开发分支 `dev-1.12-de.1`。

<!-- 
2. Individual contributors open feature branches based on the development branch.

    For example, a German contributor opens a pull request with changes to `kubernetes:dev-1.12-de.1` from `username:local-branch-name`.

3. Approvers review and merge feature branches into the development branch.

4. Periodically, an approver merges the development branch to its source branch by opening and approving a new pull request. Be sure to squash the commits before approving the pull request. 
-->
2. 个人贡献者基于开发分支新建特性分支。

    例如，一个德国贡献者新建了一个拉取请求，并将 `username:local-branch-name` 更改为 `kubernetes:dev-1.12-de.1`。

3. Approvers 审查功能分支并将其合并到开发分支中。

4. approver 会定期打开并批准新的 pr，将开发分支合并到其源分支。在批准 pr 之前，请确保先 squash 提交。

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
approver 必须通过使开发分支与源分支保持最新并解决合并冲突来维护开发分支。开发分支的存在时间越长，通常需要的维护工作就越多。考虑定期合并开发分支并新建分支，而不是维护一个持续时间很长的开发分支。

<!-- 
At the beginning of every team milestone, it's helpful to open an issue comparing upstream changes between the previous development branch and the current development branch.  
-->
在每个团队里程碑的起点，打开一个 issue 来比较先前的开发分支和当前的开发分支之间的上游变化很有帮助。

 <!-- 
 While only approvers can open a new development branch and merge pull requests, anyone can open a pull request for a new development branch. No special permissions are required. 
 -->
 虽然只有 approver 才能开启新的开发分支并合并 pr，但任何人都可以为新的开发分支提交一个拉取请求（PR）。不需要特殊权限。

<!-- 
For more information about working from forks or directly from the repository, see ["fork and clone the repo"](#fork-and-clone-the-repo). 
-->
有关基于 fork 或直接从仓库开展工作的更多信息，请参见 ["fork 和克隆"](#fork-and-clone-the-repo)。

<!-- 
## Upstream contributions 
-->
### 上游贡献

<!-- 
SIG Docs welcomes [upstream contributions and corrections](/docs/contribute/intermediate#localize-content) to the English source.  
-->
Sig Docs 欢迎[上游贡献和修正](/docs/contribute/intermediate#localize-content) 到英文原文。

<!-- 
## Help an existing localization 
-->
## 帮助现有的本地化

<!-- 
You can also help add or improve content to an existing localization. Join the [Slack channel](https://kubernetes.slack.com/messages/C1J0BPD2M/) for the localization, and start opening PRs to help.
-->
您还可以向现有本地化添加或改进内容提供帮助。加入 [Slack 频道](https://kubernetes.slack.com/messages/C1J0BPD2M/)进行本地化，然后开始新建 PR 来提供帮助。

{{% /capture %}}

{{% capture whatsnext %}}

<!-- 
Once a localization meets requirements for workflow and minimum output, SIG docs will: 
-->
本地化满足工作流程和最低输出要求后，SIG 文档将：

<!-- 
- Enable language selection on the website
- Publicize the localization's availability through [Cloud Native Computing Foundation](https://www.cncf.io/about/) (CNCF) channels, including the [Kubernetes blog](https://kubernetes.io/blog/).
-->
- 在网站上启用语言选择
- 通过[Cloud Native Computing Foundation](https://www.cncf.io/about/) (CNCF) 频道, 包括[ Kubernetes 博客](https://kubernetes.io/blog/)公开本地化的可用性。

{{% /capture %}}
