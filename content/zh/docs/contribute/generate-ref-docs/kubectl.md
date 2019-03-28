---
title: 为 kubectl 命令集生成参考文档
content_template: templates/task
---

<!--
---
title: Generating Reference Documentation for kubectl Commands
content_template: templates/task
---
-->

{{% capture overview %}}

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

本主题没有展示如何生成 [kubectl](/docs/reference/generated/kubectl/kubectl/) 组件的参考页面。相关说明请参见[为 Kubernetes 组件和工具生成参考页面](/zh/docs/home/contribute/generated-reference/kubernetes-components/)。
{{< /note >}}

{{% /capture %}}


{{% capture prerequisites %}}

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

* 你需要知道如何在一个 GitHub 项目仓库中创建一个 PR。一般来说，这涉及到创建仓库的一个分支。想了解更多信息，请参见[创建一个文档 PR](/zh/docs/home/contribute/create-pull-request/) 和 [GitHub 标准 Fork&PR 工作流](https://gist.github.com/Chaser324/ce0505fbed06b947d962)。

{{% /capture %}}


{{% capture steps %}}

<!--
## Getting three repositories
-->

## 下载三个仓库

<!--
If you don't already have the kubernetes/kubernetes repository, get it now:
-->

如果你还没有下载过 kubernetes/kubernetes 仓库，现在下载：

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

<!--
Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.
-->

确定 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 仓库的本地主目录。例如，如果按照前面的步骤来获取该仓库，则主目录是 `$GOPATH/src/github.com/kubernetes/kubernetes`。下文将该目录称为 `<k8s-base>`。

<!--
If you don't already have the kubernetes/website repository, get it now:
-->

如果你还没有下载过 kubernetes/website 仓库，现在下载：

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/website
```

<!--
Determine the base directory of your clone of the
[kubernetes/website](https://github.com/kubernetes/website) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes/website.`
The remaining steps refer to your base directory as `<web-base>`.
-->

确定 [kubernetes/website](https://github.com/kubernetes/website) 仓库的本地主目录。例如，如果按照前面的步骤来获取该仓库，则主目录是 `$GOPATH/src/github.com/kubernetes/website`。下文将该目录称为 `<web-base>`。

<!--
If you don't already have the kubernetes-incubator/reference-docs repository, get it now:
-->

如果你还没有下载过 kubernetes-incubator/reference-docs 仓库，现在下载：

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes-incubator/reference-docs
```

<!--
Determine the base directory of your clone of the
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes-incubator/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`.
-->

确定 [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) 仓库的本地主目录。例如，如果按照前面的步骤来获取该仓库，则主目录是 `$GOPATH/src/github.com/kubernetes-incubator/reference-docs`。下文将该目录称为 `<rdocs-base>`。

<!--
In your local kubernetes/kubernetes repository, check out the branch of interest,
and make sure it is up to date. For example, if you want to generate docs for
Kubernetes 1.9, you could use these commands:
-->

进入 kubernetes/kubernetes 仓库的本地目录，检出感兴趣的分支，并确保它是最新的。例如，如果希望为 Kubernetes 1.9 生成文档，可以使用以下命令：

```shell
cd <k8s-base>
git checkout release-1.9
git pull https://github.com/kubernetes/kubernetes release-1.9
```

<!--
## Editing the kubectl source code
-->

## 编辑 kubectl 源码

<!--
The reference documentation for the kubectl commands is automatically generated from
kubectl source code. If you want to change the reference documentation, the first step
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
and you want to backport your change to the release-1.9 branch. For instructions
on how to do this, see
[Propose a Cherry Pick](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md).
-->

例如，假设 master 分支正用于开发 Kubernetes 1.10 版本，而你希望将修改合入到已发布的 1.9 版本分支。相关的操作指南，请参见 [提议一个 cherry-pick 合入](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md)。

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
Go to `<rdocs-base>`, and open `Makefile` for editing:
-->

进入 `<rdocs-base>` 目录, 打开 `Makefile` 进行编辑：

<!--
Set `K8SROOT` to the base directory of your local kubernetes/kubernetes
repository. Set `WEBROOT` to the base directory of your local kubernetes/website repository.
Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
if you want to build docs for Kubernetes 1.9, set `MINOR_VERSION` to 9. Save and close `Makefile`.
-->

将 `K8SROOT` 设置为 kubernetes/kubernetes 仓库的本地主目录。将 `WEBROOT` 设置为 kubernetes/website 仓库的本地主目录。将 `MINOR_VERSION` 设置为要构建的文档的副版本号。例如，如果要为 Kubernetes 1.9 版本构建文档，请将 `MINOR_VERSION` 设置为 9。保存并关闭 `Makefile`。

<!--
## Building the brodocs image
-->

## 制作 brodocs 镜像

<!--
The doc generation code requires the `pwittrock/brodocs` Docker image.
-->

文档生成代码需要 `pwittrock/brodocs` Docker 镜像。

<!--
This command creates the `pwittrock/brodocs` Docker image. It also tries to push the image to
DockerHub, but it's OK if that step fails. As long as you have the image locally, the code generation
can succeed.
-->

该命令用于创建 `pwittrock/brodocs` Docker 镜像。它还尝试将镜像推送到 DockerHub，但是如果该步骤失败也没关系。只要镜像在本地，就可以成功生成代码。


```shell
make brodocs
```

<!--
Verify that you have the brodocs image:
-->

确认 brodocs 镜像是否存在：

```shell
docker images
```

<!--
The output shows `pwittrock/brodocs` as one of the available images:
-->

输出显示 `pwittrock/brodocs` 是可用镜像之一：

```shell
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
pwittrock/brodocs   latest              999d34a50d56        5 weeks ago         714MB
```

<!--
## Creating a version directory
-->

## 创建版本目录

<!--
In the `gen-kubectldocs/generators` directory, if you do not already
have a directory named `v1_MINOR_VERSION`, create one now by copying the directory
for the previous version. For example, suppose you want to generate docs for
Kubernetes 1.9, but you don't already have a `v1_9` directory. Then you could
create and populate a `v1_9` directory by running these commands:
-->

在 `gen-kubectldocs/generators` 目录中，如果你还没有一个名为 `v1_MINOR_VERSION` 的目录，那么现在通过复制前一版本的目录来创建一个。例如，假设你想要为 Kubernetes 1.9 版本生成文档，但是还没有 `v1_9` 目录，这时可以通过运行以下命令来创建并填充 `v1_9` 目录：

```shell
mkdir gen-kubectldocs/generators/v1_9
cp -r gen-kubectldocs/generators/v1_8/* gen-kubectldocs/generators/v1_9
```

<!--
## Checking out a branch in kubernetes/kubernetes
-->

## 从 kubernetes/kubernetes 检出一个分支

<!--
In you local kubernetes/kubernetes repository, checkout the branch that has
the version of Kubernetes that you want to document. For example, if you want
to generate docs for Kubernetes 1.9, checkout the release-1.9 branch. Make sure
you local branch is up to date.
-->

在本地 kubernetes/kubernetes 仓库中，检出你想要生成文档的、包含 Kubernetes 版本的分支。例如，如果希望为 Kubernetes 1.9 版本生成文档，请检出 1.9 分支。确保本地分支是最新的。

<!--
## Running the doc generation code
-->

## 运行文档生成代码

<!--
In you local kubernetes-incubator/reference-docs repository, build and run the
doc generation code. You might need to run the command as root:
-->

在 kubernetes-incubator/reference-docs 仓库的本地目录中，构建并运行文档生成代码。你可能需要以 root 用户运行命令：

```shell
cd <rdocs-base>
make cli
```

<!--
## Locate the generated files
-->

## 找到生成的文件

<!--
These two files are the primary output of a successful build. Verify that they exist:
-->

这两个文件是成功构建的主要产物。验证它们是否存在：

* `<rdocs-base>/gen-kubectldocs/generators/build/index.html`
* `<rdocs-base>/gen-kubectldocs/generators/build/navData.js`

<!--
## Copying files to the kubernetes/website repository
-->

## 将文件复制到 kubernetes/website 仓库

<!--
Copy the generated files from your local kubernetes-incubator/reference-docs
repository to your local kubernetes/website repository.
-->

将生成的文件从 kubernetes-incubator/reference-docs 仓库的本地目录复制到 kubernetes/website 仓库的本地目录。

```shell
cd <rdocs-base>
make copycli
```

<!--
## Adding and committing changes in kubernetes/website
-->

## 在 kubernetes/website 中添加和提交修改

<!--
List the files that were generated and copied to the `kubernetes/website`
repository:
-->

列出生成并准备合入到 `kubernetes/website` 仓库中的文件：

```
cd <web-base>
git status
```

<!--
The output shows the new and modified files. For example, the output
might look like this:
-->

输出展示了新增和修改的文件。例如，输出可能如下所示：

```shell
modified: docs/reference/generated/kubectl/kubectl-commands.html
modified: docs/reference/generated/kubectl/navData.js
```

<!--
Run `git add` and `git commit` to commit the files.
-->

运行 `git add` 和 `git commit` 将提交上述文件。

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

在 PR 合入的几分钟后，你更新的参考主题将出现在[已发布文档](/zh/docs/home/)中。


{{% /capture %}}

{{% capture whatsnext %}}

<!--
* [Generating Reference Documentation for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)
-->

* [为 Kubernetes 组件和工具生成参考文档](/zh/docs/home/contribute/generated-reference/kubernetes-components/)
* [为 Kubernetes API 生成参考文档](/zh/docs/home/contribute/generated-reference/kubernetes-api/)
* [为 Kubernetes 联邦 API 生成参考文档](/zh/docs/home/contribute/generated-reference/federation-api/)

{{% /capture %}}



