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

Kubernetes is in the process of simplifying logging in its components. The
following klog command line flags [are
deprecated](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
starting with Kubernetes 1.23 and will be removed in a future release:

- `--add-dir-header`
- `--alsologtostderr`
- `--log-backtrace-at`
- `--log-dir`
- `--log-file`
- `--log-file-max-size`
- `--logtostderr`
- `--one-output`
- `--skip-headers`
- `--skip-log-headers`
- `--stderrthreshold`

Output will always be written to stderr, regardless of the output
format. Output redirection is expected to be handled by the component which
invokes a Kubernetes component. This can be a POSIX shell or a tool like
systemd.

In some cases, for example a distroless container or a Windows system service,
those options are not available. Then the
[`kube-log-runner`](https://github.com/kubernetes/kubernetes/blob/d2a8a81639fcff8d1221b900f66d28361a170654/staging/src/k8s.io/component-base/logs/kube-log-runner/README.md)
binary can be used as wrapper around a Kubernetes component to redirect
output. A prebuilt binary is included in several Kubernetes base images under
its traditional name as `/go-runner` and as `kube-log-runner` in server and
node release archives.

This table shows how `kube-log-runner` invocations correspond to shell redirection:

| Usage                                    | POSIX shell (such as bash) | `kube-log-runner <options> <cmd>`                           |
| -----------------------------------------|----------------------------|-------------------------------------------------------------|
| Merge stderr and stdout, write to stdout | `2>&1`                     | `kube-log-runner` (default behavior)                        |
| Redirect both into log file              | `1>>/tmp/log 2>&1`         | `kube-log-runner -log-file=/tmp/log`                        |
| Copy into log file and to stdout         | `2>&1 \| tee -a /tmp/log`  | `kube-log-runner -log-file=/tmp/log -also-stdout`           |
| Redirect only stdout into log file       | `>/tmp/log`                | `kube-log-runner -log-file=/tmp/log -redirect-stderr=false` |

### Klog output

An example of the traditional klog native format:
```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

The message string may contain line breaks:
```
I1025 00:15:15.525108       1 example.go:79] This is a message
which has a line break.
```


### Structured Logging

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< warning >}}
Migration to structured log messages is an ongoing process. Not all log messages are structured in this version. When parsing log files, you must also handle unstructured log messages.

Log formatting and value serialization are subject to change.
{{< /warning>}}

Structured logging introduces a uniform structure in log messages allowing for programmatic extraction of information. You can store and process structured logs with less effort and cost.
The code which generates a log message determines whether it uses the traditional unstructured klog output
or structured logging.

The default formatting of structured log messages is as text, with a format that
is backward compatible with traditional klog:

```ini
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

Example:

```ini
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

Strings are quoted. Other values are formatted with
[`%+v`](https://pkg.go.dev/fmt#hdr-Printing), which may cause log messages to
continue on the next line [depending on the data](https://github.com/kubernetes/kubernetes/issues/106428).
```
I1025 00:15:15.525108       1 example.go:116] "Example" data="This is text with a line break\nand \"quotation marks\"." someInt=1 someFloat=0.1 someStruct={StringField: First line,
second line.}
```

### Contextual Logging

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

Contextual logging builds on top of structured logging. It is primarily about
how developers use logging calls: code based on that concept is more flexible
and supports additional use cases as described in the [Contextual Logging
KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging).

If developers use additional functions like `WithValues` or `WithName` in
their components, then log entries contain additional information that gets
passed into functions by their caller.

Currently this is gated behind the `StructuredLogging` feature gate and
disabled by default. The infrastructure for this was added in 1.24 without
modifying components. The
[`component-base/logs/example`](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go)
command demonstrates how to use the new logging calls and how a component
behaves that supports contextual logging.

```console
$ cd $GOPATH/src/k8s.io/kubernetes/staging/src/k8s.io/component-base/logs/example/cmd/
$ go run . --help
...
      --feature-gates mapStringBool  A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                     AllAlpha=true|false (ALPHA - default=false)
                                     AllBeta=true|false (BETA - default=false)
                                     ContextualLogging=true|false (ALPHA - default=false)
$ go run . --feature-gates ContextualLogging=true
...
I0404 18:00:02.916429  451895 logger.go:94] "example/myname: runtime" foo="bar" duration="1m0s"
I0404 18:00:02.916447  451895 logger.go:95] "example: another runtime" foo="bar" duration="1m0s"
```

The `example` prefix and `foo="bar"` were added by the caller of the function
which logs the `runtime` message and `duration="1m0s"` value, without having to
modify that function.

With contextual logging disable, `WithValues` and `WithName` do nothing and log
calls go through the global klog logger. Therefore this additional information
is not in the log output anymore:

```console
$ go run . --feature-gates ContextualLogging=false
...
I0404 18:03:31.171945  452150 logger.go:94] "runtime" duration="1m0s"
I0404 18:03:31.171962  452150 logger.go:95] "another runtime" duration="1m0s"
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
* `v` - verbosity (only for info and not for error messages, int)
* `err` - error string (optional, string)
* `msg` - message (required, string)


List of components currently supporting JSON format:
* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

### Log verbosity level

The `-v` flag controls log verbosity. Increasing the value increases the number of logged events. Decreasing the value decreases the number of logged events.
Increasing verbosity settings logs increasingly less severe events. A verbosity setting of 0 logs only critical events.

### Log location

There are two types of system components: those that run in a container and those
that do not run in a container. For example:

* The Kubernetes scheduler and kube-proxy run in a container.
* The kubelet and {{<glossary_tooltip term_id="container-runtime" text="container runtime">}}
  do not run in containers.

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
* Read about [Contextual Logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
* Read about [deprecation of klog flags](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
* Read about the [Conventions for logging severity](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
