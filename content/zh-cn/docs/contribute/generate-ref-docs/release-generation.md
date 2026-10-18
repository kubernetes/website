---
title: 为发行版本生成参考文档
linkTitle: 发行版本生成
content_type: task
weight: 15
---
<!--
title: Generating Reference Documentation for a Release
linkTitle: Release generation
content_type: task
weight: 15
-->

<!-- overview -->

<!--
This page shows how to regenerate every set of Kubernetes reference documentation
for a new release, and how to divide the generated output into pull requests that
reviewers can handle one at a time.

Work through the sections in order. Each reference set has its own section that
builds it, copies it into your website clone, and ends with a page to check, so
you can finish one set before you start the next. The [summary](#summary) at the
end lists every target, its output, and the pull requests to open.
-->
本页面介绍如何为新的发行版本重新生成每一套 Kubernetes 参考文档，
以及如何将生成的输出拆分为多个拉取请求，以便评阅者能够逐个处理。

请按顺序阅读各个小节。每一套参考文档都有独立的小节，
说明如何构建、如何将其复制到你的网站克隆中，并以一个待检查的页面收尾，
这样你就可以在开始下一套之前先完成当前这一套。
末尾的[摘要](#summary)列出了每个构建目标、其输出以及需要发起的拉取请求。

{{< note >}}
<!--
The Release Team Docs Lead and the Docs shadows run this process during a release
cycle. The
[Docs role handbook](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks/docs)
in `kubernetes/sig-release` covers the rest of that role. If the handbook gains
its own steps for generating reference documentation, update this page to match.
-->
在发布周期内，这个过程由发布团队的文档负责人（Docs Lead）和文档影子（Docs shadow）来执行。
`kubernetes/sig-release` 中的
[Docs 角色手册](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks/docs)涵盖了该角色的其他内容。
如果该手册增加了自己生成参考文档的步骤，请相应更新本页面。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

<!--
## Set up the local repositories

You need local clones of `kubernetes/website` and `kubernetes-sigs/reference-docs`.

If you have not already forked and cloned `kubernetes/website`, see
[Work from a local clone](/docs/contribute/new-content/open-a-pr/#fork-the-repo).
Clone `reference-docs`:
-->
## 配置本地仓库 {#set-up-the-local-repositories}

你需要 `kubernetes/website` 和 `kubernetes-sigs/reference-docs` 的本地克隆。

如果你还没有复刻和克隆 `kubernetes/website`，
请参阅[从本地克隆开始工作](/zh-cn/docs/contribute/new-content/open-a-pr/#fork-the-repo)。
克隆 `reference-docs`：

```shell
git clone https://github.com/kubernetes-sigs/reference-docs
```

<!--
The remaining steps refer to your `kubernetes/website` clone as `<web-base>` and
your `reference-docs` clone as `<rdocs-base>`.
-->
接下来的步骤将你的 `kubernetes/website` 克隆称为 `<web-base>`，
将你的 `reference-docs` 克隆称为 `<rdocs-base>`。

<!--
## Set build variables

Set these in your shell. They apply to every `make` command in the steps that
follow.
-->
## 设置构建变量 {#set-build-variables}

在你的 Shell 中设置这些变量。它们适用于后续步骤中的每个 `make` 命令。

<!--
```shell
export K8S_WEBROOT=<your-path-to>/website     # your website clone (<web-base>)
export K8S_RELEASE={{< skew currentVersionAddMinor 1 >}}.0
```
-->
```shell
export K8S_WEBROOT=<your-path-to>/website     # 你的网站克隆（<web-base>）
export K8S_RELEASE={{< skew currentVersionAddMinor 1 >}}.0
```

<!--
Set `K8S_RELEASE` to a full release version, such as `{{< skew currentVersionAddMinor 1 >}}.0`
or `{{< skew currentVersionAddMinor 1 >}}.0-rc.1`. The build targets derive the versioned
directory name, such as `v{{< skew currentVersionAddMinor 1 "_" >}}`, from the
major and minor version.
-->
将 `K8S_RELEASE` 设置为完整的发行版本号，例如 `{{< skew currentVersionAddMinor 1 >}}.0`
或 `{{< skew currentVersionAddMinor 1 >}}.0-rc.1`。
构建目标会根据主版本号和次版本号推导出带版本号的目录名，
例如 `v{{< skew currentVersionAddMinor 1 "_" >}}`。

<!--
## Create the versioned directories

Run this in `<rdocs-base>`:
-->
## 创建带版本号的目录 {#create-the-versioned-directories}

在 `<rdocs-base>` 中运行：

```shell
make createversiondirs
```

<!--
This creates the configuration directory for the new release under
`gen-apidocs/config/`, copying `config.yaml` from the previous release.
-->
这会在 `gen-apidocs/config/` 下为新发行版本创建配置目录，
并从上一个发行版本复制 `config.yaml`。

<!--
You rarely need to edit that file. The settings that change with every release,
the API groups and the list of resources, are empty in it: the build targets on
this page pass `--auto-detect`, so the generator reads them from `swagger.json`.
What stays in the file is operation naming and exclusion, which follows the API
machinery rather than the API surface.
-->
你很少需要编辑该文件。随每个发行版本变化的那些设置，
也就是 API 组和资源列表，在该文件中是空的：本页面的构建目标会传入
`--auto-detect`，因此生成器会从 `swagger.json` 中读取它们。
文件中保留下来的是操作命名和排除规则，它们取决于 API 机制而不是 API 表面。

<!--
When the generated reference looks wrong, fix the cause
[upstream](/docs/contribute/generate-ref-docs/contribute-upstream/) where you
can: descriptions and deprecation notices come from Go comments in
`kubernetes/kubernetes`, and a fix there reaches every reader of that API. Edit
`config.yaml` only for what the generator alone decides, such as an untitled
operation (`operation_categories`), an endpoint that the reference should not
publish (`excluded_operations`), or a group whose operation IDs spell it
differently from its resources (`operation_group_map`). Each entry is carried
into every later release, so keep the file lean.
-->
当生成的参考文档看起来有问题时，
尽量在[上游](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstream/)修复其根源：
描述和弃用通知来自 `kubernetes/kubernetes` 中的 Go 注释，
在那里修复能够惠及该 API 的所有读者。
只有当某件事仅由生成器决定时才编辑 `config.yaml`，例如某个操作没有标题
（`operation_categories`）、某个端点不应由参考文档发布
（`excluded_operations`），或某个组的操作 ID 与其资源拼写不同
（`operation_group_map`）。每个条目都会延续到之后的每个发行版本，因此请保持该文件精简。

<!--
## Fetch the OpenAPI specification

The API reference generator reads `gen-apidocs/config/<version>/swagger.json`.
The specification that `kubernetes/kubernetes` commits is built with the
`OpenAPIEnums` feature gate turned off, so it omits the allowed values of
enumerated fields, and a reference built from it omits them too.
It's better to generate a reference that does list allowed values, so you
take some additional steps to make that happen.

Choose one of the following two options.
-->
## 获取 OpenAPI 规约 {#fetch-the-openapi-specification}

API 参考文档生成器会读取 `gen-apidocs/config/<version>/swagger.json`。
`kubernetes/kubernetes` 所提交的这份规约是在关闭 `OpenAPIEnums`
特性门控的情况下构建的，因此它省略了枚举字段的允许取值，
基于它构建的参考文档也会省略这些取值。更好的做法是生成一份确实列出了允许取值的参考文档，
为此你需要额外执行一些步骤。

从下面两个选项中选一个。

<!--
### Option 1: Generate the specification from source

Use this option unless you cannot meet the requirements below. It needs no
`kubernetes/kubernetes` clone of your own, it leaves any clone you already have
untouched, and it produces a specification that includes enum values.
-->
### 选项 1：从源码生成规约 {#option-1-generate-the-specification-from-source}

除非你无法满足下面的要求，否则请使用此选项。它不需要你自己克隆
`kubernetes/kubernetes`，也不会改动你已有的任何克隆，并且它会生成包含枚举值的规约。

```shell
make updateapispec-enums-from-source
```

<!--
The target shallow-clones `kubernetes/kubernetes` at tag `v$K8S_RELEASE` into a
temporary directory, turns on `OpenAPIEnums=true` in that checkout only, runs the
upstream `hack/update-openapi-spec.sh`, copies the resulting specification into
the versioned configuration directory, checks that it contains enum values, and
removes the checkout. Beyond the tools in the prerequisites, it needs:

* `jq`, `curl`, and `openssl` on your `PATH`
* network access, to clone the tag and to download Go modules and etcd
* free TCP ports 2379 and 8050
-->
该目标会将 `kubernetes/kubernetes` 在标签 `v$K8S_RELEASE` 处浅克隆到一个临时目录，
在这个检出中单独打开 `OpenAPIEnums=true`，运行上游的 `hack/update-openapi-spec.sh`，
将生成的规约复制到带版本号的配置目录，检查其中是否包含枚举值，然后删除该检出。
除前提条件中列出的工具外，它还需要：

* 在你的 `PATH` 中有 `jq`、`curl` 和 `openssl`
* 网络访问权限，用于克隆该标签以及下载 Go 模块和 etcd
* 空闲的 TCP 端口 2379 和 8050

<!--
The upstream script starts etcd on port 2379 and a temporary API server on port
8050; set `ETCD_PORT` or `API_PORT` if either is taken. It downloads its own copy
of etcd and builds `kube-apiserver`, so expect the first run to take several
minutes.

To keep the temporary checkout and the generation log for troubleshooting:
-->
上游脚本会在端口 2379 上启动 etcd，并在端口 8050 上启动一个临时 API 服务器；
如果其中某个端口已被占用，请设置 `ETCD_PORT` 或 `API_PORT`。
它会下载自己的 etcd 副本并构建 `kube-apiserver`，
因此首次运行预计需要几分钟。

如需保留临时检出和生成日志以便排查问题：

```shell
KEEP_TMP=1 make updateapispec-enums-from-source
```

<!--
### Option 2: Generate the specification in a local clone

Use this option when you already have a `kubernetes/kubernetes` clone and do
not want a second one. You skip cloning, but still run the same generator as
Option 1, and it modifies your clone.

Commit or stash any existing changes in your clone before continuing.
Replace the path below with your local clone path, then check out the release
tag:
-->
### 选项 2：在本地克隆中生成规约 {#option-2-generate-the-specification-in-a-local-clone}

如果你已经有一个 `kubernetes/kubernetes` 克隆，不想再要第二个，请使用此选项。
你会跳过克隆步骤，但仍运行与选项 1 相同的生成器，而且它会修改你的克隆。

继续之前，请先提交或暂存克隆中已有的变更。
将下面的路径替换为你的本地克隆路径，然后检出该发行版本的标签：

```shell
export K8S_ROOT="<your-path-to>/kubernetes"
cd "$K8S_ROOT"
git checkout "v$K8S_RELEASE"
```

<!--
Then set `OpenAPIEnums=true` in `hack/update-openapi-spec.sh` and run it to
regenerate `api/openapi-spec/swagger.json`. This requires the tools and free
ports described in Option 1:
-->
然后在 `hack/update-openapi-spec.sh` 中设置 `OpenAPIEnums=true` 并运行它，
以重新生成 `api/openapi-spec/swagger.json`。
这需要选项 1 中描述的工具和空闲端口：

```shell
hack/update-openapi-spec.sh
```

{{< note >}}
<!--
Without `OpenAPIEnums=true`, the specification carries no enum values, and the
published API reference omits the possible values of every enumerated field.
-->
如果不设置 `OpenAPIEnums=true`，规约中不会包含枚举值，
已发布的 API 参考文档也会省略每个枚举字段的可能取值。
{{< /note >}}

<!--
After generation, restore the script:
-->
生成完成后，恢复该脚本：

```shell
git checkout -- hack/update-openapi-spec.sh
```

<!--
Copy the regenerated specification from your clone's working tree into the
versioned configuration directory created earlier. Replace `<rdocs-base>`
with the path to your `reference-docs` clone:
-->
将重新生成的规约从你克隆的工作树复制到之前创建的带版本号的配置目录中。
把 `<rdocs-base>` 替换为你的 `reference-docs` 克隆路径：

```shell
cd "<rdocs-base>"
cp "$K8S_ROOT/api/openapi-spec/swagger.json" \
  gen-apidocs/config/v{{< skew currentVersionAddMinor 1 "_" >}}/swagger.json
```

<!--
### Check the specification

Whichever option you use, you can check a specification for enum values at any
time:
-->
### 检查规约 {#check-the-specification}

无论你使用哪个选项，都可以随时检查规约中是否包含枚举值：

```shell
./hack/verify-enum-swagger.sh gen-apidocs/config/<version>/swagger.json
```

<!--
## Start the local preview

Start the preview once, in a second terminal, and leave it running. Hugo reloads
each page as the copy targets replace it, so you can check each reference set as
soon as you generate it.
-->
## 启动本地预览 {#start-the-local-preview}

在第二个终端中启动一次预览，并让它保持运行。
当各个复制目标替换页面时，Hugo 会重新加载每个页面，
因此你生成完某一套参考文档后就能立即检查它。

<!--
```shell
cd <web-base>
git submodule update --init --recursive --depth 1   # if not already done
make container-serve
```
-->
```shell
cd <web-base>
git submodule update --init --recursive --depth 1   # 如果尚未完成
make container-serve
```

<!--
Hugo serves the preview at `http://localhost:1313/`.
-->
Hugo 在 `http://localhost:1313/` 上提供预览。

{{< note >}}
<!--
Start each set from an up-to-date branch in `<web-base>`, generate it, check it in
the preview, and commit it. [Pull requests](#pull-requests) lists what to open for
each set, when to open it, and how to describe it.
-->
每一套参考文档都应基于 `<web-base>` 中最新的分支开始，生成它、在预览中检查它，然后提交它。
[拉取请求](#pull-requests)列出了每一套参考文档需要发起什么、何时发起以及如何描述。
{{< /note >}}

<!--
## Generate the Kubernetes API reference

`gen-apidocs` builds this set, the HTML API reference, from the OpenAPI
specification you fetched. The build output goes to `gen-apidocs/build/html/`
before the target copies it.
-->
## 生成 Kubernetes API 参考文档 {#generate-the-kubernetes-api-reference}

`gen-apidocs` 基于你获取的 OpenAPI 规约构建这一套参考文档，即 HTML 格式的 API 参考文档。
构建输出会先出现在 `gen-apidocs/build/html/` 中，然后由构建目标复制。

```shell
cd <rdocs-base>
make copyapi
```

<!--
The target writes two files to `<web-base>`:
-->
该目标会将两个文件写入 `<web-base>`：

```
static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/index.html
static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/js/navData.js
```

<!--
Check `/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/` in the
preview. Open a resource such as Pod and search the page for
`Possible enum values`, which confirms that the specification carried the enum
values through.

See [Pull requests](#pull-requests) for what to open for this set.
-->
在预览中检查 `/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/`。
打开诸如 Pod 之类的资源，在页面中搜索 `Possible enum values`，
即可确认规约确实带过来了枚举值。

关于这一套参考文档需要发起什么，请参见[拉取请求](#pull-requests)。

<!--
## Generate the API reference pages in Markdown

`gen-apidocs` also builds this set, the Markdown API reference that Hugo renders
as regular pages, from the same specification. The build output goes to
`gen-apidocs/build/markdown/`.
-->
## 生成 Markdown 格式的 API 参考页面 {#generate-the-api-reference-pages-in-markdown}

`gen-apidocs` 还会基于同一份规约构建这一套参考文档，即由 Hugo 渲染为普通页面的
Markdown 格式 API 参考文档。构建输出会出现在 `gen-apidocs/build/markdown/` 中。

```shell
cd <rdocs-base>
make copyapimd
```

<!--
The target replaces `<web-base>/content/en/docs/reference/kubernetes-api/` and
keeps the `_index.md` that people maintain by hand.

Check `/docs/reference/kubernetes-api/` in the preview. Compare the number of
generated pages with the previous release:
-->
该目标会替换 `<web-base>/content/en/docs/reference/kubernetes-api/`，
并保留由人工维护的 `_index.md`。

在预览中检查 `/docs/reference/kubernetes-api/`。将生成的页面数量与上一个发行版本进行比较：

```shell
find <web-base>/content/en/docs/reference/kubernetes-api -name '*.md' | wc -l
```

<!--
See [Pull requests](#pull-requests) for what to open for this set.
-->
关于这一套参考文档需要发起什么，请参见[拉取请求](#pull-requests)。

<!--
## Generate the component reference

`gen-compdocs` builds from `k8s.io/kubernetes` and from the `k8s.io` staging
modules that `go.mod` pins with `replace` directives. `go get` updates the first
and leaves the rest, so move the whole set at once:
-->
## 生成组件参考文档 {#generate-the-component-reference}

`gen-compdocs` 基于 `k8s.io/kubernetes` 以及 `go.mod` 用 `replace` 指令固定版本的
`k8s.io` staging 模块进行构建。`go get` 只会更新前者而保留其余部分，
因此需要一次性移动整个集合：

<!--
```shell
cd <rdocs-base>/gen-compdocs
STAGING=v0.${K8S_RELEASE#*.}
go get k8s.io/kubernetes@v$K8S_RELEASE
KK=$(go list -m -f '{{.Dir}}' k8s.io/kubernetes)

# every staging module of this release
for m in $(awk '/=> \.\/staging\/src\//{print $1}' "$KK/go.mod"); do
  go mod edit -replace="$m=$m@$STAGING" -require="$m@$STAGING"
done

# entries left from a release with a different set of staging modules
for m in $(go mod edit -json | jq -r '.Replace[].Old.Path'); do
  grep -q "$m => ./staging/src/$m" "$KK/go.mod" ||
    go mod edit -dropreplace="$m" -droprequire="$m"
done

go mod tidy
go mod edit -go=$(go list -m -f '{{.GoVersion}}' k8s.io/kubernetes)
go mod tidy
```
-->
```shell
cd <rdocs-base>/gen-compdocs
STAGING=v0.${K8S_RELEASE#*.}
go get k8s.io/kubernetes@v$K8S_RELEASE
KK=$(go list -m -f '{{.Dir}}' k8s.io/kubernetes)

# 本发行版本的所有 staging 模块
for m in $(awk '/=> \.\/staging\/src\//{print $1}' "$KK/go.mod"); do
  go mod edit -replace="$m=$m@$STAGING" -require="$m@$STAGING"
done

# 来自 staging 模块集合不同的某个发行版本的残留条目
for m in $(go mod edit -json | jq -r '.Replace[].Old.Path'); do
  grep -q "$m => ./staging/src/$m" "$KK/go.mod" ||
    go mod edit -dropreplace="$m" -droprequire="$m"
done

go mod tidy
go mod edit -go=$(go list -m -f '{{.GoVersion}}' k8s.io/kubernetes)
go mod tidy
```

{{< note >}}
<!--
If `go get` or `go mod tidy` reports `unknown revision` or a 404 from
`sum.golang.org` for a `k8s.io` module, the staging modules for this release are
not published yet. They follow the `kubernetes/kubernetes` tag by some hours.
Check with:
-->
如果 `go get` 或 `go mod tidy` 针对某个 `k8s.io` 模块报告
`unknown revision` 或来自 `sum.golang.org` 的 404，
说明本发行版本的 staging 模块尚未发布。它们会比 `kubernetes/kubernetes`
的标签晚几个小时。可以用下面的命令检查：

```shell
git ls-remote --tags https://github.com/kubernetes/api.git "v0.${K8S_RELEASE#*.}"
```

<!--
An empty result means you wait. This applies to the configuration API reference
as well. The two API reference sets read only the OpenAPI specification, so you
can generate those meanwhile.
-->
结果为空表示你需要等待。这也适用于 Configuration API 参考文档。
那两套 API 参考文档只读取 OpenAPI 规约，因此你可以在此期间先生成它们。
{{< /note >}}

<!--
The loops read the module set from `kubernetes/kubernetes`, because releases add
and remove staging modules and `go.mod` can still list ones from an older
release. The `go` directive comes last: while old modules are still in the graph,
`go mod tidy` raises it again.

Check what moved:
-->
这些循环从 `kubernetes/kubernetes` 读取模块集合，
因为发行版本会增加和移除 staging 模块，而 `go.mod` 中仍可能列着较早发行版本的模块。
`go` 指示放在最后：当旧模块仍在依赖图中时，`go mod tidy` 会再次提升它。

检查有哪些变动：

```shell
git diff go.mod
```

<!--
Every `k8s.io` requirement, every `replace`, and the `go` directive should now
name the new release. Requirements outside the staging set, such as
`k8s.io/klog/v2` and the Goldmark packages, keep their own versions.

Then build and copy the core component pages:
-->
现在每个 `k8s.io` 依赖项、每个 `replace` 以及 `go` 指示都应指向新的发行版本。
staging 集合之外的依赖项（例如 `k8s.io/klog/v2` 和 Goldmark 包）保留各自的版本。

然后构建并复制核心组件页面：

```shell
cd <rdocs-base>
make copycomp-core
```

<!--
`gen-compdocs` writes every component page to `gen-compdocs/build/`, and the
target copies `kube-apiserver.md`, `kube-controller-manager.md`,
`kube-scheduler.md`, `kube-proxy.md`, and `kubelet.md` from there to
`<web-base>/content/en/docs/reference/command-line-tools-reference/`.

Check `/docs/reference/command-line-tools-reference/` in the preview.

See [Pull requests](#pull-requests) for what to open for this set.
-->
`gen-compdocs` 会将每个组件页面写入 `gen-compdocs/build/`，
该构建目标会把其中的 `kube-apiserver.md`、`kube-controller-manager.md`、
`kube-scheduler.md`、`kube-proxy.md` 和 `kubelet.md` 复制到
`<web-base>/content/en/docs/reference/command-line-tools-reference/`。

在预览中检查 `/docs/reference/command-line-tools-reference/`。

关于这一套参考文档需要发起什么，请参见[拉取请求](#pull-requests)。

{{< note >}}
<!--
The component reference, kubectl, and kubeadm are three separate pull requests,
even though `gen-compdocs` produces all three. Each `copycomp-*` target rebuilds
every component page first, which takes a few minutes. To build once and copy all
three sets, run `make copycomp`, then split the result into three branches.
-->
组件参考文档、kubectl 和 kubeadm 是三个独立的拉取请求，
尽管 `gen-compdocs` 会同时产出这三者。每个 `copycomp-*` 目标都会先重新构建所有组件页面，
这需要几分钟。如果想只构建一次并复制全部三套参考文档，
可以运行 `make copycomp`，然后把结果拆分为三个分支。
{{< /note >}}

<!--
## Generate the kubectl reference

The kubectl pages come from the same `gen-compdocs` build as the component
reference, and belong in their own pull request.
-->
## 生成 kubectl 参考文档 {#generate-the-kubectl-reference}

kubectl 页面与组件参考文档来自同一次 `gen-compdocs` 构建，
但应放在各自的拉取请求中。

```shell
cd <rdocs-base>
make copycomp-kubectl
```

<!--
The target writes `kubectl.md` and a directory for each subcommand to
`<web-base>/content/en/docs/reference/kubectl/generated/`, and keeps the
`_index.md` that people maintain by hand.

Check `/docs/reference/kubectl/generated/` in the preview, and open a subcommand
page such as `kubectl apply`.

See [Pull requests](#pull-requests) for what to open for this set.
-->
该目标会将 `kubectl.md` 以及每个子命令对应的目录写入
`<web-base>/content/en/docs/reference/kubectl/generated/`，
并保留由人工维护的 `_index.md`。

在预览中检查 `/docs/reference/kubectl/generated/`，
并打开某个子命令页面，例如 `kubectl apply`。

关于这一套参考文档需要发起什么，请参见[拉取请求](#pull-requests)。

<!--
## Generate the kubeadm reference

The kubeadm pages also come from `gen-compdocs`, and belong in their own pull
request.
-->
## 生成 kubeadm 参考文档 {#generate-the-kubeadm-reference}

kubeadm 页面同样来自 `gen-compdocs`，但应放在各自的拉取请求中。

```shell
cd <rdocs-base>
make copycomp-kubeadm
```

<!--
The target writes `kubeadm.md` and a directory for each subcommand to
`<web-base>/content/en/docs/reference/setup-tools/kubeadm/generated/`, and keeps
the `_index.md` and `README.md` that people maintain by hand.

Check `/docs/reference/setup-tools/kubeadm/generated/` in the preview.

See [Pull requests](#pull-requests) for what to open for this set.
-->
该目标会将 `kubeadm.md` 以及每个子命令对应的目录写入
`<web-base>/content/en/docs/reference/setup-tools/kubeadm/generated/`，
并保留由人工维护的 `_index.md` 和 `README.md`。

在预览中检查 `/docs/reference/setup-tools/kubeadm/generated/`。

关于这一套参考文档需要发起什么，请参见[拉取请求](#pull-requests)。

<!--
## Generate the configuration API reference

`genref` reads the Go configuration types of each component from the `k8s.io`
staging modules. It has no `replace` directives, so the requirements alone decide
which release you document:
-->
## 生成 Configuration API 参考文档 {#generate-the-configuration-api-reference}

`genref` 从 `k8s.io` staging 模块中读取每个组件的 Go 配置类型。
它没有 `replace` 指令，因此仅由依赖项决定你为哪个发行版本编写文档：

<!--
```shell
cd <rdocs-base>/genref
STAGING=v0.${K8S_RELEASE#*.}
OLD=$(go mod edit -json | jq -r '.Require[] | select(.Path=="k8s.io/api") | .Version')

# every k8s.io module pinned to the previous release
go get $(go mod edit -json | jq -r --arg v "$OLD" --arg s "$STAGING" \
  '.Require[] | select(.Version==$v and (.Path|startswith("k8s.io/"))) | .Path + "@" + $s')

go mod tidy
go mod edit -go=$(go list -m -f '{{.GoVersion}}' k8s.io/api)
go mod tidy
```
-->
```shell
cd <rdocs-base>/genref
STAGING=v0.${K8S_RELEASE#*.}
OLD=$(go mod edit -json | jq -r '.Require[] | select(.Path=="k8s.io/api") | .Version')

# 所有固定在上一发行版本的 k8s.io 模块
go get $(go mod edit -json | jq -r --arg v "$OLD" --arg s "$STAGING" \
  '.Require[] | select(.Version==$v and (.Path|startswith("k8s.io/"))) | .Path + "@" + $s')

go mod tidy
go mod edit -go=$(go list -m -f '{{.GoVersion}}' k8s.io/api)
go mod tidy
```

<!--
Selecting by the old version picks up the staging modules and leaves
`k8s.io/klog/v2`, `k8s.io/gengo`, and the other independent repositories alone.
Check what moved:
-->
按旧版本进行选择可以挑选出 staging 模块，
而不会去动 `k8s.io/klog/v2`、`k8s.io/gengo` 以及其他相互独立的仓库。检查有哪些变动：

```shell
git diff go.mod
```

<!--
Also update the release in the `externalPackages` link target in
`genref/config.yaml`, which points readers at the published API reference.
-->
还要更新 `genref/config.yaml` 中 `externalPackages` 链接目标所指向的发行版本，
该目标用于把读者引向已发布的 API 参考文档。

<!--
### Check for new API versions

`genref` generates one page for each entry in `genref/config.yaml`, and each
entry names a Go package and a path that ends in an API version:
-->
### 检查新的 API 版本 {#check-for-new-api-versions}

`genref` 会为 `genref/config.yaml` 中的每个条目生成一个页面，
每个条目都指定一个 Go 包以及一个以 API 版本结尾的路径：

```yaml
  - name: kubelet-config
    title: Kubelet Configuration (v1)
    package: k8s.io/kubelet
    path: config/v1
```

<!--
A component that starts serving a new version of its configuration API adds a
version directory in its Go source. List the version directories of a component
to see what exists in this release:
-->
某个组件在开始提供新版配置 API 时，会在其 Go 源码中新增一个版本目录。
列出某个组件的版本目录，即可了解本发行版本中存在哪些版本：

```shell
cd <rdocs-base>/genref
go mod download
ls "$(go list -m -f '{{.Dir}}' k8s.io/kubelet)/config"
```

<!--
To compare every entry in `config.yaml` against the source at once, run:
-->
要一次性将 `config.yaml` 中的每个条目与源码进行比较，可以运行：

```shell
awk '$1=="package:"{pkg=$2} $1=="path:"{print pkg, $2}' config.yaml | sort -u |
while read -r pkg path; do
  dir=$(go list -m -f '{{.Dir}}' "$pkg" 2>/dev/null) || continue
  parent=$(dirname "$path")
  for v in $(find "$dir/$parent" -maxdepth 1 -mindepth 1 -type d -name 'v[0-9]*'); do
    grep -q "path: $parent/$(basename "$v")\$" config.yaml ||
      echo "$pkg $parent/$(basename "$v")"
  done
done | sort -u
```

<!--
Each line is a candidate, not a gap to fill: several older versions are left out
on purpose, and the comments in `config.yaml` record why. Add an entry when a
component serves a version that readers configure, and keep the entry for an
older version while the component still serves it.
-->
每一行都只是一个候选项，而不是必须填补的空缺：有几个较早的版本是故意省略的，
`config.yaml` 中的注释记录了原因。当某个组件提供读者需要配置的版本时，
就添加一个条目；而当某个组件仍在提供较旧的版本时，应保留该版本的条目。

<!--
### Build and copy the pages
-->
### 构建并复制页面 {#build-and-copy-the-pages}

```shell
cd <rdocs-base>
make copyconfigapi
```

<!--
`genref` writes the generated pages to `genref/output/md/`, and the target sorts
them as it copies: most go to `content/en/docs/reference/config-api/`, the metrics
APIs go to `content/en/docs/reference/external-api/`, because the project defines
them but does not serve them from the API server, and the pages the website does
not publish are skipped.

Check both sections in the preview, and confirm that no page you published for
the previous release disappeared:
-->
`genref` 会将生成的页面写入 `genref/output/md/`，而该构建目标在复制时会对其分类：
大多数页面进入 `content/en/docs/reference/config-api/`，
指标类 API 进入 `content/en/docs/reference/external-api/`，
因为项目定义了这些 API 但并不通过 API 服务器提供它们，而网站不发布的页面会被跳过。

在预览中检查这两个部分，并确认你为上一个发行版本发布的页面没有消失：

```shell
cd <web-base>
git status content/en/docs/reference/config-api/ content/en/docs/reference/external-api/
```

<!--
See [Pull requests](#pull-requests) for what to open for this set.
-->
关于这一套参考文档需要发起什么，请参见[拉取请求](#pull-requests)。

<!--
## Summary
-->
## 摘要 {#summary}

<!--
{{< table caption="Reference sets, the generator that builds each one, and where its output lands" >}}
| Reference set | Generator in `<rdocs-base>` | Target | Output in `<web-base>` |
| --- | --- | --- | --- |
| Kubernetes API, HTML | `gen-apidocs` | `make copyapi` | `static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/` |
| Kubernetes API, Markdown | `gen-apidocs` | `make copyapimd` | `content/en/docs/reference/kubernetes-api/` |
| Components | `gen-compdocs` | `make copycomp-core` | `content/en/docs/reference/command-line-tools-reference/` |
| kubectl | `gen-compdocs` | `make copycomp-kubectl` | `content/en/docs/reference/kubectl/generated/` |
| kubeadm | `gen-compdocs` | `make copycomp-kubeadm` | `content/en/docs/reference/setup-tools/kubeadm/generated/` |
| Configuration APIs | `genref` | `make copyconfigapi` | `content/en/docs/reference/config-api/`, `content/en/docs/reference/external-api/` |
{{< /table >}}
-->
{{< table caption="参考文档集合、构建每一套文档的生成器及输出的落盘位置" >}}
| 参考文档集合 | `<rdocs-base>` 中的生成器 | 构建目标 | `<web-base>` 中的输出 |
| --- | --- | --- | --- |
| Kubernetes API，HTML | `gen-apidocs` | `make copyapi` | `static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/` |
| Kubernetes API，Markdown | `gen-apidocs` | `make copyapimd` | `content/en/docs/reference/kubernetes-api/` |
| 组件 | `gen-compdocs` | `make copycomp-core` | `content/en/docs/reference/command-line-tools-reference/` |
| kubectl | `gen-compdocs` | `make copycomp-kubectl` | `content/en/docs/reference/kubectl/generated/` |
| kubeadm | `gen-compdocs` | `make copycomp-kubeadm` | `content/en/docs/reference/setup-tools/kubeadm/generated/` |
| Configuration API | `genref` | `make copyconfigapi` | `content/en/docs/reference/config-api/`、`content/en/docs/reference/external-api/` |
{{< /table >}}

<!--
Each copy target builds first. To build every set without copying anything into
your website clone, run `make api apimd comp configapi`.
-->
每个复制目标都会先执行构建。如果只想构建所有参考文档集合而不向网站克隆中复制任何内容，
可以运行 `make api apimd comp configapi`。

<!--
### Pull requests

Each reference set gets its own website pull request, six in all, and the
generator side takes three. Open a website pull request together with the
`reference-docs` pull request it needs, and hold the website one until that
merges.
-->
### 拉取请求 {#pull-requests}

每一套参考文档都有各自的网站拉取请求，总共六个，而生成器侧需要三个。
请将网站拉取请求与它所需的 `reference-docs` 拉取请求一起发起，
并等后者合并之后再处理网站侧的这个。

<!--
{{< table caption="Pull requests to open for each reference set" >}}
| Reference set | Pull request to `kubernetes-sigs/reference-docs` | Pull request to `kubernetes/website` |
| --- | --- | --- |
| Kubernetes API, HTML | `gen-apidocs/config/<version>/`, the configuration and the specification: one pull request for both API sets | `Update the Kubernetes API reference for v{{< skew currentVersionAddMinor 1 >}}` |
| Kubernetes API, Markdown | the same `gen-apidocs` pull request | `Update the generated API reference pages for v{{< skew currentVersionAddMinor 1 >}}` |
| Components | `gen-compdocs/go.mod` and `go.sum`: one pull request for the components, kubectl, and kubeadm sets | `Update the component reference for v{{< skew currentVersionAddMinor 1 >}}` |
| kubectl | the same `gen-compdocs` pull request | `Update the kubectl reference for v{{< skew currentVersionAddMinor 1 >}}` |
| kubeadm | the same `gen-compdocs` pull request | `Update the kubeadm reference for v{{< skew currentVersionAddMinor 1 >}}` |
| Configuration APIs | `genref/go.mod`, `genref/config.yaml`, and `genref/output/md/`: one pull request | `Update the configuration API reference for v{{< skew currentVersionAddMinor 1 >}}` |
{{< /table >}}
-->
{{< table caption="每一套参考文档需要发起的拉取请求" >}}
| 参考文档集合 | 向 `kubernetes-sigs/reference-docs` 发起的拉取请求 | 向 `kubernetes/website` 发起的拉取请求 |
| --- | --- | --- |
| Kubernetes API，HTML | `gen-apidocs/config/<version>/`，即配置和规约：两套 API 共用一个拉取请求 | `Update the Kubernetes API reference for v{{< skew currentVersionAddMinor 1 >}}` |
| Kubernetes API，Markdown | 同一个 `gen-apidocs` 拉取请求 | `Update the generated API reference pages for v{{< skew currentVersionAddMinor 1 >}}` |
| 组件 | `gen-compdocs/go.mod` 和 `go.sum`：组件、kubectl 和 kubeadm 三套共用一个拉取请求 | `Update the component reference for v{{< skew currentVersionAddMinor 1 >}}` |
| kubectl | 同一个 `gen-compdocs` 拉取请求 | `Update the kubectl reference for v{{< skew currentVersionAddMinor 1 >}}` |
| kubeadm | 同一个 `gen-compdocs` 拉取请求 | `Update the kubeadm reference for v{{< skew currentVersionAddMinor 1 >}}` |
| Configuration API | `genref/go.mod`、`genref/config.yaml` 和 `genref/output/md/`：共用一个拉取请求 | `Update the configuration API reference for v{{< skew currentVersionAddMinor 1 >}}` |
{{< /table >}}

<!--
In each website pull request, say how you generated the output, so that a
reviewer can reproduce it:
-->
在每个网站拉取请求中，说明你是如何生成这些输出的，以便评阅者能够复现：

```text
Regenerated the kubectl reference for v{{< skew currentVersionAddMinor 1 >}}.0.

- Generated with `make copycomp-kubectl` from kubernetes-sigs/reference-docs at commit <commit>
- Generator changes: kubernetes-sigs/reference-docs#<pull request>
- Generated files only, with no hand edits
```

<!--
For the two API reference sets, add how you produced the OpenAPI specification,
because the generated output does not show it: `generated from source with
OpenAPIEnums=true`, or copied from a clone.
-->
对于那两套 API 参考文档，还要补充你是如何生成 OpenAPI 规约的，
因为生成的输出中不会体现这一点：`generated from source with OpenAPIEnums=true`，
或者从某个克隆中复制而来。

{{< caution >}}
<!--
Do not hand-edit generated pages. The next release overwrites the edit. Fix the
wording [in the upstream project](/docs/contribute/generate-ref-docs/contribute-upstream/)
or in the generator instead.
-->
不要手工编辑生成的页面。下一个发行版本会覆盖该编辑。
请改为[在上游项目](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstream/)中或在生成器中修正措辞。
{{< /caution >}}

## {{% heading "whatsnext" %}}

<!--
* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Generating Reference Documentation for Configuration APIs](/docs/contribute/generate-ref-docs/config-api/)
* [Generating Reference Pages for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
* [Generating Reference Documentation for Metrics](/docs/contribute/generate-ref-docs/metrics-reference/)
* [Contributing to the Upstream Kubernetes Code](/docs/contribute/generate-ref-docs/contribute-upstream/)
* [Docs role handbook](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks/docs)
  in `kubernetes/sig-release`
-->
* [为 Kubernetes API 生成参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-api/)
* [为 Configuration API 生成参考文档](/zh-cn/docs/contribute/generate-ref-docs/config-api/)
* [为 Kubernetes 组件和工具生成参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)
* [为 kubectl 命令生成参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubectl/)
* [为指标生成参考文档](/zh-cn/docs/contribute/generate-ref-docs/metrics-reference/)
* [为上游 Kubernetes 代码库做出贡献](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstream/)
* `kubernetes/sig-release` 中的 [Docs 角色手册](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks/docs)
