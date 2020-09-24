---
reviewers:
- dims
- 44past4
title: 系统日志
content_type: concept
weight: 60
---

<!-- overview -->

<!--
System component logs record events happening in cluster, which can be very useful for debugging.
You can configure log verbosity to see more or less detail.
Logs can be as coarse-grained as showing errors within a component, or as fine-grained as showing step-by-step traces of events (like HTTP access logs, pod state changes, controller actions, or scheduler decisions).
-->

系统组件日志记录了集群中发生的事件，这对于调试非常有用。

你可以通过配置日志的级别以查看更多或更少的细节。

日志可以显示像组件中的错误一样粗糙的粒度，也可以显示像事件的逐步记录（如HTTP访问日志，pod状态更改，控制器操作或调度程序决定）一样精细的粒度。

<!-- body -->

## Klog

<!--
klog is the Kubernetes logging library. [klog](https://github.com/kubernetes/klog)
generates log messages for the Kubernetes system components.

For more information about klog configuration, see the [Command line tool reference](/docs/reference/command-line-tools-reference/).

An example of the klog native format:
-->

klog 是Kubernetes日志记录库。[klog](https://github.com/kubernetes/klog) 为 Kubernetes 系统组件生成日志消息。

有关 klog 配置的更多信息，请参阅[命令行工具参考](/docs/reference/command-line-tools-reference/)。

一个原生的 klog 格式的示例：

```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

<!--
### Structured Logging
-->

### 结构化日志

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

<!--
{{<warning>}}
Migration to structured log messages is an ongoing process. Not all log messages are structured in this version. When parsing log files, you must also handle unstructured log messages.

Log formatting and value serialization are subject to change.
{{< /warning>}}
-->

{{<warning>}}
迁移到结构化日志信息是一个持续的过程。并非所有在此版本中的日志信息都是结构化的。当解析日志文件时，你还必须处理非结构化的日志信息。

日志格式和值序列化可能会更改。
{{< /warning>}}

<!--
Structured logging is a effort to introduce a uniform structure in log messages allowing for easy extraction of information, making logs easier and cheaper to store and process.
New message format is backward compatible and enabled by default.

Format of structured logs:
```
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

Example:
```
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```
-->

结构化日志记录是一种在日志消息中引入统一结构的工作，可轻松提取信息，从而使日志的存储和处理更加容易且成本更低。

新的信息格式在默认情况下是向后兼容的。

结构化日志的格式：
```
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

例:
```
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

<!--
### JSON log format
-->

### JSON日志格式

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

<!--
{{<warning >}}
JSON output does not support many standard klog flags. For list of unsupported klog flags, see the [Command line tool reference](/docs/reference/command-line-tools-reference/).

Not all logs are guaranteed to be written in JSON format (for example, during process start). If you intend to parse logs, make sure you can handle log lines that are not JSON as well.

Field names and JSON serialization are subject to change.
{{< /warning >}}
-->

{{<warning >}}
JSON 输出不支持许多标准的 klog 标志。有关不支持的 klog 标志的列表，请参阅[命令行工具参考](/docs/reference/command-line-tools-reference/)。

并非所有的日志都保证会以 JSON 格式写入（例如，在程序启动期间）。如果你打算解析日志，请确保你也可以处理非 JSON 格式的日志行。

字段名称和 JSON 序列化可能会更改。
{{< /warning >}}

<!--
The `--logging-format=json` flag changes the format of logs from klog native format to JSON format.
Example of JSON log format (pretty printed):
-->

`--logging-format=json` 标志将日志格式从 klog 原声格式更改为 JSON 格式。JSON 日志格式示例（精美打印）：

```json
{
   "ts": 1580306777.04728,
   "v": 4,
   "msg": "Pod status updated",
   "pod":{
      "name": "nginx-1",
      "namespace": "default"
   },
   "status": "ready"
}
```

<!--
Keys with special meaning:
* `ts` - timestamp as Unix time (required, float)
* `v` - verbosity (required, int, default 0)
* `err` - error string (optional, string)
* `msg` - message (required, string)
-->

具有特殊含义的键：
* `ts` - 时间戳记为Unix时间（必填项，浮点型）
* `v` - 日志级别（必填项，整型，默认值为0）
* `err` - 错误字符串（非必填项，字符串）
* `msg` - 信息（必填项，字符串）

<!--
List of components currently supporting JSON format:
-->
当前支持JSON格式的组件列表：

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

<!--
### Log verbosity level
-->

### 日志详细级别

<!--
The `-v` flag controls log verbosity. Increasing the value increases the number of logged events. Decreasing the value decreases the number of logged events.
Increasing verbosity settings logs increasingly less severe events. A verbosity setting of 0 logs only critical events.
-->

`-v` 标志控制日志的详细程度。增大该值将增加记录的事件数，减小该值将减少记录的事件数。
随着该值的逐渐增加记录的事件严重程度会越来越低。当级别设置为 0 时仅记录关键事件。

<!--
### Log location
-->

### 记录位置

<!--
There are two types of system components: those that run in a container and those
that do not run in a container. For example:

* The Kubernetes scheduler and kube-proxy run in a container.
* The kubelet and container runtime, for example Docker, do not run in containers.

On machines with systemd, the kubelet and container runtime write to journald.
Otherwise, they write to `.log` files in the `/var/log` directory.
System components inside containers always write to `.log` files in the `/var/log` directory,
bypassing the default logging mechanism.
Similar to the container logs, you should rotate system component logs in the `/var/log` directory.
In Kubernetes clusters created by the `kube-up.sh` script, log rotation is configured by the `logrotate` tool.
The `logrotate` tool rotates logs daily, or once the log size is greater than 100MB.
-->

有两种类型的系统组件：在容器中运行的系统组件和不在容器中运行的系统组件。例如：

* Kubernetes 调度程序和 kube-proxy 在容器中运行。
* kubelet 和容器运行时（例如Docker）不在容器中运行。

在具有 systemd 的计算机上，kubelet 和容器运行时将写入 journald。

否则，它们将写入 `/var/log` 目录中的 `.log` 文件。

容器内的系统组件总是绕过默认的日志记录机制写入 `/var/log` 目录中的 `.log` 文件。

与容器日志类似，你可以在`/var/log`目录中轮替系统组件日志。

在通过 `kube-up.sh` 脚本创建的 Kubernetes 集群中，日志轮替由 `logrotate` 工具配置。

`logrotate` 工具每天轮替日志，或者一旦日志大小100MB，就会轮替日志。

## {{% heading "whatsnext" %}}

<!--
* Read about the [Kubernetes Logging Architecture](/docs/concepts/cluster-administration/logging/)
* Read about [Structured Logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* Read about the [Conventions for logging severity](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
-->

* 阅读有关 [Kubernetes日志记录架构](/docs/concepts/cluster-administration/logging/)
* 阅读有关 [结构化日志](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* 阅读有关 [日志严重性约定](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
