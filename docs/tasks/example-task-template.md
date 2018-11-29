---
title: Example Task Template
reviewers:
- chenopis
---

{% capture overview %}

**NOTE:** Be sure to also [create an entry in the table of contents](/docs/home/contribute/write-new-topic/#creating-an-entry-in-the-table-of-contents) for your new document.

This page shows how to ...

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}
* Do this.
* Do this too.

{% endcapture %}

{% capture steps %}

## Doing ...

1. Do this.
1. Do this next. Possibly read this [related explanation](...).

{% endcapture %}

{% capture discussion %}

## Understanding ...
**[Optional Section]**

Here's an interesting thing to know about the steps you just did.

{% endcapture %}

{% capture whatsnext %}

**[Optional Section]**

* Learn more about [Writing a New Topic](/docs/home/contribute/write-new-topic/).
* See [Using Page Templates - Task template](/docs/home/contribute/page-templates/#task_template) for how to use this template.

{% endcapture %}

{% include templates/task.md %}
