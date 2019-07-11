---
toc_hide: true
title: Node IPAM controller
content_template: templates/concept
---

{{% capture overview %}}

This {{< glossary_tooltip text="controller" term_id="controller" >}}
implements IP address management to ensure that
{{< glossary_tooltip text="Nodes" term_id="node" >}}
have blocks of IP addresses available to be assigned
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
{{% capture whatsnext %}}
* Read about [cluster networking](/docs/concepts/cluster-administration/networking/)
{{% /capture %}}
