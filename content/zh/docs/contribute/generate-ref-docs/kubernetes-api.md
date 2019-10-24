---
title: 为 Kubernetes API 生成参考文档
content_template: templates/task
---
<!--
---
title: Generating Reference Documentation for the Kubernetes API
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page shows how to update the generated reference docs for the Kubernetes API.
The Kubernetes API reference documentation is built from the
[Kubernetes OpenAPI spec](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json)
and tools from [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).

If you find bugs in the generated documentation, you need to
[fix them upstream](/docs/contribute/generate-ref-docs/contribute-upstream/).

If you need only to regenerate the reference documentation from the [OpenAPI](https://github.com/OAI/OpenAPI-Specification)
spec, continue reading this page.
-->
本页面展示了如何为 Kubernetes API 更新自动生成的参考文档。
Kubernetes API 参考文档是从 [Kubernetes OpenAPI 规范](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json)构建的，而工具是从 [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) 构建的。

如果您在生成的文档中发现错误，则需要[将其上游修复](/docs/contribute/generate-ref-docs/contribute-upstream/)。

如果您只需要从 [OpenAPI](https://github.com/OAI/OpenAPI-Specification) 规范中重新生成参考文档，请继续阅读此页面。

{{% /capture %}}


{{% capture prerequisites %}}

<!--
You need to have these tools installed:
-->

你需要安装以下软件：

<!--
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Golang](https://golang.org/doc/install) version 1.9.1 or later
-->

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* 1.9.1 或更高版本的 [Golang](https://golang.org/doc/install)

<!--
You need to know how to create a pull request (PR) to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/contribute/start/) and
[GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).
-->
你需要知道如何在一个 GitHub 项目仓库中创建一个 PR。一般来说，这涉及到创建仓库的 fork 分支。想了解更多信息，请参见[创建一个文档 PR](/docs/contribute/start/) 和 [GitHub 标准 Fork & PR 工作流](https://gist.github.com/Chaser324/ce0505fbed06b947d962)。

{{% /capture %}}


{{% capture steps %}}

<!-- 
## Setting up the local repositories
-->
## 设置本地仓库

<!-- 
Create a local workspace and set your `GOPATH`.
-->
创建本地工作区并设置您的 `GOPATH`。

```shell
mkdir -p $HOME/<workspace>

export GOPATH=$HOME/<workspace>
```

<!-- 
Get a local clone of the following repositories: 
-->
获取以下仓库的本地克隆：

```shell
go get -u github.com/kubernetes-incubator/reference-docs

go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

<!-- 
If you don't already have the kubernetes/website repository, get it now: -->
如果您还没有下载过 `kubernetes/website` 仓库，现在下载：

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

<!-- 
Get a clone of the kubernetes/kubernetes repository as k8s.io/kubernetes: 
-->
克隆下载 kubernetes/kubernetes 仓库，并作为 k8s.io/kubernetes：

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
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs)
repository is `$GOPATH/src/github.com/kubernetes-incubator/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`.
-->
* [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 仓库克隆后的基本目录为 `$GOPATH/src/k8s.io/kubernetes`。
其余后续步骤将您的基本目录称为 `<k8s-base>`。

* [kubernetes/website](https://github.com/kubernetes/website) 仓库克隆后的基本目录为 `$GOPATH/src/github.com/<your username>/website`。
其余后续步骤将您的基本目录称为 `<web-base>`。

* [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) 仓库克隆后的基本目录为 `$GOPATH/src/github.com/kubernetes-incubator/reference-docs`。
其余后续步骤将您的基本目录称为 `<rdocs-base>`。

<!-- 
## Generating the API reference docs
-->
## 生成 API 参考文档

<!-- 
This section shows how to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/). 
-->
本节说明如何生成[已发布的 Kubernetes API 参考文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

<!-- 
### Modifying the Makefile
-->
### 修改 Makefile 文件

<!-- 
Go to `<rdocs-base>`, and open the `Makefile` for editing: 
-->
进入 `<rdocs-base>` 目录，然后编辑 `Makefile` 文件：

<!-- 
* Set `K8SROOT` to `<k8s-base>`.
* Set `WEBROOT` to `<web-base>`.
* Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
if you want to build docs for Kubernetes 1.15, set `MINOR_VERSION` to 15. Save and close the `Makefile`.
-->
* 设置 `K8SROOT` 为 `<k8s-base>`.
* 设置 `WEBROOT` 为 `<web-base>`.
* 设置 `MINOR_VERSION` 为要构建的文档的次要版本。例如，如果您想为 Kubernetes 1.15 构建文档，请将 `MINOR_VERSION` 设置为 15。保存并关闭 `Makefile` 文件。

<!--
For example, update the following variables:
-->
例如，更新以下变量：

```
WEBROOT=$(GOPATH)/src/github.com/<your-username>/website
K8SROOT=$(GOPATH)/src/k8s.io/kubernetes
MINOR_VERSION=15
```

<!--
### Copying the OpenAPI spec
-->
### 复制 OpenAPI 规范

<!-- 
Run the following command in `<rdocs-base>`: 
-->
在 `<rdocs-base>` 目录中运行以下命令：

```shell
make updateapispec
```

<!--
The output shows that the file was copied:
-->
输出显示文件已被复制：

```shell
cp ~/src/k8s.io/kubernetes/api/openapi-spec/swagger.json gen-apidocs/generators/openapi-spec/swagger.json
```

<!-- 
### Building the API reference docs 
-->
### 构建 API 参考文档 

<!-- 
Run the following command in `<rdocs-base>`: 
-->
在 `<rdocs-base>` 目录中运行以下命令：

```shell
make api
```

<!-- 
Verify that these two files have been generated: 
-->
验证是否已生成这两个文件：

```shell
[ -e "<rdocs-base>/gen-apidocs/generators/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-apidocs/generators/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

<!-- 
### Creating directories for published docs 
-->
### 创建发布文档的目录

<!-- 
Create the directories in `<web-base>` for the generated API reference files: 
-->
在 `<web-base>` 目录中为生成的 API 参考文件创建目录：

```shell
mkdir -p <web-base>/static/docs/reference/generated/kubernetes-api/v1.<minor-version>
mkdir -p <web-base>/static/docs/reference/generated/kubernetes-api/v1.<minor-version>/css
mkdir -p <web-base>/static/docs/reference/generated/kubernetes-api/v1.<minor-version>/fonts
```

<!-- 
## Copying the generated docs to the kubernetes/website repository
-->
## 将生成的文档复制到 kubernetes/website 仓库

<!-- 
Run the following command in `<rdocs-base>` to copy the generated files to
your local kubernetes/website repository:
-->
在 `<rdocs-base>` 目录中运行以下命令，将生成的文件复制到本地 kubernetes/website 仓库。

```shell
make copyapi
```

<!-- 
Go to the base of your local kubernetes/website repository, and
see which files have been modified:
-->
进入 kubernetes/website 仓库的本地主目录，并查看已修改的文件：

```shell
cd <web-base>
git status
```

<!-- 
The output shows the modified files:
-->
输出显示修改后的文件：

```
static/docs/reference/generated/kubernetes-api/v1.15/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/v1.15/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/v1.15/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/v1.15/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.woff2
static/docs/reference/generated/kubernetes-api/v1.15/index.html
static/docs/reference/generated/kubernetes-api/v1.15/jquery.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/v1.15/navData.js
static/docs/reference/generated/kubernetes-api/v1.15/scroll.js
```

<!-- 
## Updating the API reference index pages
-->
## 更新 API 参考索引页面


<!-- 
* Open `<web-base>/content/en/docs/reference/kubernetes-api/index.md` for editing, and update the API reference 
  version number. For example:
-->
* 打开 `<web-base>/content/en/docs/reference/kubernetes-api/index.md` 文件进行编辑，并且更新 API 参考版本号。例如：

    ```
    ---
    title: v1.15
    ---

    [Kubernetes API v1.15](/docs/reference/generated/kubernetes-api/v1.15/)
    ```

<!-- 
* Open `<web-base>/content/en/docs/reference/_index.md` for editing, and add a
   new link for the latest API reference. Remove the oldest API reference version.
   There should be five links to the most recent API references.
-->
* 打开 `<web-base>/content/en/docs/reference/_index.md` 文件进行编辑，并添加新链接以获取最新的 API 参考。移除最旧的 API 参考版本。应该有五个指向最新 API 参考的链接。


<!--
## Locally test the API reference
-->
## 在本地测试 API 参考

<!--
Publish a local version of the API reference.
Verify the [local preview](http://localhost:1313/docs/reference/generated/kubernetes-api/v1.15/).
-->
发布 API 参考的本地版本。
验证 [本地预览](http://localhost:1313/docs/reference/generated/kubernetes-api/v1.15/)。

```shell
cd <web-base>
make docker-serve
```

<!--
## Commit the changes
-->
## 提交更改

<!-- 
In `<web-base>` run `git add` and `git commit` to commit the change. -->
在 `<web-base>` 中运行 `git add` 和 `git commit` 来提交更改。

<!-- 
Submit your changes as a
[pull request](/docs/contribute/start/) to the
[kubernetes/website](https://github.com/kubernetes/website) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.
-->
将您的更改[创建 PR](/docs/contribute/start/) 提交到 [kubernetes/website](https://github.com/kubernetes/website) 仓库。监视您提交的 PR，并根据需要回复 reviewer 的评论。继续监视您的 PR，直到合并为止。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)
-->
* [为 Kubernetes 组件和工具生成参考文档](/docs/home/contribute/generated-reference/kubernetes-components/)
* [为 kubectl 命令集生成参考文档](/docs/home/contribute/generated-reference/kubectl/)
* [为 Kubernetes 联邦 API 生成参考文档](/docs/home/contribute/generated-reference/federation-api/)

{{% /capture %}}