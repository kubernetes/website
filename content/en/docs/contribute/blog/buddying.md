---
title: Helping as a blog writing buddy
slug: writing-buddy
content_type: concept
weight: 70
---

<!-- overview -->

There are two official Kubernetes blogs, and the CNCF has its own blog where you can cover Kubernetes too.
Read [contributing to Kubernetes blogs](/docs/contribute/blog/) to learn about these two blogs.

When people contributor to either blog as an author, the Kubernetes project pairs up authors
as _writing buddies_. This page explains how to fulfil the buddy role.

You should make sure that you have at least read an outline of [article submission](/docs/contribute/blog/submission/)
before you read on within this page.

<!-- body -->

## Buddy responsibilities

As a writing buddy, you:

* help the blog team get articles ready to merge and to publish
* support your buddy to produce content that is good to merge
* provide a review on the article that your buddy has written


When the team pairs you up with another author, the idea is that you both support each other by
reviewing the other author's draft article.
Most people reading articles on the Kubernetes blog are not experts; the content should
try to make sense for that audience, or at least to support non-expert readers appropriately.

The blog team are also there to help you both along the journey from draft to publication.
They will either be directly able to approve your article for publication, or can arrange for
the approval to happen.

## Supporting the blog team

Your main responsibility here is to communicate about your capacity, availability and progress
in a reasonable timeline. If many weeks go by and your buddy hasn't heard from you, it makes
the overall work take more time.

## Supporting your buddy

There are two parts to the process

{{< tabs name="buddy_support" >}}
{{% tab name="Collaborative editing" %}}
**(This is the recommended option)**

The blog team recommend that the main author for the article sets up collaborative editing
using either a Google Doc or HackMD (their choice). The main author then shares that document
with the following people:

 * Any co-authors
 * You (their writing buddy)
 * Ideally, with a nominated
person from the blog team.

As a writing buddy, you then read the draft text and either directly make suggestions or provide
feedback in a different way. The author of the blog is very commonly also **your** writing buddy in turn, so they will provide the
same kind of feedback on the draft for your blog article.

Your role here is to recommend the smallest set of changes that will get the article look good
for publication. If there's a diagram that really doesn't make sense, or the writing is really
unclear: provide feedback. If you have a slight different of opinion about wording or punctuation,
skip it. Let the article author(s) write in their own style, provided that they align to
the [blog guidelines](/docs/contribute/blog/guidelines/).

After this is ready, the lead author will open a pull request and use Markdown to submit the
article. You then provide a [review](#pull-request-review).
{{% /tab %}}
{{% tab name="Markdown / Git editing" %}}
Some authors prefer to start with
[collaborative editing](#buddy-support-0); others like to go straight into
GitHub.

Whichever route they take, your role is to provide feedback that lets the blog team provide
a simple signoff and confirm that the article can merge as a draft. See
[submitting articles to Kubernetes blogs](/docs/contribute/blog/submission/) for what the authors
need to do.

Use GitHub suggestions to point out any required changes.

Once the Markdown and other content (such as images) look right, you provide a
formal [review](#pull-request-review).
{{% /tab %}}
{{< /tabs >}}


## Pull request review

Follow the [blog](/docs/contribute/review/reviewing-prs/#blog) section of _Reviewing pull requests_.

When you think that the open blog pull request is good enough to merge, add the `/lgtm` comment to the pull request.

This indicates to the repository automation tooling (Prow) that the content "looks good to me". Prow moves things forward. The `/lgtm` command lets you add your opinion to the record whether or not you are formally a member of the Kubernetes project.

Either you or the article author(s) should let the blog team know that there is an article
ready for signoff. It should already be marked as `draft: true` in the front matter, as
explained in the submission guidance.

## Subsequent steps

For you as a writing buddy, **there is no step four**. Once the pull request is good to merge,
the blog team (or, for the contributor site, the contributor comms team) take things from there.
It's possible that you'll need to return to an earlier step based on feedback, but you can usually expect that your work as a buddy is done.
