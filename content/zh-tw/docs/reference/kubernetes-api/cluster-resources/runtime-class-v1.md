---
api_metadata:
  apiVersion: "node.k8s.io/v1"
  import: "k8s.io/api/node/v1"
  kind: "RuntimeClass"
content_type: "api_reference"
description: "RuntimeClass 定義叢集中支持的容器運行時類。"
title: "RuntimeClass"
weight: 9
---
<!--
api_metadata:
  apiVersion: "node.k8s.io/v1"
  import: "k8s.io/api/node/v1"
  kind: "RuntimeClass"
content_type: "api_reference"
description: "RuntimeClass defines a class of container runtime supported in the cluster."
title: "RuntimeClass"
weight: 9
auto_generated: true
-->

`apiVersion: node.k8s.io/v1`

`import "k8s.io/api/node/v1"`

## RuntimeClass {#RuntimeClass}

<!--
RuntimeClass defines a class of container runtime supported in the cluster. The RuntimeClass is used to determine which container runtime is used to run all containers in a pod. RuntimeClasses are manually defined by a user or cluster provisioner, and referenced in the PodSpec. The Kubelet is responsible for resolving the RuntimeClassName reference before running the pod.  For more details, see https://kubernetes.io/docs/concepts/containers/runtime-class/
-->
RuntimeClass 定義叢集中支持的容器運行時類。
RuntimeClass 用於確定哪個容器運行時用於運行某 Pod 中的所有容器。
RuntimeClass 由使用者或叢集製備程序手動定義，並在 PodSpec 中引用。
kubelet 負責在運行 Pod 之前解析 RuntimeClassName 引用。
有關更多詳細信息，請參閱
https://kubernetes.io/zh-cn/docs/concepts/containers/runtime-class/

<hr>

- **apiVersion**: node.k8s.io/v1

- **kind**: RuntimeClass

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **handler** (string), required
  handler specifies the underlying runtime and configuration that the CRI implementation will use to handle pods of this class. The possible values are specific to the node & CRI configuration.  It is assumed that all handlers are available on every node, and handlers of the same name are equivalent on every node. For example, a handler called "runc" might specify that the runc OCI runtime (using native Linux containers) will be used to run the containers in a pod. The Handler must be lowercase, conform to the DNS Label (RFC 1123) requirements, and is immutable.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **handler** (string)，必需

  `handler` 指定底層運行時和設定，在 CRI 實現過程中將使用這些運行時和設定來處理這個類的 Pod。
  可能的值特定於節點和 CRI 設定。
  假定所有 handler 可用於每個節點上，且同一名稱的 handler 在所有節點上是等效的。
  例如，一個名爲 "runc" 的 handler 可能指定 runc OCI 運行時將（使用原生 Linux 容器）
  用於運行 Pod 中的容器。該 handler 必須採用小寫，遵從 DNS Label (RFC 1123) 要求，且是不可變更的。

<!--
- **overhead** (Overhead)
  overhead represents the resource overhead associated with running a pod for a given RuntimeClass. For more details, see
   https://kubernetes.io/docs/concepts/scheduling-eviction/pod-overhead/

  <a name="Overhead"></a>
  *Overhead structure represents the resource overhead associated with running a pod.*
-->
- **overhead** (Overhead)

  `overhead` 表示運行給定 RuntimeClass 的 Pod 時所關聯的資源開銷。有關更多詳細信息，請參閱
  https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/

  <a name="Overhead"></a>
  **Overhead 結構表示運行一個 Pod 所關聯的資源開銷。**
  
  <!--
  - **overhead.podFixed** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)
    
    podFixed represents the fixed resource overhead associated with running a pod.
  -->
  
  - **overhead.podFixed** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    `podFixed` 表示與運行一個 Pod 所關聯的資源開銷。

<!--
- **scheduling** (Scheduling)
  scheduling holds the scheduling constraints to ensure that pods running with this RuntimeClass are scheduled to nodes that support it. If scheduling is nil, this RuntimeClass is assumed to be supported by all nodes.

  <a name="Scheduling"></a>
  *Scheduling specifies the scheduling constraints for nodes supporting a RuntimeClass.*
-->
- **scheduling** (Scheduling)

  `scheduling` 包含調度約束，這些約束用來確保以這個 RuntimeClass 運行的
  Pod 被調度到支持此運行時類的節點。
  如果 `scheduling` 設爲空，則假定所有節點支持此 RuntimeClass。

  <a name="Scheduling"></a>
  **Scheduling 指定支持 RuntimeClass 的節點的調度約束。**

  <!--
  - **scheduling.nodeSelector** (map[string]string)
    nodeSelector lists labels that must be present on nodes that support this RuntimeClass. Pods using this RuntimeClass can only be scheduled to a node matched by this selector. The RuntimeClass nodeSelector is merged with a pod's existing nodeSelector. Any conflicts will cause the pod to be rejected in admission.
  -->
  
  - **scheduling.nodeSelector** (map[string]string)

    `nodeSelector` 列出支持此 RuntimeClass 的節點上必須存在的標籤。
    使用此 RuntimeClass 的 Pod 只能調度到與這個選擇算符匹配的節點上。
    RuntimeClass `nodeSelector` 與 Pod 現有的 `nodeSelector` 合併。
    任何衝突均會使得該 Pod 在准入時被拒絕。
  
  <!--
  - **scheduling.tolerations** ([]Toleration)
    *Atomic: will be replaced during a merge*
    
    tolerations are appended (excluding duplicates) to pods running with this RuntimeClass during admission, effectively unioning the set of nodes tolerated by the pod and the RuntimeClass.

    <a name="Toleration"></a>
    *The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*
  -->
  
  - **scheduling.tolerations** ([]Toleration)

    **原子性：將在合併期間被替換**
    
    `tolerations` 在准入期間追加到以此 RuntimeClass 運行的 Pod（不包括重複項）上，
    本質上是求取 Pod 和 RuntimeClass 所容忍的節點並集。

    <a name="Toleration"></a>
    **附加此容忍度的 Pod 將容忍用匹配運算符 `operator` 運算後與三元組
    `<key,value,effect>` 匹配的任意污點。**

    <!--
    - **scheduling.tolerations.key** (string)
      Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.

    - **scheduling.tolerations.operator** (string)
      Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category.

      Possible enum values:
       - `"Equal"`
       - `"Exists"
    -->
    
    - **scheduling.tolerations.key** (string)

      `key` 是容忍度所應用到的污點鍵。空意味着匹配所有污點鍵。
      如果鍵爲空，則運算符必須爲 `Exists`；這個組合意味着匹配所有值和所有鍵。

    - **scheduling.tolerations.operator** (string)

      `operator` 表示一個鍵與值的關係。有效的運算符爲 `Exists` 和 `Equal`。默認爲 `Equal`。
      `Exists` 等價於將值設置爲通配符的情況，因此一個 Pod 可以容忍特定類別的所有污點。

      可能的枚舉值：
    
      - `"Equal"`
      - `"Exists"`
    
    <!--
    - **scheduling.tolerations.value** (string)
      Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.

    - **scheduling.tolerations.effect** (string)
      Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.

      Possible enum values:
       - `"NoExecute"` Evict any already-running pods that do not tolerate the taint. Currently enforced by NodeController.
       - `"NoSchedule"` Do not allow new pods to schedule onto the node unless they tolerate the taint, but allow all pods submitted to Kubelet without going through the scheduler to start, and allow all already-running pods to continue running. Enforced by the scheduler.
       - `"PreferNoSchedule"` Like TaintEffectNoSchedule, but the scheduler tries not to schedule new pods onto the node, rather than prohibiting new pods from scheduling onto the node entirely. Enforced by the scheduler.
    
    - **scheduling.tolerations.tolerationSeconds** (int64)
      TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system.
    -->
    
    - **scheduling.tolerations.value** (string)

      `value` 是容忍度匹配到的污點值。如果運算符爲 `Exists`，則值應爲空，否則就是一個普通字符串。

    - **scheduling.tolerations.effect** (string)

      `effect` 表示匹配度污點效果。空意味着匹配所有污點效果。
      當指定值時，允許的值爲 `NoSchedule`、`PreferNoSchedule` 或 `NoExecute`。

      可能的枚舉值：
    
        - `"NoExecute"` 驅逐已經在運行且不容忍污點的所有 Pod。
          當前由 NodeController 執行。
        - `"NoSchedule"` 不允許新的 Pod 調度到該節點上，除非它們容忍此污點，
          但允許所有直接提交給 kubelet 而不經過調度器的 Pod 啓動，
          並允許所有已經在運行的 Pod 繼續運行。由調度器執行。
        - `"PreferNoSchedule"` 類似於 `NoSchedule`，但是調度器嘗試避免將新 Pod 
          調度到該節點上，而不是完全禁止新 Pod 調度到節點。由調度器執行。
      
    - **scheduling.tolerations.tolerationSeconds** (int64)

      `tolerationSeconds` 表示容忍度容忍污點的時間段（必須是 NoExecute 的效果，否則忽略此字段）。
      默認情況下，不設置此字段，這意味着永遠容忍污點（不驅逐）。零和負值將被系統視爲 0（立即驅逐）。

## RuntimeClassList {#RuntimeClassList}

<!--
RuntimeClassList is a list of RuntimeClass objects.
-->
RuntimeClassList 是 RuntimeClass 對象的列表。

<hr>

- **apiVersion**: node.k8s.io/v1

- **kind**: RuntimeClassList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>), required
  items is a list of schema objects.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>)，必需

  `items` 是 schema 對象的列表。

<!--
## Operations {#Operations}
### `get` read the specified RuntimeClass
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 RuntimeClass

#### HTTP 請求

GET /apis/node.k8s.io/v1/runtimeclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the RuntimeClass
- **pretty** (*in query*): string
-->
##### 參數

- **name** (**路徑參數**): string，必需

  RuntimeClass 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind RuntimeClass
#### HTTP Request
-->
### `list` 列出或監視 RuntimeClass 類別的對象

#### HTTP 請求

GET /apis/node.k8s.io/v1/runtimeclasses

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
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
##### 參數

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

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClassList" >}}">RuntimeClassList</a>): OK

401: Unauthorized

<!--
### `create` create a RuntimeClass
#### HTTP Request
-->
### `create` 創建 RuntimeClass

#### HTTP 請求

POST /apis/node.k8s.io/v1/runtimeclasses

<!--
#### Parameters
- **body**: <a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
##### 參數

- **body**: <a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>，必需

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

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): OK

201 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): Created

202 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified RuntimeClass
#### HTTP Request
-->
### `update` 替換指定的 RuntimeClass

#### HTTP 請求

PUT /apis/node.k8s.io/v1/runtimeclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the RuntimeClass
- **body**: <a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
##### 參數

- **name** (**路徑參數**): string，必需

  RuntimeClass 的名稱

- **body**: <a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>，必需

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

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): OK

201 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified RuntimeClass
#### HTTP Request
-->
### `patch` 部分更新指定的 RuntimeClass

#### HTTP 請求

PATCH /apis/node.k8s.io/v1/runtimeclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the RuntimeClass
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
##### 參數

- **name** (**路徑參數**): string，必需

  RuntimeClass 的名稱

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

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): OK

201 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): Created

401: Unauthorized

<!--
### `delete` delete a RuntimeClass
#### HTTP Request
-->
### `delete` 刪除 RuntimeClass

#### HTTP 請求

DELETE /apis/node.k8s.io/v1/runtimeclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the RuntimeClass
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
##### 參數

- **name** (**路徑參數**): string，必需

  RuntimeClass 的名稱

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of RuntimeClass
#### HTTP Request
-->
### `deletecollection` 刪除 RuntimeClass 的集合

#### HTTP 請求

DELETE /apis/node.k8s.io/v1/runtimeclasses

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
-->
##### 參數

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
