---
title: Using Page Templates
content_template: templates/concept
weight: 30
card:
  name: contribute
  weight: 30
---

{{% capture overview %}}

When contributing new topics, apply one of the following templates to them.
This standardizes the user experience of a given page.

The page templates are in the
[`layouts/partials/templates`](https://git.k8s.io/website/layouts/partials/templates)
directory of the [`kubernetes/website`](https://github.com/kubernetes/website)
repository.

{{< note >}}
Every new topic needs to use a template. If you are unsure which
template to use for a new topic, start with the
[concept template](#concept-template).
{{< /note >}}


{{% /capture %}}


{{% capture body %}}

## Concept template

A concept page explains some aspect of Kubernetes. For example, a concept
page might describe the Kubernetes Deployment object and explain the role it
plays as an application once it is deployed, scaled, and updated. Typically, concept
pages don't include sequences of steps, but instead provide links to tasks or
tutorials.


To write a new concept page, create a Markdown file in a subdirectory of the
`/content/en/docs/concepts` directory, with the following characteristics:

- In the page's YAML front-matter, set `content_template: templates/concept`.
- In the page's body, set the required `capture` variables and any optional
  ones you want to include:

    | Variable      | Required? |
    |---------------|-----------|
    | overview      | yes       |
    | body          | yes       |
    | whatsnext     | no        |

    The page's body will look like this (remove any optional captures you don't
    need):

    ```
    {{%/* capture overview */%}}

    {{%/* /capture */%}}

    {{%/* capture body */%}}

    {{%/* /capture */%}}

    {{%/* capture whatsnext */%}}

    {{%/* /capture */%}}
    ```

- Fill each section with content. Follow these guidelines:
  - Organize content with H2 and H3 headings.
  - For `overview`, set the topic's context with a single paragraph.
  - For `body`, explain the concept.
  - For `whatsnext`, provide a bulleted list of topics (5 maximum) to learn more about the concept.

[Annotations](/docs/concepts/overview/working-with-objects/annotations/) is a published example of the concept template. This page also uses the concept template.

## Task template

A task page shows how to do a single thing, typically by giving a short
sequence of steps. Task pages have minimal explanation, but often provide links
to conceptual topics that provide related background and knowledge.

To write a new task page, create a Markdown file in a subdirectory of the
`/content/en/docs/tasks` directory, with the following characteristics:

- In the page's YAML front-matter, set `content_template: templates/task`.
- In the page's body, set the required `capture` variables and any optional
  ones you want to include:

    | Variable      | Required? |
    |---------------|-----------|
    | overview      | yes       |
    | prerequisites | yes       |
    | steps         | no        |
    | discussion    | no        |
    | whatsnext     | no        |

    The page's body will look like this (remove any optional captures you don't
    need):

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

An example of a published topic that uses the task template is [Using an HTTP proxy to access the Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api).

## Tutorial template

A tutorial page shows how to accomplish a goal that is larger than a single
task. Typically a tutorial page has several sections, each of which has a
sequence of steps. For example, a tutorial might provide a walkthrough of a
code sample that illustrates a certain feature of Kubernetes. Tutorials can
include surface-level explanations, but should link to related concept topics
for deep explanations.

To write a new tutorial page, create a Markdown file in a subdirectory of the
`/content/en/docs/tutorials` directory, with the following characteristics:

- In the page's YAML front-matter, set `content_template: templates/tutorial`.
- In the page's body, set the required `capture` variables and any optional
  ones you want to include:

    | Variable      | Required? |
    |---------------|-----------|
    | overview      | yes       |
    | prerequisites | yes       |
    | objectives    | yes       |
    | lessoncontent | yes       |
    | cleanup       | no        |
    | whatsnext     | no        |

    The page's body will look like this (remove any optional captures you don't
    need):

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

An example of a published topic that uses the tutorial template is
[Running a Stateless Application Using a Deployment](/docs/tutorials/stateless-application/run-stateless-application-deployment/).

{{% /capture %}}

{{% capture whatsnext %}}

- Learn about the [Style guide](/docs/contribute/style/style-guide/)
- Learn about the [Content guide](/docs/contribute/style/content-guide/)
- Learn about [content organization](/docs/contribute/style/content-organization/)

{{% /capture %}}
