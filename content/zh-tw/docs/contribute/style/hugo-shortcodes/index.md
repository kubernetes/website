---
title: 定製 Hugo 短程式碼
content_type: concept
---
<!--
title: Custom Hugo Shortcodes
content_type: concept
-->

<!-- overview -->

<!--
This page explains the custom Hugo shortcodes that can be used in Kubernetes Markdown documentation.
-->
本頁面將介紹 Hugo 自定義短程式碼，可以用於 Kubernetes Markdown 文件書寫。

<!--
Read more about shortcodes in the [Hugo documentation](https://gohugo.io/content-management/shortcodes).
-->
關於短程式碼的更多資訊可參見 [Hugo 文件](https://gohugo.io/content-management/shortcodes)。

<!-- body -->

<!--
## Feature state

In a Markdown page (`.md` file) on this site, you can add a shortcode to
display version and state of the documented feature.
-->
## 功能狀態

在本站的 Markdown 頁面（`.md` 檔案）中，你可以加入短程式碼來展示所描述的功能特性的版本和狀態。

<!--
### Feature state demo

Below is a demo of the feature state snippet, which displays the feature as
stable in the latest Kubernetes version.
-->
### 功能狀態示例

下面是一個功能狀態程式碼段的演示，表明這個功能已經在最新版 Kubernetes 中穩定了。

```
{{</* feature-state state="stable" */>}}
```

<!--
Renders to:
-->
會轉換為：

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
### 功能狀態程式碼

所顯示的 Kubernetes 預設為該頁或站點版本。
修改 <code>for_k8s_version</code> 短程式碼引數可以調整要顯示的版本。例如

```
{{</* feature-state for_k8s_version="v1.10" state="beta" */>}}
```

<!--
Renders to:
-->
會轉換為：

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

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
## 詞彙

有兩種詞彙表提示：`glossary_tooltip` 和 `glossary_definition`。

你可以透過加入術語詞彙的短程式碼，來自動更新和替換相應連結中的內容
（[我們的詞彙庫](/zh-cn/docs/reference/glossary/)）
在瀏覽線上文件時，術語會顯示為超連結的樣式，當滑鼠移到術語上時，其解釋就會顯示在提示框中。

除了包含工具提示外，你還可以重用頁面內容中詞彙表中的定義。
<!--
The raw data for glossary terms is stored at
[the glossary directory](https://github.com/kubernetes/website/tree/main/content/en/docs/reference/glossary),
with a content file for each glossary term.
-->

詞彙術語的原始資料儲存在[詞彙目錄](https://github.com/kubernetes/website/tree/main/content/en/docs/reference/glossary)，
每個內容檔案對應相應的術語解釋。

<!--
### Glossary demo

For example, the following include within the Markdown renders to
{{< glossary_tooltip text="cluster" term_id="cluster" >}} with a tooltip:
-->
### 詞彙演示

例如下面的程式碼在 Markdown 中將會轉換為
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
呈現為： 
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
呈現為： 
{{< glossary_definition term_id="cluster" length="all" >}}

<!--
## Links to API Reference
-->
## 連結至 API 參考 {#links-to-api-reference}

<!--
You can link to a page of the Kubernetes API reference using the
`api-reference` shortcode, for example to the
{{< api-reference page="workload-resources/pod-v1" >}} reference:
-->
你可以使用 `api-reference` 短程式碼連結到 Kubernetes API 參考頁面，例如
Pod
{{< api-reference page="workload-resources/pod-v1" >}} 參考檔案：

```
{{</* api-reference page="workload-resources/pod-v1" */>}}
```

<!--
The content of the `page` parameter is the suffix of the URL of the API reference page.
-->
本語句中 `page` 引數的內容是 API 參考頁面的 URL 字尾。


<!--
You can link to a specific place into a page by specifying an `anchor`
parameter, for example to the {{< api-reference page="workload-resources/pod-v1" anchor="PodSpec" >}}
reference or the {{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" >}}
section of the page:
-->
你可以透過指定 `anchor` 引數連結到頁面中的特定位置，例如到
{{< api-reference page="workload-resources/pod-v1" anchor="PodSpec" >}} 參考，或頁面的
{{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" >}}
部分。

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
你可以透過指定 `text` 引數來更改連結的文字，例如透過連結到頁面的
{{< api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="環境變數">}}
部分：

```
{{</* api-reference page="workload-resources/pod-v1" anchor="environment-variables" text="環境變數" */>}}
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

透過新增表格標題，你可以讓表格能夠被螢幕閱讀器讀取。
要向表格新增[標題（Caption）](https://www.w3schools.com/tags/tag_caption.asp)，
可用 `table` 短程式碼包圍表格定義，並使用 `caption` 引數給出表格標題。

{{< note >}}
表格標題對螢幕閱讀器是可見的，但在標準 HTML 中檢視時是不可見的。
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
{{</* table caption="配置引數" >}}
引數      | 描述        | 預設值
:---------|:------------|:-------
`timeout` | 請求的超時時長 | `30s`
`logLevel` | 日誌輸出的級別 | `INFO`
{{< /table */>}}
```

所渲染的表格如下：

{{< table caption="配置引數" >}}
引數      | 描述        | 預設值
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
如果你查看錶格的 HTML 輸出結果，你會看到 `<table>` 元素
後面緊接著下面的元素：

```html
<caption style="display: none;">配置引數</caption>
```

<!--
## Tabs

In a markdown page (`.md` file) on this site, you can add a tab set to display
multiple flavors of a given solution.

The `tabs` shortcode takes these parameters:
-->
## 標籤頁

在本站的 Markdown 頁面（`.md` 檔案）中，你可以加入一個標籤頁集來顯示
某解決方案的不同形式。

標籤頁的短程式碼包含以下引數：

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
* `name`： 標籤頁上顯示的名字。
* `codelang`: 如果要在 `tab` 短程式碼中加入內部內容，需要告知 Hugo 使用的是什麼程式碼語言，方便程式碼高亮。
* `include`: 標籤頁中所要包含的檔案。如果標籤頁是在 Hugo 的
  [葉子包](https://gohugo.io/content-management/page-bundles/#leaf-bundles)中定義，
  Hugo 會在包內查詢檔案（可以是 Hugo 所支援的任何 MIME 型別檔案）。
  否則，Hugo 會在當前路徑的相對路徑下查詢所要包含的內容頁面。
  注意，在 `include` 頁面中不能包含短程式碼內容，必須要使用自結束（self-closing）語法。
  例如 `{{</* tab name="Content File #1" include="example1" /*/>}}`。
  如果沒有在 `codelang` 進行宣告的話，Hugo 會根據檔名推測所用的語言。
  預設情況下，非內容檔案將會被程式碼高亮。
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
下面是標籤頁短程式碼的示例。

{{< note >}}
內容頁面下的 **tabs** 定義中的標籤頁 **name** 必須是唯一的。
{{< /note >}}

<!--
### Tabs demo: Code highlighting
-->
### 標籤頁演示：程式碼高亮

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

<!--
Renders to:
-->
會轉換為：

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
這是 **一些 markdown。**
{{< note >}}
它甚至可以包含短程式碼。
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
會轉換為：

{{< tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
這是 **一些 markdown。**
{{< note >}}
它甚至可以包含短程式碼。
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
### 標籤頁演示：檔案巢狀

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
會轉換為：

{{< tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate.json" />}}
{{< /tabs >}}

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
執行 Kubernetes 需要第三方軟體。例如：你通常需要將
[DNS 伺服器](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/#introduction)
新增到叢集中，以便名稱解析工作。

<!--
When we link to third-party software, or otherwise mention it,
we follow the [content guide](/docs/contribute/style/content-guide/)
and we also mark those third party items.
-->
當我們連結到第三方軟體或以其他方式提及它時，我們會遵循[內容指南](/zh-cn/docs/contribute/style/content-guide/)
並標記這些第三方專案。

<!--
Using these shortcodes adds a disclaimer to any documentation page
that uses them.
-->
使用這些短程式碼會向使用它們的任何文件頁面新增免責宣告。

<!--
### Lists {#third-party-content-list}
-->
### 列表  {#third-party-content-list}

<!--
For a list of several third-party items, add:
-->
對於有關幾個第三方專案的列表，請新增：
```
{{%/* thirdparty-content */%}}
```
<!--
just below the heading for the section that includes all items.
-->
在包含所有專案的段落標題正下方。

<!--
### Items {#third-party-content-item}
-->
### 專案  {#third-party-content-item}

<!--
If you have a list where most of the items refer to in-project
software (for example: Kubernetes itself, and the separate
[Descheduler](https://github.com/kubernetes-sigs/descheduler)
component), then there is a different form to use.
-->
如果你有一個列表，其中大多數專案引用專案內軟體（例如：Kubernetes 本身，以及單獨的
[Descheduler](https://github.com/kubernetes-sigs/descheduler)
元件），那麼可以使用不同的形式。

<!--
Add the shortcode:

before the item, or just below the heading for the specific item.
-->
在專案之前，或在特定專案的段落下方新增此短程式碼：
```
{{%/* thirdparty-content single="true" */%}}
```


<!--
## Version strings

To generate a version string for inclusion in the documentation, you can choose from
several version shortcodes. Each version shortcode displays a version string derived from
the value of a version parameter found in the site configuration file, `config.toml`.
The two most commonly used version parameters are `latest` and `version`.
-->
## 版本號資訊

要在文件中生成版本號資訊，可以從以下幾種短程式碼中選擇。每個短程式碼可以基於站點配置檔案
`config.toml` 中的版本引數生成一個版本號取值。最常用的引數為 `latest` 和 `version`。

<!--
### `{{</* param "version" */>}}`

The `{{</* param "version" */>}}` shortcode generates the value of the current
version of the Kubernetes documentation from the `version` site parameter. The
`param` shortcode accepts the name of one site parameter, in this case:
`version`.
-->
### `{{</* param "version" */>}}`

`{{</* param "version" */>}}` 短程式碼可以基於站點引數 `version` 生成 Kubernetes
文件的當前版本號取值。短程式碼 `param` 允許傳入一個站點引數名稱，在這裡是 `version`。

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
在先前已經發布的文件中，`latest` 和 `version` 引數值並不完全等價。新版本文件釋出後，引數
`latest` 會增加，而 `version` 則保持不變。例如，在上一版本的文件中使用 `version` 會得到
`v1.19`，而使用 `latest` 則會得到 `v1.20`。
{{< /note >}}

<!--
Renders to:
-->
轉換為：

{{< param "version" >}}

<!--
### `{{</* latest-version */>}}`

The `{{</* latest-version */>}}` shortcode returns the value of the `latest` site parameter.
The `latest` site parameter is updated when a new version of the documentation is released.
This parameter does not always match the value of `version` in a documentation set.

Renders to:
-->
### `{{</* latest-version */>}}`

`{{</* latest-version */>}}` 返回站點引數 `latest` 的取值。每當新版本文件釋出時，該引數均會被更新。
因此，引數 `latest` 與 `version` 並不總是相同。

轉換為：

{{< latest-version >}}

<!--
### `{{</* latest-semver */>}}`

The `{{</* latest-semver */>}}` shortcode generates the value of `latest`
without the "v" prefix.

Renders to:
-->
### `{{</* latest-semver */>}}`

`{{</* latest-semver */>}}` 短程式碼可以生成站點引數 `latest` 不含字首 `v` 的版本號取值。

轉換為：

{{< latest-semver >}}

<!--
### `{{</* version-check */>}}`

The `{{</* version-check */>}}` shortcode checks if the `min-kubernetes-server-version`
page parameter is present and then uses this value to compare to `version`.

Renders to:
-->
### `{{</* version-check */>}}`

`{{</* version-check */>}}` 會檢查是否設定了頁面引數 `min-kubernetes-server-version`
並將其與 `version` 進行比較。

轉換為：

{{< version-check >}}

<!--
### `{{</* latest-release-notes */>}}`

The `{{</* latest-release-notes */>}}` shortcode generates a version string
from `latest` and removes the "v" prefix. The shortcode prints a new URL for
the release note CHANGELOG page with the modified version string.

Renders to:
-->
### `{{</* latest-release-notes */>}}`

`{{</* latest-release-notes */>}}` 短程式碼基於站點引數 `latest` 生成不含字首 `v`
的版本號取值，並輸出該版本更新日誌的超連結地址。

轉換為：

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
* 瞭解[使用頁面內容型別](/zh-cn/docs/contribute/style/page-content-types/)。
* 瞭解[發起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)。
* 瞭解[進階貢獻](/zh-cn/docs/contribute/advanced/)。
