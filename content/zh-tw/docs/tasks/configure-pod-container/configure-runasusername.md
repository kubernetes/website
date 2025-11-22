---
title: 爲 Windows 的 Pod 和容器設定 RunAsUserName
content_type: task
weight: 40
---

<!--
title: Configure RunAsUserName for Windows pods and containers
content_type: task
weight: 40
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
This page shows how to use the `runAsUserName` setting for Pods and containers that will run on Windows nodes. This is roughly equivalent of the Linux-specific `runAsUser` setting, allowing you to run applications in a container as a different username than the default.
-->
本頁展示如何爲運行爲在 Windows 節點上運行的 Pod 和容器設定 `RunAsUserName`。
大致相當於 Linux 上的 `runAsUser`，允許在容器中以與預設值不同的使用者名運行應用。

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster and the kubectl command-line tool must be configured to communicate with your cluster. The cluster is expected to have Windows worker nodes where pods with containers running Windows workloads will get scheduled.
-->
你必須有一個 Kubernetes 叢集，並且 kubectl 必須能和叢集通信。
叢集應該要有 Windows 工作節點，將在其中調度運行 Windows 工作負載的 pod 和容器。

<!--
## Set the Username for a Pod

To specify the username with which to execute the Pod's container processes, include the
`securityContext` field ([PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core))
in the Pod specification, and within it, the `windowsOptions`
([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core)) field containing the `runAsUserName` field.
-->
## 爲 Pod 設置 Username    {#set-the-username-for-a-pod}

要指定運行 Pod 容器時所使用的使用者名，請在 Pod 聲明中包含 `securityContext`
([PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)) 字段，
並在其內部包含 `windowsOptions`
([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core))
字段的 `runAsUserName` 字段。

<!--
The Windows security context options that you specify for a Pod apply to all Containers and init Containers in the Pod.

Here is a configuration file for a Windows Pod that has the `runAsUserName` field set:
-->

你爲 Pod 指定的 Windows SecurityContext 選項適用於該 Pod 中（包括 init 容器）的所有容器。

這兒有一個已經設置了 `runAsUserName` 字段的 Windows Pod 的設定檔案：

{{% code_sample file="windows/run-as-username-pod.yaml" %}}

<!--
Create the Pod:
-->

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-pod.yaml
```

<!--
Verify that the Pod's Container is running:
-->

驗證 Pod 容器是否在運行：

```shell
kubectl get pod run-as-username-pod-demo
```

<!--
Get a shell to the running Container:
-->

獲取該容器的 shell：

```shell
kubectl exec -it run-as-username-pod-demo -- powershell
```

<!--
Check that the shell is running user the correct username:
-->

檢查運行 shell 的使用者的使用者名是否正確：

```powershell
echo $env:USERNAME
```

<!--
The output should be:
-->

輸出結果應該是這樣：

```
ContainerUser
```

<!--
## Set the Username for a Container

To specify the username with which to execute a Container's processes, include the `securityContext` field
([SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core))
in the Container manifest, and within it, the
`windowsOptions` ([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param
"version" >}}/#windowssecuritycontextoptions-v1-core)) field containing the `runAsUserName` field.
-->

## 爲容器設置 Username    {#set-the-username-for-a-container}

要指定運行容器時所使用的使用者名，請在容器清單中包含 `securityContext`
([SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core))
字段，並在其內部包含 `windowsOptions`
（[WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param
"version" >}}/#windowssecuritycontextoptions-v1-core)）
字段的 `runAsUserName` 字段。

<!--
The Windows security context options that you specify for a Container apply only to that individual Container, and they override the settings made at the Pod level.

Here is the configuration file for a Pod that has one Container, and the `runAsUserName` field is set at the Pod level and the Container level:
-->
你爲容器指定的 Windows SecurityContext 選項僅適用於該容器，並且它會覆蓋 Pod 級別設置。

這裏有一個 Pod 的設定檔案，其中只有一個容器，並且在 Pod 級別和容器級別都設置了 `runAsUserName`：

{{% code_sample file="windows/run-as-username-container.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-container.yaml
```

<!--
Verify that the Pod's Container is running:
-->
驗證 Pod 容器是否在運行：

```shell
kubectl get pod run-as-username-container-demo
```

<!--
Get a shell to the running Container:
-->
獲取該容器的 shell：

```shell
kubectl exec -it run-as-username-container-demo -- powershell
```

<!--
Check that the shell is running user the correct username (the one set at the Container level):
-->
檢查運行 shell 的使用者的使用者名是否正確（應該是容器級別設置的那個）：

```powershell
echo $env:USERNAME
```

<!--
The output should be:
-->
輸出結果應該是這樣：

```
ContainerAdministrator
```

<!--
## Windows Username limitations

In order to use this feature, the value set in the `runAsUserName` field must be a valid username.
It must have the following format: `DOMAIN\USER`, where `DOMAIN\` is optional. Windows user names
are case insensitive. Additionally, there are some restrictions regarding the `DOMAIN` and `USER`:
-->
## Windows Username 的侷限性    {#windows-username-limitations}

想要使用此功能，在 `runAsUserName` 字段中設置的值必須是有效的使用者名。
它必須是 `DOMAIN\USER` 這種格式，其中 `DOMAIN\` 是可選的。
Windows 使用者名不區分大小寫。此外，關於 `DOMAIN` 和 `USER` 還有一些限制：

<!--
- The `runAsUserName` field cannot be empty, and it cannot contain control characters (ASCII values: `0x00-0x1F`, `0x7F`)
- The `DOMAIN` must be either a NetBios name, or a DNS name, each with their own restrictions:
  - NetBios names: maximum 15 characters, cannot start with `.` (dot), and cannot contain the following characters: `\ / : * ? " < > |`
  - DNS names: maximum 255 characters, contains only alphanumeric characters, dots, and dashes, and it cannot start or end with a `.` (dot) or `-` (dash).
- The `USER` must have at most 20 characters, it cannot contain *only* dots or spaces, and it cannot contain the following characters: `" / \ [ ] : ; | = , + * ? < > @`.
-->
- `runAsUserName` 字段不能爲空，並且不能包含控制字符（ASCII 值：`0x00-0x1F`、`0x7F`）
- `DOMAIN` 必須是 NetBios 名稱或 DNS 名稱，每種名稱都有各自的侷限性：
  - NetBios 名稱：最多 15 個字符，不能以 `.`（點）開頭，並且不能包含以下字符：`\ / : * ? " < > |`
  - DNS 名稱：最多 255 個字符，只能包含字母、數字、點和中劃線，並且不能以 `.`（點）或 `-`（中劃線）開頭和結尾。
- `USER` 最多不超過 20 個字符，不能**只**包含點或空格，並且不能包含以下字符：`" / \ [ ] : ; | = , + * ? < > @`

<!--
Examples of acceptable values for the `runAsUserName` field: `ContainerAdministrator`, `ContainerUser`, `NT AUTHORITY\NETWORK SERVICE`, `NT AUTHORITY\LOCAL SERVICE`.

For more information about these limtations, check [here](https://support.microsoft.com/en-us/help/909264/naming-conventions-in-active-directory-for-computers-domains-sites-and) and [here](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/new-localuser?view=powershell-5.1).
-->
`runAsUserName` 字段接受的值的一些示例：`ContainerAdministrator`、`ContainerUser`、
`NT AUTHORITY\NETWORK SERVICE`、`NT AUTHORITY\LOCAL SERVICE`。

關於這些限制的更多資訊，可以查看[這裏](https://support.microsoft.com/en-us/help/909264/naming-conventions-in-active-directory-for-computers-domains-sites-and)和[這裏](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/new-localuser?view=powershell-5.1)。

## {{% heading "whatsnext" %}}

<!--
* [Guide for scheduling Windows containers in Kubernetes](/docs/concepts/windows/user-guide/)
* [Managing Workload Identity with Group Managed Service Accounts (GMSA)](/docs/concepts/windows/user-guide/#managing-workload-identity-with-group-managed-service-accounts)
* [Configure GMSA for Windows pods and containers](/docs/tasks/configure-pod-container/configure-gmsa/)
-->
* [Kubernetes 中調度 Windows 容器的指南](/zh-cn/docs/concepts/windows/user-guide/)
* [使用組託管服務帳戶（GMSA）管理工作負載身份](/zh-cn/docs/concepts/windows/user-guide/#managing-workload-identity-with-group-managed-service-accounts)
* [Windows 下 Pod 和容器的 GMSA 設定](/zh-cn/docs/tasks/configure-pod-container/configure-gmsa/)
