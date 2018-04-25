---
title: 使用页面模板
cn-approvers:
- chentao1596
---
<!--
---
title: Using Page Templates
---
-->

<!--<html>
<body>-->

<!--
<p>These page templates are available for writers who would like to contribute new topics to the Kubernetes docs:</p>
-->
<p>对于想要在下面这些 Kubernetes 文档中提交新主题的贡献者，可以使用下面几种页面模板：</p>

<!--
<ul>
    <li><a href="#task_template">Task</a></li>
    <li><a href="#tutorial_template">Tutorial</a></li>
    <li><a href="#concept_template">Concept</a></li>
</ul>
-->
<ul>
    <li><a href="#task_template">任务</a></li>
    <li><a href="#tutorial_template">指南</a></li>
    <li><a href="#concept_template">概念</a></li>
</ul>

<!--
<p>The page templates are in the <a href="https://git.k8s.io/kubernetes.github.io/_includes/templates" target="_blank">_includes/templates</a> directory of the <a href="https://github.com/kubernetes/kubernetes.github.io">kubernetes.github.io</a> repository.
-->
<p>页面模板在 <a href="https://github.com/kubernetes/kubernetes.github.io">kubernetes.github.io</a> 仓库的 <a href="https://git.k8s.io/kubernetes.github.io/_includes/templates" target="_blank">_includes/templates</a> 目录下。

<!--
<h2 id="task_template">Task template</h2>
-->
<h2 id="task_template">任务模板</h2>

<!--
<p>A task page shows how to do a single thing, typically by giving a short
sequence of steps. Task pages have minimal explanation, but often provide links
to conceptual topics that provide related background and knowledge.</p>
-->
<p>任务页面通常是通过给出一个简短的步骤序列展示如何做一件事情。任务页面进行解释的内容很少，但通常提供指向概念主题的链接，这些概念主题提供了相关的背景和知识。</p>

<!--
<p>To write a new task page, create a Markdown file in a subdirectory of the
/docs/tasks directory. In your Markdown file, provide values for these
variables:</p>
-->
<p>想要写一个新的任务页面，请在 /docs/tasks 的子目录下创建一个 Markdown 文件。在您的 Markdown 文件中，为如下变量提供相应的值：</p>

<!--
<ul>
    <li>overview - required</li>
    <li>prerequisites - required</li>
    <li>steps - required</li>
    <li>discussion - optional</li>
    <li>whatsnext - optional</li>
</ul>
-->
<ul>
    <li>overview - 必选</li>
    <li>prerequisites - 必选</li>
    <li>steps - 必选</li>
    <li>discussion - 可选</li>
    <li>whatsnext - 可选</li>
</ul>

<!--
<p>Then include templates/task.md like this:</p>
-->
<p>然后像下面这样引入 templates/task.md：</p>

{% raw %}<pre>...
{% include templates/task.md %}</pre>{% endraw %}

<!--
<p>In the <code>steps</code> section, use <code>##</code> to start with a level-two heading. For subheadings,
use <code>###</code> and <code>####</code> as needed. Similarly, if you choose to have a <code>discussion</code> section,
start the section with a level-two heading.</p>
-->
<p>在 <code>steps</code> 部分，使用 <code>##</code> 开始一个二级标题。对于子标题，根据需要使用 <code>###</code> 和 <code>####</code>。类似地，如果您的页面想有一个 <code>讨论</code> 章节，也请使用一个二级标题开始。</p>

<!--
<p>Here's an example of a Markdown file that uses the task template:</p>
-->
<p>下面是一个使用任务模板的 Markdonw 文件示例：</p>

<!--
{% raw %}
<pre>---
title: Configuring This Thing
---

{% capture overview %}
This page shows how to ...
{% endcapture %}

{% capture prerequisites %}
* Do this.
* Do this too.
{% endcapture %}

{% capture steps %}
## Doing ...

1. Do this.
1. Do this next. Possibly read this [related explanation](...).
{% endcapture %}

{% capture discussion %}
## Understanding ...

Here's an interesting thing to know about the steps you just did.
{% endcapture %}

{% capture whatsnext %}
* Learn more about [this](...).
* See this [related task](...).
{% endcapture %}

{% include templates/task.md %}</pre>
{% endraw %}
-->
{% raw %}
<pre>---
title: 配置这件事情
---

{% capture overview %}
本页展示怎么样 ...
{% endcapture %}

{% capture prerequisites %}
* 执行此操作。
* 再执行此操作。
{% endcapture %}

{% capture steps %}
## 做 ...

1. 执行此操作。
1. 接下来执行此操作。可以阅读这些 [相关说明](...)。
{% endcapture %}

{% capture discussion %}
## 理解 ...

理解您刚才执行的步骤是一件有趣的事情。
{% endcapture %}

{% capture whatsnext %}
* 了解更多 [这](...)。
* 查看 [相关的任务](...)。
{% endcapture %}

{% include templates/task.md %}</pre>
{% endraw %}

<!--
<p>Here's an example of a published topic that uses the task template:</p>
-->
<p>下面是一个已发布的主题的示例，该示例使用了任务模板：</p>

<!--
<p><a href="/docs/tasks/access-kubernetes-api/http-proxy-access-api">Using an HTTP Proxy to Access the Kubernetes API</a></p>
-->
<p><a href="/docs/tasks/access-kubernetes-api/http-proxy-access-api">使用 HTTP 代理访问 Kubernetes API</a></p>

<!--
<h2 id="tutorial_template">Tutorial template</h2>
-->
<h2 id="tutorial_template">指南模板</h2>

<!--
<p>A tutorial page shows how to accomplish a goal that is larger than a single
task. Typically a tutorial page has several sections, each of which has a
sequence of steps. For example, a tutorial might provide a walkthrough of a
code sample that illustrates a certain feature of Kubernetes. Tutorials can
include surface-level explanations, but should link to related concept topics
for deep explanations.
-->
<p>指南页面展示了如何完成一个包含多个任务的目标。一般来说，指南页面有多个部分，每个部分都包含一系列步骤。例如，指南可以提供一个代码示例的演练，该示例展示了 Kubernetes 的某些功能。指南可以只包含浅显的解释，但应链接到相关概念主题以进行深入的解释。

<!--
<p>To write a new tutorial page, create a Markdown file in a subdirectory of the
/docs/tutorials directory. In your Markdown file, provide values for these
variables:</p>
-->
<p>想要写一个新的指南页面，请在 /docs/tutorials 的子目录下创建一个 Markdown 文件。在您的 Markdown 文件中，为如下变量提供相应的值：</p>

<!--
<ul>
    <li>overview - required</li>
    <li>prerequisites - required</li>
    <li>objectives - required</li>
    <li>lessoncontent - required</li>
    <li>cleanup - optional</li>
    <li>whatsnext - optional</li>
</ul>
-->
<ul>
    <li>overview - 必选</li>
    <li>prerequisites - 必选</li>
    <li>objectives - 必选</li>
    <li>lessoncontent - 必选</li>
    <li>cleanup - 可选</li>
    <li>whatsnext - 可选</li>
</ul>

<!--
<p>Then include templates/tutorial.md like this:</p>
-->
<p>然后像下面这样引入 templates/tutorial.md：</p>

{% raw %}<pre>...
{% include templates/tutorial.md %}</pre>{% endraw %}

<!--
<p>In the <code>lessoncontent</code> section, use <code>##</code> to start with a level-two heading. For subheadings,
use <code>###</code> and <code>####</code> as needed.
-->
<p>在 <code>LessonContent</code> 部分，使用 <code>##</code> 开始一个二级标题。对于子标题，根据需要使用 <code>###</code> 和 <code>####</code>。

<!--
<p>Here's an example of a Markdown file that uses the tutorial template:</p>
-->
<p>下面是一个使用指南模板的 Markdonw 文件示例：</p>

<!--
{% raw %}
<pre>---
title: Running a Thing
---

{% capture overview %}
This page shows how to ...
{% endcapture %}

{% capture prerequisites %}
* Do this.
* Do this too.
{% endcapture %}

{% capture objectives %}
* Learn this.
* Build this.
* Run this.
{% endcapture %}

{% capture lessoncontent %}
## Building ...

1. Do this.
1. Do this next. Possibly read this [related explanation](...).

## Running ...

1. Do this.
1. Do this next.

## Understanding the code
Here's something interesting about the code you ran in the preceding steps.
{% endcapture %}

{% capture cleanup %}
* Delete this.
* Stop this.
{% endcapture %}

{% capture whatsnext %}
* Learn more about [this](...).
* See this [related tutorial](...).
{% endcapture %}

{% include templates/tutorial.md %}</pre>
{% endraw %}
-->
{% raw %}
<pre>---
title: 运行这件事情
---

{% capture overview %}
本页展示怎么样 ...
{% endcapture %}

{% capture prerequisites %}
* 执行此步骤。
* 再执行该步骤。
{% endcapture %}

{% capture objectives %}
* 学习它。
* 构建它。
* 运行它。
{% endcapture %}

{% capture lessoncontent %}
## 构建 ...

1. 执行此操作。
1. 接下来执行该操作。可以阅读这些 [相关说明](...)。

## 运行 ...

1. 执行此步骤。
1. 接下来执行该步骤。

## 理解代码
理解前面步骤中运行的代码是一件有趣的事情
{% endcapture %}

{% capture cleanup %}
* 删除它。
* 停止它。
{% endcapture %}

{% capture whatsnext %}
* 了解更多 [这](...)。
* 查看 [相关的指南](...)。
{% endcapture %}

{% include templates/tutorial.md %}</pre>
{% endraw %}

<!--
<p>Here's an example of a published topic that uses the tutorial template:</p>
-->
<p>下面是一个已发布的主题的示例，该示例使用了指南模板：</p>

<!--
<p><a href="/docs/tutorials/stateless-application/run-stateless-application-deployment/">Running a Stateless Application Using a Deployment</a></p>
-->
<p><a href="/docs/tutorials/stateless-application/run-stateless-application-deployment/">使用 Deployment 运行一个无状态的应用</a></p>

<!--
<h2 id="concept_template">Concept template</h2>
-->
<h2 id="concept_template">概念模板</h2>

<!--
<p>A concept page explains some aspect of Kubernetes. For example, a concept
page might describe the Kubernetes Deployment object and explain the role it
plays as an application is deployed, scaled, and updated. Typically, concept
pages don't include sequences of steps, but instead provide links to tasks or
tutorials.
-->
<p>概念页面解释 Kubernetes 的某些方面。例如，概念页面可以描述 Kubernetes 的 Deployment 对象，并解释它在部署、缩放和更新应用程序时所扮演的角色。通常，概念页面不包括步骤序列，而是提供到任务或指南的链接。

<!--
<p>To write a new concept page, create a Markdown file in a subdirectory of the
/docs/concepts directory. In your Markdown file,  provide values for these
variables:</p>
-->
<p>想要写一个新的概念页面，请在 /docs/concepts 的子目录下创建一个 Markdown 文件。在您的 Markdown 文件中，为如下变量提供相应的值：</p>

<!--
<ul>
    <li>overview - required</li>
    <li>body - required</li>
    <li>whatsnext - optional</li>
</ul>
-->
<ul>
    <li>overview - 必选</li>
    <li>body - 必选</li>
    <li>whatsnext - 可选</li>
</ul>

<!--
<p>Then include templates/concept.md like this:</p>
-->
<p>然后像下面这样引入 templates/concept.md</p>

{% raw %}<pre>...
{% include templates/concept.md %}</pre>{% endraw %}

<!--
<p>In the <code>body</code> section, use <code>##</code> to start with a level-two heading. For subheadings,
use <code>###</code> and <code>####</code> as needed.
-->
<p>在 <code>body</code> 部分，使用 <code>##</code> 开始一个二级标题。对于子标题，根据需要使用 <code>###</code> 和 <code>####</code>。

<!--
<p>Here's an example of a page that uses the concept template:</p>
-->
<p>下面是一个使用概念模板的 Markdonw 文件示例：</p>

<!--
{% raw %}
<pre>---
title: Understanding this Thing
---

{% capture overview %}
This page explains ...
{% endcapture %}

{% capture body %}
## Understanding ...

Kubernetes provides ...

## Using ...

To use ...
{% endcapture %}

{% capture whatsnext %}
* Learn more about [this](...).
* See this [related task](...).
{% endcapture %}

{% include templates/concept.md %}</pre>
{% endraw %}
-->
{% raw %}
<pre>---
title: 理解这件事情
---

{% capture overview %}
本页说明 ...
{% endcapture %}

{% capture body %}
## 理解 ...

Kubernetes 提供 ...

## 使用 ...

为了使用 ...
{% endcapture %}

{% capture whatsnext %}
* 了解更多 [这](...)。
* 查看 [相关的任务](...)。
{% endcapture %}

{% include templates/concept.md %}</pre>
{% endraw %}

<!--
<p>Here's an example of a published topic that uses the concept template:</p>
-->
<p>下面是一个已发布的主题的示例，该示例使用了概念模板：</p>

<p><a href="/docs/concepts/overview/working-with-objects/annotations/">Annotations</a></p>

<!--</body>
</html>-->

