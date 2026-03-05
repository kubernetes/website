---
layout: blog
title: "Kubernetes v1.25: Combiner"
date: 2022-08-23
slug: kubernetes-v1-25-release
---
<!--
layout: blog
title: "Kubernetes v1.25: Combiner"
date: 2022-08-23
slug: kubernetes-v1-25-release
-->

<!--
**Authors**: [Kubernetes 1.25 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.25/release-team.md)
-->
**作者**: [Kubernetes 1.25 发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.25/release-team.md)

<!--
Announcing the release of Kubernetes v1.25!
-->
宣布 Kubernetes v1.25 的发版！

<!--
This release includes a total of 40 enhancements. Fifteen of those enhancements are entering Alpha, ten are graduating to Beta, and thirteen are graduating to Stable. We also have two features being deprecated or removed.
-->
这个版本总共包括 40 项增强功能。
其中 15 项增强功能进入 Alpha，10 项进入 Beta，13 项进入 Stable。
我们也废弃/移除了两个功能。

<!--
## Release theme and logo

**Kubernetes 1.25: Combiner**

{{< figure src="/images/blog/2022-08-23-kubernetes-1.25-release/kubernetes-1.25.png" alt="Combiner logo" class="release-logo" >}}

The theme for Kubernetes v1.25 is _Combiner_.

The Kubernetes project itself is made up of many, many individual components that, when combined, take the form of the project you see today. It is also built and maintained by many individuals, all of them with different skills, experiences, histories, and interests, who join forces not just as the release team but as the many SIGs that support the project and the community year-round.

With this release, we wish to honor the collaborative, open spirit that takes us from isolated developers, writers, and users spread around the globe to a combined force capable of changing the world. Kubernetes v1.25 includes a staggering 40 enhancements, none of which would exist without the incredible power we have when we work together.

Inspired by our release lead's son, Albert Song, Kubernetes v1.25 is named for each and every one of you, no matter how you choose to contribute your unique power to the combined force that becomes Kubernetes.
-->
## 版本主题和徽标
**Kubernetes 1.25: Combiner**

{{< figure src="/images/blog/2022-08-23-kubernetes-1.25-release/kubernetes-1.25.png" alt="Combiner logo" class="release-logo" >}}

Kubernetes v1.25 的主题是 **Combiner**，即组合器。

Kubernetes 项目本身是由特别多单独的组件组成的，这些组件组合起来就形成了你今天看到的这个项目。
同时它也是由许多个人建立和维护的，这些人拥有不同的技能、经验、历史和兴趣，
他们不仅作为发布团队成员，而且作为许多 SIG 成员，常年通力合作支持项目和社区。

通过这次发版，我们希望向协作和开源的精神致敬，
这种精神使我们从分散在世界各地的独立开发者、作者和用户变成了能够改变世界的联合力量。
Kubernetes v1.25 包含了惊人的 40 项增强功能，
如果没有我们在一起工作时拥有的强大力量，这些增强功能都不会存在。

受我们的发布负责人的儿子 Albert Song 的启发，Kubernetes v1.25 是以你们每一个人命名的，
无论你们选择如何作为 Kubernetes 的联合力量贡献自己的独有力量。

<!--
## What's New (Major Themes)

### PodSecurityPolicy is removed; Pod Security Admission graduates to Stable {#pod-security-changes}

PodSecurityPolicy was initially [deprecated in v1.21](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/), and with the release of v1.25, it has been removed. The updates required to improve its usability would have introduced breaking changes, so it became necessary to remove it in favor of a more friendly replacement. That replacement is [Pod Security Admission](/docs/concepts/security/pod-security-admission/), which graduates to Stable with this release. If you are currently relying on PodSecurityPolicy, please follow the instructions for [migration to Pod Security Admission](/docs/tasks/configure-pod-container/migrate-from-psp/).
-->
## 新增内容（主要主题）
### 移除 PodSecurityPolicy；Pod Security Admission 成长为 Stable {#pod-security-changes}

PodSecurityPolicy 是在 [1.21 版本中被弃用](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)，到 1.25 版本被移除。
因为提升其可用性的变更会带来破坏性的变化，所以有必要将其删除，以支持一个更友好的替代品。
这个替代品就是 [Pod Security Admission](/zh-cn/docs/concepts/security/pod-security-admission/)，它在这个版本里成长为 Stable。
如果你最近依赖于 PodSecurityPolicy，请参考 [Pod Security Admission 迁移说明](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。

<!--
### Ephemeral Containers Graduate to Stable

[Ephemeral Containers](/docs/concepts/workloads/pods/ephemeral-containers/) are containers that exist for only a limited time within an existing pod. This is particularly useful for troubleshooting when you need to examine another container but cannot use `kubectl exec` because that container has crashed or its image lacks debugging utilities. Ephemeral containers graduated to Beta in Kubernetes v1.23, and with this release, the feature graduates to Stable.
-->
### Ephemeral Containers 成长为 Stable

[临时容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)是在现有的 Pod 中存在有限时间的容器。
当你需要检查另一个容器，但因为该容器已经崩溃或其镜像缺乏调试工具不能使用 `kubectl exec` 时，它对故障排除特别有用。
临时容器在 Kubernetes v1.23 中成长为 Beta，并在这个版本中，该功能成长为 Stable。

<!--
### Support for cgroups v2 Graduates to Stable

It has been more than two years since the Linux kernel cgroups v2 API was declared stable. With some distributions now defaulting to this API, Kubernetes must support it to continue operating on those distributions. cgroups v2 offers several improvements over cgroups v1, for more information see the [cgroups v2](https://kubernetes.io/docs/concepts/architecture/cgroups/) documentation. While cgroups v1 will continue to be supported, this enhancement puts us in a position to be ready for its eventual deprecation and replacement.
-->
### 对 cgroups v2 的支持进入 Stable 阶段

自 Linux 内核 cgroups v2 API 宣布稳定以来，已经有两年多的时间了。
随着一些发行版现在默认使用该 API，Kubernetes 必须支持它以继续在这些发行版上运行。
cgroups v2 比 cgroups v1 提供了一些改进，更多信息参见 [cgroups v2](/zh-cn/docs/concepts/architecture/cgroups/) 文档。
虽然 cgroups v1 将继续受到支持，但这一改进使我们能够为其最终的废弃和替代做好准备。


<!--
### Improved Windows support

- [Performance dashboards](http://perf-dash.k8s.io/#/?jobname=soak-tests-capz-windows-2019) added support for Windows
- [Unit tests](https://github.com/kubernetes/kubernetes/issues/51540) added support for Windows
- [Conformance tests](https://github.com/kubernetes/kubernetes/pull/108592) added support for Windows
- New GitHub repository created for [Windows Operational Readiness](https://github.com/kubernetes-sigs/windows-operational-readiness)
-->
### 改善对 Windows 系统的支持
- [性能仪表板](http://perf-dash.k8s.io/#/?jobname=soak-tests-capz-windows-2019)增加了对 Windows 系统的支持
- [单元测试](https://github.com/kubernetes/kubernetes/issues/51540)增加了对 Windows 系统的支持
- [一致性测试](https://github.com/kubernetes/kubernetes/pull/108592)增加了对 Windows 系统的支持
- 为 [Windows Operational Readiness](https://github.com/kubernetes-sigs/windows-operational-readiness) 创建了新的 GitHub 仓库

<!--
### Moved container registry service from k8s.gcr.io to registry.k8s.io

[Moving container registry from k8s.gcr.io to registry.k8s.io](https://github.com/kubernetes/kubernetes/pull/109938) got merged. For more details, see the [wiki page](https://github.com/kubernetes/k8s.io/wiki/New-Registry-url-for-Kubernetes-\(registry.k8s.io\)), [announcement](https://groups.google.com/a/kubernetes.io/g/dev/c/DYZYNQ_A6_c/m/oD9_Q8Q9AAAJ) was sent to the kubernetes development mailing list.
-->
### 将容器注册服务从 k8s.gcr.io 迁移至 registry.k8s.io
[将容器注册服务从 k8s.gcr.io 迁移至 registry.k8s.io](https://github.com/kubernetes/kubernetes/pull/109938) 的 PR 已经被合并。
更多细节参考 [wiki 页面](https://github.com/kubernetes/k8s.io/wiki/New-Registry-url-for-Kubernetes-\(registry.k8s.io\))，
同时[公告](https://groups.google.com/a/kubernetes.io/g/dev/c/DYZYNQ_A6_c/m/oD9_Q8Q9AAAJ)已发送到 kubernetes 开发邮件列表。

<!--
### Promoted SeccompDefault to Beta

SeccompDefault promoted to beta, see the tutorial [Restrict a Container's Syscalls with seccomp](https://kubernetes.io/docs/tutorials/security/seccomp/#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads) for more details.
-->
### SeccompDefault 升级为 Beta

SeccompDefault 升级为 Beta，
更多细节参考教程[用 seccomp 限制一个容器的系统调用](/zh-cn/docs/tutorials/security/seccomp/#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads)。

<!--
### Promoted endPort in Network Policy to Stable

Promoted `endPort` in [Network Policy](https://kubernetes.io/docs/concepts/services-networking/network-policies/#targeting-a-range-of-ports) to GA. Network Policy providers that support `endPort` field now can use it to specify a range of ports to apply a Network Policy. Previously, each Network Policy could only target a single port.

Please be aware that `endPort` field **must be supported** by the Network Policy provider. If your provider does not support `endPort`, and this field is specified in a Network Policy, the Network Policy will be created covering only the port field (single port).
-->
### 网络策略中 endPort 升级为 Stable

[网络策略](/zh-cn/docs/concepts/services-networking/network-policies/#targeting-a-range-of-ports)中的 
`endPort` 已经迎来 GA 正式发布。
支持 `endPort` 字段的网络策略提供程序现在可使用该字段来指定端口范围，应用网络策略。
在之前的版本中，每个网络策略只能指向单一端口。

请注意，网络策略提供程序 **必须支持** `endPort` 字段。
如果提供程序不支持 `endPort`，又在网络策略中指定了此字段，
则会创建出仅覆盖端口字段（单端口）的网络策略。

<!--
### Promoted Local Ephemeral Storage Capacity Isolation to Stable
The [Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/361-local-ephemeral-storage-isolation) feature moved to GA. This was introduced as alpha in 1.8, moved to beta in 1.10, and it is now a stable feature. It provides support for capacity isolation of local ephemeral storage between pods, such as `EmptyDir`, so that a pod can be hard limited in its consumption of shared resources by evicting Pods if its consumption of local ephemeral storage exceeds that limit.
-->
### 本地临时容器存储容量隔离升级为 Stable
[本地临时存储容量隔离功能](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/361-local-ephemeral-storage-isolation)已经迎来 GA 正式发布版本。
该功能在 1.8 版中作为 alpha 版本引入，在 1.10 中升级为 beta，现在终于成为了稳定功能。
它提供了对 Pod 之间本地临时存储容量隔离的支持，如 `EmptyDir`，
因此，如果一个 Pod 对本地临时存储容量的消耗超过该限制，就可以通过驱逐 Pod 来硬性限制其对共享资源的消耗。

<!--
### Promoted core CSI Migration to Stable

[CSI Migration](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/#quick-recap-what-is-csi-migration-and-why-migrate) is an ongoing effort that SIG Storage has been working on for a few releases. The goal is to move in-tree volume plugins to out-of-tree CSI drivers and eventually remove the in-tree volume plugins. The [core CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration) feature moved to GA. CSI Migration for GCE PD and AWS EBS also moved to GA. CSI Migration for vSphere remains in beta (but is on by default). CSI Migration for Portworx moved to Beta (but is off-by-default).
-->
### 核心 CSI 迁移为稳定版

[CSI 迁移](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/#quick-recap-what-is-csi-migration-and-why-migrate)是 SIG Storage 在之前多个版本中做出的持续努力。
目标是将树内数据卷插件转移到树外 CSI 驱动程序并最终移除树内数据卷插件。
此次[核心 CSI 迁移](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration)已迎来 GA。
同样，GCE PD 和 AWS EBS 的 CSI 迁移也进入 GA 阶段。
vSphere 的 CSI 迁移仍为 beta（但也默认启用）。
Portworx 的 CSI 迁移同样处于 beta 阶段（但默认不启用）。

<!--
### Promoted CSI Ephemeral Volume to Stable

The [CSI Ephemeral Volume](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/596-csi-inline-volumes) feature allows CSI volumes to be specified directly in the pod specification for ephemeral use cases. They can be used to inject arbitrary states, such as configuration, secrets, identity, variables or similar information, directly inside pods using a mounted volume. This was initially introduced in 1.15 as an alpha feature, and it moved to GA. This feature is used by some CSI drivers such as the [secret-store CSI driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver).
-->
### CSI 临时数据卷升级为稳定版

[CSI 临时数据卷](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/596-csi-inline-volumes)
功能允许在临时使用的情况下在 Pod 里直接指定 CSI 数据卷。
因此可以直接用它们在使用挂载卷的 Pod 内注入任意状态，如配置、秘密、身份、变量或类似信息。
这个功能最初是作为 alpha 功能在 1.15 版本中引入，现在已升级为 GA 通用版。
某些 CSI 驱动程序会使用此功能，例如[存储密码的 CSI 驱动程序](https://github.com/kubernetes-sigs/secrets-store-csi-driver)。

<!--
### Promoted CRD Validation Expression Language to Beta

[CRD Validation Expression Language](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md) is promoted to beta, which makes it possible to declare how custom resources are validated using the [Common Expression Language (CEL)](https://github.com/google/cel-spec). Please see the [validation rules](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules) guide.
-->
### CRD 验证表达式语言升级为 Beta

[CRD 验证表达式语言](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md)已升级为 beta 版本，
这使得声明如何使用[通用表达式语言（CEL）](https://github.com/google/cel-spec)验证自定义资源成为可能。
请参考[验证规则](https://kubernetes.io/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)指导。


<!--
### Promoted Server Side Unknown Field Validation to Beta

Promoted the `ServerSideFieldValidation` feature gate to beta (on by default). This allows optionally triggering schema validation on the API server that errors when unknown fields are detected. This allows the removal of client-side validation from kubectl while maintaining the same core functionality of erroring out on requests that contain unknown or invalid fields.
-->
### 服务器端未知字段验证升级为 Beta

`ServerSideFieldValidation` 特性门控已升级为 beta（默认开启）。
它允许在检测到未知字段时，有选择地触发 API 服务器上的模式验证机制。
因此这允许从 kubectl 中移除客户端验证的同时保持相同的核心功能，即对包含未知或无效字段的请求进行错误处理。


<!--
###  Introduced KMS v2 API

Introduce KMS v2alpha1 API to add performance, rotation, and observability improvements. Encrypt data at rest (ie Kubernetes `Secrets`) with DEK using AES-GCM instead of AES-CBC for kms data encryption. No user action is required. Reads with AES-GCM and AES-CBC will continue to be allowed. See the guide [Using a KMS provider for data encryption](https://kubernetes.io/docs/tasks/administer-cluster/kms-provider/) for more information.
-->
### 引入 KMS v2 API

引入 KMS v2 alpha1 API 以提升性能，实现轮替与可观察性改进。
此 API 使用 AES-GCM 替代了 AES-CBC，通过 DEK 实现静态数据（即 Kubernetes Secrets）加密。
过程中无需额外用户操作，而且仍然支持通过 AES-GCM 和 AES-CBC 进行读取。
更多信息参考[使用 KMS provider 进行数据加密](/zh-cn/docs/tasks/administer-cluster/kms-provider/)指南。

<!--
### Kube-proxy images are now based on distroless images

In previous releases, kube-proxy container images were built using Debian as the base image. Starting with this release, the images are now built using [distroless](https://github.com/GoogleContainerTools/distroless). This change reduced image size by almost 50% and decreased the number of installed packages and files to only those strictly required for kube-proxy to do its job.
-->
### Kube-proxy 镜像当前基于无发行版镜像

在以前的版本中，kube-proxy 的容器镜像是以 Debian 作为基础镜像构建的。
从这个版本开始，其镜像现在使用 [distroless](https://github.com/GoogleContainerTools/distroless) 来构建。
这一改变将镜像的大小减少了近 50%，并将安装的软件包和文件的数量减少到只有 kube-proxy 工作所需的那些。


<!--
## Other Updates

### Graduations to Stable

This release includes a total of thirteen enhancements promoted to stable:

* [Ephemeral Containers](https://github.com/kubernetes/enhancements/issues/277)
* [Local Ephemeral Storage Resource Management](https://github.com/kubernetes/enhancements/issues/361)
* [CSI Ephemeral Volumes](https://github.com/kubernetes/enhancements/issues/596)
* [CSI Migration - Core](https://github.com/kubernetes/enhancements/issues/625)
* [Graduate the kube-scheduler ComponentConfig to GA](https://github.com/kubernetes/enhancements/issues/785)
* [CSI Migration - AWS](https://github.com/kubernetes/enhancements/issues/1487)
* [CSI Migration - GCE](https://github.com/kubernetes/enhancements/issues/1488)
* [DaemonSets Support MaxSurge](https://github.com/kubernetes/enhancements/issues/1591)
* [NetworkPolicy Port Range](https://github.com/kubernetes/enhancements/issues/2079)
* [cgroups v2](https://github.com/kubernetes/enhancements/issues/2254)
* [Pod Security Admission](https://github.com/kubernetes/enhancements/issues/2579)
* [Add `minReadySeconds` to Statefulsets](https://github.com/kubernetes/enhancements/issues/2599)
* [Identify Windows pods at API admission level authoritatively](https://github.com/kubernetes/enhancements/issues/2802)
-->
## 其他更新

### 稳定版升级

1.25 版本共包含 13 项升级至稳定版的增强功能：

* [临时容器](https://github.com/kubernetes/enhancements/issues/277)
* [本地临时存储资源管理](https://github.com/kubernetes/enhancements/issues/361)
* [CSI 临时数据卷](https://github.com/kubernetes/enhancements/issues/596)
* [CSI 迁移 -- 核心](https://github.com/kubernetes/enhancements/issues/625)
* [kube-scheduler ComponentConfig 升级为 GA 通用版](https://github.com/kubernetes/enhancements/issues/785)
* [CSI 迁移 -- AWS](https://github.com/kubernetes/enhancements/issues/1487)
* [CSI 迁移 -- GCE](https://github.com/kubernetes/enhancements/issues/1488)
* [DaemonSets 支持 MaxSurge](https://github.com/kubernetes/enhancements/issues/1591)
* [网络策略端口范围](https://github.com/kubernetes/enhancements/issues/2079)
* [cgroups v2](https://github.com/kubernetes/enhancements/issues/2254)
* [Pod Security Admission](https://github.com/kubernetes/enhancements/issues/2579)
* [Statefulsets 增加 `minReadySeconds`](https://github.com/kubernetes/enhancements/issues/2599)
* [在 API 准入层级权威识别 Windows Pod](https://github.com/kubernetes/enhancements/issues/2802)

<!--
### Deprecations and Removals

Two features were [deprecated or removed](/blog/2022/08/04/upcoming-changes-in-kubernetes-1-25/) from Kubernetes with this release.

* [PodSecurityPolicy is removed](https://github.com/kubernetes/enhancements/issues/5)
* [GlusterFS plugin deprecated from available in-tree drivers](https://github.com/kubernetes/enhancements/issues/3446)
-->
### 弃用和移除

1.25 版本[废弃/移除](/blog/2022/08/04/upcoming-changes-in-kubernetes-1-25/)两个功能。

* [移除 PodSecurityPolicy](https://github.com/kubernetes/enhancements/issues/5)
* [从树内驱动程序移除 GlusterFS 插件](https://github.com/kubernetes/enhancements/issues/3446)

<!--
### Release Notes

The complete details of the Kubernetes v1.25 release are available in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md).
-->
### 发行版说明
Kubernetes 1.25 版本的完整信息可参考[发行版说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md)。


<!--
### Availability

Kubernetes v1.25 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.25.0).
To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local
Kubernetes clusters using containers as “nodes”, with [kind](https://kind.sigs.k8s.io/).
You can also easily install 1.25 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).
-->
### 获取

Kubernetes 1.25 版本可在 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.25.0) 下载获取。
开始使用 Kubernetes 请查看这些[交互式教程](/zh-cn/docs/tutorials/)或者使用
 [kind](https://kind.sigs.k8s.io/) 把容器当作 “节点” 来运行本地 Kubernetes 集群。
你也可以使用 [kubeadm](/zh-cn/docs/setup/independent/create-cluster-kubeadm/) 来简单的安装 1.25 版本。

<!--
### Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that, when combined, make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire release team for the hours spent hard at work to ensure we deliver a solid Kubernetes v1.25 release for our community. Every one of you had a part to play in building this, and you all executed beautifully. We would like to extend special thanks to our fearless release lead, Cici Huang, for all she did to guarantee we had what we needed to succeed.
-->
### 发布团队

Kubernetes 的发展离不开其社区的支持、承诺和辛勤工作。
每个发布团队都是由专门的社区志愿者组成的，他们共同努力，建立了许多模块，这些模块结合起来，就构成了你所依赖的 Kubernetes。
从代码本身到文档和项目管理，这需要我们社区每一个人的专业技能。

<!--
### User Highlights

* Finleap Connect operates in a highly regulated environment. [In 2019, they had five months to implement mutual TLS (mTLS) across all services in their clusters for their business code to comply with the new European PSD2 payment directive](https://www.cncf.io/case-studies/finleap-connect/).
* PNC sought to develop a way to ensure new code would meet security standards and audit compliance requirements automatically—replacing the cumbersome 30-day manual process they had in place. Using Knative, [PNC developed internal tools to automatically check new code and changes to existing code](https://www.cncf.io/case-studies/pnc-bank/).
* Nexxiot needed highly-reliable, secure, performant, and cost efficient Kubernetes clusters. [They turned to Cilium as the CNI to lock down their clusters and enable resilient networking with reliable day two operations](https://www.cncf.io/case-studies/nexxiot/).
* Because the process of creating cyber insurance policies is a complicated multi-step process, At-Bay sought to improve operations by using asynchronous message-based communication patterns/facilities. [They determined that Dapr fulfilled its desired list of requirements and much more](https://www.cncf.io/case-studies/at-bay/).
-->
### 重要用户

* Finleap Connect 在一个高度规范的环境中运作。
[2019年，他们有五个月的时间在其集群的所有服务中实施交互 TLS（mTLS），以使其业务代码符合新的欧洲 PSD2 支付指令](https://www.cncf.io/case-studies/finleap-connect/)。
* PNC 试图开发一种方法，以确保新的代码能够自动满足安全标准和审计合规性要求--取代他们现有的 30 天的繁琐的人工流程。
使用 Knative，[PNC 开发了内部工具来自动检查新代码和对修改现有代码](https://www.cncf.io/case-studies/pnc-bank/)。
* Nexxiot 公司需要高可用、安全、高性能以及低成本的
 Kubernetes 集群。[他们求助于 Cilium 作为 CNI 来锁定他们的集群，并通过可靠的 Day2 操作实现弹性网络](https://www.cncf.io/case-studies/nexxiot/)。
* 因为创建网络安全策略的过程是一个复杂的多步骤过程，
At-Bay 试图通过使用基于异步消息的通信模式/设施来改善运营。[他们确定 Dapr 满足了其所需的要求清单，且远超预期](https://www.cncf.io/case-studies/at-bay/)。

<!--
### Ecosystem Updates

* KubeCon + CloudNativeCon North America 2022 will take place in Detroit, Michigan from 24 – 28 October 2022! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/).
* KubeDay event series kicks off with KubeDay Japan on December 7! Register or submit a proposal on the [event site](https://events.linuxfoundation.org/kubeday-japan/)
* In the [2021 Cloud Native Survey](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/), the CNCF saw record Kubernetes and container adoption. Take a look at the [results of the survey](https://www.cncf.io/reports/cncf-annual-survey-2021/).
-->
###  生态系统更新
* 2022 北美 KubeCon + CloudNativeCon 将于 2022 年 10 月 24 - 28 日在密歇根州的底特律举行! 
你可以在[活动网站](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)找到更多关于会议和注册的信息。
* KubeDay 系列活动将于 12 月 7 日在日本 KubeDay 拉开帷幕!
在[活动网站](https://events.linuxfoundation.org/kubeday-japan/)上注册或提交提案。
* 在 [2021 云原生调查](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/)中，CNCF 看见了创纪录的 Kubernetes 和容器应用。
请参考[调查结果](https://www.cncf.io/reports/cncf-annual-survey-2021/)。

<!--
### Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project
aggregates a number of interesting data points related to the velocity of Kubernetes and various
sub-projects. This includes everything from individual contributions to the number of companies that
are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.25 release cycle, which [ran for 14 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25) (May 23 to August 23), we saw contributions from [1065 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions) and [1620 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes).
-->
### 项目进度

[CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) 项目汇集了大量关于 
Kubernetes 和各种子项目研发进度相关性的有趣的数据点。
其中包括从个人贡献到参与贡献的公司数量的全面信息，
并证明了为发展 Kubernetes 生态系统所做努力的深度和广度。

在 1.25 版本的发布周期中，
该周期[运行了 14 周](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25) (May 23 to August 23)，
我们看到来着 [1065 家公司](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions) 
以及 [1620 位个人](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes)所做出的贡献。

<!--
## Upcoming Release Webinar

Join members of the Kubernetes v1.25 release team on Thursday September 22, 2022 10am – 11am PT to learn about
the major features of this release, as well as deprecations and removals to help plan for upgrades.
For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-v125-release/).
-->
## 即将举行的网络发布研讨会

加入 Kubernetes 1.25 版本发布团队的成员，将于 2022 年 9 月 22 日星期四上午 10 点至 11 点(太平洋时间)了解该版本的主要功能，
以及弃用和删除的内容，以帮助制定升级计划。
欲了解更多信息和注册，请访问[活动页面](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-v125-release/)。

<!--
## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests.
Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below:

* Find out more about contributing to Kubernetes at the [Kubernetes Contributors](https://www.kubernetes.dev/) website
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes).
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
## 参与其中

参与 Kubernetes 最简单的方法就是加入众多[特殊兴趣小组](https://github.com/kubernetes/community/blob/master/sig-list.md)(SIGs) 中你感兴趣的一个。
你有什么东西想要跟 Kubernetes 社区沟通吗？
来我们每周的[社区会议](https://github.com/kubernetes/community/tree/master/communication)分享你的想法，并参考一下渠道：

* 在 [Kubernetes 贡献者](https://www.kubernetes.dev/)网站了解更多关于为 Kubernetes 做贡献的信息。
* 在 Twitter [@Kubernetesio](https://twitter.com/kubernetesio) 上关注我们，了解最新动态。
* 在 [Discuss](https://discuss.kubernetes.io/) 上加入社区讨论。
* 在 [Slack](http://slack.k8s.io/) 上加入社区。
* 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 上发布问题（或者回答问题）。
* 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* 在[博客](https://kubernetes.io/blog/)上阅读更多关于 Kubernetes 的情况。
* 了解更多关于 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)的信息。