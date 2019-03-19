---
title: Adding Windows nodes and scheduling Windows containers in Kubernetes
toc_hide: true
---
## Motivation

Windows applications constitute a large portion of the services and applications that run in many organizations. [Windows containers](https://aka.ms/windowscontainers) provide a modern way to encapsulate processes and package dependencies, making it easier to use DevOps practices and follow cloud native patterns for Windows applications. Kubernetes has become the defacto standard container orchestrator, and the release of Kubernetes 1.14 includes production support for scheduling Windows containers on Windows nodes in a Kubernetes cluster, enabling a vast ecosystem of Windows applications to leverage the power of Kubernetes. Enterprises with investments in Windows-based applications and Linux-based applications don't have to look for separate orchestrators to manage their workloads, leading to increased operational efficiencies across their deployments, regardless of operating system. 


## Intro to Windows containers in Kubernetes

To enable the orchestration of Windows containers in Kubernetes, simply include Windows nodes in your existing Linux cluster. Scheduling Windows containers in [Pods](/docs/concepts/workloads/pods/pod-overview/) on Kubernetes is as simple and easy as scheduling Linux-based containers.

In order to run Windows containers, your Kubernetes cluster must include multiple operating systems, with control plane nodes running Linux and workers running either Windows or Linux depending on your workload needs. Windows Server 2019 is the only Windows operating system supported, enabling [Kubernetes Node](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) on Windows (including kubelet, [container runtime](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/containerd), and kube-proxy). For a detailed explanation of Windows distribution channels see the [Microsoft documentation](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19).

{{< note >}}
The Kubernetes control plane, including the [master components](/docs/concepts/overview/components/), will continue to run on Linux. There are no plans to have a Windows-only Kubernetes cluster.
{{< /note >}}

{{< note >}}
In this document, when we talk about Windows containers we mean Windows containers with process isolation. Windows containers with [Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container) is planned for a future release. 
{{< /note >}}

## Supported Functionality and Limitations

### Supported Functionality

#### Compute

From an API and kubectl perspective, Windows containers behave in much the same way as Linux-based containers. However, there are some notable differences in key functionality which are outlined in the limitation section.

Let's start with the operating system version. Refer to the following table for Windows operating system support in Kubernetes. A single heterogeneous Kubernetes cluster can have both Windows and Linux worker nodes. Windows containers have to be scheduled on Windows nodes and Linux containers on Linux nodes.

<table>
  <tr>
   <td>Kubernetes version
   </td>
   <td>Host OS version (Kubernetes Node)
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td><strong>Windows Server 1709</strong>
   </td>
   <td><strong>Windows Server 1803</strong>
   </td>
   <td><strong>Windows Server 1809/Windows Server 2019</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Kubernetes v1.14</strong>
   </td>
   <td>Not Supported
   </td>
   <td>Not Supported
   </td>
   <td>Supported for Windows Server containers Builds 17763.* with Docker EE-basic 18.09
   </td>
  </tr>
</table>

{{< note >}}
The Windows Server Host Operating System is subject to the [Windows Server ](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing) licensing. The Windows Container images are subject to the [Supplemental License Terms for Windows containers](https://docs.microsoft.com/en-us/virtualization/windowscontainers/images-eula).
{{< /note >}}
{{< note >}}
Windows containers with process isolation have strict compatibility rules, [where the host OS version must match the container base image OS version](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility). Once we support Windows containers with Hyper-V isolation in Kubernetes, the limitation and compatibility rules will change.
{{< /note >}}

Key Kubernetes elements work the same way in Windows as they do in Linux. In this section, we will talk about some of the key workload enablers and how they map to Windows.

* [Pods](/docs/concepts/workloads/pods/pod-overview/)

    A Pod is the basic building block of Kubernetes–the smallest and simplest unit in the Kubernetes object model that you create or deploy. The following Pod capabilities, properties and events are supported with Windows containers:

  * Single or multiple containers per Pod with process isolation and volume sharing
  * Pod status fields 
  * Readiness and Liveness probes
  * postStart & preStop container lifecycle events
  * ConfigMap, Secrets: as environment variables or volumes
  * EmptyDir
  * Named pipe host mounts
  * Resource limits
* [Controllers](/docs/concepts/workloads/controllers/)

    Kubernetes controllers handle the desired state of Pods. The following workload controllers are supported with Windows containers:

  * ReplicaSet
  * ReplicationController
  * Deployments
  * StatefulSets
  * DaemonSet
  * Job
  * CronJob
* [Services](/docs/concepts/services-networking/service/)

    A Kubernetes Service is an abstraction which defines a logical set of Pods and a policy by which to access them - sometimes called a micro-service. You can use services for cross-operating system connectivity. In Windows, services can utilize the following types, properties and capabilities:

  * Service Environment variables
  * NodePort
  * ClusterIP
  * LoadBalancer
  * ExternalName
  * Headless services

Pods, Controllers and Services are critical elements to managing Windows workloads on Kubernetes. However, on their own they are not enough to enable the proper lifecycle management of Windows workloads in a dynamic cloud native environment. We added support for the following features:

* Pod and container metrics
* Horizontal Pod Autoscaler support
* kubectl Exec
* Resource Quotas
* Scheduler preemption

#### Container Runtime

Docker EE-basic 18.09 is required on Windows Server 2019 / 1809 nodes for Kubernetes. This works with the dockershim code included in the kubelet. Additional runtimes such as CRI-ContainerD may be supported in later Kubernetes versions.

#### Storage

Kubernetes Volumes enable complex applications with data persistence and Pod volume sharing requirements to be deployed on Kubernetes. Kubernetes on Windows supports the following types of [volumes](/docs/concepts/storage/volumes/):

* FlexVolume out-of-tree plugin with [SMB and iSCSI](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows)support
* [azureDisk](/docs/concepts/storage/volumes/#azuredisk)
* [azureFile](/docs/concepts/storage/volumes/#azurefile)
* [gcePersistentDisk](/docs/concepts/storage/volumes/#gcepersistentdisk)

#### Networking

Networking for Windows containers is exposed through [CNI plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/). Windows containers function similarly to virtual machines in regards to networking. Each container has a virtual network adapter (vNIC) which is connected to a Hyper-V virtual switch (vSwitch). The Host Networking Service (HNS) and the Host Compute Service (HCS) work together to create containers and attach container vNICs to networks. HCS is responsible for the management of containers whereas HNS is responsible for the management of networking resources such as:

* Virtual networks (including creation of vSwitches)
* Endpoints / vNICs
* Namespaces
* Policies (Packet encapsulations, Load-balancing rules, ACLs, NAT'ing rules, etc.)

The following service spec types are supported:

* NodePort 
* ClusterIP
* LoadBalancer
* ExternalName

Windows supports five different networking drivers/modes: L2bridge, L2tunnel, Overlay, Transparent, and NAT. In a heterogeneous cluster with Windows and Linux worker nodes, you need to select a networking solution that is compatible on both Windows and Linux. The following out-of-tree plugins are supported on Windows, with recommendations on when to use each CNI:

<table>
  <tr>
   <td>Network Driver
   </td>
   <td>Description
   </td>
   <td>Container Packet Modifications
   </td>
   <td>Network Plugins
   </td>
   <td>Network Plugin Characteristics
   </td>
  </tr>
  <tr>
   <td>L2bridge
   </td>
   <td>Containers are attached to an external vSwitch. Containers are attached to the underlay network, although the physical network doesn't need to learn the container MACs because they are rewritten on ingress/egress. Inter-container traffic is bridged inside the container host. 
   </td>
   <td>MAC is rewritten to host MAC, IP remains the same.
   </td>
   <td><a href="https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-bridge">win-bridge</a>, <a href="https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md">Azure-CNI</a>, Flannel host-gateway uses win-bridge
   </td>
   <td>win-bridge uses L2bridge network mode, connects containers to the underlay of hosts, offering best performance. Requires L2 adjacency between container hosts
   </td>
  </tr>
  <tr>
   <td>L2Tunnel
   </td>
   <td>This is a special case of l2bridge, but only used on Azure. All packets are sent to the virtualization host where SDN policy is applied. 
   </td>
   <td>MAC rewritten, IP visible on the underlay network
   </td>
   <td><a href="https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md">Azure-CNI</a>
   </td>
   <td>Azure-CNI allows integration of containers with Azure vNET, and allows them to leverage the set of capabilities that <a href="https://azure.microsoft.com/en-us/services/virtual-network/ ">Azure Virtual Network provides</a>. For example, securely connect to Azure services or use Azure NSGs. See <a href=" https://docs.microsoft.com/en-us/azure/aks/concepts-network#azure-cni-advanced-networking">azure-cni for some examples</a>
   </td>
  </tr>
  <tr>
   <td>Overlay (Overlay networking for Windows in Kubernetes is in <strong>alpha</strong> stage)
   </td>
   <td>Containers are given a vNIC connected to an external vSwitch. Each overlay network gets its own IP subnet, defined by a custom IP prefix.The overlay network driver uses VXLAN encapsulation.
   </td>
   <td>Encapsulated with an outer header, inner packet remains the same.
   </td>
   <td><a href="https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-overlay">Win-overlay</a>, Flannel VXLAN (uses win-overlay)
   </td>
   <td>win-overlay should be used when virtual container networks are desired to be isolated from underlay of hosts (e.g. for security reasons). Allows for IPs to be re-used for different overlay networks (which have different VNID tags)  if you are restricted on IPs in your datacenter. This option may be used when the container hosts are not L2 adjacent but have L3 connectivity 
   </td>  
  </tr>
  <tr>
   <td>Transparent (special use case for <a href="https://github.com/openvswitch/ovn-kubernetes">ovn-kubernetes</a>)
   </td>
   <td>Requires an external vSwitch. Containers are attached to an external vSwitch which will enable intra-pod communication via logical networks (logical switches and routers).
   </td>
   <td>Packet is encapsulated either via <a href="https://datatracker.ietf.org/doc/draft-gross-geneve/">GENEVE</a> or <a href="https://datatracker.ietf.org/doc/draft-davie-stt/">STT</a> tunneling to reach pods which are not on the same host.

Packets are forwarded or dropped via the tunnel metadata information supplied by the ovn network controller.

NAT is done for north-south communication.
   </td>
   <td>
  <a href="https://github.com/openvswitch/ovn-kubernetes">ovn-kubernetes</a>
   </td>
   <td>
  <a href="https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib">Deploy via ansible</a>. Distributed ACLs can be applied via Kubernetes policies. IPAM support. Load-balancing can be achieved without kube-proxy. NATing is done without using iptables/netsh.
   </td>
  </tr>
  <tr>
   <td>NAT (<em>not used in Kubernetes</em>)
   </td>
   <td>Containers are given a vNIC connected to an internal vSwitch. DNS/DHCP is provided using an internal component called <a href="https://blogs.technet.microsoft.com/virtualization/2016/05/25/windows-nat-winnat-capabilities-and-limitations/">WinNAT</a>
   </td>
   <td>MAC and IP is rewritten to host MAC/IP.
   </td>
   <td><a href="https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat">nat</a>
   </td>
   <td>Included here for completeness
   </td>
  </tr>
</table>

As outlined above, the [Flannel](https://github.com/coreos/flannel) CNI [meta plugin](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel) is also supported on [Windows](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel#windows-support-experimental) via the [VXLAN network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) (**alpha support** ; delegates to win-overlay) and [host-gateway network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) (stable support; delegates to win-bridge). This plugin supports delegating to one of the reference CNI plugins (win-overlay, win-bridge), to work in conjunction with Flannel daemon on Windows (Flanneld) for automatic node subnet lease assignment and HNS network creation. This plugin reads in its own configuration file (net-conf.json), and aggregates it with the environment variables from the FlannelD generated subnet.env file. It then delegates to one of the reference CNI plugins for network plumbing, and sends the correct configuration containing the node-assigned subnet to the IPAM plugin (e.g. host-local).

For the node, pod, and service objects, the following network flows are supported for TCP/UDP traffic:

* Pod -> Pod (IP)
* Pod -> Pod (Name) 
* Pod -> Service (Cluster IP)
* Pod -> Service (PQDN, but only if there are no ".")
* Pod -> Service (FQDN)
* Pod -> External (IP)
* Pod -> External (DNS)
* Node -> Pod
* Pod -> Node

The following IPAM options are supported on Windows:

* [Host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* HNS IPAM (Inbox platform IPAM, this is a fallback when no IPAM is set)
* [Azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md) (for azure-cni only)

### Limitations

#### Control Plane

Windows is only supported as a worker node in the Kubernetes architecture and component matrix. This means that a Kubernetes cluster must always include Linux master nodes, zero or more Linux worker nodes, and zero or more Windows worker nodes.

#### Compute

##### Resource management and process isolation

 Linux cgroups are used as a pod boundary for resource controls in Linux. Containers are created within that boundary for network, process and file system isolation. The cgroups APIs can be used to gather cpu/io/memory stats. In contrast, Windows uses a Job object per container with a system namespace filter to contain all processes in a container and provide logical isolation from the host. There is no way to run a Windows container without the namespace filtering in place. This means that system privileges cannot be asserted in the context of the host, and thus privileged containers are not available on Windows. Containers cannot assume an identity from the host because the Security Account Manager (SAM) is separate.

##### Operating System Restrictions

Windows has strict compatibility rules, where the host OS version must match the container base image OS version. Only Windows containers with a container operating system of Windows Server 2019 are supported. Hyper-V isolation of containers, enabling some backward compatibility of Windows container image versions, is planned for a future release.

##### Feature Restrictions

* TerminationGracePeriod: not implemented
* Single file mapping: to be implemented with CRI-ContainerD
* Termination message: to be implemented with CRI-ContainerD
* Privileged Containers: not currently supported in Windows containers
* HugePages: not currently supported in Windows containers
* The existing node problem detector is Linux-only and requires privileged containers. In general, we don't expect this to be used on Windows because privileged containers are not supported
* Not all features of shared namespaces are supported (see API section for more details)

##### Memory Reservations and Handling

Windows does not have an out-of-memory process killer as Linux does. Windows always treats all user-mode memory allocations as virtual, and pagefiles are mandatory. The net effect is that Windows won't reach out of memory conditions the same way Linux does, and processes will page to disk instead of being subject to out of memory (OOM) termination. If memory is over-provisioned and all physical memory is exhausted, then paging can slow down performance.

Keeping memory usage within reasonable bounds is possible with a two-step process. First, use the kubelet parameters `--kubelet-reserve` and/or `--system-reserve` to account for memory usage on the node (outside of containers). This will reduce [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)). As you deploy workloads, use resource limits (must set only limits or limits must equal requests) on containers. This will also subtract from NodeAllocatable and prevent the scheduler from adding more pods once a node is full.

A best practice to avoid over-provisioning is to configure the kubelet with a system reserved memory of at least 2GB to account for Windows, Docker, and Kubernetes processes.

The behavior of the flags behave differently as described below:

* --kubelet-reserve, --system-reserve , and --eviction-hard flags update Node Allocatable
* Eviction by using --enforce-node-allocable is not implemented
* Eviction by using --eviction-hard and --eviction-soft are not implemented
* MemoryPressure Condition is not implemented
* There are no OOM eviction actions taken by the kubelet
* Kubelet running on the windows node does not have memory restrictions. --kubelet-reserve and --system-reserve do not set limits on kubelet or processes running the host. This means kubelet or a process on the host could cause memory resource starvation outside the node-allocatable and scheduler

#### Storage

Windows has a layered filesystem driver to mount container layers and create a copy filesystem based on NTFS. All file paths in the container are resolved only within the context of that container.

* Volume mounts can only target a directory in the container, and not an individual file
* Volume mounts cannot project files or directories back to the host filesystem
* Read-only filesystems are not supported because write access is always required for the Windows registry and SAM database. However, read-only volumes are supported
* Volume user-masks and permissions are not available. Because the SAM is not shared between the host & container, there's no mapping between them. All permissions are resolved within the context of the container

As a result, the following storage functionality is not supported on Windows nodes

* Volume subpath mounts. Only the entire volume can be mounted in a Windows container.
* Subpath volume mounting for Secrets
* Host mount projection
* DefaultMode (due to UID/GID dependency)
* Read-only root filesystem. Mapped volumes still support readOnly
* Block device mapping
* Memory as the storage medium
* CSI plugins which require privileged containers
* File system features like uui/guid, per-user Linux filesystem permissions
* NFS based storage/volume support

#### Networking

Windows Container Networking differs in some important ways from Linux networking. The [Microsoft documentation for Windows Container Networking](https://docs.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture) contains additional details and background.

The Windows host networking networking service and virtual switch implement namespacing and can create virtual NICs as needed for a pod or container. However, many configurations such as DNS, routes, and metrics are stored in the Windows registry database rather than /etc/... files as they are on Linux. The Windows registry for the container is separate from that of the host, so concepts like mapping /etc/resolv.conf from the host into a container don't have the same effect they would on Linux. These must be configured using Windows APIs run in the context of that container. Therefore CNI implementations need to call the HNS instead of relying on file mappings to pass network details into the pod or container.

The following networking functionality is not supported on Windows nodes

* Host networking mode is not available for Windows pods
* Local NodePort access from the node itself will fail (works for other nodes or external clients)
* Accessing service VIPs from nodes will be available with a future release of Windows Server 
* Overlay networking support in kube-proxy is an alpha release. In addition, it requires [KB4482887](https://support.microsoft.com/en-us/help/4482887/windows-10-update-kb4482887) to be installed on Windows Server 2019
* Outbound communication using the ICMP protocol via the win-overlay, win-bridge, and Azure-CNI plugin. Specifically, the Windows data plane ([VFP](https://www.microsoft.com/en-us/research/project/azure-virtual-filtering-platform/)) doesn't support ICMP packet transpositions. This means:
  * ICMP packets directed to destinations within the same network (e.g. pod to pod communication via ping) will work as expected and without any limitations
  * TCP/UDP packets will work as expected and without any limitations
  * ICMP packets directed to pass through a remote network (e.g. pod to external internet communication via ping) cannot be transposed and thus will not be routed back to their source
  * Since TCP/UDP packets can still be transposed, one can substitute **ping <destination>** with **curl <destination>** to be able to debug connectivity to the outside world.

##### CNI Plugins

* Windows reference network plugins win-bridge and win-overlay do not currently implement [CNI spec](https://github.com/containernetworking/cni/blob/master/SPEC.md) v0.4.0 due to missing "CHECK" implementation.
* The Flannel VXLAN CNI has the following limitations on Windows:

1. Node-pod connectivity isn't possible by design. It's only possible for local pods with Flannel [PR 1096](https://github.com/coreos/flannel/pull/1096)
2. We are restricted to using VNI 4096 and UDP port 4789. The VNI limitation is being worked on and will be overcome (open-source flannel changes). See official [Flannel VXLAN ](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)backend docs for more details on these parameters.

##### DNS {#dns-limitations}

* ClusterFirstWithHostNet is not supported for DNS. Windows treats all names with a '.' as a FQDN and skips PQDN resolution
* On Linux, you have a DNS suffix list, which is used when trying to resolve PQDNs. On Windows, we only have 1 DNS suffix, which is the DNS suffix associated with that pod's namespace (mydns.svc.cluster.local for example). Windows can resolve FQDNs and services or names resolvable with just that suffix. For example, a pod spawned in the default namespace, will have the DNS suffix **default.svc.cluster.local**. On a Windows pod, we will be able to resolve both **kubernetes.default.svc.cluster.local** and **kubernetes**, but not the in-betweens, like **kubernetes.default** or **kubernetes.default.svc**.

##### Security

Secrets are written in clear text on the node's volume (as compared to tmpfs/in-memory on linux). This means customers have to do two things

1. Use file ACLs to secure the secrets file location
2. Use volume-level encryption using [BitLocker](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server)

[RunAsUser ](/docs/concepts/policy/pod-security-policy/#users-and-groups)is not currently supported on Windows. The workaround is to create local accounts before packaging the container. The RunAsUsername capability may be added in a future release.

Linux specific pod security context privileges such as SELinux, AppArmor, Seccomp, Capabilities (POSIX Capabilities), and others are not supported. 

In addition, as mentioned already, privileged containers are not supported on Windows.

#### API

There are no differences in how most of the Kubernetes APIs work for Windows. The subtleties around what's different come down to differences in the OS and container runtime. In certain situations, some properties on workload APIs such as Pod or Container were designed with an assumption that they are implemented on Linux, failing to run on Windows. 

At a high level, these OS concepts are different:

* Identity - Linux uses userID (UID) and groupID (GID) which are represented as integer types. User and group names are not canonical - they are just an alias in /etc/groups or /etc/passwd back to UID+GID. Windows uses a larger binary security identifier (SID) which is stored in the Windows Security Access Manager (SAM) database. This database is not shared between the host and containers, or between containers.
* File permissions - Windows uses an access control list based on SIDs, rather than a bitmask of permissions and UID+GID
* File paths - convention on Windows is to use **\** instead of **/**. The Go IO libraries typically accept both and just make it work, but when you're setting a path or command line that's interpreted inside a container, **\** may be needed.
* Signals - Windows interactive apps handle termination differently, and can implement one or more of these:
  * A UI thread will handle well-defined messages including WM_CLOSE
  * Console apps will handle ctrl-c or ctrl-break using a Control Handler
  * Services will register a Service Control Handler function that can accept SERVICE_CONTROL_STOP control codes

Exit Codes follow the same convention where 0 is success, nonzero is failure. The specific error codes may differ across Windows and Linux. However, exit codes passed from the Kubernetes components (kubelet, kube-proxy) will be unchanged.

##### V1.Container

* V1.Container.ResourceRequirements.limits.cpu and V1.Container.ResourceRequirements.limits.memory - Windows doesn't use hard limits for CPU allocations. Instead, a share system is used. The existing fields based on millicores are scaled into relative shares that are followed by the Windows scheduler. [see: kuberuntime/helpers_windows.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/kuberuntime/helpers_windows.go), [see: resource controls in Microsoft docs](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/resource-controls) 
  * Huge pages are not implemented in the Windows container runtime, and are not available. They require [asserting a user privilege](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support) that's not configurable for containers.
* V1.Container.ResourceRequirements.requests.cpu and V1.Container.ResourceRequirements.requests.memory - Requests are subtracted from node available resources, so they can be used to avoid overprovisioning a node. However, they cannot be used to guarantee resources in an overprovisioned node. They should be applied to all containers as a best practice if the operator wants to avoid overprovisioning entirely.
* V1.Container.SecurityContext.allowPrivilegeEscalation - not possible on Windows, none of the capabilities are hooked up
* V1.Container.SecurityContext.Capabilities - POSIX capabilities are not implemented on Windows
* V1.Container.SecurityContext.privileged - Windows doesn't support privileged containers
* V1.Container.SecurityContext.procMount - Windows doesn't have a /proc filesystem
* V1.Container.SecurityContext.readOnlyRootFilesystem - not possible on Windows, write access is required for registry & system processes to run inside the container
* V1.Container.SecurityContext.runAsGroup - not possible on Windows, no GID support
* V1.Container.SecurityContext.runAsNonRoot - Windows does not have a root user. The closest equivalent is ContainerAdministrator which is an identity that doesn't exist on the node.
* V1.Container.SecurityContext.runAsUser - not possible on Windows, no UID support as int. 
* V1.Container.SecurityContext.seLinuxOptions - not possible on Windows, no SELinux
* V1.Container.terminationMessagePath - this has some limitations in that Windows doesn't support mapping single files. The default value is /dev/termination-log, which does work because it does not exist on Windows by default.

##### V1.Pod

* V1.Pod.hostIPC, v1.pod.hostpid - host namespace sharing is not possible on Windows
* V1.Pod.hostNetwork - There is no Windows OS support to share the host network
* V1.Pod.dnsPolicy - ClusterFirstWithHostNet - is not supported because Host Networking is not supported on Windows.
* V1.Pod.podSecurityContext - see [V1.PodSecurityContext](https://github.com/kubernetes/enhancements/blob/master/keps/sig-windows/20190103-windows-node-support.md#v1podsecuritycontext)
* V1.Pod.shareProcessNamespace - this is a beta feature, and depends on Linux namespaces which are not implemented on Windows. Windows cannot share process namespaces or the container's root filesystem. Only the network can be shared.
* V1.Pod.terminationGracePeriodSeconds - this is not fully implemented in Docker on Windows, see: [reference](https://github.com/moby/moby/issues/25982). The behavior today is that the ENTRYPOINT process is sent CTRL_SHUTDOWN_EVENT, then Windows waits 5 seconds by default, and finally shuts down all processes using the normal Windows shutdown behavior. The 5 second default is actually in the Windows registry [inside the container](https://github.com/moby/moby/issues/25982#issuecomment-426441183), so it can be overridden when the container is built.
* V1.Pod.volumeDevices - this is a beta feature, and is not implemented on Windows. Windows cannot attach raw block devices to pods.
* V1.Pod.volumes - EmptyDir, Secret, ConfigMap, HostPath - all work and have tests in TestGrid
  * V1.emptyDirVolumeSource - the Node default medium is disk on Windows. Memory is not supported, as Windows does not have a built-in RAM disk.
* V1.VolumeMount.mountPropagation - only MountPropagationHostToContainer is available. Windows cannot create mounts within a pod or project them back to the node.

##### V1.PodSecurityContext

None of the PodSecurityContext fields work on Windows. They're listed here for reference.

* V1.PodSecurityContext.SELinuxOptions - SELinux is not available on Windows
* V1.PodSecurityContext.RunAsUser - provides a UID, not available on Windows
* V1.PodSecurityContext.RunAsGroup - provides a GID, not available on Windows
* V1.PodSecurityContext.RunAsNonRoot - Windows does not have a root user. The closest equivalent is ContainerAdministrator which is an identity that doesn't exist on the node.
* V1.PodSecurityContext.SupplementalGroups - provides GID, not available on Windows
* V1.PodSecurityContext.Sysctls - these are part of the Linux sysctl interface. There's no equivalent on Windows.

# User Guide: Add Windows Nodes in Kubernetes {#UG-windows-nodes}

## Objectives

The Kubernetes platform can now be used to run both Linux and Windows containers. One or more Windows nodes can be registered to a cluster. This guide shows how to:

* Register a Windows node to the cluster
* Configure networking so pods on Linux and Windows can communicate

## Before you begin

* Obtain a [Windows Server license](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing) in order to run the Windows node that will execute the Windows container. You can use your organization's licenses for the cluster, or acquire one from Microsoft, a reseller, or via the major cloud providers such as GCP, AWS, and Azure by provisioning a virtual machine running Windows Server through their marketplaces. A [time-limited trial](https://www.microsoft.com/en-us/cloud-platform/windows-server-trial) is also available.
* Build a Linux-based Kubernetes cluster in which you have access to the control plane (some examples include [Getting Started from Scratch](/docs/setup/scratch/), [kubeadm](/docs/setup/independent/create-cluster-kubeadm/), [AKS Engine](/docs/setup/turnkey/azure/), [GCE](/docs/setup/turnkey/gce/), [AWS](/docs/setup/turnkey/aws/)).

## Getting Started: Adding a Windows Node to Your Cluster

### Plan IP Addressing

Kubernetes cluster management requires careful planning of your IP addresses so that you do not inadvertently cause network collision. This guide assumes that you are familiar with the [Kubernetes networking concepts](/docs/concepts/cluster-administration/networking/).

In order to deploy your cluster you will need the following address spaces:

<table>
  <tr>
   <td>Subnet / address range
   </td>
   <td>Description
   </td>
   <td>Default value
   </td>
  </tr>
  <tr>
   <td>---
   </td>
   <td>---
   </td>
   <td>---
   </td>
  </tr>
  <tr>
  <tr>
   <td>Service Subnet
   </td>
   <td>A non-routable, purely virtual subnet that is used by pods to uniformly access services without caring about the network topology. It is translated to/from routable address space by <code>kube-proxy</code> running on the nodes.
   </td>
   <td>"10.96.0.0/12"
   </td>
  </tr>
  <tr>
   <td>Cluster Subnet
   </td>
   <td>This is a global subnet that is used by all pods in the cluster. Each node is assigned a smaller /24 subnet from this for their pods to use. It must be large enough to accommodate all pods used in your cluster. To calculate <em>minimumsubnet</em> size:<code> (number of nodes) + (number of nodes * maximum pods per node that you configure)</code>
Example: for a 5 node cluster for 100 pods per node: <code>(5) + (5 * 100) = 505.</code>
   </td>
   <td>"10.244.0.0/16"
   </td>
  </tr>
  <tr>
   <td>Kubernetes DNS Service IP
   </td>
   <td>IP address of <code>kube-dns</code> service that will be used for DNS resolution & cluster service discovery.
   </td>
   <td>"10.96.0.10"
   </td>
  </tr>
</table>

Review the networking options supported in 'Intro to Windows containers in Kubernetes: Supported Functionality: Networking' to determine how you need to allocate IP addresses for your cluster.

### Components that run on Windows

While the Kubernetes control plane runs on your Linux node(s), the following components will be configured and run on your Windows node(s).

1. kubelet
2. kube-proxy
3. kubectl (optional)
4. Container runtime

Get the latest binaries from [https://github.com/kubernetes/kubernetes/releases](https://github.com/kubernetes/kubernetes/releases), starting with v1.14 or later. The Windows-amd64 binaries for kubeadm, kubectl, kubelet, and kube-proxy can be found under the CHANGELOG link.

### Networking Configuration

Once you have a Linux-based Kubernetes master node you are ready to choose a networking solution. This guide illustrates using Flannel in VXLAN mode for simplicity.

#### Configuring Flannel in VXLAN mode on the Linux controller

1. Prepare Kubernetes master for Flannel

    Some minor preparation is recommended on the Kubernetes master in our cluster. It is recommended to enable bridged IPv4 traffic to iptables chains when using Flannel. This can be done using the following command:

    ```bash
    sudo sysctl net.bridge.bridge-nf-call-iptables=1
    ```

1. Download & configure Flannel

    Download the most recent Flannel manifest:

    ```bash
    wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
    ```

    There are two sections you should modify to enable the vxlan networking backend:

    After applying the steps below, the `net-conf.json` section of `kube-flannel.yml` should look as follows:

    ```json
    net-conf.json: |
        {
          "Network": "10.244.0.0/16",
          "Backend": {
            "Type": "vxlan",
            "VNI" : 4096,
            "Port": 4789
          }
        }
    ```

1. In the `net-conf.json` section of your `kube-flannel.yml`, double-check:
    1. The cluster subnet (e.g. "10.244.0.0/16") is set as per your IP plan.
        * VNI 4096 is set in the backend
        * Port 4789 is set in the backend
    2. In the `cni-conf.json` section of your `kube-flannel.yml`, change the network name to `vxlan0`.
    
{{< note >}}
The VNI must be set to 4096 and port 4789 for Flannel on Linux to interoperate with Flannel on Windows. Support for other VNIs is coming soon. See [VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) for an explanation of these fields.
{{< /note >}}    

    Your `cni-conf.json` should look as follows:

    ```json
    cni-conf.json: |
        {
          "name": "vxlan0",
          "plugins": [
            {
              "type": "flannel",
              "delegate": {
                "hairpinMode": true,
                "isDefaultGateway": true
              }
            },
            {
              "type": "portmap",
              "capabilities": {
                "portMappings": true
              }
            }
          ]
        }
    ```

1. Apply the Flannel yaml and Validate

    Let's apply the Flannel configuration:

    ```bash
    kubectl apply -f kube-flannel.yml
    ```

    Next, since the Flannel pods are Linux-based, apply a NodeSelector patch, which can be found [here](https://github.com/Microsoft/SDN/blob/1d5c055bb195fecba07ad094d2d7c18c188f9d2d/Kubernetes/flannel/l2bridge/manifests/node-selector-patch.yml), to the Flannel DaemonSet pod:

    ```bash
    kubectl patch ds/kube-flannel-ds-amd64 --patch "$(cat node-selector-patch.yml)" -n=kube-system
    ```

    After a few minutes, you should see all the pods as running if the Flannel pod network was deployed.

    ```bash
    kubectl get pods --all-namespaces
    ```

    ![alt_text](flannel-master-kubeclt-get-pods.png "flannel master kubectl get pods screen capture")

    Verify that the Flannel DaemonSet has the NodeSelector applied.

    ```bash
    kubectl get ds -n kube-system
    ```

    ![alt_text](flannel-master-kubectl-get-ds.png "flannel master kubectl get ds screen capture")

#### Join Windows Worker

In this section we'll cover configuring a Windows node from scratch to join a cluster on-prem. If your cluster is on a cloud you'll likely want to follow the cloud specific guides in the next section.

#### Preparing a Windows Node
{{< note >}}
All code snippets in Windows sections are to be run in a PowerShell environment with elevated permissions (Admin).
{{< /note >}}

1. Install Docker (requires a system reboot)

    Kubernetes uses [Docker](https://www.docker.com/) as its container engine, so we need to install it. You can follow the [official Docs instructions](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-docker/configure-docker-daemon#install-docker), the [Docker instructions](https://store.docker.com/editions/enterprise/docker-ee-server-windows), or try the following *recommended* steps:

    ```PowerShell
    Enable-WindowsOptionalFeature -FeatureName Containers
    Restart-Computer -Force
    Install-Module -Name DockerMsftProvider -Repository PSGallery -Force
    Install-Package -Name Docker -ProviderName DockerMsftProvider
    ```

    If you are behind a proxy, the following PowerShell environment variables must be defined:

    ```PowerShell
    [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
    [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
    ```

    If after reboot you see the following error, you need to restart the docker service manually

    ![alt_text](windows-docker-error.png "windows docker error screen capture")    

    ```PowerShell
    Start-Service docker
    ```

{{< note >}}
The "pause" (infrastructure) image is hosted on Microsoft Container Registry (MCR) and the DOCKERFILE is available at [https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/Dockerfile](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/Dockerfile) 
{{< /note >}}

    ```PowerShell
    docker pull mcr.microsoft.com/k8s/core/pause:1.0.0
    ```

1. Prepare a Windows directory for Kubernetes

    Create a "Kubernetes for Windows" directory to store Kubernetes binaries as well as any deployment scripts and config files.

    ```PowerShell
    mkdir c:\k
    ```

1. Copy Kubernetes certificate

    Copy the Kubernetes certificate file `$HOME/.kube/config` [from the Linux controller](https://docs.microsoft.com/en-us/virtualization/windowscontainers/kubernetes/creating-a-linux-master#collect-cluster-information) to this new `C:\k` directory on your Windows node.

    Tip: You can use tools such as [xcopy](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/xcopy), [WinSCP](https://winscp.net/eng/download.php), or this [PowerShell wrapper for WinSCP](https://www.powershellgallery.com/packages/WinSCP/5.13.2.0) to transfer the config file between nodes.

1. Download Kubernetes binaries

    To be able to run Kubernetes, you first need to download the `kubelet` and `kube-proxy` binaries. You download these from the Node Binaries links in the CHANGELOG.md file of the [latest releases](https://github.com/kubernetes/kubernetes/releases/). For example 'kubernetes-node-windows-amd64.tar.gz'. You may also optionally download `kubectl` to run on Windows which you can find under Client Binaries.

    Use the [Expand-Archive](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.archive/expand-archive?view=powershell-6) PowerShell command to extract the archive and place the binaries into `C:\k`.

#### Join the Windows node to the Flannel cluster

The Flannel overlay deployment scripts and documentation are available in [this repository](https://github.com/Microsoft/SDN/tree/master/Kubernetes/flannel/overlay). The following steps are a simple walkthrough of the more comprehensive instructions available there.

Download the [Flannel start.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1) script, the contents of which should be extracted to `C:\k`:

```PowerShell
cd c:\k
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
wget https://raw.githubusercontent.com/Microsoft/SDN/master/Kubernetes/flannel/start.ps1 -o c:\k\start.ps1
```

{{< note >}}
[start.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1) references [install.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/install.ps1), which will download additional files such as the `flanneld` executable and the [Dockerfile for infrastructure pod](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/Dockerfile) and install those for you. For overlay networking mode, the [firewall](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/helper.psm1#L111) will be opened for local UDP port 4789. There may be multiple powershell windows being opened/closed as well as a few seconds of network outage while the new external vSwitch for the pod network is being created the first time. Run the script using the arguments as specified below:
{{< /note >}}

```PowerShell
.\start.ps1 -ManagementIP <Windows Node IP> -NetworkMode overlay  -ClusterCIDR <Cluster CIDR> -ServiceCIDR <Service CIDR> -KubeDnsServiceIP <Kube-dns Service IP> -LogDir <Log directory>
```

<table>
  <tr>
   <td>
Parameter
   </td>
   <td>Default Value
   </td>
   <td>Notes
   </td>
  </tr>
  <tr>
   <td>
---
   </td>
   <td>---
   </td>
   <td>---
   </td>
  </tr>
  <tr>
   <td>-ManagementIP
   </td>
   <td>N/A (required)
   </td>
   <td>The IP address assigned to the Windows node. You can use <code>ipconfig</code> to find this.
   </td>
  </tr>
  <tr>
   <td>-NetworkMode
   </td>
   <td>l2bridge
   </td>
   <td>We're using <code>overlay</code> here
   </td>
  </tr>
  <tr>
   <td>-ClusterCIDR
   </td>
   <td>10.244.0.0/16
   </td>
   <td>Refer to your cluster IP plan
   </td>
  </tr>
  <tr>
   <td>-ServiceCIDR
   </td>
   <td>10.96.0.0/12
   </td>
   <td>Refer to your cluster IP plan
   </td>
  </tr>
  <tr>
   <td>-KubeDnsServiceIP
   </td>
   <td>10.96.0.10
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>-InterfaceName
   </td>
   <td>Ethernet
   </td>
   <td>The name of the network interface of the Windows host. You can use <code>ipconfig</code> to find this.
   </td>
  </tr>
  <tr>
   <td>-LogDir
   </td>
   <td>C:\k
   </td>
   <td>The directory where kubelet and kube-proxy logs are redirected into their respective output files.
   </td>
  </tr>
</table>

Now you can view the Windows nodes in your cluster by running the following:

```bash
kubectl get nodes
```

{{< note >}}
You may want to configure your Windows node components like kubelet and kube-proxy to run as services. View the services and background processes section under [troubleshooting](#troubleshooting) for additional instructions. Once you are running the node components as services, collecting logs becomes an important part of troubleshooting. View the [gathering logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs) section of the contributing guide for further instructions.
{{< /note >}}

### Public Cloud Providers

#### Azure

AKS-Engine can deploy a complete, customizable Kubernetes cluster with both Linux & Windows nodes. There is a step-by-step walkthrough available in the [docs on GitHub](https://github.com/Azure/aks-engine/blob/master/docs/topics/windows.md).

#### GCP

Users can easily deploy a complete Kubernetes cluster on GCE following this step-by-step walkthrough on [GitHub](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/windows/README-GCE-Windows-kube-up.md)

#### Deployment with kubeadm and cluster API

Kubeadm is becoming the de facto standard for users to deploy a Kubernetes cluster. Windows node support in kubeadm will come in a future release. We are also making investments in cluster API to ensure Windows nodes are properly provisioned.

#### Next Steps

Now that you've configured a Windows worker in your cluster to run Windows containers you may want to add one or more Linux nodes as well to run Linux containers. Now you're ready to proceed to the next step to schedule Windows containers on your cluster.

# User Guide: Scheduling Windows containers in Kubernetes

## Objectives

* Configure an example deployment to run Windows containers on the Windows node
* (Optional) Configure an Active Directory Identity for your Pod using Group Managed Service Accounts (GMSA)

## Before you begin

* Create a Kubernetes cluster that includes a [master and a worker node running Windows Server](#UG-windows-nodes)
* It is important to note that creating and deploying services and workloads on Kubernetes behaves in much the same way for Linux and Windows containers. [Kubectl commands](/docs/reference/kubectl/overview/) to interface with the cluster are identical. The example in the section below is provided simply to jumpstart your experience with Windows containers.

## Getting Started: Deploying a Windows container

To deploy a Windows container on Kubernetes, you must first create an example application. The example YAML file below creates a simple webserver application. Create a service spec named `win-webserver.yaml` with the contents below:

```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: win-webserver
      labels:
        app: win-webserver
    spec:
      ports:
      # the port that this service should serve on
      - port: 80
        targetPort: 80
      selector:
        app: win-webserver
      type: NodePort
    ---
    apiVersion: extensions/v1beta1
    kind: Deployment
    metadata:
      labels:
        app: win-webserver
      name: win-webserver
    spec:
      replicas: 2
      template:
        metadata:
          labels:
            app: win-webserver
          name: win-webserver
        spec:
          containers:
          - name: windowswebserver
            image: mcr.microsoft.com/windows/servercore:ltsc2019
            command:
            - powershell.exe
            - -command
            - "<#code used from https://gist.github.com/wagnerandrade/5424431#> ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add('http://*:80/') ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at http://*:80/') ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count += $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$ip=(Get-NetAdapter | Get-NetIpAddress); $$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString+='<p>IP {0} callerCount {1} ' -f $$ip[1].IPAddress,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
          nodeSelector:
            beta.kubernetes.io/os: windows
```

{{< note >}}
Port mapping is also supported, but for simplicity in this example the container port 80 is exposed directly to the service.
{{< /note >}}

1. Check that all nodes are healthy:

    ```bash
    kubectl get nodes
    ```

1. Deploy the service and watch for pod updates:

    ```bash
    kubectl apply -f win-webserver.yaml
    kubectl get pods -o wide -w
    ```

    When the service is deployed correctly both Pods will be marked as Ready. To exit the watch command, press Ctrl+C.

1. Check that the deployment succeeded. To verify:

    * Two containers per pod on the Windows node, use `docker ps` 
    * Two pods listed from the Linux master, use `kubectl get pods` 
    * Node-to-pod communication across the network, `curl` port 80 of your pod IPs from the Linux master to check for a web server response
    * Pod-to-pod communication, ping between pods (and across hosts, if you have more than one Windows node) using docker exec or kubectl exec
    * Service-to-pod communication, `curl` the virtual service IP (seen under `kubectl get services`) from the Linux master and from individual pods
    * Service discovery, `curl` the service name with the Kubernetes [default DNS suffix](/docs/concepts/services-networking/dns-pod-service/#services)
    * Inbound connectivity, `curl` the NodePort from the Linux master or machines outside of the cluster
    * Outbound connectivity, `curl` external IPs from inside the pod using kubectl exec

{{< note >}}
Windows container hosts are not able to access the IP of services scheduled on them due to current platform limitations of the Windows networking stack. Only Windows pods are able to access service IPs.
{{< /note >}}

## Managing Workload Identity with Group Managed Service Accounts

Starting with Kubernetes v1.14, Windows container workloads can be configured to use Group Managed Service Accounts (GMSA). Group Managed Service Accounts are a specific type of Active Directory account that provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers. Containers configured with a GMSA can access external Active Directory Domain resources while carrying the identity configured with the GMSA. Learn more about configuring and using GMSA for Windows containers [here](/docs/tasks/configure-pod-container/configure-gmsa.md).

## Taints and Tolerations

Users today will need to use some combination of taints and node selectors in order to keep Linux and Windows workloads on their respective OS-specific nodes. This will likely impose a burden only on Windows users. The recommended approach is outlined below, with one of its main goals being that this approach should not break compatibility for existing Linux workloads.

### Ensuring OS-specific workloads land on the appropriate container host

Users can ensure Windows containers can be scheduled on the appropriate host using Taints and Tolerations. All Kubernetes nodes today have the following default labels:

* beta.kubernetes.io/os = [windows|linux]
* beta.kubernetes.io/arch = [amd64|arm64|...]

If a Pod specification does not specify a nodeSelector like `"beta.kubernetes.io/os": windows`, it is possible the Pod can be scheduled on any host, Windows or Linux. This can be problematic since a Windows container can only run on Windows and a Linux container can only run on Linux. The best practice is to use a nodeSelector.

However, we understand that in many cases users have a pre-existing large number of deployments for Linux containers, as well as an ecosystem of off-the-shelf configurations, such as community Helm charts, and programmatic Pod generation cases, such as with Operators. In those situations, you may be hesitant to make the configuration change to add nodeSelectors. The alternative is to use Taints. Because the kubelet can set Taints during registration, it could easily be modified to automatically add a taint when running on Windows only.

For example:  `--register-with-taints='os=Win1809:NoSchedule'`

By adding a taint to all Windows nodes, nothing will be scheduled on them (that includes existing Linux Pods). In order for a Windows Pod to be scheduled on a Windows node, it would need both the nodeSelector to choose Windows, and the appropriate matching toleration.

```yaml
nodeSelector:
    "beta.kubernetes.io/os": windows
tolerations:
    - key: "os"
      operator: "Equal"
      value: "Win1809"
      effect: "NoSchedule"
```

# Getting Help and Troubleshooting {#troubleshooting}

Your main source of help for troubleshooting your Kubernetes cluster should start with this [section](/docs/tasks/debug-application-cluster/troubleshooting/). Some additional, Windows-specific troubleshooting help is included in this section. Logs are an important element of troubleshooting issues in Kubernetes. Make sure to include them any time you seek troubleshooting assistance from other contributors. Follow the instructions in the SIG-Windows [contributing guide on gathering logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs).

1. How do I know start.ps1 completed successfully?

    You should see kubelet, kube-proxy, and (if you chose Flannel as your networking solution) flanneld host-agent processes running on your node, with running logs being displayed in separate PowerShell windows. In addition to this, your Windows node should be listed as "Ready" in your Kubernetes cluster.

1. Can I configure the Kubernetes node processes to run in the background as services?

    Kubelet and kube-proxy are already configured to run as native Windows Services, offering resiliency by re-starting the services automatically in the event of failure (for example a process crash). You have two options for configuring these node components as services.

    1. As native Windows Services

        Kubelet & kube-proxy can be run as native Windows Services using `sc.exe`.

        ```powershell
        # Create the services for kubelet and kube-proxy in two separate commands
        sc.exe create <component_name> binPath= "<path_to_binary> --service <other_args>"

        # Please note that if the arguments contain spaces, they must be escaped.
        sc.exe create kubelet binPath= "C:\kubelet.exe --service --hostname-override 'minion' <other_args>"

        # Start the services
        Start-Service kubelet
        Start-Service kube-proxy

        # Stop the service
        Stop-Service kubelet (-Force)
        Stop-Service kube-proxy (-Force)

        # Query the service status
        Get-Service kubelet
        Get-Service kube-proxy
        ```

    1. Using nssm.exe

        You can also always use alternative service managers like [nssm.exe](https://nssm.cc/) to run these processes (flanneld, kubelet & kube-proxy) in the background for you. You can use this [sample script](https://github.com/Microsoft/SDN/tree/master/Kubernetes/flannel/register-svc.ps1), leveraging nssm.exe to register kubelet, kube-proxy, and flanneld.exe to run as Windows services in the background.
        
        ```powershell
        register-svc.ps1 -NetworkMode <Network mode> -ManagementIP <Windows Node IP> -ClusterCIDR <Cluster subnet> -KubeDnsServiceIP <Kube-dns Service IP> -LogDir <Directory to place logs>
        
        # NetworkMode      = The network mode l2bridge (flannel host-gw, also the default value) or overlay (flannel vxlan) chosen as a network solution
        # ManagementIP     = The IP address assigned to the Windows node. You can use ipconfig to find this
        # ClusterCIDR      = The cluster subnet range. (Default value 10.244.0.0/16)
        # KubeDnsServiceIP = The Kubernetes DNS service IP (Default value 10.96.0.10)
        # LogDir           = The directory where kubelet and kube-proxy logs are redirected into their respective output files (Default value C:\k)
        ```
        
        If the above referenced script is not suitable, you can manually configure nssm.exe using the following examples.
        ```powershell
        # Register flanneld.exe
        nssm install flanneld C:\flannel\flanneld.exe
        nssm set flanneld AppParameters --kubeconfig-file=c:\k\config --iface=<ManagementIP> --ip-masq=1 --kube-subnet-mgr=1
        nssm set flanneld AppEnvironmentExtra NODE_NAME=<hostname>
        nssm set flanneld AppDirectory C:\flannel 
        nssm start flanneld
        
        # Register kubelet.exe
        nssm install kubelet C:\k\kubelet.exe
        nssm set kubelet AppParameters --hostname-override=<hostname> --v=6 --pod-infra-container-image=kubeletwin/pause --resolv-conf="" --allow-privileged=true --enable-debugging-handlers --cluster-dns=<DNS-service-IP> --cluster-domain=cluster.local --kubeconfig=c:\k\config --hairpin-mode=promiscuous-bridge --image-pull-progress-deadline=20m --cgroups-per-qos=false  --log-dir=<log directory> --logtostderr=false --enforce-node-allocatable="" --network-plugin=cni --cni-bin-dir=c:\k\cni --cni-conf-dir=c:\k\cni\config
        nssm set kubelet AppDirectory C:\k
        nssm start kubelet
  
        # Register kube-proxy.exe (l2bridge / host-gw)
        nssm install kube-proxy C:\k\kube-proxy.exe
        nssm set kube-proxy AppDirectory c:\k
        nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --hostname-override=<hostname>--kubeconfig=c:\k\config --enable-dsr=false --log-dir=<log directory> --logtostderr=false
        nssm.exe set kube-proxy AppEnvironmentExtra KUBE_NETWORK=cbr0
        nssm set kube-proxy DependOnService kubelet
        nssm start kube-proxy
  
        # Register kube-proxy.exe (overlay / vxlan)
        nssm install kube-proxy C:\k\kube-proxy.exe
        nssm set kube-proxy AppDirectory c:\k
        nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --feature-gates="WinOverlay=true" --hostname-override=<hostname> --kubeconfig=c:\k\config --network-name=vxlan0 --source-vip=<source-vip> --enable-dsr=false --log-dir=<log directory> --logtostderr=false
        nssm set kube-proxy DependOnService kubelet
        nssm start kube-proxy
        ```
        
        
        For initial troubleshooting, you can use the following flags in [nssm.exe](https://nssm.cc/) to redirect stdout and stderr to a output file:

        ```powershell
        nssm set <Service Name> AppStdout C:\k\mysvc.log
        nssm set <Service Name> AppStderr C:\k\mysvc.log
        ```

        For additional details, see official [nssm usage](https://nssm.cc/usage) docs.

1. My Windows Pods do not have network connectivity

    If you are using virtual machines, ensure that MAC spoofing is enabled on all the VM network adapter(s).

1. My Windows Pods cannot ping external resources

    Windows Pods do not have outbound rules programmed for the ICMP protocol today. However, TCP/UDP is supported. When trying to demonstrate connectivity to resources outside of the cluster, please substitute `ping <IP>` with corresponding `curl <IP>` commands.

    If you are still facing problems, most likely your network configuration in [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf) deserves some extra attention. You can always edit this static file, the configuration will be applied to any newly created Kubernetes resources.

    One of the Kubernetes networking requirements (see [Kubernetes model](/docs/concepts/cluster-administration/networking/)) is for cluster communication to occur without NAT internally. To honor this requirement, there is an [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20) for all the communication where we do not want outbound NAT to occur. However, this also means that you need to exclude the external IP you are trying to query from the ExceptionList. Only then will the traffic originating from your Windows pods be SNAT'ed correctly to receive a response from the outside world. In this regard, your ExceptionList in `cni.conf` should look as follows:

    ```conf
    "ExceptionList": [
                    "10.244.0.0/16",  # Cluster subnet
                    "10.96.0.0/12",   # Service subnet
                    "10.127.130.0/24" # Management (host) subnet
                ]
    ```

1. My Windows node cannot access NodePort service

    Local NodePort access from the node itself will fail. This is a known limitation. NodePort access will work from other nodes or external clients.

1. vNICs and HNS endpoints of containers are being deleted

    This issue can be caused when the `hostname-override` parameter is not passed to [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). To resolve it, users need to pass the hostname to kube-proxy as follows:

    ```powershell
    C:\k\kube-proxy.exe --hostname-override=$(hostname)
    ```

1. With flannel my nodes are having issues after rejoining a cluster

    Whenever a previously deleted node is being re-joined to the cluster, flannelD will try to assign a new pod subnet to the node. Users should remove the old pod subnet configuration files in the following paths:

    ```powershell
    Remove-Item C:\k\SourceVip.json
    Remove-Item C:\k\SourceVipRequest.json
    ```

1. After launching `start.ps1`, flanneld is stuck in "Waiting for the Network to be created"

    There are numerous reports of this [issue which are being investigated](https://github.com/coreos/flannel/issues/1066); most likely it is a timing issue for when the management IP of the flannel network is set. A workaround is to simply relaunch start.ps1 or relaunch it manually as follows:

    ```powershell
    PS C:> [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
    PS C:> C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
    ```

1. My Windows Pods cannot launch because of missing `/run/flannel/subnet.env`

    This indicates that Flannel didn't launch correctly. You can either try to restart flanneld.exe or you can copy the files over manually from `/run/flannel/subnet.env` on the Kubernetes master to` C:\run\flannel\subnet.env` on the Windows worker node and modify the `FLANNEL_SUBNET` row to a different number. For example, if node subnet 10.244.4.1/24 is desired:

    ```env
    FLANNEL_NETWORK=10.244.0.0/16
    FLANNEL_SUBNET=10.244.4.1/24
    FLANNEL_MTU=1500
    FLANNEL_IPMASQ=true
    ```

1. My Windows node cannot access my services using the service IP

    This is a known limitation of the current networking stack on Windows. Windows Pods are able to access the service IP however.

1. No network adapter is found when starting kubelet

    The Windows networking stack needs a virtual adapter for Kubernetes networking to work. If the following commands return no results (in an admin shell), virtual network creation — a necessary prerequisite for Kubelet to work — has failed:

    ```powershell
    Get-HnsNetwork | ? Name -ieq "cbr0"
    Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
    ```

    Often it is worthwhile to modify the [InterfaceName](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/start.ps1#L6) parameter of the start.ps1 script, in cases where the host's network adapter isn't "Ethernet". Otherwise, consult the output of the `start-kubelet.ps1` script to see if there are errors during virtual network creation.

1. My Pods are stuck at "Container Creating" or restarting over and over

    Check that your pause image is compatible with your OS version. The [instructions](https://docs.microsoft.com/en-us/virtualization/windowscontainers/kubernetes/deploying-resources) assume that both the OS and the containers are version 1803. If you have a later version of Windows, such as an Insider build, you will need to adjust the images accordingly. Please refer to the Microsoft's [Docker repository](https://hub.docker.com/u/microsoft/) for images. Regardless, both the pause image Dockerfile and the sample service will expect the image to be tagged as :latest.

## Further investigation

Check the DNS limitations for Windows in this [section](#dns-limitations).

If these steps don't resolve your problem, you can get help running Windows containers on Windows nodes in Kubernetes through:

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes Official Forum [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)

## Reporting Issues and Feature Requests

If you have what looks like a bug, or you would like to make a feature request, please use the [Github issue tracking system](https://github.com/kubernetes/kubernetes/issues). You can open issues on [GitHub](https://github.com/kubernetes/kubernetes/issues/new/choose) and assign them to SIG-Windows. You should first search the list of issues in case it was reported previously and comment with your experience on the issue and add additional logs. SIG-Windows Slack is also a great avenue to get some initial support and troubleshooting ideas prior to creating a ticket.

If filing a bug, please include detailed information about how to reproduce the problem, such as:

* Kubernetes version: kubectl version
* Environment details: Cloud provider, OS distro, networking choice and configuration, and Docker version
* Detailed steps to reproduce the problem
* [Relevant logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)
* Tag the issue sig/windows by commenting on the issue with `/sig windows` to bring it to a SIG-Windows member's attention

# Roadmap

We have a lot of features in our roadmap. An abbreviated high level list is included below, but we encourage you to view our [roadmap project](https://github.com/orgs/kubernetes/projects/8) and help us make Windows support better by [contributing](https://github.com/kubernetes/community/blob/master/sig-windows/).

## CRI-ContainerD

ContainerD is another OCI-compliant runtime that recently graduated as a CNCF project. It's currently tested on Linux, but 1.3 will bring support for Windows and Hyper-V. [[reference](https://blog.docker.com/2019/02/containerd-graduates-within-the-cncf/)]

The CRI-ContainerD interface will be able to manage sandboxes based on Hyper-V. This provides a foundation where RuntimeClasses could be implemented for new use cases including:

* Hypervisor-based isolation between pods for additional security
* Backwards compatibility allowing a node to run a newer Windows Server version without requiring containers to be rebuilt
* Specific CPU/NUMA settings for a pod
* Memory isolation and reservations

## Deployment with kubeadm and cluster API

Kubeadm is becoming the de facto standard for users to deploy a Kubernetes cluster. Windows node support in kubeadm will come in a future release. We are also making investments in cluster API to ensure Windows nodes are properly provisioned.

## A few other big ticket items
### Beta support for Group Managed Service Accounts
### More CNIs
### More Storage Plugins
