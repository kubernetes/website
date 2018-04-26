---
cn-approvers:
- tianshapjq
title: 检查文档 Issue
---
<!--
---
title: Reviewing Documentation Issues
---
-->

{% capture overview %}

<!--
This page explains how documentation issues are reviewed and prioritized for the [kubernetes/website](https://github.com/kubernetes/website){: target="_blank"} repository. The purpose is to provide a way to organize issues and make it easier to contribute to Kubernetes documentation. The following should be used as the standard way of prioritizing, labeling, and interacting with issues.
-->
本文阐述了如何对 [kubernetes/website](https://github.com/kubernetes/website){: target="_blank"} 存储库的文档 issue 进行检查和划分优先级。目的是为了能够提供一种方法去组织 issue 并且能够更容易地向 Kubernetes 文档发起贡献。以下是对 issue 进行优先级划分、打标签和交互的标准方式。
{% endcapture %}

{% capture body %}

<!--
## Categorizing issues
Issues should be sorted into different buckets of work using the following labels and definitions. If an issue doesn't have enough information to identify a problem that can be researched, reviewed, or worked on (i.e. the issue doesn't fit into any of the categories below) you should close the issue with a comment explaining why it is being closed.
-->
## issue 分类
您需要使用以下的标签和定义来将 issue 进行分类。如果一个 issue 不能包含足够的信息来确认一个问题足以被研究、审查或者处理（即该 issue 不适合以下任何分类），那么您就应该关闭这个 issue 并且提交一个评论来解释您关闭的原因。

### Needs Clarification
<!--
* Issues that need more information from the original submitter to make them actionable. Issues with this label that aren't followed up within a week may be closed.
-->
* issue 需要原提交者提供更多信息来让它能够变成 actionable。issue 被打上这个标签后，如果一个星期内没有任何更新那么可能会被关闭。

### Actionable
<!--
* Issues that can be worked on with current information (or may need a comment to explain what needs to be done to make it more clear)
* Allows contributors to have easy to find issues to work on
-->
* issue 基于目前的信息已经可以开始处理（或者可能需要增加评论，以解释还需要做什么来让内容更明确）
* 能够让贡献者方便的找到 issue 并开始处理

### Needs Tech Review
<!--
* Issues that need more information in order to be worked on (the proposed solution needs to be proven, a subject matter expert needs to be involved, work needs to be done to understand the problem/resolution and if the issue is still relevant)
* Promotes transparency about level of work needed for the issue and that issue is in progress
-->
* issue 需要更多的信息才能继续处理（如建议的方案需要得到证明，需要相关领域专家的介入，需要更多的工作来理解该问题/解决方案，以及该 issue 是否依然相关）
* 促进提高正在进行中的 issue 的透明度

### Needs Docs Review
<!--
* Issues that are suggestions for better processes or site improvements that require community agreement to be implemented
* Topics can be brought to SIG meetings as agenda items
-->
* 提供流程优化或者网站改进建议的 issue，这些建议需要得到社区的同意才能得到实施
* 能够被 SIG 会议作为会议议程的主题

### Needs UX Review
<!--
* Issues that are suggestions for improving the user interface of the site.
* Fixing broken site elements.
-->
* 提供建议以改善网站用户界面的 issue。
* 修复网站损坏的各种元素。

<!--
## Prioritizing Issues
The following labels and definitions should be used to prioritize issues. If you change the priority of an issues, please comment on the issue with your reasoning for the change.
-->
## issue 的优先级划分
以下的标签和定义是用来给 issue 划分优先级的。如果您改变了一个 issue 的优先级，请在 issue 上评论解释您改变的原因。

### P1
<!--
* Major content errors affecting more than 1 page
* Broken code sample on a heavily trafficked page
* Errors on a “getting started” page
* Well known or highly publicized customer pain points
* Automation issues
-->
* 影响超过一个页面的主要内容错误
* 访问量极大的页面中有损坏的代码示例
* 在 “getting started” 页面上存在错误
* 已经熟知或者高度公开化的用户痛点
* 有关自动化的 issue

### P2
<!--
* Default for all new issues
* Broken code for sample that is not heavily used
* Minor content issues in a heavily trafficked page
* Major content issues on a lower-trafficked page
-->
* 所有新提交 issue 的默认优先级
* 并未大量使用的损坏的代码示例
* 访问量极大的页面上的小内容修改
* 访问量较小的页面上的主要内容修改

### P3
<!--
* Typos and broken anchor links
-->
* 拼写错误和损坏的锚链接

<!--
## Handling special issue types
-->
## 处理特殊类型的 issue

<!--
### Duplicate issues
If a single problem has one or more issues open for it, the problem should be consolidated into a single issue. You should decide which issue to keep open (or open a new issue), port over all relevant information, link related issues, and close all the other issues that describe the same problem. Only having a single issue to work on will help reduce confusion and avoid duplicating work on the same problem.
-->
### 重复的 issue
如果一个问题有一个或者多个相关 issue，那么这个问题应该合并到一个 issue 中。您可以决定保留其中的一个 issue（或者创建一个新的 issue）来包含所有相关的信息，然后链接其它相关的 issue 并把其它描述同样问题的相关 issue 关闭。只保留一个 issue 将有助于减少混淆，避免在同一问题上重复工作。

<!--
### Dead link issues
Depending on where the dead link is reported, different actions are required to resolve the issue. Dead links in the API and Kubectl docs are automation issues and should be assigned a P1 until the problem can be fully understood. All other dead links are issues that need to be manually fixed and can be assigned a P3.
-->
### 无效链接的 issue
针对无效链接的情况有不同的处理方案。如果无效链接在 API 或者 Kubectl 的文档中，那么这就是自动化相关的 issue，需要指定为 P1 直到问题得到充分的理解。其它的无效链接则需要手工修改并且制定为 P3。

<!--
### Support requests or code bug reports
Some issues opened for docs are instead issues with the underlying code, or requests for assistance when something (like a tutorial) didn't work. For issues unrelated to docs, close the issue with a comment directing the requester to support venues (Slack, Stack Overflow) and, if relevant, where to file an issue for bugs with features (kubernetes/kubernetes is a great place to start).
-->
### 帮助请求或者代码错误报告
有些文档的 issue 实际上是代码问题，或者在某些内容（如教程）不起作用时请求帮助。对于和文档无关的 issue，需要关闭该 issue 并且评论以指引提交者到可以提供支持的地方（如 Slack，Stack Overflow），如果是代码错误，需要指引到可以提交代码错误或者特性相关 issue 的地方（kubernetes/kubernetes 是一个很好的选择）

<!--
Sample response to a request for support:
-->
以下是针对一个请求帮助的回复示例：

```
This issue sounds more like a request for support and less
like an issue specifically for docs. I encourage you to bring
your question to the `#kubernetes-users` channel in
[Kubernetes slack](http://slack.k8s.io/). You can also search
resources like
[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
for answers  to similar questions.

You can also open issues for Kubernetes functionality in
 https://github.com/kubernetes/kubernetes.

If this is a documentation issue, please re-open this issue.
```

<!--
Sample code bug report response:
-->
以下是针对代码错误报告的回复示例：

```
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

{% endcapture %}



{% capture whatsnext %}
<!--
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/).
-->
* 学习 [编写一个新的主题](/docs/home/contribute/write-new-topic/).
* 学习 [使用页面模板](/docs/home/contribute/page-templates/).
* 学习 [展示您的修改](/docs/home/contribute/stage-documentation-changes/).
{% endcapture %}

{% include templates/concept.md %}
