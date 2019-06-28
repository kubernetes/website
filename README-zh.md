# Kubernetes 文档
<!--
# The Kubernetes documentation
 -->

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

<!--
Welcome! This repository houses all of the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/).
We're glad that you want to contribute!
 -->
欢迎！本仓库包含了所有用于构建 [Kubernetes 网站和文档](https://kubernetes.io/)的内容。
我们非常高兴您想要参与贡献！

<!--
## Contributing to the docs
 -->
## 贡献文档

<!--
You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account.
This copy is called a *fork*. Make any changes you want in your fork,
and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.
 -->
您可以点击屏幕右上方的 **Fork** 按钮，在您的 GitHub 账户下创建一份本仓库的副本。这个副本叫做 *fork*。您可以对 fork 副本进行任意修改，
当准备好把修改提交给我们时，您可以通过创建一个 pull request 来告知我们。

<!--
Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.
As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**
Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.
Furthermore, in some cases, one of your reviewers might ask for a technical review from a [Kubernetes tech reviewer](https://github.com/kubernetes/website/wiki/Tech-reviewers) when needed.
Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.
 -->
创建 pull request 后，Kubernetes 审核人员将负责提供清晰且可操作的反馈。作为 pull request 的所有者，**您有责任修改 pull request 以解决 Kubernetes 审核者提供给您的反馈。**
另请注意，您最终可能会收到多个 Kubernetes 审核人员为您提供的反馈，也可能出现后面 Kubernetes 审核人员的反馈与前面审核人员的反馈不尽相同的情况。
此外，在某些情况下，您的某位评审员可能会在需要时要求 [Kubernetes 技术评审员](https://github.com/kubernetes/website/wiki/Tech-reviewers) 进行技术评审。
审稿人将尽最大努力及时提供反馈，但响应时间可能因情况而异。

<!--
For more information about contributing to the Kubernetes documentation, see:

* [Start contributing](https://kubernetes.io/docs/contribute/start/)
* [Staging Your Documentation Changes](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Using Page Templates](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Documentation Style Guide](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)
 -->
有关为 Kubernetes 文档做出贡献的更多信息，请参阅：

* [开始贡献](https://kubernetes.io/docs/contribute/start/)
* [缓存您的文档变更](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [使用页面模版](http://kubernetes.io/docs/contribute/style/page-templates/)
* [文档风格指南](http://kubernetes.io/docs/contribute/style/style-guide/)
* [本地化 Kubernetes 文档](https://kubernetes.io/docs/contribute/localization/)

<!--
## `README.md`'s Localizing Kubernetes Documentation
 -->
## `README.md` 的本地化 Kubernetes 文档

<!--
### Korean

You can reach the maintainers of Korean localization at:

* June Yi ([GitHub - @gochist](https://github.com/gochist))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-ko)
 -->
### 中文

可以通过以下方式联系中文本地化的维护人员：

* Rui Chen ([GitHub - @chenrui333](https://github.com/chenrui333))
* He Xiaolong ([GitHub - @markthink](https://github.com/markthink))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-zh)

<!--
## Running the website locally using Docker
 -->
## 在本地使用 docker 运行网站

<!--
The recommended way to run the Kubernetes website locally is to run a specialized [Docker](https://docker.com) image that includes the [Hugo](https://gohugo.io) static website generator.
 -->
在本地运行 Kubernetes 网站的推荐方法是运行包含 [Hugo](https://gohugo.io) 静态网站生成器的专用 [Docker](https://docker.com) 镜像。

<!--
> If you are running on Windows, you'll need a few more tools which you can install with [Chocolatey](https://chocolatey.org). `choco install make`
 -->
> 如果您使用的是 Windows，则需要一些工具，可以使用 [Chocolatey](https://chocolatey.org) 进行安装。`choco install make`

<!--
> If you'd prefer to run the website locally without Docker, see [Running the website locally using Hugo](#running-the-site-locally-using-hugo) below.
 -->
> 如果您更喜欢在没有 Docker 的情况下在本地运行网站，请参阅下面的[使用 Hugo 在本地运行网站](#running-the-site-locally-using-hugo) 章节。

<!--
If you have Docker [up and running](https://www.docker.com/get-started), build the `kubernetes-hugo` Docker image locally:
 -->
如果您已经[安装运行](https://www.docker.com/get-started)了 Docker，使用以下命令在本地构建 `kubernetes-hugo` Docker 镜像：

```bash
make docker-image
```

<!--
Once the image has been built, you can run the website locally:
 -->
一旦创建了镜像，您就可以在本地运行网站了：

```bash
make docker-serve
```

<!--
Open up your browser to http://localhost:1313 to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
 -->
打开浏览器访问 http://localhost:1313 以查看网站。当您对源文件进行更改时，Hugo 会更新网站并强制刷新浏览器。

<!--
## Running the website locally using Hugo
 -->
## 使用 Hugo 在本地运行网站

<!--
See the [official Hugo documentation](https://gohugo.io/getting-started/installing/) for Hugo installation instructions.
Make sure to install the Hugo version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L9) file.
 -->
有关 Hugo 的安装说明，请参阅 [Hugo 官方文档](https://gohugo.io/getting-started/installing/)。
确保安装对应版本的 Hugo，版本号由 [`netlify.toml`](netlify.toml#L9) 文件中的 `HUGO_VERSION` 环境变量指定。

<!--
To run the website locally when you have Hugo installed:
 -->
安装 Hugo 后，在本地运行网站：

```bash
make serve
```

<!--
This will start the local Hugo server on port 1313. Open up your browser to http://localhost:1313 to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
 -->
这将在 1313 端口上启动本地 Hugo 服务器。打开浏览器访问 http://localhost:1313 查看网站。当您对源文件进行更改时，Hugo 会更新网站并强制刷新浏览器。

<!--
## Community, discussion, contribution, and support
 -->
## 社区、讨论、贡献和支持

<!--
Learn how to engage with the Kubernetes community on the [community page](http://kubernetes.io/community/).
 -->
在[社区页面](http://kubernetes.io/community/)了解如何与 Kubernetes 社区互动。

<!--
You can reach the maintainers of this project at:
 -->
您可以通过以下方式联系该项目的维护人员：

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

<!--
### Code of conduct

Participation in the Kubernetes community is governed by the [Kubernetes Code of Conduct](code-of-conduct.md).
 -->
### 行为准则

参与 Kubernetes 社区受 [Kubernetes 行为准则](code-of-conduct.md)的约束。

<!--
## Thank you!

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!
 -->
## 感谢！

Kubernetes 因为社区的参与而蓬勃发展，感谢您对我们网站和文档的贡献！
