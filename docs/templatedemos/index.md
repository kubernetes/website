---
---
<script>
$(function() {
    $( "#accordion" ).accordion();
});
</script>

# Before you Begin: Get the docs code checked out locally

Check out the kubernetes/kubernetes.github.io repo and the docsv2 branch.

## Step 1: Fork and Clone the repo
- Fork [kubernetes/kubernetes.github.io](https://github.com/kubernetes/kubernetes.github.io)
- [Setup your GitHub authentication using ssh](https://help.github.com/articles/generating-an-ssh-key/)
- Clone the repo under go/src/k8s.io

```sh
cd ~/go/src/k8s.io
git clone git@github.com:<you-github-repo>/kubernetes.github.io
cd kubernetes.github.io
git remote add upstream https://github.com/kubernetes/kubernetes.github.io.git
```

## Step 2: Move to the docsv2 branch

Docs v2 development is being performed in the docsv2 branch.  This is the branch
you want to be working from.

From ~/go/src/k8s.io/kubernetes.github.io

```shell
git checkout -b docsv2 # switch to the docsv2 branch
git fetch upstream # get the latest upstream changes
git reset --hard upstream/docsv2 # sync the branch to upstream
```

## Step 3: Make sure you can serve rendered docs locally from your dev box

- [Follow the editdocs instructions](http://kubernetes.io/editdocs/)

# Writing Docs Using Templates

<div id="accordion">
<h3>Concept Overviews</h3>
<div>{% capture instructions %}

A concept overview covers the most essential, important information about core
Kubernetes concepts and features.  Examples of Concepts include `Pod`,
`Deployment`, `Service`, etc.

### Example

- [Source Link](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/filledout.md)
- [Rendered Link](filledout/)

### Usage

To create a new concept overview page, create a new file under
`docs/your-concept-name/index.md`.

The file should start with the set of tags to apply to the concept and end
with an `include templates/concept-overview.md` block.

The file needs to have the following `capture` sections:

- concept
- when_to_use
- when_not_to_use
- status
- usage

```liquid{% raw %}
---
add
tags
here
e.g.
pod
---
{% capture concept %}
Name of the Concept goes here (e.g. Pod)
{% endcapture %}

{% capture what_is %}
1 sentence description of the Concept that describes the function it performs.
If needed:
- add
- clarifying
- bullet points

![Also add a diagram](/images/docs/file.svg){: style="max-width: 25%" }

{% comment %}
Include a comment indicating where an editable image exists:
https://drive.google.com/open?id=1pQe4-s76fqyrzB8f3xoJo4MPLNVoBlsE1tT9MyLNINg
{% endcomment %}
{% endcapture %}

{% capture when_to_use %}
Clarify precisely when and how to use this Concept.  Disambiguate when to use
this instead of similar concepts.  e.g. Secret vs ConfigMap,
Deployment vs Job vs other controllers, Service vs Ingress.

| Tables | Can Be |
|------------|----------------|
| Helpful | When |
| Comparing | Functionality |
| Across | Concepts |
{% endcapture %}

{% capture when_not_to_use %}
Call out common anti-patterns to be avoided.
{% endcapture %}

{% capture status %}
Describe how to get the current status of an instance in a cluster using kubectl

Use a table to clarify the response.

Consider status from kubectl describe as well.
{% endcapture %}

{% capture usage %}
If the concept interacts with or is embedded in other Concepts, clarify that here.
For Services this should call out the meaning of the label selectors, for Volumes
this should call out that they are defined within a Pod.

Include the example yaml here
{% endcapture %}

{% include templates/concept-overview.md %}
{% endraw %}```

### Adding page to navigation

Once your page is saved, somewhere in the `/docs/` directory, add a reference to the `concepts.yml` file under `/_data/` so that it will appear in the left-hand navigation of the site. This is also where you add a title to the page.

{% endcapture %}
{{ instructions | markdownify }}

</div>


<h3>Task</h3>
<div>{% capture instructions %}

A task page offers step-by-step instructions for completing a task with Kubernetes. **A task page should be narrowly focused on task completion and not delve into concepts or reference information.**

### Demos

- [Blank](blanktask/) ([Source](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/blanktask.md))
- [Filled Out](task/) ([Source](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/task.md))

### Usage

```liquid{% raw %}
---
---
{% capture purpose %}{% endcapture %}
{% capture recommended_background %}{% endcapture %}
{% capture step_by_step %}{% endcapture %}
{% include templates/task.md %}
{% endraw %}```

### Adding page to navigation

Once your page is saved, somewhere in the `/docs/` directory, add a reference to the `tasks.yml` file under `/_data/` so that it will appear in the left-hand navigation of the site. This is also where you add a title to the page.

{% endcapture %}
{{ instructions | markdownify }}

</div>

<h3>Landing Pages</h3>
<div>{% capture instructions %}

Landing pages are a set of clickable "cards" arranged in a grid. Each card has a heading and description, and optioninall, a thumbnail image. They are meant to be index pages that quickly forward users on to deeper content.

### Demos

- [Blank](blanklanding/) ([Source](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/blanklanding.md))
- [Filled Out](landingpage/) ([Source](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/landingpage.md))

### Usage

To use this template, create a new file with these contents. Essentially, you declare the cards you want by inserting the following YAML structure in the front-matter YAML section at the top of the page, and the body of the page just has the include statement.

```yaml
---
cards:
- progression: no #"yes" = display cards as linearly progressing
- card:
  title: Mean Stack
  image: /images/docs/meanstack/image_0.png
  description: Lorem ipsum dolor it verberum.
# repeat -card: items as necessary
---
{% raw %}{% include templates/landing-page.md %}{% endraw %}
```

### Adding page to navigation

Once your page is saved, somewhere in the `/docs/` directory, add a reference to the appropriate .yml file under `/_data/` so that it will appear in the left-hand navigation of the site. This is also where you add a title to the page.

{% endcapture %}
{{ instructions | markdownify }}

</div>


<h3>kubectl yaml</h3>
<div>{% capture instructions %}
You probably shouldn't be using this, but we also have templates which consume YAML files that are generated by the Kubernetes authors. These are turned into pages which display the reference information for the various CLI tools.

### Demos

- [Blank](blankkubectl/) ([Source](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/blankkubectl.md))
- [Filled Out](kubectl/) ([Source](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/kubectl.md))

### Adding page to navigation

Once your page is saved, somewhere in the `/docs/` directory, add a reference to the `concepts.yml` file under `/_data/` so that it will appear in the left-hand navigation of the site. This is also where you add a title to the page.

{% endcapture %}
{{ instructions | markdownify }}

</div>
</div>
