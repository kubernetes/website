---
api_metadata:
  apiVersion: "resource.k8s.io/v1beta2"
  import: "k8s.io/api/resource/v1beta2"
  kind: "DeviceClass"
content_type: "api_reference"
description: "DeviceClass 是由供應商或管理員提供的資源，包含設備設定和選擇算符。"
title: "DeviceClass v1beta2"
weight: 2
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1beta2"
  import: "k8s.io/api/resource/v1beta2"
  kind: "DeviceClass"
content_type: "api_reference"
description: "DeviceClass is a vendor- or admin-provided resource that contains device configuration and selectors."
title: "DeviceClass v1beta2"
weight: 2
auto_generated: true
-->

`apiVersion: resource.k8s.io/v1beta2`

`import "k8s.io/api/resource/v1beta2"`

## DeviceClass {#DeviceClass}

<!--
DeviceClass is a vendor- or admin-provided resource that contains device configuration and selectors. It can be referenced in the device requests of a claim to apply these presets. Cluster scoped.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.
-->
DeviceClass 是由供應商或管理員提供的資源，包含設備設定和選擇算符。
它可以在申領的設備請求中被引用，以應用預設值。作用域爲叢集範圍。

這是一個 Alpha 階段的資源類別，需要啓用 DynamicResourceAllocation 特性門控。

<hr>

- **apiVersion**: resource.k8s.io/v1beta2

- **kind**: DeviceClass

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料。

<!--
- **spec** (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClassSpec" >}}">DeviceClassSpec</a>), required

  Spec defines what can be allocated and how to configure it.
  
  This is mutable. Consumers have to be prepared for classes changing at any time, either because they get updated or replaced. Claim allocations are done once based on whatever was set in classes at the time of allocation.
  
  Changing the spec automatically increments the metadata.generation number.
-->
- **spec** (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClassSpec" >}}">DeviceClassSpec</a>)，必需

  spec 定義可被分配的資源以及如何設定這類資源。
  
  此字段是可變更的。消費者必須準備好應對隨時會變更的類，變更的原因可能是被更新或被替換。
  申領分配是基於分配之時類中所設置的內容而確定的。
  
  變更 spec 會讓 metadata.generation 編號自動遞增。

## DeviceClassSpec {#DeviceClassSpec}

<!--
DeviceClassSpec is used in a [DeviceClass] to define what can be allocated and how to configure it.
-->
DeviceClassSpec 在 DeviceClass 中用於定義可被分配的資源以及如何設定這類資源。

<hr>

<!--
- **config** ([]DeviceClassConfiguration)

  *Atomic: will be replaced during a merge*
  
  Config defines configuration parameters that apply to each device that is claimed via this class. Some classses may potentially be satisfied by multiple drivers, so each instance of a vendor configuration applies to exactly one driver.
  
  They are passed to the driver, but are not considered while allocating the claim.

  <a name="DeviceClassConfiguration"></a>
  *DeviceClassConfiguration is used in DeviceClass.*
-->
- **config** ([]DeviceClassConfiguration)

  **原子：將在合併期間被替換**
  
  config 定義適用於通過此類申領的每個設備的設定參數。
  某些類可能會由多個驅動所滿足，因此供應商設定的每個實例僅適用於一個驅動。
  
  這些設定參數被傳遞給驅動，但在分配申領時不考慮這些設定參數。

  <a name="DeviceClassConfiguration"></a>
  **DeviceClassConfiguration 在 DeviceClass 中使用。**

  <!--
  - **config.opaque** (OpaqueDeviceConfiguration)

    Opaque provides driver-specific configuration parameters.

    <a name="OpaqueDeviceConfiguration"></a>
    *OpaqueDeviceConfiguration contains configuration parameters for a driver in a format defined by the driver vendor.*
  -->

  - **config.opaque** (OpaqueDeviceConfiguration)

    opaque 提供特定於驅動的設定參數。

    <a name="OpaqueDeviceConfiguration"></a>
    **OpaqueDeviceConfiguration 以驅動供應商所定義的格式提供驅動的設定參數。**

    <!--
    - **config.opaque.driver** (string), required

      Driver is used to determine which kubelet plugin needs to be passed these configuration parameters.
      
      An admission policy provided by the driver developer could use this to decide whether it needs to validate them.
      
      Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
    -->

    - **config.opaque.driver** (string)，必需

      driver 用於確定需要將這些設定參數傳遞給哪個 kubelet 插件。
        
      驅動開發者所提供的准入策略可以使用此字段來決定是否需要校驗這些參數。
        
      必須是一個 DNS 子域，並且應以驅動供應商擁有的 DNS 域結尾。

    <!--
    - **config.opaque.parameters** (RawExtension), required

      Parameters can contain arbitrary data. It is the responsibility of the driver developer to handle validation and versioning. Typically this includes self-identification and a version ("kind" + "apiVersion" for Kubernetes types), with conversion between different versions.
      
      The length of the raw data must be smaller or equal to 10 Ki.

      <a name="RawExtension"></a>
      *RawExtension is used to hold extensions in external versions.
      
      To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
    -->

    - **config.opaque.parameters** (RawExtension)，必需

      parameters 可以包含任意資料。處理校驗和版本控制是驅動開發者的責任。
      通常這包括自我標識和版本資訊（對 Kubernetes 而言即 "kind" + "apiVersion"），並在不同版本之間進行轉換。

      原始資料的長度必須小於或等於 10 Ki。

      <a name="RawExtension"></a>
      **RawExtension 用於以外部版本來保存擴展資料。**
        
      要使用它，請在外部、版本化的結構中生成一個字段，以 RawExtension 作爲其類型，在內部結構中以 Object 作爲其類型。
      你還需要註冊你的各個插件類型。

      <!--
      // Internal package:
      -->

      // 內部包：
      
          type MyAPIObject struct {
            runtime.TypeMeta `json:",inline"`
            MyPlugin runtime.Object `json:"myPlugin"`
          }
        
          type PluginA struct {
            AOption string `json:"aOption"`
          }
      
      <!--
      // External package:
      -->

      // 外部包：

          type MyAPIObject struct {
            runtime.TypeMeta `json:",inline"`
            MyPlugin runtime.RawExtension `json:"myPlugin"`
          }
        
          type PluginA struct {
            AOption string `json:"aOption"`
          }
      
      <!--
      // On the wire, the JSON will look something like this:
      -->

      // 在網路上，JSON 看起來像這樣：

          {
            "kind":"MyAPIObject",
            "apiVersion":"v1",
            "myPlugin": {
              "kind":"PluginA",
              "aOption":"foo",
            },
          }
      
      <!--
      So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)*
      -->

      那麼會發生什麼？解碼首先使用 JSON 或 YAML 將序列化資料解組到你的外部 MyAPIObject 中。
      這會導致原始 JSON 被儲存下來，但不會被解包。下一步是複製（使用 pkg/conversion）到內部結構中。
      runtime 包的 DefaultScheme 安裝了轉換函數，它將解析儲存在 RawExtension 中的 JSON，
      將其轉換爲正確的對象類型，並將其儲存在 Object 中。
      （TODO：如果對象是未知類型，將創建並儲存一個 `runtime.Unknown` 對象。）

<!--
- **selectors** ([]DeviceSelector)

  *Atomic: will be replaced during a merge*
  
  Each selector must be satisfied by a device which is claimed via this class.

  <a name="DeviceSelector"></a>
  *DeviceSelector must have exactly one field set.*
-->
- **selectors** ([]DeviceSelector)

  **原子：將在合併期間被替換**
  
  通過此類所申領的設備必須滿足這裏的每個選擇算符。

  <a name="DeviceSelector"></a>
  **DeviceSelector 中必須設置且僅設置一個字段。**

  <!--
  - **selectors.cel** (CELDeviceSelector)

    CEL contains a CEL expression for selecting a device.

    <a name="CELDeviceSelector"></a>
    *CELDeviceSelector contains a CEL expression for selecting a device.*
  -->

  - **selectors.cel** (CELDeviceSelector)

    cel 包含用於選擇設備的 CEL 表達式。

    <a name="CELDeviceSelector"></a>
    **CELDeviceSelector 包含用於選擇設備的 CEL 表達式。**

    <!--
    - **selectors.cel.expression** (string), required

      Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
    -->

    - **selectors.cel.expression** (string)，必需

      expression 是一個 CEL 表達式，用於評估單個設備。
      當被考慮的設備滿足所需條件時，表達式的求值結果必須爲 true；當不滿足時，結果應爲 false。
      任何其他結果都是錯誤，會導致設備分配中止。

      <!--
      The expression's input is an object named "device", which carries the following properties:
       - driver (string): the name of the driver which defines this device.
       - attributes (map[string]object): the device's attributes, grouped by prefix
         (e.g. device.attributes["dra.example.com"] evaluates to an object with all
         of the attributes which were prefixed by "dra.example.com".
       - capacity (map[string]object): the device's capacities, grouped by prefix.
      
      Example: Consider a device with driver="dra.example.com", which exposes two attributes named "model" and "ext.example.com/family" and which exposes one capacity named "modules". This input to this expression would have the following fields:
      -->

      表達式的輸入是一個名爲 "device" 的對象，具有以下屬性：

      - driver (string)：定義此設備的驅動的名稱。
      - attributes (map[string]object)：設備的屬性，按前綴分組
        （例如，device.attributes["dra.example.com"] 評估爲一個對象，包含所有以 "dra.example.com" 爲前綴的屬性。）
      - capacity (map[string]object)：設備的容量，按前綴分組。
      
      示例：考慮一個驅動爲 "dra.example.com" 的設備，它暴露兩個名爲 "model" 和 "ext.example.com/family" 的屬性，
      並且暴露一個名爲 "modules" 的容量。此表達式的輸入將具有以下字段：

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

      device.driver 字段可用於檢查特定驅動，既可以作爲高層次的前提條件（即你只想考慮來自此驅動的設備），
      也可以作爲考慮來自不同驅動的設備的多子句表達式的一部分。
          
      attribute 中每個元素的值類型由設備定義，編寫這些表達式的使用者必須查閱其特定驅動的文檔。
      capacity 中元素的值類型爲 Quantity。

      <!--
      If an unknown prefix is used as a lookup in either device.attributes or device.capacity, an empty map will be returned. Any reference to an unknown field will cause an evaluation error and allocation to abort.
      
      A robust expression should check for the existence of attributes before referencing them.
      
      For ease of use, the cel.bind() function is enabled, and can be used to simplify expressions that access multiple attributes with the same domain. For example:
      -->

      如果在 device.attributes 或 device.capacity 中使用未知前綴進行查找，
      將返回一個空映射。對未知字段的任何引用將導致評估錯誤和分配中止。
      
      一個健壯的表達式應在引用屬性之前檢查其是否存在。
          
      爲了方便使用，cel.bind() 函數被啓用，此函數可用於簡化訪問同一域的多個屬性的表達式。例如：

      ```
      cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)
      ```

      <!--
      The length of the expression must be smaller or equal to 10 Ki. The cost of evaluating it is also limited based on the estimated number of logical steps.
      -->

      表達式的長度必須小於或等於 10 Ki。根據估計的邏輯步驟數，其評估成本也受到限制。

## DeviceClassList {#DeviceClassList}

<!--
DeviceClassList is a collection of classes.
-->
DeviceClassList 是類的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1beta2

- **kind**: DeviceClassList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>), required

  Items is the list of resource classes.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元資料。

- **items** ([]<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>)，必需

  items 是資源類的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified DeviceClass

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 DeviceClass

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta2/deviceclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the DeviceClass

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  DeviceClass 的名稱。

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind DeviceClass

#### HTTP Request

GET /apis/resource.k8s.io/v1beta2/deviceclasses

#### Parameters
-->
### `list` 列舉或監視 DeviceClass 類別的對象

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta2/deviceclasses

#### 參數

<!--
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

200 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClassList" >}}">DeviceClassList</a>): OK

401: Unauthorized

<!--
### `create` create a DeviceClass

#### HTTP Request

POST /apis/resource.k8s.io/v1beta2/deviceclasses

#### Parameters
-->
### `create` 創建 DeviceClass

#### HTTP 請求

POST /apis/resource.k8s.io/v1beta2/deviceclasses

#### 參數

<!--
- **body**: <a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **body**: <a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>，必需

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

200 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): Created

202 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified DeviceClass

#### HTTP Request

PUT /apis/resource.k8s.io/v1beta2/deviceclasses/{name}

#### Parameters
-->
### `update` 替換指定的 DeviceClass

#### HTTP 請求

PUT /apis/resource.k8s.io/v1beta2/deviceclasses/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the DeviceClass

- **body**: <a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路徑參數**): string，必需

  DeviceClass 的名稱。

- **body**: <a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>，必需

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

200 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified DeviceClass

#### HTTP Request

PATCH /apis/resource.k8s.io/v1beta2/deviceclasses/{name}

#### Parameters
-->
### `patch` 部分更新指定的 DeviceClass

#### HTTP 請求

PATCH /apis/resource.k8s.io/v1beta2/deviceclasses/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the DeviceClass

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
- **name** (**路徑參數**): string，必需

  DeviceClass 的名稱。

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

200 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): Created

401: Unauthorized

<!--
### `delete` delete a DeviceClass

#### HTTP Request

DELETE /apis/resource.k8s.io/v1beta2/deviceclasses/{name}

#### Parameters
-->
### `delete` 刪除 DeviceClass

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1beta2/deviceclasses/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the DeviceClass

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
- **name** (**路徑參數**): string，必需

  DeviceClass 的名稱。

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

200 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): OK

202 (<a href="{{< ref "../extend-resources/device-class-v1beta2#DeviceClass" >}}">DeviceClass</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of DeviceClass

#### HTTP Request

DELETE /apis/resource.k8s.io/v1beta2/deviceclasses

#### Parameters
-->
### `deletecollection` 刪除 DeviceClass 的集合

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1beta2/deviceclasses

#### 參數

<!--
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
