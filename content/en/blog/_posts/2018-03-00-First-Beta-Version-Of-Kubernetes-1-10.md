---
title: "Kubernetes: First Beta Version of Kubernetes 1.10 is Here"
date: 2018-03-02
slug: first-beta-version-of-kubernetes-1-10
url: /blog/2018/03/First-Beta-Version-Of-Kubernetes-1-10
author: >
   Nick Chase (Mirantis)
---

The Kubernetes community has released the first beta version of Kubernetes 1.10, which means you can now try out some of the new features and give your feedback to the release team ahead of the official release. The release, currently scheduled for March 21, 2018, is targeting the inclusion of more than a dozen brand new alpha features and more mature versions of more than two dozen more.

Specifically, Kubernetes 1.10 will include production-ready versions of Kubelet TLS Bootstrapping, API aggregation, and more detailed storage metrics.

Some of these features will look familiar because they emerged at earlier stages in previous releases. Each stage has specific meanings:  

* **stable**: The same as "generally available",  features in this stage have been thoroughly tested and can be used in production environments.
* **beta**: The feature has been around long enough that the team is confident that the feature itself is on track to be included as a stable feature, and any API calls aren't going to change. You can use and test these features, but including them in mission-critical production environments is not advised because they are not completely hardened.
* **alpha**: New features generally come in at this stage. These features are still being explored. APIs and options may change in future versions, or the feature itself may disappear. Definitely not for production environments.
You can download the latest release of Kubernetes 1.10 from . To give feedback to the development community, [create an issue in the Kubernetes 1.10 milestone][2] and tag the appropriate SIG before March 9.

Here's what to look for, though you should remember that while this is the current plan as of this writing, there's always a possibility that one or more features may be held for a future release. We'll start with authentication.  

###  Authentication (SIG-Auth)

1. [Kubelet TLS Bootstrap][3] (stable): Kubelet TLS bootstrapping is probably the "headliner" of the Kubernetes 1.10 release as it becomes available for production environments. It provides the ability for a new kubelet to create a certificate signing request, which enables you to add new nodes to your cluster without having to either manually add security certificates or use self-signed certificates that eliminate many of the benefits of having certificates in the first place.
2. [Pod Security Policy moves to its own API group][4] (beta): The beta release of the Pod Security Policy lets administrators decide what contexts pods can run in. In other words, you have the ability to prevent unprivileged users from creating privileged pods -- that is, pods that can perform actions such as writing files or accessing Secrets -- in particular namespaces.
3. [Limit node access to API][5] (beta): Also in beta, you now have the ability to limit calls to the API on a node to just that specific node, and to ensure that a node is only calling its own API, and not those on other nodes.
4. [External client-go credential providers][6] (alpha): client-go is the Go language client for accessing the Kubernetes API. This feature adds the ability to add external credential providers. For example, Amazon might want to create its own authenticator to validate interaction with EKS clusters; this feature enables them to do that without having to include their authenticator in the Kubernetes codebase.
5. [TokenRequest API][7] (alpha): The TokenRequest API provides the groundwork for much needed improvements to service account tokens; this feature enables creation of tokens that aren't persisted in the Secrets API, that are targeted for specific audiences (such as external secret stores), have configurable expiries, and are bindable to specific pods.

###  Networking (SIG-Network)

1. [Support configurable pod resolv.conf][8] (beta): You now have the ability to specifically control DNS for a single pod, rather than relying on the overall cluster DNS.
2. Although the feature is called [Switch default DNS plugin to CoreDNS][9] (beta), that's not actually what will happen in this cycle. The community has been working on the switch from kube-dns, which includes dnsmasq, to CoreDNS, another CNCF project with fewer moving parts, for several releases. In Kubernetes 1.10, the default will still be kube-dns, but when CoreDNS reaches feature parity with kube-dns, the team will look at making it the default.
3. [Topology aware routing of services][10] (alpha): The ability to distribute workloads is one of the advantages of Kubernetes, but one thing that has been missing until now is the ability to keep workloads and services geographically close together for latency purposes. Topology aware routing will help with this problem. (This functionality may be delayed until Kubernetes 1.11.)
4. [Make NodePort IP address configurable][11] (alpha): Not having to specify IP addresses in a Kubernetes cluster is great -- until you actually need to know what one of those addresses is ahead of time, such as for setting up database replication or other tasks. You will now have the ability to specifically configure NodePort IP addresses to solve this problem. (This functionality may be delayed until Kubernetes 1.11.)

###  Kubernetes APIs (SIG-API-machinery)

1. [API Aggregation][12] (stable): Kubernetes makes it possible to extend its API by creating your own functionality and registering your functions so that they can be served alongside the core K8s functionality. This capability will be upgraded to "stable" in Kubernetes 1.10, so you can use it in production. Additionally, SIG-CLI is adding a feature called [kubectl get and describe should work well with extensions][13] (alpha) to make the server, rather than the client, return this information for a smoother user experience.
2. [Support for self-hosting authorizer webhook][14] (alpha): Earlier versions of Kubernetes brought us the authorizer webhooks, which make it possible to customize the enforcement of permissions before commands are executed. Those webhooks, however, have to live somewhere, and this new feature makes it possible to host them in the cluster itself.

###  Storage (SIG-Storage)

1. [Detailed storage metrics of internal state][15] (stable): With a distributed system such as Kubernetes, it's particularly important to know what's going on inside the system at any given time, either for troubleshooting purposes or simply for automation. This release brings to general availability detailed metrics of what's going in inside the storage systems, including metrics such as mount and unmount time, number of volumes in a particular state, and number of orphaned pod directories. You can find a [full list in this design document][16].
2. [Mount namespace propagation][17] (beta): This feature allows a container to mount a volume as rslave so that host mounts can be seen inside the container, or as rshared so that any mounts from inside the container are reflected in the host's mount namespace. The default for this feature is rslave.
3. [Local Ephemeral Storage Capacity Isolation][18] (beta): Without this feature in place, every pod on a node that is using ephemeral storage is pulling from the same pool, and allocating storage is on a "best-effort" basis; in other words, a pod never knows for sure how much space it has available. This function provides the ability for a pod to reserve its own storage.
4. [Out-of-tree CSI Volume Plugins][19] (beta): Kubernetes 1.9 announced the release of the Container Storage Interface, which provides a standard way for vendors to provide storage to Kubernetes. This function makes it possible for them to create drivers that live "out-of-tree", or out of the normal Kubernetes core. This means that vendors can control their own plugins and don't have to rely on the community for code reviews and approvals.
5. [Local Persistent Storage][20] (beta): This feature enables PersistentVolumes to be created with locally attached disks, and not just network volumes.
6. [Prevent deletion of Persistent Volume Claims that are used by a pod][21] (beta) and 7. [Prevent deletion of Persistent Volume that is bound to a Persistent Volume Claim][22] (beta): In previous versions of Kubernetes it was possible to delete storage that is in use by a pod, causing massive problems for the pod. These features provide validation that prevents that from happening.
7. Running out of storage space on your Persistent Volume? If you are, you can use [Add support for online resizing of PVs][23] (alpha) to enlarge the underlying volume it without disrupting existing data. This also works in conjunction with the new [Add resize support for FlexVolume][24] (alpha); FlexVolumes are vendor-supported volumes implemented through [FlexVolume][25] plugins.
8. [Topology Aware Volume Scheduling][26] (beta): This feature enables you to specify topology constraints on PersistentVolumes and have those constraints evaluated by the scheduler. It also delays the initial PersistentVolumeClaim binding until the Pod has been scheduled so that the volume binding decision is smarter and considers all Pod scheduling constraints as well. At the moment, this feature is most useful for local persistent volumes, but support for dynamic provisioning is under development.



###  Node management (SIG-Node)

1. [Dynamic Kubelet Configuration][27] (beta): Kubernetes makes it easy to make changes to existing clusters, such as increasing the number of replicas or making a service available over the network. This feature makes it possible to change Kubernetes itself (or rather, the Kubelet that runs Kubernetes behind the scenes) without bringing down the node on which Kubelet is running.
2. [CRI validation test suite][28] (beta): The Container Runtime Interface (CRI) makes it possible to run containers other than Docker (such as Rkt containers or even virtual machines using Virtlet) on Kubernetes. This features provides a suite of validation tests to make certain that these CRI implementations are compliant, enabling developers to more easily find problems.
3. [Configurable Pod Process Namespace Sharing][29] (alpha): Although pods can easily share the Kubernetes namespace, the process, or PID namespace has been a more difficult issue due to lack of support in Docker. This feature enables you to set a parameter on the pod to determine whether containers get their own operating system processes or share a single process.
4. [Add support for Windows Container Configuration in CRI][30] (alpha): The Container Runtime Interface was originally designed with Linux-based containers in mind, and it was impossible to implement support for Windows-based containers using CRI. This feature solves that problem, making it possible to specify a WindowsContainerConfig.
5. [Debug Containers][31] (alpha): It's easy to debug a container if you have the appropriate utilities. But what if you don't? This feature makes it possible to run debugging tools on a container even if those tools weren't included in the original container image.

###  Other changes:

1. Deployment (SIG-Cluster Lifecycle): [Support out-of-process and out-of-tree cloud providers][32] (beta): As Kubernetes gains acceptance, more and more cloud providers will want to make it available. To do that more easily, the community is working on extracting provider-specific binaries so that they can be more easily replaced.
2. Kubernetes on Azure (SIG-Azure): Kubernetes has a cluster-autoscaler that automatically adds nodes to your cluster if you're running too many workloads, but until now it wasn't available on Azure. The [Add Azure support to cluster-autoscaler][33] (alpha) feature aims to fix that. Closely related, the [Add support for Azure Virtual Machine Scale Sets][34] (alpha) feature makes use of Azure's own autoscaling capabilities to make resources available.
You can download the Kubernetes 1.10 beta from . Again, if you've got feedback (and the community hopes you do) please add an issue to the [1.10 milestone][2] and tag the relevant SIG before March 9.  
_  
(Many thanks to community members Michelle Au, Jan Šafránek, Eric Chiang, Michał Nasiadka, Radosław Pieczonka, Xing Yang, Daniel Smith, sylvain boily, Leo Sunmo, Michal Masłowski, Fernando Ripoll, ayodele abejide, Brett Kochendorfer, Andrew Randall, Casey Davenport, Duffie Cooley, Bryan Venteicher, Mark Ayers, Christopher Luciano, and Sandor Szuecs for their invaluable help in reviewing this article for accuracy.)_

[1]: https://www.mirantis.com/
[2]: https://github.com/kubernetes/kubernetes/milestone/37
[3]: https://github.com/kubernetes/features/issues/43
[4]: https://github.com/kubernetes/features/issues/5
[5]: https://github.com/kubernetes/features/issues/279
[6]: https://github.com/kubernetes/features/issues/541
[7]: https://github.com/kubernetes/features/issues/542
[8]: https://github.com/kubernetes/features/issues/504
[9]: https://github.com/kubernetes/features/issues/427
[10]: https://github.com/kubernetes/features/issues/536
[11]: https://github.com/kubernetes/features/issues/539
[12]: https://github.com/kubernetes/features/issues/263
[13]: https://github.com/kubernetes/features/issues/515
[14]: https://github.com/kubernetes/features/issues/516
[15]: https://github.com/kubernetes/features/issues/496
[16]: https://docs.google.com/document/d/1Fh0T60T_y888LsRwC51CQHO75b2IZ3A34ZQS71s_F0g/edit#heading=h.ys6pjpbasqdu
[17]: https://github.com/kubernetes/features/issues/432
[18]: https://github.com/kubernetes/features/issues/361
[19]: https://github.com/kubernetes/features/issues/178
[20]: https://github.com/kubernetes/features/issues/121
[21]: https://github.com/kubernetes/features/issues/498
[22]: https://github.com/kubernetes/features/issues/499
[23]: https://github.com/kubernetes/features/issues/531
[24]: https://github.com/kubernetes/features/issues/304
[25]: http://leebriggs.co.uk/blog/2017/03/12/kubernetes-flexvolumes.html
[26]: https://github.com/kubernetes/features/issues/490
[27]: https://github.com/kubernetes/features/issues/281
[28]: https://github.com/kubernetes/features/issues/292
[29]: https://github.com/kubernetes/features/issues/495
[30]: https://github.com/kubernetes/features/issues/547
[31]: https://github.com/kubernetes/features/issues/277
[32]: https://github.com/kubernetes/features/issues/88
[33]: https://github.com/kubernetes/features/issues/514
[34]: https://github.com/kubernetes/features/issues/513
