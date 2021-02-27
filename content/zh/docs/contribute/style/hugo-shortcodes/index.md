---
title: 定制 Hugo 短代码
content_type: concept
---
<!--
title: Custom Hugo Shortcodes
content_type: concept
-->

<!-- overview -->

<!-- This page explains the custom Hugo shortcodes that can be used in Kubernetes markdown documentation. -->
本页面将介绍定制 Hugo 短代码，可以用于 Kubernetes markdown 文档书写。

<!-- Read more about shortcodes in the [Hugo documentation](https://gohugo.io/content-management/shortcodes). -->
关于短代码的更多信息可参见 [Hugo 文档](https://gohugo.io/content-management/shortcodes)。

<!-- body -->

<!--
## Feature state

In a markdown page (.md file) on this site, you can add a shortcode to display
version and state of the documented feature.
-->
## 功能状态

在本站的 markdown 页面中，你可以加入短代码来展示所描述的功能特性的版本和状态。

<!--
### Feature state demo

Below is a demo of the feature state snippet, which displays the feature as stable
in Kubernetes version 1.10.
-->
### 功能状态示例

下面是一个功能状态代码段的演示，表明这个功能已经在 Kubernetes v1.10 时就已经稳定了。

```
{{</* feature-state for_k8s_version="v1.10" state="stable" */>}}
```

<!-- Will render to: -->
会转换为：

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

<!-- The valid values for `state` are: -->
`state` 的可选值如下：

* alpha
* beta
* deprecated
* stable

<!--
### Feature state code

The displayed Kubernetes version defaults to that of the page or the site.
This can be changed by passing the <code>for_k8s_version</code> shortcode
parameter.
-->
### 功能状态代码

所显示的 Kubernetes 默认为该页或站点版本。
可以通过修改 <code>for_k8s_version</code> 短代码参数来调整要显示的版本。

```
{{</* feature-state for_k8s_version="v1.11" state="stable" */>}}
```

<!-- Renders to: -->
会转换为：

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

<!-- #### Alpha feature -->
#### Alpha 功能

```
{{</* feature-state feature-state state="alpha" */>}}
```

<!-- Renders to: -->
会转换为：

{{< feature-state state="alpha" >}}

<!-- #### Beta feature -->
#### Beta 功能

```
{{</* feature-state feature-state state="beta" */>}}
```

<!-- Renders to: -->
会转换为：

{{< feature-state state="beta" >}}

<!-- #### Stable feature -->
#### 稳定功能

```
{{</* feature-state feature-state state="stable" */>}}
```

<!-- Renders to: -->
会转换为：

{{< feature-state state="stable" >}}

<!-- #### Deprecated feature -->
#### 废弃功能

```
{{</* feature-state feature-state state="deprecated" */>}}
```

<!-- Renders to: -->
会转换为：

{{< feature-state state="deprecated" >}}

<!--
## Glossary
There are two glossary tooltips.

You can reference glossary terms with an inclusion that will automatically
update and replace content with the relevant links from [our
glossary](/docs/reference/glossary/). When the term is moused-over by someone
using the online documentation, the glossary entry will display a tooltip.

As well as inclusions with tooltips, you can reuse the definitions from the glossary in
page content.
-->
## 词汇

有两种词汇表提示。

你可以通过加入术语词汇的短代码，来自动更新和替换相应链接中的内容
（[我们的词汇库](/zh/docs/reference/glossary/)）
这样，在浏览在线文档，鼠标移到术语上时，术语解释就会显示在提示框中。

除了包含工具提示外，你还可以重用页面内容中词汇表中的定义。
<!--
The raw data for glossary terms is stored at [https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary), with a content file for each glossary term.
-->

词汇术语的原始数据保存在 [https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary)，每个内容文件对应相应的术语解释。

<!--
### Glossary demo

For example, the following include within the markdown will render to
{{< glossary_tooltip text="cluster" term_id="cluster" >}} with a tooltip:
-->
### 词汇演示

例如，下面的代码在 markdown 中将会转换为 `{{< glossary_tooltip text="cluster" term_id="cluster" >}}`，
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

​```go-html-template
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

在本站的 markdown 页面（`.md` 文件）中，你可以加入一个标签页集来显示
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

## {{% heading "whatsnext" %}}

<!--
* Learn about [Hugo](https://gohugo.io/).
* Learn about [writing a new topic](/docs/home/contribute/style/write-new-topic/).
* Learn about [page content types](/docs/home/contribute/style/page-content-types/).
* Learn about [creating a pull request](/docs/contribute/new-content/open-a-pr/).
* Learn about [advanced contributing](/docs/contribute/advanced/).
-->

* 了解 [Hugo](https://gohugo.io/)。
* 了解[撰写新的话题](/zh/docs/contribute/style/write-new-topic/)。
* 了解[使用页面内容类型](/zh/docs/contribute/style/page-content-types/)。
* 了解[发起 PR](/zh/docs/contribute/new-content/open-a-pr/)。
* 了解[高级贡献](/zh/docs/contribute/advanced/)。

