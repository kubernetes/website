---
layout: blog
title: "Introducing Windows CSI support alpha for Kubernetes"
date: 2020-04-03
slug: kubernetes-1-18-feature-windows-csi-support-alpha
author: >
  Deep Debroy [Docker],
  Jing Xu [Google],
  Krishnakumar R (KK) [Microsoft]
---

<em>The alpha version of [CSI Proxy][csi-proxy] for Windows is being released with Kubernetes 1.18. CSI proxy enables CSI Drivers on Windows by allowing containers in Windows to perform privileged storage operations.</em>

## Background

Container Storage Interface (CSI) for Kubernetes went GA in the Kubernetes 1.13 release. CSI has become the standard for exposing block and file storage to containerized workloads on Container Orchestration systems (COs) like Kubernetes. It enables third-party storage providers to write and deploy plugins without the need to alter the core Kubernetes codebase. All new storage features will utilize CSI, therefore it is important to get CSI drivers to work on Windows.

A CSI driver in Kubernetes has two main components: a controller plugin and a node plugin. The controller plugin generally does not need direct access to the host and can perform all its operations through the Kubernetes API and external control plane services (e.g. cloud storage service). The node plugin, however, requires direct access to the host for making block devices and/or file systems available to the Kubernetes kubelet. This was previously not possible for containers on Windows. With the release of [CSIProxy][csi-proxy], CSI drivers can now perform storage operations on the node. This inturn enables containerized CSI Drivers to run on Windows.

## CSI support for Windows clusters

CSI drivers (e.g. AzureDisk, GCE PD, etc.) are recommended to be deployed as containers. CSI driver’s node plugin typically runs on every worker node in the cluster (as a DaemonSet). Node plugin containers need to run with elevated privileges to perform storage related operations. However, Windows currently does not support privileged containers. To solve this problem, [CSIProxy][csi-proxy] makes it so that node plugins can now be deployed as unprivileged pods and then use the proxy to perform privileged storage operations on the node.

## Node plugin interactions with CSIProxy

The design of  the CSI proxy is captured in this [KEP][kep]. The following diagram depicts the interactions with the CSI node plugin and CSI proxy.

<p align="center">
  <img src="/images/blog/2020-04-03-Introducing-Windows-CSI-support-alpha-for-Kubernetes/CSIProxyOverview.png">
</p>

The CSI proxy runs as a process directly on the host on every windows node - very similar to kubelet. The CSI code in kubelet interacts with the [node driver registrar][nd-reg] component and the CSI node plugin. The node driver registrar is a community maintained CSI project which handles the registration of vendor specific node plugins. The kubelet initiates CSI gRPC calls like NodeStageVolume/NodePublishVolume on the node plugin as described in the figure. Node plugins interface with the CSIProxy process to perform local host OS storage related operations such as creation/enumeration of volumes, mounting/unmounting, etc.

## CSI proxy architecture and implementation

<p align="center">
  <img src="/images/blog/2020-04-03-Introducing-Windows-CSI-support-alpha-for-Kubernetes/CSIProxyArchitecture.png">
</p>

In the alpha release, CSIProxy supports the following API groups:
1. Filesystem
1. Disk
1. Volume
1. SMB

CSI proxy exposes each API group via a Windows named pipe. The communication is performed using gRPC over these pipes. The client library from the CSI proxy project uses these pipes to interact with the CSI proxy APIs. For example, the filesystem APIs are exposed via a pipe like <code>\\.\pipe\csi-proxy-filesystem-v1alpha1</code> and volume APIs under the <code>\\.\pipe\csi-proxy-volume-v1alpha1</code>, and so on.

From each API group service, the calls are routed to the host API layer. The host API calls into the host Windows OS by either Powershell or Go standard library calls. For example, when the filesystem API [Rmdir][rmdir] is called the API group service would decode the grpc structure [RmdirRequest][rmdir-req] and find the directory to be removed and call into the Host APIs layer. This would result in a call to [os.Remove][os-rem], a Go standard library call, to perform the remove operation.

## Control flow details

The following figure uses CSI call NodeStageVolume as an example to explain the interaction between kubelet, CSI plugin, and CSI proxy for provisioning a fresh volume. After the node plugin receives a CSI RPC call, it makes a few calls to CSIproxy accordingly.  As a result of the NodeStageVolume call, first the required disk is identified using either of the Disk API calls: ListDiskLocations (in AzureDisk driver) or GetDiskNumberByName (in GCE PD driver). If the disk is not partitioned, then the PartitionDisk (Disk API group) is called. Subsequently, Volume API calls such as ListVolumesOnDisk, FormatVolume and MountVolume are called to perform the rest of the required operations. Similar operations are performed in case of NodeUnstageVolume, NodePublishVolume, NodeUnpublishedVolume, etc.

<p align="center">
  <img src="/images/blog/2020-04-03-Introducing-Windows-CSI-support-alpha-for-Kubernetes/CSIProxyControlFlow.png">
</p>

## Current support

CSI proxy is now available as alpha. You can find more details on the [CSIProxy][csi-proxy] GitHub repository. There are currently two cloud providers that provide alpha support for CSI drivers on Windows: Azure and GCE.

## Future plans

One key area of focus in beta is going to be Windows based build and CI/CD setup to improve the stability and quality of the code base. Another area is using Go based calls directly instead of Powershell commandlets to improve performance. Enhancing debuggability and adding more tests are other areas which the team will be looking into.

## How to get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. Those interested in getting involved with the design and development of CSI Proxy, or any part of the Kubernetes Storage system, may join the [Kubernetes Storage Special Interest Group][sig] (SIG). We’re rapidly growing and always welcome new contributors.

For those interested in more details, the [CSIProxy][csi-proxy] GitHub repository is a good place to start. In addition, the [#csi-windows][slack] channel on kubernetes slack is available for discussions specific to the CSI on Windows.

## Acknowledgments

We would like to thank Michelle Au for guiding us throughout this journey to alpha. We would like to thank Jean Rougé for contributions during the initial CSI proxy effort. We would like to thank Saad Ali for all the guidance with respect to the project and review/feedback on a draft of this blog. We would like to thank Patrick Lang and Mark Rossetti for helping us with Windows specific questions and details. Special thanks to Andy Zhang for reviews and guidance with respect to Azuredisk and Azurefile work. A big thank you to Paul Burt and Karen Chu for the review and suggestions on improving this blog post.

Last but not the least, we would like to thank the broader Kubernetes community who contributed at every step of the project.



[csi-proxy]: https://github.com/kubernetes-csi/csi-proxy
[kep]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-windows/20190714-windows-csi-support.md
[nd-reg]: https://kubernetes-csi.github.io/docs/node-driver-registrar.html
[rmdir]: https://github.com/kubernetes-csi/csi-proxy/blob/master/client/api/filesystem/v1alpha1/api.proto
[rmdir-req]: https://github.com/kubernetes-csi/csi-proxy/blob/master/client/api/filesystem/v1alpha1/api.pb.go
[os-rem]: https://github.com/kubernetes-csi/csi-proxy/blob/master/internal/os/filesystem/api.go
[sig]: https://github.com/kubernetes/community/tree/master/sig-storage
[slack]: https://kubernetes.slack.com/messages/csi-windows