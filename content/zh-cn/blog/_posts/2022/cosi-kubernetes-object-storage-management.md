---
layout: blog
title: "COSI 简介：使用 Kubernetes API 管理对象存储"
date: 2022-09-02
slug: cosi-kubernetes-object-storage-management
---

<!--
layout: blog
title: "Introducing COSI: Object Storage Management using Kubernetes APIs"
date: 2022-09-02
slug: cosi-kubernetes-object-storage-management
-->

<!--
**Authors:** Sidhartha Mani ([Minio, Inc](https://min.io))
-->
**作者：** Sidhartha Mani ([Minio, Inc](https://min.io))

<!--
This article introduces the Container Object Storage Interface (COSI), a standard for provisioning and consuming object storage in Kubernetes. It is an alpha feature in Kubernetes v1.25.

File and block storage are treated as first class citizens in the Kubernetes ecosystem via [Container Storage Interface](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) (CSI). Workloads using CSI volumes enjoy the benefits of portability across vendors and across Kubernetes clusters without the need to change application manifests. An equivalent standard does not exist for Object storage.

Object storage has been rising in popularity in recent years as an alternative form of storage to filesystems and block devices. Object storage paradigm promotes disaggregation of compute and storage. This is done by making data available over the network, rather than locally. Disaggregated architectures allow compute workloads to be stateless, which consequently makes them easier to manage, scale and automate.
-->
本文介绍了容器对象存储接口 (COSI)，它是在 Kubernetes 中制备和使用对象存储的一个标准。
它是 Kubernetes v1.25 中的一个 Alpha 功能。

文件和块存储通过 [Container Storage Interface](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) (CSI)
被视为 Kubernetes 生态系统中的一等公民。
使用 CSI 卷的工作负载可以享受跨供应商和跨 Kubernetes 集群的可移植性优势，
而无需更改应用程序清单。对象存储不存在等效标准。

近年来，对象存储作为文件系统和块设备的替代存储形式越来越受欢迎。
对象存储范式促进了计算和存储的分解，这是通过网络而不是本地提供数据来完成的。
分解的架构允许计算工作负载是无状态的，从而使它们更易于管理、扩展和自动化。

## COSI

<!--

COSI aims to standardize consumption of object storage to provide the following benefits:

* Kubernetes Native - Use the Kubernetes API to provision, configure and manage buckets
* Self Service - A clear delineation between administration and operations (DevOps) to enable self-service capability for DevOps personnel
* Portability - Vendor neutrality enabled through portability across Kubernetes Clusters and across Object Storage vendors

_Portability across vendors is only possible when both vendors support a common datapath-API. Eg. it is possible to port from AWS S3 to Ceph, or AWS S3 to MinIO and back as they all use S3 API. In contrast, it is not possible to port from AWS S3 and Google Cloud’s GCS or vice versa._
-->
COSI 旨在标准化对象存储的使用，以提供以下好处：

* Kubernetes 原生 - 使用 Kubernetes API 来制备、配置和管理 Bucket
* 自助服务 - 明确划分管理和运营 (DevOps)，为 DevOps 人员赋予自助服务能力
* 可移植性 - 通过跨 Kubernetes 集群和跨对象存储供应商的可移植性实现供应商中立性

**跨供应商的可移植性只有在两家供应商都支持通用数据路径 API 时才有可能。
例如，可以从 AWS S3 移植到 Ceph，或从 AWS S3 移植到 MinIO 以及反向操作，因为它们都使用 S3 API。
但是无法从 AWS S3 和 Google Cloud 的 GCS 移植，反之亦然。**

<!--
## Architecture
-->
## 架构

<!--
COSI is made up of three components:

* COSI Controller Manager
* COSI Sidecar
* COSI Driver
-->
COSI 由三个部分组成：

* COSI 控制器管理器
* COSI 边车
* COSI 驱动程序

<!--
The COSI Controller Manager acts as the main controller that processes changes to COSI API objects. It is responsible for fielding requests for bucket creation, updates, deletion and access management. One instance of the controller manager is required per kubernetes cluster. Only one is needed even if multiple object storage providers are used in the cluster. 

The COSI Sidecar acts as a translator between COSI API requests and vendor-specific COSI Drivers. This component uses a standardized gRPC protocol that vendor drivers are expected to satisfy. 

The COSI Driver is the vendor specific component that receives requests from the sidecar and calls the appropriate vendor APIs to create buckets, manage their lifecycle and manage access to them. 
-->
COSI 控制器管理器充当处理 COSI API 对象更改的主控制器，它负责处理 Bucket 创建、更新、删除和访问管理的请求。
每个 Kubernetes 集群都需要一个控制器管理器实例。即使集群中使用了多个对象存储提供程序，也只需要一个。

COSI 边车充当 COSI API 请求和供应商特定 COSI 驱动程序之间的转换器。
该组件使用供应商驱动程序应满足的标准化 gRPC 协议。

COSI 驱动程序是供应商特定组件，它接收来自 sidecar 的请求并调用适当的供应商 API 以创建 Bucket、 
管理其生命周期及对它们的访问。

<!--
## API

The COSI API is centered around buckets, since bucket is the unit abstraction for object storage. COSI defines three Kubernetes APIs aimed at managing them

* Bucket
* BucketClass
* BucketClaim
-->
## 接口

COSI 接口 以 Bucket 为中心，因为 Bucket 是对象存储的抽象单元。COSI 定义了三个旨在管理它们的 Kubernetes API

* Bucket
* BucketClass
* BucketClaim

<!--
In addition, two more APIs for managing access to buckets are also defined:

* BucketAccess
* BucketAccessClass
-->
此外，还定义了另外两个用于管理对 Bucket 的访问的 API：

* BucketAccess
* BucketAccessClass

<!--
In a nutshell, Bucket and BucketClaim can be considered to be similar to PersistentVolume and PersistentVolumeClaim respectively. The BucketClass’ counterpart in the file/block device world is StorageClass. 

Since Object Storage is always authenticated, and over the network, access credentials are required to access buckets. The two APIs, namely, BucketAccess and BucketAccessClass are used to denote access credentials and policies for authentication. More info about these APIs can be found in the official COSI proposal - https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1979-object-storage-support
-->
简而言之，Bucket 和 BucketClaim 可以认为分别类似于 PersistentVolume 和 PersistentVolumeClaim。
BucketClass 在文件/块设备世界中对应的是 StorageClass。

由于对象存储始终通过网络进行身份验证，因此需要访问凭证才能访问 Bucket。
BucketAccess 和 BucketAccessClass 这两个 API 用于表示访问凭证和身份验证策略。
有关这些 API 的更多信息可以在官方 COSI 提案中找到 - https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1979-object-storage-support

<!--
## Self-Service

Other than providing kubernetes-API driven bucket management, COSI also aims to empower DevOps personnel to provision and manage buckets on their own, without admin intervention. This, further enabling dev teams to realize faster turn-around times and faster time-to-market. 

COSI achieves this by dividing bucket provisioning steps among two different stakeholders, namely the administrator (admin), and the cluster operator. The administrator will be responsible for setting broad policies and limits on how buckets are provisioned, and how access is obtained for them. The cluster operator will be free to create and utilize buckets within the limits set by the admin. 

For example, a cluster operator could use an admin policy could be used to restrict maximum provisioned capacity to 100GB, and developers would be allowed to create buckets and store data upto that limit. Similarly for access credentials, admins would be able to restrict who can access which buckets, and developers would be able to access all the buckets available to them.
-->
## 自助服务

除了提供 kubernetes-API 驱动的 Bucket 管理之外，COSI 还旨在使 DevOps 人员能够自行配置和管理 Bucket，
而无需管理员干预。这进一步使开发团队能够实现更快的周转时间和更快的上市时间。

COSI 通过在两个不同的利益相关者（即管理员（admin）和集群操作员）之间划分 Bucket 配置步骤来实现这一点。
管理员将负责就如何配置 Bucket 以及如何获取 Bucket 的访问权限设置广泛的策略和限制。
集群操作员可以在管理员设置的限制内自由创建和使用 Bucket。

例如，集群操作员可以使用管理策略将最大预置容量限制为 100GB，并且允许开发人员创建 Bucket 并将数据存储到该限制。
同样对于访问凭证，管理员将能够限制谁可以访问哪些 Bucket，并且开发人员将能够访问他们可用的所有 Bucket。

<!--
## Portability

The third goal of COSI is to achieve vendor neutrality for bucket management. COSI enables two kinds of portability:

* Cross Cluster
* Cross Provider

Cross Cluster portability is allowing buckets provisioned in one cluster to be available in another cluster. This is only valid when the object storage backend itself is accessible from both clusters.

Cross-provider portability is about allowing organizations or teams to move from one object storage provider to another seamlessly, and without requiring changes to application definitions (PodTemplates, StatefulSets, Deployment and so on). This is only possible if the source and destination providers use the same data. 

_COSI does not handle data migration as it is outside of its scope. In case porting between providers requires data to be migrated as well, then other measures need to be taken to ensure data availability._
-->
## 可移植性

COSI 的第三个目标是实现 Bucket 管理的供应商中立性。COSI 支持两种可移植性：

* 跨集群
* 跨提供商

跨集群可移植性允许在一个集群中配置的 Bucket 在另一个集群中可用。这仅在对象存储后端本身可以从两个集群访问时才有效。

跨提供商可移植性是指允许组织或团队无缝地从一个对象存储提供商迁移到另一个对象存储提供商，
而无需更改应用程序定义（PodTemplates、StatefulSets、Deployment 等）。这只有在源和目标提供者使用相同的数据时才有可能。

**COSI 不处理数据迁移，因为它超出了其范围。如果提供者之间的移植也需要迁移数据，则需要采取其他措施来确保数据可用性。**

<!--
## What’s next

The amazing sig-storage-cosi community has worked hard to bring the COSI standard to alpha status. We are looking forward to onboarding a lot of vendors to write COSI drivers and become COSI compatible! 

We want to add more authentication mechanisms for COSI buckets, we are designing advanced bucket sharing primitives, multi-cluster bucket management and much more. Lots of great ideas and opportunities ahead! 

Stay tuned for what comes next, and if you have any questions, comments or suggestions

* Chat with us on the Kubernetes [Slack:#sig-storage-cosi](https://kubernetes.slack.com/archives/C017EGC1C6N)
* Join our [Zoom meeting](https://zoom.us/j/614261834?pwd=Sk1USmtjR2t0MUdjTGVZeVVEV1BPQT09), every Thursday at 10:00 Pacific Time
* Participate in the [bucket API proposal PR](https://github.com/kubernetes/enhancements/pull/2813) to add your ideas, suggestions and more.
-->
## 接下来

令人惊叹的 sig-storage-cosi 社区一直在努力将 COSI 标准带入 Alpha 状态。
我们期待很多供应商加入编写 COSI 驱动程序并与 COSI 兼容！

我们希望为 COSI Bucket 添加更多身份验证机制，我们正在设计高级存储桶共享原语、多集群存储桶管理等等。
未来有很多伟大的想法和机会！

请继续关注接下来的内容，如果你有任何问题、意见或建议分解的架构允许计算工作负载是无状态

* 在 Kubernetes 上与我们讨论 [Slack:#sig-storage-cosi](https://kubernetes.slack.com/archives/C017EGC1C6N)
* 参加我们的 [Zoom 会议](https://zoom.us/j/614261834?pwd=Sk1USmtjR2t0MUdjTGVZeVVEV1BPQT09)，每周四太平洋时间 10:00
* 参与 [bucket API 提案 PR](https://github.com/kubernetes/enhancements/pull/2813) 提出你的想法、建议等。

