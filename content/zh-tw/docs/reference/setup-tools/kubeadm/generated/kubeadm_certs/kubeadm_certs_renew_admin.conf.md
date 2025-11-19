<!--
### Synopsis
-->
### 概要

<!--
Renew the certificate embedded in the kubeconfig file for the admin to use and for kubeadm itself.
-->
續訂 kubeconfig 文件中嵌入的證書，供管理員和 kubeadm 自身使用。

<!--
Renewals run unconditionally, regardless of certificate expiration date; extra attributes such as SANs will be based on the existing file/certificates, there is no need to resupply them.
-->
無論證書的到期日期如何，續訂都是無條件進行的；SAN
等額外屬性將基於現有文件/證書，因此無需重新提供它們。

<!--
Renewal by default tries to use the certificate authority in the local PKI managed by kubeadm; as alternative it is possible to use K8s certificate API for certificate renewal, or as a last option, to generate a CSR request.
-->
默認情況下，續訂會嘗試使用由 kubeadm 管理的本地 PKI 中的證書機構；
作爲替代方案，也可以使用 K8s 證書 API 進行證書續訂，
或者（作爲最後一種選擇）生成 CSR 請求。

<!--
After renewal, in order to make changes effective, is is required to restart control-plane components and eventually re-distribute the renewed certificate in case the file is used elsewhere.
-->
續訂後，爲了使更改生效，需要重新啓動控制平面組件，並最終重新分發更新的證書，
以防證書文件在其他地方使用。

```shell
kubeadm certs renew admin.conf [flags]
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
<td colspan="2">
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/pki"
</td>
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
到 kubeadm 設定文件的路徑。
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
help for admin.conf
-->
admin.conf 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
與叢集通信時使用的 kubeconfig 文件。
如果未設置該參數，則可以在一組標準位置中搜索現有的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--use-api</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Use the Kubernetes certificate API to renew certificates
-->
使用 Kubernetes 證書 API 續訂證書。
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
[實驗] 到 '真實' 主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
