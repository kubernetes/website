---
title: 本地化 Kubernetes 文件
content_type: concept
weight: 50
card:
  name: contribute
  weight: 50
  title: 翻譯文件
---
<!--
title: Localizing Kubernetes Documentation
content_type: concept
approvers:
- remyleone
- rlenferink
- zacharysarah
weight: 50
card:
  name: contribute
  weight: 50
  title: Translating the docs
-->

<!-- overview -->

<!--
This page shows you how to [localize](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/) the docs for a different language.
-->
此頁面描述如何為其他語言的文件提供
[本地化](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)版本。

<!-- body -->

<!--
## Contribute to an existing localization

You can help add or improve content to an existing localization. In [Kubernetes Slack](https://slack.k8s.io/) you'll find a channel for each localization. There is also a general [SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations) where you can say hello.
-->
## 為現有的本地化做出貢獻 {#contribute-to-an-existing-localization}

你可以幫助新增或改進現有本地化的內容。在 [Kubernetes Slack](https://slack.k8s.io/) 中，
你能找到每個本地化的頻道。還有一個通用的
[SIG Docs Localizations Slack 頻道](https://kubernetes.slack.com/messages/sig-docs-localizations)，
你可以在這裡打個招呼。

{{< note >}}
<!--
If you want to work on a localization that already exists, check
this page in that localization (if it exists), rather than the
English original. You might see extra details there.
-->
如果你想處理已經存在的本地化，請在該本地化（如果存在）中檢查此頁面，而不是英文原版。
你可能會在那裡看到額外的詳細資訊。
{{< /note >}}

<!--
### Find your two-letter language code

First, consult the [ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php) to find your localization's two-letter language code. For example, the two-letter code for Korean is `ko`.

### Fork and clone the repo

First, [create your own fork](/docs/contribute/new-content/open-a-pr/#fork-the-repo) of the [kubernetes/website](https://github.com/kubernetes/website) repository.

The website content directory includes sub-directories for each language. The localization you want to help out with is inside `content/<two-letter-code>`.
-->
### 找到兩個字母的語言程式碼 {#find-your-two-letter-language-code}

首先，有關本地化的兩個字母的語言程式碼，請參考
[ISO 639-1 標準](https://www.loc.gov/standards/iso639-2/php/code_list.php)。
例如，韓國的兩個字母程式碼是 `ko`。

### 派生（fork）並且克隆倉庫 {#fork-and-clone-the-repo}

首先，為 [kubernetes/website](https://github.com/kubernetes/website) 倉庫
[建立你自己的副本](/zh-cn/docs/contribute/new-content/open-a-pr/#fork-the-repo)。

<!--
Then, clone your fork and `cd` into it:
-->
然後，克隆你的 website 倉庫副本並透過 `cd` 命令進入 website 目錄：

```shell
git clone https://github.com/<username>/website
cd website
```

<!--
The website content directory includes sub-directories for each language. The localization you want to help out with is inside `content/<two-letter-code>`.
-->
網站內容目錄包括每種語言的子目錄。你想要助力的本地化位於 `content/<two-letter-code>` 中。

<!--
### Suggest changes

Create or update your chosen localized page based on the English original. See
[translating content](#translating-content) for more details.

If you notice a technical inaccuracy or other problem with the upstream (English)
documentation, you should fix the upstream documentation first and then repeat the
equivalent fix by updating the localization you're working on.

Please limit pull requests to a single localization, since pull requests that change
content in multiple localizations could be difficult to review.

Follow [Suggesting Content Improvements](/docs/contribute/suggest-improvements/) to propose changes to
that localization. The process is very similar to proposing changes to the upstream (English) content.
-->
### 建議更改 {#suggest-changes}

根據英文原件建立或更新你選擇的本地化頁面。
有關更多詳細資訊，請參閱[翻譯內容](#translating-content)。

如果你發現上游（英文）文件存在技術錯誤或其他問題，
你應該先修復上游文件，然後透過更新你正在處理的本地化來重複等效的修復。

請將拉取請求限制為單個本地化，因為在多個本地化中更改內容的拉取請求可能難以審查。

按照[內容改進建議](/zh-cn/docs/contribute/suggest-improvements/)提出對該本地化的更改。
該過程與提議更改上游（英文）內容非常相似。

<!--
## Start a new localization

If you want the Kubernetes documentation localized into a new language, here's what
you need to do.

Because contributors can't approve their own pull requests, you need _at least two contributors_
to begin a localization.

All localization teams must be self-sustaining. The Kubernetes website is happy to host your work, but
it's up to you to translate it and keep existing localized content current.
-->
## 開始新的本地化 {#start-a-new-localization}

如果你希望將 Kubernetes 文件本地化為一種新語言，你需要執行以下操作。

因為貢獻者不能批准他們自己的拉取請求，你需要 _至少兩個貢獻者_ 來開始本地化。

所有本地化團隊都必須能夠自我維持。
Kubernetes 網站很樂意託管你的作品，但要由你來翻譯它並使現有的本地化內容保持最新。

<!--
You'll need to know the two-letter language code for your language. Consult the
[ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php) to find your
localization's two-letter language code. For example, the two-letter code for Korean is
`ko`.

When you start a new localization, you must localize all the
[minimum required content](#minimum-required-content) before
the Kubernetes project can publish your changes to the live
website.

SIG Docs can help you work on a separate branch so that you
can incrementally work towards that goal.
-->
你需要知道你的語言的兩個字母的語言程式碼。
請查閱 [ISO 639-1 標準](https://www.loc.gov/standards/iso639-2/php/code_list.php)
以查詢你的本地化的兩字母語言程式碼。例如，韓語的兩字母程式碼是`ko`。

當你開始新的本地化時，你必須先本地化所有[最少要求的內容](#minimum-required-content)，
Kubernetes 專案才能將你的更改釋出到當前網站。

SIG Docs 可以幫助你在單獨的分支上工作，以便你可以逐步實現該目標。

<!--
### Find community

Let Kubernetes SIG Docs know you're interested in creating a localization! Join the [SIG Docs Slack channel](https://kubernetes.slack.com/messages/sig-docs) and the [SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations). Other localization teams are happy to help you get started and answer any questions you have.
-->
### 找到社群 {#find-community}

讓 Kubernetes SIG Docs 知道你有興趣建立本地化！
加入 [SIG Docs Slack 頻道](https://kubernetes.slack.com/messages/sig-docs)
和 [SIG Docs Localizations Slack 頻道](https://kubernetes.slack.com/messages/sig-docs-localizations)。
其他本地化團隊很樂意幫助你入門並回答你的任何問題。

<!--
Please also consider participating in the [SIG Docs Localization Subgroup meeting](https://github.com/kubernetes/community/tree/master/sig-docs).  The mission of the SIG Docs localization subgroup is to work across the SIG Docs localization teams to collaborate on defining and documenting the processes for creating localized contribution guides. In addition, the SIG Docs localization subgroup will look for opportunities for the creation and sharing of common tools across localization teams and also serve to identify new requirements to the SIG Docs Leadership team.  If you have questions about this meeting, please inquire on the [SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations).

You can also create a Slack channel for your localization in the `kubernetes/community` repository. For an example of adding a Slack channel, see the PR for [adding a channel for Persian](https://github.com/kubernetes/community/pull/4980).
-->
也請考慮參加
[SIG Docs 本地化小組的會議](https://github.com/kubernetes/community/tree/master/sig-docs)。
SIG Docs 本地化小組的任務是與 SIG Docs 本地化團隊合作，
共同定義和記錄建立本地化貢獻指南的流程。
此外，SIG Docs 本地化小組將尋找機會在本地化團隊中建立和共享通用工具，
併為 SIG Docs 領導團隊確定新要求。如果你對本次會議有任何疑問，
請在 [SIG Docs Localizations Slack 頻道](https://kubernetes.slack.com/messages/sig-docs-localizations)
中提問。

你還可以在 `kubernetes/community` 倉庫中為你的本地化建立一個 Slack 頻道。
有關新增 Slack 頻道的示例，請參閱
[為波斯語新增頻道](https://github.com/kubernetes/community/pull/4980)的 PR。

<!--
### Join the Kubernetes GitHub organization

Once you've opened a localization PR, you can become members of the Kubernetes GitHub organization. Each person on the team needs to create their own [Organization Membership Request](https://github.com/kubernetes/org/issues/new/choose) in the `kubernetes/org` repository.
-->
### 加入到 Kubernetes GitHub 組織 {#join-the-kubernetes-github-organization}

提交本地化 PR 後，你可以成為 Kubernetes GitHub 組織的成員。
團隊中的每個人都需要在 `kubernetes/org` 倉庫中建立自己的
[組織成員申請](https://github.com/kubernetes/org/issues/new/choose)。

<!--
### Add your localization team in GitHub

Next, add your Kubernetes localization team to [`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/main/config/kubernetes/sig-docs/teams.yaml). For an example of adding a localization team, see the PR to add the [Spanish localization team](https://github.com/kubernetes/org/pull/685).

Members of `@kubernetes/sig-docs-**-owners` can approve PRs that change content within (and only within) your localization directory: `/content/**/`.

For each localization, The `@kubernetes/sig-docs-**-reviews` team automates review assignment for new PRs.
-->
### 在 GitHub 中新增你的本地化團隊 {#add-your-localization-team-in-github}

接下來，將你的 Kubernetes 本地化團隊新增到
[`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/main/config/kubernetes/sig-docs/teams.yaml)。
有關新增本地化團隊的示例，請參見新增[西班牙本地化團隊](https://github.com/kubernetes/org/pull/685) 的 PR。

`@kubernetes/sig-docs-**-owners` 成員可以批准更改對應本地化目錄 `/content/**/` 中內容的 PR，並僅限這類 PR。

對於每個本地化，`@kubernetes/sig-docs-**-reviews` 團隊被自動分派新 PR 的審閱任務。

<!--
Members of `@kubernetes/website-maintainers` can create new localization branches to coordinate translation efforts.

Members of `@kubernetes/website-milestone-maintainers` can use the `/milestone` [Prow command](https://prow.k8s.io/command-help) to assign a milestone to issues or PRs.
-->
`@kubernetes/website-maintainers` 成員可以建立新的本地化分支來協調翻譯工作。

`@kubernetes/website-milestone-maintainers` 成員可以使用 `/milestone`
[Prow 命令](https://prow.k8s.io/command-help)為 issues 或 PR 設定里程碑。

<!--
### Configure the workflow

Next, add a GitHub label for your localization in the `kubernetes/test-infra` repository. A label lets you filter issues and pull requests for your specific language.

For an example of adding a label, see the PR for adding the [Italian language label](https://github.com/kubernetes/test-infra/pull/11316).
-->
### 配置工作流程 {#configure-the-workflow}

接下來，在 `kubernetes/test-infra` 倉庫中為你的本地化新增一個 GitHub 標籤。
標籤可讓你過濾 issues 和針對特定語言的 PR。

有關新增標籤的示例，請參見新增[義大利語標籤](https://github.com/kubernetes/test-infra/pull/11316)的 PR。

你還可以在 `kubernetes/community` 倉庫中為你的本地化建立一個 Slack 頻道。
有關新增 Slack 頻道的示例，請參見[為印尼語和葡萄牙語新增頻道](https://github.com/kubernetes/community/pull/3605)的 PR。

<!--
### Modify the site configuration

The Kubernetes website uses Hugo as its web framework. The website's Hugo configuration resides in the  [`config.toml`](https://github.com/kubernetes/website/tree/main/config.toml) file. To support a new localization, you'll need to modify `config.toml`.

Add a configuration block for the new language to `config.toml`, under the existing `[languages]` block. The German block, for example, looks like:
-->
### 修改站點配置 {#configure-the-workflow}

Kubernetes 網站使用 Hugo 作為其 Web 框架。網站的 Hugo 配置位於
[`config.toml`](https://github.com/kubernetes/website/tree/main/config.toml)檔案中。
為了支援新的本地化，你需要修改 `config.toml`。

在現有的 `[languages]` 下，將新語言的配置新增到 `config.toml` 中。
例如，下面是德語的配置示例：

```toml
[languages.de]
title = "Kubernetes"
description = "Produktionsreife Container-Verwaltung"
languageName = "Deutsch (German)"
languageNameLatinScript = "German"
contentDir = "content/de"
weight = 8
```

<!--
The value for `languageName` will be listed in language selection bar. Assign "language name in native script (language name in latin script)" to `languageName`, for example, `languageName = "한국어 (Korean)"`. `languageNameLatinScript` can be used to access the language name in latin script and use it in the theme. Assign "language name in latin script" to `languageNameLatinScript`, for example, `languageNameLatinScript ="Korean"`. 
-->
`languageName` 的值將列在語言選擇欄中。
將 `languageName` 賦值為“本地指令碼中的語言名稱（拉丁指令碼中的語言名稱）”。
例如，`languageName = "한국어 (Korean)"`。
`languageNameLatinScript` 可用於訪問拉丁指令碼中的語言名稱並在主題中使用。
將 `languageNameLatinScript` 賦值為“拉丁指令碼中的語言名稱”。
例如，`languageNameLatinScript ="Korean"`。

<!--
When assigning a `weight` parameter for your block, find the language block with the highest weight and add 1 to that value.

For more information about Hugo's multilingual support, see "[Multilingual Mode](https://gohugo.io/content-management/multilingual/)".
-->
為你的語言塊分配一個 `weight` 引數時，找到權重最高的語言塊並將其加 1。

有關 Hugo 多語言支援的更多資訊，請參閱"[多語言模式](https://gohugo.io/content-management/multilingual/)"。

<!--
### Add a new localization directory

Add a language-specific subdirectory to the [`content`](https://github.com/kubernetes/website/tree/main/content) folder in the repository. For example, the two-letter code for German is `de`:
-->
### 新增一個新的本地化目錄 {#add-a-new-localization-directory}

將特定語言的子目錄新增到倉庫中的
[`content`](https://github.com/kubernetes/website/tree/main/content) 資料夾下。
例如，德語的兩個字母的程式碼是 `de`：

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
你還需要在 `data/i18n` 中為 [localized strings](#site-strings-in-i18n) 建立一個目錄；
以現有的本地化為例。要使用這些新字串，
你還必須建立從 `i18n/<localization>.toml`
到 `data/i18n/<localization>/<localization>.toml`
中實際字串配置的符號連結（記得提交符號連結關聯）。

例如，對於德語，字串位於 `data/i18n/de/de.toml` 中，
而 `i18n/de.toml` 是指向 `data/i18n/de/de.toml` 的符號連結。

<!--
### Localize the community code of conduct

Open a PR against the [`cncf/foundation`](https://github.com/cncf/foundation/tree/master/code-of-conduct-languages) repository to add the code of conduct in your language.

-->
### 本地化社群行為準則 {#localize-the-community-code-of-conduct}

在 [`cncf/foundation`](https://github.com/cncf/foundation/tree/master/code-of-conduct-languages)
倉庫提交 PR，新增你所用語言版本的行為準則。

-->
<!--
### Setting up the OWNERS files

To set the roles of each user contributing to the localization, create an `OWNERS` file inside the language-specific subdirectory with:

- **reviewers**: A list of kubernetes teams with reviewer roles, in this case, the `sig-docs-**-reviews` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **approvers**: A list of kubernetes teams with approvers roles, in this case, the `sig-docs-**-owners` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **labels**: A list of GitHub labels to automatically apply to a PR, in this case, the language label created in [Configure the workflow](#configure-the-workflow).
-->
### 設定 OWNERS 檔案 {#setting-up-the-owners-files}

要設定每個對本地化做出貢獻使用者的角色，請在特定於語言的子目錄內建立一個 `OWNERS` 檔案，其中：

- **reviewers**: 具有評審人角色的 kubernetes 團隊的列表，在本例中為在
  [在 GitHub 中新增你的本地化團隊](#add-your-localization-team-in-github)
  中建立的 `sig-docs-**-reviews` 團隊。
- **approvers**: 具有批准人角色的 kubernetes 團隊的列表，在本例中為在
  [在 GitHub 中新增你的本地化團隊](#add-your-localization-team-in-github)
  中建立的 `sig-docs-**-owners` 團隊。
- **labels**: 可以自動應用於 PR 的 GitHub 標籤列表，在本例中為
  [配置工作流程](#configure-the-workflow)中建立的語言標籤。

<!--
More information about the `OWNERS` file can be found at [go.k8s.io/owners](https://go.k8s.io/owners).

The [Spanish OWNERS file](https://git.k8s.io/website/content/es/OWNERS), with language code `es`, looks like:
-->
有關 `OWNERS` 檔案的更多資訊，請訪問[go.k8s.io/owners](https://go.k8s.io/owners)。

語言程式碼為 `es` 的[西班牙語 OWNERS 檔案](https://git.k8s.io/website/content/es/OWNERS)看起來像：


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

<!--
After adding the language-specific `OWNERS` file, update the [root `OWNERS_ALIASES`](https://git.k8s.io/website/OWNERS_ALIASES) file with the new Kubernetes teams for the localization, `sig-docs-**-owners` and `sig-docs-**-reviews`.

For each team, add the list of GitHub users requested in [Add your localization team in GitHub](#add-your-localization-team-in-github), in alphabetical order.
-->
添加了特定語言的 OWNERS 檔案之後，使用新的 Kubernetes 本地化團隊、
`sig-docs-**-owners` 和 `sig-docs-**-reviews` 列表更新
[根目錄下的 OWNERS_ALIAES](https://git.k8s.io/website/OWNERS_ALIASES) 檔案。

對於每個團隊，請按字母順序新增
[在 GitHub 中新增你的本地化團隊](#add-your-localization-team-in-github)
中所請求的 GitHub 使用者列表。

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

Next, [open a pull request](/docs/contribute/new-content/open-a-pr/#open-a-pr) (PR) to add a localization to the `kubernetes/website` repository.

The PR must include all of the [minimum required content](#minimum-required-content) before it can be approved.

For an example of adding a new localization, see the PR to enable [docs in French](https://github.com/kubernetes/website/pull/12548).
-->
### 開啟拉取請求  {#open-a-pull-request}

接下來，[開啟拉取請求](/zh-cn/docs/contribute/new-content/open-a-pr/#open-a-pr)（PR）
將本地化新增到 `kubernetes/website` 儲存庫。

PR 必須包含所有[最低要求內容](#minimum-required-content)才能獲得批准。

有關新增新本地化的示例，
請參閱 PR 以啟用[法語文件](https://github.com/kubernetes/website/pull/12548)。

<!--
### Add a localized README file

To guide other localization contributors, add a new [`README-**.md`](https://help.github.com/articles/about-readmes/) to the top level of [k/website](https://github.com/kubernetes/website/), where `**` is the two-letter language code. For example, a German README file would be `README-de.md`.

Provide guidance to localization contributors in the localized `README-**.md` file. Include the same information contained in `README.md` as well as:

- A point of contact for the localization project
- Any information specific to the localization
-->
### 新增本地化的 README 檔案 {#add-a-localized-readme-file}

為了指導其他本地化貢獻者，請在 [k/website](https://github.com/kubernetes/website/)
的根目錄新增一個新的 [`README-**.md`](https://help.github.com/articles/about-readmes/)，
其中 `**` 是兩個字母的語言程式碼。例如，德語 README 檔案為 `README-de.md`。

在本地化的 `README-**.md` 檔案中為本地化貢獻者提供指導。包含 `README.md` 中包含的相同資訊，以及：

- 本地化專案的聯絡人
- 任何特定於本地化的資訊

<!--
After you create the localized README, add a link to the file from the main English `README.md`, and include contact information in English. You can provide a GitHub ID, email address, [Slack channel](https://slack.com/), or other method of contact. You must also provide a link to your localized Community Code of Conduct.
-->
建立本地化的 README 檔案後，請在英語版檔案 `README.md` 中新增指向該檔案的連結，
並給出英文形式的聯絡資訊。你可以提供 GitHub ID、電子郵件地址、
[Slack 頻道](https://slack.com/)或其他聯絡方式。你還必須提供指向本地化的社群行為準則的連結。

<!--
### Launching your new localization

Once a localization meets requirements for workflow and minimum output, SIG Docs will:

- Enable language selection on the website
- Publicize the localization's availability through [Cloud Native Computing Foundation](https://www.cncf.io/about/) (CNCF) channels, including the [Kubernetes blog](https://kubernetes.io/blog/).
-->
### 啟動你的新本地化 {#add-a-localized-readme-file}

一旦本地化滿足工作流程和最小輸出的要求，SIG Docs 將：

- 在網站上啟用語言選擇
- 透過[雲原生計算基金會](https://www.cncf.io/about/)（CNCF）渠道，
  包括 [Kubernetes 部落格](https://kubernetes.io/blog/)，來宣傳本地化的可用性。

<!--
## Translating content

Localizing *all* of the Kubernetes documentation is an enormous task. It's okay to start small and expand over time.
-->
## 翻譯文件 {#translating-content}

本地化*所有* Kubernetes 文件是一項艱鉅的任務。從小做起，循序漸進。

<!--
### Minimum required content

At a minimum, all localizations must include:
-->
### 最低要求內容 {#minimum-required-content}

所有本地化至少必須包括：

<!--
Description | URLs
-----|-----
Home | [All heading and subheading URLs](/docs/home/)
Setup | [All heading and subheading URLs](/docs/setup/)
Tutorials | [Kubernetes Basics](/docs/tutorials/kubernetes-basics/), [Hello Minikube](/docs/tutorials/hello-minikube/)
Site strings | [All site strings](#Site-strings-in-i18n) in a new localized TOML file
Releases | [All heading and subheading URLs](/releases)
-->
描述 | 網址
-----|-----
主頁 | [所有標題和副標題網址](/zh-cn/docs/home/)
安裝 | [所有標題和副標題網址](/zh-cn/docs/setup/)
教程 | [Kubernetes 基礎](/zh-cn/docs/tutorials/kubernetes-basics/), [Hello Minikube](/zh-cn/docs/tutorials/hello-minikube/)
網站字串 | [所有網站字串](#Site-strings-in-i18n)
發行版本 | [所有標題和副標題 URL](/releases)

<!--
Translated documents must reside in their own `content/**/` subdirectory, but otherwise follow the same URL path as the English source. For example, to prepare the [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) tutorial for translation into German, create a subfolder under the `content/de/` folder and copy the English source:
-->
翻譯後的文件必須儲存在自己的 `content/**/` 子目錄中，否則將遵循與英文源相同的 URL 路徑。
例如，要準備將 [Kubernetes 基礎](/zh-cn/docs/tutorials/kubernetes-basics/) 教程翻譯為德語，
請在 `content/de/` 資料夾下建立一個子資料夾並複製英文源：

```shell
mkdir -p content/de/docs/tutorials
cp content/en/docs/tutorials/kubernetes-basics.md content/de/docs/tutorials/kubernetes-basics.md
```

<!--
Translation tools can speed up the translation process. For example, some editors offers plugins to quickly translate text.
-->
翻譯工具可以加快翻譯過程。例如，某些編輯器提供了用於快速翻譯文字的外掛。

<!--
Machine-generated translation is insufficient on its own. Localization requires extensive human review to meet minimum standards of quality.
-->
{{< caution >}}
機器生成的翻譯本身是不夠的，本地化需要廣泛的人工稽核才能滿足最低質量標準。
{{< /caution >}}

<!--
To ensure accuracy in grammar and meaning, members of your localization team should carefully review all machine-generated translations before publishing.
-->
為了確保語法和含義的準確性，本地化團隊的成員應在釋出之前仔細檢查所有由機器生成的翻譯。

<!--
### Source files

Localizations must be based on the English files from a specific release targeted by the localization team.
Each localization team can decide which release to target which is referred to as the _target version_ below.

To find source files for your target version:

1. Navigate to the Kubernetes website repository at https://github.com/kubernetes/website.
2. Select a branch for your target version from the following table:
    Target version | Branch
    -----|-----
    Latest version | [`main`](https://github.com/kubernetes/website/tree/main)
    Previous version | [`release-{{< skew prevMinorVersion >}}`](https://github.com/kubernetes/website/tree/release-{{< skew prevMinorVersion >}})
    Next version | [`dev-{{< skew nextMinorVersion >}}`](https://github.com/kubernetes/website/tree/dev-{{< skew nextMinorVersion >}})

The `main` branch holds content for the current release `{{< latest-version >}}`. The release team will create a `{{< release-branch >}}` branch before the next release: v{{< skew nextMinorVersion >}}.
-->
### 原始檔 {#source-files}

本地化必須基於本地化團隊所針對的特定發行版本中的英文檔案。
每個本地化團隊可以決定要針對哪個發行版本，在下文中稱作目標版本（target version）。）

要查詢你的目標版本的原始檔：

1. 導航到 Kubernetes website 倉庫，網址為 https://github.com/kubernetes/website。
2. 從下面的表格中選擇你的目標版本分支：

   目標版本 | 分支
   -----|-----
   最新版本 | [`main`](https://github.com/kubernetes/website/tree/main)
   上一個版本 | [`release-{{< skew prevMinorVersion >}}`](https://github.com/kubernetes/website/tree/release-{{< skew prevMinorVersion >}})
   下一個版本 | [`dev-{{< skew nextMinorVersion >}}`](https://github.com/kubernetes/website/tree/dev-{{< skew nextMinorVersion >}})

`main` 分支中儲存的是當前發行版本 `{{< latest-version >}}` 的內容。
發行團隊會在下一個發行版本 v{{< skew nextMinorVersion >}} 出現之前建立
`{{< release-branch >}}` 分支。

<!--
### Site strings in i18n

Localizations must include the contents of [`data/i18n/en/en.toml`](https://github.com/kubernetes/website/blob/main/data/i18n/en/en.toml) in a new language-specific file. Using German as an example: `data/i18n/de/de.toml`.

Add a new localization directory and file to `data/i18n/`. For example, with German (`de`):
-->
### i18n/ 中的網站字串 {#site-strings-in-i18n}

本地化必須在新的語言特定檔案中包含
[`data/i18n/en/en.toml`](https://github.com/kubernetes/website/blob/main/data/i18n/en/en.toml)
的內容。以德語為例：`data/i18n/de/de.toml`。

將新的本地化檔案和目錄新增到 `data/i18n/`。例如德語 (`de`)：

```bash
mkdir -p data/i18n/de
cp data/i18n/en/en.toml data/i18n/de/de.toml
```

<!--
Revise the comments at the top of the file to suit your localization,
then translate the value of each string. For example, this is the German-language
placeholder text for the search form:
-->
修改檔案頂部的註釋以適合你的本地化，
然後翻譯每個字串的值。例如，這是搜尋表單的德語佔位符文字：

```toml
[ui_search_placeholder]
other = "Suchen"
```

<!--
Localizing site strings lets you customize site-wide text and features: for example, the legal copyright text in the footer on each page.
-->
本地化網站字串允許你自定義網站範圍的文字和特性：例如，每個頁面頁尾中的合法版權文字。

<!--
### Language specific style guide and glossary

Some language teams have their own language-specific style guide and glossary. For example, see the [Korean Localization Guide](/ko/docs/contribute/localization_ko/).
-->
### 特定語言的樣式指南和詞彙表 {#language-specific-style-guide-and-glossary}

一些語言團隊有自己的特定語言樣式指南和詞彙表。
例如，請參見[中文字地化指南](/zh-cn/docs/contribute/localization_zh/)。

<!--
### Language specific Zoom meetings

If the localization project needs a separate meeting time, contact a SIG Docs Co-Chair or Tech Lead to create a new reoccurring Zoom meeting and calendar invite. This is only needed when the the team is large enough to sustain and require a separate meeting.

Per CNCF policy, the localization teams must upload their meetings to the SIG Docs YouTube playlist. A SIG Docs Co-Chair or Tech Lead can help with the process until SIG Docs automates it.

-->

### 特定語言的 Zoom 會議 {#language-specific-zoom-meetings}

如果本地化專案需要單獨的會議時間，
請聯絡 SIG Docs 聯合主席或技術主管以建立新的重複 Zoom 會議和日曆邀請。
僅當團隊維持在足夠大的規模並需要單獨的會議時才需要這樣做。

根據 CNCF 政策，本地化團隊必須將他們的會議上傳到 SIG Docs YouTube 播放列表。
SIG Docs 聯合主席或技術主管可以幫助完成該過程，直到 SIG Docs 實現自動化。

<!--
## Branching strategy

Because localization projects are highly collaborative efforts, we
encourage teams to work in shared localization branches - especially
when starting out and the localization is not yet live.

To collaborate on a localization branch:
-->
### 分支策略 {#branching-strategy}

因為本地化專案是高度協同的工作，所以我們鼓勵團隊基於共享的本地化分支工作。
- 特別是在開始並且本地化尚未生效時。

在本地化分支上協作需要：

<!--
1. A team member of [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers) opens a localization branch from a source branch on https://github.com/kubernetes/website.

    Your team approvers joined the `@kubernetes/website-maintainers` team when you [added your localization team](#add-your-localization-team-in-github) to the [`kubernetes/org`](https://github.com/kubernetes/org) repository.

    We recommend the following branch naming scheme:

    `dev-<source version>-<language code>.<team milestone>`

    For example, an approver on a German localization team opens the localization branch `dev-1.12-de.1` directly against the k/website repository, based on the source branch for Kubernetes v1.12.
-->
1. [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers)
   中的團隊成員從 https://github.com/kubernetes/website 原有分支新建一個本地化分支。
   當你給 `kubernetes/org` 倉庫[新增你的本地化團隊](#add-your-localization-team-in-github)時，
   你的團隊批准人便加入了 `@kubernetes/website-maintainers` 團隊。

   我們推薦以下分支命名方案：

   `dev-<source version>-<language code>.<team milestone>`

   例如，一個德語本地化團隊的批准人基於 Kubernetes v1.12 版本的源分支，
   直接新建了 k/website 倉庫的本地化分支 `dev-1.12-de.1`。

<!--
2. Individual contributors open feature branches based on the localization branch.

    For example, a German contributor opens a pull request with changes to `kubernetes:dev-1.12-de.1` from `username:local-branch-name`.

3. Approvers review and merge feature branches into the localization branch.

4. Periodically, an approver merges the localization branch to its source branch by opening and approving a new pull request. Be sure to squash the commits before approving the pull request.
-->
2. 個人貢獻者基於本地化分支建立新的特性分支

   例如，一個德語貢獻者新建了一個拉取請求，並將 `username:local-branch-name` 更改為 `kubernetes:dev-1.12-de.1`。

3. 批准人審查功能分支並將其合併到本地化分支中。

4. 批准人會定期發起並批准新的 PR，將本地化分支合併到其源分支。
   在批准 PR 之前，請確保先 squash commits。

<!--
Repeat steps 1-4 as needed until the localization is complete. For example, subsequent German localization branches would be: `dev-1.12-de.2`, `dev-1.12-de.3`, etc.
-->
根據需要重複步驟 1-4，直到完成本地化工作。例如，隨後的德語本地化分支將是：
`dev-1.12-de.2`、`dev-1.12-de.3`，等等。

<!--
Teams must merge localized content into the same branch from which the content was sourced.

For example:

- a localization branch sourced from `main` must be merged into `main`.
- a localization branch sourced from `release-{{% skew "prevMinorVersion" %}}` must be merged into `release-{{% skew "prevMinorVersion" %}}`.

{{< note >}}
If your localization branch was created from `main` branch but it is not merged into `main` before new release branch `{{< release-branch >}}` created, merge it into both `main` and new release branch `{{< release-branch >}}`. To merge your localization branch into new release branch `{{< release-branch >}}`, you need to switch upstream branch of your localization branch to `{{< release-branch >}}`.
{{< /note >}}
-->
團隊必須將本地化內容合入到釋出分支中，該釋出分支是內容的來源。

例如：

- 源於 `main` 分支的本地化分支必須被合併到 `main`。
- 源於 `release-{{ skew "prevMinorVersion" }}`
  的本地化分支必須被合併到 `release-{{ skew "prevMinorVersion" }}`。

如果你的本地化分支是基於 `main` 分支建立的，但最終沒有在新的發行
分支 `{{< release-branch >}}` 被建立之前合併到 `main` 中，需要將其
同時將其合併到 `main` 和新的發行分支 `{{< release-branch >}}` 中。
要將本地化分支合併到新的發行分支 `{{< release-branch >}}` 中，你需要
將你本地化分支的上游分支切換到 `{{< release-branch >}}`。

<!--
At the beginning of every team milestone, it's helpful to open an issue comparing upstream changes between the previous localization branch and the current localization branch. There are two scripts for comparing upstream changes. [`upstream_changes.py`](https://github.com/kubernetes/website/tree/main/scripts#upstream_changespy) is useful for checking the changes made to a specific file. And [`diff_l10n_branches.py`](https://github.com/kubernetes/website/tree/main/scripts#diff_l10n_branchespy) is useful for creating a list of outdated files for a specific localization branch.

While only approvers can open a new localization branch and merge pull requests, anyone can open a pull request for a new localization branch. No special permissions are required.
-->
在團隊每個里程碑的開始時段，建立一個 issue 來比較先前的本地化分支
和當前的本地化分支之間的上游變化很有幫助。
現在有兩個指令碼用來比較上游的變化。
[`upstream_changes.py`](https://github.com/kubernetes/website/tree/main/scripts#upstream_changespy)
對於檢查對某個檔案的變更很有用。
[`diff_l10n_branches.py`](https://github.com/kubernetes/website/tree/main/scripts#diff_l10n_branchespy)
可以用來為某個特定本地化分支建立過時檔案的列表。

雖然只有批准人才能建立新的本地化分支併合並 PR，任何人都可以
為新的本地化分支提交一個拉取請求（PR）。不需要特殊許可權。

<!--
For more information about working from forks or directly from the repository, see ["fork and clone the repo"](#fork-and-clone-the-repo).
-->
有關基於派生或直接從倉庫開展工作的更多資訊，請參見 ["派生和克隆"](#fork-and-clone-the-repo)。

<!--
## Upstream contributions

SIG Docs welcomes upstream contributions and corrections to the English source.
-->
### 上游貢獻 {#upstream-contributions}

Sig Docs 歡迎對英文原文的上游貢獻和修正。
