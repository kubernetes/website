
<!--
Generates the self-signed kubernetes CA to provision identities for other kuberenets components
-->
生成自签名 kubernetes 证书供其他 kuberenets 组件创建标识用

<!--
### Synopsis
-->

### 概要

<!--
Generates the self-signed kubernetes CA to provision identities for other kuberenets components, and saves them into ca.cert and ca.key files. 
-->
生成自签名 kubernetes 证书供其他 kuberenets 组件创建标识用，并将它们保存到 ca.cert 和 ca.key 中。

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used. 
-->
如果两个文件都已存在，kubeadm 将跳过生成步骤，并将使用现有文件。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
免责声明：此命令目前属于 alpha。

```
kubeadm alpha phase certs ca [flags]
```

<!--
### Options
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the certificates</td>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for ca</td>
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
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存证书的路径</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径(警告：配置文件的使用是实验性的)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">ca 的操作帮助信息</td>
    </tr>

  </tbody>
</table>


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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>


<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->
