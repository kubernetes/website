---
title: 日志架构
content_type: concept
weight: 60
---
<!--
reviewers:
- piosz
- x13n
title: Logging Architecture
content_type: concept
weight: 60
-->
<!-- overview -->

<!--
Application logs can help you understand what is happening inside your application. The logs are particularly useful for debugging problems and monitoring cluster activity. Most modern applications have some kind of logging mechanism. Likewise, container engines are designed to support logging. The easiest and most adopted logging method for containerized applications is writing to standard output and standard error streams.
-->
应用日志可以让你了解应用内部的运行状况。日志对调试问题和监控集群活动非常有用。
大部分现代化应用都有某种日志记录机制。同样地，容器引擎也被设计成支持日志记录。
针对容器化应用，最简单且最广泛采用的日志记录方式就是写入标准输出和标准错误流。

<!--
However, the native functionality provided by a container engine or runtime is usually not enough for a complete logging solution.
For example, you may want access your application's logs if a container crashes; a pod gets evicted; or a node dies,
In a cluster, logs should have a separate storage and lifecycle independent of nodes, pods, or containers. This concept is called _cluster-level-logging_.
-->
但是，由容器引擎或运行时提供的原生功能通常不足以构成完整的日志记录方案。
例如，如果发生容器崩溃、Pod 被逐出或节点宕机等情况，你可能想访问应用日志。
在集群中，日志应该具有独立的存储和生命周期，与节点、Pod 或容器的生命周期相独立。
这个概念叫 _集群级的日志_ 。

<!-- body -->

<!--
Cluster-level logging architectures require a separate backend to store, analyze, and query logs. Kubernetes
does not provide a native storage solution for log data. Instead, there are many logging solutions that
integrate with Kubernetes. The following sections describe how to handle and store logs on nodes.
-->
集群级日志架构需要一个独立的后端用来存储、分析和查询日志。
Kubernetes 并不为日志数据提供原生的存储解决方案。
相反，有很多现成的日志方案可以集成到 Kubernetes 中。
下面各节描述如何在节点上处理和存储日志。

<!--
## Basic logging in Kubernetes

This example uses a `Pod` specification with a container
to write text to the standard output stream once per second.
-->
## Kubernetes 中的基本日志记录

这里的示例使用包含一个容器的 Pod 规约，每秒钟向标准输出写入数据。

{{< codenew file="debug/counter-pod.yaml" >}}

<!--
To run this pod, use the following command:
-->
用下面的命令运行 Pod：

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```

<!--
The output is:
-->
输出结果为：

```
pod/counter created
```

<!--
To fetch the logs, use the `kubectl logs` command, as follows:
-->
像下面这样，使用 `kubectl logs` 命令获取日志:

```shell
kubectl logs counter
```

<!--
The output is:
-->
输出结果为：

```
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

<!--
You can use `kubectl logs --previous` to retrieve logs from a previous instantiation of a container..If your pod has multiple containers, specify which container's logs you want to access by appending a container name to the command. See the [`kubectl logs` documentation](/docs/reference/generated/kubectl/kubectl-commands#logs) for more details.
-->
你可以使用命令 `kubectl logs --previous` 检索之前容器实例的日志。
如果 Pod 中有多个容器，你应该为该命令附加容器名以访问对应容器的日志。
详见 [`kubectl logs` 文档](/docs/reference/generated/kubectl/kubectl-commands#logs)。

<!--
## Logging at the node level

![Node level logging](/images/docs/user-guide/logging/logging-node-level.png)
-->
## 节点级日志记录

![节点级别的日志记录](/images/docs/user-guide/logging/logging-node-level.png)

<!--
A container engine handles and redirects any output generated to a containerized application's `stdout` and `stderr` streams.
For example, the Docker container engine redirects those two streams to [a logging driver](https://docs.docker.com/engine/admin/logging/overview), which is configured in Kubernetes to write to a file in JSON format.
-->
容器化应用写入 `stdout` 和 `stderr` 的任何数据，都会被容器引擎捕获并被重定向到某个位置。
例如，Docker 容器引擎将这两个输出流重定向到某个
[日志驱动（Logging Driver）](https://docs.docker.com/engine/admin/logging/overview) ，
该日志驱动在 Kubernetes 中配置为以 JSON 格式写入文件。

<!--
The Docker json logging driver treats each line as a separate message. When using the Docker logging driver, there is no direct support for multi-line messages. You need to handle multi-line messages at the logging agent level or higher.
-->
{{< note >}}
Docker JSON 日志驱动将日志的每一行当作一条独立的消息。
该日志驱动不直接支持多行消息。你需要在日志代理级别或更高级别处理多行消息。
{{< /note >}}

<!--
By default, if a container restarts, the kubelet keeps one terminated container with its logs. If a pod is evicted from the node, all corresponding containers are also evicted, along with their logs.
-->
默认情况下，如果容器重启，kubelet 会保留被终止的容器日志。
如果 Pod 在工作节点被驱逐，该 Pod 中所有的容器也会被驱逐，包括容器日志。

<!--
An important consideration in node-level logging is implementing log rotation,
so that logs don't consume all available storage on the node. Kubernetes
is not responsible for rotating logs, but rather a deployment tool
should set up a solution to address that.
For example, in Kubernetes clusters, deployed by the `kube-up.sh` script,
there is a [`logrotate`](https://linux.die.net/man/8/logrotate)
tool configured to run each hour. You can also set up a container runtime to
rotate application's logs automatically.
-->
节点级日志记录中，需要重点考虑实现日志的轮转，以此来保证日志不会消耗节点上全部可用空间。
Kubernetes 并不负责轮转日志，而是通过部署工具建立一个解决问题的方案。
例如，在用 `kube-up.sh` 部署的 Kubernetes 集群中，存在一个
[`logrotate`](https://linux.die.net/man/8/logrotate)，每小时运行一次。
你也可以设置容器运行时来自动地轮转应用日志。

<!--
As an example, you can find detailed information about how `kube-up.sh` sets
up logging for COS image on GCP in the corresponding
[`configure-helper` script](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh).
-->
例如，你可以找到关于 `kube-up.sh` 为 GCP 环境的 COS 镜像设置日志的详细信息，
脚本为
[`configure-helper` 脚本](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh)。

<!--
When you run [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) as in
the basic logging example, the kubelet on the node handles the request and
reads directly from the log file. The kubelet returns the content of the log file.
-->
当运行 [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) 时，
节点上的 kubelet 处理该请求并直接读取日志文件，同时在响应中返回日志文件内容。

<!--
If an external system has performed the rotation,
only the contents of the latest log file will be available through
`kubectl logs`. For example, if there's a 10MB file, `logrotate` performs
the rotation and there are two files: one file that is 10MB in size and a second file that is empty.
`kubectl logs` returns the latest log file which in this example is an empty response.
-->
{{< note >}}
如果有外部系统执行日志轮转，那么 `kubectl logs` 仅可查询到最新的日志内容。
比如，对于一个 10MB 大小的文件，通过 `logrotate` 执行轮转后生成两个文件，
一个 10MB 大小，一个为空，`kubectl logs` 返回最新的日志文件，而该日志文件
在这个例子中为空。
{{< /note >}}

<!--
### System component logs

There are two types of system components: those that run in a container and those
that do not run in a container. For example:
-->
### 系统组件日志

系统组件有两种类型：在容器中运行的和不在容器中运行的。例如：

<!--
* The Kubernetes scheduler and kube-proxy run in a container.
* The kubelet and container runtime do not run in containers.
-->
* 在容器中运行的 kube-scheduler 和 kube-proxy。
* 不在容器中运行的 kubelet 和容器运行时。

<!--
On machines with systemd, the kubelet and container runtime write to journald. If
systemd is not present, the kubelet and container runtime write to `.log` files
in the `/var/log` directory. System components inside containers always write
to the `/var/log` directory, bypassing the default logging mechanism.
They use the [`klog`](https://github.com/kubernetes/klog)
logging library. You can find the conventions for logging severity for those
components in the [development docs on logging](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).
-->
在使用 systemd 机制的服务器上，kubelet 和容器运行时将日志写入到 journald 中。
如果没有 systemd，它们将日志写入到 `/var/log` 目录下的 `.log` 文件中。
容器中的系统组件通常将日志写到 `/var/log` 目录，绕过了默认的日志机制。
他们使用 [klog](https://github.com/kubernetes/klog) 日志库。
你可以在[日志开发文档](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
找到这些组件的日志告警级别约定。

<!--
Similar to the container logs, system component logs in the `/var/log`
directory should be rotated. In Kubernetes clusters brought up by
the `kube-up.sh` script, those logs are configured to be rotated by
the `logrotate` tool daily or once the size exceeds 100MB.
-->
和容器日志类似，`/var/log` 目录中的系统组件日志也应该被轮转。
通过脚本 `kube-up.sh` 启动的 Kubernetes 集群中，日志被工具 `logrotate`
执行每日轮转，或者日志大小超过 100MB 时触发轮转。

<!--
## Cluster-level logging architectures

While Kubernetes does not provide a native solution for cluster-level logging, there are several common approaches you can consider. Here are some options:

* Use a node-level logging agent that runs on every node.
* Include a dedicated sidecar container for logging in an application pod.
* Push logs directly to a backend from within an application.
-->
## 集群级日志架构

虽然Kubernetes没有为集群级日志记录提供原生的解决方案，但你可以考虑几种常见的方法。
以下是一些选项：

* 使用在每个节点上运行的节点级日志记录代理。
* 在应用程序的 Pod 中，包含专门记录日志的边车（Sidecar）容器。
* 将日志直接从应用程序中推送到日志记录后端。

<!--
### Using a node logging agent

![Using a node level logging agent](/images/docs/user-guide/logging/logging-with-node-agent.png)
-->
### 使用节点级日志代理

![使用节点日志记录代理](/images/docs/user-guide/logging/logging-with-node-agent.png)

<!--
You can implement cluster-level logging by including a _node-level logging agent_ on each node. The logging agent is a dedicated tool that exposes logs or pushes logs to a backend. Commonly, the logging agent is a container that has access to a directory with log files from all of the application containers on that node.
-->
你可以通过在每个节点上使用 _节点级的日志记录代理_ 来实现群集级日志记录。
日志记录代理是一种用于暴露日志或将日志推送到后端的专用工具。
通常，日志记录代理程序是一个容器，它可以访问包含该节点上所有应用程序容器的日志文件的目录。

<!--
Because the logging agent must run on every node, it's common to run the agent
as a `DaemonSet`.
Node-level logging creates only one agent per node, and doesn't require any changes to the applications running on the node. 
-->
由于日志记录代理必须在每个节点上运行，通常可以用 `DaemonSet` 的形式运行该代理。
节点级日志在每个节点上仅创建一个代理，不需要对节点上的应用做修改。

<!--
Containers write stdout and stderr, but with no agreed format. A node-level agent collects these logs and forwards them for aggregation.
-->
容器向标准输出和标准错误输出写出数据，但在格式上并不统一。
节点级代理
收集这些日志并将其进行转发以完成汇总。

<!--
### Using a sidecar container with the logging agent {#sidecar-container-with-logging-agent}

You can use a sidecar container in one of the following ways:
-->
### 使用 sidecar 容器运行日志代理   {#sidecar-container-with-logging-agent}

你可以通过以下方式之一使用边车（Sidecar）容器：

<!--
* The sidecar container streams application logs to its own `stdout`.
* The sidecar container runs a logging agent, which is configured to pick up logs from an application container.
-->
* 边车容器将应用程序日志传送到自己的标准输出。
* 边车容器运行一个日志代理，配置该日志代理以便从应用容器收集日志。

<!--
#### Streaming sidecar container

![Sidecar container with a streaming container](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

By having your sidecar containers stream to their own `stdout` and `stderr`
streams, you can take advantage of the kubelet and the logging agent that
already run on each node. The sidecar containers read logs from a file, a socket,
or the journald. Each sidecar container prints log to its own `stdout` or `stderr` stream.
-->
#### 传输数据流的 sidecar 容器

![带数据流容器的边车容器](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

利用边车容器向自己的 `stdout` 和 `stderr` 传输流的方式，
你就可以利用每个节点上的 kubelet 和日志代理来处理日志。
边车容器从文件、套接字或 journald 读取日志。
每个边车容器向自己的 `stdout` 和 `stderr` 流中输出日志。

<!--
This approach allows you to separate several log streams from different
parts of your application, some of which can lack support
for writing to `stdout` or `stderr`. The logic behind redirecting logs
is minimal, so it's hardly a significant overhead. Additionally, because
`stdout` and `stderr` are handled by the kubelet, you can use built-in tools
like `kubectl logs`.
-->
这种方法允许你将日志流从应用程序的不同部分分离开，其中一些可能缺乏对写入
`stdout` 或 `stderr` 的支持。重定向日志背后的逻辑是最小的，因此它的开销几乎可以忽略不计。
另外，因为 `stdout`、`stderr` 由 kubelet 处理，你可以使用内置的工具 `kubectl logs`。

<!--
For example, a pod runs a single container, and the container
writes to two different log files, using two different formats. Here's a
configuration file for the Pod:
-->
例如，某 Pod 中运行一个容器，该容器向两个文件写不同格式的日志。
下面是这个 pod 的配置文件:

{{< codenew file="admin/logging/two-files-counter-pod.yaml" >}}

<!--
It is not recommended to write log entries with different formats to the same log
stream, even if you managed to redirect both components to the `stdout` stream of
the container. Instead, you can create two sidecar containers. Each sidecar
container could tail a particular log file from a shared volume and then redirect
the logs to its own `stdout` stream.
-->
不建议在同一个日志流中写入不同格式的日志条目，即使你成功地将其重定向到容器的
`stdout` 流。相反，你可以创建两个边车容器。每个边车容器可以从共享卷
跟踪特定的日志文件，并将文件内容重定向到各自的 `stdout` 流。

<!--
Here's a configuration file for a pod that has two sidecar containers:
-->
下面是运行两个边车容器的 Pod 的配置文件：

{{< codenew file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" >}}

<!--
Now when you run this pod, you can access each log stream separately by
running the following commands:
-->
现在当你运行这个 Pod 时，你可以运行如下命令分别访问每个日志流：

```shell
kubectl logs counter count-log-1
```

<!--
The output is:
-->
输出为：

```console
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

```shell
kubectl logs counter count-log-2
```

<!--
The output is:
-->
输出为：

```console
Mon Jan  1 00:00:00 UTC 2001 INFO 0
Mon Jan  1 00:00:01 UTC 2001 INFO 1
Mon Jan  1 00:00:02 UTC 2001 INFO 2
...
```

<!--
The node-level agent installed in your cluster picks up those log streams
automatically without any further configuration. If you like, you can configure
the agent to parse log lines depending on the source container.
-->
集群中安装的节点级代理会自动获取这些日志流，而无需进一步配置。
如果你愿意，你也可以配置代理程序来解析源容器的日志行。

<!--
Note, that despite low CPU and memory usage (order of couple of millicores
for cpu and order of several megabytes for memory), writing logs to a file and
then streaming them to `stdout` can double disk usage. If you have
an application that writes to a single file, it's generally better to set
`/dev/stdout` as destination rather than implementing the streaming sidecar
container approach.
-->
注意，尽管 CPU 和内存使用率都很低（以多个 CPU 毫核指标排序或者按内存的兆字节排序），
向文件写日志然后输出到 `stdout` 流仍然会成倍地增加磁盘使用率。
如果你的应用向单一文件写日志，通常最好设置 `/dev/stdout` 作为目标路径，
而不是使用流式的边车容器方式。

<!--
Sidecar containers can also be used to rotate log files that cannot be
rotated by the application itself. An example of this approach is a small container running logrotate periodically.
However, it's recommended to use `stdout` and `stderr` directly and leave rotation
and retention policies to the kubelet.
-->
应用本身如果不具备轮转日志文件的功能，可以通过边车容器实现。
该方式的一个例子是运行一个小的、定期轮转日志的容器。
然而，还是推荐直接使用 `stdout` 和 `stderr`，将日志的轮转和保留策略
交给 kubelet。

<!--
#### Sidecar container with a logging agent

![Sidecar container with a logging agent](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)
-->
### 具有日志代理功能的边车容器

![含日志代理的边车容器](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

<!--
If the node-level logging agent is not flexible enough for your situation, you
can create a sidecar container with a separate logging agent that you have
configured specifically to run with your application.
-->
如果节点级日志记录代理程序对于你的场景来说不够灵活，你可以创建一个
带有单独日志记录代理的边车容器，将代理程序专门配置为与你的应用程序一起运行。

{{< note >}}
<!--
Using a logging agent in a sidecar container can lead
to significant resource consumption. Moreover, you won't be able to access
those logs using `kubectl logs` command, because they are not controlled
by the kubelet.
-->
在边车容器中使用日志代理会带来严重的资源损耗。
此外，你不能使用 `kubectl logs` 命令访问日志，因为日志并没有被 kubelet 管理。
{{< /note >}}

<!--
Here are two configuration files that you can use to implement a sidecar container with a logging agent. The first file contains
a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) to configure fluentd.
-->
下面是两个配置文件，可以用来实现一个带日志代理的边车容器。
第一个文件包含用来配置 fluentd 的
[ConfigMap](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/)。

{{< codenew file="admin/logging/fluentd-sidecar-config.yaml" >}}

{{< note >}}
<!--
For information about configuring fluentd, see the [fluentd documentation](https://docs.fluentd.org/).
-->
要进一步了解如何配置 fluentd，请参考 [fluentd 官方文档](https://docs.fluentd.org/)。
{{< /note >}}

<!--
The second file describes a pod that has a sidecar container running fluentd.
The pod mounts a volume where fluentd can pick up its configuration data.
-->
第二个文件描述了运行 fluentd 边车容器的 Pod 。
flutend 通过 Pod 的挂载卷获取它的配置数据。

{{< codenew file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" >}}

<!--
In the sample configurations, you can replace fluentd with any logging agent, reading from any source inside an application container.
-->
在示例配置中，你可以将 fluentd 替换为任何日志代理，从应用容器内
的任何来源读取数据。

<!--
### Exposing logs directly from the application

![Exposing logs directly from the application](/images/docs/user-guide/logging/logging-from-application.png)
-->
### 从应用中直接暴露日志目录

![直接从应用程序暴露日志](/images/docs/user-guide/logging/logging-from-application.png)

<!--
Cluster-logging that exposes or pushes logs directly from every application is outside the scope of Kubernetes.
-->
从各个应用中直接暴露和推送日志数据的集群日志机制
已超出 Kubernetes 的范围。

