---
title: Creating a Documentation Pull Request
content_template: templates/task
---

{{% capture overview %}}

To contribute to the Kubernetes documentation, create a pull request against the
<a href="https://github.com/kubernetes/website" target="_blank" class="_">kubernetes/website</a>
repository. This page shows how to create a pull request.

{{% /capture %}}

{{% capture prerequisites %}}

1. Create a <a href="https://github.com/" target="_blank" class="_">Github account</a>.

1. Sign the
  <a href="https://identity.linuxfoundation.org/projects/cncf" target="_blank" class="_">Linux Foundation Contributor License Agreement (CLA)</a>.

Documentation will be published under the [CC BY SA 4.0](https://git.k8s.io/website/LICENSE) license.

{{% /capture %}}

{{% capture steps %}}

## Creating a fork of the Kubernetes documentation repository

1. Go to the
   <a href="https://github.com/kubernetes/website" target="_blank" class="_">kubernetes/website</a>
   repository.

1. In the upper-right corner, click **Fork**. This creates a copy of the
Kubernetes documentation repository in your GitHub account. The copy
is called a *fork*.

## Making your changes

1. In your GitHub account, in your fork of the Kubernetes docs, create
a new branch to use for your contribution.

1. In your new branch, make your changes and commit them. If you want to
[write a new topic](/docs/home/contribute/write-new-topic/),
choose the
[page type](/docs/home/contribute/page-templates/)
that is the best fit for your content.

## Viewing your changes locally

You can use Hugo to see a preview of your changes locally.

1. [Install Hugo](https://gohugo.io/getting-started/installing/)
version 0.40.3 or later.

1. Go to the root directory of your clone of the Kubernetes docs, and
enter this command:

        hugo server

1. In your browser's address bar, enter `localhost:1313`.

## Viewing your changes in the Netlify preview

When you submit a pull request, you can see a preview of your changes at
[Netlify](https://www.netlify.com/). In your pull request, at the bottom,
to the right of **deploy/netlify**, click **Details**. Also, there is often
a link to the Netlify preview in the pull request comments.
 
## Submitting a pull request to the master branch (Current Release)

If you want your change to be published in the released version Kubernetes docs,
create a pull request against the master branch of the Kubernetes
documentation repository.

1. In your GitHub account, in your new branch, create a pull request
against the master branch of the kubernetes/website
repository. This opens a page that shows the status of your pull request.

1. Click **Show all checks**. Wait for the **deploy/netlify** check to complete.
To the right of **deploy/netlify**, click **Details**. This opens a staging
site where you can verify that your changes have rendered correctly.

1. During the next few days, check your pull request for reviewer comments.
If needed, revise your pull request by committing changes to your
new branch in your fork.

## Submitting a pull request to the &lt;vnext&gt; branch (Upcoming Release)

If your documentation change should not be released until the next release of
the Kubernetes product, create a pull request against the &lt;vnext&gt; branch
of the Kubernetes documentation repository. The &lt;vnext&gt; branch has the
form `release-<version-number>`, for example release-1.5.

1. In your GitHub account, in your new branch, create a pull request
against the &lt;vnext&gt; branch of the kubernetes/website
repository. This opens a page that shows the status of your pull request.

1. Click **Show all checks**. Wait for the **deploy/netlify** check to complete.
To the right of **deploy/netlify**, click **Details**. This opens a staging
site where you can verify that your changes have rendered correctly.

1. During the next few days, check your pull request for reviewer comments.
If needed, revise your pull request by committing changes to your
new branch in your fork.

The staging site for the upcoming Kubernetes release is here:
[http://kubernetes-io-vnext-staging.netlify.com/](http://kubernetes-io-vnext-staging.netlify.com/).
The staging site reflects the current state of what's been merged in the
release branch, or in other words, what the docs will look like for the
next upcoming release. It's automatically updated as new PRs get merged.

## Pull request review process for both Current and Upcoming Releases
Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.  As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**  Also note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one originally assigned to provide you feedback.  Furthermore, in some cases, one of your reviewers might ask for a technical review from a [Kubernetes tech reviewer](https://github.com/kubernetes/website/wiki/Tech-reviewers) when needed.  Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.

{{% /capture %}}

{{% capture whatsnext %}}
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/).
{{% /capture %}}


