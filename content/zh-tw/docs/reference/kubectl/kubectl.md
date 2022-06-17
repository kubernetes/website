---
title: kubectl
content_type: tool-reference
weight: 28
---
<!--
---
title: kubectl
content_type: tool-reference
weight: 28
---
-->

## {{% heading "synopsis" %}}



<!--
kubectl controls the Kubernetes cluster manager.
-->
kubectl 管理控制 Kubernetes 叢集。


<!--
Find more information at: https://kubernetes.io/docs/reference/kubectl/overview/
-->
獲取更多資訊，請訪問 [kubectl 概述](/zh-cn/docs/reference/kubectl/overview/)。

```
kubectl [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>
    <tr>
      <td colspan="2">--add-dir-header</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, adds the file directory to the header of the log messages
      -->
      設定為 true 表示新增檔案目錄到日誌資訊頭中
      </td>
    </tr>
    <tr>
      <td colspan="2">--alsologtostderr</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      log to standard error as well as files
      -->
      表示將日誌輸出到檔案的同時輸出到 stderr
      </td>
    </tr>
    <tr>
      <td colspan="2">--as string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Username to impersonate for the operation
      -->
      以指定使用者的身份執行操作
      </td>
    </tr>
    <tr>
      <td colspan="2">--as-group stringArray</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      -->
      模擬指定的組來執行操作，可以使用這個標誌來指定多個組。
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
      <td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: "$HOME/.kube/cache"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Default cache directory
      -->
      預設快取目錄
      </td>
    </tr>
    <tr>
      <td colspan="2">--certificate-authority string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to a cert file for the certificate authority
      -->
      指向證書機構的 cert 檔案路徑
      </td>
    </tr>
    <tr>
      <td colspan="2">--client-certificate string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to a client certificate file for TLS
      -->
      TLS 使用的客戶端證書路徑
      </td>
    </tr>
    <tr>
      <td colspan="2">--client-key string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to a client key file for TLS
      -->
      TLS 使用的客戶端金鑰檔案路徑
      </td>
    </tr>
    <tr>
      <td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: 130.211.0.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
        <!--CIDRs opened in GCE firewall for L7 LB traffic proxy & health checks-->
        在 GCE 防火牆中開放的 CIDR，用來進行 L7 LB 流量代理和健康檢查。
      </td>
    </tr>
    <tr>
      <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      CIDRs opened in GCE firewall for L4 LB traffic proxy & health checks
      -->
      在 GCE 防火牆中開放的 CIDR，用來進行 L4 LB 流量代理和健康檢查。
      </td>
    </tr>
    <tr>
      <td colspan="2">--cluster string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The name of the kubeconfig cluster to use
      -->
      要使用的 kubeconfig 叢集的名稱
      </td>
    </tr>
    <tr>
      <td colspan="2">--context string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The name of the kubeconfig context to use
      -->
      要使用的 kubeconfig 上下文的名稱
      </td>
    </tr>
    <tr>
      <td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: 300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.
      -->
      表示 `notReady` 狀態的容忍度秒數：預設情況下，`NoExecute` 被新增到尚未具有此容忍度的每個 Pod 中。
      </td>
    </tr>
    <tr>
      <td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: 300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.
      -->
      表示 `unreachable` 狀態的容忍度秒數：預設情況下，`NoExecute` 被新增到尚未具有此容忍度的每個 Pod 中。
      </td>
    </tr>
    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      help for kubectl
      -->
      kubectl 操作的幫助命令
      </td>
    </tr>
    <tr>
      <td colspan="2">--insecure-skip-tls-verify</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      -->
      設定為 true，則表示不會檢查伺服器證書的有效性。這樣會導致你的 HTTPS 連線不安全。
      </td>
    </tr>
    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to the kubeconfig file to use for CLI requests.
      -->
      CLI 請求使用的 kubeconfig 配置檔案的路徑。
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: 0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      when logging hits line file:N, emit a stack trace
      -->
      當日志機制執行到指定檔案的指定行（file:N）時，列印呼叫堆疊資訊
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If non-empty, write log files in this directory
      -->
      如果不為空，則將日誌檔案寫入此目錄
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If non-empty, use this log file
      -->
      如果不為空，則將使用此日誌檔案
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: 1800</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.
      -->
      定義日誌檔案的最大尺寸。單位為兆位元組。如果值設定為 0，則表示日誌檔案大小不受限制。
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Maximum number of seconds between log flushes
      -->
      兩次日誌重新整理操作之間的最長時間（秒）
      </td>
    </tr>
    <tr>
      <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      log to standard error instead of files
      -->
      日誌輸出到 stderr 而不是檔案中
      </td>
    </tr>
    <tr>
      <td colspan="2">--match-server-version</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Require server version to match client version
      -->
      要求客戶端版本和服務端版本相匹配
      </td>
    </tr>
    <tr>
      <td colspan="2">-n, --namespace string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If present, the namespace scope for this CLI request
      -->
      如果存在，CLI 請求將使用此名稱空間
      </td>
    <tr>
      <td colspan="2">--one-output</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--If true, only write logs to their native severity level (vs also writing to each lower severity level-->
      如果為 true，則只將日誌寫入初始嚴重級別（而不是同時寫入所有較低的嚴重級別）。
      </td>
    </tr>
    </tr>
    <tr>
      <td colspan="2">--password string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Password for basic authentication to the API server
      -->
      API 伺服器進行基本身份驗證的密碼
      </td>
    </tr>
    <tr>
      <td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: "none"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
      -->
      要記錄的效能指標的名稱。可取 (none|cpu|heap|goroutine|threadcreate|block|mutex) 其中之一。
      </td>
    </tr>
    <tr>
      <td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: "profile.pprof"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Name of the file to write the profile to
      -->
      用於轉儲所記錄的效能資訊的檔名
      </td>
    </tr>
    <tr>
      <td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: "0"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
      -->
      放棄單個伺服器請求之前的等待時間，非零值需要包含相應時間單位（例如：1s、2m、3h）。零值則表示不做超時要求。
      </td>
    </tr>
    <tr>
      <td colspan="2">-s, --server string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The address and port of the Kubernetes API server
      -->
      Kubernetes API 伺服器的地址和埠
      </td>
    </tr>
    <tr>
      <td colspan="2">--skip-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, avoid header prefixes in the log messages
      -->
      設定為 true 則表示跳過在日誌訊息中出現 header 字首資訊
      </td>
    </tr>
    <tr>
      <td colspan="2">--skip-log-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, avoid headers when opening log files
      -->
      設定為 true 則表示在開啟日誌檔案時跳過 header 資訊
      </td>
    </tr>
    <tr>
      <td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: 2</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      logs at or above this threshold go to stderr
      -->
      等於或高於此閾值的日誌將輸出到標準錯誤輸出（stderr）
      </td>
    </tr>
    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Bearer token for authentication to the API server
      -->
      用於對 API 伺服器進行身份認證的持有者令牌
      </td>
    </tr>
    <tr>
      <td colspan="2">--user string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The name of the kubeconfig user to use
      -->
      指定使用 kubeconfig 配置檔案中的使用者名稱
      </td>
    </tr>
    <tr>
      <td colspan="2">--username string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Username for basic authentication to the API server
      -->
      用於 API 伺服器的基本身份驗證的使用者名稱
      </td>
    </tr>
    <tr>
      <td colspan="2">-v, --v Level</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      number for the log level verbosity
      -->
      指定輸出日誌的日誌詳細級別
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
      列印 kubectl 版本資訊並退出
      </td>
    </tr>
    <tr>
      <td colspan="2">--vmodule moduleSpec</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      comma-separated list of pattern=N settings for file-filtered logging
      -->
      以逗號分隔的 pattern=N 設定列表，用於過濾檔案的日誌記錄
      </td>
    </tr>
  </tbody>
</table>

## {{% heading "envvars" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">KUBECONFIG</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the kubectl configuration ("kubeconfig") file. Default: "$HOME/.kube/config"
-->
kubectl 的配置 ("kubeconfig") 檔案的路徑。預設值: "$HOME/.kube/config"
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_COMMAND_HEADERS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to false, turns off extra HTTP headers detailing invoked kubectl command (Kubernetes version v1.22 or later)
-->
設定為 false 時，關閉用於詳細說明被呼叫的 kubectl 命令的額外 HTTP 標頭 (Kubernetes 版本為 v1.22 或者更高)
</td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

<!--
* [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands#annotate)	 - Update the annotations on a resource
* [kubectl api-resources](/docs/reference/generated/kubectl/kubectl-commands#api-resources)	 - Print the supported API resources on the server
* [kubectl api-versions](/docs/reference/generated/kubectl/kubectl-commands#api-versions)	 - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply)	 - Apply a configuration to a resource by filename or stdin
* [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands#attach)	 - Attach to a running container
-->
* [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands#annotate)	 - 更新資源所關聯的註解
* [kubectl api-resources](/docs/reference/generated/kubectl/kubectl-commands#api-resources)	 - 列印伺服器上所支援的 API 資源
* [kubectl api-versions](/docs/reference/generated/kubectl/kubectl-commands#api-versions)	 - 以“組/版本”的格式輸出服務端所支援的 API 版本
* [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply)	 - 基於檔名或標準輸入，將新的配置應用到資源上
* [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands#attach)	 - 連線到一個正在執行的容器
<!--
* [kubectl auth](/docs/reference/generated/kubectl/kubectl-commands#auth)	 - Inspect authorization
* [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)	 - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](/docs/reference/generated/kubectl/kubectl-commands#certificate)	 - Modify certificate resources.
* [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands#cluster-info)	 - Display cluster info
* [kubectl completion](/docs/reference/generated/kubectl/kubectl-commands#completion)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)	 - Modify kubeconfig files
-->
* [kubectl auth](/docs/reference/generated/kubectl/kubectl-commands#auth)	 - 檢查授權資訊
* [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)	 - 對一個資源物件（Deployment、ReplicaSet 或 ReplicationController ）進行擴縮
* [kubectl certificate](/docs/reference/generated/kubectl/kubectl-commands#certificate)	 - 修改證書資源
* [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands#cluster-info)	 - 顯示叢集資訊
* [kubectl completion](/docs/reference/generated/kubectl/kubectl-commands#completion)	 - 根據已經給出的 Shell（bash 或 zsh），輸出 Shell 補全後的程式碼
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)	 - 修改 kubeconfig 配置檔案
<!--
* [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert)	 - Convert config files between different API versions
* [kubectl cordon](/docs/reference/generated/kubectl/kubectl-commands#cordon)	 - Mark node as unschedulable
* [kubectl cp](/docs/reference/generated/kubectl/kubectl-commands#cp)	 - Copy files and directories to and from containers.
* [kubectl create](/docs/reference/generated/kubectl/kubectl-commands#create)	 - Create a resource from a file or from stdin.
* [kubectl debug](/docs/reference/generated/kubectl/kubectl-commands#debug)	 - Create debugging sessions for troubleshooting workloads and nodes
* [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands#delete)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector
-->
* [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert)	 - 在不同的 API 版本之間轉換配置檔案
* [kubectl cordon](/docs/reference/generated/kubectl/kubectl-commands#cordon)	 - 標記節點為不可排程的
* [kubectl cp](/docs/reference/generated/kubectl/kubectl-commands#cp)	 - 將檔案和目錄拷入/拷出容器
* [kubectl create](/docs/reference/generated/kubectl/kubectl-commands#create)	 - 透過檔案或標準輸入來建立資源
* [kubectl debug](/docs/reference/generated/kubectl/kubectl-commands#debug)	 - 建立用於排查工作負載和節點故障的除錯會話
* [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands#delete)	 - 透過檔名、標準輸入、資源和名字刪除資源，或者透過資源和標籤選擇器來刪除資源
<!--
* [kubectl describe](/docs/reference/generated/kubectl/kubectl-commands#describe)	 - Show details of a specific resource or group of resources
* [kubectl diff](/docs/reference/generated/kubectl/kubectl-commands#diff)	 - Diff live version against would-be applied version
* [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands#drain)	 - Drain node in preparation for maintenance
* [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands#edit)	 - Edit a resource on the server
* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands#exec)	 - Execute a command in a container
* [kubectl explain](/docs/reference/generated/kubectl/kubectl-commands#explain)	 - Documentation of resources
* [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands#expose)	 - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
-->
* [kubectl describe](/docs/reference/generated/kubectl/kubectl-commands#describe)	 - 顯示某個資源或某組資源的詳細資訊
* [kubectl diff](/docs/reference/generated/kubectl/kubectl-commands#diff)	 - 顯示目前版本與將要應用的版本之間的差異
* [kubectl drain](/docs/reference/generated/kubectl/kubectl-commands#drain)	 - 騰空節點，準備維護
* [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands#edit)	 - 修改伺服器上的某資源
* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands#exec)	 - 在容器中執行相關命令
* [kubectl explain](/docs/reference/generated/kubectl/kubectl-commands#explain)	 - 顯示資源文件說明
* [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands#expose)	 - 給定副本控制器、服務、Deployment 或 Pod，將其暴露為新的 kubernetes Service
<!--
* [kubectl get](/docs/reference/generated/kubectl/kubectl-commands#get)	 - Display one or many resources
* [kubectl kustomize](/docs/reference/generated/kubectl/kubectl-commands#kustomize)	 - Build a kustomization target from a directory or a remote url.
* [kubectl label](/docs/reference/generated/kubectl/kubectl-commands#label)	 - Update the labels on a resource
* [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands#logs)	 - Print the logs for a container in a pod
* [kubectl options](/docs/reference/generated/kubectl/kubectl-commands#options)	 - Print the list of flags inherited by all commands
* [kubectl patch](/docs/reference/generated/kubectl/kubectl-commands#patch)	 - Update field(s) of a resource
-->
* [kubectl get](/docs/reference/generated/kubectl/kubectl-commands#get)	 - 顯示一個或者多個資源資訊
* [kubectl kustomize](/docs/reference/generated/kubectl/kubectl-commands#kustomize)	 - 從目錄或遠端 URL 中構建 kustomization
* [kubectl label](/docs/reference/generated/kubectl/kubectl-commands#label)	 - 更新資源的標籤
* [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands#logs)	 - 輸出 pod 中某容器的日誌
* [kubectl options](/docs/reference/generated/kubectl/kubectl-commands#options)	 - 列印所有命令都支援的共有引數列表
* [kubectl patch](/docs/reference/generated/kubectl/kubectl-commands#patch)	 - 基於策略性合併修補（Stategic Merge Patch）規則更新某資源中的欄位
<!--
* [kubectl plugin](/docs/reference/generated/kubectl/kubectl-commands#plugin)	 - Provides utilities for interacting with plugins.
* [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands#port-forward)	 - Forward one or more local ports to a pod
* [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy)	 - Run a proxy to the Kubernetes API server
* [kubectl replace](/docs/reference/generated/kubectl/kubectl-commands#replace)	 - Replace a resource by filename or stdin
* [kubectl rollout](/docs/reference/generated/kubectl/kubectl-commands#rollout)	 - Manage the rollout of a resource
* [kubectl run](/docs/reference/generated/kubectl/kubectl-commands#run)	 - Run a particular image on the cluster
-->
* [kubectl plugin](/docs/reference/generated/kubectl/kubectl-commands#plugin)	 - 執行命令列外掛
* [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands#port-forward)	 - 將一個或者多個本地埠轉發到 pod
* [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy)	 - 執行一個 kubernetes API 伺服器代理
* [kubectl replace](/docs/reference/generated/kubectl/kubectl-commands#replace)	 - 基於檔名或標準輸入替換資源
* [kubectl rollout](/docs/reference/generated/kubectl/kubectl-commands#rollout)	 - 管理資源的上線
* [kubectl run](/docs/reference/generated/kubectl/kubectl-commands#run)	 - 在叢集中使用指定映象啟動容器
<!--
* [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands#scale)	 - Set a new size for a Deployment, ReplicaSet or Replication Controller
* [kubectl set](/docs/reference/generated/kubectl/kubectl-commands#set)	 - Set specific features on objects
* [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)	 - Update the taints on one or more nodes
* [kubectl top](/docs/reference/generated/kubectl/kubectl-commands#top)	 - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](/docs/reference/generated/kubectl/kubectl-commands#uncordon)	 - Mark node as schedulable
* [kubectl version](/docs/reference/generated/kubectl/kubectl-commands#version)	 - Print the client and server version information
* [kubectl wait](/docs/reference/generated/kubectl/kubectl-commands#wait)	 - Experimental: Wait for a specific condition on one or many resources.
-->
* [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands#scale)	 - 為一個 Deployment、ReplicaSet 或 ReplicationController 設定一個新的規模尺寸值
* [kubectl set](/docs/reference/generated/kubectl/kubectl-commands#set)	 - 為物件設定功能特性
* [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)	 - 在一個或者多個節點上更新汙點配置
* [kubectl top](/docs/reference/generated/kubectl/kubectl-commands#top)	 - 顯示資源（CPU /記憶體/儲存）使用率
* [kubectl uncordon](/docs/reference/generated/kubectl/kubectl-commands#uncordon)	 - 標記節點為可排程的
* [kubectl version](/docs/reference/generated/kubectl/kubectl-commands#version)	 - 列印客戶端和伺服器的版本資訊
* [kubectl wait](/docs/reference/generated/kubectl/kubectl-commands#wait)	 - 實驗性：等待一個或多個資源達到某種狀態
