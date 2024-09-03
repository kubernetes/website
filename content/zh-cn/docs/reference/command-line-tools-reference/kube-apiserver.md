---
title: kube-apiserver
content_type: tool-reference
weight: 30
---

## {{% heading "synopsis" %}}

<!--
The Kubernetes API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.
-->
Kubernetes API 服务器验证并配置 API 对象的数据，
这些对象包括 pods、services、replicationcontrollers 等。
API 服务器为 REST 操作提供服务，并为集群的共享状态提供前端，
所有其他组件都通过该前端进行交互。

```
kube-apiserver [flags]
```

## {{% heading "options" %}}   {#options}

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File with admission control configuration.
-->
<p>包含准入控制配置的文件。</p>
</td>
</tr>

<tr>
<td colspan="2">--advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to advertise the apiserver to members of the cluster. 
This address must be reachable by the rest of the cluster. If blank, 
the --bind-address will be used. If --bind-address is unspecified, 
the host's default interface will be used.
-->
<p>
向集群成员通知 apiserver 消息的 IP 地址。
这个地址必须能够被集群中其他成员访问。
如果 IP 地址为空，将会使用 --bind-address，
如果未指定 --bind-address，将会使用主机的默认接口地址。
</p>
</td>
</tr>

<tr>
<td colspan="2">--aggregator-reject-forwarding-redirect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
Aggregator reject forwarding redirect response back to client.
-->
<p>聚合器拒绝将重定向响应转发回客户端。</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The map from metric-label to value allow-list of this label. The key's format is &lt;MetricName&gt;,&lt;LabelName&gt;. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.
-->
允许使用的指标标签到指标值的映射列表。键的格式为 &lt;MetricName&gt;,&lt;LabelName&gt;.
值的格式为 &lt;allowed_value&gt;,&lt;allowed_value&gt;...。
例如：<code>metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'</code>。
</p></td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels-manifest string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The path to the manifest file that contains the allow-list mapping. The format of the file is the same as the flag --allow-metric-labels. Note that the flag --allow-metric-labels will override the manifest file.
-->
包含允许列表映射的清单文件的路径。此文件的格式与 <code>--allow-metric-labels</code> 相同。
请注意，<code>--allow-metric-labels</code> 标志将覆盖清单文件。
</p></td>
</tr>

<tr>
<td colspan="2">--allow-privileged</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, allow privileged containers. [default=false]
-->
如果为 true，将允许特权容器。[默认值=false]
</td>
</tr>

<tr>
<td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables anonymous requests to the secure port of the API server. 
Requests that are not rejected by another authentication method 
are treated as anonymous requests. Anonymous requests have a 
username of system:anonymous, and a group name of system:unauthenticated.
-->
启用针对 API 服务器的安全端口的匿名请求。
未被其他身份认证方法拒绝的请求被当做匿名请求。
匿名请求的用户名为 <code>system:anonymous</code>，
用户组名为 </code>system:unauthenticated</code>。
</td>
</tr>

<tr>
<td colspan="2">--api-audiences strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Identifiers of the API. The service account token authenticator will 
validate that tokens used against the API are bound to at least one 
of these audiences. If the --service-account-issuer flag is configured 
and this flag is not, this field defaults to a single element list 
containing the issuer URL.
-->
API 的标识符。
服务帐户令牌验证者将验证针对 API 使用的令牌是否已绑定到这些受众中的至少一个。
如果配置了 <code>--service-account-issuer</code> 标志，但未配置此标志，
则此字段默认为包含发布者 URL 的单个元素列表。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The size of the buffer to store events before batching and writing. Only used in batch mode.
-->
批处理和写入事件之前用于缓存事件的缓冲区大小。
仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1</td>
</tr><tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum size of a batch. Only used in batch mode.
-->
每个批次的最大大小。仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-max-wait duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The amount of time to wait before force writing the batch that hadn't reached the max size. 
Only used in batch mode.
-->
强制写入尚未达到最大大小的批次之前要等待的时间。
仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-throttle-burst int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. 
Only used in batch mode.
-->
如果之前未使用 ThrottleQPS，则为同时发送的最大请求数。
仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-throttle-enable</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether batching throttling is enabled. Only used in batch mode.
-->
是否启用了批量限制。仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-throttle-qps float</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum average number of batches per second. Only used in batch mode.
-->
每秒的最大平均批次数。仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-compress</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, the rotated log files will be compressed using gzip.
-->
若设置了此标志，则被轮换的日志文件会使用 gzip 压缩。
</td>

</tr>

<tr>
<td colspan="2">--audit-log-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："json" </td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Format of saved audits. &quot;legacy&quot; indicates 1-line text format for each event. &quot;json&quot; indicates structured json format. Known formats are legacy,json.
-->
所保存的审计格式。
"legacy" 表示每行一个事件的文本格式。"json" 表示结构化的 JSON 格式。
已知格式为 legacy，json。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-maxage int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
-->
根据文件名中编码的时间戳保留旧审计日志文件的最大天数。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-maxbackup int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum number of old audit log files to retain. Setting a value of 0 will mean there's no restriction on the number of files.
-->
要保留的旧的审计日志文件个数上限。
将值设置为 0 表示对文件个数没有限制。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-maxsize int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum size in megabytes of the audit log file before it gets rotated.
-->
轮换之前，审计日志文件的最大大小（以兆字节为单位）。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："blocking"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Strategy for sending audit events. Blocking indicates sending events should block server responses. 
Batch causes the backend to buffer and write events asynchronously. 
Known modes are batch,blocking,blocking-strict.
-->
用来发送审计事件的策略。
阻塞（blocking）表示发送事件应阻止服务器响应。
批处理（batch）会导致后端异步缓冲和写入事件。
已知的模式是批处理（batch），阻塞（blocking），严格阻塞（blocking-strict）。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-path string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, all requests coming to the apiserver will be logged to this file.
'-' means standard out.
-->
如果设置，则所有到达 API 服务器的请求都将记录到该文件中。
"-" 表示标准输出。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-enabled</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether event and batch truncating is enabled.
-->
是否启用事件和批次截断。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10485760</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of the batch sent to the underlying backend. Actual serialized size can be 
several hundreds of bytes greater. If a batch exceeds this limit, it is split into 
several batches of smaller size.
-->
发送到下层后端的每批次的最大数据量。
实际的序列化大小可能会增加数百个字节。
如果一个批次超出此限制，则将其分成几个较小的批次。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：102400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of the audit event sent to the underlying backend. If the size of an event
is greater than this number, first request and response are removed, and if this doesn't 
reduce the size enough, event is discarded.
-->
发送到下层后端的每批次的最大数据量。
如果事件的大小大于此数字，则将删除第一个请求和响应；
如果这样做没有减小足够大的程度，则将丢弃事件。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："audit.k8s.io/v1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
API group and version used for serializing audit events written to log.
-->
用于对写入日志的审计事件执行序列化的 API 组和版本。
</td>
</tr>

<tr>
<td colspan="2">--audit-policy-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the file that defines the audit policy configuration.
-->
定义审计策略配置的文件的路径。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The size of the buffer to store events before batching and writing. Only used in batch mode.
-->
划分批次和写入之前用于存储事件的缓冲区大小。
仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum size of a batch. Only used in batch mode.
-->
批次的最大大小。
仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-max-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The amount of time to wait before force writing the batch that hadn't reached the max size. 
Only used in batch mode.
-->
强制写入尚未达到最大大小的批处理之前要等待的时间。
仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-burst int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：15</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. 
Only used in batch mode.
-->
如果之前未使用 ThrottleQPS，同时发送的最大请求数。
仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-enable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether batching throttling is enabled. Only used in batch mode.
-->
是否启用了批量限制。仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum average number of batches per second. Only used in batch mode.
-->
每秒的最大平均批次数。仅在批处理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeconfig formatted file that defines the audit webhook configuration.
-->
定义审计 webhook 配置的 kubeconfig 格式文件的路径。
</tr>

<tr>
<td colspan="2">--audit-webhook-initial-backoff duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The amount of time to wait before retrying the first failed request.
-->
重试第一个失败的请求之前要等待的时间。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："batch"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Strategy for sending audit events. Blocking indicates sending events should block server responses. 
Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking,blocking-strict.
-->
发送审计事件的策略。
阻止（Blocking）表示发送事件应阻止服务器响应。
批处理（Batch）导致后端异步缓冲和写入事件。
已知的模式是批处理（batch），阻塞（blocking），严格阻塞（blocking-strict）。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-enabled</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether event and batch truncating is enabled.
-->
是否启用事件和批处理截断。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：10485760</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
Maximum size of the batch sent to the underlying backend. Actual serialized size can be 
several hundreds of bytes greater. If a batch exceeds this limit, it is split into 
several batches of smaller size.
-->
发送到下层后端的批次的最大数据量。
实际的序列化大小可能会增加数百个字节。
如果一个批次超出此限制，则将其分成几个较小的批次。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：102400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of the audit event sent to the underlying backend. If the size of an event
is greater than this number, first request and response are removed, and if this doesn't
reduce the size enough, event is discarded.
-->
发送到下层后端的批次的最大数据量。
如果事件的大小大于此数字，则将删除第一个请求和响应；
如果事件和事件的大小没有减小到一定幅度，则将丢弃事件。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："audit.k8s.io/v1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
API group and version used for serializing audit events written to webhook.
-->
用于序列化写入 Webhook 的审计事件的 API 组和版本。
</td>
</tr>

<tr>
<td colspan="2">--authentication-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
File with Authentication Configuration to configure the JWT Token authenticator or the anonymous authenticator. Note: This feature is in Alpha since v1.29.--feature-gate=StructuredAuthenticationConfiguration=true needs to be set for enabling this feature.This feature is mutually exclusive with the oidc-* flags.To configure anonymous authenticator you need to enable --feature-gate=AnonymousAuthConfigurableEndpoints.When you configure anonymous authenticator in the authentication config you cannot use the --anonymous-auth flag.
-->
用于配置 JWT 令牌身份认证模块或匿名身份认证模块的身份认证配置文件。注意：此特性自 v1.29 起处于 Alpha 阶段。
需要设置 <code>--feature-gate=StructuredAuthenticationConfiguration=true</code> 才能启用此特性。
此特性与 <code>oidc-*</code> 标志互斥。要配置匿名身份认证模块，
你需要启用 <code>--feature-gate=AnonymousAuthConfigurableEndpoints</code>。
如果在身份认证配置文件中配置了匿名身份认证模块，就不能使用 <code>--anonymous-auth</code> 标志。
</p></td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->2m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache responses from the webhook token authenticator.
-->
对来自 Webhook 令牌身份认证模块的响应的缓存时间。
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File with webhook configuration for token authentication in kubeconfig format. 
The API server will query the remote service to determine authentication for bearer tokens.
-->
包含 Webhook 配置的 kubeconfig 格式文件，用于进行令牌认证。
API 服务器将查询远程服务，以对持有者令牌进行身份认证。
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："v1beta1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The API version of the authentication.k8s.io TokenReview to send to and expect from the webhook.
-->
与 Webhook 之间交换 authentication.k8s.io TokenReview 时使用的 API 版本。
</td>
</tr>

<tr>
<td colspan="2">--authorization-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
File with Authorization Configuration to configure the authorizer chain.Note: This feature is in Alpha since v1.29.--feature-gate=StructuredAuthorizationConfiguration=true feature flag needs to be set to true for enabling the functionality.This feature is mutually exclusive with the other --authorization-mode and --authorization-webhook-* flags.
-->
用于配置鉴权链的鉴权配置文件。注意：此特性自 v1.29 起处于 Alpha 阶段。
需要将 <code>--feature-gate=StructuredAuthorizationConfiguration=true</code> 特性标志设置为 true 才能启用此特性。
此特性与其他 <code>--authorization-mode和--authorization-webhook-*</code> 标志互斥。
</p></td>
</tr>

<tr>
<td colspan="2">--authorization-mode strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："AlwaysAllow"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Ordered list of plug-ins to do authorization on secure port. Comma-delimited list of: 
AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node.
-->
在安全端口上进行鉴权的插件的顺序列表。
逗号分隔的列表：AlwaysAllow、AlwaysDeny、ABAC、Webhook、RBAC、Node。
</td>
</tr>

<tr>
<td colspan="2">--authorization-policy-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File with authorization policy in json line by line format, 
used with --authorization-mode=ABAC, on the secure port.
-->
包含鉴权策略的文件，其内容为分行 JSON 格式，
在安全端口上与 --authorization-mode=ABAC 一起使用。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer.
-->
对来自 Webhook 鉴权组件的 “授权（authorized）” 响应的缓存时间。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer.
-->
对来自 Webhook 鉴权模块的 “未授权（unauthorized）” 响应的缓存时间。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File with webhook configuration in kubeconfig format, used with --authorization-mode=Webhook. 
The API server will query the remote service to determine access on the API server's secure port.
-->
包含 Webhook 配置的文件，其格式为 kubeconfig，
与 --authorization-mode=Webhook 一起使用。
API 服务器将查询远程服务，以对 API 服务器的安全端口的访问执行鉴权。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："v1beta1"</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The API version of the authorization.k8s.io SubjectAccessReview to send to and expect from the webhook.
-->
与 Webhook 之间交换 authorization.k8s.io SubjectAccessReview 时使用的 API 版本。
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："0.0.0.0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces and IP address families will be used.
-->
用来监听 <code>--secure-port</code> 端口的 IP 地址。
集群的其余部分以及 CLI/web 客户端必须可以访问所关联的接口。
如果为空白或未指定地址（<tt>0.0.0.0</tt> 或 <tt>::</tt>），则将使用所有接口和 IP 地址簇。
</td>
</tr>

<tr>
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/var/run/kubernetes"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The directory where the TLS certs are located. If --tls-cert-file and 
--tls-private-key-file are provided, this flag will be ignored.
-->
TLS 证书所在的目录。
如果提供了 <code>--tls-cert-file</code> 和 <code>--tls-private-key-file</code>
标志值，则将忽略此标志。
</td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, any request presenting a client certificate signed by one of the authorities 
in the client-ca-file is authenticated with an identity corresponding to the CommonName 
of the client certificate.
-->
如果已设置，则使用与客户端证书的 CommonName 对应的标识对任何出示由
client-ca 文件中的授权机构之一签名的客户端证书的请求进行身份认证。
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable block profiling, if profiling is enabled
-->
如果启用了性能分析，则启用阻塞分析。
</td>
</tr>

<tr>
<td colspan="2">--cors-allowed-origins strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
List of allowed origins for CORS, comma separated.  
An allowed origin can be a regular expression to support subdomain matching. 
If this list is empty CORS will not be enabled. Please ensure each expression matches the entire hostname by anchoring to the start with '^' or including the '//' prefix, and by anchoring to the end with '$' or including the ':' port separator suffix. Examples of valid expressions are '//example.com(:|$)' and '^https://example.com(:|$)'
-->
CORS 允许的来源清单，以逗号分隔。
允许的来源可以是支持子域匹配的正则表达式。
如果此列表为空，则不会启用 CORS。
请确保每个表达式与整个主机名相匹配，方法是用'^'锚定开始或包括'//'前缀，同时用'$'锚定结束或包括':'端口分隔符后缀。
有效表达式的例子是'//example.com(:|$)'和'^https://example.com(:|$)'。
</p>
</td>
</tr>

<tr>
<td colspan="2">--debug-socket-path string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Use an unprotected (no authn/authz) unix-domain socket for profiling with the given path
-->
使用位于给定路径的、未受保护的（无身份认证或鉴权的）UNIX 域套接字执行性能分析。
</p></td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: -->默认值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.
-->
对污点 NotReady:NoExecute 的容忍时长（以秒计）。
默认情况下这一容忍度会被添加到尚未具有此容忍度的每个 pod 中。
</td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Indicates the tolerationSeconds of the toleration for unreachable:NoExecute 
that is added by default to every pod that does not already have such a toleration.
-->
对污点 Unreachable:NoExecute 的容忍时长（以秒计）
默认情况下这一容忍度会被添加到尚未具有此容忍度的每个 pod 中。
</td>
</tr>

<tr>
<td colspan="2">--delete-collection-workers int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of workers spawned for DeleteCollection call. These are used to speed up namespace cleanup.
-->
为 DeleteCollection 调用而产生的工作线程数。
这些用于加速名字空间清理。
</td>
</tr>

<tr>
<td colspan="2">--disable-admission-plugins strings</td>
</tr>

<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
admission plugins that should be disabled although they are in the default enabled
plugins list (NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition,
PodSecurity, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection,
PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning,
ClusterTrustBundleAttest, CertificateSubjectRestriction, DefaultIngressClass,
MutatingAdmissionWebhook, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook, ResourceQuota).
Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages,
CertificateApproval, CertificateSigning, CertificateSubjectRestriction, ClusterTrustBundleAttest,
DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit,
ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger,
MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle,
NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize,
PodNodeSelector, PodSecurity, PodTolerationRestriction, Priority, ResourceQuota,
RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition,
ValidatingAdmissionPolicy, ValidatingAdmissionWebhook.
The order of plugins in this flag does not matter.
-->
<p>
尽管位于默认启用的插件列表中，仍须被禁用的准入插件（NamespaceLifecycle、LimitRanger、
ServiceAccount、TaintNodesByCondition、PodSecurity、Priority、DefaultTolerationSeconds、
DefaultStorageClass、StorageObjectInUseProtection、PersistentVolumeClaimResize、
RuntimeClass、CertificateApproval、CertificateSigning、ClusterTrustBundleAttest、
CertificateSubjectRestriction、DefaultIngressClass、MutatingAdmissionWebhook、
ValidatingAdmissionPolicy、ValidatingAdmissionWebhook、ResourceQuota）。
取值为逗号分隔的准入插件列表：AlwaysAdmit、AlwaysDeny、AlwaysPullImages、CertificateApproval、
CertificateSigning、CertificateSubjectRestriction、ClusterTrustBundleAttest、
DefaultIngressClass、DefaultStorageClass、DefaultTolerationSeconds、DenyServiceExternalIPs、
EventRateLimit、ExtendedResourceToleration、ImagePolicyWebhook、LimitPodHardAntiAffinityTopology、
LimitRanger、MutatingAdmissionWebhook、NamespaceAutoProvision、NamespaceExists、NamespaceLifecycle、
NodeRestriction、OwnerReferencesPermissionEnforcement、PersistentVolumeClaimResize、
PodNodeSelector、PodSecurity、PodTolerationRestriction、Priority、ResourceQuota、RuntimeClass、ServiceAccount、
StorageObjectInUseProtection、TaintNodesByCondition、ValidatingAdmissionPolicy、ValidatingAdmissionWebhook。
该标志中插件的顺序无关紧要。
</p>
</td>
</tr>

<tr>
<td colspan="2">--disable-http2-serving</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, HTTP2 serving will be disabled [default=false]
-->
如果为 true，HTTP2 服务将被禁用 [默认值=false]
</p></td>
</tr>

<tr>
<td colspan="2">--disabled-metrics strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This flag provides an escape hatch for misbehaving metrics. You must provide the fully qualified metric name in order to disable it. Disclaimer: disabling metrics is higher in precedence than showing hidden metrics.
-->
此标志为行为不正确的度量指标提供一种处理方案。
你必须提供完全限定的指标名称才能将其禁止。
声明：禁用度量值的行为优先于显示已隐藏的度量值。
</td>
</tr>

<tr>
<td colspan="2">--egress-selector-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File with apiserver egress selector configuration.
-->
带有 API 服务器出站选择器配置的文件。
</td>
</tr>

<tr>
<td colspan="2">--emulated-version strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The versions different components emulate their capabilities (APIs, features, ...) of.<br/>If set, the component will emulate the behavior of this version instead of the underlying binary version.<br/>Version format could only be major.minor, for example: '--emulated-version=wardle=1.2,kube=1.31'. Options are:<br/>kube=1.31..1.31 (default=1.31)If the component is not specified, defaults to &quot;kube&quot;
-->
不同组件所模拟的能力（API、特性等）的版本。<br/>
如果设置了该选项，组件将模拟此版本的行为，而不是下层可执行文件版本的行为。<br/>
版本格式只能是 major.minor，例如 “--emulated-version=wardle=1.2,kube=1.31”。
选项包括：<br/>kube=1.31..1.31（默认值=1.31）。如果组件未被指定，默认为 “kube”。
</p></td>
</tr>

<tr>
<td colspan="2">--enable-admission-plugins strings</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
admission plugins that should be enabled in addition to default enabled ones
(NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, PodSecurity,
Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection,
PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning,
ClusterTrustBundleAttest, CertificateSubjectRestriction, DefaultIngressClass,
MutatingAdmissionWebhook, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook, ResourceQuota).
Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages,
CertificateApproval, CertificateSigning, CertificateSubjectRestriction, ClusterTrustBundleAttest,
DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs,
EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology,
LimitRanger, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle,
NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize,
PodNodeSelector, PodSecurity, PodTolerationRestriction, Priority,
ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection,
TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook.
The order of plugins in this flag does not matter.
-->
<p>
除了默认启用的插件（NamespaceLifecycle、LimitRanger、ServiceAccount、TaintNodesByCondition、
PodSecurity、Priority、DefaultTolerationSeconds、DefaultStorageClass、StorageObjectInUseProtection、
PersistentVolumeClaimResize、RuntimeClass、CertificateApproval、CertificateSigning、ClusterTrustBundleAttest、
CertificateSubjectRestriction、DefaultIngressClass、MutatingAdmissionWebhook、ValidatingAdmissionPolicy、
ValidatingAdmissionWebhook、ResourceQuota）之外要启用的准入插件。
取值为逗号分隔的准入插件列表：AlwaysAdmit、AlwaysDeny、AlwaysPullImages、CertificateApproval、
CertificateSigning、CertificateSubjectRestriction、ClusterTrustBundleAttest、DefaultIngressClass、
DefaultStorageClass、DefaultTolerationSeconds、DenyServiceExternalIPs、EventRateLimit、
ExtendedResourceToleration、ImagePolicyWebhook、LimitPodHardAntiAffinityTopology、LimitRanger、
MutatingAdmissionWebhook、NamespaceAutoProvision、NamespaceExists、NamespaceLifecycle、
NodeRestriction、OwnerReferencesPermissionEnforcement、PersistentVolumeClaimResize、
PodNodeSelector、PodSecurity、PodTolerationRestriction、Priority、
ResourceQuota、RuntimeClass、ServiceAccount、StorageObjectInUseProtection、TaintNodesByCondition、
ValidatingAdmissionPolicy、ValidatingAdmissionWebhook。该标志中插件的顺序无关紧要。
</p>
</td>
</tr>

<tr>
<td colspan="2">--enable-aggregator-routing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Turns on aggregator routing requests to endpoints IP rather than cluster IP.
-->
允许聚合器将请求路由到端点 IP 而非集群 IP。
</td>
</tr>

<tr>
<td colspan="2">--enable-bootstrap-token-auth</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable to allow secrets of type 'bootstrap.kubernetes.io/token' in the 'kube-system'
namespace to be used for TLS bootstrapping authentication.
-->
启用以允许将 "kube-system" 名字空间中类型为 "bootstrap.kubernetes.io/token"
的 Secret 用于 TLS 引导身份认证。
</td>
</tr>

<tr>
<td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager.
-->
启用通用垃圾收集器。必须与 kube-controller-manager 的相应标志同步。
</td>
</tr>

<tr>
<td colspan="2">--enable-priority-and-fairness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, replace the max-in-flight handler with an enhanced one that queues and dispatches with priority and fairness
-->
如果为 true，则使用增强的处理程序替换 max-in-flight 处理程序，
以便根据优先级和公平性完成排队和调度。
</td>
</tr>

<tr>
<td colspan="2">--encryption-provider-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The file containing configuration for encryption providers to be used for storing secrets in etcd
-->
包含加密提供程序配置信息的文件，用在 etcd 中所存储的 Secret 上。
</td>
</tr>

<tr>
<td colspan="2">--encryption-provider-config-automatic-reload</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
Determines if the file set by --encryption-provider-config should be automatically reloaded if the disk contents change. Setting this to true disables the ability to uniquely identify distinct KMS plugins via the API server healthz endpoints.
-->
<p>
确定由 --encryption-provider-config 设置的文件是否应在磁盘内容更改时自动重新加载。
将此标志设置为 true 将禁用通过 API 服务器 healthz 端点来唯一地标识不同 KMS 插件的能力。
</p>
</td>
</tr>

<tr>
<td colspan="2">--endpoint-reconciler-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："lease"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use an endpoint reconciler (master-count, lease, none) master-count is deprecated, and will be removed in a future version.
-->
使用端点协调器（<code>master-count</code>、<code>lease</code> 或 <code>none</code>）。
<code>master-count</code> 已弃用，并将在未来版本中删除。
</td>
</tr>

<tr>
<td colspan="2">--etcd-cafile string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
SSL Certificate Authority file used to secure etcd communication.
-->
用于保护 etcd 通信的 SSL 证书颁发机构文件。
</td>
</tr>

<tr>
<td colspan="2">--etcd-certfile string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
SSL certification file used to secure etcd communication.
-->
用于保护 etcd 通信的 SSL 证书文件。
</td>
</tr>

<tr>
<td colspan="2">--etcd-compaction-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval of compaction requests. If 0, the compaction request from apiserver is disabled.
-->
压缩请求的间隔。
如果为0，则禁用来自 API 服务器的压缩请求。
</td>
</tr>

<tr>
<td colspan="2">--etcd-count-metric-poll-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Frequency of polling etcd for number of resources per type. 0 disables the metric collection.
-->
针对每种类型的资源数量轮询 etcd 的频率。
0 值表示禁用度量值收集。
</td>
</tr>

<tr>
<td colspan="2">--etcd-db-metric-poll-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval of requests to poll etcd and update metric. 0 disables the metric collection
-->
轮询 etcd 和更新度量值的请求间隔。0 值表示禁用度量值收集。
</td>
</tr>

<tr>
<td colspan="2">--etcd-healthcheck-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:—->默认值：2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The timeout to use when checking etcd health.
-->
检查 etcd 健康状况时使用的超时时长。
</td>
</tr>

<tr>
<td colspan="2">--etcd-keyfile string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
SSL key file used to secure etcd communication.<
-->
用于保护 etcd 通信的 SSL 密钥文件。
</td>
</tr>

<tr>
<td colspan="2">--etcd-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/registry"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The prefix to prepend to all resource paths in etcd.
-->
要在 etcd 中所有资源路径之前添加的前缀。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--etcd-readycheck-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s
-->
--etcd-readycheck-timeout 时长&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 2s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The timeout to use when checking etcd readiness
-->
检查 etcd 是否就绪时使用的超时</p></td>
</tr>

<tr>
<td colspan="2">--etcd-servers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of etcd servers to connect with (scheme://ip:port), comma separated.
-->
要连接的 etcd 服务器列表（<code>scheme://ip:port</code>），以逗号分隔。
</td>
</tr>

<tr>
<td colspan="2">--etcd-servers-overrides strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Per-resource etcd servers overrides, comma separated. 
The individual override format: group/resource#servers, 
where servers are URLs, semicolon separated.
Note that this applies only to resources compiled into this server binary.
-->
etcd 服务器针对每个资源的重载设置，以逗号分隔。
单个替代格式：组/资源#服务器（group/resource#servers），
其中服务器是 URL，以分号分隔。
注意，此选项仅适用于编译进此服务器二进制文件的资源。
</td>
</tr>

<tr>
<td colspan="2">--event-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Amount of time to retain events.
-->
事件的保留时长。
</td>
</tr>

<tr>
<td colspan="2">--external-hostname string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The hostname to use when generating externalized URLs for this master 
(e.g. Swagger API Docs or OpenID Discovery).
-->
为此主机生成外部化 UR L时要使用的主机名（例如 Swagger API 文档或 OpenID 发现）。
</td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;
<!--
comma-separated 'key=True|False' pairs
-->
逗号分隔的 'key=True|False' 键值对&gt;</td>
</tr>

<tr>
<td colspan="2">--feature-gates colonSeparatedMultimapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Comma-separated list of component:key=value pairs that describe feature gates for alpha/experimental features of different components.<br/>
If the component is not specified, defaults to &quot;kube&quot;. This flag can be repeatedly invoked. For example: --feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'Options are:<br/>
kube:APIResponseCompression=true|false (BETA - default=true)<br/>
kube:APIServerIdentity=true|false (BETA - default=true)<br/>
kube:APIServerTracing=true|false (BETA - default=true)<br/>
kube:APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
kube:AllAlpha=true|false (ALPHA - default=false)<br/>
kube:AllBeta=true|false (BETA - default=false)<br/>
kube:AnonymousAuthConfigurableEndpoints=true|false (ALPHA - default=false)<br/>
kube:AnyVolumeDataSource=true|false (BETA - default=true)<br/>
kube:AuthorizeNodeWithSelectors=true|false (ALPHA - default=false)<br/>
kube:AuthorizeWithSelectors=true|false (ALPHA - default=false)<br/>
kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
kube:CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
kube:CRDValidationRatcheting=true|false (BETA - default=true)<br/>
kube:CSIMigrationPortworx=true|false (BETA - default=true)<br/>
kube:CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
kube:CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
kube:ClusterTrustBundle=true|false (ALPHA - default=false)<br/>
kube:ClusterTrustBundleProjection=true|false (ALPHA - default=false)<br/>
kube:ComponentSLIs=true|false (BETA - default=true)<br/>
kube:ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
kube:ConsistentListFromCache=true|false (BETA - default=true)<br/>
kube:ContainerCheckpoint=true|false (BETA - default=true)<br/>
kube:ContextualLogging=true|false (BETA - default=true)<br/>
kube:CoordinatedLeaderElection=true|false (ALPHA - default=false)<br/>
kube:CronJobsScheduledAnnotation=true|false (BETA - default=true)<br/>
kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
kube:CustomResourceFieldSelectors=true|false (BETA - default=true)<br/>
kube:DRAControlPlaneController=true|false (ALPHA - default=false)<br/>
kube:DisableAllocatorDualWrite=true|false (ALPHA - default=false)<br/>
kube:DisableNodeKubeProxyVersion=true|false (BETA - default=true)<br/>
kube:DynamicResourceAllocation=true|false (ALPHA - default=false)<br/>
kube:EventedPLEG=true|false (ALPHA - default=false)<br/>
kube:GracefulNodeShutdown=true|false (BETA - default=true)<br/>
kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
kube:HPAScaleToZero=true|false (ALPHA - default=false)<br/>
kube:HonorPVReclaimPolicy=true|false (BETA - default=true)<br/>
kube:ImageMaximumGCAge=true|false (BETA - default=true)<br/>
kube:ImageVolume=true|false (ALPHA - default=false)<br/>
kube:InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>
kube:InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
kube:InformerResourceVersion=true|false (ALPHA - default=false)<br/>
kube:JobBackoffLimitPerIndex=true|false (BETA - default=true)<br/>
kube:JobManagedBy=true|false (ALPHA - default=false)<br/>
kube:JobPodReplacementPolicy=true|false (BETA - default=true)<br/>
kube:JobSuccessPolicy=true|false (BETA - default=true)<br/>
kube:KubeletCgroupDriverFromCRI=true|false (BETA - default=true)<br/>
kube:KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
kube:KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>
kube:KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>
kube:KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
kube:KubeletTracing=true|false (BETA - default=true)<br/>
kube:LoadBalancerIPMode=true|false (BETA - default=true)<br/>
kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
kube:LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:LoggingBetaOptions=true|false (BETA - default=true)<br/>
kube:MatchLabelKeysInPodAffinity=true|false (BETA - default=true)<br/>
kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
kube:MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
kube:MemoryManager=true|false (BETA - default=true)<br/>
kube:MemoryQoS=true|false (ALPHA - default=false)<br/>
kube:MultiCIDRServiceAllocator=true|false (BETA - default=false)<br/>
kube:MutatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>
kube:NFTablesProxyMode=true|false (BETA - default=true)<br/>
kube:NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>
kube:NodeLogQuery=true|false (BETA - default=false)<br/>
kube:NodeSwap=true|false (BETA - default=true)<br/>
kube:OpenAPIEnums=true|false (BETA - default=true)<br/>
kube:PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
kube:PodDeletionCost=true|false (BETA - default=true)<br/>
kube:PodIndexLabel=true|false (BETA - default=true)<br/>
kube:PodLifecycleSleepAction=true|false (BETA - default=true)<br/>
kube:PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
kube:PortForwardWebsockets=true|false (BETA - default=true)<br/>
kube:ProcMountType=true|false (BETA - default=false)<br/>
kube:QOSReserved=true|false (ALPHA - default=false)<br/>
kube:RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>
kube:RecursiveReadOnlyMounts=true|false (BETA - default=true)<br/>
kube:RelaxedEnvironmentVariableValidation=true|false (ALPHA - default=false)<br/>
kube:ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
kube:ResilientWatchCacheInitialization=true|false (BETA - default=true)<br/>
kube:ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
kube:RetryGenerateName=true|false (BETA - default=true)<br/>
kube:RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
kube:RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
kube:SELinuxMount=true|false (ALPHA - default=false)<br/>
kube:SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
kube:SchedulerQueueingHints=true|false (BETA - default=false)<br/>
kube:SeparateCacheWatchRPC=true|false (BETA - default=true)<br/>
kube:SeparateTaintEvictionController=true|false (BETA - default=true)<br/>
kube:ServiceAccountTokenJTI=true|false (BETA - default=true)<br/>
kube:ServiceAccountTokenNodeBinding=true|false (BETA - default=true)<br/>
kube:ServiceAccountTokenNodeBindingValidation=true|false (BETA - default=true)<br/>
kube:ServiceAccountTokenPodNodeInfo=true|false (BETA - default=true)<br/>
kube:ServiceTrafficDistribution=true|false (BETA - default=true)<br/>
kube:SidecarContainers=true|false (BETA - default=true)<br/>
kube:SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>
kube:StatefulSetAutoDeletePVC=true|false (BETA - default=true)<br/>
kube:StorageNamespaceIndex=true|false (BETA - default=true)<br/>
kube:StorageVersionAPI=true|false (ALPHA - default=false)<br/>
kube:StorageVersionHash=true|false (BETA - default=true)<br/>
kube:StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
kube:StrictCostEnforcementForVAP=true|false (BETA - default=false)<br/>
kube:StrictCostEnforcementForWebhooks=true|false (BETA - default=false)<br/>
kube:StructuredAuthenticationConfiguration=true|false (BETA - default=true)<br/>
kube:StructuredAuthorizationConfiguration=true|false (BETA - default=true)<br/>
kube:SupplementalGroupsPolicy=true|false (ALPHA - default=false)<br/>
kube:TopologyAwareHints=true|false (BETA - default=true)<br/>
kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
kube:TopologyManagerPolicyOptions=true|false (BETA - default=true)<br/>
kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
kube:UserNamespacesSupport=true|false (BETA - default=false)<br/>
kube:VolumeAttributesClass=true|false (BETA - default=false)<br/>
kube:VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
kube:WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
kube:WatchFromStorageWithoutResourceVersion=true|false (BETA - default=false)<br/>
kube:WatchList=true|false (ALPHA - default=false)<br/>
kube:WatchListClient=true|false (BETA - default=false)<br/>
kube:WinDSR=true|false (ALPHA - default=false)<br/>
kube:WinOverlay=true|false (BETA - default=true)<br/>
kube:WindowsHostNetwork=true|false (ALPHA - default=true)
-->
逗号分隔的组件列表，这些 key=value 对用来描述不同组件测试性/试验性特性的特性门控。<br/>
如果组件未被指定，默认值为“kube”。此标志可以被重复调用。例如：
--feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'
可选项为：<br/>
kube:APIResponseCompression=true|false (BETA - 默认值=true)<br/>
kube:APIServerIdentity=true|false (BETA - 默认值=true)<br/>
kube:APIServerTracing=true|false (BETA - 默认值=true)<br/>
kube:APIServingWithRoutine=true|false (ALPHA - 默认值=false)<br/>
kube:AllAlpha=true|false (ALPHA - 默认值=false)<br/>
kube:AllBeta=true|false (BETA - 默认值=false)<br/>
kube:AnonymousAuthConfigurableEndpoints=true|false (ALPHA - 默认值=false)<br/>
kube:AnyVolumeDataSource=true|false (BETA - 默认值=true)<br/>
kube:AuthorizeNodeWithSelectors=true|false (ALPHA - 默认值=false)<br/>
kube:AuthorizeWithSelectors=true|false (ALPHA - 默认值=false)<br/>
kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - 默认值=false)<br/>
kube:CPUManagerPolicyBetaOptions=true|false (BETA - 默认值=true)<br/>
kube:CPUManagerPolicyOptions=true|false (BETA - 默认值=true)<br/>
kube:CRDValidationRatcheting=true|false (BETA - 默认值=true)<br/>
kube:CSIMigrationPortworx=true|false (BETA - 默认值=true)<br/>
kube:CSIVolumeHealth=true|false (ALPHA - 默认值=false)<br/>
kube:CloudControllerManagerWebhook=true|false (ALPHA - 默认值=false)<br/>
kube:ClusterTrustBundle=true|false (ALPHA - 默认值=false)<br/>
kube:ClusterTrustBundleProjection=true|false (ALPHA - 默认值=false)<br/>
kube:ComponentSLIs=true|false (BETA - 默认值=true)<br/>
kube:ConcurrentWatchObjectDecode=true|false (BETA - 默认值=false)<br/>
kube:ConsistentListFromCache=true|false (BETA - 默认值=true)<br/>
kube:ContainerCheckpoint=true|false (BETA - 默认值=true)<br/>
kube:ContextualLogging=true|false (BETA - 默认值=true)<br/>
kube:CoordinatedLeaderElection=true|false (ALPHA - 默认值=false)<br/>
kube:CronJobsScheduledAnnotation=true|false (BETA - 默认值=true)<br/>
kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - 默认值=false)<br/>
kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默认值=false)<br/>
kube:CustomResourceFieldSelectors=true|false (BETA - 默认值=true)<br/>
kube:DRAControlPlaneController=true|false (ALPHA - 默认值=false)<br/>
kube:DisableAllocatorDualWrite=true|false (ALPHA - 默认值=false)<br/>
kube:DisableNodeKubeProxyVersion=true|false (BETA - 默认值=true)<br/>
kube:DynamicResourceAllocation=true|false (ALPHA - 默认值=false)<br/>
kube:EventedPLEG=true|false (ALPHA - 默认值=false)<br/>
kube:GracefulNodeShutdown=true|false (BETA - 默认值=true)<br/>
kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 默认值=true)<br/>
kube:HPAScaleToZero=true|false (ALPHA - 默认值=false)<br/>
kube:HonorPVReclaimPolicy=true|false (BETA - 默认值=true)<br/>
kube:ImageMaximumGCAge=true|false (BETA - 默认值=true)<br/>
kube:ImageVolume=true|false (ALPHA - 默认值=false)<br/>
kube:InPlacePodVerticalScaling=true|false (ALPHA - 默认值=false)<br/>
kube:InTreePluginPortworxUnregister=true|false (ALPHA - 默认值=false)<br/>
kube:InformerResourceVersion=true|false (ALPHA - 默认值=false)<br/>
kube:JobBackoffLimitPerIndex=true|false (BETA - 默认值=true)<br/>
kube:JobManagedBy=true|false (ALPHA - 默认值=false)<br/>
kube:JobPodReplacementPolicy=true|false (BETA - 默认值=true)<br/>
kube:JobSuccessPolicy=true|false (BETA - 默认值=true)<br/>
kube:KubeletCgroupDriverFromCRI=true|false (BETA - 默认值=true)<br/>
kube:KubeletInUserNamespace=true|false (ALPHA - 默认值=false)<br/>
kube:KubeletPodResourcesDynamicResources=true|false (ALPHA - 默认值=false)<br/>
kube:KubeletPodResourcesGet=true|false (ALPHA - 默认值=false)<br/>
kube:KubeletSeparateDiskGC=true|false (BETA - 默认值=true)<br/>
kube:KubeletTracing=true|false (BETA - 默认值=true)<br/>
kube:LoadBalancerIPMode=true|false (BETA - 默认值=true)<br/>
kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - 默认值=false)<br/>
kube:LoggingAlphaOptions=true|false (ALPHA - 默认值=false)<br/>
kube:LoggingBetaOptions=true|false (BETA - 默认值=true)<br/>
kube:MatchLabelKeysInPodAffinity=true|false (BETA - 默认值=true)<br/>
kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - 默认值=true)<br/>
kube:MaxUnavailableStatefulSet=true|false (ALPHA - 默认值=false)<br/>
kube:MemoryManager=true|false (BETA - 默认值=true)<br/>
kube:MemoryQoS=true|false (ALPHA - 默认值=false)<br/>
kube:MultiCIDRServiceAllocator=true|false (BETA - 默认值=false)<br/>
kube:MutatingAdmissionPolicy=true|false (ALPHA - 默认值=false)<br/>
kube:NFTablesProxyMode=true|false (BETA - 默认值=true)<br/>
kube:NodeInclusionPolicyInPodTopologySpread=true|false (BETA - 默认值=true)<br/>
kube:NodeLogQuery=true|false (BETA - 默认值=false)<br/>
kube:NodeSwap=true|false (BETA - 默认值=true)<br/>
kube:OpenAPIEnums=true|false (BETA - 默认值=true)<br/>
kube:PodAndContainerStatsFromCRI=true|false (ALPHA - 默认值=false)<br/>
kube:PodDeletionCost=true|false (BETA - 默认值=true)<br/>
kube:PodIndexLabel=true|false (BETA - 默认值=true)<br/>
kube:PodLifecycleSleepAction=true|false (BETA - 默认值=true)<br/>
kube:PodReadyToStartContainersCondition=true|false (BETA - 默认值=true)<br/>
kube:PortForwardWebsockets=true|false (BETA - 默认值=true)<br/>
kube:ProcMountType=true|false (BETA - 默认值=false)<br/>
kube:QOSReserved=true|false (ALPHA - 默认值=false)<br/>
kube:RecoverVolumeExpansionFailure=true|false (ALPHA - 默认值=false)<br/>
kube:RecursiveReadOnlyMounts=true|false (BETA - 默认值=true)<br/>
kube:RelaxedEnvironmentVariableValidation=true|false (ALPHA - 默认值=false)<br/>
kube:ReloadKubeletServerCertificateFile=true|false (BETA - 默认值=true)<br/>
kube:ResilientWatchCacheInitialization=true|false (BETA - 默认值=true)<br/>
kube:ResourceHealthStatus=true|false (ALPHA - 默认值=false)<br/>
kube:RetryGenerateName=true|false (BETA - 默认值=true)<br/>
kube:RotateKubeletServerCertificate=true|false (BETA - 默认值=true)<br/>
kube:RuntimeClassInImageCriApi=true|false (ALPHA - 默认值=false)<br/>
kube:SELinuxMount=true|false (ALPHA - 默认值=false)<br/>
kube:SELinuxMountReadWriteOncePod=true|false (BETA - 默认值=true)<br/>
kube:SchedulerQueueingHints=true|false (BETA - 默认值=false)<br/>
kube:SeparateCacheWatchRPC=true|false (BETA - 默认值=true)<br/>
kube:SeparateTaintEvictionController=true|false (BETA - 默认值=true)<br/>
kube:ServiceAccountTokenJTI=true|false (BETA - 默认值=true)<br/>
kube:ServiceAccountTokenNodeBinding=true|false (BETA - 默认值=true)<br/>
kube:ServiceAccountTokenNodeBindingValidation=true|false (BETA - 默认值=true)<br/>
kube:ServiceAccountTokenPodNodeInfo=true|false (BETA - 默认值=true)<br/>
kube:ServiceTrafficDistribution=true|false (BETA - 默认值=true)<br/>
kube:SidecarContainers=true|false (BETA - 默认值=true)<br/>
kube:SizeMemoryBackedVolumes=true|false (BETA - 默认值=true)<br/>
kube:StatefulSetAutoDeletePVC=true|false (BETA - 默认值=true)<br/>
kube:StorageNamespaceIndex=true|false (BETA - 默认值=true)<br/>
kube:StorageVersionAPI=true|false (ALPHA - 默认值=false)<br/>
kube:StorageVersionHash=true|false (BETA - 默认值=true)<br/>
kube:StorageVersionMigrator=true|false (ALPHA - 默认值=false)<br/>
kube:StrictCostEnforcementForVAP=true|false (BETA - 默认值=false)<br/>
kube:StrictCostEnforcementForWebhooks=true|false (BETA - 默认值=false)<br/>
kube:StructuredAuthenticationConfiguration=true|false (BETA - 默认值=true)<br/>
kube:StructuredAuthorizationConfiguration=true|false (BETA - 默认值=true)<br/>
kube:SupplementalGroupsPolicy=true|false (ALPHA - 默认值=false)<br/>
kube:TopologyAwareHints=true|false (BETA - 默认值=true)<br/>
kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - 默认值=false)<br/>
kube:TopologyManagerPolicyBetaOptions=true|false (BETA - 默认值=true)<br/>
kube:TopologyManagerPolicyOptions=true|false (BETA - 默认值=true)<br/>
kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - 默认值=true)<br/>
kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - 默认值=true)<br/>
kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - 默认值=false)<br/>
kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - 默认值=false)<br/>
kube:UserNamespacesSupport=true|false (BETA - 默认值=false)<br/>
kube:VolumeAttributesClass=true|false (BETA - 默认值=false)<br/>
kube:VolumeCapacityPriority=true|false (ALPHA - 默认值=false)<br/>
kube:WatchCacheInitializationPostStartHook=true|false (BETA - 默认值=false)<br/>
kube:WatchFromStorageWithoutResourceVersion=true|false (BETA - 默认值=false)<br/>
kube:WatchList=true|false (ALPHA - 默认值=false)<br/>
kube:WatchListClient=true|false (BETA - 默认值=false)<br/>
kube:WinDSR=true|false (ALPHA - 默认值=false)<br/>
kube:WinOverlay=true|false (BETA - 默认值=true)<br/>
kube:WindowsHostNetwork=true|false (ALPHA - 默认值=true)
</p></td>
</tr>

<tr>
<td colspan="2">--goaway-chance float</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
To prevent HTTP/2 clients from getting stuck on a single apiserver, 
randomly close a connection (GOAWAY). The client's other in-flight 
requests won't be affected, and the client will reconnect, likely 
landing on a different apiserver after going through the load 
balancer again. This argument sets the fraction of requests that 
will be sent a GOAWAY. Clusters with single apiservers, or which 
don't use a load balancer, should NOT enable this. Min is 0 (off), 
Max is .02 (1/50 requests); .001 (1/1000) is a recommended starting point.
-->
为防止 HTTP/2 客户端卡在单个 API 服务器上，随机关闭某连接（GOAWAY）。
客户端的其他运行中请求不会受到影响。被关闭的客户端将重新连接，
重新被负载均衡后可能会与其他 API 服务器开始通信。
此参数设置将被发送 GOAWAY 指令的请求的比例。
只有一个 API 服务器或不使用负载均衡器的集群不应启用此特性。
最小值为 0（关闭），最大值为 .02（1/50 请求）；建议使用 .001（1/1000）。
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kube-apiserver
-->
kube-apiserver 的帮助命令
</td>
</tr>

<tr>
<td colspan="2">--http2-max-streams-per-connection int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The limit that the server gives to clients for the maximum number 
of streams in an HTTP/2 connection. Zero means to use golang's default.
-->
服务器为客户端提供的 HTTP/2 连接中最大流数的限制。
零表示使用 GoLang 的默认值。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a cert file for the certificate authority.
-->
证书颁发机构的证书文件的路径。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a client cert file for TLS.
-->
TLS 的客户端证书文件的路径。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a client key file for TLS.
-->
TLS 客户端密钥文件的路径。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-preferred-address-types strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of the preferred NodeAddressTypes to use for kubelet connections.
-->
用于 kubelet 连接的首选 NodeAddressTypes 列表。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Timeout for kubelet operations.
-->
kubelet 操作超时时间。
</td>
</tr>

<tr>
<td colspan="2">--kubernetes-service-node-port int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-zero, the Kubernetes master service (which apiserver creates/maintains) 
will be of type NodePort, using this as the value of the port. If zero, 
the Kubernetes master service will be of type ClusterIP.
-->
如果非零，那么 Kubernetes 主服务（由 apiserver 创建/维护）将是 NodePort 类型，
使用此字段值作为端口值。
如果为零，则 Kubernetes 主服务将为 ClusterIP 类型。
</td>
</tr>

<tr>
<td colspan="2">--lease-reuse-duration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：60</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The time in seconds that each lease is reused. A lower value could avoid large number of objects reusing the same lease. Notice that a too small value may cause performance problems at storage layer.
-->
每个租约被重用的时长。
如果此值比较低，可以避免大量对象重用此租约。
注意，如果此值过小，可能导致存储层出现性能问题。
</td>
</tr>

<tr>
<td colspan="2">--livez-grace-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This option represents the maximum amount of time it should take for apiserver 
to complete its startup sequence and become live. From apiserver's start time 
to when this amount of time has elapsed, /livez will assume that unfinished 
post-start hooks will complete successfully and therefore return true.
-->
此选项代表 API 服务器完成启动序列并生效所需的最长时间。
从 API 服务器的启动时间到这段时间为止，
<tt>/livez</tt> 将假定未完成的启动后钩子将成功完成，因此返回 true。
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes
-->
两次日志刷新之间的最大秒数。
</td>
</tr>

<tr>
<td colspan="2">--log-text-info-buffer-size quantity</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[Alpha] In text format with split output streams, the info messages can be buffered for a while to increase performance.
The default value of zero bytes disables buffering. The size can be specified as number of bytes (512),
multiples of 1000 (1K), multiples of 1024 (2Ki), or powers of those (3M, 4G, 5Mi, 6Gi).
Enable the LoggingAlphaOptions feature gate to use this
-->
[Alpha] 在具有分割输出流的文本格式中，信息消息可以被缓冲一段时间以提高性能。
默认值零字节表示禁用缓冲区机制。
大小可以指定为字节数（512）、1000 的倍数（1K）、1024 的倍数（2Ki）或它们的幂（3M、4G、5Mi、6Gi）。
启用 LoggingAlphaOptions 特性门控以使用此功能。
</p>
</td>
</tr>

<tr>
<td colspan="2">--log-text-split-stream</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[Alpha] In text format, write error messages to stderr and info messages to stdout.
The default is to write a single stream to stdout.
Enable the LoggingAlphaOptions feature gate to use this.
-->
[Alpha] 以文本格式，将错误消息写入 stderr，将信息消息写入 stdout。
默认是将单个流写入标准输出。
启用 LoggingAlphaOptions 特性门控以使用它。
</p>
</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："text"</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets the log format. Permitted formats: &quot;text&quot;.
-->
<p>
设置日志格式。允许的格式：&quot;text&quot;。
</p>
</td>
</tr>

<tr>
<td colspan="2">--master-service-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："default"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: the namespace from which the Kubernetes master services should be injected into pods.
-->
已废弃：应该从其中将 Kubernetes 主服务注入到 Pod 中的名字空间。
</td>
</tr>

<tr>
<td colspan="2">--max-connection-bytes-per-sec int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-zero, throttle each user connection to this number of bytes/sec. Currently only applies to long-running requests.
-->
如果不为零，则将每个用户连接的带宽限制为此数值（字节数/秒）。
当前仅适用于长时间运行的请求。
</td>
</tr>

<tr>
<td colspan="2">--max-mutating-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：200</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This and --max-requests-inflight are summed to determine the server's total concurrency limit (which must be positive) if --enable-priority-and-fairness is true.
Otherwise, this flag limits the maximum number of mutating requests in flight, or a zero value disables the limit completely.
-->
如果 --enable-priority-and-fairness 为 true，那么此值和 --max-requests-inflight
的和将确定服务器的总并发限制（必须是正数）。
否则，该值限制同时运行的变更类型的请求的个数上限。0 表示无限制。
</td>
</tr>

<tr>
<td colspan="2">--max-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This and --max-mutating-requests-inflight are summed to determine the server's total concurrency limit (which must be positive) if --enable-priority-and-fairness is true.
Otherwise, this flag limits the maximum number of non-mutating requests in flight, or a zero value disables the limit completely.
-->
如果 --enable-priority-and-fairness 为 true，那么此值和 --max-mutating-requests-inflight
的和将确定服务器的总并发限制（必须是正数）。
否则，该值限制进行中非变更类型请求的最大个数，零表示无限制。
</td>
</tr>

<tr>
<td colspan="2">--min-request-timeout int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--  
An optional field indicating the minimum number of seconds a handler must 
keep a request open before timing it out. Currently only honored by the 
watch request handler, which picks a randomized value above this number 
as the connection timeout, to spread out load.
-->
可选字段，表示处理程序在请求超时前，必须保持连接处于打开状态的最小秒数。
当前只对监听（Watch）请求的处理程序有效。
Watch 请求的处理程序会基于这个值选择一个随机数作为连接超时值，
以达到分散负载的目的。
</td>
</tr>

<tr>
<td colspan="2">--oidc-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, the OpenID server's certificate will be verified by one of 
the authorities in the oidc-ca-file, otherwise the host's root CA set will be used.
-->
如果设置该值，将会使用 oidc-ca-file 中的机构之一对 OpenID 服务的证书进行验证，
否则将会使用主机的根 CA 对其进行验证。
</td>
</tr>

<tr>
<td colspan="2">--oidc-client-id string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The client ID for the OpenID Connect client, must be set if oidc-issuer-url is set.
-->
OpenID 连接客户端的要使用的客户 ID，如果设置了 oidc-issuer-url，则必须设置这个值。
</td>
</tr>

<tr>
<td colspan="2">--oidc-groups-claim string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If provided, the name of a custom OpenID Connect claim for specifying user groups. 
The claim value is expected to be a string or array of strings. 
This flag is experimental, please see the authentication documentation for further details.
-->
如果提供该值，这个自定义 OpenID 连接声明将被用来设定用户组。
该声明值需要是一个字符串或字符串数组。
此标志为实验性的，请查阅身份认证相关文档进一步了解详细信息。
</td>
</tr>

<tr>
<td colspan="2">--oidc-groups-prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If provided, all groups will be prefixed with this value to 
prevent conflicts with other authentication strategies.
-->
如果提供了此值，则所有组都将以该值作为前缀，以防止与其他身份认证策略冲突。
</td>
</tr>

<tr>
<td colspan="2">--oidc-issuer-url string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The URL of the OpenID issuer, only HTTPS scheme will be accepted. 
If set, it will be used to verify the OIDC JSON Web Token (JWT).
-->
OpenID 颁发者 URL，只接受 HTTPS 方案。
如果设置该值，它将被用于验证 OIDC JSON Web Token(JWT)。
</td>
</tr>

<tr>
<td colspan="2">--oidc-required-claim &lt;逗号分隔的 'key=value' 键值对列表&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A key=value pair that describes a required claim in the ID Token. 
If set, the claim is verified to be present in the ID Token with a matching value. 
Repeat this flag to specify multiple claims.
-->
描述 ID 令牌中必需声明的键值对。
如果设置此值，则会验证 ID 令牌中存在与该声明匹配的值。
重复此标志以指定多个声明。
</td>
</tr>

<tr>
<td colspan="2">--oidc-signing-algs strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：RS256</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of allowed JOSE asymmetric signing algorithms. 
JWTs with a supported 'alg' header values are: RS256, RS384, RS512, ES256, ES384, ES512, PS256, PS384, PS512.
Values are defined by RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1.
-->
允许的 JOSE 非对称签名算法的逗号分隔列表。
具有收支持 "alg" 标头值的 JWTs 有：RS256、RS384、RS512、ES256、ES384、ES512、PS256、PS384、PS512。
取值依据 RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1 定义。
</td>
</tr>

<tr>
<td colspan="2">--oidc-username-claim string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："sub"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The OpenID claim to use as the user name. Note that claims other than
 the default ('sub') is not guaranteed to be unique and immutable. 
 This flag is experimental, please see the authentication documentation for further details.
-->
要用作用户名的 OpenID 声明。
请注意，除默认声明（"sub"）以外的其他声明不能保证是唯一且不可变的。
此标志是实验性的，请参阅身份认证文档以获取更多详细信息。
</td>
</tr>

<tr>
<td colspan="2">--oidc-username-prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If provided, all usernames will be prefixed with this value. 
If not provided, username claims other than 'email' are prefixed
 by the issuer URL to avoid clashes. To skip any prefixing, provide the value '-'.
-->
如果提供，则所有用户名都将以该值作为前缀。
如果未提供，则除 "email" 之外的用户名声明都会添加颁发者 URL 作为前缀，以避免冲突。
要略过添加前缀处理，请设置值为 "-"。
</td>
</tr>

<tr>
<td colspan="2">--peer-advertise-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If set and the UnknownVersionInteroperabilityProxy feature gate is enabled, this IP will be used by peer kube-apiservers to proxy requests to this kube-apiserver when the request cannot be handled by the peer due to version skew between the kube-apiservers. This flag is only used in clusters configured with multiple kube-apiservers for high availability.
-->
如果设置并启用了 UnknownVersionInteroperabilityProxy 特性门控，
当请求由于 kube-apiservers 之间的版本偏差而无法被处理时，
此 IP 将由对等 kube-apiserver 用于代理请求到该 kube-apiserver。
此标志仅被用于配置了多个 kube-apiserver 以实现高可用性的集群中。
</p></td>
</tr>

<tr>
<td colspan="2">--peer-advertise-port string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If set and the UnknownVersionInteroperabilityProxy feature gate is enabled, this port will be used by peer kube-apiservers to proxy requests to this kube-apiserver when the request cannot be handled by the peer due to version skew between the kube-apiservers. This flag is only used in clusters configured with multiple kube-apiservers for high availability.
-->
如果设置并且启用了 UnknownVersionInteroperabilityProxy 特性门控，
当请求由于 kube-apiservers 之间的版本偏差导致对等方无法被处理时，
此端口将由对等 kube-apiserver 用于代理请求到该 kube-apiserver。
此标志仅被用于配置了多个 kube-apiserver 以实现高可用性的集群中。
</p></td>
</tr>

<tr>
<td colspan="2">--peer-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If set and the UnknownVersionInteroperabilityProxy feature gate is enabled, this file will be used to verify serving certificates of peer kube-apiservers. This flag is only used in clusters configured with multiple kube-apiservers for high availability.
-->
如果设置并启用了 UnknownVersionInteroperabilityProxy 特性门控，
此文件将被用于验证对等 kube-apiserver 的服务证书。
此标志仅被用于配置了多个 kube-apiserver 以实现高可用性的集群中。
</p></td>
</tr>

<tr>
<td colspan="2">--permit-address-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--If true, SO_REUSEADDR will be used when binding the port. This allows binding to wildcard IPs like 0.0.0.0 and specific IPs in parallel, and it avoids waiting for the kernel to release sockets in TIME_WAIT state. [default=false]
-->
若此标志为 true，则使用 <tt>SO_REUSEADDR</tt> 来绑定端口。
这样设置可以同时绑定到用通配符表示的类似 0.0.0.0 这种 IP 地址，
以及特定的 IP 地址。也可以避免等待内核释放 <tt>TIME_WAIT</tt> 状态的套接字。[默认值=false]
</p></td>
</tr>

<tr>
<td colspan="2">--permit-port-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, SO_REUSEPORT will be used when binding the port, 
which allows more than one instance to bind on the same address and port. [default=false]
-->
如果为 true，则在绑定端口时将使用 <tt>SO_REUSEPORT</tt>，
这样多个实例可以绑定到同一地址和端口上。[默认值=false]
</td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable profiling via web interface host:port/debug/pprof/
-->
通过 Web 接口 <code>host:port/debug/pprof/</code> 启用性能分析。
</td>
</tr>

<tr>
<td colspan="2">--proxy-client-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Client certificate used to prove the identity of the aggregator or 
kube-apiserver when it must call out during a request. This includes 
proxying requests to a user api-server and calling out to webhook 
admission plugins. It is expected that this cert includes a signature 
from the CA in the --requestheader-client-ca-file flag. That CA is 
published in the 'extension-apiserver-authentication' configmap in 
the kube-system namespace. Components receiving calls from kube-aggregator 
should use that CA to perform their half of the mutual TLS verification.
-->
当必须调用外部程序以处理请求时，用于证明聚合器或者 kube-apiserver 的身份的客户端证书。
包括代理转发到用户 api-server 的请求和调用 Webhook 准入控制插件的请求。
Kubernetes 期望此证书包含来自于 --requestheader-client-ca-file 标志中所给 CA 的签名。
该 CA 在 kube-system 命名空间的 "extension-apiserver-authentication" ConfigMap 中公开。
从 kube-aggregator 收到调用的组件应该使用该 CA 进行各自的双向 TLS 验证。
</td>
</tr>

<tr>
<td colspan="2">--proxy-client-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Private key for the client certificate used to prove the identity of 
the aggregator or kube-apiserver when it must call out during a request. 
This includes proxying requests to a user api-server and calling out to 
webhook admission plugins.
-->
当必须调用外部程序来处理请求时，用来证明聚合器或者 kube-apiserver 的身份的客户端私钥。
这包括代理转发给用户 api-server 的请求和调用 Webhook 准入控制插件的请求。
</td>
</tr>

<tr>
<td colspan="2">--request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
An optional field indicating the duration a handler must keep a request 
open before timing it out. This is the default request timeout for 
requests but may be overridden by flags such as --min-request-timeout 
for specific types of requests.
-->
可选字段，指示处理程序在超时之前必须保持打开请求的持续时间。
这是请求的默认请求超时，但对于特定类型的请求，可能会被
<code>--min-request-timeout</code>等标志覆盖。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-allowed-names strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of client certificate common names to allow to provide usernames 
in headers specified by --requestheader-username-headers. If empty, 
any client certificate validated by the authorities in 
--requestheader-client-ca-file is allowed.
-->
此值为客户端证书通用名称（Common Name）的列表；表中所列的表项可以用来提供用户名，
方式是使用 <code>--requestheader-username-headers</code> 所指定的头部。
如果为空，能够通过 <code>--requestheader-client-ca-file</code> 中机构
认证的客户端证书都是被允许的。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Root certificate bundle to use to verify client certificates on 
incoming requests before trusting usernames in headers specified 
by --requestheader-username-headers. WARNING: generally do not 
depend on authorization being already done for incoming requests.
-->
在信任请求头中以 <code>--requestheader-username-headers</code> 指示的用户名之前，
用于验证接入请求中客户端证书的根证书包。
警告：一般不要假定传入请求已被授权。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-extra-headers-prefix strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request header prefixes to inspect. X-Remote-Extra- is suggested.
-->
用于查验请求头部的前缀列表。建议使用 <code>X-Remote-Extra-</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for groups. X-Remote-Group is suggested.
-->
用于查验用户组的请求头部列表。建议使用 <code>X-Remote-Group</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for usernames. X-Remote-User is common.
-->
用于查验用户名的请求头部字段列表。建议使用 <code>X-Remote-User</code>。
</td>
</tr>

<tr>
<td colspan="2">--runtime-config &lt;逗号分隔的 'key=value' 对列表&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that enable or disable built-in APIs. Supported options are:
<br/>v1=true|false for the core API group
<br/>&lt;group&gt;/&lt;version&gt;=true|false for a specific API group and version (e.g. apps/v1=true)
<br/>api/all=true|false controls all API versions
<br/>api/ga=true|false controls all API versions of the form v[0-9]+
<br/>api/beta=true|false controls all API versions of the form v[0-9]+beta[0-9]+
<br/>api/alpha=true|false controls all API versions of the form v[0-9]+alpha[0-9]+
<br/>api/legacy is deprecated, and will be removed in a future version
-->
一组启用或禁用内置 API 的键值对。支持的选项包括：
<br/>v1=true|false（针对核心 API 组）
<br/>&lt;group&gt;/&lt;version&gt;=true|false（针对特定 API 组和版本，例如：apps/v1=true） 
<br/>api/all=true|false 控制所有 API 版本
<br/>api/ga=true|false 控制所有 v[0-9]+ API 版本
<br/>api/beta=true|false 控制所有 v[0-9]+beta[0-9]+ API 版本
<br/>api/alpha=true|false 控制所有 v[0-9]+alpha[0-9]+ API 版本
<br/>api/legacy 已弃用，并将在以后的版本中删除
</td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：6443</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port on which to serve HTTPS with authentication and authorization. 
It cannot be switched off with 0.
-->
带身份认证和鉴权机制的 HTTPS 服务端口。
不能用 0 关闭。
</td>
</tr>

<tr>
<td colspan="2">--service-account-extend-token-expiration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Turns on projected service account expiration extension during token generation, 
which helps safe transition from legacy token to bound service account token feature. 
If this flag is enabled, admission injected tokens would be extended up to 
1 year to prevent unexpected failure during transition, ignoring value of service-account-max-token-expiration.
-->
在生成令牌时，启用投射服务帐户到期时间扩展，
这有助于从旧版令牌安全地过渡到绑定的服务帐户令牌功能。
如果启用此标志，则准入插件注入的令牌的过期时间将延长至 1 年，以防止过渡期间发生意外故障，
并忽略 service-account-max-token-expiration 的值。
</td>
</tr>

<tr>
<td colspan="2">--service-account-issuer strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Identifier of the service account token issuer. The issuer will assert this 
identifier in "iss" claim of issued tokens. This value is a string or URI. 
If this option is not a valid URI per the OpenID Discovery 1.0 spec, 
the ServiceAccountIssuerDiscovery feature will remain disabled, even if 
the feature gate is set to true. It is highly recommended that this value 
comply with the OpenID spec: https://openid.net/specs/openid-connect-discovery-1_0.html. 
In practice, this means that service-account-issuer must be an https URL. 
It is also highly recommended that this URL be capable of serving OpenID 
discovery documents at {service-account-issuer}/.well-known/openid-configuration.
When this flag is specified multiple times, the first is used to generate tokens
and all are used to determine which issuers are accepted.
-->
服务帐号令牌颁发者的标识符。
颁发者将在已颁发令牌的 "iss" 声明中检查此标识符。
此值为字符串或 URI。
如果根据 OpenID Discovery 1.0 规范检查此选项不是有效的 URI，则即使特性门控设置为 true，
ServiceAccountIssuerDiscovery 功能也将保持禁用状态。
强烈建议该值符合 OpenID 规范： https://openid.net/specs/openid-connect-discovery-1_0.html 。
实践中，这意味着 service-account-issuer 取值必须是 HTTPS URL。
还强烈建议此 URL 能够在 {service-account-issuer}/.well-known/openid-configuration
处提供 OpenID 发现文档。
当此值被多次指定时，第一次的值用于生成令牌，所有的值用于确定接受哪些发行人。
</td>
</tr>

<tr>
<td colspan="2">--service-account-jwks-uri string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Overrides the URI for the JSON Web Key Set in the discovery doc served at 
/.well-known/openid-configuration. This flag is useful if the discovery 
docand key set are served to relying parties from a URL other than the 
API server's external (as auto-detected or overridden with external-hostname).
-->
覆盖 <code>/.well-known/openid-configuration</code> 提供的发现文档中 JSON Web 密钥集的 URI。
如果发现文档和密钥集是通过 API 服务器外部
（而非自动检测到或被外部主机名覆盖）之外的 URL 提供给依赖方的，则此标志很有用。
</td>
</tr>

<tr>
<td colspan="2">--service-account-key-file strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing PEM-encoded x509 RSA or ECDSA private or public keys,
used to verify ServiceAccount tokens. The specified file can contain 
multiple keys, and the flag can be specified multiple times with 
different files. If unspecified, --tls-private-key-file is used. 
Must be specified when --service-account-signing-key-file is provided
-->
包含 PEM 编码的 x509 RSA 或 ECDSA 私钥或公钥的文件，用于验证 ServiceAccount 令牌。
指定的文件可以包含多个键，并且可以使用不同的文件多次指定标志。
如果未指定，则使用 <code>--tls-private-key-file</code>。
提供 <code>--service-account-signing-key-file</code> 时必须指定。
</td>
</tr>

<tr>
<td colspan="2">--service-account-lookup&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, validate ServiceAccount tokens exist in etcd as part of authentication.
-->
如果为 true，则在身份认证时验证 etcd 中是否存在 ServiceAccount 令牌。
</td>
</tr>

<tr>
<td colspan="2">--service-account-max-token-expiration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum validity duration of a token created by the service account token issuer. 
If an otherwise valid TokenRequest with a validity duration larger than this value is requested, 
a token will be issued with a validity duration of this value.
-->
服务帐户令牌发布者创建的令牌的最长有效期。
如果请求有效期大于此值的有效令牌请求，将使用此值的有效期颁发令牌。
</td>
</tr>

<tr>
<td colspan="2">--service-account-signing-key-file string</td>
</tr>
<tr>

<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the file that contains the current private key of the service account token issuer. 
The issuer will sign issued ID tokens with this private key. 
-->
包含服务帐户令牌颁发者当前私钥的文件的路径。
颁发者将使用此私钥签署所颁发的 ID 令牌。
</td>
</tr>

<tr>
<td colspan="2">--service-cluster-ip-range string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A CIDR notation IP range from which to assign service cluster IPs. 
This must not overlap with any IP ranges assigned to nodes or pods.
Max of two dual-stack CIDRs is allowed.
-->
CIDR 表示的 IP 范围用来为服务分配集群 IP。
此地址不得与指定给节点或 Pod 的任何 IP 范围重叠。
最多允许两个双栈 CIDR。
</td>
</tr>

<tr>
<td colspan="2">--service-node-port-range &lt;形式为 'N1-N2' 的字符串&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：30000-32767</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>A port range to reserve for services with NodePort visibility.  This must not overlap with the ephemeral port range on nodes.  Example: '30000-32767'. Inclusive at both ends of the range.</p>
-->
<p>保留给具有 NodePort 可见性的服务的端口范围。
不得与节点上的临时端口范围重叠。
例如："30000-32767"。范围的两端都包括在内。</p>
</td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The previous version for which you want to show hidden metrics. Only the 
previous minor version is meaningful, other values will not be allowed. 
The format is &lt;major&gt;.&lt;minor&gt;, e.g.: '1.16'. The purpose of 
this format is make sure you have the opportunity to notice if the next
release hides additional metrics, rather than being surprised when they 
are permanently removed in the release after that.
-->
你要显示隐藏指标的先前版本。仅先前的次要版本有意义，不允许其他值。
格式为 &lt;major&gt;.&lt;minor&gt;，例如："1.16"。
这种格式的目的是确保你有机会注意到下一个版本是否隐藏了其他指标，
而不是在此之后将它们从发行版中永久删除时感到惊讶。
</td>
</tr>

<tr>
<td colspan="2">--shutdown-delay-duration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Time to delay the termination. During that time the server keeps serving requests normally. 
The endpoints /healthz and /livez will return success, but /readyz immediately returns failure. 
Graceful termination starts after this delay has elapsed. 
This can be used to allow load balancer to stop sending traffic to this server.
-->
延迟终止时间。在此期间，服务器将继续正常处理请求。
端点 /healthz 和 /livez 将返回成功，但是 /readyz 立即返回失败。
在此延迟过去之后，将开始正常终止。
这可用于允许负载均衡器停止向该服务器发送流量。
</td>
</tr>

<tr>
<td colspan="2">--shutdown-send-retry-after</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true the HTTP Server will continue listening until all non long running request(s) in flight have been drained, 
during this window all incoming requests will be rejected with a status code 429 and a 'Retry-After' response header, 
in addition 'Connection: close' response header is set in order to tear down the TCP connection when idle.
-->
值为 true 表示 HTTP 服务器将继续监听直到耗尽所有非长时间运行的请求，
在此期间，所有传入请求将被拒绝，状态码为 429，响应头为 &quot;Retry-After&quot;，
此外，设置 &quot;Connection: close&quot; 响应头是为了在空闲时断开 TCP 链接。
</td>
</tr>

<tr>
<td colspan="2">--shutdown-watch-termination-grace-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
This option, if set, represents the maximum amount of grace period the apiserver will wait for active watch request(s) to drain during the graceful server shutdown window.
-->
此选项如果被设置了，则表示 API 服务器体面关闭服务器窗口内，等待活跃的监听请求耗尽的最长宽限期。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-backend string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The storage backend for persistence. Options: 'etcd3' (default).
-->
持久化存储后端。选项："etcd3"（默认）。
</td>
</tr>

<tr>
<td colspan="2">--storage-initialization-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Maximum amount of time to wait for storage initialization before declaring apiserver ready. Defaults to 1m.
-->
声明 apiserver 就绪之前等待存储初始化的最长时间。默认值为 1m。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-media-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
The media type to use to store objects in storage. Some resources or storage backends may only support a specific media type and will ignore this setting. Supported media types: [application/json, application/yaml, application/vnd.kubernetes.protobuf]
-->
<p>
用于在存储中存储对象的媒体类型。某些资源或存储后端可能仅支持特定的媒体类型，并且将忽略此设置。
支持的媒体类型：[application/json, application/yaml, application/vnd.kubernetes.protobuf]
</p>
</td>
</tr>

<tr>
<td colspan="2">--strict-transport-security-directives strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
List of directives for HSTS, comma separated. If this list is empty, then HSTS directives will not be added. Example: 'max-age=31536000,includeSubDomains,preload'
-->
为 HSTS 所设置的指令列表，用逗号分隔。
如果此列表为空，则不会添加 HSTS 指令。
例如：'max-age=31536000,includeSubDomains,preload'
</p></td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing the default x509 Certificate for HTTPS. 
(CA cert, if any, concatenated after server cert).
If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, 
a self-signed certificate and key are generated for 
the public address and saved to the directory specified by --cert-dir.
-->
包含用于 HTTPS 的默认 x509 证书的文件。（CA 证书（如果有）在服务器证书之后并置）。
如果启用了 HTTPS 服务，并且未提供 <code>--tls-cert-file</code> 和
<code>--tls-private-key-file</code>，
为公共地址生成一个自签名证书和密钥，并将其保存到 <code>--cert-dir</code> 指定的目录中。
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of cipher suites for the server. 
If omitted, the default Go cipher suites will be used. 
<br/>Preferred values:
TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, 
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256.<br/>
Insecure values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384, TLS_RSA_WITH_RC4_128_SHA.
-->
服务器的密码套件的列表，以逗号分隔。如果省略，将使用默认的 Go 密码套件。
<br/>首选值：
TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384、TLS_CHACHA20_POLY1305_SHA256、TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA、
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384、TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256、TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256。<br/>
不安全的值有：
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_ECDSA_WITH_RC4_128_SHA、TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_RSA_WITH_RC4_128_SHA、TLS_RSA_WITH_3DES_EDE_CBC_SHA、TLS_RSA_WITH_AES_128_CBC_SHA、TLS_RSA_WITH_AES_128_CBC_SHA256、TLS_RSA_WITH_AES_128_GCM_SHA256、TLS_RSA_WITH_AES_256_CBC_SHA、TLS_RSA_WITH_AES_256_GCM_SHA384、TLS_RSA_WITH_RC4_128_SHA。
</td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum TLS version supported. Possible values: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13
-->
支持的最低 TLS 版本。可能的值：VersionTLS10，VersionTLS11，VersionTLS12，VersionTLS13
</td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing the default x509 private key matching --tls-cert-file.
-->
包含匹配 <code>--tls-cert-file</code> 的 x509 证书私钥的文件。
</td>
</tr>

<tr>
<td colspan="2">--tls-sni-cert-key string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A pair of x509 certificate and private key file paths, optionally 
suffixed with a list of domain patterns which are fully qualified 
domain names, possibly with prefixed wildcard segments. The domain 
patterns also allow IP addresses, but IPs should only be used if 
the apiserver has visibility to the IP address requested by a client. 
If no domain patterns are provided, the names of the certificate are 
extracted. Non-wildcard matches trump over wildcard matches, explicit
domain patterns trump over extracted names. For multiple key/certificate 
pairs, use the --tls-sni-cert-key multiple times. Examples: 
"example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com".
-->
一对 x509 证书和私钥文件路径，（可选）后缀为全限定域名的域名模式列表，可以使用带有通配符的前缀。
域模式也允许使用 IP 地址，但仅当 apiserver 对客户端请求的IP地址具有可见性时，才应使用 IP。
如果未提供域模式，则提取证书的名称。
非通配符匹配优先于通配符匹配，显式域模式优先于提取出的名称。
对于多个密钥/证书对，请多次使用 <code>--tls-sni-cert-key</code>。
示例："example.crt,example.key" 或 "foo.crt,foo.key:\*.foo.com,foo.com"。
</td>
</tr>

<tr>
<td colspan="2">--token-auth-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, the file that will be used to secure the secure port of the API server via token authentication.
-->
如果设置该值，这个文件将被用于通过令牌认证来保护 API 服务的安全端口。
</td>
</tr>

<tr>
<td colspan="2">--tracing-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File with apiserver tracing configuration.
-->
包含 API 服务器跟踪配置的文件。
</td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
number for the log level verbosity
-->
日志级别详细程度的数字。
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version
-->
--version, --version=raw 打印版本信息并退出；
--version=vX.Y.Z... 设置报告的版本
</p></td>
</tr>

<tr>
<td colspan="2">--vmodule pattern=N,...</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
comma-separated list of pattern=N settings for file-filtered logging
(only works for text log format)
-->
以逗号分隔的 <code>pattern=N</code> 设置列表，用于文件过滤的日志记录（仅适用于 text 日志格式）。
</td>
</tr>

<tr>
<td colspan="2">--watch-cache&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable watch caching in the apiserver
-->
在 API 服务器中启用监视缓存。
</td>
</tr>

<tr>
<td colspan="2">--watch-cache-sizes strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Watch cache size settings for some resources (pods, nodes, etc.), comma separated. The individual setting format: resource[.group]#size, where resource is lowercase plural (no version), group is omitted for resources of apiVersion v1 (the legacy core API) and included for others, and size is a number. This option is only meaningful for resources built into the apiserver, not ones defined by CRDs or aggregated from external servers, and is only consulted if the watch-cache is enabled. The only meaningful size setting to supply here is zero, which means to disable watch caching for the associated resource; all non-zero values are equivalent and mean to not disable watch caching for that resource
-->
某些资源（Pod、Node 等）的监视缓存大小设置，以逗号分隔。
每个资源对应的设置格式：<code>resource[.group]#size</code>，其中
<code>resource</code> 为小写复数（无版本），
对于 apiVersion v1（旧版核心 API）的资源要省略 <code>group</code>，
对其它资源要给出 <code>group</code>；<code>size 为一个数字</code>。
此选项仅对 API 服务器中的内置资源生效，对 CRD 定义的资源或从外部服务器接入的资源无效。
启用 <code>watch-cache</code> 时仅查询此选项。
这里能生效的 size 设置只有 0，意味着禁用关联资源的 <code>watch-cache</code>。
所有的非零值都等效，意味着不禁用该资源的<code>watch-cache</code>。
</p>
</td>
</tr>

</tbody>
</table>
