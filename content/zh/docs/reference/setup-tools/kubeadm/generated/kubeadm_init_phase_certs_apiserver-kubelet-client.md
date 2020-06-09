
<!-- 
### Synopsis
-->

### 概要

<!--
Generate the certificate for the API server to connect to kubelet, and save them into apiserver-kubelet-client.cert and apiserver-kubelet-client.key files.
-->

生成供 API 服务器连接 kubelet 的证书，并将其保存到 apiserver-kubelet-client.cert 和 apiserver-kubelet-client.key 文件中。

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used.
-->

如果两个文件都已存在，则 kubeadm 将跳过生成步骤，使用现有文件。

<!--
Alpha Disclaimer: this command is currently alpha.
-->

Alpha 免责声明：此命令当前为 Alpha 功能。

```
kubeadm init phase certs apiserver-kubelet-client [flags]
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
<td colspan="2">
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path where to save and store the certificates.
-->
存储证书的路径。
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeadm configuration file.
-->
kubeadm 配置文件路径。
</td>
</tr>

<tr>
<td colspan="2">--csr-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to output the CSRs and private keys to
-->
输出 CSR 和私钥的路径
</td>
</tr>

<tr>
<td colspan="2">--csr-only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Create CSRs instead of generating certificates
-->
创建 CSR 而不是生成证书
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for apiserver-kubelet-client
-->
apiserver-kubelet-client 操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"
-->
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："stable-1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Choose a specific Kubernetes version for the control plane.
-->
为控制平面指定特定的 Kubernetes 版本。
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->

### 继承于父命令的选项

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[实验] 指向宿主机上的 '实际' 根文件系统的路径。
</td>
</tr>

</tbody>
</table>

