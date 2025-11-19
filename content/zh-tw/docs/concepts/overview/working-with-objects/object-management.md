---
title: Kubernetes 對象管理
content_type: concept
weight: 20
---

<!-- overview -->
<!--
The `kubectl` command-line tool supports several different ways to create and manage
Kubernetes {{< glossary_tooltip text="objects" term_id="object" >}}. This document provides an overview of the different
approaches. Read the [Kubectl book](https://kubectl.docs.kubernetes.io) for
details of managing objects by Kubectl.
-->
`kubectl` 命令列工具支持多種不同的方式來創建和管理 Kubernetes
{{< glossary_tooltip text="對象" term_id="object" >}}。
本文檔概述了不同的方法。
閱讀 [Kubectl book](https://kubectl.docs.kubernetes.io/zh/) 來了解 kubectl
管理對象的詳細信息。

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
應該只使用一種技術來管理 Kubernetes 對象。混合和匹配技術作用在同一對象上將導致未定義行爲。
{{< /warning >}}

<!--
| Management technique             | Operates on          |Recommended environment | Supported writers  | Learning curve |
|----------------------------------|----------------------|------------------------|--------------------|----------------|
| Imperative commands              | Live objects         | Development projects   | 1+                 | Lowest         |
| Imperative object configuration  | Individual files     | Production projects    | 1                  | Moderate       |
| Declarative object configuration | Directories of files | Production projects    | 1+                 | Highest        |
-->
| 管理技術       | 作用於   | 建議的環境 | 支持的寫者 | 學習難度 |
|----------------|----------|------------|------------|----------|
| 指令式命令     | 活躍對象 | 開發項目   | 1+         | 最低     |
| 指令式對象設定 | 單個文件 | 生產項目   | 1          | 中等     |
| 聲明式對象設定 | 文件目錄 | 生產項目   | 1+         | 最高     |

<!--
## Imperative commands
-->
## 指令式命令

<!--
When using imperative commands, a user operates directly on live objects
in a cluster. The user provides operations to
the `kubectl` command as arguments or flags.
-->
使用指令式命令時，使用者可以在叢集中的活動對象上進行操作。使用者將操作傳給
`kubectl` 命令作爲參數或標誌。

<!--
This is the recommended way to get started or to run a one-off task in
a cluster. Because this technique operates directly on live
objects, it provides no history of previous configurations.
-->
這是開始或者在叢集中運行一次性任務的推薦方法。因爲這個技術直接在活躍對象
上操作，所以它不提供以前設定的歷史記錄。

<!--
### Examples
-->
### 例子

<!--
Run an instance of the nginx container by creating a Deployment object:
-->
通過創建 Deployment 對象來運行 nginx 容器的實例：

```sh
kubectl create deployment nginx --image nginx
```

<!--
### Trade-offs
-->
### 權衡

<!--
Advantages compared to object configuration:

- Commands are expressed as a single action word.
- Commands require only a single step to make changes to the cluster.
-->
與對象設定相比的優點：

- 命令用單個動詞表示。
- 命令僅需一步即可對叢集進行更改。

<!--
Disadvantages compared to object configuration:

- Commands do not integrate with change review processes.
- Commands do not provide an audit trail associated with changes.
- Commands do not provide a source of records except for what is live.
- Commands do not provide a template for creating new objects.
-->
與對象設定相比的缺點：

- 命令不與變更審查流程集成。
- 命令不提供與更改關聯的審覈跟蹤。
- 除了實時內容外，命令不提供記錄源。
- 命令不提供用於創建新對象的模板。

<!--
## Imperative object configuration
-->
## 指令式對象設定

<!--
In imperative object configuration, the kubectl command specifies the
operation (create, replace, etc.), optional flags and at least one file
name. The file specified must contain a full definition of the object
in YAML or JSON format.
-->
在指令式對象設定中，kubectl 命令指定操作（創建，替換等），可選標誌和
至少一個文件名。指定的文件必須包含 YAML 或 JSON 格式的對象的完整定義。

<!--
See the [API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
for more details on object definitions.
-->
有關對象定義的詳細信息，請查看
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
`replace` 指令式命令將現有規範替換爲新提供的規範，並放棄對設定文件中
缺少的對象的所有更改。此方法不應與對象規約被獨立於設定文件進行更新的
資源類型一起使用。比如類型爲 `LoadBalancer` 的服務，它的 `externalIPs` 
字段就是獨立於叢集設定進行更新。
{{< /warning >}}

<!--
### Examples

Create the objects defined in a configuration file:
-->
### 例子

創建設定文件中定義的對象：

```sh
kubectl create -f nginx.yaml
```

<!--
Delete the objects defined in two configuration files:
-->
刪除兩個設定文件中定義的對象：

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

<!--
Update the objects defined in a configuration file by overwriting
the live configuration:
-->
通過覆蓋活動設定來更新設定文件中定義的對象：

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

- 對象設定可以存儲在源控制系統中，比如 Git。
- 對象設定可以與流程集成，例如在推送和審計之前檢查更新。
- 對象設定提供了用於創建新對象的模板。

<!--
Disadvantages compared to imperative commands:

- Object configuration requires basic understanding of the object schema.
- Object configuration requires the additional step of writing a YAML file.
-->
與指令式命令相比的缺點：

- 對象設定需要對對象架構有基本的瞭解。
- 對象設定需要額外的步驟來編寫 YAML 文件。

<!--
Advantages compared to declarative object configuration:

- Imperative object configuration behavior is simpler and easier to understand.
- As of Kubernetes version 1.5, imperative object configuration is more mature.
-->
與聲明式對象設定相比的優點：

- 指令式對象設定行爲更加簡單易懂。
- 從 Kubernetes 1.5 版本開始，指令對象設定更加成熟。

<!--
Disadvantages compared to declarative object configuration:

- Imperative object configuration works best on files, not directories.
- Updates to live objects must be reflected in configuration files, or they will be lost during the next replacement.
-->
與聲明式對象設定相比的缺點：

- 指令式對象設定更適合文件，而非目錄。
- 對活動對象的更新必須反映在設定文件中，否則會在下一次替換時丟失。

<!--
## Declarative object configuration
-->
## 聲明式對象設定

<!--
When using declarative object configuration, a user operates on object
configuration files stored locally, however the user does not define the
operations to be taken on the files. Create, update, and delete operations
are automatically detected per-object by `kubectl`. This enables working on
directories, where different operations might be needed for different objects.
-->
使用聲明式對象設定時，使用者對本地存儲的對象設定文件進行操作，但是使用者
未定義要對該文件執行的操作。
`kubectl` 會自動檢測每個文件的創建、更新和刪除操作。
這使得設定可以在目錄上工作，根據目錄中設定文件對不同的對象執行不同的操作。

{{< note >}}
<!--
Declarative object configuration retains changes made by other
writers, even if the changes are not merged back to the object configuration file.
This is possible by using the `patch` API operation to write only
observed differences, instead of using the `replace`
API operation to replace the entire object configuration.
-->
聲明式對象設定保留其他編寫者所做的修改，即使這些更改並未合併到對象設定文件中。
可以通過使用 `patch` API 操作僅寫入觀察到的差異，而不是使用 `replace` API
操作來替換整個對象設定來實現。
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
處理 `configs` 目錄中的所有對象設定文件，創建並更新活躍對象。
可以首先使用 `diff` 子命令查看將要進行的更改，然後在進行應用：

```sh
kubectl diff -f configs/
kubectl apply -f configs/
```

<!--
Recursively process directories:
-->
遞歸處理目錄：

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

與指令式對象設定相比的優點：

- 對活動對象所做的更改即使未合併到設定文件中，也會被保留下來。
- 聲明性對象設定更好地支持對目錄進行操作並自動檢測每個文件的操作類型（創建，修補，刪除）。

<!--
Disadvantages compared to imperative object configuration:

- Declarative object configuration is harder to debug and understand results when they are unexpected.
- Partial updates using diffs create complex merge and patch operations.
-->
與指令式對象設定相比的缺點：

- 聲明式對象設定難於調試並且出現異常時結果難以理解。
- 使用 diff 產生的部分更新會創建複雜的合併和補丁操作。

## {{% heading "whatsnext" %}}


<!--
- [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [Declarative Management of Kubernetes Objects Using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
- [Kubectl Book](https://kubectl.docs.kubernetes.io)
- [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
- [使用指令式命令管理 Kubernetes 對象](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [使用設定文件對 Kubernetes 對象進行命令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [使用設定文件對 Kubernetes 對象進行聲明式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [使用 Kustomize 對 Kubernetes 對象進行聲明式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Kubectl 命令參考](/docs/reference/generated/kubectl/kubectl-commands/)
- [Kubectl Book](https://kubectl.docs.kubernetes.io/zh/)
- [Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

