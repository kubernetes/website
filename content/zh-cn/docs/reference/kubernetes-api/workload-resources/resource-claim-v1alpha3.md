---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim 描述对集群中供工作负载使用的资源的访问请求。"
title: "ResourceClaim v1alpha3"
weight: 16
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim describes a request for access to resources in the cluster, for use by workloads."
title: "ResourceClaim v1alpha3"
weight: 16
auto_generated: true
-->

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`

## ResourceClaim {#ResourceClaim}

<!--
ResourceClaim describes a request for access to resources in the cluster, for use by workloads. For example, if a workload needs an accelerator device with specific properties, this is how that request is expressed. The status stanza tracks whether this claim has been satisfied and what specific resources have been allocated.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.
-->
ResourceClaim 描述对集群中供工作负载使用的资源的访问请求。
例如，如果某个工作负载需要具有特定属性的加速器设备，这就是表达该请求的方式。
状态部分跟踪此申领是否已被满足，以及具体分配了哪些资源。

这是一个 Alpha 级别的资源类型，需要启用 DynamicResourceAllocation 特性门控。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: ResourceClaim

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。

<!--
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), required

  Spec describes what is being requested and how to configure it. The spec is immutable.

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  Status describes whether the claim is ready to use and what has been allocated.
-->
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimSpec" >}}">ResourceClaimSpec</a>)，必需

  spec 描述正在被请求的资源及其配置方式。spec 是不可变更的。

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  status 描述申领是否就绪以及已分配了哪些。

## ResourceClaimSpec {#ResourceClaimSpec}

<!--
ResourceClaimSpec defines what is being requested in a ResourceClaim and how to configure it.
-->
ResourceClaimSpec 定义在 ResourceClaim 中正在被请求的资源及其配置方式。

<hr>

<!--
- **controller** (string)

  Controller is the name of the DRA driver that is meant to handle allocation of this claim. If empty, allocation is handled by the scheduler while scheduling a pod.
  
  Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
  
  This is an alpha field and requires enabling the DRAControlPlaneController feature gate.
-->
- **controller** (string)

  controller 是用于处理此申领分配的 DRA 驱动的名称。
  如果为空，则在调度 Pod 时分配由调度器处理。

  必须是一个 DNS 子域，并且应以驱动供应商拥有的 DNS 域结尾。

  这是一个 Alpha 字段，需要启用 DRAControlPlaneController 特性门控。

<!--
- **devices** (DeviceClaim)

  Devices defines how to request devices.

  <a name="DeviceClaim"></a>
  *DeviceClaim defines how to request devices with a ResourceClaim.*
-->
- **devices** (DeviceClaim)

  devices 定义如何请求设备。

  <a name="DeviceClaim"></a>
  **DeviceClaim 定义如何通过 ResourceClaim 请求设备。**

  <!--
  - **devices.config** ([]DeviceClaimConfiguration)

    *Atomic: will be replaced during a merge*
    
    This field holds configuration for multiple potential drivers which could satisfy requests in this claim. It is ignored while allocating the claim.

    <a name="DeviceClaimConfiguration"></a>
    *DeviceClaimConfiguration is used for configuration parameters in DeviceClaim.*
  -->

  - **devices.config** ([]DeviceClaimConfiguration)

    **原子：将在合并期间被替换**
    
    此字段保存可以满足此申领请求的多个潜在驱动的配置。在分配申领时此字段被忽略。

    <a name="DeviceClaimConfiguration"></a>
    **DeviceClaimConfiguration 用于 DeviceClaim 中的配置参数。**

    <!--
    - **devices.config.opaque** (OpaqueDeviceConfiguration)

      Opaque provides driver-specific configuration parameters.

      <a name="OpaqueDeviceConfiguration"></a>
      *OpaqueDeviceConfiguration contains configuration parameters for a driver in a format defined by the driver vendor.*
    -->

    - **devices.config.opaque** (OpaqueDeviceConfiguration)

      opaque 提供特定于驱动的配置参数。

      <a name="OpaqueDeviceConfiguration"></a>
      **OpaqueDeviceConfiguration 以驱动供应商所定义的格式提供驱动的配置参数。**

      <!--
      - **devices.config.opaque.driver** (string), required

        Driver is used to determine which kubelet plugin needs to be passed these configuration parameters.
        
        An admission policy provided by the driver developer could use this to decide whether it needs to validate them.
        
        Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
      -->

      - **devices.config.opaque.driver** (string)，必需

        driver 用于确定需要将这些配置参数传递给哪个 kubelet 插件。
        
        驱动开发者所提供的准入策略可以使用此字段来决定是否需要校验这些参数。
        
        必须是一个 DNS 子域，并且应以驱动供应商拥有的 DNS 域结尾。

      <!--
      - **devices.config.opaque.parameters** (RawExtension), required

        Parameters can contain arbitrary data. It is the responsibility of the driver developer to handle validation and versioning. Typically this includes self-identification and a version ("kind" + "apiVersion" for Kubernetes types), with conversion between different versions.

        <a name="RawExtension"></a>
        *RawExtension is used to hold extensions in external versions.
        
        To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
      -->

      - **devices.config.opaque.parameters** (RawExtension)，必需

        parameters 可以包含任意数据。处理校验和版本控制是驱动开发者的责任。
        通常这包括自我识别和版本化管理（对 Kubernetes 而言即 "kind" + "apiVersion"），并在不同版本之间进行转换。

        <a name="RawExtension"></a>
        **RawExtension 用于以外部版本来保存扩展数据。**
        
        要使用它，请生成一个字段，在外部、版本化结构中以 RawExtension 作为其类型，在内部结构中以 Object 作为其类型。
        你还需要注册你的各个插件类型。
        
        <!--
        // Internal package:
        -->

        // 内部包：

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

        // 在网络上，JSON 看起来像这样：

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

        那么会发生什么？解码首先使用 JSON 或 YAML 将序列化数据解组到你的外部 MyAPIObject 中。
        这会导致原始 JSON 被存储下来，但不会被解包。下一步是复制（使用 pkg/conversion）到内部结构中。
        runtime 包的 DefaultScheme 安装了转换函数，它将解析存储在 RawExtension 中的 JSON，
        将其转换为正确的对象类型，并将其存储在 Object 中。
        （TODO：如果对象是未知类型，将创建并存储一个 `runtime.Unknown` 对象。）

    <!--
    - **devices.config.requests** ([]string)

      *Atomic: will be replaced during a merge*
      
      Requests lists the names of requests where the configuration applies. If empty, it applies to all requests.
    -->

    - **devices.config.requests** ([]string)

      **原子：将在合并期间被替换**
      
      requests 列出了配置适用的请求的名称。如果为空，则适用于所有请求。

  <!--
  - **devices.constraints** ([]DeviceConstraint)

    *Atomic: will be replaced during a merge*
    
    These constraints must be satisfied by the set of devices that get allocated for the claim.

    <a name="DeviceConstraint"></a>
    *DeviceConstraint must have exactly one field set besides Requests.*
  -->

  - **devices.constraints** ([]DeviceConstraint)

    **原子：将在合并期间被替换**
    
    这些约束必须由为申领分配的设备集合所满足。

    <a name="DeviceConstraint"></a>
    **除了 requests 之外，DeviceConstraint 还必须有且仅有一个字段被设置。**

    <!--
    - **devices.constraints.matchAttribute** (string)

      MatchAttribute requires that all devices in question have this attribute and that its type and value are the same across those devices.
      
      For example, if you specified "dra.example.com/numa" (a hypothetical example!), then only devices in the same NUMA node will be chosen. A device which does not have that attribute will not be chosen. All devices should use a value of the same type for this attribute because that is part of its specification, but if one device doesn't, then it also will not be chosen.
      
      Must include the domain qualifier.
    -->

    - **devices.constraints.matchAttribute** (string)

      matchAttribute 要求所有待考察的设备都具有此属性，并且在这些设备上该属性的类型和值相同。
      
      例如，如果你指定了 "dra.example.com/numa"（假设的例子！），那么只有在同一 NUMA 节点中的设备将被选中。
      没有该属性的设备将不会被选中。所有设备应对此属性使用相同类型的值，因为这是其规约的一部分，
      但如果某个设备不这样做，那么此设备也不会被选中。
      
      必须包括域限定符。

    <!--
    - **devices.constraints.requests** ([]string)

      *Atomic: will be replaced during a merge*
      
      Requests is a list of the one or more requests in this claim which must co-satisfy this constraint. If a request is fulfilled by multiple devices, then all of the devices must satisfy the constraint. If this is not specified, this constraint applies to all requests in this claim.
    -->

    - **devices.constraints.requests** ([]string)

      **原子：将在合并期间被替换**
      
      requests 是此申领中必须共同满足此约束的一个或多个请求的列表。
      如果一个请求由多个设备满足，则所有设备必须符合此约束。
      如果未设置此字段，则此约束适用于此申领中的所有请求。

  <!--
  - **devices.requests** ([]DeviceRequest)

    *Atomic: will be replaced during a merge*
    
    Requests represent individual requests for distinct devices which must all be satisfied. If empty, nothing needs to be allocated.

    <a name="DeviceRequest"></a>
    *DeviceRequest is a request for devices required for a claim. This is typically a request for a single resource like a device, but can also ask for several identical devices.
    
    A DeviceClassName is currently required. Clients must check that it is indeed set. It's absence indicates that something changed in a way that is not supported by the client yet, in which case it must refuse to handle the request.*
  -->

  - **devices.requests** ([]DeviceRequest)

    **原子：将在合并期间被替换**
    
    requests 表示对不同设备的各个请求，这些请求必须同时被满足。如果字段为空，则不需要分配设备。

    <a name="DeviceRequest"></a>
    **DeviceRequest 是对申领所需设备的请求。这通常是对单个资源（如设备）的请求，但也可以请求几个相同的设备。
    deviceClassName 目前是必需的。客户端必须检查它是否已被设置。
    缺少它表示某些更改以客户端尚不支持的方式发生，在这种情况下客户端必须拒绝处理请求。**

    <!--
    - **devices.requests.deviceClassName** (string), required

      DeviceClassName references a specific DeviceClass, which can define additional configuration and selectors to be inherited by this request.
      
      A class is required. Which classes are available depends on the cluster.
      
      Administrators may use this to restrict which devices may get requested by only installing classes with selectors for permitted devices. If users are free to request anything without restrictions, then administrators can create an empty DeviceClass for users to reference.
    -->

    - **devices.requests.deviceClassName** (string)，必需

      deviceClassName 引用特定的 DeviceClass，它可以定义要由此请求所继承的额外配置和选择算符。
      
      类是必需的。哪些类可用取决于集群。
      
      管理员通过仅为允许的设备使用选择算符安装类，就可以使用此字段限制哪些设备可以被请求。
      如果用户可以自由请求任何设备而没有限制，则管理员可以创建一个空的 DeviceClass 供用户引用。

    <!--
    - **devices.requests.name** (string), required

      Name can be used to reference this request in a pod.spec.containers[].resources.claims entry and in a constraint of the claim.
      
      Must be a DNS label.
    -->

    - **devices.requests.name** (string)，必需

      name 可用于在 pod.spec.containers[].resources.claims 条目和申领的约束中引用此请求。
      
      必须是 DNS 标签。

    <!--
    - **devices.requests.adminAccess** (boolean)

      AdminAccess indicates that this is a claim for administrative access to the device(s). Claims with AdminAccess are expected to be used for monitoring or other management services for a device.  They ignore all ordinary claims to the device with respect to access modes and any resource allocations.
    -->

    - **devices.requests.adminAccess** (boolean)

      adminAccess 表示这是对设备的管理访问权限的申领请求。
      使用 adminAccess 的申领请求预期用于设备的监控或其他管理服务。
      就访问模式和资源分配而言，它们会忽略对设备的所有普通申领。

    <!--
    - **devices.requests.allocationMode** (string)

      AllocationMode and its related fields define how devices are allocated to satisfy this request. Supported values are:
      
      - ExactCount: This request is for a specific number of devices.
        This is the default. The exact number is provided in the
        count field.
      
      - All: This request is for all of the matching devices in a pool.
        Allocation will fail if some devices are already allocated,
        unless adminAccess is requested.
    -->

    - **devices.requests.allocationMode** (string)

      allocationMode 及其相关字段定义如何分配设备以满足此请求。支持的值为：
      
      - ExactCount：此请求是针对特定数量的设备。
        这是默认值。确切数量在 count 字段中提供。
      
      - All：此请求是针对池中所有匹配的设备。
        如果某些设备已经被分配，则分配将失败，除非请求了 adminAccess。

      <!--
      If AlloctionMode is not specified, the default mode is ExactCount. If the mode is ExactCount and count is not specified, the default count is one. Any other requests must specify this field.
      
      More modes may get added in the future. Clients must refuse to handle requests with unknown modes.
      -->

      如果 allocationMode 未被指定，则默认模式为 ExactCount。
      如果模式为 ExactCount 而 count 未被指定，则默认值为 1。
      其他任何请求必须指定此字段。
      
      将来可能会添加更多模式。客户端必须拒绝处理未知模式的请求。

    <!--
    - **devices.requests.count** (int64)

      Count is used only when the count mode is "ExactCount". Must be greater than zero. If AllocationMode is ExactCount and this field is not specified, the default is one.
    -->

    - **devices.requests.count** (int64)

      count 仅在计数模式为 "ExactCount" 时使用。必须大于零。
      如果 allocationMode 为 ExactCount 而此字段未被指定，则默认值为 1。

    <!--
    - **devices.requests.selectors** ([]DeviceSelector)

      *Atomic: will be replaced during a merge*
      
      Selectors define criteria which must be satisfied by a specific device in order for that device to be considered for this request. All selectors must be satisfied for a device to be considered.

      <a name="DeviceSelector"></a>
      *DeviceSelector must have exactly one field set.*
    -->

    - **devices.requests.selectors** ([]DeviceSelector)

      **原子：将在合并期间被替换**
      
      selectors 定义特定设备必须满足的条件，满足条件的设备被视为此请求的候选者。
      所有选择算符必须同时被满足才会考虑某个设备。

      <a name="DeviceSelector"></a>
      **DeviceSelector 必须有且仅有一个字段被设置。**

      <!--
      - **devices.requests.selectors.cel** (CELDeviceSelector)

        CEL contains a CEL expression for selecting a device.

        <a name="CELDeviceSelector"></a>
        *CELDeviceSelector contains a CEL expression for selecting a device.*
      -->

      - **devices.requests.selectors.cel** (CELDeviceSelector)

        cel 包含一个用于选择设备的 CEL 表达式。

        <a name="CELDeviceSelector"></a>
        **CELDeviceSelector 包含一个用于选择设备的 CEL 表达式。**

        <!--
        - **devices.requests.selectors.cel.expression** (string), required

          Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
        -->

        - **devices.requests.selectors.cel.expression** (string)，必需

          expression 是一个 CEL 表达式，用于评估单个设备。
          当被考虑的设备满足所需条件时，表达式的求值结果必须为 true；当不满足时，结果应为 false。
          任何其他结果都是错误，会导致设备分配中止。
          
          <!--
          The expression's input is an object named "device", which carries the following properties:
           - driver (string): the name of the driver which defines this device.
           - attributes (map[string]object): the device's attributes, grouped by prefix
             (e.g. device.attributes["dra.example.com"] evaluates to an object with all
             of the attributes which were prefixed by "dra.example.com".
           - capacity (map[string]object): the device's capacities, grouped by prefix.
          -->

          表达式的输入是一个名为 "device" 的对象，具有以下属性：

          - driver (string)：定义此设备的驱动的名称。
          - attributes (map[string]object)：设备的属性，按前缀分组
            （例如，device.attributes["dra.example.com"] 评估为一个对象，包含所有以 "dra.example.com" 为前缀的属性。）
          - capacity (map[string]object)：设备的容量，按前缀分组。
          
          <!--
          Example: Consider a device with driver="dra.example.com", which exposes two attributes named "model" and "ext.example.com/family" and which exposes one capacity named "modules". This input to this expression would have the following fields:
          -->

          示例：考虑一个驱动为 "dra.example.com" 的设备，它暴露两个名为 "model" 和 "ext.example.com/family" 的属性，
          并且暴露一个名为 "modules" 的容量。此表达式的输入将具有以下字段：
          
              device.driver
              device.attributes["dra.example.com"].model
              device.attributes["ext.example.com"].family
              device.capacity["dra.example.com"].modules
          
          <!--
          The device.driver field can be used to check for a specific driver, either as a high-level precondition (i.e. you only want to consider devices from this driver) or as part of a multi-clause expression that is meant to consider devices from different drivers.
          
          The value type of each attribute is defined by the device definition, and users who write these expressions must consult the documentation for their specific drivers. The value type of each capacity is Quantity.
          
          If an unknown prefix is used as a lookup in either device.attributes or device.capacity, an empty map will be returned. Any reference to an unknown field will cause an evaluation error and allocation to abort.
          -->

          device.driver 字段可用于检查特定驱动，既可以作为高层次的前提条件（即你只想考虑来自此驱动的设备），
          也可以作为考虑来自不同驱动的设备的多子句表达式的一部分。
          
          attribute 中每个元素的值类型由设备定义，编写这些表达式的用户必须查阅其特定驱动的文档。
          capacity 中元素的值类型为 Quantity。
          
          如果在 device.attributes 或 device.capacity 中使用未知前缀进行查找，
          将返回一个空映射。对未知字段的任何引用将导致评估错误和分配中止。
          
          <!--
          A robust expression should check for the existence of attributes before referencing them.
          
          For ease of use, the cel.bind() function is enabled, and can be used to simplify expressions that access multiple attributes with the same domain. For example:
          -->

          一个健壮的表达式应在引用属性之前检查其是否存在。
          
          为了方便使用，cel.bind() 函数被启用，此函数可用于简化访问同一域的多个属性的表达式。例如：
          
              cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)

## ResourceClaimStatus {#ResourceClaimStatus}

<!--
ResourceClaimStatus tracks whether the resource has been allocated and what the result of that was.
-->
ResourceClaimStatus 跟踪资源是否已被分配以及产生的结果是什么。

<hr>

<!--
- **allocation** (AllocationResult)

  Allocation is set once the claim has been allocated successfully.

  <a name="AllocationResult"></a>
  *AllocationResult contains attributes of an allocated resource.*
-->
- **allocation** (AllocationResult)

  一旦申领已被成功分配，就会设置 allocation。

  <a name="AllocationResult"></a>
  **AllocationResult 包含已分配资源的属性。**

  <!--
  - **allocation.controller** (string)

    Controller is the name of the DRA driver which handled the allocation. That driver is also responsible for deallocating the claim. It is empty when the claim can be deallocated without involving a driver.
    
    A driver may allocate devices provided by other drivers, so this driver name here can be different from the driver names listed for the results.
    
    This is an alpha field and requires enabling the DRAControlPlaneController feature gate.
  -->

  - **allocation.controller** (string)

    controller 是处理了分配的 DRA 驱动的名称。
    该驱动还负责对此申领的去配操作。当申领可以在不涉及驱动的情况下被去配时，此字段为空。

    驱动可以分配由其他驱动提供的设备，因此此驱动名称可能与结果中列出的驱动名称不同。

    这是一个 Alpha 字段，需要启用 DRAControlPlaneController 特性门控。

  <!--
  - **allocation.devices** (DeviceAllocationResult)

    Devices is the result of allocating devices.

    <a name="DeviceAllocationResult"></a>
    *DeviceAllocationResult is the result of allocating devices.*
  -->

  - **allocation.devices** (DeviceAllocationResult)

    devices 是分配设备的结果。

    <a name="DeviceAllocationResult"></a>
    **DeviceAllocationResult 是分配设备的结果。**

    <!--
    - **allocation.devices.config** ([]DeviceAllocationConfiguration)

      *Atomic: will be replaced during a merge*
      
      This field is a combination of all the claim and class configuration parameters. Drivers can distinguish between those based on a flag.
      
      This includes configuration parameters for drivers which have no allocated devices in the result because it is up to the drivers which configuration parameters they support. They can silently ignore unknown configuration parameters.

      <a name="DeviceAllocationConfiguration"></a>
      *DeviceAllocationConfiguration gets embedded in an AllocationResult.*
    -->

    - **allocation.devices.config** ([]DeviceAllocationConfiguration)

      **原子：将在合并期间被替换**

      此字段是所有申领和类配置参数的组合。驱动可以基于某标志来区分这些参数。

      字段包括在结果中没有分配设备的驱动的配置参数，因为由驱动决定它们支持哪些配置参数。
      它们可以静默忽略未知的配置参数。

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

        source 记录配置是否来自某类（因此不是普通用户能够设置的内容）或者来自某申领。

      - **allocation.devices.config.opaque** (OpaqueDeviceConfiguration)

        opaque 提供特定于驱动的配置参数。

        <a name="OpaqueDeviceConfiguration"></a>
        **OpaqueDeviceConfiguration 包含由以驱动供应商所定义的格式提供驱动的配置参数。**

        <!--
        - **allocation.devices.config.opaque.driver** (string), required

          Driver is used to determine which kubelet plugin needs to be passed these configuration parameters.
          
          An admission policy provided by the driver developer could use this to decide whether it needs to validate them.
          
          Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
        -->

        - **allocation.devices.config.opaque.driver** (string)，必需

          driver 用于确定需要将这些配置参数传递给哪个 kubelet 插件。

          由驱动开发者提供的准入策略可以使用此字段来决定是否需要验证这些配置参数。

          必须是 DNS 子域，并且应以驱动供应商拥有的 DNS 域结尾。

        <!--
        - **allocation.devices.config.opaque.parameters** (RawExtension), required

          Parameters can contain arbitrary data. It is the responsibility of the driver developer to handle validation and versioning. Typically this includes self-identification and a version ("kind" + "apiVersion" for Kubernetes types), with conversion between different versions.

          <a name="RawExtension"></a>
          *RawExtension is used to hold extensions in external versions.
          
          To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
        -->

        - **allocation.devices.config.opaque.parameters** (RawExtension)，必需

          parameters 可以包含任意数据。驱动开发者负责处理校验和版本控制。
          通常，这包括自我标识信息和版本化信息（就 Kubernetes 而言是 "kind" + "apiVersion"），以及不同版本之间的转换。

          <a name="RawExtension"></a>
          **RawExtension 用于以外部版本来保存扩展数据。**
        
          要使用它，请生成一个字段，在外部、版本化结构中以 RawExtension 作为其类型，在内部结构中以 Object 作为其类型。
          你还需要注册你的各个插件类型。
          
          <!--
          // Internal package:
          -->

          // 内部包：

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

          // 在网络上，JSON 将类似于：

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

          那么会发生什么？解码首先使用 JSON 或 YAML 将序列化数据解组到你的外部 MyAPIObject 中。
          这会导致原始 JSON 被存储下来，但不会被解包。下一步是复制（使用 pkg/conversion）到内部结构中。
          runtime 包的 DefaultScheme 安装了转换函数，它将解析存储在 RawExtension 中的 JSON，
          将其转换为正确的对象类型，并将其存储在 Object 中。
          （TODO：如果对象是未知类型，将创建并存储一个 `runtime.Unknown` 对象。）

      <!--
      - **allocation.devices.config.requests** ([]string)

        *Atomic: will be replaced during a merge*
        
        Requests lists the names of requests where the configuration applies. If empty, its applies to all requests.
      -->

      - **allocation.devices.config.requests** ([]string)

        **原子：将在合并期间被替换**

        requests 列出配置适用的请求名称。如果为空，则适用于所有请求。

    <!--
    - **allocation.devices.results** ([]DeviceRequestAllocationResult)

      *Atomic: will be replaced during a merge*
      
      Results lists all allocated devices.

      <a name="DeviceRequestAllocationResult"></a>
      *DeviceRequestAllocationResult contains the allocation result for one request.*
    -->

    - **allocation.devices.results** ([]DeviceRequestAllocationResult)

      **原子：将在合并期间被替换**

      results 列出所有已分配的设备。

      <a name="DeviceRequestAllocationResult"></a>
      **DeviceRequestAllocationResult 包含一个请求的分配结果。**

      <!--
      - **allocation.devices.results.device** (string), required

        Device references one device instance via its name in the driver's resource pool. It must be a DNS label.

      - **allocation.devices.results.driver** (string), required

        Driver specifies the name of the DRA driver whose kubelet plugin should be invoked to process the allocation once the claim is needed on a node.
        
        Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
      -->

      - **allocation.devices.results.device** (string)，必需

        device 通过名称引用驱动资源池中的一个设备实例。字段值必须是一个 DNS 标签。

      - **allocation.devices.results.driver** (string)，必需

        driver 指定 DRA 驱动的名称，此驱动的 kubelet 插件应在节点上需要申领时被调用以处理分配。

        必须是 DNS 子域，并且应以驱动供应商拥有的 DNS 域结尾。

      <!--
      - **allocation.devices.results.pool** (string), required

        This name together with the driver name and the device name field identify which device was allocated (`\<driver name>/\<pool name>/\<device name>`).
        
        Must not be longer than 253 characters and may contain one or more DNS sub-domains separated by slashes.

      - **allocation.devices.results.request** (string), required

        Request is the name of the request in the claim which caused this device to be allocated. Multiple devices may have been allocated per request.
      -->

      - **allocation.devices.results.pool** (string)，必需

        此名称与驱动名称和设备名称字段一起标识哪些设备已被分配（`<驱动名称>/<资源池名称>/<设备名称>`）。

        不得超过 253 个字符，并且可以包含用一个或多个用斜杠分隔的 DNS 子域。

      - **allocation.devices.results.request** (string)，必需

        request 是造成此设备被分配的申领中的请求名称。每个请求可以分配多个设备。

  <!--
  - **allocation.nodeSelector** (NodeSelector)

    NodeSelector defines where the allocated resources are available. If unset, they are available everywhere.

    <a name="NodeSelector"></a>
    *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*
  -->

  - **allocation.nodeSelector** (NodeSelector)

    nodeSelector 定义在哪儿可以使用分配的资源。如果不设置，则分配的资源在任何地方都可用。

    <a name="NodeSelector"></a>
    **节点选择算符表示在一组节点上一个或多个标签查询结果的并集；
    也就是说，它表示由节点选择算符条件表示的选择算符的逻辑或计算结果。**

    <!--
    - **allocation.nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), required

      *Atomic: will be replaced during a merge*
      
      Required. A list of node selector terms. The terms are ORed.

      <a name="NodeSelectorTerm"></a>
      *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
    -->

    - **allocation.nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

      **原子：将在合并期间被替换**

      必需。节点选择算符条件的列表。这些条件以逻辑与进行计算。

      <a name="NodeSelectorTerm"></a>
      **一个 null 或空的节点选择算符条件不会与任何对象匹配。这些要求会按逻辑与的关系来计算。
      TopologySelectorTerm 类别实现了 NodeSelectorTerm 的子集。**

      <!--
      - **allocation.nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's labels.

      - **allocation.nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: will be replaced during a merge*
        
        A list of node selector requirements by node's fields.
      -->

      - **allocation.nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        **原子：将在合并期间被替换**

        基于节点标签所设置的节点选择算符要求的列表。

      - **allocation.nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        **原子：将在合并期间被替换**

        基于节点字段所设置的节点选择算符要求的列表。

<!--
- **deallocationRequested** (boolean)

  Indicates that a claim is to be deallocated. While this is set, no new consumers may be added to ReservedFor.
  
  This is only used if the claim needs to be deallocated by a DRA driver. That driver then must deallocate this claim and reset the field together with clearing the Allocation field.
  
  This is an alpha field and requires enabling the DRAControlPlaneController feature gate.
-->
- **deallocationRequested** (boolean)

  表示某申领需要被去分配。如果设置了此字段，新的使用者不可以被添加到 reservedFor 中。

  只有在申领需要由 DRA 驱动来去配时才会使用此字段。
  该驱动必须为此申领执行去配操作并重置此字段，同时清除 allocation 字段。

  这是一个 Alpha 字段，需要启用 DRAControlPlaneController 特性门控。

<!-- 
- **reservedFor** ([]ResourceClaimConsumerReference)

  *Patch strategy: merge on key `uid`*
  
  *Map: unique values on key uid will be kept during a merge*
  
  ReservedFor indicates which entities are currently allowed to use the claim. A Pod which references a ResourceClaim which is not reserved for that Pod will not be started. A claim that is in use or might be in use because it has been reserved must not get deallocated.
-->
- **reservedFor** ([]ResourceClaimConsumerReference)

  **补丁策略：根据键 `uid` 执行合并操作**

  **映射：在合并期间将根据键 uid 保留唯一值**

  reservedFor 标明目前哪些实体允许使用申领。
  如果 Pod 引用了未为其预留的 ResourceClaim，则该 Pod 将不会启动。
  正在使用或可能正在使用的申领（因为它已被预留）不准被去配。

  <!--
  In a cluster with multiple scheduler instances, two pods might get scheduled concurrently by different schedulers. When they reference the same ResourceClaim which already has reached its maximum number of consumers, only one pod can be scheduled.
  
  Both schedulers try to add their pod to the claim.status.reservedFor field, but only the update that reaches the API server first gets stored. The other one fails with an error and the scheduler which issued it knows that it must put the pod back into the queue, waiting for the ResourceClaim to become usable again.
  
  There can be at most 32 such reservations. This may get increased in the future, but not reduced.

  <a name="ResourceClaimConsumerReference"></a>
  *ResourceClaimConsumerReference contains enough information to let you locate the consumer of a ResourceClaim. The user must be a resource in the same namespace as the ResourceClaim.*
  -->

  在有多个调度器实例的集群中，两个 Pod 可能会被不同的调度器同时调度。
  当它们引用同一个已达到最大使用者数量的 ResourceClaim 时，只能有一个 Pod 被调度。

  两个调度器都尝试将它们的 Pod 添加到 claim.status.reservedFor 字段，
  但只有第一个到达 API 服务器的更新会被存储，另一个会因错误而失败。
  发出此请求的调度器知道它必须将 Pod 重新放回队列，等待 ResourceClaim 再次可用。

  最多可以有 32 个这样的预留。这一限制可能会在未来放宽，但不会减少。

  <a name="ResourceClaimConsumerReference"></a>
  **ResourceClaimConsumerReference 包含足够的信息以便定位 ResourceClaim 的使用者。
  用户必须是与 ResourceClaim 在同一名字空间中的资源。**

  <!--
  - **reservedFor.name** (string), required

    Name is the name of resource being referenced.

  - **reservedFor.resource** (string), required

    Resource is the type of resource being referenced, for example "pods".
  -->

  - **reservedFor.name** (string)，必需

    name 是所引用资源的名称。

  - **reservedFor.resource** (string)，必需

    resource 是所引用资源的类别，例如 "pods"。

  <!--
  - **reservedFor.uid** (string), required

    UID identifies exactly one incarnation of the resource.

  - **reservedFor.apiGroup** (string)

    APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.
  -->

  - **reservedFor.uid** (string)，必需

    uid 用于唯一标识资源的某实例。

  - **reservedFor.apiGroup** (string)

    apiGroup 是所引用资源的组。对于核心 API 而言此值为空字符串。
    字段值与创建资源时所用的 apiVersion 中的组匹配。

## ResourceClaimList {#ResourceClaimList}

<!--
ResourceClaimList is a collection of claims.
-->
ResourceClaimList 是申领的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: ResourceClaimList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>), required

  Items is the list of resource claims.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>)，必需

  items 是资源申领的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified ResourceClaim

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 ResourceClaim

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}

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
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ResourceClaim

#### HTTP Request
-->
### `get` 读取指定 ResourceClaim 的状态

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}/status

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
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaim

#### HTTP Request
-->
### `list` 列出或监视 ResourceClaim 类别的对象

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims

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
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaim

#### HTTP Request
-->
### `list` 列出或监视 ResourceClaim 类别的对象

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/resourceclaims

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
#### 参数

- **allowWatchBookmarks**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

<!--
### `create` create a ResourceClaim

#### HTTP Request
-->
### `create` 创建 ResourceClaim

#### HTTP 请求

POST /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ResourceClaim

#### HTTP Request
-->
### `update` 替换指定的 ResourceClaim

#### HTTP 请求

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ResourceClaim

#### HTTP Request
-->
### `update` 替换指定 ResourceClaim 的状态

#### HTTP 请求

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ResourceClaim

#### HTTP Request
-->
### `patch` 部分更新指定的 ResourceClaim

#### HTTP 请求

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}

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
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ResourceClaim

#### HTTP Request
-->
### `patch` 部分更新指定 ResourceClaim 的状态

#### HTTP 请求

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}/status

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
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `delete` delete a ResourceClaim

#### HTTP Request
-->
### `delete` 删除 ResourceClaim

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims/{name}

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

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha3#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ResourceClaim

#### HTTP Request
-->
### `deletecollection` 删除 ResourceClaim 的集合

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/resourceclaims

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
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
