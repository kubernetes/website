---
title: 概念模板示例
cn-approvers:
- tianshapjq
approvers:
- chenopis
---
<!--
---
title: Example Concept Template
approvers:
- chenopis
---
-->

{% capture overview %}

<!--
**NOTE:** Be sure to also [create an entry in the table of contents](/docs/home/contribute/write-new-topic/#creating-an-entry-in-the-table-of-contents) for your new document.
-->
**注意：** 一定要为新文档 [在目录中创建一个条目](/docs/home/contribute/write-new-topic/#creating-an-entry-in-the-table-of-contents)。

<!--
This page explains ...
-->
本页面解释了 ...

{% endcapture %}

{% capture body %}

<!--
## Understanding ...

Kubernetes provides ...
-->
## 理解 ...

Kubernetes 提供 ...

<!--
## Using ...

To use ...
-->
## 使用 ...

要使用 ...

{% endcapture %}

{% capture whatsnext %}

<!--
**[Optional Section]**
-->
**[可选部分]**

<!--
* Learn more about [Writing a New Topic](/docs/home/contribute/write-new-topic/).
* See [Using Page Templates - Concept template](/docs/home/contribute/page-templates/#concept_template) for how to use this template.
-->
* 学习如何 [编写一个新的主题](/docs/home/contribute/write-new-topic/)。
* 有关如何使用此模板，请参见 [使用页面模板 - 概念模板](/docs/home/contribute/page-templates/#concept_template)。

{% endcapture %}

{% include templates/concept.md %}
