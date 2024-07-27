---
title: 针对 Pod 和容器的 Linux 内核安全约束
description: >
  概述你可用于增强 Pod 和容器安全性的 Linux 内核安全模块和约束
content_type: concept
weight: 100
---
<!--
title: Linux kernel security constraints for Pods and containers
description: >
  Overview of Linux kernel security modules and constraints that you can use to
  harden your Pods and containers.
content_type: concept
weight: 100
-->

<!-- overview -->

<!--
This page describes some of the security features that are built into the Linux
kernel that you can use in your Kubernetes workloads. To learn how to apply
these features to your Pods and containers, refer to
[Configure a SecurityContext for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).
You should already be familiar with Linux and with the basics of Kubernetes
workloads.
-->
本页描述了一些 Linux 内核中内置的、你可以在 Kubernetes 工作负载中使用的安全特性。
要了解如何将这些特性应用到你的 Pod 和容器，
请参阅[为 Pod 或容器配置 SecurityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)。
你须熟悉 Linux 和 Kubernetes 工作负载的基础知识。

<!-- body -->

<!--
## Run workloads without root privileges {#run-without-root}

When you deploy a workload in Kubernetes, use the Pod specification to restrict
that workload from running as the root user on the node. You can use the Pod
`securityContext` to define the specific Linux user and group for the processes in
the Pod, and explicitly restrict containers from running as root users. Setting
these values in the Pod manifest takes precedence over similar values in the
container image, which is especially useful if you're running images that you
don't own.
-->
## 运行不具有 root 特权的工作负载   {#run-without-root}

当你在 Kubernetes 中部署一个工作负载时，可以使用 Pod 规约来限制该工作负载以非 root 用户在节点上运行。
你可以使用 Pod 的 `securityContext` 为 Pod 中的进程定义特定的 Linux 用户和组，
并明确限制容器不可以 root 用户运行。在 Pod 清单中设置的这些值优先于容器镜像中的类似值，
这对于运行非自有的镜像特别有用。

{{< caution >}}
<!--
Ensure that the user or group that you assign to the workload has the permissions
required for the application to function correctly. Changing the user or group
to one that doesn't have the correct permissions could lead to file access
issues or failed operations.
-->
确保你分配给工作负载的用户或组具有应用正常运行所需的权限。
将用户或组更改为没有适当权限的用户或组可能会导致文件访问问题或操作失败。
{{< /caution >}}

<!--
Configuring the kernel security features on this page provides fine-grained
control over the actions that processes in your cluster can take, but managing
these configurations can be challenging at scale. Running containers as
non-root, or in user namespaces if you need root privileges, helps to reduce the
chance that you'll need to enforce your configured kernel security capabilities.
-->
配置本页所述的内核安全特性可以对集群中进程能够执行的操作进行细粒度的控制，但大规模管理这些配置可能会有挑战。
以非 root 用户运行容器，或在需要 root 特权时在 user 命名空间中运行容器，有助于减少你因必须配置的内核安全权能的要求。

<!--
## Security features in the Linux kernel {#linux-security-features}

Kubernetes lets you configure and use Linux kernel features to improve isolation
and harden your containerized workloads. Common features include the following:
-->
## Linux 内核中的安全特性   {#linux-security-features}

Kubernetes 允许你配置和使用 Linux 内核特性来提高容器化的工作负载的隔离性，完成安全加固。
常见的特性包括以下几种：

<!--
* **Secure computing mode (seccomp)**: Filter which system calls a process can
  make
* **AppArmor**: Restrict the access privileges of individual programs
* **Security Enhanced Linux (SELinux)**: Assign security labels to objects for
  more manageable security policy enforcement
-->
* **安全计算模式 (seccomp)**：过滤某个进程可以执行哪些系统调用
* **AppArmor**：限制单个程序的访问特权
* **安全增强 Linux (SELinux)**：为对象赋予安全标签，以便更好地管理安全策略的实施

<!--
To configure settings for one of these features, the operating system that you
choose for your nodes must enable the feature in the kernel. For example,
Ubuntu 7.10 and later enable AppArmor by default. To learn whether your OS
enables a specific feature, consult the OS documentation.
-->
要配置其中一个特性的设置，你为节点所选择的操作系统必须在内核中启用对应的特性。
例如，Ubuntu 7.10 及更高版本默认启用 AppArmor。
要了解你的操作系统是否启用了特定特性，请查阅对应的操作系统文档。

<!--
You use the `securityContext` field in your Pod specification to define the
constraints that apply to those processes. The `securityContext` field also
supports other security settings, such as specific Linux capabilities or file
access permissions using UIDs and GIDs. To learn more, refer to
[Configure a SecurityContext for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).
-->
你可以使用 Pod 规约中的 `securityContext` 字段来定义适用于 Pod 中进程的约束。
`securityContext` 字段还支持其他安全设置，例如使用特定 Linux 权能或基于 UID 和 GID 的文件访问权限。
要了解更多信息，请参阅[为 Pod 或容器配置 SecurityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)。

### seccomp

<!--
Some of your workloads might need privileges to perform specific actions as the
root user on your node's host machine. Linux uses *capabilities* to divide the
available privileges into categories, so that processes can get the privileges
required to perform specific actions without being granted all privileges. Each
capability has a set of system calls (syscalls) that a process can make. seccomp
lets you restrict these individual syscalls.
It can be used to sandbox the privileges of a process, restricting the calls it
is able to make from userspace into the kernel.
-->
你的某些工作负载可能需要在你的节点的主机上以 root 用户执行特定操作的权限。
Linux 使用**权能（Capability）** 将可用的特权划分为不同类别，这样进程就能够获取执行特定操作所需的特权，
而无需为其授予所有特权。每个权能都对应进程可以执行的一组系统调用（syscalls）。
seccomp 允许你限制这些单独的系统调用。seccomp 可用于沙盒化进程的权限，限制其可以从用户空间向内核发出的调用。

<!--
In Kubernetes, you use a *container runtime* on each node to run your
containers. Example runtimes include CRI-O, Docker, or containerd. Each runtime
allows only a subset of Linux capabilities by default. You can further limit the
allowed syscalls individually by using a seccomp profile. Container runtimes
usually include a default seccomp profile.
Kubernetes lets you automatically
apply seccomp profiles loaded onto a node to your Pods and containers.
-->
在 Kubernetes 中，你在每个节点上使用**容器运行时**来运行你的容器。
运行时的例子包括 CRI-O、Docker 或 containerd。每个运行时默认仅允许一部分 Linux 权能。
你可以使用 seccomp 配置文件进一步限制所允许的系统调用。容器运行时通常包含一个默认的 seccomp 配置文件。
Kubernetes 允许你自动将加载到某个节点上的那些 seccomp 配置文件应用到你的 Pod 和容器。

{{<note>}}
<!--
Kubernetes also has the `allowPrivilegeEscalation` setting for Pods and
containers. When set to `false`, this prevents processes from gaining new
capabilities and restricts unprivileged users from changing the applied seccomp
profile to a more permissive profile.
-->
Kubernetes 还可以为 Pod 和容器设置 `allowPrivilegeEscalation`。当此字段设置为 `false` 时，
将阻止进程获取新权能，并限制非特权用户将已应用的 seccomp 配置文件更改为某个更宽松的配置文件。
{{</note>}}

<!--
To learn how to implement seccomp in Kubernetes, refer to
[Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/).

To learn more about seccomp, see
[Seccomp BPF](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html)
in the Linux kernel documentation.
-->
要了解如何在 Kubernetes 中实现 seccomp，
请参阅[使用 seccomp 限制容器的系统调用](/zh-cn/docs/tutorials/security/seccomp/)。

要了解 seccomp 的更多细节，请参阅 Linux 内核文档中的
[Seccomp BPF](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html)。

<!--
#### Considerations for seccomp {#seccomp-considerations}

seccomp is a low-level security configuration that you should only configure
yourself if you require fine-grained control over Linux syscalls. Using
seccomp, especially at scale, has the following risks:
-->
#### seccomp 的注意事项   {#seccomp-considerations}

seccomp 是一种底层安全配置，只有在你需要对 Linux 系统调用进行细粒度控制时才应自行配置。
使用 seccomp，尤其是在大规模使用时，会有以下风险：

<!--
* Configurations might break during application updates
* Attackers can still use allowed syscalls to exploit vulnerabilities
* Profile management for individual applications becomes challenging at scale
-->
* 在应用更新期间这些配置可能被破坏
* 攻击者仍然可以使用被允许的系统调用来利用漏洞
* 逐个应用地管理配置文件在规模较大时变得具有挑战性

<!--
**Recommendation**: Use the default seccomp profile that's bundled with your
container runtime. If you need a more isolated environment, consider using a
sandbox, such as gVisor. Sandboxes solve the preceding risks with custom
seccomp profiles, but require more compute resources on your nodes and might
have compatibility issues with GPUs and other specialized hardware.
-->
**建议**：使用与你的容器运行时捆绑的默认 seccomp 配置文件。
如果你需要一个隔离性更好的环境，请考虑使用沙箱，例如 gVisor。
沙箱通过自定义 seccomp 配置文件解决了上述风险，但需要占用节点上的更多计算资源，
并且可能与 GPU 和其他专用硬件存在兼容性问题。

<!--
### AppArmor and SELinux: policy-based mandatory access control {#policy-based-mac}

You can use Linux policy-based mandatory access control (MAC) mechanisms, such
as AppArmor and SELinux, to harden your Kubernetes workloads.
-->
### AppArmor 和 SELinux：基于策略的强制访问控制   {#policy-based-mac}

你可以使用 Linux 上基于策略的强制访问控制（MAC）机制（例如 AppArmor 和 SELinux）来加固你的 Kubernetes 工作负载。

#### AppArmor

<!-- Original text from https://kubernetes.io/docs/tutorials/security/apparmor/ -->

<!--
[AppArmor](https://apparmor.net/) is a Linux kernel security module that
supplements the standard Linux user and group based permissions to confine
programs to a limited set of resources. AppArmor can be configured for any
application to reduce its potential attack surface and provide greater in-depth
defense. It is configured through profiles tuned to allow the access needed by a
specific program or container, such as Linux capabilities, network access, and
file permissions. Each profile can be run in either enforcing mode, which blocks
access to disallowed resources, or complain mode, which only reports violations.
-->
[AppArmor](https://apparmor.net/) 是一个 Linux 内核安全模块，它在标准的基于 Linux 用户和组的权限基础上，
进一步将程序限制在有限的资源集内。AppArmor 可以针对任何应用配置，以减小其潜在的攻击面并提供更深入的防御。
AppArmor 通过调优的配置文件进行配置，以允许特定程序或容器所需的访问，例如 Linux 权能、网络访问和文件权限。
每个配置文件要么在强制（Enforcing）模式下运行，即阻止访问不被允许的资源，
要么在投诉（Complaining）模式下运行，只报告违规行为。

<!--
AppArmor can help you to run a more secure deployment by restricting what
containers are allowed to do, and/or provide better auditing through system
logs. The container runtime that you use might ship with a default AppArmor
profile, or you can use a custom profile.

To learn how to use AppArmor in Kubernetes, refer to
[Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/).
-->
AppArmor 可以通过限制容器被允许执行哪些操作来帮助你运行更为安全的部署，还可以通过系统日志提供更好的审计。
你使用的容器运行时可能附带默认的 AppArmor 配置文件，或者你也可以使用自定义的配置文件。

要了解如何在 Kubernetes 中使用 AppArmor，
请参阅[使用 AppArmor 限制容器对资源的访问](/zh-cn/docs/tutorials/security/apparmor/)。

#### SELinux

<!--
SELinux is a Linux kernel security module that lets you restrict the access
that a specific *subject*, such as a process, has to the files on your system.
You define security policies that apply to subjects that have specific SELinux
labels. When a process that has an SELinux label attempts to access a file, the
SELinux server checks whether that process' security policy allows the access
and makes an authorization decision.
-->
SELinux 是一个 Linux 内核安全模块，允许你限制特定**主体**（例如进程）对系统上文件的访问。
你可以定义要应用到具有特定 SELinux 标签的主体的安全策略。
当具有特定 SELinux 标签的进程试图访问某个文件时，SELinux 服务器会检查该进程的安全策略是否允许访问并做出鉴权决策。

<!--
In Kubernetes, you can set an SELinux label in the `securityContext` field of
your manifest. The specified labels are assigned to those processes. If you
have configured security policies that affect those labels, the host OS kernel
enforces these policies.

To learn how to use SELinux in Kubernetes, refer to
[Assign SELinux labels to a container](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container).
-->
在 Kubernetes 中，你可以在清单的 `securityContext` 字段中设置 SELinux 标签。
所指定的标签被赋予给那些进程。如果你配置了影响这些标签的安全策略，则主机操作系统内核将强制执行这些策略。

要了解如何在 Kubernetes 中使用 SELinux，
请参阅[为容器分配 SELinux 标签](/zh-cn/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)。

<!--
#### Differences between AppArmor and SELinux {#apparmor-selinux-diff}

The operating system on your Linux nodes usually includes one of either
AppArmor or SELinux. Both mechanisms provide similar types of protection, but
have differences such as the following:
-->
#### AppArmor 和 SELinux 之间的区别   {#apparmor-selinux-diff}

Linux 节点上的操作系统通常包含 AppArmor 或 SELinux 其中之一。
这两种机制都能提供类似的保护，但有以下区别：

<!--
* **Configuration**: AppArmor uses profiles to define access to resources.
  SELinux uses policies that apply to specific labels.
* **Policy application**: In AppArmor, you define resources using file paths.
  SELinux uses the index node (inode) of a resource to identify the resource.
-->
* **配置**：AppArmor 使用配置文件定义对资源的访问。SELinux 使用适用于特定标签的策略。
* **策略应用**：在 AppArmor 中，你使用文件路径来定义资源。SELinux 使用资源的索引节点 (inode) 来标识资源。

<!--
### Summary of features {#summary}

The following table describes the use cases and scope of each security control.
You can use all of these controls together to build a more hardened system.
-->
### 特性摘要   {#summary}

下表描述了每种安全控制机制的使用场景和范围。你可以同时使用所有这些控制机制来构建更稳固的系统。

<table>
  <!--
  <caption>Summary of Linux kernel security features</caption>
  -->
  <caption>Linux 内核安全特性摘要</caption>
  <thead>
    <tr>
      <th><!--Security feature-->安全特性</th>
      <th><!--Description-->描述</th>
      <th><!--How to use-->使用方式</th>
      <th><!--Example-->示例</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>seccomp</td>
      <!--
      <td>Restrict individual kernel calls in the userspace. Reduces the
      likelihood that a vulnerability that uses a restricted syscall would
      compromise the system.</td>
      <td>Specify a loaded seccomp profile in the Pod or container specification
      to apply its constraints to the processes in the Pod.</td>
      <td>Reject the <code>unshare</code> syscall, which was used in
      <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-0185">CVE-2022-0185</a>.</td>
      -->
      <td>限制用户空间中的各个内核调用。如果某漏洞使用了某受限的系统调用，这一机制可降低系统被破坏的可能性。</td>
      <td>在 Pod 或容器规约中配置某已加载的 seccomp 配置文件，以将其约束应用于 Pod 中的进程。</td>
      <td>拒绝曾在
      <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-0185">CVE-2022-0185</a>
      中使用的 <code>unshare</code> 系统调用。</td>
    </tr>
    <tr>
      <td>AppArmor</td>
      <!--
      <td>Restrict program access to specific resources. Reduces the attack
      surface of the program. Improves audit logging.</td>
      <td>Specify a loaded AppArmor profile in the container specification.</td>
      <td>Restrict a read-only program from writing to any file path
      in the system.</td>
      -->
      <td>限制程序对特定资源的访问。减少程序的攻击面。改进审计日志。</td>
      <td>在容器规约中设定某已加载的 AppArmor 配置文件。</td>
      <td>限制只读程序，不允许其写入系统中的任何文件路径。</td>
    </tr>
    <tr>
      <td>SELinux</td>
      <!--
      <td>Restrict access to resources such as files, applications, ports, and
      processes using labels and security policies.</td>
      <td>Specify access restrictions for specific labels. Tag processes with
      those labels to enforce the access restrictions related to the label.</td>
      <td>Restrict a container from accessing files outside its own filesystem.</td>
      -->
      <td>使用标签和安全策略限制对文件、应用、端口和进程等资源的访问。</td>
      <td>为特定标签设置访问限制。使用这些标签来标记进程，以强制执行与标签相关的访问限制。</td>
      <td>限制容器访问其自身文件系统之外的文件。</td>
    </tr>
  </tbody>
</table>

{{< note >}}
<!--
Mechanisms like AppArmor and SELinux can provide protection that extends beyond
the container. For example, you can use SELinux to help mitigate
[CVE-2019-5736](https://access.redhat.com/security/cve/cve-2019-5736).
-->
像 AppArmor 和 SELinux 这样的机制可以提供超出容器范围的保护。例如，你可以使用 SELinux 帮助缓解
[CVE-2019-5736](https://access.redhat.com/security/cve/cve-2019-5736)。
{{< /note >}}

<!--
### Considerations for managing custom configurations {#considerations-custom-configurations}

seccomp, AppArmor, and SELinux usually have a default configuration that offers
basic protections.  You can also create custom profiles and policies that meet
the requirements of your workloads. Managing and distributing these custom
configurations at scale might be challenging, especially if you use all three
features together. To help you to manage these configurations at scale, use a
tool like the
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator).
-->
### 管理自定义配置的注意事项   {#considerations-custom-configurations}

seccomp、AppArmor 和 SELinux 通常有一个默认配置来提供基本的保护。
你还可以创建自定义配置文件和策略来满足你的工作负载的要求。
大规模场景下管理和分发这些自定义配置可能具有挑战性，特别是当你同时使用这三种特性时。
为了帮助你在大规模场景下管理这些配置，可以使用类似
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)
的工具。

<!--
## Kernel-level security features and privileged containers {#kernel-security-features-privileged-containers}

Kubernetes lets you specify that some trusted containers can run in
*privileged* mode. Any container in a Pod can run in privileged mode to use
operating system administrative capabilities that would otherwise be
inaccessible. This is available for both Windows and Linux.
-->
## 内核级安全特性和特权容器   {#kernel-security-features-privileged-containers}

Kubernetes 允许你指定一些被信任的容器能以**特权**模式运行。
Pod 中的所有容器都能够以特权模式运行，以使用操作系统的管理性质权能，这些权能在其他情况下是不可访问的。
此特性在 Windows 和 Linux 上都可用。

<!--
Privileged containers explicitly override some of the Linux kernel constraints
that you might use in your workloads, as follows:

* **seccomp**: Privileged containers run as the `Unconfined` seccomp profile,
  overriding any seccomp profile that you specified in your manifest.
* **AppArmor**: Privileged containers ignore any applied AppArmor profiles.
* **SELinux**: Privileged containers run as the `unconfined_t` domain.
-->
特权容器显式覆盖你可能在工作负载中使用的以下一些 Linux 内核约束：

* **seccomp**：特权容器以 `Unconfined` 为 seccomp 配置文件运行，覆盖你在清单中指定的所有 seccomp 配置。
* **AppArmor**：特权容器忽略任何已应用的 AppArmor 配置文件。
* **SELinux**：特权容器以 `unconfined_t` 域运行。

<!--
### Privileged containers {#privileged-containers}
-->
### 特权容器    {#privileged-containers}

<!-- Content from https://kubernetes.io/docs/concepts/workloads/pods/#privileged-mode-for-containers  -->

<!--
Any container in a Pod can enable *Privileged mode* if you set the
`privileged: true` field in the
[`securityContext`](/docs/tasks/configure-pod-container/security-context/)
field for the container. Privileged containers override or undo many other hardening settings such as the applied seccomp profile, AppArmor profile, or
SELinux constraints. Privileged containers are given all Linux capabilities,
including capabilities that they don't require. For example, a root user in a
privileged container might be able to use the `CAP_SYS_ADMIN` and
`CAP_NET_ADMIN` capabilities on the node, bypassing the runtime seccomp
configuration and other restrictions.
-->
如果你在容器的 [`securityContext`](/zh-cn/docs/tasks/configure-pod-container/security-context/)
字段中设置 `privileged: true` 字段，则 Pod 中的所有容器都可以启用**特权模式**。
特权容器会覆盖或使许多其他加固选项无效，例如已应用的 seccomp 配置文件、AppArmor 配置文件或 SELinux 约束。
特权容器被赋予所有的 Linux 权能，包括它们所不需要的权能。例如，特权容器中的 root 用户可能能够绕过运行时的
seccomp 配置和其他限制，在节点上使用 `CAP_SYS_ADMIN` 和 `CAP_NET_ADMIN` 权能。

<!--
In most cases, you should avoid using privileged containers, and instead grant
the specific capabilities required by your container using the `capabilities`
field in the `securityContext` field. Only use privileged mode if you have a
capability that you can't grant with the securityContext. This is useful for
containers that want to use operating system administrative capabilities such
as manipulating the network stack or accessing hardware devices.
-->
在大多数情况下，你应避免使用特权容器，而是通过 `securityContext` 字段中的 `capabilities`
字段来授予容器所需的特定权能。只有在你无法通过 securityContext 授予某个权能时，才使用特权模式。
这对希望使用操作系统管理权能（如操纵网络栈或访问硬件设备）的容器来说特别有用。

<!--
In Kubernetes version 1.26 and later, you can also run Windows containers in a
similarly privileged mode by setting the `windowsOptions.hostProcess` flag on
the security context of the Pod spec. For details and instructions, see
[Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
-->
在 Kubernetes 1.26 及更高版本中，你还可以通过在 Pod 规约的安全上下文中设置 `windowsOptions.hostProcess` 标志，
以类似的特权模式运行 Windows 容器。有关细节和说明，
请参阅[创建 Windows HostProcess Pod](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)。

<!--
## Recommendations and best practices {#recommendations-best-practices}

* Before configuring kernel-level security capabilities, you should consider
  implementing network-level isolation. For more information, read the
  [Security Checklist](/docs/concepts/security/security-checklist/#network-security).
* Unless necessary, run Linux workloads as non-root by setting specific user and
  group IDs in your Pod manifest and by specifying `runAsNonRoot: true`.
-->
## 建议和最佳实践    {#recommendations-best-practices}

* 在配置内核级安全权能之前，你应该考虑实施网络级别的隔离。
  有关细节参阅[安全检查清单](/zh-cn/docs/concepts/security/security-checklist/#network-security)。
* 除非必要，否则通过在 Pod 清单中设置特定的用户和组 ID 并指定 `runAsNonRoot: true`，以非 root 身份运行 Linux 工作负载。

<!--
Additionally, you can run workloads in user namespaces by setting
`hostUsers: false` in your Pod manifest. This lets you run containers as root
users in the user namespace, but as non-root users in the host namespace on the
node. This is still in early stages of development and might not have the level
of support that you need. For instructions, refer to
[Use a User Namespace With a Pod](/docs/tasks/configure-pod-container/user-namespaces/).
-->
此外，你可以通过在 Pod 清单中设置 `hostUsers: false` 来在 user 命名空间中运行工作负载。
这使你可以以 user 命名空间中的 root 用户运行容器，但在节点上的主机命名空间中是非 root 用户。
此特性仍处于早期开发阶段，可能不是你所需要的支持级别。
有关说明，请参阅[为 Pod 配置 user 命名空间](/zh-cn/docs/tasks/configure-pod-container/user-namespaces/)。

## {{% heading "whatsnext" %}}

<!--
* [Learn how to use AppArmor](/docs/tutorials/security/apparmor/)
* [Learn how to use seccomp](/docs/tutorials/security/seccomp/)
* [Learn how to use SELinux](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)
-->
* [学习如何使用 AppArmor](/zh-cn/docs/tutorials/security/apparmor/)
* [学习如何使用 seccomp](/zh-cn/docs/tutorials/security/seccomp/)
* [学习如何使用 SELinux](/zh-cn/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)
