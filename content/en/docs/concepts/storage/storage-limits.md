---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Node-specific Volume Limits
content_type: concept
---

<!-- overview -->

This page describes the maximum number of volumes that can be attached
to a Node for various cloud providers.

Cloud providers like Google, Amazon, and Microsoft typically have a limit on
how many volumes can be attached to a Node. It is important for Kubernetes to
respect those limits. Otherwise, Pods scheduled on a Node could get stuck
waiting for volumes to attach.



<!-- body -->

## Kubernetes default limits

The Kubernetes scheduler has default limits on the number of volumes
that can be attached to a Node:

<table>
  <tr><th>Cloud service</th><th>Maximum volumes per Node</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
  <tr><td><a href="https://www.digitalocean.com/docs/kubernetes/how-to/add-volumes/">Digital Ocean Block Storage Volume</a></td><td>7</td></tr>
</table>

## Custom limits

You can change these limits by setting the value of the
`KUBE_MAX_PD_VOLS` environment variable, and then starting the scheduler.
CSI drivers might have a different procedure, see their documentation
on how to customize their limits.

Use caution if you set a limit that is higher than the default limit. Consult
the cloud provider's documentation to make sure that Nodes can actually support
the limit you set.

The limit applies to the entire cluster, so it affects all Nodes.

## Dynamic volume limits

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

Dynamic volume limits are supported for following volume types.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

For volumes managed by in-tree volume plugins, Kubernetes automatically determines the Node
type and enforces the appropriate maximum number of volumes for the node. For example:

* On
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>,
up to 127 volumes can be attached to a node, [depending on the node
type](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).

* For Amazon EBS disks on M5,C5,R5,T3 and Z1D instance types, Kubernetes allows only 25
volumes to be attached to a Node. For other instance types on
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes allows 39 volumes to be attached to a Node.

* On Azure, up to 64 disks can be attached to a node, depending on the node type. For more details, refer to [Sizes for virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

* If a CSI storage driver advertises a maximum number of volumes for a Node (using `NodeGetInfo`), the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} honors that limit.
Refer to the [CSI specifications](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) for details.

* For volumes managed by in-tree plugins that have been migrated to a CSI driver, the maximum number of volumes will be the one reported by the CSI driver.


