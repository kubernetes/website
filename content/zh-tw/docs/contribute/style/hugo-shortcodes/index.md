---
title: 定製 Hugo 短代碼
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
本頁面將介紹 Hugo 自定義短代碼，可以用於 Kubernetes Markdown 文檔書寫。

<!--
Read more about shortcodes in the [Hugo documentation](https://gohugo.io/content-management/shortcodes).
-->
關於短代碼的更多信息可參見
[Hugo 文檔](https://gohugo.io/content-management/shortcodes)。

<!-- body -->

<!--
## Feature state

In a Markdown page (`.md` file) on this site, you can add a shortcode to
display version and state of the documented feature.
-->
## 功能狀態 {#feature-state}

在本站的 Markdown 頁面（`.md` 文件）中，你可以加入短代碼來展示所描述的功能特性的版本和狀態。

<!--
### Feature state demo

Below is a demo of the feature state snippet, which displays the feature as
stable in the latest Kubernetes version.
-->
### 功能狀態示例 {#feature-state-demo}

下面是一個功能狀態代碼段的演示，表明這個功能已經在最新版 Kubernetes 中穩定了。

```
{{</* feature-state state="stable" */>}}
```

<!--
Renders to:
-->
會轉換爲：

{{< feature-state state="stable" >}}

<!--
The valid values for `state` are:
-->
`state` 的可選值如下：

* alpha
* beta
* deprecated
* stable

<!--
### Feature state code

The displayed Kubernetes version defaults to that of the page or the site. You can change the
feature state version by passing the `for_k8s_version` shortcode parameter. For example:
-->
### 功能狀態代碼 {#feature-state-code}

所顯示的 Kubernetes 默認爲該頁或站點版本。
修改 <code>for_k8s_version</code> 短代碼參數可以調整要顯示的版本。例如：

```
{{</* feature-state for_k8s_version="v1.10" state="beta" */>}}
```

<!--
Renders to:
-->
會轉換爲：

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

<!--
### Feature state retrieval from description file

To dynamically determine the state of the feature, make use of the `feature_gate_name`
shortcode parameter. The feature state details will be extracted from the corresponding feature gate 
description file located in `content/en/docs/reference/command-line-tools-reference/feature-gates/`.
For example:
-->
### 從描述文件中檢索特徵狀態

要動態確定特性的狀態，請使用 `feature_gate_name` 短代碼參數，此參數將從
`content/en/docs/reference/command-line-tools-reference/feature-gates/`
中相應的特性門控描述文件中提取特性的詳細狀態信息。

例如：

```
{{</* feature-state feature_gate_name="NodeSwap" */>}}
```

<!--
Renders to:
-->
會轉換爲：

{{< feature-state feature_gate_name="NodeSwap" >}}

<!--
## Feature gate description

In a Markdown page (`.md` file) on this site, you can add a shortcode to
display the description for a shortcode.
-->
## 特性門控介紹

在此站點上的 Markdown 頁面（`.md` 文件）中，你可以添加短代碼來顯示短代碼的描述。

<!--
### Feature gate description demo

Below is a demo of the feature state snippet, which displays the feature as
stable in the latest Kubernetes version.
-->
### 特性門控 Demo 演示

下面是特性狀態片段的 Demo，它顯示該特性在最新的 Kubernetes 版本中處於穩定狀態。

```
{{</* feature-gate-description name="DryRun" */>}}
```

<!--
Renders to:
-->
會轉換爲：

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
## 詞彙 {#glossary}

有兩種詞彙表提示：`glossary_tooltip` 和 `glossary_definition`。

你可以通過加入術語詞彙的短代碼，來自動更新和替換相應鏈接中的內容
（[我們的詞彙庫](/zh-cn/docs/reference/glossary/)）
在瀏覽在線文檔時，術語會顯示爲超鏈接的樣式，當鼠標移到術語上時，其解釋就會顯示在提示框中。

除了包含工具提示外，你還可以重用頁面內容中詞彙表中的定義。

<!--
The raw data for glossary terms is stored at
[the glossary directory](https://github.com/kubernetes/website/tree/main/content/en/docs/reference/glossary),
with a content file for each glossary term.
-->
詞彙術語的原始數據保存在[詞彙目錄](https://github.com/kubernetes/website/tree/main/content/en/docs/reference/glossary)，
每個內容文件對應相應的術語解釋。

<!--
### Glossary demo

For example, the following include within the Markdown renders to
{{< glossary_tooltip text="cluster" term_id="cluster" >}} with a tooltip:
-->
### 詞彙演示 {#glossary-demo}

例如下面的代碼在 Markdown 中將會轉換爲
{{< glossary_tooltip text="cluster" term_id="cluster" >}}，然後在提示框中顯示。

```
{{</* glossary_tooltip text="cluster" term_id="cluster" */>}}
```
<!--
Here's a short glossary definition:
-->
這是一個簡短的詞彙表定義：

```
{{</* glossary_definition prepend="A cluster is" term_id="cluster" length="short" */>}}
```

<!--
which renders as:
{{< glossary_definition prepend="A cluster is" term_id="cluster" length="short" >}}
-->
呈現爲：

{{< glossary_definition prepend="A cluster is" term_id="cluster" length="short" >}}

<!--
You can also include a full definition:
-->
你也可以包括完整的定義：

```
{{</* glossary_definition term_id="cluster" length="all" */>}}
```

<!--
which renders as:
-->
呈現爲：

{{< glossary_definition term_id="cluster" length="all" >}}

<!--
## Links to API Reference
-->
## 鏈接至 API 參考 {#links-to-api-reference}

<!--
You can link to a page of the Kubernetes API reference using the
`api-reference` shortcode, for example to the
{{< api-reference page="workload-resources/pod-v1" >}} reference:
-->
你可以使用 `api-reference` 短代碼鏈接到 Kubernetes API 參考頁面，例如：
Pod
{{< api-reference page="workload-resources/pod-v1" >}} 參考文件：

```
{{</* api-reference page="workload-resources/pod-v1" */>}}
```

<!--
The content of the `page` parameter is the suffix of the URL of the API reference page.
-->
本語句中 `page` 參數的內容是 API 參考頁面的 URL 後綴。

<!--
You can link to a specific place into a page by specifying an `anchor`
parameter, for example to the {{< api-reference page="workload-resources/pod-v1" anchor="PodSpec" >}}
reference or the {{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" >}}
section of the page:
-->
你可以通過指定 `anchor` 參數鏈接到頁面中的特定位置，例如到
{{< api-reference page="workload-resources/pod-v1" anchor="PodSpec" >}} 參考，或頁面的
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
你可以通過指定 `text` 參數來更改鏈接的文本，
例如通過鏈接到頁面的{{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="環境變量">}}部分：

```
{{</* api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="環境變量" */>}}
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
## 表格標題  {#table-captions}

通過添加表格標題，你可以讓表格能夠被屏幕閱讀器讀取。
要向表格添加[標題（Caption）](https://www.w3schools.com/tags/tag_caption.asp)，
可用 `table` 短代碼包圍表格定義，並使用 `caption` 參數給出表格標題。

{{< note >}}
表格標題對屏幕閱讀器是可見的，但在標準 HTML 中查看時是不可見的。
{{< /note >}}

下面是一個例子：

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
{{</* table caption="配置參數" >}}
參數      | 描述        | 默認值
:---------|:------------|:-------
`timeout` | 請求的超時時長 | `30s`
`logLevel` | 日誌輸出的級別 | `INFO`
{{< /table */>}}
```

所渲染的表格如下：

{{< table caption="配置參數" >}}
參數      | 描述        | 默認值
:---------|:------------|:-------
`timeout` | 請求的超時時長 | `30s`
`logLevel` | 日誌輸出的級別 | `INFO`
{{< /table >}}

<!--
If you inspect the HTML for the table, you should see this element immediately
after the opening `<table>` element:

```html
<caption style="display: none;">Configuration parameters</caption>
```
-->
如果你查看錶格的 HTML 輸出結果，你會看到 `<table>`
元素後面緊接着下面的元素：

```html
<caption style="display: none;">配置參數</caption>
```

<!--
## Tabs

In a markdown page (`.md` file) on this site, you can add a tab set to display
multiple flavors of a given solution.

The `tabs` shortcode takes these parameters:
-->
## 標籤頁 {#tabs}

在本站的 Markdown 頁面（`.md` 文件）中，你可以加入一個標籤頁集來顯示
某解決方案的不同形式。

標籤頁的短代碼包含以下參數：

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
* `name`：標籤頁上顯示的名字。
* `codelang`：如果要在 `tab` 短代碼中加入內部內容，需要告知 Hugo 使用的是什麼代碼語言，方便代碼高亮。
* `include`：標籤頁中所要包含的文件。如果標籤頁是在 Hugo 的
  [葉子包](https://gohugo.io/content-management/page-bundles/#leaf-bundles)中定義，
  Hugo 會在包內查找文件（可以是 Hugo 所支持的任何 MIME 類型文件）。
  否則，Hugo 會在當前路徑的相對路徑下查找所要包含的內容頁面。
  注意，在 `include` 頁面中不能包含短代碼內容，必須要使用自結束（self-closing）語法。
  例如 `{{</* tab name="Content File #1" include="example1" /*/>}}`。
  如果沒有在 `codelang` 進行聲明的話，Hugo 會根據文件名推測所用的語言。
  默認情況下，非內容文件將會被代碼高亮。

<!--
* If your inner content is markdown, you must use the `%`-delimiter to surround the tab.
  For example, `{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`
* You can combine the variations mentioned above inside a tab set.
-->
* 如果內部內容是 Markdown，你必須要使用 `%` 分隔符來包裝標籤頁。
  例如，`{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`。
* 可以在標籤頁集中混合使用上面的各種變形。

<!--
Below is a demo of the tabs shortcode.

The tab **name** in a `tabs` definition must be unique within a content page.
-->
下面是標籤頁短代碼的示例。

{{< note >}}
內容頁面下的 **tabs** 定義中的標籤頁 **name** 必須是唯一的。
{{< /note >}}

<!--
### Tabs demo: Code highlighting
-->
### 標籤頁演示：代碼高亮

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
會轉換爲：

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
### 標籤頁演示：內聯 Markdown 和 HTML

```go-html-template
{{</* tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
這是**一些 markdown。**
{{< note >}}
它甚至可以包含短代碼。
{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>純 HTML</h3>
	<p>這是一些 <i>純</i> HTML。</p>
</div>
{{< /tab >}}
{{< /tabs */>}}
```

<!--
Renders to:
-->
會轉換爲：

{{< tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
這是**一些 markdown。**
{{< note >}}
它甚至可以包含短代碼。
{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>純 HTML</h3>
	<p>這是一些 <i>純</i> HTML。</p>
</div>
{{< /tab >}}
{{< /tabs >}}

<!--
### Tabs demo: File include
-->
### 標籤頁演示：文件嵌套

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
會轉換爲：

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
## 源代碼文件

你可以使用 `{{%/* code_sample */%}}` 短代碼將文件內容嵌入代碼塊中，
以允許用戶下載或複製其內容到他們的剪貼板。
當示例文件的內容是通用的、可複用的，並且希望用戶自己嘗試使用示例文件時，
可以使用此短代碼。

<!--
This shortcode takes in two named parameters: `language` and `file`. 
The mandatory parameter `file` is used to specify the path to the file
being displayed. The optional parameter `language` is used to specify
the programming language of the file. If the `language` parameter is not provided,
the shortcode will attempt to guess the language based on the file extension.

For example:
-->
這個短代碼有兩個命名參數：`language` 和 `file`，
必選參數 `file` 用於指定要顯示的文件的路徑，
可選參數 `language` 用於指定文件的編程語言。
如果未提供 `language` 參數，短代碼將嘗試根據文件擴展名推測編程語言。

例如：

```none
{{%/* code_sample language="yaml" file="application/deployment-scale.yaml" */%}}
```

<!--
The output is:
-->
輸出是：

{{% code_sample language="yaml" file="application/deployment-scale.yaml" %}}

<!--
When adding a new sample file, such as a YAML file, create the file in one
of the `<LANG>/examples/` subdirectories where `<LANG>` is the language for
the page. In the markdown of your page, use the `code` shortcode:
-->
添加新的示例文件（例如 YAML 文件）時，在 `<LANG>/examples/`
子目錄之一中創建該文件，其中 `<LANG>` 是頁面的語言。
在你的頁面的 Markdown 文本中，使用 `code` 短代碼：

```none
{{%/* code_sample file="<RELATIVE-PATH>/example-yaml>" */%}}
```

其中 `<RELATIVE-PATH>` 是要包含的示例文件的路徑，相對於 `examples` 目錄。
以下短代碼引用位於 `/content/en/examples/configmap/configmaps.yaml` 的 YAML 文件。

```none
{{%/* code_sample file="configmap/configmaps.yaml" */%}}
```

<!--
The legacy `{{%/* codenew */%}}` shortcode is being replaced by `{{%/* code_sample */%}}`.
Use `{{%/* code_sample */%}}` (not `{{%/* codenew */%}}` or `{{%/* code */%}}`) in new documentation.
-->
傳統的 `{{%/* codenew */%}}` 短代碼將被替換爲 `{{%/* code_sample */%}}`。
在新文檔中使用 `{{%/* code_sample */%}}`。

<!--
## Third party content marker
-->
## 第三方內容標記  {#third-party-content-marker}

<!--
Running Kubernetes requires third-party software. For example: you
usually need to add a
[DNS server](/docs/tasks/administer-cluster/dns-custom-nameservers/#introduction)
to your cluster so that name resolution works.
-->
運行 Kubernetes 需要第三方軟件。例如：你通常需要將
[DNS 服務器](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/#introduction)
添加到集羣中，以便名稱解析工作。

<!--
When we link to third-party software, or otherwise mention it,
we follow the [content guide](/docs/contribute/style/content-guide/)
and we also mark those third party items.
-->
當我們鏈接到第三方軟件或以其他方式提及它時，我們會遵循[內容指南](/zh-cn/docs/contribute/style/content-guide/)
並標記這些第三方項目。

<!--
Using these shortcodes adds a disclaimer to any documentation page
that uses them.
-->
使用這些短代碼會向使用它們的任何文檔頁面添加免責聲明。

<!--
### Lists {#third-party-content-list}
-->
### 列表  {#third-party-content-list}

<!--
For a list of several third-party items, add:
-->
對於有關幾個第三方項目的列表，請添加：

```
{{%/* thirdparty-content */%}}
```

<!--
just below the heading for the section that includes all items.
-->
在包含所有項目的段落標題正下方。

<!--
### Items {#third-party-content-item}
-->
### 項目  {#third-party-content-item}

<!--
If you have a list where most of the items refer to in-project
software (for example: Kubernetes itself, and the separate
[Descheduler](https://github.com/kubernetes-sigs/descheduler)
component), then there is a different form to use.
-->
如果你有一個列表，其中大多數項目引用項目內軟件（例如：Kubernetes 本身，以及單獨的
[Descheduler](https://github.com/kubernetes-sigs/descheduler)
組件），那麼可以使用不同的形式。

<!--
Add the shortcode:

before the item, or just below the heading for the specific item.
-->
添加短代碼：

在項目之前，或在特定項目的段落下方添加此短代碼：

```
{{%/* thirdparty-content single="true" */%}}
```

<!--
## Details

You can render a `<details>` HTML element using a shortcode:
-->
## 詳細信息

你可以使用短代碼呈現 `<details>` HTML 元素：

<!--
```markdown
{{</* details summary="More about widgets" */>}}
The frobnicator extension API implements _widgets_ using example running text.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
dolore magnam aliquam quaerat voluptatem.
{{</* /details */>}}
```
-->
```markdown
{{</* details summary="有關 widgets 的更多信息" */>}}
frobnicator 擴展 API 使用示例運行文本實現 **widgets**。

沒有哪個人會因爲痛苦本身就是令人愉悅的，而選擇痛苦，
儘管他們有時因爲追求某種快樂而不得不承受痛苦。
但這並不是說他們喜歡痛苦本身，而是因爲通過忍受痛苦，他們可以得到更大的快樂。
{{</* /details */>}}
```

<!--
This renders as:
-->
渲染結果如下：

<!--
{{< details summary="More about widgets" >}}
The frobnicator extension API implements _widgets_ using example running text.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
dolore magnam aliquam quaerat voluptatem.
{{< /details >}}
-->
{{< details summary="有關 widgets 的更多信息" >}}
frobnicator 擴展 API 使用示例運行文本實現 **widgets**。

沒有哪個人會因爲痛苦本身就是令人愉悅的，而選擇痛苦，
儘管他們有時因爲追求某種快樂而不得不承受痛苦。
但這並不是說他們喜歡痛苦本身，而是因爲通過忍受痛苦，他們可以得到更大的快樂。
{{< /details >}}

{{< note >}}
<!--
Use this shortcode sparingly; it is usually best to have all of the text directly shown
to readers.
-->
謹慎使用此短代碼；通常最好將所有文本直接顯示給讀者。
{{< /note >}}

<!--
## Version strings

To generate a version string for inclusion in the documentation, you can choose from
several version shortcodes. Each version shortcode displays a version string derived from
the value of a version parameter found in the site configuration file, `hugo.toml`.
The two most commonly used version parameters are `latest` and `version`.
-->
## 版本號信息 {#version-strings}

要在文檔中生成版本號信息，可以從以下幾種短代碼中選擇。每個短代碼可以基於站點配置文件
`hugo.toml` 中的版本參數生成一個版本號取值。最常用的參數爲 `latest` 和 `version`。

<!--
### `{{</* param "version" */>}}`

The `{{</* param "version" */>}}` shortcode generates the value of the current
version of the Kubernetes documentation from the `version` site parameter. The
`param` shortcode accepts the name of one site parameter, in this case:
`version`.
-->
### `{{</* param "version" */>}}`

`{{</* param "version" */>}}` 短代碼可以基於站點參數 `version` 生成 Kubernetes
文檔的當前版本號取值。短代碼 `param` 允許傳入一個站點參數名稱，在這裏是 `version`。

{{< note >}}
<!--
In previously released documentation, `latest` and `version` parameter values
are not equivalent.  After a new version is released, `latest` is incremented
and the value of `version` for the documentation set remains unchanged. For
example, a previously released version of the documentation displays `version`
as `v1.19` and `latest` as `v1.20`.
-->
在先前已經發布的文檔中，`latest` 和 `version` 參數值並不完全等價。新版本文檔發佈後，參數
`latest` 會增加，而 `version` 則保持不變。例如，在上一版本的文檔中使用 `version` 會得到
`v1.19`，而使用 `latest` 則會得到 `v1.20`。
{{< /note >}}

<!--
Renders to:
-->
轉換爲：

{{< param "version" >}}

<!--
### `{{</* latest-version */>}}`

The `{{</* latest-version */>}}` shortcode returns the value of the `latest` site parameter.
The `latest` site parameter is updated when a new version of the documentation is released.
This parameter does not always match the value of `version` in a documentation set.

Renders to:
-->
### `{{</* latest-version */>}}`

`{{</* latest-version */>}}` 返回站點參數 `latest` 的取值。每當新版本文檔發佈時，該參數均會被更新。
因此，參數 `latest` 與 `version` 並不總是相同。

轉換爲：

{{< latest-version >}}

<!--
### `{{</* latest-semver */>}}`

The `{{</* latest-semver */>}}` shortcode generates the value of `latest`
without the "v" prefix.

Renders to:
-->
### `{{</* latest-semver */>}}`

`{{</* latest-semver */>}}` 短代碼可以生成站點參數 `latest` 不含前綴
`v` 的版本號取值。

轉換爲：

{{< latest-semver >}}

<!--
### `{{</* version-check */>}}`

The `{{</* version-check */>}}` shortcode checks if the `min-kubernetes-server-version`
page parameter is present and then uses this value to compare to `version`.

Renders to:
-->
### `{{</* version-check */>}}`

`{{</* version-check */>}}` 會檢查是否設置了頁面參數 `min-kubernetes-server-version`
並將其與 `version` 進行比較。

轉換爲：

{{< version-check >}}

<!--
### `{{</* latest-release-notes */>}}`

The `{{</* latest-release-notes */>}}` shortcode generates a version string
from `latest` and removes the "v" prefix. The shortcode prints a new URL for
the release note CHANGELOG page with the modified version string.

Renders to:
-->
### `{{</* latest-release-notes */>}}`

`{{</* latest-release-notes */>}}` 短代碼基於站點參數 `latest` 生成不含前綴 `v`
的版本號取值，並輸出該版本更新日誌的超鏈接地址。

轉換爲：

{{< latest-release-notes >}}

## {{% heading "whatsnext" %}}

<!--
* Learn about [Hugo](https://gohugo.io/).
* Learn about [writing a new topic](/docs/contribute/style/write-new-topic/).
* Learn about [page content types](/docs/contribute/style/page-content-types/).
* Learn about [opening a pull request](/docs/contribute/new-content/open-a-pr/).
* Learn about [advanced contributing](/docs/contribute/advanced/).
-->

* 瞭解 [Hugo](https://gohugo.io/)。
* 瞭解[撰寫新的話題](/zh-cn/docs/contribute/style/write-new-topic/)。
* 瞭解[使用頁面內容類型](/zh-cn/docs/contribute/style/page-content-types/)。
* 瞭解[發起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)。
* 瞭解[進階貢獻](/zh-cn/docs/contribute/advanced/)。
