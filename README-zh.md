# Kubernetes 文档

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

欢迎！本仓库包含了所有用于构建 [Kubernetes 网站和文档](https://kubernetes.io/)的内容。
我们非常高兴您想要参与贡献！

## 贡献文档

您可以点击屏幕右上方都 **Fork** 按钮，在您的 Github 账户下拷贝创建一份仓库副本。这个副本叫做 *fork*。您可以对 fork 进行任意修改，
当准备好把变更提交给我们时，您可以通过创建一个拉取请求来通知我们。

创建拉取请求后，Kubernetes 审核人员将负责提供清晰且可操作的反馈。作为拉取请求的所有者，**您有责任修改拉取请求以解决 Kubernetes 审核者提供给您的反馈。**
另请注意，您最终可能收到多个 Kubernetes 审核人员为您提供反馈，或者您可能会收到 Kubernetes 审核人员最终的反馈与最初的反馈不尽相同。
此外，在某些情况下，您的一位评审员可能会在需要时要求 [Kubernetes 技术评审员](https://github.com/kubernetes/website/wiki/Tech-reviewers) 进行技术评审。
审稿人将尽最大努力及时提供反馈，但响应时间可能因情况而异。

有关为 Kubernetes 文档做出贡献的更多信息，请参阅：

* [开始贡献](https://kubernetes.io/docs/contribute/start/)
* [换成您的文档变更](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [使用页面模版](http://kubernetes.io/docs/contribute/style/page-templates/)
* [文档风格指南](http://kubernetes.io/docs/contribute/style/style-guide/)
* [本地化 Kubernetes 文档](https://kubernetes.io/docs/contribute/localization/)

## `README.md` 的本地化 Kubernetes 文档

### 中文

可以通过以下方式联系中文本地化的维护人员：

* He Xiaolong ([GitHub - @markthink](https://github.com/markthink))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-zh)

## 在本地使用 docker 运行网站

在本地运行 Kubernetes 网站的推荐方法是运行包含 [Hugo](https://gohugo.io) 静态网站生成器的专用 [Docker](https://docker.com) 镜像。

> 如果您使用的是 Windows，则需要一些工具，可以使用 [Chocolatey](https://chocolatey.org) 进行安装。`choco install make`

> 如果您更喜欢在没有 Docker 的情况下在本地运行网站，请参阅下面的[使用 Hugo 在本地运行网站](#running-the-site-locally-using-hugo) 章节。

如果您已经[安装运行](https://www.docker.com/get-started)了 Docker，使用 `kubernetes-hugo` 命令在本地创建 Docker 镜像：

```bash
make docker-image
```

一旦创建了镜像，您就可以在本地运行网站了：

```bash
make docker-serve
```

打开浏览器访问 http://localhost:1313 以查看网站。当您对源文件进行更改时，Hugo 会更新网站并强制刷新浏览器。

## 使用 Hugo 在本地运行网站

See the [official Hugo documentation](https://gohugo.io/getting-started/installing/) for Hugo installation instructions. Make sure to install the Hugo version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L9) file.
有关 Hugo 安装说明，请参阅 [Hugo 官方文档](https://gohugo.io/getting-started/installing/)。
确保在 Hugo 的安装版本由 [`netlify.toml`](netlify.toml#L9) 文件中的 `HUGO_VERSION`环境变量进行指定。

安装 Hugo 后，在本地运行网站：

```bash
make serve
```

这将在端口 1313 上启动本地 Hugo 服务器。打开浏览器访问 http://localhost:1313 查看网站。当您对源文件进行更改时，Hugo 会更新网站并强制刷新浏览器。

## 社区、讨论、贡献和支持

了解如何在[社区页面](http://kubernetes.io/community/)上与 Kubernetes 社区互动。

您可以通过以下方式联系该项目的维护人员：

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### 行为准则

参与 Kubernetes 社区受 [Kubernetes 行为准则](code-of-conduct.md)的约束。

## 感谢！

Kubernetes 因为社区的参与而蓬勃发展，感谢您对我们网站和文档的贡献！