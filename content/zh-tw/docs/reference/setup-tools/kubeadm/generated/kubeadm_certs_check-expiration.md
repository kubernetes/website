<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

<!-- 
Check certificates expiration for a Kubernetes cluster 
-->
為一個 Kubernetes 叢集檢查證書的到期時間

<!--
### Synopsis
-->
### 概要

<!-- 
Checks expiration for the certificates in the local PKI managed by kubeadm.
-->
檢查 kubeadm 管理的本地 PKI 中證書的到期時間。

```
kubeadm certs check-expiration [flags]
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
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td> 
-->
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: "/etc/kubernetes/pki"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>The path where to save the certificates</p> 
-->
<p>儲存證書的路徑</p> 
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
<p>kubeadm 配置檔案的路徑</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>help for check-expiration</p> 
-->
<p>check-expiration 的幫助命令</p> 
</td>
</tr>

<tr>
<td colspan="2">
<!-- 
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf" 
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設為: "/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p> 
-->
<p>在和叢集連線時使用該 kubeconfig 檔案。
如果該標誌沒有設定，那麼將會在一些標準的位置去搜索存在的 kubeconfig 檔案。</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 繼承於父命令的選項 

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
<p>[實驗] 到'真實'主機根檔案系統的路徑。</p>
</td>
</tr>

</tbody>
</table>


