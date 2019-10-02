---
title: 日志架构
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

<!--
Application and systems logs can help you understand what is happening inside your cluster. The logs are particularly useful for debugging problems and monitoring cluster activity. Most modern applications have some kind of logging mechanism; as such, most container engines are likewise designed to support some kind of logging. The easiest and most embraced logging method for containerized applications is to write to the standard output and standard error streams.
-->

应用和系统日志可以让您了解集群内部的运行状况。日志对调试问题和监控集群活动非常有用。大部分现代化应用都有某种日志记录机制；同样地，大多数容器引擎也被设计成支持某种日志记录机制。针对容器化应用，最简单且受欢迎的日志记录方式就是写入标准输出和标准错误流。

<!--
However, the native functionality provided by a container engine or runtime is usually not enough for a complete logging solution. For example, if a container crashes, a pod is evicted, or a node dies, you'll usually still want to access your application's logs. As such, logs should have a separate storage and lifecycle independent of nodes, pods, or containers. This concept is called _cluster-level-logging_. Cluster-level logging requires a separate backend to store, analyze, and query logs. Kubernetes provides no native storage solution for log data, but you can integrate many existing logging solutions into your Kubernetes cluster.
-->
但是，由容器引擎或 runtime 提供的原生功能通常不足以满足完整的日志记录方案。例如，如果发生容器崩溃、pod 被逐出或节点宕机等情况，您仍然想访问到应用日志。因此，日志应该具有独立的存储和生命周期，与节点、pod 或容器的生命周期相独立。这个概念叫 _集群级的日志_ 。集群级日志方案需要一个独立的后台来存储、分析和查询日志。Kubernetes 没有为日志数据提供原生存储方案，但是您可以集成许多现有的日志解决方案到 Kubernetes 集群中。

{{% /capture %}}


{{% capture body %}}

<!--
Cluster-level logging architectures are described in assumption that
a logging backend is present inside or outside of your cluster. If you're
not interested in having cluster-level logging, you might still find
the description of how logs are stored and handled on the node to be useful.
-->
集群级日志架构假定在集群内部或者外部有一个日志后台。如果您对集群级日志不感兴趣，您仍会发现关于如何在节点上存储和处理日志的描述对您是有用的。

<!--
## Basic logging in Kubernetes

In this section, you can see an example of basic logging in Kubernetes that
outputs data to the standard output stream. This demonstration uses
a [pod specification](/examples/debug/counter-pod.yaml) with
a container that writes some text to standard output once per second.
-->
## Kubernetes 中的基本日志记录

本节，您会看到一个kubernetes 中生成基本日志的例子，该例子中数据被写入到标准输出。
这里通过一个特定的 [pod 规约](/examples/debug/counter-pod.yaml) 演示创建一个容器，并令该容器每秒钟向标准输出写入数据。

{{< codenew file="debug/counter-pod.yaml" >}}

<!--
To run this pod, use the following command:
-->
用下面的命令运行 pod：

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
使用 `kubectl logs` 命令获取日志:

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
You can use `kubectl logs` to retrieve logs from a previous instantiation of a container with `--previous` flag, in case the container has crashed. If your pod has multiple containers, you should specify which container's logs you want to access by appending a container name to the command. See the [`kubectl logs` documentation](/docs/reference/generated/kubectl/kubectl-commands#logs) for more details.
-->
一旦发生容器崩溃，您可以使用命令 `kubectl logs` 和参数 `--previous` 检索之前的容器日志。
如果 pod 中有多个容器，您应该向该命令附加一个容器名以访问对应容器的日志。
详见 [`kubectl logs` 文档](/docs/reference/generated/kubectl/kubectl-commands#logs)。

<!--
## Logging at the node level

![Node level logging](/images/docs/user-guide/logging/logging-node-level.png)
-->
## 节点级日志记录

![节点级别的日志记录](/images/docs/user-guide/logging/logging-node-level.png)

<!--
Everything a containerized application writes to `stdout` and `stderr` is handled and redirected somewhere by a container engine. For example, the Docker container engine redirects those two streams to [a logging driver](https://docs.docker.com/engine/admin/logging/overview), which is configured in Kubernetes to write to a file in json format.
-->
容器化应用写入 `stdout` 和 `stderr` 的任何数据，都会被容器引擎捕获并被重定向到某个位置。
例如，Docker 容器引擎将这两个输出流重定向到某个 [日志驱动](https://docs.docker.com/engine/admin/logging/overview) ，
该日志驱动在 Kubernetes 中配置为以 json 格式写入文件。

<!--
{{< note >}}
The Docker json logging driver treats each line as a separate message. When using the Docker logging driver, there is no direct support for multi-line messages. You need to handle multi-line messages at the logging agent level or higher.
{{< /note >}}
-->
{{< note >}}
Docker json 日志驱动将日志的每一行当作一条独立的消息。该日志驱动不直接支持多行消息。您需要在日志代理级别或更高级别处理多行消息。
{{< /note >}}

<!--
By default, if a container restarts, the kubelet keeps one terminated container with its logs. If a pod is evicted from the node, all corresponding containers are also evicted, along with their logs.
-->
默认情况下，如果容器重启，kubelet 会保留被终止的容器日志。
如果 pod 在工作节点被驱逐，该 pod 中所有的容器也会被驱逐，包括容器日志。

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
节点级日志记录中，需要重点考虑实现日志的轮转，以此来保证日志不会消耗节点上所有的可用空间。
Kubernetes 当前并不负责轮转日志，而是通过部署工具建立一个解决问题的方案。
例如，在 Kubernetes 集群中，用 `kube-up.sh` 部署一个每小时运行的工具 [`logrotate`](https://linux.die.net/man/8/logrotate)。
您也可以设置容器 runtime 来自动地轮转应用日志，比如使用 Docker 的 `log-opt` 选项。
在 `kube-up.sh` 脚本中，使用后一种方式来处理 GCP 上的 COS 镜像，而使用前一种方式来处理其他环境。
这两种方式，默认日志超过 10MB 大小时都会触发日志轮转。

<!--
As an example, you can find detailed information about how `kube-up.sh` sets
up logging for COS image on GCP in the corresponding [script][cosConfigureHelper].
-->
例如，您可以找到关于 `kube-up.sh` 为 GCP 环境的 COS 镜像设置日志的详细信息，
相应的脚本在 [这里][cosConfigureHelper]。

<!--
When you run [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) as in
the basic logging example, the kubelet on the node handles the request and
reads directly from the log file, returning the contents in the response.
-->
当运行 [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) 时，
节点上的 kubelet 处理该请求并直接读取日志文件，同时在响应中返回日志文件内容。

{{< note >}}
<!--
Currently, if some external system has performed the rotation,
only the contents of the latest log file will be available through
`kubectl logs`. E.g. if there's a 10MB file, `logrotate` performs
the rotation and there are two files, one 10MB in size and one empty,
`kubectl logs` will return an empty response.
-->
当前，如果有其他系统机制执行日志轮转，那么 `kubectl logs` 仅可查询到最新的日志内容。
比如，一个 10MB 大小的文件，通过`logrotate` 执行轮转后生成两个文件，一个 10MB 大小，一个为空，所以 `kubectl logs` 将返回空。 
{{< /note >}}

[cosConfigureHelper]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh

<!--
### System component logs

There are two types of system components: those that run in a container and those
that do not run in a container. For example:
-->
### 系统组件日志

系统组件有两种类型：在容器中运行的和不在容器中运行的。例如：

<!--
* The Kubernetes scheduler and kube-proxy run in a container.
* The kubelet and container runtime, for example Docker, do not run in containers.
-->
* 在容器中运行的 kube-scheduler 和 kube-proxy。
* 不在容器中运行的 kubelet 和容器运行时（例如 Docker。

<!--
On machines with systemd, the kubelet and container runtime write to journald. If
systemd is not present, they write to `.log` files in the `/var/log` directory.
System components inside containers always write to the `/var/log` directory,
bypassing the default logging mechanism. They use the [klog][klog]
logging library. You can find the conventions for logging severity for those
components in the [development docs on logging](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).
-->
在使用 systemd 机制的服务器上，kubelet 和容器 runtime 写入日志到 journald。
如果没有 systemd，他们写入日志到 `/var/log` 目录的 `.log` 文件。
容器中的系统组件通常将日志写到 `/var/log` 目录，绕过了默认的日志机制。他们使用 [klog][klog] 日志库。
您可以在[日志开发文档](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)找到这些组件的日志告警级别协议。

<!--
Similarly to the container logs, system component logs in the `/var/log`
directory should be rotated. In Kubernetes clusters brought up by
the `kube-up.sh` script, those logs are configured to be rotated by
the `logrotate` tool daily or once the size exceeds 100MB.
-->
和容器日志类似，`/var/log` 目录中的系统组件日志也应该被轮转。
通过脚本 `kube-up.sh` 启动的 Kubernetes 集群中，日志被工具 `logrotate` 执行每日轮转，或者日志大小超过 100MB 时触发轮转。

[klog]: https://github.com/kubernetes/klog

<!--
## Cluster-level logging architectures
-->
## 集群级日志架构

<!--
While Kubernetes does not provide a native solution for cluster-level logging, there are several common approaches you can consider. Here are some options:

* Use a node-level logging agent that runs on every node.
* Include a dedicated sidecar container for logging in an application pod.
* Push logs directly to a backend from within an application.
-->
虽然Kubernetes没有为集群级日志记录提供原生的解决方案，但您可以考虑几种常见的方法。以下是一些选项：

* 使用在每个节点上运行的节点级日志记录代理。
* 在应用程序的 pod 中，包含专门记录日志的 sidecar 容器。
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
您可以通过在每个节点上使用 _节点级的日志记录代理_ 来实现群集级日志记录。日志记录代理是一种用于暴露日志或将日志推送到后端的专用工具。通常，日志记录代理程序是一个容器，它可以访问包含该节点上所有应用程序容器的日志文件的目录。

<!--
Because the logging agent must run on every node, it's common to implement it as either a DaemonSet replica, a manifest pod, or a dedicated native process on the node. However the latter two approaches are deprecated and highly discouraged.
-->
由于日志记录代理必须在每个节点上运行，它可以用 DaemonSet 副本，Pod 或 本机进程来实现。然而，后两种方法被弃用并且非常不别推荐。

<!--
Using a node-level logging agent is the most common and encouraged approach for a Kubernetes cluster, because it creates only one agent per node, and it doesn't require any changes to the applications running on the node. However, node-level logging _only works for applications' standard output and standard error_.
-->
对于 Kubernetes 集群来说，使用节点级的日志代理是最常用和被推荐的方式，因为在每个节点上仅创建一个代理，并且不需要对节点上的应用做修改。
但是，节点级的日志 _仅适用于应用程序的标准输出和标准错误输出_。

<!--
Kubernetes doesn't specify a logging agent, but two optional logging agents are packaged with the Kubernetes release: [Stackdriver Logging](/docs/user-guide/logging/stackdriver) for use with Google Cloud Platform, and [Elasticsearch](/docs/user-guide/logging/elasticsearch). You can find more information and instructions in the dedicated documents. Both use [fluentd](http://www.fluentd.org/) with custom configuration as an agent on the node.
-->
Kubernetes 并不指定日志代理，但是有两个可选的日志代理与 Kubernetes 发行版一起发布。
[Stackdriver 日志](/docs/user-guide/logging/stackdriver) 适用于 Google Cloud Platform，和 [Elasticsearch](/docs/user-guide/logging/elasticsearch)。
您可以在专门的文档中找到更多的信息和说明。两者都使用 [fluentd](http://www.fluentd.org/) 与自定义配置作为节点上的代理。

<!--
### Using a sidecar container with the logging agent
-->
### 使用 sidecar 容器和日志代理

<!--
You can use a sidecar container in one of the following ways:
-->
您可以通过以下方式之一使用 sidecar 容器：

<!--
* The sidecar container streams application logs to its own `stdout`.
* The sidecar container runs a logging agent, which is configured to pick up logs from an application container.
-->
* sidecar 容器将应用程序日志传送到自己的标准输出。
* sidecar 容器运行一个日志代理，配置该日志代理以便从应用容器收集日志。

<!--
#### Streaming sidecar container
-->
#### 传输数据流的 sidecar 容器

<!--
![Sidecar container with a streaming container](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

By having your sidecar containers stream to their own `stdout` and `stderr`
streams, you can take advantage of the kubelet and the logging agent that
already run on each node. The sidecar containers read logs from a file, a socket,
or the journald. Each individual sidecar container prints log to its own `stdout`
or `stderr` stream.
-->
利用 sidecar 容器向自己的 `stdout` 和 `stderr` 传输流的方式，您就可以利用每个节点上的 kubelet 和日志代理来处理日志。
sidecar 容器从文件，socket 或 journald 读取日志。每个 sidecar 容器打印其自己的 `stdout` 和 `stderr` 流。

<!--
This approach allows you to separate several log streams from different
parts of your application, some of which can lack support
for writing to `stdout` or `stderr`. The logic behind redirecting logs
is minimal, so it's hardly a significant overhead. Additionally, because
`stdout` and `stderr` are handled by the kubelet, you can use built-in tools
like `kubectl logs`.
-->
这种方法允许您将日志流从应用程序的不同部分分离开，其中一些可能缺乏对写入 `stdout` 或 `stderr` 的支持。重定向日志背后的逻辑是最小的，因此它的开销几乎可以忽略不计。
另外，因为 `stdout`、`stderr` 由 kubelet 处理，你可以使用内置的工具 `kubectl logs`。

<!--
Consider the following example. A pod runs a single container, and the container
writes to two different log files, using two different formats. Here's a
configuration file for the Pod:
-->
考虑接下来的例子。pod 的容器向两个文件写不同格式的日志，下面是这个 pod 的配置文件:

{{< codenew file="admin/logging/two-files-counter-pod.yaml" >}}

<!--
It would be a mess to have log entries of different formats in the same log
stream, even if you managed to redirect both components to the `stdout` stream of
the container. Instead, you could introduce two sidecar containers. Each sidecar
container could tail a particular log file from a shared volume and then redirect
the logs to its own `stdout` stream.
-->
在同一个日志流中有两种不同格式的日志条目，这有点混乱，即使您试图重定向它们到容器的 `stdout` 流。
取而代之的是，您可以引入两个 sidecar 容器。
每一个 sidecar 容器可以从共享卷跟踪特定的日志文件，并重定向文件内容到各自的 `stdout` 流。

<!--
Here's a configuration file for a pod that has two sidecar containers:
-->
这是运行两个 sidecar 容器的 pod 文件。

{{< codenew file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" >}}

<!--
Now when you run this pod, you can access each log stream separately by
running the following commands:
-->
现在当您运行这个 pod 时，您可以分别地访问每一个日志流，运行如下命令：

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
The node-level agent installed in your cluster picks up those log streams
automatically without any further configuration. If you like, you can configure
the agent to parse log lines depending on the source container.
-->
集群中安装的节点级代理会自动获取这些日志流，而无需进一步配置。如果您愿意，您可以配置代理程序来解析源容器的日志行。

<!--
Note, that despite low CPU and memory usage (order of couple of millicores
for cpu and order of several megabytes for memory), writing logs to a file and
then streaming them to `stdout` can double disk usage. If you have
an application that writes to a single file, it's generally better to set
`/dev/stdout` as destination rather than implementing the streaming sidecar
container approach.
-->
注意，尽管 CPU 和内存使用率都很低（以多个 cpu millicores 指标排序或者按内存的兆字节排序），
向文件写日志然后输出到 `stdout` 流仍然会成倍地增加磁盘使用率。
如果您的应用向单一文件写日志，通常最好设置 `/dev/stdout` 作为目标路径，而不是使用流式的 sidecar 容器方式。

<!--
Sidecar containers can also be used to rotate log files that cannot be
rotated by the application itself. An example
of this approach is a small container running logrotate periodically.
However, it's recommended to use `stdout` and `stderr` directly and leave rotation
and retention policies to the kubelet.
-->
应用本身如果不具备轮转日志文件的功能，可以通过 sidecar 容器实现。
该方式的 [例子](https://github.com/samsung-cnct/logrotate) 是运行一个定期轮转日志的容器。
然而，还是推荐直接使用 `stdout` 和 `stderr`，将日志的轮转和保留策略交给 kubelet。

<!--
#### Sidecar container with a logging agent

![Sidecar container with a logging agent](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)
-->
### 具有日志代理功能的 sidecar 容器

![日志记录代理功能的 sidecar 容器](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

<!--
If the node-level logging agent is not flexible enough for your situation, you
can create a sidecar container with a separate logging agent that you have
configured specifically to run with your application.
-->
如果节点级日志记录代理程序对于你的场景来说不够灵活，您可以创建一个带有单独日志记录代理程序的 sidecar 容器，将代理程序专门配置为与您的应用程序一起运行。

<!--
{{< note >}}
Using a logging agent in a sidecar container can lead
to significant resource consumption. Moreover, you won't be able to access
those logs using `kubectl logs` command, because they are not controlled
by the kubelet.
{{< /note >}}
-->
{{< note >}}
在 sidecar 容器中使用日志代理会导致严重的资源损耗。此外，您不能使用 `kubectl logs` 命令访问日志，因为日志并没有被 kubelet 管理。
{{< /note >}}

<!--
As an example, you could use [Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/),
which uses fluentd as a logging agent. Here are two configuration files that
you can use to implement this approach. The first file contains
a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) to configure fluentd.
-->
例如，您可以使用 [Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/)，它使用fluentd作为日志记录代理。
以下是两个可用于实现此方法的配置文件。
第一个文件包含配置 fluentd 的[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)。

{{< codenew file="admin/logging/fluentd-sidecar-config.yaml" >}}

<!--
{{< note >}}
The configuration of fluentd is beyond the scope of this article. For
information about configuring fluentd, see the
[official fluentd documentation](http://docs.fluentd.org/).
{{< /note >}}
-->
{{< note >}}
配置fluentd超出了本文的范围。要知道更多的关于如何配置fluentd，请参考[fluentd 官方文档](http://docs.fluentd.org/).
{{< /note >}}

<!--
The second file describes a pod that has a sidecar container running fluentd.
The pod mounts a volume where fluentd can pick up its configuration data.
-->
第二个文件描述了运行 fluentd  sidecar 容器的 pod 。flutend 通过 pod 的挂载卷获取它的配置数据。

{{< codenew file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" >}}

<!--
After some time you can find log messages in the Stackdriver interface.
-->
一段时间后，您可以在 Stackdriver 界面看到日志消息。

<!--
Remember, that this is just an example and you can actually replace fluentd
with any logging agent, reading from any source inside an application
container.
-->
记住，这只是一个例子，事实上您可以用任何一个日志代理替换 fluentd ，并从应用容器中读取任何资源。

<!--
### Exposing logs directly from the application

![Exposing logs directly from the application](/images/docs/user-guide/logging/logging-from-application.png)
-->

### 从应用中直接暴露日志目录

![直接从应用程序暴露日志](/images/docs/user-guide/logging/logging-from-application.png)

<!--
You can implement cluster-level logging by exposing or pushing logs directly from
every application; however, the implementation for such a logging mechanism
is outside the scope of Kubernetes.
-->
通过暴露或推送每个应用的日志，您可以实现集群级日志记录；然而，这种日志记录机制的实现已超出 Kubernetes 的范围。

{{% /capture %}}
