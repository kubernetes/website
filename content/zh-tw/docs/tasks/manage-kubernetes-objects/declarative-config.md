---
title: 使用配置檔案對 Kubernetes 物件進行宣告式管理
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
你可以透過在一個目錄中儲存多個物件配置檔案、並使用 `kubectl apply`
來遞迴地建立和更新物件來建立、更新和刪除 Kubernetes 物件。
這種方法會保留對現有物件已作出的修改，而不會將這些更改寫回到物件配置檔案中。
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

`kubectl` 工具能夠支援三種物件管理方式：

* 指令式命令
* 指令式物件配置
* 宣告式物件配置

關於每種物件管理的優缺點的討論，可參見
[Kubernetes 物件管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)。

<!--
## Overview

Declarative object configuration requires a firm understanding of
the Kubernetes object definitions and configuration. Read and complete
the following documents if you have not already:

* [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
-->
## 概覽  {#overview}

宣告式物件管理需要使用者對 Kubernetes 物件定義和配置有比較深刻的理解。
如果你還沒有這方面的知識儲備，請先閱讀下面的文件：

* [使用指令式命令管理 Kubernetes 物件](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [使用配置檔案對 Kubernetes 物件進行指令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)

<!--
Following are definitions for terms used in this document:

- *object configuration file / configuration file*: A file that defines the
  configuration for a Kubernetes object. This topic shows how to pass configuration
  files to `kubectl apply`. Configuration files are typically stored in source control, such as Git.
- *live object configuration / live configuration*: The live configuration
  values of an object, as observed by the Kubernetes cluster. These are kept in the Kubernetes
  cluster storage, typically etcd.
- *declarative configuration writer /  declarative writer*: A person or software component
  that makes updates to a live object. The live writers referred to in this topic make changes
  to object configuration files and run `kubectl apply` to write the changes.
-->
以下是本文件中使用的術語的定義：

- *物件配置檔案/配置檔案*：一個定義 Kubernetes 物件的配置的檔案。
  本主題展示如何將配置檔案傳遞給 `kubectl apply`。
  配置檔案通常儲存於類似 Git 這種原始碼控制系統中。  
- *現時物件配置/現時配置*：由 Kubernetes 叢集所觀測到的物件的現時配置值。
  這些配置儲存在 Kubernetes 叢集儲存（通常是 etcd）中。
- *宣告式配置寫者/宣告式寫者*：負責更新現時物件的人或者軟體元件。
  本主題中的宣告式寫者負責改變物件配置檔案並執行 `kubectl apply` 命令
  以寫入變更。

<!--
## How to create objects

Use `kubectl apply` to create all objects, except those that already exist,
defined by configuration files in a specified directory:

```shell
kubectl apply -f <directory>/
```

This sets the `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
annotation on each object. The annotation contains the contents of the object
configuration file that was used to create the object.
-->
## 如何建立物件 {#how-to-create-objects}

使用 `kubectl apply` 來建立指定目錄中配置檔案所定義的所有物件，除非對應物件已經存在：

```shell
kubectl apply -f <目錄>/
```

此操作會在每個物件上設定 `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
註解。註解值中包含了用來建立物件的配置檔案的內容。

<!--
Add the `-R` flag to recursively process directories.
-->
{{< note >}}
新增 `-R` 標誌可以遞迴地處理目錄。
{{< /note >}}

<!--
Here's an example of an object configuration file:
-->
下面是一個物件配置檔案示例：

{{< codenew file="application/simple_deployment.yaml" >}}

<!--
Run `kubectl diff` to print the object that will be created:
-->
執行 `kubectl diff` 可以打印出將被建立的物件：

```shell
kubectl diff -f https://k8s.io/examples/application/simple_deployment.yaml
```

<!--
`diff` uses [server-side dry-run](/docs/reference/using-api/api-concepts/#dry-run),
which needs to be enabled on `kube-apiserver`.

Since `diff` performs a server-side apply request in dry-run mode,
it requires granting `PATCH`, `CREATE`, and `UPDATE` permissions.
See [Dry-Run Authorization](/docs/reference/using-api/api-concepts#dry-run-authorization)
for details.
-->
{{< note >}}
`diff` 使用[伺服器端試執行（Server-side Dry-run）](/zh-cn/docs/reference/using-api/api-concepts/#dry-run)
功能特性；而該功能特性需要在 `kube-apiserver` 上啟用。

由於 `diff` 操作會使用試執行模式執行伺服器端 apply 請求，因此需要為
使用者配置 `PATCH`、`CREATE` 和 `UPDATE` 操作許可權。
參閱[試執行授權](/zh-cn/docs/reference/using-api/api-concepts#dry-run-authorization)
瞭解詳情。
{{< /note >}}

<!--
Create the object using `kubectl apply`:
-->
使用 `kubectl apply` 來建立物件：

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 列印其現時配置：

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

<!--
The output shows that the `kubectl.kubernetes.io/last-applied-configuration` annotation
was written to the live configuration, and it matches the configuration file:
-->
輸出顯示註解 `kubectl.kubernetes.io/last-applied-configuration` 被寫入到
現時配置中，並且其內容與配置檔案相同：

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
kubectl diff -f <directory>/
kubectl apply -f <directory>/
```
-->
## 如何更新物件   {#how-to-update-objects}

你也可以使用 `kubectl apply` 來更新某個目錄中定義的所有物件，即使那些物件已經存在。
這一操作會隱含以下行為：

1. 在現時配置中設定配置檔案中出現的欄位；
2. 在現時配置中清除配置檔案中已刪除的欄位。

```shell
kubectl diff -f <目錄>/
kubectl apply -f <目錄>/
```

<!--
Add the `-R` flag to recursively process directories.
-->
{{< note >}}
使用 `-R` 標誌遞迴處理目錄。
{{< /note >}}

<!--
Here's an example configuration file:
-->
下面是一個配置檔案示例：

{{< codenew file="application/simple_deployment.yaml" >}}

<!--
Create the object using `kubectl apply`:
-->
使用 `kubectl apply` 來建立物件：

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

<!--
For purposes of illustration, the preceding command refers to a single
configuration file instead of a directory.
-->
{{< note >}}
出於演示的目的，上面的命令引用的是單個檔案而不是整個目錄。
{{< /note >}}

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 列印現時配置：

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

<!--
The output shows that the `kubectl.kubernetes.io/last-applied-configuration` annotation
was written to the live configuration, and it matches the configuration file:
-->
輸出顯示，註解 `kubectl.kubernetes.io/last-applied-configuration` 被寫入到
現時配置中，並且其取值與配置檔案內容相同。

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # 此為 simple_deployment.yaml 的 JSON 表示
    # 在物件建立時由 kubectl apply 命令寫入
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
透過 `kubectl scale` 命令直接更新現時配置中的 `replicas` 欄位。
這一命令沒有使用 `kubectl apply`：

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 來列印現時配置：

```shell
kubectl get deployment nginx-deployment -o yaml
```

<!--
The output shows that the `replicas` field has been set to 2, and the `last-applied-configuration`
annotation does not contain a `replicas` field:
-->
輸出顯示，`replicas` 欄位已經被設定為 2，而 `last-applied-configuration` 註解中
並不包含 `replicas` 欄位。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 注意註解中並不包含 replicas
    # 這是因為更新並不是透過 kubectl apply 來執行的
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # written by scale
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
現在更新 `simple_deployment.yaml` 配置檔案，將映象檔案從
`nginx:1.14.2` 更改為 `nginx:1.16.1`，同時刪除`minReadySeconds` 欄位：

{{< codenew file="application/update_deployment.yaml" >}}

<!--
Apply the changes made to the configuration file:
-->
應用對配置檔案所作更改：

```shell
kubectl diff -f https://k8s.io/examples/application/update_deployment.yaml
kubectl apply -f https://k8s.io/examples/application/update_deployment.yaml
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 列印現時配置：

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

* 欄位 `replicas` 保留了 `kubectl scale` 命令所設定的值：2；
  之所以該欄位被保留是因為配置檔案中並沒有設定 `replicas`。
* 欄位 `image` 的內容已經從 `nginx:1.14.2` 更改為 `nginx:1.16.1`。
* 註解 `last-applied-configuration` 內容被更改為新的映象名稱。
* 欄位 `minReadySeconds` 被移除。
* 註解 `last-applied-configuration` 中不再包含 `minReadySeconds` 欄位。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 註解中包含更新後的映象 nginx 1.16.1
    # 但是其中並不包含更改後的 replicas 值 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # 由 `kubectl scale` 設定，被 `kubectl apply` 命令忽略
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
      - image: nginx:1.16.1 # 由 `kubectl apply` 設定
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
Mixing `kubectl apply` with the imperative object configuration commands
`create` and `replace` is not supported. This is because `create`
and `replace` do not retain the `kubectl.kubernetes.io/last-applied-configuration`
that `kubectl apply` uses to compute updates.
-->
{{< warning >}}
將 `kubectl apply` 與指令式物件配置命令 `kubectl create` 或 `kubectl replace`
混合使用是不受支援的。這是因為 `create` 和 `replace` 命令都不會保留
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
## 如何刪除物件  {#how-to-delete-objects}

有兩種方法來刪除 `kubectl apply` 管理的物件。

### 建議操作：`kubectl delete -f <檔名>`

使用指令式命令來手動刪除物件是建議的方法，因為這種方法更為明確地給出了
要刪除的內容是什麼，且不容易造成使用者不小心刪除了其他物件的情況。

```shell
kubectl delete -f <檔名>
```

<!--
### Alternative: `kubectl apply -f <directory/> -prune -l your=label`

Only use this if you know what you are doing.
-->
### 替代方式：`kubectl apply -f <目錄名稱/> --prune -l your=label`

只有在充分理解此命令背後含義的情況下才建議這樣操作。

<!--
`kubectl apply -prune` is in alpha, and backwards incompatible
changes might be introduced in subsequent releases.
-->
{{< warning >}}
`kubectl apply --prune` 命令本身仍處於 Alpha 狀態，在後續釋出版本中可能會
引入一些向後不相容的變化。
{{< /warning >}}

{{< warning >}}
在使用此命令時必須小心，這樣才不會無意中刪除不想刪除的物件。
{{< /warning >}}

<!--
As an alternative to `kubectl delete`, you can use `kubectl apply` to identify objects to be deleted after their
configuration files have been removed from the directory. Apply with `-prune`
queries the API server for all objects matching a set of labels, and attempts
to match the returned live object configurations against the object
configuration files. If an object matches the query, and it does not have a
configuration file in the directory, and it has a `last-applied-configuration` annotation,
it is deleted.
-->
作為 `kubectl delete` 操作的替代方式，你可以在目錄中物件配置檔案被刪除之後，
使用 `kubectl apply` 來辯識要刪除的物件。
帶 `--prune` 標誌的 `apply` 命令會首先查詢 API 伺服器，獲得與某組標籤相匹配
的物件列表，之後將返回的現時物件配置與目錄中的物件配置檔案相比較。
如果某物件在查詢中被匹配到，但在目錄中沒有檔案與其相對應，並且其中還包含
`last-applied-configuration` 註解，則該物件會被刪除。 

```shell
kubectl apply -f <directory/> --prune -l <labels>
```

<!--
Apply with prune should only be run against the root directory
containing the object configuration files. Running against sub-directories
can cause objects to be unintentionally deleted if they are returned
by the label selector query specified with `-l <labels>` and
do not appear in the subdirectory.
-->
{{< warning >}}
帶剪裁（prune）行為的 `apply` 操作應在包含物件配置檔案的目錄的根目錄執行。
如果在其子目錄中執行，可能導致物件被不小心刪除。
因為某些物件可能與 `-l <標籤>` 的標籤選擇算符匹配，但其配置檔案不在當前
子目錄下。
{{< /warning >}}

<!--
## How to view an object

You can use `kubectl get` with `-o yaml` to view the configuration of a live object:

```shell
kubectl get -f <filename|url> -o yaml
```
-->
## 如何檢視物件  {#how-to-view-an-object}

你可以使用 `kubectl get` 並指定 `-o yaml` 選項來檢視現時物件的配置：

```shell
kubectl get -f <檔名 | URL> -o yaml
```

<!--
## How apply calculates differences and merges changes

A *patch* is an update operation that is scoped to specific fields of an object
instead of the entire object. This enables updating only a specific set of fields
on an object without reading the object first.
-->
## apply 操作是如何計算配置差異併合並變更的？

{{< caution >}}
*patch* 是一種更新操作，其作用域為物件的一些特定欄位而不是整個物件。
這使得你可以更新物件的特定欄位集合而不必先要讀回物件。
{{< /caution >}}

<!--
When `kubectl apply` updates the live configuration for an object,
it does so by sending a patch request to the API server. The
patch defines updates scoped to specific fields of the live object
configuration. The `kubectl apply` command calculates this patch request
using the configuration file, the live configuration, and the
`last-applied-configuration` annotation stored in the live configuration.
-->
`kubectl apply` 更新物件的現時配置，它是透過向 API 伺服器傳送一個 patch 請求
來執行更新動作的。
所提交的補丁中定義了對現時物件配置中特定欄位的更新。
`kubectl apply` 命令會使用當前的配置檔案、現時配置以及現時配置中儲存的
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

`kubectl apply` 命令將配置檔案的內容寫入到
`kubectl.kubernetes.io/last-applied-configuration` 註解中。
這些內容用來識別配置檔案中已經移除的、因而也需要從現時配置中刪除的欄位。
用來計算要刪除或設定哪些欄位的步驟如下：

<!--
1. Calculate the fields to delete. These are the fields present in `last-applied-configuration` and missing from the configuration file.
2. Calculate the fields to add or set. These are the fields present in the configuration file whose values don't match the live configuration.

Here's an example. Suppose this is the configuration file for a Deployment object:
-->
1. 計算要刪除的欄位，即在 `last-applied-configuration` 中存在但在
   配置檔案中不再存在的欄位。
2. 計算要新增或設定的欄位，即在配置檔案中存在但其取值與現時配置不同的欄位。

下面是一個例子。假定此檔案是某 Deployment 物件的配置檔案：

{{< codenew file="application/update_deployment.yaml" >}}

<!--
Also, suppose this is the live configuration for the same Deployment object:
-->
同時假定同一 Deployment 物件的現時配置如下：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2
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

1. 透過讀取 `last-applied-configuration` 並將其與配置檔案中的值相比較，
   計算要刪除的欄位。
   對於本地物件配置檔案中顯式設定為空的欄位，清除其在現時配置中的設定，
   無論這些欄位是否出現在 `last-applied-configuration` 中。
   在此例中，`minReadySeconds` 出現在 `last-applied-configuration` 註解中，但
   並不存在於配置檔案中。
   **動作：** 從現時配置中刪除 `minReadySeconds` 欄位。
2. 透過讀取配置檔案中的值並將其與現時配置相比較，計算要設定的欄位。
   在這個例子中，配置檔案中的 `image` 值與現時配置中的 `image` 不匹配。
   **動作**：設定現時配置中的 `image` 值。
3. 設定 `last-applied-configuration` 註解的內容，使之與配置檔案匹配。
4. 將第 1、2、3 步驟得出的結果合併，構成向 API 伺服器傳送的補丁請求內容。

下面是此合併操作之後形成的現時配置：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # 註解中包含更新後的 image，nginx 1.11.9,
    # 但不包含更新後的 replicas
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
  replicas: 2
  # minReadySeconds  此欄位被清除
  # ...
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1
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
### 不同型別欄位的合併方式

配置檔案中的特定欄位與現時配置合併時，合併方式取決於欄位型別。
欄位型別有幾種：

<!--
- *primitive*: A field of type string, integer, or boolean.
  For example, `image` and `replicas` are primitive fields. **Action:** Replace.

- *map*, also called *object*: A field of type map or a complex type that contains subfields. For example, `labels`,
  `annotations`,`spec` and `metadata` are all maps. **Action:** Merge elements or subfields.

- *list*: A field containing a list of items that can be either primitive types or maps.
  For example, `containers`, `ports`, and `args` are lists. **Action:** Varies.
-->
- *基本型別*：欄位型別為 `string`、`integer` 或 `boolean` 之一。
  例如：`image` 和 `replicas` 欄位都是基本型別欄位。

  **動作：** 替換。

- *map*：也稱作 *object*。型別為 `map` 或包含子域的複雜結構。例如，`labels`、
  `annotations`、`spec` 和 `metadata` 都是 map。

  **動作：** 合併元素或子欄位。

- *list*：包含元素列表的欄位，其中每個元素可以是基本型別或 map。
  例如，`containers`、`ports` 和 `args` 都是 list。

  **動作：** 不一定。

<!--
When `kubectl apply` updates a map or list field, it typically does
not replace the entire field, but instead updates the individual subelements.
For instance, when merging the `spec` on a Deployment, the entire `spec` is
not replaced. Instead the subfields of `spec`, such as `replicas`, are compared
and merged.
-->
當 `kubectl apply` 更新某個 map 或 list 欄位時，它通常不會替換整個欄位，而是會
更新其中的各個子元素。例如，當合並 Deployment 的 `spec` 時，`kubectl` 並不會
將其整個替換掉。相反，實際操作會是對 `replicas` 這類 `spec`
的子欄位來執行比較和更新。

<!--
### Merging changes to primitive fields

Primitive fields are replaced or cleared.
-->
### 合併對基本型別欄位的更新

基本型別欄位會被替換或清除。

<!--
`-` is used for "not applicable" because the value is not used.
-->
{{< note >}}
`-` 表示的是“不適用”，因為指定數值未被使用。
{{< /note >}}

| 欄位在物件配置檔案中  | 欄位在現時物件配置中 | 欄位在 `last-applied-configuration` 中 | 動作 |
|-----------------------|----------------------|----------------------------------------|------|
| 是 | 是 | -  | 將配置檔案中值設定到現時配置上。 |
| 是 | 否 | -  | 將配置檔案中值設定到現時配置上。 |
| 否 | -  | 是 | 從現時配置中移除。 |
| 否 | -  | 否 | 什麼也不做。保持現時值。 |

<!--
### Merging changes to map fields

Fields that represent maps are merged by comparing each of the subfields or elements of the map:
-->
### 合併對 map 欄位的變更

用來表示對映的欄位在合併時會逐個子欄位或元素地比較：

<!--
`-` is used for "not applicable" because the value is not used.
-->
{{< note >}}
`-` 表示的是“不適用”，因為指定數值未被使用。
{{< /note >}}

| 鍵存在於物件配置檔案中 | 鍵存在於現時物件配置中 | 鍵存在於 `last-applied-configuration` 中 | 動作 |
|------------------------|------------------------|------------------------------------------|------|
| 是 | 是 | -  | 比較子域取值。 |
| 是 | 否 | -  | 將現時配置設定為本地配置值。 |
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
### 合併 list 型別欄位的變更

對 list 型別欄位的變更合併會使用以下三種策略之一：

* 如果 list 所有元素都是基本型別則替換整個 list。
* 如果 list 中元素是複合結構則逐個元素執行合併操作。
* 合併基本型別元素構成的 list。

策略的選擇是基於各個欄位做出的。

<!--
#### Replace the list if all its elements are primitives

Treat the list the same as a primitive field. Replace or delete the
entire list. This preserves ordering.
-->
#### 如果 list 中元素都是基本型別則替換整個 list

將整個 list 視為一個基本型別欄位。或者整個替換或者整個刪除。
此操作會保持 list 中元素順序不變

<!--
**Example:** Use `kubectl apply` to update the `args` field of a Container in a Pod. This sets
the value of `args` in the live configuration to the value in the configuration file.
Any `args` elements that had previously been added to the live configuration are lost.
The order of the `args` elements defined in the configuration file is
retained in the live configuration.
-->
**示例：** 使用 `kubectl apply` 來更新 Pod 中 Container 的 `args` 欄位。此操作會
將現時配置中的 `args` 值設為配置檔案中的值。
所有之前新增到現時配置中的 `args` 元素都會丟失。
配置檔案中的 `args` 元素的順序在被新增到現時配置中時保持不變。

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

# 配置檔案值
    args: ["a", "c"]

# 現時配置
    args: ["a", "b", "d"]

# 合併結果
    args: ["a", "c"]
```

<!--
**Explanation:** The merge used the configuration file value as the new list value.
-->
**解釋：** 合併操作將配置檔案中的值當做新的 list 值。

<!--
#### Merge individual elements of a list of complex elements:

Treat the list as a map, and treat a specific field of each element as a key.
Add, delete, or update individual elements. This does not preserve ordering.
-->
#### 如果 list 中元素為複合型別則逐個執行合併

此操作將 list 視為 map，並將每個元素中的特定欄位當做其主鍵。
逐個元素地執行新增、刪除或更新操作。結果順序無法得到保證。

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
此合併策略會使用每個欄位上的一個名為 `patchMergeKey` 的特殊標籤。
Kubernetes 原始碼中為每個欄位定義了 `patchMergeKey`：
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747)
當合並由 map 組成的 list 時，給定元素中被設定為 `patchMergeKey` 的欄位會被
當做該元素的 map 鍵值來使用。

**例如：** 使用 `kubectl apply` 來更新 Pod 規約中的 `containers` 欄位。
此操作會將 `containers` 列表視作一個對映來執行合併，每個元素的主鍵為 `name`。

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

# 配置檔案值
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # 鍵 nginx-helper-c 會被新增
      image: helper:1.3

# 現時配置
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"]        # 欄位會被保留
    - name: nginx-helper-d # 鍵 nginx-helper-d 會被保留
      image: helper:1.3

# 合併結果
    containers:
    - name: nginx
      image: nginx:1.16
      # 元素 nginx-helper-a 被刪除
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"]        # 欄位被保留
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

- 名為 "nginx-helper-a" 的容器被刪除，因為配置檔案中不存在同名的容器。
- 名為 "nginx-helper-b" 的容器的現時配置中的 `args` 被保留。
  `kubectl apply` 能夠辯識出現時配置中的容器 "nginx-helper-b" 與配置檔案
  中的容器 "nginx-helper-b" 相同，即使它們的欄位值有些不同（配置檔案中未給定
  `args` 值）。這是因為 `patchMergeKey` 欄位（name）的值在兩個版本中都一樣。
- 名為 "nginx-helper-c" 的容器是新增的，因為在配置檔案中的這個容器尚不存在
  於現時配置中。
- 名為 "nginx-helper-d" 的容器被保留下來，因為在 last-applied-configuration
  中沒有與之同名的元素。

<!--
#### Merge a list of primitive elements

As of Kubernetes 1.5, merging lists of primitive elements is not supported.
-->
#### 合併基本型別元素 list

在 Kubernetes 1.5 中，尚不支援對由基本型別元素構成的 list 進行合併。

<!--
Which of the above strategies is chosen for a given field is controlled by
the `patchStrategy` tag in [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748)
If no `patchStrategy` is specified for a field of type list, then
the list is replaced.
-->
{{< note >}}
選擇上述哪種策略是由原始碼中給定欄位的 `patchStrategy` 標記來控制的： 
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748)
如果 list 型別欄位未設定 `patchStrategy`，則整個 list 會被替換掉。
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
## 預設欄位值  {#default-field-values}

API 伺服器會在物件建立時其中某些欄位未設定的情況下在現時配置中為其設定預設值。

下面是一個 Deployment 的配置檔案。檔案未設定 `strategy`：

{{< codenew file="application/simple_deployment.yaml" >}}

<!--
Create the object using `kubectl apply`:
-->
使用 `kubectl apply` 建立物件：

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

<!--
Print the live configuration using `kubectl get`:
-->
使用 `kubectl get` 列印現時配置：

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

<!--
The output shows that the API server set several fields to default values in the live
configuration. These fields were not specified in the configuration file.
-->
輸出顯示 API 在現時配置中為某些欄位設定了預設值。
這些欄位在配置檔案中並未設定。

```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1           # API 伺服器所設預設值
  strategy:
    rollingUpdate:      # API 伺服器基於 strategy.type 所設預設值
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # API 伺服器所設預設值
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        imagePullPolicy: IfNotPresent    # API 伺服器所設預設值
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP       # API 伺服器所設預設值
        resources: {}         # API 伺服器所設預設值
        terminationMessagePath: /dev/termination-log    # API 伺服器所設預設值
      dnsPolicy: ClusterFirst       # API 伺服器所設預設值
      restartPolicy: Always         # API 伺服器所設預設值
      securityContext: {}           # API 伺服器所設預設值
      terminationGracePeriodSeconds: 30        # API 伺服器所設預設值
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
在補丁請求中，已經設定了預設值的欄位不會被重新設回其預設值，除非
在補丁請求中顯式地要求清除。對於預設值取決於其他欄位的某些欄位而言，
這可能會引發一些意想不到的行為。當所依賴的其他欄位後來發生改變時，
基於它們所設定的預設值只能在顯式執行清除操作時才會被更新。

<!--
For this reason, it is recommended that certain fields defaulted
by the server are explicitly defined in the configuration file, even
if the desired values match the server defaults. This makes it
easier to recognize conflicting values that will not be re-defaulted
by the server.

**Example:**
-->
為此，建議在配置檔案中為伺服器設定預設值的欄位顯式提供定義，即使所
給的定義與伺服器端預設值設定相同。這樣可以使得辯識無法被伺服器重新
基於預設值來設定的衝突欄位變得容易。

**示例：**

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

# 配置檔案
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
    type: RollingUpdate    # 預設設定的值
    rollingUpdate:         # 基於 type 設定的預設值
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
    type: Recreate     # 更新的值：與 rollingUpdate 不相容
    rollingUpdate:     # 預設設定的值：與 "type: Recreate" 衝突
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

1. 使用者建立 Deployment，未設定 `strategy.type`。
2. 伺服器為 `strategy.type` 設定預設值 `RollingUpdate`，併為 `strategy.rollingUpdate`
   設定預設值。
3. 使用者改變 `strategy.type` 為 `Recreate`。欄位 `strategy.rollingUpdate` 仍會取其
   預設設定值，儘管伺服器期望該欄位被清除。
   如果 `strategy.rollingUpdate` 值最初於配置檔案中定義，則它們需要被清除
   這一點就更明確一些。
4. `apply` 操作失敗，因為 `strategy.rollingUpdate` 未被清除。
   `strategy.rollingupdate` 在 `strategy.type` 為 `Recreate` 不可被設定。

<!--
Recommendation: These fields should be explicitly defined in the object configuration file:

- Selectors and PodTemplate labels on workloads, such as Deployment, StatefulSet, Job, DaemonSet,
  ReplicaSet, and ReplicationController
- Deployment rollout strategy
-->
建議：以下欄位應該在物件配置檔案中顯式定義：

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
### 如何清除伺服器端按預設值設定的欄位或者被其他寫者設定的欄位

沒有出現在配置檔案中的欄位可以透過將其值設定為 `null` 並應用配置檔案來清除。
對於由伺服器按預設值設定的欄位，清除操作會觸發重新為欄位設定新的預設值。

<!--
## How to change ownership of a field between the configuration file and direct imperative writers

These are the only methods you should use to change an individual object field:

- Use `kubectl apply`.
- Write directly to the live configuration without modifying the configuration file:
for example, use `kubectl scale`.
-->
## 如何將欄位的屬主在配置檔案和直接指令式寫者之間切換

更改某個物件欄位時，應該採用下面的方法：

- 使用 `kubectl apply`.
- 直接寫入到現時配置，但不更改配置檔案本身，例如使用 `kubectl scale`。

<!--
### Changing the owner from a direct imperative writer to a configuration file

Add the field to the configuration file. For the field, discontinue direct updates to
the live configuration that do not go through `kubectl apply`.
-->
### 將屬主從直接指令式寫者更改為配置檔案

將欄位新增到配置檔案。針對該欄位，不再直接執行對現時配置的修改。
修改均透過 `kubectl apply` 來執行。

<!--
### Changing the owner from a configuration file to a direct imperative writer

As of Kubernetes 1.5, changing ownership of a field from a configuration file to
an imperative writer requires manual steps:

- Remove the field from the configuration file.
- Remove the field from the `kubectl.kubernetes.io/last-applied-configuration` annotation on the live object.
-->
### 將屬主從配置檔案改為直接指令式寫者

在 Kubernetes 1.5 中，將欄位的屬主從配置檔案切換到某指令式寫者需要手動
執行以下步驟：

- 從配置檔案中刪除該欄位；
- 將欄位從現時物件的 `kubectl.kubernetes.io/last-applied-configuration` 註解
  中刪除。

<!--
## Changing management methods

Kubernetes objects should be managed using only one method at a time.
Switching from one method to another is possible, but is a manual process.
-->
## 更改管理方法  {#changing-management-methods} 

Kubernetes 物件在同一時刻應該只用一種方法來管理。
從一種方法切換到另一種方法是可能的，但這一切換是一個手動過程。

<!--
It is OK to use imperative deletion with declarative management.
-->
{{< note >}}
在宣告式管理方法中使用指令式命令來刪除物件是可以的。
{{< /note >}}

<!--
### Migrating from imperative command management to declarative object configuration

Migrating from imperative command management to declarative object
configuration involves several manual steps:
-->
### 從指令式命令管理切換到宣告式物件配置

從指令式命令管理切換到宣告式物件配置管理的切換包含以下幾個手動步驟：
<!--
1. Export the live object to a local configuration file:

     ```shell
     kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
     ```

1. Manually remove the `status` field from the configuration file.

    {{< note >}}
    This step is optional, as `kubectl apply` does not update the status field
    even if it is present in the configuration file.
    {{< /note >}}

1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object:

    ```shell
    kubectl replace -save-config -f <kind>_<name>.yaml
    ```

1. Change processes to use `kubectl apply` for managing the object exclusively.
-->
1. 將現時物件匯出到本地配置檔案：

   ```shell
   kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
   ```

1. 手動移除配置檔案中的 `status` 欄位。

   <!--
   This step is optional, as `kubectl apply` does not update the status field
   even if it is present in the configuration file.
   -->
   {{< note >}}
   這一步驟是可選的，因為 `kubectl apply` 並不會更新 status 欄位，即便
   配置檔案中包含 status 欄位。
   {{< /note >}}

1. 設定物件上的 `kubectl.kubernetes.io/last-applied-configuration` 註解：

   ```shell
   kubectl replace --save-config -f <kind>_<name>.yaml
   ```
1. 更改過程，使用 `kubectl apply` 專門管理物件。  

<!--
### Migrating from imperative object configuration to declarative object configuration

1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object:

    ```shell
    kubectl replace -save-config -f <kind>_<name>.yaml
    ```

1. Change processes to use `kubectl apply` for managing the object exclusively.
-->
### 從指令式物件配置切換到宣告式物件配置

1. 在物件上設定 `kubectl.kubernetes.io/last-applied-configuration` 註解： 

    ```shell
    kubectl replace -save-config -f <kind>_<name>.yaml
    ```

1. 自此排他性地使用 `kubectl apply` 來管理物件。

<!--
## Defining controller selectors and PodTemplate labels
-->
## 定義控制器選擇算符和 PodTemplate 標籤

<!--
Updating selectors on controllers is strongly discouraged.
-->
{{< warning >}}
強烈不建議更改控制器上的選擇算符。
{{< /warning >}}

<!--
The recommended approach is to define a single, immutable PodTemplate label
used only by the controller selector with no other semantic meaning.

**Example:**
-->
建議的方法是定義一個不可變更的 PodTemplate 標籤，僅用於控制器選擇算符且
不包含其他語義性的含義。

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
* [使用指令式命令管理 Kubernetes 物件](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [使用配置檔案對 Kubernetes 物件執行指令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Kubectl 命令參考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

