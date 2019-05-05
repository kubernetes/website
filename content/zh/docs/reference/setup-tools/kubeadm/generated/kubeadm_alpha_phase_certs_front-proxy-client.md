
为前端代理生成客户端
<!--
Generates the client for the front proxy
-->

<!--
### Synopsis
-->

### 概要

<!--
Generates the client for the front proxy, and saves them into front-proxy-client.cert and front-proxy-client.key files. 
-->
为前端代理生成客户端，并将其保存到 front-proxy-client.cert 和 front-proxy-client.key 文件中。

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used. 
-->
如果两个文件都已存在，kubeadm 将跳过生成步骤，并将使用现有文件。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令当前处于 alpha 阶段。

```
kubeadm alpha phase certs front-proxy-client [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径（警告：配置文件的使用处于试验阶段）</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
-->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">front-proxy-client 的帮助信息</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for front-proxy-client</td>
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



