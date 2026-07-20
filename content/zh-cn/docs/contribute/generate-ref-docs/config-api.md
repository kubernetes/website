---
title: 为 Configuration API 生成参考文档
content_type: task
weight: 60
---
<!--
title: Generating Reference Documentation for Configuration APIs
content_type: task
weight: 60
-->

<!-- overview -->

<!--
This page shows how you can generate updated reference documentation for Kubernetes Configuration APIs. It is aimed at people who are contributing to Kubernetes.
-->
本页面展示了如何为 Kubernetes Configuration API 生成更新的参考文档。
本文档面向为 Kubernetes 做贡献的人员。

<!--
The Configuration API reference documents the configuration formats for Kubernetes tools and
components — for example, `kubelet`, `kube-apiserver`, `kube-scheduler`, `kubeconfig`, and 
`kubeadm` formats. The published reference is at [/docs/reference/config-api/](/docs/reference/config-api/).
-->
Configuration API 参考文档记录了 Kubernetes 工具和组件的配置格式 — 例如
`kubelet`、`kube-apiserver`、`kube-scheduler`、`kubeconfig` 和 `kubeadm` 格式。
已发布的参考文档位于 [/zh-cn/docs/reference/config-api/](/zh-cn/docs/reference/config-api/)。

<!--
`genref`, in [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs),
is the generator that builds this reference. It reads each component's Go configuration types and renders them as markdown.
-->
`genref` 是 [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
中的生成器，用于构建此参考文档。它读取每个组件的 Go 配置类型并将其渲染为 Markdown。

<!--
If you find bugs in the generated content, you most likely need to
[fix them upstream](/docs/contribute/generate-ref-docs/contribute-upstream/).
-->
如果你在生成的文档中发现错误，
很可能需要[在上游修复它们](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstream/)。

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

<!--
## Set up the local repositories
-->
## 配置本地仓库

<!--
You need local clones of `kubernetes/website` and `kubernetes-sigs/reference-docs`.
-->
你需要 `kubernetes/website` 和 `kubernetes-sigs/reference-docs` 的本地克隆。

<!--
If you have not already forked and cloned `kubernetes/website`, see
[Work from a local clone](/docs/contribute/new-content/open-a-pr/#fork-the-repo).
Clone `reference-docs`:
-->
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
-->
## 设置构建变量

<!--
Set this in your shell. It applies to every `make` command in the steps that
follow, whichever directory you run it from.
-->
在你的 Shell 中设置此变量。它适用于后续步骤中的每个 `make` 命令，
无论你在哪个目录下运行。

```shell
export K8S_WEBROOT=/path/to/your/website   # your website clone (<web-base>)
```

<!--
## Build and publish the Configuration API reference
-->
## 构建和发布 Configuration API 参考

<!--
From `<rdocs-base>`:
-->
从 `<rdocs-base>` 开始：

```shell
cd <rdocs-base>
make copyconfigapi
```

<!--
This command runs in two stages:
1. **`configapi`** - builds and runs `genref`, which generates Markdown to `genref/output/md`
2. **`copyconfigapi`** - copies the generated files into your website clone at
`<web-base>/content/en/docs/reference/config-api/`.
-->
此命令分两个阶段运行：
1. **`configapi`** - 构建并运行 `genref`，生成 Markdown 到 `genref/output/md`
2. **`copyconfigapi`** - 将生成的文件复制到你的网站克隆的
`<web-base>/content/en/docs/reference/config-api/` 目录中。

<!--
The first run downloads the Go module dependencies and it may take several minutes.
-->
首次运行会下载 Go 模块依赖项，可能需要几分钟。

<!--
Check what changed in your website clone:
-->
检查你的网站克隆中的更改：

```shell
cd <web-base>
git status
```

<!--
Look for updates made under `content/en/docs/reference/config-api` - for example:
-->
查看 `content/en/docs/reference/config-api` 下所做的更新 - 例如：

```text
content/en/docs/reference/config-api/kubelet-config.v1beta1.md
content/en/docs/reference/config-api/kubeadm-config.v1beta4.md
content/en/docs/reference/config-api/apiserver-config.v1.md
content/en/docs/reference/config-api/client-authentication.v1.md
```

<!--
## Preview website and test locally
-->
## 预览网站并在本地测试

<!--
Preview your updates:
-->
预览你的更新：

<!--
# if not already done
-->
```shell
cd <web-base>
git submodule update --init --recursive --depth 1   # 如果尚未完成
make container-serve
```

<!--
Then open a local preview through your web browser and confirm that the 
pages you updated load properly. 
Hugo serves that local preview at http://localhost:1313/
So the page to check is http://localhost:1313/docs/reference/config-api/
-->
然后通过 Web 浏览器打开本地预览，确认你更新的页面能够正确加载。
Hugo 在 http://localhost:1313/ 提供本地预览，
因此要检查的页面是 http://localhost:1313/docs/reference/config-api/

<!--
## Commit the changes
-->
## 提交更改

<!--
If you regenerated the Configuration API reference for a release update,
commit the changed files under `content/en/docs/reference/config-api/` in
`<web-base>`, then open a [pull request](/docs/contribute/new-content/open-a-pr/)
to [kubernetes/website](https://github.com/kubernetes/website).
-->
如果你为版本更新重新生成了 Configuration API 参考文档，
请在 `<web-base>` 中提交 `content/en/docs/reference/config-api/` 下更改的文件，
然后向 [kubernetes/website](https://github.com/kubernetes/website)
发起一个[拉取请求](/zh-cn/docs/contribute/new-content/open-a-pr/)。

## {{% heading "whatsnext" %}}

* [为 Kubernetes API 生成参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-api/)
* [生成参考文档快速入门](/zh-cn/docs/contribute/generate-ref-docs/quickstart/)
* [向上游参考文档做贡献](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstream/)
