
首次使用 flags 参数创建群集内配置文件。
<!--
Create the in-cluster configuration file for the first time from using flags.
-->

### 概要

<!--
### Synopsis
-->


使用此命令，您可以使用与 'kubeadm init' 相同的配置文件将配置上传到集群中的 ConfigMap。
如果使用 v1.7.x 或更低版本的 kubeadm 客户端初始化集群并且使用 --config 选项，则需要在使用 'kubeadm upgrade' 升级到 v1.8 之前使用相同的配置文件运行此命令。
<!--
Using this command, you can upload configuration to the ConfigMap in the cluster using the same config file you gave to 'kubeadm init'.
If you initialized your cluster using a v1.7.x or lower kubeadm client and used the --config option, you need to run this command with the
same config file before upgrading to v1.8 using 'kubeadm upgrade'.
-->

该配置位于 "kube-system" 名称空间中的名为 "kubeadm-config" 的 ConfigMap 中。
<!--
The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap.
-->


```
kubeadm config upload from-file [flags]
```

### 选项

<!--
### Options
-->

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API Server will advertise it's listening on. Specify '0.0.0.0' to use the address of the default network interface.</td>
-->
<!--
<td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Port for the API Server to bind to.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save and store the certificates.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the CRI socket to connect to.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for various features. Options are:<br/></td>
-->
<!--
<td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default： 6443</td>
-->

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一个 IP 地址，API 服务器将宣告该 IP 地址正在监听。默认指定 '0.0.0.0' 用于网络接口的地址。</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于绑定 API 服务器的端口。</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-cert-extra-sans stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于 API 服务器服务证书的可选额外主题替代名称(SANs)。可以是 IP 地址和 DNS 名称。</td></td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存和存储证书的路径。</td>
    </tr>

    <tr>
      <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/var/run/dockershim.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指定要连接的 CRI 套接字。</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一组键=值对，用于描述各种特性的特性门。选项：<br/></td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">from-flags 帮助</td>
    </tr>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for from-flags</td>
-->

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "stable-1"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为控制平面选择一个特定的 Kubernetes 版本。</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指定节点名。</td>
    </tr>

    <tr>
      <td colspan="2">--pod-network-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指定 pod 网络的 IP 地址范围。如果设置，控制平面将自动为每个节点分配 CIDRs。</td>
    </tr>

    <tr>
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "10.96.0.0/12"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">使用可替代的 IP 地址范围进行服务。</td>
    </tr>

    <tr>
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "cluster.local"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为服务使用替代域名，例如： "myorg.internal"。</td>
    </tr>

  </tbody>
</table>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a specific Kubernetes version for the control plane.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the node name.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Use alternative range of IP address for service VIPs.</td>
-->
<!--
<td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default： "cluster.local"</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Use alternative domain for services, e.g. "myorg.internal".</td>
-->


### 继承于父命令的选项

<!--
### Options inherited from parent commands
-->

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->
