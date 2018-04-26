---
approvers:
- david-mcmahon
- jbeda
title: 从源代码构建
---
<!--
---
approvers:
- david-mcmahon
- jbeda
title: Building from Source
---
-->

<!--
You can either build a release from source or download a pre-built release.  If you do not plan on developing Kubernetes itself, we suggest using a pre-built version of the current release, which can be found in the [Release Notes](/docs/imported/release/notes/).
-->
您可以从源代码构建版本，也可以下载预构建版本。 如果您不打算对 Kubernetes 本身进行开发，
我们建议使用当前版本的预构建版本，预构建版本可以在 [版本说明](/docs/imported/release/notes/) 里找到。

<!--
The Kubernetes source code can be downloaded from the [kubernetes/kubernetes repo](https://github.com/kubernetes/kubernetes).
-->
Kubernetes 源代码可以从 [kubernetes/kubernetes 仓库](https://github.com/kubernetes/kubernetes) 下载。

<!--
### Building from source
-->
### 从源代码构建

<!--
If you are simply building a release from source there is no need to set up a full golang environment as all building happens in a Docker container.
-->
如果您只是从源代码构建一个版本，那么就不必设置完整的 golang 环境，因为整个构建都发生在 Docker 容器中。

<!--
Building a release is simple.
-->
构建一个版本很简单。

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

<!--
For more details on the release process see the kubernetes/kubernetes [`build`](http://releases.k8s.io/{{page.githubbranch}}/build/) directory.
-->
更多版本构建流程相关的详情，请查看 kubernetes/kubernetes [`build`](http://releases.k8s.io/{{page.githubbranch}}/build/) 目录。
