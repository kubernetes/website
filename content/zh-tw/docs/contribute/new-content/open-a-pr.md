---
title: 發起拉取請求（PR）
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

{{< note >}}
<!--
**Code developers**: If you are documenting a new feature for an
upcoming Kubernetes release, see
[Document a new feature](/docs/contribute/new-content/new-features/).
-->
**代碼開發者們**：如果你在爲下一個 Kubernetes 發行版本中的某功能特性撰寫文檔，
請參考[爲發行版本撰寫功能特性文檔](/zh-cn/docs/contribute/new-content/new-features/)。
{{< /note >}}

<!--
To contribute new content pages or improve existing content pages, open a pull request (PR).
Make sure you follow all the requirements in the
[Before you begin](/docs/contribute/new-content/) section.
-->
要貢獻新的內容頁面或者改進已有內容頁面，請發起拉取請求（PR）。
請確保你滿足了[開始之前](/zh-cn/docs/contribute/new-content/)一節中所列舉的所有要求。

<!--
If your change is small, or you're unfamiliar with git, read
[Changes using GitHub](#changes-using-github) to learn how to edit a page.

If your changes are large, read [Work from a local fork](#fork-the-repo) to learn how to make
changes locally on your computer.
-->
如果你所提交的變更足夠小，或者你對 git 工具不熟悉，
可以閱讀[使用 GitHub 提交變更](#changes-using-github)以瞭解如何編輯頁面。

如果所提交的變更較大，
請閱讀[基於本地克隆副本開展工作](#fork-the-repo)以學習如何在你本地計算機上進行修改。

<!-- body -->

<!-- 
## Changes using GitHub

If you're less experienced with git workflows, here's an easier method of
opening a pull request. Figure 1 outlines the steps and the details follow.
-->
## 使用 GitHub 提交變更   {#changes-using-github}

如果你在 git 工作流方面欠缺經驗，這裏有一種發起拉取請求的更爲簡單的方法。
圖 1 勾勒了後續的步驟和細節。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
A([fa:fa-user 新的<br>貢獻者]) --- id1[(kubernetes/website<br>GitHub)]
subgraph tasks[使用 GitHub 提交變更]
direction TB
    0[ ] -.-
    1[1. 編輯此頁] --> 2[2. 使用 GitHub markdown<br>編輯器進行修改]
    2 --> 3[3. 填寫 Propose file change]

end
subgraph tasks2[ ]
direction TB
4[4. 選擇 Propose file change] --> 5[5. 選擇 Create pull request] --> 6[6. 填寫 Open a pull request]
6 --> 7[7. 選擇 Create pull request] 
end

id1 --> tasks --> tasks2

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,1,2,3,4,5,6,7 grey
class 0 spacewhite
class tasks,tasks2 white
class id1 k8s
{{</ mermaid >}}

<!--
Figure 1. Steps for opening a PR using GitHub.
-->
圖 1. 使用 GitHub 發起一個 PR 的步驟。

<!--
1. On the page where you see the issue, select the **Edit this page** option in the right-hand side navigation panel.

1. Make your changes in the GitHub markdown editor.

1. Below the editor, fill in the **Propose file change** form.
   In the first field, give your commit message a title.
   In the second field, provide a description.
-->
1. 在你發現問題的頁面上，選擇右側導航面板中的**編輯此頁面**選項。

2. 在 GitHub 的 Markdown 編輯器中修改內容。

3. 在編輯器的下方，填寫 **Propose file change** 表單。
   在第一個字段中，爲你的提交消息取一個標題。
   在第二個字段中，爲你的提交寫一些描述文字。

   {{< note >}}
   <!--
   Do not use any [GitHub Keywords](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)
   in your commit message. You can add those to the pull request description later.
   -->
   不要在提交消息中使用 [GitHub 關鍵詞](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)。
   你可以在後續的 PR 描述中使用這些關鍵詞。
   {{< /note >}}

<!--
1. Select **Propose file change**.

1. Select **Create pull request**.

1. The **Open a pull request** screen appears. Fill in the form:

   - The **Subject** field of the pull request defaults to the commit summary.
     You can change it if needed.
   - The **Body** contains your extended commit message, if you have one,
     and some template text. Add the
     details the template text asks for, then delete the extra template text.
   - Leave the **Allow edits from maintainers** checkbox selected.
-->
4. 選擇 **Propose File Change**。

5. 選擇 **Create pull request**。

6. 出現 **Open a pull request** 界面。填寫表單：

   - **Subject** 字段默認爲提交的概要信息，你可以根據需要進行修改。
   - **Body** 字段包含更爲詳細的提交消息（如果你之前有填寫過的話）和一些模板文字。
     填寫模板所要求的詳細信息，之後刪除多餘的模板文字。
   - 確保 **Allow edits from maintainers** 複選框被勾選。

   {{< note >}}
   <!--
   PR descriptions are a great way to help reviewers understand your change.
   For more information, see [Opening a PR](#open-a-pr).
   -->
   PR 描述信息是幫助 PR 評閱人瞭解你所提議的變更的重要途徑。
   更多信息請參考[發起一個 PR](#open-a-pr)。
   {{< /note >}}

<!--
1. Select **Create pull request**.
-->
7. 選擇 **Create pull request**。

<!--
### Addressing feedback in GitHub

Before merging a pull request, Kubernetes community members review and
approve it. The `k8s-ci-robot` suggests reviewers based on the nearest
owner mentioned in the pages. If you have someone specific in mind,
leave a comment with their GitHub username in it.
-->
### 在 GitHub 上處理反饋意見   {#addressing-feedback-in-github}

在合併 PR 之前，Kubernetes 社區成員會評閱並批准它。
`k8s-ci-robot` 會基於頁面中最近提及的屬主來建議評閱人（reviewers）。
如果你希望特定某人來評閱，可以留下評論，提及該使用者的 GitHub 使用者名。

<!--
If a reviewer asks you to make changes:

1. Go to the **Files changed** tab.
1. Select the pencil (edit) icon on any files changed by the pull request.
1. Make the changes requested.
1. Commit the changes.

If you are waiting on a reviewer, reach out once every 7 days. You can also post a message in the
`#sig-docs` Slack channel.

When your review is complete, a reviewer merges your PR and your changes go live a few minutes later.
-->
如果某個評閱人請你修改 PR：

1. 前往 **Files changed** Tab 頁面；
1. 選擇 PR 所修改的任何文件所對應的鉛筆（edit）圖標；
1. 根據建議作出修改；
1. 提交所作修改。

如果你希望等待評閱人的反饋，可以每 7 天左右聯繫一次。
你也可以在 `#sig-docs` Slack 頻道發送消息。

當評閱過程結束，某個評閱人會合並你的 PR。
幾分鐘之後，你所做的變更就會上線了。

<!--
## Work from a local fork {#fork-the-repo}

If you're more experienced with git, or if your changes are larger than a few lines,
work from a local fork.

Make sure you have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed
on your computer. You can also use a git UI application.

Figure 2 shows the steps to follow when you work from a local fork. The details for each step follow.
-->
## 基於本地克隆副本開展工作   {#fork-the-repo}

如果你有 git 的使用經驗，或者你要提議的修改不僅僅幾行，請使用本地克隆副本來開展工作。

首先要確保你在本地計算機上安裝了 [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。
你也可以使用 git 的帶使用者界面的應用。

圖 2 顯示了基於本地克隆副本開展工作的步驟。每個步驟的細節如下。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
1[派生 kubernetes/website<br>倉庫] --> 2[創建本地克隆副本<br>並指定 upstream 倉庫]
subgraph changes[你的變更]
direction TB
S[ ] -.-
3[創建一個分支<br>例如：my_new_branch] --> 3a[使用文本編輯器<br>進行修改] --> 4["使用 Hugo 在本地<br>預覽你的變更<br>(localhost:1313)<br>或構建容器映像檔"]
end
subgraph changes2[提交 / 推送]
direction TB
T[ ] -.-
5[提交你的變更] --> 6[將提交推送到<br>origin/my_new_branch]
end

2 --> changes --> changes2

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class 1,2,3,3a,4,5,6 grey
class S,T spacewhite
class changes,changes2 white
{{</ mermaid >}}

<!-- 
Figure 2. Working from a local fork to make your changes.
-->
圖 2. 使用本地克隆副本進行修改。

<!--
### Fork the kubernetes/website repository

1. Navigate to the [`kubernetes/website`](https://github.com/kubernetes/website/) repository.
1. Select **Fork**.
-->
### 派生 kubernetes/website 倉庫   {#fork-the-kubernetes-website-repository}

1. 前往 [`kubernetes/website`](https://github.com/kubernetes/website/) 倉庫；
1. 選擇 **Fork**.

<!--
### Create a local clone and set the upstream

1. In a terminal window, clone your fork and update the [Docsy Hugo theme](https://github.com/google/docsy#readme):
-->
### 創建一個本地克隆副本並指定 upstream 倉庫   {#create-a-local-clone-and-set-the-upstream}

1. 打開終端窗口，克隆你所派生的副本，並更新 [Docsy Hugo 主題](https://github.com/google/docsy#readme)：

   ```shell
   git clone git@github.com:<github_username>/website
   cd website
   ```

<!--
1. Navigate to the new `website` directory. Set the `kubernetes/website` repository as the `upstream` remote:
-->
2. 前往新的 `website` 目錄，將 `kubernetes/website` 倉庫設置爲 `upstream`
   遠端：

   ```shell
   cd website

   git remote add upstream https://github.com/kubernetes/website.git
   ```

<!--
1. Confirm your `origin` and `upstream` repositories:
-->
3. 確認你現在有兩個倉庫 `origin` 和 `upstream`：

   ```shell
   git remote -v
   ```

   <!--
   Output is similar to:
   -->
   輸出類似於：

   ```none
   origin	git@github.com:<github_username>/website.git (fetch)
   origin	git@github.com:<github_username>/website.git (push)
   upstream	https://github.com/kubernetes/website.git (fetch)
   upstream	https://github.com/kubernetes/website.git (push)
   ```

<!--
1. Fetch commits from your fork's `origin/main` and `kubernetes/website`'s `upstream/main`:
-->
4. 從你的克隆副本取回 `origin/main` 分支，從 `kubernetes/website` 取回 `upstream/main`：

   ```shell
   git fetch origin
   git fetch upstream
   ```

   <!--
   This makes sure your local repository is up to date before you start making changes.
   -->
   這樣可以確保你本地的倉庫在開始工作前是最新的。

   {{< note >}}
   <!--
   This workflow is different than the
   [Kubernetes Community GitHub Workflow](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md).
   You do not need to merge your local copy of `main` with `upstream/main` before pushing updates
   to your fork.
   -->
   此工作流程與 [Kubernetes 社區 GitHub 工作流](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md)有所不同。
   在推送你的變更到你的遠程派生副本庫之前，你不需要將你本地的 `main` 與 `upstream/main` 合併。
   {{< /note >}}

<!--
### Create a branch

1. Decide which branch to base your work on:

   - For improvements to existing content, use `upstream/main`.
   - For new content about existing features, use `upstream/main`.
   - For localized content, use the localization's conventions. For more information, see
     [localizing Kubernetes documentation](/docs/contribute/localization/).
   - For new features in an upcoming Kubernetes release, use the feature branch. For more
     information, see [documenting for a release](/docs/contribute/new-content/new-features/).
   - For long-running efforts that multiple SIG Docs contributors collaborate on,
     like content reorganization, use a specific feature branch created for that effort.

   If you need help choosing a branch, ask in the `#sig-docs` Slack channel.
-->
### 創建一個分支   {#create-a-branch}

1. 決定你要基於哪個分支來開展工作：

   - 針對已有內容的改進，請使用 `upstream/main`。
   - 針對已有功能特性的新文檔內容，請使用 `upstream/main`。
   - 對於本地化內容，請基於本地化的約定。
     可參考[本地化 Kubernetes 文檔](/zh-cn/docs/contribute/localization/)瞭解詳細信息。
   - 對於在下一個 Kubernetes 版本中新功能特性的文檔，使用獨立的功能特性分支。
     參考[爲發行版本撰寫功能特性文檔](/zh-cn/docs/contribute/new-content/new-features/)瞭解更多信息。
   - 對於很多 SIG Docs 共同參與的，需較長時間才完成的任務，例如內容的重構，
     請使用爲該任務創建的特性分支。

   如果你在選擇分支上需要幫助，請在 `#sig-docs` Slack 頻道提問。

<!--
1. Create a new branch based on the branch identified in step 1. This example assumes the base
   branch is `upstream/main`:
-->
2. 基於第 1 步中選定的分支，創建新分支。
   下面的例子假定基礎分支是 `upstream/main`：

   ```shell
   git checkout -b <my_new_branch> upstream/main
   ```

<!--
1. Make your changes using a text editor.
-->
3. 使用文本編輯器進行修改。

<!--
At any time, use the `git status` command to see what files you've changed.
-->
在任何時候，都可以使用 `git status` 命令查看你所改變了的文件列表。

<!--
### Commit your changes

When you are ready to submit a pull request, commit your changes.
-->
### 提交你的變更   {#commit-your-changes}

當你準備好發起拉取請求（PR）時，提交你所做的變更。

<!--
1. In your local repository, check which files you need to commit:
-->
1. 在你的本地倉庫中，檢查你要提交的文件：

   ```shell
   git status
   ```

   <!--
   Output is similar to:
   -->
   輸出類似於：

   ```none
   On branch <my_new_branch>
   Your branch is up to date with 'origin/<my_new_branch>'.

   Changes not staged for commit:
   (use "git add <file>..." to update what will be committed)
   (use "git checkout -- <file>..." to discard changes in working directory)

   modified:   content/en/docs/contribute/new-content/contributing-content.md

   no changes added to commit (use "git add" and/or "git commit -a")
   ```

<!--
1. Add the files listed under **Changes not staged for commit** to the commit:
-->
2. 將 **Changes not staged for commit** 下列舉的文件添加到提交中：

   ```shell
   git add <your_file_name>
   ```

   <!--
   Repeat this for each file.
   -->
   針對每個文件重複此操作。

<!--
1. After adding all the files, create a commit:
-->
3. 添加完所有文件之後，創建一個提交（commit）：

   ```shell
   git commit -m "Your commit message"
   ```

   <!--
   Do not use any [GitHub Keywords](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)
   in your commit message. You can add those to the pull request
   description later.
   -->
   {{< note >}}
   不要在提交消息中使用任何 [GitHub 關鍵詞](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)。
   你可以在後續的 PR 描述中使用這些關鍵詞。
   {{< /note >}}

<!--
1. Push your local branch and its new commit to your remote fork:
-->
4. 推送你本地分支及其中的新提交到你的遠程派生副本庫：

   ```shell
   git push origin <my_new_branch>
   ```

<!--
### Preview your changes locally {#preview-locally}

It's a good idea to preview your changes locally before pushing them or opening a pull request.
A preview lets you catch build errors or markdown formatting problems.

You can either build the website's container image or run Hugo locally. Building the container
image is slower but displays [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/), which can
be useful for debugging.
-->
### 在本地預覽你的變更   {#preview-locally}

在推送變更或者發起 PR 之前在本地查看一下預覽是個不錯的主意。
通過預覽你可以發現構建錯誤或者 Markdown 格式問題。

你可以構建網站的容器映像檔或者在本地運行 Hugo。
構建容器映像檔的方式比較慢，不過能夠顯示 [Hugo 短代碼（shortcodes）](/zh-cn/docs/contribute/style/hugo-shortcodes/)，
因此對於調試是很有用的。

{{< tabs name="tab_with_hugo" >}}
{{% tab name="在容器內執行 Hugo" %}}

<!--
The commands below use Docker as default container engine. Set the `CONTAINER_ENGINE` environment
variable to override this behaviour.
-->
{{< note >}}
下面的命令中使用 Docker 作爲默認的容器引擎。
如果需要重載這一行爲，可以設置 `CONTAINER_ENGINE` 環境變量。
{{< /note >}}

<!--
1. Build the container image locally  
   _You only need this step if you are testing a change to the Hugo tool itself_
-->
1. 在本地構建容器映像檔
   _如果你正在測試對 Hugo 工具本身的更改，則僅需要此步驟_

   ```shell
   # 在終端窗口中執行（如果有需要）
   make container-image
   ```
   
<!--
1. Fetch submodule dependencies in your local repository:
-->
2. 在你的本地存儲庫中獲取子模塊依賴項：

   <!--
   # Run this in a terminal
   -->
   ```shell
   # 在終端窗口中執行
   make module-init
   ```

<!--
1. Start Hugo in a container:
-->
3. 在容器中啓動 Hugo：

   ```shell
   # 在終端窗口中執行
   make container-serve
   ```

<!--
1. In a web browser, navigate to `http://localhost:1313`. Hugo watches the
   changes and rebuilds the site as needed.

1. To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`,
   or close the terminal window.
-->
4. 啓動瀏覽器，瀏覽 `http://localhost:1313`。
   Hugo 會監測文件的變更並根據需要重新構建網站。

5. 要停止本地 Hugo 實例，可返回到終端並輸入 `Ctrl+C`，或者關閉終端窗口。

{{% /tab %}}
{{% tab name="在命令列執行 Hugo" %}}

<!--
Alternately, install and use the `hugo` command on your computer:
-->
另一種方式是，在你的本地計算機上安裝並使用 `hugo` 命令：

<!--
1. Install the [Hugo (Extended edition)](https://gohugo.io/getting-started/installing/) and [Node](https://nodejs.org/en) version specified in
   [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml).

1. Install any dependencies:
-->
1. 安裝 [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml)
   文件中指定的 [Hugo（擴展版）](https://gohugo.io/getting-started/installing/)
   和 [Node](https://nodejs.org/zh-cn) 版本。

2. 安裝所有依賴項：

   ```shell
   npm ci
   ```

<!--
1. In a terminal, go to your Kubernetes website repository and start the Hugo server:
-->
3. 啓動一個終端窗口，進入 Kubernetes 網站倉庫目錄，啓動 Hugo 伺服器：

   ```shell
   cd <path_to_your_repo>/website
   make server
   ```

   <!--
   If you're on a Windows machine or unable to run the `make` command, use the following command:
   -->
   如果你使用的是 Windows 機器或無法運行 `make` 命令，請使用以下命令：

   ```
   hugo server --buildFuture
   ```

<!--
1. In a web browser, navigate to `http://localhost:1313`. Hugo watches the
   changes and rebuilds the site as needed.

1. To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`,
   or close the terminal window.
-->
4. 在瀏覽器的地址欄輸入： `http://localhost:1313`。
   Hugo 會監測文件的變更並根據需要重新構建網站。

5. 要停止本地 Hugo 實例，返回到終端窗口並輸入 `Ctrl+C` 或者關閉終端窗口。

{{% /tab %}}
{{< /tabs >}}

<!--
### Open a pull request from your fork to kubernetes/website {#open-a-pr}
-->
### 從你的克隆副本向 kubernetes/website 發起拉取請求（PR）   {#open-a-pr}

<!-- 
Figure 3 shows the steps to open a PR from your fork to the [kubernetes/website](https://github.com/kubernetes/website). The details follow.

Please, note that contributors can mention `kubernetes/website` as `k/website`.
-->
圖 3 顯示了從你的克隆副本向 kubernetes/website 發起 PR 的步驟。
詳細信息如下。

請注意，貢獻者可以將 `kubernetes/website` 稱爲 `k/website`。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
subgraph first[ ]
direction TB
1[1. 前往 kubernetes/website 倉庫] --> 2[2. 選擇 New Pull Request]
2 --> 3[3. 選擇 compare across forks]
3 --> 4[4. 從 head repository 下拉菜單<br>選擇你的克隆副本]
end
subgraph second [ ]
direction TB
5[5. 從 compare 下拉菜單<br>選擇你的分支] --> 6[6. 選擇 Create Pull Request]
6 --> 7[7. 爲你的 PR<br>添加一個描述]
7 --> 8[8. 選擇 Create pull request]
end

first --> second

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
class 1,2,3,4,5,6,7,8 grey
class first,second white
{{</ mermaid >}}

<!-- 
Figure 3. Steps to open a PR from your fork to the kubernetes/website.
-->
圖 3. 從你的克隆副本向 kubernetes/website 發起一個 PR 的步驟。

<!--
1. In a web browser, go to the [`kubernetes/website`](https://github.com/kubernetes/website/) repository.
1. Select **New Pull Request**.
1. Select **compare across forks**.
1. From the **head repository** drop-down menu, select your fork.
1. From the **compare** drop-down menu, select your branch.
1. Select **Create Pull Request**.
1. Add a description for your pull request:

    - **Title** (50 characters or less): Summarize the intent of the change.
    - **Description**: Describe the change in more detail.

      - If there is a related GitHub issue, include `Fixes #12345` or `Closes #12345` in the
        description. GitHub's automation closes the mentioned issue after merging the PR if used.
        If there are other related PRs, link those as well.
      - If you want advice on something specific, include any questions you'd like reviewers to
        think about in your description.

1. Select the **Create pull request** button.

Congratulations! Your pull request is available in [Pull requests](https://github.com/kubernetes/website/pulls).
-->
1. 在 Web 瀏覽器中，前往 [`kubernetes/website`](https://github.com/kubernetes/website/) 倉庫；
1. 點擊 **New Pull Request**；
1. 選擇 **compare across forks**；
1. 從 **head repository** 下拉菜單中，選取你的派生倉庫；
1. 從 **compare** 下拉菜單中，選擇你的分支；
1. 點擊 **Create Pull Request**；
1. 爲你的拉取請求添加一個描述：

    - **Title** （不超過 50 個字符）：總結變更的目的；
    - **Description**：給出變更的詳細信息；

      - 如果存在一個相關聯的 GitHub Issue，可以在描述中包含 `Fixes #12345` 或
        `Closes #12345`。GitHub 的自動化設施能夠在當前 PR 被合併時自動關閉所提及
        的 Issue。如果有其他相關聯的 PR，也可以添加對它們的鏈接。
      - 如果你特別希望獲得某方面的建議，可以在描述中包含你希望評閱人思考的問題。

1. 點擊 **Create pull request** 按鈕。

祝賀你！你的拉取請求現在出現在 [Pull Requests](https://github.com/kubernetes/website/pulls) 列表中了！

<!--
After opening a PR, GitHub runs automated tests and tries to deploy a preview using
[Netlify](https://www.netlify.com/).

- If the Netlify build fails, select **Details** for more information.
- If the Netlify build succeeds, select **Details** opens a staged version of the Kubernetes
  website with your changes applied. This is how reviewers check your changes.

GitHub also automatically assigns labels to a PR, to help reviewers. You can add them too, if
needed. For more information, see [Adding and removing issue labels](/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels).
-->
在發起 PR 之後，GitHub 會執行一些自動化的測試，並嘗試使用
[Netlify](https://www.netlify.com/) 部署一個預覽版本。

- 如果 Netlify 構建操作失敗，可選擇 **Details** 瞭解詳細信息。
- 如果 Netlify 構建操作成功，選擇 **Details** 會打開 Kubernetes 的一個預覽版本，
  其中包含了你所作的變更。評閱人也使用這一功能來檢查你的變更。

GitHub 也會自動爲 PR 分派一些標籤，以幫助評閱人。
如果有需要，你也可以向 PR 添加標籤。
欲瞭解相關詳細信息，可以參考
[添加和刪除 Issue 標籤](/zh-cn/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels)。

<!--
### Addressing feedback locally

1. After making your changes, amend your previous commit:
-->
### 在本地處理反饋   {#addressing-feedback-locally}

1. 在本地完成修改之後，可以修補（amend）你之前的提交：

   ```shell
   git commit -a --amend
   ```

   <!--
   - `-a`: commits all changes
   - `--amend`: amends the previous commit, rather than creating a new one
   -->
   - `-a`：提交所有修改
   - `--amend`：對前一次提交進行增補，而不是創建新的提交

<!--
1. Update your commit message if needed.

1. Use `git push origin <my_new_branch>` to push your changes and re-run the Netlify tests.
-->
2. 如果有必要，更新你的提交消息；

3. 使用 `git push origin <my_new_branch>` 來推送你的變更，重新觸發 Netlify 測試。

   <!--
   If you use `git commit -m` instead of amending, you must [squash your commits](#squashing-commits)
   before merging.
   -->
   {{< note >}}
   如果你使用 `git commit -m` 而不是增補參數，在 PR 最終合併之前你必須
   [squash 你的提交](#squashing-commits)。
   {{< /note >}}

<!--
#### Changes from reviewers

Sometimes reviewers commit to your pull request. Before making any other changes, fetch those commits.

1. Fetch commits from your remote fork and rebase your working branch:
-->
#### 來自評閱人的修改   {#changes-from-reviewers}

有時評閱人會向你的 PR 中提交修改。在作出其他修改之前，請先取回這些提交。

1. 從你的遠程派生副本倉庫取回提交，讓你的工作分支基於所取回的分支：

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

<!--
1. After rebasing, force-push new changes to your fork:
-->
2. 變更基線（rebase）操作完成之後，強制推送本地的新改動到你的派生倉庫：

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

<!--
#### Merge conflicts and rebasing

For more information, see [Git Branching - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts),
[Advanced Merging](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging), or ask in the
`#sig-docs` Slack channel for help.
-->
#### 合併衝突和重設基線   {#merge-conflicts-and-rebasing}

{{< note >}}
要了解更多信息，可參考
[Git Branching - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts)、
[Advanced Merging](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)，
或者在 `#sig-docs` Slack 頻道尋求幫助。
{{< /note >}}

<!--
If another contributor commits changes to the same file in another PR, it can create a merge
conflict. You must resolve all merge conflicts in your PR.

1. Update your fork and rebase your local branch:
-->
如果另一個貢獻者在別的 PR 中提交了對同一文件的修改，這可能會造成合並衝突。
你必須在你的 PR 中解決所有合併衝突。

1. 更新你的派生副本，重設本地分支的基線：

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

   <!--
   Then force-push the changes to your fork:
   -->
   之後強制推送修改到你的派生副本倉庫：

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

<!--
1. Fetch changes from `kubernetes/website`'s `upstream/main` and rebase your branch:
-->
2. 從 `kubernetes/website` 的 `upstream/main` 分支取回更改，然後重設本地分支的基線：

   ```shell
   git fetch upstream
   git rebase upstream/main
   ```

<!--
1. Inspect the results of the rebase:
-->
3. 檢查重設基線操作之後的狀態：

   ```shell
   git status
   ```

   <!--
   This results in a number of files marked as conflicted.
   -->
   你會看到一組存在衝突的文件。

<!--
1. Open each conflicted file and look for the conflict markers: `>>>`, `<<<`, and `===`.
   Resolve the conflict and delete the conflict marker.
-->
4. 打開每個存在衝突的文件，查找衝突標記：`>>>`、`<<<` 和 `===`。
   解決完衝突之後刪除衝突標記。

   {{< note >}}
   <!--
   For more information, see [How conflicts are presented](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented).
   -->
   進一步的詳細信息可參見
   [衝突是怎樣表示的](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented).
   {{< /note >}}

<!--
1. Add the files to the changeset:
-->
5. 添加文件到變更集合：

   ```shell
   git add <filename>
   ```

<!--
1. Continue the rebase:
-->
6. 繼續執行基線變更（rebase）操作：

   ```shell
   git rebase --continue
   ```

<!--
1. Repeat steps 2 to 5 as needed.

   After applying all commits, the `git status` command shows that the rebase is complete.
-->
7. 根據需要重複步驟 2 到 5。

   在應用完所有提交之後，`git status` 命令會顯示 rebase 操作完成。

<!--
1. Force-push the branch to your fork:
-->
8. 將分支強制推送到你的派生倉庫：

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

   <!--
   The pull request no longer shows any conflicts.
   -->
   PR 不再顯示存在衝突。

<!--
### Squashing commits
-->
### 壓縮（Squashing）提交   {#squashing-commits}

{{< note >}}
<!--
For more information, see [Git Tools - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History),
or ask in the `#sig-docs` Slack channel for help.
-->
要了解更多信息，可參看
[Git Tools - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)，
或者在 `#sig-docs` Slack 頻道尋求幫助。
{{< /note >}}

<!--
If your PR has multiple commits, you must squash them into a single commit before merging your PR.
You can check the number of commits on your PR's **Commits** tab or by running the `git log`
command locally.
-->
如果你的 PR 包含多個提交（commits），你必須將其壓縮成一個提交才能被合併。
你可以在 PR 的 **Commits** Tab 頁面查看提交個數，也可以在本地通過
`git log` 命令查看提交個數。

{{< note >}}
<!--
This topic assumes `vim` as the command line text editor.
-->
本主題假定使用 `vim` 作爲命令列文本編輯器。
{{< /note >}}

<!--
1. Start an interactive rebase:
-->
1. 啓動一個交互式的 rebase 操作：

   ```shell
   git rebase -i HEAD~<number_of_commits_in_branch>
   ```

   <!--
   Squashing commits is a form of rebasing. The `-i` switch tells git you want to rebase interactively.
   `HEAD~<number_of_commits_in_branch` indicates how many commits to look at for the rebase.
   -->

   壓縮提交的過程也是一種重設基線的過程。
   這裏的 `-i` 開關告訴 git 你希望交互式地執行重設基線操作。
   `HEAD~<number_of_commits_in_branch` 表明在 rebase 操作中查看多少個提交。

   <!--
   Output is similar to:
   -->

   輸出類似於；

   ```none
   pick d875112ca Original commit
   pick 4fa167b80 Address feedback 1
   pick 7d54e15ee Address feedback 2

   # Rebase 3d18sf680..7d54e15ee onto 3d183f680 (3 commands)

   ...

   # These lines can be re-ordered; they are executed from top to bottom.
   ```

   <!--
   The first section of the output lists the commits in the rebase. The second section lists the
   options for each commit. Changing the word `pick` changes the status of the commit once the rebase
   is complete.

   For the purposes of rebasing, focus on `squash` and `pick`.
   -->

   輸出的第一部分列舉了重設基線操作中的提交。
   第二部分給出每個提交的選項。
   改變單詞 `pick` 就可以改變重設基線操作之後提交的狀態。

   就重設基線操作本身，我們關注 `squash` 和 `pick` 選項。

   {{< note >}}
   <!--
   For more information, see [Interactive Mode](https://git-scm.com/docs/git-rebase#_interactive_mode).
   -->
   進一步的詳細信息可參考 [Interactive Mode](https://git-scm.com/docs/git-rebase#_interactive_mode)。
   {{< /note >}}

<!--
1. Start editing the file.

   Change the original text:
-->

2. 開始編輯文件。

   修改原來的文本：

   ```none
   pick d875112ca Original commit
   pick 4fa167b80 Address feedback 1
   pick 7d54e15ee Address feedback 2
   ```

   <!--
   To:
   -->
   使之成爲：

   ```none
   pick d875112ca Original commit
   squash 4fa167b80 Address feedback 1
   squash 7d54e15ee Address feedback 2
   ```

   <!--
   This squashes commits `4fa167b80 Address feedback 1` and `7d54e15ee Address feedback 2` into
   `d875112ca Original commit`, leaving only `d875112ca Original commit` as a part of the timeline.
   -->
   以上編輯操作會壓縮提交 `4fa167b80 Address feedback 1` 和 `7d54e15ee Address feedback 2`
   到 `d875112ca Original commit` 中，只留下 `d875112ca Original commit` 成爲時間線中的一部分。

<!--
1. Save and exit your file.

1. Push your squashed commit:
-->
3. 保存文件並退出編輯器。

4. 推送壓縮後的提交：

   ```shell
   git push --force-with-lease origin <branch_name>
   ```

<!--
## Contribute to other repos

The [Kubernetes project](https://github.com/kubernetes) contains 50+ repositories. Many of these
repositories contain documentation: user-facing help text, error messages, API references or code
comments.

If you see text you'd like to improve, use GitHub to search all repositories in the Kubernetes
organization. This can help you figure out where to submit your issue or PR.
-->
## 貢獻到其他倉庫   {#contribute-to-other-repos}

[Kubernetes 項目](https://github.com/kubernetes)包含大約 50 多個倉庫。
這些倉庫中很多都有文檔：提供給最終使用者的幫助文本、錯誤信息、API 參考或者代碼註釋等。

如果你發現有些文本需要改進，可以使用 GitHub 來搜索 Kubernetes 組織下的所有倉庫。
這樣有助於發現要在哪裏提交 Issue 或 PR。

<!--
Each repository has its own processes and procedures. Before you file an issue or submit a PR,
read that repository's `README.md`, `CONTRIBUTING.md`, and `code-of-conduct.md`, if they exist.

Most repositories use issue and PR templates. Have a look through some open issues and PRs to get
a feel for that team's processes. Make sure to fill out the templates with as much detail as
possible when you file issues or PRs.
-->
每個倉庫有其自己的流程和過程。在登記 Issue 或者發起 PR 之前，
記得閱讀倉庫可能存在的 `README.md`、`CONTRIBUTING.md` 和
`code-of-conduct.md` 文件。

大多數倉庫都有自己的 Issue 和 PR 模板。
通過查看一些待解決的 Issue 和 PR，
你可以大致瞭解協作的流程。
在登記 Issue 或提出 PR 時，務必儘量填充所給的模板，多提供詳細信息。

## {{% heading "whatsnext" %}}

<!--
- Read [Reviewing](/docs/contribute/review/reviewing-prs) to learn more about the review process.
-->
- 閱讀[評閱](/zh-cn/docs/contribute/review/reviewing-prs)節，學習評閱過程。
