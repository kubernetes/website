---
title: 日志架构
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

<!--
Application and systems logs can help you understand what is happening inside your cluster. The logs are particularly useful for debugging problems and monitoring cluster activity. Most modern applications have some kind of logging mechanism; as such, most container engines are likewise designed to support some kind of logging. The easiest and most embraced logging method for containerized applications is to write to the standard output and standard error streams.
-->
应用程序日志和系统日志可以帮助您了解群集内部发生了什么。它们对于调试问题和监视集群活动也是特别有用的。大多数的现代化的应用程序都有某种日志记录机制; 同样地，大多数容器引擎设计的时候就考虑到了支持某种日志记录机制。对于容器化的应用程序来说，最简单而又最受欢迎的日志记录方法是写到标准输出和标准错误流中。

<!--
However, the native functionality provided by a container engine or runtime is usually not enough for a complete logging solution. For example, if a container crashes, a pod is evicted, or a node dies, you'll usually still want to access your application's logs. As such, logs should have a separate storage and lifecycle independent of nodes, pods, or containers. This concept is called _cluster-level-logging_. Cluster-level logging requires a separate backend to store, analyze, and query logs. Kubernetes provides no native storage solution for log data, but you can integrate many existing logging solutions into your Kubernetes cluster.
-->
然而，容器引擎或运行时提供的原生功能通常不满足完整的日志记录解决方案。例如，通常如果容器崩溃，pod被驱逐，或节点死亡，您仍然希望能够访问应用程序的日志。因此，日志记录应具有独立于节点、pod或容器的存储和生命周期。这个概念称为_集群级日志记录_。集群级日志记录需要单独的后端来存储，分析和查询日志。Kubernetes自身不提供日志数据的存储解决方案，但您可以将许多现有的日志记录解决方案集成到Kubernetes集群中。

{{% /capture %}}

{{% capture body %}}
<!--
Cluster-level logging architectures are described in assumption that
a logging backend is present inside or outside of your cluster. If you're
not interested in having cluster-level logging, you might still find
the description of how logs are stored and handled on the node to be useful.
-->
集群级日志记录架构假设你在集群内部或外部存在记录日志的后端。即使您对集群级别的日志记录不感兴趣，了解在节点上是如何存储和处理日志也是非常有用的。

<!-- ## Basic logging in Kubernetes -->
## Kubernetes中的基本日志记录

<!--
In this section, you can see an example of basic logging in Kubernetes that
outputs data to the standard output stream. This demonstration uses
a [pod specification](/examples/debug/counter-pod.yaml) with
a container that writes some text to standard output once per second.
-->
在本节中，您可以看到在Kubernetes中日志记录的基本示例，该示例将数据输出到标准输出。此演示使用的[pod规范](/examples/debug/counter-pod.yaml)中，容器每秒将一些文本写入到标准输出。

{{< codenew file="debug/counter-pod.yaml" >}}

<!-- To run this pod, use the following command: -->
要运行此pod，请使用以下命令：

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```
<!-- The output is: -->
输出是：
```
pod/counter created
```
<!-- To fetch the logs, use the `kubectl logs` command, as follows: -->
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
<!-- You can use `kubectl logs` to retrieve logs from a previous instantiation of a container with `--previous` flag, in case the container has crashed. If your pod has multiple containers, you should specify which container's logs you want to access by appending a container name to the command. See the [`kubectl logs` documentation](/docs/reference/generated/kubectl/kubectl-commands#logs) for more details. -->
如果容器已崩溃，您可以使用`kubectl logs --previous`从先前实例化的的容器中获取日志。如果您的pod有多个容器，则应通过在命令中附加容器名称来指定要访问的容器的日志。有关详细信息，请参阅[kubectl logs文档](/docs/reference/generated/kubectl/kubectl-commands#logs)。


<!-- ## Logging at the node level -->
## 节点级别的日志记录

![节点级别的日志记录](/images/docs/user-guide/logging/logging-node-level.png)
<!--
Everything a containerized application writes to `stdout` and `stderr` is handled and redirected somewhere by a container engine. For example, the Docker container engine redirects those two streams to [a logging driver](https://docs.docker.com/engine/admin/logging/overview), which is configured in Kubernetes to write to a file in json format.
-->
容器化的应用程序写入到`stdout`和`stderr`的一切都会被容器运行时处理和重定向。例如，Docker容器引擎将这两个流重定向到Kubernetes中配置为以json格式写入到文件的[日志驱动程序](https://docs.docker.com/engine/admin/logging/overview)。

{{< note >}}
<!-- The Docker json logging driver treats each line as a separate message. When using the Docker logging driver, there is no direct support for multi-line messages. You need to handle multi-line messages at the logging agent level or higher. -->
注意： Docker json日志记录驱动程序将每行视为单独的消息。使用Docker日志记录驱动程序时，不直接支持多行消息。您需要在日志代理级别或更高级别处理多行消息。
{{< /note >}}

<!--
By default, if a container restarts, the kubelet keeps one terminated container with its logs. If a pod is evicted from the node, all corresponding containers are also evicted, along with their logs.
-->
默认情况下，如果一个容器重新启动，则kubelet会使用其日志保留一个已终止的容器。如果从节点中逐出pod，则所有相应的容器也会被逐出，以及它们的日志。

<!--
An important consideration in node-level logging is implementing log rotation,
so that logs don't consume all available storage on the node. Kubernetes
currently is not responsible for rotating logs, but rather a deployment tool
should set up a solution to address that.
For example, in Kubernetes clusters, deployed by the `kube-up.sh` script,
there is a [`logrotate`](https://linux.die.net/man/8/logrotate)
tool configured to run each hour. You can also set up a container runtime to
rotate application's logs automatically, e.g. by using Docker's `log-opt`.
In the `kube-up.sh` script, the latter approach is used for COS image on GCP,
and the former approach is used in any other environment. In both cases, by
default rotation is configured to take place when log file exceeds 10MB.
-->
节点级日志记录中的一个需要重要考虑的问题是实现日志轮换，以便日志不会占用节点上的所有可用存储。Kubernetes目前不负责轮换日志，因此部署工具应该设置解决方案来解决这个问题。例如，在`kube-up.sh`脚本部署的Kubernetes集群中，有一个[logrotate](https://linux.die.net/man/8/logrotate) 工具配置为每小时运行一次。您还可以设置容器运行时以自动轮换应用程序的日志，例如使用Docker 的`log-opt`。在`kube-up.sh`脚本中，后一种方法用于GCP上的COS映像，前一种方法用于任何其他环境。在这两种情况下，默认情况下，轮换配置为在日志文件超过10MB时发生。

<!--
As an example, you can find detailed information about how `kube-up.sh` sets
up logging for COS image on GCP in the corresponding [script][cosConfigureHelper].
-->
例如，您可以在`kube-up.sh`在相应的脚本中找到有关如何在GCP上设置COS映像日志记录的详细信息。

<!--
When you run [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) as in
the basic logging example, the kubelet on the node handles the request and
reads directly from the log file, returning the contents in the response.
-->
当您在基本日志记录示例中运行[`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) ，节点上的kubelet会处理请求并直接从日志文件中读取，并返回响应中的内容。

{{< note >}}
<!--
Currently, if some external system has performed the rotation,
only the contents of the latest log file will be available through
`kubectl logs`. E.g. if there's a 10MB file, `logrotate` performs
the rotation and there are two files, one 10MB in size and one empty,
`kubectl logs` will return an empty response.
-->
目前, 如果一些外部系统执行了日志轮转, 通过`kubectl logs`只能从最新的日志文件查看到日志。 也就是说如果文件超过了10mb，`logrotate`会执行日志轮转， 如果有两个文件，一个是10MB，一个是空的，那么`kubectl logs` 会返回空的响应。
{{< /note >}}
[cosConfigureHelper]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh

<!-- ### System component logs -->
### 系统组件日志

<!-- There are two types of system components: those that run in a container and those
that do not run in a container. For example: -->
系统组件有两种类型：在容器中运行的和不在容器中运行的。例如：

<!-- * The Kubernetes scheduler and kube-proxy run in a container. -->
* 在容器中运行的 kube-scheduler 和kube-proxy。
<!-- * The kubelet and container runtime, for example Docker, do not run in containers. -->
* 不在容器中运行的 kubelet 和容器运行时（例如Docker）。

<!--
On machines with systemd, the kubelet and container runtime write to journald. If
systemd is not present, they write to `.log` files in the `/var/log` directory.
System components inside containers always write to the `/var/log` directory,
bypassing the default logging mechanism. They use the [klog][klog]
logging library. You can find the conventions for logging severity for those
components in the [development docs on logging](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).
-->
在具有systemd的机器上，kubelet和容器运行时写入日志到journald。如果systemd不存在，它们将写入`/var/log`目录中的`.log`文件中。容器内的系统组件始终写入`/var/log`目录，绕过默认的日志记录机制。他们使用[klog][klog]日志库。您可以在[日志记录的开发文档](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)中找到关于这些组件的日志级别的约定。

<!--
Similarly to the container logs, system component logs in the `/var/log`
directory should be rotated. In Kubernetes clusters brought up by
the `kube-up.sh` script, those logs are configured to be rotated by
the `logrotate` tool daily or once the size exceeds 100MB.
-->
与容器日志类似，/var/log 应该旋转目录中的系统组件日志。在`kube-up.sh`脚本提供的Kubernetes集群中，这些日志配置为每天或一旦大小超过100MB由工具`logrotate`轮换。

[klog]: https://github.com/kubernetes/klog

<!-- ## Cluster-level logging architectures -->
## 集群级日志记录架构

<!-- While Kubernetes does not provide a native solution for cluster-level logging, there are several common approaches you can consider. Here are some options: -->
虽然Kubernetes没有为集群级日志记录提供原生的解决方案，但您可以考虑几种常见的方法。以下是一些选项：

<!-- * Use a node-level logging agent that runs on every node. -->
* 使用在每个节点上运行的节点级日志记录代理。
<!-- * Include a dedicated sidecar container for logging in an application pod. -->
* 在Pod中使用专用于记录日志的边车容器。
<!-- * Push logs directly to a backend from within an application. -->
* 将日志直接从应用程序中推送到日志记录后端。

<!-- ### Using a node logging agent -->
### 使用节点日志记录代理

![使用节点日志记录代理](/images/docs/user-guide/logging/logging-with-node-agent.png)

<!-- You can implement cluster-level logging by including a _node-level logging agent_ on each node. The logging agent is a dedicated tool that exposes logs or pushes logs to a backend. Commonly, the logging agent is a container that has access to a directory with log files from all of the application containers on that node. -->
您可以通过在每个节点上使用 _节点级的日志记录代理_ 来实现群集级日志记录。日志记录代理是一种用于暴露日志或将日志推送到后端的专用工具。通常，日志记录代理程序是一个容器，它可以访问包含该节点上所有应用程序容器的日志文件的目录。

<!-- Because the logging agent must run on every node, it's common to implement it as either a DaemonSet replica, a manifest pod, or a dedicated native process on the node. However the latter two approaches are deprecated and highly discouraged. -->
由于日志记录代理必须在每个节点上运行，它可以用DaemonSet副本，Pod 或 本机进程来实现它的。然而，后两种方法被弃用并且非常不别推荐。

<!-- Using a node-level logging agent is the most common and encouraged approach for a Kubernetes cluster, because it creates only one agent per node, and it doesn't require any changes to the applications running on the node. However, node-level logging _only works for applications' standard output and standard error_. -->
对于Kubernetes集群，使用节点级日志记录代理是最常见和鼓励的方法，因为它每个节点只创建一个代理，并且不需要对节点上运行的应用程序进行任何更改。然而，节点级日志记录 _仅适用于应用程序的标准输出和标准错误_。

<!-- Kubernetes doesn't specify a logging agent, but two optional logging agents are packaged with the Kubernetes release: [Stackdriver Logging](/docs/user-guide/logging/stackdriver) for use with Google Cloud Platform, and [Elasticsearch](/docs/user-guide/logging/elasticsearch). You can find more information and instructions in the dedicated documents. Both use [fluentd](http://www.fluentd.org/) with custom configuration as an agent on the node. -->
虽然Kubernetes中没有指定日志代理，但是两个可选的日志代理与Kubernetes版本一起打包：用于Google Cloud Platform的[Stackdriver Logging](/docs/user-guide/logging/stackdriver)和[Elasticsearch](/docs/user-guide/logging/elasticsearch)。您可以在专用文档中找到更多信息和说明。两者都使用了自定义的配置的[fluentd](http://www.fluentd.org/)作为节点上的代理。

<!-- ### Using a sidecar container with the logging agent -->
### 使用带有日志记录代理的边车容器

<!-- You can use a sidecar container in one of the following ways: -->
您可以通过以下方式使用边车容器：

<!-- * The sidecar container streams application logs to its own `stdout`. -->
* sidecar容器将应用程序日志流式传输到自己的`stdout`。
<!-- * The sidecar container runs a logging agent, which is configured to pick up logs from an application container. -->
* sidecar容器运行日志记录代理程序，该代理程序配置为从应用程序容器中获取日志。

<!-- #### Streaming sidecar container -->
#### Streaming到sidecar容器

![Sidecar container with a streaming container](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

<!--
By having your sidecar containers stream to their own `stdout` and `stderr`
streams, you can take advantage of the kubelet and the logging agent that
already run on each node. The sidecar containers read logs from a file, a socket,
or the journald. Each individual sidecar container prints log to its own `stdout`
or `stderr` stream.
-->
通过让您的sidecar容器streaming到他们自己的 `stdout`和`stderr`，您可以利用已经在每个节点上运行的kubelet和日志记录代理。
sidecar容器从文件，套接字或日志中读取日志。每个单独的sidecar容器将日志打印到其自己`stdout` 或 `stderr`。

<!--
This approach allows you to separate several log streams from different
parts of your application, some of which can lack support
for writing to `stdout` or `stderr`. The logic behind redirecting logs
is minimal, so it's hardly a significant overhead. Additionally, because
`stdout` and `stderr` are handled by the kubelet, you can use built-in tools
like `kubectl logs`.
-->
这种方法允许您将日志流从应用程序的不同部分分离开，其中一些可能缺乏对写入`stdout`或`stderr`的支持。重定向日志背后的逻辑是最小的，因此它的开销几乎可以忽略不计。另外，因为 `stdout`、`stderr`由kubelet处理，你可以使用内置的工具`kubectl logs`。

<!--
Consider the following example. A pod runs a single container, and the container
writes to two different log files, using two different formats. Here's a
configuration file for the Pod:
-->
请考虑以下示例。单个容器的Pod，其中容器使用两种不同的格式写入两个不同的日志文件。这是Pod的配置文件：

{{< codenew file="admin/logging/two-files-counter-pod.yaml" >}}

<!--
It would be a mess to have log entries of different formats in the same log
stream, even if you managed to redirect both components to the `stdout` stream of
the container. Instead, you could introduce two sidecar containers. Each sidecar
container could tail a particular log file from a shared volume and then redirect
the logs to its own `stdout` stream.
-->
即使您设法将两个组件重定向到容器的`stdout`流，在同一个日志流中包含不同格式的日志条目也是一团糟。相反，你可以引入两个边车容器。每个sidecar容器都可以从共享卷中拖出特定的日志文件，然后将日志重定向到自己的`stdout`流。

<!-- Here's a configuration file for a pod that has two sidecar containers: -->
这是一个包含两个sidecar容器的pod的配置文件：

{{< codenew file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" >}}

<!-- Now when you run this pod, you can access each log stream separately by
running the following commands: -->
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

<!--
The node-level agent installed in your cluster picks up those log streams automatically without any further configuration. If you like, you can configure the agent to parse log lines depending on the source container.
-->
集群中安装的节点级代理会自动获取这些日志流，而无需进一步配置。如果你愿意，可以将代理配置为根据源容器解析日志行。

<!--
Note, that despite low CPU and memory usage (order of couple of millicores
for cpu and order of several megabytes for memory), writing logs to a file and
then streaming them to `stdout` can double disk usage. If you have
an application that writes to a single file, it's generally better to set
`/dev/stdout` as destination rather than implementing the streaming sidecar
container approach.
-->
请注意，尽管CPU和内存使用率较低（cpu为几毫微秒，内存为几兆字节），但将日志写入文件然后将其流式传输到`stdout`可以使磁盘使用量增加一倍。如果您有一个写入单个文件的应用程序，通常最好将其设置 `/dev/stdout`为目标而不是 流式边车容器方式。

<!--
Sidecar containers can also be used to rotate log files that cannot be
rotated by the application itself. An example
of this approach is a small container running logrotate periodically.
However, it's recommended to use `stdout` and `stderr` directly and leave rotation
and retention policies to the kubelet.
-->
Sidecar容器还可用于旋转应用程序本身无法旋转的日志文件。这种方法的一个例子是定期运行logrotate的小容器。但是，建议直接使用`stdout`和`stderr`，并将轮换和保留策略保留给kubelet。

<!-- #### Sidecar container with a logging agent -->
#### 带有日志记录代理的sidecar容器

![带有日志记录代理的sidecar容器](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

<!--
If the node-level logging agent is not flexible enough for your situation, you
can create a sidecar container with a separate logging agent that you have
configured specifically to run with your application.
-->
如果节点级日志记录代理程序对于你的场景来说不够灵活，您可以创建一个带有单独日志记录代理程序的sidecar容器，将代理程序专门配置为与您的应用程序一起运行。

{{< note >}}
<!--
Using a logging agent in a sidecar container can lead
to significant resource consumption. Moreover, you won't be able to access
those logs using `kubectl logs` command, because they are not controlled
by the kubelet.
-->
使用带有日志记录代理的sidecar容器可能会有资源损耗。 而且你不能通过`kubectl logs`访问到这些日志，因为他们不受kubelet控制
{{< /note >}}

<!--
As an example, you could use [Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/),
which uses fluentd as a logging agent. Here are two configuration files that
you can use to implement this approach. The first file contains
a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) to configure fluentd.
-->
举个例子，你可以使用[Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/)，它使用fluentd作为日志记录代理。以下是两个可用于实现此方法的配置文件。第一个文件包含配置fluentd的[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)。

{{< codenew file="admin/logging/fluentd-sidecar-config.yaml" >}}

{{< note >}}
<!--
The configuration of fluentd is beyond the scope of this article. For
information about configuring fluentd, see the
[official fluentd documentation](http://docs.fluentd.org/).
-->
配置fluentd超出了本文的范围。要知道更多的关于如何配置fluentd，请参考[fluentd 官方文档](http://docs.fluentd.org/).
{{< /note >}}

<!--
The second file describes a pod that has a sidecar container running fluentd.
The pod mounts a volume where fluentd can pick up its configuration data.
-->
第二个文件描述了一个运行了fluentd的sidecar容器的pod。该pod映射了一个卷，fluentd可以从中获取其配置数据。

{{< codenew file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" >}}

<!-- After some time you can find log messages in the Stackdriver interface. -->
一段时间后，您可以在Stackdriver界面中找到日志消息。

<!--
Remember, that this is just an example and you can actually replace fluentd
with any logging agent, reading from any source inside an application
container.
-->

请记住，这只是一个示例，您实际上可以用任何日志代理替换fluentd，从应用程序容器内的任何源读取日志。

<!-- ### Exposing logs directly from the application -->
### 直接从应用程序暴露日志

![直接从应用程序暴露日志](/images/docs/user-guide/logging/logging-from-application.png)

<!-- You can implement cluster-level logging by exposing or pushing logs directly from
every application; however, the implementation for such a logging mechanism
is outside the scope of Kubernetes.
-->
您可以通过直接从每个应用程序公开或推送日志来实现集群级日志记录; 但是，这种日志记录机制的实现超出了Kubernetes的范围。

{{% /capture %}}
