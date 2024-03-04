---
title: 定制 Hugo 短代码
content_type: concept
weight: 120
---
<!--
title: Custom Hugo Shortcodes
content_type: concept
weight: 120
-->

<!-- overview -->

<!--
This page explains the custom Hugo shortcodes that can be used in Kubernetes Markdown documentation.
-->
本页面将介绍 Hugo 自定义短代码，可以用于 Kubernetes Markdown 文档书写。

<!--
Read more about shortcodes in the [Hugo documentation](https://gohugo.io/content-management/shortcodes).
-->
关于短代码的更多信息可参见
[Hugo 文档](https://gohugo.io/content-management/shortcodes)。

<!-- body -->

<!--
## Feature state

In a Markdown page (`.md` file) on this site, you can add a shortcode to
display version and state of the documented feature.
-->
## 功能状态 {#feature-state}

在本站的 Markdown 页面（`.md` 文件）中，你可以加入短代码来展示所描述的功能特性的版本和状态。

<!--
### Feature state demo

Below is a demo of the feature state snippet, which displays the feature as
stable in the latest Kubernetes version.
-->
### 功能状态示例 {#feature-state-demo}

下面是一个功能状态代码段的演示，表明这个功能已经在最新版 Kubernetes 中稳定了。

```
{{</* feature-state state="stable" */>}}
```

<!--
Renders to:
-->
会转换为：

{{< feature-state state="stable" >}}

<!--
The valid values for `state` are:
-->
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
### 功能状态代码 {#feature-state-code}

所显示的 Kubernetes 默认为该页或站点版本。
修改 <code>for_k8s_version</code> 短代码参数可以调整要显示的版本。例如：

```
{{</* feature-state for_k8s_version="v1.10" state="beta" */>}}
```

<!--
Renders to:
-->
会转换为：

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

<!--
### Feature state retrieval from description file

To dynamically determine the state of the feature, make use of the `feature_gate_name`
shortcode parameter. The feature state details will be extracted from the corresponding feature gate 
description file located in `content/en/docs/reference/command-line-tools-reference/feature-gates/`.
For example:
-->
### 从描述文件中检索特征状态

要动态确定特性的状态，请使用 `feature_gate_name` 短代码参数，此参数将从
`content/en/docs/reference/command-line-tools-reference/feature-gates/`
中相应的特性门控描述文件中提取特性的详细状态信息。

例如：

```
{{</* feature-state feature_gate_name="NodeSwap" */>}}
```

<!--
Renders to:
-->
会转换为：

{{< feature-state feature_gate_name="NodeSwap" >}}

<!--
## Feature gate description

In a Markdown page (`.md` file) on this site, you can add a shortcode to
display the description for a shortcode.
-->
## 特性门控介绍

在此站点上的 Markdown 页面（`.md` 文件）中，你可以添加短代码来显示短代码的描述。

<!--
### Feature gate description demo

Below is a demo of the feature state snippet, which displays the feature as
stable in the latest Kubernetes version.
-->
### 特性门控 Demo 演示

下面是特性状态片段的 Demo，它显示该特性在最新的 Kubernetes 版本中处于稳定状态。

```
{{</* feature-gate-description name="DryRun" */>}}
```

<!--
Renders to:
-->
渲染到：

{{< feature-gate-description name="DryRun" >}}

<!--
## Glossary
There are two glossary shortcodes: `glossary_tooltip` and `glossary_definition`.

You can reference glossary terms with an inclusion that automatically updates
and replaces content with the relevant links from [our glossary](/docs/reference/glossary/).
When the glossary term is moused-over, the glossary entry displays a tooltip.
The glossary term also displays as a link.

As well as inclusions with tooltips, you can reuse the definitions from the glossary in
page content.
-->
## 词汇 {#glossary}

有两种词汇表提示：`glossary_tooltip` 和 `glossary_definition`。

你可以通过加入术语词汇的短代码，来自动更新和替换相应链接中的内容
（[我们的词汇库](/zh-cn/docs/reference/glossary/)）
在浏览在线文档时，术语会显示为超链接的样式，当鼠标移到术语上时，其解释就会显示在提示框中。

除了包含工具提示外，你还可以重用页面内容中词汇表中的定义。

<!--
The raw data for glossary terms is stored at
[the glossary directory](https://github.com/kubernetes/website/tree/main/content/en/docs/reference/glossary),
with a content file for each glossary term.
-->
词汇术语的原始数据保存在[词汇目录](https://github.com/kubernetes/website/tree/main/content/en/docs/reference/glossary)，
每个内容文件对应相应的术语解释。

<!--
### Glossary demo

For example, the following include within the Markdown renders to
{{< glossary_tooltip text="cluster" term_id="cluster" >}} with a tooltip:
-->
### 词汇演示 {#glossary-demo}

例如下面的代码在 Markdown 中将会转换为
{{< glossary_tooltip text="cluster" term_id="cluster" >}}，然后在提示框中显示。

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
## Links to API Reference
-->
## 链接至 API 参考 {#links-to-api-reference}

<!--
You can link to a page of the Kubernetes API reference using the
`api-reference` shortcode, for example to the
{{< api-reference page="workload-resources/pod-v1" >}} reference:
-->
你可以使用 `api-reference` 短代码链接到 Kubernetes API 参考页面，例如：
Pod
{{< api-reference page="workload-resources/pod-v1" >}} 参考文件：

```
{{</* api-reference page="workload-resources/pod-v1" */>}}
```

<!--
The content of the `page` parameter is the suffix of the URL of the API reference page.
-->
本语句中 `page` 参数的内容是 API 参考页面的 URL 后缀。

<!--
You can link to a specific place into a page by specifying an `anchor`
parameter, for example to the {{< api-reference page="workload-resources/pod-v1" anchor="PodSpec" >}}
reference or the {{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" >}}
section of the page:
-->
你可以通过指定 `anchor` 参数链接到页面中的特定位置，例如到
{{< api-reference page="workload-resources/pod-v1" anchor="PodSpec" >}} 参考，或页面的
{{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" >}}
部分：

```
{{</* api-reference page="workload-resources/pod-v1" anchor="PodSpec" */>}}
{{</* api-reference page="workload-resources/pod-v1" anchor="environment-variables" */>}}
```


<!--
You can change the text of the link by specifying a `text` parameter, for
example by linking to the
{{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="Environment Variables">}}
section of the page:
-->
你可以通过指定 `text` 参数来更改链接的文本，
例如通过链接到页面的{{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="环境变量">}}部分：

```
{{</* api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="环境变量" */>}}
```

<!--
## Table captions

You can make tables more accessible to screen readers by adding a table caption. To add a
[caption](https://www.w3schools.com/tags/tag_caption.asp) to a table,
enclose the table with a `table` shortcode and specify the caption with the `caption` parameter.

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
If you inspect the HTML for the table, you should see this element immediately
after the opening `<table>` element:

```html
<caption style="display: none;">Configuration parameters</caption>
```
-->
如果你查看表格的 HTML 输出结果，你会看到 `<table>`
元素后面紧接着下面的元素：

```html
<caption style="display: none;">配置参数</caption>
```

<!--
## Tabs

In a markdown page (`.md` file) on this site, you can add a tab set to display
multiple flavors of a given solution.

The `tabs` shortcode takes these parameters:
-->
## 标签页 {#tabs}

在本站的 Markdown 页面（`.md` 文件）中，你可以加入一个标签页集来显示
某解决方案的不同形式。

标签页的短代码包含以下参数：

<!--
* `name`: The name as shown on the tab.
* `codelang`: If you provide inner content to the `tab` shortcode, you can tell Hugo
  what code language to use for highlighting.
* `include`: The file to include in the tab. If the tab lives in a Hugo
  [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles),
  the file -- which can be any MIME type supported by Hugo -- is looked up in the bundle itself.
  If not, the content page that needs to be included is looked up relative to the current page.
  Note that with the `include`, you do not have any shortcode inner content and must use the
  self-closing syntax. For example,
  `{{</* tab name="Content File #1" include="example1" /*/>}}`. The language needs to be specified
  under `codelang` or the language is taken based on the file name.
  Non-content files are code-highlighted by default.
-->
* `name`： 标签页上显示的名字。
* `codelang`: 如果要在 `tab` 短代码中加入内部内容，需要告知 Hugo 使用的是什么代码语言，方便代码高亮。
* `include`: 标签页中所要包含的文件。如果标签页是在 Hugo 的
  [叶子包](https://gohugo.io/content-management/page-bundles/#leaf-bundles)中定义，
  Hugo 会在包内查找文件（可以是 Hugo 所支持的任何 MIME 类型文件）。
  否则，Hugo 会在当前路径的相对路径下查找所要包含的内容页面。
  注意，在 `include` 页面中不能包含短代码内容，必须要使用自结束（self-closing）语法。
  例如 `{{</* tab name="Content File #1" include="example1" /*/>}}`。
  如果没有在 `codelang` 进行声明的话，Hugo 会根据文件名推测所用的语言。
  默认情况下，非内容文件将会被代码高亮。

<!--
* If your inner content is markdown, you must use the `%`-delimiter to surround the tab.
  For example, `{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`
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
{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}
{{< /tabs */>}}
```

<!--
Renders to:
-->
会转换为：

{{< tabs name="tab_with_code" >}}
{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}
{{< /tabs >}}

<!--
### Tabs demo: Inline Markdown and HTML
-->
### 标签页演示：内联 Markdown 和 HTML

```go-html-template
{{</* tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
这是**一些 markdown。**
{{< note >}}
它甚至可以包含短代码。
{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>纯 HTML</h3>
	<p>这是一些 <i>纯</i> HTML。</p>
</div>
{{< /tab >}}
{{< /tabs */>}}
```

<!--
Renders to:
-->
会转换为：

{{< tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
这是**一些 markdown。**
{{< note >}}
它甚至可以包含短代码。
{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>纯 HTML</h3>
	<p>这是一些 <i>纯</i> HTML。</p>
</div>
{{< /tab >}}
{{< /tabs >}}

<!--
### Tabs demo: File include
-->
### 标签页演示：文件嵌套

```go-text-template
{{</* tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs */>}}
```

<!--
Renders to:
-->
会转换为：

{{< tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate.json" />}}
{{< /tabs >}}

<!--
## Source code files
You can use the `{{%/* code_sample */%}}` shortcode to embed the contents of file
in a code block to allow users to download or copy its content to their clipboard.
This shortcode is used when the contents of the sample file is generic and reusable, 
and you want the users to try it out themselves.
-->
## 源代码文件
你可以使用 `{{%/* code_sample */%}}` 短代码将文件内容嵌入代码块中，
以允许用户下载或复制其内容到他们的剪贴板。
当示例文件的内容是通用的、可复用的，并且希望用户自己尝试使用示例文件时，
可以使用此短代码。

<!--
This shortcode takes in two named parameters: `language` and `file`. 
The mandatory parameter `file` is used to specify the path to the file
being displayed. The optional parameter `language` is used to specify
the programming language of the file. If the `language` parameter is not provided,
the shortcode will attempt to guess the language based on the file extension.

For example:
-->
这个短代码有两个命名参数：`language` 和 `file`，
必选参数 `file` 用于指定要显示的文件的路径，
可选参数 `language` 用于指定文件的编程语言。
如果未提供 `language` 参数，短代码将尝试根据文件扩展名推测编程语言。

```none
{{%/* code_sample language="yaml" file="application/deployment-scale.yaml" */%}}
```

<!--
The output is:
-->
输出是：

{{% code_sample language="yaml" file="application/deployment-scale.yaml" %}}

<!--
When adding a new sample file, such as a YAML file, create the file in one
of the `<LANG>/examples/` subdirectories where `<LANG>` is the language for
the page. In the markdown of your page, use the `code` shortcode:
-->
添加新的示例文件（例如 YAML 文件）时，在 `<LANG>/examples/`
子目录之一中创建该文件，其中 `<LANG>` 是页面的语言。
在你的页面的 Markdown 文本中，使用 `code` 短代码：

```none
{{%/* code_sample file="<RELATIVE-PATH>/example-yaml>" */%}}
```

其中 `<RELATIVE-PATH>` 是要包含的示例文件的路径，相对于 `examples` 目录。
以下短代码引用位于 `/content/en/examples/configmap/configmaps.yaml` 的 YAML 文件。

```none
{{%/* code_sample file="configmap/configmaps.yaml" */%}}
```

<!--
The legacy `{{%/* codenew */%}}` shortcode is being replaced by `{{%/* code_sample */%}}`.
Use `{{%/* code_sample */%}}` (not `{{%/* codenew */%}}` or `{{%/* code */%}}`) in new documentation.
-->
传统的 `{{%/* codenew */%}}` 短代码将被替换为 `{{%/* code_sample */%}}`。
在新文档中使用 `{{%/* code_sample */%}}`。

<!--
## Third party content marker
-->
## 第三方内容标记  {#third-party-content-marker}

<!--
Running Kubernetes requires third-party software. For example: you
usually need to add a
[DNS server](/docs/tasks/administer-cluster/dns-custom-nameservers/#introduction)
to your cluster so that name resolution works.
-->
运行 Kubernetes 需要第三方软件。例如：你通常需要将
[DNS 服务器](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/#introduction)
添加到集群中，以便名称解析工作。

<!--
When we link to third-party software, or otherwise mention it,
we follow the [content guide](/docs/contribute/style/content-guide/)
and we also mark those third party items.
-->
当我们链接到第三方软件或以其他方式提及它时，我们会遵循[内容指南](/zh-cn/docs/contribute/style/content-guide/)
并标记这些第三方项目。

<!--
Using these shortcodes adds a disclaimer to any documentation page
that uses them.
-->
使用这些短代码会向使用它们的任何文档页面添加免责声明。

<!--
### Lists {#third-party-content-list}
-->
### 列表  {#third-party-content-list}

<!--
For a list of several third-party items, add:
-->
对于有关几个第三方项目的列表，请添加：
```
{{%/* thirdparty-content */%}}
```

<!--
just below the heading for the section that includes all items.
-->
在包含所有项目的段落标题正下方。

<!--
### Items {#third-party-content-item}
-->
### 项目  {#third-party-content-item}

<!--
If you have a list where most of the items refer to in-project
software (for example: Kubernetes itself, and the separate
[Descheduler](https://github.com/kubernetes-sigs/descheduler)
component), then there is a different form to use.
-->
如果你有一个列表，其中大多数项目引用项目内软件（例如：Kubernetes 本身，以及单独的
[Descheduler](https://github.com/kubernetes-sigs/descheduler)
组件），那么可以使用不同的形式。

<!--
Add the shortcode:

before the item, or just below the heading for the specific item.
-->
在项目之前，或在特定项目的段落下方添加此短代码：
```
{{%/* thirdparty-content single="true" */%}}
```

<!--
## Version strings

To generate a version string for inclusion in the documentation, you can choose from
several version shortcodes. Each version shortcode displays a version string derived from
the value of a version parameter found in the site configuration file, `hugo.toml`.
The two most commonly used version parameters are `latest` and `version`.
-->
## 版本号信息 {#version-strings}

要在文档中生成版本号信息，可以从以下几种短代码中选择。每个短代码可以基于站点配置文件
`hugo.toml` 中的版本参数生成一个版本号取值。最常用的参数为 `latest` 和 `version`。

<!--
### `{{</* param "version" */>}}`

The `{{</* param "version" */>}}` shortcode generates the value of the current
version of the Kubernetes documentation from the `version` site parameter. The
`param` shortcode accepts the name of one site parameter, in this case:
`version`.
-->
### `{{</* param "version" */>}}`

`{{</* param "version" */>}}` 短代码可以基于站点参数 `version` 生成 Kubernetes
文档的当前版本号取值。短代码 `param` 允许传入一个站点参数名称，在这里是 `version`。

<!--
{{< note >}}
In previously released documentation, `latest` and `version` parameter values
are not equivalent.  After a new version is released, `latest` is incremented
and the value of `version` for the documentation set remains unchanged. For
example, a previously released version of the documentation displays `version`
as `v1.19` and `latest` as `v1.20`.
{{< /note >}}
-->
{{< note >}}
在先前已经发布的文档中，`latest` 和 `version` 参数值并不完全等价。新版本文档发布后，参数
`latest` 会增加，而 `version` 则保持不变。例如，在上一版本的文档中使用 `version` 会得到
`v1.19`，而使用 `latest` 则会得到 `v1.20`。
{{< /note >}}

<!--
Renders to:
-->
转换为：

{{< param "version" >}}

<!--
### `{{</* latest-version */>}}`

The `{{</* latest-version */>}}` shortcode returns the value of the `latest` site parameter.
The `latest` site parameter is updated when a new version of the documentation is released.
This parameter does not always match the value of `version` in a documentation set.

Renders to:
-->
### `{{</* latest-version */>}}`

`{{</* latest-version */>}}` 返回站点参数 `latest` 的取值。每当新版本文档发布时，该参数均会被更新。
因此，参数 `latest` 与 `version` 并不总是相同。

转换为：

{{< latest-version >}}

<!--
### `{{</* latest-semver */>}}`

The `{{</* latest-semver */>}}` shortcode generates the value of `latest`
without the "v" prefix.

Renders to:
-->
### `{{</* latest-semver */>}}`

`{{</* latest-semver */>}}` 短代码可以生成站点参数 `latest` 不含前缀
`v` 的版本号取值。

转换为：

{{< latest-semver >}}

<!--
### `{{</* version-check */>}}`

The `{{</* version-check */>}}` shortcode checks if the `min-kubernetes-server-version`
page parameter is present and then uses this value to compare to `version`.

Renders to:
-->
### `{{</* version-check */>}}`

`{{</* version-check */>}}` 会检查是否设置了页面参数 `min-kubernetes-server-version`
并将其与 `version` 进行比较。

转换为：

{{< version-check >}}

<!--
### `{{</* latest-release-notes */>}}`

The `{{</* latest-release-notes */>}}` shortcode generates a version string
from `latest` and removes the "v" prefix. The shortcode prints a new URL for
the release note CHANGELOG page with the modified version string.

Renders to:
-->
### `{{</* latest-release-notes */>}}`

`{{</* latest-release-notes */>}}` 短代码基于站点参数 `latest` 生成不含前缀 `v`
的版本号取值，并输出该版本更新日志的超链接地址。

转换为：

{{< latest-release-notes >}}

## {{% heading "whatsnext" %}}

<!--
* Learn about [Hugo](https://gohugo.io/).
* Learn about [writing a new topic](/docs/contribute/style/write-new-topic/).
* Learn about [page content types](/docs/contribute/style/page-content-types/).
* Learn about [opening a pull request](/docs/contribute/new-content/open-a-pr/).
* Learn about [advanced contributing](/docs/contribute/advanced/).
-->

* 了解 [Hugo](https://gohugo.io/)。
* 了解[撰写新的话题](/zh-cn/docs/contribute/style/write-new-topic/)。
* 了解[使用页面内容类型](/zh-cn/docs/contribute/style/page-content-types/)。
* 了解[发起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)。
* 了解[进阶贡献](/zh-cn/docs/contribute/advanced/)。
