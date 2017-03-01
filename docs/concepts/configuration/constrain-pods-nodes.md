---
assignees:
- davidopp
- kevin-wangzefeng
title: Constraining Pods to Run on Certain Nodes
---

{% capture overview %}

You can constrain a Pod to be able to run only on particular
[nodes](/docs/admin/node/) or to prefer to run on particular nodes. There are
several ways to do this, and they all use
[label selectors](/docs/user-guide/labels/).
Generally such constraints are unnecessary, as the scheduler automatically does
a reasonable placement. For example, the scheduler spreads your Pods across nodes
and refrains from placing Pods on nodes that have insufficient free resources.
But there are some circumstances where you might want more control of where a Pod
lands. For example, you might want to ensure that a Pod ends up on a machine with
an SSD attached to it. Or if two different services communicate with each other, you
might want to locate the Pods for both services in the same availability zone.

{% endcapture %}

{% capture body %}

## Using the nodeSelector field

The simplest constraint is the `nodeSelector` field of a PodSpec. It
specifies a map of key-value pairs. For the Pod to be eligible to run on a node,
the node must have each of the specified key-value pairs as labels. It can have
additional labels as well. The most common case is to use a single key-value pair.

Here's a Pod configuration file that has a `nodeSelector` field:

{% include code.html language="yaml" file="pod-node-selector.yaml" ghlink="/docs/concepts/configuration/pod-node-selector.yaml" %}

In the configuration file you can see that the Pod will get scheduled on a node that
has the label `disktype: ssd`.

## Affinity

The affinity feature greatly expands the types of constraints you can
express. As of Kubernetes version 1.5, affinity is an alpha feature.
The key enhancements are:

* The language is more expressive than the `nodeSelector` field.

* You can specify that the rule is soft preference rather than a hard requirement,
so if the scheduler can't satisfy the rule, the Pod is still scheduled.

* You can constrain against labels on other Pods running on the node or another
topological domain. This allows for rules that specify which Pods can and cannot
be co-located.

The affinity feature consists of two types of affinity:

* _node affinity_
* _inter-pod affinity_, _inter-pod anti-affinity_

Using node affinity is similar to the using the `nodeSelector` field, but
node affinity is more expressive and allows soft preferences.

Inter-pod affinity and anti-affinity constrain against Pod labels rather than
node labels.

### Node affinity

Node affinity is conceptually similar to `nodeSelector`. It allows you to
specify which nodes your Pod is eligible to run on, based on labels on the node.

There are two types of node affinity:

* `requiredDuringSchedulingIgnoredDuringExecution`
* `preferredDuringSchedulingIgnoredDuringExecution`

You can think of them as hard and soft respectively. The former specifies rules
that must be met for a Pod to be scheduled on a node, while the latter specifies
preferences that the scheduler tries to enforce but does not guarantee.

The `IgnoredDuringExecution` part of the names means that if labels on a node
change at runtime such that the affinity rules on a Pod are no longer met, the
Pod will still continue to run on the node.

An example of when you would use `requiredDuringSchedulingIgnoredDuringExecution` is
"Only run the Pod on nodes that have Intel CPUs." An example of when you would use
`preferredDuringSchedulingIgnoredDuringExecution` is "Try to run this set of Pods in
availability zone XYZ, but if it's not possible, then allow some to run elsewhere".

Here's an example of a Pod that uses node affinity:

{% include code.html language="yaml" file="pod-with-node-affinity.yaml" ghlink="/docs/concepts/configuration/pod-with-node-affinity.yaml" %}

This node affinity rule says the Pod can be placed on a node only if the node
has a label whose key is `kubernetes.io/e2e-az-name` and whose value is either
`e2e-az1` or `e2e-az2`. In addition, among nodes that meet that criteria, nodes
with the label `another-annotation-key: another-annotation-value` are preferred.

You can see the operator `In` being used in the example. The node affinity syntax
supports the following operators: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`,
and `Lt`. There is no explicit node anti-affinity feature, but `NotIn` and
`DoesNotExist` give that behavior.

If you specify both `nodeSelector` and `nodeAffinity`, both must be satisfied
for the Pod to be scheduled on a candidate node.

For more information on node affinity, see the
[Node affinity and NodeSelector](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/nodeaffinity.md).

### Inter-Pod affinity and anti-affinity

Inter-Pod affinity and anti-affinity were introduced in Kubernetes 1.4.
Inter-Pod affinity and anti-affinity allow you to constrain where your Pods can
run based on existing Pod labels. This is in contrast to basing the constraint
on node labels.

The rules take these forms:

* This Pod should run on node N only if node N is already running a Pod that meets rule R.

* This Pod should not run on node N if node N is already running a Pod that meets rule R.

The rule R is expressed as a `labelSelector` with an associated list of namespaces.

Here's an example of a Pod that uses inter-Pod affinity:

{% include code.html language="yaml" file="pod-with-pod-affinity.yaml" ghlink="/docs/concepts/configuration/pod-with-pod-affinity.yaml" %}

The `affinity` annotation on this Pod defines one Pod affinity rule and one Pod
anti-affinity rule. Both must be satisfied for the Pod to be scheduled on a node.

The Pod affinity rule says that the Pod can be scheduled on a node only if both
of the following are true:

* The node is in the same zone as at least one already-running Pod.

* The already-running Pod has the label `security: S1`.

More precisely, the Pod is eligible to run on node N only if all of the
following are true:

* Node N has a label with key `failure-domain.beta.kubernetes.io/zone` and some value V.

* There is at least one node N2 in the cluster with key `failure-domain.beta.kubernetes.io/zone`
and the same value V.

* Node N2 is running a Pod that has a label with key `security` and value `S1`.

The Pod anti-affinity rule says that the Pod cannot be scheduled on a node if
the node is already running a Pod with label `security: S2`.

For more examples of Pod affinity, see
[Inter-pod topological affinity and anti-affinity](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/podaffinity.md).

**Note**: Kubernetes uses node labels with key `topologyKey` to specify topology
domains like rack, cloud provider zone, and cloud provider region.

As with node affinity, the legal operators for Pod affinity and anti-affinity are
`In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, and `Lt`.

In principle, `topologyKey` can be any legal label value. However, for performance
reasons, only a limited set of topology keys are allowed. They are specified in
the `--failure-domain` command-line argument to the scheduler. By default the
allowed topology keys are:

* `kubernetes.io/hostname`
* `failure-domain.beta.kubernetes.io/zone`
* `failure-domain.beta.kubernetes.io/region`

In addition to `labelSelector` and `topologyKey`, you can optionally specify a
`namespaces` list that the `labelSelector` should match against.
This goes at the same level as `labelSelector` and `topologyKey`.

If omitted, `namespaces` defaults to the namespace of the Pod where the
affinity/anti-affinity definition appears. If `namespaces` is defined but empty,
it means “all namespaces.”

All `matchExpressions` associated with `requiredDuringSchedulingIgnoredDuringExecution`
affinity and anti-affinity must be satisfied for the Pod to be scheduled on a node.

## Future development

Node affinity is expressed using an annotation on Pod. After the feature goes to GA it,
will use a field of Pod.

In the future we plan to offer
`requiredDuringSchedulingRequiredDuringExecution` which will be just like `requiredDuringSchedulingIgnoredDuringExecution`
except that it will evict Pods from nodes that cease to satisfy the Pods' node affinity requirements.

{% endcapture %}


{% capture whatsnext %}

Get hands-on experience
[assigning Pods to nodes](/docs/tasks/administer-cluster/assign-pods-nodes/).

See
[Inter-pod topological affinity and anti-affinity](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/podaffinity.md).

{% endcapture %}

{% include templates/concept.md %}

