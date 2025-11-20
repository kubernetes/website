---
title: 爲上游 Kubernetes 代碼庫做出貢獻
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
此頁面描述如何爲上游 `kubernetes/kubernetes` 項目做出貢獻，如修復 Kubernetes API
文檔或 Kubernetes 組件（例如 `kubeadm`、`kube-apiserver`、`kube-controller-manager` 等）
中發現的錯誤。

<!--
If you instead want to regenerate the reference documentation for the Kubernetes
API or the `kube-*` components from the upstream code, see the following instructions:

- [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Generating Reference Documentation for the Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
-->
如果你僅想從上游代碼重新生成 Kubernetes API 或 `kube-*` 組件的參考文檔。請參考以下說明：

- [生成 Kubernetes API 的參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-api/)
- [生成 Kubernetes 組件和工具的參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)

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
- 你需要安裝以下工具：

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
- 你必須設置 `GOPATH` 環境變量，並且 `etcd` 的位置必須在 `PATH` 環境變量中。

<!--
- You need to know how to create a pull request to a GitHub repository.
  Typically, this involves creating a fork of the repository.
  For more information, see
  [Creating a Pull Request](https://help.github.com/articles/creating-a-pull-request/) and
  [GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).
-->
- 你需要知道如何創建對 GitHub 代碼倉庫的拉取請求（Pull Request）。
  通常，這涉及創建代碼倉庫的派生副本。
  要獲取更多的資訊請參考[創建 PR](https://help.github.com/articles/creating-a-pull-request/) 和
  [GitHub 標準派生和 PR 工作流程](https://gist.github.com/Chaser324/ce0505fbed06b947d962)。

<!-- steps -->

<!--
## The big picture

The reference documentation for the Kubernetes API and the `kube-*` components
such as `kube-apiserver`, `kube-controller-manager` are automatically generated
from the source code in the [upstream Kubernetes](https://github.com/kubernetes/kubernetes/).

When you see bugs in the generated documentation, you may want to consider
creating a patch to fix it in the upstream project.
-->
## 基本說明

Kubernetes API 和 `kube-*` 組件（例如 `kube-apiserver`、`kube-controller-manager`）的參考文檔
是根據[上游 Kubernetes](https://github.com/kubernetes/kubernetes/) 中的源代碼自動生成的。

當你在生成的文檔中看到錯誤時，你可能需要考慮創建一個 PR 用來在上游項目中對其進行修復。

<!--
## Clone the Kubernetes repository

If you don't already have the kubernetes/kubernetes repository, get it now:
-->
## 克隆 Kubernetes 代碼倉庫

如果你還沒有 kubernetes/kubernetes 代碼倉庫，請參照下列命令獲取：

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
確定你的 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 代碼倉庫克隆的根目錄。
例如，如果按照前面的步驟獲取代碼倉庫，則你的根目錄爲 `$GOPATH/src/github.com/kubernetes/kubernetes`。
接下來其餘步驟將你的根目錄稱爲 `<k8s-base>`。

<!--
Determine the base directory of your clone of the
[kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`.
The remaining steps refer to your base directory as `<rdocs-base>`.
-->
確定你的 [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
代碼倉庫克隆的根目錄。
例如，如果按照前面的步驟獲取代碼倉庫，則你的根目錄爲
`$GOPATH/src/github.com/kubernetes-sigs/reference-docs`。
接下來其餘步驟將你的根目錄稱爲 `<rdocs-base>`。

<!--
## Edit the Kubernetes source code

The Kubernetes API reference documentation is automatically generated from
an OpenAPI spec, which is generated from the Kubernetes source code. If you
want to change the API reference documentation, the first step is to change one
or more comments in the Kubernetes source code.
-->
## 編輯 Kubernetes 源代碼

Kubernetes API 參考文檔是根據 OpenAPI 規範自動生成的，該規範是從 Kubernetes 源代碼生成的。
如果要更改 API 參考文檔，第一步是更改 Kubernetes 源代碼中的一個或多個註釋。

<!--
The documentation for the `kube-*` components is also generated from the upstream
source code. You must change the code related to the component
you want to fix in order to fix the generated documentation.
-->
`kube-*` 組件的文檔也是從上游源代碼生成的。你必須更改與要修復的組件相關的代碼，才能修復生成的文檔。

<!--
### Make changes to the upstream source code

The following steps are an example, not a general procedure. Details
will be different in your situation.
-->
### 更改上游 Kubernetes 源代碼

{{< note >}}
以下步驟僅作爲示例，不是通用步驟，具體情況因環境而異。
{{< /note >}}

<!--
Here's an example of editing a comment in the Kubernetes source code.

In your local kubernetes/kubernetes repository, check out the default branch,
and make sure it is up to date:
-->
以下在 Kubernetes 源代碼中編輯註釋的示例。

在你本地的 kubernetes/kubernetes 代碼倉庫中，檢出預設分支，並確保它是最新的：

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

<!--
Suppose this source file in that default branch has the typo "atmost":
-->
假設預設分支中的下面源檔案中包含拼寫錯誤 "atmost"：

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

<!--
In your local environment, open `types.go`, and change "atmost" to "at most".

Verify that you have changed the file:
-->
在你的本地環境中，打開 `types.go` 檔案，然後將 "atmost" 更改爲 "at most"。

以下命令驗證你已經更改了檔案：

```shell
git status
```

<!--
The output shows that you are on the master branch, and that the `types.go`
source file has been modified:
-->
輸出顯示你在 master 分支上，`types.go` 源檔案已被修改：

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
### 提交已編輯的檔案

運行 `git add` 和 `git commit` 命令提交到目前爲止所做的更改。
在下一步中，你將進行第二次提交，將更改分成兩個提交很重要。

<!--
### Generate the OpenAPI spec and related files

Go to `<k8s-base>` and run these scripts:
-->
### 生成 OpenAPI 規範和相關檔案

進入 `<k8s-base>` 目錄並運行以下腳本：

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

<!-- Run `git status` to see what was generated.  -->
運行 `git status` 命令查看生成的檔案。

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
查看 `api/openapi-spec/swagger.json` 的內容，以確保拼寫錯誤已經被修正。
例如，你可以運行 `git diff -a api/openapi-spec/swagger.json` 命令。
這很重要，因爲 `swagger.json` 是文檔生成過程中第二階段的輸入。

<!--
Run `git add` and `git commit` to commit your changes. Now you have two commits:
one that contains the edited `types.go` file, and one that contains the generated OpenAPI spec
and related files. Keep these two commits separate. That is, do not squash your commits.
-->
運行 `git add` 和 `git commit` 命令來提交你的更改。現在你有兩個提交（commits）：
一種包含編輯的 `types.go` 檔案，另一種包含生成的 OpenAPI 規範和相關檔案。
將這兩個提交分開獨立。也就是說，不要 squash 你的提交。

<!--
Submit your changes as a
[pull request](https://help.github.com/articles/creating-a-pull-request/) to the
master branch of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it is merged.
-->
將你的更改作爲 [PR](https://help.github.com/articles/creating-a-pull-request/) 
提交到 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 代碼倉庫的 master 分支。
關注你的 PR，並根據需要回復 reviewer 的評論。繼續關注你的 PR，直到 PR 被合併爲止。

<!--
[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758)
is an example of a pull request that fixes a typo in the Kubernetes source code.
-->
[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758) 是修復 Kubernetes
源代碼中的拼寫錯誤的拉取請求的示例。

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
確定要更改的正確源檔案可能很棘手。在前面的示例中，官方的源檔案位於 `kubernetes/kubernetes`
代碼倉庫的 `staging` 目錄中。但是根據你的情況，`staging` 目錄可能不是找到官方源檔案的地方。
如果需要幫助，請閱讀
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging)
代碼倉庫和相關代碼倉庫
（例如 [kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md)）
中的 `README` 檔案。
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
### 將你的提交 Cherrypick 到發佈分支

在上一節中，你在 master 分支中編輯了一個檔案，然後運行了腳本用來生成 OpenAPI 規範和相關檔案。
然後用 PR 將你的更改提交到 kubernetes/kubernetes 代碼倉庫的 master 分支中。
現在，需要將你的更改反向移植到已經發布的分支。
例如，假設 master 分支被用來開發 Kubernetes {{< skew latestVersion >}} 版，
並且你想將更改反向移植到 release-{{< skew prevMinorVersion >}} 分支。

<!--
Recall that your pull request has two commits: one for editing `types.go`
and one for the files generated by scripts. The next step is to propose a cherry pick of your first
commit into the release-{{< skew prevMinorVersion >}} branch. The idea is to cherry pick the commit
that edited `types.go`, but not the commit that has the results of running the scripts. For instructions, see
[Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).
-->
回想一下，你的 PR 有兩個提交：一個用於編輯 `types.go`，一個用於由腳本生成的檔案。
下一步是將你的第一次提交 cherrypick 到 release-{{< skew prevMinorVersion >}} 分支。
這樣做的原因是僅 cherrypick 編輯了 types.go 的提交，
而不是具有腳本運行結果的提交。
有關說明，請參見[提出 Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md)。

<!--
Proposing a cherry pick requires that you have permission to set a label and a milestone in your
pull request. If you don't have those permissions, you will need to work with someone who can set the label
and milestone for you.
-->
{{< note >}}
提出 Cherry Pick 要求你有權在 PR 中設置標籤和里程碑。如果你沒有這些權限，
則需要與可以爲你設置標籤和里程碑的人員合作。
{{< /note >}}

<!--
When you have a pull request in place for cherry picking your one commit into the
release-{{< skew prevMinorVersion >}} branch, the next step is to run these scripts in the
release-{{< skew prevMinorVersion >}} branch of your local environment.
-->
當你發起 PR 將你的一個提交 cherry pick 到 release-{{< skew prevMinorVersion >}} 分支中時，
下一步是在本地環境的 release-{{< skew prevMinorVersion >}} 分支中運行如下腳本。

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

<!--
Now add a commit to your cherry-pick pull request that has the recently generated OpenAPI spec
and related files. Monitor your pull request until it gets merged into the
release-{{< skew prevMinorVersion >}} branch.
-->
現在將提交添加到你的 Cherry-Pick PR 中，該 PR 中包含最新生成的 OpenAPI 規範和相關檔案。
關注你的 PR，直到其合併到 release-{{< skew prevMinorVersion >}} 分支中爲止。

<!--
At this point, both the master branch and the release-{{< skew prevMinorVersion >}} branch have your updated `types.go`
file and a set of generated files that reflect the change you made to `types.go`. Note that the
generated OpenAPI spec and other generated files in the release-{{< skew prevMinorVersion >}} branch are not necessarily
the same as the generated files in the master branch. The generated files in the release-{{< skew prevMinorVersion >}} branch
contain API elements only from Kubernetes {{< skew prevMinorVersion >}}. The generated files in the master branch might contain
API elements that are not in {{< skew prevMinorVersion >}}, but are under development for {{< skew latestVersion >}}.
-->
此時，master 分支和 release-{{< skew prevMinorVersion >}}
分支都具有更新的 `types.go` 檔案和一組生成的檔案，
這些檔案反映了對 `types.go` 所做的更改。
請注意，生成的 OpenAPI 規範和其他 release-{{< skew prevMinorVersion >}}
分支中生成的檔案不一定與 master 分支中生成的檔案相同。
release-{{< skew prevMinorVersion >}} 分支中生成的檔案僅包含來自
Kubernetes {{< skew prevMinorVersion >}} 的 API 元素。
master 分支中生成的檔案可能包含不在 {{< skew prevMinorVersion >}}
中但正在爲 {{< skew latestVersion >}} 開發的 API 元素。

<!--
## Generate the published reference docs

The preceding section showed how to edit a source file and then generate
several files, including `api/openapi-spec/swagger.json` in the 
`kubernetes/kubernetes` repository.
The `swagger.json` file is the OpenAPI definition file to use for generating
the API reference documentation.
-->
## 生成已發佈的參考文檔

上一節顯示瞭如何編輯源檔案然後生成多個檔案，包括在 `kubernetes/kubernetes` 代碼倉庫中的
`api/openapi-spec/swagger.json`。`swagger.json` 檔案是 OpenAPI 定義檔案，可用於生成 API 參考文檔。

<!--
You are now ready to follow the
[Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
guide to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).
-->
現在，你可以按照
[生成 Kubernetes API 的參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-api/)
指南來生成
[已發佈的 Kubernetes API 參考文檔](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

## {{% heading "whatsnext" %}}

<!--
* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
-->
* [生成 Kubernetes API 的參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-api/)
* [爲 Kubernetes 組件和工具生成參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)
* [生成 kubectl 命令的參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubectl/)

