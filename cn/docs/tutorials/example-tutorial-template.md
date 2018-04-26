---
title: Example Tutorial Template
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

{% capture objectives %}

* Learn this.
* Build this.
* Run this.

{% endcapture %}

{% capture lessoncontent %}

## Building ...

1. Do this.
1. Do this next. Possibly read this [related explanation](...).

## Running ...

1. Do this.
1. Do this next.

## Understanding the code
Here's something interesting about the code you ran in the preceding steps.

{% endcapture %}

{% capture cleanup %}

**[Optional Section]**

* Delete this.
* Stop this.

{% endcapture %}

{% capture whatsnext %}

**[Optional Section]**

* Learn more about [Writing a New Topic](/docs/home/contribute/write-new-topic/).
* See [Using Page Templates - Tutorial template](/docs/home/contribute/page-templates/#tutorial_template) for how to use this template.

{% endcapture %}

{% include templates/tutorial.md %}
