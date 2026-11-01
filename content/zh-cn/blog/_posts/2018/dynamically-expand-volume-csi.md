---
layout: blog
title:  '使用 CSI 和 Kubernetes 实现卷的动态扩容'
date:   2018-08-02
slug: dynamically-expand-volume-with-csi-and-kubernetes
---
<!--
layout: blog
title:  'Dynamically Expand Volume with CSI and Kubernetes'
date:   2018-08-02
-->

<!--
**Author**: Orain Xiong (Co-Founder, WoquTech)
-->

**作者**：Orain Xiong（联合创始人, WoquTech）

<!--
_There is a very powerful storage subsystem within Kubernetes itself, covering a fairly broad spectrum of use cases. Whereas, when planning to build a product-grade relational database platform with Kubernetes, we face a big challenge: coming up with storage. This article describes how to extend latest Container Storage Interface 0.2.0 and integrate with Kubernetes, and demonstrates the essential facet of dynamically expanding volume capacity._
-->

_Kubernetes 本身有一个非常强大的存储子系统，涵盖了相当广泛的用例。而当我们计划使用 Kubernetes 构建产品级关系型数据库平台时，我们面临一个巨大的挑战：提供存储。本文介绍了如何扩展最新的 Container Storage Interface 0.2.0 和与 Kubernetes 集成，并演示了卷动态扩容的基本方面。_

<!--
## Introduction
-->

## 介绍

<!--
As we focalize our customers, especially in financial space, there is a huge upswell in the adoption of container orchestration technology.
-->

当我们专注于客户时，尤其是在金融领域，采用容器编排技术的情况大大增加。

<!--
They are looking forward to open source solutions to redesign already existing monolithic applications, which have been running for several years on virtualization infrastructure or bare metal.
-->

他们期待着能用开源解决方案重新设计已经存在的整体应用程序，这些应用程序已经在虚拟化基础架构或裸机上运行了几年。

<!--
Considering extensibility and the extent of technical maturity, Kubernetes and Docker are at the very top of the list. But migrating monolithic applications to a distributed orchestration like Kubernetes is challenging, the relational database is critical for the migration.
-->

考虑到可扩展性和技术成熟程度，Kubernetes 和 Docker 排在我们选择列表的首位。但是将整体应用程序迁移到类似于 Kubernetes 之类的分布式容器编排平台上很具有挑战性，其中关系数据库对于迁移来说至关重要。

<!--
With respect to the relational database, we should pay attention to storage. There is a very powerful storage subsystem within Kubernetes itself. It is very useful and covers a fairly broad spectrum of use cases. When planning to run a relational database with Kubernetes in production, we face a big challenge: coming up with storage. There are still some fundamental functionalities which are left unimplemented. Specifically, dynamically expanding volume. It sounds boring but is highly required, except for actions like create and delete and mount and unmount.
-->

关于关系数据库，我们应该注意存储。Kubernetes 本身内部有一个非常强大的存储子系统。它非常有用，涵盖了相当广泛的用例。当我们计划在生产环境中使用 Kubernetes 运行关系型数据库时，我们面临一个巨大挑战：提供存储。目前，仍有一些基本功能尚未实现。特别是，卷的动态扩容。这听起来很无聊，但在除创建，删除，安装和卸载之类的操作外，它是非常必要的。

<!--
Currently, expanding volume is only available with those storage provisioners:
-->

目前，扩展卷仅适用于这些存储供应商：

* gcePersistentDisk
* awsElasticBlockStore
* OpenStack Cinder
* glusterfs
* rbd

<!--
In order to enable this feature, we should set feature gate `ExpandPersistentVolumes` true and turn on the `PersistentVolumeClaimResize` admission plugin. Once `PersistentVolumeClaimResize` has been enabled, resizing will be allowed by a Storage Class whose `allowVolumeExpansion` field is set to true.
-->

为了启用此功能，我们应该将特性开关 `ExpandPersistentVolumes` 设置为 true 并打开 `PersistentVolumeClaimResize` 准入插件。 一旦启用了 `PersistentVolumeClaimResize`，则其对应的 `allowVolumeExpansion` 字段设置为 true 的存储类将允许调整大小。

<!--
Unfortunately, dynamically expanding volume through the Container Storage Interface (CSI) and Kubernetes is unavailable, even though the underlying storage providers have this feature.
-->

不幸的是，即使基础存储提供者具有此功能，也无法通过容器存储接口（CSI）和 Kubernetes 动态扩展卷。

<!--
This article will give a simplified view of CSI, followed by a walkthrough of how to introduce a new expanding volume feature on the existing CSI and Kubernetes. Finally, the article will demonstrate how to dynamically expand volume capacity.
-->

本文将给出 CSI 的简化视图，然后逐步介绍如何在现有 CSI 和 Kubernetes 上引入新的扩展卷功能。最后，本文将演示如何动态扩展卷容量。

<!--
## Container Storage Interface (CSI)
-->

## 容器存储接口（CSI）

<!--
To have a better understanding of what we're going to do, the first thing we need to know is what the Container Storage Interface is. Currently, there are still some problems for already existing storage subsystem within Kubernetes. Storage driver code is maintained in the Kubernetes core repository which is difficult to test. But beyond that, Kubernetes needs to give permissions to storage vendors to check code into the Kubernetes core repository. Ideally, that should be implemented externally.
-->

为了更好地了解我们将要做什么，我们首先需要知道什么是容器存储接口。当前，Kubernetes 中已经存在的存储子系统仍然存在一些问题。 存储驱动程序代码在 Kubernetes 核心存储库中维护，这很难测试。 但是除此之外，Kubernetes 还需要授予存储供应商许可，以将代码签入 Kubernetes 核心存储库。 理想情况下，这些应在外部实施。

<!--
CSI is designed to define an industry standard that will enable storage providers who enable CSI to be available across container orchestration systems that support CSI.
-->

CSI 旨在定义行业标准，该标准将使支持 CSI 的存储提供商能够在支持 CSI 的容器编排系统中使用。

<!--
This diagram depicts a kind of high-level Kubernetes archetypes integrated with CSI:

![csi diagram](/images/blog/2018-08-02-dynamically-expand-volume-csi/csi-diagram.png)
-->

该图描述了一种与 CSI 集成的高级 Kubernetes 原型：

![csi diagram](/images/blog/2018-08-02-dynamically-expand-volume-csi/csi-diagram.png)

<!--
* Three new external components are introduced to decouple Kubernetes and Storage Provider logic
* Blue arrows present the conventional way to call against API Server
* Red arrows present gRPC to call against Volume Driver
-->

* 引入了三个新的外部组件以解耦 Kubernetes 和存储提供程序逻辑
* 蓝色箭头表示针对 API 服务器进行调用的常规方法
* 红色箭头显示 gRPC 以针对 Volume Driver 进行调用

<!--
For more details, please visit: https://github.com/container-storage-interface/spec/blob/master/spec.md
-->

更多详细信息，请访问： https://github.com/container-storage-interface/spec/blob/master/spec.md

<!--
## Extend CSI and Kubernetes
-->

## 扩展 CSI 和 Kubernetes

<!--
In order to enable the feature of expanding volume atop Kubernetes, we should extend several components including CSI specification, “in-tree” volume plugin, external-provisioner and external-attacher.
-->

为了实现在 Kubernetes 上扩展卷的功能，我们应该扩展几个组件，包括 CSI 规范，“in-tree” 卷插件，external-provisioner 和 external-attacher。

<!--
## Extend CSI spec
-->

## 扩展CSI规范

<!--
The feature of expanding volume is still undefined in latest CSI 0.2.0. The new 3 RPCs, including `RequiresFSResize` and `ControllerResizeVolume` and `NodeResizeVolume`, should be introduced.
-->

最新的 CSI 0.2.0 仍未定义扩展卷的功能。应该引入新的3个 RPC，包括 `RequiresFSResize`， `ControllerResizeVolume` 和 `NodeResizeVolume`。

```
service Controller {
 rpc CreateVolume (CreateVolumeRequest)
   returns (CreateVolumeResponse) {}
……
 rpc RequiresFSResize (RequiresFSResizeRequest)
   returns (RequiresFSResizeResponse) {}
 rpc ControllerResizeVolume (ControllerResizeVolumeRequest)
   returns (ControllerResizeVolumeResponse) {}
}

service Node {
 rpc NodeStageVolume (NodeStageVolumeRequest)
   returns (NodeStageVolumeResponse) {}
……
 rpc NodeResizeVolume (NodeResizeVolumeRequest)
   returns (NodeResizeVolumeResponse) {}
}
```

<!--
## Extend “In-Tree” Volume Plugin
-->

## 扩展 “In-Tree” 卷插件

<!--
In addition to the extend CSI specification, the `csiPlugin﻿` interface within Kubernetes should also implement `expandablePlugin`. The `csiPlugin` interface will expand `PersistentVolumeClaim` representing for `ExpanderController`.
-->

除了扩展的 CSI 规范之外，Kubernetes 中的 `csiPlugin` 接口还应该实现 `expandablePlugin`。`csiPlugin` 接口将扩展代表 `ExpanderController` 的 `PersistentVolumeClaim`。

```go
type ExpandableVolumePlugin interface {
VolumePlugin
ExpandVolumeDevice(spec Spec, newSize resource.Quantity, oldSize resource.Quantity) (resource.Quantity, error)
RequiresFSResize() bool
}
```

<!--
### Implement Volume Driver
-->

### 实现卷驱动程序

<!--
Finally, to abstract complexity of the implementation, we should hard code the separate storage provider management logic into the following functions which is well-defined in the CSI specification:
-->

最后，为了抽象化实现的复杂性，我们应该将单独的存储提供程序管理逻辑硬编码为以下功能，这些功能在 CSI 规范中已明确定义：

* CreateVolume
* DeleteVolume
* ControllerPublishVolume
* ControllerUnpublishVolume
* ValidateVolumeCapabilities
* ListVolumes
* GetCapacity
* ControllerGetCapabilities
* RequiresFSResize
* ControllerResizeVolume

<!--
## Demonstration

Let’s demonstrate this feature with a concrete user case.

* Create storage class for CSI storage provisioner
-->

## 展示

让我们以具体的用户案例来演示此功能。

* 为 CSI 存储供应商创建存储类

```yaml
allowVolumeExpansion: true
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-qcfs
parameters:
  csiProvisionerSecretName: orain-test
  csiProvisionerSecretNamespace: default
provisioner: csi-qcfsplugin
reclaimPolicy: Delete
volumeBindingMode: Immediate
```

<!--
* Deploy CSI Volume Driver including storage provisioner `csi-qcfsplugin` across Kubernetes cluster

* Create PVC `qcfs-pvc` which will be dynamically provisioned by storage class `csi-qcfs`
-->

* 在 Kubernetes 集群上部署包括存储供应商 `csi-qcfsplugin` 在内的 CSI 卷驱动

* 创建 PVC `qcfs-pvc`，它将由存储类 `csi-qcfs` 动态配置

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: qcfs-pvc
  namespace: default
....
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 300Gi
  storageClassName: csi-qcfs
```
<!--
* Create MySQL 5.7 instance to use PVC `qcfs-pvc`
* In order to mirror the exact same production-level scenario, there are actually two different types of workloads including:
    * Batch insert to make MySQL consuming more file system capacity
    * Surge query request
* Dynamically expand volume capacity through edit pvc `qcfs-pvc` configuration
-->

* 创建 MySQL 5.7 实例以使用 PVC `qcfs-pvc`
* 为了反映完全相同的生产级别方案，实际上有两种不同类型的工作负载，包括：
     * 批量插入使 MySQL 消耗更多的文件系统容量
     * 浪涌查询请求
* 通过编辑 pvc `qcfs-pvc` 配置动态扩展卷容量

<!--
The Prometheus and Grafana integration allows us to visualize corresponding critical metrics.

![prometheus grafana](/images/blog/2018-08-02-dynamically-expand-volume-csi/prometheus-grafana.png)

We notice that the middle reading shows MySQL datafile size increasing slowly during bulk inserting. At the same time, the bottom reading shows file system expanding twice in about 20 minutes, from 300 GiB to 400 GiB and then 500 GiB. Meanwhile, the upper reading shows the whole process of expanding volume immediately completes and hardly impacts MySQL QPS.
-->

Prometheus 和 Grafana 的集成使我们可以可视化相应的关键指标。

![prometheus grafana](/images/blog/2018-08-02-dynamically-expand-volume-csi/prometheus-grafana.png)

我们注意到中间的读数显示在批量插入期间 MySQL 数据文件的大小缓慢增加。 同时，底部读数显示文件系统在大约20分钟内扩展了两次，从 300 GiB 扩展到 400 GiB，然后扩展到 500 GiB。 同时，上半部分显示，扩展卷的整个过程立即完成，几乎不会影响 MySQL QPS。

<!--
## Conclusion

Regardless of whatever infrastructure applications have been running on, the database is always a critical resource. It is essential to have a more advanced storage subsystem out there to fully support database requirements. This will help drive the more broad adoption of cloud native technology.
-->

## 结论

不管运行什么基础结构应用程序，数据库始终是关键资源。拥有更高级的存储子系统以完全支持数据库需求至关重要。这将有助于推动云原生技术的更广泛采用。
