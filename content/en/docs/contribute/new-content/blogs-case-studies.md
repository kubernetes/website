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

The Kubernetes blog is used by the project to communicate new features, community reports, and any
news that might be relevant to the Kubernetes community. This includes end users and developers. 
Most of the blog's content is about things happening in the core project, but we encourage you to
submit about things happening elsewhere in the ecosystem too!

Anyone can write a blog post and submit it for review.

### Submit a Post

Blog posts should not be commercial in nature and should consist of original content that applies
broadly to the Kubernetes community. Appropriate blog content includes:

- New Kubernetes capabilities
- Kubernetes projects updates
- Updates from Special Interest Groups
- Tutorials and walkthroughs
- Thought leadership around Kubernetes
- Kubernetes Partner OSS integration
- **Original content only**

Unsuitable content includes:

- Vendor product pitches
- Partner updates without an integration and customer story
- Syndicated posts (language translations ok)

To submit a blog post, follow these steps:

1. [Sign the CLA](https://github.com/kubernetes/community/blob/master/CLA.md)
   if you have not yet done so.

1. Have a look at the Markdown format for existing blog posts in the
   [website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts).

1. Write out your blog post in a text editor of your choice.

1. On the same link from step 2, click the Create new file button. Paste your content into the editor.
   Name the file to match the proposed title of the blog post, but don’t put the date in the file name.
   The blog reviewers will work with you on the final file name and the date the blog will be published.

1. When you save the file, GitHub will walk you through the pull request process.

1. A blog post reviewer will review your submission and work with you on feedback and final details.
   When the blog post is approved, the blog will be scheduled for publication.

### Guidelines and expectations

- Blog posts should not be vendor pitches. 

  - Articles must contain content that applies broadly to the Kubernetes community. For example, a
    submission should focus on upstream Kubernetes as opposed to vendor-specific configurations.
    Check the [Documentation style guide](/docs/contribute/style/content-guide/#what-s-allowed) for
    what is typically allowed on Kubernetes properties. 
  - Links should primarily be to the official Kubernetes documentation. When using external
    references, links should be diverse - For example a submission shouldn't contain only links
    back to a single company's blog.
  - Sometimes this is a delicate balance. The [blog team](https://kubernetes.slack.com/messages/sig-docs-blog/)
    is there to give guidance on whether a post is appropriate for the Kubernetes blog, so don't
    hesitate to reach out. 

- Blog posts are not published on specific dates.

    - Articles are reviewed by community volunteers. We'll try our best to accommodate specific
      timing, but we make no guarantees.
  - Many core parts of the Kubernetes projects submit blog posts during release windows, delaying
    publication times. Consider submitting during a quieter period of the release cycle.
  - If you are looking for greater coordination on post release dates, coordinating with
    [CNCF marketing](https://www.cncf.io/about/contact/) is a more appropriate choice than submitting a blog post.
  - Sometimes reviews can get backed up. If you feel your review isn't getting the attention it needs,
    you can reach out to the blog team on the [`#sig-docs-blog` Slack channel](https://kubernetes.slack.com/messages/sig-docs-blog/)
    to ask in real time.

- Blog posts should be relevant to Kubernetes users.

  - Topics related to participation in or results of Kubernetes SIGs activities are always on
    topic (see the work in the [Contributor Comms Team](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/storytelling-resources/blog-guidelines.md#upstream-marketing-blog-guidelines)
    for support on these posts). 
  - The components of Kubernetes are purposely modular, so tools that use existing integration
    points like CNI and CSI are on topic. 
  - Posts about other CNCF projects may or may not be on topic. We recommend asking the blog team
    before submitting a draft.
    - Many CNCF projects have their own blog. These are often a better choice for posts. There are
      times of major feature or milestone for a CNCF project that users would be interested in
      reading on the Kubernetes blog.
  - Blog posts about contributing to the Kubernetes project should be in the
    [Kubernetes Contributors site](https://kubernetes.dev)

- Blog posts should be original content

  - The official blog is not for repurposing existing content from a third party as new content.
  - The [license](https://github.com/kubernetes/website/blob/main/LICENSE) for the blog allows
    commercial use of the content for commercial purposes, but not the other way around.

- Blog posts should aim to be future proof

  - Given the development velocity of the project, we want evergreen content that won't require
    updates to stay accurate for the reader. 
  - It can be a better choice to add a tutorial or update official documentation than to write a
    high level overview as a blog post.
    - Consider concentrating the long technical content as a call to action of the blog post, and
      focus on the problem space or why readers should care.

### Technical Considerations for submitting a blog post

Submissions need to be in Markdown format to be used by the [Hugo](https://gohugo.io/) generator
for the blog. There are [many resources available](https://gohugo.io/documentation/) on how to use
this technology stack.

We recognize that this requirement makes the process more difficult for less-familiar folks to
submit, and we're constantly looking at solutions to lower this bar. If you have ideas on how to
lower the barrier, please volunteer to help out. 

The SIG Docs [blog subproject](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject)
manages the review process for blog posts. For more information, see
[Submit a post](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post).

To submit a blog post follow these directions:

- [Open a pull request](/docs/contribute/new-content/open-a-pr/#fork-the-repo) with a new blog post.
  New blog posts go under the [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/main/content/en/blog/_posts)
  directory.

- Ensure that your blog post follows the correct naming conventions and the following frontmatter
  (metadata) information:

  - The Markdown file name must follow the format `YYYY-MM-DD-Your-Title-Here.md`. For example,
    `2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
  - Do **not** include dots in the filename. A name like `2020-01-01-whats-new-in-1.19.md` causes
    failures during a build.
  - The front matter must include the following:

    ```yaml
    ---
    layout: blog
    title: "Your Title Here"
    date: YYYY-MM-DD
    slug: text-for-URL-link-here-no-spaces
    ---
    ```

  - The first or initial commit message should be a short summary of the work being done and
    should stand alone as a description of the blog post. Please note that subsequent edits to
    your blog will be squashed into this main commit, so it should be as useful as possible. 

    - Examples of a good commit message:
      - _Add blog post on the foo kubernetes feature_
      - _blog: foobar announcement_
    - Examples of bad commit message:
      - _Add blog post_
      - _._
      - _initial commit_
      - _draft post_

  - The blog team will then review your PR and give you comments on things you might need to fix.
    After that the bot will merge your PR and your blog post will be published. 

  - If the content of the blog post contains only content that is not expected to require updates
    to stay accurate for the reader, it can be marked as evergreen and exempted from the automatic
    warning about outdated content added to blog posts older than one year.

    - To mark a blog post as evergreen, add this to the front matter:
      
      ```yaml
      evergreen: true
      ```
    - Examples of content that should not be marked evergreen:
      - **Tutorials** that only apply to specific releases or versions and not all future versions
      - References to pre-GA APIs or features

## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve real-world problems. The
Kubernetes marketing team and members of the {{< glossary_tooltip text="CNCF" term_id="cncf" >}}
collaborate with you on all case studies.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/main/content/en/case-studies).

Refer to the [case study guidelines](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md)
and submit your request as outlined in the guidelines.

