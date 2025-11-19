---
title: kubelet
content_type: tool-reference
weight: 20
---

## {{% heading "synopsis" %}}

<!--
The kubelet is the primary "node agent" that runs on each node. It can
register the node with the apiserver using one of: the hostname; a flag to
override the hostname; or specific logic for a cloud provider.
-->
kubelet 是在每個節點上運行的主要 “節點代理”。它可以使用以下方式之一向 API 服務器註冊：
- 主機名（hostname）；
- 覆蓋主機名的參數；
- 特定於某雲驅動的邏輯。

<!--
The kubelet works in terms of a PodSpec. A PodSpec is a YAML or JSON object
that describes a pod. The kubelet takes a set of PodSpecs that are provided
through various mechanisms (primarily through the apiserver) and ensures that
the containers described in those PodSpecs are running and healthy. The
kubelet doesn't manage containers which were not created by Kubernetes.
-->
kubelet 是基於 PodSpec 來工作的。每個 PodSpec 是一個描述 Pod 的 YAML 或 JSON 對象。
kubelet 接受通過各種機制（主要是通過 apiserver）提供的一組 PodSpec，並確保這些
PodSpec 中描述的容器處於運行狀態且運行狀況良好。
kubelet 不管理不是由 Kubernetes 創建的容器。

<!--
Other than from a PodSpec from the apiserver, there are two ways that a
container manifest can be provided to the kubelet.
-->
除了來自 API 服務器的 PodSpec 之外，還可以通過以下兩種方式將容器清單（manifest）提供給 kubelet。

<!--
- File: Path passed as a flag on the command line. Files under this path will be
  monitored periodically for updates. The monitoring period is 20s by default
  and is configurable via a flag.
-->
- 文件（File）：利用命令行參數傳遞路徑。kubelet 週期性地監視此路徑下的文件是否有更新。
  監視週期默認爲 20s，且可通過參數進行配置。

<!--
- HTTP endpoint: HTTP endpoint passed as a parameter on the command line. This
  endpoint is checked every 20 seconds (also configurable with a flag).
-->
- HTTP 端點（HTTP endpoint）：利用命令行參數指定 HTTP 端點。
  此端點的監視週期默認爲 20 秒，也可以使用參數進行配置。

```
kubelet [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address for the kubelet to serve on (set to <code>0.0.0.0</code> or <code>::</code> for listening in all interfaces and IP address families)  (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 用來提供服務的 IP 地址（設置爲 <code>0.0.0.0</code> 或 <code>::</code> 表示監聽所有接口和 IP 地址族）。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--allowed-unsafe-sysctls strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated whitelist of unsafe sysctls or unsafe sysctl patterns (ending in <code>&ast;</code>). Use these at your own risk. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用逗號分隔的字符串序列設置允許使用的非安全的 sysctls 或 sysctl 模式（以 <code>&ast;</code> 結尾）。
使用此參數時風險自擔。（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables anonymous requests to the kubelet server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of <code>system:anonymous</code>, and a group name of <code>system:unauthenticated</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置爲 true 表示 kubelet 服務器可以接受匿名請求。未被任何認證組件拒絕的請求將被視爲匿名請求。
匿名請求的用戶名爲 <code>system:anonymous</code>，用戶組爲 <code>system:unauthenticated</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use the <code>TokenReview</code> API to determine authentication for bearer tokens. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
使用 <code>TokenReview</code> API 對持有者令牌進行身份認證。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：<code>2m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache responses from the webhook token authenticator. (default 2m0s) (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
對 Webhook 令牌認證組件所返回的響應的緩存時間。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--authorization-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值: <code>AlwaysAllow</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Authorization mode for kubelet server. Valid options are AlwaysAllow or Webhook. Webhook mode uses the SubjectAccessReview API to determine authorization. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 服務器的鑑權模式。可選值包括：AlwaysAllow、Webhook。
Webhook 模式使用 SubjectAccessReview API 鑑權。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：<code>5m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
對 Webhook 認證組件所返回的 “Authorized（已授權）” 應答的緩存時間。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>30s</code>-->默認值：<code>30s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
對 Webhook 認證組件所返回的 “Unauthorized（未授權）” 應答的緩存時間。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--bootstrap-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeconfig file that will be used to get client certificate for kubelet. If the file specified by <code>--kubeconfig</code> does not exist, the bootstrap kubeconfig is used to request a client certificate from the API server. On success, a kubeconfig file referencing the generated client certificate and key is written to the path specified by <code>--kubeconfig</code>. The client certificate and key file will be stored in the directory pointed by <code>--cert-dir</code>.
-->
某 kubeconfig 文件的路徑，該文件將用於獲取 kubelet 的客戶端證書。
如果 <code>--kubeconfig</code> 所指定的文件不存在，則使用引導所用 kubeconfig
從 API 服務器請求客戶端證書。成功後，將引用生成的客戶端證書和密鑰的 kubeconfig
寫入 --kubeconfig 所指定的路徑。客戶端證書和密鑰文件將存儲在 <code>--cert-dir</code>
所指的目錄。
</td>
</tr>

<tr>
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>/var/lib/kubelet/pki</code>-->默認值：<code>/var/lib/kubelet/pki</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The directory where the TLS certs are located. If <code>--tls-cert-file</code> and <code>--tls-private-key-file</code> are provided, this flag will be ignored.
-->
TLS 證書所在的目錄。如果設置了 <code>--tls-cert-file</code> 和 <code>--tls-private-key-file</code>，
則此標誌將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--cgroup-driver string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>cgroupfs</code>-->默認值：<code>cgroupfs</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Driver that the kubelet uses to manipulate cgroups on the host.  Possible values: &quot;<code>cgroupfs</code>&quot;, &quot;<code>systemd</code>&quot;. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 用來操作本機 cgroup 時使用的驅動程序。支持的選項包括 <code>cgroupfs</code>
和 <code>systemd</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--cgroup-root string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>''</code>-->默認值：<code>""</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional root cgroup to use for pods. This is handled by the container runtime on a best effort basis. Default: '', which means use the container runtime default. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
可選的選項，爲 Pod 設置根 cgroup。容器運行時會儘可能使用此配置。
默認值 <code>""</code> 意味着將使用容器運行時的默認設置。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--cgroups-per-qos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>true</code>-->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable creation of QoS cgroup hierarchy, if true top level QoS and pod cgroups are created. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
啓用創建 QoS cgroup 層次結構。此值爲 true 時 kubelet 爲 QoS 和 Pod 創建頂級的 cgroup。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the <code>CommonName</code> of the client certificate. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
如果設置了此參數，則使用對應文件中機構之一檢查請求中所攜帶的客戶端證書。
若客戶端證書通過身份認證，則其對應身份爲其證書中所設置的 <code>CommonName</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--cloud-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to the cloud provider configuration file. Empty string for no configuration file. (DEPRECATED: will be removed in 1.25 or later, in favor of removing cloud providers code from kubelet.)
-->
雲驅動配置文件的路徑。空字符串表示沒有配置文件。
已棄用：將在 1.25 或更高版本中移除，以便於從 kubelet 中去除雲驅動代碼。
</td>
</tr>

<tr>
<td colspan="2">--cloud-provider string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The provider for cloud services. Set to empty string for running with no cloud provider. Set to 'external' for running with an external cloud provider. If set, the cloud provider determines the name of the node (consult cloud provider documentation to determine if and how the hostname is used).
-->
雲服務的提供者。設置爲空字符串表示在沒有云驅動的情況下運行，
設置爲 'external' 表示使用外部雲驅動。
如果設置了此標誌，則雲驅動負責確定節點的名稱（參考雲提供商文檔以確定是否以及如何使用主機名）。
</td>
</tr>

<tr>
<td colspan="2">--cluster-dns strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of DNS server IP address. This value is used for containers DNS server in case of Pods with "<code>dnsPolicy: ClusterFirst</code>".<br/><B>Note:</B>: all DNS servers appearing in the list MUST serve the same set of records otherwise name resolution within the cluster may not work correctly. There is no guarantee as to which DNS server may be contacted for name resolution. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
DNS 服務器的 IP 地址，以逗號分隔。此標誌值用於 Pod 中設置了 “<code>dnsPolicy: ClusterFirst</code>”
時爲容器提供 DNS 服務。<br/><B>注意:</B>：列表中出現的所有 DNS 服務器必須包含相同的記錄組，
否則集羣中的名稱解析可能無法正常工作。至於名稱解析過程中會牽涉到哪些 DNS 服務器，
這一點無法保證。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--cluster-domain string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Domain for this cluster. If set, kubelet will configure all containers to search this domain in addition to the host's search domains. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
集羣的域名。如果設置了此值，kubelet 除了將主機的搜索域配置到所有容器之外，還會爲其
配置所搜這裏指定的域名。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubelet will load its initial configuration from this file. The path may be absolute or relative; relative paths start at the kubelet's current working directory. Omit this flag to use the built-in default configuration values. Command-line flags override configuration from this file.
-->
kubelet 將從此標誌所指的文件中加載其初始配置。此路徑可以是絕對路徑，也可以是相對路徑。
相對路徑按 kubelet 的當前工作目錄起計。省略此參數時 kubelet 會使用內置的默認配置值。
命令行參數會覆蓋此文件中的配置。
</td>
</tr>

<tr>
<td colspan="2">--config-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: ''</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a directory to specify drop-ins, allows the user to optionally specify additional configs to overwrite what is provided by default and in the `--config` flag.
-->
用於指定插件的目錄路徑，允許用戶通過指定其他配置來覆蓋默認值以及 `--config` 標誌中指定的內容。
<br/>
<!--
Note: Set the '<code>KUBELET_CONFIG_DROPIN_DIR_ALPHA</code>' environment variable to specify the directory.
-->
<B>注意</B>：設置 "<code>KUBELET_CONFIG_DROPIN_DIR_ALPHA</code>" 環境變量以指定目錄。
</td>

<tr>
<td colspan="2">--container-log-max-files int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 5-->默認值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Beta feature&gt; Set the maximum number of container log files that can be present for a container. The number must be &gt;= 2. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
【警告：Beta 特性】設置容器的日誌文件個數上限。此值必須大於等於 2。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--container-log-max-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>10Mi</code>-->默認值：<code>10Mi</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Beta feature&gt; Set the maximum size (e.g. <code>10Mi</code>) of container log file before it is rotated.  (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
【警告：Beta 特性】設置容器日誌文件在輪換生成新文件時之前的最大值（例如，<code>10Mi</code>）。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--container-runtime string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>remote</code>-->默認值：<code>remote</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The container runtime to use. Possible values: <code>docker</code>, <code>remote</code>.
-->
要使用的容器運行時。目前支持 <code>docker<code>、</code>remote</code>。
<!--
(DEPRECATED: will be removed in 1.27 as the only valid value is 'remote')
-->
（已棄用：將會在 1.27 版本中移除，因爲合法值只有 “remote”）
</td>
</tr>

<tr>
<td colspan="2">--container-runtime-endpoint string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>"unix:///run/containerd/containerd.sock"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The endpoint of remote runtime service. UNIX domain sockets are supported on Linux, while npipe and tcp endpoints are supported on windows. Examples: <code>unix:///path/to/runtime.sock</code>, <code>npipe:////./pipe/runtime</code>.
The endpoint of remote runtime service. UNIX domain sockets are supported on Linux, while 'npipe' and 'tcp' endpoints are supported on windows. Examples: <code>'unix:///path/to/runtime.sock'</code>, <code>'npipe:////./pipe/runtime'</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
遠程運行時服務的端點。目前支持 Linux 系統上的 UNIX 套接字和
Windows 系統上的 npipe 和 TCP 端點。例如：
<code>unix:///path/to/runtime.sock</code>、
<code>npipe:////./pipe/runtime</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable lock contention profiling, if profiling is enabled (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
當啓用了性能分析時，啓用鎖競爭分析。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-cfs-quota&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable CPU CFS quota enforcement for containers that specify CPU limits (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
爲設置了 CPU 限制的容器啓用 CPU CFS 配額保障。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-cfs-quota-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>100ms</code>-->默認值：<code>100ms</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets CPU CFS quota period value, <code>cpu.cfs_period_us</code>, defaults to Linux Kernel default. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置 CPU CFS 配額週期 <code>cpu.cfs_period_us</code>。默認使用 Linux 內核所設置的默認值。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: -->默認值：<code>none</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
CPU manager policy to use. Possible values: <code>none</code>, <code>static</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
要使用的 CPU 管理器策略。可選值包括：<code>none</code> 和 <code>static</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-policy-options string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value CPU manager policy options to use, to fine tune their behaviour. If not supplied, keep the default behaviour. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
一組用於微調 CPU 管理器策略行爲的 key=value 選項。如果未提供，保留默認行爲。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-reconcile-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>10s</code>-->默認值：<code>10s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Alpha feature&gt; CPU manager reconciliation period. Examples: <code>10s</code>, or <code>1m</code>. If not supplied, defaults to node status update frequency. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
【警告：Alpha 特性】設置 CPU 管理器的調和時間。例如：<code>10s</code> 或者 <code>1m</code>。
如果未設置，默認使用節點狀態更新頻率。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--enable-controller-attach-detach&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables the Attach/Detach controller to manage attachment/detachment of volumes scheduled to this node, and disables kubelet from executing any attach/detach operations. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
啓用 Attach/Detach 控制器來掛接和摘除調度到該節點的卷，同時禁用 kubelet 執行掛接和摘除操作。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--enable-debugging-handlers&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables server endpoints for log collection and local running of containers and commands. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
啓用服務器上用於日誌收集和在本地運行容器和命令的端點。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--enable-server&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>true</code>-->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable the kubelet's server. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
啓用 kubelet 服務器。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--enforce-node-allocatable strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>pods</code>-->默認值：<code>pods</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma separated list of levels of node allocatable enforcement to be enforced by kubelet. Acceptable options are <code>none</code>, <code>pods</code>, <code>system-reserved</code>, and <code>kube-reserved</code>. If the latter two options are specified, <code>--system-reserved-cgroup</code> and <code>--kube-reserved-cgroup</code> must also be set, respectively. If <code>none</code> is specified, no additional options should be set. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/">official documentation</a> for more details. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用逗號分隔的列表，包含由 kubelet 強制執行的節點可分配資源級別。
可選配置爲：<code>none</code>、<code>pods</code>、<code>system-reserved</code> 和 <code>kube-reserved</code>。
在設置 <code>system-reserved</code> 和 <code>kube-reserved</code> 這兩個值時，同時要求設置
<code>--system-reserved-cgroup</code> 和 <code>--kube-reserved-cgroup</code> 這兩個參數。
如果設置爲 <code>none</code>，則不需要設置其他參數。
有關更多詳細信息，請參閱<a href="https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/">官方文檔。</a>
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--event-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: 10-->默認值：100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of a bursty event records, temporarily allows event records to burst to this number, while still not exceeding <code>--event-qps</code>. The number must be &gt;= 0. If 0 will use default burst (100). (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
事件記錄的個數的突發峯值上限，在遵從 <code>--event-qps</code> 閾值約束的前提下
臨時允許事件記錄達到此數目。該數字必須大於等於 0。如果爲 0，則使用默認突發值（100）。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--event-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 5-->默認值：50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
QPS to limit event creations. The number must be &gt;= 0. If 0 will use default QPS (50). (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
QPS 用於限制事件創建的速率。該數字必須大於等於 0。如果爲 0，則使用默認 QPS 值（50）。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-hard strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>imagefs.available<15%,memory.available<100Mi,nodefs.available<10%</code>-->默認值：<code>imagefs.available&lt;15%,memory.available&lt;100Mi,nodefs.available&lt;10%</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of eviction thresholds (e.g. <code>memory.available<1Gi</code>) that if met would trigger a pod eviction. On a Linux node, the default value also includes <code>nodefs.inodesFree<5%</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
觸發 Pod 驅逐操作的一組硬性門限（例如：<code>memory.available&lt;1Gi</code>
（內存可用值小於 1G）設置。在 Linux 節點上，默認值還包括
<code>nodefs.inodesFree<5%</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-max-pod-grace-period int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum allowed grace period (in seconds) to use when terminating pods in response to a soft eviction threshold being met. If negative, defer to pod specified value. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
響應滿足軟性驅逐閾值（Soft Eviction Threshold）而終止 Pod 時使用的最長寬限期（以秒爲單位）。
如果設置爲負數，則遵循 Pod 的指定值。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-minimum-reclaim strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of minimum reclaims (e.g. <code>imagefs.available=2Gi</code>) that describes the minimum amount of resource the kubelet will reclaim when performing a pod eviction if that resource is under pressure. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
當某資源壓力過大時，kubelet 將執行 Pod 驅逐操作。
此參數設置軟性驅逐操作需要回收的資源的最小數量（例如：<code>imagefs.available=2Gi</code>）。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-pressure-transition-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>5m0s</code>-->默認值：<code>5m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Duration for which the kubelet has to wait before transitioning out of an eviction pressure condition. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 在驅逐壓力狀況解除之前的最長等待時間。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-soft strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of eviction thresholds (e.g. <code>memory.available>1.5Gi</code>) that if met over a corresponding grace period would trigger a pod eviction. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置一組驅逐閾值（例如：<code>memory.available&lt;1.5Gi</code>）。
如果在相應的寬限期內達到該閾值，則會觸發 Pod 驅逐操作。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-soft-grace-period strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of eviction grace periods (e.g. <code>memory.available=1m30s</code>) that correspond to how long a soft eviction threshold must hold before triggering a pod eviction. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置一組驅逐寬限期（例如，<code>memory.available=1m30s</code>），對應於觸發軟性 Pod
驅逐操作之前軟性驅逐閾值所需持續的時間長短。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--exit-on-lock-contention</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether kubelet should exit upon lock-file contention.
-->
設置爲 true 表示當發生鎖文件競爭時 kubelet 可以退出。
</td>
</tr>

<tr>
<td colspan="2">--experimental-allocatable-ignore-eviction&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>false</code>-->默認值：<code>false</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to <code>true</code>, hard eviction thresholds will be ignored while calculating node allocatable. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/">here</a> for more details. (DEPRECATED: will be removed in 1.25 or later)
-->
設置爲 <code>true</code> 表示在計算節點可分配資源數量時忽略硬性逐出閾值設置。
參考<a href="https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/">
相關文檔</a>。
已棄用：將在 1.25 或更高版本中移除。
</td>
</tr>

<tr>
<td colspan="2">--experimental-mounter-path string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>mount</code>-->默認值：<code>mount</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] Path of mounter binary. Leave empty to use the default <code>mount</code>. (DEPRECATED: will be removed in 1.24 or later, in favor of using CSI.)
-->
[實驗性特性] 卷掛載器（mounter）的可執行文件的路徑。設置爲空表示使用默認掛載器 <code>mount</code>。
已棄用：將在 1.24 或更高版本移除以支持 CSI。
</td>
</tr>

<tr>
<td colspan="2">--fail-cgroupv1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!-- Default: <code>true</code> -->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Prevent the kubelet from starting on the host using cgroup v1.
-->
禁止 kubelet 在使用 CGroup v1 的主機上啓動。
</td>
</tr>

<tr>
<td colspan="2">--fail-swap-on&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Makes the kubelet fail to start if swap is enabled on the node. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置爲 true 表示如果主機啓用了交換分區，kubelet 將直接失敗。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;一個由 “key=true/false” 組成的對偶&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of <code>key=value</code> pairs that describe feature gates for alpha/experimental features. Options are:<br/>
APIResponseCompression=true|false (BETA - default=true)<br/>
APISelfSubjectReview=true|false (BETA - default=true)<br/>
APIServerIdentity=true|false (BETA - default=true)<br/>
APIServerTracing=true|false (BETA - default=true)<br/>
APIServingWithRoutine=true|false (BETA - default=true)<br/>
AllAlpha=true|false (ALPHA - default=false)<br/>
AllBeta=true|false (BETA - default=false)<br/>
AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
AnonymousAuthConfigurableEndpoints=true|false (BETA - default=true)<br/>
AnyVolumeDataSource=true|false (BETA - default=true)<br/>
AuthorizeNodeWithSelectors=true|false (BETA - default=true)<br/>
AuthorizeWithSelectors=true|false (BETA - default=true)<br/>
BtreeWatchCache=true|false (BETA - default=true)<br/>
CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
CRDValidationRatcheting=true|false (BETA - default=true)<br/>
CSIMigrationPortworx=true|false (BETA - default=false)<br/>
CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
ClusterTrustBundle=true|false (ALPHA - default=false)<br/>
ClusterTrustBundleProjection=true|false (ALPHA - default=false)<br/>
ComponentFlagz=true|false (ALPHA - default=false)<br/>
ComponentStatusz=true|false (ALPHA - default=false)<br/>
ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
ConsistentListFromCache=true|false (BETA - default=true)<br/>
ContainerCheckpoint=true|false (BETA - default=true)<br/>
ContextualLogging=true|false (BETA - default=true)<br/>
CoordinatedLeaderElection=true|false (ALPHA - default=false)<br/>
CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
DRAAdminAccess=true|false (ALPHA - default=false)<br/>
DRAResourceClaimDeviceStatus=true|false (ALPHA - default=false)<br/>
DisableAllocatorDualWrite=true|false (ALPHA - default=false)
DynamicResourceAllocation=true|false (BETA - default=false)<br/>
EventedPLEG=true|false (ALPHA - default=false)<br/>
ExternalServiceAccountTokenSigner=true|false (ALPHA - default=false)<br/>
GracefulNodeShutdown=true|false (BETA - default=true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
HPAScaleToZero=true|false (ALPHA - default=false)<br/>
HonorPVReclaimPolicy=true|false (BETA - default=true)<br/>
ImageMaximumGCAge=true|false (BETA - default=true)<br/>
ImageVolume=true|false (ALPHA - default=false)<br/>
InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>
InPlacePodVerticalScalingAllocatedStatus=true|false (ALPHA - default=false)<br/>
InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
InformerResourceVersion=true|false (ALPHA - default=false)<br/>
JobBackoffLimitPerIndex=true|false (BETA - default=true)<br/>
JobManagedBy=true|false (ALPHA - default=false)<br/>
JobPodReplacementPolicy=true|false (BETA - default=true)<br/>
JobSuccessPolicy=true|false (BETA - default=true)<br/>
KubeletCgroupDriverFromCRI=true|false (BETA - default=true)<br/>
KubeletCrashLoopBackOffMax=true|false (ALPHA - default=false)<br/>
KubeletFineGrainedAuthz=true|false (ALPHA - default=false)<br/>
KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>
KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>
KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - default=true)<br/>
KubeletTracing=true|false (BETA - default=true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=true)<br/>
LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
LoggingBetaOptions=true|false (BETA - default=true)<br/>
MatchLabelKeysInPodAffinity=true|false (BETA - default=true)<br/>
MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
MemoryQoS=true|false (ALPHA - default=false)<br/>
MultiCIDRServiceAllocator=true|false (BETA - default=false)<br/>
MutatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>
NFTablesProxyMode=true|false (BETA - default=true)<br/>
NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>
NodeLogQuery=true|false (BETA - default=false)<br/>
NodeSwap=true|false (BETA - default=true)<br/>
OpenAPIEnums=true|false (BETA - default=true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
PodDeletionCost=true|false (BETA - default=true)<br/>
PodLevelResources=true|false (ALPHA - default=false)<br/>
PodLifecycleSleepAction=true|false (BETA - default=true)<br/>
PodLifecycleSleepActionAllowZero=true|false (ALPHA - default=false)<br/>
PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
PodObservedGenerationTracking=true|false (ALPHA - default=false)<br/>
PortForwardWebsockets=true|false (BETA - default=true)<br/>
ProcMountType=true|false (BETA - default=true)<br/>
QOSReserved=true|false (ALPHA - default=false)<br/>
RecoverVolumeExpansionFailure=true|false (BETA - default=true)<br/>
RecursiveReadOnlyMounts=true|false (BETA - default=true)<br/>
RelaxedDNSSearchValidation=true|false (ALPHA - default=false)<br/>
RelaxedEnvironmentVariableValidation=true|false (BETA - default=true)<br/>
ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
RemoteRequestHeaderUID=true|false (ALPHA - default=false)<br/>
ResilientWatchCacheInitialization=true|false (BETA - default=true)<br/>
ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
SELinuxChangePolicy=true|false (ALPHA - default=false)<br/>
SELinuxMount=true|false (ALPHA - default=false)<br/>
SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
SchedulerAsyncPreemption=true|false (ALPHA - default=false)<br/>
SchedulerQueueingHints=true|false (BETA - default=true)<br/>
SeparateCacheWatchRPC=true|false (BETA - default=true)<br/>
SeparateTaintEvictionController=true|false (BETA - default=true)<br/>
ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
ServiceAccountTokenNodeBinding=true|false (BETA - default=true)<br/>
ServiceTrafficDistribution=true|false (BETA - default=true)<br/>
SidecarContainers=true|false (BETA - default=true)<br/>
StorageNamespaceIndex=true|false (BETA - default=true)<br/>
StorageVersionAPI=true|false (ALPHA - default=false)<br/>
StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
StructuredAuthenticationConfiguration=true|false (BETA - default=true)<br/>
SupplementalGroupsPolicy=true|false (ALPHA - default=false)<br/>
SystemdWatchdog=true|false (BETA - default=true)<br/>
TopologyAwareHints=true|false (BETA - default=true)<br/>
TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
UserNamespacesSupport=true|false (BETA - default=false)<br/>
VolumeAttributesClass=true|false (BETA - default=false)<br/>
VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
WatchFromStorageWithoutResourceVersion=true|false (BETA - default=false)<br/>
WatchList=true|false (BETA - default=true)<br/>
WatchListClient=true|false (BETA - default=false)<br/>
WinDSR=true|false (ALPHA - default=false)<br/>
WinOverlay=true|false (BETA - default=true)<br/>
WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
WindowsGracefulNodeShutdown=true|false (ALPHA - default=false)<br/>
WindowsHostNetwork=true|false (ALPHA - default=true)<br/>
(DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)</td>
-->
用於 alpha 實驗性特性的特性開關組，每個開關以 key=value 形式表示。當前可用開關包括：</br>
APIResponseCompression=true|false (BETA - 默認值爲 true)<br/>
APISelfSubjectReview=true|false (BETA - 默認值爲 true)<br/>
APIServerIdentity=true|false (BETA - 默認值爲 true)<br/>
APIServerTracing=true|false (BETA - 默認值爲 true)<br/>
APIServingWithRoutine=true|false (BETA - 默認值爲 true)<br/>
AllAlpha=true|false (ALPHA - 默認值爲 false)<br/>
AllBeta=true|false (BETA - 默認值爲 false)<br/>
AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - 默認值爲 false)<br/>
AnonymousAuthConfigurableEndpoints=true|false (BETA - 默認值爲 true)<br/>
AnyVolumeDataSource=true|false (BETA - 默認值爲 true)<br/>
AuthorizeNodeWithSelectors=true|false (BETA - 默認值爲 true)<br/>
AuthorizeWithSelectors=true|false (BETA - 默認值爲 true)<br/>
BtreeWatchCache=true|false (BETA - 默認值爲 true)<br/>
CBORServingAndStorage=true|false (ALPHA - 默認值爲 false)<br/>
CPUManagerPolicyAlphaOptions=true|false (ALPHA - 默認值爲 false)<br/>
CPUManagerPolicyBetaOptions=true|false (BETA - 默認值爲 true)<br/>
CPUManagerPolicyOptions=true|false (BETA - 默認值爲 true)<br/>
CRDValidationRatcheting=true|false (BETA - 默認值爲 true)<br/>
CSIMigrationPortworx=true|false (BETA - 默認值爲 false)<br/>
CSIVolumeHealth=true|false (ALPHA - 默認值爲 false)<br/>
ClientsAllowCBOR=true|false (ALPHA - 默認值爲 false)<br/>
ClientsPreferCBOR=true|false (ALPHA - 默認值爲 false)<br/>
CloudControllerManagerWebhook=true|false (ALPHA - 默認值爲 false)<br/>
ClusterTrustBundle=true|false (ALPHA - 默認值爲 false)<br/>
ClusterTrustBundleProjection=true|false (ALPHA - 默認值爲 false)<br/>
ComponentFlagz=true|false (ALPHA - 默認值爲 false)<br/>
ComponentStatusz=true|false (ALPHA - 默認值爲 false)<br/>
ConcurrentWatchObjectDecode=true|false (BETA - 默認值爲 false)<br/>
ConsistentListFromCache=true|false (BETA - 默認值爲 true)<br/>
ContainerCheckpoint=true|false (BETA - 默認值爲 true)<br/>
ContextualLogging=true|false (BETA - 默認值爲 true)<br/>
CoordinatedLeaderElection=true|false (ALPHA - 默認值爲 false)<br/>
CrossNamespaceVolumeDataSource=true|false (ALPHA - 默認值爲 false)<br/>
CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默認值爲 false)<br/>
CustomResourceFieldSelectors=true|false (ALPHA - 默認值爲 false)<br/>
DRAAdminAccess=true|false (ALPHA - 默認值爲 false)<br/>
DRAResourceClaimDeviceStatus=true|false (ALPHA - 默認值爲 false)<br/>
DisableAllocatorDualWrite=true|false (ALPHA - 默認值爲 false)
DynamicResourceAllocation=true|false (BETA - 默認值爲 false)<br/>
EventedPLEG=true|false (ALPHA - 默認值爲 false)<br/>
ExternalServiceAccountTokenSigner=true|false (ALPHA - 默認值爲 false)<br/>
GracefulNodeShutdown=true|false (BETA - 默認值爲 true)<br/>
GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 默認值爲 true)<br/>
HPAScaleToZero=true|false (ALPHA - 默認值爲 false)<br/>
HonorPVReclaimPolicy=true|false (BETA - 默認值爲 true)<br/>
ImageMaximumGCAge=true|false (BETA - 默認值爲 true)<br/>
ImageVolume=true|false (ALPHA - 默認值爲 false)<br/>
InPlacePodVerticalScaling=true|false (ALPHA - 默認值爲 false)<br/>
InPlacePodVerticalScalingAllocatedStatus=true|false (ALPHA - 默認值爲 false)<br/>
InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - 默認值爲 false)<br/>
InTreePluginPortworxUnregister=true|false (ALPHA - 默認值爲 false)<br/>
InformerResourceVersion=true|false (ALPHA - 默認值爲 false)<br/>
JobBackoffLimitPerIndex=true|false (BETA - 默認值爲 true)<br/>
JobManagedBy=true|false (ALPHA - 默認值爲 false)<br/>
JobPodReplacementPolicy=true|false (BETA - 默認值爲 true)<br/>
JobSuccessPolicy=true|false (BETA - 默認值爲 true)<br/>
KubeletCgroupDriverFromCRI=true|false (BETA - 默認值爲 true)<br/>
KubeletCrashLoopBackOffMax=true|false (ALPHA - 默認值爲 false)<br/>
KubeletFineGrainedAuthz=true|false (ALPHA - 默認值爲 false)<br/>
KubeletInUserNamespace=true|false (ALPHA - 默認值爲 false)<br/>
KubeletPodResourcesDynamicResources=true|false (ALPHA - 默認值爲 false)<br/>
KubeletPodResourcesGet=true|false (ALPHA - 默認值爲 false)<br/>
KubeletSeparateDiskGC=true|false (BETA - 默認值爲 true)<br/>
KubeletPodResourcesGetAllocatable=true|false (BETA - 默認值爲 true)<br/>
KubeletTracing=true|false (BETA - 默認值爲 true)<br/>
LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - 默認值爲 true)<br/>
LoggingAlphaOptions=true|false (ALPHA - 默認值爲 false)<br/>
LoggingBetaOptions=true|false (BETA - 默認值爲 true)<br/>
MatchLabelKeysInPodAffinity=true|false (BETA - 默認值爲 true)<br/>
MatchLabelKeysInPodTopologySpread=true|false (BETA - 默認值爲 true)<br/>
MaxUnavailableStatefulSet=true|false (ALPHA - 默認值爲 false)<br/>
MemoryQoS=true|false (ALPHA - 默認值爲 false)<br/>
MultiCIDRServiceAllocator=true|false (BETA - 默認值爲 false)<br/>
MutatingAdmissionPolicy=true|false (ALPHA - 默認值爲 false)<br/>
NFTablesProxyMode=true|false (BETA - 默認值爲 true)<br/>
NodeInclusionPolicyInPodTopologySpread=true|false (BETA - 默認值爲 true)<br/>
NodeLogQuery=true|false (BETA - 默認值爲 false)<br/>
NodeSwap=true|false (BETA - 默認值爲 true)<br/>
OpenAPIEnums=true|false (BETA - 默認值爲 true)<br/>
PodAndContainerStatsFromCRI=true|false (ALPHA - 默認值爲 false)<br/>
PodDeletionCost=true|false (BETA - 默認值爲 true)<br/>
PodLevelResources=true|false (ALPHA - 默認值爲 false)<br/>
PodLifecycleSleepAction=true|false (BETA - 默認值爲 true)<br/>
PodLifecycleSleepActionAllowZero=true|false (ALPHA - 默認值爲 false)<br/>
PodLogsQuerySplitStreams=true|false (ALPHA - 默認值爲 false)<br/>
PodReadyToStartContainersCondition=true|false (BETA - 默認值爲 true)<br/>
PodObservedGenerationTracking=true|false (ALPHA - 默認值爲 false)<br/>
PortForwardWebsockets=true|false (BETA - 默認值爲 true)<br/>
ProcMountType=true|false (BETA - 默認值爲 true)<br/>
QOSReserved=true|false (ALPHA - 默認值爲 false)<br/>
RecoverVolumeExpansionFailure=true|false (BETA - 默認值爲 true)<br/>
RecursiveReadOnlyMounts=true|false (BETA - 默認值爲 true)<br/>
RelaxedDNSSearchValidation=true|false (ALPHA - 默認值爲 false)<br/>
RelaxedEnvironmentVariableValidation=true|false (BETA - 默認值爲 true)<br/>
ReloadKubeletServerCertificateFile=true|false (BETA - 默認值爲 true)<br/>
RemoteRequestHeaderUID=true|false (ALPHA - 默認值爲 false)<br/>
ResilientWatchCacheInitialization=true|false (BETA - 默認值爲 true)<br/>
ResourceHealthStatus=true|false (ALPHA - 默認值爲 false)<br/>
RotateKubeletServerCertificate=true|false (BETA - 默認值爲 true)<br/>
RuntimeClassInImageCriApi=true|false (ALPHA - 默認值爲 false)<br/>
SELinuxChangePolicy=true|false (ALPHA - 默認值爲 false)<br/>
SELinuxMount=true|false (ALPHA - 默認值爲 false)<br/>
SELinuxMountReadWriteOncePod=true|false (BETA - 默認值爲 true)<br/>
SchedulerAsyncPreemption=true|false (ALPHA - 默認值爲 false)<br/>
SchedulerQueueingHints=true|false (BETA - 默認值爲 true)<br/>
SeparateTaintEvictionController=true|false (BETA - 默認值爲 true)<br/>
ServiceAccountNodeAudienceRestriction=true|false (BETA - 默認值爲 true)<br/>
ServiceAccountTokenNodeBinding=true|false (BETA - 默認值爲 true)<br/>
ServiceTrafficDistribution=true|false (BETA - 默認值爲 true)<br/>
SidecarContainers=true|false (BETA - default=true)<br/>
StorageNamespaceIndex=true|false (BETA - 默認值爲 true)<br/>
StorageVersionAPI=true|false (ALPHA - 默認值爲 false)<br/>
StorageVersionHash=true|false (BETA - 默認值爲 true)<br/>
StorageVersionMigrator=true|false (ALPHA - 默認值爲 false)<br/>
StructuredAuthenticationConfiguration=true|false (BETA - 默認值爲 true)<br/>
SupplementalGroupsPolicy=true|false (ALPHA - 默認值爲 false)<br/>
SystemdWatchdog=true|false (BETA - 默認值爲 true)<br/>
TopologyAwareHints=true|false (BETA - 默認值爲 true)<br/>
TopologyManagerPolicyAlphaOptions=true|false (ALPHA - 默認值爲 false)<br/>
TopologyManagerPolicyBetaOptions=true|false (BETA - 默認值爲 true)<br/>
TranslateStreamCloseWebsocketRequests=true|false (BETA - 默認值爲 true)<br/>
UnauthenticatedHTTP2DOSMitigation=true|false (BETA - 默認值爲 true)<br/>
UnknownVersionInteroperabilityProxy=true|false (ALPHA - 默認值爲 false)<br/>
UserNamespacesPodSecurityStandards=true|false (ALPHA - 默認值爲 false)<br/>
UserNamespacesSupport=true|false (BETA - 默認值爲 false)<br/>
VolumeAttributesClass=true|false (BETA - 默認值爲 false)<br/>
VolumeCapacityPriority=true|false (ALPHA - 默認值爲 false)<br/>
WatchCacheInitializationPostStartHook=true|false (BETA - 默認值爲 false)<br/>
WatchFromStorageWithoutResourceVersion=true|false (BETA - 默認值爲 false)<br/>
WatchList=true|false (ALPHA - 默認值爲 false)<br/>
WatchList=true|false (BETA - 默認值爲 true)<br/>
WatchListClient=true|false (BETA - 默認值爲 false)<br/>
WinDSR=true|false (ALPHA - 默認值爲 false)<br/>
WinOverlay=true|false (BETA - 默認值爲 true)<br/>
WindowsCPUAndMemoryAffinity=true|false (ALPHA - 默認值爲 false)<br/>
WindowsGracefulNodeShutdown=true|false (ALPHA - 默認值爲 false)<br/>
WindowsHostNetwork=true|false (ALPHA - 默認值爲 true)<br/>
已棄用: 應在 <code>--config</code> 所給的配置文件中進行設置。
（<a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file">進一步瞭解</a>）
</td>
</tr>

<tr>
<td colspan="2">--file-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>20s</code>-->默認值：<code>20s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Duration between checking config files for new data. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
檢查配置文件中新數據的時間間隔。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--hairpin-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>promiscuous-bridge</code>-->默認值：<code>promiscuous-bridge</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
How should the kubelet setup hairpin NAT. This allows endpoints of a Service to load balance back to themselves if they should try to access their own Service. Valid values are <code>promiscuous-bridge</code>, <code>hairpin-veth</code> and <code>none</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置 kubelet 執行髮夾模式（hairpin）網絡地址轉譯的方式。
該模式允許後端端點對其自身服務的訪問能夠再次經由負載均衡轉發回自身。
可選項包括 <code>promiscuous-bridge</code>、<code>hairpin-veth</code> 和 <code>none</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>127.0.0.1</code>-->默認值：<code>127.0.0.1</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address for the healthz server to serve on (set to <code>0.0.0.0</code> or <code>::</code> for listening in all interfaces and IP families). (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
healthz 服務器提供服務所使用的 IP 地址（設置爲 <code>0.0.0.0</code> 或 <code>::</code> 表示監聽所有接口和 IP 協議族。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--healthz-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10248-->默認值：10248</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port of the localhost healthz endpoint (set to <code>0</code> to disable). (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
本地 healthz 端點使用的端口（設置爲 0 表示禁用）。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kubelet
-->
kubelet 操作的幫助命令
</td>
</tr>

<tr>
<td colspan="2">--hostname-override string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, will use this string as identification instead of the actual hostname. If <code>--cloud-provider</code> is set, the cloud provider determines the name of the node (consult cloud provider documentation to determine if and how the hostname is used).
-->
如果爲非空，將使用此字符串而不是實際的主機名作爲節點標識。如果設置了
<code>--cloud-provider</code>，則雲驅動將確定節點的名稱
（請查閱雲服務商文檔以確定是否以及如何使用主機名）。
</td>
</tr>

<tr>
<td colspan="2">--http-check-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>20s</code>-->默認值：<code>20s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Duration between checking HTTP for new data. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
HTTP 服務以獲取新數據的時間間隔。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--image-credential-provider-bin-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to the directory where credential provider plugin binaries are located.
-->
指向憑據提供組件可執行文件所在目錄的路徑。
</td>
</tr>

<tr>
<td colspan="2">--image-credential-provider-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to the credential provider plugin config file.</td>
-->
指向憑據提供插件配置文件所在目錄的路徑。
</tr>

<tr>
<td colspan="2">--image-gc-high-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 85-->默認值：85</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The percent of disk usage after which image garbage collection is always run. Values must be within the range [0, 100], To disable image garbage collection, set to 100.   (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
鏡像垃圾回收上限。磁盤使用空間達到該百分比時，鏡像垃圾回收將持續工作。
值必須在 [0，100] 範圍內。要禁用鏡像垃圾回收，請設置爲 100。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--image-gc-low-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 80-->默認值：80</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. Values must be within the range [0, 100] and should not be larger than that of <code>--image-gc-high-threshold</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
鏡像垃圾回收下限。磁盤使用空間在達到該百分比之前，鏡像垃圾回收操作不會運行。
值必須在 [0，100] 範圍內，並且不得大於 <code>--image-gc-high-threshold</code>的值。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--image-service-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The endpoint of remote image service. If not specified, it will be the same with <code>--container-runtime-endpoint</code> by default. UNIX domain socket are supported on Linux, while `npipe` and `tcp` endpoints are supported on Windows. Examples: <code>unix:///path/to/runtime.sock</code>, <code>npipe:////./pipe/runtime</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
遠程鏡像服務的端點。若未設定則默認情況下使用 <code>--container-runtime-endpoint</code>
的值。目前支持的類型包括在 Linux 系統上的 UNIX 套接字端點和 Windows 系統上的 npipe 和 TCP 端點。
例如：<code>unix:///var/run/dockershim.sock</code>、<code>npipe:////./pipe/dockershim</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 14-->默認值：14</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The bit of the <code>fwmark</code> space to mark packets for SNAT. Must be within the range [0, 31]. Please match this parameter with corresponding parameter in <code>kube-proxy</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
標記數據包將進行 SNAT 的 fwmark 空間位設置。必須在 [0，31] 範圍內。
請將此參數與 <code>kube-proxy</code> 中的相應參數匹配。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--kernel-memcg-notification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If enabled, the kubelet will integrate with the kernel memcg notification to determine if memory eviction thresholds are crossed rather than polling. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
若啓用，則 kubelet 將與內核中的 memcg 通知機制集成，不再使用輪詢的方式來判定
是否 Pod 達到內存驅逐閾值。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10-->默認值：100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Burst to use while talking with kubernetes API server. The number must be >= 0. If 0 will use default burst (100). Doesn't cover events and node heartbeat apis which rate limiting is controlled by a different set of flags. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
每秒發送到 API 服務器 的突發請求數量上限。
該數字必須大於或等於 0。如果爲 0，則使用默認的突發值（100）。
不包括事件和節點心跳 API，其速率限制由一組不同的標誌控制。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>application/vnd.kubernetes.protobuf</code>-->默認值：<code>application/vnd.kubernetes.protobuf</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Content type of requests sent to apiserver. (default "application/vnd.kubernetes.protobuf") (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
發送到 apiserver 的請求的內容類型。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 5-->默認值：50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
QPS to use while talking with kubernetes API server. The number must be &gt;= 0. If 0 will use default QPS (5). Doesn't cover events and node heartbeat apis which rate limiting is controlled by a different set of flags. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
與 apiserver 通信的每秒查詢個數（QPS）。
此值必須 &gt;= 0。如果爲 0，則使用默認 QPS（50）。
不包含事件和節點心跳 API，它們的速率限制是由一組不同的標誌所控制。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--kube-reserved strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: &lt;None&gt;-->默認值：&lt;None&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of <code>&lt;resource name&gt;=&lt;resource quantity&gt;</code> (e.g. <code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>) pairs that describe resources reserved for kubernetes system components. Currently <code>cpu</code>, <code>memory</code> and local <code>ephemeral-storage</code> for root file system are supported. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#kube-reserved">here</a> for more detail. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubernetes 系統預留的資源配置，以一組 <code>&lt;資源名稱&gt;=&lt;資源數量&gt;</code> 格式表示。
（例如：<code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>）。
當前支持 <code>cpu</code>、<code>memory</code> 和用於根文件系統的 <code>ephemeral-storage</code>。
請參閱<a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#kube-reserved">這裏</a>獲取更多信息。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--kube-reserved-cgroup string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>''</code>-->默認值：<code>""</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Absolute name of the top level cgroup that is used to manage kubernetes components for which compute resources were reserved via <code>--kube-reserved</code> flag. Ex. <code>/kube-reserved</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
給出某個頂層 cgroup 絕對名稱，該 cgroup 用於管理通過標誌 <code>--kube-reserved</code>
爲 kubernetes 組件所預留的計算資源。例如：<code>"/kube-reserved"</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--log-text-info-buffer-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>'0'</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Alpha] In text format with split output streams, the info messages can be buffered for a while to increase performance.
The default value of zero bytes disables buffering.
The size can be specified as number of bytes (512), multiples of 1000 (1K), multiples of 1024 (2Ki), or powers of those (3M, 4G, 5Mi, 6Gi).
Enable the <code>LoggingAlphaOptions</code> feature gate to use this. 
(DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag.
See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
[Alpha] 在具有分割輸出流的文本格式中，信息消息可以被緩衝一段時間以提高性能。
默認值零字節表示禁用緩衝機制。
大小可以指定爲字節數（512）、1000 的倍數（1K）、1024 的倍數（2Ki）或它們的冪（3M、4G、5Mi、6Gi）。
啓用 <code>LoggingAlphaOptions</code> 特性門控來使用它。
（已棄用：應通過 kubelet 的 <code>--config</code> 標誌指定的配置文件來設置此參數。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>


<tr>
<td colspan="2">--log-text-split-stream</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Alpha] In text format, write error messages to stderr and info messages to stdout.
The default is to write a single stream to stdout.
Enable the <code>LoggingAlphaOptions</code> feature gate to use this.
(DEPRECATED: This parameter should be set via the config file specified by the Kubelet's <code>--config</code> flag.
See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
[Alpha] 以文本格式，將錯誤消息寫入 stderr，將信息消息寫入 stdout。
默認是將單個流寫入標準輸出。
啓用 <code>LoggingAlphaOptions</code> 特性門控以使用它。
（已棄用：應通過 kubelet 的 <code>--config</code> 標誌指定的配置文件來設置此參數。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeconfig file, specifying how to connect to the API server. Providing <code>--kubeconfig</code> enables API server mode, omitting <code>--kubeconfig</code> enables standalone mode.
-->
kubeconfig 配置文件的路徑，指定如何連接到 API 服務器。
提供 <code>--kubeconfig</code> 將啓用 API 服務器模式，而省略 <code>--kubeconfig</code> 將啓用獨立模式。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional absolute name of cgroups to create and run the kubelet in. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用於創建和運行 kubelet 的 cgroup 的絕對名稱。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--local-storage-capacity-isolation&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: <code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, local ephemeral storage isolation is enabled. Otherwise, local storage isolation feature will be disabled. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
如果此值爲 true，將啓用本地臨時存儲隔離。
否則，本地存儲隔離功能特性將被禁用。
（已棄用：這個參數應該通過 kubelet 的 <code>--config</code> 標誌指定的配置文件來設置。
有關詳細信息，請參閱 <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a>）。
</td>
</tr>

<tr>
<td colspan="2">--lock-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Alpha feature&gt; The path to file for kubelet to use as a lock file.
-->
【警告：Alpha 特性】kubelet 用作鎖文件的文件路徑。
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>5s</code>-->默認值：<code>5s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes
-->
兩次日誌刷新之間的最大秒數（默認值爲 5s）。
</td>
</tr>

<tr>
<td colspan="2">--log-json-info-buffer-size string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>'0'</code>-->默認值：<code>'0'</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Alpha] In JSON format with split output streams, the info messages can be buffered for a while to increase performance. The default value of zero bytes disables buffering. The size can be specified as number of bytes (512), multiples of 1000 (1K), multiples of 1024 (2Ki), or powers of those (3M, 4G, 5Mi, 6Gi). Enable the <code>LoggingAlphaOptions</code> feature gate to use this. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
[Alpha 特性]在具有拆分輸出流的 JSON 格式中，可以將信息消息緩衝一段時間以提高性能。
零字節的默認值禁用緩衝。大小可以指定爲字節數（512）、1000 的倍數（1K）、1024 的倍數（2Ki） 或這些（3M、4G、5Mi、6Gi）的冪。
啓用 <code>LoggingAlphaOptions</code> 特性門控來使用此功能。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--log-json-split-stream</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Alpha] In JSON format, write error messages to stderr and info messages to stdout. The default is to write a single stream to stdout. Enable the <code>LoggingAlphaOptions</code> feature gate to use this. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
[Alpha 特性]以 JSON 格式，將錯誤消息寫入 stderr，將 info 消息寫入 stdout。
啓用 <code>LoggingAlphaOptions</code> 特性門控來使用此功能。
默認是將單個流寫入標準輸出。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>text</code>-->默認值：<code>"text"</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets the log format. Permitted formats: &quot;<code>json</code>&quot; (gated by <code>LoggingBetaOptions</code>, &quot;<code>text</code>&quot;). (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置日誌格式。允許的格式：<code>json</code>（由 <code>LoggingBetaOptions</code>、<code>text</code> 控制）。
（已棄用：此參數應通過 kubelet 的 <code>--config</code> 標誌指定的配置文件設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--make-iptables-util-chains&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, kubelet will ensure <code>iptables</code> utility rules are present on host. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置爲 true 表示 kubelet 將確保 <code>iptables</code> 規則在主機上存在。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--manifest-url string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
URL for accessing additional Pod specifications to run (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用於訪問要運行的其他 Pod 規範的 URL。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--manifest-url-header strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of HTTP headers to use when accessing the URL provided to <code>--manifest-url</code>. Multiple headers with the same name will be added in the same order provided. This flag can be repeatedly invoked. For example: <code>--manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'</code> (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
取值爲由 HTTP 頭部組成的逗號分隔列表，在訪問 <code>--manifest-url</code> 所給出的 URL 時使用。
名稱相同的多個頭部將按所列的順序添加。該參數可以多次使用。例如：
<code>--manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--master-service-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>default</code>-->默認值：<code>default</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The namespace from which the kubernetes master services should be injected into pods. (DEPRECATED: This flag will be removed in a future version.)
-->
kubelet 向 Pod 注入 Kubernetes 主控服務信息時使用的命名空間。
已棄用：此標誌將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--max-open-files int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 1000000-->默認值：1000000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of files that can be opened by kubelet process. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 進程可以打開的最大文件數量。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--max-pods int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 110-->默認值：110</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of Pods that can run on this kubelet. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
此 kubelet 能運行的 Pod 最大數量。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--maximum-dead-containers int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: -1-->默認值：-1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of old instances of containers to retain globally. Each container takes up some disk space. To disable, set to a negative number. (DEPRECATED: Use <code>--eviction-hard</code> or <code>--eviction-soft</code> instead. Will be removed in a future version.)
-->
設置全局可保留的已停止容器實例個數上限。
每個實例會佔用一些磁盤空間。要禁用，可設置爲負數。
已棄用：改用 <code>--eviction-hard</code> 或 <code>--eviction-soft</code>。
此標誌將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--maximum-dead-containers-per-container int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 1-->默認值：1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of old instances to retain per container.  Each container takes up some disk space. (DEPRECATED: Use <code>--eviction-hard</code> or <code>--eviction-soft</code> instead. Will be removed in a future version.)
-->
每個已停止容器可以保留的的最大實例數量。每個容器佔用一些磁盤空間。
已棄用：改用 <code>--eviction-hard</code> 或 <code>--eviction-soft</code>。
此標誌將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--memory-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>None</code>-->默認值：<code>None</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Memory Manager policy to use. Possible values: &quot;<code>None</code>&quot;, &quot;<code>Static</code>&quot;. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
內存管理器策略使用。可選值：<code>None</code>、<code>Static</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--minimum-container-ttl-duration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum age for a finished container before it is garbage collected. Examples: <code>300ms</code>, <code>10s</code> or <code>2h45m</code> (DEPRECATED: Use <code>--eviction-hard</code> or <code>--eviction-soft</code> instead. Will be removed in a future version.)
-->
已結束的容器在被垃圾回收清理之前的最少存活時間。
例如：<code>300ms</code>、<code>10s</code> 或者 <code>2h45m</code>。
已棄用：請改用 <code>--eviction-hard</code> 或者 <code>--eviction-soft</code>。
此標誌將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--minimum-image-ttl-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>2m0s</code>-->默認值：<code>2m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum age for an unused image before it is garbage collected. Examples: <code>300ms</code>, <code>10s</code> or <code>2h45m</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
已結束的容器在被垃圾回收清理之前的最少存活時間。
例如：<code>300ms</code>、<code>10s</code> 或者 <code>2h45m</code>。
已棄用：這個參數應該通過 kubelet 的 <code>--config</code> 標誌指定的配置文件來設置。
（<a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">進一步瞭解</a>）
</td>
</tr>

<tr>
<td colspan="2">--node-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
IP address (or comma-separated dual-stack IP addresses) of the node. If unset, kubelet will use the node's default IPv4 address, if any, or its default IPv6 address if it has no IPv4 addresses. You can pass <code>::</code> to make it prefer the default IPv6 address rather than the default IPv4 address.
-->
節點的 IP 地址（或逗號分隔的雙棧 IP 地址）。
如果未設置，kubelet 將使用節點的默認 IPv4 地址（如果有）或默認 IPv6 地址（如果它沒有 IPv4 地址）。
你可以傳值 <code>::</code> 使其偏向於默認的 IPv6 地址而不是默認的 IPv4 地址。
</td>
</tr>

<tr>
<td colspan="2">--node-labels &lt;key=value pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Alpha feature&gt;Labels to add when registering the node in the cluster. Labels must be <code>key=value</code> pairs separated by <code>','</code>. Labels in the <code>'kubernetes.io'</code> namespace must begin with an allowed prefix (<code>'kubelet.kubernetes.io'</code>, <code>'node.kubernetes.io'</code>) or be in the specifically allowed set (<code>'beta.kubernetes.io/arch'</code>, <code>'beta.kubernetes.io/instance-type'</code>, <code>'beta.kubernetes.io/os'</code>, <code>'failure-domain.beta.kubernetes.io/region'</code>, <code>'failure-domain.beta.kubernetes.io/zone'</code>, <code>'kubernetes.io/arch'</code>, <code>'kubernetes.io/hostname'</code>, <code>'kubernetes.io/os'</code>, <code>'node.kubernetes.io/instance-type'</code>, <code>'topology.kubernetes.io/region'</code>, <code>'topology.kubernetes.io/zone'</code>))
-->
【警告：Alpha 特性】kubelet 在集羣中註冊本節點時設置的標籤。標籤以
<code>key=value</code> 的格式表示，多個標籤以逗號分隔。名字空間 <code>kubernetes.io</code>
中的標籤必須以 <code>kubelet.kubernetes.io</code> 或 <code>node.kubernetes.io</code> 爲前綴，
或者在以下明確允許範圍內：
<code>beta.kubernetes.io/arch</code>, <code>beta.kubernetes.io/instance-type</code>,
<code>beta.kubernetes.io/os</code>, <code>failure-domain.beta.kubernetes.io/region</code>,
<code>failure-domain.beta.kubernetes.io/zone</code>, <code>kubernetes.io/arch</code>,
<code>kubernetes.io/hostname</code>, <code>kubernetes.io/os</code>,
<code>node.kubernetes.io/instance-type</code>, <code>topology.kubernetes.io/region</code>,
<code>topology.kubernetes.io/zone</code>。
</td>
</tr>

<tr>
<td colspan="2">--node-status-max-images int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 50-->默認值：50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum number of images to report in <code>node.status.images</code>. If <code>-1</code> is specified, no cap will be applied. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
在 <code>node.status.images</code> 中可以報告的最大鏡像數量。如果指定爲 -1，則不設上限。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--node-status-update-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>10s</code>-->默認值：<code>10s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specifies how often kubelet posts node status to master. Note: be cautious when changing the constant, it must work with <code>nodeMonitorGracePeriod</code> in Node controller. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
指定 kubelet 向主控節點彙報節點狀態的時間間隔。注意：更改此常量時請務必謹慎，
它必須與節點控制器中的 <code>nodeMonitorGracePeriod</code> 一起使用。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: -999-->默認值：-999</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The <code>oom-score-adj</code> value for kubelet process. Values must be within the range [-1000, 1000]. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 進程的 oom-score-adj 參數值。有效範圍爲 <code>[-1000，1000]</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--pod-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The CIDR to use for pod IP addresses, only used in standalone mode. In cluster mode, this is obtained from the master. For IPv6, the maximum number of IP's allocated is 65536 (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用於給 Pod 分配 IP 地址的 CIDR 地址池，僅在獨立運行模式下使用。
在集羣模式下，CIDR 設置是從主服務器獲取的。對於 IPv6，分配的 IP 的最大數量爲 65536。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--pod-infra-container-image string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--
Default: <code>registry.k8s.io/pause:3.10
-->
默認值: <code>registry.k8s.io/pause:3.10
</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specified image will not be pruned by the image garbage collector. CRI implementations have their own configuration to set this image. (DEPRECATED: will be removed in 1.27. Image garbage collector will get sandbox image information from CRI.)
-->
所指定的鏡像不會被鏡像垃圾收集器刪除。
CRI 實現有自己的配置來設置此鏡像。
（已棄用：將在 1.27 中刪除，鏡像垃圾收集器將從 CRI 獲取沙箱鏡像信息。）
</td>
</tr>

<tr>
<td colspan="2">--pod-manifest-path string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the directory containing static pod files to run, or the path to a single static pod file. Files starting with dots will be ignored. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置包含要運行的靜態 Pod 的文件的路徑，或單個靜態 Pod 文件的路徑。以點（<code>.</code>）
開頭的文件將被忽略。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--pod-max-pids int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: -1-->默認值：-1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Set the maximum number of processes per pod. If <code>-1</code>, the kubelet defaults to the node allocatable PID capacity. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置每個 Pod 中的最大進程數目。如果爲 -1，則 kubelet 使用節點可分配的 PID 容量作爲默認值。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--pods-per-core int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of Pods per core that can run on this kubelet. The total number of pods on this kubelet cannot exceed <code>--max-pods</code>, so <code>--max-pods</code> will be used if this calculation results in a larger number of pods allowed on the kubelet. A value of <code>0</code> disables this limit. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 在每個處理器核上可運行的 Pod 數量。此 kubelet 上的 Pod 總數不能超過
<code>--max-pods</code> 標誌值。因此，如果此計算結果導致在 kubelet
上允許更多數量的 Pod，則使用 <code>--max-pods</code> 值。值爲 0 表示不作限制。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10250-->默認值：10250</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port for the kubelet to serve on. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 服務監聽的本機端口號。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--protect-kernel-defaults</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Default kubelet behaviour for kernel tuning. If set, kubelet errors if any of kernel tunables is different than kubelet defaults. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置 kubelet 的默認內核調整行爲。如果已設置該參數，當任何內核可調參數與
kubelet 默認值不同時，kubelet 都會出錯。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--provider-id string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Unique identifier for identifying the node in a machine database, i.e cloud provider.
-->
設置主機數據庫（即，雲驅動）中用來標識節點的唯一標識。
</td>
</tr>

<tr>
<td colspan="2">--qos-reserved string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
&lt;Warning: Alpha feature&gt; A set of <code>&lt;resource name&gt;=&lt;percentage&gt;</code> (e.g. <code>memory=50%</code>) pairs that describe how pod resource requests are reserved at the QoS level. Currently only <code>memory</code> is supported. Requires the <code>QOSReserved</code> feature gate to be enabled. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
【警告：Alpha 特性】設置在指定的 QoS 級別預留的 Pod 資源請求，以一組
<code>"資源名稱=百分比"</code> 的形式進行設置，例如 <code>memory=50%</code>。
當前僅支持內存（memory）。要求啓用 <code>QOSReserved</code> 特性門控。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--read-only-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10255-->默認值：10255</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The read-only port for the kubelet to serve on with no authentication/authorization (set to <code>0</code> to disable). (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
kubelet 可以在沒有身份驗證/鑑權的情況下提供只讀服務的端口（設置爲 0 表示禁用）。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--register-node&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Register the node with the API server. If <code>--kubeconfig</code> is not provided, this flag is irrelevant, as the kubelet won't have an API server to register with. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
向 API 服務器註冊節點，如果未提供 <code>--kubeconfig</code>，此標誌無關緊要，
因爲 kubelet 沒有 API 服務器可註冊。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--register-schedulable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->默認值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Register the node as schedulable. Won't have any effect if <code>--register-node</code> is <code>false</code>. (DEPRECATED: will be removed in a future version)
-->
註冊本節點爲可調度的節點。當 <code>--register-node</code>標誌爲 false 時此設置無效。
已棄用：此參數將在未來的版本中刪除。
</td>
</tr>

<tr>
<td colspan="2">--register-with-taints string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Register the node with the given list of taints (comma separated <code>&lt;key&gt;=&lt;value&gt;:&lt;effect&gt;</code>). No-op if <code>--register-node</code> is <code>false</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code>  flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置本節點的污點標記，格式爲 <code>&lt;key&gt;=&lt;value&gt;:&lt;effect&gt;</code>，
以逗號分隔。當 <code>--register-node</code> 爲 false 時此標誌無效。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--registry-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 10-->默認值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of a bursty pulls, temporarily allows pulls to burst to this number, while still not exceeding <code>--registry-qps</code>. Only used if <code>--registry-qps</code> is greater than 0. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置突發性鏡像拉取的個數上限，在不超過 <code>--registration-qps</code> 設置值的前提下
暫時允許此參數所給的鏡像拉取個數。僅在 <code>--registry-qps</code> 大於 0 時使用。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--registry-qps int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: 5-->默認值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If &gt; 0, limit registry pull QPS to this value.  If <code>0</code>, unlimited. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
如此值大於 0，可用來限制鏡像倉庫的 QPS 上限。設置爲 0，表示不受限制。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--reserved-cpus string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma-separated list of CPUs or CPU ranges that are reserved for system and kubernetes usage. This specific list will supersede cpu counts in <code>--system-reserved</code> and <code>--kube-reserved</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用逗號分隔的一組 CPU 或 CPU 範圍列表，給出爲系統和 Kubernetes 保留使用的 CPU。
此列表所給出的設置優先於通過 <code>--system-reserved</code> 和
<code>--kube-reskube-reserved</code> 所保留的 CPU 個數配置。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--reserved-memory string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma-separated list of memory reservations for NUMA nodes. (e.g. <code>--reserved-memory 0:memory=1Gi,hugepages-1M=2Gi --reserved-memory 1:memory=2Gi</code>). The total sum for each memory type should be equal to the sum of <code>--kube-reserved</code>, <code>--system-reserved</code> and <code>--eviction-threshold</code>. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#reserved-memory-flag">here</a> for more details. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
以逗號分隔的 NUMA 節點內存預留列表。（例如 <code>--reserved-memory 0:memory=1Gi,hugepages-1M=2Gi --reserved-memory 1:memory=2Gi</code>）。
每種內存類型的總和應該等於<code>--kube-reserved</code>、<code>--system-reserved</code>和<code>--eviction-threshold</之和 代碼>。
<a href="https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#reserved-memory-flag">瞭解更多詳細信息。</a>
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--resolv-conf string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>/etc/resolv.conf</code>-->默認值：<code>/etc/resolv.conf</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Resolver configuration file used as the basis for the container DNS resolution configuration. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
名字解析服務的配置文件名，用作容器 DNS 解析配置的基礎。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--root-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>/var/lib/kubelet</code>-->默認值：<code>/var/lib/kubelet</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Directory path for managing kubelet files (volume mounts, etc).
-->
設置用於管理 kubelet 文件的根目錄（例如掛載卷的相關文件等）。
</td>
</tr>

<tr>
<td colspan="2">--rotate-certificates</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Auto rotate the kubelet client certificates by requesting new certificates from the <code>kube-apiserver</code> when the certificate expiration approaches. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置當客戶端證書即將過期時 kubelet 自動從
<code>kube-apiserver</code> 請求新的證書進行輪換。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--rotate-server-certificates</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Auto-request and rotate the kubelet serving certificates by requesting new certificates from the <code>kube-apiserver</code> when the certificate expiration approaches. Requires the <code>RotateKubeletServerCertificate</code> feature gate to be enabled, and approval of the submitted <code>CertificateSigningRequest</code> objects. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
當 kubelet 的服務證書即將過期時自動從 kube-apiserver 請求新的證書進行輪換。
要求啓用 <code>RotateKubeletServerCertificate</code> 特性門控，以及對提交的
<code>CertificateSigningRequest</code> 對象進行批覆（Approve）操作。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--runonce</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If <code>true</code>, exit after spawning pods from local manifests or remote urls. Exclusive with <code>--enable-server</code> (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)<
-->
設置爲 <code>true</code> 表示從本地清單或遠程 URL 創建完 Pod 後立即退出 kubelet 進程。
與 <code>--enable-server</code> 標誌互斥。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--runtime-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional absolute name of cgroups to create and run the runtime in.
-->
設置用於創建和運行容器運行時的 cgroup 的絕對名稱。
</td>
</tr>

<tr>
<td colspan="2">--runtime-request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>2m0s</code>-->默認值：<code>2m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Timeout of all runtime requests except long running request - <code>pull</code>, <code>logs</code>, <code>exec</code> and <code>attach</code>. When timeout exceeded, kubelet will cancel the request, throw out an error and retry later. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置除了長時間運行的請求（包括 <code>pull</code>、<code>logs</code>、<code>exec</code>
和 <code>attach</code> 等操作）之外的其他運行時請求的超時時間。
到達超時時間時，請求會被取消，拋出一個錯誤並會等待重試。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--seccomp-default</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable the use of <code>RuntimeDefault</code> as the default seccomp profile for all workloads.
-->
啓用 <code>RuntimeDefault</code> 作爲所有工作負載的默認 seccomp 配置文件。
</td>
</tr>

<tr>
<td colspan="2">--serialize-image-pulls&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>true</code>-->默認值：<code>true</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Pull images one at a time. We recommend *not* changing the default value on nodes that run docker daemon with version &lt; 1.9 or an <code>aufs</code> storage backend. Issue #10959 has more details. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
逐一拉取鏡像。建議 *不要* 在 docker 守護進程版本低於 1.9 或啓用了 Aufs 存儲後端的節點上
更改默認值。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--streaming-connection-idle-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>4h0m0s</code>-->默認值：<code>4h0m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum time a streaming connection can be idle before the connection is automatically closed. <code>0</code> indicates no timeout. Example: <code>5m</code>. Note: All connections to the kubelet server have a maximum duration of 4 hours.  (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置流連接在自動關閉之前可以空閒的最長時間。0 表示沒有超時限制。
例如：<code>5m</code>。
注意：與 kubelet 服務器的所有連接最長持續時間爲 4 小時。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--sync-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>1m0s</code>-->默認值：<code>1m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Max period between synchronizing running containers and config. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
在運行中的容器與其配置之間執行同步操作的最長時間間隔。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--system-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional absolute name of cgroups in which to place all non-kernel processes that are not already inside a cgroup under <code>'/'</code>. Empty for no container. Rolling back the flag requires a reboot. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
此標誌值爲一個 cgroup 的絕對名稱，用於所有尚未放置在根目錄下某 cgroup 內的非內核進程。
空值表示不指定 cgroup。回滾該參數需要重啓機器。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--system-reserved string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: none-->默認值：無</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of <code>&lt;resource name&gt;=&lt;resource quantity&gt;</code> (e.g. <code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>) pairs that describe resources reserved for non-kubernetes components. Currently only <code>cpu</code> and <code>memory</code> are supported. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved">here</a> for more detail. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
系統預留的資源配置，以一組 <code>資源名稱=資源數量</code> 的格式表示，
（例如：<code>cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid='100'</code>）。
目前僅支持 <code>cpu</code> 和 <code>memory</code> 的設置。
更多細節可參考
<a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved">相關文檔</a>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--system-reserved-cgroup string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>''</code>-->默認值：<code>""</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Absolute name of the top level cgroup that is used to manage non-kubernetes components for which compute resources were reserved via <code>--system-reserved</code> flag. Ex. <code>/system-reserved</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
此標誌給出一個頂層 cgroup 絕對名稱，該 cgroup 用於管理非 kubernetes 組件，
這些組件的計算資源通過 <code>--system-reserved</code> 標誌進行預留。
例如 <code>"/system-reserved"</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing x509 certificate used for serving HTTPS (with intermediate certs, if any, concatenated after server cert). If <code>--tls-cert-file</code> and <code>--tls-private-key-file</code> are not provided, a self-signed certificate and key are generated for the public address and saved to the directory passed to <code>--cert-dir</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
包含 x509 證書的文件路徑，用於 HTTPS 認證。
如果有中間證書，則中間證書要串接在在服務器證書之後。
如果未提供 <code>--tls-cert-file</code> 和 <code>--tls-private-key-file</code>，
kubelet 會爲公開地址生成自簽名證書和密鑰，並將其保存到通過
<code>--cert-dir</code> 指定的目錄中。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>
Preferred values:
<code>TLS_AES_128_GCM_SHA256</code>, <code>TLS_AES_256_GCM_SHA384</code>, <code>TLS_CHACHA20_POLY1305_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384</code>, <code>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305</code>, <code>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384</code>, <code>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305</code>, <code>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256</code>, <code>TLS_RSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_RSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_256_GCM_SHA384</code><br/>
Insecure values:
<code>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_RC4_128_SHA</code>, <code>TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_RC4_128_SHA</code>, <code>TLS_RSA_WITH_3DES_EDE_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_RSA_WITH_RC4_128_SHA</code>.<br/>
(DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
服務器端加密算法列表，以逗號分隔。如果不設置，則使用 Go 語言加密包的默認算法列表。<br/>
首選算法：
<code>TLS_AES_128_GCM_SHA256</code>, <code>TLS_AES_256_GCM_SHA384</code>, <code>TLS_CHACHA20_POLY1305_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384</code>, <code>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305</code>, <code>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384</code>, <code>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305</code>, <code>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256</code>, <code>TLS_RSA_WITH_AES_128_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_128_GCM_SHA256</code>, <code>TLS_RSA_WITH_AES_256_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_256_GCM_SHA384</code><br/>
不安全算法：
<code>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_ECDHE_ECDSA_WITH_RC4_128_SHA</code>, <code>TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA</code>, <code>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_ECDHE_RSA_WITH_RC4_128_SHA</code>, <code>TLS_RSA_WITH_3DES_EDE_CBC_SHA</code>, <code>TLS_RSA_WITH_AES_128_CBC_SHA256</code>, <code>TLS_RSA_WITH_RC4_128_SHA</code>.<br/>
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum TLS version supported. Possible values: <code>VersionTLS10</code>, <code>VersionTLS11</code>, <code>VersionTLS12</code>, <code>VersionTLS13</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置支持的最小 TLS 版本號，可選的版本號包括：<code>VersionTLS10</code>、
<code>VersionTLS11</code>、<code>VersionTLS12</code> 和 <code>VersionTLS13</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing x509 private key matching <code>--tls-cert-file</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
包含與 <code>--tls-cert-file</code> 對應的 x509 私鑰文件路徑。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>


<tr>
<td colspan="2">--topology-manager-policy string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值: <code>'none'</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Topology Manager policy to use. Possible values: <code>'none'</code>, <code>'best-effort'</code>, <code>'restricted'</code>, <code>'single-numa-node'</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
要使用的拓撲管理器策略，用於微調它們的行爲。
可能的取值有：<code>'none'</code>、<code>'best-effort'</code>、<code>'restricted'</code>、<code>'single-numa-node'</code>。
（已棄用：此參數應通過 kubelet 的 <code>--config</code>
標誌指定的配置文件設置。請參閱
<a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--topology-manager-policy-options string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value Topology Manager policy options to use, to fine tune their behaviour. If not supplied, keep the default behaviour. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
設置拓撲管理策略（Topology Manager policy）。可選值包括：<code>none</code>、
<code>best-effort</code>、<code>restricted</code> 和 <code>single-numa-node</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--topology-manager-scope string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>container</code>-->默認值：<code>container</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Scope to which topology hints are applied. Topology manager collects hints from hint providers and applies them to the defined scope to ensure the pod admission. Possible values: <code>'container'</code>, <code>'pod'</code>. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
拓撲提示信息使用範圍。拓撲管理器從提示提供者（Hints Providers）處收集提示信息，
並將其應用到所定義的範圍以確保 Pod 准入。
可選值包括：<code>container</code>（默認）、<code>pod</code>。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
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
設置 kubelet 日誌級別詳細程度的數值。
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Print version information and quit; <code>--version=vX.Y.Z...</code> sets the reported version.
-->
打印 kubelet 版本信息並退出；<code>--version=vX.Y.Z...</code> 設置報告的版本。
</td>
</tr>

<tr>
<td colspan="2">--vmodule &lt;<!--A list of 'pattern=N' strings-->一個 “pattern=N” 格式的字符串列表&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of <code>pattern=N</code> settings for file-filtered logging (only works for text log format).
-->
以逗號分隔的 <code>pattern=N</code> 設置列表，用於文件過濾的日誌記錄（僅適用於文本日誌格式）。
</td>
</tr>

<tr>
<td colspan="2">--volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>/usr/libexec/kubernetes/kubelet-plugins/volume/exec/</code>-->默認值：<code>/usr/libexec/kubernetes/kubelet-plugins/volume/exec/</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The full path of the directory in which to search for additional third party volume plugins. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
用來搜索第三方存儲卷插件的目錄。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>

<tr>
<td colspan="2">--volume-stats-agg-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: <code>1m0s</code>-->默認值：<code>1m0s</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specifies interval for kubelet to calculate and cache the volume disk usage for all pods and volumes. To disable volume calculations, set to a negative number. (DEPRECATED: This parameter should be set via the config file specified by the kubelet's <code>--config</code> flag. See <a href="https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> for more information.)
-->
指定 kubelet 計算和緩存所有 Pod 和卷的磁盤用量總值的時間間隔。要禁用磁盤用量計算，
可設置爲負數。
（已棄用：應在 <code>--config</code> 所給的配置文件中進行設置。
請參閱 <a href="https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/">kubelet-config-file</a> 瞭解更多信息。）
</td>
</tr>
</tbody>
</table>
