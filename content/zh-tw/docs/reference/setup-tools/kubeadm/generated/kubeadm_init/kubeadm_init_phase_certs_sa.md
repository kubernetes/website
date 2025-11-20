<!--
### Synopsis
-->
### 概要

<!--
Generate the private key for signing service account tokens along with its public key, and save them into sa.key and sa.pub files.
-->
生成用來簽署服務賬號令牌的私鑰及其公鑰，並將其保存到 `sa.key` 和
`sa.pub` 檔案中。

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used.
-->
如果兩個檔案都已存在，則 kubeadm 會跳過生成步驟，而將使用現有檔案。

```shell
kubeadm init phase certs sa [flags]
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
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path where to save and store the certificates.
-->
保存和儲存證書的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td>
</td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for sa
-->
sa 操作的幫助命令。
</p>
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
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 到 '真實' 主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
