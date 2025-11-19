---
title: 爲 Kubernetes API 生成參考文檔
content_type: task
weight: 50
---
<!--
title: Generating Reference Documentation for the Kubernetes API
content_type: task
weight: 50
-->

<!-- overview -->

<!--
This page shows how to update the Kubernetes API reference documentation.

The Kubernetes API reference documentation is built from the
[Kubernetes OpenAPI spec](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json)
using the [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) generation code.

If you find bugs in the generated documentation, you need to
[fix them upstream](/docs/contribute/generate-ref-docs/contribute-upstream/).

If you need only to regenerate the reference documentation from the
[OpenAPI](https://github.com/OAI/OpenAPI-Specification)
spec, continue reading this page.
-->
本頁面顯示瞭如何更新 Kubernetes API 參考文檔。

Kubernetes API 參考文檔是從
[Kubernetes OpenAPI 規範](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json)構建的，
且使用 [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
生成代碼。

如果你在生成的文檔中發現錯誤，則需要[在上游修復](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstream/)。

如果你只需要從 [OpenAPI](https://github.com/OAI/OpenAPI-Specification)
規範中重新生成參考文檔，請繼續閱讀此頁。

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

<!-- 
## Set up the local repositories

Create a local workspace and set your `GOPATH`:
-->
## 設定本地倉庫

創建本地工作區並設置你的 `GOPATH`：

```shell
mkdir -p $HOME/<workspace>
export GOPATH=$HOME/<workspace>
```

<!-- 
Get a local clone of the following repositories: 
-->
獲取以下倉庫的本地克隆：

```shell
git clone github.com/kubernetes-sigs/reference-docs
```

<!--
Move into the `gen-apidocs` directory of the `reference-docs` repository and install the required Go packages:
-->
將其移動到 `reference-docs` 倉庫的 `gen-apidocs` 目錄中，
並安裝所需的 Go 包：

```shell
go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

<!-- 
If you don't already have the kubernetes/website repository, get it now: 
-->
如果你還沒有下載過 `kubernetes/website` 倉庫，現在下載：

```shell
git clone https://github.com/<your-username>/website
```

<!-- 
Get a clone of the kubernetes/kubernetes repository： 
-->
克隆 `kubernetes/kubernetes` 倉庫：

```shell
git clone https://github.com/kubernetes/kubernetes
```

<!-- 
* The base directory of your clone of the
  [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository is
  `<your-path-to>/src/k8s.io/kubernetes.`
  The remaining steps refer to your base directory as `<k8s-base>`.

* The base directory of your clone of the
  [kubernetes/website](https://github.com/kubernetes/website) repository is
  `<your-path-to>/src/github.com/<your username>/website.`
  The remaining steps refer to your base directory as `<web-base>`.

* The base directory of your clone of the
  [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
  repository is `<your-path-to>/src/github.com/kubernetes-sigs/reference-docs`.
  The remaining steps refer to your base directory as `<rdocs-base>`.
-->
* [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 倉庫克隆後的根目錄爲
  `<your-path-to>/src/k8s.io/kubernetes`。 後續步驟將此目錄稱爲 `<k8s-base>`。

* [kubernetes/website](https://github.com/kubernetes/website) 倉庫克隆後的根目錄爲
  `<your-path-to>/src/github.com/<your username>/website`。後續步驟將此目錄稱爲 `<web-base>`。

* [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
  倉庫克隆後的基本目錄爲 `<your-path-to>/src/github.com/kubernetes-sigs/reference-docs`。
  後續步驟將此目錄稱爲 `<rdocs-base>`。

<!-- 
## Generate the API reference docs

This section shows how to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/). 
-->
## 生成 API 參考文檔

本節說明如何生成[已發佈的 Kubernetes API 參考文檔](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

<!-- 
### Set build variables

Go to `<rdocs-base>`, and open the `Makefile` for editing: 
-->
### 設置構建變量 {#set-build-variables}

進入 `<rdocs-base>` 目錄，然後打開 `Makefile` 文件進行編輯：

<!-- 
* Set `K8S_ROOT` to `<k8s-base>`.
* Set `K8S_WEBROOT` to `<web-base>`.
* Set `K8S_RELEASE` to the version of the docs you want to build.
  For example, if you want to build docs for Kubernetes 1.17.0, set `K8S_RELEASE` to 1.17.0.
-->
* 設置 `K8S_ROOT` 爲 `<k8s-base>`。
* 設置 `K8S_WEBROOT` 爲 `<web-base>`。
* 設置 `K8S_RELEASE` 爲要構建的文檔的版本。
  例如，如果你想爲 Kubernetes 1.17.0 構建文檔，請將 `K8S_RELEASE` 設置爲 1.17.0。

<!-- 
For example: 
-->
例如：

```shell
export K8S_WEBROOT=<your-path-to>/website
export K8S_ROOT=<your-path-to>/kubernetes
export K8S_RELEASE=1.17.0
```

<!--
### Create versioned directory and fetch Open API spec

The `updateapispec` build target creates the versioned build directory.
After the directory is created, the Open API spec is fetched from the
`<k8s-base>` repository. These steps ensure that the version
of the configuration files and Kubernetes Open API spec match the release version.
The versioned directory name follows the pattern of `v<major>_<minor>`.
-->
### 創建版本目錄並複製 OpenAPI 規範

構建目標 `updateapispec` 負責創建版本化的構建目錄。
目錄創建了之後，從 `<k8s-base>` 倉庫取回 OpenAPI 規範文件。
這些步驟確保設定文件的版本和 Kubernetes OpenAPI 規範的版本與發行版本匹配。
版本化目錄的名稱形式爲 `v<major>_<minor>`。

<!--
In the `<rdocs-base>` directory, run the following build target:
-->
在 `<rdocs-base>` 目錄中，運行以下命令來構建：

```shell
cd <rdocs-base>
make updateapispec
```

<!-- 
### Build the API reference docs 

The `copyapi` target builds the API reference and
copies the generated files to directories in `<web-base>`.
Run the following command in `<rdocs-base>`:
-->
### 構建 API 參考文檔 

構建目標 `copyapi` 會生成 API 參考文檔並將所生成文件複製到
`<web-base` 中的目錄下。在 `<rdocs-base>` 目錄中運行以下命令：

```shell
cd <rdocs-base>
make copyapi
```

<!-- 
Verify that these two files have been generated: 
-->
驗證是否已生成這兩個文件：

```shell
[ -e "<rdocs-base>/gen-apidocs/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-apidocs/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

<!--
Go to the base of your local `<web-base>`, and
view which files have been modified:
-->
進入本地 `<web-base>` 目錄，檢查哪些文件被更改：

```shell
cd <web-base>
git status
```

<!-- 
The output is similar to: 
-->
輸出類似於：

```
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff2
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/index.html
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/jquery.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/navData.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/scroll.js
```

<!--
## API reference location and versioning

The generated API reference files (HTML version) are copied to `<web-base>/static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/`. This directory contains the standalone HTML API documentation.
-->
## API 參考位置和版本控制

生成的 API 參考文件（HTML 版本）被複制到
`<web-base>/static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/`。
此目錄包含了獨立的 HTML API 文檔。

{{< note >}}
<!--
The Markdown version of the API reference located at `<web-base>/content/en/docs/reference/kubernetes-api/`
is generated separately using the [gen-resourcesdocs](https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs) generator.
-->
API 參考的 Markdown 版本位於 `<web-base>/content/en/docs/reference/kubernetes-api/`，
是使用 [gen-resourcesdocs](https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs)
生成器單獨生成的。
{{< /note >}}

<!--
## Locally test the API reference

Publish a local version of the API reference.
Verify the [local preview](http://localhost:1313/docs/reference/generated/kubernetes-api/{{< param "version">}}/).
-->
## 在本地測試 API 參考

發佈 API 參考的本地版本。
檢查[本地預覽](http://localhost:1313/docs/reference/generated/kubernetes-api/{{< param "version">}}/)。

<!--
```shell
cd <web-base>
git submodule update --init --recursive --depth 1 # if not already done
make container-serve
```
-->
```shell
cd <web-base>
git submodule update --init --recursive --depth 1 # 如果尚未完成
make container-serve
```

<!--
## Commit the changes

In `<web-base>`, run `git add` and `git commit` to commit the change.
-->
## 提交更改

在 `<web-base>` 中運行 `git add` 和 `git commit` 來提交更改。

<!-- 
Submit your changes as a
[pull request](/docs/contribute/new-content/open-a-pr/) to the
[kubernetes/website](https://github.com/kubernetes/website) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.
-->
基於你所生成的更改[創建 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)，
提交到 [kubernetes/website](https://github.com/kubernetes/website) 倉庫。
監視你提交的 PR，並根據需要回復 reviewer 的評論。繼續監視你的 PR，直到合併爲止。

## {{% heading "whatsnext" %}}

<!--
* [Generating Reference Documentation Quickstart](/docs/contribute/generate-ref-docs/quickstart/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
-->
* [生成參考文檔快速入門](/zh-cn/docs/contribute/generate-ref-docs/quickstart/)
* [爲 Kubernetes 組件和工具生成參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)
* [爲 kubectl 命令集生成參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubectl/)
