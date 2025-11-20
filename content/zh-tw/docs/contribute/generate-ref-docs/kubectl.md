---
title: 爲 kubectl 命令集生成參考文檔
content_type: task
weight: 90
---

<!--
title: Generating Reference Documentation for kubectl Commands
content_type: task
weight: 90
-->

<!-- overview -->

<!--
This page shows how to generate the `kubectl` command reference.
-->

本頁面描述瞭如何生成 `kubectl` 命令參考。

<!--
This topic shows how to generate reference documentation for
[kubectl commands](/docs/reference/generated/kubectl/kubectl-commands) like
[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply) and
[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
This topic does not show how to generate the
[kubectl](/docs/reference/generated/kubectl/kubectl/)
options reference page. For instructions on how to generate the kubectl options
reference page, see
[Generating Reference Pages for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/).
-->

{{< note >}}
本主題描述瞭如何爲 [kubectl 命令](/docs/reference/generated/kubectl/kubectl-commands)
生成參考文檔，如 [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply) 和
[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)。
本主題沒有討論如何生成 [kubectl](/docs/reference/generated/kubectl/kubectl-commands/) 組件選項的參考頁面。
相關說明請參見[爲 Kubernetes 組件和工具生成參考頁面](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

<!--
## Set up the local repositories

Create a local workspace and set your `GOPATH`:
-->
## 設定本地倉庫

創建本地工作區並設置你的 `GOPATH`：

```shell
mkdir -p $HOME/<workspace>
export GOPATH=$HOME/<workspace>
```

<!--
Get a local clone of the following repositories:
-->
獲取以下倉庫的本地克隆：

```shell
go get -u github.com/spf13/pflag
go get -u github.com/spf13/cobra
go get -u gopkg.in/yaml.v2
go get -u kubernetes-incubator/reference-docs
```

<!-- 
If you don't already have the kubernetes/website repository, get it now: 
-->
如果你還沒有獲取過 `kubernetes/website` 倉庫，現在獲取之：

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

<!--
Get a clone of the kubernetes/kubernetes repository as k8s.io/kubernetes:
-->
克隆 kubernetes/kubernetes 倉庫作爲 k8s.io/kubernetes：

```shell
git clone https://github.com/kubernetes/kubernetes $GOPATH/src/k8s.io/kubernetes
```

<!-- 
Remove the spf13 package from `$GOPATH/src/k8s.io/kubernetes/vendor/github.com`:
-->
從 `$GOPATH/src/k8s.io/kubernetes/vendor/github.com` 中移除 spf13 軟體包：

```shell
rm -rf $GOPATH/src/k8s.io/kubernetes/vendor/github.com/spf13
```

<!--
The kubernetes/kubernetes repository provides access to the kubectl and kustomize source code.
-->
kubernetes/kubernetes 倉庫提供對 kubectl 和 kustomize 源代碼的訪問。

<!-- 
* Determine the base directory of your clone of the
  [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
  For example, if you followed the preceding step to get the repository, your
  base directory is `$GOPATH/src/k8s.io/kubernetes.`
  The remaining steps refer to your base directory as `<k8s-base>`. 
-->
* 確定 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 倉庫的本地主目錄。
  例如，如果按照前面的步驟來獲取該倉庫，則主目錄是 `$GOPATH/src/k8s.io/kubernetes.`。
  下文將該目錄稱爲 `<k8s-base>`。

<!-- 
* Determine the base directory of your clone of the
  [kubernetes/website](https://github.com/kubernetes/website) repository.
  For example, if you followed the preceding step to get the repository, your
  base directory is `$GOPATH/src/github.com/<your-username>/website.`
  The remaining steps refer to your base directory as `<web-base>`.
-->
* 確定 [kubernetes/website](https://github.com/kubernetes/website) 倉庫的本地主目錄。
  例如，如果按照前面的步驟來獲取該倉庫，則主目錄是 `$GOPATH/src/github.com/<your-username>/website`。
  下文將該目錄稱爲 `<web-base>`。

<!-- 
* Determine the base directory of your clone of the
  [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) repository.
  For example, if you followed the preceding step to get the repository, your
  base directory is `$GOPATH/src/github.com/kubernetes-sigs/reference-docs.`
  The remaining steps refer to your base directory as `<rdocs-base>`.
-->
* 確定 [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
  倉庫的本地主目錄。例如，如果按照前面的步驟來獲取該倉庫，則主目錄是
  `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`。
  下文將該目錄稱爲 `<rdocs-base>`。

<!-- 
In your local k8s.io/kubernetes repository, check out the branch of interest,
and make sure it is up to date. For example, if you want to generate docs for
Kubernetes {{< skew prevMinorVersion >}}.0, you could use these commands: 
-->
在本地的 k8s.io/kubernetes 倉庫中，檢出感興趣的分支並確保它是最新的。例如，
如果你想要生成 Kubernetes {{< skew prevMinorVersion >}}.0 的文檔，可以使用以下命令：

```shell
cd <k8s-base>
git checkout v{{< skew prevMinorVersion >}}.0
git pull https://github.com/kubernetes/kubernetes {{< skew prevMinorVersion >}}.0
```

<!-- 
If you do not need to edit the kubectl source code, follow the instructions to
[Setting build variables](#set-build-variables).
-->
如果不需要編輯 `kubectl`
源碼，請按照說明[設定構建變量](#set-build-variables)。

<!--
## Edit the kubectl source code

The kubectl command reference documentation is automatically generated from
the kubectl source code. If you want to change the reference documentation, the first step
is to change one or more comments in the kubectl source code. Make the change in your
local kubernetes/kubernetes repository, and then submit a pull request to the master branch of
[github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
-->
## 編輯 kubectl 源碼

kubectl 命令的參考文檔是基於 kubectl 源碼自動生成的。如果想要修改參考文檔，可以從修改
kubectl 源碼中的一個或多個註釋開始。在本地 kubernetes/kubernetes 倉庫中進行修改，然後向
[github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 的 master
分支提交 PR。

<!--
[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files)
is an example of a pull request that fixes a typo in the kubectl source code.

Monitor your pull request, and respond to reviewer comments. Continue to monitor your
pull request until it is merged into the target branch of the kubernetes/kubernetes repository.
-->

[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files) 是一個對 kubectl
源碼中的筆誤進行修復的 PR 示例。

跟蹤你的 PR，並回應評審人的評論。繼續跟蹤你的 PR，直到它合入到
kubernetes/kubernetes 倉庫的目標分支中。

<!--
## Cherry pick your change into a release branch

Your change is now in the master branch, which is used for development of the next
Kubernetes release. If you want your change to appear in the docs for a Kubernetes
version that has already been released, you need to propose that your change be
cherry picked into the release branch.
-->
## 以 cherry-pick 方式將你的修改合入已發佈分支

你的修改已合入 master 分支中，該分支用於開發下一個 Kubernetes 版本。
如果你希望修改部分出現在已發佈的 Kubernetes 版本文檔中，則需要提議將它們以
cherry-pick 方式合入已發佈分支。

<!--
For example, suppose the master branch is being used to develop Kubernetes {{< skew currentVersion >}}
and you want to backport your change to the release-{{< skew prevMinorVersion >}} branch. For instructions
on how to do this, see
[Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).

Monitor your cherry-pick pull request until it is merged into the release branch.
-->

例如，假設 master 分支正用於開發 Kubernetes {{< skew currentVersion >}} 版本，
而你希望將修改合入到 release-{{< skew prevMinorVersion >}} 版本分支。
相關的操作指南，請參見
[提議一個 cherry-pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md)。

跟蹤你的 cherry-pick PR，直到它合入到已發佈分支中。

<!--
Proposing a cherry pick requires that you have permission to set a label and a
milestone in your pull request. If you don’t have those permissions, you will
need to work with someone who can set the label and milestone for you.
-->

{{< note >}}
提議一個 cherry-pick 需要你有在 PR 中設置標籤和里程碑的權限。
如果你沒有，你需要與有權限爲你設置標籤和里程碑的人合作完成。
{{< /note >}}

<!--
## Set build variables

Go to `<rdocs-base>`, and open the `Makefile` for editing:
-->
## 設置構建變量 {#set-build-variables}

進入 `<rdocs-base>` 目錄, 打開 `Makefile` 進行編輯：

<!--
* Set `K8S_ROOT` to `<k8s-base>`.
* Set `K8S_WEBROOT` to `<web-base>`.
* Set `K8S_RELEASE` to the version of the docs you want to build.
  For example, if you want to build docs for Kubernetes {{< skew prevMinorVersion >}},
  set `K8S_RELEASE` to {{< skew prevMinorVersion >}}.

For example, update the following variables: 
-->
* 設置 `K8S_ROOT` 爲 `<k8s-base>`。
* 設置 `K8S_WEBROOT` 爲 `<web-base>`。
* 設置 `K8S_RELEASE` 爲要構建文檔的版本。
  例如，如果你想爲 Kubernetes {{< skew prevMinorVersion >}} 構建文檔，
  請將 `K8S_RELEASE` 設置爲 {{< skew prevMinorVersion >}}。

例如：

```
export K8S_WEBROOT=$(GOPATH)/src/github.com/<your-username>/website
export K8S_ROOT=$(GOPATH)/src/k8s.io/kubernetes
export K8S_RELEASE={{< skew prevMinorVersion >}}
```

<!--
## Creating a versioned directory

The `createversiondirs` build target creates a versioned directory
and copies the kubectl reference configuration files to the versioned directory.
The versioned directory name follows the pattern of `v<major>_<minor>`.

In the `<rdocs-base>` directory, run the following build target:

```shell
cd <rdocs-base>
make createversiondirs
```
-->
## 創建版本目錄

構建目標 `createversiondirs` 會生成一個版本目錄並將 kubectl 參考設定檔案複製到該目錄中。
版本目錄的名字模式爲 `v<major>_<minor>`。

在 `<rdocs-base>` 目錄下，執行下面的命令：

```shell
cd <rdocs-base>
make createversiondirs
```

<!--
## Check out a branch in k8s.io/kubernetes

In your local <k8s-base> repository, check out the branch that has
the version of Kubernetes that you want to document. For example, if you want
to generate docs for Kubernetes {{< skew prevMinorVersion >}}.0, checkout the
`v{{< skew prevMinorVersion >}}` tag. Make sure you local branch is up to date.
-->
## 從 kubernetes/kubernetes 檢出一個分支

在本地 `<k8s-base>` 倉庫中，檢出你想要生成文檔的、包含 Kubernetes 版本的分支。
例如，如果希望爲 Kubernetes {{< skew prevMinorVersion >}}.0 版本生成文檔，
請檢出 `v{{< skew prevMinorVersion >}}` 標記。
確保本地分支是最新的。

```shell
cd <k8s-base>
git checkout v{{< skew prevMinorVersion >}}.0
git pull https://github.com/kubernetes/kubernetes v{{< skew prevMinorVersion >}}.0
```

<!--
## Run the doc generation code

In your local kubernetes-incubator/reference-docs repository, build and run the
kubectl command reference generation code. You might need to run the command as root:
-->
## 運行文檔生成代碼

在本地的 `<rdocs-base>` 目錄下，運行 `copycli` 構建目標。此命令以 `root` 賬號運行：

```shell
cd <rdocs-base>
make copycli
```

<!-- 
The `copycli` command will clean the staging directories, generate the kubectl command files,
and copy the collated kubectl reference HTML page and assets to `<web-base>`. 
-->
`copycli` 命令將清理暫存目錄，生成 kubectl 命令檔案，並將整理後的 kubectl
參考 HTML 頁面和檔案複製到 `<web-base>`。

<!--
## Locate the generated files

Verify that these two files have been generated:
-->
## 找到生成的檔案

驗證是否已生成以下兩個檔案：

```shell
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

<!-- 
## Locate the copied files

Verify that all generated files have been copied to your `<web-base>`:
-->
## 找到複製的檔案

確認所有生成的檔案都已複製到你的 `<web-base>`：

```shell
cd <web-base>
git status
```

<!--
The output should include the modified files:
-->
輸出應包括修改後的檔案：

```
static/docs/reference/generated/kubectl/kubectl-commands.html
static/docs/reference/generated/kubectl/navData.js
```

<!--
Additionally, the output might show the modified files:
-->
此外，輸出可能還包含：

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

Build the Kubernetes documentation in your local `<web-base>`.
-->
## 在本地測試文檔

在本地 `<web-base>` 中構建 Kubernetes 文檔。

<!--
# if not already done
-->
```shell
cd <web-base>
git submodule update --init --recursive --depth 1 # 如果還沒完成
make container-serve
```

<!--
View the [local preview](https://localhost:1313/docs/reference/generated/kubectl/kubectl-commands/).
-->
查看[本地預覽](https://localhost:1313/docs/reference/generated/kubectl/kubectl-commands/)。

<!-- 
## Add and commit changes in kubernetes/website

Run `git add` and `git commit` to commit the files.
-->
## 在 kubernetes/website 中添加和提交更改

運行 `git add` 和 `git commit` 提交修改檔案。

<!--
## Create a pull request

Create a pull request to the `kubernetes/website` repository. Monitor your
pull request, and respond to review comments as needed. Continue to monitor
your pull request until it is merged.

A few minutes after your pull request is merged, your updated reference
topics will be visible in the [published documentation](/docs/home).
-->
## 創建 PR

對 `kubernetes/website` 倉庫創建 PR。跟蹤你的 PR，並根據需要回應評審人的評論。
繼續跟蹤你的 PR，直到它被合入。

在 PR 合入的幾分鐘後，你更新的參考主題將出現在[已發佈文檔](/zh-cn/docs/home/)中。

## {{% heading "whatsnext" %}}

<!--
* [Generating Reference Documentation Quickstart](/docs/contribute/generate-ref-docs/quickstart/)
* [Generating Reference Documentation for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
-->
* [生成參考文檔快速入門](/zh-cn/docs/contribute/generate-ref-docs/quickstart/)
* [爲 Kubernetes 組件和工具生成參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)
* [爲 Kubernetes API 生成參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-api/)
