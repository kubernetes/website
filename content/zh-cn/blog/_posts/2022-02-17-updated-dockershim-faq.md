---
layout: blog
title: "更新：移除 Dockershim 的常见问题"
linkTitle: "移除 Dockershim 的常见问题"
date: 2022-02-17
slug: dockershim-faq
aliases: [ '/zh-cn/dockershim' ]
---
<!-- 
layout: blog
title: "Updated: Dockershim Removal FAQ"
linkTitle: "Dockershim Removal FAQ"
date: 2022-02-17
slug: dockershim-faq
aliases: [ '/dockershim' ]
-->

<!--
**This supersedes the original
[Dockershim Deprecation FAQ](/blog/2020/12/02/dockershim-faq/) article,
published in late 2020. The article includes updates from the v1.24
release of Kubernetes.**
-->
**本文是针对 2020 年末发布的[弃用 Dockershim 的常见问题](/zh-cn/blog/2020/12/02/dockershim-faq/)的博客更新。
本文包括 Kubernetes v1.24 版本的更新。**

---

<!--
This document goes over some frequently asked questions regarding the
removal of _dockershim_ from Kubernetes. The removal was originally
[announced](/blog/2020/12/08/kubernetes-1-20-release-announcement/)
as a part of the Kubernetes v1.20 release. The Kubernetes
[v1.24 release](/releases/#release-v1-24) actually removed the dockershim
from Kubernetes.
-->
本文介绍了一些关于从 Kubernetes 中移除 _dockershim_ 的常见问题。
该移除最初是作为 Kubernetes v1.20
版本的一部分[宣布](/zh-cn/blog/2020/12/08/kubernetes-1-20-release-announcement/)的。
Kubernetes 在 [v1.24 版](/releases/#release-v1-24)移除了 dockershim。

<!--
For more on what that means, check out the blog post
[Don't Panic: Kubernetes and Docker](/blog/2020/12/02/dont-panic-kubernetes-and-docker/).
-->
关于细节请参考博文
[别慌: Kubernetes 和 Docker](/zh-cn/blog/2020/12/02/dont-panic-kubernetes-and-docker/)。

<!--
To determine the impact that the removal of dockershim would have for you or your organization,
you can read [Check whether dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/).
-->
要确定移除 dockershim 是否会对你或你的组织的影响，可以查阅：
[检查弃用 Dockershim 对你的影响](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
这篇文章。

<!--
In the months and days leading up to the Kubernetes 1.24 release, Kubernetes contributors worked hard to try to make this a smooth transition.
-->
在 Kubernetes 1.24 发布之前的几个月和几天里，Kubernetes
贡献者努力试图让这个过渡顺利进行。

<!--
- A blog post detailing our [commitment and next steps](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/).
- Checking if there were major blockers to migration to [other container runtimes](/docs/setup/production-environment/container-runtimes/#container-runtimes).
- Adding a [migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/) guide.
- Creating a list of
  [articles on dockershim removal and on using CRI-compatible runtimes](/docs/reference/node/topics-on-dockershim-and-cri-compatible-runtimes/).
  That list includes some of the already mentioned docs, and also covers selected external sources
  (including vendor guides).
-->
- 一篇详细说明[承诺和后续操作](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/)的博文。
- 检查是否存在迁移到其他 [容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/#container-runtimes) 的主要障碍。
- 添加 [从 dockershim 迁移](/docs/tasks/administer-cluster/migrating-from-dockershim/)的指南。
- 创建了一个[有关 dockershim 移除和使用 CRI 兼容运行时的列表](/zh-cn/docs/reference/node/topics-on-dockershim-and-cri-compatible-runtimes/)。
  该列表包括一些已经提到的文档，还涵盖了选定的外部资源（包括供应商指南）。

<!--
### Why was the dockershim removed from Kubernetes?
-->
### 为什么会从 Kubernetes 中移除 dockershim ？ {#why-was-the-dockershim-removed-from-kubernetes}

<!--
Early versions of Kubernetes only worked with a specific container runtime:
Docker Engine. Later, Kubernetes added support for working with other container runtimes.
The CRI standard was [created](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) to
enable interoperability between orchestrators (like Kubernetes) and many different container
runtimes.
Docker Engine doesn't implement that interface (CRI), so the Kubernetes project created
special code to help with the transition, and made that _dockershim_ code part of Kubernetes
itself.
-->
Kubernetes 的早期版本仅适用于特定的容器运行时：Docker Engine。
后来，Kubernetes 增加了对使用其他容器运行时的支持。[创建](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) CRI
标准是为了实现编排器（如 Kubernetes）和许多不同的容器运行时之间交互操作。
Docker Engine 没有实现（CRI）接口，因此 Kubernetes 项目创建了特殊代码来帮助过渡，
并使 dockershim 代码成为 Kubernetes 的一部分。

<!--
The dockershim code was always intended to be a temporary solution (hence the name: shim).
You can read more about the community discussion and planning in the
[Dockershim Removal Kubernetes Enhancement Proposal][drkep].
In fact, maintaining dockershim had become a heavy burden on the Kubernetes maintainers.
-->
dockershim 代码一直是一个临时解决方案（因此得名：shim）。
你可以阅读 [Kubernetes 移除 Dockershim 增强方案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim)
以了解相关的社区讨论和计划。
事实上，维护 dockershim 已经成为 Kubernetes 维护者的沉重负担。

<!--
Additionally, features that were largely incompatible with the dockershim, such
as cgroups v2 and user namespaces are being implemented in these newer CRI
runtimes. Removing the dockershim from Kubernetes allows further development in those areas.
-->
此外，在较新的 CRI 运行时中实现了与 dockershim 不兼容的功能，例如 cgroups v2 和用户命名空间。
从 Kubernetes 中移除 dockershim 允许在这些领域进行进一步的开发。

<!--
### Are Docker and containers the same thing?
-->
### Docker 和容器一样吗？ {#are-docker-and-containers-the-same-thing}

<!--
Docker popularized the Linux containers pattern and has been instrumental in
developing the underlying technology, however containers in Linux have existed
for a long time. The container ecosystem has grown to be much broader than just
Docker. Standards like OCI and CRI have helped many tools grow and thrive in our
ecosystem, some replacing aspects of Docker while others enhance existing
functionality.
-->
Docker 普及了 Linux 容器模式，并在开发底层技术方面发挥了重要作用，但是 Linux
中的容器已经存在了很长时间，容器生态系统已经发展到比 Docker 广泛得多。
OCI 和 CRI 等标准帮助许多工具在我们的生态系统中发展壮大，其中一些替代了 Docker
的某些方面，而另一些则增强了现有功能。

<!--
### Will my existing container images still work?
-->
### 我现有的容器镜像是否仍然有效？ {#will-my-existing-container-images-still-work}

<!--
Yes, the images produced from `docker build` will work with all CRI implementations.
All your existing images will still work exactly the same.
-->
是的，从 `docker build` 生成的镜像将适用于所有 CRI 实现，
现有的所有镜像仍将完全相同。

<!--
#### What about private images?
-->
#### 私有镜像呢？ {#what-about-private-images}

<!--
Yes. All CRI runtimes support the same pull secrets configuration used in
Kubernetes, either via the PodSpec or ServiceAccount.
-->
当然可以，所有 CRI 运行时都支持在 Kubernetes 中使用的相同的 pull secrets
配置，无论是通过 PodSpec 还是 ServiceAccount。

<!--
### Can I still use Docker Engine in Kubernetes 1.23?
-->
### 在 Kubernetes 1.23 版本中还可以使用 Docker Engine 吗？ {#can-i-still-use-docker-engine-in-kubernetes-1-23}

<!--
Yes, the only thing changed in 1.20 is a single warning log printed at [kubelet]
startup if using Docker Engine as the runtime. You'll see this warning in all versions up to 1.23. The dockershim removal occurred
in Kubernetes 1.24.
-->
可以使用，在 1.20 版本中唯一的改动是，如果使用 Docker Engine，
在 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
启动时会打印一个警告日志。
你将在 1.23 版本及以前版本看到此警告，dockershim 已在 Kubernetes 1.24 版本中移除 。

<!--
If you're running Kubernetes v1.24 or later, see [Can I still use Docker Engine as my container runtime?](#can-i-still-use-docker-engine-as-my-container-runtime).
(Remember, you can switch away from the dockershim if you're using any supported Kubernetes release; from release v1.24, you
**must** switch as Kubernetes no longer includes the dockershim).
-->
如果你运行的是 Kubernetes v1.24 或更高版本，请参阅
[我仍然可以使用 Docker Engine 作为我的容器运行时吗？](#can-i-still-use-docker-engine-as-my-container-runtime)
（如果你使用任何支持 dockershim 的版本，可以随时切换离开；从版本 v1.24
开始，因为 Kubernetes 不再包含 dockershim，你**必须**切换）。

<!--
### Which CRI implementation should I use?
-->
### 我应该用哪个 CRI 实现？ {#which-cri-implementation-should-i-use}

<!--
That’s a complex question and it depends on a lot of factors. If Docker Engine is
working for you, moving to containerd should be a relatively easy swap and
will have strictly better performance and less overhead. However, we encourage you
to explore all the options from the [CNCF landscape] in case another would be an
even better fit for your environment.
-->
这是一个复杂的问题，依赖于许多因素。
如果你正在使用 Docker Engine，迁移到 containerd
应该是一个相对容易地转换，并将获得更好的性能和更少的开销。
然而，我们鼓励你探索 [CNCF landscape] 提供的所有选项，做出更适合你的选择。

[CNCF landscape]: https://landscape.cncf.io/?group=projects-and-products&view-mode=card#runtime--container-runtime

<!--
#### Can I still use Docker Engine as my container runtime?
-->
#### 我还可以使用 Docker Engine 作为我的容器运行时吗？ {#can-i-still-use-docker-engine-as-my-container-runtime}

<!--
First off, if you use Docker on your own PC to develop or test containers: nothing changes.
You can still use Docker locally no matter what container runtime(s) you use for your
Kubernetes clusters. Containers make this kind of interoperability possible.
-->
首先，如果你在自己的电脑上使用 Docker 用来做开发或测试容器：它将与之前没有任何变化。
无论你为 Kubernetes 集群使用什么容器运行时，你都可以在本地使用 Docker。容器使这种交互成为可能。

<!--
Mirantis and Docker have [committed][mirantis] to maintaining a replacement adapter for
Docker Engine, and to maintain that adapter even after the in-tree dockershim is removed
from Kubernetes. The replacement adapter is named [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd).
-->
Mirantis 和 Docker 已[承诺](https://www.mirantis.com/blog/mirantis-to-take-over-support-of-kubernetes-dockershim-2/)
为 Docker Engine 维护一个替代适配器，
并在 dockershim 从 Kubernetes 移除后维护该适配器。
替代适配器名为 [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)。

<!--
You can install `cri-dockerd` and use it to connect the kubelet to Docker Engine. Read [Migrate Docker Engine nodes from dockershim to cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/) to learn more.
-->
你可以安装 `cri-dockerd` 并使用它将 kubelet 连接到 Docker Engine。
阅读[将 Docker Engine 节点从 dockershim 迁移到 cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
以了解更多信息。


<!--
### Are there examples of folks using other runtimes in production today?
-->
### 现在是否有在生产系统中使用其他运行时的例子？ {#are-there-examples-of-folks-using-other-runtimes-in-production-today}

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
此外，[kind](https://kind.sigs.k8s.io/) 项目使用 containerd 已经有一段时间了，并且提高了其用例的稳定性。
Kind 和 containerd 每天都会被多次使用来验证对 Kubernetes 代码库的任何更改。
其他相关项目也遵循同样的模式，从而展示了其他容器运行时的稳定性和可用性。
例如，OpenShift 4.x 从 2019 年 6 月以来，就一直在生产环境中使用 [CRI-O](https://cri-o.io/) 运行时。

<!--
For other examples and references you can look at the adopters of containerd and
CRI-O, two container runtimes under the Cloud Native Computing Foundation ([CNCF]).
-->
至于其他示例和参考资料，你可以查看 containerd 和 CRI-O 的使用者列表，
这两个容器运行时是云原生基金会（[CNCF](https://cncf.io)）下的项目。

- [containerd](https://github.com/containerd/containerd/blob/master/ADOPTERS.md)
- [CRI-O](https://github.com/cri-o/cri-o/blob/master/ADOPTERS.md)

<!--
### People keep referencing OCI, what is that?
-->
### 人们总在谈论 OCI，它是什么？ {#people-keep-referencing-oci-what-is-that}

<!--
OCI stands for the [Open Container Initiative], which standardized many of the
interfaces between container tools and technologies. They maintain a standard
specification for packaging container images (OCI image-spec) and running containers
(OCI runtime-spec). They also maintain an actual implementation of the runtime-spec
in the form of [runc], which is the underlying default runtime for both
[containerd] and [CRI-O]. The CRI builds on these low-level specifications to
provide an end-to-end standard for managing containers.
-->
OCI 是 [Open Container Initiative](https://opencontainers.org/about/overview/) 的缩写，
它标准化了容器工具和底层实现之间的大量接口。
它们维护了打包容器镜像（OCI image）和运行时（OCI runtime）的标准规范。
它们还以 [runc](https://github.com/opencontainers/runc) 的形式维护了一个 runtime-spec 的真实实现，
这也是 [containerd](https://containerd.io/) 和 [CRI-O](https://cri-o.io/) 依赖的默认运行时。
CRI 建立在这些底层规范之上，为管理容器提供端到端的标准。


<!--
### What should I look out for when changing CRI implementations?
-->
### 当切换 CRI 实现时，应该注意什么？ {#what-should-i-look-out-for-when-changing-cri-implementations}

<!--
While the underlying containerization code is the same between Docker and most
CRIs (including containerd), there are a few differences around the edges. Some
common things to consider when migrating are:
-->
虽然 Docker 和大多数 CRI（包括 containerd）之间的底层容器化代码是相同的，
但其周边部分却存在差异。迁移时要考虑如下常见事项：

<!--
- Logging configuration
- Runtime resource limitations
- Node provisioning scripts that call docker or use Docker Engine via its control socket
- Plugins for `kubectl` that require the `docker` CLI or the Docker Engine control socket
- Tools from the Kubernetes project that require direct access to Docker Engine
  (for example: the deprecated `kube-imagepuller` tool)
- Configuration of functionality like `registry-mirrors` and insecure registries
- Other support scripts or daemons that expect Docker Engine to be available and are run
  outside of Kubernetes (for example, monitoring or security agents)
- GPUs or special hardware and how they integrate with your runtime and Kubernetes
-->
- 日志配置
- 运行时的资源限制
- 调用 docker 或通过其控制套接字使用 Docker Engine 的节点配置脚本
- 需要 `docker` 命令或 Docker Engine 控制套接字的 `kubectl` 插件
- 需要直接访问 Docker Engine 的 Kubernetes 工具（例如：已弃用的 'kube-imagepuller' 工具）
- 配置 `registry-mirrors` 和不安全的镜像仓库等功能
- 保障 Docker Engine 可用、且运行在 Kubernetes 之外的脚本或守护进程（例如：监视或安全代理）
- GPU 或特殊硬件，以及它们如何与你的运行时和 Kubernetes 集成

<!--
If you use Kubernetes resource requests/limits or file-based log collection
DaemonSets then they will continue to work the same, but if you've customized
your `dockerd` configuration, you’ll need to adapt that for your new container
runtime where possible.
-->
如果你只是用了 Kubernetes 资源请求/限制或基于文件的日志收集 DaemonSet，它们将继续稳定工作，
但是如果你用了自定义了 dockerd 配置，则可能需要为新的容器运行时做一些适配工作。

<!--
Another thing to look out for is anything expecting to run for system maintenance
or nested inside a container when building images will no longer work. For the
former, you can use the [`crictl`][cr] tool as a drop-in replacement (see
[mapping from docker cli to crictl](https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/#mapping-from-docker-cli-to-crictl))
and for the latter you can use newer container build options like [img], [buildah],
[kaniko], or [buildkit-cli-for-kubectl] that don’t require Docker.
-->
另外还有一个需要关注的点，那就是当创建镜像时，系统维护或嵌入容器方面的任务将无法工作。
对于前者，可以用 [`crictl`](https://github.com/kubernetes-sigs/cri-tools) 工具作为临时替代方案
(参阅[从 docker cli 到 crictl 的映射](/zh-cn/docs/tasks/debug/debug-cluster/crictl/#mapping-from-docker-cli-to-crictl))。
对于后者，可以用新的容器创建选项，例如
[img](https://github.com/genuinetools/img)、
[buildah](https://github.com/containers/buildah)、
[kaniko](https://github.com/GoogleContainerTools/kaniko) 或
[buildkit-cli-for-kubectl](https://github.com/vmware-tanzu/buildkit-cli-for-kubectl)，
他们都不需要 Docker。

<!-- 
For containerd, you can start with their [documentation] to see what configuration
options are available as you migrate things over.
-->
对于 containerd，你可查阅有关它的[文档](https://github.com/containerd/cri/blob/master/docs/registry.md)，
获取迁移时可用的配置选项。

<!--
For instructions on how to use containerd and CRI-O with Kubernetes, see the
Kubernetes documentation on [Container Runtimes].
-->
有关如何在 Kubernetes 中使用 containerd 和 CRI-O 的说明，
请参阅 [Kubernetes 相关文档](/docs/setup/production-environment/container-runtimes/)。

<!--
### What if I have more questions?
-->
### 我还有其他问题怎么办？ {#what-if-i-have-more-questions}

<!--
If you use a vendor-supported Kubernetes distribution, you can ask them about
upgrade plans for their products. For end-user questions, please post them
to our end user community forum: https://discuss.kubernetes.io/.
-->
如果你使用了供应商支持的 Kubernetes 发行版，你可以咨询供应商他们产品的升级计划。
对于最终用户的问题，请把问题发到我们的最终用户社区的[论坛](https://discuss.kubernetes.io/)。

<!--
You can discuss the decision to remove dockershim via a dedicated
[GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917).
-->
你可以通过专用 [GitHub 问题](https://github.com/kubernetes/kubernetes/issues/106917) 
讨论删除 dockershim 的决定。

<!--
You can also check out the excellent blog post
[Wait, Docker is deprecated in Kubernetes now?][dep] a more in-depth technical
discussion of the changes.
-->
你也可以看看这篇优秀的博客文章：[等等，Docker 被 Kubernetes 弃用了?](https://dev.to/inductor/wait-docker-is-deprecated-in-kubernetes-now-what-do-i-do-e4m)
对这些变化进行更深入的技术讨论。

<!--
### Is there any tooling that can help me find dockershim in use?
-->
### 是否有任何工具可以帮助我找到正在使用的 dockershim？ {#is-there-any-tooling-that-can-help-me-find-dockershim-in-use}

<!--
Yes! The [Detector for Docker Socket (DDS)][dds] is a kubectl plugin that you can
install and then use to check your cluster. DDS can detect if active Kubernetes workloads
are mounting the Docker Engine socket (`docker.sock`) as a volume.
Find more details and usage patterns in the DDS project's [README][dds].
-->
是的！ [Docker Socket 检测器 (DDS)][dds] 是一个 kubectl 插件，
你可以安装它用于检查你的集群。 DDS 可以检测运行中的 Kubernetes
工作负载是否将 Docker Engine 套接字 (`docker.sock`) 作为卷挂载。
在 DDS 项目的 [README][dds] 中查找更多详细信息和使用方法。

[dds]: https://github.com/aws-containers/kubectl-detector-for-docker-socket

<!--
### Can I have a hug?
-->
### 我可以加入吗？ {#can-i-have-a-hug}

<!--
Yes, we're still giving hugs as requested. 🤗🤗🤗
-->
当然，只要你愿意，随时随地欢迎。🤗🤗🤗