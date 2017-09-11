---
title: 使用命令式的方式管理 Kubernetes 对象
---

{% capture overview %}
直接使用内置的 `kubectl` 命令行工具，以命令式方式可以快速创建，更新和删除 Kubernetes 对象。本文档介绍了这些命令是如何组织的，以及如何使用它们来管理活动对象。
{% endcapture %}

{% capture body %}

## 权衡

`kubectl` 工具支持三种方式进行对象的管理:

* 命令式的方式
* 命令式的对象配置
* 声明式的对象配置

参见[Kubernetes对象管理](/docs/concepts/tools/kubectl/object-management-overview/)
讨论各种对象管理方式的优缺点.

## 如何创建对象

`kubectl` 工具支持用于创建一些最常用的对象类型的动词驱动命令，这些命令的命名让不熟悉Kubernetes 对象的用户也可以见名知义。

- `run`: 创建一个新的 Deployment 对象以在一个或多个 Pod 中运行 Containers。
- `expose`: 创建一个新的 Service 对象用于负载均衡 Pods 上的的网络流量。
- `autoscale`: 创建一个新的 Autoscaler 对象，来实现 Deployment 等控制器的自动水平拓展。

`kubectl` 工具也支持由对象类型驱动的创建命令。 这些命令支持更多的对象类型，并且对其意图更为明确，但要求用户知道他们打算创建的对象的类型。

 - `create <objecttype> [<subtype>] <instancename>`

某些对象类型具有您可以在“create"命令中指定的子类型。例如，Service对象有ClusterIP，LoadBalancer和NodePort等几种子类型。以下是使用子类型NodePort创建一个服务的示例:

```shell
kubectl create service nodeport <myservicename>
```

在前面的例子中， `create service nodeport`命令叫做 `create service`命令的子命令.

您可以使用 `-h` 标志来查找子命令支持的参数和标志:

```shell
kubectl create service nodeport -h
```

## 如何更新对象

`kubectl` 命令支持一些常见更新操作的动词驱动命令。这些命令的命名方式可以让不熟悉 Kubernetes 对象的用户，在不知道必须设置的特定字段的情况下也可以执行更新操作:

 - `scale`: 通过更新控制器的副本数量，水平扩展控制器以添加或删除 Pod。
 - `annotate`: 从对象添加或删除注释。
 - `label`: 为对象添加或删除标签。

`kubectl`命令还支持由对象的一个​​切面驱动的更新命令.设置此切面可能会为不同的对象类型设置不同的字段:

 - `set` <field>: 设置对象的一个​​切面。

**注**: 在 Kubernetes 版本 1.5 中，并不是每个动词驱动的命令都有一个相关的切面驱动的命令。

`kubectl` 工具支持直接更新活动对象的其他方法，然而，它们需要更好的了解 Kubernetes 对象模式。

- `edit`: 通过在编辑器中打开其配置，直接编辑活动对象的原始配置。
- `patch`: 通过使用补丁字符串直接修改活动对象的特定字段。

有关补丁字符串的更多详细信息，请参阅补丁部分
[API 公约](https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md#patch-operations)。

## 如何删除对象

您可以使用 `delete` 命令从集群中删除一个对象:

 - `delete <type>/<name>`

 **注意**: 您可以对命令式命令和命令式对象配置都使用 `kubectl delete` 方法。两者的差异在于传递的命令参数不同。要将
 `kubectl delete` 作为命令式命令使用，需将要删除的对象作为参数传递。以下是传递名为 nginx 的 Deployment 对象的示例:

```shell
kubectl delete deployment/nginx
```

## 如何查看对象

{% comment %}
TODO(pwittrock): 实现时取消注释。

您可以使用 `kubectl view` 打印对象的指定字段。

- `view`: 打印对象的特定字段的值。

{% endcomment %}



有几个命令用于打印有关对象的信息:

- `get`: 打印有关匹配对象的基本信息。使用 `get -h` 来查看选项列表。
- `describe`: 打印有关匹配对象的聚合详细信息。
- `logs`: 打印 Pod 运行容器的 stdout 和 stderr 信息。

##  使用 `set` 命令在创建之前修改对象

有一些对象字段没有可以在 `create` 命令中使用的标志。在某些情况下，您可以组合使用 `set` 和 `create` 在对象创建之前指定字段的值。这是通过将 `create` 命令的输出管道连接到 `set` 命令，然后回到 `create` 命令。以下是一个例子:

```sh
kubectl create service clusterip <myservicename> -o yaml --dry-run | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

1.  使用 `create service -o yaml --dry-run` 创建服务配置，并将其作为 YAML 打印到 stdout，而不是将其发送到 Kubernetes API 服务器。
1.  使用 `set --local -f - -o yaml` 从 stdin 读取配置，并将更新后的配置作为 YAML 写入 stdout。
1.  使用 `kubectl create -f -` 从 stdin 提供的配置创建对象。

## 使用 `--edit` 在创建之前修改对象

您可以使用 `kubectl create --edit` 命令在对象创建之前，对对象进行任意更改。以下是一个例子:

```sh
kubectl create service clusterip my-svc -o yaml --dry-run > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```

1. 使用`create service` 创建服务的配置并将其保存到 `/tmp/srv.yaml`。
1. 使用`create --edit` 在创建对象之前打开配置文件进行编辑。


{% endcapture %}

{% capture whatsnext %}
 -  [使用对象配置管理 Kubernetes 对象(必要)](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/)
 -  [使用对象配置(声明式)管理 Kubernetes 对象](/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/)
 -  [Kubectl 命令参考](/docs/user-guide/kubectl/v1.6/)
 -  [Kubernetes 对象模式参考](/docs/resources-reference/v1.6/)
 {% endcapture %}

 {% include templates/concept.md %}
