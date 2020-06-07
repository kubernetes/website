---
approvers:
- chenopis
title: 定制 Hugo 短代码
content_template: templates/concept
---

<!-- ---
approvers:
- chenopis
title: Custom Hugo Shortcodes
content_template: templates/concept
--- -->

{{% capture overview %}}
<!-- This page explains the custom Hugo shortcodes that can be used in Kubernetes markdown documentation. -->
本页面将介绍定制 Hugo 短代码，可以用于 Kubernetes markdown 文档书写。

<!-- Read more about shortcodes in the [Hugo documentation](https://gohugo.io/content-management/shortcodes). -->
更多关于短代码参见 [Hugo 文档](https://gohugo.io/content-management/shortcodes)。
{{% /capture %}}

{{% capture body %}}
<!-- ## Feature state -->
## 功能状态

<!-- In a markdown page (.md file) on this site, you can add a shortcode to display version and state of the documented feature. -->
本站上面的 markdown 页面，你可以加入短代码来展示已经文档介绍的功能的版本和状态(state)。

<!-- ### Feature state demo -->
### 功能状态演示

<!-- Below is a demo of the feature state snippet, which displays the feature as stable in Kubernetes version 1.10. -->
下面是一个功能状态代码段的演示，表明这个功能已经在 Kubernetes v1.10时就已经稳定了。

```
{{</* feature-state for_k8s_version="v1.10" state="stable" */>}}
```

<!-- Will render to: -->
会转换为：

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

<!-- The valid values for `state` are: -->
`state`的可选值如下：

* alpha
* beta
* deprecated
* stable

<!-- ### Feature state code -->
### 功能状态代码

<!-- Below is the template code for each available feature state. -->
下面是为每个现有的功能状态的模板代码。

<!-- The displayed Kubernetes version defaults to that of the page or the site. This can be changed by passing the <code>for_k8s_version</code> shortcode parameter. -->

显示的 Kubernetes 默认为该页或站点版本。
这个可以通过修改 <code>for_k8s_version</code> 短代码参数来调整。

```
{{</* feature-state for_k8s_version="v1.10" state="stable" */>}}
```

<!-- Renders to: -->
会转换为：

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

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

<!-- ## Glossary -->
## 词汇

<!-- You can reference glossary terms with an inclusion that will automatically update and replace content with the relevant links from [our glossary](/docs/reference/glossary/). When the term is moused-over by someone
using the online documentation, the glossary entry will display a tooltip. -->

你可以通过加入术语词汇的短代码，来自动更新和替换相应链接中的内容（[我们的词汇库](/docs/reference/glossary/)）
这样，在浏览在线文档，鼠标移到术语上时，术语解释就会显示在提示框中。

<!-- The raw data for glossary terms is stored at [https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary), with a content file for each glossary term. -->

词汇术语的原始数据保存在 [https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary)，每个内容文件对应相应的术语解释。

<!-- ### Glossary Demo -->
### 词汇演示

<!-- For example, the following include within the markdown will render to {{< glossary_tooltip text="cluster" term_id="cluster" >}} with a tooltip: -->

例如，下面的代码在 markdown 中将会转换为 `{{< glossary_tooltip text="cluster" term_id="cluster" >}}`，然后在提示框中显示。

````liquid
{{</* glossary_tooltip text="cluster" term_id="cluster" */>}}
````

<!-- ## Tabs -->
## 标签页

<!-- In a markdown page (`.md` file) on this site, you can add a tab set to display multiple flavors of a given solution. -->
在本站的 markdown 页面（`.md` 文件）中，你可以加入一个标签页集来显示不同形式的解决方案。

<!-- The `tabs` shortcode takes these parameters: -->
标签页的短代码包含以下参数：

<!-- * `name`: The name as shown on the tab.
* `codelang`: If you provide inner content to the `tab` shortcode, you can tell Hugo what code language to use for highlighting.
* `include`: The file to include in the tab. If the tab lives in a Hugo [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles), the file -- which can be any MIME type supported by Hugo -- will be looked up in the bundle itself. If not, the content page to include will be looked up relative to the current. Note that with the `include` you will not have any shortcode inner content and must use the self-closing syntax, e.g. {{</* tab name="Content File #1" include="example1" /*/>}}. Non-content files will be code-highlighted. The language to use will be taken from the filename if not provided in `codelang`. -->

* `name`: 标签页上的名字。
* `codelang`: 如果要在`tab`短代码中加入内部内容，需要告知 Hugo 使用的是什么代码语言，方便代码高亮。
* `include`: 标签页中所要包含的文件。如果标签页是在 Hugo 的页面包（[leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles)）中，文件（可以是 Hugo 所支持的 MIME 类型文件）将会在包中查找。如果不是，所要包含的内容页面将会在当前路径的相关路径下查找。注意，在`include`属性部分，不能加入短代码内部内容，必须要使用自结束（self-closing）的语法。
非内容文件将会被代码高亮。如果没有在`codelang`进行声明的话，所用的代码语言将会来自文件名。

<!-- * If your inner content is markdown, you must use `%`-delimiter to surorund the tab, e.g. `{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`
* You can combine the variations mentioned above inside a tab set. -->

* 如果内部内容是 markdown， 你必须要使用 `%` 分隔符来包装标签页，例如，`{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`
* 可以在标签页集中混合使用上面的各种变形。

<!-- Below is a demo of the tabs shortcode. -->
下面是演示标签页短代码。

{{< note >}}
The tab **name** in a `tabs` definition must be unique within a content page.
一个内容页面下的，标签页定义中的标签页 **名** 必须是唯一的。
{{< /note >}}

<!-- ### Tabs demo: Code highlighting -->
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
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs >}}


{{% /capture %}}

{{% capture whatsnext %}}
<!-- * Learn about [Hugo](https://gohugo.io/).
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/)
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/). -->

* 了解 [Hugo](https://gohugo.io/)。
* 了解 [撰写新的话题](/docs/home/contribute/write-new-topic/)。
* 了解 [使用页面模板](/docs/home/contribute/page-templates/)。
* 了解 [暂存修改](/docs/home/contribute/stage-documentation-changes/)。
* 了解 [创建 pull request](/docs/home/contribute/create-pull-request/)。
{{% /capture %}}
