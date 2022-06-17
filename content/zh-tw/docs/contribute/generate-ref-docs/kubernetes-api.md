---
title: 為 Kubernetes API 生成參考文件
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

If you need only to regenerate the reference documentation from the [OpenAPI](https://github.com/OAI/OpenAPI-Specification)
spec, continue reading this page.
-->
本頁面顯示瞭如何更新 Kubernetes API 參考文件。

Kubernetes API 參考文件是從
[Kubernetes OpenAPI 規範](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json)
構建的，
且使用[kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) 生成程式碼。

如果你在生成的文件中發現錯誤，則需要[在上游修復](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstream/)。

如果你只需要從 [OpenAPI](https://github.com/OAI/OpenAPI-Specification) 規範中重新生成參考文件，請繼續閱讀此頁。

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

<!-- 
## Setting up the local repositories

Create a local workspace and set your `GOPATH`.
-->
## 配置本地倉庫

建立本地工作區並設定你的 `GOPATH`。

```shell
mkdir -p $HOME/<workspace>
export GOPATH=$HOME/<workspace>
```

<!-- 
Get a local clone of the following repositories: 
-->
獲取以下倉庫的本地克隆：

```shell
go get -u github.com/kubernetes-sigs/reference-docs

go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

<!-- 
If you don't already have the kubernetes/website repository, get it now: 
-->
如果你還沒有下載過 `kubernetes/website` 倉庫，現在下載：

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

<!-- 
Get a clone of the kubernetes/kubernetes repository as k8s.io/kubernetes: 
-->
克隆 kubernetes/kubernetes 倉庫作為 k8s.io/kubernetes：

```shell
git clone https://github.com/kubernetes/kubernetes $GOPATH/src/k8s.io/kubernetes
```

<!-- 
* The base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository is
`$GOPATH/src/k8s.io/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.

* The base directory of your clone of the
[kubernetes/website](https://github.com/kubernetes/website) repository is
`$GOPATH/src/github.com/<your username>/website.`
The remaining steps refer to your base directory as `<web-base>`.

* The base directory of your clone of the
[kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
repository is `$GOPATH/src/github.com/kubernetes-sigs/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`.
-->
* [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 倉庫克隆後的根目錄為
  `$GOPATH/src/k8s.io/kubernetes`。 後續步驟將此目錄稱為 `<k8s-base>`。
* [kubernetes/website](https://github.com/kubernetes/website) 倉庫克隆後的根目錄為
  `$GOPATH/src/github.com/<your username>/website`。後續步驟將此目錄稱為 `<web-base>`。
* [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
  倉庫克隆後的基本目錄為 `$GOPATH/src/github.com/kubernetes-sigs/reference-docs.`。
  後續步驟將此目錄稱為 `<rdocs-base>`。

<!-- 
## Generating the API reference docs

This section shows how to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/). 
-->
## 生成 API 參考文件

本節說明如何生成[已釋出的 Kubernetes API 參考文件](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

<!-- 
### Setting build variables

Go to `<rdocs-base>`, and open the `Makefile` for editing: 
-->
### 設定構建變數 {#setting-build-variables}

<!-- 
* Set `K8S_ROOT` to `<k8s-base>`.
* Set `K8S_WEBROOT` to `<web-base>`.
* Set `K8S_RELEASE` to the version of the docs you want to build.
  For example, if you want to build docs for Kubernetes 1.17.0, set `K8S_RELEASE` to 1.17.0.
-->
* 設定 `K8S_ROOT` 為 `<k8s-base>`.
* 設定 `K8S_WEBROOT` 為 `<web-base>`.
* 設定 `K8S_RELEASE` 為要構建的文件的版本。
  例如，如果你想為 Kubernetes 1.17.0 構建文件，請將 `K8S_RELEASE` 設定為 1.17.0。

<!-- 
For example: 
-->
例如：

```shell
export K8S_WEBROOT=${GOPATH}/src/github.com/<your-username>/website
export K8S_ROOT=${GOPATH}/src/k8s.io/kubernetes
export K8S_RELEASE=1.17.0
```

<!--
### Creating versioned directory and fetching Open API spec

The `updateapispec` build target creates the versioned  build directory.
After the directory is created, the Open API spec is fetched from the
`<k8s-base>` repository. These steps ensure that the version
of the configuration files and Kubernetes Open API spec match the release version.
The versioned directory name follows the pattern of `v<major>_<minor>`.
-->
### 建立版本目錄並複製 OpenAPI 規範

構建目標 `updateapispec` 負責建立版本化的構建目錄。
目錄建立了之後，從 `<k8s-base>` 倉庫取回 OpenAPI 規範檔案。
這些步驟確保配置檔案的版本和 Kubernetes OpenAPI 規範的版本與發行版本匹配。
版本化目錄的名稱形式為 `v<major>_<minor>`。

<!--
In the `<rdocs-base>` directory, run the following build target:
-->
在  `<rdocs-base>`  目錄中，執行以下命令來構建：

```shell
cd <rdocs-base>
make updateapispec
```

<!-- 
### Building the API reference docs 

The `copyapi` target builds the API reference and
copies the generated files to directories in `<web-base>`.
Run the following command in `<rdocs-base>`:

-->
### 構建 API 參考文件 

構建目標 `copyapi` 會生成 API 參考文件並將所生成檔案複製到
`<web-base` 中的目錄下。
在 `<rdocs-base>` 目錄中執行以下命令：

```shell
cd <rdocs-base>
make copyapi
```

<!-- 
Verify that these two files have been generated: 
-->
驗證是否已生成這兩個檔案：

```shell
[ -e "<rdocs-base>/gen-apidocs/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-apidocs/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

<!--
Go to the base of your local `<web-base>`, and
view which files have been modified:
-->
進入本地 `<web-base>` 目錄，檢查哪些檔案被更改：

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
## Updating the API reference index pages

When generating reference documentation for a new release, update the file,
`<web-base>/content/en/docs/reference/kubernetes-api/api-index.md` with the new
version number.
-->
## 更新 API 參考索引頁面

在為新發行版本生成參考文件時，需要更新下面的檔案，使之包含新的版本號：
`<web-base>/content/en/docs/reference/kubernetes-api/api-index.md`。

<!--
* Open `<web-base>/content/en/docs/reference/kubernetes-api/api-index.md` for editing,
  and update the API reference version number. For example:

    ```
    title: v1.17
    [Kubernetes API v1.17](/docs/reference/generated/kubernetes-api/v1.17/)
    ```
-->
* 開啟並編輯 `<web-base>/content/en/docs/reference/kubernetes-api/api-index.md`，
  API 參考的版本號。例如：

    ```
    title: v1.17
    [Kubernetes API v1.17](/docs/reference/generated/kubernetes-api/v1.17/)
    ```
<!--
* Open `<web-base>/content/en/docs/reference/_index.md` for editing, and add a
  new link for the latest API reference. Remove the oldest API reference version.
  There should be five links to the most recent API references.
-->
* 開啟編輯 `<web-base>/content/en/docs/reference/_index.md`，新增指向最新 API 參考
  的連結，刪除最老的 API 版本。
  通常保留最近的五個版本的 API 參考的連結。

<!--
## Locally test the API reference

Publish a local version of the API reference.
Verify the [local preview](http://localhost:1313/docs/reference/generated/kubernetes-api/{{< param "version">}}/).
-->
## 在本地測試 API 參考

釋出 API 參考的本地版本。
檢查[本地預覽](http://localhost:1313/docs/reference/generated/kubernetes-api/{{< param "version">}}/)。

```shell
cd <web-base>
git submodule update --init --recursive --depth 1 # if not already done
make container-serve
```

<!--
## Commit the changes

In `<web-base>` run `git add` and `git commit` to commit the change.
-->
## 提交更改

在 `<web-base>` 中執行 `git add` 和 `git commit` 來提交更改。

<!-- 
Submit your changes as a
[pull request](/docs/contribute/new-content/open-a-pr/) to the
[kubernetes/website](https://github.com/kubernetes/website) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.
-->
基於你所生成的更改[建立 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)，
提交到 [kubernetes/website](https://github.com/kubernetes/website) 倉庫。
監視你提交的 PR，並根據需要回復 reviewer 的評論。繼續監視你的 PR，直到合併為止。

## {{% heading "whatsnext" %}}

<!--
* [Generating Reference Documentation Quickstart](/docs/contribute/generate-ref-docs/quickstart/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
-->
* [生成參考文件快速入門](/zh-cn/docs/contribute/generate-ref-docs/quickstart/)
* [為 Kubernetes 元件和工具生成參考文件](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)
* [為 kubectl 命令集生成參考文件](/zh-cn/docs/contribute/generate-ref-docs/kubectl/)

