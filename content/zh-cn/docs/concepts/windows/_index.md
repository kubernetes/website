---
title: "Kubernetes 中的 Windows"
simple_list: true
weight: 200
description: >-
  Kubernetes 支持运行 Microsoft Windows 节点。
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
Kubernetes 支持运行 Linux 或 Microsoft Windows
的工作{{< glossary_tooltip text="节点" term_id="node" >}}。

{{% thirdparty-content single="true" %}}

<!--
The CNCF and its parent the Linux Foundation take a vendor-neutral approach
towards compatibility. It is possible to join your [Windows server](https://www.microsoft.com/en-us/windows-server)
as a worker node to a Kubernetes cluster.
-->
CNCF 及其母公司 Linux 基金会采用供应商中立的方法来实现兼容性。可以将你的
[Windows 服务器](https://www.microsoft.com/en-us/windows-server)作为工作节点加入
Kubernetes 集群。

<!--
You can [install and set up kubectl on Windows](/docs/tasks/tools/install-kubectl-windows/)
no matter what operating system you use within your cluster.

If you are using Windows nodes, you can read:
-->
无论你的集群使用什么操作系统，
都可以[在 Windows 上安装和设置 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-windows/)。

如果你使用的是 Windows 节点，你可以阅读：

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
* [Windows 上的网络](/zh-cn/docs/concepts/services-networking/windows-networking/)
* [Kubernetes 中的 Windows 存储](/zh-cn/docs/concepts/storage/windows-storage/)
* [Windows 节点的资源管理](/zh-cn/docs/concepts/configuration/windows-resource-management/)
* [为 Windows Pod 和容器配置 RunAsUserName](/zh-cn/docs/tasks/configure-pod-container/configure-runasusername/)
* [创建 Windows HostProcess Pod](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* [为 Windows Pod 和容器配置组托管服务帐户](/zh-cn/docs/tasks/configure-pod-container/configure-gmsa/)
* [Windows 节点的安全性](/zh-cn/docs/concepts/security/windows-security/)
* [Windows 调试技巧](/zh-cn/docs/tasks/debug/debug-cluster/windows/)
* [在 Kubernetes 中调度 Windows 容器指南](/zh-cn/docs/concepts/windows/user-guide)

或者，要了解概览，请阅读：


