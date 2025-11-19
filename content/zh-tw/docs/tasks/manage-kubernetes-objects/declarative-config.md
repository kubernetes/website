---
title: 使用配置文件對 Kubernetes 對象進行聲明式管理
content_type: task
weight: 10
---
<!--
title: Declarative Management of Kubernetes Objects Using Configuration Files
content_type: task
weight: 10
-->
<!-- overview -->

<!--
Kubernetes objects can be created, updated, and deleted by storing multiple
object configuration files in a directory and using `kubectl apply` to
recursively create and update those objects as needed. This method
retains writes made to live objects without merging the changes
back into the object configuration files. `kubectl diff` also gives you a
preview of what changes `apply` will make.
-->
你可以通過在一個目錄中存儲多個對象配置文件、並使用 `kubectl apply`
來遞歸地創建和更新對象來創建、更新和刪除 Kubernetes 對象。
這種方法會保留對現有對象已作出的修改，而不會將這些更改寫回到對象配置文件中。
`kubectl diff` 也會給你呈現 `apply` 將作出的變更的預覽。

## {{% heading "prerequisites" %}}

<!--
Install [`kubectl`](/docs/tasks/tools/).
-->
安裝 [`kubectl`](/zh-cn/docs/tasks/tools/)。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Trade-offs

The `kubectl` tool supports three kinds of object management:

* Imperative commands
* Imperative object configuration
* Declarative object configuration

See [Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
for a discussion of the advantages and disadvantage of each kind of object management.
-->
## 權衡取捨   {#trade-offs}

`kubectl` 工具能夠支持三種對象管理方式：

* 指令式命令
* 指令式對象配置
* 聲明式對象配置

關於每種對象管理的優缺點的討論，可參見
[Kubernetes 對象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)。

<!--
## Overview

Declarative object configuration requires a firm understanding of
the Kubernetes object definitions and configuration. Read and complete
the following documents if you have not already:

* [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
-->
## 概覽  {#overview}

聲明式對象管理需要用戶對 Kubernetes 對象定義和配置有比較深刻的理解。
如果你還沒有這方面的知識儲備，請先閱讀下面的文檔：

* [使用指令式命令管理 Kubernetes 對象](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [使用配置文件對 Kubernetes 對象進行指令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)

<!--
Following are definitions for terms used in this document:

- *object configuration file / configuration file*: A file that defines the
  configuration for a Kubernetes object. This topic shows how to pass configuration
  files to `kubectl apply`. Configuration files are typically stored in source control, such as Git.
- *live object configuration / live configuration*: The live configuration
  values of an object, as observed by the Kubernetes cluster. These are kept in the Kubernetes
  cluster storage, typically etcd.
- *declarative configuration writer / declarative writer*: A person or software component
  that makes updates to a live object. The live writers referred to in this topic make changes
  to object configuration files and run `kubectl apply` to write the changes.
-->
以下是本文檔中使用的術語的定義：

- **對象配置文件/配置文件**：一個定義 Kubernetes 對象的配置的文件。
  本主題展示如何將配置文件傳遞給 `kubectl apply`。
  配置文件通常存儲於類似 Git 這種源碼控制系統中。  
- **現時對象配置/現時配置**：由 Kubernetes 集羣所觀測到的對象的現時配置值。
  這些配置保存在 Kubernetes 集羣存儲（通常是 etcd）中。
- **聲明式配置寫者/聲明式寫者**：負責更新現時對象的人或者軟件組件。
  本主題中的聲明式寫者負責改變對象配置文件並執行 `kubectl apply` 命令以寫入變更。

<!--
## How to create objects

Use `kubectl apply` to create all objects, except those that already exist,
defined by configuration files in a specified directory:

```shell
kubectl apply -f <directory>
```

This sets the `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
annotation on each object. The annotation contains the contents of the object
configuration file that was used to create the object.
-->
## 如何創建對象 {#how-to-create-objects}

使用 `kubectl apply` 來創建指定目錄中配置文件所定義的所有對象，除非對應對象已經存在：

```shell
kubectl apply -f <目錄>
```

此操作會在每個對象上設置 `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
註解。註解值中包含了用來創建對象的配置文件的內容。

{{< note >}}
<!--
Add the `-R` flag to recursively process directories.
-->
添加 `-R` 標誌可以遞歸地處理目錄。
{{< /note >}}

<!--
Here's an example of an object configuration file:
-->
下面是一個對象配置文件示例：

{{% code_sample file="application/simple_deployment.yaml" %}}

<!--
Run `kubectl diff` to print the object that will be created:
-->
執行 `kubectl diff` 可以打印出將被創建的對象：

```shell
kubectl diff -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
<!--
`diff` uses [server-side dry-run](/docs/reference/using-api/api-concepts/#dry-run),
which needs to be enabled on `kube-apiserver`.

Since `diff` performs a server-side apply request in dry-run mode,
it requires granting `PATCH`, `CREATE`, and `UPDATE` permissions.
See [Dry-Run Authorization](/docs/reference/using-api/api-concepts#dry-run-authorization)
for details.
-->
`diff` 使用[服務器端試運行（Server-side Dry-run）](/zh-cn/docs/reference/using-api/api-concepts/#dry-run)
功能特性；而該功能特性需要在 `kube-apiserver` 上啓用。

由於 `diff` 操作會使用試運行模式執行服務器端 apply 請求，因此需要爲用戶配置
`PATCH`、`CREATE` 和 `UPDATE` 操作權限。
參閱[試運行授權](/zh-cn/docs/reference/using-api/api-concepts#dry-run-authorization)瞭解詳情。
{{< /note >}}

<!--
Create the object using `kubectl apply`:
-->
使用 `kubectl apply` 來創建對象：

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 打印其現時配置：

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

<!--
The output shows that the `kubectl.kubernetes.io/last-applied-configuration` annotation
was written to the live configuration, and it matches the configuration file:
-->
輸出顯示註解 `kubectl.kubernetes.io/last-applied-configuration`
被寫入到現時配置中，並且其內容與配置文件相同：

<!--
```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # This is the json representation of simple_deployment.yaml
    # It was written by kubectl apply when the object was created
```
-->
```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # 此爲 simple_deployment.yaml 的 JSON 表示
    # 在對象創建時由 kubectl apply 命令寫入
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

<!--
## How to update objects

You can also use `kubectl apply` to update all objects defined in a directory, even
if those objects already exist. This approach accomplishes the following:

1. Sets fields that appear in the configuration file in the live configuration.
2. Clears fields removed from the configuration file in the live configuration.

```shell
kubectl diff -f <directory>
kubectl apply -f <directory>
```
-->
## 如何更新對象   {#how-to-update-objects}

你也可以使用 `kubectl apply` 來更新某個目錄中定義的所有對象，即使那些對象已經存在。
這一操作會隱含以下行爲：

1. 在現時配置中設置配置文件中出現的字段；
2. 在現時配置中清除配置文件中已刪除的字段。

```shell
kubectl diff -f <目錄>
kubectl apply -f <目錄>
```

{{< note >}}
<!--
Add the `-R` flag to recursively process directories.
-->
使用 `-R` 標誌遞歸處理目錄。
{{< /note >}}

<!--
Here's an example configuration file:
-->
下面是一個配置文件示例：

{{% code_sample file="application/simple_deployment.yaml" %}}

<!--
Create the object using `kubectl apply`:
-->
使用 `kubectl apply` 來創建對象：

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
<!--
For purposes of illustration, the preceding command refers to a single
configuration file instead of a directory.
-->
出於演示的目的，上面的命令引用的是單個文件而不是整個目錄。
{{< /note >}}

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 打印現時配置：

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

<!--
The output shows that the `kubectl.kubernetes.io/last-applied-configuration` annotation
was written to the live configuration, and it matches the configuration file:
-->
輸出顯示，註解 `kubectl.kubernetes.io/last-applied-configuration`
被寫入到現時配置中，並且其取值與配置文件內容相同。

<!--
```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # This is the json representation of simple_deployment.yaml
    # It was written by kubectl apply when the object was created
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
```
-->
```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # 此爲 simple_deployment.yaml 的 JSON 表示
    # 在對象創建時由 kubectl apply 命令寫入
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

<!--
Directly update the `replicas` field in the live configuration by using `kubectl scale`.
This does not use `kubectl apply`:
-->
通過 `kubectl scale` 命令直接更新現時配置中的 `replicas` 字段。
這一命令沒有使用 `kubectl apply`：

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 來打印現時配置：

```shell
kubectl get deployment nginx-deployment -o yaml
```

<!--
The output shows that the `replicas` field has been set to 2, and the `last-applied-configuration`
annotation does not contain a `replicas` field:
-->
輸出顯示，`replicas` 字段已經被設置爲 2，而 `last-applied-configuration`
註解中並不包含 `replicas` 字段。

<!--
# note that the annotation does not contain replicas
# because it was not updated through apply
# written by scale
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 注意註解中並不包含 replicas
    # 這是因爲更新並不是通過 kubectl apply 來執行的
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # 由 scale 命令填寫
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

<!--
Update the `simple_deployment.yaml` configuration file to change the image from
`nginx:1.14.2` to `nginx:1.16.1`, and delete the `minReadySeconds` field:
-->
現在更新 `simple_deployment.yaml` 配置文件，將鏡像文件從
`nginx:1.14.2` 更改爲 `nginx:1.16.1`，同時刪除`minReadySeconds` 字段：

{{% code_sample file="application/update_deployment.yaml" %}}

<!--
Apply the changes made to the configuration file:
-->
應用對配置文件所作更改：

```shell
kubectl diff -f https://k8s.io/examples/application/update_deployment.yaml
kubectl apply -f https://k8s.io/examples/application/update_deployment.yaml
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 打印現時配置：

```shell
kubectl get -f https://k8s.io/examples/application/update_deployment.yaml -o yaml
```

<!--
The output shows the following changes to the live configuration:

* The `replicas` field retains the value of 2 set by `kubectl scale`.
  This is possible because it is omitted from the configuration file.
* The `image` field has been updated to `nginx:1.16.1` from `nginx:1.14.2`.
* The `last-applied-configuration` annotation has been updated with the new image.
* The `minReadySeconds` field has been cleared.
* The `last-applied-configuration` annotation no longer contains the `minReadySeconds` field.
-->
輸出顯示現時配置中發生了以下更改：

* 字段 `replicas` 保留了 `kubectl scale` 命令所設置的值：2；
  之所以該字段被保留是因爲配置文件中並沒有設置 `replicas`。
* 字段 `image` 的內容已經從 `nginx:1.14.2` 更改爲 `nginx:1.16.1`。
* 註解 `last-applied-configuration` 內容被更改爲新的鏡像名稱。
* 字段 `minReadySeconds` 被移除。
* 註解 `last-applied-configuration` 中不再包含 `minReadySeconds` 字段。

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # The annotation contains the updated image to nginx 1.16.1,
    # but does not contain the updated replicas to 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # Set by `kubectl scale`.  Ignored by `kubectl apply`.
  # minReadySeconds cleared by `kubectl apply`
  # ...
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # Set by `kubectl apply`
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 註解中包含更新後的鏡像 nginx 1.16.1
    # 但是其中並不包含更改後的 replicas 值 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # 由 `kubectl scale` 設置，被 `kubectl apply` 命令忽略
  # minReadySeconds 被 `kubectl apply` 清除
  # ...
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # 由 `kubectl apply` 設置
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

{{< warning >}}
<!--
Mixing `kubectl apply` with the imperative object configuration commands
`create` and `replace` is not supported. This is because `create`
and `replace` do not retain the `kubectl.kubernetes.io/last-applied-configuration`
that `kubectl apply` uses to compute updates.
-->
將 `kubectl apply` 與指令式對象配置命令 `kubectl create` 或 `kubectl replace`
混合使用是不受支持的。這是因爲 `create` 和 `replace` 命令都不會保留
`kubectl apply` 用來計算更新內容所使用的
`kubectl.kubernetes.io/last-applied-configuration` 註解值。
{{< /warning >}}

<!--
## How to delete objects

There are two approaches to delete objects managed by `kubectl apply`.

### Recommended: `kubectl delete -f <filename>`

Manually deleting objects using the imperative command is the recommended
approach, as it is more explicit about what is being deleted, and less likely
to result in the user deleting something unintentionally:

```shell
kubectl delete -f <filename>
```
-->
## 如何刪除對象  {#how-to-delete-objects}

有兩種方法來刪除 `kubectl apply` 管理的對象。

### 建議操作：`kubectl delete -f <文件名>`

使用指令式命令來手動刪除對象是建議的方法，因爲這種方法更爲明確地給出了要刪除的內容是什麼，
且不容易造成用戶不小心刪除了其他對象的情況。

```shell
kubectl delete -f <文件名>
```

<!--
### Alternative: `kubectl apply -f <directory> --prune`

As an alternative to `kubectl delete`, you can use `kubectl apply` to identify objects to be deleted after
their manifests have been removed from a directory in the local filesystem.
-->
### 替代方式：`kubectl apply -f <目錄> --prune`

作爲 `kubectl delete` 操作的替代方式，你可以在本地文件系統的目錄中的清單文件被刪除之後，
使用 `kubectl apply` 來辯識要刪除的對象。

<!--
In Kubernetes {{< skew currentVersion >}}, there are two pruning modes available in kubectl apply:

- Allowlist-based pruning: This mode has existed since kubectl v1.5 but is still
  in alpha due to usability, correctness and performance issues with its design.
  The ApplySet-based mode is designed to replace it.
- ApplySet-based pruning: An _apply set_ is a server-side object (by default, a Secret)
  that kubectl can use to accurately and efficiently track set membership across **apply**
  operations. This mode was introduced in alpha in kubectl v1.27 as a replacement for allowlist-based pruning.
-->
在 Kubernetes {{< skew currentVersion >}} 中，`kubectl apply` 可使用兩種剪裁模式：

- 基於 Allowlist 的剪裁：這種模式自 kubectl v1.5 版本開始就存在，
  但由於其設計存在易用性、正確性和性能問題，因此仍處於 Alpha 階段。
  基於 ApplySet 的模式設計用於取代這種模式。
- 基於 ApplySet 的剪裁：**apply set** 是一個服務器端對象（默認是一個 Secret），
  kubectl 可以使用它來在 **apply** 操作中準確高效地跟蹤集合成員。
  這種模式在 kubectl v1.27 中以 Alpha 引入，作爲基於 Allowlist 剪裁的替代方案。

{{< tabs name="kubectl_apply_prune" >}}
{{% tab name="Allow list" %}}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

{{< warning >}}
<!--
Take care when using `--prune` with `kubectl apply` in allow list mode. Which
objects are pruned depends on the values of the `--prune-allowlist`, `--selector`
and `--namespace` flags, and relies on dynamic discovery of the objects in scope.
Especially if flag values are changed between invocations, this can lead to objects
being unexpectedly deleted or retained.
-->
在 Allowlist 模式下使用 `kubectl apply` 命令時要小心使用 `--prune` 標誌。
哪些對象被剪裁取決於 `--prune-allowlist`、`--selector` 和 `--namespace` 標誌的值，
並且依賴於作用域中對象的動態發現。特別是在調用之間更改標誌值時，這可能會導致對象被意外刪除或保留。
{{< /warning >}}

<!--
To use allowlist-based pruning, add the following flags to your `kubectl apply` invocation:

- `--prune`: Delete previously applied objects that are not in the set passed to the current invocation.
- `--prune-allowlist`: A list of group-version-kinds (GVKs) to consider for pruning.
  This flag is optional but strongly encouraged, as its default value is a partial
  list of both namespaced and cluster-scoped types, which can lead to surprising results.
- `--selector/-l`: Use a label selector to constrain the set of objects selected
  for pruning. This flag is optional but strongly encouraged.
- `--all`: use instead of `--selector/-l` to explicitly select all previously
  applied objects of the allowlisted types.
-->
要使用基於 Allowlist 的剪裁，可以添加以下標誌到你的 `kubectl apply` 調用：

- `--prune`：刪除之前應用的、不在當前調用所傳遞的集合中的對象。
- `--prune-allowlist`：一個需要考慮進行剪裁的組-版本-類別（group-version-kind, GVK）列表。
  這個標誌是可選的，但強烈建議使用，因爲它的默認值是同時作用於命名空間和集羣的部分類型列表，
  這可能會產生令人意外的結果。
- `--selector/-l`：使用標籤選擇算符以約束要剪裁的對象的集合。此標誌是可選的，但強烈建議使用。
- `--all`：用於替代 `--selector/-l` 以顯式選擇之前應用的類型爲 Allowlist 的所有對象。

<!--
Allowlist-based pruning queries the API server for all objects of the allowlisted GVKs that match the given labels (if any), and attempts to match the returned live object configurations against the object
manifest files. If an object matches the query, and it does not have a
manifest in the directory, and it has a `kubectl.kubernetes.io/last-applied-configuration` annotation,
it is deleted.
-->
基於 Allowlist 的剪裁會查詢 API 服務器以獲取與給定標籤（如果有）匹配的所有允許列出的 GVK 對象，
並嘗試將返回的活動對象配置與對象清單文件進行匹配。如果一個對象與查詢匹配，並且它在目錄中沒有對應的清單，
但它有一個 `kubectl.kubernetes.io/last-applied-configuration` 註解，則它將被刪除。

<!--
```shell
kubectl apply -f <directory> --prune -l <labels> --prune-allowlist=<gvk-list>
```
-->
```shell
kubectl apply -f <目錄> --prune -l <標籤> --prune-allowlist=<gvk 列表>
```

{{< warning >}}
<!--
Apply with prune should only be run against the root directory
containing the object manifests. Running against sub-directories
can cause objects to be unintentionally deleted if they were previously applied, 
have the labels given (if any), and do not appear in the subdirectory.
-->
帶剪裁（prune）行爲的 `apply` 操作應在包含對象清單的根目錄運行。
如果對象之前被執行了 `apply` 操作，具有給定的標籤（如果有）且未出現在子目錄中，
在其子目錄中運行可能導致對象被不小心刪除。
{{< /warning >}}

{{% /tab %}}

{{% tab name="Apply set" %}}

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

{{< caution >}}
<!--
`kubectl apply --prune --applyset` is in alpha, and backwards incompatible
changes might be introduced in subsequent releases.
-->
`kubectl apply --prune --applyset` 目前處於 Alpha 階段，在後續的版本中可能引入向後不兼容的變更。
{{< /caution >}}

<!--
To use ApplySet-based pruning, set the `KUBECTL_APPLYSET=true` environment variable,
and add the following flags to your `kubectl apply` invocation:
- `--prune`: Delete previously applied objects that are not in the set passed
  to the current invocation.
- `--applyset`: The name of an object that kubectl can use to accurately and
  efficiently track set membership across `apply` operations.
-->
要使用基於 ApplySet 的剪裁，請設置 `KUBECTL_APPLYSET=true` 環境變量，
並添加以下標誌到你的 `kubectl apply` 調用中：

- `--prune`：刪除之前應用的、不在當前調用所傳遞的集合中的對象。
- `--applyset`：是 kubectl 可以使用的對象的名稱，用於在 `apply` 操作中準確高效地跟蹤集合成員。

<!--
```shell
KUBECTL_APPLYSET=true kubectl apply -f <directory> --prune --applyset=<name>
```
-->
```shell
KUBECTL_APPLYSET=true kubectl apply -f <目錄> --prune --applyset=<名稱>
```

<!--
By default, the type of the ApplySet parent object used is a Secret. However,
ConfigMaps can also be used in the format: `--applyset=configmaps/<name>`.
When using a Secret or ConfigMap, kubectl will create the object if it does not already exist.
-->
默認情況下，所使用的 ApplySet 父對象的類別是 Secret。
不過也可以按格式 `--applyset=configmaps/<name>` 使用 ConfigMap。
使用 Secret 或 ConfigMap 時，如果對應對象尚不存在，kubectl 將創建這些對象。

<!--
It is also possible to use custom resources as ApplySet parent objects. To enable
this, label the Custom Resource Definition (CRD) that defines the resource you want
to use with the following: `applyset.kubernetes.io/is-parent-type: true`. Then, create
the object you want to use as an ApplySet parent (kubectl does not do this automatically
for custom resources). Finally, refer to that object in the applyset flag as follows:
`--applyset=<resource>.<group>/<name>` (for example, `widgets.custom.example.com/widget-name`).
-->
還可以使用自定義資源作爲 ApplySet 父對象。
要啓用此功能，請爲定義目標資源的 CRD 打上標籤：`applyset.kubernetes.io/is-parent-type: true`。
然後，創建你想要用作 ApplySet 父級的對象（kubectl 不會自動爲自定義資源執行此操作）。
最後，按以下方式在 applyset 標誌中引用該對象： `--applyset=<resource>.<group>/<name>`
（例如 `widgets.custom.example.com/widget-name`）。

<!--
With ApplySet-based pruning, kubectl adds the `applyset.kubernetes.io/part-of=<parentID>`
label to each object in the set before they are sent to the server. For performance reasons,
it also collects the list of resource types and namespaces that the set contains and adds
these in annotations on the live parent object. Finally, at the end of the apply operation,
it queries the API server for objects of those types in those namespaces
(or in the cluster scope, as applicable) that belong to the set, as defined by the
`applyset.kubernetes.io/part-of=<parentID>` label.
-->
使用基於 ApplySet 的剪裁時，kubectl 會在將集合中的對象發送到服務器之前將標籤
`applyset.kubernetes.io/part-of=<parentID>` 添加到集合中的每個對象上。
出於性能原因，它還會將該集合包含的資源類型和命名空間列表收集到當前父對象上的註解中。
最後，在 apply 操作結束時，它會在 API 服務器上查找由 `applyset.kubernetes.io/part-of=<parentID>`
標籤定義的、屬於此集合所對應命名空間（或適用的集羣作用域）中對應類型的對象。

<!--
Caveats and restrictions:

- Each object may be a member of at most one set.
- The `--namespace` flag is required when using any namespaced parent, including
  the default Secret.  This means that ApplySets spanning multiple namespaces must
  use a cluster-scoped custom resource as the parent object.
- To safely use ApplySet-based pruning with multiple directories,
  use a unique ApplySet name for each.
-->
注意事項和限制：

- 每個對象最多可以是一個集合的成員。
- 當使用任何名命名空間的父級（包括默認的 Secret）時，
  `--namespace` 標誌是必需的。這意味着跨越多個命名空間的
  ApplySet 必須使用集羣作用域的自定義資源作爲父對象。
- 要安全地在多個目錄中使用基於 ApplySet 的剪裁，請爲每個目錄使用唯一的 ApplySet 名稱。

{{% /tab %}}

{{< /tabs >}}

<!--
## How to view an object

You can use `kubectl get` with `-o yaml` to view the configuration of a live object:

```shell
kubectl get -f <filename|url> -o yaml
```
-->
## 如何查看對象  {#how-to-view-an-object}

你可以使用 `kubectl get` 並指定 `-o yaml` 選項來查看現時對象的配置：

```shell
kubectl get -f <文件名 | URL> -o yaml
```

<!--
## How apply calculates differences and merges changes
-->
## apply 操作是如何計算配置差異併合並變更的？   {#how-apply-diffs-and-merge-changes}

{{< caution >}}
<!--
A *patch* is an update operation that is scoped to specific fields of an object
instead of the entire object. This enables updating only a specific set of fields
on an object without reading the object first.
-->
**patch** 是一種更新操作，其作用域爲對象的一些特定字段而不是整個對象。
這使得你可以更新對象的特定字段集合而不必先要讀回對象。
{{< /caution >}}

<!--
When `kubectl apply` updates the live configuration for an object,
it does so by sending a patch request to the API server. The
patch defines updates scoped to specific fields of the live object
configuration. The `kubectl apply` command calculates this patch request
using the configuration file, the live configuration, and the
`last-applied-configuration` annotation stored in the live configuration.
-->
`kubectl apply` 更新對象的現時配置，它是通過向 API 服務器發送一個 patch
請求來執行更新動作的。所提交的補丁中定義了對現時對象配置中特定字段的更新。
`kubectl apply` 命令會使用當前的配置文件、現時配置以及現時配置中保存的
`last-applied-configuration` 註解內容來計算補丁更新內容。

<!--
### Merge patch calculation

The `kubectl apply` command writes the contents of the configuration file to the
`kubectl.kubernetes.io/last-applied-configuration` annotation. This
is used to identify fields that have been removed from the configuration
file and need to be cleared from the live configuration. Here are the steps used
to calculate which fields should be deleted or set:
-->
### 合併補丁計算  {#merge-patch-calculation}

`kubectl apply` 命令將配置文件的內容寫入到
`kubectl.kubernetes.io/last-applied-configuration` 註解中。
這些內容用來識別配置文件中已經移除的、因而也需要從現時配置中刪除的字段。
用來計算要刪除或設置哪些字段的步驟如下：

<!--
1. Calculate the fields to delete. These are the fields present in
   `last-applied-configuration` and missing from the configuration file.
2. Calculate the fields to add or set. These are the fields present in
   the configuration file whose values don't match the live configuration.

Here's an example. Suppose this is the configuration file for a Deployment object:
-->
1. 計算要刪除的字段，即在 `last-applied-configuration`
   中存在但在配置文件中不再存在的字段。
2. 計算要添加或設置的字段，即在配置文件中存在但其取值與現時配置不同的字段。

下面是一個例子。假定此文件是某 Deployment 對象的配置文件：

{{% code_sample file="application/update_deployment.yaml" %}}

<!--
Also, suppose this is the live configuration for the same Deployment object:
-->
同時假定同一 Deployment 對象的現時配置如下：

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # note that the annotation does not contain replicas
    # because it was not updated through apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # written by scale
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 注意註解中並不包含 replicas
    # 這是因爲更新並不是通過 kubectl apply 來執行的
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # 按規模填寫
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

<!--
Here are the merge calculations that would be performed by `kubectl apply`:

1. Calculate the fields to delete by reading values from
   `last-applied-configuration` and comparing them to values in the
   configuration file.
   Clear fields explicitly set to null in the local object configuration file
   regardless of whether they appear in the `last-applied-configuration`.
   In this example, `minReadySeconds` appears in the
   `last-applied-configuration` annotation, but does not appear in the configuration file.
   **Action:** Clear `minReadySeconds` from the live configuration.
2. Calculate the fields to set by reading values from the configuration
   file and comparing them to values in the live configuration. In this example,
   the value of `image` in the configuration file does not match
   the value in the live configuration. **Action:** Set the value of `image` in the live configuration.
3. Set the `last-applied-configuration` annotation to match the value
   of the configuration file.
4. Merge the results from 1, 2, 3 into a single patch request to the API server.

Here is the live configuration that is the result of the merge:
-->
下面是 `kubectl apply` 將執行的合併計算：

1. 通過讀取 `last-applied-configuration` 並將其與配置文件中的值相比較，
   計算要刪除的字段。
   對於本地對象配置文件中顯式設置爲空的字段，清除其在現時配置中的設置，
   無論這些字段是否出現在 `last-applied-configuration` 中。
   在此例中，`minReadySeconds` 出現在 `last-applied-configuration` 註解中，
   但並不存在於配置文件中。
   **動作：** 從現時配置中刪除 `minReadySeconds` 字段。
2. 通過讀取配置文件中的值並將其與現時配置相比較，計算要設置的字段。
   在這個例子中，配置文件中的 `image` 值與現時配置中的 `image` 不匹配。
   **動作**：設置現時配置中的 `image` 值。
3. 設置 `last-applied-configuration` 註解的內容，使之與配置文件匹配。
4. 將第 1、2、3 步驟得出的結果合併，構成向 API 服務器發送的補丁請求內容。

下面是此合併操作之後形成的現時配置：

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # The annotation contains the updated image to nginx 1.16.1,
    # but does not contain the updated replicas to 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  selector:
    matchLabels:
      # ...
      app: nginx
  replicas: 2 # Set by `kubectl scale`.  Ignored by `kubectl apply`.
  # minReadySeconds cleared by `kubectl apply`
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 註解中包含更新後的鏡像 nginx 1.16.1,
    # 但是其中並不包含更改後的 replicas 值 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  selector:
    matchLabels:
      # ...
      app: nginx
  replicas: 2 # 由 `kubectl scale` 設置，被 `kubectl apply` 命令忽略
  # minReadySeconds  此字段被 `kubectl apply` 清除
  # ...
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # 由 `kubectl apply` 設置
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

<!--
### How different types of fields are merged

How a particular field in a configuration file is merged with
the live configuration depends on the
type of the field. There are several types of fields:
-->
### 不同類型字段的合併方式

配置文件中的特定字段與現時配置合併時，合併方式取決於字段類型。
字段類型有幾種：

<!--
- *primitive*: A field of type string, integer, or boolean.
  For example, `image` and `replicas` are primitive fields. **Action:** Replace.

- *map*, also called *object*: A field of type map or a complex type that contains subfields. For example, `labels`,
  `annotations`,`spec` and `metadata` are all maps. **Action:** Merge elements or subfields.

- *list*: A field containing a list of items that can be either primitive types or maps.
  For example, `containers`, `ports`, and `args` are lists. **Action:** Varies.
-->
- **基本類型**：字段類型爲 `string`、`integer` 或 `boolean` 之一。
  例如：`image` 和 `replicas` 字段都是基本類型字段。

  **動作：** 替換。

- **map**：也稱作 *object*。類型爲 `map` 或包含子域的複雜結構。例如，`labels`、
  `annotations`、`spec` 和 `metadata` 都是 map。

  **動作：** 合併元素或子字段。

- **list**：包含元素列表的字段，其中每個元素可以是基本類型或 map。
  例如，`containers`、`ports` 和 `args` 都是 list。

  **動作：** 不一定。

<!--
When `kubectl apply` updates a map or list field, it typically does
not replace the entire field, but instead updates the individual subelements.
For instance, when merging the `spec` on a Deployment, the entire `spec` is
not replaced. Instead the subfields of `spec`, such as `replicas`, are compared
and merged.
-->
當 `kubectl apply` 更新某個 map 或 list 字段時，它通常不會替換整個字段，
而是會更新其中的各個子元素。例如，當合並 Deployment 的 `spec` 時，`kubectl`
並不會將其整個替換掉。相反，實際操作會是對 `replicas` 這類 `spec`
的子字段來執行比較和更新。

<!--
### Merging changes to primitive fields

Primitive fields are replaced or cleared.
-->
### 合併對基本類型字段的更新

基本類型字段會被替換或清除。

{{< note >}}
<!--
`-` is used for "not applicable" because the value is not used.
-->
`-` 表示的是“不適用”，因爲指定數值未被使用。
{{< /note >}}

<!--
| Field in object configuration file  | Field in live object configuration | Field in last-applied-configuration | Action                                    |
|-------------------------------------|------------------------------------|-------------------------------------|-------------------------------------------|
| Yes                                 | Yes                                | -                                   | Set live to configuration file value.  |
| Yes                                 | No                                 | -                                   | Set live to local configuration.           |
| No                                  | -                                  | Yes                                 | Clear from live configuration.            |
| No                                  | -                                  | No                                  | Do nothing. Keep live value.             |
-->
| 字段在對象配置文件中  | 字段在現時對象配置中 | 字段在 `last-applied-configuration` 中 | 動作 |
|-----------------------|----------------------|----------------------------------------|------|
| 是 | 是 | -  | 將配置文件中值設置到現時配置上。 |
| 是 | 否 | -  | 將配置文件中值設置到現時配置上。 |
| 否 | -  | 是 | 從現時配置中移除。 |
| 否 | -  | 否 | 什麼也不做。保持現時值。 |

<!--
### Merging changes to map fields

Fields that represent maps are merged by comparing each of the subfields or elements of the map:
-->
### 合併對 map 字段的變更

用來表示映射的字段在合併時會逐個子字段或元素地比較：

{{< note >}}
<!--
`-` is used for "not applicable" because the value is not used.
-->
`-` 表示的是“不適用”，因爲指定數值未被使用。
{{< /note >}}

<!--
| Key in object configuration file    | Key in live object configuration   | Field in last-applied-configuration | Action                           |
|-------------------------------------|------------------------------------|-------------------------------------|----------------------------------|
| Yes                                 | Yes                                | -                                   | Compare sub fields values.        |
| Yes                                 | No                                 | -                                   | Set live to local configuration.  |
| No                                  | -                                  | Yes                                 | Delete from live configuration.   |
| No                                  | -                                  | No                                  | Do nothing. Keep live value.     |
-->
| 鍵存在於對象配置文件中 | 鍵存在於現時對象配置中 | 鍵存在於 `last-applied-configuration` 中 | 動作 |
|------------------------|------------------------|------------------------------------------|------|
| 是 | 是 | -  | 比較子域取值。 |
| 是 | 否 | -  | 將現時配置設置爲本地配置值。 |
| 否 | -  | 是 | 從現時配置中刪除鍵。 |
| 否 | -  | 否 | 什麼也不做，保留現時值。 |

<!--
### Merging changes for fields of type list

Merging changes to a list uses one of three strategies:

* Replace the list if all its elements are primitives.
* Merge individual elements in a list of complex elements.
* Merge a list of primitive elements.

The choice of strategy is made on a per-field basis.
-->
### 合併 list 類型字段的變更

對 list 類型字段的變更合併會使用以下三種策略之一：

* 如果 list 所有元素都是基本類型則替換整個 list。
* 如果 list 中元素是複合結構則逐個元素執行合併操作。
* 合併基本類型元素構成的 list。

策略的選擇是基於各個字段做出的。

<!--
#### Replace the list if all its elements are primitives

Treat the list the same as a primitive field. Replace or delete the
entire list. This preserves ordering.
-->
#### 如果 list 中元素都是基本類型則替換整個 list

將整個 list 視爲一個基本類型字段。或者整個替換或者整個刪除。
此操作會保持 list 中元素順序不變

<!--
**Example:** Use `kubectl apply` to update the `args` field of a Container in a Pod. This sets
the value of `args` in the live configuration to the value in the configuration file.
Any `args` elements that had previously been added to the live configuration are lost.
The order of the `args` elements defined in the configuration file is
retained in the live configuration.
-->
**示例：** 使用 `kubectl apply` 來更新 Pod 中 Container 的 `args` 字段。
此操作會將現時配置中的 `args` 值設爲配置文件中的值。
所有之前添加到現時配置中的 `args` 元素都會丟失。
配置文件中的 `args` 元素的順序在被添加到現時配置中時保持不變。

<!--
```yaml
# last-applied-configuration value
    args: ["a", "b"]

# configuration file value
    args: ["a", "c"]

# live configuration
    args: ["a", "b", "d"]

# result after merge
    args: ["a", "c"]
```
-->
```yaml
# last-applied-configuration 值
    args: ["a", "b"]

# 配置文件值
    args: ["a", "c"]

# 現時配置
    args: ["a", "b", "d"]

# 合併結果
    args: ["a", "c"]
```

<!--
**Explanation:** The merge used the configuration file value as the new list value.
-->
**解釋：** 合併操作將配置文件中的值當做新的 list 值。

<!--
#### Merge individual elements of a list of complex elements:

Treat the list as a map, and treat a specific field of each element as a key.
Add, delete, or update individual elements. This does not preserve ordering.
-->
#### 如果 list 中元素爲複合類型則逐個執行合併

此操作將 list 視爲 map，並將每個元素中的特定字段當做其主鍵。
逐個元素地執行添加、刪除或更新操作。結果順序無法得到保證。

<!--
This merge strategy uses a special tag on each field called a `patchMergeKey`. The
`patchMergeKey` is defined for each field in the Kubernetes source code:
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747)
When merging a list of maps, the field specified as the `patchMergeKey` for a given element
is used like a map key for that element.

**Example:** Use `kubectl apply` to update the `containers` field of a PodSpec.
This merges the list as though it was a map where each element is keyed
by `name`.
-->
此合併策略會使用每個字段上的一個名爲 `patchMergeKey` 的特殊標籤。
Kubernetes 源代碼中爲每個字段定義了 `patchMergeKey`：
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747)。
當合並由 map 組成的 list 時，給定元素中被設置爲 `patchMergeKey`
的字段會被當做該元素的 map 鍵值來使用。

**例如：** 使用 `kubectl apply` 來更新 Pod 規約中的 `containers` 字段。
此操作會將 `containers` 列表視作一個映射來執行合併，每個元素的主鍵爲 `name`。

<!--
```yaml
# last-applied-configuration value
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a # key: nginx-helper-a; will be deleted in result
      image: helper:1.3
    - name: nginx-helper-b # key: nginx-helper-b; will be retained
      image: helper:1.3

# configuration file value
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # key: nginx-helper-c; will be added in result
      image: helper:1.3

# live configuration
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field will be retained
    - name: nginx-helper-d # key: nginx-helper-d; will be retained
      image: helper:1.3

# result after merge
    containers:
    - name: nginx
      image: nginx:1.16
      # Element nginx-helper-a was deleted
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field was retained
    - name: nginx-helper-c # Element was added
      image: helper:1.3
    - name: nginx-helper-d # Element was ignored
      image: helper:1.3
```
-->
```yaml
# last-applied-configuration 值
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a # 鍵 nginx-helper-a 會被刪除
      image: helper:1.3
    - name: nginx-helper-b # 鍵 nginx-helper-b 會被保留
      image: helper:1.3

# 配置文件值
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # 鍵 nginx-helper-c 會被添加
      image: helper:1.3

# 現時配置
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"]        # 字段會被保留
    - name: nginx-helper-d # 鍵 nginx-helper-d 會被保留
      image: helper:1.3

# 合併結果
    containers:
    - name: nginx
      image: nginx:1.16
      # 元素 nginx-helper-a 被刪除
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"]        # 字段被保留
    - name: nginx-helper-c # 新增元素
      image: helper:1.3
    - name: nginx-helper-d # 此元素被忽略（保留）
      image: helper:1.3
```

<!--
**Explanation:**

- The container named "nginx-helper-a" was deleted because no container
  named "nginx-helper-a" appeared in the configuration file.
- The container named "nginx-helper-b" retained the changes to `args`
  in the live configuration. `kubectl apply` was able to identify
  that "nginx-helper-b" in the live configuration was the same
  "nginx-helper-b" as in the configuration file, even though their fields
  had different values (no `args` in the configuration file). This is
  because the `patchMergeKey` field value (name) was identical in both.
- The container named "nginx-helper-c" was added because no container
  with that name appeared in the live configuration, but one with
  that name appeared in the configuration file.
- The container named "nginx-helper-d" was retained because
  no element with that name appeared in the last-applied-configuration.
-->
**解釋：**

- 名爲 "nginx-helper-a" 的容器被刪除，因爲配置文件中不存在同名的容器。
- 名爲 "nginx-helper-b" 的容器的現時配置中的 `args` 被保留。
  `kubectl apply` 能夠辯識出現時配置中的容器 "nginx-helper-b" 與配置文件
  中的容器 "nginx-helper-b" 相同，即使它們的字段值有些不同（配置文件中未給定
  `args` 值）。這是因爲 `patchMergeKey` 字段（name）的值在兩個版本中都一樣。
- 名爲 "nginx-helper-c" 的容器是新增的，因爲在配置文件中的這個容器尚不存在於現時配置中。
- 名爲 "nginx-helper-d" 的容器被保留下來，因爲在 last-applied-configuration
  中沒有與之同名的元素。

<!--
#### Merge a list of primitive elements

As of Kubernetes 1.5, merging lists of primitive elements is not supported.
-->
#### 合併基本類型元素 list

在 Kubernetes 1.5 中，尚不支持對由基本類型元素構成的 list 進行合併。

{{< note >}}
<!--
Which of the above strategies is chosen for a given field is controlled by
the `patchStrategy` tag in [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748)
If no `patchStrategy` is specified for a field of type list, then
the list is replaced.
-->
選擇上述哪種策略是由源碼中給定字段的 `patchStrategy` 標記來控制的：
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748)。
如果 list 類型字段未設置 `patchStrategy`，則整個 list 會被替換掉。
{{< /note >}}

{{< comment >}}
TODO(pwittrock): Uncomment this for 1.6

- Treat the list as a set of primitives.  Replace or delete individual
  elements.  Does not preserve ordering.  Does not preserve duplicates.

**Example:** Using apply to update the `finalizers` field of ObjectMeta
keeps elements added to the live configuration.  Ordering of finalizers
is lost.
{{< /comment >}}

<!--
## Default field values

The API server sets certain fields to default values in the live configuration if they are
not specified when the object is created.

Here's a configuration file for a Deployment. The file does not specify `strategy`:
-->
## 默認字段值  {#default-field-values}

API 服務器會在對象創建時其中某些字段未設置的情況下在現時配置中爲其設置默認值。

下面是一個 Deployment 的配置文件。文件未設置 `strategy`：

{{% code_sample file="application/simple_deployment.yaml" %}}

<!--
Create the object using `kubectl apply`:
-->
使用 `kubectl apply` 創建對象：

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 打印現時配置：

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

<!--
The output shows that the API server set several fields to default values in the live
configuration. These fields were not specified in the configuration file.
-->
輸出顯示 API 在現時配置中爲某些字段設置了默認值。
這些字段在配置文件中並未設置。

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1 # defaulted by apiserver
  strategy:
    rollingUpdate: # defaulted by apiserver - derived from strategy.type
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # defaulted by apiserver
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        imagePullPolicy: IfNotPresent # defaulted by apiserver
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP # defaulted by apiserver
        resources: {} # defaulted by apiserver
        terminationMessagePath: /dev/termination-log # defaulted by apiserver
      dnsPolicy: ClusterFirst # defaulted by apiserver
      restartPolicy: Always # defaulted by apiserver
      securityContext: {} # defaulted by apiserver
      terminationGracePeriodSeconds: 30 # defaulted by apiserver
# ...
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1           # API 服務器所設默認值
  strategy:
    rollingUpdate:      # API 服務器基於 strategy.type 所設默認值
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # API 服務器所設默認值
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        imagePullPolicy: IfNotPresent    # API 服務器所設默認值
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP       # API 服務器所設默認值
        resources: {}         # API 服務器所設默認值
        terminationMessagePath: /dev/termination-log    # API 服務器所設默認值
      dnsPolicy: ClusterFirst       # API 服務器所設默認值
      restartPolicy: Always         # API 服務器所設默認值
      securityContext: {}           # API 服務器所設默認值
      terminationGracePeriodSeconds: 30        # API 服務器所設默認值
# ...
```

<!--
In a patch request, defaulted fields are not re-defaulted unless they are explicitly cleared
as part of a patch request. This can cause unexpected behavior for
fields that are defaulted based
on the values of other fields. When the other fields are later changed,
the values defaulted from them will not be updated unless they are
explicitly cleared.
-->
在補丁請求中，已經設置了默認值的字段不會被重新設回其默認值，
除非在補丁請求中顯式地要求清除。對於默認值取決於其他字段的某些字段而言，
這可能會引發一些意想不到的行爲。當所依賴的其他字段後來發生改變時，
基於它們所設置的默認值只能在顯式執行清除操作時纔會被更新。

<!--
For this reason, it is recommended that certain fields defaulted
by the server are explicitly defined in the configuration file, even
if the desired values match the server defaults. This makes it
easier to recognize conflicting values that will not be re-defaulted
by the server.

**Example:**
-->
爲此，建議在配置文件中爲服務器設置默認值的字段顯式提供定義，
即使所給的定義與服務器端默認值設定相同。
這樣可以使得辯識無法被服務器重新基於默認值來設置的衝突字段變得容易。

**示例：**

<!--
```yaml
# last-applied-configuration
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# configuration file
spec:
  strategy:
    type: Recreate # updated value
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# live configuration
spec:
  strategy:
    type: RollingUpdate # defaulted value
    rollingUpdate: # defaulted value derived from type
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# result after merge - ERROR!
spec:
  strategy:
    type: Recreate # updated value: incompatible with rollingUpdate
    rollingUpdate: # defaulted value: incompatible with "type: Recreate"
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```
-->
```yaml
# last-applied-configuration
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# 配置文件
spec:
  strategy:
    type: Recreate   # 更新的值
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# 現時配置
spec:
  strategy:
    type: RollingUpdate    # 默認設置的值
    rollingUpdate:         # 基於 type 設置的默認值
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# 合併後的結果 - 出錯！
spec:
  strategy:
    type: Recreate     # 更新的值：與 rollingUpdate 不兼容
    rollingUpdate:     # 默認設置的值：與 "type: Recreate" 衝突
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

<!--
**Explanation:**

1. The user creates a Deployment without defining `strategy.type`.
2. The server defaults `strategy.type` to `RollingUpdate` and defaults the
   `strategy.rollingUpdate` values.
3. The user changes `strategy.type` to `Recreate`. The `strategy.rollingUpdate`
   values remain at their defaulted values, though the server expects them to be cleared.
   If the `strategy.rollingUpdate` values had been defined initially in the configuration file,
   it would have been more clear that they needed to be deleted.
4. Apply fails because `strategy.rollingUpdate` is not cleared. The `strategy.rollingupdate`
   field cannot be defined with a `strategy.type` of `Recreate`.
-->
**解釋：**

1. 用戶創建 Deployment，未設置 `strategy.type`。
2. 服務器爲 `strategy.type` 設置默認值 `RollingUpdate`，併爲 `strategy.rollingUpdate`
   設置默認值。
3. 用戶改變 `strategy.type` 爲 `Recreate`。字段 `strategy.rollingUpdate`
   仍會取其默認設置值，儘管服務器期望該字段被清除。
   如果 `strategy.rollingUpdate` 值最初於配置文件中定義，
   則它們需要被清除這一點就更明確一些。
4. `apply` 操作失敗，因爲 `strategy.rollingUpdate` 未被清除。
   `strategy.rollingupdate` 在 `strategy.type` 爲 `Recreate` 不可被設定。

<!--
Recommendation: These fields should be explicitly defined in the object configuration file:

- Selectors and PodTemplate labels on workloads, such as Deployment, StatefulSet, Job, DaemonSet,
  ReplicaSet, and ReplicationController
- Deployment rollout strategy
-->
建議：以下字段應該在對象配置文件中顯式定義：

- 如 Deployment、StatefulSet、Job、DaemonSet、ReplicaSet 和 ReplicationController
  這類負載的選擇算符和 `PodTemplate` 標籤
- Deployment 的上線策略

<!--
### How to clear server-defaulted fields or fields set by other writers

Fields that do not appear in the configuration file can be cleared by
setting their values to `null` and then applying the configuration file.
For fields defaulted by the server, this triggers re-defaulting
the values.
-->
### 如何清除服務器端按默認值設置的字段或者被其他寫者設置的字段

沒有出現在配置文件中的字段可以通過將其值設置爲 `null` 並應用配置文件來清除。
對於由服務器按默認值設置的字段，清除操作會觸發重新爲字段設置新的默認值。

<!--
## How to change ownership of a field between the configuration file and direct imperative writers

These are the only methods you should use to change an individual object field:

- Use `kubectl apply`.
- Write directly to the live configuration without modifying the configuration file:
for example, use `kubectl scale`.
-->
## 如何將字段的屬主在配置文件和直接指令式寫者之間切換

更改某個對象字段時，應該採用下面的方法：

- 使用 `kubectl apply`.
- 直接寫入到現時配置，但不更改配置文件本身，例如使用 `kubectl scale`。

<!--
### Changing the owner from a direct imperative writer to a configuration file

Add the field to the configuration file. For the field, discontinue direct updates to
the live configuration that do not go through `kubectl apply`.
-->
### 將屬主從直接指令式寫者更改爲配置文件

將字段添加到配置文件。針對該字段，不再直接執行對現時配置的修改。
修改均通過 `kubectl apply` 來執行。

<!--
### Changing the owner from a configuration file to a direct imperative writer

As of Kubernetes 1.5, changing ownership of a field from a configuration file to
an imperative writer requires manual steps:

- Remove the field from the configuration file.
- Remove the field from the `kubectl.kubernetes.io/last-applied-configuration` annotation on the live object.
-->
### 將屬主從配置文件改爲直接指令式寫者

在 Kubernetes 1.5 中，將字段的屬主從配置文件切換到某指令式寫者需要手動執行以下步驟：

- 從配置文件中刪除該字段；
- 將字段從現時對象的 `kubectl.kubernetes.io/last-applied-configuration`
  註解中刪除。

<!--
## Changing management methods

Kubernetes objects should be managed using only one method at a time.
Switching from one method to another is possible, but is a manual process.
-->
## 更改管理方法  {#changing-management-methods}

Kubernetes 對象在同一時刻應該只用一種方法來管理。
從一種方法切換到另一種方法是可能的，但這一切換是一個手動過程。

{{< note >}}
<!--
It is OK to use imperative deletion with declarative management.
-->
在聲明式管理方法中使用指令式命令來刪除對象是可以的。
{{< /note >}}

{{< comment >}}
TODO(pwittrock): We need to make using imperative commands with
declarative object configuration work so that it doesn't write the
fields to the annotation, and instead.  Then add this bullet point.

- using imperative commands with declarative configuration to manage where each manages different fields.
{{< /comment >}}

<!--
### Migrating from imperative command management to declarative object configuration

Migrating from imperative command management to declarative object
configuration involves several manual steps:
-->
### 從指令式命令管理切換到聲明式對象配置

從指令式命令管理切換到聲明式對象配置管理的切換包含以下幾個手動步驟：

<!--
1. Export the live object to a local configuration file:

   ```shell
   kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
   ```

1. Manually remove the `status` field from the configuration file.
-->
1. 將現時對象導出到本地配置文件：

   ```shell
   kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
   ```

2. 手動移除配置文件中的 `status` 字段。

   {{< note >}}
   <!--
   This step is optional, as `kubectl apply` does not update the status field
   even if it is present in the configuration file.
   -->
   這一步驟是可選的，因爲 `kubectl apply` 並不會更新 status 字段，
   即便配置文件中包含 status 字段。
   {{< /note >}}

<!--
1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object:

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```

1. Change processes to use `kubectl apply` for managing the object exclusively.
-->
3. 設置對象上的 `kubectl.kubernetes.io/last-applied-configuration` 註解：

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```

4. 更改過程，使用 `kubectl apply` 專門管理對象。  

{{< comment >}}
TODO(pwittrock): Why doesn't export remove the status field?  Seems like it should.
{{< /comment >}}

<!--
### Migrating from imperative object configuration to declarative object configuration

1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object:

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```

1. Change processes to use `kubectl apply` for managing the object exclusively.
-->
### 從指令式對象配置切換到聲明式對象配置

1. 在對象上設置 `kubectl.kubernetes.io/last-applied-configuration` 註解：

    ```shell
    kubectl replace --save-config -f <kind>_<name>.yaml
    ```

1. 自此排他性地使用 `kubectl apply` 來管理對象。

<!--
## Defining controller selectors and PodTemplate labels
-->
## 定義控制器選擇算符和 PodTemplate 標籤

{{< warning >}}
<!--
Updating selectors on controllers is strongly discouraged.
-->
強烈不建議更改控制器上的選擇算符。
{{< /warning >}}

<!--
The recommended approach is to define a single, immutable PodTemplate label
used only by the controller selector with no other semantic meaning.

**Example:**
-->
建議的方法是定義一個不可變更的 PodTemplate 標籤，
僅用於控制器選擇算符且不包含其他語義性的含義。

**示例：**

```yaml
selector:
  matchLabels:
      controller-selector: "apps/v1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "apps/v1/deployment/nginx"
```

## {{% heading "whatsnext" %}}

<!--
* [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
* [使用指令式命令管理 Kubernetes 對象](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [使用配置文件對 Kubernetes 對象執行指令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Kubectl 命令參考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
