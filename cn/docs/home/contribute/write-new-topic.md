---
cn-approvers:
- tianshapjq
title: 编写一个新的主题
---
<!--
---
title: Writing a New Topic
---
-->

{% capture overview %}
<!--
This page shows how to create a new topic for the Kubernetes docs.
-->
本页面展示如何为 Kubernetes 文档创建一个新的主题。
{% endcapture %}

{% capture prerequisites %}
<!--
Create a fork of the Kubernetes documentation repository as described in
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).
-->
按照 [创建一个文档 Pull Request](/docs/home/contribute/create-pull-request/) 中的方法来创建一个 Kubernetes 文档库的分支。
{% endcapture %}

{% capture steps %}

<!--
## Choosing a page type
-->
## 选择一个页面类型

<!--
As you prepare to write a new topic, think about which of these page types
is the best fit for your content:
-->
在您开始编写新主题之前，先思考以下哪个页面类型最适合您的内容：

<table>

  <tr>
<!--
    <td>Task</td>
    <td>A task page shows how to do a single thing. The idea is to give readers a sequence of steps that they can actually do as they read the page. A task page can be short or long, provided it stays focused on one area. In a task page, it is OK to blend brief explanations with the steps to be performed, but if you need to provide a lengthy explanation, you should do that in a concept topic. Related task and concept topics should link to each other. For an example of a short task page, see <a href="/docs/tasks/configure-pod-container/configure-volume-storage/">Configure a Pod to Use a Volume for Storage</a>. For an example of a longer task page, see <a href="/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/">Configure Liveness and Readiness Probes</a></td>
-->
    <td>任务</td>    <td>任务页面展示如何做一件事情。中心思想是当读者在阅读页面时，能够知道他们能够做的一系列步骤。任务页面长度没有限制，只需要专注于一个领域。在任务页面中，可以将概要说明和详细步骤混合在一起，但是如果您是提供一个冗长的说明，您需要在概念主题中做这个事情。相关的任务和概念需要相互链接。短任务页面示例，参见 <a href="/docs/tasks/configure-pod-container/configure-volume-storage/">配置 Pod 使用卷作为存储</a>。长任务页面示例，参见 <a href="/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/">配置 Liveness 和 Readiness 探针</a></td>
  </tr>

  <tr>
<!--
    <td>Tutorial</td>
    <td>A tutorial page shows how to accomplish a goal that ties together several Kubernetes features. A tutorial might provide several sequences of steps that readers can actually do as they read the page. Or it might provide explanations of related pieces of code. For example, a tutorial could provide a walkthrough of a code sample. A tutorial can include brief explanations of the Kubernetes features that are being tied togeter, but should link to related concept topics for deep explanations of individual features.</td>
-->
    <td>教程</td>
    <td>教程页面展示了如何完成将多个 Kubernetes 功能连接在一起的目标。教程可能会提供读者在阅读页面时可以实际执行的几个步骤序列， 或者可能提供相关代码段的解释。例如，教程可以提供代码示例的演练，教程可以把 Kubernetes 的相关特性结合起来做一个简要说明，但每个特性应链接到相关的概念主题，以便对特性做更深入的解释。</td>
  </tr>

  <tr>
<!--
    <td>Concept</td>
    <td>A concept page explains some aspect of Kubernetes. For example, a concept page might describe the Kubernetes Deployment object and explain the role it plays as an application is deployed, scaled, and updated. Typically, concept pages don't include sequences of steps, but instead provide links to tasks or tutorials. For an example of a concept topic, see <a href="/docs/concepts/architecture/nodes/">Nodes</a>.</td>
-->
    <td>概念</td>
    <td>概念页面解释了 Kubernetes 的一些概念。例如，概念页面可能会描述 Kubernetes Deployment 对象，并解释它在部署，伸缩和更新应用程序时扮演的角色。 通常，概念页面不包括步骤序列，而是提供指向任务或教程的链接。概念的示例，参见 <a href="/docs/concepts/architecture/nodes/">Nodes</a>。</td>
  </tr>

</table>

<!--
Each page type has a
[template](/docs/home/contribute/page-templates/)
that you can use as you write your topic.
Using templates helps ensure consistency among topics of a given type.
-->
当您编写主题时，每个页面类型都有一个 [模板](/docs/home/contribute/page-templates/) 可供使用。使用模板有助于确保给定类型主题之间的一致性。

<!--
## Choosing a title and filename
-->
## 选择一个标题和文件名

<!--
Choose a title that has the keywords you want search engines to find.
Create a filename that uses the words in your title separated by hyphens.
For example, the topic with title
[Using an HTTP Proxy to Access the Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api/)
has filename `http-proxy-access-api.md`. You don't need to put
"kubernetes" in the filename, because "kubernetes" is already in the
URL for the topic, for example:
-->
选择一个标题，其中包含您希望搜索引擎找到的关键字。
创建一个文件名，使用由连字符分隔的标题中的单词。例如，标题为 [使用 HTTP 代理来访问 Kubernetes API （Using an HTTP Proxy to Access the Kubernetes API）](/docs/tasks/access-kubernetes-api/http-proxy-access-api/) 可以使用 `http-proxy-access-api.md` 作为文件名。您不需要在文件名中增加 "kubernetes"，因为 "kubernetes" 已经存在主题的 URL 中，例如：

       http://kubernetes.io/docs/tasks/access-kubernetes-api/http-proxy-access-api/

<!--
## Adding the topic title to the front matter
-->
## 将主题的标题添加到 front matter

<!--
In your topic, put a `title` field in the
[front matter](https://jekyllrb.com/docs/frontmatter/).
The front matter is the YAML block that is between the
triple-dashed lines at the top of the page. Here's an example:
-->
在您的主题中，将 `title` 字段添加到 [front matter](https://jekyllrb.com/docs/frontmatter/)。front matter 是在页面顶部的三条虚线形成的 YAML 块。以下是一个示例：

    ---
    title: Using an HTTP Proxy to Access the Kubernetes API
    ---

<!--
## Choosing a directory
-->
## 选择一个目录

<!--
Depending on your page type, put your new file in a subdirectory of one of these:
-->
根据您的页面类型，将您创建的文件放到以下其中一个目录的子目录中：

* /docs/tasks/
* /docs/tutorials/
* /docs/concepts/

<!--
You can put your file in an existing subdirectory, or you can create a new
subdirectory.
-->
您可以将文件放到一个已存在的子目录，也可以创建一个新的子目录。

<!--
## Creating an entry in the table of contents
-->
## 在内容表格中添加一个入口

<!--
Depending page type, create an entry in one of these files:
-->
根据页面类型，在以下其中一个文件中创建一个入口：

* /_data/tasks.yaml
* /_data/tutorials.yaml
* /_data/concepts.yaml

<!--
Here's an example of an entry in /_data/tasks.yaml:
-->
以下是在 /_data/tasks.yaml 中的一个入口示例：

    - docs/tasks/configure-pod-container/configure-volume-storage.md

<!--
## Including code from another file
-->
## 引用其它文件的代码

<!--
To include a code file in your topic, place the code file in the Kubernetes
documentation repository, preferably in the same directory as your topic
file. In your topic file, use the `include` tag:
-->
如果想要在您的主题中引用一个代码文件，首先将代码文件放到 Kubernetes 文档库中，最好和您的主题文件同一目录。然后在您的主题文件中，使用 `include` 标签：

<pre>&#123;% include code.html language="&lt;LEXERVALUE&gt;" file="&lt;RELATIVEPATH&gt;" ghlink="/&lt;PATHFROMROOT&gt;" %&#125;</pre>

<!--
where:
-->
其中：

<!--
* `<LEXERVALUE>` is the language in which the file was written. This must be
[a value supported by Rouge](https://github.com/jneen/rouge/wiki/list-of-supported-languages-and-lexers).
* `<RELATIVEPATH>` is the path to the file you're including, relative to the current file, for example, `local-volume.yaml`.
* `<PATHFROMROOT>` is the path to the file relative to root, for example, `docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/local-volumes.yaml`.
-->
* `<LEXERVALUE>` 指代码文件使用的语言。必须是
[Rouge 支持的类型](https://github.com/jneen/rouge/wiki/list-of-supported-languages-and-lexers).
* `<RELATIVEPATH>` 指引入文件的路径，使用与当前文件的相对路径，例如 `local-volume.yaml`。
* `<PATHFROMROOT>` 指文件相对于 root 的路径，例如，`docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/local-volumes.yaml`.

<!--
Here's an example of using the `include` tag:
-->
以下是使用 `include` 标签的示例：

<pre>&#123;% include code.html language="yaml" file="gce-volume.yaml" ghlink="/docs/tutorials/stateful-application/gce-volume.yaml" %&#125;</pre>

<!--
## Showing how to create an API object from a configuration file
-->
## 展示如何通过一个配置文件创建一个 API 对象

<!--
If you need to show the reader how to create an API object based on a
configuration file, place the configuration file in the Kubernetes documentation
repository, preferably in the same directory as your topic file.
-->
如果您想要向读者展示如何基于一个配置文件来创建一个 API 对象，需要把配置文件放到 Kubernetes 文档库中，最好和您的主题文件同一目录。

<!--
In your topic, show this command:
-->
然后在您的主题中，使用如下命令：

    kubectl create -f https://k8s.io/<PATHFROMROOT>

<!--
where `<PATHFROMROOT>` is the path to the configuration file relative to root,
for example, `docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/local-volumes.yaml`.
-->
其中 `<PATHFROMROOT>` 是对于 root 的相对路径，例如，`docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/local-volumes.yaml`。

<!--
Here's an example of a command that creates an API object from a configuration file:
-->
以下是一个通过配置文件创建一个 API 对象的命令示例：

    kubectl create -f https://k8s.io/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/local-volumes.yaml

<!--
For an example of a topic that uses this technique, see
[Running a Single-Instance Stateful Application](/docs/tutorials/stateful-application/run-stateful-application/).
-->
作为一个使用该技术的例子，请见 [Running a Single-Instance Stateful Application](/docs/tutorials/stateful-application/run-stateful-application/)

<!--
## Adding images to a topic
-->
## 在主题中添加图片

<!--
Put image files in the `/images` directory. The preferred
image format is SVG.
-->
把图片文件放到 `/images` 目录，文件最好是 SVG 格式。

{% endcapture %}

{% capture whatsnext %}
<!--
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/).
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
-->
* 学习 [使用页面模板](/docs/home/contribute/page-templates/)。
* 学习 [展示您对文档的修改](/docs/home/contribute/stage-documentation-changes/)。
* 学习 [创建一个 pull request](/docs/home/contribute/create-pull-request/)。
{% endcapture %}

{% include templates/task.md %}
