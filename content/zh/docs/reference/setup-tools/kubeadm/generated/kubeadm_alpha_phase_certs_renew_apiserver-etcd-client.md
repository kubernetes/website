
为 API 服务器生成用来访问 etcd 的客户端证书
<!--
Generates the client apiserver uses to access etcd
-->

<!--
### Synopsis
-->

### 概要

<!--
Renews the client apiserver uses to access etcd, and saves them into apiserver-etcd-client.cert and apiserver-etcd-client.key files. 
-->
更新客户端 API 服务器用于访问 etcd，并将其保存到 apiserver-etcd-client.cert 和 apiserver-etcd-client.key 中。
 

<!--
Extra attributes such as SANs will be based on the existing certificates, there is no need to resupply them.
-->
额外的属性如 SANs 将基于现有的证书，不需要重新提供它们。

```
kubeadm alpha phase certs renew apiserver-etcd-client [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径(警告：配置文件的使用是实验性的)</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
-->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">apiserver-etcd-client 的帮助信息</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for apiserver-etcd-client</td>
-->

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/admin.conf"</td>
    </tr>
<!--
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
-->

    <tr>
      <td colspan="2">--use-api</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">使用 Kubernetes 证书 API 更新证书</td>

    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Use the Kubernetes certificate API to renew certificates</td>
-->

  </tbody>
</table>


<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
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




