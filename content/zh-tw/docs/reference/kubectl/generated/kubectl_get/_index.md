---
title: kubectl get
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl get
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Display one or many resources.

 Prints a table of the most important information about the specified resources. You can filter the list using a label selector and the --selector flag. If the desired resource type is namespaced you will only see results in the current namespace unless you pass --all-namespaces.
-->
顯示一個或多個資源。

打印一張包含與指定資源相關的最重要信息的表格。
你可以使用標籤選擇算符（--selector 標誌）來過濾列表。
如果所請求的資源類型是命名空間作用域的，你只會看到當前命名空間中的結果，
除非你傳遞 --all-namespaces 參數。

<!--
 By specifying the output as 'template' and providing a Go template as the value of the --template flag, you can filter the attributes of the fetched resources.

Use "kubectl api-resources" for a complete list of supported resources.
-->
通過將輸出指定爲 “template” 並提供一個 Go 模板作爲 --template 標誌的值，你可以過濾所讀取資源的屬性。

使用 "kubectl api-resources" 獲取受支持的資源的完整列表。

```shell
kubectl get [(-o|--output=)json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file|custom-columns|custom-columns-file|wide] (TYPE[.VERSION][.GROUP] [NAME | -l label] | TYPE[.VERSION][.GROUP]/NAME ...) [flags]
```

## {{% heading "examples" %}}

<!--
```
  # List all pods in ps output format
  # List all pods in ps output format with more information (such as node name)
  # List a single replication controller with specified NAME in ps output format
  # List deployments in JSON output format, in the "v1" version of the "apps" API group
  # List a single pod in JSON output format
  # List a pod identified by type and name specified in "pod.yaml" in JSON output format
  # List resources from a directory with kustomization.yaml - e.g. dir/kustomization.yaml
  # Return only the phase value of the specified pod
  # List resource information in custom columns
  # List all replication controllers and services together in ps output format
  # List one or more resources by their type and names
  # List the 'status' subresource for a single pod
  # List all deployments in namespace 'backend'
  # List all pods existing in all namespaces
```
-->
```shell
# 以 ps 輸出格式列舉所有 Pod
kubectl get pods
  
# 以 ps 輸出格式列舉所有 Pod，並提供更多信息（如節點名稱）
kubectl get pods -o wide
  
# 以 ps 輸出格式列舉指定名稱的單個副本控制器
kubectl get replicationcontroller web
  
# 以 JSON 輸出格式列舉 "apps" API 組 "v1" 版本中的 Deployment
kubectl get deployments.v1.apps -o json
  
# 以 JSON 輸出格式列舉單個 Pod
kubectl get -o json pod web-pod-13je7
  
# 以 JSON 輸出格式列舉在 "pod.yaml" 中以 type 和 name 指定的 Pod
kubectl get -f pod.yaml -o json
  
# 列舉 kustomization.yaml 所在目錄（例如 dir/kustomization.yaml）中的資源
kubectl get -k dir/
  
# 僅返回指定 Pod 的 phase 值
kubectl get -o template pod/web-pod-13je7 --template={{.status.phase}}
  
# 在自定義列中列舉資源信息
kubectl get pod test-pod -o custom-columns=CONTAINER:.spec.containers[0].name,IMAGE:.spec.containers[0].image
  
# 以 ps 輸出格式同時列舉所有副本控制器和服務
kubectl get rc,services
  
# 按類型和名稱列舉一個或多個資源
kubectl get rc/web service/frontend pods/web-pod-13je7
  
# 列舉單個 Pod 的 “status” 子資源
kubectl get pod web-pod-13je7 --subresource status

# 列出 “backend” 命名空間中的所有 Deployment
kubectl get deployments.apps --namespace backend
  
# 列出所有命名空間中存在的所有 Pod
kubectl get pods --all-namespaces
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">-A, --all-namespaces</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace.
-->
如果存在此標誌，則跨所有命名空間列舉所請求的對象。
即使使用 --namespace 指定了命名空間，當前上下文中的命名空間也會被忽略。
</p></td>
</tr>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果爲 true，在模板中字段或映射鍵缺失時忽略模板中的錯誤。
僅適用於 golang 和 jsonpath 輸出格式。
</p></td>
</tr>

<tr>
<td colspan="2">--chunk-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：500</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Return large lists in chunks rather than all at once. Pass 0 to disable. This flag is beta and may change in the future.
-->
以塊的形式返回大的列表，而不是一次性全部返回。設爲 0 表示禁用。
此標誌處於 Beta 階段，未來可能會有變更。
</p></td>
</tr>

<tr>
<td colspan="2">--field-selector string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Selector (field query) to filter on, supports '=', '==', and '!='.(e.g. --field-selector key1=value1,key2=value2). The server only supports a limited number of field queries per type.
-->
過濾所用的選擇算符（字段查詢），支持 '='、'==' 和 '!='。
（例如 --field-selector key1=value1,key2=value2）。伺服器針對每種類型僅支持有限數量的字段查詢。
</p></td>
</tr>

<tr>
<td colspan="2">-f, --filename strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Filename, directory, or URL to files identifying the resource to get from a server.
-->
文件名、目錄或文件 URL 列表，用於標識要從伺服器獲取的資源。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for get
-->
get 操作的幫助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--ignore-not-found</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If set to true, suppresses NotFound error for specific objects that do not exist. Using this flag with commands that query for collections of resources has no effect when no resources are found.
-->
如果設置爲 true，則會抑制針對不存在的特定對象的 NotFound 錯誤。
當在查詢資源集合的命令中使用此標誌時，如果找不到資源，則不會產生效果。
</p></td>
</tr>

<tr>
<td colspan="2">-k, --kustomize string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Process the kustomization directory. This flag can't be used together with -f or -R.
-->
處理 kustomization 目錄。此標誌不能與 -f 或 -R 一起使用。
</p></td>
</tr>

<tr>
<td colspan="2">-L, --label-columns strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Accepts a comma separated list of labels that are going to be presented as columns. Names are case-sensitive. You can also use multiple flag options like -L label1 -L label2...
-->
接受一個用逗號分隔的標籤列表，這些標籤將被用作所打印表格中的不同列。
名稱區分大小寫。你也可以使用多個標誌選項，例如 -L label1 -L label2...
</p></td>
</tr>

<tr>
<td colspan="2">--no-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
When using the default or custom-column output format, don't print headers (default print headers).
-->
當使用默認或自定義列輸出格式時，不要打印標題（默認打印標題）。
</p></td>
</tr>

<tr>
<td colspan="2">-o, --output string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file, custom-columns, custom-columns-file, wide). See custom columns [https://kubernetes.io/docs/reference/kubectl/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [https://kubernetes.io/docs/reference/kubectl/jsonpath/].
-->
輸出格式。可選值爲：json、yaml、name、go-template、go-template-file、template、templatefile、jsonpath、
jsonpath-as-json、jsonpath-file、custom-columns、custom-columns-file、wide。參見自定義列
[https://kubernetes.io/zh-cn/docs/reference/kubectl/#custom-columns]、golang 模板
[http://golang.org/pkg/text/template/#pkg-overview] 和 jsonpath 模板
[https://kubernetes.io/zh-cn/docs/reference/kubectl/jsonpath/]。
</p></td>
</tr>

<tr>
<td colspan="2">--output-watch-events</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Output watch event objects when --watch or --watch-only is used. Existing objects are output as initial ADDED events.
-->
使用 --watch 或 --watch-only 標誌時輸出監視事件對象。現有對象被輸出爲初始的 ADDED 事件。
</p></td>
</tr>

<tr>
<td colspan="2">--raw string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Raw URI to request from the server.  Uses the transport specified by the kubeconfig file.
-->
向伺服器發送請求所用的原始 URI。使用 kubeconfig 文件中指定的傳輸方式。
</p></td>
</tr>

<tr>
<td colspan="2">-R, --recursive</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
-->
遞歸處理在 -f、--filename 中給出的目錄。當你想要管理位於同一目錄中的相關清單時很有用。
</p></td>
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
（例如 -l key1=value1,key2=value2,key3 in (value3)）。匹配的對象必須滿足所有指定的標籤約束。
</p></td>
</tr>

<tr>
<td colspan="2">--server-print&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, have the server return the appropriate table output. Supports extension APIs and CRDs.
-->
如果爲 true，則令伺服器返回適當的表格輸出。支持擴展 API 和 CRD。
</p></td>
</tr>

<tr>
<td colspan="2">--show-kind</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If present, list the resource type for the requested object(s).
-->
如果存在此標誌，則列舉所請求對象的資源類型。
</p></td>
</tr>

<tr>
<td colspan="2">--show-labels</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
When printing, show all labels as the last column (default hide labels column)
-->
打印時，將所有標籤顯示爲最後一列（默認隱藏標籤列）。
</p></td>
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
如果爲 true，在以 JSON 或 YAML 格式打印對象時保留 managedFields。
</p></td>
</tr>

<tr>
<td colspan="2">--sort-by string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string.
-->
如果非空，則使用此字段規約對列表類型進行排序。
字段規約表示爲 JSONPath 表達式（例如 “{.metadata.name}”）。
由此 JSONPath 表達式指定的 API 資源中的字段必須是一個整數或字符串。
</p></td>
</tr>

<tr>
<td colspan="2">--subresource string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If specified, gets the subresource of the requested object.
-->
如果指定，則讀取所請求對象的指定子資源。
此標誌處於 Beta 階段，未來可能會有所變化。
</p></td>
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
當 -o=go-template、-o=go-template-file 時所使用的模板字符串或模板文件路徑。
模板格式爲 golang 模板 [http://golang.org/pkg/text/template/#pkg-overview]。
</p></td>
</tr>

<tr>
<td colspan="2">-w, --watch</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
After listing/getting the requested object, watch for changes.
-->
列舉/獲取請求的對象後，監視其變化。
</p></td>
</tr>

<tr>
<td colspan="2">--watch-only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Watch for changes to the requested object(s), without listing/getting first.
-->
監視所請求對象的變化，而不先列舉/獲取對象。
</p></td>
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
操作所用的僞裝使用者名。使用者可以是常規使用者或命名空間中的服務賬號。
</p></td>
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
操作所用的僞裝使用者組，此標誌可以被重複設置以指定多個組。
</p></td>
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
</p></td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Default cache directory
-->
默認緩存目錄。
</p></td>
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
</p></td>
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
</p></td>
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
</p></td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The name of the kubeconfig cluster to use
-->
要使用的 kubeconfig 叢集的名稱。
</p></td>
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
</p></td>
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
如果爲 true，則對伺服器所有請求的響應不再壓縮。
</p></td>
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
如果爲 true，則不檢查伺服器證書的有效性。這將使你的 HTTPS 連接不安全。
</p></td>
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
</p></td>
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
特性門控或關閉 KUBERC=off 特性來禁用此功能。
</p></td>
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
要求伺服器版本與客戶端版本匹配。
</p></td>
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
</p></td>
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
向 API 伺服器進行基本身份驗證所用的密碼。
</p></td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
-->
要記錄的性能分析信息。可選值爲（none|cpu|heap|goroutine|threadcreate|block|mutex）。
</p></td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Name of the file to write the profile to
-->
性能分析信息要寫入的目標文件的名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
-->
在放棄某個伺服器請求之前等待的時長。非零值應包含相應的時間單位（例如 1s、2m、3h）。
值爲零表示請求不會超時。
</p></td>
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
Kubernetes API 伺服器的地址和端口。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction
-->
對存儲驅動的寫入操作將被緩存的時長；緩存的操作會作爲一個事務提交給非內存後端。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database name
-->
數據庫名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database host:port
-->
數據庫 host:port
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database password
-->
數據庫密碼。
</p></td>
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
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
table name
-->
表名。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
database username
-->
數據庫使用者名。
</p></td>
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
伺服器證書驗證所用的伺服器名稱。如果未提供，則使用與伺服器通信所用的主機名。
</p></td>
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
向 API 伺服器進行身份驗證的持有者令牌。
</p></td>
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
要使用的 kubeconfig 使用者的名稱。
</p></td>
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
向 API 伺服器進行基本身份驗證時所用的使用者名。
</p></td>
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
--version、--version=raw 打印版本信息並退出；--version=vX.Y.Z... 設置報告的版本。
</p></td>
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
將從伺服器收到的警告視爲錯誤，並以非零退出碼退出。
</p></td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

<!--
* [kubectl](../kubectl/)	 - kubectl controls the Kubernetes cluster manager
-->
* [kubectl](../kubectl/) - kubectl 控制 Kubernetes 叢集管理器
