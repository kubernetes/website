---
reviewers:
- dims
- 44past4
title: System Logs
content_type: concept
weight: 80
---

<!-- overview -->

System component logs record events happening in cluster, which can be very useful for debugging.
You can configure log verbosity to see more or less detail.
Logs can be as coarse-grained as showing errors within a component, or as fine-grained as showing
step-by-step traces of events (like HTTP access logs, pod state changes, controller actions, or
scheduler decisions).

<!-- body -->

{{< warning >}}
In contrast to the command line flags described here, the *log
output* itself does *not* fall under the Kubernetes API stability guarantees:
individual log entries and their formatting may change from one release
to the next!
{{< /warning >}}

## Klog

klog is the Kubernetes logging library. [klog](https://github.com/kubernetes/klog)
generates log messages for the Kubernetes system components.

Kubernetes is in the process of simplifying logging in its components.
The following klog command line flags
[are deprecated](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
starting with Kubernetes v1.23 and removed in Kubernetes v1.26:

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

Output will always be written to stderr, regardless of the output format. Output redirection is
expected to be handled by the component which invokes a Kubernetes component. This can be a POSIX
shell or a tool like systemd.

In some cases, for example a distroless container or a Windows system service, those options are
not available. Then the
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
Migration to structured log messages is an ongoing process. Not all log messages are structured in
this version. When parsing log files, you must also handle unstructured log messages.

Log formatting and value serialization are subject to change.
{{< /warning>}}

Structured logging introduces a uniform structure in log messages allowing for programmatic
extraction of information. You can store and process structured logs with less effort and cost.
The code which generates a log message determines whether it uses the traditional unstructured
klog output or structured logging.

The default formatting of structured log messages is as text, with a format that is backward
compatible with traditional klog:

```
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

Example:

```
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

{{< feature-state for_k8s_version="v1.30" state="beta" >}}

Contextual logging builds on top of structured logging. It is primarily about
how developers use logging calls: code based on that concept is more flexible
and supports additional use cases as described in the [Contextual Logging
KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging).

If developers use additional functions like `WithValues` or `WithName` in
their components, then log entries contain additional information that gets
passed into functions by their caller.

For Kubernetes {{< skew currentVersion >}}, this is gated behind the `ContextualLogging`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and is
enabled by default. The infrastructure for this was added in 1.24 without
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
                                     ContextualLogging=true|false (BETA - default=true)
$ go run . --feature-gates ContextualLogging=true
...
I0222 15:13:31.645988  197901 example.go:54] "runtime" logger="example.myname" foo="bar" duration="1m0s"
I0222 15:13:31.646007  197901 example.go:55] "another runtime" logger="example" foo="bar" duration="1h0m0s" duration="1m0s"
```

The `logger` key and `foo="bar"` were added by the caller of the function
which logs the `runtime` message and `duration="1m0s"` value, without having to
modify that function.

With contextual logging disable, `WithValues` and `WithName` do nothing and log
calls go through the global klog logger. Therefore this additional information
is not in the log output anymore:

```console
$ go run . --feature-gates ContextualLogging=false
...
I0222 15:14:40.497333  198174 example.go:54] "runtime" duration="1m0s"
I0222 15:14:40.497346  198174 example.go:55] "another runtime" duration="1h0m0s" duration="1m0s"
```

### JSON log format

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{<warning >}}
JSON output does not support many standard klog flags. For list of unsupported klog flags, see the
[Command line tool reference](/docs/reference/command-line-tools-reference/).

Not all logs are guaranteed to be written in JSON format (for example, during process start).
If you intend to parse logs, make sure you can handle log lines that are not JSON as well.

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

The `-v` flag controls log verbosity. Increasing the value increases the number of logged events.
Decreasing the value decreases the number of logged events.  Increasing verbosity settings logs
increasingly less severe events. A verbosity setting of 0 logs only critical events.

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

## Log query

{{< feature-state feature_gate_name="NodeLogQuery" >}}

To help with debugging issues on nodes, Kubernetes v1.27 introduced a feature that allows viewing logs of services
running on the node. To use the feature, ensure that the `NodeLogQuery`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled for that node, and that the
kubelet configuration options `enableSystemLogHandler` and `enableSystemLogQuery` are both set to true. On Linux
the assumption is that service logs are available via journald. On Windows the assumption is that service logs are
available in the application log provider. On both operating systems, logs are also available by reading files within
`/var/log/`.

Provided you are authorized to interact with node objects, you can try out this feature on all your nodes or
just a subset. Here is an example to retrieve the kubelet service logs from a node:

```shell
# Fetch kubelet logs from a node named node-1.example
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet"
```

You can also fetch files, provided that the files are in a directory that the kubelet allows for log
fetches. For example, you can fetch a log from `/var/log` on a Linux node:

```shell
kubectl get --raw "/api/v1/nodes/<insert-node-name-here>/proxy/logs/?query=/<insert-log-file-name-here>"
```

The kubelet uses heuristics to retrieve logs. This helps if you are not aware whether a given system service is
writing logs to the operating system's native logger like journald or to a log file in `/var/log/`. The heuristics
first checks the native logger and if that is not available attempts to retrieve the first logs from
`/var/log/<servicename>` or `/var/log/<servicename>.log` or `/var/log/<servicename>/<servicename>.log`.

The complete list of options that can be used are:

Option | Description
------ | -----------
`boot` | boot show messages from a specific system boot
`pattern` | pattern filters log entries by the provided PERL-compatible regular expression
`query` | query specifies services(s) or files from which to return logs (required)
`sinceTime` | an [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) timestamp from which to show logs (inclusive)
`untilTime` | an [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) timestamp until which to show logs (inclusive)
`tailLines` | specify how many lines from the end of the log to retrieve; the default is to fetch the whole log

Example of a more complex query:

```shell
# Fetch kubelet logs from a node named node-1.example that have the word "error"
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet&pattern=error"
```

## {{% heading "whatsnext" %}}

* Read about the [Kubernetes Logging Architecture](/docs/concepts/cluster-administration/logging/)
* Read about [Structured Logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* Read about [Contextual Logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
* Read about [deprecation of klog flags](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
* Read about the [Conventions for logging severity](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
* Read about [Log Query](https://kep.k8s.io/2258)
