---
title: 为 Kubernetes API 生成参考文档
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
本页面显示了如何更新 Kubernetes API 参考文档。

Kubernetes API 参考文档是从
[Kubernetes OpenAPI 规范](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json)
构建的，
且使用[kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) 生成代码。

如果您在生成的文档中发现错误，则需要[在上游修复](/zh/docs/contribute/generate-ref-docs/contribute-upstream/)。

如果您只需要从 [OpenAPI](https://github.com/OAI/OpenAPI-Specification) 规范中重新生成参考文档，请继续阅读此页。

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

<!-- 
## Setting up the local repositories

Create a local workspace and set your `GOPATH`.
-->
## 配置本地仓库

创建本地工作区并设置你的 `GOPATH`。

```shell
mkdir -p $HOME/<workspace>
export GOPATH=$HOME/<workspace>
```

<!-- 
Get a local clone of the following repositories: 
-->
获取以下仓库的本地克隆：

```shell
go get -u github.com/kubernetes-sigs/reference-docs

go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

<!-- 
If you don't already have the kubernetes/website repository, get it now: 
-->
如果你还没有下载过 `kubernetes/website` 仓库，现在下载：

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

<!-- 
Get a clone of the kubernetes/kubernetes repository as k8s.io/kubernetes: 
-->
克隆 kubernetes/kubernetes 仓库作为 k8s.io/kubernetes：

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
* [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 仓库克隆后的根目录为
  `$GOPATH/src/k8s.io/kubernetes`。 后续步骤将此目录称为 `<k8s-base>`。
* [kubernetes/website](https://github.com/kubernetes/website) 仓库克隆后的根目录为
  `$GOPATH/src/github.com/<your username>/website`。后续步骤将此目录称为 `<web-base>`。
* [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
  仓库克隆后的基本目录为 `$GOPATH/src/github.com/kubernetes-sigs/reference-docs.`。
  后续步骤将此目录称为 `<rdocs-base>`。

<!-- 
## Generating the API reference docs

This section shows how to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/). 
-->
## 生成 API 参考文档

本节说明如何生成[已发布的 Kubernetes API 参考文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

<!-- 
### Setting build variables

Go to `<rdocs-base>`, and open the `Makefile` for editing: 
-->
### 设置构建变量 {#setting-build-variables}

<!-- 
* Set `K8S_ROOT` to `<k8s-base>`.
* Set `K8S_WEBROOT` to `<web-base>`.
* Set `K8S_RELEASE` to the version of the docs you want to build.
  For example, if you want to build docs for Kubernetes 1.17.0, set `K8S_RELEASE` to 1.17.0.
-->
* 设置 `K8S_ROOT` 为 `<k8s-base>`.
* 设置 `K8S_WEBROOT` 为 `<web-base>`.
* 设置 `K8S_RELEASE` 为要构建的文档的版本。
  例如，如果您想为 Kubernetes 1.17.0 构建文档，请将 `K8S_RELEASE` 设置为 1.17.0。

<!-- 
For example: 
-->
例如：

```shell
export K8S_WEBROOT=$(GOPATH)/src/github.com/<your-username>/website
export K8S_ROOT=$(GOPATH)/src/k8s.io/kubernetes
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
### 创建版本目录并复制 OpenAPI 规范

构建目标 `updateapispec` 负责创建版本化的构建目录。
目录创建了之后，从 `<k8s-base>` 仓库取回 OpenAPI 规范文件。
这些步骤确保配置文件的版本和 Kubernetes OpenAPI 规范的版本与发行版本匹配。
版本化目录的名称形式为 `v<major>_<minor>`。

<!--
In the `<rdocs-base>` directory, run the following build target:
-->
在  `<rdocs-base>`  目录中，运行以下命令来构建：

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
### 构建 API 参考文档 

构建目标 `copyapi` 会生成 API 参考文档并将所生成文件复制到
`<web-base` 中的目录下。
在 `<rdocs-base>` 目录中运行以下命令：

```shell
cd <rdocs-base>
make copyapi
```

<!-- 
Verify that these two files have been generated: 
-->
验证是否已生成这两个文件：

```shell
[ -e "<rdocs-base>/gen-apidocs/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-apidocs/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

<!--
Go to the base of your local `<web-base>`, and
view which files have been modified:
-->
进入本地 `<web-base>` 目录，检查哪些文件被更改：

```shell
cd <web-base>
git status
```

<!-- 
The output is similar to: 
-->
输出类似于：

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
## 更新 API 参考索引页面

在为新发行版本生成参考文档时，需要更新下面的文件，使之包含新的版本号：
`<web-base>/content/en/docs/reference/kubernetes-api/api-index.md`。

<!--
* Open `<web-base>/content/en/docs/reference/kubernetes-api/api-index.md` for editing,
  and update the API reference version number. For example:

    ```
    title: v1.17
    [Kubernetes API v1.17](/docs/reference/generated/kubernetes-api/v1.17/)
    ```
-->
* 打开并编辑 `<web-base>/content/en/docs/reference/kubernetes-api/api-index.md`，
  API 参考的版本号。例如：

    ```
    title: v1.17
    [Kubernetes API v1.17](/docs/reference/generated/kubernetes-api/v1.17/)
    ```
<!--
* Open `<web-base>/content/en/docs/reference/_index.md` for editing, and add a
  new link for the latest API reference. Remove the oldest API reference version.
  There should be five links to the most recent API references.
-->
* 打开编辑 `<web-base>/content/en/docs/reference/_index.md`，添加指向最新 API 参考
  的链接，删除最老的 API 版本。
  通常保留最近的五个版本的 API 参考的链接。

<!--
## Locally test the API reference

Publish a local version of the API reference.
Verify the [local preview](http://localhost:1313/docs/reference/generated/kubernetes-api/{{< param "version">}}/).
-->
## 在本地测试 API 参考

发布 API 参考的本地版本。
检查[本地预览](http://localhost:1313/docs/reference/generated/kubernetes-api/{{< param "version">}}/)。

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

在 `<web-base>` 中运行 `git add` 和 `git commit` 来提交更改。

<!-- 
Submit your changes as a
[pull request](/docs/contribute/new-content/open-a-pr/) to the
[kubernetes/website](https://github.com/kubernetes/website) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.
-->
基于你所生成的更改[创建 PR](/zh/docs/contribute/new-content/open-a-pr/)，
提交到 [kubernetes/website](https://github.com/kubernetes/website) 仓库。
监视您提交的 PR，并根据需要回复 reviewer 的评论。继续监视您的 PR，直到合并为止。

## {{% heading "whatsnext" %}}

<!--
* [Generating Reference Documentation Quickstart](/docs/contribute/generate-ref-docs/quickstart/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
-->
* [生成参考文档快速入门](/zh/docs/contribute/generate-ref-docs/quickstart/)
* [为 Kubernetes 组件和工具生成参考文档](/zh/docs/contribute/generate-ref-docs/kubernetes-components/)
* [为 kubectl 命令集生成参考文档](/zh/docs/contribute/generate-ref-docs/kubectl/)

