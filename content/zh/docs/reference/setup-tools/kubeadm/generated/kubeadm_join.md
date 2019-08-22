在想要加入现有集群的每台机器上运行。

<!--
Run this on any machine you wish to join an existing cluster
-->

<!--
### Synopsis
-->

### 摘要


<!--
When joining a kubeadm initialized cluster, we need to establish
bidirectional trust. This is split into discovery (having the Node
trust the Kubernetes Master) and TLS bootstrap (having the Kubernetes
Master trust the Node).
-->

当节点加入 kubeadm 初始化的集群时，我们需要建立双向信任。
这个过程可以分解为发现（让待加入节点信任 Kubernetes 主节点）和 TLS 引导（让Kubernetes 主节点信任待加入节点）两个部分。

<!--
There are 2 main schemes for discovery. The first is to use a shared
token along with the IP address of the API server. The second is to
provide a file - a subset of the standard kubeconfig file. This file
can be a local file or downloaded via an HTTPS URL. The forms are
kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443,
kubeadm join --discovery-file path/to/file.conf, or kubeadm join
--discovery-file `https://url/file.conf`. Only one form can be used. If
the discovery information is loaded from a URL, HTTPS must be used.
Also, in that case the host installed CA bundle is used to verify
the connection.
-->

有两种主要的发现方案。
第一种方法是使用共享令牌和 API 服务器的 IP 地址。
第二种是提供一个文件——标准 kubeconfig 文件的一个子集。
该文件可以是本地文件，也可以通过 HTTPS URL 下载。
格式是 kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443、kubeadm join--discovery-file path/to/file.conf、或者 kubeadm join --discovery-file`https://url/file.conf`。
只能使用其中一种。
如果发现信息是从 URL 加载的，必须使用 HTTPS。
此外，在这种情况下，主机安装的 CA 包用于验证连接。

<!--
If you use a shared token for discovery, you should also pass the
--discovery-token-ca-cert-hash flag to validate the public key of the
root certificate authority (CA) presented by the Kubernetes Master. The
value of this flag is specified as "<hash-type>:<hex-encoded-value>",
where the supported hash type is "sha256". The hash is calculated over
the bytes of the Subject Public Key Info (SPKI) object (as in RFC7469).
This value is available in the output of "kubeadm init" or can be
calculated using standard tools. The --discovery-token-ca-cert-hash flag
may be repeated multiple times to allow more than one public key.
-->

如果使用共享令牌进行发现，还应该传递 --discovery-token-ca-cert-hash 参数来验证 Kubernetes 主节点提供的根证书颁发机构（CA）的公钥。
此参数的值指定为 "<hash-type>:<hex-encoded-value>"，其中支持的哈希类型为 "sha256"。哈希是通过 Subject Public Key Info（SPKI）对象的字节计算的（如 RFC7469）。
这个值可以从 "kubeadm init" 的输出中获得，或者可以使用标准工具进行计算。
可以多次重复 --discovery-token-ca-cert-hash 参数以允许多个公钥。

<!--
If you cannot know the CA public key hash ahead of time, you can pass
the --discovery-token-unsafe-skip-ca-verification flag to disable this
verification. This weakens the kubeadm security model since other nodes
can potentially impersonate the Kubernetes Master.
-->

如果无法提前知道 CA 公钥哈希，则可以通过 --discovery-token-unsafe-skip-ca-verification 参数禁用此验证。
这削弱了kubeadm 安全模型，因为其他节点可能会模仿 Kubernetes 主节点。

<!--
The TLS bootstrap mechanism is also driven via a shared token. This is
used to temporarily authenticate with the Kubernetes Master to submit a
certificate signing request (CSR) for a locally created key pair. By
default, kubeadm will set up the Kubernetes Master to automatically
approve these signing requests. This token is passed in with the
--tls-bootstrap-token abcdef.1234567890abcdef flag.

Often times the same token is used for both parts. In this case, the
--token flag can be used instead of specifying each token individually.
-->

TLS 引导机制也通过共享令牌驱动。
这用于向 Kubernetes 主节点进行临时的身份验证，以提交本地创建的密钥对的证书签名请求（CSR）。
默认情况下，kubeadm 将设置 Kubernetes 主节点自动批准这些签名请求。
这个令牌通过 --tls-bootstrap-token abcdef.1234567890abcdef 参数传入。

通常两个部分会使用相同的令牌。
在这种情况下可以使用 --token 参数，而不是单独指定每个令牌。

```
kubeadm join [flags]
```

<!--
### Options

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on.</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If the node should host a new control plane instance, the port for the API Server to bind to.</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file.</td>
    </tr>

    <tr>
      <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/dockershim.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the CRI socket to connect to.</td>
    </tr>

    <tr>
      <td colspan="2">--discovery-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A file or url from which to load cluster information.</td>
    </tr>

    <tr>
      <td colspan="2">--discovery-token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A token used to validate cluster information fetched from the api server.</td>
    </tr>

    <tr>
      <td colspan="2">--discovery-token-ca-cert-hash stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">For token-based discovery, validate that the root CA public key matches this hash (format: "&lt;type&gt;:&lt;value&gt;").</td>
    </tr>

    <tr>
      <td colspan="2">--discovery-token-unsafe-skip-ca-verification</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.</td>
    </tr>

    <tr>
      <td colspan="2">--experimental-control-plane</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Create a new control plane instance on this node</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for various features. Options are:<br/>Auditing=true|false (ALPHA - default=false)<br/>CoreDNS=true|false (default=true)<br/>DynamicKubeletConfig=true|false (BETA - default=false)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for join</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the node name.</td>
    </tr>

    <tr>
      <td colspan="2">--tls-bootstrap-token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A token used for TLS bootstrapping.</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Use this token for both discovery-token and tls-bootstrap-token.</td>
    </tr>

  </tbody>
</table>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果节点应该托管一个新的控制平面实例，那么 API 服务器将通知它正在监听的 IP 地址。</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果节点应该托管新的控制平面实例，则 API 服务器要绑定的端口。</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径。</td>
    </tr>

    <tr>
      <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/dockershim.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指定要连接的 CRI 套接字。</td>
    </tr>

    <tr>
      <td colspan="2">--discovery-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用来加载集群信息的文件或 URL。 </td>
    </tr>

    <tr>
      <td colspan="2">--discovery-token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用来验证从 API 服务器获取的集群信息的令牌。</td>
    </tr>

    <tr>
      <td colspan="2">--discovery-token-ca-cert-hash stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">对基于令牌的发现，验证根 CA 公钥是否与此哈希匹配(格式： "&lt;type&gt;:&lt;value&gt;")。</td>
    </tr>

    <tr>
      <td colspan="2">--discovery-token-unsafe-skip-ca-verification</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">对于基于令牌的发现，允许没有 --discovery-token-ca-cert-hash 的加入.</td>
    </tr>

    <tr>
      <td colspan="2">--experimental-control-plane</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">在节点上创建一个新的控制平面实例</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一组健值对，用来描述不同功能的功能开关。 选项包括：<br/>Auditing=true|false (ALPHA - default=false)<br/>CoreDNS=true|false (default=true)<br/>DynamicKubeletConfig=true|false (BETA - default=false)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">join 的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">检查项列表，检查的错误信息将显示为警告。 示例： 'IsPrivilegedUser,Swap'。 值 'all' 会忽略所有检查错误。</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指定节点名称</td>
    </tr>

    <tr>
      <td colspan="2">--tls-bootstrap-token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">TLS 引导使用的令牌。</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"> 用作 discovery-token 和 tls-bootstrap-token 的令牌</td>
    </tr>

  </tbody>
</table>

<!--
### Options inherited from parent commands

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] 连接 '真正的' 主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>
-->


