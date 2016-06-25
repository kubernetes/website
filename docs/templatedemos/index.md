---
---
<script>
$(function() {
    $( "#accordion" ).accordion();
});
</script>

# Before you Begin: Get the docs code checked out locally

Check out the kubernetes/kubernetes.github.io repo and the docsv2 branch.

### Step 1: Fork and Clone the repo
- Fork [kubernetes/kubernetes.github.io](https://github.com/kubernetes/kubernetes.github.io)
- [Setup your GitHub authentication using ssh](https://help.github.com/articles/generating-an-ssh-key/)
- Clone the repo under ~/go/src/k8s.io

```shell
cd ~/go/src/k8s.io
git clone git@github.com:<you-github-repo>/kubernetes.github.io
cd kubernetes.github.io
git remote add upstream https://github.com/kubernetes/kubernetes.github.io.git
```

### Step 2: Switch to the docsv2 branch
Docs v2 development is being performed in the `docsv2` branch.  This is the branch
you want to be working from.

From ~/go/src/k8s.io/kubernetes.github.io:

```shell
git checkout -b docsv2
git fetch upstream
git reset --hard upstream/docsv2
```

### Step 3: Make sure you can serve rendered docs locally from your dev box

- [Follow the editdocs instructions](http://kubernetes.io/editdocs/)

# Writing Docs Using Templates

## Types of Templates
- Concept Template
  - Introduce K8s Api Objects e.g. Pod
- Task Template
  - Step-by-step guide for "Doing X".  
  - Useful for breaking down various ways of configuring Concepts into sub-topics
- Landing Pages Template
  - Collection of click-able cards on a grid
  - Useful for directing users to actual content from a visual Table of Contents

# Concept Overview Template Details
<div>{% capture instructions %}

A concept overview covers the most essential, important information about core
Kubernetes concepts and features.  Examples of Concepts include `Pod`,
`Deployment`, `Service`, etc.

## Reference Examples

- [Link to Example Template](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/filledout.md)
- [Link to Rendered Template](filledout/)

## Usage

### Creating the file

To create a new concept overview page, create a new directory with the concept
name under the docs directory and an index.md file.
e.g. `docs/your-concept-name/index.md`.

### Adding the Template sections

- tags
- concept: the concept name e.g. Pod
- what_is: one sentence description the function / role  of the concept.  Diagrams are helpful.
- when_to_use: disambiguate when to use this vs alternatives
- when_not_to_use: highlight common anti-patterns
- status: how to get the status for this object using kubectl
- usage: example yaml
- template: include the template at the end

```liquid{% raw %}
---
objects:
- list_of_concepts
- fields_and_tools
- that_are_the_focus
concepts:
- list_of_concepts: 10
- fields_and_tools: 20
- that_are_used: 30
- with_a_sort_order: 15
advanced: false
---
{% capture concept %} concept-name-here {% endcapture %}
{% capture what_is %} description-of-concept-here {% endcapture %}
{% capture when_to_use %} when-to-user-here {% endcapture %}
{% capture when_not_to_use %} anti-patterns-here {% endcapture %}
{% capture status %} how-to-get-with-kubectl-here {% endcapture %}
{% capture usage %} yaml-config-usage-here {% endcapture %}
{% include templates/concept-overview.md %}
{% endraw %}```

### Adding the page to navigation

Once your page is saved, somewhere in the `/docs/` directory, add a reference to the `concepts.yml` file under `/_data/` so that it will appear in the left-hand navigation of the site. This is also where you add a title to the page.

{% endcapture %}
{{ instructions | markdownify }}

</div>

# Task Template Details
<div>{% capture instructions %}

A task page offers step-by-step instructions for completing a task with Kubernetes. **A task page should be narrowly focused on task completion and not delve into concepts or reference information.**

## Example
- [Link to Example Template](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/task.md)
- [Link to Rendered Page](task/)

### Usage

## Creating the file

To create a new task page, create a file under docs/tasks/task-name.
e.g. `docs/tasks/your-task-name`.

### Adding the Template sections

- metadata: structured description of the doc content
- purpose: one sentence description of the task and motivation
- recommended_background: List of Concepts referenced or other Tasks, Tutorials that provide needed context
- set_by_step: Add multiple sections.  1 per step in the task.
- template: include the template at the end

```liquid{% raw %}
---
synopsis: "one sentence description of task."
objects:
- list_of_concepts
- fields_and_tools
- that_are_the_focus
concepts:
- list_of_concepts: 10
- fields_and_tools: 20
- that_are_used: 30
- with_a_sort_order: 15
advanced: false
---
{% capture purpose %} task-description-here {% endcapture %}
{% capture recommended_background %} prereq-reading-here {% endcapture %}
{% capture step_by_step %} single-step-here {% endcapture %}
{% include templates/task.md %}
{% endraw %}```

### Adding the page to navigation

Add a reference to the `tasks.yml` file under `/_data/` so that it will appear in the left-hand navigation of the site. This is also where you add a title to the page.

{% endcapture %}
{{ instructions | markdownify }}

</div>

# Landing Pages
<div>{% capture instructions %}

Landing pages are a set of clickable "cards" arranged in a grid. Each card has a heading and description, and optioninall, a thumbnail image. They are meant to be index pages that quickly forward users on to deeper content.

### Demos

- [Link to Example Landing Page](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/landingpage.md)
- [Link to Rendered Landing Page](landingpage/)

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


# kubectl yaml
<div>{% capture instructions %}
You probably shouldn't be using this, but we also have templates which consume YAML files that are generated by the Kubernetes authors. These are turned into pages which display the reference information for the various CLI tools.

### Demos

- [Link to Example Template](https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master/docs/templatedemos/kubectl.md)
- [Link to Rendered Template](kubectl/)

### Adding page to navigation

Once your page is saved, somewhere in the `/docs/` directory, add a reference to the `concepts.yml` file under `/_data/` so that it will appear in the left-hand navigation of the site. This is also where you add a title to the page.

{% endcapture %}
{{ instructions | markdownify }}

</div>
</div>
