---
reviewers:
- bsalamat
title: Scheduler Performance Tuning
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

{{< feature-state for_k8s_version="1.12" >}}

Kube-scheduler is the Kubernetes default scheduler. It is responsible for
placement of Pods on Nodes in a cluster. Nodes in a cluster that meet the
scheduling requirements of a Pod are called "feasible" Nodes for the Pod. The
scheduler finds feasible Nodes for a Pod and then runs a set of functions to
score the feasible Nodes and picks a Node with the highest score among the
feasible ones to run the Pod. The scheduler then notifies the API server about this
decision in a process called "Binding".

{{% /capture %}}

{{% capture body %}}

## Percentage of Nodes to Score

Before Kubernetes 1.12, Kube-scheduler used to check the feasibility of all the
nodes in a cluster and then scored the feasible ones. Kubernetes 1.12 has a new
feature that allows the scheduler to stop looking for more feasible nodes once
it finds a certain number of them. This improves the scheduler's performance in
large clusters. The number is specified as a percentage of the cluster size and
is controlled by a configuration option called `percentageOfNodesToScore`. The
range should be between 1 and 100. Other values are considered as 100%. The
default value of this option is 50%. A cluster administrator can change this value by providing a
different value in the scheduler configuration. However, it may not be necessary to change this value.

```yaml
apiVersion: componentconfig/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

percentageOfNodesToScore: 50
```

{{< note >}}
In clusters with zero or less than 50 feasible nodes, the
scheduler still checks all the nodes, simply because there are not enough
feasible nodes to stop the scheduler's search early.
{{< /note >}}

**To disable this feature**, you can set `percentageOfNodesToScore` to 100.

### Tuning percentageOfNodesToScore

`percentageOfNodesToScore` must be a value between 1 and 100
with the default value of 50. There is also a hardcoded minimum value of 50
nodes which is applied internally. The scheduler tries to find at
least 50 nodes regardless of the value of `percentageOfNodesToScore`. This means
that changing this option to lower values in clusters with several hundred nodes
will not have much impact on the number of feasible nodes that the scheduler
tries to find. This is intentional as this option is unlikely to improve
performance noticeably in smaller clusters. In large clusters with over a 1000
nodes setting this value to lower numbers may show a noticeable performance
improvement.

An important note to consider when setting this value is that when a smaller
number of nodes in a cluster are checked for feasibility, some nodes are not
sent to be scored for a given Pod. As a result, a Node which could possibly
score a higher value for running the given Pod might not even be passed to the
scoring phase. This would result in a less than ideal placement of the Pod. For
this reason, the value should not be set to very low percentages. A general rule
of thumb is to never set the value to anything lower than 30. Lower values
should be used only when the scheduler's throughput is critical for your
application and the score of nodes is not important. In other words, you prefer
to run the Pod on any Node as long as it is feasible.

It is not recommended to lower this value from its default if your cluster has
only several hundred Nodes. It is unlikely to improve the scheduler's
performance significantly.

### How the scheduler iterates over Nodes

This section is intended for those who want to understand the internal details
of this feature.

In order to give all the Nodes in a cluster a fair chance of being considered
for running Pods, the scheduler iterates over the nodes in a round robin
fashion. You can imagine that Nodes are in an array. The scheduler starts from
the start of the array and checks feasibility of the nodes until it finds enough
Nodes as specified by `percentageOfNodesToScore`. For the next Pod, the
scheduler continues from the point in the Node array that it stopped at when checking
feasibility of Nodes for the previous Pod.

If Nodes are in multiple zones, the scheduler iterates over Nodes in various
zones to ensure that Nodes from different zones are considered in the
feasibility checks. As an example, consider six nodes in two zones:

```
Zone 1: Node 1, Node 2, Node 3, Node 4
Zone 2: Node 5, Node 6
```

The Scheduler evaluates feasibility of the nodes in this order:

```
Node 1, Node 5, Node 2, Node 6, Node 3, Node 4
```

After going over all the Nodes, it goes back to Node 1.

{{% /capture %}}
