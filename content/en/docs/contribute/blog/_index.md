---
title: Contributing to Kubernetes blogs
slug: blog-contribution
content_type: concept
weight: 15
simple_list: true
---

<!-- overview -->

There are two official Kubernetes blogs, and the CNCF has [its own blog](https://www.cncf.io/blog/) where you can cover Kubernetes too.
For the main Kubernetes blog, we (the Kubernetes project) like to publish articles with different perspectives and special focuses, that have a link to Kubernetes.

With only a few special case exceptions, we only publish content that hasn't been submitted or published anywhere else.

Read the [blog guidelines](/docs/contribute/blog/guidelines/#what-we-publish) for more about that aspect.

## Official Kubernetes blogs

### Main blog

The main [Kubernetes blog](/blog/) is used by the project to communicate new features, community reports, and any
news that might be relevant to the Kubernetes community. This includes end users and developers.
Most of the blog's content is about things happening in the core project, but Kubernetes
as a project encourages you to submit about things happening elsewhere in the ecosystem too!

Anyone can write a blog post and submit it for publication. With only a few special case exceptions, we only publish content that hasn't been submitted or published anywhere else.

### Contributor blog

The [Kubernetes contributor blog](https://k8s.dev/blog/) is aimed at an audience of people who
work **on** Kubernetes more than people who work **with** Kubernetes. The Kubernetes project
deliberately publishes some articles to both blogs.

Anyone can write a blog post and submit it for review.

## Article updates and maintenance {#maintenance}

The Kubernetes project does not maintain older articles for its blogs. This means that any
published article more than one year old will normally **not** be eligible for issues or pull
requests that ask for changes. To avoid establishing precedent, even technically correct pull
requests are likely to be rejected.

However, there are exceptions like the following:

* (updates to) articles marked as [evergreen](#maintenance-evergreen)
* removing or correcting articles giving advice that is now wrong and dangerous to follow
* fixes to ensure that an existing article still renders correctly

For any article that is over a year old and not marked as _evergreen_, the website automatically
displays a notice that the content may be stale.

### Evergreen articles {#maintenance-evergreen}

You can mark an article as evergreen by setting `evergreen: true` in the front matter.

We only mark blog articles as maintained (`evergreen: true` in front matter) if the Kubernetes project
can commit to maintaining them indefinitely. Some blog articles absolutely merit this; for example, the release comms team always marks official release announcements as evergreen.

## {{% heading "whatsnext" %}}

* Discover the official blogs:
  * [Kubernetes blog](/blog/)
  * [Kubernetes contributor blog](https://k8s.dev/blog/)

* Read about [reviewing blog pull requests](/docs/contribute/review/reviewing-prs/#blog)
