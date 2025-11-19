---
title: 內容組織
content_type: concept
weight: 90
---
<!--
title: Content organization
content_type: concept
weight: 90
-->

<!-- overview -->

<!--
This site uses Hugo. In Hugo, [content
organization](https://gohugo.io/content-management/organization/) is a core
concept.
-->
本網站使用了 Hugo。在 Hugo 中，[內容組織](https://gohugo.io/content-management/organization/)是一個核心概念。

<!-- body -->

<!--
**Hugo Tip:** Start Hugo with `hugo server -navigateToChanged` for content edit-sessions.
-->
{{< note >}}
**Hugo 提示：** 用 `hugo server --navigateToChanged` 命令啓動 Hugo 以進行內容編輯會話。
{{< /note >}}

<!--
## Page Lists

### Page Order

The documentation side menu, the documentation page browser etc. are listed using
Hugo's default sort order, which sorts by weight (from 1), date (newest first),
and finally by the link title.

Given that, if you want to move a page or a section up, set a weight in the page's front matter:
-->
## 頁面列表

### 頁面順序

文檔側方菜單、文檔頁面瀏覽器等以 Hugo 的默認排序順序列出。Hugo 會按照權重（從 1 開始）、
日期（最新的排最前面）排序，最後按鏈接標題排序。

有鑑於此，如果你想將一個頁面或一個章節前移，請在頁面頭部設置一個較高的權重：

```yaml
title: My Page
weight: 10
```

<!--
For page weights, it can be smart not to use 1, 2, 3 ..., but some other interval,
say 10, 20, 30... This allows you to insert pages where you want later.
Additionally, each weight within the same directory (section) should not be
overlapped with the other weights. This makes sure that content is always
organized correctly, especially in localized content.
-->
{{< note >}}
對於頁面的權重，不建議使用連續的數值，比如 1、2、3...，而應採用其他間隔的數值，比如 10、20、30...
這樣將來你可以將其他頁面插入到想要的位置。
此外，在相同目錄(章節)中的每個權重不應該與其他權重重疊。
這樣做可以確保文檔內容始終是正確且有條理的，尤其是對於本地化的內容。
{{< /note >}}

<!--
### Documentation Main Menu

The `Documentation` main menu is built from the sections below `docs/` with
the `main_menu` flag set in front matter of the `_index.md` section content file:
-->
### 文檔主菜單

`文檔`主菜單是從 `docs/` 下面的章節構建的。
這些章節在其章節內容文件 `_index.md` 的頭部設置了 `main_menu` 標誌：

```yaml
main_menu: true
```

<!--
Note that the link title is fetched from the page's `linkTitle`, so if you want
it to be something different than the title, change it in the content file:
-->
注意，鏈接標題來自頁面的 `linkTitle` 字段，因此如果希望它與頁面標題不同，請在內容文件中更改它：

```yaml
main_menu: true
title: Page Title
linkTitle: Title used in links
```

<!--
The above needs to be done per language. If you don't see your section in the menu,
it is probably because it is not identified as a section by Hugo. Create a
`_index.md` content file in the section folder.
-->
{{< note >}}
你需要分別針對每種語言完成上述操作。如果在菜單中沒有看到你的章節，這可能是因爲它沒有被 Hugo 識別爲一個章節。
請在該章節對應的目錄下創建 `_index.md` 內容文件。
{{< /note >}}

<!--
### Documentation Side Menu

The documentation side-bar menu is built from the _current section tree_ starting below `docs/`.

It will show all sections and their pages.

If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:

When you navigate to a section that has content, the specific section or page
(e.g. `_index.md`) is shown. Else, the first page inside that section is shown.
-->
### 文檔側方菜單

文檔側方菜單是基於 `docs/` 下面的**當前章節的內容樹**構建的。

菜單默認顯示所有的章節和它們的頁面。

如果你不想列出某個章節或頁面，請在頁面頭部將 `toc_hide` 標誌設置爲 `true`。

```yaml
toc_hide: true
```

當導航到具有內容的章節時，網站將顯示出指定的章節或頁面（例如 `_index.md`）。
否則，將顯示該章節裏的第一個頁面。

<!--
### Documentation Browser

The page browser on the documentation home page is built using all the sections
and pages that are directly below the `docs section`.

If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:
-->
### 文檔瀏覽器    {#documentation-browser}

文檔主頁上的頁面瀏覽器是基於 `docs section` 下一層的所有章節和頁面構建的。

如果你不想列出某個章節或頁面，請在頁面頭部將 `toc_hide` 標誌設置爲 `true`。

```yaml
toc_hide: true
```

<!--
### The Main Menu

The site links in the top-right menu -- and also in the footer -- are built by
page-lookups. This is to make sure that the page actually exists. So, if the
`case-studies` section does not exist in a site (language), it will not be linked to.
-->
### 主菜單

右上菜單中的網站鏈接（也出現在頁腳中）是通過頁面查找構建的。
這是爲了確保頁面實際存在。因此，如果`案例分析`章節在網站（或者其本地化版本）中不存在，
則不會出現對應的鏈接。

<!--
## Page Bundles

In addition to standalone content pages (Markdown files), Hugo supports
[Page Bundles](https://gohugo.io/content-management/page-bundles/).

One example is [Custom Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/).
It is considered a `leaf bundle`. Everything below the directory, including the `index.md`,
will be part of the bundle. This also includes page-relative links, images that can be processed etc.:
-->
## 頁面包

除了獨立的內容頁面（Markdown 文件），
Hugo 還支持[頁面包](https://gohugo.io/content-management/page-bundles/)。

一個例子是[定製的 Hugo 短代碼（shortcodes）](/zh-cn/docs/contribute/style/hugo-shortcodes/)。
它被認爲是 `leaf bundle`（葉子包）。
目錄下的所有內容，包括 `index.md`，都是包的一部分。此外還包括頁面間相對鏈接、可被處理的圖像等：

```bash
zh-cn/docs/home/contribute/includes
├── example1.md
├── example2.md
├── index.md
└── podtemplate.json
```

<!--
Another widely used example is the `includes` bundle. It sets `headless: true` in
front matter, which means that it does not get its own URL. It is only used in other pages.
-->
另一個廣泛使用的例子是 `includes` 包。
這類包在頁面頭部設置 `headless: true`，意味着它沒有得到自己的 URL。它只用於其他頁面。

```bash
zh-cn/includes
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

* For translated bundles, any missing non-content files will be inherited from
  languages above. This avoids duplication.
* All the files in a bundle are what Hugo calls `Resources` and you can provide
  metadata per language, such as parameters and title, even if it does not supports front
  matter (YAML files etc.). See [Page Resources Metadata](https://gohugo.io/content-management/page-resources/#page-resources-metadata).
* The value you get from `.RelPermalink` of a `Resource` is page-relative.
  See [Permalinks](https://gohugo.io/content-management/urls/#permalinks).
-->
有關包中文件的一些重要說明：

* 已翻譯的包會從上面的語言繼承所有缺失的、非內容文件。這一設計可以避免重複。
* 包中的所有文件都是 Hugo 所指的 `Resources`，即使某個語言不支持頭部設置（YAML 文件等），
  你也可以爲每個語言提供諸如參數和標題等元數據。
  參見[頁面資源元數據](https://gohugo.io/content-management/page-resources/#page-resources-metadata)。
* 從 `Resource` 的 `.RelPermalink` 中獲得的值是相對於當前頁面的。
  參見 [Permalinks](https://gohugo.io/content-management/urls/#permalinks)。

<!--
## Styles

The [SASS](https://sass-lang.com/) source of the stylesheets for this site is
stored in `assets/sass` and is automatically built by Hugo.
-->
## 樣式   {#styles}

本網站的樣式表的 [SASS](https://sass-lang.com/) 源文件存放在 `src/sass` 下面，
並通過 Hugo 自動構建。

## {{% heading "whatsnext" %}}

<!--
* Learn about [custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/)
* Learn about the [Style guide](/docs/contribute/style/style-guide)
* Learn about the [Content guide](/docs/contribute/style/content-guide)
-->
* 瞭解[定製 Hugo 短代碼](/zh-cn/docs/contribute/style/hugo-shortcodes/)
* 瞭解[樣式指南](/zh-cn/docs/contribute/style/style-guide)
* 瞭解[內容指南](/zh-cn/docs/contribute/style/content-guide)

