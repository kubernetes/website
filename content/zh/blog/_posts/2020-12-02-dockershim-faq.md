---
layout: blog
title: "弃用 Dockershim 的常见问题"
date: 2020-12-02
slug: dockershim-faq
---
<!-- 
layout: blog
title: "Dockershim Deprecation FAQ"
date: 2020-12-02
slug: dockershim-faq
aliases: [ '/dockershim' ]
-->

<!-- 
This document goes over some frequently asked questions regarding the Dockershim
deprecation announced as a part of the Kubernetes v1.20 release. For more detail
on the deprecation of Docker as a container runtime for Kubernetes kubelets, and
what that means, check out the blog post
[Don't Panic: Kubernetes and Docker](/blog/2020/12/02/dont-panic-kubernetes-and-docker/).
-->
本文回顾了自 Kubernetes v1.20 版宣布弃用 Dockershim 以来所引发的一些常见问题。
关于 Kubernetes kubelets 从容器运行时的角度弃用 Docker 的细节以及这些细节背后的含义，请参考博文
[别慌: Kubernetes 和 Docker](/blog/2020/12/02/dont-panic-kubernetes-and-docker/)。

<!-- 
### Why is dockershim being deprecated?
-->
### 为什么弃用 dockershim {#why-is-dockershim-being-deprecated}

<!-- 
Maintaining dockershim has become a heavy burden on the Kubernetes maintainers.
The CRI standard was created to reduce this burden and allow smooth interoperability
of different container runtimes. Docker itself doesn't currently implement CRI,
thus the problem.
-->
维护 dockershim 已经成为 Kubernetes 维护者肩头一个沉重的负担。
创建 CRI 标准就是为了减轻这个负担，同时也可以增加不同容器运行时之间平滑的互操作性。
但反观 Docker 却至今也没有实现 CRI，所以麻烦就来了。

<!-- 
Dockershim was always intended to be a temporary solution (hence the name: shim).
You can read more about the community discussion and planning in the
[Dockershim Removal Kubernetes Enhancement Proposal][drkep].
-->
Dockershim 向来都是一个临时解决方案（因此得名：shim）。
你可以进一步阅读
[移除 Kubernetes 增强方案 Dockershim](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1985-remove-dockershim)
以了解相关的社区讨论和计划。

<!-- 
Additionally, features that were largely incompatible with the dockershim, such
as cgroups v2 and user namespaces are being implemented in these newer CRI
runtimes. Removing support for the dockershim will allow further development in
those areas.
-->
此外，与 dockershim 不兼容的一些特性，例如：控制组（cgoups）v2 和用户名字空间（user namespace），已经在新的 CRI 运行时中被实现。
移除对 dockershim 的支持将加速这些领域的发展。

<!-- 
### Can I still use Docker in Kubernetes 1.20?
-->
### 在 Kubernetes 1.20 版本中，我还可以用 Docker 吗？ {#can-I-still-use-docker-in-kubernetes-1.20}

<!-- 
Yes, the only thing changing in 1.20 is a single warning log printed at [kubelet]
startup if using Docker as the runtime.
-->
当然可以，在 1.20 版本中仅有的改变就是：如果使用 Docker 运行时，启动 
[kubelet](/zh/docs/reference/command-line-tools-reference/kubelet/) 
的过程中将打印一条警告日志。

<!-- 
### When will dockershim be removed?
-->
### 什么时候移除 dockershim {#when-will-dockershim-be-removed}

<!-- 
Given the impact of this change, we are using an extended deprecation timeline.
It will not be removed before Kubernetes 1.22, meaning the earliest release without
dockershim would be 1.23 in late 2021. We will be working closely with vendors
and other ecosystem groups to ensure a smooth transition and will evaluate things
as the situation evolves.
-->
考虑到此改变带来的影响，我们使用了一个加长的废弃时间表。
在 Kubernetes 1.22 版之前，它不会被彻底移除；换句话说，dockershim 被移除的最早版本会是 2021 年底发布 1.23 版。
我们将与供应商以及其他生态团队紧密合作，确保顺利过渡，并将依据事态的发展评估后续事项。

<!-- 
### Will my existing Docker images still work?
-->
### 我现有的 Docker 镜像还能正常工作吗？ {#will-my-existing-docker-image-still-work}

<!-- 
Yes, the images produced from `docker build` will work with all CRI implementations.
All your existing images will still work exactly the same.
-->
当然可以，`docker build` 创建的镜像适用于任何 CRI 实现。
所有你的现有镜像将和往常一样工作。

<!-- 
### What about private images?
-->
### 私有镜像呢？{#what-about-private-images}

<!-- 
Yes. All CRI runtimes support the same pull secrets configuration used in
Kubernetes, either via the PodSpec or ServiceAccount.
-->
当然可以。所有 CRI 运行时均支持 Kubernetes 中相同的拉取（pull）Secret 配置，
不管是通过 PodSpec 还是通过 ServiceAccount 均可。

<!-- 
### Are Docker and containers the same thing?
-->
### Docker 和容器是一回事吗？ {#are-docker-and-containers-the-same-thing}

<!-- 
Docker popularized the Linux containers pattern and has been instrumental in
developing the underlying technology, however containers in Linux have existed
for a long time. The container ecosystem has grown to be much broader than just
Docker. Standards like OCI and CRI have helped many tools grow and thrive in our
ecosystem, some replacing aspects of Docker while others enhance existing
functionality.
-->
虽然 Linux 的容器技术已经存在了很久，
但 Docker 普及了 Linux 容器这种技术模式，并在开发底层技术方面发挥了重要作用。
容器的生态相比于单纯的 Docker，已经进化到了一个更宽广的领域。
像 OCI 和 CRI 这类标准帮助许多工具在我们的生态中成长和繁荣，
其中一些工具替代了 Docker 的某些部分，另一些增强了现有功能。

<!-- 
### Are there examples of folks using other runtimes in production today?
-->
### 现在是否有在生产系统中使用其他运行时的例子？ {#are-there-example-of-folks-using-other-runtimes-in-production-today}

<!-- 
All Kubernetes project produced artifacts (Kubernetes binaries) are validated
with each release.
-->
Kubernetes 所有项目在所有版本中出产的工件（Kubernetes 二进制文件）都经过了验证。

<!-- 
Additionally, the [kind] project has been using containerd for some time and has
seen an improvement in stability for its use case. Kind and containerd are leveraged
multiple times every day to validate any changes to the Kubernetes codebase. Other
related projects follow a similar pattern as well, demonstrating the stability and
usability of other container runtimes. As an example, OpenShift 4.x has been
using the [CRI-O] runtime in production since June 2019.
-->
此外，[kind](https://kind.sigs.k8s.io/) 项目使用 containerd 已经有年头了，
并且在这个场景中，稳定性还明显得到提升。
Kind 和 containerd 每天都会做多次协调，以验证对 Kubernetes 代码库的所有更改。
其他相关项目也遵循同样的模式，从而展示了其他容器运行时的稳定性和可用性。
例如，OpenShift 4.x 从 2019 年 6 月以来，就一直在生产环境中使用 [CRI-O](https://cri-o.io/) 运行时。

<!-- 
For other examples and references you can look at the adopters of containerd and
CRI-O, two container runtimes under the Cloud Native Computing Foundation ([CNCF]).
- [containerd](https://github.com/containerd/containerd/blob/master/ADOPTERS.md)
- [CRI-O](https://github.com/cri-o/cri-o/blob/master/ADOPTERS.md)
-->
至于其他示例和参考资料，你可以查看 containerd 和 CRI-O 的使用者列表，
这两个容器运行时是云原生基金会（[CNCF]）下的项目。

- [containerd](https://github.com/containerd/containerd/blob/master/ADOPTERS.md)
- [CRI-O](https://github.com/cri-o/cri-o/blob/master/ADOPTERS.md)

<!-- 
### People keep referencing OCI, what is that?
-->
### 人们总在谈论 OCI，那是什么？ {#people-keep-referenceing-oci-what-is-that}

<!-- 
OCI stands for the [Open Container Initiative], which standardized many of the
interfaces between container tools and technologies. They maintain a standard
specification for packaging container images (OCI image-spec) and running containers
(OCI runtime-spec). They also maintain an actual implementation of the runtime-spec
in the form of [runc], which is the underlying default runtime for both
[containerd] and [CRI-O]. The CRI builds on these low-level specifications to
provide an end-to-end standard for managing containers.
-->
OCI 代表[开放容器标准](https://opencontainers.org/about/overview/)，
它标准化了容器工具和底层实现（technologies）之间的大量接口。
他们维护了打包容器镜像（OCI image-spec）和运行容器（OCI runtime-spec）的标准规范。
他们还以 [runc](https://github.com/opencontainers/runc) 
的形式维护了一个 runtime-spec 的真实实现，
这也是 [containerd](https://containerd.io/) 和 [CRI-O](https://cri-o.io/) 依赖的默认运行时。
CRI 建立在这些底层规范之上，为管理容器提供端到端的标准。

<!-- 
### Which CRI implementation should I use?
-->
### 我应该用哪个 CRI 实现？ {#which-cri-implementation-should-I-use}

<!-- 
That’s a complex question and it depends on a lot of factors. If Docker is
working for you, moving to containerd should be a relatively easy swap and
will have strictly better performance and less overhead. However, we encourage you
to explore all the options from the [CNCF landscape] in case another would be an
even better fit for your environment.
-->
这是一个复杂的问题，依赖于许多因素。
在 Docker 工作良好的情况下，迁移到 containerd 是一个相对容易的转换，并将获得更好的性能和更少的开销。
然而，我们建议你先探索 [CNCF 全景图](https://landscape.cncf.io/card-mode?category=container-runtime&grouping=category)
提供的所有选项，以做出更适合你的环境的选择。

<!-- 
### What should I look out for when changing CRI implementations?
-->
### 当切换 CRI 底层实现时，我应该注意什么？ {#what-should-I-look-out-for-when-changing-CRI-implementation}

<!-- 
While the underlying containerization code is the same between Docker and most
CRIs (including containerd), there are a few differences around the edges. Some
common things to consider when migrating are:
-->
Docker 和大多数 CRI（包括 containerd）的底层容器化代码是相同的，但其周边部分却存在一些不同。
迁移时一些常见的关注点是：

<!-- 
- Logging configuration
- Runtime resource limitations
- Node provisioning scripts that call docker or use docker via it's control socket
- Kubectl plugins that require docker CLI or the control socket
- Kubernetes tools that require direct access to Docker (e.g. kube-imagepuller)
- Configuration of functionality like `registry-mirrors` and insecure registries 
- Other support scripts or daemons that expect Docker to be available and are run
  outside of Kubernetes (e.g. monitoring or security agents)
- GPUs or special hardware and how they integrate with your runtime and Kubernetes
-->

- 日志配置
- 运行时的资源限制
- 直接访问 docker 命令或通过控制套接字调用 Docker 的节点供应脚本
- 需要访问 docker 命令或控制套接字的 kubectl 插件
- 需要直接访问 Docker 的 Kubernetes 工具（例如：kube-imagepuller）
- 像 `registry-mirrors` 和不安全的注册表这类功能的配置
- 需要 Docker 保持可用、且运行在 Kubernetes 之外的，其他支持脚本或守护进程（例如：监视或安全代理）
- GPU 或特殊硬件，以及它们如何与你的运行时和 Kubernetes 集成

<!-- 
If you use Kubernetes resource requests/limits or file-based log collection
DaemonSets then they will continue to work the same, but if you’ve customized
your dockerd configuration, you’ll need to adapt that for your new container
runtime where possible.
-->
如果你只是用了 Kubernetes 资源请求/限制或基于文件的日志收集 DaemonSet，它们将继续稳定工作，
但是如果你用了自定义了 dockerd 配置，则可能需要为新容器运行时做一些适配工作。

<!-- 
Another thing to look out for is anything expecting to run for system maintenance
or nested inside a container when building images will no longer work. For the
former, you can use the [`crictl`][cr] tool as a drop-in replacement (see [mapping from docker cli to crictl](https://kubernetes.io/docs/tasks/debug-application-cluster/crictl/#mapping-from-docker-cli-to-crictl)) and for the
latter you can use newer container build options like [img], [buildah],
[kaniko], or [buildkit-cli-for-kubectl] that don’t require Docker.
-->
另外还有一个需要关注的点，那就是当创建镜像时，系统维护或嵌入容器方面的任务将无法工作。
对于前者，可以用 [`crictl`](https://github.com/kubernetes-sigs/cri-tools) 工具作为临时替代方案
(参见 [从 docker 命令映射到 crictl](https://kubernetes.io/zh/docs/tasks/debug-application-cluster/crictl/#mapping-from-docker-cli-to-crictl))；
对于后者，可以用新的容器创建选项，比如
[img](https://github.com/genuinetools/img)、
[buildah](https://github.com/containers/buildah)、
[kaniko](https://github.com/GoogleContainerTools/kaniko)、或 
[buildkit-cli-for-kubectl](https://github.com/vmware-tanzu/buildkit-cli-for-kubectl
)，
他们均不需要访问 Docker。

<!-- 
For containerd, you can start with their [documentation] to see what configuration
options are available as you migrate things over.
-->
对于 containerd，你可以从它们的
[文档](https://github.com/containerd/cri/blob/master/docs/registry.md)
开始，看看在迁移过程中有哪些配置选项可用。

<!-- 
For instructions on how to use containerd and CRI-O with Kubernetes, see the
Kubernetes documentation on [Container Runtimes]
-->
对于如何协同 Kubernetes 使用 containerd 和 CRI-O 的说明，参见 Kubernetes 文档中这部分：
[容器运行时](/zh/docs/setup/production-environment/container-runtimes)。

<!-- 
### What if I have more questions?
-->
### 我还有问题怎么办？{#what-if-I-have-more-question}

<!-- 
If you use a vendor-supported Kubernetes distribution, you can ask them about
upgrade plans for their products. For end-user questions, please post them
to our end user community forum: https://discuss.kubernetes.io/. 
-->
如果你使用了一个有供应商支持的 Kubernetes 发行版，你可以咨询供应商他们产品的升级计划。
对于最终用户的问题，请把问题发到我们的最终用户社区的论坛：https://discuss.kubernetes.io/。

<!-- 
You can also check out the excellent blog post
[Wait, Docker is deprecated in Kubernetes now?][dep] a more in-depth technical
discussion of the changes.
-->
你也可以看看这篇优秀的博文：
[等等，Docker 刚刚被 Kubernetes 废掉了？](https://dev.to/inductor/wait-docker-is-deprecated-in-kubernetes-now-what-do-i-do-e4m) 
一个对此变化更深入的技术讨论。

<!-- 
### Can I have a hug?
-->
### 我可以加入吗？{#can-I-have-a-hug}

<!-- 
Always and whenever you want!  🤗🤗
-->
只要你愿意，随时随地欢迎加入！

