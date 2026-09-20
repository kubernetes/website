---
layout: blog
title: "Kubernetes v1.34：VolumeAttributesClass 卷修改特性进阶到 GA"
date: 2025-09-08T10:30:00-08:00
slug: kubernetes-v1-34-volume-attributes-class
author: >
  Sunny Song (Google)
translator: >
  [Jin Li](https://github.com/qlijin) (UOS)
---
<!--
layout: blog
title: "Kubernetes v1.34: VolumeAttributesClass for Volume Modification GA"
date: 2025-09-08T10:30:00-08:00
slug: kubernetes-v1-34-volume-attributes-class
author: >
  Sunny Song (Google)
-->

<!--
The VolumeAttributesClass API, which empowers users to dynamically modify volume attributes, has officially graduated to General Availability (GA) in Kubernetes v1.34. This marks a significant milestone, providing a robust and stable way to tune your persistent storage directly within Kubernetes.
-->
VolumeAttributesClass API 支持用户动态修改卷属性，已在 Kubernetes v1.34 中进阶为正式版（GA）。
这标志着重要的里程碑，它提供了一种健壮且稳定的方式，让你可以直接在 Kubernetes 内调优持久化存储。

<!--
## What is VolumeAttributesClass?

At its core, VolumeAttributesClass is a cluster-scoped resource that defines a set of mutable parameters for a volume. Think of it as a "profile" for your storage, allowing cluster administrators to expose different quality-of-service (QoS) levels or performance tiers.

Users can then specify a `volumeAttributesClassName` in their PersistentVolumeClaim (PVC) to indicate which class of attributes they desire. The magic happens through the Container Storage Interface (CSI): when a PVC referencing a VolumeAttributesClass is updated, the associated CSI driver interacts with the underlying storage system to apply the specified changes to the volume.
-->
## 什么是 VolumeAttributesClass？  {#what-is-volumeattributesclass}

从本质上讲，VolumeAttributesClass 是一种集群作用域资源，用于定义卷的一组可变参数。
可以把它想象成存储的"配置文件"，允许集群管理员暴露不同的服务质量（QoS）级别或性能档位。

然后，用户可以在其 PersistentVolumeClaim（PVC）中指定 `volumeAttributesClassName`，
以表明他们期望的属性类别。
其中的奥妙在于容器存储接口（CSI）：当引用了 VolumeAttributesClass 的 PVC 被更新时，
关联的 CSI 驱动会与底层存储系统交互，将指定的更改应用到卷上。

<!--
This means you can now:

*   Dynamically scale performance: Increase IOPS or throughput for a busy database, or reduce it for a less critical application.
*   Optimize costs: Adjust attributes on the fly to match your current needs, avoiding over-provisioning.
*   Simplify operations: Manage volume modifications directly within the Kubernetes API, rather than relying on external tools or manual processes.
-->
这意味着你现在可以：

* 动态扩展性能：为繁忙的数据库提高 IOPS 或吞吐量，或为不太关键的应用降低性能。
* 优化成本：实时调整属性以匹配当前需求，避免过度配置。
* 简化运维：直接在 Kubernetes API 中管理卷修改，而不是依赖外部工具或手动流程。

<!--
## What is new from Beta to GA

There are two major enhancements from beta.
-->
## 从 Beta 到 GA 有哪些新特性？  {#what-is-new-from-beta-to-ga}

与 Beta 版本相比，GA 版本带来了两项重要增强。

<!--
### Cancellation support when errors occur

To improve resilience and user experience, the GA release introduces explicit cancel support when a requested volume modification encounters an error. If the underlying storage system or CSI driver indicates that the requested changes cannot be applied (e.g., due to invalid arguments), users can cancel the operation and revert the volume to its previous stable configuration, preventing the volume from being left in an inconsistent state.
-->
### 出错时支持取消操作  {#cancellation-support-when-errors-occur}

为了提高韧性和用户体验，GA 版本引入了明确的取消支持，
用于处理请求的卷修改遇到错误的情况。
如果底层存储系统或 CSI 驱动表明所请求的更改无法被应用（例如参数无效），
用户可以取消操作并将卷回滚到之前稳定的配置，从而避免卷停留在不一致的状态。

<!--
### Quota support based on scope

While VolumeAttributesClass doesn't add a new quota type, the Kubernetes control plane can be configured to enforce quotas on PersistentVolumeClaims that reference a specific VolumeAttributesClass.

This is achieved by using the `scopeSelector` field in a ResourceQuota to target PVCs that have `.spec.volumeAttributesClassName` set to a particular VolumeAttributesClass name. Please see more details [here]( https://kubernetes.io/docs/concepts/policy/resource-quotas/#resource-quota-per-volumeattributesclass).
-->
### 基于作用域的配额支持  {#quota-support-based-on-scope}

虽然 VolumeAttributesClass 没有新增配额类型，但 Kubernetes 控制平面可以配置为对引用特定
VolumeAttributesClass 的 PersistentVolumeClaim 强制执行配额。

这可以通过在 ResourceQuota 中使用 `scopeSelector` 字段来实现，让配额作用于那些
将 `.spec.volumeAttributesClassName` 设置为特定 VolumeAttributesClass 名称的 PVC。
更多细节请参见[此处](/zh-cn/docs/concepts/policy/resource-quotas/#quota-scope-volume-attributes-class)。

<!--
## Drivers support VolumeAttributesClass

*   Amazon EBS CSI Driver: The AWS EBS CSI driver has robust support for VolumeAttributesClass and allows you to modify parameters like volume type (e.g., gp2 to gp3, io1 to io2), IOPS, and throughput of EBS volumes dynamically.
*   Google Compute Engine (GCE) Persistent Disk CSI Driver (pd.csi.storage.gke.io): This driver also supports dynamic modification of persistent disk attributes, including IOPS and throughput, via VolumeAttributesClass.
-->
## 支持 VolumeAttributesClass 的驱动  {#drivers-support-volumeattributesclass}

* Amazon EBS CSI 驱动：AWS EBS CSI 驱动对 VolumeAttributesClass 提供了强大的支持，
  允许你动态修改 EBS 卷的参数，例如卷类型（如 gp2 到 gp3、io1 到 io2）、IOPS 和吞吐量。
* Google Compute Engine（GCE）Persistent Disk CSI 驱动（pd.csi.storage.gke.io）：
  该驱动也支持通过 VolumeAttributesClass 动态修改持久磁盘属性，包括 IOPS 和吞吐量。

<!--
## Contact

For any inquiries or specific questions related to VolumeAttributesClass, please reach out to the [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
## 联系方式  {#contact}

如有与 VolumeAttributesClass 相关的任何咨询或具体问题，请联系
[SIG Storage 社区](https://github.com/kubernetes/community/tree/master/sig-storage)。
