---
title: Writing a Blog Post
reviewers:
- zacharysarah
- kbarnard10
- sarahkconway
content_template: templates/task
---

{{% capture overview %}}
This page shows you how to submit a post for the [Kubernetes Blog](https://kubernetes.io/blog).

You’ll receive a response within 5 business days on whether your submission is approved and information about next steps, if any.
{{% /capture %}}

{{% capture prerequisites %}}
To create a new blog post, you can either:

- Fill out the [Kubernetes Blog Submission](https://docs.google.com/forms/d/e/1FAIpQLSch_phFYMTYlrTDuYziURP6nLMijoXx_f7sLABEU5gWBtxJHQ/viewform) form.

or:

- Open a pull request against this repository as described in
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/)
{{% /capture %}}

{{% capture steps %}}
## Kubernetes Blog guidelines

All content must be original. The Kubernetes Blog does not post material previously published elsewhere.

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

## Create a blog post with a form

Open the [Kubernetes Blog Submission](https://docs.google.com/forms/d/e/1FAIpQLSch_phFYMTYlrTDuYziURP6nLMijoXx_f7sLABEU5gWBtxJHQ/viewform) form, fill it out, and click Submit.

## Create a post by opening a pull request

### Add a new Markdown file

Add a new Markdown (`*.md`) to `/blog/_posts/`.

Name the file using the following format:
```
YYYY-MM-DD-Title.md
```
For example:
```
2015-03-20-Welcome-to-the-Kubernetes-Blog.md
```

### Add front matter to the file

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

### Create a new pull request (PR)

When you [create a new pull request](/docs/home/contribute/create-pull-request/), include the following in the PR description:

{{< note >}}
- Desired publishing date
**Note:** PRs must include complete drafts no later than 15 days prior to the desired publication date.
{{< /note >}}
- Author information:
  - Name
  - Title
  - Company
  - Contact email

### Add content to the file

Write your post using the following guidelines.

### Add images

Add any image files the post contains to `/static/images/blog/`.

The preferred image format is SVG.

Add the proposed date of your blog post to the title of any image files the post contains:
```
YYYY-MM-DD-image.svg
```
For example:
```
2018-03-01-cncf-color.svg
```

Please use [reference-style image links][ref-style] to keep posts readable.

Here's an example of how to include an image in a blog post:

```
Check out the ![CNCF logo][cncf-logo].

[cncf-logo]: /images/blog/2018-03-01-cncf-color.svg
```

{{% /capture %}}



[ref-style]: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#images
