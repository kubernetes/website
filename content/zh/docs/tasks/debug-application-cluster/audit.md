---
reviewers:
- soltysh
- sttts
- ericchiang
content_template: templates/concept
title: Auditing
---

{{% capture overview %}}

{{< feature-state state="beta" >}}

<!--
Kubernetes auditing provides a security-relevant chronological set of records documenting
the sequence of activities that have affected system by individual users, administrators
or other components of the system. It allows cluster administrator to
answer the following questions:
-->
Kubernetes 审计功能提供了与安全相关的按时间顺序排列的记录集，记录单个用户、管理员或系统其他组件影响系统的活动顺序。
它能帮助集群管理员处理以下问题：

<!--
 - what happened?
 - when did it happen?
 - who initiated it?
 - on what did it happen?
 - where was it observed?
 - from where was it initiated?
 - to where was it going?
-->
 - 发生了什么？
 - 什么时候发生的？
 - 谁触发的？
 - 活动发生在哪个（些）对象上？
 - 在哪观察到的？
 - 它从哪触发的？
 - 活动的后续处理行为是什么？

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

<!--
[Kube-apiserver][kube-apiserver] performs auditing. Each request on each stage
of its execution generates an event, which is then pre-processed according to
a certain policy and written to a backend. The policy determines what's recorded
and the backends persist the records. The current backend implementations
include logs files and webhooks.
-->
[Kube-apiserver][kube-apiserver] 执行审计。每个执行阶段的每个请求都会生成一个事件，然后根据特定策略对事件进行预处理并写入后端。
您可以在 [设计方案][auditing-proposal] 中找到更多详细信息。
该策略确定记录的内容并且在后端存储记录。当前的后端支持日志文件和 webhook。

<!--
Each request can be recorded with an associated "stage". The known stages are:

- `RequestReceived` - The stage for events generated as soon as the audit
  handler receives the request, and before it is delegated down the handler
  chain.
- `ResponseStarted` - Once the response headers are sent, but before the
  response body is sent. This stage is only generated for long-running requests
  (e.g. watch).
- `ResponseComplete` - The response body has been completed and no more bytes
  will be sent.
- `Panic` - Events generated when a panic occurred.
-->

每个请求都可以用相关的 "stage" 记录。已知的 stage 有：

- `RequestReceived` - 事件的 stage 将在审计处理器接收到请求后，并且在委托给其余处理器之前生成。

- `ResponseStarted` - 在响应消息的头部发送后，但是响应消息体发送前。这个 stage 仅为长时间运行的请求生成（例如 watch）。

- `ResponseComplete` - 当响应消息体完成并且没有更多数据需要传输的时候。
- `Panic` - 当 panic 发生时生成。

{{< note >}}
<!--
The audit logging feature increases the memory consumption of the API
server because some context required for auditing is stored for each request.
Additionally, memory consumption depends on the audit logging configuration.
-->
**注意** 审计日志记录功能会增加 API server 的内存消耗，因为需要为每个请求存储审计所需的某些上下文。
此外，内存消耗取决于审计日志记录的配置。
{{< /note >}}

<!--
## Audit Policy

Audit policy defines rules about what events should be recorded and what data
they should include. The audit policy object structure is defined in the
[`audit.k8s.io` API group][auditing-api]. When an event is processed, it's
compared against the list of rules in order. The first matching rule sets the
"audit level" of the event. The known audit levels are:
-->
## 审计策略

审计政策定义了关于应记录哪些事件以及应包含哪些数据的规则。审计策略对象结构在 [`audit.k8s.io` API 组][auditing-api] 中定义。
处理事件时，将按顺序与规则列表进行比较。第一个匹配规则设置事件的 [审计级别][auditing-level]。已知的审计级别有：

<!--
- `None` - don't log events that match this rule.
- `Metadata` - log request metadata (requesting user, timestamp, resource,
  verb, etc.) but not request or response body.
- `Request` - log event metadata and request body but not response body.
  This does not apply for non-resource requests.
- `RequestResponse` - log event metadata, request and response bodies.
  This does not apply for non-resource requests.
-->
- `None` - 符合这条规则的日志将不会记录。
- `Metadata` - 记录请求的 metadata（请求的用户、timestamp、resource、verb 等等），但是不记录请求或者响应的消息体。
- `Request` - 记录事件的 metadata 和请求的消息体，但是不记录响应的消息体。这不适用于非资源类型的请求。
- `RequestResponse` - 记录事件的 metadata，请求和响应的消息体。这不适用于非资源类型的请求。

<!--
You can pass a file with the policy to [kube-apiserver][kube-apiserver]
using the `--audit-policy-file` flag. If the flag is omitted, no events are logged.
Note that the `rules` field __must__ be provided in the audit policy file.
A policy with no (0) rules is treated as illegal.

Below is an example audit policy file:
-->
您可以使用 `--audit-policy-file` 标志将包含策略的文件传递给 [kube-apiserver][kube-apiserver]。如果不设置该标志，则不记录事件。 
注意 `rules` 字段 __必须__ 在审计策略文件中提供。没有（0）规则的策略将被视为非法配置。

以下是一个审计策略文件的示例：

{{< codenew file="audit/audit-policy.yaml" >}}

<!--
You can use a minimal audit policy file to log all requests at the `Metadata` level:
-->
您可以使用最低限度的审计策略文件在 `Metadata` 级别记录所有请求：

```yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1beta1
kind: Policy
rules:
- level: Metadata
```

<!--
The [audit profile used by GCE][gce-audit-profile] should be used as reference by
admins constructing their own audit profiles.
-->
管理员构建自己的审计配置文件时，应使用 [GCE 使用的审计配置文件][gce-audit-profile] 作为参考。

<!--
## Audit backends

Audit backends persist audit events to an external storage.
[Kube-apiserver][kube-apiserver] out of the box provides two backends:

- Log backend, which writes events to a disk
- Webhook backend, which sends events to an external API

In both cases, audit events structure is defined by the API in the
`audit.k8s.io` API group. The current version of the API is
[`v1beta1`][auditing-api].
-->
## 审计后端

审计后端实现将审计事件导出到外部存储。
[Kube-apiserver][kube-apiserver] 提供两个后端：

- Log 后端，将事件写入到磁盘
- Webhook 后端，将事件发送到外部 API

在这两种情况下，审计事件结构均由 `audit.k8s.io` API 组中的 API 定义。当前版本的 API 是 [`v1beta1`][auditing-api]。

{{< note >}}
<!--
In case of patches, request body is a JSON array with patch operations, not a JSON object
with an appropriate Kubernetes API object. For example, the following request body is a valid patch
request to `/apis/batch/v1/namespaces/some-namespace/jobs/some-job-name`.
-->
**注意：** 在 patch 请求的情况下，请求的消息体需要是一个 JSON 串指定 patch 操作，而不是一个完整的 Kubernetes API 对象 JSON 串。
例如，以下的示例是一个合法的 patch 请求消息体，该请求对应 `/apis/batch/v1/namespaces/some-namespace/jobs/some-job-name`。

```json
[
  {
    "op": "replace",
    "path": "/spec/parallelism",
    "value": 0
  },
  {
    "op": "remove",
    "path": "/spec/template/spec/containers/0/terminationMessagePolicy"
  }
]
```
{{< /note >}}

<!--
### Log backend

Log backend writes audit events to a file in JSON format. You can configure
log audit backend using the following [kube-apiserver][kube-apiserver] flags:
-->
### Log 后端

Log 后端将审计事件写入 JSON 格式的文件。您可以使用以下 [kube-apiserver][kube-apiserver] 标志配置 Log 审计后端：

<!--
- `--audit-log-path` specifies the log file path that log backend uses to write
  audit events. Not specifying this flag disables log backend. `-` means standard out
- `--audit-log-maxage` defined the maximum number of days to retain old audit log files
- `--audit-log-maxbackup` defines the maximum number of audit log files to retain
- `--audit-log-maxsize` defines the maximum size in megabytes of the audit log file before it gets rotated
-->
- `--audit-log-path` 指定用来写入审计事件的日志文件路径。不指定此标志会禁用日志后端。`-` 意味着标准化
- `--audit-log-maxage` 定义了保留旧审计日志文件的最大天数
- `--audit-log-maxbackup` 定义了要保留的审计日志文件的最大数量
- `--audit-log-maxsize` 定义审计日志文件的最大大小（兆字节）

<!--
### Webhook backend

Webhook backend sends audit events to a remote API, which is assumed to be the
same API as [kube-apiserver][kube-apiserver] exposes. You can configure webhook
audit backend using the following kube-apiserver flags:
-->
### Webhook 后端

Webhook 后端将审计事件发送到远程 API，该远程 API 应该暴露与 [kube-apiserver][kube-apiserver] 相同的API。
您可以使用如下 kube-apiserver 标志来配置 webhook 审计后端：

<!--
- `--audit-webhook-config-file` specifies the path to a file with a webhook
  configuration. Webhook configuration is effectively a [kubeconfig][kubeconfig].
- `--audit-webhook-initial-backoff` specifies the amount of time to wait after the first failed
  request before retrying. Subsequent requests are retried with exponential backoff.

The webhook config file uses the kubeconfig format to specify the remote address of
the service and credentials used to connect to it.
-->
- `--audit-webhook-config-file` webhook 配置文件的路径。Webhook 配置文件实际上是一个 [kubeconfig][kubeconfig]。
- `--audit-webhook-initial-backoff` 指定在第一次失败后重发请求等待的时间。随后的请求将以指数退避重试。

webhook 配置文件使用 kubeconfig 格式指定服务的远程地址和用于连接它的凭据。

### Batching

<!--
Both log and webhook backends support batching. Using webhook as an example, here's the list of
available flags. To get the same flag for log backend, replace `webhook` with `log` in the flag
name. By default, batching is enabled in `webhook` and disabled in `log`. Similarly, by default
throttling is enabled in `webhook` and disabled in `log`.

- `--audit-webhook-mode` defines the buffering strategy. One of the following:
  - `batch` - buffer events and asynchronously process them in batches. This is the default.
  - `blocking` - block API server responses on processing each individual event.
-->

log 和 webhook 后端都支持 batch。以 webhook 为例，以下是可用参数列表。要获取 log 后端的同样参数，请在参数名称中将 `webhook` 替换为 `log`。
默认情况下，在 `webhook` 中启用 batch，在 `log` 中禁用 batch。同样，默认情况下，在 `webhook` 中启用限制，在 `log` 中禁用限制。

- `--audit-webhook-mode` 定义缓存策略，可选值如下：
  - `batch` - 以批处理缓存事件和异步的过程。这是默认值。
  - `blocking` - 阻止 API server 处理每个单独事件的响应。

<!--
The following flags are used only in the `batch` mode.

- `--audit-webhook-batch-buffer-size` defines the number of events to buffer before batching.
  If the rate of incoming events overflows the buffer, events are dropped.
- `--audit-webhook-batch-max-size` defines the maximum number of events in one batch.
- `--audit-webhook-batch-max-wait` defines the maximum amount of time to wait before unconditionally
  batching events in the queue.
- `--audit-webhook-batch-throttle-qps` defines the maximum average number of batches generated
  per second.
- `--audit-webhook-batch-throttle-burst` defines the maximum number of batches generated at the same
  moment if the allowed QPS was underutilized previously.
-->
以下参数仅用于 `batch` 模式。

- `--audit-webhook-batch-buffer-size` 定义 batch 之前要缓存的事件数。
  如果传入事件的速率溢出缓存区，则会丢弃事件。
- `--audit-webhook-batch-max-size` 定义一个 batch 中的最大事件数。
- `--audit-webhook-batch-max-wait` 无条件 batch 队列中的事件前等待的最大事件。
- `--audit-webhook-batch-throttle-qps` 每秒生成的最大 batch 平均值。
- `--audit-webhook-batch-throttle-burst` 在达到允许的 QPS 前，同一时刻允许存在的最大 batch 生成数。

<!--
#### Parameter tuning

Parameters should be set to accommodate the load on the apiserver.

For example, if kube-apiserver receives 100 requests each second, and each request is audited only
on `ResponseStarted` and `ResponseComplete` stages, you should account for ~200 audit
events being generated each second. Assuming that there are up to 100 events in a batch,
you should set throttling level at least 2 QPS. Assuming that the backend can take up to
5 seconds to write events, you should set the buffer size to hold up to 5 seconds of events, i.e.
10 batches, i.e. 1000 events.
-->
#### 参数调整

需要设置参数以适应 apiserver 上的负载。


例如，如果 kube-apiserver 每秒收到 100 个请求，并且每个请求仅在 `ResponseStarted` 和 `ResponseComplete` 阶段进行审计，则应该考虑每秒生成约 200 个审计事件。
假设批处理中最多有 100 个事件，则应将限制级别设置为至少 2 个 QPS。
假设后端最多需要 5 秒钟来写入事件，您应该设置缓冲区大小以容纳最多 5 秒的事件，即 10 个 batch，即 1000 个事件。

<!--
In most cases however, the default parameters should be sufficient and you don't have to worry about
setting them manually. You can look at the following Prometheus metrics exposed by kube-apiserver
and in the logs to monitor the state of the auditing subsystem.

- `apiserver_audit_event_total` metric contains the total number of audit events exported.
- `apiserver_audit_error_total` metric contains the total number of events dropped due to an error
  during exporting.
-->
但是，在大多数情况下，默认参数应该足够了，您不必手动设置它们。您可以查看 kube-apiserver 公开的以下 Prometheus 指标，并在日志中监控审计子系统的状态。

- `apiserver_audit_event_total` 包含所有暴露的审计事件数量的指标。
- `apiserver_audit_error_total` 在暴露时由于发生错误而被丢弃的事件的数量。

<!--
## Multi-cluster setup

If you're extending the Kubernetes API with the [aggregation layer][kube-aggregator], you can also
set up audit logging for the aggregated apiserver. To do this, pass the configuration options in the
same format as described above to the aggregated apiserver and set up the log ingesting pipeline
to pick up audit logs. Different apiservers can have different audit configurations and different
audit policies.
-->
## 多集群配置

如果您通过 [aggregation layer][kube-aggregator] 对 Kubernetes API 进行扩展，那么您也可以为聚合的 apiserver 设置审计日志。
想要这么做，您需要以上述的格式给聚合的 apiserver 配置参数，并且配置日志管道以采用审计日志。不同的 apiserver 可以配置不同的审计配置和策略。

<!--
## Log Collector Examples

### Use fluentd to collect and distribute audit events from log file

[Fluentd][fluentd] is an open source data collector for unified logging layer.
In this example, we will use fluentd to split audit events by different namespaces.

1. install [fluentd, fluent-plugin-forest and fluent-plugin-rewrite-tag-filter][fluentd_install_doc] in the kube-apiserver node
1. create a config file for fluentd
-->
## 日志选择器示例

### 使用 fluentd 从日志文件中选择并且分发审计日志

[Fluentd][fluentd] 是一个开源的数据采集器，可以从统一的日志层中采集。
在以下示例中，我们将使用 fluentd 来按照命名空间划分审计事件。

1. 在 kube-apiserver node 节点上安装 [fluentd, fluent-plugin-forest and fluent-plugin-rewrite-tag-filter][fluentd_install_doc]
1. 为 fluentd 创建一个配置文件

    ```none
    $ cat <<EOF > /etc/fluentd/config
    # fluentd conf runs in the same host with kube-apiserver
    <source>
        @type tail
        # audit log path of kube-apiserver
        path /var/log/audit
        pos_file /var/log/audit.pos
        format json
        time_key time
        time_format %Y-%m-%dT%H:%M:%S.%N%z
        tag audit
    </source>

    <filter audit>
        #https://github.com/fluent/fluent-plugin-rewrite-tag-filter/issues/13
        type record_transformer
        enable_ruby
        <record>
         namespace ${record["objectRef"].nil? ? "none":(record["objectRef"]["namespace"].nil? ?  "none":record["objectRef"]["namespace"])}
        </record>
    </filter>

    <match audit>
        # route audit according to namespace element in context
        @type rewrite_tag_filter
        rewriterule1 namespace ^(.+) ${tag}.$1
    </match>

    <filter audit.**>
       @type record_transformer
       remove_keys namespace
    </filter>

    <match audit.**>
        @type forest
        subtype file
        remove_prefix audit
        <template>
            time_slice_format %Y%m%d%H
            compress gz
            path /var/log/audit-${tag}.*.log
            format json
            include_time_key true
        </template>
    </match>
    ```

<!--
1. start fluentd
-->
1. 启动 fluentd

    ```shell
    $ fluentd -c /etc/fluentd/config  -vv
    ```

<!--
1. start kube-apiserver with the following options:
-->
1. 给 kube-apiserver 配置以下参数并启动：

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-log-path=/var/log/kube-audit --audit-log-format=json
    ```

<!--
1. check audits for different namespaces in `/var/log/audit-*.log`
-->
1. 在 `/var/log/audit-*.log` 文件中检查不同命名空间的审计事件

<!--
### Use logstash to collect and distribute audit events from webhook backend

[Logstash][logstash] is an open source, server-side data processing tool. In this example,
we will use logstash to collect audit events from webhook backend, and save events of
different users into different files.

1. install [logstash][logstash_install_doc]
1. create config file for logstash
-->
### 使用 logstash 采集并分发 webhook 后端的审计事件

[Logstash][logstash] 是一个开源的、服务器端的数据处理工具。在下面的示例中，我们将使用 logstash 采集 webhook 后端的审计事件，并且将来自不同用户的事件存入不同的文件。

1. 安装 [logstash][logstash_install_doc]
1. 为 logstash 创建配置文件

    ```none
    $ cat <<EOF > /etc/logstash/config
    input{
        http{
            #TODO, figure out a way to use kubeconfig file to authenticate to logstash
            #https://www.elastic.co/guide/en/logstash/current/plugins-inputs-http.html#plugins-inputs-http-ssl
            port=>8888
        }
    }
    filter{
        split{
            # Webhook audit backend sends several events together with EventList
            # split each event here.
            field=>[items]
            # We only need event subelement, remove others.
            remove_field=>[headers, metadata, apiVersion, "@timestamp", kind, "@version", host]
        }
        mutate{
            rename => {items=>event}
        }
    }
    output{
        file{
            # Audit events from different users will be saved into different files.
            path=>"/var/log/kube-audit-%{[event][user][username]}/audit"
        }
    }
    ```

<!--
1. start logstash
-->
1. 启动 logstash

    ```shell
    $ bin/logstash -f /etc/logstash/config --path.settings /etc/logstash/
    ```

<!--
1. create a [kubeconfig file](/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/) for kube-apiserver webhook audit backend
-->
1. 为 kube-apiserver webhook 审计后端创建一个 [kubeconfig 文件](/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/)

    ```none
    $ cat <<EOF > /etc/kubernetes/audit-webhook-kubeconfig
    apiVersion: v1
    clusters:
    - cluster:
        server: http://<ip_of_logstash>:8888
      name: logstash
    contexts:
    - context:
        cluster: logstash
        user: ""
      name: default-context
    current-context: default-context
    kind: Config
    preferences: {}
    users: []
    EOF
    ```

<!--
1. start kube-apiserver with the following options:
-->
1. 为 kube-apiserver 配置以下参数并启动：

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
    ```

<!--
1. check audits in logstash node's directories `/var/log/kube-audit-*/audit`

Note that in addition to file output plugin, logstash has a variety of outputs that
let users route data where they want. For example, users can emit audit events to elasticsearch
plugin which supports full-text search and analytics.
-->
1. 在 logstash node 节点的 `/var/log/kube-audit-*/audit` 目录中检查审计事件

注意到，除了文件输出插件外，logstash 还有其它多种输出可以让用户路由不同的数据。例如，用户可以将审计事件发送给支持全文搜索和分析的 elasticsearch 插件。

<!--
## Legacy Audit

__Note:__ Legacy Audit is deprecated and is disabled by default since 1.8 and 
will be removed in 1.12. To fallback to this legacy audit, disable the advanced
auditing feature using the `AdvancedAuditing` feature gate in [kube-apiserver][kube-apiserver]:
-->
## 传统的审计

__注意：__ 传统审计已被弃用，自 1.8 版本以后默认禁用，并且将会在 1.12 版本中彻底移除。
如果想要回退到传统的审计功能，请使用 [kube-apiserver][kube-apiserver] 中 feature gate 的 `AdvancedAuditing` 功能来禁用高级审核功能：

```
--feature-gates=AdvancedAuditing=false
```

<!--
In legacy format, each audit log entry contains two lines:

1. The request line containing a unique ID to match the response and request
   metadata, such as the source IP, requesting user, impersonation information,
   resource being requested, etc.
2. The response line containing a unique ID matching the request line and the response code.

Example output for `admin` user listing pods in the `default` namespace:
-->
在传统格式中，每个审计文件条目包含两行：

1. 请求行包含唯一 ID 以匹配响应和请求元数据，例如源 IP、请求用户、模拟信息和请求的资源等。
2. 响应行包含与请求行和响应代码相匹配的唯一 ID。

```
2017-03-21T03:57:09.106841886-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" ip="127.0.0.1" method="GET" user="admin" groups="\"system:masters\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="default" uri="/api/v1/namespaces/default/pods"
2017-03-21T03:57:09.108403639-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" response="200"
```

<!--
### Configuration

[Kube-apiserver][kube-apiserver] provides the following options which are responsible
for configuring where and how audit logs are handled:
-->
### 配置

[Kube-apiserver][kube-apiserver] 提供以下选项，负责配置审核日志的位置和处理方式：

<!--
- `audit-log-path` - enables the audit log pointing to a file where the requests are being logged to, '-' means standard out.
- `audit-log-maxage` - specifies maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
- `audit-log-maxbackup` - specifies maximum number of old audit log files to retain.
- `audit-log-maxsize` - specifies maximum size in megabytes of the audit log file before it gets rotated. Defaults to 100MB.
-->
- `audit-log-path` - 使审计日志指向请求被记录到的文件，'-' 表示标准输出。
- `audit-log-maxage` - 根据文件名中编码的时间戳指定保留旧审计日志文件的最大天数。
- `audit-log-maxbackup` - 指定要保留的旧审计日志文件的最大数量。
- `audit-log-maxsize` - 指定审核日志文件的最大大小（兆字节）。默认为100MB。

<!--
If an audit log file already exists, Kubernetes appends new audit logs to that file.
Otherwise, Kubernetes creates an audit log file at the location you specified in
`audit-log-path`. If the audit log file exceeds the size you specify in `audit-log-maxsize`,
Kubernetes will rename the current log file by appending the current timestamp on
the file name (before the file extension) and create a new audit log file.
Kubernetes may delete old log files when creating a new log file; you can configure
how many files are retained and how old they can be by specifying the `audit-log-maxbackup`
and `audit-log-maxage` options.
-->
如果审核日志文件已经存在，则 Kubernetes 会将新的审核日志附加到该文件。
否则，Kubernetes 会在您在 `audit-log-path` 中指定的位置创建一个审计日志文件。
如果审计日志文件超过了您在 `audit-log-maxsize` 中指定的大小，则 Kubernetes 将通过在文件名（在文件扩展名之前）附加当前时间戳并重新创建一个新的审计日志文件来重命名当前日志文件。
Kubernetes 可能会在创建新的日志文件时删除旧的日志文件; 您可以通过指定 `audit-log-maxbackup` 和 `audit-log-maxage` 选项来配置保留多少文件以及它们的保留时间。

[kube-apiserver]: /docs/admin/kube-apiserver
[auditing-proposal]: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/auditing.md
[auditing-api]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/staging/src/k8s.io/apiserver/pkg/apis/audit/v1beta1/types.go
[gce-audit-profile]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh#L735
[kubeconfig]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[fluentd]: http://www.fluentd.org/
[fluentd_install_doc]: http://docs.fluentd.org/v0.12/articles/quickstart#step1-installing-fluentd
[logstash]: https://www.elastic.co/products/logstash
[logstash_install_doc]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
[kube-aggregator]: /docs/concepts/api-extension/apiserver-aggregation

{{% /capture %}}
