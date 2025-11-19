---
title: kubectl
content_type: tool-reference
weight: 30
---
<!--
title: kubectl
content_type: tool-reference
weight: 30
-->

## {{% heading "synopsis" %}}

<!--
kubectl controls the Kubernetes cluster manager.
-->
kubectl 管理控制 Kubernetes 集羣。

<!--
Find more information in [Command line tool](/docs/reference/kubectl/) (`kubectl`).
-->
更多信息請查閱[命令行工具](/zh-cn/docs/reference/kubectl/)（`kubectl`）。

```shell
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
      設置爲 true 表示添加文件目錄到日誌信息頭中
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
      表示將日誌輸出到文件的同時輸出到 stderr
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
      以指定用戶的身份執行操作
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
      包含 Azure 容器倉庫配置信息的文件的路徑。
      </td>
    </tr>
    <tr>
      <td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："$HOME/.kube/cache"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Default cache directory
      -->
      默認緩存目錄
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
      指向證書機構的 cert 文件路徑
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
      TLS 使用的客戶端密鑰文件路徑
      </td>
    </tr>
    <tr>
      <td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：130.211.0.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
        <!--CIDRs opened in GCE firewall for L7 LB traffic proxy & health checks-->
        在 GCE 防火牆中開放的 CIDR，用來進行 L7 LB 流量代理和健康檢查。
      </td>
    </tr>
    <tr>
      <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
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
      要使用的 kubeconfig 集羣的名稱
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
      <td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.
      -->
      表示 `notReady` 狀態的容忍度秒數：默認情況下，`NoExecute` 被添加到尚未具有此容忍度的每個 Pod 中。
      </td>
    </tr>
    <tr>
      <td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.
      -->
      表示 `unreachable` 狀態的容忍度秒數：默認情況下，`NoExecute` 被添加到尚未具有此容忍度的每個 Pod 中。
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
      設置爲 true，則表示不會檢查服務器證書的有效性。這樣會導致你的 HTTPS 連接不安全。
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
      CLI 請求使用的 kubeconfig 配置文件的路徑。
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      when logging hits line file:N, emit a stack trace
      -->
      當日志機制運行到指定文件的指定行（file:N）時，打印調用堆棧信息
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
      如果不爲空，則將日誌文件寫入此目錄
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
      如果不爲空，則將使用此日誌文件
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：1800</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.
      -->
      定義日誌文件的最大尺寸。單位爲兆字節。如果值設置爲 0，則表示日誌文件大小不受限制。
      </td>
    </tr>
    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Maximum number of seconds between log flushes
      -->
      兩次日誌刷新操作之間的最長時間（秒）
      </td>
    </tr>
    <tr>
      <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      log to standard error instead of files
      -->
      日誌輸出到 stderr 而不是文件中
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
      如果存在，CLI 請求將使用此命名空間
      </td>
    <tr>
      <td colspan="2">--one-output</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      If true, only write logs to their native severity level (vs also writing to each lower severity level)
      -->
      如果爲 true，則只將日誌寫入初始嚴重級別（而不是同時寫入所有較低的嚴重級別）。
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
      API 服務器進行基本身份驗證的密碼
      </td>
    </tr>
    <tr>
      <td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："none"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)
      -->
      要記錄的性能指標的名稱。可取（none|cpu|heap|goroutine|threadcreate|block|mutex）其中之一。
      </td>
    </tr>
    <tr>
      <td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："profile.pprof"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Name of the file to write the profile to
      -->
      用於轉儲所記錄的性能信息的文件名
      </td>
    </tr>
    <tr>
      <td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："0"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
      -->
      放棄單個服務器請求之前的等待時間，非零值需要包含相應時間單位（例如：1s、2m、3h）。零值則表示不做超時要求。
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
      Kubernetes API 服務器的地址和端口
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
      設置爲 true 則表示跳過在日誌消息中出現 header 前綴信息
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
      設置爲 true 則表示在打開日誌文件時跳過 header 信息
      </td>
    </tr>
    <tr>
      <td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：2</td>
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
      用於對 API 服務器進行身份認證的持有者令牌
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
      指定使用 kubeconfig 配置文件中的用戶名
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
      用於 API 服務器的基本身份驗證的用戶名
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
      打印 kubectl 版本信息並退出
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
      以逗號分隔的 pattern=N 設置列表，用於過濾文件的日誌記錄
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
kubectl 的配置 ("kubeconfig") 文件的路徑。默認值："$HOME/.kube/config"
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
設置爲 false 時，將關閉額外的 HTTP 標頭，不再詳細說明被調用的 kubectl 命令（此變量適用於 Kubernetes v1.22 或更高版本）
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_EXPLAIN_OPENAPIV3</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Toggles whether calls to `kubectl explain` use the new OpenAPIv3 data source available. OpenAPIV3 is enabled by default since Kubernetes 1.24.
-->
切換對 `kubectl explain` 的調用是否使用可用的新 OpenAPIv3 數據源。OpenAPIV3 自 Kubernetes 1.24 起默認被啓用。
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_ENABLE_CMD_SHADOW</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to true, external plugins can be used as subcommands for builtin commands if subcommand does not exist. In alpha stage, this feature can only be used for create command(e.g. kubectl create networkpolicy).
-->
當設置爲 true 時，如果子命令不存在，外部插件可以用作內置命令的子命令。
此功能處於 alpha 階段，只能用於 create 命令（例如 kubectl create networkpolicy）。
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_PORT_FORWARD_WEBSOCKETS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to true, the kubectl port-forward command will attempt to stream using the websockets protocol.
If the upgrade to websockets fails, the commands will fallback to use the current SPDY protocol.
-->
當設置爲 true 時，`kubectl port-forward` 命令將嘗試使用 WebSocket 協議進行流式傳輸。
如果升級到 WebSocket 失敗，命令將回退到使用當前的 SPDY 協議。
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_REMOTE_COMMAND_WEBSOCKETS</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to true, the kubectl exec, cp, and attach commands will attempt to stream using the websockets protocol. If the upgrade to websockets fails, the commands will fallback to use the current SPDY protocol.
-->
當設置爲 true 時，kubectl exec、cp 和 attach 命令將嘗試使用 WebSocket 協議進行流式傳輸。
如果升級到 WebSocket 失敗，這些命令將回退爲使用當前的 SPDY 協議。
</td>
</tr>

<tr>
<td colspan="2">KUBECTL_KUBERC</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to true, kuberc file is taken into account to define user specific preferences.
-->
當設置爲 true 時，kuberc 文件會被納入考慮，用於定義用戶特定偏好設置。
</td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

<!--
* [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/) - Update the annotations on a resource
* [kubectl api-resources](/docs/reference/kubectl/generated/kubectl_api-resources/) - Print the supported API resources on the server
* [kubectl api-versions](/docs/reference/kubectl/generated/kubectl_api-versions/) - Print the supported API versions on the server,
  in the form of "group/version"
* [kubectl apply](/docs/reference/kubectl/generated/kubectl_apply/) - Apply a configuration to a resource by filename or stdin
* [kubectl attach](/docs/reference/kubectl/generated/kubectl_attach/) - Attach to a running container
-->
* [kubectl annotate](/zh-cn/docs/reference/kubectl/generated/kubectl_annotate/) - 更新資源所關聯的註解
* [kubectl api-resources](/docs/reference/kubectl/generated/kubectl_api-resources/) - 打印服務器上所支持的 API 資源
* [kubectl api-versions](/docs/reference/kubectl/generated/kubectl_api-versions/) - 以“組/版本”的格式輸出服務端所支持的 API 版本
* [kubectl apply](/docs/reference/kubectl/generated/kubectl_apply/) - 基於文件名或標準輸入，將新的配置應用到資源上
* [kubectl attach](/docs/reference/kubectl/generated/kubectl_attach/) - 掛接到一個正在運行的容器
<!--
* [kubectl auth](/docs/reference/kubectl/generated/kubectl_auth/) - Inspect authorization
* [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](/docs/reference/kubectl/generated/kubectl_certificate/) - Modify certificate resources.
* [kubectl cluster-info](/docs/reference/kubectl/generated/kubectl_cluster-info/) - Display cluster info
* [kubectl completion](/docs/reference/kubectl/generated/kubectl_completion/) - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](/docs/reference/kubectl/generated/kubectl_config/) - Modify kubeconfig files
-->
* [kubectl auth](/docs/reference/kubectl/generated/kubectl_auth/) - 檢查授權信息
* [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) - 對一個資源對象
  （Deployment、ReplicaSet 或 ReplicationController）進行自動擴縮
* [kubectl certificate](/docs/reference/kubectl/generated/kubectl_certificate/) - 修改證書資源
* [kubectl cluster-info](/docs/reference/kubectl/generated/kubectl_cluster-info/) - 顯示集羣信息
* [kubectl completion](/docs/reference/kubectl/generated/kubectl_completion/) - 根據已經給出的 Shell（bash 或 zsh），
  輸出 Shell 補全後的代碼
* [kubectl config](/docs/reference/kubectl/generated/kubectl_config/) - 修改 kubeconfig 配置文件
<!--
* [kubectl cordon](/docs/reference/kubectl/generated/kubectl_cordon/) - Mark node as unschedulable
* [kubectl cp](/docs/reference/kubectl/generated/kubectl_cp/) - Copy files and directories to and from containers.
* [kubectl create](/docs/reference/kubectl/generated/kubectl_create/) - Create a resource from a file or from stdin.
* [kubectl debug](/docs/reference/kubectl/generated/kubectl_debug/) - Create debugging sessions for troubleshooting workloads and nodes
* [kubectl delete](/docs/reference/kubectl/generated/kubectl_delete/) - Delete resources by filenames,
  stdin, resources and names, or by resources and label selector
-->
* [kubectl cordon](/docs/reference/kubectl/generated/kubectl_cordon/) - 標記節點爲不可調度的
* [kubectl cp](/docs/reference/kubectl/generated/kubectl_cp/) - 將文件和目錄拷入/拷出容器
* [kubectl create](/docs/reference/kubectl/generated/kubectl_create/) - 通過文件或標準輸入來創建資源
* [kubectl debug](/docs/reference/kubectl/generated/kubectl_debug/) - 創建用於排查工作負載和節點故障的調試會話
* [kubectl delete](/docs/reference/kubectl/generated/kubectl_delete/) - 通過文件名、標準輸入、資源和名字刪除資源，
  或者通過資源和標籤選擇算符來刪除資源
<!--
* [kubectl describe](/docs/reference/kubectl/generated/kubectl_describe/) - Show details of a specific resource or group of resources
* [kubectl diff](/docs/reference/kubectl/generated/kubectl_diff/) - Diff live version against would-be applied version
* [kubectl drain](/docs/reference/kubectl/generated/kubectl_drain/) - Drain node in preparation for maintenance
* [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/) - Edit a resource on the server
* [kubectl events](/docs/reference/kubectl/generated/kubectl_events/)  - List events
* [kubectl exec](/docs/reference/kubectl/generated/kubectl_exec/) - Execute a command in a container
* [kubectl explain](/docs/reference/kubectl/generated/kubectl_explain/) - Documentation of resources
* [kubectl expose](/docs/reference/kubectl/generated/kubectl_expose/) - Take a replication controller,
  service, deployment or pod and expose it as a new Kubernetes Service
-->
* [kubectl describe](/docs/reference/kubectl/generated/kubectl_describe/) - 顯示某個資源或某組資源的詳細信息
* [kubectl diff](/docs/reference/kubectl/generated/kubectl_diff/) - 顯示目前版本與將要應用的版本之間的差異
* [kubectl drain](/docs/reference/kubectl/generated/kubectl_drain/) - 騰空節點，準備維護
* [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/) - 修改服務器上的某資源
* [kubectl events](/docs/reference/kubectl/generated/kubectl_events/)  - 列舉事件
* [kubectl exec](/docs/reference/kubectl/generated/kubectl_exec/) - 在容器中執行相關命令
* [kubectl explain](/docs/reference/kubectl/generated/kubectl_explain/) - 顯示資源文檔說明
* [kubectl expose](/docs/reference/kubectl/generated/kubectl_expose/) - 給定副本控制器、服務、Deployment 或 Pod，
  將其暴露爲新的 kubernetes Service
<!--
* [kubectl get](/docs/reference/kubectl/generated/kubectl_get/) - Display one or many resources
* [kubectl kustomize](/docs/reference/kubectl/generated/kubectl_kustomize/) - Build a kustomization
  target from a directory or a remote url.
* [kubectl label](/docs/reference/kubectl/generated/kubectl_label/) - Update the labels on a resource
* [kubectl logs](/docs/reference/kubectl/generated/kubectl_logs/) - Print the logs for a container in a pod
* [kubectl options](/docs/reference/kubectl/generated/kubectl_options/) - Print the list of flags inherited by all commands
* [kubectl patch](/docs/reference/kubectl/generated/kubectl_patch/) - Update field(s) of a resource
-->
* [kubectl get](/docs/reference/kubectl/generated/kubectl_get/) - 顯示一個或者多個資源信息
* [kubectl kustomize](/docs/reference/kubectl/generated/kubectl_kustomize/) - 從目錄或遠程 URL 中構建 kustomization
* [kubectl label](/docs/reference/kubectl/generated/kubectl_label/) - 更新資源的標籤
* [kubectl logs](/docs/reference/kubectl/generated/kubectl_logs/) - 輸出 Pod 中某容器的日誌
* [kubectl options](/docs/reference/kubectl/generated/kubectl_options/) - 打印所有命令都支持的共有參數列表
* [kubectl patch](/docs/reference/kubectl/generated/kubectl_patch/) - 更新某資源中的字段
<!--
* [kubectl plugin](/docs/reference/kubectl/generated/kubectl_plugin/) - Provides utilities for interacting with plugins.
* [kubectl port-forward](/docs/reference/kubectl/generated/kubectl_port-forward/) - Forward one or more local ports to a pod
* [kubectl proxy](/docs/reference/kubectl/generated/kubectl_proxy/) - Run a proxy to the Kubernetes API server
* [kubectl replace](/docs/reference/kubectl/generated/kubectl_replace/) - Replace a resource by filename or stdin
* [kubectl rollout](/docs/reference/kubectl/generated/kubectl_rollout/) - Manage the rollout of a resource
* [kubectl run](/docs/reference/kubectl/generated/kubectl_run/) - Run a particular image on the cluster
-->
* [kubectl plugin](/docs/reference/kubectl/generated/kubectl_plugin/) - 運行命令行插件
* [kubectl port-forward](/docs/reference/kubectl/generated/kubectl_port-forward/) - 將一個或者多個本地端口轉發到 Pod
* [kubectl proxy](/docs/reference/kubectl/generated/kubectl_proxy/) - 運行一個 kubernetes API 服務器代理
* [kubectl replace](/docs/reference/kubectl/generated/kubectl_replace/) - 基於文件名或標準輸入替換資源
* [kubectl rollout](/docs/reference/kubectl/generated/kubectl_rollout/) - 管理資源的上線
* [kubectl run](/docs/reference/kubectl/generated/kubectl_run/) - 在集羣中使用指定鏡像啓動容器
<!--
* [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/) - Set a new size for a Deployment, ReplicaSet or Replication Controller
* [kubectl set](/docs/reference/kubectl/generated/kubectl_set/) - Set specific features on objects
* [kubectl taint](/docs/reference/kubectl/generated/kubectl_taint/) - Update the taints on one or more nodes
* [kubectl top](/docs/reference/kubectl/generated/kubectl_top/) - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](/docs/reference/kubectl/generated/kubectl_uncordon/) - Mark node as schedulable
* [kubectl version](/docs/reference/kubectl/generated/kubectl_version/) - Print the client and server version information
* [kubectl wait](/docs/reference/kubectl/generated/kubectl_wait/) - Experimental: Wait for a specific condition on one or many resources.
-->
* [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/) - 爲一個 Deployment、ReplicaSet 或
  ReplicationController 設置一個新的規模值
* [kubectl set](/docs/reference/kubectl/generated/kubectl_set/) - 爲對象設置功能特性
* [kubectl taint](/docs/reference/kubectl/generated/kubectl_taint/) - 在一個或者多個節點上更新污點配置
* [kubectl top](/docs/reference/kubectl/generated/kubectl_top/) - 顯示資源（CPU/內存/存儲）使用率
* [kubectl uncordon](/docs/reference/kubectl/generated/kubectl_uncordon/) - 標記節點爲可調度的
* [kubectl version](/docs/reference/kubectl/generated/kubectl_version/) - 打印客戶端和服務器的版本信息
* [kubectl wait](/docs/reference/kubectl/generated/kubectl_wait/) - 實驗級特性：等待一個或多個資源達到某種狀態
