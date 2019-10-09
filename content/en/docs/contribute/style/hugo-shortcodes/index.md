---
approvers:
- chenopis
title: Custom Hugo Shortcodes
content_template: templates/concept
---

{{% capture overview %}}
This page explains the custom Hugo shortcodes that can be used in Kubernetes markdown documentation.

Read more about shortcodes in the [Hugo documentation](https://gohugo.io/content-management/shortcodes).
{{% /capture %}}

{{% capture body %}}

## Feature state

In a markdown page (`.md` file) on this site, you can add a shortcode to display version and state of the documented feature.

### Feature state demo

Below is a demo of the feature state snippet, which displays the feature as stable in Kubernetes version 1.10.

```
{{</* feature-state for_k8s_version="v1.10" state="stable" */>}}
```

Renders to:

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

The valid values for `state` are:

* alpha
* beta
* deprecated
* stable

### Feature state code

The displayed Kubernetes version defaults to that of the page or the site. This can be changed by passing the <code>for_k8s_version</code> shortcode parameter.

```
{{</* feature-state for_k8s_version="v1.10" state="stable" */>}}
```

Renders to:

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

#### Alpha feature

```
{{</* feature-state state="alpha" */>}}
```

Renders to:

{{< feature-state state="alpha" >}}

#### Beta feature

```
{{</* feature-state state="beta" */>}}
```

Renders to:

{{< feature-state state="beta" >}}

#### Stable feature

```
{{</* feature-state state="stable" */>}}
```

Renders to:

{{< feature-state state="stable" >}}

#### Deprecated feature

```
{{</* feature-state state="deprecated" */>}}
```

Renders to:

{{< feature-state state="deprecated" >}}

## Glossary

You can reference glossary terms with an inclusion that automatically updates and replaces content with the relevant links from [our glossary](/docs/reference/glossary/). When the term is moused-over by someone
using the online documentation, the glossary entry displays a tooltip.

The raw data for glossary terms is stored at [https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary), with a content file for each glossary term.

### Glossary Demo

For example, the following include within the markdown renders to {{< glossary_tooltip text="cluster" term_id="cluster" >}} with a tooltip:

```liquid
{{</* glossary_tooltip text="cluster" term_id="cluster" */>}}
```

## Table captions

You can make tables more accessible to screen readers by adding a table caption. To add a [caption](https://www.w3schools.com/tags/tag_caption.asp) to a table, enclose the table with a `table` shortcode and specify the caption with the `caption` parameter.

{{< note >}}
Table captions are visible to screen readers but invisible when viewed in standard HTML.
{{< /note >}}

Here's an example:

```go-html-template
{{</* table caption="Configuration parameters" >}}
Parameter | Description | Default
:---------|:------------|:-------
`timeout` | The timeout for requests | `30s`
`logLevel` | The log level for log output | `INFO`
{{< /table */>}}
```

The rendered table looks like this:

{{< table caption="Configuration parameters" >}}
Parameter | Description | Default
:---------|:------------|:-------
`timeout` | The timeout for requests | `30s`
`logLevel` | The log level for log output | `INFO`
{{< /table >}}

If you inspect the HTML for the table, you should see this element immediately after the opening `<table>` element:

```html
<caption style="display: none;">Configuration parameters</caption>
```

## Tabs

In a markdown page (`.md` file) on this site, you can add a tab set to display multiple flavors of a given solution.

The `tabs` shortcode takes these parameters:

* `name`: The name as shown on the tab.
* `codelang`: If you provide inner content to the `tab` shortcode, you can tell Hugo what code language to use for highlighting.
* `include`: The file to include in the tab. If the tab lives in a Hugo [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles), the file -- which can be any MIME type supported by Hugo -- is looked up in the bundle itself. If not, the content page that needs to be included is looked up relative to the current page. Note that with the `include`, you do not have any shortcode inner content and must use the self-closing syntax. For example, <code>{{</* tab name="Content File #1" include="example1" /*/>}}</code>. The language needs to be specified under `codelang` or the language is taken based on the file name. Non-content files are code-highlighted by default.
* If your inner content is markdown, you must use the `%`-delimiter to surround the tab. For example, `{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`
* You can combine the variations mentioned above inside a tab set.

Below is a demo of the tabs shortcode.

{{< note >}}
The tab **name** in a `tabs` definition must be unique within a content page.
{{< /note >}}

### Tabs demo: Code highlighting

```go-text-template
{{</* tabs name="tab_with_code" >}}
{{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}}
{{< /tabs */>}}
```

Renders to:

{{< tabs name="tab_with_code" >}}
{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}
{{< /tabs >}}

### Tabs demo: Inline Markdown and HTML

```go-html-template
{{</* tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
This is **some markdown.**
{{< note >}}
It can even contain shortcodes.
{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>Plain HTML</h3>
	<p>This is some <i>plain</i> HTML.</p>
</div>
{{< /tab >}}
{{< /tabs */>}}
```

Renders to:

{{< tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
This is **some markdown.**

{{< note >}}
It can even contain shortcodes.
{{< /note >}}

{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>Plain HTML</h3>
	<p>This is some <i>plain</i> HTML.</p>
</div>
{{< /tab >}}
{{< /tabs >}}

### Tabs demo: File include

```go-text-template
{{</* tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs */>}}
```

Renders to:

{{< tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs >}}

{{% /capture %}}

{{% capture whatsnext %}}
* Learn about [Hugo](https://gohugo.io/).
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/)
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
{{% /capture %}}