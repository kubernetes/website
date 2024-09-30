# Kubernetes 文档

<!--
# The Kubernetes documentation
-->

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

<!--
This repository contains the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/). We're glad that you want to contribute!
-->
本仓库包含了所有用于构建 [Kubernetes 网站和文档](https://kubernetes.io/)的软件资产。
我们非常高兴你想要参与贡献！

<!--
- [Contributing to the docs](#contributing-to-the-docs)
- [Localization READMEs](#localization-readmemds)
-->
- [为文档做贡献](#为文档做贡献)
- [README 本地化](#readme-本地化)

<!--
## Using this repository

You can run the website locally using [Hugo (Extended version)](https://gohugo.io/), or you can run it in a container runtime. We strongly recommend using the container runtime, as it gives deployment consistency with the live website.
-->
## 使用这个仓库

可以使用 [Hugo（扩展版）](https://gohugo.io/)在本地运行网站，也可以在容器中运行它。
强烈建议使用容器，因为这样可以和在线网站的部署保持一致。

<!--
## Prerequisites

To use this repository, you need the following installed locally:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Extended version)](https://gohugo.io/)
- A container runtime, like [Docker](https://www.docker.com/).
-->
## 前提条件

使用这个仓库，需要在本地安装以下软件：

- [npm](https://www.npmjs.com/)
- [Go](https://golang.google.cn/)
- [Hugo（Extended 版本）](https://gohugo.io/)
- 容器运行时，比如 [Docker](https://www.docker.com/)。

<!--
Before you start, install the dependencies. Clone the repository and navigate to the directory:
-->
开始前，先安装这些依赖。克隆本仓库并进入对应目录：

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

<!--
The Kubernetes website uses the [Docsy Hugo theme](https://github.com/google/docsy#readme). Even if you plan to run the website in a container, we strongly recommend pulling in the submodule and other development dependencies by running the following:
-->
Kubernetes 网站使用的是 [Docsy Hugo 主题](https://github.com/google/docsy#readme)。
即使你打算在容器中运行网站，我们也强烈建议你通过运行以下命令来引入子模块和其他开发依赖项：

<!-- 
### Windows
```powershell
# fetch submodule dependencies
git submodule update --init --recursive --depth 1
``` 
-->
### Windows

```powershell
# 获取子模块依赖
git submodule update --init --recursive --depth 1
```

<!-- 
### Linux / other Unix
```bash
# fetch submodule dependencies
make module-init
``` 
-->
### Linux / 其它 Unix

```bash
# 获取子模块依赖
make module-init
```

<!--
## Running the website using a container

To build the site in a container, run the following:
-->
## 在容器中运行网站

要在容器中构建网站，请运行以下命令：

<!--
```bash
# You can set $CONTAINER_ENGINE to the name of any Docker-like container tool
make container-serve
```
-->
```bash
# 你可以将 $CONTAINER_ENGINE 设置为任何 Docker 类容器工具的名称
make container-serve
```

<!--
If you see errors, it probably means that the hugo container did not have enough computing resources available. To solve it, increase the amount of allowed CPU and memory usage for Docker on your machine ([MacOS](https://docs.docker.com/desktop/settings/mac/) and [Windows](https://docs.docker.com/desktop/settings/windows/)).
-->
如果你看到错误，这可能意味着 Hugo 容器没有足够的可用计算资源。
要解决这个问题，请增加机器（[MacOS](https://docs.docker.com/desktop/settings/mac/)
和 [Windows](https://docs.docker.com/desktop/settings/windows/)）上
Docker 允许的 CPU 和内存使用量。

<!--
Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
-->
启动浏览器，打开 <http://localhost:1313> 来查看网站。
当你对源文件作出修改时，Hugo 会更新网站并强制浏览器执行刷新操作。

<!--
## Running the website locally using Hugo

Make sure to install the Hugo extended version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L11) file.

To install dependencies, deploy and test the site locally, run:
-->
## 在本地使用 Hugo 来运行网站

请确保安装的是 [`netlify.toml`](netlify.toml#L11) 文件中环境变量 `HUGO_VERSION` 所指定的
Hugo Extended 版本。

若要在本地安装依赖，构建和测试网站，运行以下命令：

<!--
- For macOS and Linux
-->
- 对于 macOS 和 Linux

  ```bash
  npm ci
  make serve
  ```

<!--
- For Windows (PowerShell)
-->
- 对于 Windows (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

<!--
This will start the local Hugo server on port 1313. Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
-->
上述命令会在端口 1313 上启动本地 Hugo 服务器。
启动浏览器，打开 <http://localhost:1313> 来查看网站。
当你对源文件作出修改时，Hugo 会更新网站并强制浏览器执行刷新操作。

<!--
## Building the API reference pages
-->
## 构建 API 参考页面

<!--
The API reference pages located in `content/en/docs/reference/kubernetes-api` are built from the Swagger specification, also known as OpenAPI specification, using <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

To update the reference pages for a new Kubernetes release follow these steps:
-->
位于 `content/en/docs/reference/kubernetes-api` 的 API 参考页面是使用
<https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>
根据 Swagger 规范（也称为 OpenAPI 规范）构建的。

要更新 Kubernetes 新版本的参考页面，请执行以下步骤：

<!--
1. Pull in the `api-ref-generator` submodule:
-->
1. 拉取 `api-ref-generator` 子模块：

   ```bash
   git submodule update --init --recursive --depth 1
   ```

<!--
2. Update the Swagger specification:
-->
2. 更新 Swagger 规范：

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

<!--
3. In `api-ref-assets/config/`, adapt the files `toc.yaml` and `fields.yaml` to reflect the changes of the new release.
-->
3. 在 `api-ref-assets/config/` 中，调整文件 `toc.yaml` 和 `fields.yaml` 以反映新版本的变化。

<!--
4. Next, build the pages:
-->
4. 接下来，构建页面：

   ```bash
   make api-reference
   ```

   <!--
   You can test the results locally by making and serving the site from a container image:
   -->
   你可以通过从容器镜像创建和提供站点来在本地测试结果：

   ```bash
   make container-image
   make container-serve
   ```

   <!--
   In a web browser, go to <http://localhost:1313/docs/reference/kubernetes-api/> to view the API reference.
   -->
   在 Web 浏览器中，打开 <http://localhost:1313/docs/reference/kubernetes-api/> 查看 API 参考页面。

<!--
5. When all changes of the new contract are reflected into the configuration files `toc.yaml` and `fields.yaml`, create a Pull Request with the newly generated API reference pages.
-->
5. 当所有新的更改都反映到配置文件 `toc.yaml` 和 `fields.yaml` 中时，使用新生成的 API
   参考页面创建一个 Pull Request。

<!--
## Troubleshooting

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo is shipped in two set of binaries for technical reasons. The current website runs based on the **Hugo Extended** version only. In the [release page](https://github.com/gohugoio/hugo/releases) look for archives with `extended` in the name. To confirm, run `hugo version` and look for the word `extended`.
-->
## 故障排除

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

由于技术原因，Hugo 会发布两套二进制文件。
当前网站仅基于 **Hugo Extended** 版本运行。
在[发布页面](https://github.com/gohugoio/hugo/releases)中查找名称为 `extended` 的归档。
可以运行 `hugo version` 查看是否有单词 `extended` 来确认。

<!--
### Troubleshooting macOS for too many open files

If you run `make serve` on macOS and receive the following error:
-->
### 对 macOS 上打开太多文件的故障排除

如果在 macOS 上运行 `make serve` 收到以下错误：

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

<!--
Try checking the current limit for open files:
-->
试着查看一下当前打开文件数的限制：

`launchctl limit maxfiles`

<!--
Then run the following commands (adapted from <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):
-->
然后运行以下命令（参考 <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>）：

<!--
# These are the original gist links, linking to my gists now.
-->
```shell
#!/bin/sh

# 这些是原始的 gist 链接，现在则会链接到我的 gist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

<!--
This works for Catalina as well as Mojave macOS.
-->
这适用于 Catalina 和 Mojave macOS。

### 对执行 make container-image 命令部分地区访问超时的故障排除

现象如下：

```shell
langs/language.go:23:2: golang.org/x/text@v0.3.7: Get "https://proxy.golang.org/golang.org/x/text/@v/v0.3.7.zip": dial tcp 142.251.43.17:443: i/o timeout
langs/language.go:24:2: golang.org/x/text@v0.3.7: Get "https://proxy.golang.org/golang.org/x/text/@v/v0.3.7.zip": dial tcp 142.251.43.17:443: i/o timeout
common/text/transform.go:21:2: golang.org/x/text@v0.3.7: Get "https://proxy.golang.org/golang.org/x/text/@v/v0.3.7.zip": dial tcp 142.251.43.17:443: i/o timeout
common/text/transform.go:22:2: golang.org/x/text@v0.3.7: Get "https://proxy.golang.org/golang.org/x/text/@v/v0.3.7.zip": dial tcp 142.251.43.17:443: i/o timeout
common/text/transform.go:23:2: golang.org/x/text@v0.3.7: Get "https://proxy.golang.org/golang.org/x/text/@v/v0.3.7.zip": dial tcp 142.251.43.17:443: i/o timeout
hugolib/integrationtest_builder.go:29:2: golang.org/x/tools@v0.1.11: Get "https://proxy.golang.org/golang.org/x/tools/@v/v0.1.11.zip": dial tcp 142.251.42.241:443: i/o timeout
deploy/google.go:24:2: google.golang.org/api@v0.76.0: Get "https://proxy.golang.org/google.golang.org/api/@v/v0.76.0.zip": dial tcp 142.251.43.17:443: i/o timeout
parser/metadecoders/decoder.go:32:2: gopkg.in/yaml.v2@v2.4.0: Get "https://proxy.golang.org/gopkg.in/yaml.v2/@v/v2.4.0.zip": dial tcp 142.251.42.241:443: i/o timeout
The command '/bin/sh -c mkdir $HOME/src &&     cd $HOME/src &&     curl -L https://github.com/gohugoio/hugo/archive/refs/tags/v${HUGO_VERSION}.tar.gz | tar -xz &&     cd "hugo-${HUGO_VERS    ION}" &&     go install --tags extended' returned a non-zero code: 1
make: *** [Makefile:69：container-image] error 1
```

请修改 `Dockerfile` 文件，为其添加网络代理。修改内容如下：

```dockerfile
...
FROM golang:1.18-alpine

LABEL maintainer="Luc Perkins <lperkins@linuxfoundation.org>"

ENV GO111MODULE=on                            # 需要添加内容1

ENV GOPROXY=https://proxy.golang.org,direct   # 需要添加内容2

RUN apk add --no-cache \
    curl \
    gcc \
    g++ \
    musl-dev \
    build-base \
    libc6-compat

ARG HUGO_VERSION
...
```

将 "https://proxy.golang.org" 替换为本地可以使用的代理地址。

**注意：** 此部分仅适用于中国大陆。

<!--
## Get involved with SIG Docs

Learn more about SIG Docs Kubernetes community and meetings on the [community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

You can also reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [Get an invite for this Slack](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
-->
## 参与 SIG Docs 工作

通过[社区页面](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)进一步了解
SIG Docs Kubernetes 社区和会议信息。

你也可以通过以下渠道联系本项目的维护人员：

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [获得此 Slack 的邀请](https://slack.k8s.io/)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

<!--
## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a _fork_. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback. As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**
-->
## 为文档做贡献

你也可以点击屏幕右上方区域的 **Fork** 按钮，在你自己的 GitHub
账号下创建本仓库的拷贝。此拷贝被称作 **fork**。
你可以在自己的拷贝中任意地修改文档，并在你已准备好将所作修改提交给我们时，
在你自己的拷贝下创建一个拉取请求（Pull Request），以便让我们知道。

一旦你创建了拉取请求，某个 Kubernetes 评审人会负责提供明确的、可执行的反馈意见。
作为拉取请求的拥有者，**修改拉取请求以解决 Kubernetes 评审人所提出的反馈是你的责任**。

<!--
Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.

Furthermore, in some cases, one of your reviewers might ask for a technical review from a Kubernetes tech reviewer when needed. Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.
-->
还要提醒的一点，有时可能会有不止一个 Kubernetes 评审人为你提供反馈意见。
有时候，某个评审人的意见和另一个最初被指派的评审人的意见不同。

另外在某些时候，某个评审人可能会在需要的时候请求一名 Kubernetes 技术评审人来执行技术评审。
这些评审人会尽力及时地提供反馈意见，不过具体的响应时间可能会因时而异。

<!--
For more information about contributing to the Kubernetes documentation, see:

- [Contribute to Kubernetes docs](https://kubernetes.io/docs/contribute/)
- [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)
-->
有关为 Kubernetes 文档做出贡献的更多信息，请参阅：

- [贡献 Kubernetes 文档](https://kubernetes.io/zh-cn/docs/contribute/)
- [页面内容类型](https://kubernetes.io/zh-cn/docs/contribute/style/page-content-types/)
- [文档风格指南](https://kubernetes.io/zh-cn/docs/contribute/style/style-guide/)
- [本地化 Kubernetes 文档](https://kubernetes.io/zh-cn/docs/contribute/localization/)

<!--
### New contributor ambassadors
-->
### 新贡献者大使

<!--
If you need help at any point when contributing, the [New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) are a good point of contact. These are SIG Docs approvers whose responsibilities include mentoring new contributors and helping them through their first few pull requests. The best place to contact the New Contributors Ambassadors would be on the [Kubernetes Slack](https://slack.k8s.io/). Current New Contributors Ambassadors for SIG Docs:
-->
如果你在贡献时需要帮助，[新贡献者大使](https://kubernetes.io/zh-cn/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador)是一个很好的联系人。
这些是 SIG Docs 批准者，其职责包括指导新贡献者并帮助他们完成最初的几个拉取请求。
联系新贡献者大使的最佳地点是 [Kubernetes Slack](https://slack.k8s.io/)。
SIG Docs 的当前新贡献者大使：

<!--
| Name                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |
-->
| 姓名                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |


<!--
## Localization READMEs
-->
## README 本地化

<!--
| Language                   | Language                   |
| -------------------------- | -------------------------- |
| [Chinese](README-zh.md)    | [Korean](README-ko.md)     |
| [French](README-fr.md)     | [Polish](README-pl.md)     |
| [German](README-de.md)     | [Portuguese](README-pt.md) |
| [Hindi](README-hi.md)      | [Russian](README-ru.md)    |
| [Indonesian](README-id.md) | [Spanish](README-es.md)    |
| [Italian](README-it.md)    | [Ukrainian](README-uk.md)  |
| [Japanese](README-ja.md)   | [Vietnamese](README-vi.md) |
-->
| 语言                       | 语言                       |
| -------------------------- | -------------------------- |
| [中文](README-zh.md)       | [韩语](README-ko.md)       |
| [法语](README-fr.md)       | [波兰语](README-pl.md)     |
| [德语](README-de.md)       | [葡萄牙语](README-pt.md)   |
| [印地语](README-hi.md)     | [俄语](README-ru.md)       |
| [印尼语](README-id.md)     | [西班牙语](README-es.md)   |
| [意大利语](README-it.md)   | [乌克兰语](README-uk.md)   |
| [日语](README-ja.md)       | [越南语](README-vi.md)     |

## 中文本地化

可以通过以下方式联系中文本地化的维护人员：

* Rui Chen ([GitHub - @chenrui333](https://github.com/chenrui333))
* He Xiaolong ([GitHub - @markthink](https://github.com/markthink))
* [Slack 频道](https://kubernetes.slack.com/messages/kubernetes-docs-zh)

<!--
## Code of conduct

Participation in the Kubernetes community is governed by the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).
-->
## 行为准则

参与 Kubernetes 社区受 [CNCF 行为准则](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)约束。

<!--
## Thank you

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!
-->
## 感谢你

Kubernetes 因为社区的参与而蓬勃发展，感谢你对我们网站和文档的贡献！
