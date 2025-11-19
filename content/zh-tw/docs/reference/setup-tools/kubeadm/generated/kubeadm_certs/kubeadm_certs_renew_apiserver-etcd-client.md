<!-- 
Renew the certificate the apiserver uses to access etcd 
-->
續訂 apiserver 用於訪問 etcd 的證書。

<!-- 
### Synopsis
-->
### 概要

<!--
Renew the certificate the apiserver uses to access etcd.
-->
續訂 apiserver 用於訪問 etcd 的證書。

<!--
Renewals run unconditionally, regardless of certificate expiration date; extra attributes such as SANs will be based on the existing file/certificates, there is no need to resupply them.
-->
無論證書的到期日期如何，續訂都會無條件地進行；SAN 等額外屬性將基於現有文件/證書，因此無需重新提供它們。

<!--
Renewal by default tries to use the certificate authority in the local PKI managed by kubeadm; as alternative it is possible to use K8s certificate API for certificate renewal, or as a last option, to generate a CSR request.
-->
默認情況下，續訂嘗試使用在 kubeadm 所管理的本地 PKI 中的證書頒發機構；作爲替代方案，
可以使用 K8s 證書 API 進行證書更新，或者作爲最後一個選擇來生成 CSR 請求。

<!--
After renewal, in order to make changes effective, is is required to restart control-plane components and eventually re-distribute the renewed certificate in case the file is used elsewhere.
-->
續訂後，爲了使更改生效，需要重新啓動控制平面組件，並最終重新分發更新的證書，以防文件在其他地方使用。

```
kubeadm certs renew apiserver-etcd-client [flags]
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
cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>The path where to save and store the certificates.</p>
-->
<p>存儲證書的路徑。</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>Path to a kubeadm configuration file.</p>  
-->
<p>kubeadm 配置文件的路徑。</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>help for apiserver-etcd-client</p>
-->
<p>apiserver-etcd-client 操作的幫助命令。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p>
-->
<p>與集羣通信時使用的 kubeconfig 文件。
如果未設置該參數，則可以在一組標準位置中搜索現有的 kubeconfig 文件。</p>
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
<!-- 
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[實驗] 到 '真實' 主機根文件系統的路徑。</p>
</td>
</tr>

</tbody>
</table>
