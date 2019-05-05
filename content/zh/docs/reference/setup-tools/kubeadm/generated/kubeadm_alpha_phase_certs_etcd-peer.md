
为 etcd 节点生成相互通信的证书
<!--
Generates the credentials for etcd nodes to communicate with each other
-->

<!--
### Synopsis
-->

### 概要

<!--
Generates the credentials for etcd nodes to communicate with each other, and saves them into etcd/peer.cert and etcd/peer.key files.
-->
为 etcd 节点生成证书以便相互通信。并将这些证书保存到 etcd/peer.cert 和 etcd/peer.key 文件中。

<!--
Default SANs are localhost, 127.0.0.1, 127.0.0.1, ::1 
-->
默认 SAN 是 localhost、127.0.0.1 和 ::1

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used. 
-->
如果两个文件都已存在，kubeadm 将跳过生成步骤并使用现有文件。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha 阶段。

```
kubeadm alpha phase certs etcd-peer [flags]
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
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/pki"</td>
    </tr>
<!--
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">证书的保存路径</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the certificates</td>
-->

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径（警告：配置文件的使用是实验性的）</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
-->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">etcd-peer 的帮助信息</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for etcd-peer</td>
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



