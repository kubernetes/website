<!--
### Node lifecycle conditions
-->
### 节点生命周期状况 {#node-lifecycle-conditions}

{{< feature-state feature_gate_name="NodeLifecycleConditions" >}}

<!--
Node lifecycle conditions report whether a Node is undergoing a lifecycle event
such as drain, maintenance, or Graceful Node Shutdown. They provide a
shared signal that cluster administrators, controllers, and
third-party tools can use for lifecycle management.
-->
Node 生命周期状况报告某个 Node 是否正在经历生命周期事件，
例如排空、维护或 Node 体面关闭。它们提供一种共享信号，
供集群管理员、控制器和第三方工具用于生命周期管理。

<!--
The following well-known lifecycle conditions are available:
-->
你可以使用下列众所周知的生命周期状况：

<!--
{{< table caption = "Node lifecycle conditions and their meanings." >}}
| Condition | Description |
| --- | --- |
| `DrainInProgress` | The Node is actively being drained according to the administrator's chosen drain criteria. |
| `Drained` | The Node has reached the drain criteria selected by the administrator. |
| `MaintenancePlanned` | The Node is expected to undergo a change in the future. If the change affects workloads, drain the Node before starting maintenance. |
| `MaintenanceInProgress` | The Node is actively undergoing maintenance. Maintenance can include hardware or software rollout, remediation, decommissioning, or debugging. |
| `GracefulNodeShutdownInProgress` | Graceful Node Shutdown is determined to be in progress on the Node. |
{{< /table >}}
-->
{{< table caption = "Node 生命周期状况及其含义。" >}}
| 状况 | 描述 |
| --- | --- |
| `DrainInProgress` | 正在按照管理员选定的排空标准排空 Node。 |
| `Drained` | Node 已达到管理员选定的排空标准。 |
| `MaintenancePlanned` | 预计 Node 将来会发生变更。如果该变更影响工作负载，请在开始维护前排空该 Node。 |
| `MaintenanceInProgress` | Node 正在执行维护。维护可包括硬件或软件的上线、修复、退役或调试。 |
| `GracefulNodeShutdownInProgress` | 判定 Node 上的 Node 体面关闭正在进行中。 |
{{< /table >}}

<!--
The `status` of each lifecycle condition has the following meaning:

* `True`: the lifecycle state described by the condition is currently observed.
* `False`: the lifecycle state described by the condition is not currently
  observed.
* `Unknown`: the writer cannot determine whether the lifecycle state is active.
-->
每个生命周期状况的 `status` 具有以下含义：

* `True`：当前观察到该状况所描述的生命周期状态。
* `False`：当前未观察到该状况所描述的生命周期状态。
* `Unknown`：写入者无法确定该生命周期状态是否处于活动状态。

<!--
Lifecycle conditions are observations that provide useful context around a Node's
lifecycle state. For example, use `MaintenancePlanned` to signal that a Node may
go into maintenance in the future, or `Drained` to signal that the
administrator's selected drain criteria have been met.
-->
生命周期状况是围绕 Node 生命周期状态提供有用上下文的观察结果。
例如，使用 `MaintenancePlanned` 表示某个 Node 将来可能进入维护状态，
或使用 `Drained` 表示管理员选定的排空标准已经满足。

<!--
The `reason` field identifies why the condition has its current status. Writers
should use stable CamelCase values for `reason`. The `message` field can provide
additional human-readable detail.

The following example reports that maintenance is planned for a Node:
-->
`reason` 字段标识该状况为何处于当前状态。写入者应为 `reason`
使用稳定的 CamelCase 取值。`message` 字段可提供额外的人类可读细节。

以下示例报告某个 Node 已计划进行维护：

```yaml
status:
  conditions:
  - type: MaintenancePlanned
    status: "True"
    reason: MaintenanceWindow
    message: "Hardware maintenance is scheduled for this Node"
    lastTransitionTime: "2026-07-20T14:00:00Z"
```

<!--
#### Writing lifecycle conditions

An administrator or an administrator-authorized controller is responsible for
setting and clearing lifecycle conditions on the Node.
-->
#### 写入生命周期状况 {#writing-lifecycle-conditions}

管理员或管理员授权的控制器负责设置和清除 Node 上的生命周期状况。

<!--
The writer determines when a lifecycle state is active. When the state is no
longer active, the writer sets the condition to `False` or removes it.

Kubernetes does not define exclusive writer ownership, locking, or handoff
between actors. Writers should coordinate ownership outside this API.
-->
由写入者决定生命周期状态何时处于活动状态。当该状态不再处于活动状态时，
写入者将该状况设置为 `False` 或将其移除。

Kubernetes 不定义排他性的写入者属主关系、锁定机制或参与者之间的交接。
写入者应在此 API 之外协调属主关系。

{{< note >}}
<!--
Core workload controllers do not change their behavior based on lifecycle
conditions. Setting a lifecycle condition does not affect core behavior of the
Node.
-->
核心工作负载控制器不会根据生命周期状况改变其行为。
设置某个生命周期状况不会影响 Node 的核心行为。
{{< /note >}}

<!--
The existing lifecycle management mechanisms should still be used:
-->
仍应继续使用现有的生命周期管理机制：

<!--
* Use [`kubectl cordon`](/docs/reference/kubectl/generated/kubectl_cordon/) or
  set `.spec.unschedulable` to prevent normal scheduling onto a Node.
* Use [`kubectl drain`](/docs/tasks/administer-cluster/safely-drain-node/) to
  safely evict Pods before taking a Node out of service.
* Use [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
  to control Pod scheduling and eviction policy.
-->
* 使用 [`kubectl cordon`](/zh-cn/docs/reference/kubectl/generated/kubectl_cordon/)
  或设置 `.spec.unschedulable`，以阻止将 Pod 正常调度到某个 Node 上。
* 在将 Node 停止服务之前，使用 [`kubectl drain`](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)
  安全地驱逐 Pod。
* 使用[污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)控制
  Pod 的调度和驱逐策略。

<!--
#### Viewing lifecycle conditions

Use `kubectl describe node` to view all conditions for a Node:
-->
#### 查看生命周期状况 {#viewing-lifecycle-conditions}

使用 `kubectl describe node` 查看某个 Node 的所有状况：

```shell
kubectl describe node <node-name>
```

<!--
To print the type and status of every condition, use:
-->
要打印每个状况的类型和状态，可使用：

```shell
kubectl get node <node-name> \
  -o jsonpath='{range .status.conditions[*]}{.type}={.status}{"\n"}{end}'
```
