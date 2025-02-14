---
title: Page content types
content_type: concept
weight: 80
---

<!-- overview -->

The Kubernetes documentation follows several types of page content:

- Concept
- Task
- Tutorial
- Reference

<!-- body -->

## Content sections

Each page content type contains a number of sections defined by
Markdown comments and HTML headings. You can add content headings to
your page with the `heading` shortcode. The comments and headings help
maintain the structure of the page content types.

Examples of Markdown comments defining page content sections:

```markdown
<!-- overview -->
```

```markdown
<!-- body -->
```

To create common headings in your content pages, use the `heading` shortcode with
a heading string.

Examples of heading strings:

- whatsnext
- prerequisites
- objectives
- cleanup
- synopsis
- seealso
- options

For example, to create a `whatsnext` heading, add the heading shortcode with the "whatsnext" string:

```none
## {{%/* heading "whatsnext" */%}}
```

You can declare a `prerequisites` heading as follows:

```none
## {{%/* heading "prerequisites" */%}}
```

The `heading` shortcode expects one string parameter.
The heading string parameter matches the prefix of a variable in the `i18n/<lang>.toml` files.
For example:

`i18n/en.toml`:

```toml
[whatsnext_heading]
other = "What's next"
```

`i18n/ko.toml`:

```toml
[whatsnext_heading]
other = "다음 내용"
```

## Content types

Each content type informally defines its expected page structure.
Create page content with the suggested page sections.

### Concept

A concept page explains some aspect of Kubernetes. For example, a concept
page might describe the Kubernetes Deployment object and explain the role it
plays as an application once it is deployed, scaled, and updated. Typically, concept
pages don't include sequences of steps, but instead provide links to tasks or
tutorials.

To write a new concept page, create a Markdown file in a subdirectory of the
`/content/en/docs/concepts` directory, with the following characteristics:

Concept pages are divided into three sections:

| Page section  |
|---------------|
| overview      |
| body          |
| whatsnext     |

The `overview` and `body` sections appear as comments in the concept page.
You can add the `whatsnext` section to your page with the `heading` shortcode.

Fill each section with content. Follow these guidelines:

- Organize content with H2 and H3 headings.
- For `overview`, set the topic's context with a single paragraph.
- For `body`, explain the concept.
- For `whatsnext`, provide a bulleted list of topics (5 maximum) to learn more about the concept.

[Annotations](/docs/concepts/overview/working-with-objects/annotations/) is a published example of a concept page.

### Task

A task page shows how to do a single thing, typically by giving a short
sequence of steps. Task pages have minimal explanation, but often provide links
to conceptual topics that provide related background and knowledge.

To write a new task page, create a Markdown file in a subdirectory of the
`/content/en/docs/tasks` directory, with the following characteristics:

| Page section  |
|---------------|
| overview      |
| prerequisites |
| steps         |
| discussion    |
| whatsnext     |

The `overview`, `steps`, and `discussion` sections appear as comments in the task page.
You can add the `prerequisites` and `whatsnext` sections to your page
with the `heading` shortcode.

Within each section, write your content. Use the following guidelines:

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

An example of a published task topic is [Using an HTTP proxy to access the Kubernetes API](/docs/tasks/extend-kubernetes/http-proxy-access-api/).

### Tutorial

A tutorial page shows how to accomplish a goal that is larger than a single
task. Typically a tutorial page has several sections, each of which has a
sequence of steps. For example, a tutorial might provide a walkthrough of a
code sample that illustrates a certain feature of Kubernetes. Tutorials can
include surface-level explanations, but should link to related concept topics
for deep explanations.

To write a new tutorial page, create a Markdown file in a subdirectory of the
`/content/en/docs/tutorials` directory, with the following characteristics:

| Page section  |
|---------------|
| overview      |
| prerequisites |
| objectives    |
| lessoncontent |
| cleanup       |
| whatsnext     |

The `overview`, `objectives`, and `lessoncontent` sections appear as comments in the tutorial page.
You can add the `prerequisites`, `cleanup`, and `whatsnext` sections to your page
with the `heading` shortcode.

Within each section, write your content. Use the following guidelines:

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

An example of a published tutorial topic is
[Running a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).

### Reference

A component tool reference page shows the description and flag options output for
a Kubernetes component tool. Each page generates from scripts using the component tool commands.

A tool reference page has several possible sections:

| Page section                 |
|------------------------------|
| synopsis                     |
| options                      |
| options from parent commands |
| examples                     |
| seealso                      |

Examples of published tool reference pages are:

- [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/)
- [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
- [kubectl](/docs/reference/kubectl/kubectl/)

## {{% heading "whatsnext" %}}

- Learn about the [Style guide](/docs/contribute/style/style-guide/)
- Learn about the [Content guide](/docs/contribute/style/content-guide/)
- Learn about [content organization](/docs/contribute/style/content-organization/)
