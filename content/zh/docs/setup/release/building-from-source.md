---
title: 从源代码构建
---

<!--
---
reviewers:
- david-mcmahon
- jbeda
title: Building from Source
---
-->

您可以从源代码构建发行包，也可以下载预构建的发行包。
<!--
You can either build a release from source or download a pre-built release.
-->

如果您不打算开发 Kubernetes 本身，我们建议您使用当前发行包的预构建版本，该版本可以在[发行说明](/docs/setup/release/notes/)中找到。
<!--
If you do not plan on developing Kubernetes itself, we suggest using a pre-built version of the current release, which can be found in the [Release Notes](/docs/setup/release/notes/).
-->

Kubernetes 源代码可以从 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 仓库下载。
<!--
The Kubernetes source code can be downloaded from the [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repo.
-->

## 从源代码构建
<!--
## Building from source
-->

如果您只是简单地想从源代码构建一个发行包，则不需要设置完整的 golang 环境，因为所有构建过程都发生在 Docker 容器中。
<!--
If you are simply building a release from source there is no need to set up a full golang environment as all building happens in a Docker container.
-->

构建一个发行包很简单。
<!--
Building a release is simple.
-->

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

有关发布过程的更多细节，请参见 kubernetes/kubernetes [`build`](http://releases.k8s.io/{{< param "githubbranch" >}}/build/) 目录。
<!--
For more details on the release process see the kubernetes/kubernetes [`build`](http://releases.k8s.io/{{< param "githubbranch" >}}/build/) directory.
-->
