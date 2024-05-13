---
title: 本地化 Kubernetes 文档
content_type: concept
weight: 50
card:
  name: contribute
  weight: 50
  title: 本地化文档
---
<!--
title: Localizing Kubernetes documentation
content_type: concept
approvers:
- remyleone
- rlenferink
weight: 50
card:
  name: contribute
  weight: 50
  title: Localizing the docs
-->

<!-- overview -->

<!--
This page shows you how to
[localize](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)
the docs for a different language.
-->
此页面描述如何为其他语言的文档提供
[本地化](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)版本。

<!-- body -->

<!--
## Contribute to an existing localization

You can help add or improve the content of an existing localization. In
[Kubernetes Slack](https://slack.k8s.io/), you can find a channel for each
localization. There is also a general
[SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations)
where you can say hello.
-->
## 为现有的本地化做出贡献 {#contribute-to-an-existing-localization}

你可以帮助添加或改进现有本地化的内容。在 [Kubernetes Slack](https://slack.k8s.io/) 中，
你能找到每个本地化的频道。还有一个通用的
[SIG Docs Localizations Slack 频道](https://kubernetes.slack.com/messages/sig-docs-localizations)，
你可以在这里打个招呼。

{{< note >}}
<!--
For extra details on how to contribute to a specific localization,
look for a localized version of this page.
-->
有关如何为特定本地化做贡献的更多信息，请参阅本页面的各个本地化版本。
{{< /note >}}

<!--
### Find your two-letter language code

First, consult the
[ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php)
to find your localization's two-letter language code. For example, the two-letter code for
Korean is `ko`.

Some languages use a lowercase version of the country code as defined by the
ISO-3166 along with their language codes. For example, the Brazilian Portuguese
language code is `pt-br`.
-->
### 找到两个字母的语言代码 {#find-your-two-letter-language-code}

首先，有关本地化的两个字母的语言代码，请参考
[ISO 639-1 标准](https://www.loc.gov/standards/iso639-2/php/code_list.php)。
例如，韩语的两个字母代码是 `ko`。

一些语言使用 ISO-3166 定义的国家代码的小写版本及其语言代码。
例如，巴西葡萄牙语代码是 `pt-br`。

<!--
### Fork and clone the repo

First, [create your own fork](/docs/contribute/new-content/open-a-pr/#fork-the-repo) of the
[kubernetes/website](https://github.com/kubernetes/website) repository.
-->
### 派生（fork）并且克隆仓库     {#fork-and-clone-the-repo}

首先，为 [kubernetes/website](https://github.com/kubernetes/website)
仓库[创建你自己的副本](/zh-cn/docs/contribute/new-content/open-a-pr/#fork-the-repo)。

<!--
Then, clone your fork and `cd` into it:
-->
然后，克隆你的 website 仓库副本并通过 `cd` 命令进入 website 目录：

```shell
git clone https://github.com/<username>/website
cd website
```

<!--
The website content directory includes subdirectories for each language. The
localization you want to help out with is inside `content/<two-letter-code>`.
-->
网站内容目录包括每种语言的子目录。你想要助力的本地化位于 `content/<two-letter-code>` 中。

<!--
### Suggest changes

Create or update your chosen localized page based on the English original. See
[localize content](#localize-content) for more details.

If you notice a technical inaccuracy or other problem with the upstream
(English) documentation, you should fix the upstream documentation first and
then repeat the equivalent fix by updating the localization you're working on.

Limit changes in a pull requests to a single localization. Reviewing pull
requests that change content in multiple localizations is problematic.

Follow [Suggesting Content Improvements](/docs/contribute/suggesting-improvements/)
to propose changes to that localization. The process is similar to proposing
changes to the upstream (English) content.
-->
### 建议更改 {#suggest-changes}

根据英文原件创建或更新你选择的本地化页面。
有关更多详细信息，请参阅[本地化内容](#localize-content)。

如果你发现上游（英文）文档存在技术错误或其他问题，
你应该先修复上游文档，然后通过更新你正在处理的本地化来重复等效的修复。

请将 PR 限制为单个语言版本，因为多语言的 PR 内容修改可能难以审查。

按照[内容改进建议](/zh-cn/docs/contribute/suggesting-improvements/)提出对该本地化的更改。
该过程与提议更改上游（英文）内容非常相似。

<!--
## Start a new localization

If you want the Kubernetes documentation localized into a new language, here's
what you need to do.

Because contributors can't approve their own pull requests, you need _at least
two contributors_ to begin a localization.

All localization teams must be self-sufficient. The Kubernetes website is happy
to host your work, but it's up to you to translate it and keep existing
localized content current.
-->
## 开始新的本地化 {#start-a-new-localization}

如果你希望将 Kubernetes 文档本地化为一种新语言，你需要执行以下操作。

因为贡献者不能批准他们自己的拉取请求，你需要**至少两个贡献者**来开始本地化。

所有本地化团队都必须能够自我维持。
Kubernetes 网站很乐意托管你的作品，但要由你来翻译它并使现有的本地化内容保持最新。

<!--
You'll need to know the two-letter language code for your language. Consult the
[ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php)
to find your localization's two-letter language code. For example, the
two-letter code for Korean is `ko`.

If the language you are starting a localization for is spoken in various places
with significant differences between the variants, it might make sense to
combine the lowercased ISO-3166 country code with the language two-letter code.
For example, Brazilian Portuguese is localized as `pt-br`.
-->
你需要知道你的语言的两个字母的语言代码。
请查阅 [ISO 639-1 标准](https://www.loc.gov/standards/iso639-2/php/code_list.php)
以查找你的本地化的两字母语言代码。例如，韩语的两字母代码是 `ko`。

如果你开始本地化的语言在不同地方使用，并且变体之间存在显着差异，
则将小写的 ISO-3166 国家/地区代码与语言双字母代码结合起来可能是有意义的。
例如，巴西葡萄牙语被本地化为 `pt-br`。

<!--
When you start a new localization, you must localize all the
[minimum required content](#minimum-required-content) before
the Kubernetes project can publish your changes to the live
website.

SIG Docs can help you work on a separate branch so that you
can incrementally work towards that goal.
-->
当你开始新的本地化时，你必须先本地化所有[最少要求的内容](#minimum-required-content)，
Kubernetes 项目才能将你的更改发布到当前网站。

SIG Docs 可以帮助你在单独的分支上工作，以便你可以逐步实现该目标。

<!--
### Find community

Let Kubernetes SIG Docs know you're interested in creating a localization! Join
the [SIG Docs Slack channel](https://kubernetes.slack.com/messages/sig-docs) and
the [SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations).
Other localization teams are happy to help you get started and answer your
questions.
-->
### 找到社区 {#find-community}

让 Kubernetes SIG Docs 知道你有兴趣创建本地化！
加入 [SIG Docs Slack 频道](https://kubernetes.slack.com/messages/sig-docs)
和 [SIG Docs Localizations Slack 频道](https://kubernetes.slack.com/messages/sig-docs-localizations)。
其他本地化团队很乐意帮助你入门并回答你的问题。

<!--
Please also consider participating in the
[SIG Docs Localization Subgroup meeting](https://github.com/kubernetes/community/tree/master/sig-docs).
The mission of the SIG Docs localization subgroup is to work across the SIG Docs
localization teams to collaborate on defining and documenting the processes for
creating localized contribution guides. In addition, the SIG Docs localization
subgroup looks for opportunities to create and share common tools across
localization teams and identify new requirements for the SIG Docs Leadership
team. If you have questions about this meeting, please inquire on the
[SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations).

You can also create a Slack channel for your localization in the
`kubernetes/community` repository. For an example of adding a Slack channel, see
the PR for [adding a channel for Persian](https://github.com/kubernetes/community/pull/4980).
-->
也请考虑参加
[SIG Docs 本地化小组的会议](https://github.com/kubernetes/community/tree/master/sig-docs)。
SIG Docs 本地化小组的任务是与 SIG Docs 本地化团队合作，
共同定义和记录创建本地化贡献指南的流程。
此外，SIG Docs 本地化小组将寻找机会在本地化团队中创建和共享通用工具，
并为 SIG Docs 领导团队确定新要求。如果你对本次会议有任何疑问，请在
[SIG Docs Localizations Slack 频道](https://kubernetes.slack.com/messages/sig-docs-localizations)中提问。

你还可以在 `kubernetes/community` 仓库中为你的本地化创建一个 Slack 频道。
有关添加 Slack 频道的示例，
请参阅[为波斯语添加频道](https://github.com/kubernetes/community/pull/4980)的 PR。

<!--
### Join the Kubernetes GitHub organization

When you've opened a localization PR, you can become members of the Kubernetes
GitHub organization. Each person on the team needs to create their own
[Organization Membership Request](https://github.com/kubernetes/org/issues/new/choose)
in the `kubernetes/org` repository.
-->
### 加入到 Kubernetes GitHub 组织 {#join-the-kubernetes-github-organization}

提交本地化 PR 后，你可以成为 Kubernetes GitHub 组织的成员。
团队中的每个人都需要在 `kubernetes/org`
仓库中创建自己的[组织成员申请](https://github.com/kubernetes/org/issues/new/choose)。

<!--
### Add your localization team in GitHub

Next, add your Kubernetes localization team to
[`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/main/config/kubernetes/sig-docs/teams.yaml).
For an example of adding a localization team, see the PR to add the
[Spanish localization team](https://github.com/kubernetes/org/pull/685).

Members of `@kubernetes/sig-docs-**-owners` can approve PRs that change content
within (and only within) your localization directory: `/content/**/`. For each
localization, The `@kubernetes/sig-docs-**-reviews` team automates review
assignments for new PRs. Members of `@kubernetes/website-maintainers` can create
new localization branches to coordinate translation efforts. Members of
`@kubernetes/website-milestone-maintainers` can use the `/milestone`
[Prow command](https://prow.k8s.io/command-help) to assign a milestone to issues or PRs.
-->
### 在 GitHub 中添加你的本地化团队 {#add-your-localization-team-in-github}

接下来，将你的 Kubernetes 本地化团队添加到
[`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/main/config/kubernetes/sig-docs/teams.yaml)。
有关添加本地化团队的示例，请参见添加[西班牙本地化团队](https://github.com/kubernetes/org/pull/685)的 PR。

`@kubernetes/sig-docs-**-owners` 成员可以批准更改对应本地化目录 `/content/**/` 中内容的 PR，并仅限这类 PR。
对于每个本地化，`@kubernetes/sig-docs-**-reviews` 团队被自动分派新 PR 的审阅任务。
`@kubernetes/website-maintainers` 成员可以创建新的本地化分支来协调翻译工作。
`@kubernetes/website-milestone-maintainers` 成员可以使用 `/milestone`
[Prow 命令](https://prow.k8s.io/command-help)为 Issue 或 PR 设定里程碑。

<!--
### Configure the workflow

Next, add a GitHub label for your localization in the `kubernetes/test-infra`
repository. A label lets you filter issues and pull requests for your specific
language.

For an example of adding a label, see the PR for adding the
[Italian language label](https://github.com/kubernetes/test-infra/pull/11316).
-->
### 配置工作流程 {#configure-the-workflow}

接下来，在 `kubernetes/test-infra` 仓库中为你的本地化添加一个 GitHub 标签。
标签可让你过滤 Issue 和针对特定语言的 PR。

有关添加标签的示例，请参见添加[意大利语标签](https://github.com/kubernetes/test-infra/pull/11316)的 PR。

<!--
### Modify the site configuration

The Kubernetes website uses Hugo as its web framework. The website's Hugo
configuration resides in the
[`hugo.toml`](https://github.com/kubernetes/website/tree/main/hugo.toml)
file. You'll need to modify `hugo.toml` to support a new localization.

Add a configuration block for the new language to `hugo.toml` under the
existing `[languages]` block. The German block, for example, looks like:
-->
### 修改站点配置 {#configure-the-workflow}

Kubernetes 网站使用 Hugo 作为其 Web 框架。网站的 Hugo 配置位于
[`hugo.toml`](https://github.com/kubernetes/website/tree/main/hugo.toml) 文件中。
为了支持新的本地化，你需要修改 `hugo.toml`。

在现有的 `[languages]` 下，将新语言的配置添加到 `hugo.toml` 中。
例如，下面是德语的配置示例：

```toml
[languages.de]
title = "Kubernetes"
description = "Produktionsreife Container-Verwaltung"
languageName = "Deutsch (German)"
languageNameLatinScript = "Deutsch"
contentDir = "content/de"
weight = 8
```

<!--
The language selection bar lists the value for `languageName`. Assign "language
name in native script and language (English language name in Latin script)" to
`languageName`. For example, `languageName = "한국어 (Korean)"` or `languageName =
"Deutsch (German)"`.

`languageNameLatinScript` can be used to access the language name in Latin
script and use it in the theme. Assign "language name in latin script" to
`languageNameLatinScript`. For example, `languageNameLatinScript ="Korean"` or
`languageNameLatinScript = "Deutsch"`.
-->
语言选择栏列出了 `languageName` 的值。
将 `languageName` 赋值为"本地脚本中的语言名称（拉丁脚本中的语言名称）"。
例如，`languageName = "한국어 (Korean)"` 或 `languageName = "Deutsch (German)"`。

`languageNameLatinScript` 可用于访问拉丁脚本中的语言名称并在主题中使用。
将 `languageNameLatinScript` 赋值为"拉丁脚本中的语言名称"。
例如，`languageNameLatinScript ="Korean"` 或 `languageNameLatinScript = "Deutsch"`。

<!--
The `weight` parameter determines the order of languages in the language selection bar.
A lower weight takes precedence, resulting in the language appearing first. 
When assigning the `weight` parameter, it is important to examine the existing languages 
block and adjust their weights to ensure they are in a sorted order relative to all languages,
including any newly added language.
-->
`weight` 参数决定语言选择栏中的语言顺序，
优先显示权重较低的语言。
分配 `weight` 参数时，检查现有语言块并调整其权重以确保它们相对于所有语言
（包括任何新添加的语言）按排序顺序非常重要。

<!--
For more information about Hugo's multilingual support, see
"[Multilingual Mode](https://gohugo.io/content-management/multilingual/)".
-->

有关 Hugo 多语言支持的更多信息，请参阅"[多语言模式](https://gohugo.io/content-management/multilingual/)"。

<!--
### Add a new localization directory

Add a language-specific subdirectory to the
[`content`](https://github.com/kubernetes/website/tree/main/content) folder in
the repository. For example, the two-letter code for German is `de`:
-->
### 添加一个新的本地化目录 {#add-a-new-localization-directory}

将特定语言的子目录添加到仓库中的
[`content`](https://github.com/kubernetes/website/tree/main/content) 文件夹下。
例如，德语的两个字母的代码是 `de`：

```shell
mkdir content/de
```

<!--
You also need to create a directory inside `data/i18n` for
[localized strings](#site-strings-in-i18n); look at existing localizations
for an example. To use these new strings, you must also create a symbolic link
from `i18n/<localization>.toml` to the actual string configuration in
`data/i18n/<localization>/<localization>.toml` (remember to commit the symbolic
link).

For example, for German the strings live in `data/i18n/de/de.toml`, and
`i18n/de.toml` is a symbolic link to `data/i18n/de/de.toml`.
-->
你还需要在 `data/i18n` 中为[本地化字符串](#site-strings-in-i18n)创建一个目录；
以现有的本地化为例。要使用这些新字符串，
你还必须创建从 `i18n/<localization>.toml`
到 `data/i18n/<localization>/<localization>.toml`
中实际字符串配置的符号链接（记得提交符号链接关联）。

例如，对于德语，字符串位于 `data/i18n/de/de.toml` 中，
而 `i18n/de.toml` 是指向 `data/i18n/de/de.toml` 的符号链接。

<!--
### Localize the community code of conduct

Open a PR against the
[`cncf/foundation`](https://github.com/cncf/foundation/tree/main/code-of-conduct-languages)
repository to add the code of conduct in your language.
-->
### 本地化社区行为准则 {#localize-the-community-code-of-conduct}

在 [`cncf/foundation`](https://github.com/cncf/foundation/tree/main/code-of-conduct-languages)
仓库提交 PR，添加你所用语言版本的行为准则。

<!--
### Set up the OWNERS files

To set the roles of each user contributing to the localization, create an
`OWNERS` file inside the language-specific subdirectory with:

- **reviewers**: A list of kubernetes teams with reviewer roles, in this case,
- the `sig-docs-**-reviews` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **approvers**: A list of kubernetes teams with approvers roles, in this case,
- the `sig-docs-**-owners` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **labels**: A list of GitHub labels to automatically apply to a PR, in this
  case, the language label created in [Configure the workflow](#configure-the-workflow).
-->
### 设置 OWNERS 文件 {#setting-up-the-owners-files}

要设置每个对本地化做出贡献用户的角色，请在特定于语言的子目录内创建一个 `OWNERS` 文件，其中：

- **reviewers**：具有评审人角色的 Kubernetes 团队的列表，
  在本例中为在[在 GitHub 中添加你的本地化团队](#add-your-localization-team-in-github)中创建的
  `sig-docs-**-reviews` 团队。
- **approvers**：具有批准人角色的 Kubernetes 团队的列表，
  在本例中为在[在 GitHub 中添加你的本地化团队](#add-your-localization-team-in-github)中创建的
  `sig-docs-**-owners` 团队。
- **labels**：可以自动应用于 PR 的 GitHub 标签列表，
  在本例中为[配置工作流程](#configure-the-workflow)中创建的语言标签。

<!--
More information about the `OWNERS` file can be found at
[go.k8s.io/owners](https://go.k8s.io/owners).

The [Spanish OWNERS file](https://git.k8s.io/website/content/es/OWNERS), with
language code `es`, looks like this:
-->
有关 `OWNERS` 文件的更多信息，请访问 [go.k8s.io/owners](https://go.k8s.io/owners)。

语言代码为 `es` 的[西班牙语 OWNERS 文件](https://git.k8s.io/website/content/es/OWNERS)看起来像：

<!--
# See the OWNERS docs at https://go.k8s.io/owners

# This is the localization project for Spanish.
# Teams and members are visible at https://github.com/orgs/kubernetes/teams.
-->
```yaml
# 参见 OWNERS 文档，位于 https://go.k8s.io/owners

# 这是西班牙语的本地化项目
# 各团队和成员名单位于 https://github.com/orgs/kubernetes/teams

reviewers:
- sig-docs-es-reviews

approvers:
- sig-docs-es-owners

labels:
- language/es
```

<!--
After adding the language-specific `OWNERS` file, update the [root
`OWNERS_ALIASES`](https://git.k8s.io/website/OWNERS_ALIASES) file with the new
Kubernetes teams for the localization, `sig-docs-**-owners` and
`sig-docs-**-reviews`.

For each team, add the list of GitHub users requested in
[Add your localization team in GitHub](#add-your-localization-team-in-github),
in alphabetical order.
-->
添加了特定语言的 OWNERS 文件之后，使用新的 Kubernetes 本地化团队、
`sig-docs-**-owners` 和 `sig-docs-**-reviews`
列表更新[根目录下的 OWNERS_ALIAES](https://git.k8s.io/website/OWNERS_ALIASES) 文件。

对于每个团队，
请按字母顺序添加[在 GitHub 中添加你的本地化团队](#add-your-localization-team-in-github)中所请求的
GitHub 用户列表。

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
### Open a pull request

Next, [open a pull request](/docs/contribute/new-content/open-a-pr/#open-a-pr)
(PR) to add a localization to the `kubernetes/website` repository. The PR must
include all the [minimum required content](#minimum-required-content) before it
can be approved.

For an example of adding a new localization, see the PR to enable
[docs in French](https://github.com/kubernetes/website/pull/12548).
-->
### 发起拉取请求  {#open-a-pull-request}

接下来，[发起拉取请求](/zh-cn/docs/contribute/new-content/open-a-pr/#open-a-pr)（PR）
将本地化添加到 `kubernetes/website` 存储库。
PR 必须包含所有[最低要求内容](#minimum-required-content)才能获得批准。

有关添加新本地化的示例，
请参阅启用[法语文档](https://github.com/kubernetes/website/pull/12548)的 PR。

<!--
### Add a localized README file

To guide other localization contributors, add a new
[`README-**.md`](https://help.github.com/articles/about-readmes/) to the top
level of [kubernetes/website](https://github.com/kubernetes/website/), where
`**` is the two-letter language code. For example, a German README file would be
`README-de.md`.

Guide localization contributors in the localized `README-**.md` file.
Include the same information contained in `README.md` as well as:

- A point of contact for the localization project
- Any information specific to the localization
-->
### 添加本地化的 README 文件 {#add-a-localized-readme-file}

为了指导其他本地化贡献者，请在 [kubernetes/website](https://github.com/kubernetes/website/)
的根目录添加一个新的 [`README-**.md`](https://help.github.com/articles/about-readmes/)，
其中 `**` 是两个字母的语言代码。例如，德语 README 文件为 `README-de.md`。

在本地化的 `README-**.md` 文件中为本地化贡献者提供指导。包含 `README.md` 中包含的相同信息，以及：

- 本地化项目的联系人
- 任何特定于本地化的信息

<!--
After you create the localized README, add a link to the file from the main
English `README.md`, and include contact information in English. You can provide
a GitHub ID, email address, [Slack channel](https://slack.com/), or another
method of contact. You must also provide a link to your localized Community Code
of Conduct.
-->
创建本地化的 README 文件后，请在英语版文件 `README.md` 中添加指向该文件的链接，
并给出英文形式的联系信息。你可以提供 GitHub ID、电子邮件地址、
[Slack 频道](https://slack.com/)或其他联系方式。你还必须提供指向本地化的社区行为准则的链接。

<!--
### Launch your new localization

When a localization meets the requirements for workflow and minimum output, SIG
Docs does the following:

- Enables language selection on the website.
- Publicizes the localization's availability through
  [Cloud Native Computing Foundation](https://www.cncf.io/about/)(CNCF)
  channels, including the [Kubernetes blog](/blog/).
-->
### 启动你的新本地化 {#add-a-localized-readme-file}

一旦本地化满足工作流程和最小输出的要求，SIG Docs 将：

- 在网站上启用语言选择
- 通过[云原生计算基金会](https://www.cncf.io/about/)（CNCF）渠道以及
  [Kubernetes 博客](https://kubernetes.io/zh-cn/blog/)来宣传本地化的可用性。

<!--
## Localize content

Localizing *all* the Kubernetes documentation is an enormous task. It's okay to
start small and expand over time.
-->
## 本地化文档 {#localize-content}

本地化**所有** Kubernetes 文档是一项艰巨的任务。从小做起，循序渐进。

<!--
### Minimum required content

At a minimum, all localizations must include:
-->
### 最低要求内容 {#minimum-required-content}

所有本地化至少必须包括：

<!--
Description | URLs
-----|-----
Home | [All heading and subheading URLs](/docs/home/)
Setup | [All heading and subheading URLs](/docs/setup/)
Tutorials | [Kubernetes Basics](/docs/tutorials/kubernetes-basics/), [Hello Minikube](/docs/tutorials/hello-minikube/)
Site strings | [All site strings](#site-strings-in-i18n) in a new localized TOML file
Releases | [All heading and subheading URLs](/releases)
-->
描述 | 网址
-----|-----
主页 | [所有标题和副标题网址](/zh-cn/docs/home/)
安装 | [所有标题和副标题网址](/zh-cn/docs/setup/)
教程 | [Kubernetes 基础](/zh-cn/docs/tutorials/kubernetes-basics/), [Hello Minikube](/zh-cn/docs/tutorials/hello-minikube/)
网站字符串 | [所有网站字符串](#site-strings-in-i18n)
发行版本 | [所有标题和副标题 URL](/zh-cn/releases)

<!--
Translated documents must reside in their own `content/**/` subdirectory, but otherwise, follow the
same URL path as the English source. For example, to prepare the
[Kubernetes Basics](/docs/tutorials/kubernetes-basics/) tutorial for translation into German,
create a subdirectory under the `content/de/` directory and copy the English source or directory:
-->
翻译后的文档必须保存在自己的 `content/**/` 子目录中，否则将遵循与英文源相同的 URL 路径。
例如，要准备将 [Kubernetes 基础](/zh-cn/docs/tutorials/kubernetes-basics/)教程翻译为德语，
请在 `content/de/` 目录下创建一个子目录，并复制英文源文件或目录：

```shell
mkdir -p content/de/docs/tutorials
cp -ra content/en/docs/tutorials/kubernetes-basics/ content/de/docs/tutorials/
```

<!--
Translation tools can speed up the translation process. For example, some
editors offer plugins to quickly translate text.
-->
翻译工具可以加快翻译过程。例如，某些编辑器提供了用于快速翻译文本的插件。

{{< caution >}}
<!--
Machine-generated translation is insufficient on its own. Localization requires
extensive human review to meet minimum standards of quality.
-->
机器生成的翻译本身是不够的，本地化需要广泛的人工审核才能满足最低质量标准。
{{< /caution >}}

<!--
To ensure accuracy in grammar and meaning, members of your localization team
should carefully review all machine-generated translations before publishing.
-->
为了确保语法和含义的准确性，本地化团队的成员应在发布之前仔细检查所有由机器生成的翻译。

<!--
### Localize SVG images

The Kubernetes project recommends using vector (SVG) images where possible, as
these are much easier for a localization team to edit. If you find a raster
image that needs localizing, consider first redrawing the English version as
a vector image, and then localize that.
-->
### 本地化 SVG 图片    {#localize-svg-images}

Kubernetes 项目建议尽可能使用矢量（SVG）图片，因为这些图片对于本地化团队来说更容易编辑。
如果你发现一个光栅图（位图）需要本地化翻译，先将英文版本重新绘制为矢量图片，然后再进行本地化。

<!--
When translating text within SVG (Scalable Vector Graphics) images, it's
essential to follow certain guidelines to ensure accuracy and maintain
consistency across different language versions. SVG images are commonly
used in the Kubernetes documentation to illustrate concepts, workflows,
and diagrams.
-->
在翻译 SVG（可缩放矢量图）图片中的文本时，需要遵循几点指导方针，
以确保准确性并在不同语言版本之间保持一致。
Kubernetes 文档中常用 SVG 图片来说明概念、工作流和图表。

<!--
1. **Identifying translatable text**: Start by identifying the text elements
   within the SVG image that need to be translated. These elements typically
   include labels, captions, annotations, or any text that conveys information.
-->
1. **识别可翻译文本**：首先辨别出 SVG 图片中需要翻译的文本元素。
   这些元素通常包括标签、标题、注解或任何传达信息的文本。

<!--
1. **Editing SVG files**: SVG files are XML-based, which means they can be
   edited using a text editor. However, it's important to note that most of the
   documentation images in Kubernetes already convert text to curves to avoid font
   compatibility issues. In such cases, it is recommended to use specialized SVG
   editing software, such as Inkscape, for editing, open the SVG file and locate
   the text elements that require translation.
-->
2. **编辑 SVG 文件**：SVG 文件是基于 XML 的，这意味着可以使用文本编辑器进行编辑。
   但请注意 Kubernetes 文档中的大部分图片已经将文本转换为曲线以避免字体兼容性问题。
   在这种情况下，建议使用 Inkscape 这类专业的 SVG 编辑软件，
   打开 SVG 文件并定位需要翻译的文本元素。

<!--
1. **Translating the text**: Replace the original text with the translated
   version in the desired language. Ensure the translated text accurately conveys
   the intended meaning and fits within the available space in the image. The Open
   Sans font family should be used when working with languages that use the Latin
   alphabet. You can download the Open Sans typeface from here:
   [Open Sans Typeface](https://fonts.google.com/specimen/Open+Sans).
-->
3. **翻译文本**：将原始的文本替换为目标语言的译文。确保翻译的文本准确传达所需的含义，
   并适配图片中可用的空间。在处理使用拉丁字母的语言时，应使用 Open Sans 字体系列。
   你可以从此处下载 Open Sans 字体：
   [Open Sans Typeface](https://fonts.google.com/specimen/Open+Sans)。

<!--
1. **Converting text to curves**: As already mentioned, to address font
   compatibility issues, it is recommended to convert the translated text to
   curves or paths. Converting text to curves ensures that the final image
   displays the translated text correctly, even if the user's system does not
   have the exact font used in the original SVG.
-->
4. **文本转换为曲线**：如前所述，为解决字体兼容性问题，建议将翻译后的文本转换为曲线或路径。
   即使用户的系统没有原始 SVG 中所使用的确切字体，将文本转换为曲线也可确保最终图片能正确显示译文。

<!--
1. **Reviewing and testing**: After making the necessary translations and
   converting text to curves, save and review the updated SVG image to ensure
   the text is properly displayed and aligned. Check
   [Preview your changes locally](/docs/contribute/new-content/open-a-pr/#preview-locally).
-->
5. **检查和测试**：完成必要的翻译并将文本转换为曲线后，保存并检查更新后的 SVG 图片，确保文本正确显示和对齐。
   参考[在本地预览你的变更](/zh-cn/docs/contribute/new-content/open-a-pr/#preview-locally)。

<!--
### Source files

Localizations must be based on the English files from a specific release
targeted by the localization team. Each localization team can decide which
release to target, referred to as the _target version_ below.

To find source files for your target version:

1. Navigate to the Kubernetes website repository at https://github.com/kubernetes/website.
1. Select a branch for your target version from the following table:
-->
### 源文件 {#source-files}

本地化必须基于本地化团队所针对的特定发行版本中的英文文件。
每个本地化团队可以决定要针对哪个发行版本，在下文中称作 **目标版本（target version）**。

要查找你的目标版本的源文件：

1. 导航到 Kubernetes website 仓库，网址为 https://github.com/kubernetes/website。
2. 从下面的表格中选择你的目标版本分支：

<!--
Target version | Branch
-----|-----
Latest version | [`main`](https://github.com/kubernetes/website/tree/main)
Previous version | [`release-{{< skew prevMinorVersion >}}`](https://github.com/kubernetes/website/tree/release-{{< skew prevMinorVersion >}})
Next version | [`dev-{{< skew nextMinorVersion >}}`](https://github.com/kubernetes/website/tree/dev-{{< skew nextMinorVersion >}})

The `main` branch holds content for the current release `{{< latest-version >}}`. 
The release team creates a `{{< release-branch >}}` branch before the next
release: v{{< skew nextMinorVersion >}}.
-->
目标版本   | 分支
----------|-----
最新版本   | [`main`](https://github.com/kubernetes/website/tree/main)
上一个版本 | [`release-{{< skew prevMinorVersion >}}`](https://github.com/kubernetes/website/tree/release-{{< skew prevMinorVersion >}})
下一个版本 | [`dev-{{< skew nextMinorVersion >}}`](https://github.com/kubernetes/website/tree/dev-{{< skew nextMinorVersion >}})

`main` 分支中保存的是当前发行版本 `{{< latest-version >}}` 的内容。
发行团队会在下一个发行版本 v{{< skew nextMinorVersion >}} 出现之前创建
`{{< release-branch >}}` 分支。

<!--
### Site strings in i18n

Localizations must include the contents of
[`data/i18n/en/en.toml`](https://github.com/kubernetes/website/blob/main/data/i18n/en/en.toml)
in a new language-specific file. Using German as an example:
`data/i18n/de/de.toml`.

Add a new localization directory and file to `data/i18n/`. For example, with
German (`de`):
-->
### i18n/ 中的网站字符串 {#site-strings-in-i18n}

本地化必须在新的语言特定文件中包含
[`data/i18n/en/en.toml`](https://github.com/kubernetes/website/blob/main/data/i18n/en/en.toml)
的内容。以德语为例：`data/i18n/de/de.toml`。

将新的本地化文件和目录添加到 `data/i18n/`。例如德语（`de`）：

```bash
mkdir -p data/i18n/de
cp data/i18n/en/en.toml data/i18n/de/de.toml
```

<!--
Revise the comments at the top of the file to suit your localization, then
translate the value of each string. For example, this is the German-language
placeholder text for the search form:
-->
修改文件顶部的注释以适合你的本地化，然后翻译每个字符串的值。
例如，这是搜索表单的德语占位符文本：

```toml
[ui_search_placeholder]
other = "Suchen"
```

<!--
Localizing site strings lets you customize site-wide text and features: for
example, the legal copyright text in the footer on each page.
-->
本地化网站字符串允许你自定义网站范围的文本和特性：例如每个页面页脚中的版权声明文本。

<!--
### Language-specific localization guide

As a localization team, you can formalize the best practices your team follows
by creating a language-specific localization guide.
-->
### 特定语言的本地化指南 {#language-specific-localization-guide}

作为本地化团队，你可以通过创建特定语言的本地化指南来正式确定团队需遵循的最佳实践。
请参见[中文本地化指南](/zh-cn/docs/contribute/localization_zh/)。

<!--
### Language-specific Zoom meetings

If the localization project needs a separate meeting time, contact a SIG Docs
Co-Chair or Tech Lead to create a new reoccurring Zoom meeting and calendar
invite. This is only needed when the team is large enough to sustain and require
a separate meeting.

Per CNCF policy, the localization teams must upload their meetings to the SIG
Docs YouTube playlist. A SIG Docs Co-Chair or Tech Lead can help with the
process until SIG Docs automates it.
-->
### 特定语言的 Zoom 会议 {#language-specific-zoom-meetings}

如果本地化项目需要单独的会议时间，
请联系 SIG Docs 联合主席或技术主管以创建新的重复 Zoom 会议和日历邀请。
仅当团队维持在足够大的规模并需要单独的会议时才需要这样做。

根据 CNCF 政策，本地化团队必须将他们的会议上传到 SIG Docs YouTube 播放列表。
SIG Docs 联合主席或技术主管可以帮助完成该过程，直到 SIG Docs 实现自动化。

<!--
## Branch strategy

Because localization projects are highly collaborative efforts, we
encourage teams to work in shared localization branches - especially
when starting out and the localization is not yet live.

To collaborate on a localization branch:
-->
### 分支策略 {#branch-strategy}

因为本地化项目是高度协同的工作，
特别是在刚开始本地化并且本地化尚未生效时，我们鼓励团队基于共享的本地化分支工作。

在本地化分支上协作需要：

<!--
1. A team member of
   [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers)
   opens a localization branch from a source branch on
   https://github.com/kubernetes/website.

   Your team approvers joined the `@kubernetes/website-maintainers` team when
   you [added your localization team](#add-your-localization-team-in-github) to
   the [`kubernetes/org`](https://github.com/kubernetes/org) repository.

   We recommend the following branch naming scheme:

   `dev-<source version>-<language code>.<team milestone>`

   For example, an approver on a German localization team opens the localization
   branch `dev-1.12-de.1` directly against the `kubernetes/website` repository,
   based on the source branch for Kubernetes v1.12.
-->
1. [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers)
   中的团队成员从 https://github.com/kubernetes/website 原有分支新建一个本地化分支。

   当你给 `kubernetes/org` 仓库[添加你的本地化团队](#add-your-localization-team-in-github)时，
   你的团队批准人便加入了 `@kubernetes/website-maintainers` 团队。

   我们推荐以下分支命名方案：

   `dev-<source version>-<language code>.<team milestone>`

   例如，一个德语本地化团队的批准人基于 Kubernetes v1.12 版本的源分支，
   直接新建了 kubernetes/website 仓库的本地化分支 `dev-1.12-de.1`。

<!--
1. Individual contributors open feature branches based on the localization
   branch.

   For example, a German contributor opens a pull request with changes to
   `kubernetes:dev-1.12-de.1` from `username:local-branch-name`.

1. Approvers review and merge feature branches into the localization branch.

1. Periodically, an approver merges the localization branch with its source
   branch by opening and approving a new pull request. Be sure to squash the
   commits before approving the pull request.
-->
2. 个人贡献者基于本地化分支创建新的特性分支。

   例如，一个德语贡献者新建了一个拉取请求，
   并将 `username:local-branch-name` 更改为 `kubernetes:dev-1.12-de.1`。

3. 批准人审查功能分支并将其合并到本地化分支中。

4. 批准人会定期发起并批准新的 PR，将本地化分支合并到其源分支。
   在批准 PR 之前，请确保先 squash commits。

<!--
Repeat steps 1-4 as needed until the localization is complete. For example,
subsequent German localization branches would be: `dev-1.12-de.2`,
`dev-1.12-de.3`, etc.
-->
根据需要重复步骤 1-4，直到完成本地化工作。例如，随后的德语本地化分支将是：
`dev-1.12-de.2`、`dev-1.12-de.3` 等等。

<!--
Teams must merge localized content into the same branch from which the content
was sourced. For example:

- A localization branch sourced from `main` must be merged into `main`.
- A localization branch sourced from `release-{{% skew "prevMinorVersion" %}}`
  must be merged into `release-{{% skew "prevMinorVersion" %}}`.
-->
团队必须将本地化内容合入到发布分支中，该发布分支是内容的来源。例如：

- 源于 `main` 分支的本地化分支必须被合并到 `main`。
- 源于 `release-{{ skew "prevMinorVersion" }}`
  的本地化分支必须被合并到 `release-{{ skew "prevMinorVersion" }}`。

{{< note >}}
<!--
If your localization branch was created from `main` branch, but it is not merged
into `main` before the new release branch `{{< release-branch >}}` created,
merge it into both `main` and new release branch `{{< release-branch >}}`. To
merge your localization branch into the new release branch
`{{< release-branch >}}`, you need to switch the upstream branch of your
localization branch to `{{< release-branch >}}`.
-->
如果你的本地化分支是基于 `main` 分支创建的，但最终没有在新的发行分支
`{{< release-branch >}}` 被创建之前合并到 `main` 中，需要将其同时将其合并到
`main` 和新的发行分支 `{{< release-branch >}}` 中。
要将本地化分支合并到新的发行分支 `{{< release-branch >}}` 中，
你需要将你本地化分支的上游分支切换到 `{{< release-branch >}}`。
{{< /note >}}

<!--
At the beginning of every team milestone, it's helpful to open an issue
comparing upstream changes between the previous localization branch and the
current localization branch. There are two scripts for comparing upstream
changes.

- [`upstream_changes.py`](https://github.com/kubernetes/website/tree/main/scripts#upstream_changespy)
  is useful for checking the changes made to a specific file. And
- [`diff_l10n_branches.py`](https://github.com/kubernetes/website/tree/main/scripts#diff_l10n_branchespy)
  is useful for creating a list of outdated files for a specific localization
  branch.

While only approvers can open a new localization branch and merge pull requests,
anyone can open a pull request for a new localization branch. No special
permissions are required.
-->
在团队每个里程碑的开始时段，创建一个 issue
来比较先前的本地化分支和当前的本地化分支之间的上游变化很有帮助。
现在有两个脚本用来比较上游的变化。

- [`upstream_changes.py`](https://github.com/kubernetes/website/tree/main/scripts#upstream_changespy)
  对于检查对某个文件的变更很有用。
- [`diff_l10n_branches.py`](https://github.com/kubernetes/website/tree/main/scripts#diff_l10n_branchespy)
  可以用来为某个特定本地化分支创建过时文件的列表。

虽然只有批准人才能创建新的本地化分支并合并 PR，
任何人都可以为新的本地化分支提交一个拉取请求（PR）。不需要特殊权限。

<!--
For more information about working from forks or directly from the repository,
see ["fork and clone the repo"](#fork-and-clone-the-repo).
-->
有关基于派生或直接从仓库开展工作的更多信息，请参见["派生和克隆"](#fork-and-clone-the-repo)。

<!--
## Upstream contributions

SIG Docs welcomes upstream contributions and corrections to the English source.
-->
### 上游贡献 {#upstream-contributions}

Sig Docs 欢迎对英文原文的上游贡献和修正。
