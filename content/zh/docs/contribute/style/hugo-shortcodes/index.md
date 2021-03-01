---
title: 定制 Hugo 短代码
content_type: concept
---
<!--
title: Custom Hugo Shortcodes
content_type: concept
-->

<!-- overview -->

<!-- This page explains the custom Hugo shortcodes that can be used in Kubernetes Markdown documentation. -->
本页面将介绍 Hugo 自定义短代码，可以用于 Kubernetes Markdown 文档书写。

<!-- Read more about shortcodes in the [Hugo documentation](https://gohugo.io/content-management/shortcodes). -->
关于短代码的更多信息可参见 [Hugo 文档](https://gohugo.io/content-management/shortcodes)。

<!-- body -->

<!--
## Feature state

In a Markdown page (.md file) on this site, you can add a shortcode to display
version and state of the documented feature.
-->
## 功能状态

在本站的 Markdown 页面中，你可以加入短代码来展示所描述的功能特性的版本和状态。

<!--
### Feature state demo

Below is a demo of the feature state snippet, which displays the feature as stable 
in the latest Kubernetes version.
-->
### 功能状态示例

下面是一个功能状态代码段的演示，表明这个功能已经在最新版 Kubernetes 中稳定了。

```
{{</* feature-state state="stable" */>}}
```

<!-- Renders to: -->
会转换为：

{{< feature-state state="stable" >}}

<!-- The valid values for `state` are: -->
`state` 的可选值如下：

* alpha
* beta
* deprecated
* stable

<!--
### Feature state code

The displayed Kubernetes version defaults to that of the page or the site. You can change the
feature state version by passing the `for_k8s_version` shortcode parameter. For example:
-->
### 功能状态代码

所显示的 Kubernetes 默认为该页或站点版本。
修改 <code>for_k8s_version</code> 短代码参数可以调整要显示的版本。例如

```
{{</* feature-state for_k8s_version="v1.10" state="beta" */>}}
```

<!-- Renders to: -->
会转换为：

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

<!--
## Glossary
There are two glossary shortcodes: `glossary_tooltip` and `glossary_definition`.

You can reference glossary terms with an inclusion that will automatically
update and replace content with the relevant links from [our
glossary](/docs/reference/glossary/). When the glossary term is moused-over,
the glossary entry displays a tooltip. The glossary term also displays as a link.

As well as inclusions with tooltips, you can reuse the definitions from the glossary in
page content.
-->
## 词汇

有两种词汇表提示：<code>glossary_tooltip</code> 和 <code>glossary_definition</code>。

你可以通过加入术语词汇的短代码，来自动更新和替换相应链接中的内容
（[我们的词汇库](/zh/docs/reference/glossary/)）
在浏览在线文档时，术语会显示为超链接的样式，当鼠标移到术语上时，其解释就会显示在提示框中。

除了包含工具提示外，你还可以重用页面内容中词汇表中的定义。
<!--
The raw data for glossary terms is stored at [https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary), with a content file for each glossary term.
-->

词汇术语的原始数据保存在 [https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary)，每个内容文件对应相应的术语解释。

<!--
### Glossary demo

For example, the following include within the Markdown will render to
{{< glossary_tooltip text="cluster" term_id="cluster" >}} with a tooltip:
-->
### 词汇演示

例如，下面的代码在 Markdown 中将会转换为 `{{< glossary_tooltip text="cluster" term_id="cluster" >}}`，
然后在提示框中显示。

```
{{</* glossary_tooltip text="cluster" term_id="cluster" */>}}
```
<!--
Here's a short glossary definition:
-->
这是一个简短的词汇表定义：

```
{{</* glossary_definition prepend="A cluster is" term_id="cluster" length="short" */>}}
```

<!--
which renders as:
{{< glossary_definition prepend="A cluster is" term_id="cluster" length="short" >}}
-->
呈现为： 
{{< glossary_definition prepend="A cluster is" term_id="cluster" length="short" >}}

<!--
You can also include a full definition:
-->
你也可以包括完整的定义：

```
{{</* glossary_definition term_id="cluster" length="all" */>}}
```

<!--
which renders as:
-->
呈现为： 
{{< glossary_definition term_id="cluster" length="all" >}}

<!--
## Table captions

You can make tables more accessible to screen readers by adding a table caption. To add a [caption](https://www.w3schools.com/tags/tag_caption.asp) to a table, enclose the table with a `table` shortcode and specify the caption with the `caption` parameter.

{{< note >}}
Table captions are visible to screen readers but invisible when viewed in standard HTML.
{{< /note >}}

Here's an example:
-->
## 表格标题  {#table-captions}

通过添加表格标题，你可以让表格能够被屏幕阅读器读取。
要向表格添加[标题（Caption）](https://www.w3schools.com/tags/tag_caption.asp)，
可用 `table` 短代码包围表格定义，并使用 `caption` 参数给出表格标题。

{{< note >}}
表格标题对屏幕阅读器是可见的，但在标准 HTML 中查看时是不可见的。
{{< /note >}}

下面是一个例子：

<!--
```go-html-template
{{</* table caption="Configuration parameters" >}}
Parameter | Description | Default
`timeout` | The timeout for requests | `30s`
`logLevel` | The log level for log output | `INFO`
{{< /table */>}}

The rendered table looks like this:

{{< table caption="Configuration parameters" >}}
Parameter | Description | Default
`timeout` | The timeout for requests | `30s`
`logLevel` | The log level for log output | `INFO`
{{< /table >}}
-->

```go-html-template
{{</* table caption="配置参数" >}}
参数      | 描述        | 默认值
:---------|:------------|:-------
`timeout` | 请求的超时时长 | `30s`
`logLevel` | 日志输出的级别 | `INFO`
{{< /table */>}}
```

所渲染的表格如下：

{{< table caption="配置参数" >}}
参数      | 描述        | 默认值
:---------|:------------|:-------
`timeout` | 请求的超时时长 | `30s`
`logLevel` | 日志输出的级别 | `INFO`
{{< /table >}}

<!--
If you inspect the HTML for the table, you should see this element immediately after the opening `<table>` element:

```html
<caption style="display: none;">Configuration parameters</caption>
```
-->
如果你查看表格的 HTML 输出结果，你会看到 `<table>` 元素
后面紧接着下面的元素：

```html
<caption style="display: none;">配置参数</caption>
```

<!--
## Tabs

In a markdown page (`.md` file) on this site, you can add a tab set to display
multiple flavors of a given solution.

The `tabs` shortcode takes these parameters:
-->
## 标签页

在本站的 Markdown 页面（`.md` 文件）中，你可以加入一个标签页集来显示
某解决方案的不同形式。

标签页的短代码包含以下参数：

<!--
* `name`: The name as shown on the tab.
* `codelang`: If you provide inner content to the `tab` shortcode, you can tell Hugo what code language to use for highlighting.
* `include`: The file to include in the tab. If the tab lives in a Hugo [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles), the file -- which can be any MIME type supported by Hugo -- will be looked up in the bundle itself. If not, the content page to include will be looked up relative to the current. Note that with the `include` you will not have any shortcode inner content and must use the self-closing syntax, e.g. {{</* tab name="Content File #1" include="example1" /*/>}}. Non-content files will be code-highlighted. The language to use will be taken from the filename if not provided in `codelang`.
-->
* `name`： 标签页上显示的名字。
* `codelang`: 如果要在 `tab` 短代码中加入内部内容，需要告知 Hugo 使用的是什么代码语言，方便代码高亮。
* `include`: 标签页中所要包含的文件。如果标签页是在 Hugo 的
  [叶子包](https://gohugo.io/content-management/page-bundles/#leaf-bundles)中定义，
  Hugo 会在包内查找文件（可以是 Hugo 所支持的任何 MIME 类型文件）。
  否则，Hugo 会在当前路径的相对路径下查找所要包含的内容页面。
  注意，在 `include` 页面中不能包含短代码内容，必须要使用自结束（self-closing）语法。
  非内容文件将会被代码高亮。
  如果没有在 `codelang` 进行声明的话，Hugo 会根据文件名推测所用的语言。
<!--
* If your inner content is markdown, you must use `%`-delimiter to surorund the tab, e.g. `{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`
* You can combine the variations mentioned above inside a tab set.
-->
* 如果内部内容是 Markdown，你必须要使用 `%` 分隔符来包装标签页。
  例如，`{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`。
* 可以在标签页集中混合使用上面的各种变形。

<!--
Below is a demo of the tabs shortcode.

The tab **name** in a `tabs` definition must be unique within a content page.
-->
下面是标签页短代码的示例。

{{< note >}}
内容页面下的 **tabs** 定义中的标签页 **name** 必须是唯一的。
{{< /note >}}

<!--
### Tabs demo: Code highlighting
-->
### 标签页演示：代码高亮

```go-text-template
{{</* tabs name="tab_with_code" >}}
{{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}}
{{< /tabs */>}}
```

<!-- Will be rendered as: -->
会转换为：

{{< tabs name="tab_with_code" >}}
{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}
{{< /tabs >}}

<!-- ### Tabs demo: Inline Markdown and HTML -->
### 标签页演示：内联 Markdown 和 HTML

```go-html-template
{{</* tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
这是 **一些 markdown 。**
{{< note >}}它甚至可以包含短代码。{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>纯 HTML</h3>
	<p>这是一些 <i>纯</i> HTML 。</p>
</div>
{{< /tab >}}
{{< /tabs */>}}
```

<!-- Will be rendered as: -->
会转换为：

{{< tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
这是 **一些 markdown 。**
{{< note >}}它甚至可以包含短代码。{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>纯 HTML</h3>
	<p>这是一些 <i>纯</i> HTML 。</p>
</div>
{{< /tab >}}
{{< /tabs >}}

<!-- ### Tabs demo: File include -->
### 标签页演示：文件嵌套

```go-text-template
{{</* tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs */>}}
```

<!-- Will be rendered as: -->
会转换为：

{{< tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate.json" />}}
{{< /tabs >}}

<!--
## Version strings

To generate a version string for inclusion in the documentation, you can choose from
several version shortcodes. Each version shortcode displays a version string derived from
the value of a version parameter found in the site configuration file, `config.toml`.
The two most commonly used version parameters are `latest` and `version`.
-->
## 版本号信息

文档中的版本号信息可以通过短代码的方式生成。在配置文件 `config.toml` 中，定义了一些版本号信息，通过短代码及版本号参数可以从配置文件中提取并展示指定的版本号信息。
最常见的版本号短代码参数包括 `latest` 和 `version`。

<!--
### `{{</* param "version" */>}}`

The `{{</* param "version" */>}}` shortcode generates the value of the current version of
the Kubernetes documentation from the `version` site parameter. The `param` shortcode accepts the name of one site parameter, in this case: `version`.
-->
### `{{</* param "version" */>}}`

`{{</* param "version" */>}}` 短代码可以转换为 Kubernetes 文档的当前版本，具体的版本号来源于配置文件中的 `version` 参数。
短代码 `param` 允许传入一个配置参数，例子里的参数为 `version`。

<!--
{{< note >}}
In previously released documentation, `latest` and `version` parameter values are not equivalent.
After a new version is released, `latest` is incremented and the value of `version` for the documentation set remains unchanged. For example, a previously released version of the documentation displays `version` as
`v1.19` and `latest` as `v1.20`.
{{< /note >}}
-->
{{< note >}}
在先前已经发布的文档中，`latest` 和 `version` 参数转换得到的版本号并不相同。
新版本文档发布后，参数 `latest` 会增加，而 `version` 则保持不变。例如，在上一版本的文档中使用 `version` 会得到 `v1.19`，而使用 `latest` 则会得到 `v1.20`。
{{< /note >}}

<!--
Renders to:

{{< param "version" >}}
-->
转换为：

{{< param "version" >}}

<!--
### `{{</* latest-version */>}}`

The `{{</* latest-version */>}}` shortcode returns the value of the `latest` site parameter.
The `latest` site parameter is updated when a new version of the documentation is released.
This parameter does not always match the value of `version` in a documentation set.

Renders to:

{{< latest-version >}}
-->
### `{{</* latest-version */>}}`

`{{</* latest-version */>}}` 会转换为配置文件中参数 `latest` 对应的值。每当有新版本文档发布时，该参数均会更新。
因此，参数 `latest` 与 `version` 并不总是相同。

转换为：

{{< latest-version >}}

<!--
### `{{</* latest-semver */>}}`

The `{{</* latest-semver */>}}` shortcode generates the value of `latest` without the "v" prefix.

Renders to:

{{< latest-semver >}}
-->
### `{{</* latest-semver */>}}`

`{{</* latest-semver */>}}` 会转换为配置文件中参数 `latest` 对应的值，并且会删除前缀 `v`。

转换为：

{{< latest-semver >}}

<!--
### `{{</* version-check */>}}`

The `{{</* version-check */>}}` shortcode checks if the `min-kubernetes-server-version`
page parameter is present and then uses this value to compare to `version`.
 
Renders to:

{{< version-check >}}
-->
### `{{</* version-check */>}}`

`{{</* version-check */>}}` 会检查是否设置了页面参数 `min-kubernetes-server-version` 并将其与 `version` 进行比较。

转换为：

{{< version-check >}}

<!--
### `{{</* latest-release-notes */>}}`

The `{{</* latest-release-notes */>}}` shortcode generates a version string from `latest` and removes
the "v" prefix. The shortcode prints a new URL for the release note CHANGELOG page with the modified version string.

Renders to:

{{< latest-release-notes >}}
-->
### `{{</* latest-release-notes */>}}`

`{{</* latest-release-notes */>}}` 会转换为 `latest` 版本的更新日志的超链接。

转换为：

{{< latest-release-notes >}}

## {{% heading "whatsnext" %}}

<!--
* Learn about [Hugo](https://gohugo.io/).
* Learn about [writing a new topic](/docs/home/contribute/style/write-new-topic/).
* Learn about [page content types](/docs/home/contribute/style/page-content-types/).
* Learn about [creating a pull request](/docs/contribute/new-content/open-a-pr/).
* Learn about [advanced contributing](/docs/contribute/advanced/).
-->

* 了解[Hugo](https://gohugo.io/)。
* 了解[撰写新的话题](/zh/docs/contribute/style/write-new-topic/)。
* 了解[使用页面内容类型](/zh/docs/contribute/style/page-content-types/)。
* 了解[发起 PR](/zh/docs/contribute/new-content/open-a-pr/)。
* 了解[高级贡献](/zh/docs/contribute/advanced/)。

