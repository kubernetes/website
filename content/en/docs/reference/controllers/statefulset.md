---
title: StatefulSet controller
content_template: templates/concept
---

{{% capture overview %}}

The StatefulSet controller ensures that a {{< glossary_tooltip term_id="StatefulSet" >}}
is running on a suitable set of Nodes.

{{% /capture %}}

{{% capture body %}}

The StatefulSet controller is built in to kube-controller-manager.

## Controller behavior

The controller creates a number of Pods for each StatefulSet that it observes,
based on the count of replicas configured for that StatefulSet. The controller
creates these Pods *sequentially*.

When the StatefulSet controller creates a Pod, it adds a label, `statefulset.kubernetes.io/pod-name`,
that is set to the name of the Pod. This label gives each Pod a durable, stable
network identity, that allows you to attach a Service to a specific Pod in
the StatefulSet.
The controller constructs the pod name label valuebased on a pattern:
`$(statefulset name)-$(ordinal)`.

{{% /capture %}}
{{% capture whatsnext %}}

* Follow an example of [deploying a stateful application](/docs/tutorials/stateful-application/basic-stateful-set/).
* Read about [force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).

{{% /capture %}}

