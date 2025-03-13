---
title: Blog guidelines
content_type: concept
weight: 40
---

<!-- overview -->

These guidelines cover the main [Kubernetes blog](/blog/) and the Kubernetes
[contributor blog](https://k8s.dev/blog/).

## Original content

The Kubernetes project accepts **original content only**, in English.

{{< note >}}
The Kubernetes project cannot accept content for the blog if it has already been submitted
or published outside of the Kubernetes project.
{{< /note >}}


The official Kubernetes blogs are not the place for vendor pitches or for articles that promote
a specific solution from outside Kubernetes.

This restriction even carries across to promoting other Linux Foundation and CNCF projects.
Many CNCF projects have their own blog. These are often a better choice for posts about a specific
project, even if that other project is designed specifically to work with Kubernetes (or with Linux,
etc).

Articles must contain content that applies broadly to the Kubernetes community. For example, a
submission should focus on upstream Kubernetes as opposed to vendor-specific configurations.
Hyperlinks in articles should primarily be to the official Kubernetes documentation. When using external
references, links should be diverse - For example a submission shouldn't contain only links
back to a single company's blog.

Sometimes this is a delicate balance. You can ask in Slack ([#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J))
for guidance on whether a post is appropriate for the Kubernetes blog and / or contributor blog -
don't hesitate to reach out

The [content guide](/docs/contribute/style/content-guide/) applies unconditionally to blog articles
and the PRs that add them. Bear in mind that some restrictions in the guide state that they are only relevant to documentation; those marked restrictions don't apply to blog articles.

You must write [original content](#original-content) and you must have permission to license that content to the
Cloud Native Computing Foundation (so that the Kubernetes project can legally publish it).

The website is localized into many languages; English is the “upstream” for all the other
localizations. Even if you yourself speak another language and would be happy to provide a localization,
that should be in a separate pull request (see [languages per PR](/docs/contribute/new-content/#languages-per-pr)).

## Blog content guidance {#what-we-publish}

### Content examples

Here are some examples of content that is appropriate for the main Kubernetes blog:

* Announcements about new Kubernetes capabilities
* Explanations of how to achieve an outcome using Kubernetes; for example, tell us about your
  low-toil improvement on the basic idea of a rolling deploy
* Comparisons of different software options that have a link to Kubernetes and cloud native. It's
  OK to have a link to one of these options so long as you fully disclose your conflict of
  interest / relationship.
* Stories about problems or incidents, and how you resolved them
* Articles discussing building a cloud-native platform for specific use cases
  your opinion about the good or bad points about Kubernetes
* Announcements and stories about non-core Kubernetes, such as the Gateway API
* [Post-release announcements and updates](#post-release-comms)
* Messages about important Kubernetes security vulnerabilities
* Kubernetes projects updates
* Tutorials and walkthroughs
* Thought leadership around Kubernetes and cloud native
* The components of Kubernetes are purposely modular, so writing about existing integration
  points like CNI and CSI are on topic. Provided you don't write a vendor pitch, you can also write
  about what is on the other end of these integrations.


Here are some examples of content that is appropriate for the Kubernetes contributor blog:

* Articles about how to test your change to Kubernetes code
* Content around non-code contribution
* Discussions about alpha features where the design is still under discussion
* "Meet the team" articles about working groups, special interest groups etc
* A guide about how to write secure code that will become part of Kubernetes itself
* Articles about maintainer summits and the outcome of those summits

### Examples of content that wouldn't be accepted {#what-we-do-not-publish}

However, the project usually doesn't publish:

* vendor pitches
* an article you've published elsewhere, even if only to your own low-traffic blog
* updates about an external project that works with our relies on Kubernetes (put those on
  the external project's own blog)
* articles about using Kubernetes with a specific cloud provider
* articles that criticise specific people, groups of people, or businesses
* articles that have important technical mistakes or misleading details (for example: if you
  recommend turning off an important security control in production clusters, because it can
  be inconvenient, the Kubernetes project is likely to reject the article).

### Other considerations {#content-considerations-other}

The Kubernetes website has an ICP licence from the government of China. It's unlikely to be a problem but we also cannot publish articles that would be blocked by the Chinese government's official filtering of internet content.

Topics related to participation in or results of Kubernetes SIGs activities are always on
topic (see the work in the [Contributor Comms Team](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)
for support on these posts).

The project typically mirrors these articles to both blogs.


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

## Article scheduling

The usual process for submitting a blog article is to 

The Kubernetes project typically doesn't guarantee publication on specific dates.

- Articles are reviewed by community volunteers. The blog team tries its to accommodate specific
  timing, but they make make no guarantees.
- Even for the release announcements, Kubernetes does not commit to release on the planned
  date for a release; the release itself, and the associated announcement article, could
  be delayed.
- Many core parts of the Kubernetes projects submit blog posts during release windows, delaying
  publication times. Consider submitting during a quieter period of the release cycle.
- If you are looking for greater coordination on post release dates, coordinating with
  [CNCF marketing](https://www.cncf.io/about/contact/) is a more appropriate choice than submitting a blog post.
- Sometimes reviews can get backed up. If you feel your review isn't getting the attention it needs,
  you can reach out to the blog team on the [`#sig-docs-blog` Slack channel](https://kubernetes.slack.com/messages/sig-docs-blog/)
  to ask in real time.

## Technical considerations for submitting a blog post

Submissions need to be in Markdown format to be used by the [Hugo](https://gohugo.io/) generator
for the blog. There are [many resources available](https://gohugo.io/documentation/) on how to use
this technology stack.

For illustrations, diagrams or charts, the [figure shortcode](https://gohugo.io/content-management/shortcodes/#figure)
can be used. For other images, we strongly encourage use of alt attributes; if an image doesn't
need any alt attrribute, maybe it's not needed in the article at all.

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

- Ensure that your blog post follows the correct naming conventions and the following
  [front matter](https://gohugo.io/content-management/front-matter/) information:

  - The Markdown file name must follow the format `YYYY-MM-DD-Your-Title-Here.md`. For example,
    `2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
  - Do **not** include dots in the filename other than the final `.md` extension.
    A name like `2020-01-01-whats-new-in-1.19.md` causes failures during a build.
  - The front matter must include the following:

    ```yaml
    ---
    layout: blog
    title: "Your Title Here"
    draft: true # will be changed to date: YYYY-MM-DD before publication
    slug: lowercase-text-for-link-goes-here-no-spaces # optional
    author: >
      Author-1 (Affiliation),
      Author-2 (Affiliation),
      Author-3 (Affiliation)
    ---
    ```

  - Each commit message should be a short summary of the work being done. The first commit
    message should make sense as an overall description of the blog post.

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

### Mirroring from the Kubernetes Contributor Blog

To mirror a blog post from the [Kubernetes contributor blog](https://www.kubernetes.dev/blog/), follow these guidelines:

- Keep the blog content the same. If there are changes, they should be made to the original article first, and then to the mirrored article.
- The mirrored blog should have a `canonicalUrl`, that is, essentially the url of the original blog after it has been published.
- Same as [Kubernetes contributor blogs](https://kubernetes.dev/blog), Kubernetes blog posts also mention authors in the YAML header as per the new guidelines. This should be ensured.
- Publication dates stay the same as the original blog.

All of the other guidelines and expectations detailed above apply as well.
