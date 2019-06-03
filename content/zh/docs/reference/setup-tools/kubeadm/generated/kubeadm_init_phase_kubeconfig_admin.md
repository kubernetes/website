
<!-- Generates a kubeconfig file for the admin to use and for kubeadm itself -->
为admin生成一个kubeconfig文件，并用于kubeadm

<!-- ### Synopsis -->
### 概要


<!-- Generates the kubeconfig file for the admin and for kubeadm itself, and saves it to admin.conf file. -->
生成一个kubeconfig文件，用于admin和kubeadm, 保存为admin.conf

```
kubeadm init phase kubeconfig admin [flags]
```

<!-- ### Options -->
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
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API Server will advertise it's listening on. Specify '0.0.0.0' to use the address of the default network interface.</td> -->
         <td></td><td style="line-height: 130%; word-wrap: break-word;">API Server监听的IP地址. 默认使用 '0.0.0.0' </td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
<!--     <td></td><td style="line-height: 130%; word-wrap: break-word;">Port for the API Server to bind to.</td>
-->      <td></td><td style="line-height: 130%; word-wrap: break-word;">绑定到的API服务器的端口</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save and store the certificates.</td>
 -->      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存证书的路径</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental.</td>
 -->      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeconfig文件的路径. 注意: 配置文件的使用是实验性的.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">help for admin</td>
 -->      <td></td><td style="line-height: 130%; word-wrap: break-word;">帮助</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the kubeconfig file.</td>
 -->      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存kubeconfig文件的路径</td>
    </tr>

  </tbody>
</table>

<!-- ### Options inherited from parent commands-->
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
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
 -->      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] “真正的”主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>



