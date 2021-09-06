---
title: 为 Pod 或容器配置安全性上下文
content_type: task
weight: 80
---
<!--
reviewers:
- erictune
- mikedanese
- thockin
title: Configure a Security Context for a Pod or Container
content_type: task
weight: 80
-->

<!-- overview -->

<!--
A security context defines privilege and access control settings for
a Pod or Container. Security context settings include, but are not limited to:

* Discretionary Access Control: Permission to access an object, like a file, is based on
  [user ID (UID) and group ID (GID)](https://wiki.archlinux.org/index.php/users_and_groups).
* [Security Enhanced Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux): Objects are assigned security labels.
* Running as privileged or unprivileged.
* [Linux Capabilities](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): 
  Give a process some privileges, but not all the privileges of the root user.
-->
安全上下文（Security Context）定义 Pod 或 Container 的特权与访问控制设置。
安全上下文包括但不限于：

* 自主访问控制（Discretionary Access Control）：基于
  [用户 ID（UID）和组 ID（GID）](https://wiki.archlinux.org/index.php/users_and_groups).
  来判定对对象（例如文件）的访问权限。
* [安全性增强的 Linux（SELinux）](https://zh.wikipedia.org/wiki/%E5%AE%89%E5%85%A8%E5%A2%9E%E5%BC%BA%E5%BC%8FLinux)：
  为对象赋予安全性标签。
* 以特权模式或者非特权模式运行。
* [Linux 权能](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): 
  为进程赋予 root 用户的部分特权而非全部特权。
<!--
* [AppArmor](/docs/tutorials/clusters/apparmor/): Use program profiles to restrict the capabilities of individual programs.
* [Seccomp](https://en.wikipedia.org/wiki/Seccomp): Filter a process's system calls.
* AllowPrivilegeEscalation: Controls whether a process can gain more
  privileges than its parent process. This bool directly controls whether the
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
  flag gets set on the container process. AllowPrivilegeEscalation is true
  always when the container is: 1) run as Privileged OR 2) has `CAP_SYS_ADMIN`.
* readOnlyRootFilesystem: Mounts the container's root filesystem as read-only.
-->
* [AppArmor](/zh/docs/tutorials/clusters/apparmor/)：使用程序框架来限制个别程序的权能。
* [Seccomp](https://en.wikipedia.org/wiki/Seccomp)：过滤进程的系统调用。
* AllowPrivilegeEscalation：控制进程是否可以获得超出其父进程的特权。
  此布尔值直接控制是否为容器进程设置
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)标志。
  当容器以特权模式运行或者具有 `CAP_SYS_ADMIN` 权能时，AllowPrivilegeEscalation 总是为 true。
* readOnlyRootFilesystem：以只读方式加载容器的根文件系统。

<!--
The above bullets are not a complete set of security context settings - please see
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
for a comprehensive list.

For more information about security mechanisms in Linux, see
[Overview of Linux Kernel Security Features](https://www.linux.com/learn/overview-linux-kernel-security-features)
-->
以上条目不是安全上下文设置的完整列表 -- 请参阅
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
了解其完整列表。

关于在 Linux 系统中的安全机制的更多信息，可参阅
[Linux 内核安全性能力概述](https://www.linux.com/learn/overview-linux-kernel-security-features)。

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

{{< codenew file="pods/security/security-context.yaml" >}}

<!--
In the configuration file, the `runAsUser` field specifies that for any Containers in
the Pod, all processes run with user ID 1000. The `runAsGroup` field specifies the primary group ID of 3000 for
all processes within any containers of the Pod. If this field is omitted, the primary group ID of the containers
will be root(0). Any files created will also be owned by user 1000 and group 3000 when `runAsGroup` is specified.
Since `fsGroup` field is specified, all processes of the container are also part of the supplementary group ID 2000.
The owner for volume `/data/demo` and any files created in that volume will be Group ID 2000.

Create the Pod:
-->
在配置文件中，`runAsUser` 字段指定 Pod 中的所有容器内的进程都使用用户 ID 1000
来运行。`runAsGroup` 字段指定所有容器中的进程都以主组 ID 3000 来运行。
如果忽略此字段，则容器的主组 ID 将是 root（0）。
当 `runAsGroup` 被设置时，所有创建的文件也会划归用户 1000 和组 3000。
由于 `fsGroup` 被设置，容器中所有进程也会是附组 ID 2000 的一部分。
卷 `/data/demo` 及在该卷中创建的任何文件的属主都会是组 ID 2000。

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

```shell
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

```shell
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

```shell
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

<!--
Run the following command:
-->
运行下面的命令：

```shell
id
```

输出为：
```
uid=1000 gid=3000 groups=2000
```

<!--
You will see that gid is 3000 which is same as `runAsGroup` field. If the `runAsGroup` was omitted the gid would
remain as 0(root) and the process will be able to interact with files that are owned by root(0) group and that have
the required group permissions for root(0) group.

Exit your shell:
-->
你会看到 `gid` 值为 3000，也就是 `runAsGroup` 字段的值。
如果 `runAsGroup` 被忽略，则 `gid` 会取值 0（root），而进程就能够与 root
用户组所拥有以及要求 root 用户组访问权限的文件交互。

退出你的 Shell：

```shell
exit
```

<!--
## Configure volume permission and ownership change policy for Pods
-->
## 为 Pod 配置卷访问权限和属主变更策略

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

<!--
By default, Kubernetes recursively changes ownership and permissions for the contents of each
volume to match the `fsGroup` specified in a Pod's `securityContext` when that volume is
mounted.
For large volumes, checking and changing ownership and permissions can take a lot of time,
slowing Pod startup. You can use the `fsGroupChangePolicy` field inside a `securityContext`
to control the way that Kubernetes checks and manages ownership and permissions
for a volume.
-->
默认情况下，Kubernetes 在挂载一个卷时，会递归地更改每个卷中的内容的属主和访问权限，使之与 Pod
的 `securityContext` 中指定的 `fsGroup` 匹配。
对于较大的数据卷，检查和变更属主与访问权限可能会花费很长时间，降低 Pod 启动速度。
你可以在 `securityContext` 中使用 `fsGroupChangePolicy` 字段来控制 Kubernetes
检查和管理卷属主和访问权限的方式。

<!--
**fsGroupChangePolicy** -  `fsGroupChangePolicy` defines behavior for changing ownership and permission of the volume
before being exposed inside a Pod. This field only applies to volume types that support
`fsGroup` controlled ownership and permissions. This field has two possible values:

* _OnRootMismatch_: Only change permissions and ownership if permission and ownership of root directory does not match with expected permissions of the volume. This could help shorten the time it takes to change ownership and permission of a volume.
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
This is an alpha feature. To use it, enable the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `ConfigurableFSGroupPolicy` for the kube-api-server, the kube-controller-manager, and for the kubelet.
-->
这是一个 Alpha 阶段的功能特性。要使用此特性，需要在 `kube-apiserver`、`kube-controller-manager`
和 `kubelet` 上启用 `ConfigurableFSGroupPolicy`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
This field has no effect on ephemeral volume types such as
[`secret`](/docs/concepts/storage/volumes/#secret),
[`configMap`](/docs/concepts/storage/volumes/#configmap),
and [`emptydir`](/docs/concepts/storage/volumes/#emptydir).
-->
{{< note >}}
此字段对于[`secret`](/zh/docs/concepts/storage/volumes/#secret)、
[`configMap`](/zh/docs/concepts/storage/volumes/#configmap)
和 [`emptydir`](/zh/docs/concepts/storage/volumes/#emptydir)
这类临时性存储无效。
{{< /note >}}

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
对象。你为 Container 设置的安全性配置仅适用于该容器本身，并且所指定的设置
在与 Pod 层面设置的内容发生重叠时，会重载后者。Container 层面的设置不会影响
到 Pod 的卷。

下面是一个 Pod 的配置文件，其中包含一个 Container。Pod 和 Container 都有
`securityContext` 字段：

{{< codenew file="pods/security/security-context-2.yaml" >}}

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
输出显示进程以用户 2000 账号运行。该值是在 Container 的 `runAsUser` 中设置的。
该设置值重载了 Pod 层面所设置的值 1000。

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

使用 [Linux 权能](https://man7.org/linux/man-pages/man7/capabilities.7.html)，你可以
赋予进程 root 用户所拥有的某些特权，但不必赋予其全部特权。
要为 Container 添加或移除 Linux 权能，可以在 Container 清单的 `securityContext` 节
包含 `capabilities` 字段。

首先，查看不包含 `capabilities` 字段时候会发生什么。
下面是一个配置文件，其中没有添加或移除容器的权能：

{{< codenew file="pods/security/security-context-3.yaml" >}}

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

```shell
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

{{< codenew file="pods/security/security-context-4.yaml" >}}

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

```shell
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
Linux capability constants have the form `CAP_XXX`. But when you list capabilities in your Container manifest, you must omit the `CAP_` portion of the constant. For example, to add `CAP_SYS_TIME`, include `SYS_TIME` in your list of capabilities.
-->
{{< note >}}
Linux 权能常数定义的形式为 `CAP_XXX`。但是你在 Container 清单中列举权能时，
要将权能名称中的 `CAP_` 部分去掉。例如，要添加 `CAP_SYS_TIME`，可在权能
列表中添加 `SYS_TIME`。
{{< /note >}}

<!--
## Set the Seccomp Profile for a Container

To set the Seccomp profile for a Container, include the `seccompProfile` field
in the `securityContext` section of your Pod or Container manifest. The
`seccompProfile` field is a
[SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version"
>}}/#seccompprofile-v1-core) object consisting of `type` and `localhostProfile`.
Valid options for `type` include `RuntimeDefault`, `Unconfined`, and
`Localhost`. `localhostProfile` must only be set set if `type: Localhost`. It
indicates the path of the pre-configured profile on the node, relative to the
kubelet's configured Seccomp profile location (configured with the `-root-dir`
flag).

Here is an example that sets the Seccomp profile to the node's container runtime
default profile:
-->
## 为容器设置 Seccomp 样板

若要为容器设置 Seccomp 样板（Profile），可在你的 Pod 或 Container 清单的
`securityContext` 节中包含 `seccompProfile` 字段。该字段是一个 
[SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#seccompprofile-v1-core)
对象，包含 `type` 和 `localhostProfile` 属性。
`type` 的合法选项包括 `RuntimeDefault`、`Unconfined` 和 `Localhost`。
`localhostProfile` 只能在 `type: Localhost` 配置下才需要设置。
该字段标明节点上预先配置的样板的路径，路径是相对于 kubelet 所配置的
Seccomp 样板路径（使用 `--root-dir` 配置）而言的。

下面是一个例子，设置容器使用节点上容器运行时的默认样板作为 Seccomp 样板：

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
## Assign SELinux labels to a Container

To assign SELinux labels to a Container, include the `seLinuxOptions` field in
the `securityContext` section of your Pod or Container manifest. The
`seLinuxOptions` field is an
[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)
object. Here's an example that applies an SELinux level:
-->
## 为 Container 赋予 SELinux 标签

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

<!--
To assign SELinux labels, the SELinux security module must be loaded on the host operating system.
-->
{{< note >}}
要指定 SELinux，需要在宿主操作系统中装载 SELinux 安全性模块。
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
[Ownership Management design document](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
for more details.

* `seLinuxOptions`: Volumes that support SELinux labeling are relabeled to be accessible
by the label specified under `seLinuxOptions`. Usually you only
need to set the `level` section. This sets the
[Multi-Category Security (MCS)](https://selinuxproject.org/page/NB_MLS)
label given to all Containers in the Pod as well as the Volumes.
-->
* `fsGroup`：支持属主管理的卷会被修改，将其属主变更为 `fsGroup` 所指定的 GID，
  并且对该 GID 可写。进一步的细节可参阅
  [属主变更设计文档](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)。

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
* [Tuning Docker with the newest security enhancements](https://opensource.com/business/15/3/docker-security-tuning)
* [Security Contexts design document](https://git.k8s.io/community/contributors/design-proposals/auth/security_context.md)
* [Ownership Management design document](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
* [Pod Security Policies](/docs/concepts/policy/pod-security-policy/)
* [AllowPrivilegeEscalation design
  document](https://git.k8s.io/community/contributors/design-proposals/auth/no-new-privs.md)
-->
* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core) API 定义
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core) API 定义
* [使用最新的安全性增强来调优 Docker](https://opensource.com/business/15/3/docker-security-tuning)
* [安全性上下文的设计文档](https://git.k8s.io/community/contributors/design-proposals/auth/security_context.md)
* [属主管理的设计文档](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
* [Pod 安全策略](/zh/docs/concepts/policy/pod-security-policy/)
* [AllowPrivilegeEscalation 的设计文档](https://git.k8s.io/community/contributors/design-proposals/auth/no-new-privs.md)

