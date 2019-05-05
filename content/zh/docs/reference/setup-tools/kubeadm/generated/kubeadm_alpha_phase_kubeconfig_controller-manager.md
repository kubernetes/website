
生成一个 kubeconfig 文件供控制器管理器使用
<!--
Generates a kubeconfig file for the controller manager to use
-->

<!--
### Synopsis
-->

### 概要

<!--
Generates the kubeconfig file for the controller manager to use and saves it to /etc/kubernetes/controller-manager.conf file. 
-->
生成一个 kubeconfig 文件供控制器管理器使用，并将其保存到 /etc/kubernetes/controller-manager.conf 文件中。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha 阶段。

```
kubeadm alpha phase kubeconfig controller-manager [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">可用来访问 API 服务器的 IP 地址/td>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">可用来访问 API 服务器的端口号</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port the API server is accessible on</td>
-->

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/pki"</td>
    </tr>
<!--
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
-->

    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">存储证书的路径</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where certificates are stored</td>
-->

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径（警告: 配置文件的使用是实验性的）</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental</td>
-->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">controller-manager 的帮助信息</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for controller-manager</td>
-->

    <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes"</td>
    </tr>
<!--
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td>
-->

    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存 kubeconfig 文件的路径</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the kubeconfig file</td>
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



