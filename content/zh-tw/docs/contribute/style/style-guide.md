---
title: 文件樣式指南
linktitle: 樣式指南
content_type: concept
weight: 10
---
<!--
title: Documentation Style Guide
linktitle: Style guide
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
This page gives writing style guidelines for the Kubernetes documentation.
These are guidelines, not rules. Use your best judgment, and feel free to
propose changes to this document in a pull request.

For additional information on creating new content for the Kubernetes
documentation, read the [Documentation Content Guide](/docs/contribute/style/content-guide/).

Changes to the style guide are made by SIG Docs as a group. To propose a change
or addition, [add it to the agenda](https://bit.ly/sig-docs-agenda) for an upcoming SIG Docs meeting, and attend the meeting to participate in the
discussion.
-->
本頁討論 Kubernetes 文件的樣式指南。
這些僅僅是指南而不是規則。
你可以自行決定，且歡迎使用 PR 來為此文件提供修改意見。

關於為 Kubernetes 文件貢獻新內容的更多資訊，可以參考
[文件內容指南](/zh-cn/docs/contribute/style/content-guide/)。

樣式指南的變更是 SIG Docs 團隊集體決定。
如要提議更改或新增條目，請先將其新增到下一次 SIG Docs 例會的
[議程表](https://bit.ly/sig-docs-agenda)
上，並按時參加會議討論。

<!-- body -->
<!--
Kubernetes documentation uses [Goldmark Markdown Renderer](https://github.com/yuin/goldmark)
with some adjustments along with a few
[Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/) to support glossary entries, tabs,
and representing feature state.
-->
{{< note >}}
Kubernetes 文件使用帶調整的 [Goldmark Markdown 直譯器](https://github.com/yuin/goldmark/)
和一些 [Hugo 短程式碼](/zh-cn/docs/contribute/style/hugo-shortcodes/) 來支援詞彙表項、Tab
頁以及特性門控標註。
{{< /note >}}

<!--
## Language

Kubernetes documentation has been translated into multiple languages
(see [Localization READMEs](https://github.com/kubernetes/website/blob/main/README.md#localization-readmemds)).

The way of localizing the docs for a different language is described in [Localizing Kubernetes Documentation](/docs/contribute/localization/).

The English-language documentation uses U.S. English spelling and grammar.

{{< comment >}}[If you're localizing this page, you can omit the point about US English.]{{< /comment >}}
-->
## 語言 {#language}

Kubernetes 文件已經被翻譯為多個語種
（參見 [本地化 READMEs](https://github.com/kubernetes/website/blob/main/README.md#localization-readmemds)）。

為文件提供一種新的語言翻譯的途徑可以在
[本地化 Kubernetes 文件](/zh-cn/docs/contribute/localization/)中找到。

英語文件使用美國英語的拼寫和語法。

{{< comment >}}[如果你在翻譯本頁面，你可以忽略關於美國英語的這一條。]{{< /comment >}}

<!--
## Documentation formatting standards

### Use upper camel case for API objects

When you refer specifically to interacting with an API object, use [UpperCamelCase](https://en.wikipedia.org/wiki/Camel_case), also known as Pascal Case. You may see different capitalization, such as "configMap", in the [API reference](/docs/reference/kubernetes-api/). When writing general documentation, it's better to use upper camel case, calling it "ConfigMap" instead.

When you are generally discussing an API object, use [sentence-style capitalization](https://docs.microsoft.com/en-us/style-guide/text-formatting/using-type/use-sentence-style-capitalization).

You may use the word "resource", "API", or "object" to clarify a Kubernetes resource type in a sentence.

Don't split an API object name into separate words. For example, use PodTemplateList, not Pod Template List.

The following examples focus on capitalization. For more information about formatting API object names, review the related guidance on [Code Style](#code-style-inline-code).
-->
## 文件格式標準 {#documentation-formatting-standards}

### 對 API 物件使用大寫駝峰式命名法  {#use-upper-camel-case-for-api-objects}

當你與指定的 API 物件進行互動時，使用[大寫駝峰式命名法](https://en.wikipedia.org/wiki/Camel_case)，也被稱為帕斯卡拼寫法（PascalCase）。
你可能在 [API 參考](/zh-cn/docs/reference/kubernetes-api/)中看到不同的大小寫形式，
例如 "configMap"。在一般性的文件中，最好使用大寫駝峰形式，將之稱作 "ConfigMap"。

在一般性地討論 API 物件時，使用
[句子式大寫](https://docs.microsoft.com/en-us/style-guide/text-formatting/using-type/use-sentence-style-capitalization)。

你可以使用“資源”、“API”或者“物件”這類詞彙來進一步在句子中明確所指的是
一個 Kubernetes 資源型別。

不要將 API 物件的名稱切分成多個單詞。例如，使用 PodTemplateList，
不要使用 Pod Template List。

下面的例子關注的是大小寫問題。關於如何格式化 API 物件的名稱，
有關詳細細節可參考相關的[程式碼風格](#code-style-inline-code)指南。

<!--
{{< table caption = "Do and Don't - Use Pascal case for API objects" >}}
Do | Don't
:--| :-----
The HorizontalPodAutoscaler resource is responsible for ... | The Horizontal pod autoscaler is responsible for ...
A PodList object is a list of pods. | A Pod List object is a list of pods.
The Volume object contains a `hostPath` field. | The volume object contains a hostPath field.
Every ConfigMap object is part of a namespace. | Every configMap object is part of a namespace.
For managing confidential data, consider using the Secret API. | For managing confidential data, consider using the secret API.
{{< /table >}}
-->
{{< table caption = "使用 Pascal 風格大小寫來給出 API 物件的約定" >}}
可以 | 不可以
:--| :-----
該 HorizontalPodAutoscaler 負責... | 該 Horizontal pod autoscaler 負責...
每個 PodList 是一個 Pod 組成的列表。 | 每個 Pod List 是一個由 pods 組成的列表。
該 Volume 物件包含一個 `hostPath` 欄位。 | 此卷物件包含一個 hostPath 欄位。
每個 ConfigMap 物件都是某個名字空間的一部分。| 每個 configMap 物件是某個名字空間的一部分。
要管理機密資料，可以考慮使用 Secret API。 | 要管理機密資料，可以考慮使用秘密 API。
{{< /table >}}

<!--
### Use angle brackets for placeholders

Use angle brackets for placeholders. Tell the reader what a placeholder
represents, for example:

Display information about a Pod:

```shell
kubectl describe pod <pod-name> -n <namespace>
```

If the namespace of the pod is `default`, you can omit the '-n' parameter.
-->
### 在佔位符中使用尖括號

在佔位符中使用尖括號，並讓讀者知道其中代表的事物。例如：

顯示 Pod 資訊：

```shell
kubectl describe pod <pod-名稱> -n <名字空間>
```

如果名字空間被忽略，預設為 `default`，你可以忽略 '-n' 引數。

<!--
### Use bold for user interface elements

{{< table caption = "粗體介面元素約定" >}}
Do | Don't
:--| :-----
Click **Fork**. | Click "Fork".
Select **Other**. | Select "Other".
{{< /table >}}
-->
### 用粗體字表現使用者介面元素

{{< table caption = "粗體介面元素約定" >}}
可以 | 不可以
:--| :-----
點選 **Fork**. | 點選 "Fork".
選擇 **Other**. | 選擇 "Other".
{{< /table >}}

<!--
### Use italics to define or introduce new terms

{{< table caption = "Do and Don't - Use italics for new terms" >}}
Do | Don't
:--| :-----
A _cluster_ is a set of nodes ... | A "cluster" is a set of nodes ...
These components form the _control plane_. | These components form the **control plane**.
{{< /table >}}
-->
### 定義或引入新術語時使用斜體

{{< table caption = "新術語約定" >}}
可以 | 不可以
:--| :-----
每個 _叢集_  是一組節點 ... | 每個“叢集”是一組節點 ...
這些元件構成了 _控制面_. | 這些元件構成了 **控制面**.
{{< /table >}}

<!--
### Use code style for filenames, directories, and paths

{{< table caption = "Do and Don't - Use code style for filenames, directories, and paths" >}}
Do | Don't
:--| :-----
Open the `envars.yaml` file. | Open the envars.yaml file.
Go to the `/docs/tutorials` directory. | Go to the /docs/tutorials directory.
Open the `/_data/concepts.yaml` file. | Open the /\_data/concepts.yaml file.
{{< /table >}}
-->
### 使用程式碼樣式表現檔名、目錄和路徑

{{< table caption = "檔名、目錄和路徑約定" >}}
可以 | 不可以
:--| :-----
開啟 `envars.yaml` 檔案 | 開啟 envars.yaml 檔案
進入到 `/docs/tutorials` 目錄 | 進入到 /docs/tutorials 目錄
開啟 `/_data/concepts.yaml` 檔案 | 開啟 /\_data/concepts.yaml 檔案
{{< /table >}}

<!--
### Use the international standard for punctuation inside quotes

{{< table caption = "Do and Don't - Use the international standard for punctuation inside quotes" >}}
Do | Don't
:--| :-----
events are recorded with an associated "stage". | events are recorded with an associated "stage."
The copy is called a "fork". | The copy is called a "fork."
{{< /table >}}
-->
### 在引號內使用國際標準標點

{{< table caption = "標點符號約定" >}}
可以 | 不可以
:--| :-----
事件記錄中都包含對應的“stage”。 | 事件記錄中都包含對應的“stage。”
此副本稱作一個“fork”。| 此副本稱作一個“fork。”
{{< /table >}}

<!--
## Inline code formatting

### Use code style for inline code and commands, and API objects

For inline code in an HTML document, use the `<code>` tag. In a Markdown
document, use the backtick (`` ` ``).
-->
## 行間程式碼格式    {#inline-code-formatting}

### 為行間程式碼、命令與 API 物件使用程式碼樣式  {#code-style-inline-code}

對於 HTML 文件中的行間程式碼，使用 `<code>` 標記。
在 Markdown 文件中，使用反引號（`` ` ``）。

<!--
{{< table caption = "Do and Don't - Use code style for inline code, commands and API objects" >}}
Do | Don't
:--| :-----
The `kubectl run` command creates a `Pod`. | The "kubectl run" command creates a pod.
The kubelet on each node acquires a `Lease`… | The kubelet on each node acquires a lease…
A `PersistentVolume` represents durable storage… | A Persistent Volume represents durable storage…
For declarative management, use `kubectl apply`. | For declarative management, use "kubectl apply".
Enclose code samples with triple backticks. (\`\`\`)| Enclose code samples with any other syntax.
Use single backticks to enclose inline code. For example, `var example = true`. | Use two asterisks (`**`) or an underscore (`_`) to enclose inline code. For example, **var example = true**.
Use triple backticks before and after a multi-line block of code for fenced code blocks. | Use multi-line blocks of code to create diagrams, flowcharts, or other illustrations.
Use meaningful variable names that have a context. | Use variable names such as 'foo','bar', and 'baz' that are not meaningful and lack context.
Remove trailing spaces in the code. | Add trailing spaces in the code, where these are important, because the screen reader will read out the spaces as well.
{{< /table >}}
-->
{{< table caption = "行間程式碼、命令和 API 物件約定" >}}
可以 | 不可以
:--| :-----
`kubectl run` 命令會建立一個 `Pod` | "kubectl run" 命令會建立一個 pod。
每個節點上的 kubelet 都會獲得一個 `Lease` | 每個節點上的 kubelet 都會獲得一個 lease…
一個 `PersistentVolume` 代表持久儲存 | 一個 Persistent Volume 代表持久儲存…
在宣告式管理中，使用 `kubectl apply`。 | 在宣告式管理中，使用 "kubectl apply"。
用三個反引號來（\`\`\`）標示程式碼示例 | 用其他語法來標示程式碼示例。
使用單個反引號來標示行間程式碼。例如：`var example = true`。 | 使用兩個星號（`**`）或者一個下劃線（`_`）來標示行間程式碼。例如：**var example = true**。
在多行程式碼塊之前和之後使用三個反引號標示隔離的程式碼塊。 | 使用多行程式碼塊來建立示意圖、流程圖或者其他表示。
使用符合上下文的有意義的變數名。 | 使用諸如 'foo'、'bar' 和 'baz' 這類無意義且無語境的變數名。
刪除程式碼中行尾空白。 | 在程式碼中包含行尾空白，因為螢幕抓取工具通常也會抓取空白字元。
{{< /table >}}

<!--
The website supports syntax highlighting for code samples, but specifying a language is optional. Syntax highlighting in the code block should conform to the [contrast guidelines.](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0&showtechniques=141%2C143#contrast-minimum)
-->
{{< note >}}
網站支援為程式碼示例使用語法加亮，不過指定語法加亮是可選的。
程式碼段的語法加亮要遵從[對比度指南](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0&showtechniques=141%2C143#contrast-minimum)
{{< /note >}}

<!--
### Use code style for object field names and namespaces

{{< table caption = "Do and Don't - Use code style for object field names" >}}
Do | Don't
:--| :-----
Set the value of the `replicas` field in the configuration file. | Set the value of the "replicas" field in the configuration file.
The value of the `exec` field is an ExecAction object. | The value of the "exec" field is an ExecAction object.
Run the process as a DaemonSet in the `kube-system` namespace. | Run the process as a DaemonSet in the kube-system namespace.
{{< /table >}}
-->
### 為物件欄位名和名字空間使用程式碼風格

{{< table caption = "物件欄位名約定" >}}
可以 | 不可以
:--| :-----
在配置檔案中設定 `replicas` 欄位的值。 | 在配置檔案中設定 "replicas" 欄位的值。
`exec` 欄位的值是一個 ExecAction 物件。 | "exec" 欄位的值是一個 ExecAction 物件。
在 `kube-system` 名字空間中以 DaemonSet 形式執行此程序。 | 在 kube-system 名字空間中以 DaemonSet 形式執行此程序。
{{< /table >}}

<!--
### Use code style for Kubernetes command tool and component names

{{< table caption = "Do and Don't - Use code style for Kubernetes command tool and component names" >}}
Do | Don't
:--| :-----
The kubelet preserves node stability. | The `kubelet` preserves node stability.
The `kubectl` handles locating and authenticating to the API server. | The kubectl handles locating and authenticating to the apiserver.
Run the process with the certificate, `kube-apiserver --client-ca-file=FILENAME`. | Run the process with the certificate, kube-apiserver --client-ca-file=FILENAME. |
{{< /table >}}
-->
### 用程式碼樣式書寫 Kubernetes 命令工具和元件名

{{< table caption = "Kubernetes 命令工具和元件名" >}}
可以 | 不可以
:--| :-----
`kubelet` 維持節點穩定性。 | kubelet 負責維護節點穩定性。
`kubectl` 處理 API 伺服器的定位和身份認證。| kubectl 處理 API 伺服器的定位和身份認證。
使用該證書執行程序 `kube-apiserver --client-ca-file=FILENAME`. | 使用證書執行程序 kube-apiserver --client-ca-file=FILENAME. |
{{< /table >}}

<!--
### Starting a sentence with a component tool or component name

{{< table caption = "Do and Don't - Starting a sentence with a component tool or component name" >}}
Do | Don't
:--| :-----
The `kubeadm` tool bootstraps and provisions machines in a cluster. | `kubeadm` tool bootstraps and provisions machines in a cluster.
The kube-scheduler is the default scheduler for Kubernetes. | kube-scheduler is the default scheduler for Kubernetes.
{{< /table >}}
-->
### 用工具或元件名稱開始一句話

{{< table caption = "工具或元件名稱使用約定" >}}
可以 | 不可以
:--| :-----
The `kubeadm` tool bootstraps and provisions machines in a cluster. | `kubeadm` tool bootstraps and provisions machines in a cluster.
The kube-scheduler is the default scheduler for Kubernetes. | kube-scheduler is the default scheduler for Kubernetes.
{{< /table >}}

<!--
### Use a general descriptor over a component name

{{< table caption = "Do and Don't - Use a general descriptor over a component name" >}}
Do | Don't
:--| :-----
The Kubernetes API server offers an OpenAPI spec. | The apiserver offers an OpenAPI spec.
Aggregated APIs are subordinate API servers. | Aggregated APIs are subordinate APIServers.
{{< /table >}}
-->
### 儘量使用通用描述而不是元件名稱

{{< table caption = "元件名稱與通用描述" >}}
可以 | 不可以
:--| :-----
Kubernetes API 伺服器提供 OpenAPI 規範。| apiserver 提供 OpenAPI 規範 
聚合 APIs 是下級 API 伺服器。 | 聚合 APIs 是下級 APIServers。
{{< /table >}}

<!--
### Use normal style for string and integer field values

For field values of type string or integer, use normal style without quotation marks.

{{< table caption = "Do and Don't - Use normal style for string and integer field values" >}}
Do | Don't
:--| :-----
Set the value of `imagePullPolicy` to Always. | Set the value of `imagePullPolicy` to "Always".
Set the value of `image` to nginx:1.16. | Set the value of `image` to `nginx:1.16`.
Set the value of the `replicas` field to 2. | Set the value of the `replicas` field to `2`.
{{< /table >}}
-->
### 使用普通樣式表達字串和整數字段值

對於字串或整數，使用正常樣式，不要帶引號。

{{< table caption = "字串和整數字段值約定" >}}
可以 | 不可以
:--| :-----
將 `imagePullPolicy` 設定為 Always。 | 將 `imagePullPolicy` 設定為 "Always"。
將 `image` 設定為 nginx:1.16. | 將 `image` 設定為 `nginx:1.16`。
將 `replicas` 欄位值設定為 2. | 將 `replicas` 欄位值設定為 `2`.
{{< /table >}}

<!--
## Code snippet formatting

### Don't include the command prompt

{{< table caption = "Do and Don't - Don't include the command prompt" >}}
Do | Don't
:--| :-----
kubectl get pods | $ kubectl get pods
{{< /table >}}
-->
## 程式碼段格式

### 不要包含命令列提示符

{{< table caption = "命令列提示符約定" >}}
可以 | 不可以
:--| :-----
kubectl get pods | $ kubectl get pods
{{< /table >}}

<!--
### Separate commands from output

Verify that the pod is running on your chosen node:

```shell
kubectl get pods --output=wide
```

The output is similar to this:

```console
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```
-->
### 將命令和輸出分開

例如：

驗證 Pod 已經在你所選的節點上執行：

```shell
kubectl get pods --output=wide
```

輸出類似於：

```console
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

<!--
### Versioning Kubernetes examples

Code examples and configuration examples that include version information should be consistent with the accompanying text.

If the information is version specific, the Kubernetes version needs to be defined in the `prerequisites` section of the [Task template](/docs/contribute/style/page-content-types/#task) or the [Tutorial template](/docs/contribute/style/page-content-types/#tutorial). Once the page is saved, the `prerequisites` section is shown as **Before you begin**.

To specify the Kubernetes version for a task or tutorial page, include `min-kubernetes-server-version` in the front matter of the page.
-->
### 為 Kubernetes 示例給出版本

程式碼示例或者配置示例如果包含版本資訊，應該與對應的文字描述一致。

如果所給的資訊是特定於具體版本的，需要在
[任務模版](/zh-cn/docs/contribute/style/page-content-types/#task)
或[教程模版](/zh-cn/docs/contribute/style/page-content-types/#tutorial)
的 `prerequisites` 小節定義 Kubernetes 版本。
頁面儲存之後，`prerequisites` 小節會顯示為 **開始之前**。

如果要為任務或教程頁面指定 Kubernetes 版本，可以在檔案的前言部分包含
`min-kubernetes-server-version` 資訊。

<!--
If the example YAML is in a standalone file, find and review the topics that
include it as a reference.  Verify that any topics using the standalone YAML
have the appropriate version information defined.  If a stand-alone YAML file
is not referenced from any topics, consider deleting it instead of updating
it.

For example, if you are writing a tutorial that is relevant to Kubernetes
version 1.8, the front-matter of your markdown file should look something
like:
-->
如果示例 YAML 是一個獨立檔案，找到並審查包含該檔案的主題頁面。
確認使用該獨立 YAML 檔案的主題都定義了合適的版本資訊。
如果獨立的 YAML 檔案沒有在任何主題中引用，可以考慮刪除該檔案，
而不是繼續更新它。

例如，如果你在編寫一個教程，與 Kubernetes 1.8 版本相關。那麼你的 Markdown
檔案的檔案頭應該開始起來像這樣：

```yaml
---
title: <教程標題>
min-kubernetes-server-version: v1.8
---
```

<!--
In code and configuration examples, do not include comments about alternative versions.
Be careful to not include incorrect statements in your examples as comments, such as:

```yaml
apiVersion: v1 # earlier versions use...
kind: Pod
...
```
-->
在程式碼和配置示例中，不要包含其他版本的註釋資訊。
尤其要小心不要在示例中包含不正確的註釋資訊，例如：

```yaml
apiVersion: v1 # 早期版本使用...
kind: Pod
...
```
<!--
## Kubernetes.io word list

A list of Kubernetes-specific terms and words to be used consistently across the site.

{{< table caption = "Kubernetes.io word list" >}}
Term | Usage
:--- | :----
Kubernetes | Kubernetes should always be capitalized.
Docker | Docker should always be capitalized.
SIG Docs | SIG Docs rather than SIG-DOCS or other variations.
On-premises | On-premises or On-prem rather than On-premise or other variations.
{{< /table >}}
-->
## Kubernetes.io 術語列表

以下特定於 Kubernetes 的術語和詞彙在使用時要保持一致性。

{{< table caption = "Kubernetes.io 詞彙表" >}}
術語 | 用法
:--- | :----
Kubernetes | Kubernetes 的首字母要保持大寫。
Docker | Docker 的首字母要保持大寫。
SIG Docs | SIG Docs 是正確拼寫形式，不要用 SIG-DOCS 或其他變體。
On-premises | On-premises 或 On-prem 而不是 On-premise 或其他變體。
{{< /table >}}

<!--
## Shortcodes

Hugo [Shortcodes](https://gohugo.io/content-management/shortcodes) help create different rhetorical appeal levels. Our documentation supports three different shortcodes in this category: **Note** `{{</* note */>}}`, **Caution** `{{</* caution */>}}`, and **Warning** `{{</* warning */>}}`.

1. Surround the text with an opening and closing shortcode.

2. Use the following syntax to apply a style:

   ```none
   {{</* note */>}}
   No need to include a prefix; the shortcode automatically provides one. (Note:, Caution:, etc.)
   {{</* /note */>}}
   ```

   The output is:

   {{< note >}}
   The prefix you choose is the same text for the tag.
   {{< /note >}}
-->

## 短程式碼（Shortcodes） {#shortcodes}

Hugo [短程式碼（Shortcodes）](https://gohugo.io/content-management/shortcodes)
有助於建立比較漂亮的展示效果。我們的文件支援三個不同的這類短程式碼。
**注意** `{{</* note */>}}`、**小心** `{{</* caution */>}}` 和 **警告** `{{</* warning */>}}`。

1. 將要突出顯示的文字用短程式碼的開始和結束形式包圍。
2. 使用下面的語法來應用某種樣式：

   ```none
   {{</* note */>}}
   不需要字首；短程式碼會自動新增字首（注意：、小心：等）
   {{</* /note */>}}
   ```

   輸出的樣子是：

   {{< note >}}
   你所選擇的標記決定了文字的字首。
   {{< /note >}}

<!--
### Note

Use `{{</* note */>}}` to highlight a tip or a piece of information that may be helpful to know.

For example:

```
{{</* note */>}}
You can _still_ use Markdown inside these callouts.
{{</* /note */>}}
```

The output is:

{{< note >}}
You can _still_ use Markdown inside these callouts.
{{< /note >}}
-->
### 註釋（Note） {#note}

使用短程式碼 `{{</* note */>}}` 來突出顯示某種提示或者有助於讀者的資訊。

例如:

```
{{</* note */>}}
在這類短程式碼中仍然 _可以_ 使用 Markdown 語法。
{{</* /note */>}}
```

輸出為：

{{< note >}}
在這類短程式碼中仍然 _可以_ 使用 Markdown 語法。
{{< /note >}}

<!--
You can use a `{{</* note */>}}` in a list:

```
1. Use the note shortcode in a list

1. A second item with an embedded note

   {{</* note */>}}
   Warning, Caution, and Note shortcodes, embedded in lists, need to be indented four spaces. See [Common Shortcode Issues](#common-shortcode-issues).
   {{</* /note */>}}

1. A third item in a list

1. A fourth item in a list
```
-->
你可以在列表中使用 `{{</* note */>}}`：

```
1. 在列表中使用 note 短程式碼

1. 帶巢狀 note 的第二個條目

   {{</* note */>}}
   警告、小心和注意短程式碼可以巢狀在列表中，但是要縮排四個空格。
   參見[常見短程式碼問題](#common-shortcode-issues)。
   {{</* /note */>}}

1. 列表中第三個條目

1. 列表中第四個條目
```

<!--
The output is:

1. Use the note shortcode in a list

1. A second item with an embedded note

    {{< note >}}
    Warning, Caution, and Note shortcodes, embedded in lists, need to be indented four spaces. See [Common Shortcode Issues](#common-shortcode-issues).
    {{< /note >}}

1. A third item in a list

1. A fourth item in a list
-->
其輸出為：

1. 在列表中使用 note 短程式碼

1. 帶巢狀 note 的第二個條目

    {{< note >}}
    警告、小心和注意短程式碼可以巢狀在列表中，但是要縮排四個空格。
    參見[常見短程式碼問題](#common-shortcode-issues)。
    {{< /note >}}

1. 列表中第三個條目

1. 列表中第四個條目

<!--
### Caution

Use `{{</* caution */>}}` to call attention to an important piece of information to avoid pitfalls.

For example:

```
{{</* caution */>}}
The callout style only applies to the line directly above the tag.
{{</* /caution */>}}
```

The output is:

{{< caution >}}
The callout style only applies to the line directly above the tag.
{{< /caution >}}
-->
### 小心（Caution）  {#caution}

使用 `{{</* caution */>}}` 短程式碼來引起讀者對某段資訊的重視，以避免遇到問題。

例如：

```
{{</* caution */>}}
此短程式碼樣式僅對標記之上的一行起作用。
{{</* /caution */>}}
```

其輸出為：

{{< caution >}}
此短程式碼樣式僅對標記之上的一行起作用。
{{< /caution >}}

<!--
### Warning

Use `{{</* warning */>}}` to indicate danger or a piece of information that is crucial to follow.

For example:

```
{{</* warning */>}}
Beware.
{{</* /warning */>}}
```

The output is:

{{< warning >}}
Beware.
{{< /warning >}}
-->
### 警告（Warning）  {#warning}

使用 `{{</* warning */>}}` 來表明危險或者必須要重視的一則資訊。

例如：

```
{{</* warning */>}}
注意事項
{{</* /warning */>}}
```

其輸出為：

{{< warning >}}
注意事項
{{< /warning >}}

<!--
### Katacoda Embedded Live Environment

This button lets users run Minikube in their browser using the [Katacoda Terminal](https://www.katacoda.com/embed/panel).
It lowers the barrier of entry by allowing users to use Minikube with one click instead of going through the complete
Minikube and Kubectl installation process locally.

The Embedded Live Environment is configured to run `minikube start` and lets users complete tutorials in the same window
as the documentation.

{{< caution >}}
The session is limited to 15 minutes.
{{< /caution >}}

For example:

```
{{</* kat-button */>}}
```

The output is:

{{< kat-button >}}
-->
### Katacoda 巢狀現場環境

此按鈕允許使用者使用 [Katacoda 終端](https://www.katacoda.com/embed/panel)
在其瀏覽器中執行 Minikube。該環境降低了使用者對 Minikube 的入門難度，
只需要一次滑鼠點選即可完成，而不需要完全經歷 Minikube 和 kubectl 的安裝過程。

巢狀現場環境配置為執行 `minikube start`，允許使用者在文件所在的視窗完成教程。

{{< caution >}}
會話限制為 15 分鐘。
{{< /caution >}}

例如：

```
{{</* kat-button */>}}
```

其輸出為：

{{< kat-button >}}
<!--
## Common Shortcode Issues

### Ordered Lists

Shortcodes will interrupt numbered lists unless you indent four spaces before the notice and the tag.

For example:

    1. Preheat oven to 350˚F
    
    1. Prepare the batter, and pour into springform pan.
       `{{</* note */>}}Grease the pan for best results.{{</* /note */>}}`

    1. Bake for 20-25 minutes or until set.

The output is:

1. Preheat oven to 350˚F

1. Prepare the batter, and pour into springform pan.

   {{< note >}}Grease the pan for best results.{{< /note >}}

1. Bake for 20-25 minutes or until set.
-->
## 常見的短程式碼問題  {#common-shortcode-issues}

### 編號列表

短程式碼會打亂編號列表的編號，除非你在資訊和標誌之前都縮排四個空格。

例如：

```
1. 預熱到 350˚F
1. 準備好麵糊，倒入烘烤盤
    {{</* note */>}}給盤子抹上油可以達到最佳效果。{{</* /note */>}}
1. 烘烤 20 到 25 分鐘，或者直到滿意為止。
```

其輸出結果為：

1. 預熱到 350˚F
1. 準備好麵糊，倒入烘烤盤
   {{< note >}}給盤子抹上油可以達到最佳效果。{{< /note >}}
1. 烘烤 20 到 25 分鐘，或者直到滿意為止。

<!--
### Include Statements

Shortcodes inside include statements will break the build. You must insert them in the parent document, before and after you call the include. For example:

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```
-->
### Include 語句

如果短程式碼出現在 include 語境中，會導致網站無法構建。
你必須將他們插入到上級文件中，分別將開始標記和結束標記插入到 include 語句之前和之後。
例如：

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```

<!--
## Markdown elements

### Line breaks
Use a single newline to separate block-level content like headings, lists, images, code blocks, and others. The exception is second-level headings, where it should be two newlines. Second-level headings follow the first-level (or the title) without any preceding paragraphs or texts. A two line spacing helps visualize the overall structure of content in a code editor better.
-->
## Markdown 元素 {#markdown-elements}

### 換行  {#line-breaks}

使用單一換行符來隔離塊級內容，例如標題、列表、圖片、程式碼塊以及其他元素。
這裡的例外是二級標題，必須有兩個換行符。
二級標題緊隨一級標題（或標題），中間沒有段落或文字。

兩行的留白有助於在程式碼編輯器中檢視整個內容的結構組織。

<!--
### Headings
People accessing this documentation may use a screen reader or other assistive technology (AT). [Screen readers](https://en.wikipedia.org/wiki/Screen_reader) are linear output devices, they output items on a page one at a time. If there is a lot of content on a page, you can use headings to give the page an internal structure. A good page structure helps all readers to easily navigate the page or filter topics of interest.

{{< table caption = "Do and Don't - Headings" >}}
Do | Don't
:--| :-----
Update the title in the front matter of the page or blog post. | Use first level heading, as Hugo automatically converts the title in the front matter of the page into a first-level heading.
Use ordered headings to provide a meaningful high-level outline of your content. | Use headings level 4 through 6, unless it is absolutely necessary. If your content is that detailed, it may need to be broken into separate articles.
Use pound or hash signs (`#`) for non-blog post content. | Use underlines (`---` or `===`) to designate first-level headings.
Use sentence case for headings. For example, **Extend kubectl with plugins** | Use title case for headings. For example, **Extend Kubectl With Plugins**
{{< /table >}}
-->
### 標題  {#headings}

訪問文件的讀者可能會使用螢幕抓取程式或者其他輔助技術。
[螢幕抓取器](https://en.wikipedia.org/wiki/Screen_reader)是一種線性輸出裝置,
它們每次輸出頁面上的一個條目。
如果頁面上內容過多，你可以使用標題來為頁面組織結構。
頁面的良好結構對所有讀者都有幫助，使得他們更容易瀏覽或者過濾感興趣的內容。

{{< table caption = "標題約定" >}}
可以 | 不可以
:--| :-----
更新頁面或部落格在前言部分中的標題 | 使用一級標題。因為 Hugo 會自動將頁面前言部分的標題轉化為一級標題。
使用編號的標題以便內容組織有一個更有意義的結構。| 使用四級到六級標題，除非非常有必要這樣。如果你要編寫的內容有非常多細節，可以嘗試拆分成多個不同頁面。
在非部落格內容頁面中使用井號（`#`）| 使用下劃線 `---` 或 `===` 來標記一級標題。
使用正常大小寫來標示標題。例如：**Extend kubectl with plugins** | 使用首字母大寫來標示標題。例如：**Extend Kubectl With Plugins**
{{< /table >}}

<!--
### Paragraphs

{{< table caption = "Do and Don't - Paragraphs" >}}
Do | Don't
:--| :-----
Try to keep paragraphs under 6 sentences. | Indent the first paragraph with space characters. For example, ⋅⋅⋅Three spaces before a paragraph will indent it.
Use three hyphens (`---`) to create a horizontal rule. Use horizontal rules for breaks in paragraph content. For example, a change of scene in a story, or a shift of topic within a section. | Use horizontal rules for decoration.
{{< /table >}}
-->
### 段落    {#paragraphs}

{{< table caption = "段落約定" >}}
可以 | 不可以 
:--| :-----
嘗試不要讓段落超出 6 句話。 | 用空格來縮排第一段。例如，⋅⋅⋅段落前面的三個空格會將其縮排。
使用三個連字元（`---`）來建立水平線。使用水平線來分隔段落內容。例如，在故事中切換場景或者在上下文中切換主題。 | 使用水平線來裝飾頁面。
{{< /table >}}

<!--
### Links

{{< table caption = "Do and Don't - Links" >}}
Do | Don't
Write hyperlinks that give you context for the content they link to. For example: Certain ports are open on your machines. See <a href="#check-required-ports">Check required ports</a> for more details. | Use ambiguous terms such as “click here”. For example: Certain ports are open on your machines. See <a href="#check-required-ports">here</a> for more details.
Write Markdown-style links: `[link text](URL)`. For example: `[Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions)` and the output is [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions). | Write HTML-style links: `<a href="/media/examples/link-element-example.css" target="_blank">Visit our tutorial!</a>`, or create links that open in new tabs or windows. For example: `[example website](https://example.com){target="_blank"}`
{{< /table >}}
-->
### 連結   {#links}

{{< table caption = "連結約定" >}}
可以 | 不可以
:--| :-----
插入超級連結時給出它們所連結到的目標內容的上下文。例如：你的機器上某些埠處於開放狀態。參見<a href="#check-required-ports">檢查所需埠</a>瞭解更詳細資訊。| 使用有二義性的術語，如“點選這裡”。例如：你的機器上某些埠處於開啟狀態。參見<a href="#check-required-ports">這裡</a>瞭解詳細資訊。
編寫 Markdown 風格的連結：`[連結文字](URL)`。例如：`[Hugo 短程式碼](/zh-cn/docs/contribute/style/hugo-shortcodes/#table-captions)`，輸出是[Hugo 短程式碼](/zh-cn/docs/contribute/style/hugo-shortcodes/#table-captions). | 編寫 HTML 風格的超級連結：`<a href="/media/examples/link-element-example.css" target="_blank">訪問我們的教程！</a>`，或者建立會開啟新 Tab 頁或新視窗的連結。例如：`[網站示例](https://example.com){target="_blank"}`。
{{< /table >}}

<!--
### Lists

Group items in a list that are related to each other and need to appear in a specific order or to indicate a correlation between multiple items. When a screen reader comes across a list—whether it is an ordered or unordered list—it will be announced to the user that there is a group of list items. The user can then use the arrow keys to move up and down between the various items in the list.
Website navigation links can also be marked up as list items; after all they are nothing but a group of related links.

- End each item in a list with a period if one or more items in the list are complete sentences. For the sake of consistency, normally either all items or none should be complete sentences.

  {{< note >}} Ordered lists that are part of an incomplete introductory sentence can be in lowercase and punctuated as if each item was a part of the introductory sentence.{{< /note >}}
-->
### 列表  {#lists}

將一組相互關聯的內容組織到一個列表中，以便表達這些條目彼此之間有先後順序或者某種相互關聯關係。
當螢幕抓取器遇到列表時，無論該列表是否有序，它會告知使用者存在一組列舉的條目。
使用者可以使用箭頭鍵來上下移動，瀏覽列表中條目。
網站導航連結也可以標記成列表條目，因為說到底他們也是一組相互關聯的連結而已。

- 如果列表中一個或者多個條目是完整的句子，則在每個條目末尾新增句號。
  出於一致性考慮，一般要麼所有條目要麼沒有條目是完整句子。

  {{< note >}}
  編號列表如果是不完整的介紹性句子的一部分，可以全部用小寫字母，並按照
  每個條目都是句子的一部分來看待和處理。
  {{< /note >}}

<!--
- Use the number one (`1.`) for ordered lists.

- Use (`+`), (`*`), or (`-`) for unordered lists.

- Leave a blank line after each list.

- Indent nested lists with four spaces (for example, ⋅⋅⋅⋅).

- List items may consist of multiple paragraphs. Each subsequent paragraph in a list item must be indented by either four spaces or one tab.
-->
- 在編號列表中，使用數字 1（`1.`）

- 對非排序列表，使用加號（`+`）、星號（`*`）、或者減號（`-`）

- 在每個列表之後留一個空行

- 對於巢狀的列表，相對縮排四個空格（例如，⋅⋅⋅⋅）。

- 列表條目可能包含多個段落。每個後續段落都要縮排或者四個空格或者一個製表符。

<!--
### Tables

The semantic purpose of a data table is to present tabular data. Sighted users can quickly scan the table but a screen reader goes through line by line. A table caption is used to create a descriptive title for a data table. Assistive technologies (AT) use the HTML table caption element to identify the table contents to the user within the page structure.

- Add table captions using [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions) for tables.
-->
### 表格  {#tables}

資料表格的語義用途是呈現表格化的資料。
使用者可以快速瀏覽表格，但螢幕抓取器需要逐行地處理資料。
表格標題可以用來給資料表提供一個描述性的標題。
輔助技術使用 HTML 表格標題元素來在頁面結構中辨識表格內容。

- 請 [Hugo 短程式碼](/zh-cn/docs/contribute/style/hugo-shortcodes/#table-captions)
  為表格新增標題。

<!--
## Content best practices

This section contains suggested best practices for clear, concise, and consistent content.

### Use present tense

{{< table caption = "Do and Don't - Use present tense" >}}
Do | Don't
This command starts a proxy. | This command will start a proxy.
{{< /table >}}

Exception: Use future or past tense if it is required to convey the correct
meaning.
-->
## 內容最佳實踐   {#content-best-practices}

本節包含一些建議的最佳實踐，用來開發清晰、明確一致的文件內容。

### 使用現在時態

{{< table caption = "使用現在時態" >}}
可以 | 不可以
:--| :-----
此命令啟動代理。| 此命令將啟動一個代理。
{{< /table >}}

例外：如果需要使用過去時或將來時來表達正確含義時，是可以使用的。

<!--
### Use active voice

{{< table caption = "Do and Don't - Use active voice" >}}
Do | Don't
You can explore the API using a browser. | The API can be explored using a browser.
The YAML file specifies the replica count. | The replica count is specified in the YAML file.
{{< /table >}}  

Exception: Use passive voice if active voice leads to an awkward construction.
-->
### 使用主動語態

{{< table caption = "使用主動語態" >}}
可以 | 不可以
:--| :-----
你可以使用瀏覽器來瀏覽 API。| API 可以被使用瀏覽器來瀏覽。
YAML 檔案給出副本個數。 | 副本個數是在 YAML 檔案中給出的。
{{< /table >}}  

例外：如果主動語態會導致句子很難構造時，可以使用被動語態。

<!--
### Use simple and direct language

Use simple and direct language. Avoid using unnecessary phrases, such as saying "please."

{{< table caption = "Do and Don't - Use simple and direct language" >}}
Do | Don't
To create a ReplicaSet, ... | In order to create a ReplicaSet, ...
See the configuration file. | Please see the configuration file.
View the pods. | With this next command, we'll view the Pods.
{{< /table >}}  
-->
### 使用簡單直接的語言

使用簡單直接的語言。避免不必要的短語，例如說“請”。

{{< table caption = "使用簡單直接語言" >}}
可以 | 不可以
:--| :-----
要建立 ReplicaSet，... | 如果你想要建立 ReplicaSet，...
參看配置檔案。 | 請自行檢視配置檔案。
檢視 Pods。| 使用下面的命令，我們將會看到 Pods。
{{< /table >}}  

<!--
### Address the reader as "you"

{{< table caption = "Do and Don't - Addressing the reader" >}}
Do | Don't
:--| :-----
You can create a Deployment by ... | We'll create a Deployment by ...
In the preceding output, you can see... | In the preceding output, we can see ...
{{< /table >}}  
-->
### 將讀者稱為“你”

{{< table caption = "將讀者稱為“你”" >}}
可以 | 不可以
:--| :-----
你可以透過 ... 建立一個 Deployment。 | 透過...我們將建立一個 Deployment。
在前面的輸出中，你可以看到... | 在前面的輸出中，我們可以看到...
{{< /table >}}  

<!--
### Avoid Latin phrases

Prefer English terms over Latin abbreviations.

{{< table caption = "Do and Don't - Avoid Latin phrases" >}}
Do | Don't
For example, ... | e.g., ...
That is, ...| i.e., ...
{{< /table >}}   

Exception: Use "etc." for et cetera.
-->
### 避免拉丁短語

儘可能使用英語而不是拉丁語縮寫。

{{< table caption = "避免拉丁語短語" >}}
可以 | 不可以 
:--| :-----
例如，... | e.g., ...
也就是說，...| i.e., ...
{{< /table >}}   

例外：使用 etc. 表示等等。

<!--
## Patterns to avoid

### Avoid using "we"

Using "we" in a sentence can be confusing, because the reader might not know
whether they're part of the "we" you're describing.

{{< table caption = "Do and Don't - Patterns to avoid" >}}
Do | Don't
Version 1.4 includes ... | In version 1.4, we have added ...
Kubernetes provides a new feature for ... | We provide a new feature ...
This page teaches you how to use pods. | In this page, we are going to learn about pods.
{{< /table >}}   
-->
## 應避免的模式

### 避免使用“我們”

在句子中使用“我們”會讓人感到困惑，因為讀者可能不知道這裡的
“我們”指的是誰。

{{< table caption = "要避免的模式" >}}
可以 | 不可以
:--| :-----
版本 1.4 包含了 ... | 在 1.4 版本中，我們添加了 ...
Kubernetes 為 ... 提供了一項新功能。 | 我們提供了一項新功能...
本頁面教你如何使用 Pods。| 在本頁中，我們將會學到如何使用 Pods。
{{< /table >}}   

<!--
### Avoid jargon and idioms

Some readers speak English as a second language. Avoid jargon and idioms to help them understand better.

{{< table caption = "Do and Don't - Avoid jargon and idioms" >}}
Do | Don't
:--| :-----
Internally, ... | Under the hood, ...
Create a new cluster. | Turn up a new cluster.
{{< /table >}}   
-->
### 避免使用俚語或行話

對某些讀者而言，英語是其外語。
避免使用一些俚語或行話有助於他們更方便的理解內容。

{{< table caption = "避免使用俚語或行話" >}}
可以 | 不可以
:--| :-----
Internally, ... | Under the hood, ...
Create a new cluster. | Turn up a new cluster.
{{< /table >}}   

<!--
### Avoid statements about the future

Avoid making promises or giving hints about the future. If you need to talk about
an alpha feature, put the text under a heading that identifies it as alpha
information.

An exception to this rule is documentation about announced deprecations
targeting removal in future versions. One example of documentation like this
is the [Deprecated API migration guide](/docs/reference/using-api/deprecation-guide/).
-->
### 避免關於將來的陳述

要避免對將來作出承諾或暗示。如果你需要討論的是 Alpha 功能特性，可以將相關文字
放在一個單獨的標題下，標示為 alpha 版本資訊。

此規則的一個例外是對未來版本中計劃移除的已廢棄功能選項的文件。
此類文件的例子之一是
[已棄用 API 遷移指南](/docs/reference/using-api/deprecation-guide/)。

<!--
### Avoid statements that will soon be out of date

Avoid words like "currently" and "new." A feature that is new today might not be
considered new in a few months.

{{< table caption = "Do and Don't - Avoid statements that will soon be out of date" >}}
Do | Don't
In version 1.4, ... | In the current version, ...
The Federation feature provides ... | The new Federation feature provides ...
{{< /table >}}  
-->

### 避免使用很快就會過時的表達

避免使用一些很快就會過時的陳述，例如“目前”、“新的”。
今天而言是新的功能，過了幾個月之後就不再是新的了。

{{< table caption = "避免使用很快過時的表達" >}}
可以 | 不可以 
:--| :-----
在版本 1.4 中，... | 在當前版本中，...
聯邦功能特性提供 ... | 新的聯邦功能特性提供 ...
{{< /table >}}  

<!--
### Avoid words that assume a specific level of understanding

Avoid words such as "just", "simply", "easy", "easily", or "simple". These words do not add value.

{{< table caption = "Do and Don't - Avoid insensitive words" >}}
Do | Don't
:--| :-----
Include one command in ... | Include just one command in ...
Run the container ... | Simply run the container ...
You can remove ... | You can easily remove ...
These steps ... | These simple steps ...
{{< /table >}}
-->
### 避免使用隱含使用者對某技術有一定理解的詞彙

避免使用“只是”、“僅僅”、“簡單”、“很容易地”、“很簡單”這類詞彙。
這些詞並沒有提升文件的價值。

{{< table caption = "避免無意義詞彙的注意事項" >}}
可以 | 不可以
:--| :-----
在 ... 中包含一個命令 | 只需要在... 中包含一個命令
執行容器 ... | 只需執行該容器...
你可以移除... | 你可以很容易地移除...
這些步驟... | 這些簡單的步驟...
{{< /table >}}

## {{% heading "whatsnext" %}}

* 瞭解[編寫新主題](/zh-cn/docs/contribute/style/write-new-topic/)。
* 瞭解[頁面內容型別](/zh-cn/docs/contribute/style/page-content-types/)。
* 瞭解[發起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)。

