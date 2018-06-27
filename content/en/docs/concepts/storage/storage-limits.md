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
to a node for various cloud providers.

Cloud providers like Google, Amazon, and Microsoft typically have a limit on
how many volumes can be attached to a node. It is important for Kubernetes to
respect those limits. Otherwise, Pods scheduled on a node could get stuck
waiting for volumes to attach.

{{% /capture %}}

{{% capture body %}}

## Kubernetes default limits

The Kubernetes scheduler has default limits on the number of volumes
that can be attached to a node:

<table>
  <tr><th>Cloud service</th><th>Maximum volumes per node</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

## Custom limits

You can change these limits by setting the value of the
`KUBE_MAX_PD_VOLS` environment variable, and then starting the scheduler.

Use caution if you set a limit that is higher than the default limit. Consult
the cloud provider's documentation to make sure that nodes can actually support
the limit you set.

The limit applies to the entire cluster, so it affects all nodes.

## Dynamic volume limits

{{< feature-state state="alpha" for_k8s_version="v1.11" >}}

Kubernetes 1.11 introduces dynamic volume limits based on node type. This
is an alpha feature that supports these services:

- Amazon EBS
- Google Persistent Disk

To enable dynamic volume limits, set the `AttachVolumeLimit`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to True.

When the dynamic volume limits feature is enabled, Kubernetes automatically
determines the node type and supports the appropriate number of attachable
volumes for the node. For example:

* On
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>,
up to 128 volumes could be attached to a node, depending on the node type. 

* For Amazon EBS disks on M5/C5 instance types, Kubernetes would permit only 25
volumes to be attached to a node. For other instance types on
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes would permit 39 volumes to be attached.

{{% /capture %}}
