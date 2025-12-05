---
title: kubectl run
content_type: tool-reference
weight: 30
no_list: true
---
<!--
title: kubectl run
content_type: tool-reference
weight: 30
auto_generated: true
no_list: true
-->

## {{% heading "synopsis" %}}

<!--
Create and run a particular image in a pod.
-->
創建 Pod 並在其中運行特定映像檔。

```shell
kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server|client] [--overrides=inline-json] [--command] -- [COMMAND] [args...]
```

## {{% heading "examples" %}}

<!--
```
# Start a nginx pod
kubectl run nginx --image=nginx
  
# Start a hazelcast pod and let the container expose port 5701
kubectl run hazelcast --image=hazelcast/hazelcast --port=5701
  
# Start a hazelcast pod and set environment variables "DNS_DOMAIN=cluster" and "POD_NAMESPACE=default" in the container
kubectl run hazelcast --image=hazelcast/hazelcast --env="DNS_DOMAIN=cluster" --env="POD_NAMESPACE=default"
  
# Start a hazelcast pod and set labels "app=hazelcast" and "env=prod" in the container
kubectl run hazelcast --image=hazelcast/hazelcast --labels="app=hazelcast,env=prod"
  
# Dry run; print the corresponding API objects without creating them
kubectl run nginx --image=nginx --dry-run=client
  
# Start a nginx pod, but overload the spec with a partial set of values parsed from JSON
kubectl run nginx --image=nginx --overrides='{ "apiVersion": "v1", "spec": { ... } }'
  
# Start a busybox pod and keep it in the foreground, don't restart it if it exits
kubectl run -i -t busybox --image=busybox --restart=Never
  
# Start the nginx pod using the default command, but use custom arguments (arg1 .. argN) for that command
kubectl run nginx --image=nginx -- <arg1> <arg2> ... <argN>
  
# Start the nginx pod using a different command and custom arguments
kubectl run nginx --image=nginx --command -- <cmd> <arg1> ... <argN>
```
-->
```shell
# 啓動一個 nginx Pod
kubectl run nginx --image=nginx
  
# 啓動一個 hazelcast Pod 並讓容器暴露端口 5701
kubectl run hazelcast --image=hazelcast/hazelcast --port=5701
  
# 啓動一個 hazelcast Pod 並在容器中設置環境變量 "DNS_DOMAIN=cluster" 和 "POD_NAMESPACE=default"
kubectl run hazelcast --image=hazelcast/hazelcast --env="DNS_DOMAIN=cluster" --env="POD_NAMESPACE=default"
  
# 啓動一個 hazelcast Pod 並設置標籤 "app=hazelcast" 和 "env=prod"
kubectl run hazelcast --image=hazelcast/hazelcast --labels="app=hazelcast,env=prod"
  
# 試運行；打印相應的 API 對象而不創建它們
kubectl run nginx --image=nginx --dry-run=client
  
# 啓動一個 nginx Pod，但使用從 JSON 解析的部分設置值覆蓋 Pod 的 spec
kubectl run nginx --image=nginx --overrides='{ "apiVersion": "v1", "spec": { ... } }'
  
# 啓動一個 busybox Pod 並將其保持在前臺，如果退出則不重啓
kubectl run -i -t busybox --image=busybox --restart=Never
  
# 使用默認命令啓動一個 nginx Pod，併爲該默認命令使用自定義參數（arg1 .. argN）
kubectl run nginx --image=nginx -- <arg1> <arg2> ... <argN>
  
# 使用不同的命令和自定義參數啓動 nginx Pod
kubectl run nginx --image=nginx --command -- <cmd> <arg1> ... <argN>
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
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
<td colspan="2">--annotations strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Annotations to apply to the pod.
-->
要應用到 Pod 的多個註解。
</p></td>
</tr>

<tr>
<td colspan="2">--attach</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, wait for the Pod to start running, and then attach to the Pod as if 'kubectl attach ...' were called.  Default false, unless '-i/--stdin' is set, in which case the default is true. With '--restart=Never' the exit code of the container process is returned.
-->
如果爲 true，則等待 Pod 開始運行，然後像調用 “kubectl attach ...” 一樣掛接到 Pod。
預設值爲 false，除非設置了 “-i/--stdin”，則預設值爲 true。
使用 “--restart=Never” 時，返回容器進程的退出碼。
</p></td>
</tr>

<tr>
<td colspan="2">--cascade string[="background"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："background"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Must be &quot;background&quot;, &quot;orphan&quot;, or &quot;foreground&quot;. Selects the deletion cascading strategy for the dependents (e.g. Pods created by a ReplicationController). Defaults to background.
-->
必須是 "background"、"orphan" 或 "foreground"。
選擇依賴項（例如，由 ReplicationController 創建的 Pod）的刪除級聯策略，
預設爲 background。
</p></td>
</tr>

<tr>
<td colspan="2">--command</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true and extra arguments are present, use them as the 'command' field in the container, rather than the 'args' field which is the default.
-->
如果爲 true 並且存在額外的參數，則將它們用作容器中的 “command” 字段，而不是預設的 “args” 字段。
</p></td>
</tr>

<tr>
<td colspan="2">--dry-run string[="unchanged"]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Must be &quot;none&quot;, &quot;server&quot;, or &quot;client&quot;. If client strategy, only print the object that would be sent, without sending it. If server strategy, submit server-side request without persisting the resource.
-->
必須是 "none"、"server" 或 "client"。如果是 client 策略，僅打印將要發送的對象，而不實際發送。
如果是 server 策略，提交伺服器端請求而不持久化資源。
</p></td>
</tr>

<tr>
<td colspan="2">--env strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Environment variables to set in the container.
-->
要在容器中設置的環境變量。
</p></td>
</tr>

<tr>
<td colspan="2">--expose --port</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, create a ClusterIP service associated with the pod.  Requires --port.
-->
如果爲 true，則創建與 Pod 關聯的 ClusterIP 服務。需要指定 --port 參數。
</p></td>
</tr>

<tr>
<td colspan="2">--field-manager string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："kubectl-run"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of the manager used to track field ownership.
-->
用於跟蹤字段屬主關係的管理器的名稱。
</p></td>
</tr>

<tr>
<td colspan="2">-f, --filename strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
to use to replace the resource.
-->
用來替換資源。
</p></td>
</tr>

<tr>
<td colspan="2">--force</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, immediately remove resources from API and bypass graceful deletion. Note that immediate deletion of some resources may result in inconsistency or data loss and requires confirmation.
-->
如果爲真，則立即從 API 中移除資源並略過體面刪除處理。
請注意，立即刪除某些資源可能會導致不一致或資料丟失，並且需要確認操作。
</p></td>
</tr>

<tr>
<td colspan="2">--grace-period int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：-1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. Set to 1 for immediate shutdown. Can only be set to 0 when --force is true (force deletion).
-->
指定給資源的體面終止時間（以秒爲單位）。
如果爲負數則忽略，爲 1 表示立即關閉。
僅當 --force 爲真（強制刪除）時纔可以設置爲 0。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
help for run
-->
run 操作的幫助命令。
</p></td>
</tr>

<tr>
<td colspan="2">--image string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The image for the container to run.
-->
要運行的容器的映像檔。
</p></td>
</tr>

<tr>
<td colspan="2">--image-pull-policy string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The image pull policy for the container.  If left empty, this value will not be specified by the client and defaulted by the server.
-->
容器的映像檔拉取策略。如果留空，則此值不會由客戶端指定，而是預設由伺服器指定。
</p></td>
</tr>

<tr>
<td colspan="2">-k, --kustomize string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Process a kustomization directory. This flag can't be used together with -f or -R.
-->
處理 kustomization 目錄，此標誌不能與 -f 或 -R 一起使用。
</p></td>
</tr>

<tr>
<td colspan="2">-l, --labels string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Comma separated labels to apply to the pod. Will override previous values.
-->
要應用到 Pod 的、用逗號分隔的標籤。這將覆蓋之前的值。
</p></td>
</tr>

<tr>
<td colspan="2">--leave-stdin-open</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If the pod is started in interactive mode or with stdin, leave stdin open after the first attach completes. By default, stdin will be closed after the first attach completes.
-->
如果 Pod 以交互模式啓動或在啓動時帶有標準輸入，則在第一次掛接完成後保持標準輸入打開。
預設情況下，標準輸入會在第一次掛接完成後被關閉。
</p></td>
</tr>

<tr>
<td colspan="2">-o, --output string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath, jsonpath-as-json, jsonpath-file).
-->
輸出格式。可選值爲：
json、yaml、name、go-template、go-template-file、template、templatefile、jsonpath、jsonpath-as-json、jsonpath-file。
</p></td>
</tr>

<tr>
<td colspan="2">--override-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："merge"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The method used to override the generated object: json, merge, or strategic.
-->
用於覆蓋生成對象的方法：json、merge 或 strategic。
</p></td>
</tr>

<tr>
<td colspan="2">--overrides string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field.
-->
用於覆蓋已生成對象的內聯 JSON。如果此字段非空，則用於覆蓋已生成的對象。
要求對象提供一個有效的 apiVersion 字段。
</p></td>
</tr>

<tr>
<td colspan="2">--pod-running-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running
-->
等待至少一個 Pod 運行的時長（例如 5s、2m 或 3h，大於零）。
</p></td>
</tr>

<tr>
<td colspan="2">--port string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The port that this container exposes.
-->
指定容器暴露的端口。
</p></td>
</tr>

<tr>
<td colspan="2">--privileged</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, run the container in privileged mode.
-->
如果爲 true，則以特權模式運行容器。
</p></td>
</tr>

<tr>
<td colspan="2">-q, --quiet</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, suppress prompt messages.
-->
如果爲 true，則抑制提示資訊。
</p></td>
</tr>

<tr>
<td colspan="2">-R, --recursive</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
-->
以遞歸方式處理在 -f、--filename 中給出的目錄。當你想要管理位於同一目錄中的相關清單時很有用。
</p></td>
</tr>

<tr>
<td colspan="2">--restart string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："Always"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The restart policy for this Pod.  Legal values [Always, OnFailure, Never].
-->
指定 Pod 的重啓策略。有效值爲 Always、OnFailure、Never。
</p></td>
</tr>

<tr>
<td colspan="2">--rm</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, delete the pod after it exits.  Only valid when attaching to the container, e.g. with '--attach' or with '-i/--stdin'.
-->
如果爲 true，則在 Pod 退出後刪除它。僅在掛接到容器時有效，例如使用 “--attach” 或 “-i/--stdin”。
</p></td>
</tr>

<tr>
<td colspan="2">--save-config</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
-->
如果爲 true，則當前對象的設定將被保存在其註解中。否則，註解將保持不變。
當你希望後續對此對象執行 `kubectl apply` 操作時，此標誌很有用。
</p></td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果爲 true，在以 JSON 或 YAML 格式打印對象時保留 managedFields。
</p></td>
</tr>

<tr>
<td colspan="2">-i, --stdin</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Keep stdin open on the container in the pod, even if nothing is attached.
-->
即使沒有掛接任何內容，也保持 Pod 中容器的標準輸入處於打開狀態。
</p></td>
</tr>

<tr>
<td colspan="2">--template string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
-->
當 -o=go-template、-o=go-template-file 時使用的模板字符串或模板檔案路徑。
模板格式爲 golang 模板 [http://golang.org/pkg/text/template/#pkg-overview]。
</p></td>
</tr>

<tr>
<td colspan="2">--timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the object
-->
放棄刪除之前等待的時長；標誌值爲 0 表示根據對象的大小確定超時。
</p></td>
</tr>

<tr>
<td colspan="2">-t, --tty</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Allocate a TTY for the container in the pod.
-->
爲 Pod 中的容器分配 TTY。
</p></td>
</tr>

<tr>
<td colspan="2">--wait&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, wait for resources to be gone before returning. This waits for finalizers.
-->
如果爲 true，則等待資源消失後再返回。此參數會等待終結器被清空。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
UID to impersonate for the operation.
-->
操作所用的僞裝 UID。
</p></td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Default cache directory
-->
預設緩存目錄。
</p></td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a cert file for the certificate authority
-->
證書機構的證書檔案的路徑。
</p></td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a client certificate file for TLS
-->
TLS 客戶端證書檔案的路徑。
</p></td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a client key file for TLS
-->
TLS 客戶端密鑰檔案的路徑。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
CLI 請求要使用的 kubeconfig 檔案的路徑。
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
用於偏好設置的 kuberc 檔案的路徑。可以通過導出 KUBECTL_KUBERC=false
特性門控或關閉 KUBERC=off 特性來禁用此功能。
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
要求伺服器版本與客戶端版本匹配。
</p></td>
</tr>

<tr>
<td colspan="2">-n, --namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Password for basic authentication to the API server
-->
向 API 伺服器進行基本身份驗證所用的密碼。
</p></td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
-->
要記錄的性能分析資訊。可選值爲（none|cpu|heap|goroutine|threadcreate|block|mutex）。
</p></td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Name of the file to write the profile to
-->
性能分析資訊要寫入的目標檔案的名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The address and port of the Kubernetes API server
-->
Kubernetes API 伺服器的地址和端口。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction
-->
對儲存驅動的寫入操作將被緩存的時長；緩存的操作會作爲一個事務提交給非內存後端。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database name
-->
資料庫名稱。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database host:port
-->
資料庫 host:port
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database password
-->
資料庫密碼。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
use secure connection with database
-->
使用與資料庫的安全連接。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
table name
-->
表名。
</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
database username
-->
資料庫使用者名。
</p></td>
</tr>

<tr>
<td colspan="2">--tls-server-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version
-->
--version, --version=raw 打印版本資訊並退出；--version=vX.Y.Z... 設置報告的版本。
</p></td>
</tr>

<tr>
<td colspan="2">--warnings-as-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
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
