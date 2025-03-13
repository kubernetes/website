---
title: Submitting articles to Kubernetes blogs
slug: article-submission
content_type: concept
weight: 30
---

<!-- overview -->

There are two official Kubernetes blogs, and the CNCF has its own blog where you can cover Kubernetes too.
For the main Kubernetes blog, we (the Kubernetes project) like to publish articles with different perspectives and special focuses, that have a link to Kubernetes.

With only a few special case exceptions, we only publish content that hasn't been submitted or published anywhere else.

<!-- body -->

## Writing for the Kubernetes blog(s)

As an author, you have three main routes towards publication.

### Recommended route {#route-1}

The approach the Kubernetes project recommends is: pitch your article by contacting the blog team. You can do that via Kubernetes Slack ([#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J))
<!-- FIXME: or using this [form] -->

Unless there's a problem with your submission, the blog team will pair you up with:

* a blog _editor_
* your _writing buddy_ (another blog author)

When the team pairs you up with another author, the idea is that you both support each other by
reviewing the other author's draft article. You don't need to be a subject matter expert—most of
the people who read the article also won't be experts. We, the Kubernetes blog team, call the other author a writing buddy.

The editor is there to help you along the journey from draft to publication. They will either be
directly able to approve your article for publication, or can arrange for the approval to happen.

Read [authoring a blog article](#authoring) to learn more about the process.

### Starting with a pull request {#route-2}

The second route to writing for our blogs is to start directly with a pull request in GitHub. The
blog team actually don't recommend this; GitHub is quite useful for collaborating on code,
but isn't an ideal fit for prose text.

It's absolutely fine to open a placeholder pull request with just an empty commit, and then
work elsewhere before returning to your placeholder PR.

Similar to the [recommended route](#route-1), we'll try to pair you up with a writing buddy
and a blog editor. They'll help you get the article ready for publication.

### Post-release blog article process {#route-3-post-release-comms}

The third route is for blog articles about changes in Kubernetes relating to a release. Each
time there is a release, the release comms team takes over the blog publication schedule. People
adding features to a release, or who are planning other changes that the project needs to announce, can
liaise with release comms to get their article planned, drafted, edited and eventually published.

## Article scheduling

For the Kubernetes blog, the blog team usually schedules blog articles to publish on weekdays
(Gregorian calendar, as used in the USA and other countries). When is important to publish on
a specific date that falls on a weekend, the blog team try to accommodate that.

The section on [authoring a blog article]{#authoring} explains what to do:

* initially, don't specify a date for the article
* however, do set the article as draft (put `draft: true` in the front matter)

When the Prow bot merges the PR you write, it will be a draft and won't be set to publish. A
Kubernetes contributor (either you, your writing buddy or someone from the blog team) then opens a small
follow-up PR that marks it for publication. Merging that second PR releases the previously-draft
article so that it can automatically publish.

On the day the article is scheduled to publish, automation triggers a website build and your
article becomes visible.



## Authoring an article {#authoring}

After you've pitched, we'll encourage you to use either HackMD (a web Markdown editor) or a
Google doc, to share an editable version of the article text. Your writing buddy can critique
your text and let you know if it's not in line with the guidelines. At the same time, you'll
be their writing buddy and can follow our [guide] to supporting their work.

### Initial administrative steps

You should [sign the CLA](/docs/contribute/new-content/#contributing-basics)
if you have not yet done so. It is best to make sure you start this early on; if you are
writing as part of your job, you may need to check with legal before you can sign.

### Initial drafting

The blog team recommends that you to either use HackMD (a web Markdown editor) or a
Google doc, to prepare and share an initial, live-editable version of the article text.

{{< note >}}
If you choose to use Google Docs, you can set your document into Markdown mode.
{{< /note >}}

Your writing buddy can critique your text and let you know if it's not in line with the
guidelines. At the same time, you'll be their writing buddy and can follow the
[guide](/docs/contribute/blog/editing/#writing-buddies)
that explains how you'll be supporting their work.

Don't worry too much at this stage about getting the Markdown formatting exactly right, though.

### Markdown for publication

Have a look at the Markdown format for existing blog posts in the
[website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts)
in GitHub.

If you're not already familiar, read [contributing basics](/docs/contribute/new-content/#contributing-basics).
This section of the page assumes that you don't have a local clone of your fork and that you
are working within the GitHub web UI.
You do need make a remote fork of the website repository if you haven't already done so.

In the GitHub repository, click the **Create new file** button. Copy your existing content
from HackMD or Google Docs, then paste it into the editor.
There are more details later in the section about what goes into that file.
Name the file to match the proposed title of the blog post, but don’t put the date in the file name.
The blog reviewers will work with you to set the final file name and the date when the article will be published.

1. When you save the file, GitHub will walk you through the pull request process.

1. Your writing buddy can review your submission and work with you on feedback and final details.
   A blog editor approves your pull request to merge, as a draft that is not yet scheduled.

#### Front matter

The Markdown file you write should use YAML-format Hugo
[front matter](https://gohugo.io/content-management/front-matter/).

Here's an example:

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

* initially, don't specify a date for the article
* however, do set the article as draft (put `draft: true` in the
  article [front matter](https://gohugo.io/content-management/front-matter/))

#### Article content

Make sure to use 2nd-level Markdown headings (`##` not `#`) as the topmost heading level in
the article. The `title` you set in the front matter becomes the first-level heading for that
page.

You should follow the [style guide](https://kubernetes.io/docs/contribute/style/style-guide/),
but with the following exceptions:

- we are OK to have authors write an article in their own writing style, so long as most readers
  would follow the point being made
- it is OK to use “we“ in a blog article that has multiple authors, or where the article introduction clearly indicates that the author is writing on behalf of a specific group.
  As you'll notice from this section, although we [avoid using “we”](/docs/contribute/style/style-guide/#avoid-using-we) in our documentation,
  it's OK to make justifiable exceptions.
- we avoid using Kubernetes shortcodes for callouts (such as `{{</* caution */>}}`). This is
  because callouts are aimed at documentation readers, and blog articles aren't documentation.
- statements about the future are OK, albeit we use them with care in official announcements on
  behalf of Kubernetes
- code samples used in blog articles don't need to use the `{{</* code_sample */>}}` shortcode, and often
  it is better (easier to maintain) if they do not

The [diagram guide](/docs/contribute/style/diagram-guide/) is aimed at Kubernetes documentation,
  not blog articles. It is still good to align with it but:
- there is no need to caption diagrams as Figure 1, Figure 2 etc

For the blog, try to use vector graphics. We prefer SVG over raster diagram formats, and also over Mermaid (you can still capture the Mermaid source in a comment). This is because when we upgrade Mermaid or make changes to diagram rendering, we may not have a way to contact the original blog article author to check that the changes are OK.

#### Commit messages

At the point you mark your pull request ready for review, each commit message should be a
short summary of the work being done. The first commit message should make sense as an overall
description of the blog post.

Examples of a good commit message:

- _Add blog post on the foo kubernetes feature_
- _blog: foobar announcement_

Examples of bad commit messages:
- _Placeholder commit for announcement about foo_
- _Add blog post_
- _asdf_
- _initial commit_
- _draft post_
