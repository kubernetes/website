---
title: 撰寫新主題
content_type: task
weight: 70
---
<!--
title: Writing a new topic
content_type: task
weight: 70
-->

<!-- overview -->
<!--
This page shows how to create a new topic for the Kubernetes docs.
-->
本頁面展示如何爲 Kubernetes 文檔庫創建新主題。

## {{% heading "prerequisites" %}}

<!--
Create a fork of the Kubernetes documentation repository as described in
[Open a PR](/docs/contribute/new-content/open-a-pr/).
-->
如[發起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)中所述，創建 Kubernetes 文檔庫的派生副本。

<!-- steps -->

<!--
## Choosing a page type

As you prepare to write a new topic, think about the page type that would fit your content the best:
-->
## 選擇頁面類型

當你準備編寫一個新的主題時，考慮一下最適合你的內容的頁面類型：

<!--
Guidelines for choosing a page type
Type | Description
:--- | :----------
Concept | A concept page explains some aspect of Kubernetes. For example, a concept page might describe the Kubernetes Deployment object and explain the role it plays as an application while it is deployed, scaled, and updated. Typically, concept pages don't include sequences of steps, but instead provide links to tasks or tutorials. For an example of a concept topic, see <a href="/docs/concepts/architecture/nodes/">Nodes</a>.
Task | A task page shows how to do a single thing. The idea is to give readers a sequence of steps that they can actually do as they read the page. A task page can be short or long, provided it stays focused on one area. In a task page, it is OK to blend brief explanations with the steps to be performed, but if you need to provide a lengthy explanation, you should do that in a concept topic. Related task and concept topics should link to each other. For an example of a short task page, see <a href="/docs/tasks/configure-pod-container/configure-volume-storage/">Configure a Pod to Use a Volume for Storage</a>. For an example of a longer task page, see <a href="/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/">Configure Liveness and Readiness Probes</a>
Tutorial | A tutorial page shows how to accomplish a goal that ties together several Kubernetes features. A tutorial might provide several sequences of steps that readers can actually do as they read the page. Or it might provide explanations of related pieces of code. For example, a tutorial could provide a walkthrough of a code sample. A tutorial can include brief explanations of the Kubernetes features that are being tied together, but should link to related concept topics for deep explanations of individual features.
-->

{{< table caption = "選擇頁面類型的說明" >}}
類型 | 描述
:--- | :----------
概念（Concept） | 概念頁面負責解釋 Kubernetes 的某方面。例如，概念頁面可以描述 Kubernetes Deployment 對象，並解釋當部署、擴展和更新時，它作爲應用程序所扮演的角色。一般來說，概念頁面不包括步驟序列，而是提供任務或教程的鏈接。概念主題的示例可參見 <a href="/zh-cn/docs/concepts/architecture/nodes/">節點</a>。
任務（Task） | 任務頁面展示如何完成特定任務。其目的是給讀者提供一系列的步驟，讓他們在閱讀時可以實際執行。任務頁面可長可短，前提是它始終圍繞着某個主題展開。在任務頁面中，可以將簡短的解釋與要執行的步驟混合在一起。如果需要提供較長的解釋，則應在概念主題中進行。相關聯的任務和概念主題應該相互鏈接。一個簡短的任務頁面的實例可參見 <a href="/zh-cn/docs/tasks/configure-pod-container/configure-volume-storage/">配置 Pod 使用卷存儲</a>。一個較長的任務頁面的實例可參見 <a href="/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/">配置活躍性和就緒性探針</a>。
教程（Tutorial） | 教程頁面展示如何實現某個目標，該目標將若干 Kubernetes 功能特性聯繫在一起。教程可能提供一些步驟序列，讀者可以在閱讀頁面時實際執行這些步驟。或者它可以提供相關代碼片段的解釋。例如，教程可以提供代碼示例的講解。教程可以包括對 Kubernetes 幾個關聯特性的簡要解釋，但有關更深入的特性解釋應該鏈接到相關概念主題。 
{{< /table >}}

<!--
### Creating a new page
Use a [content type](/docs/contribute/style/page-content-types/) for each new page
that you write. The docs site provides templates or
[Hugo archetypes](https://gohugo.io/content-management/archetypes/) to create
new content pages. To create a new type of page, run `hugo new` with the path to the file
you want to create. For example:
-->
### 創建一個新頁面    {#creating-a-new-page}

爲每個新頁面選擇其[內容類型](/zh-cn/docs/contribute/style/page-content-types/)。
文檔站提供了模板或 [Hugo Archetypes](https://gohugo.io/content-management/archetypes/) 來創建新的內容頁面。
要創建新類型的頁面，請使用要創建的文件的路徑，運行 `hugo new` 命令。例如：

```
hugo new docs/concepts/my-first-concept.md
```

<!--
## Choosing a title and filename

Choose a title that has the keywords you want search engines to find.
Create a filename that uses the words in your title separated by hyphens.
For example, the topic with title
[Using an HTTP Proxy to Access the Kubernetes API](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
has filename `http-proxy-access-api.md`. You don't need to put
"kubernetes" in the filename, because "kubernetes" is already in the
URL for the topic, for example:
-->
## 選擇標題和文件名

選擇一個標題，確保其中包含希望搜索引擎發現的關鍵字。
確定文件名時請使用標題中的單詞，由連字符分隔。
例如，標題爲[使用 HTTP 代理訪問 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/http-proxy-access-api/)
的主題的文件名爲 `http-proxy-access-api.md`。
你不需要在文件名中加上 "kubernetes"，因爲 "kubernetes" 已經在主題的 URL 中了，
例如：

       /docs/tasks/extend-kubernetes/http-proxy-access-api/

<!--
## Adding the topic title to the front matter

In your topic, put a `title` field in the
[front matter](https://gohugo.io/content-management/front-matter/).
The front matter is the YAML block that is between the
triple-dashed lines at the top of the page. Here's an example:

```
title: Using an HTTP Proxy to Access the Kubernetes API
```
-->
## 在頁面前言中添加主題標題

在你的主題中，在[前言（front-matter）](https://gohugo.io/content-management/front-matter/)
中設置一個 `title` 字段。
前言是位於頁面頂部三條虛線之間的 YAML 塊。下面是一個例子：

```
---
title: 使用 HTTP 代理訪問 Kubernetes API
---
```

<!--
## Choosing a directory

Depending on your page type, put your new file in a subdirectory of one of these:
-->
## 選擇目錄

根據頁面類型，將新文件放入其中一個子目錄中：

* /content/en/docs/tasks/
* /content/en/docs/tutorials/
* /content/en/docs/concepts/

<!--
You can put your file in an existing subdirectory, or you can create a new
subdirectory.
-->
你可以將文件放在現有的子目錄中，也可以創建一個新的子目錄。

<!--
## Placing your topic in the table of contents

The table of contents is built dynamically using the directory structure of the
documentation source. The top-level directories under `/content/en/docs/` create
top-level navigation, and subdirectories each have entries in the table of
contents.
-->
## 將主題放在目錄中

目錄是使用文檔源的目錄結構動態構建的。
`/content/en/docs/` 下的頂層目錄用於創建頂層導航條目，
這些目錄和它們的子目錄在網站目錄中都有對應條目。

<!--
Each subdirectory has a file `_index.md`, which represents the "home" page for
a given subdirectory's content. The `_index.md` does not need a template. It
can contain overview content about the topics in the subdirectory.
-->
每個子目錄都有一個 `_index.md` 文件，它表示的是該子目錄內容的主頁面。
`_index.md` 文件不需要模板。它可以包含各子目錄中主題的概述內容。

<!--
Other files in a directory are sorted alphabetically by default. This is almost
never the best order. To control the relative sorting of topics in a
subdirectory, set the `weight:` front-matter key to an integer. Typically, we
use multiples of 10, to account for adding topics later. For instance, a topic
with weight `10` will come before one with weight `20`.
-->
默認情況下，目錄中的其他文件按字母順序排序。這一般不是最好的順序。
要控制子目錄中主題的相對排序，請將頁面頭部的鍵 `weight:` 設置爲整數值。
通常我們使用 10 的倍數，添加後續主題時 `weight` 值遞增。
例如，`weight` 爲 `10` 的主題將位於 `weight` 爲 `20` 的主題之前。

<!--
## Embedding code in your topic

If you want to include some code in your topic, you can embed the code in your
file directly using the markdown code block syntax. This is recommended for the
following cases (not an exhaustive list):
-->
## 在主題中嵌入代碼

如果你想在主題中嵌入一些代碼，可以直接使用 Markdown 代碼塊語法將代碼嵌入到文件中。
建議在以下場合（並非詳盡列表）使用嵌入代碼：

<!--
- The code shows the output from a command such as
  `kubectl get deploy mydeployment -o json | jq '.status'`.
- The code is not generic enough for users to try out. As an example, you can
  embed the YAML
  file for creating a Pod which depends on a specific
  [FlexVolume](/docs/concepts/storage/volumes/#flexvolume) implementation.
- The code is an incomplete example because its purpose is to highlight a
  portion of a larger file. For example, when describing ways to
  customize a [RoleBinding](/docs/reference/access-authn-authz/rbac/#role-binding-examples),
  you can provide a short snippet directly in your topic file.
- The code is not meant for users to try out due to other reasons. For example,
  when describing how a new attribute should be added to a resource using the
  `kubectl edit` command, you can provide a short example that includes only
  the attribute to add.
-->

- 代碼顯示來自命令的輸出，例如 `kubectl get deploy mydeployment -o json | jq '.status'`。
- 代碼不夠通用，用戶無法驗證。例如，你可以嵌入 YAML 文件來創建一個依賴於特定
  [FlexVolume](/zh-cn/docs/concepts/storage/volumes/#flexvolume) 實現的 Pod。
- 該代碼是一個不完整的示例，因爲其目的是突出展現某個大文件中的部分內容。
  例如，在描述
  [RoleBinding](/zh-cn/docs/reference/access-authn-authz/rbac/#role-binding-examples)
  的方法時，你可以在主題文件中直接提供一個短的代碼段。
- 由於某些其他原因，該代碼不適合用戶驗證。
  例如，當使用 `kubectl edit` 命令描述如何將新屬性添加到資源時，
  你可以提供一個僅包含要添加的屬性的簡短示例。

<!--
## Including code from another file

Another way to include code in your topic is to create a new, complete sample
file (or group of sample files) and then reference the sample from your topic.
Use this method to include sample YAML files when the sample is generic and
reusable, and you want the reader to try it out themselves.
-->
## 引用來自其他文件的代碼

在主題中引用代碼的另一種方法是創建一個新的、完整的示例文件（或文件組），
然後在主題中引用這些示例。當示例是通用的和可重用的，並且你希望讀者自己驗證時，
使用此方法引用示例 YAML 文件。

<!--
When adding a new standalone sample file, such as a YAML file, place the code in
one of the `<LANG>/examples/` subdirectories where `<LANG>` is the language for
the topic. In your topic file, use the `code_sample` shortcode:
-->
添加新的獨立示例文件（如 YAML 文件）時，將代碼放在 `<LANG>/examples/` 的某個子目錄中，
其中 `<LANG>` 是該主題的語言。在主題文件中使用 `code_sample` 短代碼：

```none
{{%/* code_sample file="<RELPATH>/my-example-yaml>" */%}}
```

<!--
where `<RELPATH>` is the path to the file to include, relative to the
`examples` directory. The following Hugo shortcode references a YAML
file located at `/content/en/examples/pods/storage/gce-volume.yaml`.
-->

`<RELPATH>` 是要引用的文件的路徑，相對於 `examples` 目錄。以下 Hugo
短代碼引用了位於 `/content/en/examples/pods/storage/gce-volume.yaml` 的 YAML
文件。

```none
{{%/* code_sample file="pods/storage/gce-volume.yaml" */%}}
```

<!--
## Showing how to create an API object from a configuration file

If you need to demonstrate how to create an API object based on a
configuration file, place the configuration file in one of the subdirectories
under `<LANG>/examples`.

In your topic, show this command:
-->
## 顯示如何從配置文件創建 API 對象

如果需要演示如何基於配置文件創建 API 對象，請將配置文件放在 `<LANG>/examples`
下的某個子目錄中。

在主題中展示以下命令：

```
kubectl create -f https://k8s.io/examples/pods/storage/gce-volume.yaml
```

{{< note >}}
<!--
When adding new YAML files to the `<LANG>/examples` directory, make
sure the file is also included into the `<LANG>/examples_test.go` file. The
Travis CI for the Website automatically runs this test case when PRs are
submitted to ensure all examples pass the tests.
-->
將新的 YAML 文件添加到 `<LANG>/examples` 目錄時，請確保該文件也在
`<LANG>/examples_test.go` 文件中被引用。
當提交拉取請求時，網站的 Travis CI 會自動運行此測試用例，以確保所有示例都通過測試。
{{< /note >}}

<!--
For an example of a topic that uses this technique, see
[Running a Single-Instance Stateful Application](/docs/tasks/run-application/run-single-instance-stateful-application/).
-->
有關使用此技術的主題的示例，
請參見[運行單實例有狀態的應用](/zh-cn/docs/tasks/run-application/run-single-instance-stateful-application/)。

<!--
## Adding images to a topic

Put image files in the `/images` directory. The preferred image format is SVG.
-->
## 向主題添加圖片

將圖片文件放入 `/images` 目錄。首選的圖片格式是 SVG。

## {{% heading "whatsnext" %}}

<!--
* Learn about [using page content types](/docs/contribute/style/page-content-types/).
* Learn about [creating a pull request](/docs/contribute/new-content/open-a-pr/).
-->
* 瞭解[使用頁面內容類型](/zh-cn/docs/contribute/style/page-content-types/)。
* 瞭解[創建 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)。
