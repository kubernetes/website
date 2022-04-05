---
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title: Windows containers in Kubernetes
content_type: concept
weight: 65
---

<!-- overview -->

Windows applications constitute a large portion of the services and applications that
run in many organizations. [Windows containers](https://aka.ms/windowscontainers)
provide a way to encapsulate processes and package dependencies, making it easier
to use DevOps practices and follow cloud native patterns for Windows applications.

Organizations with investments in Windows-based applications and Linux-based
applications don't have to look for separate orchestrators to manage their workloads,
leading to increased operational efficiencies across their deployments, regardless
of operating system.

<!-- body -->

## Windows nodes in Kubernetes

To enable the orchestration of Windows containers in Kubernetes, include Windows nodes
in your existing Linux cluster. Scheduling Windows containers in
{{< glossary_tooltip text="Pods" term_id="pod" >}} on Kubernetes is similar to
scheduling Linux-based containers.

In order to run Windows containers, your Kubernetes cluster must include
multiple operating systems.
While you can only run the {{< glossary_tooltip text="control plane" term_id="control-plane" >}} on Linux, you can deploy worker nodes running either Windows or Linux depending on your workload needs.

Windows {{< glossary_tooltip text="nodes" term_id="node" >}} are
[supported](#windows-os-version-support) provided that the operating system is
Windows Server 2019.

This document uses the term *Windows containers* to mean Windows containers with
process isolation. Kubernetes does not support running Windows containers with
[Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container).

## Compatibility and limitations {#limitations}

Some node features are only available if you use a specific
[container runtime](#container-runtime); others are not available on Windows nodes,
including:

* HugePages: not supported for Windows containers
* Privileged containers: not supported for Windows containers
* TerminationGracePeriod: requires containerD

Not all features of shared namespaces are supported. See [API compatibility](#api)
for more details.

See [Windows OS version compatibility](#windows-os-version-support) for details on
the Windows versions that Kubernetes is tested against.

From an API and kubectl perspective, Windows containers behave in much the same
way as Linux-based containers. However, there are some notable differences in key
functionality which are outlined in this section.

### Comparison with Linux {#compatibility-linux-similarities}

Key Kubernetes elements work the same way in Windows as they do in Linux. This
section refers to several key workload enablers and how they map to Windows.

* [Pods](/docs/concepts/workloads/pods/)

  A Pod is the basic building block of Kubernetes–the smallest and simplest unit in
  the Kubernetes object model that you create or deploy. You may not deploy Windows and
  Linux containers in the same Pod. All containers in a Pod are scheduled onto a single
  Node where each Node represents a specific platform and architecture. The following
  Pod capabilities, properties and events are supported with Windows containers:

  * Single or multiple containers per Pod with process isolation and volume sharing
  * Pod `status` fields
  * Readiness and Liveness probes
  * postStart & preStop container lifecycle events
  * ConfigMap, Secrets: as environment variables or volumes
  * `emptyDir` volumes
  * Named pipe host mounts
  * Resource limits
  * OS field: 

    The `.spec.os.name` field should be set to `windows` to indicate that the current Pod uses Windows containers.
    The `IdentifyPodOS` feature gate needs to be enabled for this field to be recognized and used by control plane
    components and kubelet.

    {{< note >}}
    Starting from 1.24, the `IdentifyPodOS` feature gate is in Beta stage and defaults to be enabled.
    {{< /note >}}

    If the `IdentifyPodOS` feature gate is enabled and you set the `.spec.os.name` field to `windows`,
    you must not set the following fields in the `.spec` of that Pod:

    * `spec.hostPID`
    * `spec.hostIPC`
    * `spec.securityContext.seLinuxOptions`
    * `spec.securityContext.seccompProfile`
    * `spec.securityContext.fsGroup`
    * `spec.securityContext.fsGroupChangePolicy`
    * `spec.securityContext.sysctls`
    * `spec.shareProcessNamespace`
    * `spec.securityContext.runAsUser`
    * `spec.securityContext.runAsGroup`
    * `spec.securityContext.supplementalGroups`
    * `spec.containers[*].securityContext.seLinuxOptions`
    * `spec.containers[*].securityContext.seccompProfile`
    * `spec.containers[*].securityContext.capabilities`
    * `spec.containers[*].securityContext.readOnlyRootFilesystem`
    * `spec.containers[*].securityContext.privileged`
    * `spec.containers[*].securityContext.allowPrivilegeEscalation`
    * `spec.containers[*].securityContext.procMount`
    * `spec.containers[*].securityContext.runAsUser`
    * `spec.containers[*].securityContext.runAsGroup`

    In the above list, wildcards (`*`) indicate all elements in a list.
    For example, `spec.containers[*].securityContext` refers to the SecurityContext object
    for all containers. If any of these fields is specified, the Pod will
    not be admited by the API server.

* [Workload resources](/docs/concepts/workloads/controllers/) including:
  * ReplicaSet
  * Deployments
  * StatefulSets
  * DaemonSet
  * Job
  * CronJob
  * ReplicationController
* {{< glossary_tooltip text="Services" term_id="service" >}}
  See [Load balancing and Services](#load-balancing-and-services) for more details.

Pods, workload resources, and Services are critical elements to managing Windows
workloads on Kubernetes. However, on their own they are not enough to enable
the proper lifecycle management of Windows workloads in a dynamic cloud native
environment. Kubernetes also supports:

* `kubectl exec`
* Pod and container metrics
* {{< glossary_tooltip text="Horizontal pod autoscaling" term_id="horizontal-pod-autoscaler" >}}
* {{< glossary_tooltip text="Resource quotas" term_id="resource-quota" >}}
* Scheduler preemption

### Persistent storage {#compatibility-storage}

Windows has a layered filesystem driver to mount container layers and create a copy
filesystem based on NTFS. All file paths in the container are resolved only within
the context of that container.

* With Docker, volume mounts can only target a directory in the container, and not
  an individual file. This limitation does not exist with CRI-containerD runtime.
* Volume mounts cannot project files or directories back to the host filesystem.
* Read-only filesystems are not supported because write access is always required
  for the Windows registry and SAM database. However, read-only volumes are supported.
* Volume user-masks and permissions are not available. Because the SAM is not shared
  between the host & container, there's no mapping between them. All permissions are
  resolved within the context of the container.

As a result, the following storage functionality is not supported on Windows nodes:

* Volume subpath mounts: only the entire volume can be mounted in a Windows container
* Subpath volume mounting for Secrets
* Host mount projection
* Read-only root filesystem (mapped volumes still support `readOnly`)
* Block device mapping
* Memory as the storage medium (for example, `emptyDir.medium` set to `Memory`)
* File system features like uid/gid; per-user Linux filesystem permissions
* DefaultMode (due to UID/GID dependency)
* NFS based storage/volume support
* Expanding the mounted volume (resizefs)

Kubernetes {{< glossary_tooltip text="volumes" term_id="volume" >}} enable complex
applications, with data persistence and Pod volume sharing requirements, to be deployed
on Kubernetes. Management of persistent volumes associated with a specific storage
back-end or protocol includes actions such as provisioning/de-provisioning/resizing
of volumes, attaching/detaching a volume to/from a Kubernetes node and
mounting/dismounting a volume to/from individual containers in a pod that needs to
persist data.

The code implementing these volume management actions for a specific storage back-end
or protocol is shipped in the form of a Kubernetes volume
[plugin](/docs/concepts/storage/volumes/#types-of-volumes).
The following broad classes of Kubernetes volume plugins are supported on Windows:

##### In-tree volume plugins

Code associated with in-tree volume plugins ship as part of the core Kubernetes code
base. Deployment of in-tree volume plugins do not require installation of additional
scripts or deployment of separate containerized plugin components. These plugins can
handle provisioning/de-provisioning and resizing of volumes in the storage backend,
attaching/detaching of volumes to/from a Kubernetes node and mounting/dismounting a
volume to/from individual containers in a pod. The following in-tree plugins support
persistent storage on Windows nodes:

* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk)
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile)
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcepersistentdisk)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume)

#### FlexVolume plugins

Code associated with [FlexVolume](/docs/concepts/storage/volumes/#flexVolume)
plugins ship as out-of-tree scripts or binaries that need to be deployed directly
on the host. FlexVolume plugins handle attaching/detaching of volumes to/from a
Kubernetes node and mounting/dismounting a volume to/from individual containers
in a pod. Provisioning/De-provisioning of persistent volumes associated
with FlexVolume plugins may be handled through an external provisioner that
is typically separate from the FlexVolume plugins. The following FlexVolume
[plugins](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows),
deployed as PowerShell scripts on the host, support Windows nodes:

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

#### CSI plugins

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

Code associated with {{< glossary_tooltip text="CSI" term_id="csi" >}} plugins ship
as out-of-tree scripts and binaries that are typically distributed as container
images and deployed using standard Kubernetes constructs like DaemonSets and
StatefulSets.
CSI plugins handle a wide range of volume management actions in Kubernetes:
provisioning/de-provisioning/resizing of volumes, attaching/detaching of volumes
to/from a Kubernetes node and mounting/dismounting a volume to/from individual
containers in a pod, backup/restore of persistent data using snapshots and cloning.
CSI plugins typically consist of node plugins (that run on each node as a DaemonSet)
and controller plugins.

CSI node plugins (especially those associated with persistent volumes exposed as
either block devices or over a shared file-system) need to perform various privileged
operations like scanning of disk devices, mounting of file systems, etc. These
operations differ for each host operating system. For Linux worker nodes, containerized
CSI node plugins are typically deployed as privileged containers. For Windows worker
nodes, privileged operations for containerized CSI node plugins is supported using
[csi-proxy](https://github.com/kubernetes-csi/csi-proxy), a community-managed,
stand-alone binary that needs to be pre-installed on each Windows node.

For more details, refer to the deployment guide of the CSI plugin you wish to deploy.

### Command line options for the kubelet {#kubelet-compatibility}

The behavior of some kubelet command line options behave differently on Windows, as described below:

* The `--windows-priorityclass` lets you set the scheduling priority of the kubelet process (see [CPU resource management](/docs/concepts/configuration/windows-resource-management/#resource-management-cpu))
* The `--kubelet-reserve`, `--system-reserve` , and `--eviction-hard` flags update [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
* Eviction by using `--enforce-node-allocable` is not implemented
* Eviction by using `--eviction-hard` and `--eviction-soft` are not implemented
* A kubelet running on a Windows node does not have memory
  restrictions. `--kubelet-reserve` and `--system-reserve` do not set limits on
  kubelet or processes running on the host. This means kubelet or a process on the host
  could cause memory resource starvation outside the node-allocatable and scheduler.
* The `MemoryPressure` Condition is not implemented
* The kubelet does not take OOM eviction actions

### API compatibility {#api}

There are no differences in how most of the Kubernetes APIs work for Windows. The
subtleties around what's different come down to differences in the OS and container
runtime. In certain situations, some properties on workload resources were designed
under the assumption that they would be implemented on Linux, and fail to run on Windows.

At a high level, these OS concepts are different:

* Identity - Linux uses userID (UID) and groupID (GID) which
  are represented as integer types. User and group names
  are not canonical - they are just an alias in `/etc/groups`
  or `/etc/passwd` back to UID+GID. Windows uses a larger binary
  [security identifier](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers) (SID)
  which is stored in the Windows Security Access Manager (SAM) database. This
  database is not shared between the host and containers, or between containers.
* File permissions - Windows uses an access control list based on (SIDs), whereas
  POSIX systems such as Linux use a bitmask based on object permissions and UID+GID,
  plus _optional_ access control lists.
* File paths - the convention on Windows is to use `\` instead of `/`. The Go IO
  libraries typically accept both and just make it work, but when you're setting a
  path or command line that's interpreted inside a container, `\` may be needed.
* Signals - Windows interactive apps handle termination differently, and can
  implement one or more of these:
  * A UI thread handles well-defined messages including `WM_CLOSE`.
  * Console apps handle Ctrl-C or Ctrl-break using a Control Handler.
  * Services register a Service Control Handler function that can accept
    `SERVICE_CONTROL_STOP` control codes.

Container exit codes follow the same convention where 0 is success, and nonzero is failure.
The specific error codes may differ across Windows and Linux. However, exit codes
passed from the Kubernetes components (kubelet, kube-proxy) are unchanged.

##### Field compatibility for container specifications {#compatibility-v1-pod-spec-containers}

The following list documents differences between how Pod container specifications
work between Windows and Linux:

* Huge pages are not implemented in the Windows container
  runtime, and are not available. They require [asserting a user
  privilege](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support)
  that's not configurable for containers.
* `requests.cpu` and `requests.memory` - requests are subtracted
  from node available resources, so they can be used to avoid overprovisioning a
  node. However, they cannot be used to guarantee resources in an overprovisioned
  node. They should be applied to all containers as a best practice if the operator
  wants to avoid overprovisioning entirely.
* `securityContext.allowPrivilegeEscalation` -
   not possible on Windows; none of the capabilities are hooked up
* `securityContext.capabilities` -
   POSIX capabilities are not implemented on Windows
* `securityContext.privileged` -
   Windows doesn't support privileged containers
* `securityContext.procMount` -
   Windows doesn't have a `/proc` filesystem
* `securityContext.readOnlyRootFilesystem` -
   not possible on Windows; write access is required for registry & system
   processes to run inside the container
* `securityContext.runAsGroup` -
   not possible on Windows as there is no GID support
* `securityContext.runAsNonRoot` -
   this setting will prevent containers from running as `ContainerAdministrator`
   which is the closest equivalent to a root user on Windows.
* `securityContext.runAsUser` -
   use [`runAsUserName`](/docs/tasks/configure-pod-container/configure-runasusername)
   instead
* `securityContext.seLinuxOptions` -
   not possible on Windows as SELinux is Linux-specific
* `terminationMessagePath` -
   this has some limitations in that Windows doesn't support mapping single files. The
   default value is `/dev/termination-log`, which does work because it does not
   exist on Windows by default.

##### Field compatibility for Pod specifications {#compatibility-v1-pod}

The following list documents differences between how Pod specifications work between Windows and Linux:

* `hostIPC` and `hostpid` - host namespace sharing is not possible on Windows
* `hostNetwork` - There is no Windows OS support to share the host network
* `dnsPolicy` - setting the Pod `dnsPolicy` to `ClusterFirstWithHostNet` is
   not supported on Windows because host networking is not provided. Pods always
   run with a container network.
* `podSecurityContext` (see below)
* `shareProcessNamespace` - this is a beta feature, and depends on Linux namespaces
  which are not implemented on Windows. Windows cannot share process namespaces or
  the container's root filesystem. Only the network can be shared.
* `terminationGracePeriodSeconds` - this is not fully implemented in Docker on Windows,
  see the [GitHub issue](https://github.com/moby/moby/issues/25982).
  The behavior today is that the ENTRYPOINT process is sent CTRL_SHUTDOWN_EVENT,
  then Windows waits 5 seconds by default, and finally shuts down
  all processes using the normal Windows shutdown behavior. The 5
  second default is actually in the Windows registry
  [inside the container](https://github.com/moby/moby/issues/25982#issuecomment-426441183),
  so it can be overridden when the container is built.
* `volumeDevices` - this is a beta feature, and is not implemented on Windows.
  Windows cannot attach raw block devices to pods.
* `volumes`
  * If you define an `emptyDir` volume, you cannot set its volume source to `memory`.
* You cannot enable `mountPropagation` for volume mounts as this is not
  supported on Windows.

##### Field compatibility for Pod security context {#compatibility-v1-pod-spec-containers-securitycontext}

None of the Pod [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) fields work on Windows.

### Node problem detector

The node problem detector (see
[Monitor Node Health](/docs/tasks/debug-application-cluster/monitor-node-health/))
is not compatible with Windows.

### Pause container

In a Kubernetes Pod, an infrastructure or “pause” container is first created
to host the container. In Linux, the cgroups and namespaces that make up a pod
need a process to maintain their continued existence; the pause process provides
this. Containers that belong to the same pod, including infrastructure and worker
containers, share a common network endpoint (same IPv4 and / or IPv6 address, same
network port spaces). Kubernetes uses pause containers to allow for worker containers
crashing or restarting without losing any of the networking configuration.

Kubernetes maintains a multi-architecture image that includes support for Windows.
For Kubernetes v{{< skew currentVersion >}} the recommended pause image is `k8s.gcr.io/pause:3.6`.
The [source code](https://github.com/kubernetes/kubernetes/tree/master/build/pause)
is available on GitHub.

Microsoft maintains a different multi-architecture image, with Linux and Windows
amd64 support, that you can find as `mcr.microsoft.com/oss/kubernetes/pause:3.6`.
This image is built from the same source as the Kubernetes maintained image but
all of the Windows binaries are [authenticode signed](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode) by Microsoft.
The Kubernetes project recommends using the Microsoft maintained image if you are
deploying to a production or production-like environment that requires signed
binaries.

### Container runtimes {#container-runtime}

You need to install a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
into each node in the cluster so that Pods can run there.

The following container runtimes work with Windows:

{{% thirdparty-content %}}

#### cri-containerd

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

You can use {{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0+
as the container runtime for Kubernetes nodes that run Windows.

Learn how to [install ContainerD on a Windows node](/docs/setup/production-environment/container-runtimes/#install-containerd).

{{< note >}}
There is a [known limitation](/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations)
when using GMSA with containerd to access Windows network shares, which requires a
kernel patch.
{{< /note >}}

#### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR) is available as a container runtime for all Windows Server 2019 and later versions.

See [Install MCR on Windows Servers](https://docs.mirantis.com/mcr/20.10/install/mcr-windows.html) for more information.

## Windows OS version compatibility {#windows-os-version-support}

On Windows nodes, strict compatibility rules apply where the host OS version must
match the container base image OS version. Only Windows containers with a container
operating system of Windows Server 2019 are fully supported.

For Kubernetes v{{< skew currentVersion >}}, operating system compatibility for Windows nodes (and Pods)
is as follows:

Windows Server LTSC release
: Windows Server 2019
: Windows Server 2022

Windows Server SAC release
:  Windows Server version 20H2

The Kubernetes [version-skew policy](/docs/setup/release/version-skew-policy/) also applies.

## Getting help and troubleshooting {#troubleshooting}

For help with debugging and troubleshooting your Kubernetes cluster and/or workloads please start  
with the [Troubleshooting](/docs/tasks/debug-application-cluster/) section.

Some additional, Windows-specific troubleshooting help is included
in this section. Logs are an important element of troubleshooting
issues in Kubernetes. Make sure to include them any time you seek
troubleshooting assistance from other contributors. Follow the
instructions in the
SIG Windows [contributing guide on gathering logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs).

### Reporting issues and feature requests

If you have what looks like a bug, or you would like to
make a feature request, please follow the [SIG Windows contributing guide](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests) to create a new issue.
You should first search the list of issues in case it was
reported previously and comment with your experience on the issue and add additional
logs. SIG-Windows Slack is also a great avenue to get some initial support and
troubleshooting ideas prior to creating a ticket.

## {{% heading "whatsnext" %}}

### Deployment tools

The kubeadm tool helps you to deploy a Kubernetes cluster, providing the control
plane to manage the cluster it, and nodes to run your workloads.
[Adding Windows nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)
explains how to deploy Windows nodes to your cluster using kubeadm.

The Kubernetes [cluster API](https://cluster-api.sigs.k8s.io/) project also provides means to automate deployment of Windows nodes.

### Windows distribution channels

For a detailed explanation of Windows distribution channels see the [Microsoft documentation](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19).

Information on the different Windows Server servicing channels
including their support models can be found at
[Windows Server servicing channels](https://docs.microsoft.com/en-us/windows-server/get-started/servicing-channels-comparison).
