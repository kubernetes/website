---
title: 使用页面模板
content_template: templates/concept
weight: 30
---

<!--
---
title: Using Page Templates
content_template: templates/concept
weight: 30
---
-->

{{% capture overview %}}

<!--
When contributing new topics, apply one of the following templates to them.
This standardizes the user experience of a given page.
-->

当贡献新主题时，选择下列模板中的一种。
这使指定页面的用户体验标准化。

<!--
The page templates are in the
[`layouts/partials/templates`](https://git.k8s.io/website/layouts/partials/templates)
directory of the [`kubernetes/website`](https://github.com/kubernetes/website)
repository.
-->

页面模板在 [`kubernetes/website`](https://github.com/kubernetes/website) 仓库的 [`layouts/partials/templates`](https://git.k8s.io/website/layouts/partials/templates) 目录中。

{{< note >}}
<!--
Every new topic needs to use a template. If you are unsure which
template to use for a new topic, start with the
[concept template](#concept-template).
-->

每个新主题都需要使用模板。如果你不确定新主题要使用哪个模板，请从[概念模板](#概念模板)开始。
{{< /note >}}


{{% /capture %}}


{{% capture body %}}

<!--
## Concept template
-->

## 概念模板

<!--
A concept page explains some aspect of Kubernetes. For example, a concept
page might describe the Kubernetes Deployment object and explain the role it
plays as an application once it is deployed, scaled, and updated. Typically, concept
pages don't include sequences of steps, but instead provide links to tasks or
tutorials.
-->

每个概念页面负责解释 Kubernetes 的某方面。例如，概念页面可以描述 Kubernetes Deployment 对象，并解释当部署、扩展和更新时，它作为应用程序所扮演的角色。一般来说，概念页面不包括步骤序列，而是提供任务或教程的链接。


<!--
To write a new concept page, create a Markdown file in a subdirectory of the
`/content/en/docs/concepts` directory, with the following characteristics:
-->

要编写新的概念页面，请在 `/content/en/docs/concepts` 目录的子目录中创建一个 Markdown 文件，其特点如下：

<!--
- In the page's YAML front-matter, set `content_template: templates/concept`.
- In the page's body, set the required `capture` variables and any optional
  ones you want to include:
-->

- 在页面的 YAML 头部，设置 `content_template: templates/concept`。
- 在页面的 body 中，设置所需的 `capture` 变量和所有想要包含的变量：

    | 变量          | 必需?     |
    |---------------|-----------|
    | overview      | 是        |
    | body          | 是        |
    | whatsnext     | 否        |

<!--
    The page's body will look like this (remove any optional captures you don't
    need):
-->

    页面的 body 看起来像这样（移除所有不想要的可选 `capture` 变量）：

    ```
    {{%/* capture overview */%}}

    {{%/* /capture */%}}

    {{%/* capture body */%}}

    {{%/* /capture */%}}

    {{%/* capture whatsnext */%}}

    {{%/* /capture */%}}
    ```

<!--
- Within each section, write your content. Use the following guidelines:
  - Use a minimum of H2 headings (with two leading `#` characters). The sections
    themselves are titled automatically by the template.
  - For `overview`, use a paragraph to set context for the entire topic.
  - For `body`, explain the concept using free-form Markdown.
  - For `whatsnext`, give a bullet list of up to 5 topics the reader might be
    interested in reading next.
-->

- 在每个章节中写下你的内容。请遵从以下规则：
  - 使用不低于 H2 级别的标题（避免使用 H1 的标题，但 H3、H4 的标题是可以的）（以两个 `#` 字符开头）。这些章节本身是由模板自动命名的。
  - 在 `overview` 节，用一个段落的篇幅来为当前话题设定语境。
  - 在 `body` 节，使用自由形式的 Markdown 文件来解释概念。
  - 在 `whatsnext` 节，列出读者接下来可能感兴趣的最多 5 个主题。

<!--
An example of a published topic that uses the concept template is
[Annotations](/docs/concepts/overview/working-with-objects/annotations/). The
page you are currently reading also uses the concept template.
-->

使用概念模板的已发布主题的一个示例是[注解](/docs/concepts/overview/working-with-objects/annotations/)。你当前正在阅读的页面也使用概念模板。

<!--
## Task template
-->

## 任务模板

<!--
A task page shows how to do a single thing, typically by giving a short
sequence of steps. Task pages have minimal explanation, but often provide links
to conceptual topics that provide related background and knowledge.
-->

任务页面展示了如何完成单个任务，通常是通过给出一个简短的步骤序列。任务页面中解释性质的文字极少，但是通常会给出提供相关背景和知识的概念主题的链接。

<!--
To write a new task page, create a Markdown file in a subdirectory of the
`/content/en/docs/tasks` directory, with the following characteristics:
-->

要编写新的任务页面，请在 `/content/en/docs/tasks` 目录的子目录中创建一个 Markdown 文件，其特点如下：

<!--
- In the page's YAML front-matter, set `content_template: templates/task`.
- In the page's body, set the required `capture` variables and any optional
  ones you want to include:
-->

- 在页面的 YAML 头部，设置 `content_template: templates/task`。
- 在页面的 body 中，设置所需的 `capture` 变量和所有想要包含的变量：

    | 变量          | 必需?     |
    |---------------|-----------|
    | overview      | 是        |
    | prerequisites | 是        |
    | steps         | 否        |
    | discussion    | 否        |
    | whatsnext     | 否        |

<!--
    The page's body will look like this (remove any optional captures you don't
    need):
-->

    页面的 body 看起来像这样（移除所有不想要的可选 `capture` 变量）：

    ```
    {{%/* capture overview */%}}

    {{%/* /capture */%}}

    {{%/* capture prerequisites */%}}

    {{</* include "task-tutorial-prereqs.md" */>}} {{</* version-check */>}}

    {{%/* /capture */%}}

    {{%/* capture steps */%}}

    {{%/* /capture */%}}

    {{%/* capture discussion */%}}

    {{%/* /capture */%}}

    {{%/* capture whatsnext */%}}

    {{%/* /capture */%}}
    ```

<!--
- Within each section, write your content. Use the following guidelines:
  - Use a minimum of H2 headings (with two leading `#` characters). The sections
    themselves are titled automatically by the template.
  - For `overview`, use a paragraph to set context for the entire topic.
  - For `prerequisites`, use bullet lists when possible. Start adding additional
    prerequisites below the `include`. The default prerequisites include a running Kubernetes cluster.
  - For `steps`, use numbered lists.
  - For discussion, use normal content to expand upon the information covered
    in `steps`.
  - For `whatsnext`, give a bullet list of up to 5 topics the reader might be
    interested in reading next.
-->

- 在每个章节中写下你的内容。请遵从以下规则：
  - 使用不低于 H2 级别的标题（避免使用 H1 的标题，但 H3、H4 的标题是可以的）（以两个 `#` 字符开头）。这些章节本身是由模板自动命名的。
  - 在 `overview` 节，用一个段落的篇幅来为当前话题设定语境。
  - 在 `prerequisites 节`，如果有可能，请使用列表。在 `include` 下开始添加额外的先决条件。默认的先决条件包括运行中的 Kubernetes 集群。
  - 在 `steps` 节，使用编号列表。
  - 在讨论部分，使用通常的内容来扩展 `steps` 中包含的信息。
  - 在 `whatsnext` 节，列出读者接下来可能感兴趣的最多 5 个主题。

<!--
An example of a published topic that uses the task template is [Using an HTTP proxy to access the Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api).
-->

使用任务模板的已发布主题的一个示例是[使用 HTTP 代理访问 Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api)。

<!--
## Tutorial template
-->

## 教程模板

<!--
A tutorial page shows how to accomplish a goal that is larger than a single
task. Typically a tutorial page has several sections, each of which has a
sequence of steps. For example, a tutorial might provide a walkthrough of a
code sample that illustrates a certain feature of Kubernetes. Tutorials can
include surface-level explanations, but should link to related concept topics
for deep explanations.
-->

教程页面展示了如何完成比单个任务更大的目标。通常教程页有几个章节，每个章节都有步骤说明。例如，教程可以提供说明 Kubernetes 的特定特性的代码示例的演练。教程可以包括表层解释，但是应该链接到相关的概念主题以进行深入解释。

<!--
To write a new tutorial page, create a Markdown file in a subdirectory of the
`/content/en/docs/tutorials` directory, with the following characteristics:
-->

要编写新的教程页面，请在 `/content/en/docs/tutorials` 目录的子目录中创建一个 Markdown 文件，其特点如下：

<!--
- In the page's YAML front-matter, set `content_template: templates/tutorial`.
- In the page's body, set the required `capture` variables and any optional
  ones you want to include:
-->

- 在页面的 YAML 头部，设置 `content_template: templates/tutorial`。
- 在页面的 body 中，设置所需的 `capture` 变量和所有想要包含的变量：

    | 变量          | 必需?     |
    |---------------|-----------|
    | overview      | 是        |
    | prerequisites | 是        |
    | objectives    | 是        |
    | lessoncontent | 是        |
    | cleanup       | 否        |
    | whatsnext     | 否        |

<!--
    The page's body will look like this (remove any optional captures you don't
    need):
-->

    页面的 body 看起来像这样（移除所有不想要的可选 `capture` 变量）：

    ```
    {{%/* capture overview */%}}

    {{%/* /capture */%}}

    {{%/* capture prerequisites */%}}

    {{</* include "task-tutorial-prereqs.md" */>}} {{</* version-check */>}}

    {{%/* /capture */%}}

    {{%/* capture objectives */%}}

    {{%/* /capture */%}}

    {{%/* capture lessoncontent */%}}

    {{%/* /capture */%}}

    {{%/* capture cleanup */%}}

    {{%/* /capture */%}}

    {{%/* capture whatsnext */%}}

    {{%/* /capture */%}}
    ```

<!--
- Within each section, write your content. Use the following guidelines:
  - Use a minimum of H2 headings (with two leading `#` characters). The sections
    themselves are titled automatically by the template.
  - For `overview`, use a paragraph to set context for the entire topic.
  - For `prerequisites`, use bullet lists when possible. Add additional
    prerequisites below the ones included by default.
  - For `objectives`, use bullet lists.
  - For `lessoncontent`, use a mix of numbered lists and narrative content as
    appropriate.
  - For `cleanup`, use numbered lists to describe the steps to clean up the
    state of the cluster after finishing the task.
  - For `whatsnext`, give a bullet list of up to 5 topics the reader might be
    interested in reading next.
-->

- 在每个章节中写下你的内容。请遵从以下规则：
  - 使用不低于 H2 级别的标题（避免使用 H1 的标题，但 H3、H4 的标题是可以的）（以两个 `#` 字符开头）。这些章节本身是由模板自动命名的。
  - 在 `overview` 节，用一个段落的篇幅来为当前话题设定语境。
  - 在 `prerequisites` 节，如果有可能，请使用列表。在默认情况下添加额外的先决条件。
  - 在 `objectives` 节，使用列表。
  - 在 `lessoncontent` 节，适当地使用编号列表和叙述内容的组合。
  - 在 `cleanup` 节，使用编号列表描述完成任务后清理集群状态的步骤。
  - 在 `whatsnext` 节，列出读者接下来可能感兴趣的最多 5 个主题。

<!--
An example of a published topic that uses the tutorial template is
[Running a Stateless Application Using a Deployment](/docs/tutorials/stateless-application/run-stateless-application-deployment/).
-->

使用教程模板的已发布主题的一个示例是[使用部署运行无状态应用程序](/docs/tutorials/stateless-application/run-stateless-application-deployment/)。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
- Learn about the [style guide](/docs/contribute/style/style-guide/)
- Learn about [content organization](/docs/contribute/style/content-organization/)
-->

- 学习[样式指南](/docs/contribute/style/style-guide/)
- 学习[内容组织](/docs/contribute/style/content-organization/)

{{% /capture %}}
