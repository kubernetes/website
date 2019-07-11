---
title: Node IPAM controller
content_template: templates/concept
---

{{% capture overview %}}

This controller implements IP address management to ensure that
Nodes have blocks of IP addresses available to be assigned
to Pods.

{{% /capture %}}

{{% capture body %}}

{{< note >}}
The network configuration for your cluster, and the choice of
{{< glossary_tooltip text="CNI" term_id="cni" >}} plugin(s) will
determine whether and how this controller sets `podCIDR` for Nodes in
the cluster.
{{< /note >}}

{{% /capture %}}
