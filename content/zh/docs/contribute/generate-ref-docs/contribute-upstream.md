---
title: 为上游 Kubernetes 代码库做出贡献
content_template: templates/task
---
<!--
---
title: Contributing to the Upstream Kubernetes Code
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page shows how to contribute to the upstream kubernetes/kubernetes project
to fix bugs found in the Kubernetes API documentation or the `kube-*`
components such as `kube-apiserver`, `kube-controller-manager`, etc.
-->
此页面描述如何为上游 kubernetes/kubernetes 项目做出贡献，如修复 Kubernetes API 文档或 `kube-*` 组件（例如 kube-apiserver、kube-controller-manager 等）中发现的错误。

<!--
If you instead want to regenerate the reference documentation for the Kubernetes
API or the `kube-*` components from the upstream code, see the following instructions:
-->
相反，如果您想从上游代码重新生成 Kubernetes API 或 `kube-*` 组件的参考文档。请参考以下说明：

<!--
- [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Generating Reference Documentation for the Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
-->
- [生成 Kubernetes API 的参考文档](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [生成 Kubernetes 组件和工具的参考文档](/docs/contribute/generate-ref-docs/kubernetes-components/)

{{% /capture %}}


{{% capture prerequisites %}}

<!--
You need to have these tools installed:
-->
您需要安装以下工具：

<!--
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Golang](https://golang.org/doc/install) version 1.9.1 or later
* [Docker](https://docs.docker.com/engine/installation/)
* [etcd](https://github.com/coreos/etcd/)
-->
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Golang](https://golang.org/doc/install) Go 版本大于 1.9.1
* [Docker](https://docs.docker.com/engine/installation/)
* [etcd](https://github.com/coreos/etcd/)

<!--
Your $GOPATH environment variable must be set, and the location of `etcd`
must be in your $PATH environment variable.
-->
必须设置 $GOPATH 环境变量，并且 `etcd` 的位置必须在 $PATH 环境变量中。

<!--
You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Pull Request](https://help.github.com/articles/creating-a-pull-request/) and
[GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).
-->
您需要知道如何创建对 GitHub 代码仓库的拉取请求（Pull Request）。
通常，这涉及创建代码仓库的分支。要获取更多的信息请参考[创建 PR](https://help.github.com/articles/creating-a-pull-request/) 和
[GitHub 标准 Fork 和 PR 工作流程](https://gist.github.com/Chaser324/ce0505fbed06b947d962)。


{{% /capture %}}


{{% capture steps %}}

<!--
## The big picture
-->
## 基本原则

<!--
The reference documentation for the Kubernetes API and the `kube-*` components
such as `kube-apiserver`, `kube-controller-manager` are automatically generated
from the source code in the [upstream Kubernetes](https://github.com/kubernetes/kubernetes/).
-->
Kubernetes API 和 `kube-*` 组件（例如 `kube-apiserver`、`kube-controller-manager`）的参考文档是根据[上游 Kubernetes](https://github.com/kubernetes/kubernetes/) 中的源代码自动生成的。

<!--
When you see bugs in the generated documentation, you may want to consider
creating a patch to fix it in the upstream project.
-->
当您在生成的文档中看到错误时，您可能需要考虑创建一个 PR 用来在上游项目中对其进行修复。

<!--
## Cloning the Kubernetes repository
-->
## 克隆 Kubernetes 代码仓库

<!--
If you don't already have the kubernetes/kubernetes repository, get it now:
-->
如果您还没有 kubernetes/kubernetes 代码仓库，请立即参照下列命令获取：

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
确定您的 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 代码仓库克隆的基本目录。
例如，如果按照前面的步骤获取代码仓库，则您的基本目录为 `$GOPATH/src/github.com/kubernetes/kubernetes`。
接下来其余步骤将您的基本目录称为 `<k8s-base>`。
<!--
Determine the base directory of your clone of the
[kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes-sigs/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`.
-->
确定您的 [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) 代码仓库克隆的基本目录。
例如，如果按照前面的步骤获取代码仓库，则您的基本目录为 `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`。
接下来其余步骤将您的基本目录称为 `<rdocs-base>`。

<!--
## Editing the Kubernetes source code
-->
## 编辑 Kubernetes 源代码

<!--
The Kubernetes API reference documentation is automatically generated from
an OpenAPI spec, which is generated from the Kubernetes source code. If you
want to change the API reference documentation, the first step is to change one
or more comments in the Kubernetes source code.
-->
Kubernetes API 参考文档是根据 OpenAPI 规范自动生成的，该规范是从 Kubernetes 源代码生成的。如果要更改 API 参考文档，第一步是更改 Kubernetes 源代码中的一个或多个注释。

<!--
The documentation for the `kube-*` components is also generated from the upstream
source code. You must change the code related to the component
you want to fix in order to fix the generated documentation.
-->
`kube-*` 组件的文档也是从上游源代码生成的。您必须更改与要修复的组件相关的代码，才能修复生成的文档。

<!--
### Making changes to the upstream source code
-->
### 更改上游 Kubernetes 源代码

<!--
The following steps are an example, not a general procedure. Details 
will be different in your situation.
-->
{{< note >}}
以下步骤仅作为示例，不是一般步骤，具体情况因您而异。
{{< /note >}}

<!--
Here's an example of editing a comment in the Kubernetes source code.
-->
以下在 Kubernetes 源代码中编辑注释的示例。

<!--
In your local kubernetes/kubernetes repository, check out the master branch,
and make sure it is up to date:
-->
在您本地的 kubernetes/kubernetes 代码仓库中，切换出本地 master 分支，并确保它是最新的：

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

<!--
Suppose this source file in the master branch has the typo "atmost":
-->
假设 master 分支中的此源文件的拼写错误为 "atmost"：

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

<!--
In your local environment, open `types.go`, and change "atmost" to "at most".
-->
在您的本地环境中，打开 `types.go` 文件，然后将 "atmost" 更改为 "at most"。

<!--
Verify that you have changed the file:
-->
以下命令查看您已更改的文件：

```shell
git status
```

<!--
The output shows that you are on the master branch, and that the `types.go`
source file has been modified:
-->
输出显示您在 master 分支上，`types.go` 源文件已被修改：

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
运行 `git add` 和 `git commit` 命令提交到目前为止所做的更改。在下一步中，您将进行第二次提交，将更改分成两个提交很重要。

<!--
### Generating the OpenAPI spec and related files
-->
### 生成 OpenAPI 规范和相关文件

<!--
Go to `<k8s-base>` and run these scripts:
-->
进入 `<k8s-base>` 目录并运行以下脚本：

```shell
hack/update-generated-swagger-docs.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
hack/update-api-reference-docs.sh
```

<!--
Run `git status` to see what was generated.
-->
运行 `git status` 命令查看生成的东西。

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
This is important, because `swagger.json` is the input to the second stage of
the doc generation process.
-->
查看 `api/openapi-spec/swagger.json` 的内容，以确保 typo 已经被修正。例如，您可以运行 `git diff -a api/openapi-spec/swagger.json` 命令。这很重要，因为 `swagger.json` 是文档生成过程中第二阶段的输入。

<!--
Run `git add` and `git commit` to commit your changes. Now you have two commits:
one that contains the edited `types.go` file, and one that contains the generated OpenAPI spec
and related files. Keep these two commits separate. That is, do not squash your commits.
-->
运行 `git add` 和 `git commit` 命令来提交您的更改。现在您有两个提交：
一种包含编辑的 `types.go` 文件，另一种包含生成的 OpenAPI 规范和相关文件。
将这两个提交分开独立。也就是说，不要 squash 您的提交。

<!--
Submit your changes as a
[pull request](https://help.github.com/articles/creating-a-pull-request/) to the
master branch of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it is merged.
-->
将您的更改作为 [PR](https://help.github.com/articles/creating-a-pull-request/) 提交到 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 代码仓库的 master 分支。关注您的 PR，并根据需要回复 reviewer 的评论。继续关注您的 PR，直到 PR 被合并为止。

<!--
[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758)
is an example of a pull request that fixes a typo in the Kubernetes source code.
-->
[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758) 是修复 Kubernetes 源代码中的拼写错误的拉取请求的示例。

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
确定要更改的正确源文件可能很棘手。在前面的示例中，官方的源文件位于 `kubernetes/kubernetes` 代码仓库的 `staging` 目录中。但是根据您的情况，`staging` 目录可能不是找到官方源文件的地方。根据指导原则，请检查 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging) 代码仓库和相关代码仓库（例如 [kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md)）中的 `README` 文件。
{{< /note >}}

<!--
### Cherry picking your commit into a release branch
-->
### Cherry Pick 将您的提交纳入发布分支

<!--
In the preceding section, you edited a file in the master branch and then ran scripts
to generate an OpenAPI spec and related files. Then you submitted your changes in a pull request
to the master branch of the kubernetes/kubernetes repository. Now suppose you want to backport
your change into a release branch. For example, suppose the master branch is being used to develop
Kubernetes version 1.10, and you want to backport your change into the release-1.9 branch.
-->
在上一节中，您在 master 分支中编辑了一个文件，然后运行了脚本用来生成 OpenAPI 规范和相关文件。然后将您的更改提交到 kubernetes/kubernetes 代码仓库的 master 分支的 pull request 中。 现在，需要将您的更改反向移植到已经 release 的分支。例如，假设使用 master 分支来开发 Kubernetes 1.10 版，并且您想将更改反向移植到 release-1.9 分支。

<!--
Recall that your pull request has two commits: one for editing `types.go`
and one for the files generated by scripts. The next step is to propose a cherry pick of your first 
commit into the release-1.9 branch. The idea is to cherry pick the commit that edited `types.go`, but not
the commit that has the results of running the scripts. For instructions, see
[Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).
-->
回想一下，您的 pull request 有两个提交：一个用于编辑 `types.go`，一个用于由脚本生成的文件。下一步的目的是对您的第一次提交 cherry pick 到 release-1.9 分支。这个想法是 cherry pick 编辑了 types.go 的提交，但不是具有运行脚本结果的提交。有关说明，请参见[提出 Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md)。

<!--
Proposing a cherry pick requires that you have permission to set a label and a milestone in your
pull request. If you don't have those permissions, you will need to work with someone who can set the label
and milestone for you.
-->
{{< note >}}
提出 cherry pick 要求您有权在 pull request 中设置标签和里程碑。如果您没有这些权限，则需要与可以为您设置标签和里程碑的人员合作。
{{< /note >}}

<!--
When you have a pull request in place for cherry picking your one commit into the release-1.9 branch,
the next step is to run these scripts in the release-1.9 branch of your local environment.
-->
当您提出一个 pull request，希望将您的一个提交 cherry pick 到 release-1.9 分支中时，下一步是在本地环境的 release-1.9 分支中运行这些脚本。

```shell
hack/update-generated-swagger-docs.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
hack/update-api-reference-docs.sh
```

<!--
Now add a commit to your cherry-pick pull request that has the recently generated OpenAPI spec
and related files. Monitor your pull request until it gets merged into the release-1.9 branch.
-->
现在将提交添加到您的 Cherry-pick pull request 中，该请求具有最近生成的 OpenAPI 规范和相关文件。关注您的 pull request 请求，直到其合并到 release-1.9 分支中为止。

<!--
At this point, both the master branch and the release-1.9 branch have your updated `types.go`
file and a set of generated files that reflect the change you made to `types.go`. Note that the
generated OpenAPI spec and other generated files in the release-1.9 branch are not necessarily
the same as the generated files in the master branch. The generated files in the release-1.9 branch
contain API elements only from Kubernetes 1.9. The generated files in the master branch might contain
API elements that are not in 1.9, but are under development for 1.10.
-->
此时，master 分支和 release-1.9 分支都具有更新的 `types.go` 文件和一组生成的文件，这些文件反映了您对 `types.go` 所做的更改。请注意，生成的 OpenAPI 规范和其他 release-1.9 分支中生成的文件不一定与 master 分支中生成的文件相同。release-1.9 分支中生成的文件仅包含来自 Kubernetes 1.9 的 API 元素。master 分支中生成的文件可能包含不在 1.9 中但正在为 1.10 开发的 API 元素。


<!--
## Generating the published reference docs
-->
## 生成已发布的参考文档

<!--
The preceding section showed how to edit a source file and then generate
several files, including `api/openapi-spec/swagger.json` in the 
`kubernetes/kubernetes` repository.
The `swagger.json` file is the OpenAPI definition file to use for generating
the API reference documentation.
-->
上一节显示了如何编辑源文件然后生成多个文件，包括在 `kubernetes/kubernetes` 代码仓库中的 `api/openapi-spec/swagger.json`。
`swagger.json` 文件是 OpenAPI 定义文件，可用于生成 API 参考文档。

<!--
You are now ready to follow the [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/) guide to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).
-->
现在，您可以按照[生成 Kubernetes API 的参考文档](/docs/contribute/generate-ref-docs/kubernetes-api/)指南来生成
[已发布的 Kubernetes API 参考文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
-->
* [生成 Kubernetes API 的参考文档](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [为 Kubernetes 组件和工具生成参考文档](/docs/home/contribute/generated-reference/kubernetes-components/)
* [生成 kubectl 命令的参考文档](/docs/home/contribute/generated-reference/kubectl/)

{{% /capture %}}

