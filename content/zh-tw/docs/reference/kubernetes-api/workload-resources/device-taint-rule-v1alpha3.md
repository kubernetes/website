---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "DeviceTaintRule"
content_type: "api_reference"
description: "DeviceTaintRule 添加一個污點到與選擇算符匹配的所有設備上。"
title: "DeviceTaintRule v1alpha3"
weight: 15
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "DeviceTaintRule"
content_type: "api_reference"
description: "DeviceTaintRule adds one taint to all devices which match the selector."
title: "DeviceTaintRule v1alpha3"
weight: 15
auto_generated: true
-->

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`

## DeviceTaintRule {#DeviceTaintRule}

<!--
DeviceTaintRule adds one taint to all devices which match the selector. This has the same effect as if the taint was specified directly in the ResourceSlice by the DRA driver.
-->
DeviceTaintRule 添加一個污點到與選擇算符匹配的所有設備上。
這與通過 DRA 驅動直接在 ResourceSlice 中指定污點具有同樣的效果。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: DeviceTaintRule

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleSpec" >}}">DeviceTaintRuleSpec</a>)，必需

  Spec specifies the selector and one taint.

  Changing the spec automatically increments the metadata.generation number.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料。

- **spec** (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleSpec" >}}">DeviceTaintRuleSpec</a>)，必需

  `spec` 指定選擇算符和一個污點。

  自動更改 `spec` 會讓 `metadata.generation` 數值加一。

## DeviceTaintRuleSpec {#DeviceTaintRuleSpec}

<!--
DeviceTaintRuleSpec specifies the selector and one taint.
-->
DeviceTaintRuleSpec 指定選擇算符和一個污點。

<hr>

<!--
- **taint** (DeviceTaint), required

  The taint that gets applied to matching devices.

  <a name="DeviceTaint"></a>
  *The device this taint is attached to has the "effect" on any claim which does not tolerate the taint and, through the claim, to pods using the claim.*
-->
- **taint** (DeviceTaint)，必需

  應用到匹配設備的污點。

  <a name="DeviceTaint"></a>
  **掛接了此污點的設備會對任何不容忍此污點的申領產生“影響”，並通過此申領影響使用申領的 Pod。**

  <!--
  - **taint.effect** (string), required

    The effect of the taint on claims that do not tolerate the taint and through such claims on the pods using them. Valid effects are NoSchedule and NoExecute. PreferNoSchedule as used for nodes is not valid here.
  -->

  - **taint.effect** (string)，必需

    對不容忍此污點的申領及使用此申領的 Pod 所產生的影響。
    有效值包括 `NoSchedule` 和 `NoExecute`。
    節點上常用的 `PreferNoSchedule` 在此無效。

    <!--
    Possible enum values:
     - `"NoExecute"` Evict any already-running pods that do not tolerate the device taint.
     - `"NoSchedule"` Do not allow new pods to schedule which use a tainted device unless they tolerate the taint, but allow all pods submitted to Kubelet without going through the scheduler to start, and allow all already-running pods to continue running.
    -->
  
    可能的枚舉值：
  
      - `"NoExecute"` 驅逐所有已經運行且不容忍設備污點的 Pod。
      - `"NoSchedule"` 不允許調度新的、使用存在污點設備的 Pod，除非它們能容忍該污點，
        但允許所有直接提交給 kubelet 而不通過調度器的 Pod 啓動，
        並允許所有已經在運行的 Pod 繼續運行。

  <!--
  - **taint.key** (string), required

    The taint key to be applied to a device. Must be a label name.
  -->

  - **taint.key** (string)，必需

    應用到某設備的污點鍵。必須是標籤名稱。

  <!--
  - **taint.timeAdded** (Time)

    TimeAdded represents the time at which the taint was added. Added automatically during create or update if not set.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **taint.value** (string)

    The taint value corresponding to the taint key. Must be a label value.
  -->

  - **taint.timeAdded** (Time)

    `timeAdded` 表示添加污點的時間。如果未設置，意味着在創建或更新期間自動添加。

    <a name="Time"></a>
    **`Time` 是 `time.Time` 的包裝器，它支持對 YAML 和 JSON 的正確編組。
    `time` 包的許多工廠方法提供了包裝器。**

  - **taint.value** (string)

    與污點鍵對應的污點值。必須是標籤值。

<!--
- **deviceSelector** (DeviceTaintSelector)

  DeviceSelector defines which device(s) the taint is applied to. All selector criteria must be satified for a device to match. The empty selector matches all devices. Without a selector, no devices are matches.

  <a name="DeviceTaintSelector"></a>
  *DeviceTaintSelector defines which device(s) a DeviceTaintRule applies to. The empty selector matches all devices. Without a selector, no devices are matched.*
-->
- **deviceSelector** (DeviceTaintSelector)

  `deviceSelector` 定義污點應用到哪些設備上。
  對於要匹配的設備，必須滿足所有選擇算符條件。
  空選擇算符匹配所有設備。如果沒有選擇算符，則不匹配任何設備。

  <a name="DeviceTaintSelector"></a>
  **`DeviceTaintSelector` 定義 `DeviceTaintRule` 應用到哪些設備。
  空選擇算符匹配所有設備。如果沒有選擇算符，則不匹配任何設備。**

  <!--
  - **deviceSelector.device** (string)

    If device is set, only devices with that name are selected. This field corresponds to slice.spec.devices[].name.
    
    Setting also driver and pool may be required to avoid ambiguity, but is not required.

  - **deviceSelector.deviceClassName** (string)

    If DeviceClassName is set, the selectors defined there must be satisfied by a device to be selected. This field corresponds to class.metadata.name.
  -->

  - **deviceSelector.device** (string)

    如果設置了 `device`，則僅選擇具有該名稱的設備。
    此字段對應 `slice.spec.devices[].name`。
    
    爲避免歧義，也可以設置 `driver` 和 `pool`，但不是必需的。

  - **deviceSelector.deviceClassName** (string)

    如果設置了 `deviceClassName`，則設備必須滿足其中定義的選擇算符條件纔會被選中。
    此字段對應 `class.metadata.name`。

  <!--
  - **deviceSelector.driver** (string)

    If driver is set, only devices from that driver are selected. This fields corresponds to slice.spec.driver.

  - **deviceSelector.pool** (string)

    If pool is set, only devices in that pool are selected.
    
    Also setting the driver name may be useful to avoid ambiguity when different drivers use the same pool name, but this is not required because selecting pools from different drivers may also be useful, for example when drivers with node-local devices use the node name as their pool name.
  -->

  - **deviceSelector.driver** (string)

    如果設置了 `driver`，則僅選擇來自該驅動的設備。此字段對應於 `slice.spec.driver`。

  - **deviceSelector.pool** (string)

    如果設置了 `pool`，則僅選擇屬於該資源池的設備。
  
    同時設置 `driver` 名稱可能有助於避免不同驅動使用相同的池名稱所帶來的歧義，但這不是必需的。
    因爲從不同驅動中選擇池也是有意義的，例如當使用節點本地設備的驅動以節點名稱作爲 `pool` 名稱時。

  <!--
  - **deviceSelector.selectors** ([]DeviceSelector)

    *Atomic: will be replaced during a merge*
    
    Selectors contains the same selection criteria as a ResourceClaim. Currently, CEL expressions are supported. All of these selectors must be satisfied.

    <a name="DeviceSelector"></a>
    *DeviceSelector must have exactly one field set.*
  -->

  - **deviceSelector.selectors** ([]DeviceSelector)

    **原子性：將在合併期間被替換**

    `selectors` 包含與 ResourceClaim 相同的選擇條件。
    目前支持 CEL 表達式。必須滿足所有這些選擇算符。

    <a name="DeviceSelector"></a>
    **`DeviceSelector` 必須有且僅有一個字段被設置。**

    <!--
    - **deviceSelector.selectors.cel** (CELDeviceSelector)

      CEL contains a CEL expression for selecting a device.

      <a name="CELDeviceSelector"></a>
      *CELDeviceSelector contains a CEL expression for selecting a device.*
    -->

    - **deviceSelector.selectors.cel** (CELDeviceSelector)

      `cel` 包含一個用於選擇設備的 CEL 表達式。

      <a name="CELDeviceSelector"></a>
      **`CELDeviceSelector` 包含一個用於選擇設備的 CEL 表達式。**

      <!--
      - **deviceSelector.selectors.cel.expression** (string), required

        Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
      -->

      - **deviceSelector.selectors.cel.expression** (string)，必需

        `expression` 是一個 CEL 表達式，用於評估單個設備。
        當被考慮的設備滿足所需條件時，表達式的求值結果必須爲 `true`；當不滿足時，
        結果應爲 `false`。任何其他結果都是錯誤，會導致設備分配中止。

        <!--
        The expression's input is an object named "device", which carries the following properties:
         - driver (string): the name of the driver which defines this device.
         - attributes (map[string]object): the device's attributes, grouped by prefix
           (e.g. device.attributes["dra.example.com"] evaluates to an object with all
           of the attributes which were prefixed by "dra.example.com".
         - capacity (map[string]object): the device's capacities, grouped by prefix.
        -->

        表達式的輸入是一個名爲 "device" 的對象，具有以下屬性：

        - `driver` (string)：定義此設備的驅動的名稱。
        - `attributes` (map[string]object)：設備的屬性，按前綴分組
          （例如，`device.attributes["dra.example.com"]` 評估爲一個對象，包含所有以
          "dra.example.com" 爲前綴的屬性。）
        - `capacity` (map[string]object)：設備的容量，按前綴分組。
        
        <!--
        Example: Consider a device with driver="dra.example.com", which exposes two attributes named "model" and "ext.example.com/family" and which exposes one capacity named "modules". This input to this expression would have the following fields:
        -->

        示例：考慮一個驅動爲 "dra.example.com" 的設備，它暴露兩個名爲 "model" 和
        "ext.example.com/family" 的屬性，並且暴露一個名爲 "modules" 的容量。
        此表達式的輸入將具有以下字段：

        ```
        device.driver
        device.attributes["dra.example.com"].model
        device.attributes["ext.example.com"].family
        device.capacity["dra.example.com"].modules
        ```

        <!--
        The device.driver field can be used to check for a specific driver, either as a high-level precondition (i.e. you only want to consider devices from this driver) or as part of a multi-clause expression that is meant to consider devices from different drivers.
        
        The value type of each attribute is defined by the device definition, and users who write these expressions must consult the documentation for their specific drivers. The value type of each capacity is Quantity.
        -->

        `device.driver` 字段可用於檢查特定驅動，既可以作爲高層次的前提條件（即你只想考慮來自此驅動的設備），
        也可以作爲考慮來自不同驅動的設備的多子句表達式的一部分。

        `attribute` 中每個元素的值類型由設備定義，編寫這些表達式的使用者必須查閱其特定驅動的文檔。
        `capacity` 中元素的值類型爲 Quantity。

        <!--
        If an unknown prefix is used as a lookup in either device.attributes or device.capacity, an empty map will be returned. Any reference to an unknown field will cause an evaluation error and allocation to abort.

        A robust expression should check for the existence of attributes before referencing them.

        For ease of use, the cel.bind() function is enabled, and can be used to simplify expressions that access multiple attributes with the same domain. For example:
        -->

        如果在 `device.attributes` 或 `device.capacity` 中使用未知前綴進行查找，
        將返回一個空映射。對未知字段的任何引用將導致評估錯誤和分配中止。

        一個健壯的表達式應在引用屬性之前檢查其是否存在。

        爲了方便使用，`cel.bind()` 函數被啓用，此函數可用於簡化訪問同一域的多個屬性的表達式。
        例如：

        ```
        cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)
        ```

        <!--
        The length of the expression must be smaller or equal to 10 Ki. The cost of evaluating it is also limited based on the estimated number of logical steps.
        -->

        此表達式的長度必須小於或等於 10 Ki。其求值的計算成本也會根據預估的邏輯步驟數進行限制。

## DeviceTaintRuleList {#DeviceTaintRuleList}

<!--
DeviceTaintRuleList is a collection of DeviceTaintRules.
-->
DeviceTaintRuleList 是 DeviceTaintRules 的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: DeviceTaintRuleList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>), required

  Items is the list of DeviceTaintRules.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元資料。

- **items** ([]<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>)，必需

  `items` 是 DeviceTaintRules 的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified DeviceTaintRule

#### HTTP Request
-->
### `get` 讀取指定的 DeviceTaintRule

#### HTTP 請求

GET /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the DeviceTaintRule

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  DeviceTaintRule 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind DeviceTaintRule

#### HTTP Request
-->
### `list` 列舉或監視類別爲 DeviceTaintRule 的對象

#### HTTP 請求

GET /apis/resource.k8s.io/v1alpha3/devicetaintrules

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleList" >}}">DeviceTaintRuleList</a>): OK

401: Unauthorized

<!--
### `create` create a DeviceTaintRule

#### HTTP Request
-->
### `create` 創建 DeviceTaintRule

#### HTTP 請求

POST /apis/resource.k8s.io/v1alpha3/devicetaintrules

<!--
#### Parameters

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>，必需

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified DeviceTaintRule

#### HTTP Request
-->
### `update` 替換指定的 DeviceTaintRule

#### HTTP 請求

PUT /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the DeviceTaintRule

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  DeviceTaintRule 的名稱。

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>，必需

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified DeviceTaintRule

#### HTTP Request
-->
### `patch` 部分更新指定的 DeviceTaintRule

#### HTTP 請求

PATCH /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the DeviceTaintRule

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  DeviceTaintRule 的名稱。

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

<!--
### `delete` delete a DeviceTaintRule

#### HTTP Request
-->
### `delete` 刪除 DeviceTaintRule

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the DeviceTaintRule

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  DeviceTaintRule 的名稱。

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of DeviceTaintRule

#### HTTP Request
-->
### `deletecollection` 刪除 DeviceTaintRule 的集合

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1alpha3/devicetaintrules

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
