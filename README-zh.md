# Kubernetes 文档

欢迎！此仓库用于存放构建 Kubernetes 网站及文档的必要资源。我们很高兴您能做出贡献！

## 对文档做出贡献

您可点击屏幕右上放的 **Fork** 按钮在您的 GitHub 账户下创建此仓库的拷贝。此拷贝被称为*派生*。您可在派生中随意作出更改，当您就绪时，请前往您的派生创建合并请求（Pull Request）。

一旦您创建了合并请求，一位 Kubernetes 审核员将为您提供清楚、可实行的反馈。作为合并请求者，**您有责任修改合并请求以迎合 Kubernetes 审核员对您的反馈。**同时请注意，您可能会收到多于一位 Kubernetes 审核员或收到另一位 Kubernetes 审核员的反馈。不仅如此，在某些情况下，审核员可能在必要情况下寻求 [Kubernetes 技术审核员](https://github.com/kubernetes/website/wiki/Tech-reviewers)的查审。审核员将尽全力快速提供反馈，但仍根据情况不同而不同。

要了解更多如何对 Kubernetes 文档做出贡献的信息，请参见：

* [开始贡献](https://kubernetes.io/docs/contribute/start/)
* [查看更改](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [使用模板](http://kubernetes.io/docs/contribute/style/page-templates/)
* [风格向导](http://kubernetes.io/docs/contribute/style/style-guide/)
* [本地化 Kubernetes 文档](https://kubernetes.io/docs/contribute/localization/)

## `README.md`'s Localizing Kubernetes Documentation

### 简体中文

在[简体中文读我文档](README-zh.md)中查看 `README.md` 的中文译本及做出贡献的简体中文译者。

## 使用 Docker 在本地搭建网站

运行 Kubernetes 网站的推荐方法是运行内置 [Hugo](https://gohugo.io) 静态网页生成器的客制化 [Docker](https://docker.com) 镜像。

> 若您使用 Windows，您可使用 [Chocolatey](https://chocolatey.org) 安装所需的其他工具。 `choco install make`

> 若您不想使用 Docker，请参见下方的[使用 Hugo 在本地搭建站点](#running-the-site-locally-using-hugo)。

若您有[运行中](https://www.docker.com/get-started)的 Docker，请使用下方的命令本地构建 `kubernetes-hugo` Docker 镜像：

```bash
make docker-image
```

镜像构建完毕时，您可使用下方命令在本地搭建站点：

```bash
make docker-serve
```

打开浏览器输入 http://localhost:1313 来查看网站。当您对源文件作出更改时，Hugo 将自动更新网址并强制浏览器刷新。

## 使用 Hugo 在本地搭建站点

请参见 [Hugo 官方文档](https://gohugo.io/getting-started/installing/)查看 Hugo 安装指南。请确保 Hugo 版本与在 [`netlify.toml`](netlify.toml#L9) 文件中指定的 `HUGO_VERSION` 环境变量版本号相同。

安装完 Hugo 后请使用下列命令在本地搭建站点：

```bash
make serve
```

此命令将在端口 1313 上启动本地 Hugo 服务器。打开浏览器输入 http://localhost:1313 来查看网站。当您对源文件作出更改时，Hugo 将自动更新网址并强制浏览器刷新。

## 感谢！

Kubernetes 有了社区参与才得以繁荣富强，我们十分感谢您对网站及文档所作出的贡献！
