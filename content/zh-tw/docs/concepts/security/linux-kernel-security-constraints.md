---
title: 針對 Pod 和容器的 Linux 內核安全約束
description: >
  概述你可用於增強 Pod 和容器安全性的 Linux 內核安全模塊和約束
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
本頁描述了一些 Linux 內核中內置的、你可以在 Kubernetes 工作負載中使用的安全特性。
要了解如何將這些特性應用到你的 Pod 和容器，
請參閱[爲 Pod 或容器配置 SecurityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)。
你須熟悉 Linux 和 Kubernetes 工作負載的基礎知識。

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
## 運行不具有 root 特權的工作負載   {#run-without-root}

當你在 Kubernetes 中部署一個工作負載時，可以使用 Pod 規約來限制該工作負載以非 root 用戶在節點上運行。
你可以使用 Pod 的 `securityContext` 爲 Pod 中的進程定義特定的 Linux 用戶和組，
並明確限制容器不可以 root 用戶運行。在 Pod 清單中設置的這些值優先於容器鏡像中的類似值，
這對於運行非自有的鏡像特別有用。

{{< caution >}}
<!--
Ensure that the user or group that you assign to the workload has the permissions
required for the application to function correctly. Changing the user or group
to one that doesn't have the correct permissions could lead to file access
issues or failed operations.
-->
確保你分配給工作負載的用戶或組具有應用正常運行所需的權限。
將用戶或組更改爲沒有適當權限的用戶或組可能會導致文件訪問問題或操作失敗。
{{< /caution >}}

<!--
Configuring the kernel security features on this page provides fine-grained
control over the actions that processes in your cluster can take, but managing
these configurations can be challenging at scale. Running containers as
non-root, or in user namespaces if you need root privileges, helps to reduce the
chance that you'll need to enforce your configured kernel security capabilities.
-->
配置本頁所述的內核安全特性可以對集羣中進程能夠執行的操作進行細粒度的控制，但大規模管理這些配置可能會有挑戰。
以非 root 用戶運行容器，或在需要 root 特權時在 user 命名空間中運行容器，有助於減少你因必須配置的內核安全權能的要求。

<!--
## Security features in the Linux kernel {#linux-security-features}

Kubernetes lets you configure and use Linux kernel features to improve isolation
and harden your containerized workloads. Common features include the following:
-->
## Linux 內核中的安全特性   {#linux-security-features}

Kubernetes 允許你配置和使用 Linux 內核特性來提高容器化的工作負載的隔離性，完成安全加固。
常見的特性包括以下幾種：

<!--
* **Secure computing mode (seccomp)**: Filter which system calls a process can
  make
* **AppArmor**: Restrict the access privileges of individual programs
* **Security Enhanced Linux (SELinux)**: Assign security labels to objects for
  more manageable security policy enforcement
-->
* **安全計算模式 (seccomp)**：過濾某個進程可以執行哪些系統調用
* **AppArmor**：限制單個程序的訪問特權
* **安全增強 Linux (SELinux)**：爲對象賦予安全標籤，以便更好地管理安全策略的實施

<!--
To configure settings for one of these features, the operating system that you
choose for your nodes must enable the feature in the kernel. For example,
Ubuntu 7.10 and later enable AppArmor by default. To learn whether your OS
enables a specific feature, consult the OS documentation.
-->
要配置其中一個特性的設置，你爲節點所選擇的操作系統必須在內核中啓用對應的特性。
例如，Ubuntu 7.10 及更高版本默認啓用 AppArmor。
要了解你的操作系統是否啓用了特定特性，請查閱對應的操作系統文檔。

<!--
You use the `securityContext` field in your Pod specification to define the
constraints that apply to those processes. The `securityContext` field also
supports other security settings, such as specific Linux capabilities or file
access permissions using UIDs and GIDs. To learn more, refer to
[Configure a SecurityContext for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).
-->
你可以使用 Pod 規約中的 `securityContext` 字段來定義適用於 Pod 中進程的約束。
`securityContext` 字段還支持其他安全設置，例如使用特定 Linux 權能或基於 UID 和 GID 的文件訪問權限。
要了解更多信息，請參閱[爲 Pod 或容器配置 SecurityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)。

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
你的某些工作負載可能需要在你的節點的主機上以 root 用戶執行特定操作的權限。
Linux 使用**權能（Capability）** 將可用的特權劃分爲不同類別，這樣進程就能夠獲取執行特定操作所需的特權，
而無需爲其授予所有特權。每個權能都對應進程可以執行的一組系統調用（syscalls）。
seccomp 允許你限制這些單獨的系統調用。seccomp 可用於沙盒化進程的權限，限制其可以從用戶空間向內核發出的調用。

<!--
In Kubernetes, you use a *container runtime* on each node to run your
containers. Example runtimes include CRI-O, Docker, or containerd. Each runtime
allows only a subset of Linux capabilities by default. You can further limit the
allowed syscalls individually by using a seccomp profile. Container runtimes
usually include a default seccomp profile.
Kubernetes lets you automatically
apply seccomp profiles loaded onto a node to your Pods and containers.
-->
在 Kubernetes 中，你在每個節點上使用**容器運行時**來運行你的容器。
運行時的例子包括 CRI-O、Docker 或 containerd。每個運行時默認僅允許一部分 Linux 權能。
你可以使用 seccomp 配置文件進一步限制所允許的系統調用。容器運行時通常包含一個默認的 seccomp 配置文件。
Kubernetes 允許你自動將加載到某個節點上的那些 seccomp 配置文件應用到你的 Pod 和容器。

{{<note>}}
<!--
Kubernetes also has the `allowPrivilegeEscalation` setting for Pods and
containers. When set to `false`, this prevents processes from gaining new
capabilities and restricts unprivileged users from changing the applied seccomp
profile to a more permissive profile.
-->
Kubernetes 還可以爲 Pod 和容器設置 `allowPrivilegeEscalation`。當此字段設置爲 `false` 時，
將阻止進程獲取新權能，並限制非特權用戶將已應用的 seccomp 配置文件更改爲某個更寬鬆的配置文件。
{{</note>}}

<!--
To learn how to implement seccomp in Kubernetes, refer to
[Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/)
or the [Seccomp node reference](/docs/reference/node/seccomp/)

To learn more about seccomp, see
[Seccomp BPF](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html)
in the Linux kernel documentation.
-->
要了解如何在 Kubernetes 中實現 seccomp，
請參閱[使用 seccomp 限制容器的系統調用](/zh-cn/docs/tutorials/security/seccomp/)或
[Seccomp 節點參考](/zh-cn/docs/reference/node/seccomp/)。

要了解 seccomp 的更多細節，請參閱 Linux 內核文檔中的
[Seccomp BPF](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html)。

<!--
#### Considerations for seccomp {#seccomp-considerations}

seccomp is a low-level security configuration that you should only configure
yourself if you require fine-grained control over Linux syscalls. Using
seccomp, especially at scale, has the following risks:
-->
#### seccomp 的注意事項   {#seccomp-considerations}

seccomp 是一種底層安全配置，只有在你需要對 Linux 系統調用進行細粒度控制時才應自行配置。
使用 seccomp，尤其是在大規模使用時，會有以下風險：

<!--
* Configurations might break during application updates
* Attackers can still use allowed syscalls to exploit vulnerabilities
* Profile management for individual applications becomes challenging at scale
-->
* 在應用更新期間這些配置可能被破壞
* 攻擊者仍然可以使用被允許的系統調用來利用漏洞
* 逐個應用地管理配置文件在規模較大時變得具有挑戰性

<!--
**Recommendation**: Use the default seccomp profile that's bundled with your
container runtime. If you need a more isolated environment, consider using a
sandbox, such as gVisor. Sandboxes solve the preceding risks with custom
seccomp profiles, but require more compute resources on your nodes and might
have compatibility issues with GPUs and other specialized hardware.
-->
**建議**：使用與你的容器運行時捆綁的默認 seccomp 配置文件。
如果你需要一個隔離性更好的環境，請考慮使用沙箱，例如 gVisor。
沙箱通過自定義 seccomp 配置文件解決了上述風險，但需要佔用節點上的更多計算資源，
並且可能與 GPU 和其他專用硬件存在兼容性問題。

<!--
### AppArmor and SELinux: policy-based mandatory access control {#policy-based-mac}

You can use Linux policy-based mandatory access control (MAC) mechanisms, such
as AppArmor and SELinux, to harden your Kubernetes workloads.
-->
### AppArmor 和 SELinux：基於策略的強制訪問控制   {#policy-based-mac}

你可以使用 Linux 上基於策略的強制訪問控制（MAC）機制（例如 AppArmor 和 SELinux）來加固你的 Kubernetes 工作負載。

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
[AppArmor](https://apparmor.net/) 是一個 Linux 內核安全模塊，它在標準的基於 Linux 用戶和組的權限基礎上，
進一步將程序限制在有限的資源集內。AppArmor 可以針對任何應用配置，以減小其潛在的攻擊面並提供更深入的防禦。
AppArmor 通過調優的配置文件進行配置，以允許特定程序或容器所需的訪問，例如 Linux 權能、網絡訪問和文件權限。
每個配置文件要麼在強制（Enforcing）模式下運行，即阻止訪問不被允許的資源，
要麼在投訴（Complaining）模式下運行，只報告違規行爲。

<!--
AppArmor can help you to run a more secure deployment by restricting what
containers are allowed to do, and/or provide better auditing through system
logs. The container runtime that you use might ship with a default AppArmor
profile, or you can use a custom profile.

To learn how to use AppArmor in Kubernetes, refer to
[Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/).
-->
AppArmor 可以通過限制容器被允許執行哪些操作來幫助你運行更爲安全的部署，還可以通過系統日誌提供更好的審計。
你使用的容器運行時可能附帶默認的 AppArmor 配置文件，或者你也可以使用自定義的配置文件。

要了解如何在 Kubernetes 中使用 AppArmor，
請參閱[使用 AppArmor 限制容器對資源的訪問](/zh-cn/docs/tutorials/security/apparmor/)。

#### SELinux

<!--
SELinux is a Linux kernel security module that lets you restrict the access
that a specific *subject*, such as a process, has to the files on your system.
You define security policies that apply to subjects that have specific SELinux
labels. When a process that has an SELinux label attempts to access a file, the
SELinux server checks whether that process' security policy allows the access
and makes an authorization decision.
-->
SELinux 是一個 Linux 內核安全模塊，允許你限制特定**主體**（例如進程）對系統上文件的訪問。
你可以定義要應用到具有特定 SELinux 標籤的主體的安全策略。
當具有特定 SELinux 標籤的進程試圖訪問某個文件時，SELinux 服務器會檢查該進程的安全策略是否允許訪問並做出鑑權決策。

<!--
In Kubernetes, you can set an SELinux label in the `securityContext` field of
your manifest. The specified labels are assigned to those processes. If you
have configured security policies that affect those labels, the host OS kernel
enforces these policies.

To learn how to use SELinux in Kubernetes, refer to
[Assign SELinux labels to a container](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container).
-->
在 Kubernetes 中，你可以在清單的 `securityContext` 字段中設置 SELinux 標籤。
所指定的標籤被賦予給那些進程。如果你配置了影響這些標籤的安全策略，則主機操作系統內核將強制執行這些策略。

要了解如何在 Kubernetes 中使用 SELinux，
請參閱[爲容器分配 SELinux 標籤](/zh-cn/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)。

<!--
#### Differences between AppArmor and SELinux {#apparmor-selinux-diff}

The operating system on your Linux nodes usually includes one of either
AppArmor or SELinux. Both mechanisms provide similar types of protection, but
have differences such as the following:
-->
#### AppArmor 和 SELinux 之間的區別   {#apparmor-selinux-diff}

Linux 節點上的操作系統通常包含 AppArmor 或 SELinux 其中之一。
這兩種機制都能提供類似的保護，但有以下區別：

<!--
* **Configuration**: AppArmor uses profiles to define access to resources.
  SELinux uses policies that apply to specific labels.
* **Policy application**: In AppArmor, you define resources using file paths.
  SELinux uses the index node (inode) of a resource to identify the resource.
-->
* **配置**：AppArmor 使用配置文件定義對資源的訪問。SELinux 使用適用於特定標籤的策略。
* **策略應用**：在 AppArmor 中，你使用文件路徑來定義資源。SELinux 使用資源的索引節點 (inode) 來標識資源。

<!--
### Summary of features {#summary}

The following table describes the use cases and scope of each security control.
You can use all of these controls together to build a more hardened system.
-->
### 特性摘要   {#summary}

下表描述了每種安全控制機制的使用場景和範圍。你可以同時使用所有這些控制機制來構建更穩固的系統。

<table>
  <!--
  <caption>Summary of Linux kernel security features</caption>
  -->
  <caption>Linux 內核安全特性摘要</caption>
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
      <td>限制用戶空間中的各個內核調用。如果某漏洞使用了某受限的系統調用，這一機制可降低系統被破壞的可能性。</td>
      <td>在 Pod 或容器規約中配置某已加載的 seccomp 配置文件，以將其約束應用於 Pod 中的進程。</td>
      <td>拒絕曾在
      <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-0185">CVE-2022-0185</a>
      中使用的 <code>unshare</code> 系統調用。</td>
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
      <td>限制程序對特定資源的訪問。減少程序的攻擊面。改進審計日誌。</td>
      <td>在容器規約中設定某已加載的 AppArmor 配置文件。</td>
      <td>限制只讀程序，不允許其寫入系統中的任何文件路徑。</td>
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
      <td>使用標籤和安全策略限制對文件、應用、端口和進程等資源的訪問。</td>
      <td>爲特定標籤設置訪問限制。使用這些標籤來標記進程，以強制執行與標籤相關的訪問限制。</td>
      <td>限制容器訪問其自身文件系統之外的文件。</td>
    </tr>
  </tbody>
</table>

{{< note >}}
<!--
Mechanisms like AppArmor and SELinux can provide protection that extends beyond
the container. For example, you can use SELinux to help mitigate
[CVE-2019-5736](https://access.redhat.com/security/cve/cve-2019-5736).
-->
像 AppArmor 和 SELinux 這樣的機制可以提供超出容器範圍的保護。例如，你可以使用 SELinux 幫助緩解
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
### 管理自定義配置的注意事項   {#considerations-custom-configurations}

seccomp、AppArmor 和 SELinux 通常有一個默認配置來提供基本的保護。
你還可以創建自定義配置文件和策略來滿足你的工作負載的要求。
大規模場景下管理和分發這些自定義配置可能具有挑戰性，特別是當你同時使用這三種特性時。
爲了幫助你在大規模場景下管理這些配置，可以使用類似
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)
的工具。

<!--
## Kernel-level security features and privileged containers {#kernel-security-features-privileged-containers}

Kubernetes lets you specify that some trusted containers can run in
*privileged* mode. Any container in a Pod can run in privileged mode to use
operating system administrative capabilities that would otherwise be
inaccessible. This is available for both Windows and Linux.
-->
## 內核級安全特性和特權容器   {#kernel-security-features-privileged-containers}

Kubernetes 允許你指定一些被信任的容器能以**特權**模式運行。
Pod 中的所有容器都能夠以特權模式運行，以使用操作系統的管理性質權能，這些權能在其他情況下是不可訪問的。
此特性在 Windows 和 Linux 上都可用。

<!--
Privileged containers explicitly override some of the Linux kernel constraints
that you might use in your workloads, as follows:

* **seccomp**: Privileged containers run as the `Unconfined` seccomp profile,
  overriding any seccomp profile that you specified in your manifest.
* **AppArmor**: Privileged containers ignore any applied AppArmor profiles.
* **SELinux**: Privileged containers run as the `unconfined_t` domain.
-->
特權容器顯式覆蓋你可能在工作負載中使用的以下一些 Linux 內核約束：

* **seccomp**：特權容器以 `Unconfined` 爲 seccomp 配置文件運行，覆蓋你在清單中指定的所有 seccomp 配置。
* **AppArmor**：特權容器忽略任何已應用的 AppArmor 配置文件。
* **SELinux**：特權容器以 `unconfined_t` 域運行。

<!--
### Privileged containers {#privileged-containers}
-->
### 特權容器    {#privileged-containers}

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
字段中設置 `privileged: true` 字段，則 Pod 中的所有容器都可以啓用**特權模式**。
特權容器會覆蓋或使許多其他加固選項無效，例如已應用的 seccomp 配置文件、AppArmor 配置文件或 SELinux 約束。
特權容器被賦予所有的 Linux 權能，包括它們所不需要的權能。例如，特權容器中的 root 用戶可能能夠繞過運行時的
seccomp 配置和其他限制，在節點上使用 `CAP_SYS_ADMIN` 和 `CAP_NET_ADMIN` 權能。

<!--
In most cases, you should avoid using privileged containers, and instead grant
the specific capabilities required by your container using the `capabilities`
field in the `securityContext` field. Only use privileged mode if you have a
capability that you can't grant with the securityContext. This is useful for
containers that want to use operating system administrative capabilities such
as manipulating the network stack or accessing hardware devices.
-->
在大多數情況下，你應避免使用特權容器，而是通過 `securityContext` 字段中的 `capabilities`
字段來授予容器所需的特定權能。只有在你無法通過 securityContext 授予某個權能時，才使用特權模式。
這對希望使用操作系統管理權能（如操縱網絡棧或訪問硬件設備）的容器來說特別有用。

<!--
In Kubernetes version 1.26 and later, you can also run Windows containers in a
similarly privileged mode by setting the `windowsOptions.hostProcess` flag on
the security context of the Pod spec. For details and instructions, see
[Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
-->
在 Kubernetes 1.26 及更高版本中，你還可以通過在 Pod 規約的安全上下文中設置 `windowsOptions.hostProcess` 標誌，
以類似的特權模式運行 Windows 容器。有關細節和說明，
請參閱[創建 Windows HostProcess Pod](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)。

<!--
## Recommendations and best practices {#recommendations-best-practices}

* Before configuring kernel-level security capabilities, you should consider
  implementing network-level isolation. For more information, read the
  [Security Checklist](/docs/concepts/security/security-checklist/#network-security).
* Unless necessary, run Linux workloads as non-root by setting specific user and
  group IDs in your Pod manifest and by specifying `runAsNonRoot: true`.
-->
## 建議和最佳實踐    {#recommendations-best-practices}

* 在配置內核級安全權能之前，你應該考慮實施網絡級別的隔離。
  有關細節參閱[安全檢查清單](/zh-cn/docs/concepts/security/security-checklist/#network-security)。
* 除非必要，否則通過在 Pod 清單中設置特定的用戶和組 ID 並指定 `runAsNonRoot: true`，以非 root 身份運行 Linux 工作負載。

<!--
Additionally, you can run workloads in user namespaces by setting
`hostUsers: false` in your Pod manifest. This lets you run containers as root
users in the user namespace, but as non-root users in the host namespace on the
node. This is still in early stages of development and might not have the level
of support that you need. For instructions, refer to
[Use a User Namespace With a Pod](/docs/tasks/configure-pod-container/user-namespaces/).
-->
此外，你可以通過在 Pod 清單中設置 `hostUsers: false` 來在 user 命名空間中運行工作負載。
這使你可以以 user 命名空間中的 root 用戶運行容器，但在節點上的主機命名空間中是非 root 用戶。
此特性仍處於早期開發階段，可能不是你所需要的支持級別。
有關說明，請參閱[爲 Pod 配置 user 命名空間](/zh-cn/docs/tasks/configure-pod-container/user-namespaces/)。

## {{% heading "whatsnext" %}}

<!--
* [Learn how to use AppArmor](/docs/tutorials/security/apparmor/)
* [Learn how to use seccomp](/docs/tutorials/security/seccomp/)
* [Learn how to use SELinux](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)
* [Seccomp Node Reference](/docs/reference/node/seccomp/)
-->
* [學習如何使用 AppArmor](/zh-cn/docs/tutorials/security/apparmor/)
* [學習如何使用 seccomp](/zh-cn/docs/tutorials/security/seccomp/)
* [學習如何使用 SELinux](/zh-cn/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)
* [Seccomp 節點參考](/zh-cn/docs/reference/node/seccomp/)
