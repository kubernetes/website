---
title: 示例任务模板
approvers:
- chenopis
cn-approvers:
- zhangqx2010
---
<!--
---
title: Example Task Template
approvers:
- chenopis
---
-->

{% capture overview %}

<!--
**NOTE:** Be sure to also [create an entry in the table of contents](/docs/home/contribute/write-new-topic/#creating-an-entry-in-the-table-of-contents) for your new document.
-->
**注意：** 同时确保为您的新文档 [在内容列表中创建入口](/docs/home/contribute/write-new-topic/#creating-an-entry-in-the-table-of-contents)

<!--
This page shows how to ...
-->
本文描述如何…

{% endcapture %}

{% capture prerequisites %}

<!--
* {% include task-tutorial-prereqs.md %}
* Do this.
* Do this too.
 -->
* {% include task-tutorial-prereqs.md %}
* 需要这样做。
* 也需要这样做。

{% endcapture %}

{% capture steps %}

<!--
## Doing ...

1. Do this.
1. Do this next. Possibly read this [related explanation](...).
-->
## 如何…

1. 这么做。
1. 然后这么做。可能需要阅读 [相关解释](...)。

{% endcapture %}

{% capture discussion %}

<!--
## Understanding ...
**[Optional Section]**
 -->
## 理解…
**[可选段落]**

<!--
Here's an interesting thing to know about the steps you just did.
 -->
这里是有意思的东西，要知道关于你具体实现的步骤。

{% endcapture %}

{% capture whatsnext %}

<!--
**[Optional Section]**
 -->
**[可选段落]**

<!--
* Learn more about [Writing a New Topic](/docs/home/contribute/write-new-topic/).
* See [Using Page Templates - Task template](/docs/home/contribute/page-templates/#task_template) for how to use this template.
 -->
* 学习如何 [撰写一个新的主题](/docs/home/contribute/write-new-topic/)。
* 如何使用这个模板，参见 [使用页面模板 - 任务模板](/docs/home/contribute/page-templates/#task_template)。

{% endcapture %}

{% include templates/task.md %}
