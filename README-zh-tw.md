# Kubernetes 文件

<!--
# The Kubernetes documentation
-->

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

<!--
This repository contains the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/). We're glad that you want to contribute!
-->
本倉庫包含了所有用於構建 [Kubernetes 網站和文件](https://kubernetes.io/) 的軟體資產。
我們非常高興您想要參與貢獻！

<!--
- [Contributing to the docs](#contributing-to-the-docs)
- [Localization ReadMes](#localization-readmemds)
-->
- [為文件做貢獻](#為文件做貢獻)
- [README.md 本地化](#readmemd-本地化)

<!--
## Using this repository

You can run the website locally using Hugo (Extended version), or you can run it in a container runtime. We strongly recommend using the container runtime, as it gives deployment consistency with the live website.
-->
## 使用這個倉庫

可以使用 Hugo（擴充套件版）在本地執行網站，也可以在容器中執行它。強烈建議使用容器，因為這樣可以和線上網站的部署保持一致。

<!--
## Prerequisites

To use this repository, you need the following installed locally:

- [npm](https://www.npmjs.com/)
- [Go](https://golang.org/)
- [Hugo (Extended version)](https://gohugo.io/)
- A container runtime, like [Docker](https://www.docker.com/).

-->
## 前提條件

使用這個倉庫，需要在本地安裝以下軟體：

- [npm](https://www.npmjs.com/)
- [Go](https://golang.org/)
- [Hugo (Extended version)](https://gohugo.io/)
- 容器執行時，比如 [Docker](https://www.docker.com/).

<!--
Before you start, install the dependencies. Clone the repository and navigate to the directory:
-->
開始前，先安裝這些依賴。克隆本倉庫並進入對應目錄：

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

<!--
The Kubernetes website uses the [Docsy Hugo theme](https://github.com/google/docsy#readme). Even if you plan to run the website in a container, we strongly recommend pulling in the submodule and other development dependencies by running the following:
-->

Kubernetes 網站使用的是 [Docsy Hugo 主題](https://github.com/google/docsy#readme)。 即使你打算在容器中執行網站，我們也強烈建議你透過執行以下命令來引入子模組和其他開發依賴項：

```bash
# pull in the Docsy submodule
git submodule update --init --recursive --depth 1
```

<!--
## Running the website using a container

To build the site in a container, run the following to build the container image and run it:

-->
## 在容器中執行網站

要在容器中構建網站，請透過以下命令來構建容器映象並執行：

```bash
make container-image
make container-serve
```

<!--
If you see errors, it probably means that the hugo container did not have enough computing resources available. To solve it, increase the amount of allowed CPU and memory usage for Docker on your machine ([MacOSX](https://docs.docker.com/docker-for-mac/#resources) and [Windows](https://docs.docker.com/docker-for-windows/#resources)).
-->
如果您看到錯誤，這可能意味著 hugo 容器沒有足夠的可用計算資源。
要解決這個問題，請增加機器（[MacOSX](https://docs.docker.com/docker-for-mac/#resources)
和 [Windows](https://docs.docker.com/docker-for-windows/#resources)）上
Docker 允許的 CPU 和記憶體使用量。

<!--
Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
-->
啟動瀏覽器，開啟 <http://localhost:1313> 來檢視網站。
當你對原始檔作出修改時，Hugo 會更新網站並強制瀏覽器執行重新整理操作。

<!--
## Running the website locally using Hugo

Make sure to install the Hugo extended version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L10) file.

To build and test the site locally, run:
-->
## 在本地使用 Hugo 來執行網站

請確保安裝的是 [`netlify.toml`](netlify.toml#L10) 檔案中環境變數 `HUGO_VERSION` 所指定的
Hugo 擴充套件版本。

若要在本地構造和測試網站，請執行：

```bash
# install dependencies
npm ci
make serve
```

<!--
This will start the local Hugo server on port 1313. Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
-->
上述命令會在埠 1313 上啟動本地 Hugo 伺服器。
啟動瀏覽器，開啟 <http://localhost:1313> 來檢視網站。
當你對原始檔作出修改時，Hugo 會更新網站並強制瀏覽器執行重新整理操作。

<!--
## Building the API reference pages
-->
## 構建 API 參考頁面

<!--
The API reference pages located in `content/en/docs/reference/kubernetes-api` are built from the Swagger specification, using <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

To update the reference pages for a new Kubernetes release follow these steps:
-->
位於 `content/en/docs/reference/kubernetes-api` 的 API 參考頁面是根據 Swagger 規範構建的，使用 <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>。

要更新新 Kubernetes 版本的參考頁面，請執行以下步驟：

<!--
1. Pull in the `api-ref-generator` submodule:
-->
1. 拉取 `api-ref-generator` 子模組：

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
3. 在 `api-ref-assets/config/` 中，調整檔案 `toc.yaml` 和 `fields.yaml` 以反映新版本的變化。

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
   您可以透過從容器映像建立和提供站點來在本地測試結果：

   ```bash
   make container-image
   make container-serve
   ```

<!--
   In a web browser, go to <http://localhost:1313/docs/reference/kubernetes-api/> to view the API reference.
-->
   在 Web 瀏覽器中，開啟 <http://localhost:1313/docs/reference/kubernetes-api/> 檢視 API 參考。

<!--
5. When all changes of the new contract are reflected into the configuration files `toc.yaml` and `fields.yaml`, create a Pull Request with the newly generated API reference pages.
-->
5. 當所有新的更改都反映到配置檔案 `toc.yaml` 和 `fields.yaml` 中時，使用新生成的 API 參考頁面建立一個 Pull Request。

<!--
## Troubleshooting

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo is shipped in two set of binaries for technical reasons. The current website runs based on the **Hugo Extended** version only. In the [release page](https://github.com/gohugoio/hugo/releases) look for archives with `extended` in the name. To confirm, run `hugo version` and look for the word `extended`.
-->
## 故障排除

###  error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

由於技術原因，Hugo 會發布兩套二進位制檔案。
當前網站僅基於 **Hugo Extended** 版本執行。
在 [釋出頁面](https://github.com/gohugoio/hugo/releases) 中查詢名稱為 `extended` 的歸檔。可以執行 `hugo version` 檢視是否有單詞 `extended` 來確認。

<!--
### Troubleshooting macOS for too many open files

If you run `make serve` on macOS and receive the following error:

-->
### 對 macOS 上開啟太多檔案的故障排除

如果在 macOS 上執行 `make serve` 收到以下錯誤：

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

<!--
Try checking the current limit for open files:
-->
試著檢視一下當前開啟檔案數的限制：

`launchctl limit maxfiles`

<!--
Then run the following commands (adapted from <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):
-->
然後執行以下命令（參考 <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>）：

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
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

<!--
## Get involved with SIG Docs

Learn more about SIG Docs Kubernetes community and meetings on the [community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

You can also reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [Get an invite for this Slack](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
-->
# 參與 SIG Docs 工作

透過 [社群頁面](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)
進一步瞭解 SIG Docs Kubernetes 社群和會議資訊。

你也可以透過以下渠道聯絡本專案的維護人員：

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [獲得此 Slack 的邀請](https://slack.k8s.io/)
- [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

<!--
## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a _fork_. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback. As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**
-->
# 為文件做貢獻

你也可以點選螢幕右上方區域的 **Fork** 按鈕，在你自己的 GitHub
賬號下建立本倉庫的複製。此複製被稱作 _fork_。
你可以在自己的複製中任意地修改文件，並在你已準備好將所作修改提交給我們時，
在你自己的複製下建立一個拉取請求（Pull Request），以便讓我們知道。

一旦你建立了拉取請求，某個 Kubernetes 評審人會負責提供明確的、可執行的反饋意見。
作為拉取請求的擁有者，*修改拉取請求以解決 Kubernetes
評審人所提出的反饋是你的責任*。

<!--
Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.

Furthermore, in some cases, one of your reviewers might ask for a technical review from a Kubernetes tech reviewer when needed. Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.
-->
還要提醒的一點，有時可能會有不止一個 Kubernetes 評審人為你提供反饋意見。
有時候，某個評審人的意見和另一個最初被指派的評審人的意見不同。

更進一步，在某些時候，評審人之一可能會在需要的時候請求 Kubernetes
技術評審人來執行技術評審。
評審人會盡力及時地提供反饋意見，不過具體的響應時間可能會因時而異。

<!--
For more information about contributing to the Kubernetes documentation, see:

- [Contribute to Kubernetes docs](https://kubernetes.io/docs/contribute/)
- [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)
-->
有關為 Kubernetes 文件做出貢獻的更多資訊，請參閱：

- [貢獻 Kubernetes 文件](https://kubernetes.io/docs/contribute/)
- [頁面內容型別](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [文件風格指南](https://kubernetes.io/docs/contribute/style/style-guide/)
- [本地化 Kubernetes 文件](https://kubernetes.io/docs/contribute/localization/)

<!--
### New contributor ambassadors
-->
### 新貢獻者大使

<!--
If you need help at any point when contributing, the [New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) are a good point of contact. These are SIG Docs approvers whose responsibilities include mentoring new contributors and helping them through their first few pull requests. The best place to contact the New Contributors Ambassadors would be on the [Kubernetes Slack](https://slack.k8s.io/). Current New Contributors Ambassadors for SIG Docs:
-->
如果您在貢獻時需要幫助，[新貢獻者大使](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador)是一個很好的聯絡人。
這些是 SIG Docs 批准者，其職責包括指導新貢獻者並幫助他們完成最初的幾個拉取請求。
聯絡新貢獻者大使的最佳地點是 [Kubernetes Slack](https://slack.k8s.io/)。
SIG Docs 的當前新貢獻者大使：

<!--
| Name                       | Slack                      | GitHub                     |                   
| -------------------------- | -------------------------- | -------------------------- |
| Arsh Sharma                | @arsh                      | @RinkiyaKeDad              |
-->
| 姓名                       | Slack                      | GitHub                     |                   
| -------------------------- | -------------------------- | -------------------------- |
| Arsh Sharma                | @arsh                      | @RinkiyaKeDad              |

<!--
## Localization `README.md`'s
-->
## `README.md` 本地化

<!--
| Language                      | Language                      |
| ----------------------------- | ----------------------------- |
| [Chinese-cn](README-zh-cn.md) | [Korean](README-ko.md)        |
| [French](README-fr.md)        | [Polish](README-pl.md)        |
| [German](README-de.md)        | [Portuguese](README-pt.md)    |
| [Hindi](README-hi.md)         | [Russian](README-ru.md)       |
| [Indonesian](README-id.md)    | [Spanish](README-es.md)       |
| [Italian](README-it.md)       | [Ukrainian](README-uk.md)     |
| [Japanese](README-ja.md)      | [Vietnamese](README-vi.md)    |
| [Chinese-tw](README-zh-tw.md) |                               |
-->
| 語言                          | 語言                          |
| ----------------------------- | ----------------------------- |
| [簡體中文](README-zh-cn.md)   | [韓語](README-ko.md)          |
| [法語](README-fr.md)          | [波蘭語](README-pl.md)        |
| [德語](README-de.md)          | [葡萄牙語](README-pt.md)      |
| [印地語](README-hi.md)        | [俄語](README-ru.md)          |
| [印尼語](README-id.md)        | [西班牙語](README-es.md)      |
| [義大利語](README-it.md)      | [烏克蘭語](README-uk.md)      |
| [日語](README-ja.md)          | [越南語](README-vi.md)        |
| [繁體中文](README-zh-tw.md)   |                               |

# 中文字地化

可以透過以下方式聯絡中文字地化的維護人員：

* Rui Chen ([GitHub - @chenrui333](https://github.com/chenrui333))
* He Xiaolong ([GitHub - @markthink](https://github.com/markthink))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-zh)

<!--
## Code of conduct

Participation in the Kubernetes community is governed by the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md).
-->
## 行為準則

參與 Kubernetes 社群受 [CNCF 行為準則](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) 約束。

<!--
## Thank you

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!
-->
## 感謝你

Kubernetes 因為社群的參與而蓬勃發展，感謝您對我們網站和文件的貢獻！
