
<!-- ### Synopsis -->
### 概要


<!-- Generate the kubeconfig file for the controller manager to use and save it to controller-manager.conf file  -->
生成控制器管理器要使用的 kubeconfig 文件，并保存到 controller-manager.conf 文件中。

```
kubeadm init phase kubeconfig controller-manager [flags]
```

<!-- ### Options -->
### 选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

<!--     <tr>
      <td colspan="2">--apiserver-advertise-address string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.</td>
    </tr> -->
    <tr>
      <td colspan="2">--apiserver-advertise-address 字符串</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API Server 通知正在监听的 IP 地址。如果没有设置，将使用默认的网络接口</td>
    </tr>

<!--     <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Port for the API Server to bind to.</td>
    </tr> -->
    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      默认值: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">要绑定到 API Server 的端口。</td>
    </tr>


<!--     <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save and store the certificates.</td>
    </tr> -->
    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存和存储证书的路径。</td>
    </tr>

<!--     <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm configuration file.</td>
    </tr> -->
    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径。</td>
    </tr>
    <tr>
      <td colspan="2">--control-plane-endpoint string</td>
    </tr>
<!--
    </tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify a stable IP address or DNS name for the control plane.</td>
    </tr>
-->

    </tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为控制平面指定一个稳定的 IP 地址或 DNS。</td>
    </tr>    

<!--     <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for controller-manager</td>
    </tr> -->
    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"> controller-manager 命令的帮助</td>
    </tr>

<!--     <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the kubeconfig file.</td>
    </tr> -->
    <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      默认值: "/etc/kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存 kubeconfig 的路径。</td>
    </tr>

<!--
    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"</td>
    </tr>    
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a specific Kubernetes version for the control plane.</td>
    </tr>
-->

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："stable-1"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为控制平面指定特定的 Kubernetes 版本。</td>
    </tr>



<-- ### Options inherited from parent commands -->

### 从父命令继承的选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

<!--     <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr> -->
    <tr>
      <td colspan="2">--rootfs 字符串</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 主机根文件系统的“真实”路径。</td>
    </tr>

  </tbody>
</table>

<!--
SEE ALSO
* [kubeadm init phase kubeconfig](kubeadm_init_phase_kubeconfig.md)     - Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file
-->

查看其他
* [kubeadm init phase kubeconfig](kubeadm_init_phase_kubeconfig.md)     - 生成创建控制平面所需的所有 kubeconfig 文件和管理 kubeconfig 文件



