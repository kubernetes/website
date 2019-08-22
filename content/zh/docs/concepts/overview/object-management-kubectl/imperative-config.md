---
title: 使用配置文件指令式管理 Kubernetes 对象
content_template: templates/concept
weight: 30
---

<!--
---
title: Imperative Management of Kubernetes Objects Using Configuration Files
content_template: templates/concept
weight: 30
---
-->

{{% capture overview %}}
<!--
Kubernetes objects can be created, updated, and deleted by using the `kubectl`
command-line tool along with an object configuration file written in YAML or JSON.
This document explains how to define and manage objects using configuration files.
-->
通过使用 `kubectl` 命令行工具和 yaml 或 json 格式编写的对象配置文件，用户可以创建、更新和删除 Kubernetes 对象。
本文档介绍如何使用配置文件定义和管理对象。
{{% /capture %}}

{{% capture body %}}

<!--
## Trade-offs
-->
## 取舍权衡

<!--
The `kubectl` tool supports three kinds of object management:
-->

`kubectl` 工具支持三种对象管理：

<!--
* Imperative commands
* Imperative object configuration
* Declarative object configuration
-->
* 指令性命令
* 指令性对象配置
* 声明式对象配置

<!--
See [Kubernetes Object Management](/docs/concepts/overview/object-management-kubectl/overview/)
for a discussion of the advantages and disadvantage of each kind of object management.
-->
请参阅[Kubernetes 对象管理](/docs/concepts/overview/object-management-kubectl/overview/) 以了解每种对象管理的优缺点。

<!--
## How to create objects
-->
## 怎样创建对象

<!--
You can use `kubectl create -f` to create an object from a configuration file.
Refer to the [kubernetes API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
for details.
-->

可以使用 `kubectl create -f` 从配置文件创建对象。
有关详细信息，请参阅[Kubernetes API 参考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)。

- `kubectl create -f <filename|url>`

<!--
## How to update objects
-->
## 怎样更新对象

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
使用 `replace` 命令更新对象时，系统将会删除配置文件的 spec 中未指定的所有内容。
对于部分上由集群来管理的对象而言，不要使用这种对象管理方式。

例如，对于 `LoadBalancer` 类型的服务而言，其 `externalIPs` 字段值是独立于配置文件进行管理的。
独立管理的字段必须复制到配置文件中，以防止被 `replace` 操作删除。
{{< /warning >}}

<!--
You can use `kubectl replace -f` to update a live object according to a
configuration file.
-->
您可以使用 `kubectl replace -f` 命令基于配置文件来更新活跃状态的对象。

- `kubectl replace -f <filename|url>`

<!--
## How to delete objects
-->
## 怎样删除对象

<!--
You can use `kubectl delete -f` to delete an object that is described in a
configuration file.
-->

您可以使用 `kubectl delete -f` 命令来删除配置文件中描述的对象。

- `kubectl delete -f <filename|url>`

<!--
## How to view an object
-->
## 怎样查看对象

<!--
You can use `kubectl get -f` to view information about an object that is
described in a configuration file.
-->

您可以使用 `kubectl get -f` 命令来查看配置文件中描述的对象的信息。

- `kubectl get -f <filename|url> -o yaml`

<!--
The `-o yaml` flag specifies that the full object configuration is printed.
Use `kubectl get -h` to see a list of options.
-->

指定了 `-o yaml` 参数将会打印完整的对象配置。
使用 `kubectl get -h` 命令查看选项列表。

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
当每个对象的配置都完整的定义和记录在它的配置文件中时，`create`、`replace` 和 `delete` 命令就能正常使用。
然而，当一个存活态的对象被更新、并且更新的内容没有被合入该对象的配置文件时，下次再执行 `replace` 命令将导致更新的内容丢失。
如果控制器（如 HorizontalPodAutoscaler）直接更新存活态的对象，就会发生上面的情况。
下面是个例子：

<!--
1. You create an object from a configuration file.
1. Another source updates the object by changing some field.
1. You replace the object from the configuration file. Changes made by
the other source in step 2 are lost.
-->

1. 从配置文件创建对象。
1. 另外一个资源更新这个对象的一些字段。
1. 从配置文件中替换（replace）该对象。第二步中另外的资源对该对象所做的更新将丢失。

<!--
If you need to support multiple writers to the same object, you can use
`kubectl apply` to manage the object.
-->
如果您需要对同一对象支持多个写者，那么可以使用 `kubectl apply` 命令管理该对象。

<!--
## Creating and editing an object from a URL without saving the configuration
-->
## 通过 URL 创建和编辑对象而不保存配置

<!--
Suppose you have the URL of an object configuration file. You can use
`kubectl create --edit` to make changes to the configuration before the
object is created. This is particularly useful for tutorials and tasks
that point to a configuration file that could be modified by the reader.
-->

假设您知道一个对象配置文件的 URL。
您可以在对象被创建之前使用 `kubectl create --edit` 命令来更改它的配置。
这对于指向那些读者可修改配置文件的教程和任务特别有用。

```sh
kubectl create -f <url> --edit
```

<!--
## Migrating from imperative commands to imperative object configuration
-->
## 从指令性命令迁移到指令性对象配置

<!--
Migrating from imperative commands to imperative object configuration involves
several manual steps.
-->
从指令性命令迁移到指令性对象配置包括几个手动步骤。


1. <!--Export the live object to a local object configuration file:-->将存活态的对象导出为本地对象配置文件：
```sh
kubectl get <kind>/<name> -o yaml --export > <kind>_<name>.yaml
```
1. <!--Manually remove the status field from the object configuration file.-->手动从对象配置文件中移除状态信息。
1. <!--For subsequent object management, use `replace` exclusively.-->对于后续的对象管理，只使用 `replace`。
```sh
kubectl replace -f <kind>_<name>.yaml
```

<!--
## Defining controller selectors and PodTemplate labels
-->
## 定义控制器选择器和 PodTemplate 标签

{{< warning >}}
<!--
Updating selectors on controllers is strongly discouraged.
-->
强烈不建议更新控制器的选择器。
{{< /warning >}}

<!--
The recommended approach is to define a single, immutable PodTemplate label
used only by the controller selector with no other semantic meaning.
-->
建议的方法是定义一个单一的、不变的 PodTemplate 标签，该标签仅由控制器选择器使用，没有其他语义意义。

<!--
Example label:
-->
标签示例：

```yaml
selector:
  matchLabels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
```

{{% /capture %}}

{{% capture whatsnext %}}
<!--
- [Managing Kubernetes Objects Using Imperative Commands](/docs/concepts/overview/object-management-kubectl/imperative-command/)
- [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl/)
- [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->

- [使用指令性命令管理 Kubernetes 对象](/docs/concepts/overview/object-management-kubectl/imperative-command/)
- [使用对象配置文件（声明式）管理 Kubernetes 对象](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Kubectl 命令参考](/docs/reference/generated/kubectl/kubectl/)
- [Kubernetes API 参考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
{{% /capture %}}


