---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIDriver"
content_type: "api_reference"
description: "CSIDriver 抓取叢集上部署的容器儲存介面（CSI）卷驅動有關的資訊。"
title: "CSIDriver"
weight: 8
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIDriver"
content_type: "api_reference"
description: "CSIDriver captures information about a Container Storage Interface (CSI) volume driver deployed on the cluster."
title: "CSIDriver"
weight: 8
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSIDriver {#CSIDriver}

<!--
CSIDriver captures information about a Container Storage Interface (CSI) volume driver deployed on the cluster. Kubernetes attach detach controller uses this object to determine whether attach is required. Kubelet uses this object to determine whether pod information needs to be passed on mount. CSIDriver objects are non-namespaced.
-->
CSIDriver 抓取叢集上部署的容器儲存介面（CSI）卷驅動有關的資訊。
Kubernetes 掛接/解除掛接控制器使用此物件來決定是否需要掛接。
Kubelet 使用此物件決定掛載時是否需要傳遞 Pod 資訊。
CSIDriver 物件未劃分名稱空間。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIDriver

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard object metadata. metadata.Name indicates the name of the CSI driver that this object refers to; it MUST be the same name returned by the CSI GetPluginName() call for that driver. The driver name must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), dots (.), and alphanumerics between. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriverSpec" >}}">CSIDriverSpec</a>), required
  Specification of the CSI Driver.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  
  標準的物件元資料。
  `metadata.name` 表示此物件引用的 CSI 驅動的名稱；
  它必須與該驅動的 CSI GetPluginName() 呼叫返回的名稱相同。
  驅動名稱不得超過 63 個字元，以字母、數字（[a-z0-9A-Z]）開頭和結尾，
  中間可包含短劃線（-）、英文句點（.）、字母和數字。
  更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriverSpec" >}}">CSIDriverSpec</a>)，必需
  
  CSI 驅動的規約。

## CSIDriverSpec {#CSIDriverSpec}

<!--
CSIDriverSpec is the specification of a CSIDriver.
-->
CSIDriverSpec 是 CSIDriver 的規約。

<hr>

<!--
- **attachRequired** (boolean)
  attachRequired indicates this CSI volume driver requires an attach operation (because it implements the CSI ControllerPublishVolume() method), and that the Kubernetes attach detach controller should call the attach volume interface which checks the volumeattachment status and waits until the volume is attached before proceeding to mounting. The CSI external-attacher coordinates with CSI volume driver and updates the volumeattachment status when the attach operation is complete. If the CSIDriverRegistry feature gate is enabled and the value is specified to false, the attach operation will be skipped. Otherwise the attach operation will be called.
  
  This field is immutable.
-->
- **attachRequired** (boolean)
  
  attachRequired 表示這個 CSI 卷驅動需要掛接操作
  （因為它實現了 CSI ControllerPublishVolume() 方法），
  Kubernetes 掛接/解除掛接控制器應呼叫掛接卷介面，
  以檢查卷掛接（volumeattachment）狀態並在繼續掛載之前等待卷被掛接。
  CSI 外部掛接器與 CSI 卷驅動配合使用，並在掛接操作完成時更新 volumeattachment 狀態。
  如果 CSIDriverRegistry 特性門控被啟用且此值指定為 false，將跳過掛接操作。
  否則將呼叫掛接操作。
  
  此欄位不可變更。

<!--
- **fsGroupPolicy** (string)
  Defines if the underlying volume supports changing ownership and permission of the volume before being mounted. Refer to the specific FSGroupPolicy values for additional details.
  
  This field is immutable.
  
  Defaults to ReadWriteOnceWithFSType, which will examine each volume to determine if Kubernetes should modify ownership and permissions of the volume. With the default policy the defined fsGroup will only be applied if a fstype is defined and the volume's access mode contains ReadWriteOnce.
-->
- **fsGroupPolicy** (string)
  
  定義底層卷是否支援在掛載之前更改卷的所有權和許可權。
  有關更多詳細資訊，請參考特定的 FSGroupPolicy 值。
  
  此欄位不可變更。
  
  預設為 ReadWriteOnceWithFSType，這會檢查每個卷，以決定 Kubernetes 是否應修改卷的所有權和許可權。
  採用預設策略時，如果定義了 fstype 且卷的訪問模式包含 ReadWriteOnce，將僅應用定義的 fsGroup。

<!--
- **podInfoOnMount** (boolean)
  If set to true, podInfoOnMount indicates this CSI volume driver requires additional pod information (like podName, podUID, etc.) during mount operations. If set to false, pod information will not be passed on mount. Default is false. The CSI driver specifies podInfoOnMount as part of driver deployment. If true, Kubelet will pass pod information as VolumeContext in the CSI NodePublishVolume() calls. The CSI driver is responsible for parsing and validating the information passed in as VolumeContext. The following VolumeConext will be passed if podInfoOnMount is set to true. This list might grow, but the prefix will be used. "csi.storage.k8s.io/pod.name": pod.Name "csi.storage.k8s.io/pod.namespace": pod.Namespace "csi.storage.k8s.io/pod.uid": string(pod.UID) "csi.storage.k8s.io/ephemeral": "true" if the volume is an ephemeral inline volume defined by a CSIVolumeSource, otherwise "false"
  
  "csi.storage.k8s.io/ephemeral" is a new feature in Kubernetes 1.16. It is only required for drivers which support both the "Persistent" and "Ephemeral" VolumeLifecycleMode. Other drivers can leave pod info disabled and/or ignore this field. As Kubernetes 1.15 doesn't support this field, drivers can only support one mode when deployed on such a cluster and the deployment determines which mode that is, for example via a command line parameter of the driver.
  
  This field is immutable.
-->
- **podInfoOnMount** (boolean)
  
  如果設為 true，則 podInfoOnMount 表示在掛載操作期間這個 CSI 卷需要更多的 Pod 資訊（例如 podName 和 podUID 等）。
  如果設為 false，則掛載時將不傳遞 Pod 資訊。
  預設為 false。
  CSI 驅動將 podInfoOnMount 指定為驅動部署的一部分。
  如果為 true，Kubelet 將在 CSI NodePublishVolume() 呼叫中作為 VolumeContext 傳遞 Pod 資訊。
  CSI 驅動負責解析和校驗作為 VolumeContext 傳遞進來的資訊。
  如果 podInfoOnMount 設為 true，將傳遞以下 VolumeConext。
  此列表可能變大，但將使用字首。
  - "csi.storage.k8s.io/pod.name": pod.name
  - "csi.storage.k8s.io/pod.namespace": pod.namespace
  - "csi.storage.k8s.io/pod.uid": string(pod.UID)
  - "csi.storage.k8s.io/ephemeral":
    如果此卷是 CSIVolumeSource 定義的一個臨時內聯卷，則為 “true”，否則為 “false”
  
  “csi.storage.k8s.io/ephemeral” 是 Kubernetes 1.16 中一個新的功能特性。
  只有同時支援 “Persistent” 和 “Ephemeral” VolumeLifecycleMode 的驅動，此欄位才是必需的。
  其他驅動可以保持禁用 Pod 資訊或忽略此欄位。
  由於 Kubernetes 1.15 不支援此欄位，所以在這類叢集上部署驅動時，只能支援一種模式。
  該部署就決定了是哪種模式，例如透過驅動的命令列引數。
  
  此欄位不可變更。

<!--
- **requiresRepublish** (boolean)
  RequiresRepublish indicates the CSI driver wants `NodePublishVolume` being periodically called to reflect any possible change in the mounted volume. This field defaults to false.
  
  Note: After a successful initial NodePublishVolume call, subsequent calls to NodePublishVolume should only update the contents of the volume. New mount points will not be seen by a running container.
-->
- **requiresRepublish** (boolean)
  
  requiresRepublish 表示 CSI 驅動想要 `NodePublishVolume` 被週期性地呼叫，
  以反映已掛載卷中的任何可能的變化。
  此欄位預設為 false。
  
  注：成功完成對 NodePublishVolume 的初始呼叫後，對 NodePublishVolume 的後續呼叫只應更新卷的內容。
  新的掛載點將不會被執行的容器察覺。

<!--
- **storageCapacity** (boolean)
  If set to true, storageCapacity indicates that the CSI volume driver wants pod scheduling to consider the storage capacity that the driver deployment will report by creating CSIStorageCapacity objects with capacity information.
  
  The check can be enabled immediately when deploying a driver. In that case, provisioning new volumes with late binding will pause until the driver deployment has published some suitable CSIStorageCapacity object.
  
  Alternatively, the driver can be deployed with the field unset or false and it can be flipped later when storage capacity information has been published.
  
  This field was immutable in Kubernetes \<= 1.22 and now is mutable.
-->
- **storageCapacity** (boolean)
  
  如果設為 true，則 storageCapacity 表示 CSI 卷驅動希望 Pod 排程時考慮儲存容量，
  驅動部署將透過建立包含容量資訊的 CSIStorageCapacity 物件來報告該儲存容量。
  
  部署驅動時可以立即啟用這個檢查。
  這種情況下，只有此驅動部署已釋出某些合適的 CSIStorageCapacity 物件，
  才會繼續製備新的卷，然後進行繫結。
  
  換言之，可以在未設定此欄位或此欄位為 false 的情況下部署驅動，
  並且可以在釋出儲存容量資訊後再修改此欄位。
  
  此欄位在 Kubernetes 1.22 及更早版本中不可變更，但現在可以變更。

<!--
- **tokenRequests** ([]TokenRequest)
  *Atomic: will be replaced during a merge*
  
  TokenRequests indicates the CSI driver needs pods' service account tokens it is mounting volume for to do necessary authentication. Kubelet will pass the tokens in VolumeContext in the CSI NodePublishVolume calls. The CSI driver should parse and validate the following VolumeContext: "csi.storage.k8s.io/
  
  Note: Audience in each TokenRequest should be different and at most one token is empty string. To receive a new token after expiry, RequiresRepublish can be used to trigger NodePublishVolume periodically.
  <a name="TokenRequest"></a>
  *TokenRequest contains parameters of a service account token.*
-->
- **tokenRequests** ([]TokenRequest)
  
  **原子性：將在合併期間被替換**
  
  tokenRequests 表示 CSI 驅動需要供掛載卷所用的 Pod 的服務帳戶令牌，進行必要的鑑權。
  Kubelet 將在 CSI NodePublishVolume 呼叫中傳遞 VolumeContext 中的令牌。
  CSI 驅動應解析和校驗以下 VolumeContext：

  ```
  "csi.storage.k8s.io/serviceAccount.tokens": {
    "<audience>": {
      "token": <token>,
      "expirationTimestamp": <expiration timestamp in RFC3339>,
    },
    ...
  }
  ```

  注：每個 tokenRequest 中的受眾應該不同，且最多有一個令牌是空字串。
  要在令牌過期後接收一個新的令牌，requiresRepublish 可用於週期性地觸發 NodePublishVolume。
  
  <a name="TokenRequest"></a>
  **tokenRequest 包含一個服務帳戶令牌的引數。**

<!--
  - **tokenRequests.audience** (string), required

    Audience is the intended audience of the token in "TokenRequestSpec". It will default to the audiences of kube apiserver.

  - **tokenRequests.expirationSeconds** (int64)

    ExpirationSeconds is the duration of validity of the token in "TokenRequestSpec". It has the same default value of "ExpirationSeconds" in "TokenRequestSpec".
-->  
  - **tokenRequests.audience** (string)，必需
    
    audience 是 “TokenRequestSpec” 中令牌的目標受眾。
    它預設為 kube apiserver 的受眾。
  
  - **tokenRequests.expirationSeconds** (int64)
    
    expirationSeconds 是 “TokenRequestSpec” 中令牌的有效期。
    它具有與 “TokenRequestSpec” 中 “expirationSeconds” 相同的預設值。

<!--
- **volumeLifecycleModes** ([]string)

  *Set: unique values will be kept during a merge*
  
  volumeLifecycleModes defines what kind of volumes this CSI volume driver supports. The default if the list is empty is "Persistent", which is the usage defined by the CSI specification and implemented in Kubernetes via the usual PV/PVC mechanism. The other mode is "Ephemeral". In this mode, volumes are defined inline inside the pod spec with CSIVolumeSource and their lifecycle is tied to the lifecycle of that pod. A driver has to be aware of this because it is only going to get a NodePublishVolume call for such a volume. For more information about implementing this mode, see https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html A driver can support one or more of these modes and more modes may be added in the future. This field is beta.
  
  This field is immutable.
-->
- **volumeLifecycleModes** ([]string)
  
  **集合：唯一值將在合併期間被保留**
  
  volumeLifecycleModes 定義這個 CSI 卷驅動支援哪種類別的卷。
  如果列表為空，則預設值為 “Persistent”，這是 CSI 規範定義的用法，
  並透過常用的 PV/PVC 機制在 Kubernetes 中實現。
  另一種模式是 “Ephemeral”。
  在這種模式下，在 Pod 規約中用 CSIVolumeSource 以內聯方式定義卷，其生命週期與該 Pod 的生命週期相關聯。
  驅動必須感知到這一點，因為只有針對這種卷才會接收到 NodePublishVolume 呼叫。
  有關實現此模式的更多資訊，請參閱
  https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html。
  驅動可以支援其中一種或多種模式，將來可能會新增更多模式。
  此欄位處於 beta 階段。
  
  此欄位不可變更。

## CSIDriverList {#CSIDriverList}

<!--
CSIDriverList is a collection of CSIDriver objects.
-->
CSIDriverList 是 CSIDriver 物件的集合。

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
  
  標準的列表元資料。
  更多資訊：
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
#### 引數

- **name** (**路徑引數**): string，必需
  
  CSIDriver 的名稱

- **pretty** (**查詢引數**): string
  
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
### `list` 列出或觀測類別為 CSIDriver 的物件

#### HTTP 請求

GET /apis/storage.k8s.io/v1/csidrivers

<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 引數

- **allowWatchBookmarks** (**查詢引數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢引數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **timeoutSeconds** (**查詢引數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢引數**): boolean
  
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
### `create` 建立 CSIDriver

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
#### 引數

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>，必需

- **dryRun** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢引數**): string
  
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
#### 引數

- **name** (**路徑引數**): string，必需
  
  CSIDriver 的名稱

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>，必需

- **dryRun** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢引數**): string
  
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
#### 引數

- **name** (**路徑引數**): string，必需
  
  CSIDriver 的名稱

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢引數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢引數**): string
  
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
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 引數

- **name** (**路徑引數**): string，必需
  
  CSIDriver 的名稱

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢引數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢引數**): string
  
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
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 引數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢引數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢引數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **timeoutSeconds** (**查詢引數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
