---
title: 使用配置檔案對 Kubernetes 物件進行命令式管理
content_type: task
weight: 40
---
<!--
title: Imperative Management of Kubernetes Objects Using Configuration Files
content_type: task
weight: 40
-->

<!-- overview -->
<!--
Kubernetes objects can be created, updated, and deleted by using the `kubectl`
command-line tool along with an object configuration file written in YAML or JSON.
This document explains how to define and manage objects using configuration files.
-->
可以使用 `kubectl` 命令列工具以及用 YAML 或 JSON 編寫的物件配置檔案來建立、更新和刪除 Kubernetes 物件。
本文件說明了如何使用配置檔案定義和管理物件。

## {{% heading "prerequisites" %}}

<!--
Install [`kubectl`](/docs/tasks/tools/).
-->
安裝 [`kubectl`](/zh-cn/docs/tasks/tools/) 。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Trade-offs

The `kubectl` tool supports three kinds of object management:
-->
## 權衡

`kubectl` 工具支援三種物件管理：

<!--
* Imperative commands
* Imperative object configuration
* Declarative object configuration
-->
* 命令式命令
* 命令式物件配置
* 宣告式物件配置

<!--
See [Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
for a discussion of the advantages and disadvantage of each kind of object management.
-->
參看 [Kubernetes 物件管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)
中關於每種物件管理的優缺點的討論。

<!--
## How to create objects

You can use `kubectl create -f` to create an object from a configuration file.
Refer to the [kubernetes API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
for details.
-->
## 如何建立物件

你可以使用 `kubectl create -f` 從配置檔案建立一個物件。
請參考 [kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 有關詳細資訊。

* `kubectl create -f <filename|url>`

<!--
## How to update objects

Updating objects with the `replace` command drops all
parts of the spec not specified in the configuration file.  This
should not be used with objects whose specs are partially managed
by the cluster, such as Services of type `LoadBalancer`, where
the `externalIPs` field is managed independently from the configuration
file.  Independently managed fields must be copied to the configuration
file to prevent `replace` from dropping them.
-->
## 如何更新物件

{{< warning >}}
使用 `replace` 命令更新物件會刪除所有未在配置檔案中指定的規範的某些部分。
不應將其規範由叢集部分管理的物件使用，比如型別為 `LoadBalancer` 的服務，
其中 `externalIPs` 欄位獨立於配置檔案進行管理。
必須將獨立管理的欄位複製到配置檔案中，以防止 `replace` 刪除它們。
{{< /warning >}}

<!--
You can use `kubectl replace -f` to update a live object according to a
configuration file.
-->
你可以使用 `kubectl replace -f` 根據配置檔案更新活動物件。 

* `kubectl replace -f <filename|url>`

<!--
## How to delete objects

You can use `kubectl delete -f` to delete an object that is described in a
configuration file.
-->
## 如何刪除物件

你可以使用 `kubectl delete -f` 刪除配置檔案中描述的物件。

* `kubectl delete -f <filename|url>`

<!-- note
If configuration file has specified the `generateName` field in the `metadata`
section instead of the `name` field, you cannot delete the object using
`kubectl delete -f <filename|url>`.
You will have to use other flags for deleting the object. For example:

```shell
kubectl delete <type> <name>
kubectl delete <type> -l <label>
```
-->
{{< note >}}
如果配置檔案在 `metadata` 節中設定了 `generateName` 欄位而非 `name` 欄位，
你無法使用 `kubectl delete -f <filename|url>` 來刪除該物件。
你必須使用其他標誌才能刪除物件。例如：

```shell
kubectl delete <type> <name>
kubectl delete <type> -l <label>
```
{{< /note >}}

<!--
## How to view an object

You can use `kubectl get -f` to view information about an object that is
described in a configuration file.
-->
## 如何檢視物件

你可以使用 `kubectl get -f` 檢視有關配置檔案中描述的物件的資訊。

* `kubectl get -f <filename|url> -o yaml`

<!--
The `-o yaml` flag specifies that the full object configuration is printed.
Use `kubectl get -h` to see a list of options.
-->
`-o yaml` 標誌指定列印完整的物件配置。
使用 `kubectl get -h` 檢視選項列表。

<!--
## Limitations

The `create`, `replace`, and `delete` commands work well when each object's
configuration is fully defined and recorded in its configuration
file. However when a live object is updated, and the updates are not merged
into its configuration file, the updates will be lost the next time a `replace`
is executed. This can happen if a controller, such as
a HorizontalPodAutoscaler, makes updates directly to a live object. Here's
an example:
-->
## 侷限性

當完全定義每個物件的配置並將其記錄在其配置檔案中時，`create`、 `replace` 和`delete` 命令會很好的工作。
但是，當更新一個活動物件，並且更新沒有合併到其配置檔案中時，下一次執行 `replace` 時，更新將丟失。
如果控制器,例如 HorizontalPodAutoscaler ,直接對活動物件進行更新，則會發生這種情況。
這有一個例子：

<!--
1. You create an object from a configuration file.
1. Another source updates the object by changing some field.
1. You replace the object from the configuration file. Changes made by
the other source in step 2 are lost.
-->
1. 從配置檔案建立一個物件。
1. 另一個源透過更改某些欄位來更新物件。
1. 從配置檔案中替換物件。在步驟2中所做的其他源的更改將丟失。

<!--
If you need to support multiple writers to the same object, you can use
`kubectl apply` to manage the object.
-->
如果需要支援同一物件的多個編寫器，則可以使用 `kubectl apply` 來管理該物件。

<!--
## Creating and editing an object from a URL without saving the configuration

Suppose you have the URL of an object configuration file. You can use
`kubectl create --edit` to make changes to the configuration before the
object is created. This is particularly useful for tutorials and tasks
that point to a configuration file that could be modified by the reader.
-->
## 從 URL 建立和編輯物件而不儲存配置

假設你具有物件配置檔案的 URL。
你可以在建立物件之前使用 `kubectl create --edit` 對配置進行更改。
這對於指向可以由讀者修改的配置檔案的教程和任務特別有用。

```shell
kubectl create -f <url> --edit
```

<!--
## Migrating from imperative commands to imperative object configuration

Migrating from imperative commands to imperative object configuration involves
several manual steps.
-->
## 從命令式命令遷移到命令式物件配置

從命令式命令遷移到命令式物件配置涉及幾個手動步驟。

<!--
1. Export the live object to a local object configuration file:
-->
1. 將活動物件匯出到本地物件配置檔案：

   ```shell
   kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
   ```

<!--
1. Manually remove the status field from the object configuration file.
-->
2. 從物件配置檔案中手動刪除狀態欄位。

<!--
1. For subsequent object management, use `replace` exclusively.
-->
3. 對於後續的物件管理，只能使用 `replace` 。

   ```shell
   kubectl replace -f <kind>_<name>.yaml
   ```

<!--
## Defining controller selectors and PodTemplate labels
-->
## 定義控制器選擇器和 PodTemplate 標籤

<!--
Updating selectors on controllers is strongly discouraged.
-->
{{< warning >}}
不建議在控制器上更新選擇器。
{{< /warning >}}

<!--
The recommended approach is to define a single, immutable PodTemplate label
used only by the controller selector with no other semantic meaning.
-->
推薦的方法是定義單個不變的 PodTemplate 標籤，該標籤僅由控制器選擇器使用，而沒有其他語義。

<!-- Example label: -->
標籤示例：

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
* [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl/)
* [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
* [使用命令式命令管理 Kubernetes 物件](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [使用物件配置管理 Kubernetes 物件 (宣告式)](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl 命令參考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)


