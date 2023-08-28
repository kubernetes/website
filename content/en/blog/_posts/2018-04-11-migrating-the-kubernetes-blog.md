---
title: 'Migrating the Kubernetes Blog'
author: zcorleissen
date: 2018-04-11
slug: migrating-the-kubernetes-blog
date: 2018-04-11
---

We recently migrated the Kubernetes Blog from the Blogger platform to GitHub. With the change in platform comes a change in URL: formerly at [http://blog.kubernetes.io](http://blog.kubernetes.io), the blog now resides at [https://kubernetes.io/blog](https://kubernetes.io/blog).

All existing posts redirect from their former URLs with `<rel=canonical>` tags, preserving SEO values.

### Why and how we migrated the blog

Our primary reasons for migrating were to streamline blog submissions and reviews, and to make the overall blog process faster and more transparent. Blogger's web interface made it difficult to provide drafts to multiple reviewers without also granting unnecessary access permissions and compromising security. GitHub's review process offered clear improvements.

We learned from [Jim Brikman](https://www.ybrikman.com)'s experience during [his own site migration](https://www.ybrikman.com/writing/2015/04/20/migrating-from-blogger-to-github-pages/) away from Blogger.

Our migration was broken into several pull requests, but you can see the work that went into the [primary migration PR](https://github.com/kubernetes/website/pull/7247).

We hope that making blog submissions more accessible will encourage greater community involvement in creating and reviewing blog content.

### How to Submit a Blog Post

You can submit a blog post for consideration one of two ways:

* Submit a Google Doc through the [blog submission form](https://docs.google.com/forms/d/e/1FAIpQLSch_phFYMTYlrTDuYziURP6nLMijoXx_f7sLABEU5gWBtxJHQ/viewform)
* Open a pull request against the [website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts) as described [here](/docs/home/contribute/create-pull-request/)

If you have a post that you want to remain confidential until your publish date, please submit your post via the Google form. Otherwise, you can choose your submission process based on your comfort level and preferred workflow.

{{< note >}}
Our workflow hasn't changed for confidential advance drafts. Additionally, we'll coordinate publishing for time sensitive posts to ensure that information isn't released prematurely through an open pull request.
{{< /note >}}

### Call for reviewers

The Kubernetes Blog needs more reviewers! If you're interested in contributing to the Kubernetes project and can participate on a regular, weekly basis, send an introductory email to [k8sblog@linuxfoundation.org](mailto:k8sblog@linuxfoundation.org).
