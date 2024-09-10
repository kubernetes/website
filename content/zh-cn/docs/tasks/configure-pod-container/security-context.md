---
title: 为 Pod 或容器配置安全上下文
content_type: task
weight: 110
---
<!--
reviewers:
- erictune
- mikedanese
- thockin
title: Configure a Security Context for a Pod or Container
content_type: task
weight: 110
-->

<!-- overview -->

<!--
A security context defines privilege and access control settings for
a Pod or Container. Security context settings include, but are not limited to:

* Discretionary Access Control: Permission to access an object, like a file, is based on
  [user ID (UID) and group ID (GID)](https://wiki.archlinux.org/index.php/users_and_groups).

* [Security Enhanced Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux):
  Objects are assigned security labels.

* Running as privileged or unprivileged.

* [Linux Capabilities](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/):
  Give a process some privileges, but not all the privileges of the root user.

-->
安全上下文（Security Context）定义 Pod 或 Container 的特权与访问控制设置。
安全上下文包括但不限于：

* 自主访问控制（Discretionary Access Control）：
  基于[用户 ID（UID）和组 ID（GID）](https://wiki.archlinux.org/index.php/users_and_groups)
  来判定对对象（例如文件）的访问权限。

* [安全性增强的 Linux（SELinux）](https://zh.wikipedia.org/wiki/%E5%AE%89%E5%85%A8%E5%A2%9E%E5%BC%BA%E5%BC%8FLinux)：
  为对象赋予安全性标签。

* 以特权模式或者非特权模式运行。

* [Linux 权能](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): 
  为进程赋予 root 用户的部分特权而非全部特权。

<!--
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
-->
* [AppArmor](/zh-cn/docs/tutorials/security/apparmor/)：使用程序配置来限制个别程序的权能。

* [Seccomp](/zh-cn/docs/tutorials/security/seccomp/)：过滤进程的系统调用。

* `allowPrivilegeEscalation`：控制进程是否可以获得超出其父进程的特权。
  此布尔值直接控制是否为容器进程设置
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)标志。
  当容器满足一下条件之一时，`allowPrivilegeEscalation` 总是为 true：

  - 以特权模式运行，或者
  - 具有 `CAP_SYS_ADMIN` 权能

* `readOnlyRootFilesystem`：以只读方式加载容器的根文件系统。

<!--
The above bullets are not a complete set of security context settings -- please see
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
for a comprehensive list.
-->
以上条目不是安全上下文设置的完整列表 -- 请参阅
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
了解其完整列表。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Set the security context for a Pod

To specify security settings for a Pod, include the `securityContext` field
in the Pod specification. The `securityContext` field is a
[PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core) object.
The security settings that you specify for a Pod apply to all Containers in the Pod.
Here is a configuration file for a Pod that has a `securityContext` and an `emptyDir` volume:
-->
## 为 Pod 设置安全性上下文   {#set-the-security-context-for-a-pod}

要为 Pod 设置安全性设置，可在 Pod 规约中包含 `securityContext` 字段。`securityContext` 字段值是一个
[PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
对象。你为 Pod 所设置的安全性配置会应用到 Pod 中所有 Container 上。
下面是一个 Pod 的配置文件，该 Pod 定义了 `securityContext` 和一个 `emptyDir` 卷：

{{% code_sample file="pods/security/security-context.yaml" %}}

<!--
In the configuration file, the `runAsUser` field specifies that for any Containers in
the Pod, all processes run with user ID 1000. The `runAsGroup` field specifies the primary group ID of 3000 for
all processes within any containers of the Pod. If this field is omitted, the primary group ID of the containers
will be root(0). Any files created will also be owned by user 1000 and group 3000 when `runAsGroup` is specified.
Since `fsGroup` field is specified, all processes of the container are also part of the supplementary group ID 2000.
The owner for volume `/data/demo` and any files created in that volume will be Group ID 2000.
Additionally, when the `supplementalGroups` field is specified, all processes of the container are also part of the
specified groups. If this field is omitted, it means empty.

Create the Pod:
-->
在配置文件中，`runAsUser` 字段指定 Pod 中的所有容器内的进程都使用用户 ID 1000
来运行。`runAsGroup` 字段指定所有容器中的进程都以主组 ID 3000 来运行。
如果忽略此字段，则容器的主组 ID 将是 root（0）。
当 `runAsGroup` 被设置时，所有创建的文件也会划归用户 1000 和组 3000。
由于 `fsGroup` 被设置，容器中所有进程也会是附组 ID 2000 的一部分。
卷 `/data/demo` 及在该卷中创建的任何文件的属主都会是组 ID 2000。
此外，当 `supplementalGroups` 字段被指定时，容器的所有进程也会成为所指定的组的一部分。
如果此字段被省略，则表示为空。

创建该 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

<!--
Verify that the Pod's Container is running:
-->
检查 Pod 的容器处于运行状态：

```shell
kubectl get pod security-context-demo
```

<!--
Get a shell to the running Container:
-->
开启一个 Shell 进入到运行中的容器：

```shell
kubectl exec -it security-context-demo -- sh
```

<!--
In your shell, list the running processes:
-->
在你的 Shell 中，列举运行中的进程：

```shell
ps
```

<!--
The output shows that the processes are running as user 1000, which is the value of `runAsUser`:
-->
输出显示进程以用户 1000 运行，即 `runAsUser` 所设置的值：

```none
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

<!--
In your shell, navigate to `/data`, and list the one directory:
-->
在你的 Shell 中，进入 `/data` 目录列举其内容：

```shell
cd /data
ls -l
```

<!--
The output shows that the `/data/demo` directory has group ID 2000, which is
the value of `fsGroup`.
-->
输出显示 `/data/demo` 目录的组 ID 为 2000，即 `fsGroup` 的设置值：

```none
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

<!--
In your shell, navigate to `/data/demo`, and create a file:
-->
在你的 Shell 中，进入到 `/data/demo` 目录下创建一个文件：

```shell
cd demo
echo hello > testfile
```

<!--
List the file in the `/data/demo` directory:
-->
列举 `/data/demo` 目录下的文件：

```shell
ls -l
```

<!--
The output shows that `testfile` has group ID 2000, which is the value of `fsGroup`.
-->
输出显示 `testfile` 的组 ID 为 2000，也就是 `fsGroup` 所设置的值：

```none
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

<!--
Run the following command:
-->
运行下面的命令：

```shell
id
```

<!--
The output is similar to this:
-->
输出类似于：

```none
uid=1000 gid=3000 groups=2000,3000,4000
```

<!--
From the output, you can see that `gid` is 3000 which is same as the `runAsGroup` field.
If the `runAsGroup` was omitted, the `gid` would remain as 0 (root) and the process will
be able to interact with files that are owned by the root(0) group and groups that have
the required group permissions for the root (0) group. You can also see that `groups`
contains the group IDs which are specified by `fsGroup` and `supplementalGroups`,
in addition to `gid`.

Exit your shell:
-->
从输出中你会看到 `gid` 值为 3000，也就是 `runAsGroup` 字段的值。
如果 `runAsGroup` 被忽略，则 `gid` 会取值 0（root），而进程就能够与 root
用户组所拥有以及要求 root 用户组访问权限的文件交互。
你还可以看到，除了 `gid` 之外，`groups` 还包含了由 `fsGroup` 和 `supplementalGroups` 指定的组 ID。

退出你的 Shell：

```shell
exit
```

<!--
### Implicit group memberships defined in `/etc/group` in the container image

By default, kubernetes merges group information from the Pod with information defined in `/etc/group` in the container image.
-->
### 容器镜像内 `/etc/group` 中定义的隐式组成员身份

默认情况下，Kubernetes 会将 Pod 中的组信息与容器镜像内 `/etc/group` 中定义的信息合并。

{{% code_sample file="pods/security/security-context-5.yaml" %}}

<!--
This Pod security context contains `runAsUser`, `runAsGroup` and `supplementalGroups`.
However, you can see that the actual supplementary groups attached to the container process
will include group IDs which come from `/etc/group` in the container image.

Create the Pod:
-->
此 Pod 的安全上下文包含 `runAsUser`、`runAsGroup` 和 `supplementalGroups`。  
然而，你可以看到，挂接到容器进程的实际附加组将包括来自容器镜像中 `/etc/group` 的组 ID。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-5.yaml
```

<!--
Verify that the Pod's Container is running:
-->
验证 Pod 的 Container 正在运行：

```shell
kubectl get pod security-context-demo
```

<!--
Get a shell to the running Container:
-->
打开一个 Shell 进入正在运行的 Container：

```shell
kubectl exec -it security-context-demo -- sh
```

<!--
Check the process identity:
-->
检查进程身份：

```shell
$ id
```

<!--
The output is similar to this:
-->
输出类似于：

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

<!--
You can see that `groups` includes group ID `50000`. This is because the user (`uid=1000`),
which is defined in the image, belongs to the group (`gid=50000`), which is defined in `/etc/group`
inside the container image.

Check the `/etc/group` in the container image:
-->
你可以看到 `groups` 包含组 ID `50000`。
这是因为镜像中定义的用户（`uid=1000`）属于在容器镜像内 `/etc/group` 中定义的组（`gid=50000`）。

检查容器镜像中的 `/etc/group`：

```shell
$ cat /etc/group
```

<!--
You can see that uid `1000` belongs to group `50000`.
-->
你可以看到 uid `1000` 属于组 `50000`。

```none
...
user-defined-in-image:x:1000:
group-defined-in-image:x:50000:user-defined-in-image
```

<!--
Exit your shell:
-->
退出你的 Shell：

```shell
exit
```

{{<note>}}
<!--
_Implicitly merged_ supplementary groups may cause security problems particularly when accessing
the volumes (see [kubernetes/kubernetes#112879](https://issue.k8s.io/112879) for details).
If you want to avoid this. Please see the below section.
-->
**隐式合并的**附加组可能会导致安全问题，
特别是在访问卷时（有关细节请参见 [kubernetes/kubernetes#112879](https://issue.k8s.io/112879)）。  
如果你想避免这种问题，请查阅以下章节。
{{</note>}}

<!--
## Configure fine-grained SupplementalGroups control for a Pod {#supplementalgroupspolicy}
-->
## 配置 Pod 的细粒度 SupplementalGroups 控制   {#supplementalgroupspolicy}

{{< feature-state feature_gate_name="SupplementalGroupsPolicy" >}}

<!--
This feature can be enabled by setting the `SupplementalGroupsPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for kubelet and
kube-apiserver, and setting the `.spec.securityContext.supplementalGroupsPolicy` field for a pod.

The `supplementalGroupsPolicy` field defines the policy for calculating the
supplementary groups for the container processes in a pod. There are two valid
values for this field:
-->
通过为 kubelet 和 kube-apiserver 设置 `SupplementalGroupsPolicy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并为 Pod 设置 `.spec.securityContext.supplementalGroupsPolicy` 字段，此特性可以被启用。

`supplementalGroupsPolicy` 字段为 Pod 中的容器进程定义了计算附加组的策略。
此字段有两个有效值：

<!--
* `Merge`: The group membership defined in `/etc/group` for the container's primary user will be merged.
  This is the default policy if not specified.

* `Strict`: Only group IDs in `fsGroup`, `supplementalGroups`, or `runAsGroup` fields 
  are attached as the supplementary groups of the container processes.
  This means no group membership from `/etc/group` for the container's primary user will be merged.
-->
* `Merge`：为容器的主用户在 `/etc/group` 中定义的组成员身份将被合并。
  如果不指定，这就是默认策略。

* `Strict`：仅将 `fsGroup`、`supplementalGroups` 或 `runAsGroup`
  字段中的组 ID 挂接为容器进程的附加组。这意味着容器主用户在 `/etc/group` 中的组成员身份将不会被合并。

<!--
When the feature is enabled, it also exposes the process identity attached to the first container process
in `.status.containerStatuses[].user.linux` field. It would be useful for detecting if
implicit group ID's are attached.
-->
当此特性被启用时，它还会在 `.status.containerStatuses[].user.linux`
字段中暴露挂接到第一个容器进程的进程身份。这对于检测是否挂接了隐式组 ID 非常有用。

{{% code_sample file="pods/security/security-context-6.yaml" %}}

<!--
This pod manifest defines `supplementalGroupsPolicy=Strict`. You can see that no group memberships
defined in `/etc/group` are merged to the supplementary groups for container processes.

Create the Pod:
-->
此 Pod 清单定义了 `supplementalGroupsPolicy=Strict`。
你可以看到没有将 `/etc/group` 中定义的组成员身份合并到容器进程的附加组中。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-6.yaml
```

<!--
Verify that the Pod's Container is running:
-->
验证 Pod 的 Container 正在运行：

```shell
kubectl get pod security-context-demo
```

<!--
Check the process identity:
-->
检查进程身份：

```shell
kubectl exec -it security-context-demo -- id
```

<!--
The output is similar to this:
-->
输出类似于：

```none
uid=1000 gid=3000 groups=3000,4000
```

<!--
See the Pod's status:
-->
查看 Pod 的状态：

```shell
kubectl get pod security-context-demo -o yaml
```

<!--
You can see that the `status.containerStatuses[].user.linux` field exposes the process identitiy
attached to the first container process.
-->
你可以看到 `status.containerStatuses[].user.linux` 字段暴露了挂接到第一个容器进程的进程身份。

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
<!--
Please note that the values in the `status.containerStatuses[].user.linux` field is _the first attached_
process identity to the first container process in the container. If the container has sufficient privilege
to make system calls related to process identity
(e.g. [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html),
[`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) or
[`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html), etc.),
the container process can change its identity. Thus, the _actual_ process identity will be dynamic.
-->
请注意，`status.containerStatuses[].user.linux` 字段的值是**第一个挂接到**容器中第一个容器进程的进程身份。
如果容器具有足够的权限来进行与进程身份相关的系统调用
（例如 [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html)、
[`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) 或
[`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html) 等），
则容器进程可以更改其身份。因此，**实际**进程身份将是动态的。
{{</note>}}

<!--
### Implementations {#implementations-supplementalgroupspolicy}
-->
### 实现   {#implementations-supplementalgroupspolicy}

{{% thirdparty-content %}}

<!--
The following container runtimes are known to support fine-grained SupplementalGroups control.

CRI-level:
- [containerd](https://containerd.io/), since v2.0
- [CRI-O](https://cri-o.io/), since v1.31

You can see if the feature is supported in the Node status.
-->
已知以下容器运行时支持细粒度的 SupplementalGroups 控制。

CRI 级别：

- [containerd](https://containerd.io/)，自 v2.0 起
- [CRI-O](https://cri-o.io/)，自 v1.31 起

你可以在 Node 状态中查看此特性是否受支持。

```yaml
apiVersion: v1
kind: Node
...
status:
  features:
    supplementalGroupsPolicy: true
```

<!--
## Configure volume permission and ownership change policy for Pods
-->
## 为 Pod 配置卷访问权限和属主变更策略    {#configure-volume-permission-and-ownership-change-policy-for-pods}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
By default, Kubernetes recursively changes ownership and permissions for the contents of each
volume to match the `fsGroup` specified in a Pod's `securityContext` when that volume is
mounted.
For large volumes, checking and changing ownership and permissions can take a lot of time,
slowing Pod startup. You can use the `fsGroupChangePolicy` field inside a `securityContext`
to control the way that Kubernetes checks and manages ownership and permissions
for a volume.
-->
默认情况下，Kubernetes 在挂载一个卷时，会递归地更改每个卷中的内容的属主和访问权限，
使之与 Pod 的 `securityContext` 中指定的 `fsGroup` 匹配。
对于较大的数据卷，检查和变更属主与访问权限可能会花费很长时间，降低 Pod 启动速度。
你可以在 `securityContext` 中使用 `fsGroupChangePolicy` 字段来控制 Kubernetes
检查和管理卷属主和访问权限的方式。

<!--
**fsGroupChangePolicy** -  `fsGroupChangePolicy` defines behavior for changing ownership
  and permission of the volume before being exposed inside a Pod.
  This field only applies to volume types that support `fsGroup` controlled ownership and permissions.
  This field has two possible values:

* _OnRootMismatch_: Only change permissions and ownership if the permission and the ownership of
  root directory does not match with expected permissions of the volume.
  This could help shorten the time it takes to change ownership and permission of a volume.
* _Always_: Always change permission and ownership of the volume when volume is mounted.

For example:
-->
**fsGroupChangePolicy** - `fsGroupChangePolicy` 定义在卷被暴露给 Pod 内部之前对其
内容的属主和访问许可进行变更的行为。此字段仅适用于那些支持使用 `fsGroup` 来
控制属主与访问权限的卷类型。此字段的取值可以是：

* `OnRootMismatch`：只有根目录的属主与访问权限与卷所期望的权限不一致时，
  才改变其中内容的属主和访问权限。这一设置有助于缩短更改卷的属主与访问
  权限所需要的时间。
* `Always`：在挂载卷时总是更改卷中内容的属主和访问权限。

例如：

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

<!--
This field has no effect on ephemeral volume types such as
[`secret`](/docs/concepts/storage/volumes/#secret),
[`configMap`](/docs/concepts/storage/volumes/#configmap),
and [`emptydir`](/docs/concepts/storage/volumes/#emptydir).
-->
{{< note >}}
此字段对于 [`secret`](/zh-cn/docs/concepts/storage/volumes/#secret)、
[`configMap`](/zh-cn/docs/concepts/storage/volumes/#configmap)
和 [`emptydir`](/zh-cn/docs/concepts/storage/volumes/#emptydir)
这类临时性存储无效。
{{< /note >}}

<!--
## Delegating volume permission and ownership change to CSI driver
-->
## 将卷权限和所有权更改委派给 CSI 驱动程序
{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
If you deploy a [Container Storage Interface (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md)
driver which supports the `VOLUME_MOUNT_GROUP` `NodeServiceCapability`, the
process of setting file ownership and permissions based on the
`fsGroup` specified in the `securityContext` will be performed by the CSI driver
instead of Kubernetes. In this case, since Kubernetes doesn't perform any
ownership and permission change, `fsGroupChangePolicy` does not take effect, and
as specified by CSI, the driver is expected to mount the volume with the
provided `fsGroup`, resulting in a volume that is readable/writable by the
`fsGroup`.
-->
如果你部署了一个[容器存储接口 (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md)
驱动，而该驱动支持 `VOLUME_MOUNT_GROUP` `NodeServiceCapability`，
在 `securityContext` 中指定 `fsGroup` 来设置文件所有权和权限的过程将由 CSI
驱动而不是 Kubernetes 来执行。在这种情况下，由于 Kubernetes 不执行任何所有权和权限更改，
`fsGroupChangePolicy` 不会生效，并且按照 CSI 的规定，CSI 驱动应该使用所指定的
`fsGroup` 来挂载卷，从而生成了一个对 `fsGroup` 可读/可写的卷.

<!--
## Set the security context for a Container

To specify security settings for a Container, include the `securityContext` field
in the Container manifest. The `securityContext` field is a
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core) object.
Security settings that you specify for a Container apply only to
the individual Container, and they override settings made at the Pod level when
there is overlap. Container settings do not affect the Pod's Volumes.

Here is the configuration file for a Pod that has one Container. Both the Pod
and the Container have a `securityContext` field:
-->
## 为 Container 设置安全性上下文  {#set-the-security-context-for-a-container}

若要为 Container 设置安全性配置，可以在 Container 清单中包含 `securityContext` 
字段。`securityContext` 字段的取值是一个
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
对象。你为 Container 设置的安全性配置仅适用于该容器本身，并且所指定的设置在与
Pod 层面设置的内容发生重叠时，会重写 Pod 层面的设置。Container 层面的设置不会影响到 Pod 的卷。

下面是一个 Pod 的配置文件，其中包含一个 Container。Pod 和 Container 都有
`securityContext` 字段：

{{% code_sample file="pods/security/security-context-2.yaml" %}}

<!--
Create the Pod:
-->
创建该 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

<!--
Verify that the Pod's Container is running:
-->
验证 Pod 中的容器处于运行状态：

```shell
kubectl get pod security-context-demo-2
```

<!--
Get a shell into the running Container:
-->
启动一个 Shell 进入到运行中的容器内：

```shell
kubectl exec -it security-context-demo-2 -- sh
```

<!--
In your shell, list the running processes:
-->
在你的 Shell 中，列举运行中的进程：

```shell
ps aux
```

<!--
The output shows that the processes are running as user 2000. This is the value
of `runAsUser` specified for the Container. It overrides the value 1000 that is
specified for the Pod.
-->
输出显示进程以用户 2000 运行。该值是在 Container 的 `runAsUser` 中设置的。
该设置值重写了 Pod 层面所设置的值 1000。

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

<!--
Exit your shell:
-->
退出你的 Shell：

```shell
exit
```

<!--
## Set capabilities for a Container

With [Linux capabilities](https://man7.org/linux/man-pages/man7/capabilities.7.html),
you can grant certain privileges to a process without granting all the privileges
of the root user. To add or remove Linux capabilities for a Container, include the
`capabilities` field in the `securityContext` section of the Container manifest.

First, see what happens when you don't include a `capabilities` field.
Here is configuration file that does not add or remove any Container capabilities:
-->
## 为 Container 设置权能   {#set-capabilities-for-a-container}

使用 [Linux 权能](https://man7.org/linux/man-pages/man7/capabilities.7.html)，
你可以赋予进程 root 用户所拥有的某些特权，但不必赋予其全部特权。
要为 Container 添加或移除 Linux 权能，可以在 Container 清单的 `securityContext`
节包含 `capabilities` 字段。

首先，看一下不包含 `capabilities` 字段时候会发生什么。
下面是一个配置文件，其中没有添加或移除容器的权能：

{{% code_sample file="pods/security/security-context-3.yaml" %}}

<!--
Create the Pod:
-->
创建该 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

<!--
Verify that the Pod's Container is running:
-->
验证 Pod 的容器处于运行状态：

```shell
kubectl get pod security-context-demo-3
```

<!--
Get a shell into the running Container:
-->
启动一个 Shell 进入到运行中的容器：

```shell
kubectl exec -it security-context-demo-3 -- sh
```

<!--
In your shell, list the running processes:
-->
在你的 Shell 中，列举运行中的进程：

```shell
ps aux
```

<!--
The output shows the process IDs (PIDs) for the Container:
-->
输出显示容器中进程 ID（PIDs）：

```
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

<!--
In your shell, view the status for process 1:
-->
在你的 Shell 中，查看进程 1 的状态：

```shell
cd /proc/1
cat status
```

<!--
The output shows the capabilities bitmap for the process:
-->
输出显示进程的权能位图：

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

<!--
Make a note of the capabilities bitmap, and then exit your shell:
-->
记下进程权能位图，之后退出你的 Shell：

```shell
exit
```

<!--
Next, run a Container that is the same as the preceding container, except
that it has additional capabilities set.

Here is the configuration file for a Pod that runs one Container. The configuration
adds the `CAP_NET_ADMIN` and `CAP_SYS_TIME` capabilities:
-->
接下来运行一个与前例中容器相同的容器，只是这个容器有一些额外的权能设置。

下面是一个 Pod 的配置，其中运行一个容器。配置为容器添加 `CAP_NET_ADMIN` 和
`CAP_SYS_TIME` 权能：

{{% code_sample file="pods/security/security-context-4.yaml" %}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

<!--
Get a shell into the running Container:
-->
启动一个 Shell，进入到运行中的容器：

```shell
kubectl exec -it security-context-demo-4 -- sh
```

<!--
In your shell, view the capabilities for process 1:
-->
在你的 Shell 中，查看进程 1 的权能：

```shell
cd /proc/1
cat status
```

<!--
The output shows capabilities bitmap for the process:
-->
输出显示的是进程的权能位图：

```
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

<!--
Compare the capabilities of the two Containers:
-->
比较两个容器的权能位图：

```
00000000a80425fb
00000000aa0435fb
```

<!--
In the capability bitmap of the first container, bits 12 and 25 are clear. In the second container,
bits 12 and 25 are set. Bit 12 is `CAP_NET_ADMIN`, and bit 25 is `CAP_SYS_TIME`.
See [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
for definitions of the capability constants.
-->
在第一个容器的权能位图中，位 12 和 25 是没有设置的。在第二个容器中，位 12
和 25 是设置了的。位 12 是 `CAP_NET_ADMIN` 而位 25 则是 `CAP_SYS_TIME`。
参见 [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
了解权能常数的定义。

<!--
Linux capability constants have the form `CAP_XXX`.
But when you list capabilities in your container manifest, you must
omit the `CAP_` portion of the constant.
For example, to add `CAP_SYS_TIME`, include `SYS_TIME` in your list of capabilities.
-->
{{< note >}}
Linux 权能常数定义的形式为 `CAP_XXX`。但是你在 container 清单中列举权能时，
要将权能名称中的 `CAP_` 部分去掉。例如，要添加 `CAP_SYS_TIME`，
可在权能列表中添加 `SYS_TIME`。
{{< /note >}}

<!--
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
-->
## 为容器设置 Seccomp 配置 

若要为容器设置 Seccomp 配置（Profile），可在你的 Pod 或 Container 清单的
`securityContext` 节中包含 `seccompProfile` 字段。该字段是一个 
[SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#seccompprofile-v1-core)
对象，包含 `type` 和 `localhostProfile` 属性。
`type` 的合法选项包括 `RuntimeDefault`、`Unconfined` 和 `Localhost`。
`localhostProfile` 只能在 `type: Localhost` 配置下才可以设置。
该字段标明节点上预先设定的配置的路径，路径是相对于 kubelet 所配置的
Seccomp 配置路径（使用 `--root-dir` 设置）而言的。

下面是一个例子，设置容器使用节点上容器运行时的默认配置作为 Seccomp 配置：

```yaml
...
securityContext:
  seccompProfile:
    type: RuntimeDefault
```

<!--
Here is an example that sets the Seccomp profile to a pre-configured file at
`<kubelet-root-dir>/seccomp/my-profiles/profile-allow.json`:
-->
下面是另一个例子，将 Seccomp 的样板设置为位于
`<kubelet-根目录>/seccomp/my-profiles/profile-allow.json`
的一个预先配置的文件。

```yaml
...
securityContext:
  seccompProfile:
    type: Localhost
    localhostProfile: my-profiles/profile-allow.json
```

<!--
## Set the AppArmor Profile for a Container
-->
## 为 Container 设置 AppArmor 配置   {#set-the-apparmor-profile-for-a-container}

<!--
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
-->
要为 Container 设置 AppArmor 配置，请在 Container 的 `securityContext` 节中包含 `appArmorProfile` 字段。
`appArmorProfile` 字段是一个
[AppArmorProfile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#apparmorprofile-v1-core)
对象，由 `type` 和 `localhostProfile` 组成。  
`type` 的有效选项包括 `RuntimeDefault`（默认）、`Unconfined` 和 `Localhost`。
只有当 `type` 为 `Localhost` 时，才能设置 `localhostProfile`。  
它表示节点上预配的配置文件的名称。
此配置需要被加载到所有适合 Pod 的节点上，因为你不知道 Pod 将被调度到哪里。  
关于设置自定义配置的方法，参见[使用配置文件设置节点](/zh-cn/docs/tutorials/security/apparmor/#setting-up-nodes-with-profiles)。

<!--
Note: If `containers[*].securityContext.appArmorProfile.type` is explicitly set 
to `RuntimeDefault`, then the Pod will not be admitted if AppArmor is not
enabled on the Node. However if `containers[*].securityContext.appArmorProfile.type`
is not specified, then the default (which is also `RuntimeDefault`) will only
be applied if the node has AppArmor enabled. If the node has AppArmor disabled
the Pod will be admitted but the Container will not be restricted by the 
`RuntimeDefault` profile.

Here is an example that sets the AppArmor profile to the node's container runtime
default profile:
-->
注意：如果 `containers[*].securityContext.appArmorProfile.type` 被显式设置为
`RuntimeDefault`，那么如果 AppArmor 未在 Node 上被启用，Pod 将不会被准入。  
然而，如果 `containers[*].securityContext.appArmorProfile.type` 未被指定，
则只有在节点已启用 AppArmor 时才会应用默认值（也是 `RuntimeDefault`）。  
如果节点已禁用 AppArmor，Pod 将被准入，但 Container 将不受 `RuntimeDefault` 配置的限制。

以下是将 AppArmor 配置设置为节点的容器运行时默认配置的例子：

```yaml
...
containers:
- name: container-1
  securityContext:
    appArmorProfile:
      type: RuntimeDefault
```

<!--
Here is an example that sets the AppArmor profile to a pre-configured profile
named `k8s-apparmor-example-deny-write`:
-->
以下是将 AppArmor 配置设置为名为 `k8s-apparmor-example-deny-write` 的预配配置的例子：

```yaml
...
containers:
- name: container-1
  securityContext:
    appArmorProfile:
      type: Localhost
      localhostProfile: k8s-apparmor-example-deny-write
```

<!--
For more details please see, [Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/).
-->
有关更多细节参见[使用 AppArmor 限制容器对资源的访问](/zh-cn/docs/tutorials/security/apparmor/)。

<!--
## Assign SELinux labels to a Container

To assign SELinux labels to a Container, include the `seLinuxOptions` field in
the `securityContext` section of your Pod or Container manifest. The
`seLinuxOptions` field is an
[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)
object. Here's an example that applies an SELinux level:
-->
## 为 Container 赋予 SELinux 标签   {#assign-selinux-labels-to-a-container}

若要给 Container 设置 SELinux 标签，可以在 Pod 或 Container 清单的
`securityContext` 节包含 `seLinuxOptions` 字段。
`seLinuxOptions` 字段的取值是一个
[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)
对象。下面是一个应用 SELinux 标签的例子：

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
<!--
To assign SELinux labels, the SELinux security module must be loaded on the host operating system.
-->
要指定 SELinux，需要在宿主操作系统中装载 SELinux 安全性模块。
{{< /note >}}

<!--
### Efficient SELinux volume relabeling
-->
### 高效重打 SELinux 卷标签

{{< feature-state feature_gate_name="SELinuxMountReadWriteOncePod" >}}

{{< note >}}
<!--
Kubernetes v1.27 introduced an early limited form of this behavior that was only applicable
to volumes (and PersistentVolumeClaims) using the `ReadWriteOncePod` access mode.
-->
Kubernetes v1.27 引入了此行为的早期受限形式，仅适用于使用 `ReadWriteOncePod`
访问模式的卷（和 PersistentVolumeClaim）。

<!--
As an alpha feature, you can enable the `SELinuxMount`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to widen that
performance improvement to other kinds of PersistentVolumeClaims, as explained in detail
below.
-->
作为一项 Alpha 特性，你可以启用 `SELinuxMount`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
将性能改进扩展到其他类型的 PersistentVolumeClaim，如下文详细解释。
{{< /note >}}


<!--
By default, the container runtime recursively assigns SELinux label to all
files on all Pod volumes. To speed up this process, Kubernetes can change the
SELinux label of a volume instantly by using a mount option
`-o context=<label>`.
-->
默认情况下，容器运行时递归地将 SELinux 标签赋予所有 Pod 卷上的所有文件。
为了加快该过程，Kubernetes 使用挂载可选项 `-o context=<label>` 可以立即改变卷的 SELinux 标签。

<!--
To benefit from this speedup, all these conditions must be met:
-->
要使用这项加速功能，必须满足下列条件：

<!--
* The [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `ReadWriteOncePod`
  and `SELinuxMountReadWriteOncePod` must be enabled.
-->
* 必须启用 `ReadWriteOncePod` 和 `SELinuxMountReadWriteOncePod`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
* Pod must use PersistentVolumeClaim with applicable `accessModes` and [feature gates](/docs/reference/command-line-tools-reference/feature-gates/):
  * Either the volume has `accessModes: ["ReadWriteOncePod"]`, and feature gate `SELinuxMountReadWriteOncePod` is enabled.
  * Or the volume can use any other access modes and both feature gates `SELinuxMountReadWriteOncePod` and `SELinuxMount` must be enabled.
-->
* Pod 必须使用带有对应的 `accessModes` 和[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
  的 PersistentVolumeClaim。
  * 卷具有 `accessModes: ["ReadWriteOncePod"]`，并且 `SELinuxMountReadWriteOncePod` 特性门控已启用。
  * 或者卷可以使用任何其他访问模式，并且必须启用 `SELinuxMountReadWriteOncePod` 和 `SELinuxMount` 特性门控。

<!--
* Pod (or all its Containers that use the PersistentVolumeClaim) must
  have `seLinuxOptions` set.
-->
* Pod（或其中使用 PersistentVolumeClaim 的所有容器）必须设置 `seLinuxOptions`。

<!--
* The corresponding PersistentVolume must be either a volume that uses a
  {{< glossary_tooltip text="CSI" term_id="csi" >}} driver, or a volume that uses the
  legacy `iscsi` volume type.
  * If you use a volume backed by a CSI driver, that CSI driver must announce that it
    supports mounting with `-o context` by setting `spec.seLinuxMount: true` in
    its CSIDriver instance.

* The corresponding PersistentVolume must be either:
  * A volume that uses the legacy in-tree `iscsi`, `rbd` or `fc` volume type.
  * Or a volume that uses a {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.
    The CSI driver must announce that it supports mounting with `-o context` by setting
    `spec.seLinuxMount: true` in its CSIDriver instance.
-->
* 对应的 PersistentVolume 必须是：
  * 使用传统树内（In-Tree） `iscsi`、`rbd` 或 `fs` 卷类型的卷。
  * 或者是使用 {< glossary_tooltip text="CSI" term_id="csi" >}} 驱动程序的卷
    CSI 驱动程序必须能够通过在 CSIDriver 实例中设置 `spec.seLinuxMount: true`
    以支持 `-o context` 挂载。

<!--
For any other volume types, SELinux relabelling happens another way: the container
runtime  recursively changes the SELinux label for all inodes (files and directories)
in the volume.
The more files and directories in the volume, the longer that relabelling takes.
-->
对于所有其他卷类型，重打 SELinux 标签的方式有所不同：
容器运行时为卷中的所有节点（文件和目录）递归地修改 SELinux 标签。
卷中的文件和目录越多，重打标签需要耗费的时间就越长。

<!--
## Managing access to the `/proc` filesystem {#proc-access}
-->
## 管理对 `/proc` 文件系统的访问   {#proc-access}

{{< feature-state feature_gate_name="ProcMountType" >}}

<!--
For runtimes that follow the OCI runtime specification, containers default to running in a mode where
there are multiple paths that are both masked and read-only.
The result of this is the container has these paths present inside the container's mount namespace, and they can function similarly to if
the container was an isolated host, but the container process cannot write to
them. The list of masked and read-only paths are as follows:
-->
对于遵循 OCI 运行时规范的运行时，容器默认运行模式下，存在多个被屏蔽且只读的路径。
这样做的结果是在容器的 mount 命名空间内会存在这些路径，并且这些路径的工作方式与容器是隔离主机时类似，
但容器进程无法写入它们。
被屏蔽的和只读的路径列表如下：

<!--
- Masked Paths:
-->
- 被屏蔽的路径：

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

<!--
- Read-Only Paths:
-->
- 只读的路径：

  - `/proc/bus`
  - `/proc/fs`
  - `/proc/irq`
  - `/proc/sys`
  - `/proc/sysrq-trigger`

<!--
For some Pods, you might want to bypass that default masking of paths.
The most common context for wanting this is if you are trying to run containers within
a Kubernetes container (within a pod).
-->
对于某些 Pod，你可能希望绕过默认的路径屏蔽。
最常见的情况是你尝试在 Kubernetes 容器内（在 Pod 内）运行容器。

<!--
The `securityContext` field `procMount` allows a user to request a container's `/proc`
be `Unmasked`, or be mounted as read-write by the container process. This also
applies to `/sys/firmware` which is not in `/proc`.
-->
`securityContext` 字段 `procMount` 允许用户请求容器的 `/proc` 为 `Unmasked`，
或者由容器进程以读写方式挂载。这一设置也适用于不在 `/proc` 内的 `/sys/firmware` 路径。

```yaml
...
securityContext:
  procMount: Unmasked
```

{{< note >}}
<!--
Setting `procMount` to Unmasked requires the `spec.hostUsers` value in the pod
spec to be `false`. In other words: a container that wishes to have an Unmasked
`/proc` or unmasked `/sys` must also be in a
[user namespace](/docs/concepts/workloads/pods/user-namespaces/).
Kubernetes v1.12 to v1.29 did not enforce that requirement.
-->
将 `procMount` 设置为 Unmasked 需要将 Pod 规约中的 `spec.hostUsers`
的值设置为 `false`。换句话说：希望使用未被屏蔽的 `/proc` 或 `/sys`
路径的容器也必须位于 [user 命名空间](/zh-cn/docs/concepts/workloads/pods/user-namespaces/)中。
Kubernetes v1.12 到 v1.29 没有强制执行该要求。
{{< /note >}}

<!--
## Discussion

The security context for a Pod applies to the Pod's Containers and also to
the Pod's Volumes when applicable. Specifically `fsGroup` and `seLinuxOptions` are
applied to Volumes as follows:
-->
## 讨论   {#discussion}

Pod 的安全上下文适用于 Pod 中的容器，也适用于 Pod 所挂载的卷（如果有的话）。
尤其是，`fsGroup` 和 `seLinuxOptions` 按下面的方式应用到挂载卷上：

<!--
* `fsGroup`: Volumes that support ownership management are modified to be owned
  and writable by the GID specified in `fsGroup`. See the
  [Ownership Management design document](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)
  for more details.

* `seLinuxOptions`: Volumes that support SELinux labeling are relabeled to be accessible
  by the label specified under `seLinuxOptions`. Usually you only
  need to set the `level` section. This sets the
  [Multi-Category Security (MCS)](https://selinuxproject.org/page/NB_MLS)
  label given to all Containers in the Pod as well as the Volumes.
-->
* `fsGroup`：支持属主管理的卷会被修改，将其属主变更为 `fsGroup` 所指定的 GID，
  并且对该 GID 可写。进一步的细节可参阅
  [属主变更设计文档](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)。

* `seLinuxOptions`：支持 SELinux 标签的卷会被重新打标签，以便可被 `seLinuxOptions`
  下所设置的标签访问。通常你只需要设置 `level` 部分。
  该部分设置的是赋予 Pod 中所有容器及卷的
  [多类别安全性（Multi-Category Security，MCS)](https://selinuxproject.org/page/NB_MLS)标签。

<!--
After you specify an MCS label for a Pod, all Pods with the same label can
access the Volume. If you need inter-Pod protection, you must assign a unique
MCS label to each Pod.
-->
{{< warning >}}
在为 Pod 设置 MCS 标签之后，所有带有相同标签的 Pod 可以访问该卷。
如果你需要跨 Pod 的保护，你必须为每个 Pod 赋予独特的 MCS 标签。
{{< /warning >}}

<!--
## Clean up

Delete the Pod:
-->
## 清理

删除之前创建的所有 Pod：

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```

## {{% heading "whatsnext" %}}

<!--
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
-->
* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core) API 定义
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core) API 定义
* [CRI 插件配置指南](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
* [安全上下文的设计文档（英文）](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/security_context.md)
* [属主管理的设计文档（英文）](https://github.com/kubernetes/design-proposals-archive/blob/main/storage/volume-ownership-management.md)
* [Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)
* [AllowPrivilegeEscalation 的设计文档（英文）](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/no-new-privs.md)
* 关于在 Linux 系统中的安全机制的更多信息，可参阅
  [Linux 内核安全性能力概述](https://www.linux.com/learn/overview-linux-kernel-security-features)（注意：部分信息已过时）。
* 了解 Linux Pod 的 [user 命名空间](/zh-cn/docs/concepts/workloads/pods/user-namespaces/)。
* [OCI 运行时规范中的被屏蔽的路径](https://github.com/opencontainers/runtime-spec/blob/f66aad47309/config-linux.md#masked-paths)
