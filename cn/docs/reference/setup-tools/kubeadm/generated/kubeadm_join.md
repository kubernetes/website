
在希望加入现有集群的任何机器上运行此操作

### 概要
<!--
Run this on any machine you wish to join an existing cluster

### Synopsis
-->


<!--
When joining a kubeadm initialized cluster, we need to establish
bidirectional trust. This is split into discovery (having the Node
trust the Kubernetes Master) and TLS bootstrap (having the Kubernetes
Master trust the Node).
-->

加入 kubeadm 初始化集群时，需要建立双向信任。这被分成发现（让 Node 信任 Kubernetes Master）和 TLS 引导（让 Kubernetes Master 信任节点）。

<!--
There are 2 main schemes for discovery. The first is to use a shared
token along with the IP address of the API server. The second is to
provide a file - a subset of the standard kubeconfig file. This file
can be a local file or downloaded via an HTTPS URL. The forms are
kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443,
kubeadm join --discovery-file path/to/file.conf, or kubeadm join
--discovery-file https://url/file.conf. Only one form can be used. If
the discovery information is loaded from a URL, HTTPS must be used.
Also, in that case the host installed CA bundle is used to verify
the connection.
-->

有两个主要的发现方案。首先是使用共享令牌以及 API 服务器的 IP 地址。第二个是提供一个文件 - 标准 kubeconfig 文件的一个子集。该文件可以是本地文件，也可以通过 HTTPS URL 下载。形式是 kubeadm join --discovery-token abcdef.1234567890abcdef 1.2.3.4:6443，kubeadm join --discovery-file path/to/file.conf，或 kubeadm join
--discovery-file https://url/file.conf。只能使用一种形式。如果发现信息是从 URL 加载的，则必须使用 HTTPS。另外，在这种情况下，主机安装 CA bundle 用于验证连接。

<!--
If you use a shared token for discovery, you should also pass the
--discovery-token-ca-cert-hash flag to validate the public key of the
root certificate authority (CA) presented by the Kubernetes Master. The
value of this flag is specified as "<hash-type>:<hex-encoded-value>",
where the supported hash type is "sha256". The hash is calculated over
the bytes of the Subject Public Key Info (SPKI) object (as in RFC7469).
This value is available in the output of "kubeadm init" or can be
calcuated using standard tools. The --discovery-token-ca-cert-hash flag
may be repeated multiple times to allow more than one public key.
-->

如果您使用共享令牌进行发现，则还应该传递 --discovery-token-ca-cert-hash 标志以验证由 Kubernetes Master 提供的根证书颁发机构（CA）的公钥。该标志的值为  “<hash-type>:<hex-encoded-value>”，其中支持的哈希类型是 “sha256”。哈希是在 Subject Public Key Info（SPKI）对象的字节上计算的（如RFC7469中所述）。该值在 “kubeadm init” 的输出中生效，或者可以使用标准工具进行计算。--discovery-token-ca-cert-hash 标志可以重复使用以验证多个公钥。

<!--
If you cannot know the CA public key hash ahead of time, you can pass
the --discovery-token-unsafe-skip-ca-verification flag to disable this
verification. This weakens the kubeadm security model since other nodes
can potentially impersonate the Kubernetes Master.
-->

如果您无法提前知道 CA 公钥哈希值，您可以传递 --discovery-token-unsafe-skip-ca-verification 标志来禁用此验证。这减弱了 kubeadm 安全模型，因为其他节点可能模仿 Kubernetes Master。

<!--
The TLS bootstrap mechanism is also driven via a shared token. This is
used to temporarily authenticate with the Kubernetes Master to submit a
certificate signing request (CSR) for a locally created key pair. By
default, kubeadm will set up the Kubernetes Master to automatically
approve these signing requests. This token is passed in with the
--tls-bootstrap-token abcdef.1234567890abcdef flag.
-->

TLS 引导机制也是通过共享令牌驱动的。通过在本地创建的密钥对提交证书签名请求（CSR）的方式，临时向 Kubernetes Master 进行身份验证。默认，kubeadm 将设置 Kubernetes Master 自动批准这些签名请求。该令牌使用 --tls-bootstrap-token abcdef.1234567890abcdef 标志传入。

<!--
Often times the same token is used for both parts. In this case, the
--token flag can be used instead of specifying each token individually.
-->

通常情况下，这两步认证都使用相同的令牌。在这种情况下，可以使用 --token 标志来代替单独指定每个令牌。

<!--
```
kubeadm join [flags]
```

### Options

```
      --config string                                 Path to kubeadm config file.
      --cri-socket string                             Specify the CRI socket to connect to. (default "/var/run/dockershim.sock")
      --discovery-file string                         A file or url from which to load cluster information.
      --discovery-token string                        A token used to validate cluster information fetched from the master.
      --discovery-token-ca-cert-hash stringSlice      For token-based discovery, validate that the root CA public key matches this hash (format: "<type>:<value>").
      --discovery-token-unsafe-skip-ca-verification   For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.
      --feature-gates string                          A set of key=value pairs that describe feature gates for various features. Options are:
CoreDNS=true|false (ALPHA - default=false)
DynamicKubeletConfig=true|false (ALPHA - default=false)
HighAvailability=true|false (ALPHA - default=false)
SelfHosting=true|false (BETA - default=false)
StoreCertsInSecrets=true|false (ALPHA - default=false)
SupportIPVSProxyMode=true|false (ALPHA - default=false)
      --ignore-checks-errors stringSlice              A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      --node-name string                              Specify the node name.
      --tls-bootstrap-token string                    A token used for TLS bootstrapping.
      --token string                                  Use this token for both discovery-token and tls-bootstrap-token.
```
-->

```
kubeadm join [flags]
```


### Options

```
      --config string                                 kubeadm 配置文件路径。
      --cri-socket string                             指定连接的 CRI sock 路径。 （默认 "/var/run/dockershim.sock"）
      --discovery-file string                         加载集群信息的文件或 URL 地址。
      --discovery-token string                        令牌，用来验证从 master 获取到的集群信息。
      --discovery-token-ca-cert-hash stringSlice      针对基于令牌的发现模式，验证根 CA 公钥是否匹配哈希值 （格式: "<type>:<value>"）。
      --discovery-token-unsafe-skip-ca-verification   针对基于令牌的发现模式，允许在没有指定 --discovery-token-ca-cert-hash 时，加入集群。
      --feature-gates string                          一系列键值对，用来描述各种特性的功能开关。选项是：
    CoreDNS=true|false (ALPHA - default=false)
    DynamicKubeletConfig=true|false (ALPHA - default=false)
    HighAvailability=true|false (ALPHA - default=false)
    SelfHosting=true|false (BETA - default=false)
    StoreCertsInSecrets=true|false (ALPHA - default=false)
    SupportIPVSProxyMode=true|false (ALPHA - default=false)
      --ignore-checks-errors stringSlice              一个检查列表，其中的错误将被当作警告。例子：'IsPrivilegedUser,Swap'。值 'all' 表示忽略所有检查中的错误。
      --node-name string                              指定 node 节点名字。
      --tls-bootstrap-token string                    用来做 TLS 引导的令牌。
      --token string                                  该令牌可以用来代表 discovery-token 和 tls-bootstrap-token。
```
