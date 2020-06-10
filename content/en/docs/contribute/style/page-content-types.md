---
title: Page content types
content_type: concept
weight: 30
card:
  name: contribute
  weight: 30
---

<!-- overview -->

The Kubernetes documentation follows several types of page content:

- Concept
- Task
- Tutorial
- Reference

Content pages contain HTML headings that create structure on the page.

<!-- body -->

## Content sections

Each page content type contains a number of sections.
Most of the main sections are outlined in the page using Markdown comments. 
This page structure helps to maintain the different content types.

For example,

```
<!-- body -->
```

```
<!-- overview -->
```

To create localized headings for common headings, use the `heading` shortcode
in your content pages. Common localized headings are:

- whatsnext
- prerequisites
- objectives
- cleanup

To create a localized `whatsnext` heading on a page, you can add to your page:

```none
## {{%/* heading "whatsnext" */%}}
```

The `whatsnext` heading displays as:

## {{% heading "whatsnext" %}}


To create a localized `prerequisites` heading on a page, you can add to your page:

```none
## {{%/* heading "prerequisites" */%}}
```

The `prerequisites heading displays as:

## {{% heading "prerequisites" %}}


The `heading` shortcode takes one parameter.
The string should match the prefix of a variable in the localized file, such `i18n/en.toml`:

```
[whatsnext_heading]
other = "What's next"
```

Another localized file, such as `i18n/ko.toml`:

```
[whatsnext_heading]
other = "다음 내용"
```

## Concept

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


Fill each section with content. Follow these guidelines:
- Organize content with H2 and H3 headings.
- For `overview`, set the topic's context with a single paragraph.
- For `body`, explain the concept.
- For `whatsnext`, provide a bulleted list of topics (5 maximum) to learn more about the concept.

[Annotations](/docs/concepts/overview/working-with-objects/annotations/) is a published example of a concept page.

## Task 

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

An example of a published task topic is [Using an HTTP proxy to access the Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api).

## Tutorial

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
[Running a Stateless Application Using a Deployment](/docs/tutorials/stateless-application/run-stateless-application-deployment/).

## Reference

A component tool reference page shows the `--help` output for a Kubernetes component tool.
Each page output depends upon the component tool's source code in `kubernetes/kubernetes`.

Typically a tool reference page has several sections:

| Page section                 |
|------------------------------|
| synopsis                     |
| options                      |
| options from parent commands |
| examples                     |
| body                         |
| seealso                      |

An example of a published tool reference topic is:

- [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/)
- [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
- [kubectl](/docs/reference/kubectl/kubectl/)

## {{% heading "whatsnext" %}}

- Learn about the [Style guide](/docs/contribute/style/style-guide/)
- Learn about the [Content guide](/docs/contribute/style/content-guide/)
- Learn about [content organization](/docs/contribute/style/content-organization/)
