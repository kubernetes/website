---
title: 日志架构
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

应用程序日志和系统日志可以帮助您了解群集内部发生了什么。它们对于调试问题和监视集群活动也是特别有用的。大多数的现代化的应用程序都有某种日志记录机制; 同样地，大多数容器引擎设计的时候就考虑到了支持某种日志记录机制。对于容器化的应用程序来说，最简单而又最受欢迎的日志记录方法是写到标准输出和标准错误流中。

然而，容器引擎或运行时提供的原生功能通常不满足完整的日志记录解决方案。例如，通常如果容器崩溃，pod被驱逐，或节点死亡，您仍然希望能够访问应用程序的日志。因此，日志记录应具有独立于节点、pod或容器的存储和生命周期。这个概念称为_集群级日志记录_。集群级日志记录需要单独的后端来存储，分析和查询日志。Kubernetes自身不提供日志数据的存储解决方案，但您可以将许多现有的日志记录解决方案集成到Kubernetes集群中。

{{% /capture %}}

{{% capture body %}}

通常集群级日志记录架构假设你在集群内部或外部存在记录日志的后端。即使您对集群级别的日志记录不感兴趣，了解在节点上是如何存储和处理日志也是非常有用的。

## Kubernetes中的基本日志记录

在本节中，您可以看到在Kubernetes中日志记录的基本示例，该示例将数据输出到标准输出。此演示使用的[pod规范](/examples/debug/counter-pod.yaml)中，容器每秒将一些文本写入到标准输出。

{{< codenew file="debug/counter-pod.yaml" >}}

要运行此pod，请使用以下命令：

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```
输出是：
```
pod/counter created
```

要获取日志，请按照如下使用 `kubectl logs` 命令
```shell
kubectl logs counter
```
输出是：

```
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

如果容器已崩溃，您可以使用`kubectl logs --previous`从先前实例化的的容器中获取日志。如果您的pod有多个容器，则应通过在命令中附加容器名称来指定要访问的容器的日志。有关详细信息，请参阅[kubectl logs文档](/docs/reference/generated/kubectl/kubectl-commands#logs)。

## 节点级别的日志记录

![Node level logging](/images/docs/user-guide/logging/logging-node-level.png)

容器化的应用程序写入到`stdout`和`stderr`的一切都会被容器运行时处理和重定向。例如，Docker容器引擎将这两个流重定向到Kubernetes中配置为以json格式写入到文件的[日志驱动程序](https://docs.docker.com/engine/admin/logging/overview)。

{{< note >}}
注意： Docker json日志记录驱动程序将每行视为单独的消息。使用Docker日志记录驱动程序时，不直接支持多行消息。您需要在日志代理级别或更高级别处理多行消息。
{{< /note >}}

默认情况下，如果一个容器重新启动，则kubelet会使用其日志保留一个已终止的容器。如果从节点中逐出pod，则所有相应的容器也会被逐出，以及它们的日志。

节点级日志记录中的一个需要重要考虑的问题是实现日志轮换，以便日志不会占用节点上的所有可用存储。Kubernetes目前不负责轮换日志，因此部署工具应该设置解决方案来解决这个问题。例如，在`kube-up.sh`脚本部署的Kubernetes集群中，有一个[logrotate](https://linux.die.net/man/8/logrotate) 工具配置为每小时运行一次。您还可以设置容器运行时以自动轮换应用程序的日志，例如使用Docker 的`log-opt`。在`kube-up.sh`脚本中，后一种方法用于GCP上的COS映像，前一种方法用于任何其他环境。在这两种情况下，默认情况下，轮换配置为在日志文件超过10MB时发生。


例如，您可以在`kube-up.sh`在相应的脚本中找到有关如何在GCP上设置COS映像日志记录的详细信息。

当您在基本日志记录示例中运行[`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) ，节点上的kubelet会处理请求并直接从日志文件中读取，并返回响应中的内容。

{{< note >}}
目前, 如果一些外部系统执行了日志轮转, 通过`kubectl logs`只能从最新的日志文件查看到日志。 也就是说如果文件超过了10mb，`logrotate`会执行日志轮转， 如果有两个文件，一个是10MB，一个是空的，那么`kubectl logs` 会返回空的响应。
{{< /note >}}

[cosConfigureHelper]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh

### 系统组件日志

系统组件有两种类型：在容器中运行的和不在容器中运行的。例如：

* 在容器中运行的 kubernetes scheduler 和kube-proxy。
* 不在容器中运行的 kubelet 和容器运行时（例如Docker）。


在具有systemd的机器上，kubelet和容器运行时写入日志到journald。如果systemd不存在，它们将写入`/var/log`目录中的`.log`文件中。容器内的系统组件始终写入`/var/log`目录，绕过默认的日志记录机制。他们使用[klog][klog]日志库。您可以在[日志记录的开发文档](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)中找到关于这些组件的日志级别的约定。

[klog]: https://github.com/kubernetes/klog

与容器日志类似，/var/log 应该旋转目录中的系统组件日志。在`kube-up.sh`脚本提供的Kubernetes集群中，这些日志配置为每天或一旦大小超过100MB由工具`logrotate`轮换。

## 集群级日志记录架构

虽然Kubernetes没有为集群级日志记录提供原生的解决方案，但您可以考虑几种常见的方法。以下是一些选项：

* 使用在每个节点上运行的节点级日志记录代理。
* 在Pod中使用专用于记录日志的边车容器。
* 将日志直接从应用程序中推送到日志记录后端。

### 使用节点日志记录代理

![Using a node level logging agent](/images/docs/user-guide/logging/logging-with-node-agent.png)

您可以通过在每个节点上使用 _节点级的日志记录代理_ 来实现群集级日志记录。日志记录代理是一种用于暴露日志或将日志推送到后端的专用工具。通常，日志记录代理程序是一个容器，它可以访问包含该节点上所有应用程序容器的日志文件的目录。

由于日志记录代理必须在每个节点上运行，它可以用DaemonSet副本，Pod 或 本机进程来实现它的。然而，后两种方法被弃用并且非常不别推荐。

对于Kubernetes集群，使用节点级日志记录代理是最常见和鼓励的方法，因为它每个节点只创建一个代理，并且不需要对节点上运行的应用程序进行任何更改。然而，节点级日志记录 _仅适用于应用程序的标准输出和标准错误_。


虽然Kubernetes中没有指定日志代理，但是两个可选的日志代理与Kubernetes版本一起打包：用于Google Cloud Platform的[Stackdriver Logging](/docs/user-guide/logging/stackdriver)和[Elasticsearch](/docs/user-guide/logging/elasticsearch)。您可以在专用文档中找到更多信息和说明。两者都使用了自定义的配置的[fluentd](http://www.fluentd.org/)作为节点上的代理。

### 使用带有日志记录代理的边车容器

您可以通过以下方式使用边车容器：

* sidecar容器将应用程序日志流式传输到自己的`stdout`。
* sidecar容器运行日志记录代理程序，该代理程序配置为从应用程序容器中获取日志。

#### Streaming到sidecar容器

![Sidecar container with a streaming container](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

通过让您的sidecar容器streaming到他们自己的 `stdout`和`stderr`，您可以利用已经在每个节点上运行的kubelet和日志记录代理。
sidecar容器从文件，套接字或日志中读取日志。每个单独的sidecar容器将日志打印到其自己`stdout` 或 `stderr`。

这种方法允许您将日志流从应用程序的不同部分分离开，其中一些可能缺乏对写入`stdout`或`stderr`的支持。重定向日志背后的逻辑是最小的，因此它的开销几乎可以忽略不计。另外，因为 `stdout`、`stderr`由kubelet处理，你可以使用内置的工具`kubectl logs`。

请考虑以下示例。单个容器的Pod，其中容器使用两种不同的格式写入两个不同的日志文件。这是Pod的配置文件：

{{< codenew file="admin/logging/two-files-counter-pod.yaml" >}}

即使您设法将两个组件重定向到容器的`stdout`流，在同一个日志流中包含不同格式的日志条目也是一团糟。相反，你可以引入两个边车容器。每个sidecar容器都可以从共享卷中拖出特定的日志文件，然后将日志重定向到自己的`stdout`流。

这是一个包含两个sidecar容器的pod的配置文件：

{{< codenew file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" >}}

现在，当您运行此pod时，可以通过运行以下命令分别访问每个日志流：

```shell
kubectl logs counter count-log-1
```
```
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

```shell
kubectl logs counter count-log-2
```
```
Mon Jan  1 00:00:00 UTC 2001 INFO 0
Mon Jan  1 00:00:01 UTC 2001 INFO 1
Mon Jan  1 00:00:02 UTC 2001 INFO 2
...
```

集群中安装的节点级代理会自动获取这些日志流，而无需进一步配置。如果你愿意，可以将代理配置为根据源容器解析日志行。

请注意，尽管CPU和内存使用率较低（cpu为几毫微秒，内存为几兆字节），但将日志写入文件然后将其流式传输到`stdout`可以使磁盘使用量增加一倍。如果您有一个写入单个文件的应用程序，通常最好将其设置 `/dev/stdout`为目标而不是 流式边车容器方式。

Sidecar容器还可用于旋转应用程序本身无法旋转的日志文件。这种方法的一个例子是定期运行logrotate的小容器。但是，建议直接使用`stdout`和`stderr`，并将轮换和保留策略保留给kubelet。

#### 带有日志记录代理的Sidecar容器

![Sidecar container with a logging agent](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

如果节点级日志记录代理程序对于你的场景来说不够灵活，您可以创建一个带有单独日志记录代理程序的sidecar容器，将代理程序专门配置为与您的应用程序一起运行。


{{< note >}}
使用带有日志记录代理的sidecar容器可能会有资源损耗。 而且你不能通过`kubectl logs`访问到这些日志，因为他们不受kubelet控制
{{< /note >}}

举个例子，你可以使用[Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/)，它使用fluentd作为日志记录代理。以下是两个可用于实现此方法的配置文件。第一个文件包含配置fluentd的[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)。

{{< codenew file="admin/logging/fluentd-sidecar-config.yaml" >}}

{{< note >}}
配置fluentd超出了本文的范围。要知道更多的关于如何配置fluentd，请参考[fluentd 官方文档](http://docs.fluentd.org/).
{{< /note >}}

第二个文件描述了一个运行了fluentd的边车容器的pod。该pod映射了一个卷，fluentd可以从中获取其配置数据。

{{< codenew file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" >}}

一段时间后，您可以在Stackdriver界面中找到日志消息。

请记住，这只是一个示例，您实际上可以用任何日志代理替换fluentd，从应用程序容器内的任何源读取日志。

### 直接从应用程序暴露日志

![Exposing logs directly from the application](/images/docs/user-guide/logging/logging-from-application.png)

您可以通过直接从每个应用程序公开或推送日志来实现集群级日志记录; 但是，这种日志记录机制的实现超出了Kubernetes的范围。

{{% /capture %}}