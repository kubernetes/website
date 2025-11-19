---
title: 使用設定文件對 Kubernetes 對象進行命令式管理
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
可以使用 `kubectl` 命令列工具以及用 YAML 或 JSON 編寫的對象設定文件來創建、更新和刪除 Kubernetes 對象。
本文檔說明了如何使用設定文件定義和管理對象。

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
-->
## 權衡   {#trade-offs}

`kubectl` 工具支持三種對象管理：

<!--
* Imperative commands
* Imperative object configuration
* Declarative object configuration
-->
* 命令式命令
* 命令式對象設定
* 聲明式對象設定

<!--
See [Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
for a discussion of the advantages and disadvantage of each kind of object management.
-->
參見 [Kubernetes 對象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)
中關於每種對象管理的優缺點的討論。

<!--
## How to create objects

You can use `kubectl create -f` to create an object from a configuration file.
Refer to the [kubernetes API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
for details.
-->
## 如何創建對象   {#how-to-create-objects}

你可以使用 `kubectl create -f` 從設定文件創建一個對象。
更多細節參閱 [kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

* `kubectl create -f <filename|url>`

<!--
## How to update objects
-->
## 如何更新對象   {#how-to-update-objects}

{{< warning >}}
<!--
Updating objects with the `replace` command drops all
parts of the spec not specified in the configuration file.  This
should not be used with objects whose specs are partially managed
by the cluster, such as Services of type `LoadBalancer`, where
the `externalIPs` field is managed independently from the configuration
file.  Independently managed fields must be copied to the configuration
file to prevent `replace` from dropping them.
-->
使用 `replace` 命令更新對象會刪除所有未在設定文件中指定的規範的某些部分。
不應將其規範由叢集部分管理的對象使用，比如類型爲 `LoadBalancer` 的服務，
其中 `externalIPs` 字段獨立於設定文件進行管理。
必須將獨立管理的字段複製到設定文件中，以防止 `replace` 刪除它們。
{{< /warning >}}

<!--
You can use `kubectl replace -f` to update a live object according to a
configuration file.
-->
你可以使用 `kubectl replace -f` 根據設定文件更新活動對象。

* `kubectl replace -f <filename|url>`

<!--
## How to delete objects

You can use `kubectl delete -f` to delete an object that is described in a
configuration file.
-->
## 如何刪除對象   {#how-to-delete-objects}

你可以使用 `kubectl delete -f` 刪除設定文件中描述的對象。

* `kubectl delete -f <filename|url>`

{{< note >}}
<!--
If configuration file has specified the `generateName` field in the `metadata`
section instead of the `name` field, you cannot delete the object using
`kubectl delete -f <filename|url>`.
You will have to use other flags for deleting the object. For example:
-->
如果設定文件在 `metadata` 節中設置了 `generateName` 字段而非 `name` 字段，
你無法使用 `kubectl delete -f <filename|url>` 來刪除該對象。
你必須使用其他標誌才能刪除對象。例如：

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
## 如何查看對象   {#how-to-view-an-object}

你可以使用 `kubectl get -f` 查看有關設定文件中描述的對象的信息。

* `kubectl get -f <filename|url> -o yaml`

<!--
The `-o yaml` flag specifies that the full object configuration is printed.
Use `kubectl get -h` to see a list of options.
-->
`-o yaml` 標誌指定打印完整的對象設定。使用 `kubectl get -h` 查看選項列表。

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
## 侷限性   {#limitations}

當完全定義每個對象的設定並將其記錄在其設定文件中時，`create`、 `replace` 和`delete` 命令會很好的工作。
但是，當更新一個活動對象，並且更新沒有合併到其設定文件中時，下一次執行 `replace` 時，更新將丟失。
如果控制器,例如 HorizontalPodAutoscaler ,直接對活動對象進行更新，則會發生這種情況。
這有一個例子：

<!--
1. You create an object from a configuration file.
1. Another source updates the object by changing some field.
1. You replace the object from the configuration file. Changes made by
the other source in step 2 are lost.
-->
1. 從設定文件創建一個對象。
1. 另一個源通過更改某些字段來更新對象。
1. 從設定文件中替換對象。在步驟2中所做的其他源的更改將丟失。

<!--
If you need to support multiple writers to the same object, you can use
`kubectl apply` to manage the object.
-->
如果需要支持同一對象的多個編寫器，則可以使用 `kubectl apply` 來管理該對象。

<!--
## Creating and editing an object from a URL without saving the configuration

Suppose you have the URL of an object configuration file. You can use
`kubectl create --edit` to make changes to the configuration before the
object is created. This is particularly useful for tutorials and tasks
that point to a configuration file that could be modified by the reader.
-->
## 從 URL 創建和編輯對象而不保存設定   {#creating-and-editing-an-object-from-a-url-without-saving-the-configuration}

假設你具有對象設定文件的 URL。
你可以在創建對象之前使用 `kubectl create --edit` 對設定進行更改。
這對於指向可以由讀者修改的設定文件的教程和任務特別有用。

```shell
kubectl create -f <url> --edit
```

<!--
## Migrating from imperative commands to imperative object configuration

Migrating from imperative commands to imperative object configuration involves
several manual steps.
-->
## 從命令式命令遷移到命令式對象設定   {#migrating-from-imperative-commands-to-imperative-object-configuration}

從命令式命令遷移到命令式對象設定涉及幾個手動步驟。

<!--
1. Export the live object to a local object configuration file:
-->
1. 將活動對象導出到本地對象設定文件：

   ```shell
   kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
   ```

<!--
1. Manually remove the status field from the object configuration file.
-->
2. 從對象設定文件中手動刪除狀態字段。

<!--
1. For subsequent object management, use `replace` exclusively.
-->
3. 對於後續的對象管理，只能使用 `replace` 。

   ```shell
   kubectl replace -f <kind>_<name>.yaml
   ```

<!--
## Defining controller selectors and PodTemplate labels
-->
## 定義控制器選擇器和 PodTemplate 標籤   {#defining-controller-selectors-and-podtemplate-labels}

{{< warning >}}
<!--
Updating selectors on controllers is strongly discouraged.
-->
不建議在控制器上更新選擇器。
{{< /warning >}}

<!--
The recommended approach is to define a single, immutable PodTemplate label
used only by the controller selector with no other semantic meaning.
-->
推薦的方法是定義單個不變的 PodTemplate 標籤，該標籤僅由控制器選擇器使用，而沒有其他語義。

<!--
Example label:
-->
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
* [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
* [使用命令式命令管理 Kubernetes 對象](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [使用設定文件對 Kubernetes 對象進行聲明式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl 命令參考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
