<!--
---
title: Managing Kubernetes Objects Using Imperative Commands
---
-->
---
title: 使用命令式的方式管理 Kubernetes 对象
---

{% capture overview %}
<!--
Kubernetes objects can quickly be created, updated, and deleted directly using
imperative commands built into the `kubectl` command-line tool. This document
explains how those commands are organized and how to use them to manage live objects.
-->
直接使用内置的 `kubectl` 命令行工具，以命令式方式可以快速创建，更新和删除 Kubernetes 对象。本文档介绍了这些命令是如何组织的，以及如何使用它们来管理活动对象。
{% endcapture %}

{% capture body %}

<!--## Trade-offs-->
## 权衡
<!--
The `kubectl` tool supports three kinds of object management:

* Imperative commands
* Imperative object configuration
* Declarative object configuration

See [Kubernetes Object Management](/docs/concepts/tools/kubectl/object-management-overview/)
for a discussion of the advantages and disadvantage of each kind of object management.
-->
`kubectl` 工具支持三种对象的管理:

* 命令式的方式
* 命令式的对象配置
* 声明式的对象配置

参见[Kubernetes对象管理](/docs/concepts/tools/kubectl/object-management-overview/)
讨论各种对象管理的优缺点.

<!--## How to create objects-->
## 如何创建对象
<!--
The `kubectl` tool supports verb-driven commands for creating some of the most common
object types. The commands are named to be recognizable to users unfamiliar with
the Kubernetes object types.

- `run`: Create a new Deployment object to run Containers in one or more Pods.
- `expose`: Create a new Service object to load balance traffic across Pods.
- `autoscale`: Create a new Autoscaler object to automatically horizontally scale a controller, such as a Deployment.

The `kubectl` tool also supports creation commands driven by object type.
These commands support more object types and are more explicit about
their intent, but require users to know the type of objects they intend
to create.
-->
`kubectl` 工具支持用于创建一些最常用的对象类型的动词驱动命令，这些命令被命名为对于不熟悉的用户也是一目了然。

- `run`: 创建一个新的 Deployment 对象以在一个或多个 Pod 中运行 Containers。
- `expose`: 创建一个新的 Service 对象用于负载均衡 Pods 上的的网络流量。
- `autoscale`: 创建一个新的 Autoscaler 对象，即自动水平扩展控制器，提供 Deployment 自动水平伸缩支持。

`kubectl` 工具也支持由对象类型驱动的创建命令。 这些命令支持更多的对象类型，并且对其意图更为明确，但要求用户知道他们打算创建的对象的类型。

- `create <objecttype> [<subtype>] <instancename>`
<!--
Some objects types have subtypes that you can specify in the `create` command.
For example, the Service object has several subtypes including ClusterIP,
LoadBalancer, and NodePort. Here's an example that creates a Service with
subtype NodePort:
-->
一些对象类型允许你在 `create` 命令中指定子命令。例如，Service 对象拥有几个子命令，包括 ClusterIP、LoadBalancer 和 NodePort。以下是使用子命令 NodePort 创建服务的示例:

```shell
kubectl create service nodeport <myservicename>
```
<!--
In the preceding example, the `create service nodeport` command is called
a subcommand of the `create service` command.

You can use the `-h` flag to find the arguments and flags supported by
a subcommand:
-->
在前面的例子中，调用 `create service nodeport`命令是 `create service`命令的子命令.

您可以使用 `-h` 标志来查找子命令支持的参数和标志:
```shell
kubectl create service nodeport -h
```

<!--## How to update objects-->
## 如何更新对象
<!--
The `kubectl` command supports verb-driven commands for some common update operations.
These commands are named to enable users unfamiliar with Kubernetes
objects to perform updates without knowing the specific fields
that must be set:

- `scale`: Horizontally scale a controller to add or remove Pods by updating the replica count of the controller.
- `annotate`: Add or remove an annotation from an object.
- `label`: Add or remove a label from an object.
-->
`kubectl` 命令支持一些常见更新操作的动词驱动命令。这样命名可以让不熟悉 Kubernetes 对象的用户，在不知道必须设置的特定字段的情况下也可以执行更新操作:

 - `scale`: 通过更新控制器的副本数量，水平扩展控制器以添加或删除 Pod。
 - `annotate`: 从对象添加或删除注释。
 - `label`: 为对象添加或删除标签。
<!--
The `kubectl` command also supports update commands driven by an aspect of the object.
Setting this aspect may set different fields for different object types:

- `set` <field>: Set an aspect of an object.
-->
`kubectl`命令还支持由对象的一个​​切面驱动的更新命令.设置此切面可能会为不同的对象类型设置不同的字段:

 - `set` <field>: 设置对象的一个​​切面.

<!--**Note**: In Kubernetes version 1.5, not every verb-driven command has an
associated aspect-driven command.-->
**注**: 在 Kubernetes 版本 1.5 中，并不是每个动词驱动的命令都有一个相关的切面驱动的命令。

<!--
The `kubectl` tool supports these additional ways to update a live object directly,
however they require a better understanding of the Kubernetes object schema.

- `edit`: Directly edit the raw configuration of a live object by opening its configuration in an editor.
- `patch`: Directly modify specific fields of a live object by using a patch string.
For more details on patch strings, see the patch section in
[API Conventions](https://git.k8s.io/community/contributors/devel/api-conventions.md#patch-operations).
-->
`kubectl` 工具支持直接更新活动对象的其他方法，然而，它们需要更好的了解 Kubernetes 对象模式。

- `edit`: 通过在编辑器中打开其配置，直接编辑活动对象的原始配置。
- `patch`: 通过使用补丁字符串直接修改活动对象的特定字段。

有关补丁字符串的更多详细信息，请参阅补丁部分
[API 公约](https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md#patch-operations).

<!--## How to delete objects-->
## 如何删除对象

<!--You can use the `delete` command to delete an object from a cluster:-->
您可以使用 `delete` 命令从集群中删除一个对象:

- `delete <type>/<name>`

<!--**Note**: You can use `kubectl delete` for both imperative commands and imperative object
configuration. The difference is in the arguments passed to the command. To use
`kubectl delete` as an imperative command, pass the object to be deleted as
an argument. Here's an example that passes a Deployment object named nginx:-->
**注意**: 您可以对命令式命令和命令式对象配置都使用 `kubectl delete` 方法。两者的差异在于传递的命令参数不同。要将 `kubectl delete` 作为命令式命令使用，将要删除的对象作为参数传递。以下是传递名为 nginx 的 Deployment 对象的示例:

```shell
kubectl delete deployment/nginx
```

<!--## How to view an object-->
## 如何查看对象

{% comment %}
<!--
TODO(pwittrock): Uncomment this when implemented.

You can use `kubectl view` to print specific fields of an object.

- `view`: Prints the value of a specific field of an object.
-->
TODO(pwittrock): 实现时取消注释.

您可以使用 `kubectl view` 打印指定对象的字段。

- `view`: 打印对象的特定字段的值。

{% endcomment %}


<!--
There are several commands for printing information about an object:

- `get`: Prints basic information about matching objects.  Use `get -h` to see a list of options.
- `describe`: Prints aggregated detailed information about matching objects.
- `logs`: Prints the stdout and stderr for a container running in a Pod.
-->
有几个命令用于打印有关对象的信息:

- `get`: 打印有关匹配对象的基本信息。使用 `get -h` 来查看选项列表。
- `describe`: 打印有关匹配对象的聚合详细信息。
- `logs`: 打印 Pod 运行容器的 stdout 和 stderr 信息。


<!--## Using `set` commands to modify objects before creation-->
##  使用 `set` 命令在创建之前修改对象

<!--There are some object fields that don't have a flag you can use
in a `create` command. In some of those cases, you can use a combination of
`set` and `create` to specify a value for the field before object
creation. This is done by piping the output of the `create` command to the
`set` command, and then back to the `create` command. Here's an example:-->

有一些对象字段没有可以使用的标志，在 `create` 命令中。在某些情况下，您可以使用组合 `set` 和 `create` 为对象之前的字段指定一个值创建。这是通过将 `create` 命令的输出管道连接到 `set` 命令，然后回到 `create` 命令。以下是一个例子:

```sh
kubectl create service clusterip <myservicename> -o yaml --dry-run | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```
<!--
1. The `kubectl create service -o yaml --dry-run` command creates the configuration for the Service, but prints it to stdout as YAML instead of sending it to the Kubernetes API server.
1. The `kubectl set --local -f - -o yaml` command reads the configuration from stdin, and writes the updated configuration to stdout as YAML.
1. The `kubectl create -f -` command creates the object using the configuration provided via stdin.
-->
1.  使用 `kubectl create service -o yaml --dry-run` 创建服务配置，并将其作为 YAML 打印到 stdout，而不是将其发送到 Kubernetes API 服务器。
1.  使用 `kubectl set --local -f - -o yaml` 从 stdin 读取配置，并将更新后的配置作为 YAML 写入 stdout。
1.  使用 `kubectl create -f -` 从 stdin 提供的配置创建对象。

<!--## Using `--edit` to modify objects before creation-->
## 使用 `--edit` 在创建之前修改对象
<!--
You can use `kubectl create --edit` to make arbitrary changes to an object
before it is created. Here's an example:-->
您可以使用 `kubectl create --edit` 命令在对象创建之前，对对象进行任意更改。以下是一个例子:

```sh
kubectl create service clusterip my-svc -o yaml --dry-run > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```
<!--
1. The `kubectl create service` command creates the configuration for the Service and saves it to `/tmp/srv.yaml`.
1. The `kubectl create --edit` command opens the configuration file for editing before it creates the object.-->

1. 使用`kubectl create service` 创建服务的配置并将其保存到 `/tmp/srv.yaml`。
1. 使用`kubectl create --edit` 在创建对象之前打开配置文件进行编辑。

{% endcapture %}

{% capture whatsnext %}
<!--
- [Managing Kubernetes Objects Using Object Configuration (Imperative)](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/)
- [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/)
- [Kubectl Command Reference](/docs/user-guide/kubectl/v1.6/)
- [Kubernetes Object Schema Reference](/docs/resources-reference/{{page.version}}/)
-->
-  [使用对象配置管理 Kubernetes 对象(必要)](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/)
-  [使用对象配置(声明式)管理 Kubernetes 对象](/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/)
-  [Kubectl 命令参考](/docs/user-guide/kubectl/{{page.version}}/)
-  [Kubernetes 对象模式参考](/docs/resources-reference/{{page.version}}/)
{% endcapture %}

{% include templates/concept.md %}
