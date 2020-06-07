---
title: Configure DNS for a Cluster
weight: 120
content_template: templates/concept
---

{{% capture overview %}}
Kubernetes offers a DNS cluster addon, which most of the supported environments enable by default. In Kubernetes version 1.11 and later, CoreDNS is recommended and is installed by default with kubeadm.
{{% /capture %}}
{{% capture body %}}
For more information on how to configure CoreDNS for a Kubernetes cluster, see the [Customizing DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/). An example demonstrating how to use Kubernetes DNS with kube-dns, see the [Kubernetes DNS sample plugin](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns).

{{% /capture %}}
