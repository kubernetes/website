---
title: 设备污点与容忍度
content_type: concept
weight: 50
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1"
  kind: "DeviceTaintRule"
---
<!--
reviewers:
- klueska
- pohly
title: Device Taints and Tolerations
content_type: concept
weight: 50
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1"
  kind: "DeviceTaintRule"
-->

<!-- overview -->

<!--
This page describes device taints and tolerations in DRA, which let drivers and
admins keep Pods off specific devices, or evict Pods already using them.
-->
本页介绍 DRA 中的设备污点与容忍度，它们允许驱动和管理员阻止 Pod
使用特定设备，或驱逐已经在使用这些设备的 Pod。

<!-- body -->

<!--
## Device taints and tolerations {#device-taints-and-tolerations}
-->
## 设备污点与容忍度 {#device-taints-and-tolerations}

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

<!--
Device taints are similar to node taints: a taint has a string key, a string value, and an effect.
The effect is applied to the ResourceClaim which is using a tainted device and to all Pods referencing that ResourceClaim.
The "NoSchedule" effect prevents scheduling those Pods.
Tainted devices are ignored when trying to allocate a ResourceClaim because using them would prevent scheduling of Pods.
-->
设备污点与节点污点类似：一个污点包含字符串键、字符串值以及效果。
该效果会应用到正在使用被污染设备的 ResourceClaim，以及引用该 ResourceClaim 的所有 Pod。
`NoSchedule` 效果会阻止这些 Pod 的调度。
在尝试分配 ResourceClaim 时，被污染的设备会被忽略，
因为使用它们会阻止 Pod 的调度。

<!--
The "NoExecute" effect implies "NoSchedule" and in addition causes eviction of all Pods
which have been scheduled already.
This eviction is implemented in the device taint eviction controller in kube-controller-manager by deleting affected Pods.
-->
`NoExecute` 效果暗含 `NoSchedule`，并且会额外驱逐所有已被调度的 Pod。
该驱逐由 kube-controller-manager 中的设备污点驱逐控制器通过删除受影响的 Pod 来实现。

<!--
The "None" effect is ignored by the scheduler and eviction controller.
DRA drivers can use it to communicate exceptions to admins or other controllers,
for example degraded health of a device. Admins can also use it to
do dry-runs of pod eviction in DeviceTaintRules (more on that below).
-->
调度器和驱逐控制器会忽略 `None` 效果。
DRA 驱动可以用它向管理员或其他控制器传达异常情况，
例如设备的健康状况下降。管理员也可以用它在 DeviceTaintRule
中执行 Pod 驱逐的试运行（更多见下文）。

<!--
ResourceClaims can tolerate taints. If a taint is tolerated, its effect does not apply.
An empty toleration matches all taints. A toleration can be limited to certain effects
and/or match certain key/value pairs.
A toleration can check that a certain key exists, regardless which value it has, or it can check
for specific values of a key.
For more information on this matching see the
[node taint concepts](/docs/concepts/scheduling-eviction/taint-and-toleration#concepts).
-->
ResourceClaim 可以容忍污点。如果某个污点被容忍，则其效果不会生效。
空的容忍度匹配所有污点。容忍度可以被限制为仅对某些效果生效，
和/或匹配某些键值对。容忍度可以检查某个键是否存在（无论其值是什么），
也可以检查键的特定值。有关这种匹配的更多信息，
请参阅[节点污点概念](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration#concepts)。

<!--
Eviction can be delayed by tolerating a taint for a certain duration.
That delay starts at the time when a taint gets added to a device, which is recorded in a field of the taint.
-->
通过在一段时间内容忍污点可以延迟驱逐。
该延迟从污点被添加到设备上的时间开始计算，
该时间记录在污点的一个字段中。

<!--
Taints apply as described above also to ResourceClaims allocating "all" devices on a node.
All devices must be untainted or all of their taints must be tolerated.
Allocating a device with admin access (described [above](#admin-access))
is not exempt either. An admin using that mode must explicitly tolerate all taints
to access tainted devices.
-->
如上所述，污点同样适用于分配节点上"所有"设备的 ResourceClaim。
必须所有设备都未被打上污点，或者它们的所有污点都被容忍。
使用管理员访问（见[上文](#admin-access)的描述）分配设备同样不能豁免。
使用该模式的管理员必须显式容忍所有污点才能访问被污染的设备。

<!--
You can add taints to devices in the following ways, by using the DeviceTaintRule API kind.
-->
你可以通过使用 DeviceTaintRule API 种类，以以下方式向设备添加污点。

<!--
### Taints set by the driver
-->
### 由驱动设置的污点

<!--
A DRA driver can add taints to the device information that it publishes in ResourceSlices.
Consult the documentation of a DRA driver to learn whether the driver uses taints and what their keys and values are.
-->
DRA 驱动可以向其在 ResourceSlice 中发布的设备信息添加污点。
请查阅 DRA 驱动的文档，了解该驱动是否使用污点以及其键和值是什么。

<!--
### Taints set by an admin
-->
### 由管理员设置的污点

{{< feature-state feature_gate_name="DRADeviceTaintRules" >}}

<!--
An admin or a control plane component can taint devices without having to tell
the DRA driver to include taints in its device information in ResourceSlices.
They do that by creating DeviceTaintRules.
Each DeviceTaintRule adds one taint to devices which match the device selector.
Without such a selector, no devices are tainted.
This makes it harder to accidentally evict all pods using ResourceClaims when leaving out the selector by mistake.
-->
管理员或控制平面组件可以直接为设备设置污点，
而无需告知 DRA 驱动在其 ResourceSlice 中的设备信息里包含污点。
他们通过创建 DeviceTaintRule 来实现。
每个 DeviceTaintRule 向匹配设备选择算符的设备添加一个污点。
如果没有选择算符，则不会有设备被污染。
这降低了因误操作遗漏选择算符而意外驱逐所有使用 ResourceClaim 的 Pod 的风险。

<!--
Devices can be selected by giving the name of a DeviceClass, driver, pool, and/or device.
The DeviceClass selects all devices that are selected by the selectors in that DeviceClass.
With just the driver name, an admin can taint all devices managed by that driver,
for example while doing some kind of maintenance of that driver across the entire cluster.
Adding a pool name can limit the taint to a single node, if the driver manages node-local devices.
-->
可以通过指定 DeviceClass、驱动、池和/或设备的名称来选择设备。
DeviceClass 会选择所有被该 DeviceClass 中的选择算符选中的设备。
仅使用驱动名称，管理员可以污染由该驱动管理的所有设备，
例如在整个集群中对该驱动进行某种维护时。
如果驱动管理节点本地的设备，添加池名称可以将污点限制到单个节点。

<!--
Finally, adding the device name can select one specific device.
The device name and pool name can also be used alone, if desired.
For example, drivers for node-local devices are encouraged to use the node name as their pool name.
Then tainting with that pool name automatically taints all devices on a node.
-->
最后，添加设备名称可以选择一个特定设备。
如果需要，设备名称和池名称也可以单独使用。
例如，建议节点本地设备的驱动使用节点名称作为其池名称。
这样，使用该池名称设置污点会自动污染节点上的所有设备。

<!--
Drivers might use stable names like "gpu-0" that hide which specific device is currently assigned to that name.
To support tainting a specific hardware instance, CEL selectors can be used in a DeviceTaintRule
to match a vendor-specific unique ID attribute, if the driver supports one for its hardware.
-->
驱动可能使用像 "gpu-0" 这样的稳定名称，
隐藏了当前分配给该名称的是哪一个具体设备。
为了支持污染特定的硬件实例，如果驱动为其硬件提供了
特定于供应商的唯一 ID 属性，可以在 DeviceTaintRule 中使用 CEL
选择算符来匹配该属性。

<!--
The taint applies as long as the DeviceTaintRule exists.
It can be modified and and removed at any time.
Here is one example of a DeviceTaintRule for a fictional DRA driver:
-->
只要 DeviceTaintRule 存在，污点就会生效。
它可以随时被修改和删除。
以下是一个针对虚构 DRA 驱动的 DeviceTaintRule 示例：

<!--
# The entire hardware installation for this
# particular driver is broken.
# Evict all pods and don't schedule new ones.
-->
```yaml
apiVersion: resource.k8s.io/v1
kind: DeviceTaintRule
metadata:
  name: example
spec:
  # 该特定驱动的整个硬件安装已损坏。
  # 驱逐所有 Pod，且不调度新的 Pod。
  deviceSelector:
    driver: dra.example.com
  taint:
    key: dra.example.com/unhealthy
    value: Broken
    effect: NoExecute
```

<!--
The kube-apiserver automatically tracks when this taint was created by setting the
`timeAdded` field in the `spec`. The toleration period starts at that time
stamp. During updates which change the effect (see simulated eviction flow
below), the kube-apiserver automatically updates the time stamp. Users can control
the time stamp explicitly by setting the field when creating a DeviceTaintRule and
by changing it to some different value when updating.
-->
kube-apiserver 通过设置 `spec` 中的 `timeAdded` 字段，
自动追踪该污点的创建时间。容忍期从该时间戳开始计算。
在变更效果的更新过程中（见下文的模拟驱逐流程），
kube-apiserver 会自动更新时间戳。用户可以在创建 DeviceTaintRule
时显式设置该字段，或在更新时改为其他值，从而显式控制时间戳。

<!--
The status contains a condition added by the eviction controller:
-->
status 中包含由驱逐控制器添加的一个条件：

```
kubectl describe devicetaintrules
```

```
Name:         example
...
Spec:
  Device Selector:
    Driver:  dra.example.com
  Taint:
    Effect:      NoExecute
    Key:         dra.example.com/unhealthy
    Time Added:  2025-11-05T18:15:37Z
    Value:       Broken
Status:
  Conditions:
    Last Transition Time:  2025-11-05T18:15:37Z
    Message:               1 pod evicted since starting the controller.
    Observed Generation:   1
    Reason:                Completed
    Status:                False
    Type:                  EvictionInProgress
Events:                    <none>
```

<!--
Pods get evicted by deleting them. Usually this happens very quickly,
except when a toleration for the taint delays it for a certain period or
when there are very many pods which need to be evicted. When it takes
longer, the message provides information about the current status:
-->
Pod 通过被删除来驱逐。通常这会很快发生，
除非对污点的容忍度将其延迟一段时间，或者有非常多的 Pod 需要驱逐。
如果驱逐花费的时间较长，`message` 会提供关于当前状态的信息：
    
    ```
    2 pods need to be evicted in 2 different namespaces. 1 pod evicted since starting the controller.
    ```

<!--
The condition can be used to check whether an eviction is currently active:
-->
该状况可用于检查驱逐当前是否正在进行：

    ```
    kubectl wait --for=condition=EvictionInProgress=false DeviceTaintRule/example
    ```

<!--
Beware of the potential race between scheduler and controller observing the new
taint at different times, which can lead to pods still being scheduled at a
time when the controller thinks that there are none which need to be evicted
and thus sets this condition to `False`. In practice, this race is made very
unlikely by updating the status only after an intentional delay of a few
seconds.
-->
请注意调度器和控制器在不同时间观察到新污点可能引发的竞态条件：
这可能导致在控制器认为没有需要驱逐的 Pod 从而将此条件设置为
`False` 时，仍有 Pod 被调度。实际中，通过刻意延迟几秒钟才更新状态，
这种竞态条件出现的可能性非常低。

<!--
For `effect: None`, the message provides information about the number of
affected devices, how many of those are allocated, and how many pods would be
evicted if the effect was `NoExecute`. This can be used to do a dry-run before
actually triggering eviction:
-->
对于 `effect: None`，message 会提供关于受影响设备数量、
其中已分配的设备数量，以及如果效果为 `NoExecute` 将会被驱逐的 Pod
数量的信息。这可以在实际触发驱逐之前用作试运行：

<!--
- Create a DeviceTaintRule with the desired selectors and `effect: None`.
-->
- 使用所需的选择算符和 `effect: None` 创建一个 DeviceTaintRule。

<!--
- Review the message:
-->
- 查看 message：

```
3 published devices selected. 1 allocated device selected.
1 pod would be evicted in 1 namespace if the effect was NoExecute.
This information will not be updated again. Recreate the DeviceTaintRule to trigger an update.
```

  <!--
  Published devices are those listed in ResourceSlices. Tainting them
  prevents allocation for new pods. Only allocated devices cause
  eviction of the pods using them.
  -->
  已发布的设备是 ResourceSlice 中列出的设备。为它们设置污点会阻止为新 Pod 分配。
  只有已分配的设备才会导致使用它们的 Pod 被驱逐。

<!--
- Edit the DeviceTaintRule and change the effect into `NoExecute`.
-->
- 编辑 DeviceTaintRule，将效果更改为 `NoExecute`。
