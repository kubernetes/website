---
title: kube-controller-manager
content_type: tool-reference
weight: 30
---

## {{% heading "synopsis" %}}

<!--
The Kubernetes controller manager is a daemon that embeds
the core control loops shipped with Kubernetes. In applications of robotics and
automation, a control loop is a non-terminating loop that regulates the state of
the system. In Kubernetes, a controller is a control loop that watches the shared
state of the cluster through the apiserver and makes changes attempting to move the
current state towards the desired state. Examples of controllers that ship with
Kubernetes today are the replication controller, endpoints controller, namespace
controller, and serviceaccounts controller.
-->
Kubernetes 控制器管理器是一個守護進程，內嵌隨 Kubernetes 一起發佈的核心控制迴路。
在機器人和自動化的應用中，控制迴路是一個永不休止的循環，用於調節系統狀態。
在 Kubernetes 中，每個控制器是一個控制迴路，通過 API 伺服器監視叢集的共享狀態，
並嘗試進行更改以將當前狀態轉爲期望狀態。
目前，Kubernetes 自帶的控制器例子包括副本控制器、節點控制器、命名空間控制器和服務賬號控制器等。

```
kube-controller-manager [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--allocate-node-cidrs</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Should CIDRs for Pods be allocated and set on the cloud provider. Requires --cluster-cidr.
-->
基於雲驅動來爲 Pod 分配和設置子網掩碼。需要 <code>--cluster-cidr</code>。
</td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：[]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<p>
<!--
The map from metric-label to value allow-list of this label. The key's format is &lt;MetricName&gt;,&lt;LabelName&gt;. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.
-->
從度量值標籤到准許值列表的映射。鍵名的格式爲&lt;MetricName&gt;,&lt;LabelName&gt;。
准許值的格式爲&lt;allowed_value&gt;,&lt;allowed_value&gt;...。
例如，<code>metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3',
metric2,label='v1,v2,v3'</code>。
</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels-manifest string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the manifest file that contains the allow-list mapping. The format of the file is the same as the flag --allow-metric-labels. Note that the flag --allow-metric-labels will override the manifest file.
-->
包含允許列表映射的清單檔案的路徑。此檔案的格式與 <code>--allow-metric-labels</code> 標誌相同。
請注意，<code>--allow-metric-labels</code> 標誌將覆蓋此清單檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">--attach-detach-reconcile-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The reconciler sync wait time between volume attach detach. This duration must be larger than one second, and increasing this value from the default may allow for volumes to be mismatched with pods.
-->
協調器（reconciler）在相鄰兩次對儲存捲進行掛載和解除掛載操作之間的等待時間。
此時長必須長於 1 秒鐘。此值設置爲大於預設值時，可能導致儲存卷無法與 Pod 匹配。
</td>
</tr>

<tr>
<td colspan="2">--authentication-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
kubeconfig file pointing at the 'core' kubernetes server with enough rights to create tokenreviews.authentication.k8s.io. This is optional. If empty, all token requests are considered to be anonymous and no client CA is looked up in the cluster.
-->
此標誌值爲一個 kubeconfig 檔案的路徑名。該檔案中包含與某 Kubernetes “核心”
伺服器相關的資訊，並支持足夠的權限以創建 tokenreviews.authentication.k8s.io。
此選項是可選的。如果設置爲空值，則所有令牌請求都會被認作匿名請求，
Kubernetes 也不再在叢集中查找客戶端的 CA 證書資訊。
</td>
</tr>

<tr>
<td colspan="2">--authentication-skip-lookup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If false, the authentication-kubeconfig will be used to lookup missing authentication configuration from the cluster.
-->
此值爲 false 時，通過 authentication-kubeconfig
參數所指定的檔案會被用來檢索叢集中缺失的身份認證設定資訊。
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache responses from the webhook token authenticator.
-->
對 Webhook 令牌認證設施返回結果的緩存時長。
</td>
</tr>

<tr>
<td colspan="2">--authentication-tolerate-lookup-failure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.
-->
此值爲 true 時，即使無法從叢集中檢索到缺失的身份認證設定資訊也無大礙。
需要注意的是，這樣設置可能導致所有請求都被視作匿名請求。
</td>
</tr>

<tr>
<td colspan="2">--authorization-always-allow-paths strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："/healthz,/readyz,/livez"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.
-->
鑑權過程中會忽略的一個 HTTP 路徑列表。
換言之，控制器管理器會對列表中路徑的訪問進行授權，並且無須徵得
Kubernetes “核心” 伺服器同意。
</td>
</tr>

<tr>
<td colspan="2">--authorization-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
kubeconfig file pointing at the 'core' kubernetes server with enough rights to create subjectaccessreviews.authorization.k8s.io. This is optional. If empty, all requests not skipped by authorization are forbidden.
-->
包含 Kubernetes “核心” 伺服器資訊的 kubeconfig 檔案路徑，
所包含資訊具有創建 subjectaccessreviews.authorization.k8s.io 的足夠權限。
此參數是可選的。如果設定爲空字符串，未被鑑權模塊所忽略的請求都會被禁止。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer.
-->
對 Webhook 形式鑑權組件所返回的“已授權（Authorized）”響應的緩存時長。
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer.
-->
對 Webhook 形式鑑權組件所返回的“未授權（Unauthorized）”響應的緩存時長。
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces and IP address families will be used.
-->
針對 <code>--secure-port</code> 端口上請求執行監聽操作的 IP 地址。
所對應的網路介面必須從叢集中其它位置可訪問（含命令列及 Web 客戶端）。
如果此值爲空或者設定爲非特定地址（<code>0.0.0.0</code> 或 <code>::</code>），
意味着所有網路介面和 IP 地址簇都在監聽範圍。
</td>
</tr>

<tr>
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.
-->
TLS 證書所在的目錄。如果提供了 <code>--tls-cert-file</code> 和
<code>--tls-private-key-file</code>，此標誌會被忽略。
</td>
</tr>

<tr>
<td colspan="2">--cidr-allocator-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："RangeAllocator"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Type of CIDR allocator to use
-->
要使用的 CIDR 分配器類型。
</td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.
-->
如果設置了此標誌，對於所有能夠提供客戶端證書的請求，若該證書由
<code>--client-ca-file</code> 中所給機構之一簽署，
則該請求會被成功認證爲客戶端證書中 CommonName 所標識的實體。
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
雲驅動程式設定檔案的路徑。空字符串表示沒有設定檔案。
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
雲服務的提供者。空字符串表示沒有對應的提供者（驅動）。
</td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
CIDR Range for Pods in cluster. Only used when --allocate-node-cidrs=true; if false, this option will be ignored.
-->
叢集中 Pod 的 CIDR 範圍。僅當 <code>--allocate-node-cidrs=true</code> 時此選項纔會被使用；
如果爲 false，此選項將被忽略。

</td>
</tr>

<tr>
<td colspan="2">--cluster-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："kubernetes"</td -->
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The instance prefix for the cluster.
-->
叢集實例的前綴。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Filename containing a PEM-encoded X509 CA certificate used to issue cluster-scoped certificates.  If specified, no more specific --cluster-signing-* flag may be specified.
-->
包含 PEM 編碼格式的 X509 CA 證書的檔案名。該證書用來發放叢集範圍的證書。
如果設置了此標誌，則不能指定更具體的 <code>--cluster-signing-*</code> 標誌。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：8760h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
The max length of duration signed certificates will be given.
Individual CSRs may request shorter certs by setting spec.expirationSeconds.
-->
所簽名證書的有效期限。每個 CSR 可以通過設置 <code>spec.expirationSeconds</code> 來請求更短的證書。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Filename containing a PEM-encoded RSA or ECDSA private key used to sign cluster-scoped certificates.
If specified, no more specific --cluster-signing-* flag may be specified.
-->
包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔案名。該私鑰用來對叢集範圍證書籤名。
若指定了此選項，則不可再設置 <code>--cluster-signing-*</code> 參數。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-kube-apiserver-client-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
Filename containing a PEM-encoded X509 CA certificate used to issue certificates for the kubernetes.io/kube-apiserver-client signer.  If specified, --cluster-signing-{cert,key}-file must not be set.
-->
包含 PEM 編碼的 X509 CA 證書的檔案名，
該證書用於爲 kubernetes.io/kube-apiserver-client 簽署者頒發證書。
如果指定，則不得設置 <code>--cluster-signing-{cert,key}-file</code>。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-kube-apiserver-client-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--  
Filename containing a PEM-encoded RSA or ECDSA private key used to sign certificates for the kubernetes.io/kube-apiserver-client signer.  If specified, --cluster-signing-{cert,key}-file must not be set.
-->
包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔案名，
該私鑰用於爲 kubernetes.io/kube-apiserver-client 簽署者簽名證書。
如果指定，則不得設置 <code>--cluster-signing-{cert,key}-file</code>。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-kubelet-client-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Filename containing a PEM-encoded X509 CA certificate used to issue certificates for the kubernetes.io/kube-apiserver-client-kubelet signer.  If specified, --cluster-signing-{cert,key}-file must not be set.
-->
包含 PEM 編碼的 X509 CA 證書的檔案名，
該證書用於爲 kubernetes.io/kube-apiserver-client-kubelet 簽署者頒發證書。
如果指定，則不得設置 <code>--cluster-signing-{cert,key}-file</code>。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-kubelet-client-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Filename containing a PEM-encoded RSA or ECDSA private key used to sign certificates for the kubernetes.io/kube-apiserver-client-kubelet signer.  If specified, --cluster-signing-{cert,key}-file must not be set.
-->
包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔案名，
該私鑰用於爲 kubernetes.io/kube-apiserver-client-kubelet 簽署者簽名證書。
如果指定，則不得設置 <code>--cluster-signing-{cert,key}-file</code>。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-kubelet-serving-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Filename containing a PEM-encoded X509 CA certificate used to issue certificates for the kubernetes.io/kubelet-serving signer.  If specified, --cluster-signing-{cert,key}-file must not be set.
-->
包含 PEM 編碼的 X509 CA 證書的檔案名，
該證書用於爲 kubernetes.io/kubelet-serving 簽署者頒發證書。
如果指定，則不得設置 </code>--cluster-signing-{cert,key}-file</code>。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-kubelet-serving-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Filename containing a PEM-encoded RSA or ECDSA private key used to sign certificates for the kubernetes.io/kubelet-serving signer.  If specified, --cluster-signing-{cert,key}-file must not be set.
-->
包含 PEM 編碼的 RSA或ECDSA 私鑰的檔案名，
該私鑰用於對 kubernetes.io/kubelet-serving 簽署者的證書進行簽名。
如果指定，則不得設置 <code>--cluster-signing-{cert,key}-file</code>。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-legacy-unknown-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Filename containing a PEM-encoded X509 CA certificate used to issue certificates for the kubernetes.io/legacy-unknown signer.  If specified, --cluster-signing-{cert,key}-file must not be set.
-->
包含 PEM 編碼的 X509 CA 證書的檔案名，
用於爲 kubernetes.io/legacy-unknown 簽署者頒發證書。
如果指定，則不得設置 <code>--cluster-signing-{cert,key}-file</code>。
</td>
</tr>

<tr>
<td colspan="2">--cluster-signing-legacy-unknown-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Filename containing a PEM-encoded RSA or ECDSA private key used to sign certificates for the kubernetes.io/legacy-unknown signer.  If specified, --cluster-signing-{cert,key}-file must not be set.
-->
包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔案名，
用於爲 kubernetes.io/legacy-unknown 簽署者簽名證書。
如果指定，則不得設置 <code>--cluster-signing-{cert,key}-file</code>。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-cron-job-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The number of cron job objects that are allowed to sync concurrently. Larger number = more responsive jobs, but more CPU (and network) load
-->
可以併發同步的 CronJob 對象個數。數值越大意味着對 CronJob 的響應越及時，
同時也意味着更大的 CPU（和網路帶寬）壓力。
</p></td>
</tr>

<tr>
<td colspan="2">--concurrent-daemonset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The number of daemonset objects that are allowed to sync concurrently. Larger number = more responsive daemonsets, but more CPU (and network) load
-->
可以併發同步的 DaemonSet 對象個數。數值越大意味着對 DaemonSet 的響應越及時，
同時也意味着更大的 CPU（和網路帶寬）壓力。
</p></td>
</tr>

<tr>
<td colspan="2">--concurrent-deployment-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of deployment objects that are allowed to sync concurrently. Larger number = more responsive deployments, but more CPU (and network) load
-->
可以併發同步的 Deployment 對象個數。數值越大意味着對 Deployment 的響應越及時，
同時也意味着更大的 CPU（和網路帶寬）壓力。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of endpoint syncing operations that will be done concurrently. Larger number = faster endpoint updating, but more CPU (and network) load
-->
可以併發執行的 Endpoints 同步操作個數。數值越大意味着更快的 Endpoints 更新操作，
同時也意味着更大的 CPU （和網路）壓力。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-ephemeralvolume-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of ephemeral volume syncing operations that will be done concurrently. Larger number = faster ephemeral volume updating, but more CPU (and network) load
-->
可以併發執行的 EphemeralVolume 同步操作個數。數值越大意味着更快的 EphemeralVolume 更新操作，
同時也意味着更大的 CPU （和網路）壓力。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-gc-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：20</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of garbage collector workers that are allowed to sync concurrently.
-->
可以併發同步的垃圾收集工作執行緒個數。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-horizontal-pod-autoscaler-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of horizontal pod autoscaler objects that are allowed to sync concurrently. Larger number = more responsive horizontal pod autoscaler objects processing, but more CPU (and network) load.
-->
<p>
允許併發執行的、對水平 Pod 自動擴縮器對象進行同步的數量。
更大的數字 = 響應更快的水平 Pod 自動縮放器對象處理，但需要更高的 CPU（和網路）負載。
</p>
</p></td>
</tr>

<tr>
<td colspan="2">--concurrent-job-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The number of job objects that are allowed to sync concurrently. Larger number = more responsive jobs, but more CPU (and network) load
-->
可以併發同步的 Job 對象個數。較大的數值意味着更快的 Job 終結操作，
不過也意味着更多的 CPU （和網路）佔用。
</p></td>
</tr>

<tr>
<td colspan="2">--concurrent-namespace-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of namespace objects that are allowed to sync concurrently. Larger number = more responsive namespace termination, but more CPU (and network) load
-->
可以併發同步的 Namespace 對象個數。較大的數值意味着更快的名字空間終結操作，
不過也意味着更多的 CPU （和網路）佔用。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-rc-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The number of replication controllers that are allowed to sync concurrently. Larger number = more responsive replica management, but more CPU (and network) load
-->
可以併發同步的副本控制器對象個數。較大的數值意味着更快的副本管理操作，
不過也意味着更多的 CPU （和網路）佔用。
</p></td>
</tr>

<tr>
<td colspan="2">--concurrent-replicaset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of replica sets that are allowed to sync concurrently. Larger number = more responsive replica management, but more CPU (and network) load
-->
可以併發同步的 ReplicaSet 個數。數值越大意味着副本管理的響應速度越快，
同時也意味着更多的 CPU （和網路）佔用。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-resource-quota-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of resource quotas that are allowed to sync concurrently. Larger number = more responsive quota management, but more CPU (and network) load
-->
可以併發同步的 ResourceQuota 對象個數。數值越大，配額管理的響應速度越快，
不過對 CPU （和網路）的佔用也越高。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-service-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of service endpoint syncing operations that will be done concurrently. Larger number = faster endpoint slice updating, but more CPU (and network) load. Defaults to 5.
-->
可以併發執行的服務端點同步操作個數。數值越大，端點片段（Endpoint Slice）
的更新速度越快，不過對 CPU （和網路）的佔用也越高。預設值爲 5。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-service-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of services that are allowed to sync concurrently. Larger number = more responsive service management, but more CPU (and network) load
-->
可以併發同步的 Service 對象個數。數值越大，服務管理的響應速度越快，
不過對 CPU （和網路）的佔用也越高。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-serviceaccount-token-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of service account token objects that are allowed to sync concurrently. Larger number = more responsive token generation, but more CPU (and network) load
-->
可以併發同步的服務賬號令牌對象個數。數值越大，令牌生成的速度越快，
不過對 CPU （和網路）的佔用也越高。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-statefulset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of statefulset objects that are allowed to sync concurrently. Larger number = more responsive statefulsets, but more CPU (and network) load
-->
可以併發同步的 StatefulSet 對象個數。數值越大，StatefulSet 管理的響應速度越快，
不過對 CPU （和網路）的佔用也越高。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-ttl-after-finished-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of ttl-after-finished-controller workers that are allowed to sync concurrently.
-->
可以併發同步的 ttl-after-finished-controller 執行緒個數。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-validating-admission-policy-status-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The number of ValidatingAdmissionPolicyStatusController workers that are allowed to sync concurrently.
-->
可以併發同步的 ValidatingAdmissionPolicyStatusController 執行緒個數。
</p></td>
</tr>

<tr>
<td colspan="2">--configure-cloud-routes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Should CIDRs allocated by allocate-node-cidrs be configured on the cloud provider.
-->
決定是否由 <code>--allocate-node-cidrs</code> 所分配的 CIDR 要通過雲驅動程式來設定。
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
在啓用了性能分析（profiling）時，也啓用鎖競爭情況分析。
</td>
</tr>

<tr>
<td colspan="2">--controller-start-interval duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Interval between starting controller managers.
-->
在兩次啓動控制器管理器之間的時間間隔。
</td>
</tr>

<tr>
<td colspan="2">--controllers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>*</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A list of controllers to enable. '*' enables all on-by-default controllers, 'foo' enables the controller named 'foo', '-foo' disables the controller named 'foo'.<br/>All controllers: bootstrap-signer-controller, certificatesigningrequest-approving-controller, certificatesigningrequest-cleaner-controller, certificatesigningrequest-signing-controller, cloud-node-lifecycle-controller, clusterrole-aggregation-controller, cronjob-controller, daemonset-controller, deployment-controller, device-taint-eviction-controller, disruption-controller, endpoints-controller, endpointslice-controller, endpointslice-mirroring-controller, ephemeral-volume-controller, garbage-collector-controller, horizontal-pod-autoscaler-controller, job-controller, kube-apiserver-serving-clustertrustbundle-publisher-controller, legacy-serviceaccount-token-cleaner-controller, namespace-controller, node-ipam-controller, node-lifecycle-controller, node-route-controller, persistentvolume-attach-detach-controller, persistentvolume-binder-controller, persistentvolume-expander-controller, persistentvolume-protection-controller, persistentvolumeclaim-protection-controller, pod-garbage-collector-controller, podcertificaterequest-cleaner-controller, replicaset-controller, replicationcontroller-controller, resourceclaim-controller, resourcequota-controller, root-ca-certificate-publisher-controller, selinux-warning-controller, service-cidr-controller, service-lb-controller, serviceaccount-controller, serviceaccount-token-controller, statefulset-controller, storage-version-migrator-controller, storageversion-garbage-collector-controller, taint-eviction-controller, token-cleaner-controller, ttl-after-finished-controller, ttl-controller, validatingadmissionpolicy-status-controller, volumeattributesclass-protection-controller<br/>Disabled-by-default controllers: bootstrap-signer-controller, selinux-warning-controller, token-cleaner-controller
-->
要啓用的控制器列表。<code>*</code> 表示啓用所有預設啓用的控制器；
<code>foo</code> 啓用名爲 foo 的控制器；
<code>-foo</code> 表示禁用名爲 foo 的控制器。<br/>
控制器的全集：bootstrap-signer-controller、certificatesigningrequest-approving-controller、
certificatesigningrequest-cleaner-controller、certificatesigningrequest-signing-controller、
cloud-node-lifecycle-controller、clusterrole-aggregation-controller、cronjob-controller、daemonset-controller、
deployment-controller、device-taint-eviction-controller、disruption-controller、endpoints-controller、
endpointslice-controller、endpointslice-mirroring-controller、ephemeral-volume-controller、garbage-collector-controller、
horizontal-pod-autoscaler-controller、job-controller、kube-apiserver-serving-clustertrustbundle-publisher-controller、
legacy-serviceaccount-token-cleaner-controller、namespace-controller、node-ipam-controller、node-lifecycle-controller、
node-route-controller、persistentvolume-attach-detach-controller、persistentvolume-binder-controller、
persistentvolume-expander-controller、persistentvolume-protection-controller、persistentvolumeclaim-protection-controller、
pod-garbage-collector-controller、podcertificaterequest-cleaner-controller、replicaset-controller、
replicationcontroller-controller、resourceclaim-controller、resourcequota-controller、
root-ca-certificate-publisher-controller、selinux-warning-controller、service-cidr-controller、
service-lb-controller、serviceaccount-controller、serviceaccount-token-controller、statefulset-controller、
storage-version-migrator-controller、storageversion-garbage-collector-controller、taint-eviction-controller、
token-cleaner-controller、ttl-after-finished-controller、ttl-controller、
validatingadmissionpolicy-status-controller、volumeattributesclass-protection-controller<br/>
預設禁用的控制器有： bootstrap-signer-controller、selinux-warning-controller、token-cleaner-controller
</p>
</td>
</tr>

<tr>
<td colspan="2">--disable-attach-detach-reconcile-sync</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Disable volume attach detach reconciler sync. Disabling this may cause volumes to be mismatched with pods. Use wisely.
-->
禁用卷掛接/解掛調節器的同步。禁用此同步可能導致卷儲存與 Pod 之間出現錯位。
請小心使用。
</td>
</tr>

<tr>
<td colspan="2">--disable-force-detach-on-timeout</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Prevent force detaching volumes based on maximum unmount time and node status. If this flag is set to true, the non-graceful node shutdown feature must be used to recover from node failure. See https://k8s.io/docs/storage-disable-force-detach-on-timeout/.
-->
基於最長卸載時間和節點狀態防止強制解除掛接卷。
如果將此標誌設置爲 true，則必須使用非體面節點關閉特性來從節點故障中恢復。
參閱 https://k8s.io/zh-cn/docs/storage-disable-force-detach-on-timeout/
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
如果爲 true，HTTP2 服務將被禁用 [預設值=false]
</p></td>
</tr>

<tr>
<td colspan="2">--disabled-metrics strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
This flag provides an escape hatch for misbehaving metrics. You must provide the fully qualified metric name in order to disable it. Disclaimer: disabling metrics is higher in precedence than showing hidden metrics.
-->
此標誌提供對行爲異常的度量值的防控措施。你必須提供度量值的完全限定名稱才能將其禁用。
<B>聲明</B>：禁用度量值的操作比顯示隱藏度量值的操作優先級高。
</p></td>
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
如果設置了該選項，組件將模擬此版本的行爲，而不是下層可執行檔案版本的行爲。<br/>
版本格式只能是 major.minor，例如 “--emulated-version=wardle=1.2,kube=1.31”。
選項包括：<br/>kube=1.31..1.34（預設 1.34）。如果組件未被指定，預設爲 “kube”。
</p></td>
</tr>

<tr>
<td colspan="2">--enable-dynamic-provisioning&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable dynamic provisioning for environments that support it.
-->
在環境允許的情況下啓用動態卷製備。
</td>
</tr>

<tr>
<td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-apiserver.
-->
啓用通用垃圾收集器。必須與 kube-apiserver 中對應的標誌一致。
</td>
</tr>

<tr>
<td colspan="2">--enable-hostpath-provisioner</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable HostPath PV provisioning when running without a cloud provider. This allows testing and development of provisioning features.  HostPath provisioning is not supported in any way, won't work in a multi-node cluster, and should not be used for anything other than testing or development.
-->
在沒有云驅動程式的情況下，啓用 HostPath 持久卷的製備。
此參數便於對卷供應功能進行開發和測試。HostPath 卷的製備並非受支持的功能特性，
在多節點的叢集中也無法工作，因此除了開發和測試環境中不應使用 HostPath 卷的製備。
</td>
</tr>

<tr>
<td colspan="2">--enable-leader-migration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Whether to enable controller leader migration.
-->
此標誌決定是否啓用控制器領導者遷移。
</p></td>
</tr>

<tr>
<td colspan="2">--endpoint-updates-batch-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The length of endpoint updates batching period. Processing of pod changes will be delayed by this duration to join them with potential upcoming updates and reduce the overall number of endpoints updates. Larger number = higher endpoint programming latency, but lower number of endpoints revision generated
-->
端點（Endpoint）批量更新週期時長。對 Pod 變更的處理會被延遲，
以便將其與即將到來的更新操作合併，從而減少端點更新操作次數。
較大的數值意味着端點更新的遲滯時間會增長，也意味着所生成的端點版本個數會變少。
</td>
</tr>

<tr>
<td colspan="2">--endpointslice-updates-batch-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The length of endpoint slice updates batching period. Processing of pod changes will be delayed by this duration to join them with potential upcoming updates and reduce the overall number of endpoints updates. Larger number = higher endpoint programming latency, but lower number of endpoints revision generated
-->
端點片段（Endpoint Slice）批量更新週期時長。對 Pod 變更的處理會被延遲，
以便將其與即將到來的更新操作合併，從而減少端點更新操作次數。
較大的數值意味着端點更新的遲滯時間會增長，也意味着所生成的端點版本個數會變少。
</td>
</tr>

<tr>
<td colspan="2">--external-cloud-volume-plugin string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The plugin to use when cloud provider is set to external. Can be empty, should only be set when cloud-provider is external. Currently used to allow node-ipam-controller, persistentvolume-binder-controller, persistentvolume-expander-controller and attach-detach-controller to work for in tree cloud providers.
-->
當雲驅動程式設置爲 external 時要使用的插件名稱。此字符串可以爲空。
只能在雲驅動程式爲 external 時設置。
目前用來保證 node-ipam-controller、persistentvolume-binder-controller、persistentvolume-expander-controller
和 attach-detach-controller 能夠在三種雲驅動上正常工作。
</td>
</tr>

<tr>
<td colspan="2">--feature-gates colonSeparatedMultimapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Comma-separated list of component:key=value pairs that describe feature gates for alpha/experimental features of different components.<br/>
If the component is not specified, defaults to &quot;kube&quot;. This flag can be repeatedly invoked.
For example: --feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'Options are:<br/>
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
kube:WatchListClient=true|false (BETA - default=true)<br/>
kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
kube:WindowsGracefulNodeShutdown=true|false (BETA - default=true)
-->
逗號分隔的組件列表，這些 key=value 對用來描述不同組件測試性/試驗性特性的特性門控。<br/>
如果組件未被指定，預設值爲“kube”。此標誌可以被重複調用。例如：
--feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'
可選項爲：<br/>
kube:APIResponseCompression=true|false (BETA - 預設值=true)<br/>
kube:APIServerIdentity=true|false (BETA - 預設值=true)<br/>
kube:APIServingWithRoutine=true|false (ALPHA - 預設值=false)<br/>
kube:AllAlpha=true|false (ALPHA - 預設值=false)<br/>
kube:AllBeta=true|false (BETA - 預設值=false)<br/>
kube:AllowParsingUserUIDFromCertAuth=true|false (BETA - 預設值=true)<br/>
kube:AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - 預設值=false)<br/>
kube:CBORServingAndStorage=true|false (ALPHA - 預設值=false)<br/>
kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - 預設值=false)<br/>
kube:CPUManagerPolicyBetaOptions=true|false (BETA - 預設值=true)<br/>
kube:CSIVolumeHealth=true|false (ALPHA - 預設值=false)<br/>
kube:ClearingNominatedNodeNameAfterBinding=true|false (ALPHA - 預設值=false)<br/>
kube:ClientsAllowCBOR=true|false (ALPHA - 預設值=false)<br/>
kube:ClientsPreferCBOR=true|false (ALPHA - 預設值=false)<br/>
kube:CloudControllerManagerWebhook=true|false (ALPHA - 預設值=false)<br/>
kube:ClusterTrustBundle=true|false (BETA - 預設值=false)<br/>
kube:ClusterTrustBundleProjection=true|false (BETA - 預設值=false)<br/>
kube:ComponentFlagz=true|false (ALPHA - 預設值=false)<br/>
kube:ComponentStatusz=true|false (ALPHA - 預設值=false)<br/>
kube:ConcurrentWatchObjectDecode=true|false (BETA - 預設值=false)<br/>
kube:ContainerCheckpoint=true|false (BETA - 預設值=true)<br/>
kube:ContainerRestartRules=true|false (ALPHA - 預設值=false)<br/>
kube:ContainerStopSignals=true|false (ALPHA - 預設值=false)<br/>
kube:ContextualLogging=true|false (BETA - 預設值=true)<br/>
kube:CoordinatedLeaderElection=true|false (BETA - 預設值=false)<br/>
kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - 預設值=false)<br/>
kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - 預設值=false)<br/>
kube:DRAAdminAccess=true|false (BETA - 預設值=true)<br/>
kube:DRAConsumableCapacity=true|false (ALPHA - 預設值=false)<br/>
kube:DRADeviceBindingConditions=true|false (ALPHA - 預設值=false)<br/>
kube:DRADeviceTaints=true|false (ALPHA - 預設值=false)<br/>
kube:DRAExtendedResource=true|false (ALPHA - 預設值=false)<br/>
kube:DRAPartitionableDevices=true|false (ALPHA - 預設值=false)<br/>
kube:DRAPrioritizedList=true|false (BETA - 預設值=true)<br/>
kube:DRAResourceClaimDeviceStatus=true|false (BETA - 預設值=true)<br/>
kube:DRASchedulerFilterTimeout=true|false (BETA - 預設值=true)<br/>
kube:DeclarativeValidation=true|false (BETA - 預設值=true)<br/>
kube:DeclarativeValidationTakeover=true|false (BETA - 預設值=false)<br/>
kube:DeploymentReplicaSetTerminatingReplicas=true|false (ALPHA - 預設值=false)<br/>
kube:DetectCacheInconsistency=true|false (BETA - 預設值=true)<br/>
kube:DisableCPUQuotaWithExclusiveCPUs=true|false (BETA - 預設值=true)<br/>
kube:EnvFiles=true|false (ALPHA - 預設值=false)<br/>
kube:EventedPLEG=true|false (ALPHA - 預設值=false)<br/>
kube:ExternalServiceAccountTokenSigner=true|false (BETA - 預設值=true)<br/>
kube:GracefulNodeShutdown=true|false (BETA - 預設值=true)<br/>
kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - 預設值=true)<br/>
kube:HPAConfigurableTolerance=true|false (ALPHA - 預設值=false)<br/>
kube:HPAScaleToZero=true|false (ALPHA - 預設值=false)<br/>
kube:HostnameOverride=true|false (ALPHA - 預設值=false)<br/>
kube:ImageMaximumGCAge=true|false (BETA - 預設值=true)<br/>
kube:ImageVolume=true|false (BETA - 預設值=false)<br/>
kube:InOrderInformers=true|false (BETA - 預設值=true)<br/>
kube:InPlacePodVerticalScaling=true|false (BETA - 預設值=true)<br/>
kube:InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - 預設值=false)<br/>
kube:InPlacePodVerticalScalingExclusiveMemory=true|false (ALPHA - 預設值=false)<br/>
kube:InTreePluginPortworxUnregister=true|false (ALPHA - 預設值=false)<br/>
kube:InformerResourceVersion=true|false (ALPHA - 預設值=false)<br/>
kube:JobManagedBy=true|false (BETA - 預設值=true)<br/>
kube:KubeletCrashLoopBackOffMax=true|false (ALPHA - 預設值=false)<br/>
kube:KubeletEnsureSecretPulledImages=true|false (ALPHA - 預設值=false)<br/>
kube:KubeletFineGrainedAuthz=true|false (BETA - 預設值=true)<br/>
kube:KubeletInUserNamespace=true|false (ALPHA - 預設值=false)<br/>
kube:KubeletPSI=true|false (BETA - 預設值=true)<br/>
kube:KubeletPodResourcesDynamicResources=true|false (BETA - 預設值=true)<br/>
kube:KubeletPodResourcesGet=true|false (BETA - 預設值=true)<br/>
kube:KubeletSeparateDiskGC=true|false (BETA - 預設值=true)<br/>
kube:KubeletServiceAccountTokenForCredentialProviders=true|false (BETA - 預設值=true)<br/>
kube:ListFromCacheSnapshot=true|false (BETA - 預設值=true)<br/>
kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - 預設值=false)<br/>
kube:LoggingAlphaOptions=true|false (ALPHA - 預設值=false)<br/>
kube:LoggingBetaOptions=true|false (BETA - 預設值=true)<br/>
kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - 預設值=true)<br/>
kube:MatchLabelKeysInPodTopologySpreadSelectorMerge=true|false (BETA - 預設值=true)<br/>
kube:MaxUnavailableStatefulSet=true|false (ALPHA - 預設值=false)<br/>
kube:MemoryQoS=true|false (ALPHA - 預設值=false)<br/>
kube:MutableCSINodeAllocatableCount=true|false (BETA - 預設值=false)<br/>
kube:MutatingAdmissionPolicy=true|false (BETA - 預設值=false)<br/>
kube:NodeLogQuery=true|false (BETA - 預設值=false)<br/>
kube:NominatedNodeNameForExpectation=true|false (ALPHA - 預設值=false)<br/>
kube:OpenAPIEnums=true|false (BETA - 預設值=true)<br/>
kube:PodAndContainerStatsFromCRI=true|false (ALPHA - 預設值=false)<br/>
kube:PodCertificateRequest=true|false (ALPHA - 預設值=false)<br/>
kube:PodDeletionCost=true|false (BETA - 預設值=true)<br/>
kube:PodLevelResources=true|false (BETA - 預設值=true)<br/>
kube:PodLogsQuerySplitStreams=true|false (ALPHA - 預設值=false)<br/>
kube:PodObservedGenerationTracking=true|false (BETA - 預設值=true)<br/>
kube:PodReadyToStartContainersCondition=true|false (BETA - 預設值=true)<br/>
kube:PodTopologyLabelsAdmission=true|false (ALPHA - 預設值=false)<br/>
kube:PortForwardWebsockets=true|false (BETA - 預設值=true)<br/>
kube:PreferSameTrafficDistribution=true|false (BETA - 預設值=true)<br/>
kube:PreventStaticPodAPIReferences=true|false (BETA - 預設值=true)<br/>
kube:ProcMountType=true|false (BETA - 預設值=true)<br/>
kube:QOSReserved=true|false (ALPHA - 預設值=false)<br/>
kube:ReduceDefaultCrashLoopBackOffDecay=true|false (ALPHA - 預設值=false)<br/>
kube:RelaxedServiceNameValidation=true|false (ALPHA - 預設值=false)<br/>
kube:ReloadKubeletServerCertificateFile=true|false (BETA - 預設值=true)<br/>
kube:RemoteRequestHeaderUID=true|false (BETA - 預設值=true)<br/>
kube:ResourceHealthStatus=true|false (ALPHA - 預設值=false)<br/>
kube:RotateKubeletServerCertificate=true|false (BETA - 預設值=true)<br/>
kube:RuntimeClassInImageCriApi=true|false (ALPHA - 預設值=false)<br/>
kube:SELinuxChangePolicy=true|false (BETA - 預設值=true)<br/>
kube:SELinuxMount=true|false (BETA - 預設值=false)<br/>
kube:SELinuxMountReadWriteOncePod=true|false (BETA - 預設值=true)<br/>
kube:SchedulerAsyncAPICalls=true|false (BETA - 預設值=true)<br/>
kube:SchedulerAsyncPreemption=true|false (BETA - 預設值=true)<br/>
kube:SchedulerPopFromBackoffQ=true|false (BETA - 預設值=true)<br/>
kube:ServiceAccountNodeAudienceRestriction=true|false (BETA - 預設值=true)<br/>
kube:SizeBasedListCostEstimate=true|false (BETA - 預設值=true)<br/>
kube:StorageCapacityScoring=true|false (ALPHA - 預設值=false)<br/>
kube:StorageVersionAPI=true|false (ALPHA - 預設值=false)<br/>
kube:StorageVersionHash=true|false (BETA - 預設值=true)<br/>
kube:StorageVersionMigrator=true|false (ALPHA - 預設值=false)<br/>
kube:StrictIPCIDRValidation=true|false (ALPHA - 預設值=false)<br/>
kube:StructuredAuthenticationConfigurationEgressSelector=true|false (BETA - 預設值=true)<br/>
kube:SupplementalGroupsPolicy=true|false (BETA - 預設值=true)<br/>
kube:SystemdWatchdog=true|false (BETA - 預設值=true)<br/>
kube:TokenRequestServiceAccountUIDValidation=true|false (BETA - 預設值=true)<br/>
kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - 預設值=false)<br/>
kube:TopologyManagerPolicyBetaOptions=true|false (BETA - 預設值=true)<br/>
kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - 預設值=true)<br/>
kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - 預設值=true)<br/>
kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - 預設值=false)<br/>
kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - 預設值=false)<br/>
kube:UserNamespacesSupport=true|false (BETA - 預設值=true)<br/>
kube:WatchCacheInitializationPostStartHook=true|false (BETA - 預設值=false)<br/>
kube:WatchList=true|false (BETA - 預設值=true)<br/>
kube:WatchListClient=true|false (BETA - 預設值=true)<br/>
kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - 預設值=false)<br/>
kube:WindowsGracefulNodeShutdown=true|false (BETA - 預設值=true)
</p></td>
</tr>

<tr>
<td colspan="2">--flex-volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："/usr/libexec/kubernetes/kubelet-plugins/volume/exec/"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Full path of the directory in which the flex volume plugin should search for additional third party volume plugins.
-->
FlexVolume 插件要搜索第三方卷插件的目錄路徑全名。
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kube-controller-manager
-->
kube-controller-manager 的幫助資訊。
</td>
</tr>

<tr>
<td colspan="2">--horizontal-pod-autoscaler-cpu-initialization-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period after pod start when CPU samples might be skipped.
-->
Pod 啓動之後可以忽略 CPU 採樣值的時長。
</td>
</tr>

<tr>
<td colspan="2">--horizontal-pod-autoscaler-downscale-stabilization duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period for which autoscaler will look backwards and not scale down below any recommendation it made during that period.
-->
自動擴縮程式的回溯時長。
自動擴縮程式不會基於在給定的時長內所建議的規模對負載執行縮容操作。
</td>
</tr>

<tr>
<td colspan="2">--horizontal-pod-autoscaler-initial-readiness-delay duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period after pod start during which readiness changes will be treated as initial readiness.
-->
Pod 啓動之後，在此值所給定的時長內，就緒狀態的變化都不會作爲初始的就緒狀態。
</td>
</tr>

<tr>
<td colspan="2">--horizontal-pod-autoscaler-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period for syncing the number of pods in horizontal pod autoscaler.
-->
水平 Pod 擴縮器對 Pod 數目執行同步操作的週期。
</td>
</tr>

<tr>
<td colspan="2">--horizontal-pod-autoscaler-tolerance float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The minimum change (from 1.0) in the desired-to-actual metrics ratio for the horizontal pod autoscaler to consider scaling.
-->
此值爲目標值與實際值的比值與 1.0 的差值。只有超過此標誌所設的閾值時，
HPA 纔會考慮執行縮放操作。
</td>
</tr>

<tr>
<td colspan="2">--http2-max-streams-per-connection int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.
-->
伺服器爲客戶端所設置的 HTTP/2 連接中流式連接個數上限。
此值爲 0 表示採用 Go 語言庫所設置的預設值。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Burst to use while talking with kubernetes apiserver.
-->
與 Kubernetes API 伺服器通信時突發峯值請求個數上限。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Content type of requests sent to apiserver.
-->
向 API 伺服器發送請求時使用的內容類型（Content-Type）。
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：20</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
QPS to use while talking with kubernetes apiserver.
-->
與 API 伺服器通信時每秒請求數（QPS）限制。
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to kubeconfig file with authorization and master location information.
-->
指向 kubeconfig 檔案的路徑。該檔案中包含主控節點位置以及鑑權憑據資訊。
</td>
</tr>

<tr>
<td colspan="2">--large-cluster-size-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of nodes from which node-lifecycle-controller treats the cluster as large for the eviction logic purposes. --secondary-node-eviction-rate is implicitly overridden to 0 for clusters this size or smaller. Notice: If nodes reside in multiple zones, this threshold will be considered as zone node size threshold for each zone to determine node eviction rate independently.
-->
node-lifecycle-controller 在執行 Pod 驅逐操作邏輯時，
基於此標誌所設置的節點個數閾值來判斷所在叢集是否爲大規模叢集。
當叢集規模小於等於此規模時，
<code>--secondary-node-eviction-rate</code> 會被隱式重設爲 0。
注意：如果節點位於多個區域中，則此閾值將被每個區域視爲區域節點大小閾值，以獨立確定節點驅逐率。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.
-->
在執行主循環之前，啓動領導選舉（Leader Election）客戶端，並嘗試獲得領導者身份。
在運行多副本組件時啓用此標誌有助於提高可用性。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.
-->
對於未獲得領導者身份的節點，
在探測到領導者身份需要更迭時需要等待此標誌所設置的時長，
才能嘗試去獲得曾經是領導者但尚未續約的席位。本質上，
這個時長也是現有領導者節點在被其他候選節點替代之前可以停止的最長時長。
只有叢集啓用了領導者選舉機制時，此標誌才起作用。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than the lease duration. This is only applicable if leader election is enabled.
-->
當前執行領導者角色的節點在被停止履行領導職責之前可多次嘗試續約領導者身份；
此標誌給出相鄰兩次嘗試之間的間歇時長。
此值必須小於租期時長（Lease Duration）。
僅在叢集啓用了領導者選舉時有效。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："leases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The type of resource object that is used for locking during leader election. Supported options are 'leases'.
-->
在領導者選舉期間用於鎖定的資源對象的類型。 支持的選項爲
<code>leases</code>。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："kube-controller-manager"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The name of resource object that is used for locking during leader election.
-->
在領導者選舉期間，用來執行鎖操作的資源對象名稱。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The namespace of resource object that is used for locking during leader election.
-->
在領導者選舉期間，用來執行鎖操作的資源對象的名字空間。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.
-->
嘗試獲得領導者身份時，客戶端在相鄰兩次嘗試之間要等待的時長。
此標誌僅在啓用了領導者選舉的叢集中起作用。
</td>
</tr>

<tr>
<td colspan="2">--leader-migration-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to the config file for controller leader migration, or empty to use the value that reflects default configuration of the controller manager. The config file should be of type LeaderMigrationConfiguration, group controllermanager.config.k8s.io, version v1alpha1.
-->
控制器領導者遷移所用的設定檔案路徑。
此值爲空意味着使用控制器管理器的預設設定。
設定檔案應該是 <code>controllermanager.config.k8s.io</code> 組、
<code>v1alpha1</code> 版本的 <code>LeaderMigrationConfiguration</code> 結構。
</p></td>
</tr>

<tr>
<td colspan="2">--legacy-service-account-token-clean-up-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：8760h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
The period of time since the last usage of an legacy service account token before it can be deleted.
-->
從最近一次使用某個舊的服務賬號令牌計起，到該令牌在可以刪除之前的時長。
</p></td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes
-->
將內存中日誌資料清除到日誌檔案中時，相鄰兩次清除操作之間最大間隔秒數。
</td>
</tr>

<tr>
<td colspan="2">--log-text-info-buffer-size quantity</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[Alpha] In text format with split output streams, the info messages can be buffered for a while to increase performance. The default value of zero bytes disables buffering. The size can be specified as number of bytes (512), multiples of 1000 (1K), multiples of 1024 (2Ki), or powers of those (3M, 4G, 5Mi, 6Gi). Enable the LoggingAlphaOptions feature gate to use this.
-->
[Alpha] 在具有分割輸出流的文本格式中，資訊消息可以被緩衝一段時間以提高性能。
預設值零字節表示禁用緩衝區機制。
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
[Alpha] In text format, write error messages to stderr and info messages to stdout. The default is to write a single stream to stdout. Enable the LoggingAlphaOptions feature gate to use this.
-->
[Alpha] 以文本格式，將錯誤消息寫入 stderr，將資訊消息寫入 stdout。
預設是將單個流寫入標準輸出。
啓用 LoggingAlphaOptions 特性門控以使用此功能。
</p>
</td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："text"</td>
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
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The address of the Kubernetes API server (overrides any value in kubeconfig).
-->
Kubernetes API 伺服器的地址。此值會覆蓋 kubeconfig 檔案中所給的地址。
</td>
</tr>

<tr>
<td colspan="2">--max-endpoints-per-slice int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum number of endpoints that will be added to an EndpointSlice. More endpoints per slice will result in less endpoint slices, but larger resources. Defaults to 100.
-->
每個 EndpointSlice 中可以添加的端點個數上限。每個片段中端點個數越多，
得到的片段個數越少，但是片段的規模會變得更大。預設值爲 100。
</td>
</tr>

<tr>
<td colspan="2">--min-resync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：12h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The resync period in reflectors will be random between MinResyncPeriod and 2*MinResyncPeriod.
-->
自省程式的重新同步時隔下限。實際時隔長度會在 <code>min-resync-period</code> 和
<code>2 * min-resync-period</code> 之間。
</td>
</tr>

<tr>
<td colspan="2">--mirroring-concurrent-service-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of service endpoint syncing operations that will be done concurrently by the endpointslice-mirroring-controller. Larger number = faster endpoint slice updating, but more CPU (and network) load. Defaults to 5.
-->
endpointslice-mirroring-controller 將同時執行的服務端點同步操作數。
較大的數量 = 更快的端點切片更新，但 CPU（和網路）負載更多。 預設爲 5。
</td>
</tr>

<tr>
<td colspan="2">--mirroring-endpointslice-updates-batch-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The length of EndpointSlice updates batching period for endpointslice-mirroring-controller. Processing of EndpointSlice changes will be delayed by this duration to join them with potential upcoming updates and reduce the overall number of EndpointSlice updates. Larger number = higher endpoint programming latency, but lower number of endpoints revision generated
-->
EndpointSlice 的長度會更新 endpointslice-mirroring-controller 的批處理週期。
EndpointSlice 更改的處理將延遲此持續時間，
以使它們與潛在的即將進行的更新結合在一起，並減少 EndpointSlice 更新的總數。 
較大的數量 = 較高的端點編程延遲，但是生成的端點修訂版本數量較少
</td>
</tr>

<tr>
<td colspan="2">--mirroring-max-endpoints-per-subset int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum number of endpoints that will be added to an EndpointSlice by the endpointslice-mirroring-controller. More endpoints per slice will result in less endpoint slices, but larger resources. Defaults to 100.
-->
endpointslice-mirroring-controller 可添加到某 EndpointSlice 的端點個數上限。
每個分片的端點越多，端點分片越少，但資源越大。預設爲 100。
</td>
</tr>

<tr>
<td colspan="2">--namespace-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period for syncing namespace life-cycle updates
-->
對名字空間對象進行同步的週期。
</td>
</tr>

<tr>
<td colspan="2">--node-cidr-mask-size int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Mask size for node cidr in cluster. Default is 24 for IPv4 and 64 for IPv6.
-->
叢集中節點 CIDR 的掩碼長度。對 IPv4 而言預設爲 24；對 IPv6 而言預設爲 64。
</td>
</tr>

<tr>
<td colspan="2">--node-cidr-mask-size-ipv4 int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Mask size for IPv4 node cidr in dual-stack cluster. Default is 24.
-->
在雙堆棧（同時支持 IPv4 和 IPv6）的叢集中，節點 IPV4 CIDR 掩碼長度。預設爲 24。
</td>
</tr>

<tr>
<td colspan="2">--node-cidr-mask-size-ipv6 int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Mask size for IPv6 node cidr in dual-stack cluster. Default is 64.
-->
在雙堆棧（同時支持 IPv4 和 IPv6）的叢集中，節點 IPv6 CIDR 掩碼長度。預設爲 64。
</td>
</tr>

<tr>
<td colspan="2">--node-eviction-rate float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of nodes per second on which pods are deleted in case of node failure when a zone is healthy (see --unhealthy-zone-threshold for definition of healthy/unhealthy). Zone refers to entire cluster in non-multizone clusters.
-->
當某區域健康時，在節點故障的情況下每秒刪除 Pods 的節點數。
請參閱 <code>--unhealthy-zone-threshold</code>
以瞭解“健康”的判定標準。
這裏的區域（zone）在叢集並不跨多個區域時指的是整個叢集。
</td>
</tr>

<tr>
<td colspan="2">--node-monitor-grace-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：50s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Amount of time which we allow running Node to be unresponsive before marking it unhealthy. Must be N times more than kubelet's nodeStatusUpdateFrequency, where N means number of retries allowed for kubelet to post node status. This value should also be greater than the sum of HTTP2_PING_TIMEOUT_SECONDS and HTTP2_READ_IDLE_TIMEOUT_SECONDS
-->
在將一個 Node 標記爲不健康之前允許其無響應的時長上限。
必須比 kubelet 的 nodeStatusUpdateFrequency 大 N 倍；
這裏 N 指的是 kubelet 發送節點狀態的重試次數。
此值也應大於 HTTP2_PING_TIMEOUT_SECONDS 與 HTTP2_READ_IDLE_TIMEOUT_SECONDS 之和。
</td>
</tr>

<tr>
<td colspan="2">--node-monitor-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period for syncing NodeStatus in cloud-node-lifecycle-controller.
-->
cloud-node-lifecycle-controller 對節點狀態進行同步的週期。
</td>
</tr>

<tr>
<td colspan="2">--node-startup-grace-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Amount of time which we allow starting Node to be unresponsive before marking it unhealthy.
-->
在節點啓動期間，節點可以處於無響應狀態；
但超出此標誌所設置的時長仍然無響應則該節點被標記爲不健康。
</td>
</tr>

<tr>
<td colspan="2">--permit-address-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, SO_REUSEADDR will be used when binding the port. This allows binding to wildcard IPs like 0.0.0.0 and specific IPs in parallel, and it avoids waiting for the kernel to release sockets in TIME_WAIT state. [default=false]
-->
如果此標誌爲 true，則在綁定端口時使用 <code>SO_REUSEADDR</code>。
這就意味着可以同時綁定到 <code>0.0.0.0</code> 和特定的 IP 地址，
並且避免等待內核釋放處於 <code>TIME_WAITE</code> 狀態的套接字。[預設值=false]。
</p></td>
</tr>


<tr>
<td colspan="2">--permit-port-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, SO_REUSEPORT will be used when binding the port, which allows more than one instance to bind on the same address and port. [default=false]
-->
如果爲 true，則在綁定端口時將使用 <code>SO_REUSEPORT</code>，
這允許多個實例在同一地址和端口上進行綁定。[預設值=false]。
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
通過位於 <code>host:port/debug/pprof/</code> 的 Web 介面啓用性能分析。
</td>
</tr>

<tr>
<td colspan="2">--pv-recycler-increment-timeout-nfs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
the increment of time added per Gi to ActiveDeadlineSeconds for an NFS scrubber pod
-->
NFS 清洗 Pod 在清洗用過的卷時，根據此標誌所設置的秒數，
爲每清洗 1 GiB 資料增加對應超時時長，作爲 activeDeadlineSeconds。
</td>
</tr>

<tr>
<td colspan="2">--pv-recycler-minimum-timeout-hostpath int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：60</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The minimum ActiveDeadlineSeconds to use for a HostPath Recycler pod.  This is for development and testing only and will not work in a multi-node cluster.
-->
對於 HostPath 回收器 Pod，設置其 activeDeadlineSeconds 參數下限。
此參數僅用於開發和測試目的，不適合在多節點叢集中使用。
</td>
</tr>

<tr>
<td colspan="2">--pv-recycler-minimum-timeout-nfs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The minimum ActiveDeadlineSeconds to use for an NFS Recycler pod
-->
NFS 回收器 Pod 要使用的 activeDeadlineSeconds 參數下限。
</td>
</tr>

<tr>
<td colspan="2">--pv-recycler-pod-template-filepath-hostpath string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The file path to a pod definition used as a template for HostPath persistent volume recycling. This is for development and testing only and will not work in a multi-node cluster.
-->
對 HostPath 持久捲進行回收利用時，用作模板的 Pod 定義檔案所在路徑。
此標誌僅用於開發和測試目的，不適合多節點叢集中使用。
</td>
</tr>

<tr>
<td colspan="2">--pv-recycler-pod-template-filepath-nfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The file path to a pod definition used as a template for NFS persistent volume recycling
-->
對 NFS 卷執行回收利用時，用作模板的 Pod 定義檔案所在路徑。
</td>
</tr>

<tr>
<td colspan="2">--pv-recycler-timeout-increment-hostpath int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：30</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
the increment of time added per Gi to ActiveDeadlineSeconds for a HostPath scrubber pod.  This is for development and testing only and will not work in a multi-node cluster.
-->
HostPath 清洗器 Pod 在清洗對應類型持久卷時，爲每 GiB 資料增加此標誌所設置的秒數，
作爲其 activeDeadlineSeconds 參數。此標誌僅用於開發和測試環境，不適合多節點叢集環境。
</td>
</tr>

<tr>
<td colspan="2">--pvclaimbinder-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period for syncing persistent volumes and persistent volume claims
-->
持久卷（PV）和持久卷申領（PVC）對象的同步週期。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-allowed-names strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.
-->
標誌值是客戶端證書中的 Common Names 列表。其中所列的名稱可以通過
<code>--requestheader-username-headers</code> 所設置的 HTTP 頭部來提供使用者名。
如果此標誌值爲空表，則被 <code>--requestheader-client-ca-file</code>
中機構所驗證過的所有客戶端證書都是允許的。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.
-->
根證書包檔案名。在信任通過 <code>--requestheader-username-headers</code>
所指定的任何使用者名之前，要使用這裏的證書來檢查請求中的客戶證書。
警告：一般不要依賴對請求所作的鑑權結果。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-extra-headers-prefix strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>"x-remote-extra-"</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request header prefixes to inspect. X-Remote-Extra- is suggested.
-->
要檢查的請求頭前綴的列表。建議使用 <code>X-Remote-Exra-</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>"x-remote-group"</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for groups. X-Remote-Group is suggested.
-->
用來檢查使用者組名的請求頭的列表。建議使用 <code>X-Remote-Group</code>。
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
用來檢查 UID 的請求頭的列表。建議使用 <code>X-Remote-Uid</code>。
要求 RemoteRequestHeaderUID 特性被啓用。
</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>"x-remote-user"</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for usernames. X-Remote-User is common.
-->
用來檢查使用者名的請求頭的列表。建議使用 <code>X-Remote-User</code>。
</td>
</tr>

<tr>
<td colspan="2">--resource-quota-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period for syncing quota usage status in the system
-->
對系統中配額用量資訊進行同步的週期。
</td>
</tr>

<tr>
<td colspan="2">--root-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, this root certificate authority will be included in service account's token secret. This must be a valid PEM-encoded CA bundle.
-->
如果此標誌非空，則在服務賬號的令牌 Secret 中會包含此根證書機構。
所指定標誌值必須是一個合法的 PEM 編碼的 CA 證書包。
</td>
</tr>

<tr>
<td colspan="2">--route-reconciliation-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period for reconciling routes created for Nodes by cloud provider.
-->
對雲驅動爲節點所創建的路由資訊進行調解的週期。
</td>
</tr>

<tr>
<td colspan="2">--secondary-node-eviction-rate float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.01</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of nodes per second on which pods are deleted in case of node failure when a zone is unhealthy (see --unhealthy-zone-threshold for definition of healthy/unhealthy). Zone refers to entire cluster in non-multizone clusters. This value is implicitly overridden to 0 if the cluster size is smaller than --large-cluster-size-threshold.
-->
當一個區域不健康造成節點失效時，每秒鐘從此標誌所給的節點上刪除 Pod 的節點個數。
參見 <code>--unhealthy-zone-threshold</code> 以瞭解“健康與否”的判定標準。
在只有一個區域的叢集中，區域指的是整個叢集。如果叢集規模小於
<code>--large-cluster-size-threshold</code> 所設置的節點個數時，
此值被隱式地重設爲 0。
</td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10257</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.
-->
在此端口上提供 HTTPS 身份認證和鑑權操作。若此標誌值爲 0，則不提供 HTTPS 服務。
</td>
</tr>

<tr>
<td colspan="2">--service-account-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables legacy secret-based tokens when set. Filename containing a PEM-encoded private RSA or ECDSA key used to sign service account tokens.
-->
設置此項後將啓用傳統的基於 Secret 的令牌。
包含 PEM 編碼的 RSA 或 ECDSA 私鑰資料的檔案名，這些私鑰用來對服務賬號令牌簽名。
</td>
</tr>

<tr>
<td colspan="2">--service-cluster-ip-range string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
CIDR Range for Services in cluster. Only used when --allocate-node-cidrs=true; if false, this option will be ignored.
-->
叢集中 Service 對象的 CIDR 範圍。僅當 <code>--allocate-node-cidrs=true</code> 時此選項纔會被使用。
如果爲 false，此選項將被忽略。
</td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is &lt;major&gt;.&lt;minor&gt;, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that.
-->
你希望展示隱藏度量值的上一個版本。只有上一個次版本號有意義，其他值都是不允許的。
字符串格式爲 "&lt;major&gt;.&lt;minor&gt;"。例如："1.16"。
此格式的目的是確保你能夠有機會注意到下一個版本隱藏了一些額外的度量值，
而不是在更新版本中某些度量值被徹底刪除時措手不及。
</td>
</tr>

<tr>
<td colspan="2">--terminated-pod-gc-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：12500</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of terminated pods that can exist before the terminated pod garbage collector starts deleting terminated pods. If &lt;= 0, the terminated pod garbage collector is disabled.
-->
在已終止 Pod 垃圾收集器刪除已終止 Pod 之前，可以保留的已終止 Pod 的個數上限。
若此值小於等於 0，則相當於禁止垃圾回收已終止的 Pod。
</td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.
-->
包含 HTTPS 所用的預設 X509 證書的檔案。如果有 CA 證書，會被串接在伺服器證書之後。
若啓用了 HTTPS 服務且 <code>--tls-cert-file</code> 和 <code>--tls-private-key-file</code>
標誌未設置，
則爲節點的公開地址生成自簽名的證書和密鑰，並保存到 <code>--cert-dir</code>
所給的目錄中。
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>Preferred values: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256.<br/>Insecure values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384, TLS_RSA_WITH_RC4_128_SHA.
-->
供伺服器使用的加密包的逗號分隔列表。若忽略此標誌，則使用 Go 語言預設的加密包。<br/>
可選值包括：TLS_AES_128_GCM_SHA256、TLS_AES_256_GCM_SHA384、TLS_CHACHA20_POLY1305_SHA256、TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA、
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384、
TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256、TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA、
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384、
TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256。
<br/>不安全的值：TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_ECDSA_WITH_RC4_128_SHA、TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA、
TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_RSA_WITH_RC4_128_SHA、TLS_RSA_WITH_3DES_EDE_CBC_SHA、TLS_RSA_WITH_AES_128_CBC_SHA、
TLS_RSA_WITH_AES_128_CBC_SHA256、TLS_RSA_WITH_AES_128_GCM_SHA256、TLS_RSA_WITH_AES_256_CBC_SHA、TLS_RSA_WITH_AES_256_GCM_SHA384、
TLS_RSA_WITH_RC4_128_SHA。
</p>
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
可支持的最低 TLS 版本。可選值包括：
“VersionTLS10”、“VersionTLS11”、“VersionTLS12”、“VersionTLS13”。
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
包含與 <code>--tls-cert-file</code> 對應的預設 X509 私鑰的檔案。
</td>
</tr>

<tr>
<td colspan="2">--tls-sni-cert-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. The domain patterns also allow IP addresses, but IPs should only be used if the apiserver has visibility to the IP address requested by a client. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: &quot;example.crt,example.key&quot; or &quot;foo.crt,foo.key:*.foo.com,foo.com&quot;.
-->
X509 證書和私鑰檔案路徑的耦對。作爲可選項，可以添加域名模式的列表，
其中每個域名模式都是可以帶通配片段前綴的全限定域名（FQDN）。
域名模式也可以使用 IP 地址字符串，
不過只有 API 伺服器在所給 IP 地址上對客戶端可見時纔可以使用 IP 地址。
在未提供域名模式時，從證書中提取域名。
如果有非通配方式的匹配，則優先於通配方式的匹配；顯式的域名模式優先於提取的域名。
當存在多個密鑰/證書耦對時，可以多次使用 <code>--tls-sni-cert-key</code> 標誌。
例如：<code>example.crt,example.key</code> 或 <code>foo.crt,foo.key:\*.foo.com,foo.com</code>。
</td>
</tr>

<tr>
<td colspan="2">--unhealthy-zone-threshold float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.55</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Fraction of Nodes in a zone which needs to be not Ready (minimum 3) for zone to be treated as unhealthy. 
-->
僅當給定區域中處於非就緒狀態的節點（最少 3 個）的佔比高於此值時，
纔將該區域視爲不健康。
</td>
</tr>

<tr>
<td colspan="2">--use-service-account-credentials</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, use individual service account credentials for each controller.
-->
當此標誌爲 true 時，爲每個控制器單獨使用服務賬號憑據。
</td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
number for the log level verbosity-->
日誌級別詳細程度取值。
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version
-->
--version, --version=raw 打印版本資訊之後退出；
--version=vX.Y.Z... 設置報告的版本。
</td>
</tr>

<tr>
<td colspan="2">--vmodule pattern=N,...</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
comma-separated list of pattern=N settings for file-filtered logging (only works for text log format)
-->
由逗號分隔的列表，每一項都是 pattern=N 格式，用來執行根據檔案過濾的日誌行爲（僅適用於 text 日誌格式）。
</td>
</tr>

</tbody>
</table>

