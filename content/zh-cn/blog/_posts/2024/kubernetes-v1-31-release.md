---
layout: blog
title: 'Kubernetes v1.31: Elli'
date: 2024-08-13
slug: kubernetes-v1-31-release
author: >
  [Kubernetes v1.31 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)
translator: >
  [RifeWang](https://github.com/RifeWang)
---
<!--
---
layout: blog
title: 'Kubernetes v1.31: Elli'
date: 2024-08-13
slug: kubernetes-v1-31-release
author: >
  [Kubernetes v1.31 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)
---
-->

<!--
**Editors:** Matteo Bianchi, Yigit Demirbas, Abigail McCarthy, Edith Puclla, Rashan Smith

Announcing the release of Kubernetes v1.31: Elli!

Similar to previous releases, the release of Kubernetes v1.31 introduces new
stable, beta, and alpha features. 
The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.
This release consists of 45 enhancements.
Of those enhancements, 11 have graduated to Stable, 22 are entering Beta, 
and 12 have graduated to Alpha.
-->

**编辑:** Matteo Bianchi, Yigit Demirbas, Abigail McCarthy, Edith Puclla, Rashan Smith

Kubernetes v1.31：Elli 宣布发布！

与之前的版本类似，Kubernetes v1.31 的发布中引入了新的稳定版、Beta 版和 Alpha 特性功能。
持续提供高质量的版本彰显了我们开发周期的强劲实力以及社区的大力支持。
此版本包含 45 项增强功能。
在这些增强功能中，11 项已升级到稳定版，22 项正在进入 Beta 版，12 项已升级到 Alpha 版。


<!--
## Release theme and logo
-->
## 发布主题和 logo
{{< figure src="/images/blog/2024-08-13-kubernetes-1.31-release/k8s-1.31.png" alt="Kubernetes v1.31 Elli logo" class="release-logo" >}}

<!--
The Kubernetes v1.31 Release Theme is "Elli".

Kubernetes v1.31's Elli is a cute and joyful dog, with a heart of gold and a nice sailor's cap, as a playful wink to the huge and diverse family of Kubernetes contributors.
-->
Kubernetes v1.31 的发布主题是 "Elli"。

Kubernetes v1.31 的 Elli 是一只可爱欢快的小狗，戴着一顶漂亮的水手帽，这是对庞大而多样化的 Kubernetes 贡献者家族的一个俏皮致意。

<!--
Kubernetes v1.31 marks the first release after the project has successfully celebrated [its first 10 years](/blog/2024/06/06/10-years-of-kubernetes/). 
Kubernetes has come a very long way since its inception, and it's still moving towards exciting new directions with each release. 
After 10 years, it is awe-inspiring to reflect on the effort, dedication, skill, wit and tiring work of the countless Kubernetes contributors who have made this a reality.
-->

Kubernetes v1.31 标志着该项目成功庆祝其[诞生十周年](/blog/2024/06/06/10-years-of-kubernetes/)后的首次发布。
自诞生以来，Kubernetes 已经走过了漫长的道路，并且每次发布都在朝着令人兴奋的新方向前进。
十年后，回顾无数 Kubernetes 贡献者为实现这一目标所付出的努力、奉献、技能、智慧和辛勤工作，令人敬畏。

<!--
And yet, despite the herculean effort needed to run the project, there is no shortage of people who show up, time and again, with enthusiasm, smiles and a sense of pride for contributing and being part of the community. 
This "spirit" that we see from new and old contributors alike is the sign of a vibrant community, a "joyful" community, if we might call it that.
-->
还有，尽管运营项目需要付出巨大的努力，仍然有大量的人不断以热情、微笑和自豪感出现，为社区做出贡献并成为其中的一员。
我们从新老贡献者那里看到的这种"精神"是一个充满活力的社区的标志，我们可以称之为"欢乐"的社区。

<!--
Kubernetes v1.31's Elli is all about celebrating this wonderful spirit! Here's to the next decade of Kubernetes!
-->
Kubernetes v1.31 的 Elli 就是为了庆祝这种美好的精神!让我们为 Kubernetes 的下一个十年干杯!

<!--
## Highlights of features graduating to Stable

_This is a selection of some of the improvements that are now stable following the v1.31 release._
-->
## 晋级为稳定版的功能亮点

_以下是 v1.31 发布后晋级为稳定版的部分改进。_

<!--
### AppArmor support is now stable
-->
### AppArmor 支持现已稳定

<!--
Kubernetes support for AppArmor is now GA. Protect your containers using AppArmor by setting the `appArmorProfile.type` field in the container's `securityContext`. 
Note that before Kubernetes v1.30, AppArmor was controlled via annotations; starting in v1.30 it is controlled using fields. 
It is recommended that you should migrate away from using annotations and start using the `appArmorProfile.type` field.
-->
Kubernetes 对 AppArmor 的支持现已正式发布。通过在容器的 `securityContext` 中设置 `appArmorProfile.type` 字段，可以使用 AppArmor 保护您的容器。
请注意，在 Kubernetes v1.30 之前，AppArmor 是通过注解控制的；从 v1.30 开始，它是通过字段控制的。
建议您停止使用注解，开始使用 `appArmorProfile.type` 字段。

<!--
To learn more read the [AppArmor tutorial](/docs/tutorials/security/apparmor/). 
This work was done as a part of [KEP #24](https://github.com/kubernetes/enhancements/issues/24), by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
-->
要了解更多信息，请阅读 [AppArmor 教程](/zh-cn/docs/tutorials/security/apparmor/)。
这项工作是作为 [KEP #24](https://github.com/kubernetes/enhancements/issues/24) 的一部分由
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 完成的。

<!--
### Improved ingress connectivity reliability for kube-proxy
-->
### 改进 kube-proxy 的入站连接可靠性

<!--
Kube-proxy improved ingress connectivity reliability is stable in v1.31. 
One of the common problems with load balancers in Kubernetes is the synchronization between the different components involved to avoid traffic drop. 
This feature implements a mechanism in kube-proxy for load balancers to do connection draining for terminating Nodes exposed by services of `type: LoadBalancer` and `externalTrafficPolicy: Cluster` and establish some best practices for cloud providers and Kubernetes load balancers implementations.
-->
kube-proxy 改进的入站连接可靠性在 v1.31 中已稳定。
Kubernetes 中负载均衡器的一个常见问题是为避免流量丢失而在不同组件之间进行同步的机制。
此特性在 kube-proxy 中实现了一种机制，用于负载均衡器对 `type: LoadBalancer` 和 `externalTrafficPolicy: Cluster`
服务所公开的、进入终止进程的 Node 进行连接排空，并为云提供商和 Kubernetes 负载均衡器实现建立了一些最佳实践。

<!--
To use this feature, kube-proxy needs to run as default service proxy on the cluster and the load balancer needs to support connection draining. 
There are no specific changes required for using this feature, it has been enabled by default in kube-proxy since v1.30 and been promoted to stable in v1.31.
-->
要使用此特性，kube-proxy 需要在集群上作为默认服务代理运行，并且负载均衡器需要支持连接排空。
使用此特性不需要进行特定的更改，它自 v1.30 以来在 kube-proxy 中默认启用，并在 v1.31 中晋级为稳定版。

<!--
For more details about this feature please visit the [Virtual IPs and Service Proxies documentation page](/docs/reference/networking/virtual-ips/#external-traffic-policy).
-->
有关此特性的更多详细信息，请访问[虚拟 IP 和服务代理文档页面](/zh-cn/docs/reference/networking/virtual-ips/#external-traffic-policy)。

<!--
This work was done as part of [KEP #3836](https://github.com/kubernetes/enhancements/issues/3836) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
这项工作是作为 [KEP #3836](https://github.com/kubernetes/enhancements/issues/3836) 的一部分由
[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 完成的。
    

<!--
### Persistent Volume last phase transition time
-->
### 持久卷最近阶段转换时间

<!--
Persistent Volume last phase transition time feature moved to GA in v1.31. 
This feature adds a `PersistentVolumeStatus` field which holds a timestamp of when a PersistentVolume last transitioned to a different phase.
With this feature enabled, every PersistentVolume object will have a new field `.status.lastTransitionTime`, that holds a timestamp of
when the volume last transitioned its phase. 
This change is not immediate; the new field will be populated whenever a PersistentVolume is updated and first transitions between phases (`Pending`, `Bound`, or `Released`) after upgrading to Kubernetes v1.31.
This allows you to measure time between when a PersistentVolume moves from `Pending` to `Bound`. This can be also useful for providing metrics and SLOs.
-->
持久卷最近阶段转换时间功能在 v1.31 中晋级为正式版（GA）。
此特性添加了一个 `PersistentVolumeStatus` 字段，用于保存 PersistentVolume 最近转换到不同阶段的时间戳。
启用此特性后，每个 PersistentVolume 对象将有一个新字段 `.status.lastTransitionTime` 保存卷最近转换阶段的时间戳。
这种变化并不是立即的；新字段将在 PersistentVolume 更新并在升级到 Kubernetes v1.31 后首次在各阶段（`Pending`、`Bound` 或 `Released`）之间转换时填充。
这允许您测量 PersistentVolume 从 `Pending` 移动到 `Bound` 之间的时间。这对于提供指标和 SLO 也很有用。

<!--
For more details about this feature please visit the [PersistentVolume documentation page](/docs/concepts/storage/persistent-volumes/).
-->
有关此特性的更多详细信息，请访问 [PersistentVolume 文档页面](/zh-cn/docs/concepts/storage/persistent-volumes/)。

<!--

his work was done as a part of [KEP #3762](https://github.com/kubernetes/enhancements/issues/3762) by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
这项工作是作为 [KEP #3762](https://github.com/kubernetes/enhancements/issues/3762) 的一部分由
[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 完成的。


<!--
## Highlights of features graduating to Beta
-->
## 晋级为 Beta 版的功能亮点

<!--
_This is a selection of some of the improvements that are now beta following the v1.31 release._
-->
_以下是 v1.31 发布后晋级为 Beta 版的部分改进。_
    
<!--
### nftables backend for kube-proxy
-->
### kube-proxy 的 nftables 后端

<!--
The nftables backend moves to beta in v1.31, behind the `NFTablesProxyMode` feature gate which is now enabled by default.
-->
nftables 后端在 v1.31 中晋级为 Beta 版，由 `NFTablesProxyMode` 特性门控控制，现在默认启用。

<!--
The nftables API is the successor to the iptables API and is designed to provide better performance and scalability than iptables. 
The `nftables` proxy mode is able to process changes to service endpoints faster and more efficiently than the `iptables` mode, and is also able to more efficiently process packets in the kernel (though this only
becomes noticeable in clusters with tens of thousands of services).
-->
nftables API 是 iptables API 的继任者，旨在提供比 iptables 更好的性能和可扩展性。
`nftables` 代理模式能够比 `iptables` 模式更快、更高效地处理服务端点的变化，并且在内核中也能更高效地处理数据包（尽管这只有在拥有数万个服务的集群中才会显著）。

<!--
As of Kubernetes v1.31, the `nftables` mode is still relatively new, and may not be compatible with all network plugins; consult the documentation for your network plugin. 
This proxy mode is only available on Linux nodes, and requires kernel 5.13 or later.
Before migrating, note that some features, especially around NodePort services, are not implemented exactly the same in nftables mode as they are in iptables mode. 
Check the [migration guide](/docs/reference/networking/virtual-ips/#migrating-from-iptables-mode-to-nftables) to see if you need to override the default configuration.
-->
截至 Kubernetes v1.31，nftables 模式仍相对较新，可能与某些网络插件不兼容；请查阅您的网络插件文档。
此代理模式仅在 Linux 节点上可用，并且需要内核 5.13 或更高版本。
在迁移之前，请注意某些功能，特别是与 NodePort 服务相关的功能，在 nftables 模式下的实现方式与 iptables 模式不完全相同。
查看[迁移指南](/zh-cn/docs/reference/networking/virtual-ips/#migrating-from-iptables-mode-to-nftables)以了解是否需要覆盖默认配置。

<!--
This work was done as part of [KEP #3866](https://github.com/kubernetes/enhancements/issues/3866) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
这项工作是作为 [KEP #3866](https://github.com/kubernetes/enhancements/issues/3866) 的一部分由
[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 完成的。

<!--
### Changes to reclaim policy for PersistentVolumes
-->
### PersistentVolumes 回收策略的变更

<!--
The Always Honor PersistentVolume Reclaim Policy feature has advanced to beta in Kubernetes v1.31. 
This enhancement ensures that the PersistentVolume (PV) reclaim policy is respected even after the associated PersistentVolumeClaim (PVC) is deleted, thereby preventing the leakage of volumes.
-->
始终遵循 PersistentVolume 回收策略这一特性在 Kubernetes v1.31 中晋级为 Beta 版。
这项增强确保即使在所关联的 PersistentVolumeClaim (PVC) 被删除后，PersistentVolume (PV) 回收策略也会被遵循，从而防止卷的泄漏。

<!--
Prior to this feature, the reclaim policy linked to a PV could be disregarded under specific conditions, depending on whether the PV or PVC was deleted first. 
Consequently, the corresponding storage resource in the external infrastructure might not be removed, even if the reclaim policy was set to "Delete". 
This led to potential inconsistencies and resource leaks.
-->
在此特性之前，与 PV 相关联的回收策略可能在特定条件下被忽视，这取决于 PV 或 PVC 是否先被删除。
因此，即使回收策略设置为 "Delete"，外部基础设施中相应的存储资源也可能不会被删除。
这导致了潜在的不一致性和资源泄漏。

<!--
With the introduction of this feature, Kubernetes now guarantees that the "Delete" reclaim policy will be enforced, ensuring the deletion of the underlying storage object from the backend infrastructure, regardless of the deletion sequence of the PV and PVC.
-->
随着这项功能的引入，Kubernetes 现在保证 "Delete" 回收策略将被执行，确保底层存储对象从后端基础设施中删除，无论 PV 和 PVC 的删除顺序如何。

<!--
This work was done as a part of [KEP #2644](https://github.com/kubernetes/enhancements/issues/2644) and by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
这项工作是作为 [KEP #2644](https://github.com/kubernetes/enhancements/issues/2644) 的一部分由
[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 完成的。
    
<!--
### Bound service account token improvements
-->
### 绑定服务账户令牌的改进

<!--
The `ServiceAccountTokenNodeBinding` feature is promoted to beta in v1.31. 
This feature allows requesting a token bound only to a node, not to a pod, which includes node information in claims in the token and validates the existence of the node when the token is used. 
For more information, read the [bound service account tokens documentation](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-tokens).
-->
`ServiceAccountTokenNodeBinding` 功能在 v1.31 中晋级为 Beta 版。
此特性允许请求仅绑定到节点而不是 Pod 的令牌，在令牌中包含节点信息的声明，并在使用令牌时验证节点的存在。
有关更多信息，请阅读[绑定服务账户令牌文档](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-tokens)。

<!--
This work was done as part of [KEP #4193](https://github.com/kubernetes/enhancements/issues/4193) by [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).
-->
这项工作是作为 [KEP #4193](https://github.com/kubernetes/enhancements/issues/4193) 的一部分由
[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth) 完成的。


<!--
### Multiple Service CIDRs
-->
### 多个 Service CIDR

<!--
Support for clusters with multiple Service CIDRs moves to beta in v1.31 (disabled by default).
-->
支持具有多个服务 CIDR 的集群在 v1.31 中晋级为 Beta 版(默认禁用)。

<!--
There are multiple components in a Kubernetes cluster that consume IP addresses: Nodes, Pods and Services. 
Nodes and Pods IP ranges can be dynamically changed because depend on the infrastructure or the network plugin respectively. 
However, Services IP ranges are defined during the cluster creation as a hardcoded flag in the kube-apiserver. 
IP exhaustion has been a problem for long lived or large clusters, as admins needed to expand, shrink or even replace entirely the assigned Service CIDR range. 
These operations were never supported natively and were performed via complex and delicate maintenance operations, often causing downtime on their clusters. This new feature allows users and cluster admins to dynamically modify Service CIDR ranges with zero downtime.
-->
Kubernetes 集群中有多个组件消耗 IP 地址: Node、Pod 和 Service。
Node 和 Pod 的 IP 范围可以动态更改，因为它们分别取决于基础设施或网络插件。
然而，Service IP 范围是在集群创建期间作为 kube-apiserver 中的硬编码标志定义的。
IP 耗尽一直是长期存在或大型集群的问题，因为管理员需要扩展、缩小甚至完全替换分配的服务 CIDR 范围。
这些操作从未得到原生支持，并且是通过复杂和精细的维护操作执行的，经常导致集群无法正常服务。
这个新特性允许用户和集群管理员以零中断时间动态修改服务 CIDR 范围。

<!--
For more details about this feature please visit the
[Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/#ip-address-objects) documentation page.
-->
有关此特性的更多详细信息，请访问[虚拟 IP 和服务代理](/zh-cn/docs/reference/networking/virtual-ips/#ip-address-objects)文档页面。

<!--
This work was done as part of [KEP #1880](https://github.com/kubernetes/enhancements/issues/1880) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
这项工作是作为 [KEP #1880](https://github.com/kubernetes/enhancements/issues/1880) 的一部分由
[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 完成的。


<!--
### Traffic distribution for Services
-->
### Service 的流量分配

<!--
Traffic distribution for Services moves to beta in v1.31 and is enabled by default. 
-->
Service 的流量分配在 v1.31 中晋级为 Beta 版，并默认启用。

<!--
After several iterations on finding the best user experience and traffic engineering capabilities for Services networking, SIG Networking implemented the `trafficDistribution` field in the Service specification, which serves as a guideline for the underlying implementation to consider while making routing decisions.
-->
为实现 Service 联网的最佳用户体验和流量工程能力，经过多次迭代后，SIG Networking 在服务规约中实现了
`trafficDistribution` 字段，作为底层实现在做出路由决策时考虑的指导原则。

<!--
For more details about this feature please read the
[1.30 Release Blog](/blog/2024/04/17/kubernetes-v1-30-release/#traffic-distribution-for-services-sig-network-https-github-com-kubernetes-community-tree-master-sig-network)
or visit the [Service](/docs/concepts/services-networking/service/#traffic-distribution) documentation page.
-->
有关此特性的更多详细信息，请阅读 [1.30 发布博客](/blog/2024/04/17/kubernetes-v1-30-release/#traffic-distribution-for-services-sig-network-https-github-com-kubernetes-community-tree-master-sig-network) 或访问 [Service](/zh-cn/docs/concepts/services-networking/service/#traffic-distribution) 文档页面。

<!--
This work was done as part of [KEP #4444](https://github.com/kubernetes/enhancements/issues/4444) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
这项工作是作为 [KEP #4444](https://github.com/kubernetes/enhancements/issues/4444) 的一部分由
[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 完成的。


<!--
### Kubernetes VolumeAttributesClass ModifyVolume
-->
### Kubernetes VolumeAttributesClass ModifyVolume

<!--
[VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/) API is moving to beta in v1.31.
The VolumeAttributesClass provides a generic,
Kubernetes-native API for modifying dynamically volume parameters like provisioned IO.
This allows workloads to vertically scale their volumes on-line to balance cost and performance, if supported by their provider.
This feature had been alpha since Kubernetes 1.29.
-->
[VolumeAttributesClass](/zh-cn/docs/concepts/storage/volume-attributes-classes/) API 在 v1.31 中晋级为 Beta 版。
VolumeAttributesClass 提供了一个通用的、Kubernetes 原生的 API，用于修改动态卷参数，如所提供的 IO 能力。
这允许工作负载在线垂直扩展其卷，以平衡成本和性能（如果提供商支持）。
该功能自 Kubernetes 1.29 以来一直处于 Alpha 状态。

<!--
This work was done as a part of [KEP #3751](https://github.com/kubernetes/enhancements/issues/3751) and lead by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
这项工作是作为 [KEP #3751](https://github.com/kubernetes/enhancements/issues/3751) 的一部分完成的，由 [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 领导。


<!--
## New features in Alpha
-->
## Alpha 版的新功能

<!--
_This is a selection of some of the improvements that are now alpha following the v1.31 release._
-->
_以下是 v1.31 发布后晋级为 Alpha 版的部分改进。_
    
<!--
### New DRA APIs for better accelerators and other hardware management
-->
### 用于更好管理加速器和其他硬件的新 DRA API

<!--
Kubernetes v1.31 brings an updated dynamic resource allocation (DRA) API and design. 
The main focus in the update is on structured parameters because they make resource information and requests transparent to Kubernetes and clients and enable implementing features like cluster autoscaling. 
DRA support in the kubelet was updated such that version skew between kubelet and the control plane is possible. With structured parameters, the scheduler allocates ResourceClaims while scheduling a pod. 
Allocation by a DRA driver controller is still supported through what is now called "classic DRA".
-->
Kubernetes v1.31 带来了更新的动态资源分配（DRA）API 和设计。
此次更新的主要焦点是结构化参数，因为它们使资源信息和请求对 Kubernetes 和客户端透明，并能够实现集群自动扩缩容等功能。
kubelet 中的 DRA 支持已更新，使得 kubelet 和控制平面之间的版本偏差成为可能。通过结构化参数，调度器在调度 Pod 时分配 ResourceClaims。
通过现在称为"经典 DRA"的方式，仍然支持由 DRA 驱动程序控制器进行分配。

<!--
With Kubernetes v1.31, classic DRA has a separate feature gate named `DRAControlPlaneController`, which you need to enable explicitly. 
With such a control plane controller, a DRA driver can implement allocation policies that are not supported yet through structured parameters.
-->
从 Kubernetes v1.31 开始,经典 DRA 有一个单独的特性门控名为 `DRAControlPlaneController`，您需要显式启用它。
通过这样的控制平面控制器，DRA 驱动程序可以实现尚未通过结构化参数支持的分配策略。

<!--
This work was done as part of [KEP #3063](https://github.com/kubernetes/enhancements/issues/3063) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
-->
这项工作是作为 [KEP #3063](https://github.com/kubernetes/enhancements/issues/3063) 的一部分由
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 完成的。
    
<!--
### Support for image volumes
-->
### 对镜像卷的支持

<!--
The Kubernetes community is moving towards fulfilling more Artificial Intelligence (AI) and Machine Learning (ML) use cases in the future. 
-->
Kubernetes 社区正在朝着在未来满足更多人工智能(AI)和机器学习(ML)用例的方向发展。

<!--
One of the requirements to fulfill these use cases is to support Open Container Initiative (OCI) compatible images and artifacts (referred as OCI objects) directly as a native volume source. 
This allows users to focus on OCI standards as well as enables them to store and distribute any content using OCI registries.
-->
满足这些用例的要求之一是直接将开放容器倡议(OCI)兼容的镜像和工件(称为 OCI 对象)作为原生卷源支持。
这允许用户专注于 OCI 标准，并使他们能够使用 OCI 注册表存储和分发任何内容。

<!--
Given that, v1.31 adds a new alpha feature to allow using an OCI image as a volume in a Pod.
This feature allows users to specify an image reference as volume in a pod while reusing it as volume
mount within containers. You need to enable the `ImageVolume` feature gate to try this out.
-->
鉴于此，v1.31 添加了一个新的 Alpha 特性，允许在 Pod 中使用 OCI 镜像作为卷。
此特性允许用户在 pod 中指定镜像引用作为卷，同时在容器内重用它作为卷挂载。您需要启用 `ImageVolume` 特性门控才能尝试此特性。

<!--
This work was done as part of [KEP #4639](https://github.com/kubernetes/enhancements/issues/4639) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) and [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
这项工作是作为 [KEP #4639](https://github.com/kubernetes/enhancements/issues/4639) 的一部分由 [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 和 [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 完成的。

<!--
### Exposing device health information through Pod status
-->
### 通过 Pod 状态暴露设备健康信息

<!--
Expose device health information through the Pod Status is added as a new alpha feature in v1.31, disabled by default.
-->
通过 Pod 状态暴露设备健康信息作为新的 Alpha 特性添加到 v1.31 中，默认被禁用。

<!--
Before Kubernetes v1.31, the way to know whether or not a Pod is associated with the failed device is to use the [PodResources API](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources). 
-->
在 Kubernetes v1.31 之前，了解 Pod 是否与故障设备关联的方法是使用 [PodResources API](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。

<!--
By enabling this feature, the field `allocatedResourcesStatus` will be added to each container status, within the `.status` for each Pod. The `allocatedResourcesStatus` field reports health information for each device assigned to the container.
-->
通过启用此特性，字段 `allocatedResourcesStatus` 将添加到每个容器状态中，在每个 Pod 的 `.status` 内。
`allocatedResourcesStatus` 字段报告分配给容器的各个设备的健康信息。

<!--
This work was done as part of [KEP #4680](https://github.com/kubernetes/enhancements/issues/4680) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
-->
这项工作是作为 [KEP #4680](https://github.com/kubernetes/enhancements/issues/4680) 的一部分由
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 完成的。


<!--
### Finer-grained authorization based on selectors
-->
### 基于选择算符的细粒度鉴权

<!--
This feature allows webhook authorizers and future (but not currently designed) in-tree authorizers to
allow **list** and **watch** requests, provided those requests use label and/or field selectors.
For example, it is now possible for an authorizer to express: this user cannot list all pods, but can list all pods where `.spec.nodeName` matches some specific value. Or to allow a user to watch all Secrets in a namespace
that are _not_ labelled as `confidential: true`.
Combined with CRD field selectors (also moving to beta in v1.31), it is possible to write more secure
per-node extensions.
-->
此特性允许 Webhook 鉴权组件和未来（但目前尚未设计）的树内鉴权组件允许 **list** 和 **watch** 请求，
前提是这些请求使用标签和/或字段选择算符。
例如，现在鉴权组件可以表达：此用户不能列出所有 Pod，但可以列举所有 `.spec.nodeName` 匹配某个特定值的 Pod。
或者允许用户监视命名空间中所有**未**标记为 `confidential: true` 的 Secret。
结合 CRD 字段选择器（在 v1.31 中也晋级为 Beta 版），可以编写更安全的节点级别扩展。
    
<!--
This work was done as part of [KEP #4601](https://github.com/kubernetes/enhancements/issues/4601) by [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).
-->
这项工作是作为 [KEP #4601](https://github.com/kubernetes/enhancements/issues/4601) 的一部分由
[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth) 完成的。
    

<!--
### Restrictions on anonymous API access
-->
### 对匿名 API 访问的限制

<!--
By enabling the feature gate `AnonymousAuthConfigurableEndpoints` users can now use the authentication configuration file to configure the endpoints that can be accessed by anonymous requests. 
This allows users to protect themselves against RBAC misconfigurations that can give anonymous users broad access to the cluster.
-->
通过启用特性门控 `AnonymousAuthConfigurableEndpoints`，用户现在可以使用身份认证配置文件来配置可以通过匿名请求访问的端点。
这允许用户保护自己免受 RBAC 错误配置的影响；错误的配置可能会给匿名用户提供对集群的更多访问权限。
    
<!--
This work was done as a part of [KEP #4633](https://github.com/kubernetes/enhancements/issues/4633) and by [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).
-->
这项工作是作为 [KEP #4633](https://github.com/kubernetes/enhancements/issues/4633) 的一部分由
[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth) 完成的。


<!--
## Graduations, deprecations, and removals in 1.31
-->
## 1.31 中的晋级、弃用和移除

<!--
### Graduations to Stable
-->
### 晋级为稳定版

<!--
This lists all the features that graduated to stable (also known as _general availability_). For a full list of updates including new features and graduations from alpha to beta, see the release notes.
-->
以下列出了所有晋级为稳定版（也称为 _正式可用_ ）的功能。有关包括新功能和从 Alpha 晋级到 Beta 的完整列表，请参阅发行说明。

<!--
This release includes a total of 11 enhancements promoted to Stable:
-->
此版本包括总共 11 项晋级为稳定版的增强:

<!--
* [PersistentVolume last phase transition time](https://github.com/kubernetes/enhancements/issues/3762)
* [Metric cardinality enforcement](https://github.com/kubernetes/enhancements/issues/2305)
* [Kube-proxy improved ingress connectivity reliability](https://github.com/kubernetes/enhancements/issues/3836)
* [Add CDI devices to device plugin API](https://github.com/kubernetes/enhancements/issues/4009)
* [Move cgroup v1 support into maintenance mode](https://github.com/kubernetes/enhancements/issues/4569)
* [AppArmor support](https://github.com/kubernetes/enhancements/issues/24)
* [PodHealthyPolicy for PodDisruptionBudget](https://github.com/kubernetes/enhancements/issues/3017)
* [Retriable and non-retriable Pod failures for Jobs](https://github.com/kubernetes/enhancements/issues/3329)
* [Elastic Indexed Jobs](https://github.com/kubernetes/enhancements/issues/3715)
* [Allow StatefulSet to control start replica ordinal numbering](https://github.com/kubernetes/enhancements/issues/3335)
* [Random Pod selection on ReplicaSet downscaling](https://github.com/kubernetes/enhancements/issues/2185)
-->
* [PersistentVolume 最后阶段转换时间](https://github.com/kubernetes/enhancements/issues/3762)
* [Metric 基数强制执行](https://github.com/kubernetes/enhancements/issues/2305)
* [Kube-proxy 改进的入站连接可靠性](https://github.com/kubernetes/enhancements/issues/3836)
* [将 CDI 设备添加到设备插件 API](https://github.com/kubernetes/enhancements/issues/4009)
* [将 cgroup v1 支持移入维护模式](https://github.com/kubernetes/enhancements/issues/4569)
* [AppArmor 支持](https://github.com/kubernetes/enhancements/issues/24)
* [PodDisruptionBudget 的 PodHealthyPolicy](https://github.com/kubernetes/enhancements/issues/3017)
* [Job 的可重试和不可重试 Pod 失败](https://github.com/kubernetes/enhancements/issues/3329)
* [弹性的带索引的 Job](https://github.com/kubernetes/enhancements/issues/3715)
* [允许 StatefulSet 控制起始副本序号编号](https://github.com/kubernetes/enhancements/issues/3335)
* [ReplicaSet 缩小时随机选择 Pod](https://github.com/kubernetes/enhancements/issues/2185)
    
<!--
### Deprecations and Removals 
-->
### 弃用和移除

<!--
As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones for the project's overall health. 
See the Kubernetes [deprecation and removal policy](/docs/reference/using-api/deprecation-policy/) for more details on this process.
-->
随着 Kubernetes 的发展和成熟，某些特性可能会被弃用、移除或替换为更好的特性，以确保项目的整体健康。
有关此过程的更多详细信息，请参阅 Kubernetes [弃用和移除策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
    
<!--
#### Cgroup v1 enters the maintenance mode
-->
#### Cgroup v1 进入维护模式

<!--
As Kubernetes continues to evolve and adapt to the changing landscape of container orchestration, the community has decided to move cgroup v1 support into maintenance mode in v1.31.
This shift aligns with the broader industry's move towards [cgroup v2](/docs/concepts/architecture/cgroups/), offering improved functionality, scalability, and a more consistent interface. 
Kubernetes maintance mode means that no new features will be added to cgroup v1 support. 
Critical security fixes will still be provided, however, bug-fixing is now best-effort, meaning major bugs may be fixed if feasible, but some issues might remain unresolved.
-->
随着 Kubernetes 继续发展并适应容器编排不断变化的格局，社区决定在 v1.31 中将 cgroup v1 支持移入维护模式。
这一转变与行业中普遍向 [cgroup v2](/zh-cn/docs/concepts/architecture/cgroups/) 迁移的趋势一致，
提供了改进的功能、可扩展性和更一致的接口。
Kubernetes 维护模式意味着不会向 cgroup v1 支持添加新功能。
社区仍将提供关键的安全修复，但是，错误修复现在是尽力而为。
这意味着如果可行，可能会修复重大错误，但某些问题可能保持未解决状态。

<!--
It is recommended that you start switching to use cgroup v2 as soon as possible. 
This transition depends on your architecture, including ensuring the underlying operating systems and container runtimes support cgroup v2 and testing workloads to verify that workloads and applications function correctly with cgroup v2.
-->
建议您尽快开始切换到使用 cgroup v2。
这种转变取决于您的架构，包括确保底层操作系统和容器运行时支持 cgroup v2，以及测试工作负载以验证工作负载和应用程序在 cgroup v2 下是否正常运行。

<!--
Please report any problems you encounter by filing an [issue](https://github.com/kubernetes/kubernetes/issues/new/choose).
-->
如果遇到任何问题,请通过提交 [issue](https://github.com/kubernetes/kubernetes/issues/new/choose) 进行报告。

<!--
This work was done as part of [KEP #4569](https://github.com/kubernetes/enhancements/issues/4569) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
-->
这项工作是作为 [KEP #4569](https://github.com/kubernetes/enhancements/issues/4569) 的一部分由
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 完成的。

<!--
#### A note about SHA-1 signature support
-->
#### 关于 SHA-1 签名支持的说明

<!--
In [go1.18](https://go.dev/doc/go1.18#sha1) (released in March 2022), the crypto/x509 library started to reject certificates signed with a SHA-1 hash function. 
While SHA-1 is established to be unsafe and publicly trusted Certificate Authorities have not issued SHA-1 certificates since 2015, there might still be cases in the context of Kubernetes where user-provided certificates are signed using a SHA-1 hash function through private authorities with them being used for Aggregated API Servers or webhooks. 
If you have relied on SHA-1 based certificates, you must explicitly opt back into its support by setting `GODEBUG=x509sha1=1` in your environment.
-->
在 [go1.18](https://go.dev/doc/go1.18#sha1)（2022 年 3 月发布）中，crypto/x509 库开始拒绝使用 SHA-1 哈希函数签名的证书。
虽然 SHA-1 已被确定为不安全，并且公共信任的证书颁发机构自 2015 年以来就不再颁发 SHA-1 证书，
但在 Kubernetes 语境中可能仍然存在用户提供的证书通过私有机构使用 SHA-1 哈希函数签名的情况，
这些证书用于聚合 API 服务器或 Webhook。
如果您依赖基于 SHA-1 的证书，必须通过在环境变量中设置 `GODEBUG=x509sha1=1` 来明确选择重新启用其支持。

<!--
Given Go's [compatibility policy for GODEBUGs](https://go.dev/blog/compat), the `x509sha1` GODEBUG and the support for SHA-1 certificates will [fully go away in go1.24](https://tip.golang.org/doc/go1.23) which will be released in the first half of 2025. 
If you rely on SHA-1 certificates, please start moving off them.
-->
鉴于 Go 的 [GODEBUG 兼容性策略](https://go.dev/blog/compat)，`x509sha1` GODEBUG 和对 SHA-1
证书的支持[将在 go1.24 中完全消失](https://tip.golang.org/doc/go1.23)，
而 go1.24 将在 2025 年上半年发布。
如果您依赖 SHA-1 证书,请开始迁移离开它们。

<!--
Please see [Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689) to get a better idea of timelines around the support for SHA-1 going away, when Kubernetes releases plans to adopt go1.24, and for more details on how to detect usage of SHA-1 certificates via metrics and audit logging. 
-->
请查看 [Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689)
以了解有关 SHA-1 支持消失的时间线、Kubernetes 发布计划何时采用 go1.24，
以及如何通过指标和审计日志检测 SHA-1 证书使用情况的更多详细信息。

<!--
#### Deprecation of `status.nodeInfo.kubeProxyVersion` field for Nodes ([KEP 4004](https://github.com/kubernetes/enhancements/issues/4004))
-->
#### 弃用 Node 节点的 `status.nodeInfo.kubeProxyVersion` 字段 ([KEP 4004](https://github.com/kubernetes/enhancements/issues/4004))

<!--
The `.status.nodeInfo.kubeProxyVersion` field of Nodes has been deprecated in Kubernetes v1.31,
and will be removed in a later release.
It's being deprecated because the value of this field wasn't (and isn't) accurate.
This field is set by the kubelet, which does not have reliable information about the kube-proxy version or whether kube-proxy is running. 
-->
节点的 `.status.nodeInfo.kubeProxyVersion` 字段在 Kubernetes v1.31 中已被弃用,
并将在以后的版本中删除。
它被弃用是因为这个字段的值不准确（现在也不准确）。
这个字段是由 kubelet 设置的，而 kubelet 没有关于 kube-proxy 版本或 kube-proxy 是否正在运行的可靠信息。

<!--
The `DisableNodeKubeProxyVersion` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) will be set to `true` in by default in v1.31 and the kubelet will no longer attempt to set the `.status.kubeProxyVersion` field for its associated Node.
-->
`DisableNodeKubeProxyVersion` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)将在 v1.31
中默认设置为 `true`，kubelet 将不再尝试为其关联的节点设置 `.status.kubeProxyVersion` 字段。

<!--
#### Removal of all in-tree integrations with cloud providers
-->
#### 移除所有树内云提供商集成

<!--
As highlighted in a [previous article](/blog/2024/05/20/completing-cloud-provider-migration/), the last remaining in-tree support for cloud provider integration has been removed as part of the v1.31 release.
This doesn't mean you can't integrate with a cloud provider, however you now **must** use the
recommended approach using an external integration. Some integrations are part of the Kubernetes
project and others are third party software.
-->
正如之前的文章中强调的那样，作为 v1.31 发布的一部分，最后剩余的树内云平台集成支持已被移除。
这并不意味着您不能与云平台集成，但是您现在**必须**使用推荐的方法使用外部集成。一些集成是 Kubernetes 项目的一部分，而其他则是第三方软件。

<!--
This milestone marks the completion of the externalization process for all cloud providers' integrations from the Kubernetes core ([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)), a process started with Kubernetes v1.26. 
This change helps Kubernetes to get closer to being a truly vendor-neutral platform.
-->
这一里程碑标志着所有云提供商集成从 Kubernetes 核心外部化过程的完成（[KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)），这个过程始于 Kubernetes v1.26。
这一变化有助于 Kubernetes 更接近成为一个真正供应商中立的平台。

<!--
For further details on the cloud provider integrations, read our [v1.29 Cloud Provider Integrations feature blog](/blog/2023/12/14/cloud-provider-integration-changes/). 
For additional context about the in-tree code removal, we invite you to check the ([v1.29 deprecation blog](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)).
-->
有关云提供商集成的更多详细信息，请阅读我们的 [v1.29 云提供商集成功能博客](/blog/2023/12/14/cloud-provider-integration-changes/)。
有关树内代码移除的额外背景，我们邀请您查看（[v1.29 弃用博客](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)）。

<!--
The latter blog also contains useful information for users who need to migrate to version v1.29 and later.
-->
后者的博客还包含了需要迁移到 v1.29 及更高版本的用户的有用信息。

<!--
#### Removal of in-tree provider feature gates
-->
#### 移除树内供应商特性门控

<!--
In Kubernetes v1.31, the following alpha feature gates `InTreePluginAWSUnregister`, `InTreePluginAzureDiskUnregister`, `InTreePluginAzureFileUnregister`, `InTreePluginGCEUnregister`, `InTreePluginOpenStackUnregister`, and `InTreePluginvSphereUnregister` have been removed. These feature gates were introduced to facilitate the testing of scenarios where in-tree volume plugins were removed from the codebase, without actually removing them. Since Kubernetes 1.30 had deprecated these in-tree volume plugins, these feature gates were redundant and no longer served a purpose. The only CSI migration gate still standing is `InTreePluginPortworxUnregister`, which will remain in alpha until the CSI migration for Portworx is completed and its in-tree volume plugin will be ready for removal.
-->
在 Kubernetes v1.31 中，以下 Alpha 特性门控 `InTreePluginAWSUnregister`、`InTreePluginAzureDiskUnregister`、
`InTreePluginAzureFileUnregister`、`InTreePluginGCEUnregister`、`InTreePluginOpenStackUnregister`
和 `InTreePluginvSphereUnregister` 已被移除。
这些特性门控的引入是为了便于测试从代码库中移除树内卷插件的场景，而无需实际移除它们。
由于 Kubernetes 1.30 已弃用这些树内卷插件，这些特性门控变得多余，不再有用。
唯一仍然存在的 CSI 迁移门控是 `InTreePluginPortworxUnregister`，它将保持 Alpha 状态，
直到 Portworx 的 CSI 迁移完成，其树内卷插件准备好被移除。


<!--
#### Removal of kubelet `--keep-terminated-pod-volumes` command line flag
-->
#### 移除 kubelet 的 `--keep-terminated-pod-volumes` 命令行标志

<!--
The kubelet flag `--keep-terminated-pod-volumes`, which was deprecated in 2017, has been removed as
part of the v1.31 release.

You can find more details in the pull request [#122082](https://github.com/kubernetes/kubernetes/pull/122082).
-->
作为 v1.31 版本的一部分，已移除 kubelet 标志 `--keep-terminated-pod-volumes`。该标志于 2017 年被弃用。

您可以在拉取请求 [#122082](https://github.com/kubernetes/kubernetes/pull/122082) 中找到更多详细信息。

<!--
#### Removal of CephFS volume plugin 

[CephFS volume plugin](/docs/concepts/storage/volumes/#cephfs) was removed in this release and the `cephfs` volume type became non-functional. 

It is recommended that you use the [CephFS CSI driver](https://github.com/ceph/ceph-csi/) as a third-party storage driver instead. If you were using the CephFS volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

CephFS volume plugin was formally marked as deprecated in v1.28.
-->
#### 移除 CephFS 卷插件

本次发布中移除了 [CephFS 卷插件](/zh-cn/docs/concepts/storage/volumes/#cephfs)，`cephfs` 卷类型变为不可用。

建议您改用 [CephFS CSI 驱动](https://github.com/ceph/ceph-csi/) 作为第三方存储驱动程序。
如果您在将集群版本升级到 v1.31 之前使用了 CephFS 卷插件，则必须重新部署应用程序以使用新的驱动程序。

CephFS 卷插件在 v1.28 中正式标记为废弃。

<!--
#### Removal of Ceph RBD volume plugin

The v1.31 release removes the [Ceph RBD volume plugin](/docs/concepts/storage/volumes/#rbd) and its CSI migration support, making the `rbd` volume type non-functional.

It's recommended that you use the [RBD CSI driver](https://github.com/ceph/ceph-csi/) in your clusters instead. 
If you were using Ceph RBD volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

The Ceph RBD volume plugin was formally marked as deprecated in v1.28.
-->
#### 移除 Ceph RBD 卷插件

v1.31 版本移除了 [Ceph RBD volume plugin](/zh-cn/docs/concepts/storage/volumes/#rbd) 及其 CSI 迁移支持，使 `rbd` 卷类型变为不可用。

建议您在集群中改用 [RBD CSI driver](https://github.com/ceph/ceph-csi/)。
如果您在将集群版本升级到 v1.31 之前使用了 Ceph RBD 卷插件，则必须重新部署应用程序以使用新的驱动程序。

Ceph RBD 卷插件在 v1.28 中正式标记为废弃。

<!--
#### Deprecation of non-CSI volume limit plugins in kube-scheduler
-->
#### 废弃 kube-scheduler 中的非 CSI 卷限制插件

<!--
The v1.31 release will deprecate all non-CSI volume limit scheduler plugins, and will remove some
already deprected plugins from the [default plugins](/docs/reference/scheduling/config/), including:

- `AzureDiskLimits`
- `CinderLimits`
- `EBSLimits`
- `GCEPDLimits`
-->
v1.31 版本将废弃所有非 CSI 卷限制调度器插件，并将从[默认插件](/zh-cn/docs/reference/scheduling/config/)中移除一些已废弃的插件，包括：

- `AzureDiskLimits`
- `CinderLimits`
- `EBSLimits`
- `GCEPDLimits`


<!--
It's recommended that you use the `NodeVolumeLimits` plugin instead because it can handle the same functionality as the removed plugins since those volume types have been migrated to CSI. 
Please replace the deprecated plugins with the `NodeVolumeLimits` plugin if you explicitly use them in the [scheduler config](/docs/reference/scheduling/config/). 
The `AzureDiskLimits`, `CinderLimits`, `EBSLimits`, and `GCEPDLimits` plugins will be removed in a future release.
-->
建议您改用 `NodeVolumeLimits` 插件，因为自从这些卷类型迁移到 CSI 后，该插件可以处理与已移除插件相同的功能。
如果您在调度器配置中明确使用了已废弃的插件，请将它们替换为 `NodeVolumeLimits` 插件。
`AzureDiskLimits`、`CinderLimits`、`EBSLimits` 和 `GCEPDLimits` 插件将在未来的版本中被移除。

<!--
These plugins will be removed from the default scheduler plugins list as they have been deprecated since Kubernetes v1.14.
-->
这些插件自 Kubernetes v1.14 以来已被废弃，将从默认调度器插件列表中移除。

<!--
### Release notes and upgrade actions required

Check out the full details of the Kubernetes v1.31 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md).
-->
### 发布说明和所需的升级操作

请在我们的[发布说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)中查看 Kubernetes v1.31 版本的完整详细信息。

<!--
#### Scheduler now uses QueueingHint when `SchedulerQueueingHints` is enabled
Added support to the scheduler to start using a QueueingHint registered for Pod/Updated events,
to determine whether updates to  previously unschedulable Pods have made them schedulable.
The new support is active when the feature gate `SchedulerQueueingHints` is enabled.

Previously, when unschedulable Pods were updated, the scheduler always put Pods back to into a queue
(`activeQ` / `backoffQ`). However not all updates to Pods make Pods schedulable, especially considering
many scheduling constraints nowadays are immutable. Under the new behaviour, once unschedulable Pods
are updated, the scheduling queue checks with QueueingHint(s) whether the update may make the
pod(s) schedulable, and requeues them to `activeQ` or `backoffQ` only when at least one
QueueingHint returns `Queue`.
-->
#### 启用 `SchedulerQueueingHints` 时，调度器现在使用 QueueingHint

社区为调度器添加了支持，以便在启用 `SchedulerQueueingHints` 功能门控时，开始使用为 Pod/Updated
事件注册的 QueueingHint，以确定对先前不可调度的 Pod 的更新是否使其变得可调度。
以前，当不可调度的 Pod 被更新时，调度器总是将 Pod 放回队列（`activeQ` / `backoffQ`）。
然而，并非所有对 Pod 的更新都会使 Pod 变得可调度，特别是考虑到现在许多调度约束是不可变更的。
在新的行为下，一旦不可调度的 Pod 被更新，调度队列会通过 QueueingHint 检查该更新是否可能使 Pod 变得可调度，
并且只有当至少一个 QueueingHint 返回 Queue 时，才将它们重新排队到 `activeQ` 或 `backoffQ`。

<!--
**Action required for custom scheduler plugin developers**: 
Plugins have to implement a QueueingHint for Pod/Update event if the rejection from them could be resolved by updating unscheduled Pods themselves. Example: suppose you develop a custom plugin that denies Pods that have a `schedulable=false` label. Given Pods with a `schedulable=false` label will be schedulable if the `schedulable=false` label is removed, this plugin would implement QueueingHint for Pod/Update event that returns Queue when such label changes are made in unscheduled Pods. You can find more details in the pull request [#122234](https://github.com/kubernetes/kubernetes/pull/122234).
-->
**自定义调度器插件开发者需要采取的操作**：
如果插件的拒绝可以通过更新未调度的 Pod 本身来解决，那么插件必须为 Pod/Update 事件实现 QueueingHint。
例如：假设您开发了一个自定义插件，该插件拒绝具有 `schedulable=false` 标签的 Pod。
鉴于带有 `schedulable=false` 标签的 Pod 在移除该标签后将变得可调度，这个插件将为 Pod/Update
事件实现 QueueingHint，当在未调度的 Pod 中进行此类标签更改时返回 Queue。
您可以在 pull request [#122234](https://github.com/kubernetes/kubernetes/pull/122234) 中找到更多详细信息。

<!--
#### Removal of kubelet --keep-terminated-pod-volumes command line flag
The kubelet flag `--keep-terminated-pod-volumes`, which was deprecated in 2017, was removed as part of the v1.31 release.

You can find more details in the pull request [#122082](https://github.com/kubernetes/kubernetes/pull/122082).
-->
#### 移除 kubelet --keep-terminated-pod-volumes 命令行标志

作为 v1.31 版本的一部分，已移除 kubelet 标志 `--keep-terminated-pod-volumes`。该标志于 2017 年被弃用。
您可以在拉取请求 [#122082](https://github.com/kubernetes/kubernetes/pull/122082) 中找到更多详细信息。

<!--
## Availability

Kubernetes v1.31 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.31.0) or on the [Kubernetes download page](/releases/download/). 

To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily install v1.31 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/). 
-->
## 可用性

Kubernetes v1.31 可在 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.31.0) 或 [Kubernetes 下载页面](/releases/download/)上下载。

要开始使用 Kubernetes，请查看这些[交互式教程](/zh-cn/docs/tutorials/)或使用 [minikube](https://minikube.sigs.k8s.io/)
运行本地 Kubernetes 集群。您还可以使用 [kubeadm](/zh-cn/docs/setup/independent/create-cluster-kubeadm/) 轻松安装 v1.31。

<!--
## Release team

Kubernetes is only possible with the support, commitment, and hard work of its community. 
Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. 
This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.31 release to our community. 
The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over several release cycles. 
A very special thanks goes out our release lead, Angelos Kolaitis, for supporting us through a successful release cycle, advocating for us, making sure that we could all contribute in the best way possible, and challenging us to improve the release process.
-->
## 发布团队

Kubernetes 的实现离不开社区的支持、投入和辛勤工作。
每个发布团队由致力于构建 Kubernetes 发布版本各个部分的专门社区志愿者组成。
这需要来自我们社区各个角落的人员的专业技能，从代码本身到文档和项目管理。

我们要感谢整个[发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)为向我们的社区交付 Kubernetes v1.31 版本所付出的时间和努力。
发布团队的成员从首次参与的影子成员到经历多个发布周期的回归团队负责人不等。
特别感谢我们的发布负责人 Angelos Kolaitis，他支持我们完成了一个成功的发布周期，为我们发声，确保我们都能以最佳方式贡献，并挑战我们改进发布过程。


<!--
## Project velocity
-->
## 项目速度

<!--
The CNCF K8s DevStats project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.
-->
CNCF K8s DevStats 项目汇总了许多与 Kubernetes 及各个子项目速度相关的有趣数据点。
这包括从个人贡献到贡献公司数量的所有内容，展示了进化这个生态系统所投入的深度和广度。

<!--
In the v1.31 release cycle, which ran for 14 weeks (May 7th to August 13th), we saw contributions to Kubernetes from 113 different companies and 528 individuals.
-->
在为期 14 周的 v1.31 发布周期（5 月 7 日至 8 月 13 日）中，我们看到来自 113 家不同公司和 528 个个人对 Kubernetes 的贡献。

<!--
In the whole Cloud Native ecosystem we have 379 companies counting 2268 total contributors - which means that respect to the previous release cycle we experienced an astounding 63% increase on individuals contributing! 
-->
在整个云原生生态系统中，我们有 379 家公司，共计 2268 名贡献者 - 这意味着相比上一个发布周期，个人贡献者数量惊人地增加了 63%！

<!--
Source for this data: 
- [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)
-->
数据来源：
- [为 Kubernetes 贡献的公司](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [整体生态系统贡献](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

<!--
By contribution we mean when someone makes a commit, code review, comment, creates an issue or PR, reviews a PR (including blogs and documentation) or comments on issues and PRs.
-->
贡献指的是当某人进行提交、代码审查、评论、创建问题或 PR、审查 PR（包括博客和文档）或对问题和 PR 进行评论。

<!--
If you are interested in contributing visit [this page](https://www.kubernetes.dev/docs/guide/#getting-started) to get started. 
-->
如果您有兴趣贡献，请访问[此页面](https://www.kubernetes.dev/docs/guide/#getting-started)开始。

<!--
[Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) to learn more about the overall velocity of the Kubernetes project and community.
-->
[查看 DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) 以了解更多关于 Kubernetes 项目和社区整体速度的信息。

<!--
## Event update

Explore the upcoming Kubernetes and cloud-native events from August to November 2024, featuring KubeCon, KCD, and other notable conferences worldwide. Stay informed and engage with the Kubernetes community.
-->
## 活动更新

探索 2024 年 8 月至 11 月即将举行的 Kubernetes 和云原生活动，包括 KubeCon、KCD 和其他全球知名会议。保持了解并参与 Kubernetes 社区。

<!--
**August 2024**
- [**KubeCon + CloudNativeCon + Open Source Summit China 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-open-source-summit-ai-dev-china/): August 21-23, 2024 | Hong Kong
- [**KubeDay Japan**](https://events.linuxfoundation.org/kubeday-japan/): August 27, 2024 | Tokyo, Japan
-->
**2024 年 8 月**
- [**KubeCon + CloudNativeCon + 开源峰会中国 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-open-source-summit-ai-dev-china/)：2024 年 8 月 21-23 日 | 中国香港
- [**KubeDay Japan**](https://events.linuxfoundation.org/kubeday-japan/)：2024 年 8 月 27 日 | 东京，日本


<!--
**September 2024**
- [**KCD Lahore - Pakistan 2024**](https://community.cncf.io/events/details/cncf-kcd-lahore-presents-kcd-lahore-pakistan-2024/): September 1, 2024 | Lahore, Pakistan
- [**KuberTENes Birthday Bash Stockholm**](https://community.cncf.io/events/details/cncf-stockholm-presents-kubertenes-birthday-bash-stockholm-a-couple-of-months-late/): September 5, 2024 | Stockholm, Sweden
- [**KCD Sydney ’24**](https://community.cncf.io/events/details/cncf-kcd-australia-presents-kcd-sydney-24/): September 5-6, 2024 | Sydney, Australia
- [**KCD Washington DC 2024**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2024/): September 24, 2024 | Washington, DC, United States
- [**KCD Porto 2024**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2024/): September 27-28, 2024 | Porto, Portugal
-->
**2024 年 9 月**
- [**KCD 拉合尔 - 巴基斯坦 2024**](https://community.cncf.io/events/details/cncf-kcd-lahore-presents-kcd-lahore-pakistan-2024/): 2024 年 9 月 1 日 | 拉合尔，巴基斯坦
- [**KuberTENes 生日庆典 斯德哥尔摩**](https://community.cncf.io/events/details/cncf-stockholm-presents-kubertenes-birthday-bash-stockholm-a-couple-of-months-late/): 2024 年 9 月 5 日 | 斯德哥尔摩，瑞典
- [**KCD Sydney ’24**](https://community.cncf.io/events/details/cncf-kcd-australia-presents-kcd-sydney-24/): 2024 年 9 月 5-6 日 | 悉尼，澳大利亚
- [**KCD Washington DC 2024**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2024/): 2024 年 9 月 24 日 | 华盛顿特区，美国
- [**KCD Porto 2024**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2024/): 2024 年 9 月 27-28 日 | 波尔图，葡萄牙

<!--
**October 2024**
- [**KCD Austria 2024**](https://community.cncf.io/events/details/cncf-kcd-austria-presents-kcd-austria-2024/): October 8-10, 2024 | Wien, Austria 
- [**KubeDay Australia**](https://events.linuxfoundation.org/kubeday-australia/): October 15, 2024 | Melbourne, Australia
- [**KCD UK - London 2024**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-london-2024/): October 22-23, 2024 | Greater London, United Kingdom
-->
**2024 年 10 月**
- [**KCD Austria 2024**](https://community.cncf.io/events/details/cncf-kcd-austria-presents-kcd-austria-2024/): 2024 年 10 月 8-10 日 | 维也纳，奥地利
- [**KubeDay Australia**](https://events.linuxfoundation.org/kubeday-australia/): 2024 年 10 月 15 日 | 墨尔本，澳大利亚
- [**KCD UK - London 2024**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-london-2024/): 2024 年 10 月 22-23 日 | 伦敦，英国

<!--
**November 2024**
- [**KubeCon + CloudNativeCon North America 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): November 12-15, 2024 | Salt Lake City, United States
- [**Kubernetes on EDGE Day North America**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/co-located-events/kubernetes-on-edge-day/): November 12, 2024 | Salt Lake City, United States
-->
**2024 年 11 月**
- [**KubeCon + CloudNativeCon North America 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): 2024 年 11 月 12-15 日 | 盐湖城，美国
- [**Kubernetes on EDGE Day North America**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/co-located-events/kubernetes-on-edge-day/): 2024 年 11 月 12 日 | 盐湖城，美国

<!--
## Upcoming release webinar

Join members of the Kubernetes v1.31 release team on Thursday, Thu Sep 12, 2024 10am PT to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. 
For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-131-release/) on the CNCF Online Programs site.
-->
## 即将举行的发布网络研讨会

加入 Kubernetes v1.31 发布团队成员，于 2024 年 9 月 12 日星期四太平洋时间上午 10 点了解此版本的主要特性，以及废弃和移除的内容，以帮助规划升级。
有关更多信息和注册，请访问 CNCF 在线项目网站上的[活动页面](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-131-release/)。


<!--
## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. 
Have something you’d like to broadcast to the Kubernetes community? 
Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. 
Thank you for your continued feedback and support.

- Follow us on X [@Kubernetesio](https://x.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
## 参与其中

参与 Kubernetes 的最简单方式是加入与您兴趣相符的众多特殊兴趣小组（[SIG](https://github.com/kubernetes/community/blob/master/sig-list.md)）之一。
您有什么想向 Kubernetes 社区广播的内容吗？
在我们的每周[社区会议](https://github.com/kubernetes/community/tree/master/communication)上分享您的声音，并通过以下渠道。
感谢您持续的反馈和支持。

- 在 X 上关注我们 [@Kubernetesio](https://x.com/kubernetesio) 获取最新更新
- 在 [Discuss](https://discuss.kubernetes.io/) 上加入社区讨论
- 在 [Slack](http://slack.k8s.io/) 上加入社区
- 在 [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 上发布问题（或回答问题）
- 分享您的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- 在[博客](https://kubernetes.io/blog/)上阅读更多关于 Kubernetes 的最新动态
- 了解更多关于 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)的信息
