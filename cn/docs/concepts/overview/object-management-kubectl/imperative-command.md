---
title: 使用命令式命令管理 Kubernetes 对象
cn-approvers:
- chentao1596
---
<!--
---
title: Managing Kubernetes Objects Using Imperative Commands
---
-->

{% capture overview %}
<!--
Kubernetes objects can quickly be created, updated, and deleted directly using
imperative commands built into the `kubectl` command-line tool. This document
explains how those commands are organized and how to use them to manage live objects.
-->
使用内置于 `kubectl` 命令行工具中的命令式命令，可以快速创建、更新和删除 Kubernetes 对象。本文档介绍了这些命令是如何组织、以及如何使用它们来管理活动对象的。
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
The `kubectl` tool supports verb-driven commands for creating some of the most common
object types. The commands are named to be recognizable to users unfamiliar with
the Kubernetes object types.
-->
`kubectl` 工具支持用于创建一些最常见对象类型的动词驱动命令。这些命令被命名为对不熟悉 Kubernetes 对象类型的用户可识别。

<!--
- `run`: Create a new Deployment object to run Containers in one or more Pods.
- `expose`: Create a new Service object to load balance traffic across Pods.
- `autoscale`: Create a new Autoscaler object to automatically horizontally scale a controller, such as a Deployment.
-->
- `run`：创建一个新的 Deployment 对象，以在一个或多个 Pod 中运行容器。
- `expose`：创建一个新的 Service 对象，以跨多个 Pod 来实现流量的负载均衡。
- `autoscale`：创建一个新的 Autoscaler 对象，以自动水平缩放控制器，如 Deployment。

<!--
The `kubectl` tool also supports creation commands driven by object type.
These commands support more object types and are more explicit about
their intent, but require users to know the type of objects they intend
to create.
-->
`kubectl` 工具还支持由对象类型驱动的创建命令。这些命令支持更多的对象类型，并且对它们的意图更明确，但要求用户知道他们打算创建的对象的类型。

<!--
- `create <objecttype> [<subtype>] <instancename>`
-->
- `create <对象类型> [<子类型>] <实例名>`

<!--
Some objects types have subtypes that you can specify in the `create` command.
For example, the Service object has several subtypes including ClusterIP,
LoadBalancer, and NodePort. Here's an example that creates a Service with
subtype NodePort:
-->
某些对象类型具有可在 `create` 命令中指定的子类型。例如，Service 对象有几个子类型，包括 ClusterIP、LoadBalancer 和 NodePort。以下是一个创建带有子类型 NodePort 的服务的示例：

<!--
```shell
kubectl create service nodeport <myservicename>
```
-->
```shell
kubectl create service nodeport <我的服务名称>
```

<!--
In the preceding example, the `create service nodeport` command is called
a subcommand of the `create service` command.
-->
在前面的例子中，`create service nodeport` 命令被称为命令 `create service` 的子命令。

<!--
You can use the `-h` flag to find the arguments and flags supported by
a subcommand:
-->
您可以使用 `-h` 标志查找子命令支持的参数和标志：

```shell
kubectl create service nodeport -h
```

<!--
## How to update objects
-->
## 如何更新对象

<!--
The `kubectl` command supports verb-driven commands for some common update operations.
These commands are named to enable users unfamiliar with Kubernetes
objects to perform updates without knowing the specific fields
that must be set:
-->
`kubectl` 命令支持某些常见更新操作的动词驱动命令。这些命令的命名是为了让不熟悉 Kubernetes 对象的用户在不知道必须设置的特定字段的情况下执行更新：

<!--
- `scale`: Horizontally scale a controller to add or remove Pods by updating the replica count of the controller.
- `annotate`: Add or remove an annotation from an object.
- `label`: Add or remove a label from an object.
-->
- `scale`：通过更新控制器的副本计数来水平缩放控制器以添加或删除 Pod。
- `annotate`：从对象中添加或删除注释。
- `label`：从对象中添加或删除标签。

<!--
The `kubectl` command also supports update commands driven by an aspect of the object.
Setting this aspect may set different fields for different object types:
-->
`kubectl` 命令还支持由对象的某个方面驱动的更新命令。设置此方面可能会为不同的对象类型设置不同的字段：

<!--
- `set` <field>: Set an aspect of an object.
-->
- `set` <字段>：设置对象的一个​​方面。

<!--
**Note**: In Kubernetes version 1.5, not every verb-driven command has an
associated aspect-driven command.
-->
**注意**：在 Kubernetes 1.5 版本中，不是每个动词驱动的命令都有一个相关的方面驱动命令。

<!--
The `kubectl` tool supports these additional ways to update a live object directly,
however they require a better understanding of the Kubernetes object schema.
-->
`kubectl` 工具支持这些直接更新活动对象的其他方式，但它们需要更好地理解 Kubernetes 对象模式。

<!--
- `edit`: Directly edit the raw configuration of a live object by opening its configuration in an editor.
- `patch`: Directly modify specific fields of a live object by using a patch string.
For more details on patch strings, see the patch section in
[API Conventions](https://git.k8s.io/community/contributors/devel/api-conventions.md#patch-operations).
-->
- `edit`：通过在编辑器中打开其配置直接编辑活动对象的原始配置。
- `patch`：使用修补程序字符串直接修改活动对象的特定字段。
有关修补程序字符串的更多详细信息，请参阅 [API 约定](https://git.k8s.io/community/contributors/devel/api-conventions.md#patch-operations) 中的修补程序部分 。

<!--
## How to delete objects
-->
## 如何删除对象

<!--
You can use the `delete` command to delete an object from a cluster:
-->
您可以使用 `delete` 命令从集群中删除对象：

<!--
- `delete <type>/<name>`
-->
delete <类型>/<名称>

<!--
**Note**: You can use `kubectl delete` for both imperative commands and imperative object
configuration. The difference is in the arguments passed to the command. To use
`kubectl delete` as an imperative command, pass the object to be deleted as
an argument. Here's an example that passes a Deployment object named nginx:
-->
**注意**：您可以使用 `kubectl delete` 命令式命令以及命令式对象配置。区别在于传递给命令的参数。想要 `kubectl delete` 用作命令性命令使用，请将要删除的对象作为参数传递。以下是一个传递名为 nginx 的 Deployment 对象的示例：

```shell
kubectl delete deployment/nginx
```

<!--
## How to view an object
-->
## 如何查看对象

{% comment %}
<!--
TODO(pwittrock): Uncomment this when implemented.

You can use `kubectl view` to print specific fields of an object.

- `view`: Prints the value of a specific field of an object.
-->
TODO(pwittrock)：在实现时取消注释。

您可以使用 `kubectl view` 打印对象的特定字段。

- `view`: 打印对象特定字段的值。

{% endcomment %}

<!--
There are several commands for printing information about an object:
-->
有几个打印关于对象信息的命令：

<!--
- `get`: Prints basic information about matching objects.  Use `get -h` to see a list of options.
- `describe`: Prints aggregated detailed information about matching objects.
- `logs`: Prints the stdout and stderr for a container running in a Pod.
-->
- `get`：打印有关匹配对象的基本信息。使用 `get -h` 查看选项列表。
- `describe`：打印有关匹配对象的汇总详细信息。
- `logs`：打印在 Pod 中运行的一个容器的 stdout 和 stderr。

<!--
## Using `set` commands to modify objects before creation
-->
## 在创建之前使用 `set` 命令修改对象

<!--
There are some object fields that don't have a flag you can use
in a `create` command. In some of those cases, you can use a combination of
`set` and `create` to specify a value for the field before object
creation. This is done by piping the output of the `create` command to the
`set` command, and then back to the `create` command. Here's an example:
-->
有些对象字段没有可以在 `create` 命令中使用的标志。在某些情况下，可以在创建对象之前使用 `set` 和 `create` 的组合来指定字段的值。这是通过将 `create` 命令的输出传递到 `set` 命令，然后返回 `create` 命令来完成的。下面是一个例子：

```sh
kubectl create service clusterip <myservicename> -o yaml --dry-run | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

<!--
1. The `kubectl create service -o yaml --dry-run` command creates the configuration for the Service, but prints it to stdout as YAML instead of sending it to the Kubernetes API server.
1. The `kubectl set --local -f - -o yaml` command reads the configuration from stdin, and writes the updated configuration to stdout as YAML.
1. The `kubectl create -f -` command creates the object using the configuration provided via stdin.
-->
1. `kubectl create service -o yaml --dry-run` 命令为 Service 创建配置，但将其以 YAML 格式打印到 stdout，而不是将其发送到 Kubernetes API 服务器。
1. `kubectl set --local -f - -o yaml` 命令从 stdin 读取配置，并将更新后的配置以 YAML 格式写入 stdout。
1. `kubectl create -f -` 命令使用通过 stdin 提供的配置创建对象。

<!--
## Using `--edit` to modify objects before creation
-->
## 在创建之前使用 `--edit` 修改对象

<!--
You can use `kubectl create --edit` to make arbitrary changes to an object
before it is created. Here's an example:
-->
您可以使用 `kubectl create --edit` 在创建对象之前对其进行任意更改。这是一个例子：

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```

<!--
1. The `kubectl create service` command creates the configuration for the Service and saves it to `/tmp/srv.yaml`.
1. The `kubectl create --edit` command opens the configuration file for editing before it creates the object.
-->
1. `kubectl create service` 命令为 Service 创建配置并将其保存到 `/tmp/srv.yaml`。
1. `kubectl create --edit` 命令在创建对象之前打开配置文件进行编辑。

{% endcapture %}

{% capture whatsnext %}
<!--
- [Managing Kubernetes Objects Using Object Configuration (Imperative)](/docs/concepts/overview/object-management-kubectl/imperative-config/)
- [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Kubectl Command Reference](/docs/user-guide/kubectl/{{page.version}}/)
- [Kubernetes API Reference](/docs/api-reference/{{page.version}}/)
-->
- [使用对象配置管理Kubernetes对象（命令）](/docs/concepts/overview/object-management-kubectl/imperative-config/)
- [使用对象配置管理Kubernetes对象（声明式）](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Kubectl 命令参考](/docs/user-guide/kubectl/{{page.version}}/)
- [Kubernetes API 参考](/docs/api-reference/{{page.version}}/)
{% endcapture %}

{% include templates/concept.md %}
