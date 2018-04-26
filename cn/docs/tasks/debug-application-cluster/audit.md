---
cn-approvers:
- tianshapjq
reviewers:
- soltysh
- sttts
- ericchiang
title: 审计
---
<!--
---
reviewers:
- soltysh
- sttts
- ericchiang
title: Auditing
---
-->

* TOC
{:toc}

{% include feature-state-beta.md %}

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
 - 为什么发生？
 - 在哪观察到的？
 - 它从哪触发的？
 - 它将产生什么后果？

<!--
[Kube-apiserver][kube-apiserver] performs auditing. Each request on each stage
of its execution generates an event, which is then pre-processed according to
a certain policy and written to a backend. You can find more details about the
pipeline in the [design proposal][auditing-proposal].
-->
[Kube-apiserver][kube-apiserver] 执行审计。每个执行阶段的每个请求都会生成一个事件，然后根据特定策略对事件进行预处理并写入后端。您可以在 [设计方案][auditing-proposal] 中找到更多详细信息。

<!--
## Audit Policy

Audit policy defines rules about what events should be recorded and what data
they should include. When an event is processed, it's compared against the list
of rules in order. The first matching rule sets the [audit level][auditing-level]
of the event. The audit policy object structure is defined in the
[`audit.k8s.io` API group][auditing-api].
-->
## 审计策略

审计政策定义了关于应记录哪些事件以及应包含哪些数据的规则。处理事件时，将按顺序与规则列表进行比较。第一个匹配规则设置事件的 [审计级别][auditing-level]。 审计策略对象结构在 [`audit.k8s.io` API 组][auditing-api] 中定义。

<!--
You can pass a file with the policy to [kube-apiserver][kube-apiserver]
using the `--audit-policy-file` flag. If the flag is omitted, no events are logged.
__Note:__ `kind` and `apiVersion` fields along with `rules` __must__ be provided
in the audit policy file. A policy with no (0) rules, or a policy that doesn't
provide valid `apiVersion` and `kind` values is treated as illegal.

Some example audit policy files:
-->
您可以使用 `--audit-policy-file` 标志将包含策略的文件传递给 [kube-apiserver][kube-apiserver]。如果不设置该标志，则不记录事件。 __注意：__ `kind` 和 `apiVersion` 字段以及 `rules` __必须__ 在审计策略文件中提供。没有（0）规则的策略或者不提供有效的 `apiVersion` 和 `kind` 值的策略将被视为非法配置。

{% include code.html language="yaml" file="audit-policy.yaml" ghlink="/docs/tasks/debug-application-cluster/audit-policy.yaml" %}

<!--
You can use a minimal audit policy file to log all requests at the `Metadata` level:
-->
您可以使用最低限度的审计策略文件在`元数据`级别记录所有请求：

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
管理员构建自己的审计配置文件时，应使用 [GCE使用的审计配置文件][gce-audit-profile] 作为参考。

<!--
## Audit backends

Audit backends implement exporting audit events to an external storage.
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
- `--audit-webhook-mode` define the buffering strategy, one of the following:
  - `batch` - buffer events and asynchronously send the set of events to the external service
    This is the default
  - `blocking` - block API server responses on sending each event to the external service

The webhook config file uses the kubeconfig format to specify the remote address of
the service and credentials used to connect to it.
-->
- `--audit-webhook-config-file` webhook 配置文件的路径。Webhook 配置文件实际上是一个 [kubeconfig][kubeconfig]。
- `--audit-webhook-mode` 定义缓冲策略，如下所示：
  - `batch` - 缓冲事件并异步地将事件发送到外部服务。这是默认设置。
  - `blocking` - 当发送事件到外部服务时，阻止 API server 的响应。

<!--
## Log Collector Examples

### Use fluentd to collect and distribute audit events from log file

[Fluentd][fluentd] is an open source data collector for unified logging layer.
In this example, we will use fluentd to split audit events by different namespaces.
-->
## 日志采集器示例

### 使用 fluentd 来采集和分发日志文件中的审计事件

[Fluentd][fluentd] 是一个统一日志记录层的开源数据收集器。
在这个例子中，我们将使用 fluentd 通过不同的命名空间来分割审计事件。

<!--
1. install [fluentd, fluent-plugin-forest and fluent-plugin-rewrite-tag-filter][fluentd_install_doc] in the kube-apiserver node
1. create a config file for fluentd
-->
1. 在 kube-apiserver 节点中安装 [fluentd，fluent-plugin-forest 和 fluent-plugin-rewrite-tag-filter][fluentd_install_doc]
1. 为 fluentd 创建一个配置文件

   ```shell
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
1. 使用以下选项启动 kube-apiserver：

   ```shell
   --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-log-path=/var/log/kube-audit --audit-log-format=json
   ```

<!--
1. check audits for different namespaces in /var/log/audit-*.log
-->
1. 检查 /var/log/audit-*.log 中不同命名空间的审计内容

<!--
### Use logstash to collect and distribute audit events from webhook backend

[Logstash][logstash] is an open source, server-side data processing tool. In this example,
we will use logstash to collect audit events from webhook backend, and save events of
different users into different files.
-->
### 使用 logstash 从 webhook 后端收集和分发审计事件

[Logstash][logstash] 是一个开源的服务器端数据处理工具。在这个例子中，我们将使用 logstash 从 webhook 后端收集审计事件，并将不同用户的事件保存到不同的文件中。

<!--
1. install [logstash][logstash_install_doc]
1. create config file for logstash
-->
1. 安装 [logstash][logstash_install_doc]
1. 为 logstash 创建配置文件

   ```shell
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

   ```shell
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
1. 使用以下选项启动 kube-apiserver：

   ```shell
   --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
   ```

<!--
1. check audits in logstash node's directories /var/log/kube-audit-*/audit
-->
1. 检查 logstash 节点的 /var/log/kube-audit-*/audit 目录中的审计内容

<!--
Note that in addition to file output plugin, logstash has a variety of outputs that
let users route data where they want. For example, users can emit audit events to elasticsearch
plugin which supports full-text search and analytics.
-->
请注意，除了文件输出插件之外，logstash 还提供了多种输出，可将数据发送到用户指定的地方。例如，用户可以将审计事件发送到支持全文搜索和分析的 elasticsearch 插件。

<!--
## Legacy Audit

__Note:__ Legacy Audit is deprecated and is disabled by default since Kubernetes 1.8.
To fallback to this legacy audit, disable the advanced auditing feature
using the `AdvancedAuditing` feature gate in [kube-apiserver][kube-apiserver]:
-->
## 传统的审计

__注意：__ 传统审计已被弃用，并且自 Kubernetes 1.8 以后将默认禁用。
要回退到传统审核，请使用 [kube-apiserver][kube-apiserver] 中 feature gate 的 `AdvancedAuditing` 功能来禁用高级审核功能：

```
--feature-gates=AdvancedAuditing=false
```

<!--
In legacy format, each audit log entry contains two lines:

1. The request line containing a unique ID to match the response and request metadata, such as the source IP, requesting user, impersonation information, resource being requested, etc.
2. The response line containing a unique ID matching the request line and the response code.
-->
在传统格式中，每个审计文件条目包含两行：

1. 请求行包含唯一 ID 以匹配响应和请求元数据，例如源 IP、请求用户、模拟信息和请求的资源等。
2. 响应行包含与请求行和响应代码相匹配的唯一 ID。

<!--
Example output for `admin` user listing pods in the `default` namespace:
-->
以下是 `admin` 用户列出 `default` 命令空间的所有 pod 的示例：

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
否则，Kubernetes 会在您在 `audit-log-path` 中指定的位置创建一个审计日志文件。如果审计日志文件超过了您在 `audit-log-maxsize` 中指定的大小，则 Kubernetes 将通过在文件名（在文件扩展名之前）附加当前时间戳并重新创建一个新的审计日志文件来重命名当前日志文件。
Kubernetes 可能会在创建新的日志文件时删除旧的日志文件; 您可以通过指定 `audit-log-maxbackup` 和 `audit-log-maxage` 选项来配置保留多少文件以及它们的保留时间。

[kube-apiserver]: /docs/admin/kube-apiserver
[auditing-proposal]: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/auditing.md
[auditing-level]: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/auditing.md#levels
[auditing-api]: https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/staging/src/k8s.io/apiserver/pkg/apis/audit/v1beta1/types.go
[gce-audit-profile]: https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/cluster/gce/gci/configure-helper.sh#L735
[kubeconfig]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[fluentd]: http://www.fluentd.org/
[fluentd_install_doc]: http://docs.fluentd.org/v0.12/articles/quickstart#step1-installing-fluentd
[logstash]: https://www.elastic.co/products/logstash
[logstash_install_doc]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
