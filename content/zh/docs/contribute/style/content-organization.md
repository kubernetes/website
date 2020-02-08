---
title: 内容组织
content_template: templates/concept
weight: 40
---

<!--
---
title: Content organization
content_template: templates/concept
weight: 40
---
-->


{{% capture overview %}}

<!--
This site uses Hugo. In Hugo, [content organization](https://gohugo.io/content-management/organization/) is a core concept.
-->

本网站使用了 Hugo。在 Hugo 中，[内容组织](https://gohugo.io/content-management/organization/) 是一个核心概念。

{{% /capture %}}

{{% capture body %}}

{{% note %}}
<!--
**Hugo Tip:** Start Hugo with `hugo server --navigateToChanged` for content edit-sessions.
-->

**Hugo 提示:** 用 `hugo server --navigateToChanged` 命令启动 Hugo 以进行内容编辑会话。
{{% /note %}}

<!--
## Page Lists
-->

## 页面列表

<!--
### Page Order
-->

### 页面顺序

<!--
The documentation side menu, the documentation page browser etc. are listed using Hugo's default sort order, which sorts by weight (from 1), date (newest first), and finally by the link title.
-->

文档侧方菜单、文档页面浏览器等以 Hugo 的默认排序顺序列出，它按照权重（从1开始）、日期（最新的排第一个）排序，最后按链接标题排序。

<!--
Given that, if you want to move a page or a section up, set a weight in the page's front matter:
-->

如果你想提升一个页面或一个章节，请在页面头部设置一个较高的权重：

```yaml
title: My Page
weight: 10
```


{{% note %}}
<!--
For page weights, it can be smart not to use 1, 2, 3 ..., but some other interval, say 10, 20, 30... This allows you to insert pages where you want later.
-->

对于页面的权重，不建议使用连续的数值，比如1、2、3...，而是采用间隔的数值，比如10、20、30...，这样你可以将后续的页面插入到想要的位置。
{{% /note %}}


<!--
### Documentation Main Menu
-->

### 文档主菜单

<!--
The `Documentation` main menu is built from the sections below `docs/` with the `main_menu` flag set in front matter of the `_index.md` section content file:
-->

`Documentation` 主菜单是从 `docs/` 下面的章节构建的，它在 `_index.md` 章节内容文件的头部设置了 `main_menu` 标志：


```yaml
main_menu: true
```


<!--
Note that the link title is fetched from the page's `linkTitle`, so if you want it to be something different than the title, change it in the content file:
-->

注意，链接标题是从页面的 `linkTitle` 中提取的，因此如果希望它与标题不同，请在内容文件中更改它：


```yaml
main_menu: true
title: Page Title
linkTitle: Title used in links
```


{{% note %}}
<!--
The above needs to be done per language. If you don't see your section in the menu, it is probably because it is not identified as a section by Hugo. Create a `_index.md` content file in the section folder.
-->

以上每种语言都需要完成。如果在菜单中没有看到你的章节，这可能是因为它没有被 Hugo 标识为一个章节。请在章节对应的目录下创建 `_index.md` 内容文件。
{{% /note %}}

<!--
### Documentation Side Menu
-->

### 文档侧方菜单

<!--
The documentation side-bar menu is built from the _current section tree_ starting below `docs/`.
-->

文档侧方菜单是从 `docs/` 下面的 _current 章节的 tree_ 开始构建的。

<!--
It will show all sections and their pages.
-->

它将显示所有的章节和它们的页面。

<!--
If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:
-->

如果你不想列出某个章节或页面，请在页面头部将 `toc_hide` 标志设置为 `true`。

```yaml
toc_hide: true
```

<!--
When you navigate to a section that has content, the specific section or page (e.g. `_index.md`) is shown. Else, the first page inside that section is shown.
-->

当导航到具有内容的章节时，将显示出指定的章节或页面（例如 `_index.md`）。否则，将显示该章节里的第一个页面。

<!--
### Documentation Browser
-->

### 文档浏览器

<!--
The page browser on the documentation home page is built using all the sections and pages that are directly below the `docs section`.
-->

文档主页上的页面浏览器是用 `docs section` 下一层的所有章节和页面构建的。

<!--
If you don't want to list a section or page, set the `toc_hide` flag to `true` in front matter:
-->

如果你不想列出某个章节或页面，请在页面头部将 `toc_hide` 标志设置为 `true`。

```yaml
toc_hide: true
```

<!--
### The Main Menu
-->

### 主菜单

<!--
The site links in the top-right menu -- and also in the footer -- are built by page-lookups. This is to make sure that the page actually exists. So, if the `case-studies` section does not exist in a site (language), it will not be linked to.
-->

右上菜单中的网站链接（也在页脚中）是通过页面查找构建的。这是为了确保页面实际存在。因此，如果 `case-studies` 章节在网站中不存在（按语言），则它将链接不到。


<!--
## Page Bundles
-->

## 页面包

<!--
In addition to standalone content pages (Markdown files), Hugo supports [Page Bundles](https://gohugo.io/content-management/page-bundles/).
-->

除了独立的内容页面（Markdown文件），Hugo 还支持 [页面包](https://gohugo.io/content-management/page-bundles/)。

<!--
One example is [Custom Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/). It is considered a `leaf bundle`. Everything below the directory, including the `index.md`, will be part of the bundle. This also includes page-relative links, images that can be processed etc.:
-->

一个例子是 [定制 Hugo 短代码](/docs/contribute/style/hugo-shortcodes/)。它被认为是 `leaf bundle`。目录下的所有内容，包括 `index.md`，都是包的一部分。这还包括页面相关的链接、可被处理的图像等：

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

另一个广泛使用的例子是 `includes` 包。它在页面头部设置 `headless: true`，这意味着它没有得到自己的 URL。它只用于其他页面。

```bash
en/includes
├── default-storage-class-prereqs.md
├── federated-task-tutorial-prereqs.md
├── federation-content-moved.md
├── index.md
├── partner-script.js
├── partner-style.css
├── task-tutorial-prereqs.md
├── user-guide-content-moved.md
└── user-guide-migration-notice.md
```

<!--
Some important notes to the files in the bundles:
-->

包中文件的一些重要说明：

<!--
* For translated bundles, any missing non-content files will be inherited from languages above. This avoids duplication.
* All the files in a bundle are what Hugo calls `Resources` and you can provide metadata per language, such as parameters and title, even if it does not supports front matter (YAML files etc.). See [Page Resources Metadata](https://gohugo.io/content-management/page-resources/#page-resources-metadata).
* The value you get from `.RelPermalink` of a `Resource` is page-relative. See [Permalinks](https://gohugo.io/content-management/urls/#permalinks).
-->

* 对于已翻译的包，任何丢失的非内容文件将从上面的语言继承。这避免了重复。
* 包中的所有文件都是 Hugo 所指的 `Resources`，你可以为每种语言提供元数据，例如参数和标题，即使它不支持头部设置（YAML 文件等）。参见[页面资源元数据](https://gohugo.io/content-management/page-resources/#page-resources-metadata)。
* 从 `Resource` 的 `.RelPermalink` 中获得的值是页面相关的。参见 [Permalinks](https://gohugo.io/content-management/urls/#permalinks)。


<!--
## Styles
-->

## 样式

<!--
The `SASS` source of the stylesheets for this site is stored below `src/sass` and can be built with `make sass` (note that Hugo will get `SASS` support soon, see https://github.com/gohugoio/hugo/issues/4243).
-->

本网站的样式表的 `SASS` 源存储在 `src/sass` 下面，可以用 `make sass` 构建（Hugo很快就会得到 `SASS` 的支持，参见https://github.com/gohugoio/hugo/issues/4243）。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
* [Custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/)
* [Style guide](/docs/contribute/style/style-guide)
-->

* [定制 Hugo 短代码](/docs/contribute/style/hugo-shortcodes/)
* [样式指南](/docs/contribute/style/style-guide)

{{% /capture %}}
