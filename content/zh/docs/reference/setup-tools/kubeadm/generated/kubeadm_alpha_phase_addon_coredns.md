
将 CoreDNS addon 安装到 Kubernetes 集群

### Synopsis


通过 API 服务器安装 CoreDNS addon 组件。 请注意尽管部署了 DNS 服务器，但是在 CNI 被安装之前，它不会被调度。 

Alpha 免责声明：此命令目前是 alpha 阶段。

```
kubeadm alpha phase addon coredns [flags]
```

<!--

Installs the CoreDNS addon to a Kubernetes cluster

### Synopsis


Installs the CoreDNS addon components via the API server. Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase addon coredns [flags]
```
-->

### 可选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径。 警告: 配置文件的使用是实验性的。</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一组键=描述各个功能开关的键值对。 可选项有：<br/>Auditing=true|false (ALPHA - 默认=false)<br/>CoreDNS=true|false (默认=true)<br/>DynamicKubeletConfig=true|false (BETA - 默认=false)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">获取 coredns 帮助信息。</td>
    </tr>

    <tr>
      <td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "k8s.gcr.io"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">选择一个用于拉取控制平面镜像的容器镜像源。</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "stable-1"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为控制平面选择特定的 Kubernetes 版本。</td>
    </tr>

    <tr>
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "10.96.0.0/12"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">服务 VIP 的 IP 范围。</td>
    </tr>

    <tr>
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">服务替代域。</td>
    </tr>

  </tbody>
</table>

<!--
### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm config file. WARNING: Usage of a configuration file is experimental</td>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for coredns</td>
    </tr>

    <tr>
      <td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "k8s.gcr.io"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a container registry to pull control plane images from</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
    </tr>

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a specific Kubernetes version for the control plane</td>
    </tr>

    <tr>
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The range of IP address used for service VIPs</td>
    </tr>

    <tr>
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Alternative domain for services</td>
    </tr>

  </tbody>
</table>
-->

### 从父命令继承的可选项

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
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

