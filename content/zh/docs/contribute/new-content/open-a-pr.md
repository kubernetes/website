---
title: 发起拉取请求（PR）
content_type: concept
weight: 10
card:
  name: contribute
  weight: 40
---
<!--
title: Opening a pull request
content_type: concept
weight: 10
card:
  name: contribute
  weight: 40
-->

<!-- overview -->
<!--
{{< note >}}
**Code developers**: If you are documenting a new feature for an
upcoming Kubernetes release, see
[Document a new feature](/docs/contribute/new-content/new-features/).
{{< /note >}}

To contribute new content pages or improve existing content pages, open a pull request (PR). Make sure you follow all the requirements in the [Before you begin](/docs/contribute/new-content/overview/#before-you-begin) section.
-->
{{< note >}}
**代码开发者们**：如果你在为下一个 Kubernetes 发行版本中的某功能特性
撰写文档，请参考[为新功能撰写文档](/zh/docs/contribute/new-content/new-features/)。
{{< /note >}}

要贡献新的内容页面或者改进已有内容页面，请发起拉取请求（PR）。
请确保你满足了[开始之前](/zh/docs/contribute/new-content/overview/#before-you-begin)
节中所列举的所有要求。

<!--
If your change is small, or you're unfamiliar with git, read [Changes using
GitHub](#changes-using-github) to learn how to edit a page.

If your changes are large, read [Work from a local fork](#fork-the-repo) to
learn how to make changes locally on your computer.
-->
如果你所提交的变更足够小，或者你对 git 工具不熟悉，可以阅读
[使用 GitHub 提交变更](#changes-using-github)以了解如何编辑页面。

如果所提交的变更较大，请阅读[基于本地克隆副本开展工作](#fork-the-repo)以学习
如何在你本地计算机上构造变更。

<!-- body -->

<!--
## Changes using GitHub

If you're less experienced with git workflows, here's an easier method of
opening a pull request.

1.  On the page where you see the issue, select the pencil icon at the top right.
    You can also scroll to the bottom of the page and select **Edit this page**.
2.  Make your changes in the GitHub markdown editor.
3.  Below the editor, fill in the **Propose file change**
    form. In the first field, give your commit message a title. In
    the second field, provide a description.
-->
## 使用 GitHub 提交变更 {#changes-using-github}

如果你在 git 工作流方面欠缺经验，这里有一种发起拉取请求的更为简单的方法。

1. 在你发现问题的网页，选择右上角的铅笔图标。你也可以滚动到页面底端，选择
   **编辑此页面**。
2. 在 GitHub 的 Markdown 编辑器中修改内容。
3. 在编辑器的下方，填写 **建议文件变更** 表单。
   在第一个字段中，为你的提交消息取一个标题。
   在第二个字段中，为你的提交写一些描述文字。

   {{< note >}}
   不要在提交消息中使用 [GitHub 关键词](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)
   你可以在后续的 PR 描述中使用这些关键词。
   {{< /note >}}
<!--
4.  Select **Propose file change**.

5.  Select **Create pull request**.

6.  The **Open a pull request** screen appears. Fill in the form:

    - The **Subject** field of the pull request defaults to the commit summary.
    You can change it if needed.
    - The **Body** contains your extended commit message, if you have one,
    and some template text. Add the
    details the template text asks for, then delete the extra template text.
    - Leave the **Allow edits from maintainers** checkbox selected.
-->
4. 选择 **Propose File Change**.
5. 选择 **Create pull request**.
6. 在 **Open a pull request** 屏幕上填写表单：

    - **Subject** 字段默认为提交的概要信息。你可以根据需要修改它。
    - **Body** 字段包含更为详细的提交消息，如果你之前有填写过的话，以及一些模板文字。
      填写模板所要求的详细信息，之后删除多余的模板文字。
    - 确保 **Allow edits from maintainers** 复选框被勾选。

   <!--
   PR descriptions are a great way to help reviewers understand your change. For
   more information, see [Opening a PR](#open-a-pr).
   -->
   {{< note >}}
   PR 描述信息是帮助 PR 评阅人了解你所提议的变更的重要途径。
   更多信息请参考[发起一个 PR](#open-a-pr).
   {{< /note >}}

<!-- 7.  Select **Create pull request**.  -->
7. 选择 **Create pull request**.

<!--
### Addressing feedback in GitHub

Before merging a pull request, Kubernetes community members review and
approve it. The `k8s-ci-robot` suggests reviewers based on the nearest
owner mentioned in the pages. If you have someone specific in mind,
leave a comment with their GitHub username in it.
-->
### 在 GitHub 上处理反馈意见

在合并 PR 之前，Kubernetes 社区成员会评阅并批准它。
`k8s-ci-robot` 会基于页面中最近提及的属主来建议评阅人（reviewers）。
如果你希望特定某人来评阅，可以留下评论，提及该用户的 GitHub 用户名。

<!--
If a reviewer asks you to make changes:

1. Go to the **Files changed** tab.
2. Select the pencil (edit) icon on any files changed by the
pull request.
3. Make the changes requested.
4. Commit the changes.

If you are waiting on a reviewer, reach out once every 7 days. You can also post a message in the `#sig-docs` Slack channel.

When your review is complete, a reviewer merges your PR and your changes go live a few minutes later.
-->
如果某个评阅人请你修改 PR：

1. 前往 **Files changed** Tab 页面；
1. 选择 PR 所修改的任何文件所对应的铅笔（edit）图标；
1. 根据建议作出修改；
1. 提交所作修改。

如果你希望等待评阅人的反馈，可以每 7 天左右联系一次。
你也可以在 `#sig-docs` Slack 频道发送消息。

当评阅过程结束，某个评阅人会合并你的 PR。
几分钟之后，你所做的变更就会上线了。

<!--
## Work from a local fork {#fork-the-repo}

If you're more experienced with git, or if your changes are larger than a few lines,
work from a local fork.

Make sure you have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed on your computer. You can also use a git UI application.
-->
## 基于本地克隆副本开展工作 {#work-from-a-local-fork}

如果你有 git 的使用经验，或者你要提议的修改不仅仅几行，请使用本地克隆副本
来开展工作。

首先要确保你在本地计算机上安装了 [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。
你也可以使用 git 的带用户界面的应用。

<!--
### Fork the kubernetes/website repository

1. Navigate to the [`kubernetes/website`](https://github.com/kubernetes/website/) repository.
2. Select **Fork**.
-->
### 派生 kubernetes/website 仓库

1. 前往 [`kubernetes/website`](https://github.com/kubernetes/website/) 仓库；
2. 选择 **Fork**.

<!--
### Create a local clone and set the upstream

3. In a terminal window, clone your fork:
-->
### 创建一个本地克隆副本并指定 upstream 仓库

3. 打开终端窗口，克隆你所派生的副本：

    ```bash
    git clone git@github.com/<github_username>/website
    ```

<!--
4. Navigate to the new `website` directory. Set the `kubernetes/website` repository as the `upstream` remote:
-->
4. 前往新的 `website` 目录，将 `kubernetes/website` 仓库设置为 `upstream`
   远端：

      ```bash
      cd website
      git remote add upstream https://github.com/kubernetes/website.git
      ```

<!--
5. Confirm your `origin` and `upstream` repositories:
-->
5. 确认你现在有两个仓库，`origin` 和 `upstream`：

    ```bash
    git remote -v
    ```

    <!-- Output is similar to: -->
    输出类似于：

    ```bash
    origin	git@github.com:<github_username>/website.git (fetch)
    origin	git@github.com:<github_username>/website.git (push)
    upstream	https://github.com/kubernetes/website.git (fetch)
    upstream	https://github.com/kubernetes/website.git (push)
    ```
<!--
6. Fetch commits from your fork's `origin/master` and `kubernetes/website`'s `upstream/master`:
-->
6. 从你的克隆副本取回 `origin/master` 分支，从 `kubernetes/website` 取回 `upstream/master`：

    ```bash
    git fetch origin
    git fetch upstream
    ```
   <!--
   This makes sure your local repository is up to date before you start making changes.
   -->
   这样可以确保你本地的仓库在开始工作前是最新的。

   <!--
    This workflow is different than the [Kubernetes Community GitHub Workflow](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md). You do not need to merge your local copy of `master` with `upstream/master` before pushing updates to your fork.
   -->
    {{< note >}}
    此工作流程与 [Kubernetes 社区 GitHub 工作流](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md)有所不同。在推送你的变更到你的远程派生副本库之前，你不需要将你本地的 `master` 与 `upstream/master` 合并。
    {{< /note >}}

<!--
### Create a branch

1. Decide which branch base to your work on:

  - For improvements to existing content, use `upstream/master`.
  - For new content about existing features, use `upstream/master`.
  - For localized content, use the localization's conventions. For more information, see [localizing Kubernetes documentation](/docs/contribute/localization/).
  - For new features in an upcoming Kubernetes release, use the feature branch. For more information, see [documenting for a release](/docs/contribute/new-content/new-features/).
  - For long-running efforts that multiple SIG Docs contributors collaborate on,
    like content reorganization, use a specific feature branch created for that
    effort.

    If you need help choosing a branch, ask in the `#sig-docs` Slack channel.
-->
### 创建一个分支

1. 决定你要基于哪个分支来开展工作：

   - 针对已有内容的改进，请使用 `upstream/master`；
   - 针对已有功能特性的新文档内容，请使用 `upstream/master`；
   - 对于本地化内容，请基于本地化的约定。
     可参考[对 Kubernetes 文档进行本地化](/zh/docs/contribute/localization/)了解详细信息。
   - 对于在下一个 Kubernetes 版本中新功能特性的文档，使用独立的功能特性分支。
     参考[为发行版本功能特性撰写文档](/zh/docs/contribute/new-content/new-features/)了解更多信息。
   - 对于很多 SIG Docs 共同参与的，需较长时间才完成的任务，例如内容的重构，
     请使用为该任务创建的特性分支。

   如果你在选择分支上需要帮助，请在 `#sig-docs` Slack 频道提问。

<!--
2. Create a new branch based on the branch identified in step 1. This example assumes the base branch is `upstream/master`:
-->
2. 基于第一步中选定的分支，创建新分支。
   下面的例子假定基础分支是 `upstream/master`：

    ```bash
    git checkout -b <my_new_branch> upstream/master
    ```
<!--
3.  Make your changes using a text editor.
-->
3. 使用文本编辑器开始构造变更。

<!--
At any time, use the `git status` command to see what files you've changed.
-->
在任何时候，都可以使用 `git status` 命令查看你所改变了的文件列表。

<!--
### Commit your changes

When you are ready to submit a pull request, commit your changes.
-->
### 提交你的变更

当你准备好发起拉取请求（PR）时，提交你所做的变更。

<!--
1. In your local repository, check which files you need to commit:

    ```bash
    git status
    ```

    Output is similar to:

    ```bash
    On branch <my_new_branch>
    Your branch is up to date with 'origin/<my_new_branch>'.

    Changes not staged for commit:
    (use "git add <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   content/en/docs/contribute/new-content/contributing-content.md

    no changes added to commit (use "git add" and/or "git commit -a")
    ```
-->
1. 在你的本地仓库中，检查你要提交的文件：

    ```bash
    git status
    ```

    输出类似于：

    ```bash
    On branch <my_new_branch>
    Your branch is up to date with 'origin/<my_new_branch>'.

    Changes not staged for commit:
    (use "git add <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   content/en/docs/contribute/new-content/contributing-content.md

    no changes added to commit (use "git add" and/or "git commit -a")
    ```

<!--
2. Add the files listed under **Changes not staged for commit** to the commit:

    ```bash
    git add <your_file_name>
    ```

    Repeat this for each file.
-->
2. 将 **Changes not staged for commit** 下列举的文件添加到提交中：

    ```bash
    git add <your_file_name>
    ```

    针对每个文件重复此操作。
<!--
3.  After adding all the files, create a commit:

    ```bash
    git commit -m "Your commit message"
    ```

    {{< note >}}
    Do not use any [GitHub Keywords](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) in your commit message. You can add those to the pull request
    description later.
    {{< /note >}}
-->
3. 添加完所有文件之后，创建一个提交（commit）：

    ```bash
    git commit -m "Your commit message"
    ```

    {{< note >}}
    不要在提交消息中使用任何 [GitHub 关键字](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)。
    你可以在后面创建 PR 时使用这些关键字。
    {{< /note >}}
<!--
4. Push your local branch and its new commit to your remote fork:

    ```bash
    git push origin <my_new_branch>
    ```
-->
4. 推送你本地分支及其中的新提交到你的远程派生副本库：

    ```bash
    git push origin <my_new_branch>
    ```

<!--
### Preview your changes locally {#preview-locally}

It's a good idea to preview your changes locally before pushing them or opening a pull request. A preview lets you catch build errors or markdown formatting problems.

You can either build the website's container image or run Hugo locally. Building the container image is slower but displays [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/), which can be useful for debugging.
-->
### 在本地预览你的变更 {#preview-locally}

在推送变更或者发起 PR 之前在本地查看一下预览是个不错的注意。
通过预览你可以发现构建错误或者 Markdown 格式问题。

你可以构造网站的容器镜像或者在本地运行 Hugo。
构造容器镜像的方式比较慢，不过能够显示 [Hugo 短代码（shortcodes）](/zh/docs/contribute/style/hugo-shortcodes/)，
因此对于调试是很有用的。

{{< tabs name="tab_with_hugo" >}}
{{% tab name="在容器内执行 Hugo" %}}

<!--
The following commmand uses Docker as the default container engine.
You can set up the `CONTAINER_ENGINE` to override this behavior.
-->
{{< note >}}
下面的命令中使用 Docker 作为默认的容器引擎。
如果需要重载这一行为，可以设置 `CONTAINER_ENGINE`。
{{< /note >}}

<!--
1.  Build the image locally:
-->
1. 在本地构造镜像；

      ```bash
      # 使用 docker (默认)
      make container-image

      ### 或 ###

      # 使用 podman
      CONTAINER_ENGINE=podman make container-image
      ```

<!--
2. After building the `kubernetes-hugo` image locally, build and serve the site:
-->
2. 在本地构造了 `kubernetes-hugo` 镜像之后，可以构造并启动网站：

      ```bash
      # 使用 docker (默认)
      make container-serve

      ### 或 ###

      # 使用 podman
      CONTAINER_ENGINE=podman make container-serve
      ```
<!--
3.  In a web browser, navigate to `https://localhost:1313`. Hugo watches the
    changes and rebuilds the site as needed.
4.  To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`,
    or close the terminal window.
-->
3. 启动浏览器，浏览 `https://localhost:1313`。
   Hugo 会监测文件的变更并根据需要重新构建网站。

4. 要停止本地 Hugo 实例，可返回到终端并输入 `Ctrl+C`，或者关闭终端窗口。

{{% /tab %}}
{{% tab name="在命令行执行 Hugo" %}}

<!--
Alternately, install and use the `hugo` command on your computer:
-->
另一种方式是，在你的本地计算机上安装并使用 `hugo` 命令：

<!--
1.  Install the [Hugo](https://gohugo.io/getting-started/installing/) version specified in [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/master/netlify.toml).
2.  In a terminal, go to your Kubernetes website repository and start the Hugo server:
-->
1. 安装 [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/master/netlify.toml)
   文件中指定的 [Hugo](https://gohugo.io/getting-started/installing/) 版本。

2. 启动一个终端窗口，进入 Kubernetes 网站仓库目录，启动 Hugo 服务器：

      ```bash
      cd <path_to_your_repo>/website
      hugo server
      ```
<!--
3.  In your browser’s address bar, enter `https://localhost:1313`.
4.  To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`,
    or close the terminal window.
-->
3. 在浏览器的地址栏输入： `https://localhost:1313`。
4. 要停止本地 Hugo 实例，返回到终端窗口并输入 `Ctrl+C` 或者关闭终端窗口。
{{% /tab %}}
{{< /tabs >}}

<!--
### Open a pull request from your fork to kubernetes/website {#open-a-pr}
-->
### 从你的克隆副本向 kubernetes/website 发起拉取请求（PR） {#open-a-pr}

<!--
1. In a web browser, go to the [`kubernetes/website`](https://github.com/kubernetes/website/) repository.
2. Select **New Pull Request**.
3. Select **compare across forks**.
4. From the **head repository** drop-down menu, select your fork.
5. From the **compare** drop-down menu, select your branch.
6. Select **Create Pull Request**.
7. Add a description for your pull request:
    - **Title** (50 characters or less): Summarize the intent of the change.
    - **Description**: Describe the change in more detail.
      - If there is a related GitHub issue, include `Fixes #12345` or `Closes #12345` in the description. GitHub's automation closes the mentioned issue after merging the PR if used. If there are other related PRs, link those as well.
      - If you want advice on something specific, include any questions you'd like reviewers to think about in your description.
8. Select the **Create pull request** button.

   Congratulations! Your pull request is available in [Pull requests](https://github.com/kubernetes/website/pulls).
-->
1. 在 Web 浏览器中，前往 [`kubernetes/website`](https://github.com/kubernetes/website/) 仓库；
2. 点击 **New Pull Request**；
3. 选择 **compare across forks**；
4. 从 **head repository** 下拉菜单中，选取你的派生仓库；
5. 从 **compare** 下拉菜单中，选择你的分支；
6. 点击 **Create Pull Request**；
7. 为你的拉取请求添加一个描述：
    - **Title** （不超过 50 个字符）：总结变更的目的；
    - **Description**：给出变更的详细信息；
      - 如果存在一个相关联的 GitHub Issue，可以在描述中包含 `Fixes #12345` 或
        `Closes #12345`。GitHub 的自动化设施能够在当前 PR 被合并时自动关闭所提及
        的 Issue。如果有其他相关联的 PR，也可以添加对它们的链接。
      - 如果你尤其希望获得某方面的建议，可以在描述中包含你希望评阅人思考的问题。
8. 点击 **Create pull request** 按钮。

   祝贺你! 你的拉取请求现在出现在 [Pull Requests](https://github.com/kubernetes/website/pulls) 列表中了！

<!--
After opening a PR, GitHub runs automated tests and tries to deploy a preview using [Netlify](https://www.netlify.com/).

  - If the Netlify build fails, select **Details** for more information.
  - If the Netlify build succeeds, select **Details** opens a staged version of the Kubernetes website with your changes applied. This is how reviewers check your changes.

GitHub also automatically assigns labels to a PR, to help reviewers. You can add them too, if needed. For more information, see [Adding and removing issue labels](/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels).
-->
在发起 PR 之后，GitHub 会执行一些自动化的测试，并尝试使用
[Netlify](https://www.netlify.com/) 部署一个预览版本。

  - 如果 Netlify 构建操作失败，可选择 **Details** 了解详细信息。
  - 如果 Netlify 构建操作成功，选择 **Details** 会打开 Kubernetes 的一个预览
    版本，其中包含了你所作的变更。评阅人也使用这一功能来检查你的变更。

GitHub 也会自动为 PR 分派一些标签，以帮助评阅人。
如果有需要，你也可以向 PR 添加标签。
欲了解相关详细信息，可以参考
[添加和删除 Issue 标签](/zh/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels)。

<!--
### Addressing feedback locally

1. After making your changes, amend your previous commit:
-->
### 在本地处理反馈

1. 在本地完成修改之后，可以修补（amend）你之前的提交：

    ```bash
    git commit -a --amend
    ```

    <!--
    - `-a`: commits all changes
    - `--amend`: amends the previous commit, rather than creating a new one
    -->
    - `-a`：提交所有修改
    - `--amend`：对前一次提交进行增补，而不是创建新的提交

<!--
2. Update your commit message if needed.
3. Use `git push origin <my_new_branch>` to push your changes and re-run the Netlify tests.
-->
2. 如果有必要，更新你的提交消息；
3. 使用 `git push origin <my_new_branch>` 来推送你的变更，重新出发 Netlify 测试。

   <!--
   If you use `git commit -m` instead of amending, you must
   [squash your commits](#squashing-commits) before merging.
   -->
   {{< note >}}
   如果你使用 `git commit -m` 而不是增补参数，在 PR 最终合并之前你必须
   [squash 你的提交](#squashing-commits)。
   {{< /note >}}

<!--
#### Changes from reviewers

Sometimes reviewers commit to your pull request. Before making any other changes, fetch those commits.

1. Fetch commits from your remote fork and rebase your working branch:
-->
#### 来自评阅人的修改

有时评阅人会向你的 PR 中提交修改。在作出其他修改之前，请先取回这些提交。

1. 从你的远程派生副本仓库取回提交，让你的工作分支基于所取回的分支：

    ```bash
    git fetch origin
    git rebase origin/<your-branch-name>
    ```
<!--
2. After rebasing, force-push new changes to your fork:
-->
2. 变更基线（rebase）操作完成之后，强制推送本地的新改动到你的派生仓库：

    ```bash
    git push --force-with-lease origin <your-branch-name>
    ```

<!--
#### Merge conflicts and rebasing

{{< note >}}
For more information, see [Git Branching - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts), [Advanced Merging](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging), or ask in the `#sig-docs` Slack channel for help.
{{< /note >}}
-->
#### 合并冲突和重设基线

{{< note >}}
要了解更多信息，可参考
[Git 分支管理 - 基本分支和合并](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts)、
[高级合并](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)、
或者在 `#sig-docs` Slack 频道寻求帮助。
{{< /note >}}

<!--
If another contributor commits changes to the same file in another PR, it can create a merge conflict. You must resolve all merge conflicts in your PR.

1. Update your fork and rebase your local branch:
-->
如果另一个贡献者在别的 PR 中提交了对同一文件的修改，这可能会造成合并冲突。
你必须在你的 PR 中解决所有合并冲突。

1. 更新你的派生副本，重设本地分支的基线：

   ```bash
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

   <!-- Then force-push the changes to your fork:-->
   之后强制推送修改到你的派生副本仓库：

   ```bash
   git push --force-with-lease origin <your-branch-name>
   ```
<!--
2. Fetch changes from `kubernetes/website`'s `upstream/master` and rebase your branch:
-->
2. 从 `kubernetes/website` 的 `upstream/master` 分支取回更改，然后重设本地分支的基线：

   ```bash
   git fetch upstream
   git rebase upstream/master
   ```
<!--
3. Inspect the results of the rebase:
-->
3. 检查重设基线操作之后的状态：

   ```bash
   git status
   ```

   <!-- This results in a number of files marked as conflicted. -->
   你会看到一组存在冲突的文件。

<!--
4. Open each conflicted file and look for the conflict markers: `>>>`, `<<<`, and `===`. Resolve the conflict and delete the conflict marker.
-->
4. 打开每个存在冲突的文件，查找冲突标记：`>>>`、`<<<` 和 `===`。
   解决完冲突之后删除冲突标记。

    <!--
    For more information, see [How conflicts are presented](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented).
    -->
    {{< note >}}
    进一步的详细信息可参见
    [冲突是怎样表示的](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented).
    {{< /note >}}

<!--
5. Add the files to the changeset:
-->
5. 添加文件到变更集合：

    ```bash
    git add <filename>
    ```
<!--
6.  Continue the rebase:
-->
6. 继续执行基线变更（rebase）操作：

    ```bash
    git rebase --continue
    ```

<!--
7.  Repeat steps 2 to 5 as needed.

    After applying all commits, the `git status` command shows that the rebase is complete.
-->
7. 根据需要重复步骤 2 到 5。

   在应用完所有提交之后，`git status` 命令会显示 rebase 操作完成。

<!--
8. Force-push the branch to your fork:
-->
8. 将分支强制推送到你的派生仓库：

    ```bash
    git push --force-with-lease origin <your-branch-name>
    ```

    <!-- The pull request no longer shows any conflicts. -->
    PR 不再显示存在冲突。

<!--
### Squashing commits
-->
### 压缩（Squashing）提交 {#squashing-commits}

<!--
For more information, see [Git Tools - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History), or ask in the `#sig-docs` Slack channel for help.
-->
{{< note >}}
要了解更多信息，可参看
[Git Tools - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)，
或者在 `#sig-docs` Slack 频道寻求帮助。
{{< /note >}}

<!--
If your PR has multiple commits, you must squash them into a single commit before merging your PR. You can check the number of commits on your PR's **Commits** tab or by running the `git log` command locally.
-->
如果你的 PR 包含多个提交（commits），你必须将其压缩成一个提交才能被合并。
你可以在 PR 的 **Commits** Tab 页面查看提交个数，也可以在本地通过
`git log` 命令查看提交个数。

<!-- This topic assumes `vim` as the command line text editor.-->
{{< note >}}
本主题假定使用 `vim` 作为命令行文本编辑器。
{{< /note >}}

<!--
1. Start an interactive rebase:
-->
1. 启动一个交互式的 rebase 操作：

    ```bash
    git rebase -i HEAD~<number_of_commits_in_branch>
    ```

    <!--
    Squashing commits is a form of rebasing. The `-i` switch tells git you want to rebase interactively. `HEAD~<number_of_commits_in_branch` indicates how many commits to look at for the rebase.
    -->
    压缩提交的过程也是一种重设基线的过程。
    这里的 `-i` 开关告诉 git 你希望交互式地执行重设基线操作。
    `HEAD~<number_of_commits_in_branch` 表明在 rebase 操作中查看多少个提交。

    <!--Output is similar to:-->
    输出类似于；

    ```bash
    pick d875112ca Original commit
    pick 4fa167b80 Address feedback 1
    pick 7d54e15ee Address feedback 2

    # Rebase 3d18sf680..7d54e15ee onto 3d183f680 (3 commands)

    ...

    # These lines can be re-ordered; they are executed from top to bottom.
    ```

    <!--
    The first section of the output lists the commits in the rebase. The second section lists the options for each commit. Changing the word `pick` changes the status of the commit once the rebase is complete.

    For the purposes of rebasing, focus on `squash` and `pick`.
    -->
    输出的第一部分列举了重设基线操作中的提交。
    第二部分给出每个提交的选项。
    改变单词 `pick` 就可以改变重设基线操作之后提交的状态。

    就重设基线操作本身，我们关注 `squash` 和 `pick` 选项。

    <!--
    For more information, see [Interactive Mode](https://git-scm.com/docs/git-rebase#_interactive_mode).
    -->
    {{< note >}}
    进一步的详细信息可参考 [Interactive Mode](https://git-scm.com/docs/git-rebase#_interactive_mode)。
    {{< /note >}}

<!--
2. Start editing the file.
    Change the original text:
-->

2. 开始编辑文件。

    修改原来的文本：

    ```bash
    pick d875112ca Original commit
    pick 4fa167b80 Address feedback 1
    pick 7d54e15ee Address feedback 2
    ```

    <!-- To: -->
    使之成为：

    ```bash
    pick d875112ca Original commit
    squash 4fa167b80 Address feedback 1
    squash 7d54e15ee Address feedback 2
    ```

    <!--
    This squashes commits `4fa167b80 Address feedback 1` and `7d54e15ee Address feedback 2` into `d875112ca Original commit`, leaving only `d875112ca Original commit` as a part of the timeline.
    -->
    以上编辑操作会压缩提交 `4fa167b80 Address feedback 1` 和 `7d54e15ee Address feedback 2`
    到 `d875112ca Original commit` 中，只留下 `d875112ca Original commit` 成为时间线中的一部分。

<!--
3. Save and exit your file.
4. Push your squashed commit:
-->
3. 保存文件并退出编辑器。

4. 推送压缩后的提交：

    ```bash
    git push --force-with-lease origin <branch_name>
    ```

<!--
## Contribute to other repos

The [Kubernetes project](https://github.com/kubernetes) contains 50+ repositories. Many of these repositories contain documentation: user-facing help text, error messages, API references or code comments.

If you see text you'd like to improve, use GitHub to search all repositories in the Kubernetes organization.
This can help you figure out where to submit your issue or PR.
-->
## 贡献到其他仓库

[Kubernetes 项目](https://github.com/kubernetes)包含大约 50 多个仓库。
这些仓库中很多都有文档：提供给最终用户的帮助文本、错误信息、API 参考或者代码注释等。

如果你发现有些文本需要改进，可以使用 GitHub 来搜索 Kubernetes 组织下的所有仓库。
这样有助于发现要在哪里提交 Issue 或 PR。

<!--
Each repository has its own processes and procedures. Before you file an
issue or submit a PR, read that repository's `README.md`, `CONTRIBUTING.md`, and
`code-of-conduct.md`, if they exist.

Most repositories use issue and PR templates. Have a look through some open
issues and PRs to get a feel for that team's processes. Make sure to fill out
the templates with as much detail as possible when you file issues or PRs.
-->
每个仓库有其自己的流程和过程。在登记 Issue 或者发起 PR 之前，记得阅读仓库的
`README.md`、`CONTRIBUTING.md` 和 `code-of-conduct.md` 文件，如果有的话。

大多数仓库都有自己的 Issue 和 PR 模版。通过查看一些待解决的 Issues 和
PR，也可以添加对它们的链接。你可以多少了解该团队的流程。
在登记 Issue 或提出 PR 时，务必尽量填充所给的模版，多提供详细信息。

## {{% heading "whatsnext" %}}

<!--
- Read [Reviewing](/docs/contribute/reviewing/revewing-prs) to learn more about the review process.
-->
- 阅读[评阅](/zh/docs/contribute/review/reviewing-prs)节，学习评阅过程。

