# Kubernetes Glossary

To write a glossary snippet, start with a copy of the template, [`/_data/glossary/_example.yml`](/_data/glossary/_example.yml). Make sure to provide (or omit) values for the following fields:

* (Required) `id`
  * This field must match the name of the glossary file itself (without the `*.yml` extension). It is *not* intended to be displayed to users, and is only used programmatically.
* (Required) `name`
  * The name of the term.
* (Optional) `full-link`
  * The link to any specific long-form documentation, starting with `https://` if not within the website repo, and `/docs/...` if within the repo.
* (Required) `tags`
  * Must be one of the tags listed in the [tags directory in the website repository](https://github.com/kubernetes/website/tree/master/_data/canonical-tags).
* (Required) `short description`
  * Make sure to replace the instructional text in the template with your content.
* (Optional) `aka`
  * These synonyms do not need to be glossary terms themselves (if they are deprecated), and can include spaces.
* (Optional) `related`
  * These should be the `id`s (not the `names`) of related glossary terms.
* (Optional) `long description`
  * If you do not provide a long description, remove the field -- that is, the complete key-value pair.

The `_example.yml` template also contains basic information about how to write your snippet. For additional guidance, continue reading this readme.

## Glossary snippet style guide

This style guide supplements the guidance provided in the glossary template. It's intended to help you think about what and how to write glossary definitions. For more general guidance on style, consult [the core docs style guide](https://kubernetes.io/docs/home/contribute/style-guide/).

### Minimum viable snippet:

Every snippet must include at least the short description. The long description is optional, but should be provided for terms that need additional clarification. For consistency with existing *Concept* definitions, *write your definitions as if the term is plural*.

**short-description** (Required): One line (or two short lines) that provides a minimum definition. Do not repeat the term. Prefer fragments. Model after tooltips. End with a period.

**long-description** (Optional): Longer additional text to appear after (in conjunction with) short description. Provide in cases where the short description is not sufficient for the intro paragraph to a topic. Write complete but concise sentences.

### Examples

```yaml
- name: Pod
- tags:
  - Fundamental
  - Workload
  - API Object
- short-description: The smallest and simplest Kubernetes objects. Represent a set of running processes on your cluster.
- long-description: Pods most often run only a single container, and are managed by a Deployment.
```

```yaml
- name: Deployment
- tags:
  - Fundamental
  - Workload
  - API Object
- short-description: Controllers that provide declarative updates for Pods and ReplicaSets.
- long-description: Deployments are responsible for creating and updating instances of an application.
```

### Thinking about definitions

* **Think of the short description as it would appear in a tooltip.** Is it sufficient to get the reader started? Is it short enough to be read inside a small UI element?

  *Tip*: look at the API reference doc content (for example, https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.10/). Note, however, that this content should be used with care. The concept docs for Pod, for example, are clearer than the reference docs.

* **The long description should follow the short description to make a complete introduction to a topic.** (This is the content that appears at the top of the content, before any generated TOC.) Does it provide information that's not already clear from the short description? Does it provide information that readers should have a general sense of before they dive into the details of the topic it helps introduce?

  *Tip:* the long description does not need to be long; it's intended to extend but not replace the short description. Look through current related docs for ideas. (The Deployment long description is taken from a tutorial, for example.)
