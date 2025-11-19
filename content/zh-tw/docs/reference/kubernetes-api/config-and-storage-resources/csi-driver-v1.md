---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIDriver"
content_type: "api_reference"
description: "CSIDriver 抓取叢集上部署的容器存儲接口（CSI）卷驅動有關的信息。"
title: "CSIDriver"
weight: 3
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIDriver"
content_type: "api_reference"
description: "CSIDriver captures information about a Container Storage Interface (CSI) volume driver deployed on the cluster."
title: "CSIDriver"
weight: 3
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSIDriver {#CSIDriver}

<!--
CSIDriver captures information about a Container Storage Interface (CSI) volume driver deployed on the cluster. Kubernetes attach detach controller uses this object to determine whether attach is required. Kubelet uses this object to determine whether pod information needs to be passed on mount. CSIDriver objects are non-namespaced.
-->
CSIDriver 抓取叢集上部署的容器存儲接口（CSI）卷驅動有關的信息。
Kubernetes 掛接/解除掛接控制器使用此對象來決定是否需要掛接。
Kubelet 使用此對象決定掛載時是否需要傳遞 Pod 信息。
CSIDriver 對象未劃分命名空間。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIDriver

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata. metadata.Name indicates the name of the CSI driver that this object refers to; it MUST be the same name returned by the CSI GetPluginName() call for that driver. The driver name must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), dots (.), and alphanumerics between. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriverSpec" >}}">CSIDriverSpec</a>), required

  spec represents the specification of the CSI Driver.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  
  標準的對象元數據。
  `metadata.name` 表示此對象引用的 CSI 驅動的名稱；
  它必須與該驅動的 CSI GetPluginName() 調用返回的名稱相同。
  驅動名稱不得超過 63 個字符，以字母、數字（[a-z0-9A-Z]）開頭和結尾，
  中間可包含短劃線（-）、英文句點（.）、字母和數字。
  更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriverSpec" >}}">CSIDriverSpec</a>)，必需
  
  spec 表示 CSI 驅動的規約。

## CSIDriverSpec {#CSIDriverSpec}

<!--
CSIDriverSpec is the specification of a CSIDriver.
-->
CSIDriverSpec 是 CSIDriver 的規約。

<hr>

<!--
- **attachRequired** (boolean)
  attachRequired indicates this CSI volume driver requires an attach operation (because it implements the CSI ControllerPublishVolume() method), and that the Kubernetes attach detach controller should call the attach volume interface which checks the volumeattachment status and waits until the volume is attached before proceeding to mounting. The CSI external-attacher coordinates with CSI volume driver and updates the volumeattachment status when the attach operation is complete. If the value is specified to false, the attach operation will be skipped. Otherwise the attach operation will be called.

  This field is immutable.
-->
- **attachRequired** (boolean)
  
  attachRequired 表示這個 CSI 卷驅動需要掛接操作
  （因爲它實現了 CSI ControllerPublishVolume() 方法），
  Kubernetes 掛接/解除掛接控制器應調用掛接卷接口，
  以檢查卷掛接（volumeattachment）狀態並在繼續掛載之前等待卷被掛接。
  CSI 外部掛接器與 CSI 卷驅動配合使用，並在掛接操作完成時更新 volumeattachment 狀態。
  如果值指定爲 false，則會跳過掛載操作。否則，將調用掛載操作。
  
  此字段不可變更。

<!--
- **fsGroupPolicy** (string)

  fsGroupPolicy defines if the underlying volume supports changing ownership and permission of the volume before being mounted. Refer to the specific FSGroupPolicy values for additional details.
  
  This field was immutable in Kubernetes \< 1.29 and now is mutable.
  
  Defaults to ReadWriteOnceWithFSType, which will examine each volume to determine if Kubernetes should modify ownership and permissions of the volume. With the default policy the defined fsGroup will only be applied if a fstype is defined and the volume's access mode contains ReadWriteOnce.
-->
- **fsGroupPolicy** (string)
  
  fsGroupPolicy 定義底層卷是否支持在掛載之前更改卷的所有權和權限。
  有關更多詳細信息，請參考特定的 FSGroupPolicy 值。
  
  此字段在 Kubernetes 1.29 版本之前不可變更，現在可變更。
  
  默認爲 ReadWriteOnceWithFSType，這會檢查每個卷，以決定 Kubernetes 是否應修改卷的所有權和權限。
  採用默認策略時，如果定義了 fstype 且卷的訪問模式包含 ReadWriteOnce，將僅應用定義的 fsGroup。

<!--
- **nodeAllocatableUpdatePeriodSeconds** (int64)

  nodeAllocatableUpdatePeriodSeconds specifies the interval between periodic updates of the CSINode allocatable capacity for this driver. When set, both periodic updates and updates triggered by capacity-related failures are enabled. If not set, no updates occur (neither periodic nor upon detecting capacity-related failures), and the allocatable.count remains static. The minimum allowed value for this field is 10 seconds.
-->
- **nodeAllocatableUpdatePeriodSeconds** (int64)

  nodeAllocatableUpdatePeriodSeconds 指定了 CSINode
  針對此驅動對可分配容量作定期更新的時間間隔。
  設置後，定期更新和由容量相關故障觸發的更新均會啓用。
  如果沒有設置，則不會發生更新（無論是定期更新還是檢測到與容量相關的故障），
   並且 `allocatable.count` 保持爲固定值。此字段允許的最小值爲 10 秒。

  <!--
  This is an beta feature and requires the MutableCSINodeAllocatableCount feature gate to be enabled.
  
  This field is mutable.
  -->

  這是一個 Beta 級別特性，需要啓用特性門控 MutableCSINodeAllocatableCount。

  此字段是可變更的。

<!--
- **podInfoOnMount** (boolean)

  podInfoOnMount indicates this CSI volume driver requires additional pod information (like podName, podUID, etc.) during mount operations, if set to true. If set to false, pod information will not be passed on mount. Default is false.
-->
- **podInfoOnMount** (boolean)

  如果 podInfoOnMount 設爲 true，則表示在掛載操作期間這個 CSI 卷驅動需要更多的
  Pod 信息（例如 podName 和 podUID 等）。
  如果設爲 false，則掛載時將不傳遞 Pod 信息。默認爲 false。
  
  <!--
  The CSI driver specifies podInfoOnMount as part of driver deployment. If true, Kubelet will pass pod information as VolumeContext in the CSI NodePublishVolume() calls. The CSI driver is responsible for parsing and validating the information passed in as VolumeContext.
  
  The following VolumeContext will be passed if podInfoOnMount is set to true. This list might grow, but the prefix will be used. "csi.storage.k8s.io/pod.name": pod.Name "csi.storage.k8s.io/pod.namespace": pod.Namespace "csi.storage.k8s.io/pod.uid": string(pod.UID) "csi.storage.k8s.io/ephemeral": "true" if the volume is an ephemeral inline volume
                                  defined by a CSIVolumeSource, otherwise "false"
  -->

  CSI 驅動將 podInfoOnMount 指定爲驅動部署的一部分。
  如果爲 true，Kubelet 將在 CSI NodePublishVolume() 調用中作爲 VolumeContext 傳遞 Pod 信息。
  CSI 驅動負責解析和校驗作爲 VolumeContext 傳遞進來的信息。

  如果 podInfoOnMount 設爲 true，將傳遞以下 VolumeConext。
  此列表可能變大，但將使用前綴。

  - "csi.storage.k8s.io/pod.name": pod.name
  - "csi.storage.k8s.io/pod.namespace": pod.namespace
  - "csi.storage.k8s.io/pod.uid": string(pod.UID)
  - "csi.storage.k8s.io/ephemeral":
    如果此卷是 CSIVolumeSource 定義的一個臨時內聯卷，則爲 “true”，否則爲 “false”

  <!--
  "csi.storage.k8s.io/ephemeral" is a new feature in Kubernetes 1.16. It is only required for drivers which support both the "Persistent" and "Ephemeral" VolumeLifecycleMode. Other drivers can leave pod info disabled and/or ignore this field. As Kubernetes 1.15 doesn't support this field, drivers can only support one mode when deployed on such a cluster and the deployment determines which mode that is, for example via a command line parameter of the driver.
  
  This field was immutable in Kubernetes \< 1.29 and now is mutable.
  -->

  “csi.storage.k8s.io/ephemeral” 是 Kubernetes 1.16 中一個新的功能特性。
  只有同時支持 “Persistent” 和 “Ephemeral” VolumeLifecycleMode 的驅動，此字段纔是必需的。
  其他驅動可以保持禁用 Pod 信息或忽略此字段。
  由於 Kubernetes 1.15 不支持此字段，所以在這類叢集上部署驅動時，只能支持一種模式。
  該部署就決定了是哪種模式，例如通過驅動的命令列參數。
  
  此字段在 Kubernetes 1.29 版本之前不可變更，現在可變更。

<!--
- **requiresRepublish** (boolean)

  requiresRepublish indicates the CSI driver wants `NodePublishVolume` being periodically called to reflect any possible change in the mounted volume. This field defaults to false.
  
  Note: After a successful initial NodePublishVolume call, subsequent calls to NodePublishVolume should only update the contents of the volume. New mount points will not be seen by a running container.
-->
- **requiresRepublish** (boolean)
  
  requiresRepublish 表示 CSI 驅動想要 `NodePublishVolume` 被週期性地調用，
  以反映已掛載卷中的任何可能的變化。
  此字段默認爲 false。
  
  注：成功完成對 NodePublishVolume 的初始調用後，對 NodePublishVolume 的後續調用只應更新卷的內容。
  新的掛載點將不會被運行的容器察覺。

<!--
- **seLinuxMount** (boolean)

  seLinuxMount specifies if the CSI driver supports "-o context" mount option.
  
  When "true", the CSI driver must ensure that all volumes provided by this CSI driver can be mounted separately with different `-o context` options. This is typical for storage backends that provide volumes as filesystems on block devices or as independent shared volumes. Kubernetes will call NodeStage / NodePublish with "-o context=xyz" mount option when mounting a ReadWriteOncePod volume used in Pod that has explicitly set SELinux context. In the future, it may be expanded to other volume AccessModes. In any case, Kubernetes will ensure that the volume is mounted only with a single SELinux context.
-->
- **seLinuxMount** (boolean)

  seLinuxMount 指定 CSI 驅動是否支持 "-o context" 掛載選項。

  當值爲 “true” 時，CSI 驅動必須確保該 CSI 驅動提供的所有卷可以分別用不同的 `-o context` 選項進行掛載。
  這對於將卷作爲塊設備上的文件系統或作爲獨立共享卷提供的存儲後端來說是典型的方法。
  當 Kubernetes 掛載在 Pod 中使用的已顯式設置 SELinux 上下文的 ReadWriteOncePod 卷時，
  將使用 "-o context=xyz" 掛載選項調用 NodeStage / NodePublish。
  未來可能會擴展到其他的卷訪問模式（AccessModes）。在任何情況下，Kubernetes 都會確保該卷僅使用同一 SELinux 上下文進行掛載。

  <!--
  When "false", Kubernetes won't pass any special SELinux mount options to the driver. This is typical for volumes that represent subdirectories of a bigger shared filesystem.
  
  Default is "false".
  -->

  當值爲 “false” 時，Kubernetes 不會將任何特殊的 SELinux 掛載選項傳遞給驅動。
  這通常用於代表更大共享文件系統的子目錄的卷。
  
  默認爲 “false”。

<!--
- **storageCapacity** (boolean)

  storageCapacity indicates that the CSI volume driver wants pod scheduling to consider the storage capacity that the driver deployment will report by creating CSIStorageCapacity objects with capacity information, if set to true.
  
  The check can be enabled immediately when deploying a driver. In that case, provisioning new volumes with late binding will pause until the driver deployment has published some suitable CSIStorageCapacity object.
  
  Alternatively, the driver can be deployed with the field unset or false and it can be flipped later when storage capacity information has been published.
  
  This field was immutable in Kubernetes \<= 1.22 and now is mutable.
-->
- **storageCapacity** (boolean)
  
  如果設爲 true，則 storageCapacity 表示 CSI 卷驅動希望 Pod 調度時考慮存儲容量，
  驅動部署將通過創建包含容量信息的 CSIStorageCapacity 對象來報告該存儲容量。
  
  部署驅動時可以立即啓用這個檢查。
  這種情況下，只有此驅動部署已發佈某些合適的 CSIStorageCapacity 對象，
  纔會繼續製備新的卷，然後進行綁定。
  
  換言之，可以在未設置此字段或此字段爲 false 的情況下部署驅動，
  並且可以在發佈存儲容量信息後再修改此字段。
  
  此字段在 Kubernetes 1.22 及更早版本中不可變更，但現在可以變更。

<!--
- **tokenRequests** ([]TokenRequest)

  *Atomic: will be replaced during a merge*
  
  tokenRequests indicates the CSI driver needs pods' service account tokens it is mounting volume for to do necessary authentication. Kubelet will pass the tokens in VolumeContext in the CSI NodePublishVolume calls. The CSI driver should parse and validate the following VolumeContext: "csi.storage.k8s.io/serviceAccount.tokens": {
    "\<audience>": {
      "token": \<token>,
      "expirationTimestamp": \<expiration timestamp in RFC3339>,
    },
    ...
  }
-->
- **tokenRequests** ([]TokenRequest)
  
  **原子性：將在合併期間被替換**
  
  tokenRequests 表示 CSI 驅動需要供掛載卷所用的 Pod 的服務帳戶令牌，進行必要的鑑權。
  Kubelet 將在 CSI NodePublishVolume 調用中傳遞 VolumeContext 中的令牌。
  CSI 驅動應解析和校驗以下 VolumeContext：

  ```
  "csi.storage.k8s.io/serviceAccount.tokens": {
    "<audience>": {
      "token": <令牌>,
      "expirationTimestamp": <格式爲 RFC3339 的過期時間戳>,
    },
    ...
  }
  ```

  <!--
  Note: Audience in each TokenRequest should be different and at most one token is empty string. To receive a new token after expiry, RequiresRepublish can be used to trigger NodePublishVolume periodically.

  <a name="TokenRequest"></a>
  *TokenRequest contains parameters of a service account token.*
  -->

  注：每個 tokenRequest 中的受衆應該不同，且最多有一個令牌是空字符串。
  要在令牌過期後接收一個新的令牌，requiresRepublish 可用於週期性地觸發 NodePublishVolume。
  
  <a name="TokenRequest"></a>
  **tokenRequest 包含一個服務帳戶令牌的參數。**

  <!--
  - **tokenRequests.audience** (string), required

    audience is the intended audience of the token in "TokenRequestSpec". It will default to the audiences of kube apiserver.

  - **tokenRequests.expirationSeconds** (int64)

    expirationSeconds is the duration of validity of the token in "TokenRequestSpec". It has the same default value of "ExpirationSeconds" in "TokenRequestSpec".
  -->

  - **tokenRequests.audience** (string)，必需

    audience 是 “TokenRequestSpec” 中令牌的目標受衆。
    它默認爲 kube apiserver 的受衆。
  
  - **tokenRequests.expirationSeconds** (int64)

    expirationSeconds 是 “TokenRequestSpec” 中令牌的有效期。
    它具有與 “TokenRequestSpec” 中 “expirationSeconds” 相同的默認值。

<!--
- **volumeLifecycleModes** ([]string)

  *Set: unique values will be kept during a merge*
  
  volumeLifecycleModes defines what kind of volumes this CSI volume driver supports. The default if the list is empty is "Persistent", which is the usage defined by the CSI specification and implemented in Kubernetes via the usual PV/PVC mechanism.
-->
- **volumeLifecycleModes** ([]string)
  
  **集合：唯一值將在合併期間被保留**
  
  volumeLifecycleModes 定義這個 CSI 卷驅動支持哪種類別的卷。
  如果列表爲空，則默認值爲 “Persistent”，這是 CSI 規範定義的用法，
  並通過常用的 PV/PVC 機制在 Kubernetes 中實現。

  <!--
  The other mode is "Ephemeral". In this mode, volumes are defined inline inside the pod spec with CSIVolumeSource and their lifecycle is tied to the lifecycle of that pod. A driver has to be aware of this because it is only going to get a NodePublishVolume call for such a volume.
  
  For more information about implementing this mode, see https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html A driver can support one or more of these modes and more modes may be added in the future.
  
  This field is beta. This field is immutable.
  -->

  另一種模式是 “Ephemeral”。
  在這種模式下，在 Pod 規約中用 CSIVolumeSource 以內聯方式定義卷，其生命週期與該 Pod 的生命週期相關聯。
  驅動必須感知到這一點，因爲只有針對這種卷纔會接收到 NodePublishVolume 調用。

  有關實現此模式的更多信息，請參閱
  https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html。
  驅動可以支持其中一種或多種模式，將來可能會添加更多模式。
  
  此字段處於 Beta 階段。此字段不可變更。

## CSIDriverList {#CSIDriverList}

<!--
CSIDriverList is a collection of CSIDriver objects.
-->
CSIDriverList 是 CSIDriver 對象的集合。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIDriverList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>), required

  items is the list of CSIDriver
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>)，必需

  items 是 CSIDriver 的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified CSIDriver

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 CSIDriver

#### HTTP 請求

GET /apis/storage.k8s.io/v1/csidrivers/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the CSIDriver

- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSIDriver 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CSIDriver

#### HTTP Request
-->
### `list` 列出或觀測類別爲 CSIDriver 的對象

#### HTTP 請求

GET /apis/storage.k8s.io/v1/csidrivers

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 參數

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriverList" >}}">CSIDriverList</a>): OK

401: Unauthorized

<!--
### `create` create a CSIDriver

#### HTTP Request
-->
### `create` 創建 CSIDriver

#### HTTP 請求

POST /apis/storage.k8s.io/v1/csidrivers

<!--
#### Parameters
- **body**: <a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified CSIDriver

#### HTTP Request
-->
### `update` 替換指定的 CSIDriver

#### HTTP 請求

PUT /apis/storage.k8s.io/v1/csidrivers/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIDriver
- **body**: <a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSIDriver 的名稱。

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified CSIDriver

#### HTTP Request
-->
### `patch` 部分更新指定的 CSIDriver

#### HTTP 請求

PATCH /apis/storage.k8s.io/v1/csidrivers/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIDriver
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSIDriver 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Created

401: Unauthorized

<!--
### `delete` delete a CSIDriver

#### HTTP Request
-->
### `delete` 刪除 CSIDriver

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/csidrivers/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIDriver
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSIDriver 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of CSIDriver

#### HTTP Request
-->
### `deletecollection` 刪除 CSIDriver 的集合

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/csidrivers

<!--
#### Parameters

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 參數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
