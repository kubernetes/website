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
This page shows how to update the automatically generated reference docs for the
Kubernetes API.
-->

本页面展示了如何为 Kubernetes API 更新自动生成的参考文档。

{{% /capture %}}


{{% capture prerequisites %}}

<!--
You need to have these tools installed:
-->

你需要安装以下软件：

<!--
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Golang](https://golang.org/doc/install) version 1.9.1 or later
* [Docker](https://docs.docker.com/engine/installation/)
* [etcd](https://github.com/coreos/etcd/)
-->

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* 1.9 或更高版本的 [Golang](https://golang.org/doc/install)
* [Docker](https://docs.docker.com/engine/installation/)
* [etcd](https://github.com/coreos/etcd/)

<!--
Your $GOPATH environment variable must be set, and the location of `etcd`
must be in your $PATH environment variable.
-->

在环境变量中设置 $GOPATH，并且 etcd 的路径必须配置在 $PATH 环境变量中。

<!--
You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/) and
[GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).
-->

你需要知道如何在一个 GitHub 项目仓库中创建一个 PR。一般来说，这涉及到创建仓库的一个分支。想了解更多信息，请参见[创建一个文档 PR](/docs/home/contribute/create-pull-request/) 和 [GitHub 标准 Fork&PR 工作流](https://gist.github.com/Chaser324/ce0505fbed06b947d962)。

{{% /capture %}}


{{% capture steps %}}

<!--
## The big picture
-->

## 概述

<!--
Updating the Kubernetes API reference documentation is a two-stage process:
-->

更新 Kubernetes API 参考文档有两个步骤：

<!--
1. Generate an OpenAPI spec from the Kubernetes source code. The tools for
this stage are at [kubernetes/kubernetes/hack](https://github.com/kubernetes/kubernetes/tree/master/hack).
-->

1. 从 kubernetes 源码生成 OpenAPI 规范。本步骤的工具在 [kubernetes/kubernetes/hack](https://github.com/kubernetes/kubernetes/tree/master/hack)。

<!--
1. Generate an HTML file from the OpenAPI spec. The tools for this stage are at
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).
-->

1. 从 OpenAPI 规范生成 HTML 文件。本步骤的工具在 [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs)。

<!--
## Getting three repositories
-->

## 下载三个仓库

<!--
If you don't already have the kubernetes/kubernetes repository, get it now:
-->

If you don't already have the kubernetes/kubernetes repository, get it now:

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

如果你还没有下载过 `kubernetes/website` 仓库，现在下载：

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
## Editing the Kubernetes source code
-->

## 编辑 Kubernetes 源码

<!--
The Kubernetes API reference documentation is automatically generated from
an OpenAPI spec, which is generated from the Kubernetes source code. If you
want to change the reference documentation, the first step is to change one
or more comments in the Kubernetes source code.
-->

Kubernetes API 参考文档是基于 OpenAPI 规范自动生成的，而该规范是从 Kubernetes 源码生成的。如果想要修改参考文档，可以从修改 Kubernetes 源码中的一个或多个注释开始。

<!--
### Making changes to comments in the source code
-->

### 修改源码中的注释

{{< note >}}
<!--
The following steps are an example, not a general procedure. Details 
will be different in your situation.
-->

以下步骤是一个示例，而不是通用步骤。在你操作过程中，细节会有所不同。
{{< /note >}}

<!--
Here's an example of editing a comment in the Kubernetes source code.
-->

下面是在 Kubernetes 源码中编辑注释的示例。

<!--
In your local kubernetes/kubernetes repository, check out the master branch,
and make sure it is up to date:
-->

进入 kubernetes/kubernetes 仓库的本地目录，检出 master 分支，并确保它是最新的：

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

<!--
Suppose this source file in the master branch has the typo "atmost":
-->

假设 master 分支中的这个源文件有一个拼写错误 "atmost"：

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

<!--
In your local environment, open `types.go`, and change "atmost" to "at most".
-->

在本地环境中，打开 `types.go` 文件，然后将 "atmost" 修改为 "at most"。

<!--
Verify that you have changed the file:
-->

确认文件已修改：

```shell
git status
```

<!--
The output shows that you are on the master branch, and that the `types.go`
source file has been modified:
-->

输出展示了在 master 分支上，`types.go` 文件已被修改：

```shell
On branch master
...
    modified:   staging/src/k8s.io/api/apps/v1/types.go
```

<!--
### Committing your edited file
-->

### 提交已编辑的文件

<!--
Run `git add` and `git commit` to commit the changes you have made so far. In the next step,
you will do a second commit. It is important to keep your changes separated into two commits.
-->

运行 `git add` 和 `git commit` 提交到目前为止所做的修改。在下一步中，你将进行第二次提交。将修改拆分为两个提交是很重要的。

<!--
### Generating the OpenAPI spec and related files
-->

### 生成 OpenAPI 规范和相关文件

<!--
Go to `<k8s-base>` and run these scripts:
-->

进入 `<k8s-base>` 目录运行以下脚本：

```shell
hack/update-generated-swagger-docs.sh
hack/update-swagger-spec.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
hack/update-api-reference-docs.sh
```

<!--
Run `git status` to see what was generated.
-->

运行 `git status` 查看生成的文件。

```shell
On branch master
...
    modified:   api/openapi-spec/swagger.json
    modified:   api/swagger-spec/apps_v1.json
    modified:   docs/api-reference/apps/v1/definitions.html
    modified:   staging/src/k8s.io/api/apps/v1/generated.proto
    modified:   staging/src/k8s.io/api/apps/v1/types.go
    modified:   staging/src/k8s.io/api/apps/v1/types_swagger_doc_generated.go
```

<!--
View the contents of `api/openapi-spec/swagger.json` to make sure the typo is fixed.
For example, you could run `git diff -a api/openapi-spec/swagger.json`.
This is important, because `swagger.json` will be the input to the second stage of
the doc generation process.
-->

检查 `api/openapi-spec/swagger.json` 的内容确认拼写错误是否被修复。例如，你可以运行 `git diff -a api/openapi-spec/swagger.json`。这个步骤很重要，因为 `swagger.json` 是文档生成过程的第二个步骤的输入。

<!--
Run `git add` and `git commit` to commit your changes. Now you have two commits:
one that has the edited `types.go` file, and one that has the generated OpenAPI spec
and related files. Keep these two commits separate. That is, do not squash your commits.
-->

运行 `git add` 和 `git commit` 提交修改。现在你有两个提交：一个是已编辑的 `types.go` 文件，另一个是已生成的 OpenAPI 规范和相关文件。把这两个提交分开。也就是说，不要将它们合并提交。

<!--
Submit your changes as a
[pull request](https://help.github.com/articles/creating-a-pull-request/) to the
master branch of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.
-->

将你的修改以 [pull request](https://help.github.com/articles/creating-a-pull-request/) 提交到 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 仓库的 master 分支。跟踪你的 PR，并根据需要回应评审人的评论。继续跟踪你的 PR，直到它被合入。

<!--
[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758)
is an example of a pull request that fixes a typo in the Kubernetes source code.
-->

[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758) 是一个对 Kubernetes 源码中的拼写错误进行修复的 PR 示例。

{{< note >}}
<!--
It can be tricky to determine the correct source file to be changed. In the
preceding example, the authoritative source file is under the `staging` directory
in the `kubernetes/kubernetes` repository. But in your situation,the `staging` directory
might not be the place to find the authoritative source. For guidance, check the
`README` files in
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging)
repository and in related repositories like
[kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
-->

定位要修改的具体源文件可能很困难。在前面的示例中，正确的源文件位于 `kubernetes/kubernetes` 仓库的 `staging` 目录下。但在你的情况下，`staging` 目录可能不是查找正确源的位置。有关指导，请查看 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging) 仓库的 `README` 文件和相关仓库 [kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md)。
{{< /note >}}

<!--
### Cherry picking your commit into a release branch
-->

### 以 cherry-pick 方式将你的提交合入已发布分支

<!--
In the preceding section, you edited a file in the master branch and then ran scripts
to generate an OpenAPI spec and related files. Then you submitted your changes in a pull request
to the master branch of the kubernetes/kubernetes repository. Now suppose you want to backport
your change into a release branch. For example, suppose the master branch is being used to develop
Kubernetes version 1.10, and you want to backport your change into the release-1.9 branch.
-->

在上文中，你在 master 分支中编辑了一个文件，然后运行脚本来生成 OpenAPI 规范和相关文件。然后你在一个 PR 中向 kubernetes/kubernetes 仓库的 master 分支提交了修改。现在假设你想要将你的修改合入到一个发布分支中。例如，假设 master 分支用于开发 Kubernetes 1.10 版本，而你希望将你的修改合入到 release-1.9 分支中。

<!--
Recall that your pull request has two commits: one for editing `types.go`
and one for the files generated by scripts. The next step is to propose a cherry pick of your first 
commit into the release-1.9 branch. The idea is to cherry pick the commit that edited `types.go`, but not
the commit that has the results of running the scripts. For instructions, see
[Propose a Cherry Pick](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md). 
-->

回想一下 PR 中有两个提交：一个用于编辑 `types.go`，另一个用于脚本生成的文件。下一步是对你在 release-1.9 分支的第一次提交提议一个 cherry-pick 合入。其目的是挑出对 `types.go` 的编辑的那次提交，而不是对运行脚本结果的提交。有关说明，请参见[提议一个 cherry-pick 合入](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md)。

{{< note >}}
<!--
Proposing a cherry pick requires that you have permission to set a label and a milestone in your
pull request. If you don't have those permissions, you will need to work with someone who can set the label
and milestone for you.
-->

提议一个 cherry-pick 合入，需要你有在 PR 中设置标签和里程碑的权限。如果你没有，你需要与有权限为你设置标签和里程碑的人合作完成。
{{< /note >}}

<!--
When you have a pull request in place for cherry picking your one commit into the release-1.9 branch,
the next step is to run these scripts in the release-1.9 branch of your local environment.
-->

当你有一个对 release-1.9 分支进行 cherry-pick 合入的 PR 时，下一步是在 release-1.9 分支的本地环境中运行这些脚本。

```shell
hack/update-generated-swagger-docs.sh
hack/update-swagger-spec.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
hack/update-api-reference-docs.sh
```

<!--
Now add a commit to your cherry-pick pull request that has the recently generated OpenAPI spec
and related files. Monitor your pull request until it gets merged into the release-1.9 branch.
-->

现在向 cherry pick 的 PR 添加一个提交，该 PR 包含最近生成的 OpenAPI 规范和相关文件。跟踪你的 PR，直到它合入到 release-1.9 分支中。

<!--
At this point, both the master branch and the release-1.9 branch have your updated `types.go`
file and a set of generated files that reflect the change you made to `types.go`. Note that the
generated OpenAPI spec and other generated files in the release-1.9 branch are not necessarily
the same as the generated files in the master branch. The generated files in the release-1.9 branch
contain API elements only from Kubernetes 1.9. The generated files in the master branch might contain
API elements that are not in 1.9, but are under development for 1.10.
-->

此时，master 和 release-1.9 分支都更新了 `types.go` 文件和一组生成的文件，这些反映了你对 `types.go` 做的修改。注意，在 release-1.9 分支中生成的 OpenAPI 规范和其他文件不一定与在 master 分支中生成的文件相同。在 release-1.9 分支中生成的文件只包含 Kubernetes 1.9 版本的 API 元素。master 分支中生成的文件可能包含正在 1.10 版本中开发的 API 元素，而这些元素却不在 1.9 版本中。

<!--
## Generating the published reference docs
-->

## 生成已发布的参考文档

<!--
The preceding section showed how to edit a source file and then generate
several files, including `api/openapi-spec/swagger.json` in the 
`kubernetes/kubernetes` repository.
-->

前一章节展示了如何编辑源文件，然后生成几个文件，包括 `kubernetes/kubernetes` 仓库中的 `api/openapi-spec/swagger.json`。

<!--
This section shows how to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/),
which is generated by the tools at
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).
Those tools take the `api/openapi-spec/swagger.json` file as input.
-->

本章节介绍如何生成[已发布的 Kubernetes API 参考文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)，该文档由 [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) 中的工具生成。这些工具以 `api/openapi-spec/swagger.json` 文件作为输入。

<!--
### Editing Makefile in kubernetes-incubator/reference-docs
-->

### 在 kubernetes-incubator/reference-docs 仓库中编辑 Makefile 文件

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
### Copying the OpenAPI spec
-->

### 复制 OpenAPI 规范

<!--
The doc generation code needs a local copy of the OpenAPI spec for the Kubernetes API.
Go to `<k8s-base>` and check out the branch that has the OpenAPI spec you want to use.
For example, if you want to generate docs for Kubernetes 1.9, checkout the release-1.9
branch.
-->

文档生成代码需要 Kubernetes API 的 OpenAPI 规范的本地副本。进入 `<k8s-base>` 目录，检出有你想要使用的 OpenAPI 规范的分支。例如，如果要为 Kubernetes 1.9 版本生成文档，请检出 release-1.9 分支。

<!--
Go back to `<rdocs-base>`. Enter the following command to copy the OpenAPI spec from the
`kubernetes/kubernetes` repository to a local directory:
-->

返回 `<rdocs-base>` 目录。输入以下命令将 OpenAPI 规范从 `kubernetes/kubernetes` 仓库复制到本地目录：

```shell
make updateapispec
```

<!--
The output shows that the file was copied:
-->

输出显示文件已被复制：

```shell
cp ~/src/github.com/kubernetes/kubernetes/api/openapi-spec/swagger.json gen-apidocs/generators/openapi-spec/swagger.json
```

<!--
### Building the brodocs image
-->

### 制作 brodocs 镜像

<!--
The doc generation code requires the
[pwittrock/brodocs](https://github.com/pwittrock/brodocs) Docker image.
-->

文档生成代码需要 [pwittrock/brodocs](https://github.com/pwittrock/brodocs) Docker 镜像。

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
### Running the doc generation code
-->

## 运行文档生成代码

<!--
Build and run the doc generation code. You might need to run the command as root:
-->

构建并运行文档生成代码。你可能需要以 root 用户运行命令：

```shell
cd <rdocs-base>
make api
```

<!--
### Locate the generated files
-->

### 找到生成的文件

<!--
These two files are the output of a successful build. Verify that they exist:
-->

这两个文件是成功构建的产物。验证它们是否存在：

* `<rdocs-base>/gen-apidocs/generators/build/index.html`
* `<rdocs-base>/gen-apidocs/generators/build/navData.js`

<!--
## Copying the generated docs to the kubernetes/website repository
-->

## 将生成的文档复制到 kubernetes/website 仓库

<!--
The preceding sections showed how to edit a Kubernetes source file,
generate an OpenAPI spec, and then generate reference documentation for publication.
-->

前面的章节展示了如何编辑 Kubernetes 源文件，生成 OpenAPI 规范，然后生成用于发布的参考文档。

<!--
This section show how to copy the generated docs to the
[kubernetes/website](https://github.com/kubernetes/website) repository. The files
in the `kubernetes/website` repository are published in the
[kubernetes.io](https://kubernetes.io) website. In particular, the generated
`index.html` file is published [here](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).
-->

本章节介绍如何将生成的文档复制到 [kubernetes/website](https://github.com/kubernetes/website) 仓库。`kubernetes/website` 仓库中的文件发布在 [kubernetes.io](https://kubernetes.io) 网站上。特别是，生成的 `index.html` 文件发布在[这里](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

<!--
Enter the following command to copy the generated files to
your local kubernetes/website repository:
-->

输入以下命令将生成的文件复制到 kubernetes/website 仓库的本地目录：

```shell
make copyapi
```

<!--
Go to the base of your local kubernetes/kubernetes repository, and 
see which files have been modified:
-->

进入 kubernetes/kubernetes 仓库的本地主目录，查看哪些文件已被修改：

```shell
cd <web-base>
git status
```

<!--
The output shows the modified files:
-->

输出显示修改后的文件：

```shell
On branch master
...
   modified:   docs/reference/generated/kubernetes-api/v1.9/index.html
```

<!--
In this example, only one file has been modified. Recall that you generated both
`index.html` and `navData.js`. But apparently the generated `navata.js` is not different
from the `navData.js` that was already in the kubernetes/website` repository.
-->

在本例中，只修改了一个文件。回想一下，你生成了 `index.html` 和 `navData.js`。但显然生成的 `navata.js` 与 kubernetes/website` 仓库中已有的 `navData.js` 没有什么不同。

<!--
In `<web-base>` run `git add` and `git commit` to commit the change.
-->

在 `<web base>` 目录下运行 `git add` 和 `git commit` 将提交修改。

<!--
Submit your changes as a
[pull request](/docs/home/contribute/create-pull-request/) to the
[kubernetes/website](https://github.com/kubernetes/website) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.
-->

将你的修改作为 [pull request](/docs/home/contribute/create-pull-request/) 提交到 [kubernetes/website](https://github.com/kubernetes/website) 仓库。跟踪你的 PR，并根据需要回应评审人的评论。继续跟踪你的 PR，直到它被合入。

<!--
A few minutes after your pull request is merged, your changes will be visible
in the [published reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).
-->

在 PR 合入的几分钟后，你的修改将出现在[已发布的参考文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

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



