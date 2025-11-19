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
Kubernetes API 伺服器驗證並設定 API 對象的數據，
這些對象包括 pods、services、replicationcontrollers 等。
API 伺服器爲 REST 操作提供服務，併爲叢集的共享狀態提供前端，
所有其他組件都通過該前端進行交互。

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
<p>包含准入控制設定的文件。</p>
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
向叢集成員通知 apiserver 消息的 IP 地址。
這個地址必須能夠被叢集中其他成員訪問。
如果 IP 地址爲空，將會使用 --bind-address，
如果未指定 --bind-address，將會使用主機的默認接口地址。
</p>
</td>
</tr>

<tr>
<td colspan="2">--aggregator-reject-forwarding-redirect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
Aggregator reject forwarding redirect response back to client.
-->
<p>聚合器拒絕將重定向響應轉發回客戶端。</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The map from metric-label to value allow-list of this label. The key's format is &lt;MetricName&gt;,&lt;LabelName&gt;. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.
-->
允許使用的指標標籤到指標值的映射列表。鍵的格式爲 &lt;MetricName&gt;,&lt;LabelName&gt;.
值的格式爲 &lt;allowed_value&gt;,&lt;allowed_value&gt;...。
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
包含允許列表映射的清單文件的路徑。此文件的格式與 <code>--allow-metric-labels</code> 相同。
請注意，<code>--allow-metric-labels</code> 標誌將覆蓋清單文件。
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
如果爲 true，將允許特權容器。[默認值=false]
</td>
</tr>

<tr>
<td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables anonymous requests to the secure port of the API server. 
Requests that are not rejected by another authentication method 
are treated as anonymous requests. Anonymous requests have a 
username of system:anonymous, and a group name of system:unauthenticated.
-->
啓用針對 API 伺服器的安全端口的匿名請求。
未被其他身份認證方法拒絕的請求被當做匿名請求。
匿名請求的使用者名爲 <code>system:anonymous</code>，
使用者組名爲 </code>system:unauthenticated</code>。
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
API 的標識符。
服務帳戶令牌驗證者將驗證針對 API 使用的令牌是否已綁定到這些受衆中的至少一個。
如果設定了 <code>--service-account-issuer</code> 標誌，但未設定此標誌，
則此字段默認爲包含發佈者 URL 的單個元素列表。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The size of the buffer to store events before batching and writing. Only used in batch mode.
-->
批處理和寫入事件之前用於緩存事件的緩衝區大小。
僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：1</td>
</tr><tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum size of a batch. Only used in batch mode.
-->
每個批次的最大大小。僅在批處理模式下使用。
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
強制寫入尚未達到最大大小的批次之前要等待的時間。
僅在批處理模式下使用。
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
如果之前未使用 ThrottleQPS，則爲同時發送的最大請求數。
僅在批處理模式下使用。
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
是否啓用了批量限制。僅在批處理模式下使用。
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
每秒的最大平均批次數。僅在批處理模式下使用。
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
若設置了此標誌，則被輪換的日誌文件會使用 gzip 壓縮。
</td>

</tr>

<tr>
<td colspan="2">--audit-log-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："json" </td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Format of saved audits. &quot;legacy&quot; indicates 1-line text format for each event. &quot;json&quot; indicates structured json format. Known formats are legacy,json.
-->
所保存的審計格式。
"legacy" 表示每行一個事件的文本格式。"json" 表示結構化的 JSON 格式。
已知格式爲 legacy，json。
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
根據文件名中編碼的時間戳保留舊審計日誌文件的最大天數。
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
要保留的舊的審計日誌文件個數上限。
將值設置爲 0 表示對文件個數沒有限制。
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
輪換之前，審計日誌文件的最大大小（以兆字節爲單位）。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："blocking"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Strategy for sending audit events. Blocking indicates sending events should block server responses. 
Batch causes the backend to buffer and write events asynchronously. 
Known modes are batch,blocking,blocking-strict.
-->
用來發送審計事件的策略。
阻塞（blocking）表示發送事件應阻止伺服器響應。
批處理（batch）會導致後端異步緩衝和寫入事件。
已知的模式是批處理（batch），阻塞（blocking），嚴格阻塞（blocking-strict）。
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
如果設置，則所有到達 API 伺服器的請求都將記錄到該文件中。
"-" 表示標準輸出。
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
是否啓用事件和批次截斷。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10485760</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of the batch sent to the underlying backend. Actual serialized size can be 
several hundreds of bytes greater. If a batch exceeds this limit, it is split into 
several batches of smaller size.
-->
發送到下層後端的每批次的最大數據量。
實際的序列化大小可能會增加數百個字節。
如果一個批次超出此限制，則將其分成幾個較小的批次。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：102400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of the audit event sent to the underlying backend. If the size of an event
is greater than this number, first request and response are removed, and if this doesn't 
reduce the size enough, event is discarded.
-->
發送到下層後端的每批次的最大數據量。
如果事件的大小大於此數字，則將刪除第一個請求和響應；
如果這樣做沒有減小足夠大的程度，則將丟棄事件。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："audit.k8s.io/v1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
API group and version used for serializing audit events written to log.
-->
用於對寫入日誌的審計事件執行序列化的 API 組和版本。
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
定義審計策略設定的文件的路徑。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The size of the buffer to store events before batching and writing. Only used in batch mode.
-->
劃分批次和寫入之前用於存儲事件的緩衝區大小。
僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum size of a batch. Only used in batch mode.
-->
批次的最大大小。
僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-max-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The amount of time to wait before force writing the batch that hadn't reached the max size. 
Only used in batch mode.
-->
強制寫入尚未達到最大大小的批處理之前要等待的時間。
僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-burst int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：15</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. 
Only used in batch mode.
-->
如果之前未使用 ThrottleQPS，同時發送的最大請求數。
僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-enable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether batching throttling is enabled. Only used in batch mode.
-->
是否啓用了批量限制。僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum average number of batches per second. Only used in batch mode.
-->
每秒的最大平均批次數。僅在批處理模式下使用。
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
定義審計 webhook 設定的 kubeconfig 格式文件的路徑。
</tr>

<tr>
<td colspan="2">--audit-webhook-initial-backoff duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The amount of time to wait before retrying the first failed request.
-->
重試第一個失敗的請求之前要等待的時間。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："batch"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Strategy for sending audit events. Blocking indicates sending events should block server responses. 
Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking,blocking-strict.
-->
發送審計事件的策略。
阻止（Blocking）表示發送事件應阻止伺服器響應。
批處理（Batch）導致後端異步緩衝和寫入事件。
已知的模式是批處理（batch），阻塞（blocking），嚴格阻塞（blocking-strict）。
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
是否啓用事件和批處理截斷。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：10485760</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
Maximum size of the batch sent to the underlying backend. Actual serialized size can be 
several hundreds of bytes greater. If a batch exceeds this limit, it is split into 
several batches of smaller size.
-->
發送到下層後端的批次的最大數據量。
實際的序列化大小可能會增加數百個字節。
如果一個批次超出此限制，則將其分成幾個較小的批次。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：102400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of the audit event sent to the underlying backend. If the size of an event
is greater than this number, first request and response are removed, and if this doesn't
reduce the size enough, event is discarded.
-->
發送到下層後端的批次的最大數據量。
如果事件的大小大於此數字，則將刪除第一個請求和響應；
如果事件和事件的大小沒有減小到一定幅度，則將丟棄事件。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："audit.k8s.io/v1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
API group and version used for serializing audit events written to webhook.
-->
用於序列化寫入 Webhook 的審計事件的 API 組和版本。
</td>
</tr>

<tr>
<td colspan="2">--authentication-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
File with Authentication Configuration to configure the JWT Token authenticator or the anonymous authenticator. Requires the StructuredAuthenticationConfiguration feature gate. This flag is mutually exclusive with the --oidc-* flags if the file configures the JWT Token authenticator. This flag is mutually exclusive with --anonymous-auth if the file configures the Anonymous authenticator.
-->
用於設定 JWT 令牌身份認證模塊或匿名身份認證模塊的身份認證設定文件。
你需要啓用 <code>StructuredAuthenticationConfiguration</code> 特性門控。
如果在設定文件中設定了 JWT 令牌認證模塊，此標誌與 <code>oidc-*</code> 標誌互斥。
如果在設定文件中設定了匿名身份認證模塊，此標誌與 <code>--anonymous-auth</code> 標誌互斥。
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
對來自 Webhook 令牌身份認證模塊的響應的緩存時間。
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
包含 Webhook 設定的 kubeconfig 格式文件，用於進行令牌認證。
API 伺服器將查詢遠程服務，以對持有者令牌進行身份認證。
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："v1beta1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The API version of the authentication.k8s.io TokenReview to send to and expect from the webhook.
-->
與 Webhook 之間交換 authentication.k8s.io TokenReview 時使用的 API 版本。
</td>
</tr>

<tr>
<td colspan="2">--authorization-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
File with Authorization Configuration to configure the authorizer chain. Requires feature gate StructuredAuthorizationConfiguration. This flag is mutually exclusive with the other --authorization-mode and --authorization-webhook-* flags.
-->
用於設定鑑權鏈的鑑權設定文件。
需要啓用 <code>StructuredAuthorizationConfiguration</code> 特性門控。
此標誌與其他 <code>--authorization-mode</code> 和 <code>--authorization-webhook-*</code> 標誌互斥。
</p></td>
</tr>

<tr>
<td colspan="2">--authorization-mode strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："AlwaysAllow"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Ordered list of plug-ins to do authorization on secure port. Comma-delimited list of: 
AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node.
-->
在安全端口上進行鑑權的插件的順序列表。
逗號分隔的列表：AlwaysAllow、AlwaysDeny、ABAC、Webhook、RBAC、Node。
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
包含鑑權策略的文件，其內容爲分行 JSON 格式，
在安全端口上與 --authorization-mode=ABAC 一起使用。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer.
-->
對來自 Webhook 鑑權組件的 “授權（authorized）” 響應的緩存時間。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer.
-->
對來自 Webhook 鑑權模塊的 “未授權（unauthorized）” 響應的緩存時間。
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
包含 Webhook 設定的文件，其格式爲 kubeconfig，
與 --authorization-mode=Webhook 一起使用。
API 伺服器將查詢遠程服務，以對 API 伺服器的安全端口的訪問執行鑑權。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："v1beta1"</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The API version of the authorization.k8s.io SubjectAccessReview to send to and expect from the webhook.
-->
與 Webhook 之間交換 authorization.k8s.io SubjectAccessReview 時使用的 API 版本。
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："0.0.0.0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces and IP address families will be used.
-->
用來監聽 <code>--secure-port</code> 端口的 IP 地址。
叢集的其餘部分以及 CLI/web 客戶端必須可以訪問所關聯的接口。
如果爲空白或未指定地址（<tt>0.0.0.0</tt> 或 <tt>::</tt>），則將使用所有接口和 IP 地址簇。
</td>
</tr>

<tr>
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："/var/run/kubernetes"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The directory where the TLS certs are located. If --tls-cert-file and 
--tls-private-key-file are provided, this flag will be ignored.
-->
TLS 證書所在的目錄。
如果提供了 <code>--tls-cert-file</code> 和 <code>--tls-private-key-file</code>
標誌值，則將忽略此標誌。
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
如果已設置，則使用與客戶端證書的 CommonName 對應的標識對任何出示由
client-ca 文件中的授權機構之一簽名的客戶端證書的請求進行身份認證。
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
如果啓用了性能分析，則啓用阻塞分析。
</td>
</tr>

<tr>
<td colspan="2">--coordinated-leadership-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 15s-->默認值：15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The duration of the lease used for Coordinated Leader Election.
-->
協調領導者選舉所用租約的持續時間。
</p></td>
</tr>

<tr>
<td colspan="2">--coordinated-leadership-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10s-->默認值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The deadline for renewing a coordinated leader election lease.
-->
協調領導者選舉租約續期的截止時間。
</p></td>
</tr>

<tr>
<td colspan="2">--coordinated-leadership-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 2s-->默認值：2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The period for retrying to renew a coordinated leader election lease.
-->
重試協調領導者選舉租約續期的時間間隔。
</p></td>
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
CORS 允許的來源清單，以逗號分隔。
允許的來源可以是支持子域匹配的正則表達式。
如果此列表爲空，則不會啓用 CORS。
請確保每個表達式與整個主機名相匹配，方法是用'^'錨定開始或包括'//'前綴，同時用'$'錨定結束或包括':'端口分隔符後綴。
有效表達式的例子是'//example.com(:|$)'和'^https://example.com(:|$)'。
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
使用位於給定路徑的、未受保護的（無身份認證或鑑權的）UNIX 域套接字執行性能分析。
</p></td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: -->默認值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.
-->
對污點 NotReady:NoExecute 的容忍時長（以秒計）。
默認情況下這一容忍度會被添加到尚未具有此容忍度的每個 pod 中。
</td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Indicates the tolerationSeconds of the toleration for unreachable:NoExecute 
that is added by default to every pod that does not already have such a toleration.
-->
對污點 Unreachable:NoExecute 的容忍時長（以秒計）
默認情況下這一容忍度會被添加到尚未具有此容忍度的每個 pod 中。
</td>
</tr>

<tr>
<td colspan="2">--delete-collection-workers int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of workers spawned for DeleteCollection call. These are used to speed up namespace cleanup.
-->
爲 DeleteCollection 調用而產生的工作線程數。
這些用於加速名字空間清理。
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
admission plugins that should be disabled although they are in the default enabled plugins list (NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, PodSecurity, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection, PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning, ClusterTrustBundleAttest, CertificateSubjectRestriction, DefaultIngressClass, PodTopologyLabels, MutatingAdmissionPolicy, MutatingAdmissionWebhook, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook, ResourceQuota). Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, ClusterTrustBundleAttest, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionPolicy, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PodNodeSelector, PodSecurity, PodTolerationRestriction, PodTopologyLabels, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.
-->
<p>
儘管位於默認啓用的插件列表中，仍須被禁用的准入插件（NamespaceLifecycle、LimitRanger、ServiceAccount、
TaintNodesByCondition、PodSecurity、Priority、DefaultTolerationSeconds、DefaultStorageClass、
StorageObjectInUseProtection、PersistentVolumeClaimResize、RuntimeClass、CertificateApproval、
CertificateSigning、ClusterTrustBundleAttest、CertificateSubjectRestriction、DefaultIngressClass、
PodTopologyLabels、MutatingAdmissionPolicy、MutatingAdmissionWebhook、ValidatingAdmissionPolicy、
ValidatingAdmissionWebhook、ResourceQuota）。
取值爲逗號分隔的准入插件列表：AlwaysAdmit、AlwaysDeny、AlwaysPullImages、CertificateApproval、
CertificateSigning、CertificateSubjectRestriction、ClusterTrustBundleAttest、DefaultIngressClass、
DefaultStorageClass、DefaultTolerationSeconds、DenyServiceExternalIPs、EventRateLimit、
ExtendedResourceToleration、ImagePolicyWebhook、LimitPodHardAntiAffinityTopology、LimitRanger、
MutatingAdmissionPolicy、MutatingAdmissionWebhook、NamespaceAutoProvision、NamespaceExists、
NamespaceLifecycle、NodeRestriction、OwnerReferencesPermissionEnforcement、PersistentVolumeClaimResize、
PodNodeSelector、PodSecurity、PodTolerationRestriction、PodTopologyLabels、Priority、ResourceQuota、
RuntimeClass、ServiceAccount、StorageObjectInUseProtection、TaintNodesByCondition、
ValidatingAdmissionPolicy、ValidatingAdmissionWebhook。
該標誌中插件的順序無關緊要。
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
如果爲 true，HTTP2 服務將被禁用 [默認值=false]
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
此標誌爲行爲不正確的度量指標提供一種處理方案。
你必須提供完全限定的指標名稱才能將其禁止。
聲明：禁用度量值的行爲優先於顯示已隱藏的度量值。
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
帶有 API 伺服器出站選擇器設定的文件。
</td>
</tr>

<tr>
<td colspan="2">--emulated-version strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The versions different components emulate their capabilities (APIs, features, ...) of.<br/>If set, the component will emulate the behavior of this version instead of the underlying binary version.<br/>Version format could only be major.minor, for example: '--emulated-version=wardle=1.2,kube=1.31'.<br/>Options are: kube=1.31..1.34(default:1.34)<br/>If the component is not specified, defaults to &quot;kube&quot;
-->
不同組件所模擬的能力（API、特性等）的版本。<br/>
如果設置了該選項，組件將模擬此版本的行爲，而不是下層可執行文件版本的行爲。<br/>
版本格式只能是 major.minor，例如 “--emulated-version=wardle=1.2,kube=1.31”。
選項包括：<br/>kube=1.31..1.34（默認 1.34）。如果組件未被指定，默認爲 “kube”。
</p></td>
</tr>

<tr>
<td colspan="2">--emulation-forward-compatible</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, for any beta+ APIs enabled by default or by --runtime-config at the emulation version, their future versions with higher priority/stability will be auto enabled even if they introduced after the emulation version. Can only be set to true if the emulation version is lower than the binary version.
-->
如果爲 true，對於在仿真版本中默認啓用或通過 --runtime-config 啓用的任何處於 Beta+ 階段的 API，
即使它們是在仿真版本之後推出的，其具有更高優先級/穩定性的未來版本也將自動被啓用。
僅當仿真版本低於二進制版本時，纔可將其設置爲 true。
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
admission plugins that should be enabled in addition to default enabled ones (NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, PodSecurity, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection, PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning, ClusterTrustBundleAttest, CertificateSubjectRestriction, DefaultIngressClass, PodTopologyLabels, MutatingAdmissionPolicy, MutatingAdmissionWebhook, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook, ResourceQuota). Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, ClusterTrustBundleAttest, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionPolicy, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PodNodeSelector, PodSecurity, PodTolerationRestriction, PodTopologyLabels, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.
-->
<p>
除了默認啓用的插件（NamespaceLifecycle、LimitRanger、ServiceAccount、TaintNodesByCondition、PodSecurity、
Priority、DefaultTolerationSeconds、DefaultStorageClass、StorageObjectInUseProtection、PersistentVolumeClaimResize、
RuntimeClass、CertificateApproval、CertificateSigning、ClusterTrustBundleAttest、CertificateSubjectRestriction、
DefaultIngressClass、PodTopologyLabels、MutatingAdmissionPolicy、MutatingAdmissionWebhook、ValidatingAdmissionPolicy、
ValidatingAdmissionWebhook、ResourceQuota）之外要啓用的准入插件。
取值爲逗號分隔的准入插件列表：AlwaysAdmit、AlwaysDeny、AlwaysPullImages、CertificateApproval、CertificateSigning、
CertificateSubjectRestriction、ClusterTrustBundleAttest、DefaultIngressClass、DefaultStorageClass、
DefaultTolerationSeconds、DenyServiceExternalIPs、EventRateLimit、ExtendedResourceToleration、
ImagePolicyWebhook、LimitPodHardAntiAffinityTopology、LimitRanger、MutatingAdmissionPolicy、
MutatingAdmissionWebhook、NamespaceAutoProvision、NamespaceExists、NamespaceLifecycle、
NodeRestriction、OwnerReferencesPermissionEnforcement、PersistentVolumeClaimResize、
PodNodeSelector、PodSecurity、PodTolerationRestriction、PodTopologyLabels、Priority、
ResourceQuota、RuntimeClass、ServiceAccount、StorageObjectInUseProtection、
TaintNodesByCondition、ValidatingAdmissionPolicy、ValidatingAdmissionWebhook。
該標誌中插件的順序無關緊要。
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
允許聚合器將請求路由到端點 IP 而非叢集 IP。
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
啓用以允許將 "kube-system" 名字空間中類型爲 "bootstrap.kubernetes.io/token"
的 Secret 用於 TLS 引導身份認證。
</td>
</tr>

<tr>
<td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager.
-->
啓用通用垃圾收集器。必須與 kube-controller-manager 的相應標誌同步。
</td>
</tr>

<tr>
<td colspan="2">--enable-priority-and-fairness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, replace the max-in-flight handler with an enhanced one that queues and dispatches with priority and fairness
-->
如果爲 true，則使用增強的處理程序替換 max-in-flight 處理程序，
以便根據優先級和公平性完成排隊和調度。
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
包含加密提供程序設定信息的文件，用在 etcd 中所存儲的 Secret 上。
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
確定由 --encryption-provider-config 設置的文件是否應在磁盤內容更改時自動重新加載。
將此標誌設置爲 true 將禁用通過 API 伺服器 healthz 端點來唯一地標識不同 KMS 插件的能力。
</p>
</td>
</tr>

<tr>
<td colspan="2">--endpoint-reconciler-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："lease"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use an endpoint reconciler (master-count, lease, none) master-count is deprecated, and will be removed in a future version.
-->
使用端點協調器（<code>master-count</code>、<code>lease</code> 或 <code>none</code>）。
<code>master-count</code> 已棄用，並將在未來版本中刪除。
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
用於保護 etcd 通信的 SSL 證書頒發機構文件。
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
用於保護 etcd 通信的 SSL 證書文件。
</td>
</tr>

<tr>
<td colspan="2">--etcd-compaction-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval of compaction requests. If 0, the compaction request from apiserver is disabled.
-->
壓縮請求的間隔。
如果爲0，則禁用來自 API 伺服器的壓縮請求。
</td>
</tr>

<tr>
<td colspan="2">--etcd-count-metric-poll-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Frequency of polling etcd for number of resources per type. 0 disables the metric collection.
-->
針對每種類型的資源數量輪詢 etcd 的頻率。
0 值表示禁用度量值收集。
</td>
</tr>

<tr>
<td colspan="2">--etcd-db-metric-poll-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval of requests to poll etcd and update metric. 0 disables the metric collection
-->
輪詢 etcd 和更新度量值的請求間隔。0 值表示禁用度量值收集。
</td>
</tr>

<tr>
<td colspan="2">--etcd-healthcheck-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:—->默認值：2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The timeout to use when checking etcd health.
-->
檢查 etcd 健康狀況時使用的超時時長。
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
用於保護 etcd 通信的 SSL 密鑰文件。
</td>
</tr>

<tr>
<td colspan="2">--etcd-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："/registry"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The prefix to prepend to all resource paths in etcd.
-->
要在 etcd 中所有資源路徑之前添加的前綴。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--etcd-readycheck-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s
-->
--etcd-readycheck-timeout 時長&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值: 2s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The timeout to use when checking etcd readiness
-->
檢查 etcd 是否就緒時使用的超時</p></td>
</tr>

<tr>
<td colspan="2">--etcd-servers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of etcd servers to connect with (scheme://ip:port), comma separated.
-->
要連接的 etcd 伺服器列表（<code>scheme://ip:port</code>），以逗號分隔。
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
e.g. &quot;/pods#http://etcd4:2379;http://etcd5:2379,/events#http://etcd6:2379&quot;
-->
etcd 伺服器針對每個資源的重載設置，以逗號分隔。
單個替代格式：組/資源#伺服器（group/resource#servers），
其中伺服器是 URL，以分號分隔。
注意，此選項僅適用於編譯進此伺服器二進制文件的資源。
例如 "/pods#http://etcd4:2379;http://etcd5:2379,/events#http://etcd6:2379"
</td>
</tr>

<tr>
<td colspan="2">--event-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：1h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Amount of time to retain events.
-->
事件的保留時長。
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
爲此主機生成外部化 UR L時要使用的主機名（例如 Swagger API 文檔或 OpenID 發現）。
</td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;
<!--
comma-separated 'key=True|False' pairs
-->
逗號分隔的 'key=True|False' 鍵值對&gt;</td>
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
kube:APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
kube:AllAlpha=true|false (ALPHA - default=false)<br/>
kube:AllBeta=true|false (BETA - default=false)<br/>
kube:AllowParsingUserUIDFromCertAuth=true|false (BETA - default=true)<br/>
kube:AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
kube:CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
kube:CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
kube:ClearingNominatedNodeNameAfterBinding=true|false (ALPHA - default=false)<br/>
kube:ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
kube:ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
kube:CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
kube:ClusterTrustBundle=true|false (BETA - default=false)<br/>
kube:ClusterTrustBundleProjection=true|false (BETA - default=false)<br/>
kube:ComponentFlagz=true|false (ALPHA - default=false)<br/>
kube:ComponentStatusz=true|false (ALPHA - default=false)<br/>
kube:ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
kube:ContainerCheckpoint=true|false (BETA - default=true)<br/>
kube:ContainerRestartRules=true|false (ALPHA - default=false)<br/>
kube:ContainerStopSignals=true|false (ALPHA - default=false)<br/>
kube:ContextualLogging=true|false (BETA - default=true)<br/>
kube:CoordinatedLeaderElection=true|false (BETA - default=false)<br/>
kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
kube:DRAAdminAccess=true|false (BETA - default=true)<br/>
kube:DRAConsumableCapacity=true|false (ALPHA - default=false)<br/>
kube:DRADeviceBindingConditions=true|false (ALPHA - default=false)<br/>
kube:DRADeviceTaints=true|false (ALPHA - default=false)<br/>
kube:DRAExtendedResource=true|false (ALPHA - default=false)<br/>
kube:DRAPartitionableDevices=true|false (ALPHA - default=false)<br/>
kube:DRAPrioritizedList=true|false (BETA - default=true)<br/>
kube:DRAResourceClaimDeviceStatus=true|false (BETA - default=true)<br/>
kube:DRASchedulerFilterTimeout=true|false (BETA - default=true)<br/>
kube:DeclarativeValidation=true|false (BETA - default=true)<br/>
kube:DeclarativeValidationTakeover=true|false (BETA - default=false)<br/>
kube:DeploymentReplicaSetTerminatingReplicas=true|false (ALPHA - default=false)<br/>
kube:DetectCacheInconsistency=true|false (BETA - default=true)<br/>
kube:DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - default=true)<br/>
kube:EnvFiles=true|false (ALPHA - default=false)<br/>
kube:EventedPLEG=true|false (ALPHA - default=false)<br/>
kube:ExternalServiceAccountTokenSigner=true|false (BETA - default=true)<br/>
kube:GracefulNodeShutdown=true|false (BETA - default=true)<br/>
kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
kube:HPAConfigurableTolerance=true|false (ALPHA - default=false)<br/>
kube:HPAScaleToZero=true|false (ALPHA - default=false)<br/>
kube:HostnameOverride=true|false (ALPHA - default=false)<br/>
kube:ImageMaximumGCAge=true|false (BETA - default=true)<br/>
kube:ImageVolume=true|false (BETA - default=false)<br/>
kube:InOrderInformers=true|false (BETA - default=true)<br/>
kube:InPlacePodVerticalScaling=true|false (BETA - default=true)<br/>
kube:InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
kube:InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - default=false)<br/>
kube:InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
kube:InformerResourceVersion=true|false (ALPHA - default=false)<br/>
kube:JobManagedBy=true|false (BETA - default=true)<br/>
kube:KubeletCrashLoopBackOffMax=true|false (ALPHA - default=false)<br/>
kube:KubeletEnsureSecretPulledImages=true|false (ALPHA - default=false)<br/>
kube:KubeletFineGrainedAuthz=true|false (BETA - default=true)<br/>
kube:KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
kube:KubeletPSI=true|false (BETA - default=true)<br/>
kube:KubeletPodResourcesDynamicResources=true|false (BETA - default=true)<br/>
kube:KubeletPodResourcesGet=true|false (BETA - default=true)<br/>
kube:KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
kube:KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - default=true)<br/>
kube:ListFromCacheSnapshot=true|false (BETA - default=true)<br/>
kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
kube:LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:LoggingBetaOptions=true|false (BETA - default=true)<br/>
kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
kube:MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - default=true)<br/>
kube:MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
kube:MemoryQoS=true|false (ALPHA - default=false)<br/>
kube:MutableCSINodeAllocatableCount=true|false (BETA - default=false)<br/>
kube:MutatingAdmissionPolicy=true|false (BETA - default=false)<br/>
kube:NodeLogQuery=true|false (BETA - default=false)<br/>
kube:NominatedNodeNameForExpectation=true|false (ALPHA - default=false)<br/>
kube:OpenAPIEnums=true|false (BETA - default=true)<br/>
kube:PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
kube:PodCertificateRequest=true|false (ALPHA - default=false)<br/>
kube:PodDeletionCost=true|false (BETA - default=true)<br/>
kube:PodLevelResources=true|false (BETA - default=true)<br/>
kube:PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
kube:PodObservedGenerationTracking=true|false (BETA - default=true)<br/>
kube:PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
kube:PodTopologyLabelsAdmission=true|false (ALPHA - default=false)<br/>
kube:PortForwardWebsockets=true|false (BETA - default=true)<br/>
kube:PreferSameTrafficDistribution=true|false (BETA - default=true)<br/>
kube:PreventStaticPodAPIReferences=true|false (BETA - default=true)<br/>
kube:ProcMountType=true|false (BETA - default=true)<br/>
kube:QOSReserved=true|false (ALPHA - default=false)<br/>
kube:ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - default=false)<br/>
kube:RelaxedServiceNameValidation=true|false (ALPHA - default=false)<br/>
kube:ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
kube:RemoteRequestHeaderUID=true|false (BETA - default=true)<br/>
kube:ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
kube:RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
kube:RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
kube:SELinuxChangePolicy=true|false (BETA - default=true)<br/>
kube:SELinuxMount=true|false (BETA - default=false)<br/>
kube:SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
kube:SchedulerAsyncAPICalls=true|false (BETA - default=true)<br/>
kube:SchedulerAsyncPreemption=true|false (BETA - default=true)<br/>
kube:SchedulerPopFromBackoffQ=true|false (BETA - default=true)<br/>
kube:ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
kube:SizeBasedListCostEstimate=true|false (BETA - default=true)<br/>
kube:StorageCapacityScoring=true|false (ALPHA - default=false)<br/>
kube:StorageVersionAPI=true|false (ALPHA - default=false)<br/>
kube:StorageVersionHash=true|false (BETA - default=true)<br/>
kube:StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
kube:StrictIPCIDRValidation=true|false (ALPHA - default=false)<br/>
kube:StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - default=true)<br/>
kube:SupplementalGroupsPolicy=true|false (BETA - default=true)<br/>
kube:SystemdWatchdog=true|false (BETA - default=true)<br/>
kube:TokenRequestServiceAccountUIDValidation=true|false (BETA - default=true)<br/>
kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
kube:TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
kube:UserNamespacesSupport=true|false (BETA - default=true)<br/>
kube:WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
kube:WatchList=true|false (BETA - default=true)<br/>
kube:WatchListClient=true|false (BETA - default=false)<br/>
kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
kube:WindowsGracefulNodeShutdown=true|false (BETA - default=true)
-->
逗號分隔的組件列表，這些 key=value 對用來描述不同組件測試性/試驗性特性的特性門控。<br/>
如果組件未被指定，默認值爲“kube”。此標誌可以被重複調用。例如：
--feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'。
可選項爲：<br/>
kube:APIResponseCompression=true|false (BETA - 默認值=true)<br/>
kube:APIServerIdentity=true|false (BETA - 默認值=true)<br/>
kube:APIServingWithRoutine=true|false (ALPHA - 默認值=false)<br/>
kube:AllAlpha=true|false (ALPHA - 默認值=false)<br/>
kube:AllBeta=true|false (BETA - 默認值=false)<br/>
kube:AllowParsingUserUIDFromCertAuth=true|false (BETA - 默認值=true)<br/>
kube:AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - 默認值=false)<br/>
kube:CBORServingAndStorage=true|false (ALPHA - 默認值=false)<br/>
kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - 默認值=false)<br/>
kube:CPUManagerPolicyBetaOptions=true|false (BETA - 默認值=true)<br/>
kube:CSIVolumeHealth=true|false (ALPHA - 默認值=false)<br/>
kube:ClearingNominatedNodeNameAfterBinding=true|false (ALPHA - 默認值=false)<br/>
kube:ClientsAllowCBOR=true|false (ALPHA - 默認值=false)<br/>
kube:ClientsPreferCBOR=true|false (ALPHA - 默認值=false)<br/>
kube:CloudControllerManagerWebhook=true|false (ALPHA - 默認值=false)<br/>
kube:ClusterTrustBundle=true|false (BETA - 默認值=false)<br/>
kube:ClusterTrustBundleProjection=true|false (BETA - 默認值=false)<br/>
kube:ComponentFlagz=true|false (ALPHA - 默認值=false)<br/>
kube:ComponentStatusz=true|false (ALPHA - 默認值=false)<br/>
kube:ConcurrentWatchObjectDecode=true|false (BETA - 默認值=false)<br/>
kube:ContainerCheckpoint=true|false (BETA - 默認值=true)<br/>
kube:ContainerRestartRules=true|false (ALPHA - 默認值=false)<br/>
kube:ContainerStopSignals=true|false (ALPHA - 默認值=false)<br/>
kube:ContextualLogging=true|false (BETA - 默認值=true)<br/>
kube:CoordinatedLeaderElection=true|false (BETA - 默認值=false)<br/>
kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - 默認值=false)<br/>
kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默認值=false)<br/>
kube:DRAAdminAccess=true|false (BETA - 默認值=true)<br/>
kube:DRAConsumableCapacity=true|false (ALPHA - 默認值=false)<br/>
kube:DRADeviceBindingConditions=true|false (ALPHA - 默認值=false)<br/>
kube:DRADeviceTaints=true|false (ALPHA - 默認值=false)<br/>
kube:DRAExtendedResource=true|false (ALPHA - 默認值=false)<br/>
kube:DRAPartitionableDevices=true|false (ALPHA - 默認值=false)<br/>
kube:DRAPrioritizedList=true|false (BETA - 默認值=true)<br/>
kube:DRAResourceClaimDeviceStatus=true|false (BETA - 默認值=true)<br/>
kube:DRASchedulerFilterTimeout=true|false (BETA - 默認值=true)<br/>
kube:DeclarativeValidation=true|false (BETA - 默認值=true)<br/>
kube:DeclarativeValidationTakeover=true|false (BETA - 默認值=false)<br/>
kube:DeploymentReplicaSetTerminatingReplicas=true|false (ALPHA - 默認值=false)<br/>
kube:DetectCacheInconsistency=true|false (BETA - 默認值=true)<br/>
kube:DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - 默認值=true)<br/>
kube:EnvFiles=true|false (ALPHA - 默認值=false)<br/>
kube:EventedPLEG=true|false (ALPHA - 默認值=false)<br/>
kube:ExternalServiceAccountTokenSigner=true|false (BETA - 默認值=true)<br/>
kube:GracefulNodeShutdown=true|false (BETA - 默認值=true)<br/>
kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 默認值=true)<br/>
kube:HPAConfigurableTolerance=true|false (ALPHA - 默認值=false)<br/>
kube:HPAScaleToZero=true|false (ALPHA - 默認值=false)<br/>
kube:HostnameOverride=true|false (ALPHA - 默認值=false)<br/>
kube:ImageMaximumGCAge=true|false (BETA - 默認值=true)<br/>
kube:ImageVolume=true|false (BETA - 默認值=false)<br/>
kube:InOrderInformers=true|false (BETA - 默認值=true)<br/>
kube:InPlacePodVerticalScaling=true|false (BETA - 默認值=true)<br/>
kube:InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - 默認值=false)<br/>
kube:InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - 默認值=false)<br/>
kube:InTreePluginPortworxUnregister=true|false (ALPHA - 默認值=false)<br/>
kube:InformerResourceVersion=true|false (ALPHA - 默認值=false)<br/>
kube:JobManagedBy=true|false (BETA - 默認值=true)<br/>
kube:KubeletCrashLoopBackOffMax=true|false (ALPHA - 默認值=false)<br/>
kube:KubeletEnsureSecretPulledImages=true|false (ALPHA - 默認值=false)<br/>
kube:KubeletFineGrainedAuthz=true|false (BETA - 默認值=true)<br/>
kube:KubeletInUserNamespace=true|false (ALPHA - 默認值=false)<br/>
kube:KubeletPSI=true|false (BETA - 默認值=true)<br/>
kube:KubeletPodResourcesDynamicResources=true|false (BETA - 默認值=true)<br/>
kube:KubeletPodResourcesGet=true|false (BETA - 默認值=true)<br/>
kube:KubeletSeparateDiskGC=true|false (BETA - 默認值=true)<br/>
kube:KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - 默認值=true)<br/>
kube:ListFromCacheSnapshot=true|false (BETA - 默認值=true)<br/>
kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - 默認值=false)<br/>
kube:LoggingAlphaOptions=true|false (ALPHA - 默認值=false)<br/>
kube:LoggingBetaOptions=true|false (BETA - 默認值=true)<br/>
kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - 默認值=true)<br/>
kube:MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - 默認值=true)<br/>
kube:MaxUnavailableStatefulSet=true|false (ALPHA - 默認值=false)<br/>
kube:MemoryQoS=true|false (ALPHA - 默認值=false)<br/>
kube:MutableCSINodeAllocatableCount=true|false (BETA - 默認值=false)<br/>
kube:MutatingAdmissionPolicy=true|false (BETA - 默認值=false)<br/>
kube:NodeLogQuery=true|false (BETA - 默認值=false)<br/>
kube:NominatedNodeNameForExpectation=true|false (ALPHA - 默認值=false)<br/>
kube:OpenAPIEnums=true|false (BETA - 默認值=true)<br/>
kube:PodAndContainerStatsFromCRI=true|false (ALPHA - 默認值=false)<br/>
kube:PodCertificateRequest=true|false (ALPHA - 默認值=false)<br/>
kube:PodDeletionCost=true|false (BETA - 默認值=true)<br/>
kube:PodLevelResources=true|false (BETA - 默認值=true)<br/>
kube:PodLogsQuerySplitStreams=true|false (ALPHA - 默認值=false)<br/>
kube:PodObservedGenerationTracking=true|false (BETA - 默認值=true)<br/>
kube:PodReadyToStartContainersCondition=true|false (BETA - 默認值=true)<br/>
kube:PodTopologyLabelsAdmission=true|false (ALPHA - 默認值=false)<br/>
kube:PortForwardWebsockets=true|false (BETA - 默認值=true)<br/>
kube:PreferSameTrafficDistribution=true|false (BETA - 默認值=true)<br/>
kube:PreventStaticPodAPIReferences=true|false (BETA - 默認值=true)<br/>
kube:ProcMountType=true|false (BETA - 默認值=true)<br/>
kube:QOSReserved=true|false (ALPHA - 默認值=false)<br/>
kube:ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - 默認值=false)<br/>
kube:RelaxedServiceNameValidation=true|false (ALPHA - 默認值=false)<br/>
kube:ReloadKubeletServerCertificateFile=true|false (BETA - 默認值=true)<br/>
kube:RemoteRequestHeaderUID=true|false (BETA - 默認值=true)<br/>
kube:ResourceHealthStatus=true|false (ALPHA - 默認值=false)<br/>
kube:RotateKubeletServerCertificate=true|false (BETA - 默認值=true)<br/>
kube:RuntimeClassInImageCriApi=true|false (ALPHA - 默認值=false)<br/>
kube:SELinuxChangePolicy=true|false (BETA - 默認值=true)<br/>
kube:SELinuxMount=true|false (BETA - 默認值=false)<br/>
kube:SELinuxMountReadWriteOncePod=true|false (BETA - 默認值=true)<br/>
kube:SchedulerAsyncAPICalls=true|false (BETA - 默認值=true)<br/>
kube:SchedulerAsyncPreemption=true|false (BETA - 默認值=true)<br/>
kube:SchedulerPopFromBackoffQ=true|false (BETA - 默認值=true)<br/>
kube:ServiceAccountNodeAudienceRestriction=true|false (BETA - 默認值=true)<br/>
kube:SizeBasedListCostEstimate=true|false (BETA - 默認值=true)<br/>
kube:StorageCapacityScoring=true|false (ALPHA - 默認值=false)<br/>
kube:StorageVersionAPI=true|false (ALPHA - 默認值=false)<br/>
kube:StorageVersionHash=true|false (BETA - 默認值=true)<br/>
kube:StorageVersionMigrator=true|false (ALPHA - 默認值=false)<br/>
kube:StrictIPCIDRValidation=true|false (ALPHA - 默認值=false)<br/>
kube:StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - 默認值=true)<br/>
kube:SupplementalGroupsPolicy=true|false (BETA - 默認值=true)<br/>
kube:SystemdWatchdog=true|false (BETA - 默認值=true)<br/>
kube:TokenRequestServiceAccountUIDValidation=true|false (BETA - 默認值=true)<br/>
kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - 默認值=false)<br/>
kube:TopologyManagerPolicyBetaOptions=true|false (BETA - 默認值=true)<br/>
kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - 默認值=true)<br/>
kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - 默認值=true)<br/>
kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - 默認值=false)<br/>
kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - 默認值=false)<br/>
kube:UserNamespacesSupport=true|false (BETA - 默認值=true)<br/>
kube:WatchCacheInitializationPostStartHook=true|false (BETA - 默認值=false)<br/>
kube:WatchList=true|false (BETA - 默認值=true)<br/>
kube:WatchListClient=true|false (BETA - 默認值=false)<br/>
kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - 默認值=false)<br/>
kube:WindowsGracefulNodeShutdown=true|false (BETA - 默認值=true)
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
爲防止 HTTP/2 客戶端卡在單個 API 伺服器上，隨機關閉某連接（GOAWAY）。
客戶端的其他運行中請求不會受到影響。被關閉的客戶端將重新連接，
重新被負載均衡後可能會與其他 API 伺服器開始通信。
此參數設置將被髮送 GOAWAY 指令的請求的比例。
只有一個 API 伺服器或不使用負載均衡器的叢集不應啓用此特性。
最小值爲 0（關閉），最大值爲 .02（1/50 請求）；建議使用 .001（1/1000）。
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
kube-apiserver 的幫助命令
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
伺服器爲客戶端提供的 HTTP/2 連接中最大流數的限制。
零表示使用 GoLang 的默認值。
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
證書頒發機構的證書文件的路徑。
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
TLS 的客戶端證書文件的路徑。
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
TLS 客戶端密鑰文件的路徑。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-preferred-address-types strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of the preferred NodeAddressTypes to use for kubelet connections.
-->
用於 kubelet 連接的首選 NodeAddressTypes 列表。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Timeout for kubelet operations.
-->
kubelet 操作超時時間。
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
如果非零，那麼 Kubernetes 主服務（由 apiserver 創建/維護）將是 NodePort 類型，
使用此字段值作爲端口值。
如果爲零，則 Kubernetes 主服務將爲 ClusterIP 類型。
</td>
</tr>

<tr>
<td colspan="2">--lease-reuse-duration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：60</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The time in seconds that each lease is reused. A lower value could avoid large number of objects reusing the same lease. Notice that a too small value may cause performance problems at storage layer.
-->
每個租約被重用的時長。
如果此值比較低，可以避免大量對象重用此租約。
注意，如果此值過小，可能導致存儲層出現性能問題。
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
此選項代表 API 伺服器完成啓動序列並生效所需的最長時間。
從 API 伺服器的啓動時間到這段時間爲止，
<tt>/livez</tt> 將假定未完成的啓動後鉤子將成功完成，因此返回 true。
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes
-->
兩次日誌刷新之間的最大秒數。
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
[Alpha] 在具有分割輸出流的文本格式中，信息消息可以被緩衝一段時間以提高性能。
默認值零字節表示禁用緩衝區機制。
大小可以指定爲字節數（512）、1000 的倍數（1K）、1024 的倍數（2Ki）或它們的冪（3M、4G、5Mi、6Gi）。
啓用 LoggingAlphaOptions 特性門控以使用此功能。
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
[Alpha] 以文本格式，將錯誤消息寫入 stderr，將信息消息寫入 stdout。
默認是將單個流寫入標準輸出。
啓用 LoggingAlphaOptions 特性門控以使用它。
</p>
</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："text"</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets the log format. Permitted formats: &quot;text&quot;.
-->
<p>
設置日誌格式。允許的格式：&quot;text&quot;。
</p>
</td>
</tr>

<tr>
<td colspan="2">--master-service-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："default"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: the namespace from which the Kubernetes master services should be injected into pods.
-->
已廢棄：應該從其中將 Kubernetes 主服務注入到 Pod 中的名字空間。
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
如果不爲零，則將每個使用者連接的帶寬限制爲此數值（字節數/秒）。
當前僅適用於長時間運行的請求。
</td>
</tr>

<tr>
<td colspan="2">--max-mutating-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：200</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This and --max-requests-inflight are summed to determine the server's total concurrency limit (which must be positive) if --enable-priority-and-fairness is true.
Otherwise, this flag limits the maximum number of mutating requests in flight, or a zero value disables the limit completely.
-->
如果 --enable-priority-and-fairness 爲 true，那麼此值和 --max-requests-inflight
的和將確定伺服器的總併發限制（必須是正數）。
否則，該值限制同時運行的變更類型的請求的個數上限。0 表示無限制。
</td>
</tr>

<tr>
<td colspan="2">--max-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This and --max-mutating-requests-inflight are summed to determine the server's total concurrency limit (which must be positive) if --enable-priority-and-fairness is true.
Otherwise, this flag limits the maximum number of non-mutating requests in flight, or a zero value disables the limit completely.
-->
如果 --enable-priority-and-fairness 爲 true，那麼此值和 --max-mutating-requests-inflight
的和將確定伺服器的總併發限制（必須是正數）。
否則，該值限制進行中非變更類型請求的最大個數，零表示無限制。
</td>
</tr>

<tr>
<td colspan="2">--min-request-timeout int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--  
An optional field indicating the minimum number of seconds a handler must 
keep a request open before timing it out. Currently only honored by the 
watch request handler, which picks a randomized value above this number 
as the connection timeout, to spread out load.
-->
可選字段，表示處理程序在請求超時前，必須保持連接處於打開狀態的最小秒數。
當前只對監聽（Watch）請求的處理程序有效。
Watch 請求的處理程序會基於這個值選擇一個隨機數作爲連接超時值，
以達到分散負載的目的。
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
如果設置該值，將會使用 oidc-ca-file 中的機構之一對 OpenID 服務的證書進行驗證，
否則將會使用主機的根 CA 對其進行驗證。
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
OpenID 連接客戶端的要使用的客戶 ID，如果設置了 oidc-issuer-url，則必須設置這個值。
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
如果提供該值，這個自定義 OpenID 連接聲明將被用來設定使用者組。
該聲明值需要是一個字符串或字符串數組。
此標誌爲實驗性的，請查閱身份認證相關文檔進一步瞭解詳細信息。
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
如果提供了此值，則所有組都將以該值作爲前綴，以防止與其他身份認證策略衝突。
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
OpenID 頒發者 URL，只接受 HTTPS 方案。
如果設置該值，它將被用於驗證 OIDC JSON Web Token(JWT)。
</td>
</tr>

<tr>
<td colspan="2">--oidc-required-claim &lt;逗號分隔的 'key=value' 鍵值對列表&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A key=value pair that describes a required claim in the ID Token. 
If set, the claim is verified to be present in the ID Token with a matching value. 
Repeat this flag to specify multiple claims.
-->
描述 ID 令牌中必需聲明的鍵值對。
如果設置此值，則會驗證 ID 令牌中存在與該聲明匹配的值。
重複此標誌以指定多個聲明。
</td>
</tr>

<tr>
<td colspan="2">--oidc-signing-algs strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：RS256</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of allowed JOSE asymmetric signing algorithms. 
JWTs with a supported 'alg' header values are: RS256, RS384, RS512, ES256, ES384, ES512, PS256, PS384, PS512.
Values are defined by RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1.
-->
允許的 JOSE 非對稱簽名算法的逗號分隔列表。
具有收支持 "alg" 標頭值的 JWTs 有：RS256、RS384、RS512、ES256、ES384、ES512、PS256、PS384、PS512。
取值依據 RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1 定義。
</td>
</tr>

<tr>
<td colspan="2">--oidc-username-claim string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："sub"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The OpenID claim to use as the user name. Note that claims other than
 the default ('sub') is not guaranteed to be unique and immutable. 
 This flag is experimental, please see the authentication documentation for further details.
-->
要用作使用者名的 OpenID 聲明。
請注意，除默認聲明（"sub"）以外的其他聲明不能保證是唯一且不可變的。
此標誌是實驗性的，請參閱身份認證文檔以獲取更多詳細信息。
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
如果提供，則所有使用者名都將以該值作爲前綴。
如果未提供，則除 "email" 之外的使用者名聲明都會添加頒發者 URL 作爲前綴，以避免衝突。
要略過添加前綴處理，請設置值爲 "-"。
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
如果設置並啓用了 UnknownVersionInteroperabilityProxy 特性門控，
當請求由於 kube-apiservers 之間的版本偏差而無法被處理時，
此 IP 將由對等 kube-apiserver 用於代理請求到該 kube-apiserver。
此標誌僅被用於設定了多個 kube-apiserver 以實現高可用性的叢集中。
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
如果設置並且啓用了 UnknownVersionInteroperabilityProxy 特性門控，
當請求由於 kube-apiservers 之間的版本偏差導致對等方無法被處理時，
此端口將由對等 kube-apiserver 用於代理請求到該 kube-apiserver。
此標誌僅被用於設定了多個 kube-apiserver 以實現高可用性的叢集中。
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
如果設置並啓用了 UnknownVersionInteroperabilityProxy 特性門控，
此文件將被用於驗證對等 kube-apiserver 的服務證書。
此標誌僅被用於設定了多個 kube-apiserver 以實現高可用性的叢集中。
</p></td>
</tr>

<tr>
<td colspan="2">--permit-address-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--If true, SO_REUSEADDR will be used when binding the port. This allows binding to wildcard IPs like 0.0.0.0 and specific IPs in parallel, and it avoids waiting for the kernel to release sockets in TIME_WAIT state. [default=false]
-->
若此標誌爲 true，則使用 <tt>SO_REUSEADDR</tt> 來綁定端口。
這樣設置可以同時綁定到用通配符表示的類似 0.0.0.0 這種 IP 地址，
以及特定的 IP 地址。也可以避免等待內核釋放 <tt>TIME_WAIT</tt> 狀態的套接字。[默認值=false]
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
如果爲 true，則在綁定端口時將使用 <tt>SO_REUSEPORT</tt>，
這樣多個實例可以綁定到同一地址和端口上。[默認值=false]
</td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable profiling via web interface host:port/debug/pprof/
-->
通過 Web 接口 <code>host:port/debug/pprof/</code> 啓用性能分析。
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
當必須調用外部程序以處理請求時，用於證明聚合器或者 kube-apiserver 的身份的客戶端證書。
包括代理轉發到使用者 api-server 的請求和調用 Webhook 准入控制插件的請求。
Kubernetes 期望此證書包含來自於 --requestheader-client-ca-file 標誌中所給 CA 的簽名。
該 CA 在 kube-system 命名空間的 "extension-apiserver-authentication" ConfigMap 中公開。
從 kube-aggregator 收到調用的組件應該使用該 CA 進行各自的雙向 TLS 驗證。
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
當必須調用外部程序來處理請求時，用來證明聚合器或者 kube-apiserver 的身份的客戶端私鑰。
這包括代理轉發給使用者 api-server 的請求和調用 Webhook 准入控制插件的請求。
</td>
</tr>

<tr>
<td colspan="2">--request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
An optional field indicating the duration a handler must keep a request 
open before timing it out. This is the default request timeout for 
requests but may be overridden by flags such as --min-request-timeout 
for specific types of requests.
-->
可選字段，指示處理程序在超時之前必須保持打開請求的持續時間。
這是請求的默認請求超時，但對於特定類型的請求，可能會被
<code>--min-request-timeout</code>等標誌覆蓋。
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
此值爲客戶端證書通用名稱（Common Name）的列表；表中所列的表項可以用來提供使用者名，
方式是使用 <code>--requestheader-username-headers</code> 所指定的頭部。
如果爲空，能夠通過 <code>--requestheader-client-ca-file</code> 中機構
認證的客戶端證書都是被允許的。
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
在信任請求頭中以 <code>--requestheader-username-headers</code> 指示的使用者名之前，
用於驗證接入請求中客戶端證書的根證書包。
警告：一般不要假定傳入請求已被授權。
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
用於查驗請求頭部的前綴列表。建議使用 <code>X-Remote-Extra-</code>。
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
用於查驗使用者組的請求頭部列表。建議使用 <code>X-Remote-Group</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-uid-headers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
List of request headers to inspect for UIDs. X-Remote-Uid is suggested. Requires the RemoteRequestHeaderUID feature to be enabled.
-->
用於查驗 UID 的請求頭字段列表。建議使用 <code>X-Remote-Uid</code>。
要求 <code>RemoteRequestHeaderUID</code> 特性被啓用。
</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for usernames. X-Remote-User is common.
-->
用於查驗使用者名的請求頭部字段列表。建議使用 <code>X-Remote-User</code>。
</td>
</tr>

<tr>
<td colspan="2">--runtime-config &lt;逗號分隔的 'key=value' 對列表&gt;</td>
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
一組啓用或禁用內置 API 的鍵值對。支持的選項包括：
<br/>v1=true|false（針對核心 API 組）
<br/>&lt;group&gt;/&lt;version&gt;=true|false（針對特定 API 組和版本，例如：apps/v1=true） 
<br/>api/all=true|false 控制所有 API 版本
<br/>api/ga=true|false 控制所有 v[0-9]+ API 版本
<br/>api/beta=true|false 控制所有 v[0-9]+beta[0-9]+ API 版本
<br/>api/alpha=true|false 控制所有 v[0-9]+alpha[0-9]+ API 版本
<br/>api/legacy 已棄用，並將在以後的版本中刪除
</td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：6443</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port on which to serve HTTPS with authentication and authorization. 
It cannot be switched off with 0.
-->
帶身份認證和鑑權機制的 HTTPS 服務端口。
不能用 0 關閉。
</td>
</tr>

<tr>
<td colspan="2">--service-account-extend-token-expiration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Turns on projected service account expiration extension during token generation, 
which helps safe transition from legacy token to bound service account token feature. 
If this flag is enabled, admission injected tokens would be extended up to 
1 year to prevent unexpected failure during transition, ignoring value of service-account-max-token-expiration.
-->
在生成令牌時，啓用投射服務帳戶到期時間擴展，
這有助於從舊版令牌安全地過渡到綁定的服務帳戶令牌功能。
如果啓用此標誌，則准入插件注入的令牌的過期時間將延長至 1 年，以防止過渡期間發生意外故障，
並忽略 service-account-max-token-expiration 的值。
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
服務帳號令牌頒發者的標識符。
頒發者將在已頒發令牌的 "iss" 聲明中檢查此標識符。
此值爲字符串或 URI。
如果根據 OpenID Discovery 1.0 規範檢查此選項不是有效的 URI，則即使特性門控設置爲 true，
ServiceAccountIssuerDiscovery 功能也將保持禁用狀態。
強烈建議該值符合 OpenID 規範： https://openid.net/specs/openid-connect-discovery-1_0.html 。
實踐中，這意味着 service-account-issuer 取值必須是 HTTPS URL。
還強烈建議此 URL 能夠在 {service-account-issuer}/.well-known/openid-configuration
處提供 OpenID 發現文檔。
當此值被多次指定時，第一次的值用於生成令牌，所有的值用於確定接受哪些發行人。
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
doc and key set are served to relying parties from a URL other than the
API server's external (as auto-detected or overridden with external-hostname).
-->
覆蓋 <code>/.well-known/openid-configuration</code> 提供的發現文檔中 JSON Web 密鑰集的 URI。
如果發現文檔和密鑰集是通過 API 伺服器外部
（而非自動檢測到或被外部主機名覆蓋）之外的 URL 提供給依賴方的，則此標誌很有用。
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
包含 PEM 編碼的 x509 RSA 或 ECDSA 私鑰或公鑰的文件，用於驗證 ServiceAccount 令牌。
指定的文件可以包含多個鍵，並且可以使用不同的文件多次指定標誌。
如果未指定，則使用 <code>--tls-private-key-file</code>。
提供 <code>--service-account-signing-key-file</code> 時必須指定。
</td>
</tr>

<tr>
<td colspan="2">--service-account-lookup&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, validate ServiceAccount tokens exist in etcd as part of authentication.
-->
如果爲 true，則在身份認證時驗證 etcd 中是否存在 ServiceAccount 令牌。
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
服務帳戶令牌發佈者創建的令牌的最長有效期。
如果請求有效期大於此值的有效令牌請求，將使用此值的有效期頒發令牌。
</td>
</tr>

<tr>
<td colspan="2">--service-account-signing-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to socket where a external JWT signer is listening. This flag is mutually exclusive with --service-account-signing-key-file and --service-account-key-file. Requires enabling feature gate (ExternalServiceAccountTokenSigner)
-->
外部 JWT 簽名程序正在偵聽的套接字的路徑。
此標誌與 <code>--service-account-signing-key-file</code> 和 <code>--service-account-key-file</code> 互斥。
需要啓用 <code>ExternalServiceAccountTokenSigner</code> 特性門控。
</p></td>
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
包含服務帳戶令牌頒發者當前私鑰的文件的路徑。
頒發者將使用此私鑰簽署所頒發的 ID 令牌。
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
CIDR 表示的 IP 範圍用來爲服務分配叢集 IP。
此地址不得與指定給節點或 Pod 的任何 IP 範圍重疊。
最多允許兩個雙棧 CIDR。
</td>
</tr>

<tr>
<td colspan="2">--service-node-port-range &lt;形式爲 'N1-N2' 的字符串&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：30000-32767</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>A port range to reserve for services with NodePort visibility.  This must not overlap with the ephemeral port range on nodes.  Example: '30000-32767'. Inclusive at both ends of the range.</p>
-->
<p>保留給具有 NodePort 可見性的服務的端口範圍。
不得與節點上的臨時端口範圍重疊。
例如："30000-32767"。範圍的兩端都包括在內。</p>
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
你要顯示隱藏指標的先前版本。僅先前的次要版本有意義，不允許其他值。
格式爲 &lt;major&gt;.&lt;minor&gt;，例如："1.16"。
這種格式的目的是確保你有機會注意到下一個版本是否隱藏了其他指標，
而不是在此之後將它們從發行版中永久刪除時感到驚訝。
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
延遲終止時間。在此期間，伺服器將繼續正常處理請求。
端點 /healthz 和 /livez 將返回成功，但是 /readyz 立即返回失敗。
在此延遲過去之後，將開始正常終止。
這可用於允許負載均衡器停止向該伺服器發送流量。
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
值爲 true 表示 HTTP 伺服器將繼續監聽直到耗盡所有非長時間運行的請求，
在此期間，所有傳入請求將被拒絕，狀態碼爲 429，響應頭爲 &quot;Retry-After&quot;，
此外，設置 &quot;Connection: close&quot; 響應頭是爲了在空閒時斷開 TCP 鏈接。
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
此選項如果被設置了，則表示 API 伺服器體面關閉伺服器窗口內，等待活躍的監聽請求耗盡的最長寬限期。
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
持久化存儲後端。選項："etcd3"（默認）。
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
聲明 apiserver 就緒之前等待存儲初始化的最長時間。默認值爲 1m。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-media-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<!--
The media type to use to store objects in storage. Some resources or storage backends may only support a specific media type and will ignore this setting. Supported media types: [application/json, application/yaml, application/vnd.kubernetes.protobuf]
-->
<p>
用於在存儲中存儲對象的媒體類型。某些資源或存儲後端可能僅支持特定的媒體類型，並且將忽略此設置。
支持的媒體類型：[application/json, application/yaml, application/vnd.kubernetes.protobuf]
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
爲 HSTS 所設置的指令列表，用逗號分隔。
如果此列表爲空，則不會添加 HSTS 指令。
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
包含用於 HTTPS 的默認 x509 證書的文件。（CA 證書（如果有）在伺服器證書之後並置）。
如果啓用了 HTTPS 服務，並且未提供 <code>--tls-cert-file</code> 和
<code>--tls-private-key-file</code>，
爲公共地址生成一個自簽名證書和密鑰，並將其保存到 <code>--cert-dir</code> 指定的目錄中。
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
伺服器的密碼套件的列表，以逗號分隔。如果省略，將使用默認的 Go 密碼套件。
<br/>首選值：
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
包含匹配 <code>--tls-cert-file</code> 的 x509 證書私鑰的文件。
</td>
</tr>

<tr>
<td colspan="2">--tls-sni-cert-key string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：[]</td>
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
一對 x509 證書和私鑰文件路徑，（可選）後綴爲全限定域名的域名模式列表，可以使用帶有通配符的前綴。
域模式也允許使用 IP 地址，但僅當 apiserver 對客戶端請求的IP地址具有可見性時，才應使用 IP。
如果未提供域模式，則提取證書的名稱。
非通配符匹配優先於通配符匹配，顯式域模式優先於提取出的名稱。
對於多個密鑰/證書對，請多次使用 <code>--tls-sni-cert-key</code>。
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
如果設置該值，這個文件將被用於通過令牌認證來保護 API 服務的安全端口。
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
包含 API 伺服器跟蹤設定的文件。
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
日誌級別詳細程度的數字。
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
--version, --version=raw 打印版本信息並退出；
--version=vX.Y.Z... 設置報告的版本
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
以逗號分隔的 <code>pattern=N</code> 設置列表，用於文件過濾的日誌記錄（僅適用於 text 日誌格式）。
</td>
</tr>

<tr>
<td colspan="2">--watch-cache&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable watch caching in the apiserver
-->
在 API 伺服器中啓用監視緩存。
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
某些資源（Pod、Node 等）的監視緩存大小設置，以逗號分隔。
每個資源對應的設置格式：<code>resource[.group]#size</code>，其中
<code>resource</code> 爲小寫複數（無版本），
對於 apiVersion v1（舊版核心 API）的資源要省略 <code>group</code>，
對其它資源要給出 <code>group</code>；<code>size 爲一個數字</code>。
此選項僅對 API 伺服器中的內置資源生效，對 CRD 定義的資源或從外部伺服器接入的資源無效。
啓用 <code>watch-cache</code> 時僅查詢此選項。
這裏能生效的 size 設置只有 0，意味着禁用關聯資源的 <code>watch-cache</code>。
所有的非零值都等效，意味着不禁用該資源的<code>watch-cache</code>。
</p>
</td>
</tr>

</tbody>
</table>
