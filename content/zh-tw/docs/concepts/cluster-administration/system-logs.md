---
title: 系統日誌
content_type: concept
weight: 80
---
<!-- 
reviewers:
- dims
- 44past4
title: System Logs
content_type: concept
weight: 80
-->

<!-- overview -->

<!--
System component logs record events happening in cluster, which can be very useful for debugging.
You can configure log verbosity to see more or less detail.
Logs can be as coarse-grained as showing errors within a component, or as fine-grained as showing
step-by-step traces of events (like HTTP access logs, pod state changes, controller actions, or
scheduler decisions).
-->
系統組件的日誌記錄叢集中發生的事件，這對於調試非常有用。
你可以設定日誌的精細度，以展示更多或更少的細節。
日誌可以是粗粒度的，如只顯示組件內的錯誤，
也可以是細粒度的，如顯示事件的每一個跟蹤步驟（比如 HTTP 訪問日誌、pod 狀態更新、控制器動作或調度器決策）。

<!-- body -->

{{< warning >}}
<!--
In contrast to the command line flags described here, the *log
output* itself does *not* fall under the Kubernetes API stability guarantees:
individual log entries and their formatting may change from one release
to the next!
-->
與此處描述的命令列標誌不同，日誌輸出本身不屬於 Kubernetes API 的穩定性保證範圍：
單個日誌條目及其格式可能會在不同版本之間發生變化！
{{< /warning >}}

## Klog

<!--
klog is the Kubernetes logging library. [klog](https://github.com/kubernetes/klog)
generates log messages for the Kubernetes system components.
-->
klog 是 Kubernetes 的日誌庫。
[klog](https://github.com/kubernetes/klog)
爲 Kubernetes 系統組件生成日誌消息。

<!--
Kubernetes is in the process of simplifying logging in its components.
The following klog command line flags
[are deprecated](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
starting with Kubernetes v1.23 and removed in Kubernetes v1.26:
-->
Kubernetes 正在進行簡化其組件日誌的努力。下面的 klog 命令列參數從 Kubernetes v1.23
開始[已被廢棄](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)，
在 Kubernetes v1.26 中被移除：

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

<!--
Output will always be written to stderr, regardless of the output format. Output redirection is
expected to be handled by the component which invokes a Kubernetes component. This can be a POSIX
shell or a tool like systemd.
-->
輸出總會被寫到標準錯誤輸出（stderr）之上，無論輸出格式如何。
對輸出的重定向將由調用 Kubernetes 組件的軟件來處理。
這一軟件可以是 POSIX Shell 或者類似 systemd 這樣的工具。

<!--
In some cases, for example a distroless container or a Windows system service, those options are
not available. Then the
[`kube-log-runner`](https://github.com/kubernetes/kubernetes/blob/d2a8a81639fcff8d1221b900f66d28361a170654/staging/src/k8s.io/component-base/logs/kube-log-runner/README.md)
binary can be used as wrapper around a Kubernetes component to redirect
output. A prebuilt binary is included in several Kubernetes base images under
its traditional name as `/go-runner` and as `kube-log-runner` in server and
node release archives.
-->
在某些場合下，例如對於無發行主體的（distroless）容器或者 Windows 系統服務，
這些替代方案都是不存在的。那麼你可以使用
[`kube-log-runner`](https://github.com/kubernetes/kubernetes/blob/d2a8a81639fcff8d1221b900f66d28361a170654/staging/src/k8s.io/component-base/logs/kube-log-runner/README.md)
可執行文件來作爲 Kubernetes 的封裝層，完成對輸出的重定向。
在很多 Kubernetes 基礎映像檔中，都包含一個預先構建的可執行程序。
這個程序原來稱作 `/go-runner`，而在伺服器和節點的發行版本庫中，稱作 `kube-log-runner`。

<!--
This table shows how `kube-log-runner` invocations correspond to shell redirection:
-->
下表展示的是 `kube-log-runner` 調用與 Shell 重定向之間的對應關係：

<!--
| Usage                                    | POSIX shell (such as bash) | `kube-log-runner <options> <cmd>`                           |
| -----------------------------------------|----------------------------|-------------------------------------------------------------|
| Merge stderr and stdout, write to stdout | `2>&1`                     | `kube-log-runner` (default behavior)                        |
| Redirect both into log file              | `1>>/tmp/log 2>&1`         | `kube-log-runner -log-file=/tmp/log`                        |
| Copy into log file and to stdout         | `2>&1 \| tee -a /tmp/log`  | `kube-log-runner -log-file=/tmp/log -also-stdout`           |
| Redirect only stdout into log file       | `>/tmp/log`                | `kube-log-runner -log-file=/tmp/log -redirect-stderr=false` |
-->
| 用法                            | POSIX Shell（例如 Bash） | `kube-log-runner <options> <cmd>`  |
| --------------------------------|--------------------------|------------------------------------|
| 合併 stderr 與 stdout，寫出到 stdout | `2>&1`             | `kube-log-runner`（默認行爲 ）|
| 將 stderr 與 stdout 重定向到日誌文件 | `1>>/tmp/log 2>&1` | `kube-log-runner -log-file=/tmp/log` |
| 輸出到 stdout 並複製到日誌文件中     | `2>&1 \| tee -a /tmp/log`  | `kube-log-runner -log-file=/tmp/log -also-stdout` |
| 僅將 stdout 重定向到日誌 | `>/tmp/log` | `kube-log-runner -log-file=/tmp/log -redirect-stderr=false` |

<!--
### Klog output

An example of the traditional klog native format:
-->
### klog 輸出   {#klog-output}

傳統的 klog 原生格式示例：

```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

<!--
The message string may contain line breaks:
-->
消息字符串可能包含換行符：

```
I1025 00:15:15.525108       1 example.go:79] This is a message
which has a line break.
```

<!-- 
### Structured Logging 
-->
### 結構化日誌   {#structured-logging}

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< warning >}}
<!--
Migration to structured log messages is an ongoing process. Not all log messages are structured in
this version. When parsing log files, you must also handle unstructured log messages.

Log formatting and value serialization are subject to change.
-->
遷移到結構化日誌消息是一個正在進行的過程。在此版本中，並非所有日誌消息都是結構化的。
解析日誌文件時，你也必須要處理非結構化日誌消息。

日誌格式和值的序列化可能會發生變化。
{{< /warning>}}

<!--
Structured logging introduces a uniform structure in log messages allowing for programmatic
extraction of information. You can store and process structured logs with less effort and cost.
The code which generates a log message determines whether it uses the traditional unstructured
klog output or structured logging.
-->
結構化日誌記錄旨在日誌消息中引入統一結構，以便以編程方式提取信息。
你可以方便地用更小的開銷來處理結構化日誌。
生成日誌消息的代碼決定其使用傳統的非結構化的 klog 還是結構化的日誌。

<!--
The default formatting of structured log messages is as text, with a format that is backward
compatible with traditional klog:
-->
默認的結構化日誌消息是以文本形式呈現的，其格式與傳統的 klog 保持向後兼容：

```
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

<!--
Example:
-->
示例：

```
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

<!--
Strings are quoted. Other values are formatted with
[`%+v`](https://pkg.go.dev/fmt#hdr-Printing), which may cause log messages to
continue on the next line [depending on the data](https://github.com/kubernetes/kubernetes/issues/106428).
-->
字符串在輸出時會被添加引號。其他數值類型都使用 [`%+v`](https://pkg.go.dev/fmt#hdr-Printing)
來格式化，因此可能導致日誌消息會延續到下一行，
[具體取決於數據本身](https://github.com/kubernetes/kubernetes/issues/106428)。

```
I1025 00:15:15.525108       1 example.go:116] "Example" data="This is text with a line break\nand \"quotation marks\"." someInt=1 someFloat=0.1 someStruct={StringField: First line,
second line.}
```

<!-- 
### Contextual Logging 
-->
### 上下文日誌   {#contextual-logging}

{{< feature-state for_k8s_version="v1.30" state="beta" >}}

<!-- 
Contextual logging builds on top of structured logging. It is primarily about
how developers use logging calls: code based on that concept is more flexible
and supports additional use cases as described in the [Contextual Logging
KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging).
-->
上下文日誌建立在結構化日誌之上。
它主要是關於開發人員如何使用日誌記錄調用：基於該概念的代碼將更加靈活，
並且支持在[結構化日誌 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
中描述的額外用例。

<!-- 
If developers use additional functions like `WithValues` or `WithName` in
their components, then log entries contain additional information that gets
passed into functions by their caller.
-->
如果開發人員在他們的組件中使用額外的函數，比如 `WithValues` 或 `WithName`，
那麼日誌條目將會包含額外的信息，這些信息會被調用者傳遞給函數。

<!-- 
For Kubernetes {{< skew currentVersion >}}, this is gated behind the `ContextualLogging`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and is
enabled by default. The infrastructure for this was added in 1.24 without
modifying components. The
[`component-base/logs/example`](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go)
command demonstrates how to use the new logging calls and how a component
behaves that supports contextual logging.
-->
對於 Kubernetes {{< skew currentVersion >}}，這一特性是由 `StructuredLogging`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)所控制的，默認啓用。
這個基礎設施是在 1.24 中被添加的，並不需要修改組件。
該 [`component-base/logs/example`](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go)
命令演示瞭如何使用新的日誌記錄調用以及組件如何支持上下文日誌記錄。

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

<!-- 
The `logger` key and `foo="bar"` were added by the caller of the function
which logs the `runtime` message and `duration="1m0s"` value, without having to
modify that function.

With contextual logging disable, `WithValues` and `WithName` do nothing and log
calls go through the global klog logger. Therefore this additional information
is not in the log output anymore: 
-->
`logger` 鍵和 `foo="bar"` 會被函數的調用者添加上，
不需修改該函數，它就會記錄 `runtime` 消息和 `duration="1m0s"` 值。

禁用上下文日誌後，`WithValues` 和 `WithName` 什麼都不會做，
並且會通過調用全局的 klog 日誌記錄器記錄日誌。
因此，這些附加信息不再出現在日誌輸出中：

```console
$ go run . --feature-gates ContextualLogging=false
...
I0222 15:14:40.497333  198174 example.go:54] "runtime" duration="1m0s"
I0222 15:14:40.497346  198174 example.go:55] "another runtime" duration="1h0m0s" duration="1m0s"
```

<!--
### JSON log format
-->
### JSON 日誌格式   {#json-log-format}

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{< warning >}}
<!--
JSON output does not support many standard klog flags. For list of unsupported klog flags, see the
[Command line tool reference](/docs/reference/command-line-tools-reference/).

Not all logs are guaranteed to be written in JSON format (for example, during process start).
If you intend to parse logs, make sure you can handle log lines that are not JSON as well.

Field names and JSON serialization are subject to change.
-->
JSON 輸出並不支持太多標準 klog 參數。對於不受支持的 klog 參數的列表，
請參見[命令列工具參考](/zh-cn/docs/reference/command-line-tools-reference/)。

並不是所有日誌都保證寫成 JSON 格式（例如，在進程啓動期間）。
如果你打算解析日誌，請確保可以處理非 JSON 格式的日誌行。

字段名和 JSON 序列化可能會發生變化。
{{< /warning >}}

<!--
The `--logging-format=json` flag changes the format of logs from klog native format to JSON format.
Example of JSON log format (pretty printed):
-->
`--logging-format=json` 參數將日誌格式從 klog 原生格式改爲 JSON 格式。
JSON 日誌格式示例（美化輸出）：

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
* `v` - verbosity (only for info and not for error messages, int)
* `err` - error string (optional, string)
* `msg` - message (required, string)

List of components currently supporting JSON format:
-->
具有特殊意義的 key：

* `ts` - Unix 時間風格的時間戳（必選項，浮點值）
* `v` - 精細度（僅用於 info 級別，不能用於錯誤信息，整數）
* `err` - 錯誤字符串（可選項，字符串）
* `msg` - 消息（必選項，字符串）

當前支持 JSON 格式的組件列表：

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

<!--
### Log verbosity level

The `-v` flag controls log verbosity. Increasing the value increases the number of logged events.
Decreasing the value decreases the number of logged events.  Increasing verbosity settings logs
increasingly less severe events. A verbosity setting of 0 logs only critical events.
-->
### 日誌精細度級別   {#log-verbosity-level}

參數 `-v` 控制日誌的精細度。增大該值會增大日誌事件的數量。
減小該值可以減小日誌事件的數量。增大精細度會記錄更多的不太嚴重的事件。
精細度設置爲 0 時只記錄關鍵（critical）事件。

<!--
### Log location

There are two types of system components: those that run in a container and those
that do not run in a container. For example:

* The Kubernetes scheduler and kube-proxy run in a container.
* The kubelet and {{<glossary_tooltip term_id="container-runtime" text="container runtime">}}
  do not run in containers.
-->
### 日誌位置   {#log-location}

有兩種類型的系統組件：運行在容器中的組件和不運行在容器中的組件。例如：

* Kubernetes 調度器和 kube-proxy 在容器中運行。
* kubelet 和{{<glossary_tooltip term_id="container-runtime" text="容器運行時">}}不在容器中運行。

<!--
On machines with systemd, the kubelet and container runtime write to journald.
Otherwise, they write to `.log` files in the `/var/log` directory.
System components inside containers always write to `.log` files in the `/var/log` directory,
bypassing the default logging mechanism.
Similar to the container logs, you should rotate system component logs in the `/var/log` directory.
In Kubernetes clusters created by the `kube-up.sh` script, log rotation is configured by the `logrotate` tool.
The `logrotate` tool rotates logs daily, or once the log size is greater than 100MB.
-->
在使用 systemd 的系統中，kubelet 和容器運行時寫入 journald。
在別的系統中，日誌寫入 `/var/log` 目錄下的 `.log` 文件中。
容器中的系統組件總是繞過默認的日誌記錄機制，寫入 `/var/log` 目錄下的 `.log` 文件。
與容器日誌類似，你應該輪轉 `/var/log` 目錄下系統組件日誌。
在 `kube-up.sh` 腳本創建的 Kubernetes 叢集中，日誌輪轉由 `logrotate` 工具設定。
`logrotate` 工具，每天或者當日誌大於 100MB 時，輪轉日誌。

<!--
## Log query
-->
## 日誌查詢   {#log-query}

{{< feature-state feature_gate_name="NodeLogQuery" >}}

<!--
To help with debugging issues on nodes, Kubernetes v1.27 introduced a feature that allows viewing logs of services
running on the node. To use the feature, ensure that the `NodeLogQuery`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled for that node, and that the
kubelet configuration options `enableSystemLogHandler` and `enableSystemLogQuery` are both set to true. On Linux
the assumption is that service logs are available via journald. On Windows the assumption is that service logs are
available in the application log provider. On both operating systems, logs are also available by reading files within
`/var/log/`.
-->
爲了幫助在節點上調試問題，Kubernetes v1.27 引入了一個特性來查看節點上當前運行服務的日誌。
要使用此特性，請確保已爲節點啓用了 `NodeLogQuery`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
且 kubelet 設定選項 `enableSystemLogHandler` 和 `enableSystemLogQuery` 均被設置爲 true。
在 Linux 上，我們假設可以通過 journald 查看服務日誌。
在 Windows 上，我們假設可以在應用日誌提供程序中查看服務日誌。
在兩種操作系統上，都可以通過讀取 `/var/log/` 內的文件查看日誌。

<!--
Provided you are authorized to interact with node objects, you can try out this feature on all your nodes or
just a subset. Here is an example to retrieve the kubelet service logs from a node:

```shell
# Fetch kubelet logs from a node named node-1.example
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet"
```
-->
假如你被授權與節點對象交互，你可以在所有節點或只是某個子集上試用此特性。
這裏有一個從節點中檢索 kubelet 服務日誌的例子：

```shell
# 從名爲 node-1.example 的節點中獲取 kubelet 日誌
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet"
```

<!--
You can also fetch files, provided that the files are in a directory that the kubelet allows for log
fetches. For example, you can fetch a log from `/var/log` on a Linux node:
-->
你也可以獲取文件，前提是日誌文件位於 kubelet 允許進行日誌獲取的目錄中。
例如你可以從 Linux 節點上的 `/var/log` 中獲取日誌。

```shell
kubectl get --raw "/api/v1/nodes/<insert-node-name-here>/proxy/logs/?query=/<insert-log-file-name-here>"
```

<!--
The kubelet uses heuristics to retrieve logs. This helps if you are not aware whether a given system service is
writing logs to the operating system's native logger like journald or to a log file in `/var/log/`. The heuristics
first checks the native logger and if that is not available attempts to retrieve the first logs from
`/var/log/<servicename>` or `/var/log/<servicename>.log` or `/var/log/<servicename>/<servicename>.log`.

The complete list of options that can be used are:
-->
kubelet 使用啓發方式來檢索日誌。
如果你還未意識到給定的系統服務正將日誌寫入到操作系統的原生日誌記錄程序（例如 journald）
或 `/var/log/` 中的日誌文件，這會很有幫助。這種啓發方式先檢查原生的日誌記錄程序，
如果不可用，則嘗試從 `/var/log/<servicename>`、`/var/log/<servicename>.log`
或 `/var/log/<servicename>/<servicename>.log` 中檢索第一批日誌。

可用選項的完整列表如下：

<!--
Option | Description
------ | -----------
`boot` | boot show messages from a specific system boot
`pattern` | pattern filters log entries by the provided PERL-compatible regular expression
`query` | query specifies services(s) or files from which to return logs (required)
`sinceTime` | an [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) timestamp from which to show logs (inclusive)
`untilTime` | an [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) timestamp until which to show logs (inclusive)
`tailLines` | specify how many lines from the end of the log to retrieve; the default is to fetch the whole log
-->
選項 | 描述
------ | -----------
`boot` | `boot` 顯示來自特定系統引導的消息
`pattern` | `pattern` 通過提供的兼容 PERL 的正則表達式來過濾日誌條目
`query` | `query` 是必需的，指定返回日誌的服務或文件
`sinceTime` | 顯示日誌的 [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) 起始時間戳（包含）
`untilTime` | 顯示日誌的 [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) 結束時間戳（包含）
`tailLines` | 指定要從日誌的末尾檢索的行數；默認爲獲取全部日誌

<!--
Example of a more complex query:

```shell
# Fetch kubelet logs from a node named node-1.example that have the word "error"
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet&pattern=error"
```
-->
更復雜的查詢示例：

```shell
# 從名爲 node-1.example 且帶有單詞 "error" 的節點中獲取 kubelet 日誌
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet&pattern=error"
```

## {{% heading "whatsnext" %}}

<!--
* Read about the [Kubernetes Logging Architecture](/docs/concepts/cluster-administration/logging/)
* Read about [Structured Logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* Read about [Contextual Logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
* Read about [deprecation of klog flags](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
* Read about the [Conventions for logging severity](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
* Read about [Log Query](https://kep.k8s.io/2258)
-->
* 閱讀 [Kubernetes 日誌架構](/zh-cn/docs/concepts/cluster-administration/logging/)
* 閱讀[結構化日誌提案（英文）](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* 閱讀[上下文日誌提案（英文）](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
* 閱讀 [klog 參數的廢棄（英文）](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
* 閱讀[日誌嚴重級別約定（英文）](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
* 閱讀[日誌查詢](https://kep.k8s.io/2258)

