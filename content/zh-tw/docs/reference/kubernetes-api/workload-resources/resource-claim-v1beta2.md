---
api_metadata:
  apiVersion: "resource.k8s.io/v1beta2"
  import: "k8s.io/api/resource/v1beta2"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim 描述對叢集中供工作負載使用的資源的訪問請求。"
title: "ResourceClaim v1beta2"
weight: 16
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1beta2"
  import: "k8s.io/api/resource/v1beta2"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim describes a request for access to resources in the cluster, for use by workloads."
title: "ResourceClaim v1beta2"
weight: 16
auto_generated: true
-->

`apiVersion: resource.k8s.io/v1beta2`

`import "k8s.io/api/resource/v1beta2"`

## ResourceClaim {#ResourceClaim}

<!--
ResourceClaim describes a request for access to resources in the cluster, for use by workloads. For example, if a workload needs an accelerator device with specific properties, this is how that request is expressed. The status stanza tracks whether this claim has been satisfied and what specific resources have been allocated.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.
-->
ResourceClaim 描述對叢集中供工作負載使用的資源的訪問請求。
例如，如果某個工作負載需要具有特定屬性的加速器設備，這就是表達該請求的方式。
狀態部分跟蹤此申領是否已被滿足，以及具體分配了哪些資源。

這是一個 Alpha 級別的資源類型，需要啓用 DynamicResourceAllocation 特性門控。

<hr>

- **apiVersion**: resource.k8s.io/v1beta2

- **kind**: ResourceClaim

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料。

<!--
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), required

  Spec describes what is being requested and how to configure it. The spec is immutable.

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  Status describes whether the claim is ready to use and what has been allocated.
-->
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimSpec" >}}">ResourceClaimSpec</a>)，必需

  spec 描述正在被請求的資源及其設定方式。spec 是不可變更的。

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  status 描述申領是否就緒以及已分配了哪些。

## ResourceClaimSpec {#ResourceClaimSpec}

<!--
ResourceClaimSpec defines what is being requested in a ResourceClaim and how to configure it.
-->
ResourceClaimSpec 定義在 ResourceClaim 中正在被請求的資源及其設定方式。

<hr>

<!--
- **devices** (DeviceClaim)

  Devices defines how to request devices.

  <a name="DeviceClaim"></a>
  *DeviceClaim defines how to request devices with a ResourceClaim.*
-->
- **devices** (DeviceClaim)

  devices 定義如何請求設備。

  <a name="DeviceClaim"></a>
  **DeviceClaim 定義如何通過 ResourceClaim 請求設備。**

  <!--
  - **devices.config** ([]DeviceClaimConfiguration)

    *Atomic: will be replaced during a merge*
    
    This field holds configuration for multiple potential drivers which could satisfy requests in this claim. It is ignored while allocating the claim.

    <a name="DeviceClaimConfiguration"></a>
    *DeviceClaimConfiguration is used for configuration parameters in DeviceClaim.*
  -->

  - **devices.config** ([]DeviceClaimConfiguration)

    **原子性：將在合併期間被替換**
    
    此字段保存可以滿足此申領請求的多個潛在驅動的設定。在分配申領時此字段被忽略。

    <a name="DeviceClaimConfiguration"></a>
    **DeviceClaimConfiguration 用於 DeviceClaim 中的設定參數。**

    <!--
    - **devices.config.opaque** (OpaqueDeviceConfiguration)

      Opaque provides driver-specific configuration parameters.

      <a name="OpaqueDeviceConfiguration"></a>
      *OpaqueDeviceConfiguration contains configuration parameters for a driver in a format defined by the driver vendor.*
    -->

    - **devices.config.opaque** (OpaqueDeviceConfiguration)

      opaque 提供特定於驅動的設定參數。

      <a name="OpaqueDeviceConfiguration"></a>
      **OpaqueDeviceConfiguration 以驅動供應商所定義的格式提供驅動的設定參數。**

      <!--
      - **devices.config.opaque.driver** (string), required

        Driver is used to determine which kubelet plugin needs to be passed these configuration parameters.
        
        An admission policy provided by the driver developer could use this to decide whether it needs to validate them.
        
        Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
      -->

      - **devices.config.opaque.driver** (string)，必需

        driver 用於確定需要將這些設定參數傳遞給哪個 kubelet 插件。
        
        驅動開發者所提供的准入策略可以使用此字段來決定是否需要校驗這些參數。
        
        必須是一個 DNS 子域，並且應以驅動供應商擁有的 DNS 域結尾。

      <!--
      - **devices.config.opaque.parameters** (RawExtension), required

        Parameters can contain arbitrary data. It is the responsibility of the driver developer to handle validation and versioning. Typically this includes self-identification and a version ("kind" + "apiVersion" for Kubernetes types), with conversion between different versions.

        The length of the raw data must be smaller or equal to 10 Ki.

        <a name="RawExtension"></a>
        *RawExtension is used to hold extensions in external versions.
        
        To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
      -->

      - **devices.config.opaque.parameters** (RawExtension)，必需

        parameters 可以包含任意資料。處理校驗和版本控制是驅動開發者的責任。
        通常這包括自我識別和版本化管理（對 Kubernetes 而言即 "kind" + "apiVersion"），並在不同版本之間進行轉換。

        原始資料的長度必須小於或等於 10 Ki。

        <a name="RawExtension"></a>
        **RawExtension 用於以外部版本來保存擴展資料。**
        
        要使用它，請生成一個字段，在外部、版本化結構中以 RawExtension 作爲其類型，在內部結構中以 Object 作爲其類型。
        你還需要註冊你的各個插件類型。
        
        <!--
        // Internal package:
        -->

        // 內部包：

        ```go
        type MyAPIObject struct {
          runtime.TypeMeta `json:",inline"`
          MyPlugin runtime.Object `json:"myPlugin"`
        }
        
        type PluginA struct {
          AOption string `json:"aOption"`
        }
        ```
        
        <!--
        // External package:
        -->

        // 外部包：

        ```go
        type MyAPIObject struct {
          runtime.TypeMeta `json:",inline"`
          MyPlugin runtime.RawExtension `json:"myPlugin"`
        }
        
        type PluginA struct {
          AOption string `json:"aOption"`
        }
        ```
        
        <!--
        // On the wire, the JSON will look something like this:
        -->

        // 在網路上，JSON 看起來像這樣：

        ```json
        {
          "kind":"MyAPIObject",
          "apiVersion":"v1",
          "myPlugin": {
            "kind":"PluginA",
            "aOption":"foo",
          },
        }
        ```
        
        <!--
        So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)*
        -->

        那麼會發生什麼？解碼首先使用 JSON 或 YAML 將序列化資料解組到你的外部 MyAPIObject 中。
        這會導致原始 JSON 被儲存下來，但不會被解包。下一步是複製（使用 pkg/conversion）到內部結構中。
        runtime 包的 DefaultScheme 安裝了轉換函數，它將解析儲存在 RawExtension 中的 JSON，
        將其轉換爲正確的對象類型，並將其儲存在 Object 中。
        （TODO：如果對象是未知類型，將創建並儲存一個 `runtime.Unknown` 對象。）

    <!--
    - **devices.config.requests** ([]string)

      *Atomic: will be replaced during a merge*
      
      Requests lists the names of requests where the configuration applies. If empty, it applies to all requests.

      References to subrequests must include the name of the main request and may include the subrequest using the format \<main request>[/\<subrequest>]. If just the main request is given, the configuration applies to all subrequests.
    -->

    - **devices.config.requests** ([]string)

      **原子性：將在合併期間被替換**
      
      requests 列舉了設定適用的請求的名稱。如果爲空，則適用於所有請求。

      對子請求的引用必須包含主請求的名稱，並可以使用格式 `<主請求>[/<子請求>]` 來包含子請求。
      如果只提供主請求，則此設定適用於所有子請求。


  <!--
  - **devices.constraints** ([]DeviceConstraint)

    *Atomic: will be replaced during a merge*
    
    These constraints must be satisfied by the set of devices that get allocated for the claim.

    <a name="DeviceConstraint"></a>
    *DeviceConstraint must have exactly one field set besides Requests.*
  -->

  - **devices.constraints** ([]DeviceConstraint)

    **原子性：將在合併期間被替換**
    
    這些約束必須由爲申領分配的設備集合所滿足。

    <a name="DeviceConstraint"></a>
    **除了 requests 之外，DeviceConstraint 還必須有且僅有一個字段被設置。**

    <!--
    - **devices.constraints.matchAttribute** (string)

      MatchAttribute requires that all devices in question have this attribute and that its type and value are the same across those devices.
      
      For example, if you specified "dra.example.com/numa" (a hypothetical example!), then only devices in the same NUMA node will be chosen. A device which does not have that attribute will not be chosen. All devices should use a value of the same type for this attribute because that is part of its specification, but if one device doesn't, then it also will not be chosen.
      
      Must include the domain qualifier.
    -->

    - **devices.constraints.matchAttribute** (string)

      matchAttribute 要求所有待考察的設備都具有此屬性，並且在這些設備上該屬性的類型和值相同。
      
      例如，如果你指定了 "dra.example.com/numa"（假設的例子！），那麼只有在同一 NUMA 節點中的設備將被選中。
      沒有該屬性的設備將不會被選中。所有設備應對此屬性使用相同類型的值，因爲這是其規約的一部分，
      但如果某個設備不這樣做，那麼此設備也不會被選中。
      
      必須包括域限定符。

    <!--
    - **devices.constraints.requests** ([]string)

      *Atomic: will be replaced during a merge*
      
      Requests is a list of the one or more requests in this claim which must co-satisfy this constraint. If a request is fulfilled by multiple devices, then all of the devices must satisfy the constraint. If this is not specified, this constraint applies to all requests in this claim.

      References to subrequests must include the name of the main request and may include the subrequest using the format \<main request>[/\<subrequest>]. If just the main request is given, the constraint applies to all subrequests.
    -->

    - **devices.constraints.requests** ([]string)

      **原子性：將在合併期間被替換**
      
      requests 是此申領中必須共同滿足此約束的一個或多個請求的列表。
      如果一個請求由多個設備滿足，則所有設備必須符合此約束。
      如果未設置此字段，則此約束適用於此申領中的所有請求。

      對子請求的引用必須包含主請求的名稱，並可以使用格式 `<主請求>[/<子請求>]` 來包含子請求。
      如果只提供主請求，則此約束適用於所有子請求。

  <!--
  - **devices.requests** ([]DeviceRequest)

    *Atomic: will be replaced during a merge*
    
    Requests represent individual requests for distinct devices which must all be satisfied. If empty, nothing needs to be allocated.

    <a name="DeviceRequest"></a>
    *DeviceRequest is a request for devices required for a claim. This is typically a request for a single resource like a device, but can also ask for several identical devices. With FirstAvailable it is also possible to provide a prioritized list of requests.*
  -->

  - **devices.requests** ([]DeviceRequest)

    **原子性：將在合併期間被替換**
    
    requests 表示對不同設備的各個請求，這些請求必須同時被滿足。如果字段爲空，則不需要分配設備。

    <a name="DeviceRequest"></a>
    **DeviceRequest 是對申領所需設備的請求。這通常是對單個資源（如設備）的請求，但也可以請求幾個相同的設備。
    使用 firstAvailable 字段，也可以提供按優先級排序後的請求列表。**

    <!--
    - **devices.requests.name** (string), required

      Name can be used to reference this request in a pod.spec.containers[].resources.claims entry and in a constraint of the claim.
      
      References using the name in the DeviceRequest will uniquely identify a request when the Exactly field is set. When the FirstAvailable field is set, a reference to the name of the DeviceRequest will match whatever subrequest is chosen by the scheduler.
      
      Must be a DNS label.
    -->

    - **devices.requests.name** (string)，必需

      name 可用於在 pod.spec.containers[].resources.claims 條目和申領的約束中引用此請求。
      
      當設置了 exactly 字段時，使用 DeviceRequest 中的名稱進行引用將唯一標識某個請求。
      當設置了 firstAvailable 字段時，對 DeviceRequest 名稱的引用將匹配調度器所選擇的任意子請求。

      必須是 DNS 標籤。

    <!--
    - **devices.requests.exactly** (ExactDeviceRequest)

      Exactly specifies the details for a single request that must be met exactly for the request to be satisfied.
      
      One of Exactly or FirstAvailable must be set.

      <a name="ExactDeviceRequest"></a>
      *ExactDeviceRequest is a request for one or more identical devices.*
    -->

    - **devices.requests.exactly** (ExactDeviceRequest)

      exactly 指定必須被完全滿足的單一請求的詳細資訊，只有滿足這些條件，請求才會被視爲成功。

      exactly 和 firstAvailable 必須至少設置一個。

      <a name="ExactDeviceRequest"></a>
      **ExactDeviceRequest 是對一個或多個相同設備的請求。**

      <!--
      - **devices.requests.exactly.deviceClassName** (string), required

        DeviceClassName references a specific DeviceClass, which can define additional configuration and selectors to be inherited by this request.
        
        A DeviceClassName is required.
        
        Administrators may use this to restrict which devices may get requested by only installing classes with selectors for permitted devices. If users are free to request anything without restrictions, then administrators can create an empty DeviceClass for users to reference.
      -->

      - **devices.requests.exactly.deviceClassName** (string)，必需

        deviceClassName 引用特定的 DeviceClass，它可以定義要由此請求所繼承的額外設定和選擇算符。
      
        deviceClassName 是必需的。
      
        管理員通過僅爲允許的設備使用選擇算符安裝類，就可以使用此字段限制哪些設備可以被請求。
        如果使用者可以自由請求任何設備而沒有限制，則管理員可以創建一個空的 DeviceClass 供使用者引用。

      <!--
      - **devices.requests.exactly.adminAccess** (boolean)

        AdminAccess indicates that this is a claim for administrative access to the device(s). Claims with AdminAccess are expected to be used for monitoring or other management services for a device.  They ignore all ordinary claims to the device with respect to access modes and any resource allocations.
        
        This is an alpha field and requires enabling the DRAAdminAccess feature gate. Admin access is disabled if this field is unset or set to false, otherwise it is enabled.
      -->

      - **devices.requests.exactly.adminAccess** (boolean)

        adminAccess 表示這是對設備的管理訪問權限的申領請求。
        使用 adminAccess 的申領請求預期用於設備的監控或其他管理服務。
        就訪問模式和資源分配而言，它們會忽略對設備的所有普通申領。

        這是一個 Alpha 字段，需要啓用 DRAAdminAccess 特性門控。
        如果此字段未設置或設置爲 false，則管理員訪問權限將被禁用；否則將被啓用。


      <!--
      - **devices.requests.exactly.allocationMode** (string)

        AllocationMode and its related fields define how devices are allocated to satisfy this request. Supported values are:
        
        - ExactCount: This request is for a specific number of devices.
          This is the default. The exact number is provided in the
          count field.
        
        - All: This request is for all of the matching devices in a pool.
          At least one device must exist on the node for the allocation to succeed.
          Allocation will fail if some devices are already allocated,
          unless adminAccess is requested.
      -->

      - **devices.requests.exactly.allocationMode** (string)

        allocationMode 及其相關字段定義如何分配設備以滿足此請求。支持的值爲：
      
        - ExactCount：此請求是針對特定數量的設備。
          這是預設值。確切數量在 count 字段中提供。
      
        - All：此請求是針對池中所有匹配的設備。
          如果某些設備已經被分配，則分配將失敗，除非請求了 adminAccess。

        <!--
        If AllocationMode is not specified, the default mode is ExactCount. If the mode is ExactCount and count is not specified, the default count is one. Any other requests must specify this field.
        
        More modes may get added in the future. Clients must refuse to handle requests with unknown modes.
        -->

        如果 allocationMode 未被指定，則預設模式爲 ExactCount。
        如果模式爲 ExactCount 而 count 未被指定，則預設值爲 1。
        其他任何請求必須指定此字段。
      
        將來可能會添加更多模式。客戶端必須拒絕處理未知模式的請求。

      <!--
      - **devices.requests.exactly.count** (int64)

        Count is used only when the count mode is "ExactCount". Must be greater than zero. If AllocationMode is ExactCount and this field is not specified, the default is one.
      -->

      - **devices.requests.exactly.count** (int64)

        count 僅在計數模式爲 "ExactCount" 時使用。必須大於零。
        如果 allocationMode 爲 ExactCount 而此字段未被指定，則預設值爲 1。

      <!--
      - **devices.requests.exactly.selectors** ([]DeviceSelector)

        *Atomic: will be replaced during a merge*
        
        Selectors define criteria which must be satisfied by a specific device in order for that device to be considered for this request. All selectors must be satisfied for a device to be considered.

        <a name="DeviceSelector"></a>
        *DeviceSelector must have exactly one field set.*
      -->

      - **devices.requests.exactly.selectors** ([]DeviceSelector)

        **原子性：將在合併期間被替換**
      
        selectors 定義特定設備必須滿足的條件，滿足條件的設備被視爲此請求的候選者。
        所有選擇算符必須同時被滿足纔會考慮某個設備。

        <a name="DeviceSelector"></a>
        **DeviceSelector 必須有且僅有一個字段被設置。**

        <!--
        - **devices.requests.exactly.selectors.cel** (CELDeviceSelector)

          CEL contains a CEL expression for selecting a device.

          <a name="CELDeviceSelector"></a>
          *CELDeviceSelector contains a CEL expression for selecting a device.*
        -->

        - **devices.requests.exactly.selectors.cel** (CELDeviceSelector)

          cel 包含一個用於選擇設備的 CEL 表達式。

          <a name="CELDeviceSelector"></a>
          **CELDeviceSelector 包含一個用於選擇設備的 CEL 表達式。**

          <!--
          - **devices.requests.exactly.selectors.cel.expression** (string), required

            Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
          -->

          - **devices.requests.exactly.selectors.cel.expression** (string)，必需

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
            -->

            表達式的輸入是一個名爲 "device" 的對象，具有以下屬性：

            - driver (string)：定義此設備的驅動的名稱。
            - attributes (map[string]object)：設備的屬性，按前綴分組
              （例如，device.attributes["dra.example.com"] 評估爲一個對象，包含所有以 "dra.example.com" 爲前綴的屬性。）
            - capacity (map[string]object)：設備的容量，按前綴分組。
          
            <!--
            Example: Consider a device with driver="dra.example.com", which exposes two attributes named "model" and "ext.example.com/family" and which exposes one capacity named "modules". This input to this expression would have the following fields:
            -->

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
            
            If an unknown prefix is used as a lookup in either device.attributes or device.capacity, an empty map will be returned. Any reference to an unknown field will cause an evaluation error and allocation to abort.
            -->

            device.driver 字段可用於檢查特定驅動，既可以作爲高層次的前提條件（即你只想考慮來自此驅動的設備），
            也可以作爲考慮來自不同驅動的設備的多子句表達式的一部分。
          
            attribute 中每個元素的值類型由設備定義，編寫這些表達式的使用者必須查閱其特定驅動的文檔。
            capacity 中元素的值類型爲 Quantity。
          
            如果在 device.attributes 或 device.capacity 中使用未知前綴進行查找，
            將返回一個空映射。對未知字段的任何引用將導致評估錯誤和分配中止。
          
            <!--
            A robust expression should check for the existence of attributes before referencing them.
            
            For ease of use, the cel.bind() function is enabled, and can be used to simplify expressions that access multiple attributes with the same domain. For example:
            -->

            一個健壯的表達式應在引用屬性之前檢查其是否存在。
          
            爲了方便使用，cel.bind() 函數被啓用，此函數可用於簡化訪問同一域的多個屬性的表達式。例如：
          
            ```
            cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)
            ```

            <!--
            The length of the expression must be smaller or equal to 10 Ki. The cost of evaluating it is also limited based on the estimated number of logical steps.
            -->

            此表達式的長度必須小於或等於 10 Ki。其求值的計算成本也會根據預估的邏輯步驟數進行限制。

      <!--
      - **devices.requests.exactly.tolerations** ([]DeviceToleration)

        *Atomic: will be replaced during a merge*
        
        If specified, the request's tolerations.
        
        Tolerations for NoSchedule are required to allocate a device which has a taint with that effect. The same applies to NoExecute.
      -->
      
      - **devices.requests.exactly.tolerations** ([]DeviceToleration)

        **原子性：將在合併時被替換**
        
        如果指定，則表示請求的容忍度。
        
        若設備帶有 `NoSchedule` 效果的污點，則需要指定相應的容忍度。這同樣適用於 `NoExecute`。

        <!--
        In addition, should any of the allocated devices get tainted with NoExecute after allocation and that effect is not tolerated, then all pods consuming the ResourceClaim get deleted to evict them. The scheduler will not let new pods reserve the claim while it has these tainted devices. Once all pods are evicted, the claim will get deallocated.
        
        The maximum number of tolerations is 16.
        -->

        此外，如果任意已分配的設備在分配後被標記了 `NoExecute` 污點，且此污點的效果不被容忍，
        則所有使用 ResourceClaim 的 Pod 都將被刪除以驅逐。
        對於已添加污點的設備，調度器不會允許新的 Pod 預留申領。
        一旦所有 Pod 都被驅逐，申領將被取消分配。

        最多支持 16 個容忍度。
        
        <!--
        This is an alpha field and requires enabling the DRADeviceTaints feature gate.

        <a name="DeviceToleration"></a>
        *The ResourceClaim this DeviceToleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*
        -->

        這是一個 Alpha 字段，需要啓用 DRADeviceTaints 特性門控。

        <a name="DeviceToleration"></a>
        **此 DeviceToleration 所掛接到的 ResourceClaim 可容忍與
        `<key,value,effect>` 三元組匹配的任何污點，匹配方式由操作符 `<operator>` 指定。**

        <!--
        - **devices.requests.exactly.tolerations.effect** (string)

          Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule and NoExecute.

        - **devices.requests.exactly.tolerations.key** (string)

          Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. Must be a label name.
        -->

        - **devices.requests.exactly.tolerations.effect** (string)

          effect 表示要匹配的污點效果。空意味着匹配所有污點效果。
          指定此字段時，允許值是 `NoSchedule` 和 `NoExecute`。

        - **devices.requests.exactly.tolerations.key** (string)

          key 是容忍適用的污點鍵。空意味着匹配所有污點鍵。
          如果 key 爲空，則 operator 必須是 `Exists`。
          這個組合意味着匹配所有取值和所有鍵。必須是標籤名稱。

        <!--
        - **devices.requests.exactly.tolerations.operator** (string)

          Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a ResourceClaim can tolerate all taints of a particular category.
        -->

        - **devices.requests.exactly.tolerations.operator** (string)

          operator 表示鍵值之間的關係。有效值爲 `Exists` 和 `Equal`，預設爲 `Equal`。
          `Exists` 相當於對取值使用通配符，因此 ResourceClaim 可以容忍特定類別的所有污點。

        <!--
        - **devices.requests.exactly.tolerations.tolerationSeconds** (int64)

          TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. If larger than zero, the time when the pod needs to be evicted is calculated as \<time when taint was adedd> + \<toleration seconds>.
        -->

        - **devices.requests.exactly.tolerations.tolerationSeconds** (int64)

          tolerationSeconds 表示容忍污點（必須是 `NoExecute` 效果，否則此字段將被忽略）的時長。
          預設不設置，這意味着永久容忍污點（不驅逐）。值爲 0 或負數時，將被系統視爲 0，即立刻驅逐。
          如果值大於 0，則計算需要驅逐 Pod 的時間公式爲：`<添加污點的時間> + <容忍秒數>`。

        <!--
        - **devices.requests.exactly.tolerations.value** (string)

          Value is the taint value the toleration matches to. If the operator is Exists, the value must be empty, otherwise just a regular string. Must be a label value.
        -->

        - **devices.requests.exactly.tolerations.value** (string)

          value 是容忍度所匹配到的污點值。若 operator 爲 `Exists`，此值必須爲空；
          否則爲普通字符串。必須是標籤值。

    <!--
    - **devices.requests.firstAvailable** ([]DeviceSubRequest)

      *Atomic: will be replaced during a merge*
      
      FirstAvailable contains subrequests, of which exactly one will be selected by the scheduler. It tries to satisfy them in the order in which they are listed here. So if there are two entries in the list, the scheduler will only check the second one if it determines that the first one can not be used.
    -->

    - **devices.requests.firstAvailable** ([]DeviceSubRequest)

      **原子性：將在合併時被替換**
      
      firstAvailable 包含多個子請求，調度器將從中選擇一個子請求。
      調度器會按照子請求在列表中的順序依次嘗試滿足它們。
      因此，如果列表中有兩條子請求，調度器只有在確認第一個請求不可用時纔會嘗試第二個。

      <!--
      DRA does not yet implement scoring, so the scheduler will select the first set of devices that satisfies all the requests in the claim. And if the requirements can be satisfied on more than one node, other scheduling features will determine which node is chosen. This means that the set of devices allocated to a claim might not be the optimal set available to the cluster. Scoring will be implemented later.
      -->

      DRA 尚未實現打分邏輯，因此調度器將選擇滿足申領中所有請求的第一組設備。
      如果在多個節點上都能滿足這些要求，則最終選擇哪個節點由其他調度特性決定。
      這意味着最終分配到申領的設備集合可能不是叢集中可用的最優選擇。打分邏輯將在未來實現。

      <!--
      <a name="DeviceSubRequest"></a>
      *DeviceSubRequest describes a request for device provided in the claim.spec.devices.requests[].firstAvailable array. Each is typically a request for a single resource like a device, but can also ask for several identical devices.
      
      DeviceSubRequest is similar to ExactDeviceRequest, but doesn't expose the AdminAccess field as that one is only supported when requesting a specific device.*
      -->

      <a name="DeviceSubRequest"></a>
      *DeviceSubRequest 描述在 `claim.spec.devices.requests[].firstAvailable` 數組中提供的某個設備請求。
      每個請求通常表示對某個設備等單個資源的請求，但也可以請求多個相同的設備。
      DeviceSubRequest 類似於 ExactDeviceRequest，但不暴露 adminAccess 字段（此字段僅適用於請求特定設備時）。*

      <!--
      - **devices.requests.firstAvailable.deviceClassName** (string), required

        DeviceClassName references a specific DeviceClass, which can define additional configuration and selectors to be inherited by this subrequest.
        
        A class is required. Which classes are available depends on the cluster.
        
        Administrators may use this to restrict which devices may get requested by only installing classes with selectors for permitted devices. If users are free to request anything without restrictions, then administrators can create an empty DeviceClass for users to reference.
      -->

      - **devices.requests.firstAvailable.deviceClassName**（string，必需）

        deviceClassName 引用特定的 DeviceClass，它可以定義要由此請求所繼承的額外設定和選擇算符。
      
        類是必需的。具體哪些類可用取決於叢集。
      
        管理員通過僅爲允許的設備使用選擇算符安裝類，就可以使用此字段限制哪些設備可以被請求。
        如果使用者可以自由請求任何設備而沒有限制，則管理員可以創建一個空的 DeviceClass 供使用者引用。

      <!--
      - **devices.requests.firstAvailable.name** (string), required

        Name can be used to reference this subrequest in the list of constraints or the list of configurations for the claim. References must use the format \<main request>/\<subrequest>.
        
        Must be a DNS label.
      -->

      - **devices.requests.firstAvailable.name** (string), required

        name 可用於在申領的約束列表或設定列表中引用此子請求。引用格式必須爲 `<主請求>/<子請求>`。
        
        必須是 DNS 標籤。

      - **devices.requests.firstAvailable.allocationMode** (string)

        <!--
        AllocationMode and its related fields define how devices are allocated to satisfy this subrequest. Supported values are:
        
        - ExactCount: This request is for a specific number of devices.
          This is the default. The exact number is provided in the
          count field.
        
        - All: This subrequest is for all of the matching devices in a pool.
          Allocation will fail if some devices are already allocated,
          unless adminAccess is requested.
        -->

        allocationMode 及其相關字段定義如何分配設備以滿足此請求。支持的值爲：
      
        - ExactCount：此請求是針對特定數量的設備。
          這是預設值。確切數量在 count 字段中提供。
      
        - All：此請求是針對池中所有匹配的設備。
          如果某些設備已經被分配，則分配將失敗，除非請求了 adminAccess。

        <!--
        If AllocationMode is not specified, the default mode is ExactCount. If the mode is ExactCount and count is not specified, the default count is one. Any other subrequests must specify this field.
        
        More modes may get added in the future. Clients must refuse to handle requests with unknown modes.
        -->

        如果 allocationMode 未被指定，則預設模式爲 ExactCount。
        如果模式爲 ExactCount 而 count 未被指定，則預設值爲 1。
        其他任何請求必須指定此字段。
      
        將來可能會添加更多模式。客戶端必須拒絕處理未知模式的請求。

      <!--
      - **devices.requests.firstAvailable.count** (int64)

        Count is used only when the count mode is "ExactCount". Must be greater than zero. If AllocationMode is ExactCount and this field is not specified, the default is one.
      -->

      - **devices.requests.firstAvailable.count** (int64)

        count 僅在計數模式爲 "ExactCount" 時使用。必須大於零。
        如果 allocationMode 爲 ExactCount 而此字段未被指定，則預設值爲 1。

      <!--
      - **devices.requests.firstAvailable.selectors** ([]DeviceSelector)

        *Atomic: will be replaced during a merge*
        
        Selectors define criteria which must be satisfied by a specific device in order for that device to be considered for this subrequest. All selectors must be satisfied for a device to be considered.

        <a name="DeviceSelector"></a>
        *DeviceSelector must have exactly one field set.*
      -->

      - **devices.requests.firstAvailable.selectors** ([]DeviceSelector)

        **原子性：將在合併期間被替換**
      
        selectors 定義特定設備必須滿足的條件，滿足條件的設備被視爲此請求的候選者。
        所有選擇算符必須同時被滿足纔會考慮某個設備。

        <a name="DeviceSelector"></a>
        **DeviceSelector 必須有且僅有一個字段被設置。**

        <!--
        - **devices.requests.firstAvailable.selectors.cel** (CELDeviceSelector)

          CEL contains a CEL expression for selecting a device.

          <a name="CELDeviceSelector"></a>
          *CELDeviceSelector contains a CEL expression for selecting a device.*
        -->

        - **devices.requests.firstAvailable.selectors.cel** (CELDeviceSelector)

          cel 包含一個用於選擇設備的 CEL 表達式。

          <a name="CELDeviceSelector"></a>
          **CELDeviceSelector 包含一個用於選擇設備的 CEL 表達式。**

          - **devices.requests.firstAvailable.selectors.cel.expression** (string), required

            <!--
            Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.

            The expression's input is an object named "device", which carries the following properties:
             - driver (string): the name of the driver which defines this device.
             - attributes (map[string]object): the device's attributes, grouped by prefix
               (e.g. device.attributes["dra.example.com"] evaluates to an object with all
               of the attributes which were prefixed by "dra.example.com".
             - capacity (map[string]object): the device's capacities, grouped by prefix.
            -->

            expression 是一個 CEL 表達式，用於評估單個設備。
            當被考慮的設備滿足所需條件時，表達式的求值結果必須爲 true；當不滿足時，結果應爲 false。
            任何其他結果都是錯誤，會導致設備分配中止。

            表達式的輸入是一個名爲 "device" 的對象，具有以下屬性：

            - driver (string)：定義此設備的驅動的名稱。
            - attributes (map[string]object)：設備的屬性，按前綴分組
              （例如，device.attributes["dra.example.com"] 評估爲一個對象，包含所有以 "dra.example.com" 爲前綴的屬性。）
            - capacity (map[string]object)：設備的容量，按前綴分組。
            
            <!--
            Example: Consider a device with driver="dra.example.com", which exposes two attributes named "model" and "ext.example.com/family" and which exposes one capacity named "modules". This input to this expression would have the following fields:
            -->
            
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

            此表達式的長度必須小於或等於 10 Ki。其求值的計算成本也會根據預估的邏輯步驟數進行限制。

      <!--
      - **devices.requests.firstAvailable.tolerations** ([]DeviceToleration)

        *Atomic: will be replaced during a merge*
        
        If specified, the request's tolerations.
        
        Tolerations for NoSchedule are required to allocate a device which has a taint with that effect. The same applies to NoExecute.
      -->

      - **devices.requests.exactly.tolerations** ([]DeviceToleration)

        **原子性：將在合併時被替換**
        
        如果指定，則表示請求的容忍度。
        
        若設備帶有 `NoSchedule` 效果的污點，則需要指定相應的容忍度。這同樣適用於 `NoExecute`。

        <!--
        In addition, should any of the allocated devices get tainted with NoExecute after allocation and that effect is not tolerated, then all pods consuming the ResourceClaim get deleted to evict them. The scheduler will not let new pods reserve the claim while it has these tainted devices. Once all pods are evicted, the claim will get deallocated.
        
        The maximum number of tolerations is 16.
        -->

        此外，如果任意已分配的設備在分配後被標記了 `NoExecute` 污點，且此污點的效果不被容忍，
        則所有使用 ResourceClaim 的 Pod 都將被刪除以驅逐。
        對於已添加污點的設備，調度器不會允許新的 Pod 預留申領。
        一旦所有 Pod 都被驅逐，申領將被取消分配。

        最多支持 16 個容忍度。
        
        <!--
        This is an alpha field and requires enabling the DRADeviceTaints feature gate.

        <a name="DeviceToleration"></a>
        *The ResourceClaim this DeviceToleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*
        -->

        這是一個 Alpha 字段，需要啓用 DRADeviceTaints 特性門控。

        <a name="DeviceToleration"></a>
        **此 DeviceToleration 所掛接到的 ResourceClaim 可容忍與
        `<key,value,effect>` 三元組匹配的任何污點，匹配方式由操作符 `<operator>` 指定。**

        <!--
        - **devices.requests.firstAvailable.tolerations.effect** (string)

          Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule and NoExecute.

        - **devices.requests.firstAvailable.tolerations.key** (string)

          Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. Must be a label name.
        -->

        - **devices.requests.firstAvailable.tolerations.effect** (string)

          effect 表示要匹配的污點效果。空意味着匹配所有污點效果。
          指定此字段時，允許值是 `NoSchedule` 和 `NoExecute`。

        - **devices.requests.firstAvailable.tolerations.key** (string)

          key 是容忍適用的污點鍵。空意味着匹配所有污點鍵。
          如果 key 爲空，則 operator 必須是 `Exists`。
          這個組合意味着匹配所有取值和所有鍵。必須是標籤名稱。

        <!--
        - **devices.requests.firstAvailable.tolerations.operator** (string)

          Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a ResourceClaim can tolerate all taints of a particular category.
        -->

        - **devices.requests.firstAvailable.tolerations.operator** (string)

          operator 表示鍵值之間的關係。有效值爲 `Exists` 和 `Equal`，預設爲 `Equal`。
          `Exists` 相當於對取值使用通配符，因此 ResourceClaim 可以容忍特定類別的所有污點。

        <!--
        - **devices.requests.firstAvailable.tolerations.tolerationSeconds** (int64)

          TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. If larger than zero, the time when the pod needs to be evicted is calculated as \<time when taint was adedd> + \<toleration seconds>.
        -->

        - **devices.requests.firstAvailable.tolerations.tolerationSeconds** (int64)

          tolerationSeconds 表示容忍污點（必須是 `NoExecute` 效果，否則此字段將被忽略）的時長。
          預設不設置，這意味着永久容忍污點（不驅逐）。值爲 0 或負數時，將被系統視爲 0，即立刻驅逐。
          如果值大於 0，則計算需要驅逐 Pod 的時間公式爲：`<添加污點的時間> + <容忍秒數>`。

        <!--
        - **devices.requests.firstAvailable.tolerations.value** (string)

          Value is the taint value the toleration matches to. If the operator is Exists, the value must be empty, otherwise just a regular string. Must be a label value.
        -->

        - **devices.requests.firstAvailable.tolerations.value** (string)

          value 是容忍度所匹配到的污點值。若操作符爲 `Exists`，此 value 必須爲空；
          否則爲普通字符串。必須是標籤值。

## ResourceClaimStatus {#ResourceClaimStatus}

<!--
ResourceClaimStatus tracks whether the resource has been allocated and what the result of that was.
-->
ResourceClaimStatus 跟蹤資源是否已被分配以及產生的結果是什麼。

<hr>

<!--
- **allocation** (AllocationResult)

  Allocation is set once the claim has been allocated successfully.

  <a name="AllocationResult"></a>
  *AllocationResult contains attributes of an allocated resource.*
-->
- **allocation** (AllocationResult)

  一旦申領已被成功分配，就會設置 allocation。

  <a name="AllocationResult"></a>
  **AllocationResult 包含已分配資源的屬性。**

  <!--
  - **allocation.devices** (DeviceAllocationResult)

    Devices is the result of allocating devices.

    <a name="DeviceAllocationResult"></a>
    *DeviceAllocationResult is the result of allocating devices.*
  -->

  - **allocation.devices** (DeviceAllocationResult)

    devices 是分配設備的結果。

    <a name="DeviceAllocationResult"></a>
    **DeviceAllocationResult 是分配設備的結果。**

    <!--
    - **allocation.devices.config** ([]DeviceAllocationConfiguration)

      *Atomic: will be replaced during a merge*
      
      This field is a combination of all the claim and class configuration parameters. Drivers can distinguish between those based on a flag.
      
      This includes configuration parameters for drivers which have no allocated devices in the result because it is up to the drivers which configuration parameters they support. They can silently ignore unknown configuration parameters.

      <a name="DeviceAllocationConfiguration"></a>
      *DeviceAllocationConfiguration gets embedded in an AllocationResult.*
    -->

    - **allocation.devices.config** ([]DeviceAllocationConfiguration)

      **原子性：將在合併期間被替換**

      此字段是所有申領和類設定參數的組合。驅動可以基於某標誌來區分這些參數。

      字段包括在結果中沒有分配設備的驅動的設定參數，因爲由驅動決定它們支持哪些設定參數。
      它們可以靜默忽略未知的設定參數。

      <a name="DeviceAllocationConfiguration"></a>
      **DeviceAllocationConfiguration 嵌入在 AllocationResult 中。**

      <!--
      - **allocation.devices.config.source** (string), required

        Source records whether the configuration comes from a class and thus is not something that a normal user would have been able to set or from a claim.

      - **allocation.devices.config.opaque** (OpaqueDeviceConfiguration)

        Opaque provides driver-specific configuration parameters.

        <a name="OpaqueDeviceConfiguration"></a>
        *OpaqueDeviceConfiguration contains configuration parameters for a driver in a format defined by the driver vendor.*
      -->

      - **allocation.devices.config.source** (string)，必需

        source 記錄設定是否來自某類（因此不是普通使用者能夠設置的內容）或者來自某申領。

      - **allocation.devices.config.opaque** (OpaqueDeviceConfiguration)

        opaque 提供特定於驅動的設定參數。

        <a name="OpaqueDeviceConfiguration"></a>
        **OpaqueDeviceConfiguration 包含由以驅動供應商所定義的格式提供驅動的設定參數。**

        <!--
        - **allocation.devices.config.opaque.driver** (string), required

          Driver is used to determine which kubelet plugin needs to be passed these configuration parameters.
          
          An admission policy provided by the driver developer could use this to decide whether it needs to validate them.
          
          Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
        -->

        - **allocation.devices.config.opaque.driver** (string)，必需

          driver 用於確定需要將這些設定參數傳遞給哪個 kubelet 插件。

          由驅動開發者提供的准入策略可以使用此字段來決定是否需要驗證這些設定參數。

          必須是 DNS 子域，並且應以驅動供應商擁有的 DNS 域結尾。

        <!--
        - **allocation.devices.config.opaque.parameters** (RawExtension), required

          Parameters can contain arbitrary data. It is the responsibility of the driver developer to handle validation and versioning. Typically this includes self-identification and a version ("kind" + "apiVersion" for Kubernetes types), with conversion between different versions.
          
          The length of the raw data must be smaller or equal to 10 Ki.

          <a name="RawExtension"></a>
          *RawExtension is used to hold extensions in external versions.
          
          To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
        -->

        - **allocation.devices.config.opaque.parameters** (RawExtension)，必需

          parameters 可以包含任意資料。驅動開發者負責處理校驗和版本控制。
          通常，這包括自我標識資訊和版本化資訊（就 Kubernetes 而言是 "kind" + "apiVersion"），以及不同版本之間的轉換。

          原始資料的長度必須小於或等於 10 Ki。
          
          <a name="RawExtension"></a>
          **RawExtension 用於以外部版本來保存擴展資料。**
        
          要使用它，請生成一個字段，在外部、版本化結構中以 RawExtension 作爲其類型，在內部結構中以 Object 作爲其類型。
          你還需要註冊你的各個插件類型。
          
          <!--
          // Internal package:
          -->

          // 內部包：

          ```go
          type MyAPIObject struct {
            runtime.TypeMeta `json:",inline"`
            MyPlugin runtime.Object `json:"myPlugin"`
          }
          
          type PluginA struct {
            AOption string `json:"aOption"`
          }
          ```
          
          <!--
          // External package:
          -->

          // 外部包：

          ```go
          type MyAPIObject struct {
            runtime.TypeMeta `json:",inline"`
            MyPlugin runtime.RawExtension `json:"myPlugin"`
          }
          
          type PluginA struct {
            AOption string `json:"aOption"`
          }
          ```
          
          <!--
          // On the wire, the JSON will look something like this:
          -->

          // 在網路上，JSON 將類似於：

          ```json
          {
            "kind":"MyAPIObject",
            "apiVersion":"v1",
            "myPlugin": {
              "kind":"PluginA",
              "aOption":"foo",
            },
          }
          ```
          
          <!--
          So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)*
          -->

          那麼會發生什麼？解碼首先使用 JSON 或 YAML 將序列化資料解組到你的外部 MyAPIObject 中。
          這會導致原始 JSON 被儲存下來，但不會被解包。下一步是複製（使用 pkg/conversion）到內部結構中。
          runtime 包的 DefaultScheme 安裝了轉換函數，它將解析儲存在 RawExtension 中的 JSON，
          將其轉換爲正確的對象類型，並將其儲存在 Object 中。
          （TODO：如果對象是未知類型，將創建並儲存一個 `runtime.Unknown` 對象。）

      <!--
      - **allocation.devices.config.requests** ([]string)

        *Atomic: will be replaced during a merge*
        
        Requests lists the names of requests where the configuration applies. If empty, its applies to all requests.

        References to subrequests must include the name of the main request and may include the subrequest using the format \<main request>[/\<subrequest>]. If just the main request is given, the configuration applies to all subrequests.
      -->

      - **allocation.devices.config.requests** ([]string)

        **原子性：將在合併期間被替換**

        requests 列舉設定適用的請求名稱。如果爲空，則適用於所有請求。

        對子請求的引用必須包含主請求的名稱，並可以使用格式 `<主請求>[/<子請求>]` 來包含子請求。
        如果只提供主請求，則此設定適用於所有子請求。

    <!--
    - **allocation.devices.results** ([]DeviceRequestAllocationResult)

      *Atomic: will be replaced during a merge*
      
      Results lists all allocated devices.

      <a name="DeviceRequestAllocationResult"></a>
      *DeviceRequestAllocationResult contains the allocation result for one request.*
    -->

    - **allocation.devices.results** ([]DeviceRequestAllocationResult)

      **原子性：將在合併期間被替換**

      results 列舉所有已分配的設備。

      <a name="DeviceRequestAllocationResult"></a>
      **DeviceRequestAllocationResult 包含一個請求的分配結果。**

      <!--
      - **allocation.devices.results.device** (string), required

        Device references one device instance via its name in the driver's resource pool. It must be a DNS label.

      - **allocation.devices.results.driver** (string), required

        Driver specifies the name of the DRA driver whose kubelet plugin should be invoked to process the allocation once the claim is needed on a node.
        
        Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
      -->

      - **allocation.devices.results.device** (string)，必需

        device 通過名稱引用驅動資源池中的一個設備實例。字段值必須是一個 DNS 標籤。

      - **allocation.devices.results.driver** (string)，必需

        driver 指定 DRA 驅動的名稱，此驅動的 kubelet 插件應在節點上需要申領時被調用以處理分配。

        必須是 DNS 子域，並且應以驅動供應商擁有的 DNS 域結尾。

      <!--
      - **allocation.devices.results.pool** (string), required

        This name together with the driver name and the device name field identify which device was allocated (`\<driver name>/\<pool name>/\<device name>`).
        
        Must not be longer than 253 characters and may contain one or more DNS sub-domains separated by slashes.

      - **allocation.devices.results.request** (string), required

        Request is the name of the request in the claim which caused this device to be allocated. If it references a subrequest in the firstAvailable list on a DeviceRequest, this field must include both the name of the main request and the subrequest using the format \<main request>/\<subrequest>.
        
        Multiple devices may have been allocated per request.
      -->

      - **allocation.devices.results.pool** (string)，必需

        此名稱與驅動名稱和設備名稱字段一起標識哪些設備已被分配（`<驅動名稱>/<資源池名稱>/<設備名稱>`）。

        不得超過 253 個字符，並且可以包含用一個或多個用斜槓分隔的 DNS 子域。

      - **allocation.devices.results.request** (string)，必需

        request 是造成此設備被分配的申領中的請求名稱。
        如果它引用 DeviceRequest 上的 firstAvailable 列表中的某個子請求，
        則此字段必須同時包含主請求和子請求的名稱，格式爲：`<主請求>/<子請求>`。

        每個請求可以分配多個設備。

      <!--
      - **allocation.devices.results.adminAccess** (boolean)

        AdminAccess indicates that this device was allocated for administrative access. See the corresponding request field for a definition of mode.
        
        This is an alpha field and requires enabling the DRAAdminAccess feature gate. Admin access is disabled if this field is unset or set to false, otherwise it is enabled.
      -->

      - **allocation.devices.results.adminAccess** (boolean)

        adminAccess 表示設備被分配了管理員訪問權限。
        有關模式的定義，參見對應的請求字段。

        這是一個 Alpha 字段，需要啓用 `DRAAdminAccess` 特性門控。
        如果此字段不設置或設置爲 false，則管理員訪問權限被禁用；否則將啓用管理員訪問權限。

      <!--
      - **allocation.devices.results.tolerations** ([]DeviceToleration)

        *Atomic: will be replaced during a merge*
        
        A copy of all tolerations specified in the request at the time when the device got allocated.
        
        The maximum number of tolerations is 16.
        
        This is an alpha field and requires enabling the DRADeviceTaints feature gate.

        <a name="DeviceToleration"></a>
        *The ResourceClaim this DeviceToleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*
      -->

      - **allocation.devices.results.tolerations** ([]DeviceToleration)

        **原子性：將在合併期間被替換**
        
        在設備被分配時，在請求中指定的所有容忍度的副本。

        容忍度的最大數量爲 16 個。

        這是一個 Alpha 字段，需要啓用 DRADeviceTaints 特性門控。

        <a name="DeviceToleration"></a>
        **此 DeviceToleration 所掛接到的 ResourceClaim 可容忍與
        `<key,value,effect>` 三元組匹配的任何污點，匹配方式由操作符 `<operator>` 指定。**

        <!--
        - **allocation.devices.results.tolerations.effect** (string)

          Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule and NoExecute.

        - **allocation.devices.results.tolerations.key** (string)

          Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. Must be a label name.
        -->

        - **allocation.devices.results.tolerations.effect** (string)

          effect 表示要匹配的污點效果。空意味着匹配所有污點效果。
          指定此字段時，允許值是 `NoSchedule` 和 `NoExecute`。

        - **allocation.devices.results.tolerations.key** (string)

          key 是容忍適用的污點鍵。空意味着匹配所有污點鍵。
          如果 key 爲空，則 operator 必須是 `Exists`。
          這個組合意味着匹配所有取值和所有鍵。必須是標籤名稱。

        <!--
        - **allocation.devices.results.tolerations.operator** (string)

          Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a ResourceClaim can tolerate all taints of a particular category.
        -->

        - **allocation.devices.results.tolerations.operator** (string)

          operator 表示鍵值之間的關係。有效值爲 `Exists` 和 `Equal`，預設爲 `Equal`。
          `Exists` 相當於對取值使用通配符，因此 ResourceClaim 可以容忍特定類別的所有污點。

        <!--
        - **allocation.devices.results.tolerations.tolerationSeconds** (int64)

          TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. If larger than zero, the time when the pod needs to be evicted is calculated as \<time when taint was adedd> + \<toleration seconds>.
        -->

        - **allocation.devices.results.tolerations.tolerationSeconds** (int64)

          tolerationSeconds 表示容忍污點（必須是 `NoExecute` 效果，否則此字段將被忽略）的時長。
          預設不設置，這意味着永久容忍污點（不驅逐）。值爲 0 或負數時，將被系統視爲 0，即立刻驅逐。
          如果值大於 0，則計算需要驅逐 Pod 的時間公式爲：`<添加污點的時間> + <容忍秒數>`。

        <!--
        - **allocation.devices.results.tolerations.value** (string)

          Value is the taint value the toleration matches to. If the operator is Exists, the value must be empty, otherwise just a regular string. Must be a label value.
        -->

        - **allocation.devices.results.tolerations.value** (string)

          value 是容忍度所匹配到的污點值。若 operator 爲 `Exists`，此值必須爲空；
          否則爲普通字符串。必須是標籤值。

  <!--
  - **allocation.nodeSelector** (NodeSelector)

    NodeSelector defines where the allocated resources are available. If unset, they are available everywhere.

    <a name="NodeSelector"></a>
    *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*
  -->

  - **allocation.nodeSelector** (NodeSelector)

    nodeSelector 定義在哪兒可以使用分配的資源。如果不設置，則分配的資源在任何地方都可用。

    <a name="NodeSelector"></a>
    **節點選擇算符表示在一組節點上一個或多個標籤查詢結果的並集；
    也就是說，它表示由節點選擇算符條件表示的選擇算符的邏輯或計算結果。**

    <!--
    - **allocation.nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), required

      *Atomic: will be replaced during a merge*
      
      Required. A list of node selector terms. The terms are ORed.

      <a name="NodeSelectorTerm"></a>
      *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
    -->

    - **allocation.nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

      **原子性：將在合併期間被替換**

      必需。節點選擇算符條件的列表。這些條件以邏輯與進行計算。

      <a name="NodeSelectorTerm"></a>
      **一個 null 或空的節點選擇算符條件不會與任何對象匹配。這些要求會按邏輯與的關係來計算。
      TopologySelectorTerm 類別實現了 NodeSelectorTerm 的子集。**

      <!--
      - **allocation.nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's labels.

      - **allocation.nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's fields.
      -->

      - **allocation.nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        **原子性：將在合併期間被替換**

        基於節點標籤所設置的節點選擇算符要求的列表。

      - **allocation.nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        **原子性：將在合併期間被替換**

        基於節點字段所設置的節點選擇算符要求的列表。

<!--
- **devices** ([]AllocatedDeviceStatus)

  *Map: unique values on keys `driver, device, pool` will be kept during a merge*
  
  Devices contains the status of each device allocated for this claim, as reported by the driver. This can include driver-specific information. Entries are owned by their respective drivers.

  <a name="AllocatedDeviceStatus"></a>
  *AllocatedDeviceStatus contains the status of an allocated device, if the driver chooses to report it. This may include driver-specific information.*
-->
- **devices**（[]AllocatedDeviceStatus）

  **映射：`driver`、`device` 和 `pool` 這些鍵的唯一取值將在合併期間被保留**

  devices 包含爲了此申領分配的每個設備的狀態，由驅動上報。
  這可以包含特定於驅動的資訊。這些條目的所有權歸對應的驅動所有。

  <a name="AllocatedDeviceStatus"></a>
  **AllocatedDeviceStatus 包含已分配設備的狀態（如果驅動選擇上報）。這可能包含特定於驅動的資訊。**

  <!--
  - **devices.device** (string), required

    Device references one device instance via its name in the driver's resource pool. It must be a DNS label.

  - **devices.driver** (string), required

    Driver specifies the name of the DRA driver whose kubelet plugin should be invoked to process the allocation once the claim is needed on a node.
    
    Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
  -->

  - **allocation.devices.results.device** (string)，必需

    device 通過名稱引用驅動資源池中的一個設備實例。字段值必須是一個 DNS 標籤。

  - **allocation.devices.results.driver** (string)，必需

    driver 指定 DRA 驅動的名稱，此驅動的 kubelet 插件應在節點上需要申領時被調用以處理分配。

    必須是 DNS 子域，並且應以驅動供應商擁有的 DNS 域結尾。

  <!--
  - **devices.pool** (string), required

    This name together with the driver name and the device name field identify which device was allocated (`\<driver name>/\<pool name>/\<device name>`).
    
    Must not be longer than 253 characters and may contain one or more DNS sub-domains separated by slashes.
  -->

  - **devices.pool** (string)，必需

    此名稱與驅動名稱和設備名稱字段一起標識哪些設備已被分配（`<驅動名稱>/<資源池名稱>/<設備名稱>`）。

    不得超過 253 個字符，並且可以包含一個或多個用斜槓分隔的 DNS 子域。

  <!--
  - **devices.conditions** ([]Condition)

    *Map: unique values on key type will be kept during a merge*
    
    Conditions contains the latest observation of the device's state. If the device has been configured according to the class and claim config references, the `Ready` condition should be True.
    
    Must not contain more than 8 entries.
  -->

  - **devices.conditions** ([]Condition)

    **映射：合併時將保留 type 鍵的唯一值**

    conditions 包含對設備狀態的最新觀測結果。
    如果設備已經根據類和申領設定飲用完成設定，則 `Ready` 狀況應爲 True。

    條目數量不得超過 8 個。

    <!--
    <a name="Condition"></a>
    *Condition contains details for one aspect of the current state of this API Resource.*

    - **devices.conditions.lastTransitionTime** (Time), required

      lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

      <a name="Time"></a>
      *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    <a name="Condition"></a>
    **Condition 包含此 API 資源某一方面當前狀態的詳細資訊。**

    - **devices.conditions.lastTransitionTime** (Time)，必需

      lastTransitionTime 是狀況最近一次狀態轉化的時間。
      變化應該發生在下層狀況發生變化的時候。如果不知道下層狀況發生變化的時間，
      那麼使用 API 字段更改的時間是可以接受的。

      <a name="Time"></a>
      **Time 是 time.Time 的包裝類，支持正確地序列化爲 YAML 和 JSON。
      爲 time 包提供的許多工廠方法提供了包裝類。**

    <!--
    - **devices.conditions.message** (string), required

      message is a human readable message indicating details about the transition. This may be an empty string.

    - **devices.conditions.reason** (string), required

      reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.
    -->

    - **devices.conditions.message** (string)，必需

      message 是人類可讀的消息，有關轉換的詳細資訊，可以是空字符串。

    - **devices.conditions.reason** (string)，必需

      reason 包含一個程式標識符，指示 condition 最後一次轉換的原因。
      特定狀況類型的生產者可以定義該字段的預期值和含義，以及這些值是否被視爲有保證的 API。
      此值應該是 CamelCase 字符串且不能爲空。

    <!--
    - **devices.conditions.status** (string), required

      status of the condition, one of True, False, Unknown.

    - **devices.conditions.type** (string), required

      type of condition in CamelCase or in foo.example.com/CamelCase.
    -->

    - **devices.conditions.status** (string)，必需

      狀況的狀態，True、False、Unknown 之一。

    - **devices.conditions.type** (string)，必需

      CamelCase 或 foo.example.com/CamelCase 中的條件類型。

    <!--
    - **devices.conditions.observedGeneration** (int64)

      observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.
    -->

    - **devices.conditions.observedGeneration** (int64)

      observedGeneration 表示設置 condition 基於的 .metadata.generation 的過期次數。
      例如，如果 .metadata.generation 當前爲 12，但 .status.conditions[x].observedGeneration 爲 9，
      則 condition 相對於實例的當前狀態已過期。

  <!--
  - **devices.data** (RawExtension)

    Data contains arbitrary driver-specific data.
    
    The length of the raw data must be smaller or equal to 10 Ki.

    <a name="RawExtension"></a>
    *RawExtension is used to hold extensions in external versions.
    
    To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
  -->

  - **devices.data** (RawExtension)

    data 包含任意特定於驅動的資料。
    
    原始資料的長度必須小於或等於 10 Ki。

    <a name="RawExtension"></a>
    **RawExtension 用於以外部版本來保存擴展資料。**
    
    要使用它，請在外部、版本化的結構中生成一個字段，以 RawExtension 作爲其類型，在內部結構中以 Object 作爲其類型。
    你還需要註冊你的各個插件類型。

    <!--
    // Internal package:
    -->

    // 內部包：
    
    ```go
    	type MyAPIObject struct {
    		runtime.TypeMeta `json:",inline"`
    		MyPlugin runtime.Object `json:"myPlugin"`
    	}
    
    	type PluginA struct {
    		AOption string `json:"aOption"`
    	}
    ```
    
    <!--
    // External package:
    -->

    // 外部包：
    
    ```go
    	type MyAPIObject struct {
    		runtime.TypeMeta `json:",inline"`
    		MyPlugin runtime.RawExtension `json:"myPlugin"`
    	}
    
    	type PluginA struct {
    		AOption string `json:"aOption"`
    	}
    ```
    
    <!--
    // On the wire, the JSON will look something like this:
    -->

    // 在網路上，JSON 看起來像這樣：
    
    ```json
    	{
    		"kind":"MyAPIObject",
    		"apiVersion":"v1",
    		"myPlugin": {
    			"kind":"PluginA",
    			"aOption":"foo",
    		},
    	}
    ```
    
    <!--
    So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)*
    -->

    那麼會發生什麼？解碼首先使用 JSON 或 YAML 將序列化資料解組到你的外部 MyAPIObject 中。
    這會導致原始 JSON 被儲存下來，但不會被解包。下一步是複製（使用 pkg/conversion）到內部結構中。
    runtime 包的 DefaultScheme 安裝了轉換函數，它將解析儲存在 RawExtension 中的 JSON，
    將其轉換爲正確的對象類型，並將其儲存在 Object 中。
   （TODO：如果對象是未知類型，將創建並儲存一個 `runtime.Unknown` 對象。）

  <!--
  - **devices.networkData** (NetworkDeviceData)

    NetworkData contains network-related information specific to the device.

    <a name="NetworkDeviceData"></a>
    *NetworkDeviceData provides network-related details for the allocated device. This information may be filled by drivers or other components to configure or identify the device within a network context.*
  -->

  - **devices.networkData**（NetworkDeviceData）

    networkData 包含特定於設備的網路相關資訊。

    <a name="NetworkDeviceData"></a>
    **NetworkDeviceData 提供已分配設備的網路相關細節。
    此資訊可以由驅動或其他組件填充，用於在網路上下文中設定或標識設備。**

    <!--
    - **devices.networkData.hardwareAddress** (string)

      HardwareAddress represents the hardware address (e.g. MAC Address) of the device's network interface.
      
      Must not be longer than 128 characters.
    -->

    - **devices.networkData.hardwareAddress** (string)

      hardwareAddress 表示設備網路介面的硬件地址（例如 MAC 地址）。

      長度不得超過 128 個字符。

    <!--
    - **devices.networkData.interfaceName** (string)

      InterfaceName specifies the name of the network interface associated with the allocated device. This might be the name of a physical or virtual network interface being configured in the pod.
      
      Must not be longer than 256 characters.
    -->

    - **devices.networkData.interfaceName** (string)

      interfaceName 指定與已分配設備關聯的網路介面的名稱。
      這可能是正分配在 Pod 中的物理或虛擬網路介面的名稱。
      
      長度不得超過 256 個字符。

    <!--
    - **devices.networkData.ips** ([]string)

      *Atomic: will be replaced during a merge*
      
      IPs lists the network addresses assigned to the device's network interface. This can include both IPv4 and IPv6 addresses. The IPs are in the CIDR notation, which includes both the address and the associated subnet mask. e.g.: "192.0.2.5/24" for IPv4 and "2001:db8::5/64" for IPv6.
    -->

    - **devices.networkData.ips** ([]string)

      **原子性：將在合併期間被替換**
      
      ips 列舉分配給設備網路介面的網路地址。這可以包括 IPv4 和 IPv6 地址。
      IP 使用 CIDR 表示法，包含地址和關聯的子網掩碼，例如
      "192.0.2.5/24" 是 IPv4 地址，"2001:db8::5/64" 是 IPv6 地址。

<!--
- **reservedFor** ([]ResourceClaimConsumerReference)

  *Patch strategy: merge on key `uid`*
  
  *Map: unique values on key uid will be kept during a merge*
  
  ReservedFor indicates which entities are currently allowed to use the claim. A Pod which references a ResourceClaim which is not reserved for that Pod will not be started. A claim that is in use or might be in use because it has been reserved must not get deallocated.
-->
- **reservedFor** ([]ResourceClaimConsumerReference)

  **補丁策略：根據鍵 `uid` 執行合併操作**

  **映射：在合併期間將根據鍵 uid 保留唯一值**

  reservedFor 標明目前哪些實體允許使用申領。
  如果 Pod 引用了未爲其預留的 ResourceClaim，則該 Pod 將不會啓動。
  正在使用或可能正在使用的申領（因爲它已被預留）不準被去配。

  <!--
  In a cluster with multiple scheduler instances, two pods might get scheduled concurrently by different schedulers. When they reference the same ResourceClaim which already has reached its maximum number of consumers, only one pod can be scheduled.
  
  Both schedulers try to add their pod to the claim.status.reservedFor field, but only the update that reaches the API server first gets stored. The other one fails with an error and the scheduler which issued it knows that it must put the pod back into the queue, waiting for the ResourceClaim to become usable again.
  -->

  在有多個調度器實例的叢集中，兩個 Pod 可能會被不同的調度器同時調度。
  當它們引用同一個已達到最大使用者數量的 ResourceClaim 時，只能有一個 Pod 被調度。

  兩個調度器都嘗試將它們的 Pod 添加到 claim.status.reservedFor 字段，
  但只有第一個到達 API 伺服器的更新會被儲存，另一個會因錯誤而失敗。
  發出此請求的調度器知道它必須將 Pod 重新放回隊列，等待 ResourceClaim 再次可用。

  <!--
  There can be at most 256 such reservations. This may get increased in the future, but not reduced.

  <a name="ResourceClaimConsumerReference"></a>
  *ResourceClaimConsumerReference contains enough information to let you locate the consumer of a ResourceClaim. The user must be a resource in the same namespace as the ResourceClaim.*
  -->

  最多可以有 32 個這樣的預留。這一限制可能會在未來放寬，但不會減少。

  <a name="ResourceClaimConsumerReference"></a>
  **ResourceClaimConsumerReference 包含足夠的資訊以便定位 ResourceClaim 的使用者。
  使用者必須是與 ResourceClaim 在同一名字空間中的資源。**

  <!--
  - **reservedFor.name** (string), required

    Name is the name of resource being referenced.

  - **reservedFor.resource** (string), required

    Resource is the type of resource being referenced, for example "pods".
  -->

  - **reservedFor.name** (string)，必需

    name 是所引用資源的名稱。

  - **reservedFor.resource** (string)，必需

    resource 是所引用資源的類別，例如 "pods"。

  <!--
  - **reservedFor.uid** (string), required

    UID identifies exactly one incarnation of the resource.

  - **reservedFor.apiGroup** (string)

    APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.
  -->

  - **reservedFor.uid** (string)，必需

    uid 用於唯一標識資源的某實例。

  - **reservedFor.apiGroup** (string)

    apiGroup 是所引用資源的組。對於核心 API 而言此值爲空字符串。
    字段值與創建資源時所用的 apiVersion 中的組匹配。

## ResourceClaimList {#ResourceClaimList}

<!--
ResourceClaimList is a collection of claims.
-->
ResourceClaimList 是申領的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1beta2

- **kind**: ResourceClaimList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>), required

  Items is the list of resource claims.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元資料。

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>)，必需

  items 是資源申領的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified ResourceClaim

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 ResourceClaim

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Response
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ResourceClaim 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ResourceClaim

#### HTTP Request
-->
### `get` 讀取指定 ResourceClaim 的狀態

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Response
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ResourceClaim 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaim

#### HTTP Request
-->
### `list` 列舉或監視 ResourceClaim 類別的對象

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 參數

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaim

#### HTTP Request
-->
### `list` 列舉或監視 ResourceClaim 類別的對象

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta2/resourceclaims

<!--
#### Parameters

- **allowWatchBookmarks** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 參數

- **allowWatchBookmarks**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

<!--
### `create` create a ResourceClaim

#### HTTP Request
-->
### `create` 創建 ResourceClaim

#### HTTP 請求

POST /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ResourceClaim

#### HTTP Request
-->
### `update` 替換指定的 ResourceClaim

#### HTTP 請求

PUT /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ResourceClaim 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ResourceClaim

#### HTTP Request
-->
### `update` 替換指定 ResourceClaim 的狀態

#### HTTP 請求

PUT /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ResourceClaim 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ResourceClaim

#### HTTP Request
-->
### `patch` 部分更新指定的 ResourceClaim

#### HTTP 請求

PATCH /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ResourceClaim 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ResourceClaim

#### HTTP Request
-->
### `patch` 部分更新指定 ResourceClaim 的狀態

#### HTTP 請求

PATCH /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ResourceClaim 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `delete` delete a ResourceClaim

#### HTTP Request
-->
### `delete` 刪除 ResourceClaim

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ResourceClaim 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ResourceClaim

#### HTTP Request
-->
### `deletecollection` 刪除 ResourceClaim 的集合

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaims

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 參數

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
