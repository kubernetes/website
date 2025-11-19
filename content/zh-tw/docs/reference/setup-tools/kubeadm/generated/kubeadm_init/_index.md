<!--
### Synopsis 
-->
### 概要

<!--
Run this command in order to set up the Kubernetes control plane
-->
運行此命令來搭建 Kubernetes 控制平面節點。

<!--
The "init" command executes the following phases:
-->
"init" 命令執行以下階段：

<!--
```
preflight                    Run pre-flight checks
certs                        Certificate generation
  /ca                          Generate the self-signed Kubernetes CA to provision identities for other Kubernetes components
  /apiserver                   Generate the certificate for serving the Kubernetes API
  /apiserver-kubelet-client    Generate the certificate for the API server to connect to kubelet
  /front-proxy-ca              Generate the self-signed CA to provision identities for front proxy
  /front-proxy-client          Generate the certificate for the front proxy client
  /etcd-ca                     Generate the self-signed CA to provision identities for etcd
  /etcd-server                 Generate the certificate for serving etcd
  /etcd-peer                   Generate the certificate for etcd nodes to communicate with each other
  /etcd-healthcheck-client     Generate the certificate for liveness probes to healthcheck etcd
  /apiserver-etcd-client       Generate the certificate the apiserver uses to access etcd
  /sa                          Generate a private key for signing service account tokens along with its public key
kubeconfig                   Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file
  /admin                       Generate a kubeconfig file for the admin to use and for kubeadm itself
  /super-admin                 Generate a kubeconfig file for the super-admin
  /kubelet                     Generate a kubeconfig file for the kubelet to use *only* for cluster bootstrapping purposes
  /controller-manager          Generate a kubeconfig file for the controller manager to use
  /scheduler                   Generate a kubeconfig file for the scheduler to use
etcd                         Generate static Pod manifest file for local etcd
  /local                       Generate the static Pod manifest file for a local, single-node local etcd instance
control-plane                Generate all static Pod manifest files necessary to establish the control plane
  /apiserver                   Generates the kube-apiserver static Pod manifest
  /controller-manager          Generates the kube-controller-manager static Pod manifest
  /scheduler                   Generates the kube-scheduler static Pod manifest
kubelet-start                Write kubelet settings and (re)start the kubelet
wait-control-plane            Wait for the control plane to start
upload-config                Upload the kubeadm and kubelet configuration to a ConfigMap
  /kubeadm                     Upload the kubeadm ClusterConfiguration to a ConfigMap
  /kubelet                     Upload the kubelet component config to a ConfigMap
upload-certs                 Upload certificates to kubeadm-certs
mark-control-plane           Mark a node as a control-plane
bootstrap-token              Generates bootstrap tokens used to join a node to a cluster
kubelet-finalize             Updates settings relevant to the kubelet after TLS bootstrap
addon                        Install required addons for passing conformance tests
  /coredns                     Install the CoreDNS addon to a Kubernetes cluster
  /kube-proxy                  Install the kube-proxy addon to a Kubernetes cluster
show-join-command            Show the join command for control-plane and worker node
```
-->
```shell
preflight                    預檢
certs                        生成證書
  /ca                          生成自簽名根 CA 用於配置其他 kubernetes 組件
  /apiserver                   生成 apiserver 的證書
  /apiserver-kubelet-client    生成 apiserver 連接到 kubelet 的證書
  /front-proxy-ca              生成前端代理自簽名 CA（擴展apiserver）
  /front-proxy-client          生成前端代理客戶端的證書（擴展 apiserver）
  /etcd-ca                     生成 etcd 自簽名 CA
  /etcd-server                 生成 etcd 伺服器證書
  /etcd-peer                   生成 etcd 節點相互通信的證書
  /etcd-healthcheck-client     生成 etcd 健康檢查的證書
  /apiserver-etcd-client       生成 apiserver 訪問 etcd 的證書
  /sa                          生成用於簽署服務帳戶令牌的私鑰和公鑰
kubeconfig                   生成建立控制平面和管理所需的所有 kubeconfig 文件
  /admin                       生成一個 kubeconfig 文件供管理員使用以及供 kubeadm 本身使用
  /super-admin                 爲超級管理員生成 kubeconfig 文件
  /kubelet                     爲 kubelet 生成一個 kubeconfig 文件，*僅*用於集羣引導
  /controller-manager          生成 kubeconfig 文件供控制器管理器使用
  /scheduler                   生成 kubeconfig 文件供調度程序使用
etcd                         爲本地 etcd 生成靜態 Pod 清單文件
  /local                       爲本地單節點本地 etcd 實例生成靜態 Pod 清單文件
control-plane                生成建立控制平面所需的所有靜態 Pod 清單文件
  /apiserver                   生成 kube-apiserver 靜態 Pod 清單
  /controller-manager          生成 kube-controller-manager 靜態 Pod 清單
  /scheduler                   生成 kube-scheduler 靜態 Pod 清單
kubelet-start                寫入 kubelet 設置並啓動（或重啓）kubelet
wait-control-plane           等待控制平面啓動
upload-config                將 kubeadm 和 kubelet 配置上傳到 ConfigMap
  /kubeadm                     將 kubeadm 集羣配置上傳到 ConfigMap
  /kubelet                     將 kubelet 組件配置上傳到 ConfigMap
upload-certs                 將證書上傳到 kubeadm-certs
mark-control-plane           將節點標記爲控制面
bootstrap-token              生成用於將節點加入集羣的引導令牌
kubelet-finalize             在 TLS 引導後更新與 kubelet 相關的設置
addon                        安裝用於通過一致性測試所需的插件
  /coredns                     將 CoreDNS 插件安裝到 Kubernetes 集羣
  /kube-proxy                  將 kube-proxy 插件安裝到 Kubernetes 集羣
show-join-command            顯示控制平面和工作節點的加入命令
```

```shell
kubeadm init [flags]
```

<!-- 
### Options
-->
### 選項

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--apiserver-advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
-->
API 伺服器所公佈的其正在監聽的 IP 地址。如果未設置，則使用默認網路接口。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Port for the API Server to bind to.
-->
API 伺服器綁定的端口。
</p>
</td>
</tr>

<tr>
<td colspan="2">--apiserver-cert-extra-sans strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.
-->
用於 API Server 服務證書的可選附加主題備用名稱（SAN）。
可以是 IP 地址和 DNS 名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path where to save and store the certificates.
-->
保存和存儲證書的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Key used to encrypt the control-plane certificates in the kubeadm-certs Secret. The certificate key is a hex encoded string that is an AES key of size 32 bytes.
-->
用於加密 kubeadm-certs Secret 中的控制平面證書的密鑰。
證書密鑰爲十六進制編碼的字符串，是大小爲 32 字節的 AES 密鑰。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
kubeadm 設定文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--control-plane-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specify a stable IP address or DNS name for the control plane.
-->
爲控制平面指定一個穩定的 IP 地址或 DNS 名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
-->
要連接的 CRI 套接字的路徑。如果爲空，則 kubeadm 將嘗試自動檢測此值；
僅當安裝了多個 CRI 或具有非標準 CRI 套接字時，才使用此選項。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Don't apply any changes; just output what would be done.
-->
不做任何更改；只輸出將要執行的操作。
</p>
</td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>
ControlPlaneKubeletLocalMode=true|false (ALPHA - default=false)<br/>
EtcdLearnerMode=true|false (default=true)<br/>
NodeLocalCRISocket=true|false (ALPHA - default=false)<br/>
PublicKeysECDSA=true|false (DEPRECATED - default=false)<br/>
RootlessControlPlane=true|false (ALPHA - default=false)<br/>
WaitForAllControlPlaneComponents=true|false (ALPHA - default=false)
-->
一組用來描述各種特性門控的鍵值（key=value）對。選項是：<br/>
ControlPlaneKubeletLocalMode=true|false (ALPHA - 默認值=false)<br/>
EtcdLearnerMode=true|false (默認值=true)<br/>
NodeLocalCRISocket=true|false (ALPHA - 默認值=false)<br/>
PublicKeysECDSA=true|false (DEPRECATED - 默認值=false)<br/>
RootlessControlPlane=true|false (ALPHA - 默認值=false)<br/>
WaitForAllControlPlaneComponents=true|false (ALPHA - 默認值=false)
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
help for init
-->
init 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
錯誤將顯示爲警告的檢查列表；例如：'IsPrivilegedUser,Swap'。
取值爲 'all' 時將忽略檢查中的所有錯誤。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "registry.k8s.io"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："registry.k8s.io"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a container registry to pull control plane images from
-->
選擇用於拉取控制平面映像檔的容器倉庫。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"
-->
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："stable-1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a specific Kubernetes version for the control plane.
-->
爲控制平面選擇一個特定的 Kubernetes 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specify the node name.
-->
指定節點的名稱。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
它包含名爲 &quot;target[suffix][+patchtype].extension&quot; 的文件的目錄的路徑。
例如，&quot;kube-apiserver0+merge.yaml&quot; 或僅僅是 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、&quot;kube-scheduler&quot;、
&quot;etcd&quot;、&quot;kubeletconfiguration&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot; 之一，
並且它們與 kubectl 支持的補丁格式相同。
默認的 &quot;patchtype&quot; 是 &quot;strategic&quot;。
&quot;extension&quot; 必須是 &quot;json&quot; 或 &quot;yaml&quot;。
&quot;suffix&quot; 是一個可選字符串，可用於確定首先按字母順序應用哪些補丁。
</p>
</td>
</tr>

<tr>
<td colspan="2">--pod-network-cidr string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.
-->
指明 Pod 網路可以使用的 IP 地址段。如果設置了這個參數，
控制平面將會爲每一個節點自動分配 CIDR。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"
-->
--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："10.96.0.0/12"
</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Use alternative range of IP address for service VIPs.
-->
爲服務的虛擬 IP 地址另外指定 IP 地址段。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"
-->
--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："cluster.local"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Use alternative domain for services, e.g. &quot;myorg.internal&quot;.
-->
爲服務另外指定域名，例如：&quot;myorg.internal&quot;。
</p>
</td>
</tr>

<tr>
<td colspan="2">--skip-certificate-key-print</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Don't print the key used to encrypt the control-plane certificates.
-->
不要打印用於加密控制平面證書的密鑰。
</p>
</td>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
List of phases to be skipped
-->
要跳過的階段列表。
</p>
</td>
</tr>

<tr>
<td colspan="2">--skip-token-print</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Skip printing of the default bootstrap token generated by 'kubeadm init'.
-->
跳過打印 'kubeadm init' 生成的默認引導令牌。
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
The token to use for establishing bidirectional trust between nodes and control-plane nodes. The format is [a-z0-9]{6}.[a-z0-9]{16} - e.g. abcdef.0123456789abcdef
-->
這個令牌用於建立控制平面節點與工作節點間的雙向通信。
格式爲 <code>[a-z0-9]{6}.[a-z0-9]{16}</code> - 示例：<code>abcdef.0123456789abcdef</code>
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s
-->
--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：24h0m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire
-->
令牌被自動刪除之前的持續時間（例如 1s，2m，3h）。如果設置爲 '0'，則令牌將永不過期。
</p>
</td>
</tr>

<tr>
<td colspan="2">--upload-certs</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Upload control-plane certificates to the kubeadm-certs Secret.
-->
將控制平面證書上傳到 kubeadm-certs Secret。
</p>
</td>
</tr>

</tbody>
</table>

<!-- 
### Options inherited from parent commands 
-->
### 從父命令繼承的選項

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 到'真實'主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
