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
<!--
{{< note >}}
**Code developers**: If you are documenting a new feature for an
upcoming Kubernetes release, see
[Document a new feature](/docs/contribute/new-content/new-features/).
{{< /note >}}

To contribute new content pages or improve existing content pages, open a pull request (PR). Make sure you follow all the requirements in the [Before you begin](/docs/contribute/new-content/overview/#before-you-begin) section.
-->
{{< note >}}
**程式碼開發者們**：如果你在為下一個 Kubernetes 發行版本中的某功能特性撰寫文件，
請參考[為發行版本撰寫功能特性文件](/zh-cn/docs/contribute/new-content/new-features/)。
{{< /note >}}

要貢獻新的內容頁面或者改進已有內容頁面，請發起拉取請求（PR）。
請確保你滿足了[開始之前](/zh-cn/docs/contribute/new-content/#before-you-begin)一節中所列舉的所有要求。

<!--
If your change is small, or you're unfamiliar with git, read [Changes using
GitHub](#changes-using-github) to learn how to edit a page.

If your changes are large, read [Work from a local fork](#fork-the-repo) to
learn how to make changes locally on your computer.
-->
如果你所提交的變更足夠小，或者你對 git 工具不熟悉，可以閱讀
[使用 GitHub 提交變更](#changes-using-github)以瞭解如何編輯頁面。

如果所提交的變更較大，請閱讀[基於本地克隆副本開展工作](#fork-the-repo)以學習
如何在你本地計算機上進行修改。

<!-- body -->

<!-- 
## Changes using GitHub

If you're less experienced with git workflows, here's an easier method of
opening a pull request. The figure below outlines the steps and the details follow.
-->
## 使用 GitHub 提交變更 {#changes-using-github}

如果你在 git 工作流方面欠缺經驗，這裡有一種發起拉取請求的更為簡單的方法。
下圖勾勒了後續的步驟和細節。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
A([fa:fa-user 新的<br>貢獻者]) --- id1[(K8s/Website<br>GitHub)]
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

***插圖 - 使用 GitHub 發起一個 PR 的步驟***

<!--
1.  On the page where you see the issue, select the pencil icon at the top right.
    You can also scroll to the bottom of the page and select **Edit this page**.
2.  Make your changes in the GitHub markdown editor.
3.  Below the editor, fill in the **Propose file change**
    form. In the first field, give your commit message a title. In
    the second field, provide a description.
-->

1. 在你發現問題的網頁，選擇右上角的鉛筆圖示。
   你也可以滾動到頁面底端，選擇**編輯此頁**。
2. 在 GitHub 的 Markdown 編輯器中修改內容。
3. 在編輯器的下方，填寫 **Propose file change** 表單。
   在第一個欄位中，為你的提交訊息取一個標題。
   在第二個欄位中，為你的提交寫一些描述文字。
<!-- 
    {{< note >}}
    Do not use any [GitHub Keywords](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) in your commit message. You can add those to the pull request
    description later.
    {{< /note >}}
-->
   {{< note >}}
   不要在提交訊息中使用 [GitHub 關鍵詞](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)。
   你可以在後續的 PR 描述中使用這些關鍵詞。
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
4. 選擇 **Propose File Change**。
5. 選擇 **Create pull request**。
6. 出現 **Open a pull request** 介面。填寫表單：

    - **Subject** 欄位預設為提交的概要資訊。你可以根據需要修改它。
    - **Body** 欄位包含更為詳細的提交訊息，如果你之前有填寫過的話，
      以及一些模板文字。填寫模板所要求的詳細資訊，
      之後刪除多餘的模板文字。
    - 確保 **Allow edits from maintainers** 複選框被勾選。

   <!--
   PR descriptions are a great way to help reviewers understand your change. For
   more information, see [Opening a PR](#open-a-pr).
   -->
   {{< note >}}
   PR 描述資訊是幫助 PR 評閱人瞭解你所提議的變更的重要途徑。
   更多資訊請參考[發起一個 PR](#open-a-pr)。
   {{< /note >}}

<!-- 7.  Select **Create pull request**.  -->
7. 選擇 **Create pull request**。

<!--
### Addressing feedback in GitHub

Before merging a pull request, Kubernetes community members review and
approve it. The `k8s-ci-robot` suggests reviewers based on the nearest
owner mentioned in the pages. If you have someone specific in mind,
leave a comment with their GitHub username in it.
-->
### 在 GitHub 上處理反饋意見

在合併 PR 之前，Kubernetes 社群成員會評閱並批准它。
`k8s-ci-robot` 會基於頁面中最近提及的屬主來建議評閱人（reviewers）。
如果你希望特定某人來評閱，可以留下評論，提及該使用者的 GitHub 使用者名稱。

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
如果某個評閱人請你修改 PR：

1. 前往 **Files changed** Tab 頁面；
1. 選擇 PR 所修改的任何檔案所對應的鉛筆（edit）圖示；
1. 根據建議作出修改；
1. 提交所作修改。

如果你希望等待評閱人的反饋，可以每 7 天左右聯絡一次。
你也可以在 `#sig-docs` Slack 頻道傳送訊息。

當評閱過程結束，某個評閱人會合並你的 PR。
幾分鐘之後，你所做的變更就會上線了。

<!--
## Work from a local fork {#fork-the-repo}

If you're more experienced with git, or if your changes are larger than a few lines,
work from a local fork.

Make sure you have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed on your computer. You can also use a git UI application.

The figure below shows the steps to follow when you work from a local fork. The details for each step follow.
-->
## 基於本地克隆副本開展工作 {#work-from-a-local-fork}

如果你有 git 的使用經驗，或者你要提議的修改不僅僅幾行，請使用本地克隆副本
來開展工作。

首先要確保你在本地計算機上安裝了 [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。
你也可以使用 git 的帶使用者介面的應用。

下圖顯示了基於本地克隆副本開展工作的步驟。
每個步驟的細節如下。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
1[派生 K8s/website<br>倉庫] --> 2[建立本地克隆副本<br>並指定 upstream 倉庫]
subgraph changes[你的變更]
direction TB
S[ ] -.-
3[建立一個分支<br>例如: my_new_branch] --> 3a[使用文字編輯器<br>進行修改] --> 4["使用 Hugo 在本地<br>預覽你的變更<br>(localhost:1313)<br>或構建容器映象"]
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
***Figure - Working from a local fork to make your changes***
-->
***插圖 - 使用本地克隆副本進行修改***

<!--
### Fork the kubernetes/website repository

1. Navigate to the [`kubernetes/website`](https://github.com/kubernetes/website/) repository.
2. Select **Fork**.
-->
### 派生 kubernetes/website 倉庫

1. 前往 [`kubernetes/website`](https://github.com/kubernetes/website/) 倉庫；
2. 選擇 **Fork**.

<!--
### Create a local clone and set the upstream

3. In a terminal window, clone your fork and update the [Docsy Hugo theme](https://github.com/google/docsy#readme):
-->
### 建立一個本地克隆副本並指定 upstream 倉庫

3. 開啟終端視窗，克隆你所派生的副本，並更新 [Docsy Hugo 主題](https://github.com/google/docsy#readme)：

    ```bash
    git clone git@github.com/<github_username>/website
    cd website
    git submodule update --init --recursive --depth 1
    ```

<!--
4. Navigate to the new `website` directory. Set the `kubernetes/website` repository as the `upstream` remote:
-->
4. 前往新的 `website` 目錄，將 `kubernetes/website` 倉庫設定為 `upstream`
   遠端：

      ```bash
      cd website
      git remote add upstream https://github.com/kubernetes/website.git
      ```

<!--
5. Confirm your `origin` and `upstream` repositories:
-->
5. 確認你現在有兩個倉庫，`origin` 和 `upstream`：

    ```bash
    git remote -v
    ```

    <!-- Output is similar to: -->
    輸出類似於：

    ```bash
    origin	git@github.com:<github_username>/website.git (fetch)
    origin	git@github.com:<github_username>/website.git (push)
    upstream	https://github.com/kubernetes/website.git (fetch)
    upstream	https://github.com/kubernetes/website.git (push)
    ```
<!--
6. Fetch commits from your fork's `origin/master` and `kubernetes/website`'s `upstream/main`:
-->
6. 從你的克隆副本取回 `origin/master` 分支，從 `kubernetes/website` 取回 `upstream/main`：

    ```bash
    git fetch origin
    git fetch upstream
    ```
   <!--
   This makes sure your local repository is up to date before you start making changes.
   -->
   這樣可以確保你本地的倉庫在開始工作前是最新的。

   <!--
    {{< note >}}
    This workflow is different than the [Kubernetes Community GitHub Workflow](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md). You do not need to merge your local copy of `main` with `upstream/main` before pushing updates to your fork.
    {{< /note >}}
   -->
    {{< note >}}
    此工作流程與 [Kubernetes 社群 GitHub 工作流](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md)有所不同。
    在推送你的變更到你的遠端派生副本庫之前，你不需要將你本地的 `main` 與 `upstream/main` 合併。
    {{< /note >}}

<!--
### Create a branch

1. Decide which branch base to your work on:

  - For improvements to existing content, use `upstream/main`.
  - For new content about existing features, use `upstream/main`.
  - For localized content, use the localization's conventions. For more information, see [localizing Kubernetes documentation](/docs/contribute/localization/).
  - For new features in an upcoming Kubernetes release, use the feature branch. For more information, see [documenting for a release](/docs/contribute/new-content/new-features/).
  - For long-running efforts that multiple SIG Docs contributors collaborate on,
    like content reorganization, use a specific feature branch created for that
    effort.

    If you need help choosing a branch, ask in the `#sig-docs` Slack channel.
-->
### 建立一個分支

1. 決定你要基於哪個分支來開展工作：

   - 針對已有內容的改進，請使用 `upstream/main`。
   - 針對已有功能特性的新文件內容，請使用 `upstream/main`。
   - 對於本地化內容，請基於本地化的約定。
     可參考[本地化 Kubernetes 文件](/zh-cn/docs/contribute/localization/)瞭解詳細資訊。
   - 對於在下一個 Kubernetes 版本中新功能特性的文件，使用獨立的功能特性分支。
     參考[為發行版本撰寫功能特性文件](/zh-cn/docs/contribute/new-content/new-features/)瞭解更多資訊。
   - 對於很多 SIG Docs 共同參與的，需較長時間才完成的任務，例如內容的重構，
     請使用為該任務建立的特性分支。

   如果你在選擇分支上需要幫助，請在 `#sig-docs` Slack 頻道提問。

<!--
2. Create a new branch based on the branch identified in step 1. This example assumes the base branch is `upstream/main`:
-->
2. 基於第 1 步中選定的分支，建立新分支。
   下面的例子假定基礎分支是 `upstream/main`：

    ```bash
    git checkout -b <my_new_branch> upstream/main
    ```
<!--
3.  Make your changes using a text editor.
-->

3. 使用文字編輯器進行修改。

<!--
At any time, use the `git status` command to see what files you've changed.
-->

在任何時候，都可以使用 `git status` 命令檢視你所改變了的檔案列表。

<!--
### Commit your changes

When you are ready to submit a pull request, commit your changes.
-->
### 提交你的變更

當你準備好發起拉取請求（PR）時，提交你所做的變更。

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
1. 在你的本地倉庫中，檢查你要提交的檔案：

    ```bash
    git status
    ```

    輸出類似於：

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
2. 將 **Changes not staged for commit** 下列舉的檔案新增到提交中：

    ```bash
    git add <your_file_name>
    ```

    針對每個檔案重複此操作。
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
3. 新增完所有檔案之後，建立一個提交（commit）：

    ```bash
    git commit -m "Your commit message"
    ```

    {{< note >}}
    不要在提交訊息中使用任何 [GitHub 關鍵詞](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)。
    你可以在後續的 PR 描述中使用這些關鍵詞。
    {{< /note >}}
<!--
4. Push your local branch and its new commit to your remote fork:

    ```bash
    git push origin <my_new_branch>
    ```
-->
4. 推送你本地分支及其中的新提交到你的遠端派生副本庫：

    ```bash
    git push origin <my_new_branch>
    ```

<!--
### Preview your changes locally {#preview-locally}

It's a good idea to preview your changes locally before pushing them or opening a pull request. A preview lets you catch build errors or markdown formatting problems.

You can either build the website's container image or run Hugo locally. Building the container image is slower but displays [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/), which can be useful for debugging.
-->
### 在本地預覽你的變更 {#preview-locally}

在推送變更或者發起 PR 之前在本地檢視一下預覽是個不錯的主意。
透過預覽你可以發現構建錯誤或者 Markdown 格式問題。

你可以構建網站的容器映象或者在本地執行 Hugo。
構建容器映象的方式比較慢，不過能夠顯示 [Hugo 短程式碼（shortcodes）](/zh-cn/docs/contribute/style/hugo-shortcodes/)，
因此對於除錯是很有用的。

{{< tabs name="tab_with_hugo" >}}
{{% tab name="在容器內執行 Hugo" %}}

<!--
{{< note >}}
The commands below use Docker as default container engine. Set the `CONTAINER_ENGINE` environment variable to override this behaviour.
{{< /note >}}
-->
{{< note >}}
下面的命令中使用 Docker 作為預設的容器引擎。
如果需要過載這一行為，可以設定 `CONTAINER_ENGINE` 環境變數。
{{< /note >}}

<!--
1.  Build the image locally:
-->
1. 在本地構建映象：

      ```bash
      # 使用 docker (預設)
      make container-image

      ### 或 ###

      # 使用 podman
      CONTAINER_ENGINE=podman make container-image
      ```

<!--
2. After building the `kubernetes-hugo` image locally, build and serve the site:
-->
2. 在本地構建了 `kubernetes-hugo` 映象之後，可以構建並啟動網站：

      ```bash
      # 使用 docker (預設)
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
3. 啟動瀏覽器，瀏覽 `https://localhost:1313`。
   Hugo 會監測檔案的變更並根據需要重新構建網站。

4. 要停止本地 Hugo 例項，可返回到終端並輸入 `Ctrl+C`，或者關閉終端視窗。

{{% /tab %}}
{{% tab name="在命令列執行 Hugo" %}}

<!--
Alternately, install and use the `hugo` command on your computer:
-->
另一種方式是，在你的本地計算機上安裝並使用 `hugo` 命令：

<!--
1.  Install the [Hugo](https://gohugo.io/getting-started/installing/) version specified in [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml).
2.  If you have not updated your website repository, the `website/themes/docsy` directory is empty.
    The site cannot build without a local copy of the theme. To update the website theme, run:
3.  In a terminal, go to your Kubernetes website repository and start the Hugo server:
-->
1. 安裝 [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml)
   檔案中指定的 [Hugo](https://gohugo.io/getting-started/installing/) 版本。

2.  如果你尚未更新你的網站倉庫，則 `website/themes/docsy` 目錄是空的。
    如果本地缺少主題的副本，則該站點無法構建。
    要更新網站主題，執行以下命令：

    ```bash
    git submodule update --init --recursive --depth 1
    ```

3. 啟動一個終端視窗，進入 Kubernetes 網站倉庫目錄，啟動 Hugo 伺服器：

      ```bash
      cd <path_to_your_repo>/website
      hugo server
      ```
<!--
4.  In a web browser, navigate to `https://localhost:1313`. Hugo watches the
    changes and rebuilds the site as needed.
5.  To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`,
    or close the terminal window.
-->
4. 在瀏覽器的位址列輸入： `https://localhost:1313`。
   Hugo 會監測檔案的變更並根據需要重新構建網站。
5. 要停止本地 Hugo 例項，返回到終端視窗並輸入 `Ctrl+C` 或者關閉終端視窗。

{{% /tab %}}
{{< /tabs >}}

<!--
### Open a pull request from your fork to kubernetes/website {#open-a-pr}
-->
### 從你的克隆副本向 kubernetes/website 發起拉取請求（PR） {#open-a-pr}

<!-- 
The figure below shows the steps to open a PR from your fork to the K8s/website. The details follow.
-->
下圖顯示了從你的克隆副本向 K8s/website 發起 PR 的步驟。
詳細資訊如下。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
subgraph first[ ]
direction TB
1[1. 前往 K8s/website 倉庫] --> 2[2. 選擇 New Pull Request]
2 --> 3[3. 選擇 compare across forks]
3 --> 4[4. 從 head repository 下拉選單<br>選擇你的克隆副本]
end
subgraph second [ ]
direction TB
5[5. 從 compare 下拉選單<br>選擇你的分支] --> 6[6. 選擇 Create Pull Request]
6 --> 7[7. 為你的 PR<br>新增一個描述]
7 --> 8[8. 選擇 Create pull request]
end

first --> second

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
class 1,2,3,4,5,6,7,8 grey
class first,second white
{{</ mermaid >}}
<!-- 
***Figure - Steps to open a PR from your fork to the K8s/website***
-->
***插圖 - 從你的克隆副本向 K8s/website 發起一個 PR 的步驟***

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
1. 在 Web 瀏覽器中，前往 [`kubernetes/website`](https://github.com/kubernetes/website/) 倉庫；
2. 點選 **New Pull Request**；
3. 選擇 **compare across forks**；
4. 從 **head repository** 下拉選單中，選取你的派生倉庫；
5. 從 **compare** 下拉選單中，選擇你的分支；
6. 點選 **Create Pull Request**；
7. 為你的拉取請求新增一個描述：
    - **Title** （不超過 50 個字元）：總結變更的目的；
    - **Description**：給出變更的詳細資訊；
      - 如果存在一個相關聯的 GitHub Issue，可以在描述中包含 `Fixes #12345` 或
        `Closes #12345`。GitHub 的自動化設施能夠在當前 PR 被合併時自動關閉所提及
        的 Issue。如果有其他相關聯的 PR，也可以新增對它們的連結。
      - 如果你特別希望獲得某方面的建議，可以在描述中包含你希望評閱人思考的問題。
8. 點選 **Create pull request** 按鈕。

   祝賀你！你的拉取請求現在出現在 [Pull Requests](https://github.com/kubernetes/website/pulls) 列表中了！

<!--
After opening a PR, GitHub runs automated tests and tries to deploy a preview using [Netlify](https://www.netlify.com/).

  - If the Netlify build fails, select **Details** for more information.
  - If the Netlify build succeeds, select **Details** opens a staged version of the Kubernetes website with your changes applied. This is how reviewers check your changes.

GitHub also automatically assigns labels to a PR, to help reviewers. You can add them too, if needed. For more information, see [Adding and removing issue labels](/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels).
-->
在發起 PR 之後，GitHub 會執行一些自動化的測試，並嘗試使用
[Netlify](https://www.netlify.com/) 部署一個預覽版本。

  - 如果 Netlify 構建操作失敗，可選擇 **Details** 瞭解詳細資訊。
  - 如果 Netlify 構建操作成功，選擇 **Details** 會開啟 Kubernetes 的一個預覽
    版本，其中包含了你所作的變更。評閱人也使用這一功能來檢查你的變更。

GitHub 也會自動為 PR 分派一些標籤，以幫助評閱人。
如果有需要，你也可以向 PR 新增標籤。
欲瞭解相關詳細資訊，可以參考
[新增和刪除 Issue 標籤](/zh-cn/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels)。

<!--
### Addressing feedback locally

1. After making your changes, amend your previous commit:
-->
### 在本地處理反饋

1. 在本地完成修改之後，可以修補（amend）你之前的提交：

    ```bash
    git commit -a --amend
    ```

    <!--
    - `-a`: commits all changes
    - `--amend`: amends the previous commit, rather than creating a new one
    -->
    - `-a`：提交所有修改
    - `--amend`：對前一次提交進行增補，而不是建立新的提交

<!--
2. Update your commit message if needed.
3. Use `git push origin <my_new_branch>` to push your changes and re-run the Netlify tests.
-->
2. 如果有必要，更新你的提交訊息；
3. 使用 `git push origin <my_new_branch>` 來推送你的變更，重新觸發 Netlify 測試。

   <!--
    {{< note >}}
      If you use `git commit -m` instead of amending, you must [squash your commits](#squashing-commits) before merging.
    {{< /note >}}
   -->
   {{< note >}}
   如果你使用 `git commit -m` 而不是增補引數，在 PR 最終合併之前你必須
   [squash 你的提交](#squashing-commits)。
   {{< /note >}}

<!--
#### Changes from reviewers

Sometimes reviewers commit to your pull request. Before making any other changes, fetch those commits.

1. Fetch commits from your remote fork and rebase your working branch:
-->
#### 來自評閱人的修改

有時評閱人會向你的 PR 中提交修改。在作出其他修改之前，請先取回這些提交。

1. 從你的遠端派生副本倉庫取回提交，讓你的工作分支基於所取回的分支：

    ```bash
    git fetch origin
    git rebase origin/<your-branch-name>
    ```
<!--
2. After rebasing, force-push new changes to your fork:
-->
2. 變更基線（rebase）操作完成之後，強制推送本地的新改動到你的派生倉庫：

    ```bash
    git push --force-with-lease origin <your-branch-name>
    ```

<!--
#### Merge conflicts and rebasing

{{< note >}}
For more information, see [Git Branching - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts), [Advanced Merging](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging), or ask in the `#sig-docs` Slack channel for help.
{{< /note >}}
-->
#### 合併衝突和重設基線

{{< note >}}
要了解更多資訊，可參考
[Git 分支管理 - 基本分支和合並](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts)、
[高階合併](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)，
或者在 `#sig-docs` Slack 頻道尋求幫助。
{{< /note >}}

<!--
If another contributor commits changes to the same file in another PR, it can create a merge conflict. You must resolve all merge conflicts in your PR.

1. Update your fork and rebase your local branch:
-->
如果另一個貢獻者在別的 PR 中提交了對同一檔案的修改，這可能會造成合並衝突。
你必須在你的 PR 中解決所有合併衝突。

1. 更新你的派生副本，重設本地分支的基線：

   ```bash
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

   <!-- Then force-push the changes to your fork:-->
   之後強制推送修改到你的派生副本倉庫：

   ```bash
   git push --force-with-lease origin <your-branch-name>
   ```
<!--
2. Fetch changes from `kubernetes/website`'s `upstream/main` and rebase your branch:
-->
2. 從 `kubernetes/website` 的 `upstream/main` 分支取回更改，然後重設本地分支的基線：

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
<!--
3. Inspect the results of the rebase:
-->
3. 檢查重設基線操作之後的狀態：

   ```bash
   git status
   ```

   <!-- This results in a number of files marked as conflicted. -->
   你會看到一組存在衝突的檔案。

<!--
4. Open each conflicted file and look for the conflict markers: `>>>`, `<<<`, and `===`. Resolve the conflict and delete the conflict marker.
-->
4. 開啟每個存在衝突的檔案，查詢衝突標記：`>>>`、`<<<` 和 `===`。
   解決完衝突之後刪除衝突標記。

    <!--
    For more information, see [How conflicts are presented](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented).
    -->
    {{< note >}}
    進一步的詳細資訊可參見
    [衝突是怎樣表示的](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented).
    {{< /note >}}

<!--
5. Add the files to the changeset:
-->
5. 新增檔案到變更集合：

    ```bash
    git add <filename>
    ```
<!--
6.  Continue the rebase:
-->
6. 繼續執行基線變更（rebase）操作：

    ```bash
    git rebase --continue
    ```

<!--
7.  Repeat steps 2 to 5 as needed.

    After applying all commits, the `git status` command shows that the rebase is complete.
-->
7. 根據需要重複步驟 2 到 5。

   在應用完所有提交之後，`git status` 命令會顯示 rebase 操作完成。

<!--
8. Force-push the branch to your fork:
-->
8. 將分支強制推送到你的派生倉庫：

    ```bash
    git push --force-with-lease origin <your-branch-name>
    ```

    <!-- The pull request no longer shows any conflicts. -->
    PR 不再顯示存在衝突。

<!--
### Squashing commits
-->
### 壓縮（Squashing）提交 {#squashing-commits}

<!--
{{< note >}}
For more information, see [Git Tools - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History), or ask in the `#sig-docs` Slack channel for help.
{{< /note >}}
-->
{{< note >}}
要了解更多資訊，可參看
[Git Tools - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)，
或者在 `#sig-docs` Slack 頻道尋求幫助。
{{< /note >}}

<!--
If your PR has multiple commits, you must squash them into a single commit before merging your PR. You can check the number of commits on your PR's **Commits** tab or by running the `git log` command locally.
-->
如果你的 PR 包含多個提交（commits），你必須將其壓縮成一個提交才能被合併。
你可以在 PR 的 **Commits** Tab 頁面檢視提交個數，也可以在本地透過
`git log` 命令檢視提交個數。

<!-- This topic assumes `vim` as the command line text editor.-->
{{< note >}}
本主題假定使用 `vim` 作為命令列文字編輯器。
{{< /note >}}

<!--
1. Start an interactive rebase:
-->
1. 啟動一個互動式的 rebase 操作：

    ```bash
    git rebase -i HEAD~<number_of_commits_in_branch>
    ```

    <!--
    Squashing commits is a form of rebasing. The `-i` switch tells git you want to rebase interactively. `HEAD~<number_of_commits_in_branch` indicates how many commits to look at for the rebase.
    -->
    壓縮提交的過程也是一種重設基線的過程。
    這裡的 `-i` 開關告訴 git 你希望互動式地執行重設基線操作。
    `HEAD~<number_of_commits_in_branch` 表明在 rebase 操作中檢視多少個提交。

    <!--Output is similar to:-->
    輸出類似於；

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
    輸出的第一部分列舉了重設基線操作中的提交。
    第二部分給出每個提交的選項。
    改變單詞 `pick` 就可以改變重設基線操作之後提交的狀態。

    就重設基線操作本身，我們關注 `squash` 和 `pick` 選項。

    <!--
    {{< note >}}
    For more information, see [Interactive Mode](https://git-scm.com/docs/git-rebase#_interactive_mode).
    {{< /note >}}
    -->
    {{< note >}}
    進一步的詳細資訊可參考 [Interactive Mode](https://git-scm.com/docs/git-rebase#_interactive_mode)。
    {{< /note >}}

<!--
2. Start editing the file.
    Change the original text:
-->

2. 開始編輯檔案。

    修改原來的文字：

    ```bash
    pick d875112ca Original commit
    pick 4fa167b80 Address feedback 1
    pick 7d54e15ee Address feedback 2
    ```

    <!-- To: -->
    使之成為：

    ```bash
    pick d875112ca Original commit
    squash 4fa167b80 Address feedback 1
    squash 7d54e15ee Address feedback 2
    ```

    <!--
    This squashes commits `4fa167b80 Address feedback 1` and `7d54e15ee Address feedback 2` into `d875112ca Original commit`, leaving only `d875112ca Original commit` as a part of the timeline.
    -->
    以上編輯操作會壓縮提交 `4fa167b80 Address feedback 1` 和 `7d54e15ee Address feedback 2`
    到 `d875112ca Original commit` 中，只留下 `d875112ca Original commit` 成為時間線中的一部分。

<!--
3. Save and exit your file.
4. Push your squashed commit:
-->
3. 儲存檔案並退出編輯器。

4. 推送壓縮後的提交：

    ```bash
    git push --force-with-lease origin <branch_name>
    ```

<!--
## Contribute to other repos

The [Kubernetes project](https://github.com/kubernetes) contains 50+ repositories. Many of these repositories contain documentation: user-facing help text, error messages, API references or code comments.

If you see text you'd like to improve, use GitHub to search all repositories in the Kubernetes organization.
This can help you figure out where to submit your issue or PR.
-->
## 貢獻到其他倉庫

[Kubernetes 專案](https://github.com/kubernetes)包含大約 50 多個倉庫。
這些倉庫中很多都有文件：提供給終端使用者的幫助文字、錯誤資訊、API 參考或者程式碼註釋等。

如果你發現有些文字需要改進，可以使用 GitHub 來搜尋 Kubernetes 組織下的所有倉庫。
這樣有助於發現要在哪裡提交 Issue 或 PR。

<!--
Each repository has its own processes and procedures. Before you file an
issue or submit a PR, read that repository's `README.md`, `CONTRIBUTING.md`, and
`code-of-conduct.md`, if they exist.

Most repositories use issue and PR templates. Have a look through some open
issues and PRs to get a feel for that team's processes. Make sure to fill out
the templates with as much detail as possible when you file issues or PRs.
-->
每個倉庫有其自己的流程和過程。在登記 Issue 或者發起 PR 之前，
記得閱讀倉庫可能存在的 `README.md`、`CONTRIBUTING.md` 和
`code-of-conduct.md` 檔案。

大多數倉庫都有自己的 Issue 和 PR 模板。
透過檢視一些待解決的 Issue 和 PR，
你可以大致瞭解協作的流程。
在登記 Issue 或提出 PR 時，務必儘量填充所給的模板，多提供詳細資訊。

## {{% heading "whatsnext" %}}

<!--
- Read [Reviewing](/docs/contribute/reviewing/revewing-prs) to learn more about the review process.
-->
- 閱讀[評閱](/zh-cn/docs/contribute/review/reviewing-prs)節，學習評閱過程。

