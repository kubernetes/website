---
title: Creating a Documentation Pull Request
---

{% capture overview %}

To contribute to the Kubernetes documentation, create a pull request against the
[kubernetes/kubernetes.github.io](https://github.com/kubernetes/kubernetes.github.io){: target="_blank"}
repository. This page shows how to create a pull request.

{% endcapture %}

{% capture prerequisites %}

1. Create a [GitHub account](https://github.com){: target="_blank"}.

1. Sign the
[Linux Foundation Contributor License Agreement](https://identity.linuxfoundation.org/projects/cncf){: target="_blank"}.

Documentation will be published under the [CC BY SA 4.0](https://git.k8s.io/kubernetes.github.io/LICENSE) license.

{% endcapture %}

{% capture steps %}

## Creating a fork of the Kubernetes documentation repository

1. Go to the
[kubernetes/kubernetes.github.io](https://github.com/kubernetes/kubernetes.github.io){: target="_blank"}
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

## Submitting a pull request to the master branch (Current Release)

If you want your change to be published in the released version Kubernetes docs,
create a pull request against the master branch of the Kubernetes
documentation repository.

1. In your GitHub account, in your new branch, create a pull request
against the master branch of the kubernetes/kubernetes.github.io
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
against the &lt;vnext&gt; branch of the kubernetes/kubernetes.github.io
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

{% endcapture %}

{% capture whatsnext %}
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes).
{% endcapture %}

{% include templates/task.md %}
