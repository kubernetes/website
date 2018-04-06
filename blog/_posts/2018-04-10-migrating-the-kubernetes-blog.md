---
layout: blog
title: 'Migrating the Kubernetes blog'
date: '2018-04-10T22:20:00.000-07:00'
author: zcorleissen
---

We recently migrated the Kubernetes blog from the Blogger platform to GitHub. With the change in platform comes a change in URL: formerly at http://blog.kubernetes.io, the blog now resides at https://kubernetes.io/blog.

All existing posts redirect from their former URLs with `<rel=canonical>` tags, preserving SEO values.

### How and why we migrated the blog

We learned from [Jim Brikman](https://www.ybrikman.com)'s experience during [his own site migration](https://www.ybrikman.com/writing/2015/04/20/migrating-from-blogger-to-github-pages/) away from Blogger.

Our primary reason for migrating was to make collaboration easier. Content reviews at CNCF are highly collaborative, and Blogger's web interface and security setup makes it difficult to collaborate on drafts without also granting access permissions.



Things to know

* You can still work privately with CNCF to create and review advance drafts of blog posts.
