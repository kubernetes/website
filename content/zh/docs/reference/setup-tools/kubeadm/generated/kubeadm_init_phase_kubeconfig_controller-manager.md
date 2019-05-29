
<!-- Generates a kubeconfig file for the controller manager to use -->
为控制器管理器生成要使用的 kubeconfig 文件

<!-- ### Synopsis -->
### 概要


<!-- Generates the kubeconfig file for the controller manager to use and saves it to controller-manager.conf file -->
生成控制器管理器要使用的 kubeconfig ，并保存到 controller-manager.conf 文件中

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API Server will advertise it's listening on. Specify '0.0.0.0' to use the address of the default network interface.</td>
    </tr> -->
    <tr>
      <td colspan="2">--apiserver-advertise-address 字符串</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"> API Server 对外发布的当前监听地址。设置此值为 “0.0.0.0” 以使用默认网络接口的 IP 地址。</td>
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
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存和存储证书的路径。</td>
    </tr>

<!--     <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental.</td>
    </tr> -->
    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"> kubeadm 配置文件的路径。警告：配置文件的使用是实验性的。</td>
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

  </tbody>
</table>



<!-- ### Options inherited from parent commands -->
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



