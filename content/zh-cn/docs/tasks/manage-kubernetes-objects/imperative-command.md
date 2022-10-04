---
title: 使用指令式命令管理 Kubernetes 对象
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
使用构建在 `kubectl` 命令行工具中的指令式命令可以直接快速创建、更新和删除
Kubernetes 对象。本文档解释这些命令的组织方式以及如何使用它们来管理活跃对象。

## {{% heading "prerequisites" %}}

<!--
Install [`kubectl`](/docs/tasks/tools/).
-->
安装[`kubectl`](/zh-cn/docs/tasks/tools/)。

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
## 权衡取舍   {#trade-offs}

`kubectl` 工具能够支持三种对象管理方式：

* 指令式命令
* 指令式对象配置
* 声明式对象配置

关于每种对象管理的优缺点的讨论，可参见
[Kubernetes 对象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)。

<!--
## How to create objects

The `kubectl` tool supports verb-driven commands for creating some of the most common
object types. The commands are named to be recognizable to users unfamiliar with
the Kubernetes object types.

- `run`: Create a new Pod to run a Container.
- `expose`: Create a new Service object to load balance traffic across Pods.
- `autoscale`: Create a new Autoscaler object to automatically horizontally scale a controller, such as a Deployment.
-->
## 如何创建对象  {#how-to-create-objects}

`kubectl` 工具支持动词驱动的命令，用来创建一些最常见的对象类别。
命令的名称设计使得不熟悉 Kubernetes 对象类型的用户也能做出判断。

- `run`：创建一个新的 Pod 来运行一个容器。
- `expose`：创建一个新的 Service 对象为若干 Pod 提供流量负载均衡。
- `autoscale`：创建一个新的 Autoscaler 对象来自动对某控制器（例如：Deployment）
  执行水平扩缩。

<!--
The `kubectl` tool also supports creation commands driven by object type.
These commands support more object types and are more explicit about
their intent, but require users to know the type of objects they intend
to create.

- `create <objecttype> [<subtype>] <instancename>`
-->
`kubectl` 命令也支持一些对象类型驱动的创建命令。
这些命令可以支持更多的对象类别，并且在其动机上体现得更为明显，
不过要求用户了解它们所要创建的对象的类别。

- `create <对象类别> [<子类别>] <实例名称>`

<!--
Some objects types have subtypes that you can specify in the `create` command.
For example, the Service object has several subtypes including ClusterIP,
LoadBalancer, and NodePort. Here's an example that creates a Service with
subtype NodePort:

```shell
kubectl create service nodeport <myservicename>
```
-->
某些对象类别拥有自己的子类别，可以在 `create` 命令中设置。
例如，Service 对象有 ClusterIP、LoadBalancer 和 NodePort 三种子类别。
下面是一个创建 NodePort 子类别的 Service 的示例：

```shell
kubectl create service nodeport <服务名称>
```

<!--
In the preceding example, the `create service nodeport` command is called
a subcommand of the `create service` command.

You can use the `-h` flag to find the arguments and flags supported by
a subcommand:
-->
在前述示例中，`create service nodeport` 命令也称作 `create service`
命令的子命令。
可以使用 `-h` 标志找到一个子命令所支持的参数和标志。

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
## 如何更新对象  {#how-to-update-objects}

`kubectl` 命令也支持一些动词驱动的命令，用来执行一些常见的更新操作。
这些命令的设计是为了让一些不了解 Kubernetes 对象的用户也能执行更新操作，
但不需要了解哪些字段必须设置：

- `scale`：对某控制器进行水平扩缩以便通过更新控制器的副本个数来添加或删除 Pod。
- `annotate`：为对象添加或删除注解。
- `label`：为对象添加或删除标签。

<!--
The `kubectl` command also supports update commands driven by an aspect of the object.
Setting this aspect may set different fields for different object types:

- `set` `<field>`: Set an aspect of an object.
-->
`kubectl` 命令也支持由对象的某一方面来驱动的更新命令。
设置对象的这一方面可能对不同类别的对象意味着不同的字段：

- `set <字段>`：设置对象的某一方面。

{{< note >}}
<!--
In Kubernetes version 1.5, not every verb-driven command has an associated aspect-driven command.
-->
在 Kubernetes 1.5 版本中，并非所有动词驱动的命令都有对应的方面驱动的命令。
{{< /note >}}

<!--
The `kubectl` tool supports these additional ways to update a live object directly,
however they require a better understanding of the Kubernetes object schema.

- `edit`: Directly edit the raw configuration of a live object by opening its configuration in an editor.
- `patch`: Directly modify specific fields of a live object by using a patch string.
For more details on patch strings, see the patch section in
[API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#patch-operations).
-->
`kubectl` 工具支持以下额外的方式用来直接更新活跃对象，不过这些操作要求
用户对 Kubernetes 对象的模式定义有很好的了解：

- `edit`：通过在编辑器中打开活跃对象的配置，直接编辑其原始配置。
- `patch`：通过使用补丁字符串（Patch String）直接更改某活跃对象的特定字段。
  关于补丁字符串的更详细信息，参见
  [API 约定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#patch-operations)
  的 patch 节。

<!--
## How to delete objects

You can use the `delete` command to delete an object from a cluster:

- `delete <type>/<name>`
-->
## 如何删除对象  {#how-to-delete-objects}

你可以使用 `delete` 命令从集群中删除一个对象：

- `delete <类别>/<名称>`

{{< note >}}
<!--
You can use `kubectl delete` for both imperative commands and imperative object
configuration. The difference is in the arguments passed to the command. To use
`kubectl delete` as an imperative command, pass the object to be deleted as
an argument. Here's an example that passes a Deployment object named nginx:
-->
你可以使用 `kubectl delete` 来执行指令式命令或者指令式对象配置。不同之处在于传递给命令的参数。
要将 `kubectl delete` 作为指令式命令使用，将要删除的对象作为参数传递给它。
下面是一个删除名为 `nginx` 的 Deployment 对象的命令：
{{< /note >}}

```shell
kubectl delete deployment/nginx
```

<!--
## How to view an object
-->
## 如何查看对象  {#how-to-view-an-object}

{{< comment >}}
<!---
TODO(pwittrock): Uncomment this when implemented.

You can use `kubectl view` to print specific fields of an object.

- `view`: Prints the value of a specific field of an object.
-->
你可以使用 `kubectl view` 打印对象的特定字段。

- `view`：打印对象的特定字段的值。

{{< /comment >}}

<!--
There are several commands for printing information about an object:

- `get`: Prints basic information about matching objects.  Use `get -h` to see a list of options.
- `describe`: Prints aggregated detailed information about matching objects.
- `logs`: Prints the stdout and stderr for a container running in a Pod.
-->
用来打印对象信息的命令有好几个：

- `get`：打印匹配到的对象的基本信息。使用 `get -h` 可以查看选项列表。
- `describe`：打印匹配到的对象的详细信息的汇集版本。
- `logs`：打印 Pod 中运行的容器的 stdout 和 stderr 输出。

<!--
## Using `set` commands to modify objects before creation

There are some object fields that don't have a flag you can use
in a `create` command. In some of those cases, you can use a combination of
`set` and `create` to specify a value for the field before object
creation. This is done by piping the output of the `create` command to the
`set` command, and then back to the `create` command. Here's an example:
-->
## 使用 `set` 命令在创建对象之前修改对象  {#using-set-commands-to-modify-objects-before-creation}

有些对象字段在 `create` 命令中没有对应的标志。
在这些场景中，你可以使用 `set` 和 `create` 命令的组合来在对象创建之前设置字段值。
这是通过将 `create` 命令的输出用管道方式传递给 `set` 命令来实现的，最后执行 `create` 命令来创建对象。
下面是一个例子：

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

<!--
1. The `kubectl create service -o yaml --dry-run=client` command creates the configuration for the Service, but prints it to stdout as YAML instead of sending it to the Kubernetes API server.
1. The `kubectl set selector --local -f - -o yaml` command reads the configuration from stdin, and writes the updated configuration to stdout as YAML.
1. The `kubectl create -f -` command creates the object using the configuration provided via stdin.
-->
1. 命令 `kubectl create service -o yaml --dry-run=client` 创建 Service 的配置，
   但将其以 YAML 格式在标准输出上打印而不是发送给 API 服务器。
1. 命令 `kubectl set selector --local -f - -o yaml` 从标准输入读入配置，
   并将更新后的配置以 YAML 格式输出到标准输出。
1. 命令 `kubectl create -f -` 使用标准输入上获得的配置创建对象。

<!--
## Using `--edit` to modify objects before creation

You can use `kubectl create --edit` to make arbitrary changes to an object
before it is created. Here's an example:
-->
## 在创建之前使用 `--edit` 更改对象 {#using-edit-to-modify-objects-before-creation}

你可以用 `kubectl create --edit` 来在对象被创建之前执行任意的变更。
下面是一个例子：

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```

<!--
1. The `kubectl create service` command creates the configuration for the Service and saves it to `/tmp/srv.yaml`.
1. The `kubectl create --edit` command opens the configuration file for editing before it creates the object.
-->
1. 命令 `kubectl create service` 创建 Service 的配置并将其保存到 `/tmp/srv.yaml` 文件。
1. 命令 `kubectl create --edit` 在创建 Service 对象打开其配置文件进行编辑。

## {{% heading "whatsnext" %}}

<!--
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
* [使用配置文件对 Kubernetes 对象进行命令式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [使用配置文件对 Kubernetes 对象进行声明式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl 命令参考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 参考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
