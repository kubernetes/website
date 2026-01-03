---
layout: blog
title: A Better Docs UX With Docsy
date: 2020-06-15
slug: better-docs-ux-with-docsy
url: /blog/2020/06/better-docs-ux-with-docsy
author: >
  Zach Corleissen (Cloud Native Computing Foundation)
---

*Editor's note: Zach is one of the chairs for the Kubernetes documentation special interest group (SIG Docs).*

I'm pleased to announce that the [Kubernetes website](https://kubernetes.io) now features the [Docsy Hugo theme](https://docsy.dev).

The Docsy theme improves the site's organization and navigability, and opens a path to improved API references. After over 4 years with few meaningful UX improvements, Docsy implements some best practices for technical content. The theme makes the Kubernetes site easier to read and makes individual pages easier to navigate. It gives the site a much-needed facelift.

For example: adding a right-hand rail for navigating topics on the page. No more scrolling up to navigate!

The theme opens a path for future improvements to the website. The Docsy functionality I'm most excited about is the theme's [`swaggerui` shortcode](https://www.docsy.dev/docs/adding-content/shortcodes/#swaggerui), which provides native support for generating API references from an OpenAPI spec. The CNCF is partnering with [Google Season of Docs](https://developers.google.com/season-of-docs) (GSoD) for staffing to make better API references a reality in Q4 this year. We're hopeful to be chosen, and we're looking forward to Google's list of announced projects on August 16th. Better API references have been a personal goal since I first started working with SIG Docs in 2017. It's exciting to see the goal within reach. 

One of SIG Docs' tech leads, [Karen Bradshaw](https://github.com/kbhawkey) did a lot of heavy lifting to fix a wide range of site compatibility issues, including a fix to the last of our [legacy pieces](https://github.com/kubernetes/website/pull/21359) when we [migrated from Jekyll to Hugo](2018-05-05-hugo-migration/) in 2018. Our other tech leads, [Tim Bannister](https://github.com/sftim) and [Taylor Dolezal](https://github.com/onlydole) provided extensive reviews.

Thanks also to [Björn-Erik Pedersen](https://bep.is/), who provided invaluable advice about how to navigate a Hugo upgrade beyond [version 0.60.0](https://gohugo.io/news/0.60.0-relnotes/).

The CNCF contracted with [Gearbox](https://gearboxbuilt.com/) in Victoria, BC to apply the theme to the site. Thanks to Aidan, Troy, and the rest of the team for all their work!