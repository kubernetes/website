---
title: 使用指令式命令管理 Kubernetes 物件
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
使用構建在 `kubectl` 命令列工具中的指令式命令可以直接快速建立、更新和刪除
Kubernetes 物件。本文件解釋這些命令的組織方式以及如何使用它們來管理現時物件。

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

`kubectl` 工具能夠支援三種物件管理方式：

* 指令式命令
* 指令式物件配置
* 宣告式物件配置

關於每種物件管理的優缺點的討論，可參見
[Kubernetes 物件管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)。

<!--
## How to create objects

The `kubectl` tool supports verb-driven commands for creating some of the most common
object types. The commands are named to be recognizable to users unfamiliar with
the Kubernetes object types.

- `run`: Create a new Pod to run a Container.
- `expose`: Create a new Service object to load balance traffic across Pods.
- `autoscale`: Create a new Autoscaler object to automatically horizontally scale a controller, such as a Deployment.
-->
## 如何建立物件  {#how-to-create-objects}

`kubectl` 工具支援動詞驅動的命令，用來建立一些最常見的物件類別。
命令的名稱設計使得不熟悉 Kubernetes 物件型別的使用者也能做出判斷。

- `run`：建立一個新的 Pod 來執行一個容器。
- `expose`：建立一個新的 Service 物件為若干 Pod 提供流量負載均衡。
- `autoscale`：建立一個新的 Autoscaler 物件來自動對某控制器（如 Deployment）
  執行水平擴縮。

<!--
The `kubectl` tool also supports creation commands driven by object type.
These commands support more object types and are more explicit about
their intent, but require users to know the type of objects they intend
to create.

- `create <objecttype> [<subtype>] <instancename>`
-->
`kubectl` 命令也支援一些物件型別驅動的建立命令。
這些命令可以支援更多的物件類別，並且在其動機上體現得更為明顯，不過要求
使用者瞭解它們所要建立的物件的類別。

- `create <物件類別> [<子類別>] <例項名稱>`

<!--
Some objects types have subtypes that you can specify in the `create` command.
For example, the Service object has several subtypes including ClusterIP,
LoadBalancer, and NodePort. Here's an example that creates a Service with
subtype NodePort:

```shell
kubectl create service nodeport <myservicename>
```
-->
某些物件類別擁有自己的子類別，可以在 `create` 命令中設定。
例如，Service 物件有 ClusterIP、LoadBalancer 和 NodePort 三種子類別。
下面是一個建立 NodePort 子類別的 Service 的示例：

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
可以使用 `-h` 標誌找到一個子命令所支援的引數和標誌。

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
## 如何更新物件  {#how-to-update-objects}

`kubectl` 命令也支援一些動詞驅動的命令，用來執行一些常見的更新操作。
這些命令的設計是為了讓一些不瞭解 Kubernetes 物件的使用者也能執行更新操作，
但不需要了解哪些欄位必須設定：

- `scale`：對某控制器進行水平擴縮以便透過更新控制器的副本個數來新增或刪除 Pod。
- `annotate`：為物件新增或刪除註解。
- `label`：為物件新增或刪除標籤。

<!--
The `kubectl` command also supports update commands driven by an aspect of the object.
Setting this aspect may set different fields for different object types:

- `set` `<field>`: Set an aspect of an object.
-->
`kubectl` 命令也支援由物件的某一方面來驅動的更新命令。
設定物件的這一方面可能對不同類別的物件意味著不同的欄位：

- `set <欄位>`：設定物件的某一方面。

<!--
In Kubernetes version 1.5, not every verb-driven command has an associated aspect-driven command.
-->
{{< note >}}
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
`kubectl` 工具支援以下額外的方式用來直接更新現時物件，不過這些操作要求
使用者對 Kubernetes 物件的模式定義有很好的瞭解：

- `edit`：透過在編輯器中開啟現時物件的配置，直接編輯其原始配置。
- `patch`：透過使用補丁字串（Patch String）直接更改某現時物件的的特定欄位。
  關於補丁字串的更詳細資訊，參見
  [API 約定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#patch-operations)
  的 patch 節。

<!--
## How to delete objects

You can use the `delete` command to delete an object from a cluster:

- `delete <type>/<name>`
-->
## 如何刪除物件  {#how-to-delete-objects}

你可以使用 `delete` 命令從叢集中刪除一個物件：

- `delete <類別>/<名稱>`

<!--
You can use `kubectl delete` for both imperative commands and imperative object
configuration. The difference is in the arguments passed to the command. To use
`kubectl delete` as an imperative command, pass the object to be deleted as
an argument. Here's an example that passes a Deployment object named nginx:
-->
你可以使用 `kubectl delete` 來執行指令式命令或者指令式物件配置。不同之處在於
傳遞給命令的引數。要將 `kubectl delete` 作為指令式命令使用，將要刪除的物件作為
引數傳遞給它。下面是一個刪除名為 `nginx` 的 Deployment 物件的命令：

```shell
kubectl delete deployment/nginx
```

<!--
## How to view an object

{{< comment >}}
TODO(pwittrock): Uncomment this when implemented.

You can use `kubectl view` to print specific fields of an object.

- `view`: Prints the value of a specific field of an object.

{{< /comment >}}
-->
## 如何檢視物件  {#how-to-view-an-object}

用來列印物件資訊的命令有好幾個：

- `get`：列印匹配到的物件的基本資訊。使用 `get -h` 可以檢視選項列表。
- `describe`：列印匹配到的物件的詳細資訊的彙集版本。
- `logs`：列印 Pod 中執行的容器的 stdout 和 stderr 輸出。

<!--
## Using `set` commands to modify objects before creation

There are some object fields that don't have a flag you can use
in a `create` command. In some of those cases, you can use a combination of
`set` and `create` to specify a value for the field before object
creation. This is done by piping the output of the `create` command to the
`set` command, and then back to the `create` command. Here's an example:
-->
## 使用 `set` 命令在建立物件之前修改物件

有些物件欄位在 `create` 命令中沒有對應的標誌。在這些場景中，
你可以使用 `set` 和 `create` 命令的組合來在物件建立之前設定欄位值。
這是透過將 `create` 命令的輸出用管道方式傳遞給 `set` 命令來實現的，
最後執行 `create` 命令來建立物件。下面是一個例子：

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

<!--
1. The `kubectl create service -o yaml --dry-run=client` command creates the configuration for the Service, but prints it to stdout as YAML instead of sending it to the Kubernetes API server.
1. The `kubectl set selector --local -f - -o yaml` command reads the configuration from stdin, and writes the updated configuration to stdout as YAML.
1. The `kubectl create -f -` command creates the object using the configuration provided via stdin.
-->
1. 命令 `kubectl create service -o yaml --dry-run=client` 建立 Service 的配置，但
   將其以 YAML 格式在標準輸出上列印而不是傳送給 API 伺服器。
1. 命令 `kubectl set selector --local -f - -o yaml` 從標準輸入讀入配置，並將更新後的
   配置以 YAML 格式輸出到標準輸出。
1. 命令 `kubectl create -f -` 使用標準輸入上獲得的配置建立物件。

<!--
## Using `--edit` to modify objects before creation

You can use `kubectl create --edit` to make arbitrary changes to an object
before it is created. Here's an example:
-->
## 在建立之前使用 `--edit` 更改物件

你可以用 `kubectl create --edit` 來在物件被建立之前執行任意的變更。
下面是一個例子：

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```

<!--
1. The `kubectl create service` command creates the configuration for the Service and saves it to `/tmp/srv.yaml`.
1. The `kubectl create --edit` command opens the configuration file for editing before it creates the object.
-->
1. 命令 `kubectl create service` 建立 Service 的配置並將其儲存到
   `/tmp/srv.yaml` 檔案。
1. 命令 `kubectl create --edit` 在建立 Service 物件開啟其配置檔案進行編輯。

## {{% heading "whatsnext" %}}

<!--
* [Managing Kubernetes Objects Using Object Configuration (Imperative)](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
* [使用指令式物件配置管理 Kubernetes 物件](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [使用宣告式物件配置管理 Kubernetes 物件](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl 命令參考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

