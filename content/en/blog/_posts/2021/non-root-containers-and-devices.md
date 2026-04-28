---
layout: blog
title: 'Non-root Containers And Devices'
date: 2021-11-09
slug: non-root-containers-and-devices
author: >
  Mikko Ylinen (Intel)
---

The user/group ID related security settings in Pod's `securityContext` trigger a problem when users want to
deploy containers that use accelerator devices (via [Kubernetes Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)) on Linux. In this blog
post I talk about the problem and describe the work done so far to address it. It's not meant to be a long story about getting the [k/k issue](https://github.com/kubernetes/kubernetes/issues/92211) fixed.

Instead, this post aims to raise awareness of the issue and to highlight important device use-cases too. This is needed as Kubernetes works on new related features such as support for user namespaces.

## Why non-root containers can't use devices and why it matters
One of the key security principles for running containers in Kubernetes is the
principle of least privilege. The Pod/container `securityContext` specifies the config
options to set, e.g., Linux capabilities, MAC policies, and user/group ID values to achieve this.

Furthermore, the cluster admins are supported with tools like [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) (deprecated) or
[Pod Security Admission](/docs/concepts/security/pod-security-admission/) (alpha) to enforce the desired security settings for pods that are being deployed in
the cluster. These settings could, for instance, require that containers must be `runAsNonRoot` or
that they are forbidden from running with root's group ID in `runAsGroup` or `supplementalGroups`.

In Kubernetes, the kubelet builds the list of [`Device`](https://pkg.go.dev/k8s.io/cri-api@v0.22.1/pkg/apis/runtime/v1#Device) resources to be made available to a container
(based on inputs from the Device Plugins) and the list is included in the CreateContainer CRI message
sent to the CRI container runtime. Each `Device` contains little information: host/container device
paths and the desired devices cgroups permissions.

The [OCI Runtime Spec for Linux Container Configuration](https://github.com/opencontainers/runtime-spec/blob/master/config-linux.md)
expects that in addition to the devices cgroup fields, more detailed information about the devices
must be provided:

```yaml
{
        "type": "<string>",
        "path": "<string>",
        "major": <int64>,
        "minor": <int64>,
        "fileMode": <uint32>,
        "uid": <uint32>,
        "gid": <uint32>
},
```

The CRI container runtimes (containerd, CRI-O) are responsible for obtaining this information
from the host for each `Device`. By default, the runtimes copy the host device's user and group IDs:

- `uid` (uint32, OPTIONAL) - id of device owner in the container namespace.  
- `gid` (uint32, OPTIONAL) - id of device group in the container namespace.

Similarly, the runtimes prepare other mandatory `config.json` sections based on the CRI fields,
including the ones defined in `securityContext`: `runAsUser`/`runAsGroup`, which become part of the POSIX
platforms user structure via:

- `uid` (int, REQUIRED) specifies the user ID in the container namespace.  
- `gid` (int, REQUIRED) specifies the group ID in the container namespace.  
- `additionalGids` (array of ints, OPTIONAL) specifies additional group IDs in the container namespace to be added to the process.

However, the resulting `config.json` triggers a problem when trying to run containers with
both devices added and with non-root uid/gid set via `runAsUser`/`runAsGroup`: the container user process
has no permission to use the device even when its group id (gid, copied from host) was permissive to
non-root groups. This is because the container user does not belong to that host group (e.g., via `additionalGids`).

Being able to run applications that use devices as non-root user is normal and expected to work so that
the security principles can be met. Therefore, several alternatives were considered to get the gap filled with what the PodSec/CRI/OCI supports today.

## What was done to solve the issue?
You might have noticed from the problem definition that it would at least be possible to workaround
the problem by manually adding the device gid(s) to `supplementalGroups`, or in
the case of just one device, set `runAsGroup` to the device's group id. However, this is problematic because the device gid(s) may have
different values depending on the nodes' distro/version in the cluster. For example, with GPUs the following commands for different distros and versions return different gids:

Fedora 33:
```
$ ls -l /dev/dri/
total 0
drwxr-xr-x. 2 root root         80 19.10. 10:21 by-path
crw-rw----+ 1 root video  226,   0 19.10. 10:42 card0
crw-rw-rw-. 1 root render 226, 128 19.10. 10:21 renderD128
$ grep -e video -e render /etc/group
video:x:39:
render:x:997:
```

Ubuntu 20.04:
```
$ ls -l /dev/dri/
total 0
drwxr-xr-x 2 root root         80 19.10. 17:36 by-path
crw-rw---- 1 root video  226,   0 19.10. 17:36 card0
crw-rw---- 1 root render 226, 128 19.10. 17:36 renderD128
$ grep -e video -e render /etc/group
video:x:44:
render:x:133:
```

Which number to choose in your `securityContext`? Also, what if the `runAsGroup`/`runAsUser` values cannot be hard-coded because
they are automatically assigned during pod admission time via external security policies?

Unlike volumes with `fsGroup`, the devices have no official notion of `deviceGroup`/`deviceUser` that the CRI runtimes (or kubelet)
would be able to use. We considered using container annotations set by the device plugins (e.g., `io.kubernetes.cri.hostDeviceSupplementalGroup/`) to get custom OCI `config.json` uid/gid values.
This would have required changes to all existing device plugins which was not ideal.

Instead, a solution that is *seamless* to end-users without getting the device plugin vendors involved was preferred. The selected approach was
to re-use `runAsUser` and `runAsGroup` values in `config.json` for devices:

```yaml
{
        "type": "c",
        "path": "/dev/foo",
        "major": 123,
        "minor": 4,
        "fileMode": 438,
        "uid": <runAsUser>,
        "gid": <runAsGroup>
},
```

With `runc` OCI runtime (in non-rootless mode), the device is created (`mknod(2)`) in
the container namespace and the ownership is changed to `runAsUser`/`runAsGroup` using `chmod(2)`.

{{< note >}}
[Rootless mode](/docs/tasks/administer-cluster/kubelet-in-userns/) and devices is not supported.
{{</note>}}
Having the ownership updated in the container namespace is justified as the user process is the only one accessing the device. Only `runAsUser`/`runAsGroup`
are taken into account, and, e.g., the `USER` setting in the container is currently ignored.

While it is likely that the "faulty" deployments (i.e., non-root `securityContext` + devices) do not exist, to be absolutely sure no
deployments break, an opt-in config entry in both containerd and CRI-O to enable the new behavior was added. The following:

`device_ownership_from_security_context (bool)`

defaults to `false` and must be enabled to use the feature.

## See non-root containers using devices after the fix
To demonstrate the new behavior, let's use a Data Plane Development Kit (DPDK) application using hardware accelerators, Kubernetes CPU manager, and HugePages as an example. The cluster runs containerd with:

```toml
[plugins]
  [plugins."io.containerd.grpc.v1.cri"]
    device_ownership_from_security_context = true
```

or CRI-O with:

```toml
[crio.runtime]
device_ownership_from_security_context = true
```

and the `Guaranteed` QoS Class Pod that runs DPDK's crypto-perf test utility with this YAML:

```yaml
...
metadata:
  name: qat-dpdk
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 2000
    fsGroup: 3000
  containers:
  - name: crypto-perf
    image: intel/crypto-perf:devel
    ...
    resources:
      requests:
        cpu: "3"
        memory: "128Mi"
        qat.intel.com/generic: '4'
        hugepages-2Mi: "128Mi"
      limits:
        cpu: "3"
        memory: "128Mi"
        qat.intel.com/generic: '4'
        hugepages-2Mi: "128Mi"
  ...
```

To verify the results, check the user and group ID that the container runs as:

```
$ kubectl exec -it qat-dpdk -c crypto-perf -- id
```

They are set to non-zero values as expected:

```
uid=1000 gid=2000 groups=2000,3000
```

Next, check the device node permissions (`qat.intel.com/generic` exposes `/dev/vfio/` devices) are accessible to `runAsUser`/`runAsGroup`:

```
$ kubectl exec -it qat-dpdk -c crypto-perf -- ls -la /dev/vfio
total 0
drwxr-xr-x 2 root root      140 Sep  7 10:55 .
drwxr-xr-x 7 root root      380 Sep  7 10:55 ..
crw------- 1 1000 2000 241,   0 Sep  7 10:55 58
crw------- 1 1000 2000 241,   2 Sep  7 10:55 60
crw------- 1 1000 2000 241,  10 Sep  7 10:55 68
crw------- 1 1000 2000 241,  11 Sep  7 10:55 69
crw-rw-rw- 1 1000 2000  10, 196 Sep  7 10:55 vfio
```

Finally, check the non-root container is also allowed to create HugePages:

```
$ kubectl exec -it qat-dpdk -c crypto-perf -- ls -la /dev/hugepages/
```

`fsGroup` gives a `runAsUser` writable HugePages emptyDir mountpoint:

```
total 0
drwxrwsr-x 2 root 3000   0 Sep  7 10:55 .
drwxr-xr-x 7 root root 380 Sep  7 10:55 ..
```

## Help us test it and provide feedback!
The functionality described here is expected to help with cluster security and the configurability of device permissions. To allow
non-root containers to use devices requires cluster admins to opt-in to the functionality by setting
`device_ownership_from_security_context = true`. To make it a default setting, please test it and provide your feedback (via SIG-Node meetings or issues)!
The flag is available in CRI-O v1.22 release and queued for containerd v1.6.

More work is needed to get it *properly* supported. It is known to work with `runc` but it also needs to be made to function
with other OCI runtimes too, where applicable. For instance, Kata Containers supports device passthrough and allows it to make devices
available to containers in VM sandboxes too.

Moreover, the additional challenge comes with support of user names and devices. This problem is still [open](https://github.com/kubernetes/enhancements/pull/2101)
and requires more brainstorming.

Finally, it needs to be understood whether `runAsUser`/`runAsGroup` are enough or if device specific settings similar to `fsGroups` are needed in PodSpec/CRI v2.

## Thanks
My thanks goes to Mike Brown (IBM, containerd), Peter Hunt (Redhat, CRI-O), and Alexander Kanevskiy (Intel) for providing all the feedback and good conversations.
