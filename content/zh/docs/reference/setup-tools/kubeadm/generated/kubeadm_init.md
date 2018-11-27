
<!-- Run this command in order to set up the Kubernetes master. -->
运行这个命令来搭建Kubernetes master节点

<!-- ### Synopsis -->
### 简介


<!-- Run this command in order to set up the Kubernetes master. -->
运行这个命令来搭建Kubernetes主节点。

```
kubeadm init [flags]
```

<!-- ### Options -->
### 参数可选项

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
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API Server will advertise it's listening on. Specify '0.0.0.0' to use the address of the default network interface.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API Server将要广播的监听地址。如指定为 `0.0.0.0` 将使用缺省的网卡地址。</td>
    </tr>

    <tr>
      <!-- <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td> -->
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缺省值: 6443</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Port for the API Server to bind to.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API Server绑定的端口</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-cert-extra-sans stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">可选的额外提供的证书主题别名（SANs）用于指定API Server的服务器证书。可以是IP地址也可以是DNS名称。</td>
    </tr>

    <tr>
      <!-- <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td> -->
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缺省值: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save and store the certificates.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">证书的存储路径。</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm配置文件的路径。警告：配置文件的功能是实验性的。</td>
    </tr>

    <tr>
      <!-- <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/dockershim.sock"</td> -->
      <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缺省值: "/var/run/dockershim.sock"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the CRI socket to connect to.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指明要连接的CRI socket文件</td>
    </tr>

    <tr>
      <td colspan="2">--dry-run</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Don't apply any changes; just output what would be done.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">不会应用任何改变；只会输出将要执行的操作。</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for various features. Options are:<br/>Auditing=true|false (ALPHA - default=false)<br/>CoreDNS=true|false (default=true)<br/>DynamicKubeletConfig=true|false (BETA - default=false)</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">键值对的集合，用来控制各种功能的开关。可选项有:<br/>Auditing=true|false (当前为ALPHA状态 - 缺省值=false)<br/>CoreDNS=true|false (缺省值=true)<br/>DynamicKubeletConfig=true|false (当前为BETA状态 - 缺省值=false)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">help for init</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">获取init命令的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">忽视检查项错误列表，列表中的每一个检查项如发生错误将被展示输出为警告，而非错误。 例如: 'IsPrivilegedUser,Swap'. 如填写为 'all' 则将忽视所有的检查项错误。</td>
    </tr>

    <tr>
      <!-- <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"</td> -->
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缺省值: "stable-1"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a specific Kubernetes version for the control plane.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为control plane选择一个特定的Kubernetes版本。</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the node name.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指定节点的名称。</td>
    </tr>

    <tr>
      <td colspan="2">--pod-network-cidr string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指明pod网络可以使用的IP地址段。 如果设置了这个参数，control plane将会为每一个节点自动分配CIDRs。</td>
    </tr>

    <tr>
      <!-- <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"</td> -->
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缺省值: "10.96.0.0/12"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Use alternative range of IP address for service VIPs.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为service的虚拟IP地址另外指定IP地址段</td>
    </tr>

    <tr>
      <!-- <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"</td> -->
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缺省值: "cluster.local"</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Use alternative domain for services, e.g. "myorg.internal".</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为services另外指定域名, 例如： "myorg.internal".</td>
    </tr>

    <tr>
      <td colspan="2">--skip-token-print</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">Skip printing of the default bootstrap token generated by 'kubeadm init'.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">不打印出由 `kubeadm init` 命令生成的默认令牌。</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The token to use for establishing bidirectional trust between nodes and masters. The format is [a-z0-9]{6}\.[a-z0-9]{16} - e.g. abcdef.0123456789abcdef</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">这个令牌用于建立主从节点间的双向受信链接。格式为 [a-z0-9]{6}\.[a-z0-9]{16} - 示例： abcdef.0123456789abcdef</td>
    </tr>

    <tr>
      <!-- <td colspan="2">--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s</td> -->
      <td colspan="2">--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缺省值: 24h0m0s</td>
    </tr>
    <tr>
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">令牌被自动删除前的可用时长 (示例： 1s, 2m, 3h). 如果设置为 '0', 令牌将永不过期。</td>
    </tr>

  </tbody>
</table>



### 从父命令继承的选项参数

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
      <!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td> -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验性的功能] 相对“真实”宿主机根目录的路径。</td>
    </tr>

  </tbody>
</table>



