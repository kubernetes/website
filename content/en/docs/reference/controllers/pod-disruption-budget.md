---
toc_hide: true
title: PodDisruptionBudget controller
content_template: templates/concept
---

{{% capture overview %}}

The PodDisruptionBudget {{< glossary_tooltip term_id="controller" text="controller" >}}
manages the level of disruption to workloads running on your cluster.

{{% /capture %}}

{{% capture body %}}

The PodDisruptionBudget controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

Where a PodDisruptionBudget matches a {{< glossary_tooltip term_id="label" >}}
selector, the PodDisruptionBudget controller finds the resource that manages
those Pods (eg a Deployment) and sets either `maxUnavailable` or `minAvailable`
for the managing resource (for the example, that means the Deployment object).

The PodDisruptionBudget controller has special behaviour if managing
Deployment, ReplicationController, ReplicaSet, and StatefulSet, when the PDB
selector matches the PodDisruptionBudget’s selector. See
[Specifying a Disruption Budget for your Application](/docs/tasks/run-application/configure-pdb/)
for more details.

{{% /capture %}}
{{% capture whatsnext %}}

* Read about [disruptions](/docs/concepts/workloads/pods/disruptions/)
* Read about other [Pod management controllers](/docs/reference/controllers/pod-management-controllers/)

{{% /capture %}}
