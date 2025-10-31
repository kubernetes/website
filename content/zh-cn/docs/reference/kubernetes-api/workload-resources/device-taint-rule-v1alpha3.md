---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "DeviceTaintRule"
content_type: "api_reference"
description: "DeviceTaintRule 添加一个污点到与选择算符匹配的所有设备上。"
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
DeviceTaintRule 添加一个污点到与选择算符匹配的所有设备上。
这与通过 DRA 驱动直接在 ResourceSlice 中指定污点具有同样的效果。

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

  标准的对象元数据。

- **spec** (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleSpec" >}}">DeviceTaintRuleSpec</a>)，必需

  spec 指定选择算符和一个污点。
  
  自动更改 spec 会让 metadata.generation 数值加一。

## DeviceTaintRuleSpec {#DeviceTaintRuleSpec}

<!--
DeviceTaintRuleSpec specifies the selector and one taint.
-->
DeviceTaintRuleSpec 指定选择算符和一个污点。

<hr>

<!--
- **taint** (DeviceTaint), required

  The taint that gets applied to matching devices.

  <a name="DeviceTaint"></a>
  *The device this taint is attached to has the "effect" on any claim which does not tolerate the taint and, through the claim, to pods using the claim.*
-->
- **taint** (DeviceTaint)，必需

  应用到匹配设备的污点。

  <a name="DeviceTaint"></a>  
  **挂接了此污点的设备会对任何不容忍此污点的申领产生“影响”，并通过此申领影响使用申领的 Pod。**

  <!--
  - **taint.effect** (string), required

    The effect of the taint on claims that do not tolerate the taint and through such claims on the pods using them. Valid effects are NoSchedule and NoExecute. PreferNoSchedule as used for nodes is not valid here.

  - **taint.key** (string), required

    The taint key to be applied to a device. Must be a label name.
  -->

  - **taint.effect** (string)，必需

    对不容忍此污点的申领及使用此申领的 Pod 所产生的影响。
    有效值包括 `NoSchedule` 和 `NoExecute`。
    节点上常用的 `PreferNoSchedule` 在此无效。

  - **taint.key** (string)，必需

    应用到某设备的污点键。必须是标签名称。

  <!--
  - **taint.timeAdded** (Time)

    TimeAdded represents the time at which the taint was added. Added automatically during create or update if not set.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **taint.value** (string)

    The taint value corresponding to the taint key. Must be a label value.
  -->

  - **taint.timeAdded** (Time)

    timeAdded 表示添加污点的时间。如果未设置，意味着在创建或更新期间自动添加。

    <a name="Time"></a>
    **Time 是 time.Time 的包装器，它支持对 YAML 和 JSON 的正确编组。
    time 包的许多工厂方法提供了包装器。**

  - **taint.value** (string)

    与污点键对应的污点值。必须是标签值。

<!--
- **deviceSelector** (DeviceTaintSelector)

  DeviceSelector defines which device(s) the taint is applied to. All selector criteria must be satified for a device to match. The empty selector matches all devices. Without a selector, no devices are matches.

  <a name="DeviceTaintSelector"></a>
  *DeviceTaintSelector defines which device(s) a DeviceTaintRule applies to. The empty selector matches all devices. Without a selector, no devices are matched.*
-->
- **deviceSelector** (DeviceTaintSelector)

  deviceSelector 定义污点应用到哪些设备上。
  对于要匹配的设备，必须满足所有选择算符条件。
  空选择算符匹配所有设备。如果没有选择算符，则不匹配任何设备。

  <a name="DeviceTaintSelector"></a>  
  **DeviceTaintSelector 定义 DeviceTaintRule 应用到哪些设备。
  空选择算符匹配所有设备。如果没有选择算符，则不匹配任何设备。**

  <!--
  - **deviceSelector.device** (string)

    If device is set, only devices with that name are selected. This field corresponds to slice.spec.devices[].name.
    
    Setting also driver and pool may be required to avoid ambiguity, but is not required.

  - **deviceSelector.deviceClassName** (string)

    If DeviceClassName is set, the selectors defined there must be satisfied by a device to be selected. This field corresponds to class.metadata.name.
  -->

  - **deviceSelector.device** (string)

    如果设置了 device，则仅选择具有该名称的设备。
    此字段对应 `slice.spec.devices[].name`。  
    
    为避免歧义，也可以设置 driver 和 pool，但不是必需的。

  - **deviceSelector.deviceClassName** (string)

    如果设置了 deviceClassName，则设备必须满足其中定义的选择算符条件才会被选中。
    此字段对应 `class.metadata.name`。

  <!--
  - **deviceSelector.driver** (string)

    If driver is set, only devices from that driver are selected. This fields corresponds to slice.spec.driver.

  - **deviceSelector.pool** (string)

    If pool is set, only devices in that pool are selected.
    
    Also setting the driver name may be useful to avoid ambiguity when different drivers use the same pool name, but this is not required because selecting pools from different drivers may also be useful, for example when drivers with node-local devices use the node name as their pool name.
  -->

  - **deviceSelector.driver** (string)

    如果设置了 driver，则仅选择来自该驱动的设备。此字段对应于 `slice.spec.driver`。

  - **deviceSelector.pool** (string)

    如果设置了 pool，则仅选择属于该资源池的设备。
  
    同时设置 driver 名称可能有助于避免不同驱动使用相同的池名称所带来的歧义，但这不是必需的。
    因为从不同驱动中选择池也是有意义的，例如当使用节点本地设备的驱动以节点名称作为 pool 名称时。

  <!--
  - **deviceSelector.selectors** ([]DeviceSelector)

    *Atomic: will be replaced during a merge*
    
    Selectors contains the same selection criteria as a ResourceClaim. Currently, CEL expressions are supported. All of these selectors must be satisfied.

    <a name="DeviceSelector"></a>
    *DeviceSelector must have exactly one field set.*
  -->

  - **deviceSelector.selectors** ([]DeviceSelector)

    **原子性：将在合并期间被替换**

    selectors 包含与 ResourceClaim 相同的选择条件。目前支持 CEL 表达式。
    必须满足所有这些选择算符。

    <a name="DeviceSelector"></a>
    **DeviceSelector 必须有且仅有一个字段被设置。**

    <!--
    - **deviceSelector.selectors.cel** (CELDeviceSelector)

      CEL contains a CEL expression for selecting a device.

      <a name="CELDeviceSelector"></a>
      *CELDeviceSelector contains a CEL expression for selecting a device.*
    -->

    - **deviceSelector.selectors.cel** (CELDeviceSelector)

      cel 包含一个用于选择设备的 CEL 表达式。

      <a name="CELDeviceSelector"></a>
      **CELDeviceSelector 包含一个用于选择设备的 CEL 表达式。**

      <!--
      - **deviceSelector.selectors.cel.expression** (string), required

        Expression is a CEL expression which evaluates a single device. It must evaluate to true when the device under consideration satisfies the desired criteria, and false when it does not. Any other result is an error and causes allocation of devices to abort.
      -->

      - **deviceSelector.selectors.cel.expression** (string)，必需

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

        示例：考虑一个驱动为 "dra.example.com" 的设备，它暴露两个名为 "model" 和
        "ext.example.com/family" 的属性，并且暴露一个名为 "modules" 的容量。此表达式的输入将具有以下字段：
        
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

  标准的列表元数据。

- **items** ([]<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>)，必需

  items 是 DeviceTaintRules 的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified DeviceTaintRule

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 DeviceTaintRule

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the DeviceTaintRule

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  DeviceTaintRule 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind DeviceTaintRule

#### HTTP Request
-->
### `list` 列举或监视类别为 DeviceTaintRule 的对象

#### HTTP 请求

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
#### 参数

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleList" >}}">DeviceTaintRuleList</a>): OK

401: Unauthorized

<!--
### `create` create a DeviceTaintRule

#### HTTP Request
-->
### `create` 创建 DeviceTaintRule

#### HTTP 请求

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
#### 参数

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>，必需

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified DeviceTaintRule

#### HTTP Request
-->
### `update` 替换指定的 DeviceTaintRule

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需

  DeviceTaintRule 的名称。

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>，必需

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified DeviceTaintRule

#### HTTP Request
-->
### `patch` 部分更新指定的 DeviceTaintRule

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需

  DeviceTaintRule 的名称。

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

<!--
### `delete` delete a DeviceTaintRule

#### HTTP Request
-->
### `delete` 删除 DeviceTaintRule

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需

  DeviceTaintRule 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of DeviceTaintRule

#### HTTP Request
-->
### `deletecollection` 删除 DeviceTaintRule 的集合

#### HTTP 请求

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
#### 参数

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

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
