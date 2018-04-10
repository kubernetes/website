---
layout: blog
title: 'Migrating the Kubernetes blog'
date: '2018-04-10T22:20:00.000-07:00'
author: zcorleissen
---

We recently migrated the Kubernetes blog from the Blogger platform to GitHub. With the change in platform comes a change in URL: formerly at [http://blog.kubernetes.io](http://blog.kubernetes.io), the blog now resides at [https://kubernetes.io/blog](https://kubernetes.io/blog).

All existing posts redirect from their former URLs with `<rel=canonical>` tags, preserving SEO values.

### How and why we migrated the blog

Our primary reason for migrating was to make blog reviews easier, more streamlined, and more transparent. GitHub's pull request process makes it easier for multiple parties to collaborate on reviews. Blogger's web interface makes it difficult to open drafts to multiple reviewers without also granting access permissions and compromising security.

We learned from [Jim Brikman](https://www.ybrikman.com)'s experience during [his own site migration](https://www.ybrikman.com/writing/2015/04/20/migrating-from-blogger-to-github-pages/) away from Blogger. The migration itself was broken into several pull requests, but you can see the work that went into the [primary migration PR](https://github.com/kubernetes/website/pull/7247).

### How to Submit a Blog Post

You can submit a blog post for consideration one of two ways: 

* Submit a Google Doc through the [blog submission form](https://docs.google.com/forms/d/e/1FAIpQLSch_phFYMTYlrTDuYziURP6nLMijoXx_f7sLABEU5gWBtxJHQ/viewform) 
* Open a pull request against the [website repository](https://github.com/kubernetes/website/tree/master/blog) as described [here](/docs/home/contribute/create-pull-request/)

If you have a post that you want to remain confidential until your publish date, please submit your post via the Google form. Otherwise, you can choose your submission process based on your comfort level and preferred workflow.

**Note:** Our workflow hasn't changed for confidential advance drafts. Additionally, we'll coordinate publishing for time sensitive posts to ensure that information isn't released prematurely through an open pull request.
{: .note}
