---
layout: post
title: First Beta Version of Kubernetes 1.10 is Here - Your Chance to Provide Feedback
date: '2018-03-02T06:00:00.000-08:00'
author: kbarnard
tags: 
modified_time: '2018-03-02T06:00:56.738-08:00'
blogger_id: tag:blogger.com,1999:blog-112706738355446097.post-4572825815422165001
blogger_orig_url: http://blog.kubernetes.io/2018/03/first-beta-version-of-kubernetes-1-10.html
---

<div>***Editor's note: Today's post is by Nick Chase. Nick is Head of Content 
at [Mirantis](https://www.mirantis.com/). *** 
<div> 
The Kubernetes community has released the first beta version of Kubernetes 
1.10, which means you can now try out some of the new features and give your 
feedback to the release team ahead of the official release. The release, 
currently scheduled for March 21, 2018, is targeting the inclusion of more 
than a dozen brand new alpha features and more mature versions of more than 
two dozen more. 

Specifically, Kubernetes 1.10 will include production-ready versions of 
Kubelet TLS Bootstrapping, API aggregation, and more detailed storage metrics. 

Some of these features will look familiar because they emerged at earlier 
stages in previous releases. Each stage has specific meanings: 
1. **stable**: The same as "generally available",  features in this stage have 
been thoroughly tested and can be used in production environments. 
1. **beta**: The feature has been around long enough that the team is 
confident that the feature itself is on track to be included as a stable 
feature, and any API calls aren't going to change. You can use and test these 
features, but including them in mission-critical production environments is 
not advised because they are not completely hardened. 
1. **alpha**: New features generally come in at this stage. These features are 
still being explored. APIs and options may change in future versions, or the 
feature itself may disappear. Definitely not for production environments. 
You can download the latest release of Kubernetes 1.10 from 
[https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.10.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.10.md). 
To give feedback to the development community, [create an issue in the 
Kubernetes 1.10 
milestone](https://github.com/kubernetes/kubernetes/milestone/37) and tag the 
appropriate SIG before March 9. 

Here's what to look for, though you should remember that while this is the 
current plan as of this writing, there's always a possibility that one or more 
features may be held for a future release. We'll start with authentication. 
<div>## Authentication (SIG-Auth)1. [Kubelet TLS 
Bootstrap](https://github.com/kubernetes/features/issues/43) (stable): Kubelet 
TLS bootstrapping is probably the "headliner" of the Kubernetes 1.10 release 
as it becomes available for production environments. It provides the ability 
for a new kubelet to create a certificate signing request, which enables you 
to add new nodes to your cluster without having to either manually add 
security certificates or use self-signed certificates that eliminate many of 
the benefits of having certificates in the first place. 
1. [Pod Security Policy moves to its own API 
group](https://github.com/kubernetes/features/issues/5) (beta): The beta 
release of the Pod Security Policy lets administrators decide what contexts 
pods can run in. In other words, you have the ability to prevent unprivileged 
users from creating privileged pods -- that is, pods that can perform actions 
such as writing files or accessing Secrets -- in particular namespaces. 
1. [Limit node access to 
API](https://github.com/kubernetes/features/issues/279) (beta): Also in beta, 
you now have the ability to limit calls to the API on a node to just that 
specific node, and to ensure that a node is only calling its own API, and not 
those on other nodes. 
1. [External client-go credential 
providers](https://github.com/kubernetes/features/issues/541) (alpha): 
client-go is the Go language client for accessing the Kubernetes API. This 
feature adds the ability to add external credential providers. For example, 
Amazon might want to create its own authenticator to validate interaction with 
EKS clusters; this feature enables them to do that without having to include 
their authenticator in the Kubernetes codebase. 
1. [TokenRequest API](https://github.com/kubernetes/features/issues/542) 
(alpha): The TokenRequest API provides the groundwork for much needed 
improvements to service account tokens; this feature enables creation of 
tokens that aren't persisted in the Secrets API, that are targeted for 
specific audiences (such as external secret stores), have configurable 
expiries, and are bindable to specific pods. 
<div>## Networking (SIG-Network)1. [Support configurable pod 
resolv.conf](https://github.com/kubernetes/features/issues/504) (beta): You 
now have the ability to specifically control DNS for a single pod, rather than 
relying on the overall cluster DNS. 
1. Although the feature is called [Switch default DNS plugin to 
CoreDNS](https://github.com/kubernetes/features/issues/427) (beta), that's not 
actually what will happen in this cycle. The community has been working on the 
switch from kube-dns, which includes dnsmasq, to CoreDNS, another CNCF project 
with fewer moving parts, for several releases. In Kubernetes 1.10, the default 
will still be kube-dns, but when CoreDNS reaches feature parity with kube-dns, 
the team will look at making it the default. 
1. [Topology aware routing of 
services](https://github.com/kubernetes/features/issues/536) (alpha): The 
ability to distribute workloads is one of the advantages of Kubernetes, but 
one thing that has been missing until now is the ability to keep workloads and 
services geographically close together for latency purposes. Topology aware 
routing will help with this problem. (This functionality may be delayed until 
Kubernetes 1.11.) 
1. [Make NodePort IP address 
configurable](https://github.com/kubernetes/features/issues/539) (alpha): Not 
having to specify IP addresses in a Kubernetes cluster is great -- until you 
actually need to know what one of those addresses is ahead of time, such as 
for setting up database replication or other tasks. You will now have the 
ability to specifically configure NodePort IP addresses to solve this problem. 
(This functionality may be delayed until Kubernetes 1.11.) 
<div>## Kubernetes APIs (SIG-API-machinery)1. [API 
Aggregation](https://github.com/kubernetes/features/issues/263) (stable): 
Kubernetes makes it possible to extend its API by creating your own 
functionality and registering your functions so that they can be served 
alongside the core K8s functionality. This capability will be upgraded to 
"stable" in Kubernetes 1.10, so you can use it in production. Additionally, 
SIG-CLI is adding a feature called [kubectl get and describe should work well 
with extensions](https://github.com/kubernetes/features/issues/515) (alpha) to 
make the server, rather than the client, return this information for a 
smoother user experience. 
1. [Support for self-hosting authorizer 
webhook](https://github.com/kubernetes/features/issues/516) (alpha): Earlier 
versions of Kubernetes brought us the authorizer webhooks, which make it 
possible to customize the enforcement of permissions before commands are 
executed. Those webhooks, however, have to live somewhere, and this new 
feature makes it possible to host them in the cluster itself. 
<div>## Storage (SIG-Storage)1. [Detailed storage metrics of internal 
state](https://github.com/kubernetes/features/issues/496) (stable): With a 
distributed system such as Kubernetes, it's particularly important to know 
what's going on inside the system at any given time, either for 
troubleshooting purposes or simply for automation. This release brings to 
general availability detailed metrics of what's going in inside the storage 
systems, including metrics such as mount and unmount time, number of volumes 
in a particular state, and number of orphaned pod directories. You can find a 
[full list in this design 
document](https://docs.google.com/document/d/1Fh0T60T_y888LsRwC51CQHO75b2IZ3A34ZQS71s_F0g/edit#heading=h.ys6pjpbasqdu). 
1. [Mount namespace 
propagation](https://github.com/kubernetes/features/issues/432) (beta): This 
feature allows a container to mount a volume as rslave so that host mounts can 
be seen inside the container, or as rshared so that any mounts from inside the 
container are reflected in the host's mount namespace. The default for this 
feature is rslave. 
1. [Local Ephemeral Storage Capacity 
Isolation](https://github.com/kubernetes/features/issues/361) (beta): Without 
this feature in place, every pod on a node that is using ephemeral storage is 
pulling from the same pool, and allocating storage is on a "best-effort" 
basis; in other words, a pod never knows for sure how much space it has 
available. This function provides the ability for a pod to reserve its own 
storage. 
1. [Out-of-tree CSI Volume 
Plugins](https://github.com/kubernetes/features/issues/178) (beta): Kubernetes 
1.9 announced the release of the Container Storage Interface, which provides a 
standard way for vendors to provide storage to Kubernetes. This function makes 
it possible for them to create drivers that live "out-of-tree", or out of the 
normal Kubernetes core. This means that vendors can control their own plugins 
and don't have to rely on the community for code reviews and approvals. 
1. [Local Persistent 
Storage](https://github.com/kubernetes/features/issues/121) (beta): This 
feature enables PersistentVolumes to be created with locally attached disks, 
and not just network volumes. 
1. [Prevent deletion of Persistent Volume Claims that are used by a 
pod](https://github.com/kubernetes/features/issues/498) (beta) and 7. [Prevent 
deletion of Persistent Volume that is bound to a Persistent Volume 
Claim](https://github.com/kubernetes/features/issues/499) (beta): In previous 
versions of Kubernetes it was possible to delete storage that is in use by a 
pod, causing massive problems for the pod. These features provide validation 
that prevents that from happening. 
1. Running out of storage space on your Persistent Volume? If you are, you can 
use [Add support for online resizing of 
PVs](https://github.com/kubernetes/features/issues/531) (alpha) to enlarge the 
underlying volume it without disrupting existing data. This also works in 
conjunction with the new [Add resize support for 
FlexVolume](https://github.com/kubernetes/features/issues/304) (alpha); 
FlexVolumes are vendor-supported volumes implemented through 
[FlexVolume](http://leebriggs.co.uk/blog/2017/03/12/kubernetes-flexvolumes.html) 
plugins. 
1. [Topology Aware Volume 
Scheduling](https://github.com/kubernetes/features/issues/490) (beta): This 
feature enables you to specify topology constraints on PersistentVolumes and 
have those constraints evaluated by the scheduler. It also delays the initial 
PersistentVolumeClaim binding until the Pod has been scheduled so that the 
volume binding decision is smarter and considers all Pod scheduling 
constraints as well. At the moment, this feature is most useful for local 
persistent volumes, but support for dynamic provisioning is under development. 
<div> 
## Node management (SIG-Node)1. [Dynamic Kubelet 
Configuration](https://github.com/kubernetes/features/issues/281) (beta): 
Kubernetes makes it easy to make changes to existing clusters, such as 
increasing the number of replicas or making a service available over the 
network. This feature makes it possible to change Kubernetes itself (or 
rather, the Kubelet that runs Kubernetes behind the scenes) without bringing 
down the node on which Kubelet is running. 
1. [CRI validation test 
suite](https://github.com/kubernetes/features/issues/292) (beta): The 
Container Runtime Interface (CRI) makes it possible to run containers other 
than Docker (such as Rkt containers or even virtual machines using Virtlet) on 
Kubernetes. This features provides a suite of validation tests to make certain 
that these CRI implementations are compliant, enabling developers to more 
easily find problems. 
1. [Configurable Pod Process Namespace 
Sharing](https://github.com/kubernetes/features/issues/495) (alpha): Although 
pods can easily share the Kubernetes namespace, the process, or PID namespace 
has been a more difficult issue due to lack of support in Docker. This feature 
enables you to set a parameter on the pod to determine whether containers get 
their own operating system processes or share a single process. 
1. [Add support for Windows Container Configuration in 
CRI](https://github.com/kubernetes/features/issues/547) (alpha): The Container 
Runtime Interface was originally designed with Linux-based containers in mind, 
and it was impossible to implement support for Windows-based containers using 
CRI. This feature solves that problem, making it possible to specify a 
WindowsContainerConfig. 
1. [Debug Containers](https://github.com/kubernetes/features/issues/277) 
(alpha): It's easy to debug a container if you have the appropriate utilities. 
But what if you don't? This feature makes it possible to run debugging tools 
on a container even if those tools weren't included in the original container 
image. 
<div>## Other changes:1. Deployment (SIG-Cluster Lifecycle): [Support 
out-of-process and out-of-tree cloud 
providers](https://github.com/kubernetes/features/issues/88) (beta): As 
Kubernetes gains acceptance, more and more cloud providers will want to make 
it available. To do that more easily, the community is working on extracting 
provider-specific binaries so that they can be more easily replaced. 
1. Kubernetes on Azure (SIG-Azure): Kubernetes has a cluster-autoscaler that 
automatically adds nodes to your cluster if you're running too many workloads, 
but until now it wasn't available on Azure. The [Add Azure support to 
cluster-autoscaler](https://github.com/kubernetes/features/issues/514) (alpha) 
feature aims to fix that. Closely related, the [Add support for Azure Virtual 
Machine Scale Sets](https://github.com/kubernetes/features/issues/513) (alpha) 
feature makes use of Azure's own autoscaling capabilities to make resources 
available. 
You can download the Kubernetes 1.10 beta from 
[https://github.com/kubernetes/kubernetes/releases](https://github.com/kubernetes/kubernetes/releases). 
Again, if you've got feedback (and the community hopes you do) please add an 
issue to the [1.10 
milestone](https://github.com/kubernetes/kubernetes/milestone/37) and tag the 
relevant SIG before March 9. 
<i> 
(Many thanks to community members Michelle Au, Jan Šafránek, Eric Chiang, 
Michał Nasiadka, Radosław Pieczonka, Xing Yang, Daniel Smith, sylvain boily, 
Leo Sunmo, Michal Masłowski, Fernando Ripoll, ayodele abejide, Brett 
Kochendorfer, Andrew Randall, Casey Davenport, Duffie Cooley, Bryan 
Venteicher, Mark Ayers, Christopher Luciano, and Sandor Szuecs for their 
invaluable help in reviewing this article for accuracy.)</i> 