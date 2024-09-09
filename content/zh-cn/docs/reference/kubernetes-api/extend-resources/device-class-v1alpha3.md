---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "DeviceClass"
content_type: "api_reference"
description: "DeviceClass 是由供应商或管理员提供的资源，包含设备配置和选择算符。"
title: "DeviceClass v1alpha3"
weight: 2
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "DeviceClass"
content_type: "api_reference"
description: "DeviceClass is a vendor- or admin-provided resource that contains device configuration and selectors."
title: "DeviceClass v1alpha3"
weight: 2
auto_generated: true
-->

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`

## DeviceClass {#DeviceClass}

<!--
DeviceClass is a vendor- or admin-provided resource that contains device configuration and selectors. It can be referenced in the device requests of a claim to apply these presets. Cluster scoped.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.
-->
DeviceClass 是由供应商或管理员提供的资源，包含设备配置和选择算符。
它可以在申领的设备请求中被引用，以应用预设值。作用域为集群范围。

这是一个 Alpha 阶段的资源类别，需要启用 DynamicResourceAllocation 特性门控。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: DeviceClass

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。

<!--
- **spec** (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClassSpec" >}}">DeviceClassSpec</a>), required

  Spec defines what can be allocated and how to configure it.
  
  This is mutable. Consumers have to be prepared for classes changing at any time, either because they get updated or replaced. Claim allocations are done once based on whatever was set in classes at the time of allocation.
  
  Changing the spec automatically increments the metadata.generation number.
-->
- **spec** (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClassSpec" >}}">DeviceClassSpec</a>)，必需

  spec 定义什么可以被分配以及如何进行配置。
  
  此字段是可变更的。消费者必须准备好应对随时会变更的类，变更的原因可能是被更新或被替换。
  申领分配是基于分配之时类中所设置的内容而确定的。
  
  变更 spec 会让 metadata.generation 编号自动递增。

## DeviceClassSpec {#DeviceClassSpec}

<!--
DeviceClassSpec is used in a [DeviceClass] to define what can be allocated and how to configure it.
-->
DeviceClassSpec 在 DeviceClass 中用于定义可以分配的资源及其配置方式。

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

  **原子：将在合并期间被替换**
  
  config 定义通过此类申领的、适用于每台设备的配置参数。
  某些类可能会由多个驱动所满足，因此每个供应商配置的实例仅适用于一个驱动。
  
  这些配置参数被传递给驱动，但在分配申领时不考虑这些配置参数。

  <a name="DeviceClassConfiguration"></a>
  **DeviceClassConfiguration 在 DeviceClass 中使用。**

  <!--
  - **config.opaque** (OpaqueDeviceConfiguration)

    Opaque provides driver-specific configuration parameters.

    <a name="OpaqueDeviceConfiguration"></a>
    *OpaqueDeviceConfiguration contains configuration parameters for a driver in a format defined by the driver vendor.*
  -->

  - **config.opaque** (OpaqueDeviceConfiguration)

    opaque 提供特定于驱动的配置参数。

    <a name="OpaqueDeviceConfiguration"></a>
    **OpaqueDeviceConfiguration 以驱动供应商所定义的格式提供驱动的配置参数。**

    <!--
    - **config.opaque.driver** (string), required

      Driver is used to determine which kubelet plugin needs to be passed these configuration parameters.
      
      An admission policy provided by the driver developer could use this to decide whether it needs to validate them.
      
      Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver.
    -->

    - **config.opaque.driver** (string)，必需

      driver 用于确定需要将这些配置参数传递给哪个 kubelet 插件。
        
      驱动开发者所提供的准入策略可以使用此字段来决定是否需要校验这些参数。
        
      必须是一个 DNS 子域，并且应以驱动供应商拥有的 DNS 域结尾。

    <!--
    - **config.opaque.parameters** (RawExtension), required

      Parameters can contain arbitrary data. It is the responsibility of the driver developer to handle validation and versioning. Typically this includes self-identification and a version ("kind" + "apiVersion" for Kubernetes types), with conversion between different versions.

      <a name="RawExtension"></a>
      *RawExtension is used to hold extensions in external versions.
      
      To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
    -->

    - **config.opaque.parameters** (RawExtension)，必需

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
- **selectors** ([]DeviceSelector)

  *Atomic: will be replaced during a merge*
  
  Each selector must be satisfied by a device which is claimed via this class.

  <a name="DeviceSelector"></a>
  *DeviceSelector must have exactly one field set.*
-->
- **selectors** ([]DeviceSelector)

  **原子：将在合并期间被替换**
  
  每个选择算符必须由通过此类申领的设备所满足。

  <a name="DeviceSelector"></a>
  **DeviceSelector 必须设置一个字段。**

  <!--
  - **selectors.cel** (CELDeviceSelector)

    CEL contains a CEL expression for selecting a device.

    <a name="CELDeviceSelector"></a>
    *CELDeviceSelector contains a CEL expression for selecting a device.*
  -->

  - **selectors.cel** (CELDeviceSelector)

    cel 包含用于选择设备的 CEL 表达式。

    <a name="CELDeviceSelector"></a>
    **CELDeviceSelector 包含用于选择设备的 CEL 表达式。**

    <!--
    - **selectors.cel.expression** (string), required

      Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
    -->

    - **selectors.cel.expression** (string)，必需

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
      
      Example: Consider a device with driver="dra.example.com", which exposes two attributes named "model" and "ext.example.com/family" and which exposes one capacity named "modules". This input to this expression would have the following fields:
      -->

      表达式的输入是一个名为 "device" 的对象，具有以下属性：

      - driver (string)：定义此设备的驱动的名称。
      - attributes (map[string]object)：设备的属性，按前缀分组
        （例如，device.attributes["dra.example.com"] 评估为一个对象，包含所有以 "dra.example.com" 为前缀的属性。）
      - capacity (map[string]object)：设备的容量，按前缀分组。
      
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
- **suitableNodes** (NodeSelector)

  Only nodes matching the selector will be considered by the scheduler when trying to find a Node that fits a Pod when that Pod uses a claim that has not been allocated yet *and* that claim gets allocated through a control plane controller. It is ignored when the claim does not use a control plane controller for allocation.
  
  Setting this field is optional. If unset, all Nodes are candidates.
  
  This is an alpha field and requires enabling the DRAControlPlaneController feature gate.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*
-->
- **suitableNodes** (NodeSelector)

  当 Pod 使用还未分配的申领**且**该申领通过控制平面控制器分配时，如果调度器在尝试查找适合 Pod 的节点，
  将仅考虑与选择算符匹配的节点。当申领不使用控制平面控制器进行分配时，此字段将被忽略。

  设置此字段是可选的，如果不设置，则所有节点都是候选者。
  
  这是一个 Alpha 字段，需要启用 DRAControlPlaneController 特性门控。

  <a name="NodeSelector"></a>
  **节点选择算符表示针对一组节点执行一个或多个标签查询的结果的并集；
  也就是说，它表示由节点选择算符条件表示的选择算符的逻辑或计算结果。**

  <!--
  - **suitableNodes.nodeSelectorTerms** ([]NodeSelectorTerm), required

    *Atomic: will be replaced during a merge*
    
    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
  -->

  - **suitableNodes.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

    **原子：将在合并期间被替换**
    
    必需。节点选择算符条件的列表。这些条件会按逻辑或的关系来计算。

    <a name="NodeSelectorTerm"></a>
    **Null 或空的节点选择算符条件不会与任何对象匹配。这些条件会按逻辑与的关系来计算。
    TopologySelectorTerm 类别实现了 NodeSelectorTerm 的子集。**

    <!--
    - **suitableNodes.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's labels.

    - **suitableNodes.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's fields.
    -->

    - **suitableNodes.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      **原子：将在合并期间被替换**
      
      基于节点标签所设置的节点选择算符要求的列表。

    - **suitableNodes.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      **原子：将在合并期间被替换**
      
      基于节点字段所设置的节点选择算符要求的列表。

## DeviceClassList {#DeviceClassList}

<!--
DeviceClassList is a collection of classes.
-->
DeviceClassList 是类的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: DeviceClassList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>), required

  Items is the list of resource classes.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。

- **items** ([]<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>)，必需

  items 是资源类的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified DeviceClass

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 DeviceClass

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the DeviceClass

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  DeviceClass 的名称。

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind DeviceClass

#### HTTP Request

GET /apis/resource.k8s.io/v1alpha3/deviceclasses

#### Parameters
-->
### `list` 列举或监视 DeviceClass 类别的对象

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/deviceclasses

#### 参数

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
- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClassList" >}}">DeviceClassList</a>): OK

401: Unauthorized

<!--
### `create` create a DeviceClass

#### HTTP Request

POST /apis/resource.k8s.io/v1alpha3/deviceclasses

#### Parameters
-->
### `create` 创建 DeviceClass

#### HTTP 请求

POST /apis/resource.k8s.io/v1alpha3/deviceclasses

#### 参数

<!--
- **body**: <a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **body**: <a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Created

202 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified DeviceClass

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### Parameters
-->
### `update` 替换指定的 DeviceClass

#### HTTP 请求

PUT /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the DeviceClass

- **body**: <a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路径参数**): string，必需

  DeviceClass 的名称。

- **body**: <a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified DeviceClass

#### HTTP Request

PATCH /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### Parameters
-->
### `patch` 部分更新指定的 DeviceClass

#### HTTP 请求

PATCH /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### 参数

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
- **name** (**路径参数**): string，必需

  DeviceClass 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Created

401: Unauthorized

<!--
### `delete` delete a DeviceClass

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### Parameters
-->
### `delete` 删除 DeviceClass

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha3/deviceclasses/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the DeviceClass

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **name** (**路径参数**): string，必需

  DeviceClass 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): OK

202 (<a href="{{< ref "../extend-resources/device-class-v1alpha3#DeviceClass" >}}">DeviceClass</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of DeviceClass

#### HTTP Request

DELETE /apis/resource.k8s.io/v1alpha3/deviceclasses

#### Parameters
-->
### `deletecollection` 删除 DeviceClass 的集合

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha3/deviceclasses

#### 参数

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

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
