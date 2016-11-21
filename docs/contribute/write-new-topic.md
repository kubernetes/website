---
---

{% capture overview %}
This page shows how to create a new topic for the Kubernetes docs.
{% endcapture %}

{% capture prerequisites %}
Create a fork of the Kubernetes documentation repository as described in
[Creating a Documentation Pull Request](/docs/contribute/create-pull-request/).
{% endcapture %}

{% capture steps %}

### Choosing a page type

As you prepare to write a new topic, think about which of these page types
is the best fit for your content:

<table>

  <tr>
    <td>Task</td>
    <td>A task page shows how to do a single thing, typically by giving a short sequence of steps. Task pages have minimal explanation, but often provide links to conceptual topics that provide related background and knowledge.</td>
  </tr>

  <tr>
    <td>Tutorial</td>
    <td>A tutorial page shows how to accomplish a goal that is larger than a single task. Typically a tutorial page has several sections, each of which has a sequence of steps. For example, a tutorial might provide a walkthrough of a code sample that illustrates a certain feature of Kubernetes. Tutorials can include surface-level explanations, but should link to related concept topics for deep explanations.</td>
  </tr>

  <tr>
    <td>Concept</td>
    <td>A concept page explains some aspect of Kubernetes. For example, a concept page might describe the Kubernetes Deployment object and explain the role it plays as an application is deployed, scaled, and updated. Typically, concept pages don't include sequences of steps, but instead provide links to tasks or tutorials.</td>
  </tr>

</table> 

Each page type has a
[template](/docs/contribute/page-templates/)
that you can use as you write your topic.
Using templates helps ensure consistency among topics of a given type.

### Choosing a title and filename

Choose a title that has the keywords you want search engines to find.
Create a filename that uses the words in your title separated by hyphens.
For example, the topic with title
[Using an HTTP Proxy to Access the Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api/)
has filename `http-proxy-access-api.md`. You don't need to put
"kubernetes" in the filename, because "kubernetes" is already in the
URL for the topic, for example:

       http://kubernetes.io/docs/tasks/access-kubernetes-api/http-proxy-access-api/

### Choosing a directory

Depending on your page type, put your new file in a subdirectory of one of these:

* /docs/tasks/
* /docs/tutorials/
* /docs/concepts/

You can put your file in an existing subdirectory, or you can create a new
subdirectory.

### Creating an entry in the table of contents

Depending page type, create an entry in one of these files:

* /_data/tasks.yaml
* /_data/tutorials.yaml
* /_data/concepts.yaml

{% endcapture %}

{% capture whatsnext %}
* Learn about [using page templates](/docs/contribute/page-templates/).
* Learn about [staging your changes](/docs/contribute/stage-documentation-changes).
* Learn about [creating a pull request](/docs/contribute/write-new-topic).
{% endcapture %}

{% include templates/task.md %}
