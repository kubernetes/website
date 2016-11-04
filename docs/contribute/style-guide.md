---
---

{% capture overview %}
This page gives writing style guidelines for the Kubernetes documentation.  These are guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

For additional information on creating new content for Kubernetes, follow the instructions on [using page template](/docs/contribute/page-templates/) and creating a [creating a documentation pull request](/docs/contribute/create-pull-request/).
{% endcapture %}

{% capture body %}

## Documentation best practices

### Use present tense

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>This command starts a proxy.</td><td>This command will start a proxy.</td></tr>
</table>

Exception: Use future or past tense if it is required to convey the correct
meaning.

### Use active voice

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>You can explore the API using a browser.</td><td>The API can be explored using a browser.</td></tr>
  <tr><td>The YAML file specifies the replica count.</td><td>The replica count is specified in the YAML file.</td></tr>
</table>

Exception: Use passive voice if active voice leads to an awkward construction.

### Use simple and direct language

Use simple and direct language. Avoid using unnecessary phrases, such as saying "please."

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>To create a ReplicaSet, ...</td><td>In order to create a ReplicaSet, ...</td></tr>
  <tr><td>See the configuration file.</td><td>Please see the configuration file.</td></tr>
  <tr><td>View the Pods.</td><td>With this next command, we'll view the Pods.</td></tr>

</table>

### Address the reader as "you"

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>You can create a Deployment by ...</td><td>We'll create a Deployment by ...</td></tr>
    <tr><td>In the preceding output, you can see...</td><td>In the preceding output, we can see ...</td></tr>
</table>


## Documentation anti-patterns

### Avoid using "we"

Using "we" in a sentence can get very confusing, because the reader often doesn't know if they're part of the "we" you're describing. In most instances, you want to avoid using "we". 

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Version 1.4 includes ...</td><td>In version 1.4, we have added ...</td></tr>
  <tr><td>Kubernetes provides a new feature for ...</td><td>We provide a new feature ...</td></tr>
  <tr><td>In this page, we are going to learn about pods.</td><td>This page will teach you how to use pods.</td></tr>
</table>

### Avoid jargon and idioms

Some readers speak English as a second language. Avoid jargon and idioms to help make their understanding easier.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Internally, ...</td><td>Under the hood, ...</td></tr>
    <tr><td>Create a new cluster.</td><td>Turn up a new cluster.</td></tr>
</table>

### Avoid statements about the future

Avoid making promises or giving hints about the future. If you need to talk about
an alpha feature, put the text under a heading that identifies it as alpha
information.

### Be careful how you talk about time

It's best to be explicit about time.  Avoid refering to features as "new" or using the word "currently". Content that mentions time in this way requires frequent updates.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>In version 1.4, ...</td><td>Currently, ...</td></tr>
  <tr><td>With Federation, ...</td><td>With the new Federation feature, ...</td></tr>
</table>

## Documentation standards

### Capitalize API objects

Capitalize the names of API objects. Refer to API objects without saying
"object."

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>The Pod has two Containers.</td><td>The pod has two containers.</td></tr>
  <tr><td>The Deployment is responsible for ...</td><td>The Deployment object is responsible for ...</td></tr>
</table>

### Use angle brackets placeholders 

Use angle brackets for placeholders. Tell the reader what a placeholder
represents.

1. Display information about a pod:

        kubectl describe pod <pod-name>

    where `<pod-name>` is the name of one of your pods.

### Use bold for user interface elements

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Click <b>Fork</b>.</td><td>Click "Fork".</td></tr>
  <tr><td>Select <b>Other</b>.</td><td>Select 'Other'.</td></tr>
</table>

### Use italics to define or introduce new term 

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>A <i>cluster</i> is a set of nodes ...</td><td>A "cluster" is a set of nodes ...</td></tr>
  <tr><td>These components form the <i>control plane.</i></td><td>These components form the <b>control plane.</b></td></tr>
</table>

### Use ??? style for filenames and paths

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>TODO</td><td>TODO</td></tr>
</table>

Use code style for inline code and commands.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Set the value of the <code>replicas</code> field in the configuration file.</td><td>Set the value of the "replicas" field in the configuration file.</td></tr>
  <tr><td>The <code>kubectl run</code> command creates a Deployment.</td><td>The "kubectl run" command creates a Deployment.</td></tr>
</table>

## Code snippet formatting

Don't include the command prompt.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>kubectl get pods</td><td>$ kubectl get pods</td></tr>
</table>

Separate commands from output.

1. Verify that the pod is running on your chosen node:

        kubectl get pods --output=wide

    The output is similar to this:

        NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
        nginx    1/1       Running   0          13s    10.200.0.4   worker0

### Configuration files

Put configuration files in the documentation repository near the topics that
use them. Use a `REPO` environment variable and a path to refer to a
configuration file.

1. Use the configuration file to create a pod that will get scheduled on your
   chosen node:

        export REPO=https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master
        kubectl create -f $REPO/docs/tasks/administer-cluster/pod.yaml

### Word list

* frontend: Use as an adjective.
* front end: Use as a noun.
* backend: Use as an adjective.
* back end: Use as a noun.

{% endcapture %}


{% capture whatsnext %}
* Learn about [writing a new topic](/docs/contribute/write-new-topic/).
* Learn about [using page templates](/docs/contribute/page-templates/).
* Learn about [staging your changes](/docs/contribute/stage-documentation-changes/)
* Learn about [creating a pull request](/docs/contribute/create-pull-request/).
{% endcapture %}

{% include templates/concept.md %}
