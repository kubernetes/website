---
title: Documentation Style Guide
---

{% capture overview %}
This page gives writing style guidelines for the Kubernetes documentation.
These are guidelines, not rules. Use your best judgment, and feel free to
propose changes to this document in a pull request.

For additional information on creating new content for the Kubernetes
docs, follow the instructions on
[using page templates](/docs/home/contribute/page-templates/) and
[creating a documentation pull request](/docs/home/contribute/create-pull-request/).
{% endcapture %}

{% capture body %}

**Note:** Kubernetes documentation uses [GitHub Flavored Markdown](https://github.github.com/gfm/) along with a few [local jekyll includes](/docs/home/contribute/includes/) to support glossary entries, tabs, and representing feature state.
{: .note}

## Language

Kubernetes documentation uses US English.

## Documentation formatting standards

### Use camel case for API objects

When you refer to an API object, use the same uppercase and lowercase letters
that are used in the actual object name. Typically, the names of API
objects use
[camel case](https://en.wikipedia.org/wiki/Camel_case).

Don't split the API object name into separate words. For example, use
PodTemplateList, not Pod Template List.

Refer to API objects without saying "object," unless omitting "object"
leads to an awkward construction.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>The Pod has two Containers.</td><td>The pod has two containers.</td></tr>
  <tr><td>The Deployment is responsible for ...</td><td>The Deployment object is responsible for ...</td></tr>
  <tr><td>A PodList is a list of Pods.</td><td>A Pod List is a list of pods.</td></tr>
  <tr><td>The two ContainerPorts ...</td><td>The two ContainerPort objects ...</td></tr>
  <tr><td>The two ContainerStateTerminated objects ...</td><td>The two ContainerStateTerminateds ...</td></tr>
</table>

### Use angle brackets for placeholders

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

### Use italics to define or introduce new terms

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>A <i>cluster</i> is a set of nodes ...</td><td>A "cluster" is a set of nodes ...</td></tr>
  <tr><td>These components form the <i>control plane.</i></td><td>These components form the <b>control plane.</b></td></tr>
</table>

### Use code style for filenames, directories, and paths

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Open the <code>envars.yaml</code> file.</td><td>Open the envars.yaml file.</td></tr>
  <tr><td>Go to the <code>/docs/tutorials</code> directory.</td><td>Go to the /docs/tutorials directory.</td></tr>
  <tr><td>Open the <code>/_data/concepts.yaml</code> file.</td><td>Open the /_data/concepts.yaml file.</td></tr>
</table>

### Use the international standard for punctuation inside quotes

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>events are recorded with an associated "stage".</td><td>events are recorded with an associated "stage."</td></tr>
  <tr><td>The copy is called a "fork".</td><td>The copy is called a "fork."</td></tr>
</table>

## Inline code formatting

### Use code style for inline code and commands

For inline code in an HTML document, use the `<code>` tag. In a Markdown
document, use the backtick (`).

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>The <code>kubectl run</code> command creates a Deployment.</td><td>The "kubectl run" command creates a Deployment.</td></tr>
  <tr><td>For declarative management, use <code>kubectl apply</code>.</td><td>For declarative management, use "kubectl apply".</td></tr>
</table>

### Use code style for object field names

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Set the value of the <code>replicas</code> field in the configuration file.</td><td>Set the value of the "replicas" field in the configuration file.</td></tr>
  <tr><td>The value of the <code>exec</code> field is an ExecAction object.</td><td>The value of the "exec" field is an ExecAction object.</td></tr>
</table>

### Use normal style for string and integer field values

For field values of type string or integer, use normal style without quotation marks.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Set the value of <code>imagePullPolicy</code> to Always.</td><td>Set the value of <code>imagePullPolicy</code> to "Always".</td></tr>
  <tr><td>Set the value of <code>image</code> to nginx:1.8.</td><td>Set the value of <code>image</code> to <code>nginx:1.8</code>.</td></tr>
  <tr><td>Set the value of the <code>replicas</code> field to 2.</td><td>Set the value of the <code>replicas</code> field to <code>2</code>.</td></tr>
</table>

## Code snippet formatting

### Don't include the command prompt

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>kubectl get pods</td><td>$ kubectl get pods</td></tr>
</table>

### Separate commands from output

Verify that the pod is running on your chosen node:

    kubectl get pods --output=wide

The output is similar to this:

    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0

### Versioning Kubernetes examples

Code examples and configuration examples that include version information should be consistent with the accompanying text. Identify the Kubernetes version in the **Before you begin** section.

To specify the Kubernetes version for a task or tutorial page:

- Include `min-kubernetes-server-version` in the front matter of the page.
- In the **Before you begin** section, use `{{ "{% include tasks-tutorial-prereqs.md "}} %}`.

If the example YAML is in a standalone file, find and review the topics that include it as a reference.
Verify that any topics using the standalone YAML have the appropriate version information defined.
If a stand-alone YAML file is not referenced from any topics, consider deleting it instead of updating it.

For example, if you are writing a tutorial that is relevant to Kubernetes version 1.8, the front-matter of your markdown file should look something like:

```yaml
---
title: <your tutorial title here>
min-kubernetes-server-version: v1.8
---
```

In code and configuration examples, do not include comments about alternative versions.
Be careful to not include incorrect statements in your examples as comments, such as:

```yaml
apiVersion: v1 # earlier versions use...
kind: Pod
...
```

## Kubernetes.io word list

A list of Kubernetes-specific terms and words to be used consistently across the site.

<table>
  <tr><th>Term</th><th>Usage</th></tr>
  <tr><td>Kubernetes</td><td>Kubernetes should always be capitalized.</td></tr>
  <tr><td>Docker</td><td>Docker should always be capitalized.</td></tr>
  <tr><td>SIG Docs</td><td>SIG Docs rather than SIG-DOCS or other variations.</td></tr>
</table>

## Callout Formatting
Callouts help create different rhetorical appeal levels. Our documentation supports three different callouts: **Note:** {: .note}, **Caution:** {: .caution}, and **Warning:** {: .warning}.

1. Start each callout with the appropriate prefix.

2. Use the following syntax to apply a style:

       **Note:** The prefix you use is the same text you use in the tag.
       {: .note} <!-- This tag must appear on a new line. -->

The output is:

**Note:** The prefix you choose is the same text for the tag.
{: .note}

### Note

Use {: .note} to highlight a tip or a piece of information that may be helpful to know.

For example:

    **Note:** You can _still_ use Markdown inside these callouts.
    {: .note}

The output is:

**Note:** You can _still_ use Markdown inside these callouts.
{: .note}

### Caution

Use {: .caution} to call attention to an important piece of information to avoid pitfalls.

For example:

    **Caution:** The callout style only applies to the line directly above the tag.
    {: .caution}

The output is:

**Caution:** The callout style only applies to the line directly above the tag.
{: .caution}

### Warning

Use {: .warning} to indicate danger or a piece of information that is crucial to follow.

For example:

    **Warning:** Beware.
    {: .warning}

The output is:

**Warning:** Beware.
{: .warning}

## Common Callout Issues

### Style Does Not Apply

Callout tags must be on a new line to apply the style. Github's Preview Changes feature further obfuscates this fact by rendering the tag on the same line, but your code must match the following syntax:

    **Note:** Your text goes here.
    {: .note} <!-- This tag must appear on a new line. -->

### Multiple Lines

Callouts automatically span multiple lines. However, you can use `<br/>` tags if you need to create multiple lines.

For example:

    **Note:"** This is my note. Use `<br/>` to create multiple lines. <br/> <br/> You can still use _Markdown_ to **format** text!
    {: .note}

The output is:

**Note:** This is my note. Use `<br/>` to create multiple lines. <br/> <br/> You can still use _Markdown_ to **format** text!
{: .note}

Typing multiple lines does **not** work. The callout style only applies to the line directly above the tag.

    **Note:** This is my note.

    I didn't read the style guide.
    {: .note}

**Note:** This is my note.

I didn't read the style guide.
{: .note}

### Ordered Lists

Callouts will interrupt numbered lists unless you indent three spaces before the notice and the tag.

For example:

    1. Preheat oven to 350˚F

    1. Prepare the batter, and pour into springform pan.

       **Note:** Grease the pan for best results.
       {: .note}

    1. Bake for 20-25 minutes or until set.

The output is:

1. Preheat oven to 350˚F

1. Prepare the batter, and pour into springform pan.

   **Note:** Grease the pan for best results.
   {: .note}

1. Bake for 20-25 minutes or until set.

## Content best practices

This section contains suggested best practices for clear, concise, and consistent content.

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

### Avoid Latin phrases

Prefer English terms over Latin abbreviations.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>For example, ...</td><td>e.g., ...</td></tr>
  <tr><td>That is, ...</td><td>i.e., ...</td></tr>
</table>

Exception: Use "etc." for et cetera.

## Patterns to avoid

### Avoid using "we"

Using "we" in a sentence can be confusing, because the reader might not know
whether they're part of the "we" you're describing.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Version 1.4 includes ...</td><td>In version 1.4, we have added ...</td></tr>
  <tr><td>Kubernetes provides a new feature for ...</td><td>We provide a new feature ...</td></tr>
  <tr><td>This page teaches you how to use pods.</td><td>In this page, we are going to learn about pods.</td></tr>
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

### Avoid statements that will soon be out of date

Avoid words like "currently" and "new." A feature that is new today might not be
considered new in a few months.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>In version 1.4, ...</td><td>In the current version, ...</td></tr>
    <tr><td>The Federation feature provides ...</td><td>The new Federation feature provides ...</td></tr>
</table>

{% endcapture %}

{% capture whatsnext %}

* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/)
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).

{% endcapture %}

{% include templates/concept.md %}
