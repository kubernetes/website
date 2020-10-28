---
title: Pod Topology Spread Constraints
content_type: concept
weight: 40
---

{{< feature-state for_k8s_version="v1.19" state="stable" >}}
<!-- leave this shortcode in place until the note about EvenPodsSpread is
obsolete -->

<!-- overview -->

You can use _topology spread constraints_ to control how {{< glossary_tooltip text="Pods" term_id="Pod" >}} are spread across your cluster among failure-domains such as regions, zones, nodes, and other user-defined topology domains. This can help to achieve high availability as well as efficient resource utilization.

{{< note >}}
In versions of Kubernetes before v1.19, you must enable the `EvenPodsSpread`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) on
the [API server](/docs/concepts/overview/components/#kube-apiserver) and the
[scheduler](/docs/reference/generated/kube-scheduler/) in order to use Pod
topology spread constraints.
{{< /note >}}

<!-- body -->

## Prerequisites

### Node Labels

Topology spread constraints rely on node labels to identify the topology domain(s) that each Node is in. For example, a Node might have labels: `node=node1,zone=us-east-1a,region=us-east-1`

Suppose you have a 4-node cluster with the following labels:

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

Then the cluster is logically viewed as below:

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
```

Instead of manually applying labels, you can also reuse the [well-known labels](/docs/reference/kubernetes-api/labels-annotations-taints/) that are created and populated automatically on most clusters.

## Spread Constraints for Pods

### API

The API field `pod.spec.topologySpreadConstraints` is defined as below:

```
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  topologySpreadConstraints:
    - maxSkew: <integer>
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
```

You can define one or multiple `topologySpreadConstraint` to instruct the kube-scheduler how to place each incoming Pod in relation to the existing Pods across your cluster. The fields are:

- **maxSkew** describes the degree to which Pods may be unevenly distributed.
  It's the maximum permitted difference between the number of matching Pods in
  any two topology domains of a given topology type. It must be greater than
  zero. Its semantics differs according to the value of `whenUnsatisfiable`:
  - when `whenUnsatisfiable` equals to "DoNotSchedule", `maxSkew` is the maximum
    permitted difference between the number of matching pods in the target
    topology and the global minimum.
  - when `whenUnsatisfiable` equals to "ScheduleAnyway", scheduler gives higher
    precedence to topologies that would help reduce the skew.
- **topologyKey** is the key of node labels. If two Nodes are labelled with this key and have identical values for that label, the scheduler treats both Nodes as being in the same topology. The scheduler tries to place a balanced number of Pods into each topology domain.
- **whenUnsatisfiable** indicates how to deal with a Pod if it doesn't satisfy the spread constraint:
  - `DoNotSchedule` (default) tells the scheduler not to schedule it.
  - `ScheduleAnyway` tells the scheduler to still schedule it while prioritizing nodes that minimize the skew.
- **labelSelector** is used to find matching Pods. Pods that match this label selector are counted to determine the number of Pods in their corresponding topology domain. See [Label Selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) for more details.

You can read more about this field by running `kubectl explain Pod.spec.topologySpreadConstraints`.

### Example: One TopologySpreadConstraint

Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively (`P` represents Pod):

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

If we want an incoming Pod to be evenly spread with existing Pods across zones, the spec can be given as:

{{< codenew file="pods/topology-spread-constraints/one-constraint.yaml" >}}

`topologyKey: zone` implies the even distribution will only be applied to the nodes which have label pair "zone:&lt;any value&gt;" present. `whenUnsatisfiable: DoNotSchedule` tells the scheduler to let it stay pending if the incoming Pod can't satisfy the constraint.

If the scheduler placed this incoming Pod into "zoneA", the Pods distribution would become [3, 1], hence the actual skew is 2 (3 - 1) - which violates `maxSkew: 1`. In this example, the incoming Pod can only be placed onto "zoneB":

```
+---------------+---------------+      +---------------+---------------+
|     zoneA     |     zoneB     |      |     zoneA     |     zoneB     |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |  OR  | node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
|   P   |   P   |   P   |   P   |      |   P   |   P   |  P P  |       |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
```

You can tweak the Pod spec to meet various kinds of requirements:

- Change `maxSkew` to a bigger value like "2" so that the incoming Pod can be placed onto "zoneA" as well.
- Change `topologyKey` to "node" so as to distribute the Pods evenly across nodes instead of zones. In the above example, if `maxSkew` remains "1", the incoming Pod can only be placed onto "node4".
- Change `whenUnsatisfiable: DoNotSchedule` to `whenUnsatisfiable: ScheduleAnyway` to ensure the incoming Pod to be always schedulable (suppose other scheduling APIs are satisfied). However, it's preferred to be placed onto the topology domain which has fewer matching Pods. (Be aware that this preferability is jointly normalized with other internal scheduling priorities like resource usage ratio, etc.)

### Example: Multiple TopologySpreadConstraints

This builds upon the previous example. Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively (`P` represents Pod):

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

You can use 2 TopologySpreadConstraints to control the Pods spreading on both zone and node:

{{< codenew file="pods/topology-spread-constraints/two-constraints.yaml" >}}

In this case, to match the first constraint, the incoming Pod can only be placed onto "zoneB"; while in terms of the second constraint, the incoming Pod can only be placed onto "node4". Then the results of 2 constraints are ANDed, so the only viable option is to place on "node4".

Multiple constraints can lead to conflicts. Suppose you have a 3-node cluster across 2 zones:

```
+---------------+-------+
|     zoneA     | zoneB |
+-------+-------+-------+
| node1 | node2 | node3 |
+-------+-------+-------+
|  P P  |   P   |  P P  |
+-------+-------+-------+
```

If you apply "two-constraints.yaml" to this cluster, you will notice "mypod" stays in `Pending` state. This is because: to satisfy the first constraint, "mypod" can only be put to "zoneB"; while in terms of the second constraint, "mypod" can only put to "node2". Then a joint result of "zoneB" and "node2" returns nothing.

To overcome this situation, you can either increase the `maxSkew` or modify one of the constraints to use `whenUnsatisfiable: ScheduleAnyway`.

### Conventions

There are some implicit conventions worth noting here:

- Only the Pods holding the same namespace as the incoming Pod can be matching candidates.

- Nodes without `topologySpreadConstraints[*].topologyKey` present will be bypassed. It implies that:

  1. the Pods located on those nodes do not impact `maxSkew` calculation - in the above example, suppose "node1" does not have label "zone", then the 2 Pods will be disregarded, hence the incoming Pod will be scheduled into "zoneA".
  2. the incoming Pod has no chances to be scheduled onto this kind of nodes - in the above example, suppose a "node5" carrying label `{zone-typo: zoneC}` joins the cluster, it will be bypassed due to the absence of label key "zone".

- Be aware of what will happen if the incomingPod's `topologySpreadConstraints[*].labelSelector` doesn't match its own labels. In the above example, if we remove the incoming Pod's labels, it can still be placed onto "zoneB" since the constraints are still satisfied. However, after the placement, the degree of imbalance of the cluster remains unchanged - it's still zoneA having 2 Pods which hold label {foo:bar}, and zoneB having 1 Pod which holds label {foo:bar}. So if this is not what you expect, we recommend the workload's `topologySpreadConstraints[*].labelSelector` to match its own labels.

- If the incoming Pod has `spec.nodeSelector` or `spec.affinity.nodeAffinity` defined, nodes not matching them will be bypassed.

    Suppose you have a 5-node cluster ranging from zoneA to zoneC:

    ```
    +---------------+---------------+-------+
    |     zoneA     |     zoneB     | zoneC |
    +-------+-------+-------+-------+-------+
    | node1 | node2 | node3 | node4 | node5 |
    +-------+-------+-------+-------+-------+
    |   P   |   P   |   P   |       |       |
    +-------+-------+-------+-------+-------+
    ```

    and you know that "zoneC" must be excluded. In this case, you can compose the yaml as below, so that "mypod" will be placed onto "zoneB" instead of "zoneC". Similarly `spec.nodeSelector` is also respected.

    {{< codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" >}}

### Cluster-level default constraints

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

It is possible to set default topology spread constraints for a cluster. Default
topology spread constraints are applied to a Pod if, and only if:

- It doesn't define any constraints in its `.spec.topologySpreadConstraints`.
- It belongs to a service, replication controller, replica set or stateful set.

Default constraints can be set as part of the `PodTopologySpread` plugin args
in a [scheduling profile](/docs/reference/scheduling/config/#profiles).
The constraints are specified with the same [API above](#api), except that
`labelSelector` must be empty. The selectors are calculated from the services,
replication controllers, replica sets or stateful sets that the Pod belongs to.

An example configuration might look like follows:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta1
kind: KubeSchedulerConfiguration

profiles:
  pluginConfig:
    - name: PodTopologySpread
      args:
        defaultConstraints:
          - maxSkew: 1
            topologyKey: topology.kubernetes.io/zone
            whenUnsatisfiable: ScheduleAnyway
```

{{< note >}}
The score produced by default scheduling constraints might conflict with the
score produced by the
[`SelectorSpread` plugin](/docs/reference/scheduling/config/#scheduling-plugins).
It is recommended that you disable this plugin in the scheduling profile when
using default constraints for `PodTopologySpread`.
{{< /note >}}

#### Internal default constraints

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

When you enable the `DefaultPodTopologySpread` feature gate, the
legacy `SelectorSpread` plugin is disabled.
kube-scheduler uses the following default topology constraints for the
`PodTopologySpread` plugin configuration:

```yaml
defaultConstraints:
  - maxSkew: 3
    topologyKey: "kubernetes.io/hostname"
    whenUnsatisfiable: ScheduleAnyway
  - maxSkew: 5
    topologyKey: "topology.kubernetes.io/zone"
    whenUnsatisfiable: ScheduleAnyway
```

Also, the legacy `SelectorSpread` plugin, which provides an equivalent behavior,
is disabled.

{{< note >}}
If your nodes are not expected to have **both** `kubernetes.io/hostname` and
`topology.kubernetes.io/zone` labels set, define your own constraints
instead of using the Kubernetes defaults.

The `PodTopologySpread` plugin does not score the nodes that don't have
the topology keys specified in the spreading constraints.
{{< /note >}}

## Comparison with PodAffinity/PodAntiAffinity

In Kubernetes, directives related to "Affinity" control how Pods are
scheduled - more packed or more scattered.

- For `PodAffinity`, you can try to pack any number of Pods into qualifying
  topology domain(s)
- For `PodAntiAffinity`, only one Pod can be scheduled into a
  single topology domain.

For finer control, you can specify topology spread constraints to distribute
Pods across different topology domains - to achieve either high availability or
cost-saving. This can also help on rolling update workloads and scaling out
replicas smoothly. See
[Motivation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation)
for more details.

## Known Limitations

- Scaling down a Deployment may result in imbalanced Pods distribution.
- Pods matched on tainted nodes are respected. See [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)

## {{% heading "whatsnext" %}}

- [Blog: Introducing PodTopologySpread](https://kubernetes.io/blog/2020/05/introducing-podtopologyspread/)
  explains `maxSkew` in details, as well as bringing up some advanced usage examples.
