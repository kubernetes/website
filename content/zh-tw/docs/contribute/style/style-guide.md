---
title: 文檔樣式指南
linktitle: 樣式指南
content_type: concept
weight: 40
math: true
---
<!--
title: Documentation Style Guide
linktitle: Style guide
content_type: concept
weight: 40
math: true
-->

<!-- overview -->

<!--
This page gives writing style guidelines for the Kubernetes documentation.
These are guidelines, not rules. Use your best judgment, and feel free to
propose changes to this document in a pull request.

For additional information on creating new content for the Kubernetes
documentation, read the [Documentation Content Guide](/docs/contribute/style/content-guide/).

Changes to the style guide are made by SIG Docs as a group. To propose a change
or addition, [add it to the agenda](https://bit.ly/sig-docs-agenda) for an upcoming
SIG Docs meeting, and attend the meeting to participate in the discussion.
-->
本頁討論 Kubernetes 文檔的樣式指南。
這些僅僅是指南而不是規則。
你可以自行決定，且歡迎使用 PR 來爲此文檔提供修改意見。

關於爲 Kubernetes 文檔貢獻新內容的更多資訊，
可以參考[文檔內容指南](/zh-cn/docs/contribute/style/content-guide/)。

樣式指南的變更是 SIG Docs 團隊集體決定。
如要提議更改或新增條目，請先將其添加到下一次 SIG Docs
例會的[議程表](https://bit.ly/sig-docs-agenda)上，並按時參加會議討論。

<!-- body -->

{{< note >}}
<!--
Kubernetes documentation uses
[Goldmark Markdown Renderer](https://github.com/yuin/goldmark)
with some adjustments along with a few
[Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/) to support
glossary entries, tabs, and representing feature state.
-->
Kubernetes 文檔使用帶調整的 [Goldmark Markdown 解釋器](https://github.com/yuin/goldmark/)
和一些 [Hugo 短代碼](/zh-cn/docs/contribute/style/hugo-shortcodes/)來支持詞彙表項、Tab
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

Kubernetes 文檔已經被翻譯爲多個語種
（參見 [本地化 README](https://github.com/kubernetes/website/blob/main/README.md#localization-readmemds)）。

[本地化 Kubernetes 文檔](/zh-cn/docs/contribute/localization/)描述瞭如何爲一種新的語言提供本地化文檔。

英語文檔使用美國英語的拼寫和語法。

{{< comment >}}[如果你在翻譯本頁面，你可以忽略關於美國英語的這一條。]{{< /comment >}}

<!--
## Documentation formatting standards

### Use upper camel case for API objects

When you refer specifically to interacting with an API object, use
[UpperCamelCase](https://en.wikipedia.org/wiki/Camel_case), also known as
Pascal case. You may see different capitalization, such as "configMap",
in the [API Reference](/docs/reference/kubernetes-api/). When writing
general documentation, it's better to use upper camel case, calling it "ConfigMap" instead.

When you are generally discussing an API object, use
[sentence-style capitalization](https://docs.microsoft.com/en-us/style-guide/text-formatting/using-type/use-sentence-style-capitalization).

The following examples focus on capitalization. For more information about formatting
API object names, review the related guidance on [Code Style](#code-style-inline-code).
-->
## 文檔格式標準 {#documentation-formatting-standards}

### 對 API 對象使用大寫駝峯式命名法  {#use-upper-camel-case-for-api-objects}

當你與指定的 API 對象進行交互時，
使用[大寫駝峯式命名法](https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)，
也被稱爲帕斯卡拼寫法（PascalCase）。
你可以在 [API 參考](/zh-cn/docs/reference/kubernetes-api/)中看到不同的大小寫形式，例如 "configMap"。
在編寫通用文檔時，最好使用大寫駝峯形式，將之稱作 "ConfigMap"。

通常在討論 API 對象時，使用
[句子式大寫](https://docs.microsoft.com/en-us/style-guide/text-formatting/using-type/use-sentence-style-capitalization)。

下面的例子關注的是大小寫問題。關於如何格式化 API 對象名稱的更多資訊，
可參考相關的[代碼風格](#code-style-inline-code)指南。

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
{{< table caption = "使用 Pascal 風格大小寫來給出 API 對象的約定" >}}
可以 | 不可以
:--| :-----
該 HorizontalPodAutoscaler 負責... | 該 Horizontal pod autoscaler 負責...
每個 PodList 是一個 Pod 組成的列表。 | 每個 Pod List 是一個由 Pod 組成的列表。
該 Volume 對象包含一個 `hostPath` 字段。 | 此卷對象包含一個 hostPath 字段。
每個 ConfigMap 對象都是某個名字空間的一部分。| 每個 configMap 對象是某個名字空間的一部分。
要管理機密資料，可以考慮使用 Secret API。 | 要管理機密資料，可以考慮使用祕密 API。
{{< /table >}}

<!--
### Use angle brackets for placeholders

Use angle brackets for placeholders. Tell the reader what a placeholder
represents, for example:

Display information about a pod:

```shell
kubectl describe pod <pod-name> -n <namespace>
```

If the namespace of the pod is `default`, you can omit the '-n' parameter.
-->
### 在佔位符中使用尖括號

用尖括號表示佔位符，讓讀者知道佔位符表示的是什麼。例如：

顯示有關 Pod 的資訊：

```shell
kubectl describe pod <Pod 名稱> -n <名字空間>
```

如果名字空間被忽略，預設爲 `default`，你可以省略 '-n' 參數。

<!--
### Use bold for user interface elements

{{< table caption = "Do and Don't - Bold interface elements" >}}
Do | Don't
:--| :-----
Click **Fork**. | Click "Fork".
Select **Other**. | Select "Other".
{{< /table >}}
-->
### 用粗體字表現使用者界面元素

{{< table caption = "以粗體表示使用者界面元素" >}}
可以 | 不可以
:--| :-----
點擊 **Fork**。 | 點擊 "Fork"。
選擇 **Other**。 | 選擇 "Other"。
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
這些組件構成了 _控制面_。 | 這些組件構成了 **控制面**。
{{< /table >}}

{{< note >}}
注意：這一條不適用於中文本地化，中文本地化過程中通常將英文斜體改爲粗體。
{{< /note >}}

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
### 使用代碼樣式表現檔案名、目錄和路徑

{{< table caption = "檔案名、目錄和路徑約定" >}}
可以 | 不可以
:--| :-----
打開 `envars.yaml` 檔案 | 打開 envars.yaml 檔案
進入到 `/docs/tutorials` 目錄 | 進入到 /docs/tutorials 目錄
打開 `/_data/concepts.yaml` 檔案 | 打開 /\_data/concepts.yaml 檔案
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

### Use code style for inline code, commands {#code-style-inline-code}

For inline code in an HTML document, use the `<code>` tag. In a Markdown
document, use the backtick (`` ` ``). However, API kinds such as StatefulSet
or ConfigMap are written verbatim (no backticks); this allows using possessive
apostrophes.
-->
## 行間代碼格式    {#inline-code-formatting}

### 爲行間代碼、命令使用代碼樣式  {#code-style-inline-code}

對於 HTML 文檔中的行間代碼，使用 `<code>` 標記。在 Markdown 文檔中，使用反引號（`` ` ``）。
然而，StatefulSet 或 ConfigMap 這些 API 類別是直接書寫的（不用反引號）；這樣允許使用表示所有格的撇號。

<!--
{{< table caption = "Do and Don't - Use code style for inline code, commands, and API objects" >}}
Do | Don't
:--| :-----
The `kubectl run` command creates a Pod. | The "kubectl run" command creates a Pod.
The kubelet on each node acquires a Lease… | The kubelet on each node acquires a `Lease`…
A PersistentVolume represents durable storage… | A `PersistentVolume` represents durable storage…
The CustomResourceDefinition's `.spec.group` field… | The `CustomResourceDefinition.spec.group` field…
For declarative management, use `kubectl apply`. | For declarative management, use "kubectl apply".
Enclose code samples with triple backticks. (\`\`\`)| Enclose code samples with any other syntax.
Use single backticks to enclose inline code. For example, `var example = true`. | Use two asterisks (`**`) or an underscore (`_`) to enclose inline code. For example, **var example = true**.
Use triple backticks before and after a multi-line block of code for fenced code blocks. | Use multi-line blocks of code to create diagrams, flowcharts, or other illustrations.
Use meaningful variable names that have a context. | Use variable names such as 'foo','bar', and 'baz' that are not meaningful and lack context.
Remove trailing spaces in the code. | Add trailing spaces in the code, where these are important, because the screen reader will read out the spaces as well.
{{< /table >}}
-->
{{< table caption = "行間代碼、命令和 API 對象約定" >}}
可以 | 不可以
:--| :-----
`kubectl run` 命令會創建一個 Pod。 | "kubectl run" 命令會創建一個 Pod。
每個節點上的 kubelet 都會獲得一個 Lease… | 每個節點上的 kubelet 都會獲得一個 `Lease`…
一個 PersistentVolume 代表持久儲存… | 一個 `PersistentVolume` 代表持久儲存…
CustomResourceDefinition 的 `.spec.group` 字段… | `CustomResourceDefinition.spec.group` 字段…
在聲明式管理中，使用 `kubectl apply`。 | 在聲明式管理中，使用 "kubectl apply"。
用三個反引號來（\`\`\`）標示代碼示例 | 用其他語法來標示代碼示例。
使用單個反引號來標示行間代碼。例如：`var example = true`。 | 使用兩個星號（`**`）或者一個下劃線（`_`）來標示行間代碼。例如：**var example = true**。
在多行代碼塊之前和之後使用三個反引號標示隔離的代碼塊。 | 使用多行代碼塊來創建示意圖、流程圖或者其他表示。
使用符合上下文的有意義的變量名。 | 使用諸如 'foo'、'bar' 和 'baz' 這類無意義且無語境的變量名。
刪除代碼中行尾空白。 | 在代碼中包含行尾空白，因爲屏幕抓取工具通常也會抓取空白字符。
{{< /table >}}

{{< note >}}
<!--
The website supports syntax highlighting for code samples, but specifying a language
is optional. Syntax highlighting in the code block should conform to the
[contrast guidelines.](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0&showtechniques=141%2C143#contrast-minimum)
-->
網站支持爲代碼示例使用語法加亮，不過指定語法加亮是可選的。
代碼段的語法加亮要遵從[對比度指南](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0&showtechniques=141%2C143#contrast-minimum)
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
### 爲對象字段名和名字空間使用代碼風格

{{< table caption = "對象字段名約定" >}}
可以 | 不可以
:--| :-----
在配置文件中設置 `replicas` 字段的值。 | 在配置文件中設置 "replicas" 字段的值。
`exec` 字段的值是一個 ExecAction 對象。 | "exec" 字段的值是一個 ExecAction 對象。
在 `kube-system` 名字空間中以 DaemonSet 形式運行此進程。 | 在 kube-system 名字空間中以 DaemonSet 形式運行此進程。
{{< /table >}}

<!--
### Use code style for Kubernetes command tool and component names

{{< table caption = "Do and Don't - Use code style for Kubernetes command tool and component names" >}}
Do | Don't
:--| :-----
The `kubelet` preserves node stability. | The `kubelet` preserves node stability.
The `kubectl` handles locating and authenticating to the API server. | The kubectl handles locating and authenticating to the apiserver.
Run the process with the certificate, `kube-apiserver --client-ca-file=FILENAME`. | Run the process with the certificate, kube-apiserver --client-ca-file=FILENAME. |
{{< /table >}}
-->
### 用代碼樣式書寫 Kubernetes 命令工具和組件名

{{< table caption = "Kubernetes 命令工具和組件名" >}}
可以 | 不可以
:--| :-----
`kubelet` 維持節點穩定性。 | kubelet 負責維護節點穩定性。
`kubectl` 處理 API 伺服器的定位和身份認證。| kubectl 處理 API 伺服器的定位和身份認證。
使用該證書運行進程 `kube-apiserver --client-ca-file=FILENAME`。| 使用證書運行進程 kube-apiserver --client-ca-file=FILENAME。|
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
### 用工具或組件名稱開始一句話

{{< table caption = "工具或組件名稱使用約定" >}}
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
### 儘量使用通用描述而不是組件名稱

{{< table caption = "組件名稱與通用描述" >}}
可以 | 不可以
:--| :-----
Kubernetes API 伺服器提供 OpenAPI 規範。| apiserver 提供 OpenAPI 規範。
聚合 API 是下級 API 伺服器。 | 聚合 API 是下級 APIServer。
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
### 使用普通樣式表達字符串和整數字段值

對於字符串或整數，使用正常樣式，不要帶引號。

{{< table caption = "字符串和整數字段值約定" >}}
可以 | 不可以
:--| :-----
將 `imagePullPolicy` 設置爲 Always。 | 將 `imagePullPolicy` 設置爲 "Always"。
將 `image` 設置爲 nginx:1.16。 | 將 `image` 設置爲 `nginx:1.16`。
將 `replicas` 字段值設置爲 2。 | 將 `replicas` 字段值設置爲 `2`。
{{< /table >}}

<!--
However, consider quoting values where there is a risk that readers might confuse the value
with an API kind.
-->
然而，在讀者可能會將某些值與 API 類別混淆時，請考慮爲這些值添加引號。

<!--
## Referring to Kubernetes API resources

This section talks about how we reference API resources in the documentation.

### Clarification about "resource"

Kubernetes uses the word _resource_ to refer to API resources. For example,
the URL path `/apis/apps/v1/namespaces/default/deployments/my-app` represents a
Deployment named "my-app" in the "default"
{{< glossary_tooltip text="namespace" term_id="namespace" >}}. In HTTP jargon,
{{< glossary_tooltip text="namespace" term_id="namespace" >}} is a resource -
the same way that all web URLs identify a resource.
-->
## 引用 Kubernetes API 資源   {#referring-to-kubernetes-api-resources}

本節討論我們如何在文檔中引用 API 資源。

### 有關 “資源” 的闡述

Kubernetes 使用單詞 _resource_ 一詞來指代 API 資源。
例如，URL 路徑 `/apis/apps/v1/namespaces/default/deployments/my-app` 表示 "default"
{{< glossary_tooltip text="名字空間" term_id="namespace" >}}中名爲 "my-app" 的 Deployment。
在 HTTP 的術語中，{{< glossary_tooltip text="名字空間" term_id="namespace" >}}是一個資源，
就像所有 Web URL 都標識一個資源。

<!--
Kubernetes documentation also uses "resource" to talk about CPU and memory
requests and limits. It's very often a good idea to refer to API resources
as "API resources"; that helps to avoid confusion with CPU and memory resources,
or with other kinds of resource.
-->
Kubernetes 文檔在討論 CPU 和內存請求以及限制也使用“資源（resource）”一詞。
將 API 資源稱爲 "API 資源" 往往是一個好的做法；這有助於避免與 CPU 和內存資源或其他類別的資源混淆。

<!--
If you are using the lowercase plural form of a resource name, such as
`deployments` or `configmaps`, provide extra written context to help readers
understand what you mean. If you are using the term in a context where the
UpperCamelCase name could work too, and there is a risk of ambiguity,
consider using the API kind in UpperCamelCase.
-->
如果你使用資源名稱的小寫複數形式，例如 `deployments` 或 `configmaps`，
請提供額外的書面上下文來幫助讀者理解你的用意。
如果你使用術語時所處的上下文中使用駝峯編碼（UpperCamelCase）的名稱也可行，且術語存在歧義的風險，
應該考慮使用 UpperCamelCase 形式的 API 類別。

<!--
### When to use Kubernetes API terminologies

The different Kubernetes API terminologies are:

- _API kinds_: the name used in the API URL (such as `pods`, `namespaces`).
  API kinds are sometimes also called _resource types_.
- _API resource_: a single instance of an API kind (such as `pod`, `secret`).
- _Object_: a resource that serves as a "record of intent". An object is a desired
  state for a specific part of your cluster, which the Kubernetes control plane tries to maintain.
  All objects in the Kubernetes API are also resources.
-->
### 何時使用 Kubernetes API 術語

不同 Kubernetes API 術語的說明如下：

- **API 類別** ：API URL 中使用的名稱（如 `pods`、`namespaces`）。
  API 類別有時也稱爲 **資源類型** 。
- **API 資源** ：API 類別的單個實例（如 `pod`、`secret`）
- **對象** ：作爲 “意向記錄” 的資源。對象是集羣特定部分的期望狀態，
  該狀態由 Kubernetes 控制平面負責維護。
  Kubernetes API 中的所有對象也都是資源。

<!--
For clarity, you can add "resource" or "object" when referring to an API resource in Kubernetes
documentation.
An example: write "a Secret object" instead of "a Secret".
If it is clear just from the capitalization, you don't need to add the extra word.

Consider rephrasing when that change helps avoid misunderstandings. A common situation is
when you want to start a sentence with an API kind, such as “Secret”; because English
and other languages capitalize at the start of sentences, readers cannot tell whether you
mean the API kind or the general concept. Rewording can help.
-->
爲了清晰起見，在 Kubernetes 文檔中引用 API 資源時可以使用 "資源" 或 "對象"。
例如：寫成 "Secret 對象" 而不是 "Secret"。
如果僅大寫就能明確含義，那麼無需添加額外的單詞。

當修改有助於避免誤解時，那就考慮修改表述。
一個常見的情況是當你想要某個句子以 "Secret" 這種 API 類別開頭時；
因爲英語和其他幾種語言會對句首的第一個字母大寫，所以讀者無法確定你說的是 API 類別還是一般概念。
此時重新構詞有助於讓句子更清晰。

<!--
### API resource names

Always format API resource names using [UpperCamelCase](https://en.wikipedia.org/wiki/Camel_case),
also known as PascalCase. Do not write API kinds with code formatting.

Don't split an API object name into separate words. For example, use PodTemplateList, not Pod Template List.

For more information about PascalCase and code formatting, review the related guidance on
[Use upper camel case for API objects](/docs/contribute/style/style-guide/#use-upper-camel-case-for-api-objects)
and [Use code style for inline code, commands, and API objects](/docs/contribute/style/style-guide/#code-style-inline-code).

For more information about Kubernetes API terminologies, review the related
guidance on [Kubernetes API terminology](/docs/reference/using-api/api-concepts/#standard-api-terminology).
-->
### API 資源名稱

始終使用[大寫駝峯式命名法](https://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)
（也稱爲 PascalCase）來表達 API 資源名稱。不要使用代碼格式書寫 API 類別。

不要將 API 對象的名稱切分成多個單詞。
例如請使用 PodTemplateList 而非 Pod Template List。

有關 PascalCase 和代碼格式的更多信息，
請查看[對 API 對象使用大寫駝峯式命名法](/zh-cn/docs/contribute/style/style-guide/#use-upper-camel-case-for-api-objects)
和[針對內嵌代碼、命令與 API 對象使用代碼樣式](/zh-cn/docs/contribute/style/style-guide/#code-style-inline-code)。

有關 Kubernetes API 術語的更多信息，
請查看 [Kubernetes API 術語](/zh-cn/docs/reference/using-api/api-concepts/#standard-api-terminology)的相關指南。

<!--
## Code snippet formatting

### Don't include the command prompt

{{< table caption = "Do and Don't - Don't include the command prompt" >}}
Do | Don't
:--| :-----
`kubectl get pods` | `$ kubectl get pods`
{{< /table >}}
-->
## 代碼段格式   {#code-snippet-formatting}

### 不要包含命令行提示符   {#do-not-include-the-command-promot}

{{< table caption = "命令行提示符約定" >}}
可以 | 不可以
:--| :-----
`kubectl get pods` | `$ kubectl get pods`
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
### 將命令和輸出分開   {#separate-commands-from-output}

例如：

驗證 Pod 已經在你所選的節點上運行：

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

Code examples and configuration examples that include version information should
be consistent with the accompanying text.

If the information is version specific, the Kubernetes version needs to be defined
in the `prerequisites` section of the [Task template](/docs/contribute/style/page-content-types/#task)
or the [Tutorial template](/docs/contribute/style/page-content-types/#tutorial).
Once the page is saved, the `prerequisites` section is shown as **Before you begin**.

To specify the Kubernetes version for a task or tutorial page, include
`min-kubernetes-server-version` in the front matter of the page.
-->
### 爲 Kubernetes 示例給出版本   {#versioning-kubernetes-examples}

代碼示例或者配置示例如果包含版本信息，應該與對應的文字描述一致。

如果所給的信息是特定於具體版本的，需要在
[任務模板](/zh-cn/docs/contribute/style/page-content-types/#task)
或[教程模板](/zh-cn/docs/contribute/style/page-content-types/#tutorial)
的 `prerequisites` 小節定義 Kubernetes 版本。
頁面保存之後，`prerequisites` 小節會顯示爲**開始之前**。

如果要爲任務或教程頁面指定 Kubernetes 版本，可以在文件的前言部分包含
`min-kubernetes-server-version` 信息。

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
如果示例 YAML 是一個獨立文件，找到並審查包含該文件的主題頁面。
確認使用該獨立 YAML 文件的主題都定義了合適的版本信息。
如果獨立的 YAML 文件沒有在任何主題中引用，可以考慮刪除該文件，
而不是繼續更新它。

例如，如果你在編寫一個教程，與 Kubernetes 1.8 版本相關。那麼你的 Markdown
文件的文件頭應該開始起來像這樣：

<!--
```yaml
---
title: <your tutorial title here>
min-kubernetes-server-version: v1.8
---
```
-->
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
在代碼和配置示例中，不要包含其他版本的註釋信息。
尤其要小心不要在示例中包含不正確的註釋信息，例如：

```yaml
apiVersion: v1 # 早期版本使用...
kind: Pod
...
```

<!--
## Formulae and equations

You can use the Docsy support for [diagrams and formulae](https://www.docsy.dev/docs/adding-content/diagrams-and-formulae/#latex-support-with-katex).

For example: `\\(\frac{7}{9} \sqrt{K^8 s}\\)`, which renders as \\(\frac{7}{9} \sqrt{K^8 s}\\).
-->
## 公式與方程

你可以使用 Docsy
對[圖表和公式](https://www.docsy.dev/docs/adding-content/diagrams-and-formulae/#latex-support-with-katex)的支持。

例如：`\$\frac{7}{9} \sqrt{K^8 s}\$`，渲染結果爲 \\(\frac{7}{9} \sqrt{K^8 s}\\)。

<!--
Prefer inline formulae where reasonable, but you can use a `math` block if that's likely to help readers.

Read the Docsy guide to find out what you need to change in your page to activate support;
if you have problems, add `math: true` to the page [front matter](https://gohugo.io/content-management/front-matter/)
(you can do this even if you think the automatic activation should be enough).
-->
儘可能使用行內公式，但在有助於讀者理解的情況下，也可以使用 `math` 塊。

請閱讀 Docsy 指南，瞭解需要在頁面中進行哪些更改以激活支持；如果遇到問題，
請在頁面的[前置元數據](https://gohugo.io/content-management/front-matter/)中添加
`math: true`（即使你認爲自動激活已足夠，也可以這樣做）。

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
cloud native | Cloud native or cloud native as appropriate for sentence structure rather than cloud-native or Cloud Native.
open source | Open source or open source as appropriate for sentence structure rather than open-source or Open Source.
{{< /table >}}
-->
## Kubernetes.io 術語列表   {#kubernetes-io-word-list}

以下特定於 Kubernetes 的術語和詞彙在使用時要保持一致性。

{{< table caption = "Kubernetes.io 詞彙表" >}}
術語 | 用法
:--- | :----
Kubernetes | Kubernetes 的首字母要保持大寫。
Docker | Docker 的首字母要保持大寫。
SIG Docs | SIG Docs 是正確拼寫形式，不要用 SIG-DOCS 或其他變體。
On-premises | On-premises 或 On-prem 而不是 On-premise 或其他變體。
cloud native | Cloud native 或 cloud native 適合句子結構，而不是 cloud-native 或 Cloud Native。
open source | Open source 或 open source 適合句子結構，而不是 open-source 或 Open Source。
{{< /table >}}

<!--
## Shortcodes

Hugo [Shortcodes](https://gohugo.io/content-management/shortcodes) help create
different rhetorical appeal levels. Our documentation supports three different
shortcodes in this category: **Note** `{{</* note */>}}`,
**Caution** `{{</* caution */>}}`, and **Warning** `{{</* warning */>}}`.

1. Surround the text with an opening and closing shortcode.

2. Use the following syntax to apply a style:

   ```none
   {{</* note */>}}
   No need to include a prefix; the shortcode automatically provides one. (Note:, Caution:, etc.)
   {{</* /note */>}}
   ```

   The output is:
-->
## 短代碼（Shortcodes） {#shortcodes}

Hugo [短代碼（Shortcodes）](https://gohugo.io/content-management/shortcodes)
有助於創建比較漂亮的展示效果。我們的文檔支持三個不同的這類短代碼。
**注意** `{{</* note */>}}`、**小心** `{{</* caution */>}}` 和 **警告** `{{</* warning */>}}`。

1. 將要突出顯示的文字用短代碼的開始和結束形式包圍。
2. 使用下面的語法來應用某種樣式：

   ```none
   {{</* note */>}}
   不需要前綴；短代碼會自動添加前綴（注意：、小心：等）
   {{</* /note */>}}
   ```

   輸出的樣子是：

   {{< note >}}
   <!--
   The prefix you choose is the same text for the tag.
   -->
   你所選擇的標記決定了文字的前綴。
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
-->
### 註釋（Note） {#note}

使用短代碼 `{{</* note */>}}` 來突出顯示某種提示或者有助於讀者的信息。

例如：

```
{{</* note */>}}
在這類短代碼中仍然 _可以_ 使用 Markdown 語法。
{{</* /note */>}}
```

輸出爲：

{{< note >}}
<!--
You can _still_ use Markdown inside these callouts.
-->
在這類短代碼中仍然**可以**使用 Markdown 語法。
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
1. 在列表中使用 note 短代碼

1. 帶嵌套 note 的第二個條目

   {{</* note */>}}
   警告、小心和注意短代碼可以嵌套在列表中，但是要縮進四個空格。
   參見[常見短代碼問題](#common-shortcode-issues)。
   {{</* /note */>}}

1. 列表中第三個條目

1. 列表中第四個條目
```

<!--
The output is:

1. Use the note shortcode in a list

1. A second item with an embedded note
-->
其輸出爲：

1. 在列表中使用 note 短代碼

2. 帶嵌套 note 的第二個條目

    <!--
    Warning, Caution, and Note shortcodes, embedded in lists, need to be indented four spaces. See [Common Shortcode Issues](#common-shortcode-issues).
    -->
    
    {{< note >}}
    警告、小心和註釋短代碼可以嵌套在列表中，但是要縮進四個空格。
    參見[常見短代碼問題](#common-shortcode-issues)。
    {{< /note >}}

<!--
1. A third item in a list

1. A fourth item in a list
-->
3. 列表中第三個條目

4. 列表中第四個條目

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
-->
### 小心（Caution）  {#caution}

使用 `{{</* caution */>}}` 短代碼來引起讀者對某段信息的重視，以避免遇到問題。

例如：

```
{{</* caution */>}}
此短代碼樣式僅對標記之上的一行起作用。
{{</* /caution */>}}
```

其輸出爲：

{{< caution >}}
<!--
The callout style only applies to the line directly above the tag.
-->
此短代碼樣式僅對標記之上的一行起作用。
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
-->
### 警告（Warning）  {#warning}

使用 `{{</* warning */>}}` 來表明危險或者必須要重視的一則信息。

例如：

```
{{</* warning */>}}
注意事項
{{</* /warning */>}}
```

其輸出爲：

{{< warning >}}
<!--
Beware.
-->
注意事項
{{< /warning >}}

<!--
## Common Shortcode Issues

### Ordered Lists

Shortcodes will interrupt numbered lists unless you indent four spaces before the notice and the tag.

For example:

    1. Preheat oven to 350˚F
    
    1. Prepare the batter, and pour into springform pan.
       {{</* note */>}}Grease the pan for best results.{{</* /note */>}}

    1. Bake for 20-25 minutes or until set.

The output is:

1. Preheat oven to 350˚F

1. Prepare the batter, and pour into springform pan.

   {{< note >}}Grease the pan for best results.{{< /note >}}

1. Bake for 20-25 minutes or until set.
-->
## 常見的短代碼問題  {#common-shortcode-issues}

### 編號列表   {#ordered-lists}

短代碼會打亂編號列表的編號，除非你在信息和標誌之前都縮進四個空格。

例如：

```
1. 預熱到 350˚F
1. 準備好麪糊，倒入烘烤盤
    {{</* note */>}}給盤子抹上油可以達到最佳效果。{{</* /note */>}}
1. 烘烤 20 到 25 分鐘，或者直到滿意爲止。
```

其輸出結果爲：

1. 預熱到 350˚F
1. 準備好麪糊，倒入烘烤盤
   {{< note >}}給盤子抹上油可以達到最佳效果。{{< /note >}}
1. 烘烤 20 到 25 分鐘，或者直到滿意爲止。

<!--
### Include Statements

Shortcodes inside include statements will break the build. You must insert them
in the parent document, before and after you call the include. For example:

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```
-->
### Include 語句   {#include-statements}

如果短代碼出現在 include 語境中，會導致網站無法構建。
你必須將他們插入到上級文檔中，分別將開始標記和結束標記插入到 include 語句之前和之後。
例如：

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```

<!--
## Markdown elements

### Line breaks

Use a single newline to separate block-level content like headings, lists, images,
code blocks, and others. The exception is second-level headings, where it should
be two newlines. Second-level headings follow the first-level (or the title) without
any preceding paragraphs or texts. A two line spacing helps visualize the overall
structure of content in a code editor better.
-->
## Markdown 元素 {#markdown-elements}

### 換行  {#line-breaks}

使用單一換行符來隔離塊級內容，例如標題、列表、圖片、代碼塊以及其他元素。
這裏的例外是二級標題，必須有兩個換行符。
二級標題緊隨一級標題（或標題），中間沒有段落或文字。

兩行的留白有助於在代碼編輯器中查看整個內容的結構組織。

<!--
Manually wrap paragraphs in the Markdown source when appropriate. Since the git
tool and the GitHub website generate file diffs on a line-by-line basis,
manually wrapping long lines helps the reviewers to easily find out the changes
made in a PR and provide feedback. It also helps the downstream localization
teams where people track the upstream changes on a per-line basis.  Line
wrapping can happen at the end of a sentence or a punctuation character, for
example. One exception to this is that a Markdown link or a shortcode is
expected to be in a single line.
-->
適當時在 Markdown 文檔中手動換行。由於 git 工具和 GitHub
網站是逐行生成文件差異的，手動換行可以幫助審閱者輕鬆找到 PR 中所做的更改並提供反饋。
它還可以幫助下游本地化團隊，使其按行跟蹤上游更改。例如，換行可以發生在句子或標點符號的末尾。
一個例外是 Markdown 鏈接或短代碼應位於一行中。

<!--
### Headings and titles {#headings}

People accessing this documentation may use a screen reader or other assistive technology (AT).
[Screen readers](https://en.wikipedia.org/wiki/Screen_reader) are linear output devices,
they output items on a page one at a time. If there is a lot of content on a page, you can
use headings to give the page an internal structure. A good page structure helps all readers
to easily navigate the page or filter topics of interest.
-->
### 大標題和小標題  {#headings}

訪問文檔的讀者可能會使用屏幕抓取程序或者其他輔助技術。
[屏幕抓取器](https://en.wikipedia.org/wiki/Screen_reader)是一種線性輸出設備,
它們每次輸出頁面上的一個條目。
如果頁面上內容過多，你可以使用標題來爲頁面組織結構。
頁面的良好結構對所有讀者都有幫助，使得他們更容易瀏覽或者過濾感興趣的內容。

<!--
{{< table caption = "Do and Don't - Headings" >}}
Do | Don't
:--| :-----
Update the title in the front matter of the page or blog post. | Use first level heading, as Hugo automatically converts the title in the front matter of the page into a first-level heading.
Use ordered headings to provide a meaningful high-level outline of your content. | Use headings level 4 through 6, unless it is absolutely necessary. If your content is that detailed, it may need to be broken into separate articles.
Use pound or hash signs (`#`) for non-blog post content. | Use underlines (`---` or `===`) to designate first-level headings.
Use sentence case for headings in the page body. For example, **Extend kubectl with plugins** | Use title case for headings in the page body. For example, **Extend Kubectl With Plugins**
Use title case for the page title in the front matter. For example, `title: Kubernetes API Server Bypass Risks` | Use sentence case for page titles in the front matter. For example, don't use `title: Kubernetes API server bypass risks`
Place relevant links in the body copy. | Include hyperlinks (`<a href=""></a>`) in headings.
Use pound or hash signs (`#`) to indicate headings. | Use **bold** text or other indicators to split paragraphs.
{{< /table >}}
-->
{{< table caption = "標題約定" >}}
可以 | 不可以
:--| :-----
更新頁面或博客在前言部分中的標題。 | 使用一級標題。因爲 Hugo 會自動將頁面前言部分的標題轉化爲一級標題。
使用編號的標題以便內容組織有一個更有意義的結構。| 使用四級到六級標題，除非非常有必要這樣。如果你要編寫的內容有非常多細節，可以嘗試拆分成多個不同頁面。
在非博客內容頁面中使用井號（`#`）| 使用下劃線 `---` 或 `===` 來標記一級標題。
頁面正文中的小標題採用正常語句的大小寫。例如：**Extend kubectl with plugins** | 頁面正文中的小標題採用首字母大寫的大標題式樣。例如：**Extend Kubectl With Plugins**
頭部的頁面標題採用大標題的式樣。例如：`title: Kubernetes API Server Bypass Risks` | 頭部的頁面標題採用正常語句的大小寫。例如不要使用 `title: Kubernetes API server bypass risks`
將相關鏈接放在正文中。| 在標題中包含超鏈接（`<a href=""></a>`）。
使用井號或哈希符號（`#`）表示標題。| 使用**粗體**文本或其他指示符來拆分段落。
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
嘗試不要讓段落超出 6 句話。 | 用空格來縮進第一段。例如，段落前面的三個空格⋅⋅⋅會將段落縮進。
使用三個連字符（`---`）來創建水平線。使用水平線來分隔段落內容。例如，在故事中切換場景或者在上下文中切換主題。 | 使用水平線來裝飾頁面。
{{< /table >}}

<!--
### Links

{{< table caption = "Do and Don't - Links" >}}
Do | Don't
Write hyperlinks that give you context for the content they link to. For example: Certain ports are open on your machines. See <a href="#check-required-ports">Check required ports</a> for more details. | Use ambiguous terms such as “click here”. For example: Certain ports are open on your machines. See <a href="#check-required-ports">here</a> for more details.
Write Markdown-style links: `[link text](URL)`. For example: `[Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions)` and the output is [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions). | Write HTML-style links: `<a href="/media/examples/link-element-example.css" target="_blank">Visit our tutorial!</a>`, or create links that open in new tabs or windows. For example: `[example website](https://example.com){target="_blank"}`
{{< /table >}}
-->
### 鏈接   {#links}

{{< table caption = "鏈接約定" >}}
可以 | 不可以
:--| :-----
插入超級鏈接時給出它們所鏈接到的目標內容的上下文。例如：你的機器上某些端口處於開放狀態。參見<a href="#check-required-ports">檢查所需端口</a>瞭解更詳細信息。| 使用“點擊這裏”等模糊的詞語。例如：你的機器上某些端口處於打開狀態。參見<a href="#check-required-ports">這裏</a>瞭解詳細信息。
編寫 Markdown 風格的鏈接：`[鏈接文本](URL)`。例如：`[Hugo 短代碼](/zh-cn/docs/contribute/style/hugo-shortcodes/#table-captions)`，輸出是 [Hugo 短代碼](/zh-cn/docs/contribute/style/hugo-shortcodes/#table-captions)。 | 編寫 HTML 風格的超級鏈接：`<a href="/media/examples/link-element-example.css" target="_blank">訪問我們的教程！</a>`，或者創建會打開新 Tab 頁籤或新窗口的鏈接。例如：`[網站示例](https://example.com){target="_blank"}`。
{{< /table >}}

<!--
### Lists

Group items in a list that are related to each other and need to appear in a specific
order or to indicate a correlation between multiple items. When a screen reader comes
across a list—whether it is an ordered or unordered list—it will be announced to the
user that there is a group of list items. The user can then use the arrow keys to move
up and down between the various items in the list. Website navigation links can also be
marked up as list items; after all they are nothing but a group of related links.

- End each item in a list with a period if one or more items in the list are complete
  sentences. For the sake of consistency, normally either all items or none should be complete sentences.
-->
### 列表  {#lists}

將一組相互關聯的內容組織到一個列表中，以便表達這些條目彼此之間有先後順序或者某種相互關聯關係。
當屏幕抓取器遇到列表時，無論該列表是否有序，它會告知用戶存在一組枚舉的條目。
用戶可以使用箭頭鍵來上下移動，瀏覽列表中條目。
網站導航鏈接也可以標記成列表條目，因爲說到底他們也是一組相互關聯的鏈接而已。

- 如果列表中一個或者多個條目是完整的句子，則在每個條目末尾添加句號。
  出於一致性考慮，一般要麼所有條目要麼沒有條目是完整句子。

  {{< note >}}
  <!--
  Ordered lists that are part of an incomplete introductory sentence can be in lowercase
  and punctuated as if each item was a part of the introductory sentence.
  -->
  編號列表如果是不完整的介紹性句子的一部分，可以全部用小寫字母，並按照
  每個條目都是句子的一部分來看待和處理。
  {{< /note >}}

<!--
- Use the number one (`1.`) for ordered lists.

- Use (`+`), (`*`), or (`-`) for unordered lists.

- Leave a blank line after each list.

- Indent nested lists with four spaces (for example, ⋅⋅⋅⋅).

- List items may consist of multiple paragraphs. Each subsequent paragraph in a list
  item must be indented by either four spaces or one tab.
-->
- 在編號列表中，使用數字 1（`1.`）。

- 對非排序列表，使用加號（`+`）、星號（`*`）、或者減號（`-`）。

- 在每個列表之後留一個空行。

- 對於嵌套的列表，相對縮進四個空格（例如，⋅⋅⋅⋅）。

- 列表條目可能包含多個段落。每個後續段落都要縮進或者四個空格或者一個製表符。

<!--
### Tables

The semantic purpose of a data table is to present tabular data. Sighted users can
quickly scan the table but a screen reader goes through line by line. A table caption
is used to create a descriptive title for a data table. Assistive technologies (AT)
use the HTML table caption element to identify the table contents to the user within the page structure.

- Add table captions using [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions) for tables.
-->
### 表格  {#tables}

數據表格的語義用途是呈現表格化的數據。
用戶可以快速瀏覽表格，但屏幕抓取器需要逐行地處理數據。
表格標題可以用來給數據表提供一個描述性的標題。
輔助技術使用 HTML 表格標題元素來在頁面結構中辨識表格內容。

- 使用 [Hugo 短代碼](/zh-cn/docs/contribute/style/hugo-shortcodes/#table-captions)爲表格添加標題。

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

本節包含一些建議的最佳實踐，用來開發清晰、明確一致的文檔內容。

### 使用現在時態

{{< table caption = "使用現在時態" >}}
可以 | 不可以
:--| :-----
此命令啓動代理。| 此命令將啓動一個代理。
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
YAML 文件給出副本個數。 | 副本個數是在 YAML 文件中給出的。
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
要創建 ReplicaSet，... | 如果你想要創建 ReplicaSet，...
參看配置文件。 | 請自行查看配置文件。
查看 Pod。| 使用下面的命令，我們將會看到 Pod。
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
### 將讀者稱爲“你”

{{< table caption = "將讀者稱爲“你”" >}}
可以 | 不可以
:--| :-----
你可以通過 ... 創建一個 Deployment。 | 通過...我們將創建一個 Deployment。
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
:--| :-----
Version 1.4 includes ... | In version 1.4, we have added ...
Kubernetes provides a new feature for ... | We provide a new feature ...
This page teaches you how to use pods. | In this page, we are going to learn about pods.
{{< /table >}} 
-->
## 應避免的模式   {#patterns-to-avoid}

### 避免使用“我們”

在句子中使用“我們”會讓人感到困惑，因爲讀者可能不知道這裏的“我們”指的是誰。

{{< table caption = "要避免的模式" >}}
可以 | 不可以
:--| :-----
版本 1.4 包含了 ... | 在 1.4 版本中，我們添加了 ...
Kubernetes 爲 ... 提供了一項新功能。 | 我們提供了一項新功能...
本頁面教你如何使用 Pod。| 在本頁中，我們將會學到如何使用 Pod。
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

要避免對將來作出承諾或暗示。如果你需要討論的是 Alpha 功能特性，
可以將相關文字放在一個單獨的標題下，標識爲 Alpha 版本信息。

此規則的一個例外是對未來版本中計劃移除的已廢棄功能選項的文檔。
此類文檔的例子之一是[已棄用 API 遷移指南](/zh-cn/docs/reference/using-api/deprecation-guide/)。

<!--
### Avoid statements that will soon be out of date

Avoid words like "currently" and "new." A feature that is new today might not be
considered new in a few months.

{{< table caption = "Do and Don't - Avoid statements that will soon be out of date" >}}
Do | Don't
:--| :-----
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
### 避免使用隱含用戶對某技術有一定理解的詞彙

避免使用“只是”、“僅僅”、“簡單”、“很容易地”、“很簡單”這類詞彙。
這些詞並沒有提升文檔的價值。

{{< table caption = "避免無意義詞彙的注意事項" >}}
可以 | 不可以
:--| :-----
在 ... 中包含一個命令 | 只需要在... 中包含一個命令
運行容器 ... | 只需運行該容器...
你可以移除... | 你可以很容易地移除...
這些步驟... | 這些簡單的步驟...
{{< /table >}}

<!--
### EditorConfig file
The Kubernetes project maintains an EditorConfig file that sets common style preferences in text editors
such as VS Code. You can use this file if you want to ensure that your contributions are consistent with
the rest of the project. To view the file, refer to
[`.editorconfig`](https://github.com/kubernetes/website/blob/main/.editorconfig) in the repository root.
-->
### 編輯器配置文件

Kubernetes 項目維護一個 EditorConfig 文件，用於設置文本編輯器（例如 VS Code）中的常見樣式首選項。
如果你想確保你的貢獻與項目的其餘部分樣式保持一致，則可以使用此文件。
要查看該文件，請參閱項目倉庫根目錄的
[`.editorconfig`](https://github.com/kubernetes/website/blob/main/.editorconfig)。

## {{% heading "whatsnext" %}}

<!--
* Learn about [writing a new topic](/docs/contribute/style/write-new-topic/).
* Learn about [using page templates](/docs/contribute/style/page-content-types/).
* Learn about [custom hugo shortcodes](/docs/contribute/style/hugo-shortcodes/).
* Learn about [creating a pull request](/docs/contribute/new-content/open-a-pr/).
-->
* 瞭解[編寫新主題](/zh-cn/docs/contribute/style/write-new-topic/)。
* 瞭解[頁面內容類型](/zh-cn/docs/contribute/style/page-content-types/)。
* 瞭解[定製 Hugo 短代碼](/zh-cn/docs/contribute/style/hugo-shortcodes/)。
* 瞭解[發起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)。
