---
title: Kubernetes 物件管理
content_type: concept
weight: 15
---

<!-- overview -->
<!--
The `kubectl` command-line tool supports several different ways to create and manage
Kubernetes objects. This document provides an overview of the different
approaches. Read the [Kubectl book](https://kubectl.docs.kubernetes.io) for
details of managing objects by Kubectl.
-->
`kubectl` 命令列工具支援多種不同的方式來建立和管理 Kubernetes 物件。
本文件概述了不同的方法。
閱讀 [Kubectl book](https://kubectl.docs.kubernetes.io) 來了解 kubectl
管理物件的詳細資訊。

<!-- body -->

<!--
## Management techniques
-->
## 管理技巧

{{< warning >}}
<!--
A Kubernetes object should be managed using only one technique. Mixing
and matching techniques for the same object results in undefined behavior.
-->
應該只使用一種技術來管理 Kubernetes 物件。混合和匹配技術作用在同一物件上將導致未定義行為。
{{< /warning >}}

<!--
| Management technique             | Operates on          |Recommended environment | Supported writers  | Learning curve |
|----------------------------------|----------------------|------------------------|--------------------|----------------|
| Imperative commands              | Live objects         | Development projects   | 1+                 | Lowest         |
| Imperative object configuration  | Individual files     | Production projects    | 1                  | Moderate       |
| Declarative object configuration | Directories of files | Production projects    | 1+                 | Highest        |
-->
| 管理技術       | 作用於   | 建議的環境 | 支援的寫者 | 學習難度 |
|----------------|----------|------------|------------|----------|
| 指令式命令     | 活躍物件 | 開發專案   | 1+         | 最低     |
| 指令式物件配置 | 單個檔案 | 生產專案   | 1          | 中等     |
| 宣告式物件配置 | 檔案目錄 | 生產專案   | 1+         | 最高     |

<!--
## Imperative commands
-->
## 指令式命令

<!--
When using imperative commands, a user operates directly on live objects
in a cluster. The user provides operations to
the `kubectl` command as arguments or flags.
-->
使用指令式命令時，使用者可以在叢集中的活動物件上進行操作。使用者將操作傳給
`kubectl` 命令作為引數或標誌。

<!--
This is the recommended way to get started or to run a one-off task in
a cluster. Because this technique operates directly on live
objects, it provides no history of previous configurations.
-->
這是開始或者在叢集中執行一次性任務的推薦方法。因為這個技術直接在活躍物件
上操作，所以它不提供以前配置的歷史記錄。

<!--
### Examples
-->
### 例子

<!--
Run an instance of the nginx container by creating a Deployment object:
-->
透過建立 Deployment 物件來執行 nginx 容器的例項：

```sh
kubectl create deployment nginx --image nginx
```

<!--
### Trade-offs
-->
### 權衡

<!--
Advantages compared to object configuration:

- Commands are simple, easy to learn and easy to remember.
- Commands require only a single step to make changes to the cluster.
-->
與物件配置相比的優點：

- 命令簡單，易學且易於記憶。
- 命令僅需一步即可對叢集進行更改。

<!--
Disadvantages compared to object configuration:

- Commands do not integrate with change review processes.
- Commands do not provide an audit trail associated with changes.
- Commands do not provide a source of records except for what is live.
- Commands do not provide a template for creating new objects.
-->
與物件配置相比的缺點：

- 命令不與變更審查流程整合。
- 命令不提供與更改關聯的稽核跟蹤。
- 除了實時內容外，命令不提供記錄源。
- 命令不提供用於建立新物件的模板。

<!--
## Imperative object configuration
-->
## 指令式物件配置

<!--
In imperative object configuration, the kubectl command specifies the
operation (create, replace, etc.), optional flags and at least one file
name. The file specified must contain a full definition of the object
in YAML or JSON format.
-->
在指令式物件配置中，kubectl 命令指定操作（建立，替換等），可選標誌和
至少一個檔名。指定的檔案必須包含 YAML 或 JSON 格式的物件的完整定義。

<!--
See the [API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
for more details on object definitions.
-->
有關物件定義的詳細資訊，請檢視
[API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

{{< warning >}}
<!--
The imperative `replace` command replaces the existing
spec with the newly provided one, dropping all changes to the object missing from
the configuration file.  This approach should not be used with resource
types whose specs are updated independently of the configuration file.
Services of type `LoadBalancer`, for example, have their `externalIPs` field updated
independently from the configuration by the cluster.
-->
`replace` 指令式命令將現有規範替換為新提供的規範，並放棄對配置檔案中
缺少的物件的所有更改。此方法不應與物件規約被獨立於配置檔案進行更新的
資源型別一起使用。比如型別為 `LoadBalancer` 的服務，它的 `externalIPs` 
欄位就是獨立於叢集配置進行更新。
{{< /warning >}}

<!--
### Examples

Create the objects defined in a configuration file:
-->
### 例子

建立配置檔案中定義的物件：

```sh
kubectl create -f nginx.yaml
```

<!--
Delete the objects defined in two configuration files:
-->
刪除兩個配置檔案中定義的物件：

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

<!--
Update the objects defined in a configuration file by overwriting
the live configuration:
-->
透過覆蓋活動配置來更新配置檔案中定義的物件：

```sh
kubectl replace -f nginx.yaml
```

<!--
### Trade-offs
-->
### 權衡

<!--
Advantages compared to imperative commands:

- Object configuration can be stored in a source control system such as Git.
- Object configuration can integrate with processes such as reviewing changes before push and audit trails.
- Object configuration provides a template for creating new objects.
-->
與指令式命令相比的優點：

- 物件配置可以儲存在源控制系統中，比如 Git。
- 物件配置可以與流程整合，例如在推送和審計之前檢查更新。
- 物件配置提供了用於建立新物件的模板。

<!--
Disadvantages compared to imperative commands:

- Object configuration requires basic understanding of the object schema.
- Object configuration requires the additional step of writing a YAML file.
-->
與指令式命令相比的缺點：

- 物件配置需要對物件架構有基本的瞭解。
- 物件配置需要額外的步驟來編寫 YAML 檔案。

<!--
Advantages compared to declarative object configuration:

- Imperative object configuration behavior is simpler and easier to understand.
- As of Kubernetes version 1.5, imperative object configuration is more mature.
-->
與宣告式物件配置相比的優點：

- 指令式物件配置行為更加簡單易懂。
- 從 Kubernetes 1.5 版本開始，指令物件配置更加成熟。

<!--
Disadvantages compared to declarative object configuration:

- Imperative object configuration works best on files, not directories.
- Updates to live objects must be reflected in configuration files, or they will be lost during the next replacement.
-->
與宣告式物件配置相比的缺點：

- 指令式物件配置更適合檔案，而非目錄。
- 對活動物件的更新必須反映在配置檔案中，否則會在下一次替換時丟失。

<!--
## Declarative object configuration
-->
## 宣告式物件配置

<!--
When using declarative object configuration, a user operates on object
configuration files stored locally, however the user does not define the
operations to be taken on the files. Create, update, and delete operations
are automatically detected per-object by `kubectl`. This enables working on
directories, where different operations might be needed for different objects.
-->
使用宣告式物件配置時，使用者對本地儲存的物件配置檔案進行操作，但是使用者
未定義要對該檔案執行的操作。
`kubectl` 會自動檢測每個檔案的建立、更新和刪除操作。
這使得配置可以在目錄上工作，根據目錄中配置檔案對不同的物件執行不同的操作。

{{< note >}}
<!--
Declarative object configuration retains changes made by other
writers, even if the changes are not merged back to the object configuration file.
This is possible by using the `patch` API operation to write only
observed differences, instead of using the `replace`
API operation to replace the entire object configuration.
-->
宣告式物件配置保留其他編寫者所做的修改，即使這些更改並未合併到物件配置檔案中。
可以透過使用 `patch` API 操作僅寫入觀察到的差異，而不是使用 `replace` API
操作來替換整個物件配置來實現。
{{< /note >}}

<!--
### Examples
-->
### 例子

<!--
Process all object configuration files in the `configs` directory, and create or
patch the live objects. You can first `diff` to see what changes are going to be
made, and then apply:
-->
處理 `configs` 目錄中的所有物件配置檔案，建立並更新活躍物件。
可以首先使用 `diff` 子命令檢視將要進行的更改，然後在進行應用：

```sh
kubectl diff -f configs/
kubectl apply -f configs/
```

<!--
Recursively process directories:
-->
遞迴處理目錄：

```sh
kubectl diff -R -f configs/
kubectl apply -R -f configs/
```

<!--
### Trade-offs

Advantages compared to imperative object configuration:

- Changes made directly to live objects are retained, even if they are not merged back into the configuration files.
- Declarative object configuration has better support for operating on directories and automatically detecting operation types (create, patch, delete) per-object.
-->
### 權衡

與指令式物件配置相比的優點：

- 對活動物件所做的更改即使未合併到配置檔案中，也會被保留下來。
- 宣告性物件配置更好地支援對目錄進行操作並自動檢測每個檔案的操作型別（建立，修補，刪除）。

<!--
Disadvantages compared to imperative object configuration:

- Declarative object configuration is harder to debug and understand results when they are unexpected.
- Partial updates using diffs create complex merge and patch operations.
-->
與指令式物件配置相比的缺點：

- 宣告式物件配置難於除錯並且出現異常時結果難以理解。
- 使用 diff 產生的部分更新會建立複雜的合併和補丁操作。

## {{% heading "whatsnext" %}}


<!--
- [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [Managing Kubernetes Objects Using Object Configuration (Imperative)](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [Managing Kubernetes Objects Using Kustomize (Declarative)](/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
- [Kubectl Book](https://kubectl.docs.kubernetes.io)
- [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
- [使用指令式命令管理 Kubernetes 物件](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [使用物件配置管理 Kubernetes 物件（指令式）](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [使用物件配置管理 Kubernetes 物件（宣告式）](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [使用 Kustomize（宣告式）管理 Kubernetes 物件](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Kubectl 命令參考](/docs/reference/generated/kubectl/kubectl-commands/)
- [Kubectl Book](https://kubectl.docs.kubernetes.io)
- [Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

