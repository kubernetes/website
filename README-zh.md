# Kubernetes 文档

<!--
# The Kubernetes documentation
-->

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-master-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

<!--
This repository contains the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/). We're glad that you want to contribute!
-->
本仓库包含了所有用于构建 [Kubernetes 网站和文档](https://kubernetes.io/) 的软件资产。
我们非常高兴您想要参与贡献！

<!--
## Running the website locally using Hugo

See the [official Hugo documentation](https://gohugo.io/getting-started/installing/) for Hugo installation instructions. Make sure to install the Hugo extended version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L10) file.
-->
## 在本地使用 Hugo 来运行网站

请参考 [Hugo 的官方文档](https://gohugo.io/getting-started/installing/)了解 Hugo 的安装指令。
请确保安装的是 [`netlify.toml`](netlify.toml#L10) 文件中环境变量 `HUGO_VERSION` 所指定的
Hugo 扩展版本。

<!--
Before building the site, clone the Kubernetes website repository:
-->
在构造网站之前，先克隆 Kubernetes website 仓库：

```bash
git clone https://github.com/kubernetes/website.git
cd website
git submodule update --init --recursive
```

<!--
**Note:**  The Kubernetes website deploys the [Docsy Hugo theme](https://github.com/google/docsy#readme).
If you have not updated your website repository, the `website/themes/docsy` directory is empty.
The site cannot build without a local copy of the theme.

Update the website theme:
-->
**注意：** Kubernetes 网站要部署 [Docsy Hugo 主题](https://github.com/google/docsy#readme).
如果你还没有更新你本地的 website 仓库，目录 `website/themes/docsy`
会是空目录。
在本地没有主题副本的情况下，网站无法正常构造。

使用下面的命令更新网站主题：

```bash
git submodule update --init --recursive --depth 1
```

<!--
To build and test the site locally, run:
-->
若要在本地构造和测试网站，请运行：

```bash
hugo server --buildFuture
```

<!--
This will start the local Hugo server on port 1313. Open up your browser to http://localhost:1313 to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
-->
上述命令会在端口 1313 上启动本地 Hugo 服务器。
启动浏览器，打开 http://localhost:1313 来查看网站。
当你对源文件作出修改时，Hugo 会更新网站并强制浏览器执行刷新操作。

<!--
## Get involved with SIG Docs

Learn more about SIG Docs Kubernetes community and meetings on the [community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

You can also reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
-->
## 参与 SIG Docs 工作

通过 [社区页面](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)
进一步了解 SIG Docs Kubernetes 社区和会议信息。

你也可以通过以下渠道联系本项目的维护人员：

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

<!--
## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a *fork*. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.  As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**
-->
## 为文档做贡献

你也可以点击屏幕右上方区域的 **Fork** 按钮，在你自己的 GitHub
账号下创建本仓库的拷贝。此拷贝被称作 *fork*。
你可以在自己的拷贝中任意地修改文档，并在你已准备好将所作修改提交给我们时，
在你自己的拷贝下创建一个拉取请求（Pull Request），以便让我们知道。

一旦你创建了拉取请求，某个 Kubernetes 评审人会负责提供明确的、可执行的反馈意见。
作为拉取请求的拥有者，*修改拉取请求以解决 Kubernetes
评审人所提出的反馈是你的责任*。

<!--
Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.

Furthermore, in some cases, one of your reviewers might ask for a technical review from a Kubernetes tech reviewer when needed.  Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.
-->
还要提醒的一点，有时可能会有不止一个 Kubernetes 评审人为你提供反馈意见。
有时候，某个评审人的意见和另一个最初被指派的评审人的意见不同。

更进一步，在某些时候，评审人之一可能会在需要的时候请求 Kubernetes
技术评审人来执行技术评审。
评审人会尽力及时地提供反馈意见，不过具体的响应时间可能会因时而异。

<!--
For more information about contributing to the Kubernetes documentation, see:

* [Contribute to Kubernetes docs](https://kubernetes.io/docs/contribute/)
* [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)
-->
有关为 Kubernetes 文档做出贡献的更多信息，请参阅：

* [贡献 Kubernetes 文档](https://kubernetes.io/docs/contribute/)
* [页面内容类型](http://kubernetes.io/docs/contribute/style/page-content-types/)
* [文档风格指南](http://kubernetes.io/docs/contribute/style/style-guide/)
* [本地化 Kubernetes 文档](https://kubernetes.io/docs/contribute/localization/)

## 中文本地化

可以通过以下方式联系中文本地化的维护人员：

* Rui Chen ([GitHub - @chenrui333](https://github.com/chenrui333))
* He Xiaolong ([GitHub - @markthink](https://github.com/markthink))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-zh)

<!--
### Code of conduct

Participation in the Kubernetes community is governed by the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md).
-->
### 行为准则

参与 Kubernetes 社区受 [CNCF 行为准则](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)约束。

<!--
## Thank you!

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!
-->
## 感谢！

Kubernetes 因为社区的参与而蓬勃发展，感谢您对我们网站和文档的贡献！
