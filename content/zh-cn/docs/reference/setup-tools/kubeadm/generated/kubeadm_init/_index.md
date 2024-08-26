<!--
Run this command in order to set up the Kubernetes control plane
-->
运行此命令以安装 Kubernetes 控制平面。

<!--
### Synopsis 
-->
### 概要

<!--
Run this command in order to set up the Kubernetes control plane
-->
运行此命令来搭建 Kubernetes 控制平面节点。

<!--
The "init" command executes the following phases:
-->
"init" 命令执行以下阶段：

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
upload-config                Upload the kubeadm and kubelet configuration to a ConfigMap
  /kubeadm                     Upload the kubeadm ClusterConfiguration to a ConfigMap
  /kubelet                     Upload the kubelet component config to a ConfigMap
upload-certs                 Upload certificates to kubeadm-certs
mark-control-plane           Mark a node as a control-plane
bootstrap-token              Generates bootstrap tokens used to join a node to a cluster
kubelet-finalize             Updates settings relevant to the kubelet after TLS bootstrap
  /experimental-cert-rotation  Enable kubelet client certificate rotation
addon                        Install required addons for passing conformance tests
  /coredns                     Install the CoreDNS addon to a Kubernetes cluster
  /kube-proxy                  Install the kube-proxy addon to a Kubernetes cluster
show-join-command            Show the join command for control-plane and worker node
```
-->
```
preflight                    预检
certs                        生成证书
  /ca                          生成自签名根 CA 用于配置其他 kubernetes 组件
  /apiserver                   生成 apiserver 的证书
  /apiserver-kubelet-client    生成 apiserver 连接到 kubelet 的证书
  /front-proxy-ca              生成前端代理自签名CA(扩展apiserver)
  /front-proxy-client          生成前端代理客户端的证书（扩展 apiserver）
  /etcd-ca                     生成 etcd 自签名 CA
  /etcd-server                 生成 etcd 服务器证书
  /etcd-peer                   生成 etcd 节点相互通信的证书
  /etcd-healthcheck-client     生成 etcd 健康检查的证书
  /apiserver-etcd-client       生成 apiserver 访问 etcd 的证书
  /sa                          生成用于签署服务帐户令牌的私钥和公钥
kubeconfig                   生成建立控制平面和管理所需的所有 kubeconfig 文件
  /admin                       生成一个 kubeconfig 文件供管理员使用以及供 kubeadm 本身使用
  /super-admin                 为超级管理员生成 kubeconfig 文件
  /kubelet                     为 kubelet 生成一个 kubeconfig 文件，*仅*用于集群引导
  /controller-manager          生成 kubeconfig 文件供控制器管理器使用
  /scheduler                   生成 kubeconfig 文件供调度程序使用
etcd                         为本地 etcd 生成静态 Pod 清单文件
  /local                       为本地单节点本地 etcd 实例生成静态 Pod 清单文件
control-plane                生成建立控制平面所需的所有静态 Pod 清单文件
  /apiserver                   生成 kube-apiserver 静态 Pod 清单
  /controller-manager          生成 kube-controller-manager 静态 Pod 清单
  /scheduler                   生成 kube-scheduler 静态 Pod 清单
kubelet-start                写入 kubelet 设置并启动（或重启） kubelet
upload-config                将 kubeadm 和 kubelet 配置上传到 ConfigMap
  /kubeadm                     将 kubeadm 集群配置上传到 ConfigMap
  /kubelet                     将 kubelet 组件配置上传到 ConfigMap
upload-certs                 将证书上传到 kubeadm-certs
mark-control-plane           将节点标记为控制面
bootstrap-token              生成用于将节点加入集群的引导令牌
kubelet-finalize             在 TLS 引导后更新与 kubelet 相关的设置
  /experimental-cert-rotation  启用 kubelet 客户端证书轮换
addon                        安装用于通过一致性测试所需的插件
  /coredns                     将 CoreDNS 插件安装到 Kubernetes 集群
  /kube-proxy                  将 kube-proxy 插件安装到 Kubernetes 集群
show-join-command            显示控制平面和工作节点的加入命令
```

```
kubeadm init [flags]
```

<!-- 
### Options
-->
### 选项

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
<!--
The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
-->
<p>
API 服务器所公布的其正在监听的 IP 地址。如果未设置，则使用默认网络接口。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Port for the API Server to bind to.
-->
<p>
API 服务器绑定的端口。
</p>
</td>
</tr>

<tr>
<td colspan="2">--apiserver-cert-extra-sans strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.
-->
<p>
用于 API Server 服务证书的可选附加主题备用名称（SAN）。可以是 IP 地址和 DNS 名称。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path where to save and store the certificates.
-->
<p>
保存和存储证书的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Key used to encrypt the control-plane certificates in the kubeadm-certs Secret. The certificate key is a hex encoded string that is an AES key of size 32 bytes.
-->
<p>
用于加密 kubeadm-certs Secret 中的控制平面证书的密钥。
证书密钥为十六进制编码的字符串，是大小为 32 字节的 AES 密钥。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeadm configuration file.
-->
<p>
kubeadm 配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--control-plane-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specify a stable IP address or DNS name for the control plane.
-->
<p>
为控制平面指定一个稳定的 IP 地址或 DNS 名称。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
-->
<p>
要连接的 CRI 套接字的路径。如果为空，则 kubeadm 将尝试自动检测此值；
仅当安装了多个 CRI 或具有非标准 CRI 套接字时，才使用此选项。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Don't apply any changes; just output what would be done.
-->
<p>
不做任何更改；只输出将要执行的操作。
</p>
</td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>
EtcdLearnerMode=true|false (BETA - default=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - default=false)<br/>
RootlessControlPlane=true|false (ALPHA - default=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - default=false)<br/>
WaitForAllControlPlaneComponents=true|false (ALPHA - default=false)
-->
一组用来描述各种功能特性的键值（key=value）对。选项是：<br/>
EtcdLearnerMode=true|false (BETA - 默认值=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - 默认值=false)<br/>
RootlessControlPlane=true|false (ALPHA - 默认值=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - 默认值=false)<br/>
WaitForAllControlPlaneComponents=true|false (ALPHA - 默认值=false)
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for init
-->
<p>
init 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
<p>
错误将显示为警告的检查列表；例如：'IsPrivilegedUser,Swap'。取值为 'all' 时将忽略检查中的所有错误。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "registry.k8s.io"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："registry.k8s.io"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Choose a container registry to pull control plane images from
-->
<p>
选择用于拉取控制平面镜像的容器仓库。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"
-->
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："stable-1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Choose a specific Kubernetes version for the control plane.
-->
<p>
为控制平面选择一个特定的 Kubernetes 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specify the node name.
-->
<p>
指定节点的名称。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
<p>
它包含名为 &quot;target[suffix][+patchtype].extension&quot; 的文件的目录的路径。
例如，&quot;kube-apiserver0+merge.yaml&quot;或仅仅是 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、&quot;kube-scheduler&quot;、&quot;etcd&quot;、&quot;kubeletconfiguration&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot; 之一，
并且它们与 kubectl 支持的补丁格式相同。
默认的 &quot;patchtype&quot; 是 &quot;strategic&quot;。
&quot;extension&quot; 必须是&quot;json&quot; 或&quot;yaml&quot;。
&quot;suffix&quot; 是一个可选字符串，可用于确定首先按字母顺序应用哪些补丁。
</p>
</td>
</tr>

<tr>
<td colspan="2">--pod-network-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.
-->
<p>
指明 Pod 网络可以使用的 IP 地址段。如果设置了这个参数，控制平面将会为每一个节点自动分配 CIDR。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"
-->
--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："10.96.0.0/12"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use alternative range of IP address for service VIPs.
-->
<p>
为服务的虚拟 IP 地址另外指定 IP 地址段。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"
-->
--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："cluster.local"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use alternative domain for services, e.g. &quot;myorg.internal&quot;.
-->
为服务另外指定域名，例如：&quot;myorg.internal&quot;。
</td>
</tr>

<tr>
<td colspan="2">--skip-certificate-key-print</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Don't print the key used to encrypt the control-plane certificates.
-->
<p>
不要打印用于加密控制平面证书的密钥。
</p>
</td>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of phases to be skipped
-->
<p>
要跳过的阶段列表。
</p>
</td>
</tr>

<tr>
<td colspan="2">--skip-token-print</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Skip printing of the default bootstrap token generated by 'kubeadm init'.
-->
<p>
跳过打印 'kubeadm init' 生成的默认引导令牌。
</p>
</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The token to use for establishing bidirectional trust between nodes and control-plane nodes. The format is [a-z0-9]{6}.[a-z0-9]{16} - e.g. abcdef.0123456789abcdef
-->
<p>
这个令牌用于建立控制平面节点与工作节点间的双向通信。
格式为 [a-z0-9]{6}.[a-z0-9]{16} - 示例：abcdef.0123456789abcdef
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s
-->
--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：24h0m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire
-->
<p>
令牌被自动删除之前的持续时间（例如 1s，2m，3h）。如果设置为 '0'，则令牌将永不过期。
</p>
</td>
</tr>

<tr>
<td colspan="2">--upload-certs</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Upload control-plane certificates to the kubeadm-certs Secret.
-->
<p>
将控制平面证书上传到 kubeadm-certs Secret。
</p>
</td>
</tr>

</tbody>
</table>

<!-- 
### Options inherited from parent commands 
-->
### 从父命令继承的选项

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
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
<p>
[实验] 到 '真实' 主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
