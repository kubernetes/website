---
title: PodDisruptionBudget controller
content_template: templates/concept
---

{{% capture overview %}}

The PodDisruptionBudget controller implements managed control over disruptions
to applications running on your cluster.

{{% /capture %}}

{{% capture body %}}

The PodDisruptionBudget controller is built in to kube-controller-manager.

## Controller behavior

Where a PodDisruptionBudget matches a label selector, the PodDisruptionBudget
controller finds the resource that manages those Pods (eg a Deployment) and
sets either `maxUnavailable` or `minAvailable` for the managing resource
(for the example, that means the Deployment object).


### Pod disruption budgets for custom resources
The PodDisruptionBudget controller has special behaviour if managing
Deployment, ReplicationController, ReplicaSet, and StatefulSet, when the PDB
selector matching the PodDisruptionBudget’s selector.

You can use a PDB with pods controlled by another type of controller, by an “operator”,
or bare pods. In that case, the PodDisruptionBudget controller requires that
that you have set `.spec.minAvailable` to an integer value. You can't use
percentages or set `.spec.maxUnavailable`.

You can use a selector which selects a subset or superset of the pods
belonging to a built-in controller. However, when there are multiple
PDBs in a namespace, you must be careful not to create PDBs whose
selectors overlap.

{{% /capture %}}
{{% capture whatsnext %}}

* Read about the [scale subresource](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource)

{{% /capture %}}
