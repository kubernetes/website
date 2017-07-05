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

1. Scroll down to the list of automated checks. Click **Show all checks**.
Wait for the **deploy/netlify** check to complete. To the right of
**deploy/netlify**, click **Details**. This opens a staging site where you
can see your changes.

## Staging locally using Docker

You can use the k8sdocs Docker image to run a local staging server. If you're
interested, you can view the
[Dockerfile](https://git.k8s.io/kubernetes.github.io/staging-container/Dockerfile){: target="_blank"}
for this image.

1. Install Docker if you don't already have it.

1. Clone your fork to your local development machine.

1. In the root of your cloned repository, enter this command to start a local
web server:

        docker run -ti --rm -v "$PWD":/k8sdocs -p 4000:4000 gcr.io/google-samples/k8sdocs:1.1

1. View your staged content at
http://localhost:4000.

## Staging locally without Docker

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
http://localhost:4000.

<i>NOTE: If you do not want Jekyll to interfere with your other globally installed gems, you can use `bundler`:</i> 
 
 	gem install bundler
 	bundle install
 	bundler exec jekyll serve

<i> Regardless of whether you use `bundler` or not, your copy of the site will then be viewable at: http://localhost:4000</i>

{% endcapture %}

{% capture whatsnext %}
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
{% endcapture %}

{% include templates/task.md %}
