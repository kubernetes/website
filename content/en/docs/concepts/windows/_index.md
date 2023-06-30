---
title: "Windows in Kubernetes"
simple_list: true
weight: 200 # late in list
description: >-
  Kubernetes supports nodes that run Microsoft Windows.
---

Kubernetes supports worker {{< glossary_tooltip text="nodes" term_id="node" >}}
running either Linux or Microsoft Windows.

{{% thirdparty-content single="true" %}}

The CNCF and its parent the Linux Foundation take a vendor-neutral approach
towards compatibility. It is possible to join your [Windows server](https://www.microsoft.com/en-us/windows-server)
as a worker node to a Kubernetes cluster.

You can [install and set up kubectl on Windows](/docs/tasks/tools/install-kubectl-windows/)
no matter what operating system you use within your cluster.

If you are using Windows nodes, you can read:

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
