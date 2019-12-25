---
title: v1.16 发行说明
weight: 10
card:
  name: 下载
  weight: 20
  anchors:
  - anchor: "#"
    title: 最新发行说明
  - anchor: "#urgent-upgrade-notes"
    title: 紧急升级说明
---

<!--
---
title: v1.16 Release Notes
weight: 10
card:
  name: download
  weight: 20
  anchors:
  - anchor: "#"
    title: Current Release Notes
  - anchor: "#urgent-upgrade-notes"
    title: Urgent Upgrade Notes
---
-->

<!--
NEW RELEASE NOTES ENTRY
-->

<!-- 新发行版本说明条目 -->


# v1.16.0

<!--
[Documentation](https://docs.k8s.io)
-->
[文档](https://docs.k8s.io)

<!--
## Downloads for v1.16.0
-->
## 下载 v1.16.0

<!--
filename | sha512 hash
文件名 | sha512 hash
-->


文件名 | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes.tar.gz) | `99aa74225dd999d112ebc3e7b7d586a2312ec9c99de7a7fef8bbbfb198a5b4cf740baa57ea262995303e2a5060d26397775d928a086acd926042a41ef00f200b`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-src.tar.gz) | `0be7d1d6564385cc20ff4d26bab55b71cc8657cf795429d04caa5db133a6725108d6a116553bf55081ccd854a4078e84d26366022634cdbfffd1a34a10b566cf`

<!--
### Client Binaries
-->
### 客户端可执行文件

<!--
filename | sha512 hash
文件名 | sha512 hash
-->

文件名 | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-darwin-386.tar.gz) | `a5fb80d26c2a75741ad0efccdacd5d5869fbc303ae4bb1920a6883ebd93a6b41969f898d177f2602faf23a7462867e1235edeb0ba0675041d0c8d5ab266ec62d`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-darwin-amd64.tar.gz) | `47a9a78fada4b840d9ae4dac2b469a36d0812ac83d22fd798c4cb0f1673fb65c6558383c19a7268ed7101ac9fa32d53d79498407bdf94923f4f8f019ea39e912`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-linux-386.tar.gz) | `916e4dd98f5ed8ee111eeb6c2cf5c5f313e1d98f3531b40a5a777240ddb96b9cc53df101daa077ffff52cf01167fdcc39d38a8655631bac846641308634e127a`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-linux-amd64.tar.gz) | `fccf152588edbaaa21ca94c67408b8754f8bc55e49470380e10cf987be27495a8411d019d807df2b2c1c7620f8535e8f237848c3c1ac3791b91da8df59dea5aa`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-linux-arm.tar.gz) | `066c55fabbe3434604c46574c51c324336a02a5bfaed2e4d83b67012d26bf98354928c9c12758b53ece16b8567e2b5ce6cb88d5cf3008c7baf3c5df02611a610`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-linux-arm64.tar.gz) | `e41be74cc36240a64ecc962a066988b5ef7c3f3112977efd4e307b35dd78688f41d6c5b376a6d1152d843182bbbe75d179de75675548bb846f8c1e28827e0e0c`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-linux-ppc64le.tar.gz) | `08783eb3bb2e35b48dab3481e17d6e345d43bab8b8dee25bb5ff184ba46cb632750d4c38e9982366050aecce6e121c67bb6812dbfd607216acd3a2d19e05f5a1`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-linux-s390x.tar.gz) | `bcb6eb9cd3d8c92dfaf4f102ff2dc7517f632b1e955be6a02e7f223b15fc09c4ca2d6d9cd5b23871168cf6b455e2368daf17025c9cd61bf43d2ea72676db913a`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-windows-386.tar.gz) | `efbc764d8e2889ce13c9eaaa61f685a8714563ddc20464523140d6f5bef0dfd51b745c3bd3fe2093258db242bf9b3207f8e9f451b0484de64f18cdb7162ec30e`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-client-windows-amd64.tar.gz) | `b34bce694c6a0e4c8c5ddabcecb6adcb4d35f8c126b4b5ced7e44ef39cd45982dd9f6483a38e04430846f4da592dc74b475c37da7fe08444ef4eb5efde85e0b2`

<!--
### Server Binaries
-->
### 服务器端可执行文件

<!--
filename | sha512 hash
文件名 | sha512 hash
-->

文件名 | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-server-linux-amd64.tar.gz) | `a6bdac1eba1b87dc98b2bf5bf3690758960ecb50ed067736459b757fca0c3b01dd01fd215b4c06a653964048c6a81ea80b61ee8c7e4c98241409c091faf0cee1`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-server-linux-arm.tar.gz) | `0560e1e893fe175d74465065d43081ee7f40ba7e7d7cafa53e5d7491f89c61957cf0d3abfa4620cd0f33b6e44911b43184199761005d20b72e3cd2ddc1224f9f`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-server-linux-arm64.tar.gz) | `4d5dd001fa3ac2b28bfee64e85dbedab0706302ffd634c34330617674e7a90e0108710f4248a2145676bd72f0bbc3598ed61e1e739c64147ea00d3b6a4ba4604`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-server-linux-ppc64le.tar.gz) | `cc642fca57e22bf6edd371e61e254b369b760c67fa00cac50e34464470f7eea624953deff800fa1e4f7791fe06791c48dbba3ed47e789297ead889c2aa7b2bbf`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-server-linux-s390x.tar.gz) | `1f480ba6f593a3aa20203e82e9e34ac206e35839fd9135f495c5d154480c57d1118673dcb5a6b112c18025fb4a847f65dc7aac470f01d2f06ad3da6aa63d98a3`

<!--
### Node Binaries
-->
### 节点可执行文件

<!--
filename | sha512 hash
文件名 | sha512 hash
-->

文件名 | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-node-linux-amd64.tar.gz) | `e987f141bc0a248e99a371ce220403b78678c739a39dad1c1612e63a0bee4525fbca5ee8c2b5e5332a553cc5f63bce9ec95645589298f41fe83e1fd41faa538e`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-node-linux-arm.tar.gz) | `8b084c1063beda2dd4000e8004634d82e580f05cc300c2ee13ad84bb884987b2c7fd1f033fb2ed46941dfc311249acef06efe5044fb72dc4b6089c66388e1f61`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-node-linux-arm64.tar.gz) | `365bdf9759e24d22cf507a0a5a507895ed44723496985e6d8f0bd10b03ffe7c78198732ee39873912147f2dd840d2e284118fc6fc1e3876d8f4c2c3a441def0b`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-node-linux-ppc64le.tar.gz) | `ff54d83dd0fd3c447cdd76cdffd253598f6800045d2b6b91b513849d15b0b602590002e7fe2a55dc25ed5a05787f4973c480126491d24be7c5fce6ce98d0b6b6`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-node-linux-s390x.tar.gz) | `527cd9bf4bf392c3f097f232264c0f0e096ac410b5211b0f308c9d964f86900f5875012353b0b787efc9104f51ad90880f118efb1da54eba5c7675c1840eae5f`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0/kubernetes-node-windows-amd64.tar.gz) | `4f76a94c70481dd1d57941f156f395df008835b5d1cc17708945e8f560234dbd426f3cff7586f10fd4c24e14e3dfdce28e90c8ec213c23d6ed726aec94e9b0ff`

<!--
# Kubernetes v1.16.0 Release Notes
-->
# Kubernetes v1.16.0 发行说明

<!--
A complete changelog for the release notes is now hosted in a customizable format at [relnotes.k8s.io](https://relnotes.k8s.io/?releaseVersions=1.16.0). Check it out and please give us your feedback!
-->
[relnotes.k8s.io](https://relnotes.k8s.io/?releaseVersions=1.16.0) 现已以可自定义的格式托管了发行说明的完整变更日志，请查看链接并向我们提供反馈！

<!--
## What’s New (Major Themes)
-->
## 新增功能（主要主题）

<!--
We’re pleased to announce the delivery of Kubernetes 1.16, our third release of 2019! Kubernetes 1.16 consists of 31 enhancements: 8 enhancements moving to stable, 8 enhancements in beta, and 15 enhancements in alpha.
-->
我们很高兴宣布 Kubernetes 1.16 的交付，这是我们 2019 年的第三版！Kubernetes 1.16 由 31 个增强功能组成：8 个进入稳定，8 个进入 Beta，15 个进入 Alpha。

<!--
The main themes of this release are:
-->
Kubernetes 1.16 版本的四大主题如下：

<!--
- **Custom resources:** CRDs are in widespread use as a way to extend Kubernetes to persist and serve new resource types, and have been available in beta since the 1.7 release. The 1.16 release marks the graduation of CRDs to general availability (GA).
- **Admission webhooks:** Admission webhooks are in widespread use as a Kubernetes extensibility mechanism and have been available in beta since the 1.9 release. The 1.16 release marks the graduation of admission webhooks to general availability (GA).
- **Overhauled metrics**: Kubernetes has previously made extensive use of a global metrics registry to register metrics to be exposed. By implementing a metrics registry, metrics are registered in more transparent means. Previously, Kubernetes metrics have been excluded from any kind of stability requirements.
- **Volume Extension**: There are quite a few enhancements in this release that pertain to volumes and volume modifications. Volume resizing support in CSI specs is moving to beta which allows for any CSI spec volume plugin to be resizable.
-->
- **Custom resources:** CRD 是对 Kubernetes 持久性的扩展，用以服务于新的资源类型，自 1.7 版本以来，CRD 已经在 Beta 版中可用。在 1.16 版本中，CRD 正式步入通用可用性（GA）
- **Admission webhooks:** Admission webhooks 作为 Kubernetes 扩展机制被广泛使用，并且自 1.9 版本以来已经在 Beta 版中可用。在 1.16 版本中，Admission webhook 也正式步入通用可用性（GA）。
- **Overhauled metrics**: Kubernetes 广泛使用一个全局 metrics registry 来注册要公开的 metrics。通过实现 metrics registry，metrics 可以以更透明的方式注册。而在这之前，Kubernetes metrics 被排除在任何稳定性需求之外。
- **Volume Extension**: 新版本有大量和 Volume（卷）及 Volume 修改相关的增强。CSI 规范中对 Volume 调整的支持正在转向 Beta 版，它允许任何 CSI 规范卷插件都可以调整大小。

<!--
### Additional Notable Feature Updates
-->
### 其他值得注意的功能更新

<!--
- [Topology Manager](https://github.com/kubernetes/enhancements/issues/693), a new Kubelet component, aims to co-ordinate resource assignment decisions to provide optimized resource allocations.
- [IPv4/IPv6 dual-stack](https://kubernetes.io/docs/concepts/services-networking/dual-stack) enables the allocation of both IPv4 and IPv6 addresses to Pods and Services.
- [API Server Network Proxy](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/20190226-network-proxy.md) going alpha in 1.16.
- [Extensions](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/20190422-cloud-controller-manager-migration.md) for Cloud Controller Manager Migration.
- Continued deprecation of extensions/v1beta1, apps/v1beta1, and apps/v1beta2 APIs; these extensions will be retired in 1.16!
-->
- [拓扑管理器（Topology Manager）](https://github.com/kubernetes/enhancements/issues/693) 是一个新的 Kubelet 组件，旨在协调资源分配决策，以提供优化的资源分配。
- [IPv4/IPv6 双栈](https://kubernetes.io/docs/concepts/services-networking/dual-stack) 允许将 IPv4 和 IPv6 地址分配给 Pod 和服务。
- [API 服务器网络代理](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/20190226-network-proxy.md) 在 1.16 版本中进入 Alpha。
- [拓展（Extensions）](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/20190422-cloud-controller-manager-migration.md) 为 Cloud Controller Manager 迁移提供的扩展。
- 继续淘汰 extensions/v1beta1、apps/v1beta1 和 apps/v1beta2 API，这些扩展会在 1.16 版本中被弃用！

<!--
## Known Issues
-->
## 已知的问题

<!--
- The etcd and KMS plugin health checks are not exposed in the new `livez` and `readyz` endpoints. This will be fixed in 1.16.1.
- Systems running `iptables` 1.8.0 or newer should start it in legacy mode. Please note that this affects all versions of Kubernetes and not only v1.16.0. For more detailed information about the issue and how to apply a workaround, please refer to the official documentation
- Generating informers for packages in directories containing dots in their name is broken. This will be fixed in v1.16.1. ([#82860](https://github.com/kubernetes/kubernetes/issues/82860))
-->
- etcd 和 KMS 插件的健康检查没有在新的 `livez` 和 `readyz` 端点中公开。这将在 v1.16.1 中得到修正。
- 运行 `iptables` 1.8.0 或更新版本的系统应以兼容模式启动它。请注意，这将影响所有版本的 Kubernetes，而不仅仅是 v1.16.0。有关此问题以及如何应用解决方法的更多详细信息，请参阅官方文档。
- 在名称中包含点的目录中生成软件包的通知程序已损坏，这将在 v1.16.1 中修复。请参考 ([#82860](https://github.com/kubernetes/kubernetes/issues/82860))。

<!--
## Urgent Upgrade Notes
-->
## 紧急升级须知

<!--
### (No, really, you MUST read this before you upgrade)
-->
### 注意！此内容为升级前必读！

<!--
#### Cluster Lifecycle
-->
#### 集群生命周期

<!--
- Container images tar files for `amd64` will now contain the architecture in the RepoTags manifest.json section.
  If you are using docker manifests there are not visible changes. ([#80266](https://github.com/kubernetes/kubernetes/pull/80266), [@javier-b-perez](https://github.com/javier-b-perez))
-->
- `amd64` 的容器镜像 tar 文件现在将在 manifest.json 的 RepoTags 节中给出体系结构。如果你正在使用 Docker 清单，则此变更对你没有影响。见 ([#80266](https://github.com/kubernetes/kubernetes/pull/80266)、[@javier-b-perez](https://github.com/javier-b-perez))。
<!--
- kubeadm now deletes the bootstrap-kubelet.conf file after TLS bootstrap
  User relying on bootstrap-kubelet.conf should switch to kubelet.conf that contains node credentials ([#80676](https://github.com/kubernetes/kubernetes/pull/80676), [@fabriziopandini](https://github.com/fabriziopandini))
-->
- kubeadm 现在会在 TLS 启动引导完成之后删除 bootstrap-kubelet.conf 文件，依赖于 bootstrap-kubelet.conf 文件的用户应该切换到包含节点凭证的 kubelet.conf 文件。见 ([#80676](https://github.com/kubernetes/kubernetes/pull/80676)、[@fabriziopandini](https://github.com/fabriziopandini))。
<!--
- Node labels `beta.kubernetes.io/metadata-proxy-ready`, `beta.kubernetes.io/metadata-proxy-ready` and `beta.kubernetes.io/kube-proxy-ds-ready` are no longer added on new nodes.
  - ip-mask-agent addon starts to use the label `node.kubernetes.io/masq-agent-ds-ready` instead of `beta.kubernetes.io/masq-agent-ds-ready` as its node selector.
  - kube-proxy addon starts to use the label `node.kubernetes.io/kube-proxy-ds-ready` instead of `beta.kubernetes.io/kube-proxy-ds-ready` as its node selector.
  - metadata-proxy addon starts to use the label `cloud.google.com/metadata-proxy-ready` instead of `beta.kubernetes.io/metadata-proxy-ready` as its node selector.
-->
- `beta.kubernetes.io/metadata-proxy-ready`、`beta.kubernetes.io/metadata-proxy-ready` 和 `beta.kubernetes.io/kube-proxy-ds-ready`（节点标签）不再添加到新节点上。
  - ip-mask-agent 插件开始使用标签 `node.kubernetes.io/masq-agent-ds-ready` 代替 `beta.kubernetes.io/masq-agent-ds-ready` 作为其节点选择器；
  - kube-proxy 插件开始使用标签 `node.kubernetes.io/kube-proxy-ds-ready` 代替 `beta.kubernetes.io/kube-proxy-ds-ready` 作为其节点选择器；
  - metadata-proxy 插件开始使用标签 `cloud.google.com/metadata-proxy-ready` 代替 `beta.kubernetes.io/metadata-proxy-ready` 作为其节点选择器；

<!--
#### Storage
-->
#### 存储

<!--
- When PodInfoOnMount is enabled for a CSI driver, the new csi.storage.k8s.io/ephemeral parameter in the volume context allows a driver's NodePublishVolume implementation to determine on a case-by-case basis whether the volume is ephemeral or a normal persistent volume ([#79983](https://github.com/kubernetes/kubernetes/pull/79983), [@pohly](https://github.com/pohly))
- Add CSI Migration Shim for VerifyVolumesAreAttached and BulkVolumeVerify ([#80443](https://github.com/kubernetes/kubernetes/pull/80443), [@davidz627](https://github.com/davidz627))
- Promotes VolumePVCDataSource (Cloning) feature to beta for 1.16 release ([#81792](https://github.com/kubernetes/kubernetes/pull/81792), [@j-griffith](https://github.com/j-griffith))
- Integrated volume limits for in-tree and CSI volumes into one scheduler predicate. ([#77595](https://github.com/kubernetes/kubernetes/pull/77595), [@bertinatto](https://github.com/bertinatto))
-->
- 当为 CSI 驱动启用 PodInfoOnMount 时，Volume（卷）上下文中新的 csi.storage.k8s.io/ephemeral 参数允许驱动程序的 NodePublishVolume 实现根据具体情况确定该卷是临时性的还是正常的持久卷。见 ([#79983](https://github.com/kubernetes/kubernetes/pull/79983)、[@pohly](https://github.com/pohly))。
- 为 VerifyVolumesAreAttached 和 BulkVolumeVerify 添加 CSI 迁移铺垫。见 ([#80443](https://github.com/kubernetes/kubernetes/pull/80443)、[@davidz627](https://github.com/davidz627))。
- 新版本将 VolumePVCDataSource（克隆）特性提升到 Beta 版。见 ([#81792](https://github.com/kubernetes/kubernetes/pull/81792)、[@j-griffith](https://github.com/j-griffith))。
- 将 in-tree 和 CSI（Volume）卷的（Volume）限制集成到一个调度器条件（Scheduler Predicate）。见 ([#77595](https://github.com/kubernetes/kubernetes/pull/77595)、[@bertinatto](https://github.com/bertinatto))。

<!--
## Deprecations and Removals
-->
## 弃用和移除

- API

  <!--
  - The following APIs are no longer served by default:
  -->
  - 默认情况下不再提供以下 API：

    <!--
    - All resources under `apps/v1beta1` and `apps/v1beta2` - use `apps/v1` instead
    - `daemonsets`, `deployments`, `replicasets` resources under `extensions/v1beta1` - use `apps/v1` instead
    - `networkpolicies` resources under `extensions/v1beta1` - use `networking.k8s.io/v1` instead
    - `podsecuritypolicies` resources under `extensions/v1beta1` - use `policy/v1beta1` instead
    -->
    - `apps/v1beta1` 和 `apps/v1` 下的所有资源 - 改用 `apps/v1`
    - `extensions/v1beta1` 下的资源 `daemonsets`、`deployments`、`replicasets` - 改用 `apps/v1`
    - `extensions/v1beta1` 下的资源 `networkpolicies` - 改用 `networking.k8s.io/v1`
    - `extensions/v1beta1` 下的资源 `podsecuritypolicies` - 改用 `policy/v1beta1`

    <!--
    Serving these resources can be temporarily re-enabled using the `--runtime-config` apiserver flag.
    -->
    可以使用 `--runtime-config` apiserver 参数临时重新启用服务这些资源。

    - `apps/v1beta1=true`
    - `apps/v1beta2=true`
    - `extensions/v1beta1/daemonsets=true,extensions/v1beta1/deployments=true,extensions/v1beta1/replicasets=true,extensions/v1beta1/networkpolicies=true,extensions/v1beta1/podsecuritypolicies=true`

    <!--
    The ability to serve these resources will be completely removed in v1.18. ([#70672](https://github.com/kubernetes/kubernetes/pull/70672), [@liggitt](https://github.com/liggitt))
    -->
    v1.18 中将完全删除提供这些资源的功能。见 ([#70672](https://github.com/kubernetes/kubernetes/pull/70672)、[@liggitt](https://github.com/liggitt))。

  <!--
  - Ingress resources will no longer be served from `extensions/v1beta1` in v1.20. Migrate use to the `networking.k8s.io/v1beta1` API, available since v1.14. Existing persisted data can be retrieved via the `networking.k8s.io/v1beta1` API.
  - PriorityClass resources will no longer be served from `scheduling.k8s.io/v1beta1` and `scheduling.k8s.io/v1alpha1` in v1.17. Migrate to the `scheduling.k8s.io/v1` API, available since v1.14. Existing persisted data can be retrieved via the `scheduling.k8s.io/v1` API.
  -->
  - v1.20 中的 `extensions/v1beta1` 将不再提供 Ingress 资源。请迁移到自 v1.14 起可用的 `networking.k8s.io/v1beta1` API。可以通过 `networking.k8s.io/v1beta1` API 检索现有的持久数据。
  - v1.17 中将不再从 `scheduling.k8s.io/v1beta1` 和 `scheduling.k8s.io/v1alpha1` 提供 PriorityClass 资源。请迁移到自 v1.14 起可用的 `scheduling.k8s.io/v1` API。可以通过 `scheduling.k8s.io/v1` API 检索现有的持久数据。
  <!--
  - The `export` query parameter for list API calls, deprecated since v1.14, will be removed in v1.18.
  - The `series.state` field in the events.k8s.io/v1beta1 Event API is deprecated and will be removed in v1.18 ([#75987](https://github.com/kubernetes/kubernetes/pull/75987), [@yastij](https://github.com/yastij))
  - The `apiextensions.k8s.io/v1beta1` version of `CustomResourceDefinition` is deprecated and will no longer be served in v1.19. Use `apiextensions.k8s.io/v1` instead. ([#79604](https://github.com/kubernetes/kubernetes/pull/79604), [@liggitt](https://github.com/liggitt))
  -->
  - 自 v1.14 起已弃用的 list API 调用的 `export` 查询参数将在 v1.18 中删除。
  - events.k8s.io/v1beta1 事件 API 中的 `series.state` 字段已弃用，并将在 v1.18 中删除。见 ([#75987](https://github.com/kubernetes/kubernetes/pull/75987)、[@yastij](https://github.com/yastij))。
  - `CustomResourceDefinition` 的 `apiextensions.k8s.io/v1beta1` 版本已弃用，在 v1.19 中将不再提供，请改用 `apiextensions.k8s.io/v1`。见 ([#79604](https://github.com/kubernetes/kubernetes/pull/79604)、[@liggitt](https://github.com/liggitt))。
  <!--
  - The `admissionregistration.k8s.io/v1beta1` versions of `MutatingWebhookConfiguration` and `ValidatingWebhookConfiguration` are deprecated and will no longer be served in v1.19. Use `admissionregistration.k8s.io/v1` instead. ([#79549](https://github.com/kubernetes/kubernetes/pull/79549), [@liggitt](https://github.com/liggitt))
  - The alpha `metadata.initializers` field, deprecated in 1.13, has been removed. ([#79504](https://github.com/kubernetes/kubernetes/pull/79504), [@yue9944882](https://github.com/yue9944882))
  - The deprecated node condition type `OutOfDisk` has been removed. Use the `DiskPressure` condition instead. ([#72420](https://github.com/kubernetes/kubernetes/pull/72420), [@Pingan2017](https://github.com/Pingan2017))
  -->
  - `MutatingWebhookConfiguration` 和 `ValidatingWebhookConfiguration` 的 `admissionregistration.k8s.io/v1beta1` 版本已弃用，在 v1.19 中将不再提供。请改用 `admissionregistration.k8s.io/v1`。见 ([#79549](https://github.com/kubernetes/kubernetes/pull/79549)、[@liggitt](https://github.com/liggitt))。
  - 在 v1.13 版本中弃用的 alpha `metadata.initializers` 字段已被删除。见 ([#79504](https://github.com/kubernetes/kubernetes/pull/79504)、[@yue9944882](https://github.com/yue9944882))。
  - 已弃用的节点条件类型 `OutOfDisk` 已被删除，请改用 `DiskPressure`。([#72420](https://github.com/kubernetes/kubernetes/pull/72420)、[@Pingan2017](https://github.com/Pingan2017))。
  <!--
  - The `metadata.selfLink` field is deprecated in individual and list objects. It will no longer be returned starting in v1.20, and the field will be removed entirely in v1.21. ([#80978](https://github.com/kubernetes/kubernetes/pull/80978), [@wojtek-t](https://github.com/wojtek-t))
  - The deprecated cloud providers `ovirt`, `cloudstack` and `photon` have been removed ([#72178](https://github.com/kubernetes/kubernetes/pull/72178), [@dims](https://github.com/dims))
  - The `Cinder` and `ScaleIO` volume providers have been deprecated and will be removed in a future release. ([#80099](https://github.com/kubernetes/kubernetes/pull/80099), [@dims](https://github.com/dims))
  - The GA `PodPriority` feature gate is now on by default and cannot be disabled. The feature gate will be removed in v1.18. ([#79262](https://github.com/kubernetes/kubernetes/pull/79262), [@draveness](https://github.com/draveness))
  -->
  - `metadata.selfLink` 字段在单个和列表对象中已弃用。从 v1.20 开始将不再返回该字段，而在 v1.21 中将完全删除该字段。见 ([#80978](https://github.com/kubernetes/kubernetes/pull/80978)、[@wojtek-t](https://github.com/wojtek-t))。
  - 已弃用的云提供商 `ovirt`、`cloudstack` 和 `photon` 已被删除。见 ([#72178](https://github.com/kubernetes/kubernetes/pull/72178), [@dims](https://github.com/dims))。
  - `Cinder` 和 `ScaleIO` volume（卷）驱动已被弃用，并将在以后的版本中删除。见 ([#80099](https://github.com/kubernetes/kubernetes/pull/80099), [@dims](https://github.com/dims))。
  - GA 版本中的 `PodPriority` 特性开关现在默认情况下处于打开状态，无法禁用。`PodPriority` 特性开关将在 v1.18 中删除。见 ([#79262](https://github.com/kubernetes/kubernetes/pull/79262), [@draveness](https://github.com/draveness))。
  <!--
  - Aggregated discovery requests can now timeout. Aggregated API servers must complete discovery calls within 5 seconds (other requests can take longer). Use the feature gate `EnableAggregatedDiscoveryTimeout=false` to temporarily revert behavior to the previous 30 second timeout if required (the temporary `EnableAggregatedDiscoveryTimeout` feature gate will be removed in v1.17). ([#82146](https://github.com/kubernetes/kubernetes/pull/82146), [@deads2k](https://github.com/deads2k))
  - the `scheduler.alpha.kubernetes.io/critical-pod` annotation is removed. Pod priority (`spec.priorityClassName`) should be used instead to mark pods as critical. ([#80342](https://github.com/kubernetes/kubernetes/pull/80342), [@draveness](https://github.com/draveness))
  - the NormalizeScore plugin set is removed from scheduler framework config API. Use ScorePlugin only. ([#80930](https://github.com/kubernetes/kubernetes/pull/80930), [@liu-cong](https://github.com/liu-cong))
  -->
  - 聚合的发现请求现在允许超时。聚合的 API 服务器必须在 5 秒钟内完成发现调用（其他请求可能需要更长的时间）。如果需要的话，使用 `EnableAggregatedDiscoveryTimeout=false` 将行为暂时恢复到之前的 30 秒超时（临时 `EnableAggregatedDiscoveryTimeout` 特性开关将在 v1.17 中删除）。见 ([#82146](https://github.com/kubernetes/kubernetes/pull/82146)、[@deads2k](https://github.com/deads2k))。
  - `scheduler.alpha.kubernetes.io/critical-pod` 注解将被删除。应该使用 Pod 优先级（`spec.priorityClassName`）来将 Pod 标记为关键。见 ([#80342](https://github.com/kubernetes/kubernetes/pull/80342)、[@draveness](https://github.com/draveness))。
  - 已从调度程序框架配置 API 中删除了 NormalizeScore 插件集合。仅使用 ScorePlugin。见 ([#80930](https://github.com/kubernetes/kubernetes/pull/80930)、[@liu-cong](https://github.com/liu-cong))。

<!--
- Features:

  - The following features are now GA, and the associated feature gates are deprecated and will be removed in v1.17:
    - `GCERegionalPersistentDisk` (since 1.15.0)
    - `CustomResourcePublishOpenAPI`
    - `CustomResourceSubresources`
    - `CustomResourceValidation`
    - `CustomResourceWebhookConversion`
  - The feature flags `HugePages`, `VolumeScheduling`, `CustomPodDNS` and `PodReadinessGates` have been removed ([#79307](https://github.com/kubernetes/kubernetes/pull/79307), [@draveness](https://github.com/draveness))
-->
- 功能：

  - 现在，以下功能已成为 GA；相关的特性开关已弃用，并将在 v1.17 中删除：
    - `GCERegionalPersistentDisk` (从 1.15.0 开始)
    - `CustomResourcePublishOpenAPI`
    - `CustomResourceSubresources`
    - `CustomResourceValidation`
    - `CustomResourceWebhookConversion`
  - 功能参数 `HugePages`、`VolumeScheduling`、`CustomPodDNS` 和 `PodReadinessGates` 已被删除。见 ([#79307](https://github.com/kubernetes/kubernetes/pull/79307)、[@draveness](https://github.com/draveness))。

- hyperkube

  <!--
  - the `--make-symlinks` flag, deprecated in v1.14, has been removed. ([#80017](https://github.com/kubernetes/kubernetes/pull/80017), [@Pothulapati](https://github.com/Pothulapati))
  -->
  - v1.14 中弃用的 `--make-symlinks` 参数已被删除。见 ([#80017](https://github.com/kubernetes/kubernetes/pull/80017)、[@Pothulapati](https://github.com/Pothulapati))。

- kube-apiserver

  <!--
  - the `--basic-auth-file` flag and authentication mode is deprecated and will be removed in a future release. It is not recommended for production environments. ([#81152](https://github.com/kubernetes/kubernetes/pull/81152), [@tedyu](https://github.com/tedyu))
  - the `--cloud-provider-gce-lb-src-cidrs` flag has been deprecated. This flag will be removed once the GCE Cloud Provider is removed from kube-apiserver. ([#81094](https://github.com/kubernetes/kubernetes/pull/81094), [@andrewsykim](https://github.com/andrewsykim))
  - the `--enable-logs-handler` flag and log-serving functionality is deprecated since v1.15, and scheduled to be removed in v1.19. ([#77611](https://github.com/kubernetes/kubernetes/pull/77611), [@rohitsardesai83](https://github.com/rohitsardesai83))
  - Deprecate the default service IP CIDR. The previous default was `10.0.0.0/24` which will be removed in 6 months/2 releases. Cluster admins must specify their own desired value, by using `--service-cluster-ip-range` on kube-apiserver. ([#81668](https://github.com/kubernetes/kubernetes/pull/81668), [@darshanime](https://github.com/darshanime))
  -->
  - `--basic-auth-file` 参数和身份验证模式已弃用，在以后的版本中将被删除。所以不建议在生产环境中使用。见 ([#81152](https://github.com/kubernetes/kubernetes/pull/81152), [@tedyu](https://github.com/tedyu))。
  - `--cloud-provider-gce-lb-src-cidrs` 参数已被弃用。一旦从 kube-apiserver 中删除了 GCE 云提供商，该参数将被删除。见 ([#81094](https://github.com/kubernetes/kubernetes/pull/81094), [@andrewsykim](https://github.com/andrewsykim))。
  - 从 v1.15 开始不推荐使用 `--enable-logs-handler` 参数和日志服务功能，并计划在 v1.19 中将其删除。见 ([#77611](https://github.com/kubernetes/kubernetes/pull/77611), [@rohitsardesai83](https://github.com/rohitsardesai83))。
  - 弃用默认服务 IP CIDR。先前的默认值为 10.0.0.0/24，将在 6 个月或者 2 个发行版中删除。集群管理员必须通过在 kube-apiserver 上使用 `--service-cluster-ip-range` 来指定自己的 IP 期望值。见 ([#81668](https://github.com/kubernetes/kubernetes/pull/81668), [@darshanime](https://github.com/darshanime))。

- kube-proxy

  <!--
  - the `--resource-container` flag has been removed from kube-proxy, and specifying it will now cause an error. The behavior is now as if you specified `--resource-container=""`. If you previously specified a non-empty `--resource-container`, you can no longer do so as of kubernetes 1.16. ([#78294](https://github.com/kubernetes/kubernetes/pull/78294), [@vllry](https://github.com/vllry))
  -->
  - `--resource-container` 参数已从 kube-proxy 中删除，现在指定它会导致错误。现在的行为就好像你指定了 `--resource-container=""`。如果以前指定了非空 `--resource-container`，则从 kubernetes 1.16 开始，你将无法再这样做。见 ([#78294](https://github.com/kubernetes/kubernetes/pull/78294)、[@vllry](https://github.com/vllry))。

- kube-scheduler

  <!--
  - Migrate scheduler to use v1beta1 Event API. any tool targeting scheduler events needs to use v1beta1 Event API ([#78447](https://github.com/kubernetes/kubernetes/pull/78447), [@yastij](https://github.com/yastij))
  -->
  - 调度程序开始使用 v1beta1 Event API。任何针对调度程序事件的工具都需要使用 v1beta1 事件 API。见 ([#78447](https://github.com/kubernetes/kubernetes/pull/78447)、[@yastij](https://github.com/yastij))。

- kubeadm

  <!--
  - The CoreDNS Deployment now checks readiness via the `ready` plugin.
  - The `proxy` plugin has been deprecated. The `forward` plugin is to be used instead.
  - `kubernetes` plugin removes the `resyncperiod` option.
  - The `upstream` option is deprecated and ignored if included.
    ([#82127](https://github.com/kubernetes/kubernetes/pull/82127), [@rajansandeep](https://github.com/rajansandeep))
  -->
  - 现在，CoreDNS Deployment 通过 `ready` 插件检查准备情况。
  - `proxy` 插件已被弃用，可以使用 `forward` 插件。
  - `kubernetes` 插件删除了 `resyncperiod` 选项。
  - `upstream` 选项已被弃用，如果包含的话，则忽略。见 ([#82127](https://github.com/kubernetes/kubernetes/pull/82127), [@rajansandeep](https://github.com/rajansandeep))。

- kubectl

  <!--
  - `kubectl convert`, deprecated since v1.14, will be removed in v1.17.
  - The `--export` flag for the `kubectl get` command, deprecated since v1.14, will be removed in v1.18.
  - `kubectl cp` no longer supports copying symbolic links from containers; to support this use case, see `kubectl exec --help` for examples using `tar` directly ([#82143](https://github.com/kubernetes/kubernetes/pull/82143), [@soltysh](https://github.com/soltysh))
  - Removed deprecated flag `--include-uninitialized`. ([#80337](https://github.com/kubernetes/kubernetes/pull/80337), [@draveness](https://github.com/draveness))
  -->
  - 从 v1.14 开始不推荐使用 `kubectl convert`，该参数将在 v1.17 中删除。
  - 从 v1.14 开始不推荐使用 `kubectl get` 命令的 `--export`，该参数将在 v1.18 中删除。
  - `kubectl cp` 不再支持从容器复制符号链接；要支持此用例，请参阅 `kubectl exec --help` 获取直接使用 `tar` 的示例。见 ([#82143](https://github.com/kubernetes/kubernetes/pull/82143)、[@soltysh](https://github.com/soltysh))。
  - 删除不推荐使用的参数 `--include-uninitialized`。见 ([#80337](https://github.com/kubernetes/kubernetes/pull/80337)、[@draveness](https://github.com/draveness))。

- kubelet

  <!--
  - the `--containerized` flag was deprecated in 1.14 and has been removed ([#80043](https://github.com/kubernetes/kubernetes/pull/80043), [@dims](https://github.com/dims))
  - the `beta.kubernetes.io/os` and `beta.kubernetes.io/arch` labels, deprecated since v1.14, are targeted for removal in v1.18.
  - cAdvisor json endpoints have been deprecated since 1.15. ([#78504](https://github.com/kubernetes/kubernetes/pull/78504), [@dashpole](https://github.com/dashpole))
  - removed the ability to set `kubernetes.io`- or `k8s.io`-prefixed labels via `--node-labels`, other than the [specifically allowed labels/prefixes](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/0000-20170814-bounding-self-labeling-kubelets.md#proposal). ([#79305](https://github.com/kubernetes/kubernetes/pull/79305), [@paivagustavo](https://github.com/paivagustavo))
  -->
  - `--containerized` 参数在 v1.14 中已弃用，并且已被删除。见 ([#80043](https://github.com/kubernetes/kubernetes/pull/80043)、[@dims](https://github.com/dims))。
  - 从 v1.14 开始不推荐使用 `beta.kubernetes.io/os` 和 `beta.kubernetes.io/arch` 标签，这些标签将在 v1.18 中删除。
  - 从 v1.15 开始不推荐使用 cAdvisor json 端点。见 ([#78504](https://github.com/kubernetes/kubernetes/pull/78504)、[@dashpole](https://github.com/dashpole))。
  - 删除通过 `--node-labels` 设置 `kubernetes.io` 或 `k8s.io` 前缀的标签的功能，除了[明确允许的标签/前缀](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/0000-20170814-bounding-self-labeling-kubelets.md#proposal)。见 ([#79305](https://github.com/kubernetes/kubernetes/pull/79305)、[@paivagustavo](https://github.com/paivagustavo))。

- client-go
  <!--
  - Remove `DirectCodecFactory` (replaced with `serializer.WithoutConversionCodecFactory`), `DirectEncoder` (replaced with `runtime.WithVersionEncoder`) and `DirectDecoder` (replaced with `runtime.WithoutVersionDecoder`). ([#79263](https://github.com/kubernetes/kubernetes/pull/79263), [@draveness](https://github.com/draveness))
  -->
  - 删除 `DirectCodecFactory` (替换为 `serializer.WithoutConversionCodecFactory`)、`DirectEncoder` (替换为 `runtime.WithVersionEncoder`) 和 `DirectDecoder` (替换为 `runtime.WithoutVersionDecoder`)。见 ([#79263](https://github.com/kubernetes/kubernetes/pull/79263)、[@draveness](https://github.com/draveness))。

<!--
## Metrics Changes
-->
## 指标（Metrics）变化

<!--
### Added metrics
-->
### 新增的指标

<!--
- Added metrics `aggregator_openapi_v2_regeneration_count`, `aggregator_openapi_v2_regeneration_gauge` and `apiextension_openapi_v2_regeneration_count` counting the triggering APIService and CRDs and the reason (add, update, delete) when kube-apiserver regenerates the OpenAPI spec. ([#81786](https://github.com/kubernetes/kubernetes/pull/81786), [@sttts](https://github.com/sttts))
-->
- 添加了指标 `aggregator_openapi_v2_regeneration_count`、`aggregator_openapi_v2_regeneration_gauge` 和 `apiextension_openapi_v2_regeneration_count`，用于计算（添加，更新，删除）触发 APIServic e和 CRD 以及 kube-apiserver 重新生成 OpenAPI 规范时的原因。见 ([#81786](https://github.com/kubernetes/kubernetes/pull/81786)、[@sttts](https://github.com/sttts))。
<!--
- Added metrics `authentication_attempts` that can be used to understand the attempts of authentication. ([#81509](https://github.com/kubernetes/kubernetes/pull/81509), [@RainbowMango](https://github.com/RainbowMango))
-->
- 添加了可用于了解身份验证尝试的指标 `authentication_attempts`。见 ([#81509](https://github.com/kubernetes/kubernetes/pull/81509)、[@RainbowMango](https://github.com/RainbowMango))。
<!--
- Add a new counter metrics `apiserver_admission_webhook_rejection_count` with details about the causing for a webhook rejection. ([#81399](https://github.com/kubernetes/kubernetes/pull/81399), [@roycaihw](https://github.com/roycaihw))
-->
- 添加了新的计数指标 `apiserver_admission_webhook_rejection_count`，该指标详细说明了引起 webhook 拒绝的原因。见 ([#81399](https://github.com/kubernetes/kubernetes/pull/81399)、[@roycaihw](https://github.com/roycaihw))。
<!--
- NFS Drivers are now enabled to collect metrics, StatFS metrics provider is used to collect the metrics. (@brahmaroutu) ([#75805](https://github.com/kubernetes/kubernetes/pull/75805), [@brahmaroutu](https://github.com/brahmaroutu))
-->
- 现在已启用 NFS 驱动程序来收集指标,StatFS 指标提供程序用于收集指标。见 ([#75805](https://github.com/kubernetes/kubernetes/pull/75805)、[@brahmaroutu](https://github.com/brahmaroutu))。
<!--
- Add `container_sockets`, `container_threads`, and `container_threads_max` metrics ([#81972](https://github.com/kubernetes/kubernetes/pull/81972), [@dashpole](https://github.com/dashpole))
-->
- 添加了指标 `container_sockets`、`container_threads` 和 `container_threads_max`。见 ([#81972](https://github.com/kubernetes/kubernetes/pull/81972)、[@dashpole](https://github.com/dashpole))。
<!--
- Add `container_state` label to `running_container_count` kubelet metrics, to get count of containers based on their state(running/exited/created/unknown) ([#81573](https://github.com/kubernetes/kubernetes/pull/81573), [@irajdeep](https://github.com/irajdeep))
- Added metric `apiserver_watch_events_total` that can be used to understand the number of watch events in the system. ([#78732](https://github.com/kubernetes/kubernetes/pull/78732), [@mborsz](https://github.com/mborsz))
-->
- 在 kubelet `running_container_count` 指标上添加了 `container_state` 标签，以根据容器的状态（running/exited/created/unknown）获得容器的数量。见 ([#81573](https://github.com/kubernetes/kubernetes/pull/81573)、[@irajdeep](https://github.com/irajdeep))。
- 添加了指标 `apiserver_watch_events_total`，可用于了解系统中监视事件的数量。见 ([#78732](https://github.com/kubernetes/kubernetes/pull/78732)、[@mborsz](https://github.com/mborsz))。
<!--
- Added metric `apiserver_watch_events_sizes` that can be used to estimate sizes of watch events in the system. ([#80477](https://github.com/kubernetes/kubernetes/pull/80477), [@mborsz](https://github.com/mborsz))
-->
- 添加了指标 `apiserver_watch_events_sizes`，可用于估计系统中监视事件的大小。见 ([#80477](https://github.com/kubernetes/kubernetes/pull/80477)、[@mborsz](https://github.com/mborsz))。
<!--
- Added a new Prometheus counter metric `sync_proxy_rules_iptables_restore_failures_total` for kube-proxy iptables-restore failures (both ipvs and iptables modes)
  ([#81210](https://github.com/kubernetes/kubernetes/pull/81210), [@figo](https://github.com/figo))
- kubelet now exports an `kubelet_evictions` metric that counts the number of pod evictions carried out by the kubelet to reclaim resources ([#81377](https://github.com/kubernetes/kubernetes/pull/81377), [@sjenning](https://github.com/sjenning))
-->
- 为 kube-proxy iptables-restore 失败（ipvs 和 iptables 模式）添加了新的 Prometheus 计数器指标 `sync_proxy_rules_iptables_restore_failures_total`。见 ([#81210](https://github.com/kubernetes/kubernetes/pull/81210)、[@figo](https://github.com/figo))。
- 现在，kubelet 提出指标 `kubelet_evictions`，该指标用于计算 kubelet 为回收资源而执行的驱逐 Pod 的次数。见 ([#81377](https://github.com/kubernetes/kubernetes/pull/81377)、[@sjenning](https://github.com/sjenning))。

<!--
### Removed metrics
-->
### 已删除的指标

<!--
- Removed cadvisor metric labels `pod_name` and `container_name` to match instrumentation guidelines. Any Prometheus queries that match `pod_name` and `container_name` labels (e.g. cadvisor or kubelet probe metrics) must be updated to use `pod` and `container` instead. ([#80376](https://github.com/kubernetes/kubernetes/pull/80376), [@ehashman](https://github.com/ehashman))
-->
- 删除了 cadvisor 指标标签 `pod_name` 和 `container_name` 以符合仪器指南。任何与 `pod_name` 和 `container_name` 标签匹配的 Prometheus 查询（例如 cadvisor 或 kubelet 探针指标）都必须更新为使用 `pod` 和 `container` 标签。见 ([#80376](https://github.com/kubernetes/kubernetes/pull/80376), [@ehashman](https://github.com/ehashman))。

<!--
### Deprecated/changed metrics
-->
### 被弃用或者更改的指标

<!--
- kube-controller-manager and cloud-controller-manager metrics are now marked as with the ALPHA stability level. ([#81624](https://github.com/kubernetes/kubernetes/pull/81624), [@logicalhan](https://github.com/logicalhan))
-->
- 现在，kube-controller-manager 和 cloud-controller-manager 指标已被标记为 ALPHA 稳定性级别。见 ([#81624](https://github.com/kubernetes/kubernetes/pull/81624)、[@logicalhan](https://github.com/logicalhan))。
<!--
- kube-proxy metrics are now marked as with the ALPHA stability level. ([#81626](https://github.com/kubernetes/kubernetes/pull/81626), [@logicalhan](https://github.com/logicalhan))
-->
- 现在，kube-proxy 指标已被标记为 ALPHA 稳定性级别。见 ([#81626](https://github.com/kubernetes/kubernetes/pull/81626)、[@logicalhan](https://github.com/logicalhan))。
<!--
- kube-apiserver metrics are now marked as with the ALPHA stability level. ([#81531](https://github.com/kubernetes/kubernetes/pull/81531), [@logicalhan](https://github.com/logicalhan))
-->
- 现在，kube-apiserver 指标已被标记为 ALPHA 稳定性级别。见 ([#81531](https://github.com/kubernetes/kubernetes/pull/81531)、[@logicalhan](https://github.com/logicalhan))。
<!--
- kubelet metrics for /metrics and /metrics/probes are now marked as with the ALPHA stability level. ([#81534](https://github.com/kubernetes/kubernetes/pull/81534), [@logicalhan](https://github.com/logicalhan))
-->
- /metrics 和 /metrics/probes 的 kubelet 指标已被标记为 ALPHA 稳定性级别。见 ([#81534](https://github.com/kubernetes/kubernetes/pull/81534)、[@logicalhan](https://github.com/logicalhan))。
<!--
- Scheduler metrics are now marked as with the ALPHA stability level. ([#81576](https://github.com/kubernetes/kubernetes/pull/81576), [@logicalhan](https://github.com/logicalhan))
-->
- Scheduler 指标已被标记为 ALPHA 稳定性级别。见 ([#81576](https://github.com/kubernetes/kubernetes/pull/81576)、[@logicalhan](https://github.com/logicalhan))。
<!--
- The `rejected` label in `apiserver_admission_webhook_admission_duration_seconds` metrices now properly indicates if the request was rejected. ([#81399](https://github.com/kubernetes/kubernetes/pull/81399), [@roycaihw](https://github.com/roycaihw))
-->
- 现在，`apiserver_admission_webhook_admission_duration_seconds` 指标中的 `rejected` 标签可以正确显示请求是否被拒绝。见 ([#81399](https://github.com/kubernetes/kubernetes/pull/81399)、[@roycaihw](https://github.com/roycaihw))。
<!--
- Fixed a bug in the CSI metrics that does not return not supported error when a CSI driver does not support metrics. ([#79851](https://github.com/kubernetes/kubernetes/pull/79851), [@jparklab](https://github.com/jparklab))
-->
- 修复了 CSI 指标中的错误，即当 CSI 驱动程序不支持指标时，指标不会返回不支持的错误。见 ([#79851](https://github.com/kubernetes/kubernetes/pull/79851)、[@jparklab](https://github.com/jparklab))。
<!--
- Fix disk stats in LXD using ZFS storage pool and CRI-O missing network metris bug ([#81972](https://github.com/kubernetes/kubernetes/pull/81972), [@dashpole](https://github.com/dashpole))
-->
- 修复了使用 ZFS 存储池时 LXD 中的磁盘统计信息错误和 CRI-O 缺少网络指标的错误。见 ([#81972](https://github.com/kubernetes/kubernetes/pull/81972)、[@dashpole](https://github.com/dashpole))。

<!--
## Notable Features
-->
## 重要功能

<!--
### Beta
-->
### Beta 功能

<!--
- Promote WatchBookmark feature to beta and enable it by default.
  With WatchBookmark feature, clients are able to request watch events with BOOKMARK type. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. ([#79786](https://github.com/kubernetes/kubernetes/pull/79786), [@wojtek-t](https://github.com/wojtek-t))
-->
- 将 WatchBookmark 功能升级为 Beta 功能并默认启用它。
  借助 WatchBookmark 功能，客户端可以请求具有 BOOKMARK 类型的监视事件。客户端不应该假定书签在任何特定的时间间隔内返回，也不能假定服务器将在会话期间发送任何 BOOKMARK 事件。见 ([#79786](https://github.com/kubernetes/kubernetes/pull/79786)、[@wojtek-t](https://github.com/wojtek-t))。
<!--
- The server-side apply feature is now beta ([#81956](https://github.com/kubernetes/kubernetes/pull/81956), [@apelisse](https://github.com/apelisse))
- Server-side apply will now use the openapi provided in the CRD validation field to help figure out how to correctly merge objects and update ownership. ([#77354](https://github.com/kubernetes/kubernetes/pull/77354), [@jennybuckley](https://github.com/jennybuckley))
-->
- 服务器端 apply 功能现在是 Beta 功能。见 ([#81956](https://github.com/kubernetes/kubernetes/pull/81956)、[@apelisse](https://github.com/apelisse))。
- 服务器端 apply 功能现在将使用 CRD 验证字段中提供的 openapi 来帮助弄清楚如何正确合并对象和更新所有权。见 ([#77354](https://github.com/kubernetes/kubernetes/pull/77354)、[@jennybuckley](https://github.com/jennybuckley))。
<!--
- The `CustomResourceDefaulting` feature is promoted to beta and enabled by default. Defaults may be specified in structural schemas via the `apiextensions.k8s.io/v1` API. See https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/&#35;specifying-a-structural-schema for details. ([#81872](https://github.com/kubernetes/kubernetes/pull/81872), [@sttts](https://github.com/sttts))
-->
- `CustomResourceDefaulting` 功能被提升为 Beta 功能并默认启用。可以通过 `apiextensions.k8s.io/v1` API 在结构模式中指定默认值。有关详细信息，请参见 https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/&#35;specifying-a-structural-schema。见 ([#81872](https://github.com/kubernetes/kubernetes/pull/81872)、[@sttts](https://github.com/sttts))。
<!--
- Finalizer Protection for Service LoadBalancers is now in beta (enabled by default). This feature ensures the Service resource is not fully deleted until the correlating load balancer resources are deleted. ([#81691](https://github.com/kubernetes/kubernetes/pull/81691), [@MrHohn](https://github.com/MrHohn))
- Graduating Windows GMSA support from alpha to beta ([#82110](https://github.com/kubernetes/kubernetes/pull/82110), [@wk8](https://github.com/wk8))
-->
- 服务负载均衡器的 Finalizer 保护现在处于 Beta（默认启用）功能。该功能确保在删除相关的负载均衡器资源之前，不会完全删除服务资源。见 ([#81691](https://github.com/kubernetes/kubernetes/pull/81691)、[@MrHohn](https://github.com/MrHohn))。
- 将 Windows GMSA 支持从 Alpha 升级到 Beta。见 ([#82110](https://github.com/kubernetes/kubernetes/pull/82110)、[@wk8](https://github.com/wk8))。

<!--
### Alpha
-->
### Alpha 功能

<!--
- Introduce a new admission controller for RuntimeClass. Initially, RuntimeClass will be used to apply the pod overhead associated with a given RuntimeClass to the Pod `spec` if a corresponding RuntimeClassName is specified. PodOverhead is an alpha feature as of Kubernetes 1.16. ([#78484](https://github.com/kubernetes/kubernetes/pull/78484), [@egernst](https://github.com/egernst))
-->
- 为 RuntimeClass 引入新的准入控制器。最初，如果指定了相应的 RuntimeClassName，则将使用 RuntimeClass 与给定 RuntimeClass 关联的 Pod 开销应用于 Pod `spec`。从 Kubernetes 1.16 开始，PodOverhead 是 Alpha 功能。见 ([#78484](https://github.com/kubernetes/kubernetes/pull/78484), [@egernst](https://github.com/egernst))。
<!--
- Introduction of the pod overhead feature to the scheduler. This functionality is alpha-level as of
  Kubernetes v1.16, and is only honored by servers that enable the PodOverhead feature.gate. ([#78319](https://github.com/kubernetes/kubernetes/pull/78319), [@egernst](https://github.com/egernst))
-->
- 将 Pod 开销功能引入调度程序。从 Kubernetes v1.16 开始，此功能为 alpha 级别，并且只有启用 PodOverhead 特性开关的服务器才能使用该功能。见 ([#78319](https://github.com/kubernetes/kubernetes/pull/78319)、[@egernst](https://github.com/egernst))。
<!--
- Ephemeral containers have been added in alpha. These temporary containers can be added to running pods for purposes such as debugging, similar to how `kubectl exec` runs a process in an existing container. Also like `kubectl exec`, no resources are reserved for ephemeral containers and they are not restarted when they exit. Note that container namespace targeting is not yet implemented, so [process namespace sharing](https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/) must be enabled to view process from other containers in the pod. ([#59484](https://github.com/kubernetes/kubernetes/pull/59484), [@verb](https://github.com/verb))
-->
- 临时容器已添加为 Alpha 功能。可以将这些临时容器添加到运行的 Pod 中，以进行调试之用，类似于 `kubectl exec` 如何在现有容器中运行进程。与 `kubectl exec` 一样，kubernetes 不为临时容器预留资源，并且这些容器退出时不会被重新启动。请注意，尚未实现容器命名空间定位，因此必须启用[进程命名空间共享](https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/)才能从 Pod 中的其他容器查看进程。见 ([#59484](https://github.com/kubernetes/kubernetes/pull/59484), [@verb](https://github.com/verb))。
<!--
- Pod spread constraints have been added in alpha. You can use these constraints to control how Pods are spread across the cluster among failure-domains. ([#77327](https://github.com/kubernetes/kubernetes/pull/77327), [#77760](https://github.com/kubernetes/kubernetes/pull/77760), [#77828](https://github.com/kubernetes/kubernetes/pull/77828), [#79062](https://github.com/kubernetes/kubernetes/pull/79062), [#80011](https://github.com/kubernetes/kubernetes/pull/80011), [#81068](https://github.com/kubernetes/kubernetes/pull/81068), [@Huang-Wei](https://github.com/Huang-Wei))
-->
- 作为 Alpha 功能，添加了 Pod 分布约束（Pod spread constraints）。可以使用这些约束来控制 Pod 如何在故障域之间跨集群分布。见 ([#77327](https://github.com/kubernetes/kubernetes/pull/77327)、[#77760](https://github.com/kubernetes/kubernetes/pull/77760)、[#77828](https://github.com/kubernetes/kubernetes/pull/77828)、[#79062](https://github.com/kubernetes/kubernetes/pull/79062)、[#80011](https://github.com/kubernetes/kubernetes/pull/80011)、[#81068](https://github.com/kubernetes/kubernetes/pull/81068)、[@Huang-Wei](https://github.com/Huang-Wei))

<!--
### CLI Improvements
-->
### CLI 的改进

<!--
- the new flag `--endpoint-updates-batch-period` in kube-controller-manager can be used to reduce the number of endpoints updates generated by pod changes. ([#80509](https://github.com/kubernetes/kubernetes/pull/80509), [@mborsz](https://github.com/mborsz))
-->
- kube-controller-manager 中的新参数 `--endpoint-updates-batch-period` 可用于减少由 Pod 更改生成的端点更新的数量。见 ([#80509](https://github.com/kubernetes/kubernetes/pull/80509)、[@mborsz](https://github.com/mborsz))。
<!--
- the kubectl `--all-namespaces` flag is now honored by `kubectl wait` ([#81468](https://github.com/kubernetes/kubernetes/pull/81468), [@ashutoshgngwr](https://github.com/ashutoshgngwr))
-->
- `kubectl wait` 支持 kubectl `--all-namespaces` 参数。见 ([#81468](https://github.com/kubernetes/kubernetes/pull/81468), [@ashutoshgngwr](https://github.com/ashutoshgngwr))。
<!--
- `kubectl get -w` now takes an `--output-watch-events` flag to indicate the event type (ADDED, MODIFIED, DELETED) ([#72416](https://github.com/kubernetes/kubernetes/pull/72416), [@liggitt](https://github.com/liggitt))
-->
- `kubectl get -w` 现在带有 `--output-watch-events` 参数来显示事件类型（已添加、已修改、已删除）。见 ([#72416](https://github.com/kubernetes/kubernetes/pull/72416), [@liggitt](https://github.com/liggitt))。
<!--
- Adds Endpoint Slice support for kubectl when discovery API group is enabled. ([#81795](https://github.com/kubernetes/kubernetes/pull/81795), [@robscott](https://github.com/robscott))
-->
- 启用发现 API 组时，添加对 kubectl 的端点切片支持。见 ([#81795](https://github.com/kubernetes/kubernetes/pull/81795)、[@robscott](https://github.com/robscott))。

<!--
### Misc
-->
### 其他杂项

<!--
- Add `--shutdown-delay-duration` to kube-apiserver in order to delay a graceful shutdown. `/healthz` will keep returning success during this time and requests are normally served, but `/readyz` will return failure immediately. This delay can be used to allow the SDN to update iptables on all nodes and stop sending traffic. ([#74416](https://github.com/kubernetes/kubernetes/pull/74416), [@sttts](https://github.com/sttts))
  Kubeadm now seamlessly migrates the CoreDNS Configuration when upgrading CoreDNS. ([#78033](https://github.com/kubernetes/kubernetes/pull/78033), [@rajansandeep](https://github.com/rajansandeep))
-->
- 将 `--shutdown-delay-duration` 添加到 kube-apiserver 中以延迟正常关闭。在这段时间内，`/healthz` 将继续返回成功，并且请求将正常处理，但是 `/readyz` 将立即返回失败。此延迟可用于允许 SDN 更新所有节点上的 iptables 并停止发送流量。见 ([#74416](https://github.com/kubernetes/kubernetes/pull/74416)、[@sttts](https://github.com/sttts))。
  现在，kubeadm 在升级 CoreDNS 时无差异地迁移 CoreDNS 配置。见 ([#78033](https://github.com/kubernetes/kubernetes/pull/78033)、[@rajansandeep](https://github.com/rajansandeep))。
<!--
- Add Endpoint Slice Controller for managing new EndpointSlice resource, disabled by default. ([#81048](https://github.com/kubernetes/kubernetes/pull/81048), [@robscott](https://github.com/robscott))
-->
- 添加端点切片控制器（Endpoint Slice Controller），用于管理新的 EndpointSlice 资源，默认情况下处于禁用状态。见 ([#81048](https://github.com/kubernetes/kubernetes/pull/81048)、[@robscott](https://github.com/robscott))。
<!--
- Adds `\livez` for liveness health checking for kube-apiserver. Using the parameter `--maximum-startup-sequence-duration` will allow the liveness endpoint to defer boot-sequence failures for the specified duration period. ([#81969](https://github.com/kubernetes/kubernetes/pull/81969), [@logicalhan](https://github.com/logicalhan))
-->
- 添加 `\livez` 用来检查 kube-apiserver 的活动状况。使用参数 `--maximum-startup-sequence-duration` 将使活动端点将启动序列故障推迟指定的持续时间。见 ([#81969](https://github.com/kubernetes/kubernetes/pull/81969)、[@logicalhan](https://github.com/logicalhan))。
<!--
- Adds EndpointSlice integration to kube-proxy, can be enabled with EndpointSlice feature gate. ([#81430](https://github.com/kubernetes/kubernetes/pull/81430), [@robscott](https://github.com/robscott))
-->
- 可将 EndpointSlice 集成添加到 kube-proxy，此功能可通过 EndpointSlice 特性开关启用。
<!--
- Add status condition to namespace resource ([#73405](https://github.com/kubernetes/kubernetes/pull/73405), [@wozniakjan](https://github.com/wozniakjan))
-->
- 将 status 条件添加到命名空间资源。见 ([#73405](https://github.com/kubernetes/kubernetes/pull/73405)、[@wozniakjan](https://github.com/wozniakjan))。
<!--
- Enhance Azure cloud provider code to support both AAD and ADFS authentication. ([#80841](https://github.com/kubernetes/kubernetes/pull/80841), [@rjaini](https://github.com/rjaini))
-->
- 增强 Azure 云提供程序代码用来支持 AAD 和 ADFS 身份验证。见 ([#80841](https://github.com/kubernetes/kubernetes/pull/80841)、[@rjaini](https://github.com/rjaini))。
<!--
- kubeadm: implement support for concurrent add/remove of stacked etcd members ([#79677](https://github.com/kubernetes/kubernetes/pull/79677), [@neolit123](https://github.com/neolit123))
-->
- kubeadm：实现对堆叠的 etcd 成员的并发添加或删除的支持。见 ([#79677](https://github.com/kubernetes/kubernetes/pull/79677)、[@neolit123](https://github.com/neolit123))。
<!--
- kubeadm: support any Linux kernel version newer than 3.10 ([#81623](https://github.com/kubernetes/kubernetes/pull/81623), [@neolit123](https://github.com/neolit123))
- Volume expansion is enabled in the default GCE storageclass ([#78672](https://github.com/kubernetes/kubernetes/pull/78672), [@msau42](https://github.com/msau42))
- kubeadm ClusterConfiguration now supports featureGates: IPv6DualStack: true ([#80145](https://github.com/kubernetes/kubernetes/pull/80145), [@Arvinderpal](https://github.com/Arvinderpal))
-->
- kubeadm：支持任何 3.10 以上的 Linux 内核版本。见 ([#81623](https://github.com/kubernetes/kubernetes/pull/81623)、[@neolit123](https://github.com/neolit123))。
- 在默认的 GCE 存储类中启用了卷扩展。见 ([#78672](https://github.com/kubernetes/kubernetes/pull/78672)、[@msau42](https://github.com/msau42))。
- kubeadm ClusterConfiguration 现在支持特性开关：IPv6DualStack：true。见 ([#80145](https://github.com/kubernetes/kubernetes/pull/80145)、[@Arvinderpal](https://github.com/Arvinderpal))。
<!--
- In order to enable dual-stack support within kubeadm and kubernetes components, as part of the init config file, the user should set feature-gate `IPv6DualStack=true` in the ClusterConfiguration. Additionally, for each worker node, the user should set the feature-gate for kubelet using either `nodeRegistration.kubeletExtraArgs` or `KUBELET_EXTRA_ARGS`. ([#80531](https://github.com/kubernetes/kubernetes/pull/80531), [@Arvinderpal](https://github.com/Arvinderpal))
-->
- 为了在 kubeadm 和 kubernetes 组件中启用双栈支持，作为 init config file 的一步，用户应在 ClusterConfiguration 中设置 `IPv6DualStack=true`。此外，对于每个工作节点，用户应使用 `nodeRegistration.kubeletExtraArgs` 或 `KUBELET_EXTRA_ARGS` 设置 kubelet 的特性开关功能。见 ([#80531](https://github.com/kubernetes/kubernetes/pull/80531), [@Arvinderpal](https://github.com/Arvinderpal))。
<!--
- Add possibility to configure controller manager to use IPv6 dual stack:
  use `--cluster-cidr="<cidr1>,<cidr2>"`.
  Notes:
  1. Only the first two CIDRs are used (soft limits for Alpha, might be lifted later on).
  2. Only the "RangeAllocator" (default) is allowed as a value for `--cidr-allocator-type`. Cloud allocators are not compatible with IPv6 dual stack
     ([#73977](https://github.com/kubernetes/kubernetes/pull/73977), [@khenidak](https://github.com/khenidak))
-->
- 允许将控制器管理器配置为使用 IPv6 双协议栈：
  使用 `--cluster-cidr="<cidr1>,<cidr2>"`。
  注意：
  1. 仅使用前两个 CIDR（对 Alpha 功能的软限制，稍后可能会取消）。
  2. 仅将 "RangeAllocator"（默认值）作为 --cidr-allocator-type 的值。云分配器与 IPv6 双协议栈不兼容。见 ([#73977](https://github.com/kubernetes/kubernetes/pull/73977)、[@khenidak](https://github.com/khenidak))。
<!--
- Add scheduling support for RuntimeClasses. RuntimeClasses can now specify nodeSelector constraints & tolerations, which are merged into the PodSpec for pods using that RuntimeClass. ([#80825](https://github.com/kubernetes/kubernetes/pull/80825), [@tallclair](https://github.com/tallclair))
-->
- 添加对 RuntimeClasses 的调度支持。现在，RuntimeClasses 可以指定 nodeSelector 约束和容忍度，并使用该 RuntimeClass 将约束和容忍合并到 PodSpec 中。见 ([#80825](https://github.com/kubernetes/kubernetes/pull/80825)、[@tallclair](https://github.com/tallclair))。
<!--
- When specifying `--(kube|system)-reserved-cgroup`, with `--cgroup-driver=systemd`, it is now possible to use the fully qualified cgroupfs name (i.e. `/test-cgroup.slice`). ([#78793](https://github.com/kubernetes/kubernetes/pull/78793), [@mattjmcnaughton](https://github.com/mattjmcnaughton))
-->
- 当使用 `--cgroup-driver=systemd` 指定 `--(kube|system)-reserved-cgroup` 时，现在可以使用完全限定的 cgroupfs 名称（即 `/test-cgroup.slice`）。见 ([#78793](https://github.com/kubernetes/kubernetes/pull/78793)、[@mattjmcnaughton](https://github.com/mattjmcnaughton))。
<!--
- Adds support for vSphere volumes on Windows ([#80911](https://github.com/kubernetes/kubernetes/pull/80911), [@gab-satchi](https://github.com/gab-satchi))
-->
- 在 Windows 上增加了对 vSphere 卷的支持。见 ([#80911](https://github.com/kubernetes/kubernetes/pull/80911)、[@gab-satchi](https://github.com/gab-satchi))。

<!--
## API Changes
-->
## API 变更

<!--
- The `MutatingWebhookConfiguration` and `ValidatingWebhookConfiguration` APIs have been promoted to `admissionregistration.k8s.io/v1`:
  - `failurePolicy` default changed from `Ignore` to `Fail` for v1
  - `matchPolicy` default changed from `Exact` to `Equivalent` for v1
  - `timeout` default changed from `30s` to `10s` for v1
  - `sideEffects` default value is removed, and the field made required, and only `None` and `NoneOnDryRun` are permitted for v1
  - `admissionReviewVersions` default value is removed and the field made required for v1 (supported versions for AdmissionReview are `v1` and `v1beta1`)
  - The `name` field for specified webhooks must be unique for `MutatingWebhookConfiguration` and `ValidatingWebhookConfiguration` objects created via `admissionregistration.k8s.io/v1`
-->
- `MutatingWebhookConfiguration` 和 `ValidatingWebhookConfiguration` API 已升级为 `admissionregistration.k8s.io/v1`：
  - v1 的默认 `failurePolicy` 从 `Ignore` 更改为 `Fail`
  - v1 的默认 `matchPolicy` 从 `Exact` 更改为 `Equivalent`
  - v1 的默认 `timeout` 从 `30s` 更改为 `10s`
  - 删除了 `sideEffects` 默认值，并且该字段为必填字段，v1 仅允许使用 `None` 和 `NoneOnDryRun`
  - 删除了 `admissionReviewVersions` 默认值，并为 v1 设置了必填字段（AdmissionReview 支持的版本为 `v1` 和 `v1beta1`）
  - 对于通过 `admissionregistration.k8s.io/v1` 创建的 `MutatingWebhookConfiguration` 和 `ValidatingWebhookConfiguration` 对象，指定 Webhook 的 `name` 字段必须唯一
<!--
- The `AdmissionReview` API sent to and received from admission webhooks has been promoted to `admission.k8s.io/v1`. Webhooks can specify a preference for receiving `v1` AdmissionReview objects with `admissionReviewVersions: ["v1","v1beta1"]`, and must respond with an API object in the same `apiVersion` they are sent. When webhooks use `admission.k8s.io/v1`, the following additional validation is performed on their responses:
  - `response.patch` and `response.patchType` are not permitted from validating admission webhooks
  - `apiVersion: "admission.k8s.io/v1"` is required
  - `kind: "AdmissionReview"` is required
  - `response.uid: "<value of request.uid>"` is required
  - `response.patchType: "JSONPatch"` is required (if `response.patch` is set) ([#80231](https://github.com/kubernetes/kubernetes/pull/80231), [@liggitt](https://github.com/liggitt))
-->
- 发送到 admission webhook 和从 admission webhook 接收到的 `AdmissionReview` API 已升级为 `admission.k8s.io/v1`。Webhooks 可以指定使用 `admissionReviewVersions: ["v1","v1beta1"]` 接收 `v1` AdmissionReview 对象的首选项，并且必须在发送它们的同一 `apiVersion` 中以 API 对象进行响应。当 Webhooks 使用 `admission.k8s.io/v1` 时，将对其响应执行以下附加验证：
  - `response.patch` 和 `response.patchType` 不允许验证 admission webhooks
  - `apiVersion: "admission.k8s.io/v1"` 是必需的
  - `kind: "AdmissionReview"` 是必需的
  - `response.uid: "<value of request.uid>"` 是必需的
  - `response.patchType: "JSONPatch"` 是必需的（前提是设置了 `response.patch`）见 ([#80231](https://github.com/kubernetes/kubernetes/pull/80231), [@liggitt](https://github.com/liggitt))。
<!--
- The `CustomResourceDefinition` API type is promoted to `apiextensions.k8s.io/v1` with the following changes:
  - Use of the new `default` feature in validation schemas is limited to v1
  - `spec.scope` is no longer defaulted to `Namespaced` and must be explicitly specified
  - `spec.version` is removed in v1; use `spec.versions` instead
  - `spec.validation` is removed in v1; use `spec.versions[*].schema` instead
  - `spec.subresources` is removed in v1; use `spec.versions[*].subresources` instead
  - `spec.additionalPrinterColumns` is removed in v1; use `spec.versions[*].additionalPrinterColumns` instead
  - `spec.conversion.webhookClientConfig` is moved to `spec.conversion.webhook.clientConfig` in v1
  - `spec.conversion.conversionReviewVersions` is moved to `spec.conversion.webhook.conversionReviewVersions` in v1
  - `spec.versions[*].schema.openAPIV3Schema` is now required when creating v1 CustomResourceDefinitions
  - `spec.preserveUnknownFields: true` is disallowed when creating v1 CustomResourceDefinitions; it must be specified within schema definitions as `x-kubernetes-preserve-unknown-fields: true`
  - In `additionalPrinterColumns` items, the `JSONPath` field was renamed to `jsonPath` in v1 (fixes https://github.com/kubernetes/kubernetes/issues/66531)
    The `apiextensions.k8s.io/v1beta1` version of `CustomResourceDefinition` is deprecated and will no longer be served in v1.19. ([#79604](https://github.com/kubernetes/kubernetes/pull/79604), [@liggitt](https://github.com/liggitt))
-->
- 通过以下更改将 `CustomResourceDefinition` API 类型升级为 `apiextensions.k8s.io/v1`：
  - 在验证模式中使用新的 `default`，该功能仅限于 v1
  - `spec.scope` 不再默认为 `Namespaced`，必须明确指定 `spec.scope`
  - v1 中删除了 `spec.version`；改用 `spec.versions`
  - v1 中删除了 `spec.validation`；改用 `spec.versions[*].schema`
  - v1 中删除了 `spec.subresources`；改用 `spec.versions[*].subresources`
  - v1 中删除了 `spec.additionalPrinterColumns`；改用 `spec.versions[*].additionalPrinterColumns`
  - 在 v1 中将 `spec.conversion.webhookClientConfig` 移至 `spec.conversion.webhook.clientConfig`
  - 在 v1 中将 `spec.conversion.conversionReviewVersions` 移至 `spec.conversion.webhook.conversionReviewVersions`
  - 现在，在创建 v1 CustomResourceDefinitions 时需要 `spec.versions[*].schema.openAPIV3Schema`
  - 创建 v1 CustomResourceDefinitions 时不允许使用 `spec.preserveUnknownFields: true`；必须在模式定义中将其指定为 `x-kubernetes-preserve-unknown-fields: true`。
  - 在 `additionalPrinterColumns` 项目中，将 `JSONPath` 字段在 v1 中重命名为 `jsonPath`，见 [参考](https://github.com/kubernetes/kubernetes/issues/66531)。
    `CustomResourceDefinition` 的 `apiextensions.k8s.io/v1beta1` 版本已弃用，在 v1.19 中将不再提供。见 ([#79604](https://github.com/kubernetes/kubernetes/pull/79604)、[@liggitt](https://github.com/liggitt))。
<!--
- The `ConversionReview` API sent to and received from custom resource CustomResourceDefinition conversion webhooks has been promoted to `apiextensions.k8s.io/v1`. CustomResourceDefinition conversion webhooks can now indicate they support receiving and responding with `ConversionReview` API objects in the `apiextensions.k8s.io/v1` version by including `v1` in the `conversionReviewVersions` list in their CustomResourceDefinition. Conversion webhooks must respond with a ConversionReview object in the same apiVersion they receive. `apiextensions.k8s.io/v1` `ConversionReview` responses must specify a `response.uid` that matches the `request.uid` of the object they were sent. ([#81476](https://github.com/kubernetes/kubernetes/pull/81476), [@liggitt](https://github.com/liggitt))
-->
- 发送到自定义资源 CustomResourceDefinition 转换 webhooks 和从中接收 `ConversionReview` 的 API 已升级为 `apiextensions.k8s.io/v1`。现在，通过在 CustomResourceDefinition 的 `conversionReviewVersions` 列表中包含 `v1`，CustomResourceDefinition 转换 webhooks 可以表示它们支持 `apiextensions.k8s.io/v1` 版本中的 `ConversionReview` API 对象进行接收和响应。转换 webhooks 必须在收到的 apiVersion 中以 ConversionReview 对象作为响应。`apiextensions.k8s.io/v1` `ConversionReview` 响应必须指定一个 `response.uid` 来匹配发送对象的 `request.uid`。见 ([#81476](https://github.com/kubernetes/kubernetes/pull/81476)、[@liggitt](https://github.com/liggitt))。
<!--
- Add scheduling support for RuntimeClasses. RuntimeClasses can now specify nodeSelector constraints & tolerations, which are merged into the PodSpec for pods using that RuntimeClass. ([#80825](https://github.com/kubernetes/kubernetes/pull/80825), [@tallclair](https://github.com/tallclair))
-->
- 添加对 RuntimeClasses 的调度支持。现在，RuntimeClasses 可以指定 nodeSelector 约束和容忍度，并使用该 RuntimeClass 将约束和容忍合并到 PodSpec 中。见 ([#80825](https://github.com/kubernetes/kubernetes/pull/80825)、[@tallclair](https://github.com/tallclair))
<!--
- Kubelet should now more reliably report the same primary node IP even if the set of node IPs reported by the CloudProvider changes. ([#79391](https://github.com/kubernetes/kubernetes/pull/79391), [@danwinship](https://github.com/danwinship))
-->
- 现在，即使云平台所报告的节点 IP 集合发生了变化，kubelet 也应该能够更可靠地报告相同的主节点 IP。见 ([#79391](https://github.com/kubernetes/kubernetes/pull/79391), [@danwinship](https://github.com/danwinship))。
<!--
- Omit nil or empty field when calculating container hash value to avoid hash changed. For a new field with a non-nil default value in the container spec, the hash would still get changed. ([#57741](https://github.com/kubernetes/kubernetes/pull/57741), [@dixudx](https://github.com/dixudx))
-->
- 计算容器哈希值时会忽略 `nil` 或空字段，以避免哈希值更改。对于容器规范中默认值为非 `nil` 的新字段，哈希值仍会更改。见 ([#57741](https://github.com/kubernetes/kubernetes/pull/57741)、[@dixudx](https://github.com/dixudx))。
<!--
- Property `conditions` in `apiextensions.v1beta1.CustomResourceDefinitionStatus` and `apiextensions.v1.CustomResourceDefinitionStatus` is now optional instead of required. ([#64996](https://github.com/kubernetes/kubernetes/pull/64996), [@roycaihw](https://github.com/roycaihw))
-->
- 现在，`apiextensions.v1beta1.CustomResourceDefinitionStatus` 和 `apiextensions.v1.CustomResourceDefinitionStatus` 中的 `conditions` 属性是可选的，而不是必需的。见 ([#64996](https://github.com/kubernetes/kubernetes/pull/64996)、[@roycaihw](https://github.com/roycaihw))。
<!--
- When the status of a CustomResourceDefinition condition changes, its corresponding `lastTransitionTime` is now updated. ([#69655](https://github.com/kubernetes/kubernetes/pull/69655), [@CaoShuFeng](https://github.com/CaoShuFeng))
-->
- 当 CustomResourceDefinition 条件的状态更改时，现在将更新其对应的 `lastTransitionTime`。见 ([#69655](https://github.com/kubernetes/kubernetes/pull/69655)、[@CaoShuFeng](https://github.com/CaoShuFeng))。

<!--
## Other notable changes
-->
## 其他值得注意的变更

<!--
### API Machinery
-->
### API Machinery

<!--
- Remove `GetReference()` and `GetPartialReference()` function from `pkg/api/ref`, as the same function exists also in `staging/src/k8s.io/client-go/tools/ref` ([#80361](https://github.com/kubernetes/kubernetes/pull/80361), [@wojtek-t](https://github.com/wojtek-t))
- Verify that CRD default values in OpenAPI specs are pruned, with the exceptions of values under `metadata`. ([#78829](https://github.com/kubernetes/kubernetes/pull/78829), [@sttts](https://github.com/sttts))
- Fixes a bug that when there is a "connection refused" error, the reflector's ListAndWatch func will return directly but what expected is that sleep 1 second and rewatch since the specified resourceVersion. ([#81634](https://github.com/kubernetes/kubernetes/pull/81634), [@likakuli](https://github.com/likakuli))
-->
- 从 `pkg/api/ref` 中删除 `GetReference()` 和 `GetPartialReference()` 函数，因为在 `staging/src/k8s.io/client-go/tools/ref` 中也存在相同的函数。见 ([#80361](https://github.com/kubernetes/kubernetes/pull/80361)、[@wojtek-t](https://github.com/wojtek-t))。
- 验证是否修改了 OpenAPI 规范中的 CRD 默认值，但 `metadata` 下的值除外。见 ([#78829](https://github.com/kubernetes/kubernetes/pull/78829)、[@sttts](https://github.com/sttts))。
- 修复了一个 bug，即当出现 “connection refused” 错误时，反射器的 ListAndWatch 函数将直接返回，但预期的是睡眠 1 秒钟并从指定的 resourceVersion 重新开始监视。见 ([#81634](https://github.com/kubernetes/kubernetes/pull/81634)、[@likakuli](https://github.com/likakuli))。
<!--
- Resolves an issue serving aggregated APIs backed by services that respond to requests to `/` with non-2xx HTTP responses ([#79895](https://github.com/kubernetes/kubernetes/pull/79895), [@deads2k](https://github.com/deads2k))
- The CRD handler now properly re-creates stale CR storage to reflect CRD update. ([#79114](https://github.com/kubernetes/kubernetes/pull/79114), [@roycaihw](https://github.com/roycaihw))
- Fix CVE-2019-11247: API server allows access to custom resources via wrong scope ([#80750](https://github.com/kubernetes/kubernetes/pull/80750), [@sttts](https://github.com/sttts))
-->
- 解决了由非 2xx HTTP 响应对 `/` 请求的服务支持的聚合 API 的问题。见 ([#79895](https://github.com/kubernetes/kubernetes/pull/79895)、[@deads2k](https://github.com/deads2k))。
- CRD 处理程序现在可以正确地重新创建过时的 CR 存储，以反映 CRD 更新。见 ([#79114](https://github.com/kubernetes/kubernetes/pull/79114)、[@roycaihw](https://github.com/roycaihw))。
- 修复 CVE-2019-11247：API 服务器允许通过错误的范围访问自定义资源。见 ([#80750](https://github.com/kubernetes/kubernetes/pull/80750)、[@sttts](https://github.com/sttts))。
<!--
- Fixed a bug with the openAPI definition for `io.k8s.apimachinery.pkg.runtime.RawExtension`, which previously required a field `raw` to be specified ([#80773](https://github.com/kubernetes/kubernetes/pull/80773), [@jennybuckley](https://github.com/jennybuckley))
- Property `conditions` in `apiextensions.v1beta1.CustomResourceDefinitionStatus` and `apiextensions.v1.CustomResourceDefinitionStatus` is now optional instead of required. ([#64996](https://github.com/kubernetes/kubernetes/pull/64996), [@roycaihw](https://github.com/roycaihw))
- Resolves a transient 404 response to custom resource requests during server startup ([#81244](https://github.com/kubernetes/kubernetes/pull/81244), [@liggitt](https://github.com/liggitt))
-->
- 修复了带有 `io.k8s.apimachinery.pkg.runtime.RawExtension` 的 openAPI 定义的错误，该错误以前需要指定字段 `raw`。见 ([#80773](https://github.com/kubernetes/kubernetes/pull/80773), [@jennybuckley](https://github.com/jennybuckley))。
- 现在，`apiextensions.v1beta1.CustomResourceDefinitionStatus` 和 `apiextensions.v1.CustomResourceDefinitionStatus` 中的 `conditions` 属性是可选的，而不是必需的。见 ([#64996](https://github.com/kubernetes/kubernetes/pull/64996)、[@roycaihw](https://github.com/roycaihw))。
- 解决服务器启动期间对自定义资源请求的瞬态 404 响应。见 ([#81244](https://github.com/kubernetes/kubernetes/pull/81244)、[@liggitt](https://github.com/liggitt))。
<!--
- OpenAPI now advertises correctly supported patch types for custom resources ([#81515](https://github.com/kubernetes/kubernetes/pull/81515), [@liggitt](https://github.com/liggitt))
- When the status of a CRD Condition changes, it's corresponding `LastTransitionTime` is now updated. ([#69655](https://github.com/kubernetes/kubernetes/pull/69655), [@CaoShuFeng](https://github.com/CaoShuFeng))
- Add `metadata.generation=1` to old CustomResources. ([#82005](https://github.com/kubernetes/kubernetes/pull/82005), [@sttts](https://github.com/sttts))
-->
- OpenAPI 现在可以为自定义资源公布其正确支持的补丁程序类型。见 ([#81515](https://github.com/kubernetes/kubernetes/pull/81515)、[@liggitt](https://github.com/liggitt))。
- 当 CRD 条件的状态改变时，现在将更新其对应的 `lastTransitionTime`。见 ([#69655](https://github.com/kubernetes/kubernetes/pull/69655)、[@CaoShuFeng](https://github.com/CaoShuFeng))。
- 将 `metadata.generation=1` 添加到旧的 CustomResources 中。见 ([#82005](https://github.com/kubernetes/kubernetes/pull/82005)、[@sttts](https://github.com/sttts))。
<!--
- Fix a bug in the apiserver that could cause a valid update request to be rejected with a precondition check failure. ([#82303](https://github.com/kubernetes/kubernetes/pull/82303), [@roycaihw](https://github.com/roycaihw))
- Fixes regression in logging spurious stack traces when proxied connections are closed by the backend ([#82588](https://github.com/kubernetes/kubernetes/pull/82588), [@liggitt](https://github.com/liggitt))
- RateLimiter add a context-aware method, fix client-go request goruntine backlog in async timeout scene. ([#79375](https://github.com/kubernetes/kubernetes/pull/79375), [@answer1991](https://github.com/answer1991))
-->
- 修复了 apiserver 中的一个错误，该错误可能导致有效的更新请求因前提条件检查失败而被拒绝。见 ([#82303](https://github.com/kubernetes/kubernetes/pull/82303)、[@roycaihw](https://github.com/roycaihw))。
- 修复了后端关闭代理连接时记录虚假堆栈跟踪的回归问题。见 ([#82588](https://github.com/kubernetes/kubernetes/pull/82588)、[@liggitt](https://github.com/liggitt))。
- RateLimiter 添加了 context-aware 方法，修复了异步超时场景中的 client-go 请求 goruntine backlog 问题。见 ([#79375](https://github.com/kubernetes/kubernetes/pull/79375)、[@answer1991](https://github.com/answer1991))。
<!--
- Add a `Patch` method to `ScaleInterface` ([#80699](https://github.com/kubernetes/kubernetes/pull/80699), [@knight42](https://github.com/knight42))
- CRDs under k8s.io and kubernetes.io must have the `api-approved.kubernetes.io` set to either `unapproved.*` or a link to the pull request approving the schema. See https://github.com/kubernetes/enhancements/pull/1111 for more details. ([#79992](https://github.com/kubernetes/kubernetes/pull/79992), [@deads2k](https://github.com/deads2k))
- KMS Providers will install a healthz check for the status of kms-plugin in kube-apiservers' encryption config. ([#78540](https://github.com/kubernetes/kubernetes/pull/78540), [@immutableT](https://github.com/immutableT))
-->
- 在 `ScaleInterface` 中添加 `Patch` 方法。见 ([#80699](https://github.com/kubernetes/kubernetes/pull/80699)、[@knight42](https://github.com/knight42))。
- k8s.io 和 kubernetes.io 下的 CRD 必须将 `api-approved.kubernetes.io` 设置为 `unapproved.*` 或指向批准该模式下的拉取请求的链接。有关更多详细信息，请参见 https://github.com/kubernetes/enhancements/pull/1111。见 ([#79992](https://github.com/kubernetes/kubernetes/pull/79992)、[@deads2k](https://github.com/deads2k))。
- KMS 提供商将在 kube-apiservers 的加密配置中安装 kms 状态的运行状况检查插件。见 ([#78540](https://github.com/kubernetes/kubernetes/pull/78540)、[@immutableT](https://github.com/immutableT))。
<!--
- Improves validation errors for custom resources ([#81212](https://github.com/kubernetes/kubernetes/pull/81212), [@liggitt](https://github.com/liggitt))
- Populate object name for admission attributes when CREATE ([#53185](https://github.com/kubernetes/kubernetes/pull/53185), [@dixudx](https://github.com/dixudx))
- Add Overhead field to the PodSpec and RuntimeClass types as part of the Pod Overhead KEP ([#76968](https://github.com/kubernetes/kubernetes/pull/76968), [@egernst](https://github.com/egernst))
--> 
- 改进自定义资源的验证错误。([#81212](https://github.com/kubernetes/kubernetes/pull/81212)、[@liggitt](https://github.com/liggitt))。
- 在创建时填充准入属性的对象名称。见 ([#53185](https://github.com/kubernetes/kubernetes/pull/53185)、[@dixudx](https://github.com/dixudx))。
- 作为 Pod Overhead KEP 的一部分，将 Overhead 字段添加到 PodSpec 和 RuntimeClass 类型中。见 ([#76968](https://github.com/kubernetes/kubernetes/pull/76968)、[@egernst](https://github.com/egernst))。

### Apps

<!--
- Fix a bug that pods not be deleted from unmatched nodes by daemon controller ([#78974](https://github.com/kubernetes/kubernetes/pull/78974), [@DaiHao](https://github.com/DaiHao))
- Fix a bug that causes DaemonSet rolling update hang when there exist failed pods. ([#78170](https://github.com/kubernetes/kubernetes/pull/78170), [@DaiHao](https://github.com/DaiHao))
-->
- 修复了守护程序控制器（daemon controller）无法从不匹配的节点删除 Pod 的错误。见 ([#78974](https://github.com/kubernetes/kubernetes/pull/78974)、[@DaiHao](https://github.com/DaiHao))。
- 修复了当存在失败的 Pod 时导致 DaemonSet 滚动更新挂起的错误。见 ([#78170](https://github.com/kubernetes/kubernetes/pull/78170)、[@DaiHao](https://github.com/DaiHao))。

<!--
### Auth
-->
### 验证码（Auth）

<!--
- Service account tokens now include the JWT Key ID field in their header. ([#78502](https://github.com/kubernetes/kubernetes/pull/78502), [@ahmedtd](https://github.com/ahmedtd))
- The nbf (not before) claim, if present in ID token, is now enforced. ([#81413](https://github.com/kubernetes/kubernetes/pull/81413), [@anderseknert](https://github.com/anderseknert))
-->
- 服务帐户令牌现在在其头部（header）中包含 JWT 密钥 ID 字段。见 ([#78502](https://github.com/kubernetes/kubernetes/pull/78502)、[@ahmedtd](https://github.com/ahmedtd))。
- 如果 nbf（不早于）声明在 ID 令牌中存在，则现在强制执行。见 ([#81413](https://github.com/kubernetes/kubernetes/pull/81413)、[@anderseknert](https://github.com/anderseknert))。

<!--
### CLI
-->
### CLI（命令行界面）

<!--
- Fix CVE-2019-11249: Incomplete fixes for CVE-2019-1002101 and CVE-2019-11246, kubectl cp potential directory traversal ([#80436](https://github.com/kubernetes/kubernetes/pull/80436), [@M00nF1sh](https://github.com/M00nF1sh))
-->
- 修复 CVE-2019-11249：CVE-2019-1002101 和 CVE-2019-11246 的修补程序不完整，kubectl cp 可能遍历目录。见 ([#80436](https://github.com/kubernetes/kubernetes/pull/80436)、[@M00nF1sh](https://github.com/M00nF1sh))。
<!--
- Fix the bash completion error with override flags. ([#80802](https://github.com/kubernetes/kubernetes/pull/80802), [@dtaniwaki](https://github.com/dtaniwaki))
-->
- 使用覆盖参数修复 bash 自动完成错误。见 ([#80802](https://github.com/kubernetes/kubernetes/pull/80802)、[@dtaniwaki](https://github.com/dtaniwaki))。
<!--
- Fix a bug in server printer that could cause kube-apiserver to panic. ([#79349](https://github.com/kubernetes/kubernetes/pull/79349), [@roycaihw](https://github.com/roycaihw))
-->
- 修复了源代码 printers 函数中可能导致 kube-apiserver 崩溃的错误。见 ([#79349](https://github.com/kubernetes/kubernetes/pull/79349)、[@roycaihw](https://github.com/roycaihw))。
<!--
- Fix invalid "time stamp is the future" error when kubectl cp-ing a file ([#73982](https://github.com/kubernetes/kubernetes/pull/73982), [@tanshanshan](https://github.com/tanshanshan))
-->
- 当 kubectl cp 操作复制一个文件时，修复无效的 "time stamp is the future" 错误。见 ([#73982](https://github.com/kubernetes/kubernetes/pull/73982)、[@tanshanshan](https://github.com/tanshanshan))。
<!--
- Fix a bug where `kubectl set config` hangs and uses 100% CPU on some invalid property names ([#79000](https://github.com/kubernetes/kubernetes/pull/79000), [@pswica](https://github.com/pswica))
-->
- 修复了 `kubectl set config` 挂起并在某些无效的属性名称上使用 100％ CPU 的错误。见 ([#79000](https://github.com/kubernetes/kubernetes/pull/79000)、[@pswica](https://github.com/pswica))。
<!--
- Fix output of `kubectl get --watch-only` when watching a single resource ([#79345](https://github.com/kubernetes/kubernetes/pull/79345), [@liggitt](https://github.com/liggitt))
-->
- 监视某个资源时修复 `kubectl get --watch-only` 输出内容。见 ([#79345](https://github.com/kubernetes/kubernetes/pull/79345)、[@liggitt](https://github.com/liggitt))。
<!--
- Make kubectl get `--ignore-not-found` continue processing when encountering error. ([#82120](https://github.com/kubernetes/kubernetes/pull/82120), [@soltysh](https://github.com/soltysh))
-->
- 遇到错误时，确保 `kubectl get --ignore-not-found` 操作继续进行。见 ([#82120](https://github.com/kubernetes/kubernetes/pull/82120)、[@soltysh](https://github.com/soltysh))。
<!--
- Correct a reference to a not/no longer used kustomize subcommand in the documentation ([#82535](https://github.com/kubernetes/kubernetes/pull/82535), [@demobox](https://github.com/demobox))
-->
- 在文档中更正对不再使用的 kustomize 子命令的引用。见 ([#82535](https://github.com/kubernetes/kubernetes/pull/82535)、[@demobox](https://github.com/demobox))。
<!--
- kubectl could scale custom resource again ([#81342](https://github.com/kubernetes/kubernetes/pull/81342), [@knight42](https://github.com/knight42))
-->
- kubectl 可以再次扩展自定义资源。见 ([#81342](https://github.com/kubernetes/kubernetes/pull/81342)、[@knight42](https://github.com/knight42))。
<!--
- Add PodOverhead awareness to kubectl ([#81929](https://github.com/kubernetes/kubernetes/pull/81929), [@egernst](https://github.com/egernst))
-->
- 在 kubectl 中添加 PodOverhead 预知。见 ([#81929](https://github.com/kubernetes/kubernetes/pull/81929)、[@egernst](https://github.com/egernst))。

<!--
### Cloud Provider
-->
### 云提供商

<!--
- When a load balancer type service is created in a k8s cluster that is backed by Azure Standard Load Balancer, the corresponding load balancer rule added in the Azure Standard Load Balancer would now have the "EnableTcpReset" property set to true. ([#80624](https://github.com/kubernetes/kubernetes/pull/80624), [@xuto2](https://github.com/xuto2))
-->
- 由 Azure 标准负载均衡器支持的 k8s 集群中创建负载均衡器类型服务时，在 Azure 标准负载均衡器中添加的相应负载均衡器规则现在会将 “EnableTcpReset” 属性设置为 true。见 ([#80624](https://github.com/kubernetes/kubernetes/pull/80624)、[@xuto2](https://github.com/xuto2))。 
<!--
- Switch to VM Update call in attach/detach disk operation, original CreateOrUpdate call may lead to orphaned VMs or blocked resources ([#81208](https://github.com/kubernetes/kubernetes/pull/81208), [@andyzhangx](https://github.com/andyzhangx))
-->
- 在关联或者摘除的磁盘操作中现使用 VM Update 调用，原来的 CreateOrUpdate 调用可能导致孤立的 VM 或资源阻塞。见 ([#81208](https://github.com/kubernetes/kubernetes/pull/81208)、[@andyzhangx](https://github.com/andyzhangx))。
<!--
- Fix azure disk naming matching issue due to case sensitive comparison ([#81720](https://github.com/kubernetes/kubernetes/pull/81720), [@andyzhangx](https://github.com/andyzhangx))
-->
- 修复了由于区分大小写而导致的 Azure 磁盘命名匹配问题。见 ([#81720](https://github.com/kubernetes/kubernetes/pull/81720)、[@andyzhangx](https://github.com/andyzhangx))。
<!--
- Fix retry issues when the nodes are under deleting on Azure ([#80419](https://github.com/kubernetes/kubernetes/pull/80419), [@feiskyer](https://github.com/feiskyer)) -->
- 修复了在 Azure 上删除节点时的重试问题。见 ([#80419](https://github.com/kubernetes/kubernetes/pull/80419)、[@feiskyer](https://github.com/feiskyer))。
<!--
- Fix conflicted cache when the requests are canceled by other Azure operations. ([#81282](https://github.com/kubernetes/kubernetes/pull/81282), [@feiskyer](https://github.com/feiskyer))
-->
- 当其他 Azure 操作取消请求时，修复冲突的缓存问题。见  ([#81282](https://github.com/kubernetes/kubernetes/pull/81282)、[@feiskyer](https://github.com/feiskyer))。
<!--
- Fix make azure disk URI as case insensitive ([#79020](https://github.com/kubernetes/kubernetes/pull/79020), [@andyzhangx](https://github.com/andyzhangx))
-->
- 修复了使 Azure 磁盘 URI 不区分大小写的问题。见 ([#79020](https://github.com/kubernetes/kubernetes/pull/79020)、[@andyzhangx](https://github.com/andyzhangx))。
<!--
- Fix VMSS LoadBalancer backend pools so that the network won't be broken when instances are upgraded to latest model ([#81411](https://github.com/kubernetes/kubernetes/pull/81411), [@nilo19](https://github.com/nilo19))
-->
- 修复了 VMSS 负载均衡器后端池问题，以便在实例升级到最新模型时不会断开网络。见 ([#81411](https://github.com/kubernetes/kubernetes/pull/81411)、[@nilo19](https://github.com/nilo19))。
<!--
- Default resourceGroup should be used when the value of annotation azure-load-balancer-resource-group is an empty string. ([#79514](https://github.com/kubernetes/kubernetes/pull/79514), [@feiskyer](https://github.com/feiskyer))
-->
- 当注解 `azure-load-balancer-resource-group` 的值为空字符串时，应使用默认 resourceGroup。见 ([#79514](https://github.com/kubernetes/kubernetes/pull/79514)、[@feiskyer](https://github.com/feiskyer))。
<!--
- Kubelet could be run with no Azure identity without subscriptionId configured now.
  A sample cloud provider configure is: '{"vmType": "vmss", "useInstanceMetadata": true}'. ([#81500](https://github.com/kubernetes/kubernetes/pull/81500), [@feiskyer](https://github.com/feiskyer))
-->
- 如果现在没有配置 subscriptionId，则可以在没有 Azure 身份的情况下运行 kubelet。
  一个云提供商配置示例为：'{"vmType": "vmss", "useInstanceMetadata": true}'。见 ([#81500](https://github.com/kubernetes/kubernetes/pull/81500)、[@feiskyer](https://github.com/feiskyer))。
<!--
- Fix public IP not found issues for VMSS nodes ([#80703](https://github.com/kubernetes/kubernetes/pull/80703), [@feiskyer](https://github.com/feiskyer))
-->
- 修复 VMSS 节点未找到公共 IP 的问题。见 ([#80703](https://github.com/kubernetes/kubernetes/pull/80703)、[@feiskyer](https://github.com/feiskyer))。
<!--
- Fix Azure client requests stuck issues on http.StatusTooManyRequests (HTTP Code 429). ([#81279](https://github.com/kubernetes/kubernetes/pull/81279), [@feiskyer](https://github.com/feiskyer))
-->
- 修复 Azure 客户端请求在 http.StatusTooManyRequests（HTTP 代码 429）上卡住的问题。([#81279](https://github.com/kubernetes/kubernetes/pull/81279)、[@feiskyer](https://github.com/feiskyer))。
<!--
- Add a service annotation `service.beta.kubernetes.io/azure-pip-name` to specify the public IP name for Azure load balancer. ([#81213](https://github.com/kubernetes/kubernetes/pull/81213), [@nilo19](https://github.com/nilo19))
-->
- 添加服务注解 `service.beta.kubernetes.io/azure-pip-name`，用于指定 Azure 负载均衡器的公共 IP 名称。见 ([#81213](https://github.com/kubernetes/kubernetes/pull/81213)、[@nilo19](https://github.com/nilo19))。
<!--
- Optimize EC2 DescribeInstances API calls in aws cloud provider library by querying instance ID instead of EC2 filters when possible ([#78140](https://github.com/kubernetes/kubernetes/pull/78140), [@zhan849](https://github.com/zhan849))
-->
- 在可能的情况下，通过查询实例 ID 而不是 EC2 过滤器来优化 AWS 云提供商库中的 EC2 DescribeInstances API 调用。见 ([#78140](https://github.com/kubernetes/kubernetes/pull/78140)、[@zhan849](https://github.com/zhan849))。
<!--
- Creates an annotation `service.beta.kubernetes.io/aws-load-balancer-eip-allocations` to assign AWS EIP to the newly created Network Load Balancer. Number of allocations and subnets must match. ([#69263](https://github.com/kubernetes/kubernetes/pull/69263), [@brooksgarrett](https://github.com/brooksgarrett))
-->
- 创建注解 `service.beta.kubernetes.io/aws-load-balancer-eip-allocations`，用于将 AWS EIP 分配给新创建的 Network Load Balancer，其中分配数量和子网必须匹配。见 ([#69263](https://github.com/kubernetes/kubernetes/pull/69263)、[@brooksgarrett](https://github.com/brooksgarrett))。
<!--
- Add an azure cloud configuration `LoadBalancerName` and `LoadBalancerResourceGroup` to allow the corresponding customizations of azure load balancer. ([#81054](https://github.com/kubernetes/kubernetes/pull/81054), [@nilo19](https://github.com/nilo19))
-->
- 添加 Azure 云配置 `LoadBalancerName` 和 `LoadBalancerResourceGroup`，用于允许对 Azure 负载均衡器进行相应的自定义。见 ([#81054](https://github.com/kubernetes/kubernetes/pull/81054)、[@nilo19](https://github.com/nilo19))。
<!--
### Cluster Lifecycle
-->
### 集群生命周期

<!--
- Fix error handling and potential go null pointer exception in kubeadm upgrade diff ([#80648](https://github.com/kubernetes/kubernetes/pull/80648), [@odinuge](https://github.com/odinuge))
-->
- 修复 kubeadm upgrade diff 命令中的错误处理和潜在的空指针异常。见 ([#80648](https://github.com/kubernetes/kubernetes/pull/80648)、[@odinuge](https://github.com/odinuge))。
<!--
- kubeadm: fall back to client version in case of certain HTTP errors ([#80024](https://github.com/kubernetes/kubernetes/pull/80024), [@RainbowMango](https://github.com/RainbowMango))
-->
- kubeadm：在某些 HTTP 错误的情况下回退到客户端版本。见 ([#80024](https://github.com/kubernetes/kubernetes/pull/80024)、[@RainbowMango](https://github.com/RainbowMango))。
<!--
- kubeadm: fix a potential panic if kubeadm discovers an invalid, existing kubeconfig file ([#79165](https://github.com/kubernetes/kubernetes/pull/79165), [@neolit123](https://github.com/neolit123))
-->
- kubeadm：修复了因 kubeadm 发现无效的、现有的 kubeconfig 文件而可能引起的崩溃问题。见 ([#79165](https://github.com/kubernetes/kubernetes/pull/79165)、[@neolit123](https://github.com/neolit123))。

<!--
- kubeadm: treat non-fatal errors as warnings when doing reset ([#80862](https://github.com/kubernetes/kubernetes/pull/80862), [@drpaneas](https://github.com/drpaneas))-->
- kubeadm：重置时将非严重错误视为警告。见 ([#80862](https://github.com/kubernetes/kubernetes/pull/80862)、[@drpaneas](https://github.com/drpaneas))。
<!--
- kubeadm: prevent PSP blocking of upgrade image prepull by using a non-root user ([#77792](https://github.com/kubernetes/kubernetes/pull/77792), [@neolit123](https://github.com/neolit123))
-->
- kubeadm：通过使用非 root 用户防止 PSP 阻止升级镜像提前拉取操作。见 ([#77792](https://github.com/kubernetes/kubernetes/pull/77792)、[@neolit123](https://github.com/neolit123))。
<!--
- kubeadm: fix "certificate-authority" files not being pre-loaded when using file discovery ([#80966](https://github.com/kubernetes/kubernetes/pull/80966), [@neolit123](https://github.com/neolit123))
-->
- kubeadm：修复了使用文件发现时未预加载 “certificate-authority” 文件的问题。见 ([#80966](https://github.com/kubernetes/kubernetes/pull/80966)、[@neolit123](https://github.com/neolit123))。
<!--
- Add instruction to setup "Application Default Credentials" to run GCE Windows e2e tests locally. ([#81337](https://github.com/kubernetes/kubernetes/pull/81337), [@YangLu1031](https://github.com/YangLu1031))
-->
- 添加设置 “应用程序默认凭证” 说明，用于在本地运行 GCE Windows e2e 测试。见 ([#81337](https://github.com/kubernetes/kubernetes/pull/81337)、[@YangLu1031](https://github.com/YangLu1031))。
<!--
- Fix error in `kubeadm join --discovery-file` when using discovery files with embedded credentials ([#80675](https://github.com/kubernetes/kubernetes/pull/80675), [@fabriziopandini](https://github.com/fabriziopandini))
-->
- 当使用具有嵌入式凭据的发现文件时，修复 `kubeadm join --discovery-file` 操作中的错误。见 ([#80675](https://github.com/kubernetes/kubernetes/pull/80675)、[@fabriziopandini](https://github.com/fabriziopandini))。
<!--
- Fix remove the etcd member from the cluster during a kubeadm reset. ([#79326](https://github.com/kubernetes/kubernetes/pull/79326), [@bradbeam](https://github.com/bradbeam))
-->
- 修复在 kubeadm 重置期间从集群中删除 etcd 成员问题。见 ([#79326](https://github.com/kubernetes/kubernetes/pull/79326)、[@bradbeam](https://github.com/bradbeam))。
<!--
- kubeadm: the permissions of generated CSR files are changed from 0644 to 0600 ([#81217](https://github.com/kubernetes/kubernetes/pull/81217), [@SataQiu](https://github.com/SataQiu))
-->
- kubeadm：生成的 CSR 文件的权限从 0644 更改为 0600。见 ([#81217](https://github.com/kubernetes/kubernetes/pull/81217)、[@SataQiu](https://github.com/SataQiu))。
<!--
- kubeadm: avoid double deletion of the upgrade prepull DaemonSet ([#80798](https://github.com/kubernetes/kubernetes/pull/80798), [@xlgao-zju](https://github.com/xlgao-zju))
-->
- kubeadm：升级提前拉取 DaemonSet 时，避免两次删除操作。见 ([#80798](https://github.com/kubernetes/kubernetes/pull/80798)、[@xlgao-zju](https://github.com/xlgao-zju))。
<!--
- kubeadm: introduce deterministic ordering for the certificates generation in the phase command `kubeadm init phase certs`. ([#78556](https://github.com/kubernetes/kubernetes/pull/78556), [@neolit123](https://github.com/neolit123))
-->
- kubeadm：在阶段命令 `kubeadm init phase certs` 操作中引入确定性顺序用于生成证书。见 ([#78556](https://github.com/kubernetes/kubernetes/pull/78556)、[@neolit123](https://github.com/neolit123))。
<!--
- kubeadm: implement retry logic for certain ConfigMap failures when joining nodes ([#78915](https://github.com/kubernetes/kubernetes/pull/78915), [@ereslibre](https://github.com/ereslibre))
-->
- kubeadm：加入节点时，针对某些 ConfigMap 失败实施重试逻辑操作。见 ([#78915](https://github.com/kubernetes/kubernetes/pull/78915)、[@ereslibre](https://github.com/ereslibre))。
<!--
- kubeadm: use etcd's /health endpoint for a HTTP liveness probe on localhost instead of having a custom health check using etcdctl ([#81385](https://github.com/kubernetes/kubernetes/pull/81385), [@neolit123](https://github.com/neolit123))
-->
- kubeadm：使用 etcd 的 /health 端点进行本地主机上的 HTTP 活跃探针操作，而不是使用 etcdctl 进行自定义健康检查。见 ([#81385](https://github.com/kubernetes/kubernetes/pull/81385)、[@neolit123](https://github.com/neolit123))。
<!--
- kubeadm reset: unmount directories under `/var/lib/kubelet` for Linux only ([#81494](https://github.com/kubernetes/kubernetes/pull/81494), [@Klaven](https://github.com/Klaven))
-->
- kubeadm reset：仅在 Linux `/var/lib/kubelet` 下卸载目录。见 ([#81494](https://github.com/kubernetes/kubernetes/pull/81494)、[@Klaven](https://github.com/Klaven))。
<!--
- kubeadm: fix the bug that `--cri-socket` flag does not work for `kubeadm reset` ([#79498](https://github.com/kubernetes/kubernetes/pull/79498), [@SataQiu](https://github.com/SataQiu))
-->
- kubeadm：修复 `--cri-socket` 参数不适用于 `kubeadm reset` 操作的错误。见 ([#79498](https://github.com/kubernetes/kubernetes/pull/79498)、[@SataQiu](https://github.com/SataQiu))。
<!--
- kubeadm: produce errors if they occur when resetting cluster status for a control-plane node ([#80573](https://github.com/kubernetes/kubernetes/pull/80573), [@bart0sh](https://github.com/bart0sh))
-->
- kubeadm：如果在重置控制平面节点的集群状态时发生错误，则会产生错误。见 ([#80573](https://github.com/kubernetes/kubernetes/pull/80573)、[@bart0sh](https://github.com/bart0sh))。
<!--
- Fix an error when using external etcd but storing etcd certificates in the same folder with the same name used by kubeadm for local etcd certificates; for an older version of kubeadm, the workaround is to avoid file name used by kubeadm for local etcd. ([#80867](https://github.com/kubernetes/kubernetes/pull/80867), [@fabriziopandini](https://github.com/fabriziopandini))
-->
- 修复了在使用外部 etcd 时将 etcd 证书与 kubeadm 用于本地 etcd 证书的名称存储在同一文件夹中的错误；对于较旧版本的 kubeadm，解决方法是避免 kubeadm 用于本地 etcd 的文件名。见 ([#80867](https://github.com/kubernetes/kubernetes/pull/80867)、[@fabriziopandini](https://github.com/fabriziopandini))。
<!--
- `kubeadm join` fails if file-based discovery is too long, with a default timeout of 5 minutes. ([#80804](https://github.com/kubernetes/kubernetes/pull/80804), [@olivierlemasle](https://github.com/olivierlemasle))
-->
- 如果基于文件的发现时间过长，则 `kubeadm join` 操作会失败，默认超时为 5 分钟。见 ([#80804](https://github.com/kubernetes/kubernetes/pull/80804)、[@olivierlemasle](https://github.com/olivierlemasle))。
<!--
- kubeadm: fixed ignoring errors when pulling control plane images ([#80529](https://github.com/kubernetes/kubernetes/pull/80529), [@bart0sh](https://github.com/bart0sh))
-->
- kubeadm：修复了拉取控制平面镜像时忽略错误的问题。见 ([#80529](https://github.com/kubernetes/kubernetes/pull/80529)、[@bart0sh](https://github.com/bart0sh))。
<!--
- Fix a bug in kube-addon-manager's leader election logic that made all replicas active. ([#80575](https://github.com/kubernetes/kubernetes/pull/80575), [@mborsz](https://github.com/mborsz))
-->
- 修复了 kube-addon-manager 的领导者选举逻辑中的一个错误，该错误使所有副本均处于活跃状态。见 ([#80575](https://github.com/kubernetes/kubernetes/pull/80575)、[@mborsz](https://github.com/mborsz))。
<!--
- kubeadm: prevent overriding of certain kubelet security configuration parameters if the user wished to modify them ([#81903](https://github.com/kubernetes/kubernetes/pull/81903), [@jfbai](https://github.com/jfbai))
-->
- kubeadm：如果用户希望修改某些 kubelet 安全配置参数，则可以防止它们被覆盖。见 ([#81903](https://github.com/kubernetes/kubernetes/pull/81903)、[@jfbai](https://github.com/jfbai))。
<!--
- kubeadm no longer performs IPVS checks as part of its preflight checks ([#81791](https://github.com/kubernetes/kubernetes/pull/81791), [@yastij](https://github.com/yastij))
-->
- kubeadm 在其启动前检查中不再执行 IPVS 检查。见 ([#81791](https://github.com/kubernetes/kubernetes/pull/81791)、[@yastij](https://github.com/yastij))。
<!--
- kubeadm: fix for HTTPProxy check for IPv6 addresses ([#82267](https://github.com/kubernetes/kubernetes/pull/82267), [@kad](https://github.com/kad))
-->
- kubeadm：修复 IPv6 地址的 HTTPProxy 检查问题。见 ([#82267](https://github.com/kubernetes/kubernetes/pull/82267)、[@kad](https://github.com/kad))。
<!--
- kubeadm: Allow users to skip the kube-proxy init addon phase during init and still be able to join a cluster and perform some other minor operations (but not upgrade). ([#82248](https://github.com/kubernetes/kubernetes/pull/82248), [@rosti](https://github.com/rosti))
-->
- kubeadm：允许用户在初始化过程中跳过 kube-proxy 初始化插件阶段，但是仍然可以加入集群并执行其他一些次要操作（不能升级）。见 ([#82248](https://github.com/kubernetes/kubernetes/pull/82248)、[@rosti](https://github.com/rosti))。
<!--
- Mounts `/home/kubernetes/bin/nvidia/vulkan/icd.d` on the host to `/etc/vulkan/icd.d` inside containers requesting GPU. ([#78868](https://github.com/kubernetes/kubernetes/pull/78868), [@chardch](https://github.com/chardch))
-->
- 将主机上的 `/home/kubernetes/bin/nvidia/vulkan/icd.d` 挂载到请求 GPU 的容器内的 `/etc/vulkan/icd.d`。见 ([#78868](https://github.com/kubernetes/kubernetes/pull/78868)、[@chardch](https://github.com/chardch))。
<!--
- kubeadm: use the `--pod-network-cidr` flag to init or use the podSubnet field in the kubeadm config to pass a comma separated list of pod CIDRs. ([#79033](https://github.com/kubernetes/kubernetes/pull/79033), [@Arvinderpal](https://github.com/Arvinderpal))
-->
- kubeadm：使用 `--pod-network-cidr` 参数初始化或使用 kubeadm 配置中的 podSubnet 字段传递以逗号分隔的 Pod CIDR 列表。见 ([#79033](https://github.com/kubernetes/kubernetes/pull/79033)、[@Arvinderpal](https://github.com/Arvinderpal))。
<!--
- kubeadm: provide `--control-plane-endpoint` flag for `controlPlaneEndpoint` ([#79270](https://github.com/kubernetes/kubernetes/pull/79270), [@SataQiu](https://github.com/SataQiu))
-->
- kubeadm：为 `controlPlaneEndpoint` 提供 `--control-plane-endpoint` 参数。见 ([#79270](https://github.com/kubernetes/kubernetes/pull/79270)、[@SataQiu](https://github.com/SataQiu))。
<!--
- kubeadm: enable secure serving for the kube-scheduler ([#80951](https://github.com/kubernetes/kubernetes/pull/80951), [@neolit123](https://github.com/neolit123))
-->
- kubeadm：为 kube-scheduler 启用安全服务。见 ([#80951](https://github.com/kubernetes/kubernetes/pull/80951)、[@neolit123](https://github.com/neolit123))。
<!--
- kubeadm: print the stack trace of an error for klog level `--v>=5` ([#80937](https://github.com/kubernetes/kubernetes/pull/80937), [@neolit123](https://github.com/neolit123))
-->
- kubeadm：打印 klog 级别 `--v> = 5` 的错误的堆栈跟踪信息。见 ([#80937](https://github.com/kubernetes/kubernetes/pull/80937)、[@neolit123](https://github.com/neolit123))。
<!--
- Add `--kubernetes-version` to `kubeadm init phase certs ca` and `kubeadm init phase kubeconfig` ([#80115](https://github.com/kubernetes/kubernetes/pull/80115), [@gyuho](https://github.com/gyuho))
-->
- 将 `--kubernetes-version` 添加到 `kubeadm init phase certs ca` 和 `kubeadm init phase kubeconfig` 中。见 ([#80115](https://github.com/kubernetes/kubernetes/pull/80115)、[@gyuho](https://github.com/gyuho))。
<!--
- kubeadm: support fetching configuration from the original cluster for `upgrade diff` ([#80025](https://github.com/kubernetes/kubernetes/pull/80025), [@SataQiu](https://github.com/SataQiu))
-->
- kubeadm：支持从原始集群中获取配置信息以进行 `upgrade diff` 操作。见 ([#80025](https://github.com/kubernetes/kubernetes/pull/80025)、[@SataQiu](https://github.com/SataQiu))。
<!--
- When using the conformance test image, a new environment variable `E2E_USE_GO_RUNNER` will cause the tests to be run with the new golang-based test runner rather than the current bash wrapper. ([#79284](https://github.com/kubernetes/kubernetes/pull/79284), [@johnSchnake](https://github.com/johnSchnake))
-->
- 当使用一致性测试镜像时，新的环境变量 `E2E_USE_GO_RUNNER` 将使测试使用基于 golang 的新测试运行程序而不是当前的 bash 包装程序运行。见 ([#79284](https://github.com/kubernetes/kubernetes/pull/79284)、[@johnSchnake](https://github.com/johnSchnake))。
<!--
- Implement a new feature that allows applying kustomize patches to static pod manifests generated by kubeadm. ([#80905](https://github.com/kubernetes/kubernetes/pull/80905), [@fabriziopandini](https://github.com/fabriziopandini))
-->
- 实施一项新功能，该功能允许将 kustomize 修补程序应用于 kubeadm 生成的静态 pod 清单。见 ([#80905](https://github.com/kubernetes/kubernetes/pull/80905)、[@fabriziopandini](https://github.com/fabriziopandini))。
<!--
- The 404 request handler for the GCE Ingress load balancer now exports prometheus metrics, including:

  - `http_404_request_total` (the number of 404 requests handled)
  - `http_404_request_duration_ms` (the amount of time the server took to respond in ms)

  Also includes percentile groupings. The directory for the default 404 handler includes instructions on how to enable prometheus for monitoring and setting alerts.
  ([#79106](https://github.com/kubernetes/kubernetes/pull/79106), [@vbannai](https://github.com/vbannai))
-->
- GCE Ingress 负载均衡器的 404 请求处理程序现在可以支持导出 Prometheus 指标，包括：

  - `http_404_request_total` （已处理的 404 请求数目）
  - `http_404_request_duration_ms` （服务器响应所花费的时间（以毫秒为单位））

  还包括百分位数分组。默认 404 处理程序的目录包括有关如何启用 Prometheus 来监视和设置警报的说明。见 ([#79106](https://github.com/kubernetes/kubernetes/pull/79106)、[@vbannai](https://github.com/vbannai))。

<!--
### Instrumentation
-->
### 监控设施

<!--
- Kibana has been slightly revamped/improved in the latest version ([#80421](https://github.com/kubernetes/kubernetes/pull/80421), [@lostick](https://github.com/lostick))
-->
- Kibana 已在最新版本中进行了稍微的修改或改进。见 ([#80421](https://github.com/kubernetes/kubernetes/pull/80421)、[@lostick](https://github.com/lostick))。

<!--
### Network
-->
### 网络

<!--
- Fix a string comparison bug in IPVS graceful termination where UDP real servers are not deleted. ([#78999](https://github.com/kubernetes/kubernetes/pull/78999), [@andrewsykim](https://github.com/andrewsykim))
- `kube-proxy --cleanup will` return the correct exit code if the cleanup was successful ([#78775](https://github.com/kubernetes/kubernetes/pull/78775), [@johscheuer](https://github.com/johscheuer))
- Fix a bug in the IPVS proxier where virtual servers are not cleaned up even though the corresponding Service object was deleted. ([#80942](https://github.com/kubernetes/kubernetes/pull/80942), [@gongguan](https://github.com/gongguan))
-->
- 修复了 IPVS 正常终止操作中不删除 UDP 真实服务器的字符串比较错误。见 ([#78999](https://github.com/kubernetes/kubernetes/pull/78999)、[@andrewsykim](https://github.com/andrewsykim))。
- 如果清除成功，`kube-proxy --cleanup will` 返回正确的退出代码。见 ([#78775](https://github.com/kubernetes/kubernetes/pull/78775)、[@johscheuer](https://github.com/johscheuer))。
- 修复了 IPVS 代理中的一个错误，该错误是即使删除了相应的 Service 对象，也无法清理虚拟服务器。见 ([#80942](https://github.com/kubernetes/kubernetes/pull/80942)、[@gongguan](https://github.com/gongguan))。
<!--
- kube-proxy waits for some duration for the node to be defined. ([#77167](https://github.com/kubernetes/kubernetes/pull/77167), [@paulsubrata55](https://github.com/paulsubrata55))
- Increase log level for graceful termination to `v=5` ([#80100](https://github.com/kubernetes/kubernetes/pull/80100), [@andrewsykim](https://github.com/andrewsykim))
- Reduce kube-proxy CPU usage in IPVS mode when a large number of nodePort services exist. ([#79444](https://github.com/kubernetes/kubernetes/pull/79444), [@cezarsa](https://github.com/cezarsa))
-->
- kube-proxy 等待一段时间用来定义节点。见 ([#77167](https://github.com/kubernetes/kubernetes/pull/77167)、[@paulsubrata55](https://github.com/paulsubrata55))。
- 将体面终止的日志级别增加到 `v=5`。见 ([#80100](https://github.com/kubernetes/kubernetes/pull/80100)、[@andrewsykim](https://github.com/andrewsykim))。
- 当存在大量 nodePort 服务时，减少 IPVS 模式下的 kube-proxy CPU 使用率。见 ([#79444](https://github.com/kubernetes/kubernetes/pull/79444)、[@cezarsa](https://github.com/cezarsa))。
<!--
- Fix in kube-proxy for SCTP nodeport service which only works for node's InternalIP, but doesn't work for other IPs present in the node when ipvs is enabled. ([#81477](https://github.com/kubernetes/kubernetes/pull/81477), [@paulsubrata55](https://github.com/paulsubrata55))
- Ensure the `KUBE-MARK-DROP` chain in kube-proxy IPVS mode. The chain is ensured for both IPv4 and IPv6 in dual-stack operation. ([#82214](https://github.com/kubernetes/kubernetes/pull/82214), [@uablrek](https://github.com/uablrek))
- Introduce `node.kubernetes.io/exclude-balancer` and `node.kubernetes.io/exclude-disruption` labels in alpha to prevent cluster deployers from being dependent on the optional `node-role` labels which not all clusters may provide. ([#80238](https://github.com/kubernetes/kubernetes/pull/80238), [@smarterclayton](https://github.com/smarterclayton))
- If targetPort is changed that will process by service controller ([#77712](https://github.com/kubernetes/kubernetes/pull/77712), [@Sn0rt](https://github.com/Sn0rt)) 
-->
- 修复了针对 SCTP nodePort 服务的 kube-proxy 问题，该服务仅适用于节点的 InternalIP，但不适用于启用 ipvs 时节点中存在的其他 IP。见 ([#81477](https://github.com/kubernetes/kubernetes/pull/81477)、[@paulsubrata55](https://github.com/paulsubrata55))。
- 确保 `KUBE-MARK-DROP` 链处于 kube-proxy IPVS 模式。在双栈操作中为 IPv4 和 IPv6 均确保该链。见 ([#82214](https://github.com/kubernetes/kubernetes/pull/82214)、[@uablrek](https://github.com/uablrek))。
- 在 Alpha 功能中引入 `node.kubernetes.io/exclude-balancer` 和 `node.kubernetes.io/exclude-disruption` 标签，用于防止集群部署者依赖于并非所有集群都可以提供的可选 `node-role` 标签。见 ([#80238](https://github.com/kubernetes/kubernetes/pull/80238)、[@smarterclayton](https://github.com/smarterclayton))。
- 如果 targetPort 更改，则将由服务控制器处理 targetPort。见 ([#77712](https://github.com/kubernetes/kubernetes/pull/77712)、[@Sn0rt](https://github.com/Sn0rt))。

<!--
### Node
-->
### 节点

<!--
- Remove PIDs cgroup controller requirement when related feature gates are disabled
  ([#79073](https://github.com/kubernetes/kubernetes/pull/79073), [@rafatio](https://github.com/rafatio))
- Fix kubelet NodeLease potential performance issues. Kubelet now will try to update lease using cached one instead of get from API Server every time. ([#81174](https://github.com/kubernetes/kubernetes/pull/81174), [@answer1991](https://github.com/answer1991))
- Passing an invalid policy name in the `--cpu-manager-policy` flag will now cause the kubelet to fail instead of simply ignoring the flag and running the `cpumanager`’s default policy instead. ([#80294](https://github.com/kubernetes/kubernetes/pull/80294), [@klueska](https://github.com/klueska))
- Make node lease renew interval more heuristic based on node-status-update-frequency in kubelet ([#80173](https://github.com/kubernetes/kubernetes/pull/80173), [@gaorong](https://github.com/gaorong))
-->
- 禁用相关功能开关时，删除 PID cgroup 控制器要求。见 ([#79073](https://github.com/kubernetes/kubernetes/pull/79073)、[@rafatio](https://github.com/rafatio))。
- 修复 kubelet 节点租赁潜在的性能问题。kubelet 现在将尝试使用缓存的租约来更新租约，而不是每次都从 API Server 获取租约。见 ([#81174](https://github.com/kubernetes/kubernetes/pull/81174)、[@answer1991](https://github.com/answer1991))。
- 现在，在 `--cpu-manager-policy` 参数中传递无效的策略名称将导致 kubelet 失败，而不是简单地忽略该参数并运行 `cpumanager` 的默认策略。见 ([#80294](https://github.com/kubernetes/kubernetes/pull/80294)、[@klueska](https://github.com/klueska))。
- 根据 kubelet 中的节点状态更新频率使节点租约更新间隔更具启发性。见 ([#80173](https://github.com/kubernetes/kubernetes/pull/80173)、[@gaorong](https://github.com/gaorong))。
<!--
- Kubelet should now more reliably report the same primary node IP even if the set of node IPs reported by the CloudProvider changes. ([#79391](https://github.com/kubernetes/kubernetes/pull/79391), [@danwinship](https://github.com/danwinship))
- Omit `nil` or empty field when calculating container hash value to avoid hash changed. For a new field with a non-nil default value in the container spec, the hash would still get changed. ([#57741](https://github.com/kubernetes/kubernetes/pull/57741), [@dixudx](https://github.com/dixudx))
- Fix a bug where kubelet would not retry pod sandbox creation when the restart policy of the pod is Never ([#79451](https://github.com/kubernetes/kubernetes/pull/79451), [@yujuhong](https://github.com/yujuhong))
- Limit the body length of exec readiness/liveness probes. remote CRIs and Docker shim read a max of 16MB output of which the exec probe itself inspects 10kb. ([#82514](https://github.com/kubernetes/kubernetes/pull/82514), [@dims](https://github.com/dims))
-->
- 现在，即使云提供商报告中的节点 IP 集合发生了变化，kubelet 也应该更可靠地报告相同的主节点 IP。见 ([#79391](https://github.com/kubernetes/kubernetes/pull/79391))、([@danwinship](https://github.com/danwinship))。
- 计算容器哈希值时请忽略 `nil` 或空字段，以避免哈希值更改。对于容器规范中默认值为非 `nil` 的新字段，哈希值仍会更改。见 ([#57741](https://github.com/kubernetes/kubernetes/pull/57741)、[@dixudx](https://github.com/dixudx))。
- 修复了当 Pod 的重启策略设置为 Never 时，kubelet 不会重试 Pod 沙盒创建的问题。见 ([#79451](https://github.com/kubernetes/kubernetes/pull/79451)、[@yujuhong](https://github.com/yujuhong))。
- 限制执行 readiness 或 liveness 探测的主体长度。远程 CRI 和 Docker Shim 读取的最大输出为 16 MB，而执行探针本身将检查 10kb 的输出。见 ([#82514](https://github.com/kubernetes/kubernetes/pull/82514)、[@dims](https://github.com/dims))。
<!--
- Single static pod files and pod files from http endpoints cannot be larger than 10 MB. HTTP probe payloads are now truncated to 10KB. ([#82669](https://github.com/kubernetes/kubernetes/pull/82669), [@rphillips](https://github.com/rphillips))
- Introduce support for applying pod overhead to pod cgroups, if the PodOverhead feature is enabled. ([#79247](https://github.com/kubernetes/kubernetes/pull/79247), [@egernst](https://github.com/egernst))
- Node-Problem-Detector v0.7.1 is used on GCI ([#80726](https://github.com/kubernetes/kubernetes/pull/80726), [@wangzhen127](https://github.com/wangzhen127))
- Node-Problem-Detector v0.7.1 is used for addon daemonset. ([#82140](https://github.com/kubernetes/kubernetes/pull/82140), [@wangzhen127](https://github.com/wangzhen127))
-->
- 单个静态 Pod 文件和来自 http 端点的 Pod 文件不能大于 10 MB。HTTP 探针负载现在被截断为 10 KB。见 ([#82669](https://github.com/kubernetes/kubernetes/pull/82669)、[@rphillips](https://github.com/rphillips))。
- 如果启用了 PodOverhead 功能，则将引入了 Pod 开销应用于 Pod cgroup 的支持。见 ([#79247](https://github.com/kubernetes/kubernetes/pull/79247)、[@egernst](https://github.com/egernst))。
- 在 GCI 上使用 Node-Problem-Detector v0.7.1。见 ([#80726](https://github.com/kubernetes/kubernetes/pull/80726)、[@wangzhen127](https://github.com/wangzhen127))。
- Node-Problem-Detector v0.7.1 用于插件 daemonset。见 ([#82140](https://github.com/kubernetes/kubernetes/pull/82140)、[@wangzhen127](https://github.com/wangzhen127))。
<!--
- Enable cAdvisor ProcessMetrics collecting. ([#79002](https://github.com/kubernetes/kubernetes/pull/79002), [@jiayingz](https://github.com/jiayingz))
- kubelet: change `node-lease-renew-interval` to 0.25 of lease-renew-duration ([#80429](https://github.com/kubernetes/kubernetes/pull/80429), [@gaorong](https://github.com/gaorong))
- Attempt to set the kubelet's hostname & internal IP if `--cloud-provider=external` and no node addresses exists ([#75229](https://github.com/kubernetes/kubernetes/pull/75229), [@andrewsykim](https://github.com/andrewsykim))
-->
- 启用 cAdvisor ProcessMetrics 指标收集。见 ([#79002](https://github.com/kubernetes/kubernetes/pull/79002)、[@jiayingz](https://github.com/jiayingz))。
- kubelet：将 `node-lease-renew-interval` 更改为 0.25 的续租期限。见 ([#80429](https://github.com/kubernetes/kubernetes/pull/80429)、[@gaorong](https://github.com/gaorong))。
- 如果 `--cloud-provider=external` 并且不存在节点地址，则尝试设置 kubelet 的主机名和内部 IP。见 ([#75229](https://github.com/kubernetes/kubernetes/pull/75229)、[@andrewsykim](https://github.com/andrewsykim))。

<!--
### Scheduling
-->
### 调度

<!--
- Scheduler should terminate when it loses leader lock. ([#81306](https://github.com/kubernetes/kubernetes/pull/81306), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
- If scheduler extender filtered a not found node, current scheduling round for this pod will just be skipped.
  ([#79641](https://github.com/kubernetes/kubernetes/pull/79641), [@yqwang-ms](https://github.com/yqwang-ms))
- Extender bind should respect IsInterested ([#79804](https://github.com/kubernetes/kubernetes/pull/79804), [@yqwang-ms](https://github.com/yqwang-ms))
- Fix an issue with toleration merging & whitelist checking in the PodTolerationRestriction admission controller. ([#81732](https://github.com/kubernetes/kubernetes/pull/81732), [@tallclair](https://github.com/tallclair))
-->
- 当 Scheduler 丢失领导者锁时，Scheduler 应终止。见 ([#81306](https://github.com/kubernetes/kubernetes/pull/81306)、[@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))。
- 如果 scheduler 扩展程序过滤了一个未找到的节点，则此 Pod 的当前调度回合将被跳过。见 ([#79641](https://github.com/kubernetes/kubernetes/pull/79641)、[@yqwang-ms](https://github.com/yqwang-ms))。
- Extender 绑定应该匹配 IsInterested。见 ([#79804](https://github.com/kubernetes/kubernetes/pull/79804)、[@yqwang-ms](https://github.com/yqwang-ms))。
- 解决了 PodTolerationRestriction admission controller（准入控制器）中的容忍合并和白名单检查问题。见 ([#81732](https://github.com/kubernetes/kubernetes/pull/81732)、[@tallclair](https://github.com/tallclair))。
<!--
- Add a helper function to decode scheduler plugin args. ([#80696](https://github.com/kubernetes/kubernetes/pull/80696), [@hex108](https://github.com/hex108))
- Fix filter plugins are not been called during preemption ([#81876](https://github.com/kubernetes/kubernetes/pull/81876), [@wgliang](https://github.com/wgliang))
- Fix an issue that the correct PluginConfig.Args is not passed to the corresponding PluginFactory in kube-scheduler when multiple PluginConfig items are defined. ([#82483](https://github.com/kubernetes/kubernetes/pull/82483), [@everpeace](https://github.com/everpeace))
- Take the context as the first argument of Schedule. ([#82119](https://github.com/kubernetes/kubernetes/pull/82119), [@wgliang](https://github.com/wgliang))
-->
- 添加一个工具函数来解码 scheduler 插件参数。见 ([#80696](https://github.com/kubernetes/kubernetes/pull/80696)、[@hex108](https://github.com/hex108))。
- 修复抢占期间未调用过滤器插件。见 ([#81876](https://github.com/kubernetes/kubernetes/pull/81876)、[@wgliang](https://github.com/wgliang))。
- 修复了以下问题：定义了多个 PluginConfig 项时，正确的 PluginConfig.Args 没有传递到 kube-scheduler 中的相应 PluginFactory。见 ([#82483](https://github.com/kubernetes/kubernetes/pull/82483)、[@everpeace](https://github.com/everpeace))。
- 将上下文作为 Scheduler 的第一个参数。见 ([#82119](https://github.com/kubernetes/kubernetes/pull/82119)、[@wgliang](https://github.com/wgliang))。
<!--
- Implement `post-filter` extension point for scheduling framework ([#78097](https://github.com/kubernetes/kubernetes/pull/78097), [@draveness](https://github.com/draveness))
- Add Bind extension point of the scheduling framework ([#78513](https://github.com/kubernetes/kubernetes/pull/78513), [@chenchun](https://github.com/chenchun))
- Add Filter extension point to the scheduling framework. ([#78477](https://github.com/kubernetes/kubernetes/pull/78477), [@YoubingLi](https://github.com/YoubingLi))
- Return error when the scoring plugin returns score out of range `[0, 100]`. ([#81015](https://github.com/kubernetes/kubernetes/pull/81015), [@draveness](https://github.com/draveness))
-->
- 为调度框架实现 `post-filter` 扩展。见 ([#78097](https://github.com/kubernetes/kubernetes/pull/78097)、[@draveness](https://github.com/draveness))。
- 添加调度框架的绑定扩展点。见 ([#78513](https://github.com/kubernetes/kubernetes/pull/78513)、[@chenchun](https://github.com/chenchun))。
- 将过滤器扩展点添加到调度框架。见 ([#78477](https://github.com/kubernetes/kubernetes/pull/78477)、[@YoubingLi](https://github.com/YoubingLi))。
- 当计分插件返回分数超出 `[0, 100]` 范围时，返回错误。见 ([#81015](https://github.com/kubernetes/kubernetes/pull/81015)、[@draveness](https://github.com/draveness))。
<!--
- Use a named array instead of a score array in normalizing-score phase. ([#80901](https://github.com/kubernetes/kubernetes/pull/80901), [@draveness](https://github.com/draveness))
- Updates the `requestedToCapacityRatioArguments` to add resources parameter that allows the users to specify the resource name along with weights for each resource to score nodes based on the request to capacity ratio. ([#77688](https://github.com/kubernetes/kubernetes/pull/77688), [@sudeshsh](https://github.com/sudeshsh))
- Add `UnschedulableAndUnresolvable` status code for scheduling framework ([#82034](https://github.com/kubernetes/kubernetes/pull/82034), [@alculquicondor](https://github.com/alculquicondor))
-->
- 在规范化评分阶段，使用命名数组而不是分数数组。见 ([#80901](https://github.com/kubernetes/kubernetes/pull/80901)、[@draveness](https://github.com/draveness))。
- 更新 `requestedToCapacityRatioArguments` 用于添加资源参数，该参数允许用户指定资源名称以及每种资源的权重，基于请求与容量之比为节点评分。见 ([#77688](https://github.com/kubernetes/kubernetes/pull/77688)、[@sudeshsh](https://github.com/sudeshsh))。
- 为调度框架添加 `UnschedulableAndUnresolvable` 状态码。见 ([#82034](https://github.com/kubernetes/kubernetes/pull/82034)、[@alculquicondor](https://github.com/alculquicondor))。
<!--
- Add normalize plugin extension point for the scheduling framework.
  ([#80383](https://github.com/kubernetes/kubernetes/pull/80383), [@liu-cong](https://github.com/liu-cong))
- Add Bind extension point to the scheduling framework. ([#79313](https://github.com/kubernetes/kubernetes/pull/79313), [@chenchun](https://github.com/chenchun))
- Add Score extension point to the scheduling framework. ([#79109](https://github.com/kubernetes/kubernetes/pull/79109), [@ahg-g](https://github.com/ahg-g))
- Add Pre-filter extension point to the scheduling framework. ([#78005](https://github.com/kubernetes/kubernetes/pull/78005), [@ahg-g](https://github.com/ahg-g))
- Add support for writing out of tree custom scheduler plugins. ([#78162](https://github.com/kubernetes/kubernetes/pull/78162), [@hex108](https://github.com/hex108))
-->
- 为调度框架添加标准化插件扩展点。见 ([#80383](https://github.com/kubernetes/kubernetes/pull/80383)、[@liu-cong](https://github.com/liu-cong))。
- 将绑定扩展点添加到调度框架。见 ([#79313](https://github.com/kubernetes/kubernetes/pull/79313)、[@chenchun](https://github.com/chenchun))。
- 将 Score 扩展点添加到调度框架。见 ([#79109](https://github.com/kubernetes/kubernetes/pull/79109)、[@ahg-g](https://github.com/ahg-g))。
- 将预过滤器扩展点添加到调度框架。见 ([#78005](https://github.com/kubernetes/kubernetes/pull/78005)、[@ahg-g](https://github.com/ahg-g))。
- 添加对列出树形自定义调度程序插件的支持。见 ([#78162](https://github.com/kubernetes/kubernetes/pull/78162)、[@hex108](https://github.com/hex108))。

<!--
### Storage
-->
### 存储

<!--
- Fix possible file descriptor leak and closing of dirs in `doSafeMakeDir` ([#79534](https://github.com/kubernetes/kubernetes/pull/79534), [@odinuge](https://github.com/odinuge))
- Azure disks of shared kind will no longer fail if they do not contain `skuname` or `storageaccounttype`. ([#80837](https://github.com/kubernetes/kubernetes/pull/80837), [@rmweir](https://github.com/rmweir))
- Fix CSI plugin supporting raw block that does not need attach mounted failed ([#79920](https://github.com/kubernetes/kubernetes/pull/79920), [@cwdsuzhou](https://github.com/cwdsuzhou))
- Reduces GCE PD Node Attach Limits by 1 since the node boot disk is considered an attachable disk ([#80923](https://github.com/kubernetes/kubernetes/pull/80923), [@davidz627](https://github.com/davidz627))
-->
- 修复 `doSafeMakeDir` 中可能的文件描述符泄漏和目录关闭。见 ([#79534](https://github.com/kubernetes/kubernetes/pull/79534)、[@odinuge](https://github.com/odinuge))。
- 如果共享类型的 Azure 磁盘不包含 `skuname` 或 `storageaccounttype`，它们将不再失败。见 ([#80837](https://github.com/kubernetes/kubernetes/pull/80837)、[@rmweir](https://github.com/rmweir))。
- 修复了 CSI 插件支持不需要附加安装的原始块失败的问题。见 ([#79920](https://github.com/kubernetes/kubernetes/pull/79920)、[@cwdsuzhou](https://github.com/cwdsuzhou))。
- 将 GCE PD 节点附加限制减 1，因为节点启动磁盘被视为可附加磁盘。见 ([#80923](https://github.com/kubernetes/kubernetes/pull/80923)、[@davidz627](https://github.com/davidz627))。
<!--
- Remove iSCSI volume storage cleartext secrets in logs ([#81215](https://github.com/kubernetes/kubernetes/pull/81215), [@zouyee](https://github.com/zouyee))
- Fixes validation of VolumeAttachment API objects created with inline volume sources. ([#80945](https://github.com/kubernetes/kubernetes/pull/80945), [@tedyu](https://github.com/tedyu))
- Changes timeout value in csi plugin from 15s to 2min which fixes the timeout issue ([#79529](https://github.com/kubernetes/kubernetes/pull/79529), [@andyzhangx](https://github.com/andyzhangx))
- Fix kubelet fail to delete orphaned pod directory when the kubelet's pods directory (default is `/var/lib/kubelet/pods`) symbolically links to another disk device's directory ([#79094](https://github.com/kubernetes/kubernetes/pull/79094), [@gaorong](https://github.com/gaorong))
-->
- 删除日志中的 iSCSI 卷存储明文密钥。见 (https://github.com/kubernetes/kubernetes/pull/81215)、[@zouyee](https://github.com/zouyee))。
- 修复了对使用嵌入式卷源创建的 VolumeAttachment API 对象的验证。见 ([#80945](https://github.com/kubernetes/kubernetes/pull/80945)、[@tedyu](https://github.com/tedyu))。
- 将 csi 插件中的超时值从 15 s 更改为 2 min，从而解决了超时问题。见 ([#79529](https://github.com/kubernetes/kubernetes/pull/79529)、[@andyzhangx](https://github.com/andyzhangx))。
- 修复 kubelet 的 Pod 目录（默认为 `/var/lib/kubelet/pods`）象征性地链接到另一个磁盘设备的目录时，kubelet 无法删除孤立的 pod 目录的问题。见 ([#79094](https://github.com/kubernetes/kubernetes/pull/79094)、[@gaorong](https://github.com/gaorong))。
<!--
## Testing
-->
## 测试

<!--
- Fix pod list return value of `framework.WaitForPodsWithLabelRunningReady` ([#78687](https://github.com/kubernetes/kubernetes/pull/78687), [@pohly](https://github.com/pohly))
- Adding `TerminationGracePeriodSeconds` to the test framework API ([#82170](https://github.com/kubernetes/kubernetes/pull/82170), [@vivekbagade](https://github.com/vivekbagade))
- `/test/e2e/framework`: Adds a flag `non-blocking-taints` which allows tests to run in environments with tainted nodes. String value should be a comma-separated list. ([#81043](https://github.com/kubernetes/kubernetes/pull/81043), [@johnSchnake](https://github.com/johnSchnake))
-->
- 修正 Pod 列表返回值为 `framework.WaitForPodsWithLabelRunningReady`。见 ([#78687](https://github.com/kubernetes/kubernetes/pull/78687)、[@pohly](https://github.com/pohly))。
- 将 `TerminationGracePeriodSeconds` 添加到测试框架 API 中。见 ([#82170](https://github.com/kubernetes/kubernetes/pull/82170)、[@vivekbagade](https://github.com/vivekbagade))。
- `/test/e2e/framework`：添加一个参数 `non-blocking-taints`，该参数允许测试在带有污染节点的环境中运行。字符串的值应为逗号分隔的列表。见 ([#81043](https://github.com/kubernetes/kubernetes/pull/81043)、[@johnSchnake](https://github.com/johnSchnake))。
<!--
- Move CSI volume expansion to beta. ([#81467](https://github.com/kubernetes/kubernetes/pull/81467), [@bertinatto](https://github.com/bertinatto))
- Added E2E tests validating WindowsOptions.RunAsUserName. ([#79539](https://github.com/kubernetes/kubernetes/pull/79539), [@bclau](https://github.com/bclau))
- `framework.ExpectNoError` no longer logs the error and instead relies on using the new `log.Fail` as gomega fail handler. ([#80253](https://github.com/kubernetes/kubernetes/pull/80253), [@pohly](https://github.com/pohly))
-->
- 将 CSI 卷扩展移动到 Beta 功能。见 ([#81467](https://github.com/kubernetes/kubernetes/pull/81467)、[@bertinatto](https://github.com/bertinatto))。
- 添加了验证 WindowsOptions.RunAsUserName 的 E2E 测试。见 ([#79539](https://github.com/kubernetes/kubernetes/pull/79539)、[@bclau](https://github.com/bclau))。
- `framework.ExpectNoError` 不再记录错误，而是依靠使用新的 `log.Fail` 作为 Gomega 故障处理程序。见 ([#80253](https://github.com/kubernetes/kubernetes/pull/80253)、[@pohly](https://github.com/pohly))。

### Windows

<!--
- On Windows systems, `%USERPROFILE%` is now preferred over `%HOMEDRIVE%\%HOMEPATH%` as the home folder if `%HOMEDRIVE%\%HOMEPATH%` does not contain a `.kube\config` file, and `%USERPROFILE%` exists and is writable. ([#73923](https://github.com/kubernetes/kubernetes/pull/73923), [@liggitt](https://github.com/liggitt))
- Add support for AWS EBS on windows ([#79552](https://github.com/kubernetes/kubernetes/pull/79552), [@wongma7](https://github.com/wongma7))
- Support Kubelet plugin watcher on Windows nodes. ([#81397](https://github.com/kubernetes/kubernetes/pull/81397), [@ddebroy](https://github.com/ddebroy))
-->
- 在 Windows 系统上，如果 `%HOMEDRIVE%\%HOMEPATH%` 不包含 `.kube\config` 文件并且 `%USERPROFILE%` 存在且可写，那么 `%USERPROFILE%` 现在比 `%HOMEDRIVE%\%HOMEPATH%` 更适合作为主文件夹。见 ([#73923](https://github.com/kubernetes/kubernetes/pull/73923)、[@liggitt](https://github.com/liggitt))。
- 在 Windows 上添加对 AWS EBS 的支持。见 ([#79552](https://github.com/kubernetes/kubernetes/pull/79552)、[@wongma7](https://github.com/wongma7))。
- 在 Windows 节点上支持 kubelet 插件监视程序。见 ([#81397](https://github.com/kubernetes/kubernetes/pull/81397)、[@ddebroy](https://github.com/ddebroy))。
<!--
## Dependencies
-->
## 相关依赖

<!--
### Changed
-->
### 变更

<!--
- the default Go version was updated to v1.12.9. ([#78958](https://github.com/kubernetes/kubernetes/pull/78958), [#79966](https://github.com/kubernetes/kubernetes/pull/79966), [#81390](https://github.com/kubernetes/kubernetes/pull/81390), [#81489](https://github.com/kubernetes/kubernetes/pull/81489))
- etcd has been updated to v3.3.15 ([#82199](https://github.com/kubernetes/kubernetes/pull/82199), [@dims](https://github.com/dims))
- CoreDNS for kubeadm and kube-up has been updated to v1.6.2 ([#82127](https://github.com/kubernetes/kubernetes/pull/82127))
- Cluster Autoscaler has been updated to v1.16.0 ([#82501](https://github.com/kubernetes/kubernetes/pull/82501), [@losipiuk](https://github.com/losipiuk))
- fluentd has been updated to v1.5.1 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014))
- fluentd-elasticsearch plugin has been updated to v3.5.3 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014))
- elasticsearch has been updated to v7.1.1 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014))
- kibana has been updated to v7.1.1 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014))
- Azure SDK and go-autorest API versions have been updated ([#79574](https://github.com/kubernetes/kubernetes/pull/79574))
- Azure API versions have been updated (container registry to 2018-09-01, network to 2018-08-01) ([#79583](https://github.com/kubernetes/kubernetes/pull/79583))
- kube-addon-manager has been updated to v9.0.2 ([#80861](https://github.com/kubernetes/kubernetes/pull/80861))
- golang/x/net has been updated to bring in fixes for CVE-2019-9512, CVE-2019-9514 ([#81394](https://github.com/kubernetes/kubernetes/pull/81394))
- GCE windows node image has been updated. ([#81106](https://github.com/kubernetes/kubernetes/pull/81106))
- portworx plugin has been updated on libopenstorage/openstorage to v1.0.0 ([#80495](https://github.com/kubernetes/kubernetes/pull/80495))
- metrics-server has been updated to v0.3.4 ([#82322](https://github.com/kubernetes/kubernetes/pull/82322), [@olagacek](https://github.com/olagacek))
- klog has been updated to v0.4.0 ([#81164](https://github.com/kubernetes/kubernetes/pull/81164))
-->
- 默认的 Go 版本已更新至 v1.12.9。见 ([#78958](https://github.com/kubernetes/kubernetes/pull/78958)、[#79966](https://github.com/kubernetes/kubernetes/pull/79966)、[#81390](https://github.com/kubernetes/kubernetes/pull/81390)、[#81489](https://github.com/kubernetes/kubernetes/pull/81489))。
- etcd 已更新至 v3.3.15。见 ([#82199](https://github.com/kubernetes/kubernetes/pull/82199)、[@dims](https://github.com/dims))。
- 适用于 kubeadm 和 kube-up 的 CoreDNS 已更新至 v1.6.2。见 ([#82127](https://github.com/kubernetes/kubernetes/pull/82127))。
- 集群自动扩缩已更新至 v1.16.0。见 ([#82501](https://github.com/kubernetes/kubernetes/pull/82501)、[@losipiuk](https://github.com/losipiuk))。
- fluentd 已更新至 v1.5.1。见 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014))。
- fluentd-elasticsearch 插件已更新至 v3.5.3。见 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014))。
- elasticsearch 已更新至 v7.1.1。见 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014))。
- kibana 已更新至 v7.1.1。见 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014))。
- Azure SDK 和 go-autorest API 版本已更新。见 ([#79574](https://github.com/kubernetes/kubernetes/pull/79574))。
- Azure API 版本已更新（容器 registry 到 2018-09-01，网络到 2018-08-01）。见 ([#79583](https://github.com/kubernetes/kubernetes/pull/79583))。
- kube-addon-manager 已更新至 v9.0.2。见 ([#80861](https://github.com/kubernetes/kubernetes/pull/80861))。
- golang/x/net 已更新，引入针对 CVE-2019-9512、CVE-2019-9514 的修复程序。见 ([#81394](https://github.com/kubernetes/kubernetes/pull/81394))。
- GCE windows 节点镜像已更新。见 ([#81106](https://github.com/kubernetes/kubernetes/pull/81106))。
- portworx 插件已在 libopenstorage/openstorage 上更新为 v1.0.0。见 ([#80495](https://github.com/kubernetes/kubernetes/pull/80495))。
- metrics-server 已更新至 v0.3.4。见 ([#82322](https://github.com/kubernetes/kubernetes/pull/82322)、[@olagacek](https://github.com/olagacek))。
- klog 已更新至 v0.4.0。见 ([#81164](https://github.com/kubernetes/kubernetes/pull/81164))。

<!--
### Unchanged
-->
### 不变

<!--
- The list of validated docker versions remains unchanged.
  - The current list is 1.13.1, 17.03, 17.06, 17.09, 18.06, 18.09. ([#72823](https://github.com/kubernetes/kubernetes/pull/72823), [#72831](https://github.com/kubernetes/kubernetes/pull/72831))
- CNI remains unchanged at v0.7.5. ([#75455](https://github.com/kubernetes/kubernetes/pull/75455))
- cri-tools remains unchanged at v1.14.0. ([#75658](https://github.com/kubernetes/kubernetes/pull/75658))
- CAdvisor remains unchanged at v0.33.2. ([#76291](https://github.com/kubernetes/kubernetes/pull/76291))
- event-exporter remains unchanged at v0.2.5. ([#77815](https://github.com/kubernetes/kubernetes/pull/77815))
- ip-masq-agent remains unchanged at v2.4.1. ([#77844](https://github.com/kubernetes/kubernetes/pull/77844))
- k8s-dns-node-cache remains unchanged at v1.15.1 ([#76640](https://github.com/kubernetes/kubernetes/pull/76640), [@george-angel](https://github.com/george-angel))
- CSI remains unchanged at to v1.1.0. ([#75391](https://github.com/kubernetes/kubernetes/pull/75391))
- The dashboard add-on remains unchanged at v1.10.1. ([#72495](https://github.com/kubernetes/kubernetes/pull/72495))
- kube-dns is unchanged at v1.14.13 as of Kubernetes 1.12. ([#68900](https://github.com/kubernetes/kubernetes/pull/68900))
- Influxdb is unchanged at v1.3.3 as of Kubernetes 1.10. ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))
- Grafana is unchanged at v4.4.3 as of Kubernetes 1.10. ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))
- The fluent-plugin-kubernetes_metadata_filter plugin in fluentd-elasticsearch is unchanged at v2.1.6. ([#71180](https://github.com/kubernetes/kubernetes/pull/71180))
- fluentd-gcp is unchanged at v3.2.0 as of Kubernetes 1.13. ([#70954](https://github.com/kubernetes/kubernetes/pull/70954))
- OIDC authentication is unchanged at coreos/go-oidc v2 as of Kubernetes 1.10. ([#58544](https://github.com/kubernetes/kubernetes/pull/58544))
- Calico is unchanged at v3.3.1 as of Kubernetes 1.13. ([#70932](https://github.com/kubernetes/kubernetes/pull/70932))
- GLBC remains unchanged at v1.2.3 as of Kubernetes 1.12. ([#66793](https://github.com/kubernetes/kubernetes/pull/66793))
- Ingress-gce remains unchanged at v1.2.3 as of Kubernetes 1.12. ([#66793](https://github.com/kubernetes/kubernetes/pull/66793))
-->
- 经过验证的 Docker 版本列表保持不变。
  - 当前列表是 1.13.1、17.03、17.06、17.09、18.06、8.09。见 ([#72823](https://github.com/kubernetes/kubernetes/pull/72823)、[#72831](https://github.com/kubernetes/kubernetes/pull/72831))。
- CNI 保持在 v0.7.5 不变。见 ([#75455](https://github.com/kubernetes/kubernetes/pull/75455))。
- cri-tools 保持在 v1.14.0 不变。见 ([#75658](https://github.com/kubernetes/kubernetes/pull/75658))。
- CAdvisor 保持在 v0.33.2 不变。见 ([#76291](https://github.com/kubernetes/kubernetes/pull/76291))。
- event-exporter 保持在 v0.2.5 不变。见 ([#77815](https://github.com/kubernetes/kubernetes/pull/77815))。
- ip-masq-agent 保持在 v2.4.1 不变。见 ([#77844](https://github.com/kubernetes/kubernetes/pull/77844))。
- k8s-dns-node-cache 保持在 v1.15.1 不变。见 ([#76640](https://github.com/kubernetes/kubernetes/pull/76640)、[@george-angel](https://github.com/george-angel))。
- CSI 保持在 v1.1.0 不变。见 ([#75391](https://github.com/kubernetes/kubernetes/pull/75391))。
- dashboard 插件保持在 v1.10.1 不变。见 ([#72495](https://github.com/kubernetes/kubernetes/pull/72495))。
- 从 Kubernetes 1.12 开始，kube-dns 保持在 v1.14.13 不变。见 ([#68900](https://github.com/kubernetes/kubernetes/pull/68900))。
- 从 Kubernetes 1.10 开始，Influxdb 保持在 v1.3.3 不变。见 ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))。
- 从 Kubernetes 1.10 开始，Grafana 保持在 v4.4.3 不变。见 ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))。
- fluentd-elasticsearch 中的 fluent-plugin-kubernetes_metadata_filter 插件保持在 v2.1.6 不变。见 ([#71180](https://github.com/kubernetes/kubernetes/pull/71180))。
- 从 Kubernetes 1.13 开始，fluentd-gcp 保持在 v3.2.0 不变。见 ([#70954](https://github.com/kubernetes/kubernetes/pull/70954))。
- 从 Kubernetes 1.10 开始，OIDC 身份验证保持在 coreos/go-oidc v2 不变。见 ([#58544](https://github.com/kubernetes/kubernetes/pull/58544))。
- 从 Kubernetes 1.13 开始，Calico 保持在 v3.3.1 不变。见 ([#70932](https://github.com/kubernetes/kubernetes/pull/70932))。
- 从 Kubernetes 1.12 开始，GLBC 保持在 v1.2.3 不变。见 ([#66793](https://github.com/kubernetes/kubernetes/pull/66793))。
- 从 Kubernetes 1.12 开始，Ingress-gce 保持在 v1.2.3 不变。见 ([#66793](https://github.com/kubernetes/kubernetes/pull/66793))。

<!--
### Removed
-->
### 删除

<!--
- Remove deprecated github.com/kardianos/osext dependency ([#80142](https://github.com/kubernetes/kubernetes/pull/80142))
-->
- 删除不推荐使用的 github.com/kardianos/osext 依赖项。见 ([#80142](https://github.com/kubernetes/kubernetes/pull/80142))。

<!--
### Detailed go Dependency Changes
-->
### 详细的 go 依赖项变更

<!--
#### Added
-->
#### 添加的依赖项

- github.com/Azure/go-autorest/autorest/adal: [v0.5.0](https://github.com/Azure/go-autorest/autorest/adal/tree/v0.5.0)
- github.com/Azure/go-autorest/autorest/date: [v0.1.0](https://github.com/Azure/go-autorest/autorest/date/tree/v0.1.0)
- github.com/Azure/go-autorest/autorest/mocks: [v0.2.0](https://github.com/Azure/go-autorest/autorest/mocks/tree/v0.2.0)
- github.com/Azure/go-autorest/autorest/to: [v0.2.0](https://github.com/Azure/go-autorest/autorest/to/tree/v0.2.0)
- github.com/Azure/go-autorest/autorest/validation: [v0.1.0](https://github.com/Azure/go-autorest/autorest/validation/tree/v0.1.0)
- github.com/Azure/go-autorest/autorest: [v0.9.0](https://github.com/Azure/go-autorest/autorest/tree/v0.9.0)
- github.com/Azure/go-autorest/logger: [v0.1.0](https://github.com/Azure/go-autorest/logger/tree/v0.1.0)
- github.com/Azure/go-autorest/tracing: [v0.5.0](https://github.com/Azure/go-autorest/tracing/tree/v0.5.0)
- github.com/armon/consul-api: [eb2c6b5](https://github.com/armon/consul-api/tree/eb2c6b5)
- github.com/bifurcation/mint: [93c51c6](https://github.com/bifurcation/mint/tree/93c51c6)
- github.com/caddyserver/caddy: [v1.0.3](https://github.com/caddyserver/caddy/tree/v1.0.3)
- github.com/cenkalti/backoff: [v2.1.1+incompatible](https://github.com/cenkalti/backoff/tree/v2.1.1)
- github.com/checkpoint-restore/go-criu: [bdb7599](https://github.com/checkpoint-restore/go-criu/tree/bdb7599)
- github.com/cheekybits/genny: [9127e81](https://github.com/cheekybits/genny/tree/9127e81)
- github.com/coredns/corefile-migration: [v1.0.2](https://github.com/coredns/corefile-migration/tree/v1.0.2)
- github.com/coreos/go-etcd: [v2.0.0+incompatible](https://github.com/coreos/go-etcd/tree/v2.0.0)
- github.com/dustin/go-humanize: [v1.0.0](https://github.com/dustin/go-humanize/tree/v1.0.0)
- github.com/fatih/color: [v1.6.0](https://github.com/fatih/color/tree/v1.6.0)
- github.com/flynn/go-shlex: [3f9db97](https://github.com/flynn/go-shlex/tree/3f9db97)
- github.com/go-acme/lego: [v2.5.0+incompatible](https://github.com/go-acme/lego/tree/v2.5.0)
- github.com/go-bindata/go-bindata: [v3.1.1+incompatible](https://github.com/go-bindata/go-bindata/tree/v3.1.1)
- github.com/go-logr/logr: [v0.1.0](https://github.com/go-logr/logr/tree/v0.1.0)
- github.com/google/martian: [v2.1.0+incompatible](https://github.com/google/martian/tree/v2.1.0)
- github.com/google/pprof: [3ea8567](https://github.com/google/pprof/tree/3ea8567)
- github.com/google/renameio: [v0.1.0](https://github.com/google/renameio/tree/v0.1.0)
- github.com/googleapis/gax-go/v2: [v2.0.4](https://github.com/googleapis/gax-go/v2/tree/v2.0.4)
- github.com/hashicorp/go-syslog: [v1.0.0](https://github.com/hashicorp/go-syslog/tree/v1.0.0)
- github.com/jimstudt/http-authentication: [3eca13d](https://github.com/jimstudt/http-authentication/tree/3eca13d)
- github.com/kisielk/errcheck: [v1.2.0](https://github.com/kisielk/errcheck/tree/v1.2.0)
- github.com/kisielk/gotool: [v1.0.0](https://github.com/kisielk/gotool/tree/v1.0.0)
- github.com/klauspost/cpuid: [v1.2.0](https://github.com/klauspost/cpuid/tree/v1.2.0)
- github.com/kr/pty: [v1.1.5](https://github.com/kr/pty/tree/v1.1.5)
- github.com/kylelemons/godebug: [d65d576](https://github.com/kylelemons/godebug/tree/d65d576)
- github.com/lucas-clemente/aes12: [cd47fb3](https://github.com/lucas-clemente/aes12/tree/cd47fb3)
- github.com/lucas-clemente/quic-clients: [v0.1.0](https://github.com/lucas-clemente/quic-clients/tree/v0.1.0)
- github.com/lucas-clemente/quic-go-certificates: [d2f8652](https://github.com/lucas-clemente/quic-go-certificates/tree/d2f8652)
- github.com/lucas-clemente/quic-go: [v0.10.2](https://github.com/lucas-clemente/quic-go/tree/v0.10.2)
- github.com/marten-seemann/qtls: [v0.2.3](https://github.com/marten-seemann/qtls/tree/v0.2.3)
- github.com/mattn/go-colorable: [v0.0.9](https://github.com/mattn/go-colorable/tree/v0.0.9)
- github.com/mattn/go-isatty: [v0.0.3](https://github.com/mattn/go-isatty/tree/v0.0.3)
- github.com/mholt/certmagic: [6a42ef9](https://github.com/mholt/certmagic/tree/6a42ef9)
- github.com/mitchellh/go-homedir: [v1.1.0](https://github.com/mitchellh/go-homedir/tree/v1.1.0)
- github.com/naoina/go-stringutil: [v0.1.0](https://github.com/naoina/go-stringutil/tree/v0.1.0)
- github.com/naoina/toml: [v0.1.1](https://github.com/naoina/toml/tree/v0.1.1)
- github.com/rogpeppe/go-internal: [v1.3.0](https://github.com/rogpeppe/go-internal/tree/v1.3.0)
- github.com/thecodeteam/goscaleio: [v0.1.0](https://github.com/thecodeteam/goscaleio/tree/v0.1.0)
- github.com/ugorji/go/codec: [d75b2dc](https://github.com/ugorji/go/codec/tree/d75b2dc)
- github.com/xordataexchange/crypt: [b2862e3](https://github.com/xordataexchange/crypt/tree/b2862e3)
- go.opencensus.io: v0.21.0
- golang.org/x/mod: 4bf6d31
- gopkg.in/airbrake/gobrake.v2: v2.0.9
- gopkg.in/errgo.v2: v2.1.0
- gopkg.in/gemnasium/logrus-airbrake-hook.v2: v2.1.2
- gopkg.in/mcuadros/go-syslog.v2: v2.2.1
- gotest.tools/gotestsum: v0.3.5
- honnef.co/go/tools: v0.0.1-2019.2.2

<!--
#### Changed
-->
#### 变更了的依赖项

- cloud.google.com/go: v0.34.0 → v0.38.0
- github.com/Azure/azure-sdk-for-go: [v21.4.0+incompatible → v32.5.0+incompatible](https://github.com/Azure/azure-sdk-for-go/compare/v21.4.0...v32.5.0)
- github.com/BurntSushi/toml: [v0.3.0 → v0.3.1](https://github.com/BurntSushi/toml/compare/v0.3.0...v0.3.1)
- github.com/GoogleCloudPlatform/k8s-cloud-provider: [f8e9959 → 27a4ced](https://github.com/GoogleCloudPlatform/k8s-cloud-provider/compare/f8e9959...27a4ced)
- github.com/PuerkitoBio/purell: [v1.1.0 → v1.1.1](https://github.com/PuerkitoBio/purell/compare/v1.1.0...v1.1.1)
- github.com/asaskevich/govalidator: [f9ffefc → f61b66f](https://github.com/asaskevich/govalidator/compare/f9ffefc...f61b66f)
- github.com/client9/misspell: [9ce5d97 → v0.3.4](https://github.com/client9/misspell/compare/9ce5d97...v0.3.4)
- github.com/containernetworking/cni: [v0.6.0 → v0.7.1](https://github.com/containernetworking/cni/compare/v0.6.0...v0.7.1)
- github.com/coreos/etcd: [v3.3.13+incompatible → v3.3.15+incompatible](https://github.com/coreos/etcd/compare/v3.3.13...v3.3.15)
- github.com/coreos/go-oidc: [065b426 → v2.1.0+incompatible](https://github.com/coreos/go-oidc/compare/065b426...v2.1.0)
- github.com/coreos/go-semver: [e214231 → v0.3.0](https://github.com/coreos/go-semver/compare/e214231...v0.3.0)
- github.com/cpuguy83/go-md2man: [v1.0.4 → v1.0.10](https://github.com/cpuguy83/go-md2man/compare/v1.0.4...v1.0.10)
- github.com/cyphar/filepath-securejoin: [ae69057 → v0.2.2](https://github.com/cyphar/filepath-securejoin/compare/ae69057...v0.2.2)
- github.com/dgrijalva/jwt-go: [01aeca5 → v3.2.0+incompatible](https://github.com/dgrijalva/jwt-go/compare/01aeca5...v3.2.0)
- github.com/docker/distribution: [edc3ab2 → v2.7.1+incompatible](https://github.com/docker/distribution/compare/edc3ab2...v2.7.1)
- github.com/emicklei/go-restful: [ff4f55a → v2.9.5+incompatible](https://github.com/emicklei/go-restful/compare/ff4f55a...v2.9.5)
- github.com/evanphx/json-patch: [5858425 → v4.2.0+incompatible](https://github.com/evanphx/json-patch/compare/5858425...v4.2.0)
- github.com/fatih/camelcase: [f6a740d → v1.0.0](https://github.com/fatih/camelcase/compare/f6a740d...v1.0.0)
- github.com/go-openapi/analysis: [v0.17.2 → v0.19.2](https://github.com/go-openapi/analysis/compare/v0.17.2...v0.19.2)
- github.com/go-openapi/errors: [v0.17.2 → v0.19.2](https://github.com/go-openapi/errors/compare/v0.17.2...v0.19.2)
- github.com/go-openapi/jsonpointer: [v0.19.0 → v0.19.2](https://github.com/go-openapi/jsonpointer/compare/v0.19.0...v0.19.2)
- github.com/go-openapi/jsonreference: [v0.19.0 → v0.19.2](https://github.com/go-openapi/jsonreference/compare/v0.19.0...v0.19.2)
- github.com/go-openapi/loads: [v0.17.2 → v0.19.2](https://github.com/go-openapi/loads/compare/v0.17.2...v0.19.2)
- github.com/go-openapi/runtime: [v0.17.2 → v0.19.0](https://github.com/go-openapi/runtime/compare/v0.17.2...v0.19.0)
- github.com/go-openapi/spec: [v0.17.2 → v0.19.2](https://github.com/go-openapi/spec/compare/v0.17.2...v0.19.2)
- github.com/go-openapi/strfmt: [v0.17.0 → v0.19.0](https://github.com/go-openapi/strfmt/compare/v0.17.0...v0.19.0)
- github.com/go-openapi/swag: [v0.17.2 → v0.19.2](https://github.com/go-openapi/swag/compare/v0.17.2...v0.19.2)
- github.com/go-openapi/validate: [v0.18.0 → v0.19.2](https://github.com/go-openapi/validate/compare/v0.18.0...v0.19.2)
- github.com/godbus/dbus: [c7fdd8b → v4.1.0+incompatible](https://github.com/godbus/dbus/compare/c7fdd8b...v4.1.0)
- github.com/gogo/protobuf: [342cbe0 → 65acae2](https://github.com/gogo/protobuf/compare/342cbe0...65acae2)
- github.com/golang/mock: [bd3c8e8 → v1.2.0](https://github.com/golang/mock/compare/bd3c8e8...v1.2.0)
- github.com/golang/protobuf: [v1.2.0 → v1.3.1](https://github.com/golang/protobuf/compare/v1.2.0...v1.3.1)
- github.com/google/btree: [7d79101 → 4030bb1](https://github.com/google/btree/compare/7d79101...4030bb1)
- github.com/google/cadvisor: [9db8c7d → v0.34.0](https://github.com/google/cadvisor/compare/9db8c7d...v0.34.0)
- github.com/google/gofuzz: [24818f7 → v1.0.0](https://github.com/google/gofuzz/compare/24818f7...v1.0.0)
- github.com/google/uuid: [v1.0.0 → v1.1.1](https://github.com/google/uuid/compare/v1.0.0...v1.1.1)
- github.com/gophercloud/gophercloud: [c818fa6 → v0.1.0](https://github.com/gophercloud/gophercloud/compare/c818fa6...v0.1.0)
- github.com/gorilla/websocket: [4201258 → v1.4.0](https://github.com/gorilla/websocket/compare/4201258...v1.4.0)
- github.com/grpc-ecosystem/go-grpc-prometheus: [2500245 → v1.2.0](https://github.com/grpc-ecosystem/go-grpc-prometheus/compare/2500245...v1.2.0)
- github.com/hashicorp/golang-lru: [v0.5.0 → v0.5.1](https://github.com/hashicorp/golang-lru/compare/v0.5.0...v0.5.1)
- github.com/hashicorp/hcl: [d8c773c → v1.0.0](https://github.com/hashicorp/hcl/compare/d8c773c...v1.0.0)
- github.com/heketi/heketi: [558b292 → v9.0.0+incompatible](https://github.com/heketi/heketi/compare/558b292...v9.0.0)
- github.com/jonboulle/clockwork: [72f9bd7 → v0.1.0](https://github.com/jonboulle/clockwork/compare/72f9bd7...v0.1.0)
- github.com/json-iterator/go: [ab8a2e0 → v1.1.7](https://github.com/json-iterator/go/compare/ab8a2e0...v1.1.7)
- github.com/kr/pretty: [f31442d → v0.1.0](https://github.com/kr/pretty/compare/f31442d...v0.1.0)
- github.com/kr/text: [6807e77 → v0.1.0](https://github.com/kr/text/compare/6807e77...v0.1.0)
- github.com/libopenstorage/openstorage: [093a0c3 → v1.0.0](https://github.com/libopenstorage/openstorage/compare/093a0c3...v1.0.0)
- github.com/magiconair/properties: [61b492c → v1.8.1](https://github.com/magiconair/properties/compare/61b492c...v1.8.1)
- github.com/mailru/easyjson: [60711f1 → 94de47d](https://github.com/mailru/easyjson/compare/60711f1...94de47d)
- github.com/mattn/go-shellwords: [f8471b0 → v1.0.5](https://github.com/mattn/go-shellwords/compare/f8471b0...v1.0.5)
- github.com/miekg/dns: [5d001d0 → v1.1.4](https://github.com/miekg/dns/compare/5d001d0...v1.1.4)
- github.com/mistifyio/go-zfs: [1b4ae6f → v2.1.1+incompatible](https://github.com/mistifyio/go-zfs/compare/1b4ae6f...v2.1.1)
- github.com/mitchellh/go-wordwrap: [ad45545 → v1.0.0](https://github.com/mitchellh/go-wordwrap/compare/ad45545...v1.0.0)
- github.com/mvdan/xurls: [1b768d7 → v1.1.0](https://github.com/mvdan/xurls/compare/1b768d7...v1.1.0)
- github.com/onsi/ginkgo: [v1.6.0 → v1.8.0](https://github.com/onsi/ginkgo/compare/v1.6.0...v1.8.0)
- github.com/onsi/gomega: [5533ce8 → v1.5.0](https://github.com/onsi/gomega/compare/5533ce8...v1.5.0)
- github.com/opencontainers/go-digest: [a6d0ee4 → v1.0.0-rc1](https://github.com/opencontainers/go-digest/compare/a6d0ee4...v1.0.0-rc1)
- github.com/opencontainers/image-spec: [372ad78 → v1.0.1](https://github.com/opencontainers/image-spec/compare/372ad78...v1.0.1)
- github.com/opencontainers/runc: [f000fe1 → 6cc5158](https://github.com/opencontainers/runc/compare/f000fe1...6cc5158)
- github.com/opencontainers/selinux: [4a2974b → v1.2.2](https://github.com/opencontainers/selinux/compare/4a2974b...v1.2.2)
- github.com/robfig/cron: [df38d32 → v1.1.0](https://github.com/robfig/cron/compare/df38d32...v1.1.0)
- github.com/russross/blackfriday: [300106c → v1.5.2](https://github.com/russross/blackfriday/compare/300106c...v1.5.2)
- github.com/seccomp/libseccomp-golang: [1b506fc → v0.9.1](https://github.com/seccomp/libseccomp-golang/compare/1b506fc...v0.9.1)
- github.com/sirupsen/logrus: [v1.2.0 → v1.4.2](https://github.com/sirupsen/logrus/compare/v1.2.0...v1.4.2)
- github.com/spf13/afero: [b28a7ef → v1.2.2](https://github.com/spf13/afero/compare/b28a7ef...v1.2.2)
- github.com/spf13/cast: [e31f36f → v1.3.0](https://github.com/spf13/cast/compare/e31f36f...v1.3.0)
- github.com/spf13/cobra: [c439c4f → v0.0.5](https://github.com/spf13/cobra/compare/c439c4f...v0.0.5)
- github.com/spf13/jwalterweatherman: [33c24e7 → v1.1.0](https://github.com/spf13/jwalterweatherman/compare/33c24e7...v1.1.0)
- github.com/spf13/pflag: [v1.0.1 → v1.0.3](https://github.com/spf13/pflag/compare/v1.0.1...v1.0.3)
- github.com/spf13/viper: [7fb2782 → v1.3.2](https://github.com/spf13/viper/compare/7fb2782...v1.3.2)
- github.com/stretchr/objx: [v0.1.1 → v0.2.0](https://github.com/stretchr/objx/compare/v0.1.1...v0.2.0)
- github.com/stretchr/testify: [v1.2.2 → v1.3.0](https://github.com/stretchr/testify/compare/v1.2.2...v1.3.0)
- golang.org/x/net: 65e2d4e → cdfb69a
- golang.org/x/tools: aa82965 → 6e04913
- google.golang.org/api: 583d854 → 5213b80
- google.golang.org/genproto: 09f6ed2 → 54afdca
- google.golang.org/grpc: v1.13.0 → v1.23.0
- gopkg.in/check.v1: 20d25e2 → 788fd78
- gopkg.in/natefinch/lumberjack.v2: 20b71e5 → v2.0.0
- gopkg.in/square/go-jose.v2: 89060de → v2.2.2
- gopkg.in/yaml.v2: v2.2.1 → v2.2.2
- k8s.io/gengo: f8a0810 → 26a6646
- k8s.io/klog: v0.3.1 → v0.4.0
- k8s.io/kube-openapi: b3a7cee → 743ec37
- k8s.io/utils: c2654d5 → 581e001
- sigs.k8s.io/structured-merge-diff: e85c7b2 → 6149e45

<!--
#### Removed
-->
#### 删除的依赖项

- github.com/Azure/go-autorest: [v11.1.2+incompatible](https://github.com/Azure/go-autorest/tree/v11.1.2)
- github.com/codedellemc/goscaleio: [20e2ce2](https://github.com/codedellemc/goscaleio/tree/20e2ce2)
- github.com/d2g/dhcp4: [a1d1b6c](https://github.com/d2g/dhcp4/tree/a1d1b6c)
- github.com/d2g/dhcp4client: [6e570ed](https://github.com/d2g/dhcp4client/tree/6e570ed)
- github.com/jteeuwen/go-bindata: [a0ff256](https://github.com/jteeuwen/go-bindata/tree/a0ff256)
- github.com/kardianos/osext: [8fef92e](https://github.com/kardianos/osext/tree/8fef92e)
- github.com/kr/fs: [2788f0d](https://github.com/kr/fs/tree/2788f0d)
- github.com/marstr/guid: [8bdf7d1](https://github.com/marstr/guid/tree/8bdf7d1)
- github.com/mholt/caddy: [2de4950](https://github.com/mholt/caddy/tree/2de4950)
- github.com/natefinch/lumberjack: [v2.0.0+incompatible](https://github.com/natefinch/lumberjack/tree/v2.0.0)
- github.com/pkg/sftp: [4d0e916](https://github.com/pkg/sftp/tree/4d0e916)
- github.com/shurcooL/sanitized_anchor_name: [10ef21a](https://github.com/shurcooL/sanitized_anchor_name/tree/10ef21a)
- github.com/sigma/go-inotify: [c87b6cf](https://github.com/sigma/go-inotify/tree/c87b6cf)
- github.com/vmware/photon-controller-go-sdk: [4a435da](https://github.com/vmware/photon-controller-go-sdk/tree/4a435da)
- github.com/xanzy/go-cloudstack: [1e2cbf6](https://github.com/xanzy/go-cloudstack/tree/1e2cbf6)
- gopkg.in/yaml.v1: 9f9df34
- [v1.16.0-rc.2](#v1160-rc2)
- [v1.16.0-rc.1](#v1160-rc1)
- [v1.16.0-beta.2](#v1160-beta2)
- [v1.16.0-beta.1](#v1160-beta1)
- [v1.16.0-alpha.3](#v1160-alpha3)
- [v1.16.0-alpha.2](#v1160-alpha2)
- [v1.16.0-alpha.1](#v1160-alpha1)



# v1.16.0-rc.2

<!--
[Documentation](https://docs.k8s.io)
-->
[文档](https://docs.k8s.io)

<!--
## Downloads for v1.16.0-rc.2
-->
## 下载 v1.16.0-rc.2
<!--
filename | sha512 hash
文件名 | sha512 hash
-->


文件名 | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes.tar.gz) | `68837f83bcf380e22b50f145fb64404584e96e5714a6c0cbc1ba76e290dc267f6b53194e2b51f19c1145ae7c3e5874124d35ff430cda15f67b0f9c954803389c`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-src.tar.gz) | `922552ed60d425fa6d126ffb34db6a7f123e1b9104e751edaed57b4992826620383446e6cf4f8a9fd55aac72f95a69b45e53274a41aaa838c2c2ae15ff4ddad2`

<!--
### Client Binaries
-->
### 客户端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-darwin-386.tar.gz) | `d0df8f57f4d9c2822badc507345f82f87d0e8e49c79ca907a0e4e4dd634db964b84572f88b8ae7eaf50a20965378d464e0d1e7f588e84e926edfb741b859e7d2`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-darwin-amd64.tar.gz) | `0bc7daaf1165189b57dcdbe59f402731830b6f4db53b853350056822602579d52fe43ce5ac6b7d4b6d89d81036ae94eab6b7167e78011a96792acfbf6892fa39`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-linux-386.tar.gz) | `7735c607bb99b47924140a6a3e794912b2b97b6b54024af1de5db6765b8cc518cba6b145c25dc67c8d8f827805d9a61f676b4ae67b8ef86cfda2fe76de822c6a`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-linux-amd64.tar.gz) | `d35f70cea4780a80c24588bc760c38c138d73e5f80f9fe89d952075c24cbf179dd504c2bd7ddb1756c2632ffbcc69a334684710a2d702443043998f66bec4a25`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-linux-arm.tar.gz) | `e1fc50b6884c42e92649a231db60e35d4e13e58728e4af7f6eca8b0baa719108cdd960db1f1dbd623085610dbccf7f17df733de1faf10ebf6cd1977ecd7f6213`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-linux-arm64.tar.gz) | `defc25fe403c20ef322b2149be28a5b44c28c7284f11bcf193a07d7f45110ce2bd6227d3a4aa48859aaeb67796809962785651ca9f76121fb9534366b40c4b7d`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-linux-ppc64le.tar.gz) | `e87b16c948d09ddbc5d6e3fab05ad3c5a58aa7836d4f42c59edab640465531869c92ecdfa2845ec3eecd95b8ccba3dafdd9337f4c313763c6e5105b8740f2dca`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-linux-s390x.tar.gz) | `2c25a1860fa81cea05a1840d6a200a3a794cc50cfe45a4efec57d7122208b1354e86f698437bbe5c915d6fb70ef9525f844edc0fa63387ab8c1586a6b22008a5`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-windows-386.tar.gz) | `267654a7ecfa37c800c1c94ea78343f5466783881cfac62091cfbd8c62489f04bd74a7a39a08253cb51d7ba52c207f56da371f992f61c1468b595c094f0e080f`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-client-windows-amd64.tar.gz) | `bd4c25b80e54f9fc0c07f64550d020878f899e4e3a28ca57dd532fdbab9ab700d296d2890185591ac27bce6fde336ab90f3102a6797e174d233db76f24f5ac1b`

<!--
### Server Binaries
-->
### 服务器端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-server-linux-amd64.tar.gz) | `13a93bb9bd5599b669af7bd25537ee81cefd6d8c73bedfbac845703c01950c70b2aa39f94f2346d935bc167bae435dbcd6e1758341b634102265657e1b1c1259`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-server-linux-arm.tar.gz) | `781d127f32d8479bc21beed855ec73e383702e6e982854138adce8edb0ee4d1d4b0c6e723532bc761689d17512c18b1945d05b0e4adb3fe4b98428cce40d52c8`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-server-linux-arm64.tar.gz) | `6d6dfa49288e4a4ce77ca4f7e83a51c78a2b1844dd95df10cb12fff5a104e750d8e4e117b631448e066487c4c71648e822c87ed83a213f17f27f8c7ecb328ca4`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-server-linux-ppc64le.tar.gz) | `97804d87ea984167fdbdedcfb38380bd98bb2ef150c1a631c6822905ce5270931a907226d5ddefc8d98d5326610daa79a08964fc4d7e8b438832beb966efd214`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-server-linux-s390x.tar.gz) | `d45bd651c7f4b6e62ceb661c2ec70afca06a8d1fde1e50bb7783d05401c37823cf21b9f0d3ac87e6b91eeec9d03fc539c3713fd46beff6207e8ebac1bf9d1dd5`

<!--
### Node Binaries
-->
### 节点可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-node-linux-amd64.tar.gz) | `42c57b59ce43f8961e427d622ee9cfa85cc23468779945262d59aa8cd31afd495c7abaaef7263b9db60ec939ba5e9898ebc3281e8ec81298237123ce4739cbff`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-node-linux-arm.tar.gz) | `034a5611909df462ef6408f5ba5ff5ebfb4e1178b2ad06a59097560040c4fcdb163faec48ab4297ca6c21282d7b146f9a5eebd3f2573f7d6d7189d6d29f2cf34`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-node-linux-arm64.tar.gz) | `df1493fa2d67b59eaf02096889223bbf0d71797652d3cbd89e8a3106ff6012ea17d25daaa4baf9f26c2e061afb4b69e3e6814ba66e9c4744f04230c922fbc251`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-node-linux-ppc64le.tar.gz) | `812a5057bbf832c93f741cc39d04fc0087e36b81b6b123ec5ef02465f7ab145c5152cfc1f7c76032240695c7d7ab71ddb9a2a4f5e1f1a2abb63f32afa3fb6c7c`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-node-linux-s390x.tar.gz) | `2a58a4b201631789d4309ddc665829aedcc05ec4fe6ad6e4d965ef3283a381b8a4980b4b728cfe9a38368dac49921f61ac6938f0208b671afd2327f2013db22a`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.2/kubernetes-node-windows-amd64.tar.gz) | `7fb09e7667715f539766398fc1bbbc4bf17c64913ca09d4e3535dfc4d1ba2bf6f1a3fcc6d81dbf473ba3f10fd29c537ce5debc17268698048ce7b378802a6c46`

<!--
## Changelog since v1.16.0-rc.1
-->
## 自 v1.16.0-rc.1 起的变更日志

<!--
### Other notable changes
-->
### 其他值得注意的变化

<!--
* Single static pod files and pod files from http endpoints cannot be larger than 10 MB. HTTP probe payloads are now truncated to 10KB. ([#82669](https://github.com/kubernetes/kubernetes/pull/82669), [@rphillips](https://github.com/rphillips))
* Restores compatibility with <=1.15.x custom resources by not publishing OpenAPI for non-structural custom resource definitions ([#82653](https://github.com/kubernetes/kubernetes/pull/82653), [@liggitt](https://github.com/liggitt))
* Fixes regression in logging spurious stack traces when proxied connections are closed by the backend ([#82588](https://github.com/kubernetes/kubernetes/pull/82588), [@liggitt](https://github.com/liggitt))
-->
* 单个静态 pod 文件和来自 http 端点的 pod 文件不能大于 10 MB。HTTP 探针负载现在被截断为 10 KB。见 ([#82669](https://github.com/kubernetes/kubernetes/pull/82669)、[@rphillips](https://github.com/rphillips))。
* 通过不发布非结构化自定义资源定义的 OpenAPI，恢复与小于等于 v1.15.x 自定义资源的兼容性。见 ([#82653](https://github.com/kubernetes/kubernetes/pull/82653)、[@liggitt](https://github.com/liggitt))。
* 修复了后端关闭代理连接时记录虚假堆栈跟踪的回归问题。见 ([#82588](https://github.com/kubernetes/kubernetes/pull/82588)、[@liggitt](https://github.com/liggitt))。


# v1.16.0-rc.1

<!--
[Documentation](https://docs.k8s.io)
-->
[文档](https://docs.k8s.io)

<!--
## Downloads for v1.16.0-rc.1
-->
## 下载 v1.16.0-rc.1
<!--
filename | sha512 hash
文件名 | sha512 hash
-->

文件名 | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes.tar.gz) | `2feadb470a8b0d498dff2c122d792109bc48e24bfc7f49b4b2b40a268061c83d9541cbcf902f2b992d6675e38d69ccdded9435ac488e041ff73d0c2dc518a5a9`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-src.tar.gz) | `6d8877e735e041c989c0fca9dd9e57e5960299e74f66f69907b5e1265419c69ed3006c0161e0ced63073e28073355a5627154cf5db53b296b4a209b006b45db0`

<!--
### Client Binaries
-->
### 客户端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-darwin-386.tar.gz) | `27bbfcb709854a9625dbb22c357492c1818bc1986b94e8cf727c046d596c4f1fe385df5b2ce61baaf95b066d584a8c04190215eaf979e12707c6449766e84810`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-darwin-amd64.tar.gz) | `9c2ea22e188282356cd532801cb94d799bde5a5716f037b81e7f83273f699bf80776b253830e3a4e1a72c420f0c0b84e28ae043c9d28a49e9455e6b1449a353c`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-linux-386.tar.gz) | `bbba78b8f972d0c247ed11e88010fc934a694efce8d2605635902b4a22f5ecc7e710f640bcefbba97ef28f6db68b9d8fb9e6a4a099603493c1ddcc5fd50c0d17`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-linux-amd64.tar.gz) | `f2f04dc9b93d1c8f5295d3f559a3abdd19ea7011741aa006b2cd96542c06a6892d7ed2bad8479c89e7d6ae0ed0685e68d5096bd5a46431c8cab8a90c04f1f00c`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-linux-arm.tar.gz) | `77d1f5b4783f7480d879d0b7682b1d46e730e7fb8edbc6eccd96986c31ceecbf123cd9fd11c5a388218a8c693b1b545daed28ca88f36ddaca06adac4422e4be5`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-linux-arm64.tar.gz) | `0b57aa1dbbce51136789cb373d93e641d1f095a4bc9695d60917e85c814c8959a4d6e33224dc86295210d01e73e496091a191f303348f3b652a2b6160b1e6059`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-linux-ppc64le.tar.gz) | `847065d541dece0fc931947146dbc90b181f923137772f26c7c93476e022f4f654e00f9928df7a13a9dec27075dd8134bdb168b5c57d4efa29ed20a6a2112272`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-linux-s390x.tar.gz) | `d7e8a808da9e2551ca7d8e7cb25222cb9ac01595f78ebbc86152ae1c21620d4d8478ef3d374d69f47403ca913fc716fbaa81bd3ff082db2fc5814ef8dc66eeec`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-windows-386.tar.gz) | `c9cf6a6b9f2f29152af974d30f3fd97ba33693d5cbbf8fc76bcf6590979e7ac8307e5da4f84a646cec6b68f6fa1a83aa1ce24eb6429baa0a39c92d5901bd80be`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-client-windows-amd64.tar.gz) | `ebea0c0b64d251e6023e8a5a100aa609bc278c797170765da2e35c8997efc233bec9f8d1436aeee1cd6459e30ec78ba64b84de47c26a4e4645e153e5e598202b`

<!--
### Server Binaries
-->
### 服务器端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-server-linux-amd64.tar.gz) | `2fe7ccce15e705826c4ccfce48df8130ba89a0c930bca4b61f49267e9d490f57cf6220671752e44e55502bee501a9af2f0ac3927378a87b466f2526fa6e45834`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-server-linux-arm.tar.gz) | `6eb77e59095a1de9eb21e7065e8d10b7d0baf1888991a42089ede6d4f8a8cac0b17ae793914eef5796d56d8f0b958203d5df1f7ed45856dce7244c9f047f9793`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-server-linux-arm64.tar.gz) | `429ce0d5459384c9d3a2bb103924eebc4c30343c821252dde8f4413fcf29cc73728d378bfd193c443479bde6bfd26e0a13c036d4d4ae22034d66f6cad70f684d`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-server-linux-ppc64le.tar.gz) | `18041d9c99efc00c8c9dbb6444974efdbf4969a4f75faea75a3c859b1ee8485d2bf3f01b7942a524dcd6a71c82af7a5937fc9120286e920cf2d501b7c76ab160`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-server-linux-s390x.tar.gz) | `2124c3d8856e50ca6b2b61d83f108ab921a1217fac2a80bf765d51b68f4e67d504471787d375524974173782aa37c57b6bf1fc6c7704ed7e6cabe15ec3c543b1`

<!--
### Node Binaries
-->
### 节点可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-node-linux-amd64.tar.gz) | `ea1bcd8cc51fbc95058a8a592eb454c07ab5dadc1c237bbc59f278f8adc46bda1f334e73463e1edbd6da5469c4a527ceb1cb0a96686493d3ff4e8878dd1c9a20`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-node-linux-arm.tar.gz) | `e5d62df5fd086ff5712f59f71ade9efcf617a13c567de965ce54c79f3909372bed4edbf6639cf058fe1d5c4042f794e1c6a91e5e20d9dcce597a95dedf2474b2`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-node-linux-arm64.tar.gz) | `5aa0a7a3d02b65253e4e814e51cea6dd895170f2838fea02f94e4efd3f938dbf83bc7f209801856b98420373c04147fab9cb8791d24d51dcedf960068dfe6fda`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-node-linux-ppc64le.tar.gz) | `f54bc5ae188f8ecb3ddcae20e06237430dd696f444a5c65b0aa3be79ad85c5b500625fa47ed0e126f6e738eb5d9ee082b52482a6913ec6d22473520fa6582e66`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-node-linux-s390x.tar.gz) | `afa4f9b747fff20ed03d40092a2df60dbd6ced0de7fd0c83c001866c4fe5b7117468e2f8c73cbef26f376b69b4750f188143076953fc200e8a5cc002c8ac705b`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-rc.1/kubernetes-node-windows-amd64.tar.gz) | `e9b76014a1d4268ad66ade06883dd3344c6312ece14ee988af645bdf9c5e9b62c31a0e339f774c67799b777314db6016d86a3753855c7d2eb461fbbf4e154ae7`

<!--
## Changelog since v1.16.0-beta.2
-->
## 自 v1.16.0-beta.2 起的变更日志

<!--
### Other notable changes
-->
### 其他值得注意的变化

<!--
* Update Cluster Autoscaler to 1.16.0; changelog: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.16.0 ([#82501](https://github.com/kubernetes/kubernetes/pull/82501), [@losipiuk](https://github.com/losipiuk))
* Resolved regression serving custom resources with unhandled validation schemas with the ServerSideApply feature enabled ([#82438](https://github.com/kubernetes/kubernetes/pull/82438), [@liggitt](https://github.com/liggitt))
* Fix filter plugins are not been called during preemption ([#81876](https://github.com/kubernetes/kubernetes/pull/81876), [@wgliang](https://github.com/wgliang))
* Fix the dns suffix search list for GCE window clusters. ([#82314](https://github.com/kubernetes/kubernetes/pull/82314), [@lzang](https://github.com/lzang))
-->
* 将集群自动扩缩更新到 1.16.0；更新日志：https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.16.0  见 ([#82501](https://github.com/kubernetes/kubernetes/pull/82501)、[@losipiuk](https://github.com/losipiuk))。
* 通过启用 ServerSideApply 功能的未处理验证架构为自定义资源提供服务，用于解决回归问题。见 ([#82438](https://github.com/kubernetes/kubernetes/pull/82438)、[@liggitt](https://github.com/liggitt))。
* 修复抢占期间未调用过滤器插件问题。见 ([#81876](https://github.com/kubernetes/kubernetes/pull/81876)、[@wgliang](https://github.com/wgliang))。
* 修复 GCE 窗口集群的 dns 后缀搜索列表问题。见 ([#82314](https://github.com/kubernetes/kubernetes/pull/82314)、[@lzang](https://github.com/lzang))。
<!--
* Install and start logging agent based on kube env ENABLE_NODE_LOGGING. ([#81300](https://github.com/kubernetes/kubernetes/pull/81300), [@liyanhui1228](https://github.com/liyanhui1228))
* kubeadm: Allow users to skip the kube-proxy init addon phase during init and still be able to join a cluster and perform some other minor operations (but not upgrade). ([#82248](https://github.com/kubernetes/kubernetes/pull/82248), [@rosti](https://github.com/rosti))
* Bump metrics-server to v0.3.4 ([#82322](https://github.com/kubernetes/kubernetes/pull/82322), [@olagacek](https://github.com/olagacek))
* Updated default etcd service used by kubernetes to 3.3.15 ([#82199](https://github.com/kubernetes/kubernetes/pull/82199), [@dims](https://github.com/dims))
-->
* 基于 kube env ENABLE_NODE_LOGGING 安装并启动日志记录代理。见 ([#81300](https://github.com/kubernetes/kubernetes/pull/81300)、[@liyanhui1228](https://github.com/liyanhui1228))。
* kubeadm：允许用户在初始化过程中跳过 kube-proxy 初始化插件阶段，但是仍然可以加入集群并执行其他一些次要操作（不能升级）。见 ([#82248](https://github.com/kubernetes/kubernetes/pull/82248)、[@rosti](https://github.com/rosti))。
* 将指标服务器连接到 v0.3.4。见 ([#82322](https://github.com/kubernetes/kubernetes/pull/82322)、[@olagacek](https://github.com/olagacek))。
* kubernetes 使用的默认 etcd 服务已更新为 3.3.15。见 ([#82199](https://github.com/kubernetes/kubernetes/pull/82199)、[@dims](https://github.com/dims))。


# v1.16.0-beta.2

<!--
[Documentation](https://docs.k8s.io)
-->
[文档](https://docs.k8s.io)

<!--
## Downloads for v1.16.0-beta.2
-->
## 下载 v1.16.0-beta.2

<!--
filename | sha512 hash
文件名 | sha512 hash
-->

文件名 | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes.tar.gz) | `d1f4e9badc6a4422b9a261a5375769d63f0cac7fff2aff4122a325417b77d5e5317ba76a180cda2baa9fb1079c33e396fc16f82b31eeebea61004b0aabdf8c32`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-src.tar.gz) | `2ab20b777311746bf9af0947a2bea8ae36e27da7d917149518d7c2d2612f513bbf88d1f2c7efff6dc169aa43c2dd3be73985ef619172d50d99faa56492b35ce4`

<!--
### Client Binaries
-->
### 客户端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-darwin-386.tar.gz) | `55523fd5cfce0c5b79e981c6a4d5572790cfe4488ed23588be45ee13367e374cf703f611769751583986557b2607f271704d9f27e03f558e35e7c75796476b10`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-darwin-amd64.tar.gz) | `13e696782713da96f5fb2c3fa54d99ca40bc71262cb2cbc8e77a6d19ffd33b0767d3f27e693aa84103aca465f9b00ed109996d3579b4bd28566b8998212a0872`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-linux-386.tar.gz) | `7f4818599b84712edd2bf1d94f02f9a53c1f827b428a888356e793ff62e897276afcbc97f03bc0317e7d729740410037c57e6443f65c691eb959b676833511fa`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-linux-amd64.tar.gz) | `8a2656289d7d86cbded42831f6bc660b579609622c16428cf6cc782ac8b52df4c8511c5aad65aa520f398a65e35dee6ea5b5ad8e5fd14c5a8690a7248dc4c109`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-linux-arm.tar.gz) | `418606bc109b9acb2687ed297fa2eec272e8cb4ad3ce1173acd15a4b43cec0ecfd95e944faeecf862b349114081dd99dfac8615dc95cffc1cd4983c5b38e9c4e`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-linux-arm64.tar.gz) | `2eb943b745c270cd161e01a12195cfb38565de892a1da89e851495fb6f9d6664055e384e30d3551c25f120964e816e44df5415aff7c12a8639c30a42271abef7`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-linux-ppc64le.tar.gz) | `262e7d61e167e7accd43c47e9ce28323ae4614939a5af09ecc1023299cd2580220646e7c90d31fee0a17302f5d9df1e7da1e6774cc7e087248666b33399e8821`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-linux-s390x.tar.gz) | `8f0cfe669a211423dd697fdab722011ea9641ce3db64debafa539d4a424dd26065c8de5da7502a4d40235ff39158f3935bd337b807a63771391dffb282563ccf`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-windows-386.tar.gz) | `b1deab89653f4cd3ad8ad68b8ec3e1c038d1ef35bd2e4475d71d4781acf0b2002443f9c2b7d2cf06cbb9c568bea3881c06d723b0529cc8210f99450dc2dc5e43`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-client-windows-amd64.tar.gz) | `0e3b5150767efd0ed5d60b2327d2b7f6f2bda1a3532fca8e84a7ca161f6e069fae15af37d3fe8a641d34c9a65fc61f1c44dd3265ef6cacfd2df55c9c004bc6bd`

<!--
### Server Binaries
-->
### 服务器端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-server-linux-amd64.tar.gz) | `32688295df1fcdb9472ed040dc5e8b19d04d62789d2eca64cfe08080d08ffee1eaa4853ce40bd336aabd2f764dd65b36237d4f9f1c697e2d6572861c0c8eff01`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-server-linux-arm.tar.gz) | `c8ea6d66e966889a54194f9dce2021131e9bae34040c56d8839341c47fc4074d6322cc8aadce28e7cdcee88ec79d37a73d52276deb1cc1eee231e4d3083d54e5`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-server-linux-arm64.tar.gz) | `12b42cfa33ff824392b81a604b7edcab95ecc67cddfc24c47ef67adb356a333998bc7b913b00daf7a213692d8d441153904474947b46c7f76ef03d4b2a63eab0`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-server-linux-ppc64le.tar.gz) | `e03f0eba181c03ddb7535e56ff330dafebb7dcb40889fd04f5609617ebb717f9f833e89810bff36d5299f72ae75d356fffb80f7b3bab2232c7597abcc003b8ba`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-server-linux-s390x.tar.gz) | `4e7bd061317a3445ad4b6b308f26218777677a1fef5fda181ee1a19e532a758f6bd3746a3fe1917a057ed71c94892aeaf00dd4eb008f61418ec3c80169a1f057`

<!--
### Node Binaries
-->
### 节点可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-node-linux-amd64.tar.gz) | `dc5606c17f0191afc6f28dce5ab566fd8f21a69fa3989a1c8f0976d7b8ccd32e26bb21e9fec9f4529c5a6c8301747d278484688a0592da291866f8fa4893dcbb`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-node-linux-arm.tar.gz) | `3d5d9893e06fd7be51dca11182ecb9e93108e86af40298fe66bb62e5e86f0bf4713667ba63d00b02cfddaf20878dd78cc738e76bf1ca715bbbe79347ca518ec4`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-node-linux-arm64.tar.gz) | `fd18a02f32aeafc5cce8f3f2eadd0e532857bd5264b7299b4e48f458f77ebaa53be94b1d1fe2062168f9d88c8a97e6c2d904fc3401a2d9e69dd4e8c87d01d915`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-node-linux-ppc64le.tar.gz) | `703afd80140db2fae897d83b3d2bc8889ff6c6249bb79be7a1cce6f0c9326148d22585a5249c2e976c69a2518e3f887eef4c9dc4a970ebb854a78e72c1385ccb`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-node-linux-s390x.tar.gz) | `445d4ef4f9d63eabe3b7c16114906bc450cfde3e7bf7c8aedd084c79a5e399bd24a7a9c2283b58d382fb11885bb2b412773a36fffb6fc2fac15d696439a0b800`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.2/kubernetes-node-windows-amd64.tar.gz) | `88b04171c3c0134044b7555fbc9b88071f5a73dbf2dac21f8a27b394b0870dff349a56b0ee4d8e1d9cfbeb98645e485f40b8d8863f3f3e833cba0ca6b1383ccf`

<!--
## Changelog since v1.16.0-beta.1
-->
## 自 v1.16.0-beta.1 起的变更日志

<!--
### Other notable changes
-->
### 其他值得注意的变化

<!--
* Fix a bug in apiserver that could cause a valid update request to be rejected with a precondition check failure. ([#82303](https://github.com/kubernetes/kubernetes/pull/82303), [@roycaihw](https://github.com/roycaihw))
* Webhook client credentials configured with `--admission-control-config-file` must include non-default ports in the configured hostnames. For example, a webhook configured to speak to port 8443 on service `mysvc` in namespace `myns` would specify client credentials in a stanza with `name: mysvc.myns.svc:8443`. See https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers for more details. ([#82252](https://github.com/kubernetes/kubernetes/pull/82252), [@liggitt](https://github.com/liggitt))
* Ensure the KUBE-MARK-DROP chain in kube-proxy mode=ipvs. The chain is ensured for both ipv4 and ipv6 in dual-stack operation. ([#82214](https://github.com/kubernetes/kubernetes/pull/82214), [@uablrek](https://github.com/uablrek))
-->
* 修复了 apiserver 中的一个错误，该错误可能导致有效的更新请求因前提条件检查失败而被拒绝。见 ([#82303](https://github.com/kubernetes/kubernetes/pull/82303)、[@roycaihw](https://github.com/roycaihw))。
* 使用 `--admission-control-config-file` 配置的 Webhook 客户端凭据必须在配置的主机名中包含非默认端口。例如，配置与命令空间 `myns` 中的服务 `mysvc`上的端口 8443 进行通信的 Webhook 将在带有 `name: mysvc.myns.svc:8443` 的节中指定客户端凭据。有关更多详细信息，请参见 https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers。见 ([#82252](https://github.com/kubernetes/kubernetes/pull/82252)、[@liggitt](https://github.com/liggitt))。
* 确保 KUBE-MARK-DROP 链处于 kube-proxy ipvs 模式。ipv4 和 ipv6 在双堆栈操作中均已确保该链。见 ([#82214](https://github.com/kubernetes/kubernetes/pull/82214)、[@uablrek](https://github.com/uablrek))。
<!--
* `kubectl cp` no longer supports copying symbolic links from containers; to support this use case, see `kubectl exec --help` for examples using `tar` directly ([#82143](https://github.com/kubernetes/kubernetes/pull/82143), [@soltysh](https://github.com/soltysh))
* kubeadm: fix for HTTPProxy check for IPv6 addresses (kubernetes/kubeadm#1769) ([#82267](https://github.com/kubernetes/kubernetes/pull/82267), [@kad](https://github.com/kad))
* Add PodOverhead awareness to kubectl ([#81929](https://github.com/kubernetes/kubernetes/pull/81929), [@egernst](https://github.com/egernst))
* The nbf (not before) claim, if present in ID token, is now enforced.   ([#81413](https://github.com/kubernetes/kubernetes/pull/81413), [@anderseknert](https://github.com/anderseknert))
* Server-side apply will now use the openapi provided in the CRD validation field to help figure out how to correctly merge objects and update ownership. ([#77354](https://github.com/kubernetes/kubernetes/pull/77354), [@jennybuckley](https://github.com/jennybuckley))
-->
* `kubectl cp` 不再支持从容器中复制符号链接；为了支持该用例，请参见 `kubectl exec --help` 以获取直接使用 `tar` 的示例。见 ([#82143](https://github.com/kubernetes/kubernetes/pull/82143)、[@soltysh](https://github.com/soltysh))。
* kubeadm：修复了 IPv6 地址的 HTTPProxy 检查(kubernetes/kubeadm#1769)。([#82267](https://github.com/kubernetes/kubernetes/pull/82267)、[@kad](https://github.com/kad))。
* 在 kubectl 中添加 PodOverhead 感知。见 ([#81929](https://github.com/kubernetes/kubernetes/pull/81929)、[@egernst](https://github.com/egernst))。
* 现在，nbf（不早于）声明（如果存在于 ID 令牌中）将被强制执行。见 ([#81413](https://github.com/kubernetes/kubernetes/pull/81413)、[@anderseknert](https://github.com/anderseknert))。
* 服务器端应用现在将使用 CRD 验证字段中提供的 openapi 来帮助弄清楚如何正确合并对象和更新所有权。见 ([#77354](https://github.com/kubernetes/kubernetes/pull/77354)、[@jennybuckley](https://github.com/jennybuckley))。
<!--
* - Fix disk stats in LXD using ZFS storage pool ([#81972](https://github.com/kubernetes/kubernetes/pull/81972), [@dashpole](https://github.com/dashpole))
    * - Fix CRI-O missing network metris bug
    * - Add `container_sockets`, `container_threads`, and `container_threads_max` metrics
* Adds Endpoint Slice support for kubectl when discovery API group is enabled. ([#81795](https://github.com/kubernetes/kubernetes/pull/81795), [@robscott](https://github.com/robscott))
* Node-Problem-Detector v0.7.1 is used for addon daemonset. ([#82140](https://github.com/kubernetes/kubernetes/pull/82140), [@wangzhen127](https://github.com/wangzhen127))
* aggregated discovery requests can now timeout.  Aggregated apiserver *must* complete discovery calls within five seconds.  Other requests can take longer. ([#82146](https://github.com/kubernetes/kubernetes/pull/82146), [@deads2k](https://github.com/deads2k))
    * Use feature gate `EnableAggregatedDiscoveryTimeout=false` if you *must* remove this check, but that feature gate will be removed next release.
-->
* - 使用 ZFS 存储池修复 LXD 中的磁盘统计信息。见 ([#81972](https://github.com/kubernetes/kubernetes/pull/81972)、[@dashpole](https://github.com/dashpole))。
    * - 修复 CRI-O 缺少网络指标错误。
    * - 添加指标 `container_sockets`、`container_threads` 和 `container_threads_max`。
* 启用发现 API 组时，添加对 kubectl 的 Endpoint Slice 支持。见 ([#81795](https://github.com/kubernetes/kubernetes/pull/81795)、[@robscott](https://github.com/robscott))。
* Node-Problem-Detector v0.7.1 用于插件 daemonset。见 ([#82140](https://github.com/kubernetes/kubernetes/pull/82140)、[@wangzhen127](https://github.com/wangzhen127))。
* 聚合的发现请求现在可以超时。聚合的 apiserver 必须在 5 秒钟内完成发现调用。其他请求可能需要更长的时间。见 ([#82146](https://github.com/kubernetes/kubernetes/pull/82146)、[@deads2k](https://github.com/deads2k))。
    * 如果*必须*删除此检查，请使用 `EnableAggregatedDiscoveryTimeout=false` 功能开关，但是该功能将在下一个版本中删除。
<!--
* Graduating Windows GMSA support from alpha to beta ([#82110](https://github.com/kubernetes/kubernetes/pull/82110), [@wk8](https://github.com/wk8))
* Add UnschedulableAndUnresolvable status code for Scheduler Framework ([#82034](https://github.com/kubernetes/kubernetes/pull/82034), [@alculquicondor](https://github.com/alculquicondor))
* Kubeadm now includes CoreDNS version 1.6.2 ([#82127](https://github.com/kubernetes/kubernetes/pull/82127), [@rajansandeep](https://github.com/rajansandeep))
    *     - The CoreDNS Deployment now checks readiness via the `ready` plugin.
    *     - The `proxy` plugin has been deprecated. The `forward` plugin is to be used instead.
    *     - `kubernetes` plugin removes the `resyncperiod` option.
    *     - The `upstream` option is deprecated and ignored if included.
-->
* 将 Windows GMSA 支持从 Alpha 功能升级到 Beta 功能。见 ([#82110](https://github.com/kubernetes/kubernetes/pull/82110)、[@wk8](https://github.com/wk8))。
* 为 Scheduler Framework 添加 UnschedulableAndUnresolvable 状态码。见 ([#82034](https://github.com/kubernetes/kubernetes/pull/82034)、[@alculquicondor](https://github.com/alculquicondor))。
* Kubeadm 现在包括 CoreDNS 1.6.2 版本。见 ([#82127](https://github.com/kubernetes/kubernetes/pull/82127)、[@rajansandeep](https://github.com/rajansandeep))。
    *     - 现在，CoreDNS Deployment 通过 `ready` 插件检查准备情况。
    *     - `proxy` 插件已被弃用,而是使用 `forward` 插件。
    *     - Kubernetes 插件删除了 resyncperiod 选项。
    *     - `upstream` 选项已被弃用，如果包含的话，将被忽略。
<!--
* Make kubectl get --ignore-not-found continue processing when encountering error.  ([#82120](https://github.com/kubernetes/kubernetes/pull/82120), [@soltysh](https://github.com/soltysh))
* Dual stack services (Phase II of IPv6DualStack feature) are enabled via the IPVS proxier. iptables proxier does not support dualstack yet. Dualstack iptables proxier is WIP and should catchup soon. ([#82091](https://github.com/kubernetes/kubernetes/pull/82091), [@khenidak](https://github.com/khenidak))
    * to enable, kube-proxy must be have the following flags:
    * --proxy-mode=ipvs 
    * --cluster-cidrs=<cidr>,<cidr>
-->
* 遇到错误时，确保 kubectl get --ignore-not-found 操作继续进行。见 ([#82120](https://github.com/kubernetes/kubernetes/pull/82120)、[@soltysh](https://github.com/soltysh))。
* 通过 IPVS 代理启用了双栈服务（IPv6DualStack 功能的第 II 阶段）。iptables proxier 还不支持 Dualstack。Dualstack iptables proxier 正在研究开发中并且将会被提出来。见 ([#82091](https://github.com/kubernetes/kubernetes/pull/82091)、[@khenidak](https://github.com/khenidak))。
    * 要启用双栈服务，kube-proxy 必须具有以下参数：
    * --proxy-mode=ipvs 
    * --cluster-cidrs=<cidr>,<cidr>
<!--
* The apiserver now uses http/1.1 to communicate with admission webhooks, opening multiple connections to satisfy concurrent requests, and allowing spreading requests across multiple backing pods. ([#82090](https://github.com/kubernetes/kubernetes/pull/82090), [@liggitt](https://github.com/liggitt))
* Added support to specify a global-access annotation for gce ILB. ([#81549](https://github.com/kubernetes/kubernetes/pull/81549), [@prameshj](https://github.com/prameshj))
* Added new startupProbe, related to KEP https://github.com/kubernetes/enhancements/issues/950. ([#77807](https://github.com/kubernetes/kubernetes/pull/77807), [@matthyx](https://github.com/matthyx))
* Adds \livez for liveness health checking for kube-apiserver. Using the parameter `--maximum-startup-sequence-duration` will allow the liveness endpoint to defer boot-sequence failures for the specified duration period. ([#81969](https://github.com/kubernetes/kubernetes/pull/81969), [@logicalhan](https://github.com/logicalhan))
-->
* apiserver 现在使用 http/1.1 与 admission webhook 进行通信，打开多个满足并发请求的连接，并允许将请求分散在多个后备 Pod 上。见 ([#82090](https://github.com/kubernetes/kubernetes/pull/82090)、[@liggitt](https://github.com/liggitt))。
* 添加了对 gce ILB 指定全局访问 annotation 的支持。见 ([#81549](https://github.com/kubernetes/kubernetes/pull/81549)、[@prameshj](https://github.com/prameshj))。
* 添加了与 KEP https://github.com/kubernetes/enhancements/issues/950 相关的新的 startupProbe。见 ([#77807](https://github.com/kubernetes/kubernetes/pull/77807)、[@matthyx](https://github.com/matthyx))。
* 添加 \livez 用以进行 kube-apiserver 的活跃状况检查。使用参数 `--maximum-startup-sequence-duration` 能够允许活动端点（liveness endpoint）将引导序列故障推迟指定的持续时间。见 ([#81969](https://github.com/kubernetes/kubernetes/pull/81969)、[@logicalhan](https://github.com/logicalhan))。
<!--
* Server-side apply is now Beta. ([#81956](https://github.com/kubernetes/kubernetes/pull/81956), [@apelisse](https://github.com/apelisse))
* The `rejected` label in `apiserver_admission_webhook_admission_duration_seconds` metrices now properly indicates if a request was rejected. Add a new counter metrics `apiserver_admission_webhook_rejection_count` with details about the causing for a webhook rejection. ([#81399](https://github.com/kubernetes/kubernetes/pull/81399), [@roycaihw](https://github.com/roycaihw))
* Add `container_state` label to `running_container_count` kubelet metrics, to get count of containers based on their state(running/exited/created/unknown) ([#81573](https://github.com/kubernetes/kubernetes/pull/81573), [@irajdeep](https://github.com/irajdeep))
* Fix a bug in CRD openapi controller that user-defined CRD can overwrite OpenAPI definition/path for the CRD API. ([#81436](https://github.com/kubernetes/kubernetes/pull/81436), [@roycaihw](https://github.com/roycaihw))
-->
* 服务器端 apply 现在是 Beta 功能。见 ([#81956](https://github.com/kubernetes/kubernetes/pull/81956)、[@apelisse](https://github.com/apelisse))。
* 现在，`apiserver_admission_webhook_admission_duration_seconds` 指标中的 `rejected` 标签可以正确指示是否拒绝了请求。添加了一个新的计数器指标 `apiserver_admission_webhook_rejection_count`，其中该指标包含有关引起 Webhook 拒绝操作的详细信息。见 ([#81399](https://github.com/kubernetes/kubernetes/pull/81399)、[@roycaihw](https://github.com/roycaihw))。
* 在 kubelet 的 `running_container_count`  指标中添加 `container_state` 标签，用于根据容器的状态（running/exited/created/unknown）获取容器数量。见 ([#81573](https://github.com/kubernetes/kubernetes/pull/81573)、[@irajdeep](https://github.com/irajdeep))。
* 修复了 CRD openapi 控制器中的一个错误，该错误使用户定义的 CRD 可以覆盖 CRD API 中的 OpenAPI 指定的定义或路径。见 ([#81436](https://github.com/kubernetes/kubernetes/pull/81436)、[@roycaihw](https://github.com/roycaihw))。
<!--
* Service account tokens now include the JWT Key ID field in their header. ([#78502](https://github.com/kubernetes/kubernetes/pull/78502), [@ahmedtd](https://github.com/ahmedtd))
* Adds EndpointSlice integration to kube-proxy, can be enabled with EndpointSlice feature gate. ([#81430](https://github.com/kubernetes/kubernetes/pull/81430), [@robscott](https://github.com/robscott))
-->
* 服务帐户令牌（Service account token）现在在其头部（header）中包含 JWT 密钥 ID 字段。见 ([#78502](https://github.com/kubernetes/kubernetes/pull/78502)、[@ahmedtd](https://github.com/ahmedtd))。
* 可通过启用 EndpointSlice 功能开关，将 EndpointSlice 集成添加到 kube-proxy 中。见 ([#81430](https://github.com/kubernetes/kubernetes/pull/81430)、[@robscott](https://github.com/robscott))。
<!--
* Azure supports IPv6 only on ELB not ILB. The cloud provider will return an error if the service is internal and is IPv6. ([#80485](https://github.com/kubernetes/kubernetes/pull/80485), [@khenidak](https://github.com/khenidak))
    * Notes on LB name:
    * to ensure backword and forward compat:
    * - SingleStack -v4 (pre v1.16) => BackendPool name == clusterName
    * - SingleStack -v6 => BackendPool name == clusterName (all cluster bootstrap uses this name)
    * DualStack:
    * => IPv4 BackendPool name == clusterName
    * => IPv6 BackendPool name == <clusterName>-IPv6
    * This result into:
    * - clusters moving from IPv4 to duakstack will require no changes
    * - clusters moving from IPv6 (while not seen in the wild, we can not rule out thier existance) to dualstack will require deleting backend pools (the reconciler will take care of creating correct backendpools)
-->
* Azure 仅在 ELB 上支持 IPv6，在 ILB 上不支持 IPv6。如果服务是内部的并且是 IPv6 地址，则云提供商将返回错误。见 ([#80485](https://github.com/kubernetes/kubernetes/pull/80485)、[@khenidak](https://github.com/khenidak))。
    * 关于 LB 名称的注意事项：
    * 确保回滚与升级兼容
    * - SingleStack -v4 (v1.16 之前的版本) => BackendPool 名称 == clusterName
    * - SingleStack -v6 => BackendPool 名称 == clusterName （所有集群引导程序都使用此名称）
    * 双栈：
    * => IPv4 BackendPool 名称 == clusterName
    * => IPv6 BackendPool 名称 == <clusterName>-IPv6
    * 结果是：
    * - 从 IPv4 迁移到双协议栈的集群将无需更改
    * - 从 IPv6（虽然在集群外没有发现，但我们不能排除存在的集群）到双栈的集群将需要删除后端池（协调器将负责创建正确的后端池）
<!--
* Promotes VolumePVCDataSource (Cloning) feature to beta for 1.16 release  ([#81792](https://github.com/kubernetes/kubernetes/pull/81792), [@j-griffith](https://github.com/j-griffith))
* Remove kubectl log, use kubectl logs instead ([#78098](https://github.com/kubernetes/kubernetes/pull/78098), [@soltysh](https://github.com/soltysh))
* CSI ephemeral inline volume support is beta, i.e. the CSIInlineVolume feature gate is enabled by default ([#82004](https://github.com/kubernetes/kubernetes/pull/82004), [@pohly](https://github.com/pohly))
* kubectl: the --all-namespaces flag is now honored by `kubectl wait` ([#81468](https://github.com/kubernetes/kubernetes/pull/81468), [@ashutoshgngwr](https://github.com/ashutoshgngwr))
-->
* 将 VolumePVCDataSource（克隆）功能升级到 1.16 版的 Beta 功能。见 ([#81792](https://github.com/kubernetes/kubernetes/pull/81792)、[@j-griffith](https://github.com/j-griffith))。
* 删除 kubectl log,改用 kubectl logs。见 ([#78098](https://github.com/kubernetes/kubernetes/pull/78098)、[@soltysh](https://github.com/soltysh))。
* 支持 CSI 临时内联卷为 Beta 功能，即默认情况下启用 CSIInlineVolume 功能开关。见 ([#82004](https://github.com/kubernetes/kubernetes/pull/82004)、[@pohly](https://github.com/pohly))。
* kubectl：现在可以通过 `kubectl wait` 来支持 --all-namespaces 参数。([#81468](https://github.com/kubernetes/kubernetes/pull/81468)、[@ashutoshgngwr](https://github.com/ashutoshgngwr))。
<!--
* Kube-proxy metrics are now marked as with the ALPHA stability level. ([#81626](https://github.com/kubernetes/kubernetes/pull/81626), [@logicalhan](https://github.com/logicalhan))
* Kube-controller-manager and cloud-controller-manager metrics are now marked as with the ALPHA stability level. ([#81624](https://github.com/kubernetes/kubernetes/pull/81624), [@logicalhan](https://github.com/logicalhan))
-->
* 现在，将 kube-proxy 指标标记为 ALPHA 稳定性级别。见 ([#81626](https://github.com/kubernetes/kubernetes/pull/81626)、[@logicalhan](https://github.com/logicalhan))。
* 现在，将 kube-controller-manager 和 cloud-controller-manager 指标标记为 ALPHA 稳定性级别。见 ([#81624](https://github.com/kubernetes/kubernetes/pull/81624)、[@logicalhan](https://github.com/logicalhan))。
<!--
* Adds Endpoint Slice Controller for managing new EndpointSlice resource, disabled by default. ([#81048](https://github.com/kubernetes/kubernetes/pull/81048), [@robscott](https://github.com/robscott))
-->
* 添加用于管理新 EndpointSlice 资源的 Endpoint Slice 控制器，默认情况下禁用。见 ([#81048](https://github.com/kubernetes/kubernetes/pull/81048)、[@robscott](https://github.com/robscott))。
<!--
* + to run: ([#79386](https://github.com/kubernetes/kubernetes/pull/79386), [@khenidak](https://github.com/khenidak))
    * Master: convert service CIDR to list  `--service-cluster-ip-range=<CIDR>,<CIDR>` and make sure `IPv6DualStack` feature flag is turned on. The flag is validated and used as the following:
-->
* + 运行：见 ([#79386](https://github.com/kubernetes/kubernetes/pull/79386)、[@khenidak](https://github.com/khenidak))。
    * Master: 将服务 CIDR 转换为 list `--service-cluster-ip-range=<CIDR>,<CIDR>`，并确保已打开 IPv6DualStack 功能参数。该参数已验证并按以下方式使用：
<!--
    * 1. `--service-cluster-ip-range[0]` is consider primary service range, and will be used for any service with `Service.Spec.IPFamily = nil` or any service in the at the time of turning on the feature flag.
    * 2. A cluster can be dualstack (i.e. Pods and nodes carry dualstack IPs) but does not need to support ingress on dualstack. In this case the cluster can perform egress using `PodIPs` (according to family and binding selection in user code) but will ingress will only be performed against the pod primary IP. This can be configured by supplying single entry to `--service-cluster-ip-range` flag.
    * 3. Maximum of two entries is allowed in `--service-cluster-ip-range` and they are validated to be dual stacked `i.e. --service-cluster-ip-range=<v4>,<v6> or --service-cluster-ip-range=<v6>,<v4>`  
    * 4. Max 20 bit for range (min network bits `<v6>/108` or <v4>/12)
    * kube-controller-manager: convert service CIDR to list `--service-cluster-ip-range=<CIDR>,<CIDR>` and make sure `IPv6DualStack` feature flag is turned on. The flag is validated as above.
-->
    * 1. `--service-cluster-ip-range[0]` 被认为是主要服务范围，并且将用于具有 `Service.Spec.IPFamily = nil` 的任何服务或打开功能标志时的任何服务。
    * 2. 集群可以是双栈的（即 Pod 和节点都带有双栈 IP），但无需支持双栈上的入口。在这种情况下，集群可以使用 `PodIPs` 执行出口（根据用户代码中的族和绑定选择），但是仅针对 Pod 主 IP 执行入口。可以通过向 `--service-cluster-ip-range` 参数提供单个条目来进行配置。
    * 3. `--service-cluster-ip-range` 参数中最多允许两个条目，并且它们被验证为双堆叠，例如 `--service-cluster-ip-range=<v4>,<v6>` 或者 `--service-cluster-ip-range=<v6>,<v4>`。 
    * 4. 范围的最大 20 位 （最小网络位 `<v6>/108` 或 `<v4>/12`）
    * kube-controller-manager：将服务 CIDR 转换为 list `--service-cluster-ip-range=<CIDR>,<CIDR>`，并确保已打开 IPv6DualStack 功能参数。该参数如上所述进行验证。
<!--
    * + to use:
    * A new service spec field `Service.Spec.IPFamily` has been added. The default of this field is family of (first service cidr in --service-cluster-ip-range flag). The value is defaulted as described above  once the feature gate is turned on. Here are the possible values for this field:
    * 2. IPv4: api-server will assign an IP from a `service-cluster-ip-range` that is `ipv4` (either the primary or the secondary, according to how they were configured).
    * 2. IPv6: api-server will assign an IP from a `service-cluster-ip-range` that is `ipv6` (either the primary or the secondary, according to how they were configured).
    * Notes (v1.16):
    * 1. IPVS is the only proxy supported (as of v1.16 ) by Dualstack.
    * 2. Dualstack is mutually exclusive with `EndpointSlice` feature. They can not be turned on together.  `metaproxy` is yet to implement EndpointSlice handling.
-->
    * + 使用：
    * 已添加新的服务规范字段 `Service.Spec.IPFamily`。该字段的默认值为 family（--service-cluster-ip-range 参数中的第一个服务 cidr）。一旦打开功能开关，该值将如上所述为默认值，这是此字段的可能值：
    * 2. IPv4：api-server 将从 `service-cluster-ip-range` 中分配一个 IP 地址为 `ipv4`（根据它们的配置是主 IP 还是辅助 IP）。
    * 2. IPv6：api-server 将从 `service-cluster-ip-range` 中分配一个 IP 地址为 `ipv6`（根据它们的配置是主 IP 还是辅助 IP）。
    * 注意事项 （v1.16）：
    * 1. 从 v1.16 开始，IPVS 是双栈模式支持的唯一代理。
    * 2. 双栈与 `EndpointSlice` 功能互斥，不能同时打开。`metaproxy` 还没有实现 EndpointSlice 处理功能。

<!--
* Kubelet metrics for /metrics and /metrics/probes are now marked as with the ALPHA stability level. ([#81534](https://github.com/kubernetes/kubernetes/pull/81534), [@logicalhan](https://github.com/logicalhan))
* Added metrics 'authentication_attempts' that can be used to understand the attempts of authentication. ([#81509](https://github.com/kubernetes/kubernetes/pull/81509), [@RainbowMango](https://github.com/RainbowMango))
* Fix in kube-proxy for SCTP nodeport service which only works for node's InternalIP, but doesn't work for other IPs present in the node when ipvs is enabled. ([#81477](https://github.com/kubernetes/kubernetes/pull/81477), [@paulsubrata55](https://github.com/paulsubrata55))
* The `CustomResourceValidation`, `CustomResourceSubresources`, `CustomResourceWebhookConversion` and `CustomResourcePublishOpenAPI` features are now GA, and the associated feature gates deprecated and will be removed in v1.18. ([#81965](https://github.com/kubernetes/kubernetes/pull/81965), [@roycaihw](https://github.com/roycaihw))
-->
* /metrics 和 /metrics/probes 的 kubelet 指标现已被标记为 ALPHA 稳定性级别。见 ([#81534](https://github.com/kubernetes/kubernetes/pull/81534)、[@logicalhan](https://github.com/logicalhan))。
* 添加了可用于了解身份验证尝试的指标 `authentication_attempts`。见 ([#81509](https://github.com/kubernetes/kubernetes/pull/81509)、[@RainbowMango](https://github.com/RainbowMango))。
* 修复了针对 SCTP Nodeport 服务的 kube-proxy 问题，该服务仅适用于节点的 InternalIP，但不适用于启用 ipvs 时节点中存在的其他 IP。见 ([#81477](https://github.com/kubernetes/kubernetes/pull/81477)、[@paulsubrata55](https://github.com/paulsubrata55))。
* `CustomResourceValidation`、`CustomResourceSubresources`、`CustomResourceWebhookConversion` 和 `CustomResourcePublishOpenAPI` 功能现在已成为 GA，但是不赞成使用相关功能开关，因为这些参数将在 v1.18 中被删除。见 ([#81965](https://github.com/kubernetes/kubernetes/pull/81965)、[@roycaihw](https://github.com/roycaihw))。
<!--
* Node-Problem-Detector v0.7.1 is used on GCI. ([#80726](https://github.com/kubernetes/kubernetes/pull/80726), [@wangzhen127](https://github.com/wangzhen127))
* kubeadm: prevent overriding of certain kubelet security configuration parameters if the user wished to modify them ([#81903](https://github.com/kubernetes/kubernetes/pull/81903), [@jfbai](https://github.com/jfbai))
* Introduce `node.kubernetes.io/exclude-balancer` and `node.kubernetes.io/exclude-disruption` labels in alpha to prevent cluster deployers from being dependent on the optional `node-role` labels which not all clusters may provide. ([#80238](https://github.com/kubernetes/kubernetes/pull/80238), [@smarterclayton](https://github.com/smarterclayton))
-->
* 在 GCI 上使用 Node-Problem-Detector v0.7.1。见 ([#80726](https://github.com/kubernetes/kubernetes/pull/80726)、[@wangzhen127](https://github.com/wangzhen127))。
* kubeadm：如果用户希望修改某些 kubelet 安全配置参数，则可以防止它们被覆盖。见 ([#81903](https://github.com/kubernetes/kubernetes/pull/81903)、[@jfbai](https://github.com/jfbai))。
* 在 Alpha 功能中引入 `node.kubernetes.io/exclude-balancer` 和 `node.kubernetes.io/exclude-disruption` 标签，以防止集群部署者依赖于并非所有集群都可以提供的可选 `node-role` 标签。见 ([#80238](https://github.com/kubernetes/kubernetes/pull/80238)、[@smarterclayton](https://github.com/smarterclayton))。
<!--
* Scheduler metrics are now marked as with the ALPHA stability level. ([#81576](https://github.com/kubernetes/kubernetes/pull/81576), [@logicalhan](https://github.com/logicalhan))
* cache-control headers are now set appropriately.  Only openapi is cacheable if etags match. ([#81946](https://github.com/kubernetes/kubernetes/pull/81946), [@deads2k](https://github.com/deads2k))
* Added E2E tests validating WindowsOptions.RunAsUserName. ([#79539](https://github.com/kubernetes/kubernetes/pull/79539), [@bclau](https://github.com/bclau))
-->
* 现在，Scheduler 指标已被标记为具有 ALPHA 稳定性级别。见 ([#81576](https://github.com/kubernetes/kubernetes/pull/81576)、[@logicalhan](https://github.com/logicalhan))。
* 现在已正确设置了缓存控制头部。如果 etags 匹配，则只有 openapi 是可缓存的。见 ([#81946](https://github.com/kubernetes/kubernetes/pull/81946)、[@deads2k](https://github.com/deads2k))。
* 添加了验证 WindowsOptions.RunAsUserName 的 E2E 测试。见 ([#79539](https://github.com/kubernetes/kubernetes/pull/79539)、[@bclau](https://github.com/bclau))。
<!--
* Kube-apiserver metrics are now marked as with the ALPHA stability level. ([#81531](https://github.com/kubernetes/kubernetes/pull/81531), [@logicalhan](https://github.com/logicalhan))
* Move CSI volume expansion to beta. ([#81467](https://github.com/kubernetes/kubernetes/pull/81467), [@bertinatto](https://github.com/bertinatto))
* Support Kubelet plugin watcher on Windows nodes. ([#81397](https://github.com/kubernetes/kubernetes/pull/81397), [@ddebroy](https://github.com/ddebroy))
* Updates the requestedToCapacityRatioArguments to add resources parameter that allows the users to specify the resource name along with weights for each resource to score nodes based on the request to capacity ratio.    ([#77688](https://github.com/kubernetes/kubernetes/pull/77688), [@sudeshsh](https://github.com/sudeshsh))
-->
* 现在，kube-apiserver 指标已被标记为 ALPHA 稳定性级别。见 ([#81531](https://github.com/kubernetes/kubernetes/pull/81531)、[@logicalhan](https://github.com/logicalhan))。
* 将 CSI 卷扩展移动到 Beta 功能。见 ([#81467](https://github.com/kubernetes/kubernetes/pull/81467)、[@bertinatto](https://github.com/bertinatto))。
* 在 Windows 节点上支持 kubelet 插件监视程序。见 ([#81397](https://github.com/kubernetes/kubernetes/pull/81397)、[@ddebroy](https://github.com/ddebroy))。
* 更新 requestedToCapacityRatioArguments 函数用以添加资源参数，该参数允许用户指定资源名称以及每个资源的权重，然后基于请求与容量之比为节点评分。见 ([#77688](https://github.com/kubernetes/kubernetes/pull/77688)、[@sudeshsh](https://github.com/sudeshsh))。
<!--
* Finalizer Protection for Service LoadBalancers is now in Beta (enabled by default). This feature ensures the Service resource is not fully deleted until the correlating load balancer resources are deleted. ([#81691](https://github.com/kubernetes/kubernetes/pull/81691), [@MrHohn](https://github.com/MrHohn))
* Adds support for vSphere volumes on Windows ([#80911](https://github.com/kubernetes/kubernetes/pull/80911), [@gab-satchi](https://github.com/gab-satchi))
* Log when kube-apiserver regenerates the OpenAPI spec and why. OpenAPI spec generation is a very CPU-heavy process that is sensitive to continuous updates of CRDs and APIServices. ([#81786](https://github.com/kubernetes/kubernetes/pull/81786), [@sttts](https://github.com/sttts))
    * Added metrics aggregator_openapi_v2_regeneration_count, aggregator_openapi_v2_regeneration_gauge and apiextension_openapi_v2_regeneration_count metrics counting the triggering APIService and CRDs and the reason (add, update, delete).
-->
* 服务负载均衡器的 Finalizer 保护现在处于 Beta（默认启用）中。此功能可确保在删除相关的负载均衡器资源之前，不会完全删除服务资源。见 ([#81691](https://github.com/kubernetes/kubernetes/pull/81691)、[@MrHohn](https://github.com/MrHohn))。
* 在 Windows 上增加了对 vSphere 卷的支持。见 ([#80911](https://github.com/kubernetes/kubernetes/pull/80911)、[@gab-satchi](https://github.com/gab-satchi))。
* 记录 kube-apiserver 重新生成 OpenAPI 规范的时间以及原因。OpenAPI 规范的生成是一个非常占用 CPU 的过程，它对 CRD 和 APIServices 的连续更新很敏感。见 ([#81786](https://github.com/kubernetes/kubernetes/pull/81786)、[@sttts](https://github.com/sttts))。
    * 添加了指标 `aggregator_openapi_v2_regeneration_count`、`aggregator_openapi_v2_regeneration_gauge` 和 `apiextension_openapi_v2_regeneration_count`，这些指标统计了（添加，更新，删除）操作时触发的 APIService 和 CRD 以及原因。
<!--
* Fix an issue with toleration merging & whitelist checking in the PodTolerationRestriction admission controller. ([#81732](https://github.com/kubernetes/kubernetes/pull/81732), [@tallclair](https://github.com/tallclair))
* Add a helper function to decode scheduler plugin args. ([#80696](https://github.com/kubernetes/kubernetes/pull/80696), [@hex108](https://github.com/hex108))
* Add metadata.generation=1 to old CustomResources. ([#82005](https://github.com/kubernetes/kubernetes/pull/82005), [@sttts](https://github.com/sttts))
* kubeadm no longer performs IPVS checks as part of its preflight checks ([#81791](https://github.com/kubernetes/kubernetes/pull/81791), [@yastij](https://github.com/yastij))
-->
* 解决了 PodTolerationRestriction admission controller（准入控制器）中的容忍度合并和白名单检查问题。见 ([#81732](https://github.com/kubernetes/kubernetes/pull/81732)、[@tallclair](https://github.com/tallclair))。
* 添加一个 helper 函数来解码 scheduler 插件参数。见 ([#80696](https://github.com/kubernetes/kubernetes/pull/80696)、[@hex108](https://github.com/hex108))。
* 将 metadata.generation = 1 添加到旧的 CustomResources。见 ([#82005](https://github.com/kubernetes/kubernetes/pull/82005)、[@sttts](https://github.com/sttts))。
* kubeadm 在其启动前检查中不再执行 IPVS 检查。见 ([#81791](https://github.com/kubernetes/kubernetes/pull/81791)、[@yastij](https://github.com/yastij))。
<!--
* The RemainingItemCount feature is now beta. ([#81682](https://github.com/kubernetes/kubernetes/pull/81682), [@caesarxuchao](https://github.com/caesarxuchao))
    * remainingItemCount is the number of subsequent items in the list which are not included in this list response. If the list request contained label or field selectors, then the number of remaining items is unknown and the field will be left unset and omitted during serialization. If the list is complete (either because it is not chunking or because this is the last chunk), then there are no more remaining items and this field will be left unset and omitted during serialization. Servers older than v1.15 do not set this field. The intended use of the remainingItemCount is *estimating* the size of a collection. Clients should not rely on the remainingItemCount to be set or to be exact.
-->
* RemainingItemCount 功能现在为 Beta 功能。见 ([#81682](https://github.com/kubernetes/kubernetes/pull/81682)、[@caesarxuchao](https://github.com/caesarxuchao))。
    * remainingItemCount 是列表中未包括在此列表响应中的后续项目的数量。如果列表请求中包含标签或字段选择器，则剩余项目数未知并且在序列化期间该字段将保持不变并被忽略。如果列表是完整的（不是因为它不是分块的，或者是因为这是最后一个块），那么将不再有剩余的项目，并且在序列化期间将保留此字段并将其省略。低于 v1.15 的服务器未设置此字段。remainingItemCount 的预期用途是*估计*集合的大小。客户端不应依赖于 remainingItemCount 进行准确无误的设置。
<!--
* The CustomResourceDefaulting feature is promoted to beta and enabled by default. Defaults may be specified in structural schemas via the `apiextensions.k8s.io/v1` API. See https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/#specifying-a-structural-schema for details. ([#81872](https://github.com/kubernetes/kubernetes/pull/81872), [@sttts](https://github.com/sttts))
* kubectl could scale custom resource again ([#81342](https://github.com/kubernetes/kubernetes/pull/81342), [@knight42](https://github.com/knight42))
* a CSI driver that supports ephemeral inline volumes must explicitly declare that by providing a CSIDriver object where the new "mode" field is set to "ephemeral" or "persistent+ephemeral" ([#80568](https://github.com/kubernetes/kubernetes/pull/80568), [@pohly](https://github.com/pohly))
-->
* CustomResourceDefaulting 功能升级为 Beta 功能，并且默认情况下启用。可以在结构模式中通过 `apiextensions.k8s.io/v1` API 指定默认值。有关详细信息，请参见 https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/#specifying-a-structural-schema。见 ([#81872](https://github.com/kubernetes/kubernetes/pull/81872)、[@sttts](https://github.com/sttts))。
* kubectl 可以再次扩展自定义资源。见 ([#81342](https://github.com/kubernetes/kubernetes/pull/81342)、[@knight42](https://github.com/knight42))。
* 支持临时内联卷的 CSI 驱动程序必须通过提供 CSIDriver 对象来明确声明，该对象的新 “mode” 字段设置为 “ephemeral” 或 “persistent+ephemeral”。见 ([#80568](https://github.com/kubernetes/kubernetes/pull/80568)、[@pohly](https://github.com/pohly))。
<!--
* `framework.ExpectNoError` no longer logs the error and instead relies on using the new `log.Fail` as Gomega fail handler. ([#80253](https://github.com/kubernetes/kubernetes/pull/80253), [@pohly](https://github.com/pohly))
* Audit events now log the existence and patch of mutating webhooks.  ([#77824](https://github.com/kubernetes/kubernetes/pull/77824), [@roycaihw](https://github.com/roycaihw))
        * At Metadata audit level or higher, an annotation with key "mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}" gets logged with JSON payload indicating a webhook gets invoked for given request and whether it mutated the object or not.
        * At Request audit level or higher, an annotation with key "patch.webhook.admission.k8s.io/round_{round idx}_index_{order idx}" get logged with the JSON payload logging the patch sent by a webhook for given request.
-->
* `framework.ExpectNoError` 不再记录错误，而是依靠使用新的 `log.Fail` 作为 Gomega 故障处理程序。见 ([#80253](https://github.com/kubernetes/kubernetes/pull/80253)、[@pohly](https://github.com/pohly))。
* 现在，审核事件记录了异常 Webhooks 的存在和补丁。见 ([#77824](https://github.com/kubernetes/kubernetes/pull/77824)、[@roycaihw](https://github.com/roycaihw))。
        * 在元数据审核级别或更高级别上，将使用 JSON 有效负载记录具有键 "mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}" 的注释，该注释表示针对给定请求调用了 Webhook，以及是否更改了对象。
        * 在请求审计级别或更高级别上，带有 "patch.webhook.admission.k8s.io/round_{round idx}_index_{order idx}" 键的注释将与 JSON 有效负载一起记录，该有效负载记录 Webhook 针对给定请求发送的补丁。
<!--
* Resolves an issue that prevented block volumes from being resized. ([#81429](https://github.com/kubernetes/kubernetes/pull/81429), [@huffmanca](https://github.com/huffmanca))
* Verify that CRD default values in OpenAPI specs are pruned, with the exceptions of values under `metadata`. ([#78829](https://github.com/kubernetes/kubernetes/pull/78829), [@sttts](https://github.com/sttts))
* Use PostFilter instead of Postfilter in the scheduling framework ([#81800](https://github.com/kubernetes/kubernetes/pull/81800), [@draveness](https://github.com/draveness))
    * Use PreFilter instead of Prefilter in the scheduling framework
    * Use PreBind instead of Prebind in the scheduling framework
-->
* 解决了阻止块卷调整大小的问题。见 ([#81429](https://github.com/kubernetes/kubernetes/pull/81429)、[@huffmanca](https://github.com/huffmanca))。
* 验证是否修改了 OpenAPI 规范中的 CRD 默认值，`metadata` 下的值除外。见 ([#78829](https://github.com/kubernetes/kubernetes/pull/78829)、[@sttts](https://github.com/sttts))。
* scheduling framework 中使用 PostFilter 代替 Postfilter。见 ([#81800](https://github.com/kubernetes/kubernetes/pull/81800)、[@draveness](https://github.com/draveness))。
    * 在 scheduling framework 中使用 PreFilter 代替 Prefilter
    * 在 scheduling framework 中使用 PreBind 代替 Prebind
<!--
* Fix `kubectl logs -f` for windows server containers. ([#81747](https://github.com/kubernetes/kubernetes/pull/81747), [@Random-Liu](https://github.com/Random-Liu))
* fix azure disk naming matching issue due to case sensitive comparison ([#81720](https://github.com/kubernetes/kubernetes/pull/81720), [@andyzhangx](https://github.com/andyzhangx))
* Fixes a bug that when there is a "connection refused" error, the reflector's ListAndWatch func will return directly but what expected is that sleep 1 second and rewatch since the specified resourceVersion. ([#81634](https://github.com/kubernetes/kubernetes/pull/81634), [@likakuli](https://github.com/likakuli))
* Fixed a bug with the openAPI definition for io.k8s.apimachinery.pkg.runtime.RawExtension, which previously required a field "raw" to be specified ([#80773](https://github.com/kubernetes/kubernetes/pull/80773), [@jennybuckley](https://github.com/jennybuckley))
-->
* 修复了 Windows 服务器容器的 `kubectl logs -f` 问题。见 ([#81747](https://github.com/kubernetes/kubernetes/pull/81747)、[@Random-Liu](https://github.com/Random-Liu))。
* 修复了由于区分大小写而导致的 Azure 磁盘命名匹配问题。见 ([#81720](https://github.com/kubernetes/kubernetes/pull/81720)、[@andyzhangx](https://github.com/andyzhangx))。
* 修复了一个 bug，即当出现 “connection refused” 错误时，反射器的 ListAndWatch 函数将直接返回，但预期的是睡眠 1 秒钟并从指定的 resourceVersion 重新开始监视。见 ([#81634](https://github.com/kubernetes/kubernetes/pull/81634)、[@likakuli](https://github.com/likakuli))。
* 修复了带有 io.k8s.apimachinery.pkg.runtime.RawExtension 的 openAPI 定义的错误问题，该错误以前需要指定字段 "raw"。见 ([#80773](https://github.com/kubernetes/kubernetes/pull/80773)、[@jennybuckley](https://github.com/jennybuckley))。
<!--
* kubeadm: print the stack trace of an error for klog level --v>=5 ([#80937](https://github.com/kubernetes/kubernetes/pull/80937), [@neolit123](https://github.com/neolit123))
* Fixes a problem with the iptables proxy mode that could result in long delays ([#80368](https://github.com/kubernetes/kubernetes/pull/80368), [@danwinship](https://github.com/danwinship))
    * updating Service/Endpoints IPs in very large clusters on RHEL/CentOS 7.
* kubeadm: support any Linux kernel version newer than 3.10 ([#81623](https://github.com/kubernetes/kubernetes/pull/81623), [@neolit123](https://github.com/neolit123))
* Added a metric 'apiserver_watch_events_sizes' that can be used to estimate sizes of watch events in the system. ([#80477](https://github.com/kubernetes/kubernetes/pull/80477), [@mborsz](https://github.com/mborsz))
-->
* kubeadm：打印 klog 级别大于 5 的错误的堆栈跟踪信息。见 ([#80937](https://github.com/kubernetes/kubernetes/pull/80937)、[@neolit123](https://github.com/neolit123))。
* 修复了 iptables 代理模式可能会导致长时间延迟的问题。见 ([#80368](https://github.com/kubernetes/kubernetes/pull/80368)、[@danwinship](https://github.com/danwinship))。
    * 在 RHEL 或 CentOS 7 上的超大型集群中更新服务或端点 IP。
* kubeadm：支持任何 3.10 以上的 Linux 内核版本。见 ([#81623](https://github.com/kubernetes/kubernetes/pull/81623)、[@neolit123](https://github.com/neolit123))。
* 添加了指标 'apiserver_watch_events_sizes'，可用于估计系统中监视事件的大小。见 ([#80477](https://github.com/kubernetes/kubernetes/pull/80477)、[@mborsz](https://github.com/mborsz))。
<!--
* NormalizeScore plugin set is removed from scheduler framework config API. Use ScorePlugin only. ([#80930](https://github.com/kubernetes/kubernetes/pull/80930), [@liu-cong](https://github.com/liu-cong))
* kubeadm reset: unmount directories under "/var/lib/kubelet" for linux only ([#81494](https://github.com/kubernetes/kubernetes/pull/81494), [@Klaven](https://github.com/Klaven))
* updates fluentd-elasticsearch docker image to fluentd 1.6.3 ([#80912](https://github.com/kubernetes/kubernetes/pull/80912), [@monotek](https://github.com/monotek))
-->
* 从 scheduler framework 配置 API 中删除了 NormalizeScore plugin，而是仅使用 ScorePlugin。见 ([#80930](https://github.com/kubernetes/kubernetes/pull/80930)、[@liu-cong](https://github.com/liu-cong))。
* kubeadm reset：仅针对 Linux 卸载 "/var/lib/kubelet" 下的目录。见 ([#81494](https://github.com/kubernetes/kubernetes/pull/81494)、[@Klaven](https://github.com/Klaven))。
* 将 fluentd-elasticsearch docker 镜像更新为 fluentd 1.6.3。见 ([#80912](https://github.com/kubernetes/kubernetes/pull/80912)、[@monotek](https://github.com/monotek))。
<!--
* Kubeadm now seamlessly migrates the CoreDNS Configuration when upgrading CoreDNS. ([#78033](https://github.com/kubernetes/kubernetes/pull/78033), [@rajansandeep](https://github.com/rajansandeep))
* Introduce support for applying pod overhead to pod cgroups, if the PodOverhead feature is enabled. ([#79247](https://github.com/kubernetes/kubernetes/pull/79247), [@egernst](https://github.com/egernst))
* Windows nodes on GCE now run with Windows Defender enabled. ([#81625](https://github.com/kubernetes/kubernetes/pull/81625), [@pjh](https://github.com/pjh))
-->
* 现在，Kubeadm 在升级 CoreDNS 时无差异地迁移 CoreDNS 配置。见 ([#78033](https://github.com/kubernetes/kubernetes/pull/78033)、[@rajansandeep](https://github.com/rajansandeep))。
* 如果启用了 PodOverhead 功能，则将引入了 Pod 开销应用于 Pod cgroup 的支持。见 ([#79247](https://github.com/kubernetes/kubernetes/pull/79247)、[@egernst](https://github.com/egernst))。
* GCE 上的 Windows 节点现在在启用 Windows 防护的情况下运行。见 ([#81625](https://github.com/kubernetes/kubernetes/pull/81625)、[@pjh](https://github.com/pjh))。

# v1.16.0-beta.1

<!--
[Documentation](https://docs.k8s.io)
-->
[文档](https://docs.k8s.io)

<!--
## Downloads for v1.16.0-beta.1
-->
## 下载 v1.16.0-beta.1
<!--
filename | sha512 hash
文件名 | sha512 hash
-->


文件名 | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes.tar.gz) | `16513ebb52b01afee26156dcd4c449455dc328d7a080ba54b3f3a4584dbd9297025e33a9dafe758b259ae6e33ccb84a18038f6f415e98be298761c4d3dfee94b`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-src.tar.gz) | `3933f441ebca812835d6f893ec378896a8adb7ae88ca53247fa402aee1fda00d533301ac806f6bf106badf2f91be8c2524fd98e9757244b4b597c39124c59d01`

<!--
### Client Binaries
-->
### 客户端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-darwin-386.tar.gz) | `28f0a8979f956aa5b3be1c1158a3ade1b242aac332696cb604fbdba44c4279caa1008840af01e50692bf48d0342018f882dd6e30f9fe3279e9784094cfc9ff3c`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-darwin-amd64.tar.gz) | `8804f60b690e5180125cf6ac6d739ad5432b364c5e0d0ee0d2f06220c86ca3a2cffc475e0e3c46c19466e5d1566a5b8bf0a33191cba5bbd3ff27ac64ceee57a0`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-linux-386.tar.gz) | `8f7f86db5a496afd269b926b6baf341bbd4208f49b48fad1a44c5424812667b3bd7912b5b97bd7844dee2a7c6f9441628f7b5db3caa14429020de7788289191c`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-linux-amd64.tar.gz) | `7407dc1216cac39f15ca9f75be47c0463a151a3fda7d9843a67c0043c69858fb36eaa6b4194ce5cefd125acd7f521c4b958d446bb0c95ca73a3b3ae47af2c3ee`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-linux-arm.tar.gz) | `249a82a0af7d8062f49edd9221b3823590b6d166c1bca12c787ae640d6a131bd6a3d7c99136de62074afa6cabe8900dcf4e11037ddbfdf9d5252fc16e256eeb5`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-linux-arm64.tar.gz) | `3a8416d99b6ae9bb6d568ff15d1783dc521fe58c60230f38126c64a7739bf03d8490a9a10042d1c4ef07290eaced6cb9d42a9728d4b937305d63f8d3cc7a66f8`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-linux-ppc64le.tar.gz) | `105bf4afeccf0b314673265b969d1a7f3796ca3098afa788c43cd9ff3e14ee409392caa5766631cca180e790d92731a48f5e7156167637b97abc7c178dd390f3`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-linux-s390x.tar.gz) | `98de73accb7deba9896e14a5012a112f6fd00d6e6868e4d21f61b06605efa8868f1965a1c1ba72bb8847416bc789bd7ef5c1a125811b6c6df060217cd84fdb2c`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-windows-386.tar.gz) | `7a43f3285b0ab617990497d41ceadfbd2be2b72d433b02508c198e9d380fb5e0a96863cc14d0e9bf0317df13810af1ab6b7c47cd4fa1d0619a00c9536dc60f0f`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-client-windows-amd64.tar.gz) | `f3fafcffc949bd7f8657dd684c901e199b21c4812009aca1f8cf3c8bf3c3230cab072208d3702d7a248c0b957bc513306dd437fb6a54e1e64b4d7dc8c3c180cd`

<!--
### Server Binaries
-->
### 服务器端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-server-linux-amd64.tar.gz) | `87b46e73ae2162ee49f510da6549e57503d3ea94b3c4488f39b0b93d45603f540ece30c3784c5e201711a7ddd1260481cd20ac4c618eaf46879e841d054a115a`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-server-linux-arm.tar.gz) | `80ba8e615497c0b9c339fbd2d6a4dda54fdbd5659abd7d8e8d448d8d8c24ba7f0ec48693e4bf8ed20513c46432f2a0f1039ab9044f0ed006b935a58772372d95`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-server-linux-arm64.tar.gz) | `b4a76a5fc026b4b3b5f9666df05e46896220591b21c147982ff3d91cec7330ed78cf1fc63f5ab759820aadbcfe400c1ad75d5151d9217d42e3da5873e0ff540d`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-server-linux-ppc64le.tar.gz) | `fb435dfd5514e4cd3bc16b9e71865bff3cdd5123fc272c8cbc5956c260449e0dcfd30d2fdb120da73134e62f48507c5a02d4528d7b9d978765ff4ed740b274e8`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-server-linux-s390x.tar.gz) | `65ed3d372a4d03493d0a586c7f67f1236aa99f02552195f1fb58079bc24787200d9a0f34d0c311a846345d0d70d02ad726f74376a91d3ced234bbfdce80c5133`

<!--
### Node Binaries
-->
### 节点可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-node-linux-amd64.tar.gz) | `c9161689532a5e995a68bb0985a983dc43d8e747a05f37849cd33062c07e5202417b26bff652b8bc9c0005026618b7ebc56f918c71747a3addb5da044e683b4a`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-node-linux-arm.tar.gz) | `7dba9fdb290f33678983c046eb145446edb1b7479c2403f9e8bd835c3d832ab1f2acb28124c53af5b046d47ab433312d6a654f000a22f8e10795b0bc45bfbddb`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-node-linux-arm64.tar.gz) | `8c435824667cd9ec7efdfb72c1d060f62ca61b285cbb9575a6e6013e20ec5b379f77f51d43ae21c1778a3eb3ef69df8895213c54e4b9f39c67c929a276be12de`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-node-linux-ppc64le.tar.gz) | `2cfca30dbe49a38cd1f3c78135f60bf7cb3dae0a8ec5d7fa651e1c5949254876fbab8a724ed9a13f733a85b9960edcc4cc971dc3c16297db609209c4270f144f`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-node-linux-s390x.tar.gz) | `63bbe469ddd1be48624ef5627fef1e1557a691819c71a77d419d59d101e8e6ee391eb8545da35b412b94974c06d73329a13660484ab26087a178f34a827a3dcb`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-beta.1/kubernetes-node-windows-amd64.tar.gz) | `07cb97d5a3b7d0180a9e22696f417422a0c043754c81ae68338aab7b520aa7c119ff53b9ad835f9a0bc9ea8c07483ce506af48d65641dd15d30209a696b064bb`

<!--
## Changelog since v1.16.0-alpha.3
-->
## 自 v1.16.0-alpha.3 起的变更日志

<!--
### Action Required
-->
### 需要进行的操作

<!--
* scheduler.alpha.kubernetes.io/critical-pod annotation is removed. Pod priority (spec.priorityClassName) should be used instead to mark pods as critical. Action required! ([#80342](https://github.com/kubernetes/kubernetes/pull/80342), [@draveness](https://github.com/draveness))
* Removed cadvisor metric labels `pod_name` and `container_name` to match instrumentation guidelines. ([#80376](https://github.com/kubernetes/kubernetes/pull/80376), [@ehashman](https://github.com/ehashman))
    * Action required: any Prometheus queries that match `pod_name` and `container_name` labels (e.g. cadvisor or kubelet probe metrics) must be updated to use `pod` and `container` instead.
* Remove DirectCodecFactory(replace with serializer.WithoutConversionCodecFactory), DirectEncoder(replace with runtime.WithVersionEncoder) and DirectDecoder(replace with runtime.WithoutVersionDecoder). action required ([#79263](https://github.com/kubernetes/kubernetes/pull/79263), [@draveness](https://github.com/draveness))
-->
* 删除了 scheduler.alpha.kubernetes.io/critical-pod 注解。应使用 Pod priority（spec.priorityClassName）将 Pod 标记为关键。这是必须要进行的操作。见 ([#80342](https://github.com/kubernetes/kubernetes/pull/80342)、[@draveness](https://github.com/draveness))。
* 删除了 cadvisor 指标标签 `pod_name` 和 `container_name` 以符合仪器指南。见 ([#80376](https://github.com/kubernetes/kubernetes/pull/80376)、[@ehashman](https://github.com/ehashman))。
    * 需要进行的操作：标签的任何 Prometheus 查询（例如 cadvisor 或 kubelet 探测指标）都必须更新为使用 `pod` 和 `container` 标签。
* 删除了 DirectCodecFactory（用 serializer.WithoutConversionCodecFactory 替换）、DirectEncoder（用 runtime.WithVersionEncoder 替换）和 DirectDecoder（用 runtime.WithoutVersionDecoder 替换）。这是必须要进行的操作。见 ([#79263](https://github.com/kubernetes/kubernetes/pull/79263)、[@draveness](https://github.com/draveness))。

<!--
### Other notable changes
-->
### 其他值得注意的变化

<!--
* fix: detach azure disk issue using dangling error ([#81266](https://github.com/kubernetes/kubernetes/pull/81266), [@andyzhangx](https://github.com/andyzhangx))
* Conversion webhooks can now indicate they support receiving and responding with `ConversionReview` API objects in the `apiextensions.k8s.io/v1` version by including `v1` in the `conversionReviewVersions` list in their CustomResourceDefinition. Conversion webhooks must respond with a ConversionReview object in the same apiVersion they receive. `apiextensions.k8s.io/v1` `ConversionReview` responses must specify a `response.uid` that matches the `request.uid` of the object they were sent. ([#81476](https://github.com/kubernetes/kubernetes/pull/81476), [@liggitt](https://github.com/liggitt))
* The `CustomResourceDefinition` API type is promoted to `apiextensions.k8s.io/v1` with the following changes: ([#79604](https://github.com/kubernetes/kubernetes/pull/79604), [@liggitt](https://github.com/liggitt))
-->
* 修复使用 dangling 错误分离 Azure 磁盘的问题。见 ([#81266](https://github.com/kubernetes/kubernetes/pull/81266)、[@andyzhangx](https://github.com/andyzhangx))。
* 转换 webhooks 现在可以通过将 `v1` 包含在 CustomResourceDefinition 的 `conversionReviewVersions` 列表中来表明它们支持 `apiextensions.k8s.io/v1` 版本的 `ConversionReview` API 对象的接收和响应。转换 webhooks 必须在收到的 apiVersion 中以 ConversionReview 对象作为响应。`apiextensions.k8s.io/v1` `ConversionReview` 响应必须指定一个 `response.uid`，该响应与发送对象的 `request.uid` 相匹配。见 ([#81476](https://github.com/kubernetes/kubernetes/pull/81476)、[@liggitt](https://github.com/liggitt))。
* 通过以下更改，将 `CustomResourceDefinition` API 类型升级为 `apiextensions.k8s.io/v1`：见 ([#79604](https://github.com/kubernetes/kubernetes/pull/79604)、[@liggitt](https://github.com/liggitt))。
    <!--
    * Use of the new `default` feature in validation schemas is limited to v1
    * `spec.scope` is no longer defaulted to `Namespaced` and must be explicitly specified
    * `spec.version` is removed; use `spec.versions` instead
    * `spec.validation` is removed; use `spec.versions[*].schema` instead
    * `spec.subresources` is removed; use `spec.versions[*].subresources` instead
    * `spec.additionalPrinterColumns` is removed; use `spec.versions[*].additionalPrinterColumns` instead
    * `spec.conversion.webhookClientConfig` is moved to `spec.conversion.webhook.clientConfig`
    * `spec.conversion.conversionReviewVersions` is moved to `spec.conversion.webhook.conversionReviewVersions`
    * `spec.versions[*].schema.openAPIV3Schema` is now required when creating v1 CustomResourceDefinitions
    * `spec.preserveUnknownFields: true` is disallowed when creating v1 CustomResourceDefinitions; it must be specified within schema definitions as `x-kubernetes-preserve-unknown-fields: true`
    * In `additionalPrinterColumns` items, the `JSONPath` field was renamed to `jsonPath` (fixes https://github.com/kubernetes/kubernetes/issues/66531)
    -->
    * 通过以下更改将 `CustomResourceDefinition` API 类型升级为 `apiextensions.k8s.io/v1`：
    * `spec.scope` 不再默认为 `Namespaced`，必须明确指定 `spec.scope`
    * 删除了 `spec.version`；改用 `spec.versions`
    * 删除了 `spec.validation`；改用 `spec.versions[*].schema`
    * 删除了 `spec.subresources`；改用 `spec.versions[*].subresources`
    * 删除了 `spec.additionalPrinterColumns`；改用 `spec.versions[*].additionalPrinterColumns`
    * 将 `spec.conversion.webhookClientConfig` 移至 `spec.conversion.webhook.clientConfig`
    * 将 `spec.conversion.conversionReviewVersions` 移至 `spec.conversion.webhook.conversionReviewVersions`
    * 现在，在创建 v1 CustomResourceDefinitions 时需要 `spec.versions[*].schema.openAPIV3Schema`
    * 创建 v1 CustomResourceDefinitions 时不允许使用 `spec.preserveUnknownFields: true`；必须在模式定义中将其指定为 `x-kubernetes-preserve-unknown-fields: true`。
    * 在 `additionalPrinterColumns` 项目中，将 `JSONPath` 字段重命名为 `jsonPath`，见 [参考](https://github.com/kubernetes/kubernetes/issues/66531)。
<!--
* openapi now advertises correctly supported patch types for custom resources ([#81515](https://github.com/kubernetes/kubernetes/pull/81515), [@liggitt](https://github.com/liggitt))
* Kubelet could be run with no Azure identity without subscriptionId configured now. ([#81500](https://github.com/kubernetes/kubernetes/pull/81500), [@feiskyer](https://github.com/feiskyer))
    * A sample cloud provider configure is: '{"vmType": "vmss", "useInstanceMetadata": true}'.
* Volumes specified in a pod but not used in it are no longer unnecessarily formatted, mounted and reported in `node.status.volumesInUse`. ([#81163](https://github.com/kubernetes/kubernetes/pull/81163), [@jsafrane](https://github.com/jsafrane))
-->
* openapi 现在可以为自定义资源发布其正确支持的补丁程序类型。见 ([#81515](https://github.com/kubernetes/kubernetes/pull/81515)、[@liggitt](https://github.com/liggitt))。
* 如果现在没有配置 subscriptionId，则可以在没有 Azure 身份的情况下运行 kubelet。见 ([#81500](https://github.com/kubernetes/kubernetes/pull/81500)、[@feiskyer](https://github.com/feiskyer))。
    * 一个云提供商配置示例为：'{"vmType": "vmss", "useInstanceMetadata": true}'。
* 在 Pod 中指定但未在其中使用的卷不再需要在 `node.status.volumesInUse` 中格式化、安装和报告。见 ([#81163](https://github.com/kubernetes/kubernetes/pull/81163)、[@jsafrane](https://github.com/jsafrane))。
<!--
* kubeadm: use etcd's /health endpoint for a HTTP liveness probe on localhost instead of having a custom health check using etcdctl ([#81385](https://github.com/kubernetes/kubernetes/pull/81385), [@neolit123](https://github.com/neolit123))
* kubeamd: use the --pod-network-cidr flag to init or use the podSubnet field in the kubeadm config to pass a comma separated list of pod CIDRs.  ([#79033](https://github.com/kubernetes/kubernetes/pull/79033), [@Arvinderpal](https://github.com/Arvinderpal))
* Update to use go 1.12.9 ([#81489](https://github.com/kubernetes/kubernetes/pull/81489), [@BenTheElder](https://github.com/BenTheElder))
* Update Azure SDK + go-autorest API versions ([#79574](https://github.com/kubernetes/kubernetes/pull/79574), [@justaugustus](https://github.com/justaugustus))
* Extender bind should respect IsInterested ([#79804](https://github.com/kubernetes/kubernetes/pull/79804), [@yqwang-ms](https://github.com/yqwang-ms))
* Add instruction to setup "Application Default Credentials" to run GCE Windows e2e tests locally.  ([#81337](https://github.com/kubernetes/kubernetes/pull/81337), [@YangLu1031](https://github.com/YangLu1031))
-->
* kubeadm：使用 etcd 的 /health 端点进行本地主机上的 HTTP 活跃探针操作，而不是使用 etcdctl 进行自定义健康检查。见 ([#81385](https://github.com/kubernetes/kubernetes/pull/81385)、[@neolit123](https://github.com/neolit123))。
* kubeamd：使用 --pod-network-cidr 参数进行初始化或使用 kubeadm 配置中的 podSubnet 字段传递以逗号分隔的 Pod CIDR 列表。见 ([#79033](https://github.com/kubernetes/kubernetes/pull/79033)、[@Arvinderpal](https://github.com/Arvinderpal))。
* 更新 go 到 1.12.9。见 ([#81489](https://github.com/kubernetes/kubernetes/pull/81489)、[@BenTheElder](https://github.com/BenTheElder))。
* 更新 Azure SDK + go-autorest API 版本。见 ([#79574](https://github.com/kubernetes/kubernetes/pull/79574)、[@justaugustus](https://github.com/justaugustus))。
* Extender 绑定应该匹配 IsInterested。见 ([#79804](https://github.com/kubernetes/kubernetes/pull/79804)、[@yqwang-ms](https://github.com/yqwang-ms))。
* 添加设置 “应用程序默认凭证” 说明，用于在本地运行 GCE Windows e2e 测试。见 ([#81337](https://github.com/kubernetes/kubernetes/pull/81337)、[@YangLu1031](https://github.com/YangLu1031))。
<!--
* Scheduler should terminate when it looses leader lock. ([#81306](https://github.com/kubernetes/kubernetes/pull/81306), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* kubelet now exports an "kubelet_evictions" metric that counts the number of pod evictions carried out by the kubelet to reclaim resources ([#81377](https://github.com/kubernetes/kubernetes/pull/81377), [@sjenning](https://github.com/sjenning))
* Return error when the scoring plugin returns score out of range [0, 100]. ([#81015](https://github.com/kubernetes/kubernetes/pull/81015), [@draveness](https://github.com/draveness))
* Update to use go 1.12.8 ([#81390](https://github.com/kubernetes/kubernetes/pull/81390), [@cblecker](https://github.com/cblecker))
* kube-proxy --cleanup will return the correct exit code if the cleanup was successful ([#78775](https://github.com/kubernetes/kubernetes/pull/78775), [@johscheuer](https://github.com/johscheuer))
* remove iSCSI volume storage cleartext secrets in logs ([#81215](https://github.com/kubernetes/kubernetes/pull/81215), [@zouyee](https://github.com/zouyee))
* Use a named array instead of a score array in normalizing-score phase. ([#80901](https://github.com/kubernetes/kubernetes/pull/80901), [@draveness](https://github.com/draveness))
-->
* Scheduler 应在释放领导者 lock 锁时终止。见 ([#81306](https://github.com/kubernetes/kubernetes/pull/81306)、[@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))。
* kubelet 现在新增一个 "kubelet_evictions" 指标，该指标统计 kubelet 为回收资源而执行的 Pod 驱逐的数量。见 ([#81377](https://github.com/kubernetes/kubernetes/pull/81377)、[@sjenning](https://github.com/sjenning))。
* 当计分插件返回的分数超出 [0，100] 范围时，返回错误。见 ([#81015](https://github.com/kubernetes/kubernetes/pull/81015)、[@draveness](https://github.com/draveness))。
* 更新 go 到 1.12.8。见 ([#81390](https://github.com/kubernetes/kubernetes/pull/81390)、[@cblecker](https://github.com/cblecker))。
* 如果清除成功，则 kube-proxy --cleanup 将返回正确的退出代码。见 ([#78775](https://github.com/kubernetes/kubernetes/pull/78775)、[@johscheuer](https://github.com/johscheuer))。
* 删除日志中的 iSCSI 卷存储明文秘密。见 ([#81215](https://github.com/kubernetes/kubernetes/pull/81215)、[@zouyee](https://github.com/zouyee))。
* 在规范化评分阶段，使用命名数组而不是分数数组。见 ([#80901](https://github.com/kubernetes/kubernetes/pull/80901)、[@draveness](https://github.com/draveness))。
<!--
* If scheduler extender filtered a not found node, current scheduling round for this pod will just be skipped. ([#79641](https://github.com/kubernetes/kubernetes/pull/79641), [@yqwang-ms](https://github.com/yqwang-ms))
* Update golang/x/net dependency to bring in fixes for CVE-2019-9512, CVE-2019-9514 ([#81394](https://github.com/kubernetes/kubernetes/pull/81394), [@cblecker](https://github.com/cblecker))
* Fixes CVE-2019-11250: client-go header logging (at verbosity levels >= 7) now masks `Authorization` header contents ([#81330](https://github.com/kubernetes/kubernetes/pull/81330), [@tedyu](https://github.com/tedyu))
* Resolves a transient 404 response to custom resource requests during server startup ([#81244](https://github.com/kubernetes/kubernetes/pull/81244), [@liggitt](https://github.com/liggitt))
* Non nil DataSource entries on PVC's are now displayed as part of `describe pvc` output. ([#76463](https://github.com/kubernetes/kubernetes/pull/76463), [@j-griffith](https://github.com/j-griffith))
* Fix Azure client requests stuck issues on http.StatusTooManyRequests (HTTP Code 429). ([#81279](https://github.com/kubernetes/kubernetes/pull/81279), [@feiskyer](https://github.com/feiskyer))
-->
* 如果 scheduler 扩展程序过滤了一个未找到的节点，则此 Pod 的当前调度回合将被跳过。见 ([#79641](https://github.com/kubernetes/kubernetes/pull/79641)、[@yqwang-ms](https://github.com/yqwang-ms))。
* 更新 golang/x/net 相关依赖项，修复 CVE-2019-9512、CVE-2019-9514 相关问题。见 ([#81394](https://github.com/kubernetes/kubernetes/pull/81394)、[@cblecker](https://github.com/cblecker))。
* 修复 CVE-2019-11250 问题：现在，client-go header（头部）日志记录（详细级别大于等于 7）掩盖了 `Authorization` 头部内容。见 ([#81330](https://github.com/kubernetes/kubernetes/pull/81330)、[@tedyu](https://github.com/tedyu))。
* 解决服务器启动期间对自定义资源请求的瞬态 404 响应。见 ([#81244](https://github.com/kubernetes/kubernetes/pull/81244)、[@liggitt](https://github.com/liggitt))。
* PVC 上的非 nil 数据源条目现在显示为 `describe pvc` 输出的一部分。见 ([#76463](https://github.com/kubernetes/kubernetes/pull/76463)、[@j-griffith](https://github.com/j-griffith))。
* 修复 Azure 客户端请求在 http.StatusTooManyRequests（HTTP 代码 429）上卡住的问题。([#81279](https://github.com/kubernetes/kubernetes/pull/81279)、[@feiskyer](https://github.com/feiskyer))。
<!--
* Implement a new feature that allows applying kustomize patches to static pod manifests generated by kubeadm.  ([#80905](https://github.com/kubernetes/kubernetes/pull/80905), [@fabriziopandini](https://github.com/fabriziopandini))
* Add a service annotation `service.beta.kubernetes.io/azure-pip-name` to specify the public IP name for Azure load balancer. ([#81213](https://github.com/kubernetes/kubernetes/pull/81213), [@nilo19](https://github.com/nilo19))
* Fix a bug in the IPVS proxier where virtual servers are not cleaned up even though the corresponding Service object was deleted. ([#80942](https://github.com/kubernetes/kubernetes/pull/80942), [@gongguan](https://github.com/gongguan))
* Add scheduling support for RuntimeClasses. RuntimeClasses can now specify nodeSelector constraints & tolerations, which are merged into the PodSpec for pods using that RuntimeClass. ([#80825](https://github.com/kubernetes/kubernetes/pull/80825), [@tallclair](https://github.com/tallclair))
* etcd Docker image can be run as non-root ([#79722](https://github.com/kubernetes/kubernetes/pull/79722), [@randomvariable](https://github.com/randomvariable))
* kubeadm: the permissions of generated CSR files are changed from 0644 to 0600 ([#81217](https://github.com/kubernetes/kubernetes/pull/81217), [@SataQiu](https://github.com/SataQiu))
* Fix conflicted cache when the requests are canceled by other Azure operations. ([#81282](https://github.com/kubernetes/kubernetes/pull/81282), [@feiskyer](https://github.com/feiskyer))
-->
* 实施一项新功能，该功能允许将 kustomize 修补程序应用于 kubeadm 生成的静态 pod 清单。见 ([#80905](https://github.com/kubernetes/kubernetes/pull/80905)、[@fabriziopandini](https://github.com/fabriziopandini))。
* 添加服务注解 `service.beta.kubernetes.io/azure-pip-name`，用于指定 Azure 负载均衡器的公共 IP 名称。见 ([#81213](https://github.com/kubernetes/kubernetes/pull/81213)、[@nilo19](https://github.com/nilo19))。
* 修复了 IPVS 代理中的一个错误，该错误是即使删除了相应的 Service 对象，也无法清理虚拟服务器。见 ([#80942](https://github.com/kubernetes/kubernetes/pull/80942)、[@gongguan](https://github.com/gongguan))。
* 添加对 RuntimeClasses 的调度支持。现在，RuntimeClasses 可以指定 nodeSelector 约束和容忍度，并使用该 RuntimeClass 将约束和容忍合并到 PodSpec 中。见 ([#80825](https://github.com/kubernetes/kubernetes/pull/80825)、[@tallclair](https://github.com/tallclair))。
* 可以以非 root 用户身份运行 etcd Docker 镜像。见 ([#79722](https://github.com/kubernetes/kubernetes/pull/79722)、[@randomvariable](https://github.com/randomvariable))。
* kubeadm：生成的 CSR 文件的权限从 0644 更改为 0600。见 ([#81217](https://github.com/kubernetes/kubernetes/pull/81217)、[@SataQiu](https://github.com/SataQiu))。
* 当其他 Azure 操作取消请求时，修复冲突的缓存问题。见  ([#81282](https://github.com/kubernetes/kubernetes/pull/81282)、[@feiskyer](https://github.com/feiskyer))。
<!--
* Fix kubelet NodeLease potential performance issues. Kubelet now will try to update lease using cached one instead of get from API Server every time. ([#81174](https://github.com/kubernetes/kubernetes/pull/81174), [@answer1991](https://github.com/answer1991))
* Improves validation errors for custom resources ([#81212](https://github.com/kubernetes/kubernetes/pull/81212), [@liggitt](https://github.com/liggitt))
* Improvement in Kube-proxy. Kube-proxy waits for some duration for the node to be defined. ([#77167](https://github.com/kubernetes/kubernetes/pull/77167), [@paulsubrata55](https://github.com/paulsubrata55))
* hyperkube will drop support for cloud-controller-manager in a future release ([#81219](https://github.com/kubernetes/kubernetes/pull/81219), [@dims](https://github.com/dims))
* added an new Prometheus counter metric "sync_proxy_rules_iptables_restore_failures_total" for kube-proxy iptables-restore failures (both ipvs and iptables modes) ([#81210](https://github.com/kubernetes/kubernetes/pull/81210), [@figo](https://github.com/figo))
* Add a `Patch` method to `ScaleInterface` ([#80699](https://github.com/kubernetes/kubernetes/pull/80699), [@knight42](https://github.com/knight42)
-->
* 修复 kubelet 节点租赁潜在的性能问题。kubelet 现在将尝试使用缓存的租约来更新租约，而不是每次都从 API Server 获取租约。见 ([#81174](https://github.com/kubernetes/kubernetes/pull/81174)、[@answer1991](https://github.com/answer1991))。
* 改进自定义资源的验证错误。([#81212](https://github.com/kubernetes/kubernetes/pull/81212)、[@liggitt](https://github.com/liggitt))。
* 改进 kube-proxy。kube-proxy 等待一段时间以定义节点。见 ([#77167](https://github.com/kubernetes/kubernetes/pull/77167)、[@paulsubrata55](https://github.com/paulsubrata55))。
* hyperkube 将在将来的版本中放弃对云控制器管理器的支持。见 ([#81219](https://github.com/kubernetes/kubernetes/pull/81219)、[@dims](https://github.com/dims))。
* 在 ipvs 和 iptables 模式，为 kube-proxy iptables-restore 故障添加了新的 Prometheus 计数器指标 "sync_proxy_rules_iptables_restore_failures_total"。见 ([#81210](https://github.com/kubernetes/kubernetes/pull/81210)、[@figo](https://github.com/figo))。
* 在 `ScaleInterface` 中添加 `Patch` 方法。见 ([#80699](https://github.com/kubernetes/kubernetes/pull/80699)、[@knight42](https://github.com/knight42))。
<!--
* switch to VM Update call in attach/detach disk operation, original CreateOrUpdate call may lead to orphaned VMs or blocked resources ([#81208](https://github.com/kubernetes/kubernetes/pull/81208), [@andyzhangx](https://github.com/andyzhangx))
* Add a azure cloud configuration `LoadBalancerName` and `LoadBalancerResourceGroup` to allow the corresponding customizations of azure load balancer. ([#81054](https://github.com/kubernetes/kubernetes/pull/81054), [@nilo19](https://github.com/nilo19))
* Update the GCE windows node image to include hot fixes since July. ([#81106](https://github.com/kubernetes/kubernetes/pull/81106), [@YangLu1031](https://github.com/YangLu1031))
* Kubelet considers all static pods as critical. Static pods pass kubelet admission even if a node does not have enough resources. Users must ensure that they account for resources when creating static pods. ([#80491](https://github.com/kubernetes/kubernetes/pull/80491), [@hpandeycodeit](https://github.com/hpandeycodeit))
-->
* 在关联或者摘除的磁盘操作中现使用 VM Update 调用，原来的 CreateOrUpdate 调用可能导致孤立的 VM 或资源阻塞。见 ([#81208](https://github.com/kubernetes/kubernetes/pull/81208)、[@andyzhangx](https://github.com/andyzhangx))。
* 添加 Azure 云配置 `LoadBalancerName` 和 `LoadBalancerResourceGroup`，用于允许对 Azure 负载均衡器进行相应的自定义。见 ([#81054](https://github.com/kubernetes/kubernetes/pull/81054)、[@nilo19](https://github.com/nilo19))。
* 更新包含自 7 月以来的修补程序的 GCE Windows 节点镜像。见 ([#81106](https://github.com/kubernetes/kubernetes/pull/81106)、[@YangLu1031](https://github.com/YangLu1031))。
* kubelet 认为所有静态 Pod 都是至关重要的。即使节点没有足够的资源，静态 Pod 也会通过 kubelet 准入准则。用户必须确保在创建静态 Pod 时占资源。见 ([#80491](https://github.com/kubernetes/kubernetes/pull/80491)、[@hpandeycodeit](https://github.com/hpandeycodeit))。
<!--
* kube-apiserver: the `--basic-auth-file` flag and authentication mode is deprecated and will be removed in a future release. It is not recommended for production environments. ([#81152](https://github.com/kubernetes/kubernetes/pull/81152), [@tedyu](https://github.com/tedyu))
* Fix a bug that pretty printer marshals empty byte or uint8 slice as null ([#81096](https://github.com/kubernetes/kubernetes/pull/81096), [@roycaihw](https://github.com/roycaihw))
* Deprecate the `--cloud-provider-gce-lb-src-cidrs` flag in the kube-apiserver. This flag will be removed once the GCE Cloud Provider is removed from kube-apiserver.  ([#81094](https://github.com/kubernetes/kubernetes/pull/81094), [@andrewsykim](https://github.com/andrewsykim))
* cloud-controller-manager binaries and docker images are no longer shipped with kubernetes releases. ([#81029](https://github.com/kubernetes/kubernetes/pull/81029), [@dims](https://github.com/dims))
* API: the metadata.selfLink field is deprecated in individual and list objects. It will no longer be returned starting in v1.20, and the field will be removed entirely in v1.21. ([#80978](https://github.com/kubernetes/kubernetes/pull/80978), [@wojtek-t](https://github.com/wojtek-t))
-->
* kube-apiserver：`--basic-auth-file` 参数和身份验证模式已弃用，在以后的版本中将被删除。所以不建议在生产环境中使用。见 ([#81152](https://github.com/kubernetes/kubernetes/pull/81152), [@tedyu](https://github.com/tedyu))。
* 修复了 printer 函数 marshals 操作时，将空字节或 uint8 切片作为 null 的错误。见 ([#81096](https://github.com/kubernetes/kubernetes/pull/81096)、[@roycaihw](https://github.com/roycaihw))。
* 弃用 kube-apiserver 中的 `--cloud-provider-gce-lb-src-cidrs` 参数。一旦从 kube-apiserver 中删除了 GCE 云提供商，该参数将被删除。见 ([#81094](https://github.com/kubernetes/kubernetes/pull/81094), [@andrewsykim](https://github.com/andrewsykim))。
* kubernetes 版本不再附带 cloud-controller-manager 二进制文件和 docker 镜像。见 ([#81029](https://github.com/kubernetes/kubernetes/pull/81029)、[@dims](https://github.com/dims))。
* API：`metadata.selfLink` 字段在单个和列表对象中已弃用。从 v1.20 开始将不再返回该字段，而在 v1.21 中将完全删除该字段。见 ([#80978](https://github.com/kubernetes/kubernetes/pull/80978)、[@wojtek-t](https://github.com/wojtek-t))。


# v1.16.0-alpha.3

<!--
[Documentation](https://docs.k8s.io)
-->
[文档](https://docs.k8s.io)

<!--
## Downloads for v1.16.0-alpha.3
-->
## 下载 v1.16.0-alpha.3


文件名 | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes.tar.gz) | `82bc119f8d1e44518ab4f4bdefb96158b1a3634c003fe1bc8dcd62410189449fbd6736126409d39a6e2d211a036b4aa98baef3b3c6d9f7505e63430847d127c2`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-src.tar.gz) | `bbf330b887a5839e3d3219f5f4aa38f1c70eab64228077f846da80395193b2b402b60030741de14a9dd4de963662cfe694f6ab04035309e54dc48e6dddd5c05d`

<!--
### Client Binaries
-->
### 客户端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-darwin-386.tar.gz) | `8d509bdc1ca62463cbb25548ec270792630f6a883f3194e5bdbbb3d6f8568b00f695e39950b7b01713f2f05f206c4d1df1959c6ee80f8a3e390eb94759d344b2`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-darwin-amd64.tar.gz) | `1b00b3a478c210e3c3e6c346f5c4f7f43a00d5ef6acb8d9c1feaf26f913b9d4f97eb6db99bbf67953ef6399abe4fbb79324973c1744a6a8cd76067cb2aeed2ca`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-linux-386.tar.gz) | `82424207b4ef52c3722436eaaf86dbe5c93c6670fd09c2b04320251028fd1bb75724b4f490b6e8b443bd8e5f892ab64612cd22206119924dafde424bdee9348a`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-linux-amd64.tar.gz) | `57ba937e58755d3b7dfd19626fedb95718f9c1d44ac1c5b4c8c46d11ba0f8783f3611c7b946b563cac9a3cf104c35ba5605e5e76b48ba2a707d787a7f50f7027`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-linux-arm.tar.gz) | `3a3601026e019b299a6f662b887ebe749f08782d7ed0d37a807c38a01c6ba19f23e2837c9fb886053ad6e236a329f58a11ee3ec4ba96a8729905ae78a7f6c58c`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-linux-arm64.tar.gz) | `4cdeb2e678c6b817a04f9f5d92c5c6df88e0f954550961813fca63af4501d04c08e3f4353dd8b6dce96e2ee197a4c688245f03c888417a436b3cf70abd4ba53a`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-linux-ppc64le.tar.gz) | `0cc7c8f7b48f5affb679352a94e42d8b4003b9ca6f8cbeaf315d2eceddd2e8446a58ba1d4a0df18e8f9c69d0d3b5a46f25b2e6a916e57975381e504d1a4daa1b`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-linux-s390x.tar.gz) | `9d8fa639f543e707dc65f24ce2f8c73a50c606ec7bc27d17840f45ac150d00b3b3f83de5e3b21f72b598acf08273e4b9a889f199f4ce1b1d239b28659e6cd131`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-windows-386.tar.gz) | `05bf6e696da680bb8feec4f411f342a9661b6165f4f0c72c069871983f199418c4d4fa1e034136bc8be41c5fecc9934a123906f2d5666c09a876db16ae8c11ad`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-client-windows-amd64.tar.gz) | `b2097bc851f5d3504e562f68161910098b46c66c726b92b092a040acda965fed01f45e7b9e513a4259c7a5ebd65d7aa3e3b711f4179139a935720d91216ef5c2`

<!--
### Server Binaries
-->
### 服务器端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-server-linux-amd64.tar.gz) | `721bd09b64e5c8f220332417089a772d9073c0dc5cdfa240984cfeb0d681b4a02620fb3ebf1b9f6a82a4dd3423f5831c259d4bad502dce87f145e0a08cb73ee9`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-server-linux-arm.tar.gz) | `e7638ce4b88b4282f0a157593cfe809fa9cc9139ea7ebae4762ef5ac1dfaa516903a8acb34a45937eb94b2699e5d4c68c639cbe40cbed2a6b97681aeace9948e`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-server-linux-arm64.tar.gz) | `395566c4be3c2ca5b07e81221b3370bc7ccbef0879f96a9384650fcaf4f699f3b2744ba1d97ae42cc6c5d9e1a65a41a793a8b0c9e01a0a65f57c56b1420f8141`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-server-linux-ppc64le.tar.gz) | `90fcba066efd76d2f271a0eb26ed4d90483674d04f5e8cc39ec1e5b7f343311f2f1c40de386f35d3c69759628a1c7c075559c09b6c4542e42fbbe0daeb61a5fa`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-server-linux-s390x.tar.gz) | `b25014bcf4138722a710451f6e58ee57588b4d47fcceeda8f6866073c1cc08641082ec56e94b0c6d586c0835ce9b55d205d254436fc22a744b24d8c74e8e5cce`

<!--
### Node Binaries
-->
### 节点可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-node-linux-amd64.tar.gz) | `6925a71096530f7114a68e755d07cb8ba714bc60b477360c85d76d7b71d3a3c0b78a650877d81aae35b308ded27c8207b5fe72d990abc43db3aa8a7d6d7f94f4`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-node-linux-arm.tar.gz) | `073310e1ccf9a8af998d4c0402ae86bee4f253d2af233b0c45cea55902268c2fe7190a41a990b079e24536e9efa27b94249c3a9236531a166ba3ac06c0f26f92`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-node-linux-arm64.tar.gz) | `c55e9aecef906e56a6003f441a7d336846edb269aed1c7a31cf834b0730508706e73ea0ae135c1604b0697c9e2582480fbfba8ba105152698c240e324da0cbd2`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-node-linux-ppc64le.tar.gz) | `e89d72d27bb0a7f9133ef7310f455ba2b4c46e9852c43e0a981b68a413bcdd18de7168eb16d93cf87a5ada6a4958592d3be80c9be1e6895fa48e2f7fa70f188d`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-node-linux-s390x.tar.gz) | `6ef8a25f2f80a806672057dc030654345e87d269babe7cf166f7443e04c0b3a9bc1928cbcf5abef1f0f0fcd37f3a727f789887dbbdae62f9d1fd90a71ed26b39`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.3/kubernetes-node-windows-amd64.tar.gz) | `22fd1cea6e0150c06dbdc7249635bbf93c4297565d5a9d13e653f9365cd61a0b8306312efc806d267c47be81621016b114510a269c622cccc916ecff4d10f33c`

<!--
## Changelog since v1.16.0-alpha.2
-->
## 自 v1.16.0-alpha.2 起的变更日志

<!--
### Action Required
-->
### 需要进行的操作

<!--
* ACTION REQUIRED: ([#80676](https://github.com/kubernetes/kubernetes/pull/80676), [@fabriziopandini](https://github.com/fabriziopandini))
    * kubeadm now deletes the bootstrap-kubelet.conf file after TLS bootstrap
    * User relying on bootstrap-kubelet.conf should switch to kubelet.conf that contains node credentials
-->
* 需要进行的操作：见 ([#80676](https://github.com/kubernetes/kubernetes/pull/80676)、[@fabriziopandini](https://github.com/fabriziopandini))。
    * TLS 引导后，kubeadm 现在将删除 bootstrap-kubelet.conf 文件
    * 依赖 bootstrap-kubelet.conf 文件的用户应切换到包含节点凭据的 kubelet.conf

<!--
### Other notable changes
-->
### 其他值得注意的变化

<!--
* Fixes validation of VolumeAttachment APIFixes validation of VolumeAttachment API objects created with inline volume sources. ([#80945](https://github.com/kubernetes/kubernetes/pull/80945), [@tedyu](https://github.com/tedyu))
* Azure disks of shared kind will no longer fail if they do not contain skuname or  ([#80837](https://github.com/kubernetes/kubernetes/pull/80837), [@rmweir](https://github.com/rmweir))
    *     storageaccounttype.
* kubeadm: fix "certificate-authority" files not being pre-loaded when using file discovery ([#80966](https://github.com/kubernetes/kubernetes/pull/80966), [@neolit123](https://github.com/neolit123))
* Errors from pod volume set up are now propagated as pod events. ([#80369](https://github.com/kubernetes/kubernetes/pull/80369), [@jsafrane](https://github.com/jsafrane))
-->
* 修复了对使用嵌入式卷源创建的 VolumeAttachment API 对象的验证。见 ([#80945](https://github.com/kubernetes/kubernetes/pull/80945)、[@tedyu](https://github.com/tedyu))。
* 如果共享类型的 Azure 磁盘不包含 skuname，则它们将不再失败。见 ([#80837](https://github.com/kubernetes/kubernetes/pull/80837)、[@rmweir](https://github.com/rmweir))。
    * 储存帐户类型。
* kubeadm：修复了使用文件发现时未预加载 “certificate-authority” 文件的问题。见 ([#80966](https://github.com/kubernetes/kubernetes/pull/80966)、[@neolit123](https://github.com/neolit123))。
* Pod 卷设置中的错误现在作为 Pod 事件传播。见 ([#80369](https://github.com/kubernetes/kubernetes/pull/80369)、[@jsafrane](https://github.com/jsafrane))。
<!--
* kubeadm: enable secure serving for the kube-scheduler ([#80951](https://github.com/kubernetes/kubernetes/pull/80951), [@neolit123](https://github.com/neolit123))
* Kubernetes client users may disable automatic compression when invoking Kubernetes APIs by setting the `DisableCompression` field on their rest.Config.  This is recommended when clients communicate primarily over high bandwidth / low latency networks where response compression does not improve end to end latency. ([#80919](https://github.com/kubernetes/kubernetes/pull/80919), [@smarterclayton](https://github.com/smarterclayton))
* kubectl get did not correctly count the number of binaryData keys when listing config maps. ([#80827](https://github.com/kubernetes/kubernetes/pull/80827), [@smarterclayton](https://github.com/smarterclayton))
* Implement "post-filter" extension point for scheduling framework ([#78097](https://github.com/kubernetes/kubernetes/pull/78097), [@draveness](https://github.com/draveness))
* Reduces GCE PD Node Attach Limits by 1 since the node boot disk is considered an attachable disk ([#80923](https://github.com/kubernetes/kubernetes/pull/80923), [@davidz627](https://github.com/davidz627))
-->
* kubeadm：为 kube-scheduler 启用安全服务。见 ([#80951](https://github.com/kubernetes/kubernetes/pull/80951)、[@neolit123](https://github.com/neolit123))。
* Kubernetes 客户端用户在调用 Kubernetes API 时可以通过在其 rest.Config 上设置 `DisableCompression` 字段来禁用自动压缩。当客户端主要通过高带宽或低延迟网络进行通信时，建议使用此方法，其中响应压缩不会改善端到端延迟。见 ([#80919](https://github.com/kubernetes/kubernetes/pull/80919)、[@smarterclayton](https://github.com/smarterclayton))。
* 列出配置映射时，kubectl get 没有正确计算 binaryData 键的数量。见 ([#80827](https://github.com/kubernetes/kubernetes/pull/80827)、[@smarterclayton](https://github.com/smarterclayton))。
* 为调度框架实现 “post-filter” 扩展点。见 ([#78097](https://github.com/kubernetes/kubernetes/pull/78097)、[@draveness](https://github.com/draveness))。
* 将 GCE PD 节点附加限制减 1，因为节点启动磁盘被视为可附加磁盘。见 ([#80923](https://github.com/kubernetes/kubernetes/pull/80923)、[@davidz627](https://github.com/davidz627))。
<!--
* This PR fixes an error when using external etcd but storing etcd certificates in the same folder and with the same name used by kubeadm for local etcd certificates; for an older version of kubeadm, the workaround is to avoid file name used by kubeadm for local etcd. ([#80867](https://github.com/kubernetes/kubernetes/pull/80867), [@fabriziopandini](https://github.com/fabriziopandini))
* When specifying `--(kube|system)-reserved-cgroup`, with `--cgroup-driver=systemd`, it is now possible to use the fully qualified cgroupfs name (i.e. `/test-cgroup.slice`). ([#78793](https://github.com/kubernetes/kubernetes/pull/78793), [@mattjmcnaughton](https://github.com/mattjmcnaughton))
* kubeadm: treat non-fatal errors as warnings when doing reset ([#80862](https://github.com/kubernetes/kubernetes/pull/80862), [@drpaneas](https://github.com/drpaneas))
* kube-addon-manager has been updated to v9.0.2 to fix a bug in leader election (https://github.com/kubernetes/kubernetes/pull/80575) ([#80861](https://github.com/kubernetes/kubernetes/pull/80861), [@mborsz](https://github.com/mborsz))
* Determine system model to get credentials for windows nodes. ([#80764](https://github.com/kubernetes/kubernetes/pull/80764), [@liyanhui1228](https://github.com/liyanhui1228))
-->
* 修复了在使用外部 etcd 时将 etcd 证书与 kubeadm 用于本地 etcd 证书的名称存储在同一文件夹中的错误；对于较旧版本的 kubeadm，解决方法是避免 kubeadm 用于本地 etcd 的文件名。见 ([#80867](https://github.com/kubernetes/kubernetes/pull/80867)、[@fabriziopandini](https://github.com/fabriziopandini))。
* 当使用 `--cgroup-driver=systemd` 指定 `--(kube|system)-reserved-cgroup` 时，现在可以使用完全限定的 cgroupfs 名称（即 `/test-cgroup.slice`）。见 ([#78793](https://github.com/kubernetes/kubernetes/pull/78793)、[@mattjmcnaughton](https://github.com/mattjmcnaughton))。
* kubeadm：重置时将非严重错误视为警告。见 ([#80862](https://github.com/kubernetes/kubernetes/pull/80862)、[@drpaneas](https://github.com/drpaneas))。
* kube-addon-manager 已更新至 v9.0.2 解决领导者选择错误。见 (https://github.com/kubernetes/kubernetes/pull/80575) ([#80861](https://github.com/kubernetes/kubernetes/pull/80861)、[@mborsz](https://github.com/mborsz))。
* 确定系统模型以获取 Windows 节点的凭据。见 ([#80764](https://github.com/kubernetes/kubernetes/pull/80764)、[@liyanhui1228](https://github.com/liyanhui1228))。
<!--
* TBD ([#80730](https://github.com/kubernetes/kubernetes/pull/80730), [@jennybuckley](https://github.com/jennybuckley))
* The `AdmissionReview` API sent to and received from admission webhooks has been promoted to `admission.k8s.io/v1`. Webhooks can specify a preference for receiving `v1` AdmissionReview objects with `admissionReviewVersions: ["v1","v1beta1"]`, and must respond with an API object in the same `apiVersion` they are sent. When webhooks use `admission.k8s.io/v1`, the following additional validation is performed on their responses: ([#80231](https://github.com/kubernetes/kubernetes/pull/80231), [@liggitt](https://github.com/liggitt))
        * `response.patch` and `response.patchType` are not permitted from validating admission webhooks
        * `apiVersion: "admission.k8s.io/v1"` is required
        * `kind: "AdmissionReview"` is required
        * `response.uid: "<value of request.uid>"` is required
        * `response.patchType: "JSONPatch"` is required (if `response.patch` is set)
-->
* TBD 见 ([#80730](https://github.com/kubernetes/kubernetes/pull/80730)、[@jennybuckley](https://github.com/jennybuckley))。
* 发送到 admission webhook 和从 admission webhook 接收到的 `AdmissionReview` API 已升级为 `admission.k8s.io/v1`。Webhooks 可以指定使用 `admissionReviewVersions: ["v1","v1beta1"]` 接收 `v1` AdmissionReview 对象的首选项，并且必须在发送它们的同一 `apiVersion` 中以 API 对象进行响应。当 Webhooks 使用 `admission.k8s.io/v1` 时，将对其响应执行以下附加验证：见 ([#80231](https://github.com/kubernetes/kubernetes/pull/80231)、[@liggitt](https://github.com/liggitt))。
        * `response.patch` 和 `response.patchType` 不允许验证 admission webhooks
        * `apiVersion: "admission.k8s.io/v1"` 是必需的
        * `kind: "AdmissionReview"` 是必需的
        * `response.uid: "<value of request.uid>"` 是必需的
        * `response.patchType: "JSONPatch"` 是必需的（前提是设置了 `response.patch`）
<!--
* "kubeadm join" fails if file-based discovery is too long, with a default timeout of 5 minutes. ([#80804](https://github.com/kubernetes/kubernetes/pull/80804), [@olivierlemasle](https://github.com/olivierlemasle))
* enhance Azure cloud provider code to support both AAD and ADFS authentication. ([#80841](https://github.com/kubernetes/kubernetes/pull/80841), [@rjaini](https://github.com/rjaini))
* Attempt to set the kubelet's hostname & internal IP if `--cloud-provider=external` and no node addresses exists ([#75229](https://github.com/kubernetes/kubernetes/pull/75229), [@andrewsykim](https://github.com/andrewsykim))
* kubeadm: avoid double deletion of the upgrade prepull DaemonSet ([#80798](https://github.com/kubernetes/kubernetes/pull/80798), [@xlgao-zju](https://github.com/xlgao-zju))
* Fixes problems with connecting to services on localhost on some systems; in particular, DNS queries to systemd-resolved on Ubuntu. ([#80591](https://github.com/kubernetes/kubernetes/pull/80591), [@danwinship](https://github.com/danwinship))
-->
* 如果基于文件的发现时间过长，“kubeadm join” 将会失败，默认超时为 5 分钟。见 ([#80804](https://github.com/kubernetes/kubernetes/pull/80804)、[@olivierlemasle](https://github.com/olivierlemasle))。
* 增强 Azure 云提供商相关代码以支持 AAD 和 ADFS 身份验证。见 ([#80841](https://github.com/kubernetes/kubernetes/pull/80841)、[@rjaini](https://github.com/rjaini))。
* 如果 `--cloud-provider=external` 并且不存在节点地址，则尝试设置 kubelet 的主机名和内部 IP。见 ([#75229](https://github.com/kubernetes/kubernetes/pull/75229)、[@andrewsykim](https://github.com/andrewsykim))。
* kubeadm：升级提前拉取 DaemonSet 时，避免两次删除操作。见 ([#80798](https://github.com/kubernetes/kubernetes/pull/80798)、[@xlgao-zju](https://github.com/xlgao-zju))。
* 修复了在某些系统上连接到 localhost 上的服务的问题；特别是在 Ubuntu 上对 systemd 解析的 DNS 查询。见 ([#80591](https://github.com/kubernetes/kubernetes/pull/80591)、[@danwinship](https://github.com/danwinship))。
<!--
* Implement normalize plugin extension point for the scheduler framework. ([#80383](https://github.com/kubernetes/kubernetes/pull/80383), [@liu-cong](https://github.com/liu-cong))
* Fixed the bash completion error with override flags. ([#80802](https://github.com/kubernetes/kubernetes/pull/80802), [@dtaniwaki](https://github.com/dtaniwaki))
* Fix CVE-2019-11247: API server allows access to custom resources via wrong scope ([#80750](https://github.com/kubernetes/kubernetes/pull/80750), [@sttts](https://github.com/sttts))
* Failed iscsi logout is now re-tried periodically. ([#78941](https://github.com/kubernetes/kubernetes/pull/78941), [@jsafrane](https://github.com/jsafrane))
* Fix public IP not found issues for VMSS nodes ([#80703](https://github.com/kubernetes/kubernetes/pull/80703), [@feiskyer](https://github.com/feiskyer))
-->
* 为调度程序框架实现规范化插件扩展点。见 ([#80383](https://github.com/kubernetes/kubernetes/pull/80383)、[@liu-cong](https://github.com/liu-cong))。
* 使用覆盖参数修复 bash 自动完成错误。见 ([#80802](https://github.com/kubernetes/kubernetes/pull/80802)、[@dtaniwaki](https://github.com/dtaniwaki))。
* Fix CVE-2019-11247: API server allows access to custom resources via wrong scope ([#80750](https://github.com/kubernetes/kubernetes/pull/80750), [@sttts](https://github.com/sttts))
* 现在，会定期重试失败的 iscsi 注销。见 ([#78941](https://github.com/kubernetes/kubernetes/pull/78941)、[@jsafrane](https://github.com/jsafrane))。
* 修复 VMSS 节点未找到公共 IP 的问题。见 ([#80703](https://github.com/kubernetes/kubernetes/pull/80703)、[@feiskyer](https://github.com/feiskyer))。
<!--
* In order to enable dual-stack support within kubeadm and kubernetes components, as part of the init config file, the user should set feature-gate IPv6DualStack=true in the ClusterConfiguration. Additionally, for each worker node, the user should set the feature-gate for kubelet using either nodeRegistration.kubeletExtraArgs or  KUBELET_EXTRA_ARGS. ([#80531](https://github.com/kubernetes/kubernetes/pull/80531), [@Arvinderpal](https://github.com/Arvinderpal))
* Fix error in `kubeadm join --discovery-file` when using discovery files with embedded credentials ([#80675](https://github.com/kubernetes/kubernetes/pull/80675), [@fabriziopandini](https://github.com/fabriziopandini))
-->
* 为了在 kubeadm 和 kubernetes 组件中启用双栈支持，作为 init config file 的一步，用户应在 ClusterConfiguration 中设置 `IPv6DualStack=true`。此外，对于每个工作节点，用户应使用 `nodeRegistration.kubeletExtraArgs` 或 `KUBELET_EXTRA_ARGS` 设置 kubelet 的特性开关功能。见 ([#80531](https://github.com/kubernetes/kubernetes/pull/80531), [@Arvinderpal](https://github.com/Arvinderpal))。
* 当使用具有嵌入式凭据的发现文件时，修复 `kubeadm join --discovery-file` 操作中的错误。见 ([#80675](https://github.com/kubernetes/kubernetes/pull/80675)、[@fabriziopandini](https://github.com/fabriziopandini))。



# v1.16.0-alpha.2

<!--
[Documentation](https://docs.k8s.io)
-->
[文档](https://docs.k8s.io)

<!--
## Downloads for v1.16.0-alpha.2
filename | sha512 hash
文件名 | sha512 hash
-->
## 下载 v1.16.0-alpha.2


文件名 | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes.tar.gz) | `7dfa3f8b9e98e528e2b49ed9cca5e95f265b9e102faac636ff0c29e045689145be236b98406a62eb0385154dc0c1233cac049806c99c9e46590cad5aa729183f`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-src.tar.gz) | `7cf14b92c96cab5fcda3115ec66b44562ca26ea6aa46bc7fa614fa66bda1bdf9ac1f3c94ef0dfa0e37c992c7187ecf4205b253f37f280857e88a318f8479c9a9`

<!--
### Client Binaries
-->
### 客户端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-darwin-386.tar.gz) | `4871756de2cd1add0b07ec1e577c500d18a59e2f761595b939e1d4e10fbe0a119479ecaaf53d75cb2138363deae23cc88cba24fe3018cec6a27a3182f37cae92`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-darwin-amd64.tar.gz) | `dbd9ca5fd90652ffc1606f50029d711eb52d34b707b7c04f29201f85aa8a5081923a53585513634f3adb6ace2bc59be9d4ad2abc49fdc3790ef805378c111e68`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-linux-386.tar.gz) | `6b049098b1dc65416c5dcc30346b82e5cf69a1cdd7e7b065429a76d302ef4b2a1c8e2dc621e9d5c1a6395a1fbd97f196d99404810880d118576e7b94e5621e4c`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-linux-amd64.tar.gz) | `7240a9d49e445e9fb0c9d360a9287933c6c6e7d81d6e11b0d645d3f9b6f3f1372cc343f03d10026518df5d6c95525e84c41b06a034c9ec2c9e306323dbd9325b`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-linux-arm.tar.gz) | `947b0d9aeeef08961c0582b4c3c94b7ae1016d20b0c9f50af5fe760b3573f17497059511bcb57ac971a5bdadeb5c77dfd639d5745042ecc67541dd702ee7c657`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-linux-arm64.tar.gz) | `aff0258a223f5061552d340cda36872e3cd7017368117bbb14dc0f8a3a4db8c715c11743bedd72189cd43082aa9ac1ced64a6337c2f174bdcbeef094b47e76b0`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-linux-ppc64le.tar.gz) | `3eabecd62290ae8d876ae45333777b2c9959e39461197dbe90e6ba07d0a4c50328cbdf44e77d2bd626e435ffc69593d0e8b807b36601c19dd1a1ef17e6810b4f`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-linux-s390x.tar.gz) | `6651b2d95d0a8dd748c33c9e8018ab606b4061956cc2b6775bd0b008b04ea33df27be819ce6c391ceb2191b53acbbc088d602ed2d86bdd7a3a3fc1c8f876798a`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-windows-386.tar.gz) | `4b6c11b7a318e5fcac19144f6ab1638126c299e08c7b908495591674abcf4c7dd16f63c74c7d901beff24006150d2a31e0f75e28a9e14d6d0d88a09dafb014f0`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-client-windows-amd64.tar.gz) | `760ae08da6045ae7089fb27a9324e77bed907662659364857e1a8d103d19ba50e80544d8c21a086738b15baebfd9a5fa78d63638eff7bbe725436c054ba649cc`

<!--
### Server Binaries
-->
### 服务器端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-server-linux-amd64.tar.gz) | `69db41f3d79aa0581c36a3736ab8dc96c92127b82d3cf25c5effc675758fe713ca7aa7e5b414914f1bc73187c6cee5f76d76b74a2ee1c0e7fa61557328f1b8ef`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-server-linux-arm.tar.gz) | `ca302f53ee91ab4feb697bb34d360d0872a7abea59c5f28cceefe9237a914c77d68722b85743998ab12bf8e42005e63a1d1a441859c2426c1a8d745dd33f4276`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-server-linux-arm64.tar.gz) | `79ab1f0a542ce576ea6d81cd2a7c068da6674177b72f1b5f5e3ca47edfdb228f533683a073857b6bc53225a230d15d3ba4b0cb9b6d5d78a309aa6e24c2f6c500`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-server-linux-ppc64le.tar.gz) | `fbe5b45326f1d03bcdd9ffd46ab454917d79f629ba23dae9d667d0c7741bc2f5db2960bf3c989bb75c19c9dc1609dacbb8a6dc9a440e5b192648e70db7f68721`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-server-linux-s390x.tar.gz) | `eb13ac306793679a3a489136bb7eb6588472688b2bb2aa0e54e61647d8c9da6d3589c19e7ac434c24defa78cb65f7b72593eedec1e7431c7ecae872298efc4de`

<!--
### Node Binaries
-->
### 节点可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-node-linux-amd64.tar.gz) | `a4bde88f3e0f6233d04f04d380d5f612cd3c574bd66b9f3ee531fa76e3e0f1c6597edbc9fa61251a377e8230bce0ce6dc1cf57fd19080bb7d13f14a391b27fe8`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-node-linux-arm.tar.gz) | `7d72aa8c1d883b9f047e5b98dbb662bdfd314f9c06af4213068381ffaac116e68d1aad76327ead7a4fd97976ea72277cebcf765c56b265334cb3a02c83972ec1`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-node-linux-arm64.tar.gz) | `c9380bb59ba26dcfe1ab52b5cb02e2d920313defda09ec7d19ccbc18f54def4b57cf941ac8a397392beb5836fdc12bc9600d4055f2cfd1319896cfc9631cab10`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-node-linux-ppc64le.tar.gz) | `7bcd79b368a62c24465fce7dcb024bb629eae034e09fb522fb43bb5798478ca2660a3ccc596b424325c6f69e675468900f3b41f3924e7ff453e3db40150b3c16`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-node-linux-s390x.tar.gz) | `9bda9dd24ee5ca65aaefece4213b46ef57cde4904542d94e6147542e42766f8b80fe24d99a6b8711bd7dbe00c415169a9f258f433c5f5345c2e17c2bb82f2670`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.2/kubernetes-node-windows-amd64.tar.gz) | `d5906f229d2d8e99bdb37e7d155d54560b82ea28ce881c5a0cde8f8d20bff8fd2e82ea4b289ae3e58616d3ec8c23ac9b473cb714892a377feb87ecbce156147d`

<!--
## Changelog since v1.16.0-alpha.1
-->
## 自 v1.16.0-alpha.1 起的变更日志

<!--
### Action Required
-->
### 需要进行的操作

<!--
* Revert "scheduler.alpha.kubernetes.io/critical-pod annotation is removed. Pod priority (spec.priorityClassName) should be used instead to mark pods as critical. Action required!" ([#80277](https://github.com/kubernetes/kubernetes/pull/80277), [@draveness](https://github.com/draveness))
* ACTION REQUIRED: container images tar files for 'amd64' will now contain the architecture in the RepoTags manifest.json section. ([#80266](https://github.com/kubernetes/kubernetes/pull/80266), [@javier-b-perez](https://github.com/javier-b-perez))
    * If you are using docker manifests there are not visible changes.
-->
* 删除了 "scheduler.alpha.kubernetes.io/critical-pod" 注解。应使用 Pod priority（spec.priorityClassName）将 Pod 标记为关键。这是必须要进行的操作。见 ([#80277](https://github.com/kubernetes/kubernetes/pull/80277)、[@draveness](https://github.com/draveness))。
* 必须要进行的操作：`amd64` 的容器镜像 tar 文件现在将在 manifest.json 的 RepoTags 节中给出体系结构。见 ([#80266](https://github.com/kubernetes/kubernetes/pull/80266)、[@javier-b-perez](https://github.com/javier-b-perez))。
    * 如果你正在使用 Docker 清单，则此变更对你没有影响。
<!--
### Other notable changes
-->
### 其他值得注意的变化

<!--
* Use HTTPS as etcd-apiserver protocol when mTLS between etcd and kube-apiserver on master is enabled, change etcd metrics/health port to 2382. ([#77561](https://github.com/kubernetes/kubernetes/pull/77561), [@wenjiaswe](https://github.com/wenjiaswe))
* kubelet: change node-lease-renew-interval to 0.25 of lease-renew-duration ([#80429](https://github.com/kubernetes/kubernetes/pull/80429), [@gaorong](https://github.com/gaorong))
* Fix error handling and potential go null pointer exception in kubeadm upgrade diff ([#80648](https://github.com/kubernetes/kubernetes/pull/80648), [@odinuge](https://github.com/odinuge))
* New flag --endpoint-updates-batch-period in kube-controller-manager can be used to reduce number of endpoints updates generated by pod changes. ([#80509](https://github.com/kubernetes/kubernetes/pull/80509), [@mborsz](https://github.com/mborsz))
-->
* 启用 master 的 etcd 和 kube-apiserver 之间的 mTLS 时，将 HTTPS 用作 etcd-apiserver 协议，将 etcd 指标或运行状况端口更改为 2382。见 ([#77561](https://github.com/kubernetes/kubernetes/pull/77561)、[@wenjiaswe](https://github.com/wenjiaswe))。
* kubelet：将 `node-lease-renew-interval` 更改为 0.25 的续租期限。见 ([#80429](https://github.com/kubernetes/kubernetes/pull/80429)、[@gaorong](https://github.com/gaorong))。
* 修复 kubeadm upgrade diff 命令中的错误处理和潜在的空指针异常。见 ([#80648](https://github.com/kubernetes/kubernetes/pull/80648)、[@odinuge](https://github.com/odinuge))。
* kube-controller-manager 中的新参数 `--endpoint-updates-batch-period` 可用于减少由 Pod 更改生成的端点更新的数量。见 ([#80509](https://github.com/kubernetes/kubernetes/pull/80509)、[@mborsz](https://github.com/mborsz))。
<!--
* kubeadm: produce errors if they occur when resetting cluster status for a control-plane node ([#80573](https://github.com/kubernetes/kubernetes/pull/80573), [@bart0sh](https://github.com/bart0sh))
* When a load balancer type service is created in a k8s cluster that is backed by Azure Standard Load Balancer, the corresponding load balancer rule added in the Azure Standard Load Balancer would now have the "EnableTcpReset" property set to true.  ([#80624](https://github.com/kubernetes/kubernetes/pull/80624), [@xuto2](https://github.com/xuto2))
* Update portworx plugin dependency on libopenstorage/openstorage to v1.0.0 ([#80495](https://github.com/kubernetes/kubernetes/pull/80495), [@adityadani](https://github.com/adityadani))
* Fixed detachment of deleted volumes on OpenStack / Cinder. ([#80518](https://github.com/kubernetes/kubernetes/pull/80518), [@jsafrane](https://github.com/jsafrane))
* when PodInfoOnMount is enabled for a CSI driver, the new csi.storage.k8s.io/ephemeral parameter in the volume context allows a driver's NodePublishVolume implementation to determine on a case-by-case basis whether the volume is ephemeral or a normal persistent volume ([#79983](https://github.com/kubernetes/kubernetes/pull/79983), [@pohly](https://github.com/pohly))
-->
* kubeadm：如果在重置控制平面节点的集群状态时发生错误，则会产生错误。见 ([#80573](https://github.com/kubernetes/kubernetes/pull/80573)、[@bart0sh](https://github.com/bart0sh))。
*由 Azure 标准负载均衡器支持的 k8s 集群中创建负载均衡器类型服务时，在 Azure 标准负载均衡器中添加的相应负载均衡器规则现在会将 “EnableTcpReset” 属性设置为 true。见 ([#80624](https://github.com/kubernetes/kubernetes/pull/80624)、[@xuto2](https://github.com/xuto2))。
* portworx 插件已在 libopenstorage/openstorage 上更新为 v1.0.0。见 ([#80495](https://github.com/kubernetes/kubernetes/pull/80495)、[@adityadani](https://github.com/adityadani))。
* 修复了在 OpenStack 或 Cinder 上分离已删除卷的问题。见 ([#80518](https://github.com/kubernetes/kubernetes/pull/80518)、[@jsafrane](https://github.com/jsafrane))。
* 当为 CSI 驱动启用 PodInfoOnMount 时，Volume（卷）上下文中新的 csi.storage.k8s.io/ephemeral 参数允许驱动程序的 NodePublishVolume 实现根据具体情况确定该卷是临时性的还是正常的持久卷。见 ([#79983](https://github.com/kubernetes/kubernetes/pull/79983)、[@pohly](https://github.com/pohly))。
<!--
* Update gogo/protobuf to serialize backward, as to get better performance on deep objects. ([#77355](https://github.com/kubernetes/kubernetes/pull/77355), [@apelisse](https://github.com/apelisse))
* Remove GetReference() and GetPartialReference() function from pkg/api/ref, as the same function exists also in staging/src/k8s.io/client-go/tools/ref ([#80361](https://github.com/kubernetes/kubernetes/pull/80361), [@wojtek-t](https://github.com/wojtek-t))
* Fixed a bug in the CSI metrics that does not return not supported error when a CSI driver does not support metrics. ([#79851](https://github.com/kubernetes/kubernetes/pull/79851), [@jparklab](https://github.com/jparklab))
* Fixed a bug in kube-addon-manager's leader election logic that made all replicas active. ([#80575](https://github.com/kubernetes/kubernetes/pull/80575), [@mborsz](https://github.com/mborsz))
* Kibana has been slightly revamped/improved in the latest version ([#80421](https://github.com/kubernetes/kubernetes/pull/80421), [@lostick](https://github.com/lostick))
* kubeadm: fixed ignoring errors when pulling control plane images ([#80529](https://github.com/kubernetes/kubernetes/pull/80529), [@bart0sh](https://github.com/bart0sh))
-->
* 更新 gogo 下的 protobuf 以便向后序列化，用于提升深层对象上的性能。见 ([#77355](https://github.com/kubernetes/kubernetes/pull/77355)、[@apelisse](https://github.com/apelisse))。
* 从 `pkg/api/ref` 中删除 `GetReference()` 和 `GetPartialReference()` 函数，因为在 `staging/src/k8s.io/client-go/tools/ref` 中也存在相同的函数。见 ([#80361](https://github.com/kubernetes/kubernetes/pull/80361)、[@wojtek-t](https://github.com/wojtek-t))。
* 修复了 CSI 指标中的错误，即当 CSI 驱动程序不支持指标时，指标不会返回不支持的错误。见 ([#79851](https://github.com/kubernetes/kubernetes/pull/79851)、[@jparklab](https://github.com/jparklab))。
* 修复了 kube-addon-manager 的领导者选举逻辑中的一个错误，该错误使所有副本均处于活跃状态。见 ([#80575](https://github.com/kubernetes/kubernetes/pull/80575)、[@mborsz](https://github.com/mborsz))。
* Kibana 已在最新版本中进行了稍微的修改或改进。见 ([#80421](https://github.com/kubernetes/kubernetes/pull/80421)、[@lostick](https://github.com/lostick))。
* kubeadm：修复了拉取控制平面镜像时忽略错误的问题。见 ([#80529](https://github.com/kubernetes/kubernetes/pull/80529)、[@bart0sh](https://github.com/bart0sh))。
<!--
* CRDs under k8s.io and kubernetes.io must have the "api-approved.kubernetes.io" set to either `unapproved.*` or a link to the pull request approving the schema.  See https://github.com/kubernetes/enhancements/pull/1111 for more details. ([#79992](https://github.com/kubernetes/kubernetes/pull/79992), [@deads2k](https://github.com/deads2k))
* Reduce kube-proxy cpu usage in IPVS mode when a large number of nodePort services exist. ([#79444](https://github.com/kubernetes/kubernetes/pull/79444), [@cezarsa](https://github.com/cezarsa))
* Add CSI Migration Shim for VerifyVolumesAreAttached and BulkVolumeVerify ([#80443](https://github.com/kubernetes/kubernetes/pull/80443), [@davidz627](https://github.com/davidz627))
* Fix a bug that causes DaemonSet rolling update hang when there exist failed pods.  ([#78170](https://github.com/kubernetes/kubernetes/pull/78170), [@DaiHao](https://github.com/DaiHao))
-->
* k8s.io 和 kubernetes.io 下的 CRD 必须将 `api-approved.kubernetes.io` 设置为 `unapproved.*` 或指向批准该模式下的拉取请求的链接。有关更多详细信息，请参见 https://github.com/kubernetes/enhancements/pull/1111。见 ([#79992](https://github.com/kubernetes/kubernetes/pull/79992)、[@deads2k](https://github.com/deads2k))。
* 当存在大量 nodePort 服务时，减少 IPVS 模式下的 kube-proxy CPU 使用率。见 ([#79444](https://github.com/kubernetes/kubernetes/pull/79444)、[@cezarsa](https://github.com/cezarsa))。
* 为 VerifyVolumesAreAttached 和 BulkVolumeVerify 添加 CSI 迁移铺垫。见 ([#80443](https://github.com/kubernetes/kubernetes/pull/80443)、[@davidz627](https://github.com/davidz627))。
* 修复了当存在失败的 Pod 时导致 DaemonSet 滚动更新挂起的错误。见 ([#78170](https://github.com/kubernetes/kubernetes/pull/78170)、[@DaiHao](https://github.com/DaiHao))。
<!--
* Fix retry issues when the nodes are under deleting on Azure ([#80419](https://github.com/kubernetes/kubernetes/pull/80419), [@feiskyer](https://github.com/feiskyer))
* Add support for AWS EBS on windows ([#79552](https://github.com/kubernetes/kubernetes/pull/79552), [@wongma7](https://github.com/wongma7))
* Passing an invalid policy name in the `--cpu-manager-policy` flag will now cause the kubelet to fail instead of simply ignoring the flag and running the `cpumanager`s default policy instead. ([#80294](https://github.com/kubernetes/kubernetes/pull/80294), [@klueska](https://github.com/klueska))
* Add Filter extension point to the scheduling framework. ([#78477](https://github.com/kubernetes/kubernetes/pull/78477), [@YoubingLi](https://github.com/YoubingLi))
* cpuUsageNanoCores is now reported in the Kubelet summary API on Windows nodes ([#80176](https://github.com/kubernetes/kubernetes/pull/80176), [@liyanhui1228](https://github.com/liyanhui1228))
* `[]TopologySpreadConstraint` is introduced into PodSpec to support the "Even Pods Spread" alpha feature. ([#77327](https://github.com/kubernetes/kubernetes/pull/77327), [@Huang-Wei](https://github.com/Huang-Wei))
-->
* 修复了在 Azure 上删除节点时的重试问题。见 ([#80419](https://github.com/kubernetes/kubernetes/pull/80419)、[@feiskyer](https://github.com/feiskyer))。
* 在 Windows 上添加对 AWS EBS 的支持。见 ([#79552](https://github.com/kubernetes/kubernetes/pull/79552)、[@wongma7](https://github.com/wongma7))。
* 现在，在 `--cpu-manager-policy` 参数中传递无效的策略名称将导致 kubelet 失败，而不是简单地忽略该参数并运行 `cpumanager` 的默认策略。见 ([#80294](https://github.com/kubernetes/kubernetes/pull/80294)、[@klueska](https://github.com/klueska))。
* 将过滤器扩展点添加到调度框架。见 ([#78477](https://github.com/kubernetes/kubernetes/pull/78477)、[@YoubingLi](https://github.com/YoubingLi))。
* 现在，在 Windows 节点上的 kubelet 摘要 API 中报告了 cpuUsageNanoCores。见 ([#80176](https://github.com/kubernetes/kubernetes/pull/80176)、@liyanhui1228](https://github.com/liyanhui1228))。
* PodSpec 中引入了 `[]TopologySpreadConstraint`，以支持 “Even Pods Spread” alpha 功能。见 ([#77327](https://github.com/kubernetes/kubernetes/pull/77327)、[@Huang-Wei](https://github.com/Huang-Wei))。
<!--
* kubeadm: fall back to client version in case of certain HTTP errors ([#80024](https://github.com/kubernetes/kubernetes/pull/80024), [@RainbowMango](https://github.com/RainbowMango))
* NFS Drivers are now enabled to collect metrics, StatFS metrics provider is used to collect the metrics. ([#75805](https://github.com/kubernetes/kubernetes/pull/75805) , [@brahmaroutu](https://github.com/brahmaroutu)) ([#75805](https://github.com/kubernetes/kubernetes/pull/75805), [@brahmaroutu](https://github.com/brahmaroutu))
* make node lease renew interval more heuristic based on node-status-update-frequency in kubelet ([#80173](https://github.com/kubernetes/kubernetes/pull/80173), [@gaorong](https://github.com/gaorong))
* Introduction of the pod overhead feature to the scheduler.  This functionality is alpha-level as of  ([#78319](https://github.com/kubernetes/kubernetes/pull/78319), [@egernst](https://github.com/egernst))
    * Kubernetes v1.16, and is only honored by servers that enable the PodOverhead feature.gate.
-->
* kubeadm：在某些 HTTP 错误的情况下回退到客户端版本。见 ([#80024](https://github.com/kubernetes/kubernetes/pull/80024)、[@RainbowMango](https://github.com/RainbowMango))。
* 现在已启用 NFS 驱动程序来收集指标,StatFS 指标提供程序用于收集指标。见 ([#75805](https://github.com/kubernetes/kubernetes/pull/75805)、[@brahmaroutu](https://github.com/brahmaroutu))。
* 根据 kubelet 中的节点状态更新频率使节点租约更新间隔更具启发性。见 ([#80173](https://github.com/kubernetes/kubernetes/pull/80173)、[@gaorong](https://github.com/gaorong))。
* 将 Pod 开销功能引入调度程序，此功能为 alpha 级别。见 ([#78319](https://github.com/kubernetes/kubernetes/pull/78319)、[@egernst](https://github.com/egernst))。
    * 从 Kubernetes v1.16 开始，只有启用 PodOverhead 特性开关的服务器才能使用该功能。
<!--
* N/A ([#80260](https://github.com/kubernetes/kubernetes/pull/80260), [@khenidak](https://github.com/khenidak))
* Add v1.Container.SecurityContext.WindowsOptions.RunAsUserName to the pod spec  ([#79489](https://github.com/kubernetes/kubernetes/pull/79489), [@bclau](https://github.com/bclau))
* Pass-through volume MountOptions to global mount (NodeStageVolume) on the node for CSI ([#80191](https://github.com/kubernetes/kubernetes/pull/80191), [@davidz627](https://github.com/davidz627))
* Add Score extension point to the scheduling framework. ([#79109](https://github.com/kubernetes/kubernetes/pull/79109), [@ahg-g](https://github.com/ahg-g))
-->
* N/A 见([#80260](https://github.com/kubernetes/kubernetes/pull/80260)、[@khenidak](https://github.com/khenidak))。
* 将 v1.Container.SecurityContext.WindowsOptions.RunAsUserName 添加到 Pod 规范中。([#79489](https://github.com/kubernetes/kubernetes/pull/79489)、[@bclau](https://github.com/bclau))。
* 将卷 MountOptions 传递到 CSI 节点上的全局挂载点（NodeStageVolume）。见 ([#80191](https://github.com/kubernetes/kubernetes/pull/80191)、[@davidz627](https://github.com/davidz627))。
* 将 Score 扩展点添加到调度框架。见 ([#79109](https://github.com/kubernetes/kubernetes/pull/79109)、[@ahg-g](https://github.com/ahg-g))。


# v1.16.0-alpha.1

<!--
[Documentation](https://docs.k8s.io)
-->
[文档](https://docs.k8s.io)

<!--
## Downloads for v1.16.0-alpha.1
-->
## 下载 v1.16.0-alpha.1

文件名 | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes.tar.gz) | `4834c52267414000fa93c0626bded5a969cf65d3d4681c20e5ae2c5f62002a51dfb8ee869484f141b147990915ba57be96108227f86c4e9f571b4b25e7ed0773`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-src.tar.gz) | `9329d51f5c73f830f3c895c2601bc78e51d2d412b928c9dae902e9ba8d46338f246a79329a27e4248ec81410ff103510ba9b605bb03e08a48414b2935d2c164b`

<!--
### Client Binaries
-->
### 客户端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-darwin-386.tar.gz) | `3cedffb92a0fca4f0b2d41f8b09baa59dff58df96446e8eece4e1b81022d9fdda8da41b5f73a3468435474721f03cffc6e7beabb25216b089a991b68366c73bc`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-darwin-amd64.tar.gz) | `14de6bb296b4d022f50778b160c98db3508c9c7230946e2af4eb2a1d662d45b86690e9e04bf3e592ec094e12bed1f2bb74cd59d769a0eaac3c81d9b80e0a79c8`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-linux-386.tar.gz) | `8b2b9fa55890895239b99fabb866babe50aca599591db1ecf9429e49925ae478b7c813b9d7704a20f41f2d50947c3b3deecb594544f1f3eae6c4e97ae9bb9b70`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-linux-amd64.tar.gz) | `e927ac7b314777267b95e0871dd70c352ec0fc967ba221cb6cba523fa6f18d9d193e4ce92a1f9fa669f9c961de0e34d69e770ef745199ed3693647dd0d692e57`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-linux-arm.tar.gz) | `4a230a6d34e2ffd7df40c5b726fbcbb7ef1373d81733bfb75685b2448ed181eb49ef27668fc33700f30de88e5bbdcc1e52649b9d31c7940760f48c6e6eb2f403`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-linux-arm64.tar.gz) | `87c8d7185df23b3496ceb74606558d895a64daf0c41185c833a233e29216131baac6e356a57bb78293ed9d0396966ecc3b00789f2b66af352dc286b101bcc69a`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-linux-ppc64le.tar.gz) | `16ea5efa2fc29bc7448a609a7118e7994e901ab26462aac52f03b4851d4c9d103ee12d2335360f8aa503ddbb2a71f3000f0fcb33597dd813df4f5ad5f4819fa9`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-linux-s390x.tar.gz) | `7390ad1682227a70550b20425fa5287fecf6a5d413493b03df3a7795614263e7883f30f3078bbb9fbd389d2a1dab073f8f401be89b82bd5861fa6b0aeda579eb`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-windows-386.tar.gz) | `88251896dfe38e59699b879f643704c0195e7a5af2cb00078886545f49364a2e3b497590781f135b80d60e256bad3a4ea197211f4f061c98dee096f0845e7a9b`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-client-windows-amd64.tar.gz) | `766b2a9bf097e45b2549536682cf25129110bd0562ab0df70e841ff8657dd7033119b0929e7a213454f90594b19b90fa57d89918cee33ceadba7d689449fe333`

<!--
### Server Binaries
-->
### 服务器端可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-server-linux-amd64.tar.gz) | `dfd5c2609990c9b9b94249c654931b240dc072f2cc303e1e1d6dec1fddfb0a9e127e3898421ace00ab1947a3ad2f87cfd1266fd0b6193ef00f942269388ef372`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-server-linux-arm.tar.gz) | `7704c2d3c57950f184322263ac2be1649a0d737d176e7fed1897031d0efb8375805b5f12c7cf9ba87ac06ad8a635d6e399382d99f3cbb418961a4f0901465f50`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-server-linux-arm64.tar.gz) | `fbbd87cc38cfb6429e3741bfd87ecec4b69b551df6fb7c121900ced4c1cd0bc77a317ca8abd41f71ffd7bc0b1c7144fecb22fa405d0b211b238df24d28599333`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-server-linux-ppc64le.tar.gz) | `cfed5b936eb2fe44df5d0c9c6484bee38ef370fb1258522e8c62fb6a526e9440c1dc768d8bf33403451ae00519cab1450444da854fd6c6a37665ce925c4e7d69`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-server-linux-s390x.tar.gz) | `317681141734347260ad9f918fa4b67e48751f5a7df64a848d2a83c79a4e9dba269c51804b09444463ba88a2c0efa1c307795cd8f06ed840964eb2c725a4ecc3`

<!--
### Node Binaries
-->
### 节点可执行文件

文件名 | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-node-linux-amd64.tar.gz) | `b3b1013453d35251b8fc4759f6ac26bdeb37f14a98697078535f7f902e8ebca581b5629bbb4493188a7e6077eb5afc61cf275f42bf4d9f503b70bfc58b9730b2`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-node-linux-arm.tar.gz) | `0bacc1791d260d2863ab768b48daf66f0f7f89eeee70e68dd515b05fc9d7f14b466382fe16fa84a103e0023324f681767489d9485560baf9eb80fe0e7ffab503`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-node-linux-arm64.tar.gz) | `73bd70cb9d27ce424828a95d715c16fd9dd22396dbe1dfe721eb0aea9e186ec46e6978956613b0978a8da3c22df39790739b038991c0192281881fce41d7c9f1`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-node-linux-ppc64le.tar.gz) | `a865f98838143dc7e1e12d1e258e5f5f2855fcf6e88488fb164ad62cf886d8e2a47fdf186ad6b55172f73826ae19da9b2642b9a0df0fa08f9351a66aeef3cf17`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-node-linux-s390x.tar.gz) | `d2f9f746ed0fe00be982a847a3ae1b6a698d5c506be1d3171156902140fec64642ec6d99aa68de08bdc7d65c9a35ac2c36bda53c4db873cb8e7edc419a4ab958`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.16.0-alpha.1/kubernetes-node-windows-amd64.tar.gz) | `37f48a6d8174f38668bc41c81222615942bfe07e01f319bdfed409f83a3de3773dceb09fd86330018bb05f830e165e7bd85b3d23d26a50227895e4ec07f8ab98`

<!--
## Changelog since v1.15.0
-->
## 自 v1.15.0起的变更日志

<!--
### Action Required
-->
### 需要进行的操作

<!--
* Migrate scheduler to use v1beta1 Event API. action required: any tool targeting scheduler events needs to use v1beta1 Event API ([#78447](https://github.com/kubernetes/kubernetes/pull/78447), [@yastij](https://github.com/yastij))
* scheduler.alpha.kubernetes.io/critical-pod annotation is removed. Pod priority (spec.priorityClassName) should be used instead to mark pods as critical. Action required! ([#79554](https://github.com/kubernetes/kubernetes/pull/79554), [@draveness](https://github.com/draveness))
* hyperkube: the `--make-symlinks` flag, deprecated in v1.14, has been removed. ([#80017](https://github.com/kubernetes/kubernetes/pull/80017), [@Pothulapati](https://github.com/Pothulapati))
-->
* 调度程序开始使用 v1beta1 Event API。任何针对调度程序事件的工具都需要使用 v1beta1 事件 API。见 ([#78447](https://github.com/kubernetes/kubernetes/pull/78447)、[@yastij](https://github.com/yastij))。
* 删除了 scheduler.alpha.kubernetes.io/critical-pod 注解。应使用 Pod priority（spec.priorityClassName）将 Pod 标记为关键。这是必须要进行的操作。见 ([#80342](https://github.com/kubernetes/kubernetes/pull/80342)、[@draveness](https://github.com/draveness))。
* hyperkube：v1.14 中弃用的 `--make-symlinks` 参数已被删除。见 ([#80017](https://github.com/kubernetes/kubernetes/pull/80017)、[@Pothulapati](https://github.com/Pothulapati))。
<!--
* Node labels `beta.kubernetes.io/metadata-proxy-ready`, `beta.kubernetes.io/metadata-proxy-ready` and `beta.kubernetes.io/kube-proxy-ds-ready` are no longer added on new nodes. ([#79305](https://github.com/kubernetes/kubernetes/pull/79305), [@paivagustavo](https://github.com/paivagustavo))
        * ip-mask-agent addon starts to use the label `node.kubernetes.io/masq-agent-ds-ready` instead of `beta.kubernetes.io/masq-agent-ds-ready` as its node selector.
        * kube-proxy addon starts to use the label `node.kubernetes.io/kube-proxy-ds-ready` instead of `beta.kubernetes.io/kube-proxy-ds-ready` as its node selector.
        * metadata-proxy addon starts to use the label `cloud.google.com/metadata-proxy-ready` instead of `beta.kubernetes.io/metadata-proxy-ready` as its node selector.
        * Kubelet removes the ability to set `kubernetes.io` or `k8s.io` labels via --node-labels other than the [specifically allowed labels/prefixes](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/0000-20170814-bounding-self-labeling-kubelets.md#proposal).
-->
* `beta.kubernetes.io/metadata-proxy-ready`、`beta.kubernetes.io/metadata-proxy-ready` 和 `beta.kubernetes.io/kube-proxy-ds-ready`（节点标签）不再添加到新节点上。见 ([#79305](https://github.com/kubernetes/kubernetes/pull/79305)、[@paivagustavo](https://github.com/paivagustavo))。
        * ip-mask-agent 插件开始使用标签 `node.kubernetes.io/masq-agent-ds-ready` 代替 `beta.kubernetes.io/masq-agent-ds-ready` 作为其节点选择器。
        * kube-proxy 插件开始使用标签 `node.kubernetes.io/kube-proxy-ds-ready` 代替 `beta.kubernetes.io/kube-proxy-ds-ready` 作为其节点选择器。
        * metadata-proxy 插件开始使用标签 `cloud.google.com/metadata-proxy-ready` 代替 `beta.kubernetes.io/metadata-proxy-ready` 作为其节点选择器。
        * kubelet 删除了通过 `--node-labels` 标签（[特定允许的标签或前缀](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/0000-20170814-bounding-self-labeling-kubelets.md#proposal) 除外）设置 `kubernetes.io `或 `k8s.io` 标签的功能。
<!--
* The following APIs are no longer served by default: ([#70672](https://github.com/kubernetes/kubernetes/pull/70672), [@liggitt](https://github.com/liggitt))
        * All resources under `apps/v1beta1` and `apps/v1beta2` - use `apps/v1` instead
        * `daemonsets`, `deployments`, `replicasets` resources under `extensions/v1beta1` - use `apps/v1` instead
        * `networkpolicies` resources under `extensions/v1beta1` - use `networking.k8s.io/v1` instead
        * `podsecuritypolicies` resources under `extensions/v1beta1` - use `policy/v1beta1` instead
    * Serving these resources can be temporarily re-enabled using the `--runtime-config` apiserver flag. 
        * `apps/v1beta1=true`
        * `apps/v1beta2=true`
        * `extensions/v1beta1/daemonsets=true,extensions/v1beta1/deployments=true,extensions/v1beta1/replicasets=true,extensions/v1beta1/networkpolicies=true,extensions/v1beta1/podsecuritypolicies=true`
    * The ability to serve these resources will be completely removed in v1.18.
-->
* 默认情况下不再提供以下 API：见 ([#70672](https://github.com/kubernetes/kubernetes/pull/70672)、[@liggitt](https://github.com/liggitt))。
        * `apps/v1beta1` 和 `apps/v1` 下的所有资源 - 改用 `apps/v1`
        * `extensions/v1beta1` 下的资源 `daemonsets`、`deployments`、`replicasets` - 改用 `apps/v1`
        * `extensions/v1beta1` 下的资源 `networkpolicies` - 改用 `networking.k8s.io/v1`
        * `extensions/v1beta1` 下的资源 `podsecuritypolicies` - 改用 `policy/v1beta1`
    * 可以使用 `--runtime-config` apiserver 参数临时重新启用服务这些资源。
        * `apps/v1beta1=true`
        * `apps/v1beta2=true`
        * `extensions/v1beta1/daemonsets=true,extensions/v1beta1/deployments=true,extensions/v1beta1/replicasets=true,extensions/v1beta1/networkpolicies=true,extensions/v1beta1/podsecuritypolicies=true`
    * v1.18 中将完全删除提供这些资源的功能。
<!--
* ACTION REQUIRED: Removed deprecated flag `--resource-container` from kube-proxy. ([#78294](https://github.com/kubernetes/kubernetes/pull/78294), [@vllry](https://github.com/vllry))
    * The deprecated `--resource-container` flag has been removed from kube-proxy, and specifying it will now cause an error.  The behavior is now as if you specified `--resource-container=""`.  If you previously specified a non-empty `--resource-container`, you can no longer do so as of kubernetes 1.16.
-->
* 必须要进行的操作：`--resource-container` 弃用参数已从 kube-proxy 中移除。见 ([#78294](https://github.com/kubernetes/kubernetes/pull/78294)、[@vllry](https://github.com/vllry))。现在指定它会导致错误。现在的行为就好像你指定了 `--resource-container=""`。如果以前指定了非空 `--resource-container`，则从 kubernetes 1.16 开始，你将无法再这样做。见 ([#78294](https://github.com/kubernetes/kubernetes/pull/78294)、[@vllry](https://github.com/vllry))。
    * `--resource-container` 参数已从 kube-proxy 中删除，现在指定它会导致错误。现在的行为就好像你指定了 `--resource-container=""`。如果以前指定了非空 `--resource-container`，则从 kubernetes 1.16 开始，你将无法再这样做。

<!--
### Other notable changes
-->
### 其他值得注意的变化

<!--
* When HPAScaleToZero feature gate is enabled HPA supports scaling to zero pods based on object or external metrics. HPA remains active as long as at least one metric value available. ([#74526](https://github.com/kubernetes/kubernetes/pull/74526), [@DXist](https://github.com/DXist))
    * To downgrade the cluster to version that does not support scale-to-zero feature:
    * 1. make sure there are no hpa objects with minReplicas=0. Here is a oneliner to update it to 1:
    *     $ kubectl get hpa --all-namespaces  --no-headers=true | awk  '{if($6==0) printf "kubectl patch hpa/%s --namespace=%s -p \"{\\"spec\\":{\\"minReplicas\\":1}}\"
", $2, $1 }' | sh
    * 2. disable HPAScaleToZero feature gate
-->
* 启用 HPAScaleToZero 功能开关后，HPA 支持根据对象或外部指标将比例缩放到零。只要至少有一个指标，HPA 就会保持活跃状态。见 ([#74526](https://github.com/kubernetes/kubernetes/pull/74526)、[@DXist](https://github.com/DXist))。
    * 要将集群降级到不支持从零缩放功能的版本，请执行以下操作：
    * 1. 确保没有 minReplicas = 0 的 hpa 对象，这是将其更新为 1 的 oneliner：
    *     $ kubectl get hpa --all-namespaces  --no-headers=true | awk  '{if($6==0) printf "kubectl patch hpa/%s --namespace=%s -p \"{\\"spec\\":{\\"minReplicas\\":1}}\"
", $2, $1 }' | sh
    * 2. 禁用 HPAScaleToZero 功能开关
<!--
* Add support for writing out of tree custom scheduler plugins. ([#78162](https://github.com/kubernetes/kubernetes/pull/78162), [@hex108](https://github.com/hex108))
* Remove deprecated github.com/kardianos/osext dependency ([#80142](https://github.com/kubernetes/kubernetes/pull/80142), [@loqutus](https://github.com/loqutus))
* Add Bind extension point to the scheduling framework. ([#79313](https://github.com/kubernetes/kubernetes/pull/79313), [@chenchun](https://github.com/chenchun))
* On Windows systems, %USERPROFILE% is now preferred over %HOMEDRIVE%\%HOMEPATH% as the home folder if %HOMEDRIVE%\%HOMEPATH% does not contain a .kube* Add --kubernetes-version to "kubeadm init phase certs ca" and "kubeadm init phase kubeconfig" ([#80115](https://github.com/kubernetes/kubernetes/pull/80115), [@gyuho](https://github.com/gyuho))
-->
* 添加对列出树形自定义调度程序插件的支持。见 ([#78162](https://github.com/kubernetes/kubernetes/pull/78162)、[@hex108](https://github.com/hex108))。
* 删除不推荐使用的 github.com/kardianos/osext 依赖项。见 ([#80142](https://github.com/kubernetes/kubernetes/pull/80142))。
* 将绑定扩展点添加到调度框架。见 ([#79313](https://github.com/kubernetes/kubernetes/pull/79313)、[@chenchun](https://github.com/chenchun))。
* 在 Windows 系统上，如果 ％HOMEDRIVE％\％HOMEPATH％ 不包含 .kube *，则 ％USERPROFILE％ 现在比 ％HOMEDRIVE％\％HOMEPATH％ 更适合作为主文件夹。将 `--kubernetes-version` 添加到 `kubeadm init phase certs ca` 和 `kubeadm init phase kubeconfig` 中。见 ([#80115](https://github.com/kubernetes/kubernetes/pull/80115)、[@gyuho](https://github.com/gyuho))。
- 
<!--
* kubeadm ClusterConfiguration now supports featureGates: IPv6DualStack: true ([#80145](https://github.com/kubernetes/kubernetes/pull/80145), [@Arvinderpal](https://github.com/Arvinderpal))
* Fix a bug that ListOptions.AllowWatchBookmarks wasn't propagating correctly in kube-apiserver. ([#80157](https://github.com/kubernetes/kubernetes/pull/80157), [@wojtek-t](https://github.com/wojtek-t))
* Bugfix: csi plugin supporting raw block that does not need attach mounted failed ([#79920](https://github.com/kubernetes/kubernetes/pull/79920), [@cwdsuzhou](https://github.com/cwdsuzhou))
-->
* kubeadm ClusterConfiguration 现在支持特性开关：IPv6DualStack：true。见 ([#80145](https://github.com/kubernetes/kubernetes/pull/80145)、[@Arvinderpal](https://github.com/Arvinderpal))。
* 修复了 ListOptions.AllowWatchBookmarks 在 kube-apiserver 中无法正确传播的错误。([#80157](https://github.com/kubernetes/kubernetes/pull/80157)、[@wojtek-t](https://github.com/wojtek-t))。
* 修复了 CSI 插件支持不需要附加安装的原始块失败的问题。见 ([#79920](https://github.com/kubernetes/kubernetes/pull/79920)、[@cwdsuzhou](https://github.com/cwdsuzhou))。
<!--
* Increase log level for graceful termination to v=5 ([#80100](https://github.com/kubernetes/kubernetes/pull/80100), [@andrewsykim](https://github.com/andrewsykim))
* kubeadm: support fetching configuration from the original cluster for 'upgrade diff' ([#80025](https://github.com/kubernetes/kubernetes/pull/80025), [@SataQiu](https://github.com/SataQiu))
* The sample-apiserver gains support for OpenAPI v2 spec serving at `/openapi/v2`. ([#79843](https://github.com/kubernetes/kubernetes/pull/79843), [@sttts](https://github.com/sttts))
    * The `generate-internal-groups.sh` script in k8s.io/code-generator will generate OpenAPI definitions by default in `pkg/generated/openapi`. Additional API group dependencies can be added via `OPENAPI_EXTRA_PACKAGES=<group>/<version> <group2>/<version2>...`.
* Cinder and ScaleIO volume providers have been deprecated and will be removed in a future release. ([#80099](https://github.com/kubernetes/kubernetes/pull/80099), [@dims](https://github.com/dims))
-->
* 将体面终止的日志级别增加到 `v=5`。见 ([#80100](https://github.com/kubernetes/kubernetes/pull/80100)、[@andrewsykim](https://github.com/andrewsykim))。
* kubeadm：支持从原始集群中获取配置信息以进行 `upgrade diff` 操作。见 ([#80025](https://github.com/kubernetes/kubernetes/pull/80025)、[@SataQiu](https://github.com/SataQiu))。
* sample-apiserver 获得了对 `/openapi/v2` 上提供的 OpenAPI v2 规范的支持。([#79843](https://github.com/kubernetes/kubernetes/pull/79843)、[@sttts](https://github.com/sttts))。
    * The `generate-internal-groups.sh` script in k8s.io/code-generator will generate OpenAPI definitions by default in `pkg/generated/openapi`. Additional API group dependencies can be added via `OPENAPI_EXTRA_PACKAGES=<group>/<version> <group2>/<version2>...`.
* `Cinder` 和 `ScaleIO` volume（卷）驱动已被弃用，并将在以后的版本中删除。见 ([#80099](https://github.com/kubernetes/kubernetes/pull/80099), [@dims](https://github.com/dims))。
<!--
* kubelet's --containerized flag was deprecated in 1.14. This flag is removed in 1.16. ([#80043](https://github.com/kubernetes/kubernetes/pull/80043), [@dims](https://github.com/dims))
* Optimize EC2 DescribeInstances API calls in aws cloud provider library by querying instance ID instead of EC2 filters when possible ([#78140](https://github.com/kubernetes/kubernetes/pull/78140), [@zhan849](https://github.com/zhan849))
-->
* 1.14 中已经弃用 kubelet 的 --containerized 参数。此参数在 1.16 中已被删除。([#80043](https://github.com/kubernetes/kubernetes/pull/80043)、[@dims](https://github.com/dims))。
* 在可能的情况下，通过查询实例 ID 而不是 EC2 过滤器来优化 AWS 云提供商库中的 EC2 DescribeInstances API 调用。见 ([#78140](https://github.com/kubernetes/kubernetes/pull/78140)、[@zhan849](https://github.com/zhan849))。
<!--
* etcd migration image no longer supports etcd2 version.  ([#80037](https://github.com/kubernetes/kubernetes/pull/80037), [@dims](https://github.com/dims))
* Promote WatchBookmark feature to beta and enable it by default. ([#79786](https://github.com/kubernetes/kubernetes/pull/79786), [@wojtek-t](https://github.com/wojtek-t))
    * With WatchBookmark feature, clients are able to request watch events with BOOKMARK type. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session.
* update to use go 1.12.7 ([#79966](https://github.com/kubernetes/kubernetes/pull/79966), [@tao12345666333](https://github.com/tao12345666333))
-->
* etcd 升级镜像不再支持 etcd2 版本。见 ([#80037](https://github.com/kubernetes/kubernetes/pull/80037)、[@dims](https://github.com/dims))。
* 将 WatchBookmark 功能升级为 Beta 功能并默认启用它。见 ([#79786](https://github.com/kubernetes/kubernetes/pull/79786)、[@wojtek-t](https://github.com/wojtek-t))。
    * 借助 WatchBookmark 功能，客户端可以请求具有 BOOKMARK 类型的监视事件。客户端不应该假定书签在任何特定的时间间隔内返回，也不能假定服务器将在会话期间发送任何 BOOKMARK 事件。
* 升级 go 到 1.12.7。见 ([#79966](https://github.com/kubernetes/kubernetes/pull/79966)、[@tao12345666333](https://github.com/tao12345666333))。
<!--
* Add --shutdown-delay-duration to kube-apiserver in order to delay a graceful shutdown. `/healthz` will keep returning success during this time and requests are normally served, but `/readyz` will return faillure immediately. This delay can be used to allow the SDN to update iptables on all nodes and stop sending traffic. ([#74416](https://github.com/kubernetes/kubernetes/pull/74416), [@sttts](https://github.com/sttts))
-->
* 将 `--shutdown-delay-duration` 添加到 kube-apiserver 中以延迟正常关闭。在这段时间内，`/healthz` 将继续返回成功，并且请求将正常处理，但是 `/readyz` 将立即返回失败。此延迟可用于允许 SDN 更新所有节点上的 iptables 并停止发送流量。见 ([#74416](https://github.com/kubernetes/kubernetes/pull/74416)、[@sttts](https://github.com/sttts))。
<!--
* The `MutatingWebhookConfiguration` and `ValidatingWebhookConfiguration` APIs have been promoted to `admissionregistration.k8s.io/v1`: ([#79549](https://github.com/kubernetes/kubernetes/pull/79549), [@liggitt](https://github.com/liggitt))
        * `failurePolicy` default changed from `Ignore` to `Fail` for v1
        * `matchPolicy` default changed from `Exact` to `Equivalent` for v1
        * `timeout` default changed from `30s` to `10s` for v1
        * `sideEffects` default value is removed and the field made required for v1
        * `admissionReviewVersions` default value is removed and the field made required for v1 (supported versions for AdmissionReview are `v1` and `v1beta1`)
        * The `name` field for specified webhooks must be unique for `MutatingWebhookConfiguration` and `ValidatingWebhookConfiguration` objects created via `admissionregistration.k8s.io/v1`
    * The `admissionregistration.k8s.io/v1beta1` versions of `MutatingWebhookConfiguration` and `ValidatingWebhookConfiguration` are deprecated and will no longer be served in v1.19.
-->
* `MutatingWebhookConfiguration` 和 `ValidatingWebhookConfiguration` API 已升级为 `admissionregistration.k8s.io/v1`：见 ([#79549](https://github.com/kubernetes/kubernetes/pull/79549)、[@liggitt](https://github.com/liggitt))。
        * v1 的默认 `failurePolicy` 从 `Ignore` 更改为 `Fail`
        * v1 的默认 `matchPolicy` 从 `Exact` 更改为 `Equivalent`
        * v1 的默认 `timeout` 从 `30s` 更改为 `10s`
        * 删除了 `sideEffects` 默认值，并且该字段为必填字段，v1 仅允许使用 `None` 和 `NoneOnDryRun`
        * 删除了 `admissionReviewVersions` 默认值，并为 v1 设置了必填字段（AdmissionReview 支持的版本为 `v1` 和 `v1beta1`）
        * 对于通过 `admissionregistration.k8s.io/v1` 创建的 `MutatingWebhookConfiguration` 和 `ValidatingWebhookConfiguration` 对象，指定 Webhook 的 `name` 字段必须唯一
    * `MutatingWebhookConfiguration` 和 `ValidatingWebhookConfiguration` 的 `admissionregistration.k8s.io/v1beta1` 版本已弃用，在 v1.19 中将不再提供。
<!--
* The garbage collector and generic object quota controller have been updated to use the metadata client which improves memory ([#78742](https://github.com/kubernetes/kubernetes/pull/78742), [@smarterclayton](https://github.com/smarterclayton))
    * and CPU usage of the Kube controller manager.
* SubjectAccessReview requests sent for RBAC escalation, impersonation, and pod security policy authorization checks now populate the version attribute. ([#80007](https://github.com/kubernetes/kubernetes/pull/80007), [@liggitt](https://github.com/liggitt))
* na ([#79892](https://github.com/kubernetes/kubernetes/pull/79892), [@mikebrow](https://github.com/mikebrow))
* Use O_CLOEXEC to ensure file descriptors do not leak to subprocesses. ([#74691](https://github.com/kubernetes/kubernetes/pull/74691), [@cpuguy83](https://github.com/cpuguy83))
* The namespace controller has been updated to use the metadata client which improves memory ([#78744](https://github.com/kubernetes/kubernetes/pull/78744), [@smarterclayton](https://github.com/smarterclayton))
    * and CPU usage of the Kube controller manager.
-->
* 垃圾收集器和通用对象配额控制器已更新为使用元数据客户端，从而改善了内存性能。见 ([#78742](https://github.com/kubernetes/kubernetes/pull/78742)、[@smarterclayton](https://github.com/smarterclayton))。
    * Kube 控制器管理器的 CPU 使用率。
* 现在，发送的用于 RBAC 升级、模拟和 Pod 安全策略授权检查的 SubjectAccessReview 请求将填充版本属性。见 ([#80007](https://github.com/kubernetes/kubernetes/pull/80007)、[@liggitt](https://github.com/liggitt))。
* na 见 ([#79892](https://github.com/kubernetes/kubernetes/pull/79892)、[@mikebrow](https://github.com/mikebrow))。
* 使用 O_CLOEXEC 确保文件描述符不会泄漏到子进程。见 ([#74691](https://github.com/kubernetes/kubernetes/pull/74691)、[@cpuguy83](https://github.com/cpuguy83))。
* 命名空间控制器已更新为使用元数据客户端，从而改善了内存性能。见 ([#78744](https://github.com/kubernetes/kubernetes/pull/78744)、[@smarterclayton](https://github.com/smarterclayton))。
    * Kube 控制器管理器的 CPU 使用率。
<!--
* NONE ([#79933](https://github.com/kubernetes/kubernetes/pull/79933), [@mm4tt](https://github.com/mm4tt))
* add  `kubectl replace --raw` and `kubectl delete --raw` to have parity with create and get ([#79724](https://github.com/kubernetes/kubernetes/pull/79724), [@deads2k](https://github.com/deads2k))
* E2E tests no longer add command line flags directly to the command line, test suites that want that need to be updated if they don't use HandleFlags ([#75593](https://github.com/kubernetes/kubernetes/pull/75593), [@pohly](https://github.com/pohly))
    * loading a -viper-config=e2e.yaml with suffix (introduced in 1.13) works again and now has a regression test
* Kubernetes now supports transparent compression of API responses. Clients that send `Accept-Encoding: gzip` will now receive a GZIP compressed response body if the API call was larger than 128KB.  Go clients automatically request gzip-encoding by default and should see reduced transfer times for very large API requests.  Clients in other languages may need to make changes to benefit from compression. ([#77449](https://github.com/kubernetes/kubernetes/pull/77449), [@smarterclayton](https://github.com/smarterclayton))
-->
* NONE 见 ([#79933](https://github.com/kubernetes/kubernetes/pull/79933)、[@mm4tt](https://github.com/mm4tt))。
* 添加 `kubectl replace --raw` 和 `kubectl delete --raw` 与 create 和 get 相等。见 ([#79724](https://github.com/kubernetes/kubernetes/pull/79724)、[@deads2k](https://github.com/deads2k))。
* E2E 测试不再将命令行参数直接添加到命令行中，如果测试组件不使用 HandleFlags，则需要对其进行更新。见 ([#75593](https://github.com/kubernetes/kubernetes/pull/75593)、[@pohly](https://github.com/pohly))。
    * 再次加载带有后缀（在 1.13 中引入）的 -viper-config=e2e.yaml 可以正常工作，现在进行了回归测试。
* Kubernetes 现在支持 API 响应的透明压缩。如果 API 调用大于 128 KB，则发送 “Accept-Encoding：gzip” 的客户端现在将收到 GZIP 压缩的响应正文。Go 客户端默认会自动请求 gzip 编码，并且对于非常大的 API 请求，应该会减少传输时间。其他语言的客户端可能需要进行更改才能从压缩中受益。见 ([#77449](https://github.com/kubernetes/kubernetes/pull/77449)、[@smarterclayton](https://github.com/smarterclayton))。
<!--
* Resolves an issue serving aggregated APIs backed by services that respond to requests to `/` with non-2xx HTTP responses ([#79895](https://github.com/kubernetes/kubernetes/pull/79895), [@deads2k](https://github.com/deads2k))
* updated fluentd to 1.5.1, elasticsearchs & kibana to 7.1.1 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014), [@monotek](https://github.com/monotek))
* kubeadm: implement support for concurrent add/remove of stacked etcd members ([#79677](https://github.com/kubernetes/kubernetes/pull/79677), [@neolit123](https://github.com/neolit123))
* Added a metric 'apiserver_watch_events_total' that can be used to understand the number of watch events in the system. ([#78732](https://github.com/kubernetes/kubernetes/pull/78732), [@mborsz](https://github.com/mborsz))
* KMS Providers will install a healthz check for the status of kms-pluign in kube-apiservers' encryption config.  ([#78540](https://github.com/kubernetes/kubernetes/pull/78540), [@immutableT](https://github.com/immutableT))
-->
* 解决了由非 2xx HTTP 响应对 `/` 请求的服务支持的聚合 API 的问题。见 ([#79895](https://github.com/kubernetes/kubernetes/pull/79895)、[@deads2k](https://github.com/deads2k))。
* fluentd 更新至 1.5.1，elasticsearchs 和 kibana 更新至 7.1.1。见 ([#79014](https://github.com/kubernetes/kubernetes/pull/79014)、[@monotek](https://github.com/monotek))。
* kubeadm：实现对堆叠的 etcd 成员的并发添加或删除的支持。见 ([#79677](https://github.com/kubernetes/kubernetes/pull/79677)、[@neolit123](https://github.com/neolit123))。
* 添加了指标 `apiserver_watch_events_total`，可用于了解系统中监视事件的数量。见 ([#78732](https://github.com/kubernetes/kubernetes/pull/78732)、[@mborsz](https://github.com/mborsz))。
* KMS 提供商将在 kube-apiservers 的加密配置中安装 kms 状态的运行状况检查插件。见 ([#78540](https://github.com/kubernetes/kubernetes/pull/78540)、[@immutableT](https://github.com/immutableT))。
<!--
* Fixes a bug in openapi published for custom resources using x-kubernetes-preserve-unknown-fields extensions, so that kubectl will allow sending unknown fields for that portion of the object. ([#79636](https://github.com/kubernetes/kubernetes/pull/79636), [@liggitt](https://github.com/liggitt))
* A new client `k8s.io/client-go/metadata.Client` has been added for accessing objects generically. This client makes it easier to retrieve only the metadata (the `metadata` sub-section) from resources on the cluster in an efficient manner for use cases that deal with objects generically, like the garbage collector, quota, or the namespace controller. The client asks the server to return a `meta.k8s.io/v1 PartialObjectMetadata` object for list, get, delete, watch, and patch operations on both normal APIs and custom resources which can be encoded in protobuf for additional work. If the server does not yet support this API the client will gracefully fall back to JSON and transform the response objects into PartialObjectMetadata. ([#77819](https://github.com/kubernetes/kubernetes/pull/77819), [@smarterclayton](https://github.com/smarterclayton))
-->
* 修复了使用 x-kubernetes-preserve-unknown-fields 扩展为自定义资源发布的 openapi 中的一个错误，该错误使 kubectl 将允许为该对象的某部分发送未知字段。见 ([#79636](https://github.com/kubernetes/kubernetes/pull/79636)、[@liggitt](https://github.com/liggitt))。
* 添加了新的客户端 `k8s.io/client-go/metadata.Client`，用于一般性地访问对象。一般情况下，对于使用处理对象（例如垃圾收集器、配额或命名空间控制器）的用例，该客户端使以有效方式从集群上的资源仅检索元数据（“元数据”部分）变得更加容易。客户端要求服务器返回一个 `meta.k8s.io/v1 PartialObjectMetadata` 对象，用于在常规 API 和自定义资源上进行列表、获取、删除、监视和修补操作，这些操作可以在 protobuf 中进行编码以进行其他工作。如果服务器尚不支持此 API，则客户端将正常使用 JSON 并将响应对象转换为 PartialObjectMetadata。见 ([#77819](https://github.com/kubernetes/kubernetes/pull/77819)、[@smarterclayton](https://github.com/smarterclayton))。
<!--
* changes timeout value in csi plugin from 15s to 2min which fixes the timeout issue ([#79529](https://github.com/kubernetes/kubernetes/pull/79529), [@andyzhangx](https://github.com/andyzhangx))
* kubeadm: provide "--control-plane-endpoint" flag for `controlPlaneEndpoint` ([#79270](https://github.com/kubernetes/kubernetes/pull/79270), [@SataQiu](https://github.com/SataQiu))
* Fixes invalid "time stamp is the future" error when kubectl cp-ing a file ([#73982](https://github.com/kubernetes/kubernetes/pull/73982), [@tanshanshan](https://github.com/tanshanshan))
* Kubelet should now more reliably report the same primary node IP even if the set of node IPs reported by the CloudProvider changes. ([#79391](https://github.com/kubernetes/kubernetes/pull/79391), [@danwinship](https://github.com/danwinship))
-->
* 将 csi 插件中的超时值从 15 s 更改为 2 min，从而解决了超时问题。见 ([#79529](https://github.com/kubernetes/kubernetes/pull/79529)、[@andyzhangx](https://github.com/andyzhangx))。
* kubeadm：为 `controlPlaneEndpoint` 提供 `--control-plane-endpoint` 参数。见 ([#79270](https://github.com/kubernetes/kubernetes/pull/79270)、[@SataQiu](https://github.com/SataQiu))。
* 当 kubectl cp 操作复制一个文件时，修复无效的 "time stamp is the future" 错误。见 ([#73982](https://github.com/kubernetes/kubernetes/pull/73982)、[@tanshanshan](https://github.com/tanshanshan))。
* 现在，即使云平台所报告的节点 IP 集合发生了变化，kubelet 也应该能够更可靠地报告相同的主节点 IP。见 ([#79391](https://github.com/kubernetes/kubernetes/pull/79391), [@danwinship](https://github.com/danwinship))。
<!--
* To configure controller manager to use ipv6dual stack: ([#73977](https://github.com/kubernetes/kubernetes/pull/73977), [@khenidak](https://github.com/khenidak))
    * use --cluster-cidr="<cidr1>,<cidr2>".
    * Notes:
 
    * 1. Only the first two cidrs are used (soft limits for Alpha, might be lifted later on). 
    * 2. Only the "RangeAllocator" (default) is allowed as a value for --cidr-allocator-type . Cloud allocators are not compatible with ipv6dualstack 
* When using the conformance test image, a new environment variable E2E_USE_GO_RUNNER will cause the tests to be run with the new Golang-based test runner rather than the current bash wrapper. ([#79284](https://github.com/kubernetes/kubernetes/pull/79284), [@johnSchnake](https://github.com/johnSchnake))
-->
* 允许将控制器管理器配置为使用 IPv6 双协议栈：见 ([#73977](https://github.com/kubernetes/kubernetes/pull/73977)、[@khenidak](https://github.com/khenidak))。
    * 使用 `--cluster-cidr="<cidr1>,<cidr2>"`。
    * 注意：
 
    * 1. 仅使用前两个 CIDR（对 Alpha 功能的软限制，稍后可能会取消）。 
    * 2. 仅将 "RangeAllocator"（默认值）作为 --cidr-allocator-type 的值。云分配器与 IPv6 双协议栈不兼容。
* 当使用一致性测试镜像时，新的环境变量 `E2E_USE_GO_RUNNER` 将使测试使用基于 golang 的新测试运行程序而不是当前的 bash 包装程序运行。见 ([#79284](https://github.com/kubernetes/kubernetes/pull/79284)、[@johnSchnake](https://github.com/johnSchnake))。
<!--
* kubeadm: prevent PSP blocking of upgrade image prepull by using a non-root user ([#77792](https://github.com/kubernetes/kubernetes/pull/77792), [@neolit123](https://github.com/neolit123))
* kubelet now accepts a --cni-cache-dir option, which defaults to /var/lib/cni/cache, where CNI stores cache files. ([#78908](https://github.com/kubernetes/kubernetes/pull/78908), [@dcbw](https://github.com/dcbw))
-->
* kubeadm：通过使用非 root 用户防止 PSP 阻止升级镜像提前拉取操作。见 ([#77792](https://github.com/kubernetes/kubernetes/pull/77792)、[@neolit123](https://github.com/neolit123))。
* kubelet 现在接受 `--cni-cache-dir` 选项，默认为 /var/lib/cni/cache，这是 CNI 存储缓存文件的位置。([#78908](https://github.com/kubernetes/kubernetes/pull/78908)、[@dcbw](https://github.com/dcbw))。
<!--
* Update Azure API versions (containerregistry -- 2018-09-01, network -- 2018-08-01) ([#79583](https://github.com/kubernetes/kubernetes/pull/79583), [@justaugustus](https://github.com/justaugustus))
-->
* Azure API 版本已更新（容器 registry 到 2018-09-01，网络到 2018-08-01）。见 ([#79583](https://github.com/kubernetes/kubernetes/pull/79583))。
<!--
* Fix possible fd leak and closing of dirs in doSafeMakeDir  ([#79534](https://github.com/kubernetes/kubernetes/pull/79534), [@odinuge](https://github.com/odinuge))
-->
* 修复 `doSafeMakeDir` 中可能的文件描述符泄漏和目录关闭。见 ([#79534](https://github.com/kubernetes/kubernetes/pull/79534)、[@odinuge](https://github.com/odinuge))。
<!--
* kubeadm: fix the bug that "--cri-socket" flag does not work for `kubeadm reset` ([#79498](https://github.com/kubernetes/kubernetes/pull/79498), [@SataQiu](https://github.com/SataQiu))
* kubectl logs --selector will support --tail=-1. ([#74943](https://github.com/kubernetes/kubernetes/pull/74943), [@JishanXing](https://github.com/JishanXing))
* Introduce a new admission controller for RuntimeClass. Initially, RuntimeClass will be used to apply the pod overhead associated with a given RuntimeClass to the Pod.Spec if a corresponding RuntimeClassName is specified. ([#78484](https://github.com/kubernetes/kubernetes/pull/78484), [@egernst](https://github.com/egernst))
    * PodOverhead is an alpha feature as of Kubernetes 1.16.
-->
* kubeadm：修复 `--cri-socket` 参数不适用于 `kubeadm reset` 操作的错误。见 ([#79498](https://github.com/kubernetes/kubernetes/pull/79498)、[@SataQiu](https://github.com/SataQiu))。
* kubectl log 操作 --selector 支持 --tail = -1。见 ([#74943](https://github.com/kubernetes/kubernetes/pull/74943)、[@JishanXing](https://github.com/JishanXing))。
* 为 RuntimeClass 引入新的准入控制器。最初，如果指定了相应的 RuntimeClassName，则将使用 RuntimeClass 与给定 RuntimeClass 关联的 Pod 开销应用于 Pod `spec`。见 ([#78484](https://github.com/kubernetes/kubernetes/pull/78484)、[@egernst](https://github.com/egernst))。
    * 从 Kubernetes 1.16 开始，PodOverhead 是 Alpha 功能。
<!--
* Fix kubelet errors in AArch64 with huge page sizes smaller than 1MiB ([#78495](https://github.com/kubernetes/kubernetes/pull/78495), [@odinuge](https://github.com/odinuge))
* The alpha `metadata.initializers` field, deprecated in 1.13, has been removed. ([#79504](https://github.com/kubernetes/kubernetes/pull/79504), [@yue9944882](https://github.com/yue9944882))
* Fix duplicate error messages in cli commands ([#79493](https://github.com/kubernetes/kubernetes/pull/79493), [@odinuge](https://github.com/odinuge))
* Default resourceGroup should be used when the value of annotation azure-load-balancer-resource-group is an empty string. ([#79514](https://github.com/kubernetes/kubernetes/pull/79514), [@feiskyer](https://github.com/feiskyer))
-->
* 使用小于 1 MiB 的巨大页面来修复 AArch64 中的 kubelet 错误。见 ([#78495](https://github.com/kubernetes/kubernetes/pull/78495)、[@odinuge](https://github.com/odinuge))。
* 在 v1.13 版本中弃用的 alpha `metadata.initializers` 字段已被删除。见 ([#79504](https://github.com/kubernetes/kubernetes/pull/79504)、[@yue9944882](https://github.com/yue9944882))。
* 修复 cli 命令中的重复错误消息。见 ([#79493](https://github.com/kubernetes/kubernetes/pull/79493)、[@odinuge](https://github.com/odinuge))。
* 当注解 `azure-load-balancer-resource-group` 的值为空字符串时，应使用默认 resourceGroup。见 ([#79514](https://github.com/kubernetes/kubernetes/pull/79514)、[@feiskyer](https://github.com/feiskyer))。
<!--
* Fixes output of `kubectl get --watch-only` when watching a single resource ([#79345](https://github.com/kubernetes/kubernetes/pull/79345), [@liggitt](https://github.com/liggitt))
* RateLimiter add a context-aware method, fix client-go request goruntine backlog in async timeout scene. ([#79375](https://github.com/kubernetes/kubernetes/pull/79375), [@answer1991](https://github.com/answer1991))
* Fix a bug where kubelet would not retry pod sandbox creation when the restart policy of the pod is Never ([#79451](https://github.com/kubernetes/kubernetes/pull/79451), [@yujuhong](https://github.com/yujuhong))
* Fix CRD validation error on 'items' field. ([#76124](https://github.com/kubernetes/kubernetes/pull/76124), [@tossmilestone](https://github.com/tossmilestone))
* The CRD handler now properly re-creates stale CR storage to reflect CRD update. ([#79114](https://github.com/kubernetes/kubernetes/pull/79114), [@roycaihw](https://github.com/roycaihw))
-->
* 监视某个资源时修复 `kubectl get --watch-only` 输出内容。见 ([#79345](https://github.com/kubernetes/kubernetes/pull/79345)、[@liggitt](https://github.com/liggitt))。
* RateLimiter 添加了 context-aware 方法，修复了异步超时场景中的 client-go 请求 goruntine backlog 问题。见 ([#79375](https://github.com/kubernetes/kubernetes/pull/79375)、[@answer1991](https://github.com/answer1991))。
* 修复了当 Pod 的重启策略设置为 Never 时，kubelet 不会重试 Pod 沙盒创建的问题。见 ([#79451](https://github.com/kubernetes/kubernetes/pull/79451)、[@yujuhong](https://github.com/yujuhong))。
* 修复 `items` 字段中的 CRD 验证错误。见 ([#76124](https://github.com/kubernetes/kubernetes/pull/76124)、[@tossmilestone](https://github.com/tossmilestone))。
* CRD 处理程序现在可以正确地重新创建过时的 CR 存储，以反映 CRD 更新。见 ([#79114](https://github.com/kubernetes/kubernetes/pull/79114)、[@roycaihw](https://github.com/roycaihw))。
<!--
* Integrated volume limits for in-tree and CSI volumes into one scheduler predicate. ([#77595](https://github.com/kubernetes/kubernetes/pull/77595), [@bertinatto](https://github.com/bertinatto))
* Fix a bug in server printer that could cause kube-apiserver to panic. ([#79349](https://github.com/kubernetes/kubernetes/pull/79349), [@roycaihw](https://github.com/roycaihw))
* Mounts /home/kubernetes/bin/nvidia/vulkan/icd.d on the host to /etc/vulkan/icd.d inside containers requesting GPU. ([#78868](https://github.com/kubernetes/kubernetes/pull/78868), [@chardch](https://github.com/chardch))
* Remove CSIPersistentVolume feature gates ([#79309](https://github.com/kubernetes/kubernetes/pull/79309), [@draveness](https://github.com/draveness))
-->
* 将 in-tree 和 CSI（Volume）卷的（Volume）限制集成到一个调度器条件（Scheduler Predicate）。见 ([#77595](https://github.com/kubernetes/kubernetes/pull/77595)、[@bertinatto](https://github.com/bertinatto))。
* 修复了源代码 printers 函数中可能导致 kube-apiserver 崩溃的错误。见 ([#79349](https://github.com/kubernetes/kubernetes/pull/79349)、[@roycaihw](https://github.com/roycaihw))。
* 将主机上的 `/home/kubernetes/bin/nvidia/vulkan/icd.d` 挂载到请求 GPU 的容器内的 `/etc/vulkan/icd.d`。见 ([#78868](https://github.com/kubernetes/kubernetes/pull/78868)、[@chardch](https://github.com/chardch))。
* 移除 CSIPersistentVolume 功能特性开关。见 ([#79309](https://github.com/kubernetes/kubernetes/pull/79309)、[@draveness](https://github.com/draveness))。
<!--
* Init container resource requests now impact pod QoS class ([#75223](https://github.com/kubernetes/kubernetes/pull/75223), [@sjenning](https://github.com/sjenning))
* Correct the maximum allowed insecure bind port for the kube-scheduler and kube-apiserver to 65535. ([#79346](https://github.com/kubernetes/kubernetes/pull/79346), [@ncdc](https://github.com/ncdc))
* Fix remove the etcd member from the cluster during a kubeadm reset. ([#79326](https://github.com/kubernetes/kubernetes/pull/79326), [@bradbeam](https://github.com/bradbeam))
* Remove KubeletPluginsWatcher feature gates ([#79310](https://github.com/kubernetes/kubernetes/pull/79310), [@draveness](https://github.com/draveness))
* Remove HugePages, VolumeScheduling, CustomPodDNS and PodReadinessGates feature flags ([#79307](https://github.com/kubernetes/kubernetes/pull/79307), [@draveness](https://github.com/draveness))
-->
* 初始化容器资源请求现在会影响 Pod QoS 类。见 ([#75223](https://github.com/kubernetes/kubernetes/pull/75223)、[@sjenning](https://github.com/sjenning))。
* 将 kube-scheduler 和 kube-apiserver 允许的最大不安全绑定端口更正为 65535。([#79346](https://github.com/kubernetes/kubernetes/pull/79346)、[@ncdc](https://github.com/ncdc))。
* 修复在 kubeadm 重置期间从集群中删除 etcd 成员问题。见 ([#79326](https://github.com/kubernetes/kubernetes/pull/79326)、[@bradbeam](https://github.com/bradbeam))。
* 移除 KubeletPluginsWatcher 特性开关。见 ([#79310](https://github.com/kubernetes/kubernetes/pull/79310)、[@draveness](https://github.com/draveness))。
* 移除 HugePages、VolumeScheduling、CustomPodDNS 和 PodReadinessGates 功能参数。见 ([#79307](https://github.com/kubernetes/kubernetes/pull/79307)、[@draveness](https://github.com/draveness))。
<!--
* The GA PodPriority feature gate is now on by default and cannot be disabled. The feature gate will be removed in v1.18. ([#79262](https://github.com/kubernetes/kubernetes/pull/79262), [@draveness](https://github.com/draveness))
* Remove pids cgroup controller requirement when related feature gates are disabled ([#79073](https://github.com/kubernetes/kubernetes/pull/79073), [@rafatio](https://github.com/rafatio))
* Add Bind extension point of the scheduling framework ([#78513](https://github.com/kubernetes/kubernetes/pull/78513), [@chenchun](https://github.com/chenchun))
* if targetPort is changed that will process by service controller  ([#77712](https://github.com/kubernetes/kubernetes/pull/77712), [@Sn0rt](https://github.com/Sn0rt))
* update to use go 1.12.6 ([#78958](https://github.com/kubernetes/kubernetes/pull/78958), [@tao12345666333](https://github.com/tao12345666333))
* kubeadm: fix a potential panic if kubeadm discovers an invalid, existing kubeconfig file ([#79165](https://github.com/kubernetes/kubernetes/pull/79165), [@neolit123](https://github.com/neolit123))
-->
* GA 版本中的 `PodPriority` 特性开关现在默认情况下处于打开状态，无法禁用。`PodPriority` 特性开关将在 v1.18 中删除。见 ([#79262](https://github.com/kubernetes/kubernetes/pull/79262), [@draveness](https://github.com/draveness))。
* 禁用相关功能开关时，删除 PID cgroup 控制器要求。见 ([#79073](https://github.com/kubernetes/kubernetes/pull/79073)、[@rafatio](https://github.com/rafatio))。
* 添加调度框架的绑定扩展点。见 ([#78513](https://github.com/kubernetes/kubernetes/pull/78513)、[@chenchun](https://github.com/chenchun))。
* 如果 targetPort 更改，则将由服务控制器处理 targetPort。见 ([#77712](https://github.com/kubernetes/kubernetes/pull/77712)、[@Sn0rt](https://github.com/Sn0rt))。
* 升级 go 到 1.12.6。见 ([#78958](https://github.com/kubernetes/kubernetes/pull/78958)、[@tao12345666333](https://github.com/tao12345666333))。
* kubeadm：修复了因 kubeadm 发现无效的、现有的 kubeconfig 文件而可能引起的崩溃问题。见 ([#79165](https://github.com/kubernetes/kubernetes/pull/79165)、[@neolit123](https://github.com/neolit123))。
<!--
* fix kubelet fail to delete orphaned pod directory when the kubelet's pods directory (default is "/var/lib/kubelet/pods") symbolically links to another disk device's directory ([#79094](https://github.com/kubernetes/kubernetes/pull/79094), [@gaorong](https://github.com/gaorong))
* Addition of Overhead field to the PodSpec and RuntimeClass types as part of the Pod Overhead KEP ([#76968](https://github.com/kubernetes/kubernetes/pull/76968), [@egernst](https://github.com/egernst))
* fix pod list return value of framework.WaitForPodsWithLabelRunningReady ([#78687](https://github.com/kubernetes/kubernetes/pull/78687), [@pohly](https://github.com/pohly))
-->
* 修复 kubelet 的 Pod 目录（默认为 `/var/lib/kubelet/pods`）象征性地链接到另一个磁盘设备的目录时，kubelet 无法删除孤立的 pod 目录的问题。见 ([#79094](https://github.com/kubernetes/kubernetes/pull/79094)、[@gaorong](https://github.com/gaorong))。
* 作为 Pod Overhead KEP 的一部分，将 Overhead 字段添加到 PodSpec 和 RuntimeClass 类型中。见 ([#76968](https://github.com/kubernetes/kubernetes/pull/76968)、[@egernst](https://github.com/egernst))。
* 修正 Pod 列表返回值为 `framework.WaitForPodsWithLabelRunningReady`。见 ([#78687](https://github.com/kubernetes/kubernetes/pull/78687)、[@pohly](https://github.com/pohly))。
<!--
* The behavior of the default handler for 404 requests fro the GCE Ingress load balancer is slightly modified in the sense that it now exports metrics using prometheus. The metrics exported include:  ([#79106](https://github.com/kubernetes/kubernetes/pull/79106), [@vbannai](https://github.com/vbannai))
    * - http_404_request_total  (the number of 404 requests handled)
    * - http_404_request_duration_ms (the amount of time the server took to respond in ms)
    * Also includes percentile groupings. The directory for the default 404 handler includes instructions on how to enable prometheus for monitoring and setting alerts.
-->
* 对于 GCE Ingress 负载均衡器的 404 请求的默认处理程序的行为，在某种程度上已进行了一些修改，即它现在使用 Prometheus 导出指标。导出的指标包括：见 ([#79106](https://github.com/kubernetes/kubernetes/pull/79106)、[@vbannai](https://github.com/vbannai))。
    * - `http_404_request_total` （已处理的 404 请求数目）
    * - `http_404_request_duration_ms` （服务器响应所花费的时间（以毫秒为单位））
    * 还包括百分位数分组。默认 404 处理程序的目录包括有关如何启用 Prometheus 来监视和设置警报的说明。
<!--
* The kube-apiserver has improved behavior for both startup and shutdown sequences and also now exposes `
eadyz` for readiness checking. Readyz includes all existing healthz checks but also adds a shutdown check. When a cluster admin initiates a shutdown, the kube-apiserver will try to process existing requests (for the duration of request timeout) before killing the apiserver process.   ([#78458](https://github.com/kubernetes/kubernetes/pull/78458), [@logicalhan](https://github.com/logicalhan))
    * The apiserver also now takes an optional flag "--maximum-startup-sequence-duration". This allows you to explicitly define an upper bound on the apiserver startup sequences before healthz begins to fail. By keeping the kubelet liveness initial delay short, this can enable quick kubelet recovery as soon as we have a boot sequence which has not completed in our expected time frame, despite lack of completion from longer boot sequences (like RBAC). Kube-apiserver behavior when the value of this flag is zero is backwards compatible (this is as the defaulted value of the flag).
-->
* kube-apiserver 改进了启动和关闭序列的行为，现在还公开了 `eadyz` 用来进行就绪检查。Readyz 包括所有现有的 healthz 检查，但还添加了关闭检查。当集群管理员启动关闭时， kube-apiserver 将在杀死 apiserver 进程之前尝试处理现有请求（在请求超时时间内）。见 ([#78458](https://github.com/kubernetes/kubernetes/pull/78458)、[@logicalhan](https://github.com/logicalhan))。
    * apiserver 现在还带有一个可选参数 `--maximum-startup-sequence-duration`。这样，您就可以在 healthz 开始失败之前明确定义 apiserver 启动序列的上限。通过使 kubelet 活跃度初始延迟尽量较短，尽管启动序列没有在预期的时间范围内完成并且缺少较长的启动序列（如 RBAC），但可以使 kubelet 快速恢复。当此标志的值为零时，kube-apiserver 行为是向后兼容的（这是该参数的默认值）。
<!--
* fix: make azure disk URI as case insensitive ([#79020](https://github.com/kubernetes/kubernetes/pull/79020), [@andyzhangx](https://github.com/andyzhangx))
* Enable cadvisor ProcessMetrics collecting. ([#79002](https://github.com/kubernetes/kubernetes/pull/79002), [@jiayingz](https://github.com/jiayingz))
* Fixes a bug where `kubectl set config` hangs and uses 100% CPU on some invalid property names  ([#79000](https://github.com/kubernetes/kubernetes/pull/79000), [@pswica](https://github.com/pswica))
* Fix a string comparison bug in IPVS graceful termination where UDP real servers are not deleted. ([#78999](https://github.com/kubernetes/kubernetes/pull/78999), [@andrewsykim](https://github.com/andrewsykim))
-->
* 修复了使 Azure 磁盘 URI 不区分大小写的问题。见 ([#79020](https://github.com/kubernetes/kubernetes/pull/79020)、[@andyzhangx](https://github.com/andyzhangx))。
* 启用 cAdvisor ProcessMetrics 指标收集。见 ([#79002](https://github.com/kubernetes/kubernetes/pull/79002)、[@jiayingz](https://github.com/jiayingz))。
* 修复了 `kubectl set config` 挂起并在某些无效的属性名称上使用 100％ CPU 的错误。见 ([#79000](https://github.com/kubernetes/kubernetes/pull/79000)、[@pswica](https://github.com/pswica))。
* 修复了 IPVS 正常终止操作中不删除 UDP 真实服务器的字符串比较错误。见 ([#78999](https://github.com/kubernetes/kubernetes/pull/78999)、[@andrewsykim](https://github.com/andrewsykim))。
<!--
* Reflector watchHandler Warning log 'The resourceVersion for the provided watch is too old.' is now logged as Info.  ([#78991](https://github.com/kubernetes/kubernetes/pull/78991), [@sallyom](https://github.com/sallyom))
* fix a bug that pods not be deleted from unmatched nodes by daemon controller   ([#78974](https://github.com/kubernetes/kubernetes/pull/78974), [@DaiHao](https://github.com/DaiHao))
* NONE ([#78821](https://github.com/kubernetes/kubernetes/pull/78821), [@jhedev](https://github.com/jhedev))
* Volume expansion is enabled in the default GCE storageclass ([#78672](https://github.com/kubernetes/kubernetes/pull/78672), [@msau42](https://github.com/msau42))
-->
* 重构 watchHandler Warning 日志 `The resourceVersion for the provided watch is too old`，现在被设置为 Info。见 ([#78991](https://github.com/kubernetes/kubernetes/pull/78991)、[@sallyom](https://github.com/sallyom))。
* 修复了守护程序控制器（daemon controller）无法从不匹配的节点删除 Pod 的错误。见 ([#78974](https://github.com/kubernetes/kubernetes/pull/78974)、[@DaiHao](https://github.com/DaiHao))。
* NONE 见 ([#78821](https://github.com/kubernetes/kubernetes/pull/78821)、[@jhedev](https://github.com/jhedev))。
* 在默认的 GCE 存储类中启用了卷扩展。见 ([#78672](https://github.com/kubernetes/kubernetes/pull/78672)、[@msau42](https://github.com/msau42))。
<!--
* kubeadm: use the service-cidr flag to pass the desired service CIDR to the kube-controller-manager via its service-cluster-ip-range flag. ([#78625](https://github.com/kubernetes/kubernetes/pull/78625), [@Arvinderpal](https://github.com/Arvinderpal))
* kubeadm: introduce deterministic ordering for the certificates generation in the phase command "kubeadm init phase certs" . ([#78556](https://github.com/kubernetes/kubernetes/pull/78556), [@neolit123](https://github.com/neolit123))
* Add Pre-filter extension point to the scheduling framework. ([#78005](https://github.com/kubernetes/kubernetes/pull/78005), [@ahg-g](https://github.com/ahg-g))
* fix pod stuck issue due to corrupt mnt point in flexvol plugin, call Unmount if PathExists returns any error ([#75234](https://github.com/kubernetes/kubernetes/pull/75234), [@andyzhangx](https://github.com/andyzhangx))
-->
* kubeadm：使用 service-cidr 参数通过其 service-cluster-ip-range 参数将所需的服务 CIDR 传递到 kube-controller-manager。见 ([#78625](https://github.com/kubernetes/kubernetes/pull/78625)、[@Arvinderpal](https://github.com/Arvinderpal))。
* kubeadm：在阶段命令 `kubeadm init phase certs` 操作中引入确定性顺序用于生成证书。见 ([#78556](https://github.com/kubernetes/kubernetes/pull/78556)、[@neolit123](https://github.com/neolit123))。
* 将预过滤器扩展点添加到调度框架。见 ([#78005](https://github.com/kubernetes/kubernetes/pull/78005)、[@ahg-g](https://github.com/ahg-g))。
* 修复由于 flexvol 插件中的 mnt 点损坏而导致的卡住问题，如果 PathExists 返回任何错误，请调用 Unmount 操作。见 ([#75234](https://github.com/kubernetes/kubernetes/pull/75234)、[@andyzhangx](https://github.com/andyzhangx))。
