---
title: 撰写新主题
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
本页面展示如何为 Kubernetes 文档库创建新主题。

## {{% heading "prerequisites" %}}

<!--
Create a fork of the Kubernetes documentation repository as described in
[Open a PR](/docs/contribute/new-content/open-a-pr/).
-->
如[发起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)中所述，创建 Kubernetes 文档库的派生副本。

<!-- steps -->

<!--
## Choosing a page type

As you prepare to write a new topic, think about the page type that would fit your content the best:
-->
## 选择页面类型

当你准备编写一个新的主题时，考虑一下最适合你的内容的页面类型：

<!--
Guidelines for choosing a page type
Type | Description
:--- | :----------
Concept | A concept page explains some aspect of Kubernetes. For example, a concept page might describe the Kubernetes Deployment object and explain the role it plays as an application while it is deployed, scaled, and updated. Typically, concept pages don't include sequences of steps, but instead provide links to tasks or tutorials. For an example of a concept topic, see <a href="/docs/concepts/architecture/nodes/">Nodes</a>.
Task | A task page shows how to do a single thing. The idea is to give readers a sequence of steps that they can actually do as they read the page. A task page can be short or long, provided it stays focused on one area. In a task page, it is OK to blend brief explanations with the steps to be performed, but if you need to provide a lengthy explanation, you should do that in a concept topic. Related task and concept topics should link to each other. For an example of a short task page, see <a href="/docs/tasks/configure-pod-container/configure-volume-storage/">Configure a Pod to Use a Volume for Storage</a>. For an example of a longer task page, see <a href="/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/">Configure Liveness and Readiness Probes</a>
Tutorial | A tutorial page shows how to accomplish a goal that ties together several Kubernetes features. A tutorial might provide several sequences of steps that readers can actually do as they read the page. Or it might provide explanations of related pieces of code. For example, a tutorial could provide a walkthrough of a code sample. A tutorial can include brief explanations of the Kubernetes features that are being tied together, but should link to related concept topics for deep explanations of individual features.
-->

{{< table caption = "选择页面类型的说明" >}}
类型 | 描述
:--- | :----------
概念（Concept） | 概念页面负责解释 Kubernetes 的某方面。例如，概念页面可以描述 Kubernetes Deployment 对象，并解释当部署、扩展和更新时，它作为应用程序所扮演的角色。一般来说，概念页面不包括步骤序列，而是提供任务或教程的链接。概念主题的示例可参见 <a href="/zh-cn/docs/concepts/architecture/nodes/">节点</a>。
任务（Task） | 任务页面展示如何完成特定任务。其目的是给读者提供一系列的步骤，让他们在阅读时可以实际执行。任务页面可长可短，前提是它始终围绕着某个主题展开。在任务页面中，可以将简短的解释与要执行的步骤混合在一起。如果需要提供较长的解释，则应在概念主题中进行。相关联的任务和概念主题应该相互链接。一个简短的任务页面的实例可参见 <a href="/zh-cn/docs/tasks/configure-pod-container/configure-volume-storage/">配置 Pod 使用卷存储</a>。一个较长的任务页面的实例可参见 <a href="/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/">配置活跃性和就绪性探针</a>。
教程（Tutorial） | 教程页面展示如何实现某个目标，该目标将若干 Kubernetes 功能特性联系在一起。教程可能提供一些步骤序列，读者可以在阅读页面时实际执行这些步骤。或者它可以提供相关代码片段的解释。例如，教程可以提供代码示例的讲解。教程可以包括对 Kubernetes 几个关联特性的简要解释，但有关更深入的特性解释应该链接到相关概念主题。 
{{< /table >}}

<!--
### Creating a new page
Use a [content type](/docs/contribute/style/page-content-types/) for each new page
that you write. The docs site provides templates or
[Hugo archetypes](https://gohugo.io/content-management/archetypes/) to create
new content pages. To create a new type of page, run `hugo new` with the path to the file
you want to create. For example:
-->
### 创建一个新页面    {#creating-a-new-page}

为每个新页面选择其[内容类型](/zh-cn/docs/contribute/style/page-content-types/)。
文档站提供了模板或 [Hugo Archetypes](https://gohugo.io/content-management/archetypes/) 来创建新的内容页面。
要创建新类型的页面，请使用要创建的文件的路径，运行 `hugo new` 命令。例如：

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
## 选择标题和文件名

选择一个标题，确保其中包含希望搜索引擎发现的关键字。
确定文件名时请使用标题中的单词，由连字符分隔。
例如，标题为[使用 HTTP 代理访问 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/http-proxy-access-api/)
的主题的文件名为 `http-proxy-access-api.md`。
你不需要在文件名中加上 "kubernetes"，因为 "kubernetes" 已经在主题的 URL 中了，
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
## 在页面前言中添加主题标题

在你的主题中，在[前言（front-matter）](https://gohugo.io/content-management/front-matter/)
中设置一个 `title` 字段。
前言是位于页面顶部三条虚线之间的 YAML 块。下面是一个例子：

```
---
title: 使用 HTTP 代理访问 Kubernetes API
---
```

<!--
## Choosing a directory

Depending on your page type, put your new file in a subdirectory of one of these:
-->
## 选择目录

根据页面类型，将新文件放入其中一个子目录中：

* /content/en/docs/tasks/
* /content/en/docs/tutorials/
* /content/en/docs/concepts/

<!--
You can put your file in an existing subdirectory, or you can create a new
subdirectory.
-->
你可以将文件放在现有的子目录中，也可以创建一个新的子目录。

<!--
## Placing your topic in the table of contents

The table of contents is built dynamically using the directory structure of the
documentation source. The top-level directories under `/content/en/docs/` create
top-level navigation, and subdirectories each have entries in the table of
contents.
-->
## 将主题放在目录中

目录是使用文档源的目录结构动态构建的。
`/content/en/docs/` 下的顶层目录用于创建顶层导航条目，
这些目录和它们的子目录在网站目录中都有对应条目。

<!--
Each subdirectory has a file `_index.md`, which represents the "home" page for
a given subdirectory's content. The `_index.md` does not need a template. It
can contain overview content about the topics in the subdirectory.
-->
每个子目录都有一个 `_index.md` 文件，它表示的是该子目录内容的主页面。
`_index.md` 文件不需要模板。它可以包含各子目录中主题的概述内容。

<!--
Other files in a directory are sorted alphabetically by default. This is almost
never the best order. To control the relative sorting of topics in a
subdirectory, set the `weight:` front-matter key to an integer. Typically, we
use multiples of 10, to account for adding topics later. For instance, a topic
with weight `10` will come before one with weight `20`.
-->
默认情况下，目录中的其他文件按字母顺序排序。这一般不是最好的顺序。
要控制子目录中主题的相对排序，请将页面头部的键 `weight:` 设置为整数值。
通常我们使用 10 的倍数，添加后续主题时 `weight` 值递增。
例如，`weight` 为 `10` 的主题将位于 `weight` 为 `20` 的主题之前。

<!--
## Embedding code in your topic

If you want to include some code in your topic, you can embed the code in your
file directly using the markdown code block syntax. This is recommended for the
following cases (not an exhaustive list):
-->
## 在主题中嵌入代码

如果你想在主题中嵌入一些代码，可以直接使用 Markdown 代码块语法将代码嵌入到文件中。
建议在以下场合（并非详尽列表）使用嵌入代码：

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

- 代码显示来自命令的输出，例如 `kubectl get deploy mydeployment -o json | jq '.status'`。
- 代码不够通用，用户无法验证。例如，你可以嵌入 YAML 文件来创建一个依赖于特定
  [FlexVolume](/zh-cn/docs/concepts/storage/volumes/#flexvolume) 实现的 Pod。
- 该代码是一个不完整的示例，因为其目的是突出展现某个大文件中的部分内容。
  例如，在描述
  [RoleBinding](/zh-cn/docs/reference/access-authn-authz/rbac/#role-binding-examples)
  的方法时，你可以在主题文件中直接提供一个短的代码段。
- 由于某些其他原因，该代码不适合用户验证。
  例如，当使用 `kubectl edit` 命令描述如何将新属性添加到资源时，
  你可以提供一个仅包含要添加的属性的简短示例。

<!--
## Including code from another file

Another way to include code in your topic is to create a new, complete sample
file (or group of sample files) and then reference the sample from your topic.
Use this method to include sample YAML files when the sample is generic and
reusable, and you want the reader to try it out themselves.
-->
## 引用来自其他文件的代码

在主题中引用代码的另一种方法是创建一个新的、完整的示例文件（或文件组），
然后在主题中引用这些示例。当示例是通用的和可重用的，并且你希望读者自己验证时，
使用此方法引用示例 YAML 文件。

<!--
When adding a new standalone sample file, such as a YAML file, place the code in
one of the `<LANG>/examples/` subdirectories where `<LANG>` is the language for
the topic. In your topic file, use the `code_sample` shortcode:
-->
添加新的独立示例文件（如 YAML 文件）时，将代码放在 `<LANG>/examples/` 的某个子目录中，
其中 `<LANG>` 是该主题的语言。在主题文件中使用 `code_sample` 短代码：

```none
{{%/* code_sample file="<RELPATH>/my-example-yaml>" */%}}
```

<!--
where `<RELPATH>` is the path to the file to include, relative to the
`examples` directory. The following Hugo shortcode references a YAML
file located at `/content/en/examples/pods/storage/gce-volume.yaml`.
-->

`<RELPATH>` 是要引用的文件的路径，相对于 `examples` 目录。以下 Hugo
短代码引用了位于 `/content/en/examples/pods/storage/gce-volume.yaml` 的 YAML
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
## 显示如何从配置文件创建 API 对象

如果需要演示如何基于配置文件创建 API 对象，请将配置文件放在 `<LANG>/examples`
下的某个子目录中。

在主题中展示以下命令：

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
将新的 YAML 文件添加到 `<LANG>/examples` 目录时，请确保该文件也在
`<LANG>/examples_test.go` 文件中被引用。
当提交拉取请求时，网站的 Travis CI 会自动运行此测试用例，以确保所有示例都通过测试。
{{< /note >}}

<!--
For an example of a topic that uses this technique, see
[Running a Single-Instance Stateful Application](/docs/tasks/run-application/run-single-instance-stateful-application/).
-->
有关使用此技术的主题的示例，
请参见[运行单实例有状态的应用](/zh-cn/docs/tasks/run-application/run-single-instance-stateful-application/)。

<!--
## Adding images to a topic

Put image files in the `/images` directory. The preferred image format is SVG.
-->
## 向主题添加图片

将图片文件放入 `/images` 目录。首选的图片格式是 SVG。

## {{% heading "whatsnext" %}}

<!--
* Learn about [using page content types](/docs/contribute/style/page-content-types/).
* Learn about [creating a pull request](/docs/contribute/new-content/open-a-pr/).
-->
* 了解[使用页面内容类型](/zh-cn/docs/contribute/style/page-content-types/)。
* 了解[创建 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)。
