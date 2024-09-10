---
title: " Windows Networking at Parity with Linux for Kubernetes "
date: 2017-09-08
slug: windows-networking-at-parity-with-linux
url: /blog/2017/09/Windows-Networking-At-Parity-With-Linux
author: >
   Jason Messer (Microsoft)
---

 Since I last blogged about [Kubernetes Networking for Windows](https://blogs.technet.microsoft.com/networking/2017/04/04/windows-networking-for-kubernetes/) four months ago, the Windows Core Networking team has made tremendous progress in both the platform and open source Kubernetes projects. With the updates, Windows is now on par with Linux in terms of networking. Customers can now deploy mixed-OS, Kubernetes clusters in any environment including Azure, on-premises, and on 3rd-party cloud stacks with the same network primitives and topologies supported on Linux without any workarounds, “hacks”, or 3rd-party switch extensions.  

 "So what?", you may ask. There are multiple application and infrastructure-related reasons why these platform improvements make a substantial difference in the lives of developers and operations teams wanting to run Kubernetes. Read on to learn more!  



## Tightly-Coupled Communication
These improvements enable tightly-coupled communication between multiple Windows Server containers (without Hyper-V isolation) within a single "[Pod](/docs/concepts/workloads/pods/pod/)". Think of Pods as the scheduling unit for the Kubernetes cluster, inside of which, one or more application containers are co-located and able to share storage and networking resources. All containers within a Pod shared the same IP address and port range and are able to communicate with each other using localhost. This enables applications to easily leverage "helper" programs for tasks such as monitoring, configuration updates, log management, and proxies. Another way to think of a Pod is as a compute host with the app containers representing processes.  

## Simplified Network Topology
We also simplified the network topology on Windows nodes in a Kubernetes cluster by reducing the number of endpoints required per container (or more generally, per pod) to one. Previously, Windows containers (pods) running in a Kubernetes cluster required two endpoints - one for external (internet) communication and a second for intra-cluster communication between between other nodes or pods in the cluster. This was due to the fact that external communication from containers attached to a host network with local scope (i.e. not publicly routable) required a NAT operation which could only be provided through the Windows NAT (WinNAT) component on the host. Intra-cluster communication required containers to be attached to a separate network with "global" (cluster-level) scope through a second endpoint. Recent platform improvements now enable NAT''ing to occur directly on a container endpoint which is implemented with the Microsoft Virtual Filtering Platform (VFP) Hyper-V switch extension. Now, both external and intra-cluster traffic can flow through a single endpoint.  



## Load-Balancing using VFP in Windows kernel
Kubernetes worker nodes rely on the kube-proxy to load-balance ingress network traffic to Service IPs between pods in a cluster. Previous versions of Windows implemented the Kube-proxy's load-balancing through a user-space proxy. We recently added support for "Proxy mode: iptables" which is implemented using VFP in the Windows kernel so that any IP traffic can be load-balanced more efficiently by the Windows OS kernel. Users can also configure an external load balancer by specifying the externalIP parameter in a service definition. In addition to the aforementioned improvements, we have also added platform support for the following:  



- Support for DNS search suffixes per container / Pod (Docker improvement - removes additional work previously done by kube-proxy to append DNS suffixes)&nbsp;
- [Platform Support] 5-tuple rules for creating ACLs (Looking for help from community to integrate this with support for K8s Network Policy)

 Now that Windows Server has [joined](https://blogs.technet.microsoft.com/hybridcloud/2017/07/13/new-windows-server-preview-release-available-to-windows-insiders/) the [Windows Insider Program](https://insider.windows.com/), customers and partners can take advantage of these new platform features today which accrue value to eagerly anticipated, new feature release later this year and new build after six months. The latest Windows Server insider [build](https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewserver) now includes support for all of these platform improvements.  

 In addition to the platform improvements for Windows, the team submitted code (PRs) for CNI, kubelet, and kube-proxy with the goal of mainlining Windows support into the Kubernetes v1.8 release. These PRs remove previous work-arounds required on Windows for items such as user-mode proxy for internal load balancing, appending additional DNS suffixes to each Kube-DNS request, and a separate container endpoint for external (internet) connectivity.  



- [https://github.com/kubernetes/kubernetes/pull/51063](https://github.com/kubernetes/kubernetes/pull/51063)
- [https://github.com/kubernetes/kubernetes/pull/51064](https://github.com/kubernetes/kubernetes/pull/51064)

 These new platform features and work on kubelet and kube-proxy align with the CNI network model used by Kubernetes on Linux and simplify the deployment of a K8s cluster without additional configuration or custom (Azure) resource templates. To this end, we completed work on CNI network and IPAM plugins to create/remove endpoints and manage IP addresses. The CNI plugin works through kubelet to target the Windows Host Networking Service (HNS) APIs to create an 'l2bridge' network (analogous to macvlan on Linux) which is enforced by the VFP switch extension.  

 The 'l2bridge' network driver re-writes the MAC address of container network traffic on ingress and egress to use the container host's MAC address. This obviates the need for multiple MAC addresses (one per container running on the host) to be "learned" by the upstream network switch port to which the container host is connected. This preserves memory space in physical switch TCAM tables and relies on the Hyper-V virtual switch to do MAC address translation in the host to forward traffic to the correct container. IP addresses are managed by a default, Windows IPAM plug-in which requires that POD CIDR IPs be taken from the container host's network IP space.  

 The team demoed ([link](https://files.slack.com/files-pri/T09NY5SBT-F6KTG30E8/download/sigwindows-2017-08-08.mp4) to video) these new platform features and open-source updates to the SIG-Windows group on 8/8. We are working with the community to merge the kubelet and kube-proxy PRs to mainline these changes in time for the Kubernetes v1.8 release due out this September. These capabilities can then be used on current Windows Server insider builds and the [Windows Server, version 1709](https://blogs.technet.microsoft.com/windowsserver/2017/08/24/sneak-peek-1-windows-server-version-1709/).  

 Soon after RTM, we will also introduce these improvements into the Azure Container Service (ACS) so that Windows worker nodes and the containers hosted are first-class, Azure VNet citizens. An Azure IPAM plugin for Windows CNI will enable these endpoints to directly attach to Azure VNets with network policies for Windows containers enforced the same way as VMs.  



| Feature | Windows Server 2016 (In-Market) | Next Windows Server Feature Release, Semi-Annual Channel | Linux |
| Multiple Containers per Pod with shared network namespace (Compartment) | One Container per Pod | ✔ | ✔ |
| Single (Shared) Endpoint per Pod | Two endpoints: WinNAT (External) + Transparent (Intra-Cluster) | ✔ | ✔ |
| User-Mode, Load Balancing | ✔ | ✔ | ✔ |
| Kernel-Mode, Load Balancing |  Not Supported | ✔ | ✔ |
| Support for DNS search suffixes per Pod (Docker update) | Kube-Proxy &nbsp;added multiple DNS suffixes to each request | ✔ | ✔ |
| CNI Plugin Support |  Not Supported | ✔ | ✔ |
  

 The Kubernetes SIG Windows group meets bi-weekly on Tuesdays at 12:30 PM ET. To join or view notes from previous meetings, check out this [document](https://docs.google.com/document/d/1Tjxzjjuy4SQsFSUVXZbvqVb64hjNAG5CQX8bK7Yda9w/edit#heading=h.kbz22d1yc431).
