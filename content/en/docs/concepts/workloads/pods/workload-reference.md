---
title: Workload Reference
content_type: concept
weight: 90
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

You can link a Pod to a [Workload](/docs/concepts/workloads/workload-api/) object
to indicate that the Pod belongs to a larger application or group. This enables the scheduler to make decisions
based on the group's requirements rather than treating the Pod as an independent entity.

<!-- body -->

## Specifying a Workload reference

When the [`GenericWorkload`]((/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload))
feature gate is enabled, you can use the `spec.workloadRef` field in your Pod manifest.
This field establishes a link to a specific pod group defined within a Workload resource
in the same namespace.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  workloadRef:
    # The name of the Workload object in the same namespace
    name: training-job-workload
    # The name of the specific pod group inside that Workload
    podGroup: workers
```

### Pod group replicas

For more complex scenarios, you can replicate a single pod group into multiple, independent scheduling units.
You achieve this using the `podGroupReplicaKey` field within a Pod's `workloadRef`. This key acts as a label
to create logical subgroups.

For example, if you have a pod group with `minCount: 2` and you create four Pods: two with `podGroupReplicaKey: "0"`
and two with `podGroupReplicaKey: "1"`, they will be treated as two independent groups of two Pods.

```yaml
spec:
  workloadRef:
    name: training-job-workload
    podGroup: workers
    # All workers with the replica key "0" will be scheduled together as one group.
    podGroupReplicaKey: "0"
```

### Behavior

When you define a `workloadRef`, the Pod behaves differently depending on the
[policy](/docs/concepts/workloads/workload-api/policies/) defined in the referenced pod group.

* If the referenced group uses the `basic` policy, the workload reference acts primarily as a grouping label.
* If the referenced group uses the `gang` policy
  (and the [`GangScheduling`]((/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)) feature gate is enabled),
  the Pod enters a gang scheduling lifecycle. It will wait for other Pods in the group to be created
  and scheduled before binding to a node.

### Missing references

The scheduler validates the `workloadRef` before making any placement decisions.

If a Pod references a Workload that does not exist, or a pod group that is not defined within that Workload,
the Pod will remain pending. It is not considered for placement until you create the missing Workload object
or recreate it to include the missing `PodGroup` definition.

This behavior applies to all Pods with a `workloadRef`, regardless of whether the eventual policy will be `basic` or `gang`,
as the scheduler requires the Workload definition to determine the policy.

## {{% heading "whatsnext" %}}

* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* Read the details of [pod group policies](/docs/concepts/workloads/workload-api/policies/).
