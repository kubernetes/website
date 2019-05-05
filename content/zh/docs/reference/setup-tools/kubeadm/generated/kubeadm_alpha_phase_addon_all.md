
<!--
Installs all addons to a Kubernetes cluster
-->
将所有插件安装到 Kubernetes 集群

<!--
### Synopsis
-->

### 概要

<!--
Installs the CoreDNS and the kube-proxy addons components via the API server. Please note that although the DNS server is deployed, it will not be scheduled until CNI is installed. 
-->
通过 API 服务器安装 CoreDNS 和 ku-proxy 组件。请注意，虽然已经部署了 DNS 服务器，但在安装 CNI 之前 DNS 服务器不能被调度运行。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha。

```
kubeadm alpha phase addon all [flags]
```

<!--
### Examples
-->

### 例子

<!--
  # Installs the CoreDNS and the kube-proxy addons components via the API server,
  # functionally equivalent to what installed by kubeadm init.
-->

```
  # 通过 API 服务器安装 CoreDNS 和 kube-proxy 插件，
  # 在功能上与 kubeadm init 安装的相同。
  
  kubeadm alpha phase selfhosting from-staticpods
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">可用来访问 API 服务器的 IP 地址</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API server is accessible on</td>
-->
    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： 6443</td>
    </tr>
<!--
<td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
-->

    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">可用来访问 API 服务器的端口</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The port the API server is accessible on</td>
-->
    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径（警告：配置文件的使用是实验性的）</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm config file. WARNING: Usage of a configuration file is experimental</td>
-->

    <tr>
      <td colspan="2">--feature-gates string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一组"key=value"偶对，用来描述多种功能特性的特性开关；可选项有：<br/>Auditing=true|false (ALPHA - 默认=false)<br/>CoreDNS=true|false (默认=true)<br/>DynamicKubeletConfig=true|false (BETA - 默认=false)</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for various features. Options are:<br/>Auditing=true|false (ALPHA - default=false)<br/>CoreDNS=true|false (default=true)<br/>DynamicKubeletConfig=true|false (BETA - default=false)</td>
-->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">all 的帮助信息</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for all</td>
-->
    <tr>
      <td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "k8s.gcr.io"</td>
    </tr>
<!--
<td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "k8s.gcr.io"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">选择容器仓库拉取控制平面镜像</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a container registry to pull control plane images from</td>
-->

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/admin.conf"</td>
    </tr>
<!--
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
-->

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "stable-1"</td>
    </tr>
<!--
<td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为控制平面选择特定的 Kubernetes 版本</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a specific Kubernetes version for the control plane</td>
-->

    <tr>
      <td colspan="2">--pod-network-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于 Pod 网络的 IP 地址范围</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The range of IP addresses used for the Pod network</td>
-->

    <tr>
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "10.96.0.0/12"</td>
    </tr>
<!--
<td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">服务 VIP 的 IP 范围</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The range of IP address used for service VIPs</td>
-->

    <tr>
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "cluster.local"</td>
    </tr>
<!--
<td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">服务的可选域</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Alternative domain for services</td>
-->

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->

  </tbody>
</table>




