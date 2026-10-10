<!--
Generate keys and certificate signing requests
-->
生成密钥和证书签名请求。

<!--
### Synopsis
-->
### 概要

<!-- 
Generates keys and certificate signing requests (CSRs) for all the certificates required to run the control plane. This command also generates partial kubeconfig files with private key data in the  "users &gt; user &gt; client-key-data" field, and for each kubeconfig file an accompanying ".csr" file is created.
-->
为运行控制平面所需的所有证书生成密钥和证书签名请求（CSR）。该命令会生成部分 kubeconfig 文件，
其中 "users &gt; user &gt; client-key-data" 字段包含私钥数据，并为每个 kubeconfig
文件创建一个随附的 ".csr" 文件。

<!--  
This command is designed for use in [Kubeadm External CA Mode](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#external-ca-mode). It generates CSRs which you can then submit to your external certificate authority for signing.
-->
此命令设计用于 [Kubeadm 外部 CA 模式](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#external-ca-mode)。
它生成你可以提交给外部证书颁发机构进行签名的 CSR。

<!--  
The PEM encoded signed certificates should then be saved alongside the key files, using ".crt" as the file extension, or in the case of kubeconfig files, the PEM encoded signed certificate should be base64 encoded and added to the kubeconfig file in the "users &gt; user &gt; client-certificate-data" field.
-->
你需要使用 ".crt" 作为文件扩展名将 PEM 编码的签名证书与密钥文件一起保存。
或者，对于 kubeconfig 文件，PEM 编码的签名证书应使用 base64 编码，
并添加到 "users &gt; user &gt; client-certificate-data" 字段。

```
kubeadm certs generate-csr [flags]
```

<!--
### Examples
-->
### 示例

<!-- 
```
  # The following command will generate keys and CSRs for all control-plane certificates and kubeconfig files:
  kubeadm certs generate-csr --kubeconfig-dir /tmp/etc-k8s --cert-dir /tmp/etc-k8s/pki
```
-->
```shell
# 以下命令将为所有控制平面证书和 kubeconfig 文件生成密钥和 CSR：
kubeadm certs generate-csr --kubeconfig-dir /tmp/etc-k8s --cert-dir /tmp/etc-k8s/pki
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
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path where to save the certificates
-->
保存证书的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
到 kubeadm 配置文件的路径。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for generate-csr
-->
generate-csr 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
-kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"
-->
--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path where to save the kubeconfig file.
-->
保存 kubeconfig 文件的路径。
</p>
</td>
</tr>

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[实验] 到'真实'主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
