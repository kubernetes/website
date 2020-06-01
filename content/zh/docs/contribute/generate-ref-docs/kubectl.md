---
title: 为 kubectl 命令集生成参考文档
content_type: task
---

<!--
---
title: Generating Reference Documentation for kubectl Commands
content_type: task
---
-->

<!-- overview -->

<!--
This page shows how to automatically generate reference pages for the
commands provided by the `kubectl` tool.
-->

该页面显示了如何自动生成 `kubectl` 工具提供的命令的参考页面。

{{< note >}}
<!--
This topic shows how to generate reference documentation for
[kubectl commands](/docs/reference/generated/kubectl/kubectl-commands)
like
[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply) and
[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
-->
本主题展示了如何为 [kubectl 命令集](/docs/reference/generated/kubectl/kubectl-commands) 生成参考文档，如 [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply) 和 [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)。
<!--
This topic does not show how to generate the
[kubectl](/docs/reference/generated/kubectl/kubectl/)
options reference page. For instructions on how to generate the kubectl options
reference page, see
[Generating Reference Pages for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/).
-->
本主题没有展示如何生成 [kubectl](/docs/reference/generated/kubectl/kubectl/) 组件的参考页面。相关说明请参见[为 Kubernetes 组件和工具生成参考页面](/docs/home/contribute/generated-reference/kubernetes-components/)。
{{< /note >}}




## {{% heading "prerequisites" %}}


<!--
* You need to have
[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
installed.
-->

* 你需要安装 [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。

<!--
* You need to have
[Golang](https://golang.org/doc/install) version 1.9.1 or later installed,
and your `$GOPATH` environment variable must be set.
-->

* 你需要安装 1.9.1 或更高版本的 [Golang](https://golang.org/doc/install), 并在环境变量中设置 `$GOPATH`。

<!--
* You need to have
[Docker](https://docs.docker.com/engine/installation/) installed.
-->

* 你需要安装 [Docker](https://docs.docker.com/engine/installation/)。

<!--
* You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/) and
[GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).
-->

* 你需要知道如何在一个 GitHub 项目仓库中创建一个 PR。一般来说，这涉及到创建仓库的一个分支。想了解更多信息，请参见[创建一个文档 PR](/docs/home/contribute/create-pull-request/) 和 [GitHub 标准 Fork & PR 工作流](https://gist.github.com/Chaser324/ce0505fbed06b947d962)。




<!-- steps -->

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
go get -u github.com/spf13/pflag
go get -u github.com/spf13/cobra
go get -u gopkg.in/yaml.v2
go get -u kubernetes-incubator/reference-docs
```

<!-- 
If you don't already have the kubernetes/website repository, get it now: 
-->
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
Remove the spf13 package from `$GOPATH/src/k8s.io/kubernetes/vendor/github.com`. 
-->
从 `$GOPATH/src/k8s.io/kubernetes/vendor/github.com` 中卸载 spf13 软件包。

```shell
rm -rf $GOPATH/src/k8s.io/kubernetes/vendor/github.com/spf13
```

<!-- 
The kubernetes/kubernetes repository provides access to the kubectl and kustomize source code. 
-->
kubernetes/kubernetes 仓库提供对 kubectl 和 kustomize 源代码的访问。


<!-- 
* Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/k8s.io/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`. 
-->
确定 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 仓库的本地主目录。例如，如果按照前面的步骤来获取该仓库，则主目录是 `$GOPATH/src/k8s.io/kubernetes.`。下文将该目录称为 `<k8s-base>`。

<!-- 
* Determine the base directory of your clone of the
[kubernetes/website](https://github.com/kubernetes/website) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/<your-username>/website.`
The remaining steps refer to your base directory as `<web-base>`. 
-->
确定 [kubernetes/website](https://github.com/kubernetes/website) 仓库的本地主目录。例如，如果按照前面的步骤来获取该仓库，则主目录是 `$GOPATH/src/github.com/<your-username>/website`。下文将该目录称为 `<web-base>`。

<!-- 
* Determine the base directory of your clone of the
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes-incubator/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`. -->
确定 [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) 仓库的本地主目录。例如，如果按照前面的步骤来获取该仓库，则主目录是 `$GOPATH/src/github.com/kubernetes-incubator/reference-docs`。下文将该目录称为 `<rdocs-base>`。

<!-- 
In your local k8s.io/kubernetes repository, check out the branch of interest,
and make sure it is up to date. For example, if you want to generate docs for
Kubernetes 1.15, you could use these commands: 
-->
在您当地的 k8s.io/kubernetes 仓库中，检查感兴趣的分支并确保它是最新的。例如，如果您想要生成 Kubernetes 1.15 的文档，您可以使用以下命令：

```shell
cd <k8s-base>
git checkout release-1.15
git pull https://github.com/kubernetes/kubernetes release-1.15
```

<!-- 
If you do not need to edit the kubectl source code, follow the instructions to [Edit the Makefile](#editing-makefile). 
-->
如果不需要编辑 kubectl 源码，请按照说明[编辑 Makefile](#editing-makefile)。

<!--
## Editing the kubectl source code
-->

## 编辑 kubectl 源码

<!--
The kubectl command reference documentation is automatically generated from
the kubectl source code. If you want to change the reference documentation, the first step
is to change one or more comments in the kubectl source code. Make the change in your
local kubernetes/kubernetes repository, and then submit a pull request to the master branch of
[github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
-->

kubectl 命令集的参考文档是基于 kubectl 源码自动生成的。如果想要修改参考文档，可以从修改 kubectl 源码中的一个或多个注释开始。在本地 kubernetes/kubernetes 仓库中进行修改，然后向 [github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 的 master 分支提交 PR。

<!--
[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files)
is an example of a pull request that fixes a typo in the kubectl source code.
-->

[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files) 是一个对 kubectl 源码中的笔误进行修复的 PR 示例。

<!--
Monitor your pull request, and respond to reviewer comments. Continue to monitor your
pull request until it is merged into the master branch of the kubernetes/kubernetes repository.
-->

跟踪你的 PR，并回应评审人的评论。继续跟踪你的 PR，直到它合入到 kubernetes/kubernetes 仓库的 master 分支中。

<!--
## Cherry picking your change into a release branch
-->

## 以 cherry-pick 方式将你的修改合入已发布分支

<!--
Your change is now in the master branch, which is used for development of the next
Kubernetes release. If you want your change to appear in the docs for a Kubernetes
version that has already been released, you need to propose that your change be
cherry picked into the release branch.
-->

你的修改已合入 master 分支中，该分支用于开发下一个 Kubernetes 版本。如果你希望修改部分出现在已发布的 Kubernetes 版本文档中，则需要提议将它们以 cherry-pick 方式合入已发布分支。

<!--
For example, suppose the master branch is being used to develop Kubernetes 1.10,
and you want to backport your change to the release-1.15 branch. For instructions
on how to do this, see
[Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).
-->

例如，假设 master 分支正用于开发 Kubernetes 1.10 版本，而你希望将修改合入到已发布的 1.15 版本分支。相关的操作指南，请参见 [提议一个 cherry-pick 合入](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md)。

<!--
Monitor your cherry-pick pull request until it is merged into the release branch.
-->

跟踪你的 cherry-pick PR，直到它合入到已发布分支中。

{{< note >}}
<!--
Proposing a cherry pick requires that you have permission to set a label and a
milestone in your pull request. If you don’t have those permissions, you will
need to work with someone who can set the label and milestone for you.
-->

提议一个 cherry-pick 合入，需要你有在 PR 中设置标签和里程碑的权限。如果你没有，你需要与有权限为你设置标签和里程碑的人合作完成。
{{< /note >}}

<!--
## Editing Makefile
-->

## 编辑 Makefile

<!--
Go to `<rdocs-base>`, and open the `Makefile` for editing:
-->

进入 `<rdocs-base>` 目录, 打开 `Makefile` 进行编辑：

<!--
* Set `K8SROOT` to `<k8s-base>`.
* Set `WEBROOT` to `<web-base>`.
* Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
if you want to build docs for Kubernetes 1.15, set `MINOR_VERSION` to 15. Save and close the `Makefile`.
-->
* 设置 `K8SROOT` 为 `<k8s-base>`。
* 设置 `WEBROOT` 为 `<web-base>`。
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
## Creating a version directory
-->
## 创建版本目录

<!-- 
The version directory is a staging area for the kubectl command reference build.
The YAML files in this directory are used to create the structure and navigation
of the kubectl command reference. 
-->
版本目录是 kubectl 命令集构建的临时区域。该目录中的 YAML 文件用于创建 kubectl 命令集参考的结构和导航。

<!--
In the `<rdocs-base>/gen-kubectldocs/generators` directory, if you do not already
have a directory named `v1_<MINOR_VERSION>`, create one now by copying the directory
for the previous version. For example, suppose you want to generate docs for
Kubernetes 1.15, but you don't already have a `v1_15` directory. Then you could
create and populate a `v1_15` directory by running these commands:
-->

在 `gen-kubectldocs/generators` 目录中，如果你还没有一个名为 `v1_MINOR_VERSION` 的目录，那么现在通过复制前一版本的目录来创建一个。例如，假设你想要为 Kubernetes 1.15 版本生成文档，但是还没有 `v1_15` 目录，这时可以通过运行以下命令来创建并填充 `v1_15` 目录：

```shell
cd <k8s-base>
git checkout release-1.15
git pull https://github.com/kubernetes/kubernetes release-1.15
```

<!--
## Checking out a branch in k8s.io/kubernetes
-->

## 从 kubernetes/kubernetes 检出一个分支

<!--
In your local <k8s-base> repository, checkout the branch that has
the version of Kubernetes that you want to document. For example, if you want
to generate docs for Kubernetes 1.15, checkout the release-1.15 branch. Make sure
you local branch is up to date.
-->

在本地 <k8s-base> 仓库中，检出你想要生成文档的、包含 Kubernetes 版本的分支。例如，如果希望为 Kubernetes 1.15 版本生成文档，请检出 1.15 分支。确保本地分支是最新的。

```shell
cd <k8s-base>
git checkout release-1.15
git pull https://github.com/kubernetes/kubernetes release-1.15
```

<!--
## Running the doc generation code
-->

## 运行文档生成代码

<!--
In your local kubernetes-incubator/reference-docs repository, build and run the
kubectl command reference generation code. You might need to run the command as root:
-->

在 kubernetes-incubator/reference-docs 仓库的本地目录中，构建并运行 kubectl 命令集参数生成代码。你可能需要以 root 用户运行命令：

```shell
cd <rdocs-base>
make copycli
```

<!-- 
The `copycli` command will clean the staging directories, generate the kubectl command files,
and copy the collated kubectl reference HTML page and assets to `<web-base>`. 
-->
`copycli` 命令将清理暂存目录，生成 kubectl 命令集文件，并将整理后的 kubectl 参考 HTML 页面和文件复制到 `<web-base>`。

<!--
## Locate the generated files
-->
## 找到生成的文件

<!--
Verify that these two files have been generated:
-->
验证是否已生成以下两个文件：

```shell
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

<!-- 
## Locate the copied files
-->
## 找到复制的文件

<!-- 
Verify that all generated files have been copied to your `<web-base>`:
-->
确认所有生成的文件都已复制到您的 `<web-base>`：

```shell
cd <web-base>
git status
```

<!--
The output should include the modified files:
-->
输出应包括修改后的文件：

```
static/docs/reference/generated/kubectl/kubectl-commands.html
static/docs/reference/generated/kubectl/navData.js
```

<!--
Additionally, the output might show the modified files:
-->
此外，输出可能显示修改后的文件：

```
static/docs/reference/generated/kubectl/scroll.js
static/docs/reference/generated/kubectl/stylesheet.css
static/docs/reference/generated/kubectl/tabvisibility.js
static/docs/reference/generated/kubectl/node_modules/bootstrap/dist/css/bootstrap.min.css
static/docs/reference/generated/kubectl/node_modules/highlight.js/styles/default.css
static/docs/reference/generated/kubectl/node_modules/jquery.scrollto/jquery.scrollTo.min.js
static/docs/reference/generated/kubectl/node_modules/jquery/dist/jquery.min.js
static/docs/reference/generated/kubectl/node_modules/font-awesome/css/font-awesome.min.css
```

<!--
## Locally test the documentation
-->
## 在本地测试文档

<!-- 
Build the Kubernetes documentation in your local `<web-base>`.
-->
在本地 `<web-base>` 中构建 Kubernetes 文档。

```shell
cd <web-base>
make docker-serve
```

<!--
View the [local preview](https://localhost:1313/docs/reference/generated/kubectl/kubectl-commands/).
-->
查看[本地预览](https://localhost:1313/docs/reference/generated/kubectl/kubectl-commands/)。

<!-- 
## Adding and committing changes in kubernetes/website
-->
## 在 kubernetes/website 中添加和提交更改

<!-- 
Run `git add` and `git commit` to commit the files.
-->
运行 `git add` 和 `git commit` 提交修改文件。

<!--
## Creating a pull request
-->
## 创建 PR

<!--
Create a pull request to the `kubernetes/website` repository. Monitor your
pull request, and respond to review comments as needed. Continue to monitor
your pull request until it is merged.
-->

对 `kubernetes/website` 仓库创建 PR。跟踪你的 PR，并根据需要回应评审人的评论。继续跟踪你的 PR，直到它被合入。

<!--
A few minutes after your pull request is merged, your updated reference
topics will be visible in the
[published documentation](/docs/home).
-->

在 PR 合入的几分钟后，你更新的参考主题将出现在[已发布文档](/docs/home/)中。




## {{% heading "whatsnext" %}}


<!--
* [Generating Reference Documentation for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)
-->

* [为 Kubernetes 组件和工具生成参考文档](/docs/home/contribute/generated-reference/kubernetes-components/)
* [为 Kubernetes API 生成参考文档](/docs/home/contribute/generated-reference/kubernetes-api/)
* [为 Kubernetes 联邦 API 生成参考文档](/docs/home/contribute/generated-reference/federation-api/)

