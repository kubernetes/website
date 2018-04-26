---
title: 使用配置文件对 Kubernetes 对象的命令式管理
cn-approvers:
- chentao1596
---
<!--
---
title: Imperative Management of Kubernetes Objects Using Configuration Files
---
-->

{% capture overview %}
<!--
Kubernetes objects can be created, updated, and deleted by using the `kubectl`
command-line tool along with an object configuration file written in YAML or JSON.
This document explains how to define and manage objects using configuration files.
-->
通过使用 `kubectl` 命令行工具以及用 YAML 或 JSON 编写的对象配置文件，可以创建、更新和删除 Kubernetes 对象。本文档介绍了如何使用配置文件定义和管理对象。
{% endcapture %}

{% capture body %}

<!--
## Trade-offs
-->
## 权衡

<!--
The `kubectl` tool supports three kinds of object management:

* Imperative commands
* Imperative object configuration
* Declarative object configuration
-->
`kubectl` 工具支持三种对象管理：

* 命令式的命令
* 命令式的对象配置
* 声明式的对象配置

<!--
See [Kubernetes Object Management](/docs/concepts/overview/object-management-kubectl/overview/)
for a discussion of the advantages and disadvantage of each kind of object management.
-->
有关每种对象管理的优缺点的讨论，请参阅 [Kubernetes 对象管理](/docs/concepts/overview/object-management-kubectl/overview/)。

<!--
## How to create objects
-->
## 如何创建对象

<!--
You can use `kubectl create -f` to create an object from a configuration file.
Refer to the [kubernetes API reference](/docs/api-reference/{{page.version}}/)
for details.

- `kubectl create -f <filename|url>`
-->
您可以使用 `kubectl create -f` 从一个配置文件创建对象。有关详细信息，请参阅 [kubernetes API 参考](/docs/api-reference/{{page.version}}/)。

- `kubectl create -f <文件名称|url>`

<!--
## How to update objects
-->
## 如何更新对象

<!--
**Warning:** Updating objects with the `replace` command drops all
parts of the spec not specified in the configuration file.  This
should not be used with objects whose specs are partially managed
by the cluster, such as Services of type `LoadBalancer`, where
the `externalIPs` field is managed independently from the configuration
file.  Independently managed fields must be copied to the configuration
file to prevent `replace` from dropping them.
-->
**警告：** 使用 `replace` 命令更新对象将删除配置文件中未指定的规范的所有部分。这不应该用于集群部分管理其规范的对象，例如 `LoadBalancer` 类型的服务，在该服务中，`externalIPs` 字段是独立于配置文件管理的。必须将独立管理的字段复制到配置文件中，以防止 `replace` 删除它们。

<!--
You can use `kubectl replace -f` to update a live object according to a
configuration file.

- `kubectl replace -f <filename|url>`
-->
您可以通过一个配置文件使用 `kubectl replace -f` 更新活动对象。

- `kubectl replace -f <文件名称|url>`

<!--
## How to delete objects
-->
## 如何删除对象

<!--
You can use `kubectl delete -f` to delete an object that is described in a
configuration file.

- `kubectl delete -f <filename|url>`
-->
您可以使用 `kubectl delete -f` 删除配置文件中描述的对象。

- `kubectl delete -f <文件名称|url>`

<!--
## How to view an object
-->
## 如何查看对象

<!--
You can use `kubectl get -f` to view information about an object that is
described in a configuration file.

- `kubectl get -f <filename|url> -o yaml`
-->
您可以使用 `kubectl get -f` 查看有关配置文件中描述的对象的信息。

- `kubectl get -f <文件名称|url> -o yaml`

<!--
The `-o yaml` flag specifies that the full object configuration is printed.
Use `kubectl get -h` to see a list of options.
-->
`-o yaml` 标志表明需要打印完整的对象配置。使用 `kubectl get -h` 查看选项列表。

<!--
## Limitations
-->
## 限制

<!--
The `create`, `replace`, and `delete` commands work well when each object's
configuration is fully defined and recorded in its configuration
file. However when a live object is updated, and the updates are not merged
into its configuration file, the updates will be lost the next time a `replace`
is executed. This can happen if a controller, such as
a HorizontalPodAutoscaler, makes updates directly to a live object. Here's
an example:
-->
当每个对象的配置被完全定义并记录在其配置文件中时，`create`、`replace` 和 `delete` 命令就可以很好地工作。然而，当更新了一个活动对象，而更新没有合并到它的配置文件中时，更新将在下一次 `replace` 执行时丢失。如果控制器（如 HorizontalPodAutoscaler）直接更新活动对象，则可能发生这种情况。下面举个例子：

<!--
1. You create an object from a configuration file.
1. Another source updates the object by changing some field.
1. You replace the object from the configuration file. Changes made by
the other source in step 2 are lost.
-->
1. 您从配置文件创建一个对象。
1. 另一个来源通过更改某个字段来更新对象。
1. 您从配置文件中替换该对象。步骤 2 中其他来源所做的更改将丢失。

<!--
If you need to support multiple writers to the same object, you can use
`kubectl apply` to manage the object.
-->
如果您需要支持同一个对象的多个写入器，则可以使用 `kubectl apply` 来管理该对象。

<!--
## Creating and editing an object from a URL without saving the configuration
-->
## 从 URL 创建和编辑对象而不保存配置

<!--
Suppose you have the URL of an object configuration file. You can use
`kubectl create --edit` to make changes to the configuration before the
object is created. This is particularly useful for tutorials and tasks
that point to a configuration file that could be modified by the reader.
-->
假设您有一个对象配置文件的 URL。您可以使用 `kubectl create --edit` 在创建对象之前对配置进行更改。这对于指向可由读取器修改的配置文件的教程和任务尤其有用。

```sh
kubectl create -f <url> --edit
```

<!--
## Migrating from imperative commands to imperative object configuration
-->
## 从命令式命令迁移到命令式对象配置

<!--
Migrating from imperative commands to imperative object configuration involves
several manual steps.
-->
从命令式命令迁移到命令式对象配置需要几个手动步骤。

<!--
1. Export the live object to a local object configuration file:
-->
1. 将活动对象导出到本地对象配置文件：

       kubectl get <kind>/<name> -o yaml --export > <kind>_<name>.yaml

<!--
1. Manually remove the status field from the object configuration file.
-->
1. 手动从对象配置文件中删除状态字段。

<!--
1. For subsequent object management, use `replace` exclusively.
-->
1. 对于后续的对象管理，只使用 `replace`。

       kubectl replace -f <kind>_<name>.yaml

<!--
## Defining controller selectors and PodTemplate labels
-->
## 定义控制器选择器和 PodTemplate 标签

<!--
**Warning**: Updating selectors on controllers is strongly discouraged.
-->
**警告**：强烈建议不要更新控制器上的选择器。

<!--
The recommended approach is to define a single, immutable PodTemplate label
used only by the controller selector with no other semantic meaning.
-->
推荐的方法是定义一个单一的、不可变的 PodTemplate 标签，该标签仅由控制器选择器使用，没有其他语义含义。

<!--
Example label:
-->
示例标签：

```yaml
selector:
  matchLabels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
```

{% endcapture %}

{% capture whatsnext %}
<!--
- [Managing Kubernetes Objects Using Imperative Commands](/docs/concepts/overview/object-management-kubectl/imperative-command/)
- [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Kubectl Command Reference](/docs/user-guide/kubectl/{{page.version}}/)
- [Kubernetes API Reference](/docs/api-reference/{{page.version}}/)
-->
- [使用命令式命令管理 Kubernetes 对象](/docs/concepts/overview/object-management-kubectl/imperative-command/)
- [使用对象配置管理 Kubernetes 对象（声明式）](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Kubectl 命令参考](/docs/user-guide/kubectl/{{page.version}}/)
- [Kubernetes API 参考](/docs/api-reference/{{page.version}}/)
{% endcapture %}

{% include templates/concept.md %}
