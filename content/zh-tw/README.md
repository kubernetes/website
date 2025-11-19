# Kubernetes 文檔
<!--
# The Kubernetes documentation
-->

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

<!--
This repository contains the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/). We're glad that you want to contribute!
-->
本倉庫包含了所有用於構建 [Kubernetes 網站和文檔](https://kubernetes.io/)的軟件資產。
我們非常高興你想要參與貢獻！

<!--
- [Contributing to the docs](#contributing-to-the-docs)
- [Localization READMEs](#localization-readmemds)
-->
- [爲文檔做貢獻](#爲文檔做貢獻)
- [README 本地化](#readme-本地化)

<!--
## Using this repository

You can run the website locally using [Hugo (Extended version)](https://gohugo.io/), or you can run it in a container runtime. We strongly recommend using the container runtime, as it gives deployment consistency with the live website.
-->
## 使用這個倉庫

可以使用 [Hugo（擴展版）](https://gohugo.io/)在本地運行網站，也可以在容器中運行它。
強烈建議使用容器，因爲這樣可以和在線網站的部署保持一致。

<!--
## Prerequisites

To use this repository, you need the following installed locally:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Extended version)](https://gohugo.io/)
- A container runtime, like [Docker](https://www.docker.com/).
-->
## 前提條件

使用這個倉庫，需要在本地安裝以下軟件：

- [npm](https://www.npmjs.com/)
- [Go](https://golang.google.cn/)
- [Hugo（Extended 版本）](https://gohugo.io/)
- 容器運行時，比如 [Docker](https://www.docker.com/)。

<!--
Make sure to install the Hugo extended version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L11) file.
-->
> [!NOTE]
請確保安裝的是 [`netlify.toml`](netlify.toml#L11) 文件中環境變量 `HUGO_VERSION` 所指定的
Hugo Extended 版本。

<!--
Before you start, install the dependencies. Clone the repository and navigate to the directory:
-->
開始前，先安裝這些依賴。克隆本倉庫並進入對應目錄：

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

<!--
The Kubernetes website uses the [Docsy Hugo theme](https://github.com/google/docsy#readme),
which can be installed via npm. You can also download a pre-configured
development container image that includes Hugo and Docsy. Additionally, a Git
submodule is used for tools that generate the reference documentation.
-->
Kubernetes 網站使用的是 [Docsy Hugo 主題](https://github.com/google/docsy#readme)，
可以通過 npm 安裝。你也可以下載一個預設定的開發容器映像檔，其中包含 Hugo 和 Docsy。
此外，Kubernetes 網站還使用了 Git 子模塊來管理生成參考文檔的工具。

<!-- 
### Windows

```powershell
# fetch submodule dependencies
git submodule update --init --recursive --depth 1
```
-->
### Windows

```powershell
# 獲取子模塊依賴
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
# 獲取子模塊依賴
make module-init
```

<!--
## Running the website using a container

To build the site in a container, run the following:
-->
## 在容器中運行網站

要在容器中構建網站，請運行以下命令：

<!--
```bash
# You can set $CONTAINER_ENGINE to the name of any Docker-like container tool

# Render the full website
make container-serve

# Render only a specific language segment (e.g., English)
make container-serve segments=en

# Render multiple languages (e.g., English and Korean)
make container-serve segments=en,ko
```
-->
```bash
# 你可以將 $CONTAINER_ENGINE 設置爲任何 Docker 類容器工具的名稱

# 渲染整個網站
make container-serve

# 僅渲染特定語言（例如英語）
make container-serve segments=en

# 渲染多種語言（例如英語和韓語）
make container-serve segments=en,ko
```

<!--
**💡 Tip:** Using _Hugo segments_ speeds up local preview builds, by rendering only selected language(s).

If you see errors, it probably means that the hugo container did not have enough computing resources available. To solve it, increase the amount of allowed CPU and memory usage for Docker on your machine ([MacOS](https://docs.docker.com/desktop/settings/mac/) and [Windows](https://docs.docker.com/desktop/settings/windows/)).
-->
**💡 提示：**使用 **Hugo 分段機制**可以加快本地預覽構建速度，因爲它只渲染選定的語言。

如果你看到錯誤，這可能意味着 Hugo 容器沒有足夠的可用計算資源。
要解決這個問題，請增加機器（[MacOS](https://docs.docker.com/desktop/settings/mac/)
和 [Windows](https://docs.docker.com/desktop/settings/windows/)）上
Docker 允許的 CPU 和內存使用量。

<!--
Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
-->
啓動瀏覽器，打開 <http://localhost:1313> 來查看網站。
當你對源文件作出修改時，Hugo 會更新網站並強制瀏覽器執行刷新操作。

<!--
## Running the website locally using Hugo

To install dependencies, deploy and test the site locally, run:
-->
## 在本地使用 Hugo 來運行網站

若要在本地安裝依賴，構建和測試網站，運行以下命令：

<!--
- For macOS and Linux
-->
- 對於 macOS 和 Linux

  <!--
  ```bash
  npm ci

  # Render the full site (default)
  make serve

  # Render only a specific language segment
  make serve segments=en

  # Render multiple language segments
  make serve segments=en,ko
  ```
  -->

  ```bash
  npm ci

  # 渲染整個網站（默認）
  make serve

  # 僅渲染特定語言
  make serve segments=en

  # 渲染多種語言
  make serve segments=en,ko
  ```

<!--
**💡 Tip:** Hugo segments are defined in `hugo.toml` and allow faster rendering by limiting the scope to specific language(s).
-->
**💡 提示：** Hugo 分段在 `hugo.toml` 中定義，通過將渲染範圍限定爲特定語言，可以加快構建速度。

<!--
- For Windows (PowerShell)
-->
- 對於 Windows (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

<!--
This will start the local Hugo server on port 1313. Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
-->
上述命令會在端口 1313 上啓動本地 Hugo 伺服器。
啓動瀏覽器，打開 <http://localhost:1313> 來查看網站。
當你對源文件作出修改時，Hugo 會更新網站並強制瀏覽器執行刷新操作。

<!--
## Building the API reference pages
-->
## 構建 API 參考頁面

<!--
The API reference pages located in `content/en/docs/reference/kubernetes-api` are built from the Swagger specification, also known as OpenAPI specification, using <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

To update the reference pages for a new Kubernetes release follow these steps:
-->
位於 `content/en/docs/reference/kubernetes-api` 的 API 參考頁面是使用
<https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>
根據 Swagger 規範（也稱爲 OpenAPI 規範）構建的。

要更新 Kubernetes 新版本的參考頁面，請執行以下步驟：

<!--
1. Pull in the `api-ref-generator` submodule:
-->
1. 拉取 `api-ref-generator` 子模塊：

   ```bash
   git submodule update --init --recursive --depth 1
   ```

<!--
2. Update the Swagger specification:
-->
2. 更新 Swagger 規範：

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

<!--
3. In `api-ref-assets/config/`, adapt the files `toc.yaml` and `fields.yaml` to reflect the changes of the new release.
-->
3. 在 `api-ref-assets/config/` 中，調整文件 `toc.yaml` 和 `fields.yaml` 以反映新版本的變化。

<!--
4. Next, build the pages:
-->
4. 接下來，構建頁面：

   ```bash
   make api-reference
   ```

   <!--
   You can test the results locally by making and serving the site from a container image:
   -->
   你可以通過從容器映像檔創建和提供站點來在本地測試結果：

   ```bash
   make container-image
   make container-serve
   ```

   <!--
   In a web browser, go to <http://localhost:1313/docs/reference/kubernetes-api/> to view the API reference.
   -->
   在 Web 瀏覽器中，打開 <http://localhost:1313/docs/reference/kubernetes-api/> 查看 API 參考頁面。

<!--
5. When all changes of the new contract are reflected into the configuration files `toc.yaml` and `fields.yaml`, create a Pull Request with the newly generated API reference pages.
-->
5. 當所有新的更改都反映到設定文件 `toc.yaml` 和 `fields.yaml` 中時，使用新生成的 API
   參考頁面創建一個 Pull Request。

<!--
## Troubleshooting

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo is shipped in two set of binaries for technical reasons. The current website runs based on the **Hugo Extended** version only. In the [release page](https://github.com/gohugoio/hugo/releases) look for archives with `extended` in the name. To confirm, run `hugo version` and look for the word `extended`.
-->
## 故障排除

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

由於技術原因，Hugo 會發布兩套二進制文件。
當前網站僅基於 **Hugo Extended** 版本運行。
在[發佈頁面](https://github.com/gohugoio/hugo/releases)中查找名稱爲 `extended` 的歸檔。
可以運行 `hugo version` 查看是否有單詞 `extended` 來確認。

<!--
### Troubleshooting macOS for too many open files

If you run `make serve` on macOS and receive the following error:
-->
### 對 macOS 上打開太多文件的故障排除

如果在 macOS 上運行 `make serve` 收到以下錯誤：

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

<!--
Try checking the current limit for open files:
-->
試着查看一下當前打開文件數的限制：

`launchctl limit maxfiles`

<!--
Then run the following commands (adapted from <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):
-->
然後運行以下命令（參考 <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>）：

<!--
# These are the original gist links, linking to my gists now.
-->
```shell
#!/bin/sh

# 這些是原始的 gist 鏈接，現在則會鏈接到我的 gist
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
這適用於 Catalina 和 Mojave macOS。

### 對執行 make container-image 命令部分地區訪問超時的故障排除

現象如下：

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

請修改 `Dockerfile` 文件，爲其添加網路代理。修改內容如下：

```dockerfile
...
FROM golang:1.18-alpine

LABEL maintainer="Luc Perkins <lperkins@linuxfoundation.org>"

ENV GO111MODULE=on                            # 需要添加內容1

ENV GOPROXY=https://proxy.golang.org,direct   # 需要添加內容2

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

將 "https://proxy.golang.org" 替換爲本地可以使用的代理地址。

**注意：** 此部分僅適用於中國大陸。

<!--
## Get involved with SIG Docs

Learn more about SIG Docs Kubernetes community and meetings on the [community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

You can also reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [Get an invite for this Slack](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
-->
## 參與 SIG Docs 工作

通過[社區頁面](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)進一步瞭解
SIG Docs Kubernetes 社區和會議信息。

你也可以通過以下渠道聯繫本項目的維護人員：

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [獲得此 Slack 的邀請](https://slack.k8s.io/)
- [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

<!--
## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a _fork_. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback. As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**
-->
## 爲文檔做貢獻

你也可以點擊屏幕右上方區域的 **Fork** 按鈕，在你自己的 GitHub
賬號下創建本倉庫的拷貝。此拷貝被稱作 **fork**。
你可以在自己的拷貝中任意地修改文檔，並在你已準備好將所作修改提交給我們時，
在你自己的拷貝下創建一個拉取請求（Pull Request），以便讓我們知道。

一旦你創建了拉取請求，某個 Kubernetes 評審人會負責提供明確的、可執行的反饋意見。
作爲拉取請求的擁有者，**修改拉取請求以解決 Kubernetes 評審人所提出的反饋是你的責任**。

<!--
Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.

Furthermore, in some cases, one of your reviewers might ask for a technical review from a Kubernetes tech reviewer when needed. Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.
-->
還要提醒的一點，有時可能會有不止一個 Kubernetes 評審人爲你提供反饋意見。
有時候，某個評審人的意見和另一個最初被指派的評審人的意見不同。

另外在某些時候，某個評審人可能會在需要的時候請求一名 Kubernetes 技術評審人來執行技術評審。
這些評審人會盡力及時地提供反饋意見，不過具體的響應時間可能會因時而異。

<!--
For more information about contributing to the Kubernetes documentation, see:

- [Contribute to Kubernetes docs](https://kubernetes.io/docs/contribute/)
- [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)
- [Introduction to Kubernetes Docs](https://www.youtube.com/watch?v=pprMgmNzDcw)
-->
有關爲 Kubernetes 文檔做出貢獻的更多信息，請參閱：

- [貢獻 Kubernetes 文檔](https://kubernetes.io/zh-cn/docs/contribute/)
- [頁面內容類型](https://kubernetes.io/zh-cn/docs/contribute/style/page-content-types/)
- [文檔風格指南](https://kubernetes.io/zh-cn/docs/contribute/style/style-guide/)
- [本地化 Kubernetes 文檔](https://kubernetes.io/zh-cn/docs/contribute/localization/)
- [YouTube 視頻：Kubernetes 文檔介紹](https://www.youtube.com/watch?v=pprMgmNzDcw)

<!--
### New contributor ambassadors
-->
### 新貢獻者大使

<!--
If you need help at any point when contributing, the [New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) are a good point of contact. These are SIG Docs approvers whose responsibilities include mentoring new contributors and helping them through their first few pull requests. The best place to contact the New Contributors Ambassadors would be on the [Kubernetes Slack](https://slack.k8s.io/). Current New Contributors Ambassadors for SIG Docs:
-->
如果你在貢獻時需要幫助，[新貢獻者大使](https://kubernetes.io/zh-cn/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador)是一個很好的聯繫人。
這些是 SIG Docs 批准者，其職責包括指導新貢獻者並幫助他們完成最初的幾個拉取請求。
聯繫新貢獻者大使的最佳地點是 [Kubernetes Slack](https://slack.k8s.io/)。
SIG Docs 的當前新貢獻者大使：

<!--
| Name                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |
-->
| 姓名                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |

## 中文本地化

可以通過以下方式聯繫繁体中文本地化的維護人員：

* Roger Pan ([GitHub - @RogerPan1203](https://github.com/RogerPan1203))

<!--
## Code of conduct

Participation in the Kubernetes community is governed by the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).
-->
## 行爲準則

參與 Kubernetes 社區受 [CNCF 行爲準則](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)約束。

<!--
## Thank you

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!
-->
## 感謝你

Kubernetes 因爲社區的參與而蓬勃發展，感謝你對我們網站和文檔的貢獻！
