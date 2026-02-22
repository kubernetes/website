---
title: 为上游 Kubernetes 代码库做出贡献
content_type: task
weight: 20
---
<!--
title: Contributing to the Upstream Kubernetes Code
content_type: task
weight: 20
-->

<!-- overview -->

<!--
This page shows how to contribute to the upstream kubernetes/kubernetes project
to fix bugs found in the Kubernetes API documentation or the `kube-*`
components such as `kube-apiserver`, `kube-controller-manager`, etc.
-->
此页面描述如何为上游 `kubernetes/kubernetes` 项目做出贡献，如修复 Kubernetes API
文档或 Kubernetes 组件（例如 `kubeadm`、`kube-apiserver`、`kube-controller-manager` 等）
中发现的错误。

<!--
If you instead want to regenerate the reference documentation for the Kubernetes
API or the `kube-*` components from the upstream code, see the following instructions:

- [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Generating Reference Documentation for the Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
-->
如果你仅想从上游代码重新生成 Kubernetes API 或 `kube-*` 组件的参考文档。请参考以下说明：

- [生成 Kubernetes API 的参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-api/)
- [生成 Kubernetes 组件和工具的参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)

## {{% heading "prerequisites" %}}

<!--
You need to have these tools installed:
  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Golang](https://go.dev/doc/install) version 1.13+
  - [Docker](https://docs.docker.com/engine/installation/)
  - [etcd](https://github.com/coreos/etcd/)
  - [make](https://www.gnu.org/software/make/)
  - [gcc compiler/linker](https://gcc.gnu.org/)
-->
- 你需要安装以下工具：

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Golang](https://go.dev/doc/install) 的 1.13 版本或更高
  - [Docker](https://docs.docker.com/engine/installation/)
  - [etcd](https://github.com/coreos/etcd/)
  - [make](https://www.gnu.org/software/make/)
  - [gcc compiler/linker](https://gcc.gnu.org/)

<!--
- Your $GOPATH environment variable must be set, and the location of `etcd`
  must be in your $PATH environment variable.
-->
- 你必须设置 `GOPATH` 环境变量，并且 `etcd` 的位置必须在 `PATH` 环境变量中。

<!--
- You need to know how to create a pull request to a GitHub repository.
  Typically, this involves creating a fork of the repository.
  For more information, see
  [Creating a Pull Request](https://help.github.com/articles/creating-a-pull-request/) and
  [GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).
-->
- 你需要知道如何创建对 GitHub 代码仓库的拉取请求（Pull Request）。
  通常，这涉及创建代码仓库的派生副本。
  要获取更多的信息请参考[创建 PR](https://help.github.com/articles/creating-a-pull-request/) 和
  [GitHub 标准派生和 PR 工作流程](https://gist.github.com/Chaser324/ce0505fbed06b947d962)。

<!-- steps -->

<!--
## The big picture

The reference documentation for the Kubernetes API and the `kube-*` components
such as `kube-apiserver`, `kube-controller-manager` are automatically generated
from the source code in the [upstream Kubernetes](https://github.com/kubernetes/kubernetes/).

When you see bugs in the generated documentation, you may want to consider
creating a patch to fix it in the upstream project.
-->
## 基本说明

Kubernetes API 和 `kube-*` 组件（例如 `kube-apiserver`、`kube-controller-manager`）的参考文档
是根据[上游 Kubernetes](https://github.com/kubernetes/kubernetes/) 中的源代码自动生成的。

当你在生成的文档中看到错误时，你可能需要考虑创建一个 PR 用来在上游项目中对其进行修复。

<!--
## Clone the Kubernetes repository

If you don't already have the kubernetes/kubernetes repository, get it now:
-->
## 克隆 Kubernetes 代码仓库

如果你还没有 kubernetes/kubernetes 代码仓库，请参照下列命令获取：

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

<!--
Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes/kubernetes`.
The remaining steps refer to your base directory as `<k8s-base>`.
-->
确定你的 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 代码仓库克隆的根目录。
例如，如果按照前面的步骤获取代码仓库，则你的根目录为 `$GOPATH/src/github.com/kubernetes/kubernetes`。
接下来其余步骤将你的根目录称为 `<k8s-base>`。

<!--
Determine the base directory of your clone of the
[kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`.
The remaining steps refer to your base directory as `<rdocs-base>`.
-->
确定你的 [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
代码仓库克隆的根目录。
例如，如果按照前面的步骤获取代码仓库，则你的根目录为
`$GOPATH/src/github.com/kubernetes-sigs/reference-docs`。
接下来其余步骤将你的根目录称为 `<rdocs-base>`。

<!--
## Edit the Kubernetes source code

The Kubernetes API reference documentation is automatically generated from
an OpenAPI spec, which is generated from the Kubernetes source code. If you
want to change the API reference documentation, the first step is to change one
or more comments in the Kubernetes source code.
-->
## 编辑 Kubernetes 源代码

Kubernetes API 参考文档是根据 OpenAPI 规范自动生成的，该规范是从 Kubernetes 源代码生成的。
如果要更改 API 参考文档，第一步是更改 Kubernetes 源代码中的一个或多个注释。

<!--
The documentation for the `kube-*` components is also generated from the upstream
source code. You must change the code related to the component
you want to fix in order to fix the generated documentation.
-->
`kube-*` 组件的文档也是从上游源代码生成的。你必须更改与要修复的组件相关的代码，才能修复生成的文档。

<!--
### Make changes to the upstream source code

The following steps are an example, not a general procedure. Details
will be different in your situation.
-->
### 更改上游 Kubernetes 源代码

{{< note >}}
以下步骤仅作为示例，不是通用步骤，具体情况因环境而异。
{{< /note >}}

<!--
Here's an example of editing a comment in the Kubernetes source code.

In your local kubernetes/kubernetes repository, check out the default branch,
and make sure it is up to date:
-->
以下在 Kubernetes 源代码中编辑注释的示例。

在你本地的 kubernetes/kubernetes 代码仓库中，检出默认分支，并确保它是最新的：

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

<!--
Suppose this source file in that default branch has the typo "atmost":
-->
假设默认分支中的下面源文件中包含拼写错误 "atmost"：

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

<!--
In your local environment, open `types.go`, and change "atmost" to "at most".

Verify that you have changed the file:
-->
在你的本地环境中，打开 `types.go` 文件，然后将 "atmost" 更改为 "at most"。

以下命令验证你已经更改了文件：

```shell
git status
```

<!--
The output shows that you are on the master branch, and that the `types.go`
source file has been modified:
-->
输出显示你在 master 分支上，`types.go` 源文件已被修改：

```shell
On branch master
...
    modified:   staging/src/k8s.io/api/apps/v1/types.go
```

<!--
### Commit your edited file

Run `git add` and `git commit` to commit the changes you have made so far. In the next step,
you will do a second commit. It is important to keep your changes separated into two commits.
-->
### 提交已编辑的文件

运行 `git add` 和 `git commit` 命令提交到目前为止所做的更改。
在下一步中，你将进行第二次提交，将更改分成两个提交很重要。

<!--
### Generate the OpenAPI spec and related files

Go to `<k8s-base>` and run these scripts:
-->
### 生成 OpenAPI 规范和相关文件

进入 `<k8s-base>` 目录并运行以下脚本：

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

<!-- Run `git status` to see what was generated.  -->
运行 `git status` 命令查看生成的文件。

```none
On branch master
...
    modified:   api/openapi-spec/swagger.json
    modified:   api/openapi-spec/v3/apis__apps__v1_openapi.json
    modified:   pkg/generated/openapi/zz_generated.openapi.go
    modified:   staging/src/k8s.io/api/apps/v1/generated.proto
    modified:   staging/src/k8s.io/api/apps/v1/types_swagger_doc_generated.go
```

<!--
View the contents of `api/openapi-spec/swagger.json` to make sure the typo is fixed.
For example, you could run `git diff -a api/openapi-spec/swagger.json`.
This is important, because `swagger.json` is the input to the second stage of
the doc generation process.
-->
查看 `api/openapi-spec/swagger.json` 的内容，以确保拼写错误已经被修正。
例如，你可以运行 `git diff -a api/openapi-spec/swagger.json` 命令。
这很重要，因为 `swagger.json` 是文档生成过程中第二阶段的输入。

<!--
Run `git add` and `git commit` to commit your changes. Now you have two commits:
one that contains the edited `types.go` file, and one that contains the generated OpenAPI spec
and related files. Keep these two commits separate. That is, do not squash your commits.
-->
运行 `git add` 和 `git commit` 命令来提交你的更改。现在你有两个提交（commits）：
一种包含编辑的 `types.go` 文件，另一种包含生成的 OpenAPI 规范和相关文件。
将这两个提交分开独立。也就是说，不要 squash 你的提交。

<!--
Submit your changes as a
[pull request](https://help.github.com/articles/creating-a-pull-request/) to the
master branch of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it is merged.
-->
将你的更改作为 [PR](https://help.github.com/articles/creating-a-pull-request/) 
提交到 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 代码仓库的 master 分支。
关注你的 PR，并根据需要回复 reviewer 的评论。继续关注你的 PR，直到 PR 被合并为止。

<!--
[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758)
is an example of a pull request that fixes a typo in the Kubernetes source code.
-->
[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758) 是修复 Kubernetes
源代码中的拼写错误的拉取请求的示例。

<!--
It can be tricky to determine the correct source file to be changed. In the
preceding example, the authoritative source file is in the `staging` directory
in the `kubernetes/kubernetes` repository. But in your situation,the `staging` directory
might not be the place to find the authoritative source. For guidance, check the
`README` files in
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging)
repository and in related repositories, such as
[kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
-->
{{< note >}}
确定要更改的正确源文件可能很棘手。在前面的示例中，官方的源文件位于 `kubernetes/kubernetes`
代码仓库的 `staging` 目录中。但是根据你的情况，`staging` 目录可能不是找到官方源文件的地方。
如果需要帮助，请阅读
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging)
代码仓库和相关代码仓库
（例如 [kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md)）
中的 `README` 文件。
{{< /note >}}

<!--
### Cherry pick your commit into a release branch

In the preceding section, you edited a file in the master branch and then ran scripts
to generate an OpenAPI spec and related files. Then you submitted your changes in a pull request
to the master branch of the kubernetes/kubernetes repository. Now suppose you want to backport
your change into a release branch. For example, suppose the master branch is being used to develop
Kubernetes version {{< skew latestVersion >}}, and you want to backport your change into the
release-{{< skew prevMinorVersion >}} branch.
-->
### 将你的提交 Cherrypick 到发布分支

在上一节中，你在 master 分支中编辑了一个文件，然后运行了脚本用来生成 OpenAPI 规范和相关文件。
然后用 PR 将你的更改提交到 kubernetes/kubernetes 代码仓库的 master 分支中。
现在，需要将你的更改反向移植到已经发布的分支。
例如，假设 master 分支被用来开发 Kubernetes {{< skew latestVersion >}} 版，
并且你想将更改反向移植到 release-{{< skew prevMinorVersion >}} 分支。

<!--
Recall that your pull request has two commits: one for editing `types.go`
and one for the files generated by scripts. The next step is to propose a cherry pick of your first
commit into the release-{{< skew prevMinorVersion >}} branch. The idea is to cherry pick the commit
that edited `types.go`, but not the commit that has the results of running the scripts. For instructions, see
[Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).
-->
回想一下，你的 PR 有两个提交：一个用于编辑 `types.go`，一个用于由脚本生成的文件。
下一步是将你的第一次提交 cherrypick 到 release-{{< skew prevMinorVersion >}} 分支。
这样做的原因是仅 cherrypick 编辑了 types.go 的提交，
而不是具有脚本运行结果的提交。
有关说明，请参见[提出 Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md)。

<!--
Proposing a cherry pick requires that you have permission to set a label and a milestone in your
pull request. If you don't have those permissions, you will need to work with someone who can set the label
and milestone for you.
-->
{{< note >}}
提出 Cherry Pick 要求你有权在 PR 中设置标签和里程碑。如果你没有这些权限，
则需要与可以为你设置标签和里程碑的人员合作。
{{< /note >}}

<!--
When you have a pull request in place for cherry picking your one commit into the
release-{{< skew prevMinorVersion >}} branch, the next step is to run these scripts in the
release-{{< skew prevMinorVersion >}} branch of your local environment.
-->
当你发起 PR 将你的一个提交 cherry pick 到 release-{{< skew prevMinorVersion >}} 分支中时，
下一步是在本地环境的 release-{{< skew prevMinorVersion >}} 分支中运行如下脚本。

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

<!--
Now add a commit to your cherry-pick pull request that has the recently generated OpenAPI spec
and related files. Monitor your pull request until it gets merged into the
release-{{< skew prevMinorVersion >}} branch.
-->
现在将提交添加到你的 Cherry-Pick PR 中，该 PR 中包含最新生成的 OpenAPI 规范和相关文件。
关注你的 PR，直到其合并到 release-{{< skew prevMinorVersion >}} 分支中为止。

<!--
At this point, both the master branch and the release-{{< skew prevMinorVersion >}} branch have your updated `types.go`
file and a set of generated files that reflect the change you made to `types.go`. Note that the
generated OpenAPI spec and other generated files in the release-{{< skew prevMinorVersion >}} branch are not necessarily
the same as the generated files in the master branch. The generated files in the release-{{< skew prevMinorVersion >}} branch
contain API elements only from Kubernetes {{< skew prevMinorVersion >}}. The generated files in the master branch might contain
API elements that are not in {{< skew prevMinorVersion >}}, but are under development for {{< skew latestVersion >}}.
-->
此时，master 分支和 release-{{< skew prevMinorVersion >}}
分支都具有更新的 `types.go` 文件和一组生成的文件，
这些文件反映了对 `types.go` 所做的更改。
请注意，生成的 OpenAPI 规范和其他 release-{{< skew prevMinorVersion >}}
分支中生成的文件不一定与 master 分支中生成的文件相同。
release-{{< skew prevMinorVersion >}} 分支中生成的文件仅包含来自
Kubernetes {{< skew prevMinorVersion >}} 的 API 元素。
master 分支中生成的文件可能包含不在 {{< skew prevMinorVersion >}}
中但正在为 {{< skew latestVersion >}} 开发的 API 元素。

<!--
## Generate the published reference docs

The preceding section showed how to edit a source file and then generate
several files, including `api/openapi-spec/swagger.json` in the 
`kubernetes/kubernetes` repository.
The `swagger.json` file is the OpenAPI definition file to use for generating
the API reference documentation.
-->
## 生成已发布的参考文档

上一节显示了如何编辑源文件然后生成多个文件，包括在 `kubernetes/kubernetes` 代码仓库中的
`api/openapi-spec/swagger.json`。`swagger.json` 文件是 OpenAPI 定义文件，可用于生成 API 参考文档。

<!--
You are now ready to follow the
[Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
guide to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).
-->
现在，你可以按照
[生成 Kubernetes API 的参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-api/)
指南来生成
[已发布的 Kubernetes API 参考文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

## {{% heading "whatsnext" %}}

<!--
* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
-->
* [生成 Kubernetes API 的参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-api/)
* [为 Kubernetes 组件和工具生成参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)
* [生成 kubectl 命令的参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubectl/)

