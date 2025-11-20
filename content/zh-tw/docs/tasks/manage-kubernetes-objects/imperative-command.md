---
title: 使用指令式命令管理 Kubernetes 對象
content_type: task
weight: 30
---
<!--
title: Managing Kubernetes Objects Using Imperative Commands
content_type: task
weight: 30
-->

<!-- overview -->

<!--
Kubernetes objects can quickly be created, updated, and deleted directly using
imperative commands built into the `kubectl` command-line tool. This document
explains how those commands are organized and how to use them to manage live objects.
-->
使用構建在 `kubectl` 命令列工具中的指令式命令可以直接快速創建、更新和刪除
Kubernetes 對象。本文檔解釋這些命令的組織方式以及如何使用它們來管理活躍對象。

## {{% heading "prerequisites" %}}

<!--
Install [`kubectl`](/docs/tasks/tools/).
-->
安裝[`kubectl`](/zh-cn/docs/tasks/tools/)。

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
* 指令式對象設定
* 聲明式對象設定

關於每種對象管理的優缺點的討論，可參見
[Kubernetes 對象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)。

<!--
## How to create objects

The `kubectl` tool supports verb-driven commands for creating some of the most common
object types. The commands are named to be recognizable to users unfamiliar with
the Kubernetes object types.

- `run`: Create a new Pod to run a Container.
- `expose`: Create a new Service object to load balance traffic across Pods.
- `autoscale`: Create a new Autoscaler object to automatically horizontally scale a controller, such as a Deployment.
-->
## 如何創建對象  {#how-to-create-objects}

`kubectl` 工具支持動詞驅動的命令，用來創建一些最常見的對象類別。
命令的名稱設計使得不熟悉 Kubernetes 對象類型的使用者也能做出判斷。

- `run`：創建一個新的 Pod 來運行一個容器。
- `expose`：創建一個新的 Service 對象爲若干 Pod 提供流量負載均衡。
- `autoscale`：創建一個新的 Autoscaler 對象來自動對某控制器（例如：Deployment）
  執行水平擴縮。

<!--
The `kubectl` tool also supports creation commands driven by object type.
These commands support more object types and are more explicit about
their intent, but require users to know the type of objects they intend
to create.

- `create <objecttype> [<subtype>] <instancename>`
-->
`kubectl` 命令也支持一些對象類型驅動的創建命令。
這些命令可以支持更多的對象類別，並且在其動機上體現得更爲明顯，
不過要求使用者瞭解它們所要創建的對象的類別。

- `create <對象類別> [<子類別>] <實例名稱>`

<!--
Some objects types have subtypes that you can specify in the `create` command.
For example, the Service object has several subtypes including ClusterIP,
LoadBalancer, and NodePort. Here's an example that creates a Service with
subtype NodePort:

```shell
kubectl create service nodeport <myservicename>
```
-->
某些對象類別擁有自己的子類別，可以在 `create` 命令中設置。
例如，Service 對象有 ClusterIP、LoadBalancer 和 NodePort 三種子類別。
下面是一個創建 NodePort 子類別的 Service 的示例：

```shell
kubectl create service nodeport <服務名稱>
```

<!--
In the preceding example, the `create service nodeport` command is called
a subcommand of the `create service` command.

You can use the `-h` flag to find the arguments and flags supported by
a subcommand:
-->
在前述示例中，`create service nodeport` 命令也稱作 `create service`
命令的子命令。
可以使用 `-h` 標誌找到一個子命令所支持的參數和標誌。

```shell
kubectl create service nodeport -h
```

<!--
## How to update objects

The `kubectl` command supports verb-driven commands for some common update operations.
These commands are named to enable users unfamiliar with Kubernetes
objects to perform updates without knowing the specific fields
that must be set:

- `scale`: Horizontally scale a controller to add or remove Pods by updating the replica count of the controller.
- `annotate`: Add or remove an annotation from an object.
- `label`: Add or remove a label from an object.
-->
## 如何更新對象  {#how-to-update-objects}

`kubectl` 命令也支持一些動詞驅動的命令，用來執行一些常見的更新操作。
這些命令的設計是爲了讓一些不瞭解 Kubernetes 對象的使用者也能執行更新操作，
但不需要了解哪些字段必須設置：

- `scale`：對某控制器進行水平擴縮以便通過更新控制器的副本個數來添加或刪除 Pod。
- `annotate`：爲對象添加或刪除註解。
- `label`：爲對象添加或刪除標籤。

<!--
The `kubectl` command also supports update commands driven by an aspect of the object.
Setting this aspect may set different fields for different object types:

- `set` `<field>`: Set an aspect of an object.
-->
`kubectl` 命令也支持由對象的某一方面來驅動的更新命令。
設置對象的這一方面可能對不同類別的對象意味着不同的字段：

- `set <字段>`：設置對象的某一方面。

{{< note >}}
<!--
In Kubernetes version 1.5, not every verb-driven command has an associated aspect-driven command.
-->
在 Kubernetes 1.5 版本中，並非所有動詞驅動的命令都有對應的方面驅動的命令。
{{< /note >}}

<!--
The `kubectl` tool supports these additional ways to update a live object directly,
however they require a better understanding of the Kubernetes object schema.

- `edit`: Directly edit the raw configuration of a live object by opening its configuration in an editor.
- `patch`: Directly modify specific fields of a live object by using a patch string.
For more details on patch strings, see the patch section in
[API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#patch-operations).
-->
`kubectl` 工具支持以下額外的方式用來直接更新活躍對象，不過這些操作要求
使用者對 Kubernetes 對象的模式定義有很好的瞭解：

- `edit`：通過在編輯器中打開活躍對象的設定，直接編輯其原始設定。
- `patch`：通過使用補丁字符串（Patch String）直接更改某活躍對象的特定字段。
  關於補丁字符串的更詳細資訊，參見
  [API 約定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#patch-operations)
  的 patch 節。

<!--
## How to delete objects

You can use the `delete` command to delete an object from a cluster:

- `delete <type>/<name>`
-->
## 如何刪除對象  {#how-to-delete-objects}

你可以使用 `delete` 命令從叢集中刪除一個對象：

- `delete <類別>/<名稱>`

{{< note >}}
<!--
You can use `kubectl delete` for both imperative commands and imperative object
configuration. The difference is in the arguments passed to the command. To use
`kubectl delete` as an imperative command, pass the object to be deleted as
an argument. Here's an example that passes a Deployment object named nginx:
-->
你可以使用 `kubectl delete` 來執行指令式命令或者指令式對象設定。不同之處在於傳遞給命令的參數。
要將 `kubectl delete` 作爲指令式命令使用，將要刪除的對象作爲參數傳遞給它。
下面是一個刪除名爲 `nginx` 的 Deployment 對象的命令：
{{< /note >}}

```shell
kubectl delete deployment/nginx
```

<!--
## How to view an object
-->
## 如何查看對象  {#how-to-view-an-object}

{{< comment >}}
<!---
TODO(pwittrock): Uncomment this when implemented.

You can use `kubectl view` to print specific fields of an object.

- `view`: Prints the value of a specific field of an object.
-->
你可以使用 `kubectl view` 打印對象的特定字段。

- `view`：打印對象的特定字段的值。

{{< /comment >}}

<!--
There are several commands for printing information about an object:

- `get`: Prints basic information about matching objects.  Use `get -h` to see a list of options.
- `describe`: Prints aggregated detailed information about matching objects.
- `logs`: Prints the stdout and stderr for a container running in a Pod.
-->
用來打印對象資訊的命令有好幾個：

- `get`：打印匹配到的對象的基本資訊。使用 `get -h` 可以查看選項列表。
- `describe`：打印匹配到的對象的詳細資訊的彙集版本。
- `logs`：打印 Pod 中運行的容器的 stdout 和 stderr 輸出。

<!--
## Using `set` commands to modify objects before creation

There are some object fields that don't have a flag you can use
in a `create` command. In some of those cases, you can use a combination of
`set` and `create` to specify a value for the field before object
creation. This is done by piping the output of the `create` command to the
`set` command, and then back to the `create` command. Here's an example:
-->
## 使用 `set` 命令在創建對象之前修改對象  {#using-set-commands-to-modify-objects-before-creation}

有些對象字段在 `create` 命令中沒有對應的標誌。
在這些場景中，你可以使用 `set` 和 `create` 命令的組合來在對象創建之前設置字段值。
這是通過將 `create` 命令的輸出用管道方式傳遞給 `set` 命令來實現的，最後執行 `create` 命令來創建對象。
下面是一個例子：

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

<!--
1. The `kubectl create service -o yaml --dry-run=client` command creates the configuration for the Service, but prints it to stdout as YAML instead of sending it to the Kubernetes API server.
1. The `kubectl set selector --local -f - -o yaml` command reads the configuration from stdin, and writes the updated configuration to stdout as YAML.
1. The `kubectl create -f -` command creates the object using the configuration provided via stdin.
-->
1. 命令 `kubectl create service -o yaml --dry-run=client` 創建 Service 的設定，
   但將其以 YAML 格式在標準輸出上打印而不是發送給 API 伺服器。
1. 命令 `kubectl set selector --local -f - -o yaml` 從標準輸入讀入設定，
   並將更新後的設定以 YAML 格式輸出到標準輸出。
1. 命令 `kubectl create -f -` 使用標準輸入上獲得的設定創建對象。

<!--
## Using `--edit` to modify objects before creation

You can use `kubectl create --edit` to make arbitrary changes to an object
before it is created. Here's an example:
-->
## 在創建之前使用 `--edit` 更改對象 {#using-edit-to-modify-objects-before-creation}

你可以用 `kubectl create --edit` 來在對象被創建之前執行任意的變更。
下面是一個例子：

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```

<!--
1. The `kubectl create service` command creates the configuration for the Service and saves it to `/tmp/srv.yaml`.
1. The `kubectl create --edit` command opens the configuration file for editing before it creates the object.
-->
1. 命令 `kubectl create service` 創建 Service 的設定並將其保存到 `/tmp/srv.yaml` 檔案。
1. 命令 `kubectl create --edit` 在創建 Service 對象打開其設定檔案進行編輯。

## {{% heading "whatsnext" %}}

<!--
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
* [使用設定檔案對 Kubernetes 對象進行命令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [使用設定檔案對 Kubernetes 對象進行聲明式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl 命令參考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
