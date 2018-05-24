---
title: Staging Your Documentation Changes
content_template: templates/task
---

{{% capture overview %}}
This page shows how to stage content that you want to contribute
to the Kubernetes documentation.
{{% /capture %}}

{{% capture prerequisites %}}
Create a fork of the Kubernetes documentation repository as described in
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).
{{% /capture %}}

{{% capture steps %}}

## Staging a pull request

When you create a pull request, either against the master or &lt;vnext&gt;
branch, your changes are staged in a custom subdomain on Netlify so that
you can see your changes in rendered form before the pull request is merged.

1. In your GitHub account, in your new branch, submit a pull request to the
kubernetes/website repository. This opens a page that shows the
status of your pull request.

1. Scroll down to the list of automated checks. Click **Show all checks**.
Wait for the **deploy/netlify** check to complete. To the right of
**deploy/netlify**, click **Details**. This opens a staging site where you
can see your changes.

## Staging locally

1. <a href="https://gohugo.io/getting-started/installing/" target="_blank" class="_">Install Hugo 0.40.3 or later</a>.

1. Clone your fork to your local development machine.

1. In the root of your cloned repository, enter this command to start a local
web server:

    ```
    make serve
    ```

1. View your staged content at `http://localhost:1313`.

{{% /capture %}}

{{% capture whatsnext %}}
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
{{% /capture %}}


