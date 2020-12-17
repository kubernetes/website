
<!--
### Synopsis
-->
### 概要

<!--
Renew the certificate for serving the Kubernetes API.
-->
续订用于提供 Kubernetes API 的证书。

<!--
Renewals run unconditionally, regardless of certificate expiration date; extra attributes such as SANs will be based on the existing file/certificates, there is no need to resupply them.
-->

无论证书的到期日期如何，续订都会无条件地进行；SAN 等额外属性将基于现有文件/证书，因此无需重新提供它们。

<!--
Renewal by default tries to use the certificate authority in the local PKI managed by kubeadm; as alternative it is possible to use K8s certificate API for certificate renewal, or as a last option, to generate a CSR request.
-->
默认情况下，续订尝试在 kubeadm 管理的本地 PKI 中使用证书颁发机构；作为替代方案，
可以使用 K8s 证书 API 进行证书更新，或者作为最后一个选择来生成 CSR 请求。

<!--
After renewal, in order to make changes effective, is is required to restart control-plane components and eventually re-distribute the renewed certificate in case the file is used elsewhere.
-->
续订后，为了使更改生效，需要重新启动控制平面组件，并最终重新分发更新的证书，以防文件在其他地方使用。

```
kubeadm certs renew apiserver [flags]
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
The path where to save the certificates.
-->
保存证书的路径。
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
kubeadm 配置文件的路径。
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
CSR 和私钥的输出路径
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
help for apiserver
-->
apiserver 子操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
与集群通信时使用的 kubeconfig 文件。
如果未设置该参数，则可以在一组标准位置中搜索现有的 kubeconfig 文件。
</td>
</tr>

<tr>
<td colspan="2">--use-api</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use the Kubernetes certificate API to renew certificates
-->
使用 Kubernetes 证书 API 续订证书
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
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[实验] 到 '真实' 主机根文件系统的路径。
</td>
</tr>

</tbody>
</table>

