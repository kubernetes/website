
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
```
preflight                  Run pre-flight checks
kubelet-start              Write kubelet settings and (re)start the kubelet
certs                      Certificate generation
  /ca                        Generate the self-signed Kubernetes CA to provision identities for other Kubernetes components
  /apiserver                 Generate the certificate for serving the Kubernetes API
  /apiserver-kubelet-client  Generate the certificate for the API server to connect to kubelet
  /front-proxy-ca            Generate the self-signed CA to provision identities for front proxy
  /front-proxy-client        Generate the certificate for the front proxy client
  /etcd-ca                   Generate the self-signed CA to provision identities for etcd
  /etcd-server               Generate the certificate for serving etcd
  /etcd-peer                 Generate the certificate for etcd nodes to communicate with each other
  /etcd-healthcheck-client   Generate the certificate for liveness probes to healthcheck etcd
  /apiserver-etcd-client     Generate the certificate the apiserver uses to access etcd
  /sa                        Generate a private key for signing service account tokens along with its public key
kubeconfig                 Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file
  /admin                     Generate a kubeconfig file for the admin to use and for kubeadm itself
  /kubelet                   Generate a kubeconfig file for the kubelet to use *only* for cluster bootstrapping purposes
  /controller-manager        Generate a kubeconfig file for the controller manager to use
  /scheduler                 Generate a kubeconfig file for the scheduler to use
control-plane              Generate all static Pod manifest files necessary to establish the control plane
  /apiserver                 Generates the kube-apiserver static Pod manifest
  /controller-manager        Generates the kube-controller-manager static Pod manifest
  /scheduler                 Generates the kube-scheduler static Pod manifest
etcd                       Generate static Pod manifest file for local etcd
  /local                     Generate the static Pod manifest file for a local, single-node local etcd instance
upload-config              Upload the kubeadm and kubelet configuration to a ConfigMap
  /kubeadm                   Upload the kubeadm ClusterConfiguration to a ConfigMap
  /kubelet                   Upload the kubelet component config to a ConfigMap
upload-certs               Upload certificates to kubeadm-certs
mark-control-plane         Mark a node as a control-plane
bootstrap-token            Generates bootstrap tokens used to join a node to a cluster
addon                      Install required addons for passing Conformance tests
  /coredns                   Install the CoreDNS addon to a Kubernetes cluster
  /kube-proxy                Install the kube-proxy addon to a Kubernetes cluster
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
       API 服务器所公布的其正在监听的 IP 地址。如果未设置，则使用默认网络接口。
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
       API 服务器绑定的端口。
      </td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-cert-extra-sans stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.
      -->
      用于 API Server 服务证书的可选附加主题备用名称（SAN）。可以是 IP 地址和 DNS 名称。
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
      保存和存储证书的路径。
      </td>
    </tr>

    <tr>
      <td colspan="2">--certificate-key string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Key used to encrypt the control-plane certificates in the kubeadm-certs Secret.
      -->
      用于加密 kubeadm-certs Secret 中的控制平面证书的密钥。
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
       kubeadm 配置文件的路径。
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
      为控制平面指定一个稳定的 IP 地址或 DNS 名称。
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
      要连接的 CRI 套接字的路径。如果为空，则 kubeadm 将尝试自动检测此值；仅当安装了多个 CRI 或具有非标准 CRI 插槽时，才使用此选项。
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
      不要应用任何更改；只是输出将要执行的操作。
      </td>
    </tr>

    <tr>
      <td colspan="2">-k, --experimental-kustomize string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The path where kustomize patches for static pod manifests are stored.
      -->
      用于存储 kustomize 为静态 pod 清单所提供的补丁的路径。
      </td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      A set of key=value pairs that describe feature gates for various features. Options are:<br/>IPv6DualStack=true|false (ALPHA - default=false)
      -->
      一组用来描述各种功能特性的键值（key=value）对。选项是：<br/>IPv6DualStack=true|false (ALPHA - default=false)
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
      init 操作的帮助命令
      </td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      -->
      错误将显示为警告的检查列表；例如：'IsPrivilegedUser,Swap'。取值为 'all' 时将忽略检查中的所有错误。
      </td>
    </tr>

    <tr>
      <td colspan="2">
      <!--
      --image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "k8s.gcr.io"
      -->
      --image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："k8s.gcr.io"
      </td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Choose a container registry to pull control plane images from
      -->
      选择用于拉取控制平面镜像的容器仓库
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
      为控制平面选择一个特定的 Kubernetes 版本。
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
      指定节点的名称。
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
      指明 pod 网络可以使用的 IP 地址段。如果设置了这个参数，控制平面将会为每一个节点自动分配 CIDRs。
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
      为服务的虚拟 IP 地址另外指定 IP 地址段
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
      Use alternative domain for services, e.g. "myorg.internal".
      -->
      为服务另外指定域名，例如："myorg.internal"。
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
      不要打印用于加密控制平面证书的密钥。
      </td>
    </tr>

    <tr>
      <td colspan="2">--skip-phases stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      List of phases to be skipped
      -->
      要跳过的阶段列表
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
      跳过打印 'kubeadm init' 生成的默认引导令牌。
      </td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The token to use for establishing bidirectional trust between nodes and control-plane nodes. The format is [a-z0-9]{6}\.[a-z0-9]{16} - e.g. abcdef.0123456789abcdef
      -->
      这个令牌用于建立控制平面节点与工作节点间的双向通信。格式为 [a-z0-9]{6}\.[a-z0-9]{16} - 示例：abcdef.0123456789abcdef
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
      令牌被自动删除之前的持续时间（例如 1 s，2 m，3 h）。如果设置为 '0'，则令牌将永不过期
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
      将控制平面证书上传到 kubeadm-certs Secret。
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
      [实验] 到 '真实' 主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>

