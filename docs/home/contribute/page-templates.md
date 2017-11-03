---
title: Using Page Templates
---

<!--<html>
<body>-->

<p>These page templates are available for writers who would like to contribute new topics to the Kubernetes docs:</p>

<ul>
    <li><a href="#task_template">Task</a></li>
    <li><a href="#tutorial_template">Tutorial</a></li>
    <li><a href="#concept_template">Concept</a></li>
</ul>

<p>The page templates are in the <a href="https://git.k8s.io/website/_includes/templates" target="_blank">_includes/templates</a> directory of the <a href="https://github.com/kubernetes/website">website</a> repository.

<h2 id="task_template">Task template</h2>

<p>A task page shows how to do a single thing, typically by giving a short
sequence of steps. Task pages have minimal explanation, but often provide links
to conceptual topics that provide related background and knowledge.</p>

<p>To write a new task page, create a Markdown file in a subdirectory of the
/docs/tasks directory. In your Markdown file, provide values for these
variables:</p>

<ul>
    <li>overview - required</li>
    <li>prerequisites - required</li>
    <li>steps - required</li>
    <li>discussion - optional</li>
    <li>whatsnext - optional</li>
</ul>

<p>Then include templates/task.md like this:</p>

{% raw %}<pre>...
{% include templates/task.md %}</pre>{% endraw %}

<p>In the <code>steps</code> section, use <code>##</code> to start with a level-two heading. For subheadings,
use <code>###</code> and <code>####</code> as needed. Similarly, if you choose to have a <code>discussion</code> section,
start the section with a level-two heading.</p>

<p>Here's an example of a Markdown file that uses the task template:</p>

{% raw %}
<pre>---
title: Configuring This Thing
---

{% capture overview %}
This page shows how to ...
{% endcapture %}

{% capture prerequisites %}
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

Here's an interesting thing to know about the steps you just did.
{% endcapture %}

{% capture whatsnext %}
* Learn more about [this](...).
* See this [related task](...).
{% endcapture %}

{% include templates/task.md %}</pre>
{% endraw %}

<p>Here's an example of a published topic that uses the task template:</p>

<p><a href="/docs/tasks/access-kubernetes-api/http-proxy-access-api">Using an HTTP Proxy to Access the Kubernetes API</a></p>

<h2 id="tutorial_template">Tutorial template</h2>

<p>A tutorial page shows how to accomplish a goal that is larger than a single
task. Typically a tutorial page has several sections, each of which has a
sequence of steps. For example, a tutorial might provide a walkthrough of a
code sample that illustrates a certain feature of Kubernetes. Tutorials can
include surface-level explanations, but should link to related concept topics
for deep explanations.

<p>To write a new tutorial page, create a Markdown file in a subdirectory of the
/docs/tutorials directory. In your Markdown file, provide values for these
variables:</p>

<ul>
    <li>overview - required</li>
    <li>prerequisites - required</li>
    <li>objectives - required</li>
    <li>lessoncontent - required</li>
    <li>cleanup - optional</li>
    <li>whatsnext - optional</li>
</ul>

<p>Then include templates/tutorial.md like this:</p>

{% raw %}<pre>...
{% include templates/tutorial.md %}</pre>{% endraw %}

<p>In the <code>lessoncontent</code> section, use <code>##</code> to start with a level-two heading. For subheadings,
use <code>###</code> and <code>####</code> as needed.

<p>Here's an example of a Markdown file that uses the tutorial template:</p>

{% raw %}
<pre>---
title: Running a Thing
---

{% capture overview %}
This page shows how to ...
{% endcapture %}

{% capture prerequisites %}
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
* Delete this.
* Stop this.
{% endcapture %}

{% capture whatsnext %}
* Learn more about [this](...).
* See this [related tutorial](...).
{% endcapture %}

{% include templates/tutorial.md %}</pre>
{% endraw %}

<p>Here's an example of a published topic that uses the tutorial template:</p>

<p><a href="/docs/tutorials/stateless-application/run-stateless-application-deployment/">Running a Stateless Application Using a Deployment</a></p>

<h2 id="concept_template">Concept template</h2>

<p>A concept page explains some aspect of Kubernetes. For example, a concept
page might describe the Kubernetes Deployment object and explain the role it
plays as an application is deployed, scaled, and updated. Typically, concept
pages don't include sequences of steps, but instead provide links to tasks or
tutorials.

<p>To write a new concept page, create a Markdown file in a subdirectory of the
/docs/concepts directory. In your Markdown file,  provide values for these
variables:</p>

<ul>
    <li>overview - required</li>
    <li>body - required</li>
    <li>whatsnext - optional</li>
</ul>

<p>Then include templates/concept.md like this:</p>

{% raw %}<pre>...
{% include templates/concept.md %}</pre>{% endraw %}

<p>In the <code>body</code> section, use <code>##</code> to start with a level-two heading. For subheadings,
use <code>###</code> and <code>####</code> as needed.

<p>Here's an example of a page that uses the concept template:</p>

{% raw %}
<pre>---
title: Understanding this Thing
---

{% capture overview %}
This page explains ...
{% endcapture %}

{% capture body %}
## Understanding ...

Kubernetes provides ...

## Using ...

To use ...
{% endcapture %}

{% capture whatsnext %}
* Learn more about [this](...).
* See this [related task](...).
{% endcapture %}

{% include templates/concept.md %}</pre>
{% endraw %}

<p>Here's an example of a published topic that uses the concept template:</p>

<p><a href="/docs/concepts/overview/working-with-objects/annotations/">Annotations</a></p>

<!--</body>
</html>-->

