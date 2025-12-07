---
api_metadata:
  apiVersion: "resource.k8s.io/v1beta2"
  import: "k8s.io/api/resource/v1beta2"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim 描述对集群中供工作负载使用的资源的访问请求。"
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
ResourceClaim 描述对集群中供工作负载使用的资源的访问请求。
例如，如果某个工作负载需要具有特定属性的加速器设备，这就是表达该请求的方式。
状态部分跟踪此申领是否已被满足，以及具体分配了哪些资源。

这是一个 Alpha 级别的资源类型，需要启用 DynamicResourceAllocation 特性门控。

<hr>

- **apiVersion**: resource.k8s.io/v1beta2

- **kind**: ResourceClaim

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。

<!--
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), required

  Spec describes what is being requested and how to configure it. The spec is immutable.

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  Status describes whether the claim is ready to use and what has been allocated.
-->
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimSpec" >}}">ResourceClaimSpec</a>)，必需

  spec 描述正在被请求的资源及其配置方式。spec 是不可变更的。

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  status 描述申领是否就绪以及已分配了哪些。

## ResourceClaimSpec {#ResourceClaimSpec}

<!--
ResourceClaimSpec defines what is being requested in a ResourceClaim and how to configure it.
-->
ResourceClaimSpec 定义在 ResourceClaim 中正在被请求的资源及其配置方式。

<hr>

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

    **原子性：将在合并期间被替换**
    
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

        The length of the raw data must be smaller or equal to 10 Ki.

        <a name="RawExtension"></a>
        *RawExtension is used to hold extensions in external versions.
        
        To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
      -->

      - **devices.config.opaque.parameters** (RawExtension)，必需

        parameters 可以包含任意数据。处理校验和版本控制是驱动开发者的责任。
        通常这包括自我识别和版本化管理（对 Kubernetes 而言即 "kind" + "apiVersion"），并在不同版本之间进行转换。

        原始数据的长度必须小于或等于 10 Ki。

        <a name="RawExtension"></a>
        **RawExtension 用于以外部版本来保存扩展数据。**
        
        要使用它，请生成一个字段，在外部、版本化结构中以 RawExtension 作为其类型，在内部结构中以 Object 作为其类型。
        你还需要注册你的各个插件类型。
        
        <!--
        // Internal package:
        -->

        // 内部包：

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

        // 在网络上，JSON 看起来像这样：

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

        那么会发生什么？解码首先使用 JSON 或 YAML 将序列化数据解组到你的外部 MyAPIObject 中。
        这会导致原始 JSON 被存储下来，但不会被解包。下一步是复制（使用 pkg/conversion）到内部结构中。
        runtime 包的 DefaultScheme 安装了转换函数，它将解析存储在 RawExtension 中的 JSON，
        将其转换为正确的对象类型，并将其存储在 Object 中。
        （TODO：如果对象是未知类型，将创建并存储一个 `runtime.Unknown` 对象。）

    <!--
    - **devices.config.requests** ([]string)

      *Atomic: will be replaced during a merge*
      
      Requests lists the names of requests where the configuration applies. If empty, it applies to all requests.

      References to subrequests must include the name of the main request and may include the subrequest using the format \<main request>[/\<subrequest>]. If just the main request is given, the configuration applies to all subrequests.
    -->

    - **devices.config.requests** ([]string)

      **原子性：将在合并期间被替换**
      
      requests 列举了配置适用的请求的名称。如果为空，则适用于所有请求。

      对子请求的引用必须包含主请求的名称，并可以使用格式 `<主请求>[/<子请求>]` 来包含子请求。
      如果只提供主请求，则此配置适用于所有子请求。


  <!--
  - **devices.constraints** ([]DeviceConstraint)

    *Atomic: will be replaced during a merge*
    
    These constraints must be satisfied by the set of devices that get allocated for the claim.

    <a name="DeviceConstraint"></a>
    *DeviceConstraint must have exactly one field set besides Requests.*
  -->

  - **devices.constraints** ([]DeviceConstraint)

    **原子性：将在合并期间被替换**
    
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

      References to subrequests must include the name of the main request and may include the subrequest using the format \<main request>[/\<subrequest>]. If just the main request is given, the constraint applies to all subrequests.
    -->

    - **devices.constraints.requests** ([]string)

      **原子性：将在合并期间被替换**
      
      requests 是此申领中必须共同满足此约束的一个或多个请求的列表。
      如果一个请求由多个设备满足，则所有设备必须符合此约束。
      如果未设置此字段，则此约束适用于此申领中的所有请求。

      对子请求的引用必须包含主请求的名称，并可以使用格式 `<主请求>[/<子请求>]` 来包含子请求。
      如果只提供主请求，则此约束适用于所有子请求。

  <!--
  - **devices.requests** ([]DeviceRequest)

    *Atomic: will be replaced during a merge*
    
    Requests represent individual requests for distinct devices which must all be satisfied. If empty, nothing needs to be allocated.

    <a name="DeviceRequest"></a>
    *DeviceRequest is a request for devices required for a claim. This is typically a request for a single resource like a device, but can also ask for several identical devices. With FirstAvailable it is also possible to provide a prioritized list of requests.*
  -->

  - **devices.requests** ([]DeviceRequest)

    **原子性：将在合并期间被替换**
    
    requests 表示对不同设备的各个请求，这些请求必须同时被满足。如果字段为空，则不需要分配设备。

    <a name="DeviceRequest"></a>
    **DeviceRequest 是对申领所需设备的请求。这通常是对单个资源（如设备）的请求，但也可以请求几个相同的设备。
    使用 firstAvailable 字段，也可以提供按优先级排序后的请求列表。**

    <!--
    - **devices.requests.name** (string), required

      Name can be used to reference this request in a pod.spec.containers[].resources.claims entry and in a constraint of the claim.
      
      References using the name in the DeviceRequest will uniquely identify a request when the Exactly field is set. When the FirstAvailable field is set, a reference to the name of the DeviceRequest will match whatever subrequest is chosen by the scheduler.
      
      Must be a DNS label.
    -->

    - **devices.requests.name** (string)，必需

      name 可用于在 pod.spec.containers[].resources.claims 条目和申领的约束中引用此请求。
      
      当设置了 exactly 字段时，使用 DeviceRequest 中的名称进行引用将唯一标识某个请求。
      当设置了 firstAvailable 字段时，对 DeviceRequest 名称的引用将匹配调度器所选择的任意子请求。

      必须是 DNS 标签。

    <!--
    - **devices.requests.exactly** (ExactDeviceRequest)

      Exactly specifies the details for a single request that must be met exactly for the request to be satisfied.
      
      One of Exactly or FirstAvailable must be set.

      <a name="ExactDeviceRequest"></a>
      *ExactDeviceRequest is a request for one or more identical devices.*
    -->

    - **devices.requests.exactly** (ExactDeviceRequest)

      exactly 指定必须被完全满足的单一请求的详细信息，只有满足这些条件，请求才会被视为成功。

      exactly 和 firstAvailable 必须至少设置一个。

      <a name="ExactDeviceRequest"></a>
      **ExactDeviceRequest 是对一个或多个相同设备的请求。**

      <!--
      - **devices.requests.exactly.deviceClassName** (string), required

        DeviceClassName references a specific DeviceClass, which can define additional configuration and selectors to be inherited by this request.
        
        A DeviceClassName is required.
        
        Administrators may use this to restrict which devices may get requested by only installing classes with selectors for permitted devices. If users are free to request anything without restrictions, then administrators can create an empty DeviceClass for users to reference.
      -->

      - **devices.requests.exactly.deviceClassName** (string)，必需

        deviceClassName 引用特定的 DeviceClass，它可以定义要由此请求所继承的额外配置和选择算符。
      
        deviceClassName 是必需的。
      
        管理员通过仅为允许的设备使用选择算符安装类，就可以使用此字段限制哪些设备可以被请求。
        如果用户可以自由请求任何设备而没有限制，则管理员可以创建一个空的 DeviceClass 供用户引用。

      <!--
      - **devices.requests.exactly.adminAccess** (boolean)

        AdminAccess indicates that this is a claim for administrative access to the device(s). Claims with AdminAccess are expected to be used for monitoring or other management services for a device.  They ignore all ordinary claims to the device with respect to access modes and any resource allocations.
        
        This is an alpha field and requires enabling the DRAAdminAccess feature gate. Admin access is disabled if this field is unset or set to false, otherwise it is enabled.
      -->

      - **devices.requests.exactly.adminAccess** (boolean)

        adminAccess 表示这是对设备的管理访问权限的申领请求。
        使用 adminAccess 的申领请求预期用于设备的监控或其他管理服务。
        就访问模式和资源分配而言，它们会忽略对设备的所有普通申领。

        这是一个 Alpha 字段，需要启用 DRAAdminAccess 特性门控。
        如果此字段未设置或设置为 false，则管理员访问权限将被禁用；否则将被启用。


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

        allocationMode 及其相关字段定义如何分配设备以满足此请求。支持的值为：
      
        - ExactCount：此请求是针对特定数量的设备。
          这是默认值。确切数量在 count 字段中提供。
      
        - All：此请求是针对池中所有匹配的设备。
          如果某些设备已经被分配，则分配将失败，除非请求了 adminAccess。

        <!--
        If AllocationMode is not specified, the default mode is ExactCount. If the mode is ExactCount and count is not specified, the default count is one. Any other requests must specify this field.
        
        More modes may get added in the future. Clients must refuse to handle requests with unknown modes.
        -->

        如果 allocationMode 未被指定，则默认模式为 ExactCount。
        如果模式为 ExactCount 而 count 未被指定，则默认值为 1。
        其他任何请求必须指定此字段。
      
        将来可能会添加更多模式。客户端必须拒绝处理未知模式的请求。

      <!--
      - **devices.requests.exactly.count** (int64)

        Count is used only when the count mode is "ExactCount". Must be greater than zero. If AllocationMode is ExactCount and this field is not specified, the default is one.
      -->

      - **devices.requests.exactly.count** (int64)

        count 仅在计数模式为 "ExactCount" 时使用。必须大于零。
        如果 allocationMode 为 ExactCount 而此字段未被指定，则默认值为 1。

      <!--
      - **devices.requests.exactly.selectors** ([]DeviceSelector)

        *Atomic: will be replaced during a merge*
        
        Selectors define criteria which must be satisfied by a specific device in order for that device to be considered for this request. All selectors must be satisfied for a device to be considered.

        <a name="DeviceSelector"></a>
        *DeviceSelector must have exactly one field set.*
      -->

      - **devices.requests.exactly.selectors** ([]DeviceSelector)

        **原子性：将在合并期间被替换**
      
        selectors 定义特定设备必须满足的条件，满足条件的设备被视为此请求的候选者。
        所有选择算符必须同时被满足才会考虑某个设备。

        <a name="DeviceSelector"></a>
        **DeviceSelector 必须有且仅有一个字段被设置。**

        <!--
        - **devices.requests.exactly.selectors.cel** (CELDeviceSelector)

          CEL contains a CEL expression for selecting a device.

          <a name="CELDeviceSelector"></a>
          *CELDeviceSelector contains a CEL expression for selecting a device.*
        -->

        - **devices.requests.exactly.selectors.cel** (CELDeviceSelector)

          cel 包含一个用于选择设备的 CEL 表达式。

          <a name="CELDeviceSelector"></a>
          **CELDeviceSelector 包含一个用于选择设备的 CEL 表达式。**

          <!--
          - **devices.requests.exactly.selectors.cel.expression** (string), required

            Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
          -->

          - **devices.requests.exactly.selectors.cel.expression** (string)，必需

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
          
            ```
            cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)
            ```

            <!--
            The length of the expression must be smaller or equal to 10 Ki. The cost of evaluating it is also limited based on the estimated number of logical steps.
            -->

            此表达式的长度必须小于或等于 10 Ki。其求值的计算成本也会根据预估的逻辑步骤数进行限制。

      <!--
      - **devices.requests.exactly.tolerations** ([]DeviceToleration)

        *Atomic: will be replaced during a merge*
        
        If specified, the request's tolerations.
        
        Tolerations for NoSchedule are required to allocate a device which has a taint with that effect. The same applies to NoExecute.
      -->
      
      - **devices.requests.exactly.tolerations** ([]DeviceToleration)

        **原子性：将在合并时被替换**
        
        如果指定，则表示请求的容忍度。
        
        若设备带有 `NoSchedule` 效果的污点，则需要指定相应的容忍度。这同样适用于 `NoExecute`。

        <!--
        In addition, should any of the allocated devices get tainted with NoExecute after allocation and that effect is not tolerated, then all pods consuming the ResourceClaim get deleted to evict them. The scheduler will not let new pods reserve the claim while it has these tainted devices. Once all pods are evicted, the claim will get deallocated.
        
        The maximum number of tolerations is 16.
        -->

        此外，如果任意已分配的设备在分配后被标记了 `NoExecute` 污点，且此污点的效果不被容忍，
        则所有使用 ResourceClaim 的 Pod 都将被删除以驱逐。
        对于已添加污点的设备，调度器不会允许新的 Pod 预留申领。
        一旦所有 Pod 都被驱逐，申领将被取消分配。

        最多支持 16 个容忍度。
        
        <!--
        This is an alpha field and requires enabling the DRADeviceTaints feature gate.

        <a name="DeviceToleration"></a>
        *The ResourceClaim this DeviceToleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*
        -->

        这是一个 Alpha 字段，需要启用 DRADeviceTaints 特性门控。

        <a name="DeviceToleration"></a>
        **此 DeviceToleration 所挂接到的 ResourceClaim 可容忍与
        `<key,value,effect>` 三元组匹配的任何污点，匹配方式由操作符 `<operator>` 指定。**

        <!--
        - **devices.requests.exactly.tolerations.effect** (string)

          Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule and NoExecute.

        - **devices.requests.exactly.tolerations.key** (string)

          Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. Must be a label name.
        -->

        - **devices.requests.exactly.tolerations.effect** (string)

          effect 表示要匹配的污点效果。空意味着匹配所有污点效果。
          指定此字段时，允许值是 `NoSchedule` 和 `NoExecute`。

        - **devices.requests.exactly.tolerations.key** (string)

          key 是容忍适用的污点键。空意味着匹配所有污点键。
          如果 key 为空，则 operator 必须是 `Exists`。
          这个组合意味着匹配所有取值和所有键。必须是标签名称。

        <!--
        - **devices.requests.exactly.tolerations.operator** (string)

          Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a ResourceClaim can tolerate all taints of a particular category.
        -->

        - **devices.requests.exactly.tolerations.operator** (string)

          operator 表示键值之间的关系。有效值为 `Exists` 和 `Equal`，默认为 `Equal`。
          `Exists` 相当于对取值使用通配符，因此 ResourceClaim 可以容忍特定类别的所有污点。

        <!--
        - **devices.requests.exactly.tolerations.tolerationSeconds** (int64)

          TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. If larger than zero, the time when the pod needs to be evicted is calculated as \<time when taint was adedd> + \<toleration seconds>.
        -->

        - **devices.requests.exactly.tolerations.tolerationSeconds** (int64)

          tolerationSeconds 表示容忍污点（必须是 `NoExecute` 效果，否则此字段将被忽略）的时长。
          默认不设置，这意味着永久容忍污点（不驱逐）。值为 0 或负数时，将被系统视为 0，即立刻驱逐。
          如果值大于 0，则计算需要驱逐 Pod 的时间公式为：`<添加污点的时间> + <容忍秒数>`。

        <!--
        - **devices.requests.exactly.tolerations.value** (string)

          Value is the taint value the toleration matches to. If the operator is Exists, the value must be empty, otherwise just a regular string. Must be a label value.
        -->

        - **devices.requests.exactly.tolerations.value** (string)

          value 是容忍度所匹配到的污点值。若 operator 为 `Exists`，此值必须为空；
          否则为普通字符串。必须是标签值。

    <!--
    - **devices.requests.firstAvailable** ([]DeviceSubRequest)

      *Atomic: will be replaced during a merge*
      
      FirstAvailable contains subrequests, of which exactly one will be selected by the scheduler. It tries to satisfy them in the order in which they are listed here. So if there are two entries in the list, the scheduler will only check the second one if it determines that the first one can not be used.
    -->

    - **devices.requests.firstAvailable** ([]DeviceSubRequest)

      **原子性：将在合并时被替换**
      
      firstAvailable 包含多个子请求，调度器将从中选择一个子请求。
      调度器会按照子请求在列表中的顺序依次尝试满足它们。
      因此，如果列表中有两条子请求，调度器只有在确认第一个请求不可用时才会尝试第二个。

      <!--
      DRA does not yet implement scoring, so the scheduler will select the first set of devices that satisfies all the requests in the claim. And if the requirements can be satisfied on more than one node, other scheduling features will determine which node is chosen. This means that the set of devices allocated to a claim might not be the optimal set available to the cluster. Scoring will be implemented later.
      -->

      DRA 尚未实现打分逻辑，因此调度器将选择满足申领中所有请求的第一组设备。
      如果在多个节点上都能满足这些要求，则最终选择哪个节点由其他调度特性决定。
      这意味着最终分配到申领的设备集合可能不是集群中可用的最优选择。打分逻辑将在未来实现。

      <!--
      <a name="DeviceSubRequest"></a>
      *DeviceSubRequest describes a request for device provided in the claim.spec.devices.requests[].firstAvailable array. Each is typically a request for a single resource like a device, but can also ask for several identical devices.
      
      DeviceSubRequest is similar to ExactDeviceRequest, but doesn't expose the AdminAccess field as that one is only supported when requesting a specific device.*
      -->

      <a name="DeviceSubRequest"></a>
      *DeviceSubRequest 描述在 `claim.spec.devices.requests[].firstAvailable` 数组中提供的某个设备请求。
      每个请求通常表示对某个设备等单个资源的请求，但也可以请求多个相同的设备。
      DeviceSubRequest 类似于 ExactDeviceRequest，但不暴露 adminAccess 字段（此字段仅适用于请求特定设备时）。*

      <!--
      - **devices.requests.firstAvailable.deviceClassName** (string), required

        DeviceClassName references a specific DeviceClass, which can define additional configuration and selectors to be inherited by this subrequest.
        
        A class is required. Which classes are available depends on the cluster.
        
        Administrators may use this to restrict which devices may get requested by only installing classes with selectors for permitted devices. If users are free to request anything without restrictions, then administrators can create an empty DeviceClass for users to reference.
      -->

      - **devices.requests.firstAvailable.deviceClassName**（string，必需）

        deviceClassName 引用特定的 DeviceClass，它可以定义要由此请求所继承的额外配置和选择算符。
      
        类是必需的。具体哪些类可用取决于集群。
      
        管理员通过仅为允许的设备使用选择算符安装类，就可以使用此字段限制哪些设备可以被请求。
        如果用户可以自由请求任何设备而没有限制，则管理员可以创建一个空的 DeviceClass 供用户引用。

      <!--
      - **devices.requests.firstAvailable.name** (string), required

        Name can be used to reference this subrequest in the list of constraints or the list of configurations for the claim. References must use the format \<main request>/\<subrequest>.
        
        Must be a DNS label.
      -->

      - **devices.requests.firstAvailable.name** (string), required

        name 可用于在申领的约束列表或配置列表中引用此子请求。引用格式必须为 `<主请求>/<子请求>`。
        
        必须是 DNS 标签。

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

        allocationMode 及其相关字段定义如何分配设备以满足此请求。支持的值为：
      
        - ExactCount：此请求是针对特定数量的设备。
          这是默认值。确切数量在 count 字段中提供。
      
        - All：此请求是针对池中所有匹配的设备。
          如果某些设备已经被分配，则分配将失败，除非请求了 adminAccess。

        <!--
        If AllocationMode is not specified, the default mode is ExactCount. If the mode is ExactCount and count is not specified, the default count is one. Any other subrequests must specify this field.
        
        More modes may get added in the future. Clients must refuse to handle requests with unknown modes.
        -->

        如果 allocationMode 未被指定，则默认模式为 ExactCount。
        如果模式为 ExactCount 而 count 未被指定，则默认值为 1。
        其他任何请求必须指定此字段。
      
        将来可能会添加更多模式。客户端必须拒绝处理未知模式的请求。

      <!--
      - **devices.requests.firstAvailable.count** (int64)

        Count is used only when the count mode is "ExactCount". Must be greater than zero. If AllocationMode is ExactCount and this field is not specified, the default is one.
      -->

      - **devices.requests.firstAvailable.count** (int64)

        count 仅在计数模式为 "ExactCount" 时使用。必须大于零。
        如果 allocationMode 为 ExactCount 而此字段未被指定，则默认值为 1。

      <!--
      - **devices.requests.firstAvailable.selectors** ([]DeviceSelector)

        *Atomic: will be replaced during a merge*
        
        Selectors define criteria which must be satisfied by a specific device in order for that device to be considered for this subrequest. All selectors must be satisfied for a device to be considered.

        <a name="DeviceSelector"></a>
        *DeviceSelector must have exactly one field set.*
      -->

      - **devices.requests.firstAvailable.selectors** ([]DeviceSelector)

        **原子性：将在合并期间被替换**
      
        selectors 定义特定设备必须满足的条件，满足条件的设备被视为此请求的候选者。
        所有选择算符必须同时被满足才会考虑某个设备。

        <a name="DeviceSelector"></a>
        **DeviceSelector 必须有且仅有一个字段被设置。**

        <!--
        - **devices.requests.firstAvailable.selectors.cel** (CELDeviceSelector)

          CEL contains a CEL expression for selecting a device.

          <a name="CELDeviceSelector"></a>
          *CELDeviceSelector contains a CEL expression for selecting a device.*
        -->

        - **devices.requests.firstAvailable.selectors.cel** (CELDeviceSelector)

          cel 包含一个用于选择设备的 CEL 表达式。

          <a name="CELDeviceSelector"></a>
          **CELDeviceSelector 包含一个用于选择设备的 CEL 表达式。**

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

            expression 是一个 CEL 表达式，用于评估单个设备。
            当被考虑的设备满足所需条件时，表达式的求值结果必须为 true；当不满足时，结果应为 false。
            任何其他结果都是错误，会导致设备分配中止。

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

            device.driver 字段可用于检查特定驱动，既可以作为高层次的前提条件（即你只想考虑来自此驱动的设备），
            也可以作为考虑来自不同驱动的设备的多子句表达式的一部分。
          
            attribute 中每个元素的值类型由设备定义，编写这些表达式的用户必须查阅其特定驱动的文档。
            capacity 中元素的值类型为 Quantity。
            
            <!--
            If an unknown prefix is used as a lookup in either device.attributes or device.capacity, an empty map will be returned. Any reference to an unknown field will cause an evaluation error and allocation to abort.
            
            A robust expression should check for the existence of attributes before referencing them.
            
            For ease of use, the cel.bind() function is enabled, and can be used to simplify expressions that access multiple attributes with the same domain. For example:
            -->

            如果在 device.attributes 或 device.capacity 中使用未知前缀进行查找，
            将返回一个空映射。对未知字段的任何引用将导致评估错误和分配中止。

            一个健壮的表达式应在引用属性之前检查其是否存在。
          
            为了方便使用，cel.bind() 函数被启用，此函数可用于简化访问同一域的多个属性的表达式。例如：
          
            ```
            cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)
            ```
            
            <!--
            The length of the expression must be smaller or equal to 10 Ki. The cost of evaluating it is also limited based on the estimated number of logical steps.
            -->

            此表达式的长度必须小于或等于 10 Ki。其求值的计算成本也会根据预估的逻辑步骤数进行限制。

      <!--
      - **devices.requests.firstAvailable.tolerations** ([]DeviceToleration)

        *Atomic: will be replaced during a merge*
        
        If specified, the request's tolerations.
        
        Tolerations for NoSchedule are required to allocate a device which has a taint with that effect. The same applies to NoExecute.
      -->

      - **devices.requests.exactly.tolerations** ([]DeviceToleration)

        **原子性：将在合并时被替换**
        
        如果指定，则表示请求的容忍度。
        
        若设备带有 `NoSchedule` 效果的污点，则需要指定相应的容忍度。这同样适用于 `NoExecute`。

        <!--
        In addition, should any of the allocated devices get tainted with NoExecute after allocation and that effect is not tolerated, then all pods consuming the ResourceClaim get deleted to evict them. The scheduler will not let new pods reserve the claim while it has these tainted devices. Once all pods are evicted, the claim will get deallocated.
        
        The maximum number of tolerations is 16.
        -->

        此外，如果任意已分配的设备在分配后被标记了 `NoExecute` 污点，且此污点的效果不被容忍，
        则所有使用 ResourceClaim 的 Pod 都将被删除以驱逐。
        对于已添加污点的设备，调度器不会允许新的 Pod 预留申领。
        一旦所有 Pod 都被驱逐，申领将被取消分配。

        最多支持 16 个容忍度。
        
        <!--
        This is an alpha field and requires enabling the DRADeviceTaints feature gate.

        <a name="DeviceToleration"></a>
        *The ResourceClaim this DeviceToleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*
        -->

        这是一个 Alpha 字段，需要启用 DRADeviceTaints 特性门控。

        <a name="DeviceToleration"></a>
        **此 DeviceToleration 所挂接到的 ResourceClaim 可容忍与
        `<key,value,effect>` 三元组匹配的任何污点，匹配方式由操作符 `<operator>` 指定。**

        <!--
        - **devices.requests.firstAvailable.tolerations.effect** (string)

          Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule and NoExecute.

        - **devices.requests.firstAvailable.tolerations.key** (string)

          Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. Must be a label name.
        -->

        - **devices.requests.firstAvailable.tolerations.effect** (string)

          effect 表示要匹配的污点效果。空意味着匹配所有污点效果。
          指定此字段时，允许值是 `NoSchedule` 和 `NoExecute`。

        - **devices.requests.firstAvailable.tolerations.key** (string)

          key 是容忍适用的污点键。空意味着匹配所有污点键。
          如果 key 为空，则 operator 必须是 `Exists`。
          这个组合意味着匹配所有取值和所有键。必须是标签名称。

        <!--
        - **devices.requests.firstAvailable.tolerations.operator** (string)

          Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a ResourceClaim can tolerate all taints of a particular category.
        -->

        - **devices.requests.firstAvailable.tolerations.operator** (string)

          operator 表示键值之间的关系。有效值为 `Exists` 和 `Equal`，默认为 `Equal`。
          `Exists` 相当于对取值使用通配符，因此 ResourceClaim 可以容忍特定类别的所有污点。

        <!--
        - **devices.requests.firstAvailable.tolerations.tolerationSeconds** (int64)

          TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. If larger than zero, the time when the pod needs to be evicted is calculated as \<time when taint was adedd> + \<toleration seconds>.
        -->

        - **devices.requests.firstAvailable.tolerations.tolerationSeconds** (int64)

          tolerationSeconds 表示容忍污点（必须是 `NoExecute` 效果，否则此字段将被忽略）的时长。
          默认不设置，这意味着永久容忍污点（不驱逐）。值为 0 或负数时，将被系统视为 0，即立刻驱逐。
          如果值大于 0，则计算需要驱逐 Pod 的时间公式为：`<添加污点的时间> + <容忍秒数>`。

        <!--
        - **devices.requests.firstAvailable.tolerations.value** (string)

          Value is the taint value the toleration matches to. If the operator is Exists, the value must be empty, otherwise just a regular string. Must be a label value.
        -->

        - **devices.requests.firstAvailable.tolerations.value** (string)

          value 是容忍度所匹配到的污点值。若操作符为 `Exists`，此 value 必须为空；
          否则为普通字符串。必须是标签值。

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

      **原子性：将在合并期间被替换**

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
          
          The length of the raw data must be smaller or equal to 10 Ki.

          <a name="RawExtension"></a>
          *RawExtension is used to hold extensions in external versions.
          
          To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
        -->

        - **allocation.devices.config.opaque.parameters** (RawExtension)，必需

          parameters 可以包含任意数据。驱动开发者负责处理校验和版本控制。
          通常，这包括自我标识信息和版本化信息（就 Kubernetes 而言是 "kind" + "apiVersion"），以及不同版本之间的转换。

          原始数据的长度必须小于或等于 10 Ki。
          
          <a name="RawExtension"></a>
          **RawExtension 用于以外部版本来保存扩展数据。**
        
          要使用它，请生成一个字段，在外部、版本化结构中以 RawExtension 作为其类型，在内部结构中以 Object 作为其类型。
          你还需要注册你的各个插件类型。
          
          <!--
          // Internal package:
          -->

          // 内部包：

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

          // 在网络上，JSON 将类似于：

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

          那么会发生什么？解码首先使用 JSON 或 YAML 将序列化数据解组到你的外部 MyAPIObject 中。
          这会导致原始 JSON 被存储下来，但不会被解包。下一步是复制（使用 pkg/conversion）到内部结构中。
          runtime 包的 DefaultScheme 安装了转换函数，它将解析存储在 RawExtension 中的 JSON，
          将其转换为正确的对象类型，并将其存储在 Object 中。
          （TODO：如果对象是未知类型，将创建并存储一个 `runtime.Unknown` 对象。）

      <!--
      - **allocation.devices.config.requests** ([]string)

        *Atomic: will be replaced during a merge*
        
        Requests lists the names of requests where the configuration applies. If empty, its applies to all requests.

        References to subrequests must include the name of the main request and may include the subrequest using the format \<main request>[/\<subrequest>]. If just the main request is given, the configuration applies to all subrequests.
      -->

      - **allocation.devices.config.requests** ([]string)

        **原子性：将在合并期间被替换**

        requests 列举配置适用的请求名称。如果为空，则适用于所有请求。

        对子请求的引用必须包含主请求的名称，并可以使用格式 `<主请求>[/<子请求>]` 来包含子请求。
        如果只提供主请求，则此配置适用于所有子请求。

    <!--
    - **allocation.devices.results** ([]DeviceRequestAllocationResult)

      *Atomic: will be replaced during a merge*
      
      Results lists all allocated devices.

      <a name="DeviceRequestAllocationResult"></a>
      *DeviceRequestAllocationResult contains the allocation result for one request.*
    -->

    - **allocation.devices.results** ([]DeviceRequestAllocationResult)

      **原子性：将在合并期间被替换**

      results 列举所有已分配的设备。

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

        Request is the name of the request in the claim which caused this device to be allocated. If it references a subrequest in the firstAvailable list on a DeviceRequest, this field must include both the name of the main request and the subrequest using the format \<main request>/\<subrequest>.
        
        Multiple devices may have been allocated per request.
      -->

      - **allocation.devices.results.pool** (string)，必需

        此名称与驱动名称和设备名称字段一起标识哪些设备已被分配（`<驱动名称>/<资源池名称>/<设备名称>`）。

        不得超过 253 个字符，并且可以包含用一个或多个用斜杠分隔的 DNS 子域。

      - **allocation.devices.results.request** (string)，必需

        request 是造成此设备被分配的申领中的请求名称。
        如果它引用 DeviceRequest 上的 firstAvailable 列表中的某个子请求，
        则此字段必须同时包含主请求和子请求的名称，格式为：`<主请求>/<子请求>`。

        每个请求可以分配多个设备。

      <!--
      - **allocation.devices.results.adminAccess** (boolean)

        AdminAccess indicates that this device was allocated for administrative access. See the corresponding request field for a definition of mode.
        
        This is an alpha field and requires enabling the DRAAdminAccess feature gate. Admin access is disabled if this field is unset or set to false, otherwise it is enabled.
      -->

      - **allocation.devices.results.adminAccess** (boolean)

        adminAccess 表示设备被分配了管理员访问权限。
        有关模式的定义，参见对应的请求字段。

        这是一个 Alpha 字段，需要启用 `DRAAdminAccess` 特性门控。
        如果此字段不设置或设置为 false，则管理员访问权限被禁用；否则将启用管理员访问权限。

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

        **原子性：将在合并期间被替换**
        
        在设备被分配时，在请求中指定的所有容忍度的副本。

        容忍度的最大数量为 16 个。

        这是一个 Alpha 字段，需要启用 DRADeviceTaints 特性门控。

        <a name="DeviceToleration"></a>
        **此 DeviceToleration 所挂接到的 ResourceClaim 可容忍与
        `<key,value,effect>` 三元组匹配的任何污点，匹配方式由操作符 `<operator>` 指定。**

        <!--
        - **allocation.devices.results.tolerations.effect** (string)

          Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule and NoExecute.

        - **allocation.devices.results.tolerations.key** (string)

          Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. Must be a label name.
        -->

        - **allocation.devices.results.tolerations.effect** (string)

          effect 表示要匹配的污点效果。空意味着匹配所有污点效果。
          指定此字段时，允许值是 `NoSchedule` 和 `NoExecute`。

        - **allocation.devices.results.tolerations.key** (string)

          key 是容忍适用的污点键。空意味着匹配所有污点键。
          如果 key 为空，则 operator 必须是 `Exists`。
          这个组合意味着匹配所有取值和所有键。必须是标签名称。

        <!--
        - **allocation.devices.results.tolerations.operator** (string)

          Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a ResourceClaim can tolerate all taints of a particular category.
        -->

        - **allocation.devices.results.tolerations.operator** (string)

          operator 表示键值之间的关系。有效值为 `Exists` 和 `Equal`，默认为 `Equal`。
          `Exists` 相当于对取值使用通配符，因此 ResourceClaim 可以容忍特定类别的所有污点。

        <!--
        - **allocation.devices.results.tolerations.tolerationSeconds** (int64)

          TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. If larger than zero, the time when the pod needs to be evicted is calculated as \<time when taint was adedd> + \<toleration seconds>.
        -->

        - **allocation.devices.results.tolerations.tolerationSeconds** (int64)

          tolerationSeconds 表示容忍污点（必须是 `NoExecute` 效果，否则此字段将被忽略）的时长。
          默认不设置，这意味着永久容忍污点（不驱逐）。值为 0 或负数时，将被系统视为 0，即立刻驱逐。
          如果值大于 0，则计算需要驱逐 Pod 的时间公式为：`<添加污点的时间> + <容忍秒数>`。

        <!--
        - **allocation.devices.results.tolerations.value** (string)

          Value is the taint value the toleration matches to. If the operator is Exists, the value must be empty, otherwise just a regular string. Must be a label value.
        -->

        - **allocation.devices.results.tolerations.value** (string)

          value 是容忍度所匹配到的污点值。若 operator 为 `Exists`，此值必须为空；
          否则为普通字符串。必须是标签值。

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

      **原子性：将在合并期间被替换**

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

        **原子性：将在合并期间被替换**

        基于节点标签所设置的节点选择算符要求的列表。

      - **allocation.nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        **原子性：将在合并期间被替换**

        基于节点字段所设置的节点选择算符要求的列表。

<!--
- **devices** ([]AllocatedDeviceStatus)

  *Map: unique values on keys `driver, device, pool` will be kept during a merge*
  
  Devices contains the status of each device allocated for this claim, as reported by the driver. This can include driver-specific information. Entries are owned by their respective drivers.

  <a name="AllocatedDeviceStatus"></a>
  *AllocatedDeviceStatus contains the status of an allocated device, if the driver chooses to report it. This may include driver-specific information.*
-->
- **devices**（[]AllocatedDeviceStatus）

  **映射：`driver`、`device` 和 `pool` 这些键的唯一取值将在合并期间被保留**

  devices 包含为了此申领分配的每个设备的状态，由驱动上报。
  这可以包含特定于驱动的信息。这些条目的所有权归对应的驱动所有。

  <a name="AllocatedDeviceStatus"></a>
  **AllocatedDeviceStatus 包含已分配设备的状态（如果驱动选择上报）。这可能包含特定于驱动的信息。**

  <!--
  - **devices.device** (string), required

    Device references one device instance via its name in the driver's resource pool. It must be a DNS label.

  - **devices.driver** (string), required

    Driver specifies the name of the DRA driver whose kubelet plugin should be invoked to process the allocation once the claim is needed on a node.
    
    Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
  -->

  - **allocation.devices.results.device** (string)，必需

    device 通过名称引用驱动资源池中的一个设备实例。字段值必须是一个 DNS 标签。

  - **allocation.devices.results.driver** (string)，必需

    driver 指定 DRA 驱动的名称，此驱动的 kubelet 插件应在节点上需要申领时被调用以处理分配。

    必须是 DNS 子域，并且应以驱动供应商拥有的 DNS 域结尾。

  <!--
  - **devices.pool** (string), required

    This name together with the driver name and the device name field identify which device was allocated (`\<driver name>/\<pool name>/\<device name>`).
    
    Must not be longer than 253 characters and may contain one or more DNS sub-domains separated by slashes.
  -->

  - **devices.pool** (string)，必需

    此名称与驱动名称和设备名称字段一起标识哪些设备已被分配（`<驱动名称>/<资源池名称>/<设备名称>`）。

    不得超过 253 个字符，并且可以包含一个或多个用斜杠分隔的 DNS 子域。

  <!--
  - **devices.conditions** ([]Condition)

    *Map: unique values on key type will be kept during a merge*
    
    Conditions contains the latest observation of the device's state. If the device has been configured according to the class and claim config references, the `Ready` condition should be True.
    
    Must not contain more than 8 entries.
  -->

  - **devices.conditions** ([]Condition)

    **映射：合并时将保留 type 键的唯一值**

    conditions 包含对设备状态的最新观测结果。
    如果设备已经根据类和申领配置饮用完成配置，则 `Ready` 状况应为 True。

    条目数量不得超过 8 个。

    <!--
    <a name="Condition"></a>
    *Condition contains details for one aspect of the current state of this API Resource.*

    - **devices.conditions.lastTransitionTime** (Time), required

      lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

      <a name="Time"></a>
      *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    <a name="Condition"></a>
    **Condition 包含此 API 资源某一方面当前状态的详细信息。**

    - **devices.conditions.lastTransitionTime** (Time)，必需

      lastTransitionTime 是状况最近一次状态转化的时间。
      变化应该发生在下层状况发生变化的时候。如果不知道下层状况发生变化的时间，
      那么使用 API 字段更改的时间是可以接受的。

      <a name="Time"></a>
      **Time 是 time.Time 的包装类，支持正确地序列化为 YAML 和 JSON。
      为 time 包提供的许多工厂方法提供了包装类。**

    <!--
    - **devices.conditions.message** (string), required

      message is a human readable message indicating details about the transition. This may be an empty string.

    - **devices.conditions.reason** (string), required

      reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.
    -->

    - **devices.conditions.message** (string)，必需

      message 是人类可读的消息，有关转换的详细信息，可以是空字符串。

    - **devices.conditions.reason** (string)，必需

      reason 包含一个程序标识符，指示 condition 最后一次转换的原因。
      特定状况类型的生产者可以定义该字段的预期值和含义，以及这些值是否被视为有保证的 API。
      此值应该是 CamelCase 字符串且不能为空。

    <!--
    - **devices.conditions.status** (string), required

      status of the condition, one of True, False, Unknown.

    - **devices.conditions.type** (string), required

      type of condition in CamelCase or in foo.example.com/CamelCase.
    -->

    - **devices.conditions.status** (string)，必需

      状况的状态，True、False、Unknown 之一。

    - **devices.conditions.type** (string)，必需

      CamelCase 或 foo.example.com/CamelCase 中的条件类型。

    <!--
    - **devices.conditions.observedGeneration** (int64)

      observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.
    -->

    - **devices.conditions.observedGeneration** (int64)

      observedGeneration 表示设置 condition 基于的 .metadata.generation 的过期次数。
      例如，如果 .metadata.generation 当前为 12，但 .status.conditions[x].observedGeneration 为 9，
      则 condition 相对于实例的当前状态已过期。

  <!--
  - **devices.data** (RawExtension)

    Data contains arbitrary driver-specific data.
    
    The length of the raw data must be smaller or equal to 10 Ki.

    <a name="RawExtension"></a>
    *RawExtension is used to hold extensions in external versions.
    
    To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
  -->

  - **devices.data** (RawExtension)

    data 包含任意特定于驱动的数据。
    
    原始数据的长度必须小于或等于 10 Ki。

    <a name="RawExtension"></a>
    **RawExtension 用于以外部版本来保存扩展数据。**
    
    要使用它，请在外部、版本化的结构中生成一个字段，以 RawExtension 作为其类型，在内部结构中以 Object 作为其类型。
    你还需要注册你的各个插件类型。

    <!--
    // Internal package:
    -->

    // 内部包：
    
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

    // 在网络上，JSON 看起来像这样：
    
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

    那么会发生什么？解码首先使用 JSON 或 YAML 将序列化数据解组到你的外部 MyAPIObject 中。
    这会导致原始 JSON 被存储下来，但不会被解包。下一步是复制（使用 pkg/conversion）到内部结构中。
    runtime 包的 DefaultScheme 安装了转换函数，它将解析存储在 RawExtension 中的 JSON，
    将其转换为正确的对象类型，并将其存储在 Object 中。
   （TODO：如果对象是未知类型，将创建并存储一个 `runtime.Unknown` 对象。）

  <!--
  - **devices.networkData** (NetworkDeviceData)

    NetworkData contains network-related information specific to the device.

    <a name="NetworkDeviceData"></a>
    *NetworkDeviceData provides network-related details for the allocated device. This information may be filled by drivers or other components to configure or identify the device within a network context.*
  -->

  - **devices.networkData**（NetworkDeviceData）

    networkData 包含特定于设备的网络相关信息。

    <a name="NetworkDeviceData"></a>
    **NetworkDeviceData 提供已分配设备的网络相关细节。
    此信息可以由驱动或其他组件填充，用于在网络上下文中配置或标识设备。**

    <!--
    - **devices.networkData.hardwareAddress** (string)

      HardwareAddress represents the hardware address (e.g. MAC Address) of the device's network interface.
      
      Must not be longer than 128 characters.
    -->

    - **devices.networkData.hardwareAddress** (string)

      hardwareAddress 表示设备网络接口的硬件地址（例如 MAC 地址）。

      长度不得超过 128 个字符。

    <!--
    - **devices.networkData.interfaceName** (string)

      InterfaceName specifies the name of the network interface associated with the allocated device. This might be the name of a physical or virtual network interface being configured in the pod.
      
      Must not be longer than 256 characters.
    -->

    - **devices.networkData.interfaceName** (string)

      interfaceName 指定与已分配设备关联的网络接口的名称。
      这可能是正分配在 Pod 中的物理或虚拟网络接口的名称。
      
      长度不得超过 256 个字符。

    <!--
    - **devices.networkData.ips** ([]string)

      *Atomic: will be replaced during a merge*
      
      IPs lists the network addresses assigned to the device's network interface. This can include both IPv4 and IPv6 addresses. The IPs are in the CIDR notation, which includes both the address and the associated subnet mask. e.g.: "192.0.2.5/24" for IPv4 and "2001:db8::5/64" for IPv6.
    -->

    - **devices.networkData.ips** ([]string)

      **原子性：将在合并期间被替换**
      
      ips 列举分配给设备网络接口的网络地址。这可以包括 IPv4 和 IPv6 地址。
      IP 使用 CIDR 表示法，包含地址和关联的子网掩码，例如
      "192.0.2.5/24" 是 IPv4 地址，"2001:db8::5/64" 是 IPv6 地址。

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
  -->

  在有多个调度器实例的集群中，两个 Pod 可能会被不同的调度器同时调度。
  当它们引用同一个已达到最大使用者数量的 ResourceClaim 时，只能有一个 Pod 被调度。

  两个调度器都尝试将它们的 Pod 添加到 claim.status.reservedFor 字段，
  但只有第一个到达 API 服务器的更新会被存储，另一个会因错误而失败。
  发出此请求的调度器知道它必须将 Pod 重新放回队列，等待 ResourceClaim 再次可用。

  <!--
  There can be at most 256 such reservations. This may get increased in the future, but not reduced.

  <a name="ResourceClaimConsumerReference"></a>
  *ResourceClaimConsumerReference contains enough information to let you locate the consumer of a ResourceClaim. The user must be a resource in the same namespace as the ResourceClaim.*
  -->

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

- **apiVersion**: resource.k8s.io/v1beta2

- **kind**: ResourceClaimList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>), required

  Items is the list of resource claims.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>)，必需

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
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ResourceClaim

#### HTTP Request
-->
### `get` 读取指定 ResourceClaim 的状态

#### HTTP 请求

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
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaim

#### HTTP Request
-->
### `list` 列举或监视 ResourceClaim 类别的对象

#### HTTP 请求

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

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaim

#### HTTP Request
-->
### `list` 列举或监视 ResourceClaim 类别的对象

#### HTTP 请求

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

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

<!--
### `create` create a ResourceClaim

#### HTTP Request
-->
### `create` 创建 ResourceClaim

#### HTTP 请求

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
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>，必需

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

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ResourceClaim

#### HTTP Request
-->
### `update` 替换指定的 ResourceClaim

#### HTTP 请求

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
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>，必需

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

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ResourceClaim

#### HTTP Request
-->
### `update` 替换指定 ResourceClaim 的状态

#### HTTP 请求

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
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>，必需

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

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ResourceClaim

#### HTTP Request
-->
### `patch` 部分更新指定的 ResourceClaim

#### HTTP 请求

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

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ResourceClaim

#### HTTP Request
-->
### `patch` 部分更新指定 ResourceClaim 的状态

#### HTTP 请求

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

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `delete` delete a ResourceClaim

#### HTTP Request
-->
### `delete` 删除 ResourceClaim

#### HTTP 请求

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

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ResourceClaim

#### HTTP Request
-->
### `deletecollection` 删除 ResourceClaim 的集合

#### HTTP 请求

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

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

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
