---
title: Windows 節點的安全性
content_type: concept
weight: 40
---
<!--
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
  title:    Security For Windows Nodes
  content_type: concept
  weight: 75
-->

<!-- overview -->

<!--
This page describes security considerations and best practices specific to the Windows operating system.
-->
本篇介紹特定於 Windows 操作系統的安全注意事項和最佳實踐。

<!-- body -->

<!--
## Protection for Secret data on nodes
-->
## 保護節點上的 Secret 資料   {#protection-for-secret-data-on-nodes}

<!--
On Windows, data from Secrets are written out in clear text onto the node's local
storage (as compared to using tmpfs / in-memory filesystems on Linux). As a cluster
operator, you should take both of the following additional measures:
-->
在 Windows 上，來自 Secret 的資料以明文形式寫入節點的本地儲存
（與在 Linux 上使用 tmpfs / 內存中檔案系統不同）。
作爲叢集操作員，你應該採取以下兩項額外措施：

<!--
1. Use file ACLs to secure the Secrets' file location.
1. Apply volume-level encryption using
   [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server).
-->
1. 使用檔案 ACL 來保護 Secret 的檔案位置。
2. 使用 [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server)
   進行卷級加密。

<!--
## Container users
-->
## 容器使用者   {#container-users}

<!--
[RunAsUsername](/docs/tasks/configure-pod-container/configure-runasusername)
can be specified for Windows Pods or containers to execute the container
processes as specific user. This is roughly equivalent to
[RunAsUser](/docs/concepts/security/pod-security-policy/#users-and-groups).
-->
可以爲 Windows Pod 或容器指定 [RunAsUsername](/zh-cn/docs/tasks/configure-pod-container/configure-runasusername)
以作爲特定使用者執行容器進程。這大致相當於 [RunAsUser](/zh-cn/docs/concepts/security/pod-security-policy/#users-and-groups)。

<!--
Windows containers offer two default user accounts, ContainerUser and ContainerAdministrator.
The differences between these two user accounts are covered in
[When to use ContainerAdmin and ContainerUser user accounts](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts)
within Microsoft's _Secure Windows containers_ documentation.
-->
Windows 容器提供兩個預設使用者帳戶，ContainerUser 和 ContainerAdministrator。
在微軟的 **Windows 容器安全** 文檔
[何時使用 ContainerAdmin 和 ContainerUser 使用者帳戶](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts)
中介紹了這兩個使用者帳戶之間的區別。

<!--
Local users can be added to container images during the container build process.
-->
在容器構建過程中，可以將本地使用者添加到容器映像檔中。

{{< note >}}
<!--
* [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver) based images run as
  `ContainerUser` by default
* [Server Core](https://hub.docker.com/_/microsoft-windows-servercore) based images run as
  `ContainerAdministrator` by default
-->
* 基於 [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver) 的映像檔預設以 `ContainerUser` 運行
* 基於 [Server Core](https://hub.docker.com/_/microsoft-windows-servercore) 的映像檔預設以 `ContainerAdministrator` 運行
{{< /note >}}

<!--
Windows containers can also run as Active Directory identities by utilizing
[Group Managed Service Accounts](/docs/tasks/configure-pod-container/configure-gmsa/)
-->
Windows 容器還可以通過使用[組管理的服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-gmsa/)作爲
Active Directory 身份運行。

<!--
## Pod-level security isolation
-->
## Pod 級安全隔離   {#pod-level-security-isolation}

<!--
Linux-specific pod security context mechanisms (such as SELinux, AppArmor, Seccomp, or custom
POSIX capabilities) are not supported on Windows nodes.
-->
Windows 節點不支持特定於 Linux 的 Pod 安全上下文機制（例如 SELinux、AppArmor、Seccomp 或自定義 POSIX 權能字）。

<!--
Privileged containers are [not supported](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)
on Windows.
Instead [HostProcess containers](/docs/tasks/configure-pod-container/create-hostprocess-pod)
can be used on Windows to perform many of the tasks performed by privileged containers on Linux.
-->
Windows 上[不支持](/zh-cn/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)特權容器。
然而，可以在 Windows 上使用 [HostProcess 容器](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod)來執行
Linux 上特權容器執行的許多任務。
