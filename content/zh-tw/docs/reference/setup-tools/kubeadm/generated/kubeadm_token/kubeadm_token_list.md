<!--
List bootstrap tokens on the server
-->
列出伺服器上的引導令牌。

<!--
### Synopsis
-->
### 概要

<!--
This command will list all bootstrap tokens for you.
-->
此命令將爲你列出所有的引導令牌。

```
kubeadm token list [flags]
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
<!-- --allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true -->
--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：true
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!-- 
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果設置爲 true，則在模板中缺少字段或哈希表的鍵時忽略模板中的任何錯誤。
僅適用於 golang 和 jsonpath 輸出格式。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!-- -o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text" -->
-o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："text"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--  
Output format. One of: text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
-->
輸出格式：text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file 其中之一
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
help for list
-->
list 操作的幫助命令。
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
如果爲 true，則在以 JSON 或 YAML 格式打印對象時保留 managedFields。
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
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Whether to enable dry-run mode or not
-->
是否啓用 `dry-run` 模式。
</p>
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
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
用於和叢集通信的 kubeconfig 文件。如果它沒有被設置，那麼 kubeadm 將會搜索一個已經存在於標準路徑的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真實”主機根文件系統的路徑。這將導致 kubeadm 切換到所提供的路徑。
</p>
</td>
</tr>

</tbody>
</table>
