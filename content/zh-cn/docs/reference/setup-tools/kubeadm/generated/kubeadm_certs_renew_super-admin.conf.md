<!--
Renew the certificate embedded in the kubeconfig file for the super-admin
-->
为 super-admin 对嵌入于 kubeconfig 文件中的证书续期。

<!--
### Synopsis
-->
### 概要

<!--
Renew the certificate embedded in the kubeconfig file for the super-admin.
-->
为 super-admin 对嵌入于 kubeconfig 文件中的证书续期。

<!--
Renewals run unconditionally, regardless of certificate expiration date; extra attributes such as SANs will be based on the existing file/certificates, there is no need to resupply them.
-->
续期操作将无条件进行，不论证书的到期日期是何时；诸如 SAN 之类的额外属性将基于现有文件/证书，无需重新提供。

<!--
Renewal by default tries to use the certificate authority in the local PKI managed by kubeadm; as alternative it is possible to use K8s certificate API for certificate renewal, or as a last option, to generate a CSR request.
-->
默认情况下，续期会尝试使用由 kubeadm 管理的本地 PKI 中的证书颁发机构；
作为替代方案，可以使用 K8s 证书 API 进行证书续期，或者作为最后的选项，生成一个 CSR 请求。

<!--
After renewal, in order to make changes effective, is required to restart control-plane components and eventually re-distribute the renewed certificate in case the file is used elsewhere.
-->
续期后，为了使更改生效，需要重启控制平面组件，并且如果该文件在其他地方使用，最终需要重新分发续期后的证书。

```
kubeadm certs renew super-admin.conf [flags]
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
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path where to save the certificates
-->
<p>保存证书的路径。</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeadm configuration file.
-->
<p>kubeadm 配置文件的路径。</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for super-admin.conf
-->
<p>super-admin.conf 的帮助信息。</p></td>
</tr>

<tr>
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>与集群通信时使用的 kubeconfig 文件。
如果未设置该参数，则可以在一组标准位置中搜索现有的 kubeconfig 文件。</p></td>
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
<p>[实验性功能] 指向‘真实’宿主根文件系统的路径。</p></td>
</tr>

</tbody>
</table>
