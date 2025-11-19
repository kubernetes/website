---
title: "Kubernetes 中的 Windows"
simple_list: true
weight: 200
description: >-
  Kubernetes 支持運行 Microsoft Windows 節點。
---

<!--
title: "Windows in Kubernetes"
simple_list: true
weight: 200 # late in list
description: >-
  Kubernetes supports nodes that run Microsoft Windows.
-->

<!--
Kubernetes supports worker {{< glossary_tooltip text="nodes" term_id="node" >}}
running either Linux or Microsoft Windows.
-->
Kubernetes 支持運行 Linux 或 Microsoft Windows
的工作{{< glossary_tooltip text="節點" term_id="node" >}}。

{{% thirdparty-content single="true" %}}

<!--
The CNCF and its parent the Linux Foundation take a vendor-neutral approach
towards compatibility. It is possible to join your [Windows server](https://www.microsoft.com/en-us/windows-server)
as a worker node to a Kubernetes cluster.
-->
CNCF 及其母公司 Linux 基金會採用供應商中立的方法來實現兼容性。可以將你的
[Windows 服務器](https://www.microsoft.com/en-us/windows-server)作爲工作節點加入
Kubernetes 集羣。

<!--
You can [install and set up kubectl on Windows](/docs/tasks/tools/install-kubectl-windows/)
no matter what operating system you use within your cluster.

If you are using Windows nodes, you can read:
-->
無論你的集羣使用什麼操作系統，
都可以[在 Windows 上安裝和設置 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-windows/)。

如果你使用的是 Windows 節點，你可以閱讀：

<!--
* [Networking On Windows](/docs/concepts/services-networking/windows-networking/)
* [Windows Storage In Kubernetes](/docs/concepts/storage/windows-storage/)
* [Resource Management for Windows Nodes](/docs/concepts/configuration/windows-resource-management/)
* [Configure RunAsUserName for Windows Pods and Containers](/docs/tasks/configure-pod-container/configure-runasusername/)
* [Create A Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* [Configure Group Managed Service Accounts for Windows Pods and Containers](/docs/tasks/configure-pod-container/configure-gmsa/)
* [Security For Windows Nodes](/docs/concepts/security/windows-security/)
* [Windows Debugging Tips](/docs/tasks/debug/debug-cluster/windows/)
* [Guide for Scheduling Windows Containers in Kubernetes](/docs/concepts/windows/user-guide)

or, for an overview, read:
-->
* [Windows 上的網絡](/zh-cn/docs/concepts/services-networking/windows-networking/)
* [Kubernetes 中的 Windows 存儲](/zh-cn/docs/concepts/storage/windows-storage/)
* [Windows 節點的資源管理](/zh-cn/docs/concepts/configuration/windows-resource-management/)
* [爲 Windows Pod 和容器配置 RunAsUserName](/zh-cn/docs/tasks/configure-pod-container/configure-runasusername/)
* [創建 Windows HostProcess Pod](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* [爲 Windows Pod 和容器配置組託管服務帳戶](/zh-cn/docs/tasks/configure-pod-container/configure-gmsa/)
* [Windows 節點的安全性](/zh-cn/docs/concepts/security/windows-security/)
* [Windows 調試技巧](/zh-cn/docs/tasks/debug/debug-cluster/windows/)
* [在 Kubernetes 中調度 Windows 容器指南](/zh-cn/docs/concepts/windows/user-guide)

或者，要了解概覽，請閱讀：


