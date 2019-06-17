---
reviewers:
- davidopp
- wojtek-t
title: Pod Priority and Preemption
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

{{< feature-state for_k8s_version="1.14" state="stable" >}}

[Pods](/docs/user-guide/pods) can have _priority_. Priority indicates the
importance of a Pod relative to other Pods. If a Pod cannot be scheduled, the
scheduler tries to preempt (evict) lower priority Pods to make scheduling of the
pending Pod possible.

In Kubernetes 1.9 and later, Priority also affects scheduling order of Pods and
out-of-resource eviction ordering on the Node.

Pod priority and preemption graduated to beta in Kubernetes 1.11 and to GA in
Kubernetes 1.14. They have been enabled by default since 1.11.

In Kubernetes versions where Pod priority and preemption is still an alpha-level
feature, you need to explicitly enable it. To use these features in the older
versions of Kubernetes, follow the instructions in the documentation for your
Kubernetes version, by going to the documentation archive version for your
Kubernetes version.

Kubernetes Version | Priority and Preemption State | Enabled by default
------------------ | :---------------------------: | :----------------:
1.8                | alpha                         | no
1.9                | alpha                         | no
1.10               | alpha                         | no
1.11               | beta                          | yes
1.14               | stable                        | yes

{{< warning >}}In a cluster where not all users are trusted, a
malicious user could create pods at the highest possible priorities, causing
other pods to be evicted/not get scheduled. To resolve this issue,
[ResourceQuota](/docs/concepts/policy/resource-quotas/) is
augmented to support Pod priority. An admin can create ResourceQuota for users
at specific priority levels, preventing them from creating pods at high
priorities. This feature is in beta since Kubernetes 1.12.
{{< /warning >}}

{{% /capture %}}

{{% capture body %}}

## How to use priority and preemption

To use priority and preemption in Kubernetes 1.11 and later, follow these steps:

1.  Add one or more [PriorityClasses](#priorityclass).

1.  Create Pods with[`priorityClassName`](#pod-priority) set to one of the added
    PriorityClasses. Of course you do not need to create the Pods directly;
    normally you would add `priorityClassName` to the Pod template of a
    collection object like a Deployment.

Keep reading for more information about these steps.

If you try the feature and then decide to disable it, you must remove the
PodPriority command-line flag or set it to `false`, and then restart the API
server and scheduler. After the feature is disabled, the existing Pods keep
their priority fields, but preemption is disabled, and priority fields are
ignored. If the feature is disabled, you cannot set `priorityClassName` in new
Pods.

## How to disable preemption

{{< note >}}
In Kubernetes 1.12+, critical pods rely on scheduler preemption to be scheduled
when a cluster is under resource pressure. For this reason, it is not
recommended to disable preemption.
{{< /note >}}

{{< note >}}
In Kubernetes 1.15 and later,
if the feature `NonPreemptingPriority` is enabled,
PriorityClasses have the option to set `preemptionPolicy: Never`.
This will prevent pods of that PriorityClass from preempting other pods.
{{< /note >}}

In Kubernetes 1.11 and later, preemption is controlled by a kube-scheduler flag
`disablePreemption`, which is set to `false` by default.
If you want to disable preemption despite the above note, you can set
`disablePreemption` to `true`.

This option is available in component configs only and is not available in
old-style command line options. Below is a sample component config to disable
preemption:

```yaml
apiVersion: componentconfig/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

disablePreemption: true
```

## PriorityClass

A PriorityClass is a non-namespaced object that defines a mapping from a
priority class name to the integer value of the priority. The name is specified
in the `name` field of the PriorityClass object's metadata. The value is
specified in the required `value` field. The higher the value, the higher the
priority.

A PriorityClass object can have any 32-bit integer value smaller than or equal
to 1 billion. Larger numbers are reserved for critical system Pods that should
not normally be preempted or evicted. A cluster admin should create one
PriorityClass object for each such mapping that they want.

PriorityClass also has two optional fields: `globalDefault` and `description`.
The `globalDefault` field indicates that the value of this PriorityClass should
be used for Pods without a `priorityClassName`. Only one PriorityClass with
`globalDefault` set to true can exist in the system. If there is no
PriorityClass with `globalDefault` set, the priority of Pods with no
`priorityClassName` is zero.

The `description` field is an arbitrary string. It is meant to tell users of the
cluster when they should use this PriorityClass.

### Notes about PodPriority and existing clusters

-   If you upgrade your existing cluster and enable this feature, the priority
    of your existing Pods is effectively zero.

-   Addition of a PriorityClass with `globalDefault` set to `true` does not
    change the priorities of existing Pods. The value of such a PriorityClass is
    used only for Pods created after the PriorityClass is added.

-   If you delete a PriorityClass, existing Pods that use the name of the
    deleted PriorityClass remain unchanged, but you cannot create more Pods that
    use the name of the deleted PriorityClass.

### Example PriorityClass

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class should be used for XYZ service pods only."
```

### Non-preempting PriorityClasses (alpha) {#non-preempting-priority-class}

1.15 adds the `PreemptionPolicy` field as an alpha feature.
It is disabled by default in 1.15,
and requires the `NonPreemptingPriority`[feature gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/
) to be enabled.

Pods with `PreemptionPolicy: Never` will be placed in the scheduling queue
ahead of lower-priority pods,
but they cannot preempt other pods.
A non-preempting pod waiting to be scheduled will stay in the scheduling queue,
until sufficient resources are free,
and it can be scheduled.
Non-preempting pods,
like other pods,
are subject to scheduler back-off.
This means that if the scheduler tries these pods and they cannot be scheduled,
they will be retried with lower frequency,
allowing other pods with lower priority to be scheduled before them.

Non-preempting pods may still be preempted by other,
high-priority pods.

`PreemptionPolicy` defaults to `PreemptLowerPriority`,
which will allow pods of that PriorityClass to preempt lower-priority pods
(as is existing default behavior).
If `PreemptionPolicy` is set to `Never`,
pods in that PriorityClass will be non-preempting.

An example use case is for data science workloads.
A user may submit a job that they want to be prioritized above other workloads,
but do not wish to discard existing work by preempting running pods.
The high priority job with `PreemptionPolicy: Never` will be scheduled
ahead of other queued pods,
as soon as sufficient cluster resources "naturally" become free.

#### Example Non-preempting PriorityClass

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority-nonpreempting
value: 1000000
preemptionPolicy: Never
globalDefault: false
description: "This priority class will not cause other pods to be preempted."
```

## Pod priority

After you have one or more PriorityClasses, you can create Pods that specify one
of those PriorityClass names in their specifications. The priority admission
controller uses the `priorityClassName` field and populates the integer value of
the priority. If the priority class is not found, the Pod is rejected.

The following YAML is an example of a Pod configuration that uses the
PriorityClass created in the preceding example. The priority admission
controller checks the specification and resolves the priority of the Pod to
1000000.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  priorityClassName: high-priority
```

### Effect of Pod priority on scheduling order

In Kubernetes 1.9 and later, when Pod priority is enabled, scheduler orders
pending Pods by their priority and a pending Pod is placed ahead of other
pending Pods with lower priority in the scheduling queue. As a result, the
higher priority Pod may be scheduled sooner than Pods with lower priority if its
scheduling requirements are met. If such Pod cannot be scheduled, scheduler will
continue and tries to schedule other lower priority Pods.

## Preemption

When Pods are created, they go to a queue and wait to be scheduled. The
scheduler picks a Pod from the queue and tries to schedule it on a Node. If no
Node is found that satisfies all the specified requirements of the Pod,
preemption logic is triggered for the pending Pod. Let's call the pending Pod P.
Preemption logic tries to find a Node where removal of one or more Pods with
lower priority than P would enable P to be scheduled on that Node. If such a
Node is found, one or more lower priority Pods get evicted from the Node. After
the Pods are gone, P can be scheduled on the Node.

### User exposed information

When Pod P preempts one or more Pods on Node N, `nominatedNodeName` field of Pod
P's status is set to the name of Node N. This field helps scheduler track
resources reserved for Pod P and also gives users information about preemptions
in their clusters.

Please note that Pod P is not necessarily scheduled to the "nominated Node".
After victim Pods are preempted, they get their graceful termination period. If
another node becomes available while scheduler is waiting for the victim Pods to
terminate, scheduler will use the other node to schedule Pod P. As a result
`nominatedNodeName` and `nodeName` of Pod spec are not always the same. Also, if
scheduler preempts Pods on Node N, but then a higher priority Pod than Pod P
arrives, scheduler may give Node N to the new higher priority Pod. In such a
case, scheduler clears `nominatedNodeName` of Pod P. By doing this, scheduler
makes Pod P eligible to preempt Pods on another Node.

### Limitations of preemption

#### Graceful termination of preemption victims

When Pods are preempted, the victims get their
[graceful termination period](/docs/concepts/workloads/pods/pod/#termination-of-pods).
They have that much time to finish their work and exit. If they don't, they are
killed. This graceful termination period creates a time gap between the point
that the scheduler preempts Pods and the time when the pending Pod (P) can be
scheduled on the Node (N). In the meantime, the scheduler keeps scheduling other
pending Pods. As victims exit or get terminated, the scheduler tries to schedule
Pods in the pending queue. Therefore, there is usually a time gap between the
point that scheduler preempts victims and the time that Pod P is scheduled. In
order to minimize this gap, one can set graceful termination period of lower
priority Pods to zero or a small number.

#### PodDisruptionBudget is supported, but not guaranteed!

A [Pod Disruption Budget (PDB)](/docs/concepts/workloads/pods/disruptions/)
allows application owners to limit the number of Pods of a replicated application
that are down simultaneously from voluntary disruptions. Kubernetes 1.9 supports
PDB when preempting Pods, but respecting PDB is best effort. The Scheduler tries
to find victims whose PDB are not violated by preemption, but if no such victims
are found, preemption will still happen, and lower priority Pods will be removed
despite their PDBs being violated.

#### Inter-Pod affinity on lower-priority Pods

A Node is considered for preemption only when the answer to this question is
yes: "If all the Pods with lower priority than the pending Pod are removed from
the Node, can the pending Pod be scheduled on the Node?"

{{< note >}}
Preemption does not necessarily remove all lower-priority
Pods. If the pending Pod can be scheduled by removing fewer than all
lower-priority Pods, then only a portion of the lower-priority Pods are removed.
Even so, the answer to the preceding question must be yes. If the answer is no,
the Node is not considered for preemption.
{{< /note >}}

If a pending Pod has inter-pod affinity to one or more of the lower-priority
Pods on the Node, the inter-Pod affinity rule cannot be satisfied in the absence
of those lower-priority Pods. In this case, the scheduler does not preempt any
Pods on the Node. Instead, it looks for another Node. The scheduler might find a
suitable Node or it might not. There is no guarantee that the pending Pod can be
scheduled.

Our recommended solution for this problem is to create inter-Pod affinity only
towards equal or higher priority Pods.

#### Cross node preemption

Suppose a Node N is being considered for preemption so that a pending Pod P can
be scheduled on N. P might become feasible on N only if a Pod on another Node is
preempted. Here's an example:

*   Pod P is being considered for Node N.
*   Pod Q is running on another Node in the same Zone as Node N.
*   Pod P has Zone-wide anti-affinity with Pod Q (`topologyKey:
    failure-domain.beta.kubernetes.io/zone`).
*   There are no other cases of anti-affinity between Pod P and other Pods in
    the Zone.
*   In order to schedule Pod P on Node N, Pod Q can be preempted, but scheduler
    does not perform cross-node preemption. So, Pod P will be deemed
    unschedulable on Node N.

If Pod Q were removed from its Node, the Pod anti-affinity violation would be
gone, and Pod P could possibly be scheduled on Node N.

We may consider adding cross Node preemption in future versions if there is
enough demand and if we find an algorithm with reasonable performance.

## Debugging Pod Priority and Preemption

Pod Priority and Preemption is a major feature that could potentially disrupt
Pod scheduling if it has bugs.

### Potential problems caused by Priority and Preemption

The followings are some of the potential problems that could be caused by bugs
in the implementation of the feature. This list is not exhaustive.

#### Pods are preempted unnecessarily

Preemption removes existing Pods from a cluster under resource pressure to make
room for higher priority pending Pods. If a user gives high priorities to
certain Pods by mistake, these unintentional high priority Pods may cause
preemption in the cluster. As mentioned above, Pod priority is specified by
setting the `priorityClassName` field of `podSpec`. The integer value of
priority is then resolved and populated to the `priority` field of `podSpec`.

To resolve the problem, `priorityClassName` of the Pods must be changed to use
lower priority classes or should be left empty. Empty `priorityClassName` is
resolved to zero by default.

When a Pod is preempted, there will be events recorded for the preempted Pod.
Preemption should happen only when a cluster does not have enough resources for
a Pod. In such cases, preemption happens only when the priority of the pending
Pod (preemptor) is higher than the victim Pods. Preemption must not happen when
there is no pending Pod, or when the pending Pods have equal or lower priority
than the victims. If preemption happens in such scenarios, please file an issue.

#### Pods are preempted, but the preemptor is not scheduled

When pods are preempted, they receive their requested graceful termination
period, which is by default 30 seconds, but it can be any different value as
specified in the PodSpec. If the victim Pods do not terminate within this period,
they are force-terminated. Once all the victims go away, the preemptor Pod can
be scheduled.

While the preemptor Pod is waiting for the victims to go away, a higher priority
Pod may be created that fits on the same node. In this case, the scheduler will
schedule the higher priority Pod instead of the preemptor.

In the absence of such a higher priority Pod, we expect the preemptor Pod to be
scheduled after the graceful termination period of the victims is over.

#### Higher priority Pods are preempted before lower priority pods

The scheduler tries to find nodes that can run a pending Pod and if no node is
found, it tries to remove Pods with lower priority from one node to make room
for the pending pod. If a node with low priority Pods is not feasible to run the
pending Pod, the scheduler may choose another node with higher priority Pods
(compared to the Pods on the other node) for preemption. The victims must still
have lower priority than the preemptor Pod.

When there are multiple nodes available for preemption, the scheduler tries to
choose the node with a set of Pods with lowest priority. However, if such Pods
have PodDisruptionBudget that would be violated if they are preempted then the
scheduler may choose another node with higher priority Pods.

When multiple nodes exist for preemption and none of the above scenarios apply,
we expect the scheduler to choose a node with the lowest priority. If that is
not the case, it may indicate a bug in the scheduler.

## Interactions of Pod priority and QoS

Pod priority and
[QoS](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/node/resource-qos.md)
are two orthogonal features with few interactions and no default restrictions on
setting the priority of a Pod based on its QoS classes. The scheduler's
preemption logic does not consider QoS when choosing preemption targets.
Preemption considers Pod priority and attempts to choose a set of targets with
the lowest priority. Higher-priority Pods are considered for preemption only if
the removal of the lowest priority Pods is not sufficient to allow the scheduler
to schedule the preemptor Pod, or if the lowest priority Pods are protected by
`PodDisruptionBudget`.

The only component that considers both QoS and Pod priority is
[Kubelet out-of-resource eviction](/docs/tasks/administer-cluster/out-of-resource/).
The kubelet ranks Pods for eviction first by whether or not their usage of the
starved resource exceeds requests, then by Priority, and then by the consumption
of the starved compute resource relative to the Pods’ scheduling requests.
See
[Evicting end-user pods](/docs/tasks/administer-cluster/out-of-resource/#evicting-end-user-pods)
for more details. Kubelet out-of-resource eviction does not evict Pods whose
usage does not exceed their requests. If a Pod with lower priority is not
exceeding its requests, it won't be evicted. Another Pod with higher priority
that exceeds its requests may be evicted.

{{% /capture %}}
