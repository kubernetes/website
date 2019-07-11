---
title: Built-in controllers
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

Kubernetes comes with a number of built-in 
{{< glossary_tooltip text="controllers" term_id="controller" >}} that run as
part of the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

This page summarizes the types of controller that come as part of Kubernetes
itself.

{{% /capture %}}

{{% capture body %}}
 
The built-in {{< glossary_tooltip term_id="kube-scheduler" >}}
is itself a specialized controller. [Scheduling](/docs/concepts/scheduling/)
means matching the desired set of running
{{< glossary_tooltip text="Pods" term_id="pod" >}} against the available
{{< glossary_tooltip text="Nodes" term_id="node" >}}.

The kube-scheduler runs separately from the kube-controller-manager. This
separation helps with control plane performance.

{{< note >}}
If your cluster is deployed against a cloud service provider, you can
use the
[cloud-controller-manager](/docs/reference/command-line-tools-reference/cloud-controller-manager/)
to run additional provider-specific controllers such as
[Route](/docs/concepts/architecture/cloud-controller/#route-controller).
{{< /note >}}


## Controllers grouped by purpose

* [Workload controllers](/docs/reference/controllers/workload-controllers/)
* [Pod management controllers](/docs/reference/controllers/workload-controllers/)
* [Resource management controllers](/docs/reference/controllers/resource-management-controllers/)
* [Certificate controllers](/docs/reference/controllers/certificate-controllers/)
* [Storage controllers](/docs/reference/controllers/storage-controllers/)
* [Networking controllers](/docs/reference/controllers/network-controllers/)
* [Cluster orchestration controllers](/docs/reference/controllers/cluster-orchestration-controllers/)
* [Resource clean-up controllers](/docs/reference/controllers/resource-cleanup-controllers/)

{{% /capture %}}
