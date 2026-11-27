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
lifecycle state. For example, use `MaintenancePlanned` to signal that a Node may
go into maintenance in the future, or `Drained` to signal that the
administrator's selected drain criteria have been met.

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

An administrator or an administrator-authorized controller is responsible for
setting and clearing lifecycle conditions on the Node.

The writer determines when a lifecycle state is active. When the state is no
longer active, the writer sets the condition to `False` or removes it.

Kubernetes does not define exclusive writer ownership, locking, or handoff
between actors. Writers should coordinate ownership outside this API.

#### Reporting drain conditions with kubectl

{{< feature-state state="alpha" for_k8s_version="1.38" >}}

In Kubernetes v1.38, `kubectl drain` can report drain progress through the
`DrainInProgress` and `Drained` conditions. This reporting is disabled by
default. To enable it for a drain, set the
`KUBECTL_DRAIN_NODE_CONDITIONS` environment variable to `true`:

```shell
KUBECTL_DRAIN_NODE_CONDITIONS=true kubectl drain <node-name>
```

With reporting enabled, kubectl updates both conditions together:

{{< table caption = "Node lifecycle condition updates made by kubectl." >}}
| Event | `DrainInProgress` | `Drained` | Reason |
| --- | --- | --- | --- |
| Kubectl starts processing the Node | `True` | `False` | `KubectlDrainStarted` |
| The selected drain criteria are met | `False` | `True` | `KubectlDrainCompleted` |
| Drain fails or times out | `False` | `False` | `KubectlDrainFailed` |
| Kubectl handles an interrupt | `False` | `False` | `KubectlDrainInterrupted` |
| Kubectl uncordons the Node | `False` | `False` | `KubectlUncordoned` |
{{< /table >}}

`Drained=True` means that the criteria selected by that kubectl invocation were
met. It does not necessarily mean that the Node has no Pods, that another drain
implementation would select the same Pods, or that the Node is ready for
termination.

To clear the drain observations when returning the Node to service, also enable
reporting for `kubectl uncordon`:

```shell
KUBECTL_DRAIN_NODE_CONDITIONS=true kubectl uncordon <node-name>
```

Reporting requires `patch` permission on the `nodes/status` subresource. This
permission is separate from permission to cordon a Node by updating the main
`nodes` resource. If kubectl cannot update the conditions, it prints a warning;
the reporting failure does not change the result of the drain operation.

With `--dry-run=client`, kubectl does not update the conditions. With
`--dry-run=server`, kubectl sends the condition update as a server dry-run
request without persisting it.

If kubectl exits unexpectedly, `DrainInProgress=True` can become stale. An
authorized administrator can inspect the condition timestamps and then correct
or clear the condition.

{{< note >}}
Core workload controllers do not change their behavior based on lifecycle
conditions. Setting a lifecycle condition does not affect core behavior of the
Node.
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
