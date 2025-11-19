---
layout: blog
title: "COSI 簡介：使用 Kubernetes API 管理對象存儲"
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
本文介紹了容器對象存儲接口 (COSI)，它是在 Kubernetes 中製備和使用對象存儲的一個標準。
它是 Kubernetes v1.25 中的一個 Alpha 功能。

文件和塊存儲通過 [Container Storage Interface](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) (CSI)
被視爲 Kubernetes 生態系統中的一等公民。
使用 CSI 卷的工作負載可以享受跨供應商和跨 Kubernetes 叢集的可移植性優勢，
而無需更改應用程序清單。對象存儲不存在等效標準。

近年來，對象存儲作爲文件系統和塊設備的替代存儲形式越來越受歡迎。
對象存儲範式促進了計算和存儲的分解，這是通過網路而不是本地提供數據來完成的。
分解的架構允許計算工作負載是無狀態的，從而使它們更易於管理、擴展和自動化。

## COSI

<!--

COSI aims to standardize consumption of object storage to provide the following benefits:

* Kubernetes Native - Use the Kubernetes API to provision, configure and manage buckets
* Self Service - A clear delineation between administration and operations (DevOps) to enable self-service capability for DevOps personnel
* Portability - Vendor neutrality enabled through portability across Kubernetes Clusters and across Object Storage vendors

_Portability across vendors is only possible when both vendors support a common datapath-API. Eg. it is possible to port from AWS S3 to Ceph, or AWS S3 to MinIO and back as they all use S3 API. In contrast, it is not possible to port from AWS S3 and Google Cloud’s GCS or vice versa._
-->
COSI 旨在標準化對象存儲的使用，以提供以下好處：

* Kubernetes 原生 - 使用 Kubernetes API 來製備、設定和管理 Bucket
* 自助服務 - 明確劃分管理和運營 (DevOps)，爲 DevOps 人員賦予自助服務能力
* 可移植性 - 通過跨 Kubernetes 叢集和跨對象存儲供應商的可移植性實現供應商中立性

**跨供應商的可移植性只有在兩家供應商都支持通用數據路徑 API 時纔有可能。
例如，可以從 AWS S3 移植到 Ceph，或從 AWS S3 移植到 MinIO 以及反向操作，因爲它們都使用 S3 API。
但是無法從 AWS S3 和 Google Cloud 的 GCS 移植，反之亦然。**

<!--
## Architecture
-->
## 架構

<!--
COSI is made up of three components:

* COSI Controller Manager
* COSI Sidecar
* COSI Driver
-->
COSI 由三個部分組成：

* COSI 控制器管理器
* COSI 邊車
* COSI 驅動程序

<!--
The COSI Controller Manager acts as the main controller that processes changes to COSI API objects. It is responsible for fielding requests for bucket creation, updates, deletion and access management. One instance of the controller manager is required per kubernetes cluster. Only one is needed even if multiple object storage providers are used in the cluster. 

The COSI Sidecar acts as a translator between COSI API requests and vendor-specific COSI Drivers. This component uses a standardized gRPC protocol that vendor drivers are expected to satisfy. 

The COSI Driver is the vendor specific component that receives requests from the sidecar and calls the appropriate vendor APIs to create buckets, manage their lifecycle and manage access to them. 
-->
COSI 控制器管理器充當處理 COSI API 對象更改的主控制器，它負責處理 Bucket 創建、更新、刪除和訪問管理的請求。
每個 Kubernetes 叢集都需要一個控制器管理器實例。即使叢集中使用了多個對象存儲提供程序，也只需要一個。

COSI 邊車充當 COSI API 請求和供應商特定 COSI 驅動程序之間的轉換器。
該組件使用供應商驅動程序應滿足的標準化 gRPC 協議。

COSI 驅動程序是供應商特定組件，它接收來自 sidecar 的請求並調用適當的供應商 API 以創建 Bucket、 
管理其生命週期及對它們的訪問。

<!--
## API

The COSI API is centered around buckets, since bucket is the unit abstraction for object storage. COSI defines three Kubernetes APIs aimed at managing them

* Bucket
* BucketClass
* BucketClaim
-->
## 接口

COSI 接口 以 Bucket 爲中心，因爲 Bucket 是對象存儲的抽象單元。COSI 定義了三個旨在管理它們的 Kubernetes API

* Bucket
* BucketClass
* BucketClaim

<!--
In addition, two more APIs for managing access to buckets are also defined:

* BucketAccess
* BucketAccessClass
-->
此外，還定義了另外兩個用於管理對 Bucket 的訪問的 API：

* BucketAccess
* BucketAccessClass

<!--
In a nutshell, Bucket and BucketClaim can be considered to be similar to PersistentVolume and PersistentVolumeClaim respectively. The BucketClass’ counterpart in the file/block device world is StorageClass. 

Since Object Storage is always authenticated, and over the network, access credentials are required to access buckets. The two APIs, namely, BucketAccess and BucketAccessClass are used to denote access credentials and policies for authentication. More info about these APIs can be found in the official COSI proposal - https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1979-object-storage-support
-->
簡而言之，Bucket 和 BucketClaim 可以認爲分別類似於 PersistentVolume 和 PersistentVolumeClaim。
BucketClass 在文件/塊設備世界中對應的是 StorageClass。

由於對象存儲始終通過網路進行身份驗證，因此需要訪問憑證才能訪問 Bucket。
BucketAccess 和 BucketAccessClass 這兩個 API 用於表示訪問憑證和身份驗證策略。
有關這些 API 的更多信息可以在官方 COSI 提案中找到 - https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1979-object-storage-support

<!--
## Self-Service

Other than providing kubernetes-API driven bucket management, COSI also aims to empower DevOps personnel to provision and manage buckets on their own, without admin intervention. This, further enabling dev teams to realize faster turn-around times and faster time-to-market. 

COSI achieves this by dividing bucket provisioning steps among two different stakeholders, namely the administrator (admin), and the cluster operator. The administrator will be responsible for setting broad policies and limits on how buckets are provisioned, and how access is obtained for them. The cluster operator will be free to create and utilize buckets within the limits set by the admin. 

For example, a cluster operator could use an admin policy could be used to restrict maximum provisioned capacity to 100GB, and developers would be allowed to create buckets and store data upto that limit. Similarly for access credentials, admins would be able to restrict who can access which buckets, and developers would be able to access all the buckets available to them.
-->
## 自助服務

除了提供 kubernetes-API 驅動的 Bucket 管理之外，COSI 還旨在使 DevOps 人員能夠自行設定和管理 Bucket，
而無需管理員干預。這進一步使開發團隊能夠實現更快的週轉時間和更快的上市時間。

COSI 通過在兩個不同的利益相關者（即管理員（admin）和叢集操作員）之間劃分 Bucket 設定步驟來實現這一點。
管理員將負責就如何設定 Bucket 以及如何獲取 Bucket 的訪問權限設置廣泛的策略和限制。
叢集操作員可以在管理員設置的限制內自由創建和使用 Bucket。

例如，叢集操作員可以使用管理策略將最大預置容量限制爲 100GB，並且允許開發人員創建 Bucket 並將數據存儲到該限制。
同樣對於訪問憑證，管理員將能夠限制誰可以訪問哪些 Bucket，並且開發人員將能夠訪問他們可用的所有 Bucket。

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

COSI 的第三個目標是實現 Bucket 管理的供應商中立性。COSI 支持兩種可移植性：

* 跨叢集
* 跨提供商

跨叢集可移植性允許在一個叢集中設定的 Bucket 在另一個叢集中可用。這僅在對象存儲後端本身可以從兩個叢集訪問時纔有效。

跨提供商可移植性是指允許組織或團隊無縫地從一個對象存儲提供商遷移到另一個對象存儲提供商，
而無需更改應用程序定義（PodTemplates、StatefulSets、Deployment 等）。這只有在源和目標提供者使用相同的數據時纔有可能。

**COSI 不處理數據遷移，因爲它超出了其範圍。如果提供者之間的移植也需要遷移數據，則需要採取其他措施來確保數據可用性。**

<!--
## What’s next

The amazing sig-storage-cosi community has worked hard to bring the COSI standard to alpha status. We are looking forward to onboarding a lot of vendors to write COSI drivers and become COSI compatible! 

We want to add more authentication mechanisms for COSI buckets, we are designing advanced bucket sharing primitives, multi-cluster bucket management and much more. Lots of great ideas and opportunities ahead! 

Stay tuned for what comes next, and if you have any questions, comments or suggestions

* Chat with us on the Kubernetes [Slack:#sig-storage-cosi](https://kubernetes.slack.com/archives/C017EGC1C6N)
* Join our [Zoom meeting](https://zoom.us/j/614261834?pwd=Sk1USmtjR2t0MUdjTGVZeVVEV1BPQT09), every Thursday at 10:00 Pacific Time
* Participate in the [bucket API proposal PR](https://github.com/kubernetes/enhancements/pull/2813) to add your ideas, suggestions and more.
-->
## 接下來

令人驚歎的 sig-storage-cosi 社區一直在努力將 COSI 標準帶入 Alpha 狀態。
我們期待很多供應商加入編寫 COSI 驅動程序並與 COSI 兼容！

我們希望爲 COSI Bucket 添加更多身份驗證機制，我們正在設計高級存儲桶共享原語、多叢集存儲桶管理等等。
未來有很多偉大的想法和機會！

請繼續關注接下來的內容，如果你有任何問題、意見或建議分解的架構允許計算工作負載是無狀態

* 在 Kubernetes 上與我們討論 [Slack:#sig-storage-cosi](https://kubernetes.slack.com/archives/C017EGC1C6N)
* 參加我們的 [Zoom 會議](https://zoom.us/j/614261834?pwd=Sk1USmtjR2t0MUdjTGVZeVVEV1BPQT09)，每週四太平洋時間 10:00
* 參與 [bucket API 提案 PR](https://github.com/kubernetes/enhancements/pull/2813) 提出你的想法、建議等。

