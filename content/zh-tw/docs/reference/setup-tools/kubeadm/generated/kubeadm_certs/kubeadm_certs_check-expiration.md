<!-- 
Check certificates expiration for a Kubernetes cluster 
-->
爲一個 Kubernetes 叢集檢查證書的到期時間。

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
<td colspan="2">
<!--
--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
-->
--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值：true
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果爲 true，忽略模板中缺少某字段或映射鍵的錯誤。僅適用於 golang 和 jsonpath 輸出格式。
</p>
</td>
</tr>

<tr>
<!--
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td> 
-->
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/pki"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>The path where to save the certificates</p> 
-->
<p>保存證書的路徑。</p>
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
<p>到 kubeadm 設定檔案的路徑。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
-o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text"
-->
-o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："text"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Output format. One of: text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
-->
輸出格式。可選值爲：
text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file。
</p>
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
<p>check-expiration 操作的幫助命令。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!-- 
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf" 
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設爲："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!-- 
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. 
-->
在和叢集連接時使用該 kubeconfig 檔案。
如果此標誌未被設置，那麼將會在一些標準的位置去搜索存在的 kubeconfig 檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果爲 true，在以 JSON 或 YAML 格式打印對象時保留 managedFields。
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
<!-- 
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[實驗] 到'真實'主機根檔案系統的路徑。</p>
</td>
</tr>

</tbody>
</table>
