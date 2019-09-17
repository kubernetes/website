---
title: Documentation Style Guide
linktitle: Style guide
content_template: templates/concept
weight: 10
card:
  name: contribute
  weight: 20
  title: Documentation Style Guide
---

{{% capture overview %}}
This page gives writing style guidelines for the Kubernetes documentation.
These are guidelines, not rules. Use your best judgment, and feel free to
propose changes to this document in a pull request.

For additional information on creating new content for the Kubernetes
docs, follow the instructions on
[using page templates](/docs/contribute/style/page-templates/) and
[creating a documentation pull request](/docs/contribute/start/#improve-existing-content).
{{% /capture %}}

{{% capture body %}}

{{< note >}}
Kubernetes documentation uses [Blackfriday Markdown Renderer](https://github.com/russross/blackfriday) along with a few [Hugo Shortcodes](/docs/home/contribute/includes/) to support glossary entries, tabs,
and representing feature state.
{{< /note >}}

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
  <tr><td>The Pod has two containers.</td><td>The pod has two containers.</td></tr>
  <tr><td>The Deployment is responsible for ...</td><td>The Deployment object is responsible for ...</td></tr>
  <tr><td>A PodList is a list of Pods.</td><td>A Pod List is a list of pods.</td></tr>
  <tr><td>The two ContainerPorts ...</td><td>The two ContainerPort objects ...</td></tr>
  <tr><td>The two ContainerStateTerminated objects ...</td><td>The two ContainerStateTerminateds ...</td></tr>
</table>

### Use angle brackets for placeholders

Use angle brackets for placeholders. Tell the reader what a placeholder
represents.

1. Display information about a Pod:

        kubectl describe pod <pod-name>

    where `<pod-name>` is the name of one of your Pods.

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
  <tr><td>Open the <code>/_data/concepts.yaml</code><!--to-unbreak-atom-highlighting_--> file.</td><td>Open the /_data/concepts.yaml<!--to-unbreak-atom-highlighting_--> file.</td></tr>
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
  <tr><td>Enclose code samples with triple backticks. <code>(```)</code></td><td>Enclose code samples with any other syntax.</td></tr>
  <tr><td>Use single backticks to enclose inline code. For example, `var example = true`.</td><td>Use two asterisks (**) or an underscore (_) to enclose inline code. For example, **var example = true**.</td></tr><tr><td>Use triple backticks before and after a multi-line block of code for fenced code blocks.</td><td>Use multi-line blocks of code to create diagrams, flowcharts, or other illustrations.</td></tr><tr><td>Use meaningful variable names that have a context.</td><td>Use variable names such as 'foo','bar', and 'baz' that are not meaningful and lack context.</td></tr><tr><td>Remove trailing spaces in the code.</td><td>Add trailing spaces in the code, where these are important, because the screen reader will read out the spaces as well.</td></tr>
</table>

{{< note >}} 
The website supports syntax highlighting for code samples, but specifying a language is optional. Syntax highlighting in the code block should conform to the [contrast guidelines.](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0&showtechniques=141%2C143#contrast-minimum)
{{< /note >}}

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

Verify that the Pod is running on your chosen node:

    kubectl get pods --output=wide

The output is similar to this:

    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0

### Versioning Kubernetes examples

Code examples and configuration examples that include version information should be consistent with the accompanying text.

If the information is version specific, the Kubernetes version needs to be defined in the `prerequisites` section of the [Task template](/docs/contribute/style/page-templates/#task-template) or the [Tutorial template] (/docs/contribute/style/page-templates/#tutorial-template). Once the page is saved, the `prerequisites` section is shown as **Before you begin**.

To specify the Kubernetes version for a task or tutorial page, include `min-kubernetes-server-version` in the front matter of the page.

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
  <tr><td>On-premises</td><td>On-premises or On-prem rather than On-premise or other variations.</td></tr>
</table>

## Shortcodes

Hugo [Shortcodes](https://gohugo.io/content-management/shortcodes) help create different rhetorical appeal levels. Our documentation supports three different shortcodes in this category: **Note** {{</* note */>}}, **Caution** {{</* caution */>}}, and **Warning** {{</* warning */>}}.

1. Surround the text with an opening and closing shortcode.

2. Use the following syntax to apply a style:

    ```
    {{</* note */>}}
    No need to include a prefix; the shortcode automatically provides on (Note:, Caution:, etc.).
    {{</* /note */>}}
    ```

The output is:

{{< note >}}
The prefix you choose is the same text for the tag.
{{< /note >}}

### Note

Use {{</* note */>}} to highlight a tip or a piece of information that may be helpful to know.

For example:

```
{{</* note */>}}
You can _still_ use Markdown inside these callouts.
{{</* /note */>}}
```

The output is:

{{< note >}}
You can _still_ use Markdown inside these callouts.
{{< /note >}}

You can use a {{</* note */>}} in a list:

```
1. Use the note shortcode in a list

1. A second item with an embedded note

   {{</* note */>}}
   Warning, Caution, and Note shortcodes, embedded in lists, need to be indented four spaces. See [Common Shortcode Issues](#common-shortcode-issues).
   {{</* /note */>}}

1. A third item in a list

1. A fourth item in a list
```

The output is:

1. Use the note shortcode in a list

1. A second item with an embedded note

    {{< note >}}
    Warning, Caution, and Note shortcodes, embedded in lists, need to be indented four spaces. See [Common Shortcode Issues](#common-shortcode-issues).
    {{< /note >}}

1. A third item in a list

1. A fourth item in a list

### Caution

Use {{</* caution */>}} to call attention to an important piece of information to avoid pitfalls.

For example:

```
{{</* caution */>}}
The callout style only applies to the line directly above the tag.
{{</* /caution */>}}
```

The output is:

{{< caution >}}
The callout style only applies to the line directly above the tag.
{{< /caution >}}

### Warning

Use {{</* warning */>}} to indicate danger or a piece of information that is crucial to follow.

For example:

```
{{</* warning */>}}
Beware.
{{</* /warning */>}}
```

The output is:

{{< warning >}}
Beware.
{{< /warning >}}

### Katacoda Embedded Live Environment

This button lets users run Minikube in their browser using the [Katacoda Terminal](https://www.katacoda.com/embed/panel). 
It lowers the barrier of entry by allowing users to use Minikube with one click instead of going through the complete 
Minikube and Kubectl installation process locally.

The Embedded Live Environment is configured to run `minikube start` and lets users complete tutorials in the same window 
as the documentation.

{{< caution >}}
The session is limited to 15 minutes.
{{< /caution >}}

For example:

```
{{</* kat-button */>}}
```

The output is: 

{{< kat-button >}}

## Common Shortcode Issues

### Ordered Lists

Shortcodes will interrupt numbered lists unless you indent four spaces before the notice and the tag.

For example:

    1. Preheat oven to 350˚F

    1. Prepare the batter, and pour into springform pan.
       {{</* note */>}}Grease the pan for best results.{{</* /note */>}}

    1. Bake for 20-25 minutes or until set.

The output is:

1. Preheat oven to 350˚F

1. Prepare the batter, and pour into springform pan.

    {{< note >}}Grease the pan for best results.{{< /note >}}

1. Bake for 20-25 minutes or until set.

### Include Statements

Shortcodes inside include statements will break the build. You must insert them in the parent document, before and after you call the include. For example:

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```


## Markdown elements

### Line breaks
Use a single newline to separate block-level content like headings, lists, images, code blocks, and others. The exception is second-level headings, where it should be two newlines. Second-level headings follow the first-level (or the title) without any preceding paragraphs or texts. A two line spacing helps visualize the overall structure of content in a code editor better.

### Headings
People accessing this documentation may use a screen reader or other assistive technology (AT). [Screen readers](https://en.wikipedia.org/wiki/Screen_reader) are linear output devices, they output items on a page one at a time. If there is a lot of content on a page, you can use headings to give the page an internal structure. A good page structure helps all readers to easily navigate the page or filter topics of interest.

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Update the title in the front matter of the page or blog post.</td><td>Use first level heading, as Hugo automatically converts the title in the front matter of the page into a first-level heading.</td></tr><tr><td>Use ordered headings to provide a meaningful high-level outline of your content.</td><td>Use headings level 4 through 6, unless it is absolutely necessary. If your content is that detailed, it may need to be broken into separate articles.</td>
  <tr><td>Use pound or hash signs (#) for non-blog post content.</td><td> Use underlines (--- or ===) to designate first-level headings.</td></tr> 
  <tr><td>Use sentence case for headings. For example, <b>Extend kubectl with plugins</b></td><td>Use title case for headings. For example, <b>Extend Kubectl With Plugins</b></td></tr>  
</table>

### Paragraphs

<table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Try to keep paragraphs under 6 sentences.</td><td>Indent the first paragraph with space characters. For example, ⋅⋅⋅Three spaces before a paragraph will indent it.</td></tr>
  <tr><td>Use three hyphens (---) to create a horizontal rule. Use horizontal rules for breaks in paragraph content. For example, a change of scene in a story, or a shift of topic within a section.</td><td>Use horizontal rules for decoration.</td></tr>
</table>

### Links
 <table>
  <tr><th>Do</th><th>Don't</th></tr>
  <tr><td>Write hyperlinks that give you context for the content they link to. For example: Certain ports are open on your machines. See <a href="#check-required-ports">Check required ports</a> for more details.</td><td>Use ambiguous terms such as “click here”. For example: Certain ports are open on your machines. See <a href="#check-required-ports">here</a> for more details.</td></tr> <tr><td>Write Markdown-style links &lpar;&lsqb;link text&rsqb;&lpar;URL&rpar;&rpar;. For example, <code>&lsqb;Hugo shortcodes&rsqb;&lpar;/docs/contribute/style/hugo-shortcodes/#table-captions&rpar;</code> and the output is <a href="/docs/contribute/style/hugo-shortcodes/#table-captions">Hugo shortcodes.</td><td>Write HTML-style links <code>&lpar;&lt;link href="/media/examples/link-element-example.css" target="_blank"&gt;Visit our tutorial!&rpar;</code> or create links that open in new tabs or windows. For example, <code>&lsqb;example website&rsqb;&lpar;https://example.com&rpar;{target="_blank"}</code></td></tr>
</table>

### Lists
Group items in a list that are related to each other and need to appear in a specific order or to indicate a correlation between multiple items. When a screen reader comes across a list—whether it is an ordered or unordered list—it will be announced to the user that there is a group of list items. The user can then use the arrow keys to move up and down between the various items in the list.
Website navigation links can also be marked up as list items; after all they are nothing but a group of related links.

 - End each item in a list with a period if one or more items in the list are complete sentences. For the sake of consistency, normally either all items or none should be complete sentences.
 
   {{< note >}} Ordered lists that are part of an incomplete introductory sentence can be in lowercase and punctuated as if each item was a part of the introductory sentence.{{< /note >}}
   
 - Use the number one (1.) for ordered lists.
 
 - Use (+), (* ), or (-) for unordered lists.
 
 - Leave a blank line after each list. 
 
 - Indent nested lists with four spaces (for example, ⋅⋅⋅⋅). 
 
 - List items may consist of multiple paragraphs. Each subsequent paragraph in a list item must be indented by either four spaces or one tab.

### Tables

The semantic purpose of a data table is to present tabular data. Sighted users can quickly scan the table but a screen reader goes through line by line. A table caption is used to create a descriptive title for a data table. Assistive technologies (AT) use the HTML table caption element to identify the table contents to the user within the page structure.

- Add table captions using [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/#table-captions) for tables.

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
  <tr><td>This page teaches you how to use Pods.</td><td>In this page, we are going to learn about Pods.</td></tr>
</table>

### Avoid jargon and idioms

Some readers speak English as a second language. Avoid jargon and idioms to help them understand better.

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

{{% /capture %}}

{{% capture whatsnext %}}

* Learn about [writing a new topic](/docs/contribute/style/write-new-topic/).
* Learn about [using page templates](/docs/contribute/style/page-templates/).
* Learn about [staging your changes](/docs/contribute/stage-documentation-changes/)
* Learn about [creating a pull request](/docs/contribute/start/#submit-a-pull-request/).

{{% /capture %}}
