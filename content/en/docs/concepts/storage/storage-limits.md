---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Node specific volume limits
---

This document describes the concept of number of maximum volumes that can be attached
to a particular node on various cloud providers.

{{< toc >}}

## Introduction

Pods that use attachable `PersistentVolume` from cloud providers like GCE, AWS and Azure
typically have a limit of how many volumes can be attached to a node. It is important
for Kubernetes to respect those limits while scheduling pods that use those volume types
otherwise pods scheduled on a node can be stuck waiting for volumes to attach.

### Kubernetes built-in attachable limits for Azure, AWS and GCE

Kubernetes's default scheduler ships with predicates that limit following
number of volumes attachable to a particular node:

- **AWS Elastic Block Store**

  For AWS Elastic Block Store Kubernetes permits only 39 volumes to be attached to a node.
- **GCE-PD**

  For GCE Persistent Disks Kubernetes permits only 16 volumes to be attached to a node.
  
- **Azure Disk**

  For Azure Disks Kubernetes permits only 16 volumes to be attached to a node.

Kubernetes admin can change these limits by starting scheduler with environment variable
`KUBE_MAX_PD_VOLS` and setting a new value.

You must pay extra caution while setting a higher value than defaults and consult corresponding
cloudprovider documentation to make sure the node can actually support those limits. Also these limits
are global for entire cluster and hence will affect all nodes.

### Dynamic volume limits based on node type

Kubernetes 1.11 introduces dynamic volume limits based on node type. It is an Alpha feature and admin
must enable feature flag `AttachVolumeLimit` to enable this feature.

Once enabled Kubernetes will automatically determine instance type and support higher or lower
number of attachable volumes depending on node type.

Currently this feature is only supported for following volume types:

- AWS Elastic Block store
- GCE Persistent Disks

When this feature is enabled - for *EBS* disks on M5/C5 instance types Kubernetes will permit only
25 volumes to be attached to a node. For other instance types on EC2 the default will still be 39.

On GCE this will permit upto 128 persistent disks to be attached to a node depending on node type. 



