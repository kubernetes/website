# Kubernetes 文件
<!--
# The Kubernetes documentation
-->

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

<!--
This repository contains the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/). We're glad that you want to contribute!
-->
本儲存庫包含用於建置 [Kubernetes 網站及文件](https://kubernetes.io/)的網站資源。歡迎您參與並貢獻內容！

<!--
- [Contributing to the docs](#contributing-to-the-docs)
- [Localization READMEs](#localization-readmemds)
-->
- [貢獻文件](#貢獻文件)
- [README 在地化](#readme-localization)

<!--
## Using this repository

You can run the website locally using [Hugo (Extended version)](https://gohugo.io/), or you can run it in a container runtime. We strongly recommend using the container runtime, as it gives deployment consistency with the live website.
-->
## 使用本儲存庫

您可以使用 [Hugo（擴展版）](https://gohugo.io/)在本地執行網站，或透過容器化環境運行。我們強烈建議使用容器環境，因為這能確保與正式網站的部署環境保持一致。

<!--
## Prerequisites

To use this repository, you need the following installed locally:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Extended version)](https://gohugo.io/)
- A container runtime, like [Docker](https://www.docker.com/).
-->
## 前置需求

使用本儲存庫，您需要在本地安裝以下軟體：

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo（擴展版）](https://gohugo.io/)
- 容器執行環境，例如 [Docker](https://www.docker.com/)。

<!--
Make sure to install the Hugo extended version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L11) file.
-->
> [!NOTE]
請確認您安裝的 Hugo 擴展版本與 [`netlify.toml`](netlify.toml#L11) 檔案中 `HUGO_VERSION` 環境變數指定的版本一致。


<!--
Before you start, install the dependencies. Clone the repository and navigate to the directory:
-->
開始之前，請先安裝相依套件。接著複製儲存庫並進入目錄：

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
Kubernetes 網站使用 [Docsy Hugo 主題](https://github.com/google/docsy#readme)，可透過 npm 安裝。

您也可以下載預先設定好的開發容器映像檔，其中已包含 Hugo 和 Docsy。

此外，Kubernetes 網站也使用 Git 子模組來管理用於產生參考文件的工具。

<!-- 
### Windows

```powershell
# fetch submodule dependencies
git submodule update --init --recursive --depth 1
```
-->
### Windows

```powershell
# 取得子模組依附套件
git submodule update --init --recursive --depth 1
```
<!-- 
### Linux / other Unix

```bash
# fetch submodule dependencies
make module-init
```
-->
### Linux / 其他 Unix

```bash
# 取得子模組依附套件
make module-init
```
<!--
## Running the website using a container

To build the site in a container, run the following:
-->
## 使用容器執行網站

若要在容器中建置網站，請執行以下指令：

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
# 您可以將 $CONTAINER_ENGINE 設定為任何類似 Docker 的容器工具名稱

# 轉譯完整網站
make container-serve

# 僅轉譯特定語言（例如英文）
make container-serve segments=en

# 轉譯多種語言（例如英文和繁體中文）
make container-serve segments=en,zh-tw
```
<!--
**💡 Tip:** Using _Hugo segments_ speeds up local preview builds, by rendering only selected language(s).

If you see errors, it probably means that the hugo container did not have enough computing resources available. To solve it, increase the amount of allowed CPU and memory usage for Docker on your machine ([MacOS](https://docs.docker.com/desktop/settings/mac/) and [Windows](https://docs.docker.com/desktop/settings/windows/)).
-->
**💡 提示：** 使用 _Hugo segments_ 只會轉譯所選的語言，可以加快本地預覽轉譯速度。

如果出現錯誤，可能表示 Hugo 容器沒有足夠的運算資源。要解決此問題，請增加 Docker 在您的機器上可使用的 CPU 與記憶體資源（[macOS](https://docs.docker.com/desktop/settings/mac/) 和 [Windows](https://docs.docker.com/desktop/settings/windows/)）。

<!--
Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
-->
開啟瀏覽器並前往 <http://localhost:1313> 查看網站。當您修改原始檔案時，Hugo 會自動更新網站並重新整理瀏覽器。

<!--
## Running the website locally using Hugo

To install dependencies, deploy and test the site locally, run:
-->
## 使用 Hugo 在本地執行網站

若要安裝依附套件、部署並在本地測試網站，請執行：

<!--
- For macOS and Linux
-->
- macOS 和 Linux

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

  # 轉譯完整網站（預設）
  make serve

  # 僅轉譯特定語言
  make serve segments=en

  # 轉譯多種語言
  make serve segments=en,zh-tw
  ```

<!--
**💡 Tip:** Hugo segments are defined in `hugo.toml` and allow faster rendering by limiting the scope to specific language(s).
-->
**💡 提示：** Hugo segments 定義在 `hugo.toml` 中，將轉譯範圍限制在特定語言，可加快網站的轉譯速度。

<!--
- For Windows (PowerShell)
-->
- Windows (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

<!--
This will start the local Hugo server on port 1313. Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
-->
本地 Hugo 伺服器會在連接埠 1313 啟動。開啟瀏覽器並前往 <http://localhost:1313> 查看網站。當您修改原始檔案時，Hugo 會自動更新網站並重新整理瀏覽器。

<!--
## Building the API reference pages
-->
## 建置 API 參考頁面

<!--
The API reference pages located in `content/en/docs/reference/kubernetes-api` are built from the Swagger specification, also known as OpenAPI specification, using <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

To update the reference pages for a new Kubernetes release follow these steps:
-->
位於 `content/en/docs/reference/kubernetes-api` 的 API 參考頁面，是根據 Swagger 規格（亦稱為 OpenAPI 規格），並使用 <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs> 產生。

若要為新的 Kubernetes 發行版本更新參考頁面，請依照以下步驟操作：

<!--
1. Pull in the `api-ref-generator` submodule:
-->
1. 取得 `api-ref-generator` 子模組：

   ```bash
   git submodule update --init --recursive --depth 1
   ```

<!--
2. Update the Swagger specification:
-->
2. 更新 Swagger 規格：

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

<!--
3. In `api-ref-assets/config/`, adapt the files `toc.yaml` and `fields.yaml` to reflect the changes of the new release.
-->
3. 在 `api-ref-assets/config/` 目錄中，調整 `toc.yaml` 和 `fields.yaml` 使其反映新版本的變更。

<!--
4. Next, build the pages:
-->
4. 接著建置頁面：

   ```bash
   make api-reference
   ```

   <!--
   You can test the results locally by making and serving the site from a container image:
   -->
   您可以透過使用容器映像檔建置並啟動網站，在本地測試結果：

   ```bash
   make container-image
   make container-serve
   ```
   <!--
   In a web browser, go to <http://localhost:1313/docs/reference/kubernetes-api/> to view the API reference.
   -->
   在瀏覽器中前往 <http://localhost:1313/docs/reference/kubernetes-api/> 查看 API 參考文件。

<!--
5. When all changes of the new contract are reflected into the configuration files `toc.yaml` and `fields.yaml`, create a Pull Request with the newly generated API reference pages.
-->
5. 當新的 API 變更已完整反映在 `toc.yaml` 和 `fields.yaml` 設定檔中後，請建立 Pull Request，提交新產生的 API 參考頁面。

<!--
## Troubleshooting

If you experience any issues with running website locally, please refer
to the [Troubleshooting section](https://kubernetes.io/docs/contribute/new-content/preview-locally/#troubleshooting) of the contributing documentation.
-->
## 疑難排解

如果在本地執行網站時遇到任何問題，請參閱貢獻文件的[疑難排解](https://kubernetes.io/docs/contribute/new-content/preview-locally/#troubleshooting)章節。

<!--
## Get involved with SIG Docs

Learn more about SIG Docs Kubernetes community and meetings on the [community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

You can also reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [Get an invite for this Slack](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
-->
## 參與 SIG Docs

在[社群頁面](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)上了解更多關於 SIG Docs Kubernetes 社群和會議資訊。

您也可以透過以下方式聯繫本專案的維護者：

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [取得 Slack 邀請](https://slack.k8s.io/)
- [社群 Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

<!--
## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a _fork_. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback. As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**
-->
## 貢獻文件

您可以點擊畫面右上角的 **Fork** 按鈕，在您的 GitHub 帳號中建立本儲存庫的分叉副本。此副本稱為 _fork_。您可以在 fork 中進行任何需要的修改；當準備好將變更提交給我們時，請到您的 fork 建立新的 pull request，讓我們知道您的修改。

Pull request 建立後，Kubernetes 的審查者會負責提供清楚且具體的回饋。身為 pull request 的作者，**您有責任依據 Kubernetes 審查者提供的回饋更新您的 pull request。**

<!--
Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.

Furthermore, in some cases, one of your reviewers might ask for a technical review from a Kubernetes tech reviewer when needed. Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.
-->
請注意，您可能會收到多位 Kubernetes 審查者的回饋，也可能收到並非最初指派審查者所提供的回饋。

此外，在某些情況下，審查者可能會在需要時請 Kubernetes 技術審查者進行技術審查。審查者會盡力及時提供回饋，但回應時間可能會因實際情況而有所不同。

<!--
For more information about contributing to the Kubernetes documentation, see:

- [Contribute to Kubernetes docs](https://kubernetes.io/docs/contribute/)
- [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)
- [Introduction to Kubernetes Docs](https://www.youtube.com/watch?v=pprMgmNzDcw)
-->
如需更多關於貢獻 Kubernetes 文件的資訊，請參閱：

- [貢獻 Kubernetes 文件](https://kubernetes.io/docs/contribute/)
- [頁面內容類型](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [文件風格指南](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Kubernetes 文件在地化](https://kubernetes.io/docs/contribute/localization/)
- [Kubernetes 文件簡介](https://www.youtube.com/watch?v=pprMgmNzDcw)

<!--
### New contributor ambassadors
-->
### 新貢獻者大使

<!--
If you need help at any point when contributing, the [New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) are a good point of contact. These are SIG Docs approvers whose responsibilities include mentoring new contributors and helping them through their first few pull requests. The best place to contact the New Contributors Ambassadors would be on the [Kubernetes Slack](https://slack.k8s.io/). Current New Contributors Ambassadors for SIG Docs:
-->
如果您在貢獻過程中的任何階段需要協助，[新貢獻者大使](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador)是很好的聯繫窗口。他們是 SIG Docs 的 approver，職責之一是指導新貢獻者，並協助他們完成前幾個 pull request。聯繫新貢獻者大使的最佳方式是透過[Kubernetes Slack](https://slack.k8s.io/)。目前 SIG Docs 的新貢獻者大使如下：

<!--
| Name                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |
-->
| 姓名                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |

## 各語言在地化 README 列表

| 語言                       | 語言                       |
| -------------------------- | -------------------------- |
| [孟加拉語](./content/bn/README.md)    | [韓語](./content/ko/README.md)    |
| [簡體中文](./content/zh-cn/README.md)    | [波蘭語](./content/pl/README.md)    |
| [法語](./content/fr/README.md)     | [巴西葡萄牙語](./content/pt-br/README.md)    |
| [德語](./content/de/README.md)     | [俄語](./content/ru/README.md)    |
| [印地語](./content/hi/README.md)      | [西班牙語](./content/es/README.md)    |
| [印尼語](./content/id/README.md) | [烏克蘭語](./content/uk/README.md) |
| [義大利語](./content/it/README.md)    | [越南語](./content/vi/README.md) |
| [日語](./content/ja/README.md)   | [繁體中文](./content/zh-tw/README.md) |

<!--
## Code of conduct

Participation in the Kubernetes community is governed by the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).
-->
## 行為準則

參與 Kubernetes 社群須遵守 [CNCF 行為準則](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)。

<!--
## Thank you

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!
-->
## 感謝您

Kubernetes 仰賴社群的參與以持續發展，感謝您對我們網站與文件所做的貢獻！
