---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Node-specific Volume Limits
content_template: templates/concept
---

{{% capture overview %}}

This page describes the maximum number of volumes that can be attached
to a Node for various cloud providers.

Cloud providers like Google, Amazon, and Microsoft typically have a limit on
how many volumes can be attached to a Node. It is important for Kubernetes to
respect those limits. Otherwise, Pods scheduled on a Node could get stuck
waiting for volumes to attach.

{{% /capture %}}

{{% capture body %}}

## Kubernetes default limits

The Kubernetes scheduler has default limits on the number of volumes
that can be attached to a Node:

<table>
  <tr><th>Cloud service</th><th>Maximum volumes per Node</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

## Custom limits

You can change these limits by setting the value of the
`KUBE_MAX_PD_VOLS` environment variable, and then starting the scheduler.

Use caution if you set a limit that is higher than the default limit. Consult
the cloud provider's documentation to make sure that Nodes can actually support
the limit you set.

The limit applies to the entire cluster, so it affects all Nodes.

## Dynamic volume limits

{{< feature-state state="beta" for_k8s_version="v1.12" >}}

Kubernetes 1.11 introduced support for dynamic volume limits based on Node type as an Alpha feature.
In Kubernetes 1.12 this feature is graduating to Beta and will be enabled by default.

Dynamic volume limits are supported for following volume types.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI


When the dynamic volume limits feature is enabled, Kubernetes automatically
determines the Node type and enforces the appropriate number of attachable
volumes for the node. For example:

* On
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>,
up to 128 volumes can be attached to a node, [depending on the node
type](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).

* For Amazon EBS disks on M5,C5,R5,T3 and Z1D instance types, Kubernetes allows only 25
volumes to be attached to a Node. For other instance types on
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes allows 39 volumes to be attached to a Node.

* On Azure, up to 64 disks can be attached to a node, depending on the node type. For more details, refer to [Sizes for virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

* For CSI, any driver that advertises volume attach limits via CSI specs will have those limits available as the Node's allocatable property
  and the Scheduler will not schedule Pods with volumes on any Node that is already at its capacity. Refer to the [CSI specs](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) for more details.

{{% /capture %}}
