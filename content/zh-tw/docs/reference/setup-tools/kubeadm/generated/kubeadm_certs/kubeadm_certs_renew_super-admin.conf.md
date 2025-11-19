<!--
### Synopsis
-->
### 概要

<!--
Renew the certificate embedded in the kubeconfig file for the super-admin.
-->
爲 super-admin 對嵌入於 kubeconfig 文件中的證書續期。

<!--
Renewals run unconditionally, regardless of certificate expiration date; extra attributes such as SANs will be based on the existing file/certificates, there is no need to resupply them.
-->
續期操作將無條件進行，不論證書的到期日期是何時；諸如 SAN
之類的額外屬性將基於現有文件/證書，無需重新提供。

<!--
Renewal by default tries to use the certificate authority in the local PKI managed by kubeadm; as alternative it is possible to use K8s certificate API for certificate renewal, or as a last option, to generate a CSR request.
-->
默認情況下，續訂會嘗試使用由 kubeadm 管理的本地 PKI 中的證書機構；
作爲替代方案，也可以使用 K8s certificate API 進行證書續訂，
或者（作爲最後一種選擇）生成 CSR 請求。

<!--
After renewal, in order to make changes effective, is required to restart control-plane components and eventually re-distribute the renewed certificate in case the file is used elsewhere.
-->
續期後，爲了使更改生效，需要重啓控制平面組件，並且如果該文件在其他地方使用，
最終需要重新分發續期後的證書。

```shell
kubeadm certs renew super-admin.conf [flags]
```

<!--
### Options
-->
### 選項

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
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/pki"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path where to save the certificates
-->
保存證書的路徑。
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
kubeadm 配置文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for super-admin.conf
-->
super-admin.conf 的幫助信息。
</p>
</td>
</tr>

<tr>
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
與集羣通信時使用的 kubeconfig 文件。
如果未設置該參數，則可以在一組標準位置中搜索現有的 kubeconfig 文件。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 從父命令繼承的選項

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
[實驗性功能] 指向‘真實’宿主根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
