---
title: Writing a Blog Post
reviewers:
- zacharysarah
- kbarnard10
- sarahkconway
---

{% capture overview %}
This page shows you how to submit a post for the [Kubernetes blog](https://kubernetes.io/blog).

You’ll receive a response within 5 business days on whether your submission is approved and information about next steps, if any.
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
2015-03-20-Welcome-to-the-Kubernetes-Blog.md
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

## Create a new pull request (PR)

When you [create a new pull request](/docs/home/contribute/create-pull-request/), include the following in the PR description:

- Desired publishing date
**Note:** PRs must include complete drafts no later than 15 days prior to the desired publication date.
{: .note}
- Author information:
  - Name
  - Title
  - Company
  - Contact email

## Add content to the file

Write your post using the following guidelines.

### Kubernetes blog guidelines

All content must be original. The Kubernetes blog does not post material previously published elsewhere.

Suitable Content (with examples):

- User case studies (Yahoo Japan, Bitmovin)
- New Kubernetes capabilities (5-days-of-k8s)
- Kubernetes projects updates (kompose)
- Updates from Special Interest Groups (SIG-OpenStack)
- Tutorials and walkthroughs (PostgreSQL w/ StatefulSets)
- Thought leadership around Kubernetes (CaaS, the foundation for next generation PaaS)
- Kubernetes Partner OSS integration (Fission)

Unsuitable Content:

- Vendor product pitches
- Partner updates without an integration and customer story
- Syndicated posts (language translations are permitted)

## Add images

Add any image files the post contains to `/images/blog/`.

### Image format

The preferred image format is SVG.

### Naming image files

Add the proposed date of your blog post to the title of any image files the post contains:
```
YYYY-MM-DD-image.svg
```
For example:
```
2018-03-01-cncf-color.svg
```

### Including images

Please use [reference-style image links][ref-style] to keep posts readable.

Here's an example of how to include an image in a blog post:

```
Check out the ![CNCF logo][cncf-logo].

[cncf-logo]: /images/blog/2018-03-01-cncf-color.svg
```

{% endcapture %}

{% include templates/task.md %}

[ref-style]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#images
