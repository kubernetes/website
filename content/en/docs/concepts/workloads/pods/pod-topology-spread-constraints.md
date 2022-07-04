---
title: Pod Topology Spread Constraints
content_type: concept
weight: 40
---


<!-- overview -->

You can use _topology spread constraints_ to control how {{< glossary_tooltip text="Pods" term_id="Pod" >}} are spread across your cluster among failure-domains such as regions, zones, nodes, and other user-defined topology domains. This can help to achieve high availability as well as efficient resource utilization.


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

{{<mermaid>}}
graph TB
    subgraph "zoneB"
        n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        n1(Node1)
        n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Instead of manually applying labels, you can also reuse the [well-known labels](/docs/reference/labels-annotations-taints/) that are created and populated automatically on most clusters.

## Spread Constraints for Pods

### API

The API field `pod.spec.topologySpreadConstraints` is defined as below:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  topologySpreadConstraints:
    - maxSkew: <integer>
      minDomains: <integer>
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
```

You can define one or multiple `topologySpreadConstraint` to instruct the kube-scheduler how to place each incoming Pod in relation to the existing Pods across your cluster. The fields are:

- **maxSkew** describes the degree to which Pods may be unevenly distributed.
  It must be greater than zero. Its semantics differs according to the value of `whenUnsatisfiable`:

  - when `whenUnsatisfiable` equals to "DoNotSchedule", `maxSkew` is the maximum
    permitted difference between the number of matching pods in the target
    topology and the global minimum
    (the minimum number of pods that match the label selector in a topology domain.
    For example, if you have 3 zones with 0, 2 and 3 matching pods respectively,
    The global minimum is 0).
  - when `whenUnsatisfiable` equals to "ScheduleAnyway", scheduler gives higher
    precedence to topologies that would help reduce the skew.

- **minDomains** indicates a minimum number of eligible domains.
  A domain is a particular instance of a topology. An eligible domain is a domain whose
  nodes match the node selector.

  - The value of `minDomains` must be greater than 0, when specified.
  - When the number of eligible domains with match topology keys is less than `minDomains`,
    Pod topology spread treats "global minimum" as 0, and then the calculation of `skew` is performed.
    The "global minimum" is the minimum number of matching Pods in an eligible domain,
    or zero if the number of eligible domains is less than `minDomains`.
  - When the number of eligible domains with matching topology keys equals or is greater than 
    `minDomains`, this value has no effect on scheduling.
  - When `minDomains` is nil, the constraint behaves as if `minDomains` is 1.
  - When `minDomains` is not nil, the value of `whenUnsatisfiable` must be "`DoNotSchedule`".

  {{< note >}}
  The `minDomains` field is an alpha field added in 1.24. You have to enable the
  `MinDomainsInPodToplogySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  in order to use it.
  {{< /note >}}

- **topologyKey** is the key of node labels. If two Nodes are labelled with this key and have identical values for that label, the scheduler treats both Nodes as being in the same topology. The scheduler tries to place a balanced number of Pods into each topology domain.

- **whenUnsatisfiable** indicates how to deal with a Pod if it doesn't satisfy the spread constraint:
  - `DoNotSchedule` (default) tells the scheduler not to schedule it.
  - `ScheduleAnyway` tells the scheduler to still schedule it while prioritizing nodes that minimize the skew.

- **labelSelector** is used to find matching Pods. Pods that match this label selector are counted to determine the number of Pods in their corresponding topology domain. See [Label Selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) for more details.

When a Pod defines more than one `topologySpreadConstraint`, those constraints are ANDed: The kube-scheduler looks for a node for the incoming Pod that satisfies all the constraints.

You can read more about this field by running `kubectl explain Pod.spec.topologySpreadConstraints`.

### Example: One TopologySpreadConstraint

Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

If we want an incoming Pod to be evenly spread with existing Pods across zones, the spec can be given as:

{{< codenew file="pods/topology-spread-constraints/one-constraint.yaml" >}}

`topologyKey: zone` implies the even distribution will only be applied to the nodes which have label pair "zone:&lt;any value&gt;" present. `whenUnsatisfiable: DoNotSchedule` tells the scheduler to let it stay pending if the incoming Pod can't satisfy the constraint.

If the scheduler placed this incoming Pod into "zoneA", the Pods distribution would become [3, 1], hence the actual skew is 2 (3 - 1) - which violates `maxSkew: 1`. In this example, the incoming Pod can only be placed into "zoneB":

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

OR

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n3
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

You can tweak the Pod spec to meet various kinds of requirements:

- Change `maxSkew` to a bigger value like "2" so that the incoming Pod can be placed into "zoneA" as well.
- Change `topologyKey` to "node" so as to distribute the Pods evenly across nodes instead of zones. In the above example, if `maxSkew` remains "1", the incoming Pod can only be placed onto "node4".
- Change `whenUnsatisfiable: DoNotSchedule` to `whenUnsatisfiable: ScheduleAnyway` to ensure the incoming Pod to be always schedulable (suppose other scheduling APIs are satisfied). However, it's preferred to be placed onto the topology domain which has fewer matching Pods. (Be aware that this preferability is jointly normalized with other internal scheduling priorities like resource usage ratio, etc.)

### Example: Multiple TopologySpreadConstraints

This builds upon the previous example. Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

You can use 2 TopologySpreadConstraints to control the Pods spreading on both zone and node:

{{< codenew file="pods/topology-spread-constraints/two-constraints.yaml" >}}

In this case, to match the first constraint, the incoming Pod can only be placed into "zoneB"; while in terms of the second constraint, the incoming Pod can only be placed onto "node4". Then the results of 2 constraints are ANDed, so the only viable option is to place on "node4".

Multiple constraints can lead to conflicts. Suppose you have a 3-node cluster across 2 zones:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p4(Pod) --> n3(Node3)
        p5(Pod) --> n3
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n1
        p3(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3,p4,p5 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

If you apply "two-constraints.yaml" to this cluster, you will notice "mypod" stays in `Pending` state. This is because: to satisfy the first constraint, "mypod" can only placed into "zoneB"; while in terms of the second constraint, "mypod" can only be placed onto "node2". Then a joint result of "zoneB" and "node2" returns nothing.

To overcome this situation, you can either increase the `maxSkew` or modify one of the constraints to use `whenUnsatisfiable: ScheduleAnyway`.

### Interaction With Node Affinity and Node Selectors

The scheduler will skip the non-matching nodes from the skew calculations if the incoming Pod has `spec.nodeSelector` or `spec.affinity.nodeAffinity` defined.

### Example: TopologySpreadConstraints with NodeAffinity

Suppose you have a 5-node cluster ranging from zoneA to zoneC:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n1,n2,n3,n4,p1,p2,p3 k8s;
class p4 plain;
class zoneA,zoneB cluster;
{{< /mermaid >}}

{{<mermaid>}}
graph BT
    subgraph "zoneC"
        n5(Node5)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n5 k8s;
class zoneC cluster;
{{< /mermaid >}}

and you know that "zoneC" must be excluded. In this case, you can compose the yaml as below, so that "mypod" will be placed into "zoneB" instead of "zoneC". Similarly `spec.nodeSelector` is also respected.

{{< codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" >}}

The scheduler doesn't have prior knowledge of all the zones or other topology domains that a cluster has. They are determined from the existing nodes in the cluster. This could lead to a problem in autoscaled clusters, when a node pool (or node group) is scaled to zero nodes and the user is expecting them to scale up, because, in this case, those topology domains won't be considered until there is at least one node in them.

### Other Noticeable Semantics

There are some implicit conventions worth noting here:

- Only the Pods holding the same namespace as the incoming Pod can be matching candidates.

- The scheduler will bypass the nodes without `topologySpreadConstraints[*].topologyKey` present. This implies that:

  1. the Pods located on those nodes do not impact `maxSkew` calculation - in the above example, suppose "node1" does not have label "zone", then the 2 Pods will be disregarded, hence the incoming Pod will be scheduled into "zoneA".
  2. the incoming Pod has no chances to be scheduled onto such nodes - in the above example, suppose a "node5" carrying label `{zone-typo: zoneC}` joins the cluster, it will be bypassed due to the absence of label key "zone".

- Be aware of what will happen if the incoming Pod's `topologySpreadConstraints[*].labelSelector` doesn't match its own labels. In the above example, if we remove the incoming Pod's labels, it can still be placed into "zoneB" since the constraints are still satisfied. However, after the placement, the degree of imbalance of the cluster remains unchanged - it's still zoneA having 2 Pods which hold label {foo:bar}, and zoneB having 1 Pod which holds label {foo:bar}. So if this is not what you expect, we recommend the workload's `topologySpreadConstraints[*].labelSelector` to match its own labels.

### Cluster-level default constraints

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
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 1
              topologyKey: topology.kubernetes.io/zone
              whenUnsatisfiable: ScheduleAnyway
          defaultingType: List
```

{{< note >}}
[`SelectorSpread` plugin](/docs/reference/scheduling/config/#scheduling-plugins)
is disabled by default. It's recommended to use `PodTopologySpread` to achieve similar
behavior.
{{< /note >}}

#### Built-in default constraints {#internal-default-constraints}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

If you don't configure any cluster-level default constraints for pod topology spreading,
then kube-scheduler acts as if you specified the following default topology constraints:

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
is disabled by default.

{{< note >}}
The `PodTopologySpread` plugin does not score the nodes that don't have
the topology keys specified in the spreading constraints. This might result
in a different default behavior compared to the legacy `SelectorSpread` plugin when
using the default topology constraints.

If your nodes are not expected to have **both** `kubernetes.io/hostname` and
`topology.kubernetes.io/zone` labels set, define your own constraints
instead of using the Kubernetes defaults.
{{< /note >}}

If you don't want to use the default Pod spreading constraints for your cluster,
you can disable those defaults by setting `defaultingType` to `List` and leaving
empty `defaultConstraints` in the `PodTopologySpread` plugin configuration:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints: []
          defaultingType: List
```

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

- There's no guarantee that the constraints remain satisfied when Pods are removed. For example, scaling down a Deployment may result in imbalanced Pods distribution.
You can use [Descheduler](https://github.com/kubernetes-sigs/descheduler) to rebalance the Pods distribution.
- Pods matched on tainted nodes are respected. See [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)

## {{% heading "whatsnext" %}}

- [Blog: Introducing PodTopologySpread](/blog/2020/05/introducing-podtopologyspread/)
  explains `maxSkew` in details, as well as bringing up some advanced usage examples.
