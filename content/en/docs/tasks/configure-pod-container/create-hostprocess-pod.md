---
title: Create a Windows HostProcess Pod
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

Windows HostProcess containers enable you to run containerized 
 workloads on a Windows host. These containers operate as 
normal processes but have access to the host network namespace, 
storage, and devices when given the appropriate user privileges. 
HostProcess containers can be used to deploy CNIs, 
storage configurations, device plugins, kube-proxy, and other 
components to Windows nodes without the need for dedicated proxies or 
the direct installation of host services.

Administrative tasks such as installation of security patches, event 
log collection, and more can be performed without requiring cluster operators to 
log onto each Window node. HostProcess containers can run as any user that is 
available on the host or is in the domain of the host machine, allowing administrators 
to restrict resource access through user permissions. While neither filesystem or process 
isolation are supported, a new volume is created on the host upon starting the container 
to give it a clean and consolidated workspace. HostProcess containers can also be built on 
top of existing Windows base images and do not inherit the same 
[compatibility requirements](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) as Windows server containers.

### When should I use a Windows HostProcess container?

- When you need to perform tasks which require the networking namespace of the host. 
HostProcess containers have access to the host's network interfaces and IP.
- You need access to resources on the host such as the filesystem, event logs, etc.
- Installation of specific devices drivers or services
- Consolidation of administrative tasks and security policies. This reduces the degree of 
privileges needed by Windows nodes.

### Important Notes

- HostProcess containers will **only run when using version 1.5.4 (or higher) of the containerd [container runtime](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)**.
- As of v1.22 HostProcess pods can only run HostProcess containers. This is a current limitation
 of the Windows OS; non-privileged Windows containers cannot share a vNIC with the host IP namespace.
- HostProcess containers run as a process on the host and do not have any degree of 
isolation other than resource constraints imposed on the HostProcess user account. Neither 
filesystem or Hyper-V isolation are supported for HostProcess containers.
- Volume mounts are supported and are mounted under the container volume. See [Volume Mounts](./create-hostprocess-pod#volume-mounts)
- A limited set of host user accounts are available for HostProcess containers by default. See [Choosing a User Account](./create-hostprocess-pod#choosing-a-user-account).
- Resource limits (disk, memory, cpu count) are supported in the same fashion as processes 
on the host.
- Both Named pipe mounts and Unix domain sockets are **not** currently supported and should instead be accessed via their 
path on the host (e.g. \\\\.\\pipe\\\*)

 ## {{% heading "prerequisites" %}}
# HostProcess Documentation

To enable HostProcess containers while in Alpha you need to pass the following feature gate flag to **kubelet** and **kube-apiserver**. See [Features Gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#overview) documentation for more details.

```
--feature-gates=WindowsHostProcessContainers=true
```

You can use the latest version of Containerd (v1.5.4+) with the following settings using the containerd v2 configuration.  Add these annotations to any runtime configurations were you wish to enable the HostProcess Container feature.


```
[plugins]
  [plugins."io.containerd.grpc.v1.cri"]
    [plugins."io.containerd.grpc.v1.cri".containerd]
      [plugins."io.containerd.grpc.v1.cri".containerd.default_runtime]
        container_annotations = ["microsoft.com/hostprocess-container"]
        pod_annotations = ["microsoft.com/hostprocess-container"]
    [plugins."io.containerd.grpc.v1.cri".containerd.runtimes]
      [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runhcs-wcow-process]
        container_annotations = ["microsoft.com/hostprocess-container"]
        pod_annotations = ["microsoft.com/hostprocess-container"]
```

The current versions of containerd ship with a version of hcsshim that does not have support. You will need to build a version of hcsshim from the main branch following the [instructions in hcsshim](https://github.com/Microsoft/hcsshim/#containerd-shim).  Once the containerd shim is built you can replace the file in your contianerd installation.  For example if you followed the instructions to [install containerd](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#containerd) replace the `containerd-shim-runhcs-v1.exe` is installed at `$Env:ProgramFiles\containerd` with the newly built shim.

We are working to improve this process by enabling HostProcess support directly in [containerd via the CRI api](https://github.com/containerd/containerd/pull/5131) as well as shipping a version of the containerd shim for Windows with support direclty via containerd releases.


### Example Manifests


```yaml
spec:
  securityContext:
    windowsOptions:
      hostProcess: true
      runAsUserName: "NT AUTHORITY\\Local service"
  hostNetwork: true
  containers:
  - name: test
    image: image1:latest
    command:
      - ping
      - -t
      - 127.0.0.1
  nodeSelector:
    "kubernetes.io/os": windows
```

## Volume Mounts

HostProcess containers support the ability to mount volumes within the container volume space. Applications running inside the container can access volume mounts directly via relative or absolute paths. An environment variable `$CONTAINER_SANDBOX_MOUNT_POINT` is set upon container creation and provides the absolute host path to the container volume. Relative paths are based upon the `Pod.containers.volumeMounts.mountPath` configuration.

Example: To access service account tokens the following path structures are supported within the container:

`\var\run\secrets\kubernetes.io\serviceaccount\`

`$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

## Choosing a User Account

Currently HostProcess containers only support the ability to run as one of four supported Windows service accounts:

- **[LocalService](https://docs.microsoft.com/en-us/windows/win32/services/localservice-account)**
- **[NetworkService](https://docs.microsoft.com/en-us/windows/win32/services/networkservice-account)**
- **[LocalSystem](https://docs.microsoft.com/en-us/windows/win32/services/localsystem-account)**
- **[LocalServiceAccount](https://docs.microsoft.com/en-us/windows/win32/services/localservice-account)**

Operators should use these accounts to restrict access to system resources (e.g. files, registry, named pipes, WMI, etc.) and enforce the principle of least privilege. HostProcess containers have direct access to the host so it is recommended that a privileged workload only be given access to what it needs explicitly to prevent against accidental damage to the host. 
