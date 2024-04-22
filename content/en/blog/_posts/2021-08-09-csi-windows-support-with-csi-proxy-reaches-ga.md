---
layout: blog
title: 'Kubernetes 1.22: CSI Windows Support (with CSI Proxy) reaches GA'
date: 2021-08-09
slug: csi-windows-support-with-csi-proxy-reaches-ga
author: >
  Mauricio Poppe (Google),
  Jing Xu (Google),
  Deep Debroy (Apple)
---

*The stable version of CSI Proxy for Windows has been released alongside Kubernetes 1.22.  CSI Proxy enables CSI Drivers running on Windows nodes to perform privileged storage operations.*

## Background

Container Storage Interface (CSI) for Kubernetes went GA in the Kubernetes 1.13 release. CSI has become the standard for exposing block and file storage to containerized workloads on Container Orchestration systems (COs) like Kubernetes. It enables third-party storage providers to write and deploy plugins without the need to alter the core Kubernetes codebase. Legacy in-tree drivers are deprecated and new storage features are introduced in CSI, therefore it is important to get CSI Drivers to work on Windows.

A CSI Driver in Kubernetes has two main components: a controller plugin which runs in the control plane and a node plugin which runs on every node.

- The controller plugin generally does not need direct access to the host and can perform all its operations through the Kubernetes API and external control plane services.

- The node plugin, however, requires direct access to the host for making block devices and/or file systems available to the Kubernetes kubelet. Due to the missing capability of running privileged operations from containers on Windows nodes [CSI Proxy was introduced as alpha in Kubernetes 1.18](https://kubernetes.io/blog/2020/04/03/kubernetes-1-18-feature-windows-csi-support-alpha/) as a way to enable containers to perform privileged storage operations. This enables containerized CSI Drivers to run on Windows nodes.

## What's CSI Proxy and how do CSI drivers interact with it?

When a workload that uses persistent volumes is scheduled, it'll go through a sequence of steps defined in the [CSI Spec](https://github.com/container-storage-interface/spec/blob/master/spec.md). First, the workload will be scheduled to run on a node. Then the controller component of a CSI Driver will attach the persistent volume to the node. Finally the node component of a CSI Driver will mount the persistent volume on the node.

The node component of a CSI Driver needs to run on Windows nodes to support Windows workloads. Various privileged operations like scanning of disk devices, mounting of file systems, etc. cannot be done from a containerized application running on Windows nodes yet ([Windows HostProcess containers](https://github.com/kubernetes/enhancements/issues/1981) introduced in Kubernetes 1.22 as alpha enable functionalities that require host access like the operations mentioned before). However, we can perform these operations through a binary (CSI Proxy) that's pre-installed on the Window nodes. CSI Proxy has a client-server architecture and allows CSI drivers to issue privileged storage operations through a gRPC interface exposed over named pipes created during the startup of CSI Proxy.

![CSI Proxy Architecture](/images/blog/2021-08-09-csi-windows-support-with-csi-proxy-reaches-ga/csi-proxy.png)

## CSI Proxy reaches GA

The CSI Proxy development team has worked closely with storage vendors, many of whom started integrating CSI Proxy into their CSI Drivers and provided feedback as early as CSI Proxy design proposal. This cooperation uncovered use cases where additional APIs were needed, found bugs, and identified areas for documentation improvement.

The CSI Proxy design [KEP](https://github.com/kubernetes/enhancements/pull/2737) has been updated to reflect the current CSI Proxy architecture. Additional [development documentation](https://github.com/kubernetes-csi/csi-proxy/blob/master/docs/DEVELOPMENT.md) is included for contributors interested in helping with new features or bug fixes.

Before we reached GA we wanted to make sure that our API is simple and consistent. We went through an extensive API review of the v1beta API groups where we made sure that the CSI Proxy API methods and messages are consistent with the naming conventions defined in the [CSI Spec](https://github.com/container-storage-interface/spec/blob/master/spec.md). As part of this effort we're graduating the [Disk](https://github.com/kubernetes-csi/csi-proxy/blob/master/docs/apis/disk_v1.md), [Filesystem](https://github.com/kubernetes-csi/csi-proxy/blob/master/docs/apis/filesystem_v1.md), [SMB](https://github.com/kubernetes-csi/csi-proxy/blob/master/docs/apis/smb_v1.md) and [Volume](https://github.com/kubernetes-csi/csi-proxy/blob/master/docs/apis/volume_v1.md) API groups to v1.

Additional Windows system APIs to get information from the Windows nodes and support to mount iSCSI targets in Windows nodes, are available as alpha APIs in the [System API](https://github.com/kubernetes-csi/csi-proxy/tree/v1.0.0/client/api/system/v1alpha1) and the [iSCSI API](https://github.com/kubernetes-csi/csi-proxy/tree/v1.0.0/client/api/iscsi/v1alpha2). These APIs will continue to be improved before we graduate them to v1.

CSI Proxy v1 is compatible with all the previous v1betaX releases. The GA `csi-proxy.exe` binary can handle requests from v1betaX clients thanks to the autogenerated conversion layer that transforms any versioned client request to a version-agnostic request that the server can process. Several [integration tests](https://github.com/kubernetes-csi/csi-proxy/tree/v1.0.0/integrationtests) were added for all the API versions of the API groups that are graduating to v1 to ensure that CSI Proxy is backwards compatible.

Version drift between CSI Proxy and the CSI Drivers that interact with it was also carefully considered. A [connection fallback mechanism](https://github.com/kubernetes-csi/csi-proxy/pull/124) has been provided for CSI Drivers to handle multiple versions of CSI Proxy for a smooth upgrade to v1. This allows CSI Drivers, like the GCE PD CSI Driver, [to recognize which version of the CSI Proxy binary is running](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver/pull/738) and handle multiple versions of the CSI Proxy binary deployed on the node.

CSI Proxy v1 is already being used by many CSI Drivers, including the [AWS EBS CSI Driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/pull/966), [Azure Disk CSI Driver](https://github.com/kubernetes-sigs/azuredisk-csi-driver/pull/919), [GCE PD CSI Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver/pull/738), and [SMB CSI Driver](https://github.com/kubernetes-csi/csi-driver-smb/pull/319).

## Future plans

We're very excited for the future of CSI Proxy. With the upcoming [Windows HostProcess containers](https://github.com/kubernetes/enhancements/issues/1981), we are considering converting the CSI Proxy in to a library consumed by CSI Drivers in addition to the current client/server design. This will allow us to iterate faster on new features because the `csi-proxy.exe` binary will no longer be needed.

## How to get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. Those interested in getting involved with the design and development of CSI Proxy, or any part of the Kubernetes Storage system, may join the Kubernetes Storage Special Interest Group (SIG). We’re rapidly growing and always welcome new contributors.

For those interested in more details about CSI support in Windows please reach out in the [#csi-windows](https://kubernetes.slack.com/messages/csi-windows) Kubernetes slack channel.

## Acknowledgments

CSI-Proxy received many contributions from members of the Kubernetes community. We thank all of the people that contributed to CSI Proxy with design reviews, bug reports, bug fixes, and for their continuous support in reaching this milestone:

- [Andy Zhang](https://github.com/andyzhangx)
- [Dan Ilan](https://github.com/jmpfar)
- [Deep Debroy](https://github.com/ddebroy)
- [Humble Devassy Chirammal](https://github.com/humblec)
- [Jing Xu](https://github.com/jingxu97)
- [Jean Rougé](https://github.com/wk8)
- [Jordan Liggitt](https://github.com/liggitt)
- [Kalya Subramanian](https://github.com/ksubrmnn)
- [Krishnakumar R](https://github.com/kkmsft)
- [Manuel Tellez](https://github.com/manueltellez)
- [Mark Rossetti](https://github.com/marosset)
- [Mauricio Poppe](https://github.com/mauriciopoppe)
- [Matthew Wong](https://github.com/wongma7)
- [Michelle Au](https://github.com/msau42)
- [Patrick Lang](https://github.com/PatrickLang)
- [Saad Ali](https://github.com/saad-ali)
- [Yuju Hong](https://github.com/yujuhong)