
为活跃性探针生成客户端证书以便对 etcd 执行健康检查
<!--
Generates the client certificate for liveness probes to healtcheck etcd
-->

<!--
### Synopsis
-->

### 概要

<!--
Generates the client certificate for liveness probes to healtcheck etcd, and saves them into etcd/healthcheck-client.cert and etcd/healthcheck-client.key files. 
-->
为活跃性探针生成客户端证书以便对 etcd 执行健康检查，并将它们保存到 etcd/healthcheck-client.cert 和 etcd/healthcheck-client.key 文件中。

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used. 
-->
如果两个文件都已存在，kubeadm 将跳过生成步骤并将使用现有文件。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha 阶段。

```
kubeadm alpha phase certs etcd-healthcheck-client [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径（警告：配置文件的使用是实验性的）</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
-->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">etcd-healthcheck-client 的帮助信息</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for etcd-healthcheck-client</td>
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



