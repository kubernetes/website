---
title: Submitting blog posts and case studies
linktitle: Blogs and case studies
slug: blogs-case-studies
content_type: concept
weight: 30
---


<!-- overview -->

Anyone can write a blog post and submit it for review.
Case studies require extensive review before they're approved.

<!-- body -->

## The Kubernetes Blog

The Kubernetes blog is used by the project to communicate new features, community reports, and any news that might be relevant to the Kubernetes community. 
This includes end users AND developers. 
Generally speaking the blog tends to skew towards things that happen in the core project, however the community is always interested in things that are happening in the Kubernetes ecosystem, so we encourage you to consider submitting content to the blog. 

Anyone can write a blog post and submit it for review.

### Guidelines and expectations

- Blog posts should not be vendor pitches. 
  - Articles must contain content that applies broadly to the Kubernetes community - For example, a submission should focus on upstream Kubernetes as opposed to vendor-specific configurations.
  - Links should primarily be to the official Kubernetes documentation. When using external references, links should be diverse - For example a submission shouldn't contain only links back to a single company's blog.
  - This can sometime be a delicate balance. The [blog team](https://kubernetes.slack.com/messages/sig-docs-blog/) is there to give guidance on whether a post is appropriate for the Kubernetes blog, so don't hesistate to reach out. 
- Blog posts do not offer deadlines.
    - Articles are reviewed by community volunteers and _cannot guarantee_ any time-based deadlines, though we will try our best to accomodate you.
  - Many core parts of the project are submitting posts during release windows and publication time will be delayed. Consider submitting during a quieter period of the release cycle.
  - If you are looking for greater coordination on post release dates, coordinating with [CNCF marketing] is a more appropriate choice than submitting a blog post.
  - Sometimes reviews can get backed up. If you feel your review isn't getting the attention it needs, you can reach out to the blog team via [this slack channel](https://kubernetes.slack.com/messages/sig-docs-blog/) to ask in real time. 
- Blog posts should be relevant to Kubernetes users.
  - Topics related to participation in or results of Kubernetes SIGs activities are always on topic (see the work in the [Upstream Marketing Team](https://github.com/kubernetes/community/blob/master/communication/marketing-team/blog-guidelines.md#upstream-marketing-blog-guidelines) for support on these posts). 
  - The components of Kubernetes are purposely modular, so tools that use existing integration points like CNI and CSI are on topic. 
  - Posts about other CNCF projects may or may not be on topic. We recommend asking the blog team before submitting a draft.
    - Many CNCF projects have their own blog. These are often a better choice for posts. There are times of major feature or milestone for a CNCF project that users would be interested in reading on the Kubernetes blog.
- Blog posts should aim to be future proof
  - Given the development velocity of the project, we want evergreen content, that won't require updates to stay accurate to the reader. 
  - It can be a better choice to add a tutorial or update official documentation, then write a higher level overview as a blog post.
    - Consider concentrating the long technical content as a call to action of the blog post, and focus on the problem space or why readers should care.

### Technical Considerations for submitting a blog post

Submissions need to be in Markdown format to be used by the [Hugo](https://gohugo.io/) generator for the blog. There are [many resources available] on how to use this technology stack.

We recognize that this requirement makes the process more difficult for less-familiar folks to submit, and we're constantly looking at solutions to lower this bar. If you have ideas on how to lower the barrier, please volunteers to help out. 

The SIG Docs [blog subproject](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject) manages the review process for blog posts. For more information, see [Submit a post](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post).

To submit a blog post follow these directions:

- [Open a pull request](/docs/contribute/new-content/new-content/#fork-the-repo) with a new blog post. New blog posts go under the [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts) directory.

- Ensure that your blog post follows the correct naming conventions and the following frontmatter (metadata) information:

  - The Markdown file name must follow the format `YYYY-MM-DD-Your-Title-Here.md`. For example, `2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
  - The front matter must include the following:

  ```yaml
  ---
  layout: blog
  title: "Your Title Here"
  date: YYYY-MM-DD
  slug: text-for-URL-link-here-no-spaces
  ---
  ```
  - The first or initial commit message should be a short summary of the work being done and should stand alone as a description of the blog post. Please note that subsequent edits to your blog will be squashed into this main commit, so it should be as useful as possible. 
    - Examples of a good commit message:
      -  _Add blog post on the foo kubernetes feature_
      -  _blog: foobar announcement_
    - Examples of bad commit message:
      - _Add blog post_
      - _._
      - _initial commit_
      - _draft post_
  - The blog team will then review your PR and give you comments on things you might need to fix. After that the bot will merge your PR and your blog post will be published. 


## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve
real-world problems. The Kubernetes marketing team and members of the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} collaborate with you on all case studies.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/master/content/en/case-studies).

Refer to the [case study guidelines](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md) and submit your request as outlined in the guidelines. 



## {{% heading "whatsnext" %}}