<!--
# Internal link checking tool
-->
# 内置链接检查工具

<!--
You can use [htmltest](https://github.com/wjdp/htmltest) to check for broken links in [`/content/en/`](https://git.k8s.io/website/content/en/). This is useful when refactoring sections of content, moving pages around, or renaming files or page headers.
-->
你可以使用 [htmltest](https://github.com/wjdp/htmltest) 来检查
[`/content/en/`](https://git.k8s.io/website/content/en/) 下面的失效链接。
这在重构章节内容、移动页面或者重命名文件或页眉时非常有用。

<!--
## How the tool works
-->
## 工作原理   {#how-the-tool-works}

<!--
`htmltest` scans links in the generated HTML files of the kubernetes website repository. It runs using a `make` command which does the following:
-->
`htmltest` 会扫描 Kubernetes website 仓库构建生成的 HTML 文件。通过执行 `make` 命令进行了下列操作：

<!--
- Builds the site and generates output HTML in the `/public` directory of your local `kubernetes/website` repository
- Pulls the `wdjp/htmltest` Docker image
- Mounts your local `kubernetes/website` repository to the Docker image
- Scans the files generated in the `/public` directory and provides command line output when it encounters broken internal links 
-->
- 构建站点并输出 HTML 到本地 `kubernetes/website` 仓库下的 `/public` 目录中
- 拉取 Docker 镜像 `wdjp/htmltest`
- 挂载本地 `kubernetes/website` 仓库到 Docker 容器中
- 扫描 `/public` 目录下生成的文件并将遇到的失效链接通过命令行打印出来

<!--
## What it does and doesn't check
-->
## 哪些链接不会检查   {#what-it-does-and-doesnot-check}

<!--
The link checker scans generated HTML files, not raw Markdown. The htmltest tool depends on a configuration file, [`.htmltest.yml`](https://git.k8s.io/website/.htmltest.yml), to determine which content to examine.

The link checker scans the following:
-->
该链接检查器扫描生成的 HTML 文件，而非原始的 Markdown。该 htmltest 工具依赖于配置文件
[`.htmltest.yml`](https://git.k8s.io/website/.htmltest.yml)，来决定检查哪些内容。

该链接检查器扫描以下内容：

<!--
- All content generated from Markdown in [`/content/en/docs`](https://git.k8s.io/website/content/en/docs/) directory, excluding:
  - Generated API references, for example https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- All internal links, excluding:
  - Empty hashes (`<a href="#">` or `[title](#)`) and empty hrefs (`<a href="">` or `[title]()`)
  - Internal links to images and other media files
-->
- 所有由 [`/content/en/docs`](https://git.k8s.io/website/content/en/docs/)
  目录下的 Markdown 文件生成的内容，但不包括：
  - 生成的 API 参考，例如 https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- 所有的内部链接，但不包括：
  - 空白锚点 (`<a href="#">` 或 `[title](#)`) 以及空白目标地址 (`<a href="">` 或 `[title]()`)
  - 指向图片或其他媒体文件的内部链接

<!--
The link checker does not scan the following:
-->
该链接检查器不会扫描以下内容：

<!--
- Links included in the top and side nav bars, footer links, or links in a page's `<head>` section, such as links to CSS stylesheets, scripts, and meta information
- Top level pages and their children, for example: `/training`, `/community`, `/case-studies/adidas`
- Blog posts
- API Reference documentation, for example: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- Localizations
-->
- 包含在顶部和侧边导航栏的链接，以及页脚链接或者页面的 `<head>` 部分中的链接，例如 CSS 样式表、脚本以及元信息的链接。
- 顶级页面及其子页面，例如：`/training`、`/community`、`/case-studies/adidas`
- 博客文章
- API 参考文档，例如： https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/
- 本地化内容

<!--
## Prerequisites and installation
-->
## 先决条件以及安装说明   {#prerequisites-and-installation}

<!--
You must install
-->
必须安装：
* [Docker](https://docs.docker.com/get-docker/)
* [make](https://www.gnu.org/software/make/)

<!--
## Running the link checker
-->
## 运行链接检查器   {#running-link-checker}

<!--
To run the link checker:
-->
运行链接检查器需要：

<!--
1. Navigate to the root directory of your local `kubernetes/website` repository.

2. Run the following command:
-->
1. 进入本地 `kubernetes/website` 仓库的根目录下。

2. 执行如下命令：

   ```
   make container-internal-linkcheck
   ```

<!--
## Understanding the output
-->
## 理解输出的内容   {#understanding-output}

<!--
If the link checker finds broken links, the output is similar to the following:
-->
如果链接检查器发现了失效链接，则输出内容类似如下：

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
这是一系列失效链接。该日志附带了每个页面下的失效链接。

在这部分输出中，包含失效链接的文件是 `tasks/access-kubernetes-api/custom-resources.md`。

该工具给出了一个理由：`hash does not exist`。在大部分情况下，你可以忽略这个。

目标链接是 `#preserving-unknown-fields`。

修复这个问题的一种方式是：

<!--
1. Navigate to the Markdown file with a broken link.
2. Using a text editor, do a full-text search (usually Ctrl+F or Command+F) for the broken link's URL, `#preserving-unknown-fields`.
3. Fix the link. For a broken page hash (or _anchor_) link, check whether the topic was renamed or removed.
-->
1. 转到含有失效链接的 Markdown 文件。
2. 使用文本编辑器全文搜索失效链接的 URL（通常使用 Ctrl+F 或 Command+F）`#preserving-unknown-fields`。
3. 修复该链接。对于一个失效的锚点（或者 **anchor**）链接，检查该主题是否已更名或者移除。

<!--
Run htmltest to verify that broken links are fixed.
-->
运行 htmltest 来验证失效链接是否已修复。
