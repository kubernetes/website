---
title: Writing a New Topic
content_template: templates/task
---

{{% capture overview %}}
This page shows how to create a new topic for the Kubernetes docs.
{{% /capture %}}

{{% capture prerequisites %}}
Create a fork of the Kubernetes documentation repository as described in
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).
{{% /capture %}}

{{% capture steps %}}

## Choosing a page type

As you prepare to write a new topic, think about which of these page types
is the best fit for your content:

<table>

  <tr>
    <td>Task</td>
    <td>A task page shows how to do a single thing. The idea is to give readers a sequence of steps that they can actually do as they read the page. A task page can be short or long, provided it stays focused on one area. In a task page, it is OK to blend brief explanations with the steps to be performed, but if you need to provide a lengthy explanation, you should do that in a concept topic. Related task and concept topics should link to each other. For an example of a short task page, see <a href="/docs/tasks/configure-pod-container/configure-volume-storage/">Configure a Pod to Use a Volume for Storage</a>. For an example of a longer task page, see <a href="/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/">Configure Liveness and Readiness Probes</a></td>
  </tr>

  <tr>
    <td>Tutorial</td>
    <td>A tutorial page shows how to accomplish a goal that ties together several Kubernetes features. A tutorial might provide several sequences of steps that readers can actually do as they read the page. Or it might provide explanations of related pieces of code. For example, a tutorial could provide a walkthrough of a code sample. A tutorial can include brief explanations of the Kubernetes features that are being tied together, but should link to related concept topics for deep explanations of individual features.</td>
  </tr>

  <tr>
    <td>Concept</td>
    <td>A concept page explains some aspect of Kubernetes. For example, a concept page might describe the Kubernetes Deployment object and explain the role it plays as an application is deployed, scaled, and updated. Typically, concept pages don't include sequences of steps, but instead provide links to tasks or tutorials. For an example of a concept topic, see <a href="/docs/concepts/architecture/nodes/">Nodes</a>.</td>
  </tr>

</table>

Each page type has a
[template](/docs/home/contribute/page-templates/)
that you can use as you write your topic.
Using templates helps ensure consistency among topics of a given type.

## Choosing a title and filename

Choose a title that has the keywords you want search engines to find.
Create a filename that uses the words in your title separated by hyphens.
For example, the topic with title
[Using an HTTP Proxy to Access the Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api/)
has filename `http-proxy-access-api.md`. You don't need to put
"kubernetes" in the filename, because "kubernetes" is already in the
URL for the topic, for example:

       http://kubernetes.io/docs/tasks/access-kubernetes-api/http-proxy-access-api/

## Adding the topic title to the front matter

In your topic, put a `title` field in the
[front matter](https://jekyllrb.com/docs/frontmatter/).
The front matter is the YAML block that is between the
triple-dashed lines at the top of the page. Here's an example:

    ---
    title: Using an HTTP Proxy to Access the Kubernetes API
    ---

## Choosing a directory

Depending on your page type, put your new file in a subdirectory of one of these:

* /docs/tasks/
* /docs/tutorials/
* /docs/concepts/

You can put your file in an existing subdirectory, or you can create a new
subdirectory.

## Creating an entry in the table of contents

Depending page type, create an entry in one of these files:

* /_data/tasks.yaml
* /_data/tutorials.yaml
* /_data/concepts.yaml

Here's an example of an entry in /_data/tasks.yaml:

    - docs/tasks/configure-pod-container/configure-volume-storage.md

## Embedding code in your topic

If you want to include some code in your topic, you can embed the code in your
file directly using the markdown code block syntax. This is recommended for the
following cases (not an exhaustive list):

- The code is showing the output from a command such as
  `kubectl get deploy mydeployment -o json | jq '.status'`.
- The code is not generic enough for users to try out. As an example, the YAML
  file for creating a Pod which depends on a specific
  [FlexVolume](/docs/concepts/storage/volumes#flexvolume) implementation can be
  directly embedded into the topic when appropriate.
- The code is an incomplete example because its purpose is to highlight a
  portion of an otherwise large file. For example, when describing ways to
  customize the [PodSecurityPolicy](/docs/tasks/administer-cluster/sysctl-cluster/#podsecuritypolicy)
  for some reasons, you may provide a short snippet directly in your topic file.
- The code is not meant for users to try out due to other reasons. For example,
  when describing how a new attribute should be added to a resource using the
  `kubectl edit` command, you may provide a short example that includes only
  the attribute to add.

## Including code from another file

Another way to include code in your topic is to create a new, complete sample
file (or a group of sample files) and then reference the sample(s) from your
topic. This is the preferred way of including sample YAML files when the sample
is generic, reusable, and you want the readers to try it out by themselves.

When adding a new standalone sample file (e.g. a YAML file), place the code in
one of the `<LANG>/examples/` subdirectories where `<LANG>` is the language for
the topic. In your topic file, use the `codenew` shortcode:

<pre>&#123;&#123;&lt; codenew file="&lt;RELPATH&gt;/my-example-yaml&gt;" &gt;&#125;&#125;</pre>

where `<RELPATH>` is the path to the file you're including, relative to the
`examples` directory. For example, the following short code references a YAML
file located at `content/en/examples/pods/storage/gce-volume.yaml`.

<pre>&#123;&#123;&lt; codenew file="pods/storage/gce-volume.yaml" &gt;&#125;&#125;</pre>

## Showing how to create an API object from a configuration file

If you need to show the reader how to create an API object based on a
configuration file, place the configuration file in one of the subdirectories
under `<LANG>/examples`.

In your topic, show this command:

```
kubectl create -f https://k8s.io/examples/pods/storage/gce-volume.yaml
```

{{< note >}}
**NOTE**: When adding new YAML files to the `<LANG>/examples` directory, make
sure the file is also included into the `<LANG>/examples_test.go` file. The
Travis CI for the Website automatically runs this test case when PRs are
submitted to ensure all examples pass the tests.
{{< /note >}}

For an example of a topic that uses this technique, see
[Running a Single-Instance Stateful Application](/docs/tutorials/stateful-application/run-stateful-application/).

## Adding images to a topic

Put image files in the `/images` directory. The preferred
image format is SVG.

{{% /capture %}}

{{% capture whatsnext %}}
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/).
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
{{% /capture %}}


