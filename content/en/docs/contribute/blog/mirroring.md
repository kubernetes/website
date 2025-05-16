---
title: Blog article mirroring
slug: article-mirroring
content_type: concept
weight: 50
---

<!-- overview -->

There are two official Kubernetes blogs, and the CNCF has its own blog where you can cover Kubernetes too.
For the main Kubernetes blog, we (the Kubernetes project) like to publish articles with different perspectives and special focuses, that have a link to Kubernetes.

Some articles appear on both blogs: there is a primary version of the article, and
a _mirror article_ on the other blog.

This page describes the criteria for mirroring, the motivation for mirroring, and
explains what you should do to ensure that an article publishes to both blogs.

# {{% heading "prerequisites" %}}

Make sure you are familiar with the introduction sections of
[contributing to Kubernetes blogs](/docs/contribute/blog/), not just to learn about
the two official blogs and the differences between them, but also to get an overview
of the process.

<!-- content -->

## Why we mirror

Mirroring is nearly always from the contributor blog to the main blog. The project does this
for articles that are about the contributor community, or a part of it, but are also relevant
to the wider set of readers for Kubernetes' main blog.

As an author (or reviewer), consider the target audience and whether the blog post is appropriate for the [main blog](/docs/contribute/blog/#main-blog).
For example: if the target audience are Kubernetes contributors only, then the
[contributor blog](/docs/contribute/blog/#contributor-blog).
may be more appropriate;
if the blog post is about open source in general then it may be more suitable on another site outside the Kubernetes project.

This consideration about target audience applies to original and mirrored articles equally.

The Kubernetes project is willing to mirror any blog article that was published to https://kubernetes.dev/blog/
(the contributor blog), provided that all of the following criteria are met:

- the mirrored article has the same publication date as the original (it should have the same publication time too,
  but you can also set a time stamp up to 12 hours later for special cases)

- For PRs that add a mirrored article to the main blog *after* the original article has merged into the contributor blog, ensure that all of the following criteria are met:
    - No articles were published to the main blog after the original article was published to the contributor blog.
    - There are no main blog articles scheduled for publication between the publication time of the original article and the publication time of your mirrored article.
    
  This is because the Kubernetes project doesn't want to add articles to people's feeds, such as RSS, except at the very end of their feed.

- the original article doesn't contravene any strongly recommended review guidelines or community norms

- the mirrored article will have `canonicalUrl` set correctly in its
  [front matter](https://gohugo.io/content-management/front-matter/)

- the audience for the original article would find it relevant

- the article content is not off-topic for the target blog where the mirror article would
  appear


Mirroring from the main blog to the contributor blog is rare, but could feasibly happen.

## How to mirror

You make a PR against the other Git repository (usually,
[https://github.com/kubernetes/website](https://github.com/kubernetes/website)) that adds
the article. You do this _before_ the articles merge.

As the article author, you should set the canonical URL for the mirrored article, to the URL of the original article
(you can use a preview to predict the URL and fill this in ahead of actual publication). Use the `canonicalUrl`
field in [front matter](https://gohugo.io/content-management/front-matter/) for this.
