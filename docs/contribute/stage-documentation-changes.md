---
---

{% capture overview %}
This page shows how to stage content that you want to contribute
to the Kubernetes documentation.
{% endcapture %}

{% capture prerequisites %}
Create a fork of the Kubernetes documentation repository as described in
[Creating a Documentation Pull Request](/docs/contribute/create-pull-request/).
{% endcapture %}

{% capture steps %}

### Staging from your GitHub account

GitHub provides staging of content in your master branch. Note that you
might not want to merge your changes into your master branch. If that is
the case, choose another option for staging your content.

1. In your GitHub account, in your fork, merge your changes into
the master branch.

1. Change the name of your repository to `<your-username>.github.io`, where
`<your-username>` is the username of your GitHub account.

1. Delete the `CNAME` file.

1. View your staged content at this URL:

        https://<your-username>.github.io

### Staging a pull request

When you create pull request against the Kubernetes documentation
repository, you can see your changes on a staging server.

1. In your GitHub account, in your new branch, submit a pull request to the
kubernetes/kubernetes.github.io repository. This opens a page that shows the
status of your pull request.

1. Click **Show all checks**. Wait for the **deploy/netlify** check to complete.
To the right of **deploy/netlify**, click **Details**. This opens a staging
site where you see your changes.

### Staging locally using Docker

You can use the k8sdocs Docker image to run a local staging server. If you're
interested, you can view the
[Dockerfile](https://github.com/kubernetes/kubernetes.github.io/blob/master/staging-container/Dockerfile){: target="_blank"}
for this image.

1. Install Docker if you don't already have it.

1. Clone your fork to your local development machine.

1. In the root of your cloned repository, enter this command to start a local
web server:

        docker run -ti --rm -v "$PWD":/k8sdocs -p 4000:4000 gcr.io/google-samples/k8sdocs:1.0

1. View your staged content at
[http://localhost:4000](http://localhost:4000){: target="_blank"}.

### Staging locally without Docker

1. [Install Ruby 2.2 or later](https://www.ruby-lang.org){: target="_blank"}.

1. [Install RubyGems](https://rubygems.org){: target="_blank"}.

1. Verify that Ruby and RubyGems are installed:

        gem --version

1. Install the GitHub Pages package, which includes Jekyll:

        gem install github-pages

1. Clone your fork to your local development machine.

1. In the root of your cloned repository, enter this command to start a local
web server:

        jekyll serve

1. View your staged content at
[http://localhost:4000](http://localhost:4000){: target="_blank"}.

{% endcapture %}

{% capture whatsnext %}
* Learn about [writing a new topic](/docs/contribute/write-new-topic/).
* Learn about [using page templates](/docs/contribute/page-templates/).
* Learn about [creating a pull request](/docs/contribute/create-pull-request/).
{% endcapture %}

{% include templates/task.md %}
