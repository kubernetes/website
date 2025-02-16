---
title: Reviewing pull requests
content_type: concept
main_menu: true
weight: 10
---

<!-- overview -->

Anyone can review a documentation pull request. Visit the [pull requests](https://github.com/kubernetes/website/pulls)
section in the Kubernetes website repository to see open pull requests.

Reviewing documentation pull requests is a great way to introduce yourself to the Kubernetes
community.  It helps you learn the code base and build trust with other contributors.

Before reviewing, it's a good idea to:

- Read the  [content guide](/docs/contribute/style/content-guide/) and
  [style guide](/docs/contribute/style/style-guide/) so you can leave informed comments.
- Understand the different
  [roles and responsibilities](/docs/contribute/participate/roles-and-responsibilities/)
  in the Kubernetes documentation community.

<!-- body -->

## Before you begin

Before you start a review:

- Read the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)
  and ensure that you abide by it at all times.
- Be polite, considerate, and helpful.
- Comment on positive aspects of PRs as well as changes.
- Be empathetic and mindful of how your review may be received.
- Assume good intent and ask clarifying questions.
- Experienced contributors, consider pairing with new contributors whose work requires extensive changes.

## Review process

In general, review pull requests for content and style in English. Figure 1 outlines the steps for
the review process. The details for each step follow.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph fourth[Start review]
    direction TB
    S[ ] -.-
    M[add comments] --> N[review changes]
    N --> O[new contributors should<br>choose Comment]
    end
    subgraph third[Select PR]
    direction TB
    T[ ] -.-
    J[read description<br>and comments]--> K[preview changes in<br>Netlify preview build]
    end
 
  A[Review open PR list]--> B[Filter open PRs<br>by label]
  B --> third --> fourth
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,J,K,M,N,O grey
class S,T spacewhite
class third,fourth white
{{</ mermaid >}}

Figure 1. Review process steps.


1. Go to [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
   You see a list of every open pull request against the Kubernetes website and docs.

2. Filter the open PRs using one or all of the following labels:

   - `cncf-cla: yes` (Recommended): PRs submitted by contributors who have not signed the CLA
     cannot be merged. See [Sign the CLA](/docs/contribute/new-content/#sign-the-cla)
     for more information.
   - `language/en` (Recommended): Filters for english language PRs only.
   - `size/<size>`: filters for PRs of a certain size. If you're new, start with smaller PRs.

   Additionally, ensure the PR isn't marked as a work in progress. PRs using the `work in
   progress` label are not ready for review yet.

3. Once you've selected a PR to review, understand the change by:

   - Reading the PR description to understand the changes made, and read any linked issues
   - Reading any comments by other reviewers
   - Clicking the **Files changed** tab to see the files and lines changed
   - Previewing the changes in the Netlify preview build by scrolling to the PR's build check
     section at the bottom of the **Conversation** tab.
     Here's a screenshot (this shows GitHub's desktop site; if you're reviewing
     on a tablet or smartphone device, the GitHub web UI is slightly different):
     {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="GitHub pull request details including link to Netlify preview" >}}
     To open the preview, click on the  **Details** link of the **deploy/netlify** line in the
     list of checks.

4. Go to the **Files changed** tab to start your review.

   1. Click on the `+` symbol  beside the line you want to comment on.
   1. Fill in any comments you have about the line and click either **Add single comment**
      (if you have only one comment to make) or **Start a review** (if you have multiple comments to make).
   1. When finished, click **Review changes** at the top of the page. Here, you can add
      a summary of your review (and leave some positive comments for the contributor!).
      Please always use the "Comment"

     - Avoid clicking the "Request changes" button when finishing your review.
       If you want to block a PR from being merged before some further changes are made,
       you can leave a "/hold" comment.
       Mention why you are setting a hold, and optionally specify the conditions under
       which the hold can be removed by you or other reviewers.

     - Avoid clicking the "Approve" button when finishing your review.
       Leaving a "/approve" comment is recommended most of the time.

## Reviewing checklist

When reviewing, use the following as a starting point.

### Language and grammar

- Are there any obvious errors in language or grammar? Is there a better way to phrase something?
  - Focus on the language and grammar of the parts of the page that the author is changing.
     Unless the author is clearly aiming to update the entire page, they have no obligation to
     fix every issue on the page.
  - When a PR updates an existing page, you should focus on reviewing the parts of
    the page that are being updated. That changed content should be reviewed for technical
    and editorial correctness.
    If you find errors on the page that don't directly relate to what the PR author
    is attempting to address, then it should be treated as a separate issue (check
    that there isn't an existing issue about this first).
  - Watch out for pull requests that _move_ content. If an author renames a page
    or combines two pages, we (Kubernetes SIG Docs) usually avoid asking that author to fix every grammar or spelling nit
    that we could spot within that moved content.
- Are there any complicated or archaic words which could be replaced with a simpler word?
- Are there any words, terms or phrases in use which could be replaced with a non-discriminatory alternative?
- Does the word choice and its capitalization follow the [style guide](/docs/contribute/style/style-guide/)?
- Are there long sentences which could be shorter or less complex?
- Are there any long paragraphs which might work better as a list or table?

### Content

- Does similar content exist elsewhere on the Kubernetes site?
- Does the content excessively link to off-site, individual vendor or non-open source documentation?

### Website

- Did this PR change or remove a page title, slug/alias or anchor link? If so, are there broken
  links as a result of this PR? Is there another option, like changing the page title without
  changing the slug?

- Does the PR introduce a new page? If so:

  - Is the page using the right [page content type](/docs/contribute/style/page-content-types/)
    and associated Hugo shortcodes?
  - Does the page appear correctly in the section's side navigation (or at all)?
  - Should the page appear on the [Docs Home](/docs/home/) listing?

- Do the changes show up in the Netlify preview? Be particularly vigilant about lists, code
  blocks, tables, notes and images.

### Blog

- Early feedback on blog posts is welcome via a Google Doc or HackMD. Please request input early from the [#sig-docs-blog Slack channel](https://kubernetes.slack.com/archives/CJDHVD54J).
- Before reviewing blog PRs, be familiar with [Submitting blog posts and case studies](/docs/contribute/new-content/blogs-case-studies/).
- We are willing to mirror any blog article that was published to https://kubernetes.dev/blog/ (the contributor blog) provided that:
- the mirrored article has the same publication date as the original (it should have the same publication time too, but you can also set a time stamp up to 12 hours later for special cases)
  - for PRs that arrive the original article was merged to https://kubernetes.dev/, there haven't been 
  (and won't be) any articles published to the main blog between time that the original and mirrored article 
  [will] publish. 
  This is because we don't want to add articles to people's feeds, such as RSS, except at the very end of their feed.
  - the original article doesn't contravene any strongly recommended review guidelines or community norms.
  - You should set the canonical URL for the mirrored article, to the URL of the original article 
  (you can use a preview to predict the URL and fill this in ahead of actual publication). Use the `canonicalUrl` 
  field in [front matter](https://gohugo.io/content-management/front-matter/) for this.
- Consider the target audience and whether the blog post is appropriate for kubernetes.io 
  For example, if the target audience are Kubernetes contributors only then kubernetes.dev
  may be more appropriate, 
  or if the blog post is on general platform engineering then it may be more suitable on another site.

  This consideration applies to mirrored articles too; although we are willing to consider all valid
  contributor articles for mirroring if a PR is opened, we don't mirror all of them.

- We only mark blog articles as maintained (`evergreen: true` in front matter) if the Kubernetes project 
  is happy to commit to maintaining them indefinitely. Some blog articles absolutely merit this, and we 
  always mark our release announcements evergreen. Check with other contributors if you are not sure 
  how to review on this point.
- The [content guide](/docs/contribute/style/content-guide/) applies unconditionally to blog articles
  and the PRs that add them. Bear in mind that some restrictions in the guide state that they are only relevant to documentation; those restrictions don't apply to blog articles.
- The [style guide](/docs/contribute/style/style-guide/) largely also applies to blog PRs, but we make some exceptions.
  
  - it is OK to use “we“ in a blog article that has multiple authors, or where the article introduction clearly indicates that the author is writing on behalf of a specific group.
  - we avoid using Kubernetes shortcodes for callouts (such as `{{</* caution */>}}`)
  - statements about the future are OK, albeit we use them with care in official announcements on
    behalf of Kubernetes
  - code samples don't need to use the `{{</* code_sample */>}}` shortcode, and often it is better if they do not
  - we are OK to have authors write an article in their own writing style, so long as most readers
    would follow the point being made
- The [diagram guide](/docs/contribute/style/diagram-guide/) is aimed at Kubernetes documentation,
  not blog articles. It is still good to align with it but:
  - we prefer SVG over raster diagram formats, and also over Mermaid (you can still capture the Mermaid source in a comment)
  - there is no need to caption diagrams as Figure 1, Figure 2 etc

### Other

- Watch out for [trivial edits](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits);
  if you see a change that you think is a trivial edit, please point out that policy
  (it's still OK to accept the change if it is genuinely an improvement).
- Encourage authors who are making whitespace fixes to do
  so in the first commit of their PR, and then add other changes on top of that. This
  makes both merges and reviews easier. Watch out especially for a trivial change that
  happens in a single commit along with a large amount of whitespace cleanup
  (and if you see that, encourage the author to fix it).

As a reviewer, if you identify small issues with a PR that aren't essential to the meaning,
such as typos or incorrect whitespace, prefix your comments with `nit:`.
This lets the author know that this part of your feedback is non-critical.

If you are considering a pull request for approval and all the remaining feedback is
marked as a nit, you can merge the PR anyway. In that case, it's often useful to open
an issue about the remaining nits. Consider whether you're able to meet the requirements
for marking that new issue as a [Good First Issue](https://www.kubernetes.dev/docs/guide/help-wanted/#good-first-issue); if you can, these are a good source.
