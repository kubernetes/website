---
content_type: task
title: 节点健康监测
weight: 20
---
<!-- 
title: Monitor Node Health
content_type: task
reviewers:
- Random-Liu
- dchen1107
weight: 20
-->

<!-- overview -->
<!--
*Node Problem Detector* is a daemon for monitoring and reporting about a node's health.
You can run Node Problem Detector as a `DaemonSet` or as a standalone daemon.
Node Problem Detector collects information about node problems from various daemons
and reports these conditions to the API server as Node [Condition](/docs/concepts/architecture/nodes/#condition)s
or as [Event](/docs/reference/kubernetes-api/cluster-resources/event-v1)s.

To learn how to install and use Node Problem Detector, see
[Node Problem Detector project documentation](https://github.com/kubernetes/node-problem-detector).
-->

**节点问题检测器（Node Problem Detector）** 是一个守护程序，用于监视和报告节点的健康状况。
你可以将节点问题探测器以 `DaemonSet` 或独立守护程序运行。
节点问题检测器从各种守护进程收集节点问题，并以节点
[Condition](/zh-cn/docs/concepts/architecture/nodes/#condition) 和
[Event](/zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1)
的形式报告给 API 服务器。

要了解如何安装和使用节点问题检测器，请参阅
[节点问题探测器项目文档](https://github.com/kubernetes/node-problem-detector)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Limitations

* Node Problem Detector uses the kernel log format for reporting kernel issues.
  To learn how to extend the kernel log format, see [Add support for another log format](#support-other-log-format).
-->
## 局限性  {#limitations}

* 节点问题检测器使用内核日志格式来报告内核问题。
  要了解如何扩展内核日志格式，请参阅[添加对另一个日志格式的支持](#support-other-log-format)。

<!--
## Enabling Node Problem Detector

Some cloud providers enable Node Problem Detector as an {{< glossary_tooltip text="Addon" term_id="addons" >}}.
You can also enable Node Problem Detector with `kubectl` or by creating an Addon DaemonSet.
-->
## 启用节点问题检测器

一些云供应商将节点问题检测器以{{< glossary_tooltip text="插件" term_id="addons" >}}形式启用。
你还可以使用 `kubectl` 或创建插件 DaemonSet 来启用节点问题探测器。

<!--
### Using kubectl to enable Node Problem Detector {#using-kubectl}

`kubectl` provides the most flexible management of Node Problem Detector.
You can overwrite the default configuration to fit it into your environment or
to detect customized node problems. For example:
-->
### 使用 kubectl 启用节点问题检测器 {#using-kubectl}

`kubectl` 提供了节点问题探测器最灵活的管理。
你可以覆盖默认配置使其适合你的环境或检测自定义节点问题。例如：

<!--
1. Create a Node Problem Detector configuration similar to `node-problem-detector.yaml`:

   {{% code_sample file="debug/node-problem-detector.yaml" %}}

   {{< note >}}
   You should verify that the system log directory is right for your operating system distribution.
   {{< /note >}}

1. Start node problem detector with `kubectl`:

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```
-->
1. 创建类似于 `node-strought-detector.yaml` 的节点问题检测器配置：
   {{% code_sample file="debug/node-problem-detector.yaml" %}}

   {{< note >}}
   你应该检查系统日志目录是否适用于操作系统发行版本。
   {{< /note >}}

1. 使用 `kubectl` 启动节点问题检测器：

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```

<!--
### Using an Addon pod to enable Node Problem Detector {#using-addon-pod}

If you are using a custom cluster bootstrap solution and don't need
to overwrite the default configuration, you can leverage the Addon pod to
further automate the deployment.

Create `node-problem-detector.yaml`, and save the configuration in the Addon pod's
directory `/etc/kubernetes/addons/node-problem-detector` on a control plane node.
-->
### 使用插件 Pod 启用节点问题检测器 {#using-addon-pod}

如果你使用的是自定义集群引导解决方案，不需要覆盖默认配置，
可以利用插件 Pod 进一步自动化部署。

创建 `node-strick-detector.yaml`，并在控制平面节点上保存配置到插件 Pod 的目录
`/etc/kubernetes/addons/node-problem-detector`。

<!--
## Overwrite the configuration

The [default configuration](https://github.com/kubernetes/node-problem-detector/tree/v0.8.12/config)
is embedded when building the Docker image of Node Problem Detector.
-->
## 覆盖配置文件

构建节点问题检测器的 docker 镜像时，会嵌入
[默认配置](https://github.com/kubernetes/node-problem-detector/tree/v0.8.12/config)。

<!--
However, you can use a [`ConfigMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/)
to overwrite the configuration:
-->
不过，你可以像下面这样使用 [`ConfigMap`](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
将其覆盖：

<!--
1. Change the configuration files in `config/`
1. Create the `ConfigMap` `node-problem-detector-config`:

   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

1. Change the `node-problem-detector.yaml` to use the `ConfigMap`:

   {{% code_sample file="debug/node-problem-detector-configmap.yaml" %}}

1. Recreate the Node Problem Detector with the new configuration file:

   ```shell
   # If you have a node-problem-detector running, delete before recreating
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```
 -->
1. 更改 `config/` 中的配置文件
1. 创建 `ConfigMap` `node-strick-detector-config`：

   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

1. 更改 `node-problem-detector.yaml` 以使用 ConfigMap：

      {{% code_sample file="debug/node-problem-detector-configmap.yaml" %}}

1. 使用新的配置文件重新创建节点问题检测器：

   ```shell
   # 如果你正在运行节点问题检测器，请先删除，然后再重新创建
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```

<!--
{{< note >}}
This approach only applies to a Node Problem Detector started with `kubectl`.
{{< /note >}}

Overwriting a configuration is not supported if a Node Problem Detector runs as a cluster Addon.
The Addon manager does not support `ConfigMap`.
-->
{{< note >}}
此方法仅适用于通过 `kubectl` 启动的节点问题检测器。
{{< /note >}}

如果节点问题检测器作为集群插件运行，则不支持覆盖配置。
插件管理器不支持 `ConfigMap`。

<!--
## Problem Daemons

A problem daemon is a sub-daemon of the Node Problem Detector. It monitors specific kinds of node
problems and reports them to the Node Problem Detector.
There are several types of supported problem daemons.
-->

## 问题守护程序

问题守护程序是节点问题检测器的子守护程序。
它监视特定类型的节点问题并报告给节点问题检测器。
支持下面几种类型的问题守护程序。

<!--
- A `SystemLogMonitor` type of daemon monitors the system logs and reports problems and metrics
  according to predefined rules. You can customize the configurations for different log sources
  such as [filelog](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-filelog.json),
  [kmsg](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor.json),
  [kernel](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-counter.json),
  [abrt](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/abrt-adaptor.json),
  and [systemd](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/systemd-monitor-counter.json).
-->
- `SystemLogMonitor` 类型的守护程序根据预定义的规则监视系统日志并报告问题和指标。
  你可以针对不同的日志源自定义配置如
[filelog](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-filelog.json)、
[kmsg](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor.json)、
[kernel](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-counter.json)、
[abrt](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/abrt-adaptor.json)
和 [systemd](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/systemd-monitor-counter.json)。

<!--
- A `SystemStatsMonitor` type of daemon collects various health-related system stats as metrics.
  You can customize its behavior by updating its
  [configuration file](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/system-stats-monitor.json).
-->

- `SystemStatsMonitor` 类型的守护程序收集各种与健康相关的系统统计数据作为指标。
  你可以通过更新其[配置文件](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/system-stats-monitor.json)来自定义其行为。

<!--
- A `CustomPluginMonitor` type of daemon invokes and checks various node problems by running
  user-defined scripts. You can use different custom plugin monitors to monitor different
  problems and customize the daemon behavior by updating the
  [configuration file](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/custom-plugin-monitor.json).
-->

- `CustomPluginMonitor` 类型的守护程序通过运行用户定义的脚本来调用和检查各种节点问题。
  你可以使用不同的自定义插件监视器来监视不同的问题，并通过更新
  [配置文件](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/custom-plugin-monitor.json)
  来定制守护程序行为。

<!--
- A `HealthChecker` type of daemon checks the health of the kubelet and container runtime on a node.
-->
- `HealthChecker` 类型的守护程序检查节点上的 kubelet 和容器运行时的健康状况。

<!--
### Adding support for other log format {#support-other-log-format}

The system log monitor currently supports file-based logs, journald, and kmsg.
Additional sources can be added by implementing a new
[log watcher](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/pkg/systemlogmonitor/logwatchers/types/log_watcher.go).
-->

### 增加对其他日志格式的支持 {#support-other-log-format}

系统日志监视器目前支持基于文件的日志、journald 和 kmsg。
可以通过实现一个新的
[log watcher](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/pkg/systemlogmonitor/logwatchers/types/log_watcher.go)
来添加额外的日志源。

<!--
### Adding custom plugin monitors

You can extend the Node Problem Detector to execute any monitor scripts written in any language by
developing a custom plugin. The monitor scripts must conform to the plugin protocol in exit code
and standard output. For more information, please refer to the
[plugin interface proposal](https://docs.google.com/document/d/1jK_5YloSYtboj-DtfjmYKxfNnUxCAvohLnsH5aGCAYQ/edit#).
-->

### 添加自定义插件监视器

你可以通过开发自定义插件来扩展节点问题检测器，以执行以任何语言编写的任何监控脚本。
监控脚本必须符合退出码和标准输出的插件协议。
有关更多信息，请参阅
[插件接口提案](https://docs.google.com/document/d/1jK_5YloSYtboj-DtfjmYKxfNnUxCAvohLnsH5aGCAYQ/edit#).

<!--
## Exporter

An exporter reports the node problems and/or metrics to certain backends.
The following exporters are supported:

- **Kubernetes exporter**: this exporter reports node problems to the Kubernetes API server.
  Temporary problems are reported as Events and permanent problems are reported as Node Conditions.

- **Prometheus exporter**: this exporter reports node problems and metrics locally as Prometheus
  (or OpenMetrics) metrics. You can specify the IP address and port for the exporter using command
  line arguments.

- **Stackdriver exporter**: this exporter reports node problems and metrics to the Stackdriver
  Monitoring API. The exporting behavior can be customized using a
  [configuration file](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/exporter/stackdriver-exporter.json).
-->

## 导出器

导出器（Exporter）向特定后端报告节点问题和/或指标。
支持下列导出器：

- **Kubernetes exporter**：此导出器向 Kubernetes API 服务器报告节点问题。
  临时问题报告为事件，永久性问题报告为节点状况。

- **Prometheus exporter**：此导出器在本地将节点问题和指标报告为 Prometheus（或 OpenMetrics）指标。
  你可以使用命令行参数指定导出器的 IP 地址和端口。

- **Stackdriver exporter**：此导出器向 Stackdriver Monitoring API 报告节点问题和指标。
  可以使用[配置文件](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/exporter/stackdriver-exporter.json)自定义导出行为。

<!-- discussion -->

<!--
## Recommendations and restrictions

It is recommended to run the Node Problem Detector in your cluster to monitor node health.
When running the Node Problem Detector, you can expect extra resource overhead on each node.
Usually this is fine, because:

* The kernel log grows relatively slowly.
* A resource limit is set for the Node Problem Detector.
* Even under high load, the resource usage is acceptable. For more information, see the Node Problem Detector
  [benchmark result](https://github.com/kubernetes/node-problem-detector/issues/2#issuecomment-220255629).
-->
## 建议和限制

建议在集群中运行节点问题检测器以监控节点运行状况。
运行节点问题检测器时，你可以预期每个节点上的额外资源开销。
通常这是可接受的，因为：

* 内核日志增长相对缓慢。
* 已经为节点问题检测器设置了资源限制。
* 即使在高负载下，资源使用也是可接受的。有关更多信息，请参阅节点问题检测器
  [基准结果](https://github.com/kubernetes/node-problem-detector/issues/2.suecomment-220255629)。
