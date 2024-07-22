---
title: 'Docs are Migrating from Jekyll to Hugo'
date: 2018-05-05
author: zcorleissen
slug: hugo-migration
author: >
  [Zach Corleissen](https://www.cncf.io/people/staff/) (CNCF) 
---

## Changing the site framework

After nearly a year of investigating how to enable multilingual support for Kubernetes docs, we've decided to migrate the site's static generator from Jekyll to [Hugo](https://gohugo.io/).

What does the Hugo migration mean for users and contributors?

### Things will break

Hugo's Markdown parser is [differently strict than Jekyll's](https://gohugo.io/getting-started/configuration/#configure-blackfriday). As a consequence, some Markdown formatting that rendered fine in Jekyll now produces some unexpected results: [strange left nav ordering](https://github.com/kubernetes/website/issues/8258), [vanishing tutorials](https://github.com/kubernetes/website/issues/8247), and [broken links](https://github.com/kubernetes/website/issues/8246), among others.

If you encounter any site weirdness or broken formatting, please [open an issue](https://github.com/kubernetes/website/issues/new). You can see the list of issues that are [specific to Hugo migration](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+Hugo+label%3A%22Needs+Docs+Review%22).

### Multilingual support is coming

Our initial search focused on finding a language selector that would play well with Jekyll. The projects we found weren't well-supported, and a prototype of one plugin made it clear that a Jekyll implementation would create technical debt that drained resources away from the quality of the docs.

We chose Hugo after months of research and conversations with other open source translation projects. (Special thanks to [Andreas Jaeger](https://twitter.com/jaegerandi?lang=da) and his experience at OpenStack). Hugo's [multilingual support](https://gohugo.io/content-management/multilingual/) is built in and easy.

### Pain now, relief later

Another advantage of Hugo is that [build performance](https://gohugo.io/troubleshooting/build-performance/) scales well at size. At 250+ pages, the Kubernetes site's build times suffered significantly with Jekyll. We're excited about removing the barrier to contribution created by slow site build times.

Again, if you encounter any broken, missing, or unexpected content, please [open an issue](https://github.com/kubernetes/website/issues/new) and let us know.
