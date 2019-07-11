---
title: Cluster orchestration controllers
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

A _cluster_ is a set of machines, called
{{< glossary_tooltip text="Nodes" term_id="node" >}}, that run containerized
applications.

This page lists the cluster orchestration
{{< glossary_tooltip text="controllers" term_id="controller" >}}
that come as part of Kubernetes itself.

{{% /capture %}}

{{% capture body %}}

## ClusterRole aggregation controller

The [ClusterRole aggregation controller](/docs/reference/controllers/clusterrole-aggregation/)
manages the permissions of aggregated ClusterRoles.

## Node lifecycle controller {#controller-node-lifecycle}

The [Node lifecycle controller](/docs/reference/controllers/node-lifecycle/)
observes the status of the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
on each node, and manages {{< glossary_tooltip text="taints" term_id="taint" >}}
on Nodes based on its findings.

## ServiceAccount controller

The [ServiceAccount controller](/docs/reference/controllers/serviceaccount/)
ensures that each Namespace contains a default ServiceAccount.

## ServiceAccount token controller

The [ServiceAccount token controller](/docs/reference/controllers/serviceaccount-token/)
issues API access tokens for each ServiceAccount.


{{% /capture %}}

{{% capture whatsnext %}}
* Read about [resource clean-up controllers](/docs/reference/controllers/resource-cleanup-controllers/)
{{% /capture %}}
