---
approvers:
- bgrant0607
- hw-qiaolei
title: kubectl概述
---

<!--
title: Overview of kubectl
-->
<!--
`kubectl` is a command line interface for running commands against Kubernetes clusters. This overview covers `kubectl` syntax, describes the command operations, and provides common examples. For details about each command, including all the supported flags and subcommands, see the [kubectl](/docs/user-guide/kubectl) reference documentation. For installation instructions see [installing kubectl](/docs/tasks/kubectl/install/).
-->
kubectl是用于针对Kubernetes集群运行命令的命令行接口。本概述涵盖`kubectl`语法，描述命令操作，并提供常见的示例。有关每个命令的详细信息，包括所有支持的flags和子命令，请参考[kubectl](/docs/user-guide/kubectl)相关文档。有关安装说明，请参阅[安装kubectl](/docs/tasks/kubectl/install/)。

<!--## Syntax-->
## 语法
<!--Use the following syntax to run `kubectl` commands from your terminal window:-->
使用以下语法从你的终端窗口运行`kubectl`命令：

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

<!--where `command`, `TYPE`, `NAME`, and `flags` are:-->
其中command，TYPE，NAME，和flags分别是：

<!--* `command`: Specifies the operation that you want to perform on one or more resources, for example `create`, `get`, `describe`, `delete`.-->
* `command`: 指定要在一个或多个资源进行操作，例如`create`，`get`，`describe`，`delete`。

<!--* `TYPE`: Specifies the [resource type](#resource-types). Resource types are case-sensitive and you can specify the singular, plural, or abbreviated forms. For example, the following commands produce the same output:-->
* `TYPE`：指定[资源类型](#resource-types)。资源类型区分大小写，您可以指定单数，复数或缩写形式。例如，以下命令产生相同的输出：

    $ kubectl get pod pod1
    $ kubectl get pods pod1
    $ kubectl get po pod1

<!--* `NAME`: Specifies the name of the resource. Names are case-sensitive. If the name is omitted, details for all resources are displayed, for example `$ kubectl get pods`.

   When performing an operation on multiple resources, you can specify each resource by type and name or specify one or more files:-->
`NAME`：指定资源的名称。名称区分大小写。如果省略名称，则会显示所有资源的详细信息,比如`$ kubectl get pods`。

   在多个资源上执行操作时，可以按类型和名称指定每个资源，或指定一个或多个文件：

   <!--* To specify resources by type and name:-->
   * 按类型和名称指定资源：

        * 要分组资源，如果它们都是相同的类型：`TYPE1 name1 name2 name<#>`.<br/>
        例: `$ kubectl get pod example-pod1 example-pod2`

        * 要分别指定多种资源类型:  `TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`.<br/>
        例: `$ kubectl get pod/example-pod1 replicationcontroller/example-rc1`

   <!--* To specify resources with one or more files:  `-f file1 -f file2 -f file<#>`
     [Use YAML rather than JSON](/docs/concepts/configuration/overview/#general-config-tips) since YAML tends to be more user-friendly, especially for configuration files.<br/>
     Example: `$ kubectl get pod -f ./pod.yaml`-->
     使用一个或多个文件指定资源： `-f file1 -f file2 -f file<#>` 使用[YAML而不是JSON](/docs/concepts/configuration/overview/#general-config-tips)，因为YAML往往更加用户友好，特别是对于配置文件。<br/>
     例：$ kubectl get pod -f ./pod.yaml
<!--* `flags`: Specifies optional flags. For example, you can use the `-s` or `--server` flags to specify the address and port of the Kubernetes API server.<br/>
**Important**: Flags that you specify from the command line override default values and any corresponding environment variables.-->
* flags：指定可选标志。例如，您可以使用`-s`或`--serverflags`来指定Kubernetes API服务器的地址和端口。
**重要提示**：从命令行指定的标志将覆盖默认值和任何相应的环境变量。

<--If you need help, just run `kubectl help` from the terminal window.-->
如果您需要帮助，只需从终端窗口运行`kubectl help`。

```## Operations```
## 操作

<!--The following table includes short descriptions and the general syntax for all of the `kubectl` operations:-->
下表包括所有kubectl操作的简短描述和一般语法：
<!--
Operation       | Syntax    |       Description
-------------------- | -------------------- | --------------------
`annotate`    | `kubectl annotate (-f FILENAME | TYPE NAME | TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]` | Add or update the annotations of one or more resources.
`api-versions`    | `kubectl api-versions [flags]` | List the API versions that are available.
`apply`            | `kubectl apply -f FILENAME [flags]`| Apply a configuration change to a resource from a file or stdin.
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | Attach to a running container either to view the output stream or interact with the container (stdin).
`autoscale`    | `kubectl autoscale (-f FILENAME | TYPE NAME | TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]` | Automatically scale the set of pods that are managed by a replication controller.
`cluster-info`    | `kubectl cluster-info [flags]` | Display endpoint information about the master and services in the cluster.
`config`        | `kubectl config SUBCOMMAND [flags]` | Modifies kubeconfig files. See the individual subcommands for details.
`create`        | `kubectl create -f FILENAME [flags]` | Create one or more resources from a file or stdin.
`delete`        | `kubectl delete (-f FILENAME | TYPE [NAME | /NAME | -l label | --all]) [flags]` | Delete resources either from a file, stdin, or specifying label selectors, names, resource selectors, or resources.
`describe`    | `kubectl describe (-f FILENAME | TYPE [NAME_PREFIX | /NAME | -l label]) [flags]` | Display the detailed state of one or more resources.
`edit`        | `kubectl edit (-f FILENAME | TYPE NAME | TYPE/NAME) [flags]` | Edit and update the definition of one or more resources on the server by using the default editor.
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | Execute a command against a container in a pod,
`explain`    | `kubectl explain [--include-extended-apis=true] [--recursive=false] [flags]` | Get documentation of various resources. For instance pods, nodes, services, etc.
`expose`        | `kubectl expose (-f FILENAME | TYPE NAME | TYPE/NAME) [--port=port] [--protocol=TCP|UDP] [--target-port=number-or-name] [--name=name] [----external-ip=external-ip-of-service] [--type=type] [flags]` | Expose a replication controller, service, or pod as a new Kubernetes service.
`get`        | `kubectl get (-f FILENAME | TYPE [NAME | /NAME | -l label]) [--watch] [--sort-by=FIELD] [[-o | --output]=OUTPUT_FORMAT] [flags]` | List one or more resources.
`label`        | `kubectl label (-f FILENAME | TYPE NAME | TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]` | Add or update the labels of one or more resources.
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | Print the logs for a container in a pod.
`patch`        | `kubectl patch (-f FILENAME | TYPE NAME | TYPE/NAME) --patch PATCH [flags]` | Update one or more fields of a resource by using the strategic merge patch process.
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | Forward one or more local ports to a pod.
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | Run a proxy to the Kubernetes API server.
`replace`        | `kubectl replace -f FILENAME` | Replace a resource from a file or stdin.
`rolling-update`    | `kubectl rolling-update OLD_CONTROLLER_NAME ([NEW_CONTROLLER_NAME] --image=NEW_CONTAINER_IMAGE | -f NEW_CONTROLLER_SPEC) [flags]` | Perform a rolling update by gradually replacing the specified replication controller and its pods.
`run`        | `kubectl run NAME --image=image [--env="key=value"] [--port=port] [--replicas=replicas] [--dry-run=bool] [--overrides=inline-json] [flags]` | Run a specified image on the cluster.
`scale`        | `kubectl scale (-f FILENAME | TYPE NAME | TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]` | Update the size of the specified replication controller.
`stop`        | `kubectl stop` | Deprecated: Instead, see `kubectl delete`.
`version`        | `kubectl version [--client] [flags]` | Display the Kubernetes version running on the client and server.

Remember: For more about command operations, see the [kubectl](/docs/user-guide/kubectl) reference documentation.
-->
Operation       | Syntax    |       Description
-------------------- | -------------------- | --------------------
`annotate`    | `kubectl annotate (-f FILENAME | TYPE NAME | TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]` | 添加或更新一个或多个资源的注释。
`api-versions`    | `kubectl api-versions [flags]` | 列出可用的API版本。
`apply`            | `kubectl apply -f FILENAME [flags]`| 对文件或标准输入流更改资源应用配置。
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | attach 到正在运行的容器来查看输出流或与容器（stdin）进行交互。
`autoscale`    | `kubectl autoscale (-f FILENAME | TYPE NAME | TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]` | 自动缩放一组被replication controller管理的pods。
`cluster-info`    | `kubectl cluster-info [flags]` | 显示有关集群中master节点和服务的端点信息。
`config`        | `kubectl config SUBCOMMAND [flags]` | 修改kubeconfig文件。有关详细信息，请参阅各个子命令。
`create`        | `kubectl create -f FILENAME [flags]` | 从文件或stdin创建一个或多个资源。
`delete`        | `kubectl delete (-f FILENAME | TYPE [NAME | /NAME | -l label | --all]) [flags]` | 从文件，stdin或指定selector，名称，资源选择器或资源中删除资源。
`describe`    | `kubectl describe (-f FILENAME | TYPE [NAME_PREFIX | /NAME | -l label]) [flags]` | 显示一个或多个资源的详细状态。
`edit`        | `kubectl edit (-f FILENAME | TYPE NAME | TYPE/NAME) [flags]` | 使用默认编辑器编辑和更新服务器上一个或多个资源的定义。
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | 对pod中的容器执行命令
`explain`    | `kubectl explain [--include-extended-apis=true] [--recursive=false] [flags]` | 获取各种资源的文档。例如 pods, nodes, services 等.
`expose`        | `kubectl expose (-f FILENAME | TYPE NAME | TYPE/NAME) [--port=port] [--protocol=TCP|UDP] [--target-port=number-or-name] [--name=name] [----external-ip=external-ip-of-service] [--type=type] [flags]` | 将暴露replication controller, service, 或者pod为新的Kubernetes服务。
`get`        | `kubectl get (-f FILENAME | TYPE [NAME | /NAME | -l label]) [--watch] [--sort-by=FIELD] [[-o | --output]=OUTPUT_FORMAT] [flags]` | 列出一个或多个资源。
`label`        | `kubectl label (-f FILENAME | TYPE NAME | TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]` | 添加或更新一个或多个资源的标签
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | 在pod的容器中打印日志。
`patch`        | `kubectl patch (-f FILENAME | TYPE NAME | TYPE/NAME) --patch PATCH [flags]` | 使用strategic merge patch程序更新资源的一个或多个字段。
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | 将一个或多个本地端口转发到pod。
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | 运行一个代理到Kubernetes API服务器。
`replace`        | `kubectl replace -f FILENAME` | 从文件或stdin替换资源。
`rolling-update`    | `kubectl rolling-update OLD_CONTROLLER_NAME ([NEW_CONTROLLER_NAME] --image=NEW_CONTAINER_IMAGE | -f NEW_CONTROLLER_SPEC) [flags]` | 通过逐步替换指定的replication controller及其pod来执行滚动更新。
`run`        | `kubectl run NAME --image=image [--env="key=value"] [--port=port] [--replicas=replicas] [--dry-run=bool] [--overrides=inline-json] [flags]` | 在集群上运行指定的镜像。
`scale`        | `kubectl scale (-f FILENAME | TYPE NAME | TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]` | 更新指定replication controller的副本大小。
`stop`        | `kubectl stop` | 已弃用: 相应的, 请查看 `kubectl delete`.
`version`        | `kubectl version [--client] [flags]` | 显示在客户端和服务器上运行的Kubernetes版本。

请记住：有关命令操作的更多信息，请参阅[kubectl](/docs/user-guide/kubectl)参考文档。
<!--## Resource types-->
## 资源类型

<!--The following table includes a list of all the supported resource types and their abbreviated aliases:-->
下表包括所有支持的资源类型及其缩写别名的列表：

<!--Resource type    | Abbreviated alias-->
资源类型    | 缩写别名
-------------------- | --------------------
`apiservices` |
`certificatesigningrequests` |`csr`
`clusters` |
`clusterrolebindings` |
`clusterroles` |
`componentstatuses` |`cs`
`configmaps` |`cm`
`controllerrevisions` |
`cronjobs` |
`customresourcedefinition` |`crd`
`daemonsets` |`ds`
`deployments` |`deploy`
`endpoints` |`ep`
`events` |`ev`
`horizontalpodautoscalers` |`hpa`
`ingresses` |`ing`
`jobs` |
`limitranges` |`limits`
`namespaces` |`ns`
`networkpolicies` |`netpol`
`nodes` |`no`
`persistentvolumeclaims` |`pvc`
`persistentvolumes` |`pv`
`poddisruptionbudget` |`pdb`
`podpreset` |
`pods` |`po`
`podsecuritypolicies` |`psp`
`podtemplates` |
`replicasets` |`rs`
`replicationcontrollers` |`rc`
`resourcequotas` |`quota`
`rolebindings` |
`roles` |
`secrets` |
`serviceaccounts` |`sa`
`services` |`svc`
`statefulsets` |
`storageclasses` |

<!--## Output options-->
## 输出选项
<!--Use the following sections for information about how you can format or sort the output of certain commands. For details about which commands support the various output options, see the [kubectl](/docs/user-guide/kubectl) reference documentation.-->
请使用以下部分查看如何格式化或排序某些命令的输出的信息，有关哪些命令支持各种输出选项的详细信息，请参阅[kubectl](/docs/user-guide/kubectl)参考文档。

<!--### Formatting output

The default output format for all `kubectl` commands is the human readable plain-text format. To output details to your terminal window in a specific format, you can add either the `-o` or `-output` flags to a supported `kubectl` command.-->
### 格式化输出

所有kubectl命令的默认输出格式是可读的纯文本格式。要以特定格式将详细信息输出到终端窗口，您可以将一个`-o`或多个`-output`标志添加到支持的`kubectl`命令中。

<!--#### Syntax

```shell
kubectl [command] [TYPE] [NAME] -o=<output_format>
```

Depending on the `kubectl` operation, the following output formats are supported:-->
#### 语法

```shell
kubectl [command] [TYPE] [NAME] -o=<output_format>
```

根据kubectl操作，支持以下输出格式:
<!--
Output format | Description
--------------| -----------
`-o=custom-columns=<spec>` | Print a table using a comma separated list of [custom columns](#custom-columns).
`-o=custom-columns-file=<filename>` | Print a table using the [custom columns](#custom-columns) template in the `<filename>` file.
`-o=json`     | Output a JSON formatted API object.
`-o=jsonpath=<template>` | Print the fields defined in a [jsonpath](/docs/user-guide/jsonpath) expression.
`-o=jsonpath-file=<filename>` | Print the fields defined by the [jsonpath](/docs/user-guide/jsonpath) expression in the `<filename>` file.
`-o=name`     | Print only the resource name and nothing else.
`-o=wide`     | Output in the plain-text format with any additional information. For pods, the node name is included.
`-o=yaml`     | Output a YAML formatted API object.-->
输出格式 | 描述
--------------| -----------
`-o=custom-columns=<spec>` | 输出使用逗号分隔的列表打印表格 [custom columns](#custom-columns)。
`-o=custom-columns-file=<filename>` | 使用文件中的[自定义列模板](#custom-columns)打印表`<filename>`。
`-o=json`     | 输出JSON格式的API对象。
`-o=jsonpath=<template>` | 打印在[jsonpath](/docs/user-guide/jsonpath)表达式中定义的字段
`-o=jsonpath-file=<filename>` | 打印由文件中的[jsonpath](/docs/user-guide/jsonpath)表达式定义的字段`<filename>`。
`-o=name`     | 仅打印资源名称，没有其他的。
`-o=wide`     | 以纯文本格式输出任何附加信息。对于pod，包括节点名称。
`-o=yaml`     | 输出YAML格式的API对象。


<!--##### Example

In this example, the following command outputs the details for a single pod as a YAML formatted object:

`$ kubectl get pod web-pod-13je7 -o=yaml`

Remember: See the [kubectl](/docs/user-guide/kubectl) reference documentation for details about which output format is supported by each command.-->
例子

在此示例中，以下命令将单个pod的详细信息作为YAML格式化对象输出：
`$ kubectl get pod web-pod-13je7 -o=yaml`
记住：有关每个命令支持哪种输出格式的详细信息，请参阅kubectl参考文档。

<!--#### Custom columns

To define custom columns and output only the details that you want into a table, you can use the `custom-columns` option. You can choose to define the custom columns inline or use a template file: `-o=custom-columns=<spec>` or `-o=custom-columns-file=<filename>`.-->
自定义列

要定义自定义列并仅将所需的详细信息输出到表中，可以使用该custom-columns选项。您可以选择内联定义自定义列或使用模板文件：`-o=custom-columns=<spec>`或`-o=custom-columns-file=<filename>`。

<!--##### Examples-->
##### 例子

<!--Inline:-->
一致：

```shell
$ kubectl get pods <pod-name> -o=custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

<!--Template file:-->
模版文件：

```shell
$ kubectl get pods <pod-name> -o=custom-columns-file=template.txt
```

<!--where the `template.txt` file contains:-->
该`template.txt`文件包含：

```
NAME                    RSRC
metadata.name           metadata.resourceVersion
```
<!--The result of running either command is:-->
运行任一命令的结果是：

```shell
NAME           RSRC
submit-queue   610995
```

<!--### Sorting list objects

To output objects to a sorted list in your terminal window, you can add the `--sort-by` flag to a supported `kubectl` command. Sort your objects by specifying any numeric or string field with the `--sort-by` flag. To specify a field, use a [jsonpath](/docs/user-guide/jsonpath) expression.-->
### 排序列表对象
要将对象输出到终端窗口中的排序列表，可以将该`--sort-by`标志添加到支持的`kubectl`命令中。通过使用`--sort-by`标志指定任何数字或字符串字段来对对象进行排序。要指定一个字段，请使用[jsonpath](/docs/user-guide/jsonpath)表达式。

<!--#### Syntax-->
#### 语法

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

<!--##### Example

To print a list of pods sorted by name, you run:

`$ kubectl get pods --sort-by=.metadata.name`

## Examples: Common operations

Use the following set of examples to help you familiarize yourself with running the commonly used `kubectl` operations:

`kubectl create` - Create a resource from a file or stdin.-->
##### 例子

要打印按名称排序的pod列表，请运行：

`$ kubectl get pods --sort-by=.metadata.name`

## 示例：常用操作

使用以下一组示例来帮助您熟悉运行常用kubectl操作：

<!--```shell
// Create a service using the definition in example-service.yaml.
$ kubectl create -f example-service.yaml

// Create a replication controller using the definition in example-controller.yaml.
$ kubectl create -f example-controller.yaml

// Create the objects that are defined in any .yaml, .yml, or .json file within the <directory> directory.
$ kubectl create -f <directory>
```-->
```shell
// 使用在example-service.yaml中的定义创建一个service.
$ kubectl create -f example-service.yaml

// 使用在example-controller.yaml中的定义创建一个replication controller.
$ kubectl create -f example-controller.yaml

// 使用在<directory>目录下的any .yaml, .yml, or .json文件创建对象.
$ kubectl create -f <directory>
```

<!--
`kubectl get` - List one or more resources.

```shell
// List all pods in plain-text output format.
$ kubectl get pods

// List all pods in plain-text output format and includes additional information (such as node name).
$ kubectl get pods -o wide

// List the replication controller with the specified name in plain-text output format. Tip: You can shorten and replace the 'replicationcontroller' resource type with the alias 'rc'.
$ kubectl get replicationcontroller <rc-name>

// List all replication controllers and services together in plain-text output format.
$ kubectl get rc,services
```-->
`kubectl get` - 列出一个或更多资源.

```shell
// 使用文本格式列出所有的pods.
$ kubectl get pods

// 使用文本格式列出所有的信息，包含一些额外的信息(比如节点名称).
$ kubectl get pods -o wide

// 使用文本格式列出指定名称的replicationcontroller. 注: 你可以缩短 'replicationcontroller' 资源类型使用别名 'rc'.
$ kubectl get replicationcontroller <rc-name>

// 使用文本格式列出所有的rc,services.
$ kubectl get rc,services
```

<!--`kubectl describe` - Display detailed state of one or more resources.

```shell
// Display the details of the node with name <node-name>.
$ kubectl describe nodes <node-name>

// Display the details of the pod with name <pod-name>.
$ kubectl describe pods/<pod-name>

// Display the details of all the pods that are managed by the replication controller named <rc-name>.
// Remember: Any pods that are created by the replication controller get prefixed with the name of the replication controller.
$ kubectl describe pods <rc-name>-->

```
`kubectl describe` - 显示一个或多个资源的详情状态.

```shell
// 显示指定节点名称的详情信息.
$ kubectl describe nodes <node-name>

// 显示指定pods名称的详情信息.
$ kubectl describe pods/<pod-name>

// 显示所有被名称为<rc-name>的replication controller管理的所有pods的详情信息.
// 请记住: 任何被replication controller的pod的名称前缀为replication controller的名称.
$ kubectl describe pods <rc-name>
```

<!--`kubectl delete` - Delete resources either from a file, stdin, or specifying label selectors, names, resource selectors, or resources.

```shell
// Delete a pod using the type and name specified in the pod.yaml file.
$ kubectl delete -f pod.yaml

// Delete all the pods and services that have the label name=<label-name>.
$ kubectl delete pods,services -l name=<label-name>

// Delete all pods.
$ kubectl delete pods --all
```-->
`kubectl delete` - 从文件, stdin,或者指定的label selectors, 名称,资源选择器, 或者资源去删除资源.

```shell
// 通过 pod.yaml 文件中的资源类型和名称删除一个pod.
$ kubectl delete -f pod.yaml

// 删除所有label名称为name=<label-name>的pods和services.
$ kubectl delete pods,services -l name=<label-name>

// 删除所有pods.
$ kubectl delete pods --all
```

<!--`kubectl exec` - Execute a command against a container in a pod.

```shell
// Get output from running 'date' from pod <pod-name>. By default, output is from the first container.
$ kubectl exec <pod-name> date

// Get output from running 'date' in container <container-name> of pod <pod-name>.
$ kubectl exec <pod-name> -c <container-name> date

// Get an interactive TTY and run /bin/bash from pod <pod-name>. By default, output is from the first container.
$ kubectl exec -ti <pod-name> /bin/bash
```-->
`kubectl exec` - 针对pod中的某个容器执行命令.

```shell
// 在名称为<pod-name>的pod允许 'date' 命令获得输出. 默认，从第一个容器中输出.
$ kubectl exec <pod-name> date

// 在<pod-name>的pod中的<container-name>容器中运行'date'获取输出.
$ kubectl exec <pod-name> -c <container-name> date

// 从名称为<pod-name>的pod获取一个交互的终端和运行/bin/bash. 默认，输出是第一个容器.
$ kubectl exec -ti <pod-name> /bin/bash
```

<!--`kubectl logs` - 输出一个pod的容器日志.

```shell
// Return a snapshot of the logs from pod 名称为<pod-name>的pod.
$ kubectl logs <pod-name>

// Start streaming the logs from pod <pod-name>. This is similar to the 'tail -f' Linux command.
$ kubectl logs -f <pod-name>
```-->

`kubectl logs` - 输出一个pod的容器日志.

```shell
// 从名称为<pod-name>的pod返回日志快照.
$ kubectl logs <pod-name>

// 从名称为<pod-name>的pod中获取日志流. 这个和Linux命令'tail -f'相似.
$ kubectl logs -f <pod-name>
```

<!--## Next steps

Start using the [kubectl](/docs/user-guide/kubectl) commands.-->
## 下一步

开始使用[kubectl](/docs/user-guide/kubectl)命令。
