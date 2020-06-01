---
title: 为 Kubernetes 组件和工具生成参考页面
content_type: task
---

<!--
---
title: Generating Reference Pages for Kubernetes Components and Tools
content_type: task
---
-->

<!-- overview -->

<!--
This page shows how to use the `update-imported-docs` tool to generate
reference documentation for tools and components in the
[Kubernetes](https://github.com/kubernetes/kubernetes) and
[Federation](https://github.com/kubernetes/federation) repositories.
-->

本页面展示了如何使用 `update-imported-docs` 工具来为 [Kubernetes](https://github.com/kubernetes/kubernetes) 和 [Federation](https://github.com/kubernetes/federation) 仓库中的工具和组件生成参考文档。



## {{% heading "prerequisites" %}}


<!--
* You need a machine that is running Linux or macOS.
-->

* 你需要一个运行着 Linux 或 macOS 操作系统的机器。

<!--
* You need to have this software installed:

    * [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

    * [Golang](https://golang.org/doc/install) version 1.9 or later

    * [make](https://www.gnu.org/software/make/)

    * [gcc compiler/linker](https://gcc.gnu.org/)
-->

* 你需要安装以下软件：

    * [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

    * 1.9或更高版本的 [Golang](https://golang.org/doc/install)

    * [make](https://www.gnu.org/software/make/)

    * [gcc compiler/linker](https://gcc.gnu.org/)

<!--
* Your `$GOPATH` environment variable must be set.
-->

* 在环境变量中设置 `$GOPATH`。

<!--
* You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).
-->

* 你需要知道如何在一个 GitHub 项目仓库中创建一个 PR。一般来说，这涉及到创建仓库的一个分支。想了解更多信息，请参见[创建一个文档 PR](/docs/home/contribute/create-pull-request/)。



<!-- steps -->

<!--
## Getting two repositories
-->

## 下载两个仓库

<!--
If you don't already have the `kubernetes/website` repository, get it now:
-->

如果你还没有下载过 `kubernetes/website` 仓库，现在下载：

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/website
```

<!--
Determine the base directory of your clone of the
[kubernetes/website](https://github.com/kubernetes/website) repository.
For example, if you followed the preceding step to get the repository,
your base directory is `$GOPATH/src/github.com/kubernetes/website.`
The remaining steps refer to your base directory as `<web-base>`.
-->

确定 [kubernetes/website](https://github.com/kubernetes/website) 仓库的本地主目录。例如，如果按照前面的步骤来获取该仓库，则主目录是 `$GOPATH/src/github.com/kubernetes/website`。下文将该目录称为 `<web-base>`。

<!--
If you plan on making changes to the ref docs, and if you don't already have
the `kubernetes/kubernetes` repository, get it now:
-->

如果你想对参考文档进行修改，但是你还没下载过 `kubernetes/kubernetes` 仓库，现在下载：

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

<!--
Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the repository,
your base directory is `$GOPATH/src/github.com/kubernetes/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.
-->

确定 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 仓库的本地主目录。例如，如果按照前面的步骤来获取该仓库，则主目录是 `$GOPATH/src/github.com/kubernetes/kubernetes`。下文将该目录称为 `<k8s-base>`。

{{< note >}}
<!--
If you only need to generate, but not change, the reference docs, you don't need to
manually get the `kubernetes/kubernetes` repository. When you run the `update-imported-docs`
tool, it automatically clones the `kubernetes/kubernetes` repository.
-->

如果你只想生成参考文档，而不需要修改，则不需要手动下载 `kubernetes/kubernetes` 仓库。当你运行 `update-imported-docs` 工具时，它会自动克隆 `kubernetes/kubernetes` 仓库。
{{< /note >}}

<!--
## Editing the Kubernetes source code
-->

## 编辑 Kubernetes 源码

<!--
The reference documentation for the Kubernetes components and tools is automatically
generated from the Kubernetes source code. If you want to change the reference documentation,
the first step is to change one or more comments in the Kubernetes source code. Make the
change in your local kubernetes/kubernetes repository, and then submit a pull request to
the master branch of
[github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
-->

Kubernetes 组件和工具的参考文档是基于 Kubernetes 源码自动生成的。如果想要修改参考文档，可以从修改 Kubernetes 源码中的一个或多个注释开始。在本地 kubernetes/kubernetes 仓库中进行修改，然后向 [github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 的 master 分支提交 PR。

<!--
[PR 56942](https://github.com/kubernetes/kubernetes/pull/56942)
is an example of a pull request that makes changes to comments in the Kubernetes
source code.
-->

[PR 56942](https://github.com/kubernetes/kubernetes/pull/56942) 是一个对 Kubernetes 源码中的注释进行修改的 PR 示例。

<!--
Monitor your pull request, and respond to reviewer comments. Continue to monitor
your pull request until it is merged into the master branch of the
`kubernetes/kubernetes` repository.
-->

跟踪你的 PR，并回应评审人的评论。继续跟踪你的 PR，直到它合入到 `kubernetes/kubernetes` 仓库的 master 分支中。

<!--
## Cherry picking your change into a release branch
-->

## 以 cherry-pick 方式将你的修改合入已发布分支

<!--
Your change is now in the master branch, which is used for development of the next
Kubernetes release. If you want your change to appear in the docs for a Kubernetes
version that has already been released, you need to propose that your change be cherry
picked into the release branch.
-->

你的修改已合入 master 分支中，该分支用于开发下一个 Kubernetes 版本。如果你希望修改部分出现在已发布的 Kubernetes 版本文档中，则需要提议将它们以 cherry-pick 方式合入已发布分支。

<!--
For example, suppose the master branch is being used to develop Kubernetes 1.10, and
you want to backport your change to the release-1.9 branch. For instructions on how
to do this, see
[Propose a Cherry Pick](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md).
-->

例如，假设 master 分支正用于开发 Kubernetes 1.10 版本，而你希望将修改合入到已发布的 1.9 版本分支。相关的操作指南，请参见 [提议一个 cherry-pick 合入](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md)。

<!--
Monitor your cherry-pick pull request until it is merged into the release branch.
-->

跟踪你的 cherry-pick PR，直到它合入到已发布分支中。

{{< note >}}
<!--
Proposing a cherry pick requires that you have permission to set a label
and a milestone in your pull request. If you don’t have those permissions, you will
need to work with someone who can set the label and milestone for you.
-->

提议一个 cherry-pick 合入，需要你有在 PR 中设置标签和里程碑的权限。如果你没有，你需要与有权限为你设置标签和里程碑的人合作完成。
{{< /note >}}

<!--
## Overview of update-imported-docs
-->

## update-imported-docs 概述

<!--
The `update-imported-docs` tool is located in the `kubernetes/website/update-imported-docs/`
directory. The tool performs the following steps:
-->

`update-imported-docs` 工具在 `kubernetes/website/update-imported-docs/` 目录下。它执行以下步骤：

<!--
1. Clones the related repositories specified in a configuration file. For the
   purpose of generating reference docs, the repositories that are cloned by
   default are `kubernetes-incubator/reference-docs` and `kubernetes/federation`.
1. Runs commands under the cloned repositories to prepare the docs generator and
   then generates the Markdown files.
1. Copies the generated Markdown files to a local clone of the `kubernetes/website`
   repository under locations specified in the configuration file.
-->

1. 克隆配置文件中指定的相关仓库。为了生成参考文档，默认情况下克隆的仓库是 `kubernetes-incubator/reference-docs` 和 `kubernetes/federation`。
1. 在克隆出的仓库下运行命令来准备文档生成器，然后生成 Markdown 文件。
1. 将生成的 Markdown 文件复制到配置文件中指定的 `kubernetes/website` 仓库的本地目录中。

<!--
When the Markdown files are in your local clone of the `kubernetes/website`
repository, you can submit them in a
[pull request](/docs/home/contribute/create-pull-request/)
to `kubernetes/website`.
-->

当 Markdown 文件放入 `kubernetes/website` 仓库的本地目录中后，你就可以创建 [PR](/docs/home/contribute/create-pull-request/) 将它们提交到 `kubernetes/website`。

<!--
## Customizing the reference.yml config file
-->

## 自定义 reference.yml 配置文件

<!--
Open `<web-base>/update-imported-docs/reference.yml` for editing.
Do not change the content for the `generate-command` entry unless you understand
what it is doing and need to change the specified release branch.
-->

打开 `<web-base>/update-imported-docs/reference.yml` 进行编辑。不要修改 `generate-command` 条目的内容，除非你了解它的作用，并且需要修改指定的已发布分支。

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-sigs/reference-docs.git
  # This and the generate-command below needs a change when reference-docs has
  # branches properly defined
  branch: master
  generate-command: |
    cd $GOPATH
    git clone https://github.com/kubernetes/kubernetes.git src/k8s.io/kubernetes
    cd src/k8s.io/kubernetes
    git checkout release-1.17
    make generated_files
    cp -L -R vendor $GOPATH/src
    rm -r vendor
    cd $GOPATH
    go get -v github.com/kubernetes-sigs/reference-docs/gen-compdocs
    cd src/github.com/kubernetes-sigs/reference-docs/
    make comp
```

<!--
In reference.yml, the `files` field is a list of `src` and `dst` fields. The `src` field
specifies the location of a generated Markdown file, and the `dst` field specifies
where to copy this file in the cloned `kubernetes/website` repository.
For example:
-->

在 reference.yml 中，`files` 字段是 `src` 和 `dst` 字段的列表。`src` 字段指定生成的 Markdown 文件的位置，而 `dst` 字段指定将此文件复制到 `kubernetes/website` 仓库的本地目录的哪个位置。例如：

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-incubator/reference-docs.git
  files:
  - src: gen-compdocs/build/kube-apiserver.md
    dst: content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
  ...
```

<!--
Note that when there are many files to be copied from the same source directory
to the same destination directory, you can use wildcards in the value given to
`src` and you can just provide the directory name as the value for `dst`.
For example:
-->

注意，当有许多文件要从同一个源目录复制到同一个目标目录时，可以使用通配符给 `src` 赋值，而使用目录名给 `dst` 赋值。例如：

```shell
  files:
  - src: gen-compdocs/build/kubeadm*.md
    dst: content/en/docs/reference/setup-tools/kubeadm/generated/
```

<!--
## Running the update-imported-docs tool
-->

## 运行 update-imported-docs 工具

<!--
After having reviewed and/or customized the `reference.yaml` file, you can run
the `update-imported-docs` tool:
-->

在检查与或自定义 `reference.yaml` 文件后，运行 `update-imported-docs` 工具：

```shell
cd <web-base>/update-imported-docs
./update-imported-docs reference.yml
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
...

    modified:   content/en/docs/reference/command-line-tools-reference/cloud-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/federation-apiserver.md
    modified:   content/en/docs/reference/command-line-tools-reference/federation-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-proxy.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-scheduler.md
...
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
[published documentation](/docs/home/).
-->

在 PR 合入的几分钟后，你更新的参考主题将出现在[已发布文档](/docs/home/)中。



## {{% heading "whatsnext" %}}


<!--
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/) 
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)
-->

* [为 kubectl 命令集生成参考文档](/docs/home/contribute/generated-reference/kubectl/) 
* [为 Kubernetes API 生成参考文档](/docs/home/contribute/generated-reference/kubernetes-api/)
* [为 Kubernetes 联邦 API 生成参考文档](/docs/home/contribute/generated-reference/federation-api/)

