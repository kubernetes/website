---
title: "kubectl 介紹"
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
kubectl 是 Kubernetes CLI 版本的瑞士軍刀，可以勝任多種多樣的任務。

本文主要介紹如何使用 kubectl 在 Kubernetes 中聲明式管理應用，本文還涵蓋了一些其他的 kubectl 功能。

<!--
## Command Families

Most kubectl commands typically fall into one of a few categories:
-->
## 命令分類   {#command-families}

大多數 kubectl 命令通常可以分爲以下幾類：

<!--
| Type                                   | Used For                   | Description                                        |
|----------------------------------------|----------------------------|----------------------------------------------------|
| Declarative Resource Management        | Deployment and operations (e.g. GitOps)   | Declaratively manage Kubernetes workloads using resource configuration     |
| Imperative Resource Management         | Development Only           | Run commands to manage Kubernetes workloads using Command Line arguments and flags |
| Printing Workload State | Debugging  | Print information about workloads |
| Interacting with Containers | Debugging  | Exec, attach, cp, logs |
| Cluster Management | Cluster operations | Drain and cordon Nodes |
-->
| 類型 | 用途 | 描述 |
|-----|------|------|
| 聲明式資源管理 | 部署和運維（如 GitOps）| 使用資源管理聲明式管理 Kubernetes 工作負載 |
| 命令式資源管理 | 僅限開發環境 | 使用命令行參數和標誌來管理 Kubernetes 工作負載 |
| 打印工作負載狀態 | 調試 | 打印有關工作負載的信息 |
| 與容器交互 | 調試 | 執行、掛接、複製、日誌 |
| 集羣管理 | 集羣運維 | 排空和封鎖節點 |

<!--
## Declarative Application Management

The preferred approach for managing resources is through
declarative files called resource configuration used with the kubectl *Apply* command.
This command reads a local (or remote) file structure and modifies cluster state to
reflect the declared intent.
-->
## 聲明式應用管理   {#declarative-application-management}

管理資源的首選方法是配合 kubectl **Apply** 命令一起使用名爲資源的聲明式文件。
此命令讀取本地（或遠程）文件結構，並修改集羣狀態以反映聲明的意圖。

{{< alert color="success" title="Apply" >}}
<!--
Apply is the preferred mechanism for managing resources in a Kubernetes cluster.
-->
Apply 是在 Kubernetes 集羣中管理資源的首選機制。
{{< /alert >}}

<!--
## Printing State about Workloads

Users will need to view workload state.

- Printing summarize state and information about resources
- Printing complete state and information about resources
- Printing specific fields from resources
- Query resources matching labels
-->
## 打印工作負載狀態   {#printing-state-about-workloads}

用戶需要查看工作負載狀態。

- 打印關於資源的摘要狀態和信息
- 打印關於資源的完整狀態和信息
- 打印資源的特定字段
- 查詢與標籤匹配的資源

<!--
## Debugging Workloads

kubectl supports debugging by providing commands for:

- Printing Container logs
- Printing cluster events
- Exec or attaching to a Container
- Copying files from Containers in the cluster to a user's filesystem
-->
## 調試工作負載   {#debugging-workloads}

kubectl 支持通過提供以下命令進行調試：

- 打印 Container 日誌
- 打印集羣事件
- 執行或掛接到 Container
- 將集羣中 Container 中的文件複製到用戶的文件系統

<!--
## Cluster Management

On occasion, users may need to perform operations to the Nodes of cluster. kubectl supports
commands to drain workloads from a Node so that it can be decommissioned or debugged.
-->
## 集羣管理   {#cluster-management}

有時用戶可能需要對集羣的節點執行操作。
kubectl 支持使用命令將工作負載從節點中排空，以便節點可以被停用或調試。

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

用戶可能會發現使用資源管理進行 **開發** 過於繁瑣，
他們更喜歡使用類似於 Shell 的工作流以 **命令式** 與集羣交互。
kubectl 提供了用於生成和修改資源的 Porcelain 命令。

- 生成和創建 Deployment、StatefulSet、Service、ConfigMap 等這類資源
- 設置資源的字段
- 在文本編輯器中（實時）編輯資源

<!--
{{< alert color="warning" title="Porcelain For Dev Only" >}}
Porcelain commands are time saving for experimenting with workloads in a dev cluster, but shouldn't
be used for production.
{{< /alert >}}
-->
{{< alert color="warning" title="Porcelain 僅限開發使用" >}}
Porcelain 命令可以節省在開發集羣中進行工作負載實驗的時間，但不應當用於生產環境。
{{< /alert >}}
