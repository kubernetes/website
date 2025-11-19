<!--
# Internal link checking tool
-->
# 內置鏈接檢查工具

<!--
You can use [htmltest](https://github.com/wjdp/htmltest) to check for broken links in
[`/content/en/`](https://git.k8s.io/website/content/en/). This is useful when refactoring
sections of content, moving pages around, or renaming files or page headers.
-->
你可以使用 [htmltest](https://github.com/wjdp/htmltest) 來檢查
[`/content/en/`](https://git.k8s.io/website/content/en/) 下面的失效鏈接。
這在重構章節內容、移動頁面或者重命名文件或頁眉時非常有用。

<!--
## How the tool works
-->
## 工作原理   {#how-the-tool-works}

<!--
`htmltest` scans links in the generated HTML files of the kubernetes website repository.
It runs using a `make` command which does the following:
-->
`htmltest` 會掃描 Kubernetes website 倉庫構建生成的 HTML 文件。通過執行 `make` 命令進行了下列操作：

<!--
- Builds the site and generates output HTML in the `/public` directory of your
  local `kubernetes/website` repository
- Pulls the `wdjp/htmltest` Docker image
- Mounts your local `kubernetes/website` repository to the Docker image
- Scans the files generated in the `/public` directory and provides command line output
  when it encounters broken internal links 
-->
- 構建站點並輸出 HTML 到本地 `kubernetes/website` 倉庫下的 `/public` 目錄中
- 拉取 Docker 鏡像 `wdjp/htmltest`
- 掛載本地 `kubernetes/website` 倉庫到 Docker 容器中
- 掃描 `/public` 目錄下生成的文件並將遇到的失效鏈接通過命令行打印出來

<!--
## What it does and doesn't check
-->
## 哪些鏈接不會檢查   {#what-it-does-and-doesnot-check}

<!--
The link checker scans generated HTML files, not raw Markdown.
The htmltest tool depends on a configuration file,
[`.htmltest.yml`](https://git.k8s.io/website/.htmltest.yml),
to determine which content to examine.

The link checker scans the following:
-->
該鏈接檢查器掃描生成的 HTML 文件，而非原始的 Markdown。該 htmltest 工具依賴於配置文件
[`.htmltest.yml`](https://git.k8s.io/website/.htmltest.yml)，來決定檢查哪些內容。

該鏈接檢查器掃描以下內容：

<!--
- All content generated from Markdown in
  [`/content/en/docs`](https://git.k8s.io/website/content/en/docs/) directory, excluding:
  - Generated API references, for example
     https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- All internal links, excluding:
  - Empty hashes (`<a href="#">` or `[title](#)`) and empty hrefs (`<a href="">` or `[title]()`)
  - Internal links to images and other media files
-->
- 所有由 [`/content/en/docs`](https://git.k8s.io/website/content/en/docs/)
  目錄下的 Markdown 文件生成的內容，但不包括：
  - 生成的 API 參考，例如 https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- 所有的內部鏈接，但不包括：
  - 空白錨點 (`<a href="#">` 或 `[title](#)`) 以及空白目標地址 (`<a href="">` 或 `[title]()`)
  - 指向圖片或其他媒體文件的內部鏈接

<!--
The link checker does not scan the following:
-->
該鏈接檢查器不會掃描以下內容：

<!--
- Links included in the top and side nav bars, footer links, or links in a page's `<head>` section,
  such as links to CSS stylesheets, scripts, and meta information
- Top level pages and their children, for example: `/training`, `/community`, `/case-studies/adidas`
- Blog posts
- API Reference documentation, for example
  https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- Localizations
-->
- 包含在頂部和側邊導航欄的鏈接，以及頁腳鏈接或者頁面的 `<head>` 部分中的鏈接，例如 CSS 樣式表、腳本以及元信息的鏈接。
- 頂級頁面及其子頁面，例如：`/training`、`/community`、`/case-studies/adidas`
- 博客文章
- API 參考文檔，例如 https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- 本地化內容

<!--
## Prerequisites and installation
-->
## 先決條件以及安裝說明   {#prerequisites-and-installation}

<!--
You must install
-->
必須安裝：

* [Docker](https://docs.docker.com/get-docker/)
* [make](https://www.gnu.org/software/make/)

<!--
## Running the link checker
-->
## 運行鏈接檢查器   {#running-link-checker}

<!--
To run the link checker:
-->
運行鏈接檢查器需要：

<!--
1. Navigate to the root directory of your local `kubernetes/website` repository.

2. Run the following command:
-->
1. 進入本地 `kubernetes/website` 倉庫的根目錄下。

2. 執行如下命令：

   ```shell
   make container-internal-linkcheck
   ```

<!--
## Understanding the output
-->
## 理解輸出的內容   {#understanding-output}

<!--
If the link checker finds broken links, the output is similar to the following:
-->
如果鏈接檢查器發現了失效鏈接，則輸出內容類似如下：

```
tasks/access-kubernetes-api/custom-resources/index.html
  hash does not exist --- tasks/access-kubernetes-api/custom-resources/index.html --> #preserving-unknown-fields
  hash does not exist --- tasks/access-kubernetes-api/custom-resources/index.html --> #preserving-unknown-fields
```

<!--
This is one set of broken links. The log adds an output for each page with broken links.

In this output, the file with broken links is `tasks/access-kubernetes-api/custom-resources.md`.

The tool gives a reason: `hash does not exist`. In most cases, you can ignore this.

The target URL is `#preserving-unknown-fields`.

One way to fix this is to:
-->
這是一系列失效鏈接。該日誌附帶了每個頁面下的失效鏈接。

在這部分輸出中，包含失效鏈接的文件是 `tasks/access-kubernetes-api/custom-resources.md`。

該工具給出了一個理由：`hash does not exist`。在大部分情況下，你可以忽略這個。

目標鏈接是 `#preserving-unknown-fields`。

修復這個問題的一種方式是：

<!--
1. Navigate to the Markdown file with a broken link.
2. Using a text editor, do a full-text search (usually Ctrl+F or Command+F) for the
   broken link's URL, `#preserving-unknown-fields`.
3. Fix the link. For a broken page hash (or _anchor_) link,
   check whether the topic was renamed or removed.
-->
1. 轉到含有失效鏈接的 Markdown 文件。
2. 使用文本編輯器全文搜索失效鏈接的 URL（通常使用 Ctrl+F 或 Command+F）`#preserving-unknown-fields`。
3. 修復該鏈接。對於一個失效的錨點（或者 **anchor**）鏈接，檢查該主題是否已更名或者移除。

<!--
Run htmltest to verify that broken links are fixed.
-->
運行 htmltest 來驗證失效鏈接是否已修復。
