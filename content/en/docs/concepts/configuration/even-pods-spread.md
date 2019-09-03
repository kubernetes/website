---
title: Even Pods Spread
content_template: templates/concept
weight: 50
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

You can use _topology spread constraints_ to control how {{< glossary_tooltip text="Pods" term_id="Pod" >}} are spread across your cluster among failure-domains such as regions, zones, nodes, and other user-defined topology domains. This can help to achieve high availability as well as efficient resource utilization.

{{% /capture %}}

{{% capture body %}}

## Motivation

In Kubernetes, directives related to "Affinity" control how Pods are
scheduled - more packed or more scattered. But right now only limited options
are offered: for `PodAffinity`, you can try to pack any number of Pods into qualifying
topology domain(s); for `PodAntiAffinity`, only one Pod can be scheduled into a
single topology domain.

This is not an ideal situation if users want to distribute Pods evenly across different
topology domains - to achieve high availability or cost-saving. And
regular rolling upgrade or scaling out replicas can also be problematic.

## Prerequisites

### Enable Feature Gate

Ensure the `EvenPodsSpread` feature gate is enabled (it is disabled by default
in 1.16). See [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/) for an explanation of enabling feature gates. The `EvenPodsSpread` feature gate must be enabled on apiserver **and** scheduler.

### Apply Labels to Worker Nodes

This feature requires the nodes to be labelled with topological key-value pairs via `kubectl label node <node_name> <key1=val1> <key2=val2> ...`. For example, you can verify using `--show-labels` flag:

```
kubectl get node --show-labels
```

The output indicates that 4 nodes are tagged with "{node: <node_name>, zone: <zone_name>}":

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

So the cluster is logically viewed as below:

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
```

Instead of manually applying labels, you can also reuse the [well-known labels](/docs/reference/kubernetes-api/labels-annotations-taints/) that are created and populated automatically on most clusters.

## Usage

### API

The field `pod.spec.topologySpreadConstraints` is introduced in 1.16 as below:

```yaml
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

You can define one or multiple `topologySpreadConstraint` to instruct the kube-scheduler how to place the incoming Pod with existing Pods across the cluster. In particular, the fields are explained as below:

- **maxSkew** describes the degree to which Pods may be unevenly distributed. It's the maximum permitted difference between the number of matching Pods in any two topology domains of a given topology type. It must be greater than zero.
- **topologyKey** is the key of node labels. Nodes that have a label with this key and identical values are considered to be in the same topology. We consider each <key, value> as a "bucket", and try to put a balanced number of Pods into each bucket.
- **whenUnsatisfiable** indicates how to deal with a Pod if it doesn't satisfy the spread constraint:
    - `DoNotSchedule` (default) tells the scheduler not to schedule it.
    - `ScheduleAnyway` tells the scheduler to still schedule it while prioritizing nodes that minimize the skew.
- **labelSelector** is used to find matching Pods. Pods that match this label selector are counted to determine the number of Pods in their corresponding topology domain. See [Lable Selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) for more details.

Detailed API explanation can also be found via `kubectl explain Pod.spec.topologySpreadConstraints`.

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

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: mypod
  labels:
    foo: bar
spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        foo: bar
...
```

`topologyKey: zone` implies the even distribution will only be applied to the nodes which have label pair "zone:<any value>" present.  And `whenUnsatisfiable: DoNotSchedule` tells the scheduler to let it stay pending if the incoming Pod can’t satisfy the constraint.

If the Pod is placed into "zoneA", the Pods distribution would become [3, 1], hence the actual skew is 2 (3 - 1) which violates `maxSkew: 1`. In this example, the incoming Pod can only be placed onto "zoneB":

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
- Change `whenUnsatisfiable: DoNotSchedule` to `whenUnsatisfiable: ScheduleAnyway` to ensure the incoming Pod to be always schedulable (suppose other scheduling APIs are satisfied). However, it’s preferred to be placed onto the topology domain which has fewer matching Pods. (Be aware that this preferability is jointly normalized with other internal scheduling priorities like resource usage ratio, etc.)

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

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: mypod
  labels:
    foo: bar
spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        foo: bar
  - maxSkew: 1
    topologyKey: node
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        foo: bar
...
```

In this case, to match the first constraint, the incoming Pod can only be placed onto "zoneB"; while in terms of the second constraint, the incoming Pod can only be placed onto "node4". Then the results of 2 constraints are ANDed, so the only viable option is to place on "node4".

Multiple constraints can lead to conflicts. Suppose you have a 3-node cluster across 2 zones:

```
+---------------+-------+
|     zoneA     | zoneB |
+-------+-------+-------+
| node1 | node2 |  nod3 |
+-------+-------+-------+
|  P P  |   P   |  P P  |
+-------+-------+-------+
```

If you apply "mypod.yaml" to this cluster, you will notice "mypod" stays in `Pending` state. This is because: to satisfy the first constraint, "mypod" can only be put to "zoneB"; while in terms of the second constraint, "mypod" can only put to "node2". Then a joint result of "zoneB" and "node2" returns nothing.

To overcome this situation, you can either increase the `maxSkew` or modify one of the constraints to use `whenUnsatisfiable: ScheduleAnyway`.

### Conventions

There are some implicit conventions worth noting here:

- Only the Pods holding the same namespace as the incoming Pod can be matching candidates.

- Nodes without `topologySpreadConstraints[*].topologyKey` present will be bypassed. It implies that:
    1. the Pods located on those nodes do not impact `maxSkew` calculation - in the above example, suppose "node1" does not have label "zone", then the 2 Pods will be disregarded, hence the incomingPod will be scheduled into "zoneA".
    2. the incoming Pod has no chances to be scheduled onto this kind of nodes - in the above example, suppose a "node5" carrying label `{zone-typo: zoneC}` joins the cluster, it will be bypassed due to the absence of label key "zone".

- Be aware of what will happen if the incomingPod’s `topologySpreadConstraints[*].labelSelector` doesn’t match its own labels. In the above example, if we remove the incoming Pod’s labels, it can still be placed onto "zoneB" since the constraints are still satisfied. However, after the placement, the degree of imbalance of the cluster remains unchanged - it’s still zoneA having 2 Pods which hold label {foo:bar}, and zoneB having 1 Pod which holds label {foo:bar}. So if this is not what you expect, we recommend the workload’s `topologySpreadConstraints[*].labelSelector` to match its own labels.

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

    and you know that "zoneC" must be excluded. In this case, you can compose the spec like this:

    ```yaml
    kind: Pod
    apiVersion: v1
    metadata:
      name: mypod
      labels:
        foo: bar
    spec:
      topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: zone
        whenUnsatisfiable: DoNotSchedule
        labelSelector:
          matchLabels:
            foo: bar
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: zone
                operator: NotIn
                values:
                - zoneC
    ...

    So that "mypod" will be placed onto zoneB instead of zoneC. Similarly `spec.nodeSelector` is also respected.

## Known Limitations

As of 1.16, at which this feature is Alpha, there are some known limitations:

- Scaling down a `Deployment` may result in imbalanced Pods distribution.
- Pods matched on tainted nodes are respected. See [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)

{{% /capture %}}
