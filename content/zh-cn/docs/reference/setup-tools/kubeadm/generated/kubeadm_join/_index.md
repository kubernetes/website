<!-- 
Run this on any machine you wish to join an existing cluster 
-->
在你希望加入现有集群的任何机器上运行它。

<!--
### Synopsis
-->
### 摘要

<!--
When joining a kubeadm initialized cluster, we need to establish
bidirectional trust. This is split into discovery (having the Node
trust the Kubernetes Control Plane) and TLS bootstrap (having the
Kubernetes Control Plane trust the Node).
-->
当节点加入 kubeadm 初始化的集群时，我们需要建立双向信任。
这个过程可以分解为发现（让待加入节点信任 Kubernetes 控制平面节点）和
TLS 引导（让 Kubernetes 控制平面节点信任待加入节点）两个部分。

<!--
There are 2 main schemes for discovery. The first is to use a shared
token along with the IP address of the API server. The second is to
provide a file - a subset of the standard kubeconfig file. The
discovery/kubeconfig file supports token, client-go authentication
plugins ("exec"), "tokenFile", and "authProvider". This file can be a
local file or downloaded via an HTTPS URL. The forms are
kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443,
kubeadm join --discovery-file path/to/file.conf, or kubeadm join
--discovery-file https://url/file.conf. Only one form can be used. If
the discovery information is loaded from a URL, HTTPS must be used.
Also, in that case the host installed CA bundle is used to verify
the connection.
-->
有两种主要的发现方案。
第一种方案是使用共享令牌和 API 服务器的 IP 地址。
第二种是以文件形式提供标准 kubeconfig 文件的一个子集。
发现/kubeconfig 文件支持令牌、client-go 鉴权插件（“exec”）、“tokenFile" 和
"authProvider"。该文件可以是本地文件，也可以通过 HTTPS URL 下载。
格式是 `kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443`、
`kubeadm join --discovery-file path/to/file.conf` 或者
`kubeadm join --discovery-file https://url/file.conf`。
只能使用其中一种。
如果发现信息是从 URL 加载的，必须使用 HTTPS。
此外，在这种情况下，主机安装的 CA 包用于验证连接。

<!--
If you use a shared token for discovery, you should also pass the
--discovery-token-ca-cert-hash flag to validate the public key of the
root certificate authority (CA) presented by the Kubernetes Control Plane.
The value of this flag is specified as "&lt;hash-type&gt;:&lt;hex-encoded-value&gt;",
where the supported hash type is "sha256". The hash is calculated over
the bytes of the Subject Public Key Info (SPKI) object (as in RFC7469).
This value is available in the output of "kubeadm init" or can be
calculated using standard tools. The --discovery-token-ca-cert-hash flag
may be repeated multiple times to allow more than one public key.
-->
如果使用共享令牌进行发现，还应该传递 --discovery-token-ca-cert-hash 参数来验证
Kubernetes 控制平面节点提供的根证书颁发机构（CA）的公钥。
此参数的值指定为 "&lt;hash-type&gt;:&lt;hex-encoded-value&gt;"，
其中支持的哈希类型为 "sha256"。哈希是通过 Subject Public Key Info（SPKI）对象的字节计算的（如 RFC7469）。
这个值可以从 "kubeadm init" 的输出中获得，或者可以使用标准工具进行计算。
可以多次重复 --discovery-token-ca-cert-hash 参数以允许多个公钥。

<!--
If you cannot know the CA public key hash ahead of time, you can pass
the --discovery-token-unsafe-skip-ca-verification flag to disable this
verification. This weakens the kubeadm security model since other nodes
can potentially impersonate the Kubernetes Control Plane.
-->
如果无法提前知道 CA 公钥哈希，则可以通过 --discovery-token-unsafe-skip-ca-verification 参数禁用此验证。
这削弱了 kubeadm 安全模型，因为其他节点可能会模仿 Kubernetes 控制平面节点。

<!--
The TLS bootstrap mechanism is also driven via a shared token. This is
used to temporarily authenticate with the Kubernetes Control Plane to submit a
certificate signing request (CSR) for a locally created key pair. By
default, kubeadm will set up the Kubernetes Control Plane to automatically
approve these signing requests. This token is passed in with the
--tls-bootstrap-token abcdef.1234567890abcdef flag.

Often times the same token is used for both parts. In this case, the
--token flag can be used instead of specifying each token individually.
-->
TLS 引导机制也通过共享令牌驱动。
这用于向 Kubernetes 控制平面节点进行临时的身份验证，以提交本地创建的密钥对的证书签名请求（CSR）。
默认情况下，kubeadm 将设置 Kubernetes 控制平面节点自动批准这些签名请求。
这个令牌通过 --tls-bootstrap-token abcdef.1234567890abcdef 参数传入。

通常两个部分会使用相同的令牌。
在这种情况下可以使用 --token 参数，而不是单独指定每个令牌。

<!-- 
The "join [api-server-endpoint]" command executes the following phases:
-->
"join [api-server-endpoint]" 命令执行下列阶段：

<!--
```
preflight              Run join pre-flight checks
control-plane-prepare  Prepare the machine for serving a control plane
  /download-certs        [EXPERIMENTAL] Download certificates shared among control-plane nodes from the kubeadm-certs Secret
  /certs                 Generate the certificates for the new control plane components
  /kubeconfig            Generate the kubeconfig for the new control plane components
  /control-plane         Generate the manifests for the new control plane components
kubelet-start          Write kubelet settings, certificates and (re)start the kubelet
control-plane-join     Join a machine as a control plane instance
  /etcd                  Add a new local etcd member
  /update-status         Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap (DEPRECATED)
  /mark-control-plane    Mark a node as a control-plane
wait-control-plane     EXPERIMENTAL: Wait for the control plane to start
```
-->
1. preflight：运行接入前检查
2. control-plane-prepare：准备用作控制平面的机器
   1. download-certs：[实验] 从 kubeadm-certs Secret 下载控制平面节点之间共享的证书
   2. certs：为新的控制平面组件生成证书
   3. kubeconfig：为新的控制平面组件生成 kubeconfig
   4. control-plane：生成新控制平面组件的清单
3. kubelet-start：写入 kubelet 设置、证书并（重新）启动 kubelet
4. control-plane-join：将机器加入为控制平面实例
   1. etcd：添加新的本地 etcd 成员
   2. update-status：将新的控制平面节点注册到 kubeadm-config ConfigMap 中维护的 ClusterStatus 中（已弃用）
   3. mark-control-plane：将节点标记为控制平面
5. wait-control-plane：[实验] 等待控制平面启动

```
kubeadm join [api-server-endpoint] [flags]
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
If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on.
If not set the default network interface will be used.
-->
<p>如果该节点托管一个新的控制平面实例，则 API 服务器将公布其正在侦听的 IP 地址。如果未设置，则使用默认网络接口。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>If the node should host a new control plane instance, the port for the API Server to bind to.</p>
-->
<p>如果节点应该托管新的控制平面实例，则为 API 服务器要绑定的端口。</p>
</td>
</tr>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Use this key to decrypt the certificate secrets uploaded by init. The certificate key is a hex encoded string that is an AES key of size 32 bytes.
-->
使用此密钥可以解密由 init 上传的证书 Secret。
证书密钥为一个十六进制编码的字符串，它是大小为 32 字节的 AES 密钥。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to a kubeadm configuration file.</p>
-->
<p>kubeadm 配置文件的路径。</p>
</td>
</tr>

<tr>
<td colspan="2">--control-plane</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Create a new control plane instance on this node</p>
-->
<p>在此节点上创建一个新的控制平面实例。</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; 
use this option only if you have more than one CRI installed or if you have non-standard CRI socket.</p>
-->
<p>要连接的 CRI 套接字的路径。如果为空，则 kubeadm 将尝试自动检测此值；
仅当安装了多个 CRI 或存在非标准的 CRI 套接字时，才使用此选项。</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>For file-based discovery, a file or URL from which to load cluster information.</p>
-->
<p>对于基于文件的发现，给出用于加载集群信息的文件或者 URL。</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>For token-based discovery, the token used to validate cluster information fetched from the API server.</p>
-->
<p>对于基于令牌的发现，该令牌用于验证从 API 服务器获取的集群信息。</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-token-ca-cert-hash stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>For token-based discovery, validate that the root CA public key matches this hash (format: "&lt;type&gt;:&lt;value&gt;").</p>
-->
<p>对基于令牌的发现，验证根 CA 公钥是否与此哈希匹配 (格式："&lt;type&gt;:&lt;value&gt;")。</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-token-unsafe-skip-ca-verification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.</p>
-->
<p>对于基于令牌的发现，允许在未关联 --discovery-token-ca-cert-hash 参数的情况下添加节点。</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- 
Don't apply any changes; just output what would be done. 
-->
不做任何更改；只输出将要执行的操作。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for join</p>
-->
<p>join 操作的帮助命令。</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</p>
-->
<p>错误将显示为警告的检查列表；例如：'IsPrivilegedUser,Swap'。取值为 'all' 时将忽略检查中的所有错误。</p>
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Specify the node name.</p>
-->
<p>指定节点的名称。</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--  
<p>Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.</p>
-->
<p>包含名为 "target[suffix][+patchtype].extension" 的文件的目录的路径。
例如，"kube-apiserver0+merge.yaml" 或仅仅是 "etcd.json"。
"target" 可以是 “kube-apiserver”、“kube-controller-manager”、“kube-scheduler”、“etcd”、“kubeletconfiguration” 之一，
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，并且它们与 kubectl 支持的补丁格式匹配。
默认的 "patchtype" 为 "strategic"。 "extension" 必须为 "json" 或 "yaml"。
"suffix" 是一个可选字符串，可用于确定首先按字母顺序应用哪些补丁。</p>
</td>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>List of phases to be skipped</p>
-->
<p>要跳过的阶段列表。</p>
</td>
</tr>

<tr>
<td colspan="2">--tls-bootstrap-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Specify the token used to temporarily authenticate with the Kubernetes Control Plane while joining the node.</p>
-->
<p>指定在加入节点时用于临时通过 Kubernetes 控制平面进行身份验证的令牌。</p>
</td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Use this token for both discovery-token and tls-bootstrap-token when those values are not provided.</p>
-->
<p>如果未提供这些值，则将它们用于 discovery-token 令牌和 tls-bootstrap 令牌。</p>
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
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[实验] 指向 '真实' 宿主机根文件系统的路径。</p>
</td>
</tr>

</tbody>
</table>
