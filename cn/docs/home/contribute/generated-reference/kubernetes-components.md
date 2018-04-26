---
cn-approvers:
- niuhp
title: 为 Kubernetes 组件和工具生成参考页面
---
<!--
---
title: Generating Reference Pages for Kubernetes Components and Tools
---
-->

{% capture overview %}

<!--
This page shows how to use the `update-imported-docs` tool to generate
reference documentation for tools and components in the
[Kubernetes](https://github.com/kubernetes/kubernetes) and
[Federation](https://github.com/kubernetes/federation) repositories.
-->
这个页面展示了如何使用 `update-imported-docs` 工具为 [Kubernetes](https://github.com/kubernetes/kubernetes) 和 [Federation](https://github.com/kubernetes/federation) 仓库中的工具和组件生成参考文档。

{% endcapture %}


{% capture prerequisites %}

<!--
* You need a machine that is running Linux or MacOS.
-->
* 您需要一台运行 Linux 或 MacOS 的机器。

<!--
* You need to have this software installed:
-->
* 您需要安装以下软件：

    * [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

    * [Golang](https://golang.org/doc/install) <!-- version 1.9 or later --> 1.9 或更高版本

    * [make](https://www.gnu.org/software/make/)

    * [gcc compiler/linker](https://gcc.gnu.org/)

<!--
* Your `$GOPATH` environment variable must be set.
-->
* 您必须设置好 `$GOPATH` 环境变量。

<!--
* You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).
-->
* 您必须知道如何创建一个 pull request 到 GitHub 仓库。通常，这需要创建一个该仓库的分支。更多信息请查阅[创建一个文档 PR](/docs/home/contribute/create-pull-request/)。

{% endcapture %}


{% capture steps %}

<!--
## Getting two repositories
-->
## 获取两个仓库

<!--
If you don't already have the `kubernetes/website` repository, get it now:
-->
如果您还没有 `kubernetes/website` 仓库，现在就去做吧：

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
确定您克隆的 [kubernetes/website](https://github.com/kubernetes/website) 仓库的根目录。例如，如果您按照前面的步骤来获取这个仓库，
您的根目录是 `$GOPATH/src/github.com/kubernetes/website.` 剩下的步骤就是将 `<web-base>` 作为您的基本目录。

<!--
If you plan on making changes to the ref docs, and if you don't already have
the `kubernetes/kubernetes` repository, get it now:
-->
如果您计划对参考文档进行更改，并且您还没有获取 `kubernetes/kubernetes` 仓库， 现在就去做吧：:

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
确定您克隆的 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 仓库的根目录。例如，如果您按照前面的步骤来获取这个仓库，
您的根目录是 `$GOPATH/src/github.com/kubernetes/kubernetes.` 剩下的步骤就是将 `<k8s-base>` 作为您的基本目录。

<!--
**Note:**
If you only need to generate, but not change, the reference docs, you don't need to
manually get the `kubernetes/kubernetes` repository. When you run the `update-imported-docs`
tool, it automatically clones the the `kubernetes/kubernetes` repository.
{: .note}
-->
**注意：**
如果您仅需生成，并不更改参考文档，就不必手动获取 `kubernetes/kubernetes` 仓库了，当您运行 `update-imported-docs` 工具，它将自动克隆 `kubernetes/kubernetes` 仓库。
{: .note}

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
Kubernetes 组件和工具的参考文档是从 Kubernetes 源码自动生成，如果您想更改这些参考文档，第一步就是更改一处或多处 Kubernetes 源码的注释。
在您的本地 kubernetes/kubernetes 仓库做出更改，然后提交一个 PR 到 [github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 的主分支。

<!--
[PR 56942](https://github.com/kubernetes/kubernetes/pull/56942)
is an example of a pull request that makes changes to comments in the Kubernetes
source code.
-->
[PR 56942](https://github.com/kubernetes/kubernetes/pull/56942) 是一个对 Kubernetes 源码注释做出更改的 PR 示例。

<!--
Monitor your pull request, and respond to reviewer comments. Continue to monitor
your pull request until it is merged into the master branch of the
`kubernetes/kubernetes` repository.
-->
监控您的 PR 并对评审者的评论做出回应。继续监控您的 PR 直到它被合并到 `kubernetes/kubernetes` 仓库的主分支。

<!--
## Cherry picking your change into a release branch
-->
## Cherry-pick 您的更改到已发布分支

<!--
Your change is now in the master branch, which is used for development of the next
Kubernetes release. If you want your change to appear in the docs for a Kubernetes
version that has already been released, you need to propose that your change be cherry
picked into the release branch.
-->
现在您的更改已经在主分支中,它将用于下一个 Kubernetes 发布版本的开发。如果您想您的更改出现在已发布的 Kubernetes 版本中，您需要提出将您的更改挑选到到已发布分支中。

<!--
For example, suppose the master branch is being used to develop Kubernetes 1.10, and
you want to backport your change to the release-1.9 branch. For instructions on how
to do this, see
[Propose a Cherry Pick](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md).
-->
例如，假设当前的主分支是用来开发 Kubernetes 1.10 版本的，您想将您的更改补丁到已发布的 1.9 分支。了解如何做到这点，请查阅 [提出一个 Cherry Pick](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md).

<!--
Monitor your cherry-pick pull request until it is merged into the release branch.
-->
监控您的 cherry-pick PR 直到它被合并到主分支。

<!--
**Note:** Proposing a cherry pick requires that you have permission to set a label
and a milestone in your pull request. If you don’t have those permissions, you will
need to work with someone who can set the label and milestone for you.
{: .note}
-->
**注意：** 提出一个 cherry pick 要求您有设置标签的权限并在您的 PR 中有一个里程碑。
如果您没有这些权限，您必须和一个能为您设置标签和里程碑的人一起工作。{: .note}

<!--
## Overview of update-imported-docs
-->
## update-imported-docs 概述

<!--
The `update-imported-docs` tool performs these steps:
-->
`update-imported-docs` 工具执行以下步骤：

<!--
1. Clone the `kubernetes/kubernetes` repository.
1. Run several scripts under `kubernetes/kubernetes/hack`. These scripts
   generate Markdown files and place the files under `kubernetes/kubernetes/docs`.
1. Copy the generated Markdown files to a local clone of the `kubernetes/website`
   repository under `kubernetes/website/docs/reference/generated`.
1. Clone the `kubernetes/federation` repository.
1. Run several scripts under `kubernetes/federation/hack`. These scripts
   generate Markdown files and place the files under `kubernetes/federation/docs`.
1. Copy the generated Markdown files to a local clone of the `kubernetes/website`
   repository under `kubernetes/website/docs/reference/generated`.
-->   
1. 克隆 `kubernetes/kubernetes` 仓库。
1. 运行 `kubernetes/kubernetes/hack` 下的几个脚本。 这些脚本生成 Markdown 文件并替换 `kubernetes/kubernetes/docs` 下的文件。
1. 复制生成的 Markdown 文件到一个在 `kubernetes/website/docs/reference/generated` 下的 `kubernetes/website` 仓库的本地克隆。
1. 克隆 `kubernetes/federation` 仓库。
1. 运行 `kubernetes/federation/hack` 下的几个脚本。 这些脚本生成 Markdown 文件并替换 `kubernetes/federation/docs` 下的文件。
1. 复制生成的 Markdown 文件到一个在 `kubernetes/website/docs/reference/generated` 下的 `kubernetes/website` 仓库的本地克隆。

<!--
After the Markdown files are in your local clone of the `kubernetes/website`
repository, you can submit them in a
[pull request](https://kubernetes.io/docs/home/contribute/create-pull-request/)
to `kubernetes/website`.
-->
在这些 Markdown 文件都在您的 `kubernetes/website` 仓库的本地克隆之后，您可以在一个 
[PR](https://kubernetes.io/docs/home/contribute/create-pull-request/) 中提交他们到 `kubernetes/website`。

<!--
## Setting the branch
-->
## 设置分支

<!--
Open `<web-base>/update-imported-docs/config.yaml` for editing.
-->
打开 `<web-base>/update-imported-docs/config.yaml` 开始编辑。

<!--
Set the value of `branch` to the Kubernetes release that you want to document.
For example, if you want to generate docs for the Kubernetes 1.9 release,
set `branch` to `release-1.9`.
-->
在您想要更改的 Kubernetes 发布版本设置 `branch` 的值。例如，如果您想生成 Kubernetes 1.9 发布版本的文档，设置 `branch` 的值为 `release-1.9` 。

```shell
repos:
- name: kubernetes
  remote: https://github.com/kubernetes/kubernetes.git
  branch: release-1.9
```

<!--
## Setting sources and destinations
-->
## 设置源和目标

<!--
The `update-imported-docs` tool uses `src` and `dst` fields
in `config.yaml` to know which files to copy from the `kubernetes/kubernetes`
repository and where to place those files in the `kubernetes/website`
repository.
-->
`update-imported-docs` 工具使用 `config.yaml` 中的 `src` 和 `dst` 字段来表示从 `kubernetes/kubernetes` 仓库复制的文件和要替换 `kubernetes/website` 仓库中的文件。

<!--
For example, suppose you want the tool to copy the `kube-apiserver.md` file
from the `docs/admin` directory of the `kubernetes/kubernetes` repository
to the `docs/reference/generated/` directory of the `kubernetes/website`
repository. Then you would include a `src` and `dst` in your `config.yaml`
file like this:
-->
例如，假设你想使用这个工具复制 `kubernetes/kubernetes` 仓库中 `docs/admin` 目录下的 `kube-apiserver.md` 文件到 `kubernetes/website` 仓库中的 `docs/reference/generated/` 目录下，
您可以在 `config.yaml` 中设置 `src` 和 `dst` 字段如下所示：

```shell
repos:
- name: kubernetes
  remote: https://github.com/kubernetes/kubernetes.git
  branch: release-1.9
  files:
  - src: docs/admin/kube-apiserver.md
    dst: docs/reference/generated/kube-apiserver.md
  ...
```

<!--
The configuration is similar for files in the `kubernetes/federation`
repository. Here's an example that configures the tool to copy `kubefed_init.md`
from the `docs/admin` directory of the `kubernetes/federation` repository
to the `docs/reference/generated` directory of the `kubernetes/website` repository:
-->
这个配置和 `kubernetes/federation` 中文件的配置相似，下面是一个使用该工具复制 `kubernetes/federation` 仓库中 `docs/admin` 目录下 `kubefed_init.md` 文件到 `kubernetes/website` 仓库中 `docs/reference/generated` 目录下的配置示例：

```shell
- name: federation
  remote: https://github.com/kubernetes/federation.git
#  # Change this to a release branch when federation has release branches.
  branch: master
  files:
  - src: docs/admin/kubefed_init.md
    dst: docs/reference/generated/kubefed_init.md
  ...
```

<!--
Here's an example a `config.yaml` file that shows the sources and
destinations of all the Markdown files that were generated and copied
by the `update-imported-docs` tool at the beginning of the Kubernetes
1.9 release.
-->
下面是一个 `config.yaml` 文件的例子，它描述了在 Kubernetes 1.9 发布版本开始时使用 `update-imported-docs` 工具生成和复制的所有 Markdown 文件的源和目标。

```shell
repos:
- name: kubernetes
  remote: https://github.com/kubernetes/kubernetes.git
  branch: release-1.9
  files:
  - src: docs/admin/cloud-controller-manager.md
    dst: docs/reference/generated/cloud-controller-manager.md
  - src: docs/admin/kube-apiserver.md
    dst: docs/reference/generated/kube-apiserver.md
  - src: docs/admin/kube-controller-manager.md
    dst: docs/reference/generated/kube-controller-manager.md
  - src: docs/admin/kubelet.md
    dst: docs/reference/generated/kubelet.md
  - src: docs/admin/kube-proxy.md
    dst: docs/reference/generated/kube-proxy.md
  - src: docs/admin/kube-scheduler.md
    dst: docs/reference/generated/kube-scheduler.md
  - src: docs/user-guide/kubectl/kubectl.md
    dst: docs/reference/generated/kubectl/kubectl.md
- name: federation
  remote: https://github.com/kubernetes/federation.git
#  # Change this to a release branch when federation has release branches.
  branch: master
  files:
  - src: docs/admin/federation-apiserver.md
    dst: docs/reference/generated/federation-apiserver.md
  - src: docs/admin/federation-controller-manager.md
    dst: docs/reference/generated/federation-controller-manager.md
  - src: docs/admin/kubefed_init.md
    dst: docs/reference/generated/kubefed_init.md
  - src: docs/admin/kubefed_join.md
    dst: docs/reference/generated/kubefed_join.md
  - src: docs/admin/kubefed.md
    dst: docs/reference/generated/kubefed.md
  - src: docs/admin/kubefed_options.md
    dst: docs/reference/generated/kubefed_options.md
  - src: docs/admin/kubefed_unjoin.md
    dst: docs/reference/generated/kubefed_unjoin.md
  - src: docs/admin/kubefed_version.md
    dst: docs/reference/generated/kubefed_version.md
  ```

<!--
## Running the update-imported-docs tool
-->
## 运行 update-imported-docs 工具

<!--
Now that your `config.yaml` file contains your sources and destinations,
you can run the `update-imported-docs` tool:
-->
现在您的 `config.yaml` 文件包含了您的源和目标，您可以运行 `update-imported-docs` 工具：

```shell
cd <web-base>
go get ./update-imported-docs
go run update-imported-docs/update-imported-docs.go
```

<!--
## Adding and committing changes in kubernetes/website
-->
## 在  kubernetes/website 中添加并提交您的更改

<!--
List the files that were generated and copied to the `kubernetes/website`
repository:
-->
使用下面命令列出要生成和复制到 `kubernetes/website` 仓库中的文件：

```
cd <web-base>
git status
```

<!--
The output shows the new and modified files. For example, the output
might look like this:
-->
该命令输出新增加和修改的文件。例如，输出可能是这样：

```shell
...
    modified:   docs/reference/generated/cloud-controller-manager.md
    modified:   docs/reference/generated/federation-apiserver.md
    modified:   docs/reference/generated/federation-controller-manager.md
    modified:   docs/reference/generated/kube-apiserver.md
    modified:   docs/reference/generated/kube-controller-manager.md
    modified:   docs/reference/generated/kube-proxy.md
    modified:   docs/reference/generated/kube-scheduler.md
    modified:   docs/reference/generated/kubectl/kubectl.md
    modified:   docs/reference/generated/kubefed.md
    modified:   docs/reference/generated/kubefed_init.md
    modified:   docs/reference/generated/kubefed_join.md
    modified:   docs/reference/generated/kubefed_options.md
    modified:   docs/reference/generated/kubefed_unjoin.md
    modified:   docs/reference/generated/kubefed_version.md
    modified:   docs/reference/generated/kubelet.md
```

<!--
Run `git add` and `git commit` to commit the files.
-->
运行 `git add` 和 `git commit` 来提交这些文件。

<!--
## Creating a pull request
-->
## 创建 PR

<!--
Create a pull request to the `kubernetes/website` repository. Monitor your
pull request, and respond to review comments as needed. Continue to monitor
your pull request until it is merged.
-->
创建一个 PR 到 `kubernetes/website` 仓库。监控您的 PR 并对评审者的评论做出回应，继续监控您的 PR 直到它被合并。

<!--
A few minutes after your pull request is merged, your updated reference
topics will be visible in the
[published documentation](/docs/home/).
-->
待您的 PR 被合并几分钟后, 您的更新主题将在 [发布文档](/docs/home/) 中可见。

{% endcapture %}

{% capture whatsnext %}

<!--
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/) 
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)
-->
* [为 kubectl 命令生成参考文档](/docs/home/contribute/generated-reference/kubectl/) 
* [为 Kubernetes API 生成参考文档](/docs/home/contribute/generated-reference/kubernetes-api/)
* [为 Kubernetes Federation API 生成参考文档](/docs/home/contribute/generated-reference/federation-api/)

{% endcapture %}


{% include templates/task.md %}
