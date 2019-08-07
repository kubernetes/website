---
title: ReplicaSet controller
content_template: templates/concept
---

{{% capture overview %}}

The ReplicaSet controller maintains a stable number of replica Pods for
each {{< glossary_tooltip text="ReplicaSet" term_id="replica-set" >}}.

{{% /capture %}}

{{% capture body %}}

The replicaset controller is built in to kube-controller-manager.

## Controller behaviour

The controller watches for ReplicaSet objects. For each ReplicaSet, this
controller adds or removes Pods so that the right number of Pods are running
for each ReplicaSet.

When you define a ReplicaSet you provide fields including a desired number of
replicas, a template for Pods that the controller should create, and a
{{< glossary_tooltip term_id="selector" >}} that the controller can use to find
the Pods it is managing.

If there are more Pods running for a ReplicaSet than the desired count, the
controller selects a Pod from the replica set and deletes it. If there are too
few replicas, the controller will create a new Pod based on the Pod template
for that ReplicaSet.

Pods for a ReplicaSet must have a
[restart policy](/docs/concepts/workloads/Pods/pod-lifecycle/#restart-policy)
of `Always`.

When the controller creates Pods, it sets the [metadata.ownerReferences](/docs/reference/controllers/garbage-collector/#owners-and-dependents) for each new Pod, so that the Pod is owned
by the ReplicaSet that is responsible for it existing.

The replica set controller uses the owner reference to track the Pods that it
is managing on behalf of a given ReplicaSet. When the controller finds a Pod
with no ownerReference set that matches the selector for a current ReplicaSet,
the replica set controller updates the Pod's ownerReference. The discovered
Pod becomes owned by the ReplicaSet.

If you update a ReplicaSet that has already created Pods with one template,
and change the pod template inside the ReplicaSet, existing Pods will stay
running and will continue to match the ReplicaSet's selector. If / when the
ReplicaSet controller creates new Pods, those new Pods will be based on the
updated selector and may well be different from the older Pods.

### Scaling

If you change the number of replicas for a ReplicaSet, the controller reacts
accordingly. It will add or remove Pods if necessary.

If the ReplicSet's replica count is unset, the controller defaults to running
a single Pod.

{{% /capture %}}
{{% capture whatsnext %}}

* Read about the [Deployment controller](/docs/reference/controllers/deployment/)

{{% /capture %}}
