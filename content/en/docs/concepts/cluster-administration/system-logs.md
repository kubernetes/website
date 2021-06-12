---
reviewers:
- dims
- 44past4
title: System Logs
content_type: concept
weight: 60
---

<!-- overview -->

System component logs record events happening in cluster, which can be very useful for debugging.
You can configure log verbosity to see more or less detail.
Logs can be as coarse-grained as showing errors within a component, or as fine-grained as showing step-by-step traces of events (like HTTP access logs, pod state changes, controller actions, or scheduler decisions).

<!-- body -->

## Klog

klog is the Kubernetes logging library. [klog](https://github.com/kubernetes/klog)
generates log messages for the Kubernetes system components.

For more information about klog configuration, see the [Command line tool reference](/docs/reference/command-line-tools-reference/).

An example of the klog native format:
```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

### Structured Logging

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{< warning >}}
Migration to structured log messages is an ongoing process. Not all log messages are structured in this version. When parsing log files, you must also handle unstructured log messages.

Log formatting and value serialization are subject to change.
{{< /warning>}}

Structured logging introduces a uniform structure in log messages allowing for programmatic extraction of information. You can store and process structured logs with less effort and cost.
New message format is backward compatible and enabled by default.

Format of structured logs:

```ini
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

Example:

```ini
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```


### JSON log format

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{<warning >}}
JSON output does not support many standard klog flags. For list of unsupported klog flags, see the [Command line tool reference](/docs/reference/command-line-tools-reference/).

Not all logs are guaranteed to be written in JSON format (for example, during process start). If you intend to parse logs, make sure you can handle log lines that are not JSON as well.

Field names and JSON serialization are subject to change.
{{< /warning >}}

The `--logging-format=json` flag changes the format of logs from klog native format to JSON format.
Example of JSON log format (pretty printed):
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

Keys with special meaning:
* `ts` - timestamp as Unix time (required, float)
* `v` - verbosity (required, int, default 0)
* `err` - error string (optional, string)
* `msg` - message (required, string)


List of components currently supporting JSON format:
* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

### Log sanitization

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

{{<warning >}}
Log sanitization might incur significant computation overhead and therefore should not be enabled in production.
{{< /warning >}}

The `--experimental-logging-sanitization` flag enables the klog sanitization filter.
If enabled all log arguments are inspected for fields tagged as sensitive data (e.g. passwords, keys, tokens) and logging of these fields will be prevented.

List of components currently supporting log sanitization:
* kube-controller-manager
* kube-apiserver
* kube-scheduler
* kubelet

{{< note >}}
The Log sanitization filter does not prevent user workload logs from leaking sensitive data.
{{< /note >}}

### Log verbosity level

The `-v` flag controls log verbosity. Increasing the value increases the number of logged events. Decreasing the value decreases the number of logged events.
Increasing verbosity settings logs increasingly less severe events. A verbosity setting of 0 logs only critical events.

### Log location

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

## {{% heading "whatsnext" %}}

* Read about the [Kubernetes Logging Architecture](/docs/concepts/cluster-administration/logging/)
* Read about [Structured Logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* Read about the [Conventions for logging severity](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
