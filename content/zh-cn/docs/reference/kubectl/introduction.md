---
title: "kubectl 介绍"
content_type: concept
weight: 1
---
<!--
title: "Introduction to kubectl"
content_type: concept
weight: 1
-->

<!--
kubectl is the Kubernetes cli version of a swiss army knife, and can do many things.

While this Book is focused on using kubectl to declaratively manage applications in Kubernetes, it
also covers other kubectl functions.
-->
kubectl 是 Kubernetes CLI 版本的瑞士军刀，可以胜任多种多样的任务。

本文主要介绍如何使用 kubectl 在 Kubernetes 中声明式管理应用，本文还涵盖了一些其他的 kubectl 功能。

<!--
## Command Families

Most kubectl commands typically fall into one of a few categories:
-->
## 命令分类   {#command-families}

大多数 kubectl 命令通常可以分为以下几类：

<!--
| Type                                   | Used For                   | Description                                        |
|----------------------------------------|----------------------------|----------------------------------------------------|
| Declarative Resource Management        | Deployment and operations (e.g. GitOps)   | Declaratively manage Kubernetes workloads using resource configuration     |
| Imperative Resource Management         | Development Only           | Run commands to manage Kubernetes workloads using Command Line arguments and flags |
| Printing Workload State | Debugging  | Print information about workloads |
| Interacting with Containers | Debugging  | Exec, attach, cp, logs |
| Cluster Management | Cluster operations | Drain and cordon Nodes |
-->
| 类型 | 用途 | 描述 |
|-----|------|------|
| 声明式资源管理 | 部署和运维（如 GitOps）| 使用资源管理声明式管理 Kubernetes 工作负载 |
| 命令式资源管理 | 仅限开发环境 | 使用命令行参数和标志来管理 Kubernetes 工作负载 |
| 打印工作负载状态 | 调试 | 打印有关工作负载的信息 |
| 与容器交互 | 调试 | 执行、挂接、复制、日志 |
| 集群管理 | 集群运维 | 排空和封锁节点 |

<!--
## Declarative Application Management

The preferred approach for managing resources is through
declarative files called resource configuration used with the kubectl *Apply* command.
This command reads a local (or remote) file structure and modifies cluster state to
reflect the declared intent.
-->
## 声明式应用管理   {#declarative-application-management}

管理资源的首选方法是配合 kubectl **Apply** 命令一起使用名为资源的声明式文件。
此命令读取本地（或远程）文件结构，并修改集群状态以反映声明的意图。

{{< alert color="success" title="Apply" >}}
<!--
Apply is the preferred mechanism for managing resources in a Kubernetes cluster.
-->
Apply 是在 Kubernetes 集群中管理资源的首选机制。
{{< /alert >}}

<!--
## Printing State about Workloads

Users will need to view workload state.

- Printing summarize state and information about resources
- Printing complete state and information about resources
- Printing specific fields from resources
- Query resources matching labels
-->
## 打印工作负载状态   {#printing-state-about-workloads}

用户需要查看工作负载状态。

- 打印关于资源的摘要状态和信息
- 打印关于资源的完整状态和信息
- 打印资源的特定字段
- 查询与标签匹配的资源

<!--
## Debugging Workloads

kubectl supports debugging by providing commands for:

- Printing Container logs
- Printing cluster events
- Exec or attaching to a Container
- Copying files from Containers in the cluster to a user's filesystem
-->
## 调试工作负载   {#debugging-workloads}

kubectl 支持通过提供以下命令进行调试：

- 打印 Container 日志
- 打印集群事件
- 执行或挂接到 Container
- 将集群中 Container 中的文件复制到用户的文件系统

<!--
## Cluster Management

On occasion, users may need to perform operations to the Nodes of cluster. kubectl supports
commands to drain workloads from a Node so that it can be decommissioned or debugged.
-->
## 集群管理   {#cluster-management}

有时用户可能需要对集群的节点执行操作。
kubectl 支持使用命令将工作负载从节点中排空，以便节点可以被停用或调试。

<!--
## Porcelain

Users may find using resource configuration overly verbose for *development* and prefer to work with
the cluster *imperatively* with a shell-like workflow. kubectl offers porcelain commands for
generating and modifying resources.

- Generating + creating resources such as Deployments, StatefulSets, Services, ConfigMaps, etc.
- Setting fields on resources
- Editing (live) resources in a text editor
-->
## Porcelain

用户可能会发现使用资源管理进行 **开发** 过于繁琐，
他们更喜欢使用类似于 Shell 的工作流以 **命令式** 与集群交互。
kubectl 提供了用于生成和修改资源的 Porcelain 命令。

- 生成和创建 Deployment、StatefulSet、Service、ConfigMap 等这类资源
- 设置资源的字段
- 在文本编辑器中（实时）编辑资源

<!--
{{< alert color="warning" title="Porcelain For Dev Only" >}}
Porcelain commands are time saving for experimenting with workloads in a dev cluster, but shouldn't
be used for production.
{{< /alert >}}
-->
{{< alert color="warning" title="Porcelain 仅限开发使用" >}}
Porcelain 命令在开发集群中进行工作负载实验时可以节省时间，但不应用于生产。
{{< /alert >}}
