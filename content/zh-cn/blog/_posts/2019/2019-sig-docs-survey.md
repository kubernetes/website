---
layout: blog
title: "Kubernetes 文档最终用户调研"
date: 2019-10-29
slug: kubernetes-documentation-end-user-survey
---
<!--
---
layout: blog
title: "Kubernetes Documentation Survey"
date: 2019-10-29
slug: kubernetes-documentation-end-user-survey
---
-->

**Author:** [Aimee Ukasick](https://www.linkedin.com/in/aimee-ukasick/) and SIG Docs

<!--
In September, SIG Docs conducted its first survey about the [Kubernetes
documentation](https://kubernetes.io/docs/). We'd like to thank the CNCF's Kim
McMahon for helping us create the survey and access the results.
-->
9月，SIG Docs 进行了第一次关于 [Kubernetes 文档](https://kubernetes.io/docs/)的用户调研。我们要感谢 CNCF
的 Kim McMahon 帮助我们创建调查并获取结果。

<!--
# Key takeaways
-->
# 主要收获

<!--
Respondents would like more example code, more detailed content, and more
diagrams in the Concepts, Tasks, and Reference sections.
-->
受访者希望能在概念、任务和参考部分得到更多示例代码、更详细的内容和更多图表。

<!--
74% of respondents would like the Tutorials section to contain advanced content.
-->
74% 的受访者希望教程部分包含高级内容。

<!--
69.70% said the Kubernetes documentation is the first place they look for
information about Kubernetes.
-->
69.70% 的受访者认为 Kubernetes 文档是他们首要寻找关于 Kubernetes 资料的地方。

<!--
# Survey methodology and respondents
-->
# 调查方法和受访者

<!--
We conducted the survey in English. The survey was only available for 4 days due
to time constraints. We announced the survey on Kubernetes mailing lists, in
Kubernetes Slack channels, on Twitter, and in Kube Weekly. There were 23
questions, and respondents took an average of 4 minutes to complete the survey.
-->
我们用英语进行了调查。由于时间限制，调查的有效期只有 4 天。
我们在 Kubernetes 邮件列表、Kubernetes Slack 频道、Twitter、Kube Weekly 上发布了我们的调查问卷。
这份调查有 23 个问题， 受访者平均用 4 分钟完成这个调查。

<!--
## Quick facts about respondents:
-->
## 关于受访者的简要情况

<!--
- 48.48% are experienced Kubernetes users, 26.26% expert, and 25.25% beginner
- 57.58% use Kubernetes in both administrator and developer roles
- 64.65% have been using the Kubernetes documentation for more than 12 months
- 95.96% read the documentation in English
-->
- 48.48% 是经验丰富的 Kubernetes 用户，26.26% 是专家，25.25% 是初学者
- 57.58% 的人同时使用 Kubernetes 作为管理员和开发人员
- 64.65% 的人使用 Kubernetes 文档超过 12 个月
- 95.96% 的人阅读英文文档

<!--
# Question and response highlights
-->
# 问题和回答要点

<!--
## Why people access the Kubernetes documentation
-->
## 人们为什么访问 Kubernetes 文档

<!--
The majority of respondents stated that they access the documentation for the Concepts.

{{< figure
    src="/images/blog/2019-sig-docs-survey/Q9-k8s-docs-use.png"
    alt="Why respondents access the Kubernetes documentation"
>}}
-->
大多数受访者表示，他们访问文档是为了了解概念。

{{< figure
    src="/images/blog/2019-sig-docs-survey/Q9-k8s-docs-use.png"
    alt="受访者为什么访问 Kubernetes 文档"
>}}

<!--
This deviates only slightly from what we see in Google Analytics: of the top 10
most viewed pages this year, #1 is the kubectl cheatsheet in the Reference section,
followed overwhelmingly by pages in the Concepts section.
-->
这与我们在 Google Analytics 上看到的略有不同：在今年浏览量最多的10个页面中，第一是在参考部分的 kubectl
的备忘单，其次是概念部分的页面。

<!--
## Satisfaction with the documentation
-->
## 对文档的满意程度

<!--
We asked respondents to record their level of satisfaction with the detail in
the Concepts, Tasks, Reference, and Tutorials sections:
-->
我们要求受访者从概念、任务、参考和教程部分记录他们对细节的满意度：

<!--
- Concepts: 47.96% Moderately Satisfied
- Tasks: 50.54% Moderately Satisfied
- Reference: 40.86% Very Satisfied
- Tutorial: 47.25% Moderately Satisfied
-->
- 概念：47.96% 中等满意
- 任务：50.54% 中等满意
- 参考：40.86% 非常满意
- 教程：47.25% 中等满意

<!--
## How SIG Docs can improve each documentation section
-->
## SIG Docs 如何改进文档的各个部分

<!--
We asked how we could improve each section, providing respondents with
selectable answers as well as a text field. The clear majority would like more
example code, more detailed content, more diagrams, and advanced tutorials:
-->
我们询问如何改进每个部分，为受访者提供可选答案以及文本输入框。绝大多数人想要更多
示例代码、更详细的内容、更多图表和更高级的教程：

<!--
```text
- Personally, would like to see more analogies to help further understanding.
- Would be great if corresponding sections of code were explained too
- Expand on the concepts to bring them together - they're a bucket of separate eels moving in different directions right now
- More diagrams, and more example code
```
-->
```text
- 就个人而言，希望看到更多的类比，以帮助进一步理解。
- 如果代码的相应部分也能解释一下就好了
- 通过扩展概念把它们融合在一起 - 它们现在宛如在一桶水内朝各个方向游动的一条条鳗鱼。
- 更多的图表，更多的示例代码
```

<!--
Respondents used the "Other" text box to record areas causing frustration:
-->
受访者使用“其他”文本框记录引发阻碍的区域：

<!--
```text
- Keep concepts up to date and accurate
- Keep task topics up to date and accurate. Human testing.
- Overhaul the examples. Many times the output of commands shown is not actual.
- I've never understood how to navigate or interpret the reference section
- Keep the tutorials up to date, or remove them
```
-->
```text
- 使概念保持最新和准确
- 保持任务主题的最新性和准确性。亲身试验。
- 彻底检查示例。很多时候显示的命令输出不是实际情况。
- 我从来都不知道如何导航或解释参考部分
- 使教程保持最新，或将其删除
```

<!--
## How SIG Docs can improve the documentation overall
-->
## SIG Docs 如何全面改进文档

<!--
We asked respondents how we can improve the Kubernetes documentation
overall. Some took the opportunity to tell us we are doing a good job:
-->
我们询问受访者如何从整体上改进 Kubernetes 文档。一些人抓住这次机会告诉我们我们正在做一个很棒的
工作：

<!--
```text
- For me, it is the best documented open source project.
- Keep going!
- I find the documentation to be excellent.
- You [are] doing a great job. For real.
```
-->
```text
- 对我而言，这是我见过的文档最好的开源项目。
- 继续努力！
- 我觉得文档很好。
- 你们做得真好。真的。
```

<!--
Other respondents provided feedback on the content:
-->
其它受访者提供关于内容的反馈：

<!--
```text
-  ...But since we're talking about docs, more is always better. More
advanced configuration examples would be, to me, the way to go. Like a Use Case page for each configuration topic with beginner to advanced example scenarios. Something like that would be
awesome....
-->
<!--
- More in-depth examples and use cases would be great. I often feel that the Kubernetes documentation scratches the surface of a topic, which might be great for new users, but it leaves more experienced users without much "official" guidance on how to implement certain things.
-->
<!--
- More production like examples in the resource sections (notably secrets) or links to production like examples
-->
<!--
- It would be great to see a very clear "Quick Start" A->Z up and running like many other tech projects. There are a handful of almost-quick-starts, but no single guidance. The result is information overkill.
```
-->

```text
-  ...但既然我们谈论的是文档，多多益善。更多的高级配置示例对我来说将是最好的选择。比如每个配置主题的用例页面，
从初学者到高级示例场景。像这样的东西真的是令人惊叹......
- 更深入的例子和用例将是很好的。我经常感觉 Kubernetes 文档只是触及了一个主题的表面，这可能对新用户很好，
但是它没有让更有经验的用户获取多少关于如何实现某些东西的“官方”指导。
- 资源节（特别是 secrets）希望有更多类似于产品的示例或指向类似产品的示例的链接
- 如果能像很多其它技术项目那样有非常清晰的“快速启动” 逐步教学完成搭建就更好了。现有的快速入门内容屈指可数，
也没有统一的指南。结果是信息泛滥。
```

<!--
A few respondents provided technical suggestions:

```text
- Make table columns sortable and filterable using a ReactJS or Angular component.
-->
<!--
- For most, I think creating documentation with Hugo - a system for static site generation - is not appropriate. There are better systems for documenting large software project. 
-->
<!--
Specifically, I would like to see k8s switch to Sphinx for documentation. It has an excellent built-in search, it is easy tolearn if you know markdown, it is widely adopted by other projects (e.g. every software project in readthedocs.io, linux kernel, docs.python.org etc).
```
-->

少数受访者提供的技术建议：
```text
- 使用 ReactJS 或者 Angular component 使表的列可排序和可筛选。
- 对于大多数人来说，我认为用 Hugo - 一个静态站点生成系统 - 创建文档是不合适的。有更好的系统来记录大型软件项目。
具体来说，我希望看到 k8s 切换到 Sphinx 来获取文档。Sphinx 有一个很好的内置搜索。如果你了解 markdown，学习起来也很容易。
Sphinx 被其他项目广泛采用（例如，在 readthedocs.io、linux kernel、docs.python.org 等等）。
```

<!--
Overall, respondents provided constructive criticism focusing on the need for
advanced use cases as well as more in-depth examples, guides, and walkthroughs.
-->
总体而言，受访者提供了建设性的批评，其关注点是高级用例以及更深入的示例、指南和演练。

<!--
# Where to see more
-->
# 哪里可以看到更多

<!--
Survey results summary, charts, and raw data are available in `kubernetes/community` sig-docs [survey](https://github.com/kubernetes/community/tree/master/sig-docs/survey) directory.
-->
调查结果摘要、图表和原始数据可在 `kubernetes/community` sig-docs 
[survey](https://github.com/kubernetes/community/tree/master/sig-docs/survey) 
目录下。
