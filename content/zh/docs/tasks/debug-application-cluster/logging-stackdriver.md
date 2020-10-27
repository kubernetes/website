---
title: 使用 Stackdriver 生成日志
content_type: concept
---

<!--
reviewers:
- piosz
- x13n
title: Logging Using Stackdriver
content_type: concept
-->

<!-- overview -->

<!--
Before reading this page, it's highly recommended to familiarize yourself
with the [overview of logging in Kubernetes](/docs/concepts/cluster-administration/logging).
-->
在阅读这篇文档之前，强烈建议你先熟悉一下 [Kubernetes 日志概况](/zh/docs/concepts/cluster-administration/logging)

<!--
By default, Stackdriver logging collects only your container's standard output and
standard error streams. To collect any logs your application writes to a file (for example),
see the [sidecar approach](/docs/concepts/cluster-administration/logging#sidecar-container-with-a-logging-agent)
in the Kubernetes logging overview.
-->

{{< note >}}
默认情况下，Stackdriver 日志机制仅收集容器的标准输出和标准错误流。
如果要收集你的应用程序写入一个文件（例如）的任何日志，请参见 Kubernetes 日志概述中的 [sidecar 方式](/zh/docs/concepts/cluster-administration/logging#sidecar-container-with-a-logging-agent)
{{< /note >}}

<!-- body -->

<!--
## Deploying
-->

## 部署  {#deploying}

<!--
To ingest logs, you must deploy the Stackdriver Logging agent to each node in your cluster.
The agent is a configured `fluentd` instance, where the configuration is stored in a `ConfigMap`
and the instances are managed using a Kubernetes `DaemonSet`. The actual deployment of the
`ConfigMap` and `DaemonSet` for your cluster depends on your individual cluster setup.
-->
为了接收日志，你必须将 Stackdriver 日志代理部署到集群中的每个节点。
此代理是一个已配置的 `fluentd`，其配置存在一个 `ConfigMap` 中，且实例使用 Kubernetes 的 `DaemonSet` 进行管理。
`ConfigMap` 和 `DaemonSet` 的实际部署，取决你的集群设置。

<!--
### Deploying to a new cluster
-->

### 部署到一个新的集群

#### Google Kubernetes Engine

<!--
Stackdriver is the default logging solution for clusters deployed on Google Kubernetes Engine.
Stackdriver Logging is deployed to a new cluster by default unless you explicitly opt-out.
-->
对于部署在 Google Kubernetes Engine 上的集群，Stackdriver 是默认的日志解决方案。
Stackdriver 日志机制会默认部署到你的新集群上，除非你明确地不选择。

<!--
#### Other platforms
-->

#### 其他平台

<!--
To deploy Stackdriver Logging on a *new* cluster that you're
creating using `kube-up.sh`, do the following:
-->
为了将 Stackdriver 日志机制部署到你正在使用 `kube-up.sh` 创建的*新*集群上，执行如下操作：

<!--
1. Set the `KUBE_LOGGING_DESTINATION` environment variable to `gcp`.
1. **If not running on GCE**, include the `beta.kubernetes.io/fluentd-ds-ready=true`
in the `KUBE_NODE_LABELS` variable.
-->
1. 设置环境变量 `KUBE_LOGGING_DESTINATION` 为 `gcp`。
1. **如果不是跑在 GCE 上**，在 `KUBE_NODE_LABELS` 变量中包含 `beta.kubernetes.io/fluentd-ds-ready=true`。

<!--
Once your cluster has started, each node should be running the Stackdriver Logging agent.
The `DaemonSet` and `ConfigMap` are configured as addons. If you're not using `kube-up.sh`,
consider starting a cluster without a pre-configured logging solution and then deploying
Stackdriver Logging agents to the running cluster.
-->

集群启动后，每个节点都应该运行 Stackdriver 日志代理。
`DaemonSet` 和 `ConfigMap` 作为附加组件进行配置。
如果你不是使用 `kube-up.sh`，可以考虑不使用预先配置的日志方案启动集群，然后部署 Stackdriver 日志代理到正在运行的集群。

<!--
The Stackdriver logging daemon has known issues on platforms other
than Google Kubernetes Engine. Proceed at your own risk.
-->

{{< warning >}}
除了 Google Kubernetes Engine，Stackdriver 日志守护进程在其他的平台有已知的问题。
请自行承担风险。
{{< /warning >}}

<!--
### Deploying to an existing cluster
-->
### 部署到一个已知集群

<!--
1. Apply a label on each node, if not already present.
-->
1. 在每个节点上打标签（如果尚未存在）
   <!--
   The Stackdriver Logging agent deployment uses node labels to determine to which nodes
   it should be allocated. These labels were introduced to distinguish nodes with the
   Kubernetes version 1.6 or higher. If the cluster was created with Stackdriver Logging
   configured and node has version 1.5.X or lower, it will have fluentd as static pod. Node
   cannot have more than one instance of fluentd, therefore only apply labels to the nodes
   that don't have fluentd pod allocated already. You can ensure that your node is labelled
   properly by running `kubectl describe` as follows:
   -->

   Stackdriver 日志代理部署使用节点标签来确定应该将其分配到给哪些节点。
   引入这些标签是为了区分 Kubernetes 1.6 或更高版本的节点。
   如果集群是在配置了 Stackdriver 日志机制的情况下创建的，并且节点的版本为 1.5.X 或更低版本，则它将使用 fluentd 用作静态容器。
   节点最多只能有一个 fluentd 实例，因此只能将标签打在未分配过 fluentd pod 的节点上。
   你可以通过运行 `kubectl describe` 来确保你的节点被正确标记，如下所示：

   ```
   kubectl describe node $NODE_NAME
   ```
   <!--
   The output should be similar to this:
   -->
   输出应类似于如下内容：

   ```
   Name:           NODE_NAME
   Role:
   Labels:         beta.kubernetes.io/fluentd-ds-ready=true
   ...
   ```
   <!--
   Ensure that the output contains the label `beta.kubernetes.io/fluentd-ds-ready=true`. If it
   is not present, you can add it using the `kubectl label` command as follows:
   -->
   确保输出内容包含 `beta.kubernetes.io/fluentd-ds-ready=true` 标签。
   如果不存在，则可以使用 `kubectl label` 命令添加，如下所示：

   ```
   kubectl label node $NODE_NAME beta.kubernetes.io/fluentd-ds-ready=true
   ```
   <!--
   If a node fails and has to be recreated, you must re-apply the label to
   the recreated node. To make this easier, you can use Kubelet's command-line parameter
   for applying node labels in your node startup script.
   -->

   {{< note >}}
   如果节点发生故障并且必须重新创建，则必须将标签重新打在重新创建了的节点。
   为了让此操作更便捷，你可以在节点启动脚本中使用 Kubelet 的命令行参数给节点添加标签。
   {{< /note >}}

<!--
1. Deploy a `ConfigMap` with the logging agent configuration by running the following command:
-->
2. 通过运行以下命令，部署一个带有日志代理配置的 `ConfigMap`：

   ```
   kubectl apply -f https://k8s.io/examples/debug/fluentd-gcp-configmap.yaml
   ```
   <!--
   The command creates the `ConfigMap` in the `default` namespace. You can download the file
   manually and change it before creating the `ConfigMap` object.
   -->
   该命令在 `default` 命名空间中创建 `ConfigMap`。你可以在创建 `ConfigMap` 对象之前手动下载文件并进行更改。

<!--
1. Deploy the logging agent `DaemonSet` by running the following command:
-->
3. 通过运行以下命令，部署日志代理的 `DaemonSet`：

   ```
   kubectl apply -f https://k8s.io/examples/debug/fluentd-gcp-ds.yaml
   ```
   <!--
   You can download and edit this file before using it as well.
   -->
   你也可以在使用前下载和编辑此文件。

<!--
## Verifying your Logging Agent Deployment
-->
## 验证日志代理部署

<!--
After Stackdriver `DaemonSet` is deployed, you can discover logging agent deployment status
by running the following command:
-->
部署 Stackdriver `DaemonSet` 之后，你可以通过运行以下命令来查看日志代理的部署状态：

```shell
kubectl get ds --all-namespaces
```

<!--
If you have 3 nodes in the cluster, the output should looks similar to this:
-->
如果你的集群中有 3 个节点，则输出应类似于如下：

```
NAMESPACE     NAME               DESIRED   CURRENT   READY     NODE-SELECTOR                              AGE
...
default       fluentd-gcp-v2.0   3         3         3         beta.kubernetes.io/fluentd-ds-ready=true   5m
...
```

<!--
To understand how logging with Stackdriver works, consider the following
synthetic log generator pod specification [counter-pod.yaml](/examples/debug/counter-pod.yaml):
-->
要了解使用 Stackdriver 进行日志记录的工作方式，请考虑以下具有日志生成的 pod 定义 [counter-pod.yaml](/examples/debug/counter-pod.yaml)：

{{< codenew file="debug/counter-pod.yaml" >}}

<!--
This pod specification has one container that runs a bash script
that writes out the value of a counter and the datetime once per
second, and runs indefinitely. Let's create this pod in the default namespace.
-->
这个 pod 定义里有一个容器，该容器运行一个 bash 脚本，脚本每秒写一次计数器的值和日期时间，并无限期地运行。
让我们在默认命名空间中创建此 pod。

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```

<!--
You can observe the running pod:
-->
你可以观察到正在运行的 pod：

```shell
kubectl get pods
```
```
NAME                                           READY     STATUS    RESTARTS   AGE
counter                                        1/1       Running   0          5m
```

<!--
For a short period of time you can observe the 'Pending' pod status, because the kubelet
has to download the container image first. When the pod status changes to `Running`
you can use the `kubectl logs` command to view the output of this counter pod.
-->
在短时间内，你可以观察到 "pending" 的 pod 的状态，因为 kubelet 必须先下载容器镜像。
当 pod 状态变为 `Running` 时，你可以使用 `kubectl logs` 命令查看此 counter pod 的输出。

```shell
kubectl logs counter
```
```
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

<!--
As described in the logging overview, this command fetches log entries
from the container log file. If the container is killed and then restarted by
Kubernetes, you can still access logs from the previous container. However,
if the pod is evicted from the node, log files are lost. Let's demonstrate this
by deleting the currently running counter container:
-->
正如日志概览所述，此命令从容器日志文件中获取日志项。
如果该容器被 Kubernetes 杀死然后重新启动，你仍然可以访问前一个容器的日志。
但是，如果将 Pod 从节点中驱逐，则日志文件会丢失。让我们通过删除当前运行的 counter 容器来演示这一点：

```shell
kubectl delete pod counter
```
```
pod "counter" deleted
```

<!--
and then recreating it:
-->
然后重建它：

```shell
kubectl create -f https://k8s.io/examples/debug/counter-pod.yaml
```
```
pod/counter created
```

<!--
After some time, you can access logs from the counter pod again:
-->
一段时间后，你可以再次从 counter pod 访问日志：

```shell
kubectl logs counter
```
```
0: Mon Jan  1 00:01:00 UTC 2001
1: Mon Jan  1 00:01:01 UTC 2001
2: Mon Jan  1 00:01:02 UTC 2001
...
```

<!--
As expected, only recent log lines are present. However, for a real-world
application you will likely want to be able to access logs from all containers,
especially for the debug purposes. This is exactly when the previously enabled
Stackdriver Logging can help.
-->
如预期的那样，日志中仅出现最近的日志记录。
但是，对于实际应用程序，你可能希望能够访问所有容器的日志，特别是出于调试的目的。
这就是先前启用的 Stackdriver 日志机制可以提供帮助的地方。

<!--
## Viewing logs
-->
## 查看日志

<!--
Stackdriver Logging agent attaches metadata to each log entry, for you to use later
in queries to select only the messages you're interested in: for example,
the messages from a particular pod.
-->
Stackdriver 日志代理为每个日志项关联元数据，供你在后续的查询中只选择感兴趣的消息：
例如，来自某个特定 Pod 的消息。

<!--
The most important pieces of metadata are the resource type and log name.
The resource type of a container log is `container`, which is named
`GKE Containers` in the UI (even if the Kubernetes cluster is not on Google Kubernetes Engine).
The log name is the name of the container, so that if you have a pod with
two containers, named `container_1` and `container_2` in the spec, their logs
will have log names `container_1` and `container_2` respectively.
-->
元数据最重要的部分是资源类型和日志名称。
容器日志的资源类型为 `container`，在用户界面中名为 `GKE Containers`（即使 Kubernetes 集群不在 Google Kubernetes Engine 上）。
日志名称是容器的名称，因此，如果你有一个包含两个容器的 pod，在 spec 中名称定义为 `container_1` 和 `container_2`，则它们的日志的名称分别为 `container_1` 和 `container_2`。

<!--
System components have resource type `compute`, which is named
`GCE VM Instance` in the interface. Log names for system components are fixed.
For a Google Kubernetes Engine node, every log entry from a system component has one of the following
log names:
-->
系统组件的资源类型为 `compute`，在接口中名为 `GCE VM Instance`。
系统组件的日志名称是固定的。
对于 Google Kubernetes Engine 节点，系统组件中的每个日志项都具有以下日志名称之一：

* docker
* kubelet
* kube-proxy

<!--
You can learn more about viewing logs on [the dedicated Stackdriver page](https://cloud.google.com/logging/docs/view/logs_viewer).
-->
你可以在[专用 Stackdriver 页面](https://cloud.google.com/logging/docs/view/overview)上了解有关查看日志的更多信息。

<!--
One of the possible ways to view logs is using the
[`gcloud logging`](https://cloud.google.com/logging/docs/api/gcloud-logging)
command line interface from the [Google Cloud SDK].
It uses Stackdriver Logging [filtering syntax](https://cloud.google.com/logging/docs/view/advanced_filters)
to query specific logs. For example, you can run the following command:
-->
查看日志的一种可能方法是使用 [Google Cloud SDK]((https://cloud.google.com/sdk/)) 中的 [`gcloud logging`](https://cloud.google.com/logging/docs/reference/tools/gcloud-logging) 命令行接口。
它使用 Stackdriver 日志机制的[过滤语法](https://cloud.google.com/logging/docs/view/advanced_filters)查询特定日志。
例如，你可以运行以下命令：

```none
gcloud beta logging read 'logName="projects/$YOUR_PROJECT_ID/logs/count"' --format json | jq '.[].textPayload'
```
```
...
"2: Mon Jan  1 00:01:02 UTC 2001\n"
"1: Mon Jan  1 00:01:01 UTC 2001\n"
"0: Mon Jan  1 00:01:00 UTC 2001\n"
...
"2: Mon Jan  1 00:00:02 UTC 2001\n"
"1: Mon Jan  1 00:00:01 UTC 2001\n"
"0: Mon Jan  1 00:00:00 UTC 2001\n"
```

<!--
As you can see, it outputs messages for the count container from both
the first and second runs, despite the fact that the kubelet already deleted
the logs for the first container.
-->
如你所见，尽管 kubelet 已经删除了第一个容器的日志，日志中仍会包含 counter 容器第一次和第二次运行时输出的消息。

<!--
### Exporting logs
-->
### 导出日志

<!--
You can export logs to [Google Cloud Storage](https://cloud.google.com/storage/)
or to [BigQuery](https://cloud.google.com/bigquery/) to run further
analysis. Stackdriver Logging offers the concept of sinks, where you can
specify the destination of log entries. More information is available on
the Stackdriver [Exporting Logs page](https://cloud.google.com/logging/docs/export/configure_export_v2).
-->
你可以将日志导出到 [Google Cloud Storage](https://cloud.google.com/storage/) 或
[BigQuery](https://cloud.google.com/bigquery/) 进行进一步的分析。
Stackdriver 日志机制提供了接收器（Sink）的概念，你可以在其中指定日志项的存放地。
可在 Stackdriver [导出日志页面](https://cloud.google.com/logging/docs/export/configure_export_v2)上获得更多信息。

<!--
## Configuring Stackdriver Logging Agents
-->
## 配置 Stackdriver 日志代理

<!--
Sometimes the default installation of Stackdriver Logging may not suit your needs, for example:
-->
有时默认的 Stackdriver 日志机制安装可能无法满足你的需求，例如：

<!--
* You may want to add more resources because default performance doesn't suit your needs.
* You may want to introduce additional parsing to extract more metadata from your log messages,
like severity or source code reference.
* You may want to send logs not only to Stackdriver or send it to Stackdriver only partially.
-->
* 你可能需要添加更多资源，因为默认的行为表现无法满足你的需求。
* 你可能需要引入额外的解析机制以便从日志消息中提取更多元数据，例如严重性或源代码引用。
* 你可能想要将日志不仅仅发送到 Stackdriver 或仅将部分日志发送到 Stackdriver。

<!--
In this case you need to be able to change the parameters of `DaemonSet` and `ConfigMap`.
-->
在这种情况下，你需要更改 `DaemonSet` 和 `ConfigMap` 的参数。

<!--
### Prerequisites
-->
### 先决条件

<!--
If you're using GKE and Stackdriver Logging is enabled in your cluster, you
cannot change its configuration, because it's managed and supported by GKE.
However, you can disable the default integration and deploy your own.
-->
如果使用的是 GKE，并且集群中启用了 Stackdriver 日志机制，则无法更改其配置，因为它是由 GKE 管理和支持的。
但是，你可以禁用默认集成的日志机制并部署自己的。

<!--
You will have to support and maintain a newly deployed configuration
yourself: update the image and configuration, adjust the resources and so on.
-->

{{< note >}}
你将需要自己支持和维护新部署的配置了：更新映像和配置、调整资源等等。
{{< /note >}}

<!--
To disable the default logging integration, use the following command:
-->
若要禁用默认的日志记录集成，请使用以下命令：

```
gcloud beta container clusters update --logging-service=none CLUSTER
```

<!--
You can find notes on how to then install Stackdriver Logging agents into
a running cluster in the [Deploying section](#deploying).
-->
你可以在[部署部分](#deploying)中找到有关如何将 Stackdriver 日志代理安装到正在运行的集群中的说明​​。

<!--
### Changing `DaemonSet` parameters
-->
### 更改 `DaemonSet` 参数    {#changing-daemonset-parameters}

<!--
When you have the Stackdriver Logging `DaemonSet` in your cluster, you can just modify the
`template` field in its spec, daemonset controller will update the pods for you. For example,
let's assume you've just installed the Stackdriver Logging as described above. Now you want to
change the memory limit to give fluentd more memory to safely process more logs.
-->
当集群中有 Stackdriver 日志机制的 `DaemonSet` 时，你只需修改其 spec 中的 `template` 字段，daemonset 控制器将为你更新 pod。
例如，假设你按照上面的描述已经安装了 Stackdriver 日志机制。
现在，你想更改内存限制，来给 fluentd 提供的更多内存，从而安全地处理更多日志。

<!--
Get the spec of `DaemonSet` running in your cluster:
-->
获取集群中运行的 `DaemonSet` 的 spec：

```shell
kubectl get ds fluentd-gcp-v2.0 --namespace kube-system -o yaml > fluentd-gcp-ds.yaml
```

<!--
Then edit resource requirements in the spec file and update the `DaemonSet` object
in the apiserver using the following command:
-->
然后在 spec 文件中编辑资源需求，并使用以下命令更新 apiserver 中的 `DaemonSet` 对象：

```shell
kubectl replace -f fluentd-gcp-ds.yaml
```

<!--
After some time, Stackdriver Logging agent pods will be restarted with the new configuration.
-->
一段时间后，Stackdriver 日志代理的 pod 将使用新配置重新启动。

<!--
### Changing fluentd parameters
-->
### 更改 fluentd 参数

<!--
Fluentd configuration is stored in the `ConfigMap` object. It is effectively a set of configuration
files that are merged together. You can learn about fluentd configuration on the
[official site](https://docs.fluentd.org).
-->
Fluentd 的配置存在 `ConfigMap` 对象中。
它实际上是一组合并在一起的配置文件。
你可以在[官方网站](https://docs.fluentd.org)上了解 fluentd 的配置。

<!--
Imagine you want to add a new parsing logic to the configuration, so that fluentd can understand
default Python logging format. An appropriate fluentd filter looks similar to this:
-->
假设你要向配置添加新的解析逻辑，以便 fluentd 可以理解默认的 Python 日志记录格式。
一个合适的 fluentd 过滤器类似如下：

```
<filter reform.**>
  type parser
  format /^(?<severity>\w):(?<logger_name>\w):(?<log>.*)/
  reserve_data true
  suppress_parse_error_log true
  key_name log
</filter>
```

<!--
Now you have to put it in the configuration and make Stackdriver Logging agents pick it up.
Get the current version of the Stackdriver Logging `ConfigMap` in your cluster
by running the following command:
-->
现在，你需要将其放入配置中，并使 Stackdriver 日志代理感知它。
通过运行以下命令，获取集群中当前版本的 Stackdriver 日志机制的 `ConfigMap`：

```shell
kubectl get cm fluentd-gcp-config --namespace kube-system -o yaml > fluentd-gcp-configmap.yaml
```

<!--
Then in the value of the key `containers.input.conf` insert a new filter right after
the `source` section.
-->
然后在 `containers.input.conf` 键的值中，在 `source` 部分之后插入一个新的过滤器。

<!--
Order is important.
-->

{{< note >}}
顺序很重要。
{{< /note >}}

<!--
Updating `ConfigMap` in the apiserver is more complicated than updating `DaemonSet`. It's better
to consider `ConfigMap` to be immutable. Then, in order to update the configuration, you should
create `ConfigMap` with a new name and then change `DaemonSet` to point to it
using [guide above](#changing-daemonset-parameters).
-->
在 apiserver 中更新 `ConfigMap` 比更新 `DaemonSet` 更复杂。
最好考虑 `ConfigMap` 是不可变的。
如果是这样，要更新配置，你应该使用新名称创建 `ConfigMap`，然后使用
[上面的指南](#changing-daemonset-parameters)将 `DaemonSet` 更改为指向它。

<!--
### Adding fluentd plugins
-->
### 添加 fluentd 插件

<!--
Fluentd is written in Ruby and allows to extend its capabilities using
[plugins](https://www.fluentd.org/plugins). If you want to use a plugin, which is not included
in the default Stackdriver Logging container image, you have to build a custom image. Imagine
you want to add Kafka sink for messages from a particular container for additional processing.
You can re-use the default [container image sources](https://git.k8s.io/contrib/fluentd/fluentd-gcp-image)
with minor changes:
-->
Fluentd 用 Ruby 编写，并允许使用 [plugins](https://www.fluentd.org/plugins) 扩展其功能。
如果要使用默认的 Stackdriver 日志机制容器镜像中未包含的插件，则必须构建自定义镜像。
假设你要为来自特定容器添加 Kafka 信息接收器，以进行其他处理。
你可以复用默认的[容器镜像源](https://git.k8s.io/contrib/fluentd/fluentd-gcp-image)，并仅添加少量更改：

<!--
* Change Makefile to point to your container repository, for example `PREFIX=gcr.io/<your-project-id>`.
* Add your dependency to the Gemfile, for example `gem 'fluent-plugin-kafka'`.
-->
* 将 Makefile 更改为指向你的容器仓库，例如 `PREFIX=gcr.io/<your-project-id>`。
* 将你的依赖项添加到 Gemfile 中，例如 `gem 'fluent-plugin-kafka'`。

<!--
Then run `make build push` from this directory. After updating `DaemonSet` to pick up the
new image, you can use the plugin you installed in the fluentd configuration.
-->
然后在该目录运行 `make build push`。在更新 `DaemonSet` 以使用新镜像后，你就可以使用在 fluentd 配置中安装的插件了。
