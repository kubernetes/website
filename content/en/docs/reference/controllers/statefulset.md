---
toc_hide: true
title: StatefulSet controller
content_template: templates/concept
---

{{% capture overview %}}

The StatefulSet {{< glossary_tooltip term_id="controller" text="controller" >}}
ensures that a {{< glossary_tooltip term_id="StatefulSet" >}} is running on a
suitable set of {{< glossary_tooltip term_id="node" text="Nodes" >}}.

{{% /capture %}}

{{% capture body %}}

The StatefulSet controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

The controller creates a number of Pods for each StatefulSet that it observes,
based on the count of replicas configured for that StatefulSet.

{{< note >}}
The StatefulSet controller creates each Pod sequentially.
{{< /note >}}

As the StatefulSet controller creates a Pod, it adds a label, `statefulset.kubernetes.io/pod-name`,
that is set to the name of the Pod. This label gives each Pod a durable, stable
network identity, that allows you to attach a Service to a specific Pod in
the StatefulSet.

The controller constructs the name label's value based on a pattern:
`$(statefulset_name)-$(ordinal)`.

{{% /capture %}}
{{% capture whatsnext %}}

* Read about the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) concept
* Read about other [workload controllers](/docs/reference/controllers/workload-controllers/)

{{% /capture %}}


