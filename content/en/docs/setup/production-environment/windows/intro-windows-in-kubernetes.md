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
[Monitor Node Health](/docs/tasks/debug/debug-cluster/monitor-node-health/))
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

Your main source of help for troubleshooting your Kubernetes cluster should start
with the [Troubleshooting](/docs/tasks/debug/)
page.

Some additional, Windows-specific troubleshooting help is included
in this section. Logs are an important element of troubleshooting
issues in Kubernetes. Make sure to include them any time you seek
troubleshooting assistance from other contributors. Follow the
instructions in the
SIG Windows [contributing guide on gathering logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs).

### Node-level troubleshooting {#troubleshooting-node}

1. How do I know `start.ps1` completed successfully?

   You should see kubelet, kube-proxy, and (if you chose Flannel as your networking
   solution) flanneld host-agent processes running on your node, with running logs
   being displayed in separate PowerShell windows. In addition to this, your Windows
   node should be listed as "Ready" in your Kubernetes cluster.

1. Can I configure the Kubernetes node processes to run in the background as services?

   The kubelet and kube-proxy are already configured to run as native Windows Services,
   offering resiliency by re-starting the services automatically in the event of
   failure (for example a process crash). You have two options for configuring these
   node components as services.

    1. As native Windows Services

        You can run the kubelet and kube-proxy as native Windows Services using `sc.exe`.

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

    1. Using `nssm.exe`

       You can also always use alternative service managers like
       [nssm.exe](https://nssm.cc/) to run these processes (flanneld,
       kubelet & kube-proxy) in the background for you. You can use this
       [sample script](https://github.com/Microsoft/SDN/tree/master/Kubernetes/flannel/register-svc.ps1),
       leveraging nssm.exe to register kubelet, kube-proxy, and flanneld.exe to run
       as Windows services in the background.

       ```powershell
       register-svc.ps1 -NetworkMode <Network mode> -ManagementIP <Windows Node IP> -ClusterCIDR <Cluster subnet> -KubeDnsServiceIP <Kube-dns Service IP> -LogDir <Directory to place logs>

       # NetworkMode      = The network mode l2bridge (flannel host-gw, also the default value) or overlay (flannel vxlan) chosen as a network solution
       # ManagementIP     = The IP address assigned to the Windows node. You can use ipconfig to find this
       # ClusterCIDR      = The cluster subnet range. (Default value 10.244.0.0/16)
       # KubeDnsServiceIP = The Kubernetes DNS service IP (Default value 10.96.0.10)
       # LogDir           = The directory where kubelet and kube-proxy logs are redirected into their respective output files (Default value C:\k)
       ```

       If the above referenced script is not suitable, you can manually configure
       `nssm.exe` using the following examples.

       ```powershell
       # Register flanneld.exe
       nssm install flanneld C:\flannel\flanneld.exe
       nssm set flanneld AppParameters --kubeconfig-file=c:\k\config --iface=<ManagementIP> --ip-masq=1 --kube-subnet-mgr=1
       nssm set flanneld AppEnvironmentExtra NODE_NAME=<hostname>
       nssm set flanneld AppDirectory C:\flannel
       nssm start flanneld

       # Register kubelet.exe
       # Microsoft releases the pause infrastructure container at mcr.microsoft.com/oss/kubernetes/pause:3.6
       nssm install kubelet C:\k\kubelet.exe
       nssm set kubelet AppParameters --hostname-override=<hostname> --v=6 --pod-infra-container-image=mcr.microsoft.com/oss/kubernetes/pause:3.6 --resolv-conf="" --allow-privileged=true --enable-debugging-handlers --cluster-dns=<DNS-service-IP> --cluster-domain=cluster.local --kubeconfig=c:\k\config --hairpin-mode=promiscuous-bridge --image-pull-progress-deadline=20m --cgroups-per-qos=false  --log-dir=<log directory> --logtostderr=false --enforce-node-allocatable="" --network-plugin=cni --cni-bin-dir=c:\k\cni --cni-conf-dir=c:\k\cni\config
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

       For additional details, see [NSSM - the Non-Sucking Service Manager](https://nssm.cc/usage).

1. My Pods are stuck at "Container Creating" or restarting over and over

   Check that your pause image is compatible with your OS version. The
   [instructions](https://docs.microsoft.com/en-us/virtualization/windowscontainers/kubernetes/deploying-resources)
   assume that both the OS and the containers are version 1803. If you have a later
   version of Windows, such as an Insider build, you need to adjust the images
   accordingly. See [Pause container](#pause-container) for more details.

### Network troubleshooting {#troubleshooting-network}

1. My Windows Pods do not have network connectivity

   If you are using virtual machines, ensure that MAC spoofing is **enabled** on all
   the VM network adapter(s).

1. My Windows Pods cannot ping external resources

   Windows Pods do not have outbound rules programmed for the ICMP protocol. However,
   TCP/UDP is supported. When trying to demonstrate connectivity to resources
   outside of the cluster, substitute `ping <IP>` with corresponding
   `curl <IP>` commands.

   If you are still facing problems, most likely your network configuration in
   [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)
   deserves some extra attention. You can always edit this static file. The
   configuration update will apply to any new Kubernetes resources.

   One of the Kubernetes networking requirements
   (see [Kubernetes model](/docs/concepts/cluster-administration/networking/)) is
   for cluster communication to occur without
   NAT internally. To honor this requirement, there is an
   [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20)
   for all the communication where you do not want outbound NAT to occur. However,
   this also means that you need to exclude the external IP you are trying to query
   from the `ExceptionList`. Only then will the traffic originating from your Windows
   pods be SNAT'ed correctly to receive a response from the outside world. In this
   regard, your `ExceptionList` in `cni.conf` should look as follows:

   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # Cluster subnet
                   "10.96.0.0/12",   # Service subnet
                   "10.127.130.0/24" # Management (host) subnet
               ]
   ```

1. My Windows node cannot access `NodePort` type Services

   Local NodePort access from the node itself fails. This is a known
   limitation. NodePort access works from other nodes or external clients.

1. vNICs and HNS endpoints of containers are being deleted

   This issue can be caused when the `hostname-override` parameter is not passed to
   [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). To resolve
   it, users need to pass the hostname to kube-proxy as follows:

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```

1. With flannel, my nodes are having issues after rejoining a cluster

   Whenever a previously deleted node is being re-joined to the cluster, flannelD
   tries to assign a new pod subnet to the node. Users should remove the old pod
   subnet configuration files in the following paths:

   ```powershell
   Remove-Item C:\k\SourceVip.json
   Remove-Item C:\k\SourceVipRequest.json
   ```

1. After launching `start.ps1`, flanneld is stuck in "Waiting for the Network to be created"

   There are numerous reports of this [issue](https://github.com/coreos/flannel/issues/1066); most likely it is a timing issue for when the management IP of the flannel network is set. A workaround is to relaunch `start.ps1` or relaunch it manually as follows:

   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```

1. My Windows Pods cannot launch because of missing `/run/flannel/subnet.env`

   This indicates that Flannel didn't launch correctly. You can either try
   to restart `flanneld.exe` or you can copy the files over manually from
   `/run/flannel/subnet.env` on the Kubernetes master to `C:\run\flannel\subnet.env`
   on the Windows worker node and modify the `FLANNEL_SUBNET` row to a different
   number. For example, if node subnet 10.244.4.1/24 is desired:

   ```env
   FLANNEL_NETWORK=10.244.0.0/16
   FLANNEL_SUBNET=10.244.4.1/24
   FLANNEL_MTU=1500
   FLANNEL_IPMASQ=true
   ```

1. My Windows node cannot access my services using the service IP

   This is a known limitation of the networking stack on Windows. However, Windows Pods can access the Service IP.

1. No network adapter is found when starting the kubelet

   The Windows networking stack needs a virtual adapter for Kubernetes networking to work. If the following commands return no results (in an admin shell), virtual network creation — a necessary prerequisite for the kubelet to work — has failed:

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   Often it is worthwhile to modify the [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) parameter of the start.ps1 script, in cases where the host's network adapter isn't "Ethernet". Otherwise, consult the output of the `start-kubelet.ps1` script to see if there are errors during virtual network creation.

1. DNS resolution is not properly working

   Check the DNS limitations for Windows in this [section](/docs/concepts/services-networking/dns-pod-service/windows-networking#dns-windows).

1. `kubectl port-forward` fails with "unable to do port forwarding: wincat not found"

   This was implemented in Kubernetes 1.15 by including `wincat.exe` in the pause infrastructure container `mcr.microsoft.com/oss/kubernetes/pause:3.6`. Be sure to use a supported version of Kubernetes.
   If you would like to build your own pause infrastructure container be sure to include [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat).

1. My Kubernetes installation is failing because my Windows Server node is behind a proxy

   If you are behind a proxy, the following PowerShell environment variables must be defined:

   ```PowerShell
   [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
   [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
   ```

### Further investigation

If these steps don't resolve your problem, you can get help running Windows containers on Windows nodes in Kubernetes through:

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes Official Forum [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)

### Reporting issues and feature requests

If you have what looks like a bug, or you would like to
make a feature request, please use the
[GitHub issue tracking system](https://github.com/kubernetes/kubernetes/issues).
You can open issues on
[GitHub](https://github.com/kubernetes/kubernetes/issues/new/choose) and assign
them to SIG-Windows. You should first search the list of issues in case it was
reported previously and comment with your experience on the issue and add additional
logs. SIG-Windows Slack is also a great avenue to get some initial support and
troubleshooting ideas prior to creating a ticket.

If filing a bug, please include detailed information about how to reproduce the problem, such as:

* Kubernetes version: output from `kubectl version`
* Environment details: Cloud provider, OS distro, networking choice and configuration, and Docker version
* Detailed steps to reproduce the problem
* [Relevant logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)

It helps if you tag the issue as **sig/windows**, by commenting on the issue with `/sig windows`. This helps to bring
the issue to a SIG Windows member's attention


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
