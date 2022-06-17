---
title: 內容組織
content_type: concept
weight: 40
---
<!--
title: Content organization
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This site uses Hugo. In Hugo, [content
organization](https://gohugo.io/content-management/organization/) is a core
concept.
-->
本網站使用了 Hugo。在 Hugo 中，[內容組織](https://gohugo.io/content-management/organization/) 是一個核心概念。

<!-- body -->
<!--
**Hugo Tip:** Start Hugo with `hugo server -navigateToChanged` for content edit-sessions.
-->

{{< note >}}
**Hugo 提示：** 用 `hugo server --navigateToChanged` 命令啟動 Hugo 以進行內容編輯會話。
{{< /note >}}

<!--
## Page Lists

### Page Order

The documentation side menu, the documentation page browser etc. are listed using Hugo's default sort order, which sorts by weight (from 1), date (newest first), and finally by the link title.

Given that, if you want to move a page or a section up, set a weight in the page's front matter:
-->

## 頁面列表

### 頁面順序

文件側方選單、文件頁面瀏覽器等以 Hugo 的預設排序順序列出。Hugo 會按照權重（從 1 開始）、
日期（最新的排最前面）排序，最後按連結標題排序。

有鑑於此，如果你想將一個頁面或一個章節前移，請在頁面頭部設定一個較高的權重：

```yaml
title: My Page
weight: 10
```

<!--
For page weights, it can be smart not to use 1, 2, 3 ..., but some other interval, say 10, 20, 30... This allows you to insert pages where you want later.
-->
{{< note >}}
對於頁面的權重，不建議使用連續的數值，比如1、2、3...，而應採用間隔的數值，比如10、20、30...
這樣將來你可以將其他頁面插入到想要的位置。
{{< /note >}}

<!--
### Documentation Main Menu

The `Documentation` main menu is built from the sections below `docs/` with the `main_menu` flag set in front matter of the `_index.md` section content file:
-->
### 文件主選單

`文件` 主選單是從 `docs/` 下面的章節構建的。
這些章節在其章節內容檔案 `_index.md` 的頭部設定了 `main_menu` 標誌：

```yaml
main_menu: true
```

<!--
Note that the link title is fetched from the page's `linkTitle`, so if you want it to be something different than the title, change it in the content file:
-->
注意，連結標題來自頁面的 `linkTitle` 欄位，因此如果希望它與頁面標題不同，請在內容檔案中更改它：

```yaml
main_menu: true
title: Page Title
linkTitle: Title used in links
```

<!--
The above needs to be done per language. If you don't see your section in the menu, it is probably because it is not identified as a section by Hugo. Create a `_index.md` content file in the section folder.
-->

{{< note >}}
以上操作需要為每種語言分別完成。如果在選單中沒有看到你的章節，這可能是因為它沒有被 Hugo 識別為一個章節。
請在章節對應的目錄下建立 `_index.md` 內容檔案。
{{< /note >}}

<!--
### Documentation Side Menu

The documentation side-bar menu is built from the _current section tree_ starting below `docs/`.

It will show all sections and their pages.

If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:

When you navigate to a section that has content, the specific section or page (e.g. `_index.md`) is shown. Else, the first page inside that section is shown.
-->
### 文件側方選單

文件側方選單是基於 `docs/` 下面的 _當前章節的內容樹_ 構建的。

選單預設顯示所有的章節和它們的頁面。

如果你不想列出某個章節或頁面，請在頁面頭部將 `toc_hide` 標誌設定為 `true`。

```yaml
toc_hide: true
```

當導航到具有內容的章節時，網站將顯示出指定的章節或頁面（例如 `_index.md`）。
否則，將顯示該章節裡的第一個頁面。

<!--
### Documentation Browser

The page browser on the documentation home page is built using all the sections and pages that are directly below the `docs section`.

If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:
-->
### 文件瀏覽器 {#documentation-browser}

文件主頁上的頁面瀏覽器是基於 `docs section` 下一層的所有章節和頁面構建的。

如果你不想列出某個章節或頁面，請在頁面頭部將 `toc_hide` 標誌設定為 `true`。

```yaml
toc_hide: true
```

<!--
### The Main Menu

The site links in the top-right menu -- and also in the footer -- are built by page-lookups. This is to make sure that the page actually exists. So, if the `case-studies` section does not exist in a site (language), it will not be linked to.
-->
### 主選單

右上選單中的網站連結（也出現在頁尾中）是透過頁面查詢構建的。
這是為了確保頁面實際存在。因此，如果 `case-studies` 章節在網站（或者其本地化版本）中不存在，
則不會出現對應的連結。

<!--
## Page Bundles

In addition to standalone content pages (Markdown files), Hugo supports [Page Bundles](https://gohugo.io/content-management/page-bundles/).

One example is [Custom Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/). It is considered a `leaf bundle`. Everything below the directory, including the `index.md`, will be part of the bundle. This also includes page-relative links, images that can be processed etc.:
-->
## 頁面包

除了獨立的內容頁面（Markdown 檔案），Hugo 還支援
[頁面包](https://gohugo.io/content-management/page-bundles/)。

一個例子是[定製的 Hugo 短程式碼（shortcodes）](/zh-cn/docs/contribute/style/hugo-shortcodes/)。
它被認為是 `leaf bundle`（葉子包）。
目錄下的所有內容，包括 `index.md`，都是包的一部分。此外還包括頁面間相對連結、可被處理的影象等：

```bash
en/docs/home/contribute/includes
├── example1.md
├── example2.md
├── index.md
└── podtemplate.json
```

<!--
Another widely used example is the `includes` bundle. It sets `headless: true` in front matter, which means that it does not get its own URL. It is only used in other pages.
-->
另一個廣泛使用的例子是 `includes` 包。
這類包在頁面頭部設定 `headless: true`，意味著它沒有得到自己的 URL。它只用於其他頁面。

```bash
en/includes
├── default-storage-class-prereqs.md
├── index.md
├── partner-script.js
├── partner-style.css
├── task-tutorial-prereqs.md
├── user-guide-content-moved.md
└── user-guide-migration-notice.md
```

<!--
Some important notes to the files in the bundles:

* For translated bundles, any missing non-content files will be inherited from languages above. This avoids duplication.
* All the files in a bundle are what Hugo calls `Resources` and you can provide metadata per language, such as parameters and title, even if it does not supports front matter (YAML files etc.). See [Page Resources Metadata](https://gohugo.io/content-management/page-resources/#page-resources-metadata).
* The value you get from `.RelPermalink` of a `Resource` is page-relative. See [Permalinks](https://gohugo.io/content-management/urls/#permalinks).
-->
有關包中檔案的一些重要說明：

* 已翻譯的包會從上面的語言繼承所有缺失的、非內容檔案。這一設計可以避免重複。
* 包中的所有檔案都是 Hugo 所指的 `Resources`，你可以為用不同語言為其提供元資料，
  例如引數和標題，即使它不支援頭部設定（YAML 檔案等）。
  參見[頁面資源元資料](https://gohugo.io/content-management/page-resources/#page-resources-metadata)。
* 從 `Resource` 的 `.RelPermalink` 中獲得的值是相對於當前頁面的。
  參見 [Permalinks](https://gohugo.io/content-management/urls/#permalinks)。

<!--
## Styles

The `SASS` source of the stylesheets for this site is stored below `src/sass` and can be built with `make sass` (note that Hugo will get `SASS` support soon, see https://github.com/gohugoio/hugo/issues/4243).
-->
## 樣式 {#styles}

網站的樣式表的 `SASS` 原始檔儲存在 `src/sass` 下面，可以用 `make sass` 構建
（Hugo 很快就提供 `SASS` 的支援，參見 https://github.com/gohugoio/hugo/issues/4243）。

## {{% heading "whatsnext" %}}

<!--
* Learn about [custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/)
* Learn about the [Style guide](/docs/contribute/style/style-guide)
* Learn about the [Content guide](/docs/contribute/style/content-guide)
-->

* 瞭解[定製 Hugo 短程式碼](/zh-cn/docs/contribute/style/hugo-shortcodes/)
* 瞭解[樣式指南](/zh-cn/docs/contribute/style/style-guide)
* 瞭解[內容指南](/zh-cn/docs/contribute/style/content-guide)

