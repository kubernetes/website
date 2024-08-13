---
reviewers:
- erictune
- mikedanese
- thockin
title: Configure a Security Context for a Pod or Container
content_type: task
weight: 110
---

<!-- overview -->

A security context defines privilege and access control settings for
a Pod or Container. Security context settings include, but are not limited to:

* Discretionary Access Control: Permission to access an object, like a file, is based on
  [user ID (UID) and group ID (GID)](https://wiki.archlinux.org/index.php/users_and_groups).

* [Security Enhanced Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux):
  Objects are assigned security labels.

* Running as privileged or unprivileged.

* [Linux Capabilities](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/):
  Give a process some privileges, but not all the privileges of the root user.

* [AppArmor](/docs/tutorials/security/apparmor/):
  Use program profiles to restrict the capabilities of individual programs.

* [Seccomp](/docs/tutorials/security/seccomp/): Filter a process's system calls.

* `allowPrivilegeEscalation`: Controls whether a process can gain more privileges than
  its parent process. This bool directly controls whether the
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
  flag gets set on the container process.
  `allowPrivilegeEscalation` is always true when the container:

  - is run as privileged, or
  - has `CAP_SYS_ADMIN`

* `readOnlyRootFilesystem`: Mounts the container's root filesystem as read-only.

The above bullets are not a complete set of security context settings -- please see
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
for a comprehensive list.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Set the security context for a Pod

To specify security settings for a Pod, include the `securityContext` field
in the Pod specification. The `securityContext` field is a
[PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core) object.
The security settings that you specify for a Pod apply to all Containers in the Pod.
Here is a configuration file for a Pod that has a `securityContext` and an `emptyDir` volume:

{{% code_sample file="pods/security/security-context.yaml" %}}

In the configuration file, the `runAsUser` field specifies that for any Containers in
the Pod, all processes run with user ID 1000. The `runAsGroup` field specifies the primary group ID of 3000 for
all processes within any containers of the Pod. If this field is omitted, the primary group ID of the containers
will be root(0). Any files created will also be owned by user 1000 and group 3000 when `runAsGroup` is specified.
Since `fsGroup` field is specified, all processes of the container are also part of the supplementary group ID 2000.
The owner for volume `/data/demo` and any files created in that volume will be Group ID 2000.
Additionally, when the `supplementalGroups` field is specified, all processes of the container are also part of the
specified groups. If this field is omitted, it means empty.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

Verify that the Pod's Container is running:

```shell
kubectl get pod security-context-demo
```

Get a shell to the running Container:

```shell
kubectl exec -it security-context-demo -- sh
```

In your shell, list the running processes:

```shell
ps
```

The output shows that the processes are running as user 1000, which is the value of `runAsUser`:

```none
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

In your shell, navigate to `/data`, and list the one directory:

```shell
cd /data
ls -l
```

The output shows that the `/data/demo` directory has group ID 2000, which is
the value of `fsGroup`.

```none
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

In your shell, navigate to `/data/demo`, and create a file:

```shell
cd demo
echo hello > testfile
```

List the file in the `/data/demo` directory:

```shell
ls -l
```

The output shows that `testfile` has group ID 2000, which is the value of `fsGroup`.

```none
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

Run the following command:

```shell
id
```

The output is similar to this:

```none
uid=1000 gid=3000 groups=2000,3000,4000
```

From the output, you can see that `gid` is 3000 which is same as the `runAsGroup` field.
If the `runAsGroup` was omitted, the `gid` would remain as 0 (root) and the process will
be able to interact with files that are owned by the root(0) group and groups that have
the required group permissions for the root (0) group. You can also see that `groups`
contains the group IDs which are specified by `fsGroup` and `supplementalGroups`,
in addition to `gid`.

Exit your shell:

```shell
exit
```

### Implicit group memberships defined in `/etc/group` in the container image

By default, kubernetes merges group information from the Pod with information defined in `/etc/group` in the container image.

{{% code_sample file="pods/security/security-context-5.yaml" %}}

This Pod security context contains `runAsUser`, `runAsGroup` and `supplementalGroups`.
However, you can see that the actual supplementary groups attached to the container process
will include group IDs which come from `/etc/group` in the container image.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-5.yaml
```

Verify that the Pod's Container is running:

```shell
kubectl get pod security-context-demo
```

Get a shell to the running Container:

```shell
kubectl exec -it security-context-demo -- sh
```

Check the process identity:

```shell
$ id
```

The output is similar to this:

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

You can see that `groups` includes group ID `50000`. This is because the user (`uid=1000`),
which is defined in the image, belongs to the group (`gid=50000`), which is defined in `/etc/group`
inside the container image.

Check the `/etc/group` in the container image:

```shell
$ cat /etc/group
```

You can see that uid `1000` belongs to group `50000`.

```none
...
user-defined-in-image:x:1000:
group-defined-in-image:x:50000:user-defined-in-image
```

Exit your shell:

```shell
exit
```

{{<note>}}
_Implicitly merged_ supplementary groups may cause security problems particularly when accessing
the volumes (see [kubernetes/kubernetes#112879](https://issue.k8s.io/112879) for details).
If you want to avoid this. Please see the below section.
{{</note>}}

## Configure fine-grained SupplementalGroups control for a Pod {#supplementalgroupspolicy}

{{< feature-state feature_gate_name="SupplementalGroupsPolicy" >}}

This feature can be enabled by setting the `SupplementalGroupsPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for kubelet and
kube-apiserver, and setting the `.spec.securityContext.supplementalGroupsPolicy` field for a pod.

The `supplementalGroupsPolicy` field defines the policy for calculating the
supplementary groups for the container processes in a pod. There are two valid
values for this field:

* `Merge`: The group membership defined in `/etc/group` for the container's primary user will be merged.
  This is the default policy if not specified.

* `Strict`: Only group IDs in `fsGroup`, `supplementalGroups`, or `runAsGroup` fields 
  are attached as the supplementary groups of the container processes.
  This means no group membership from `/etc/group` for the container's primary user will be merged.

When the feature is enabled, it also exposes the process identity attached to the first container process
in `.status.containerStatuses[].user.linux` field. It would be useful for detecting if
implicit group ID's are attached.

{{% code_sample file="pods/security/security-context-6.yaml" %}}

This pod manifest defines `supplementalGroupsPolicy=Strict`. You can see that no group memberships
defined in `/etc/group` are merged to the supplementary groups for container processes.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-6.yaml
```

Verify that the Pod's Container is running:

```shell
kubectl get pod security-context-demo
```

Check the process identity:

```shell
kubectl exec -it security-context-demo -- id
```

The output is similar to this:

```none
uid=1000 gid=3000 groups=3000,4000
```

See the Pod's status:

```shell
kubectl get pod security-context-demo -o yaml
```

You can see that the `status.containerStatuses[].user.linux` field exposes the process identitiy
attached to the first container process.

```none
...
status:
  containerStatuses:
  - name: sec-ctx-demo
    user:
      linux:
        gid: 3000
        supplementalGroups:
        - 3000
        - 4000
        uid: 1000
...
```

{{<note>}}
Please note that the values in the `status.containerStatuses[].user.linux` field is _the first attached_
process identity to the first container process in the container. If the container has sufficient privilege
to make system calls related to process identity
(e.g. [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html),
[`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) or
[`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html), etc.),
the container process can change its identity. Thus, the _actual_ process identity will be dynamic.
{{</note>}}

### Implementations {#implementations-supplementalgroupspolicy}

{{% thirdparty-content %}}

The following container runtimes are known to support fine-grained SupplementalGroups control.

CRI-level:
- [containerd](https://containerd.io/), since v2.0
- [CRI-O](https://cri-o.io/), since v1.31

You can see if the feature is supported in the Node status.

```yaml
apiVersion: v1
kind: Node
...
status:
  features:
    supplementalGroupsPolicy: true
```

## Configure volume permission and ownership change policy for Pods

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

By default, Kubernetes recursively changes ownership and permissions for the contents of each
volume to match the `fsGroup` specified in a Pod's `securityContext` when that volume is
mounted.
For large volumes, checking and changing ownership and permissions can take a lot of time,
slowing Pod startup. You can use the `fsGroupChangePolicy` field inside a `securityContext`
to control the way that Kubernetes checks and manages ownership and permissions
for a volume.

**fsGroupChangePolicy** - `fsGroupChangePolicy` defines behavior for changing ownership
  and permission of the volume before being exposed inside a Pod.
  This field only applies to volume types that support `fsGroup` controlled ownership and permissions.
  This field has two possible values:

* _OnRootMismatch_: Only change permissions and ownership if the permission and the ownership of
  root directory does not match with expected permissions of the volume.
  This could help shorten the time it takes to change ownership and permission of a volume.
* _Always_: Always change permission and ownership of the volume when volume is mounted.

For example:

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

{{< note >}}
This field has no effect on ephemeral volume types such as
[`secret`](/docs/concepts/storage/volumes/#secret),
[`configMap`](/docs/concepts/storage/volumes/#configmap),
and [`emptydir`](/docs/concepts/storage/volumes/#emptydir).
{{< /note >}}

## Delegating volume permission and ownership change to CSI driver

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

If you deploy a [Container Storage Interface (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md)
driver which supports the `VOLUME_MOUNT_GROUP` `NodeServiceCapability`, the
process of setting file ownership and permissions based on the
`fsGroup` specified in the `securityContext` will be performed by the CSI driver
instead of Kubernetes. In this case, since Kubernetes doesn't perform any
ownership and permission change, `fsGroupChangePolicy` does not take effect, and
as specified by CSI, the driver is expected to mount the volume with the
provided `fsGroup`, resulting in a volume that is readable/writable by the
`fsGroup`.

## Set the security context for a Container

To specify security settings for a Container, include the `securityContext` field
in the Container manifest. The `securityContext` field is a
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core) object.
Security settings that you specify for a Container apply only to
the individual Container, and they override settings made at the Pod level when
there is overlap. Container settings do not affect the Pod's Volumes.

Here is the configuration file for a Pod that has one Container. Both the Pod
and the Container have a `securityContext` field:

{{% code_sample file="pods/security/security-context-2.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

Verify that the Pod's Container is running:

```shell
kubectl get pod security-context-demo-2
```

Get a shell into the running Container:

```shell
kubectl exec -it security-context-demo-2 -- sh
```

In your shell, list the running processes:

```shell
ps aux
```

The output shows that the processes are running as user 2000. This is the value
of `runAsUser` specified for the Container. It overrides the value 1000 that is
specified for the Pod.

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

Exit your shell:

```shell
exit
```

## Set capabilities for a Container

With [Linux capabilities](https://man7.org/linux/man-pages/man7/capabilities.7.html),
you can grant certain privileges to a process without granting all the privileges
of the root user. To add or remove Linux capabilities for a Container, include the
`capabilities` field in the `securityContext` section of the Container manifest.

First, see what happens when you don't include a `capabilities` field.
Here is configuration file that does not add or remove any Container capabilities:

{{% code_sample file="pods/security/security-context-3.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

Verify that the Pod's Container is running:

```shell
kubectl get pod security-context-demo-3
```

Get a shell into the running Container:

```shell
kubectl exec -it security-context-demo-3 -- sh
```

In your shell, list the running processes:

```shell
ps aux
```

The output shows the process IDs (PIDs) for the Container:

```
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

In your shell, view the status for process 1:

```shell
cd /proc/1
cat status
```

The output shows the capabilities bitmap for the process:

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

Make a note of the capabilities bitmap, and then exit your shell:

```shell
exit
```

Next, run a Container that is the same as the preceding container, except
that it has additional capabilities set.

Here is the configuration file for a Pod that runs one Container. The configuration
adds the `CAP_NET_ADMIN` and `CAP_SYS_TIME` capabilities:

{{% code_sample file="pods/security/security-context-4.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

Get a shell into the running Container:

```shell
kubectl exec -it security-context-demo-4 -- sh
```

In your shell, view the capabilities for process 1:

```shell
cd /proc/1
cat status
```

The output shows capabilities bitmap for the process:

```
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

Compare the capabilities of the two Containers:

```
00000000a80425fb
00000000aa0435fb
```

In the capability bitmap of the first container, bits 12 and 25 are clear. In the second container,
bits 12 and 25 are set. Bit 12 is `CAP_NET_ADMIN`, and bit 25 is `CAP_SYS_TIME`.
See [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
for definitions of the capability constants.

{{< note >}}
Linux capability constants have the form `CAP_XXX`.
But when you list capabilities in your container manifest, you must
omit the `CAP_` portion of the constant.
For example, to add `CAP_SYS_TIME`, include `SYS_TIME` in your list of capabilities.
{{< /note >}}

## Set the Seccomp Profile for a Container

To set the Seccomp profile for a Container, include the `seccompProfile` field
in the `securityContext` section of your Pod or Container manifest. The
`seccompProfile` field is a
[SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version"
>}}/#seccompprofile-v1-core) object consisting of `type` and `localhostProfile`.
Valid options for `type` include `RuntimeDefault`, `Unconfined`, and
`Localhost`. `localhostProfile` must only be set if `type: Localhost`. It
indicates the path of the pre-configured profile on the node, relative to the
kubelet's configured Seccomp profile location (configured with the `--root-dir`
flag).

Here is an example that sets the Seccomp profile to the node's container runtime
default profile:

```yaml
...
securityContext:
  seccompProfile:
    type: RuntimeDefault
```

Here is an example that sets the Seccomp profile to a pre-configured file at
`<kubelet-root-dir>/seccomp/my-profiles/profile-allow.json`:

```yaml
...
securityContext:
  seccompProfile:
    type: Localhost
    localhostProfile: my-profiles/profile-allow.json
```

## Set the AppArmor Profile for a Container

To set the AppArmor profile for a Container, include the `appArmorProfile` field
in the `securityContext` section of your Container. The `appArmorProfile` field
is a
[AppArmorProfile](/docs/reference/generated/kubernetes-api/{{< param "version"
>}}/#apparmorprofile-v1-core) object consisting of `type` and `localhostProfile`.
Valid options for `type` include `RuntimeDefault`(default), `Unconfined`, and
`Localhost`. `localhostProfile` must only be set if `type` is `Localhost`. It
indicates the name of the pre-configured profile on the node. The profile needs
to be loaded onto all nodes suitable for the Pod, since you don't know where the
pod will be scheduled. 
Approaches for setting up custom profiles are discussed in
[Setting up nodes with profiles](/docs/tutorials/security/apparmor/#setting-up-nodes-with-profiles).

Note: If `containers[*].securityContext.appArmorProfile.type` is explicitly set 
to `RuntimeDefault`, then the Pod will not be admitted if AppArmor is not
enabled on the Node. However if `containers[*].securityContext.appArmorProfile.type`
is not specified, then the default (which is also `RuntimeDefault`) will only
be applied if the node has AppArmor enabled. If the node has AppArmor disabled
the Pod will be admitted but the Container will not be restricted by the 
`RuntimeDefault` profile.

Here is an example that sets the AppArmor profile to the node's container runtime
default profile:

```yaml
...
containers:
- name: container-1
  securityContext:
    appArmorProfile:
      type: RuntimeDefault
```

Here is an example that sets the AppArmor profile to a pre-configured profile
named `k8s-apparmor-example-deny-write`:

```yaml
...
containers:
- name: container-1
  securityContext:
    appArmorProfile:
      type: Localhost
      localhostProfile: k8s-apparmor-example-deny-write
```

For more details please see, [Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/).

## Assign SELinux labels to a Container

To assign SELinux labels to a Container, include the `seLinuxOptions` field in
the `securityContext` section of your Pod or Container manifest. The
`seLinuxOptions` field is an
[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)
object. Here's an example that applies an SELinux level:

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
To assign SELinux labels, the SELinux security module must be loaded on the host operating system.
{{< /note >}}

### Efficient SELinux volume relabeling

{{< feature-state feature_gate_name="SELinuxMountReadWriteOncePod" >}}

{{< note >}}
Kubernetes v1.27 introduced an early limited form of this behavior that was only applicable
to volumes (and PersistentVolumeClaims) using the `ReadWriteOncePod` access mode.

As an alpha feature, you can enable the `SELinuxMount`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to widen that
performance improvement to other kinds of PersistentVolumeClaims, as explained in detail
below.
{{< /note >}}

By default, the container runtime recursively assigns SELinux label to all
files on all Pod volumes. To speed up this process, Kubernetes can change the
SELinux label of a volume instantly by using a mount option
`-o context=<label>`.

To benefit from this speedup, all these conditions must be met:

* The [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `ReadWriteOncePod`
  and `SELinuxMountReadWriteOncePod` must be enabled.
* Pod must use PersistentVolumeClaim with applicable `accessModes` and [feature gates](/docs/reference/command-line-tools-reference/feature-gates/):
  * Either the volume has `accessModes: ["ReadWriteOncePod"]`, and feature gate `SELinuxMountReadWriteOncePod` is enabled.
  * Or the volume can use any other access modes and both feature gates `SELinuxMountReadWriteOncePod` and `SELinuxMount` must be enabled.
* Pod (or all its Containers that use the PersistentVolumeClaim) must
  have `seLinuxOptions` set.
* The corresponding PersistentVolume must be either:
  * A volume that uses the legacy in-tree `iscsi`, `rbd` or `fc` volume type.
  * Or a volume that uses a {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.
    The CSI driver must announce that it supports mounting with `-o context` by setting
    `spec.seLinuxMount: true` in its CSIDriver instance.

For any other volume types, SELinux relabelling happens another way: the container
runtime  recursively changes the SELinux label for all inodes (files and directories)
in the volume.
The more files and directories in the volume, the longer that relabelling takes.

## Managing access to the `/proc` filesystem {#proc-access}

{{< feature-state feature_gate_name="ProcMountType" >}}

For runtimes that follow the OCI runtime specification, containers default to running in a mode where
there are multiple paths that are both masked and read-only.
The result of this is the container has these paths present inside the container's mount namespace, and they can function similarly to if
the container was an isolated host, but the container process cannot write to
them. The list of masked and read-only paths are as follows:

- Masked Paths:
  - `/proc/asound`
  - `/proc/acpi`
  - `/proc/kcore`
  - `/proc/keys`
  - `/proc/latency_stats`
  - `/proc/timer_list`
  - `/proc/timer_stats`
  - `/proc/sched_debug`
  - `/proc/scsi`
  - `/sys/firmware`
  - `/sys/devices/virtual/powercap`

- Read-Only Paths:
  - `/proc/bus`
  - `/proc/fs`
  - `/proc/irq`
  - `/proc/sys`
  - `/proc/sysrq-trigger`


For some Pods, you might want to bypass that default masking of paths.
The most common context for wanting this is if you are trying to run containers within
a Kubernetes container (within a pod).

The `securityContext` field `procMount` allows a user to request a container's `/proc`
be `Unmasked`, or be mounted as read-write by the container process. This also
applies to `/sys/firmware` which is not in `/proc`.

```yaml
...
securityContext:
  procMount: Unmasked
```

{{< note >}}
Setting `procMount` to Unmasked requires the `spec.hostUsers` value in the pod
spec to be `false`. In other words: a container that wishes to have an Unmasked
`/proc` or unmasked `/sys` must also be in a
[user namespace](/docs/concepts/workloads/pods/user-namespaces/).
Kubernetes v1.12 to v1.29 did not enforce that requirement.
{{< /note >}}

## Discussion

The security context for a Pod applies to the Pod's Containers and also to
the Pod's Volumes when applicable. Specifically `fsGroup` and `seLinuxOptions` are
applied to Volumes as follows:

* `fsGroup`: Volumes that support ownership management are modified to be owned
  and writable by the GID specified in `fsGroup`. See the
  [Ownership Management design document](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)
  for more details.

* `seLinuxOptions`: Volumes that support SELinux labeling are relabeled to be accessible
  by the label specified under `seLinuxOptions`. Usually you only
  need to set the `level` section. This sets the
  [Multi-Category Security (MCS)](https://selinuxproject.org/page/NB_MLS)
  label given to all Containers in the Pod as well as the Volumes.

{{< warning >}}
After you specify an MCS label for a Pod, all Pods with the same label can access the Volume.
If you need inter-Pod protection, you must assign a unique MCS label to each Pod.
{{< /warning >}}

## Clean up

Delete the Pod:

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```

## {{% heading "whatsnext" %}}

* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
* [CRI Plugin Config Guide](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
* [Security Contexts design document](https://git.k8s.io/design-proposals-archive/auth/security_context.md)
* [Ownership Management design document](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)
* [PodSecurity Admission](/docs/concepts/security/pod-security-admission/)
* [AllowPrivilegeEscalation design
  document](https://git.k8s.io/design-proposals-archive/auth/no-new-privs.md)
* For more information about security mechanisms in Linux, see
  [Overview of Linux Kernel Security Features](https://www.linux.com/learn/overview-linux-kernel-security-features)
  (Note: Some information is out of date)
* Read about [User Namespaces](/docs/concepts/workloads/pods/user-namespaces/)
  for Linux pods.
* [Masked Paths in the OCI Runtime
  Specification](https://github.com/opencontainers/runtime-spec/blob/f66aad47309/config-linux.md#masked-paths)
