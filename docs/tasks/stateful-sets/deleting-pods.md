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

In normal operation of a Stateful Set, there is **never** a need to force delete a Stateful Set pod. The Stateful Set controller is responsible for creating, scaling and deleting members of the Stateful Set. It tries to ensure that the specified number of pods from ordinal 0 through N-1 are alive and ready. Stateful Set also gives us the property that there is at any time at most one pod with a given identity running in a cluster. We will hereby refer to this as *at most one* semantics provided by a Stateful Set. (*TODO: Link to concept page.*)

Manual force deletion is a maintenance task that must be undertaken with caution. It has the potential to violate *at-most-one* semantics provided by Stateful Sets. Stateful Sets may be used to run distributed and clustered applications which have a need for a stable network identity and stable storage. These applications often have configuration which relies on a an ensemble of a fixed number of members with fixed identities. Having multiple members with the same identity can be disastrous and may lead to data loss (e.g. split brain scenario in quorum-based systems).  

### Deletion of Pods

#### Graceful Deletion

Graceful deletion may be performed using the following:

```shell
$ kubectl delete pods <pod>
```

For the above to lead to graceful termination, the pod **must** not specify a `pod.Spec.TerminationGracePeriodSeconds` of 0. The practice of setting a `pod.Spec.TerminationGracePeriodSeconds` of 0 seconds is unsafe and strongly discouraged for Stateful Set pods. Graceful deletion is safe and will ensure that the pod shuts down gracefully before the kubelet deletes the name from the apiserver (*TODO: link to http://kubernetes.io/docs/user-guide/pods/#termination-of-pods). 

 In order for Stateful Sets to provide *at most one* semantics, changes were made to the Node Controller in 1.5, (*TODO: Link to Node Controller behavior page.*) so that it never force deletes pods on unreachable nodes. When a node becomes unreachable for an extended period of time, we deem such a node as having been partitioned. The pods running on an unreachable node enter the 'Terminating' or 'Unknown' state eventually. Pods may also enter these states when the user attempts graceful deletion (*link to kubectl documentation*) of a pod on a partitioned node. The only ways in which a pod in such a state can be removed from the apiserver are as follows:
   * The node object is deleted (either by the user, or by the node controller).
   * The kubelet on the unresponsive node starts responding, kills the pod and removes the entry from the apiserver. 
   * Force deletion of the pod by the user.
   
As explained above, there are cases in which graceful deletion will be unable to remove a pod. In these cases, if you want the Stateful Set controller to create a replacement pod with the same identity, you may want to perform force deletion.

#### Force Deletion

Force deletions do **not** wait for confirmation from the kubelet that the pod has been terminated. Irrespective of whether a force deletion is successful in killing a pod, it will immediately free up the name from the apiserver. This would let the Stateful Set controller create a replacement pod with that same identity. However, the risks of doing so must be evident. If there is a pod running on a node that has been partitioned from the apiserver, it may still be able to communicate with other pods in the Stateful Set. Force deletion of a Stateful Set pod is a user's assertion that the pod in question is "fenced" and its name can be safely freed up for a replacement to be created. 

If you want to delete a pod forcibly, do the following.

```shell
$ kubectl delete pods <pod> --grace-period=0
```

It is recommended that any force deletion of Stateful Set pods be performed carefully and with complete knowledge of the risks involved.

{% endcapture %}

{% capture whatsnext %}
Learn more about debugging a Stateful Set. *TODO: Link to the task for debugging a Stateful Set*
{% endcapture %}

{% include templates/task.md %}
