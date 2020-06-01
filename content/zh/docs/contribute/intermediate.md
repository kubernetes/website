---
title: 中级贡献
slug: intermediate
content_type: concept
weight: 20
card:
  name: contribute
  weight: 50
---
<!-- 
---
title: Intermediate contributing
slug: intermediate
content_type: concept
weight: 20
card:
  name: contribute
  weight: 50
--- 
-->

<!-- overview -->

<!--
This page assumes that you've read and mastered the tasks in the
[start contributing](/docs/contribute/start/) topic and are ready to
learn about more ways to contribute.
-->
本文假定你已经阅读并掌握了[开始贡献](/docs/contribute/start/)中介绍的内容，想要了解更多关于贡献的内容。


{{< note >}}
<!--
Some tasks require you to use the Git command line client and other tools.
-->
有些任务需要使用 Git 命令行客户端和其他工具。
{{< /note >}}



<!-- body -->

<!--
Now that you've gotten your feet wet and helped out with the Kubernetes docs in
the ways outlined in the [start contributing](/docs/contribute/start/) topic,
you may feel ready to do more. These tasks assume that you have, or are willing
to gain, deeper knowledge of the following topic areas:
-->
现在，您已经熟悉了 Kubernetes 文档，并按照[开始贡献](/docs/contribute/start/)文章中介绍的方式进行了贡献，您可能已经准备好做更多的工作。这些任务假设您已经或愿意获得以下主题领域的更深入的知识:

<!--
- Kubernetes concepts
- Kubernetes documentation workflows
- Where and how to find information about upcoming Kubernetes features
- Strong research skills in general
-->
- Kubernetes 概念
- Kubernetes 文档工作流程
- 在哪里和如何找到即将推出的 Kubernetes 功能的信息
- 较强的研究能力

<!--
These tasks are not as sequential as the beginner tasks. There is no expectation
that one person does all of them all of the time.
-->
这些任务不像初学者的任务那样是顺序的。没有人期望一个人会一直做所有的事情。

## 评审 pull request

<!--
In any given week, a specific docs approver volunteers to do initial triage
and review of [pull requests and issues](#triage-and-categorize-issues). This
person is the "PR Wrangler" for the week. The schedule is maintained using the
[PR Wrangler scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers).
To be added to this list, attend the weekly SIG Docs meeting and volunteer. Even
if you are not on the schedule for the current week, you can still review pull
requests (PRs) that are not already under active review.
-->
通常，每周都会有一个特定的文档审核志愿者对 [pull requests 和 issues](#triage-and-categorize-issues) 进行分类和审核。这个人就是本周的 “PR 轮流负责人”。排班计划在 [PR 轮流负责人排班](https://github.com/kubernetes/website/wiki/PR-Wranglers) 中维护。
如果想要加入排班计划，需要参加每周的 SIG Docs 会议并志愿申请。
尽管你不在本周的排班计划中，你也可以审核那些还未开始检视的 PR。

<!--
In addition to the rotation, an automated system comments on each new PR and
suggests reviewers and approvers for the PR, based on the list of approvers and
reviewers in the affected files. The PR author is expected to follow the
guidance of the bot, and this also helps PRs to get reviewed quickly.
-->
除了轮换之外，自动化系统（机器人）会根据修改的文件自动推荐相应的 approver 和 reviewer。
PR 作者应该遵循机器人的指导，这也有助于 PR 得到快速审查。

<!--
We want to get pull requests (PRs) merged and published as quickly as possible.
To ensure the docs are accurate and up to date, each PR needs to be reviewed by
people who understand the content, as well as people with experience writing
great documentation.
-->
我们希望尽快合并和发布 pull requests。
为了确保文档是准确的和最新的，每个 PR 都需要由理解内容的人以及具有编写优秀文档经验的人来评审。

<!--
Reviewers and approvers need to provide actionable and constructive feedback to
keep contributors engaged and help them to improve. Sometimes helping a new
contributor get their PR ready to merge takes more time than just rewriting it
yourself, but the project is better in the long term when we have a diversity of
active participants.
-->
评审人员和批准人员需要提供可操作的和建设性的反馈，以保持贡献者的参与并帮助他们改进。
有时候，帮助一个新的贡献者把他们的 PR 准备好合并比你自己重写它需要更多的时间，
但是从长远来看，当我们有不同的积极参与者时，这个项目会更好。

<!--
Before you start reviewing PRs, make sure you are familiar with the
[Documentation Content Guide](/docs/contribute/style/content-guide/), the 
[Documentation Style Guide](/docs/contribute/style/style-guide/),
and the [code of conduct](/community/code-of-conduct/).
-->
在开始评审 PR 之前，请确保熟悉[文档内容指南](/docs/contribute/style/content-guide/)、[文档风格指南](/docs/contribute/style/style-guide/)、[行为准则](/community/code-of-conduct/)。

<!--
### Find a PR to review
-->
### 找一个 PR 来评审

<!--
To see all open PRs, go to the **Pull Requests** tab in the GitHub repository.
A PR is eligible for review when it meets all of the following criteria:
-->
要查看所有打开的 PR，请转到 GitHub 仓库中的**Pull Requests**选项卡。
当符合以下所有条件时，PR 才有资格进行评审：

<!--
- Has the `cncf-cla:yes` tag
- Does not have WIP in the description
- Does not a have tag including the phrase `do-not-merge`
- Has no merge conflicts
- Is based against the correct branch (usually `master` unless the PR relates to
  a feature that has not yet been released)
- Is not being actively reviewed by another docs person (other technical
  reviewers are fine), unless that person has explicitly asked for your help. In
  particular, leaving lots of new comments after other review cycles have
  already been completed on a PR can be discouraging and counter-productive.
-->
- 拥有 `cncf-cla:yes` 标签
- 描述中没有 WIP
- 没有包含 `do-not-merge` 字样的标签
- 没有合并冲突
- 基于正确的分支(通常为 “master”，除非 PR 与某个未发布的功能相关)
- 没有被其他文档人员（或其他技术领域的评审人）评审，除非你被显式的请求参与评审。
  需要说明的是，如果其他评审已经结束的情况下，你再留下很多新的意见，会让人感到沮丧，这适得其反。

<!--
If a PR is not eligible to merge, leave a comment to let the author know about
the problem and offer to help them fix it. If they've been informed and have not
fixed the problem in several weeks or months, eventually their PR will be closed
without merging.
-->
如果 PR 不符合合并的条件，请留下评论，让作者知道问题所在，并帮助他们解决问题。
如果他们被告知并在几周或几个月内没有解决问题，最终他们的 PR 将被关闭而不会合并。

<!--
If you're new to reviewing, or you don't have a lot of bandwidth, look for PRs
with the `size/XS` or `size/S` tag set. The size is automatically determined by
the number of lines the PR changes.
-->
如果您是新手，或者您没有太多的带宽，请寻找具有 `size/XS` 或 `size/S` 标记集的 PR。
大小由 PR 更改的行数自动设置。

#### Reviewers and approvers

<!--
The Kubernetes website repo operates differently than some of the Kubernetes
code repositories when it comes to the roles of reviewers and approvers. For
more information about the responsibilities of reviewers and approvers, see
[Participating](/docs/contribute/participating/). Here's an overview.
-->
Kubernetes 网站仓库与 Kubernetes 的一些代码仓库在涉及审核者和审批者角色时的操作方式不同。
有关评审人员和批准人员职责的更多信息，请参见[参与](/docs/contribute/participating/)。
这里只做一个概述。

<!--
- A reviewer reviews pull request content for technical accuracy. A reviewer
  indicates that a PR is technically accurate by leaving a `/lgtm` comment on
  the PR.

    {{< note >}}Don't add a `/lgtm` unless you are confident in the technical
    accuracy of the documentation modified or introduced in the PR.{{< /note >}}

- An approver reviews pull request content for docs quality and adherence to
  SIG Docs guidelines, such as the
  [style guide](/docs/contribute/style/style-guide). Only people listed as
  approvers in the
  [`OWNERS`](https://github.com/kubernetes/website/blob/master/OWNERS) file can
  approve a PR. To approve a PR, leave an `/approve` comment on the PR.
-->
- 当评审人员以评审 PR 的技术准确性时，评审人员发表一个 `/lgtm` 评论表示技术上是无误的。

    {{< note >}}如果你对技术准确性不确信，不要在涉及文档修改的 PR 中回复 `/lgtm`。  {{< /note >}}
    
- 批准者审核有关文档修改的内容时，注重质量和相关规范（比如[风格规范](/docs/contribute/style/style-guide)）。
  只有在 [`OWNERS`](https://github.com/kubernetes/website/blob/master/OWNERS) 文件中列出的
  人才可以批准 PR。批准 PR 时，需要回复一个 `/approve` 评论。

<!--
A PR is merged when it has both a `/lgtm` comment from anyone in the Kubernetes
organization and an `/approve` comment from an approver in the
`sig-docs-maintainers` group, as long as it is not on hold and the PR author
has signed the CLA.
-->
如果 PR 拥有来自 Kubernetes 社区的任何人的 `/lgtm` 评论和来自 `sig-docs-maintainers` 组的 `/approve` 评论，只要它没有被 hold 并且作者已签署了 CLA，PR 就会被合并。

{{< note >}}
<!-- 
The ["Participating"](/docs/contribute/participating/#approvers) section contains more information for reviewers and approvers, including specific responsibilities for approvers. -->
["参与"](/docs/contribute/participating/#approvers)部分包含有关 reviewers 和 approvers 的更多信息，包括 approvers 的具体职责。
{{< /note >}}

<!--
### Review a PR
-->
### 审核 PR

<!--   
1.  Read the PR description and read any attached issues or links, if
    applicable. "Drive-by reviewing" is sometimes more harmful than helpful, so
    make sure you have the right knowledge to provide a meaningful review.

2.  If someone else is the best person to review this particular PR, let them
    know by adding a comment with `/assign @<github-username>`. If you have
    asked a non-docs person for technical review but still want to review the PR
    from a docs point of view, keep going.    

3.  Go to the **Files changed** tab. Look over all the changed lines. Removed
    content has a red background, and those lines also start with a `-` symbol.
    Added content has a green background, and those lines also start with a `+`
    symbol. Within a line, the actual modified content has a slightly darker
    green background than the rest of the line.

      - Especially if the PR uses tricky formatting or changes CSS, Javascript,
        or other site-wide elements, you can preview the website with the PR
        applied. Go to the **Conversation** tab and click the **Details** link
        for the `deploy/netlify` test, near the bottom of the page. It opens in
        the same browser window by default, so open it in a new window so you
        don't lose your partial review. Switch back to the **Files changed** tab
        to resume your review.
      - Make sure the PR complies with the
        [Documentation Style Guide](/docs/contribute/style/style-guide/)
        and link the author to the relevant part of the style guide if not.
      - If you have a question, comment, or other feedback about a given
        change, hover over a line and click the blue-and-white `+` symbol that
        appears. Type your comment and click **Start a review**.
      - If you have more comments, leave them in the same way.
      - By convention, if you see a small problem that does not have to do with
        the main purpose of the PR, such as a typo or whitespace error, you can
        call it out, prefixing your comment with `nit:` so that the author knows
        you consider it trivial. They should still address it.
      - When you've reviewed everything, or if you didn't have any comments, go
        back to the top of the page and click **Review changes**. Choose either
        **Comment** or **Request Changes**. Add a summary of your review, and
        add appropriate
        [Prow commands](https://prow.k8s.io/command-help) to separate lines in
        the Review Summary field. SIG Docs follows the
        [Kubernetes code review process](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process).
        All of your comments will be sent to the PR author in a single
        notification.

          - If you think the PR is ready to be merged, add the text `/approve` to
            your summary.
          - If the PR does not need additional technical review, add the
            text `/lgtm` as well.
          - If the PR *does* need additional technical review, add the text
            `/assign` with the GitHub username of the person who needs to
            provide technical review. Look at the `reviewers` field in the
            front-matter at the top of a given Markdown file to see who can
            provide technical review.
          - To prevent the PR from being merged, add `/hold`. This sets the
            label `do-not-merge/hold`.
          - If a PR has no conflicts and has the `lgtm` and `approve` label but
            no `hold` label, it is merged automatically.
          - If a PR has the `lgtm` and/or `approve` labels and new changes are
            detected, these labels are removed automatically.

            See
            [the list of all available slash commands](https://prow.k8s.io/command-help)
            that can be used in PRs.

    - If you previously selected **Request changes** and the PR author has
      addressed your concerns, you can change your review status either in the
      **Files changed** tab or at the bottom of the **Conversation** tab. Be
      sure to add the `/approve` tag and assign technical reviewers if necessary,
      so that the PR can be merged.
-->

   
1.  阅读 PR 描述，并阅读任何附加的 issues 或链接，如果有的话。
    “快速评审”有时弊大于利，所以确保你有正确的知识来提供有意义的评审。

2.  如果其他人是审核这个 PR 的最佳人选，请通过添加 `/assign @<github-username>` 的评论让他们知道。
    如果你要求一个非文档人员进行技术评审，但仍然想从文档的角度来评审 PR，那就继续吧。    

3.  转到 **Files changed** 选项卡。查看所有的修改行。删除的内容具有红色背景，这些行也以 `-` 符号开头。
    添加的内容具有绿色背景，这些行也以 `+` 符号开始。在一行中，实际修改的内容的背景颜色比该行的其余部分略深一些。

      - 特别是如果 PR 使用复杂的格式或更改 CSS、Javascript 或其他站点范围内的元素，您可以使用 PR 预览网站。
        转到 **Conversation** 选项卡，单击页面底部附近的 `deploy/netlify` 测试的 **Details** 链接。
        默认情况下，它会在同一个浏览器窗口中打开，所以在一个新窗口中打开它，这样你就不会丢失你的部分评论。
        切换回 **Files changed** 选项卡以继续您的审阅。
      - 确保 PR 符合文档[风格指南](/docs/contribute/style/style-guide/)，
        如果不符合，请将作者链接到风格指南的相关部分。
      - 如果您对给定的更改有疑问、评论或其他反馈，请将鼠标悬停在一行上，然后单击出现的蓝白相间的 `+` 号。
        键入您的评论并单击 **Start a review**。
        
      - 如果你有更多的评论，请以同样的方式留下评论。
      - 按照惯例，如果您看到一个与 PR 的主要目的无关的小问题，比如一个打印错误或空格错误，
        您可以将它指出来，并在注释前加上 nit: 以便作者知道您认为它是无关紧要的。
        他们仍然应该解决这个问题。
      - 当您查看完所有内容，或者没有任何评论时，回到页面顶部并单击 **Review changes**。
        选择**Comment** 或**Request Changes**。添加评审摘要，
        并在评审摘要字段中另起一行添加适当的 [Prow 命令](https://prow.k8s.io/command-help)。
        SIG Docs 遵循 [Kubernetes 代码审查流程](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)。
        您所有的意见将在一个单一的评论中发送给 PR 作者。

          - 如果您认为 PR 已经准备好合并，请将文本 `/approve` 添加到摘要中。
          - 如果 PR 不需要额外的技术审查，也可以同时添加文本 `/lgtm` 。
          - 如果 PR *确实* 需要额外的技术审查，使用 `/assign` + GitHub 用户名添加需要提供技术审查的人。
            查看上面出现的 Markdown 文件中的`reviewers`字段，看看谁可以提供技术审阅。
          - 如果需要阻止 PR 被合并，加上 `/hold` ，就会设置 `do-not-merge/hold` 标签。
          - 如果 PR 没有冲突、有 `lgtm` 和 `approve` 标签且没有 `hold` 标签，它就会自动合并。 
          - 如果 PR 拥有 `lgtm` 和 `approve` 后再有新的变更，那么这些标签会自动清除。

            PR 中可能用到的命令，参阅
            [斜线命令列表](https://prow.k8s.io/command-help)。

    - 如果您以前选择了**Request changes** ，并且 PR 作者已经处理了您的关注点，
      那么您可以在**Files changed** 选项卡或 **Conversation** 选项卡底部更改您的审阅状态。
      确保添加 `/approve` 标签，并在必要时指派技术审阅人员，以便合并 PR。

<!--
### Commit into another person's PR
-->
### 提交到别人的 PR

<!--
Leaving PR comments is helpful, but there may be times when you need to commit
into another person's PR, rather than just leaving a review.
-->
留下评论是有帮助的，但有时你需要把自己的想法融入到其他人的 PR 中，而不仅仅是留下评论。

<!--
Resist the urge to "take over" for another person unless they explicitly ask
you to, or you want to resurrect a long-abandoned PR. While it may be faster
in the short term, it deprives the person of the chance to contribute.
-->
除非对方明确要求你“接手”，或者你想重新建立一个长期被抛弃的 PR，否则不要急于“接手”。
虽然短期内这样做可能更快，但会剥夺这个人做出贡献的机会。

<!--
The process you use depends on whether you need to edit a file that is already
in the scope of the PR or a file that the PR has not yet touched.
-->
您的做法（接手）取决于您是需要编辑已经在 PR 范围内的文件，还是 PR 尚未触及的文件。

<!--
You can't commit into someone else's PR if either of the following things is
true:
-->
如果以下任何一件事是符合的，你就不能提交到某人的 PR:

<!--
- If the PR author pushed their branch directly to the
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  repository, only a reviewer with push access can commit into their PR.
  Authors should be encouraged to push their branch to their fork before
  opening the PR.
- If the PR author explicitly disallowed edits from approvers, you can't
  commit into their PR unless they change this setting.
-->
- 如果 PR 作者将他们的分支直接推入 [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/) 仓库，那么只有具有 push 访问权限的审阅者才能提交到他们的 PR 中。
- 如果 PR 作者明确禁止审批者进行编辑，那么除非他们更改此设置，否则您无法提交到他们的 PR 中。

<!--
#### If the file is already changed by the PR
-->
#### 文件已在 PR 中修改

<!--
This method uses the GitHub UI. If you prefer, you can use the command line
even if the file you want to change is part of the PR, if you are more
comfortable working that way.
-->
这个方法使用 GitHub UI。如果您愿意，您可以使用命令行，即使您想更改的文件是 PR 的一部分，如果您更愿意这样工作的话。

<!--
1.  Click the **Files changed** tab.
2.  Scroll down to the file you want to edit, and click the pencil icon for
    that file.
3.  Make your changes, add a commit message in the field below the editor, and
    click **Commit changes**.
-->
    
1.  点击 **Files changed** 选项卡。
2.  向下找到你想要编辑的文件，点击铅笔图标。
3.  修改并在下面添加提交记录，点击 **Commit changes**。

<!--
Your commit is now pushed to the branch the PR represents (probably on the
author's fork) and now shows up in the PR and your changes are reflected in
the **Files changed** tab. Leave a comment letting the PR author know you
changed the PR.
-->
您的提交现在被推送到 PR 对应的分支(可能在作者的分支上)，
在 PR 中，您的更改反映在 **Files changed** 选项卡中。
留下评论，让 PR 作者知道你修改了 PR。

<!--
If the author is using the command line rather than the GitHub UI to work on
this PR, they need to fetch their fork's changes and rebase their local branch
on the branch in their fork, before doing additional work on the PR.
-->
如果作者使用命令行而不是 GitHub UI 来处理这个 PR，那么在处理 PR 之前，
他们需要获取 fork 的更改并将本地分支重新建立在 fork 中的分支上。

#### 如果文件没有被 PR 修改

<!--
If changes need to be made to a file that is not yet included in the PR, you
need to use the command line. You can always use this method, if you prefer it
to the GitHub UI.
-->
如果需要更改尚未包含在 PR 中的文件，则需要使用命令行。
如果您喜欢使用这个方法而不喜欢使用 GitHub UI，那么您总是可以使用这个方法。


1.  <!--
    Get the URL for the author's fork. You can find it near the bottom of the
    **Conversation** tab. Look for the text **Add more commits by pushing to**.
    The first link after this phrase is to the branch, and the second link is
    to the fork. Copy the second link. Note the name of the branch for later.
    -->
    获取作者的 fork 的 URL。你可以在**Conversation** 标签的底部找到它。
    查找文本 **Add more commits by pushing to** 。
    这个短语后面的第一个链接是到分支的，第二个链接是到 fork 的。
    复制第二个链接。稍后会用到分支的名称。

2.  <!--
    Add the fork as a remote. In your terminal, go to your clone of the
    repository. Decide on a name to give the remote (such as the author's
    GitHub username), and add the remote using the following syntax:
    -->
    要给远程设置一个名称(比如作者的 GitHub 用户名)，然后使用以下语法添加远程：
    
      ```
      git remote add <name> <url-of-fork>
      ```
      
3.  <!--
    Fetch the remote. This doesn't change any local files, but updates your
    clone's notion of the remote's objects (such as branches and tags) and
    their current state.
    -->
    获取远程。这不会更改任何本地文件，但会更新克隆的远程对象的概念(如分支和标记)及其当前状态。
          
      ```
      git remote fetch <name>
      ```

4.  <!--
    Check out the remote branch. This command will fail if you already have a
    local branch with the same name.
    -->
    拉取远程分支。如果已经有同名的本地分支，则此命令将失败。
    
    ```
    git checkout <branch-from-PR>
    ```

5.  <!--
    Make your changes, use `git add` to add them, and commit them.
    -->
    进行更改，使用 `git add` 添加更改，然后提交更改。

6.  <!--
    Push your changes to the author's remote.
    -->
    将您的更改推到作者的远程。

      ```
      git push <remote-name> <branch-name>
      ```

7.  <!--
    Go back to the GitHub IU and refresh the PR. Your changes appear. Leave the
    PR author a comment letting them know you changed the PR.
    -->
    回到 GitHub UI 并刷新 PR。给 PR 作者留言，让他们知道你修改了 PR。

<!--
If the author is using the command line rather than the GitHub UI to work on
this PR, they need to fetch their fork's changes and rebase their local branch
on the branch in their fork, before doing additional work on the PR.
-->
如果作者使用命令行而不是 GitHub UI 来处理这个 PR，那么在处理 PR 之前，
他们需要获取 fork 的更改并将本地分支重新建立在 fork 中的分支上。

<!--
## Work from a local clone
-->
## 使用本地克隆

<!--
For changes that require multiple files or changes that involve creating new
files or moving files around, working from a local Git clone makes more sense
than relying on the GitHub UI. These instructions use the `git` command and
assume that you have it installed locally. You can adapt them to use a local
graphical Git client instead.
-->
对于需要多个文件的更改，或者涉及创建新文件或移动文件的更改，
使用本地 Git 克隆比依赖 GitHub UI 更有意义。
这些指令使用 git 命令，并假设您已经在本地安装了它。
您可以将它们调整为使用本地图形化 Git 客户机。

<!--
### Clone the repository
-->
### 克隆仓库

<!--
You only need to clone the repository once per physical system where you work
on the Kubernetes documentation.
-->
对于处理 Kubernetes 文档的每个物理机，只需要克隆存储库一次。

<!--
1.  In a terminal window, use `git clone` to clone the repository. You do not
    need any credentials to clone the repository.

      ```
      git clone https://github.com/kubernetes/website
      ```

      The new directory `website` is created in your current directory, with
      the contents of the GitHub repository.

2.  Change to the new `website` directory. Rename the default `origin` remote
    to `upstream`.

      ```
      cd website

      git remote rename origin upstream
      ```

3.  If you have not done so, create a fork of the repository on GitHub. In your
    web browser, go to
    [https://github.com/kubernetes/website](https://github.com/kubernetes/website)
    and click the **Fork** button. After a few seconds, you are redirected to
    the URL for your fork, which is typically something like
    `https://github.com/<username>/website` unless you already had a repository
    called `website`. Copy this URL.

4.  Add your fork as a second remote, called `origin`:

      ```
      git remote add origin <FORK-URL>
      ```
-->

1.  在终端中使用 `git clone` 来克隆仓库。你不需要指定任何证书。

      ```
      git clone https://github.com/kubernetes/website
      ```
      新目录 `website` 会在当前目录中创建并包含该仓库的内容。

2.  进入 `website` 目录，将默认的 `origin` 重命名为远端 `upstream`。

      ```
      cd website

      git remote rename origin upstream
      ```

3.  如果还没有这样做，请在 GitHub 上创建存储库的分支。
    在您的 web 浏览器中，访问 [https://github.com/kubernetes/website](https://github.com/kubernetes/website)
    并单击 Fork 按钮。几秒钟后，您将被重定向到您的 fork 的 URL，它通常类似于 `https://github.com/<username>/website`，除非您已经有一个名为 `website` 的存储库。复制这个网址。

4.  在你的 fork 中增加另一个远端 `origin`:

      ```
      git remote add origin <FORK-URL>
      ```

<!--
### Work on the local repository
-->
### 使用本地仓库

<!--
Before you start a new unit of work on your local repository, you need to figure
out which branch to base your work on. The answer depends on what you are doing,
but the following guidelines apply:
-->
在本地存储库上启动新的工作单元之前，您需要确定将工作基于哪个分支。
答案取决于你在做什么，但是下面的指导方针是适用的：

<!--
- For general improvements to existing content, start from `master`.
- For new content that is about features that already exist in a released
  version of Kubernetes, start from `master`.
- For long-running efforts that multiple SIG Docs contributors will collaborate on,
  such as content reorganization, use a specific feature branch created for that
  effort.
- For new content that relates to upcoming but unreleased Kubernetes versions,
  use the pre-release feature branch created for that Kubernetes version.
-->
- 对于现有内容的一般改进，可以从 `master` 开始。
- 对于关于 Kubernetes 发布版本中已经存在的特性的新内容，请从 `master` 开始。
- 对于多个 SIG Docs 贡献者将协作的长期工作，例如内容重组，使用为该工作创建的特定功能分支。
- 对于与即将发布但尚未发布的 Kubernetes 版本相关的新内容，请使用为该 Kubernetes 版本创建的预发布特性分支。

<!--
For more guidance, see
[Choose which branch to use](/docs/contribute/start/#choose-which-git-branch-to-use).
-->
更多指导，请参考[选择分支](/docs/contribute/start/#choose-which-git-branch-to-use)。

<!--
After you decide which branch to start your work (or _base it on_, in Git
terminology), use the following workflow to be sure your work is based on the
most up-to-date version of that branch.
-->
在您决定要使用哪个分支之后(或者用 Git 术语来说，基于它)，
使用以下工作流来确保您的工作基于该分支的最新版本。


1.  <!--
    Fetch both the `upstream` and `origin` remotes. This updates your local
    notion of what those branches contain, but does not change your local
    branches at all.
    -->
    拉取 `upstream` 和 `origin` 远端。
    这将更新您对这些分支所包含内容的本地概念，但不会更改您的本地分支。

      ```
      git fetch upstream
      git fetch origin
      ```

2.  <!--
    Create a new tracking branch based on the branch you decided is the most
    appropriate. This example assumes you are using `master`.
    -->
    基于你选择的分支创建一个新的跟踪分支。以你使用 master 为例：

      ```
      git checkout -b <my_new_branch> upstream/master
      ```

      <!--
      This new branch is based on `upstream/master`, not your local `master`.
      It tracks `upstream/master`.
      -->
      新分支基于 `upstream/master`, 而不是你本地的 `master`。它跟踪 `upstream/master`。

3.  <!--With your new branch checked out, make your changes using a text editor.
    At any time, use the `git status` command to see what you've changed.
    -->  
    在检出的分支上使用编辑器修改。
    你可以随时使用 `git status` 命令来查看你的更改。

        
4.  <!--
    When you are ready to submit a pull request, commit your changes. First
    use `git status` to see what changes need to be added to the changeset.
    There are two important sections: `Changes staged for commit` and
    `Changes not staged for commit`. Any files that show up in the latter
    section under `modified` or `untracked` need to be added if you want them to
    be part of this commit. For each file that needs to be added, use `git add`.
    -->
    当您准备提交 pull request 时，提交您的更改。
    首先使用 git status 查看需要向变更集中添加哪些更改。
    有两个重要的部分：`Changes staged for commit` 和 `Changes not staged for commit`。
    如果您希望将后一节中显示的 `modified` 或 `untracked` 文件添加到提交中，你需要使用 `git add`。

      ```
      git add example-file.md
      ```

      <!--
      When all your intended changes are included, create a commit, using the
      `git commit` command:
      -->
      当所有文件准备好时，使用 `git commit` 命令提交：

      ```
      git commit -m "Your commit message"
      ```

{{< note >}}
<!--
Do not reference a GitHub issue or pull request by ID or URL in the
commit message. If you do, it will cause that issue or pull request to get
a notification every time the commit shows up in a new Git branch. You can
link issues and pull requests together later, in the GitHub UI.
-->
不要在提交消息中引用 GitHub issue 或 PR(通过 ID 或 URL)。如果您这样做了，那么每当提交出现在新的 Git 分支中时，就会导致该 issue 或 PR 获得通知。稍后，您可以在 GitHub UI 中链接 issues 并将请求拉到一起。
{{< /note >}}

5.  <!--
    Optionally, you can test your change by staging the site locally using the
    `hugo` command. See [View your changes locally](#view-your-changes-locally).
    You'll be able to view your changes after you submit the pull request, as
    well.
    -->
    您还可以选择使用 hugo 命令在本地暂存站点来测试您的更改。参阅[本地查看更改](#本地查看更改)。您还可以在提交 PR 后查看更改。

6.  <!--
    Before you can create a pull request which includes your local commit, you
    need to push the branch to your fork, which is the endpoint for the `origin`
    remote.
    -->
    在创建包含本地提交的 PR 之前，需要将分支推到 fork，也就是 `origin` 端点。

      ```
      git push origin <my_new_branch>
      ```
      <!--
      Technically, you can omit the branch name from the `push` command, but
      the behavior in that case depends upon the version of Git you are using.
      The results are more repeatable if you include the branch name.
      -->
      从技术上讲，您可以从 push 命令中省略分支名称，但是这种情况下的行为取决于您使用的 Git 版本。
      如果包含分支名称，结果将更加可重复。


7.  <!--
    At this point, if you go to https://github.com/kubernetes/website in your
    web browser, GitHub detects that you pushed a new branch to your fork and
    offers to create a pull request. Fill in the pull request template.
    -->
    此时，如果您在 web 浏览器中访问 https://github.com/kubernetes/website, GitHub 会检测到您将一个新的分支推送到您的 fork，并提供创建一个 pull 请求。填写 pull request 模板。

      - <!--The title should be no more than 50 characters and summarize the intent
        of the change.-->标题不应超过 50 个字符，并总结更改的意图。
      - <!--
        The long-form description should contain more information about the fix,
        including a line like `Fixes #12345` if the pull request fixes a GitHub
        issue. This will cause the issue to be closed automatically when the
        pull request is merged.
        -->
        长表单描述应该包含关于修复的更多信息，如果 PR 修复了 GitHub issue，
        则应该包含类似 `Fixes #12345` 这样的行。
        这将导致在合并 PR 时自动关闭该 issue。
      - <!--
        You can add labels or other metadata and assign reviewers. See
        [Triage and categorize issues](#triage-and-categorize-issues) for the
        syntax.
        -->
        您可以添加标签或其他元数据并分配审阅人员。有关语法，请参见[分类 issues](#triage-and-categorize-issues)。

      <!--Click **Create pull request**.--> 点击 **Create pull request**

8.  <!--Several automated tests will run against the state of the website with your
    changes applied. If any of the tests fail, click the **Details** link for
    more information. If the Netlify test completes successfully, its
    **Details** link goes to a staged version of the Kubernetes website with
    your changes applied. This is how reviewers will check your changes.-->
    几个自动化测试将运行与您所应用的更改的网站状态。
    如果任何测试失败，请单击**Details**链接获取更多信息。
    如果 Netlify 测试成功完成，它的**Details**链接将转到 Kubernetes 网站的阶段性版本，
    其中应用了您的更改。
    这是审阅人员检查更改的方式。

9.  <!--If you notice that more changes need to be made, or if reviewers give you
    feedback, address the feedback locally, then repeat step 4 - 6 again,
    creating a new commit. The new commit is added to your pull request and the
    tests run again, including re-staging the Netlify staged site.-->
    如果您注意到需要进行更多的更改，或者评审人员给了您反馈，请在本地处理反馈，
    然后再次重复步骤 4 - 6，创建一个新的提交。新的提交被添加到您的 pull 请求中，
    测试再次运行，包括 Netlify。

10. <!--If a reviewer adds changes to your pull request, you need to fetch those
    changes from your fork before you can add more changes. Use the following
    commands to do this, assuming that your branch is currently checked out.-->
    如果审查员将更改添加到您的 pull 请求中，您需要从 fork 获取这些更改，然后才能添加更多的更改。
    假设您的分支当前已签出，请使用以下命令来完成此操作。

      ```
      git fetch origin
      git rebase origin/<your-branch-name>
      ```

      <!--After rebasing, you need to add the `-f` flag to force-push new changes to
      the branch to your fork.-->在 rebasing 之后，您需要添加 `-f` 标志来强制推送分支。

      ```
      git push -f origin <your-branch-name>
      ```

11. <!--If someone else's change is merged into the branch your work is based on,
    and you have made changes to the same parts of the same files, a conflict
    might occur. If the pull request shows that there are conflicts to resolve,
    you can resolve them using the GitHub UI or you can resolve them locally.-->
    如果其他人的更改合并到您工作所基于的分支中，并且您对相同文件的相同部分进行了更改，
    则可能会发生冲突。如果 pull 请求显示有需要解决的冲突，您可以使用 GitHub UI 解决它们，
    或者在本地解决它们。

      <!--First, do step 10 to be sure that your fork and your local branch are in
      the same state.-->首先执行第 10 步，确保你的 fork 仓库与你本地分支一致。

      <!--Next, fetch `upstream` and rebase your branch on the branch it was
      originally based on, like `upstream/master`.-->
      接着，拉取 `upstream` 并 rebase 你的分支。 

      ```
      git fetch upstream
      git rebase upstream/master
      ```

      <!--If there are conflicts Git can't automatically resolve, you can see the
      conflicted files using the `git status` command. For each conflicted file,
      edit it and look for the conflict markers `>>>`, `<<<`, and `===`. Resolve
      the conflict and remove the conflict markers. Then add the changes to the
      changeset using `git add <filename>` and continue the rebase using
      `git rebase --continue`. When all commits have been applied and there are
      no more conflicts, `git status` will show that you are not in a rebase and
      there are no changes that need to be committed. At that point, force-push
      the branch to your fork, and the pull request should no longer show any
      conflicts.-->
      如果存在 Git 无法自动解决的冲突，可以使用 `git status` 命令查看冲突文件。
      对于每个冲突文件，编辑它并查找冲突标记 `>>>`，`<<<`，and `===`。
      解决冲突并删除冲突标记。然后使用 `git add <filename>`，
      并使用 `git rebase --continue` 继续将更改添加到更改集中。
      当所有提交都已应用，并且没有更多冲突时，`git status` 将显示您不在 rebase 中，
      并且不需要提交任何更改。此时，强制将分支推到 fork, pull 请求应该不再显示任何冲突。

<!--
If you're having trouble resolving conflicts or you get stuck with
anything else related to your pull request, ask for help on the `#sig-docs`
Slack channel or the
[kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
-->
如果您在解决冲突方面遇到困难，或者您被与 pull 请求相关的任何其他事情卡住，
请在 `#sig-docs` Slack 通道或 [kubernet-sig-docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs) 中寻求帮助。

<!--
### View your changes locally
-->
### 本地查看更改

<!--
If you aren't ready to create a pull request but you want to see what your
changes look like, you can build and run a docker image to generate all the documentation and 
serve it locally.
-->
如果您还没有准备好创建一个 pull 请求，
但是您希望看到您的更改是什么样子的，
那么您可以构建并运行一个 docker 映像来生成所有文档并在本地提供它。

<!--
1.  Build the image locally:

      ```
      make docker-image
      ```

2.  Once the `kubernetes-hugo` image has been built locally, you can build and serve the site:

      ```
      make docker-serve
      ```

3.  In your browser's address bar, enter `localhost:1313`. Hugo will watch the
    filesystem for changes and rebuild the site as needed.

4.  To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`
    or just close the terminal window.

Alternatively, you can install and use the `hugo` command on your development machine:

1.  [Install Hugo](https://gohugo.io/getting-started/installing/) version {{< hugoVersion >}} or later.

2.  In a terminal, go to the root directory of your clone of the Kubernetes
    docs, and enter this command:

      ```
      hugo server
      ```

3.  In your browser’s address bar, enter `localhost:1313`.

4.  To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`
    or just close the terminal window.
-->
1.  本地构建镜像:

      ```
      make docker-image
      ```

2.  `kubernetes-hugo` 镜像构建完成后，可以构建并启动网站：

      ```
      make docker-serve
      ```

3.  在浏览器地址栏输入 `localhost:1313`。Hugo 将监视文件系统的更改，并根据需要重新构建站点。

4.  如果想停掉本地 Hugo 实例，只需要在命令行中输入 `Ctrl+C` 来关闭命令行窗口。

<!--
Alternatively, you can install and use the `hugo` command on your development machine:
-->
或者，您可以在您的开发机器上安装并使用 hugo 命令：

1.  <!--
    [Install Hugo](https://gohugo.io/getting-started/installing/) version {{< hugoVersion >}} or later.
    -->
    [安装 Hugo](https://gohugo.io/getting-started/installing/) 版本 {{< hugoVersion >}} 或更新版本.

2.  <!--
    In a terminal, go to the root directory of your clone of the Kubernetes
    docs, and enter this command:
    -->
    在终端中，转到您克隆的 Kubernetes 文档的根目录，并输入以下命令：

      ```
      hugo server
      ```

3.  <!--
    In your browser’s address bar, enter `localhost:1313`.
    -->
    在浏览器地址栏中输入 `localhost:1313`。

4.  <!--
    To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`
    or just close the terminal window.
    -->
    如果想停掉本地 Hugo 实例，只需要在命令行中输入 `Ctrl+C` 来关闭命令行窗口。

<!--
## Triage and categorize issues
-->
## issues 归类

<!--
In any given week, a specific docs approver volunteers to do initial
[triage and review of pull requests](#review-pull-requests) and issues. To get
on this list, attend the weekly SIG Docs meeting and volunteer. Even if you are
not on the schedule for the current week, you can still review PRs.
-->
在任何给定的一周内，一个特定的文档审批者会自愿对 pull 请求和 issues 进行初步分类和审查。
要进入这个名单，参加每周的团体文档会议和志愿者。
即使你不在这周的时间表上，你仍然可以审核 PR。

<!--
People in SIG Docs are responsible only for triaging and categorizing
documentation issues. General website issues are also filed in the
`kubernetes/website` repository.
-->
SIG 文档人员只负责对文档 issues 进行分类和分类。一般的网站 issues 也归档在 `kubernetes/website` 资源库中。

<!--
When you triage an issue, you:
-->
当你对一个 issue 进行分类时：

<!--
- Assess whether the issue has merit. Some issues can be closed quickly by
  answering a question or pointing the reporter to a resource.
- Ask the reporter for more information if the issue doesn't have enough
  detail to be actionable or the template is not filled out adequately.
- Add labels (sometimes called tags), projects, or milestones to the issue.
  Projects and milestones are not heavily used by the SIG Docs team.
- At your discretion, taking ownership of an issue and submitting a PR for it
  (especially if it is quick or relates to work you were already doing).
-->
- 评估这个 issue 是否有价值。有些 issues 可以通过回答问题或向作者指出资源来迅速解决。
- 如果 issue 没有足够的细节可以采取行动，或者模板没有填好，询问作者更多的信息。
- 向 issue 添加标签(有时称为标签)、项目或者里程碑。SIG 文档团队并没有大量使用项目和里程碑。
- 根据您的判断，对某个 issue 拥有所有权并为其提交 PR (特别是如果它是快速的或与您已经在做的工作相关的)。

<!--
If you have questions about triaging an issue, ask in `#sig-docs` on Slack or
the
[kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
-->
如果你针对 issue 分类有疑问，请在 Slack `#sig-docs` 频道或 [kubernetes-sig-docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs) 中询问。

<!--
### More about labels
-->
### 有关标签的更多信息

<!--
These guidelines are not set in stone and are subject to change.
-->
这些准则并非一成不变，可能会发生变化。

<!--
- An issue can have multiple labels.
- Some labels use slash notation for grouping, which can be thought of like
  "sub-labels". For instance, many `sig/` labels exist, such as `sig/cli` and
  `sig/api-machinery`.
- Some labels are automatically added based on metadata in the files involved
  in the issue, slash commands used in the comments of the issue, or
  information in the issue text.
- Some labels are manually added by the person triaging the issue (or the person
  reporting the issue, if they are a SIG Docs approvers).
  - `Actionable`: There seems to be enough information for the issue to be fixed
    or acted upon.
  - `good first issue`: Someone with limited Kubernetes or SIG Docs experience
    might be able to tackle this issue.
  - `kind/bug`, `kind/feature`, and `kind/documentation`: If the person who
    filed the issue did not fill out the template correctly, these labels may
    not be assigned automatically. A bug is a problem with existing content or
    functionality, and a feature is a request for new content or functionality.
    The `kind/documentation` label is not currently in use.
  - Priority labels: define the relative severity of the issue, as outlined in the
    [Kubernetes contributor guide](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority).
- To add a label, leave a comment like `/label <label-to-add>`. The label must
  already exist. If you try to add a label that does not exist, the command is
  silently ignored.
-->
- 一个 issue 可以有多个标签。
- 一些标签使用斜杠符号进行分组，可以将其视为“子标签”。例如，`sig/` 存在许多标签，例如 `sig/cli` 和 `sig/api-machinery`。
- 系统会根据 issue 所涉及文件中的元数据，issue 注释中使用的斜杠命令或 issue 文本中的信息，自动添加一些标签。
- 由负责 issue 分类的人员（或报告 issue 的人员，如果他们是 SIG 文档批准者）手动添加一些标签。
  - `Actionable`：似乎有足够的信息可以解决或解决此 issue。
  - `good first issue`： Kubernetes 或 SIG Docs 经验有限的人也有可能可以解决此 issue。
  - `kind/bug`、`kind/feature`、`kind/documentation`：
    如果提出 issue 的人未正确填写模板，则可能不会自动分配这些标签。
    错误是现有内容或功能的 issue，功能是对新内容或功能的请求。`kind/documentation` 标签当前未使用。
  - 优先级标签：定义 issue 的相对严重性。
    如 [Kubernetes 贡献者指导](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority) 中所述。
- 要添加标签，添加 `/label <label-to-add>`。标签必须已经存在。
  如果您尝试添加不存在的标签，该命令将被默认忽略。

<!--
### Handling special issue types
-->
### 处理特殊 issue 类型

<!--
We encounter the following types of issues often enough to document how to handle them.
-->
我们经常遇到以下类型的 issues，足以记录如何处理它们。

<!--
#### Duplicate issues
-->
#### 重复的 issues

<!--
If a single problem has one or more issues open for it, the problem should be
consolidated into a single issue. You should decide which issue to keep open (or
open a new issue), port over all relevant information, link related issues, and
close all the other issues that describe the same problem. Only having a single
issue to work on will help reduce confusion and avoid duplicating work on the
same problem.
-->
如果单个问题可以解决一个或多个 issues，则应将该问题合并为一个 issue。
您应该决定哪个 issue 保持打开状态（或打开一个新 issue），移植所有相关信息，链接相关 issues，
并关闭描述同一 issue 的所有其他 issues。只处理一个 issue 将有助于减少混乱并避免重复处理同一问题。

<!--
#### Dead link issues
-->
#### 无效链接 issues

<!--
Depending on where the dead link is reported, different actions are required to
resolve the issue. Dead links in the API and Kubectl docs are automation issues
and should be assigned `/priority critical-urgent` until the problem can be fully understood. All other dead links are issues that need to be manually fixed and can be assigned `/priority important-longterm`.
-->
根据报告无效链接的位置，需要采取不同的措施来解决此 issue。
API 和 Kubectl 文档中的无效链接是自动化 issues，应分配为 `/priority critical-urgent`，
直到可以完全解决该问题为止。所有其他无效链接都是需要手动修复的 issues，
可以将其分配为 `/priority important-longterm`。

<!--
#### Blog issues
-->
#### 博客 issues

<!--
[Kubernetes Blog](https://kubernetes.io/blog/) entries are expected to become
outdated over time, so we maintain only blog entries that are less than one year old. 
If an issue is related to a blog entry that is more than one year old, it should be closed
without fixing. 
-->
随着时间的流逝，Kubernetes 博客条目预计会过时，
因此我们仅保留不到一年的博客条目。
如果某个 issue 与存在超过一年的博客条目有关，则应将其关闭而不进行修复。

<!--
#### Support requests or code bug reports
-->
#### 支持请求或代码错误报告

<!--
Some issues opened for docs are instead issues with the underlying code, or
requests for assistance when something (like a tutorial) didn’t work. For issues
unrelated to docs, close the issue with a comment directing the requester to
support venues (Slack, Stack Overflow) and, if relevant, where to file an issue
for bugs with features (kubernetes/kubernetes is a great place to start).
-->
相反，为文档带来的一些 issues 是底层代码的 issues，
或者在某些内容（例如教程）不起作用时请求帮助。
对于与文档无关的 issues，请关闭 issue 并指示请求者正确的支持场所（Slack，Stack Overflow），
并在适当的地方针对具有功能缺陷的问题提出 issue（可以从 kubernetes/kubernetes 开始）。

<!--
Sample response to a request for support:
-->
对支持请求的响应示例：

```none
This issue sounds more like a request for support and less
like an issue specifically for docs. I encourage you to bring
your question to the `#kubernetes-users` channel in
[Kubernetes slack](http://slack.k8s.io/). You can also search
resources like
[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
for answers to similar questions.

You can also open issues for Kubernetes functionality in
 https://github.com/kubernetes/kubernetes.

If this is a documentation issue, please re-open this issue.
```

<!--
Sample code bug report response:
-->
示例代码错误报告响应：

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

<!--
## Document new features
-->
## 记录新功能

<!--
Each major Kubernetes release includes new features, and many of them need
at least a small amount of documentation to show people how to use them.
-->
每个主要的 Kubernetes 版本都包含新功能，其中许多功能至少需要少量文档才能向人们展示如何使用它们。

<!--
Often, the SIG responsible for a feature submits draft documentation for the
feature as a pull request to the appropriate release branch of
`kubernetes/website` repository, and someone on the SIG Docs team provides
editorial feedback or edits the draft directly.
-->
通常，负责功能的 SIG 负责对 `kubernetes/website` 存储库的相应 release 分支发起 PR，
提交该功能的文档草稿，并且由 SIG Docs 团队中的某人提供编辑反馈或直接编辑草稿。

<!--
### Find out about upcoming features
-->
### 了解即将推出的功能

<!--
To find out about upcoming features, attend the weekly sig-release meeting (see
the [community](https://kubernetes.io/community/) page for upcoming meetings)
and monitor the release-specific documentation
in the [kubernetes/sig-release](https://github.com/kubernetes/sig-release/)
repository. Each release has a sub-directory under the [/sig-release/tree/master/releases/](https://github.com/kubernetes/sig-release/tree/master/releases)
directory. Each sub-directory contains a release schedule, a draft of the release
notes, and a document listing each person on the release team.
-->
要了解即将发布的功能，请参加每周一次的 sig-release 会议
（请参阅[社区](https://kubernetes.io/community/)页面以获取即将举行的会议，
并在 [kubernetes/sig-release](https://github.com/kubernetes/sig-release/) 存储库中留意特定于发行版的文档。
每个发行版在 [/sig-release/tree/master/releases/](https://github.com/kubernetes/sig-release/tree/master/releases)
 目录下都有一个子目录。每个子目录包含一个发布计划，一个发布说明草稿以及一个列出发布团队中每个人的文档。

<!--
- The release schedule contains links to all other documents, meetings,
  meeting minutes, and milestones relating to the release. It also contains
  information about the goals and timeline of the release, and any special
  processes in place for this release. Near the bottom of the document, several
  release-related terms are defined.

    This document also contains a link to the **Feature tracking sheet**, which is
    the official way to find out about all new features scheduled to go into the
    release.
- The release team document lists who is responsible for each release role. If
  it's not clear who to talk to about a specific feature or question you have,
  either attend the release meeting to ask your question, or contact the release
  lead so that they can redirect you.
- The release notes draft is a good place to find out a little more about
  specific features, changes, deprecations, and more about the release. The
  content is not finalized until late in the release cycle, so use caution.
-->
- 发布时间表包含与发布有关的所有其他文档、会议、会议记录和里程碑的链接。
  它还包含有关该发行版的目标和时间表的信息，以及此发行版的任何特殊流程。
  在文档底部附近，定义了几个与发布相关的术语。
  
    本文档还包含**Feature tracking sheet**的链接，这是查找排定要发布的所有新功能的正式方法。
  
- 发布团队文档列出了负责每个发布角色的人员。
  如果不清楚要与谁谈论某个特定功能或问题，请参加发布会议询问您的问题，
  或者与发布负责人联系，以便他们可以重定向您。
- 发行说明草稿是了解更多有关特定功能、更改、不推荐使用以及更多有关发行版本的好地方。
  该内容要到发布周期的后期才能最终确定，因此请谨慎使用。

<!--
#### The feature tracking sheet
-->
#### 功能跟踪表

<!--
The feature tracking sheet
[for a given Kubernetes release](https://github.com/kubernetes/sig-release/tree/master/releases) lists each feature that is planned for a release.
Each line item includes the name of the feature, a link to the feature's main
GitHub issue, its stability level (Alpha, Beta, or Stable), the SIG and
individual responsible for implementing it, whether it
needs docs, a draft release note for the feature, and whether it has been
merged. Keep the following in mind:
-->
给定 Kubernetes 版本的功能跟踪表列出了计划发布的每个功能。
每个订单项都包含功能名称，功能主要 GitHub issue 的链接，其稳定性级别（Alpha，Beta 或 Stable），
SIG 和负责实施此功能的人员，是否需要文档，发布说明草稿功能，以及是否已合并。请记住以下几点：

<!--
- Beta and Stable features are generally a higher documentation priority than
  Alpha features.
- It's hard to test (and therefore, document) a feature that hasn't been merged,
  or is at least considered feature-complete in its PR.
- Determining whether a feature needs documentation is a manual process and
  just because a feature is not marked as needing docs doesn't mean it doesn't
  need them.
-->
- Beta 和稳定功能通常比 Alpha 功能具有更高的文档优先级。
- 很难测试（因此要文档记录）尚未合并的功能，或者至少在其 PR 中被认为功能完整的功能。
- 确定某个功能是否需要文档是一个手动过程，并且仅仅因为某个功能未标记为需要文档并不意味着它就不需要它们。

<!--
### Document a feature
-->
### 记录功能

<!--
As stated above, draft content for new features is usually submitted by the SIG
responsible for implementing the new feature. This means that your role may be
more of a shepherding role for a given feature than developing the documentation
from scratch.
-->
如上所述，新功能的草案内容通常由负责实施新功能的 SIG 提交。
这意味着您的角色可能更像是给定功能的牧羊人角色。

<!--
After you've chosen a feature to document/shepherd, ask about it in the `#sig-docs`
Slack channel, in a weekly sig-docs meeting, or directly on the PR filed by the
feature SIG. If you're given the go-ahead, you can edit into the PR using one of
the techniques described in
[Commit into another person's PR](#commit-into-another-persons-pr).
-->
选择要记录/跟踪的功能后，请在 `#sig-docs` Slack 频道，
每周一次的 sig-docs 会议中或直接在功能 SIG 提交的 PR 上询问有关功能。
如果得到批准，则可以使用[提交到别人的 PR](#commit-into-another-persons-pr) 中介绍的技术来编辑 PR。

<!--
If you need to write a new topic, the following links are useful:
-->
如果您需要编写新主题，则以下链接很有用：

<!--
- [Writing a New Topic](/docs/contribute/style/write-new-topic/)
- [Using Page Templates](/docs/contribute/style/page-templates/)
- [Documentation Style Guide](/docs/contribute/style/style-guide/)
-->
- [撰写新主题](/docs/contribute/style/write-new-topic/)
- [使用页面模板](/docs/contribute/style/page-templates/)
- [文档样式指南](/docs/contribute/style/style-guide/)

<!--
### SIG members documenting new features
-->
SIG 成员记录了新功能

<!--
If you are a member of a SIG developing a new feature for Kubernetes, you need
to work with SIG Docs to be sure your feature is documented in time for the
release. Check the
[feature tracking spreadsheet](https://github.com/kubernetes/sig-release/tree/master/releases)
or check in the #sig-release Slack channel to verify scheduling details and
deadlines. Some deadlines related to documentation are:
-->
如果您是 Kubernetes 开发新功能的 SIG 成员，则需要一并更新 SIG 文档，
以确保在发布该功能时及时记录了您的功能。
查看[功能跟踪电子表格](https://github.com/kubernetes/sig-release/tree/master/releases)，
 或在 #sig-release Slack 频道中查看验证计划详细信息和截止日期。
 与文档相关的一些截止日期是：

<!--
- **Docs deadline - Open placeholder PRs**: Open a pull request against the
  `release-X.Y` branch in the `kubernetes/website` repository, with a small
  commit that you will amend later. Use the Prow command `/milestone X.Y` to
  assign the PR to the relevant milestone. This alerts the docs person managing
  this release that the feature docs are coming. If your feature does not need
  any documentation changes, make sure the sig-release team knows this, by
  mentioning it in the #sig-release Slack channel. If the feature does need
  documentation but the PR is not created, the feature may be removed from the
  milestone.
- **Docs deadline - PRs ready for review**: Your PR now needs to contain a first
  draft of the documentation for your feature. Don't worry about formatting or
  polishing. Just describe what the feature does and how to use it. The docs
  person managing the release will work with you to get the content into shape
  to be published. If your feature needs documentation and the first draft
  content is not received, the feature may be removed from the milestone.
- **Docs complete - All PRs reviewed and ready to merge**: If your PR has not
  yet been merged into the `release-X.Y` branch by this deadline, work with the
  docs person managing the release to get it in. If your feature needs
  documentation and the docs are not ready, the feature may be removed from the
  milestone.
-->
- **文档截止期限 - 打开占位 PR** ：针对 `kubernetes/website` 仓库中的 `release-X.Y` 分支提交一个 PR，
  稍作修改(占位)，稍后您将继续修改。使用 Prow 命令 `/milestone X.Y` 将 PR 分配给相关的里程碑。
  这会提醒管理此版本的文档人员功能文档即将发布。
  如果您的功能不需要任何文档更改，请在 #sig-release Slack 频道中说一下，
  以确保 sig-release 团队知道这一点。
  如果该功能确实需要文档，但未创建 PR，则该功能可能已从里程碑中删除。
- **文档截止日期 - PR 审核**：您的 PR 现在需要包含功能文档的初稿。不必担心格式或修饰。
  只需描述该功能的用途以及使用方法即可。管理发行版的文档人员将与您合作，使内容成形以进行发布。
  如果您的功能需要文档且未收到第一稿内容，则该功能可能已从里程碑中删除。
- **文档完成 - PR 已审核，准备合并**：如果您的 PR 尚未在 `release-X.Y` 此期限之前合并到分支中，
  请与管理发行版的文档人员一起合作帮助它合入。
  如果您的功能需要文档且文档尚未准备好，该功能可能会从里程碑中删除。

<!--
If your feature is an Alpha feature and is behind a feature gate, make sure you
add it to [Feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
as part of your pull request. If your feature is moving out of Alpha, make sure to
remove it from that file.
-->
如果您的功能是 Alpha 功能并且由[功能开关](/docs/reference/command-line-tools-reference/feature-gates/) 控制，
请确保将其作为 PR 的一部分添加到功能开关。
如果您的功能要移出 Alpha，请确保将其从该文件中删除。

<!--
## Contribute to other repos
-->
## 贡献其他仓库

<!--
The [Kubernetes project](https://github.com/kubernetes) contains more than 50
individual repositories. Many of these repositories contain code or content that
can be considered documentation, such as user-facing help text, error messages,
user-facing text in API references, or even code comments.
-->
该 Kubernetes 项目包含超过 50 个仓库。
这些存储库中许多都包含可以视为文档的代码或内容，例如面向用户的帮助文本，错误消息，
API 参考中的面向用户的文本，甚至是代码注释。

<!--
If you see text and you aren't sure where it comes from, you can use GitHub's
search tool at the level of the Kubernetes organization to search through all
repositories for that text. This can help you figure out where to submit your
issue or PR.
-->
如果您看到文本并且不确定其来源，则可以在 Kubernetes 组织级别使用 GitHub 的搜索工具在所有存储库中搜索该文本。
这可以帮助您确定将 issue 或 PR 提交到哪里。

<!--
Each repository may have its own processes and procedures. Before you file an
issue or submit a PR, read that repository's `README.md`, `CONTRIBUTING.md`, and
`code-of-conduct.md`, if they exist.
-->
每个存储库可能都有自己的流程和过程。
在您提交的 issue 或提交 PR，查看存储库的 `README.md`、`CONTRIBUTING.md` 以及 `code-of-conduct.md`。

<!--
Most repositories use issue and PR templates. Have a look through some open
issues and PRs to get a feel for that team's processes. Make sure to fill out
the templates with as much detail as possible when you file issues or PRs.
-->
大多数存储库使用 issue 和 PR 模板。
浏览一些未解决的 issues 和 PR，以了解该团队的流程。
提交 issues 或 PR 时，​​请确保尽可能详细地填写模板。

<!--
## Localize content
-->
## 本地化内容

<!--
The Kubernetes documentation is written in English first, but we want people to
be able to read it in their language of choice. If you are comfortable
writing in another language, especially in the software domain, you can help
localize the Kubernetes documentation or provide feedback on existing localized
content. See [Localization](/docs/contribute/localization/) and ask on the
[kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
or in `#sig-docs` on Slack if you are interested in helping out.
-->
Kubernetes 文档首先是用英语编写的，但是我们希望人们能够使用他们选择的语言来阅读它。
如果您愿意用另一种语言编写，尤其是在软件领域，则可以帮助本地化 Kubernetes 文档
或提供有关现有本地化内容的反馈。
如果您有兴趣提供帮助，请参阅 [本地化](/docs/contribute/localization/)，
并在 [kubernetes-sig-docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs) 或者 Slack 的 `#sig-docs` 群组内咨询。

<!--
### Working with localized content
-->
### 参与本地化工作

<!--
Follow these guidelines for working with localized content:
-->
请遵循以下准则来使用本地化内容：

<!--
- Limit PRs to a single language. 

   Each language has its own reviewers and approvers.

- Reviewers, verify that PRs contain changes to only one language.

   If a PR contains changes to source in more than one language, ask the PR contributor to open separate PRs for each language.
-->
- 将 PR 限制为一种语言。

    每种语言都有其自己的审阅者和批准者。
    
- 审阅者，请验证 PR 是否仅对一种语言进行了更改。
  
    如果 PR 包含对一种以上源语言的更改，请 PR 贡献者为每种语言打开单独的 PR。



## {{% heading "whatsnext" %}}


<!--
When you are comfortable with all of the tasks discussed in this topic and you
want to engage with the Kubernetes docs team in even deeper ways, read the
[advanced docs contributor](/docs/contribute/advanced/) topic.
-->
如果您熟悉本主题中讨论的所有任务，并且想与 Kubernetes 文档小组进行更深入的接触，
请阅读[文档高级贡献者](/docs/contribute/advanced/)主题。

