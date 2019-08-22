
<!--
Generates the certificate for serving etcd
-->
生成服务 etcd 的证书

<!--
### Synopsis
-->

### 概要

<!--
Generates the certificate for serving etcd, and saves them into etcd/server.cert and etcd/server.key files.
-->
生成服务 etcd 的证书，并将它们保存到 etcd/server.cert 和 etcd/server.key 中。

<!--
Default SANs are localhost, 127.0.0.1, ::1 
-->
默认 SANs 是本机 127.0.0.1, ::1

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used. 
-->
如果两个文件都已存在，kubeadm 将跳过生成步骤，并将使用现有文件。

Alpha 免责声明：此命令属于 alpha。
<!--
Alpha Disclaimer: this command is currently alpha.
-->

```
kubeadm alpha phase certs etcd-server [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存证书的路径</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the certificates</td>
-->

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件存储路径(警告: 配置文件使用是实验性的)</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
-->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">etcd-server 的帮助信息</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for etcd-server</td>
-->

  </tbody>
</table>


<!--
### Options inherited from parent commands
-->
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
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

  </tbody>
</table>




