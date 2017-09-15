---
title: Staging Your Documentation Changes
---

{% capture overview %}
This page shows how to stage content that you want to contribute
to the Kubernetes documentation.
{% endcapture %}

{% capture prerequisites %}
Create a fork of the Kubernetes documentation repository as described in
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).
{% endcapture %}

{% capture steps %}

## Staging a pull request

When you create a pull request, either against the master or &lt;vnext&gt;
branch, your changes are staged in a custom subdomain on Netlify so that
you can see your changes in rendered form before the pull request is merged.

1. In your GitHub account, in your new branch, submit a pull request to the
kubernetes/kubernetes.github.io repository. This opens a page that shows the
status of your pull request.

1. Look for a comment that says **Deploy preview ready!**. In the comment, click
the link to the Netlify page:

        https://deploy-preview-&lt;pr-number&gt;--kubernetes-io-master-staging.netlify.com

    This opens a staging site where you can see your changes.

Here's another way to find the staging site. Scroll down to the list of automated
checks. Click **Show all checks**. Wait for the **deploy/netlify** check to complete.
To the right of **deploy/netlify**, click **Details**.

{% endcapture %}

{% capture whatsnext %}
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
{% endcapture %}

{% include templates/task.md %}
