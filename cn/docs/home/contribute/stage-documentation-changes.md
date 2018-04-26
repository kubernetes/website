---
cn-approvers:
- tianshapjq
title: 展示您对文档的修改
---
<!--
---
title: Staging Your Documentation Changes
---
-->

{% capture overview %}
<!--
This page shows how to stage content that you want to contribute
to the Kubernetes documentation.
-->
本页面将介绍如何展示您对 Kubernetes 文档提交的修改内容。
{% endcapture %}

{% capture prerequisites %}
<!--
Create a fork of the Kubernetes documentation repository as described in
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).
-->
按照 [创建一个文档的 Pull Request](/docs/home/contribute/create-pull-request/) 中的描述创建一个 Kubernetes 文档存储库的分支。
{% endcapture %}

{% capture steps %}

<!--
## Staging a pull request
-->
## 展示一个 pull request

<!--
When you create a pull request, either against the master or &lt;vnext&gt;
branch, your changes are staged in a custom subdomain on Netlify so that
you can see your changes in rendered form before the pull request is merged.
-->
当您创建一个 pull request后，无论是针对 master 还是 &lt;vnext&gt; 分支，您的修改都会被展示在 Netlify 的一个自定义子域中，以便您能在 pull request 被合入前在表单中查看您的修改。

<!--
1. In your GitHub account, in your new branch, submit a pull request to the
kubernetes/website repository. This opens a page that shows the
status of your pull request.
-->
1. 通过您的 GitHub 账号，在您的新分支中提交一个 pull request 到 kubernetes/website 存储库。这将打开一个页面以展示您的 pull request 的状态。

<!--
1. Scroll down to the list of automated checks. Click **Show all checks**.
Wait for the **deploy/netlify** check to complete. To the right of
**deploy/netlify**, click **Details**. This opens a staging site where you
can see your changes.
-->
1. 在页面中下拉到自动化检查列表所在位置。点击 **Show all checks**。等待 **deploy/netlify** 检查完毕。在 **deploy/netlify** 的右侧点击 **Details**。这将会打开一个页面展示您所做的修改。

<!--
## Staging locally using Docker
-->
## 使用 Docker 在本地进行展示

<!--
You can use the k8sdocs Docker image to run a local staging server. If you're
interested, you can view the
[Dockerfile](https://git.k8s.io/website/staging-container/Dockerfile){: target="_blank"}
for this image.
-->
您可以通过使用 k8sdocs Docker 镜像来运行一个本地的展示服务器。如果您感兴趣的话，可以查看这个镜像的 [Dockerfile](https://git.k8s.io/website/staging-container/Dockerfile){: target="_blank"}。

<!--
1. Install Docker if you don't already have it.
-->
1. 如果您还没有安装Docker，请先安装它。

<!--
1. Clone your fork to your local development machine.
-->
1. 克隆您的分支到您的本地开发机器。

<!--
1. In the root of your cloned repository, enter this command to start a local
web server:
-->
1. 在您克隆的存储库的根路径下，输入以下命令来启动一个本地的 web 服务器：

       make stage

<!--
   This will run the following command:
-->
   这将会运行以下命令：

       docker run -ti --rm -v "$PWD":/k8sdocs -p 4000:4000 gcr.io/google-samples/k8sdocs:1.1

<!--
1. View your staged content at `http://localhost:4000`.
-->
1. 通过 `http://localhost:4000` 查看您的待展示内容。

<!--
## Staging locally without Docker
-->
## 在没有 Docker 的情况下进行本地展示

<!--
1. [Install Ruby 2.2 or later](https://www.ruby-lang.org){: target="_blank"}.
-->
1. [安装 Ruby 2.2 或更新的版本](https://www.ruby-lang.org){: target="_blank"}。

<!--
1. [Install RubyGems](https://rubygems.org){: target="_blank"}.
-->
1. [安装 RubyGems](https://rubygems.org){: target="_blank"}。

<!--
1. Verify that Ruby and RubyGems are installed:
-->
1. 确认 Ruby 和 RubyGems 已经正确安装：

       gem --version

<!--
1. Install the GitHub Pages package, which includes Jekyll:
-->
1. 安装 GitHub Pages 包，这个包已经包含了 Jekyll：

       gem install github-pages

<!--
1. Clone your fork to your local development machine.
-->
1. 克隆您的分支到您的本地开发机器。

<!--
1. In the root of your cloned repository, enter this command to start a local
web server:
-->
1. 在您克隆的存储库的根路径下，输入以下命令来启动一个本地的 web 服务器：

       jekyll serve

<!--
1. View your staged content at `http://localhost:4000`.
-->
1. 通过 `http://localhost:4000` 查看您的待展示内容。

<!--
**Note:** If you do not want Jekyll to interfere with your other globally installed gems, you can use `bundler`: <br /> <br /> ```gem install bundler``` <br /> ```bundle install``` <br /> ```bundler exec jekyll serve``` <br /> <br /> Regardless of whether you use `bundler` or not, your copy of the site will then be viewable at: http://localhost:4000
-->
**注意：** 如果您不希望 Jekyll 干扰到您安装的其它一些全局的 gem，您可以使用 `bundler`：<br /> <br /> ```gem install bundler``` <br /> ```bundle install``` <br /> ```bundler exec jekyll serve``` <br /> <br /> 无论是否使用 `bundler`，您都可以通过 http://localhost:4000 浏览您的网站副本。
{: .note}

{% endcapture %}

{% capture whatsnext %}
<!--
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
-->
* 学习 [编写一个新的主题](/docs/home/contribute/write-new-topic/)。
* 学习 [使用页面模板](/docs/home/contribute/page-templates/)。
* 学习 [创建一个 pull request](/docs/home/contribute/create-pull-request/)。
{% endcapture %}

{% include templates/task.md %}
