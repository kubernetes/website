---
title: 创建一个文档 PR(Pull Request)
cn-approvers:
- chentao1596
---
<!--
---
title: Creating a Documentation Pull Request
---
-->

{% capture overview %}

<!--
To contribute to the Kubernetes documentation, create a pull request against the
[kubernetes/kubernetes.github.io](https://github.com/kubernetes/kubernetes.github.io){: target="_blank"}
repository. This page shows how to create a pull request.
-->
想要对 Kubernetes 文档提交贡献，需要在 [kubernetes/website](https://github.com/kubernetes/website){: target="_blank"} 仓库中创建 PR。本页展示怎么样创建一个 PR。

{% endcapture %}

{% capture prerequisites %}

<!--
1. Create a [GitHub account](https://github.com){: target="_blank"}.
-->
1. 创建一个 [GitHub 账户](https://github.com){: target="_blank"}。

<!--
1. Sign the
[Linux Foundation Contributor License Agreement](https://identity.linuxfoundation.org/projects/cncf){: target="_blank"}.
-->
1. 签署 [Linux 基金会贡献许可协议](https://identity.linuxfoundation.org/projects/cncf){: target="_blank"}。

<!--
Documentation will be published under the [CC BY SA 4.0](https://git.k8s.io/kubernetes.github.io/LICENSE) license.
-->
文档将通过 [CC BY SA 4.0](https://git.k8s.io/kubernetes.github.io/LICENSE) 协议发布。

{% endcapture %}

{% capture steps %}

<!--
## Creating a fork of the Kubernetes documentation repository
-->
## 创建一个 Kubernetes 文档仓库的 fork

<!--
1. Go to the
[kubernetes/kubernetes.github.io](https://github.com/kubernetes/kubernetes.github.io){: target="_blank"}
repository.
-->
1. 进入仓库 [kubernetes/website](https://github.com/kubernetes/website){: target="_blank"}。

<!--
1. In the upper-right corner, click **Fork**. This creates a copy of the
Kubernetes documentation repository in your GitHub account. The copy
is called a *fork*.
-->
1. 在右上角，点击 **Fork**。这将在您的 GitHub 账户下创建一个 Kubernetes 文档仓库的副本，这个副本被称为一个 *fork*。

<!--
## Making your changes
-->
## 进行您的修改

<!--
1. In your GitHub account, in your fork of the Kubernetes docs, create
a new branch to use for your contribution.
-->
1. 在 GitHub 账户的 Kubernetes 文档 fork 下，创建一个用于进行贡献的新分支。

<!--
1. In your new branch, make your changes and commit them. If you want to
[write a new topic](/docs/home/contribute/write-new-topic/),
choose the
[page type](/docs/home/contribute/page-templates/)
that is the best fit for your content.
-->
1. 在新分支中，做出更改并提交它们。如果您想 [写一个新的主题](/docs/home/contribute/write-new-topic/)，请选择最适合您的内容的 [页面类型](/docs/home/contribute/page-templates/)。

<!--
## Submitting a pull request to the master branch (Current Release)
-->
## 提交 PR 到主分支（当前版本）

<!--
If you want your change to be published in the released version Kubernetes docs,
create a pull request against the master branch of the Kubernetes
documentation repository.
-->
如果希望变更在 Kubernetes 文档发布的版本中进行发布，您需要在 Kubernetes 文档仓库的主分支下创建一个 PR。

<!--
1. In your GitHub account, in your new branch, create a pull request
against the master branch of the kubernetes/kubernetes.github.io
repository. This opens a page that shows the status of your pull request.
-->
1. 在 GitHub 账户的新分支中，创建一个 kubernetes/website 仓库的主分支下的 PR。之后会打开一个页面，显示您 PR 的状态。

<!--
1. Click **Show all checks**. Wait for the **deploy/netlify** check to complete.
To the right of **deploy/netlify**, click **Details**. This opens a staging
site where you can verify that your changes have rendered correctly.
-->
1. 点击 **Show all checks**。等待 **deploy/netlify** 检查完成。在 **deploy/netlify** 的右边点击 **Details** 将打开一个预览站点，您可以在此验证更改是否正确。

<!--
1. During the next few days, check your pull request for reviewer comments.
If needed, revise your pull request by committing changes to your
new branch in your fork.
-->
1. 接下来的时间里，检查 PR 的评审意见。如果有必要的话，通过在 fork 中对新分支进行变更，修改您的 PR。

<!--
## Submitting a pull request to the &lt;vnext&gt; branch (Upcoming Release)
-->
## 提交 PR 到&lt;vnext&gt; 分支（即将发布）

<!--
If your documentation change should not be released until the next release of
the Kubernetes product, create a pull request against the &lt;vnext&gt; branch
of the Kubernetes documentation repository. The &lt;vnext&gt; branch has the
form `release-<version-number>`, for example release-1.5.
-->
如果对文档的变更应该在下个 Kubernetes 产品版本中发布，那么您需要在 Kubernetes 文档仓库的 &lt;vnext&gt; 分支中创建 PR。&lt;vnext&gt; 分支的格式为 `release-<version-number>`，例如 release-1.5。

<!--
1. In your GitHub account, in your new branch, create a pull request
against the &lt;vnext&gt; branch of the kubernetes/kubernetes.github.io
repository. This opens a page that shows the status of your pull request.
-->
1. 在 GitHub 账户的新分支中，创建一个 kubernetes/website 仓库的 &lt;vnext&gt; 分支下的 PR。之后会打开一个页面，显示您 PR 的状态。

<!--
1. Click **Show all checks**. Wait for the **deploy/netlify** check to complete.
To the right of **deploy/netlify**, click **Details**. This opens a staging
site where you can verify that your changes have rendered correctly.
-->
1. 点击 **Show all checks**。等待 **deploy/netlify** 检查完成。在 **deploy/netlify** 的右边，点击 **Details**，将打开一个验证您的更改是否正确的预览站点。

<!--
1. During the next few days, check your pull request for reviewer comments.
If needed, revise your pull request by committing changes to your
new branch in your fork.
-->
1. 接下来的时间里，检查 PR 的评审意见。如果有必要的话，通过在 fork 中对新分支进行变更，修改您的 PR。

<!--
The staging site for the upcoming Kubernetes release is here:
[http://kubernetes-io-vnext-staging.netlify.com/](http://kubernetes-io-vnext-staging.netlify.com/).
The staging site reflects the current state of what's been merged in the
release branch, or in other words, what the docs will look like for the
next upcoming release. It's automatically updated as new PRs get merged.
-->
Kubernetes 即将发布的版本的预览站点为：[http://kubernetes-io-vnext-staging.netlify.com/](http://kubernetes-io-vnext-staging.netlify.com/)。预览站点反映了将要合入到发布分支的内容的当前状态，换句话说，也就是接下来的版本的内容。当新的PR合入的时候，它会自动更新。

{% endcapture %}

{% capture whatsnext %}
<!--
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/).
-->
* 学习 [写一个主题](/docs/home/contribute/write-new-topic/)。
* 学习 [使用网页模板](/docs/home/contribute/page-templates/)。
* 学习 [预览您的变更](/docs/home/contribute/stage-documentation-changes/)。
{% endcapture %}

{% include templates/task.md %}
