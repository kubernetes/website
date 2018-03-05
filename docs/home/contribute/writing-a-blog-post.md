---
title: Writing a Blog Post
reviewers:
- zacharysarah
- kbarnard10
- sarahkconway
---

{% capture overview %}
This page shows you how to submit a post for the [Kubernetes blog](https://kubernetes.io/blog).
{% endcapture %}

{% capture prerequisites %}
Create a fork of the Kubernetes documentation repository as described in
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).
{% endcapture %}

{% capture steps %}

## Add a new Markdown file

Add a new Markdown (`*.md`) to `/blog/_posts/`.

Name the file using the following format:
```
YYYY-MM-DD-Title.md
```
For example:
```
2015-03-20-Welcome-to-the-Kubernetes-Blog!.md
```

## Add front matter to the file

Add the following block to the top of the new file:
```
---
layout: blog
title: <title>
date:  <date>
---
```

For example:
```
---
layout: blog
title: Welcome to the Kubernetes Blog!
date:  Saturday, March 20, 2015
---
```

## Add content to the file

Write your post. Be sure to follow the [Kubernetes blog guidelines]().

## Add images

Add any image files the post contains to `/images/`. The preferred
image format is SVG.

{% endcapture %}

{% capture whatsnext %}
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/).
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
{% endcapture %}

{% include templates/task.md %}
