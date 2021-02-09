---
title: 系统日志
content_type: concept
weight: 60
---
<!-- 
reviewers:
- dims
- 44past4
title: System Logs
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
System component logs record events happening in cluster, which can be very useful for debugging.
You can configure log verbosity to see more or less detail.
Logs can be as coarse-grained as showing errors within a component, or as fine-grained as showing step-by-step traces of events (like HTTP access logs, pod state changes, controller actions, or scheduler decisions).
-->
系统组件的日志记录集群中发生的事件，这对于调试非常有用。
你可以配置日志的精细度，以展示更多或更少的细节。
日志可以是粗粒度的，如只显示组件内的错误，
也可以是细粒度的，如显示事件的每一个跟踪步骤（比如 HTTP 访问日志、pod 状态更新、控制器动作或调度器决策）。

<!-- body -->

## Klog

<!--
klog is the Kubernetes logging library. [klog](https://github.com/kubernetes/klog)
generates log messages for the Kubernetes system components.

For more information about klog configuration, see the [Command line tool reference](/docs/reference/command-line-tools-reference/).

An example of the klog native format:
-->
klog 是 Kubernetes 的日志库。 
[klog](https://github.com/kubernetes/klog) 
为 Kubernetes 系统组件生成日志消息。

有关 klog 配置的更多信息，请参见[命令行工具参考](/zh/docs/reference/command-line-tools-reference/)。

klog 原始格式的示例：
```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

<!-- 
### Structured Logging 
-->
### 结构化日志

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

<!--
Migration to structured log messages is an ongoing process. Not all log messages are structured in this version. When parsing log files, you must also handle unstructured log messages.

Log formatting and value serialization are subject to change.
-->
{{<warning>}}
到结构化日志消息的迁移是一个持续的过程。
在此版本中，并非所有日志消息都是结构化的。
解析日志文件时，你也必须要处理非结构化日志消息。

日志格式和值的序列化可能会发生变化。
{{< /warning>}}

<!--
Structured logging is a effort to introduce a uniform structure in log messages allowing for easy extraction of information, making logs easier and cheaper to store and process.
New message format is backward compatible and enabled by default.

Format of structured logs:
-->
结构化日志记录旨在日志消息中引入统一结构，以方便提取信息，使日志的存储和处理更容易、成本更低。
新的消息格式向后兼容，并默认启用。

结构化日志的格式：
```
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

<!-- Example: -->
示例：
```
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```


<!--
### JSON log format
-->
### JSON 日志格式

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

<!--
JSON output does not support many standard klog flags. For list of unsupported klog flags, see the [Command line tool reference](/docs/reference/command-line-tools-reference/).

Not all logs are guaranteed to be written in JSON format (for example, during process start). If you intend to parse logs, make sure you can handle log lines that are not JSON as well.

Field names and JSON serialization are subject to change.
-->
{{<warning >}}
JSON 输出并不支持太多标准 klog 参数。
对于不受支持的 klog 参数的列表，请参见
[命令行工具参考](/zh/docs/reference/command-line-tools-reference/)。

并不是所有日志都保证写成 JSON 格式（例如，在进程启动期间）。
如果你打算解析日志，请确保可以处理非 JSON 格式的日志行。

字段名和 JSON 序列化可能会发生变化。
{{< /warning >}}

<!--
The `--logging-format=json` flag changes the format of logs from klog native format to JSON format.
Example of JSON log format (pretty printed):
-->
`--logging-format=json` 参数将日志格式从 klog 原生格式改为 JSON 格式。
JSON 日志格式示例（美化输出）：
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

List of components currently supporting JSON format:
-->
具有特殊意义的 key：
* `ts` - Unix 时间风格的时间戳（必选项，浮点值）
* `v` - 精细度（必选项，整数，默认值 0）
* `err` - 错误字符串（可选项，字符串）
* `msg` - 消息（必选项，字符串）

当前支持JSON格式的组件列表：
* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

<!--
### Log sanitization

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

{{<warning >}}
Log sanitization might incur significant computation overhead and therefore should not be enabled in production.
{{< /warning >}}
-->

### 日志清理

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

{{<warning >}}
日志清理可能会导致大量的计算开销，因此不应启用在生产环境中。
{{< /warning >}}

<!--
The `--experimental-logging-sanitization` flag enables the klog sanitization filter.
If enabled all log arguments are inspected for fields tagged as sensitive data (e.g. passwords, keys, tokens) and logging of these fields will be prevented.
-->

`--experimental-logging-sanitization` 参数可用来启用 klog 清理过滤器。
如果启用后，将检查所有日志参数中是否有标记为敏感数据的字段（比如：密码，密钥，令牌），并且将阻止这些字段的记录。

<!--
List of components currently supporting log sanitization:
* kube-controller-manager
* kube-apiserver
* kube-scheduler
* kubelet

{{< note >}}
The Log sanitization filter does not prevent user workload logs from leaking sensitive data.
{{< /note >}}
-->

当前支持日志清理的组件列表：

* kube-controller-manager
* kube-apiserver
* kube-scheduler
* kubelet

{{< note >}}
日志清理过滤器不会阻止用户工作负载日志泄漏敏感数据。
{{< /note >}}

<!--
### Log verbosity level

The `-v` flag controls log verbosity. Increasing the value increases the number of logged events. Decreasing the value decreases the number of logged events.
Increasing verbosity settings logs increasingly less severe events. A verbosity setting of 0 logs only critical events.
-->
### 日志精细度级别

参数 `-v` 控制日志的精细度。增大该值会增大日志事件的数量。
减小该值可以减小日志事件的数量。
增大精细度会记录更多的不太严重的事件。
精细度设置为 0 时只记录关键（critical）事件。

<!--
### Log location

There are two types of system components: those that run in a container and those
that do not run in a container. For example:

* The Kubernetes scheduler and kube-proxy run in a container.
* The kubelet and container runtime, for example Docker, do not run in containers.
-->
### 日志位置

有两种类型的系统组件：运行在容器中的组件和不运行在容器中的组件。例如：
* Kubernetes 调度器和 kube-proxy 在容器中运行。
* kubelet 和容器运行时，例如 Docker，不在容器中运行。

<!--
On machines with systemd, the kubelet and container runtime write to journald.
Otherwise, they write to `.log` files in the `/var/log` directory.
System components inside containers always write to `.log` files in the `/var/log` directory,
bypassing the default logging mechanism.
Similar to the container logs, you should rotate system component logs in the `/var/log` directory.
In Kubernetes clusters created by the `kube-up.sh` script, log rotation is configured by the `logrotate` tool.
The `logrotate` tool rotates logs daily, or once the log size is greater than 100MB.
-->
在使用 systemd 的系统中，kubelet 和容器运行时写入 journald。
在别的系统中，日志写入 `/var/log` 目录下的 `.log` 文件中。
容器中的系统组件总是绕过默认的日志记录机制，写入 `/var/log` 目录下的 `.log` 文件。
与容器日志类似，你应该轮转 `/var/log` 目录下系统组件日志。
在 `kube-up.sh` 脚本创建的 Kubernetes 集群中，日志轮转由 `logrotate` 工具配置。
 `logrotate` 工具，每天或者当日志大于 100MB 时，轮转日志。

## {{% heading "whatsnext" %}}

<!--
* Read about the [Kubernetes Logging Architecture](/docs/concepts/cluster-administration/logging/)
* Read about [Structured Logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* Read about the [Conventions for logging severity](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
-->
* 阅读 [Kubernetes 日志架构](/zh/docs/concepts/cluster-administration/logging/)
* 阅读 [Structured Logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* 阅读 [Conventions for logging severity](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
