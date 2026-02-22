---
title: Blog guidelines
content_type: concept
weight: 40
---

<!-- overview -->

These guidelines cover the main Kubernetes blog and the Kubernetes
contributor blog.

All blog content must also adhere to the overall policy in the
[content guide](/docs/contribute/style/content-guide/).

# {{% heading "prerequisites" %}}

Make sure you are familiar with the introduction sections of
[contributing to Kubernetes blogs](/docs/contribute/blog/), not just to learn about
the two official blogs and the differences between them, but also to get an overview
of the process.

## Original content

The Kubernetes project accepts **original content only**, in English.

{{< note >}}
The Kubernetes project cannot accept content for the blog if it has already been submitted
or published outside of the Kubernetes project.

The official blogs are not available as a medium to repurpose existing content from any third
party as new content.
{{< /note >}}

This restriction even carries across to promoting other Linux Foundation and CNCF projects.
Many CNCF projects have their own blog. These are often a better choice for posts about a specific
project, even if that other project is designed specifically to work with Kubernetes (or with Linux,
etc).

## Relevant content

Articles must contain content that applies broadly to the Kubernetes community. For example, a
submission should focus on upstream Kubernetes as opposed to vendor-specific configurations.
For articles submitted to the main blog that are not
[mirror articles](/docs/contribute/blog/mirroring/), hyperlinks in the article should commonly
be to the official Kubernetes documentation. When making external references, links should be
diverse - for example, a submission shouldn't contain only links back to a single company's blog.

The official Kubernetes blogs are **not** the place for vendor pitches or for articles that promote
a specific solution from outside Kubernetes.

Sometimes this is a delicate balance. You can ask in Slack ([#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J))
for guidance on whether a post is appropriate for the Kubernetes blog and / or contributor blog -
don't hesitate to reach out.

The [content guide](/docs/contribute/style/content-guide/) applies unconditionally to blog articles
and the PRs that add them. Bear in mind that some restrictions in the guide state that they are only relevant to documentation; those marked restrictions don't apply to blog articles.

## Localization

The website is localized into many languages; English is the “upstream” for all the other
localizations. Even if you speak another language and would be happy to provide a localization,
that should be in a separate pull request (see [languages per PR](/docs/contribute/new-content/#languages-per-pr)).

## Copyright and reuse

You must write [original content](#original-content) and you must have permission to license
that content to the Cloud Native Computing Foundation (so that the Kubernetes project can
legally publish it).
This means that not only is direct plagiarism forbidden, you cannot write a blog article if
you don't have permission to meet the CNCF copyright license conditions (for example, if your
employer has a policy about intellectual property that restricts what you are allowed to do).

The [license](https://github.com/kubernetes/website/blob/main/LICENSE) for the blog allows
commercial use of the content for commercial purposes, but not the other way around.

## Special interest groups and working groups

Topics related to participation in or results of Kubernetes SIG activities are always on
topic (see the work in the [Contributor Comms Team](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)
for support on these posts).

The project typically [mirrors](/docs/contribute/blog/mirroring/) these articles to both blogs.


## National restrictions on content

The Kubernetes website has an Internet Content Provider (ICP) licence from the government of China. Although it's unlikely to be a problem, Kubernetes cannot publish articles that would be blocked by the Chinese government's official filtering of internet content.

## Blog-specific content guidance {#what-we-publish}

As well as the general [style guide](/docs/contribute/style/style-guide/), blog articles should (not must) align to
the [blog-specific style recommendations](/docs/contribute/blog/article-submission/#article-content).

The remainder of this page is additional guidance; these are not strict rules that articles
must follow, but reviewers are likely to (and should) ask for edits to articles that are
obviously not aligned with the recommendations here.

### Diagrams and illustrations {#illustrations}

For [illustrations](/docs/contribute/blog/article-submission/#illustrations) - including diagrams or charts - use the [figure shortcode](https://gohugo.io/content-management/shortcodes/#figure)
where feasible. You should set an `alt` attribute for accessibility.

Use vector images for illustrations, technical diagrams and similar graphics; SVG format is recommended as a strong preference.

Articles that use raster images for illustrations are more difficult to maintain and in some
cases the blog team may ask authors to revise the article before it could be published.

### Timelessness

Blog posts should aim to be future proof

- Given the development velocity of the project, SIG Docs prefers _timeless_ writing: content that
  won't require updates to stay accurate for the reader.
- It can be a better choice to add a tutorial or update official documentation than to write a
  high level overview as a blog post.
- Consider concentrating the long technical content as a call to action of the blog post, and
  focus on the problem space or why readers should care.


### Content examples

Here are some examples of content that is appropriate for the
[main Kubernetes blog](/docs/contribute/blog/#main-blog):

* Announcements about new Kubernetes capabilities
* Explanations of how to achieve an outcome using Kubernetes; for example, tell us about your
  low-toil improvement on the basic idea of a rolling deploy
* Comparisons of several different software options that have a link to Kubernetes and cloud native. It's
  OK to have a link to one of these options so long as you fully disclose your conflict of
  interest / relationship.
* Stories about problems or incidents, and how you resolved them
* Articles discussing building a cloud native platform for specific use cases
* Your opinion about the good or bad points about Kubernetes
* Announcements and stories about non-core Kubernetes, such as the Gateway API
* [Post-release announcements and updates](#post-release-comms)
* Messages about important Kubernetes security vulnerabilities
* Kubernetes projects updates
* Tutorials and walkthroughs
* Thought leadership around Kubernetes and cloud native
* The components of Kubernetes are purposely modular, so writing about existing integration
  points like CNI and CSI are on topic. Provided you don't write a vendor pitch, you can also write
  about what is on the other end of these integrations.


Here are some examples of content that is appropriate for the Kubernetes
[contributor blog](/docs/contribute/blog/#contributor-blog):

* articles about how to test your change to Kubernetes code
* content around non-code contribution
* discussions about alpha features where the design is still under discussion
* "Meet the team" articles about working groups, special interest groups, etc.
* a guide about how to write secure code that will become part of Kubernetes itself
* articles about maintainer summits and the outcome of those summits

### Examples of content that wouldn't be accepted {#what-we-do-not-publish}

However, the project will not publish:

* vendor pitches
* an article you've published elsewhere, even if only to your own low-traffic blog
* large chunks of example source code with only a minimal explanation
* updates about an external project that works with our relies on Kubernetes (put those on
  the external project's own blog)
* articles about using Kubernetes with a specific cloud provider
* articles that criticise specific people, groups of people, or businesses
* articles that have important technical mistakes or misleading details (for example: if you
  recommend turning off an important security control in production clusters, because it can
  be inconvenient, the Kubernetes project is likely to reject the article).

