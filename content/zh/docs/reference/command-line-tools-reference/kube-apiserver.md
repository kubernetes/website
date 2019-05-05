---
title: kube-apiserver
notitle: true
---
## kube-apiserver


<!--
### Synopsis
-->

### 概要

<!--
The Kubernetes API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.
-->

Kubernetes API 服务器验证并配置 api 对象的数据，包括 pods、services、replication controllers 和其他对象。API 服务器为 REST 操作提供服务，并为集群的共享状态提供前端。所有其他组件通过该状态进行交互。

```
kube-apiserver [flags]
```

<!--
### Options
-->

### 选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--admission-control-config-file string</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">File with admission control configuration.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定准入控制配置文件。</td>
    </tr>

    <tr>
      <td colspan="2">--advertise-address ip</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address on which to advertise the apiserver to members of the cluster. This address must be reachable by the rest of the cluster. If blank, the --bind-address will be used. If --bind-address is unspecified, the host's default interface will be used.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定服务器为集群中成员发布的 IP 地址。该地址必须能被其他机器访问。如果该参数留空，服务器会使用 --bind-address 所指定的地址。如果 --bind-address 也没有设定，则会使用该主机的默认网络接口。</td>
    </tr>

    <tr>
      <!--
	  <td colspan="2">--allow-privileged</td>
	  -->
	  <td colspan="2">--allow-privileged&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: false</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, allow privileged containers. [default=false]</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定是否允许使用特权容器（默认值：false）。</td>
    </tr>

	<tr>
      <td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">Enables anonymous requests to the secure port of the API server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of system:anonymous, and a group name of system:unauthenticated.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定是否允许 API 服务器的安全端口接受匿名请求（默认值：true）。匿名请求即没有被其他认证方法拒绝的请求，其用户名均为 system:anonymous，组名均为 system:unauthenticated。</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-count int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">The number of apiservers running in the cluster, must be a positive number. (In use when --endpoint-reconciler-type=master-count is enabled.)</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定集群中运行的 API 服务器数量（默认值：1），值必须是正整数。该参数在 --endpoint-reconciler-type=master-count 时使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10000</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">The size of the buffer to store events before batching and writing. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定存储批处理和写入事件的缓冲区字节数（默认值：10000）。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum size of a batch. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定一个批处理的最大长度（默认值：1）。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-batch-max-wait duration</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">The amount of time to wait before force writing the batch that hadn't reached the max size. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定尚未达到最大值的批处理的强制写入等待时间。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-batch-throttle-burst int</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定在未使用 ThrottleQPS 时同时发送请求的最大数量。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-batch-throttle-enable</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">Whether batching throttling is enabled. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定是否启用 batching throttling。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-batch-throttle-qps float32</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum average number of batches per second. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定每秒内可执行的批处理的最大平均数。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "json"</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">Format of saved audits. "legacy" indicates 1-line text format for each event. "json" indicates structured json format. Known formats are legacy,json.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定存储审计日志的格式。legacy 表示每个事件记录 1 行文本；json 表示以结构化 json 格式记录。目前仅支持 legacy 和 json（默认值：json）。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-maxage int</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum number of days to retain old audit log files based on the timestamp encoded in their filename.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定历史审计日志的最大保存天数，以日志文件名中的时间戳为准。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-maxbackup int</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum number of old audit log files to retain.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定历史审计日志的最大保存数量。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-maxsize int</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum size in megabytes of the audit log file before it gets rotated.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定审计日志流转前的最大大小（单位：MB）。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "blocking"</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定发送审计事件的策略。blocking 表示发送事件时阻塞服务器响应；batch 表示在后端异步缓冲和写入事件。目前仅支持 batch 和 blocking（默认值：blocking）。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-path string</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, all requests coming to the apiserver will be logged to this file.  '-' means standard out.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果指定该参数，则所有 API 服务器接受的请求都会记录到此文件。"-" 表示记录到标准输出。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-truncate-enabled</td>
    </tr>
    <tr>
    <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">Whether event and batch truncating is enabled.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定是否允许截断事件和批处理。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10485760</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum size of the batch sent to the underlying backend. Actual serialized size can be several hundreds of bytes greater. If a batch exceeds this limit, it is split into several batches of smaller size.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定发送到底层后端的批处理的最大字节数（默认值：10485760）。实际序列化时的大小会比设定值大几百字节。如果一个批处理超出该大小，它会被分为几个小的批处理。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 102400</td>
    </tr>
    <tr>
	  <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum size of the audit event sent to the underlying backend. If the size of an event is greater than this number, first request and response are removed, and if this doesn't reduce the size enough, event is discarded.</td>
	  -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定发送到底层后端的审计事件的最大字节数（默认值：102400）。如果一个事件超出该大小，则第一个请求和回复会被删除，如果还没有减少到合适的大小，该事件将被丢弃。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-log-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "audit.k8s.io/v1beta1"</td>
    </tr>
    <tr>
	  <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API group and version used for serializing audit events written to log.</td>
	  -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定序列化审计日志的 API 组名和版本号（默认值：audit.k8s.io/v1beta1）。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-policy-file string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file that defines the audit policy configuration.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定审计策略配置文件的路径。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10000</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The size of the buffer to store events before batching and writing. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定存储批处理和写入事件的缓冲区字节数（默认值：10000）。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 400</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum size of a batch. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定一个批处理的最大长度（默认值：400）。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-batch-max-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The amount of time to wait before force writing the batch that hadn't reached the max size. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定尚未达到最大值的批处理的强制写入等待时间（默认值：30s）。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-batch-throttle-burst int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定在未使用 ThrottleQPS 时同时发送请求的最大数量（默认值：15）。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-batch-throttle-enable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Whether batching throttling is enabled. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定是否启用 batching throttling（默认值：true）。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-batch-throttle-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum average number of batches per second. Only used in batch mode.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定每秒内可执行的批处理的最大平均数（默认值：10）。只在批处理模式下使用。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-config-file string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeconfig formatted file that defines the audit webhook configuration.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定 kubeconfig 格式的配置文件的路径。该文件设定了审计 webhook 配置。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-initial-backoff duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The amount of time to wait before retrying the first failed request.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定重试第一个失败请求之前等待的时间（默认值：10s）。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "batch"</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定发送审计事件的策略。blocking 表示发送事件时阻塞服务器响应；batch 表示在后端异步缓冲和写入事件。目前仅支持 batch 和 blocking（默认值：batch）。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-truncate-enabled</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Whether event and batch truncating is enabled.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定是否允许截断事件和批处理。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10485760</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum size of the batch sent to the underlying backend. Actual serialized size can be several hundreds of bytes greater. If a batch exceeds this limit, it is split into several batches of smaller size.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定发送到底层后端的批处理的最大字节数（默认值：10485760）。实际序列化时的大小会比设定值大几百字节。如果一个批处理超出该大小，它会被分为几个小的批处理。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 102400</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum size of the audit event sent to the underlying backend. If the size of an event is greater than this number, first request and response are removed, and if this doesn't reduce the size enough, event is discarded.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定发送到底层后端的审计事件的最大字节数（默认值：102400）。如果一个事件超出该大小，则第一个请求和回复会被删除，如果还没有减少到合适的大小，该事件将被丢弃。</td>
    </tr>

    <tr>
      <td colspan="2">--audit-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "audit.k8s.io/v1beta1"</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API group and version used for serializing audit events written to webhook.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定序列化审计日志的 API 组名和版本号（默认值：audit.k8s.io/v1beta1）。</td>
    </tr>

    <tr>
      <td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2m0s</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache responses from the webhook token authenticator.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定从 webhook 标识认证方缓存响应的持续时间（默认值：2m0s）。</td>
    </tr>

    <tr>
      <td colspan="2">--authentication-token-webhook-config-file string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">File with webhook configuration for token authentication in kubeconfig format. The API server will query the remote service to determine authentication for bearer tokens.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定 kubeconfig 格式的 webhook 配置文件，用来进行标识认证。API 服务器将会查询远程服务器，来验证承载 token 的身份。</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-mode stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [AlwaysAllow]</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Ordered list of plug-ins to do authorization on secure port. Comma-delimited list of: AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定在安全端口上执行授权的有序插件列表，以逗号分隔。（可选：AlwaysAllow、AlwaysDeny、ABAC、Webhook、RBAC、Node，默认值：[AlwaysAllow]）。</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-policy-file string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">File with authorization policy in csv format, used with --authorization-mode=ABAC, on the secure port.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定 csv 格式的授权策略文件。该参数与 --authorization-mode=ABAC 一起使用，作用在安全端口上。</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'authorized' responses from the webhook authorizer.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定从 webhook 授权方缓存的 '已授权' 响应的持续时间（默认值：5m0s）。</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'unauthorized' responses from the webhook authorizer.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定从 webhook 授权方缓存的 '未授权' 响应的持续时间（默认值：30s）。</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-webhook-config-file string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">File with webhook configuration in kubeconfig format, used with --authorization-mode=Webhook. The API server will query the remote service to determine access on the API server's secure port.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定 kubeconfig 格式的 webhook 配置文件。该参数与 --authorization-mode=webhook 一起使用。API 服务器将会查询远程服务器，来确认访问 API 服务器安全端口。</td>
    </tr>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定 Azure 容器注册表配置文件的路径。</td>
    </tr>

    <tr>
      <td colspan="2">--basic-auth-file string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, the file that will be used to admit requests to the secure port of the API server via http basic authentication.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果设定该参数，则该文件将使用 http 基本身份验证接受对 API 服务器安全端口的请求。</td>
    </tr>

    <tr>
      <td colspan="2">--bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank, all interfaces will be used (0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces).</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定一个 IP 地址来监听 --secure-port 的端口（默认值：0.0.0.0）。该地址对应的网络接口必须可被集群中其他成员、命令行和 web 客户端访问。如果该参数留空，则使用所有网络接口（IPv4 接口使用 0.0.0.0，IPv6 接口使用 ::）。</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/kubernetes"</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定 TLS 认证文件所在的目录（默认值：/var/run/kubernetes）。如果设定了 --tls-cert-file 和 --tls-private-key-file，则忽略该参数。</td>
    </tr>

    <tr>
      <td colspan="2">--client-ca-file string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果设定了该参数，则任何带客户端证书的请求，即包含被该文件中任何一个授权方签过名的证书的请求，都使用客户端证书中的 CommonName 作为该请求的身份。</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-config string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the cloud provider configuration file. Empty string for no configuration file.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定云服务提供商的配置文件。若留空则表示没有配置文件。</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-provider string</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The provider for cloud services. Empty string for no provider.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定云服务提供商。若留空则表示没有云服务提供商。</td>
    </tr>

    <tr>
      <td colspan="2">--contention-profiling</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable lock contention profiling, if profiling is enabled</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">若启用 profiling 分析，则该参数将指定是否用锁争用 profiling 分析。</td>
    </tr>

    <tr>
      <td colspan="2">--cors-allowed-origins stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">List of allowed origins for CORS, comma separated.  An allowed origin can be a regular expression to support subdomain matching. If this list is empty CORS will not be enabled.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定允许跨域资源共享（CORS）的域列表，以逗号分隔。可用正则表达式支持匹配子域。若该列表为空则禁用跨域资源共享。</td>
    </tr>

    <tr>
      <td colspan="2">--default-watch-cache-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Default watch cache size. If zero, watch cache will be disabled for resources that do not have a default watch size set.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定默认 watch 缓存大小（默认值：100）。若设为 0，则没有设定默认 watch 大小的资源将禁用 watch 缓存。</td>
    </tr>

    <tr>
      <td colspan="2">--delete-collection-workers int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Number of workers spawned for DeleteCollection call. These are used to speed up namespace cleanup.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定调用 DeleteCollection 时产生的 worker 数量（默认值：1），用于加速命名空间的清理。</td>
    </tr>

    <tr>
      <td colspan="2">--deserialization-cache-size int</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Number of deserialized json objects to cache in memory.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定用于缓存反序列化 json 对象的内存大小。</td>
    </tr>

    <tr>
      <td colspan="2">--disable-admission-plugins stringSlice</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">admission plugins that should be disabled although they are in the default enabled plugins list (NamespaceLifecycle, LimitRanger, ServiceAccount, Priority, DefaultTolerationSeconds, DefaultStorageClass, PersistentVolumeClaimResize, MutatingAdmissionWebhook, ValidatingAdmissionWebhook, ResourceQuota). Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, DefaultStorageClass, DefaultTolerationSeconds, DenyEscalatingExec, DenyExecOnPrivileged, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, Initializers, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PersistentVolumeLabel, PodNodeSelector, PodPreset, PodSecurityPolicy, PodTolerationRestriction, Priority, ResourceQuota, SecurityContextDeny, ServiceAccount, StorageObjectInUseProtection, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定禁用的权限相关的插件的列表，默认启用的插件列表中的插件也可禁用，以逗号分隔。该列表中的顺序不影响结果。所有列表项包括 AlwaysAdmit、AlwaysDeny、AlwaysPullImages、DefaultStorageClass、DefaultTolerationSeconds、DenyEscalatingExec、DenyExecOnPrivileged、EventRateLimit、ExtendedResourceToleration、ImagePolicyWebhook、Initializers、LimitPodHardAntiAffinityTopology、LimitRanger、MutatingAdmissionWebhook、NamespaceAutoProvision、NamespaceExists、NamespaceLifecycle、NodeRestriction、OwnerReferencesPermissionEnforcement、PersistentVolumeClaimResize、PersistentVolumeLabel、PodNodeSelector、PodPreset、PodSecurityPolicy、PodTolerationRestriction、Priority、ResourceQuota、SecurityContextDeny、ServiceAccount、StorageObjectInUseProtection、ValidatingAdmissionWebhook。其中默认启用的插件包括 NamespaceLifecycle、LimitRanger、ServiceAccount、Priority、DefaultTolerationSeconds、DefaultStorageClass、PersistentVolumeClaimResize、MutatingAdmissionWebhook、ValidatingAdmissionWebhook、ResourceQuota。</td>
    </tr>

    <tr>
      <td colspan="2">--enable-admission-plugins stringSlice</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">admission plugins that should be enabled in addition to default enabled ones (NamespaceLifecycle, LimitRanger, ServiceAccount, Priority, DefaultTolerationSeconds, DefaultStorageClass, PersistentVolumeClaimResize, MutatingAdmissionWebhook, ValidatingAdmissionWebhook, ResourceQuota). Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, DefaultStorageClass, DefaultTolerationSeconds, DenyEscalatingExec, DenyExecOnPrivileged, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, Initializers, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PersistentVolumeLabel, PodNodeSelector, PodPreset, PodSecurityPolicy, PodTolerationRestriction, Priority, ResourceQuota, SecurityContextDeny, ServiceAccount, StorageObjectInUseProtection, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定启用的权限相关的插件的列表，以逗号分隔。该列表中的插件顺序不影响结果。该列表中的插件会与默认启用的插件一起启用。</td>
    </tr>

    <tr>
      <td colspan="2">--enable-aggregator-routing</td>
    </tr>
    <tr>
	<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Turns on aggregator routing requests to endpoints IP rather than cluster IP.</td>
	-->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定是否打开聚合路由请求到 endpoint IP，而非集群 IP。</td>
    </tr>

    <tr>
      <td colspan="2">--enable-bootstrap-token-auth</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable to allow secrets of type 'bootstrap.kubernetes.io/token' in the 'kube-system' namespace to be used for TLS bootstrapping authentication.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定是否允许 kube-system 命名空间中的 bootstrap.kubernetes.io/token 类型用作 TLS bootstrapping 验证。</td>
    </tr>

    <tr>
      <td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定是否启用通用垃圾收集器（默认值：true）。该参数必须与 kube-controller-manager 的对应参数保持一致。</td>
    </tr>

    <tr>
      <td colspan="2">--enable-logs-handler&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, install a /logs handler for the apiserver logs.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果该参数设为 true，则 API 服务器会使用 /logs 地址来处理日志（默认值：true）。</td>
    </tr>

    <tr>
      <td colspan="2">--enable-swagger-ui</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Enables swagger ui on the apiserver at /swagger-ui</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定是否在 /swagger-ui 地址中启用 swagger ui。</td>
    </tr>

    <tr>
      <td colspan="2">--endpoint-reconciler-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "lease"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Use an endpoint reconciler (master-count, lease, none)</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设置启用的终端协调器（可选：master-count、lease、none，默认：lease）。</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-cafile string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">SSL Certificate Authority file used to secure etcd communication.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定用于保证 etcd 通信安全的 SSL 证书颁发机构的证书文件（CA 证书）。</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-certfile string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">SSL certification file used to secure etcd communication.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定用于保证 etcd 通信安全的 SSL 证书文件（由 CA 颁发的证书）。</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-compaction-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The interval of compaction requests. If 0, the compaction request from apiserver is disabled.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定压缩请求的间隔（默认值：5m0s）。若设为 0，则 API 服务器将禁用压缩请求。</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-count-metric-poll-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Frequency of polling etcd for number of resources per type. 0 disables the metric collection.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设置向 etcd 轮询获取每种资源剩余情况的时间。设定为 0 表示禁用收集资源信息。</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-keyfile string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">SSL key file used to secure etcd communication.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设置用于保证 etcd 通信安全的 SSL 密钥文件（与 --etcd-certfile 对应的密钥）。</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/registry"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The prefix to prepend to all resource paths in etcd.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设置 etcd 中所有资源路径的前缀（默认值：/registry）。</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-servers stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">List of etcd servers to connect with (scheme://ip:port), comma separated.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定要连接的 etcd 服务器列表（格式：scheme://ip:port），以逗号分隔。</td>
    </tr>

    <tr>
      <td colspan="2">--etcd-servers-overrides stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Per-resource etcd servers overrides, comma separated. The individual override format: group/resource#servers, where servers are URLs, semicolon separated.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定 etcd 服务器需要覆盖的资源，以逗号分隔。每个独立的格式为 group/resource#servers，其中 servers 为多个URL，以分号分隔。</td>
    </tr>

    <tr>
      <td colspan="2">--event-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1h0m0s</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Amount of time to retain events.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定事件的保存时间（默认值：1h0m0s）。</td>
    </tr>

    <tr>
      <td colspan="2">--experimental-encryption-provider-config string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The file containing configuration for encryption providers to be used for storing secrets in etcd</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定包含加密程序的配置文件路径，用于设定在 etcd 中如何加密存储数据。</td>
    </tr>

    <tr>
      <td colspan="2">--external-hostname string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The hostname to use when generating externalized URLs for this master (e.g. Swagger API Docs).</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定该 master 节点创建集群时使用外部 URL 需要用的主机名（如 Swagger API 文档的 URL）。</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates mapStringBool</td>
    </tr>
    <tr>
      <!--
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (ALPHA - default=false)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>AttachVolumeLimit=true|false (BETA - default=false)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BlockVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIBlockVolume=true|false (ALPHA - default=false)<br/>CSIDriverRegistry=true|false (ALPHA - default=false)<br/>CSINodeInfo=true|false (ALPHA - default=false)<br/>CSIPersistentVolume=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomPodDNS=true|false (BETA - default=true)<br/>CustomResourceSubresources=true|false (BETA - default=true)<br/>CustomResourceValidation=true|false (BETA - default=true)<br/>DebugContainers=true|false (ALPHA - default=false)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DryRun=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EnableEquivalenceClassCache=true|false (ALPHA - default=false)<br/>ExpandInUsePersistentVolumes=true|false (ALPHA - default=false)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GCERegionalPersistentDisk=true|false (BETA - default=true)<br/>HugePages=true|false (BETA - default=true)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>Initializers=true|false (ALPHA - default=false)<br/>KubeletPluginsWatcher=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>MountContainers=true|false (ALPHA - default=false)<br/>NodeLease=true|false (ALPHA - default=false)<br/>PersistentLocalVolumes=true|false (BETA - default=true)<br/>PodPriority=true|false (BETA - default=true)<br/>PodReadinessGates=true|false (BETA - default=true)<br/>PodShareProcessNamespace=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>ResourceQuotaScopeSelectors=true|false (BETA - default=true)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RunAsGroup=true|false (ALPHA - default=false)<br/>RuntimeClass=true|false (ALPHA - default=false)<br/>SCTPSupport=true|false (ALPHA - default=false)<br/>ScheduleDaemonSetPods=true|false (BETA - default=true)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (ALPHA - default=false)<br/>Sysctls=true|false (BETA - default=true)<br/>TTLAfterFinished=true|false (ALPHA - default=false)<br/>TaintBasedEvictions=true|false (ALPHA - default=false)<br/>TaintNodesByCondition=true|false (BETA - default=true)<br/>TokenRequest=true|false (BETA - default=true)<br/>TokenRequestProjection=true|false (BETA - default=true)<br/>VolumeScheduling=true|false (BETA - default=true)<br/>VolumeSnapshotDataSource=true|false (ALPHA - default=false)<br/>VolumeSubpathEnvExpansion=true|false (ALPHA - default=false)</td>
	  -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">用于描述 alpha/experimental 特性的功能的一组键值对。包括:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (ALPHA - default=false)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>AttachVolumeLimit=true|false (BETA - default=false)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BlockVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIBlockVolume=true|false (ALPHA - default=false)<br/>CSIDriverRegistry=true|false (ALPHA - default=false)<br/>CSINodeInfo=true|false (ALPHA - default=false)<br/>CSIPersistentVolume=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomPodDNS=true|false (BETA - default=true)<br/>CustomResourceSubresources=true|false (BETA - default=true)<br/>CustomResourceValidation=true|false (BETA - default=true)<br/>DebugContainers=true|false (ALPHA - default=false)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DryRun=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EnableEquivalenceClassCache=true|false (ALPHA - default=false)<br/>ExpandInUsePersistentVolumes=true|false (ALPHA - default=false)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GCERegionalPersistentDisk=true|false (BETA - default=true)<br/>HugePages=true|false (BETA - default=true)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>Initializers=true|false (ALPHA - default=false)<br/>KubeletPluginsWatcher=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>MountContainers=true|false (ALPHA - default=false)<br/>NodeLease=true|false (ALPHA - default=false)<br/>PersistentLocalVolumes=true|false (BETA - default=true)<br/>PodPriority=true|false (BETA - default=true)<br/>PodReadinessGates=true|false (BETA - default=true)<br/>PodShareProcessNamespace=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>ResourceQuotaScopeSelectors=true|false (BETA - default=true)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RunAsGroup=true|false (ALPHA - default=false)<br/>RuntimeClass=true|false (ALPHA - default=false)<br/>SCTPSupport=true|false (ALPHA - default=false)<br/>ScheduleDaemonSetPods=true|false (BETA - default=true)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (ALPHA - default=false)<br/>Sysctls=true|false (BETA - default=true)<br/>TTLAfterFinished=true|false (ALPHA - default=false)<br/>TaintBasedEvictions=true|false (ALPHA - default=false)<br/>TaintNodesByCondition=true|false (BETA - default=true)<br/>TokenRequest=true|false (BETA - default=true)<br/>TokenRequestProjection=true|false (BETA - default=true)<br/>VolumeScheduling=true|false (BETA - default=true)<br/>VolumeSnapshotDataSource=true|false (ALPHA - default=false)<br/>VolumeSubpathEnvExpansion=true|false (ALPHA - default=false)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kube-apiserver</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">打印 kube-apiserver 帮助。</td>
    </tr>

    <tr>
      <td colspan="2">--http2-max-streams-per-connection int</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定 HTTP/2 连接中流的最大数量限制。设定为 0 则使用 golang 的默认配置。</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-certificate-authority string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a cert file for the certificate authority.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定用于 kubelet CA 认证的证书文件路径。</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-client-certificate string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a client cert file for TLS.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定用于 TLS 的客户端证书。</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-client-key string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a client key file for TLS.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定用于 TLS 的客户端密钥。</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-https&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Use https for kubelet connections.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定是否在 kubelet 连接中使用 HTTPS。</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-preferred-address-types stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP]</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">List of the preferred NodeAddressTypes to use for kubelet connections.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定用于 kubelet 连接的首选 NodeAddressTypes 列表（默认值：[Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP]）。</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-read-only-port uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10255</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: kubelet port.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">（已弃用）设定 kubelet 端口（默认值：10255）。</td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Timeout for kubelet operations.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定 kubelet 操作的超时时间（默认值：5s）。</td>
    </tr>

    <tr>
      <td colspan="2">--kubernetes-service-node-port int</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-zero, the Kubernetes master service (which apiserver creates/maintains) will be of type NodePort, using this as the value of the port. If zero, the Kubernetes master service will be of type ClusterIP.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果该参数设为非 0 值，则 Kubernetes master 服务（由 API 服务器创建和维护）将是 NodePort 类型，以该值作为端口。该值为 0 时，则 Kubernetes master 服务将是 ClusterIP 类型。</td>
    </tr>

    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定日志刷新的最大间隔（默认值：5s）。</td>
    </tr>

    <tr>
      <td colspan="2">--master-service-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: the namespace from which the kubernetes master services should be injected into pods.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">（已弃用）设定 Kubernetes master 服务插入 pods 的命名空间（默认值：default）。</td>
    </tr>

    <tr>
      <td colspan="2">--max-connection-bytes-per-sec int</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-zero, throttle each user connection to this number of bytes/sec. Currently only applies to long-running requests.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果该参数设为非 0 值，则将用户连接每秒的比特数阈值设置为该值。目前该参数只应用在耗时请求中。</td>
    </tr>

    <tr>
      <td colspan="2">--max-mutating-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 200</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum number of mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定给定时间内未响应的“修改类”请求的最大数量（默认值：200）。当请求数量超过该值时，服务器将拒绝新的请求。设定为 0 则代表无限制。</td>
    </tr>

    <tr>
      <td colspan="2">--max-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 400</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum number of non-mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定给定时间内未响应的“非修改类”请求的最大数量（默认值：400）。当请求数量超过该值时，服务器将拒绝新的请求。设定为 0 则代表无限制。</td>
    </tr>

    <tr>
      <td colspan="2">--min-request-timeout int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">An optional field indicating the minimum number of seconds a handler must keep a request open before timing it out. Currently only honored by the watch request handler, which picks a randomized value above this number as the connection timeout, to spread out load.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定控制器在请求超时前，保持它的连接状态的最小秒数（默认值：1800）。目前该参数只有 watch 请求控制器生效，它选择一个随机值作为连接超时时间，用来分配负载。</td>
    </tr>

    <tr>
      <td colspan="2">--oidc-ca-file string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, the OpenID server's certificate will be verified by one of the authorities in the oidc-ca-file, otherwise the host's root CA set will be used.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果指定了该参数，则 OpenID 服务器的证书会使用该文件中的一个认证方进行验证，否则使用该主机的根证书进行验证。</td>
    </tr>

    <tr>
      <td colspan="2">--oidc-client-id string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The client ID for the OpenID Connect client, must be set if oidc-issuer-url is set.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设置 OpenID Connect 的客户端 ID。如果设定了 --oidc-issuer-url 参数，则该参数必须指定。</td>
    </tr>

    <tr>
      <td colspan="2">--oidc-groups-claim string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">If provided, the name of a custom OpenID Connect claim for specifying user groups. The claim value is expected to be a string or array of strings. This flag is experimental, please see the authentication documentation for further details.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果指定了该参数，则一个自定义的 OpenID Connect 将以它的名字声明指定的用户组。该声明的值应该为一个字符串或字符串数组。该参数为实验性参数，请参考权限文档获取更多信息。</td>
    </tr>

    <tr>
      <td colspan="2">--oidc-groups-prefix string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">If provided, all groups will be prefixed with this value to prevent conflicts with other authentication strategies.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果指定了该参数，则所有组将以该值作为前缀，以防止和其他的认证策略冲突。</td>
    </tr>

    <tr>
      <td colspan="2">--oidc-issuer-url string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The URL of the OpenID issuer, only HTTPS scheme will be accepted. If set, it will be used to verify the OIDC JSON Web Token (JWT).</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定 OpenID 发布者的 URL（仅接受 HTTPS）。如果设定了该参数，则它会被用来验证 OIDC JSON Web Token。</td>
    </tr>

    <tr>
      <td colspan="2">--oidc-required-claim mapStringString</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">A key=value pair that describes a required claim in the ID Token. If set, the claim is verified to be present in the ID Token with a matching value. Repeat this flag to specify multiple claims.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定一组描述 ID Token 中所需的声明的键值对。如果设定了该参数，则该声明将被用来验证 ID Token 中对应值是否存在。如果有多个声明则重复使用该参数。</td>
    </tr>

    <tr>
      <td colspan="2">--oidc-signing-algs stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [RS256]</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of allowed JOSE asymmetric signing algorithms. JWTs with a 'alg' header value not in this list will be rejected. Values are defined by RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定允许的 JOSE 非对称签名算法列表，用逗号分隔。alg header 的值不在此列表中的 JWT 将被拒绝。所有的值都通过 RFC 7518 定义（参见 https://tools.ietf.org/html/rfc7518#section-3.1）。</td>
    </tr>

    <tr>
      <td colspan="2">--oidc-username-claim string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "sub"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The OpenID claim to use as the user name. Note that claims other than the default ('sub') is not guaranteed to be unique and immutable. This flag is experimental, please see the authentication documentation for further details.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定作为用户名使用的 OpenID 声明。注意默认声明（'sub'）以外的声明不能保证唯一性和不变性。该参数为实验性参数，请参考权限文档获取更多信息。</td>
    </tr>

    <tr>
      <td colspan="2">--oidc-username-prefix string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">If provided, all usernames will be prefixed with this value. If not provided, username claims other than 'email' are prefixed by the issuer URL to avoid clashes. To skip any prefixing, provide the value '-'.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果指定了该参数，则所有的用户名将以该值作为前缀。如果不指定，则邮箱以外的用户名将使用发布者的 URL 作为前缀以防止冲突。如果不想指定任何前缀，则可将该参数设为 "-"。</td>
    </tr>

    <tr>
      <td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable profiling via web interface host:port/debug/pprof/</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定是否在 /debug/pprof 网络接口中启用 web 服务状态分析（默认值：true）。</td>
    </tr>

    <tr>
      <td colspan="2">--proxy-client-cert-file string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Client certificate used to prove the identity of the aggregator or kube-apiserver when it must call out during a request. This includes proxying requests to a user api-server and calling out to webhook admission plugins. It is expected that this cert includes a signature from the CA in the --requestheader-client-ca-file flag. That CA is published in the 'extension-apiserver-authentication' configmap in the kube-system namespace. Components receiving calls from kube-aggregator should use that CA to perform their half of the mutual TLS verification.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定用于在发送请求时证明 aggregator 或 kube-apiserver 身份的客户端证书，包括代理向用户 api 服务器发送的请求和发送到 webhook 权限插件的请求。该证书包含从 --requestheader-client-ca-file 中 CA 的签名。该 CA 被发布在 kube-system 命名空间中的 extension-apiserver-authentication 配置项中。接收 kube-aggregator 请求的组件必须向该 CA 提供双向 TLS 认证中它们的那部分证书。</td>
    </tr>

    <tr>
      <td colspan="2">--proxy-client-key-file string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Private key for the client certificate used to prove the identity of the aggregator or kube-apiserver when it must call out during a request. This includes proxying requests to a user api-server and calling out to webhook admission plugins.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定用于在发送请求时证明 aggregator 或 kube-apiserver 身份的客户端私钥，包括代理向用户 api 服务器发送的请求和发送到 webhook 权限插件的请求。</td>
    </tr>

    <tr>
      <td colspan="2">--request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
    </tr>
    <tr>
	  <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">An optional field indicating the duration a handler must keep a request open before timing it out. This is the default request timeout for requests but may be overridden by flags such as --min-request-timeout for specific types of requests.</td>
	  -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">该可选参数表示控制器在请求超时前，保持它的连接状态的最小秒数（默认值：1m0s）。该参数是请求的默认超时时间，但处理特定类型的请求时可使用 --min-request-timeout 等参数覆盖。</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-allowed-names stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定客户端证书的 common names 列表，用来提供 --requestheader-username-headers 中特定头部的用户名。如果忽略该参数，则 --requestheader-client-ca-file 中认证方验证过的所有客户端证书都可用。</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-client-ca-file string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定在信任 --requestheader-username-headers 中特定头部的用户名之前，用来验证请求中客户端证书的根证书集合。警告：通常不要依赖请求中已完成的授权。</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-extra-headers-prefix stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">List of request header prefixes to inspect. X-Remote-Extra- is suggested.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定用于检查的请求头部的前缀。建议使用 "X-Remote-Extra-"。</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-group-headers stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">List of request headers to inspect for groups. X-Remote-Group is suggested.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定用于检查的请求头部。建议使用 X-Remote-Group。</td>
    </tr>

    <tr>
      <td colspan="2">--requestheader-username-headers stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">List of request headers to inspect for usernames. X-Remote-User is common.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定请求头部的用户名列表，通常设为 X-Remote-User。</td>
    </tr>

    <tr>
      <td colspan="2">--runtime-config mapStringString</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe runtime configuration that may be passed to apiserver. &lt;group&gt;/&lt;version&gt; (or &lt;version&gt; for the core group) key can be used to turn on/off specific api versions. api/all is special key to control all api versions, be careful setting it false, unless you know what you do. api/legacy is deprecated, we will remove it in the future, so stop using it.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定一组用来描述运行时配置的键值对，它们会被传递到 API 服务器中。&lt;group&gt;/&lt;version&gt; 键可以用来打开或关闭特定的 API 版本（core 组则直接使用 &lt;version&gt;）。api/all 是用来控制所有 API 版本的特殊键，将它设置成 false 必须谨慎，除非你知道你在做什么。api/legacy 已被弃用，我们将来会删除它，所以不要使用该键。</td>
    </tr>

    <tr>
      <td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The port on which to serve HTTPS with authentication and authorization.It cannot be switched off with 0.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定用于提供 HTTPS 认证和授权服务的端口（默认值：6443）。该端口不能设成 0 来关闭。</td>
    </tr>

    <tr>
      <td colspan="2">--service-account-api-audiences stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Identifiers of the API. The service account token authenticator will validate that tokens used against the API are bound to at least one of these audiences.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定 API 识别码。服务账户标识授权方将验证这些针对 API 使用的标识是否被绑定到至少一个受众中。</td>
    </tr>

    <tr>
      <td colspan="2">--service-account-issuer string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Identifier of the service account token issuer. The issuer will assert this identifier in "iss" claim of issued tokens. This value is a string or URI.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定服务账户标识发布者的识别码。该发布者将断言该识别码在已发布标识的 "iss" 声明中。该参数是一个字符串或 URI。</td>
    </tr>

    <tr>
      <td colspan="2">--service-account-key-file stringArray</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">File containing PEM-encoded x509 RSA or ECDSA private or public keys, used to verify ServiceAccount tokens. The specified file can contain multiple keys, and the flag can be specified multiple times with different files. If unspecified, --tls-private-key-file is used. Must be specified when --service-account-signing-key is provided</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定包含 PEM 编码的 X509 RSA 或 ECDSA 私钥或公钥的文件，用来验证 ServiceAccount 标识。该文件可用包含多个密钥，该参数也可用指定多次，来包含不同的文件。如果不指定该参数，则使用 --tls-private-key-file。当 --service-account-signing-key-file 指定时该参数必须指定。</td>
    </tr>

    <tr>
      <td colspan="2">--service-account-lookup&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, validate ServiceAccount tokens exist in etcd as part of authentication.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果该参数设为 true，则验证 etcd 中的 ServiceAccount 标识，作为授权的一部分（默认值：true）。</td>
    </tr>

    <tr>
      <td colspan="2">--service-account-max-token-expiration duration</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum validity duration of a token created by the service account token issuer. If an otherwise valid TokenRequest with a validity duration larger than this value is requested, a token will be issued with a validity duration of this value.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定服务账户发布者创建的标识的最大有效期。如果请求中包含一个有效的 TokenRequest，它的有效期大于该值，则会发布一个有效期为该值的标识。</td>
    </tr>

    <tr>
      <td colspan="2">--service-account-signing-key-file string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file that contains the current private key of the service account token issuer. The issuer will sign issued ID tokens with this private key. (Requires the 'TokenRequest' feature gate.)</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定包含服务账户标识发布者当前的私钥的文件。该发布者将使用该私钥对 ID 标识进行签名（需要在 --feature-gates 参数中启用 TokenRequest）。</td>
    </tr>

    <tr>
      <td colspan="2">--service-cluster-ip-range ipNet&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10.0.0.0/24</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">A CIDR notation IP range from which to assign service cluster IPs. This must not overlap with any IP ranges assigned to nodes for pods.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定一个无类别域间路由记号 IP 网段，用来分配服务集群的 IP（默认值：10.0.0.0/24）。该网段不能与已分配到 pod 节点的网段重叠。</td>
    </tr>

    <tr>
      <td colspan="2">--service-node-port-range portRange&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30000-32767</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">A port range to reserve for services with NodePort visibility. Example: '30000-32767'. Inclusive at both ends of the range.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定一个端口的范围，用来保留 NodePort 可见的服务（默认值：30000-32767）。两端均包含在内。</td>
    </tr>

    <tr>
      <td colspan="2">--storage-backend string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The storage backend for persistence. Options: 'etcd3' (default), 'etcd2'.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定用于持久化的存储后端（默认值：etcd3，可选：etcd2）。</td>
    </tr>

    <tr>
      <td colspan="2">--storage-media-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The media type to use to store objects in storage. Some resources or storage backends may only support a specific media type and will ignore this setting.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设置用来在存储器中存储对象的介质类型（默认值：application/vnd.kubernetes.protobuf）。一些资源或存储后端可能只支持特定类型的存储介质，它们将忽略该参数设定。</td>
    </tr>

    <tr>
      <td colspan="2">--target-ram-mb int</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Memory limit for apiserver in MB (used to configure sizes of caches, etc.)</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定 API 服务器的内存大小限制（单位：MB），用于配置缓存大小等。</td>
    </tr>

    <tr>
      <td colspan="2">--tls-cert-file string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定 HTTPS 中包含默认 X509 证书的文件。该文件包含服务器证书。如果还有 CA 证书，则 CA 证书紧接服务器证书。如果启用 HTTPS 服务，但未指定 --tls-cert-file 和 --tls-private-key-file，则服务器会为公共地址产生一个自签名证书和密钥，然后将它们存在 --cert-dir 参数的值对应的目录下。</td>
    </tr>

    <tr>
      <td colspan="2">--tls-cipher-suites stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be use.  Possible values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设置服务器的加密套件列表，用逗号分隔。如果忽略该参数，服务器将使用 Go 默认的加密套件。可选的值为： TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA、TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384、TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_ECDSA_WITH_RC4_128_SHA、TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_RSA_WITH_RC4_128_SHA、TLS_RSA_WITH_3DES_EDE_CBC_SHA、TLS_RSA_WITH_AES_128_CBC_SHA、TLS_RSA_WITH_AES_128_CBC_SHA256、TLS_RSA_WITH_AES_128_GCM_SHA256、TLS_RSA_WITH_AES_256_CBC_SHA、TLS_RSA_WITH_AES_256_GCM_SHA384、TLS_RSA_WITH_RC4_128_SHA。</td>
    </tr>

    <tr>
      <td colspan="2">--tls-min-version string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Minimum TLS version supported. Possible values: VersionTLS10, VersionTLS11, VersionTLS12</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设置最小支持的 TLS 版本。可选的值为：VersionTLS10、VersionTLS11、VersionTLS12。</td>
    </tr>

    <tr>
      <td colspan="2">--tls-private-key-file string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">File containing the default x509 private key matching --tls-cert-file.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定包含与 --tls-cert-file 对应的 X509 私钥的文件。</td>
    </tr>

    <tr>
      <td colspan="2">--tls-sni-cert-key namedCertKey&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: []</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com".</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定一对 X509 证书和私钥的文件路径。该路径可能会带有一个域模式列表的后缀，这些域模式是一些完全可信的域名；也可能带有通配符段的前缀。如果不指定任何域模式，则证书中的名字将被提取作为域模式。非通配符匹配将覆盖通配符匹配，显式指定的域模式将覆盖提取的域模式。如果有多个密钥证书对，则可多次指定该参数（例：example.crt,example.key 或 foo.crt,foo.key:*.foo.com,foo.com）。</td>
    </tr>

    <tr>
      <td colspan="2">--token-auth-file string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, the file that will be used to secure the secure port of the API server via token authentication.</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">如果指定了该参数，则该文件将被用来在 token 认证时保证 API 服务器安全端口的安全。</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">打印版本信息然后退出。</td>
    </tr>

    <tr>
      <td colspan="2">--watch-cache&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable watch caching in the apiserver</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定是否允许 API 服务器进行 watch 缓存。</td>
    </tr>

    <tr>
      <td colspan="2">--watch-cache-sizes stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">List of watch cache sizes for every resource (pods, nodes, etc.), comma separated. The individual override format: resource[.group]#size, where resource is lowercase plural (no version), group is optional, and size is a number. It takes effect when watch-cache is enabled. Some resources (replicationcontrollers, endpoints, nodes, pods, services, apiservices.apiregistration.k8s.io) have system defaults set by heuristics, others default to default-watch-cache-size</td> -->
	  <td></td><td style="line-height: 130%; word-wrap: break-word;">设定每种资源（pods、nodes 等）的 watch 缓存大小，用逗号分隔。每个独立的格式为：resource[.group]#size，其中 resource 为复数形式小写，不包含版本号；group 为可选值；size 为一个数，当 --watch-cache 启用时生效。有些资源（replicationcontrollers、endpoints、nodes、pods、services、apiservices.apiregistration.k8s.io）会使用启发式的系统默认设置，其他资源则默认使用 --default-watch-cache-size 的值。</td>
    </tr>

  </tbody>
</table>