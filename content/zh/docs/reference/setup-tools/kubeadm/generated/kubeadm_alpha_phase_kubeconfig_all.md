<!--
Generates all kubeconfig files necessary to establish the control plane and the admin kubeconfig file
-->
生成建立控制平面所需的所有 kubeconfig 文件以及 admin kubconfig 文件

<!--
### Synopsis
-->
### 概要

<!--
Generates all kubeconfig files necessary to establish the control plane and the admin kubeconfig file. 
-->
生成建立控制平面所需的所有 kubeconfig 文件以及 admin kubconfig 文件。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令当前处于 alpha 阶段。

```
kubeadm alpha phase kubeconfig all [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
  # Generates all kubeconfig files, functionally equivalent to what generated
  # by kubeadm init.
  kubeadm alpha phase kubeconfig all
  
  # Generates all kubeconfig files using options read from a configuration file.
  kubeadm alpha phase kubeconfig all --config masterconfiguration.yaml
```
-->

```
  # 生成所有 kubeconfig 文件，功能上相当于 kubeadm init 生成的内容。
  kubeadm alpha phase kubeconfig all
  
  # 使用从配置文件中读取的选项来生成所有 kubeconfig 文件。
  kubeadm alpha phase kubeconfig all --config masterconfiguration.yaml
```

<!--
### Options
-->
### 选项

<!--
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API server is accessible on</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port the API server is accessible on</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where certificates are stored</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for all</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the kubeconfig file</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The node name that should be used for the kubelet client certificate</td>
    </tr>

  </tbody>
</table>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API 服务器可访问的 IP 地址。 </td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：6443</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API 服务器可访问的端口。</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存证书的路径。</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件路径。警告：配置文件的使用处于试验阶段。</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">all 的帮助信息。</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存 kubeconfig 文件的路径。</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于 kubelet 客户端证书的节点名称。</td>
    </tr>

  </tbody>
</table>


<!--
### Options inherited from parent commands
-->
### 从父命令继承的选项

<!--
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[试验] 到'真实'主机的根文件系统的路径。</td>
    </tr>

  </tbody>
</table>

