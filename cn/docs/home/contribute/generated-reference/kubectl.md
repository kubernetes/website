---
cn-approvers:
- jonyhy96
title: 为kubectl 命令生成参考文档
---

<!--
---
title: Generating Reference Documentation for kubectl Commands
--- 
-->

{% capture overview %}

<!-- This page shows how to automatically generate reference pages for the
commands provided by the `kubectl` tool. -->

本页面将展示如何自动为`kubectl 命令行工具`生成相关参考文档。


<!-- **Note:**
This topic shows how to generate reference documentation for
[kubectl commands](/docs/reference/generated/kubectl/kubectl-commands)
like
[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply) and
[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
This topic does not show how to generate the
[kubectl](/docs/reference/generated/kubectl/kubectl/)
options reference page. For instructions on how to generate the kubectl options
reference page, see
[Generating Reference Pages for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/).
{: .note} -->

**Note:**
本文将介绍如何为
[kubectl commands](/docs/reference/generated/kubectl/kubectl-commands)
,
[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply) 和
[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint) 生成相关文档.
本文不包含为
[kubectl](/docs/reference/generated/kubectl/kubectl/)
相关选项生成相关文档. 可以在
[为 Kubernetes 组件和工具生成参考页面](/docs/home/contribute/generated-reference/kubernetes-components/)
查看为kubectl 相关选项生成相关文档的指令.
{: .note}

{% endcapture %}


{% capture prerequisites %}

<!-- * You need to have
[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
installed.

* You need to have
[Golang](https://golang.org/doc/install) version 1.9.1 or later installed,
and your `$GOPATH` environment variable must be set.

* You need to have
[Docker](https://docs.docker.com/engine/installation/) installed.

* You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/) and
[GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962). -->

* 你需要安装好[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

* 你需要安装1.9.1 或者更高版本的[Golang](https://golang.org/doc/install),同时你的环境变量中需要将`$GOPATH`设置正确

* 你需要知道如何去创建一个`PR`.例如,你首先需要将远程仓库`fork`到你的个人仓库.详见[创建一个文档相关的PR](/docs/home/contribute/create-pull-request/)和[GitHub 标准的Fork & PR工作流程](https://gist.github.com/Chaser324/ce0505fbed06b947d962). 

{% endcapture %}


{% capture steps %}

<!-- ## Getting three repositories

If you don't already have the kubernetes/kubernetes repository, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.

If you don't already have the kubernetes/website repository, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/website
```

Determine the base directory of your clone of the
[kubernetes/website](https://github.com/kubernetes/website) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes/website.`
The remaining steps refer to your base directory as `<web-base>`.

If you don't already have the kubernetes-incubator/reference-docs repository, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes-incubator/reference-docs
```

Determine the base directory of your clone of the
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes-incubator/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`.

In your local kubernetes/kubernetes repository, check out the branch of interest,
and make sure it is up to date. For example, if you want to generate docs for
Kubernetes 1.9, you could use these commands:

```shell
cd <k8s-base>
git checkout release-1.9
git pull https://github.com/kubernetes/kubernetes release-1.9
``` -->

## 拉取三个仓库

如果你本地还没有kubernetes/kubernetes 仓库,请先下载:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

确定你[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)项目的根目录.例如,如果你执行了上面的命令，你的根目录应该为`$GOPATH/src/github.com/kubernetes/kubernetes`下文将以`<k8s-base>`指代项目根目录.

如果你本地还没有kubernetes/website 仓库,请先下载:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/website
```

确定你[kubernetes/website](https://github.com/kubernetes/website)项目的根目录.例如,如果你执行了上面的命令，你的根目录应该为`$GOPATH/src/github.com/kubernetes/website`下文将以`<web-base>`指代项目根目录.

如果你本地还没有kubernetes-incubator/reference-docs 仓库,请先下载:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes-incubator/reference-docs
```

确定你[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs)项目的根目录.例如,如果你执行了上面的命令，你的根目录应该为`$GOPATH/src/github.com/kubernetes-incubator/reference-docs.`下文将以`<rdocs-base>`指代项目根目录.

在你本地的 kubernetes/kubernetes 仓库下, 切换到相关的分支,
并且确保该分支是最新状态. 例如, 如果你想为
Kubernetes 1.9生成文档, 你可以使用以下命令:

```shell
cd <k8s-base>
git checkout release-1.9
git pull https://github.com/kubernetes/kubernetes release-1.9
```

<!-- ## Editing the kubectl source code

The reference documentation for the kubectl commands is automatically generated from
kubectl source code. If you want to change the reference documentation, the first step
is to change one or more comments in the kubectl source code. Make the change in your
local kubernetes/kubernetes repository, and then submit a pull request to the master branch of
[github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files)
is an example of a pull request that fixes a typo in the kubectl source code.

Monitor your pull request, and respond to reviewer comments. Continue to monitor your
pull request until it is merged into the master branch of the kubernetes/kubernetes repository. -->

## 修改 kubectl 源码

kubectl命令的参考文档是根据kubectl 源码自动生成的. 如果你想修改相关文档,首先你要去修改kubectl 源码中的一行或多行注释. 在你本地的
kubernetes/kubernetes 仓库中做出修改, 然后在
[github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)的master分支提交一个PR.

[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files)
是一个修复输入错误的PR例子.

实时关注你的PR, 并且回复reviewer的评论. 持续关注你的PR直到它被合并到kubernetes/kubernetes仓库的master分支.

<!-- ## Cherry picking your change into a release branch

Your change is now in the master branch, which is used for development of the next
Kubernetes release. If you want your change to appear in the docs for a Kubernetes
version that has already been released, you need to propose that your change be
cherry picked into the release branch.

For example, suppose the master branch is being used to develop Kubernetes 1.10,
and you want to backport your change to the release-1.9 branch. For instructions
on how to do this, see
[Propose a Cherry Pick](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md).

Monitor your cherry-pick pull request until it is merged into the release branch.

**Note:**
Proposing a cherry pick requires that you have permission to set a label and a
milestone in your pull request. If you don’t have those permissions, you will
need to work with someone who can set the label and milestone for you.
{: .note} -->

## 将你的变更移植到指定发布分支

你的所做的变更现在是基于master分支，该分支的存在是为了开发Kubernetes下个版本. 如果你想将你的变更移植到已经发布的Kubernetes版本的文档中, 你需要指明你所做更改移植的目标分支.

例如，假设主分支被用来开发Kubernetes 1.10，你想把你的变更移植到已经发布的1.9分支. 可以参考
[做出一个移植](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md).

关注你做出移植后提交的的PR直到它被合并到目标分支.

**Note:**
做出一个移植操作需要你拥有向你所提交的PR内添加标签和里程碑的权限. 如果你没有该权限，你需要和具有相关权限的人合作让他帮你添加相关的标签和里程碑.
{: .note}

<!-- ## Editing Makefile

Go to `<rdocs-base>`, and open `Makefile` for editing:

Set `K8SROOT` to the base directory of your local kubernetes/kubernetes
repository. Set `WEBROOT` to the base directory of your local kubernetes/website repository.
Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
if you want to build docs for Kubernetes 1.9, set `MINOR_VERSION` to 9. Save and close `Makefile`. -->

## 修改Makefile

进入`<rdocs-base>`目录, 打开并编辑 `Makefile` :

设置`K8SROOT`变量指向你本地的 kubernetes/kubernetes 仓库根目录. 设置`WEBROOT` 变量指向你本地的 kubernetes/website 仓库根目录.
设置`MINOR_VERSION` 为你将创建的文档的次要版本.例如,
如果你想为Kubernetes 1.9创建文档, 你需要将 `MINOR_VERSION` 设置为 9. 保存修改并退出`Makefile`.

<!-- ## Building the brodocs image

The doc generation code requires the `pwittrock/brodocs` Docker image.

This command creates the `pwittrock/brodocs` Docker image. It also tries to push the image to
DockerHub, but it's OK if that step fails. As long as you have the image locally, the code generation
can succeed.


```shell
make brodocs
```

Verify that you have the brodocs image:

```shell
docker images
```

The output shows `pwittrock/brodocs` as one of the available images:

```shell
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
pwittrock/brodocs   latest              999d34a50d56        5 weeks ago         714MB
``` -->

## 创建 brodocs 镜像

控制文档自动生成的代码需要`pwittrock/brodocs`Docker 镜像.

以下命令生成`pwittrock/brodocs`Docker 镜像. 同时，将尝试将镜像推送到Dockerhub, 推送的过程失败无伤大雅. 只要你本地有该镜像, 控制文档自动生成的代码将会成功生成.


```shell
make brodocs
```

确认你本地有 brodocs 镜像:

```shell
docker images
```

输出显示 `pwittrock/brodocs` 为可用镜像:

```shell
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
pwittrock/brodocs   latest              999d34a50d56        5 weeks ago         714MB
```

<!-- ## Creating a version directory

In the `gen-kubectldocs/generators` directory, if you do not already
have a directory named `v1_MINOR_VERSION`, create one now by copying the directory
for the previous version. For example, suppose you want to generate docs for
Kubernetes 1.9, but you don't already have a `v1_9` directory. Then you could
create and populate a `v1_9` directory by running these commands:

```shell
mkdir gen-kubectldocs/generators/v1_9
cp -r gen-kubectldocs/generators/v1_8/* gen-kubectldocs/generators/v1_9
``` -->

## 创建一个版本文件

如果在你的`gen-kubectldocs/generators`文件下还没有`v1_MINOR_VERSION`文件, 将之前版本的类似文件拷贝一份. 例如, 假设你想为
Kubernetes 1.9生成文档, 但是`gen-kubectldocs/generators`文件下还没有`v1_9`文件.你可以通过以下命令创建并填充`v1_9`文件:

```shell
mkdir gen-kubectldocs/generators/v1_9
cp -r gen-kubectldocs/generators/v1_8/* gen-kubectldocs/generators/v1_9
```

<!-- ## Checking out a branch in kubernetes/kubernetes

In you local kubernetes/kubernetes repository, checkout the branch that has
the version of Kubernetes that you want to document. For example, if you want
to generate docs for Kubernetes 1.9, checkout the release-1.9 branch. Make sure
you local branch is up to date. -->

## 在kubernetes/kubernetes下切换分支

在你本地的 kubernetes/kubernetes 仓库内, 切换到你文档相关的Kubernetes分支. 例如,如果你想为Kubernetes 1.9生成文档, 你需要切换到 release-1.9 分支. 确保该分支是最新状态.

<!-- ## Running the doc generation code

In you local kubernetes-incubator/reference-docs repository, build and run the
doc generation code. You might need to run the command as root:

```shell
cd <rdocs-base>
make cli
``` -->

## 运行文档生成代码

在你本地的 kubernetes-incubator/reference-docs 仓库内, 构建并运行文档生成代码. 你可能需要root权限去运行以下命令:

```shell
cd <rdocs-base>
make cli
```

<!-- ## Locate the generated files

These two files are the primary output of a successful build. Verify that they exist:

* `<rdocs-base>/gen-kubectldocs/generators/build/index.html`
* `<rdocs-base>/gen-kubectldocs/generators/build/navData.js` -->

## 找到生成文档

这两个文件是成功构建的主要输出. 确认它们已经被生成:

* `<rdocs-base>/gen-kubectldocs/generators/build/index.html`
* `<rdocs-base>/gen-kubectldocs/generators/build/navData.js`

<!-- ## Copying files to the kubernetes/website repository

Copy the generated files from your local kubernetes-incubator/reference-docs
repository to your local kubernetes/website repository.

```shell
cd <rdocs-base>
make copycli
``` -->

## 拷贝文件到 kubernetes/website 仓库

从你本地的kubernetes-incubator/reference-docs
仓库中将生成文件拷贝到你本地的kubernetes/website仓库中.

```shell
cd <rdocs-base>
make copycli
```

<!-- ## Adding and committing changes in kubernetes/website

List the files that were generated and copied to the `kubernetes/website`
repository:

```
cd <web-base>
git status
```

The output shows the new and modified files. For example, the output
might look like this:

```shell
modified: docs/reference/generated/kubectl/kubectl-commands.html
modified: docs/reference/generated/kubectl/navData.js
```

Run `git add` and `git commit` to commit the files. -->

## 添加并提交变更到 kubernetes/website

列出被生成并拷贝到 `kubernetes/website`
仓库的文件:

```
cd <web-base>
git status
```

输出显示新添加和被修改的文件. 例如:

```shell
modified: docs/reference/generated/kubectl/kubectl-commands.html
modified: docs/reference/generated/kubectl/navData.js
```

运行 `git add` 和 `git commit` 提交修改的文件.

<!-- ## Creating a pull request

Create a pull request to the `kubernetes/website` repository. Monitor your
pull request, and respond to review comments as needed. Continue to monitor
your pull request until it is merged.

A few minutes after your pull request is merged, your updated reference
topics will be visible in the
[published documentation](/docs/home). -->

## 创建一个PR

在`kubernetes/website` 远程仓库创建一个PR. 关注你的PR, 并根据需要对评论作出回应. 持续关注你的PR直到它被合并.

你的PR被合并不久, 你更新的相关主题可以在
[已发布文档](/docs/home)访问.

{% endcapture %}

{% capture whatsnext %}

<!-- * [Generating Reference Documentation for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/) -->

* [为Kubernetes组件和工具生成参考文档](/docs/home/contribute/generated-reference/kubernetes-components/)
* [为Kubernetes API生成参考文档](/docs/home/contribute/generated-reference/kubernetes-api/)
* [为Kubernetes Federation API生成参考文档](/docs/home/contribute/generated-reference/federation-api/)

{% endcapture %}


{% include templates/task.md %}
