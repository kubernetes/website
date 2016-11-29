---
assignees:
- bprashanth
- erictune
- foxish
- smarterclayton

---

{% capture overview %}
This page shows how to delete pods which are part of a stateful set, and explains the various considerations when doing so.
{% endcapture %}

{% capture prerequisites %}

* If you are not using Stateful Sets, you can skip this task now. 
* This is a fairly advanced task and has the potential to violate some properties provided by Stateful Sets.
* If you are attempting this, you must be well aware of the various considerations enumerated below, and have specific domain knowledge of the application(s) running using Stateful Set.

{% endcapture %}

{% capture steps %}


### Stateful Set considerations

In normal operation of a Stateful Set, there is **never** a need to force delete a Stateful Set pod. The Stateful Set controller is responsible for creating, scaling and deleting members of the Stateful Set. It tries to ensure that the specified number of Pods from ordinal 0 through N-1 are alive and ready. Stateful Set also gives us the property that there is at any time at most one pod with a given identity running in a cluster. This is  referred to as *at most one* semantics provided by a Stateful Set. (*TODO: Link to concept page.*)

Manual force deletion is a maintenance task that must be undertaken with caution. It has the potential to violate *at most one* semantics provided by Stateful Sets. Stateful Sets may be used to run distributed and clustered applications which have a need for a stable network identity and stable storage. These applications often have configuration which relies on an ensemble of a fixed number of members with fixed identities. Having multiple members with the same identity can be disastrous and may lead to data loss (e.g. split brain scenario in quorum-based systems).  

### Deletion of Pods

#### Graceful Deletion

Graceful deletion may be performed using the following:

```shell
$ kubectl delete pods <pod>
```

For the above to lead to graceful termination, the pod **must not** specify a `pod.Spec.TerminationGracePeriodSeconds` of 0. The practice of setting a `pod.Spec.TerminationGracePeriodSeconds` of 0 seconds is unsafe and strongly discouraged for Stateful Set Pods. Graceful deletion is safe and will ensure that the [Pod shuts down gracefully](/docs/user-guide/pods/#termination-of-pods) before the kubelet deletes the name from the apiserver. 

Kubernetes (versions 1.5 or newer) will not delete Pods just because a Node is unreachable. The Pods running on an unreachable Node enter the 'Terminating' or 'Unknown' state eventually. Pods may also enter these states when the user attempts graceful deletion (*link to kubectl documentation*) of a pod on an unreachable Node. The only ways in which a pod in such a state can be removed from the apiserver are as follows:
   * The Node object is deleted (either by the user, or by the node controller).
   * The kubelet on the unresponsive Node starts responding, kills the Pod and removes the entry from the apiserver. 
   * Force deletion of the pod by the user.
   
It is preferred to use the first or second approaches. If a Node is confirmed to be dead (e.g. permanently disconnected from the network, powered down, etc) then the node object should be deleted. If the node is suffering from a network partition, then try to resolve this or wait for it to resolve. When the partition heals, the kubelet will complete the deletion of the pod and free up its name in the apiserver. 

Normally, the system completes the deletion once the Pod is no longer running on a Node, or the Node is deleted by an administrator. You may override this by force deleting the pod.

#### Force Deletion

Force deletions do **not** wait for confirmation from the kubelet that the pod has been terminated. Irrespective of whether a force deletion is successful in killing a pod, it will immediately free up the name from the apiserver. This would let the Stateful Set controller create a replacement pod with that same identity. However, the risks of doing so must be evident. If there is a pod running on a Node that has been partitioned from the apiserver, it may still be able to communicate with other Pods in the Stateful Set. Force deletion of a Stateful Set Pod is a user's assertion that the Pod in question will never again make contact with other Pods in the Set and its name can be safely freed up for a replacement to be created. 

If you want to delete a Pod forcibly, do the following.

```shell
$ kubectl delete pods <pod> --grace-period=0
```

Always perform force deletion of Stateful Set Pods carefully and with complete knowledge of the risks involved.

{% endcapture %}

{% capture whatsnext %}
Learn more about debugging a Stateful Set. *TODO: Link to the task for debugging a Stateful Set*
{% endcapture %}

{% include templates/task.md %}
