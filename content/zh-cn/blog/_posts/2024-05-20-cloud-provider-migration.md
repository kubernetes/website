---
layout: blog
title: '完成 Kubernetes 史上最大规模迁移'
date: 2024-05-20
slug: completing-cloud-provider-migration
author: >
  Andrew Sy Kim (Google),
  Michelle Au (Google),
  Walter Fender (Google),
  Michael McCune (Red Hat)
translator: >
  Xin Li (DaoCloud)
---

<!--
layout: blog
title: 'Completing the largest migration in Kubernetes history'
date: 2024-05-20
slug: completing-cloud-provider-migration
author: >
  Andrew Sy Kim (Google),
  Michelle Au (Google),
  Walter Fender (Google),
  Michael McCune (Red Hat)
-->

<!--
Since as early as Kubernetes v1.7, the Kubernetes project has pursued the ambitious goal of removing built-in cloud provider integrations ([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)).
While these integrations were instrumental in Kubernetes' early development and growth, their removal was driven by two key factors:
the growing complexity of maintaining native support for every cloud provider across millions of lines of Go code, and the desire to establish
Kubernetes as a truly vendor-neutral platform.
-->
早自 Kubernetes v1.7 起，Kubernetes 项目就开始追求取消集成内置云驱动
（[KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)）。
虽然这些集成对于 Kubernetes 的早期发展和增长发挥了重要作用，但它们的移除是由两个关键因素驱动的：
为各云启动维护数百万行 Go 代码的原生支持所带来的日趋增长的复杂度，以及将 Kubernetes 打造为真正的供应商中立平台的愿景。

<!--
After many releases, we're thrilled to announce that all cloud provider integrations have been successfully migrated from the core Kubernetes repository to external plugins.
In addition to achieving our initial objectives, we've also significantly streamlined Kubernetes by removing roughly 1.5 million lines of code and reducing the binary sizes of core components by approximately 40%.
-->
历经很多发布版本之后，我们很高兴地宣布所有云驱动集成组件已被成功地从核心 Kubernetes 仓库迁移到外部插件中。
除了实现我们最初的目标之外，我们还通过删除大约 150 万行代码，将核心组件的可执行文件大小减少了大约 40%，
极大简化了 Kubernetes。

<!--
This migration was a complex and long-running effort due to the numerous impacted components and the critical code paths that relied on the built-in integrations for the
five initial cloud providers: Google Cloud, AWS, Azure, OpenStack, and vSphere. To successfully complete this migration, we had to build four new subsystems from the ground up:
-->
由于受影响的组件众多，而且关键代码路径依赖于五个初始云驱动（Google Cloud、AWS、Azure、OpenStack 和 vSphere）
的内置集成，因此此次迁移是一项复杂且耗时的工作。
为了成功完成此迁移，我们必须从头开始构建四个新的子系统：

<!--
1. **Cloud controller manager** ([KEP-2392](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2392-cloud-controller-manager/README.md))
1. **API server network proxy** ([KEP-1281](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy))
1. **kubelet credential provider plugins** ([KEP-2133](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers))
1. **Storage migration to use [CSI](https://github.com/container-storage-interface/spec?tab=readme-ov-file#container-storage-interface-csi-specification-)** ([KEP-625](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md))
-->
1. **云控制器管理器（Cloud controller manager）**（[KEP-2392](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2392-cloud-controller-manager/README.md)）
1. **API 服务器网络代理**（[KEP-1281](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy)）
1. **kubelet 凭证提供程序插件**（[KEP-2133](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers)）
1. **存储迁移以使用 [CSI](https://github.com/container-storage-interface/spec?tab=readme-ov-file#container-storage-interface-csi-specification-)**（[KEP-625](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md)）

<!--
Each subsystem was critical to achieve full feature parity with built-in capabilities and required several releases to bring each subsystem to GA-level maturity with a safe and
reliable migration path. More on each subsystem below.
-->
就与内置功能实现完全的特性等价而言，每个子系统都至关重要，
并且需要迭代多个版本才能使每个子系统达到 GA 级别并具有安全可靠的迁移路径。
下面详细介绍每个子系统。

<!--
### Cloud controller manager

The cloud controller manager was the first external component introduced in this effort, replacing functionality within the kube-controller-manager and kubelet that directly interacted with cloud APIs.
This essential component is responsible for initializing nodes by applying metadata labels that indicate the cloud region and zone a Node is running on, as well as IP addresses that are only known to the cloud provider.
Additionally, it runs the service controller, which is responsible for provisioning cloud load balancers for Services of type LoadBalancer.
-->
### 云控制器管理器

云控制器管理器是这项工作中引入的第一个外部组件，取代了 kube-controller-manager 和 kubelet 中直接与云 API 交互的功能。
这个基本组件负责通过施加元数据标签来初始化节点。所施加的元数据标签标示节点运行所在的云区域和可用区，
以及只有云驱动知道的 IP 地址。
此外，它还运行服务控制器，该控制器负责为 LoadBalancer 类型的 Service 配置云负载均衡器。

![Kubernetes 组件](/images/docs/components-of-kubernetes.svg)

<!--
To learn more, read [Cloud Controller Manager](/docs/concepts/architecture/cloud-controller/) in the Kubernetes documentation.
-->
要进一步了解相关信息，请阅读 Kubernetes 文档中的[云控制器管理器](/zh-cn/docs/concepts/architecture/cloud-controller/)。

<!--
### API server network proxy

The API Server Network Proxy project, initiated in 2018 in collaboration with SIG API Machinery, aimed to replace the SSH tunneler functionality within the kube-apiserver.
This tunneler had been used to securely proxy traffic between the Kubernetes control plane and nodes, but it heavily relied on provider-specific implementation details embedded in the kube-apiserver to establish these SSH tunnels.
-->
### API 服务器网络代理

API 服务器网络代理项目于 2018 年与 SIG API Machinery 合作启动，旨在取代 kube-apiserver 中的 SSH 隧道功能。
该隧道器原用于安全地代理 Kubernetes 控制平面和节点之间的流量，但它重度依赖于
kube-apiserver 中所嵌入的、特定于提供商的实现细节来建立这些 SSH 隧道。

<!--
Now, the API Server Network Proxy is a GA-level extension point within the kube-apiserver. It offers a generic proxying mechanism that can route traffic from the API server to nodes through a secure proxy,
eliminating the need for the API server to have any knowledge of the specific cloud provider it is running on. This project also introduced the Konnectivity project, which has seen growing adoption in production environments.
-->
现在，API 服务器网络代理成为 kube-apiserver 中 GA 级别的扩展点。
提供了一种通用代理机制，可以通过一个安全的代理将流量从 API 服务器路由到节点，
从而使 API 服务器无需了解其运行所在的特定云驱动。
此项目还引入了 Konnectivity 项目，该项目在生产环境中的采用越来越多。

<!--
You can learn more about the API Server Network Proxy from its [README](https://github.com/kubernetes-sigs/apiserver-network-proxy#readme).
-->
你可以在其 [README](https://github.com/kubernetes-sigs/apiserver-network-proxy#readme)
中了解有关 API 服务器网络代理的更多信息。

<!--
### Credential provider plugins for the kubelet

The Kubelet credential provider plugin was developed to replace the kubelet's built-in functionality for dynamically fetching credentials for image registries hosted on Google Cloud, AWS, or Azure.
The legacy capability was convenient as it allowed the kubelet to seamlessly retrieve short-lived tokens for pulling images from GCR, ECR, or ACR. However, like other areas of Kubernetes, supporting
this required the kubelet to have specific knowledge of different cloud environments and APIs.
-->
### kubelet 的凭据提供程序插件

kubelet 凭据提供程序插件的开发是为了取代 kubelet 的内置功能，用于动态获取用于托管在
Google Cloud、AWS 或 Azure 上的镜像仓库的凭据。
原来所实现的功能很方便，因为它允许 kubelet 无缝地获取短期令牌以从 GCR、ECR 或 ACR 拉取镜像
然而，与 Kubernetes 的其他领域一样，支持这一点需要 kubelet 具有不同云环境和 API 的特定知识。

<!--
Introduced in 2019, the credential provider plugin mechanism offers a generic extension point for the kubelet to execute plugin binaries that dynamically provide credentials for images hosted on various clouds.
This extensibility expands the kubelet's capabilities to fetch short-lived tokens beyond the initial three cloud providers.
-->
凭据驱动插件机制于 2019 年推出，为 kubelet 提供了一个通用扩展点用于执行插件的可执行文件，
进而为访问各种云上托管的镜像动态提供凭据。
可扩展性扩展了 kubelet 获取短期令牌的能力，且不受限于最初的三个云驱动。

<!--
To learn more, read [kubelet credential provider for authenticated image pulls](/docs/concepts/containers/images/#kubelet-credential-provider).
-->
要了解更多信息，请阅读[用于认证镜像拉取的 kubelet 凭据提供程序](/zh-cn/docs/concepts/containers/images/#kubelet-credential-provider)。

<!--
### Storage plugin migration from in-tree to CSI

The Container Storage Interface (CSI) is a control plane standard for managing block and file storage systems in Kubernetes and other container orchestrators that went GA in 1.13.
It was designed to replace the in-tree volume plugins built directly into Kubernetes with drivers that can run as Pods within the Kubernetes cluster.
These drivers communicate with kube-controller-manager storage controllers via the Kubernetes API, and with kubelet through a local gRPC endpoint.
Now there are over 100 CSI drivers available across all major cloud and storage vendors, making stateful workloads in Kubernetes a reality.
-->
### 存储插件从树内迁移到 CSI

容器存储接口（Container Storage Interface，CSI）是一种控制平面标准，用于管理 Kubernetes
和其他容器编排系统中的块和文件存储系统，已在 1.13 中进入正式发布状态。
它的设计目标是用可在 Kubernetes 集群中 Pod 内运行的驱动程序替换直接内置于 Kubernetes 中的树内卷插件。
这些驱动程序通过 Kubernetes API 与 kube-controller-manager 存储控制器通信，并通过本地 gRPC 端点与 kubelet 进行通信。
现在，所有主要云和存储供应商一起提供了 100 多个 CSI 驱动，使 Kubernetes 中运行有状态工作负载成为现实。

<!--
However, a major challenge remained on how to handle all the existing users of in-tree volume APIs. To retain API backwards compatibility,
we built an API translation layer into our controllers that will convert the in-tree volume API into the equivalent CSI API. This allowed us to redirect all storage operations to the CSI driver,
paving the way for us to remove the code for the built-in volume plugins without removing the API.
-->
然而，如何处理树内卷 API 的所有现有用户仍然是一个重大挑战。
为了保持 API 向后兼容性，我们在控制器中构建了一个 API 转换层，把树内卷 API 转换为等效的 CSI API。
这使我们能够将所有存储操作重定向到 CSI 驱动程序，为我们在不删除 API 的情况下删除内置卷插件的代码铺平了道路。

<!--
You can learn more about In-tree Storage migration in [Kubernetes In-Tree to CSI Volume Migration Moves to Beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/).
-->
你可以在 [Kubernetes 树内卷到 CSI 卷的迁移进入 Beta 阶段](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/)。

<!--
## What's next?

This migration has been the primary focus for SIG Cloud Provider over the past few years. With this significant milestone achieved, we will be shifting our efforts towards exploring new
and innovative ways for Kubernetes to better integrate with cloud providers, leveraging the external subsystems we've built over the years. This includes making Kubernetes smarter in
hybrid environments where nodes in the cluster can run on both public and private clouds, as well as providing better tools and frameworks for developers of external providers to simplify and streamline their integration efforts.
-->
## 下一步是什么？

过去几年，这一迁移工程一直是 SIG Cloud Provider 的主要关注点。
随着这一重要里程碑的实现，我们将把努力转向探索新的创新方法，让 Kubernetes 更好地与云驱动集成，利用我们多年来构建的外部子系统。
这包括使 Kubernetes 在混合环境中变得更加智能，其集群中的节点可以运行在公共云和私有云上，
以及为外部驱动的开发人员提供更好的工具和框架，以简化他们的集成工作，提高效率。

<!--
With all the new features, tools, and frameworks being planned, SIG Cloud Provider is not forgetting about the other side of the equation: testing. Another area of focus for the SIG's future activities is the improvement of
cloud controller testing to include more providers. The ultimate goal of this effort being to create a testing framework that will include as many providers as possible so that we give the Kubernetes community the highest
levels of confidence about their Kubernetes environments.
-->
在规划所有这些新特性、工具和框架的同时，SIG Cloud Provider 并没有忘记另一项同样重要的工作：测试。
SIG 未来活动的另一个重点领域是改进云控制器测试以涵盖更多的驱动。
这项工作的最终目标是创建一个包含尽可能多驱动的测试框架，以便我们让 Kubernetes 社区对其 Kubernetes 环境充满信心。

<!--
If you're using a version of Kubernetes older than v1.29 and haven't migrated to an external cloud provider yet, we recommend checking out our previous blog post [Kubernetes 1.29: Cloud Provider Integrations Are Now Separate Components](/blog/2023/12/14/cloud-provider-integration-changes/).
It provides detailed information on the changes we've made and offers guidance on how to migrate to an external provider.
Starting in v1.31, in-tree cloud providers will be permanently disabled and removed from core Kubernetes components.
-->
如果你使用的 Kubernetes 版本早于 v1.29 并且尚未迁移到外部云驱动，我们建议你查阅我们之前的博客文章
[Kubernetes 1.29：云驱动集成现在是单独的组件](/zh-cn/blog/2023/12/14/cloud-provider-integration-changes/)。
该博客包含与我们所作的变更相关的详细信息，并提供了有关如何迁移到外部驱动的指导。
从 v1.31 开始，树内云驱动将被永久禁用并从核心 Kubernetes 组件中删除。

<!--
If you’re interested in contributing, come join our [bi-weekly SIG meetings](https://github.com/kubernetes/community/tree/master/sig-cloud-provider#meetings)!
-->
如果你有兴趣做出贡献，请参加我们的[每两周一次的 SIG 会议](https://github.com/kubernetes/community/tree/master/sig-cloud-provider#meetings)!
