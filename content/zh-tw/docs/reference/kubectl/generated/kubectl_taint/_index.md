---
title: kubectl taint
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl taint
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Update the taints on one or more nodes.

  *  A taint consists of a key, value, and effect. As an argument here, it is expressed as key=value:effect.
  *  The key must begin with a letter or number, and may contain letters, numbers, hyphens, dots, and underscores, up to 253 characters.
  *  Optionally, the key can begin with a DNS subdomain prefix and a single '/', like example.com/my-app.
  *  The value is optional. If given, it must begin with a letter or number, and may contain letters, numbers, hyphens, dots, and underscores, up to 63 characters.
  *  The effect must be NoSchedule, PreferNoSchedule or NoExecute.
  *  Currently taint can only apply to node.
-->
更新一個或多個節點上的污點。

* 污點由鍵、值和效果組成。作爲此命令的參數，污點表示爲 key=value:effect。
* 鍵必須以字母或數字開頭，可以包含字母、數字、連字符、點和下劃線，最多 253 個字符。
* 可選地，鍵可以以 DNS 子域前綴加上一個 "/" 開頭，例如 example.com/my-app。
* 值是可選的。如果給定，則必須以字母或數字開頭，可以包含字母、數字、連字符、點和下劃線，最多 63 個字符。
* 效果必須是 NoSchedule、PreferNoSchedule 或 NoExecute。
* 目前污點只能應用於節點。

```shell
kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N
```

## {{% heading "examples" %}}

<!--
```shell
# Update node 'foo' with a taint with key 'dedicated' and value 'special-user' and effect 'NoSchedule'
# If a taint with that key and effect already exists, its value is replaced as specified
kubectl taint nodes foo dedicated=special-user:NoSchedule

# Remove from node 'foo' the taint with key 'dedicated' and effect 'NoSchedule' if one exists
kubectl taint nodes foo dedicated:NoSchedule-

# Remove from node 'foo' all the taints with key 'dedicated'
kubectl taint nodes foo dedicated-

# Add a taint with key 'dedicated' on nodes having label myLabel=X
kubectl taint node -l myLabel=X  dedicated=foo:PreferNoSchedule

# Add to node 'foo' a taint with key 'bar' and no value
kubectl taint nodes foo bar:NoSchedule
```
-->
```shell
# 使用帶有鍵爲 "dedicated" 和值爲 "special-user" 以及效果爲 "NoSchedule" 的污點來更新節點 "foo"
# 如果具有該鍵和效果的污點已經存在，則其值將按指定方式替換
kubectl taint nodes foo dedicated=special-user:NoSchedule

# 從節點 "foo" 中刪除鍵爲 "dedicated" 且效果爲 "NoSchedule" 的污點（如果存在）
kubectl taint nodes foo dedicated:NoSchedule-

# 從節點 "foo" 中刪除所有帶有鍵爲 "dedicated" 的污點
kubectl taint nodes foo dedicated-

# 在標籤爲 myLabel=X 的節點上添加鍵爲 'dedicated' 的污點
kubectl taint node -l myLabel=X  dedicated=foo:PreferNoSchedule

# 向節點 "foo" 添加一個帶有鍵 "bar" 且沒有值的污點
kubectl taint nodes foo bar:NoSchedule
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--all</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Select all nodes in the cluster
-->
選擇集羣中的所有節點
</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: true-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果爲 true，則當模板中缺少字段或映射鍵時，忽略模板中的任何錯誤。
僅適用於 golang 和 jsonpath 輸出格式。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "none"-->默認值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Must be &quot;none&quot;, &quot;server&quot;, or &quot;client&quot;. If client strategy, only print the object that would be sent, without sending it. If server strategy, submit server-side request without persisting the resource.
-->
必須是 "none"、"server" 或 "client"。如果是客戶端策略，則只打印要發送的對象，
而不發送該對象。如果是服務器策略，則提交服務器端請求而不持久化資源。
</p>
</td>
</tr>

<tr>
<td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "kubectl-taint"-->默認值："kubectl-taint"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Name of the manager used to track field ownership.
-->
用於追蹤字段所有權的管理者名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for taint
-->
關於 taint 的幫助信息。
</p>
</td>
</tr>

<tr>
<td colspan="2">-o, --output string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).
-->
輸出格式，可以爲以下選項之一：
（json、yaml、name、go-template、go-template-file、template、templatefile、jsonpath、jsonpath-as-json、jsonpath-file）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--overwrite</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, allow taints to be overwritten, otherwise reject taint updates that overwrite existing taints.
-->
如果爲真，則允許覆蓋污點，否則拒絕覆蓋現有污點的污點更新。
</p>
</td>
</tr>

<tr>
<td colspan="2">-l, --selector string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Selector (label query) to filter on, supports '=', '==', '!=', 'in', 'notin'.(e.g. -l key1=value1,key2=value2,key3 in (value3)). Matching objects must satisfy all of the specified label constraints.
-->
過濾所用的選擇算符（標籤查詢），支持 '='、'=='、'!='、'in' 和 'notin'。
（例如 <code>-l key1=value1,key2=value2,key3 in (value3)</code>）。
匹配的對象必須滿足所有指定的標籤約束。
</p>
</td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果爲 true，則在以 JSON 或 YAML 格式打印對象時保留 managedFields。
</p>
</td>
</tr>

<tr>
<td colspan="2">--template string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
-->
當 -o=go-template、-o=go-template-file 時使用的模板字符串或模板文件路徑。
模板格式爲 [golang 模板](http://golang.org/pkg/text/template/#pkg-overview)。
</p>
</td>
</tr>

<tr>
<td colspan="2">--validate string[="strict"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "strict"-->默認值："strict"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Must be one of: strict (or true), warn, ignore (or false).
&quot;true&quot; or &quot;strict&quot; will use a schema to validate the input and
fail the request if invalid. It will perform server side validation if ServerSideFieldValidation
is enabled on the api-server, but will fall back to less reliable client-side validation if not.
&quot;warn&quot; will warn about unknown or duplicate fields without blocking the request if
server-side field validation is enabled on the API server, and behave as &quot;ignore&quot; otherwise.
&quot;false&quot; or &quot;ignore&quot; will not perform any schema validation,
silently dropping any unknown or duplicate fields.
-->
必須是以下選項之一：strict（或 true）、warn、ignore（或 false）。
&quot;true&quot; 或 &quot;strict&quot; 將使用模式定義來驗證輸入，如果無效，則請求失敗。
如果在 API 服務器上啓用了 ServerSideFieldValidation，則執行服務器端驗證，
但如果未啓用此參數，它將回退到可靠性較低的客戶端驗證。
如果在 API 服務器上啓用了服務器端字段驗證，&quot;warn&quot; 將警告未知或重複的字段而不阻止請求，
否則操作與 &quot;ignore&quot; 的表現相同。
&quot;false&quot; 或 &quot;ignore&quot; 將不會執行任何模式定義檢查，而是靜默刪除所有未知或重複的字段。
</p>
</td>
</tr>

</tbody>
</table>

## {{% heading "parentoptions" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--as string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Username to impersonate for the operation. User could be a regular user or a service account in a namespace.
-->
操作所用的僞裝用戶名。用戶可以是常規用戶或命名空間中的服務賬號。
</p>
</td>
</tr>

<tr>
<td colspan="2">--as-group strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
-->
操作所用的僞裝用戶組，此標誌可以被重複設置以指定多個組。
</p>
</td>
</tr>

<tr>
<td colspan="2">--as-uid string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
UID to impersonate for the operation.
-->
操作所用的僞裝 UID。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "$HOME/.kube/cache"-->默認值："$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Default cache directory
-->
默認緩存目錄。
</p>
</td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a cert file for the certificate authority
-->
證書機構的證書文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a client certificate file for TLS
-->
TLS 客戶端證書文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a client key file for TLS
-->
TLS 客戶端密鑰文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td>
</td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The name of the kubeconfig cluster to use
-->
要使用的 kubeconfig 中集羣的名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--context string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The name of the kubeconfig context to use
-->
要使用的 kubeconfig 上下文的名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--disable-compression</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, opt-out of response compression for all requests to the server
-->
如果爲 true，則對服務器所有請求的響應不再壓縮。
</p>
</td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
-->
如果爲 true，則不檢查服務器證書的有效性。這將使你的 HTTPS 連接不安全。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to the kubeconfig file to use for CLI requests.
-->
CLI 請求要使用的 kubeconfig 文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kuberc string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to the kuberc file to use for preferences. This can be disabled by exporting KUBECTL_KUBERC=false feature gate or turning off the feature KUBERC=off.
-->
用於偏好設置的 kuberc 文件的路徑。可以通過導出 KUBECTL_KUBERC=false
特性門控或關閉 KUBERC=off 特性門控來禁用此功能。
</p>
</td>
</tr>

<tr>
<td colspan="2">--match-server-version</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Require server version to match client version
-->
要求服務器版本與客戶端版本匹配。
</p>
</td>
</tr>

<tr>
<td colspan="2">-n, --namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If present, the namespace scope for this CLI request
-->
如果存在，則是此 CLI 請求的命名空間範圍。
</p>
</td>
</tr>

<tr>
<td colspan="2">--password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Password for basic authentication to the API server
-->
對 API 服務器進行基本身份驗證所用的密碼。
</p>
</td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "none"-->默認值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
-->
要記錄的性能分析信息。可選值爲（none|cpu|heap|goroutine|threadcreate|block|mutex）。
</p>
</td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "profile.pprof"-->默認值："profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Name of the file to write the profile to
-->
性能分析信息要寫入的目標文件的名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "0"-->默認值："0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
-->
在放棄某個服務器請求之前等待的時長。非零值應包含相應的時間單位（例如 1s、2m、3h）。
值爲零表示請求不會超時。
</p>
</td>
</tr>

<tr>
<td colspan="2">-s, --server string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The address and port of the Kubernetes API server
-->
Kubernetes API 服務器的地址和端口。
</p>
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 1m0s-->默認值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction
-->
對存儲驅動的寫入操作將被緩存的時長；緩存的操作會作爲一個事務提交給非內存後端。
</p>
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "cadvisor"-->默認值："cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database name
-->
數據庫名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "localhost:8086"-->默認值："localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database host:port
-->
數據庫 host:port。
</p>
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "root"-->默認值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database password
-->
數據庫密碼。
</p>
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
use secure connection with database
-->
使用與數據庫的安全連接。
</p>
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "stats"-->默認值："stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
table name
-->
表名。
</p>
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "root"-->默認值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database username
-->
數據庫用戶名。
</p>
</td>
</tr>

<tr>
<td colspan="2">--tls-server-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
-->
服務器證書驗證所用的服務器名稱。如果未提供，則使用與服務器通信所用的主機名。
</p>
</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Bearer token for authentication to the API server
-->
向 API 服務器進行身份驗證的持有者令牌。
</p>
</td>
</tr>

<tr>
<td colspan="2">--user string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The name of the kubeconfig user to use
-->
要使用的 kubeconfig 用戶的名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--username string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Username for basic authentication to the API server
-->
對 API 服務器進行基本身份驗證時所用的用戶名。
</p>
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version
-->
--version, --version=raw 打印版本信息並退出；--version=vX.Y.Z... 設置報告的版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--warnings-as-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Treat warnings received from the server as errors and exit with a non-zero exit code
-->
將從服務器收到的警告視爲錯誤，並以非零退出碼退出。
</p>
</td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

<!--
* [kubectl](../kubectl/)	 - kubectl controls the Kubernetes cluster manager
-->
* [kubectl](../kubectl/) - kubectl 控制 Kubernetes 集羣管理器
