---
title: Example Concept Template
reviewers:
- chenopis
---

{% capture overview %}

**NOTE:** Be sure to also [create an entry in the table of contents](/docs/home/contribute/write-new-topic/#creating-an-entry-in-the-table-of-contents) for your new document.

This page explains ...

{% endcapture %}

{% capture body %}

## Understanding ...

Kubernetes provides ...

## Using ...

To use ...

{% endcapture %}

{% capture whatsnext %}

**[Optional Section]**

* Learn more about [Writing a New Topic](/docs/home/contribute/write-new-topic/).
* See [Using Page Templates - Concept template](/docs/home/contribute/page-templates/#concept_template) for how to use this template.

{% endcapture %}

{% include templates/concept.md %}
