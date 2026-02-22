---
title: 内容组织
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
本网站使用了 Hugo。在 Hugo 中，[内容组织](https://gohugo.io/content-management/organization/)是一个核心概念。

<!-- body -->

<!--
**Hugo Tip:** Start Hugo with `hugo server -navigateToChanged` for content edit-sessions.
-->
{{< note >}}
**Hugo 提示：** 用 `hugo server --navigateToChanged` 命令启动 Hugo 以进行内容编辑会话。
{{< /note >}}

<!--
## Page Lists

### Page Order

The documentation side menu, the documentation page browser etc. are listed using
Hugo's default sort order, which sorts by weight (from 1), date (newest first),
and finally by the link title.

Given that, if you want to move a page or a section up, set a weight in the page's front matter:
-->
## 页面列表

### 页面顺序

文档侧方菜单、文档页面浏览器等以 Hugo 的默认排序顺序列出。Hugo 会按照权重（从 1 开始）、
日期（最新的排最前面）排序，最后按链接标题排序。

有鉴于此，如果你想将一个页面或一个章节前移，请在页面头部设置一个较高的权重：

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
对于页面的权重，不建议使用连续的数值，比如 1、2、3...，而应采用其他间隔的数值，比如 10、20、30...
这样将来你可以将其他页面插入到想要的位置。
此外，在相同目录(章节)中的每个权重不应该与其他权重重叠。
这样做可以确保文档内容始终是正确且有条理的，尤其是对于本地化的内容。
{{< /note >}}

<!--
### Documentation Main Menu

The `Documentation` main menu is built from the sections below `docs/` with
the `main_menu` flag set in front matter of the `_index.md` section content file:
-->
### 文档主菜单

`文档`主菜单是从 `docs/` 下面的章节构建的。
这些章节在其章节内容文件 `_index.md` 的头部设置了 `main_menu` 标志：

```yaml
main_menu: true
```

<!--
Note that the link title is fetched from the page's `linkTitle`, so if you want
it to be something different than the title, change it in the content file:
-->
注意，链接标题来自页面的 `linkTitle` 字段，因此如果希望它与页面标题不同，请在内容文件中更改它：

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
你需要分别针对每种语言完成上述操作。如果在菜单中没有看到你的章节，这可能是因为它没有被 Hugo 识别为一个章节。
请在该章节对应的目录下创建 `_index.md` 内容文件。
{{< /note >}}

<!--
### Documentation Side Menu

The documentation side-bar menu is built from the _current section tree_ starting below `docs/`.

It will show all sections and their pages.

If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:

When you navigate to a section that has content, the specific section or page
(e.g. `_index.md`) is shown. Else, the first page inside that section is shown.
-->
### 文档侧方菜单

文档侧方菜单是基于 `docs/` 下面的**当前章节的内容树**构建的。

菜单默认显示所有的章节和它们的页面。

如果你不想列出某个章节或页面，请在页面头部将 `toc_hide` 标志设置为 `true`。

```yaml
toc_hide: true
```

当导航到具有内容的章节时，网站将显示出指定的章节或页面（例如 `_index.md`）。
否则，将显示该章节里的第一个页面。

<!--
### Documentation Browser

The page browser on the documentation home page is built using all the sections
and pages that are directly below the `docs section`.

If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:
-->
### 文档浏览器    {#documentation-browser}

文档主页上的页面浏览器是基于 `docs section` 下一层的所有章节和页面构建的。

如果你不想列出某个章节或页面，请在页面头部将 `toc_hide` 标志设置为 `true`。

```yaml
toc_hide: true
```

<!--
### The Main Menu

The site links in the top-right menu -- and also in the footer -- are built by
page-lookups. This is to make sure that the page actually exists. So, if the
`case-studies` section does not exist in a site (language), it will not be linked to.
-->
### 主菜单

右上菜单中的网站链接（也出现在页脚中）是通过页面查找构建的。
这是为了确保页面实际存在。因此，如果`案例分析`章节在网站（或者其本地化版本）中不存在，
则不会出现对应的链接。

<!--
## Page Bundles

In addition to standalone content pages (Markdown files), Hugo supports
[Page Bundles](https://gohugo.io/content-management/page-bundles/).

One example is [Custom Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/).
It is considered a `leaf bundle`. Everything below the directory, including the `index.md`,
will be part of the bundle. This also includes page-relative links, images that can be processed etc.:
-->
## 页面包

除了独立的内容页面（Markdown 文件），
Hugo 还支持[页面包](https://gohugo.io/content-management/page-bundles/)。

一个例子是[定制的 Hugo 短代码（shortcodes）](/zh-cn/docs/contribute/style/hugo-shortcodes/)。
它被认为是 `leaf bundle`（叶子包）。
目录下的所有内容，包括 `index.md`，都是包的一部分。此外还包括页面间相对链接、可被处理的图像等：

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
另一个广泛使用的例子是 `includes` 包。
这类包在页面头部设置 `headless: true`，意味着它没有得到自己的 URL。它只用于其他页面。

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
有关包中文件的一些重要说明：

* 已翻译的包会从上面的语言继承所有缺失的、非内容文件。这一设计可以避免重复。
* 包中的所有文件都是 Hugo 所指的 `Resources`，即使某个语言不支持头部设置（YAML 文件等），
  你也可以为每个语言提供诸如参数和标题等元数据。
  参见[页面资源元数据](https://gohugo.io/content-management/page-resources/#page-resources-metadata)。
* 从 `Resource` 的 `.RelPermalink` 中获得的值是相对于当前页面的。
  参见 [Permalinks](https://gohugo.io/content-management/urls/#permalinks)。

<!--
## Styles

The [SASS](https://sass-lang.com/) source of the stylesheets for this site is
stored in `assets/sass` and is automatically built by Hugo.
-->
## 样式   {#styles}

本网站的样式表的 [SASS](https://sass-lang.com/) 源文件存放在 `src/sass` 下面，
并通过 Hugo 自动构建。

## {{% heading "whatsnext" %}}

<!--
* Learn about [custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/)
* Learn about the [Style guide](/docs/contribute/style/style-guide)
* Learn about the [Content guide](/docs/contribute/style/content-guide)
-->
* 了解[定制 Hugo 短代码](/zh-cn/docs/contribute/style/hugo-shortcodes/)
* 了解[样式指南](/zh-cn/docs/contribute/style/style-guide)
* 了解[内容指南](/zh-cn/docs/contribute/style/content-guide)

