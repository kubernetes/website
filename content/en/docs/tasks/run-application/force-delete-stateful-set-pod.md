---
reviewers:
- bprashanth
- erictune
- foxish
- smarterclayton
title: Force Delete StatefulSet Pods
content_type: task
weight: 70
---

<!-- overview -->
This page shows how to delete Pods which are part of a {{< glossary_tooltip text="stateful set" term_id="StatefulSet" >}}, and explains the considerations to keep in mind when doing so.


## {{% heading "prerequisites" %}}


* This is a fairly advanced task and has the potential to violate some of the properties inherent to StatefulSet.
* Before proceeding, make yourself familiar with the considerations enumerated below.



<!-- steps -->

## StatefulSet considerations

In normal operation of a StatefulSet, there is **never** a need to force delete a StatefulSet Pod. The [StatefulSet controller](/docs/concepts/workloads/controllers/statefulset/) is responsible for creating, scaling and deleting members of the StatefulSet. It tries to ensure that the specified number of Pods from ordinal 0 through N-1 are alive and ready. StatefulSet ensures that, at any time, there is at most one Pod with a given identity running in a cluster. This is referred to as *at most one* semantics provided by a StatefulSet.

Manual force deletion should be undertaken with caution, as it has the potential to violate the at most one semantics inherent to StatefulSet. StatefulSets may be used to run distributed and clustered applications which have a need for a stable network identity and stable storage. These applications often have configuration which relies on an ensemble of a fixed number of members with fixed identities. Having multiple members with the same identity can be disastrous and may lead to data loss (e.g. split brain scenario in quorum-based systems).

## Delete Pods

You can perform a graceful pod deletion with the following command:

```shell
kubectl delete pods <pod>
```

For the above to lead to graceful termination, the Pod **must not** specify a
`pod.Spec.TerminationGracePeriodSeconds` of 0. The practice of setting a
`pod.Spec.TerminationGracePeriodSeconds` of 0 seconds is unsafe and strongly discouraged
for StatefulSet Pods. Graceful deletion is safe and will ensure that the Pod
[shuts down gracefully](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
before the kubelet deletes the name from the apiserver.

A Pod is not deleted automatically when a node is unreachable.
The Pods running on an unreachable Node enter the 'Terminating' or 'Unknown' state after a
[timeout](/docs/concepts/architecture/nodes/#condition).
Pods may also enter these states when the user attempts graceful deletion of a Pod
on an unreachable Node.
The only ways in which a Pod in such a state can be removed from the apiserver are as follows:

* The Node object is deleted (either by you, or by the [Node Controller](/docs/concepts/architecture/nodes/)).
* The kubelet on the unresponsive Node starts responding, kills the Pod and removes the entry from the apiserver.
* Force deletion of the Pod by the user.

The recommended best practice is to use the first or second approach. If a Node is confirmed to be dead (e.g. permanently disconnected from the network, powered down, etc), then delete the Node object. If the Node is suffering from a network partition, then try to resolve this or wait for it to resolve. When the partition heals, the kubelet will complete the deletion of the Pod and free up its name in the apiserver.

Normally, the system completes the deletion once the Pod is no longer running on a Node, or the Node is deleted by an administrator. You may override this by force deleting the Pod.

### Force Deletion

Force deletions **do not** wait for confirmation from the kubelet that the Pod has been terminated. Irrespective of whether a force deletion is successful in killing a Pod, it will immediately free up the name from the apiserver. This would let the StatefulSet controller create a replacement Pod with that same identity; this can lead to the duplication of a still-running Pod, and if said Pod can still communicate with the other members of the StatefulSet, will violate the at most one semantics that StatefulSet is designed to guarantee.

When you force delete a StatefulSet pod, you are asserting that the Pod in question will never again make contact with other Pods in the StatefulSet and its name can be safely freed up for a replacement to be created.

If you want to delete a Pod forcibly using kubectl version >= 1.5, do the following:

```shell
kubectl delete pods <pod> --grace-period=0 --force
```

If you're using any version of kubectl <= 1.4, you should omit the `--force` option and use:

```shell
kubectl delete pods <pod> --grace-period=0
```

If even after these commands the pod is stuck on `Unknown` state, use the following command to remove the pod from the cluster:

```shell
kubectl patch pod <pod> -p '{"metadata":{"finalizers":null}}'
```

Always perform force deletion of StatefulSet Pods carefully and with complete knowledge of the risks involved.



## {{% heading "whatsnext" %}}


Learn more about [debugging a StatefulSet](/docs/tasks/debug-application-cluster/debug-stateful-set/).


