### Node lifecycle conditions

{{< feature-state feature_gate_name="NodeLifecycleConditions" >}}

Node lifecycle conditions report whether a Node is undergoing a lifecycle event
such as drain, maintenance, or Graceful Node Shutdown. They provide a
shared signal that cluster administrators, controllers, and
third-party tools can use for lifecycle management.

The following well-known lifecycle conditions are available:

{{< table caption = "Node lifecycle conditions and their meanings." >}}
| Condition | Description |
| --- | --- |
| `DrainInProgress` | The Node is actively being drained according to the administrator's chosen drain criteria. |
| `Drained` | The Node has reached the drain criteria selected by the administrator. |
| `MaintenancePlanned` | The Node is expected to undergo a change in the future. If the change affects workloads, drain the Node before starting maintenance. |
| `MaintenanceInProgress` | The Node is actively undergoing maintenance. Maintenance can include hardware or software rollout, remediation, decommissioning, or debugging. |
| `GracefulNodeShutdownInProgress` | Graceful Node Shutdown is determined to be in progress on the Node. |
{{< /table >}}

The `status` of each lifecycle condition has the following meaning:

* `True`: the lifecycle state described by the condition is currently observed.
* `False`: the lifecycle state described by the condition is not currently
  observed.
* `Unknown`: the writer cannot determine whether the lifecycle state is active.

Lifecycle conditions are observations that provide useful context around a Node's
lifecycle state. For example, `MaintenancePlanned` to signal that a Node may go
into maintenance in the future, or `Drained` to signal that the admin's selected
drain criteria has been met.

The `reason` field identifies why the condition has its current status. Writers
should use stable CamelCase values for `reason`. The `message` field can provide
additional human-readable detail.

The following example reports that maintenance is planned for a Node:

```yaml
status:
  conditions:
  - type: MaintenancePlanned
    status: "True"
    reason: MaintenanceWindow
    message: "Hardware maintenance is scheduled for this Node"
    lastTransitionTime: "2026-07-20T14:00:00Z"
```

#### Writing lifecycle conditions

In Kubernetes v1.37, an administrator or an administrator-authorized controller
is responsible for setting and clearing lifecycle conditions on the Node.

The writer determines when a lifecycle state is active. When the state is no
longer active, the writer sets the condition to `False` or removes it.

Kubernetes v1.37 does not define exclusive writer ownership, locking, or handoff
between actors. That's a being discussed as a future expansion. It's up to the
to handle those issues for now.

{{< note >}}
In Kubernetes v1.37, core workload controllers do not change their behavior
based on lifecycle conditions. Setting a lifecycle condition does not affect
core behavior of the Node.
{{< /note >}}

The existing lifecycle management mechanisms should still be used:

* Use [`kubectl cordon`](/docs/reference/kubectl/generated/kubectl_cordon/) or
  set `.spec.unschedulable` to prevent normal scheduling onto a Node.
* Use [`kubectl drain`](/docs/tasks/administer-cluster/safely-drain-node/) to
  safely evict Pods before taking a Node out of service.
* Use [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
  to control Pod scheduling and eviction policy.

#### Viewing lifecycle conditions

Use `kubectl describe node` to view all conditions for a Node:

```shell
kubectl describe node <node-name>
```

To print the type and status of every condition, use:

```shell
kubectl get node <node-name> \
  -o jsonpath='{range .status.conditions[*]}{.type}={.status}{"\n"}{end}'
```

{{< note >}}
For more information about the design and future work, see
[Specialized Lifecycle Management](https://github.com/kubernetes/enhancements/issues/5683).
{{< /note >}}
