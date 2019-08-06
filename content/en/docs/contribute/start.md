---
title: Start contributing
slug: start
content_template: templates/concept
weight: 10
card:
  name: contribute
  weight: 10
---

{{% capture overview %}}

If you want to get started contributing to the Kubernetes documentation, this
page and its linked topics can help you get started. You don't need to be a
developer or a technical writer to make a big impact on the Kubernetes
documentation and user experience! All you need for the topics on this page is
a [GitHub account](https://github.com/join) and a web browser.

If you're looking for information on how to start contributing to Kubernetes
code repositories, refer to
[the Kubernetes community guidelines](https://github.com/kubernetes/community/blob/master/governance.md).

{{% /capture %}}


{{% capture body %}}

## The basics about our docs

The Kubernetes documentation is written in Markdown and processed and deployed using Hugo. The source is in GitHub at [https://github.com/kubernetes/website](https://github.com/kubernetes/website). Most of the documentation source is stored in `/content/en/docs/`. Some of the reference documentation is automatically generated from scripts in the `update-imported-docs/` directory.

You can file issues, edit content, and review changes from others, all from the
GitHub website. You can also use GitHub's embedded history and search tools.

Not all tasks can be done in the GitHub UI, but these are discussed in the
[intermediate](/docs/contribute/intermediate/) and
[advanced](/docs/contribute/advanced/) docs contribution guides.

### Participating in SIG Docs

The Kubernetes documentation is maintained by a
{{< glossary_tooltip text="Special Interest Group" term_id="sig" >}} (SIG)
called SIG Docs. We communicate using a Slack channel, a mailing list, and
weekly video meetings. New participants are welcome. For more information, see
[Participating in SIG Docs](/docs/contribute/participating/).

### Style guidelines

We maintain a [style guide](/docs/contribute/style/style-guide/) with information
about choices the SIG Docs community has made about grammar, syntax, source
formatting, and typographic conventions. Look over the style guide before you
make your first contribution, and use it when you have questions.

Changes to the style guide are made by SIG Docs as a group. To propose a change
or addition, [add it to the agenda](https://docs.google.com/document/d/1zg6By77SGg90EVUrhDIhopjZlSDg2jCebU-Ks9cYx0w/edit#) for an upcoming SIG Docs meeting, and attend the meeting to participate in the
discussion. See the [advanced contribution](/docs/contribute/advanced/) topic for more
information.

### Page templates

We use page templates to control the presentation of our documentation pages.
Be sure to understand how these templates work by reviewing
[Using page templates](/docs/contribute/style/page-templates/).

### Hugo shortcodes

The Kubernetes documentation is transformed from Markdown to HTML using Hugo.
We make use of the standard Hugo shortcodes, as well as a few that are custom to
the Kubernetes documentation. See [Custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/) for
information about how to use them.

### Multiple languages

Documentation source is available in multiple languages in `/content/`. Each language has its own folder with a two-letter code determined by the [ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php). For example, English documentation source is stored in `/content/en/docs/`.

For more information about contributing to documentation in multiple languages, see ["Localize content"](/docs/contribute/intermediate#localize-content) in the intermediate contributing guide.

If you're interested in starting a new localization, see ["Localization"](/docs/contribute/localization/).

## File actionable issues

Anyone with a GitHub account can file an issue (bug report) against the
Kubernetes documentation. If you see something wrong, even if you have no idea
how to fix it, [file an issue](#how-to-file-an-issue). The exception to this
rule is a tiny bug like a typo that you intend to fix yourself. In that case,
you can instead [fix it](#improve-existing-content) without filing a bug first.

### How to file an issue

- **On an existing page**

    If you see a problem in an existing page in the [Kubernetes docs](/docs/),
    go to the bottom of the page and click the **Create an Issue** button. If
    you are not currently logged in to GitHub, log in. A GitHub issue form
    appears with some pre-populated content.

    Using Markdown, fill in as many details as you can. In places where you see
    empty square brackets (`[ ]`), put an `x` between the set of brackets that
    represents the appropriate choice. If you have a proposed solution to fix
    the issue, add it. 

- **Request a new page**

    If you think content should exist, but you aren't sure where it should go or
    you don't think it fits within the pages that currently exist, you can
    still file an issue. You can either choose an existing page near where you think the
    new content should go and file the issue from that page, or go straight to
    [https://github.com/kubernetes/website/issues/new/](https://github.com/kubernetes/website/issues/new/)
    and file the issue from there.

### How to file great issues

To ensure that we understand your issue and can act on it, keep these guidelines
in mind:

- Use the issue template, and fill out as many details as you can.
- Clearly explain the specific impact the issue has on users.
- Limit the scope of a given issue to a reasonable unit of work. For problems
  with a large scope, break them down into smaller issues.
  
    For instance, "Fix the security docs" is not an actionable issue, but "Add
    details to the 'Restricting network access' topic" might be.
- If the issue relates to another issue or pull request, you can refer to it
  either by its full URL or by the issue or pull request number prefixed
  with a `#` character. For instance, `Introduced by #987654`.
- Be respectful and avoid venting. For instance, "The docs about X suck" is not
  helpful or actionable feedback. The
  [Code of Conduct](/community/code-of-conduct/) also applies to interactions on
  Kubernetes GitHub repositories.

## Participate in SIG Docs discussions

The SIG Docs team communicates using the following mechanisms:

- [Join the Kubernetes Slack instance](http://slack.k8s.io/), then join the
  `#sig-docs` channel, where we discuss docs issues in real-time. Be sure to
  introduce yourself!
- [Join the `kubernetes-sig-docs` mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  where broader discussions take place and official decisions are recorded.
- Participate in the [weekly SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) video meeting, which is announced on the Slack channel and the mailing list. Currently, these meetings take place on Zoom, so you'll need to download the [Zoom client](https://zoom.us/download) or dial in using a phone.

{{< note >}}
You can also check the SIG Docs weekly meeting on the [Kubernetes community meetings calendar](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles).
{{< /note >}}

## Improve existing content

To improve existing content, you file a _pull request (PR)_ after creating a
_fork_. Those two terms are [specific to GitHub](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/).
For the purposes of this topic, you don't need to know everything about them,
because you can do everything using your web browser. When you continue to the
[intermediate docs contributor guide](/docs/contribute/intermediate/), you will
need more background in Git terminology.

{{< note >}}
**Kubernetes code developers**: If you are documenting a new feature for an
upcoming Kubernetes release, your process is a bit different. See
[Document a feature](/docs/contribute/intermediate/#sig-members-documenting-new-features) for
process guidelines and information about deadlines.
{{< /note >}}

### Sign the CNCF CLA {#sign-the-cla}

Before you can contribute code or documentation to Kubernetes, you **must** read
the [Contributor guide](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) and
[sign the Contributor License Agreement (CLA)](https://github.com/kubernetes/community/blob/master/CLA.md).
Don't worry -- this doesn't take long!

### Find something to work on

If you see something you want to fix right away, just follow the instructions
below. You don't need to [file an issue](#file-actionable-issues) (although you
certainly can).

If you want to start by finding an existing issue to work on, go to
[https://github.com/kubernetes/website/issues](https://github.com/kubernetes/website/issues)
and look for issues with the label `good first issue` (you can use
[this](https://github.com/kubernetes/website/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) shortcut). Read through the comments and make sure there is not an open pull
request against the issue and that nobody has left a comment saying they are
working on the issue recently (3 days is a good rule). Leave a comment saying
that you would like to work on the issue.

### Choose which Git branch to use

The most important aspect of submitting pull requests is choosing which branch
to base your work on. Use these guidelines to make the decision:

- Use `master` for fixing problems in content that is already published, or
  making improvements to content that already exists.
  - Use a release branch (such as `dev-{{< release-branch >}}` for the {{< release-branch >}} release) to document upcoming features
  or changes for an upcoming release that is not yet published.
- Use a feature branch that has been agreed upon by SIG Docs to collaborate on
  big improvements or changes to the existing documentation, including content
  reorganization or changes to the look and feel of the website.

If you're still not sure which branch to choose, ask in `#sig-docs` on Slack or
attend a weekly SIG Docs meeting to get clarity.

### Submit a pull request

Follow these steps to submit a pull request to improve the Kubernetes
documentation.

1.  On the page where you see the issue, click the pencil icon at the top right.
    A new GitHub page appears, with some help text.
2.  If you have never created a fork of the Kubernetes documentation
    repository, you are prompted to do so. Create the fork under your GitHub
    username, rather than another organization you may be a member of. The
    fork usually has a URL such as `https://github.com/<username>/website`,
    unless you already have a repository with a conflicting name.

    The reason you are prompted to create a fork is that you do not have
    access to push a branch directly to the definitive Kubernetes repository.

3.  The GitHub Markdown editor appears with the source Markdown file loaded.
    Make your changes. Below the editor, fill in the **Propose file change**
    form. The first field is the summary of your commit message and should be
    no more than 50 characters long. The second field is optional, but can
    include more detail if appropriate.

    {{< note >}}
Do not include references to other GitHub issues or pull
requests in your commit message. You can add those to the pull request
description later.
{{< /note >}}
      
    Click **Propose file change**. The change is saved as a commit in a
    new branch in your fork, which is automatically named something like
    `patch-1`.

4.  The next screen summarizes the changes you made, by comparing your new
    branch (the **head fork** and **compare** selection boxes) to the current
    state of the **base fork** and **base** branch (`master` on the
    `kubernetes/website` repository by default). You can change any of the
    selection boxes, but don't do that now. Have a look at the difference
    viewer on the bottom of the screen, and if everything looks right, click
    **Create pull request**.
    
    {{< note >}}
If you don't want to create the pull request now, you can do it
later, by browsing to the main URL of the Kubernetes website repository or
your fork's repository. The GitHub website will prompt you to create the
pull request if it detects that you pushed a new branch to your fork.
{{< /note >}}
    
5.  The **Open a pull request** screen appears. The subject of the pull request
    is the same as the commit summary, but you can change it if needed. The
    body is populated by your extended commit message (if present) and some
    template text. Read the template text and fill out the details it asks for,
    then delete the extra template text. Leave the
    **Allow edits from maintainers** checkbox selected. Click
    **Create pull request**.
    
    Congratulations! Your pull request is available in
    [Pull requests](https://github.com/kubernetes/website/pulls).

    After a few minutes, you can preview the website with your PR's changes
    applied. Go to the **Conversation** tab of your PR and click the **Details**
    link for the `deploy/netlify` test, near the bottom of the page. It opens in
    the same browser window by default.

6.  Wait for review. Generally, reviewers are suggested by the `k8s-ci-robot`.
    If a reviewer asks you to make changes, you can go to the **Files changed**
    tab and click the pencil icon on any files that have been changed by the
    pull request. When you save the changed file, a new commit is created in
    the branch being monitored by the pull request.

7.  If your change is accepted, a reviewer merges your pull request, and the
    change is live on the Kubernetes website a few minutes later.

This is only one way to submit a pull request. If you are already a Git and
GitHub advanced user, you can use a local GUI or command-line Git client
instead of using the GitHub UI. Some basics about using the command-line Git
client are discussed in the [intermediate](/docs/contribute/intermediate/) docs
contribution guide.

## Review docs pull requests

People who are not yet approvers or reviewers can still review pull requests.
The reviews are not considered "binding", which means that your review alone
won't cause a pull request to be merged. However, it can still be helpful. Even
if you don't leave any review comments, you can get a sense of pull request
conventions and etiquette and get used to the workflow.

1.  Go to
    [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
    You see a list of every open pull request against the Kubernetes website and
    docs.

2.  By default, the only filter that is applied is `open`, so you don't see
    pull requests that have already been closed or merged. It's a good idea to
    apply the `cncf-cla: yes` filter, and for your first review, it's a good
    idea to add `size/S` or `size/XS`. The `size` label is applied automatically
    based on how many lines of code the PR modifies. You can apply filters using
    the selection boxes at the top of the page, or use
    [this shortcut](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+yes%22+label%3Asize%2FS) for only small PRs. All filters are `AND`ed together, so
    you can't search for both `size/XS` and `size/S` in the same query.

3.  Go to the **Files changed** tab. Look through the changes introduced in the
    PR, and if applicable, also look at any linked issues. If you see a problem
    or room for improvement, hover over the line and click the `+` symbol that
    appears.

      You can type a comment, and either choose **Add single comment** or **Start
      a review**. Typically, starting a review is better because it allows you to
      leave multiple comments and notifies the PR owner only when you have
      completed the review, rather than a separate notification for each comment.

4.  When finished, click **Review changes** at the top of the page. You can
    summarize your review, and you can choose to comment, approve, or request
    changes. New contributors should always choose **Comment**.

Thanks for reviewing a pull request! When you are new to the project, it's a
good idea to ask for feedback on your pull request reviews. The `#sig-docs`
Slack channel is a great place to do this.

## Write a blog post

Anyone can write a blog post and submit it for review. Blog posts should not be
commercial in nature and should consist of content that will apply broadly to
the Kubernetes community.

To submit a blog post, you can either submit it using the
[Kubernetes blog submission form](https://docs.google.com/forms/d/e/1FAIpQLSch_phFYMTYlrTDuYziURP6nLMijoXx_f7sLABEU5gWBtxJHQ/viewform),
or follow the steps below.

1.  [Sign the CLA](#sign-the-cla) if you have not yet done so.
2.  Have a look at the Markdown format for existing blog posts in the
    [website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts).
3.  Write out your blog post in a text editor of your choice.
4.  On the same link from step 2, click the **Create new file** button. Paste
    your content into the editor. Name the file to match the proposed title of
    the blog post, but don't put the date in the file name. The blog reviewers
    will work with you on the final file name and the date the blog will be
    published.
5.  When you save the file, GitHub will walk you through the pull request
    process.
6.  A blog post reviewer will review your submission and work with you on
    feedback and final details. When the blog post is approved, the blog will be
    scheduled for publication.

## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve
real-world problems. They are written in collaboration with the Kubernetes
marketing team, which is handled by the {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/master/content/en/case-studies).
Use the [Kubernetes case study submission form](https://www.cncf.io/people/end-user-community/)
to submit your proposal.

{{% /capture %}}

{{% capture whatsnext %}}

When you are comfortable with all of the tasks discussed in this topic and you
want to engage with the Kubernetes docs team in deeper ways, read the
[intermediate docs contribution guide](/docs/contribute/intermediate/).

{{% /capture %}}
