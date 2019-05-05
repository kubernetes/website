
生成控制器管理器的静态 Pod 清单
<!--
Generates the controller-manager static Pod manifest
-->

### 概要

<!--
### Synopsis
-->

为控制器管理器生成静态 Pod 清单文件，并将其保存为 /etc/kubernetes/manifests/kube-controller-manager.yaml 。
<!--
Generates the static Pod manifest file for the controller-manager and saves it into /etc/kubernetes/manifests/kube-controller-manager.yaml file. 
-->

免责声明：此命令目前属于 alpha。
<!--
Alpha Disclaimer: this command is currently alpha.
-->

### 命令行选项

<!--
### Options
-->

<!--
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">The path where certificates are stored</td>

<td colspan="2">--config String</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of extra flags to pass to the Controller Manager or override default ones in form of &lt;flagname&gt;=&lt;value&gt;</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">help for controller-manager</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a specific Kubernetes version for the control plane</td>
-->

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">证书的保存路径</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径。警告：配置文件的使用是实验性的</td>
    </tr>

    <tr>
      <td colspan="2">--controller-manager-extra-args mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一组额外参数，传递给控制管理器或以 &lt;flagname&gt;=&lt;value&gt; 的格式覆写默认参数。</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">控制器管理器帮助</td>
    </tr>

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "stable-1"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为控制平面选择一个特定的 Kubernetes 版本</td>
    </tr>

    <tr>
      <td colspan="2">--pod-network-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Pod 网络的 IP 地址范围</td>
    </tr>

  </tbody>
</table>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The range of IP addresses used for the Pod network</td>
-->


### 从父命令继承的选项

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
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
    <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机 root 文件系统的路径。</td>
    </tr>

  </tbody>
</table>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->


