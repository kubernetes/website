---
title: kube-controller-manager
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
The Kubernetes controller manager is a daemon that embeds
the core control loops shipped with Kubernetes. In applications of robotics and
automation, a control loop is a non-terminating loop that regulates the state of
the system. In Kubernetes, a controller is a control loop that watches the shared
state of the cluster through the apiserver and makes changes attempting to move the
current state towards the desired state. Examples of controllers that ship with
Kubernetes today are the replication controller, endpoints controller, namespace
controller, and serviceaccounts controller.
-->
Kubernetes 控制器管理器是一個守護程序，內嵌隨 Kubernetes 一起釋出的核心控制迴路。
在機器人和自動化的應用中，控制迴路是一個永不休止的迴圈，用於調節系統狀態。
在 Kubernetes 中，每個控制器是一個控制迴路，透過 API 伺服器監視叢集的共享狀態，
並嘗試進行更改以將當前狀態轉為期望狀態。
目前，Kubernetes 自帶的控制器例子包括副本控制器、節點控制器、名稱空間控制器和服務賬號控制器等。

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
Should CIDRs for Pods be allocated and set on the cloud provider.
-->
基於雲驅動來為 Pod 分配和設定子網掩碼。
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
從度量值標籤到准許值列表的對映。鍵名的格式為&lt;MetricName&gt;,&lt;LabelName&gt;。
准許值的格式為&lt;allowed_value&gt;,&lt;allowed_value&gt;...。
例如，<code>metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3'
metric2,label='v1,v2,v3'</code>。
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
此時長必須長於 1 秒鐘。此值設定為大於預設值時，可能導致儲存卷無法與 Pods 匹配。
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
此標誌值為一個 kubeconfig 檔案的路徑名。該檔案中包含與某 Kubernetes “核心” 
伺服器相關的資訊，並支援足夠的許可權以建立 tokenreviews.authentication.k8s.io。
此選項是可選的。如果設定為空值，所有令牌請求都會被認作匿名請求，
Kubernetes 也不再在叢集中查詢客戶端的 CA 證書資訊。
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
此值為 false 時，透過 authentication-kubeconfig 引數所指定的檔案會被用來
檢索叢集中缺失的身份認證配置資訊。
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
對 Webhook 令牌認證設施返回結果的快取時長。
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
此值為 true 時，即使無法從叢集中檢索到缺失的身份認證配置資訊也無大礙。
需要注意的是，這樣設定可能導致所有請求都被視作匿名請求。
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
所包含資訊具有建立 subjectaccessreviews.authorization.k8s.io 的足夠許可權。
此引數是可選的。如果配置為空字串，未被鑑權模組所忽略的請求都會被禁止。
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
對 Webhook 形式鑑權元件所返回的“已授權（Authorized）”響應的快取時長。
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
對 Webhook 形式鑑權元件所返回的“未授權（Unauthorized）”響應的快取時長。
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
指向包含 Azure 容器倉庫配置資訊的檔案的路徑名。
</td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces will be used.
-->
針對 <code>--secure-port</code> 埠上請求執行監聽操作的 IP 地址。
所對應的網路介面必須從叢集中其它位置可訪問（含命令列及 Web 客戶端）。
如果此值為空或者設定為非特定地址（<code>0.0.0.0</code> 或 <code>::</code>），
意味著所有網路介面都在監聽範圍。
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
要使用的 CIDR 分配器型別。
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
如果設定了此標誌，對於所有能夠提供客戶端證書的請求，若該證書由
<code>--client-ca-file</code> 中所給機構之一簽署，則該請求會被
成功認證為客戶端證書中 CommonName 所標識的實體。
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
雲驅動程式配置檔案的路徑。空字串表示沒有配置檔案。
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
雲服務的提供者。空字串表示沒有對應的提供者（驅動）。
</td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
CIDR Range for Pods in cluster. Requires --allocate-node-cidrs to be true
-->
叢集中 Pods 的 CIDR 範圍。要求 <code>--allocate-node-cidrs</code> 標誌為 true。
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
叢集例項的字首。
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
包含 PEM 編碼格式的 X509 CA 證書的檔名。該證書用來發放叢集範圍的證書。
如果設定了此標誌，則不能指定更具體的<code>--cluster-signing-*</code> 標誌。
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
所簽名證書的有效期限。每個 CSR 可以透過設定 spec.expirationSeconds 來請求更短的證書。
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
包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔名。該私鑰用來對叢集範圍證書籤名。
若指定了此選項，則不可再設定 <code>--cluster-signing-*</code> 引數。
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
包含 PEM 編碼的 X509 CA 證書的檔名，
該證書用於為 kubernetes.io/kube-apiserver-client 簽署者頒發證書。 
如果指定，則不得設定 <code>--cluster-signing-{cert,key}-file</code>。
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
包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔名，
該私鑰用於為 kubernetes.io/kube-apiserver-client 簽署者簽名證書。 
如果指定，則不得設定 <code>--cluster-signing-{cert,key}-file</code>。
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
包含 PEM 編碼的 X509 CA 證書的檔名，
該證書用於為 kubernetes.io/kube-apiserver-client-kubelet 簽署者頒發證書。 
如果指定，則不得設定 <code>--cluster-signing-{cert,key}-file</code>。
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
包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔名，
該私鑰用於為 kubernetes.io/kube-apiserver-client-kubelet 簽署者簽名證書。
如果指定，則不得設定 <code>--cluster-signing-{cert,key}-file</code>。
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
包含 PEM 編碼的 X509 CA 證書的檔名，
該證書用於為 kubernetes.io/kubelet-serving 簽署者頒發證書。
如果指定，則不得設定 </code>--cluster-signing-{cert,key}-file</code>。
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
包含 PEM 編碼的 RSA或ECDSA 私鑰的檔名，
該私鑰用於對 kubernetes.io/kubelet-serving 簽署者的證書進行簽名。
如果指定，則不得設定 <code>--cluster-signing-{cert,key}-file</code>。
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
包含 PEM 編碼的 X509 CA 證書的檔名，
用於為 kubernetes.io/legacy-unknown 簽署者頒發證書。
如果指定，則不得設定 <code>--cluster-signing-{cert,key}-file</code>。
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
包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔名，
用於為 kubernetes.io/legacy-unknown 簽署者簽名證書。
如果指定，則不得設定 <code>--cluster-signing-{cert,key}-file</code>。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-deployment-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of deployment objects that are allowed to sync concurrently. Larger number = more responsive deployments, but more CPU (and network) load
-->
可以併發同步的 Deployment 物件個數。數值越大意味著對 Deployment 的響應越及時，
同時也意味著更大的 CPU（和網路頻寬）壓力。
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
可以併發執行的 Endpoints 同步操作個數。數值越大意味著更快的 Endpoints 更新操作，
同時也意味著更大的 CPU （和網路）壓力。
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
可以併發執行的 EphemeralVolume 同步操作個數。數值越大意味著更快的 EphemeralVolume 更新操作，
同時也意味著更大的 CPU （和網路）壓力。
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
<td colspan="2">--concurrent-namespace-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of namespace objects that are allowed to sync concurrently. Larger number = more responsive namespace termination, but more CPU (and network) load
-->
可以併發同步的 Namespace 物件個數。較大的數值意味著更快的名字空間終結操作，
不過也意味著更多的 CPU （和網路）佔用。
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
可以併發同步的副本控制器物件個數。較大的數值意味著更快的副本管理操作，
不過也意味著更多的 CPU （和網路）佔用。
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
可以併發同步的 ReplicaSet 個數。數值越大意味著副本管理的響應速度越快，
同時也意味著更多的 CPU （和網路）佔用。
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
可以併發同步的 ResourceQuota 物件個數。數值越大，配額管理的響應速度越快，
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
的更新速度越快，不過對 CPU （和網路）的佔用也越高。預設值為 5。
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
可以併發同步的 Service 物件個數。數值越大，服務管理的響應速度越快，
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
可以併發同步的服務賬號令牌物件個數。數值越大，令牌生成的速度越快，
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
可以併發同步的 StatefulSet 物件個數。數值越大，StatefulSet 管理的響應速度越快，
不過對 CPU （和網路）的佔用也越高。
</td>
</tr>

<tr>
<td colspan="2">--concurrent-ttl-after-finished-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The number of TTL-after-finished controller workers that are allowed to sync concurrently.
-->
可以併發同步的 TTL-after-finished 控制器執行緒個數。
</td>
</tr>

<tr>
<td colspan="2">--configure-cloud-routes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Should CIDRs allocated by allocate-node-cidrs be configured on the cloud provider.
-->
決定是否由 <code>--allocate-node-cidrs</code> 所分配的 CIDR 要透過雲驅動程式來配置。
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
在啟用了效能分析（profiling）時，也啟用鎖競爭情況分析。
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
在兩次啟動控制器管理器之間的時間間隔。
</td>
</tr>

<tr>
<td colspan="2">--controllers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>*</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of controllers to enable. '*' enables all on-by-default controllers, 'foo' enables the controller named 'foo', '-foo' disables the controller named 'foo'.<br/>All controllers: attachdetach, bootstrapsigner, cloud-node-lifecycle, clusterrole-aggregation, cronjob, csrapproving, csrcleaner, csrsigning, daemonset, deployment, disruption, endpoint, endpointslice, endpointslicemirroring, ephemeral-volume, garbagecollector, horizontalpodautoscaling, job, namespace, nodeipam, nodelifecycle, persistentvolume-binder, persistentvolume-expander, podgc, pv-protection, pvc-protection, replicaset, replicationcontroller, resourcequota, root-ca-cert-publisher, route, service, serviceaccount, serviceaccount-token, statefulset, tokencleaner, ttl, ttl-after-finished<br/>Disabled-by-default controllers: bootstrapsigner, tokencleaner
-->
要啟用的控制器列表。<code>\*</code> 表示啟用所有預設啟用的控制器；
<code>foo</code> 啟用名為 foo 的控制器；
<code>-foo</code> 表示禁用名為 foo 的控制器。<br/>
控制器的全集：attachdetach、bootstrapsigner、cloud-node-lifecycle、clusterrole-aggregation、cronjob、csrapproving、csrcleaner、csrsigning、daemonset、deployment、disruption、endpoint、endpointslice、endpointslicemirroring、ephemeral-volume、garbagecollector、horizontalpodautoscaling、job、namespace、nodeipam、nodelifecycle、persistentvolume-binder、persistentvolume-expander、podgc、pv-protection、pvc-protection、replicaset、replicationcontroller、resourcequota、root-ca-cert-publisher、route、service、serviceaccount、serviceaccount-token、statefulset、tokencleaner、ttl、ttl-after-finished<br/>
預設禁用的控制器有：bootstrapsigner 和 tokencleaner。</td>
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
<td colspan="2">--disabled-metrics strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
This flag provides an escape hatch for misbehaving metrics. You must provide the fully qualified metric name in order to disable it. Disclaimer: disabling metrics is higher in precedence than showing hidden metrics.
-->
此標誌提供對行為異常的度量值的防控措施。你必須提供度量值的
完全限定名稱才能將其禁用。<B>宣告</B>：禁用度量值的操作比顯示隱藏度量值
的操作優先順序高。
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
在環境允許的情況下啟用動態卷製備。
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
啟用通用垃圾收集器。必須與 kube-apiserver 中對應的標誌一致。
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
在沒有云驅動程式的情況下，啟用 HostPath 持久卷的製備。
此引數便於對卷供應功能進行開發和測試。HostPath 卷的製備並非受支援的功能特性，
在多節點的叢集中也無法工作，因此除了開發和測試環境中不應使用。
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
此標誌決定是否啟用控制器領導者遷移。
</p></td>
</tr>


<tr>
<td colspan="2">--enable-taint-manager&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
WARNING: Beta feature. If set to true enables NoExecute Taints and will evict all not-tolerating Pod running on Nodes tainted with this kind of Taints.
-->
警告：此為Beta 階段特性。設定為 true 時會啟用 NoExecute 汙點，
並在所有標記了此汙點的節點上逐出所有無法忍受該汙點的 Pods。
</td>
</tr>

<tr>
<td colspan="2">--endpoint-updates-batch-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The length of endpoint updates batching period. Processing of pod changes will be delayed by this duration to join them with potential upcoming updates and reduce the overall number of endpoints updates. Larger number = higher endpoint programming latency, but lower number of endpoints revision generated
-->
端點（Endpoint）批次更新週期時長。對 Pods 變更的處理會被延遲，
以便將其與即將到來的更新操作合併，從而減少端點更新操作次數。
較大的數值意味著端點更新的遲滯時間會增長，也意味著所生成的端點版本個數會變少。
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
端點片段（Endpoint Slice）批次更新週期時長。對 Pods 變更的處理會被延遲，
以便將其與即將到來的更新操作合併，從而減少端點更新操作次數。
較大的數值意味著端點更新的遲滯時間會增長，也意味著所生成的端點版本個數會變少。
</td>
</tr>

<tr>
<td colspan="2">--external-cloud-volume-plugin string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The plugin to use when cloud provider is set to external. Can be empty, should only be set when cloud-provider is external. Currently used to allow node and volume controllers to work for in tree cloud providers.
-->
當雲驅動程式設定為 external 時要使用的外掛名稱。此字串可以為空。
只能在雲驅動程式為 external 時設定。目前用來保證節點控制器和卷控制器能夠
在三種雲驅動上正常工作。
</td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;<!--comma-separated 'key=True|False' pairs-->逗號分隔的 'key=True|False' 對列表&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
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
CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
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
InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>
InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>
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
一組 key=value 對，用來描述測試性/試驗性功能的特性門控（Feature Gate）。可選項有：
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
CPUManagerPolicyAlphaOptions=true|false (ALPHA - 預設值=false)<br/>
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
InTreePluginAzureFileUnregister=true|false (ALPHA - 預設值=false)<br/>
InTreePluginGCEUnregister=true|false (ALPHA - 預設值=false)<br/>
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
SeccompDefault=true|false (ALPHA - 預設值=false)<br/>
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
WindowsHostProcessContainers=true|false (BETA - 預設值=true)
</p>
</td>
</tr>

<tr>
<td colspan="2">--flex-volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："/usr/libexec/kubernetes/kubelet-plugins/volume/exec/"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Full path of the directory in which the flex volume plugin should search for additional third party volume plugins.
-->
FlexVolume 外掛要搜尋第三方卷外掛的目錄路徑全名。
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
Pod 啟動之後可以忽略 CPU 取樣值的時長。
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
自動擴縮程式的回溯時長。自動擴縮器不會基於在給定的時長內所建議的規模
對負載執行規模縮小的操作。
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
Pod 啟動之後，在此值所給定的時長內，就緒狀態的變化都不會作為初始的就緒狀態。
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
水平 Pod 擴縮器對 Pods 數目執行同步操作的週期。
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
此值為目標值與實際值的比值與 1.0 的差值。只有超過此標誌所設的閾值時，
HPA 才會考慮執行縮放操作。
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
伺服器為客戶端所設定的 HTTP/2 連線中流式連線個數上限。
此值為 0 表示採用 Go 語言庫所設定的預設值。
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
與 Kubernetes API 伺服器通訊時突發峰值請求個數上限。
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
向 API 伺服器傳送請求時使用的內容型別（Content-Type）。
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
與 API 伺服器通訊時每秒請求數（QPS）限制。
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
Number of nodes from which NodeController treats the cluster as large for the eviction logic purposes. --secondary-node-eviction-rate is implicitly overridden to 0 for clusters this size or smaller.
-->
節點控制器在執行 Pod 逐出操作邏輯時，基於此標誌所設定的節點個數閾值來判斷
所在叢集是否為大規模叢集。當叢集規模小於等於此規模時，
<code>--secondary-node-eviction-rate</code> 會被隱式重設為 0。
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
在執行主迴圈之前，啟動領導選舉（Leader Election）客戶端，並嘗試獲得領導者身份。
在執行多副本元件時啟用此標誌有助於提高可用性。
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
對於未獲得領導者身份的節點，在探測到領導者身份需要更迭時需要等待
此標誌所設定的時長，才能嘗試去獲得曾經是領導者但尚未續約的席位。
本質上，這個時長也是現有領導者節點在被其他候選節點替代之前可以停止
的最長時長。只有叢集啟用了領導者選舉機制時，此標誌才起作用。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.
-->
當前執行領導者角色的節點在被停止履行領導職責之前可多次嘗試續約領導者身份；
此標誌給出相鄰兩次嘗試之間的間歇時長。
此值必須小於或等於租期時長（Lease Duration）。
僅在叢集啟用了領導者選舉時有效。
</td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值："leases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The type of resource object that is used for locking during leader election. Supported options are 'leases', 'endpointsleases' and 'configmapsleases'.
-->
在領導者選舉期間用於鎖定的資源物件的型別。 支援的選項為
"leases"、"endpointsleases" 和 "configmapsleases"。
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
在領導者選舉期間，用來執行鎖操作的資源物件名稱。
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
在領導者選舉期間，用來執行鎖操作的資源物件的名字空間。
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
此標誌僅在啟用了領導者選舉的叢集中起作用。
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
控制器領導者遷移所用的配置檔案路徑。
此值為空意味著使用控制器管理器的預設配置。
配置檔案應該是 <code>controllermanager.config.k8s.io</code> 組、
<code>v1alpha1</code> 版本的 <code>LeaderMigrationConfiguration</code> 結構。
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
將記憶體中日誌資料清除到日誌檔案中時，相鄰兩次清除操作之間最大間隔秒數。
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
設定日誌格式。允許的格式：&quot;text&quot;。
<br/>非預設格式不支援以下標誌：<code>--add-dir-header</code>、
<code>--alsologtostderr</code>、<code>--log-backtrace-at</code>、
<code>--log-dir</code>、<code>--log-file</code>、<code>--log-file-max-size</code>、
<code>--logtostderr</code>、<code>--one-output</code>、<code>--skip-headers</code>、
<code>--skip-log-headers</code>、<code>--stderrthreshold</code>、
<code>--vmodule</code>。
<br/>當前非預設選項為 Alpha 階段，如有更改，恕不另行通知。
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
每個 EndpointSlice 中可以新增的端點個數上限。每個片段中端點個數越多，
得到的片段個數越少，但是片段的規模會變得更大。預設值為 100。
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
The number of service endpoint syncing operations that will be done concurrently by the EndpointSliceMirroring controller. Larger number = faster endpoint slice updating, but more CPU (and network) load. Defaults to 5.
-->
EndpointSliceMirroring 控制器將同時執行的服務端點同步運算元。
較大的數量 = 更快的端點切片更新，但 CPU（和網路）負載更多。 預設為 5。
</td>
</tr>

<tr>
<td colspan="2">--mirroring-endpointslice-updates-batch-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The length of EndpointSlice updates batching period for EndpointSliceMirroring controller. Processing of EndpointSlice changes will be delayed by this duration to join them with potential upcoming updates and reduce the overall number of EndpointSlice updates. Larger number = higher endpoint programming latency, but lower number of endpoints revision generated
-->
EndpointSlice 的長度更新了 EndpointSliceMirroring 控制器的批處理週期。
EndpointSlice 更改的處理將延遲此持續時間，
以使它們與潛在的即將進行的更新結合在一起，並減少 EndpointSlice 更新的總數。 
較大的數量 = 較高的端點程式設計延遲，但是生成的端點修訂版本數量較少
</td>
</tr>

<tr>
<td colspan="2">--mirroring-max-endpoints-per-subset int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：1000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum number of endpoints that will be added to an EndpointSlice by the EndpointSliceMirroring controller. More endpoints per slice will result in less endpoint slices, but larger resources. Defaults to 100.
-->
EndpointSliceMirroring 控制器將新增到 EndpointSlice 的最大端點數。
每個分片的端點越多，端點分片越少，但資源越大。預設為 100。
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
對名字空間物件進行同步的週期。
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
叢集中節點 CIDR 的掩碼長度。對 IPv4 而言預設為 24；對 IPv6 而言預設為 64。
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
在雙堆疊（同時支援 IPv4 和 IPv6）的叢集中，節點 IPV4 CIDR 掩碼長度。預設為 24。
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
在雙堆疊（同時支援 IPv4 和 IPv6）的叢集中，節點 IPv6 CIDR 掩碼長度。預設為 64。
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
以瞭解“健康”的判定標準。這裡的區域（zone）在叢集並不跨多個區域時
指的是整個叢集。
</td>
</tr>

<tr>
<td colspan="2">--node-monitor-grace-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：40s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Amount of time which we allow running Node to be unresponsive before marking it unhealthy. Must be N times more than kubelet's nodeStatusUpdateFrequency, where N means number of retries allowed for kubelet to post node status.
-->
在將一個 Node 標記為不健康之前允許其無響應的時長上限。
必須比 kubelet 的 nodeStatusUpdateFrequency 大 N 倍；
這裡 N 指的是 kubelet 傳送節點狀態的重試次數。
</td>
</tr>

<tr>
<td colspan="2">--node-monitor-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The period for syncing NodeStatus in NodeController.
-->
節點控制器對節點狀態進行同步的重複週期。
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
在節點啟動期間，節點可以處於無響應狀態；
但超出此標誌所設定的時長仍然無響應則該節點被標記為不健康。
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
如果此標誌為 true，則在繫結埠時使用 <code>SO_REUSEADDR</code>。
這就意味著可以同時繫結到 <code>0.0.0.0</code> 和特定的 IP 地址，
並且避免等待核心釋放處於 <code>TIME_WAITE</code> 狀態的套接字。[預設值=false]。
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
如果為 true，則在繫結埠時將使用 <code>SO_REUSEPORT</code>，
這允許多個例項在同一地址和埠上進行繫結。[預設值=false]。
</td>
</tr>

<tr>
<td colspan="2">--pod-eviction-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The grace period for deleting pods on failed nodes.
-->
在失效的節點上刪除 Pods 時為其預留的寬限期。
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
透過位於 <code>host:port/debug/pprof/</code> 的 Web 介面啟用效能分析。
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
NFS 清洗 Pod 在清洗用過的卷時，根據此標誌所設定的秒數，為每清洗 1 GiB 資料
增加對應超時時長，作為 activeDeadlineSeconds。
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
對於 HostPath 回收器 Pod，設定其 activeDeadlineSeconds 引數下限。
此引數僅用於開發和測試目的，不適合在多節點叢集中使用。
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
NFS 回收器 Pod 要使用的 activeDeadlineSeconds 引數下限。
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
對 HostPath 持久捲進行回收利用時，用作模版的 Pod 定義檔案所在路徑。
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
對 NFS 卷執行回收利用時，用作模版的 Pod 定義檔案所在路徑。
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
HostPath 清洗器 Pod 在清洗對應型別持久卷時，為每 GiB 資料增加此標誌所設定的秒數，
作為其 activeDeadlineSeconds 引數。此標誌僅用於開發和測試環境，不適合多節點叢集環境。
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
持久卷（PV）和持久卷申領（PVC）物件的同步週期。
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
標誌值是客戶端證書中的 Common Names 列表。其中所列的名稱可以透過
<code>--requestheader-username-headers</code> 所設定的 HTTP 頭部來提供使用者名稱。
如果此標誌值為空表，則被 <code>--requestheader-client-ca-file</code>
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
根證書包檔名。在信任透過 <code>--requestheader-username-headers</code>
所指定的任何使用者名稱之前，要使用這裡的證書來檢查請求中的客戶證書。
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
要插入的請求頭部字首。建議使用 <code>X-Remote-Exra-</code>。
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
用來檢查使用者組名的請求頭部名稱列表。建議使用 <code>X-Remote-Group</code>。
</td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：<code>"x-remote-user"</code></td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of request headers to inspect for usernames. X-Remote-User is common.
-->
用來檢查使用者名稱的請求頭部名稱列表。建議使用 <code>X-Remote-User</code>。
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
對雲驅動為節點所建立的路由資訊進行調解的週期。
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
當區域不健康，節點失效時，每秒鐘從此標誌所給的節點個數上刪除 Pods。
參見 <code>--unhealthy-zone-threshold</code> 以瞭解“健康與否”的判定標準。
在只有一個區域的叢集中，區域指的是整個叢集。如果叢集規模小於
<code>--large-cluster-size-threshold</code> 所設定的節點個數時，
此值被隱式地重設為 0。
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
在此埠上提供 HTTPS 身份認證和鑑權操作。若此標誌值為 0，則不提供 HTTPS 服務。
</td>
</tr>

<tr>
<td colspan="2">--service-account-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Filename containing a PEM-encoded private RSA or ECDSA key used to sign service account tokens.
-->
包含 PEM 編碼的 RSA 或 ECDSA 私鑰資料的檔名，這些私鑰用來對服務賬號令牌簽名。
</td>
</tr>

<tr>
<td colspan="2">--service-cluster-ip-range string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
CIDR Range for Services in cluster. Requires --allocate-node-cidrs to be true
-->
叢集中 Service 物件的 CIDR 範圍。要求 <code>--allocate-node-cidrs</code> 標誌為 true。
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
字串格式為 "&lt;major&gt;.&lt;minor&gt;"。例如："1.16"。
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
在已終止 Pods 垃圾收集器刪除已終止 Pods 之前，可以保留的已刪除
Pods 的個數上限。若此值小於等於 0，則相當於禁止垃圾回收已終止的 Pods。
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
若啟用了 HTTPS 服務且 <code>--tls-cert-file</code> 和 <code>--tls-private-key-file</code>
標誌未設定，
則為節點的公開地址生成自簽名的證書和金鑰，並儲存到 <code>--cert-dir</code>
所給的目錄中。
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>Preferred values: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384.<br/>Insecure values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.
-->
供伺服器使用的加密包的逗號分隔列表。若忽略此標誌，則使用 Go 語言預設的加密包。<br/>
可選值包括：TLS_AES_128_GCM_SHA256、TLS_AES_256_GCM_SHA384、TLS_CHACHA20_POLY1305_SHA256、TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA、TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384、TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256、TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256、TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305、TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256、TLS_RSA_WITH_AES_128_CBC_SHA、TLS_RSA_WITH_AES_128_GCM_SHA256、TLS_RSA_WITH_AES_256_CBC_SHA、TLS_RSA_WITH_AES_256_GCM_SHA384。
<br/>不安全的值: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_ECDSA_WITH_RC4_128_SHA、TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA、TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256、TLS_ECDHE_RSA_WITH_RC4_128_SHA、TLS_RSA_WITH_3DES_EDE_CBC_SHA、TLS_RSA_WITH_AES_128_CBC_SHA256、TLS_RSA_WITH_RC4_128_SHA。
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
可支援的最低 TLS 版本。可選值包括：
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
X509 證書和私鑰檔案路徑的耦對。作為可選項，可以新增域名模式的列表，
其中每個域名模式都是可以帶通配片段字首的全限定域名（FQDN）。
域名模式也可以使用 IP 地址字串，不過只有 API 伺服器在所給 IP 地址上
對客戶端可見時才可以使用 IP 地址。在未提供域名模式時，從證書中提取域名。
如果有非通配方式的匹配，則優先於通配方式的匹配；顯式的域名模式優先於提取的域名。
當存在多個金鑰/證書耦對時，可以多次使用 <code>--tls-sni-cert-key</code> 標誌。
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
才將該區域視為不健康。
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
當此標誌為 true 時，為每個控制器單獨使用服務賬號憑據。
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
Print version information and quit
-->
列印版本資訊之後退出。
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
由逗號分隔的列表，每一項都是 pattern=N 格式，用來執行根據檔案過濾的日誌行為（僅適用於 text 日誌格式）。
</td>
</tr>

<tr>
<td colspan="2">--volume-host-allow-local-loopback&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->預設值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If false, deny local loopback IPs in addition to any CIDR ranges in --volume-host-cidr-denylist
-->
此標誌為 false 時，禁止本地迴路 IP 地址和 <code>--volume-host-cidr-denylist</code>
中所指定的 CIDR 範圍。
</td>
</tr>

<tr>
<td colspan="2">--volume-host-cidr-denylist strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma-separated list of CIDR ranges to avoid from volume plugins.
-->
用逗號分隔的一個 CIDR 範圍列表，禁止使用這些地址上的卷外掛。
</td>
</tr>

</tbody>
</table>

