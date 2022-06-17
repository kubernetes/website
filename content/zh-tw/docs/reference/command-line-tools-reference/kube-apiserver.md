---
title: kube-apiserver
content_type: tool-reference
weight: 30
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

## {{% heading "synopsis" %}}

<!--
The Kubernetes API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.
-->

Kubernetes API 伺服器驗證並配置 API 物件的資料，
這些物件包括 pods、services、replicationcontrollers 等。
API 伺服器為 REST 操作提供服務，併為叢集的共享狀態提供前端，
所有其他元件都透過該前端進行互動。

```
kube-apiserver [flags]
```

## {{% heading "options" %}}

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
<p>包含准入控制配置的檔案。</p>
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
向叢集成員通知 apiserver 訊息的 IP 地址。
這個地址必須能夠被叢集中其他成員訪問。
如果 IP 地址為空，將會使用 --bind-address，
如果未指定 --bind-address，將會使用主機的預設介面地址。
</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The map from metric-label to value allow-list of this label. The key's format is &lt;MetricName&gt;,&lt;LabelName&gt;. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.
-->
允許使用的指標標籤到指標值的對映列表。鍵的格式為 &lt;MetricName&gt;,&lt;LabelName&gt;.
值的格式為 &lt;allowed_value&gt;,&lt;allowed_value&gt;...。
例如：<code>metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'</code>。
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
如果為 true，將允許特權容器。[預設值=false]
</td>
</tr>

<tr>
<td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables anonymous requests to the secure port of the API server. 
Requests that are not rejected by another authentication method 
are treated as anonymous requests. Anonymous requests have a 
username of system:anonymous, and a group name of system:unauthenticated.
-->
啟用到 API 伺服器的安全埠的匿名請求。
未被其他認證方法拒絕的請求被當做匿名請求。
匿名請求的使用者名稱為 <code>system:anonymous</code>，
使用者組名為 </code>system:unauthenticated</code>。
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
API 的識別符號。
服務帳戶令牌驗證者將驗證針對 API 使用的令牌是否已繫結到這些受眾中的至少一個。
如果配置了 <code>--service-account-issuer</code> 標誌，但未配置此標誌，
則此欄位預設為包含釋出者 URL 的單個元素列表。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The size of the buffer to store events before batching and writing. Only used in batch mode.
-->
批處理和寫入之前用於儲存事件的緩衝區大小。
僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1</td>
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
如果之前未使用 ThrottleQPS，則為同時傳送的最大請求數。
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
是否啟用了批次限制。僅在批處理模式下使用。
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
若設定了此標誌，則被輪換的日誌檔案會使用 gzip 壓縮。
</td>

</tr>

<tr>
<td colspan="2">--audit-log-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："json" </td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Format of saved audits. "legacy" indicates 1-line text format for each event. 
"json" indicates structured json format. Known formats are legacy,json.
-->
所儲存的審計格式。
"legacy" 表示每行一個事件的文字格式。"json" 表示結構化的 JSON 格式。
已知格式為 legacy，json。
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
根據檔名中編碼的時間戳保留舊審計日誌檔案的最大天數。
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
要保留的舊的審計日誌檔案個數上限。
將值設定為 0 表示對檔案個數沒有限制。
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
輪換之前，審計日誌檔案的最大大小（以兆位元組為單位）。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："blocking"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Strategy for sending audit events. Blocking indicates sending events should block server responses. 
Batch causes the backend to buffer and write events asynchronously. 
Known modes are batch,blocking,blocking-strict.
-->
用來發送審計事件的策略。
阻塞（blocking）表示傳送事件應阻止伺服器響應。
批處理（batch）會導致後端非同步緩衝和寫入事件。
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
如果設定，則所有到達 API 伺服器的請求都將記錄到該檔案中。
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
是否啟用事件和批次截斷。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10485760</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of the batch sent to the underlying backend. Actual serialized size can be 
several hundreds of bytes greater. If a batch exceeds this limit, it is split into 
several batches of smaller size.
-->
傳送到下層後端的每批次的最大資料量。
實際的序列化大小可能會增加數百個位元組。
如果一個批次超出此限制，則將其分成幾個較小的批次。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：102400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of the audit event sent to the underlying backend. If the size of an event
is greater than this number, first request and response are removed, and if this doesn't 
reduce the size enough, event is discarded.
-->
傳送到下層後端的每批次的最大資料量。
如果事件的大小大於此數字，則將刪除第一個請求和響應；
如果這樣做沒有減小足夠大的程度，則將丟棄事件。
</td>
</tr>

<tr>
<td colspan="2">--audit-log-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："audit.k8s.io/v1"</td>
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
定義審計策略配置的檔案的路徑。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The size of the buffer to store events before batching and writing. Only used in batch mode.
-->
劃分批次和寫入之前用於儲存事件的緩衝區大小。
僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：400</td>
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
<td colspan="2">--audit-webhook-batch-max-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30s</td>
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
<td colspan="2">--audit-webhook-batch-throttle-burst int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：15</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. 
Only used in batch mode.
-->
如果之前未使用 ThrottleQPS，同時傳送的最大請求數。
僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-enable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether batching throttling is enabled. Only used in batch mode.
-->
是否啟用了批次限制。僅在批處理模式下使用。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10</td>
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
定義審計 webhook 配置的 kubeconfig 格式檔案的路徑。
</tr>

<tr>
<td colspan="2">--audit-webhook-initial-backoff duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
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
<td colspan="2">--audit-webhook-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："batch"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Strategy for sending audit events. Blocking indicates sending events should block server responses. 
Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking,blocking-strict.
-->
傳送審計事件的策略。
阻止（Blocking）表示傳送事件應阻止伺服器響應。
批處理（Batch）導致後端非同步緩衝和寫入事件。
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
是否啟用事件和批處理截斷。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10485760</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
Maximum size of the batch sent to the underlying backend. Actual serialized size can be 
several hundreds of bytes greater. If a batch exceeds this limit, it is split into 
several batches of smaller size.
-->
傳送到下層後端的批次的最大資料量。
實際的序列化大小可能會增加數百個位元組。
如果一個批次超出此限制，則將其分成幾個較小的批次。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：102400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of the audit event sent to the underlying backend. If the size of an event
is greater than this number, first request and response are removed, and if this doesn't
reduce the size enough, event is discarded.
-->
傳送到下層後端的批次的最大資料量。
如果事件的大小大於此數字，則將刪除第一個請求和響應；
如果事件和事件的大小沒有減小到一定幅度，則將丟棄事件。
</td>
</tr>

<tr>
<td colspan="2">--audit-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："audit.k8s.io/v1"
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
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->2m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache responses from the webhook token authenticator.
-->
對來自 Webhook 令牌身份驗證器的響應的快取時間。
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
包含 Webhook 配置的 kubeconfig 格式檔案，用於進行令牌認證。
API 伺服器將查詢遠端服務，以對持有者令牌進行身份驗證。
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："v1beta1"
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
<td colspan="2">--authorization-mode strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："AlwaysAllow"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Ordered list of plug-ins to do authorization on secure port. Comma-delimited list of: 
AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node.
-->
在安全埠上進行鑑權的外掛的順序列表。
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
包含鑑權策略的檔案，其內容為分行 JSON 格式，
在安全埠上與 --authorization-mode=ABAC 一起使用。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer.
-->
對來自 Webhook 鑑權元件的 “授權（authorized）” 響應的快取時間。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer.
-->
對來自 Webhook 鑑權模組的 “未授權（unauthorized）” 響應的快取時間。
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
包含 Webhook 配置的檔案，其格式為 kubeconfig，
與 --authorization-mode=Webhook 一起使用。
API 伺服器將查詢遠端服務，以對 API 伺服器的安全埠的訪問執行鑑權。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："v1beta1"</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The API version of the authorization.k8s.io SubjectAccessReview to send to and expect from the webhook.
-->
與 Webhook 之間交換 authorization.k8s.io SubjectAccessReview 時使用的 API 版本。
</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the file containing Azure container registry configuration information.
-->
包含 Azure 容器倉庫配置資訊的檔案的路徑。
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："0.0.0.0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to listen for the --secure-port port. The associated interface(s) 
must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an 
unspecified address (0.0.0.0 or ::), all interfaces will be used.
-->
用來監聽 <code>--secure-port</code> 埠的 IP 地址。
叢集的其餘部分以及 CLI/web 客戶端必須可以訪問所關聯的介面。
如果為空白或未指定地址（<tt>0.0.0.0</tt> 或 <tt>::</tt>），則將使用所有介面。
</td>
</tr>

<tr>
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："/var/run/kubernetes"</td>
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
如果已設定，則使用與客戶端證書的 CommonName 對應的標識對任何出示由
client-ca 檔案中的授權機構之一簽名的客戶端證書的請求進行身份驗證。
</td>
</tr>

<tr>
<td colspan="2">--cloud-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to the cloud provider configuration file. Empty string for no configuration file.
-->
雲廠商配置檔案的路徑。空字串表示無配置檔案。
</td>
</tr>

<tr>
<td colspan="2">--cloud-provider string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The provider for cloud services. Empty string for no provider.
-->
雲服務提供商。空字串表示沒有云廠商。
</td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："130.211.0.0/22,35.191.0.0/16"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
CIDRs opened in GCE firewall for L7 LB traffic proxy & health checks
-->
在 GCE 防火牆中開啟 CIDR，以進行第 7 層負載均衡流量代理和健康狀況檢查。
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable lock contention profiling, if profiling is enabled
-->
如果啟用了效能分析，則啟用鎖爭用效能分析。
</td>
</tr>

<tr>
<td colspan="2">--cors-allowed-origins strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of allowed origins for CORS, comma separated.  
An allowed origin can be a regular expression to support subdomain matching. 
If this list is empty CORS will not be enabled.
-->
CORS 允許的來源清單，以逗號分隔。
允許的來源可以是支援子域匹配的正則表示式。
如果此列表為空，則不會啟用 CORS。
</td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: -->預設值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.
-->
對汙點 NotReady:NoExecute 的容忍時長（以秒計）。
預設情況下這一容忍度會被新增到尚未具有此容忍度的每個 pod 中。
</td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Indicates the tolerationSeconds of the toleration for unreachable:NoExecute 
that is added by default to every pod that does not already have such a toleration.
-->
對汙點 Unreachable:NoExecute 的容忍時長（以秒計）
預設情況下這一容忍度會被新增到尚未具有此容忍度的每個 pod 中。
</td>
</tr>

<tr>
<td colspan="2">--default-watch-cache-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Default watch cache size. If zero, watch cache will be disabled for resources 
that do not have a default watch size set.
-->
預設監聽（watch）快取大小。
如果為零，則將為沒有設定預設監視大小的資源禁用監視快取。
</td>
</tr>

<tr>
<td colspan="2">--delete-collection-workers int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of workers spawned for DeleteCollection call. These are used to speed up namespace cleanup.
-->
為 DeleteCollection 呼叫而產生的工作執行緒數。
這些用於加速名字空間清理。
</td>
</tr>

<tr>
<td colspan="2">--disable-admission-plugins strings</td>
</tr>
<tr>

<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
admission plugins that should be disabled although they are in the default enabled plugins list (NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, PodSecurity, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection, PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, MutatingAdmissionWebhook, ValidatingAdmissionWebhook, ResourceQuota). Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PersistentVolumeLabel, PodNodeSelector, PodSecurity, PodSecurityPolicy, PodTolerationRestriction, Priority, ResourceQuota, RuntimeClass, SecurityContextDeny, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.
-->
儘管位於預設啟用的外掛列表中（NamespaceLifecycle、LimitRanger、ServiceAccount、TaintNodesByCondition、PodSecurity、Priority、DefaultTolerationSeconds、DefaultStorageClass、StorageObjectInUseProtection、PersistentVolumeClaimResize、RuntimeClass、CertificateApproval、CertificateSigning、CertificateSubjectRestriction、DefaultIngressClass、MutatingAdmissionWebhook、ValidatingAdmissionWebhook、ResourceQuota）仍須被禁用的外掛。
<br/>取值為逗號分隔的准入外掛列表：AlwaysAdmit、AlwaysDeny、AlwaysPullImages、CertificateApproval、CertificateSigning、CertificateSubjectRestriction、DefaultIngressClass、DefaultStorageClass、DefaultTolerationSeconds、DenyServiceExternalIPs、EventRateLimit、ExtendedResourceToleration、ImagePolicyWebhook、LimitPodHardAntiAffinityTopology、LimitRanger、MutatingAdmissionWebhook、NamespaceAutoProvision、NamespaceExists、NamespaceLifecycle、NodeRestriction、OwnerReferencesPermissionEnforcement、PersistentVolumeClaimResize、PersistentVolumeLabel、PodNodeSelector、PodSecurity、PodSecurityPolicy、PodTolerationRestriction、Priority、ResourceQuota、RuntimeClass、SecurityContextDeny、ServiceAccount、StorageObjectInUseProtection、TaintNodesByCondition、ValidatingAdmissionWebhook。
<br/>該標誌中外掛的順序無關緊要。
</td>
</tr>

<tr>
<td colspan="2">--disabled-metrics strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This flag provides an escape hatch for misbehaving metrics. You must provide the fully qualified metric name in order to disable it. Disclaimer: disabling metrics is higher in precedence than showing hidden metrics.
-->
此標誌為行為不正確的度量指標提供一種處理方案。
你必須提供完全限定的指標名稱才能將其禁止。
宣告：禁用度量值的行為優先於顯示已隱藏的度量值。
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
帶有 API 伺服器出站選擇器配置的檔案。
</td>
</tr>

<tr>
<td colspan="2">--enable-admission-plugins strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
admission plugins that should be enabled in addition to default enabled ones (
NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, PodSecurity, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection, PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, MutatingAdmissionWebhook, ValidatingAdmissionWebhook, ResourceQuota).
Comma-delimited list of admission plugins:
AlwaysAdmit, AlwaysDeny, AlwaysPullImages, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PersistentVolumeLabel, PodNodeSelector, PodSecurity, PodSecurityPolicy, PodTolerationRestriction, Priority, ResourceQuota, RuntimeClass, SecurityContextDeny, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionWebhook.
The order of plugins in this flag does not matter.
-->
除了預設啟用的外掛（NamespaceLifecycle、LimitRanger、ServiceAccount、TaintNodesByCondition、PodSecurity、Priority、DefaultTolerationSeconds、DefaultStorageClass、StorageObjectInUseProtection、PersistentVolumeClaimResize、RuntimeClass、CertificateApproval、CertificateSigning、CertificateSubjectRestriction、DefaultIngressClass、MutatingAdmissionWebhook、ValidatingAdmissionWebhook、ResourceQuota）之外要啟用的外掛
</br>取值為逗號分隔的准入外掛列表：AlwaysAdmit、AlwaysDeny、AlwaysPullImages、CertificateApproval、CertificateSigning、CertificateSubjectRestriction、DefaultIngressClass、DefaultStorageClass、DefaultTolerationSeconds、DenyServiceExternalIPs、EventRateLimit、ExtendedResourceToleration、ImagePolicyWebhook、LimitPodHardAntiAffinityTopology、LimitRanger、MutatingAdmissionWebhook、NamespaceAutoProvision、NamespaceExists、NamespaceLifecycle、NodeRestriction、OwnerReferencesPermissionEnforcement、PersistentVolumeClaimResize、PersistentVolumeLabel、PodNodeSelector、PodSecurity、PodSecurityPolicy、PodTolerationRestriction、Priority、ResourceQuota、RuntimeClass、SecurityContextDeny、ServiceAccount、StorageObjectInUseProtection、TaintNodesByCondition、ValidatingAdmissionWebhook
<br/>該標誌中外掛的順序無關緊要。
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
啟用以允許將 "kube-system" 名字空間中型別為 "bootstrap.kubernetes.io/token"
的 Secret 用於 TLS 引導身份驗證。
</td>
</tr>

<tr>
<td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager.
-->
啟用通用垃圾收集器。必須與 kube-controller-manager 的相應標誌同步。
</td>
</tr>

<tr>
<td colspan="2">--enable-priority-and-fairness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true and the APIPriorityAndFairness feature gate is enabled, 
replace the max-in-flight handler with an enhanced one that queues 
and dispatches with priority and fairness
-->
如果為 true 且啟用了 <code>APIPriorityAndFairness</code> 特性門控，
請使用增強的處理程式替換 max-in-flight 處理程式，
以便根據優先順序和公平性完成排隊和排程。
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
包含加密提供程式配置資訊的檔案，用在 etcd 中所儲存的 Secret 上。
</td>
</tr>

<tr>
<td colspan="2">--endpoint-reconciler-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："lease"</td>
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
用於保護 etcd 通訊的 SSL 證書頒發機構檔案。
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
用於保護 etcd 通訊的 SSL 證書檔案。
</td>
</tr>

<tr>
<td colspan="2">--etcd-compaction-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval of compaction requests. If 0, the compaction request from apiserver is disabled.
-->
壓縮請求的間隔。
如果為0，則禁用來自 API 伺服器的壓縮請求。
</td>
</tr>

<tr>
<td colspan="2">--etcd-count-metric-poll-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Frequency of polling etcd for number of resources per type. 0 disables the metric collection.
-->
針對每種型別的資源數量輪詢 etcd 的頻率。
0 值表示禁用度量值收集。
</td>
</tr>

<tr>
<td colspan="2">--etcd-db-metric-poll-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30s</td>
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
<td colspan="2">--etcd-healthcheck-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:—->預設值：2s</td>
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
用於保護 etcd 通訊的 SSL 金鑰檔案。
</td>
</tr>

<tr>
<td colspan="2">--etcd-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："/registry"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The prefix to prepend to all resource paths in etcd.
-->
要在 etcd 中所有資源路徑之前新增的字首。
</td>
</tr>

<tr>
<td colspan="2">--etcd-servers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of etcd servers to connect with (scheme://ip:port), comma separated.
-->
要連線的 etcd 伺服器列表（<code>scheme://ip:port</code>），以逗號分隔。
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
-->
etcd 伺服器針對每個資源的過載設定，以逗號分隔。
單個替代格式：組/資源#伺服器（group/resource#servers），
其中伺服器是 URL，以分號分隔。
</td>
</tr>

<tr>
<td colspan="2">--event-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1h0m0s</td>
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
為此主機生成外部化 UR L時要使用的主機名（例如 Swagger API 文件或 OpenID 發現）。
</td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;逗號分隔的 'key=True|False' 鍵值對&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>
APIListChunking=true|false (BETA - default=true)<br/>
APIPriorityAndFairness=true|false (BETA - default=true)<br/>
APIResponseCompression=true|false (BETA - default=true)<br/>
APIServerIdentity=true|false (ALPHA - default=false)<br/>
APIServerTracing=true|false (ALPHA - default=false)<br/>
AllAlpha=true|false (ALPHA - default=false)<br/>
AllBeta=true|false (BETA - default=false)<br/>
AnyVolumeDataSource=true|false (BETA - default=true)<br/>
AppArmor=true|false (BETA - default=true)<br/>
CPUManager=true|false (BETA - default=true)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br>
CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
CSIInlineVolume=true|false (BETA - default=true)<br/>
CSIMigration=true|false (BETA - default=true)<br/>
CSIMigrationAWS=true|false (BETA - default=true)<br/>
CSIMigrationAzureFile=true|false (BETA - default=true)<br/>
CSIMigrationGCE=true|false (BETA - default=true)<br/>
CSIMigrationPortworx=true|false (ALPHA - default=false)<br/>
CSIMigrationRBD=true|false (ALPHA - default=false)<br/>
CSIMigrationvSphere=true|false (BETA - default=false)<br/>
CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
ContextualLogging=true|false (ALPHA - default=false)<br/>
CronJobTimeZone=true|false (ALPHA - default=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
CustomResourceValidationExpressions=true|false (ALPHA - default=false)<br/>
DaemonSetUpdateSurge=true|false (BETA - default=true)<br/>
DelegateFSGroupToCSIDriver=true|false (BETA - default=true)<br/>
DevicePlugins=true|false (BETA - default=true)<br/>
DisableAcceleratorUsageMetrics=true|false (BETA - default=true)<br/>
DisableCloudProviders=true|false (ALPHA - default=false)<br/>
DisableKubeletCloudCredentialProviders=true|false (ALPHA - default=false)<br/>
DownwardAPIHugePages=true|false (BETA - default=true)<br/>
EndpointSliceTerminatingCondition=true|false (BETA - default=true)<br/>
EphemeralContainers=true|false (BETA - default=true)<br/>
ExpandedDNSConfig=true|false (ALPHA - default=false)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>
GRPCContainerProbe=true|false (BETA - default=true)<br/>
GracefulNodeShutdown=true|false (BETA - default=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
HPAContainerMetrics=true|false (ALPHA - default=false)<br/>
HPAScaleToZero=true|false (ALPHA - default=false)<br/>
HonorPVReclaimPolicy=true|false (ALPHA - default=false)<br/>
IdentifyPodOS=true|false (BETA - default=true)<br/>
InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>I
nTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginRBDUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>
JobMutableNodeSchedulingDirectives=true|false (BETA - default=true)<br/>
JobReadyPods=true|false (BETA - default=true)<br/>
JobTrackingWithFinalizers=true|false (BETA - default=false)<br/>
KubeletCredentialProviders=true|false (BETA - default=true)<br/>
KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
KubeletPodResources=true|false (BETA - default=true)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - default=true)<br/>
LegacyServiceAccountTokenNoAutoGeneration=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>
LogarithmicScaleDown=true|false (BETA - default=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
MemoryManager=true|false (BETA - default=true)<br/>
MemoryQoS=true|false (ALPHA - default=false)<br/>
MinDomainsInPodTopologySpread=true|false (ALPHA - default=false)<br/>
MixedProtocolLBService=true|false (BETA - default=true)<br/>
NetworkPolicyEndPort=true|false (BETA - default=true)<br/>
NetworkPolicyStatus=true|false (ALPHA - default=false)<br/>
NodeOutOfServiceVolumeDetach=true|false (ALPHA - default=false)<br/>
NodeSwap=true|false (ALPHA - default=false)<br/>
OpenAPIEnums=true|false (BETA - default=true)<br/>
OpenAPIV3=true|false (BETA - default=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
PodDeletionCost=true|false (BETA - default=true)<br/>
PodSecurity=true|false (BETA - default=true)<br/>
ProbeTerminationGracePeriod=true|false (BETA - default=false)<br/>
ProcMountType=true|false (ALPHA - default=false)<br/>
ProxyTerminatingEndpoints=true|false (ALPHA - default=false)<br/>
QOSReserved=true|false (ALPHA - default=false)<br/>
ReadWriteOncePod=true|false (ALPHA - default=false)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>
RemainingItemCount=true|false (BETA - default=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
SeccompDefault=true|false (ALPHA - default=false)<br/>
ServerSideFieldValidation=true|false (ALPHA - default=false)<br/>
ServiceIPStaticSubrange=true|false (ALPHA - default=false)<br/>
ServiceInternalTrafficPolicy=true|false (BETA - default=true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>
StatefulSetAutoDeletePVC=true|false (ALPHA - default=false)<br/>
StatefulSetMinReadySeconds=true|false (BETA - default=true)<br/>
StorageVersionAPI=true|false (ALPHA - default=false)<br/>
StorageVersionHash=true|false (BETA - default=true)<br/>
TopologyAwareHints=true|false (BETA - default=true)<br/>
TopologyManager=true|false (BETA - default=true)<br/>
VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
WinDSR=true|false (ALPHA - default=false)<br/>
WinOverlay=true|false (BETA - default=true)<br/>
WindowsHostProcessContainers=true|false (BETA - default=true)
-->
<p>一組 key=value 對，用來描述測試性/試驗性功能的特性門控。可選項有：
APIListChunking=true|false (BETA - 預設值=true)<br/>
APIPriorityAndFairness=true|false (BETA - 預設值=true)<br/>
APIResponseCompression=true|false (BETA - 預設值=true)<br/>
APIServerIdentity=true|false (ALPHA - 預設值=false)<br/>
APIServerTracing=true|false (ALPHA - 預設值=false)<br/>
AllAlpha=true|false (ALPHA - 預設值=false)<br/>
AllBeta=true|false (BETA - 預設值=false)<br/>
AnyVolumeDataSource=true|false (BETA - 預設值=true)<br/>
AppArmor=true|false (BETA - 預設值=true)<br/>
CPUManager=true|false (BETA - 預設值=true)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - 預設值=false)<br>
CPUManagerPolicyBetaOptions=true|false (BETA - 預設值=true)<br/>
CPUManagerPolicyOptions=true|false (BETA - 預設值=true)<br/>
CSIInlineVolume=true|false (BETA - 預設值=true)<br/>
CSIMigration=true|false (BETA - 預設值=true)<br/>
CSIMigrationAWS=true|false (BETA - 預設值=true)<br/>
CSIMigrationAzureFile=true|false (BETA - 預設值=true)<br/>
CSIMigrationGCE=true|false (BETA - 預設值=true)<br/>
CSIMigrationPortworx=true|false (ALPHA - 預設值=false)<br/>
CSIMigrationRBD=true|false (ALPHA - 預設值=false)<br/>
CSIMigrationvSphere=true|false (BETA - 預設值=false)<br/>
CSIVolumeHealth=true|false (ALPHA - 預設值=false)<br/>
ContextualLogging=true|false (ALPHA - 預設值=false)<br/>
CronJobTimeZone=true|false (ALPHA - 預設值=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 預設值=false)<br/>
CustomResourceValidationExpressions=true|false (ALPHA - 預設值=false)<br/>
DaemonSetUpdateSurge=true|false (BETA - 預設值=true)<br/>
DelegateFSGroupToCSIDriver=true|false (BETA - 預設值=true)<br/>
DevicePlugins=true|false (BETA - 預設值=true)<br/>
DisableAcceleratorUsageMetrics=true|false (BETA - 預設值=true)<br/>
DisableCloudProviders=true|false (ALPHA - 預設值=false)<br/>
DisableKubeletCloudCredentialProviders=true|false (ALPHA - 預設值=false)<br/>
DownwardAPIHugePages=true|false (BETA - 預設值=true)<br/>
EndpointSliceTerminatingCondition=true|false (BETA - 預設值=true)<br/>
EphemeralContainers=true|false (BETA - 預設值=true)<br/>
ExpandedDNSConfig=true|false (ALPHA - 預設值=false)<br/>
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 預設值=false)<br/>
GRPCContainerProbe=true|false (BETA - 預設值=true)<br/>
GracefulNodeShutdown=true|false (BETA - 預設值=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 預設值=true)<br/>
HPAContainerMetrics=true|false (ALPHA - 預設值=false)<br/>
HPAScaleToZero=true|false (ALPHA - 預設值=false)<br/>
HonorPVReclaimPolicy=true|false (ALPHA - 預設值=false)<br/>
IdentifyPodOS=true|false (BETA - 預設值=true)<br/>
InTreePluginAWSUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginAzureDiskUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginAzureFileUnregister=true|false (ALPHA - 預設值=false)<br/>I
nTreePluginGCEUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginOpenStackUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginRBDUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginvSphereUnregister=true|false (ALPHA - 預設值=false)<br/>
JobMutableNodeSchedulingDirectives=true|false (BETA - 預設值=true)<br/>
JobReadyPods=true|false (BETA - 預設值=true)<br/>
JobTrackingWithFinalizers=true|false (BETA - 預設值=false)<br/>
KubeletCredentialProviders=true|false (BETA - 預設值=true)<br/>
KubeletInUserNamespace=true|false (ALPHA - 預設值=false)<br/>
KubeletPodResources=true|false (BETA - 預設值=true)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - 預設值=true)<br/>
LegacyServiceAccountTokenNoAutoGeneration=true|false (BETA - 預設值=true)<br/>
LocalStorageCapacityIsolation=true|false (BETA - 預設值=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 預設值=false)<br/>
LogarithmicScaleDown=true|false (BETA - 預設值=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - 預設值=false)<br/>
MemoryManager=true|false (BETA - 預設值=true)<br/>
MemoryQoS=true|false (ALPHA - 預設值=false)<br/>
MinDomainsInPodTopologySpread=true|false (ALPHA - 預設值=false)<br/>
MixedProtocolLBService=true|false (BETA - 預設值=true)<br/>
NetworkPolicyEndPort=true|false (BETA - 預設值=true)<br/>
NetworkPolicyStatus=true|false (ALPHA - 預設值=false)<br/>
NodeOutOfServiceVolumeDetach=true|false (ALPHA - 預設值=false)<br/>
NodeSwap=true|false (ALPHA - 預設值=false)<br/>
OpenAPIEnums=true|false (BETA - 預設值=true)<br/>
OpenAPIV3=true|false (BETA - 預設值=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - 預設值=false)<br/>
PodDeletionCost=true|false (BETA - 預設值=true)<br/>
PodSecurity=true|false (BETA - 預設值=true)<br/>
ProbeTerminationGracePeriod=true|false (BETA - 預設值=false)<br/>
ProcMountType=true|false (ALPHA - 預設值=false)<br/>
ProxyTerminatingEndpoints=true|false (ALPHA - 預設值=false)<br/>
QOSReserved=true|false (ALPHA - 預設值=false)<br/>
ReadWriteOncePod=true|false (ALPHA - 預設值=false)<br/>
RecoverVolumeExpansionFailure=true|false (ALPHA - 預設值=false)<br/>
RemainingItemCount=true|false (BETA - 預設值=true)<br/>
RotateKubeletServerCertificate=true|false (BETA - 預設值=true)<br/>
Seccomp預設值=true|false (ALPHA - 預設值=false)<br/>
ServerSideFieldValidation=true|false (ALPHA - 預設值=false)<br/>
ServiceIPStaticSubrange=true|false (ALPHA - 預設值=false)<br/>
ServiceInternalTrafficPolicy=true|false (BETA - 預設值=true)<br/>
SizeMemoryBackedVolumes=true|false (BETA - 預設值=true)<br/>
StatefulSetAutoDeletePVC=true|false (ALPHA - 預設值=false)<br/>
StatefulSetMinReadySeconds=true|false (BETA - 預設值=true)<br/>
StorageVersionAPI=true|false (ALPHA - 預設值=false)<br/>
StorageVersionHash=true|false (BETA - 預設值=true)<br/>
TopologyAwareHints=true|false (BETA - 預設值=true)<br/>
TopologyManager=true|false (BETA - 預設值=true)<br/>
VolumeCapacityPriority=true|false (ALPHA - 預設值=false)<br/>
WinDSR=true|false (ALPHA - 預設值=false)<br/>
WinOverlay=true|false (BETA - 預設值=true)<br/>
WindowsHostProcessContainers=true|false (BETA - 預設值=true)</p>
</td>
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
為防止 HTTP/2 客戶端卡在單個 API 伺服器上，可啟用隨機關閉連線（GOAWAY）。
客戶端的其他執行中請求將不會受到影響，並且客戶端將重新連線，
可能會在再次透過負載平衡器後登陸到其他 API 伺服器上。
此引數設定將傳送 GOAWAY 的請求的比例。
具有單個 API 伺服器或不使用負載平衡器的叢集不應啟用此功能。
最小值為0（關閉），最大值為 .02（1/50 請求）；建議使用 .001（1/1000）。
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
伺服器為客戶端提供的 HTTP/2 連線中最大流數的限制。
零表示使用 GoLang 的預設值。
</td>
</tr>

<tr>
<td colspan="2">--identity-lease-duration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：3600</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration of kube-apiserver lease in seconds, must be a positive number. (In use when the APIServerIdentity feature gate is enabled.)
-->
kube-apiserver 租約時長（按秒計），必須是正數。
（當 APIServerIdentity 特性門控被啟用時使用此標誌值）
</td>
</tr>

<tr>
<td colspan="2">--identity-lease-renew-interval-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval of kube-apiserver renewing its lease in seconds, must be a positive number. (In use when the APIServerIdentity feature gate is enabled.)
-->
kube-apiserver 對其租約進行續期的時間間隔（按秒計），必須是正數。
（當 APIServerIdentity 特性門控被啟用時使用此標誌值）
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
證書頒發機構的證書檔案的路徑。
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
TLS 的客戶端證書檔案的路徑。
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
TLS 客戶端金鑰檔案的路徑。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-preferred-address-types strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of the preferred NodeAddressTypes to use for kubelet connections.
-->
用於 kubelet 連線的首選 NodeAddressTypes 列表。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5s</td>
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
如果非零，那麼 Kubernetes 主服務（由 apiserver 建立/維護）將是 NodePort 型別，
使用它作為埠的值。
如果為零，則 Kubernetes 主服務將為 ClusterIP 型別。
</td>
</tr>

<tr>
<td colspan="2">--lease-reuse-duration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：60</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The time in seconds that each lease is reused. A lower value could avoid large number of objects reusing the same lease. Notice that a too small value may cause performance problems at storage layer.
-->
每個租約被重用的時長。
如果此值比較低，可以避免大量物件重用此租約。
注意，如果此值過小，可能導致儲存層出現效能問題。
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
此選項代表 API 伺服器完成啟動序列並生效所需的最長時間。
從 API 伺服器的啟動時間到這段時間為止，
<tt>/livez</tt> 將假定未完成的啟動後鉤子將成功完成，因此返回 true。
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes
-->
兩次日誌重新整理之間的最大秒數
</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets the log format. Permitted formats: &quot;text&quot;.<br/>Non-default formats don't honor these flags: --add-dir-header, --alsologtostderr, --log-backtrace-at, --log-dir, --log-file, --log-file-max-size, --logtostderr, --one-output, --skip-headers, --skip-log-headers, --stderrthreshold, --vmodule.<br/>Non-default choices are currently alpha and subject to change without warning.
-->
設定日誌格式。允許的格式：&quot;text&quot;。<br/>
非預設格式不支援以下標誌：<code>--add-dir-header</code>、<code>--alsologtostderr</code>、<code>--log-backtrace-at</code>、<code>--log-dir</code>、<code>--log-file</code>、<code>--log-file-max-size</code>、<code>--logtostderr</code>、<code>--one-output</code>、<code>-skip-headers</code>、<code>-skip-log-headers</code>、<code>--stderrthreshold</code>、<code>-vmodule</code>。<br/>
當前非預設選擇為 alpha，會隨時更改而不會發出警告。
</td>
</tr>

<tr>
<td colspan="2">--master-service-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："default"</td>
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
如果不為零，則將每個使用者連線限制為該數（位元組數/秒）。
當前僅適用於長時間執行的請求。
</td>
</tr>

<tr>
<td colspan="2">--max-mutating-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：200</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This and --max-requests-inflight are summed to determine the server's total concurrency limit (which must be positive) if --enable-priority-and-fairness is true.
Otherwise, this flag limits the maximum number of mutating requests in flight, or a zero value disables the limit completely.
-->
如果 --enable-priority-and-fairness 為 true，那麼此值和 --max-requests-inflight 的和將確定伺服器的總併發限制（必須是正數）。
否則，該值限制進行中變更型別請求的最大個數，零表示無限制。
</td>
</tr>

<tr>
<td colspan="2">--max-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
This and --max-mutating-requests-inflight are summed to determine the server's total concurrency limit (which must be positive) if --enable-priority-and-fairness is true.
Otherwise, this flag limits the maximum number of non-mutating requests in flight, or a zero value disables the limit completely.
-->
如果 --enable-priority-and-fairness 為 true，那麼此值和 --max-mutating-requests-inflight 的和將確定伺服器的總併發限制（必須是正數）。
否則，該值限制進行中非變更型別請求的最大個數，零表示無限制。
</td>
</tr>

<tr>
<td colspan="2">--min-request-timeout int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--  
An optional field indicating the minimum number of seconds a handler must 
keep a request open before timing it out. Currently only honored by the 
watch request handler, which picks a randomized value above this number 
as the connection timeout, to spread out load.
-->
可選欄位，表示處理程式在請求超時前，必須保持其處於開啟狀態的最小秒數。
當前只對監聽（Watch）請求的處理程式有效，它基於這個值選擇一個隨機數作為連線超時值，
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
如果設定該值，將會使用 oidc-ca-file 中的機構之一對 OpenID 服務的證書進行驗證，
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
OpenID 連線客戶端的要使用的客戶 ID，如果設定了 oidc-issuer-url，則必須設定這個值。
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
如果提供該值，這個自定義 OpenID 連線宣告將被用來設定使用者組。
該宣告值需要是一個字串或字串陣列。
此標誌為實驗性的，請查閱身份認證相關文件進一步瞭解詳細資訊。
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
如果提供了此值，則所有組都將以該值作為字首，以防止與其他身份認證策略衝突。
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
如果設定該值，它將被用於驗證 OIDC JSON Web Token(JWT)。
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
描述 ID 令牌中必需宣告的鍵值對。
如果設定此值，則會驗證 ID 令牌中存在與該宣告匹配的值。
重複此標誌以指定多個宣告。
</td>
</tr>

<tr>
<td colspan="2">--oidc-signing-algs strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：RS256</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of allowed JOSE asymmetric signing algorithms. 
JWTs with a supported 'alg' header values are: RS256, RS384, RS512, ES256, ES384, ES512, PS256, PS384, PS512.
Values are defined by RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1.
-->
允許的 JOSE 非對稱簽名演算法的逗號分隔列表。
具有收支援 "alg" 標頭值的 JWTs 有：RS256、RS384、RS512、ES256、ES384、ES512、PS256、PS384、PS512。
取值依據 RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1 定義。
</td>
</tr>

<tr>
<td colspan="2">--oidc-username-claim string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："sub"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The OpenID claim to use as the user name. Note that claims other than
 the default ('sub') is not guaranteed to be unique and immutable. 
 This flag is experimental, please see the authentication documentation for further details.
-->
要用作使用者名稱的 OpenID 宣告。
請注意，除預設宣告（"sub"）以外的其他宣告不能保證是唯一且不可變的。
此標誌是實驗性的，請參閱身份認證文件以獲取更多詳細資訊。
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
如果提供，則所有使用者名稱都將以該值作為字首。
如果未提供，則除 "email" 之外的使用者名稱宣告都會新增頒發者 URL 作為字首，以避免衝突。
要略過新增字首處理，請設定值為 "-"。
</td>
</tr>

<tr>
<td colspan="2">--permit-address-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--If true, SO_REUSEADDR will be used when binding the port. This allows binding to wildcard IPs like 0.0.0.0 and specific IPs in parallel, and it avoids waiting for the kernel to release sockets in TIME_WAIT state.
-->
若此標誌為 true，則使用 <tt>SO_REUSEADDR</tt> 來繫結埠。
這樣設定可以同時繫結到用萬用字元表示的類似 0.0.0.0 這種 IP 地址，
以及特定的 IP 地址。也可以避免等待核心釋放 <tt>TIME_WAIT</tt> 狀態的套接字。
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
如果為 true，則在繫結埠時將使用 <tt>SO_REUSEPORT</tt>，
這樣多個例項可以繫結到同一地址和埠上。
</td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable profiling via web interface host:port/debug/pprof/
-->
透過 Web 介面 <code>host:port/debug/pprof/</code> 啟用效能分析。
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
當必須呼叫外部程式以處理請求時，用於證明聚合器或者 kube-apiserver 的身份的客戶端證書。
包括代理轉發到使用者 api-server 的請求和呼叫 Webhook 准入控制外掛的請求。
Kubernetes 期望此證書包含來自於 --requestheader-client-ca-file 標誌中所給 CA 的簽名。
該 CA 在 kube-system 名稱空間的 "extension-apiserver-authentication" ConfigMap 中公開。
從 kube-aggregator 收到呼叫的元件應該使用該 CA 進行各自的雙向 TLS 驗證。
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
當必須呼叫外部程式來處理請求時，用來證明聚合器或者 kube-apiserver 的身份的客戶端私鑰。
這包括代理轉發給使用者 api-server 的請求和呼叫 Webhook 准入控制外掛的請求。
</td>
</tr>

<tr>
<td colspan="2">--request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
An optional field indicating the duration a handler must keep a request 
open before timing it out. This is the default request timeout for 
requests but may be overridden by flags such as --min-request-timeout 
for specific types of requests.
-->
可選欄位，指示處理程式在超時之前必須保持開啟請求的持續時間。
這是請求的預設請求超時，但對於特定型別的請求，可能會被
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
此值為客戶端證書通用名稱（Common Name）的列表；表中所列的表項可以用來提供使用者名稱，
方式是使用 <code>--requestheader-username-headers</code> 所指定的頭部。
如果為空，能夠透過 <code>--requestheader-client-ca-file</code> 中機構
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
在信任請求頭中以 <code>--requestheader-username-headers</code> 指示的使用者名稱之前，
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
用於查驗請求頭部的字首列表。建議使用 <code>X-Remote-Extra-</code>。
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
<td colspan="2">--requestheader-username-headers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for usernames. X-Remote-User is common.
-->
用於查驗使用者名稱的請求頭頭列表。建議使用 <code>X-Remote-User</code>。
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
一組啟用或禁用內建 API 的鍵值對。支援的選項包括：
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
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：6443</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port on which to serve HTTPS with authentication and authorization. 
It cannot be switched off with 0.
-->
帶身份驗證和鑑權機制的 HTTPS 服務埠。
不能用 0 關閉。
</td>
</tr>

<tr>
<td colspan="2">--service-account-extend-token-expiration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Turns on projected service account expiration extension during token generation, 
which helps safe transition from legacy token to bound service account token feature. 
If this flag is enabled, admission injected tokens would be extended up to 
1 year to prevent unexpected failure during transition, ignoring value of service-account-max-token-expiration.
-->
在生成令牌時，啟用投射服務帳戶到期時間擴充套件，
這有助於從舊版令牌安全地過渡到繫結的服務帳戶令牌功能。
如果啟用此標誌，則准入外掛注入的令牌的過期時間將延長至 1 年，以防止過渡期間發生意外故障，
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
服務帳號令牌頒發者的識別符號。
頒發者將在已辦法令牌的 "iss" 宣告中檢查此識別符號。
此值為字串或 URI。
如果根據 OpenID Discovery 1.0 規範檢查此選項不是有效的 URI，則即使特性門控設定為 true，
ServiceAccountIssuerDiscovery 功能也將保持禁用狀態。
強烈建議該值符合 OpenID 規範： https://openid.net/specs/openid-connect-discovery-1_0.html 。
實踐中，這意味著 service-account-issuer 取值必須是 HTTPS URL。
還強烈建議此 URL 能夠在 {service-account-issuer}/.well-known/openid-configuration
處提供 OpenID 發現文件。
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
docand key set are served to relying parties from a URL other than the 
API server's external (as auto-detected or overridden with external-hostname).
-->
覆蓋 <code>/.well-known/openid-configuration</code> 提供的發現文件中 JSON Web 金鑰集的 URI。
如果發現文件和金鑰集是透過 API 伺服器外部
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
包含 PEM 編碼的 x509 RSA 或 ECDSA 私鑰或公鑰的檔案，用於驗證 ServiceAccount 令牌。
指定的檔案可以包含多個鍵，並且可以使用不同的檔案多次指定標誌。
如果未指定，則使用 <code>--tls-private-key-file</code>。
提供 <code>--service-account-signing-key-file</code> 時必須指定。
</td>
</tr>

<tr>
<td colspan="2">--service-account-lookup&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, validate ServiceAccount tokens exist in etcd as part of authentication.
-->
如果為 true，則在身份認證時驗證 etcd 中是否存在 ServiceAccount 令牌。
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
服務帳戶令牌釋出者建立的令牌的最長有效期。
如果請求有效期大於此值的有效令牌請求，將使用此值的有效期頒發令牌。
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
包含服務帳戶令牌頒發者當前私鑰的檔案的路徑。
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
-->
CIDR 表示的 IP 範圍用來為服務分配叢集 IP。
此地址不得與指定給節點或 Pod 的任何 IP 範圍重疊。
</td>
</tr>

<tr>
<td colspan="2">--service-node-port-range &lt;形式為 'N1-N2' 的字串&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30000-32767</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A port range to reserve for services with NodePort visibility. 
Example: '30000-32767'. Inclusive at both ends of the range.
-->
保留給具有 NodePort 可見性的服務的埠範圍。
例如："30000-32767"。範圍的兩端都包括在內。
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
格式為 &lt;major&gt;.&lt;minor&gt;，例如："1.16"。
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
這可用於允許負載平衡器停止向該伺服器傳送流量。
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
值為 true 表示 HTTP 伺服器將繼續監聽直到耗盡所有非長時間執行的請求，
在此期間，所有傳入請求將被拒絕，狀態碼為 429，響應頭為 &quot;Retry-After&quot;，
此外，設定 &quot;Connection: close&quot; 響應頭是為了在空閒時斷開 TCP 連結。
</td>
</tr>

<tr>
<td colspan="2">--storage-backend string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The storage backend for persistence. Options: 'etcd3' (default).
-->
持久化儲存後端。選項："etcd3"（預設）。
</td>
</tr>

<tr>
<td colspan="2">--storage-media-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The media type to use to store objects in storage. 
Some resources or storage backends may only support a specific media type and will ignore this setting.
-->
用於在儲存中儲存物件的媒體型別。
某些資源或儲存後端可能僅支援特定的媒體型別，並且將忽略此設定。
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
為 HSTS 所設定的指令列表，用逗號分隔。
如果此列表為空，則不會新增 HSTS 指令。
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
包含用於 HTTPS 的預設 x509 證書的檔案。（CA 證書（如果有）在伺服器證書之後並置）。
如果啟用了 HTTPS 服務，並且未提供 <code>--tls-cert-file</code> 和
<code>--tls-private-key-file</code>，
為公共地址生成一個自簽名證書和金鑰，並將其儲存到 <code>--cert-dir</code> 指定的目錄中。
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
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384.<br/>
Insecure values: 
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.
-->
伺服器的密碼套件的列表，以逗號分隔。如果省略，將使用預設的 Go 密碼套件。
<br/>首選值：
TLS_AES_128_GCM_SHA256、TLS_AES_256_GCM_SHA384、TLS_CHACHA20_POLY1305_SHA256、TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA、
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384、TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256、TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256、TLS_RSA_WITH_AES_128_CBC_SHA、TLS_RSA_WITH_AES_128_GCM_SHA256、TLS_RSA_WITH_AES_256_CBC_SHA、TLS_RSA_WITH_AES_256_GCM_SHA384。
不安全的值有：
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_ECDSA_WITH_RC4_128_SHA、TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_RSA_WITH_RC4_128_SHA、TLS_RSA_WITH_3DES_EDE_CBC_SHA、TLS_RSA_WITH_AES_128_CBC_SHA256、TLS_RSA_WITH_RC4_128_SHA。
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
支援的最低 TLS 版本。可能的值：VersionTLS10，VersionTLS11，VersionTLS12，VersionTLS13
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
包含匹配 <code>--tls-cert-file</code> 的 x509 證書私鑰的檔案。
</td>
</tr>

<tr>
<td colspan="2">--tls-sni-cert-key string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：[]</td>
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
一對 x509 證書和私鑰檔案路徑，（可選）字尾為全限定域名的域名模式列表，可以使用帶有萬用字元的字首。
域模式也允許使用 IP 地址，但僅當 apiserver 對客戶端請求的IP地址具有可見性時，才應使用 IP。
如果未提供域模式，則提取證書的名稱。
非萬用字元匹配優先於萬用字元匹配，顯式域模式優先於提取出的名稱。
對於多個金鑰/證書對，請多次使用 <code>--tls-sni-cert-key</code>。
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
如果設定該值，這個檔案將被用於透過令牌認證來保護 API 服務的安全埠。
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
包含 API 伺服器跟蹤配置的檔案。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Print version information and quit
-->
列印版本資訊並退出
</td>
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
以逗號分隔的 <code>pattern=N</code> 設定列表，用於檔案過濾的日誌記錄（僅適用於 text 日誌格式）。
</td>
</tr>

<tr>
<td colspan="2">--watch-cache&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable watch caching in the apiserver
-->
在 API 伺服器中啟用監視快取。
</td>
</tr>

<tr>
<td colspan="2">--watch-cache-sizes strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Watch cache size settings for some resources (pods, nodes, etc.), comma separated. 
The individual setting format: resource[.group]#size, where resource is lowercase 
plural (no version), group is omitted for resources of apiVersion v1 (the legacy 
core API) and included for others, and size is a number. It takes effect when 
watch-cache is enabled. Some resources (replicationcontrollers, endpoints, nodes,
pods, services, apiservices.apiregistration.k8s.io) have system defaults set by 
heuristics, others default to default-watch-cache-size
-->
某些資源（Pods、Nodes 等）的監視快取大小設定，以逗號分隔。
每個資源對應的設定格式：<code>resource[.group]#size</code>，其中
<code>resource</code> 為小寫複數（無版本），
對於 apiVersion v1（舊版核心 API）的資源要省略 <code>group</code>，
對其它資源要給出 <code>group</code>；<code>size 為一個數字</code>。
啟用 <code>watch-cache</code> 時，此功能生效。
某些資源（<code>replicationcontrollers</code>、<code>endpoints</code>、
<code>nodes</code>、<code>pods</code>、<code>services</code>、
<code>apiservices.apiregistration.k8s.io</code>）
具有透過啟發式設定的系統預設值，其他資源預設為
<code>default-watch-cache-size<code>。
</td>
</tr>

</tbody>
</table>
